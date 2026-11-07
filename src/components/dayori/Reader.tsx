'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, FileText, Image as ImageIcon,
  LayoutGrid, Loader2, Maximize, Minimize, ZoomIn, ZoomOut, Columns2, RectangleVertical,
} from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { Issue } from '@/data/dayori';
import { issueLabel, pageSrc } from '@/data/dayori';
import { loadPdf, renderPage } from './PdfSource';

type Source = 'image' | 'pdf' | 'placeholder';
type Mode = 'spread' | 'single';
const ZOOMS = [1, 1.5, 2, 3];
const TURN_MS = 750;

/** 見開きの組み方：1ページ目（表紙）は単独、以降 2-3, 4-5 …、最後が偶数なら単独 */
function buildViews(count: number, mode: Mode): number[][] {
  if (mode === 'single') return Array.from({ length: count }, (_, i) => [i + 1]);
  const v: number[][] = [[1]];
  for (let p = 2; p <= count; p += 2) v.push(p + 1 <= count ? [p, p + 1] : [p]);
  return v;
}

/* ---------- 1ページの描画 ---------- */
function PageFace({ issue, n, source, doc, width, zoom }:
  { issue: Issue; n: number | null; source: Source; doc: PDFDocumentProxy | null; width: number; zoom: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (source !== 'pdf' || !doc || !n || !canvasRef.current || width < 10) return;
    let cancelled = false;
    setRendering(true);
    renderPage(doc, n, canvasRef.current, width).catch(() => {}).finally(() => { if (!cancelled) setRendering(false); });
    return () => { cancelled = true; };
  }, [source, doc, n, width]);

  if (!n) return <div className="h-full w-full" aria-hidden />;
  const alt = `${issueLabel(issue)} ${issue.name} ${n}ページ`;
  if (source === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={pageSrc(issue, n, zoom > 1 || width > 700 ? 'lg' : 'sm')}
        srcSet={`${pageSrc(issue, n, 'sm')} 800w, ${pageSrc(issue, n, 'lg')} 1600w`}
        sizes={`${Math.round(width)}px`} alt={alt} draggable={false}
        className="h-full w-full select-none bg-white object-contain" />
    );
  }
  if (source === 'pdf') {
    return (
      <div className="relative h-full w-full bg-white">
        <canvas ref={canvasRef} aria-label={alt} role="img" className="h-full w-full" />
        {rendering && <Loader2 className="absolute left-1/2 top-1/2 size-6 -translate-1/2 animate-spin text-ink-3" aria-hidden />}
      </div>
    );
  }
  return (
    <div role="img" aria-label={`${alt}（紙面データ準備中）`}
      className="grid h-full w-full place-items-center bg-[repeating-linear-gradient(135deg,var(--color-paper)_0_14px,var(--color-paper-2)_14px_15px)] text-center text-ink-3">
      <div className="grid gap-2 px-4">
        <span className="font-latin text-3xl text-ink-2">{n}</span>
        <span className="text-[12px] leading-relaxed">紙面データ準備中</span>
        <span className="mx-auto rounded-sm bg-paper px-2 text-[10px] tracking-widest">仮表示</span>
      </div>
    </div>
  );
}

