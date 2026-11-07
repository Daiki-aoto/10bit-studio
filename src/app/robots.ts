import type { MetadataRoute } from 'next';
import { site, DEMO_MODE } from '@/data/site';

/** 静的ファイルとして書き出す（GitHub Pages 用） */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // デモ公開中は検索エンジンに載せない
  if (DEMO_MODE) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/', disallow: '/cart' }, sitemap: `${site.url}/sitemap.xml` };
}
