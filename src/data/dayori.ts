/**
 * 中島だより：媒体情報と各号のデータ。
 *
 * ■ 新しい号を追加する手順
 *   1) npm run dayori:import -- --slug vol04 --src "<ページ画像のフォルダ>" [--pdf "<PDF>"]
 *   2) 下の issues に1件追加（表示は自動で新しい順。トップページの最新号も自動で切り替わる）
 *
 * ■ ルール
 *   - 実際に発行した号だけを status: 'published' にする（未発行・制作中は 'draft' ＝ 非公開）
 *   - 紙面データ（ページ画像・PDF）が無い号は、cover / pdf を null のままにする（画面では「紙面準備中」）
 *   - verified: false は「発行月などが未確認の仮データ」。画面に「仮データ」と表示される
 *   - onlinePermission: 紙面に登場する方へのWeb掲載許可。'confirmed' になるまで本番公開しない
 */
import { asset } from '@/lib/asset';

export const dayori = {
  name: '中島だより',
  en: 'NAKAJIMA DAYORI',
  catch: '島の暮らしと、そこにある物語を届ける。',
  publisher: 'ビット（尾藤大起）',
  base: '愛媛県松山市・中島',
  format: '季刊フリーペーパー',
  /** 基本仕様。号によってページ数が異なる場合は各号の pageCount が優先 */
  spec: 'B5判・全8ページ',
  launched: '2026年4月',
  concept:
    '中島の観光情報だけではなく、島で暮らす人々の日常、文化、歴史、地域の活動などを紹介するフリーペーパー。島の魅力を、島内外の人に伝えることを目的としています。',
  disclaimer:
    '中島だよりは、松山市などの行政機関が発行する公式広報誌ではなく、ビットが自主的に制作・発行している独立した地域メディアです。',
  /** 事実（出典：10bitstudio 詳細データ.txt） */
  facts: {
    copies: '約200部（2026年夏時点）',
    places: ['中島支所', '大浦港', 'フェリー', '松山観光港 など'],
  },
  /** 紙面（vol.03 裏表紙）からの引用 */
  backCoverQuote: 'この冊子は、島の暮らしを記録し続けるための小さなメディアです。',
};

export interface Issue {
  slug: string;
  number: number;
  /** 例：2026 秋号 */
  name: string;
  /** 発行年月の表示。月が未確認なら季節まで */
  issued: string;
  /** 並べ替え用（YYYY-MM） */
  sortKey: string;
  feature: string | null;
  summary: string | null;
  /** 目次（実際の紙面の見出し） */
  contents?: { page: number; title: string }[];
  cover: string | null;
  pdf: string | null;
  /** public/dayori/<slug>/pages/{sm,lg}/NN.jpg がある */
  pageImages: boolean;
  pageCount: number;
  /** 幅 / 高さ（B5・A判は約 0.707） */
  pageRatio: number;
  status: 'published' | 'draft';
  verified: boolean;
  onlinePermission: 'confirmed' | 'pending';
}

