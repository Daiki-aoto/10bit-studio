import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, HandHeart, Info } from 'lucide-react';
import { dayori, publishedIssues, latestIssue, issueLabel, activities, pageSrc, getIssue } from '@/data/dayori';
import { SHOW_DRAFTS } from '@/data/site';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { ButtonLink, Container, DraftBadge, SectionHeading } from '@/components/ui/primitives';
import { IssueCard, IssueCover } from '@/components/dayori/IssueCard';
import { SupportSection } from '@/components/dayori/Support';

export const metadata: Metadata = {
  title: 'Nakajima Dayori — 中島だより',
  description: `${dayori.concept} ${dayori.format}・${dayori.launched}創刊。バックナンバーをWebで読めます。`,
};

/** 特集ページ風の読み物（仮原稿）。写真は実際の紙面ページ */
const story = [
  {
    en: 'Why', title: '中島だよりを始めた理由',
    body: '観光案内には載らない、島で暮らす人の姿や日々の営み。それを記録し、島の内と外に届ける媒体がほしいと考え、2026年4月に創刊しました。',
    page: { slug: 'vol03', n: 1 },
  },
  {
    en: 'Thought', title: '制作に込めている想い',
    body: '高齢の方にも中学生にも読みやすい文章を心がけています。島の今を記録しておくことが、いつか島の歴史になると考えています。',
    page: { slug: 'vol03', n: 9 },
  },
  {
    en: 'Field Work', title: '取材と撮影について',
    body: '島を歩き、人を訪ね、話を伺うところから紙面づくりが始まります。取材・撮影・編集・デザインまでを一人で手がけています。',
    page: { slug: 'vol03', n: 2 },
  },
  {
    en: 'Connection', title: '島の人々とのつながり',
    body: '取材をきっかけに、新しい仕事や交流が生まれています。学校や地域の方々の協力を得ながら、写真や紙面を地域の記録と交流につなげていきたいと考えています。',
    page: { slug: 'vol03', n: 7 },
  },
];

const plans = [
  '季刊での継続発行（次号の取材・制作）',
  'バックナンバーのデジタルアーカイブの充実',
  '中島の写真による写真集・ポストカードの制作（2027年秋ごろを目標）',
  '写真展や交流の場づくり',
];

