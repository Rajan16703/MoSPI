import { useEffect, useState } from 'react';
import bank from '@/assets/data/mospiQuestionBank.json';
import { SurveyQuestionModel } from '@/contexts/SurveyContext';

export interface OfficialQuestion extends SurveyQuestionModel {
  surveyId?: string;
  domain?: string;
  reference?: string;
  officialSourceUrl?: string;
}

export function useOfficialQuestionBank(filter?: { domain?: string; surveyId?: string }) {
  const [data, setData] = useState<OfficialQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      let list = (bank as any as OfficialQuestion[]);
      if (filter?.domain) list = list.filter(q => q.domain === filter.domain);
      if (filter?.surveyId) list = list.filter(q => q.surveyId === filter.surveyId);
      setData(list);
    } catch (e:any) {
      setError(e.message || 'Failed to load question bank');
    } finally {
      setLoading(false);
    }
  }, [filter?.domain, filter?.surveyId]);

  return { data, loading, error };
}
