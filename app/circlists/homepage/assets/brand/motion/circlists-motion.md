---
type: Concept
title: "Circlists Brand — Motion"
description: "The Circlists mark in motion — one shared breath curve and three animated treatments (pulse, spinner, micro), with the exact motion each carries and how a surface consumes them."
tags: ["product", "brand"]
timestamp: 2026-07-11T00:00:00Z
---

# Circlists brand — motion

The Circlists mark, animated. Three treatments — **pulse**, **spinner**, **micro** — layered on the static mark and sharing one breath. Geometry and palette are owned by the [brand spec](../circlists-brand.md); this page owns only the motion on top of them. Never redraw the mark.

Each treatment ships as a self-contained animated `.svg` in this directory. The CSS animation and its reduced-motion fallback live inside the file, so the asset animates dropped into an `<img>`, a CSS `background`, or inlined — no host stylesheet required. The [directory guide](README.md) lists the files.

## How a surface consumes these

- **Drop-in** — reference the `.svg` directly (`<img>`, `background-image`, `<object>`). It animates as-is; nothing else needed.
- **In-app control** — inline the same `.svg` markup so the product's own CSS can drive tempo, theme, or state. The values on this page are the source of truth either way: an inline component reproduces them, it does not re-invent them.

## The breath curve

One curve, shared by pulse and micro: a brisk inhale, a brief apex at 34%, then a relaxed exhale easing into a long, slow trough. Always moving; never a flat hold. It runs on `linear` timing because the sampled curve *is* the motion — an easing function would flatten the apex into a false hold.

Each stop is a fraction of the full rise, applied as `scale(1 + (amp − 1) × fraction)`, where `amp` is the element's peak scale:

| %    | 0 | 6 | 14 | 22 | 30 | **34** | 42 | 52 | 62 | 72 | 80 | 87 | 93 | 100 |
|------|---|---|----|----|----|--------|----|----|----|----|----|----|----|-----|
| frac | 0 | .10 | .40 | .75 | .95 | **1.00** | .94 | .78 | .58 | .38 | .22 | .12 | .05 | 0 |

## Pulse — `circlists-pulse.svg`

The idle "breathing" mark. In the app the halo reacts to input, so an idle breath reads as the mark at rest but alive.

- **Motion** — the breath **plus a tone lift**: the sage halo breathes and brightens in lockstep. The disc and white ring hold still; both animations run on the halo only.
- **Tempo** — 3.0 s cycle.
- **Depth** — peak scale (`amp`) 1.065 (+6.5%).
- **Tone** — brightness rides the same curve, peaking at 1.09 at the 34% apex, so light and scale peak together.
- **Geometry** — the disc is drawn one step larger (r 15.2, ring r 15.875) so the resting sage band is thinner and the outward breath reads more. This enlargement is specific to the pulse asset; the static mark is unchanged.

## Spinner — `circlists-spinner.svg`

The loading state. The disc and white ring hold at centre; the sage halo becomes the moving part.

- **Motion** — a sage arc on r 19.05 rotates while its length grows and shrinks, so the halo never sits still.
- **Tempo** — the arc rotates every 1.917 s; its length breathes every 2.5 s.
- **Band** — arc `stroke-width` 5.3.
- **Arc growth** — `pathLength` 120, round caps: `stroke-dasharray` `12 108 → 78 42 → 12 108`, `stroke-dashoffset` `0 → −22 → −120`.

## Micro — `circlists-micro.svg`

The ~10 px "live signal" dot. Too small for a scale-breath to read unless the percentage is pushed up, so the same breath runs at a larger amplitude — the absolute movement stays tiny, so it still feels gentle.

- **Motion** — the full breath, motion only (no tone). Halo and core both breathe outward, but the core grows less than the halo, so the sage band opens at the peak and the ring pulses. The core never dips below its resting size.
- **Tempo** — 1.4 s cycle.
- **Depth** — halo `amp` 1.105, core `amp` 1.070.
- **Geometry** — true mark geometry (disc r 14.25). The viewBox is padded so the expanding halo never clips.

## Reduced motion

Every asset carries its own `@media (prefers-reduced-motion: reduce)` rule and freezes to the **static mark** with no host CSS required. Pulse and micro settle to the full resting mark; the spinner replaces its rotating arc with a full static halo.
