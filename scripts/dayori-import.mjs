/**
 * 中島だよりの紙面を Web 用に取り込むスクリプト。
 *
 * 使い方：
 *   npm run dayori:import -- --slug vol03 --src "/path/to/ページ画像のフォルダ" [--pdf "/path/to/original.pdf"]
 *
 * - フォルダ内の画像（png/jpg）をファイル名末尾の数字順に並べ、各ページを
 *     public/dayori/<slug>/pages/sm/01.jpg（800px幅：スマホ・通常表示）
 *     public/dayori/<slug>/pages/lg/01.jpg（1600px幅：拡大表示）
 *   に書き出す。画像は縮小・圧縮のみ（トリミング・色調整はしない）。
 * - 表紙は 1ページ目から public/dayori/<slug>/cover.jpg を作る。
 * - --pdf を渡すとそのPDFをコピー。無い場合はページ画像から B5 サイズのPDFを生成する。
 * - 最後に src/data/dayori.ts に貼り付ける設定の例を表示する。
 */
import { mkdirSync, readdirSync, copyFileSync, writeFileSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith('--') ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []),
);
if (!args.slug || !args.src) {
  console.error('使い方: npm run dayori:import -- --slug vol03 --src "<画像フォルダ>" [--pdf "<PDF>"]');
  process.exit(1);
}

const num = (f) => Number((f.match(/(\d+)(?=\.[^.]+$)/) ?? [0, 0])[1]);
const files = readdirSync(args.src)
  .filter((f) => ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(f).toLowerCase()))
  .sort((a, b) => num(a) - num(b));
if (!files.length) { console.error('画像が見つかりません'); process.exit(1); }

const base = join(process.cwd(), 'public', 'dayori', args.slug);
for (const d of ['pages/sm', 'pages/lg']) mkdirSync(join(base, d), { recursive: true });

let width = 0, height = 0;
for (const [i, f] of files.entries()) {
  const nn = String(i + 1).padStart(2, '0');
  const src = join(args.src, f);
  const meta = await sharp(src).metadata();
  width = meta.width; height = meta.height;
  await sharp(src).resize({ width: 800 }).jpeg({ quality: 78, mozjpeg: true }).toFile(join(base, 'pages/sm', `${nn}.jpg`));
  await sharp(src).resize({ width: 1600 }).jpeg({ quality: 80, mozjpeg: true }).toFile(join(base, 'pages/lg', `${nn}.jpg`));
  if (i === 0) await sharp(src).resize({ width: 1000 }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(base, 'cover.jpg'));
  console.log(`  ${nn}  ${f}`);
}

let pdfInfo;
if (args.pdf) {
  copyFileSync(args.pdf, join(base, 'issue.pdf'));
  pdfInfo = 'コピーしたPDF';
} else {
  // B5（182×257mm）のページに、拡大用画像をそのまま配置
  const mm = (v) => (v / 25.4) * 72;
  const pdf = await PDFDocument.create();
  pdf.setTitle(`中島だより ${args.slug}`);
  for (let i = 0; i < files.length; i++) {
    const nn = String(i + 1).padStart(2, '0');
    const img = await pdf.embedJpg(readFileSync(join(base, 'pages/lg', `${nn}.jpg`)));
    const page = pdf.addPage([mm(182), mm(257)]);
    const { width: pw, height: ph } = page.getSize();
    const scale = Math.min(pw / img.width, ph / img.height);
    const w = img.width * scale, h = img.height * scale;
    page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
  }
  writeFileSync(join(base, 'issue.pdf'), await pdf.save());
  pdfInfo = 'ページ画像から生成したPDF（B5）';
}
const mb = (statSync(join(base, 'issue.pdf')).size / 1024 / 1024).toFixed(1);

console.log(`\n✓ ${files.length}ページを書き出しました（${pdfInfo}・${mb}MB）`);
console.log(`\nsrc/data/dayori.ts の issues に追加・更新してください：
  {
    slug: '${args.slug}',
    ...
    cover: '/dayori/${args.slug}/cover.jpg',
    pdf: '/dayori/${args.slug}/issue.pdf',
    pageImages: true,
    pageCount: ${files.length},
    pageRatio: ${(width / height).toFixed(4)},
  },`);
