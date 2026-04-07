// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** Même URL que dans public/contact-zapier.php — évite le CORS navigateur → Zapier en dev */
const ZAPIER_WEBHOOK_ORIGIN = 'https://zapier.emmanuelsauvage.fr';
const ZAPIER_WEBHOOK_PATH = '/webhook/form/1264ea10-cc2c-49d4-9614-c22647fa1f88';

// https://astro.build/config
export default defineConfig({
	/** `/blog` et `/blog/` + articles `/blog/slug/` ; combiné à `blog/index.astro` (pas `blog.astro` + dossier `blog/`). */
	trailingSlash: 'ignore',
	site: 'https://emmanuelsauvage.fr',
	integrations: [sitemap()],
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
