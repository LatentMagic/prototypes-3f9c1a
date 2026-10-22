#!/usr/bin/env python3
"""Rasterise the Circlists SVGs into the PNG + ICO derivatives that non-SVG surfaces need.

Three jobs, written to three places:

  1. APP ICONS -> ../assets/icons/ : the favicon + installed-icon set, composed from the mark on a
     ground (see below). Fixed sizes the OS and the browser dictate. The set includes the
     NOTIFICATION ICON — the mark carrying an arrival badge, which the tab swaps to while links wait —
     and the NOTIFICATION BADGE, the mark as a one-channel silhouette for Android's notification header.
  2. SHARE PNGS -> ../assets/{mark,wordmark,lockup}/ : a plain transparent PNG of each shippable
     SVG, at two sizes, for surfaces that won't take vector — avatar uploads, profile images,
     email signatures, social, slide decks. Geometry identical to the SVG; nothing added.
  3. NATIVE APP ICONS -> ../assets/native/ : the Circlists native app's icon sources (Capacitor,
     Android + iOS) — see NATIVE_ICONS below. Same composition as the installed icon; only the format
     each OS asks for changes.

The icon set takes DIFFERENT grounds (the mark itself is frozen — only the ground and size vary):

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

The SVGs regenerate the whole set deterministically — the icons from circlists-mark.svg alone.
Re-run after any change to the mark, wordmark, or lockup:  python build_rasters.py

Halo diameter is 93.75% of the mark's 48-box, so to make the halo span PCT% of the tile we
render the mark box at size*PCT/93.75 and centre it on the ground.

Needs cairosvg (SVG -> PNG) + Pillow (compositing + multi-size .ico)."""
import io, os, re
import cairosvg
from PIL import Image, ImageDraw
from brand_tokens import *
from build_mark import mark_svg


def hex_rgba(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (255,)

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, os.pardir, "assets")            # one dir per thing: mark/ wordmark/ lockup/ icons/ native/
ICONS = os.path.join(ASSETS, "icons")                       # favicon + installed-icon outputs
NATIVE = os.path.join(ASSETS, "native")                     # native app (Capacitor) icon sources
MARK = os.path.join(ASSETS, "mark", "circlists-mark.svg")

CREAM_RGBA = hex_rgba(CREAM)   # installed-icon ground — brand cream, for any surface we can't control (brand §2)
CLEAR = (0, 0, 0, 0)
BLACK_RGBA = (0, 0, 0, 255)         # iOS tinted-icon ground — Apple wants the tinted icon opaque grayscale on black
# HALO_FRAC (halo diameter as % of the mark's 48-box) comes from brand_tokens
FULL = HALO_FRAC                # favicon: mark at full size (halo spans the box, no padding)
# ICON_PCT (installed-icon mark size), SS (supersample factor), CORNER_FRAC (rounded-tile corner radius) come from brand_tokens
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
    "apple-touch-icon.png":   (180, CREAM_RGBA, ICON_PCT, True,  SQUARE),        # iOS home — iOS rounds it itself
    "icon-192.png":           (192, CREAM_RGBA, ICON_PCT, False, CORNER_FRAC),   # PWA `any` — desktop, rounded, transparent corners
    "icon-512.png":           (512, CREAM_RGBA, ICON_PCT, False, CORNER_FRAC),   # PWA `any` — desktop, rounded, transparent corners
    "maskable-icon-192.png":  (192, CREAM_RGBA, ICON_PCT, True,  SQUARE),        # PWA `maskable` — phones crop it
    "maskable-icon-512.png":  (512, CREAM_RGBA, ICON_PCT, True,  SQUARE),        # PWA `maskable` — phones crop it
    "app-store-icon-1024.png": (1024, CREAM_RGBA, ICON_PCT, True, SQUARE),       # Apple App Store listing — opaque RGB, no alpha; Apple rounds it
    "play-store-icon-512.png": (512, CREAM_RGBA, ICON_PCT, False, SQUARE),       # Google Play listing — 32-bit PNG, every pixel opaque; Play rounds it
}
ICO_SIZES = [16, 32, 48]    # favicon.ico packs the classic browser sizes (transparent, full mark)
ICO_BASE = 256
NOTIFY_SIZES = [16, 32]     # notification icon — tab only, so it takes the favicon sizes and no more

