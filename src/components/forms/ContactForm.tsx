'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { inquiryTypes } from '@/data/contact';
import { DEMO_MODE, FORMS_LIVE } from '@/data/site';
import { FormsNotice } from './FormsNotice';
import { rules, validate } from '@/lib/validation';
import { submit } from '@/lib/submit';
import { btn } from '@/components/ui/primitives';
import { ChoiceGroup, ConfirmList, Steps, TextArea, TextField, focusFirstError } from './fields';
import { Done } from './Done';
import { Honeypot } from './Honeypot';

type Values = { type: string; name: string; email: string; subject: string; details: string };
const empty: Values = { type: '', name: '', email: '', subject: '', details: '' };
const schema = {
  type: [rules.select('お問い合わせの種類')],
  name: [rules.required('お名前'), rules.maxLen('お名前', 50)],
  email: [rules.email],
  subject: [rules.required('お問い合わせ内容'), rules.maxLen('お問い合わせ内容', 80)],
  details: [rules.maxLen('詳細・備考', 2000)],
};

export function ContactForm() {
  if (!FORMS_LIVE) return <FormsNotice topic="お問い合わせ" />;
  return <ContactFormInner />;
}

function ContactFormInner() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState('');
  const [doneId, setDoneId] = useState('');
  const [botcheck, setBotcheck] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // ?type=video などで種類を事前に選ぶ
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type');
    if (t && inquiryTypes.some((i) => i.id === t)) setV((s) => ({ ...s, type: t }));
  }, []);

  const type = inquiryTypes.find((t) => t.id === v.type);
  const route = type && 'route' in type ? type.route : undefined;

  const set = (k: keyof Values) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: validate({ ...v, [k]: val }, { [k]: schema[k] })[k] }));
  };
  const onInput = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k)(e.target.value);
  const onBlur = (k: keyof Values) => () => setErrors((e) => ({ ...e, [k]: validate(v, { [k]: schema[k] })[k] }));
  const goTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const toConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(v, schema);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) { requestAnimationFrame(() => focusFirstError(formRef.current)); return; }
    setStep(1); goTop();
  };
  const send = async () => {
    setSending(true); setSendErr('');
    const res = await submit('contact', {
      name: v.name, email: v.email, botcheck,
      rows: { お問い合わせの種類: type?.label, お名前: v.name, メールアドレス: v.email, お問い合わせ内容: v.subject, '詳細・備考': v.details },
    });
    setSending(false);
    if (!res.ok) { setSendErr(res.message); return; }
    setDoneId(res.id); setStep(2); goTop();
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      <Steps steps={['入力', '確認', '送信完了']} current={step} />

      {step === 0 && (
        <form ref={formRef} onSubmit={toConfirm} noValidate className="grid gap-8">
          <ChoiceGroup name="type" label="お問い合わせの種類" required value={v.type} onChange={set('type')} error={errors.type}
            options={inquiryTypes.map((t) => ({ value: t.id, label: t.label }))} columns={2} />

          {route && (
            <div className="flex flex-col gap-3 rounded-lg border border-sea/40 bg-sea-soft/60 p-5 sm:flex-row sm:items-center sm:justify-between" role="note">
              <p className="text-sm leading-relaxed">{route.text}</p>
              <Link href={route.href} className={btn('primary', 'shrink-0 min-h-11 px-5 text-sm')}>
                {v.type === 'memory' ? '専用フォームへ' : 'ページを見る'}<ArrowRight className="size-4" />
              </Link>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="name" label="お名前" required autoComplete="name" value={v.name} onChange={onInput('name')} onBlur={onBlur('name')} error={errors.name} placeholder="中島 花子" />
            <TextField name="email" label="メールアドレス" required type="email" inputMode="email" autoComplete="email" value={v.email} onChange={onInput('email')} onBlur={onBlur('email')} error={errors.email} placeholder="hanako@example.com" />
          </div>
          <TextField name="subject" label="お問い合わせ内容" required value={v.subject} onChange={onInput('subject')} onBlur={onBlur('subject')} error={errors.subject} placeholder="例）店舗のPR動画について相談したい" />
          <TextArea name="details" label="詳細・備考" value={v.details} onChange={onInput('details')} onBlur={onBlur('details')} error={errors.details}
            placeholder="時期、場所、ご予算の目安などがあればご記入ください" />
          <Honeypot onChange={setBotcheck} />
          <p className="text-sm text-ink-3">送信いただいた内容は、<Link href="/privacy" className="underline">プライバシーポリシー</Link>にもとづいて取り扱います。</p>
          <div className="flex justify-end">
            <button type="submit" className={btn('primary', 'w-full sm:w-auto sm:min-w-64')}>入力内容を確認する</button>
          </div>
        </form>
      )}

      {step === 1 && (
        <div className="grid gap-8">
          <ConfirmList rows={[
            { label: 'お問い合わせの種類', value: type?.label },
            { label: 'お名前', value: v.name },
            { label: 'メールアドレス', value: v.email },
            { label: 'お問い合わせ内容', value: v.subject },
            { label: '詳細・備考', value: v.details },
          ]} />
          {DEMO_MODE && <p className="rounded-md bg-sea-soft px-4 py-3 text-sm">デモのため、送信してもメールは届かず、データも保存されません。</p>}
          {sendErr && <p role="alert" className="text-sm text-danger">{sendErr}</p>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => { setStep(0); goTop(); }} className={btn('ghost')}>← 修正する</button>
            <button type="button" onClick={send} disabled={sending} className={btn('primary', 'sm:min-w-64')}>
              {sending ? <><Loader2 className="size-4 animate-spin" />送信しています</> : 'この内容で送信する'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <Done id={doneId} title="お問い合わせを受け付けました" kind="受付番号"
          lines={[`${v.name} 様、お問い合わせありがとうございます。`, '内容を確認し、メールでご返信します。']}
          onReset={() => { setV(empty); setErrors({}); setStep(0); goTop(); }} resetLabel="別のお問い合わせをする" />
      )}
    </div>
  );
}
