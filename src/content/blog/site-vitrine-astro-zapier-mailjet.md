---
title: "Création de ce site vitrine : Astro (SSG), Zapier et Mailjet — sans surcouche serveur inutile"
shortTitle: "Site vitrine Astro, Zapier et Mailjet"
description: "Retour d’expérience sur la stack du site emmanuelsauvage.fr : génération statique, blog en Markdown (content collections + Zod), formulaire contact via proxy, Zapier et Mailjet (MJML)."
pubDate: 2026-03-19
updatedDate: 2026-03-22
readingTimeMinutes: 16
tags:
  - "Astro"
  - "Zapier"
  - "Mailjet"
  - "Architecture web"
illustration: vitrine
---
<aside class="tldr">
<strong>En bref</strong>
Ce site est un projet <strong>Astro 6</strong> en <strong>sortie statique (SSG)</strong> : pages HTML pré-générées,
peu de JavaScript côté client, bonnes bases SEO et déploiement simple (fichiers dans
<code>dist/</code> sur un hébergement classique). Le <strong>blog</strong> est rédigé en <strong>Markdown</strong>
avec <strong>content collections</strong> (schéma Zod au build). Le formulaire de contact n’appelle pas un backend
maison : le navigateur envoie un JSON en <strong>same-origin</strong> vers un <strong>proxy léger</strong> (Vite en
dev, PHP en prod) qui relaie vers un <strong>Webhooks by Zapier — Catch Hook</strong>, puis <strong>Mailjet</strong>
pour l’email transactionnel et la délivrabilité.
</aside>

<h2>Objectifs du projet</h2>
<p>
Présenter une offre freelance (Symfony, API, data, outils métier), publier des <strong>articles techniques</strong>
indexables, et offrir un <strong>contact fiable</strong> sans maintenir un serveur d’applications PHP ou Node pour un
simple formulaire. Contraintes : temps de chargement correct, mise en page maîtrisée, conformité RGPD (politique,
consentement, pas de trackers non essentiels par défaut).
</p>

<h2>Pourquoi Astro plutôt qu’un « gros » framework SPA ?</h2>
<p>
Les applications monopage (React/Vue seuls) envoient souvent un bundle volumineux avant que le contenu ne soit lisible.
Pour une <strong>vitrine</strong> et un blog majoritairement lecture, l’intérêt est faible : on veut du HTML
servi tout de suite, du CSS cohérent, et du JS uniquement là où c’est utile (formulaire, bandeau cookies, petites
interactions).
</p>
<p>
<strong>Astro</strong> part de cette idée : par défaut, <strong>zéro JavaScript côté navigateur</strong> pour les
composants ; les composants peuvent rester en HTML pur. Si besoin d’interactivité, on opte pour des
<strong>îlots (islands)</strong> avec une framework UI au choix, ou du script inline ciblé — comme sur la page contact.
</p>
<ul>
<li>
<strong>SSG</strong> : <code>astro build</code> produit des fichiers statiques ; pas de runtime Node obligatoire en
production.
</li>
<li>
<strong>Routing par fichiers</strong> : <code>src/pages/</code> → URLs prévisibles (<code>/blog/</code>,
<code>/contact/</code>, etc.).
</li>
<li>
<strong>Composants réutilisables</strong> (<code>.astro</code>) : en-tête, pied, cartes, mise en page article — même
syntaxe pour tout le site.
</li>
<li>
<strong>SEO</strong> : balises <code>&lt;title&gt;</code>, meta description, canonical et données structurées
(JSON-LD) injectées par layout.
</li>
</ul>

