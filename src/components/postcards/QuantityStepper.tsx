'use client';

import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({ value, onChange, min = 1, max = 30, label, size = 'md' }:
  { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'size-9' : 'size-11';
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper" role="group" aria-label={`${label}の数量`}>
      <button type="button" className={`${s} grid place-items-center rounded-full hover:bg-sand disabled:opacity-30`}
        onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label}を1つ減らす`}>
        <Minus className="size-4" strokeWidth={1.5} />
      </button>
      <output className="min-w-8 text-center font-latin text-xl font-semibold tabular-nums" aria-live="polite">{value}</output>
      <button type="button" className={`${s} grid place-items-center rounded-full hover:bg-sand disabled:opacity-30`}
        onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}を1つ増やす`}>
        <Plus className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
