---
title: "API et données personnelles : minimisation, journaux et rétention"
shortTitle: "API & données perso : minimisation RGPD"
description: "DTO publics, pseudonymisation dans les logs, durées de conservation et documentation pour limiter les risques RGPD."
pubDate: 2026-03-18
readingTimeMinutes: 10
tags:
  - "API"
  - "RGPD"
  - "Sécurité"
illustration: privacy
---
<aside class="tldr">
<strong>En bref</strong>
Une API qui renvoie « tout le modèle » multiplie les risques : fuite, journalisation abusive, durée de conservation
floue. La <strong>minimisation</strong> (champs strictement nécessaires + séparation interne / public) est le levier
le plus rentable avant les audits lourds.
</aside>

<h2>DTO de sortie vs entité Doctrine</h2>
<p>
L’entité peut contenir email, téléphone, métadonnées internes. Le JSON public doit passer par un
<strong>DTO ou serializer dédié</strong> qui n’expose que les champs prévus par le contrat (OpenAPI).
</p>

<h2>Journaux et traçabilité</h2>
<ul>
<li>Ne pas logger les corps de requête contenant mot de passe, token ou données de santé en clair.</li>
<li>Préférer un <strong>identifiant technique</strong> (UUID utilisateur) aux emails dans les messages d’erreur.</li>
<li>Durée de rétention des logs alignée sur la politique interne et le registre des traitements.</li>
</ul>

<h2>Exemple PHP : projection minimale</h2>
<pre><code>final class PublicUserView
{
    public function __construct(
        public readonly string $id,
        public readonly string $displayName,
    ) {}
}

// Ne jamais sérialiser User $entity directement en JSON public.</code></pre>

<h2>Documentation interne</h2>
<p>
Listez les endpoints qui traitent des données personnelles, la base légale (contrat, obligation, intérêt légitime…),
les sous-traitants (hébergeur, emailing) et les transferts hors UE. Cela aide le DPO et accélère les réponses aux
personnes concernées.
</p>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>Le RGPD impose-t-il un format d’API précis ?</summary>
<p>
Non : il impose des principes (minimisation, sécurité, transparence). La mise en œuvre technique reste à vous,
mais les mauvaises pratiques d’exposition et de logs sont souvent relevées en contrôle.
</p>
</details>
<details>
<summary>Anonymisation vs pseudonymisation ?</summary>
<p>
La pseudonymisation réduit le risque mais les données restent personnelles si la ré-identification est possible
avec d’autres jeux. L’anonymisation est irréversible — plus rare en API métier vivante.
</p>
</details>
</section>
