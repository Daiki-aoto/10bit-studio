/** お問い合わせ種別。route があるものは、専用フォーム・ページへ案内する */
export const inquiryTypes = [
  { id: 'postcard', label: 'ポストカードについて', route: { href: '/postcards', text: 'ご購入はポストカードのページからカートに入れて手続きできます。' } },
  { id: 'memory', label: '思い出ムービー制作について', route: { href: '/memory-movie#form', text: '制作のご相談・お見積もりは、専用フォームのほうが詳しく伺えます。' } },
  { id: 'dayori', label: '中島だより（掲載・応援）について' },
  { id: 'photo', label: '写真撮影について' },
  { id: 'edit', label: '動画編集について' },
  { id: 'video', label: '映像制作について', route: { href: '/video-production', text: '対応できる内容は映像制作のページでご覧いただけます。' } },
  { id: 'other', label: 'その他' },
] as const;

export type InquiryTypeId = (typeof inquiryTypes)[number]['id'];
