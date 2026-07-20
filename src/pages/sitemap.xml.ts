import { getCollection } from 'astro:content';
import { SITE_URL } from '../consts';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  const articles = (
    await getCollection('articles', ({ data }) => !data.draft)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const staticPaths = [
    '/',
    '/about/',
    '/contact/',
    '/author/kevin/',
    '/terms/',
    '/privacy/',
    '/rss.xml',
  ];

  const urls: { loc: string; lastmod?: string }[] = [
    ...staticPaths.map((path) => ({
      loc: new URL(path, SITE_URL).href,
    })),
    ...articles.map((a) => ({
      loc: new URL(`/news/${a.id}/`, SITE_URL).href,
      lastmod: (a.data.updatedDate ?? a.data.pubDate).toISOString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>${
      u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''
    }
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
