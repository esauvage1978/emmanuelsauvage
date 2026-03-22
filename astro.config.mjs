// @ts-check
import { defineConfig } from 'astro/config';

/** Même URL que dans public/contact-zapier.php — évite le CORS navigateur → Zapier en dev */
const ZAPIER_CATCH_PATH = '/hooks/catch/26903545/upkex8r/';

// https://astro.build/config
export default defineConfig({
	/** `/blog` et `/blog/` + articles `/blog/slug/` ; combiné à `blog/index.astro` (pas `blog.astro` + dossier `blog/`). */
	trailingSlash: 'ignore',
	vite: {
		server: {
			proxy: {
				'/api/zapier-contact': {
					target: 'https://hooks.zapier.com',
					changeOrigin: true,
					secure: true,
					rewrite: () => ZAPIER_CATCH_PATH,
				},
			},
		},
	},
});
