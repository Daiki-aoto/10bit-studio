import type { Metadata } from 'next';
import { dayori, publishedIssues } from '@/data/dayori';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { IssueCard } from '@/components/dayori/IssueCard';

export const metadata: Metadata = {
  title: 'Digital Archive — 中島だより バックナンバー',
  description: '中島だよりのバックナンバーを、Webでいつでも読めるデジタルアーカイブ。',
};

export default function ArchivePage() {
  const list = publishedIssues();
  return (
    <>
      <Container className="pb-12 pt-14 lg:pt-20">
        <Reveal><p className="eyebrow">{dayori.en} ／ Digital Archive</p></Reveal>
        <RiseText as="h1" lines={['バックナンバー']} className="mincho mt-6 text-[clamp(30px,4.4vw,54px)] leading-[1.5]" />
        <Reveal delay={250} className="mt-6 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-xl leading-loose text-ink-2">{dayori.launched}の創刊から、これまでに発行した{list.length}号。新しい号から並んでいます。</p>
          <ButtonLink href="/dayori" variant="text">中島だよりについて</ButtonLink>
        </Reveal>
      </Container>
      <section className="border-t border-line py-16 sm:py-24">
        <Container className="grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((iss, i) => <IssueCard key={iss.slug} issue={iss} delay={(i % 3) * 90} latest={i === 0} />)}
        </Container>
      </section>
    </>
  );
}