export default function DayoriPage() {
  const latest = latestIssue();
  const list = publishedIssues();
  return (
    <>
      {/* ファーストビュー */}
      <section className="overflow-hidden bg-paper-2">
        <Container className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <Reveal><p className="eyebrow">{dayori.en} ／ Local Free Paper</p></Reveal>
            <RiseText as="h1" lines={[dayori.name]} className="mincho mt-5 text-[clamp(44px,7vw,92px)] leading-tight tracking-[.14em]" />
            <Reveal delay={300}>
              <p className="mincho mt-6 text-[clamp(18px,2vw,24px)] leading-relaxed">{dayori.catch}</p>
              <p className="mt-6 max-w-xl leading-loose text-ink-2">{dayori.concept}</p>
              <dl className="mt-8 grid max-w-xl grid-cols-2 gap-y-3 border-t border-charcoal pt-5 text-sm sm:grid-cols-4">
                <div><dt className="eyebrow text-[11px]">Since</dt><dd className="mt-1">{dayori.launched} 創刊</dd></div>
                <div><dt className="eyebrow text-[11px]">Issues</dt><dd className="mt-1">{list.length}号 発行</dd></div>
                <div><dt className="eyebrow text-[11px]">Format</dt><dd className="mt-1">季刊・無料</dd></div>
                <div><dt className="eyebrow text-[11px]">Editor</dt><dd className="mt-1">ビット</dd></div>
              </dl>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href={`/dayori/${latest.slug}`}>最新号を読む</ButtonLink>
                <ButtonLink href="/dayori/archive" variant="ghost">バックナンバー</ButtonLink>
              </div>
            </Reveal>
          </div>
          <Reveal variant="img" delay={200} className="relative mx-auto w-full max-w-md">
            <Link href={`/dayori/${latest.slug}`} className="block -rotate-2 transition duration-700 hover:rotate-0" aria-label={`最新号 ${issueLabel(latest)} を読む`}>
              <IssueCover issue={latest} sizes="(min-width: 1024px) 34vw, 90vw" priority />
            </Link>
            <p className="mt-6 text-center text-sm text-ink-2"><span className="font-latin text-lg text-charcoal">{issueLabel(latest)}</span>　{latest.name}{latest.feature && `「${latest.feature}」`}</p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-6">
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-2"><Info className="mt-0.5 size-4 shrink-0" aria-hidden />{dayori.disclaimer}</p>
      </Container>

{SHOW_DRAFTS && (<>
      {/* 特集風の読み物 */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <SectionHeading en="About" ja="島の今を、記録し続ける。" />
            <DraftBadge className="mt-6" />
          </div>
          <div className="mt-16 grid gap-24">
            {story.map((s, i) => {
              const iss = getIssue(s.page.slug);
              return (
                <Reveal key={s.title} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <figure className="mx-auto w-full max-w-sm">
                    {iss?.pageImages
                      ? <Image src={pageSrc(iss, s.page.n, 'sm')} alt={`中島だより ${issueLabel(iss)} ${s.page.n}ページ`} width={800} height={Math.round(800 / iss.pageRatio)} sizes="(min-width: 1024px) 384px, 90vw" className="h-auto w-full shadow-[0_24px_44px_-26px_rgb(0_0_0/.5)]" />
                      : null}
                    {iss && <figcaption className="mt-3 text-[12px] text-ink-3">紙面：{issueLabel(iss)} {iss.name} p.{s.page.n}</figcaption>}
                  </figure>
                  <div>
                    <p className="font-latin text-sm font-semibold tracking-[.3em] text-sea">{String(i + 1).padStart(2, '0')} — {s.en}</p>
                    <h2 className="mincho mt-4 text-[clamp(22px,2.6vw,32px)] leading-relaxed">{s.title}</h2>
                    <p className="mt-6 max-w-lg text-[15px] leading-[2.2] text-ink-2">{s.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

        </Container>
      </section>

      </>)}

      {!SHOW_DRAFTS && (
        <Container className="py-16 sm:py-20">
          <Reveal className="mx-auto max-w-3xl border-y border-charcoal py-12 text-center">
            <p className="mincho text-[clamp(20px,2.4vw,28px)] leading-loose">「{dayori.backCoverQuote}」</p>
            <p className="mt-4 text-[13px] text-ink-3">— {issueLabel(latest)} 裏表紙より</p>
          </Reveal>
        </Container>
      )}

      {/* 発行実績 */}
      <section className="bg-sand/50 py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading en="Record" ja="これまでの発行" />
            <Reveal className="mt-8 grid gap-4 text-sm">
              <p><span className="text-ink-2">仕様</span>　{dayori.spec}（号によりページ数が異なります）</p>
              <p><span className="text-ink-2">発行部数</span>　{dayori.facts.copies}</p>
              <p><span className="text-ink-2">配布先</span>　{dayori.facts.places.join('、')}</p>
            </Reveal>
          </div>
          <ol className="border-t border-charcoal">
            {list.map((iss, i) => (
              <Reveal as="li" key={iss.slug} delay={i * 80}>
                <Link href={`/dayori/${iss.slug}`} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b border-line py-5 transition hover:bg-paper/60 sm:grid-cols-[100px_1fr_auto]">
                  <span className="font-latin text-2xl font-semibold text-sea-deep">{issueLabel(iss)}</span>
                  <span>
                    <span className="block">{iss.name}{iss.feature && <span className="text-ink-2">　特集「{iss.feature}」</span>}</span>
                    <span className="text-[13px] text-ink-3">{iss.issued} 発行 ・ {iss.pageCount}ページ {!iss.verified && <DraftBadge label="仮データ" className="ml-1" />}</span>
                  </span>
                  <ArrowRight className="size-5 text-ink-3" strokeWidth={1.4} aria-hidden />
                </Link>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 活動紹介 */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading en="Activities" ja="中島だよりの活動" lead="写真は、実際の紙面からの抜粋です。" />
          <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((a, i) => {
              const iss = a.page ? getIssue(a.page.slug) : null;
              return (
                <Reveal as="li" key={a.title} delay={(i % 3) * 90} className="grid content-start gap-4">
                  {iss && a.page && iss.pageImages ? (
                    <Link href={`/dayori/${iss.slug}#p=${a.page.n}`} className="block overflow-hidden bg-paper-2 p-4" aria-label={`${a.title}：紙面 p.${a.page.n} を読む`}>
                      <Image src={pageSrc(iss, a.page.n, 'sm')} alt="" width={800} height={Math.round(800 / iss.pageRatio)} sizes="(min-width: 1024px) 26vw, 90vw" className="mx-auto h-64 w-auto shadow-md transition duration-700 hover:-translate-y-1" />
                    </Link>
                  ) : (
                    <div className="grid h-72 place-items-center bg-paper-2 p-6 text-center text-sm text-ink-2">
                      {a.href ? <Link href={a.href} className="link-line">ポストカードを見る →</Link> : (SHOW_DRAFTS ? <span>制作風景の写真<br /><span className="text-[11px] tracking-widest text-ink-3">仮素材・差し替え予定</span></span> : <Link href={`/dayori/${latest.slug}`} className="block w-40"><IssueCover issue={latest} sizes="160px" /></Link>)}
                    </div>
                  )}
                  <h3 className="mincho text-lg">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-2">{a.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* アーカイブ */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading en="Digital Archive" ja="バックナンバーを読む" lead="これまでに発行した中島だよりを、Webでいつでも読めます。" />
            <Reveal><ButtonLink href="/dayori/archive" variant="text">すべての号</ButtonLink></Reveal>
          </div>
          <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((iss, i) => <IssueCard key={iss.slug} issue={iss} delay={i * 90} latest={i === 0} />)}
          </div>
        </Container>
      </section>

      {/* 今後の予定 */}
      <section className="bg-charcoal py-20 text-paper sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="eyebrow text-paper/70">Next</p>
            <h2 className="mincho mt-3 text-2xl">これからの活動</h2>
            <DraftBadge className="mt-4 border-paper/40 text-paper/70" label="仮原稿" />
          </Reveal>
          <ul className="border-t border-paper/25">
            {plans.map((p) => <Reveal as="li" key={p} className="border-b border-paper/15 py-5">{p}</Reveal>)}
          </ul>
        </Container>
      </section>

      <SupportSection />

      <Container className="pb-24">
        <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-charcoal p-8">
          <p className="flex items-center gap-3"><HandHeart className="size-6 text-sea" strokeWidth={1.4} aria-hidden />取材・掲載のご相談、写真のご提供もお待ちしています。</p>
          <ButtonLink href="/contact?type=dayori">中島だよりへの問い合わせ</ButtonLink>
        </Reveal>
      </Container>
    </>
  );
}
