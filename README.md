# MeinePRESSe

Website-Prototyp für die Saftpressen **PRESS Standard**, **PRESS Rustic** und **PRESS Pro**: statisch generiert mit [Astro](https://astro.build) (Node.js), 3D-Ansicht mit [`<model-viewer>`](https://modelviewer.dev). Design (Farben, Schriften, Bilder) stammt aus dem Figma-Board „meinePRESSe Prototype“.

> Preise, Texte und technische Daten sind fiktiv.

## Entwicklung

Voraussetzung: Node.js ≥ 22.12

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # statischer Build nach dist/
npm run preview   # Build lokal ansehen
```

## Deployment auf Vercel

1. Auf [vercel.com/new](https://vercel.com/new) das GitHub-Repo `j0nes-l/meinepresse` importieren. Das Framework (Astro) wird automatisch erkannt.
2. Optional unter *Settings → Environment Variables* die Variable `SITE_URL` auf die finale Domain setzen (z. B. `https://meinepresse.de`). Sie wird für Canonical-URLs, Sitemap, robots.txt und Open-Graph-Tags verwendet. Ohne die Variable gilt `https://meinepresse.vercel.app`.
3. Deploy starten. Jeder Push auf `main` deployt danach automatisch.

## Projektstruktur

```
src/
  data/products.ts         Produktdaten (Preise, Texte, Specs, FAQ) – zentrale Stelle für Inhalte
  pages/                   Startseite, /pressen/[slug], Impressum, Datenschutz, 404, robots.txt
  components/              Header, Footer, ProductCard, ModelViewer (3D)
  scripts/viewer.ts        Lazy-Loading & Steuerung des 3D-Viewers
  styles/global.css        Design-Tokens aus Figma + Styles
  assets/images/           Bilder aus Figma (werden beim Build zu AVIF/WebP optimiert)
public/
  models/                  Web-optimierte 3D-Modelle (Meshopt + WebP-Texturen)
  fonts/                   Instrument Sans SemiBold, Inter Regular (selbst gehostet)
models-src/                Original-GLB-Dateien
scripts/                   Modell-Optimierung, Meshopt-Decoder-Kopie
```

## 3D-Modelle

Die Originale liegen in `models-src/`. Nach Änderungen dort neu komprimieren:

```bash
npm run models
```

Dadurch schrumpfen die Modelle von 11 MB auf 1,5 MB (Meshopt-Geometrie, WebP-Texturen ≤ 1024 px).

Verhalten des Viewers:

- three.js und `<model-viewer>` werden erst geladen, wenn ein Modell gebraucht wird. Die Startseite bleibt dadurch bei ca. 130 KB.
- Produktseiten laden das Modell auf Desktop automatisch, sobald es sichtbar ist. Auf Touch-Geräten und im Datensparmodus startet es per Tipp.
- Das Mausrad scrollt die Seite. Gezoomt wird mit Strg/⌘ + Mausrad, Trackpad-Pinch oder Touch-Pinch.
- AR („In deinem Raum ansehen“) gibt es auf unterstützten Smartphones (Android Scene Viewer, iOS Quick Look).
- Ohne WebGL oder wenn ein Modell nicht lädt, bleibt das Produktfoto stehen.

## Design-Tokens (Figma)

| Token       | Wert      | Verwendung                         |
| ----------- | --------- | ---------------------------------- |
| `--brown`   | `#45230C` | Text, Footer                       |
| `--rust`    | `#8A3F1F` | Eyebrows, Akzente                  |
| `--apricot` | `#F5B87C` | Highlights, Akzente auf Dunkel     |
| `--red`     | `#B03821` | Primär-Buttons, Links              |
| `--wine`    | `#700D0B` | Hover                              |

Schriften: **Instrument Sans SemiBold** (Headlines, Buttons), **Inter Regular** (Fließtext).

## SEO

- Statisches HTML mit sprechenden Titeln und Meta-Descriptions je Seite, Canonical-URLs sowie Open-Graph- und Twitter-Tags
- Strukturierte Daten: `Organization`, `WebSite`, `Product` (mit Offer, Versand und Rückgabe), `BreadcrumbList`, `ItemList`, `FAQPage`
- `sitemap-index.xml` und `robots.txt` werden automatisch erzeugt (Impressum und Datenschutz stehen auf `noindex`)
- Responsive Bilder in AVIF/WebP, Font-Preload, kein Layout-Shift
- Lighthouse (Mobil): 100 in allen Kategorien auf Start- und Produktseiten

## Vor dem Livegang

- [ ] Impressum und Datenschutz mit echten Angaben füllen
- [ ] `SITE_URL` auf die finale Domain setzen
- [ ] „Jetzt bestellen“ (aktuell `mailto:`) an Shop oder Checkout anbinden
