import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type QuestionType = 'text' | 'multiple_choice' | 'checkbox' | 'radio';

export interface SurveyQuestionModel {
  id: string;
  type: QuestionType;
  title: string;
  options?: string[];
  required: boolean;
  source?: string; // 'AI' | 'Template' | 'MoSPI'
  domain?: string; // module/domain tag for progression
  hiTitle?: string; // cached Hindi translation
}

interface AddResult { added: number; duplicates: number; total: number; idsAdded?: string[]; }

interface SurveyContextValue {
  questions: SurveyQuestionModel[];
  addQuestions: (qs: Omit<SurveyQuestionModel, 'id'>[] | SurveyQuestionModel[]) => AddResult;
  addQuestion: (q: Omit<SurveyQuestionModel, 'id'>) => AddResult;
  removeQuestion: (id: string) => void;
  reset: () => void;
  updateQuestions: (mutator: (q: SurveyQuestionModel) => SurveyQuestionModel) => void;
  domainCounts: Record<string, number>;
  incrementDomain: (domain?: string) => void;
  updateQuestion: (id: string, patch: Partial<SurveyQuestionModel>) => void;
  reorderQuestions: (from: number, to: number) => void;
  recentlyAdded: Set<string>;
  clearRecentlyAdded: () => void;
}

const SurveyContext = createContext<SurveyContextValue | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<SurveyQuestionModel[]>([]);
  const [domainCounts, setDomainCounts] = useState<Record<string, number>>({});
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());

  const addQuestion = useCallback((q: Omit<SurveyQuestionModel, 'id'>): AddResult => {
    let duplicates = 0;
    setQuestions(prev => {
      const exists = prev.some(p => p.title.trim().toLowerCase() === q.title.trim().toLowerCase());
      if (exists) { duplicates = 1; return prev; }
      return [...prev, { ...q, id: Date.now().toString() + Math.random().toString(36).slice(2, 7) }];
    });
    return { added: duplicates ? 0 : 1, duplicates, total: 1 };
  }, []);

  const addQuestions = useCallback((qs: Omit<SurveyQuestionModel, 'id'>[] | SurveyQuestionModel[]): AddResult => {
    let added = 0; let duplicates = 0; const idsAdded: string[] = [];
    setQuestions(prev => {
      const mapped = qs.map((q: any) => q.id ? q : { ...q, id: Date.now().toString() + Math.random().toString(36).slice(2, 7) });
      const next = [...prev];
      mapped.forEach(q => {
        if (!q.title || !String(q.title).trim()) return; // skip empty
        const exists = next.some(p => p.title.trim().toLowerCase() === q.title.trim().toLowerCase());
        if (exists) { duplicates++; return; }
        next.push(q); idsAdded.push(q.id); added++;
      });
      return next;
    });
    if (idsAdded.length) setRecentlyAdded(new Set(idsAdded));
    return { added, duplicates, total: qs.length, idsAdded };
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }, []);

  const reset = useCallback(() => setQuestions([]), []);

  const updateQuestions = useCallback((mutator: (q: SurveyQuestionModel) => SurveyQuestionModel) => {
    setQuestions(prev => prev.map(mutator));
  }, []);

  const updateQuestion = useCallback((id: string, patch: Partial<SurveyQuestionModel>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
  }, []);

  const reorderQuestions = useCallback((from: number, to: number) => {
    setQuestions(prev => {
      const next = [...prev];
      const item = next.splice(from, 1)[0];
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  const clearRecentlyAdded = useCallback(() => setRecentlyAdded(new Set()), []);

  const incrementDomain = useCallback((domain?: string) => {
    if(!domain) return;
    setDomainCounts(prev => ({ ...prev, [domain]: (prev[domain] ?? 0) + 1 }));
  }, []);

  return (
  <SurveyContext.Provider value={{ questions, addQuestions, addQuestion, removeQuestion, reset, updateQuestions, domainCounts, incrementDomain, updateQuestion, reorderQuestions, recentlyAdded, clearRecentlyAdded }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error('useSurvey must be used within SurveyProvider');
  return ctx;
}
