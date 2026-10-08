---
title: "RECHERCHEV, RECHERCHEH et RECHERCHEX dans Google Sheets (VLOOKUP, HLOOKUP, XLOOKUP) : guide et exemples"
shortTitle: "RECHERCHEV, RECHERCHEX Google Sheets : guide + exemples"
description: "Aller chercher un prix, un nom ou un taux dans une autre table : la syntaxe de RECHERCHEV, RECHERCHEH et RECHERCHEX, leurs différences, les pièges (FAUX oublié, #N/A, recherche à gauche, colonnes insérées) et quand passer à INDEX/EQUIV, avec des exemples prêts à copier."
metaDescription: "RECHERCHEV, RECHERCHEH ou RECHERCHEX (VLOOKUP, XLOOKUP) dans Google Sheets : syntaxe, exemples à copier, erreur #N/A, recherche à gauche, INDEX/EQUIV."
pubDate: 2026-10-08
readingTimeMinutes: 13
tags:
  - "Google Sheets"
  - "Formules"
  - "RECHERCHEV"
  - "Tutoriel"
illustration: sheets
category: google-sheets
---
<aside class="tldr">
<strong>En bref</strong>
<code>RECHERCHEV</code> cherche une valeur dans la <strong>première colonne</strong> d’une table et renvoie une
autre colonne de la même ligne ; <code>RECHERCHEH</code> fait la même chose à l’horizontale. N’oubliez jamais le
dernier argument <code>FAUX</code>. <code>RECHERCHEX</code> fait tout cela en mieux : correspondance exacte par
défaut, recherche à gauche possible, valeur de repli intégrée. C’est celle que je recommande pour tout nouveau
fichier, avec <code>INDEX</code> + <code>EQUIV</code> pour les tableaux à double entrée.
</aside>

<h2>Noms français, noms anglais</h2>
<p>
Dans un fichier réglé sur la France (<em>Fichier &gt; Paramètres &gt; Paramètres régionaux</em>), les fonctions ont
leur nom français et les arguments se séparent par un <strong>point-virgule</strong>. Si vous trouvez un tutoriel en
anglais, voici les correspondances :
</p>
<table>
<thead><tr><th>Français</th><th>Anglais</th><th>Rôle</th></tr></thead>
<tbody>
<tr><td><code>RECHERCHEV</code></td><td><code>VLOOKUP</code></td><td>Recherche verticale (dans une colonne)</td></tr>
<tr><td><code>RECHERCHEH</code></td><td><code>HLOOKUP</code></td><td>Recherche horizontale (dans une ligne)</td></tr>
<tr><td><code>RECHERCHEX</code></td><td><code>XLOOKUP</code></td><td>Recherche dans n’importe quel sens</td></tr>
<tr><td><code>INDEX</code> / <code>EQUIV</code></td><td><code>INDEX</code> / <code>MATCH</code></td><td>Valeur à une position / position d’une valeur</td></tr>
<tr><td><code>SI.NON.DISP</code> / <code>SIERREUR</code></td><td><code>IFNA</code> / <code>IFERROR</code></td><td>Remplacer une erreur</td></tr>
<tr><td><code>FAUX</code> / <code>VRAI</code></td><td><code>FALSE</code> / <code>TRUE</code></td><td>Valeurs logiques</td></tr>
</tbody>
</table>
<p>Les exemples utilisent un onglet <em>Tarifs</em> fictif :</p>
<table>
<thead><tr><th></th><th>A : Référence</th><th>B : Désignation</th><th>C : Catégorie</th><th>D : Prix HT (€)</th></tr></thead>
<tbody>
<tr><td>2</td><td>P-101</td><td>Clé USB 64 Go</td><td>Accessoires</td><td>12</td></tr>
<tr><td>3</td><td>P-102</td><td>Écran 27 pouces</td><td>Écrans</td><td>189</td></tr>
<tr><td>4</td><td>P-205</td><td>Clavier sans fil</td><td>Accessoires</td><td>35</td></tr>
<tr><td>5</td><td>P-310</td><td>Station d’accueil</td><td>Connectique</td><td>129</td></tr>
</tbody>
</table>

<h2>RECHERCHEV : la recherche verticale</h2>
<pre><code>RECHERCHEV(clé_recherche; plage; index; [est_trié])</code></pre>
<ul>
<li><strong>clé_recherche</strong> : la valeur cherchée, par exemple la référence saisie en <code>G2</code>.</li>
<li>
<strong>plage</strong> : la table, qui doit <strong>commencer par la colonne où l’on cherche</strong>. Si la clé est
en colonne A, la plage commence en A.
</li>
<li><strong>index</strong> : le numéro de la colonne à renvoyer, compté à partir de 1 <em>dans la plage</em>.</li>
<li><strong>est_trié</strong> : <code>FAUX</code> pour une correspondance exacte. À toujours renseigner.</li>
</ul>
<p>Le prix de la référence saisie en <code>G2</code> (P-205) :</p>
<pre><code>=RECHERCHEV(G2; Tarifs!$A$2:$D$5; 4; FAUX)</code></pre>
<p>
Résultat : 35. Les <code>$</code> figent la plage quand vous recopiez la formule vers le bas ; avec des colonnes
entières (<code>Tarifs!A2:D</code>), les nouvelles références sont prises en compte automatiquement.
</p>

