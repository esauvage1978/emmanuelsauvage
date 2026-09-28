import { SITE_AREA_SERVED, SITE_ORIGIN } from '../config/site';

/**
 * JSON-LD `Service` pour les pages d'offre. Pas de `Course` pour les formations tant que l'organisme
 * partenaire (fournisseur obligatoire du balisage Course) n'est pas confirmé. TODO (Emmanuel).
 * Aucun avis ni aggregateRating (non vérifiables).
 */
export function serviceJsonLd(opts: { name: string; path: string; description: string; serviceType: string }) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': `${SITE_ORIGIN}${opts.path}#service`,
		name: opts.name,
		serviceType: opts.serviceType,
		description: opts.description,
		url: `${SITE_ORIGIN}${opts.path}`,
		provider: { '@id': `${SITE_ORIGIN}/#business` },
		areaServed: SITE_AREA_SERVED,
		audience: { '@type': 'BusinessAudience', audienceType: 'Entreprises, PME, ETI et organisations' },
		inLanguage: 'fr-FR',
	};
}
