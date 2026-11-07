import type { Metadata } from 'next';
import { Container } from '@/components/ui/primitives';
import { Checkout } from '@/components/cart/Checkout';
import { PurchaseGuide } from '@/components/cart/PurchaseGuide';
import { PAYMENTS } from '@/data/site';

export const metadata: Metadata = {
  title: PAYMENTS === 'links' ? 'How to Buy — 購入方法' : 'Cart — カート・ご注文',
  robots: { index: false },
};

export default function CartPage() {
  return (
    <Container className="pb-28 pt-14 lg:pt-20">
      <p className="eyebrow">{PAYMENTS === 'links' ? 'How to Buy' : 'Cart & Order'}</p>
      <h1 className="mincho mt-4 mb-12 text-[clamp(28px,3.6vw,44px)]">{PAYMENTS === 'links' ? '購入方法' : 'カート・ご注文'}</h1>
      {PAYMENTS === 'links' ? <PurchaseGuide /> : <Checkout />}
    </Container>
  );
}
