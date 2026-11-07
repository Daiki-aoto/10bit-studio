import type { Metadata } from 'next';
import Link from 'next/link';
import { postcards, credit, SET_ID } from '@/data/postcards';
import { postcardPrice, shipping } from '@/data/pricing';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { Container, Note } from '@/components/ui/primitives';
import { ZoomableImage } from '@/components/postcards/Lightbox';
import { AddToCart } from '@/components/postcards/AddToCart';

export const metadata: Metadata = {
  title: '全10種類セット — ポストカード',
  description: '中島の写真と sachie mine さんの詩によるポストカード、全10種類がそろうセット。3,000円（1枚あたり300円）。',
};

export default function SetPage() {
  return (
    <>
      <Container className="grid gap-10 pb-16 pt-14 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:pt-20">
        <div>
          <Reveal><p className="eyebrow">All 10 Postcards Set ／ {credit}</p></Reveal>
          <RiseText as="h1" lines={['全10種類を、', 'ひとそろいで。']} className="mincho mt-6 text-[clamp(30px,4.6vw,56px)] leading-[1.5]" />
        </div>
        <Reveal delay={300} className="rounded-xl border border-charcoal bg-paper p-7">
          <p className="flex items-center justify-between text-sm"><span>全10種類セット（各1枚）</span><span className="rounded-full bg-sea-deep px-3 text-xs leading-6 text-paper">1枚あたり300円</span></p>
          <p className="mt-3 font-latin text-6xl font-semibold leading-none">{postcardPrice.setAll.toLocaleString()}<small className="ml-1 font-sans text-base">円</small></p>
          <p className="mt-2 text-sm text-ink-3">1枚ずつ買う場合より {(postcardPrice.single * 10 - postcardPrice.setAll).toLocaleString()}円 お得</p>
          <AddToCart id={SET_ID} label="全10種類セット" className="mt-6" />
          <Note className="mt-4">{shipping.note}</Note>
        </Reveal>
      </Container>

      {/* 10枚すべてを並べる（写真はトリミングしない） */}
      <section className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <h2 className="sr-only">セットに入る10枚</h2>
          <ol className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))] lg:gap-x-6">
            {postcards.map((c, i) => (
              <Reveal as="li" key={c.id} delay={(i % 5) * 80} variant="reveal">
                <ZoomableImage cards={postcards} index={i} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw" />
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-latin text-xl font-semibold text-sea-deep">{c.no}</span>
                  <Link href={`/postcards/${c.id}`} className="mincho text-[13px] leading-relaxed link-line">『{c.title}』</Link>
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
