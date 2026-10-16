# Handoff: streak when access ends (2026-10-11)

## Where it landed
A frozen streak is now shown on the Casebook and Delve library pages for a player whose Pass has ended. Built into the app, not only the playground. Not ratified: the look, the wording, and the changes below.

**What it looks like.** Heading "2 weeks in a row · Frozen". The weeks since the Pass ended (after 18 September) are grey bars that continue the streak bar. The legend gains a third entry, "Frozen", with a grey swatch. No lock icon, no hatching, no extra note.

**The count.** The streak counts only the weeks before the Pass ended. The edition live when the Pass ended counts if completed and cannot break the streak (existing `lbStreak` rule). In the seed it is 2: 31 Aug and 7 Sep done, 14 Sep not completed.

## Files changed
- `app/gs-library.jsx`: `LbRun` takes weeks with `frozen: true` (grey bar, joins the run, legend entry, heading "· Frozen", screen-reader text). New `lbFrozen(weeks, list, get)` marks weeks after the Pass ended and recounts the streak. Frozen weeks are never "now".
- `app/gs-casebook.jsx`, `app/gs-delve-library.jsx`: show the card when `gsLapsed(gs)`; layout is the Pass layout (not the three-column free one).
- `index.html`: styles for `.is-fz`, a one-row legend (wraps under 360px), joined day numbers aligned.
- Both pages: button now "Get the Pass" (was "Get the Pass again"). Unchanged elsewhere: Hunter library, session page, Account Pass card.

## How to reach it
Pink pill, States, Free and Pass: "Casebook library page, Pass ended", "Delve library page, Pass ended". Delve not yet looked at on screen.

## Playground
`docs/specs/streak-when-access-ends/playground/index.html`: earlier option studies. Directions tried: hatched, dashed with a reason, one folded span, muted fill, crosshatch. The owner chose the grey fill. Playground still shows the old "Not playable" legend; it is now stale.

## Decisions
- Grey fill, no icon. Chosen by the owner over hatching and a lock.
- Word on the page is "Frozen", the settled word. "Skipped week" and "Not playable" were tried and dropped; the weeks carry no separate name.
- Days: the same marks work, cells shrink. Not built; no daily game freezes.
- Buttons say "Get the Pass" everywhere, never "again" (owner, 2026-10-11). Changed in the Hunter library, session page and Account Pass card. The Account sentence "frozen until you get the Pass again" is unchanged.
- Day numbers are centred under their week, evenly spaced (owner, 2026-10-11).

## Unresolved
- Draft spec says a page with nothing playable lists achievements only. That conflicts with a frozen streak still shown; the spec line needs amending.
- Frozen achievements unchanged (dimmed badge, lock, "Earned {date} · Frozen"). Their lock icon now sits beside a streak with none; the owner has not said whether to keep it.
- The page links to the Pass page only through the existing button.

## Next
Look at the Delve state; refresh or delete the playground; decide on the achievements' lock and the remaining "again" copy; add a QA entry if it needs signing off.
