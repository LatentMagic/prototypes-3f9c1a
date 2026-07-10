# Circlists — brand

Source of truth for the Circlists brand *values*. Pixels in the sibling SVGs.
One mark, one wordmark — used everywhere, no per-context variants to keep in sync.

Formerly LatentPulse; renamed to **Circlists** (2026-07-07).

This is a manually-synced **local copy**. The canonical pack — including the
deterministic generator scripts and vendored font — lives upstream; see
[BRANDING.md](../../BRANDING.md) at the project root for where.

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

**One asset, every context.** The halo is **opaque**, not transparent — so the mark reads at 16px on a light *or* dark background with no help. That is why there is **no card / tile / favicon variant**: the favicon *is* the mark. See [circlists-mark.svg](circlists-mark.svg) — rasterised to the favicon/icon set below for surfaces that can't take SVG.

---

## 3. The wordmark

**"Circlists"** in **Inter Bold (700)**, letter-spacing `-0.01em`, sentence case, always one word.

- **Outlined to vector paths** — font-independent, renders identically everywhere with no font loaded.
- **Colour** — Ink `#0A0A0A` on light grounds; Cream `#FAFAF7` reversed on dark grounds.
- **The tittle** — a green `#047857` dot on the **second** `i` (in "l**i**sts"); the first `i` keeps its native black dot. The green tittle is **⌀ 0.25 × cap-height** and its centre is **raised to 1.18 × cap-height above the baseline** — it floats deliberately above the caps, and reads a touch larger than the native i-dot.

Two files, **geometrically identical — only the ink colour differs**:
[circlists-wordmark.svg](circlists-wordmark.svg) (ink) · [circlists-wordmark-reversed.svg](circlists-wordmark-reversed.svg) (cream).

---

## 4. Lockup

Mark left of the wordmark, vertically centred on the wordmark's cap-midpoint. Mark height = **1.5×** the wordmark's cap-height; gap = **0.4×** cap.

Composed deterministically upstream (it parses the wordmark's own baseline transform, so the alignment is never eyeballed). Shipped here as drop-in assets:
[circlists-lockup.svg](circlists-lockup.svg) (ink, light grounds) · [circlists-lockup-reversed.svg](circlists-lockup-reversed.svg) (cream, dark grounds).

---

## 5. Type

Inter Bold (700), letter-spacing `-0.01em`, sentence case, one word.

---

## 6. Assets in this local copy

- [circlists-mark.svg](circlists-mark.svg) — the mark. Also the favicon / app-icon source.
- [circlists-wordmark.svg](circlists-wordmark.svg) / [circlists-wordmark-reversed.svg](circlists-wordmark-reversed.svg) — wordmark, ink (light) / cream (dark).
- [circlists-lockup.svg](circlists-lockup.svg) / [circlists-lockup-reversed.svg](circlists-lockup-reversed.svg) — lockup, ink / cream (generated).
- `favicon.ico` — packs 16·32·48 for classic browser tabs.
- `favicon-16.png` · `favicon-32.png` — modern `<link rel=icon>`.
- `apple-touch-icon.png` (180) — iOS home screen.
- `icon-192.png` · `icon-512.png` — PWA / Android manifest; the 512 also doubles as the raster mark for avatars, email, and social.
- [circlists-brand.html](circlists-brand.html) — visual board (generated; never hand-edit).

The generator scripts (`wordmark-outline.py`, `build_lockup.py`, `build_rasters.py`, `build_board.py`) and their font input aren't mirrored here — they live with the canonical pack. See [BRANDING.md](../../BRANDING.md) if you need to regenerate anything.

---

## 7. Rollout

Rebrand propagated across this site: header/footer lockup, favicon/icon set, palette in `tokens.css`. If you find old LatentPulse marks anywhere else (business-ops, wiki), they're stragglers — flag upstream.
