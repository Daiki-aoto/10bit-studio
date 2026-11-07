'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Check } from 'lucide-react';

const inputCls =
  'w-full min-h-13 rounded-md border border-line bg-white/70 px-4 py-3 text-base outline-none transition placeholder:text-ink-3/70 focus:border-sea focus:ring-3 focus:ring-sea/20 aria-[invalid=true]:border-danger';

function Label({ htmlFor, label, required, as: Tag = 'label' }: { htmlFor?: string; label: string; required?: boolean; as?: 'label' | 'legend' }) {
  return (
    <Tag htmlFor={Tag === 'label' ? htmlFor : undefined} className="mb-2 flex items-center gap-2 text-sm font-medium">
      {label}
      {required
        ? <span className="rounded-sm bg-sea-deep px-1.5 text-[11px] leading-5 text-paper">必須</span>
        : <span className="rounded-sm border border-line px-1.5 text-[11px] leading-5 text-ink-3">任意</span>}
    </Tag>
  );
}

export function ErrorText({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return <p id={id} role="alert" className="mt-1.5 text-[13px] text-danger">{children}</p>;
}

type Base = { name: string; label: string; error?: string; required?: boolean; hint?: string };

export function TextField({ name, label, error, required, hint, className = '', ...rest }: Base & ComponentPropsWithoutRef<'input'>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <input id={id} name={name} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} className={inputCls} {...rest} />
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-ink-3">{hint}</p>}
      <ErrorText id={`${id}-err`}>{error}</ErrorText>
    </div>
  );
}

export function TextArea({ name, label, error, required, hint, className = '', ...rest }: Base & ComponentPropsWithoutRef<'textarea'>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <textarea id={id} name={name} rows={5} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={`${inputCls} min-h-32 resize-y`} {...rest} />
      {hint && !error && <p className="mt-1.5 text-[12px] text-ink-3">{hint}</p>}
      <ErrorText id={`${id}-err`}>{error}</ErrorText>
    </div>
  );
}

export function SelectField({ name, label, error, required, options, placeholder = '選んでください', className = '', ...rest }:
  Base & { options: readonly { value: string; label: string }[]; placeholder?: string } & ComponentPropsWithoutRef<'select'>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <select id={id} name={name} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
        className={`${inputCls} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%232a2a28' stroke-width='1.4'/%3E%3C/svg%3E")] bg-[position:right_16px_center] bg-no-repeat pr-10`} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ErrorText id={`${id}-err`}>{error}</ErrorText>
    </div>
  );
}

/** カード型のラジオ（選択肢が少なく、説明を添えたいとき） */
export function ChoiceGroup({ name, label, error, required, value, onChange, options, columns = 2 }:
  Base & { value: string; onChange: (v: string) => void; options: readonly { value: string; label: string; desc?: string }[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[columns];
  return (
    <fieldset aria-describedby={error ? `f-${name}-err` : undefined}>
      <Label as="legend" label={label} required={required} />
      <div className={`grid gap-2.5 ${cols}`}>
        {options.map((o) => {
          const on = value === o.value;
          return (
            <label key={o.value} className={`relative flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3.5 transition ${on ? 'border-sea-deep bg-sea-soft/60 ring-1 ring-sea-deep' : 'border-line bg-white/60 hover:border-ink-3'}`}>
              <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="peer sr-only" />
              <span className={`mt-1 grid size-4.5 shrink-0 place-items-center rounded-full border ${on ? 'border-sea-deep bg-sea-deep' : 'border-ink-3'} peer-focus-visible:ring-2 peer-focus-visible:ring-sea`}>
                {on && <Check className="size-3 text-paper" strokeWidth={3} />}
              </span>
              <span className="text-[15px] leading-snug">{o.label}{o.desc && <span className="mt-1 block text-[12px] text-ink-2">{o.desc}</span>}</span>
            </label>
          );
        })}
      </div>
      <ErrorText id={`f-${name}-err`}>{error}</ErrorText>
    </fieldset>
  );
}

export function Checkbox({ name, label, checked, onChange, error }: { name: string; label: ReactNode; checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error}
          className="mt-0.5 size-5 shrink-0 accent-[var(--color-sea-deep)]" aria-describedby={error ? `f-${name}-err` : undefined} />
        <span>{label}</span>
      </label>
      <ErrorText id={`f-${name}-err`}>{error}</ErrorText>
    </div>
  );
}

/** 入力 → 確認 → 完了 の段階表示 */
export function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mb-10 grid border-b border-line" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))` }} aria-label="手続きの段階">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        return (
          <li key={s} aria-current={state === 'current' ? 'step' : undefined}
            className={`-mb-px flex flex-col items-start gap-2 border-b-2 pb-3 text-[13px] sm:flex-row sm:items-center ${state === 'current' ? 'border-sea-deep text-charcoal' : state === 'done' ? 'border-ink-3 text-ink-2' : 'border-transparent text-ink-3'}`}>
            <span className={`grid size-7 place-items-center rounded-full border font-latin text-[15px] font-semibold ${state === 'current' ? 'border-sea-deep bg-sea-deep text-paper' : 'border-current'}`}>
              {state === 'done' ? <Check className="size-3.5" /> : i + 1}
            </span>
            {s}
          </li>
        );
      })}
    </ol>
  );
}

/** 確認画面の一覧 */
export function ConfirmList({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="border-t border-charcoal">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[12em_1fr] sm:gap-6">
          <dt className="text-sm text-ink-2">{r.label}</dt>
          <dd className="whitespace-pre-wrap break-words">{r.value || <span className="text-ink-3">（未入力）</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

/** エラーが出たとき、最初の項目へフォーカス */
export function focusFirstError(form: HTMLElement | null) {
  const el = form?.querySelector<HTMLElement>('[aria-invalid="true"]');
  el?.focus();
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
