/**
 * Génère des versions responsives du hero (JPEG + WebP) pour améliorer le LCP.
 *
 * Usage :
 *   node scripts/generate-hero-assets.mjs
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), '.');
const src = join(root, 'public', 'images', 'hero-illustration-unsplash-2.jpg');

if (!existsSync(src)) {
	throw new Error(`Hero source introuvable : ${src}`);
}

const imagesDir = join(root, 'public', 'images');

/** Largeurs alignées sur le srcset ; 480 couvre le mobile 1x sans surcharger le 662. */
const variants = [
	[480, 'hero-illustration-unsplash-2-480'],
	[662, 'hero-illustration-unsplash-2-662'],
	[1000, 'hero-illustration-unsplash-2-1000'],
	[1400, 'hero-illustration-unsplash-2-1400'],
];

await Promise.all(
	variants.flatMap(([width, baseName]) => [
		sharp(src)
			.resize(width, null, { withoutEnlargement: true })
			.jpeg({ quality: 78, progressive: true, mozjpeg: true })
			.toFile(join(imagesDir, `${baseName}.jpg`))
			.then(() => console.log('OK', `${baseName}.jpg`)),
		sharp(src)
			.resize(width, null, { withoutEnlargement: true })
			.webp({ quality: 80, effort: 4 })
			.toFile(join(imagesDir, `${baseName}.webp`))
			.then(() => console.log('OK', `${baseName}.webp`)),
	]),
);
