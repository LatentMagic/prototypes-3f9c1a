---
type: Concept
title: "Circlists Brand"
description: "Circlists's brand — one mark, one wordmark, one lockup: palette, type, mark geometry, and the tittle every surface shares, with the deterministic generators and raster exports."
tags: ["product", "brand"]
timestamp: 2026-07-08T00:00:00Z
---

# Circlists — brand

The brand every Circlists surface shares — the product app, the homepage, and anything built downstream. The product it dresses: [circlists.md](../circlists.md).

Source of truth for the Circlists brand. Values here; pixels in the SVGs under [assets/](assets/). One mark, one wordmark — used everywhere, no per-context variants to keep in sync. The SVGs are shippable as-is; the generators in [scripts/](scripts/) regenerate them (and the raster exports) deterministically.

Formerly LatentPulse; renamed to **Circlists** (2026-07-07).

---

## 1. Palette

- **Emerald** `#047857` — the disc, the wordmark tittle, primary brand colour.
- **Sage** `#8BBFAD` — the halo (opaque). Reads at every size, on any ground.
- **Ink** `#0A0A0A` — the wordmark and body text.
- **Cream** `#FAFAF7` — the page / app ground.

---

## 2. The mark (logo)

Three concentric circles — **sage halo → white ring → green disc** — and nothing else. No pad, no gradient, no letters, no tile.

Geometry, in a `0 0 48 48` box (keep these ratios at any size):

- **Halo** — `circle r=22.5`, fill `#8BBFAD`, opaque. ~47% of the box.
- **Disc** — `circle r=14.25`, fill `#047857`. ~30% of the box.
- **White ring** — `circle r=14.925`, no fill, stroke `#FFFFFF` width `1.35`. Its inner edge sits on the disc edge (r=14.25), so the green disc stays full and the ring reads as a thin separator into the halo.

**One asset, every context.** The halo is **opaque**, not transparent — so the mark reads at 16px on a light *or* dark background with no help. That is why there is **no card / tile / favicon variant**: the favicon *is* the mark. See [circlists-mark.svg](assets/circlists-mark.svg) — rasterised to `favicon.ico` + PNGs by [build_rasters.py](scripts/build_rasters.py) for surfaces that can't take SVG.

---

## 3. The wordmark

**"Circlists"** in **Inter Bold (700)**, letter-spacing `-0.01em`, sentence case, always one word.

- **Outlined to vector paths** — font-independent, renders identically everywhere with no font loaded.
- **Colour** — Ink `#0A0A0A` on light grounds; Cream `#FAFAF7` reversed on dark grounds.
- **The tittle** — a green `#047857` dot on the **second** `i` (in "l**i**sts"); the first `i` keeps its native black dot. The green tittle is **⌀ 0.25 × cap-height** and its centre is **raised to 1.18 × cap-height above the baseline** — it floats deliberately above the caps, and reads a touch larger than the native i-dot.

Two files, **geometrically identical — only the ink colour differs**:
[circlists-wordmark.svg](assets/circlists-wordmark.svg) (ink) · [circlists-wordmark-reversed.svg](assets/circlists-wordmark-reversed.svg) (cream).

---

## 4. Lockup

Mark left of the wordmark, vertically centred on the wordmark's cap-midpoint. Mark height = **1.5×** the wordmark's cap-height; gap = **0.4×** cap.

Composed **deterministically** by [build_lockup.py](scripts/build_lockup.py) — it parses the wordmark's own baseline transform, so the alignment is never eyeballed and regenerates whenever the mark or wordmark changes. Shipped as drop-in assets for apps + sites:
[circlists-lockup.svg](assets/circlists-lockup.svg) (ink, light grounds) · [circlists-lockup-reversed.svg](assets/circlists-lockup-reversed.svg) (cream, dark grounds).

---

## 5. Type

Inter Bold (700), letter-spacing `-0.01em`, sentence case, one word.

---

## 6. What's in this pack

Layout — the two "read me" surfaces at top, assets and machinery split into subdirs:

**Top** — [circlists-brand.html](circlists-brand.html) is the visual board (generated; never hand-edit); this spec is the source of truth for the values.

**In [assets/](assets/)** — the shippable output:

- `circlists-mark.svg` — the mark. Also the favicon / app icon, as-is.
- `circlists-wordmark.svg` · `circlists-wordmark-reversed.svg` — wordmark, ink (light) and cream (dark).
- `circlists-lockup.svg` · `circlists-lockup-reversed.svg` — lockup, ink and cream (generated).
- `favicon.ico` — packs 16·32·48 for classic browser tabs.
- `favicon-16.png` · `favicon-32.png` — modern `<link rel=icon>`.
- `apple-touch-icon.png` (180) — iOS home screen.
- `icon-192.png` · `icon-512.png` — PWA / Android manifest; the 512 doubles as the raster mark for avatars, email, and social.

**In [scripts/](scripts/)** — the deterministic generators (+ their font input). See [scripts/README.md](scripts/README.md) for the regenerate order:

- `wordmark-outline.py` — outlines the wordmark from Inter.
- `build_lockup.py` — composes the lockup(s).
- `build_rasters.py` — rasterises the mark → the PNG/ICO set.
- `build_board.py` — bundles everything into the board.

**How the wordmark was made:** outlined from Inter (variable, instanced to weight 700) with `fonttools`; the green tittle is laid as a real vector circle at the ratios above.
