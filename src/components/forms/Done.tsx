'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CircleCheck } from 'lucide-react';
import { DEMO_MODE } from '@/data/site';
import { btn } from '@/components/ui/primitives';

/** 送信完了画面（注文・相談・お問い合わせ共通） */
export function Done({ id, title, kind, lines, onReset, resetLabel, children }:
  { id: string; title: string; kind: string; lines: string[]; onReset?: () => void; resetLabel?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className="mx-auto grid max-w-xl justify-items-center gap-5 py-6 text-center animate-fade-up">
      <CircleCheck className="size-14 text-sea" strokeWidth={1} aria-hidden />
      <p className="eyebrow">Thank you</p>
      <h3 ref={ref} tabIndex={-1} className="mincho text-2xl leading-relaxed">{title}</h3>
      <p className="text-sm text-ink-2">{kind}　<span className="font-latin text-xl font-semibold tracking-widest text-charcoal">{id}</span></p>
      <div className="space-y-2 leading-loose text-ink-2">{lines.map((l) => <p key={l}>{l}</p>)}</div>
      {DEMO_MODE && (
        <p className="w-full rounded-md border border-draft/40 bg-paper px-4 py-3 text-sm text-draft">
          【デモ】実際には送信されていません。メール通知・受付管理は未実装です。
        </p>
      )}
      {children}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {onReset && <button type="button" onClick={onReset} className={btn('ghost')}>{resetLabel ?? 'もう一度入力する'}</button>}
        <Link href="/" className={btn('primary')}>トップへ戻る</Link>
      </div>
    </div>
  );
}
