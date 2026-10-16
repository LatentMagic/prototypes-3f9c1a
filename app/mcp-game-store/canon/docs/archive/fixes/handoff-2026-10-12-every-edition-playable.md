# Every edition can be played; some cannot be played again — handoff, 2026-10-12

## Changed
- **One rule, held once.** `GS_EARLIER_CLOSED` and `GS_NO_REPLAY` are gone from `app/gs-data.jsx`. Daily Word, Daily Groups, Daily Mystery and Casebook carry `once: true` in `GS_GAMES`; every surface reads it through `gsCanReplay(gid)`.
- **A list for the dailies.** `ED3` in `app/gs-editions.jsx` is now every game with a release rhythm (`gsRhythm`), so the three dailies get the link beside the name and the same list, rows, search and Filters. 36,000 Summers Ago has no rhythm and stays out. Daily rows read `#212` (no name to repeat); the edition panel's title is `Daily Word #212`, its label the date. SAMPLE lines and lengths added to `PGE_INFO` / `PGE_LEN` for the dailies.
- **Earlier dailies can be played.** `edClosed` removed from `app/gs-history.jsx`; `edNeedsPass` treats an earlier daily as it treats an earlier Casebook case. The "Playing earlier … comes with the Pass" line on a daily's library game page now shows for all four puzzle games.
- **Finished, cannot be played again.** In the edition panel (`PgeEdPanel`), a played edition of a `once` game shows its details, its result, the line below and "See in History"; no prompt, no Copy, no Pass line, no Play.
- **"Play again".** Removed for `once` games on the session page (`app/gs-session.jsx`) and Casebook's case page (`app/gs-casebook.jsx`); Share stays. Neither shows the Pass line in its place, since there is nothing to unlock. Escape and Delve keep it.
- **Sample replays.** `app/gs-history.jsx` seeds replays only where `gsCanReplay` holds (puzzle loop and Delve loop).
- **States and QA.** `session-word-earlier-closed` replaced by `session-word-earlier`; added `library-word-editions`, `edition-word-earlier`, `edition-word-done`, `edition-casebook-done`. New QA entry `every-edition-playable`; the `replay-share` note no longer says every finished play has Play again.

## Already done
- The edition opens in a panel over the list (round 3), so the earlier brief needed nothing.
- Casebook had no seeded replays (five-small-fixes).

## Wording chosen
- Finished edition panel, under the result: "You’ve played this one. It can’t be played again." Ratified by the owner, 2026-10-12. Plain first, no dare, as a working screen. It names no game word because Daily Groups' word has no usable singular.
- Unratified:
- Earlier daily panel lines (SAMPLE): Word "Five letters, six guesses and one word to find. Start guessing." Groups "Sixteen words hide four groups. Find all four." Mystery "There’s a body and a story that doesn’t add up. Find out who did it."

## Unresolved
- Daily Groups only: link "See all groups", list H1 and Show option "All groups" (`edLink`, `edAll` in `GS_GAMES`; owner, 2026-10-12). Other games keep "Every …".
- Edition panel: no chips; the length joins the label after the date (owner, 2026-10-12). Casebook's suspects chip dropped; the "You question …" line carries the cast.
- The session page of a finished `once` edition shows Share only; it says nothing about not replaying. Not added without a decision.
- `CB_REPLAYS` and the Casebook "Replayed" label code still sit unused.
