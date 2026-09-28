/** Données réutilisables de la page d'accueil. */

export type HomeProof = {
	value: string;
	label: string;
	icon: 'experience' | 'stores' | 'apps' | 'pagespeed' | 'train' | 'star';
	href?: string;
	external?: boolean;
};

export type HomeOfferCard = {
	kicker: string;
	title: string;
	text: string;
	href: string;
	linkLabel: string;
	icon: 'train' | 'app' | 'website';
	/** Valeur du paramètre ?offre= pour présélectionner l'objet du formulaire de contact. */
	offre: 'formation' | 'application' | 'site';
};

export type HomeService = {
	title: string;
	description: string;
	points: string[];
	meta: string;
	href: string;
	linkLabel: string;
	icon: 'automation' | 'data' | 'app' | 'workspace' | 'website' | 'train';
};

export type HomeMethodStep = {
	step: number;
	title: string;
	description: string;
};

export type HomePortfolioItem = {
	name: string;
	description: string;
	tag: string;
	/** Optionnel : sans logo, la carte affiche le nom seul (pas de nouvel usage de logo sans autorisation). */
	logo?: string;
	/** Logo compact (proche du carré) : affiché plus haut pour rester lisible. */
	square?: boolean;
	href?: string;
};

/** Logo client (bandeau défilant, hero). */
export type HomeClientLogo = {
	name: string;
	logo: string;
	/** Logo compact (proche du carré) : affiché plus haut. */
	square?: boolean;
	/** Logotype très allongé : affiché plus large et moins haut. */
	wide?: boolean;
};

export type HomeFaqItem = {
	question: string;
	answer: string;
};

export const homeMeta = {
	title: 'Emmanuel Sauvage – Formation Google Sheets & dev, Lille',
	description:
		'Formation Google Sheets en entreprise (finançable OPCO), applications métier sur mesure et sites web rapides. Formateur-développeur près de Lille.',
};

export const hero = {
	/** Sur-titre intégré au H1 (SEO) : nom, métier et localisation. */
	eyebrow: ['Emmanuel Sauvage', 'Formateur Google Sheets & développeur', 'Lille'],
	h1: 'Formation Google Sheets, applications sur mesure et sites web pour les entreprises',
	tagline: 'Du tableur à l’application : un seul interlocuteur pour former vos équipes, automatiser vos fichiers et développer vos outils.',
	subtitle:
		'Formations Google Sheets en entreprise, finançables OPCO via notre organisme partenaire certifié Qualiopi. Applications métier développées plus vite grâce à l’IA, par un développeur en activité depuis 2002. Sites rapides et bien référencés. Près de Lille, en présentiel ou à distance.',
	primaryCta: { label: 'Parler de mon projet', href: '/contact/' },
	secondaryCta: { label: 'Voir les programmes de formation', href: '/formation-google-sheets/' },
	tertiaryLink: { label: 'Voir les réalisations', href: '/realisations/' },
	/* TODO (Emmanuel) : remplacer cette photo d’illustration (Unsplash) par une vraie photo professionnelle. */
	photo: {
		src: '/images/hero-illustration-unsplash-2-662.jpg',
		srcsetWebp:
			'/images/hero-illustration-unsplash-2-480.webp 480w, /images/hero-illustration-unsplash-2-662.webp 662w, /images/hero-illustration-unsplash-2-1000.webp 1000w',
		srcsetJpeg:
			'/images/hero-illustration-unsplash-2-480.jpg 480w, /images/hero-illustration-unsplash-2-662.jpg 662w, /images/hero-illustration-unsplash-2-1000.jpg 1000w',
		sizes: '(max-width: 520px) calc(100vw - 32px), (max-width: 979px) calc(100vw - 48px), 520px',
		alt: 'Personne analysant un tableau de bord sur un ordinateur portable (photo d’illustration).',
		width: 1000,
		height: 667,
	},
};

export const offerCards: HomeOfferCard[] = [
	{
		kicker: 'Former mes équipes',
		title: 'Formation Google Sheets',
		text: 'Des débutants aux experts, sur vos propres fichiers, en présentiel ou à distance. Finançable OPCO via notre organisme partenaire certifié Qualiopi.',
		href: '/formation-google-sheets/',
		linkLabel: 'Voir les programmes',
		icon: 'train',
		offre: 'formation',
	},
	{
		kicker: 'Développer mon outil',
		title: 'Applications sur mesure',
		text: 'Remplacez vos fichiers par une application métier sur mesure, ou automatisez vos Google Sheets avec Apps Script.',
		href: '/developpement-application-sur-mesure/',
		linkLabel: 'Découvrir l’offre',
		icon: 'app',
		offre: 'application',
	},
	{
		kicker: 'Créer mon site',
		title: 'Sites internet',
		text: 'Un site vitrine rapide, bien référencé à Lille et Armentières, pensé pour vous amener des demandes.',
		href: '/creation-site-internet/',
		linkLabel: 'Voir l’offre sites',
		icon: 'website',
		offre: 'site',
	},
];

