---
date: '2026-10-09'
topic: 'editions'
status: 'awaiting-review'
type: 'exploration'
supersedes: 'handoff-2026-10-09-editions-playground.md (options 2 and 3 there are gone)'
---

# Handoff: Editions playground, round 2

## Objective
Settle a game's Editions page (every edition, your result, the line to paste into your AI) in the playground, then port it into `app/`.

## Where it stands
Playground: `docs/specs/editions/playground/index.html` + `pg-editions.jsx` (CSS for it at the end of the entry's `<style>`, the `.ed-*` rules). State key `pg_editions_v1`. Strip: Option, Game, Go (1 Product page, 2 Editions), View.

Options now on the strip (all one component, `EdLedger`, with flags):
- **1** "Ledger, fixes only": the original ledger, marks after the date in fixed slots (`orig`).
- **1b** "Ledger, marks in a column": marks in their own column, result in a fixed 128px column right-aligned beside the arrow. **The owner's pick so far ("THATS IT").** Don't change its row layout.
- **2a** month headings, **2b** date in its own column, **2c** latest pinned above, **2d** results as DS status tags. The owner disliked 2d's big tags.

## Ratified by the owner, 2026-10-09
- Pass uses the design system's `locked` Tag (dashed 1.5px is in the DS readme). Kept.
- Pass sits in a fixed slot, Latest always beside it. With the Pass the Pass tag is hidden and its slot stays empty; the gap is fine.
- Status (Solved, Unsolved, In progress, Not played) stays as text with icon, beside the arrow, as in 1b.
- Editions page H1 is "All editions"; the back link names the game.
- "All editions" is not on the library game page (tried beside "About <game>", then removed). The product page keeps it.
- Discover drops the "Played today / Played this week" marks: `app/gs-discover.jsx` (`DcBody` no longer passes `mark`). Other screens using `gsMarks` are untouched.
- Product page "This week" card shows the result as `LbResult` (the library style), not the big green `GsResultTag`. Playground copy only (`EdWeekCard`); `app/gs-game.jsx:166` still has the tag.

## Open, not decided
- Which option ships: 1b is liked; 1 and 2a–2d have not been cut. Recommended: cut 2d (it only differs by the tags the owner rejected).
- Library game page "Your cases" in the playground shows rows stretched to the Achievements card height (no Pass view). The owner says the app does not do this; the playground now uses the app's own `LbRecent` and the `.lb-*` CSS matches root `index.html`, so the cause is not found. Compare the playground entry's CSS and load order against root `index.html` first.
- Product-page copy for Casebook/Delve without the Pass: one version now, "The first edition is free."

## Next
1. Find the stretched "Your cases" cause in the playground.
2. Get the cut of options (keep 1b; ask about 1, 2a–2d).
3. Port 1b into `app/`: an `editions` route in `main.jsx`, "All editions" beside the edition heading in `gs-game.jsx`, `LbResult` on the product-page card.
4. Regenerate `playgrounds.json` notes for this ticket; delete unreferenced files in `uploads/`.
