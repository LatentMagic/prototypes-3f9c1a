---
type: Concept
title: "Circlists Brand — Motion"
description: "The Circlists mark in motion — three animated treatments (pulse, spinner, micro), the motion each carries, and how a surface consumes them."
tags: ["product", "brand"]
timestamp: 2026-07-11T00:00:00Z
---

# Circlists brand — motion

The Circlists mark, animated. Three treatments — **pulse**, **spinner**, **micro** — each layering its own motion on the static mark. Geometry and palette are owned by the [brand spec](../circlists-brand.md); this page owns only the motion on top of them. Never redraw the mark.

Each treatment ships as a self-contained animated `.svg` in this directory. The CSS animation and its reduced-motion fallback live inside the file, so the asset animates dropped into an `<img>`, a CSS `background`, or inlined — no host stylesheet required. The [directory guide](README.md) lists the files.

## How a surface consumes these

- **Drop-in** — reference the `.svg` directly (`<img>`, `background-image`, `<object>`). It animates as-is; nothing else needed.
- **In-app control** — inline the same `.svg` markup so the product's own CSS can drive tempo, theme, or state. The values on this page are the source of truth either way: an inline component reproduces them, it does not re-invent them.

## The pulse breath curve

The pulse breathes on a hand-sampled curve: a brisk inhale, a brief apex at 34%, then a relaxed exhale easing into a long, slow trough. Always moving; never a flat hold. It runs on `linear` timing because the sampled curve *is* the motion — an easing function would flatten the apex into a false hold. Spinner and micro carry their own motion (below), not this curve.

Each stop is a fraction of the full rise, applied as `scale(1 + (amp − 1) × fraction)`, where `amp` is the element's peak scale:

| %    | 0 | 6 | 14 | 22 | 30 | **34** | 42 | 52 | 62 | 72 | 80 | 87 | 93 | 100 |
|------|---|---|----|----|----|--------|----|----|----|----|----|----|----|-----|
| frac | 0 | .10 | .40 | .75 | .95 | **1.00** | .94 | .78 | .58 | .38 | .22 | .12 | .05 | 0 |

## Pulse — `circlists-pulse.svg`

The idle "breathing" mark. In the app the halo reacts to input, so an idle breath reads as the mark at rest but alive.

- **Motion** — the breath **plus a tone lift**: the sage halo breathes and brightens in lockstep. The disc and white ring hold still; both animations run on the halo only.
- **Tempo** — 3.0 s cycle.
- **Depth** — peak scale (`amp`) 1.075 (+7.5%).
- **Tone** — brightness rides the same curve, peaking at 1.09 at the 34% apex, so light and scale peak together.
- **Geometry** — the disc is drawn one step larger (r 15.2, ring r 15.875) so the resting sage band is thinner and the outward breath reads more. This enlargement is specific to the pulse asset; the static mark is unchanged.

## Spinner — `circlists-spinner.svg`

The loading state. The disc and white ring hold at centre; the sage halo becomes the moving part.

- **Motion** — a sage arc on r 19.05 rotates while its length grows and shrinks, so the halo never sits still.
- **Tempo** — the reference (1×) pace is a 1.917 s rotation with a 2.5 s arc-breathe; pace is expressed as a multiplier on this.
- **Pace** — the default is **1.4×** — rotation ≈ 1.37 s, arc-breathe ≈ 1.79 s, ratio held so the character survives a fast load. The drop-in `.svg` ships at this default; where a surface inlines the asset, a live speed multiplier can vary it.
- **Band** — arc `stroke-width` 5.3.
- **Arc growth** — `pathLength` 120, round caps: `stroke-dasharray` `12 108 → 78 42 → 12 108`, `stroke-dashoffset` `0 → −22 → −120`.
- **Size** — ~100 px, a sense of the footprint it occupies rather than a locked value; the surface resolves the exact size.
- **Accompanying text** — none by default. The asset's ARIA label carries the loading state for assistive tech, so the spinner alone is enough; add text only where the circumstance needs it to say something the spinner can't.

## Micro — `circlists-micro.svg`

The ~10 px "live signal" dot — the mark at status size, marking something as live. The green core holds dead still and only the sage halo carries the motion: at this size a breathing scale reads as a tiny pulse, so micro signals with a sweep of light rather than by breathing.

- **Motion** — a *ring reveal*. The core (disc + white ring) holds perfectly still; a soft vertical band of light sweeps across the sage halo, painting it into view as a ring of sage around the core, then rests off-frame so the sage is gone until the next pass. The reveal itself is the signal — nothing scales, so nothing reads as the pulse.
- **Band** — a sage gradient (`#8BBFAD`, opacity `0 → 1 → 0`) on a rect 26 × 68 (viewBox units), clipped to the halo and drawn below the core, so sage shows only in the halo band around the core; feathered edges soften the reveal.
- **Sweep** — the band travels `translateX 0 → 86` (viewBox units) over the first **64%** of the cycle, then holds off-frame for the rest.
- **Tempo** — 3.8 s cycle, `cubic-bezier(0.45, 0, 0.15, 1)`.
- **Size** — ~10 px. This is the size-defined treatment: the reveal exists *because* a scale-breath won't read this small. Pulse and spinner scale to context; micro is built for this footprint.
- **Geometry** — true mark geometry (disc r 14.25), viewBox `-2 -2 52 52`.

## Reduced motion

Every asset carries its own `@media (prefers-reduced-motion: reduce)` rule and freezes to the **static mark** with no host CSS required. Pulse and micro settle to the full resting mark; the spinner replaces its rotating arc with a full static halo.
