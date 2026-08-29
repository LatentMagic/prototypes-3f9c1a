---
type: Map
title: "Circlists Brand — Motion Directory Guide"
description: "Entry point to the Circlists motion directory — the animated mark treatments, the spec that defines them, and the visual board."
tags: ["product", "brand"]
timestamp: 2026-07-11T00:00:00Z
---

# Circlists brand — motion directory guide

The Circlists mark in motion — a sibling to the static [brand pack](../README.md). What's here and how it fits.

- **[circlists-motion.md](circlists-motion.md)** — the motion spec: the motion each treatment carries. Source of truth for the values.
- **[circlists-motion.html](circlists-motion.html)** — the visual board. Open it in a browser to watch all three animate, on light and dark.
- **The animated assets** — self-contained `.svg` files, each with its motion and reduced-motion fallback baked in:
  - `circlists-pulse.svg` — the idle breathing mark.
  - `circlists-spinner.svg` — the loading state.
  - `circlists-micro.svg` — the ~10 px live-signal dot.

Geometry comes from the static [brand spec](../circlists-brand.md); this directory only adds motion. The `.svg` files are authored by hand against [circlists-motion.md](circlists-motion.md) — keep them in sync with it.

## Validating the motion

Validate these by eye in a **real browser** — open a `.svg` directly, or open [circlists-motion.html](circlists-motion.html).

Do **not** trust a headless or scripted screenshot to confirm the motion. Virtual-clock capture tools routinely grab only the resting frame and report a working asset as "not animating." Treat any automated "the motion is dead" verdict as inconclusive until you've seen it in a browser — this has misled more than one build here, and the animation was fine each time.
