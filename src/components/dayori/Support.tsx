import { support } from '@/data/dayori';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Container, TbdBadge } from '@/components/ui/primitives';

/** 応援・寄付の案内。寄付方法が data に登録されたらボタンを表示する */
export function SupportSection() {
  return (
    <section id="support" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="eyebrow">Support</p>
          <h2 className="mincho mt-3 text-[clamp(24px,3vw,36px)] leading-relaxed">中島だよりを<br />応援してください</h2>
          <p className="mincho mt-6 text-xl text-sea-deep">{support.catch}</p>
          <p className="mt-6 leading-loose text-ink-2">{support.lead}</p>
          <p className="mt-4 leading-loose text-ink-2">{support.cost}</p>
        </Reveal>
        <div>
          <Reveal>
            <h3 className="text-sm font-medium">いただいたご支援の使い道</h3>
            <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {support.uses.map((u, i) => (
                <li key={u.title} className="bg-paper p-6">
                  <p className="font-latin text-sm text-sea">{String(i + 1).padStart(2, '0')}</p>
                  <p className="mincho mt-2 text-lg">{u.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{u.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-8 rounded-xl bg-sand/60 p-6">
            <p className="flex items-center gap-2 text-sm font-medium">ご支援の方法 {support.methods.length === 0 && <TbdBadge />}</p>
            {support.methods.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {support.methods.map((m) => <ButtonLink key={m.href} href={m.href}>{m.label}</ButtonLink>)}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{support.methodsNote}</p>
            )}
            <p className="mt-4 text-sm leading-relaxed text-ink-2">応援メッセージや、取材・掲載のご相談は、お問い合わせからお寄せください。</p>
            <ButtonLink href="/contact?type=dayori" variant="ghost" className="mt-5">応援メッセージを送る</ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
