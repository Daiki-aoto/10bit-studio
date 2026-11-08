/**
 * Stripe の支払いリンク（GitHub Pages 用の決済）。
 * URL は `npm run stripe:links` で自動作成され、paymentLinks.json に保存される（手で書き換えなくてよい）。
 * NEXT_PUBLIC_STRIPE_LINKS_MODE=live で本番用、それ以外はテスト用のリンクを使う。
 */
import data from './paymentLinks.json';
import { SET_ID } from './postcards';

type Link = { url: string } | null | undefined;
type Support = { once?: Record<string, Link>; monthly?: Record<string, Link>; free?: Link };
type Set = { single?: Record<string, Link>; bundle3?: Link; setAll?: Link; support?: Support };

const mode = process.env.NEXT_PUBLIC_STRIPE_LINKS_MODE === 'live' ? 'live' : 'test';
const links = ((data as Record<string, unknown>)[mode] ?? {}) as Set;

export const linksMode = mode;

/** 中島だよりの応援（1回・毎月・自由な金額）の支払いリンク */
export const supportLinks = {
  once: Object.entries(links.support?.once ?? {}).map(([amount, l]) => ({ amount: Number(amount), url: l?.url ?? null })).filter((x) => x.url).sort((a, b) => a.amount - b.amount),
  monthly: Object.entries(links.support?.monthly ?? {}).map(([amount, l]) => ({ amount: Number(amount), url: l?.url ?? null })).filter((x) => x.url).sort((a, b) => a.amount - b.amount),
  free: links.support?.free?.url ?? null,
};
export const singleLink = (id: string) => links.single?.[id]?.url ?? null;
export const bundle3Link = () => links.bundle3?.url ?? null;
export const setAllLink = () => links.setAll?.url ?? null;
/** 商品ID（カードID または 全10種類セット）から支払いリンクを返す */
export const linkFor = (id: string) => (id === SET_ID ? setAllLink() : singleLink(id));
