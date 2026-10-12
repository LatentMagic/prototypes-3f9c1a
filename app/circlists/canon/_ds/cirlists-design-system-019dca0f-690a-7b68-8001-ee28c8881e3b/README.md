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

- **Button** (+ **Ring**, the in-button ring; `Spinner` is a deprecated alias): primary, secondary, tertiary, destructive, destructive-secondary, ghost; sizes sm 36 / md 44 / lg 52; working state (`loading`).
- **Overlay**: **Dialog**, **Menu** (+ **MenuItem**, **MenuSeparator**), **Panel**, and `Overlay kind="dialog"|"menu"|"panel"`. Only Panel changes shape on a phone.
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
- Loading has two indicators, each with its own job (ui.md Decision-13, Decision-53). The **brand spinner**, at three sizes, is the standalone one: centred in the element that is waiting, no copy (a feed loading, a page settling, app boot). The **in-button ring** is a small plain ring before a button's label, from the press until the action comes back. The brand spinner never sits inside a button; the ring is what a button shows. There are no skeleton cards (the pending feed card's in-place shimmer is the exception).
- Every action that changes state shows it is working. From the press until the result, the pressed control (usually the submit button) holds its working state: the ring before its label, focus kept, further presses ignored. Set Button's `loading`. Every button that waits on the server uses it: sign-in, sign-up, Add, Cancel, Switch plan, Resume, Keep plan. The invite card's **Get a link** is the one departure: the button only disables, and the wait shows in the link box as the brand spinner at the small size the box allows, not the ring.
- Touch targets: 44px for primary controls, 24px for dense secondary displays. Inline links are exempt.
- Overlays come in three kinds (ui-design.md). Ask in order; the first that fits is the kind. Only a panel changes shape on a phone.
  - **Dialog**: one question or one short edit, nothing behind it usable until answered or dismissed. Centred at every width; content fixed, never scrolls. One that outgrows the space above the keyboard becomes a page or a panel.
  - **Menu**: a short list of commands at its control; choosing one runs it and closes the menu. Opens at its control at every width. A list long enough to scroll is a panel.
  - **Panel**: anything else the user stays in and works with. A bottom sheet below its breakpoint; anchored or centred above it.
  - Tooltips and status lines take no focus, are none of these, and do not swap.
- Overlay inventory (kind · phone · desktop): Confirmation dialog incl. Delete, Remove member, Leave circle, Cancel subscription, Switch plan, Delete account · dialog · centred · centred. Challenge dialog · dialog · centred · centred. Form dialog (Edit circle) · dialog · centred · centred. Card menu and members row menu · menu · at ⋮ · at ⋮. Add reveal · panel · sheet below 640 · anchored popover. The Swell · panel · sheet below 1024 · centred modal. Who reacted · panel · sheet below 520 · anchored popover. View options · panel by definition, deployed as an anchored box at every width (ui.md leaves it open). The circle switcher is navigation, not an overlay: menu trigger below 1024, rail above.
- Motion is quiet (`--ease-quiet`, 100–200ms). `prefers-reduced-motion` is honoured everywhere.

## Governance (ui-design.md: binding)

Summary of the live file, by its sections. Read it live before relying on a line.

- **Information architecture**: domain-aligned placement; the navigation frame owns no context.
- **Layout across widths**: design and check every shipped width, phone first. Space: wide screens used, not stranded; copy is part of the layout; touch and mouse spaced differently. Reading order: most important first at every width; a heading can shrink but stays the biggest. Reading directions: what sits under or beside a thing reads as belonging to it. When two rules clash, change size, then spacing, then layout, and reword last.
- **Responsive and adaptive**: responsive by default, adaptive by exception (each swap listed in ui.md with its width). Only a panel changes shape on a phone: dialog, menu, panel (above). No overhanging line.
- **Affordances and labels**: consistent affordances · pointer cursor · descriptive action labels · destructive actions signal themselves, weight in proportion · prefer a statement to a disabled control.
- **System feedback and time**: visibility of system status · non-flicker loading (withhold briefly, hold once shown; a receipt shows at once) · designed empty states.
- **Reversibility**: ration confirmation, naming the consequence · undo as the emergency exit · protect unsaved work.
- **Input and forms**: 16px text-input floor · deferred validation · errors in place.
- **Focus and reach**: focus restoration · a refused submit moves focus to the first invalid field · touch-target floor (Circlists: 44 primary, 24 dense).
- **Taste, pictured**: no mismatched shapes · no stranded width · consistent width · say it once · fill by arranging, not stretching · no implied connection.

Shared prototype rule (not in ui-design.md): every action that changes state shows it is working (above).

## Future

This system is meant to move **upstream** and become what the prototype and the codebase consume. Until its components cover `ui.md`'s Component vocabulary, it stays a mirror.
