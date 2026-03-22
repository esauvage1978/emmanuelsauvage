/** Métadonnées des articles (liste blog + SEO). */
export type BlogPostMeta = {
	slug: string;
	title: string;
	description: string;
	pubDate: string;
	updatedDate?: string;
	readingTimeMinutes: number;
	tags: string[];
};

export const BLOG_POSTS: BlogPostMeta[] = [
	{
		slug: 'site-vitrine-astro-zapier-mailjet',
		title:
			'Création de ce site vitrine : Astro (SSG), Zapier et Mailjet — sans surcouche serveur inutile',
		description:
			'Retour d’expérience sur la stack du site emmanuelsauvage.fr : génération statique, formulaire contact via proxy, orchestration Zapier et emails transactionnels Mailjet (MJML).',
		pubDate: '2026-03-19',
		readingTimeMinutes: 15,
		tags: ['Astro', 'Zapier', 'Mailjet', 'Architecture web'],
	},
	{
		slug: 'problem-details-rfc9457-symfony',
		title: 'RFC 9457 (Problem Details) et Symfony : erreurs API lisibles et stables',
		description:
			'Format application/problem+json, champs type/title/status/instance, mapping des exceptions Symfony vers des réponses cohérentes pour les clients.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 9,
		tags: ['API', 'HTTP', 'Symfony'],
	},
	{
		slug: 'openapi-contrat-api-equipes',
		title: 'OpenAPI comme contrat d’API : aligner back, front et QA',
		description:
			'Spécification partagée, génération de clients, mocks et tests de non-régression sur le schéma — sans bloquer la livraison.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 10,
		tags: ['OpenAPI', 'API', 'Qualité'],
	},
	{
		slug: 'monolithe-modulaire-symfony-frontieres',
		title: 'Monolithe modulaire Symfony : frontières nettes sans microservices',
		description:
			'Contextes délimités, namespaces, règles de dépendance et points d’intégration explicites pour garder une base évolutive.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 11,
		tags: ['Symfony', 'Architecture', 'DDD léger'],
	},
	{
		slug: 'maintenance-symfony-production-indicateurs',
		title: 'Maintenance Symfony en production : indicateurs utiles au-delà du « tout est vert »',
		description:
			'composer audit, migrations, requêtes lentes, erreurs applicatives et capacité — une checklist opposable pour le run.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 8,
		tags: ['Symfony', 'Production', 'Ops'],
	},
	{
		slug: 'api-donnees-personnelles-minimisation-rgpd',
		title: 'API et données personnelles : minimisation, journaux et rétention',
		description:
			'DTO publics, pseudonymisation dans les logs, durées de conservation et documentation pour limiter les risques RGPD.',
		pubDate: '2026-03-18',
		readingTimeMinutes: 10,
		tags: ['API', 'RGPD', 'Sécurité'],
	},
	{
		slug: 'symfony-refonte-ou-evolutions-ciblees',
		title: 'Refonte Symfony ou évolutions ciblées : critères opposables en cadrage',
		description:
			'Comment trancher entre gros chantier et itérations : dette mesurable, risques métier, coût marginal d’une feature — avec repères concrets pour un cadrage freelance.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 11,
		tags: ['Symfony', 'Architecture', 'Cadrage'],
	},
	{
		slug: 'versionner-api-rest-symfony',
		title: 'Versionner une API REST avec Symfony : URL, en-têtes et déploiement',
		description:
			'Comparaison praticable URI /v1 vs négociation par en-têtes, impacts cache et clients, extraits routes et contrôleurs Symfony.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 10,
		tags: ['API REST', 'Symfony', 'HTTP'],
	},
	{
		slug: 'validation-api-symfony-contraintes-reelles',
		title: 'Validation d’entrées API Symfony : contraintes qui tiennent en production',
		description:
			'DTO + Validator, normalisation, UUID et messages d’erreur exploitables par les clients — exemples PHP 8 et bonnes pratiques.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 12,
		tags: ['Symfony', 'API', 'PHP'],
	},
	{
		slug: 'google-sheets-limite-outil-metier',
		title: 'Google Sheets comme outil métier : seuils de rupture avant un back-office',
		description:
			'Volume, droits, audit trail, concurrence et risques — quand un tableur suffit et quand un outil web devient moins cher que l’informel.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 9,
		tags: ['Outils métier', 'Sheets', 'Décision'],
	},
	{
		slug: 'webhooks-idempotence-cles-pratique',
		title: 'Webhooks et idempotence : éviter les doublons sans sur-architecturer',
		description:
			'Idempotency-Key, stockage minimal, retries HTTP et sécurité basique — code PHP illustratif et pièges fréquents.',
		pubDate: '2026-03-17',
		readingTimeMinutes: 10,
		tags: ['API', 'Webhooks', 'Fiabilité'],
	},
];

export function getPostBySlug(slug: string): BlogPostMeta | undefined {
	return BLOG_POSTS.find((p) => p.slug === slug);
}
