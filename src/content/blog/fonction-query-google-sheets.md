---
title: "Fonction QUERY de Google Sheets : guide en français avec exemples (GROUP BY, ORDER BY, LABEL)"
shortTitle: "Fonction QUERY Google Sheets : guide et exemples"
description: "Filtrer, trier, regrouper et totaliser vos données avec une seule formule : la syntaxe de QUERY, les clauses SELECT, WHERE, GROUP BY, PIVOT, ORDER BY, LIMIT et LABEL, et les pièges à éviter, avec des exemples prêts à copier."
metaDescription: "Syntaxe de QUERY dans Google Sheets, SELECT, WHERE, GROUP BY, ORDER BY, LABEL, PIVOT, dates et pièges fréquents : le guide en français, avec exemples."
pubDate: 2026-09-28
readingTimeMinutes: 11
tags:
  - "Google Sheets"
  - "QUERY"
  - "Tutoriel"
  - "Analyse de données"
illustration: sheets
category: google-sheets
---
<aside class="tldr">
<strong>En bref</strong>
<code>QUERY(données; "requête"; [en-têtes])</code> applique à une plage une requête proche du SQL : choisir des
colonnes (<code>select</code>), filtrer (<code>where</code>), regrouper et totaliser (<code>group by</code>),
trier (<code>order by</code>), limiter (<code>limit</code>) et renommer (<code>label</code>). Une seule formule
remplace souvent un filtre, un tri et un tableau croisé dynamique, et le résultat se met à jour tout seul.
</aside>

<h2>La syntaxe de base</h2>
<pre><code>=QUERY(A1:E; "select B, sum(E) where D = 'Payé' group by B"; 1)</code></pre>
<ul>
<li><strong>Données</strong> : la plage source, en-têtes compris (ici <code>A1:E</code>, colonnes entières pour inclure les futures lignes).</li>
<li>
<strong>Requête</strong> : une chaîne de texte entre guillemets droits. Les colonnes sont désignées par leur
<strong>lettre</strong> (<code>A</code>, <code>B</code>…), pas par leur titre.
</li>
<li>
<strong>En-têtes</strong> (facultatif) : le nombre de lignes d’en-tête. Indiquez-le explicitement (<code>1</code>)
plutôt que de laisser Sheets deviner.
</li>
</ul>
<p>
Le nom de la fonction reste <code>QUERY</code> en français, et les mots-clés de la requête (<code>select</code>,
<code>where</code>…) sont toujours en anglais. Seul le séparateur entre les arguments de la fonction dépend des
paramètres régionaux : point-virgule pour un fichier réglé sur la France.
</p>
<p>Les exemples utilisent ce tableau de ventes fictif (onglet <em>Ventes</em>) :</p>
<table>
<thead><tr><th>A : Date</th><th>B : Commercial</th><th>C : Région</th><th>D : Statut</th><th>E : Montant</th></tr></thead>
<tbody>
<tr><td>05/01/2026</td><td>Julie</td><td>Nord</td><td>Payé</td><td>1 200</td></tr>
<tr><td>12/01/2026</td><td>Karim</td><td>Sud</td><td>En attente</td><td>450</td></tr>
<tr><td>03/02/2026</td><td>Julie</td><td>Nord</td><td>Payé</td><td>3 800</td></tr>
<tr><td>17/02/2026</td><td>Karim</td><td>Est</td><td>Payé</td><td>900</td></tr>
<tr><td>02/03/2026</td><td>Léa</td><td>Nord</td><td>Annulé</td><td>600</td></tr>
</tbody>
</table>

<h2>L’ordre des clauses</h2>
<p>
Les clauses sont facultatives, mais quand elles sont présentes, elles doivent apparaître <strong>dans cet ordre</strong>,
sinon la formule renvoie une erreur :
</p>
<p>
<code>select</code> → <code>where</code> → <code>group by</code> → <code>pivot</code> → <code>order by</code> →
<code>limit</code> → <code>offset</code> → <code>label</code> → <code>format</code>
</p>

<h2>SELECT : choisir les colonnes</h2>
<pre><code>=QUERY(Ventes!A1:E; "select A, B, E"; 1)</code></pre>
<p>
Sans <code>select</code>, toutes les colonnes sont renvoyées. L’ordre des colonnes dans <code>select</code> est
l’ordre d’affichage : <code>select E, B</code> met le montant en premier.
</p>

