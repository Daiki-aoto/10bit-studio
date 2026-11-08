/**
 * ポストカード商品データ（一元管理）。
 * 写真・詩は提供素材のまま。画像は加工せず、表示時もトリミングしない。
 */
import type { StaticImageData } from 'next/image';
import michi from '@/assets/postcards/web/michi.jpg';
import imanoomoi from '@/assets/postcards/web/imanoomoi.jpg';
import keshiki from '@/assets/postcards/web/keshiki.jpg';
import sekai from '@/assets/postcards/web/sekai.jpg';
import umakuikanai from '@/assets/postcards/web/umakuikanai.jpg';
import donnakotomo from '@/assets/postcards/web/donnakotomo.jpg';
import sora from '@/assets/postcards/web/sora.jpg';
import ai from '@/assets/postcards/web/ai.jpg';
import waratte from '@/assets/postcards/web/waratte.jpg';
import watashinome from '@/assets/postcards/web/watashinome.jpg';

export interface Postcard {
  id: string;
  no: string;
  title: string;
  image: StaticImageData;
  poem: string[];
}

export const credit = 'PHOTO by Bit × sachie mine';

/** 詩を書いた sachie mine さんの紹介（本人提供の情報より・2026-11-08） */
export const poet = {
  name: 'sachie mine',
  photoAlt: '壁画の前に立つ sachie mine さん',
  lead: '1986年、青森県生まれ。愛媛県・中島で島暮らしをしながら制作を行っています。',
  body: [
    'ジャンルにとらわれず、インスピレーションをもとに「心の中の光」を描くフリーアートを制作。壁画制作やオーダーメイドの絵画、各地での個展、イベント出店のほか、子どもたちに自由な表現を伝えるワークショップも行っています。',
    '「松山デザインウィーク」のオープニングや「道後マルシェ」など、松山市のイベントでのライブペインティングや展示にも参加し、地域に根ざしたアート活動を続けています。',
    '描いた絵を布に仕立てた、世界にひとつだけの服や小物の販売も。sachie_mine 名義で、ギターの弾き語りなどの音楽活動も行っています。',
  ],
  links: [
    { label: 'Instagram @sachie_mine', href: 'https://www.instagram.com/sachie_mine/' },
    { label: '音楽活動 Instagram @sachie_music', href: 'https://www.instagram.com/sachie_music/' },
  ],
};
export const productSummary =
  '愛媛県松山市の離島・中島で撮影した写真に、詩人・sachie mine さんの詩を添えたオリジナルポストカード。';

export const postcards: Postcard[] = [
  { id: 'michi', no: '01', title: 'どこまでも、たどりつくまで', image: michi,
    poem: ['道', 'たどりつきたい、', '景色がある。', '見てみたい景色が', 'ある。', 'どこまでも', '続く道、歩き続ける。', 'かならず、私にしかたどりつけない', '場所があるから。'] },
  { id: 'imanoomoi', no: '02', title: '涙がかためた、笑顔が照らす道', image: imanoomoi,
    poem: ['今の想いが', '未来につながる', '楽しい時も涙する時も', 'あるけれど', 'それでも歩いていく。', '涙は歩く道を', 'かためてくれて', '笑顔は空を照らす', 'そうして人の心も', '自分の心も満たされていく。'] },
  { id: 'keshiki', no: '03', title: '大丈夫。と、この海が言う', image: keshiki,
    poem: ['この景色', '目に焼きつける', 'きっと、未来の私の', '心に寄りそってくれる', 'この風景を。', 'いつだって', '大丈夫。', 'そんな気がするから。'] },
  { id: 'sekai', no: '04', title: '世界をみたす、あたたかな色', image: sekai,
    poem: ['世界は愛で溢れてる。'] },
  { id: 'umakuikanai', no: '05', title: 'あとは、上がるだけだから', image: umakuikanai,
    poem: ['うまくいかない日、', '思い通りにならない日', '迷ってもいい', '悩んでもいい', '泣いても、怒っても', '前を向けなくてもいい', '人が良くみえても', '素直に喜べなくても', '笑えなくてもいい', 'そう感じるコトが大切', 'あとは上がるだけ', '飛び立つためには', '一度、沈まなければ', 'いけないのだから'] },
  { id: 'donnakotomo', no: '06', title: '未来の私へ、つなぐ灯', image: donnakotomo,
    poem: ['どんなコトも', '意味がある。', '一つ一つが', '私を強くする。', 'あせらず今を味わって', 'この道を歩こう。', '未来の私は', '笑ってる。'] },
  { id: 'sora', no: '07', title: '遠く離れても、繋がっている', image: sora,
    poem: ['空はいつも', '遠く離れた', '繋がりを教えてくれる。', '空を見れば', '愛がある。', 'あなたは一人じゃない。', 'それを', '忘れないでいよう。'] },
  { id: 'ai', no: '08', title: 'すべては、この愛から始まる', image: ai,
    poem: ['愛だよな。', 'すべては愛だよ。', 'シンプルなんだ、', '愛から全てが', '始まるんだ。'] },
  { id: 'waratte', no: '09', title: 'ありがとうと、愛してる', image: waratte,
    poem: ['笑っていれば', '全てうまくいく', '笑顔でとなりに', 'いてくれる', '大切な人に伝えよう', 'ありがとうと', '愛してる'] },
  { id: 'watashinome', no: '10', title: '心に刻む、今のオモイ', image: watashinome,
    poem: ['私の目にうつるモノ', '感じるモノ', '今のオモイ', '忘れたくない', '心に刻んで', '一歩ずつ歩いてく'] },
];

export const getPostcard = (id: string) => postcards.find((p) => p.id === id);

/** カートで使う商品ID。全10種セットは専用ID */
export const SET_ID = 'set-all';
