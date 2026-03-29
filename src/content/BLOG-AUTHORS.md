# Rédiger un article de blog

Les billets vivent dans `src/content/blog/*.md` et sont validés par `src/content.config.ts` (schéma Zod).

## Nouvel article

1. Créer un fichier `mon-slug.md` → URL `/blog/mon-slug/`.
2. Frontmatter obligatoire : `title`, `description`, `pubDate`, `readingTimeMinutes`, `tags`, `illustration`.
3. `illustration` : une des valeurs du schéma (voir `content.config.ts`), alignées sur `BlogIllustration.astro`.
4. Corps en Markdown et/ou HTML.

### Piège fréquent (rendu)

En **CommonMark**, des **tabulations ou 4 espaces** en début de ligne font du corps un **bloc de code** : le HTML s’affiche alors comme du texte brut. Évitez d’indenter tout le corps avec des tabulations ; le HTML peut commencer dès la première colonne après le second `---`.

Après modification : `npm run build` (les erreurs Zod signalent un frontmatter invalide).
