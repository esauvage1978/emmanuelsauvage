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
		/** Meta description SEO (≤ 160 car.) si `description` (affichée en chapô) est trop longue. */
		metaDescription: z.string().max(160).optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		readingTimeMinutes: z.number().int().positive(),
		tags: z.array(z.string()),
		illustration: blogIllustrationSchema,
		/** Rubrique du blog, alignée sur les 3 offres (filtre de la page /blog/ et encart CTA de l’article). */
		category: z.enum(['google-sheets', 'applications', 'sites-web']).optional(),
	}),
});

export const collections = { blog };
