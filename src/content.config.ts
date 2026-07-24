import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: '**/*.md',
    // Draft/compare helpers must never become public URLs
    ignore: ['**/_*.md', '**/*_before.md', '**/*_old.md'],
  }),
  schema: z.object({
    title: z.string().max(110),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Kevin Gagnon'),
    category: z.enum([
      'Flights',
      'Borders',
      'Health',
      'Rewards',
      'Advisories',
      'Labor',
    ]),
    breaking: z.boolean().default(false),
    draft: z.boolean().default(false),
    /** If true: do not edit without Kevin’s written approval */
    locked: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { articles };
