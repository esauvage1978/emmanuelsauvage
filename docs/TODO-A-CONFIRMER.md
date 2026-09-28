# Points à confirmer avant publication (refonte « Du tableur à l’application »)

Mise à jour du 28/09/2026 après les réponses d’Emmanuel. Chaque point restant correspond à un commentaire
`TODO (Emmanuel)` dans le code (`rg "TODO" src`).

## Réglé le 28/09/2026 (pour mémoire)
- CPF : aucune certification éligible, le CPF n’est mentionné nulle part.
- Decathlon : nom, deux études de cas, témoignage de Yann Philippe et logo autorisés. Chiffres affichés uniquement
  depuis le profil Malt : « 1 à 2 journées par magasin → 5 minutes », « plus de 300 magasins » (France et Europe).
- Avis : note Google vérifiée le 28/09/2026 sur la fiche publique (5,0/5, 7 avis), affichée avec un lien vers la
  fiche ; note Malt (5/5, 5 avis) conservée à côté. Pas d’aggregateRating en JSON-LD.
- Expérience : « depuis 2002 » / « plus de 20 ans » et « 15+ applications » confirmés.
- Tarifs : tout est sur devis ; toutes les fourchettes de prix ont été retirées (dont 5 000–15 000 €, le TJM indicatif
  d’un article et le taux horaire des CGV). Pas de prix dans le balisage schema.org (priceRange retiré).
- Produits SaaS : Webhooky, AlertJet et LnkX présentés sur /realisations/#saas (mention sur /a-propos/ et la page
  applications). PACFLOW n’est pas mentionné.
- Formations : « en présentiel dans vos locaux (Lille et Hauts-de-France) ou à distance » harmonisé.

## Reste à confirmer

### Formation (organisme partenaire Qualiopi)
- [ ] Nom, lien et catégorie de certification de l’organisme partenaire. En attendant, formulation générique :
      « Finançable OPCO via notre organisme partenaire certifié Qualiopi ». Aucun logo Qualiopi.
- [ ] Mentions à ajouter une fois le partenaire connu : « Formation dispensée en partenariat avec [organisme], certifié
      Qualiopi au titre des actions de formation ».
- [ ] Qui facture, qui signe la convention, quels documents sont remis (attestation, émargement).
- [ ] Modules N1 / N2 / N3 / Excel → Sheets / Apps Script : contenus, durées, formats, inter-entreprises ou non,
      nombre maximal de participants. Fiches programme PDF.
- [ ] Délais d’accès, référent handicap, indicateurs de résultats, support après formation.
- [ ] Bouton « Tester mon niveau » : à ajouter quand le test existera.
- [ ] Balisage `Course` : possible seulement une fois l’organisme partenaire connu (seul `Service` est déclaré).

### Parcours et chiffres
- [ ] Mentorat OpenClassrooms : date de début, nombre d’étudiants. Intitulés et années du parcours CNAM.
- [ ] Délai de réponse « en général sous 24 à 48 h ouvrées ».
- [ ] « Pas de dépannage pour les particuliers » (page À propos).
- [ ] Délais indicatifs : cadrage 1 à 3 jours, automatisation 1 à 4 semaines, V1 2 à 6 mois.
- [ ] Notes Google (5,0/5, 7 avis) et Malt (5/5, 5 avis) : à tenir à jour quand de nouveaux avis arrivent.

### Clients, cas et témoignages
- [ ] Autorisation des témoignages Mon Coach Brico (Dimitri De Cruz) et Maître Parafiniuk.
- [ ] Accord des clients des sites (HFE, Beligat, EDAME, cabinet Parafiniuk-Leroy) ; scores PageSpeed à re-mesurer ;
      résultats avant/après si disponibles.
- [ ] Mon Coach Brico : captures, périmètre, chiffres du back-office.
- [ ] YEED Group (migration Microsoft 365) : à présenter ou non.
- [ ] Sections « Cas type » supprimées (refonte, Symfony) : les remplacer par de vraies missions citables.

### Produits SaaS
- [ ] Mentions légales d’alertjet.fr : les champs entre crochets (dénomination, adresse, SIREN…) ne sont pas remplis.
- [ ] LnkX : aucune mention d’éditeur visible sur lnkx.link (à ajouter pour cohérence avec Webhooky).

### Offres
- [ ] IA : outils utilisés, politique de confidentialité des données clients. Aucun pourcentage de gain affiché.
- [ ] Sites : hébergement et maintenance inclus ou non, CMS, délais, propriété du site et du nom de domaine.

### Visuels
- [ ] Nouvelle photo professionnelle (accueil, À propos, bloc final) : la photo d’illustration actuelle reste en place.

### Technique
- [ ] Formulaire de contact : les valeurs de `objet` sont `formation`, `application`, `site`, `autre` (et
      `project_type` a changé). Vérifier les filtres Zapier / Webhooky qui s’appuient sur les anciennes valeurs.
- [x] Tranches de budget (« < 3 k€ » à « 50 k€ et + ») retirées du formulaire de contact sur décision d’Emmanuel
      (28/09/2026) : champ `budget_range` supprimé du formulaire. Le relais `contact-zapier.php` transmet encore
      `budget_range` (vide) et `budget_range_label` (« — ») à Webhooky : retirer « Budget envisagé » des modèles
      Mailjet et du mapping Zapier / Webhooky le cas échéant.
- [ ] CGV : le taux horaire (72 € HT) a été remplacé par « communiqué sur demande avant toute intervention ».
      Vérifier que cette formulation vous convient juridiquement.
