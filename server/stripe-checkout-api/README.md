# Stripe Checkout（サーバー版）— 現在は未使用

GitHub Pages はサーバーがないため、この API（決済画面の作成・Webhook・注文状況）は公開用ビルドから外しています。
いまの決済は **Stripe の支払いリンク**（`npm run stripe:links` → `src/data/paymentLinks.json`）です。

Vercel など Node が動く公開先に移るときは：
1. `api/` を `src/app/api/` に戻す
2. `NEXT_PUBLIC_PAYMENTS=stripe` にし、`STRIPE_MODE`・`STRIPE_SECRET_KEY`・`STRIPE_WEBHOOK_SECRET`・`NEXT_PUBLIC_SITE_URL` を設定
3. 関連コード：`src/lib/stripe/server.ts`・`src/lib/order.ts`・`src/lib/fulfillment.ts`・`src/components/cart/Checkout.tsx`（そのまま残してある）
