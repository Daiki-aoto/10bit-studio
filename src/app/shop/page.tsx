import type { Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { postcards, credit } from '@/data/postcards';
import { postcardPrice, shipping } from '@/data/pricing';
import { calendar, CALENDAR_ON_SALE, CALENDAR_STOCK, calendarShippingNote } from '@/data/calendar';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { Container, Note } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'ショップ — ポストカード・カレンダー',
  description: '中島の写真から生まれた品物。詩を添えたポストカードと、2027年の壁掛けフォトカレンダー。',
};

type Item = {
  href: string; en: string; name: string; lead: string; price: string; image: StaticImageData; alt: string;
  badge?: string; note: string;
};

/** ショップに並べる品物（ポストカード・カレンダー） */
const items: Item[] = [
  {
    href: '/postcards', en: 'Postcards', name: 'ポストカード',
    lead: `中島の写真に、sachie mine さんの詩を添えた全10種類。${credit}`,
    price: `1枚 ${postcardPrice.single}円／3枚セット ${postcardPrice.bundle3.toLocaleString()}円／全10種類 ${postcardPrice.setAll.toLocaleString()}円`,
    image: postcards[0].image, alt: `ポストカード No.${postcards[0].no}『${postcards[0].title}』`,
    note: shipping.note,
  },
  {
    href: '/calendar', en: '2027 Photo Calendar', name: '中島フォトカレンダー 2027',
    lead: `${calendar.concept}。中島で撮った12か月の風景の、A4 壁掛けカレンダー（28ページ）。`,
    price: `${calendar.price.toLocaleString()}円（税込）`,
    image: calendar.cover, alt: '2027 NAKAJIMA PHOTO CALENDAR の表紙',
    badge: CALENDAR_ON_SALE ? `限定${CALENDAR_STOCK}部` : '近日発売',
    note: CALENDAR_ON_SALE ? calendarShippingNote : '印刷が届きしだい、このページから購入できるようになります。',
  },
];

export default function ShopPage() {
  return (
    <>
      <Container className="pb-12 pt-14 lg:pt-20">
        <Reveal><p className="eyebrow">Shop</p></Reveal>
        <RiseText as="h1" lines={['中島の写真を、', '手元に。']} className="mincho mt-6 text-[clamp(30px,4.6vw,56px)] leading-[1.5]" />
        <Reveal delay={200}><p className="mt-6 max-w-2xl leading-loose text-ink-2">島で撮った写真から生まれた品物です。お支払いは Stripe の安全な決済ページで、クレジットカード・Apple Pay・Google Pay がご利用いただけます。</p></Reveal>
      </Container>

      <section className="bg-paper-2 py-16 sm:py-24">
        <Container>
          <ul className="grid gap-10 md:grid-cols-2">
            {items.map((it, i) => (
              <Reveal as="li" key={it.href} delay={i * 120} variant="reveal">
                <Link href={it.href} className="group block h-full rounded-xl border border-line bg-paper p-5 transition hover:border-charcoal sm:p-7">
                  <div className="relative overflow-hidden">
                    <Image src={it.image} alt={it.alt} placeholder="blur" sizes="(min-width: 768px) 45vw, 90vw"
                      className="h-auto w-full transition duration-700 group-hover:scale-[1.02]" />
                    {it.badge && <span className="absolute left-3 top-3 rounded-full bg-sea-deep px-3 text-xs leading-6 text-paper">{it.badge}</span>}
                  </div>
                  <p className="eyebrow mt-6">{it.en}</p>
                  <h2 className="mincho mt-2 text-2xl leading-relaxed">{it.name}</h2>
                  <p className="mt-3 text-[14px] leading-loose text-ink-2">{it.lead}</p>
                  <p className="mt-4 text-[15px] font-medium">{it.price}</p>
                  <Note className="mt-2">{it.note}</Note>
                  <span className="mt-6 inline-flex items-center gap-2 text-[15px] link-line">詳しく見る<ArrowRight className="size-4" strokeWidth={1.5} aria-hidden /></span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
