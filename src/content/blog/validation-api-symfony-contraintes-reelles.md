---
title: "Validation d’entrées API Symfony : contraintes qui tiennent en production"
shortTitle: "Validation API Symfony : contraintes prod"
description: "DTO + Validator, normalisation, UUID et messages d’erreur exploitables par les clients — exemples PHP 8 et bonnes pratiques."
pubDate: 2026-03-17
readingTimeMinutes: 12
tags:
  - "Symfony"
  - "API"
  - "PHP"
illustration: validation
---
<aside class="tldr">
<strong>En bref</strong>
Les annotations sur une entité Doctrine ne suffisent pas pour une API : il vous faut des <strong>DTO d’entrée</strong>,
des contraintes qui reflètent le métier (pas seulement <code>NotBlank</code>), et des erreurs normalisées pour que
les clients automatisent la correction.
</aside>

<h2>Pourquoi séparer entité persistence et payload API</h2>
<p>
L’entité ORM porte souvent des champs internes (<code>createdAt</code>, relations lazy, flags techniques). Les exposer
tels quels crée des <strong>fuites de modèle</strong> et des failles de validation (champs modifiables par erreur).
Utilisez un DTO (<code>symfony/validator</code>) ou une structure dédiée par commande.
</p>

<h2>Exemple : contraintes métier + UUID</h2>
<pre><code>namespace App\\Dto;

use Symfony\\Component\\Validator\\Constraints as Assert;
use Symfony\\Component\\Uid\\Uuid;

final class CreateTransferRequest
{
    public function __construct(
        #[Assert\\NotBlank]
        #[Assert\\Uuid]
        public string $fromAccountId,

        #[Assert\\NotBlank]
        #[Assert\\Uuid]
        public string $toAccountId,

        #[Assert\\Positive]
        public string $amountCents,
    ) {}
}</code></pre>
<p>
<code>amountCents</code> en chaîne est volontaire : beaucoup de payloads JSON numériques perdent la précision décimale ;
pour la monnaie, <strong>entier + échelle</strong> ou décimal sérialisé en string sont des patterns éprouvés. Adaptez à
votre norme interne, mais évitez le flottant nu.
</p>

<h2>Normaliser les erreurs (422)</h2>
<p>
Retournez une structure stable : tableau de violations avec <code>path</code> + <code>message</code> + éventuellement
<code>code</code> machine-lisible. Les assistants et les générateurs de clients s’appuient sur cette régularité.
</p>
<pre><code>{
  "type": "https://symfony.com/errors/validation",
  "title": "Validation Failed",
  "status": 422,
  "violations": [
    { "path": "fromAccountId", "message": "This value is not a valid UUID.", "code": "INVALID_UUID" }
  ]
}</code></pre>

<h2>Couche HTTP Symfony</h2>
<p>
<code>MapRequestPayload</code> (Symfony 6.3+) ou un <code>ArgumentValueResolver</code> personnalisé permet de
déclencher la validation avant le contrôleur et de centraliser le mapping erreur → réponse. L’important est que
<strong>tous les endpoints passent par le même pipeline</strong> — sinon la doc ment et les clients cassent au hasard.
</p>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Valider en JavaScript côté front suffit ?</summary>
<p>
Non : c’est une aide UX. La validation serveur reste la source de vérité (sécurité, intégrité, évolutions
multi-clients).
</p>
</details>
<details>
<summary>Faut-il utiliser OpenAPI partout ?</summary>
<p>
Pas obligatoire, mais un contrat formalisé (même léger) améliore SEO technique, onboarding et génération de tests
contractuels.
</p>
</details>
</section>
