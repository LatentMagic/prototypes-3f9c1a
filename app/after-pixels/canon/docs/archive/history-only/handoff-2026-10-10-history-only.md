---
date: '2026-10-10'
topic: 'history-only'
status: 'awaiting-review'
type: 'build'
---

# Handoff: History is the one list

## Objective
Remove the Editions page and make History the one list of what a player has played and could have played. The brief is the delta prompt of 2026-10-10 ("MCP Game Store — History is the one list"). The direction is option 2 of `docs/specs/plays-and-editions/`, with the brief's four differences: no signed-out list, no pop-up, a search, and no Pass mark on rows.

## What was built
- **Editions page removed.** `app/gs-editions.jsx` is deleted, along with its script tag in `index.html`, the `page: 'editions'` branch in `gs-player.jsx`, the product page's "All editions" link (`gs-game.jsx` `GsWeekCard`), `edGo`, `EdLineDialog`, `PhPages` and the states `editions-casebook-free` and `editions-casebook-pass-ended`. No QA step used those states. The product page keeps its edition card and play control.
- **What moved where.** `ED_GAMES`, `ED_NONE`, `edName` and `edList` now live in `app/gs-history.jsx` under "Editions". It also adds `edClosed` (the edition can't be played at all), `edNeedsPass` (this player needs the Pass for it), `phNorm` / `phHay` (search) and `phEds` (every edition, each with its plays). The sample flag `GS_EARLIER_CLOSED` is in `app/gs-data.jsx`.
- **History** (`GsHistory`). The side column, in order: Search, List (Played / Every edition), Order, Plays, Schedule, Show. It opens on Played, which is today's list of plays under the day each was played. Every edition lists each edition once under the day it came out, played or missed, with its replays beneath it (option 2's layout, `.ph-eds` / `.ph-reps` in `index.html`). A row for a played edition opens the record of its first play. A missed row opens `session { gid, ed }`. New route params: `show: 'all'` and `q`.
- **Session page empty state** (`GsSessionNew` in `gs-session.jsx`; `GsSession` picks it when the route has `ed`). It has no result and no turns, and comes in three forms (below). `GsSessionRecord` is the old page: it now takes its Pass mark from `edNeedsPass`, and it has no Play again for an edition that can't be played.
- **Signed out.** Nothing changed: History was already signed-in only, and the product page still gives the prompt in the play dialog with "You also need a [Platform] account." Now that the link is gone, nothing a signed-out visitor can reach lists editions.
- **Library game page plays card.** Unchanged. Its "All…" link already opened `history { game, from }`, and its back link returns to the library game page.

## Staged states (group "History" in `app/states.jsx`)
- `session-new-pass`: a missed Daily Groups edition (#84), with the Pass.
- `session-new-needs-pass`: the same edition, free account.
- `session-new-delve-needs-pass`: a missed Delve scene, Pass ended.
- `session-new-closed`: a missed Daily Word edition (#207), which can't be played.
- `session-word-earlier-closed`: an earlier Daily Word that was played (no Play again).
- `history-every-edition-groups`: a game whose earlier editions can be played. `history-every-edition-word`: a game whose earlier editions can't.
- `history-every-edition-casebook`, `-casebook-free`, `-casebook-pass-ended`: the same view for the Pass, free and lapsed players.
- `history-every-edition-all`, `history-hunter`, `history-search-empty`.

No Config control was added. Every state is reached by address, and the view is switched with the existing demo bar and Subscription row. The QA entry `history-only` in `app/qa.jsx` lists all of these.

## Choices on the open items (proposed, not ratified)
- **Empty session page.** It uses the record page's head: cover, game name, the edition as H1, and "Not played" and the day as figures. Revised 2026-10-10 on Joe's review: the action is the product page's edition card's. Playable shows "Play in your AI", which opens the same play pop-up as every other play control. No prompt sits on the page.
- **Needs the Pass.** Only the Pass tag (`GsPassTag`), as on the product page. No prompt and no play control (Joe, 2026-10-10).
- **Can't be played.** There is no prompt and no Pass. It says "Only the latest Daily Word can be played. This one stays in your History." with "Go to your Daily Word". The Pass would not open it, so the Pass is never offered. A played record of such an edition loses Play again and keeps Share.
- **Sample data.** Daily Word's earlier editions can't be played, which follows Jonny's example. Every other game's can. Each game's spec will settle this.
- **The control.** "List" with two choices, "Played" and "Every edition". I dropped option 2's "Not played": a missed row already says Not played, and three choices next to Plays' three crowded the column. It appears only where it changes the list (see 36,000 Summers Ago).
- **One-game title.** With one game and Every edition, the H1 reads "<Game> editions", for example "Daily Groups editions". Otherwise it is "History".
- **36,000 Summers Ago.** No special rule is needed. A game with no editions adds its days as played, so for it Every edition and Played are the same list, and the List switch hides when it is the one game shown. That hide rule is general ("shows only where it changes something", as the This week switch already works), not a rule for this game.

## Left alone in the project search, and why
- Old handoffs and prompts that name the Editions page or `gs-editions.jsx` (`docs/specs/editions/`, `plays-and-editions/`, `connect-and-prompts/`, `snag-fixes/`, `rhythm-filters/`) are history. That includes snag-fixes' "Pass mark on an Editions row".
- `playgrounds.json` keeps the Editions rig's entry, which is history.
- **Rigs.** `home-product-hero`, `home-how` and `authorize-landing` loaded `gs-editions.jsx` without needing it. Their tag is removed so they still load. Three rigs depend on the page itself and will no longer work: `docs/specs/editions/playground/`, `docs/specs/plays-and-editions/playground/` and `docs/specs/connect-and-prompts/playground/` (it calls `edGo`). They are superseded. Archiving them is your call.

## Not built or unresolved
- `gs-puzzles-library.jsx` still tells a free Daily Word player "Replaying earlier editions comes with the Pass." The sample data now says Word's can't be replayed at all, so the line is untrue for Word. I didn't change it, because the brief leaves that copy alone. It needs a decision once the specs set which games allow earlier editions.
- The Pass page's "Replay earlier editions" row has the same tension.
- Search loads the results part on every keystroke, as filters do.

## Next
1. Joe walks QA "History is the one list" at 390 and 1280px, and rules on the four open items above.
2. Decide the Daily Word replay line and the archive of the three dead rigs.
3. Delete anything unreferenced in `uploads/` at session end.
