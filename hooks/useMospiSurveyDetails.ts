import { useEffect, useState } from 'react';
import details from '@/assets/data/mospiSurveyDetails.json';

export interface MospiSurveyDetail {
  id: string;
  title: string;
  domain: string;
  periodicity: string;
  description: string;
  keyIndicators: string[];
  latestRelease: string;
  source: string;
}

export function useMospiSurveyDetails() {
  const [data, setData] = useState<MospiSurveyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try { setData(details as MospiSurveyDetail[]); } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, []);
  return { data, loading, error };
}
