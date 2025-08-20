import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Switch, Pressable } from 'react-native';
import { Wand as Wand2, Sparkles, FileText, Users, Database, XCircle, StopCircle } from 'lucide-react-native';
import { useSurvey } from '@/contexts/SurveyContext';
import { useOfficialQuestionBank } from '@/hooks/useOfficialQuestionBank';
import { useMospiSurveys } from '@/hooks/useMospiSurveys';
import { AIPreviewModal } from './AIPreviewModal';
import { getGeminiKeyInfo } from '@/utils/envDebug';
import { useAdaptiveEvents } from '@/contexts/AdaptiveEventsContext';
import { useParadata } from '@/contexts/ParadataContext';
import { useResponses } from '@/contexts/ResponseContext';

export function AIPromptInput() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftQuestions, setDraftQuestions] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [tokens, setTokens] = useState<number>(0);
  const [streamText, setStreamText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingEnabled, setStreamingEnabled] = useState(false); // user toggle
  const [rawVisible, setRawVisible] = useState(false);
  const [officialMode, setOfficialMode] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ts: number } | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { addQuestions } = useSurvey();
  const { data: mospiMeta = [] } = useMospiSurveys();
  const { summary: paradata } = useParadata();
  const { ordered: answered, answeredTitles } = useResponses() as any;
  const { latestSuggestion, consumeSuggestion } = useAdaptiveEvents();

  const templates = [
    {
      title: 'Household Income Survey',
      description: 'Income, employment, and financial status',
      prompt: 'Create a household income survey for urban families in India, including questions about monthly income, employment status, family size, and expenses.',
      icon: Users,
    },
    {
      title: 'Agricultural Census',
      description: 'Land use, crops, and farming practices',
      prompt: 'Generate an agricultural survey for farmers covering land ownership, crop types, irrigation methods, and farming challenges.',
      icon: FileText,
    },
  ];

  // Infer rough domain from user prompt to bias question typing
  function inferDomain(text: string): string | null {
    const lower = text.toLowerCase();
    if (/employment|job|labour|labor/.test(lower)) return 'employment';
    if (/agri|crop|farm|agricultur/.test(lower)) return 'agriculture';
    if (/price|cpi|inflation|consum(er)? price/.test(lower)) return 'prices';
    if (/health|nutrition|disease|hospital/.test(lower)) return 'health';
    if (/transport|commute|travel|mobility/.test(lower)) return 'transport';
    return null;
  }

  // Map domain to default question type heuristics
  function mapQuestion(q: any, domain: string | null) {
    const baseType = (['text','radio','checkbox','multiple_choice'].includes(q.type) ? q.type : 'text');
    if (baseType !== 'text') return baseType;
    if (!domain) return baseType;
    switch (domain) {
      case 'employment': return 'radio';
      case 'agriculture': return 'multiple_choice';
      case 'prices': return 'text';
      case 'health': return 'multiple_choice';
      case 'transport': return 'radio';
      default: return baseType;
    }
  }

  function extractJsonArray(text: string): any[] {
    // Try fenced code
    const fence = text.match(/```json[\r\n]+([\s\S]*?)```/i);
    if (fence) {
      try { return JSON.parse(fence[1]); } catch {}
    }
    // Find first '[' and matching ']' heuristically
    const first = text.indexOf('[');
    const last = text.lastIndexOf(']');
    if (first !== -1 && last !== -1 && last > first) {
      const slice = text.slice(first, last + 1);
      try { return JSON.parse(slice); } catch {}
    }
    // Try to gather objects separated by commas
    return [];
  }

  const officialDomains = ['employment','consumption','health','education','transport','prices','enterprise'];
  const { data: bank } = useOfficialQuestionBank(selectedDomain ? { domain: selectedDomain } : undefined);

  const handleGenerate = async () => {
    const userPrompt = prompt.trim();
    if (officialMode) {
      // Pull official questions filtered; fallback to all if none match
      const sourceList = bank.length ? bank : [];
      if (!sourceList.length) {
        Alert.alert('No Official Questions', 'No official bank questions available for this filter.');
        return;
      }
      const mapped = sourceList.slice(0, 20).map(q => ({
        type: q.type,
        title: q.title,
        options: q.options,
        required: q.required,
        source: 'Official',
        domain: q.domain
      }));
      setDraftQuestions(mapped as any);
      setShowPreview(true);
      setStatus(`Loaded ${mapped.length} official questions${selectedDomain ? ' for domain '+selectedDomain : ''}`);
      return;
    }
    if (!userPrompt) { Alert.alert('Error','Please enter a prompt.'); return; }
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      Alert.alert('Missing API Key', 'Gemini API key not configured.');
      return;
    }
  console.log('[AI] generate clicked');
  setIsGenerating(true);
    setStreaming(streamingEnabled);
    setStatus(streamingEnabled ? 'Streaming from Gemini...' : 'Generating...');
    setDraftQuestions([]);
    setTokens(0);
    setStreamText('');
    setLastError(null);
    try {
      // Build contextual system prompt using MoSPI dataset titles
  const contextList = mospiMeta.slice(0, 12).map(m => `- ${m.title}: ${m.category}`).join('\n');
  // Adaptive tail: last 5 answered Q&A + speed flags
  const recentQA = answered.slice(-5).map((r: any) => `Q: ${r.title}\nA: ${Array.isArray(r.answer)? r.answer.join(', '): String(r.answer)}`).join('\n');
  const qualityNote = paradata.quality ? `Answered fast: ${paradata.quality.fast}, Flagged: ${paradata.quality.flagged}` : '';
  const adaptive = recentQA ? `Recent Answers (use to tailor follow-ups, avoid duplicates):\n${recentQA}\n${qualityNote}` : 'No prior answers yet.';
  const system = `You are an expert statistical survey designer for Indian official statistics. Use MoSPI context AND respondent context to craft unbiased, concise NEXT questions (avoid repeating).\nContext Datasets:\n${contextList}\nRespondent Context:\n${adaptive}\nGuidelines: Ask only follow-up or next logical module questions; avoid leading wording, keep options mutually exclusive & exhaustive, include recall periods where needed. Output ONLY JSON array.`;
      const requestBody = {
        contents: [
          { role: 'user', parts: [{ text: system + '\nUser requirement: ' + userPrompt + '\nReturn JSON array: [{"title":"string","type":"radio|text|checkbox|multiple_choice","options":["opt"...],"required":true/false}] and NOTHING else.' }] }
        ],
  generationConfig: { temperature: 0.55, maxOutputTokens: 1200 }
      };
      abortRef.current = new AbortController();
      let fullText = '';
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        if (streamingEnabled) {
          console.log('[AI] streaming timeout -> will use non-stream');
          setStatus('Timeout – switching to fallback...');
          setStreaming(false);
        }
      }, 8000);
      if (streamingEnabled && !timedOut) {
        // Attempt streaming
        try {
          const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=' + apiKey, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody), signal: abortRef.current.signal
          });
          if (!res.ok) throw new Error('Stream HTTP ' + res.status);
          const reader: any = (res as any).body?.getReader ? (res as any).body.getReader() : null;
            if (reader) {
              const decoder = new TextDecoder();
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;
                const lines = chunk.split(/\n/).map(l => l.trim()).filter(Boolean);
                for (const line of lines) {
                  if (line.startsWith('data:')) {
                    const jsonStr = line.replace(/^data:\s*/, '');
                    if (jsonStr === '[DONE]') continue;
                    try {
                      const obj = JSON.parse(jsonStr);
                      const piece = obj?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
                      if (piece) {
                        setStreamText(prev => prev + piece);
                        setTokens(t => t + piece.split(/\s+/).filter(Boolean).length);
                      }
                    } catch {}
                  }
                }
              }
            } else {
              // reader unsupported -> fallback
              throw new Error('No stream reader');
            }
        } catch (e:any) {
          console.log('[AI] Streaming failed, fallback:', e.message);
          setStreaming(false);
        }
      }
      if (!fullText) {
        // Non-stream request
        console.log('[AI] performing non-stream request');
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody), signal: abortRef.current.signal
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        fullText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        setStreamText(fullText);
        setTokens(fullText.split(/\s+/).filter(Boolean).length);
      }
      clearTimeout(timeout);

      // Extract JSON from accumulated fullText
  const parsed = extractJsonArray(fullText);
      if (!Array.isArray(parsed) || !parsed.length) {
        setDraftQuestions([{ type: 'text', title: userPrompt + ' (AI draft)', required: false, source: 'AI', note: fullText.slice(0,4000) }]);
        setShowPreview(true);
        setStatus('Unstructured output – added as note');
      } else {
        const domain = inferDomain(userPrompt);
  const cleanedRaw = parsed.slice(0, 60).map(q => ({
          type: mapQuestion(q, domain),
          title: String(q.title || 'Untitled Question'),
          required: Boolean(q.required),
          options: q.options && Array.isArray(q.options) ? q.options.slice(0, 12).map(String) : undefined,
          source: 'AI'
        }));
  // Deduplicate vs answered titles
  const cleaned = cleanedRaw.filter(c => !answeredTitles.has(c.title.trim().toLowerCase()));
        setDraftQuestions(cleaned as any);
        setShowPreview(true);
  setStatus(`Generated ${cleaned.length} new draft questions (removed ${cleanedRaw.length - cleaned.length} duplicates)`);
      }
      setPrompt('');
    } catch (e: any) {
      console.log('[AI] generation error', e);
      setLastError(e.message || 'Unknown error');
      // Mock fallback so user still sees something
      const mock = Array.from({ length: 5 }).map((_, i) => ({
        type: i % 2 ? 'radio' : 'text',
        title: `Sample Question ${i + 1} about ${prompt.split(' ')[0] || 'topic'}`,
        required: false,
        options: i % 2 ? ['Yes','No'] : undefined,
        source: 'Mock'
      }));
      setDraftQuestions(mock);
      setShowPreview(true);
      setStatus('Offline mock generated');
    } finally {
      setIsGenerating(false);
      setStreaming(false);
      abortRef.current = null;
      // keep status visible unless success
      if (!draftQuestions.length) setStatus('');
    }
  };

  const cancelGeneration = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      setStatus('Cancelled');
      setIsGenerating(false);
    }
  };

  const commitSelected = (selected: any[]) => {
    const result = addQuestions(selected as any);
  setToast({ msg: `Added ${result.added} • Skipped ${result.duplicates}`, ts: Date.now() });
  };

  const useTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  return (
    <View style={styles.container}>
      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast.msg}</Text>
        </View>
      )}
      {latestSuggestion && (
        <TouchableOpacity style={styles.suggestionBanner} onPress={() => {
          const text = consumeSuggestion();
          if (text) setPrompt(text);
        }}>
          <Text style={styles.suggestionText} numberOfLines={2}>Tap to use follow-up suggestion</Text>
        </TouchableOpacity>
      )}
      {/* Env diagnostics */}
      {__DEV__ && (
        <Text style={styles.debugText}>[ENV] Gemini key present: {String(getGeminiKeyInfo().present)} len:{getGeminiKeyInfo().length} prefix:{getGeminiKeyInfo().prefix}</Text>
      )}
      <View style={styles.header}>
  <Sparkles size={24} color="#7c3aed" />
        <Text style={styles.title}>AI Survey Generator</Text>
  <Database size={16} color="#7c3aed" style={{ marginLeft: 8 }} />
      </View>
      
      <Text style={styles.description}>
  Describe your survey requirements. Gemini will generate structured questions aligned with official statistical design practices using MoSPI context.
      </Text>

      <View style={styles.rowBetween}> 
        <Text style={styles.inputLabel}>{officialMode ? 'Official Question Bank' : 'Survey Description'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Official</Text>
            <Switch value={officialMode} onValueChange={v => setOfficialMode(v)} />
          </View>
          {!officialMode && (
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Stream</Text>
              <Switch value={streamingEnabled} onValueChange={setStreamingEnabled} />
            </View>
          )}
        </View>
      </View>
      {officialMode && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <TouchableOpacity onPress={()=>setSelectedDomain(null)} style={[styles.domainChip, !selectedDomain && styles.domainChipActive]}>
            <Text style={[styles.domainChipText, !selectedDomain && styles.domainChipTextActive]}>All</Text>
          </TouchableOpacity>
          {officialDomains.map(d => (
            <TouchableOpacity key={d} onPress={()=>setSelectedDomain(d)} style={[styles.domainChip, selectedDomain===d && styles.domainChipActive]}>
              <Text style={[styles.domainChipText, selectedDomain===d && styles.domainChipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.promptInput}
          placeholder="E.g., Create a survey about urban transportation habits including public transport usage, vehicle ownership, and daily commute patterns..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholderTextColor="#9ca3af"
          editable={!officialMode}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generatingButton]}
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? <ActivityIndicator color="#fff" /> : <Wand2 size={20} color="#ffffff" />}
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Loading...' : (officialMode ? 'Load Official Questions' : 'Generate Survey')}
          </Text>
        </TouchableOpacity>
        {isGenerating && (
          <TouchableOpacity style={[styles.generateButton, { backgroundColor: '#dc2626' }]} onPress={cancelGeneration}>
            <StopCircle size={20} color="#fff" />
            <Text style={styles.generateButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {!!status && <Text style={styles.statusText}>{status}</Text>}
      {(streaming || streamText) && (
        <View style={styles.streamBox}>
          <View style={styles.rowBetween}>
            <Text style={styles.streamHeader}>Output (≈{tokens} tokens)</Text>
            <Pressable onPress={() => setRawVisible(v => !v)}>
              <Text style={styles.rawToggle}>{rawVisible ? 'Hide' : 'Show'} Raw</Text>
            </Pressable>
          </View>
          {rawVisible && (
            <ScrollView style={{ maxHeight: 140 }}>
              <Text style={styles.streamText}>{streamText.slice(-4000)}</Text>
            </ScrollView>
          )}
        </View>
      )}
      {lastError && <Text style={styles.errorText}>Error: {lastError}</Text>}
      {__DEV__ && process.env.EXPO_PUBLIC_GEMINI_API_KEY && (
        <Text style={styles.debugText}>[DEV] Gemini key length {process.env.EXPO_PUBLIC_GEMINI_API_KEY.length}</Text>
      )}

      <View style={styles.templates}>
        <Text style={styles.templatesTitle}>Quick Templates</Text>
        {templates.map((template, index) => (
          <TouchableOpacity
            key={index}
            style={styles.template}
            onPress={() => useTemplate(template.prompt)}
          >
            <View style={styles.templateIcon}>
              <template.icon size={20} color="#1e40af" />
            </View>
            <View style={styles.templateContent}>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <AIPreviewModal
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        draft={draftQuestions}
        onCommit={commitSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  toggleLabel: { fontSize: 12, color: '#4b5563', marginRight: 4 },
  promptInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
    height: 120,
    textAlignVertical: 'top',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  generatingButton: {
    backgroundColor: '#9ca3af',
  },
  statusText: {
    marginTop: -16,
    marginBottom: 24,
    fontSize: 12,
    color: '#4b5563'
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  templates: { marginTop: 4 },
  templatesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  template: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    gap: 12,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateContent: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  streamBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  streamHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  streamText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#1f2937',
  },
  rawToggle: { fontSize: 12, color: '#7c3aed', fontWeight: '600' },
  errorText: { fontSize: 12, color: '#dc2626', marginBottom: 12 },
  debugText: { fontSize: 10, color: '#6b7280', marginBottom: 8 },
  suggestionBanner: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  suggestionText: { fontSize: 12, color: '#1e40af', fontWeight: '600' },
  toast: { position: 'absolute', top: -10, right: 0, backgroundColor: '#111827', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937' },
  toastText: { color: '#f1f5f9', fontSize: 12, fontWeight: '600' },
  domainChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  domainChipActive: {
    backgroundColor: '#4338ca',
    borderColor: '#4338ca',
  },
  domainChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151'
  },
  domainChipTextActive: { color: '#ffffff' },
});