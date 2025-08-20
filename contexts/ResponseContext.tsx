import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface RecordedResponse {
  questionId: string;
  title: string;
  answer: any;
  answeredAt: number;
}

interface ResponseContextValue {
  responses: Record<string, RecordedResponse>;
  recordResponse: (questionId: string, title: string, answer: any) => void;
  resetResponses: () => void;
  ordered: RecordedResponse[]; // chronological
  answeredTitles: Set<string>;
}

const ResponseContext = createContext<ResponseContextValue | undefined>(undefined);

export function ResponseProvider({ children }: { children: ReactNode }) {
  const [responses, setResponses] = useState<Record<string, RecordedResponse>>({});

  const recordResponse = useCallback((questionId: string, title: string, answer: any) => {
    setResponses(prev => ({ ...prev, [questionId]: { questionId, title, answer, answeredAt: Date.now() } }));
  }, []);

  const resetResponses = useCallback(() => setResponses({}), []);

  const ordered = Object.values(responses).sort((a,b)=>a.answeredAt - b.answeredAt);
  const answeredTitles = new Set(ordered.map(r => r.title.trim().toLowerCase()));

  return (
  <ResponseContext.Provider value={{ responses, recordResponse, resetResponses, ordered, answeredTitles }}>
      {children}
    </ResponseContext.Provider>
  );
}

export function useResponses() {
  const ctx = useContext(ResponseContext);
  if (!ctx) throw new Error('useResponses must be used within ResponseProvider');
  return ctx;
}
