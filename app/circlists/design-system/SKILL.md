---
name: Circlists Design System
description: |
  Use when designing or building any Circlists surface (the shared list app for small
  circles, from LatentMagic): screens, flows, components, mocks, marketing. Encodes the
  Pulse Modernist direction: warm paper neutrals, one emerald accent, Inter + JetBrains
  Mono, attribution at title weight, no toasts, no status fills, emoji only as reaction glyphs.
---

# How to use

1. Read `README.md` first, then the `guide/` file for what you're building. `CLAUDE.md` has the order of truth; the monorepo `ui.md` and `ui-design.md` outrank everything here.
2. Link `tokens.css`. Use the variables; never hard-code hex.
3. Use the compiled components from `window.LatentPulseDesignSystemV010_019dca`: Button, Field, Icon, Avatar, LogoMark, and the overlays Dialog, Menu, Panel (or `Overlay kind=…`). Pick the overlay kind by its job: only a Panel becomes a sheet on a phone. Every state-changing press sets Button's `loading` until the result.
4. For anything else, copy markup from the `cards/pattern-*.html` reference cards, or read the prototype's `app/` source.
5. Brand assets live in `assets/brand/` (`mark/`, `wordmark/`, `lockup/`, `icons/`, `motion/`, `native/`), exactly as the brand pack ships them. There is one mark and one wordmark, with no variants.
6. Write copy against the wiki's `circlists-copy-voice.md`: circle (never space), list, Mark as done, Active / History.
