import type { Metadata } from 'next';
import Link from 'next/link';
import { CircleX } from 'lucide-react';
import { btn, Container } from '@/components/ui/primitives';

export const metadata: Metadata = { title: 'お支払いを中止しました', robots: { index: false } };

export default function CancelPage() {
  return (
    <Container className="grid justify-items-center gap-6 pb-28 pt-20 text-center">
      <CircleX className="size-12 text-ink-3" strokeWidth={1} aria-hidden />
      <h1 className="mincho text-2xl">お支払いを中止しました</h1>
      <p className="max-w-md leading-loose text-ink-2">料金は請求されていません。カートの中身はそのまま残っています。</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/postcards" className={btn('ghost')}>買い物を続ける</Link>
        <Link href="/cart" className={btn('primary')}>カートに戻る</Link>
      </div>
    </Container>
  );
}