<h3>Le piège n° 1 : oublier FAUX</h3>
<p>
Sans quatrième argument, <code>est_trié</code> vaut <code>VRAI</code> : Sheets suppose que la première colonne est
triée et renvoie la valeur la plus proche <strong>inférieure ou égale</strong> à la clé. Cherchez une référence qui
n’existe pas, P-150, et vous n’aurez pas d’erreur : la formule renvoie 189, le prix de P-102, sans rien signaler.
Avec <code>FAUX</code> (ou <code>0</code>), vous obtenez un <code>#N/A</code> honnête. Je n’utilise
<code>VRAI</code> que pour les barèmes par tranches, comme dans l’exemple suivant.
</p>

<h2>RECHERCHEH : la même chose à l’horizontale</h2>
<p>
<code>RECHERCHEH(clé_recherche; plage; index; [est_trié])</code> cherche dans la <strong>première ligne</strong> et
renvoie la ligne numéro <code>index</code>. Elle sert surtout pour les grilles disposées en ligne, comme ce barème de
remise (onglet <em>Remises</em>) :
</p>
<table>
<thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
<tbody>
<tr><td>1</td><td>Quantité minimum</td><td>1</td><td>10</td><td>50</td><td>100</td></tr>
<tr><td>2</td><td>Remise</td><td>0 %</td><td>5 %</td><td>10 %</td><td>15 %</td></tr>
</tbody>
</table>
<pre><code>=RECHERCHEH(C2; Remises!$B$1:$E$2; 2; VRAI)</code></pre>
<p>
Pour 37 unités en <code>C2</code>, la formule renvoie 5 % : 10 est le plus grand seuil inférieur ou égal à 37. C’est
le cas où <code>VRAI</code> est utile, à condition que la ligne des seuils soit <strong>triée par ordre
croissant</strong>.
</p>

<h2>RECHERCHEX : la version moderne</h2>
<p>
Disponible dans Google Sheets depuis 2022, <code>RECHERCHEX</code> sépare la colonne où l’on cherche de celle que l’on
renvoie :
</p>
<pre><code>RECHERCHEX(clé_recherche; plage_recherche; plage_résultats; [valeur_manquante]; [mode_correspondance]; [mode_recherche])</code></pre>
<pre><code>=RECHERCHEX(G2; Tarifs!A2:A; Tarifs!D2:D; "Référence inconnue")</code></pre>
<p>Ce que cela change au quotidien :</p>
<ul>
<li>
<strong>Correspondance exacte par défaut</strong> (<code>mode_correspondance</code> = 0) : le piège du
<code>FAUX</code> oublié disparaît.
</li>
<li><strong>Valeur de repli intégrée</strong> : plus besoin d’envelopper la formule dans <code>SI.NON.DISP</code>.</li>
<li>
<strong>Recherche à gauche</strong> : retrouver la référence à partir de la désignation, impossible avec
<code>RECHERCHEV</code> sans bricolage :
<code>=RECHERCHEX("Clavier sans fil"; Tarifs!B2:B; Tarifs!A2:A)</code> renvoie P-205.
</li>
<li>
<strong>Plusieurs colonnes d’un coup</strong> : <code>=RECHERCHEX(G2; Tarifs!A2:A; Tarifs!B2:D)</code> remplit trois
cellules (désignation, catégorie, prix). Les cellules à droite doivent être vides, sinon <code>#REF!</code>.
</li>
<li>
<strong>Dernière occurrence</strong> : avec <code>mode_recherche</code> à <code>-1</code>, la recherche part du bas.
Pratique pour le dernier prix pratiqué dans un historique :
<code>=RECHERCHEX(G2; Historique!B2:B; Historique!C2:C; "Aucun"; 0; -1)</code>.
</li>
<li>
<strong>Barèmes</strong> : <code>mode_correspondance</code> à <code>-1</code> renvoie la valeur exacte ou, à défaut, la
plus proche inférieure : <code>=RECHERCHEX(C2; Remises!B1:E1; Remises!B2:E2; "Hors grille"; -1)</code>.
</li>
<li>
<strong>Caractères génériques</strong> : <code>mode_correspondance</code> à <code>2</code> permet
<code>=RECHERCHEX("*sans fil*"; Tarifs!B2:B; Tarifs!D2:D; "Aucun"; 2)</code>.
</li>
</ul>
<p>
Seule contrainte : <code>plage_recherche</code> et <code>plage_résultats</code> doivent avoir le même nombre de lignes
(<code>A2:A</code> avec <code>D2:D</code>, pas <code>D1:D</code>).
</p>

