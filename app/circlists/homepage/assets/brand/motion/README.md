---
type: Map
title: "Circlists Brand — Motion Directory Guide"
description: "Entry point to the Circlists motion directory — the animated mark treatments, the spec that defines them, and the visual board."
tags: ["product", "brand"]
timestamp: 2026-07-11T00:00:00Z
---

# Circlists brand — motion directory guide

The Circlists mark in motion — a sibling to the static [brand pack](../../BRANDING.md). What's here and how it fits.

- **[circlists-motion.md](circlists-motion.md)** — the motion spec: the shared breath curve and the exact motion each treatment carries. Source of truth for the values.
- **[circlists-motion.html](circlists-motion.html)** — the visual board. Open it in a browser to watch all three animate, on light and dark.
- **The animated assets** — self-contained `.svg` files, each with its motion and reduced-motion fallback baked in:
  - `circlists-pulse.svg` — the idle breathing mark.
  - `circlists-spinner.svg` — the loading state.
  - `circlists-micro.svg` — the ~10 px live-signal dot.

Geometry comes from the static [brand spec](../circlists-brand.md); this directory only adds motion. The `.svg` files are authored by hand against [circlists-motion.md](circlists-motion.md) — keep them in sync with it.
