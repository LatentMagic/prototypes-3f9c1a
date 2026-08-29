---
type: Process
title: "Circlists Brand — Regenerating the Assets"
description: "How to regenerate the Circlists brand assets — the generator order, the dependencies, and the vendored Inter font."
tags: ["product", "brand"]
timestamp: 2026-07-09T00:00:00Z
---

# Regenerating the brand assets

These generators rebuild everything in [../assets/](../assets/) deterministically. They read from and write to `../assets/`; `build_board.py` renders the board to `../circlists-brand.html`. Run from this `scripts/` directory.

## Order

Later steps consume earlier outputs, so run in order:

1. **`wordmark-outline.py`** — outlines the wordmark from Inter → `circlists-wordmark.svg`. For the reversed (cream) variant, override the ink and output:
   `WM_INK="#fafaf7" WM_OUT=../assets/circlists-wordmark-reversed.svg python wordmark-outline.py`
2. **`build_lockup.py both`** — composes the lockups from the mark + wordmark.
3. **`build_rasters.py`** — rasterises the mark → the PNG + ICO set.
4. **`build_board.py`** — bundles the SVGs + rasters into the board.

## Dependencies

- **`fonttools` + `brotli`** — `wordmark-outline.py` (reads the woff2, outlines the glyphs).
- **`cairosvg` + `Pillow`** — `build_rasters.py` (SVG → PNG, PNG → multi-size ICO).
- `build_lockup.py` and `build_board.py` are stdlib-only.

## The font

`inter-latin-wght-normal.woff2` is **Inter**, vendored here so the wordmark builds standalone. Inter is licensed under the **SIL Open Font License 1.1** — redistribution is permitted, and the OFL notice travels with the font.
