/**
 * 送信処理の窓口（現在はデモ）。
 * 本番化するときは、この関数の中身だけを差し替える：
 *   - 注文      : Stripe Checkout のセッション作成（Route Handler / Server Action 経由）
 *   - 思い出ムービー・お問い合わせ : メール通知（Resend 等）やデータベース保存
 * 画面側は { ok, id } を受け取るだけなので、差し替えても UI は変更不要。
 */
import { DEMO_MODE } from '@/data/site';

export type SubmitKind = 'order' | 'memory-movie' | 'contact';
export type SubmitResult = { ok: true; id: string; demo: boolean } | { ok: false; message: string };

const PREFIX: Record<SubmitKind, string> = { order: 'OD', 'memory-movie': 'MM', contact: 'CT' };

function makeId(kind: SubmitKind) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${PREFIX[kind]}-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rand}`;
}

export async function submit(kind: SubmitKind, payload: unknown): Promise<SubmitResult> {
  if (DEMO_MODE) {
    // デモ：どこにも送信しない（開発時の確認用にコンソールへ出す）
    if (process.env.NODE_ENV !== 'production') console.info(`[demo submit] ${kind}`, payload);
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true, id: makeId(kind), demo: true };
  }
  try {
    const res = await fetch(`/api/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { id: string };
    return { ok: true, id: data.id, demo: false };
  } catch {
    return { ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' };
  }
}
