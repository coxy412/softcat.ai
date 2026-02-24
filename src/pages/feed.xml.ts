import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const news = (await getCollection('news-and-updates')).filter((e) => !e.data.draft);
  const thoughts = (await getCollection('thoughts')).filter((e) => !e.data.draft);

  const items = [
    ...news.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: e.data.date,
      link: `/news-and-updates/${e.id}/`,
    })),
    ...thoughts.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: e.data.date,
      link: `/thoughts/${e.id}/`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'SOFT CAT .ai',
    description: 'Smart Outputs From Trained Conversational AI Technology. An AI site by Valori.',
    site: context.site!.toString(),
    items,
  });
}
