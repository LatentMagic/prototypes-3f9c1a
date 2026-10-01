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
- **Cream** `#FAFAF7` — the page / app ground, and the opaque ground baked behind the installed app icon (the installed-icon exception, §2).
- **White** `#FFFFFF` — the white ring in the mark.

---

## 2. The mark (logo)

Three concentric circles — **sage halo → white ring → green disc** — and nothing else. No pad, no gradient, no letters, and no tile *on the mark itself* — the one place a ground is added is the installed app icon, the exception noted below.

Geometry, in a `0 0 48 48` box (keep these ratios at any size):

- **Halo** — `circle r=22.5`, fill `#8BBFAD`, opaque. ~47% of the box.
- **Disc** — `circle r=14.25`, fill `#047857`. ~30% of the box.
- **White ring** — `circle r=14.925`, no fill, stroke `#FFFFFF` width `1.35`. Its inner edge sits on the disc edge (r=14.25), so the green disc stays full and the ring reads as a thin separator into the halo.

**One mark, and the tab favicon *is* that mark.** The halo is **opaque**, not transparent — so the mark reads at 16px on a light *or* dark background with no help. The browser-tab favicon is therefore the bare mark on transparency, no tile, at **full size** — tested on light and dark tabs, it holds without a ground. See [circlists-mark.svg](assets/circlists-mark.svg); the tab set ([favicon.svg](assets/favicon.svg), `favicon.ico`, `favicon-16/32.png`) carries this.

**The installed app icon is the deliberate exception — an opaque ground.** iOS and Android home-screen icons cannot take transparency: they fill a transparent icon's corners with **black**, which reads as a small, muddy mark on a harsh tile. The rule generalises: **any surface where we can't control the surrounding colour** — installed icons, clickable app tiles, uncontrolled-background raster — bakes an opaque **cream** (`#FAFAF7`) ground under the *frozen* mark, held smaller (**~72%**) for breathing room. Cream keeps the full mark visible — halo, white ring, and the emerald disc as the focal point — and sits lighter alongside the light-ground apps a home screen is full of. The mark does not change; only a ground is added because the surface demands a filled square. Every raster is **supersampled** (rendered at 4× then downscaled) so the thin white ring stays crisp at small sizes.

**The installed icon ships in two forms, split by who rounds the tile.** A PWA manifest's `purpose` decides this, and the [web-app-manifest standard advises separate `any` + `maskable` icons, never the deprecated `"any maskable"`](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html):

- **`maskable` — phones round it.** iPhone and Android mask the tile to their own squircle, so the file stays a **hard opaque square**, full-bleed cream, mark at ~72% inside the safe zone. See [maskable-icon-192.png](assets/maskable-icon-192.png) · [maskable-icon-512.png](assets/maskable-icon-512.png).
- **`any` — nobody rounds it, so we do.** Desktop PWA (macOS dock, Windows) shows the file **as-is, unmasked** — a hard cream square, which reads unfinished. So the rounding is **baked into the file**: the same cream tile and ~72% mark, corners cut to a squircle (radius ~22% of the tile) with **transparent** corners. See [icon-192.png](assets/icon-192.png) · [icon-512.png](assets/icon-512.png). This is the plainly-named default per the standard; the maskable variant carries the qualifier.

[apple-touch-icon.png](assets/apple-touch-icon.png) (iOS home) stays a hard square — iOS rounds it itself, exactly like `maskable`.

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

**Inter** — the main text. Inter Bold (700), letter-spacing `-0.01em`, sentence case, one word.

**JetBrains Mono** — the accent, carrying small labels and link text. In use: the **Champion** marker on a circle's member list, status pills ("Coming soon"), section labels, and the URLs of shared links.

---

## 6. What's in this pack

Layout — the two "read me" surfaces at top, assets and machinery split into subdirs:

**Top** — [circlists-brand.html](circlists-brand.html) is the visual board (generated; never hand-edit); this spec is the source of truth for the values.

**In [assets/](assets/)** — the shippable output:

- `circlists-mark.svg` — the canonical mark, transparent, as-is. Source for every derivative below.
- `circlists-wordmark.svg` · `circlists-wordmark-reversed.svg` — wordmark, ink (light) and cream (dark).
- `circlists-lockup.svg` · `circlists-lockup-reversed.svg` — lockup, ink and cream (generated).
- `favicon.svg` — the tab favicon: the bare mark on transparency, full size (geometry identical to `circlists-mark.svg`; kept as a stable `<link rel=icon>` target).
- `favicon.ico` — packs 16·32·48 for classic browser tabs (transparent, full mark).
- `favicon-16.png` · `favicon-32.png` — modern `<link rel=icon>` (transparent, full mark).
- `apple-touch-icon.png` (180) — iOS home screen. **Opaque cream ground**, mark ~72%, hard square (iOS rounds it), supersampled (see §2 — the installed-icon exception).
- `icon-192.png` · `icon-512.png` — PWA manifest **`any`** (desktop: macOS dock, Windows). **Cream ground, corners rounded into the file** (transparent outside the squircle), mark ~72%, supersampled — because desktop shows the tile unmasked. Note: `icon-512` no longer doubles as the transparent universal raster mark (avatars, email, social) — export that from `circlists-mark.svg` instead.
- `maskable-icon-192.png` · `maskable-icon-512.png` — PWA manifest **`maskable`** (iPhone + Android). **Opaque cream ground, hard square**, mark ~72% (safe zone), supersampled — the phone OS masks the tile to its own shape.

**In [scripts/](scripts/)** — the deterministic generators (+ their font input). See [scripts/README.md](scripts/README.md) for the regenerate order:

- `wordmark-outline.py` — outlines the wordmark from Inter.
- `build_lockup.py` — composes the lockup(s).
- `build_rasters.py` — rasterises the mark → the PNG/ICO set.
- `build_board.py` — bundles everything into the board.

**How the wordmark was made:** outlined from Inter (variable, instanced to weight 700) with `fonttools`; the green tittle is laid as a real vector circle at the ratios above.
