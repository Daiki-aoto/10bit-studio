/**
 * POST /api/stripe/webhook
 * Stripe からの通知。署名を検証してから、決済完了の処理（注文の記録）を行う。
 * 決済の完了はここだけで判断する（成功画面への遷移では判断しない）。
 */
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, getWebhookSecret, StripeConfigError } from '@/lib/stripe/server';
import { fulfillCheckout } from '@/lib/fulfillment';

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const payload = await req.text(); // 署名検証には加工前の本文が必要
    event = await getStripe().webhooks.constructEventAsync(payload, signature, getWebhookSecret());
  } catch (e) {
    if (e instanceof StripeConfigError) { console.error('[webhook] 設定エラー:', e.message); return NextResponse.json({ error: 'not configured' }, { status: 500 }); }
    console.warn('[webhook] 署名の検証に失敗しました');
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const result = await fulfillCheckout(event.data.object.id);
        console.info(`[webhook] ${event.type} ${event.data.object.id} → ${result}`);
        break;
      }
      case 'checkout.session.async_payment_failed':
        console.warn(`[webhook] 支払い失敗 ${event.data.object.id}`);
        break;
      default:
        break; // ほかのイベントは受け取るだけ
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    // 500 を返すと Stripe が自動で再送する（処理済みの印があるので二重にはならない）
    console.error('[webhook] 処理エラー:', e);
    return NextResponse.json({ error: 'fulfillment failed' }, { status: 500 });
  }
}
