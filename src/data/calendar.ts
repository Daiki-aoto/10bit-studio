/**
 * 2027 NAKAJIMA PHOTO CALENDAR の商品データ（一元管理）。
 * - 販売を始めるときは CALENDAR_ON_SALE を true にする（印刷が届いてから。2026-11-21 本人決定）。
 *   false のあいだは、メニュー・サイトマップ・特商法に出さず、ページの購入ボタンも「準備中」になる。
 * - 価格・送料は scripts/stripe-payment-links.mjs の CALENDAR と同じ値にする。
 * - 画像は制作データ（2027カレンダー写真候補/制作データ）の build_web_images.py で作った見本。
 */
import type { StaticImageData } from 'next/image';
import cover from '@/assets/calendar/cover.jpg';
import s01 from '@/assets/calendar/spread-01.jpg';
import s02 from '@/assets/calendar/spread-02.jpg';
import s03 from '@/assets/calendar/spread-03.jpg';
import s04 from '@/assets/calendar/spread-04.jpg';
import s05 from '@/assets/calendar/spread-05.jpg';
import s06 from '@/assets/calendar/spread-06.jpg';
import s07 from '@/assets/calendar/spread-07.jpg';
import s08 from '@/assets/calendar/spread-08.jpg';
import s09 from '@/assets/calendar/spread-09.jpg';
import s10 from '@/assets/calendar/spread-10.jpg';
import s11 from '@/assets/calendar/spread-11.jpg';
import s12 from '@/assets/calendar/spread-12.jpg';

/** 販売中か（印刷が届いたら true にして公開する） */
export const CALENDAR_ON_SALE = false;

/** 1回の注文で買える冊数。販売は30部（2026-11-21 本人決定）。Stripe は「注文の回数」でしか上限を数えられないため、
 *  1回1冊・注文30件までにして、30部ちょうどで止まるようにしている（scripts/stripe-payment-links.mjs の CALENDAR_LIMIT）。 */
export const CALENDAR_MAX_PER_ORDER = 1;
/** 販売部数 */
export const CALENDAR_STOCK = 30;

export const calendar = {
  id: 'calendar2027',
  name: '2027 NAKAJIMA PHOTO CALENDAR',
  nameJa: '中島フォトカレンダー 2027',
  /** 税込 */
  price: 1800,
  concept: '中島の風景を、毎月飾る',
  photographer: '尾藤大起（ビット）',
  cover,
  spreads: [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12] as StaticImageData[],
  /** 各月の撮影場所（カレンダーに印刷している表記のまま） */
  places: [
    '忽那八幡宮（松山市中島大浦）', '能磯城跡（松山市神浦）', '小浜集会所付近の桜（松山市小浜）', '大浦港（松山市中島大浦）',
    'ネロリの花（中島各地）', '大泊地区（松山市中島粟井）', '中島の星空（姫ヶ浜海水浴場）', '中島トライアスロンの様子（中島）',
    '熊田壁画アート（松山市熊田）', '泰ノ山からの展望（松山市中島大浦）', 'みかん畑（中島各地）', '部屋ノ鼻から見た海岸（松山市宇和間）',
  ],
  spec: [
    { label: '大きさ', value: 'A4横（297×210mm）。開いて壁に掛けると 297×420mm' },
    { label: 'ページ', value: '28ページ・中綴じ（開くと上が写真、下がその月のカレンダー）' },
    { label: '内容', value: '表紙／1〜12月／2027年の年間カレンダー／撮影地と中島の行事' },
    { label: 'カレンダー', value: '日曜始まり。祝日、前月・翌月の小さなカレンダー、毎月の「中島のイベント一覧」入り。予定を書き込めるマス' },
    { label: '掛け方', value: '吊り下げ用の穴あき（画びょう・フックで掛けられます）' },
    { label: '写真', value: '尾藤大起（ビット）' },
  ],
};

/** 送り方（Stripe の決済画面で選ぶ）。2026-11-21 本人決定 */
export const CALENDAR_SHIPPING = [
  { id: 'letterpack', label: 'レターパックライト（追跡あり・郵便受けにお届け）', fee: 430 },
  { id: 'handover', label: '中島で受け取る（手渡し・送料なし）', fee: 0 },
] as const;

export const calendarShippingNote =
  'レターパックライト（430円・追跡あり）でお送りします。中島にお住まいの方などは、決済画面で「中島で受け取る（送料なし）」を選べます。受け取りの日時・場所は、ご注文後にメールでご相談します。';

export const calendarShipTiming = 'ご注文（お支払い）確定後、7日以内に発送します。中島での受け取りは、メールで日時を決めてお渡しします。';
