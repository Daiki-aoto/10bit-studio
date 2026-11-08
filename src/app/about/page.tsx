import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AtSign, ExternalLink } from 'lucide-react';
import { profile, profileText, interview, timeline, tools, site, SHOW_DRAFTS } from '@/data/site';
import { postcards } from '@/data/postcards';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { ButtonLink, Container, DraftBadge, PlaceholderMedia } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'About Bit — ビットについて',
  description: '愛媛県松山市・中島を拠点に活動する写真・映像クリエイター、ビット（尾藤大起）のプロフィールと活動。',
};

export default function AboutPage() {
  const island = postcards.find((p) => p.id === 'michi')!;
  return (
    <article>
      {/* 表紙 */}
      <header className="border-b border-line">
        <Container className="grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16 lg:py-20">
          <div>
            <Reveal><p className="eyebrow">About Bit ／ Interview</p></Reveal>
            <RiseText as="h1" lines={['島の日常の、', '何気ない瞬間を', '残したい。']} delay={120}
              className="mincho mt-6 text-[clamp(30px,4.6vw,58px)] leading-[1.55]" />
            <Reveal delay={500} className="mt-10 border-t border-charcoal pt-6">
              <dl className="grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-4">
                <div><dt className="eyebrow text-[11px]">Name</dt><dd className="mt-1">{profile.name}<br /><span className="text-ink-3">{profile.kana}</span></dd></div>
                <div><dt className="eyebrow text-[11px]">Nickname</dt><dd className="mt-1">{profile.nickname}（Bit）</dd></div>
                <div><dt className="eyebrow text-[11px]">Base</dt><dd className="mt-1">{profile.base}</dd></div>
                <div><dt className="eyebrow text-[11px]">Work</dt><dd className="mt-1">{profile.role}</dd></div>
              </dl>
            </Reveal>
          </div>
          <Reveal variant="img" delay={200}>
            {SHOW_DRAFTS
              ? <PlaceholderMedia label="プロフィール写真（中島での撮影風景など）" ratio="4 / 5" />
              : <figure><Image src={postcards.find((p) => p.id === 'keshiki')!.image} alt="中島の入り江の風景（撮影：ビット）" sizes="(min-width: 1024px) 45vw, 100vw" placeholder="blur" className="h-auto w-full" /><figcaption className="mt-3 text-[12px] text-ink-3">撮影：ビット（中島）</figcaption></figure>}
          </Reveal>
        </Container>
      </header>

      {/* リード */}
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <Reveal className="mb-6 flex items-center gap-3"><p className="eyebrow">Profile</p><DraftBadge /></Reveal>
          <Reveal className="space-y-7 text-[16px] leading-[2.3]">
            {profileText.body.map((t, i) => (
              <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-mincho first-letter:font-bold first-letter:text-[56px] first-letter:leading-[1]' : ''}>{t}</p>
            ))}
          </Reveal>
        </div>
      </Container>

      {/* 中島の写真（大きく） */}
      <Reveal variant="img" as="figure" className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Image src={island.image} alt={`活動拠点・中島の風景。ポストカード No.${island.no}『${island.title}』`} sizes="(min-width: 1440px) 1340px, 100vw" placeholder="blur" className="mx-auto h-auto w-full max-w-5xl" />
        <figcaption className="mx-auto mt-4 max-w-5xl text-[13px] text-ink-3">活動拠点の中島。写真は ポストカード No.{island.no}『{island.title}』より</figcaption>
      </Reveal>

      {/* インタビュー（仮原稿：本人確認後に SHOW_DRAFTS で表示） */}
      {SHOW_DRAFTS && <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-12 flex items-center gap-3"><p className="eyebrow">Interview</p><DraftBadge label="仮原稿・本人確認待ち" /></Reveal>
          <div className="space-y-16">
            {interview.items.map((it, i) => (
              <Reveal key={i} className="grid gap-5 sm:grid-cols-[72px_1fr]">
                <span className="font-latin text-5xl font-semibold leading-none text-sea">Q{i + 1}</span>
                <div>
                  <h2 className="mincho text-xl leading-relaxed">{it.q}</h2>
                  <p className="mt-5 leading-[2.2] text-ink-2">{it.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>}
      {!SHOW_DRAFTS && <div className="py-12 sm:py-16" />}

      {/* これまでの活動 */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <p className="eyebrow">Works &amp; History</p>
            <h2 className="mincho mt-3 text-2xl">これまでの活動</h2>
            {SHOW_DRAFTS && <p className="mt-5 text-sm leading-relaxed text-ink-2">掲載内容は本人確認のうえ公開します。<DraftBadge className="ml-1" label="要確認" /></p>}
            <p className="mt-8 text-sm text-ink-2">主な使用ツール</p>
            <p className="mt-1 font-latin text-lg tracking-wider">{tools.join(' / ')}</p>
          </Reveal>
          <ol className="border-t border-charcoal">
            {timeline.items.map((t, i) => (
              <Reveal as="li" key={t.date} delay={i * 80} className="grid grid-cols-[88px_1fr] gap-4 border-b border-line py-6">
                <span className="font-latin text-xl font-semibold tabular-nums text-sea-deep">{t.date}</span>
                <span className="leading-relaxed">{t.title}</span>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 制作実績・リンク */}
      <Container className="py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Portfolio</p>
            <h2 className="mincho mt-3 text-2xl">制作実績</h2>
            <p className="mt-5 leading-loose text-ink-2">写真・映像の制作実績は、ポートフォリオでご覧いただけます。映像作品は<Link href="/video-production#works" className="underline">映像制作のページ</Link>でも紹介しています。</p>
            {SHOW_DRAFTS && <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <PlaceholderMedia label="制作実績の写真・映像" ratio="16 / 10" />
              <PlaceholderMedia label="制作実績の写真・映像" kind="video" ratio="16 / 10" />
            </div>}
          </Reveal>
          <Reveal className="flex flex-col justify-end gap-4">
            <a href={site.links.portfolio} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-lg border border-charcoal p-6 transition hover:bg-charcoal hover:text-paper">
              <span><span className="block text-sm text-ink-3 group-hover:text-paper/70">Portfolio</span>ポートフォリオ（中島だより）</span>
              <ExternalLink className="size-5" strokeWidth={1.4} aria-hidden />
            </a>
            <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-lg border border-charcoal p-6 transition hover:bg-charcoal hover:text-paper">
              <span><span className="block text-sm text-ink-3 group-hover:text-paper/70">Instagram</span>{site.links.instagramName}</span>
              <AtSign className="size-5" strokeWidth={1.4} aria-hidden />
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/memory-movie">思い出ムービーを相談する</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">撮影・制作のご依頼</ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </article>
  );
}
