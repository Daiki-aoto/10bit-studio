import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';
import { videoServices, experience, videoFlow, videoPricing, videoWorks } from '@/data/videoProduction';
import { WorkFeature } from '@/components/video/WorkFeature';
import { HeroVideo } from '@/components/ui/HeroVideo';
import { heroVideo } from '@/data/media';
import { site, SHOW_DRAFTS } from '@/data/site';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { ButtonLink, Container, DraftBadge, SectionHeading } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Video Production — 映像制作・動画編集',
  description: '企業・店舗のPR動画、観光・地域紹介、インタビュー、イベント記録、YouTube・SNS向けの編集まで。愛媛県松山市・中島を拠点に、撮影から編集まで対応します。',
};

export default function VideoProductionPage() {
  return (
    <>
      <Container className="grid gap-12 pb-20 pt-14 lg:grid-cols-[1fr_1.25fr] lg:items-end lg:pt-20">
        <div>
          <Reveal><p className="eyebrow">Video Production</p></Reveal>
          <RiseText as="h1" lines={['撮影から編集まで、', 'ひとりで丁寧に。']} className="mincho mt-6 text-[clamp(30px,4.4vw,54px)] leading-[1.5]" />
          <Reveal delay={350}>
            <p className="mt-8 max-w-lg leading-loose text-ink-2">企業・店舗のPRから、地域の記録、YouTube や SNS 向けの編集まで。伝えたいことを伺い、目的に合った映像に仕上げます。</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact?type=video">映像制作を相談する</ButtonLink>
              <ButtonLink href="#works" variant="ghost" arrow={false}>制作実績を見る</ButtonLink>
            </div>
          </Reveal>
        </div>
        <Reveal variant="img" delay={200}>
          <a href="#works" className="group relative block overflow-hidden" aria-label={`制作実績「${videoWorks[0].title}」へ`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={videoWorks[0].thumbnail} alt="" className="aspect-video w-full object-cover transition duration-[1200ms] group-hover:scale-[1.03]" />
            <span className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-1.5 text-[12px] tracking-wider">Latest Work ／ {videoWorks[0].category}</span>
          </a>
        </Reveal>
      </Container>

      {/* 対応できる業務 */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <Container>
          <SectionHeading en="Services" ja="対応できる業務" />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {videoServices.map((s, i) => (
              <Reveal as="li" key={s.title} delay={(i % 4) * 70} className="grid min-h-44 content-between gap-6 bg-paper p-6 transition hover:bg-sand/50">
                <span className="font-latin text-sm font-semibold tracking-[.24em] text-sea">{String(i + 1).padStart(2, '0')} ／ {s.en}</span>
                <span className="mincho text-[17px] leading-relaxed">{s.title}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 制作実績・サンプル */}
      <section id="works" className="scroll-mt-20 py-24 sm:py-32">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading en="Works" ja="映像制作実績" lead="これまでに制作した映像作品です。ほかの制作は、ポートフォリオでもご覧いただけます。" />
            <Reveal><ButtonLink href={site.links.portfolio} variant="ghost" arrow={false}>ポートフォリオ <ExternalLink className="size-4" strokeWidth={1.5} /></ButtonLink></Reveal>
          </div>
          <div className="mt-14 grid gap-24 sm:mt-20">
            {videoWorks.map((w, i) => <WorkFeature key={w.youtubeId} work={w} index={i} />)}
            {/* イベント撮影・記録映像（トップページと同じ動画） */}
            <article>
              <Reveal variant="img"><HeroVideo config={heroVideo} className="aspect-video" /></Reveal>
              <Reveal className="mt-8 grid gap-8 border-t border-charcoal pt-8 lg:grid-cols-[180px_1fr] lg:gap-12">
                <div className="flex gap-6 text-[13px] text-ink-2 lg:flex-col lg:gap-2">
                  <span className="font-latin text-3xl font-semibold leading-none text-current">{String(videoWorks.length + 1).padStart(2, '0')}</span>
                  <span className="tracking-wider">イベント撮影・記録映像</span>
                  <span className="font-latin tracking-[.2em]">2026</span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="mincho text-[clamp(20px,2.2vw,28px)] leading-relaxed">大浦太鼓まつり 2026</h3>
                  <p className="mt-5 text-[15px] leading-[2.1] text-ink-2">島のまつりの熱気を、撮影から編集まで手がけた記録映像です。</p>
                  <p className="mt-4 text-[13px] text-ink-2">担当：撮影 ／ 編集</p>
                </div>
              </Reveal>
            </article>
          </div>
          <Reveal className="mt-24">
            <div className="flex items-center gap-3"><h3 className="mincho text-xl">これまでの経験</h3><DraftBadge label="掲載可否を確認中" /></div>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {experience.items.map((e) => (
                <li key={e.title} className="rounded-lg border border-line p-6">
                  <p className="font-medium">{e.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{e.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* 流れ・料金 */}
      <section className="bg-charcoal py-24 text-paper sm:py-32">
        <Container className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal className="flex items-center gap-3"><p className="eyebrow text-paper/70">Flow</p><DraftBadge label="仮原稿" className="border-paper/40 text-paper/70" /></Reveal>
            <h2 className="mincho mt-3 text-2xl">制作の流れ</h2>
            <ol className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {videoFlow.items.map((f, i) => (
                <Reveal as="li" key={f.title} delay={(i % 2) * 80} className="border-t border-paper/20 py-5">
                  <p className="flex items-baseline gap-3"><span className="font-latin text-xl font-semibold text-paper/50 tabular-nums">{String(i + 1).padStart(2, '0')}</span><span className="mincho text-lg">{f.title}</span></p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">{f.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="self-start rounded-xl border border-paper/25 p-8">
            <p className="eyebrow text-paper/70">Price</p>
            <h2 className="mincho mt-3 text-2xl">料金について</h2>
            <p className="mt-5 leading-loose text-paper/85">{videoPricing.text}</p>
            <p className="mt-4 text-sm text-paper/60">思い出ムービー（スライドショー）は、料金プランを公開しています。</p>
            <div className="mt-8 grid gap-3">
              <ButtonLink href="/contact?type=video" variant="light">映像制作を相談する</ButtonLink>
              <ButtonLink href="/memory-movie" className="border border-paper/50 bg-transparent text-paper hover:bg-paper/10">思い出ムービーの料金</ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
