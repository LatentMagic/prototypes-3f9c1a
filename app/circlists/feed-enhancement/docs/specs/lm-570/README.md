# lm-570 — Create → Fund wizard

The two-step **Create circle → Fund circle** flow: the mobile-fit audit, the wizard binding, and
the desktop container decision.

Integrated in `app/wizard.jsx` (shell), `app/spaces.jsx` (`CreateSpace`, step 1) and
`app/subscriptions.jsx` (`FundingPage`, step 2 + re-fund). This directory is the reasoning behind
it.

## Handoffs

- [`handoff-2026-07-27_create-fund-wizard.md`](handoff-2026-07-27_create-fund-wizard.md) — the
  running handoff. Locked decisions, the desktop resolution, and what is still open. **Integrated.**
  Read the "Desktop resolved + wizard shell integrated" section first; the sections above it are
  earlier context and one rule in "What's LOCKED" is marked superseded by it.

## Mocks

- `create-fund-desktop-container-options.html` — four full-page desktop containers with the
  modal-read diagnosis. **Option A (bare page) chosen.**

Earlier exploration mocks live in `docs/archive/option-studies/`; the handoff lists them newest
first. `create-fund-mobile-agreed.html` there is the agreed reference design.

## The one-line rule

Wizard steps are top-aligned in a shared 300px column; leftover space collects at the bottom.
