---
title: "Google Sheets vs Excel : limites techniques et cas d’usage"
description: "Comparatif des plafonds (partages, cellules, fichiers, collaboration) et repères pour choisir Sheets, Excel bureau ou Excel en ligne selon votre contexte."
pubDate: 2026-03-20
readingTimeMinutes: 13
tags:
  - "Google Sheets"
  - "Excel"
  - "Outils métier"
  - "Décision"
illustration: sheets
---
<aside class="tldr">
<strong>En bref</strong>
<strong>Google Sheets</strong> brille pour la collaboration en temps réel, l’accès navigateur et l’écosystème Google
Workspace — avec des plafonds stricts (nombre de cellules, quotas de fonctions, partages). <strong>Excel</strong>
(bureau) reste la référence pour les gros classeurs locaux, le modèle de données Power Pivot, VBA et les fichiers
lourds ; <strong>Excel pour le web</strong> reprend une partie des usages mais impose d’autres limites (taille de
fichier, fonctionnalités). Le bon choix dépend surtout du <strong>lieu de la vérité</strong>, du volume et des
compétences métier.
</aside>

<h2>Deux mondes : navigateur + cloud vs bureau + fichiers</h2>
<p>
<strong>Google Sheets</strong> est pensé pour le web : un fichier « hébergé » dans Drive, partagé par lien ou par
compte, édité simultanément par plusieurs personnes. <strong>Microsoft Excel</strong> existe en
<strong>application desktop</strong> (Windows, Mac) et en <strong>Excel pour le web</strong> (navigateur, souvent via
OneDrive ou SharePoint). Les limites ne sont donc pas comparables ligne à ligne : il faut distinguer Excel installé et
Excel en ligne.
</p>

<h2>Limites côté Google Sheets</h2>
<p>
Les valeurs ci-dessous reprennent la documentation Google (Drive / Sheets) — elles peuvent évoluer ; vérifiez la page
d’aide officielle pour votre abonnement.
</p>
<ul>
<li>
<strong>Cellules</strong> : jusqu’à <strong>10 millions</strong> de cellules par classeur (y compris pour les
fichiers importés depuis Excel ou CSV dans les conditions indiquées par Google).
</li>
<li>
<strong>Partage nominatif</strong> : un même fichier Google (Docs, Sheets, etc.) ne peut pas être partagé avec un
nombre illimité d’adresses individuelles : la documentation Google indique une borne de l’ordre de
<strong>600 destinataires distincts</strong> par fichier lorsque vous partagez en ajoutant des comptes un par un.
Au-delà, vous verrez une erreur du type « vous ne pouvez pas partager avec autant de destinataires » — il faut
alors passer par des <strong>groupes</strong>, un <strong>domaine</strong> Workspace, une
<strong>Shared Drive</strong>, ou une autre stratégie de diffusion (lien « toute personne avec le lien », publication
web, export vers un outil métier, etc.).
</li>
<li>
<strong>Édition simultanée</strong> : au-delà d’environ <strong>100 utilisateurs</strong> actifs en même temps sur
un même fichier, Google documente des restrictions (priorité d’édition, recommandation de « publier sur le web »
pour de la très large diffusion en lecture).
</li>
<li>
<strong>Fonctions et intégrations</strong> : <code>IMPORTRANGE</code>, <code>IMPORTDATA</code>, Apps Script ont des
<strong>quotas</strong> (nombre d’appels, temps d’exécution). Un classeur très chargé en formules qui tirent des
données externes peut ralentir ou échouer sans que la seule limite « cellules » soit atteinte.
</li>
<li>
<strong>Connexion</strong> : sans réseau, l’usage est dégradé (mode hors ligne limité selon navigateur et réglages).
</li>
</ul>

<h2>Limites côté Microsoft Excel</h2>
<h3>Excel (application bureau)</h3>
<ul>
<li>
<strong>Grille</strong> : jusqu’à <strong>1 048 576</strong> lignes × <strong>16 384</strong> colonnes par feuille
(dernière colonne XFD) — soit un plafond théorique énorme par feuille, mais la <strong>mémoire</strong> et les
performances de la machine restent le vrai frein.
</li>
<li>
<strong>Taille de fichier</strong> : les classeurs très volumineux (nombreuses feuilles, images, modèle de données)
peuvent atteindre des centaines de Mo ; l’ouverture et le recalcul dépendent du poste.
</li>
<li>
<strong>Partage « fichier »</strong> : un fichier <code>.xlsx</code> sur un partage réseau ou envoyé par mail n’a pas
la même limite « 600 comptes » que Drive — en revanche la <strong>gouvernance</strong> (qui a la dernière version ?)
est souvent plus confuse que sur un document cloud unique.
</li>
<li>
<strong>VBA, compléments, Power Query avancé, Power Pivot</strong> : souvent réservés ou complets uniquement en
bureau — argument fort pour rester sur Excel installé.
</li>
</ul>
<h3>Excel pour le web (navigateur)</h3>
<ul>
<li>
Microsoft indique des <strong>plafonds de taille</strong> pour l’ouverture dans le navigateur lorsque le fichier est
dans SharePoint / OneDrive (ordre de grandeur courant : au-delà de ~<strong>100 Mo</strong>, l’édition web peut être
impossible — le fichier doit alors s’ouvrir dans Excel bureau).
</li>
<li>
Toutes les fonctionnalités du desktop ne sont pas disponibles ; les gros modèles ou macros peuvent imposer le client
lourd.
</li>
</ul>

