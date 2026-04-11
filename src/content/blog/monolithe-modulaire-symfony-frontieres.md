---
title: "Monolithe modulaire Symfony : frontières nettes sans microservices"
shortTitle: "Monolithe modulaire Symfony : frontières"
description: "Contextes délimités, namespaces, règles de dépendance et points d’intégration explicites pour garder une base évolutive."
pubDate: 2026-03-18
readingTimeMinutes: 11
tags:
  - "Symfony"
  - "Architecture"
  - "DDD léger"
illustration: modules
---
<aside class="tldr">
<strong>En bref</strong>
Un monolithe bien découpé peut être aussi maintenable qu’une fédération de services — à condition de
<strong>frontières claires</strong> entre contextes métier, d’interfaces stables et d’interdictions explicites (pas
d’accès direct aux entités d’un autre module).
</aside>

<h2>Pourquoi rester monolithique ?</h2>
<p>
Moins de latence réseau, transactions plus simples, déploiement unique, observabilité centralisée. Le piège est le
<strong>big ball of mud</strong> : tout le monde importe tout. La modularité structure le code comme si demain vous
extrayiez un bounded context — sans l’obligation de le faire.
</p>

<h2>Organisation sous Symfony</h2>
<ul>
<li>
Namespaces par domaine : <code>App\\Billing\\</code>, <code>App\\Inventory\\</code> — pas seulement
<code>Controller\\Entity\\Repository</code> mélangés.
</li>
<li>Services publics du module : interfaces dans le module, implémentations injectées.</li>
<li>
Éviter que le module A charge les repositories du module B : passer par un <strong>port</strong> (interface
application) ou des événements de domaine.
</li>
</ul>

<h2>Frontière données</h2>
<p>
Partager une base SQL reste possible : tables par contexte ou schémas logiques, pas de clés étrangères « travers
contextes » si cela crée du couplage fort. Sinon, synchronisation par événements ou API interne documentée.
</p>

<h2>Règles automatiques</h2>
<p>
Outils du type <code>deptrac</code> (couches et namespaces interdits) transforment les conventions en
<strong>garde-fous CI</strong>. Une PR qui viole une règle est refusée — moins de dette silencieuse.
</p>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Symfony « bundle » par domaine ?</summary>
<p>
Possible pour de gros projets ; souvent un namespace + services tagués suffisent. Les bundles brillent quand le
domaine est réutilisable entre applications.
</p>
</details>
<details>
<summary>Quand basculer vers des services séparés ?</summary>
<p>
Quand les équipes, les cycles de release ou les contraintes de scale imposent l’isolation — pas comme premier
reflexe d’« architecture propre ».
</p>
</details>
</section>