# The arrival badge, appended to the mark to make the NOTIFICATION ICON (see notification_svg).
# Every number is taken from the mark, not chosen freshly:
#   - stroke-width 1.35 is the exact weight of the ring already sitting between the mark's core and
#     halo, so the badge reads as construction rather than something stuck on. Do not change it
#     independently of the mark.
#   - #ffffff matches the mark's own ring. Brand cream (#FAFAF7) is the installed-icon GROUND, never
#     a stroke colour.
#   - the disc sits 16.97 from centre against a halo radius of 22.5, so it BREAKS the silhouette by
#     ~3.9. That break is what makes it detectable peripherally at 16px — load-bearing, not
#     decorative. Do not tuck the badge inside the halo.
#   - outer edge lands at 46.75 of the 48 box, inside the mark's own 46.5 margin. An earlier draft at
#     cx 39 r 11 reached 50 and was silently clipped on two sides. Re-check the box if this moves.
# Keyline first, disc over it, so the stroke reads as a clean outer edge rather than eating the emerald.
BADGE = (f'  <circle cx="{BADGE_AT[0]}" cy="{BADGE_AT[1]}" r="{BADGE_KEYLINE_R:g}" fill="none" stroke="{WHITE.lower()}" stroke-width="{RING_W:g}"/>\n'
         f'  <circle cx="{BADGE_AT[0]}" cy="{BADGE_AT[1]}" r="{BADGE_R:g}" fill="{EMERALD.lower()}"/>\n')

# The NOTIFICATION BADGE (see badge_svg) — the mark's white ring cut out as a transparent gap.
#   - BADGE_GAP 1.8 widens the mark's 1.35 ring, centred on the same radius. At 1.35 the gap closes
#     under antialiasing at 16px; 1.8 stays open there, and wider starts to read as two rings.
#   - Fill is black on transparency. Android reads only alpha and tints it, so colour is
#     irrelevant to the OS; black previews as the glyph Android draws. Do not "fix" it to emerald.
#   - The badge FILE takes no ground, no rounding, no colour variants — it is a silhouette, never shown
#     as a tile. Its geometry is reused, recoloured, only for OS theming layers (NATIVE_ICONS below).
# BADGE_GAP, BADGE_SIZE (MDN: accommodate up to 4x density, 24dp x 4) come from brand_tokens

# Share PNGs — a straight transparent raster of each shippable SVG, for surfaces that won't take
# vector. Sizes are the LONG EDGE (square for the mark, width for the wordmark + lockup); the short
# edge follows the SVG's own aspect, so the geometry is the SVG's, untouched. Two sizes each:
# the smaller is the everyday upload (avatars, signatures), the larger covers print + retina decks.
#   subdir -> (stems, long-edge sizes)
SHARE = {
    "mark":     (["circlists-mark"], (512, 1024)),
    "wordmark": (["circlists-wordmark", "circlists-wordmark-reversed"], (1024, 2048)),
    "lockup":   (["circlists-lockup", "circlists-lockup-reversed"], (1024, 2048)),
}

# NATIVE APP ICONS — the sources the Circlists native app (Capacitor) builds its icons from. Every
# raster is 1024 square, the size @capacitor/assets and Xcode take. Same composition as the installed
# icon: the frozen mark, halo at ICON_PCT% of the VISIBLE tile.
#
# The visible tile is the whole file on iOS. On Android it is the inner 72dp of the 108dp adaptive layer:
# @capacitor/assets insets each adaptive layer by 16.7% a side, so its 1024 source maps onto exactly that
# 72dp, and a 72% halo lands at ~52dp — inside Android's 48-66dp logo guide and its 66dp never-masked zone.
#
#   name -> (ground, mark source, flatten to opaque RGB)
#     "mark"       = circlists-mark.svg, full colour
#     "silhouette" = the notification badge's geometry (halo + disc solid, ring cut out), black on
#                    transparency like the badge — Android reads only alpha, so black previews what it draws
#     "silhouette-light" = the same, white — iOS tints by brightness, so the shape must be the light part
NATIVE_ICONS = {
    "icon-only.png":       (CREAM_RGBA, "mark",       True),    # iOS app icon + Android legacy icons. Opaque — the App Store rejects alpha
    "icon-foreground.png": (CLEAR, "mark",       False),   # Android adaptive foreground
    "ios-icon-dark.png":   (CLEAR, "mark",       False),   # iOS dark appearance — transparent, so the system's dark ground shows
    "ios-icon-tinted.png": (BLACK_RGBA, "silhouette-light", True),   # iOS tinted appearance — opaque grayscale; the system tints by brightness
    "icon-monochrome.png": (CLEAR, "silhouette", False),   # Android themed icon (13+), raster preview — ship the vector drawable below
}
NATIVE_EDGE = 1024
# The monochrome layer also ships as an Android VECTOR drawable — crisp at every density, and Android's
# preferred form. It is a full 108dp layer used WITHOUT an inset, so the halo is placed directly: 72% of
# the 72dp visible tile, centred on the 108dp canvas.
# ADAPTIVE_DP, ADAPTIVE_VISIBLE_DP come from brand_tokens

