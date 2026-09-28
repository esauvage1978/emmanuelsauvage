/**
 * Témoignages déjà publiés sur le site (page À propos), repris à l'identique.
 * Témoignage de Yann Philippe (Decathlon SAS) : publication autorisée (28/09/2026).
 * TODO (Emmanuel) : confirmer l'autorisation de publication des témoignages Mon Coach Brico et Maître Parafiniuk.
 */
export type Testimonial = {
	quote: string;
	author: string;
	context: string;
	offer: 'formation' | 'applications' | 'sites';
};

export const testimonials: Testimonial[] = [
	{
		quote:
			'Emmanuel a créé de toute pièce un outil qui sert maintenant aux 300 magasins Français. Il a parfaitement su retranscrire notre besoin et s’est encore une fois montré force de proposition. Ses qualités de compréhension et d’adaptation sont impressionnantes. Le projet lancé en France s’exporte maintenant à l’international.',
		author: 'Yann Philippe',
		context: 'Decathlon SAS — France',
		offer: 'applications',
	},
	{
		quote:
			'Je collabore avec ma société Mon Coach Brico depuis 3 ans avec Emmanuel. Il a su s’intéresser au projet et dépasser son rôle initial de développeur. Il construit de son côté ou avec mes collaborateurs les interfaces qu’on lui donne ou qu’il nous propose. Il ne fait pas que développer : il propose des interfaces visuelles et anticipe systématiquement les futurs besoins à venir. Au-delà du côté excellent professionnel, c’est également une belle personne avec qui je prends plaisir à avancer.',
		author: 'Dimitri De Cruz',
		context: 'Mon Coach Brico',
		offer: 'applications',
	},
	{
		quote:
			'Nous avons sollicité Monsieur SAUVAGE, dans le cadre de la création de notre site WEB. Nous sommes extrêmement satisfaits de ses compétences, sa réactivité, sa patience et son analyse. Il est de très bon conseil. Je recommande vivement Monsieur SAUVAGE, expert dans son domaine.',
		author: 'Maître Iwona Parafiniuk',
		context: 'Création du site du cabinet',
		offer: 'sites',
	},
];

/** Note Malt vérifiée le 28/09/2026 (5,0/5 sur 5 évaluations). À mettre à jour si le nombre d'avis évolue. */
export const maltRating = { label: '5/5 sur Malt (5 avis)', short: '5/5 sur Malt' };

/**
 * Note Google (fiche Business Profile) vérifiée le 28/09/2026 : 5,0/5, 7 avis (tous 5 étoiles).
 * À mettre à jour si le nombre d'avis évolue. Pas d'aggregateRating en JSON-LD (avis hébergés chez Google).
 */
export const googleRating = { label: '5,0/5 sur Google (7 avis)', value: '5,0/5', count: '7 avis' };
