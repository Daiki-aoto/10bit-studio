import { AtSign } from 'lucide-react';
import { site } from '@/data/site';

/**
 * フォームの送信先が未設定のあいだ（FORMS_LIVE=false）、フォームの代わりに表示する案内。
 * 送っても届かないフォームを公開しないため。
 */
export function FormsNotice({ topic }: { topic: string }) {
  return (
    <div className="grid gap-5 rounded-xl border border-charcoal bg-paper p-6 sm:p-8">
      <p className="mincho text-xl leading-relaxed">{topic}は、Instagram の DM で受け付けています</p>
      <p className="text-sm leading-loose text-ink-2">
        Webからのお問い合わせフォームは準備中です。お手数ですが、Instagram の DM でご連絡ください。
        内容を確認して、お返事します。
      </p>
      <ul className="grid gap-1 text-sm text-ink-2">
        <li>・ご用件（例：思い出ムービーの相談、撮影の依頼 など）</li>
        <li>・ご希望の時期や納期</li>
        <li>・写真や動画のおおよその量（思い出ムービーの場合）</li>
      </ul>
      <p className="text-[13px] text-ink-3">上の内容を書いていただくと、やりとりがスムーズです。</p>
      <a href={site.links.instagram} target="_blank" rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-sea-deep px-7 py-3.5 text-[15px] text-paper transition hover:bg-sea">
        <AtSign className="size-4" strokeWidth={1.5} aria-hidden />
        Instagram {site.links.instagramName} で相談する
      </a>
    </div>
  );
}
