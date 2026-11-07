'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import type { Postcard } from '@/data/postcards';

/**
 * 写真の拡大表示。<dialog> を使い、Esc・←→・スワイプで操作できる。
 * children はクリックで開くトリガー（サムネイル）。
 */
export function ZoomableImage({ cards, index, sizes, priority = false, className = '' }:
  { cards: Postcard[]; index: number; sizes: string; priority?: boolean; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [cur, setCur] = useState(index);
  const touch = useRef<number | null>(null);
  const card = cards[cur];

  const open = () => { setCur(index); ref.current?.showModal(); };
  const close = () => ref.current?.close();
  const move = useCallback((d: number) => setCur((c) => (c + d + cards.length) % cards.length), [cards.length]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (!dlg.open) return;
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  const thumb = cards[index];
  return (
    <>
      <button type="button" onClick={open} className={`group relative block w-full cursor-zoom-in ${className}`}
        aria-label={`No.${thumb.no}『${thumb.title}』を拡大表示`}>
        <Image src={thumb.image} alt={`No.${thumb.no}『${thumb.title}』`} sizes={sizes} priority={priority} placeholder="blur"
          className="h-auto w-full shadow-[0_1px_2px_rgb(0_0_0/.06),0_24px_48px_-28px_rgb(0_0_0/.45)]" />
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-paper/85 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="size-4" strokeWidth={1.5} aria-hidden />
        </span>
      </button>

      <dialog ref={ref} aria-label="写真の拡大表示"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-charcoal p-0 text-paper backdrop:bg-charcoal/80 open:grid open:grid-rows-[auto_1fr_auto]"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
          touch.current = null;
        }}>
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <p className="text-sm"><span className="font-latin text-lg">{card.no}</span>　『{card.title}』</p>
          <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full hover:bg-paper/10" aria-label="閉じる">
            <X className="size-6" strokeWidth={1.4} />
          </button>
        </div>
        <div className="relative min-h-0 px-4 sm:px-16" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <Image key={card.id} src={card.image} alt={`No.${card.no}『${card.title}』`} sizes="100vw" placeholder="blur"
            className="mx-auto h-full w-auto max-w-full animate-page-in object-contain" />
        </div>
        <div className="flex items-center justify-center gap-4 py-4">
          <button type="button" onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full border border-paper/30 hover:bg-paper/10" aria-label="前の写真">
            <ChevronLeft className="size-5" />
          </button>
          <span className="font-latin tabular-nums">{cur + 1} / {cards.length}</span>
          <button type="button" onClick={() => move(1)} className="grid size-11 place-items-center rounded-full border border-paper/30 hover:bg-paper/10" aria-label="次の写真">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </dialog>
    </>
  );
}
