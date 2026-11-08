/**
 * public/ に置いたファイル（画像・動画・PDF）のURLを作る。
 * GitHub Pages では URL が https://<ユーザー名>.github.io/<リポジトリ名>/… になるため、
 * 先頭に NEXT_PUBLIC_BASE_PATH（例：/10bit-studio）を付ける。ページ間リンクは Next.js が自動で付ける。
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path: string) => (path.startsWith('/') && !path.startsWith('//') ? `${BASE_PATH}${path}` : path);

/**
 * SNS のシェア画像（og:image）用の完全なURL。
 * 画像の src はすでに BASE_PATH 付きなので、metadataBase（BASE_PATH 付き）に任せると
 * /10bit-studio/10bit-studio/… と二重になる。そのためドメインだけを前に付ける。
 */
export const absoluteUrl = (src: string) => {
  if (!src.startsWith('/') || src.startsWith('//')) return src;
  const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com').origin;
  return `${origin}${src}`;
};
