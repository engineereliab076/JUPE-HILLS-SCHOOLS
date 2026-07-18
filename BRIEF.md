# Build brief — Jupe Hills Pre & Primary School website

Paste this whole file into Claude Code as the project brief. Put the image assets in `assets/raw/` first.

---

## 1. What we're building

A **credibility website** for a real pre-primary and primary school in Mwanza, Tanzania. The site's single job: a parent, a government officer, or a partner who has heard the school's name can find it online, see immediately that it is a real, functioning, well-run school, and get in touch.

It is **not** a fee-comparison page, not a parent portal, not a blog. No login, no CMS, no database. A static site.

Primary conversion action: **phone call or WhatsApp**. Secondary: email.

Language: **English only.**

Audience: parents in Buswelu / Ilemela, Mwanza — mostly on Android phones, often on metered or slow data. **Mobile-first is not a nice-to-have here; assume most visitors arrive on a mid-range Android phone on 3G.** Performance is a credibility feature.

---

## 2. Real, confirmed facts — use these exactly, do not invent variants

| Field | Value |
|---|---|
| Full name | Jupe Hills Pre & Primary School |
| Also known as | Jupe Hills Daycare Pre & Primary School |
| Motto | Learners Today, Leaders Tomorrow |
| Location | Ibaya, Ilalila, Shibula ward, Buswelu, Ilemela District, Mwanza Region, Tanzania |
| Postal | S.L.P 735, Ilalila, Mwanza — Tanzania |
| Phone 1 | +255 762 264 686 |
| Phone 2 | +255 750 828 068 |
| Email | nyagwaswafaith@gmail.com |
| Daycare intake | Ages 2–5 |
| Standard I intake | Ages 6–7 |
| Entry rule | A child is interviewed before admission into Classes I, II, III and IV |
| Character | Co-educational. Open to children of all kinds, all religions, and all races. The school believes all people are God's creation, and children are supported in belief according to their own religion. |
| Uniform | Sky-blue tracksuit with white stripes, maroon shirt. Formal uniform: white shirt, maroon/red check skirt. |

Phone numbers must be real `tel:` links. WhatsApp links use the international format without `+` or spaces: `https://wa.me/255762264686`.

---

## 3. Placeholder facts — clearly marked fiction, to be replaced

The client will swap these later. **Every one of these must be wrapped in a comment `<!-- PLACEHOLDER: replace with real value -->` and collected in a single `content/placeholders.md` file listing what needs replacing.** Do not scatter them where they can't be found.

- Founded: **2016**
- Head Teacher: **Ms. Faith Nyagwaswa** (the school email is `nyagwaswafaith@` — plausible, but unconfirmed. Flag it.)
- Head Teacher's welcome message: write ~90 words, warm, plain, signed. No jargon, no "nurturing holistic learners in a 21st-century environment."
- Pupils enrolled: **210**
- Teaching staff: **14**
- Classes offered: Daycare, Baby Class, Middle Class, Pre-Unit, Standard I–IV
- School hours: Mon–Fri, 7:30 — 15:30. Daycare from 7:00.
- Two short parent testimonials, first name + "parent, Standard II" style attribution.

Do not invent: exam results, rankings, accreditation numbers, awards, or partnerships. Those are the claims that get a school in trouble if they're wrong. Leave them out entirely rather than placeholder them.

---

## 4. Image assets

All originals are in `assets/raw/`. They are **enormous** — nine are 6000×4000 and 5–7 MB each, two are ~22 MB. Shipping them as-is would be a disaster on 3G.

**Required processing step before writing any markup:**
- Generate responsive derivatives at widths 480 / 960 / 1600 px, in **WebP** with JPEG fallback.
- Target: no single image over ~150 KB at 960px.
- Write a small Node or Python script (`scripts/build-images.mjs` or `.py`, using `sharp` or `Pillow`) so the client can re-run it when they add photos. Commit the script, commit the derivatives, keep the raws out of the deploy.
- Every `<img>` gets `srcset`, `sizes`, explicit `width`/`height`, `loading="lazy"` (except the hero, which is eager + `fetchpriority="high"`), and a **specific, descriptive alt text** — not "school photo".

### Photo inventory and intended use

