import type { Metadata } from 'next';
import { site, profile } from '@/data/site';
import { ContactLink, LegalPage, LegalSection } from '@/components/ui/LegalPage';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: `${site.brand} における個人情報の取り扱いについて。`,
};

const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="grid gap-1.5 pl-5 [list-style:disc]">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
);

export default function PrivacyPage() {
  return (
    <LegalPage en="Privacy Policy" title="プライバシーポリシー" updated="2026年11月8日 制定">
      <p>{site.brand}（運営：{profile.name}。以下「当方」）は、お客さまの個人情報を、次のとおり大切に取り扱います。</p>

      <LegalSection title="1. 取得する情報">
        <List items={[
          'お問い合わせ・思い出ムービーのご相談フォーム：お名前、メールアドレス、電話番号（任意）、ご相談の内容',
          'ポストカードのご購入：お名前、メールアドレス、電話番号、お届け先の住所',
          'クレジットカードなどのお支払い情報は、決済サービスの Stripe が直接取り扱います。当方がカード番号を受け取ったり、保存したりすることはありません。',
        ]} />
      </LegalSection>

      <LegalSection title="2. 利用する目的">
        <List items={[
          'お問い合わせ・ご相談へのお返事、お見積もりのご連絡',
          'ご注文いただいた商品の発送と、ご注文に関するご連絡',
          'ご依頼いただいた制作の進行と、納品に関するご連絡',
          '法令にもとづく対応',
        ]} />
        <p>これ以外の目的には使いません。ご本人の同意なく、広告やお知らせのメールをお送りすることもありません。</p>
      </LegalSection>

      <LegalSection title="3. 第三者への提供">
        <p>法令にもとづく場合を除き、ご本人の同意なく第三者に個人情報を提供することはありません。ただし、商品をお届けするために、お名前とお届け先を日本郵便にお伝えします。</p>
      </LegalSection>

      <LegalSection title="4. 利用している外部サービス">
        <p>このサイトでは、次のサービスを利用しています。それぞれのサービスの運営会社が、各社のプライバシーポリシーにもとづいて情報を取り扱います。海外の事業者が運営するサービスを含むため、情報が海外のサーバーで取り扱われる場合があります。</p>
        <List items={[
          'Stripe：ポストカードの決済',
          'Web3Forms：お問い合わせフォームの内容を当方にメールで届ける',
          'GitHub Pages：このサイトの公開（サイトの閲覧時に、IPアドレスなどの記録が残る場合があります）',
          'YouTube：映像作品の再生（再生ボタンを押したときだけ、Cookie を使わない「プライバシー強化モード」で読み込みます）',
        ]} />
      </LegalSection>

      <LegalSection title="5. アクセス解析・Cookie">
        <p>このサイトでは、アクセス解析ツールや広告のための Cookie は使っていません。カートの内容など、サイトを使うために必要な情報だけを、お使いのブラウザの中に保存することがあります。この情報が当方に送られることはありません。</p>
      </LegalSection>

      <LegalSection title="6. 安全な管理">
        <p>いただいた個人情報は、目的のために必要な期間だけ保管し、漏えいや紛失が起きないよう適切に管理します。</p>
      </LegalSection>

      <LegalSection title="7. 開示・訂正・削除のご請求">
        <p>ご自身の個人情報の開示・訂正・利用停止・削除をご希望の場合は、<ContactLink />よりご連絡ください。ご本人であることを確認したうえで、速やかに対応します。</p>
      </LegalSection>

      <LegalSection title="8. このポリシーの変更">
        <p>法令の変更などに合わせて、このポリシーを変更することがあります。変更した場合は、このページでお知らせします。</p>
      </LegalSection>

      <LegalSection title="9. お問い合わせ窓口">
        <p>{site.brand}　運営責任者 {profile.name}<br />個人情報の取り扱いについてのお問い合わせは、<ContactLink />よりご連絡ください。</p>
      </LegalSection>
    </LegalPage>
  );
}
