/**
 * ポストカードの価格・送料・支払い・返品条件。
 * 価格・送料は確定情報。支払い方法・返品条件は「未確定」として管理し、
 * 値が決まったら status を 'fixed' にして金額や本文を入れる。
 */
export const postcardPrice = {
  single: 350,
  /** 3枚セット価格。絵柄の組み合わせは自由とする想定（※適用ルールは要確認） */
  bundle3: 1000,
  setAll: 3000,
} as const;

export type Undecided = { status: 'tbd'; note: string };
export type Decided<T> = { status: 'fixed'; value: T };

export interface ShippingMethod {
  id: string;
  label: string;
  /** 送料。null = 未確定 */
  fee: number | null;
  note: string;
}

/** 送料：全国一律150円（定形郵便110円＋封筒・台紙代）。離島（中島）からでも郵便料金は全国一律 */
export const SHIPPING_FEE = 150;

export const shipping: { status: 'tbd' | 'fixed'; methods: ShippingMethod[]; note: string } = {
  status: 'fixed',
  methods: [
    { id: 'teikei', label: '定形郵便（追跡なし）', fee: SHIPPING_FEE, note: `全国一律${SHIPPING_FEE}円。定形郵便（追跡なし）でお送りします。曲がらないよう台紙を入れて発送します。` },
  ],
  note: `送料は全国一律${SHIPPING_FEE}円です（定形郵便・追跡なし）。`,
};

/** お支払い方法（Stripe の支払いリンク） */
export const payment = {
  status: 'fixed' as const,
  methods: ['クレジットカード', 'Apple Pay', 'Google Pay'],
  note: 'クレジットカード、Apple Pay、Google Pay（Stripe の決済ページ）でお支払いいただけます。',
};

/** 発送の時期 */
export const SHIP_WITHIN_DAYS = 7;
export const shipTiming = `ご注文（お支払い）確定後、${SHIP_WITHIN_DAYS}日以内に発送します。`;

/** 返品・交換（2026-11-08 本人決定） */
export const returns = {
  status: 'fixed' as const,
  note: '破損・汚れ・ご注文と異なる商品が届いた場合は、到着後7日以内にご連絡ください。送料はこちらの負担で交換します。お客さまのご都合による返品・交換はお受けできません。',
};
