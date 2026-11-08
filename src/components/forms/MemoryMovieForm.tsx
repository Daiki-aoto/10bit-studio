'use client';

import { useRef, useState } from 'react';
import { CircleAlert, Loader2 } from 'lucide-react';
import { plans, uses } from '@/data/memoryMovie';
import { DEMO_MODE, FORMS_LIVE } from '@/data/site';
import { FormsNotice } from './FormsNotice';
import { rules, validate } from '@/lib/validation';
import { submit } from '@/lib/submit';
import { btn } from '@/components/ui/primitives';
import { ChoiceGroup, ConfirmList, SelectField, Steps, TextArea, TextField, Checkbox, focusFirstError } from './fields';
import { Done } from './Done';
import { Honeypot } from './Honeypot';

const planOptions = [
  ...plans.map((p) => ({ value: p.id, label: `${p.name}プラン`, desc: `${p.price.toLocaleString()}円〜` })),
  { value: 'consult', label: '相談して決めたい', desc: '内容を伺ってからご提案します' },
];
const yesNo = [{ value: 'yes', label: 'あり' }, { value: 'no', label: 'なし' }, { value: 'unknown', label: 'わからない' }];
const shootOptions = [{ value: 'yes', label: '希望する' }, { value: 'no', label: '希望しない' }, { value: 'consult', label: '相談したい' }];
const lengthOptions = ['1分程度', '3分以内', '5分以内', '5分以上', '未定・相談したい'].map((v) => ({ value: v, label: v }));
const photoOptions = ['なし', '〜20枚', '〜50枚', '〜100枚', '100枚以上', 'わからない'].map((v) => ({ value: v, label: v }));

type Values = {
  name: string; email: string; tel: string; plan: string; use: string; length: string;
  photos: string; hasVideo: string; deadline: string; shoot: string; notes: string;
};
const empty: Values = { name: '', email: '', tel: '', plan: '', use: '', length: '', photos: '', hasVideo: '', deadline: '', shoot: '', notes: '' };

const schema = {
  name: [rules.required('お名前'), rules.maxLen('お名前', 50)],
  email: [rules.email],
  tel: [rules.telOptional],
  plan: [rules.select('希望するプラン')],
  use: [rules.select('映像の用途')],
  length: [rules.select('希望する完成尺')],
  photos: [rules.select('写真のおおよその枚数')],
  hasVideo: [rules.select('動画素材の有無')],
  shoot: [rules.select('撮影の希望')],
  notes: [rules.maxLen('要望・備考', 2000)],
};

