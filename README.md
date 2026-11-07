# 10bitstudio 公式サイト（デモ版）

写真・映像クリエイター「ビット（尾藤大起）」の公式サイト。ポストカード販売・思い出ムービー受付・映像制作の紹介。
Next.js 16（App Router）/ React 19 / TypeScript / Tailwind CSS 4 / Lucide Icons。

## 動かす
```sh
export PATH="$HOME/.local/node/bin:$PATH"
cd ~/Desktop/claude/10bitstudio/nakajima-site
npm run dev        # 開発 → http://localhost:3000
npm run build && npx next start -p 3100   # 本番ビルドで確認
```

## ページ
| URL | 内容 |
|---|---|
| `/` | HOME（メインビジュアル〜CONTACT の7セクション） |
| `/about` | ABOUT BIT（インタビュー記事風） |
| `/postcards`・`/postcards/[id]`・`/postcards/set` | 一覧・詳細（拡大表示）・全10種類セット |
| `/memory-movie` | 思い出ムービー（料金・流れ・FAQ・受注フォーム） |
| `/video-production` | 映像制作 |
| `/contact` | お問い合わせ（種類に応じて専用ページへ誘導。`?type=video` などで初期選択） |
| `/cart` | カート → お客様情報 → 確認 → 完了 |

## 文言・料金を直すとき（`src/data/`）
| ファイル | 内容 |
|---|---|
| `site.ts` | ブランド・プロフィール・インタビュー・活動歴・リンク。`DEMO_MODE`・`SHOW_DRAFT_MARKERS` |
| `postcards.ts` | 10種類の番号・タイトル・詩・画像 |
| `pricing.ts` | ポストカード価格、送料・支払い・返品（**未確定**として管理） |
| `memoryMovie.ts` | 梅・竹・松の料金と条件、オプション、流れ、FAQ |
| `videoProduction.ts` | 対応業務・経験・流れ・料金の説明 |
| `contact.ts` | お問い合わせ種別と誘導先 |

- `draft: true` の項目は **仮原稿**。画面に「仮原稿」バッジが出る。確認後に `SHOW_DRAFT_MARKERS = false` で一括非表示
- 写真・動画がない場所は「仮素材」の枠（`PlaceholderMedia`）。素材が届いたら差し替える

## 中島だより（`/dayori`）
| URL | 内容 |
|---|---|
| `/dayori` | 紹介・発行実績・活動・バックナンバー・応援 |
| `/dayori/archive` | バックナンバー一覧（新しい順） |
| `/dayori/<slug>` | 紙面ビューア（見開き/1ページ、めくり、拡大、全画面、PDF表示・ダウンロード、目次） |

**新しい号を載せる手順**
1. 紙面を取り込む（ページ画像のフォルダから Web用画像・表紙・B5のPDFを作る。元PDFがあれば `--pdf` で指定）
   ```sh
   npm run dayori:import -- --slug vol04 --src "$HOME/Desktop/2026冬号　本誌"
   ```
2. `src/data/dayori.ts` の `issues` に1件追加（号数・名前・発行・特集・紹介文・目次・`status: 'published'`）
3. 一覧・トップページの「最新号」は自動で切り替わる

- 紙面データが無い号は `cover` / `pdf` を `null`、`pageImages: false` のまま → 「準備中」の仮表示
- `verified: false` は仮データ（「仮データ」バッジ）。`onlinePermission` は紙面に登場する方のWeb掲載許可
- 寄付方法が決まったら `support.methods` に追加するとボタンが表示される
- pdf.js の配布ファイルは `npm run dev / build` の前に `public/pdfjs` へ自動コピー

## 注意：iCloud（デスクトップ同期）
このフォルダはデスクトップ＝iCloud 同期下にあり、「Macのストレージを最適化」で `node_modules` などが
クラウドに退避されると `next` が固まる。対処：Finder でフォルダを右クリック →「今すぐダウンロード」、
またはプロジェクトを iCloud 外（例：`~/dev/`）へ移す。

## 未実装（デモ）
- 注文・相談・お問い合わせの **送信**（`src/lib/submit.ts` がデモ。どこにも送らない）
- 決済（Stripe などを想定）、メール通知、受注管理・データベース
- 送料・発送方法・支払い方法・返品条件（未確定のため金額・文面を入れていない）

## 本番化の手順（目安）
1. 未確定事項を決めて `pricing.ts` を更新（`fee` に金額、`status: 'fixed'`）
2. `src/app/api/{order,memory-movie,contact}/route.ts` を作り、メール送信（Resend など）や DB 保存を実装
3. 決済は Stripe Checkout を Route Handler で作成し、`submit('order')` から遷移
4. `site.ts` の `DEMO_MODE = false`、`NEXT_PUBLIC_SITE_URL` に本番URLを設定（robots が公開設定になる）
5. プロフィール写真・制作実績・サンプル動画を `src/assets/` に追加して差し替え

