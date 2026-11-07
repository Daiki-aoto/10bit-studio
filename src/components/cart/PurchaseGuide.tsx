import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { postcards } from '@/data/postcards';
import { postcardPrice, returns } from '@/data/pricing';
import { bundle3Link, setAllLink } from '@/data/paymentLinks';
import { btn } from '@/components/ui/primitives';

/** 支払いリンク方式の「購入方法」（GitHub Pages 用。カートの代わり） */
export function PurchaseGuide() {
  const b3 = bundle3Link();
  const all = setAllLink();
  const options = [
    { name: '1枚', price: postcardPrice.single, text: '好きな絵柄のページから「購入する」。同じ絵柄なら枚数を変えて何枚でも。', href: '/postcards', external: false, cta: '絵柄を選ぶ' },
    { name: '3枚セット', price: postcardPrice.bundle3, text: '決済ページで、3枚の絵柄をそれぞれ選べます（同じ絵柄も可）。', href: b3, external: true, cta: '3枚セットを購入' },
    { name: '全10種類セット', price: postcardPrice.setAll, text: '10種類が1枚ずつ届きます。1枚あたり300円。', href: all, external: true, cta: '全10種類セットを購入', feature: true },
  ];
  return (
    <div className="grid gap-12">
      <ol className="grid gap-4 md:grid-cols-3">
        {options.map((o) => (
          <li key={o.name} className={`flex flex-col gap-4 rounded-xl border p-6 ${o.feature ? 'border-sea-deep bg-sea-deep text-paper' : 'border-line bg-paper'}`}>
            <p className="text-sm">{o.name}</p>
            <p className="font-latin text-5xl font-semibold leading-none">{o.price.toLocaleString()}<small className="ml-1 font-sans text-sm">円</small></p>
            <p className={`text-sm leading-relaxed ${o.feature ? 'text-paper/80' : 'text-ink-2'}`}>{o.text}</p>
            <div className="mt-auto pt-2">
              {!o.href ? <span className={btn('ghost', 'pointer-events-none opacity-50 w-full')}>準備中</span>
                : o.external
                  ? <a href={o.href} className={btn(o.feature ? 'light' : 'primary', 'w-full')}>{o.cta}<ArrowUpRight className="size-4" aria-hidden /></a>
                  : <Link href={o.href} className={btn('ghost', 'w-full')}>{o.cta}</Link>}
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border border-line p-6 text-sm leading-relaxed">
          <h2 className="mincho text-lg">お支払いの流れ</h2>
          <ol className="mt-4 grid gap-3">
            {['購入ボタンを押すと、Stripe の安全な決済ページに移動します', 'お名前・メールアドレス・お届け先と、カード（Apple Pay・Google Pay も可）を入力', 'お支払い完了後、ご登録のメールアドレスに領収書が届きます'].map((t, i) => (
              <li key={t} className="flex gap-3"><span className="font-latin text-lg text-sea">{i + 1}</span><span className="text-ink-2">{t}</span></li>
            ))}
          </ol>
          <p className="mt-5 text-ink-3">お支払い金額に送料は含まれていません。発送方法・送料は確定後に別途ご案内します。{returns.note}</p>
          <p className="mt-2 text-ink-3">いろいろな絵柄を組み合わせて4枚以上ほしい場合は、3枚セットと1枚を組み合わせてご購入ください。</p>
        </section>
        <div className="grid grid-cols-5 content-center gap-2">
          {postcards.map((c) => (
            <Link key={c.id} href={`/postcards/${c.id}`} aria-label={`No.${c.no}『${c.title}』`}>
              <Image src={c.image} alt="" sizes="20vw" className="h-auto w-full shadow-sm transition hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
