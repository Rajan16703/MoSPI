// Rough scraper to augment mospiSurveys.json with additional links (best-effort).
// NOTE: For production use, respect robots.txt and implement proper rate limiting & caching.

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const BASE = 'https://mospi.gov.in';
const TARGET_URLS = [
  '/',
  '/economic-census-3',
  '/iip',
  '/national_factsheet/',
  '/current-surveys-0'
];

async function fetchPage(url) {
  const res = await fetch(BASE + url);
  if (!res.ok) throw new Error('Failed fetch ' + url + ' status ' + res.status);
  return await res.text();
}

async function run() {
  const storePath = path.join(__dirname, '..', 'assets', 'data', 'mospiSurveys.json');
  let existing = [];
  try { existing = JSON.parse(fs.readFileSync(storePath, 'utf-8')); } catch {}
  const byId = new Map(existing.map(e => [e.id, e]));

  for (const rel of TARGET_URLS) {
    try {
      const html = await fetchPage(rel);
      const $ = cheerio.load(html);
      // Extract h1/h2/h3 titles as potential survey references
      $('h1, h2, h3').each((_, el) => {
        const title = $(el).text().trim();
        if (!title) return;
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        if (!id) return;
        if (!byId.has(id)) {
          byId.set(id, {
            id,
            title,
            category: 'MoSPI Content',
            description: 'Imported heading from ' + rel,
            officialUrl: BASE + rel,
            lastUpdated: new Date().toISOString().split('T')[0]
          });
        }
      });
    } catch (e) {
      console.error('Error scraping', rel, e.message);
    }
  }

  const merged = Array.from(byId.values());
  fs.writeFileSync(storePath, JSON.stringify(merged, null, 2));
  console.log('Updated mospiSurveys.json entries:', merged.length);
}

run().catch(e => { console.error(e); process.exit(1); });
