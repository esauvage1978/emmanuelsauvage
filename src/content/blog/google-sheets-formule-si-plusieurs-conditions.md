---
title: "Google Sheets : formule SI avec plusieurs conditions (ET, OU, SI.CONDITIONS, SOMME.SI.ENS)"
shortTitle: "Google Sheets SI plusieurs conditions : ET, OU, SOMME.SI.ENS"
description: "Combiner SI avec ET et OU, remplacer les SI imbriqués par SI.CONDITIONS (IFS), faire une somme si 2 conditions avec SOMME.SI.ENS (SUMIFS) et gérer les erreurs avec SIERREUR : les formules à connaître, avec des exemples prêts à copier."
metaDescription: "SI + ET, SI + OU, SI.CONDITIONS (IFS) et somme si 2 conditions avec SOMME.SI.ENS : les formules Google Sheets expliquées, avec exemples à copier."
pubDate: 2026-09-28
updatedDate: 2026-10-08
readingTimeMinutes: 11
tags:
  - "Google Sheets"
  - "Formules"
  - "Tutoriel"
illustration: sheets
category: google-sheets
---
<aside class="tldr">
<strong>En bref</strong>
Pour tester <strong>plusieurs conditions à la fois</strong>, placez <code>ET()</code> (toutes vraies) ou
<code>OU()</code> (au moins une vraie) à l’intérieur de <code>SI()</code>. Pour choisir entre
<strong>plusieurs résultats</strong>, préférez <code>SI.CONDITIONS()</code> aux SI imbriqués. Pour une <strong>somme si 2 conditions</strong> (ou plus), pas
besoin de SI : <code>SOMME.SI.ENS()</code> le fait directement, et <code>NB.SI.ENS()</code> pour compter.
</aside>

<h2>Avant de commencer : noms de fonctions et séparateurs</h2>
<p>
Dans un fichier Google Sheets réglé sur la France (<em>Fichier &gt; Paramètres &gt; Paramètres régionaux</em>), les
fonctions portent leur nom français (<code>SI</code>, <code>ET</code>, <code>OU</code>…) et les arguments sont séparés
par un <strong>point-virgule</strong>. Avec des paramètres régionaux anglais, les mêmes formules s’écrivent
<code>IF</code>, <code>AND</code>, <code>OR</code>, <code>IFS</code>, <code>IFERROR</code>, <code>COUNTIFS</code>,
avec des virgules (et <code>SUMIFS</code> pour <code>SOMME.SI.ENS</code>). La logique ne change pas.
</p>
<p>Tous les exemples ci-dessous s’appuient sur un petit tableau de commandes fictif :</p>
<table>
<thead>
<tr><th></th><th>A : Client</th><th>B : Région</th><th>C : Montant (€)</th><th>D : Statut</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>Dupont</td><td>Nord</td><td>1 200</td><td>Payé</td></tr>
<tr><td>3</td><td>Martin</td><td>Sud</td><td>450</td><td>En attente</td></tr>
<tr><td>4</td><td>Leroy</td><td>Nord</td><td>3 800</td><td>En attente</td></tr>
<tr><td>5</td><td>Petit</td><td>Est</td><td>90</td><td>Payé</td></tr>
</tbody>
</table>

<h2>Rappel : la fonction SI</h2>
<p>
<code>SI(condition; valeur_si_vrai; valeur_si_faux)</code> renvoie une valeur ou une autre selon que la condition est
vraie ou fausse :
</p>
<pre><code>=SI(C2&gt;=1000; "Gros client"; "Standard")</code></pre>
<p>
Le texte se met entre guillemets droits, les nombres sans guillemets. Si vous omettez le troisième argument, la formule
renvoie <code>FAUX</code> quand la condition n’est pas remplie : mettez plutôt <code>""</code> pour laisser la cellule
vide.
</p>

