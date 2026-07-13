# Circlists — homepage (this space)

The **public marketing homepage** for Circlists. Static, not yet deployed. Work in progress.

For what the *product* actually is, read **[ABOUT.md](ABOUT.md)** — durable product essence (loop, audience, pricing, emotional intent, hard "nots").

## Acceptance criteria — keep INTENT.md in sync

**[INTENT.md](INTENT.md)** is the acceptance-criteria list for this page — the behavioural spec used when the homepage is built for production. It is the *authority*: each AC is required of the shipped page, with notes for anything late-bound at deploy (e.g. sign-in/sign-up URLs) or excluded from ship (the Config launcher). This prototype (`index.html` et al.) is the design reference the ACs were derived from — not the deliverable, and not what conformance is judged against. Keep that direction straight: the page is built to the ACs, not "converted" from this mock.

**Rule:** any change to what the page *does*, or to a deploy-time contract, updates `INTENT.md` in the same change. Add a new AC-N (IDs are stable, never reused), amend the affected one, or strike it — don't let behaviour and criteria drift apart.

**INTENT.md is deliberately self-contained** — it references no other file, so it can travel to implementation on its own. The context it used to link out to lives here instead: product essence is in `ABOUT.md`, brand/motion rules in `BRANDING.md`, and the vendored hero demo in `DEMO.md` (`demo-embed.html` over `uploads/homepage-demo/`). When editing an AC, consult those here; keep the AC text itself free of cross-references.

## What's in here

- `index.html` — the live homepage (header with sign in/up, hero + live-app demo, who-it's-for, pricing, changelog).
- `INTENT.md` — **acceptance criteria** for the homepage (the behavioural handoff spec — see the rule below).
- `privacy.html` — privacy notice.
- `tokens.css` — **design tokens** (colour, type, spacing, radius, shadow). Change identity here, never by hard-coding values in component CSS.
- `site.css` — component styles for the page.
- `demo-embed.html` + `uploads/homepage-demo/` — the hero's **live-app demo** (embedded via iframe). See **[DEMO.md](DEMO.md)** before touching it — the app is vendored (never edit), only the frame is ours.
- `BRANDING.md` — brand pointer doc: what the identity is, and where it actually comes from.
- `assets/brand/` — local copy of the brand pack (assets only — see `BRANDING.md`).

## Branding — read this before touching any logo

See **[BRANDING.md](BRANDING.md)** for the full picture, including where the pack actually comes from (it isn't `assets/brand/` — that's a manually-synced local copy). Short version: **never hand-draw the mark or wordmark** — use these files as-is:

- `circlists-lockup.svg` / `-reversed.svg` — mark + wordmark. **This is what the site header uses.** Ink for light grounds, cream for dark. The footer uses the wordmark alone (see below) — the mark's already carried by the header and the favicon.
- `circlists-mark.svg` — the mark alone (three concentric circles: sage halo → white ring → green disc). **Also the favicon** — plus the raster set (`favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) for surfaces that can't take SVG.
- `circlists-wordmark.svg` / `-reversed.svg` — wordmark alone.
- `circlists-brand.md` — the written brand spec. `circlists-brand.html` — generated visual board (never hand-edit).

Palette: Emerald `#047857` · Sage `#8BBFAD` · Ink `#0A0A0A` · Cream `#FAFAF7`. Already live in `tokens.css` as `--color-accent` etc.

## Things worth knowing (non-obvious)

- **The name is "Circlists"** (formerly LatentPulse — renamed 2026-07-07). If you find old LatentPulse references, they're stragglers to update.
- The header wordmark reads larger than the footer one (it's the app title). Lockup sizing lives in `site.css` under `.wordmark__lockup`.
- The header lockup is inline SVG, not `<img>` — it's the only place the mark pulses (`css/16-motion.css`; see `BRANDING.md`'s Motion section). Every other lockup/wordmark reference on the site stays a plain static asset.
- Design direction is **Pulse Modernist**: calm is the floor, single accent, editorial posture. Don't add gradients, FOMO mechanics, or social-proof chrome — that's against the product's intent (see ABOUT.md "Deliberately NOT").
- Sign in / Sign up in the header route to `#` in the prototype; real destinations are wired at deploy (AC-1, AC-2 in `INTENT.md`). There is **no** email-capture form — it was removed 2026-07-09 (see `CHANGELOG.md`); don't reintroduce one without a real editorial need.
