import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { calendar, CALENDAR_ON_SALE, CALENDAR_STOCK, CALENDAR_SHIPPING, calendarShippingNote, calendarShipTiming } from '@/data/calendar';
import { calendarLink } from '@/data/paymentLinks';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { Container, Note, SectionHeading, btn } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: '2027 NAKAJIMA PHOTO CALENDAR — カレンダー',
  description: `中島の風景を、毎月飾る。写真家ビット（尾藤大起）が撮った中島の12か月の写真の壁掛けカレンダー。A4・28ページ、${calendar.price.toLocaleString()}円（税込）。`,
  ...(CALENDAR_ON_SALE ? {} : { robots: { index: false } }),
};

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

/** 購入ボタン（販売中で、支払いリンクがあるときだけ押せる） */
function BuyButton() {
  const href = CALENDAR_ON_SALE ? calendarLink() : null;
  if (!href) {
    return (
      <div className="mt-6 grid gap-2">
        <span className={btn('ghost', 'pointer-events-none w-full opacity-60 sm:w-auto sm:min-w-64')}>準備中（印刷が届きしだい販売します）</span>
        <p className="text-[12px] text-ink-3">販売開始は Instagram でお知らせします。</p>
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-2">
      <a href={href} className={btn('primary', 'w-full sm:w-auto sm:min-w-64')}>
        <ShoppingBag className="size-4" strokeWidth={1.5} aria-hidden />購入する
      </a>
      <p className="text-[12px] text-ink-3">Stripe の安全な決済ページに移動します。送り方はその画面で選べます。1回のご注文で1冊です（2冊以上ご希望の方は、お手数ですがもう一度ご注文ください）。限定{CALENDAR_STOCK}部のため、なくなりしだい終了します。</p>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <>
      {/* 表紙と価格 */}
      <Container className="grid gap-10 pb-16 pt-14 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:pt-20">
        <div>
          <Reveal><p className="eyebrow">2027 Photo Calendar</p></Reveal>
          <RiseText as="h1" lines={['中島の風景を、', '毎月飾る。']} className="mincho mt-6 text-[clamp(30px,4.6vw,56px)] leading-[1.5]" />
          <Reveal delay={200}>
            <Image src={calendar.cover} alt="2027 NAKAJIMA PHOTO CALENDAR の表紙（展望からみた西中港）" priority placeholder="blur"
              sizes="(min-width: 1024px) 55vw, 90vw"
              className="mt-10 h-auto w-full shadow-[0_1px_2px_rgb(0_0_0/.06),0_24px_48px_-28px_rgb(0_0_0/.45)]" />
          </Reveal>
        </div>
        <Reveal delay={300} className="rounded-xl border border-charcoal bg-paper p-7">
          <p className="text-sm">{calendar.name}</p>
          <p className="mt-1 text-[13px] text-ink-3">{calendar.nameJa}　A4 壁掛け・28ページ</p>
          <p className="mt-4 font-latin text-6xl font-semibold leading-none">{calendar.price.toLocaleString()}<small className="ml-1 font-sans text-base">円（税込）</small></p>
          <BuyButton />
          <ul className="mt-6 grid gap-1.5 border-t border-line pt-4 text-[13px] text-ink-2">
            {CALENDAR_SHIPPING.map((s) => (
              <li key={s.id} className="flex justify-between gap-4"><span>{s.label}</span><span className="shrink-0">{s.fee === 0 ? '送料なし' : `送料 ${s.fee}円`}</span></li>
            ))}
          </ul>
          <Note className="mt-4">{calendarShippingNote}</Note>
        </Reveal>
      </Container>

      {/* 12か月 */}
      <section className="bg-paper-2 py-20 sm:py-28">
        <Container>
          <SectionHeading en="12 Months" ja="開くと、上が写真。下が、その月のカレンダー。"
            lead={<>中島で撮った12か月の風景を、毎月一枚ずつ。カレンダーには祝日と、毎月の「中島のイベント一覧」を入れました。予定を書き込めるよう、マスは大きめにしています。</>} />
          <ol className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {calendar.spreads.map((img, i) => (
              <Reveal as="li" key={i} delay={(i % 4) * 80} variant="reveal">
                <Image src={img} alt={`${MONTHS[i]}のページ（${calendar.places[i]}）`} placeholder="blur"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="h-auto w-full border border-line shadow-[0_1px_2px_rgb(0_0_0/.06),0_18px_36px_-24px_rgb(0_0_0/.4)]" />
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-latin text-xl font-semibold text-sea-deep">{i + 1}</span>
                  <span className="text-[13px] leading-relaxed text-ink-2">{calendar.places[i]}</span>
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 仕様・お届け */}
      <Container className="grid gap-14 py-20 sm:py-28 lg:grid-cols-2">
        <div>
          <SectionHeading en="Details" ja="カレンダーについて" />
          <dl className="mt-8 grid gap-0 border-t border-line text-[14px]">
            {calendar.spec.map((s) => (
              <div key={s.label} className="grid grid-cols-[7em_1fr] gap-4 border-b border-line py-3.5">
                <dt className="text-ink-3">{s.label}</dt><dd className="leading-relaxed">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <SectionHeading en="Delivery" ja="お届けについて" />
          <dl className="mt-8 grid gap-0 border-t border-line text-[14px]">
            <div className="grid grid-cols-[7em_1fr] gap-4 border-b border-line py-3.5"><dt className="text-ink-3">送り方</dt><dd className="leading-relaxed">{calendarShippingNote}</dd></div>
            <div className="grid grid-cols-[7em_1fr] gap-4 border-b border-line py-3.5"><dt className="text-ink-3">発送の時期</dt><dd className="leading-relaxed">{calendarShipTiming}</dd></div>
            <div className="grid grid-cols-[7em_1fr] gap-4 border-b border-line py-3.5"><dt className="text-ink-3">お支払い</dt><dd className="leading-relaxed">クレジットカード、Apple Pay、Google Pay（Stripe の決済ページ）</dd></div>
            <div className="grid grid-cols-[7em_1fr] gap-4 border-b border-line py-3.5"><dt className="text-ink-3">返品・交換</dt><dd className="leading-relaxed">破損・汚れ・ご注文と異なる商品が届いた場合は、到着後7日以内にご連絡ください。送料はこちらの負担で交換します。</dd></div>
          </dl>
          <Link href="/tokushoho" className="mt-6 inline-flex items-center gap-1 text-[13px] text-ink-2 link-line">
            特定商取引法に基づく表記<ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </Container>
    </>
  );
}
