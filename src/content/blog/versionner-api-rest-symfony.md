---
title: "Versionner une API REST avec Symfony : URL, en-têtes et déploiement"
description: "Comparaison praticable URI /v1 vs négociation par en-têtes, impacts cache et clients, extraits routes et contrôleurs Symfony."
pubDate: 2026-03-17
readingTimeMinutes: 10
tags:
  - "API REST"
  - "Symfony"
  - "HTTP"
illustration: api
---
<aside class="tldr">
<strong>En bref</strong>
Deux familles dominantes : <strong>version dans l’URL</strong> (<code>/api/v1/…</code>) et
<strong>négociation par en-têtes</strong> (<code>Accept</code> / vendor media type). Le bon choix dépend surtout de
vos caches HTTP, de vos générateurs de clients et de la maturité de vos consommateurs.
</aside>

<h2>Version dans le chemin (URI)</h2>
<p>
Exemple : <code>/api/v1/invoices</code>, <code>/api/v2/invoices</code>. Avantages : lisible dans les logs, facile à
routager dans Symfony (<code>prefix</code> / attributs de route), compatible avec des règles de cache CDN très
explicites. Inconvénient : les URL « vivent » longtemps — il faut une politique de décommission claire.
</p>
<pre><code># config/routes.yaml (extrait illustratif)
api_v1:
    resource: ../src/Controller/Api/V1/
    type: attribute
    prefix: /api/v1

api_v2:
    resource: ../src/Controller/Api/V2/
    type: attribute
    prefix: /api/v2</code></pre>

<h2>Version par en-tête ou media type</h2>
<p>
Exemple : <code>Accept: application/vnd.example.v2+json</code>. Utile quand vous voulez une URL stable et que vos
clients savent configurer des en-têtes (peu fréquent côté navigateur pur, plus courant serveur-à-serveur). Symfony
peut discriminer via <code>Request::getPreferredFormat()</code> ou des <code>RequestMatcher</code> — mais la
documentation OpenAPI doit être irréprochable sinon les intégrations dérivent.
</p>

<h2>Ce que les proxies et caches voient</h2>
<p>
Si une ressource change de forme sans changer d’URL ni d’en-tête de variance, vous risquez des
<strong>réponses mises en cache incohérentes</strong>. Avec URI versionnée, la clé de cache est naturellement séparée.
Avec <code>Accept</code>, configurez <code>Vary: Accept</code> et vérifiez le comportement de votre CDN.
</p>

<h2>Contrôleur : garder le métier partagé</h2>
<p>
Anti-pattern fréquent : dupliquer 80 % de la logique entre V1 et V2. Mieux : services applicatifs stables, adapters
minces par version pour la forme de la réponse :
</p>
<pre><code>// Pseudo-code : même service, représentation différente.
final class InvoiceController {
    public function __construct(private InvoiceRepository $repo) {}

    #[Route('/invoices/{id}', methods: ['GET'])]
    public function showV1(string $id, InvoiceV1Normalizer $n): JsonResponse {
        return new JsonResponse($n-&gt;normalize($this-&gt;repo-&gt;get(Uuid::fromString($id))));
    }
}</code></pre>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Faut-il supporter V1 indéfiniment ?</summary>
<p>
Non : fixez une <strong>date ou une release</strong> de fin, communiquez-la dans la doc et renvoyez des en-têtes
<code>Deprecation</code> / <code>Sunset</code> lorsque pertinent pour les clients API.
</p>
</details>
<details>
<summary>GraphQL remplace-t-il le versionnement REST ?</summary>
<p>
Ce sont des compromis différents : GraphQL déplace la complexité (schéma, N+1, auth par champ). Ce n’est pas un
raccourci magique pour éviter le contrat et la compatibilité.
</p>
</details>
</section>
