import Link from 'next/link';
import { Container } from '@/components/ui/primitives';

/** 特定商取引法に基づく表記・プライバシーポリシーなどの文書ページの共通の枠 */
export function LegalPage({ en, title, updated, children }: { en: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <Container className="pb-24 pt-14 lg:pt-20">
      <div className="max-w-3xl">
      <p className="eyebrow">{en}</p>
      <h1 className="mincho mt-6 text-[clamp(26px,3.6vw,40px)] leading-[1.5]">{title}</h1>
      <div className="mt-12 grid gap-12 text-[15px] leading-loose text-ink-2">{children}</div>
      <p className="mt-16 border-t border-line pt-6 text-sm text-ink-3">{updated}</p>
      </div>
    </Container>
  );
}

/** 見出し＋本文のまとまり */
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mincho text-xl text-charcoal">{title}</h2>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

/** 項目名と内容の表（スマホでは縦に並ぶ） */
export function LegalTable({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="border-t border-charcoal">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
          <dt className="font-medium text-charcoal">{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export const ContactLink = ({ children = 'お問い合わせフォーム' }: { children?: React.ReactNode }) => (
  <Link href="/contact" className="underline">{children}</Link>
);