| File | Content | Use |
|---|---|---|
| `IMG_3771_jpg.jpeg` | Pupils walking in file across the field, teacher leading, stone school building behind. Clean, bright, full of movement. | **Hero.** This is the strongest image. It shows building + pupils + staff + energy in one frame. |
| `DSC_7305_JPG.jpeg` | Large mixed-age group under trees, teachers standing at the back. | About section — "the whole school" |
| `DSC_7311_JPG.jpeg` | Older pupils group portrait, tracksuits, playful poses | Gallery, large |
| `DSC_7431_JPG.jpeg` | Younger class portrait with three teachers | Programmes — Pre-primary |
| `DSC_7517_JPG.jpeg` | Pupils eating lunch at green tables, "JUPE HILLS SCHOOL" visible on shirts | Gallery — daily life. Uniform branding is legible here, which is good. |
| `DSC_7737_JPG.jpeg` | Pupils on the "Visit Saanane Island" TANAPA boat, life jackets on, waving | Gallery — hero of the trip block. Life jackets visible = safety signal. Use it. |
| `DSC_7501_JPG.jpeg` | Child riding a camel with staff holding the rope | Gallery |
| `DSC_7528_JPG.jpeg` | Pupils and a teacher packed onto a green swing frame | Gallery |
| `DSC_7532_JPG.jpeg` | Group with staff, an eland grazing behind them | Gallery |
| `DSC_7545_JPG.jpeg` | Group with a visitor seated among pupils | Gallery, small |
| `IMG_4018_jpg.jpeg` | Staff and pupils gathered, staff in white branded polos | About / staff |
| `g2_jpg.jpeg`, `g3_jpg.jpeg`, `g5_jpg.jpeg` | Zoo / enclosure scenes, monkeys, group at the shelter | Gallery, **small only — see warning below** |
| `IMG-20230825-WA0079_jpg.jpeg` | Teacher with eight pupils by a green enclosure, relaxed and warm | Gallery — good human moment |
| `IMG-20241201-WA0009_jpg.jpeg` | Award ceremony, pupil in formal uniform receiving a certificate from officials under a tent | **Achievements / ceremony block.** Portrait orientation — plan for it. |
| `WhatsApp_Image_2026-07-15_at_1_57_24_PM.jpeg` | The school logo, 572×596, **on a black background** | Logo — see below |
| `WhatsApp_Video_2026-07-15_at_5_10_30_PM.mp4` | 32 MB video, unreviewed | **Do not embed.** Too heavy. Leave a commented-out slot; if it's used later it goes to YouTube and gets embedded lazily. |