## トップページの動画（`src/data/media.ts`）
- 動画は `public/videos/` に置き、`media.ts` の `sources`（PC用・スマホ用）、`poster`（読み込み中）、`fallback`（再生できないとき）のパスを書き換える
- 自動再生・ミュート・ループ・インライン再生。画面外では停止、通信量節約・「視差効果を減らす」設定では自動再生しない
- 軽量化（ffmpeg 不要・macOS 標準）：
  ```sh
  avconvert -s 元動画.mp4 -p Preset1920x1080 -o public/videos/xxx-1080.mp4 --replace   # PC用
  avconvert -s 元動画.mp4 -p Preset960x540  -o public/videos/xxx-540.mp4  --replace   # スマホ用
  qlmanage -t -s 1920 -o /tmp public/videos/xxx-1080.mp4                               # サムネイル（png）
  ```

## Stripe 決済（ポストカード）
カート →「確認」→ Stripe の決済ページ（氏名・メール・住所・カード／Apple Pay／Google Pay）→ `/cart/success`。
キャンセル時は `/cart/cancel`（カートはそのまま）。送料は当面 0円（別途案内）。注文の記録は Stripe ダッシュボード。

| ファイル | 役割 |
|---|---|
| `src/app/api/checkout/route.ts` | 決済画面の作成。**金額はサーバーで再計算**（ブラウザの金額は使わない）。冪等キーで二重作成を防止 |
| `src/app/api/stripe/webhook/route.ts` | 署名を検証し、`checkout.session.completed` / `async_payment_succeeded` で注文確定 |
| `src/app/api/checkout/session/route.ts` | 成功画面の表示用（状態の確認のみ。確定はしない） |
| `src/lib/order.ts` | カートの検証・明細づくり（3枚セットは「3枚セット」行で表現） |
| `src/lib/fulfillment.ts` | 注文の記録（PaymentIntent に注文番号と処理済みの印 → 二重処理しない）。DB・独自メールに替えるときはここ |
| `src/lib/stripe/server.ts` | Stripe 接続・環境変数チェック（テスト／本番の取り違えを防止） |

### 初回設定（テストモード）
1. `.env.example` をコピーして `.env.local` を作る（Git には入らない）
2. Stripe ダッシュボード → 開発者 → API キー → **制限付きキー**を作成（推奨）。権限：Checkout Sessions「書き込み」、PaymentIntents「書き込み」。`rk_test_…` を `STRIPE_SECRET_KEY` に
3. Stripe CLI を入れてログイン：`brew install stripe/stripe-cli/stripe` → `stripe login`
4. Webhook を手元に転送：`stripe listen --forward-to localhost:3100/api/stripe/webhook` → 表示された `whsec_…` を `STRIPE_WEBHOOK_SECRET` に
5. 起動：`npm run build && npx next start -p 3100`（`NEXT_PUBLIC_*` はビルド時に反映されるので、変えたら再ビルド）
6. テストカード `4242 4242 4242 4242`（有効期限は未来の日付、CVC は任意）で購入 → ダッシュボードの「支払い」に注文番号つきで記録される

### ダッシュボードの設定
- **支払い方法**（設定 → 決済 → 決済手段）：カード・Apple Pay・Google Pay を有効に（コードの変更は不要）
- **領収書メール**（設定 → ビジネス → カスタマーメール）：「成功した支払い」をオン
- 本番：Webhook エンドポイント `https://<公開URL>/api/stripe/webhook` を登録（イベント：`checkout.session.completed`・`checkout.session.async_payment_succeeded`・`checkout.session.async_payment_failed`）

### 本番切り替え
公開先（Vercel など Node が動く所）の環境変数に `STRIPE_MODE=live`・本番キー（`rk_live_…`）・本番の `whsec_…`・本番 URL を設定。
モードとキーが食い違うと決済を開始しない。`src/data/site.ts` の `DEMO_MODE` を false に。

## GitHub Pages で公開（現在の公開方法）
- 公開URL：`https://<GitHubユーザー名>.github.io/10bit-studio/`
- `main` ブランチに push すると `.github/workflows/deploy-pages.yml` が自動でビルド（`npm run build:pages` → `out/`）して公開
- 初回だけ：GitHub のリポジトリ → Settings → Pages → Source を **GitHub Actions** に
- 決済は Stripe の**支払いリンク**（サーバー不要）。リンクは `npm run stripe:links` で作成・更新 → `src/data/paymentLinks.json`
  - 公開URLが決まったら：`npm run stripe:links -- --site https://<ユーザー名>.github.io/10bit-studio`（決済後にサイトへ戻る）
  - 本番：`.env.local` に本番キーを入れて同じコマンド → GitHub の Settings → Variables に `STRIPE_LINKS_MODE=live`
- 画像・動画・PDF のURLは `src/lib/asset.ts` の `asset()` を通す（`/10bit-studio` が自動で付く）
- 手元で確認：`npm run build:pages` → `out/` を `/10bit-studio/` で配信して表示
- サーバー版の決済（Stripe Checkout・Webhook）は `server/stripe-checkout-api/` に保管（Vercel 等に移るとき用）
