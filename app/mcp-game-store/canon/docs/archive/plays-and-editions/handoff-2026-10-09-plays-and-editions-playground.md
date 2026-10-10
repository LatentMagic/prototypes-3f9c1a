---
date: '2026-10-09'
topic: 'plays-and-editions'
status: 'awaiting-review'
type: 'exploration'
---

# Handoff: plays and editions playground

## Objective
Answer where a player finds everything a game has put out and everything they have played, and what each entry tells them and lets them do. Brief: the playground prompt of 2026-10-09 (Joe's statements in `_context/log.md`).

## What was built
`docs/specs/plays-and-editions/playground/index.html` (a copy of root `index.html` with `<base href="../../../../">`, the strip CSS from the Editions rig and the `.md-*` rules at the end of the `<style>`), plus `pg-plays.jsx`. It loads after `app/gs-editions.jsx` and overrides on `window` only: `GsEditions`, `GsHistory`, `GsGamePage`, `LbRecent`, `edGo`, `GsDemoBar`. `app/` is unchanged. State key `pg_plays_v1`. Listed in `playgrounds.json`.

Strip: Option 1 to 3 (Why gives the idea, cost and signed-out answer), Game, Go (1 Product page, 2 All editions, 3 Library game page, 4 History; 3 and 4 only signed in), View (signed out, no Pass, Pass). It boots on Daily Word's library game page with the Pass.

## The options
- **1 · A panel for each edition.** The Editions page is the game's one list, reached from the product page and from the library game page's card (which now lists the latest earlier editions, played or not, and its "All…" opens the Editions page, not History). A row opens a panel: the day, what the edition was, every play of it (each opens its session page), and Play or Play again. History is unchanged. Reach: Go 3, press a card row; or Go 2, press any row.
- **2 · History holds everything (the owner's lean).** No Editions page. History lists every edition of every game under the day it came out, played or not; replays sit beneath their edition, each opening its session page. Filters: Order, Show (Everything, Played, Not played), Game. It opens on Played for all games and on Everything when filtered to one game. "All editions" and the library card's "All…" open it filtered. A row opens your first play, or the prompt if not played. Play again is on the session page. Reach: Go 4, or Go 2.
- **3 · A page for every edition.** New route: the game's route with `{ page: 'edition', key }`. It shows the edition's name, day, marks, what it was, your result, Play or Play again, and Your plays (each opens its session page). The Editions page and the library card open it; History still opens session pages. Reach: Go 2 or 3, press a row.

## Signed-out visitor, per option
1. The same Editions list without results; the panel gives the prompt and "Sign in and every play of it is kept here."
2. "All editions" opens the same list for that game, titled All editions, without results, Show or Game.
3. The edition page is public: what it was and the prompt, no plays.

## Choices made on open items, and why
- **What an entry shows** (all three options): the day with its weekday, and one line on what the edition was. Daily Word, Groups and Mystery show their answer only once you've finished the edition ("The word was TORCH.", "You found …", "It was the gardener."); before that, nothing, since the answer is the puzzle. Casebook shows its suspects; Delve, the hero you went in as; Escape's title is already the room. Lines come from the seed sessions, so a row agrees with its record. Not ratified.
- **Filters**: kept the ratified Editions tools (search, order, Show) in 1 and 3; option 2 has Order, Show and Game, no search.
- **Panel kind** in 1: a panel (the list of plays can grow), so a bottom sheet on a phone.
- **Play again from a list**: 1 and 3 have it in the panel or page; 2 leaves it on the session page.
- **Copy** is draft: "Sign in and every play of it is kept here.", "You haven't played this one yet.", "Only your first finished play counts for your streak and your shared result.", "This edition comes with the Pass." Checked against `guidelines/voice.md`; not seen by the owner.

## Not built or unresolved
- Option 1 would drop History's one-game filter in a port; the rig leaves History as it is.
- The library card in 1 and 3 shows five rows and does not fill to the achievements card's height as `LbRecent` does.
- Option 3's session page keeps its back link to the library game page; it does not link back to the edition page.
- 36,000 Summers Ago has no editions: in option 2 its days appear in History as plays; in 1 and 3 nothing changes for it.
- Checked by load only; phone width and every view still need a pass.

## Next
1. Owner plays the three and picks or cuts. One question only: which option, or which parts of each.
2. Then refine the pick (entry line wording, filters), and only after ratification port into `app/`.
3. Delete unreferenced files in `uploads/` at session end.
