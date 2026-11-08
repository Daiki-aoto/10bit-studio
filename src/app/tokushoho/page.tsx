import type { Metadata } from 'next';
import { site, profile } from '@/data/site';
import { postcardPrice, SHIPPING_FEE, payment, shipTiming, returns } from '@/data/pricing';
import { ContactLink, LegalPage, LegalSection, LegalTable } from '@/components/ui/LegalPage';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
  description: `${site.brand} のポストカード販売・制作サービスについての、特定商取引法に基づく表記です。`,
};

const yen = (n: number) => `${n.toLocaleString()}円`;
const onRequest = '請求があった場合には、遅滞なく開示いたします。お問い合わせフォームよりご請求ください。';

export default function TokushohoPage() {
  return (
    <LegalPage en="Legal" title="特定商取引法に基づく表記" updated="2026年11月8日 制定">
      <LegalSection title="事業者について">
        <LegalTable rows={[
          { label: '販売事業者', value: `${site.brand}（屋号）` },
          { label: '運営責任者', value: profile.name },
          { label: '所在地', value: onRequest },
          { label: '電話番号', value: onRequest },
          { label: 'お問い合わせ', value: <><ContactLink />よりご連絡ください。内容を確認し、メールでお返事します。</> },
        ]} />
      </LegalSection>

      <LegalSection title="ポストカードの販売について">
        <LegalTable rows={[
          { label: '販売価格', value: <>1枚 {yen(postcardPrice.single)}、3枚セット {yen(postcardPrice.bundle3)}、全10種類セット {yen(postcardPrice.setAll)}<br />各商品ページに表示している金額がお支払い金額です。</> },
          { label: '商品代金以外の必要料金', value: `送料 全国一律${yen(SHIPPING_FEE)}（1回のご注文ごと）` },
          { label: 'お支払い方法', value: payment.methods.join('、') + '（Stripe の決済ページでお支払いいただきます）' },
          { label: 'お支払いの時期', value: 'ご注文の手続き時にお支払いが確定します。' },
          { label: '商品の引き渡し時期', value: <>{shipTiming}<br />定形郵便（追跡なし）でお送りするため、お届け日の指定はできません。</> },
          { label: '返品・交換', value: returns.note },
          { label: '注文のキャンセル', value: '商品の性質上、お支払い確定後のキャンセルはお受けできません。お届け先の誤りなどは、発送前であれば対応できる場合がありますので、お早めにご連絡ください。' },
        ]} />
      </LegalSection>

      <LegalSection title="中島だよりの応援について">
        <LegalTable rows={[
          { label: '金額', value: '1回の応援：500円・1,000円・3,000円・自由な金額（100円から）／毎月の応援：月500円・月1,000円' },
          { label: 'お支払い方法', value: payment.methods.join('、') + '（Stripe の決済ページでお支払いいただきます）' },
          { label: 'お支払いの時期', value: '1回の応援はお申し込み時。毎月の応援は、お申し込み日を基準に毎月自動でお支払いいただきます。' },
          { label: 'お礼・お届け', value: '1回の応援は、お礼のメッセージをメールでお送りします（品物のお届けはありません）。毎月の応援は、新しい号が出るたびに（年4回）中島だよりを定形郵便でお送りします。' },
          { label: '解約・返金', value: <>毎月の応援は、<ContactLink />からご連絡いただければ、次回以降のお支払いを止めます。お支払い済みの応援の返金はお受けできません。</> },
        ]} />
      </LegalSection>

      <LegalSection title="思い出ムービー・映像制作などのサービスについて">
        <LegalTable rows={[
          { label: '料金', value: '思い出ムービーは各プランに記載の料金から、映像制作は内容に応じて、お見積もりでご提示します。' },
          { label: 'お支払い方法・時期', value: 'お見積もりの際にご案内します。' },
          { label: '納品の時期', value: 'お見積もりの際に、内容に応じた納期をご提示します。' },
          { label: 'キャンセル', value: 'お見積もりにご同意いただき、正式なご依頼となった後のキャンセルについては、お見積もりの際に条件をご案内します。フォームの送信だけでは、ご依頼は確定しません。' },
        ]} />
      </LegalSection>
    </LegalPage>
  );
}
