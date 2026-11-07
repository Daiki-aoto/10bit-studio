import Image from 'next/image';
import Link from 'next/link';
import { Camera, Clapperboard, PenTool } from 'lucide-react';
import { site, profile, profileText } from '@/data/site';
import { postcards, credit, productSummary } from '@/data/postcards';
import { postcardPrice } from '@/data/pricing';
import { memoryMovie, plans } from '@/data/memoryMovie';
import { videoServices, videoWorks } from '@/data/videoProduction';
import { WorkFeature } from '@/components/video/WorkFeature';
import { yen } from '@/lib/pricing';
import { dayori, latestIssue, issueLabel } from '@/data/dayori';
import { IssueCover } from '@/components/dayori/IssueCard';
import { HeroSlides } from '@/components/ui/HeroSlides';
import { HeroVideo } from '@/components/ui/HeroVideo';
import { heroVideo } from '@/data/media';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { ButtonLink, Container, DraftBadge, PlaceholderMedia, SectionHeading } from '@/components/ui/primitives';
import { PostcardTile } from '@/components/postcards/PostcardTile';

const fields = [
  { en: 'PHOTO', ja: '写真撮影', Icon: Camera },
  { en: 'VIDEO', ja: '映像制作・動画編集', Icon: Clapperboard },
  { en: 'DESIGN', ja: 'ポストカード・紙面制作', Icon: PenTool },
];

