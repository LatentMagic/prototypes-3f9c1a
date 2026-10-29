---
date: '2026-10-29'
ticket: '1236'
topic: 'delve-into-app'
status: 'in-progress'
type: 'build'
---

# Handoff: Delve's session page into the main build (v9 3B), and the now card next

## Where
- Session page: Library → Delve → See every roll. States `session-delve`, `session-delve-fallen`, `session-delve-hard`, `session-delve-in-progress`. QA entry `delve-1236`.
- No Config rows: both open choices are settled (below).

## What landed (owner, 2026-10-29: "integrate this")
- `app/gs-delve.jsx` (new, after `gs-word.jsx`): model, die, 3 · Band result, route, held roll (no two-dice row), 3B sheet, body, quiet head (h1 = edition title, else the setting), sample plays `delve-fallen` and `delve-hard`. Names use a `Dl`/`DL_` prefix so the playgrounds, which load the app whole, never redeclare them.
- `app/gs-delve.css` (new, linked in `index.html`): the playgrounds' v3–v9 styles in cascade order, the bar's rules dropped. Not pruned: dead concept rules are still in it. The older playgrounds now also load it (their own styles follow, so they look as before, except v8 picks up v9's name wrap and clue bars).
- `app/gs-data.jsx`: Delve's records carry setting, end, hero, hpMax, threat, threatMax, sheet. `gs-history.jsx`: run r0's threat 2. `gs-session.jsx`: the old tracks-and-endings layout only shows when no body is registered.
- In canon the sheet shows only what the record holds: no torch, clues or bargain (invented for the playgrounds). The streak is the current run of strong hits, counted from the rolls.

## Decisions (owner, 2026-10-29, in words)
- Meter counts are written 9/13 ("yes, I meant 9/13").
- The now card's route is the session page's phone form a step smaller: 26px dice, 34px key moments, a 36px slot per die, room numbers, no names. Clickable; ringed on hover or focus, a two-dice die hiding its back hex as on the session page. Owner: "I couldn't be happier."
- Phone sheet: pack and abilities share a row split by a line (the v9 default the owner signed off; he didn't ask for the alternative).
- Clues: at most two; drawn as short bars (16px, 20px on a phone).
- Phone hero: the whole row is the fold control, chevron centred, name and class on one line beside it.
- Long hero names wrap (balanced; centred on desktop, left on a phone).
- Now card: no new design decision. The frame stays (label, title top left, result chip top right); bring over something from the session page that shows the run's state, as Escape and Word did. Not the character sheet.

## Now card (built, same session)
- `DlNow` in `app/gs-delve.jsx`; `DvNow` (`gs-delve-library.jsx`) hands over to it. Frame as Escape's: THIS WEEK, title, the ending word top right (Escape's `es-vd`: green when won, amber otherwise; In progress is the store's), the route at card size in its own dv2 container, foot unchanged. A die opens the session page with that roll held (`route.roll`).
- A free player's first-run card (`CprFirst`, `gs-pass-library.jsx`) uses `DlNow` too, with its own label, the `delve-first` sessions, no next run, and the Pass line once finished (owner, 2026-10-29).
- Fixed: meter bars cap at 160px on a desktop card and centre in their group, so slack sits evenly at the hero's hairline.

- `app/gs-delve.css` pruned to what `gs-delve.jsx` draws (55k to 26k characters); computed style matched element by element in every staged state.
- Bug found by the owner and fixed: the carried-over v3 styles held the playground bar's page rules (`.gs-nav { display: none !important }`, `.gs-top` offset, `.kit-stage`, `.kit-phone`), which hid the top bar's navigation on every page of the main build. Removed. Lesson: a playground's styles carried into `app/` must be scoped to the game's own classes.

## Next
1. Owner checks the now card and session page; the free first-run card hook if he wants it.
2. Owner picks Sheet counts and Sheet on a phone; then remove the two Config rows.
4. Still queued: narrow desktop cards (v8 Open item 1), roll-box height, 5B's message, spec gaps (bargain figure in the view).
