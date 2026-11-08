import Link from 'next/link';
import { nav, site, profile, PAYMENTS } from '@/data/site';
import { credit } from '@/data/postcards';

export function Footer() {
  return (
    <footer className="mt-auto bg-charcoal text-paper">
      <div className="mx-auto max-w-[1240px] px-5 pb-28 pt-20 sm:px-8 lg:px-12 lg:pb-14">
        <p className="display text-[clamp(44px,9vw,128px)] font-semibold">{site.brand}</p>
        <p className="mincho mt-6 text-lg">{site.catch}</p>

        <div className="mt-14 grid gap-10 border-t border-paper/20 pt-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="space-y-2 text-sm text-paper/80">
            <p>写真・映像クリエイター　{profile.nickname}（{profile.name}）</p>
            <p>{profile.base}</p>
            <p className="font-latin tracking-widest">{credit}</p>
          </div>
          <nav aria-label="フッター">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-1">
              {nav.map((n) => <li key={n.href}><Link href={n.href} className="link-line">{n.ja}</Link></li>)}
              <li><Link href="/cart" className="link-line">{PAYMENTS === 'links' ? '購入方法' : 'カート'}</Link></li>
            </ul>
          </nav>
          <ul className="space-y-2 text-sm">
            <li><a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="link-line">Instagram {site.links.instagramName}</a></li>
            <li><a href={site.links.portfolio} target="_blank" rel="noopener noreferrer" className="link-line">ポートフォリオ（中島だより）</a></li>
          </ul>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-2 text-xs text-paper/70">
          <li><Link href="/tokushoho" className="link-line">特定商取引法に基づく表記</Link></li>
          <li><Link href="/privacy" className="link-line">プライバシーポリシー</Link></li>
        </ul>
        <p className="mt-4 text-xs text-paper/50">© {site.brand} / Bit. 掲載写真・詩の無断転載を禁じます。</p>
      </div>
    </footer>
  );
}