const labelOf = (opts: readonly { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label ?? v;

export function MemoryMovieForm() {
  if (!FORMS_LIVE) return <FormsNotice topic="思い出ムービーのご相談" />;
  return <MemoryMovieFormInner />;
}

function MemoryMovieFormInner() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [agree, setAgree] = useState(false);
  const [agreeErr, setAgreeErr] = useState('');
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState('');
  const [doneId, setDoneId] = useState('');
  const [botcheck, setBotcheck] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Values) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: validate({ ...v, [k]: val }, { [k]: schema[k as keyof typeof schema] })[k] }));
  };
  const onInput = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(k)(e.target.value);
  const onBlur = (k: keyof typeof schema) => () => setErrors((e) => ({ ...e, [k]: validate(v, { [k]: schema[k] })[k] }));
  const goTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const toConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(v, schema);
    setErrors(errs);
    setAgreeErr(agree ? '' : '内容の確認にチェックしてください');
    if (Object.values(errs).some(Boolean) || !agree) { requestAnimationFrame(() => focusFirstError(formRef.current)); return; }
    setStep(1); goTop();
  };

  const send = async () => {
    setSending(true); setSendErr('');
    const res = await submit('memory-movie', {
      name: v.name, email: v.email, botcheck,
      rows: {
        お名前: v.name, メールアドレス: v.email, 電話番号: v.tel,
        希望するプラン: labelOf(planOptions, v.plan), 映像の用途: v.use, 希望する完成尺: v.length,
        写真のおおよその枚数: v.photos, 動画素材の有無: labelOf(yesNo, v.hasVideo), 撮影の希望: labelOf(shootOptions, v.shoot),
        希望納期: v.deadline, '要望・備考': v.notes,
      },
    });
    setSending(false);
    if (!res.ok) { setSendErr(res.message); return; }
    setDoneId(res.id); setStep(2); goTop();
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      <Steps steps={['入力', '確認', '受付完了']} current={step} />

      {step === 0 && (
        <form ref={formRef} onSubmit={toConfirm} noValidate className="grid gap-10">
          <section className="grid gap-6">
            <h3 className="mincho text-lg">基本情報</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField name="name" label="お名前" required autoComplete="name" value={v.name} onChange={onInput('name')} onBlur={onBlur('name')} error={errors.name} placeholder="中島 花子" />
              <TextField name="email" label="メールアドレス" required type="email" inputMode="email" autoComplete="email" value={v.email} onChange={onInput('email')} onBlur={onBlur('email')} error={errors.email} placeholder="hanako@example.com" />
              <TextField name="tel" label="電話番号" type="tel" inputMode="tel" autoComplete="tel" value={v.tel} onChange={onInput('tel')} onBlur={onBlur('tel')} error={errors.tel} placeholder="090-1234-5678" />
            </div>
          </section>

          <section className="grid gap-8">
            <h3 className="mincho text-lg">依頼内容</h3>
            <ChoiceGroup name="plan" label="希望するプラン" required value={v.plan} onChange={set('plan')} options={planOptions} columns={4} error={errors.plan} />
            <ChoiceGroup name="use" label="映像の用途" required value={v.use} onChange={set('use')} options={uses.map((u) => ({ value: u, label: u }))} columns={4} error={errors.use} />
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField name="length" label="希望する完成尺" required options={lengthOptions} value={v.length} onChange={onInput('length')} onBlur={onBlur('length')} error={errors.length} />
              <SelectField name="photos" label="写真のおおよその枚数" required options={photoOptions} value={v.photos} onChange={onInput('photos')} onBlur={onBlur('photos')} error={errors.photos} />
            </div>
            <ChoiceGroup name="hasVideo" label="動画素材の有無" required value={v.hasVideo} onChange={set('hasVideo')} options={yesNo} columns={3} error={errors.hasVideo} />
            <ChoiceGroup name="shoot" label="撮影の希望（出張撮影）" required value={v.shoot} onChange={set('shoot')} options={shootOptions} columns={3} error={errors.shoot} />
            <TextField name="deadline" label="希望納期" type="date" value={v.deadline} onChange={onInput('deadline')} hint="上映日や使う日が決まっていれば入力してください" className="sm:max-w-xs" />
            <TextArea name="notes" label="制作に関する要望・備考" value={v.notes} onChange={onInput('notes')} onBlur={onBlur('notes')} error={errors.notes}
              placeholder="例）祖母の米寿のお祝いで上映したい。昔の写真が多く、スキャンも相談したい など" />
          </section>

          <div className="grid gap-5 rounded-lg bg-sand/60 p-5 sm:p-6">
            <p className="flex gap-2 text-sm leading-relaxed"><CircleAlert className="mt-0.5 size-4 shrink-0 text-sea-deep" aria-hidden />
              このフォームは<b className="font-medium">ご相談・お見積もり依頼</b>の受付です。送信しただけでは正式なご依頼（受注）にはなりません。内容を確認し、料金と納期をご提案したうえで正式なご依頼となります。</p>
            <Checkbox name="agree" checked={agree} onChange={(c) => { setAgree(c); if (c) setAgreeErr(''); }} error={agreeErr}
              label="上記を確認しました。入力内容をお見積もりの連絡に使うことに同意します。" />
          </div>

          <Honeypot onChange={setBotcheck} />
          <div className="flex justify-end">
            <button type="submit" className={btn('primary', 'w-full sm:w-auto sm:min-w-64')}>入力内容を確認する</button>
          </div>
        </form>
      )}

      {step === 1 && (
        <div className="grid gap-8">
          <ConfirmList rows={[
            { label: 'お名前', value: v.name },
            { label: 'メールアドレス', value: v.email },
            { label: '電話番号', value: v.tel },
            { label: '希望するプラン', value: labelOf(planOptions, v.plan) },
            { label: '映像の用途', value: v.use },
            { label: '希望する完成尺', value: v.length },
            { label: '写真のおおよその枚数', value: v.photos },
            { label: '動画素材の有無', value: labelOf(yesNo, v.hasVideo) },
            { label: '撮影の希望', value: labelOf(shootOptions, v.shoot) },
            { label: '希望納期', value: v.deadline },
            { label: '要望・備考', value: v.notes },
          ]} />
          {DEMO_MODE && <p className="rounded-md bg-sea-soft px-4 py-3 text-sm">デモ受付のため、送信してもメールは届かず、データも保存されません。</p>}
          {sendErr && <p role="alert" className="text-sm text-danger">{sendErr}</p>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => { setStep(0); goTop(); }} className={btn('ghost')}>← 修正する</button>
            <button type="button" onClick={send} disabled={sending} className={btn('primary', 'sm:min-w-64')}>
              {sending ? <><Loader2 className="size-4 animate-spin" />送信しています</> : 'この内容で相談を送る'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <Done id={doneId} title="ご相談を受け付けました" kind="相談受付番号"
          lines={[
            `${v.name} 様、ご相談ありがとうございます。`,
            '内容を確認のうえ、お見積もり（料金・納期）をメールでご連絡します。',
            'この時点では、まだ正式なご依頼（受注）は確定していません。',
          ]}
          resetLabel="続けて別の相談をする"
          onReset={() => { setV(empty); setAgree(false); setErrors({}); setStep(0); goTop(); }} />
      )}
    </div>
  );
}
