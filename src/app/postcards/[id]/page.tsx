import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/asset';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { postcards, getPostcard, credit, productSummary } from '@/data/postcards';
import { postcardPrice, shipping } from '@/data/pricing';
import { site, PAYMENTS } from '@/data/site';
import { bundle3Link } from '@/data/paymentLinks';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Container, Note } from '@/components/ui/primitives';
import { ZoomableImage } from '@/components/postcards/Lightbox';
import { AddToCart } from '@/components/postcards/AddToCart';


/** 用意したページ以外は 404 にする */
export const dynamicParams = false;

export function generateStaticParams() {
  return postcards.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<'/postcards/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const card = getPostcard(id);
  if (!card) return {};
  return {
    title: `No.${card.no}『${card.title}』— ポストカード`,
    description: `${card.poem.slice(0, 3).join(' ')}… ${productSummary}`,
    openGraph: { images: [{ url: absoluteUrl(card.image.src), width: card.image.width, height: card.image.height }] },
    twitter: { card: 'summary_large_image', images: [absoluteUrl(card.image.src)] },
  };
}

export default async function PostcardDetail({ params }: PageProps<'/postcards/[id]'>) {
  const { id } = await params;
  const index = postcards.findIndex((p) => p.id === id);
  if (index < 0) notFound();
  const card = postcards[index];
  const prev = postcards[(index - 1 + postcards.length) % postcards.length];
  const next = postcards[(index + 1) % postcards.length];
  const label = `No.${card.no}『${card.title}』`;

  const productLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: `ポストカード ${label}`,
    description: productSummary, brand: site.brand,
    offers: { '@type': 'Offer', price: postcardPrice.single, priceCurrency: 'JPY' },
  };

  return (
    <>
      <Container className="pt-8">
        <nav aria-label="パンくず" className="text-[13px] text-ink-3">
          <ol className="flex flex-wrap gap-2">
            <li><Link href="/" className="link-line">Home</Link> /</li>
            <li><Link href="/postcards" className="link-line">Postcards</Link> /</li>
            <li aria-current="page" className="text-charcoal">No.{card.no}</li>
          </ol>
        </nav>
      </Container>

      <Container className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16 lg:py-14">
        <Reveal variant="img" className="lg:sticky lg:top-24 lg:self-start">
          <ZoomableImage cards={postcards} index={index} sizes="(min-width: 1024px) 60vw, 100vw" priority />
          <Note className="mt-3">写真をタップすると拡大表示します。</Note>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-latin text-6xl font-semibold leading-none text-sea-deep">{card.no}</p>
            <h1 className="mincho mt-5 text-[clamp(22px,2.4vw,30px)] leading-relaxed">『{card.title}』</h1>
            <p className="mt-3 font-latin tracking-[.2em] text-ink-2">{credit}</p>
          </Reveal>

          {/* 詩（提供素材のまま） */}
          <Reveal delay={150} as="figure" className="mt-10 border-y border-line py-10">
            <blockquote className="mincho mx-auto max-w-full overflow-x-auto sm:h-[21em] text-[17px] font-medium leading-[2.1] tracking-[.18em] [writing-mode:horizontal-tb] sm:[writing-mode:vertical-rl]">
              {card.poem.map((l, i) => <p key={i}>{l}</p>)}
            </blockquote>
            <figcaption className="mt-6 text-right text-[13px] text-ink-3">詩：sachie mine　<Link href="/postcards#poet" className="underline">sachie mine さんについて</Link></figcaption>
          </Reveal>

          <Reveal delay={250} className="mt-10">
            <p className="flex items-baseline gap-3">
              <span className="font-latin text-5xl font-semibold">{postcardPrice.single}<small className="ml-1 font-sans text-base">円</small></span>
              <span className="text-sm text-ink-2">（税込・1枚）</span>
            </p>
            {PAYMENTS === 'links'
              ? <p className="mt-2 text-sm text-ink-2">3枚まとめてなら <a href={bundle3Link() ?? '/cart'} className="underline">3枚セット（1,000円・絵柄自由）</a> がお得です。</p>
              : <p className="mt-2 text-sm text-ink-2">3枚ごとに 1,000円 のセット価格になります（絵柄の組み合わせ自由）。</p>}
            <AddToCart id={card.id} label={label} className="mt-6" />
            <Note className="mt-4">{shipping.note}</Note>
            <div className="mt-8 rounded-lg bg-sand/60 p-5 text-sm">
              <p>全10種類がそろう <b className="font-medium">全10種類セット（3,000円）</b> もあります。</p>
              <ButtonLink href="/postcards/set" variant="text" className="mt-2">セットを見る</ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* 前後の作品 */}
      <Container className="pb-24">
        <nav aria-label="ほかの作品" className="grid grid-cols-2 border-t border-charcoal">
          {[{ c: prev, dir: 'prev' as const }, { c: next, dir: 'next' as const }].map(({ c, dir }) => (
            <Link key={dir} href={`/postcards/${c.id}`} className={`group flex items-center gap-4 py-6 ${dir === 'next' ? 'flex-row-reverse border-l border-line pl-4 text-right' : 'pr-4'}`}>
              {dir === 'prev' ? <ArrowLeft className="size-5 shrink-0" strokeWidth={1.4} /> : <ArrowRight className="size-5 shrink-0" strokeWidth={1.4} />}
              <Image src={c.image} alt="" sizes="120px" className="hidden h-auto w-24 shadow-sm transition group-hover:-translate-y-0.5 sm:block" />
              <span className="min-w-0"><span className="font-latin text-lg">{c.no}</span><span className="block truncate text-sm text-ink-2">『{c.title}』</span></span>
            </Link>
          ))}
        </nav>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
    </>
  );
}
