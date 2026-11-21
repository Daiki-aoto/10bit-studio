import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { postcards } from '@/data/postcards';
import { publishedIssues } from '@/data/dayori';
import { CALENDAR_ON_SALE } from '@/data/calendar';

/** 静的ファイルとして書き出す（GitHub Pages 用） */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/about', '/shop', '/postcards', '/postcards/set', '/memory-movie', '/video-production', '/contact',
    '/dayori', '/dayori/archive', '/tokushoho', '/privacy', ...(CALENDAR_ON_SALE ? ['/calendar'] : []), ...publishedIssues().map((i) => `/dayori/${i.slug}`),
    ...postcards.map((p) => `/postcards/${p.id}`)];
  return paths.map((p) => ({ url: `${site.url}${p}/` }));
}
