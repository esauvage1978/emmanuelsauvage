/** Lien court Google pour laisser un avis (Business Profile / partage Google). */
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CawB00LcHY7jEAE/review';

/** Fiche Google (Business Profile) : consultation des avis. */
export const GOOGLE_PROFILE_URL = 'https://www.google.com/maps?cid=16397076125153690028';

/** Profil public Malt (freelance). */
export const MALT_PROFILE_URL = 'https://www.malt.fr/profile/emmanuelsauvage1';

/** Profil LinkedIn. */
export const LINKEDIN_URL = 'https://www.linkedin.com/in/emmanuelsauvage1978/';

/** URL canonique du site (SEO, JSON-LD). */
export const SITE_ORIGIN = 'https://emmanuelsauvage.fr';

/** Nom public du site / de l'entité principale. */
export const SITE_NAME = 'Emmanuel SAUVAGE';

/** Description courte réutilisée par les métadonnées globales et schema.org. */
export const SITE_DESCRIPTION =
	'Formateur Google Sheets et développeur près de Lille : formation en entreprise, automatisation, applications métier sur mesure et sites web.';

export const SITE_EMAIL = 'contact@emmanuelsauvage.fr';

export const SITE_TELEPHONE = '+33609924945';

/** Logo raster (PNG) : les moteurs et réseaux sociaux lisent mal le SVG dans schema.org / Open Graph. */
export const SITE_LOGO_URL = `${SITE_ORIGIN}/images/logo-512.png`;

/** Marque courte utilisée en suffixe des balises <title> (si la place le permet, ≤ 60 caractères au total). */
export const SITE_BRAND = 'Emmanuel Sauvage';

/** Image de partage par défaut (Open Graph / Twitter), 1200×630 PNG — générée par `npm run generate:og`. */
export const SITE_OG_IMAGE = {
	url: `${SITE_ORIGIN}/images/og/default.png`,
	width: 1200,
	height: 630,
	alt: 'Emmanuel Sauvage — formation Google Sheets, applications sur mesure et sites web, près de Lille',
};

export const SITE_SAME_AS = [LINKEDIN_URL, MALT_PROFILE_URL, GOOGLE_PROFILE_URL];

export const SITE_ADDRESS = {
	'@type': 'PostalAddress',
	addressLocality: 'Erquinghem-Lys',
	postalCode: '59193',
	addressRegion: 'Hauts-de-France',
	addressCountry: 'FR',
};

/** Zone d’intervention (schema.org areaServed) : métropole lilloise en priorité, France à distance. */
export const SITE_AREA_SERVED = [
	{ '@type': 'City', name: 'Lille' },
	{ '@type': 'City', name: 'Armentières' },
	{ '@type': 'City', name: 'Erquinghem-Lys' },
	{ '@type': 'AdministrativeArea', name: 'Métropole européenne de Lille' },
	{ '@type': 'AdministrativeArea', name: 'Hauts-de-France' },
	{ '@type': 'Country', name: 'France' },
];

/**
 * Ajoute la marque en suffixe du <title> seulement si le total tient en 60 caractères
 * (au-delà, Google tronque : on garde alors le titre seul).
 */
export function withBrand(title: string, max = 60): string {
	const full = `${title} | ${SITE_BRAND}`;
	return full.length <= max ? full : title;
}
