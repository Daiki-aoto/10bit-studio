'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { nav, site, PAYMENTS } from '@/data/site';
import { useCart } from '@/components/cart/CartProvider';

export function Header() {
  const pathname = usePathname();
  const { summary, ready, bump } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pop, setPop] = useState(false);
  const [menuTop, setMenuTop] = useState(64);
  const headRef = useRef<HTMLElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!bump) return;
    setPop(true);
    const t = setTimeout(() => setPop(false), 500);
    return () => clearTimeout(t);
  }, [bump]);
  useEffect(() => {
    if (open && headRef.current) setMenuTop(Math.max(0, headRef.current.getBoundingClientRect().bottom));
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const count = ready ? summary.itemCount : 0;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
    <header ref={headRef} className={`sticky top-0 z-40 transition-colors duration-500 ${scrolled || open ? 'bg-paper/90 backdrop-blur-md border-b border-line' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-5 sm:px-8 lg:h-[72px] lg:px-12">
        <Link href="/" className="mr-auto font-latin text-[19px] font-semibold tracking-[.16em] sm:text-[21px]" aria-label={`${site.brand} ホーム`}>
          {site.brand}
        </Link>

        <nav aria-label="メイン" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.slice(1).map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}
                  className={`font-latin text-[15px] font-semibold tracking-[.12em] link-line ${isActive(n.href) ? 'text-sea-deep [background-size:100%_1px]' : ''}`}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {PAYMENTS !== 'links' && <Link href="/cart" className="relative grid size-11 place-items-center rounded-full hover:bg-sand/70 transition" aria-label={`カート（${count}点）`}>
          <ShoppingBag className="size-[22px]" strokeWidth={1.4} aria-hidden />
          {count > 0 && (
            <span className={`absolute -right-0.5 -top-0.5 grid min-w-5 h-5 place-items-center rounded-full bg-sea-deep px-1 text-[11px] font-medium text-paper transition-transform ${pop ? 'scale-125' : 'scale-100'}`}>
              {count}
            </span>
          )}
        </Link>}

        <button type="button" onClick={() => setOpen((v) => !v)} className="grid size-11 place-items-center rounded-full hover:bg-sand/70 lg:hidden"
          aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}>
          {open ? <X className="size-6" strokeWidth={1.4} /> : <Menu className="size-6" strokeWidth={1.4} />}
        </button>
      </div>

    </header>

      {/* スマホ用メニュー */}
      <div id="mobile-menu" hidden={!open} style={{ top: menuTop }} className="lg:hidden fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-paper animate-page-in">
        <nav aria-label="メイン（スマホ）" className="px-5 py-8 sm:px-8">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex items-baseline justify-between py-5" aria-current={isActive(n.href) ? 'page' : undefined}>
                  <span className="font-latin text-3xl font-medium">{n.label}</span>
                  <span className="text-sm text-ink-2">{n.ja}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link href="/postcards" className="rounded-full bg-sea-deep py-4 text-center text-paper">ポストカードを見る</Link>
            <Link href="/memory-movie" className="rounded-full border border-charcoal py-4 text-center">思い出ムービーを相談する</Link>
          </div>
        </nav>
      </div>
    </>
  );
}
