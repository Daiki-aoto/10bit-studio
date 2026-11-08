import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { postcards, poet, productSummary } from '@/data/postcards';
import poetPhoto from '@/assets/people/sachie-mine.jpg';
import { postcardPrice, shipping } from '@/data/pricing';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { ButtonLink, Container, Note } from '@/components/ui/primitives';
import { PAYMENTS } from '@/data/site';
import { bundle3Link } from '@/data/paymentLinks';
import { PostcardTile } from '@/components/postcards/PostcardTile';

export const metadata: Metadata = {
  title: 'Postcards — 写真と詩のポストカード',
  description: `${productSummary} 全10種類。1枚350円、3枚セット1,000円、全10種類セット3,000円。`,
};

export default function PostcardsPage() {
  return (
    <>
      <Container className="pb-16 pt-14 lg:pt-20">
        <Reveal><p className="eyebrow">Postcards</p></Reveal>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <RiseText as="h1" lines={['島の風景を、', '一枚のはがきに。']} className="mincho text-[clamp(30px,4.6vw,56px)] leading-[1.5]" />
          <Reveal delay={300} className="space-y-4 text-ink-2">
            <p className="leading-loose">{productSummary}部屋に飾る一枚に、大切な人へ送る一枚に。</p>
            <p className="text-sm">全10種類 ・ はがきサイズ</p>
          </Reveal>
        </div>

        {/* 価格 */}
        <Reveal delay={400} className="mt-14 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-paper p-6">
            <p className="text-sm">1枚</p>
            <p className="mt-2 font-latin text-5xl font-semibold leading-none">{postcardPrice.single}<small className="ml-1 font-sans text-sm">円</small></p>
          </div>
          <div className="rounded-lg border border-line bg-paper p-6">
            <p className="text-sm">3枚セット <span className="ml-1 text-ink-3">（絵柄自由）</span></p>
            <p className="mt-2 font-latin text-5xl font-semibold leading-none">{postcardPrice.bundle3.toLocaleString()}<small className="ml-1 font-sans text-sm">円</small></p>
            {PAYMENTS === 'links' && bundle3Link() && (
              <a href={bundle3Link()!} className="mt-4 inline-flex items-center gap-1 rounded-full border border-charcoal px-4 py-1.5 text-[13px] transition hover:bg-charcoal hover:text-paper">3枚セットを購入 →</a>
            )}
          </div>
          <Link href="/postcards/set" className="group rounded-lg bg-sea-deep p-6 text-paper transition hover:bg-sea">
            <p className="flex justify-between text-sm"><span>全10種類セット</span><span className="rounded-full border border-paper/60 px-2.5 text-xs leading-5">1枚あたり300円</span></p>
            <p className="mt-2 font-latin text-5xl font-semibold leading-none">{postcardPrice.setAll.toLocaleString()}<small className="ml-1 font-sans text-sm">円</small></p>
            <p className="mt-3 text-[13px] text-paper/80 group-hover:underline">セットを見る →</p>
          </Link>
        </Reveal>
        <Note className="mt-4">{PAYMENTS === 'links'
          ? `3枚セットは、決済ページで3枚の絵柄をそれぞれ選べます（同じ絵柄も可）。${shipping.note}`
          : `3枚ごとに、カートで自動的にセット価格（1,000円）になります。※セット価格の適用ルールは確認中です。${shipping.note}`}</Note>
      </Container>

      {/* 一覧 */}
      <section aria-labelledby="list-title" className="border-t border-line py-20 sm:py-28">
        <Container>
          <h2 id="list-title" className="sr-only">全10種類の一覧</h2>
          <div className="grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {postcards.map((c, i) => <PostcardTile key={c.id} card={c} delay={(i % 3) * 90} />)}
          </div>
        </Container>
      </section>

      {/* 詩を書いた人 */}
      <section id="poet" aria-labelledby="poet-title" className="scroll-mt-20 border-t border-line py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal variant="img">
            <Image src={poetPhoto} alt={poet.photoAlt} sizes="(min-width: 1024px) 55vw, 100vw" placeholder="blur" className="h-auto w-full" />
          </Reveal>
          <Reveal>
            <p className="eyebrow">Poem by</p>
            <h2 id="poet-title" className="mt-3 font-latin text-4xl font-semibold tracking-wider">{poet.name}</h2>
            <p className="mincho mt-6 text-lg leading-relaxed">{poet.lead}</p>
            <div className="mt-6 space-y-4 text-[15px] leading-[2.1] text-ink-2">{poet.body.map((t) => <p key={t}>{t}</p>)}</div>
            <ul className="mt-8 grid gap-2 text-sm">
              {poet.links.map((l) => (
                <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer" className="link-line">{l.label}<span className="sr-only">（新しいタブで開きます）</span></a></li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* セット訴求 */}
      <section className="bg-sand/60 py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <p className="eyebrow">All 10 Set</p>
            <h2 className="mincho mt-3 text-2xl leading-relaxed">全10種類を、ひとそろいで。</h2>
            <p className="mt-5 leading-loose text-ink-2">10枚すべての写真と詩がそろうセットです。1枚あたり300円。</p>
            <div className="mt-8"><ButtonLink href="/postcards/set">全10種類セットを見る</ButtonLink></div>
          </Reveal>
          <Reveal variant="img" className="grid grid-cols-5 items-center gap-2 sm:gap-3">
            {postcards.map((c) => <Image key={c.id} src={c.image} alt="" sizes="20vw" className="h-auto w-full shadow-sm" />)}
          </Reveal>
        </Container>
      </section>
    </>
  );
}
