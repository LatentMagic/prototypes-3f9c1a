---
date: '2026-10-08'
topic: 'library-game-page'
status: 'in-progress'
type: 'implementation'
---

# Handoff: library game page: option 16 built into all four games

## Current Focus

All four library game pages in `app/` now use option 16's four parts. The user hasn't reviewed the result yet. Next: the user checks it in `index.html`. One open question for them: the second card on 36,000 Summers Ago shows the weeks they played under a "days played" count. They may have meant a list of the days they played instead. Ask before changing it.

## Task(s)

- Done: Casebook's option 16 moved from the playground into the app.
- Done: the same four parts fitted to Delve, Daily Puzzles and 36,000 Summers Ago, from the upstream game specs.
- Done: updated the local design system copy (`_ds/...`) twice, for card hover and button hover. Library rows use the same hover vocabulary.
- Done: a pop-up with one action now fills the row (`index.html`, `.mcp-pop .mcp-btn-pair > .mcp-btn:only-child`). Casebook's Share pop-up has a single Copy button now; Close was dropped.
- Not done: dead code in `app/gs-player.jsx` (`GpPlayer`, `GpRecord`, `GpRecent`, `GpAch`, `GP_ACH`, `GP_CFG` beyond the card line). Every game now registers on `window.GS_LIBRARY`, so `GpPlayer` is only a fallback.

## Critical References

- `handoff-2026-10-08-option-16-direction.md`: what option 16 is and what was ratified.
- Upstream specs, read live: LatentMagic/business-ops `work/apps/mcp-game-store/inception/_outputs/game-specs/` (delve, daily-puzzles, casebook, 36000-summers-ago).
- `CLAUDE.md` ratification rule.

## Decisions

Ratified by the user, 2026-10-08:
- Option 16 is the direction for every library game page.
- All four games have all four parts. Only the content changes with the game's context. 36,000 Summers Ago has no editions, so it shows a history of the days you've played, not a streak.

Decided by Claude on the user's "decide for me" (2026-10-08). Not ratified in words:
- Delve: the top card is This week's scene, with the ending beside the title (Elsie rescued, The ritual finished, Your hero fell) and the rescue as the bar. Weeks in a row. The spec's 4 achievements. Your scenes.
- Daily Puzzles: the top card is Today, with one row per puzzle. Days in a row. 7 achievements based on the spec, using the app's puzzle names (Word Puzzle, Escape Room, Murder Mystery). On the free plan, the streak card and Your puzzles point to the Pass.
- 36,000 Summers Ago: the top card is your latest day (a list of facts), ending with where you left off. Second card: "N days played" over the last 10 weeks, Played / Not played. The spec's 13 achievements. Your days, each Day finished or Restarted. No Share, because the spec has no sharing.
- In Delve, Daily Puzzles and 36,000 Summers Ago, a play opens the app's existing session page (`gs-session.jsx`). Only Casebook has a page of its own (turns grouped by kind).
- Casebook Share pop-up: Copy only.

## Recent changes

- `app/gs-library.jsx` (new): shared parts. `LbHead`, `LbRun` (the run; `locked`, `figure`, `legend`), `LbAch`, `LbRow`, `LbRecent` (`empty`), `LbAll` (search, order, filter, pages of 12), `LbShare`, badge helpers (`lbAutoBadges`), seed date helpers. It sets up `window.GS_LIBRARY`.
- `app/gs-casebook-data.jsx`, `app/gs-casebook.jsx` (new): Casebook's seed (45 weeks, 10 achievements) and its page, all-cases page and case page.
- `app/gs-delve-library.jsx`, `app/gs-puzzles-library.jsx`, `app/gs-hunter-library.jsx` (new): one page per game, with its seed.
- `app/gs-player.jsx`: `gpGame` hands the `record` page to `window.GS_LIBRARY[id]` when it is set.
- `index.html`: an `lb-` CSS block after the player-page block, the single-action pop-up rule, and script tags for the new files after `gs-game.jsx`.
- `app/main.jsx`: `GS_REVIEW_DEFAULT.week = 'live'`. `app/gs-config.jsx`: a Library row, "This week, or today" (In progress / Finished).
- `app/states.jsx`: a new `Library` group (Casebook: Pass, finished, no Pass, Pass ended, all cases, one case; Delve; Daily Puzzles incl. free; 36,000 Summers Ago).
- `github.md`: last sync refreshed.

## Learnings

- `.gs-root p, ol, ul { margin: 0 }` (0,1,1) beats a single class. Bleed rules on lists need `.lb-card > .lb-x`.
- The design system's `Popup` wraps actions in a two-column `.mcp-btn-pair`, so a single action fills half the row. The fix is in the app's CSS. It belongs in the design system: tell the design system session.
- The project's `_ds/` copy doesn't update itself when the design system changes. Copy `_ds_bundle.js`, `components/components.css`, `readme.md`, `tokens/` and `_ds_manifest.json` from `/projects/ef1abd5b-.../`. Possible GOTCHA entry; ask first.
- Grep across projects returned nothing for files that do contain matches. Read the file directly.

## Artifacts

- The app files listed above.
- The playgrounds are unchanged (`playground/casebook-16.html` and others). They still load their own `pg-` copies.

## Action Items & Next Steps

1. User review of the four pages at phone and desktop widths, and of the no Pass and Pass ended viewers. Ask the 36,000 Summers Ago question above.
2. Get the decisions Claude made (above) ratified in words, or change them.
3. Remove the dead code in `gs-player.jsx` once the pages are signed off.
4. Ask whether this earns a `CHANGELOG.md` entry. It probably does, because the library page changed shape.
5. Update this folder's `README.md`, which still lists only the first two rigs and handoffs, and regenerate `playgrounds.json` if any rig moves.
6. Hover beyond the library page: the app's other clickable rows and tiles (`gs-hrow`, `gs-pz-item`, `gs-today-item`) have no hover yet.

## Other Notes

- The user wants chat replies short, with the ask on the last line.
- Invented seed: case, scene and day records, Delve heroes, Daily achievement progress, and 36,000 Summers Ago's day facts.