/*
 * Bandeau de preuves : uniquement des éléments vérifiables ou déjà publiés.
 * « Plus de 300 magasins » : profil Malt (Decathlon France et Europe), autorisation Decathlon obtenue (28/09/2026).
 * Note Google (5,0/5, 7 avis) vérifiée le 28/09/2026 : à tenir à jour.
 * TODO (Emmanuel) : date de début du mentorat OpenClassrooms ; re-mesurer les scores PageSpeed avant publication.
 */
export const proofs: HomeProof[] = [
	{ value: '300+', label: 'magasins Decathlon (France et Europe) équipés de mes outils Google Sheets', icon: 'stores' },
	{ value: 'Depuis 2002', label: 'dans le développement', icon: 'experience' },
	{ value: '5,0/5', label: 'sur Google (7 avis)', icon: 'star', href: 'GOOGLE', external: true },
	{ value: '100/100', label: 'PageSpeed mesuré sur des sites livrés', icon: 'pagespeed', href: '/creation-site-internet/#performance' },
	{ value: 'Mentor', label: 'OpenClassrooms', icon: 'train' },
];

export const clientLogoStrip: HomeClientLogo[] = [
	{ name: 'Decathlon', logo: '/images/partners/decathlon.svg' },
	{ name: 'Mon Coach Brico', logo: '/images/partners/mon-coach-brico.png' },
	{ name: 'YEED Group', logo: '/images/partners/yeed-group.svg' },
	{ name: 'OpenClassrooms', logo: '/images/partners/openclassrooms.png', wide: true },
	{ name: 'HFE Énergie', logo: '/images/partners/hfe-energie.png', square: true },
	{ name: 'EDAME', logo: '/images/partners/edame.png', square: true },
	{ name: 'Cabinet Parafiniuk-Leroy', logo: '/images/partners/cabinet-parafiniuk.png', wide: true },
	{ name: 'Mon Coach Jardin', logo: '/images/partners/mon-coach-jardin.png' },
];

export const situations = {
	title: 'Vous vous reconnaissez ?',
	lede: 'Trois situations que je rencontre souvent, et la réponse adaptée à chacune.',
	items: [
		{
			title: 'Vos équipes ne sont pas à l’aise avec Google Sheets',
			text: 'Formules recopiées sans être comprises, erreurs de saisie, fichiers qui cassent, dépendance à « la personne qui sait », migration récente depuis Excel…',
			answer: 'Former vos équipes',
			href: '/formation-google-sheets/',
			icon: 'train',
		},
		{
			title: 'Vos fichiers sont devenus ingérables',
			text: 'Versions multiples, ressaisies, reporting manuel, aucun droit par rôle : vos tableurs font office de logiciel, sans en avoir la fiabilité.',
			answer: 'Automatiser ou développer votre outil',
			href: '/developpement-application-sur-mesure/',
			icon: 'app',
		},
		{
			title: 'Votre site est invisible ou lent',
			text: 'Peu de visites, pas de demandes de devis, un site lent sur mobile ou coûteux à maintenir : il ne travaille pas pour vous.',
			answer: 'Créer ou refaire votre site',
			href: '/creation-site-internet/',
			icon: 'website',
		},
	],
};

/*
 * Cas Decathlon en quelques lignes (source : mission « Suivi Bilan SST » publiée sur le profil Malt,
 * chiffres repris de cette description). Publication autorisée par Decathlon (28/09/2026).
 */
export const caseStudy = {
	eyebrow: 'Étude de cas',
	title: 'Decathlon : du fichier par magasin au reporting automatique',
	lines: [
		{ label: 'Le besoin', text: 'Collecter un bilan dans chaque magasin, puis consolider et diffuser les résultats, jusque-là à la main.' },
		{
			label: 'La solution',
			text: 'Un Google Sheets par magasin déployé automatiquement par Apps Script, une consolidation centrale et un tableau de bord d’avancement.',
		},
		{
			label: 'L’automatisation',
			text: 'Une présentation Google Slides générée automatiquement pour chaque magasin et chaque région.',
		},
		{
			label: 'Le résultat',
			text: 'Une opération qui prenait 1 à 2 journées par magasin se réalise désormais en 5 minutes.',
		},
	],
	link: { label: 'Lire les réalisations', href: '/realisations/' },
};

