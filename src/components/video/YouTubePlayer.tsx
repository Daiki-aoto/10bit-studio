'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { youtubeEmbed } from '@/data/videoProduction';

/**
 * YouTube 埋め込み（遅延読み込み）。
 * 最初はサイト内に保存したサムネイルだけを表示し、再生ボタンを押したときに初めて
 * youtube-nocookie.com（プライバシー強化モード）のプレーヤーを読み込む。
 */
export function YouTubePlayer({ id, title, thumbnail, priority = false }: { id: string; title: string; thumbnail: string; priority?: boolean }) {
  const [active, setActive] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-charcoal">
      {active ? (
        <iframe
          src={`${youtubeEmbed(id)}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setActive(true)} aria-label={`動画を再生：${title}`}
          className="group absolute inset-0 block h-full w-full cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbnail} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.03]" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/5 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper/70 bg-charcoal/35 text-paper backdrop-blur-sm transition duration-500 group-hover:scale-110 group-hover:bg-sea-deep sm:size-20">
            <Play className="size-6 translate-x-0.5 sm:size-7" strokeWidth={1.4} fill="currentColor" />
          </span>
          <span className="absolute bottom-4 left-4 font-latin text-[13px] tracking-[.3em] text-paper/90 sm:bottom-6 sm:left-6">PLAY</span>
        </button>
      )}
    </div>
  );
}