export const issues: Issue[] = [
  {
    slug: 'vol03',
    number: 3,
    name: '2026 秋号',
    issued: '2026年 秋',
    sortKey: '2026-10',
    feature: 'この秋行きたい中島',
    summary: '中島おもろい人図鑑（柴田紘子＆木室陽）、編集長が選ぶ「この秋行きたい中島」、壁画アートを巡る島旅、2026中島トライアスロン一日密着レポ、忽那水軍の歴史など。',
    contents: [
      { page: 1, title: '表紙' },
      { page: 2, title: '中島おもろい人図鑑　柴田紘子＆木室陽' },
      { page: 4, title: 'この秋行きたい中島' },
      { page: 5, title: '中島の秋を歩く' },
      { page: 6, title: '壁画アートを巡る島旅' },
      { page: 7, title: '中島だより新聞　2026中島トライアスロン 一日密着レポ' },
      { page: 9, title: '中島の歴史　蒼海に刻まれた忽那水軍の記憶' },
      { page: 12, title: '裏表紙' },
    ],
    cover: asset('/dayori/vol03/cover.jpg'),
    pdf: asset('/dayori/vol03/issue.pdf'),
    pageImages: true,
    pageCount: 12,
    pageRatio: 0.7072,
    status: 'published',
    verified: false, // 発行月（10月？）を確認
    onlinePermission: 'pending',
  },
  {
    slug: 'vol02',
    number: 2,
    name: '2026 夏号',
    issued: '2026年 夏',
    sortKey: '2026-07',
    feature: '中島壁画巡り＆対談企画',
    summary: '中島おもろい人図鑑②（草分こはる＆明直）、ARTBOMBと歩く中島アートツアー「壁をめぐる、島の旅」、ARTBOMB対談企画、中島って？、中島の歴史②「瀬戸内の小さな島と法隆寺（後編）」など。',
    contents: [
      { page: 1, title: '表紙' },
      { page: 2, title: '中島おもろい人図鑑②　草分こはる＆明直' },
      { page: 4, title: '壁をめぐる、島の旅　ARTBOMBと歩く中島アートツアー' },
      { page: 6, title: 'ART BOMB 対談企画' },
      { page: 8, title: '中島って？' },
      { page: 9, title: '中島の歴史②　瀬戸内の小さな島と法隆寺（後編）' },
      { page: 12, title: '裏表紙' },
    ],
    cover: asset('/dayori/vol02/cover.jpg'),
    pdf: asset('/dayori/vol02/issue.pdf'),
    pageImages: true,
    pageCount: 12,
    pageRatio: 0.7084,
    status: 'published',
    verified: false, // 発行月とページ順（受け取った画像から推定）を確認
    onlinePermission: 'pending',
  },
  {
    slug: 'vol01',
    number: 1,
    name: '2026 春号（創刊号）',
    issued: '2026年4月',
    sortKey: '2026-04',
    feature: '中島おもろい人図鑑　柑橘農家 長谷部真梨',
    summary: '創刊号。中島おもろい人図鑑「島に帰り 柑橘とともに生きる」（柑橘農家・長谷部真梨さん）、壁画アートを巡る島旅、中島の歴史①「法隆寺とつながる島」。',
    contents: [
      { page: 1, title: '表紙' },
      { page: 2, title: '中島おもろい人図鑑　島に帰り 柑橘とともに生きる（長谷部真梨さん）' },
      { page: 4, title: '壁画アートを巡る島旅' },
      { page: 5, title: '中島の歴史①　法隆寺とつながる島' },
      { page: 8, title: '裏表紙' },
    ],
    cover: asset('/dayori/vol01/cover.jpg'),
    pdf: asset('/dayori/vol01/issue.pdf'),
    pageImages: true,
    pageCount: 8,
    pageRatio: 0.7083,
    status: 'published',
    verified: true, // 創刊 2026年4月（事実）。紙面は元PDF（page1〜8.pdf）から
    onlinePermission: 'pending',
  },
];

export const publishedIssues = () =>
  issues.filter((i) => i.status === 'published').sort((a, b) => b.sortKey.localeCompare(a.sortKey));
export const latestIssue = () => publishedIssues()[0];
export const getIssue = (slug: string) => publishedIssues().find((i) => i.slug === slug);
export const issueLabel = (i: Issue) => `vol.${String(i.number).padStart(2, '0')}`;
export const pageSrc = (i: Issue, n: number, size: 'sm' | 'lg') =>
  asset(`/dayori/${i.slug}/pages/${size}/${String(n).padStart(2, '0')}.jpg`);

/** 活動紹介（事実ベース）。写真は実際の紙面ページを使う */
export const activities = [
  { title: '島内での取材', text: '島で出会った「なんだか気になる人」を訪ね、話を伺います。', page: { slug: 'vol03', n: 2 } },
  { title: '地域の人々へのインタビュー', text: '「中島おもろい人図鑑」として、島で暮らす人の歩みを紹介しています。', page: { slug: 'vol03', n: 3 } },
  { title: '写真・映像による記録', text: '中島トライアスロンなど、島の行事を写真で記録しています。', page: { slug: 'vol03', n: 7 } },
  { title: '歴史・文化の記録', text: '忽那水軍など、島の歴史を資料とともにたどります。', page: { slug: 'vol03', n: 9 } },
  { title: '制作・配布', text: '取材から撮影、編集、デザインまでを一人で手がけ、島内外で配布しています。', page: null },
  { title: '関連作品', text: '中島の写真に詩を添えたポストカードも制作しています。', page: null, href: '/postcards' },
];

/**
 * 応援（寄付）。文面は募金箱の掲示物より。
 * 寄付方法・金額は未確定のため、methods は空。オンライン寄付を導入したら追加する。
 */
export const support = {
  catch: '中島の今を、未来へ。',
  lead: '中島の人々の暮らしや文化、島の記憶を残していくために、個人で制作・発行している小さな地域メディアです。',
  cost: '現在、取材・撮影・編集・デザイン・印刷などの制作費は、発行者自身が実費で負担しながら活動しています。',
  uses: [
    { title: '取材・撮影', text: '島を歩き、人に会い、写真に残すための費用' },
    { title: '編集・デザイン', text: '読みやすい紙面をつくる制作環境の整備' },
    { title: '印刷・発行', text: '紙面の印刷と、島内外への配布' },
    { title: '保存・記録', text: '写真や紙面を記録として残していくこと' },
  ],
  /** 例：{ label: 'オンラインで寄付する', href: 'https://...', kind: 'once' } */
  methods: [] as { label: string; href: string; kind: 'once' | 'monthly' }[],
  methodsNote: 'オンラインでのご寄付・継続支援の方法は準備中です。現在は、募金箱でのご支援をお願いしています。',
};
