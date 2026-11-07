/**
 * トップページのメインビジュアル動画。
 * 動画を差し替えるときは public/videos/ にファイルを置き、ここのパスを書き換えるだけでOK。
 *
 * - sources: 画面幅に応じて使い分ける（小さい画面ほど軽いファイル）。上から順に判定し、最後は必ず使われる
 * - poster : 読み込み中に表示するサムネイル
 * - fallback: 動画が再生できないときの代替画像
 * - 自動再生はミュートが前提のため、音声は再生されない
 */
import { asset } from '@/lib/asset';
export const heroVideo = {
  enabled: true,
  sources: [
    { src: asset('/videos/oura-taiko-540.mp4'), maxWidth: 767 },   // スマートフォン（960×540・約5MB）
    { src: asset('/videos/oura-taiko-1080.mp4'), maxWidth: Infinity }, // PC・タブレット（1920×1080・約11MB）
  ],
  poster: { lg: asset('/videos/oura-taiko-poster.jpg'), sm: asset('/videos/oura-taiko-poster-sm.jpg') },
  fallback: asset('/videos/oura-taiko-poster.jpg'),
  /** 縦横比（幅 / 高さ） */
  ratio: 16 / 9,
  label: '大浦太鼓まつり 2026 の映像',
  caption: '大浦太鼓まつり 2026 ／ 撮影・編集 ビット',
};

export type HeroVideoConfig = typeof heroVideo;
