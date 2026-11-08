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
 *            中島だよりの応援（1回：500/1,000/3,000円・自由な金額、毎月：500/1,000円）
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

// ---- 中島だよりの応援（2026-11-08 本人決定：お礼はメッセージのみ。毎月の応援は年4回、最新号を郵送）----
const SUPPORT_ONCE = [500, 1000, 3000];
const SUPPORT_MONTHLY = [500, 1000];
const SUPPORT_FREE = { minimum: 100, preset: 1000 };

/** 中島だよりへのお名前の掲載を選んでもらう欄 */
const nameFields = [
  { key: 'listname', label: { type: 'custom', custom: '中島だよりにお名前を載せてもよいですか' }, type: 'dropdown',
    dropdown: { options: [{ label: '載せてよい', value: 'yes' }, { label: '載せない', value: 'no' }] } },
  { key: 'displayname', label: { type: 'custom', custom: '載せるお名前（ニックネーム可・任意）' }, type: 'text', optional: true },
];
const thanks = (extra = '') => ({ type: 'hosted_confirmation', hosted_confirmation: {
  custom_message: `中島だよりを応援してくださり、ありがとうございます。いただいたご支援は、取材・撮影・編集・印刷などの制作に大切に使わせていただきます。${extra}` } });

/** 応援用の価格（金額・毎月かどうか・自由な金額かが同じなら再利用） */
async function ensureSupportPrice(key, name, opts, existing) {
  let productId = existing?.product;
  if (productId) await stripe.products.update(productId, { name });
  else productId = (await stripe.products.create({ name, metadata: { product: key } })).id;
  if (existing?.price) {
    const p = await stripe.prices.retrieve(existing.price);
    const same = p.active && (opts.free
      ? p.custom_unit_amount?.minimum === SUPPORT_FREE.minimum && p.custom_unit_amount?.preset === SUPPORT_FREE.preset
      : p.unit_amount === opts.amount && (p.recurring?.interval ?? null) === (opts.monthly ? 'month' : null));
    if (same) return { product: productId, price: p.id };
  }
  const price = await stripe.prices.create({
    product: productId, currency: 'jpy',
    ...(opts.free ? { custom_unit_amount: { enabled: true, ...SUPPORT_FREE } } : { unit_amount: opts.amount }),
    ...(opts.monthly ? { recurring: { interval: 'month' } } : {}),
  });
  return { product: productId, price: price.id };
}

async function ensureSupportLink(key, priceInfo, monthly, existing) {
  const params = {
    line_items: [{ price: priceInfo.price, quantity: 1 }],
    custom_fields: nameFields,
    metadata: { product: key, source: 'github-pages' },
    after_completion: thanks(monthly ? '新しい号が出るたびに、ご登録の住所へ中島だよりをお送りします。' : ''),
    ...(monthly
      ? {
        shipping_address_collection: { allowed_countries: ['JP'] },
        subscription_data: { description: '中島だより 毎月の応援', metadata: { product: key } },
        custom_text: {
          shipping_address: { message: '中島だよりを年4回（新しい号が出るたびに）お送りする住所です。' },
          submit: { message: '毎月、同じ日に自動でお支払いされます。やめるときは、サイトのお問い合わせフォームからご連絡ください。' },
        },
      }
      : {
        submit_type: 'pay',
        payment_intent_data: { description: '中島だより 応援', metadata: { product: key } },
        custom_text: { submit: { message: 'お支払い完了後、ご登録のメールアドレスに領収書が届きます。' } },
      }),
  };
  if (existing?.id) {
    const cur = await stripe.paymentLinks.retrieve(existing.id, { expand: ['line_items'] });
    if (cur.line_items?.data?.[0]?.price?.id === priceInfo.price) {
      const { line_items, ...updatable } = params;
      const link = await stripe.paymentLinks.update(existing.id, updatable);
      return { id: link.id, url: link.url, ...priceInfo };
    }
    await stripe.paymentLinks.update(existing.id, { active: false });
  }
  const link = await stripe.paymentLinks.create(params);
  return { id: link.id, url: link.url, ...priceInfo };
}

result.support = { once: {}, monthly: {}, free: null };
const prevSupport = prevMode.support ?? {};
for (const amount of SUPPORT_ONCE) {
  const k = `support-once-${amount}`;
  const price = await ensureSupportPrice(k, `中島だより 応援 ${amount.toLocaleString()}円`, { amount }, prevSupport.once?.[amount]);
  result.support.once[amount] = await ensureSupportLink(k, price, false, prevSupport.once?.[amount]);
  console.log(`✓ 応援 ${amount}円`);
}
{
  const k = 'support-free';
  const price = await ensureSupportPrice(k, '中島だより 応援（金額を選んで）', { free: true }, prevSupport.free);
  result.support.free = await ensureSupportLink(k, price, false, prevSupport.free);
  console.log('✓ 応援 自由な金額');
}
for (const amount of SUPPORT_MONTHLY) {
  const k = `support-monthly-${amount}`;
  const price = await ensureSupportPrice(k, `中島だより 毎月の応援 月${amount.toLocaleString()}円`, { amount, monthly: true }, prevSupport.monthly?.[amount]);
  result.support.monthly[amount] = await ensureSupportLink(k, price, true, prevSupport.monthly?.[amount]);
  console.log(`✓ 毎月の応援 月${amount}円`);
}

const out = { ...prev, [mode]: result, updatedAt: new Date().toISOString() };
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`\n${mode === 'live' ? '本番' : 'テスト'}用の支払いリンクを ${OUT} に保存しました${site ? `（決済後の戻り先：${site}/cart/success/）` : ''}`);
