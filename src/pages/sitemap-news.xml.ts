import { getCollection } from 'astro:content';
import { SITE_NAME, SITE_URL } from '../consts';

const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Google News sitemap: articles published in the last 48 hours only. */
export async function GET() {
  const cutoff = Date.now() - NEWS_WINDOW_MS;
  const articles = (
    await getCollection('articles', ({ data }) => !data.draft)
  )
    .filter((a) => a.data.pubDate.valueOf() >= cutoff)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (a) => `  <url>
    <loc>${escapeXml(new URL(`/news/${a.id}/`, SITE_URL).href)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.data.pubDate.toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.data.title)}</news:title>
    </news:news>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900',
    },
  });
}
