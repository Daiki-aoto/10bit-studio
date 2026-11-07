import Image from 'next/image';
import Link from 'next/link';
import type { Postcard } from '@/data/postcards';
import { Reveal } from '@/components/ui/Reveal';
import { QuickAdd } from './AddToCart';

/** 一覧のカード。写真はトリミングせず元の比率で表示 */
export function PostcardTile({ card, delay = 0, sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw' }:
  { card: Postcard; delay?: number; sizes?: string }) {
  return (
    <Reveal as="article" delay={delay} className="group">
      <Link href={`/postcards/${card.id}`} className="block" aria-label={`No.${card.no}『${card.title}』の詳細`}>
        <div className="transition duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-y-1.5">
          <Image src={card.image} alt="" sizes={sizes} placeholder="blur"
            className="h-auto w-full shadow-[0_1px_2px_rgb(0_0_0/.06),0_18px_36px_-24px_rgb(0_0_0/.4)] transition-shadow duration-700 group-hover:shadow-[0_1px_2px_rgb(0_0_0/.06),0_30px_50px_-26px_rgb(0_0_0/.5)]" />
        </div>
      </Link>
      <div className="mt-5 flex items-start gap-4">
        <span className="font-latin text-[28px] font-semibold leading-none text-sea-deep">{card.no}</span>
        <div className="min-w-0 flex-1">
          <h3 className="mincho text-[15px] leading-relaxed">
            <Link href={`/postcards/${card.id}`} className="link-line">『{card.title}』</Link>
          </h3>
          <p className="mt-1 line-clamp-1 text-[13px] text-ink-3">{card.poem.join(' ')}</p>
        </div>
        <QuickAdd id={card.id} label={`No.${card.no}『${card.title}』`} />
      </div>
    </Reveal>
  );
}
