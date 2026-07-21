# Asset audit

Audit date: 2026-07-21

No source asset was deleted. The Eleventy production build copies only assets
that the generated website uses, so local originals remain available without
being deployed.

## Summary

| Group          | Files |       Size | Public use | Action                                                  |
| -------------- | ----: | ---------: | ---------- | ------------------------------------------------------- |
| `assets/raw/`  |    19 | 151.51 MiB | None       | Keep locally; exclude from Git and `_site/`             |
| `assets/img/`  |    98 |  14.81 MiB | Mixed      | Copy responsive variants, uniforms and brand icons only |
| `assets/docs/` |     1 |   0.19 MiB | Admissions | Keep public joining instructions                        |
| `fonts/`       |     3 |   0.07 MiB | All used   | Keep all three self-hosted files                        |

## Raw/source files

Every file below is unreferenced by generated HTML and excluded from production.
The photographs remain useful source material; the video should be hosted on a
streaming platform if it is ever approved for publication.

| File                                                      |      Size | Recommended action                                 |
| --------------------------------------------------------- | --------: | -------------------------------------------------- |
| `assets/raw/CamScanner 07-15-2026 13.53.pdf`              |  0.19 MiB | Keep locally; public copy exists in `assets/docs/` |
| `assets/raw/DSC_7305.JPG.jpeg`                            |  4.72 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/DSC_7311.JPG.jpeg`                            |  6.73 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/DSC_7431.JPG.jpeg`                            |  6.70 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/DSC_7501.JPG.jpeg`                            |  6.52 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/DSC_7517.JPG.jpeg`                            |  6.15 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/DSC_7528.JPG.jpeg`                            |  4.69 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/DSC_7532.JPG.jpeg`                            |  5.84 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/DSC_7545.JPG.jpeg`                            |  6.89 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/DSC_7737.JPG.jpeg`                            |  5.94 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/g2.jpg.jpeg`                                  | 20.78 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/g3.jpg.jpeg`                                  | 21.09 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/g5.jpg.jpeg`                                  | 20.19 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/IMG_3771.jpg.jpeg`                            |  1.74 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/IMG_4018.jpg.jpeg`                            |  1.85 MiB | Keep as source; optimized derivatives exist        |
| `assets/raw/IMG-20230825-WA0079.jpg.jpeg`                 |  0.23 MiB | Keep as uniform source                             |
| `assets/raw/IMG-20241201-WA0009.jpg.jpeg`                 |  0.08 MiB | Keep as ceremony-photo source                      |
| `assets/raw/WhatsApp Image 2026-07-15 at 1.57.24 PM.jpeg` |  0.03 MiB | Keep as uniform source                             |
| `assets/raw/WhatsApp Video 2026-07-15 at 5.10.30 PM.mp4`  | 31.12 MiB | Keep locally; never deploy directly                |

## Generated variants excluded from production

Fourteen `*-1600.jpg` files (4.47 MiB total) are redundant because the gallery
uses matching 1600px WebP files and thumbnails retain 480px/960px JPG fallbacks.
`assets/img/logo.png` and `logo-512.png` are also unreferenced; the site uses
`logo-header.png` and the favicon set. These files remain in the repository but
are not copied into `_site/`.

The deployment boundary removes over 156 MiB of raw/redundant media from the
publish output without destroying the school’s source files.
