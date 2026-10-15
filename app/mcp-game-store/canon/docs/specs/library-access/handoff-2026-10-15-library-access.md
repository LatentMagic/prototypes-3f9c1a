# Handoff: the Library lists only games the player can open or has played

Rule ratified by the product owner, 2026-10-15. A game is in the Library list if the player can play some part of it now, or has played it. A game the player can't play and never played is not listed.

## What changed
- `app/gs-discover.jsx`, `GsLibrary`: the list is built from `listed`, which is `GS_GAME_ORDER` minus any game where `lbAccess(gs, k) === 'none'` and `lbPast(gs)` is false. Today that drops only `hunter`, for a free player who never had the Pass, including a new account (`gsFresh`). Search, Genre, Schedule and Order run on `listed`; the filters, their options and both empty messages are unchanged.
- `gsLibRow` is unchanged, including its hunter branches (a lapsed player's row and the now-unreached free "Pass only" row).

## Seeded assumption: "played" for a lapsed player
The prototype has no per-player "played" flag. A lapsed player's played hunter days are the seeded `HG_DAYS` before the Pass ended (`hgOld`), so every lapsed player is treated as having played hunter and keeps the row, which opens "Your Pass has ended". No played check was added. A real build needs the player's own record here.

## States
- Dropped `fp-hunter-library-free` from `app/states.jsx` and from the `free-and-pass` steps in `app/qa.jsx`. `fp-product-hunter-free` covers this player on the game's store page.
- `library-free`, `new-account-library`, `library-list-free-in-progress`: Library list now has no hunter row.
- `library-pass-ended`, `library-hunter-pass-ended`, `library-hunter-pass-ended-today`, `fp-hunter-library-lapsed`: unchanged; the hunter row stays and opens.
- `library`, `library-hunter`, `hunter-free`, `hunter-pass`, `filter-empty-library`: unaffected.
- `docs/specs/free-and-pass/handoff-2026-10-09-free-and-pass.md` still names `fp-hunter-library-free` in its state list. Left as written: it is that task's record.

## Left alone
- "Your Pass has ended" page (`HgClosed` with `again`), Discover, store and product pages, pricing, the Pass page.
- The free player's hunter library page (`HgClosed` without `again`) is unchanged in code.

## Next
- Walk the acceptance list with the owner: free, new account, Pass ended, Pass, free + Genre "Learning".
- Replace the seeded "played" assumption with a per-player record when one exists.
