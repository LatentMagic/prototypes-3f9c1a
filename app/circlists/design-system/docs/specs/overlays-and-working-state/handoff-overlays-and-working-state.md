# Handoff: three kinds of overlay, and a button that shows it is working

Date: 2026-10-08. Read live: monorepo `main` `specs/governance/standards/ui-design.md`, `specs/projects/circlists/ui.md` (copied in, read, deleted).

## What already held

- `ui.md` already sorts Circlists' overlays by the three-kind rule (the "sheet" correction decision at the end of the log, and § Patterns → Responsive). Nothing upstream needed to change.
- No file here said every overlay becomes a sheet. The README said "Overlays adapt to width … Confirm dialogs never become sheets", which was incomplete rather than wrong.
- Button already had a working state (`loading`) lifted from the prototype: a ring replaces the icon and the button cannot be pressed again. It matched the rule except in how it blocked presses (see below).
- The Delete dialog card (dialog) and Card menu card (menu) were already the right shape at every width.

## What changed, and where

1. **Overlay guidance**: `README.md` § Visual foundations now states the three kinds and lists every overlay with its kind and its shape at phone and desktop width. `SKILL.md` step 3 names the kinds.
2. **Dialog, Menu, Panel**: new compiled component `components/overlay/` (`Overlay.jsx`, `.d.ts`, preview `overlay.html`). Exports `Dialog`, `Menu`, `MenuItem`, `MenuSeparator`, `Panel`, and `Overlay` with `kind` as its input. Only `Panel` changes shape. Motion in `components/components.css` (`.circ-ov-*`). The two pattern cards now name their kind in their subtitle.
3. **Button working state**: `components/button/Button.jsx` / `.d.ts`. `loading` now uses `aria-busy` + `aria-disabled` and swallows clicks and form submits, instead of the native `disabled` attribute. Hover and press styles are suppressed while working. The preview has a live row: press, then press again while it works; the count shows the second press was not taken.
4. **Standard summary**: `README.md` § Governance rewritten against the live file.

## Overlay inventory

| Surface | Kind | Phone | Desktop |
| --- | --- | --- | --- |
| Confirmation dialog (Delete, Remove member, Leave circle, Cancel subscription, Switch plan, Delete account) | Dialog | centred | centred |
| Challenge dialog | Dialog | centred | centred |
| Form dialog (Edit circle) | Dialog | centred | centred |
| Card menu, members row menu | Menu | at ⋮ | at ⋮ |
| Add reveal | Panel | sheet below 640 | anchored popover |
| The Swell | Panel | sheet below 1024 | centred modal |
| Who reacted | Panel | sheet below 520 | anchored popover |
| View options | Panel by definition | anchored box | anchored box (deployed; ui.md leaves it open) |
| Circle switcher | none (navigation) | menu trigger | rail from 1024 |

Cards here: Delete dialog (pattern), Card menu (pattern), Overlay component preview (all three kinds at phone and desktop, Panel shown as Who reacted).

## Choices on the open items

- **How each kind is drawn.** Dialog: surface, 12 radius, overlay shadow, scrim, 24 padding, title at 24/600, foot actions right-aligned (stack them for Delete, per ui.md). Menu: the existing card-menu box (border, raised shadow, 44px rows), no scrim. Panel: sheet with top corners rounded and safe-area padding; desktop anchored box (border, overlay shadow, no scrim) or centred modal (scrim). All from existing tokens; no new values. Why: these are the shapes the prototype and the pattern cards already use, so nothing visual moves.
- **Swap width.** A `breakpoint` prop per panel, default 640, taking ui.md's table: Add 640, Who reacted 520, The Swell 1024. Why: ui.md sets a width per surface, so a single system width would contradict it.
- **Working state.** A small ring before the label, label kept, focus kept, `aria-busy`, presses swallowed. Shown at once on press, with no withhold. Why: ui.md's In-button loading names the state and bars the brand spinner from buttons; the ring is the prototype's own. Keeping focus (rather than `disabled`) follows ui-design.md's focus restoration: a disabled button drops focus to the page. Showing at once follows the working rule ("from the press") and ui-design.md's receipt clause.

## Differences: old README governance summary vs live ui-design.md

The old summary listed 12 rules and omitted these, now added: domain-aligned placement; design and check every width; wide screens used, not stranded; copy is part of the layout; touch and mouse spaced differently; most important first at every width; a heading can shrink but stays the biggest; reading directions; smallest change first; responsive by default, adaptive by exception; only a panel changes shape on a phone; consistent affordances; descriptive action labels; visibility of system status; the receipt clause of non-flicker loading; designed empty states; undo as the emergency exit; protect unsaved work; errors in place; touch-target floor; no mismatched shapes; no stranded width; say it once; no implied connection. "Deferred inline validation" is now "deferred validation" as the file words it. Nothing in the old summary contradicted the live file.

## Unresolved, for upstream

- **Get a link vs the working rule.** ui.md Decision-53 shows the invite card's wait in the link box, not in the pressed button. The working rule says the pressed control shows it. Spec wins here; the README states it as the one departure. Upstream should say whether the rule allows it.
- **View options** is a panel by definition but deployed as an anchored box at every width. ui.md leaves it undecided; nothing built here for it.
- **Edit circle Form dialog** carries a capped writing field. If it outgrows the space above the keyboard it must become a page or panel. Not checked against the deployed app.
- **Reduced motion** stops the in-button ring (the global reduced-motion rule in `tokens.css` zeroes animation). The state is still shown by the static ring and `aria-busy`. Upstream may want a reduced-motion treatment for it.
- Not built: the keyboard-aware placement of ui.md's "above the keyboard" decision (a sheet rests on the keyboard; a tap on the scrim while typing only dismisses the keyboard). The components close on scrim press.

## What a prototype changes to use this

- Replace hand-built confirm dialogs with `Dialog` (or `Overlay kind="dialog"`). Never render a confirmation as a sheet.
- Replace hand-built ⋮ menus with `Menu` + `MenuItem`, placed beside the trigger inside a `position: relative` wrapper.
- Replace adaptive sheet/popover code with `Panel`, passing the surface's `breakpoint` and `desktop="anchored"|"centred"` from ui.md's table.
- On every state-changing submit, set Button's `loading` from the press until the result. Drop any extra guard against double-press, and any spinner placed beside a button.
