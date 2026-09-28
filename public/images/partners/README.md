# Logos partenaires

Les fichiers de ce dossier sont utilisés par `PartnersLogos.astro` (`/images/partners/*`).

- **OpenClassrooms** : fichier **`openclassrooms.png`** (remplacez le fichier par votre logo si besoin).

- Les **SVG avec texte** peuvent être partiellement invisibles selon le navigateur lorsqu’ils sont chargés en `<img>` : le **nom de la structure** est donc aussi affiché sous le visuel dans le composant.
- Pour un rendu 100 % vectoriel dans l’image, exportez le logo avec le **texte converti en courbes** (outlines).

Dimensions recommandées : largeur max ~220px, hauteur ~56px, fond transparent.

## Logos clients de l’accueil

`mon-coach-brico.png`, `hfe-energie.png`, `edame.png`, `mon-coach-jardin.png`, `cabinet-parafiniuk.png` et `openclassrooms.png` sont générés par `npm run generate:partners` à partir des logos officiels rangés dans `src/assets/partners-src/` (sources et URL d’origine dans `scripts/generate-partner-logos.mjs`). Ne pas utiliser de capture d’écran de site comme logo.
