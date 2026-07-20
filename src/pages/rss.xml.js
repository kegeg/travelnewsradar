import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_NAME } from '../consts';

export async function GET(context) {
  const articles = (
    await getCollection('articles', ({ data }) => !data.draft)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: `<language>en-us</language><atom:link href="${new URL('/rss.xml', context.site)}" rel="self" type="application/rss+xml"/>`,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: `/news/${article.id}/`,
      ...(article.data.image
        ? {
            customData: `<enclosure url="${new URL(article.data.image, context.site).href}" type="image/jpeg" />`,
          }
        : {}),
    })),
  });
}
