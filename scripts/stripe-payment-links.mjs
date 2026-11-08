/**
 * Stripe の「支払いリンク」を作成・更新し、URL を src/data/paymentLinks.json に書き込む。
 * GitHub Pages（サーバーなし）で決済するための仕組み。
 *
 * 使い方（.env.local の STRIPE_SECRET_KEY を使う。テスト用キーならテスト用リンクができる）
 *   npm run stripe:links                              … 作成（既にあれば価格・設定を更新）
 *   npm run stripe:links -- --site https://<ユーザー名>.github.io/10bit-studio
 *                                                     … 決済後にサイトの「ありがとう」ページへ戻す
 *   npm run stripe:links -- --live --site https://…   … 本番用（.env.local の STRIPE_LIVE_SECRET_KEY を使う）
 *
 * 作るリンク：絵柄ごとの1枚（10本）・3枚セット（絵柄を3つ選ぶ）・全10種類セット
 * 価格は src/data/pricing.ts と同じ値を使う（下の PRICES を変えたら pricing.ts も合わせる）。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import Stripe from 'stripe';

const PRICES = { single: 350, bundle3: 1000, setAll: 3000 };
const SHIPPING_FEE = 150; // src/data/pricing.ts の SHIPPING_FEE と合わせる
const CARDS = [
  ['michi', '01', 'どこまでも、たどりつくまで'],
  ['imanoomoi', '02', '涙がかためた、笑顔が照らす道'],
  ['keshiki', '03', '大丈夫。と、この海が言う'],
  ['sekai', '04', '世界をみたす、あたたかな色'],
  ['umakuikanai', '05', 'あとは、上がるだけだから'],
  ['donnakotomo', '06', '未来の私へ、つなぐ灯'],
  ['sora', '07', '遠く離れても、繋がっている'],
  ['ai', '08', 'すべては、この愛から始まる'],
  ['waratte', '09', 'ありがとうと、愛してる'],
  ['watashinome', '10', '心に刻む、今のオモイ'],
];
const OUT = 'src/data/paymentLinks.json';

// ---- 設定の読み込み ----
const env = Object.fromEntries(
  (existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : '').split('\n')
    .map((l) => l.match(/^([A-Z_]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].trim()]),
);
const args = process.argv.slice(2);
// --live のときは本番用の鍵（STRIPE_LIVE_SECRET_KEY）、それ以外はテスト用の鍵（STRIPE_SECRET_KEY）を使う
const wantLive = args.includes('--live');
const keyName = wantLive ? 'STRIPE_LIVE_SECRET_KEY' : 'STRIPE_SECRET_KEY';
const key = process.env[keyName] || env[keyName];
if (!key) { console.error(`${keyName} が .env.local にありません`); process.exit(1); }
const mode = /^(sk|rk)_live_/.test(key) ? 'live' : /^(sk|rk)_test_/.test(key) ? 'test' : null;
if (!mode) { console.error(`${keyName} の形が正しくありません（sk_ または rk_ で始まる鍵）`); process.exit(1); }
if (wantLive && mode !== 'live') { console.error('--live ですが、本番用（_live_）の鍵ではありません'); process.exit(1); }
if (!wantLive && mode !== 'test') { console.error('テスト用の欄に本番用の鍵が入っています。本番は --live を付けて STRIPE_LIVE_SECRET_KEY を使ってください'); process.exit(1); }
const site = (args[args.indexOf('--site') + 1] && args.includes('--site')) ? args[args.indexOf('--site') + 1].replace(/\/$/, '') : null;
const stripe = new Stripe(key);

const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const prevMode = prev[mode] ?? {};

const common = (productKey, shippingRate) => ({
  shipping_options: [{ shipping_rate: shippingRate }],
  shipping_address_collection: { allowed_countries: ['JP'] },
  phone_number_collection: { enabled: true },
  billing_address_collection: 'auto',
  submit_type: 'pay',
  custom_text: {
    shipping_address: { message: `送料は全国一律${SHIPPING_FEE}円（定形郵便・追跡なし）です。` },
    submit: { message: 'お支払い完了後、ご登録のメールアドレスに領収書が届きます。' },
  },
  metadata: { product: productKey, source: 'github-pages' },
  payment_intent_data: { metadata: { product: productKey }, description: 'ポストカード注文' },
  ...(site ? { after_completion: { type: 'redirect', redirect: { url: `${site}/cart/success/` } } } : {}),
});

/** 商品と価格を用意（同じ商品キーがあれば再利用し、価格が変わっていたら作り直す） */
async function ensurePrice(productKey, name, description, amount, existing) {
  let productId = existing?.product;
  if (productId) {
    await stripe.products.update(productId, { name, description });
  } else {
    productId = (await stripe.products.create({ name, description, metadata: { product: productKey } })).id;
  }
  if (existing?.price) {
    const p = await stripe.prices.retrieve(existing.price);
    if (p.unit_amount === amount && p.active) return { product: productId, price: p.id };
  }
  const price = await stripe.prices.create({ product: productId, currency: 'jpy', unit_amount: amount });
  return { product: productId, price: price.id };
}

