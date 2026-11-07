/** フォーム共通の入力チェック。空文字を返したら OK */
export type Rule = (v: string) => string;

const toHalf = (s: string) => s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

export const rules = {
  required: (label: string): Rule => (v) => (v.trim() ? '' : `${label}を入力してください`),
  select: (label: string): Rule => (v) => (v ? '' : `${label}を選んでください`),
  kana: (v: string) =>
    !v.trim() ? 'ふりがなを入力してください' : /^[ぁ-んゔー\s　]+$/.test(v.trim()) ? '' : 'ひらがなで入力してください',
  email: (v: string) =>
    !v.trim()
      ? 'メールアドレスを入力してください'
      : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'メールアドレスの形式を確認してください',
  telOptional: (v: string) => {
    const d = toHalf(v).replace(/[\s\-‐－ー()（）]/g, '');
    return !d || /^0\d{9,10}$/.test(d) ? '' : '電話番号は10〜11桁の数字で入力してください';
  },
  tel: (v: string) => {
    const d = toHalf(v).replace(/[\s\-‐－ー()（）]/g, '');
    return !d ? '電話番号を入力してください' : /^0\d{9,10}$/.test(d) ? '' : '電話番号は10〜11桁の数字で入力してください';
  },
  zip: (v: string) =>
    !v.trim() ? '郵便番号を入力してください' : /^\d{3}-?\d{4}$/.test(toHalf(v).trim()) ? '' : '郵便番号は7桁で入力してください（例：791-4501）',
  maxLen: (label: string, n: number): Rule => (v) => (v.length <= n ? '' : `${label}は${n}文字以内で入力してください`),
};

export function validate<T extends Record<string, string>>(values: T, schema: Partial<Record<keyof T, Rule[]>>) {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key of Object.keys(schema) as (keyof T)[]) {
    for (const rule of schema[key] ?? []) {
      const msg = rule(values[key] ?? '');
      if (msg) { errors[key] = msg; break; }
    }
  }
  return errors;
}
