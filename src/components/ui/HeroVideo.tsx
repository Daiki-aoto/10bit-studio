'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { HeroVideoConfig } from '@/data/media';

type State = 'poster' | 'playing' | 'paused' | 'error';

/**
 * 横幅いっぱいの背景動画（自動再生・ミュート・ループ・インライン再生）。
 * - 画面に入るまで動画は読み込まない（preload="none" ＋ 表示時に src を設定）
 * - 画面幅に合わせて軽いファイルを選ぶ
 * - 通信量を抑える設定（Save-Data）や「視差効果を減らす」設定では自動再生せず、サムネイル＋再生ボタン
 * - 再生できないときは代替画像を表示
 */
export function HeroVideo({ config, className = '' }: { config: HeroVideoConfig; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [state, setState] = useState<State>('poster');
  const [autoAllowed, setAutoAllowed] = useState(true);
  const userPaused = useRef(false);

  // 端末に合わせたファイルを選び、画面に入ったら読み込み開始
  useEffect(() => {
    const w = window.innerWidth;
    const chosen = config.sources.find((s) => w <= s.maxWidth) ?? config.sources[config.sources.length - 1];
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (conn?.saveData || reduce) { setAutoAllowed(false); setState('paused'); }

    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const v = videoRef.current;
      if (e.isIntersecting) {
        setSrc((cur) => cur ?? chosen.src);
        if (v && v.src && !userPaused.current && autoAllowedRef.current) v.play().catch(() => {});
      } else if (v && !v.paused) {
        v.pause(); // 画面外では止めて負荷を下げる
      }
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [config.sources]);

  const autoAllowedRef = useRef(autoAllowed);
  useEffect(() => { autoAllowedRef.current = autoAllowed; }, [autoAllowed]);

  // src が入ったら再生を試みる（自動再生が拒否されたらボタンで再生）
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    const onErr = () => setState('error');
    v.addEventListener('error', onErr);
    v.load();
    if (autoAllowed) v.play().catch(() => setState(v.error ? 'error' : 'paused'));
    return () => v.removeEventListener('error', onErr);
  }, [src, autoAllowed]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!src) { const c = config.sources.find((s) => window.innerWidth <= s.maxWidth) ?? config.sources[0]; setAutoAllowed(true); setSrc(c.src); return; }
    if (v.paused) { userPaused.current = false; v.play().catch(() => setState('error')); }
    else { userPaused.current = true; v.pause(); }
  };

  const showPoster = state !== 'playing';

  return (
    <div ref={wrapRef} className={`relative w-full overflow-hidden bg-charcoal ${className}`}>
      {/* サムネイル（読み込み中）／代替画像（エラー時）。動画の下に敷いておき、再生が始まったら消す */}
      <picture>
        <source media="(max-width: 767px)" srcSet={state === 'error' ? config.fallback : config.poster.sm} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={state === 'error' ? config.fallback : config.poster.lg} alt={state === 'error' ? config.label : ''}
          aria-hidden={state !== 'error'} fetchPriority="high" decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${showPoster ? 'opacity-100' : 'opacity-0'}`} />
      </picture>

      {state !== 'error' && (
        <video ref={videoRef} src={src ?? undefined} muted loop playsInline autoPlay={autoAllowed} preload="none"
          poster={config.poster.lg} aria-label={config.label} disablePictureInPicture disableRemotePlayback
          onPlaying={() => setState('playing')}
          onPause={() => setState((s) => (s === 'error' ? s : 'paused'))}
          onError={() => { if (src) setState('error'); }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${state === 'playing' ? 'opacity-100' : 'opacity-0'}`} />
      )}

      {/* 再生・停止（動きを止めたい人のため常に表示） */}
      {state !== 'error' && (
        <button type="button" onClick={toggle}
          aria-label={state === 'playing' ? '動画を一時停止' : '動画を再生'}
          className="absolute bottom-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-charcoal/55 text-paper backdrop-blur transition hover:bg-charcoal/80 sm:bottom-6 sm:right-6">
          {state === 'playing' ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
        </button>
      )}
    </div>
  );
}
