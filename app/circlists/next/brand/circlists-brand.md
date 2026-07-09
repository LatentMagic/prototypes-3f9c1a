# Circlists — brand

Source of truth for the Circlists brand. Values here; pixels in the sibling SVGs.
One mark, one wordmark — used everywhere, no per-context variants to keep in sync.

Formerly LatentPulse; renamed to **Circlists** (2026-07-07).

---

## 1. Palette

- **Pulse Green** `#047857` — the disc, the wordmark tittle, primary brand colour.
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

**One asset, every context.** The halo is **opaque**, not transparent — so the mark reads at 16px on a light *or* dark background with no help. That is why there is **no card / tile / favicon variant**: the favicon *is* the mark. See [circlists-mark.svg](circlists-mark.svg).

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

Composed **deterministically** by [build_lockup.py](build_lockup.py) — it parses the wordmark's own baseline transform, so the alignment is never eyeballed and regenerates whenever the mark or wordmark changes. Shipped as drop-in assets for apps + sites:
[circlists-lockup.svg](circlists-lockup.svg) (ink, light grounds) · [circlists-lockup-reversed.svg](circlists-lockup-reversed.svg) (cream, dark grounds).

---

## 5. Type

Inter Bold (700), letter-spacing `-0.01em`, sentence case, one word.

---

## 6. Assets in this pack

- [circlists-mark.svg](circlists-mark.svg) — the mark. Also the favicon / app icon, as-is.
- [circlists-wordmark.svg](circlists-wordmark.svg) — wordmark, ink (light grounds).
- [circlists-wordmark-reversed.svg](circlists-wordmark-reversed.svg) — wordmark, cream (dark grounds).
- [circlists-lockup.svg](circlists-lockup.svg) — lockup, ink (generated; light grounds).
- [circlists-lockup-reversed.svg](circlists-lockup-reversed.svg) — lockup, cream (generated; dark grounds).
- [build_lockup.py](build_lockup.py) — composes the lockup(s) deterministically. `python build_lockup.py [unreversed|reversed|both]`.
- [build_board.py](build_board.py) — bundler; inlines the SVGs + both lockups into the board. Re-run after any SVG edit.
- [circlists-brand.html](circlists-brand.html) — visual board (generated; never hand-edit).
- [wordmark-outline.py](wordmark-outline.py) — regenerates the wordmark from Inter (needs the font + `fonttools`).

**How the wordmark was made:** outlined from Inter (variable, instanced to weight 700) with `fonttools`; the green tittle is laid as a real vector circle at the ratios above. The generator is captured for reuse (workspace brand-asset skill — pending).

---

## 7. Rollout (not yet propagated)

This pack is the source of truth. Still carrying the **old** brand, to update during the LatentPulse→Circlists rebrand:

- the prototype `favicon.svg` and app wordmark component (old fat ring, transparent halo, "LP" wordmark);
- all other LatentPulse references across business-ops and the wiki (no slug changes).
