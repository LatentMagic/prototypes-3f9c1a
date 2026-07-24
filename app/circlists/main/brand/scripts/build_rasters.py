#!/usr/bin/env python3
"""Rasterise the Circlists mark (SVG) into the PNG + ICO derivatives that non-SVG surfaces need.

The mark ships as vector, but browsers' favicons, iOS/Android home-screen icons, PWA manifests,
and every raster context (profile avatars, email signatures, social share images) need fixed-size
PNG/ICO. One source — circlists-mark.svg — regenerates the whole raster set deterministically.
Re-run after any change to the mark:  python build_rasters.py

The mark's opaque sage halo means these read at 16px on any ground; its transparent corners carry
through, so every output is a circular icon on transparency — never a square tile.

Needs cairosvg (SVG -> PNG) + Pillow (PNG -> multi-size .ico)."""
import io, os
import cairosvg
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, os.pardir, "assets")            # source SVG + raster outputs live in ../assets
MARK = os.path.join(ASSETS, "circlists-mark.svg")

# filename -> edge size (px). The surfaces link these PNGs directly.
PNGS = {
    "favicon-16.png": 16,          # modern <link rel=icon>
    "favicon-32.png": 32,          # modern <link rel=icon>
    "apple-touch-icon.png": 180,   # iOS add-to-home-screen
    "icon-192.png": 192,           # PWA / Android manifest
    "icon-512.png": 512,           # PWA manifest + the universal raster mark (avatars, email, social)
}
ICO_SIZES = [16, 32, 48]           # favicon.ico packs the classic browser sizes into one file
ICO_BASE = 256                     # render the .ico source large, let Pillow downscale each size cleanly


def render(size):
    """Rasterise the mark to a Pillow RGBA image, size x size, transparent ground."""
    png = cairosvg.svg2png(url=MARK, output_width=size, output_height=size)
    return Image.open(io.BytesIO(png)).convert("RGBA")


def main():
    os.makedirs(ASSETS, exist_ok=True)
    for name, size in PNGS.items():
        render(size).save(os.path.join(ASSETS, name))
        print(f"wrote {name} ({size}x{size})")
    render(ICO_BASE).save(os.path.join(ASSETS, "favicon.ico"),
                          sizes=[(s, s) for s in ICO_SIZES])
    print(f"wrote favicon.ico {ICO_SIZES}")


if __name__ == "__main__":
    main()
