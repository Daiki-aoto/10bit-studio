import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { dayori, issueLabel, type Issue } from '@/data/dayori';
import { Reveal } from '@/components/ui/Reveal';
import { DraftBadge } from '@/components/ui/primitives';

/** 表紙。画像が無い号は「表紙画像 準備中」の紙面風プレースホルダー */
export function IssueCover({ issue, sizes, priority = false, className = '' }: { issue: Issue; sizes: string; priority?: boolean; className?: string }) {
  if (issue.cover) {
    return (
      <div className={`relative overflow-hidden bg-white shadow-[0_1px_2px_rgb(0_0_0/.08),0_24px_44px_-26px_rgb(0_0_0/.5)] ${className}`} style={{ aspectRatio: issue.pageRatio }}>
        <Image src={issue.cover} alt={`中島だより ${issueLabel(issue)} ${issue.name} の表紙`} fill sizes={sizes} priority={priority} className="object-contain" />
      </div>
    );
  }
  return (
    <div role="img" aria-label={`中島だより ${issueLabel(issue)} ${issue.name}（表紙画像 準備中）`}
      className={`relative grid content-between overflow-hidden border border-line bg-paper p-[8%] shadow-[0_24px_44px_-30px_rgb(0_0_0/.45)] ${className}`} style={{ aspectRatio: issue.pageRatio }}>
      <div>
        <p className="font-latin text-[clamp(10px,1.4vw,13px)] tracking-[.3em] text-ink-3">{dayori.en}</p>
        <p className="mincho mt-2 text-[clamp(22px,3vw,36px)] leading-tight">{dayori.name}</p>
      </div>
      <div className="grid justify-items-start gap-2">
        <p className="font-latin text-[clamp(18px,2.4vw,28px)] text-sea-deep">{issueLabel(issue)}</p>
        <p className="text-[12px] text-ink-2">{issue.name}</p>
        <span className="rounded-sm bg-sand px-2 py-0.5 text-[10px] tracking-widest text-ink-2">表紙画像 準備中</span>
      </div>
    </div>
  );
}

/** バックナンバー一覧のカード */
export function IssueCard({ issue, delay = 0, latest = false }: { issue: Issue; delay?: number; latest?: boolean }) {
  const ready = issue.pageImages || !!issue.pdf;
  return (
    <Reveal as="article" delay={delay} className="group grid content-start gap-5">
      <Link href={`/dayori/${issue.slug}`} className="block transition duration-700 group-hover:-translate-y-1.5" aria-label={`${issueLabel(issue)} ${issue.name} を読む`}>
        <IssueCover issue={issue} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw" />
      </Link>
      <div className="grid gap-2">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-2">
          <span className="font-latin text-2xl font-semibold text-sea-deep">{issueLabel(issue)}</span>
          <span>{issue.name}</span>
          <span className="text-ink-3">{issue.issued} 発行</span>
          {latest && <span className="rounded-full bg-sea-deep px-2.5 text-[11px] leading-5 text-paper">最新号</span>}
          {!issue.verified && <DraftBadge label="仮データ" />}
        </p>
        <h3 className="mincho text-lg leading-relaxed">
          {issue.feature ? `特集「${issue.feature}」` : <span className="text-ink-3">特集タイトル 登録待ち</span>}
        </h3>
        <p className="text-sm leading-relaxed text-ink-2">{issue.summary ?? '紙面データ・紹介文は準備中です。'}</p>
        <Link href={`/dayori/${issue.slug}`} className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-charcoal px-5 py-2 text-sm transition hover:bg-charcoal hover:text-paper">
          {ready ? '読む' : '詳細を見る'}<ArrowRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>
    </Reveal>
  );
}
