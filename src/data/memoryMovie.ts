/**
 * 思い出ムービーの料金・条件（変更しやすいようにここで一元管理）。
 * 出典：開発指示書・10bitstudio 詳細データ.txt
 */
export const memoryMovie = {
  concept: '大切な思い出を、未来に残す。',
  lead: 'スマートフォンやカメラに眠っている写真・動画を、音楽やテロップと組み合わせて、何度でも見返したくなる映像に仕上げます。',
  priceNote: '料金は目安です。素材の状態や量、制作内容によって変わる場合があります。お見積もりでご確認ください。',
};

export interface Plan {
  id: 'ume' | 'take' | 'matsu';
  name: string;
  en: string;
  price: number;
  /** 「〜」表記 */
  from: boolean;
  specs: { label: string; value: string }[];
  note?: string;
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'ume', name: '梅', en: 'UME', price: 5000, from: true,
    specs: [
      { label: '完成尺', value: '3分以内' },
      { label: '写真素材', value: '約50枚まで' },
      { label: '動画素材', value: '合計10分以内' },
      { label: '修正', value: '3回まで' },
    ],
  },
  {
    id: 'take', name: '竹', en: 'TAKE', price: 10000, from: true, featured: true,
    specs: [
      { label: '完成尺', value: '5分以内' },
      { label: '写真素材', value: '約50枚まで' },
      { label: '動画素材', value: '合計30分以内' },
      { label: '修正', value: '3回まで' },
    ],
  },
  {
    id: 'matsu', name: '松', en: 'MATSU', price: 30000, from: true,
    specs: [
      { label: '内容', value: 'オーダーメイド制作' },
      { label: '構成・演出', value: '柔軟に対応' },
      { label: '修正', value: '原則無制限' },
      { label: 'お見積もり', value: '事前相談による個別見積もり' },
    ],
  },
];

export const options = [
  { label: '法人・団体でのご利用', price: '＋3,000円' },
  { label: '出張撮影', price: '5,000円／時間（最低1時間）' },
  { label: 'その他の追加作業', price: '内容に応じて個別見積もり' },
];

export const flow = [
  { title: 'お問い合わせ', text: '希望する映像の内容や用途をご相談ください。' },
  { title: '素材の確認', text: '写真・動画の枚数や内容を確認します。' },
  { title: 'お見積もり', text: '内容に合わせて料金と納期をご提案します。' },
  { title: '制作開始', text: '写真・映像・音楽・テロップを組み合わせて編集します。' },
  { title: '確認・修正', text: '完成映像をご確認いただき、必要に応じて修正します。' },
  { title: '納品', text: '完成した映像データを納品します。' },
];

export const uses = ['家族', '誕生日', '結婚', '卒業', '学校行事', '地域イベント', '企業', 'その他'];

/** よくある質問（仮原稿：回答内容は本人確認のうえ公開） */
export const faq = {
  draft: true,
  items: [
    { q: '写真だけでも作れますか？', a: 'はい、写真だけでもご相談いただけます。枚数や内容を伺ってから、合うプランをご提案します。' },
    { q: '素材はどうやって渡せばいいですか？', a: 'お問い合わせのあと、素材の受け渡し方法をご案内します。' },
    { q: '使う音楽は選べますか？', a: 'ご希望を伺います。著作権の扱いが必要な楽曲は、ご相談のうえで対応を決めます。' },
    { q: '納期はどのくらいですか？', a: '素材の量や内容によって変わります。お見積もりの際に、納期もあわせてご提案します。' },
    { q: 'フォームを送ったら、注文は確定しますか？', a: 'いいえ。フォームはご相談・お見積もり依頼の受付です。内容と料金をご確認いただいたうえで、正式なご依頼となります。' },
  ],
};
