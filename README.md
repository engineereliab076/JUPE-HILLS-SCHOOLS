# Jupe Hills Pre & Primary School website

A lightweight Eleventy website for Jupe Hills Pre & Primary School in Ibaya,
Ilalila, Mwanza. Shared layouts and verified school details are generated from
one source while the existing visual identity remains plain HTML, CSS and
dependency-free browser JavaScript.

## Project structure

- `src/*.njk` — source pages; each preserves its public `.html` URL
- `src/_includes/layouts/` — shared page layout
- `src/_includes/partials/` — head, navigation, footer, CTA and location blocks
- `src/_data/school.json` — verified school details and deployment settings
- `css/style.css` — shared responsive design
- `js/main.js` — navigation, lightbox, reveal and back-to-top interactions
- `assets/img/` — optimized image derivatives
- `assets/raw/` — ignored local source media; never copied into production
- `assets/docs/` — public joining instructions
- `scripts/` — link, accessibility, responsive and Lighthouse checks
- `_site/` — generated production output (ignored by Git)

## Local development

Install Node.js 22 or newer, then run:

```powershell
npm install
npm run dev
```

Eleventy prints the local preview URL. Source changes rebuild automatically.

## Build and validation

```powershell
npm run build
npm run check
```

The production output is `_site/`. `npm run check` verifies formatting, builds
the site, validates HTML, lints CSS and JavaScript, checks local links, runs axe
smoke tests and checks all public pages for horizontal overflow at the approved
viewport sizes.

Other useful commands:

- `npm run format` — format editable text files
- `npm run validate` — build plus HTML, CSS, JavaScript and link checks
- `npm run check:a11y` — serious/critical axe and runtime-error smoke checks
- `npm run check:responsive` — all pages at 14 requested viewport sizes
- `npm run audit:lighthouse` — Home, Admissions, Contact and Gallery audits

The browser checks use an installed Chrome/Edge locally. In CI, the workflow
installs Playwright Chromium first.

## Updating shared school details

Edit only `src/_data/school.json` for reusable school information. It contains
the school name, motto, profile figures, programmes, hours, Head Teacher name,
address, Gmail address, all three phone/WhatsApp contacts, deployment URLs and
map settings. The current primary CTA number is intentionally unchanged. Its
data note reads “Primary admissions number awaiting final confirmation.”

## Final domain update

When the school purchases its final domain:

1. Replace `site.url` in `src/_data/school.json`.
2. Put the same value in `site.futureCustomDomain` for the project record.
3. Run `npm run build` and `npm run check`.

Canonical URLs, Open Graph URLs, JSON-LD, `sitemap.xml` and `robots.txt` all use
`site.url`, so one edit updates every generated page.

## Exact Google Maps location

Do not enter approximate coordinates. After the school supplies the exact link
and verified coordinates, update these fields in `src/_data/school.json`:

```json
"googleMapsUrl": "PASTE_EXACT_GOOGLE_MAPS_URL_HERE",
"latitude": "VERIFIED_LATITUDE",
"longitude": "VERIFIED_LONGITUDE"
```

When all three values exist, the shared location partial automatically replaces
the temporary written-address block with the exact lazy-loaded map and link.
At that time, change `frame-src 'none'` in `vercel.json` to
`frame-src https://www.google.com` and rerun the full checks.

## Deployment

`vercel.json` keeps the Vercel workflow: Vercel runs `npm run build` and
publishes `_site/`. It also applies security headers and asset caching. The
temporary canonical base is the verified production URL:
`https://jupe-hills-schools.vercel.app`.

## Media workflow

Original photography stays in ignored `assets/raw/`. To create optimized
derivatives, follow `scripts/build_images.py`, then reference responsive WebP
and JPG variants from a source template. See `ASSET_AUDIT.md` before removing or
changing any media.
