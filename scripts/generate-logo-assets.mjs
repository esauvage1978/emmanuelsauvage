/**
 * Régénère logos, favicons et variantes WebP depuis public/images/logo.jpeg
 * Usage : node scripts/generate-logo-assets.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcJpg = join(root, 'public', 'images', 'logo.jpeg');
const srcSvg = join(root, 'public', 'images', 'logo-source.svg');
const src = existsSync(srcSvg) ? srcSvg : srcJpg;
const imagesDir = join(root, 'public', 'images');
const publicDir = join(root, 'public');

/** Carré centré — adapté aux favicons et vignettes */
async function squarePng(size, outName) {
	const scale = 4; // Suréchantillonne pour limiter le flou/aliasing après rasterisation SVG
	let img = sharp(src);
	// Le "trim" aide à remplir les petits visuels (favicon). Sur les grosses tailles, ça peut au contraire donner un rendu moins net.
	if (size <= 32) img = img.trim();
	await img
		.resize(size * scale, size * scale, {
			fit: 'contain',
			position: 'centre',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.resize(size, size, {
			fit: 'contain',
			position: 'centre',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		})
		.png({ compressionLevel: 9 })
		.toFile(join(imagesDir, outName));
	console.log('OK', outName);
}

async function webp(size, outName) {
	const scale = 4;
	let img = sharp(src);
	if (size <= 32) img = img.trim();
	await img
		.resize(size * scale, size * scale, {
			fit: 'contain',
			position: 'centre',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.resize(size, size, {
			fit: 'contain',
			position: 'centre',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		})
		.webp({ quality: 88 })
		.toFile(join(imagesDir, outName));
	console.log('OK', outName);
}

async function main() {
	const input = sharp(src);
	const meta = await input.metadata();
	console.log('Source:', src, meta.width, 'x', meta.height, meta.format);

	const pngSizes = [
		[32, 'logo-32.png'],
		[64, 'logo-64.png'],
		[128, 'logo-128.png'],
		[256, 'logo-256.png'],
		[512, 'logo-512.png'],
	];

	for (const [size, name] of pngSizes) {
		await squarePng(size, name);
	}

	await webp(32, 'logo-32.webp');
	await webp(64, 'logo-64.webp');
	await webp(128, 'logo-128.webp');
	await webp(512, 'logo-512.webp');
	await webp(1024, 'logo-1024.webp');

	await squarePng(16, 'favicon-16x16.png');
	await squarePng(32, 'favicon-32x32.png');
	await squarePng(180, 'apple-touch-icon.png');

	// favicon racine (référencé par Layout)
	{
		const scale = 4;
		await sharp(src)
			.trim()
			.resize(32 * scale, 32 * scale, {
				fit: 'contain',
				position: 'centre',
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.resize(32, 32, {
				fit: 'contain',
				position: 'centre',
				background: { r: 0, g: 0, b: 0, alpha: 0 },
				kernel: 'lanczos3',
			})
			.png({ compressionLevel: 9 })
			.toFile(join(publicDir, 'favicon.png'));
	}
	console.log('OK public/favicon.png');

	// .ico : PNG 16×16 puis 32×32 embarqués (format ICO « PNG » supporté par les navigateurs modernes)
	const png16 = await readFile(join(imagesDir, 'favicon-16x16.png'));
	const png32 = await readFile(join(imagesDir, 'favicon-32x32.png'));
	const ico = await buildIcoFromPngs([png16, png32]);
	await writeFile(join(publicDir, 'favicon.ico'), ico);
	console.log('OK public/favicon.ico');
}

/** Fichier .ico contenant des images au format PNG (sans BMP/DIB). */
async function buildIcoFromPngs(pngBuffers) {
	const metas = await Promise.all(
		pngBuffers.map(async (buf) => {
			const m = await sharp(buf).metadata();
			return { w: m.width, h: m.height, buf };
		}),
	);

	const headerAndEntries = 6 + 16 * metas.length;
	let dataOffset = headerAndEntries;
	const totalSize = headerAndEntries + metas.reduce((s, e) => s + e.buf.length, 0);
	const out = Buffer.alloc(totalSize);
	let pos = 0;

	out.writeUInt16LE(0, pos);
	pos += 2;
	out.writeUInt16LE(1, pos);
	pos += 2;
	out.writeUInt16LE(metas.length, pos);
	pos += 2;

	for (const e of metas) {
		out.writeUInt8(e.w >= 256 ? 0 : e.w, pos++);
		out.writeUInt8(e.h >= 256 ? 0 : e.h, pos++);
		out.writeUInt8(0, pos++);
		out.writeUInt8(0, pos++);
		out.writeUInt16LE(1, pos);
		pos += 2;
		out.writeUInt16LE(32, pos);
		pos += 2;
		out.writeUInt32LE(e.buf.length, pos);
		pos += 4;
		out.writeUInt32LE(dataOffset, pos);
		pos += 4;
		dataOffset += e.buf.length;
	}

	for (const e of metas) {
		e.buf.copy(out, pos);
		pos += e.buf.length;
	}

	return out;
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
