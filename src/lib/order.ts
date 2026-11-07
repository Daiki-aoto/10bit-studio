/**
 * 注文内容の組み立て（サーバーで実行）。
 * ブラウザから受け取るのは「商品ID と 数量」だけ。金額はここで data/ から計算し直す。
 * カートと同じ summarize() を使うので、画面の合計と請求額は必ず一致する。
 */
import { postcards, SET_ID, getPostcard } from '@/data/postcards';
import { postcardPrice } from '@/data/pricing';
import { summarize, type CartLines } from '@/lib/pricing';

export const MAX_QTY = 30;
export const MAX_ITEMS = 100;

export class OrderError extends Error {}

/** 受け取った値を検証して、正しいカートだけを返す */
export function parseCart(input: unknown): CartLines {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new OrderError('カートの形式が正しくありません');
  const valid = new Set([SET_ID, ...postcards.map((p) => p.id)]);
  const lines: CartLines = {};
  for (const [id, raw] of Object.entries(input as Record<string, unknown>)) {
    if (!valid.has(id)) throw new OrderError(`存在しない商品です：${id}`);
    if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0 || raw > MAX_QTY) throw new OrderError('数量が正しくありません');
    if (raw > 0) lines[id] = raw;
  }
  const s = summarize(lines);
  if (s.itemCount === 0) throw new OrderError('カートが空です');
  if (s.singleCount + s.setCount > MAX_ITEMS) throw new OrderError('一度に注文できる数を超えています');
  return lines;
}

export interface OrderLine { name: string; description?: string; unitAmount: number; quantity: number }

/** Stripe に渡す明細。3枚ごとのセット価格は「3枚セット」の行として表す（マイナスの行は作らない） */
export function buildOrder(lines: CartLines) {
  const s = summarize(lines);
  const designs = Object.entries(lines)
    .filter(([id]) => id !== SET_ID)
    .map(([id, q]) => { const c = getPostcard(id)!; return `No.${c.no}×${q}`; });
  const designText = designs.join('、');
  const out: OrderLine[] = [];
  if (s.bundles > 0) out.push({ name: 'ポストカード 3枚セット', description: `絵柄：${designText}`, unitAmount: postcardPrice.bundle3, quantity: s.bundles });
  if (s.rest > 0) out.push({ name: 'ポストカード 1枚', description: s.bundles ? '3枚セットに含まれない分' : `絵柄：${designText}`, unitAmount: postcardPrice.single, quantity: s.rest });
  if (s.setCount > 0) out.push({ name: 'ポストカード 全10種類セット', description: '10種類を各1枚', unitAmount: postcardPrice.setAll, quantity: s.setCount });

  const total = out.reduce((a, l) => a + l.unitAmount * l.quantity, 0);
  if (total !== s.subtotal) throw new OrderError('金額の計算が一致しません'); // 念のための整合チェック
  return {
    lines: out,
    total,
    summary: s,
    /** Stripe の metadata（500文字以内）。注文内容をダッシュボードで確認できるように */
    metadata: {
      cart: Object.entries(lines).map(([id, q]) => `${id}:${q}`).join(',').slice(0, 500),
      designs: designText.slice(0, 500),
      item_count: String(s.itemCount),
    },
  };
}

/** 注文番号（Checkout Session ID から作る。重複しない） */
export const orderNumber = (sessionId: string, created: number) => {
  const d = new Date(created * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `OD-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${sessionId.slice(-6).toUpperCase()}`;
};
