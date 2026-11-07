/**
 * Stripe（サーバー専用）。このファイルはブラウザに送られない。
 *
 * 環境変数（.env.local / 公開先の環境変数に設定。Git には入れない）
 *   STRIPE_MODE            test | live     … テストと本番を明示的に分ける
 *   STRIPE_SECRET_KEY      rk_test_… / sk_test_…（テスト） ・ rk_live_… / sk_live_…（本番）
 *                          ※ 権限を絞った「制限付きキー（rk_）」を推奨
 *   STRIPE_WEBHOOK_SECRET  whsec_…
 *   NEXT_PUBLIC_SITE_URL   決済後に戻るURL（例：http://localhost:3100）
 */
import 'server-only';
import Stripe from 'stripe';

export type StripeMode = 'test' | 'live';

/** Dashboard で決済フローを見分けるためのラベル */
export const INTEGRATION_ID = 'postcards-checkout-qmwhzrta';

export class StripeConfigError extends Error {}

function readConfig() {
  const mode = process.env.STRIPE_MODE as StripeMode | undefined;
  const key = process.env.STRIPE_SECRET_KEY;
  if (mode !== 'test' && mode !== 'live') throw new StripeConfigError('STRIPE_MODE を test か live に設定してください');
  if (!key) throw new StripeConfigError('STRIPE_SECRET_KEY が設定されていません');
  // キーとモードが食い違っていたら止める（テストのつもりで本番に請求、などを防ぐ）
  const keyMode = /^(sk|rk)_live_/.test(key) ? 'live' : /^(sk|rk)_test_/.test(key) ? 'test' : null;
  if (!keyMode) throw new StripeConfigError('STRIPE_SECRET_KEY の形式が正しくありません（sk_ / rk_ で始まるキー）');
  if (keyMode !== mode) throw new StripeConfigError(`STRIPE_MODE=${mode} ですが、キーは ${keyMode} 用です`);
  return { mode, key };
}

let client: Stripe | null = null;
export function getStripe() {
  if (!client) {
    const { key } = readConfig();
    client = new Stripe(key, { appInfo: { name: '10bitstudio postcards' } });
  }
  return client;
}

export const stripeMode = (): StripeMode => readConfig().mode;

export function getWebhookSecret() {
  const s = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !s.startsWith('whsec_')) throw new StripeConfigError('STRIPE_WEBHOOK_SECRET が設定されていません');
  return s;
}

export function siteUrl() {
  const u = process.env.NEXT_PUBLIC_SITE_URL;
  if (!u) throw new StripeConfigError('NEXT_PUBLIC_SITE_URL が設定されていません');
  return u.replace(/\/$/, '');
}
