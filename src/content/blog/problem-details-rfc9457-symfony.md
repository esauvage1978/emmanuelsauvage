---
title: "RFC 9457 (Problem Details) et Symfony : erreurs API lisibles et stables"
description: "Format application/problem+json, champs type/title/status/instance, mapping des exceptions Symfony vers des réponses cohérentes pour les clients."
pubDate: 2026-03-18
readingTimeMinutes: 9
tags:
  - "API"
  - "HTTP"
  - "Symfony"
illustration: problem
---
<aside class="tldr">
<strong>En bref</strong>
Les clients d’API ont besoin d’erreurs <strong>prévisibles</strong> : code HTTP + corps JSON structuré. La RFC 9457
(Problem Details) formalise <code>application/problem+json</code> avec au minimum <code>type</code>,
<code>title</code> et <code>status</code>. Sous Symfony, on mappe exceptions → payload stable, sans exposer la pile
technique.
</aside>

<h2>Pourquoi ne pas renvoyer du JSON « maison » à chaque fois ?</h2>
<p>
Sans convention, chaque endpoint invente ses clés (<code>error</code>, <code>message</code>, <code>errors[]</code>…).
Les SDK et les intégrations deviennent fragiles. Problem Details donne un <strong>contrat minimal</strong> reconnu par
les outils et les humains.
</p>

<h2>Champs utiles en pratique</h2>
<ul>
<li>
<code>type</code> : URI (souvent sous votre domaine) identifiant la classe d’erreur — stable dans le temps.
</li>
<li><code>title</code> : libellé court, lisible ; peut être localisé si vous versionnez l’API.</li>
<li><code>status</code> : redondance explicite avec le code HTTP (422, 404, 409…).</li>
<li>
<code>detail</code> : message contextuel (éviter les données sensibles ; préférer un identifiant de corrélation).
</li>
<li><code>instance</code> : URI de la requête fautive ou id de trace pour le support.</li>
</ul>

<h2>Exemple de corps 422 (validation)</h2>
<pre><code>{
  "type": "https://api.example.com/problems/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "One or more fields are invalid.",
  "instance": "/v1/orders",
  "errors": [
    { "field": "email", "code": "invalid_format" }
  ]
}</code></pre>
<p>
Le tableau <code>errors</code> est une <strong>extension</strong> courante (non obligatoire dans la RFC) : documentez-la
dans votre spec OpenAPI.
</p>

<h2>Symfony : JsonResponse typée</h2>
<pre><code>use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

$body = [
    'type' =&gt; 'https://api.example.com/problems/not-found',
    'title' =&gt; 'Resource Not Found',
    'status' =&gt; Response::HTTP_NOT_FOUND,
    'detail' =&gt; 'No order matches this id.',
    'instance' =&gt; $request-&gt;getRequestUri(),
];

return new JsonResponse(
    $body,
    Response::HTTP_NOT_FOUND,
    ['Content-Type' =&gt; 'application/problem+json']
);</code></pre>

<h2>Listener d’exception</h2>
<p>
Centralisez la traduction <code>ValidationFailedException</code> → 422, <code>EntityNotFound</code> → 404, erreurs
métier → 409, etc. Gardez un <strong>seul</strong> format de sortie pour toute l’API.
</p>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Faut-il toujours utiliser application/problem+json ?</summary>
<p>
Recommandé pour les erreurs ; pour les réponses 2xx vous gardez votre schéma métier. L’important est la
<strong>cohérence</strong> des erreurs sur tout le périmètre API.
</p>
</details>
<details>
<summary>Et les erreurs Symfony Validator en tableau ?</summary>
<p>
Normalisez-les dans une extension (<code>violations</code> ou <code>errors</code>) avec codes stables, pas seulement
les messages traduits — les clients s’appuient sur les codes.
</p>
</details>
</section>