<h2>SI + ET : toutes les conditions doivent être vraies</h2>
<p>
<code>ET()</code> renvoie <code>VRAI</code> uniquement si <strong>toutes</strong> les conditions sont vraies. On
l’utilise comme condition de <code>SI()</code> :
</p>
<pre><code>=SI(ET(B2="Nord"; C2&gt;=1000); "Relance prioritaire"; "")</code></pre>
<p>
Ici, les lignes Dupont (Nord, 1 200 €) et Leroy (Nord, 3 800 €) sont marquées ; Martin et Petit ne le sont pas. Vous pouvez enchaîner autant
de conditions que nécessaire dans <code>ET()</code>, séparées par des points-virgules :
</p>
<pre><code>=SI(ET(B2="Nord"; C2&gt;=1000; D2="En attente"); "À relancer"; "")</code></pre>
<p>Cette fois, seule la ligne Leroy répond aux trois critères.</p>

<h2>SI + OU : au moins une condition doit être vraie</h2>
<p><code>OU()</code> renvoie <code>VRAI</code> dès qu’<strong>une</strong> des conditions est vraie :</p>
<pre><code>=SI(OU(B2="Nord"; B2="Est"); "Secteur Emmanuel"; "Secteur Julie")</code></pre>
<p>
On peut combiner les deux. Pour « montant supérieur ou égal à 1 000 € <em>et</em> région Nord ou Est » :
</p>
<pre><code>=SI(ET(C2&gt;=1000; OU(B2="Nord"; B2="Est")); "Oui"; "Non")</code></pre>
<p>
Pour inverser une condition, utilisez <code>NON()</code> ou l’opérateur <code>&lt;&gt;</code> (différent de) :
<code>=SI(D2&lt;&gt;"Payé"; "Impayé"; "")</code>.
</p>

<h2>Plusieurs résultats possibles : SI imbriqués ou SI.CONDITIONS</h2>
<p>
Pour classer les commandes en trois tranches, la méthode historique consiste à imbriquer des <code>SI</code> :
</p>
<pre><code>=SI(C2&gt;=3000; "A"; SI(C2&gt;=1000; "B"; "C"))</code></pre>
<p>
Cela fonctionne, mais devient vite illisible au-delà de trois niveaux (et les parenthèses se comptent à la main).
<code>SI.CONDITIONS()</code> est plus clair : on liste des paires <em>condition ; résultat</em>, évaluées dans
l’ordre, et la première condition vraie l’emporte.
</p>
<pre><code>=SI.CONDITIONS(C2&gt;=3000; "A"; C2&gt;=1000; "B"; C2&gt;=100; "C"; VRAI; "D")</code></pre>
<p>Deux points d’attention :</p>
<ul>
<li>
<strong>L’ordre compte.</strong> Si vous testez <code>C2&gt;=100</code> en premier, toutes les commandes au-dessus
de 100 € tomberont en « C ».
</li>
<li>
<strong>Aucune condition vraie = erreur <code>#N/A</code>.</strong> D’où le dernier couple
<code>VRAI; "D"</code>, qui joue le rôle de « sinon ».
</li>
</ul>

