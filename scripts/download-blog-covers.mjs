/**
 * Télécharge les vignettes blog depuis Unsplash (licence libre).
 *
 * Usage : node scripts/download-blog-covers.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = join(root, 'public', 'images', 'blog');

/** Slug → ID photo Unsplash (sans préfixe photo-) */
const covers = {
	'freelance-vs-agence-vs-internalisation-projets-tech': '1552664730-d307ca884978',
	'cout-dette-technique-entreprise-analyse': '1551288049-bebda4e38f71',
	'application-web-perd-argent-signes': '1460925895917-afdab827c52f',
	'fichiers-excel-cout-cache-entreprise': '1554224155-6726b3ff858f',
	'automatiser-entreprise-google-workspace-gains-cas': '1497366216548-37526070297c',
	'migration-symfony-guide-complet-2026': '1555066931-4365d14bab8c',
	'formation-google-sheets-entreprise-levier-productivite': '1522202176988-66273c2fd55f',
	'automatiser-processus-metier-google-apps-script-entreprise': '1553877522-43269d4ea984',
	'refonte-application-web-signaux-strategie-dette-technique': '1454165804606-c3d57bc86b40',
	'google-sheets-vs-excel-limites-cas-usage': '1450101499163-c8848c66ca85',
	'site-vitrine-astro-zapier-mailjet': '1547658719-da2b51169166',
	'monolithe-modulaire-symfony-frontieres': '1563013544-824ae1b704d3',
	'google-sheets-limite-outil-metier': '1586281380349-632531db7ed4',
	'symfony-refonte-ou-evolutions-ciblees': '1516321318423-f06f85e504b3',
	'validation-api-symfony-contraintes-reelles': '1454165804606-c3d57bc86b40',
	'versionner-api-rest-symfony': '1557804506-669a67965ba0',
};

await mkdir(outDir, { recursive: true });

for (const [slug, photoId] of Object.entries(covers)) {
	const url = `https://images.unsplash.com/photo-${photoId}?w=640&h=400&fit=crop&q=85&auto=format`;
	const res = await fetch(url, {
		headers: { 'User-Agent': 'emmanuelsauvage-blog-covers/1.0' },
	});
	if (!res.ok) {
		console.error('FAIL', slug, res.status);
		continue;
	}
	const buffer = Buffer.from(await res.arrayBuffer());
	const webpPath = join(outDir, `${slug}.webp`);
	const jpegPath = join(outDir, `${slug}.jpg`);

	await sharp(buffer)
		.resize(640, 400, { fit: 'cover' })
		.webp({ quality: 82 })
		.toFile(webpPath);

	await sharp(buffer)
		.resize(640, 400, { fit: 'cover' })
		.jpeg({ quality: 80, progressive: true, mozjpeg: true })
		.toFile(jpegPath);

	console.log('OK', slug);
}

const credits = `# Crédits vignettes blog (Unsplash)

Licence : https://unsplash.com/license

${Object.entries(covers)
	.map(([slug, id]) => `- ${slug} : https://unsplash.com/photos/${id}`)
	.join('\n')}
`;

await writeFile(join(outDir, 'CREDITS.md'), credits, 'utf8');
console.log('Credits written to public/images/blog/CREDITS.md');
