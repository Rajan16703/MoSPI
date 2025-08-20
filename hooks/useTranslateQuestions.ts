import { useCallback, useState } from 'react';
import { useSurvey } from '@/contexts/SurveyContext';

// Simple mock translator: placeholder until real API call integrated.
function mockTranslateToHindi(text: string): string {
  if (/\p{Script=Devanagari}/u.test(text)) return text; // already contains Hindi
  return 'हिन्दी: ' + text;
}

export function useTranslateQuestions() {
  const { updateQuestions } = useSurvey();
  const [translating, setTranslating] = useState(false);
  const [lastBatch, setLastBatch] = useState<number>(0);

  const translateAll = useCallback(async () => {
    setTranslating(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      updateQuestions(q => q.hiTitle ? q : { ...q, hiTitle: mockTranslateToHindi(q.title) });
      setLastBatch(Date.now());
    } finally {
      setTranslating(false);
    }
  }, [updateQuestions]);

  return { translateAll, translating, lastBatch };
}