<h2>Gérer les erreurs : SIERREUR</h2>
<p>
Une formule qui divise par une cellule vide ou qui recherche une valeur absente renvoie une erreur
(<code>#DIV/0!</code>, <code>#N/A</code>…). <code>SIERREUR(valeur; valeur_si_erreur)</code> remplace l’erreur par ce
que vous voulez :
</p>
<pre><code>=SIERREUR(C2/E2; 0)</code></pre>
<p>
À utiliser avec discernement : masquer toutes les erreurs peut cacher un vrai problème de données. Préférez un message
explicite (<code>"Taux manquant"</code>) plutôt qu’un zéro silencieux quand l’erreur doit être corrigée.
</p>

<h2>Somme si 2 conditions : SOMME.SI.ENS (et NB.SI.ENS pour compter)</h2>
<p>
Beaucoup de formules « SI à plusieurs conditions » servent en réalité à <strong>additionner</strong> ou à
<strong>compter</strong>. Dans ce cas, inutile d’ajouter une colonne de SI : <code>SOMME.SI.ENS</code>
(<code>SUMIFS</code> en anglais) additionne une plage en ne gardant que les lignes qui remplissent
<strong>toutes</strong> les conditions (logique ET) :
</p>
<pre><code>SOMME.SI.ENS(plage_somme; plage_critère1; critère1; [plage_critère2; critère2; …])</code></pre>
<p>Somme des montants de la région Nord encore en attente, soit deux conditions :</p>
<pre><code>=SOMME.SI.ENS(C2:C5; B2:B5; "Nord"; D2:D5; "En attente")</code></pre>
<p>
Résultat : 3 800 (seule la commande Leroy remplit les deux conditions). On ajoute une troisième condition en
ajoutant simplement un couple <em>plage ; critère</em>. Les mêmes fonctions existent pour compter et faire une
moyenne :
</p>
<table>
<thead><tr><th>Besoin</th><th>Formule</th><th>Résultat</th></tr></thead>
<tbody>
<tr>
<td>Nombre de commandes Nord en attente</td>
<td><code>=NB.SI.ENS(B2:B5; "Nord"; D2:D5; "En attente")</code></td>
<td>1</td>
</tr>
<tr>
<td>Montant total payé (une seule condition)</td>
<td><code>=SOMME.SI.ENS(C2:C5; D2:D5; "Payé")</code></td>
<td>1 290</td>
</tr>
<tr>
<td>Montant Nord d’au moins 1 000 €</td>
<td><code>=SOMME.SI.ENS(C2:C5; B2:B5; "Nord"; C2:C5; "&gt;=1000")</code></td>
<td>5 000</td>
</tr>
<tr>
<td>Montant hors commandes payées</td>
<td><code>=SOMME.SI.ENS(C2:C5; D2:D5; "&lt;&gt;Payé")</code></td>
<td>4 250</td>
</tr>
<tr>
<td>Montant moyen des commandes en attente</td>
<td><code>=MOYENNE.SI.ENS(C2:C5; D2:D5; "En attente")</code></td>
<td>2 125</td>
</tr>
</tbody>
</table>
<p>Trois règles évitent la plupart des erreurs :</p>
<ul>
<li>
<strong>La plage à additionner vient en premier</strong> dans <code>SOMME.SI.ENS</code> (c’est l’inverse de
<code>SOMME.SI</code>, où elle vient en dernier).
</li>
<li>
<strong>Toutes les plages ont la même taille</strong> : <code>C2:C5</code> avec <code>B2:B5</code>, pas
<code>B2:B10</code>.
</li>
<li>
<strong>Les comparaisons s’écrivent entre guillemets</strong> (<code>"&gt;=1000"</code>) ; pour utiliser une cellule,
concaténez : <code>"&gt;="&amp;F1</code>. Un critère texte placé dans une cellule s’utilise tel quel :
<code>=SOMME.SI.ENS(C2:C; B2:B; G1; D2:D; G2)</code>.
</li>
</ul>

<h3>Somme entre deux dates</h3>
<p>
Cas très fréquent : deux conditions sur la <strong>même</strong> colonne. Si votre tableau a une colonne E de dates,
le total de janvier 2026 s’écrit :
</p>
<pre><code>=SOMME.SI.ENS(C2:C; E2:E; "&gt;="&amp;DATE(2026; 1; 1); E2:E; "&lt;"&amp;DATE(2026; 2; 1))</code></pre>

<h3>Somme avec une condition OU</h3>
<p>
<code>SOMME.SI.ENS</code> ne sait faire que du ET. Pour « région Nord <em>ou</em> Est », le plus lisible est
d’additionner deux formules :
<code>=SOMME.SI.ENS(C2:C5; B2:B5; "Nord") + SOMME.SI.ENS(C2:C5; B2:B5; "Est")</code> (résultat : 5 090). Même
principe pour compter : <code>=NB.SI(B2:B5; "Nord") + NB.SI(B2:B5; "Est")</code>. Quand les conditions se
multiplient, <code>SOMMEPROD</code> (<code>SUMPRODUCT</code>) accepte n’importe quelle combinaison, avec
<code>*</code> pour ET et <code>+</code> pour OU :
</p>
<pre><code>=SOMMEPROD(((B2:B5="Nord")+(B2:B5="Est"))*(D2:D5="En attente")*C2:C5)</code></pre>
<p>Ici : 3 800, seule commande Nord ou Est encore en attente.</p>

<h2>Appliquer la formule à toute une colonne</h2>
<p>
Plutôt que de recopier la formule sur des milliers de lignes, on peut la calculer une seule fois pour toute la colonne
avec <code>ARRAYFORMULA</code>. Dans ce cas, <code>ET()</code> et <code>OU()</code> ne fonctionnent pas ligne par
ligne (ils renvoient une seule valeur pour toute la plage). On les remplace par des opérations :
</p>
<ul>
<li><strong>ET</strong> devient une multiplication : <code>(B2:B="Nord")*(C2:C&gt;=1000)</code></li>
<li><strong>OU</strong> devient une addition : <code>(B2:B="Nord")+(B2:B="Est")</code></li>
</ul>
<pre><code>=ARRAYFORMULA(SI(A2:A=""; ""; SI((B2:B="Nord")*(C2:C&gt;=1000); "À relancer"; "")))</code></pre>
<p>
Le premier test (<code>A2:A=""</code>) évite d’afficher des résultats sur les lignes vides en bas du tableau. Si vous
préférez garder <code>ET()</code> et <code>OU()</code>, la fonction <code>MAP</code> applique la formule cellule par
cellule : tout est expliqué dans le guide
<a href="/blog/arrayformula-map-makearray-google-sheets/">ARRAYFORMULA, MAP et MAKEARRAY</a>.
</p>

<h2>Les erreurs les plus fréquentes</h2>
<ul>
<li>
<strong>Virgule au lieu de point-virgule</strong> (ou l’inverse) : le séparateur dépend des paramètres régionaux du
fichier, pas de votre ordinateur.
</li>
<li>
<strong>Nombre stocké comme texte</strong> : <code>C2&gt;=1000</code> est faux si la cellule contient le texte
« 1 200 € » saisi à la main. Vérifiez le format (aligné à droite = nombre).
</li>
<li><strong>Guillemets typographiques</strong> (« » ou “ ”) copiés depuis un document : Sheets attend des guillemets droits.</li>
<li>
<strong>Espaces invisibles</strong> : « Nord » et « Nord&nbsp;» ne sont pas égaux. <code>SUPPRESPACE()</code> nettoie
les données importées.
</li>
<li>
<strong>SI imbriqués à rallonge</strong> : au-delà de trois ou quatre niveaux, passez à <code>SI.CONDITIONS</code>
ou à une petite table de correspondance avec <code>RECHERCHEV</code> ou <code>RECHERCHEX</code> (voir le
<a href="/blog/recherchev-recherchex-google-sheets/">guide RECHERCHEV et RECHERCHEX</a>).
</li>
</ul>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Combien de conditions peut-on mettre dans ET ou OU ?</summary>
<p>
Suffisamment pour tous les usages courants. Au-delà de cinq ou six conditions, la formule devient difficile à
relire : une colonne intermédiaire ou une table de paramètres est souvent plus maintenable.
</p>
</details>
<details>
<summary>Comment faire une somme si 2 conditions dans Google Sheets ?</summary>
<p>
Avec <code>SOMME.SI.ENS</code> (<code>SUMIFS</code>) : la plage à additionner d’abord, puis un couple
<em>plage ; critère</em> par condition, par exemple <code>=SOMME.SI.ENS(C2:C; B2:B; "Nord"; D2:D; "En attente")</code>.
Pour une condition OU, additionnez deux <code>SOMME.SI.ENS</code>.
</p>
</details>
<details>
<summary>SI.CONDITIONS existe-t-il dans Excel ?</summary>
<p>
Oui, sous le même nom dans les versions récentes d’Excel (IFS en anglais). Les formules de cet article se
transposent donc presque telles quelles.
</p>
</details>
<details>
<summary>Comment tester si une cellule contient un mot ?</summary>
<p>
Combinez <code>SI</code> avec <code>ESTNUM(CHERCHE("mot"; A2))</code> : <code>CHERCHE</code> renvoie la position du
mot (sans tenir compte de la casse) ou une erreur s’il est absent.
</p>
</details>
</section>

<p>
Ces formules font partie du programme de la <a href="/formation-google-sheets/">formation Google Sheets</a>
(niveaux N1 « fondamentaux » et N2 « avancé »), travaillées directement sur les fichiers de votre équipe. Pour aller plus loin dans
l’analyse, lisez aussi le guide de la <a href="/blog/fonction-query-google-sheets/">fonction QUERY</a> ; pour aller
chercher une valeur dans une autre table, celui de <a href="/blog/recherchev-recherchex-google-sheets/">RECHERCHEV et
RECHERCHEX</a>.
</p>
