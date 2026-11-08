/**
 * 送信処理の窓口。
 *   - 思い出ムービー・お問い合わせ : Web3Forms 経由でメール通知（サーバー不要。キーは site.ts の FORM_ACCESS_KEY）
 *   - 注文 : サーバー版（/api/order）。GitHub Pages では支払いリンクを使うため通らない
 * 画面側は { ok, id } を受け取るだけなので、差し替えても UI は変更不要。
 */
import { DEMO_MODE, FORM_ACCESS_KEY, site } from '@/data/site';

/** フォームの送信内容。rows は「項目名 → 入力値」で、そのままメール本文になる */
export type FormPayload = { name: string; email: string; rows: Record<string, string | undefined>; botcheck?: boolean };

const SUBJECT: Record<Exclude<SubmitKind, 'order'>, string> = {
  contact: 'お問い合わせ',
  'memory-movie': '思い出ムービーのご相談',
};

async function sendForm(kind: Exclude<SubmitKind, 'order'>, p: FormPayload, id: string) {
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(p.rows)) fields[k] = v?.trim() ? v : '（未入力）';
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: FORM_ACCESS_KEY,
      subject: `【${site.brand}】${SUBJECT[kind]}（${p.name} 様）${id}`,
      from_name: `${site.brand} サイト`,
      name: p.name,
      email: p.email, // 受信メールの「返信」でお客さまに返せる
      受付番号: id,
      ...fields,
      botcheck: p.botcheck ?? false, // スパム対策（人には見えない欄）
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!res.ok || !data.success) throw new Error(String(res.status));
}

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
    if (kind !== 'order') {
      const id = makeId(kind);
      await sendForm(kind, payload as FormPayload, id);
      return { ok: true, id, demo: false };
    }
    const res = await fetch(`/api/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { id: string };
    return { ok: true, id: data.id, demo: false };
  } catch {
    return { ok: false, message: `送信できませんでした。時間をおいてもう一度お試しいただくか、Instagram の DM（${site.links.instagramName}）でご連絡ください。` };
  }
}
