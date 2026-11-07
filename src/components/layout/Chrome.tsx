'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { DEMO_MODE, PAYMENTS } from '@/data/site';
import { linksMode } from '@/data/paymentLinks';
import { useCart } from '@/components/cart/CartProvider';

/** デモ運用中であることを常に伝える帯（閉じられる） */
export function DemoBanner() {
  const [hidden, setHidden] = useState(false);
  if (!DEMO_MODE || hidden) return null;
  return (
    <div className="relative bg-sea-deep px-12 py-2 text-center text-[12px] leading-relaxed text-paper">
      {PAYMENTS === 'links'
        ? (linksMode === 'test'
          ? '現在テスト公開中です。お支払いはテストモードのため実際には請求されず、商品も発送されません。お問い合わせフォームは送信されません。'
          : 'お問い合わせフォームは準備中のため送信されません。ご連絡は Instagram の DM でお願いします。')
        : '現在デモ公開中です。ご注文・お問い合わせは実際には送信されず、正式な受注にはなりません。'}
      <button type="button" onClick={() => setHidden(true)} aria-label="お知らせを閉じる"
        className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-paper/10">
        <X className="size-4" />
      </button>
    </div>
  );
}

/** カート追加時のフィードバック */
export function CartToast() {
  const { toast } = useCart();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      {toast && (
        <div key={toast.id} className="pointer-events-auto flex animate-fade-up items-center gap-3 rounded-full bg-charcoal py-2 pl-4 pr-2 text-sm text-paper shadow-lg">
          <span className="grid size-6 place-items-center rounded-full bg-sea"><Check className="size-3.5" /></span>
          <span>{toast.message}</span>
          {toast.href && <Link href={toast.href} className="rounded-full bg-paper px-4 py-1.5 text-charcoal">カートを見る</Link>}
        </div>
      )}
    </div>
  );
}
