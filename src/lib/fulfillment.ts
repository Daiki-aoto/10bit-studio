/**
 * 決済完了後の処理（Webhook からだけ呼ぶ）。
 *
 * - 注文の記録先：Stripe（ダッシュボードの「支払い」に、明細・購入者・配送先・注文番号が残る）
 * - 二重処理の防止：処理済みの印を PaymentIntent の metadata（fulfilled_at）に書き、2回目以降は何もしない
 * - 注文確認メール：Stripe の自動領収書メール（ダッシュボードで有効化）。独自メールにするときは notify() を差し替える
 *
 * 自前のデータベースに移すときは、recordOrder() の中身だけを置き換えればよい。
 */
import 'server-only';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';
import { orderNumber } from '@/lib/order';

export interface OrderRecord {
  orderNo: string;
  sessionId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  email: string | null;
  name: string | null;
  address: Stripe.Address | null;
  items: { name: string; quantity: number; amount: number }[];
  createdAt: string;
}

export type FulfillResult = 'fulfilled' | 'already' | 'unpaid';

export async function fulfillCheckout(sessionId: string): Promise<FulfillResult> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items', 'payment_intent'] });

  // 遅れて確定する支払い方法では、completed の時点では unpaid のことがある
  if (session.payment_status === 'unpaid') return 'unpaid';

  const pi = session.payment_intent as Stripe.PaymentIntent | null;
  if (!pi) return 'unpaid';
  if (pi.metadata?.fulfilled_at) return 'already';

  const record: OrderRecord = {
    orderNo: orderNumber(session.id, session.created),
    sessionId: session.id,
    paymentIntentId: pi.id,
    amount: session.amount_total ?? 0,
    currency: session.currency ?? 'jpy',
    email: session.customer_details?.email ?? null,
    name: session.collected_information?.shipping_details?.name ?? session.customer_details?.name ?? null,
    address: session.collected_information?.shipping_details?.address ?? session.customer_details?.address ?? null,
    items: (session.line_items?.data ?? []).map((l) => ({ name: l.description ?? '', quantity: l.quantity ?? 0, amount: l.amount_total })),
    createdAt: new Date(session.created * 1000).toISOString(),
  };

  await recordOrder(record, pi);
  await notify(record);
  return 'fulfilled';
}

/** 注文を記録する（現在は Stripe に「処理済み」と注文番号を書き込む） */
async function recordOrder(order: OrderRecord, pi: Stripe.PaymentIntent) {
  await getStripe().paymentIntents.update(pi.id, {
    metadata: { ...pi.metadata, order_no: order.orderNo, fulfilled_at: new Date().toISOString() },
    description: `ポストカード注文 ${order.orderNo}`,
  });
  console.info(`[order] ${order.orderNo} ${order.amount}${order.currency.toUpperCase()} ${order.items.map((i) => `${i.name}×${i.quantity}`).join(' / ')}`);
}

/** 注文確認の通知。現在は Stripe の自動領収書を使うため、ここでは何もしない（独自メールにするときに実装） */
async function notify(_order: OrderRecord) {}
