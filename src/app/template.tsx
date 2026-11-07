/** ページ遷移のたびに、本文をやわらかくフェードインさせる */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
