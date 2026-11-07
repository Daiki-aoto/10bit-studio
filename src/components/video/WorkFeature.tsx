import { ArrowUpRight } from 'lucide-react';
import { youtubeUrl, type VideoWork } from '@/data/videoProduction';
import { Reveal } from '@/components/ui/Reveal';
import { YouTubePlayer } from './YouTubePlayer';

/** 1作品を大きく見せる（映像が主役） */
export function WorkFeature({ work, index = 0, dark = false }: { work: VideoWork; index?: number; dark?: boolean }) {
  const sub = dark ? 'text-paper/70' : 'text-ink-2';
  const line = dark ? 'border-paper/25' : 'border-charcoal';
  return (
    <article>
      <Reveal variant="img">
        <YouTubePlayer id={work.youtubeId} title={`${work.title}${work.subtitle ?? ''}`} thumbnail={work.thumbnail} />
      </Reveal>
      <Reveal className={`mt-8 grid gap-8 border-t pt-8 lg:grid-cols-[180px_1fr_auto] lg:gap-12 ${line}`}>
        <div className={`flex gap-6 text-[13px] lg:flex-col lg:gap-2 ${sub}`}>
          <span className="font-latin text-3xl font-semibold leading-none text-current">{String(index + 1).padStart(2, '0')}</span>
          <span className="tracking-wider">{work.category}</span>
          {work.year && <span className="font-latin tracking-[.2em]">{work.year}</span>}
        </div>
        <div className="max-w-2xl">
          <h3 className="mincho text-[clamp(20px,2.2vw,28px)] leading-relaxed">{work.title}</h3>
          {work.subtitle && <p className={`mincho mt-1 text-[15px] leading-relaxed ${sub}`}>{work.subtitle}</p>}
          <p className={`mt-5 text-[15px] leading-[2.1] ${sub}`}>{work.description}</p>
          {work.credits.length > 0 && <p className={`mt-4 text-[13px] ${sub}`}>担当：{work.credits.join(' ／ ')}</p>}
        </div>
        <a href={youtubeUrl(work.youtubeId)} target="_blank" rel="noopener noreferrer"
          className={`inline-flex h-fit w-fit items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition ${dark ? 'border-paper/50 hover:bg-paper hover:text-charcoal' : 'border-charcoal hover:bg-charcoal hover:text-paper'}`}>
          YouTubeで見る<ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
      </Reveal>
    </article>
  );
}
