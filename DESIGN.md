# DESIGN.md — Jupe Hills Pre & Primary School

Design decisions for the credibility site. Everything here was chosen after inspecting
the actual photos in `assets/raw/` and the scanned joining-instructions form.

---

## 0. Corrections to the brief's photo inventory (important)

The brief's file-to-content table is scrambled. Actual contents, verified by eye:

| File | Actual content | Planned use |
|---|---|---|
| `DSC_7311.JPG.jpeg` | Pupils walking/running across the field, teacher among them, stone school building behind. Bright, full of movement. | **Hero.** This is the shot the brief attributed to `IMG_3771`. |
| `IMG_3771.jpg.jpeg` | The Saanane Island TANAPA boat — life jackets, waving. | Trip block lead. Life jackets = safety signal. |
| `DSC_7305.JPG.jpeg` | Mixed-age group under trees, staff around them. | About — "the whole school" (matches brief). |
| `g2.jpg.jpeg` | Whole-school group portrait under trees. **Not a zoo scene. Well exposed.** | About / gallery, large. |
| `g3.jpg.jpeg` | Older pupils group portrait, tracksuits, playful poses. **Well exposed.** | Gallery, large — this is the shot the brief attributed to `DSC_7311`. |
| `g5.jpg.jpeg` | Younger class with three teachers. **Well exposed.** | Programmes — Pre-primary card. |
| `IMG_4018.jpg.jpeg` | Lunch at green tables, "JUPE HILLS SCHOOL" legible on shirts. | Gallery — daily life. Uniform branding visible. |
| `DSC_7737.JPG.jpeg` | Child riding the camel, staff holding the rope. | Gallery, small (over-saturated). |
| `DSC_7501.JPG.jpeg` | Monkeys in an enclosure, pupils watching. | Gallery, small (over-saturated). |
| `DSC_7431.JPG.jpeg` | Group at a zoo shelter/enclosure. | Gallery, small (over-saturated). |
| `DSC_7517.JPG.jpeg` | Group with staff, an eland grazing behind, stone building. | Gallery, medium (mildly hot colour). |
| `DSC_7528.JPG.jpeg` | Group with a visitor seated among pupils. | Gallery, small–medium. |
| `DSC_7532.JPG.jpeg` | Pupils and a teacher on the green swing frame. | Gallery, small (over-saturated). |
| `DSC_7545.JPG.jpeg` | Large group under a shelter, seen from behind. | Gallery, small. |
| `IMG-20230825-WA0079.jpg.jpeg` | Teacher with eight pupils by a green enclosure. Warm, relaxed. | Gallery — good human moment (matches brief). |
| `IMG-20241201-WA0009.jpg.jpeg` | Award ceremony, pupil in formal uniform (white shirt, maroon check skirt) receiving a certificate. **Portrait orientation.** | Achievements block (matches brief). |
| `WhatsApp Image … 1.57.24 PM.jpeg` | School logo, 572×596, hard black background. | Logo — key black to transparent in the build script. |
| `WhatsApp Video … 5.10.30 PM.mp4` | 32 MB video, unreviewed. | Not embedded. Commented-out slot only. |
| `CamScanner 07-15-2026 13.53.pdf` | **Not in the brief.** The school's real Joining Instructions Form: school profile + admissions rules. | Source text for `/admissions`. Confirms name, motto, S.L.P 735, both phones, email, intake ages, interview rule. |

**Saturation-fix list (corrected).** The brief named `g2/g3/g5` as over-saturated; they are
fine. The files that actually need mild desaturation + highlight recovery in the image
script are: `DSC_7431`, `DSC_7501`, `DSC_7532` (strong neon-green cast) and
`DSC_7517`, `DSC_7528`, `DSC_7737` (milder). Per-file config map in the script, nothing
blanket-processed.

**Still missing** (recorded in `content/placeholders.md` only — no empty "coming soon"
panels on the page; an advertised absence undermines a credibility site):
school building/gate from outside · classroom interior with pupils working ·
Head Teacher portrait. The Head Teacher welcome block is written but shipped
commented-out in `index.html` until a real name and portrait exist.

---

## 1. Palette — from the logo and the uniform

Every colour below is on the child in the photos or in the logo. Nothing imported.

| Token | Hex | Source | Role |
|---|---|---|---|
| `--maroon` | `#7C2130` | Uniform shirts, logo lettering (deepened for text use) | Primary brand colour: headings accents, buttons, footer |
| `--navy` | `#1F2C47` | Logo ring | Body text ("ink"), header, motto band |
| `--sky` | `#5BABD9` | Tracksuits | Accents, the signature stripe, decorative surfaces — never body text |
| `--sky-wash` | `#EAF4FA` | Tracksuits, tinted to near-white | Alternating section backgrounds |
| `--gold` | `#F2A93B` | Logo sunburst | Small accents and the motto moment — decorative + large text on navy only |
| `--paper` | `#FBFAF7` | — | Page background (warm off-white, not cream) |

Derived shade: `--link` `#1D6FA5` (sky darkened until it passes 4.5:1 on paper, for
text links). White `#FFFFFF` for text on maroon/navy.

