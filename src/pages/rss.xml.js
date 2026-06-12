import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isPublished } from '../content/visibility';

// Feed del blog (entradas en español, ambas verticales).
export async function GET(context) {
  const pensamiento = await getCollection('pensamiento', e => e.data.lang === 'es' && isPublished(e));
  const datos = await getCollection('ciencia-de-datos', e => e.data.lang === 'es' && isPublished(e));

  const items = [
    ...pensamiento.map(e => ({ entry: e, base: '/pensamiento' })),
    ...datos.map(e => ({ entry: e, base: '/ciencia-de-datos' })),
  ].sort((a, b) => b.entry.data.date.localeCompare(a.entry.data.date));

  return rss({
    title: 'Manuel Miller — Blog',
    description: 'Politólogo y Data Scientist. Pensamiento, ciencia de datos y el podcast La Máquina de Ser Feliz.',
    site: context.site,
    items: items.map(({ entry, base }) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: new Date(`${entry.data.date}T00:00:00`),
      link: `${base}/${entry.data.postId}`,
      categories: entry.data.tags,
    })),
    customData: '<language>es</language>',
  });
}