export const services = {
	title: 'Trois offres, un même fil : des outils qui servent vraiment',
	items: [
		{
			title: 'Formation Google Sheets en entreprise',
			description: 'Des programmes par niveau, animés sur vos propres fichiers, en présentiel dans vos locaux (Lille et Hauts-de-France) ou à distance.',
			points: [
				'Fondamentaux, niveau avancé, tableaux de bord',
				'Passer d’Excel à Google Sheets',
				'Apps Script : automatiser Google Sheets',
			],
			meta: 'Finançable OPCO via notre organisme partenaire certifié Qualiopi',
			href: '/formation-google-sheets/',
			linkLabel: 'Voir les programmes',
			icon: 'train',
		},
		{
			title: 'Applications métier et automatisation',
			description:
				'Un développeur senior qui s’appuie sur l’IA pour livrer plus vite, avec un code testé qui vous appartient.',
			points: [
				'Automatisation Google Sheets et Apps Script',
				'Back-offices, outils de gestion, portails, API',
				'Refonte, maintenance et renfort Symfony',
			],
			meta: 'Cadrage, prototype, V1 puis évolutions',
			href: '/developpement-application-sur-mesure/',
			linkLabel: 'Découvrir l’offre',
			icon: 'app',
		},
		{
			title: 'Création de sites internet',
			description: 'Des sites vitrines rapides et bien référencés, pensés pour générer des demandes.',
			points: [
				'Sites vitrines Astro, sans plugins à maintenir',
				'SEO local (Lille, Armentières, métropole)',
				'Formulaires connectés (e-mail, Google Sheets, CRM)',
			],
			meta: 'Création ou refonte, sur devis',
			href: '/creation-site-internet/',
			linkLabel: 'Voir l’offre sites',
			icon: 'website',
		},
	] satisfies HomeService[],
};

export const method = {
	title: 'Du tableur à l’application',
	lede: 'Selon votre besoin, on s’arrête à la première étape… ou on va jusqu’au bout, avec le même interlocuteur.',
	steps: [
		{
			step: 1,
			title: 'Former',
			description: 'Vos équipes maîtrisent Google Sheets et fiabilisent leurs fichiers au quotidien.',
			href: '/formation-google-sheets/',
		},
		{
			step: 2,
			title: 'Automatiser',
			description: 'Apps Script prend le relais des tâches répétitives : collecte, consolidation, rapports, e-mails.',
			href: '/automatisation-google-sheets/',
		},
		{
			step: 3,
			title: 'Développer',
			description: 'Quand le tableur atteint ses limites, une application métier sur mesure prend le relais.',
			href: '/developpement-application-sur-mesure/',
		},
	],
};

export const portfolio = {
	title: 'Quelques réalisations',
	items: [
		{
			name: 'Decathlon',
			description:
				'Outils Google Sheets et Apps Script : collecte multisite, Google Slides générés automatiquement, prévisionnels de stock multilingues.',
			tag: 'Outils Sheets & Apps Script',
			logo: '/images/partners/decathlon.svg',
		},
		{
			name: 'Mon Coach Brico',
			description: 'Développement du back-office et d’interfaces, dans le cadre d’une collaboration de 3 ans.',
			tag: 'Application métier',
			logo: '/images/partners/mon-coach-brico.png',
		},
		{
			name: 'HFE Énergie',
			description: 'Site vitrine d’un installateur de pompes à chaleur à Lille : SEO local, avis Google et formulaire de devis.',
			tag: 'Site internet',
			logo: '/images/partners/hfe-energie.png',
			square: true,
		},
		{
			name: 'Cabinet Beligat',
			description: 'Site d’un cabinet de pédicures-podologues à Armentières, avec prise de rendez-vous Doctolib.',
			tag: 'Site internet',
		},
		{
			name: 'EDAME',
			description: 'Site d’une éducatrice spécialisée : présentation de l’offre, blog, FAQ et formulaire de contact.',
			tag: 'Site internet',
			logo: '/images/partners/edame.png',
			square: true,
		},
	] satisfies HomePortfolioItem[],
	allLink: { label: 'Voir toutes les réalisations', href: '/realisations/' },
};

