import { useEffect, useState } from 'react';

export interface MospiReportLink {
  title: string;
  url: string;
}

interface UseMospiReportsResult {
  reports: MospiReportLink[];
  loading: boolean;
  error: string | null;
  fetchedAt: Date | null;
}

/**
 * Attempts to fetch the MoSPI download reports page and extract PDF links.
 * Falls back gracefully on error (no backend yet). Intended for lightweight live analytics.
 */
export function useMospiReports(): UseMospiReportsResult {
  const [reports, setReports] = useState<MospiReportLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true); setError(null);
      try {
        const res = await fetch('https://mospi.gov.in/download-reports', { method: 'GET' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const html = await res.text();
        if (cancelled) return;
        // Basic regex to capture PDF links. Not perfect but sufficient here.
        const regex = /<a[^>]+href="(.*?)"[^>]*>([\s\S]*?)<\/a>/gi;
        const found: MospiReportLink[] = [];
        const seen = new Set<string>();
        let match: RegExpExecArray | null;
        while ((match = regex.exec(html)) !== null) {
          const href = match[1];
            if (!/\.pdf($|\?)/i.test(href)) continue;
            let title = match[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
            if (!title) title = 'Report';
            let url = href.startsWith('http') ? href : ('https://mospi.gov.in' + (href.startsWith('/') ? href : '/' + href));
            if (seen.has(url)) continue;
            seen.add(url);
            found.push({ title, url });
            if (found.length >= 200) break; // cap
        }
        setReports(found);
        setFetchedAt(new Date());
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to fetch reports');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  return { reports, loading, error, fetchedAt };
}