# favicon.svg — the bare mark, full size (identical geometry to circlists-mark.svg; kept as a
# stable <link rel=icon> target). Mark frozen, no ground.
FAVICON_SVG = mark_svg()


def notification_svg():
    """The mark with the arrival badge — the tab's ARRIVED state.

    Built by reading circlists-mark.svg and appending the badge, never by restating the mark's own
    circles, so the two stay in lockstep: change the mark and the notification icon follows."""
    svg = open(MARK).read()
    svg = svg.replace("<title>Circlists</title>", "<title>Circlists — new links</title>")
    svg = svg.replace('aria-label="Circlists"', 'aria-label="Circlists — new links"')
    return svg.replace("</svg>", BADGE + "</svg>")


def mark_geometry():
    """Read the mark's own radii from circlists-mark.svg: (halo r, ring centre r, ring stroke width).
    The halo is the largest filled circle; the ring is the stroked one."""
    svg = open(MARK).read()
    filled = [float(r) for r in re.findall(r'<circle[^>]*\br="([\d.]+)"[^>]*fill="#(?!none)', svg)]
    ring = re.search(r'<circle[^>]*\br="([\d.]+)"[^>]*fill="none"[^>]*stroke-width="([\d.]+)"', svg)
    return max(filled), float(ring.group(1)), float(ring.group(2))


def silhouette_circles(cx, cy, scale):
    """The silhouette as one even-odd path: halo, then the ring's gap as two circles, so the halo and
    disc are solid and the white ring is cut out. Radii are read from circlists-mark.svg (the mark's own
    48-box, centred on 24,24) and scaled about the given centre, so it follows the mark."""
    halo, ring, _ = mark_geometry()
    def circle(r):
        r = round(r * scale, 4)
        return f"M{round(cx - r, 4):g},{cy:g}a{r:g},{r:g} 0 1,0 {round(2 * r, 4):g},0a{r:g},{r:g} 0 1,0 {round(-2 * r, 4):g},0Z"
    return circle(halo) + circle(ring + BADGE_GAP / 2) + circle(ring - BADGE_GAP / 2)


def badge_svg(fill="#000000"):
    """The NOTIFICATION BADGE — the mark re-expressed on the alpha channel alone, for the Web
    Notifications `badge` (Android's small icon, which keeps only alpha and tints it itself).

    Halo and disc become opaque; the white ring becomes the transparent gap. One even-odd path of
    three concentric circles, radii read from circlists-mark.svg so the badge follows the mark."""
    d = silhouette_circles(24, 24, 1)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Circlists">
  <title>Circlists</title>
  <path fill="{fill}" fill-rule="evenodd" d="{d}"/>
</svg>
'''


def monochrome_vector():
    """The Android themed-icon layer as a vector drawable: the silhouette, halo at ICON_PCT% of the
    72dp visible tile, centred on the 108dp layer. Android reads only its alpha and tints it."""
    halo, _, _ = mark_geometry()
    scale = ADAPTIVE_VISIBLE_DP * ICON_PCT / 100 / (2 * halo)
    c = ADAPTIVE_DP / 2
    return f'''<?xml version="1.0" encoding="utf-8"?>
<!-- Circlists themed-icon layer (Android 13+). Generated by build_rasters.py; never hand-edit. -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="{ADAPTIVE_DP}dp"
    android:height="{ADAPTIVE_DP}dp"
    android:viewportWidth="{ADAPTIVE_DP}"
    android:viewportHeight="{ADAPTIVE_DP}">
    <path
        android:fillColor="#FF000000"
        android:fillType="evenOdd"
        android:pathData="{silhouette_circles(c, c, scale)}" />
