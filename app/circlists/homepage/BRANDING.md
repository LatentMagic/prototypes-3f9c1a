# Circlists — branding

Pointer doc: what the identity is, where the local assets live, and where they *really* come from.

## What this is

Circlists' visual identity — palette, mark, wordmark, lockup — as used on this homepage. Full spec (values) is [assets/brand/circlists-brand.md](assets/brand/circlists-brand.md); the visual board is [assets/brand/circlists-brand.html](assets/brand/circlists-brand.html).

Quick reference:

- **Palette** — Emerald `#047857` · Sage `#8BBFAD` · Ink `#0A0A0A` · Cream `#FAFAF7`. Already wired into `tokens.css`.
- **Mark** — three concentric circles (sage halo → white ring → green disc). Also the favicon, as-is.
- **Wordmark** — "Circlists", Inter Bold, one word, green tittle on the second `i`.
- **Lockup** (mark + wordmark) — what the site header renders. The footer renders the **wordmark alone**; the mark's already carried by the header and the favicon, so repeating it in the footer added nothing.
- **Motion** — the mark animated: pulse in the header, a shared ~11px live-dot (demo hint + changelog "live" indicator), and a spinner for loading states. Wired in as inline SVG + `css/16-motion.css` (animation doesn't run on img-referenced SVGs). Reference assets + spec: [assets/brand/motion/](assets/brand/motion/README.md). The header pulse uses the mark's true geometry, not `circlists-pulse.svg`'s thinner-halo deviation — no size regression from the static mark.

## Local assets

`assets/brand/` holds a **manually-synced local copy** of the pack: the SVGs (mark, wordmark ×2, lockup ×2), the raster/icon set (`favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`), plus the spec and the generated visual board. `assets/brand/motion/` adds the animated treatments on top (pulse, spinner, micro) — each a self-contained SVG, plus its own motion spec and visual board.

## Source of truth

The canonical brand pack — including the deterministic generator scripts (wordmark outline, lockup composition, raster export, board bundling) and the vendored font — lives upstream in the wiki:

**https://github.com/LatentMagic/wiki/tree/main/wiki/products/circlists/brand**

That repo isn't reachable from this project. Treat it as the record of truth: assets here are copied over by hand whenever the upstream pack changes, not pulled automatically. If something in `assets/brand/` looks off or stale, that's a manual-sync gap to fix by re-copying from the source — not a reason to hand-edit or redraw anything locally.

## Rules

- Never hand-draw the mark or wordmark — use the SVGs as shipped.
- One asset per context: `circlists-lockup.svg` (light grounds) / `circlists-lockup-reversed.svg` (dark grounds) for the header; `circlists-wordmark.svg` for the footer; `circlists-mark.svg` for the favicon.
- Don't hand-edit `circlists-brand.html` — it's generated.

---

*See also [ABOUT.md](ABOUT.md) for the product itself, [CLAUDE.md](CLAUDE.md) for how this space is organized.*