export const zone = {
	title: 'Près de Lille, et partout en France à distance',
	text: 'Basé à Erquinghem-Lys (59193), j’interviens en présentiel à Lille, Armentières et dans la métropole lilloise, en Flandre intérieure et dans l’Artois proche. Les formations et les projets se déroulent aussi entièrement à distance, partout en France.',
	places: ['Lille', 'Armentières', 'Erquinghem-Lys', 'Métropole européenne de Lille', 'Hauts-de-France', 'France entière à distance'],
};

export const faqItems: HomeFaqItem[] = [
	{
		question: 'La formation Google Sheets est-elle finançable par notre OPCO ?',
		answer:
			'Oui : les formations sont dispensées via notre organisme partenaire certifié Qualiopi, ce qui permet une prise en charge par votre OPCO selon ses règles et la taille de votre entreprise. Je vous accompagne dans la demande.',
	},
	{
		question: 'Pouvez-vous former mes équipes sur nos propres fichiers ?',
		answer:
			'Oui, c’est même recommandé : les exercices s’appuient sur vos fichiers (anonymisés si besoin), pour que chacun reparte avec des acquis directement applicables.',
	},
	{
		question: 'Combien coûte une application métier sur mesure ?',
		answer:
			'Le tarif est sur devis : il dépend du périmètre, des intégrations et du nombre d’utilisateurs. Un cadrage permet d’estimer précisément la première version avant de vous engager.',
	},
	{
		question: 'Comment l’IA accélère-t-elle le développement ?',
		answer:
			'L’IA accélère le code répétitif, les tests, les prototypes et la documentation. L’architecture, la sécurité, les règles métier et la revue du code restent faites par moi. Le code vous appartient et aucune donnée client n’est envoyée à une IA sans votre accord.',
	},
	{
		question: 'Créez-vous des sites rapides et optimisés pour le SEO ?',
		answer:
			'Oui, avec Astro : des pages statiques très légères, un balisage propre et des données structurées. Les sites livrés visent 100/100 sur PageSpeed et sont pensés pour le référencement local.',
	},
	{
		question: 'Intervenez-vous dans nos locaux ?',
		answer:
			'Oui : les formations et les projets se déroulent en présentiel dans vos locaux (Lille et Hauts-de-France) ou à distance, partout en France.',
	},
];

export const faqSection = {
	title: 'Questions fréquentes',
	previewCount: 6,
	allLink: { label: 'Voir toutes les questions', href: '/#faq-all' },
};

export const articlesSection = {
	title: 'Derniers articles',
	allLink: { label: 'Voir tous les articles', href: '/blog/' },
};

export const finalCta = {
	title: 'Un projet de formation, d’application ou de site ?',
	text: 'Décrivez votre contexte en quelques lignes : je vous réponds avec une première orientation, sans engagement.',
	button: { label: 'Parler de mon projet', href: '/contact/' },
	/* TODO (Emmanuel) : confirmer ce délai de réponse (déjà indiqué sur la page À propos). */
	note: 'Réponse en général sous 24 à 48 h ouvrées',
	/* TODO (Emmanuel) : remplacer par une vraie photo. */
	photo: {
		src: '/images/hero-illustration-unsplash-2-480.jpg',
		alt: 'Photo d’illustration : tableau de bord sur un ordinateur portable',
	},
};

export const footerColumns = {
	services: [
		{ label: 'Formation Google Sheets', href: '/formation-google-sheets/' },
		{ label: 'Formation Apps Script', href: '/formation-apps-script/' },
		{ label: 'Automatisation Google Sheets', href: '/automatisation-google-sheets/' },
		{ label: 'Application sur mesure', href: '/developpement-application-sur-mesure/' },
		{ label: 'Développeur Symfony', href: '/developpeur-symfony-freelance/' },
		{ label: 'Création de site internet', href: '/creation-site-internet/' },
	],
	resources: [
		{ label: 'Réalisations', href: '/realisations/' },
		{ label: 'Blog', href: '/blog/' },
		{ label: 'FAQ', href: '/#faq' },
	],
	about: [
		{ label: 'À propos', href: '/a-propos/' },
		{ label: 'Services', href: '/services/' },
		{ label: 'Mentions légales', href: '/mentions-legales/' },
	],
	contact: [
		{ label: 'Formulaire de contact', href: '/contact/' },
		{ label: 'contact@emmanuelsauvage.fr', href: 'mailto:contact@emmanuelsauvage.fr' },
		{ label: '06 09 92 49 45', href: 'tel:+33609924945' },
	],
};
