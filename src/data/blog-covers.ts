/** Vignettes blog — photos Unsplash (licence Unsplash). Téléchargées via `node scripts/download-blog-covers.mjs`. */

export type BlogCover = {
	alt: string;
	/** Crédit affiché (accessibilité / mentions). */
	credit: string;
	/** Chemin public après téléchargement. */
	src: string;
};

/** Clé = slug de l’article (id collection `blog`). */
export const blogCovers: Record<string, BlogCover> = {
	'freelance-vs-agence-vs-internalisation-projets-tech': {
		alt: 'Réunion d’équipe autour d’un tableau de priorités',
		credit: 'Campaign Creators / Unsplash',
		src: '/images/blog/freelance-vs-agence-vs-internalisation-projets-tech.webp',
	},
	'cout-dette-technique-entreprise-analyse': {
		alt: 'Graphiques et indicateurs sur écran',
		credit: 'Luke Chesser / Unsplash',
		src: '/images/blog/cout-dette-technique-entreprise-analyse.webp',
	},
	'application-web-perd-argent-signes': {
		alt: 'Analyse de performance sur ordinateur portable',
		credit: 'Carlos Muza / Unsplash',
		src: '/images/blog/application-web-perd-argent-signes.webp',
	},
	'fichiers-excel-cout-cache-entreprise': {
		alt: 'Tableur et calculs sur ordinateur',
		credit: 'Mika Baumeister / Unsplash',
		src: '/images/blog/fichiers-excel-cout-cache-entreprise.webp',
	},
	'automatiser-entreprise-google-workspace-gains-cas': {
		alt: 'Espace de travail collaboratif moderne',
		credit: 'Corinne Kutz / Unsplash',
		src: '/images/blog/automatiser-entreprise-google-workspace-gains-cas.webp',
	},
	'migration-symfony-guide-complet-2026': {
		alt: 'Lignes de code sur moniteur',
		credit: 'Arnold Francisca / Unsplash',
		src: '/images/blog/migration-symfony-guide-complet-2026.webp',
	},
	'formation-google-sheets-entreprise-levier-productivite': {
		alt: 'Équipe en session de travail collaboratif',
		credit: 'You X Ventures / Unsplash',
		src: '/images/blog/formation-google-sheets-entreprise-levier-productivite.webp',
	},
	'automatiser-processus-metier-google-apps-script-entreprise': {
		alt: 'Automatisation de workflow sur ordinateur',
		credit: 'Kelly Sikkema / Unsplash',
		src: '/images/blog/automatiser-processus-metier-google-apps-script-entreprise.webp',
	},
	'refonte-application-web-signaux-strategie-dette-technique': {
		alt: 'Planification stratégique avec notes et laptop',
		credit: 'Scott Graham / Unsplash',
		src: '/images/blog/refonte-application-web-signaux-strategie-dette-technique.webp',
	},
	'google-sheets-vs-excel-limites-cas-usage': {
		alt: 'Documents et tableur sur bureau',
		credit: 'Adeolu Eletu / Unsplash',
		src: '/images/blog/google-sheets-vs-excel-limites-cas-usage.webp',
	},
	'site-vitrine-astro-zapier-mailjet': {
		alt: 'Développement web sur ordinateur',
		credit: 'Christina @ wocintechchat.com / Unsplash',
		src: '/images/blog/site-vitrine-astro-zapier-mailjet.webp',
	},
	'monolithe-modulaire-symfony-frontieres': {
		alt: 'Structure modulaire et organisation visuelle',
		credit: 'freestocks / Unsplash',
		src: '/images/blog/monolithe-modulaire-symfony-frontieres.webp',
	},
	'google-sheets-limite-outil-metier': {
		alt: 'Feuille de calcul ouverte sur laptop',
		credit: 'Stephen Dawson / Unsplash',
		src: '/images/blog/google-sheets-limite-outil-metier.webp',
	},
	'symfony-refonte-ou-evolutions-ciblees': {
		alt: 'Code source PHP sur écran',
		credit: 'Maximalfocus / Unsplash',
		src: '/images/blog/symfony-refonte-ou-evolutions-ciblees.webp',
	},
	'validation-api-symfony-contraintes-reelles': {
		alt: 'Planification et notes sur bureau',
		credit: 'Scott Graham / Unsplash',
		src: '/images/blog/validation-api-symfony-contraintes-reelles.webp',
	},
	'versionner-api-rest-symfony': {
		alt: 'Développeur au travail sur ordinateur portable',
		credit: 'Austin Distel / Unsplash',
		src: '/images/blog/versionner-api-rest-symfony.webp',
	},
};

/** IDs Unsplash (photo-XXX) pour le script de téléchargement. */
export const blogCoverUnsplashIds: Record<string, string> = {
	'freelance-vs-agence-vs-internalisation-projets-tech': '1552664730-d307ca884978',
	'cout-dette-technique-entreprise-analyse': '1551288049-bebda4e38f71',
	'application-web-perd-argent-signes': '1460925895917-afdab827c52f',
	'fichiers-excel-cout-cache-entreprise': '1554224155-6726b3ff858f',
	'automatiser-entreprise-google-workspace-gains-cas': '1497366216548-37526070297c',
	'migration-symfony-guide-complet-2026': '1555066931-4365d14bab8c',
	'formation-google-sheets-entreprise-levier-productivite': '1522202176988-66273c2fd55f',
	'automatiser-processus-metier-google-apps-script-entreprise': '1553877522-43269d4ea984',
	'refonte-application-web-signaux-strategie-dette-technique': '1454165804606-c3d57bc86b40',
	'google-sheets-vs-excel-limites-cas-usage': '1450101499163-c8848c66ca85',
	'site-vitrine-astro-zapier-mailjet': '1547658719-da2b51169166',
	'monolithe-modulaire-symfony-frontieres': '1563013544-824ae1b704d3',
	'google-sheets-limite-outil-metier': '1586281380349-632531db7ed4',
	'symfony-refonte-ou-evolutions-ciblees': '1516321318423-f06f85e504b3',
	'validation-api-symfony-contraintes-reelles': '1454165804606-c3d57bc86b40',
	'versionner-api-rest-symfony': '1557804506-669a67965ba0',
};

export function getBlogCover(slug: string): BlogCover | undefined {
	return blogCovers[slug];
}
