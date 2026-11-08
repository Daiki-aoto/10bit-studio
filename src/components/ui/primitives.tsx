import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ArrowRight, ImageOff, Play } from 'lucide-react';
import { SHOW_DRAFT_MARKERS, SHOW_DRAFTS } from '@/data/site';
import { Reveal } from './Reveal';

/* ---------- ボタン ---------- */
type Variant = 'primary' | 'ghost' | 'light' | 'text';
const base = 'inline-flex items-center justify-center gap-2 rounded-full text-[15px] font-medium tracking-wider transition duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none';
const variants: Record<Variant, string> = {
  primary: 'bg-sea-deep text-paper hover:bg-sea px-7 min-h-13 hover:-translate-y-0.5',
  ghost: 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-paper px-7 min-h-13 hover:-translate-y-0.5',
  light: 'bg-paper text-charcoal hover:bg-sand px-7 min-h-13',
  text: 'text-charcoal link-line pb-0.5',
};
export const btn = (v: Variant = 'primary', extra = '') => `${base} ${variants[v]} ${extra}`;

export function ButtonLink({ href, variant = 'primary', arrow = true, children, className = '', ...rest }:
  { href: string; variant?: Variant; arrow?: boolean; children: ReactNode; className?: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  const external = href.startsWith('http');
  const inner = <>{children}{arrow && <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />}</>;
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={btn(variant, className)} {...rest}>{inner}</a>
    : <Link href={href} className={btn(variant, className)} {...rest}>{inner}</Link>;
}

/* ---------- 見出し ---------- */
export function SectionHeading({ en, ja, lead, align = 'left', as: Tag = 'h2', className = '' }:
  { en: string; ja: string; lead?: ReactNode; align?: 'left' | 'center'; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <Reveal className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      <p className="eyebrow">{en}</p>
      <Tag className="mincho mt-3 text-2xl sm:text-[28px] leading-relaxed">{ja}</Tag>
      {lead && <div className={`mt-5 text-ink-2 leading-loose ${align === 'center' ? 'mx-auto' : ''} max-w-2xl`}>{lead}</div>}
    </Reveal>
  );
}

export function Container({ children, className = '', ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12 ${className}`} {...rest}>{children}</div>;
}

/* ---------- 仮原稿・仮素材の表示 ---------- */
export function DraftBadge({ label = '仮原稿', className = '' }: { label?: string; className?: string }) {
  if (!SHOW_DRAFT_MARKERS) return null;
  return (
    <span className={`inline-flex items-center rounded-sm border border-draft/50 px-1.5 py-px text-[11px] font-medium tracking-wider text-draft align-middle ${className}`}>
      {label}
    </span>
  );
}

export function TbdBadge({ className = '' }: { className?: string }) {
  return <span className={`inline-flex items-center rounded-sm bg-sand px-1.5 py-px text-[11px] font-medium tracking-wider text-ink-2 ${className}`}>未確定</span>;
}

/** 写真・動画が未提供の場所に置く枠。仮素材であることを明示する */
export function PlaceholderMedia({ label, kind = 'photo', ratio = '4 / 3', className = '' }:
  { label: string; kind?: 'photo' | 'video'; ratio?: string; className?: string }) {
  if (!SHOW_DRAFTS) return null; // 公開時は仮素材の枠を出さない
  const Icon = kind === 'video' ? Play : ImageOff;
  return (
    <div role="img" aria-label={`仮素材：${label}`}
      className={`relative grid place-items-center overflow-hidden bg-sand text-ink-2 ${className}`} style={{ aspectRatio: ratio }}>
      <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(135deg,transparent_0_14px,var(--color-sand-2)_14px_15px)]" />
      <div className="relative grid justify-items-center gap-3 px-6 text-center">
        <span className={`grid size-14 place-items-center rounded-full border border-ink-3/50 ${kind === 'video' ? 'bg-paper/70' : ''}`}>
          <Icon aria-hidden className="size-6" strokeWidth={1.25} />
        </span>
        <p className="text-sm leading-relaxed">{label}</p>
        <span className="rounded-sm bg-paper/80 px-2 py-0.5 text-[11px] tracking-widest">仮素材 ・ 差し替え予定</span>
      </div>
    </div>
  );
}

export function Note({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-[13px] leading-relaxed text-ink-3 ${className}`}>{children}</p>;
}
