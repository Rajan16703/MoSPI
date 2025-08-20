import React, { createContext, useContext, useRef, useState, ReactNode, useCallback } from 'react';
import { Platform } from 'react-native';

export interface ParadataQuestionRecord {
  questionId: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  flags?: string[];
  responsePreview?: string;
}

export interface SurveyParadataSummary {
  surveyId?: string;
  language?: string;
  devicePlatform: string;
  deviceOSVersion?: string;
  startedAt?: number;
  completedAt?: number;
  totalDurationMs?: number;
  records: ParadataQuestionRecord[];
  quality: { flagged: number; fast: number };
  consentAt?: number;
  consentHash?: string;
}

interface ParadataContextValue {
  startSurvey: (language?: string) => void;
  completeSurvey: () => void;
  startQuestion: (questionId: string) => void;
  endQuestion: (questionId: string, response: any) => void;
  summary: SurveyParadataSummary;
  reset: () => void;
  recordConsent: (payload: string) => void;
}

const ParadataContext = createContext<ParadataContextValue | undefined>(undefined);

export function ParadataProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<SurveyParadataSummary>({
    devicePlatform: Platform.OS,
    deviceOSVersion: Platform.Version ? String(Platform.Version) : undefined,
    records: [],
    quality: { flagged: 0, fast: 0 },
  });
  const recordMap = useRef<Map<string, ParadataQuestionRecord>>(new Map());

  const startSurvey = useCallback((language?: string) => {
    setSummary(prev => ({ ...prev, startedAt: Date.now(), language, records: [], quality: { flagged: 0, fast: 0 } }));
    recordMap.current.clear();
  }, []);

  const completeSurvey = useCallback(() => {
    setSummary(prev => ({ ...prev, completedAt: Date.now(), totalDurationMs: prev.startedAt ? Date.now() - prev.startedAt : undefined }));
  }, []);

  const startQuestion = useCallback((questionId: string) => {
    const existing = recordMap.current.get(questionId);
    if (existing && !existing.endTime) return;
    const rec: ParadataQuestionRecord = { questionId, startTime: Date.now() };
    recordMap.current.set(questionId, rec);
  }, []);

  const endQuestion = useCallback((questionId: string, response: any) => {
    const rec = recordMap.current.get(questionId);
    if (!rec) return;
    if (rec.endTime) return;
    rec.endTime = Date.now();
    rec.durationMs = rec.endTime - rec.startTime;
    const flags: string[] = [];
    if ((rec.durationMs || 0) < 1500) { flags.push('too_fast'); }
    if (response === '' || response == null) { flags.push('empty'); }
    rec.flags = flags.length ? flags : undefined;
    if (typeof response === 'string') rec.responsePreview = response.slice(0, 40);
    else if (Array.isArray(response)) rec.responsePreview = response.join(',').slice(0, 40);
    else if (typeof response === 'object') rec.responsePreview = JSON.stringify(response).slice(0, 40);
    recordMap.current.set(questionId, rec);
    const records = Array.from(recordMap.current.values()).sort((a,b)=>a.startTime-b.startTime);
    const fast = records.filter(r => (r.durationMs||0) < 1500).length;
    const flagged = records.filter(r => r.flags && r.flags.length).length;
    setSummary(prev => ({ ...prev, records, quality: { flagged, fast } }));
  }, []);

  const reset = useCallback(() => {
    recordMap.current.clear();
    setSummary({ devicePlatform: Platform.OS, deviceOSVersion: Platform.Version ? String(Platform.Version) : undefined, records: [], quality: { flagged: 0, fast: 0 } });
  }, []);

  const recordConsent = useCallback((payload: string) => {
    // simple hash
    let hash = 0; for (let i=0;i<payload.length;i++){ hash = (hash*31 + payload.charCodeAt(i)) >>> 0; }
    setSummary(prev => ({ ...prev, consentAt: Date.now(), consentHash: hash.toString(16) }));
  }, []);

  return (
    <ParadataContext.Provider value={{ startSurvey, completeSurvey, startQuestion, endQuestion, summary, reset, recordConsent }}>
      {children}
    </ParadataContext.Provider>
  );
}

export function useParadata() {
  const ctx = useContext(ParadataContext);
  if (!ctx) throw new Error('useParadata must be used within ParadataProvider');
  return ctx;
}
