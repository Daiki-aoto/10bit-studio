'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { summarize, type CartLines, type CartSummary } from '@/lib/pricing';

const KEY = 'nakajima-cart-v1';
const MAX_QTY = 30;

interface Toast { id: number; message: string; href?: string }

interface CartCtx {
  lines: CartLines;
  summary: CartSummary;
  ready: boolean;
  add: (id: string, qty?: number, label?: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toast: Toast | null;
  bump: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLines>({});
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [bump, setBump] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // localStorage から復元（使えない環境でも動くように try/catch）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw) as CartLines);
    } catch { /* 空のカートで続行 */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* 保存できなくても続行 */ }
  }, [lines, ready]);

  const notify = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message, href: '/cart' });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const add = useCallback((id: string, qty = 1, label?: string) => {
    setLines((l) => ({ ...l, [id]: Math.min(MAX_QTY, (l[id] ?? 0) + qty) }));
    setBump((b) => b + 1);
    notify(`${label ?? '商品'}をカートに追加しました`);
  }, [notify]);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((l) => {
      const next = { ...l };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(MAX_QTY, qty);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => setQty(id, 0), [setQty]);
  const clear = useCallback(() => setLines({}), []);

  const value = useMemo<CartCtx>(() => ({
    lines, summary: summarize(lines), ready, add, setQty, remove, clear, toast, bump,
  }), [lines, ready, add, setQty, remove, clear, toast, bump]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
}

export { MAX_QTY };
