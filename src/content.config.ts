import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Variants alignés sur `BlogIllustration.astro` */
const blogIllustrationSchema = z.enum([
	'refonte',
	'api',
	'validation',
	'sheets',
	'webhook',
	'problem',
	'openapi',
	'modules',
	'ops',
	'privacy',
	'vitrine',
]);

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		/** Titre court pour la balise title du document et Open Graph (≤ 60 car.) ; le H1 reste `title`. */
		shortTitle: z.string().max(60).optional(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		readingTimeMinutes: z.number().int().positive(),
		tags: z.array(z.string()),
		illustration: blogIllustrationSchema,
	}),
});

export const collections = { blog };
