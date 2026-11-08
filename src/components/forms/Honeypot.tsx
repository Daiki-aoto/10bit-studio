/**
 * スパム対策の「人には見えない欄」。自動投稿プログラムがチェックを入れると、Web3Forms が受け取らない。
 */
export function Honeypot({ onChange }: { onChange: (checked: boolean) => void }) {
  return (
    <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
      className="hidden" onChange={(e) => onChange(e.target.checked)} />
  );
}
