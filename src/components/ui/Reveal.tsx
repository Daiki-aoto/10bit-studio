'use client';

import { useEffect, useRef, type CSSProperties, type ElementType, type ComponentPropsWithoutRef } from 'react';

type Props = {
  as?: ElementType;
  /** reveal: フェードアップ / img: 写真フェード / rise: 行ごとの文字出現 */
  variant?: 'reveal' | 'img' | 'rise';
  delay?: number;
} & ComponentPropsWithoutRef<'div'>;

/** 画面に入ったら is-in を付けるだけの小さな部品 */
export function Reveal({ as, variant = 'reveal', delay = 0, className = '', style, ...rest }: Props) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cls = variant === 'img' ? 'reveal-img' : variant === 'rise' ? 'rise' : 'reveal';
  return <Tag ref={ref} className={`${cls} ${className}`} style={{ ...style, '--delay': `${delay}ms` } as CSSProperties} {...rest} />;
}

/** 見出しを行単位でせり上げる。lines は表示する行の配列 */
export function RiseText({ lines, as = 'h2', className = '', delay = 0 }: { lines: string[]; as?: ElementType; className?: string; delay?: number }) {
  return (
    <Reveal as={as} variant="rise" delay={delay} className={className} aria-label={lines.join('')}>
      {lines.map((l, i) => (
        <span key={i} aria-hidden="true"><span style={{ '--i': i } as React.CSSProperties}>{l}</span></span>
      ))}
    </Reveal>
  );
}