**Contrast pairs, pre-checked** (final numbers verified in the Lighthouse pass):

- Navy on paper — body text: ~13:1 ✓
- Maroon on paper / white: ~9:1 ✓
- White on maroon, white on navy: ✓
- Navy on sky-wash: ~11:1 ✓
- Gold on navy: 6.96:1 — passes AA at any size (measured, not estimated)
- **Never**: maroon on sky, sky on paper as text, gold on paper as text. These fail;
  the brief's warning is right.

---

## 2. Type pairing

**Headings: Bricolage Grotesque** (Google Fonts, self-hosted woff2 subset).
Warm and structured at the same time — grotesque bones, slightly hand-drawn detail,
an excellent ExtraBold for the hero and motto. Distinctive without being fussy, and it
sits comfortably next to childhood photos without turning the page into a nursery.

**Body: Atkinson Hyperlegible** (self-hosted woff2 subset).
Designed by the Braille Institute for maximum character distinction. Warm, humanist,
a real bold, renders Swahili place names (plain Latin) perfectly. Choosing a
legibility-first face for a site read on mid-range Android screens in sunlight is the
body-copy decision the audience would make themselves — and it's a small credibility
story in its own right.

Delivery: two families × two weights each, subset to Latin, self-hosted,
`font-display: swap`, system-ui fallback stack metrics-matched so text doesn't jump.
Budget ≈ 100 KB total (2 families × 2 weights × ≤25 KB), preload the heading face only.

Scale: fluid `clamp()` scale, body 16–18px, generous line-height (1.6) for body,
tight (1.1) for display. Sentence case everywhere, as the brief's tone demands.

---

## 3. Layout concept

**Mobile-first single column that never fights the photos.** Content shell max-width
1100px; text measures capped at ~68ch. Sections alternate `--paper` and `--sky-wash`
so the page has rhythm without borders or heavy chrome. Type and UI stay quiet:
photos are the argument, so they get the width, the contrast, and the first
150 KB of the page.

- **Header**: white, keyed-out logo, name, phone number (desktop), compact sticky on scroll.
- **Hero**: full-width photo (`DSC_7311`), name + motto + one orientation line overlaid
  on a navy gradient scrim at the base — text always on navy, never on unpredictable
  photo area. Call + WhatsApp buttons: solid maroon and white-outline pair from the
  site palette (no WhatsApp green — it clashes with maroon and sky), thumb-height,
  side by side even at 320px.
- **At a glance**: one row of 5 plain facts, big numerals in maroon, no icons, no cards.
- **Programmes**: three flat cards on sky-wash, maroon rule at the top of each, ages
  stated in the first line. No numbering — the brief is right that they aren't a sequence.
- **The motto moment**: one full-width navy band, motto set huge in Bricolage
  ExtraBold, "Learners today," in white / "leaders tomorrow." in gold, a low-opacity
  sunburst (from the logo geometry, drawn as inline SVG, not the raster logo) rising
  behind it. Once, between About and Programmes. Nowhere else.
- **Photo strip**: horizontal scroll-snap strip on mobile, grid on desktop; 7 images
  including the boat and the ceremony portrait (portrait crop planned as a 2-row cell).
- **Visit us**: static map image linking to Google Maps, address block, both phones
  as `tel:`, WhatsApp link, hours.
- **Gallery page**: three groups (Around school · Saanane Island trip · Ceremonies),
  CSS grid with mixed cell sizes — clean photos large, over-saturated ones small,
  the portrait ceremony shot in a tall cell. Minimal dependency-free lightbox:
  keyboard accessible, Escape closes, focus trapped and restored.
- **Missing photos**: no on-page placeholder panels. The needed shots (gate,
  classroom, Head Teacher portrait) are listed in `content/placeholders.md`; the
  layout simply doesn't reserve space for them until they exist.

## 4. The signature element: the uniform stripe

Every child in every photo wears the sky-blue tracksuit with white side stripes.
The site borrows it literally: a **triple stripe** — sky / white / sky — used as a
horizontal motif. It appears as the underline beneath each section heading, as the
top edge of the footer, and as the scroll-progress accent under the sticky header.
It is cheap (pure CSS, zero images), unmistakably *theirs*, and it quietly repeats
the "this is a real school with a real uniform" argument on every screen.

---

## 5. Copy tone (applies everywhere)

Plain, warm, factual, specific — per the brief. The school's real profile line
("open to children of all kinds, all religions, and all races") is used almost
verbatim; it needs no inflation. No exclamation marks, no "holistic", no "21st-century".
Active voice, sentence case. The interview rule and the intake ages are stated as
plain facts — they are the credibility.

---

## 6. Performance posture (design-level commitments)

- Hero image ≤ 150 KB at 960w, WebP + JPEG fallback, `fetchpriority="high"`, eager;
  everything else lazy.
- No carousel, no map iframe on load, no video, no framework, no font over 25 KB/file.
- One CSS file, custom properties for all tokens above.
- CSS-drawn signature elements (stripe, sunburst) cost 0 bytes of imagery.
- Budget for first view on 3G: ~250 KB total. Photos are the argument; they get the
  budget, chrome does not.
