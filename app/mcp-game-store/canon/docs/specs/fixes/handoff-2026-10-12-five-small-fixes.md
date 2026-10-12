# Five small fixes — handoff, 2026-10-12

## Changed
1. **Replays in the sample data.** Removed at the source, not filtered after:
   - `app/gs-history.jsx`: dropped the hand-seeded replays of Daily Word (`word0`) and Casebook (`c0928`); `PH_REPLAY` now holds only Escape, so generated replays only land on Escape; the streak-broken log (`PH_BROKEN`) keeps the failed first play and loses its replay; removed the late filter that hid daily replays from the log.
   - `app/gs-puzzles-library.jsx`: removed the `word-broken-replay` record and the "1 replay" count on the streak-broken row.
   - Replay counts on library cards and History come from the data, so they now show only for Escape and Delve.
   - Replays left: Escape (`escape0`, `escape2`, plus generated ones) and Delve (`dv1`).
   - States: `session-replay` now opens an Escape replay (`escape-week-r0`); `library-casebook-replay` deleted from the register and QA; the streak-broken label no longer mentions a replay.
3. **"Not solved".** `GS_RESULT.word` and `GS_RESULT.mystery` failures, the `mystery-today` record (result, share, share heading) and the generated Daily Mystery records (result, share, share heading) now read "Not solved". The `mystery-pass` state label reads "today not solved". "Missed" meaning not played is untouched.
4. **History's subtitle.** Removed from `PhHead`; nothing in its place.

## Already done
2. **"Share" and "See every turn".** `.lb-acts` in `index.html` already lays them out on one row at every width (game-editions-list, 2026-10-12). No change.
5. **"Latest" chip.** No row in `app/` carries one; it exists only in the `history-filters-redesign` playground. The What's New list on Home marks its newest entry with a lighter dot (`is-latest`), which is not a chip and has no text; left as it is.

## Follow-up, same day
- **Results box height.** `.lb-results { min-height: 720px }` held History's and a game's editions list's results box at 720px however few rows matched. The editions list's `.ed-results { min-height: 0 }` override sat earlier in `index.html` at the same specificity, so it never applied. Removed both; only the loading state (`.lb-results > .gs-inplace`) still holds 720px.
- **Replay count on library game pages.** Replaced by the follow-up below.

## Plays card lists recent plays (2026-10-12, second follow-up)
- `LbRecent` (`app/gs-history.jsx`) now builds its rows from History's own list (`phVisible`) narrowed to the game: one row per play, newest first, a replay its own row with "Replay". No row for an unplayed edition, no replay count. `rpViews` is gone; the four library pages no longer pass `rows`.
- A row shows its day (`phShort`) where History shows its time, because the card has no day headings. Ratified by the owner, 2026-10-12.
- Staged rows the pages used to inject (the free first case in progress) now follow History: if History doesn't show a play, the card doesn't either.

## Unresolved
- `.lb-acts` still allows wrapping. At 320px a long link ("See your turns so far") beside Share could drop to a second row. Not changed without a decision.
- `CB_REPLAYS` and the Casebook "Replayed" label code remain, with no data feeding them.
- The `replay-share` QA note still names Casebook among replayable records.
