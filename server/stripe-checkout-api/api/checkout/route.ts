/**
 * POST /api/checkout
 * カート（商品IDと数量）を受け取り、サーバーで金額を計算して Stripe Checkout の決済画面URLを返す。
 */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, siteUrl, StripeConfigError, INTEGRATION_ID } from '@/lib/stripe/server';
import { buildOrder, parseCart, OrderError } from '@/lib/order';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  let body: { cart?: unknown; requestId?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'リクエストの形式が正しくありません' }, { status: 400 }); }

  try {
    const lines = parseCart(body.cart);
    const order = buildOrder(lines);
    // 同じボタン押下の再送で決済が二重に作られないよう、ブラウザが作った ID を冪等キーにする
    const requestId = typeof body.requestId === 'string' && UUID.test(body.requestId) ? body.requestId : null;
    if (!requestId) return NextResponse.json({ error: 'リクエストIDが正しくありません' }, { status: 400 });

    const base = siteUrl();
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      currency: 'jpy',
      locale: 'ja',
      // payment_method_types は指定しない：カード・Apple Pay・Google Pay などはダッシュボードの設定で表示される
      line_items: order.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: 'jpy',
          unit_amount: l.unitAmount, // 円はそのままの整数（小数のない通貨）
          product_data: { name: l.name, ...(l.description ? { description: l.description } : {}) },
        },
      })),
      shipping_address_collection: { allowed_countries: ['JP'] },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      submit_type: 'pay',
      custom_text: {
        shipping_address: { message: '送料は含まれていません。発送方法・送料は確定後に別途ご案内します。' },
        submit: { message: 'お支払い完了後、ご登録のメールアドレスに領収書が届きます。' },
      },
      metadata: order.metadata,
      payment_intent_data: { metadata: order.metadata, description: 'ポストカード注文' },
      integration_identifier: INTEGRATION_ID,
      success_url: `${base}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cart/cancel`,
    }, { idempotencyKey: `checkout-${requestId}` });

    if (!session.url) throw new Error('Checkout URL がありません');
    return NextResponse.json({ url: session.url });
  } catch (e) {
    if (e instanceof OrderError) return NextResponse.json({ error: e.message }, { status: 400 });
    if (e instanceof StripeConfigError) {
      console.error('[checkout] 設定エラー:', e.message);
      return NextResponse.json({ error: '現在オンライン決済を準備中です' }, { status: 503 });
    }
    if (e instanceof Stripe.errors.StripeIdempotencyError) {
      return NextResponse.json({ error: 'カートの内容が変わりました。もう一度お試しください' }, { status: 409 });
    }
    console.error('[checkout] エラー:', e);
    return NextResponse.json({ error: '決済画面を開けませんでした。時間をおいて再度お試しください' }, { status: 502 });
  }
}
