---
title: "Refonte Symfony ou évolutions ciblées : critères opposables en cadrage"
description: "Comment trancher entre gros chantier et itérations : dette mesurable, risques métier, coût marginal d’une feature — avec repères concrets pour un cadrage freelance."
pubDate: 2026-03-17
readingTimeMinutes: 11
tags:
  - "Symfony"
  - "Architecture"
  - "Cadrage"
illustration: refonte
---
<aside class="tldr">
<strong>En bref</strong>
La « bonne » réponse dépend du coût marginal d’une nouvelle fonctionnalité, de la probabilité de régression et de ce
que le métier accepte comme dette visible — pas d’un slogan « toujours refaire » ou « jamais toucher ».
</aside>

<h2>Ce que cette note ne fait pas</h2>
<p>
Elle ne remplace pas un audit sur votre codebase réelle. Elle fournit des <strong>critères opposables</strong> en
atelier : vous pouvez les noter sur un tableau blanc et aboutir à une décision traçable (utile en freelance comme en
comité interne).
</p>

<h2>Trois signaux qui penchent vers des évolutions ciblées</h2>
<ul>
<li>
<strong>Les tests (même minimaux) existent sur la zone concernée</strong> — ou peuvent être ajoutés en une
itération courte sans mock titanesque.
</li>
<li>
<strong>Le périmètre fonctionnel est clair</strong> : une file d’attente de tickets rédigés comme des scénarios
reproductibles, pas une liste de « sensations ».
</li>
<li>
<strong>Les dépendances Symfony / PHP sont encore dans une branche maintenue</strong> : montée de version
incrémentale possible sans sauter trois LTS d’un coup.
</li>
</ul>

<h2>Trois signaux qui justifient une refonte (ou un morcellement)</h2>
<ul>
<li>
<strong>Couplage métier / infrastructure illisible</strong> : la même couche mélange règles fiscaires, accès
SQL brut, appels HTTP et configuration — aucun test ne peut être écrit sans simuler demi-prod.
</li>
<li>
<strong>Coût marginal d’une feature qui explose</strong> : chaque évolution touche 12 fichiers et crée des régressions
hors périmètre (symptôme fréquent de « big ball of mud »).
</li>
<li>
<strong>Contrainte de conformité ou sécurité non rattrapable</strong> : sessions, journalisation, droits — quand la
remédiation itérative coûte plus cher que réécrire un module borné.
</li>
</ul>

<h2>Technique : encapsuler avant de « tout jeter »</h2>
<p>
Avant de lancer un big bang, un pattern utile sous Symfony consiste à <strong>borner le legacy</strong> derrière un
service applicatif ou une façade, puis faire passer les nouveaux cas par du code testable :
</p>
<pre><code>// Exemple d'intention : façade injectable, tests sur le contrat.
namespace App\\Pricing;

interface QuoteEngineInterface {
    public function forOrder(OrderId $id): Quote;
}

final readonly class LegacyBackedQuoteEngine implements QuoteEngineInterface {
    public function __construct(private LegacyPricingFacade $inner) {}

    public function forOrder(OrderId $id): Quote {
        return $this-&gt;inner-&gt;buildQuote($id);
    }
}</code></pre>
<p>
L’intérêt n’est pas la longueur du snippet — c’est le <strong>contrat</strong> : vous pouvez écrire un test sur
<code>QuoteEngineInterface</code> et remplacer l’implémentation legacy plus tard sans arrêter le produit.
</p>

<h2>Comment j’utilise ce cadre en cadrage client</h2>
<p>
Je demande systématiquement une estimation en <strong>jours / semaines</strong> pour trois scénarios : patch ciblé,
refactor de module, réécriture bornée — avec les hypothèses écrites (périmètre, risque métier, fenêtre de déploiement).
Si les ordres de grandeur divergent d’un facteur 3 ou plus, on creuse avant de choisir.
</p>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Faut-il toujours monter de version Symfony avant de refaire ?</summary>
<p>
Pas « toujours », mais une LTS récente réduit le risque et clarifie les chemins de migration (composants
dépréciés documentés). À défaut, documentez explicitement la dette de version comme risque projet.
</p>
</details>
<details>
<summary>Les microservices règlent-ils le problème ?</summary>
<p>
Souvent non : sans frontières métier claires, on duplique le chaos réparti. Un monolithe modulaire bien borné
reste souvent plus simple à faire évoluer pour une PME.
</p>
</details>
</section>
