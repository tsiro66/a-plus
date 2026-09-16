import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    photos: z.array(z.string()).min(1),
    dateStart: z.string(),
    dateEnd: z.string().optional().nullable(),
    order: z.number().int(),
  }),
});

export const collections = { projects };
