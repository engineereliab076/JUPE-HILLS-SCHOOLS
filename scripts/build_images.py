#!/usr/bin/env python3
"""Build responsive web images for the Jupe Hills site.

Reads the original photos from  assets/raw/  and writes optimised copies to
assets/img/ . Run it again whenever a photo in assets/raw/ changes or is added
(add the new file to PHOTOS below first):

    python scripts/build_images.py

Requires Python 3 and Pillow:  python -m pip install Pillow
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "raw"
OUT = ROOT / "assets" / "img"

WIDTHS = [480, 960, 1600]

# Measured against the 150 KB @ 960px budget — foliage-heavy frames blow the
# budget at higher quality settings, these values keep the hero at ~131 KB.
JPEG_QUALITY = {480: 76, 960: 68, 1600: 64}
WEBP_QUALITY = {480: 74, 960: 66, 1600: 62}

# Per-file colour treatment. Only the frames that need it — never blanket-process.
# "strong": neon-green cast (zoo shelter, monkeys, swing frame)
# "mild":   slightly hot colour (eland, visitor, camel ride)
TREATMENTS = {
    "strong": {"color": 0.80, "brightness": 0.97, "contrast": 1.03},
    "mild": {"color": 0.90, "brightness": 0.99, "contrast": 1.02},
}

# source file in assets/raw/  ->  (output slug, treatment or None)
PHOTOS = {
    "DSC_7311.JPG.jpeg": ("field-crossing", None),          # hero
    "IMG_3771.jpg.jpeg": ("saanane-boat", None),
    "DSC_7305.JPG.jpeg": ("whole-school-trees", None),
    "g2.jpg.jpeg": ("whole-school-group", None),
    "g3.jpg.jpeg": ("older-pupils", None),
    "g5.jpg.jpeg": ("young-class-teachers", None),
    "IMG_4018.jpg.jpeg": ("lunch-tables", None),
    "DSC_7737.JPG.jpeg": ("camel-ride", "mild"),
    "DSC_7501.JPG.jpeg": ("monkeys", "strong"),
    "DSC_7431.JPG.jpeg": ("zoo-shelter", "strong"),
    "DSC_7517.JPG.jpeg": ("eland", "mild"),
    "DSC_7528.JPG.jpeg": ("visitor", "mild"),
    "DSC_7532.JPG.jpeg": ("swing", "strong"),
    "DSC_7545.JPG.jpeg": ("group-at-shelter", None),
    "IMG-20230825-WA0079.jpg.jpeg": ("enclosure-group", None),
    "IMG-20241201-WA0009.jpg.jpeg": ("award-ceremony", None),
}

LOGO = "WhatsApp Image 2026-07-15 at 1.57.24 PM.jpeg"

# Logo black key-out: full transparency below LUMA_LO, feathered up to LUMA_HI.
# A hard cutoff leaves a black fringe around the lettering.
LUMA_LO = 34
LUMA_HI = 78


def apply_treatment(img: Image.Image, name: str) -> Image.Image:
    t = TREATMENTS[name]
    img = ImageEnhance.Color(img).enhance(t["color"])
    img = ImageEnhance.Brightness(img).enhance(t["brightness"])
    img = ImageEnhance.Contrast(img).enhance(t["contrast"])
    return img


def build_photo(src: Path, slug: str, treatment: str | None) -> list[str]:
    report = []
    with Image.open(src) as img:
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")
        if treatment:
            img = apply_treatment(img, treatment)

        for width in WIDTHS:
            if width > img.width and width != WIDTHS[0]:
                continue  # never upscale; keep at least the smallest size
            w = min(width, img.width)
            h = round(img.height * w / img.width)
            resized = img.resize((w, h), Image.LANCZOS)

            jpg = OUT / f"{slug}-{width}.jpg"
            resized.save(jpg, "JPEG", quality=JPEG_QUALITY[width],
                         optimize=True, progressive=True)
            webp = OUT / f"{slug}-{width}.webp"
            resized.save(webp, "WEBP", quality=WEBP_QUALITY[width], method=6)
            report.append(f"{webp.name}: {w}x{h} {webp.stat().st_size // 1024} KB "
                          f"(jpg {jpg.stat().st_size // 1024} KB)")
    return report


def key_out_black(img: Image.Image) -> Image.Image:
    """Make the logo's black background transparent, feathering the edge."""
    img = img.convert("RGBA")
    luma = img.convert("L")
    span = LUMA_HI - LUMA_LO
    alpha = luma.point(
        lambda v: 0 if v < LUMA_LO
        else 255 if v > LUMA_HI
        else round((v - LUMA_LO) / span * 255)
    )
    img.putalpha(alpha)
    return img


def build_logo(src: Path) -> list[str]:
    report = []
    with Image.open(src) as img:
        img = ImageOps.exif_transpose(img)
        keyed = key_out_black(img)
        # Trim to content so the logo sits tight in the header
        keyed = keyed.crop(keyed.getbbox())

        full = OUT / "logo.png"
        keyed.save(full, "PNG", optimize=True)
        report.append(f"{full.name}: {keyed.width}x{keyed.height} "
                      f"{full.stat().st_size // 1024} KB")

        # Small copy for the site header/footer — the full PNG is ~250 KB
        header = ImageOps.contain(keyed, (9999, 120), Image.LANCZOS)
        header_path = OUT / "logo-header.png"
        header.save(header_path, "PNG", optimize=True)
        report.append(f"{header_path.name}: {header.width}x{header.height} "
                      f"{header_path.stat().st_size // 1024} KB")

        for size, name in [(512, "logo-512.png"), (180, "apple-touch-icon.png"),
                           (64, "favicon-64.png"), (32, "favicon-32.png")]:
            icon = ImageOps.contain(keyed, (size, size), Image.LANCZOS)
            canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
            canvas.paste(icon, ((size - icon.width) // 2, (size - icon.height) // 2))
            path = OUT / name
            canvas.save(path, "PNG", optimize=True)
            report.append(f"{name}: {size}x{size} {path.stat().st_size // 1024} KB")
    return report


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    missing = [f for f in [*PHOTOS, LOGO] if not (RAW / f).exists()]
    if missing:
        print("Missing from assets/raw/:", *missing, sep="\n  ")
        return 1

    for filename, (slug, treatment) in PHOTOS.items():
        for line in build_photo(RAW / filename, slug, treatment):
            print(line)
    for line in build_logo(RAW / LOGO):
        print(line)
    print(f"\nDone. Output in {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
