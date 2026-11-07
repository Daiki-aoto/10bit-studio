/**
 * ポストカードの価格・送料・支払い・返品条件。
 * 価格は確定情報。送料・発送方法・支払い方法・返品条件は「未確定」として管理し、
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

export const shipping: { status: 'tbd' | 'fixed'; methods: ShippingMethod[]; note: string } = {
  status: 'tbd',
  methods: [
    { id: 'post', label: '郵送', fee: null, note: '発送方法・送料は未確定です。確定後にご案内します。' },
  ],
  note: '送料・発送方法は現在調整中です。',
};

export const payment: Undecided = {
  status: 'tbd',
  note: 'お支払い方法は未確定です（オンライン決済の導入を検討中）。',
};

export const returns: Undecided = {
  status: 'tbd',
  note: '返品・交換の条件は未確定です。',
};
