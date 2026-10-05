# Circlists Design System

Circlists is a shared list of articles, videos and podcasts for a small circle (2–10 people). Someone drops a link and everyone sees it. Each person consumes it at their own pace, and only their own list changes. The library is shared and the reading is individual. Built by LatentMagic.

This project is a **downstream mirror**. It collects the Circlists tokens, brand and components in one place, so humans and agents can produce on-brand Circlists surfaces. It does not decide anything. Working rules, including the order of truth, are in `CLAUDE.md`.

> Project namespace is still `LatentPulseDesignSystemV010_019dca` (fixed by the project title). The product is **Circlists**; LatentPulse is retired.

## Sources (read live, never copied in)

1. **Monorepo** `LatentMagic/monorepo`: `specs/projects/circlists/ui.md` (design language, tokens, component vocabulary, patterns), `prd.md`, `hld.md`, `glossary.md`; `specs/governance/standards/ui-design.md` (binding cross-app UI law). These track the deployed app, and they win any conflict.
2. **Prototype**: Claude Design project `3f1df829-…` (`circlists.html`, `tokens.css`, `app/`, `brand/`), published as `LatentMagic/prototypes-3f9c1a` → `app/circlists/canon/`. It is the source for exact build values and component code.
3. **Wiki** `LatentMagic/wiki` → `wiki/products/circlists/`: brand pack, `circlists-copy-voice.md`.

Repo details: `github.md`. Open conflicts and gaps: `audit/`.

## Index

```
CLAUDE.md            working rules: order of truth, conflicts, decisions
tokens.css           every token (mirrors prototype tokens.css + ui.md fixes)
components/          compiled components (.jsx + .d.ts + preview card)
  components.css     pseudo-states the components need (hover, press, spin)
cards/               design-system tab cards: brand, colour, type, spacing, patterns
assets/brand/        mark, wordmark, lockup, favicons, app icons, push badge
assets/brand/motion/ pulse / spinner / micro SVGs + circlists-motion.md
audit/               dated audits; conflicts logged for upstream
thumbnail.html       project tile
```

## Components

Compiled into `_ds_bundle.js`, lifted from the prototype's `app/primitives.jsx`:

- **Button** (+ **Spinner**): primary, secondary, tertiary, destructive, destructive-secondary, ghost; sizes sm 36 / md 44 / lg 52; loading state.
- **Field**: label, hint, inline error, mono variant; input text always 16px.
- **Icon** (+ **ICONS**): the app's monoline set (24px viewBox, 1.5 stroke, currentColor).
- **Avatar**: initials disc; accent fill for the current user.
- **LogoMark**: the Circlists mark.

The **Patterns** cards (`cards/pattern-*.html`) are static references built from the prototype's markup: feed card, tabs, Delete dialog, empty state, inline link, New pill and waterline, switch, checklist row and chip, copy control, card menu, Add button. Coverage of `ui.md`'s Component vocabulary is tracked in the audit.

## Content rules (summary; wiki copy voice is canonical)

- Calm, direct, present tense, verb-led. Evergreen copy: no first-visit framing.
- Use **circle**, never "space". **List** over "queue". Never "keep up" or "catch up".
- Be format-neutral: articles, videos, podcasts. Prefer naming the content over saying "link".
- Progress wording: the control reads **Mark as done**. Cards are **waiting** (Active) or **finished**. Tabs are **Active** and **History**. "Read" is only for what a member literally reads.
- Sentence case. No exclamation marks. No "please", "sorry" or "we".
- No emoji in UI copy. The five **reaction glyphs** (heart, fire, thumbs up, lightbulb, laughing) are the one sanctioned exception, and only on reaction surfaces.

## Visual foundations

- **One accent**: emerald `#047857`. Used for primary actions, the active tab, focus rings, selection, The Swell's live controls, and brand moments. Never status, never decoration.
- **Danger** `#991B1B` is only for destructive confirms and the triggers that open them. Weight is proportionate to the consequence: the Delete reaches are recessive (destructive-secondary).
- **Sage** `#8BBFAD` is the mark's halo and the arrival wash. **New words** `#5E9C86` marks unseen comments. **Thought paper** has its own warm sheet.
- Hierarchy comes from size and weight, never colour. **Attribution sits at title weight.**
- 4px grid. Radii 4 / 8 / 12, with pill for markers only. Shadows: flat by default, raised for popovers, overlay for dialogs and sheets.
- Status is shown with an icon and a label on neutral ground, never a coloured fill. No toasts.
- Loading has one indicator, the brand spinner, at three sizes. It never sits inside a button, and there are no skeleton cards (the pending feed card's in-place shimmer is the exception).
- Touch targets: 44px for primary controls, 24px for dense secondary displays. Inline links are exempt.
- Overlays adapt to width. Breakpoints: who-reacted 520, Add 640, rail and Swell 1024. Confirm dialogs never become sheets.
- Motion is quiet (`--ease-quiet`, 100–200ms). `prefers-reduced-motion` is honoured everywhere.

## Governance (ui-design.md: binding)

Pointer cursor on anything interactive · 16px floor for text inputs · prefer a statement to a disabled control · destructive actions signal themselves · ration confirmation · deferred inline validation · focus restoration · a refused submit moves focus · non-flicker loading · no overhanging line · consistent width · fill by arranging, not stretching.

## Future

This system is meant to move **upstream** and become what the prototype and the codebase consume. Until its components cover `ui.md`'s Component vocabulary, it stays a mirror.
