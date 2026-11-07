'use client';

import { asset } from '@/lib/asset';

/** pdf.js を必要になったときだけ読み込む（初回表示を軽くするため） */
import type { PDFDocumentProxy } from 'pdfjs-dist';

const cache = new Map<string, Promise<PDFDocumentProxy>>();

export function loadPdf(url: string) {
  if (!cache.has(url)) {
    cache.set(url, (async () => {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = asset('/pdfjs/pdf.worker.min.mjs');
      return pdfjs.getDocument({
        url,
        cMapUrl: asset('/pdfjs/cmaps/'),
        cMapPacked: true,
        standardFontDataUrl: asset('/pdfjs/standard_fonts/'),
        wasmUrl: asset('/pdfjs/wasm/'),
        iccUrl: asset('/pdfjs/iccs/'),
        // 先頭ページから少しずつ読み込む
        disableAutoFetch: true,
      }).promise;
    })());
  }
  return cache.get(url)!;
}

/** 指定幅（CSS px）で1ページを canvas に描画する */
export async function renderPage(doc: PDFDocumentProxy, n: number, canvas: HTMLCanvasElement, cssWidth: number) {
  const page = await doc.getPage(n);
  const base = page.getViewport({ scale: 1 });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const viewport = page.getViewport({ scale: (cssWidth / base.width) * dpr });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const task = page.render({ canvas, viewport });
  await task.promise;
  return task;
}
