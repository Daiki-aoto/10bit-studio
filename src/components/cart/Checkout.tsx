'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CircleAlert, Loader2, Lock, ShoppingBag, Trash2 } from 'lucide-react';
import { getPostcard, postcards, SET_ID } from '@/data/postcards';
import { postcardPrice, shipping, payment, returns } from '@/data/pricing';
import { DEMO_MODE, PAYMENTS } from '@/data/site';
import { nextBundleHint, yen, type CartSummary } from '@/lib/pricing';
import { rules, validate } from '@/lib/validation';
import { submit } from '@/lib/submit';
import { btn, TbdBadge } from '@/components/ui/primitives';
import { QuantityStepper } from '@/components/postcards/QuantityStepper';
import { Checkbox, ConfirmList, Steps, TextArea, TextField, focusFirstError } from '@/components/forms/fields';
import { Done } from '@/components/forms/Done';
import { useCart } from './CartProvider';

type Info = { name: string; kana: string; email: string; tel: string; zip: string; address: string; notes: string };
const emptyInfo: Info = { name: '', kana: '', email: '', tel: '', zip: '', address: '', notes: '' };
const schema = {
  name: [rules.required('お名前')], kana: [rules.kana], email: [rules.email], tel: [rules.tel],
  zip: [rules.zip], address: [rules.required('住所')], notes: [rules.maxLen('備考', 1000)],
};

function lineInfo(id: string) {
  if (id === SET_ID) return { name: '全10種類セット', sub: '10種類を各1枚', price: postcardPrice.setAll, href: '/postcards/set', image: null };
  const c = getPostcard(id);
  if (!c) return null;
  return { name: `No.${c.no}『${c.title}』`, sub: 'ポストカード 1枚', price: postcardPrice.single, href: `/postcards/${c.id}`, image: c.image };
}

function Totals({ s, compact = false }: { s: CartSummary; compact?: boolean }) {
  return (
    <dl className="grid gap-2 text-sm">
      {s.singleCount > 0 && (
        <div className="flex justify-between"><dt>ポストカード {s.singleCount}枚</dt><dd>{yen(s.singleCount * postcardPrice.single)}</dd></div>
      )}
      {s.discount > 0 && (
        <div className="flex justify-between text-sea-deep"><dt>3枚セット価格 適用（×{s.bundles}）</dt><dd>−{yen(s.discount)}</dd></div>
      )}
      {s.setCount > 0 && (
        <div className="flex justify-between"><dt>全10種類セット ×{s.setCount}</dt><dd>{yen(s.setTotal)}</dd></div>
      )}
      <div className="flex justify-between border-t border-line pt-3 font-medium"><dt>商品小計</dt><dd>{yen(s.subtotal)}</dd></div>
      <div className="flex items-center justify-between"><dt className="flex items-center gap-2">送料{s.shippingFee === null && <TbdBadge />}</dt><dd className={s.shippingFee === null ? 'text-ink-2' : ''}>{s.shippingFee === null ? '確定後にご案内' : yen(s.shippingFee)}</dd></div>
      <div className={`flex items-baseline justify-between border-t border-charcoal pt-3 ${compact ? '' : 'mt-1'}`}>
        <dt>お支払い合計</dt>
        <dd className="text-right">
          <span className="font-latin text-3xl font-semibold">{s.total === null ? yen(s.subtotal) : yen(s.total)}</span>
          {s.total === null && <span className="block text-[12px] text-ink-3">＋送料（未確定）</span>}
        </dd>
      </div>
    </dl>
  );
}

