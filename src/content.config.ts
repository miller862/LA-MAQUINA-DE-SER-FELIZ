import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title:       z.string(),
  date:        z.string(),
  description: z.string(),
  tags:        z.array(z.string()),
  cover:       z.string().optional(),
  lang:        z.enum(['es', 'en']),
  postId:            z.string(),
  draft:             z.boolean().default(false),
  podcastEpisodeUrl: z.string().optional(),
});

export const collections = {
  'pensamiento':      defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/pensamiento' }),      schema: postSchema }),
  'ciencia-de-datos': defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/ciencia-de-datos' }), schema: postSchema }),
  'podcast':          defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/podcast' }),          schema: postSchema }),
};
