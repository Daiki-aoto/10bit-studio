import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { dayori, publishedIssues, getIssue, issueLabel } from '@/data/dayori';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Container, DraftBadge, Note } from '@/components/ui/primitives';
import { Reader } from '@/components/dayori/Reader';
import { IssueCover } from '@/components/dayori/IssueCard';

/** 用意したページ以外は 404 にする */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedIssues().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<'/dayori/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const iss = getIssue(slug);
  if (!iss) return {};
  return {
    title: `${dayori.name} ${issueLabel(iss)} ${iss.name}`,
    description: iss.summary ?? `${dayori.name} ${iss.name}（${iss.issued}発行）。`,
    openGraph: iss.cover ? { images: [{ url: iss.cover }] } : undefined,
  };
}

export default async function IssuePage({ params }: PageProps<'/dayori/[slug]'>) {
  const { slug } = await params;
  const list = publishedIssues();
  const idx = list.findIndex((i) => i.slug === slug);
  if (idx < 0) notFound();
  const iss = list[idx];
  const newer = list[idx - 1];
  const older = list[idx + 1];

  return (
    <>
      <Container className="pt-8">
        <nav aria-label="パンくず" className="text-[13px] text-ink-3">
          <ol className="flex flex-wrap gap-2">
            <li><Link href="/dayori" className="link-line">中島だより</Link> /</li>
            <li><Link href="/dayori/archive" className="link-line">バックナンバー</Link> /</li>
            <li aria-current="page" className="text-charcoal">{issueLabel(iss)}</li>
          </ol>
        </nav>
      </Container>

      <Container className="grid gap-8 py-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <Reveal>
          <p className="flex flex-wrap items-center gap-3 text-sm text-ink-2">
            <span className="font-latin text-4xl font-semibold text-sea-deep">{issueLabel(iss)}</span>
            <span>{iss.name}</span><span className="text-ink-3">{iss.issued} 発行 ・ {iss.pageCount}ページ</span>
            {!iss.verified && <DraftBadge label="仮データ" />}
            {iss.onlinePermission === 'pending' && <DraftBadge label="Web掲載許可 確認中" />}
          </p>
          <h1 className="mincho mt-4 text-[clamp(24px,3vw,38px)] leading-relaxed">
            {dayori.name}{iss.feature ? `　特集「${iss.feature}」` : ` ${iss.name}`}
          </h1>
          {iss.summary && <p className="mt-4 max-w-3xl leading-loose text-ink-2">{iss.summary}</p>}
        </Reveal>
        {iss.pdf && (
          <Reveal><a href={iss.pdf} download className="inline-flex items-center gap-2 rounded-full border border-charcoal px-6 py-3 text-sm transition hover:bg-charcoal hover:text-paper">
            <Download className="size-4" strokeWidth={1.5} />PDFをダウンロード
          </a></Reveal>
        )}
      </Container>

      <div className="mx-auto max-w-[1440px] px-2 sm:px-8 lg:px-12">
        <Reader issue={iss} />
        <Note className="mt-3 px-3 sm:px-0">← → キーでページ送り、＋ − で拡大・縮小。スマートフォンは左右にスワイプしてめくれます。</Note>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        {iss.contents && (
          <Reveal>
            <h2 className="mincho text-xl">この号の内容</h2>
            <ol className="mt-5 border-t border-charcoal">
              {iss.contents.map((c) => (
                <li key={c.page}>
                  <a href={`#p=${c.page}`} className="grid grid-cols-[52px_1fr] gap-3 border-b border-line py-3 text-sm transition hover:bg-sand/40">
                    <span className="font-latin text-base text-ink-3">p.{c.page}</span><span>{c.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
        <Reveal className="grid content-start gap-6">
          <h2 className="mincho text-xl">ほかの号</h2>
          <div className="grid grid-cols-2 gap-6">
            {[{ i: newer, label: '新しい号', Icon: ArrowLeft }, { i: older, label: '前の号', Icon: ArrowRight }].map(({ i, label, Icon }) => (
              i ? (
                <Link key={label} href={`/dayori/${i.slug}`} className="group grid gap-3">
                  <span className="flex items-center gap-1 text-[13px] text-ink-2"><Icon className="size-4" />{label}</span>
                  <IssueCover issue={i} sizes="240px" className="max-w-48 transition group-hover:-translate-y-1" />
                  <span className="text-sm"><span className="font-latin text-lg">{issueLabel(i)}</span> {i.name}</span>
                </Link>
              ) : <span key={label} />
            ))}
          </div>
          <ButtonLink href="/dayori/archive" variant="ghost" className="w-fit">バックナンバー一覧</ButtonLink>
        </Reveal>
      </Container>
    </>
  );
}
