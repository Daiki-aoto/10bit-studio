/**
 * サイト全体の基本情報。
 * - `draft: true` の項目は「仮原稿／要確認」。公開前に本人が確認・修正する。
 * - SHOW_DRAFT_MARKERS を false にすると、画面上の「仮」表示を一括で消せる。
 */
export const SHOW_DRAFT_MARKERS = false;

/**
 * 仮原稿（本人の言葉として読まれる仮の文章）と仮素材の枠を表示するか。
 * false：インタビュー・読み物・FAQ回答・仮の写真枠などを隠して公開（本人確認が済んだら true に）
 */
export const SHOW_DRAFTS = false;

/** お問い合わせ・思い出ムービーのフォームの送信先が用意できているか。false の間は Instagram DM を案内 */
export const FORMS_LIVE = false;

/** デモ運用中か（注文・送信を実際に行わない）。本番連携後に false にする */
export const DEMO_MODE = false;

/**
 * ポストカードの決済方法（NEXT_PUBLIC_PAYMENTS）
 *   links  … Stripe の支払いリンク（GitHub Pages など、サーバーがない公開先）← 現在の公開方法
 *   stripe … Stripe Checkout ＋ サーバー（Vercel など。server/stripe-checkout-api を使う）
 *   それ以外 … デモ注文（どこにも送信しない）
 */
export const PAYMENTS: 'links' | 'stripe' | 'demo' =
  process.env.NEXT_PUBLIC_PAYMENTS === 'links' ? 'links' : process.env.NEXT_PUBLIC_PAYMENTS === 'stripe' ? 'stripe' : 'demo';

export const site = {
  brand: '10bitstudio',
  catch: '島の風景を、日常に持ち帰る。',
  description:
    '愛媛県松山市沖の離島・中島を拠点に活動する写真・映像クリエイター、ビット（尾藤大起）の公式サイト。中島の写真に詩を添えたポストカードの販売、思い出ムービー・映像制作のご相談を受け付けています。',
  /** 公開URL（仮）。独自ドメイン確定後に環境変数 NEXT_PUBLIC_SITE_URL で上書き */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
  links: {
    instagram: 'https://www.instagram.com/nakajima_bit/',
    instagramName: '@nakajima_bit',
    portfolio: 'https://nakajimaritodayori.com/1-1-1',
  },
  fields: ['PHOTO', 'VIDEO', 'DESIGN'] as const,
};

export const nav = [
  { href: '/', label: 'Home', ja: 'ホーム' },
  { href: '/about', label: 'About Bit', ja: 'ビットについて' },
  { href: '/postcards', label: 'Postcards', ja: 'ポストカード' },
  { href: '/dayori', label: 'Dayori', ja: '中島だより' },
  { href: '/memory-movie', label: 'Memory Movie', ja: '思い出ムービー' },
  { href: '/video-production', label: 'Video Production', ja: '映像制作' },
  { href: '/contact', label: 'Contact', ja: 'お問い合わせ' },
] as const;

/** プロフィール（事実）。出典：10bitstudio 詳細データ.txt */
export const profile = {
  name: '尾藤 大起',
  kana: 'びとう だいき',
  nickname: 'ビット',
  base: '愛媛県松山市・中島',
  role: 'フリーランス映像クリエイター・フォトグラファー',
};

/** プロフィール文（仮原稿）。 */
export const profileText = {
  draft: true,
  lead: '島の日常の、何気ない瞬間を残したい。',
  body: [
    '愛媛県松山市沖に浮かぶ離島・中島を拠点に、写真撮影や映像制作、動画編集を行っています。',
    '島の美しい風景だけでなく、そこで暮らす人々の日常や何気ない瞬間を大切にしながら、写真や映像を通じて中島の魅力を発信しています。',
    '地域の方々から依頼を受けて、記念写真やスライドショー、思い出ムービーなどの制作にも取り組んでいます。',
    '写真や映像を通じて、人と人、地域と人をつなぐことが目標です。',
  ],
};

/** インタビュー形式の本文（仮原稿）。 */
export const interview = {
  draft: true,
  items: [
    {
      q: 'なぜ、中島を撮り続けるのですか。',
      a: '観光地としての景色だけでなく、港で交わされるあいさつや、畑で働く人の手、夕方の路地。島で暮らしていると、残しておきたい瞬間がいくつもあります。それを写真や映像で、島の外の人にも、未来の島の人にも届けたいと思っています。',
    },
    {
      q: '撮影や編集で大切にしていることは。',
      a: '撮られる人が、自然体でいられること。話を聞く時間を大切にして、その人らしさが伝わる一枚、一本に仕上げることを心がけています。',
    },
    {
      q: 'これから挑戦したいことは。',
      a: '写真集とポストカードの制作、そして写真や展示を通じて、若い人と島の人が一緒に過ごせる場をつくることです。',
    },
  ],
};

/**
 * これまでの活動（事実ベース）。出典：10bitstudio 詳細データ.txt
 * 取引先名・金額は掲載しない。掲載可否は本人確認のうえ公開。
 */
export const timeline = {
  draft: true,
  items: [
    { date: '2024.05', title: 'ケーブルテレビのテレビカメラマンとして勤務（〜2025.03）' },
    { date: '2025.03', title: 'フリーランスとして独立。撮影から編集まで対応' },
    { date: '2026.04', title: '季刊の無料紙「中島だより」を創刊。編集・制作を担当' },
    { date: '2026.10', title: '「松山デザインウィーク in 中島」でポストカードを販売。写真と詩の展示、映像制作に参加' },
  ],
};

/** 主な使用ツール（事実） */
export const tools = ['Adobe Premiere Pro', 'After Effects', 'Photoshop'];
