'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Postcard } from '@/data/postcards';

/** ファーストビューの写真。クロスフェードのみ（トリミング・ズームはしない） */
export function HeroSlides({ cards, start = 0 }: { cards: Postcard[]; start?: number }) {
  const [cur, setCur] = useState(start);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setCur((c) => (c + 1) % cards.length), 5200);
    return () => clearInterval(t);
  }, [playing, cards.length]);

  const card = cards[cur];
  return (
    <div className="relative">
      <div className="relative aspect-[1.4] w-full" aria-roledescription="スライドショー" aria-label="ポストカードの写真">
        {cards.map((c, i) => (
          <Image key={c.id} src={c.image} alt={i === cur ? `No.${c.no}『${c.title}』` : ''} aria-hidden={i !== cur}
            fill sizes="(min-width: 1024px) 58vw, 100vw" priority={i === start} placeholder="blur"
            className={`object-contain transition-opacity duration-[1600ms] ease-out ${i === cur ? 'opacity-100' : 'opacity-0'}`} />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[13px] text-ink-2">
        <button type="button" onClick={() => setPlaying((p) => !p)} className="grid size-9 place-items-center rounded-full border border-line hover:border-charcoal"
          aria-label={playing ? 'スライドショーを止める' : 'スライドショーを再生'}>
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </button>
        <p aria-live="polite" className="mincho font-medium tracking-wider">No.{card.no}『{card.title}』</p>
        <div className="ml-auto hidden gap-1.5 sm:flex" aria-hidden>
          {cards.map((c, i) => (
            <span key={c.id} className={`h-px w-5 transition-colors ${i === cur ? 'bg-charcoal' : 'bg-line'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
