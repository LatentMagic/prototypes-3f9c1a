# Circlists Design System

Circlists is a shared list of articles, videos and podcasts for a small circle (2–10 people). Someone drops a link and everyone sees it; each person consumes it at their own pace. Built by LatentMagic.

This system collects the Circlists tokens, brand and components so humans and agents can build on-brand Circlists surfaces. It mirrors the specs and the prototype; `CLAUDE.md` has the working rules and the order of truth. Binding UI law is the live `specs/governance/standards/ui-design.md` in `LatentMagic/monorepo`.

## Guides

- [`guide/foundations.md`](guide/foundations.md): colour, type, links, space, shape, depth, motion.
- [`guide/behaviour.md`](guide/behaviour.md): status, loading, the working state, touch.
- [`guide/overlays.md`](guide/overlays.md): dialog, menu or panel, and which changes on a phone.
- [`guide/content.md`](guide/content.md): copy rules.

## Components

Compiled into `_ds_bundle.js` (namespace `LatentPulseDesignSystemV010_019dca`):

- **Button** (+ **Ring**; `Spinner` is a deprecated alias): primary, secondary, tertiary, destructive, destructive-secondary, ghost; sizes sm 36 / md 44 / lg 52; working state (`loading`).
- **Overlay**: **Dialog**, **Menu** (+ **MenuItem**, **MenuSeparator**), **Panel**.
- **Field**: label, hint, inline error, mono variant; input text always 16px.
- **Icon** (+ **ICONS**): monoline set, 24px viewBox, 1.5 stroke, currentColor.
- **Avatar**: initials disc; accent fill for the current user.
- **LogoMark**: the Circlists mark.

The `cards/pattern-*.html` cards are static references for the rest: feed card, tabs, Delete dialog, empty state, links, New pill and waterline, switch, checklist row and chip, copy control, card menu, Add button.

## Index

```
find.html        search every card, component, token and guide (start here outside Claude Design)
CLAUDE.md        working rules, order of truth
tokens.css       every token
guide/           how to use the tokens and components
components/      compiled components (.jsx + .d.ts + preview card)
cards/           design-system tab cards
assets/brand/    the brand pack's assets: mark/ wordmark/ lockup/ icons/ motion/ native/
docs/specs/      audits and handoffs, one folder per piece of work
skills/          agent skills
playgrounds.html playground list (playgrounds.json)
github.md        upstream repos and last sync
```
