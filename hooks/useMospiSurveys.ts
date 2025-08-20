import { useEffect, useState } from 'react';
import surveys from '@/assets/data/mospiSurveys.json';

export interface MospiSurveyMeta {
  id: string;
  title: string;
  category: string;
  description: string;
  officialUrl: string;
  lastKnownCycle?: string;
  frequency?: string;
  lastUpdated: string;
}

export function useMospiSurveys() {
  const [data, setData] = useState<MospiSurveyMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setData(surveys as MospiSurveyMeta[]);
    } catch (e: any) {
      setError(e.message || 'Failed to load survey metadata');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}
