---
type: Process
title: "Circlists Brand — Regenerating the Assets"
description: "How to regenerate the Circlists brand pack — the generator order, the dependencies, the vendored Inter font and the pack checks."
tags: ["product", "brand"]
timestamp: 2026-10-22T00:00:00Z
---

# Regenerating the brand pack

These scripts rebuild everything in [../assets/](../assets/README.md) and the board [../circlists-brand.html](../circlists-brand.html), to the geometry and palette [circlists-brand.md](../circlists-brand.md) specifies. Part of the [Circlists brand](../circlists-brand.md); the directory guide is [../README.md](../README.md).

Regenerate everything from a clean `assets/`:

    scripts/build_all.sh

It first deletes every generated file in `assets/` (the hand-written `.md` files there stay, and so do the hand-authored animated SVGs in `assets/motion/`), then runs, in order:

1. `build_mark.py`: draws the mark from `brand_tokens.py` into `mark/circlists-mark.svg`. There is no separate source file; the tokens are the source.
2. `wordmark-outline.py`: outlines "Circlists" from Inter, ink and reversed, into `wordmark/`.
3. `build_lockup.py`: composes the lockups from the mark and wordmark into `lockup/`.
4. `build_rasters.py`: the favicon, notification icon, installed and store icons and notification badge into `icons/`; the native app icons (Capacitor inputs, Android themed layer, iOS dark and tinted) into `native/`; and a transparent PNG of each shippable SVG at two sizes beside it.
5. `build_motion.py`: checks the three animated SVGs in [../assets/motion/](../assets/motion/circlists-motion.md) against `brand_tokens.py` and fails if one has drifted. It writes nothing: those SVGs are hand-authored against [../assets/motion/circlists-motion.md](../assets/motion/circlists-motion.md) and stay the sources.
6. `build_board.py`: bundles it all into `circlists-brand.html`, one page with six tabs (Logo, Icons, App icons, Motion, Colour, Type) and sub-tabs. Every image is inlined as a data URI or inline SVG. The Motion tab inlines the real motion files, so page and files cannot drift.

## Values

`brand_tokens.py` holds every colour, type and geometry value once, copied from the spec (the colour, type scale and link values are restated from the prototype's `tokens.css`). `build_mark.py`, `wordmark-outline.py`, `build_lockup.py`, `build_rasters.py`, `build_motion.py`, `build_board.py` and `check_pack.py` import it. Change a value there, rebuild, and run the check.

## Dependencies

- `fonttools` and `brotli`: `wordmark-outline.py` reads the woff2 and outlines the glyphs.
- `cairosvg` and `Pillow`: `build_rasters.py` (SVG to PNG, PNG to multi-size ICO).
- The rest, including `build_board.py`, `build_mark.py`, `build_lockup.py` and `build_motion.py`, is standard library only.

`build_all.sh` uses the wiki's existing venv, `harness-intent-wiki/.venv/bin/python` (override with `PY=...`). Install nothing into it.

## The font

`inter-latin-wght-normal.woff2` is **Inter**, vendored here so the wordmark builds standalone. It is a variable font, instanced to weight 700. Inter is licensed under the **SIL Open Font License 1.1**, which permits redistribution with its notice; the licence, with Inter's copyright line, is in `OFL.txt` beside the font (copied from `LICENSE.txt` in rsms/inter on GitHub, 2026-10-22). The board itself loads Inter and JetBrains Mono from Google Fonts, as the prototype's `tokens.css` does.

## Checks

`check_pack.py` (not part of the build; it writes nothing) runs these:

- **Tokens.** Every colour and type value in `brand_tokens.py` (palette, the other colour tokens, weights, sizes, line heights, tracking) against the prototype's `tokens.css`, and the link underline values against the bare `a` rule there and `.circ-doorlink` in `canon/circlists.html`. The values are the spec's. Where the two disagree the check reports it and neither is changed. It also lists, as a note, the `tokens.css` colours the spec gives no value for.
- **Files.** Every file the spec names exists, and every file in `assets/` is named by the spec. A share PNG (`<stem>-1024.png`) counts when the spec names the stem's SVG.
- **Numbers.** The spec's numbers (box, radii, stroke, badge, 72%, corner radius, safe zone, lockup ratios, tittle, tracking) against `brand_tokens.py` and the generated files, and the motion files against the tokens. Open the motion SVGs in a real browser to judge them: a headless screenshot reports working motion as dead.
- **Contrast.** The text neutrals are AA on cream and white.

Run `$PY check_pack.py [path-to-tokens.css]`; the path defaults to `prototypes/app/circlists/canon/tokens.css` beside the wiki or business-ops repo.