<h2>WHERE : filtrer les lignes</h2>
<table>
<thead><tr><th>Besoin</th><th>Clause</th></tr></thead>
<tbody>
<tr><td>Texte exact (entre apostrophes)</td><td><code>where C = 'Nord'</code></td></tr>
<tr><td>Nombre</td><td><code>where E &gt;= 1000</code></td></tr>
<tr><td>Plusieurs conditions</td><td><code>where C = 'Nord' and D = 'Payé'</code></td></tr>
<tr><td>L’une ou l’autre</td><td><code>where C = 'Nord' or C = 'Est'</code></td></tr>
<tr><td>Différent de</td><td><code>where D != 'Annulé'</code></td></tr>
<tr><td>Contient un mot (sensible à la casse)</td><td><code>where B contains 'Ju'</code></td></tr>
<tr><td>Commence par</td><td><code>where B starts with 'K'</code></td></tr>
<tr><td>Ignorer les lignes vides</td><td><code>where A is not null</code></td></tr>
<tr><td>Date (format aaaa-mm-jj imposé)</td><td><code>where A &gt;= date '2026-02-01'</code></td></tr>
</tbody>
</table>
<p>
Les textes s’écrivent entre <strong>apostrophes</strong> à l’intérieur de la requête, puisque la requête elle-même
est entre guillemets. Les dates, elles, doivent toujours être écrites au format <code>date 'aaaa-mm-jj'</code>, quel
que soit l’affichage dans vos cellules.
</p>

<h3>Utiliser une cellule comme critère</h3>
<p>
Pour un petit tableau de bord où l’utilisateur choisit la région en <code>H1</code>, on sort de la chaîne et on
concatène avec <code>&amp;</code>, sans oublier les apostrophes autour d’un texte :
</p>
<pre><code>=QUERY(Ventes!A1:E; "select B, E where C = '"&amp;H1&amp;"'"; 1)</code></pre>
<p>Pour un nombre, pas d’apostrophes : <code>"select B, E where E &gt;= "&amp;H2</code>.</p>

<h2>GROUP BY : regrouper et totaliser</h2>
<p>
C’est la fonction « tableau croisé dynamique » de QUERY. On choisit une colonne de regroupement et une ou plusieurs
<strong>fonctions d’agrégation</strong> : <code>sum</code>, <code>count</code>, <code>avg</code>,
<code>min</code>, <code>max</code>.
</p>
<pre><code>=QUERY(Ventes!A1:E; "select B, sum(E), count(E) where D = 'Payé' group by B"; 1)</code></pre>
<table>
<thead><tr><th>Commercial</th><th>sum Montant</th><th>count Montant</th></tr></thead>
<tbody>
<tr><td>Julie</td><td>5 000</td><td>2</td></tr>
<tr><td>Karim</td><td>900</td><td>1</td></tr>
</tbody>
</table>
<p>
Règle à retenir : <strong>toute colonne du <code>select</code> qui n’est pas agrégée doit figurer dans le
<code>group by</code></strong>. <code>select B, C, sum(E) group by B</code> renvoie une erreur ; il faut
<code>group by B, C</code>.
</p>

<h3>Regrouper par mois</h3>
<p>
Les fonctions <code>year()</code> et <code>month()</code> extraient l’année et le mois d’une date. Piège classique :
<strong><code>month()</code> compte de 0 à 11</strong> (janvier = 0). Ajoutez 1 pour obtenir un numéro de mois
habituel :
</p>
<pre><code>=QUERY(Ventes!A1:E; "select year(A), month(A)+1, sum(E) where A is not null group by year(A), month(A)+1 order by year(A), month(A)+1"; 1)</code></pre>

<h2>ORDER BY et LIMIT : trier et garder le top</h2>
<pre><code>=QUERY(Ventes!A1:E; "select B, sum(E) group by B order by sum(E) desc limit 3"; 1)</code></pre>
<p>
<code>desc</code> trie du plus grand au plus petit, <code>asc</code> (par défaut) dans l’autre sens.
<code>limit 3</code> ne garde que les trois premières lignes : pratique pour un classement des meilleurs commerciaux
ou des produits les plus vendus. <code>offset</code> permet de sauter des lignes (pagination).
</p>

