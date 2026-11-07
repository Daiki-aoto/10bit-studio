/**
 * 映像制作サービス。
 * 制作実績は「事実として確認できるもの」だけを掲載する。取引先名・未確認の案件は載せない。
 */
import { asset } from '@/lib/asset';
export const videoServices = [
  { title: '企業・店舗のPR動画', en: 'Promotion' },
  { title: '商品紹介動画', en: 'Product' },
  { title: '観光・地域紹介動画', en: 'Local' },
  { title: 'インタビュー動画', en: 'Interview' },
  { title: 'イベント撮影・記録映像', en: 'Event' },
  { title: 'YouTube動画編集', en: 'YouTube' },
  { title: 'SNS向けショート動画', en: 'Short' },
  { title: '撮影から編集までの一括対応', en: 'All in one' },
];

/** 経験・実績（事実ベース・取引先名なし）。出典：10bitstudio 詳細データ.txt */
export const experience = {
  draft: true,
  items: [
    { title: 'ケーブルテレビのテレビカメラマン', text: '番組・中継などの撮影業務に従事（2024年5月〜2025年3月）' },
    { title: 'YouTube 対談動画の編集', text: 'オーナー対談動画などの編集を担当' },
    { title: '松山デザインウィーク in 中島', text: '文化センターでの映像制作、写真・詩の展示に参加（2026年10月）' },
  ],
};

export const videoFlow = {
  draft: true,
  items: [
    { title: 'ご相談', text: '目的・使う場所・ご予算・時期を伺います。' },
    { title: '企画・お見積もり', text: '構成案と料金・スケジュールをご提案します。' },
    { title: '撮影', text: '中島をはじめ、松山周辺での撮影に対応します。' },
    { title: '編集', text: 'Premiere Pro を中心に、テロップ・音楽を含めて仕上げます。' },
    { title: '確認・修正', text: 'ご確認いただき、修正を反映します。' },
    { title: '納品', text: '用途に合わせた形式で納品します。' },
  ],
};

export const videoPricing = {
  draft: true,
  text: '料金は内容・尺・撮影日数などに応じて個別にお見積もりします。まずはお気軽にご相談ください。',
};

/**
 * 映像制作実績（WORKS）。公開済みの作品だけを載せる。
 * 追加するときは1件足すだけ。thumbnail は public/works/ に保存した画像（YouTube へ事前に通信しないため）
 *   curl -o public/works/<id>.jpg https://i.ytimg.com/vi/<id>/maxresdefault.jpg
 */
export interface VideoWork {
  youtubeId: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  /** 担当（確認済みの内容だけ） */
  credits: string[];
  thumbnail: string;
  year?: string;
}

export const videoWorks: VideoWork[] = [
  {
    youtubeId: 'pej2fsbvRcI',
    title: '『中島観光ガイド』この秋行きたい中島',
    subtitle: '〜グルメ・乗馬・アート！秋の島を満喫する1日〜',
    description: '愛媛県松山市沖に位置する中島の魅力を紹介する観光ガイド映像。島のグルメや乗馬、アートなどを通して、中島で過ごす秋の1日を映像で紹介しています。',
    category: '観光・地域紹介',
    credits: [],
    thumbnail: asset('/works/pej2fsbvRcI.jpg'),
    year: '2026',
  },
];

export const youtubeUrl = (id: string) => `https://youtu.be/${id}`;
/** プライバシー強化モード（Cookie を使わない埋め込み） */
export const youtubeEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
