---
title: "Webhooks et idempotence : éviter les doublons sans sur-architecturer"
shortTitle: "Webhooks et idempotence : éviter les doublons"
description: "Idempotency-Key, stockage minimal, retries HTTP et sécurité basique — code PHP illustratif et pièges fréquents."
pubDate: 2026-03-17
readingTimeMinutes: 10
tags:
  - "API"
  - "Webhooks"
  - "Fiabilité"
illustration: webhook
---
<aside class="tldr">
<strong>En bref</strong>
Les fournisseurs redélivrent : réseau, timeouts, bugs côté émetteur. Votre endpoint doit être
<strong>idempotent</strong> : rejouer le même événement ne doit pas dupliquer l’effet métier. La combinaison
<code>Idempotency-Key</code> + stockage minimal résout 90 % des cas sans Kafka.
</aside>

<h2>Contrat HTTP minimal</h2>
<ul>
<li>Répondre <strong>vite</strong> (2xx) si la charge est lourde — traitez en asynchrone derrière une file.</li>
<li>Valider la signature / secret partagé <strong>avant</strong> toute écriture métier.</li>
<li>Journaliser le corps brut (hash + identifiant) pour le support, pas nécessairement le PII complet.</li>
</ul>

<h2>Idempotence : schéma de table minimal</h2>
<p>Exemple SQL (MySQL / MariaDB) : une ligne par clé vue, statut du traitement.</p>
<pre><code>CREATE TABLE webhook_inbox (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(32) NOT NULL,
  idempotency_key VARCHAR(128) NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  status ENUM('received','processed','failed') NOT NULL DEFAULT 'received',
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_provider_key (provider, idempotency_key)
);</code></pre>

<h2>Flux PHP (lecture rapide)</h2>
<pre><code>$key = $request-&gt;headers-&gt;get('Idempotency-Key') ?? $payload['event_id'] ?? null;
if (!$key) {
    return new JsonResponse(['title' =&gt; 'Missing idempotency key'], 400);
}

$hash = hash('sha256', $request-&gt;getContent());
$row = $db-&gt;findInboxRow($provider, $key);

if ($row &amp;&amp; $row['payload_hash'] !== $hash) {
    return new JsonResponse(['title' =&gt; 'Conflict: same key, different body'], 409);
}

if ($row &amp;&amp; $row['status'] === 'processed') {
    return new JsonResponse(['status' =&gt; 'duplicate_ignored'], 200);
}

$db-&gt;upsertInbox($provider, $key, $hash);
$bus-&gt;dispatch(new ProcessWebhook($provider, $key));
return new JsonResponse(['status' =&gt; 'accepted'], 202);</code></pre>

<h2>Retries et ordre</h2>
<p>
Si les événements doivent être <strong>ordonnés</strong> par ressource, incluez un <code>sequence</code> ou un
horodatage fiable dans le payload et ignorez les doublons / replays obsolètes via comparaison monotone (par compte,
par agrégat, etc.).
</p>

<section class="faq" aria-label="Questions fréquentes">
<h2>FAQ</h2>
<details>
<summary>202 vs 200 ?</summary>
<p>
<strong>202 Accepted</strong> si le travail est poussé en asynchrone ; <strong>200</strong> si tout est traité
dans la requête. Les deux sont valides ; soyez cohérents et documentez-le.
</p>
</details>
<details>
<summary>Et sans idempotency key du fournisseur ?</summary>
<p>
Dérivez une clé stable du payload (<code>event_id</code> + type) après validation de schéma ; refusez les
événements sans identifiant stable — c’est un signal de mauvaise conception côté émetteur.
</p>
</details>
</section>
