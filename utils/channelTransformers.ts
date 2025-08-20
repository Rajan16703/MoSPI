// Utilities to transform internal survey question schema to external channel payloads

export interface InternalQuestion {
  id: string;
  type: 'text' | 'radio' | 'multiple_choice' | 'checkbox';
  title: string;
  hiTitle?: string;
  options?: string[];
  required: boolean;
  domain?: string;
}

export interface WhatsAppMessage {
  type: 'text' | 'interactive';
  body: string;
  buttons?: { id: string; title: string }[];
}

export function toWhatsAppMessages(q: InternalQuestion, locale: 'en' | 'hi' = 'en'): WhatsAppMessage[] {
  const title = locale === 'hi' && q.hiTitle ? q.hiTitle : q.title;
  if ((q.type === 'radio' || q.type === 'multiple_choice') && q.options) {
    const buttons = q.options.slice(0,3).map((o,i)=>({ id: `${q.id}_${i}`, title: o.slice(0,20) }));
    return [{ type: 'interactive', body: title, buttons }];
  }
  return [{ type: 'text', body: title }];
}

export interface IVRPromptSegment { voice: 'female' | 'male'; text: string; dtmfOptions?: { digit: string; value: string }[]; }

export function toIVRPrompt(q: InternalQuestion, locale: 'en' | 'hi' = 'en'): IVRPromptSegment {
  const title = locale === 'hi' && q.hiTitle ? q.hiTitle : q.title;
  if ((q.type === 'radio' || q.type === 'multiple_choice') && q.options) {
    const dtmfOptions = q.options.slice(0,9).map((o,i)=>({ digit: String(i+1), value: o }));
    return { voice: 'female', text: title, dtmfOptions };
  }
  return { voice: 'female', text: title };
}

export interface WebFormField { id: string; label: string; type: 'textarea' | 'select' | 'checkbox-group'; options?: string[]; required: boolean; }

export function toWebFormField(q: InternalQuestion, locale: 'en' | 'hi' = 'en'): WebFormField {
  const label = locale === 'hi' && q.hiTitle ? q.hiTitle : q.title;
  if (q.type === 'text') return { id: q.id, label, type: 'textarea', required: q.required };
  if (q.type === 'checkbox') return { id: q.id, label, type: 'checkbox-group', options: q.options || [], required: q.required };
  return { id: q.id, label, type: 'select', options: q.options || [], required: q.required };
}

export function transformForChannel(q: InternalQuestion, channel: 'whatsapp' | 'ivr' | 'web', locale: 'en' | 'hi' = 'en') {
  switch(channel){
    case 'whatsapp': return toWhatsAppMessages(q, locale);
    case 'ivr': return toIVRPrompt(q, locale);
    case 'web': return toWebFormField(q, locale);
  }
}
