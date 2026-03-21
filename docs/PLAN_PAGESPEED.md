# Plan d’action — PageSpeed / Core Web Vitals (suite audit ~91 perf)

Contexte : score **Performance ~91** (mobile, 4G lente), **Accessibilité / BP / SEO à 100**. Métriques observées : **FCP & LCP ~2,6 s**, **SI ~4,3 s**, **TBT & CLS bons**.

---

## 1. Requêtes bloquant le rendu (CSS + Google Fonts) — priorité haute

**Constat** : feuilles CSS Astro + chaîne Google Fonts (CSS → `fonts.gstatic.com` woff2) sur le chemin critique.

**Actions**

| # | Action | Statut |
|---|--------|--------|
| 1.1 | **Auto-héberger Inter** via `@fontsource-variable/inter` (plus de `fonts.googleapis.com` / `gstatic`) | Fait dans le code |
| 1.2 | Garder `font-display: swap` (déjà dans Fontsource) | OK |
| 1.3 | *Option* : si le bundle CSS reste trop critique, étudier **CSS critique** inline (complexe) ou réduction du CSS par page | À évaluer après re-mesure |
| 1.4 | *Option* : **preload** du premier woff2 utilisé — délicat avec noms hashés Vite ; réservé si besoin | Backlog |

---

## 2. Chaîne de requêtes critiques (polices)

**Constat** : enchaînement document → stylesheet Google → fichier de police.

**Actions**

| # | Action | Statut |
|---|--------|--------|
| 2.1 | Suppression de la chaîne externe en passant aux polices **servies depuis votre domaine** | Fait |
| 2.2 | Vérifier en prod que les `.woff2` sont bien servis avec **HTTP/2** (souvent OK chez l’hébergeur) | À contrôler |

---

## 3. Cache navigateur (TTL) — images, CSS, SVG

**Constat** : Lighthouse signale **pas de cache** (ou TTL court) sur `logo-64.png`, CSS `/_astro/…`, `hero-illustration-v2.svg`.

**Actions**

| # | Action | Statut |
|---|--------|--------|
| 3.1 | Fichier **`.htaccess`** (Apache / o2switch) avec `Expires` / `Cache-Control` pour `images/`, `/_astro/`, favicons | Fait (`public/.htaccess` — à déployer) |
| 3.2 | Si **CDN** (Cloudflare, etc.) : aligner règles de cache sur les mêmes types MIME | À faire côté compte CDN |
| 3.3 | Après déploiement, **valider** les en-têtes (`curl -I`) sur une URL CSS et une image | À faire |

---

## 4. Image logo (sur-dimensionnement / format)

**Constat** : `logo-64.png` affiché en **32×32** (~8 Ko) — intérêt du **WebP** + **srcset 1x / 2x** + fichier **32 px** pour l’affichage 1x.

**Actions**

| # | Action | Statut |
|---|--------|--------|
| 4.1 | Composant `<BrandLogo />` avec `<picture>` + **WebP** + **PNG** + `srcset` pour écrans Retina | Fait |
| 4.2 | Script `npm run generate:logos` : ajout **logo-32.webp**, **logo-64.webp**, **logo-128.webp** | Fait |
| 4.3 | Relancer `npm run generate:logos` après chaque changement de `logo.jpeg` | Process |

---

## 5. LCP / hero (page d’accueil)

**Constat** : FCP = LCP sur l’audit — souvent le **hero** (texte ou visuel).

**Actions**

| # | Action | Statut |
|---|--------|--------|
| 5.1 | `rel="preload"` du SVG hero sur la **page d’accueil** via prop `preloadLcpHref` du `Layout.astro` | Fait |
| 5.2 | Garder `fetchpriority="high"` sur l’illustration hero si elle reste au-dessus de la ligne de flottaison | Déjà en place sur l’index |
| 5.3 | Vérifier qu’aucun lazy-load n’est appliqué au LCP | Contrôle manuel |

---

## 6. Suivi

1. Déployer sur **emmanuelsauvage.fr** (`.htaccess` + build).
2. Relancer **PageSpeed** (mobile + bureau) et **Lighthouse** en local sur `npm run build && npm run preview`.
3. Noter l’évolution de **LCP**, **FCP** et **SI**.
4. Sur **o2switch** (Apache), vérifier que **`AllowOverride`** autorise les directives du `.htaccess` (sinon les en-têtes cache ne s’appliquent pas).

---

## Références

- [Optimize LCP](https://web.dev/articles/lcp)  
- [Font best practices](https://web.dev/articles/font-best-practices)  
- [HTTP caching](https://web.dev/articles/http-cache)
