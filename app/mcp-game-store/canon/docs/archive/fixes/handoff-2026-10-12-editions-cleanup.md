---
date: '2026-10-12'
topic: 'editions-cleanup'
status: 'awaiting-review'
type: 'fixes'
---

# Handoff: tidy up after History and the list of editions

Brief: "tidy up after History and the list of editions" (2026-10-12). Nothing here is ratified.

## Changed
1. **No prompt for a finished edition that can't be replayed.** `GS_NO_REPLAY = ['word', 'groups', 'mystery', 'casebook']` in `app/gs-data.jsx`. In `PgeEdPanel` (`app/gs-editions.jsx`), a finished edition of one of these shows the played line and "See in History", with no prompt, no "Connect your AI first" line and no Copy. Of the games with a list, only Casebook is affected; Escape and Delve keep the prompt. An in-progress case keeps it.
2. **Leftovers removed.**
   - `GsSessionNew` (`app/gs-session.jsx`), the `ed` branch of `GsSession`, Casebook's fallback to it (`app/gs-casebook.jsx`), and its unused `.ss-new` rule (`index.html`).
   - States `session-new-needs-pass`, `session-new-pass`, `session-new-groups-closed`, `session-new-delve-needs-pass`, `session-new-closed` (`app/states.jsx`), and their ids in the `phone-snags-second-pass` and `final-audit-snags` QA steps.
   - QA entry `history-only` (`app/qa.jsx`).
   - Old per-edition rows: `phEds`, `PhShow` (`app/gs-history.jsx`); `cbRow`/`cbPassRow`, `dvRow`/`dvPassRow`, `pzRow`/`pzHist`, and the `rows` each library page computed but never rendered. These rows were the last callers of the not-played form.
   - Casebook replays: `CB_REPLAYS`, its seed loop, and the `replayed` label and replay mark in `CbCase`. Daily-puzzle replays had no code of their own left; one redundant `GS_EARLIER_CLOSED` check was dropped from the replay seed.
   - **Release note 1.6** (`app/gs-home.jsx`), reworded (unratified copy): "Every play, in History". "History lists every play under the day you played it. Find one by its name, number or date."
   - Comments that described the old design: `gs-history.jsx` header, search and seed notes; `gs-data.jsx`, `gs-library.jsx` and the `fp-word-library-free` state label said a free player gets "every edition", which no longer holds.
3. **Share and its link on one row.** `.lb-acts` (`index.html`) no longer wraps; the gap is 16px under 400px, 24px above.

## Already done
None of the three was already in the app.

## Left alone, and why
- History files: `CHANGELOG.md`, `docs/archive/`, and the handoffs that name the old design (`history-only`, `decisions-2026-10-10`, `fixes/handoff-2026-10-10-fixes.md`, `walk-sweep-2`, `snag-fixes`, `game-editions-list-*`, `five-small-fixes`).
- Playgrounds: `docs/specs/history-filters-redesign/` and `game-editions-list/playground/` describe the List switch as their own options.
- `replay-share` QA note: it is about session pages, which the brief keeps.

## Unresolved
- **Casebook's case page still offers "Play again"** on a finished case (`CbCase`), and the session page does the same for Daily Word, Groups and Mystery today. That goes against `GS_NO_REPLAY`. Session pages were out of scope.
- Check that "See every roll" and "See every guess" fit beside Share at 320px in every library card.
