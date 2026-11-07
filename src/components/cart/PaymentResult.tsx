'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CircleCheck, Clock, Loader2, TriangleAlert } from 'lucide-react';
import { yen } from '@/lib/pricing';
import { btn } from '@/components/ui/primitives';
import { useCart } from './CartProvider';
import { PAYMENTS } from '@/data/site';

type Info = {
  status: 'open' | 'complete' | 'expired';
  paymentStatus: 'paid' | 'unpaid' | 'no_payment_required';
  recorded: boolean;
  orderNo: string;
  amount: number | null;
  email: string | null;
  items: { name: string; quantity: number; amount: number }[];
};

/**
 * 決済後の画面。表示のために注文の状態を問い合わせるだけで、注文の確定は Webhook が行う。
 * 支払いが確認できたときだけカートを空にする。
 */
export function PaymentResult() {
  return PAYMENTS === 'links' ? <LinksThanks /> : <CheckoutResult />;
}

/** 支払いリンクから戻ってきたとき（サーバーがないので注文内容は表示せず、お礼と案内だけ） */
function LinksThanks() {
  return (
    <div className="mx-auto grid max-w-xl justify-items-center gap-5 py-6 text-center animate-fade-up">
      <CircleCheck className="size-14 text-sea" strokeWidth={1} aria-hidden />
      <p className="eyebrow">Thank you</p>
      <h2 className="mincho text-2xl leading-relaxed">ご注文ありがとうございます</h2>
      <p className="leading-loose text-ink-2">
        お支払いが完了すると、ご登録のメールアドレスに Stripe から領収書が届きます。
        <br />発送方法・送料は、確定後に別途ご案内します。
      </p>
      <p className="text-sm text-ink-3">領収書メールが届かない場合は、お手数ですがお問い合わせください。</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/postcards" className={btn('ghost')}>ポストカード一覧へ</Link>
        <Link href="/" className={btn('primary')}>トップへ戻る</Link>
      </div>
    </div>
  );
}

function CheckoutResult() {
  const { clear } = useCart();
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState('');
  const cleared = useRef(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('session_id');
    if (!id) { setError('注文情報が見つかりませんでした。'); return; }
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      try {
        const res = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(id)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as Info;
        setInfo(data);
        // 支払い済みでも、Webhook での記録が数秒遅れることがあるので少し待って再確認
        if (data.paymentStatus !== 'paid' || !data.recorded) { if (++tries < 8) timer = setTimeout(load, 2500); }
      } catch { setError('注文情報を確認できませんでした。'); }
    };
    load();
    return () => clearTimeout(timer);
  }, []);

  const paid = info?.paymentStatus === 'paid' || info?.paymentStatus === 'no_payment_required';
  useEffect(() => { if (paid && !cleared.current) { cleared.current = true; clear(); } }, [paid, clear]);

  if (error) {
    return (
      <div className="mx-auto grid max-w-xl justify-items-center gap-5 py-16 text-center">
        <TriangleAlert className="size-12 text-ink-3" strokeWidth={1} aria-hidden />
        <p className="mincho text-xl">{error}</p>
        <p className="text-sm text-ink-2">お支払いが完了している場合は、Stripe から領収書メールが届きます。届かない場合はお問い合わせください。</p>
        <div className="flex flex-wrap justify-center gap-3"><Link href="/contact" className={btn('ghost')}>お問い合わせ</Link><Link href="/" className={btn('primary')}>トップへ</Link></div>
      </div>
    );
  }
  if (!info) return <p className="flex items-center justify-center gap-2 py-24 text-ink-2"><Loader2 className="size-5 animate-spin" />お支払い状況を確認しています</p>;

  if (!paid) {
    return (
      <div className="mx-auto grid max-w-xl justify-items-center gap-5 py-16 text-center">
        <Clock className="size-12 text-sea" strokeWidth={1} aria-hidden />
        <h2 className="mincho text-2xl">お支払いの確認中です</h2>
        <p className="leading-loose text-ink-2">お支払いの完了を確認でき次第、ご登録のメールアドレスに領収書が届きます。しばらくしてからこのページを再読み込みしてください。</p>
        <Link href="/" className={btn('ghost')}>トップへ</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-xl justify-items-center gap-5 py-6 text-center animate-fade-up">
      <CircleCheck className="size-14 text-sea" strokeWidth={1} aria-hidden />
      <p className="eyebrow">Thank you</p>
      <h2 className="mincho text-2xl leading-relaxed">ご注文ありがとうございます</h2>
      <p className="text-sm text-ink-2">注文番号　<span className="font-latin text-xl font-semibold tracking-widest text-charcoal">{info.orderNo}</span></p>
      <p className="leading-loose text-ink-2">
        お支払いが完了しました。{info.email && <>領収書を <b className="font-medium text-charcoal">{info.email}</b> にお送りします。</>}
        <br />発送方法・送料は、確定後に別途ご案内します。
      </p>
      <ul className="w-full border-t border-charcoal text-left text-sm">
        {info.items.map((it, i) => (
          <li key={i} className="flex justify-between gap-4 border-b border-line py-3"><span>{it.name} × {it.quantity}</span><span className="tabular-nums">{yen(it.amount)}</span></li>
        ))}
        {info.amount !== null && <li className="flex justify-between py-3 font-medium"><span>お支払い合計</span><span className="tabular-nums">{yen(info.amount)}</span></li>}
      </ul>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/postcards" className={btn('ghost')}>ポストカード一覧へ</Link>
        <Link href="/" className={btn('primary')}>トップへ戻る</Link>
      </div>
    </div>
  );
}
