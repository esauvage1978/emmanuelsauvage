---
title: "ARRAYFORMULA, MAP et MAKEARRAY dans Google Sheets : une seule formule pour toute la colonne (avec LAMBDA)"
shortTitle: "ARRAYFORMULA, MAP, MAKEARRAY Google Sheets : exemples"
description: "Arrêter de recopier une formule sur des milliers de lignes : ce que font ARRAYFORMULA, MAP, BYROW et MAKEARRAY avec LAMBDA, quand utiliser l’une ou l’autre, les pièges (#REF!, ET/OU, lignes vides) et l’impact sur les performances, avec des exemples prêts à copier."
metaDescription: "ARRAYFORMULA, MAP, MAKEARRAY et LAMBDA dans Google Sheets : une formule pour toute la colonne, exemples à copier, pièges et performances."
pubDate: 2026-10-08
readingTimeMinutes: 13
tags:
  - "Google Sheets"
  - "Formules"
  - "ARRAYFORMULA"
  - "Tutoriel"
illustration: sheets
category: google-sheets
---
<aside class="tldr">
<strong>En bref</strong>
<code>ARRAYFORMULA</code> calcule toute une colonne avec <strong>une seule formule</strong>, placée en haut :
les nouvelles lignes sont prises en compte automatiquement et personne ne casse une formule recopiée. Quand une
fonction refuse de travailler ligne par ligne (<code>ET</code>, <code>OU</code>, <code>SOMME</code>…),
<code>MAP</code> applique une <code>LAMBDA</code> à chaque cellule et <code>BYROW</code> à chaque ligne.
<code>MAKEARRAY</code>, enfin, construit un tableau de la taille de votre choix, case par case.
</aside>

<h2>Le problème : une formule recopiée sur 3 000 lignes</h2>
<p>
Dans la plupart des fichiers que je vois en formation, chaque colonne calculée contient la même formule recopiée
jusqu’en bas. Cela pose trois problèmes : les lignes ajoutées par un formulaire ou un collègue n’ont pas la formule, il
suffit d’une saisie par-dessus pour fausser un total sans que personne ne le voie, et le fichier s’alourdit. La
solution : une formule unique en tête de colonne, qui « déborde » sur toutes les lignes.
</p>
<p>
Ces fonctions gardent leur nom anglais dans un fichier réglé sur la France (<code>ARRAYFORMULA</code>,
<code>MAP</code>, <code>MAKEARRAY</code>, <code>LAMBDA</code>, <code>BYROW</code>), mais les fonctions qu’elles
contiennent restent en français (<code>SI</code>, <code>SOMME</code>…) et les arguments se séparent par un
point-virgule. Les exemples utilisent ce tableau de commandes fictif :
</p>
<table>
<thead><tr><th></th><th>A : Client</th><th>B : Région</th><th>C : Quantité</th><th>D : Prix unitaire (€)</th><th>E : Statut</th><th>F : Montant HT (€)</th></tr></thead>
<tbody>
<tr><td>2</td><td>Dupont</td><td>Nord</td><td>10</td><td>120</td><td>Payé</td><td>1 200</td></tr>
<tr><td>3</td><td>Martin</td><td>Sud</td><td>3</td><td>150</td><td>En attente</td><td>450</td></tr>
<tr><td>4</td><td>Leroy</td><td>Nord</td><td>20</td><td>190</td><td>En attente</td><td>3 800</td></tr>
<tr><td>5</td><td>Petit</td><td>Est</td><td>2</td><td>45</td><td>Payé</td><td>90</td></tr>
</tbody>
</table>

