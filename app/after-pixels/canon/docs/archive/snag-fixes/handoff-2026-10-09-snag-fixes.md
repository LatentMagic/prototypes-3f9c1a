# Handoff: snag fixes, 2026-10-09

Built from the "MCP Game Store — ten fixes" brief, plus three page fixes the user asked for in the same message. Nothing here is ratified. Each "Chose" line below is a proposal waiting for the user.

## What landed, and where

1. **Casebook and Delve without the Pass.** `.lb-lay.is-three` (index.html, ≥900px): the first edition sits above your plays on the left, Achievements sits on the right beside both, and every card is its own height. `LbRecent` (now in `gs-history.jsx`) stops matching its neighbour's height when the layout is `is-three`. Phone order is unchanged.
2. **One state for this edition.** `lbNow(gs, id)` (`gs-library.jsx`) is the single answer for this edition's play. The product page week card, the library now card, the Editions page and History all read it. The default is **finished** (`GS_REVIEW_DEFAULT.week = 'done'`). The free plan now has played every free game's current edition, the same as the Pass (`GS_TODAY_PLAYED.free`). In-progress records: `word-live`, `groups-live`, `mystery-live`, `escape-live`, `delve-live` (`gs-data.jsx`). Casebook's in-progress record is its case page.
3. **Rows open what they name.** Every finished Delve scene has its own session `delve-<id>` (`gs-delve-library.jsx`). Replays clone their scene's record with their own result. Casebook replays are their own case records (`CB_REPLAYS`, built in `gs-history.jsx`, found by `CbLibrary`), and the label says "REPLAYED <date>". A record's date is now the date of the play.
4. **36,000 Summers Ago session.** Every day has a session `hunter-<id>` with its result (Finished / Restarted), the day number and how it ended as tags, and "The day" as the record. A lapsed player's "Your last day" card shows that day's own ending, facts and link. Share is hidden on any session with no share text.
5. **Editions.** `edList` (`gs-editions.jsx`) gives every edition a result or "Not played" for anyone signed in. Free: the first edition is played. Lapsed: everything played before 18 September is played. "Not played" and "Played" both work.
6. **Rows read in full.** Play rows use `.rp-cols`: the list sets the columns and every row shares them through subgrid. The edition title wraps, and nothing is cut with an ellipsis. In History under 480px, the title takes the first line and the result and time take the second.
7. **Old list pages removed.** These are gone: `LbAll`, `LbRow`, the original `LbRecent`, every `sid === 'all'` branch, the filters, and the `library-groups-all` / `library-casebook-all` states. Before removing them I checked that nothing linked to `sid: 'all'`. Every "All…" link already opened History. `gs-history.jsx` now defines `GsHistory` and `LbRecent` itself, with no option switch and no overriding. The session back link now lives in `GsSession` (`gs-session.jsx`), and the old `GsHistory` and `GS_HISTORY` were deleted.
8. **Pass mark on an Editions row.** It is a plain `DS.Tag kind="locked"` and is no longer a button.
9. **Footer.** `.gs-root` is a flex column and the footer has `margin-top: auto`. A spacer (`.gs-demo-space`) replaces the root's bottom padding.
10. **Demo bar.** `gsWeekSwitch` shows the switch only where `lbNow` returns a play (a product page, library game page or Editions page) and on History when signed in. Under 600px the bar wraps to two rows and the spacer grows to match. The States "Pass card" note is corrected.

Extra fixes, from the user's message:
- **Product page:** the cover was setting the head's height from the art's aspect ratio. That made the play box taller than its content on Daily Word and the other free games. The cover is now absolutely positioned inside its column (min 320px), so the play box sets the height.
- **Pass page:** the empty 48px status row no longer renders when signed out. That row was the gap above "What you get".
- **How it works:** the header and lead now span two thirds of the page from 720px, in place of a 44ch measure.

## Yours-to-decide items (proposals, not ratified)

- **Item 1, card arrangement.** Chose: first edition above your plays on the left, Achievements beside both on the right. This keeps the Pass page's pairing (the now card on the left, achievements on the right), and no card stretches.
- **Item 2, which state, and does the switch move everything.** Chose: finished. Most screens already said finished, and the existing records were built finished. The switch now moves every screen together, with an in-progress record behind each one. The free plan's sample now matches the Pass for the four free games.
- **Item 4, the 36,000 Summers Ago page.** Chose: keep the links and give every day a real record. The game spec has no sharing, so the page has no Share button.
- **Item 6, a wrapped History row.** Chose: the title wraps in its column at every width. Under 480px it takes the first line, with the result and time on the second.
- **Item 8, the Pass mark.** Chose: the same Pass tag, as a plain mark that does not link to the Pass page. The row's own control gives the prompt.

## States added or changed (`app/states.jsx`)

- Renamed: `library-<game>-finished` → `library-<game>-in-progress` (Casebook, Delve, the three dailies, Escape). Finished is now the default.
- Added: `library-casebook-replay`, `library-delve-no-pass`, `library-delve-pass-ended`, `library-hunter-pass-ended`, `editions-casebook-free`, `editions-casebook-pass-ended`, `history-in-progress`, `session-delve-past`, `session-word-in-progress`.
- Changed: `session-hunter` now opens `hunter-hg0`. The labels of `groups-free` and `escape-free` lost "(not played)".
- Removed: `library-groups-all`, `library-casebook-all`, and the matching QA steps.
- Added (user asked, 2026-10-09): `free-not-played-today`, with the Config row "Free plan, today: Played / Not played". It empties the free plan's plays of this edition on every screen. The library now card shows the game's existing line from its product page and "Play in your AI".
- Config "This week, or today" is the switch's Config control. Its hint now says it moves every screen.

## Left open

- 36,000 Summers Ago's latest-day card still says "You left off at midday…" over a finished day. That line was untouched.
- Editions row titles wrap early at mid widths because of the fixed slot columns. This predates this work and was left alone.
- Dead CSS for the removed parts (`.lb-row`, `.rp-grid`, `.rp-two`, `.ph-row`) is still in index.html.

## Next

Ratify or reject each "Chose" line above. Then check 320px for History, the demo bar's two rows, and the `is-three` layout at 900–1000px.
