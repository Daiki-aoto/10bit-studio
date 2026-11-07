import { postcardPrice, shipping, type ShippingMethod } from '@/data/pricing';
import { SET_ID } from '@/data/postcards';

export type CartLines = Record<string, number>; // productId -> qty

export const yen = (n: number) => `${n.toLocaleString('ja-JP')}円`;

export interface CartSummary {
  singleCount: number;
  setCount: number;
  /** バラ（絵柄指定）の小計：3枚ごとにセット価格を適用 */
  bundles: number;
  rest: number;
  singlesTotal: number;
  setTotal: number;
  /** セット価格適用による値引き額 */
  discount: number;
  subtotal: number;
  /** 送料。null = 未確定 */
  shippingFee: number | null;
  /** 支払い合計。送料未確定の場合は null */
  total: number | null;
  itemCount: number;
}

export function summarize(lines: CartLines, methodId?: string): CartSummary {
  const setCount = lines[SET_ID] ?? 0;
  const singleCount = Object.entries(lines)
    .filter(([id]) => id !== SET_ID)
    .reduce((a, [, q]) => a + q, 0);
  const bundles = Math.floor(singleCount / 3);
  const rest = singleCount % 3;
  const singlesTotal = bundles * postcardPrice.bundle3 + rest * postcardPrice.single;
  const setTotal = setCount * postcardPrice.setAll;
  const subtotal = singlesTotal + setTotal;
  const itemCount = singleCount + setCount * 10;
  const method: ShippingMethod | undefined =
    shipping.methods.find((m) => m.id === methodId) ?? shipping.methods[0];
  const shippingFee = itemCount === 0 ? 0 : method?.fee ?? null;
  return {
    singleCount, setCount, bundles, rest, singlesTotal, setTotal,
    discount: singleCount * postcardPrice.single - singlesTotal,
    subtotal, shippingFee,
    total: shippingFee === null ? null : subtotal + shippingFee,
    itemCount,
  };
}

/** あと何枚で次の3枚セット価格になるか（0 なら該当なし） */
export function nextBundleHint(singleCount: number) {
  const rest = singleCount % 3;
  if (singleCount === 0 || rest === 0) return null;
  const need = 3 - rest;
  const add = postcardPrice.bundle3 - rest * postcardPrice.single;
  return { need, add };
}