<h2>ARRAYFORMULA : une formule pour toute la colonne</h2>
<p>
<code>ARRAYFORMULA(formule_matricielle)</code> permet d’utiliser des plages entières là où une formule attend
normalement une seule cellule. La colonne F ci-dessus est calculée par une seule formule en <code>F2</code> :
</p>
<pre><code>=ARRAYFORMULA(SI(A2:A=""; ""; C2:C*D2:D))</code></pre>
<ul>
<li><code>C2:C*D2:D</code> multiplie les deux colonnes ligne à ligne.</li>
<li>
<code>SI(A2:A=""; ""; …)</code> laisse vides les lignes sans client. Sans ce test, la formule afficherait des 0
jusqu’en bas de la feuille.
</li>
<li>Raccourci : <strong>Ctrl + Maj + Entrée</strong> pendant la saisie ajoute <code>ARRAYFORMULA(</code> automatiquement.</li>
</ul>
<p>
Astuce : placez la formule <strong>dans la ligne d’en-tête</strong>, avec le titre, pour que le tri ou l’insertion de
lignes ne puisse jamais la déplacer :
</p>
<pre><code>={"Montant HT"; ARRAYFORMULA(SI(A2:A=""; ""; C2:C*D2:D))}</code></pre>
<p>
Dans un fichier réglé sur la France, le point-virgule entre les accolades empile les éléments verticalement : le titre
en F1, les montants en dessous. La même logique fonctionne avec une TVA à 20 % (<code>F2:F*1,2</code> : la virgule est
le séparateur décimal) ou une recherche dans une autre table (voir le
<a href="/blog/recherchev-recherchex-google-sheets/">guide RECHERCHEV et RECHERCHEX</a>).
</p>

<h3>Ce qui ne marche pas dans ARRAYFORMULA</h3>
<p>
Les fonctions qui <strong>agrègent</strong> une plage (<code>SOMME</code>, <code>MOYENNE</code>, <code>MAX</code>,
<code>NBVAL</code>…) renvoient un seul résultat pour toute la plage, pas un par ligne. C’est aussi le cas de
<code>ET</code> et <code>OU</code> : <code>ARRAYFORMULA(SI(ET(B2:B="Nord"; F2:F&gt;=1000); …))</code> ne teste pas
chaque ligne. Deux solutions : remplacer <code>ET</code> par une multiplication et <code>OU</code> par une addition,
comme expliqué dans l’article sur la
<a href="/blog/google-sheets-formule-si-plusieurs-conditions/">formule SI à plusieurs conditions</a>, ou passer à
<code>MAP</code>.
</p>

<h2>LAMBDA en deux minutes</h2>
<p>
<code>LAMBDA(nom; expression)</code> définit une petite fonction : <code>nom</code> est une étiquette que vous
choisissez, <code>expression</code> le calcul qui l’utilise. Seule, elle sert peu ; son intérêt est d’être passée à
<code>MAP</code>, <code>BYROW</code>, <code>BYCOL</code> ou <code>MAKEARRAY</code>, qui l’appliquent à chaque élément.
Règle à connaître : le nom ne doit pas ressembler à une référence de cellule. <code>montant</code> ou
<code>ligne</code> fonctionnent, <code>x1</code> ou <code>TVA1</code> non (ce sont des adresses de cellules).
</p>

<h2>MAP : appliquer une formule à chaque cellule</h2>
<pre><code>MAP(tableau1; [tableau2; …]; LAMBDA(nom1; [nom2; …]; expression))</code></pre>
<p>
<code>MAP</code> parcourt les plages en parallèle et donne à la <code>LAMBDA</code> une valeur de chaque plage à la
fois. Il faut autant de noms dans la <code>LAMBDA</code> que de plages, et les plages doivent avoir la même taille.
Comme le calcul se fait cellule par cellule, <code>ET</code> et <code>OU</code> fonctionnent normalement :
</p>
<pre><code>=MAP(B2:B; F2:F; LAMBDA(region; montant; SI(montant=""; ""; SI(ET(region="Nord"; montant&gt;=1000); "Prioritaire"; ""))))</code></pre>
<p>
Résultat : « Prioritaire » pour Dupont et Leroy, rien pour les autres. Autre usage typique : un calcul par élément
d’une liste. Avec la liste des clients en <code>H2:H</code> (par exemple <code>=UNIQUE(A2:A)</code>), le chiffre
d’affaires de chacun :
</p>
<pre><code>=MAP(H2:H; LAMBDA(client; SI(client=""; ""; SOMME.SI.ENS(F2:F; A2:A; client))))</code></pre>
<p>
Chaque appel doit renvoyer <strong>une seule valeur</strong>. Une <code>LAMBDA</code> qui renvoie plusieurs cellules
(un <code>SPLIT</code>, par exemple) provoque une erreur.
</p>

<h3>BYROW et BYCOL : une valeur par ligne ou par colonne</h3>
<p>
Pour totaliser chaque ligne, ce que <code>ARRAYFORMULA(SOMME(…))</code> ne sait pas faire, <code>BYROW</code> passe
une ligne entière à la <code>LAMBDA</code>. Avec des quantités mensuelles en <code>G2:I</code> :
</p>
<pre><code>=BYROW(G2:I; LAMBDA(ligne; SI(NBVAL(ligne)=0; ""; SOMME(ligne))))</code></pre>
<p><code>BYCOL</code> fait la même chose colonne par colonne, par exemple pour un total ou un maximum par mois.</p>

<h2>MAKEARRAY : construire un tableau case par case</h2>
<pre><code>MAKEARRAY(lignes; colonnes; LAMBDA(ligne; colonne; expression))</code></pre>
<p>
<code>MAKEARRAY</code> crée un tableau de la taille demandée et calcule chaque case à partir de son numéro de ligne et
de colonne (qui commencent à 1). Premier exemple, un calendrier de 5 semaines démarrant le lundi 2 novembre 2026
(cellules au format date) :
</p>
<pre><code>=MAKEARRAY(5; 7; LAMBDA(semaine; jour; DATE(2026; 11; 2) + (semaine - 1) * 7 + jour - 1))</code></pre>
<p>
Second exemple, plus utile au quotidien : un tableau de synthèse dont <strong>vous fixez les lignes et les
colonnes</strong>. Avec les régions en <code>H2:H4</code> (Nord, Sud, Est) et les statuts en <code>I1:J1</code>
(Payé, En attente), la formule en <code>I2</code> remplit toute la grille :
</p>
<pre><code>=MAKEARRAY(LIGNES(H2:H4); COLONNES(I1:J1); LAMBDA(ligne; colonne; SOMME.SI.ENS(F2:F; B2:B; INDEX(H2:H4; ligne; 1); E2:E; INDEX(I1:J1; 1; colonne))))</code></pre>
<table>
<thead><tr><th></th><th>Payé</th><th>En attente</th></tr></thead>
<tbody>
<tr><td>Nord</td><td>1 200</td><td>3 800</td></tr>
<tr><td>Sud</td><td>0</td><td>450</td></tr>
<tr><td>Est</td><td>90</td><td>0</td></tr>
</tbody>
</table>
<p>
Un tableau croisé dynamique ou un <code>pivot</code> de la <a href="/blog/fonction-query-google-sheets/">fonction
QUERY</a> donne un résultat proche, mais la présentation suit les données. Avec <code>MAKEARRAY</code>, la grille
reste identique d’un mois à l’autre, zéros compris : pratique pour un tableau de bord où chaque case est reprise
ailleurs.
</p>

<h2>Laquelle choisir ?</h2>
<div class="table-wrap">
<table class="compareTable">
<thead><tr><th>Besoin</th><th>Fonction</th></tr></thead>
<tbody>
<tr><td>Calcul simple ligne à ligne (opérations, SI, RECHERCHEV, texte)</td><td><code>ARRAYFORMULA</code></td></tr>
<tr><td>Logique avec ET / OU ou fonction qui agrège, appliquée à chaque cellule</td><td><code>MAP</code></td></tr>
<tr><td>Une valeur par ligne (total, maximum, nombre de cases remplies)</td><td><code>BYROW</code></td></tr>
<tr><td>Une valeur par colonne</td><td><code>BYCOL</code></td></tr>
<tr><td>Grille de taille fixe calculée case par case</td><td><code>MAKEARRAY</code></td></tr>
<tr><td>Simple suite de nombres ou de dates</td><td><code>SEQUENCE</code>, plus simple que MAKEARRAY</td></tr>
</tbody>
</table>
</div>

<h2>Les pièges les plus fréquents</h2>
<ul>
<li>
<strong><code>#REF!</code> : le résultat ne peut pas s’étendre.</strong> Une cellule de la zone de débordement
contient déjà quelque chose, souvent une ancienne formule recopiée ou une saisie manuelle. Videz la colonne sous la
formule.
</li>
<li>
<strong>Plages de tailles différentes</strong> : <code>MAP(B2:B; F3:F; …)</code> renvoie une erreur. Commencez
toutes les plages sur la même ligne.
</li>
<li>
<strong>Nombre de noms incorrect</strong> : deux plages dans <code>MAP</code>, deux noms dans la
<code>LAMBDA</code> ; <code>MAKEARRAY</code> en attend toujours deux (ligne et colonne), <code>BYROW</code> un seul.
</li>
<li>
<strong>Lignes vides</strong> : sans test <code>SI(…=""; ""; …)</code>, les formules remplissent la feuille de 0 ou
d’erreurs jusqu’en bas.
</li>
<li>
<strong>Données saisies dans la colonne calculée</strong> : une colonne produite par <code>ARRAYFORMULA</code> ne se
modifie pas à la main. Protégez-la (<em>Données &gt; Protéger les feuilles et les plages</em>) si plusieurs personnes
travaillent dans le fichier.
</li>
<li>
<strong>Export vers Excel</strong> : <code>ARRAYFORMULA</code> n’existe pas dans Excel, qui gère les plages
autrement. <code>LAMBDA</code>, <code>MAP</code>, <code>BYROW</code> et <code>MAKEARRAY</code> existent dans
Microsoft 365, mais vérifiez toujours un fichier exporté.
</li>
</ul>

<h2>Et les performances ?</h2>
<p>
Une formule unique est en général plus légère que des milliers de formules recopiées. Deux réserves toutefois. D’abord,
une plage ouverte comme <code>A2:A</code> inclut <strong>toutes les lignes de la feuille</strong>, vides comprises :
supprimez les milliers de lignes vides inutiles en bas de l’onglet. Ensuite, <code>MAP</code> et
<code>MAKEARRAY</code> recalculent leur <code>LAMBDA</code> pour chaque case : si cette <code>LAMBDA</code> parcourt
elle-même une colonne entière (un <code>SOMME.SI.ENS</code> sur <code>F2:F</code>, par exemple), le nombre de calculs
est multiplié d’autant. Sur de gros volumes, Sheets peut alors devenir lent, voire refuser le calcul.
</p>
<p>
Mes règles pratiques : <code>ARRAYFORMULA</code> pour tout ce qui peut s’écrire en opérations colonne par colonne,
<code>MAP</code> seulement pour la logique qui ne le peut pas, des plages bornées quand le volume dépasse quelques
milliers de lignes, et pas de fonctions recalculées en permanence (<code>MAINTENANT</code>,
<code>AUJOURDHUI</code>, <code>ALEA</code>) à l’intérieur d’une <code>LAMBDA</code>. Au-delà de quelques dizaines de
milliers de lignes, le problème n’est souvent plus la formule : c’est le moment de
<a href="/automatisation-google-sheets/">déplacer une partie du calcul dans un script</a>, avec la
<a href="/formation-apps-script/">formation Apps Script</a> ou en me confiant l’automatisation.
</p>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>ARRAYFORMULA ou formule recopiée vers le bas : que choisir ?</summary>
<p>
<code>ARRAYFORMULA</code> dès que le tableau grandit (formulaire, import, saisie par plusieurs personnes) : une seule
formule à maintenir, et aucune ligne oubliée. La formule recopiée reste acceptable pour un petit tableau figé.
</p>
</details>
<details>
<summary>Quelle différence entre MAP et ARRAYFORMULA ?</summary>
<p>
<code>ARRAYFORMULA</code> applique des opérations à des plages entières ; <code>MAP</code> appelle une
<code>LAMBDA</code> pour chaque cellule. <code>MAP</code> est plus souple (<code>ET</code>, <code>OU</code> et
fonctions d’agrégation fonctionnent), <code>ARRAYFORMULA</code> plus simple à lire et généralement plus rapide.
</p>
</details>
<details>
<summary>Pourquoi mon ARRAYFORMULA renvoie-t-elle #REF! ?</summary>
<p>
Parce qu’une cellule de la zone où le résultat doit s’afficher n’est pas vide. Survolez l’erreur : Sheets indique la
cellule qui bloque. Videz-la, ainsi que les autres cellules de la colonne.
</p>
</details>
<details>
<summary>Peut-on réutiliser une LAMBDA dans plusieurs formules ?</summary>
<p>
Oui, avec les fonctions nommées (<em>Données &gt; Fonctions nommées</em>) : vous enregistrez le calcul sous un nom,
puis vous le passez directement à <code>MAP</code> ou <code>BYROW</code>, sans parenthèses.
</p>
</details>
</section>

<p>
<code>ARRAYFORMULA</code>, <code>LET</code> et <code>LAMBDA</code> sont au programme du niveau N3 « Expert » de la
<a href="/formation-google-sheets/">formation Google Sheets</a>, consacré aux tableaux de bord et aux modèles robustes,
travaillés sur les fichiers de votre équipe. Pour la suite, lisez aussi le guide de la
<a href="/blog/fonction-query-google-sheets/">fonction QUERY</a>.
</p>
