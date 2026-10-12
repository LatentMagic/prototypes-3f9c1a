---
date: '2026-10-12'
topic: 'history-filters-redesign'
status: 'in-progress'
type: 'exploration'
---

# Handoff: History's filters, owner's first review pass

## Current Focus

The owner is still reviewing the playground (`docs/specs/history-filters-redesign/playground/index.html`). Options 1 and 3 have had a first look. Option 2 is next and has not been reviewed. Wait for the owner's reactions and don't start a direction until they pick one. Nothing is ratified: not an option, and none of the new copy.

The playground's options, stances and costs are in `handoff-2026-10-12-history-filters-redesign-playground.md` (same folder). That file is still the reference for what was built.

## Task(s)

- **Option 1 (Two lists), owner's reaction:** the Played / All editions tabs feel wrong. The owner can't see what All editions adds, because the two tabs look nearly the same. I explained that All editions exists only to reach editions you never played, and that "Missed" on Played is probably a result (a play you lost), not an unplayed edition. The owner was asked to confirm which one they saw, and hasn't answered.
- **Option 3 (Every control on the page), owner's asks, both done but not yet confirmed by the owner:**
  1. The Games panel should allow several picks (e.g. several schedules). It now does.
  2. The search field in the Games panel was broken and didn't fit inside the panel. I patched this without seeing it, so it isn't confirmed.
  3. The panel needed a Done, like option 0's Filters panel. It now has one.
- **Option 2:** not yet reviewed.

## Critical References

- `CLAUDE.md`: ratification rule (present options, recommend, stop), chat-reply limits, overlay kinds (the Games panel is a **panel**).
- `app/gs-library.jsx:188` `LbFilters` is the pattern for panel actions: Done on its own, or Clear + Done once anything is set.

## Recent changes

All in `docs/specs/history-filters-redesign/playground/`. `app/` is untouched.
- `pg-history.jsx`
  - Added `pghScLabel` and `pghScHit`, beside `pghScopeLabel`.
  - `PghScope`: "All games" stays a row that clears every pick. Schedule, genre and game rows are now `DS.Checkbox` (`.pgh-crow`). The value is an array.
  - `PghBar3`'s Games popup: actions are Done, or Clear + Done when anything is ticked. Ticking no longer closes the panel.
  - `PghNew`: new `sc` state, saved in `keep`.
    - `ok` uses `pghScHit` for option 3.
    - `anySet` and `clearAll` include `sc`.
    - `setScope(v)` sets `g` only when the pick is exactly one game, so titles stay short and the list keeps its own word ("All cases").
    - Arriving with `r.game`, `r.rhythm` or `r.kind` seeds `sc`.
- `index.html` (rig CSS, after `.pgh-sec`):
  - `.pgh-scope > .mcp-fld` gets 4px padding and `min-width: 0`.
  - `.pgh-scope .mcp-in` gets `box-sizing: border-box`.
  - Added `.pgh-crow`.

## Learnings

- **What multi-select means:** a game is shown if it matches *any* pick (union). So genre and schedule still can't be intersected (e.g. "weekly puzzles"). This is the same cost the first handoff lists for option 3. It is not decided.
- The search-field fix is a guess. The likely causes were the focus outline being clipped at the panel edge, or the grid child's min-width. Look before you claim it's fixed.
- `ready_for_verification` reports 42 missing files for this entry. That's the known `<base href="../../../../">` false positive: the depth is four, which is right for `docs/specs/<t>/playground/`. The rig rendered for the owner before these edits (GOTCHA 11: confirm by looking).

## Artifacts

- `docs/specs/history-filters-redesign/playground/pg-history.jsx` (updated)
- `docs/specs/history-filters-redesign/playground/index.html` (updated)
- This handoff

## Action Items & Next Steps

1. Wait for the owner's review of option 2. Then ask the owner which direction to take, one question at a time.
2. Get the owner to confirm, on a phone and at desktop width, that the Games panel's search field now fits and Done/Clear work.
3. Answer the open question on option 1: is the "Missed" row on Played a lost play or an unplayed edition? If an unplayed edition shows on Played, that's a bug in `pghRows`.
4. Once a direction is picked, build the Library's half in the same rig, as the first handoff says.

## Other Notes

- New unratified copy this pass: "Daily games +2" (several picks), and Clear/Done in the Games panel (reused from LbFilters).
- The owner is frustrated with option 1's feel. Treat that as a reaction to review, not a decision to cut it.
