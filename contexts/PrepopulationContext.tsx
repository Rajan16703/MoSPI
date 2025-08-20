import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface PrepopValue { value: any; locked: boolean; source?: string; }

interface PrepopulationContextValue {
  values: Record<string, PrepopValue>;
  setPrepop: (questionId: string, value: any, locked?: boolean, source?: string) => void;
  bulkSet: (entries: { id: string; value: any; locked?: boolean; source?: string }[]) => void;
  clear: () => void;
}

const PrepopulationContext = createContext<PrepopulationContextValue | undefined>(undefined);

export function PrepopulationProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<Record<string, PrepopValue>>({});
  const setPrepop = useCallback((questionId: string, value: any, locked = true, source?: string) => {
    setValues(prev => ({ ...prev, [questionId]: { value, locked, source } }));
  }, []);
  const bulkSet = useCallback((entries: { id: string; value: any; locked?: boolean; source?: string }[]) => {
    setValues(prev => {
      const next = { ...prev };
      entries.forEach(e => { next[e.id] = { value: e.value, locked: e.locked ?? true, source: e.source }; });
      return next;
    });
  }, []);
  const clear = useCallback(() => setValues({}), []);
  return (
    <PrepopulationContext.Provider value={{ values, setPrepop, bulkSet, clear }}>
      {children}
    </PrepopulationContext.Provider>
  );
}

export function usePrepopulation() {
  const ctx = useContext(PrepopulationContext);
  if (!ctx) throw new Error('usePrepopulation must be used within PrepopulationProvider');
  return ctx;
}
