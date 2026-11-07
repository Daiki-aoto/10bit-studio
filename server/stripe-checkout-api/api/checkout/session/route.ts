/**
 * GET /api/checkout/session?session_id=cs_...
 * 成功画面の表示用に、注文の状態と内容だけを返す（カード情報などは返さない）。
 * ここでは注文を確定しない。確定は Webhook が行う。
 */
import { NextResponse } from 'next/server';
import { getStripe, StripeConfigError } from '@/lib/stripe/server';
import { orderNumber } from '@/lib/order';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('session_id') ?? '';
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return NextResponse.json({ error: 'invalid session' }, { status: 400 });
  try {
    const s = await getStripe().checkout.sessions.retrieve(id, { expand: ['line_items', 'payment_intent'] });
    const pi = s.payment_intent && typeof s.payment_intent === 'object' ? s.payment_intent : null;
    return NextResponse.json({
      status: s.status,                    // open / complete / expired
      paymentStatus: s.payment_status,     // paid / unpaid / no_payment_required
      recorded: !!pi?.metadata?.fulfilled_at, // Webhook で記録済みか
      orderNo: orderNumber(s.id, s.created),
      amount: s.amount_total,
      email: s.customer_details?.email ?? null,
      items: (s.line_items?.data ?? []).map((l) => ({ name: l.description, quantity: l.quantity, amount: l.amount_total })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    if (e instanceof StripeConfigError) return NextResponse.json({ error: 'not configured' }, { status: 503 });
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
