'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { videoServices, videoWorks, localVideoWorks, youtubeUrl, type VideoServiceId } from '@/data/videoProduction';
import { heroVideo } from '@/data/media';
import { HeroVideo } from '@/components/ui/HeroVideo';
import { btn } from '@/components/ui/primitives';
import { YouTubePlayer } from './YouTubePlayer';

/** そのジャンルに当てはまる動画の数 */
const countOf = (id: VideoServiceId) =>
  videoWorks.filter((w) => w.services.includes(id)).length + localVideoWorks.filter((w) => w.services.includes(id)).length;

/**
 * 「対応できる業務」。カードを押すと、そのジャンルの動画をカードの下に表示する（もう一度押すと閉じる）。
 * どの動画がどのジャンルかは data/videoProduction.ts の services で決める。
 */
export function ServiceExplorer() {
  const [open, setOpen] = useState<VideoServiceId | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const service = videoServices.find((s) => s.id === open);
  const yt = open ? videoWorks.filter((w) => w.services.includes(open)) : [];
  const local = open ? localVideoWorks.filter((w) => w.services.includes(open)) : [];

  const choose = (id: VideoServiceId) => {
    const next = open === id ? null : id;
    setOpen(next);
    // スマホでは表示欄がカードより下になるため、表示欄まで移動する
    if (next) requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  return (
    <>
      <p className="mt-6 text-sm text-ink-2">カードを押すと、そのジャンルの映像を見られます。</p>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {videoServices.map((s, i) => {
          const n = countOf(s.id);
          const on = open === s.id;
          return (
            <li key={s.id} className="contents">
              <button type="button" onClick={() => choose(s.id)} aria-expanded={on} aria-controls="service-panel"
                className={`grid min-h-44 content-between gap-6 p-6 text-left transition ${on ? 'bg-sea-deep text-paper' : 'bg-paper hover:bg-sand/50'}`}>
                <span className={`font-latin text-sm font-semibold tracking-[.24em] ${on ? 'text-paper/80' : 'text-sea'}`}>{String(i + 1).padStart(2, '0')} ／ {s.en}</span>
                <span className="mincho text-[17px] leading-relaxed">{s.title}</span>
                <span className={`text-[12px] ${on ? 'text-paper/80' : 'text-ink-3'}`}>
                  {n > 0 ? `映像 ${n}本を見る` : 'ご相談ください'}{on ? '　▲ 閉じる' : '　▼'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div ref={panelRef} id="service-panel" aria-live="polite" className="scroll-mt-24">
        {service && (
          <div className="mt-8 rounded-xl border border-charcoal p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3 className="mincho text-xl leading-relaxed">{service.title}</h3>
              <button type="button" onClick={() => setOpen(null)} aria-label="閉じる"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition hover:bg-sand/50">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>

            {yt.length + local.length > 0 ? (
              <ul className="mt-6 grid gap-8 md:grid-cols-2">
                {yt.map((w) => (
                  <li key={w.youtubeId}>
                    <YouTubePlayer id={w.youtubeId} title={`${w.title}${w.subtitle ?? ''}`} thumbnail={w.thumbnail} />
                    <p className="mt-3 leading-relaxed">{w.title}</p>
                    <a href={youtubeUrl(w.youtubeId)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-ink-2 link-line">
                      YouTubeで見る<span className="sr-only">（新しいタブで開きます）</span>
                    </a>
                  </li>
                ))}
                {local.map((w) => (
                  <li key={w.key}>
                    <HeroVideo config={heroVideo} className="aspect-video" />
                    <p className="mt-3 leading-relaxed">{w.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 grid gap-5">
                <p className="leading-loose text-ink-2">このジャンルの公開できる実績は、まだありません。内容を伺い、目的に合った映像をご提案します。</p>
                <Link href="/contact?type=video" className={btn('primary', 'w-fit')}>映像制作を相談する</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
