import type { Metadata } from 'next';
import { Container } from '@/components/ui/primitives';
import { Steps } from '@/components/forms/fields';
import { PaymentResult } from '@/components/cart/PaymentResult';

export const metadata: Metadata = { title: 'ご注文完了', robots: { index: false } };

export default function SuccessPage() {
  return (
    <Container className="pb-28 pt-14 lg:pt-20">
      <p className="eyebrow">Order Complete</p>
      <h1 className="mincho mb-12 mt-4 text-[clamp(28px,3.6vw,44px)]">ご注文完了</h1>
      <Steps steps={['カート', '確認', 'お支払い', '完了']} current={3} />
      <PaymentResult />
    </Container>
  );
}
