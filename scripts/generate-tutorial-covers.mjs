/**
 * Génère les vignettes 640×400 (WebP + JPEG) des tutoriels Google Sheets, aux couleurs du site,
 * pour les articles sans photo Unsplash : public/images/blog/<slug>.webp|jpg
 * (référencées ensuite dans src/data/blog-covers.ts).
 *
 * Usage : node scripts/generate-tutorial-covers.mjs
 * Police : « Inter » doit être installée sur la machine (sinon police sans-serif par défaut).
 */
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = `${root}public/images/blog`;
mkdirSync(outDir, { recursive: true });

const C = { primary: '#2f3a8f', spot: '#c45c2e', accent: '#4f6ef7', text: '#2d2d2d', muted: '#5b5b5b', bg: '#f7f8fc', grid: '#d9dcef' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** slug → libellé principal, formule de la barre fx, cellules (4 lignes × 3 colonnes), cellule mise en avant [ligne, colonne]. */
const covers = [
	{
		slug: 'recherchev-recherchex-google-sheets',
		label: 'RECHERCHEX',
		formula: '=RECHERCHEX(E2; A2:A; C2:C)',
		cells: [['P-101', 'Clé USB', '12'], ['P-102', 'Écran', '189'], ['P-205', 'Clavier', '35'], ['P-310', 'Station', '129']],
		hl: [2, 2],
	},
	{
		slug: 'arrayformula-map-makearray-google-sheets',
		label: 'ARRAYFORMULA',
		formula: '=ARRAYFORMULA(A2:A*B2:B)',
		cells: [['10', '120', '1 200'], ['3', '150', '450'], ['20', '190', '3 800'], ['2', '45', '90']],
		hl: [-1, 2],
	},
	{
		slug: 'google-sheets-formule-si-plusieurs-conditions',
		label: 'SI + ET / OU',
		formula: '=SI(ET(A4="Nord"; B4>=1000); "Oui"; "")',
		cells: [['Nord', '1 200', 'Payé'], ['Sud', '450', 'Attente'], ['Nord', '3 800', 'Attente'], ['Est', '90', 'Payé']],
		hl: [2, 1],
	},
	{
		slug: 'fonction-query-google-sheets',
		label: 'QUERY',
		formula: '=QUERY(A1:C; "select A, sum(C) …")',
		cells: [['Julie', 'Nord', '1 200'], ['Karim', 'Sud', '450'], ['Julie', 'Nord', '3 800'], ['Karim', 'Est', '900']],
		hl: [0, 2],
	},
];

function svg({ label, formula, cells, hl }) {
	const x0 = 150, y0 = 186, cw = 140, rh = 34, hw = 40;
	const cols = ['A', 'B', 'C'];
	let grid = '';
	// en-têtes de colonnes
	grid += `<rect x="${x0 - hw}" y="${y0 - rh}" width="${hw + cw * 3}" height="${rh}" fill="#eef0f8"/>`;
	cols.forEach((c, i) => {
		grid += `<text x="${x0 + i * cw + cw / 2}" y="${y0 - 11}" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="600" fill="${C.muted}">${c}</text>`;
	});
	cells.forEach((row, r) => {
		const y = y0 + r * rh;
		grid += `<rect x="${x0 - hw}" y="${y}" width="${hw}" height="${rh}" fill="#eef0f8"/>`;
		grid += `<text x="${x0 - hw / 2}" y="${y + 22}" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="${C.muted}">${r + 2}</text>`;
		row.forEach((v, c) => {
			const on = (hl[0] === r || hl[0] === -1) && hl[1] === c;
			if (on) grid += `<rect x="${x0 + c * cw}" y="${y}" width="${cw}" height="${rh}" fill="${C.spot}" fill-opacity="0.12"/>`;
			grid += `<text x="${x0 + c * cw + 12}" y="${y + 22}" font-family="Inter, sans-serif" font-size="16" font-weight="${on ? 700 : 500}" fill="${on ? C.spot : C.text}">${esc(v)}</text>`;
		});
	});
	// quadrillage
	for (let r = 0; r <= cells.length + 1; r++) grid += `<line x1="${x0 - hw}" y1="${y0 - rh + r * rh}" x2="${x0 + cw * 3}" y2="${y0 - rh + r * rh}" stroke="${C.grid}"/>`;
	grid += `<line x1="${x0 - hw}" y1="${y0 - rh}" x2="${x0 - hw}" y2="${y0 + cells.length * rh}" stroke="${C.grid}"/>`;
	for (let c = 0; c <= 3; c++) grid += `<line x1="${x0 + c * cw}" y1="${y0 - rh}" x2="${x0 + c * cw}" y2="${y0 + cells.length * rh}" stroke="${C.grid}"/>`;
	if (hl[0] === -1) grid += `<rect x="${x0 + hl[1] * cw}" y="${y0}" width="${cw}" height="${cells.length * rh}" fill="none" stroke="${C.spot}" stroke-width="2.5"/>`;
	else grid += `<rect x="${x0 + hl[1] * cw}" y="${y0 + hl[0] * rh}" width="${cw}" height="${rh}" fill="none" stroke="${C.spot}" stroke-width="2.5"/>`;

	return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
	<defs>
		<linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.primary}"/><stop offset="0.55" stop-color="${C.spot}"/><stop offset="1" stop-color="${C.accent}"/></linearGradient>
		<radialGradient id="a" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>
		<radialGradient id="b" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.spot}" stop-opacity="0.18"/><stop offset="1" stop-color="${C.spot}" stop-opacity="0"/></radialGradient>
	</defs>
	<rect width="640" height="400" fill="${C.bg}"/>
	<circle cx="590" cy="40" r="220" fill="url(#a)"/>
	<circle cx="40" cy="390" r="200" fill="url(#b)"/>
	<rect width="640" height="6" fill="url(#bar)"/>
	<rect x="70" y="40" width="500" height="320" rx="18" fill="#ffffff" stroke="${C.primary}" stroke-opacity="0.16"/>
	<text x="320" y="96" text-anchor="middle" font-family="Inter, sans-serif" font-size="40" font-weight="800" letter-spacing="-1" fill="${C.primary}">${esc(label)}</text>
	<rect x="110" y="114" width="420" height="30" rx="8" fill="#f3f4fa" stroke="${C.grid}"/>
	<text x="124" y="134" font-family="Inter, sans-serif" font-size="14" font-style="italic" font-weight="700" fill="${C.muted}">fx</text>
	<text x="150" y="134" font-family="'DejaVu Sans Mono', monospace" font-size="14" fill="${C.text}">${esc(formula)}</text>
	${grid}
</svg>`;
}

for (const c of covers) {
	const buf = Buffer.from(svg(c));
	await sharp(buf, { density: 144 }).resize(640, 400).webp({ quality: 82 }).toFile(`${outDir}/${c.slug}.webp`);
	await sharp(buf, { density: 144 }).resize(640, 400).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(`${outDir}/${c.slug}.jpg`);
	console.log(`✓ public/images/blog/${c.slug}.webp|jpg`);
}
