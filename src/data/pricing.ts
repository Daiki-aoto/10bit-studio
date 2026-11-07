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

export const payment: Undecided = {
  status: 'tbd',
  note: 'お支払い方法は未確定です（オンライン決済の導入を検討中）。',
};

export const returns: Undecided = {
  status: 'tbd',
  note: '返品・交換の条件は未確定です。',
};