export default function Home() {
  const start = postcards.findIndex((p) => p.id === 'keshiki');
  const latest = latestIssue();
  return (
    <>
      {/* ① MAIN VISUAL */}
      <section className="relative overflow-hidden">
        {heroVideo.enabled && (
          <figure className="relative">
            <HeroVideo config={heroVideo} className="aspect-[4/3] max-h-[calc(100svh-72px)] sm:aspect-video" />
            <figcaption className="pointer-events-none absolute bottom-4 left-5 text-[11px] tracking-wider text-paper/85 drop-shadow sm:bottom-6 sm:left-8 lg:left-12">{heroVideo.caption}</figcaption>
          </figure>
        )}
        <Container className={`grid ${heroVideo.enabled ? '' : 'min-h-[calc(100dvh-72px)]'} items-center gap-10 py-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-14`}>
          <div className="relative z-10">
            <Reveal><p className="eyebrow">Photo &amp; Video from Nakajima Island</p></Reveal>
            <RiseText as="h1" lines={['10bitstudio']} delay={150}
              className="display mt-5 text-[clamp(52px,6.4vw,112px)] font-semibold whitespace-nowrap" />
            <Reveal delay={600}>
              <p className="mincho mt-8 text-[clamp(20px,2.2vw,28px)] leading-relaxed">{site.catch}</p>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="活動内容">
                {fields.map(({ en, ja, Icon }) => (
                  <li key={en} className="flex items-center gap-2 text-sm text-ink-2">
                    <Icon className="size-4 text-sea" strokeWidth={1.5} aria-hidden />
                    <span className="font-latin text-base font-semibold tracking-[.2em] text-charcoal">{en}</span>{ja}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/postcards">ポストカードを見る</ButtonLink>
                <ButtonLink href="/memory-movie" variant="ghost">映像制作を相談する</ButtonLink>
              </div>
            </Reveal>
          </div>
          <Reveal variant="img" delay={200}>
            <HeroSlides cards={postcards} start={start} />
          </Reveal>
        </Container>
      </section>

      {/* ② CONCEPT */}
      <section className="bg-paper-2 py-28 sm:py-36">
        <Container className="grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-24">
          <Reveal className="hidden lg:block">
            <p className="tate mincho text-[26px] leading-[2.1] tracking-[.3em]">島の風景を、<br />日常に持ち帰る。</p>
          </Reveal>
          <div>
            <SectionHeading en="Concept" ja="写真と映像で、島の時間を手渡す。" />
            <Reveal className="mt-10 max-w-2xl space-y-6 text-[15px] leading-[2.2] text-ink-2">
              <p>瀬戸内海に浮かぶ、愛媛県松山市の離島・中島。港のあいさつ、みかん畑の色、夕方の海。島で過ごす毎日の中に、残しておきたい瞬間があります。</p>
              <p>{site.brand} は、そんな島の風景や暮らしを写真と映像で記録し、ポストカードや映像作品として届けるプロジェクトです。<DraftBadge className="ml-2" /></p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ③ POSTCARD COLLECTION */}
      <section className="py-28 sm:py-36">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading en="Postcard Collection" ja="島の写真に、詩を添えて。" lead={<>{productSummary}<br /><span className="font-latin tracking-widest">{credit}</span></>} />
            <Reveal><ButtonLink href="/postcards" variant="text">全10種類を見る</ButtonLink></Reveal>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {postcards.slice(0, 6).map((c, i) => <PostcardTile key={c.id} card={c} delay={(i % 3) * 100} />)}
          </div>
          <Reveal className="mt-20 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            {[
              { name: '1枚', price: postcardPrice.single, href: '/postcards' },
              { name: '3枚セット', price: postcardPrice.bundle3, href: '/postcards' },
              { name: '全10種類セット', price: postcardPrice.setAll, href: '/postcards/set', feature: true },
            ].map((p) => (
              <Link key={p.name} href={p.href} className={`group flex items-baseline justify-between gap-4 px-7 py-6 transition ${p.feature ? 'bg-sea-deep text-paper hover:bg-sea' : 'bg-paper hover:bg-sand/60'}`}>
                <span className="text-sm">{p.name}</span>
                <span className="font-latin text-[40px] font-semibold leading-none">{p.price.toLocaleString()}<small className="ml-1 font-sans text-sm">円</small></span>
              </Link>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* NAKAJIMA DAYORI（最新号は data/dayori.ts から自動で反映） */}
      <section className="overflow-hidden border-t border-line bg-paper-2 py-28 sm:py-36">
        <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal variant="img" className="relative mx-auto w-full max-w-md lg:order-2">
            <Link href={`/dayori/${latest.slug}`} className="block rotate-2 transition duration-700 hover:rotate-0" aria-label={`最新号 ${issueLabel(latest)} を読む`}>
              <IssueCover issue={latest} sizes="(min-width: 1024px) 34vw, 90vw" />
            </Link>
          </Reveal>
          <div>
            <SectionHeading en={dayori.en} ja={dayori.catch} />
            <Reveal className="mt-10 border-t border-charcoal pt-6">
              <p className="flex flex-wrap items-baseline gap-x-3 text-sm text-ink-2">
                <span className="rounded-full bg-sea-deep px-2.5 text-[11px] leading-5 text-paper">最新号</span>
                <span className="font-latin text-2xl font-semibold text-sea-deep">{issueLabel(latest)}</span>
                <span>{latest.name}</span><span className="text-ink-3">{latest.issued} 発行</span>
              </p>
              {latest.feature && <p className="mincho mt-4 text-xl leading-relaxed">特集「{latest.feature}」</p>}
              {latest.summary && <p className="mt-4 text-[15px] leading-loose text-ink-2">{latest.summary}</p>}
              <p className="mt-4 text-[13px] text-ink-3">{dayori.format}・{dayori.launched}創刊。編集・発行 ビット</p>
            </Reveal>
            <Reveal className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={`/dayori/${latest.slug}`}>最新号を読む</ButtonLink>
              <ButtonLink href="/dayori/archive" variant="ghost">バックナンバーを見る</ButtonLink>
              <ButtonLink href="/dayori" variant="text">中島だよりについて</ButtonLink>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ④ ABOUT BIT */}
      <section className="bg-sand/60 py-28 sm:py-36">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="img"><PlaceholderMedia label="ビットのプロフィール写真" ratio="4 / 5" className="max-w-md" /></Reveal>
          <div>
            <SectionHeading en="About Bit" ja={profileText.lead} />
            <Reveal className="mt-8 space-y-5 text-[15px] leading-[2.1] text-ink-2">
              <p className="text-charcoal"><span className="mincho text-xl">{profile.nickname}</span>　{profile.name}<span className="ml-3 text-sm text-ink-3">{profile.role}</span></p>
              <p>{profileText.body[0]}</p>
              <p>{profileText.body[1]} <DraftBadge /></p>
            </Reveal>
            <Reveal className="mt-10"><ButtonLink href="/about" variant="ghost">ビットについて</ButtonLink></Reveal>
          </div>
        </Container>
      </section>

      {/* ⑤ MEMORY MOVIE */}
      <section className="bg-sea-deep py-28 text-paper sm:py-36">
        <Container>
          <Reveal>
            <p className="eyebrow text-paper/70">Memory Movie</p>
            <h2 className="mincho mt-4 text-[clamp(26px,3.6vw,44px)] leading-relaxed">{memoryMovie.concept}</h2>
            <p className="mt-6 max-w-2xl leading-loose text-paper/80">{memoryMovie.lead}</p>
          </Reveal>
          <ul className="mt-14 grid gap-4 sm:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 100} className="rounded-lg border border-paper/20 p-7">
                <p className="flex items-baseline justify-between"><span className="mincho text-2xl">{p.name}</span><span className="font-latin tracking-[.3em] text-paper/60">{p.en}</span></p>
                <p className="mt-6 font-latin text-[44px] font-semibold leading-none">{yen(p.price)}{p.from && '〜'}</p>
                <p className="mt-3 text-sm text-paper/70">{p.specs.slice(0, 2).map((s) => s.value).join(' ・ ')}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/memory-movie" variant="light">思い出ムービーについて</ButtonLink>
            <ButtonLink href="/memory-movie#form" className="border border-paper/60 bg-transparent text-paper hover:bg-paper hover:text-charcoal">思い出ムービーを相談する</ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* ⑥ VIDEO PRODUCTION */}
      <section className="py-28 sm:py-36">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading en="Video Production" ja="撮影から編集まで、ひとりで丁寧に。" lead="企業・店舗のPR、地域紹介、インタビュー、イベント記録、YouTube や SNS 向けの編集まで対応します。" />
            <Reveal className="mt-10"><ButtonLink href="/video-production" variant="ghost">映像制作について</ButtonLink></Reveal>
          </div>
          <Reveal as="ul" className="grid grid-cols-1 border-t border-charcoal sm:grid-cols-2">
            {videoServices.map((s, i) => (
              <li key={s.title} className="flex items-baseline gap-4 border-b border-line py-5 sm:odd:pr-6 sm:even:pl-6">
                <span className="font-latin text-sm text-ink-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span>{s.title}</span>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* WORKS（映像制作実績・最新作） */}
      {videoWorks.length > 0 && (
        <section className="bg-charcoal py-28 text-paper sm:py-36" aria-labelledby="works-title">
          <Container>
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <p className="eyebrow text-paper/70">Works</p>
                <h2 id="works-title" className="mincho mt-3 text-2xl sm:text-[28px]">映像制作実績</h2>
              </Reveal>
              <Reveal><Link href="/video-production#works" className="text-sm link-line">すべての実績を見る →</Link></Reveal>
            </div>
            <WorkFeature work={videoWorks[0]} dark />
          </Container>
        </section>
      )}

      {/* ⑦ CONTACT */}
      <section className="py-28 sm:py-36">
        <Container>
          <Reveal className="grid overflow-hidden rounded-xl border border-charcoal md:grid-cols-2">
            <Link href="/postcards" className="group relative grid gap-4 p-8 transition hover:bg-sand/50 sm:p-12">
              <p className="eyebrow">Shop</p>
              <p className="mincho text-2xl">ポストカードを購入する</p>
              <p className="text-sm text-ink-2">全10種類から選んで、カートに入れて手続きできます。</p>
              <Image src={postcards[2].image} alt="" sizes="200px" className="mt-2 w-40 shadow-md transition group-hover:-translate-y-1" />
            </Link>
            <Link href="/contact" className="grid content-start gap-4 border-t border-charcoal bg-charcoal p-8 text-paper transition hover:bg-sea-deep sm:p-12 md:border-l md:border-t-0">
              <p className="eyebrow text-paper/70">Contact</p>
              <p className="mincho text-2xl">撮影・映像制作を依頼する</p>
              <p className="text-sm text-paper/75">思い出ムービー、写真撮影、動画編集、映像制作のご相談はこちらから。</p>
              <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm text-charcoal">お問い合わせへ →</span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
