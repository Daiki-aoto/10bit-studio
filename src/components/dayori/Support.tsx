import { support } from '@/data/dayori';
import { supportLinks } from '@/data/paymentLinks';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Container } from '@/components/ui/primitives';
import Link from 'next/link';

const yen = (n: number) => `${n.toLocaleString()}円`;
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
const choice = 'flex min-h-14 items-center justify-center rounded-lg border border-charcoal bg-paper px-4 text-center transition hover:bg-charcoal hover:text-paper';

/** 応援・寄付の案内（Stripe の支払いリンクへ） */
export function SupportSection() {
  const ready = supportLinks.once.length > 0 || supportLinks.monthly.length > 0;
  return (
    <section id="support" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="eyebrow">Support</p>
          <h2 className="mincho mt-3 text-[clamp(24px,3vw,36px)] leading-relaxed">中島だよりを<br />応援してください</h2>
          <p className="mincho mt-6 text-xl text-sea-deep">{support.catch}</p>
          <p className="mt-6 leading-loose text-ink-2">{support.lead}</p>
          <p className="mt-4 leading-loose text-ink-2">{support.cost}</p>
          <h3 className="mt-10 text-sm font-medium">いただいたご支援の使い道</h3>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {support.uses.map((u, i) => (
              <li key={u.title} className="bg-paper p-5">
                <p className="font-latin text-sm text-sea">{String(i + 1).padStart(2, '0')}</p>
                <p className="mincho mt-1 text-lg">{u.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{u.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="grid content-start gap-6">
          {ready ? (
            <>
              <div className="rounded-xl bg-sand/60 p-6 sm:p-8">
                <h3 className="mincho text-xl">1回の応援</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">金額を選んでください。お礼として、メールでメッセージをお送りします。</p>
                <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {supportLinks.once.map((o) => (
                    <li key={o.amount}><a href={o.url!} {...ext} className={`${choice} font-latin text-lg`}>{yen(o.amount)}</a></li>
                  ))}
                  {supportLinks.free && <li><a href={supportLinks.free} {...ext} className={`${choice} text-sm`}>自由な金額</a></li>}
                </ul>
              </div>

              {supportLinks.monthly.length > 0 && (
                <div className="rounded-xl border border-charcoal p-6 sm:p-8">
                  <h3 className="mincho text-xl">毎月の応援</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">毎月、同じ日に自動でお支払いいただく応援です。<b className="font-medium text-charcoal">新しい号が出るたびに（年4回）、中島だよりをご自宅へお送りします。</b></p>
                  <ul className="mt-5 grid grid-cols-2 gap-3">
                    {supportLinks.monthly.map((o) => (
                      <li key={o.amount}><a href={o.url!} {...ext} className={`${choice} gap-1`}><span className="text-sm">月</span><span className="font-latin text-lg">{yen(o.amount)}</span></a></li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[13px] leading-relaxed text-ink-3">やめるときは、<Link href="/contact?type=dayori" className="underline">お問い合わせフォーム</Link>からご連絡ください。次回以降のお支払いを止めます。</p>
                </div>
              )}

              <ul className="grid gap-1.5 text-[13px] leading-relaxed text-ink-3">
                <li>・お支払いの画面で、中島だよりの紙面に<b className="font-medium text-ink-2">お名前を載せてよいか</b>を選べます（ニックネームも可）。</li>
                <li>・{support.methodsNote}</li>
                <li>・個人で発行している媒体への応援のため、寄付金控除の対象にはなりません。</li>
                <li>・Stripe の安全な決済ページが新しいタブで開きます。詳しくは<Link href="/tokushoho" className="underline">特定商取引法に基づく表記</Link>をご覧ください。</li>
              </ul>
            </>
          ) : (
            <p className="rounded-xl bg-sand/60 p-6 text-sm leading-relaxed text-ink-2">オンラインでのご支援の方法は準備中です。現在は、募金箱でのご支援をお願いしています。</p>
          )}
          <div className="border-t border-line pt-6">
            <p className="text-sm leading-relaxed text-ink-2">応援メッセージや、取材・掲載のご相談は、お問い合わせからお寄せください。</p>
            <ButtonLink href="/contact?type=dayori" variant="ghost" className="mt-4">応援メッセージを送る</ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
