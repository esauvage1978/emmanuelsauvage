/**
 * Fusionne les .body.html extraits + métadonnées → src/content/blog/*.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'src/content/blog');

/** @type {Record<string, { title: string; description: string; pubDate: string; updatedDate?: string; readingTimeMinutes: number; tags: string[]; illustration: string }>} */
const META = {
	'google-sheets-vs-excel-limites-cas-usage': {
		title: 'Google Sheets vs Excel : limites techniques et cas d’usage',
		description:
			'Comparatif des plafonds (partages, cellules, fichiers, collaboration) et repères pour choisir Sheets, Excel bureau ou Excel en ligne selon votre contexte.',
		pubDate: '2026-03-20',
		readingTimeMinutes: 13,
		tags: ['Google Sheets', 'Excel', 'Outils métier', 'Décision'],
		illustration: 'sheets',
	},
	'site-vitrine-astro-zapier-mailjet': {
		title: 'Création de ce site vitrine : Astro (SSG), Zapier et Mailjet — sans surcouche serveur inutile',
		description:
			'Retour d’expérience sur la stack du site emmanuelsauvage.fr : génération statique, formulaire contact via proxy, orchestration Zapier et emails transactionnels Mailjet (MJML).',
		pubDate: '2026-03-19',
		readingTimeMinutes: 15,
		tags: ['Astro', 'Zapier', 'Mailjet', 'Architecture web'],
		illustration: 'vitrine',
	},
	'problem-details-rfc9457-symfony': {
		title: 'RFC 9457 (Problem Details) et Symfony : erreurs API lisibles et stables',
		description:
			'Format application/problem+json, champs type/title/status/instance, mapping des exceptions Symfony vers des réponses cohérentes pour les clients.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 9,
		tags: ['API', 'HTTP', 'Symfony'],
		illustration: 'problem',
	},
	'openapi-contrat-api-equipes': {
		title: 'OpenAPI comme contrat d’API : aligner back, front et QA',
		description:
			'Spécification partagée, génération de clients, mocks et tests de non-régression sur le schéma — sans bloquer la livraison.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 10,
		tags: ['OpenAPI', 'API', 'Qualité'],
		illustration: 'openapi',
	},
	'monolithe-modulaire-symfony-frontieres': {
		title: 'Monolithe modulaire Symfony : frontières nettes sans microservices',
		description:
			'Contextes délimités, namespaces, règles de dépendance et points d’intégration explicites pour garder une base évolutive.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 11,
		tags: ['Symfony', 'Architecture', 'DDD léger'],
		illustration: 'modules',
	},
	'maintenance-symfony-production-indicateurs': {
		title: 'Maintenance Symfony en production : indicateurs utiles au-delà du « tout est vert »',
		description:
			'composer audit, migrations, requêtes lentes, erreurs applicatives et capacité — une checklist opposable pour le run.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 8,
		tags: ['Symfony', 'Production', 'Ops'],
		illustration: 'ops',
	},
	'api-donnees-personnelles-minimisation-rgpd': {
		title: 'API et données personnelles : minimisation, journaux et rétention',
		description:
			'DTO publics, pseudonymisation dans les logs, durées de conservation et documentation pour limiter les risques RGPD.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 10,
		tags: ['API', 'RGPD', 'Sécurité'],
		illustration: 'privacy',
	},
	'symfony-refonte-ou-evolutions-ciblees': {
		title: 'Refonte Symfony ou évolutions ciblées : critères opposables en cadrage',
		description:
			'Comment trancher entre gros chantier et itérations : dette mesurable, risques métier, coût marginal d’une feature — avec repères concrets pour un cadrage freelance.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 11,
		tags: ['Symfony', 'Architecture', 'Cadrage'],
		illustration: 'refonte',
	},
	'versionner-api-rest-symfony': {
		title: 'Versionner une API REST avec Symfony : URL, en-têtes et déploiement',
		description:
			'Comparaison praticable URI /v1 vs négociation par en-têtes, impacts cache et clients, extraits routes et contrôleurs Symfony.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 10,
		tags: ['API REST', 'Symfony', 'HTTP'],
		illustration: 'api',
	},
	'validation-api-symfony-contraintes-reelles': {
		title: 'Validation d’entrées API Symfony : contraintes qui tiennent en production',
		description:
			'DTO + Validator, normalisation, UUID et messages d’erreur exploitables par les clients — exemples PHP 8 et bonnes pratiques.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 12,
		tags: ['Symfony', 'API', 'PHP'],
		illustration: 'validation',
	},
	'google-sheets-limite-outil-metier': {
		title: 'Google Sheets comme outil métier : seuils de rupture avant un back-office',
		description:
			'Volume, droits, audit trail, concurrence et risques — quand un tableur suffit et quand un outil web devient moins cher que l’informel.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 9,
		tags: ['Outils métier', 'Sheets', 'Décision'],
		illustration: 'sheets',
	},
	'webhooks-idempotence-cles-pratique': {
		title: 'Webhooks et idempotence : éviter les doublons sans sur-architecturer',
		description:
			'Idempotency-Key, stockage minimal, retries HTTP et sécurité basique — code PHP illustratif et pièges fréquents.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 10,
		tags: ['API', 'Webhooks', 'Fiabilité'],
		illustration: 'webhook',
	},
};

function escapeCodeForHtml(code) {
	return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Convertit les blocs <pre><code set:html={`...`}> d’Astro en HTML standard */
function astroCodeToHtml(html) {
	let out = html;
	const re = /<pre><code[\s\S]*?set:html=\{`([\s\S]*?)`\}[\s\S]*?<\/code><\/pre>/g;
	out = out.replace(re, (_, code) => `<pre><code>${escapeCodeForHtml(code)}</code></pre>`);
	return out;
}

function yamlString(s) {
	return JSON.stringify(s);
}

function buildFrontmatter(meta) {
	const lines = ['---'];
	lines.push(`title: ${yamlString(meta.title)}`);
	lines.push(`description: ${yamlString(meta.description)}`);
	lines.push(`pubDate: ${meta.pubDate}`);
	if (meta.updatedDate) lines.push(`updatedDate: ${meta.updatedDate}`);
	lines.push(`readingTimeMinutes: ${meta.readingTimeMinutes}`);
	lines.push(`tags:`);
	for (const t of meta.tags) lines.push(`  - ${yamlString(t)}`);
	lines.push(`illustration: ${meta.illustration}`);
	lines.push('---');
	return lines.join('\n');
}

for (const [slug, meta] of Object.entries(META)) {
	const bodyPath = path.join(contentDir, `${slug}.body.html`);
	if (!fs.existsSync(bodyPath)) {
		console.error('Missing', bodyPath);
		process.exit(1);
	}
	let body = fs.readFileSync(bodyPath, 'utf8');
	body = astroCodeToHtml(body);

	const md = `${buildFrontmatter(meta)}\n\n${body.trim()}\n`;
	fs.writeFileSync(path.join(contentDir, `${slug}.md`), md, 'utf8');
	console.log('OK', slug);
}

// Nettoyage des fichiers intermédiaires
for (const f of fs.readdirSync(contentDir)) {
	if (f.endsWith('.body.html')) fs.unlinkSync(path.join(contentDir, f));
}
