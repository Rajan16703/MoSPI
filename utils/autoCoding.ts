export interface CodedResponse { code: string; label: string; confidence: number; system: 'rule' | 'ai'; }

const RULES: { pattern: RegExp; code: string; label: string }[] = [
  { pattern: /agri|farm|crop/i, code: 'SEC_AGR', label: 'Agriculture' },
  { pattern: /teach|school|educ/i, code: 'SEC_EDU', label: 'Education' },
  { pattern: /health|clinic|hospital/i, code: 'SEC_HEALTH', label: 'Health' },
  { pattern: /transpo|bus|train|metro|vehicle/i, code: 'SEC_TRANS', label: 'Transport' },
];

export function classifyResponse(text: string): CodedResponse | null {
  if (!text || !text.trim()) return null;
  for (const r of RULES) { if (r.pattern.test(text)) return { code: r.code, label: r.label, confidence: 0.6, system: 'rule' }; }
  return { code: 'SEC_OTHER', label: 'Other / Uncoded', confidence: 0.2, system: 'rule' };
}

export async function classifyResponseAI(text: string, apiKey?: string): Promise<CodedResponse | null> {
  if (!apiKey) return classifyResponse(text);
  try {
    const prompt = `Classify the occupation or sector described: "${text}" into a single high-level Indian economic sector code (Agriculture, Education, Health, Transport, Other). Return JSON {code,label}.`;
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0 } })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = textOut.match(/\{[\s\S]*\}/);
    if (match) { const obj = JSON.parse(match[0]); return { code: obj.code || 'SEC_OTHER', label: obj.label || 'Other', confidence: 0.8, system: 'ai' }; }
    return classifyResponse(text);
  } catch { return classifyResponse(text); }
}
