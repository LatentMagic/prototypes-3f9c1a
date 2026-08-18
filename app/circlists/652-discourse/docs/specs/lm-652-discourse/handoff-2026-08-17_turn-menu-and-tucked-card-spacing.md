---
date: '2026-08-17'
ticket: 'LM-652'
topic: 'discourse — the turn menu popover and the tucked card on the surface'
status: 'complete'
type: 'implementation'
---

# Handoff: LM-652 — the turn menu popover, and the tucked card's spacing on the surface

## Current Focus

**Nothing open from this session.** Both things the user raised were fixed and neither
needs a follow-up. The session immediately before this one ended awaiting the C5 pick;
**that pick has landed — option 3** (the thought arrives tucked under the head card as the
real `CandCardRow` at `tab="active"`), and the surface is already built to it. The next
session picks up from the standing list in
[`handoff-2026-08-17_conversation-surface.md`](handoff-2026-08-17_conversation-surface.md),
not from here.

A **playground prompt for the conversation surface was announced and then not sent** — the
user cancelled it mid-session. Do not act on anything implied by it.

## Task(s)

Two, both narrow and both ratified in words before building.

1. **The own-turn menu's popover.** The user had earlier noted the menu button felt
   slightly wrong; they explicitly closed that line down — *"we just need to fix how the
   popover works"* — and equally explicitly **killed the turn-delineation idea** the
   previous session had been circling (*"we don't need to worry about extra turn
   delineations"*). The button stays exactly where it is. Only the panel changed:
   - anchored `left: 0` instead of `right: 0`, so it opens down-and-right from the trigger
     rather than growing leftwards off a button that sits near the left of a wide row;
   - offset `calc(100% + 4px)` and min-width 180, matching the app's own menu
     (`app/spaces.jsx:309`);
   - **flips to right-aligned when a left-aligned panel would cross the viewport's right
     edge** (8px gutter). Ratified after the AA audit below.
2. **The tucked-under card's spacing when opened on the surface.** The user's report: it
   *"looks cramped above and below"* compared with the Active version. Cause and fix in
   Learnings. Active is untouched.

**Reverted, not landed:** the FAB on the conversation surface. The user said Add should be
available there, then cancelled that prompt before the work was wanted. `app/main.jsx` was
edited and then restored to its previous state — the candidate route renders exactly
`inShell(r.body, r.opts || {})` again, as before. **Do not re-apply it without a fresh
ask.** The finding it produced is recorded in Other Notes because it will come up again.

## Critical References

- `CLAUDE.md` — the ratification rule (a cancelled prompt is not an instruction) and the
  chat-brevity rule.
- `docs/specs/lm-652-discourse/handoff-2026-08-17_conversation-surface.md` — the surface's
  own audit and its open list. Still the live handoff for everything except these two fixes.
- `skills/frontend-ui-engineering/references/accessibility-checklist.md` — the bar the
  menu was measured against.

## Recent changes

`docs/specs/lm-652-discourse/cand-lm652-surface.jsx`

- `CAND_MENU_W = 180` added above `CandTurnMenu` (surface.jsx:~96) — one constant, shared
  by the flip test and the panel.
- `CandTurnMenu` takes a `flip` state and a `btn` ref. The flip is decided in the toggle's
  own updater from `btn.current.getBoundingClientRect()` **at press time** —
  `r.left + CAND_MENU_W > window.innerWidth - 8` — not from the panel after paint, so the
  panel never draws overflowing for a frame.
- The panel: `top: 'calc(100% + 4px)'`, `left: flip ? 'auto' : 0`, `right: flip ? 0 : 'auto'`,
  `minWidth: CAND_MENU_W`.

`docs/specs/lm-652-discourse/cand-lm652-card.jsx`

- `CandAltFace` hoists `const onSurface = React.useContext(CandSurfaceCtx)` to the top of
  the component (it had been called inline inside the JSX at the old line 217) and reads it
  in three places.
- Container padding bottom: `var(--space-3)` → `var(--space-5)` **when on the surface only**
  (12 → 20px).
- Foot row: `marginTop` −8 → 0 and `marginRight` −13 → 0 **on the surface only**.
- The tick + trash group's suppression now reads `!onSurface` instead of calling the hook
  inline.

`app/main.jsx`

- **No net change.** Edited to carry `FAB` + `AddReveal` on the candidate route, then fully
  reverted at the user's instruction.

## Learnings

**The cramp was the buttons' space, not a spacing value.** On the surface the alt face
suppresses its tick and trash (ratified on the 17th: the head card already carries them).
Those buttons are 36px tall and the foot row is `alignItems: 'center'`, so in the Active
version the ~18px source line is optically centred inside 36px — the row was donating
roughly 9px of breathing space above and below it. Remove the buttons and the row collapses
to the text's own height, leaving 4px under the prose (12px gap minus the −8 pull) and 12px
to the card's edge. The numbers were never wrong; they were tuned for a row that had
something taller in it. **The general trap: when you suppress the tallest child in a
centred flex row, the row's negative margins and the container's padding both become wrong
at once, and neither looks like the culprit.** Worth proposing for `GOTCHA.md` — not added,
per the approval rule.

**The popover's real defect was placement-dependent overflow, not size.** Measured on the
live surface: the trigger sits 44px and 78px into the turn body for the seeded turns, which
at 320px leaves about 10px of clearance for a 180px panel — it fits, barely, which is
exactly why the bug would not have shown up in casual testing. A full name plus
"3 days ago · edited" pushes the trigger out past 200px and the panel runs off the screen.
That is a 1.4.10 reflow failure (horizontal scroll), which is why the flip was worth doing
even though nothing else about the menu failed.

**The AA audit came out clean otherwise**, and is recorded so nobody re-runs it: kebab glyph
`--color-fg-3` `#6E6E6B` on `--color-surface` white = **5.1:1** (1.4.11 wants 3:1); Edit in
`fg-1` = ~19:1; Delete in `--color-destructive` `#991B1B` = **8.3:1**; trigger and both rows
are 44px targets against 2.5.8's 24px; `tokens.css:263`'s universal `:focus-visible` ring
covers keyboard focus; `role="menu"`, `aria-haspopup`, `aria-expanded`, Escape and
click-away are all present.

**Process note.** The previous session's own handoff records that it was told off for being
far too long and for treating "ratify the problem" as "go build". This session's turn
delineation instruction is the follow-on: the user's read was that the concern had been
inflated well past what the observation warranted. When the user calls something *slightly*
wrong, fix the slight thing.

## Artifacts

- `circlists-lm652.html` — the candidate entry, carrying both fixes. Unchanged itself.
- `docs/specs/lm-652-discourse/cand-lm652-surface.jsx` — the popover flip.
- `docs/specs/lm-652-discourse/cand-lm652-card.jsx` — the surface-only spacing.

## Action Items & Next Steps

1. **The playground prompt for the conversation surface is still coming.** It was announced,
   cancelled, and not replaced. Wait for it.
2. **Everything on the previous handoff's list still stands untouched** — Part B copy, the
   domain on the closed card, the "watching" wording, `CAND_OWN_MIN = 3`, the unratified
   `tab`-passthrough behaviour, the single-vs-two-action footer centring, and the C1–C5
   entries still sitting at the project root.
3. **Two `GOTCHA.md` candidates await approval**: the suppressed-tallest-child spacing trap
   above, and (carried from the previous session, still unproposed) the
   measure-the-hidden-face-at-full-width bug.
4. **`CHANGELOG.md` — nothing to add.** Both fixes are refinements inside an existing
   feature; neither changes the product's shape.

## Other Notes

**The Add-on-the-surface finding, kept because it will recur.** While the FAB work was
briefly in place it established that the ask splits cleanly in two:

- **Web postures** are easy: the candidate route can render the same `FAB` + `AddReveal` the
  feed branch does at `app/main.jsx:685`, gated `!isApp`.
- **The app posture cannot be solved there at all.** In-app there is no FAB by design
  (`app/app-shell.jsx:24` — a floating FAB "was ruled out and stays ruled out"); Add is the
  centre-docked circle, and `AppShellNative` hides the whole bottom bar on any sub-view
  (`app/app-shell.jsx:176`, `!isSub && !isHome`). So Add is unavailable on settings, account
  **and** this surface in-app, and making it available means changing shipped shell chrome
  — a governance-level call, not a candidate detail.

Ratified in words this session:

- The menu **button's position is not the problem** and is not to be moved.
- **No extra turn delineation** on the conversation surface. Turns stay as they are.
- The popover **flips at the edge** rather than being permanently edge-locked to the turn
  body (edge-locking was recommended; the user chose the flip).
- The tucked card's spacing fix applies **to the surface only** — the Active row is correct
  as it is.
