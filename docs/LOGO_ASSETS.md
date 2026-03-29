# Logo : variante officielle (17) + assets

## Couleurs utilisées (palette par défaut)

Le logo utilise les variables CSS suivantes (proposition 1) :

- `--color-primary`: `#2f3a8f`
- `--color-accent`: `#4f6ef7`
- `--color-spot`: `#c45c2e`
- `#dc9d81` : couleur des 2 petites barres

Ces couleurs sont câblées aussi dans `public/images/logo-source.svg` (pour permettre la génération PNG/WebP/favicons via `sharp`).

## SVG source (vectoriel)

- Fichier : `public/images/logo-source.svg`
- ViewBox : `0 0 64 64`
- Contenu : braquets + histogramme (sans courbe, sans fond/bord)

## Assets générés (tailles + extensions)

Commande :

```bash
node scripts/generate-logo-assets.mjs
```

Sorties attendues :

- `public/images/logo-32.png` (32x32)
- `public/images/logo-64.png` (64x64)
- `public/images/logo-128.png` (128x128)
- `public/images/logo-256.png` (256x256)
- `public/images/logo-512.png` (512x512)
- `public/images/logo-32.webp` (32x32)
- `public/images/logo-64.webp` (64x64)
- `public/images/logo-128.webp` (128x128)
- `public/images/logo-512.webp` (512x512)
- `public/images/logo-1024.webp` (1024x1024)

Favicon :

- `public/images/favicon-16x16.png` (16x16)
- `public/images/favicon-32x32.png` (32x32)
- `public/images/apple-touch-icon.png` (180x180)
- `public/favicon.png` (32x32)
- `public/favicon.ico` (contient des PNG embarqués 16x16 et 32x32)

## Où réutiliser

Le SVG peut être utilisé partout (web, print, Figma, etc.). Pour les supports “raster” (favicon, emails, favicons), utilise les PNG/WebP listés ci-dessus.

