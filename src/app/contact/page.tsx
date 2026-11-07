import type { Metadata } from 'next';
import Link from 'next/link';
import { AtSign, Clapperboard, Film, Mail } from 'lucide-react';
import { site } from '@/data/site';
import { Reveal, RiseText } from '@/components/ui/Reveal';
import { Container } from '@/components/ui/primitives';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — お問い合わせ',
  description: 'ポストカード、思い出ムービー、写真撮影、動画編集、映像制作についてのお問い合わせ窓口です。',
};

const shortcuts = [
  { href: '/memory-movie#form', Icon: Film, title: '思い出ムービーの相談', text: 'プラン・素材・納期を伺う専用フォーム' },
  { href: '/postcards', Icon: Mail, title: 'ポストカードの購入', text: 'カートに入れて手続きできます' },
  { href: '/video-production', Icon: Clapperboard, title: '映像制作について', text: '対応できる業務と制作の流れ' },
];

export default function ContactPage() {
  return (
    <>
      <Container className="pb-12 pt-14 lg:pt-20">
        <Reveal><p className="eyebrow">Contact</p></Reveal>
        <RiseText as="h1" lines={['お問い合わせ']} className="mincho mt-6 text-[clamp(30px,4.4vw,54px)] leading-[1.5]" />
        <Reveal delay={250}><p className="mt-6 max-w-xl leading-loose text-ink-2">写真撮影・動画編集・映像制作のご依頼、ポストカードについてなど、お気軽にご連絡ください。</p></Reveal>
        <ul className="mt-12 grid gap-3 md:grid-cols-3">
          {shortcuts.map(({ href, Icon, title, text }, i) => (
            <Reveal as="li" key={href} delay={i * 80}>
              <Link href={href} className="flex h-full items-start gap-4 rounded-lg border border-line p-5 transition hover:border-charcoal hover:bg-sand/40">
                <Icon className="mt-1 size-5 shrink-0 text-sea" strokeWidth={1.4} aria-hidden />
                <span><span className="block font-medium">{title}</span><span className="text-[13px] text-ink-2">{text}</span></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>

      <section className="border-t border-line py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1fr_2.2fr]">
          <Reveal className="space-y-5 text-sm leading-relaxed text-ink-2">
            <p className="eyebrow">Form</p>
            <p>種類を選ぶと、より詳しく伺える専用ページをご案内します。</p>
            <p>Instagram の DM でもご連絡いただけます。</p>
            <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-charcoal link-line">
              <AtSign className="size-4" strokeWidth={1.5} aria-hidden />{site.links.instagramName}
            </a>
          </Reveal>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