<h2>LABEL : renommer les colonnes calculées</h2>
<p>
Par défaut, une colonne agrégée s’intitule « sum Montant ». <code>label</code> remplace ce titre ; plusieurs
libellés se séparent par des virgules :
</p>
<pre><code>=QUERY(Ventes!A1:E; "select B, sum(E), count(E) group by B label B 'Commercial', sum(E) 'CA total', count(E) 'Nb ventes'"; 1)</code></pre>
<p>Pour supprimer un en-tête, donnez-lui un libellé vide : <code>label sum(E) ''</code>.</p>

<h2>PIVOT : un vrai tableau croisé</h2>
<p>
<code>pivot</code> transforme les valeurs d’une colonne en colonnes. Chiffre d’affaires par commercial et par
région :
</p>
<pre><code>=QUERY(Ventes!A1:E; "select B, sum(E) where D = 'Payé' group by B pivot C"; 1)</code></pre>
<p>
Le résultat affiche une ligne par commercial et une colonne par région (Est, Nord…). Une case vide signifie
« aucune vente » pour ce couple.
</p>

<h2>QUERY sur plusieurs onglets ou avec IMPORTRANGE</h2>
<p>
Quand les données ne proviennent pas directement d’une plage (tableau assemblé avec des accolades, résultat
d’<code>IMPORTRANGE</code>), les lettres de colonnes ne fonctionnent plus : on écrit <code>Col1</code>,
<code>Col2</code>… (avec un C majuscule).
</p>
<pre><code>=QUERY({Janvier!A2:E; Février!A2:E}; "select Col2, sum(Col5) where Col1 is not null group by Col2"; 0)</code></pre>
<p>
Dans un fichier réglé sur la France, les plages empilées dans les accolades se séparent par un point-virgule (une
barre oblique inversée <code>\</code> les juxtapose côte à côte).
</p>

<h2>Les pièges les plus fréquents</h2>
<ul>
<li>
<strong>Colonnes aux types mélangés</strong> : QUERY retient le type majoritaire d’une colonne et traite les autres
valeurs comme vides. Une colonne de montants où quelques cellules contiennent « N/A » en texte perd ces lignes dans
les totaux.
</li>
<li>
<strong>Guillemets au lieu d’apostrophes</strong> autour d’un texte dans la requête : erreur d’analyse garantie.
</li>
<li><strong>Clauses dans le désordre</strong> : <code>order by</code> avant <code>group by</code> ne passe pas.</li>
<li>
<strong>Nom de colonne au lieu de la lettre</strong> : <code>select Montant</code> ne fonctionne pas, il faut
<code>select E</code>.
</li>
<li>
<strong>Plage qui déborde</strong> : QUERY écrit ses résultats sur plusieurs lignes et colonnes ; si une cellule de
la zone est déjà remplie, la formule renvoie <code>#REF!</code>.
</li>
</ul>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>QUERY ou FILTER : lequel choisir ?</summary>
<p>
<code>FILTER</code> suffit pour filtrer des lignes selon des conditions et reste plus simple à lire pour un
débutant. Dès qu’il faut regrouper, totaliser, trier et renommer en même temps, QUERY est plus compact.
</p>
</details>
<details>
<summary>QUERY est-il sensible à la casse ?</summary>
<p>
Oui pour les comparaisons de texte (<code>=</code>, <code>contains</code>, <code>starts with</code>). Pour ignorer
la casse, comparez des versions en minuscules : <code>where lower(B) contains 'julie'</code>.
</p>
</details>
<details>
<summary>QUERY existe-t-il dans Excel ?</summary>
<p>
Non. Dans Excel, on combine plutôt <code>FILTRE</code>, <code>TRIER</code> et les tableaux croisés dynamiques, ou
Power Query pour les transformations plus lourdes.
</p>
</details>
</section>

<p>
QUERY est au programme du niveau N2 « Google Sheets avancé » de la
<a href="/formation-google-sheets/">formation Google Sheets</a>, avec les tableaux croisés dynamiques et
IMPORTRANGE. Pour les formules conditionnelles, voir aussi
<a href="/blog/google-sheets-formule-si-plusieurs-conditions/">la formule SI avec plusieurs conditions</a>.
</p>
