'use client';

import { useState } from 'react';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { PAYMENTS } from '@/data/site';
import { linkFor } from '@/data/paymentLinks';
import { btn } from '@/components/ui/primitives';
import { QuantityStepper } from './QuantityStepper';

/** 数量を選んでカートへ */
export function AddToCart({ id, label, withQty = true, className = '' }: { id: string; label: string; withQty?: boolean; className?: string }) {
  if (PAYMENTS === 'links') return <BuyLink id={id} label={label} className={className} />;
  return <CartButton id={id} label={label} withQty={withQty} className={className} />;
}

/** 支払いリンク（Stripe の決済ページへ。数量は Stripe の画面で選ぶ） */
export function BuyLink({ id, label, className = '', compact = false }: { id: string; label: string; className?: string; compact?: boolean }) {
  const href = linkFor(id);
  if (!href) {
    return <span className={compact ? 'rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-3' : btn('ghost', `pointer-events-none opacity-50 ${className}`)}>準備中</span>;
  }
  if (compact) {
    return (
      <a href={href} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] transition hover:border-charcoal hover:bg-charcoal hover:text-paper"
        aria-label={`${label}を購入する（Stripe の決済ページへ）`}>
        購入<ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
      </a>
    );
  }
  return (
    <div className={`grid gap-2 ${className}`}>
      <a href={href} className={btn('primary', 'w-full sm:w-auto sm:min-w-64')}>
        <ShoppingBag className="size-4" strokeWidth={1.5} aria-hidden />購入する
      </a>
      <p className="text-[12px] text-ink-3">Stripe の安全な決済ページに移動します。枚数はその画面で変えられます。</p>
    </div>
  );
}

function CartButton({ id, label, withQty = true, className = '' }: { id: string; label: string; withQty?: boolean; className?: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const onAdd = () => {
    add(id, qty, label);
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  };
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {withQty && <QuantityStepper value={qty} onChange={setQty} label={label} />}
      <button type="button" onClick={onAdd} className={btn('primary', 'flex-1 min-w-48')}>
        <ShoppingBag className="size-4" strokeWidth={1.5} aria-hidden />
        {done ? '追加しました' : 'カートに入れる'}
      </button>
    </div>
  );
}

/** 一覧用の小さな追加ボタン */
export function QuickAdd({ id, label }: { id: string; label: string }) {
  if (PAYMENTS === 'links') return <BuyLink id={id} label={label} compact />;
  return <QuickCartAdd id={id} label={label} />;
}

function QuickCartAdd({ id, label }: { id: string; label: string }) {
  const { add } = useCart();
  return (
    <button type="button" onClick={() => add(id, 1, label)}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] transition hover:border-charcoal hover:bg-charcoal hover:text-paper"
      aria-label={`${label}をカートに入れる`}>
      <ShoppingBag className="size-3.5" strokeWidth={1.5} aria-hidden />カートへ
    </button>
  );
}
