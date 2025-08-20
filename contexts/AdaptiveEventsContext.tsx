import React, { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';

interface AdaptiveEventsContextValue {
  latestSuggestion: string | null;
  requestFollowUp: (prompt: string) => void;
  clearSuggestion: () => void;
  consumeSuggestion: () => string | null; // returns and clears
}

const AdaptiveEventsContext = createContext<AdaptiveEventsContextValue | undefined>(undefined);

export function AdaptiveEventsProvider({ children }: { children: ReactNode }) {
  const [latestSuggestion, setLatestSuggestion] = useState<string | null>(null);
  const requestFollowUp = useCallback((prompt: string) => { setLatestSuggestion(prompt); }, []);
  const clearSuggestion = useCallback(() => setLatestSuggestion(null), []);
  const consumeSuggestion = useCallback(() => { const v = latestSuggestion; setLatestSuggestion(null); return v; }, [latestSuggestion]);
  return (
    <AdaptiveEventsContext.Provider value={{ latestSuggestion, requestFollowUp, clearSuggestion, consumeSuggestion }}>
      {children}
    </AdaptiveEventsContext.Provider>
  );
}

export function useAdaptiveEvents() {
  const ctx = useContext(AdaptiveEventsContext);
  if (!ctx) throw new Error('useAdaptiveEvents must be used inside AdaptiveEventsProvider');
  return ctx;
}
