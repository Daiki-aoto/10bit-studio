import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { memoryMovie, plans, options, flow, faq } from '@/data/memoryMovie';
import { SHOW_DRAFTS } from '@/data/site';
import { yen } from '@/lib/pricing';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { ButtonLink, Container, DraftBadge, Note, PlaceholderMedia, SectionHeading } from '@/components/ui/primitives';
import { MemoryMovieForm } from '@/components/forms/MemoryMovieForm';
import { HeroVideo } from '@/components/ui/HeroVideo';
import { heroVideo } from '@/data/media';

export const metadata: Metadata = {
  title: 'Memory Movie — 思い出ムービー制作',
  description: `${memoryMovie.lead} 梅プラン5,000円〜、竹プラン10,000円〜、松プラン30,000円〜。家族・誕生日・結婚・卒業・地域イベントなど。`,
};

export default function MemoryMoviePage() {
  return (
    <>
      {/* ヒーロー */}
      <section className="bg-sea-deep text-paper">
        <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:py-24">
          <div>
            <Reveal><p className="eyebrow text-paper/70">Memory Movie</p></Reveal>
            <RiseText as="h1" lines={['大切な思い出を、', '未来に残す。']} className="mincho mt-6 text-[clamp(30px,4.4vw,54px)] leading-[1.5]" />
            <Reveal delay={400}>
              <p className="mt-8 max-w-lg leading-loose text-paper/85">{memoryMovie.lead}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="#form" variant="light" className="ring-2 ring-paper/30">思い出ムービーを相談する</ButtonLink>
                <ButtonLink href="#plans" arrow={false} className="border border-paper/50 bg-transparent text-paper hover:bg-paper/10">料金を見る</ButtonLink>
              </div>
            </Reveal>
          </div>
          <Reveal as="figure" variant="img" delay={200}>
            <HeroVideo config={heroVideo} className="aspect-video rounded-lg" />
            <figcaption className="mt-3 text-[12px] text-paper/70">サンプル映像：{heroVideo.caption}</figcaption>
          </Reveal>
        </Container>
      </section>

{SHOW_DRAFTS && (<>
      {/* 制作前・制作後 */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading en="Before / After" ja="眠っている写真が、一本の映像に。" align="center" />
          <div className="mt-14 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <Reveal>
              <PlaceholderMedia label="制作前：スマートフォンやアルバムに散らばった写真・動画" ratio="4 / 3" className="rounded-lg" />
              <p className="mt-4 text-center text-sm text-ink-2"><span className="eyebrow mr-2">Before</span>写真・動画の素材</p>
            </Reveal>
            <Reveal delay={150} className="mincho text-center text-2xl text-sea md:px-4" aria-hidden>→</Reveal>
            <Reveal delay={300}>
              <PlaceholderMedia kind="video" label="制作後：音楽とテロップで仕上げた映像" ratio="4 / 3" className="rounded-lg" />
              <p className="mt-4 text-center text-sm text-ink-2"><span className="eyebrow mr-2">After</span>音楽・テロップ入りの映像</p>
            </Reveal>
          </div>
        </Container>
      </section>

      </>)}

      {/* 料金プラン */}
      <section id="plans" className="scroll-mt-20 bg-paper-2 py-24 sm:py-32">
        <Container>
          <SectionHeading en="Plans" ja="料金プラン" lead={memoryMovie.priceNote} />
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}
                className={`relative flex flex-col rounded-xl border p-8 ${p.featured ? 'border-sea-deep bg-paper ring-1 ring-sea-deep' : 'border-line bg-paper'}`}>
                <p className="flex items-baseline justify-between"><span className="mincho text-3xl">{p.name}<span className="ml-1 text-base">プラン</span></span><span className="font-latin tracking-[.3em] text-ink-3">{p.en}</span></p>
                <p className="mt-6 font-latin text-5xl font-semibold leading-none">{yen(p.price)}{p.from && <span className="ml-1 text-2xl">〜</span>}</p>
                <dl className="mt-8 grid gap-0 border-t border-line text-sm">
                  {p.specs.map((s) => (
                    <div key={s.label} className="flex justify-between gap-4 border-b border-line py-3">
                      <dt className="text-ink-2">{s.label}</dt><dd className="text-right">{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <ButtonLink href="#form" variant={p.featured ? 'primary' : 'ghost'} className="mt-8">このプランで相談する</ButtonLink>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <h3 className="mincho text-xl">追加オプション</h3>
              <Note className="mt-3">素材の状態（古い写真のスキャン、動画の画質など）や制作内容によって、料金が変わる場合があります。</Note>
            </div>
            <ul className="border-t border-charcoal">
              {options.map((o) => (
                <li key={o.label} className="flex flex-wrap justify-between gap-2 border-b border-line py-4">
                  <span className="flex items-center gap-2"><Check className="size-4 text-sea" aria-hidden />{o.label}</span>
                  <span className="font-medium">{o.price}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* 制作の流れ */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading en="Flow" ja="制作の流れ" />
          <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {flow.map((f, i) => (
              <Reveal as="li" key={f.title} delay={(i % 3) * 100} className="border-t border-charcoal pt-6">
                <p className="font-latin text-sm font-semibold tracking-[.3em] text-sea">STEP {i + 1}</p>
                <h3 className="mincho mt-3 text-xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-loose text-ink-2">{f.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-sand/50 py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.8fr]">
          <div>
            <SectionHeading en="FAQ" ja="よくある質問" />
            <DraftBadge className="mt-4" label="回答は仮原稿" />
          </div>
          <div className="border-t border-charcoal">
            {faq.items.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="mincho text-[17px] leading-relaxed">{f.q}</span>
                  <span className="relative size-4 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-current after:transition group-open:after:scale-y-0" aria-hidden />
                </summary>
                <p className="pb-6 leading-loose text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* 受注フォーム */}
      <section id="form" className="scroll-mt-20 py-24 sm:py-32">
        <Container className="max-w-[880px]">
          <SectionHeading en="Request" ja="思い出ムービーを相談する"
            lead="わかる範囲で大丈夫です。内容を確認し、お見積もり（料金・納期）をご連絡します。" />
          <div className="mt-12"><MemoryMovieForm /></div>
        </Container>
      </section>
    </>
  );
}