</vector>
'''


def render_mark(px, src=MARK):
    """Rasterise an icon SVG (a path, or the SVG text itself) to a Pillow RGBA image, px x px, transparent."""
    source = {"bytestring": src.encode()} if src.lstrip().startswith("<") else {"url": src}
    png = cairosvg.svg2png(**source, output_width=px, output_height=px)
    return Image.open(io.BytesIO(png)).convert("RGBA")


def compose(size, ground, pct, corner=SQUARE, src=MARK):
    """Frozen mark at pct% of the tile, centred on the ground. Composited at SS× the target then
    downscaled with LANCZOS (supersampling) so thin strokes stay crisp instead of aliasing.

    corner > 0 bakes rounded corners: everything outside a rounded rectangle (radius = corner × the
    tile) becomes transparent, so an un-masked surface (desktop PWA) shows the tile already rounded."""
    r = round(size * pct / HALO_FRAC)
    big = Image.new("RGBA", (size * SS, size * SS), ground)
    off = (size * SS - r * SS) // 2
    big.alpha_composite(render_mark(r * SS, src), (off, off))
    if corner:
        mask = Image.new("L", (size * SS, size * SS), 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            (0, 0, size * SS - 1, size * SS - 1), radius=round(size * SS * corner), fill=255)
        big.putalpha(mask)
    return big.resize((size, size), Image.LANCZOS)


def export_share(subdir, stem, long_edge):
    """Write <stem>-<long_edge>.png beside its SVG — the SVG rendered straight to raster on
    transparency, short edge from the SVG's own aspect. Rendered from vector at the target size,
    so no supersampling is needed (unlike the composed icons)."""
    src = os.path.join(ASSETS, subdir, f"{stem}.svg")
    vb = re.search(r'viewBox="([^"]+)"', open(src).read()).group(1)
    _, _, w, h = map(float, vb.split())
    out_w = long_edge if w >= h else round(long_edge * w / h)
    out_h = long_edge if h >= w else round(long_edge * h / w)
    out = os.path.join(ASSETS, subdir, f"{stem}-{long_edge}.png")
    cairosvg.svg2png(url=src, output_width=out_w, output_height=out_h, write_to=out)
    print(f"wrote {subdir}/{stem}-{long_edge}.png ({out_w}x{out_h}, transparent)")


def main():
    os.makedirs(ICONS, exist_ok=True)
    for name, (size, ground, pct, flat, corner) in TARGETS.items():
        img = compose(size, ground, pct, corner)
        if flat:
            img = img.convert("RGB")
        img.save(os.path.join(ICONS, name))
        shape = "rounded" if corner else "square"
        print(f"wrote icons/{name} ({size}x{size}, {'cream' if ground == CREAM_RGBA else 'transparent'}, mark {pct}%, {shape}, {SS}x supersampled)")
    compose(ICO_BASE, CLEAR, FULL).save(os.path.join(ICONS, "favicon.ico"),
                                        sizes=[(s, s) for s in ICO_SIZES])
    print(f"wrote icons/favicon.ico {ICO_SIZES}")
    with open(os.path.join(ICONS, "favicon.svg"), "w") as f:
        f.write(FAVICON_SVG)
    print("wrote icons/favicon.svg (full mark)")
    notify_svg = os.path.join(ICONS, "favicon-notification.svg")
    with open(notify_svg, "w") as f:
        f.write(notification_svg())
    print("wrote icons/favicon-notification.svg (mark + arrival badge)")
    for size in NOTIFY_SIZES:
        compose(size, CLEAR, FULL, src=notify_svg).save(
            os.path.join(ICONS, f"favicon-notification-{size}.png"))
        print(f"wrote icons/favicon-notification-{size}.png ({size}x{size}, transparent, {SS}x supersampled)")
    badge = os.path.join(ICONS, "notification-badge.svg")
    with open(badge, "w") as f:
        f.write(badge_svg())
    print(f"wrote icons/notification-badge.svg (alpha silhouette, gap {BADGE_GAP})")
    compose(BADGE_SIZE, CLEAR, FULL, src=badge).save(
        os.path.join(ICONS, f"notification-badge-{BADGE_SIZE}.png"))
    print(f"wrote icons/notification-badge-{BADGE_SIZE}.png ({BADGE_SIZE}x{BADGE_SIZE}, transparent, {SS}x supersampled)")
    os.makedirs(NATIVE, exist_ok=True)
    sources = {"mark": MARK, "silhouette": badge_svg(), "silhouette-light": badge_svg(WHITE.lower())}
    for name, (ground, src, flat) in NATIVE_ICONS.items():
        img = compose(NATIVE_EDGE, ground, ICON_PCT, src=sources[src])
        if flat:
            img = img.convert("RGB")
        img.save(os.path.join(NATIVE, name))
        print(f"wrote native/{name} ({NATIVE_EDGE}x{NATIVE_EDGE}, {src}, {SS}x supersampled)")
    Image.new("RGB", (NATIVE_EDGE, NATIVE_EDGE), CREAM_RGBA[:3]).save(os.path.join(NATIVE, "icon-background.png"))
    print(f"wrote native/icon-background.png ({NATIVE_EDGE}x{NATIVE_EDGE}, cream, full bleed)")
    with open(os.path.join(NATIVE, "ic_launcher_monochrome.xml"), "w") as f:
        f.write(monochrome_vector())
    print("wrote native/ic_launcher_monochrome.xml (Android vector drawable, 108dp)")
    for subdir, (stems, sizes) in SHARE.items():
        for stem in stems:
            for size in sizes:
                export_share(subdir, stem, size)


if __name__ == "__main__":
    main()