<h2>RECHERCHEV, RECHERCHEH, RECHERCHEX ou INDEX/EQUIV ?</h2>
<div class="table-wrap">
<table class="compareTable">
<thead><tr><th></th><th>RECHERCHEV / RECHERCHEH</th><th>RECHERCHEX</th><th>INDEX + EQUIV</th></tr></thead>
<tbody>
<tr><td>Correspondance par défaut</td><td>Approximative (piège)</td><td>Exacte</td><td>Approximative pour EQUIV (mettre 0)</td></tr>
<tr><td>Recherche à gauche</td><td>Non</td><td>Oui</td><td>Oui</td></tr>
<tr><td>Colonne insérée dans la table</td><td>Mauvais résultat possible</td><td>Suit la colonne</td><td>Suit la colonne</td></tr>
<tr><td>Valeur si introuvable</td><td>Avec SI.NON.DISP</td><td>Intégrée</td><td>Avec SI.NON.DISP</td></tr>
<tr><td>Tableau à double entrée</td><td>Peu pratique</td><td>Possible, moins lisible</td><td>Idéal</td></tr>
<tr><td>Fichiers ouverts dans un ancien Excel</td><td>Oui</td><td>Excel 2021 / 365 seulement</td><td>Oui</td></tr>
</tbody>
</table>
</div>

<h2>Les erreurs les plus fréquentes</h2>
<h3>#N/A : la valeur n’est pas trouvée</h3>
<ul>
<li>
<strong>Espaces invisibles</strong> : « P-205 » et « P-205&nbsp;» ne sont pas égaux. Nettoyez la source avec
<code>SUPPRESPACE()</code> ou le menu <em>Données &gt; Nettoyage des données</em>.
</li>
<li>
<strong>Nombre contre texte</strong> : un code client 1024 saisi comme nombre d’un côté et comme texte de l’autre ne
correspond pas. Uniformisez le format de la colonne, ou forcez la clé en texte avec <code>G2&amp;""</code>.
</li>
<li>
<strong>Plage qui ne commence pas à la bonne colonne</strong> (RECHERCHEV) : si la clé est en B, la plage commence en
B.
</li>
<li>
<strong>La valeur n’existe vraiment pas</strong> : c’est le seul cas où il faut masquer l’erreur. Préférez
<code>SI.NON.DISP</code>, qui ne capture que <code>#N/A</code>, à <code>SIERREUR</code>, qui cacherait aussi une
vraie faute de formule :
<code>=SI.NON.DISP(RECHERCHEV(G2; Tarifs!A2:D; 4; FAUX); "Référence inconnue")</code>.
</li>
</ul>

<h3>#REF! : l’index dépasse la plage</h3>
<p>
<code>RECHERCHEV(G2; A2:C; 4; FAUX)</code> demande la 4<sup>e</sup> colonne d’une plage qui n’en compte que trois.
L’index se compte dans la plage, pas depuis la colonne A de la feuille.
</p>

<h3>Le piège silencieux : une colonne insérée</h3>
<p>
Quelqu’un insère une colonne « Fournisseur » entre B et C dans l’onglet <em>Tarifs</em>. La plage devient
<code>A2:E</code>, mais l’index reste 4 : toutes vos formules renvoient désormais la catégorie au lieu du prix, sans
aucune erreur. Deux parades : <code>RECHERCHEX</code>, qui pointe directement sur la colonne des prix, ou un index
calculé à partir de l’en-tête :
</p>
<pre><code>=RECHERCHEV(G2; Tarifs!A2:E; EQUIV("Prix HT (€)"; Tarifs!A1:E1; 0); FAUX)</code></pre>

<h2>INDEX + EQUIV : quand l’utiliser ?</h2>
<p>
<code>EQUIV(clé; plage; 0)</code> renvoie la <strong>position</strong> d’une valeur, <code>INDEX(plage; ligne;
[colonne])</code> renvoie la valeur située à une position. Combinées, elles cherchent dans n’importe quel sens :
</p>
<pre><code>=INDEX(Tarifs!A2:A; EQUIV("Clavier sans fil"; Tarifs!B2:B; 0))</code></pre>
<p>
N’oubliez pas le <code>0</code> d’<code>EQUIV</code> : sans lui, la recherche est approximative, comme avec
<code>RECHERCHEV</code>. Je garde ce duo pour deux cas : les fichiers partagés avec des utilisateurs d’Excel 2019 ou
antérieur, et les <strong>tableaux à double entrée</strong>. Avec les commerciaux en <code>A2:A4</code>, les mois en
<code>B1:M1</code> et les objectifs dans <code>B2:M4</code> :
</p>
<pre><code>=INDEX(B2:M4; EQUIV(G1; A2:A4; 0); EQUIV(G2; B1:M1; 0))</code></pre>
<p>La formule renvoie l’objectif du commercial choisi en <code>G1</code> pour le mois choisi en <code>G2</code>.</p>

