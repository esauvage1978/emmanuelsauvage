# Email « contact » — Mailjet + Zapier

## Référence JSON (`contact-zapier-payload-keys.json`)

Le corps POST envoyé par `public/contact-zapier.php` vers Zapier utilise **exactement** ces clés. Pour la doc et le mapping (Zapier ↔ Mailjet), la forme systématique de référence est : chaque valeur placeholder reprend le nom de la clé (fichier `contact-zapier-payload-keys.json`).

## Fichiers

| Fichier | Usage |
|--------|--------|
| `contact-zapier-payload-keys.json` | Liste des clés JSON (placeholders `clé` → `"clé"`). |
| `contact-notification-mailjet.mjml` | Source MJML (à modifier puis recompiler). |
| `contact-notification-mailjet.html` | HTML généré — à coller dans **Mailjet** (template transactionnel) ou à uploader selon votre flux. |
| `contact-confirmation-visiteur-mailjet.mjml` | Email de confirmation au visiteur (2ᵉ flux Zapier). |

Compiler le MJML :

```bash
npx mjml email-templates/contact-notification-mailjet.mjml -o email-templates/contact-notification-mailjet.html
```

## Variables Mailjet (à déclarer dans le template)

Ces noms doivent **correspondre exactement** à ce que vous envoyez depuis Zapier (ou l’API Mailjet) :

| Variable Mailjet | Formulaire site (`contact.astro`) | Notes |
|------------------|-------------------------------------|--------|
| `name` | Champ **Nom** (`name="name"`, JSON `name`) | Obligatoire |
| `company` | Champ **Entreprise** | Peut être vide — le site envoie `—` si vide |
| `email` | Champ **Email** | Obligatoire |
| `message` | Champ **Message** | Obligatoire |
| `submitted_at` | Ajouté côté navigateur | ISO 8601 dans le JSON POST vers Zapier |

Syntaxe dans le template : `{{var:name}}`, `{{var:email}}`, etc. (éviter d’écrire du texte libre contenant `}}` qui pourrait être interprété par le moteur Mailjet).

## Zapier — flux type

1. **Trigger** : Webhooks by Zapier — *Catch Hook* (URL utilisée par `contact.astro` : `POST` JSON `Content-Type: application/json` avec les clés `name`, `company`, `email`, `message`, `submitted_at`).
2. **Action** : Mailjet — *Send an email via Mailjet API* (ou *Send email using a template* selon votre offre).
3. **Mapping** (exemple) : les champs du *Catch Hook* reprennent les clés JSON (`name`, `company`, `email`, `message`, `submitted_at`) — mappez-les vers les variables du template Mailjet.

## Logo dans l’email

Dans le MJML, l’image pointe vers une URL **absolue** :

`https://emmanuelsauvage.fr/images/logo-256.png`

Remplacez par votre domaine réel une fois le site en ligne (le fichier `public/images/logo-256.png` doit être accessible publiquement).

## Formulaire site (CORS)

Le navigateur ne peut en général **pas** appeler directement `hooks.zapier.com` en `POST` JSON (CORS / préflight). Le site envoie donc les données en **same-origin** :

- **`npm run dev`** → URL interne `/api/zapier-contact` (proxy Vite dans `astro.config.mjs`).
- **Build + WAMP / PHP** → `public/contact-zapier.php` relaie vers Zapier (à servir par Apache avec PHP).

Sur un hébergement **100 % statique** sans PHP, il faudra une fonction serverless ou un autre relais équivalent.

## RGPD

Le mail notifie **vous** (prestataire), pas le visiteur. Conservez la case à cocher sur le formulaire site et la politique de confidentialité ; limitez les données dans le webhook aux champs nécessaires.