<h2>Ce que contient concrètement le dépôt</h2>
<ul>
<li>
<code>src/pages/</code> : les routes (accueil, services, à propos, contact, pages légales, <code>blog/index.astro</code> pour la liste, <code>blog/[slug].astro</code> pour générer une page par article).
</li>
<li><code>src/layouts/</code> : gabarit global et gabarit article (titre, temps de lecture, JSON-LD blog).</li>
<li><code>src/components/</code> : navigation, pied de page, illustrations blog, bandeau cookies, etc.</li>
<li>
<code>src/content/blog/*.md</code> + <code>src/content.config.ts</code> : collection <code>blog</code> (loader <code>glob</code>, schéma Zod sur le frontmatter : titre, description, dates, temps de lecture, tags, clé <code>illustration</code> pour le schéma SVG).
</li>
<li>
<code>src/content/BLOG-AUTHORS.md</code> : rappel pour ajouter un nouvel article (fichier <code>.md</code>, champs obligatoires, build qui valide le schéma).
</li>
<li>
<code>public/</code> : assets servis tels quels (favicon, images, <code>contact-zapier.php</code> — voir plus bas).
</li>
</ul>

<h2>Blog : content collections et validation au build</h2>
<p>
Les articles ne sont plus des fichiers <code>.astro</code> dupliqués : chaque billet est un <strong>Markdown</strong>
dans <code>src/content/blog/</code> (nom du fichier = slug d’URL). Au build, Astro charge la collection via
<code>getCollection('blog')</code> ; la page <code>[slug].astro</code> appelle <code>render()</code> pour produire le
HTML du corps. Si le frontmatter oublie un champ ou utilise une valeur d’<code>illustration</code> inconnue,
<strong>Zod</strong> fait échouer le build — utile quand le nombre d’articles augmente.
</p>
<ul>
<li>
<strong>Liste</strong> : <code>blog/index.astro</code> trie les entrées par <code>pubDate</code> décroissante.
</li>
<li>
<strong>SEO</strong> : titre et description viennent du frontmatter ; le layout article conserve canonical, Open Graph et JSON-LD.
</li>
<li>
<strong>Corps</strong> : Markdown et HTML autorisés (tableaux, <code>&lt;aside class="tldr"&gt;</code>, FAQ en <code>&lt;details&gt;</code>, blocs de code, etc.).
</li>
</ul>

<p>
Les dépendances npm restent limitées (Astro, polices, <code>sharp</code> pour le pipeline d’assets). Pas de base de
données : le contenu du blog est versionné dans le dépôt comme le reste du site, avec une revue possible via PR sur
les fichiers <code>.md</code>.
</p>

<h2>Formulaire de contact : le problème CORS</h2>
<p>
Zapier expose une URL <strong>Catch Hook</strong> en HTTPS. En pratique, le navigateur ne peut en général
<strong>pas</strong> poster directement du JSON depuis votre domaine vers <code>hooks.zapier.com</code> : le
navigateur applique la politique CORS ; le domaine Zapier ne renvoie pas les en-têtes qui autoriseraient un POST
depuis n’importe quel site (et ce serait d’ailleurs risqué pour eux).
</p>
<p>
La solution retenue : le formulaire appelle une URL <strong>du même site</strong> (<code>same-origin</code>), qui
rejoue la requête côté serveur ou outil de dev.
</p>
<ul>
<li>
<strong>En développement</strong> (<code>npm run dev</code>) : un <strong>proxy Vite</strong> dans
<code>astro.config.mjs</code> mappe <code>/api/zapier-contact</code> vers <code>hooks.zapier.com</code> avec
rewrite vers le chemin du Catch Hook. Le navigateur ne voit que localhost.
</li>
<li>
<strong>En production (WAMP / Apache + PHP)</strong> : un fichier <code>public/contact-zapier.php</code> reçoit le
POST JSON, valide les champs minimaux, et relaie avec <code>curl</code> vers l’URL Zapier. Aucun Node requis sur
le serveur : le site déployé est statique + ce seul endpoint PHP.
</li>
</ul>
<p>
Côté page <code>contact.astro</code>, l’URL de soumission est choisie selon l’environnement :
<code>import.meta.env.DEV</code> → proxy ; sinon → <code>/contact-zapier.php</code>. Le corps envoyé est du JSON
avec notamment <code>name</code>, <code>company</code>, <code>email</code>, <code>message</code>,
<code>submitted_at</code> (ISO 8601).
</p>

<h2>Zapier : orchestrer sans coder un « back-office »</h2>
<p>
<strong>Zapier</strong> sert de couche d’intégration : lorsqu’un message arrive sur le Catch Hook, un
<strong>Zap</strong> enchaîne les étapes — par exemple validation des champs, formatage, puis envoi via l’API
Mailjet.
</p>
<ul>
<li>
<strong>Avantages</strong> : pas de serveur à patcher pour un SMTP custom ; possibilité d’ajouter plus tard une
notion Slack, une ligne Google Sheets, ou un filtre anti-spam sans redéployer le site.
</li>
<li>
<strong>Point d’attention</strong> : le flux dépend d’un service tiers ; surveiller les quotas et la bonne exécution
des Zaps (logs Zapier). Pour une volumétrie très forte, on repenserait une file ou un endpoint dédié.
</li>
</ul>

<h2>Mailjet : emails transactionnels et templates</h2>
<p>
<strong>Mailjet</strong> prend le relais pour la <strong>délivrabilité</strong> (SPF/DKIM/DMARC sur le domaine
d’envoi), le suivi des bounces et un éditeur de <strong>templates transactionnels</strong>. Les champs saisis sur le
site sont mappés dans Zapier vers les variables du template Mailjet.
</p>
<p>
Dans ce dépôt, le dossier <code>email-templates/</code> contient une source <strong>MJML</strong> et le HTML généré,
avec une documentation des variables Mailjet (syntaxe du type <code>{{var:name}}</code>, <code>{{var:email}}</code>,
etc. — voir <code>README-mailjet-zapier.md</code> dans ce dossier) pour rester aligné avec ce que Zapier envoie.
Workflow typique : modifier le MJML, recompiler en HTML (<code>npx mjml …</code>), mettre à jour le template côté
Mailjet si besoin.
</p>

<h2>Sécurité et vie privée (rappel)</h2>
<ul>
<li>
Le proxy PHP vérifie la méthode POST, parse le JSON et rejette les champs obligatoires manquants — pas d’exécution
de code arbitraire à partir du corps brut.
</li>
<li>
En production, <strong>HTTPS</strong> est indispensable pour protéger les données en transit ; le fichier PHP ne
remplace pas une politique de mots de passe pour l’admin Mailjet/Zapier.
</li>
<li>
Le site inclut une politique de confidentialité et un consentement explicite sur le formulaire ; les données ne
servent qu’à répondre à la demande de contact, en cohérence avec l’usage décrit.
</li>
</ul>

<h2>Ce qu’on pourrait ajouter plus tard</h2>
<p>
<em>Les content collections Astro (Markdown + schéma Zod) sont déjà en place pour ce blog — ce qui suit concerne
d’autres évolutions possibles, pas une migration à prévoir.</em>
</p>
<ul>
<li>
<strong>MDX</strong> ou composants dans le corps des articles si le Markdown seul ne suffit plus ; images optimisées via le pipeline Astro si la galerie photo grossit.
</li>
<li>
<strong>Protection anti-bot</strong> (hCaptcha / Turnstile) si le hook recevait trop de spam — souvent branché
avant ou dans le Zap.
</li>
<li>
Hébergement sur CDN + CI qui lance <code>astro build</code> à chaque push, pour ne jamais oublier de régénérer le
statique.
</li>
</ul>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Pourquoi ne pas utiliser un simple <code>mailto:</code> ?</summary>
<p>
Ouverture du client mail, pas de trace côté serveur, expérience inégale sur mobile, et pas de template Mailjet ni
de chaîne Zapier. Le formulaire structuré donne des messages plus exploitables.
</p>
</details>
<details>
<summary>Astro impose-t-il TypeScript ou React ?</summary>
<p>
Non : les fichiers <code>.astro</code> suffisent pour ce site ; TS est optionnel ; React/Vue/Svelte ne sont
ajoutés que si vous choisissez des îlots interactifs.
</p>
</details>
<details>
<summary>Le proxy PHP est-il obligatoire si je suis sur Netlify / Vercel ?</summary>
<p>
Non : on peut remplacer le script par une <strong>serverless function</strong> ou un endpoint fournisseur qui
rejoue le POST vers Zapier. L’idée reste la même : éviter le POST cross-origin direct depuis le navigateur.
</p>
</details>
</section>
