import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title:       z.string(),
  date:        z.string(),
  description: z.string(),
  tags:        z.array(z.string()),
  cover:       z.string().optional(),
  lang:        z.enum(['es', 'en']),
  postId:            z.string(), // shared key between ES/EN translations
  draft:             z.boolean().default(false),
  podcastEpisodeUrl: z.string().optional(), // RSS.com embed URL (optional)
});

export const collections = {
  'pensamiento':      defineCollection({ type: 'content', schema: postSchema }),
  'ciencia-de-datos': defineCollection({ type: 'content', schema: postSchema }),
  'podcast':          defineCollection({ type: 'content', schema: postSchema }),
};
