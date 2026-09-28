/**
 * Génère les images de partage Open Graph / Twitter (1200×630, PNG) :
 *  - public/images/og/default.png        → pages hors blog (par défaut)
 *  - public/images/og/<page>.png         → pages d’offre (formation, applications, sites…)
 *  - public/images/og/blog/<slug>.png    → une carte par article (titre court + thématiques)
 *
 * Usage : npm run generate:og   (à relancer après l’ajout ou le renommage d’un article)
 * Police : « Inter » doit être installée sur la machine (sinon police sans-serif par défaut).
 */
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = `${root}public/images/og`;
const blogDir = `${root}src/content/blog`;
mkdirSync(`${outDir}/blog`, { recursive: true });

const W = 1200;
const H = 630;
const C = {
	primary: '#2f3a8f',
	spot: '#c45c2e',
	accent: '#4f6ef7',
	text: '#2d2d2d',
	muted: '#5b5b5b',
	bg: '#f7f8fc',
};
const logo = readFileSync(`${root}public/images/logo-512.png`).toString('base64');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Largeur approximative d’un texte Inter (em) pour le retour à la ligne. */
function textWidth(str, size) {
	let w = 0;
	for (const ch of str) {
		if (' .,:;’\'!|()[]'.includes(ch)) w += 0.3;
		else if ('iljtfrI'.includes(ch)) w += 0.34;
		else if ('mwMWÉ&@'.includes(ch)) w += 0.86;
		else if (ch === ch.toUpperCase() && /[A-ZÀ-Ý]/.test(ch)) w += 0.7;
		else w += 0.58;
	}
	return w * size;
}

function wrap(str, size, maxWidth, maxLines) {
	const words = str.split(/\s+/);
	const lines = [];
	let cur = '';
	for (const word of words) {
		const test = cur ? `${cur} ${word}` : word;
		if (textWidth(test, size) <= maxWidth || !cur) cur = test;
		else {
			lines.push(cur);
			cur = word;
		}
	}
	if (cur) lines.push(cur);
	if (lines.length > maxLines) {
		const kept = lines.slice(0, maxLines);
		kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,:;–-]+$/, '')}…`;
		return kept;
	}
	return lines;
}

function frame(inner) {
	return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
	<defs>
		<linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color="${C.primary}"/><stop offset="0.55" stop-color="${C.spot}"/><stop offset="1" stop-color="${C.accent}"/>
		</linearGradient>
		<radialGradient id="blobA" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="${C.accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
		</radialGradient>
		<radialGradient id="blobB" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="${C.spot}" stop-opacity="0.18"/><stop offset="1" stop-color="${C.spot}" stop-opacity="0"/>
		</radialGradient>
	</defs>
	<rect width="${W}" height="${H}" fill="${C.bg}"/>
	<circle cx="1080" cy="90" r="360" fill="url(#blobA)"/>
	<circle cx="980" cy="620" r="300" fill="url(#blobB)"/>
	<rect width="${W}" height="10" fill="url(#bar)"/>
	<rect x="0" y="${H - 6}" width="${W}" height="6" fill="url(#bar)" opacity="0.5"/>
	${inner}
</svg>`;
}

function chips(items, x, y, size = 22) {
	let cx = x;
	return items
		.map((label) => {
			const w = textWidth(label, size) + 36;
			const svg = `<rect x="${cx}" y="${y}" width="${w}" height="${size + 22}" rx="${(size + 22) / 2}" fill="#ffffff" stroke="${C.primary}" stroke-opacity="0.18"/>
	<text x="${cx + 18}" y="${y + size + 5}" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="${size}" font-weight="600" fill="${C.primary}">${esc(label)}</text>`;
			cx += w + 12;
			return svg;
		})
		.join('\n\t');
}

async function render(svg, file) {
	await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 100, colours: 256, dither: 0, effort: 10 }).toFile(file);
}

// ---------------------------------------------------------------- image par défaut
const defaultSvg = frame(`
	<image x="80" y="92" width="132" height="132" xlink:href="data:image/png;base64,${logo}"/>
	<text x="80" y="318" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="76" font-weight="800" letter-spacing="-2" fill="${C.primary}">Emmanuel Sauvage</text>
	<text x="80" y="384" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="38" font-weight="600" fill="${C.text}">Du tableur à l’application : formation Google Sheets,</text>
	<text x="80" y="432" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="38" font-weight="600" fill="${C.text}">applications sur mesure et sites web</text>
	${chips(['Formation Google Sheets', 'Apps Script', 'Applications métier', 'Sites web'], 80, 470)}
	<text x="80" y="582" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="26" font-weight="600" fill="${C.spot}">emmanuelsauvage.fr <tspan font-weight="400" fill="${C.muted}">· Erquinghem-Lys, près de Lille</tspan></text>
`);
await render(defaultSvg, `${outDir}/default.png`);
console.log('✓ public/images/og/default.png');