**Colour warning:** `g2`, `g3`, `g5`, `DSC_7501`, `DSC_7528`, `DSC_7532` are heavily over-saturated — neon-green grass, blown highlights, cyan-shifted skin tones. They look filtered and cheapen the page. Two options, do both:
1. In the image script, apply a mild desaturation + highlight recovery to these six specifically (keep a per-file config map, don't blanket-process everything).
2. Use them **small**, in the gallery grid only. Never full-bleed. The clean photos get the large slots.

**Logo:** the supplied file has a hard black background. Key it out to transparent PNG/SVG in the build script, or place it on dark surfaces only. Do not put a black square on a light header.

**Missing photos** — leave clearly-labelled, gracefully-degrading slots for these, since they're the three things a credibility visitor actually looks for:
- The school building / gate from outside
- A classroom interior with pupils working
- A portrait of the Head Teacher

The slots must look intentional when empty, not broken. Note them in `content/placeholders.md`.

---

## 5. Page structure

### Home (single scroll)
1. **Header** — logo, name, nav, phone number visible on desktop. Sticky, compact on scroll.
2. **Hero** — school name, motto, one line of orientation ("A day-care, pre-primary and primary school in Ibaya, Buswelu — Mwanza"), call + WhatsApp buttons, hero photo.
3. **At a glance** — founded, pupils, staff, classes offered, hours. Four or five facts, no more.
4. **Welcome from the Head Teacher** — portrait slot + signed message.
5. **About** — who the school is. Use the real profile language: co-ed, all religions, all races, all kinds. This is a genuine and distinctive commitment; write it plainly and let it carry weight. Don't inflate it.
6. **Programmes** — three cards: Daycare (2–5), Pre-primary, Primary (Standard I–IV). Each states ages and, for primary, the interview requirement.
7. **Life at Jupe Hills** — photo strip, 6–8 images, links to full gallery. Include the Saanane Island trip and the award ceremony.
8. **Visit us** — address, both phones, email, hours, embedded map or a static map image linking to Google Maps for Buswelu/Ilalila. **Use a static image or lazy-loaded iframe — a live Google Maps embed on 3G is a real cost.**
9. **Footer** — contacts repeated, motto, postal address, copyright.

### /gallery
All usable photos, grouped: *Around school* · *Saanane Island trip* · *Ceremonies*. Lightbox on click — keyboard accessible, Escape closes, focus trapped and restored.

### /admissions
The joining instructions, cleanly typed and organised:
- School profile (real text, tidied)
- Who we admit (2–5 daycare; 6–7 Standard I; interview for I–IV)
- How to apply — placeholder 3-step process, marked as such
- What to bring — placeholder list (birth certificate, photos, previous report), marked as such
- Big contact block at the bottom

---

## 6. Design direction

You are the design lead. Make deliberate choices, and read `frontend-design` guidance before you start. Some constraints and some freedom:

**Fixed — derived from the school's real identity:**
- The palette comes from the **logo and the uniform**, which the school already owns: maroon/crimson, the deep navy ring, the sky blue of the tracksuits, the gold/amber sunburst, and the teal accent. Build a 5–6 token palette from these. The sky-blue-and-maroon pairing is genuinely distinctive and already worn by every child in every photo — lean on it. Do not import an unrelated palette.
- Photos are the argument. Type and chrome should get out of their way.
- The motto is the school's own line. Give it a real typographic moment somewhere — once, not on every section.

**Free — your call, but justify it in a short `DESIGN.md`:**
- Typeface pairing. Pick something with warmth and structure. Avoid the default institutional-serif-plus-Inter combination. Whatever you pick must render Swahili place names and have a real bold.
- Layout system and the one signature element the page is remembered by.

**Explicitly avoid:** cream background + high-contrast serif + terracotta accent; near-black + acid accent; generic edu-template stock cheerfulness; "01 / 02 / 03" numbered markers unless the content is genuinely a sequence (the admission steps are; the programmes are not); floating gradient blobs; a carousel.

**Tone of copy:** plain, warm, factual, specific. A school that says "we take children from age two and every child entering Standard I sits an interview" is more credible than one that says "we unlock every child's limitless potential." Sentence case. Active voice. No exclamation marks.

---

## 7. Technical

- **Stack:** plain HTML + CSS + a small amount of vanilla JS. **No React, no framework, no build step beyond the image script.** This site must still work in three years when nobody has run `npm install` since.
- Structure: `index.html`, `gallery.html`, `admissions.html`, `css/`, `js/`, `assets/img/`, `scripts/`, `content/placeholders.md`, `DESIGN.md`, `README.md`.
- CSS: custom properties for the token system, one stylesheet, logical property names, no framework. Watch selector specificity — don't let section and component padding rules cancel each other out.
- **Quality floor, non-negotiable:**
  - Responsive from 320px up. Test at 360px, the real-world Android width.
  - Visible keyboard focus on every interactive element.
  - `prefers-reduced-motion` respected.
  - Semantic landmarks, one `h1` per page, correct heading order.
  - Colour contrast ≥ 4.5:1 for body text. Check maroon-on-blue combinations carefully — they will fail if you're careless.
  - Lighthouse: Performance ≥ 90 and Accessibility 100 on mobile throttling. Report the actual numbers.
- **SEO / sharing:** title and meta description per page, Open Graph tags with a proper share image, and `LocalBusiness`/`School` JSON-LD with the real name, address, phone, and geo for Buswelu. This matters more than usual — the whole point is being findable.
- Favicon set from the logo.
- `README.md`: how to run the image script, how to deploy to Netlify or Vercel drag-and-drop, and how to swap a photo. Written for someone who is not a developer.

---

## 8. Process

1. Read the brief. Inspect the actual images before designing around them.
2. Write `DESIGN.md` first — palette tokens with hex values, type pairing, layout concept, the signature element. Show it to me before building.
3. Then build. Home page first, complete and reviewed, before starting the subpages.
4. Self-critique against this brief before declaring done. Screenshot at 360px and 1440px.
5. List every placeholder in `content/placeholders.md`, with the file and line where it appears.

Ask me if something is genuinely ambiguous. Don't ask me things you can decide.