<h2>Plusieurs critères et colonnes entières</h2>
<p>
Pour chercher sur deux critères (un client <em>et</em> une région), on concatène les clés de part et d’autre, avec
un séparateur pour éviter les collisions. Avec un onglet <em>Ventes</em> où le client est en A, la région en B et le
montant en E :
</p>
<pre><code>=ARRAYFORMULA(RECHERCHEX(G2&amp;"|"&amp;H2; Ventes!A2:A&amp;"|"&amp;Ventes!B2:B; Ventes!E2:E; "Introuvable"))</code></pre>
<p>
Pour remplir toute une colonne avec une seule formule plutôt que de la recopier sur des milliers de lignes, enveloppez
la recherche dans <code>ARRAYFORMULA</code> :
</p>
<pre><code>=ARRAYFORMULA(SI(A2:A=""; ""; SI.NON.DISP(RECHERCHEV(A2:A; Tarifs!A2:D; 4; FAUX); "Inconnue")))</code></pre>
<p>
Le fonctionnement d’<code>ARRAYFORMULA</code>, et de <code>MAP</code> quand elle ne suffit pas, est détaillé dans le
guide <a href="/blog/arrayformula-map-makearray-google-sheets/">ARRAYFORMULA, MAP et MAKEARRAY</a>.
</p>

<h2>Ma recommandation</h2>
<ul>
<li><strong>Nouveau fichier</strong> : <code>RECHERCHEX</code>, systématiquement.</li>
<li>
<strong>Fichier existant plein de RECHERCHEV</strong> : inutile de tout réécrire ; vérifiez seulement que chaque
formule se termine par <code>FAUX</code>.
</li>
<li>
<strong>Tableau à double entrée ou compatibilité avec un ancien Excel</strong> : <code>INDEX</code> +
<code>EQUIV</code>.
</li>
<li>
<strong>Plusieurs lignes à renvoyer</strong> (toutes les ventes d’un client) : ni l’une ni l’autre, qui ne renvoient
que la première correspondance. Passez à <code>FILTER</code> ou à la
<a href="/blog/fonction-query-google-sheets/">fonction QUERY</a>.
</li>
</ul>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Pourquoi ma RECHERCHEV renvoie-t-elle une mauvaise valeur sans erreur ?</summary>
<p>
Presque toujours parce que le dernier argument manque ou vaut <code>VRAI</code> : la recherche est alors approximative.
Ajoutez <code>FAUX</code>. Deuxième cause : une colonne insérée qui décale l’index.
</p>
</details>
<details>
<summary>RECHERCHEV fait-elle la différence entre majuscules et minuscules ?</summary>
<p>
Non : « p-205 » trouve « P-205 ». <code>RECHERCHEX</code> non plus. Si la casse compte, utilisez
<code>FILTER</code> avec <code>EXACT()</code>.
</p>
</details>
<details>
<summary>Peut-on faire une RECHERCHEV dans un autre fichier Google Sheets ?</summary>
<p>
Oui, en plaçant <code>IMPORTRANGE("url_du_fichier"; "Tarifs!A2:D")</code> à la place de la plage. La première fois,
Sheets demande d’autoriser l’accès entre les deux fichiers. Si la table est grosse, importez-la une seule fois dans un
onglet plutôt que dans chaque formule.
</p>
</details>
<details>
<summary>RECHERCHEX existe-t-elle dans Excel ?</summary>
<p>
Oui, sous le même nom dans Excel 2021 et Microsoft 365, avec des arguments très proches. Elle n’existe pas dans Excel
2019 et les versions antérieures : un fichier exporté vers ces versions affichera des erreurs.
</p>
</details>
</section>

<p>
<code>RECHERCHEX</code>, <code>INDEX</code>/<code>EQUIV</code> et <code>IMPORTRANGE</code> sont au programme du
niveau N2 « Google Sheets avancé » de la <a href="/formation-google-sheets/">formation Google Sheets</a>, travaillées
directement sur les fichiers de votre équipe. Si vos tables de référence vivent dans plusieurs fichiers recopiés à la main, l’étape suivante est souvent
de les <a href="/automatisation-google-sheets/">automatiser</a>. Pour les formules conditionnelles, voir aussi
<a href="/blog/google-sheets-formule-si-plusieurs-conditions/">la formule SI avec plusieurs conditions</a>.
</p>
