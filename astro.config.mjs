// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

/** Même URL que dans public/contact-zapier.php — évite le CORS navigateur → webhook en dev */
const ZAPIER_WEBHOOK_ORIGIN = 'https://webhooky.builders';
const ZAPIER_WEBHOOK_PATH = '/webhook/form/0b40160efaa3f78eab00-cd38-4cbb-9e57-46796830e108';

/**
 * Dates des articles (frontmatter `updatedDate` ou `pubDate`) → balise <lastmod> du sitemap.
 * Lecture directe des fichiers Markdown : `astro:content` n'est pas disponible dans la config.
 */
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url);
const blogLastmod = new Map();
for (const file of readdirSync(BLOG_DIR)) {
	if (!file.endsWith('.md')) continue;
	const fm = readFileSync(new URL(file, BLOG_DIR), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!fm) continue;
	const pick = (key) => fm[1].match(new RegExp(`^${key}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1];
	const date = pick('updatedDate') ?? pick('pubDate');
	if (date) blogLastmod.set(file.replace(/\.md$/, ''), new Date(`${date}T00:00:00Z`));
}
const latestPost = [...blogLastmod.values()].sort((a, b) => b.getTime() - a.getTime())[0];
const buildDate = new Date();

// https://astro.build/config
export default defineConfig({
	/**
	 * `/blog` et `/blog/` + articles `/blog/slug/` ; combiné à `blog/index.astro` (pas `blog.astro` + dossier `blog/`).
	 * Les liens internes pointent TOUJOURS vers l’URL canonique avec « / » final (`/contact/`, `/blog/`…).
	 * On garde 'ignore' (et non 'always') : en dev, 'always' renverrait une 404 sur le proxy `/api/zapier-contact`.
	 */
	trailingSlash: 'ignore',
	site: 'https://emmanuelsauvage.fr',
	integrations: [
		sitemap({
			/** <lastmod> : date de l'article pour le blog, date du dernier article pour /blog/, date du build sinon. */
			serialize(item) {
				const path = new URL(item.url).pathname;
				const slug = path.match(/^\/blog\/([^/]+)\/$/)?.[1];
				const date = slug ? blogLastmod.get(slug) : path === '/blog/' ? latestPost : buildDate;
				if (date) item.lastmod = date.toISOString();
				return item;
			},
		}),
	],
	build: {
		/** Évite les CSS /_astro/*.css bloquants le rendu (PageSpeed « requêtes de blocage »). */
		inlineStylesheets: 'always',
	},
	vite: {
		server: {
			proxy: {
				'/api/zapier-contact': {
					target: ZAPIER_WEBHOOK_ORIGIN,
					changeOrigin: true,
					secure: true,
					rewrite: () => ZAPIER_WEBHOOK_PATH,
				},
			},
		},
	},
});
