import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Noto_Sans_JP, Shippori_Mincho_B1 } from 'next/font/google';
import { CartProvider } from '@/components/cart/CartProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartToast, DemoBanner } from '@/components/layout/Chrome';
import { site, profile } from '@/data/site';
import './globals.css';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-cormorant', display: 'swap' });
const shippori = Shippori_Mincho_B1({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-shippori', display: 'swap', preload: false });
const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-noto', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.brand}｜写真と詩のポストカード・映像制作`, template: `%s｜${site.brand}` },
  description: site.description,
  openGraph: { type: 'website', locale: 'ja_JP', siteName: site.brand, description: site.description },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#f7f5f0' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  alternateName: profile.nickname,
  jobTitle: profile.role,
  address: { '@type': 'PostalAddress', addressRegion: '愛媛県', addressLocality: '松山市' },
  sameAs: [site.links.instagram, site.links.portfolio],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${shippori.variable} ${noto.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-paper focus:px-4 focus:py-2">本文へ移動</a>
        <CartProvider>
          <DemoBanner />
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <CartToast />
        </CartProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
