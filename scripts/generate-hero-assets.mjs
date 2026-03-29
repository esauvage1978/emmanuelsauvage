/**
 * Génère des versions responsives du hero (JPEG) pour améliorer le LCP.
 *
 * Usage :
 *   node scripts/generate-hero-assets.mjs
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), '.'); // ex. projet en cours
const src = join(root, 'public', 'images', 'hero-illustration-unsplash-2.jpg');

if (!existsSync(src)) {
	throw new Error(`Hero source introuvable : ${src}`);
}

const imagesDir = join(root, 'public', 'images');

const variants = [
	[662, 'hero-illustration-unsplash-2-662.jpg'],
	[1000, 'hero-illustration-unsplash-2-1000.jpg'],
	[1400, 'hero-illustration-unsplash-2-1400.jpg'],
];

await Promise.all(
	variants.map(async ([width, outName]) => {
		await sharp(src)
			.resize(width, null, { withoutEnlargement: true })
			.jpeg({
				quality: 78,
				progressive: true,
			})
			.toFile(join(imagesDir, outName));
		console.log('OK', outName);
	}),
);