<h2>Tableau de synthèse (ordre de grandeur)</h2>
<div class="table-wrap" role="region" aria-label="Comparatif Sheets et Excel" tabindex="0">
<table class="compareTable">
<thead>
<tr>
<th scope="col">Critère</th>
<th scope="col">Google Sheets</th>
<th scope="col">Excel bureau</th>
<th scope="col">Excel pour le web</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">Accès principal</th>
<td>Navigateur, apps Google</td>
<td>Application installée</td>
<td>Navigateur (fichier cloud Microsoft)</td>
</tr>
<tr>
<th scope="row">Plafond cellules (doc. Google / usage courant)</th>
<td>10 M cellules / classeur</td>
<td>Grille très large ; limite pratique = perf</td>
<td>Souvent aligné sur les gros classeurs avec limite de taille fichier</td>
</tr>
<tr>
<th scope="row">Partage nominatif massif</th>
<td>Plafond (~600 comptes / fichier, doc. Google)</td>
<td>Pas la même logique « comptes sur un fichier cloud »</td>
<td>Gouvernance SharePoint / permissions</td>
</tr>
<tr>
<th scope="row">Co-édition temps réel</th>
<td>Natif, mature</td>
<td>Possible via fichiers cloud Microsoft</td>
<td>Oui, avec limites de taille / fonctionnalités</td>
</tr>
<tr>
<th scope="row">Macros / VBA</th>
<td>Apps Script (modèle différent)</td>
<td>VBA</td>
<td>Très limité</td>
</tr>
</tbody>
</table>
</div>

<h2>Quand privilégier Google Sheets ?</h2>
<ul>
<li>Équipes déjà sur <strong>Google Workspace</strong>, habitudes Drive, Gmail, Meet.</li>
<li>
Besoin de <strong>collaboration</strong> fréquente, commentaires, historique de versions simple, partage par lien.
</li>
<li>Processus légers : saisie partagée, tableaux de suivi, scoring, planning — sans dépendre de macros lourdes.</li>
<li>
Intégrations avec le web (<code>IMPORTXML</code>, connecteurs, Zapier/Make, BigQuery via outils Google, etc.).
</li>
</ul>

<h2>Quand privilégier Excel ?</h2>
<ul>
<li>
<strong>Modèles complexes</strong> : Power Pivot, scénarios avancés, solveur, classeurs avec milliers de formules
interdépendantes optimisées depuis des années.
</li>
<li>
<strong>Macros VBA</strong> ou compléments métier historiques : migration vers Sheets coûteuse et risquée.
</li>
<li>
<strong>Fichiers énormes</strong> ou besoin de travail <strong>hors ligne</strong> fiable sur le poste.
</li>
<li>Organisation <strong>centrée Microsoft 365</strong> (Teams, SharePoint, Power BI en aval du même écosystème).</li>
</ul>

<h2 Hybride et sortie de zone</h2>
<p>
Importer / exporter entre Sheets et Excel est courant — attention aux <strong>écarts de formules</strong>, aux
formats conditionnels et aux scripts. Si vous butez sur les limites de Sheets (partages, quotas, volumétrie), la suite
logique n’est pas « un Excel de 200 Mo par e-mail » mais souvent un <strong>fichier métier</strong> (base SQL,
application web, entrepôt) avec des exports contrôlés.
</p>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Les 600 partages, c’est par jour ou au total ?</summary>
<p>
Il s’agit d’une limite sur le <strong>nombre de comptes distincts</strong> avec lesquels un même fichier peut être
partagé de façon nominative (selon la documentation Google). Ce n’est pas un quota journalier de messages.
</p>
</details>
<details>
<summary>Puis-je dépasser 600 collaborateurs avec un lien « tout le monde » ?</summary>
<p>
Un lien en lecture ou commentaire peut toucher plus de monde, mais la <strong>gouvernance</strong> et la
sécurité changent : contrôle d’accès affaibli, risque de fuite. À évaluer selon la sensibilité des données.
</p>
</details>
<details>
<summary>Excel Online est-il « le même » qu’Excel ?</summary>
<p>
Non pour les usages avancés : pensez-le comme une <strong>vue</strong> pratique pour éditer des tableaux
courants dans le cloud ; gardez le bureau pour les modèles lourds.
</p>
</details>
</section>
