# Jupe Hills Pre & Primary School website

A fast, mobile-first static website for Jupe Hills Pre & Primary School in
Ibaya, Buswelu, Mwanza. The site uses plain HTML, CSS and JavaScript, so it does
not need a framework or build step.

## Pages

- `index.html` — homepage
- `about.html` — history, mission, values, leadership and facilities
- `admissions.html` — entry requirements, process, fees, PDF and inquiry form
- `academics.html` — programmes, subjects, teaching approach and calendar
- `staff.html` — leadership, teaching staff and support staff
- `news.html` — news, events calendar and newsletter archive
- `news-article.html` — an individual news article template
- `gallery.html` — filterable, keyboard-accessible photo gallery and lightbox
- `parents.html` — policies, dates, uniform, fees and parent FAQ
- `contact.html` — contact details, email form and lazy-loaded map

## Preview locally

Open `index.html` directly in a browser, or start a small local server from this
folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Replace content

Search the project for `PLACEHOLDER:`. Every unconfirmed name, date, statistic,
policy, event, fee, social link and profile is marked. A consolidated checklist
is in `content/placeholders.md`.

The phone numbers, email address, postal address, location, intake ages,
inclusive policy and interview rule come from the supplied school Joining
Instructions Form.

## Replace or add a photo

1. Put the original image in `assets/raw/`.
2. Add its filename and output slug to `PHOTOS` in `scripts/build_images.py`.
3. Install Pillow once with `python -m pip install Pillow`.
4. Run `python scripts/build_images.py`.
5. Use the new 480, 960 and 1600 pixel JPG/WebP files from `assets/img/`.

Keep descriptive `alt` text, explicit width and height, responsive `srcset`, and
`loading="lazy"` on every non-hero image.

## Forms

The contact and admissions forms validate in the browser and prepare a complete
email to `nyagwaswafaith@gmail.com` in the visitor's email app. Newsletter forms
validate and provide a local demo confirmation. Connect those forms to the
school's chosen email/newsletter service before collecting subscriptions online.

## Admissions download

The verified scanned Joining Instructions Form is available at
`assets/docs/jupe-hills-joining-instructions.pdf`.

## Deployment

This is a static site. Upload the whole folder to Netlify, Cloudflare Pages,
GitHub Pages, or any ordinary HTTPS web host. On Netlify, the folder can be
dragged into the Deploys area. On Cloudflare Pages, use no build command and set
the output directory to the project root.

After a real domain is connected, replace relative Open Graph image paths with
absolute HTTPS URLs and add the final canonical URL to every page.
