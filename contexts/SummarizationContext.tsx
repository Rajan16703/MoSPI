import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useResponses } from './ResponseContext';

interface Summary { id: string; text: string; createdAt: number; sampleSize: number; }
interface SummarizationContextValue {
  summaries: Summary[];
  summarize: () => Promise<Summary>;
  clear: () => void;
  loading: boolean;
}

const SummarizationContext = createContext<SummarizationContextValue | undefined>(undefined);

export function SummarizationProvider({ children }: { children: ReactNode }) {
  const { ordered } = useResponses();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);

  const summarize = useCallback(async () => {
    setLoading(true);
    try {
      // Placeholder summarization – in real impl call AI API with open responses only
      const openAnswers = ordered.filter(r => typeof r.answer === 'string' && r.answer.length > 0).slice(-25);
      const combined = openAnswers.map(r => r.answer).join('\n');
      const text = openAnswers.length ? `Top themes: ${openAnswers.slice(0,3).map(a=>a.answer?.split?.(' ')?.slice(0,3).join(' ')).join('; ')}... (auto summary placeholder)` : 'No open-ended responses yet.';
      const summary: Summary = { id: Date.now().toString(), text, createdAt: Date.now(), sampleSize: openAnswers.length };
      setSummaries(prev => [summary, ...prev]);
      return summary;
    } finally {
      setLoading(false);
    }
  }, [ordered]);

  const clear = useCallback(()=> setSummaries([]), []);

  return <SummarizationContext.Provider value={{ summaries, summarize, clear, loading }}>{children}</SummarizationContext.Provider>;
}

export function useSummarization() {
  const ctx = useContext(SummarizationContext);
  if(!ctx) throw new Error('useSummarization must be inside SummarizationProvider');
  return ctx;
}
