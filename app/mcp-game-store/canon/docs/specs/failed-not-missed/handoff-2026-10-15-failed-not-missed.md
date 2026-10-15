# Handoff: a lost play reads "Failed" (2026-10-15)

Ruled by the product owner on 2026-10-15 (delta "a lost play reads Failed, not Missed").

## Changed
- `app/gs-data.jsx`: `GS_RESULT.word` and `GS_RESULT.mystery` loss branch → "Failed". Seeded `mystery-today`: `result` and `share` → "Failed". Played list, History, library game pages, session tag and `word-broken-first` take it from these. Streak logic untouched.
- The Daily Mystery share card builds its own text from `loss` ("wrong accusation"), not from `share`; unchanged.

## "Miss" left, by bucket
Not about results:
- `app/gs-data.jsx` 100, 102, 107: Delve roll outcomes "Miss", "Miss, HP 9/12", "Miss, HP 5/12" (a dice roll, not a play's result).
- `app/gs-delve-library.jsx` 23: achievement "Rescued without a miss" (a failed roll).
- `app/gs-chats.jsx` 78, `app/gs-game.jsx` 109: "what you missed at the fire".
- `app/gs-editions.jsx` 38, `app/gs-casebook-data.jsx` 9: "went missing", "the missing key".
- Dismiss / Dismissed in `gs-config.jsx`, `gs-push.jsx`, `gs-parts.jsx`, `states.jsx`, `states-ui.jsx`, `main.jsx`, `qa.jsx`.

Unplayed edition saying "Missed": none found. Every "Not played" left as it was. `index.html`: no hits.

## Also in this session (owner's instruction, 2026-10-15)
Only the daily games (Daily Word, Daily Groups, Daily Mystery) go by number. Every other game's editions are named scenarios and show the name only, no number (owner, 2026-10-15). `pgeNoNum` in `app/gs-editions.jsx` (list row, panel label, search placeholder and empty-state hint, "See in History" query uses the title), `app/gs-connect.jsx` (a named edition's prompt gives the name only).

## Not done / next
- Recent-editions and streak strip untouched (out of scope; owner has not ruled on failed vs unplayed there).
