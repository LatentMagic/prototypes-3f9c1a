# Upstream repos

This design system mirrors the following, in this order of truth (see CLAUDE.md).

## monorepo — specs and governance

repo: LatentMagic/monorepo
branch: main
path: specs/projects/circlists/

`ui.md` (tokens, component vocabulary, patterns; ~575KB: copy in, read, delete in the same turn), `prd.md`, `hld.md`, `glossary.md`, `requirements/`. Governance: `specs/governance/standards/ui-design.md`.

## prototype — Claude Design project 3f1df829-2c1f-4d73-ba41-17bf783de9b7

Published at LatentMagic/prototypes-3f9c1a → `app/circlists/canon/`. Mirrored from it: `tokens.css` values, `brand/assets`, `brand/motion`, `app/primitives.jsx` (Button, Field, Icon, Avatar, LogoMark). Never edited from here.

## wiki — brand and voice

repo: LatentMagic/wiki
branch: main
path: wiki/products/circlists/

## Last sync

date: 2026-10-22T06:15:20Z
prototype: read live @ e8ec4a56d399 — `canon/tokens.css`, `circlists.html` link rules, `canon/_ds/` listing. Brand pack: `circlists-brand-pack-2026-10-22` (attached).

### Updated in this project
- `assets/brand/` replaced with the 2026-10-22 pack, in its own subfolders.
- Colour, type scale and both link forms brought up to the brand spec.
- Audit and handoff in `docs/specs/brand-pack-audit/`.

## Sync history

date: 2026-10-08T07:41:45Z
monorepo: read live — `ui-design.md`, `ui.md` (overlay and loading sections).

### Updated in this project
- Overlay component added: Dialog, Menu, Panel; only Panel becomes a sheet on a phone.
- Button working state keeps focus and refuses repeat presses.
- README overlay guidance and governance summary corrected against the live standard.

date: 2026-10-05T04:51:32Z
monorepo: read live — `ui.md` (full), `prd.md`, `ui-design.md`. wiki: `circlists-copy-voice.md`. Prototype: `tokens.css`, `brand/`, `app/primitives.jsx`, `feed.jsx`, `shell.jsx`, `CHANGELOG.md`.

### Updated in this project
- Renamed to Circlists. Brand pack and motion mirrored; LatentPulse placeholders, v1 kit and copied specs removed.
- `tokens.css` mirrors the prototype, with ui.md thought-paper values, breakpoints and dense touch target added.
- Five compiled components and 30 cards rebuilt from the prototype.

## Screen map

| Here | Built from |
| --- | --- |
| `tokens.css` | prototype `tokens.css`; monorepo `ui.md` § Design tokens |
| `components/*` | prototype `app/primitives.jsx` |
| `components/overlay/` | monorepo `ui-design.md` § Responsive and adaptive design; `ui.md` § Component vocabulary, Patterns → Responsive; prototype card-menu and Delete dialog markup |
| `cards/pattern-*` | prototype `app/feed.jsx`, `shell.jsx`, `invite-link.jsx`, `circlists.html` styles; `ui.md` § Component vocabulary |
| `assets/brand/` | brand pack `circlists-brand-pack-2026-10-22` `assets/` (wiki `wiki/products/circlists/brand/`) |
| `cards/colors-*`, `cards/type-*`, `cards/pattern-inline-link.html` | brand pack `circlists-brand.md` §1, §5; prototype `tokens.css`, `circlists.html` `.circ-doorlink` |