export function Checkout() {
  const { lines, summary, ready, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [info, setInfo] = useState<Info>(emptyInfo);
  const [errors, setErrors] = useState<Partial<Record<keyof Info, string>>>({});
  const [agree, setAgree] = useState(false);
  const [agreeErr, setAgreeErr] = useState('');
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState('');
  const [done, setDone] = useState<{ id: string; summary: CartSummary; name: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const goTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const stripe = PAYMENTS === 'stripe';
  // 決済画面を作るリクエストの ID（二重送信防止）。カートが変わったら作り直す
  const requestId = useRef('');
  useEffect(() => { requestId.current = crypto.randomUUID(); }, [lines]);
  // Stripe の画面から「戻る」で帰ってきたとき、ボタンを押せる状態に戻す
  useEffect(() => {
    const on = (e: PageTransitionEvent) => { if (e.persisted) setSending(false); };
    window.addEventListener('pageshow', on);
    return () => window.removeEventListener('pageshow', on);
  }, []);
  const stepLabels = stripe ? ['カート', '確認', 'お支払い', '完了'] : ['カート', 'お客様情報', '確認', '完了'];
  const stepIndex = stripe ? (step === 2 ? 1 : step) : step;

  const ids = Object.keys(lines).filter((id) => lines[id] > 0 && lineInfo(id));
  const hint = nextBundleHint(summary.singleCount);

  const set = (k: keyof Info) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInfo((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validate({ ...info, [k]: val }, { [k]: schema[k] })[k] }));
  };
  const blur = (k: keyof Info) => () => setErrors((er) => ({ ...er, [k]: validate(info, { [k]: schema[k] })[k] }));

  if (!ready) return <p className="py-20 text-center text-ink-3">読み込み中…</p>;

  if (step === 3 && done) {
    return (
      <div ref={topRef} className="scroll-mt-24">
        <Steps steps={['カート', 'お客様情報', '確認', '完了']} current={3} />
        <Done id={done.id} title="ご注文を受け付けました" kind="注文番号"
          lines={[`${done.name} 様、ありがとうございます。`, 'お支払い方法が確定次第、メールでご案内する想定です。']}>
          <div className="w-full rounded-lg border border-line p-5 text-left"><Totals s={done.summary} compact /></div>
          <p className="text-[13px] text-ink-3">デモのため、注文は確定しておらず、商品は発送されません。</p>
        </Done>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="grid justify-items-center gap-6 py-20 text-center">
        <ShoppingBag className="size-12 text-ink-3" strokeWidth={1} aria-hidden />
        <p className="mincho text-xl">カートは空です</p>
        <p className="text-sm text-ink-2">全10種類のポストカードから、お好きな絵柄を選んでください。</p>
        <Link href="/postcards" className={btn('primary')}>ポストカードを見る</Link>
      </div>
    );
  }

  const toConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(info, schema);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) { requestAnimationFrame(() => focusFirstError(formRef.current)); return; }
    setStep(2); goTop();
  };

  /** Stripe の決済画面へ（金額はサーバーで計算し直す） */
  const payWithStripe = async () => {
    setSending(true); setSendErr('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: lines, requestId: requestId.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? '決済画面を開けませんでした');
      window.location.assign(data.url); // ボタンは押せないまま移動する
    } catch (e) {
      setSendErr(e instanceof Error ? e.message : '決済画面を開けませんでした');
      requestId.current = crypto.randomUUID();
      setSending(false);
    }
  };

  const order = async () => {
    if (!agree) { setAgreeErr('内容の確認にチェックしてください'); return; }
    if (stripe) return payWithStripe();
    setSending(true); setSendErr('');
    // 将来: Stripe Checkout へ（lib/submit.ts の中身を差し替える）
    const res = await submit('order', { lines, summary, info, shippingMethod: shipping.methods[0].id });
    setSending(false);
    if (!res.ok) { setSendErr(res.message); return; }
    setDone({ id: res.id, summary, name: info.name });
    clear();
    setStep(3); goTop();
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      <Steps steps={stepLabels} current={stepIndex} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
        <div className="min-w-0">
          {/* STEP 0: カート */}
          {step === 0 && (
            <>
              <ul className="border-t border-charcoal">
                {ids.map((id) => {
                  const li = lineInfo(id)!;
                  const q = lines[id];
                  return (
                    <li key={id} className="grid grid-cols-[88px_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:gap-6">
                      <Link href={li.href} className="block">
                        {li.image
                          ? <Image src={li.image} alt="" sizes="120px" className="h-auto w-full shadow-sm" />
                          : <div className="grid grid-cols-5 gap-0.5">{postcards.map((c) => <Image key={c.id} src={c.image} alt="" sizes="24px" className="h-auto w-full" />)}</div>}
                      </Link>
                      <div className="min-w-0">
                        <Link href={li.href} className="mincho text-[15px] leading-relaxed link-line">{li.name}</Link>
                        <p className="text-[13px] text-ink-3">{li.sub} ・ {yen(li.price)}</p>
                        <div className="mt-3 flex items-center gap-3 sm:hidden">
                          <QuantityStepper size="sm" value={q} onChange={(n) => setQty(id, n)} label={li.name} />
                          <button type="button" onClick={() => remove(id)} className="grid size-9 place-items-center rounded-full text-ink-2 hover:bg-sand" aria-label={`${li.name}を削除`}><Trash2 className="size-4" /></button>
                        </div>
                      </div>
                      <div className="col-span-2 hidden items-center gap-4 sm:col-span-1 sm:flex">
                        <QuantityStepper size="sm" value={q} onChange={(n) => setQty(id, n)} label={li.name} />
                        <p className="w-20 text-right font-medium tabular-nums">{yen(li.price * q)}</p>
                        <button type="button" onClick={() => remove(id)} className="grid size-9 place-items-center rounded-full text-ink-2 hover:bg-sand" aria-label={`${li.name}を削除`}><Trash2 className="size-4" /></button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {hint && (
                <p className="mt-5 rounded-md bg-sea-soft px-4 py-3 text-sm">
                  あと{hint.need}枚で 3枚セット価格（1,000円）になります（＋{yen(hint.add)}）。 <Link href="/postcards" className="underline">絵柄を選ぶ</Link>
                </p>
              )}
              <p className="mt-6"><Link href="/postcards" className="text-sm link-line">← 買い物を続ける</Link></p>
            </>
          )}

          {/* STEP 1: お客様情報 */}
          {step === 1 && (
            <form ref={formRef} id="info-form" onSubmit={toConfirm} noValidate className="grid gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField name="name" label="お名前" required autoComplete="name" value={info.name} onChange={set('name')} onBlur={blur('name')} error={errors.name} placeholder="中島 花子" />
                <TextField name="kana" label="ふりがな" required value={info.kana} onChange={set('kana')} onBlur={blur('kana')} error={errors.kana} placeholder="なかじま はなこ" />
                <TextField name="email" label="メールアドレス" required type="email" inputMode="email" autoComplete="email" value={info.email} onChange={set('email')} onBlur={blur('email')} error={errors.email} placeholder="hanako@example.com" />
                <TextField name="tel" label="電話番号" required type="tel" inputMode="tel" autoComplete="tel" value={info.tel} onChange={set('tel')} onBlur={blur('tel')} error={errors.tel} placeholder="090-1234-5678" />
                <TextField name="zip" label="郵便番号" required inputMode="numeric" autoComplete="postal-code" value={info.zip} onChange={set('zip')} onBlur={blur('zip')} error={errors.zip} placeholder="791-4501" />
              </div>
              <TextField name="address" label="お届け先住所" required autoComplete="street-address" value={info.address} onChange={set('address')} onBlur={blur('address')} error={errors.address} placeholder="愛媛県松山市中島大浦 0-0" />
              <TextArea name="notes" label="備考" rows={3} value={info.notes} onChange={set('notes')} onBlur={blur('notes')} error={errors.notes} placeholder="贈り物用、ご要望など" />

              <div className="grid gap-3 rounded-lg border border-line p-5 text-sm">
                <p className="flex items-center gap-2 font-medium">発送方法・送料{shipping.status !== 'fixed' && <TbdBadge />}</p>
                <p className="text-ink-2">{shipping.methods[0].note}</p>
                <p className="mt-2 flex items-center gap-2 font-medium">お支払い方法</p>
                <p className="text-ink-2">{payment.note}</p>
              </div>
            </form>
          )}

          {/* STEP 2: 確認 */}
          {step === 2 && (
            <div className="grid gap-8">
              <section>
                <h3 className="mincho mb-4 text-lg">ご注文内容</h3>
                <ul className="border-t border-charcoal">
                  {ids.map((id) => {
                    const li = lineInfo(id)!;
                    return <li key={id} className="flex justify-between gap-4 border-b border-line py-3 text-sm"><span>{li.name} × {lines[id]}</span><span className="tabular-nums">{yen(li.price * lines[id])}</span></li>;
                  })}
                </ul>
              </section>
              {stripe ? (
                <section className="grid gap-2 rounded-lg border border-line p-5 text-sm leading-relaxed">
                  <h3 className="mincho text-lg">お支払いについて</h3>
                  <p className="text-ink-2">次の画面（Stripe の安全な決済ページ）で、お名前・メールアドレス・お届け先とお支払い情報を入力します。カード情報はこのサイトには保存されません。</p>
                  <p className="text-ink-2">クレジットカードのほか、お使いの端末によって Apple Pay・Google Pay がご利用いただけます。</p>
                </section>
              ) : (
              <section>
                <h3 className="mincho mb-4 text-lg">お届け先</h3>
                <ConfirmList rows={[
                  { label: 'お名前', value: `${info.name}（${info.kana}）` },
                  { label: 'メールアドレス', value: info.email },
                  { label: '電話番号', value: info.tel },
                  { label: 'お届け先', value: `〒${info.zip}\n${info.address}` },
                  { label: '備考', value: info.notes },
                ]} />
              </section>
              )}
              <div className="grid gap-4 rounded-lg bg-sand/60 p-5 text-sm leading-relaxed">
                <p className="flex gap-2"><CircleAlert className="mt-0.5 size-4 shrink-0 text-sea-deep" aria-hidden />
                  {stripe
                    ? <>{shipping.note}{returns.note}</>
                    : <>{shipping.note}{returns.note}{DEMO_MODE && ' 現在はデモのため、注文は確定せず、商品は発送されません。'}</>}</p>
                <Checkbox name="agree" checked={agree} onChange={(c) => { setAgree(c); if (c) setAgreeErr(''); }} error={agreeErr}
                  label="上記の内容を確認しました" />
              </div>
              {sendErr && <p role="alert" className="text-sm text-danger">{sendErr}</p>}
            </div>
          )}
        </div>

        {/* 合計（PC は右に固定） */}
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="注文金額">
          <div className="grid gap-5 rounded-xl border border-charcoal bg-paper p-6">
            <p className="mincho">ご注文金額</p>
            <Totals s={summary} />
            {step === 0 && <button type="button" onClick={() => { setStep(stripe ? 2 : 1); goTop(); }} className={btn('primary', 'w-full')}>購入手続きへ</button>}
            {step === 1 && (
              <div className="grid gap-2">
                <button type="submit" form="info-form" className={btn('primary', 'w-full')}>確認画面へ</button>
                <button type="button" onClick={() => { setStep(0); goTop(); }} className={btn('text', 'justify-self-center text-sm')}>← カートに戻る</button>
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-2">
                <button type="button" onClick={order} disabled={sending} className={btn('primary', 'w-full')}>
                  {sending
                    ? <><Loader2 className="size-4 animate-spin" />{stripe ? '決済画面へ移動しています' : '送信しています'}</>
                    : stripe ? <><Lock className="size-4" aria-hidden />お支払いへ進む</> : DEMO_MODE ? '注文する（デモ）' : '注文する'}
                </button>
                {stripe && <p className="text-center text-[12px] text-ink-3">Stripe の決済ページに移動します</p>}
                <button type="button" onClick={() => { setStep(stripe ? 0 : 1); goTop(); }} className={btn('text', 'justify-self-center text-sm')}>{stripe ? '← カートに戻る' : '← 入力内容を修正'}</button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
