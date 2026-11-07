import type { NextConfig } from "next";

/**
 * GitHub Pages 用の書き出し：GITHUB_PAGES=true で静的ファイル（out/）を作る。
 * PAGES_BASE_PATH はリポジトリ名（例：/10bit-studio）。https://<ユーザー名>.github.io/<リポジトリ名>/ で公開される。
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? "/10bit-studio") : "";

const nextConfig: NextConfig = {
  ...(pages
    ? {
        output: "export",
        basePath,
        trailingSlash: true, // /postcards/ → postcards/index.html（GitHub Pages で確実に開ける）
        images: { unoptimized: true }, // 画像の自動最適化はサーバーが必要なため、ビルド時の画像をそのまま使う
      }
    : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // cacheComponents（新しいキャッシュ機能）は静的書き出しと併用できないため使わない
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