async function ensureLink(productKey, priceInfo, extra, existing) {
  const params = {
    line_items: [{ price: priceInfo.price, quantity: 1, adjustable_quantity: { enabled: true, minimum: 1, maximum: 30 } }],
    ...common(productKey, shippingRateId),
    ...extra,
  };
  if (existing?.id) {
    const cur = await stripe.paymentLinks.retrieve(existing.id, { expand: ['line_items'] });
    const samePrice = cur.line_items?.data?.[0]?.price?.id === priceInfo.price;
    if (samePrice) {
      const { line_items, ...updatable } = params; // 価格が同じなら設定だけ更新
      const link = await stripe.paymentLinks.update(existing.id, updatable);
      return { id: link.id, url: link.url, ...priceInfo };
    }
    await stripe.paymentLinks.update(existing.id, { active: false }); // 価格が変わったら古いリンクは無効に
  }
  const link = await stripe.paymentLinks.create(params);
  return { id: link.id, url: link.url, ...priceInfo };
}

/** 送料（Stripe の配送料金）。同じ金額のものがあれば再利用 */
async function ensureShippingRate(existingId) {
  if (existingId) {
    const r = await stripe.shippingRates.retrieve(existingId);
    if (r.active && r.fixed_amount?.amount === SHIPPING_FEE && r.fixed_amount?.currency === 'jpy') return r.id;
  }
  const r = await stripe.shippingRates.create({
    display_name: '定形郵便（追跡なし）',
    type: 'fixed_amount',
    fixed_amount: { amount: SHIPPING_FEE, currency: 'jpy' },
    metadata: { source: 'github-pages' },
  });
  return r.id;
}
const shippingRateId = await ensureShippingRate(prevMode.shippingRate);
console.log(`✓ 送料 ${SHIPPING_FEE}円`);

const designOptions = CARDS.map(([id, no, title]) => ({ label: `No.${no}『${title}』`.slice(0, 100), value: id }));
const result = { shippingRate: shippingRateId, single: {}, bundle3: null, setAll: null };

for (const [id, no, title] of CARDS) {
  const k = `single-${id}`;
  const price = await ensurePrice(k, `ポストカード No.${no}『${title}』`, '1枚 350円（写真：Bit／詩：sachie mine）', PRICES.single, prevMode.single?.[id]);
  result.single[id] = await ensureLink(k, price, {}, prevMode.single?.[id]);
  console.log(`✓ 1枚  No.${no}`);
}

{
  const price = await ensurePrice('bundle3', 'ポストカード 3枚セット', '好きな絵柄を3枚（同じ絵柄も可）', PRICES.bundle3, prevMode.bundle3);
  result.bundle3 = await ensureLink('bundle3', price, {
    line_items: [{ price: price.price, quantity: 1 }], // 絵柄を選ぶため、数量は1セットずつ
    custom_fields: [1, 2, 3].map((n) => ({
      key: `design${n}`, label: { type: 'custom', custom: `${n}枚目の絵柄` }, type: 'dropdown', dropdown: { options: designOptions },
    })),
  }, prevMode.bundle3);
  console.log('✓ 3枚セット');
}
{
  const price = await ensurePrice('setAll', 'ポストカード 全10種類セット', '10種類を各1枚', PRICES.setAll, prevMode.setAll);
  result.setAll = await ensureLink('setAll', price, {}, prevMode.setAll);
  console.log('✓ 全10種類セット');
}

const out = { ...prev, [mode]: result, updatedAt: new Date().toISOString() };
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`\n${mode === 'live' ? '本番' : 'テスト'}用の支払いリンクを ${OUT} に保存しました${site ? `（決済後の戻り先：${site}/cart/success/）` : ''}`);