/* ---------- 本体 ---------- */
export function Reader({ issue }: { issue: Issue }) {
  const available: Source[] = useMemo(() => {
    const s: Source[] = [];
    if (issue.pageImages) s.push('image');
    if (issue.pdf) s.push('pdf');
    return s.length ? s : ['placeholder'];
  }, [issue]);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState<Source>(available[0]);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [pdfState, setPdfState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [mode, setMode] = useState<Mode>('spread');
  const [autoMode, setAutoMode] = useState(true);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const [thumbs, setThumbs] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [turn, setTurn] = useState<null | { dir: 'next' | 'prev'; from: number[]; to: number[] }>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const views = useMemo(() => buildViews(issue.pageCount, mode), [issue.pageCount, mode]);
  const viewIndex = Math.max(0, views.findIndex((v) => v.includes(page)));
  const view = views[viewIndex];

  // URL の #p=5 / ?view=pdf を反映
  useEffect(() => {
    const m = window.location.hash.match(/p=(\d+)/);
    if (m) setPage(Math.min(issue.pageCount, Math.max(1, Number(m[1]))));
    const v = new URLSearchParams(window.location.search).get('view');
    if (v === 'pdf' && available.includes('pdf')) setSource('pdf');
  }, [issue.pageCount, available]);
  useEffect(() => { history.replaceState(null, '', `#p=${page}`); }, [page]);
  // 目次などのリンク（#p=5）で移動
  useEffect(() => {
    const on = () => {
      const m = window.location.hash.match(/p=(\d+)/);
      if (!m) return;
      setPage(Math.min(issue.pageCount, Math.max(1, Number(m[1]))));
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, [issue.pageCount]);

  // 画面サイズに応じて 見開き / 1ページ を自動切り替え
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setBox({ w: width, h: height });
      if (autoMode) setMode(width >= 760 && width / Math.max(height, 1) > 1.05 ? 'spread' : 'single');
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [autoMode]);

  // PDF を使うときだけ pdf.js を読み込む
  useEffect(() => {
    if (source !== 'pdf' || !issue.pdf || doc) return;
    setPdfState('loading');
    loadPdf(issue.pdf).then((d) => { setDoc(d); setPdfState('ready'); }).catch(() => {
      setPdfState('error');
      if (available.includes('image')) setSource('image'); // 代替：ページ画像
    });
  }, [source, issue.pdf, doc, available]);

  // 1ページの表示サイズ（B5 の比率を保つ）
  const slots = mode === 'spread' ? 2 : 1;
  const pageH = Math.max(0, Math.min(box.h - 8, (box.w - 8) / (slots * issue.pageRatio)));
  const pageW = pageH * issue.pageRatio;

  const go = useCallback((target: number, animate = true) => {
    const ti = Math.min(views.length - 1, Math.max(0, target));
    if (ti === viewIndex || turn) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mode === 'spread' && animate && !reduce && zoom === 1 && Math.abs(ti - viewIndex) === 1) {
      setTurn({ dir: ti > viewIndex ? 'next' : 'prev', from: views[viewIndex], to: views[ti] });
      setTimeout(() => { setPage(views[ti][0]); setTurn(null); }, TURN_MS);
    } else {
      setPage(views[ti][0]);
    }
  }, [views, viewIndex, turn, mode, zoom]);
  const next = useCallback(() => go(viewIndex + 1), [go, viewIndex]);
  const prev = useCallback(() => go(viewIndex - 1), [go, viewIndex]);

  // キーボード操作
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest('input,select,textarea')) return;
      if (!rootRef.current?.contains(document.activeElement) && !full && document.activeElement !== document.body) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'Home') go(0, false);
      if (e.key === 'End') go(views.length - 1, false);
      if (e.key === '+' || e.key === '=') setZoom((z) => ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(z) + 1)]);
      if (e.key === '-') setZoom((z) => ZOOMS[Math.max(0, ZOOMS.indexOf(z) - 1)]);
      if (e.key === 'Escape' && full && !document.fullscreenElement) setFull(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, go, views.length, full]);

  // 全画面（使えない端末＝iPhone などは画面いっぱいの表示で代替）
  const toggleFull = async () => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) { await document.exitFullscreen(); return; }
    if (full) { setFull(false); return; }
    if (el.requestFullscreen) {
      try { await el.requestFullscreen(); return; } catch { /* 代替へ */ }
    }
    setFull(true);
  };
  useEffect(() => {
    const on = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = full && !document.fullscreenElement ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [full]);

  // スワイプ（拡大していないときだけ）
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || zoom > 1) { touch.current = null; return; }
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) (dx < 0 ? next : prev)();
    touch.current = null;
  };

  const face = (n: number | null) => (
    <PageFace issue={issue} n={n} source={source} doc={doc} width={pageW * zoom} zoom={zoom} />
  );
  const pair = (v: number[]) => (mode === 'spread' ? (v.length === 1 ? (v[0] === 1 ? [null, v[0]] : [v[0], null]) : v) : v);

  // めくり中は「下の見開き」と「めくれる1枚」を描く
  let base: (number | null)[] = pair(view);
  let leaf: null | { front: number | null; back: number | null; side: 'left' | 'right' } = null;
  if (turn) {
    const [fl, fr] = pair(turn.from) as (number | null)[];
    const [tl, tr] = pair(turn.to) as (number | null)[];
    if (turn.dir === 'next') { base = [fl, tr]; leaf = { front: fr, back: tl, side: 'right' }; }
    else { base = [tl, fr]; leaf = { front: fl, back: tr, side: 'left' }; }
  }

  const pageLabel = view.length > 1 ? `${view[0]}–${view[1]}` : `${view[0]}`;
  const zi = ZOOMS.indexOf(zoom);
  const toc = issue.contents?.find((c, i, arr) => c.page <= view[view.length - 1] && (arr[i + 1]?.page ?? 999) > view[0]);

  const tool = 'grid size-10 place-items-center rounded-full transition hover:bg-paper/15 disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <div ref={rootRef} role="region" aria-label={`${issueLabel(issue)} ${issue.name} の紙面`} tabIndex={-1}
      className={`flex flex-col bg-charcoal text-paper ${full ? 'fixed inset-0 z-[60] h-dvh' : 'relative h-[min(92dvh,980px)] min-h-[520px] rounded-xl'}`}>
      {/* 上部バー */}
      <div className="flex items-center gap-3 border-b border-paper/10 px-3 py-2 sm:px-5">
        <p className="min-w-0 flex-1 truncate text-[13px]">
          <span className="font-latin text-base">{issueLabel(issue)}</span>
          <span className="ml-2 text-paper/70">{toc?.title ?? issue.name}</span>
        </p>
        {available.length > 1 && (
          <div className="hidden items-center rounded-full border border-paper/20 p-0.5 text-[12px] sm:flex" role="group" aria-label="表示方法">
            <button type="button" onClick={() => setSource('image')} aria-pressed={source === 'image'} className={`flex items-center gap-1 rounded-full px-3 py-1 ${source === 'image' ? 'bg-paper text-charcoal' : ''}`}><ImageIcon className="size-3.5" />画像</button>
            <button type="button" onClick={() => setSource('pdf')} aria-pressed={source === 'pdf'} className={`flex items-center gap-1 rounded-full px-3 py-1 ${source === 'pdf' ? 'bg-paper text-charcoal' : ''}`}><FileText className="size-3.5" />PDF</button>
          </div>
        )}
        <button type="button" className={`${tool} hidden sm:grid`} onClick={() => { setAutoMode(false); setMode((m) => (m === 'spread' ? 'single' : 'spread')); }}
          aria-label={mode === 'spread' ? '1ページずつ表示' : '見開きで表示'} title={mode === 'spread' ? '1ページずつ表示' : '見開きで表示'}>
          {mode === 'spread' ? <RectangleVertical className="size-5" strokeWidth={1.4} /> : <Columns2 className="size-5" strokeWidth={1.4} />}
        </button>
        {issue.pdf
          ? <a href={issue.pdf} download className={tool} aria-label="PDFをダウンロード" title="PDFをダウンロード"><Download className="size-5" strokeWidth={1.4} /></a>
          : <span className={`${tool} opacity-30`} aria-label="PDFは準備中です" title="PDFは準備中です"><Download className="size-5" strokeWidth={1.4} /></span>}
        <button type="button" className={tool} onClick={toggleFull} aria-label={full ? '全画面を終了' : '全画面で読む'} title={full ? '全画面を終了' : '全画面で読む'}>
          {full ? <Minimize className="size-5" strokeWidth={1.4} /> : <Maximize className="size-5" strokeWidth={1.4} />}
        </button>
      </div>

      {/* 紙面 */}
      <div ref={stageRef} className={`relative min-h-0 flex-1 ${zoom > 1 ? 'overflow-auto' : 'overflow-hidden'}`}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {pdfState === 'loading' && source === 'pdf' && (
          <div className="absolute inset-0 z-10 grid place-items-center text-sm text-paper/70"><span className="flex items-center gap-2"><Loader2 className="size-5 animate-spin" />PDFを読み込んでいます</span></div>
        )}
        {pdfState === 'error' && (
          <p className="absolute inset-x-0 top-3 z-10 mx-auto w-fit rounded-full bg-paper px-4 py-1 text-[12px] text-charcoal">PDFを表示できなかったため、画像で表示しています</p>
        )}
        <div className="flex min-h-full min-w-full items-center justify-center p-1"
          style={{ width: zoom > 1 ? pageW * slots * zoom + 8 : undefined, height: zoom > 1 ? pageH * zoom + 8 : undefined }}>
          <div className="relative flex shadow-[0_20px_60px_-20px_rgb(0_0_0/.7)]" style={{ perspective: 2400 }}>
            {base.map((n, i) => (
              <div key={`${i}-${n}`} className={`relative overflow-hidden ${n ? '' : 'opacity-0'} ${mode === 'spread' && i === 0 ? 'shadow-[inset_-18px_0_24px_-20px_rgb(0_0_0/.35)]' : ''}`}
                style={{ width: pageW * zoom, height: pageH * zoom }}>
                {face(n)}
                {mode === 'spread' && n && <span aria-hidden className={`pointer-events-none absolute inset-y-0 w-8 ${i === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/12 to-transparent`} />}
              </div>
            ))}
            {leaf && (
              <div aria-hidden className="absolute top-0 [transform-style:preserve-3d]"
                style={{
                  width: pageW, height: pageH,
                  left: leaf.side === 'right' ? pageW : 0,
                  transformOrigin: leaf.side === 'right' ? 'left center' : 'right center',
                  animation: `${leaf.side === 'right' ? 'leaf-next' : 'leaf-prev'} ${TURN_MS}ms cubic-bezier(.45,.05,.3,1) forwards`,
                }}>
                <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]">{face(leaf.front)}</div>
                <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">{face(leaf.back)}</div>
              </div>
            )}
          </div>
        </div>

        {/* 左右のクリック領域（PC） */}
        {zoom === 1 && (
          <>
            <button type="button" onClick={prev} disabled={viewIndex === 0} aria-label="前のページ"
              className="group absolute inset-y-0 left-0 hidden w-[12%] items-center justify-start pl-3 disabled:hidden sm:flex">
              <span className="grid size-11 place-items-center rounded-full bg-paper/10 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"><ChevronLeft className="size-6" /></span>
            </button>
            <button type="button" onClick={next} disabled={viewIndex === views.length - 1} aria-label="次のページ"
              className="group absolute inset-y-0 right-0 hidden w-[12%] items-center justify-end pr-3 disabled:hidden sm:flex">
              <span className="grid size-11 place-items-center rounded-full bg-paper/10 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"><ChevronRight className="size-6" /></span>
            </button>
          </>
        )}
      </div>

      {/* サムネイル */}
      {thumbs && (
        <div className="border-t border-paper/10 px-3 py-3">
          <ol className="hide-scrollbar flex gap-2 overflow-x-auto" aria-label="ページ一覧">
            {Array.from({ length: issue.pageCount }, (_, i) => i + 1).map((n) => (
              <li key={n} className="shrink-0">
                <button type="button" onClick={() => setPage(n)} aria-current={view.includes(n) ? 'page' : undefined} aria-label={`${n}ページへ`}
                  className={`block rounded-sm p-0.5 ${view.includes(n) ? 'bg-paper' : 'hover:bg-paper/20'}`}>
                  {issue.pageImages
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={pageSrc(issue, n, 'sm')} alt="" loading="lazy" className="h-20 w-auto" style={{ aspectRatio: issue.pageRatio }} />
                    : <span className="grid h-20 place-items-center bg-paper-2 font-latin text-charcoal" style={{ aspectRatio: issue.pageRatio }}>{n}</span>}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 下部の操作 */}
      <div className="flex items-center justify-between gap-2 border-t border-paper/10 px-2 py-2 sm:px-5">
        <div className="flex items-center">
          <button type="button" className={`${tool} hidden sm:grid`} onClick={() => go(0, false)} disabled={viewIndex === 0} aria-label="最初のページ"><ChevronsLeft className="size-5" /></button>
          <button type="button" className={tool} onClick={prev} disabled={viewIndex === 0} aria-label="前のページ"><ChevronLeft className="size-6" /></button>
          <p className="min-w-20 text-center font-latin text-[17px] tabular-nums" aria-live="polite">
            <span className="sr-only">ページ </span>{pageLabel}<span className="text-paper/50"> / {issue.pageCount}</span>
          </p>
          <button type="button" className={tool} onClick={next} disabled={viewIndex === views.length - 1} aria-label="次のページ"><ChevronRight className="size-6" /></button>
          <button type="button" className={`${tool} hidden sm:grid`} onClick={() => go(views.length - 1, false)} disabled={viewIndex === views.length - 1} aria-label="最後のページ"><ChevronsRight className="size-5" /></button>
        </div>
        <div className="flex items-center">
          <button type="button" className={tool} onClick={() => setZoom(ZOOMS[Math.max(0, zi - 1)])} disabled={zi === 0} aria-label="縮小"><ZoomOut className="size-5" strokeWidth={1.4} /></button>
          <span className="w-12 text-center text-[12px] tabular-nums text-paper/70">{Math.round(zoom * 100)}%</span>
          <button type="button" className={tool} onClick={() => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, zi + 1)])} disabled={zi === ZOOMS.length - 1} aria-label="拡大"><ZoomIn className="size-5" strokeWidth={1.4} /></button>
          <button type="button" className={`${tool} ml-1`} onClick={() => setThumbs((t) => !t)} aria-pressed={thumbs} aria-label="ページ一覧"><LayoutGrid className="size-5" strokeWidth={1.4} /></button>
        </div>
      </div>
      {source === 'placeholder' && (
        <p className="flex items-center justify-center gap-2 bg-paper-2 px-4 py-2 text-[12px] text-ink-2"><BookOpen className="size-4" aria-hidden />この号の紙面データ（PDF・画像）は準備中です。現在は仮表示です。</p>
      )}
    </div>
  );
}
