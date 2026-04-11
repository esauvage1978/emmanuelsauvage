// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** Même URL que dans public/contact-zapier.php — évite le CORS navigateur → webhook en dev */
const ZAPIER_WEBHOOK_ORIGIN = 'https://webhooky.builders';
const ZAPIER_WEBHOOK_PATH = '/webhook/form/0b40160efaa3f78eab00-cd38-4cbb-9e57-46796830e108';

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
