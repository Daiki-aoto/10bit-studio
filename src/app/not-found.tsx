import { ButtonLink, Container } from '@/components/ui/primitives';

export default function NotFound() {
  return (
    <Container className="grid min-h-[60vh] content-center justify-items-start gap-6 py-24">
      <p className="eyebrow">404 — Not Found</p>
      <h1 className="mincho text-3xl">ページが見つかりませんでした</h1>
      <p className="text-ink-2">URLが変わったか、削除された可能性があります。</p>
      <ButtonLink href="/">トップへ戻る</ButtonLink>
    </Container>
  );
}
