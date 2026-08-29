#!/usr/bin/env python3
"""Rasterise the Circlists mark (SVG) into the PNG + ICO derivatives that non-SVG surfaces need.

The mark ships as vector. Two surface families need fixed-size raster, and they take DIFFERENT
grounds (the mark itself is frozen — only the ground and size vary):

  - Browser tab (favicon)      -> TRANSPARENT, mark at full size. Browsers honour transparency and
                                  the opaque halo reads on light or dark tabs, so the favicon is the
                                  bare mark, no ground (tested — see circlists-brand.md §2).
  - Installed app icon           -> OPAQUE CREAM tile, mark held smaller. iOS/Android fill a
    (iOS + PWA maskable + any)       transparent icon's corners with black, so a controlled ground is
                                     baked in. Splits by who rounds the tile: `maskable` (phones) +
                                     apple-touch stay HARD SQUARE — the OS masks them; `any` (desktop
                                     PWA, unmasked) bakes ROUNDED corners into the file itself.
                                     See circlists-brand.md §2 — the installed-icon exception.

Every raster is SUPERSAMPLED — composited at SS× the target then downscaled with LANCZOS — so thin
strokes (the white ring) resolve cleanly instead of aliasing at small sizes.

One source — circlists-mark.svg — regenerates the whole set deterministically.
Re-run after any change to the mark:  python build_rasters.py

Halo diameter is 93.75% of the mark's 48-box, so to make the halo span PCT% of the tile we
render the mark box at size*PCT/93.75 and centre it on the ground.

Needs cairosvg (SVG -> PNG) + Pillow (compositing + multi-size .ico)."""
import io, os
import cairosvg
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, os.pardir, "assets")            # source SVG + raster outputs live in ../assets
MARK = os.path.join(ASSETS, "circlists-mark.svg")

CREAM = (250, 250, 247, 255)   # installed-icon ground — brand cream, for any surface we can't control (brand §2)
CLEAR = (0, 0, 0, 0)
HALO_FRAC = 93.75            # halo diameter as % of the mark's own 48-box
FULL = 93.75                # favicon: mark at full size (halo spans the box, no padding)
ICON_PCT = 72               # installed-icon mark size — held smaller for breathing room on the ground
SS = 4                      # supersample factor — render at SS× target, downscale LANCZOS
CORNER_FRAC = 0.2237        # rounded-tile corner radius as fraction of the tile — macOS/iOS squircle-ish
SQUARE = 0                  # no rounding — the corners stay hard (the OS masks the tile itself)

# name -> (edge px, ground, mark % of tile, flatten to opaque RGB, corner radius fraction)
#
# Two installed-icon families, split by manifest `purpose` (brand §2 — separate `any` + `maskable`,
# never the deprecated "any maskable"):
#   any      -> icon-*          : shown AS-IS, so the rounding is BAKED IN (transparent corners).
#                                 Desktop PWA (macOS dock, Windows) does NOT mask, so without this it
#                                 renders a hard cream square — the reason the desktop icon looked unfinished.
#   maskable -> maskable-icon-* : the OS masks it to its own shape, so the tile stays a hard opaque
#                                 SQUARE with full-bleed cream and no baked corners. iPhone + Android.
TARGETS = {
    "favicon-16.png":         (16,  CLEAR, FULL,     False, SQUARE),        # tab — bare mark, full size
    "favicon-32.png":         (32,  CLEAR, FULL,     False, SQUARE),        # tab — bare mark, full size
    "apple-touch-icon.png":   (180, CREAM, ICON_PCT, True,  SQUARE),        # iOS home — iOS rounds it itself
    "icon-192.png":           (192, CREAM, ICON_PCT, False, CORNER_FRAC),   # PWA `any` — desktop, rounded, transparent corners
    "icon-512.png":           (512, CREAM, ICON_PCT, False, CORNER_FRAC),   # PWA `any` — desktop, rounded, transparent corners
    "maskable-icon-192.png":  (192, CREAM, ICON_PCT, True,  SQUARE),        # PWA `maskable` — phones crop it
    "maskable-icon-512.png":  (512, CREAM, ICON_PCT, True,  SQUARE),        # PWA `maskable` — phones crop it
}
ICO_SIZES = [16, 32, 48]    # favicon.ico packs the classic browser sizes (transparent, full mark)
ICO_BASE = 256

# favicon.svg — the bare mark, full size (identical geometry to circlists-mark.svg; kept as a
# stable <link rel=icon> target). Mark frozen, no ground.
FAVICON_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Circlists">
  <title>Circlists</title>
  <circle cx="24" cy="24" r="22.5" fill="#8bbfad"/>
  <circle cx="24" cy="24" r="14.25" fill="#047857"/>
  <circle cx="24" cy="24" r="14.925" fill="none" stroke="#ffffff" stroke-width="1.35"/>
</svg>
'''


def render_mark(px):
    """Rasterise the mark to a Pillow RGBA image, px x px, transparent."""
    png = cairosvg.svg2png(url=MARK, output_width=px, output_height=px)
    return Image.open(io.BytesIO(png)).convert("RGBA")


def compose(size, ground, pct, corner=SQUARE):
    """Frozen mark at pct% of the tile, centred on the ground. Composited at SS× the target then
    downscaled with LANCZOS (supersampling) so thin strokes stay crisp instead of aliasing.

    corner > 0 bakes rounded corners: everything outside a rounded rectangle (radius = corner × the
    tile) becomes transparent, so an un-masked surface (desktop PWA) shows the tile already rounded."""
    r = round(size * pct / HALO_FRAC)
    big = Image.new("RGBA", (size * SS, size * SS), ground)
    off = (size * SS - r * SS) // 2
    big.alpha_composite(render_mark(r * SS), (off, off))
    if corner:
        mask = Image.new("L", (size * SS, size * SS), 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            (0, 0, size * SS - 1, size * SS - 1), radius=round(size * SS * corner), fill=255)
        big.putalpha(mask)
    return big.resize((size, size), Image.LANCZOS)


def main():
    os.makedirs(ASSETS, exist_ok=True)
    for name, (size, ground, pct, flat, corner) in TARGETS.items():
        img = compose(size, ground, pct, corner)
        if flat:
            img = img.convert("RGB")
        img.save(os.path.join(ASSETS, name))
        shape = "rounded" if corner else "square"
        print(f"wrote {name} ({size}x{size}, {'cream' if ground == CREAM else 'transparent'}, mark {pct}%, {shape}, {SS}x supersampled)")
    compose(ICO_BASE, CLEAR, FULL).save(os.path.join(ASSETS, "favicon.ico"),
                                        sizes=[(s, s) for s in ICO_SIZES])
    print(f"wrote favicon.ico {ICO_SIZES}")
    with open(os.path.join(ASSETS, "favicon.svg"), "w") as f:
        f.write(FAVICON_SVG)
    print("wrote favicon.svg (full mark)")


if __name__ == "__main__":
    main()