// ---------------------------------------------------------------- une carte par page d’offre
const pages = [
	{ slug: 'formation-google-sheets', eyebrow: 'Formation', heading: 'Formation Google Sheets en entreprise', chips: ['Intra ou à distance', 'Sur vos fichiers', 'Finançable OPCO'] },
	{ slug: 'formation-apps-script', eyebrow: 'Formation', heading: 'Formation Google Apps Script : automatisez vos Google Sheets', chips: ['2 jours', 'Intra ou à distance', 'Finançable OPCO'] },
	{ slug: 'developpement-application-sur-mesure', eyebrow: 'Applications', heading: 'Développement d’applications métier sur mesure', chips: ['Développeur senior', 'Accéléré par l’IA', 'Code à vous'] },
	{ slug: 'automatisation-google-sheets', eyebrow: 'Applications', heading: 'Automatisation Google Sheets et Apps Script', chips: ['Collecte multisite', 'Rapports automatiques', 'Alertes'] },
	{ slug: 'refonte-application-web', eyebrow: 'Applications', heading: 'Refonte et maintenance d’application web métier', chips: ['Maintenance', 'Reprise', 'Refonte progressive'] },
	{ slug: 'developpeur-symfony-freelance', eyebrow: 'Applications', heading: 'Développeur Symfony freelance pour agences, ESN et DSI', chips: ['API Platform', 'Migrations', 'Maintenance'] },
	{ slug: 'creation-site-internet', eyebrow: 'Sites internet', heading: 'Création de site internet à Lille et Armentières', chips: ['Sites rapides', 'SEO local', 'Formulaires connectés'] },
	{ slug: 'realisations', eyebrow: 'Réalisations', heading: 'Réalisations : outils Google Sheets, applications et sites', chips: ['Études de cas', 'Applications', 'Sites web'] },
	{ slug: 'a-propos', eyebrow: 'À propos', heading: 'Emmanuel Sauvage, formateur Google Sheets et développeur', chips: ['Près de Lille', 'Présentiel ou à distance'] },
];

for (const pg of pages) {
	const size = pg.heading.length > 44 ? 62 : 70;
	const lines = wrap(pg.heading, size, 1040, 3);
	const lineH = Math.round(size * 1.16);
	const top = Math.round(300 - ((lines.length - 1) * lineH) / 2 + size * 0.35);
	const svg = frame(`
	<image x="80" y="58" width="64" height="64" xlink:href="data:image/png;base64,${logo}"/>
	<text x="162" y="100" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="28" font-weight="700" fill="${C.primary}">Emmanuel Sauvage <tspan font-weight="600" fill="${C.spot}">· ${esc(pg.eyebrow)}</tspan></text>
	${lines
		.map(
			(l, i) =>
				`<text x="80" y="${top + i * lineH}" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="${size}" font-weight="800" letter-spacing="-1.5" fill="${C.text}">${esc(l)}</text>`,
		)
		.join('\n\t')}
	${chips(pg.chips, 80, 488)}
	<text x="80" y="590" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="24" font-weight="600" fill="${C.muted}">emmanuelsauvage.fr · Erquinghem-Lys, près de Lille</text>
`);
	await render(svg, `${outDir}/${pg.slug}.png`);
	console.log(`✓ public/images/og/${pg.slug}.png`);
}

// ---------------------------------------------------------------- une carte par article
function frontmatter(md) {
	const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
	const get = (k) => fm.match(new RegExp(`^${k}:\\s*"(.*)"\\s*$`, 'm'))?.[1];
	const tags = [...(fm.match(/^tags:\r?\n((?:\s+-\s+.*\r?\n?)+)/m)?.[1] ?? '').matchAll(/-\s+"?([^"\r\n]+)"?/g)].map(
		(m) => m[1],
	);
	return { title: get('title'), shortTitle: get('shortTitle'), tags };
}

for (const file of readdirSync(blogDir).filter((f) => f.endsWith('.md'))) {
	const slug = file.replace(/\.md$/, '');
	const { title, shortTitle, tags } = frontmatter(readFileSync(`${blogDir}/${file}`, 'utf8'));
	const heading = shortTitle ?? title ?? slug;
	const size = heading.length > 52 ? 62 : 70;
	const lines = wrap(heading, size, 1040, 3);
	const lineH = Math.round(size * 1.16);
	const top = Math.round(300 - ((lines.length - 1) * lineH) / 2 + size * 0.35);
	const svg = frame(`
	<image x="80" y="58" width="64" height="64" xlink:href="data:image/png;base64,${logo}"/>
	<text x="162" y="100" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="28" font-weight="700" fill="${C.primary}">Emmanuel Sauvage <tspan font-weight="600" fill="${C.spot}">· Blog</tspan></text>
	${lines
		.map(
			(l, i) =>
				`<text x="80" y="${top + i * lineH}" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="${size}" font-weight="800" letter-spacing="-1.5" fill="${C.text}">${esc(l)}</text>`,
		)
		.join('\n\t')}
	${chips(tags.slice(0, 4), 80, 488)}
	<text x="80" y="590" font-family="Inter, 'DejaVu Sans', sans-serif" font-size="24" font-weight="600" fill="${C.muted}">emmanuelsauvage.fr/blog/ · Formation Google Sheets, applications &amp; sites, Lille</text>
`);
	await render(svg, `${outDir}/blog/${slug}.png`);
	console.log(`✓ public/images/og/blog/${slug}.png`);
}
