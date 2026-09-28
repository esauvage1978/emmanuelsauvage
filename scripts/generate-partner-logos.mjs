/**
 * Logos clients / partenaires (bandeau d'accueil, cartes réalisations).
 * Sources officielles dans src/assets/partners-src/ (non publiées) :
 *  - mon-coach-brico-full.png : logo Mon Coach Brico (logotype gris + « Brico » orange + baseline),
 *    même logotype que https://www.moncoachbrico.com/wp-content/uploads/2020/11/logo_mcb.png
 *  - hfe-energie.png : https://hfe-energie.fr/assets/logo/hfe-sansFond-sans-ecriture.png
 *  - edame.png       : https://edame.fr/image/cropped-logo-web-transparent.png
 *  - mon-coach-jardin-full.png : logo Mon Coach Jardin (gris + « Jardin » vert, fond blanc), même logotype que
 *    https://moncoachjardin.com/wp-content/uploads/2021/05/cropped-logo_mcj@2x-1.png (version vert foncé du site)
 *  - cabinet-parafiniuk.png : https://www.cabinet-avocat-parafiniuk.com/wp-content/uploads/2024/11/PL-avocat-1.png
 *  - openclassrooms.svg : logotype de l'en-tête de https://openclassrooms.com/fr/ (SVG inline, couleur #7451EB)
 * Sorties : public/images/partners/*.png, rognées (marges transparentes retirées), hauteur 160 px (80 px pour OpenClassrooms)
 * (affichage 22–36 px → net en @2x/@4x), fond transparent.
 * Usage : node scripts/generate-partner-logos.mjs
 */
import sharp from 'sharp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => join(root, 'src', 'assets', 'partners-src', f);
const out = (f) => join(root, 'public', 'images', 'partners', f);
const HEIGHT = 160;

const jobs = [
	// Baseline « Imaginez, apprenez et réalisez » retirée (illisible en petit, absente du logo d'en-tête du site officiel).
	{ in: 'mon-coach-brico-full.png', out: 'mon-coach-brico.png', crop: { left: 0, top: 0, width: 1200, height: 395 } },
	{ in: 'hfe-energie.png', out: 'hfe-energie.png' },
	{ in: 'edame.png', out: 'edame.png' },
	// Fond blanc opaque dans la source : converti en transparence (« couleur vers alpha »).
	{ in: 'mon-coach-jardin-full.png', out: 'mon-coach-jardin.png', whiteToAlpha: true },
	{ in: 'cabinet-parafiniuk.png', out: 'cabinet-parafiniuk.png' },
	// Logotype horizontal très allongé (13:1) : hauteur de sortie réduite pour garder une largeur raisonnable.
	{ in: 'openclassrooms.svg', out: 'openclassrooms.png', density: 600, height: 80 },
];

/** Blanc → transparent, bords anti-aliasés conservés (équivalent « Couleur vers alpha » de GIMP). */
async function whiteToAlpha(input) {
	const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	for (let i = 0; i < data.length; i += 4) {
		const a = Math.max(255 - data[i], 255 - data[i + 1], 255 - data[i + 2]) / 255;
		if (a === 0) { data[i + 3] = 0; continue; }
		for (let c = 0; c < 3; c++) data[i + c] = Math.round((data[i + c] - 255 * (1 - a)) / a);
		data[i + 3] = Math.round(data[i + 3] * a);
	}
	return sharp(data, { raw: info }).png().toBuffer();
}

for (const job of jobs) {
	let img = sharp(src(job.in), job.density ? { density: job.density } : {}).ensureAlpha();
	if (job.crop) img = sharp(await img.extract(job.crop).png().toBuffer());
	if (job.whiteToAlpha) img = sharp(await whiteToAlpha(await img.png().toBuffer()));
	const trimmed = await img.trim({ threshold: 10 }).png().toBuffer();
	const { width, height } = await sharp(trimmed)
		.resize({ height: job.height ?? HEIGHT, kernel: 'lanczos3' })
		.png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
		.toFile(out(job.out));
	console.log('OK', job.out, `${width}x${height}`);
}
