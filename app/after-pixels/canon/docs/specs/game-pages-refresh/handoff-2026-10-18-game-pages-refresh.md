# Handoff — game pages refresh (Casebook, Escape, Delve, The Barrow of Hollowmere)

2026-10-18. Built into `app/` from the delta brief "Casebook, Escape, Delve and The Barrow of Hollowmere, as they now are". Content only: layout, components and the session-page structure are as they were, except where noted under "Layout touched".

Ratified by the user in chat, 2026-10-18: the Escape copy (with two changes: pitch paragraph 1 ends "…and a lock may open onto a second room.", since the exit always escapes and a passage lock opens the second room; object names are lower-case mid-sentence in session rows), the Barrow Chapter 2 card and the Chapter 3 line. Everything else under "Yours to decide" is my call, and everything under "Set by this brief" is the brief's call; neither is ratified.

## Where it lives

- Seed: `app/gs-data.jsx` (`GS_DV_WON`, `GS_DV_LIVE`, `GS_ES1`, `GS_ES1_LINES`, `GS_CB_REC`, `gsCbLines`, `gsLink`, `GS_BARROW_CREDIT`; sessions `delve`, `delve-live`, `escape-week`, `escape-live`, `casebook`).
- Casebook: `gs-casebook-data.jsx` (one case, id `gull`), `gs-casebook.jsx`.
- Escape: `PZ.escape` in `gs-puzzles-library.jsx` (one room), product copy in `gs-game.jsx`, chats in `gs-chats.jsx`.
- Delve: `gs-delve-library.jsx` (one run, `DV_RUN1`), product copy in `gs-game.jsx`.
- The Barrow: `gs-barrow-library.jsx` (`bwEds`, two chapters), journal session `gs-pu-barrow-ch1` in `gs-pass-store.jsx`.
- Shared: `gs-history.jsx` (edList, phVisible, Barrow play in the log), `gs-editions.jsx` (row titles, no invented lines), `gs-pass-library.jsx` (free cards, rows), `gs-discover.jsx`, `gs-pass-discover.jsx`, `gs-session.jsx` (share text, tracks, credit), `gs-player.jsx` (library strap, old Delve fallback seed), `gs-connect.jsx` (Barrow edition for a session).
- Aids: `states.jsx`, `qa.jsx`, `gs-config.jsx`.

## Staged states (ids unchanged, none added)

- `session-casebook`, `library-casebook-case`, `loading-page-library-case`: Case 1 (`sid: 'gull'`).
- `edition-casebook-done`: Case 1 in Every case, played.
- `session-delve-past`: session `delve` (run 1 won, Bryn). Relabelled.
- `session-delve-unfinished`: opens `delve-live` (run 1 in progress, Wren). With one run no Delve week can have ended unfinished, so this state cannot show an ended week. Config "Ended unfinished" now reads "A day" and covers Daily Groups only.
- Relabelled: `library-casebook-in-progress`, `library-delve-free-in-progress`, `history-unfinished`, the "Ended unfinished" note, QA notes (iffy-decisions, pass-ended-every-case, elegance-fixes, rhythm-filters).
- Every registered state was opened by script after the build: no console error, none blank.

## Yours to decide — what I chose

1. **Escape copy.** Pitch (three paragraphs), play-box step 2 "Play this week’s room. Every lock has three hints if you need them.", server line "Decides what each move does and keeps secret what the room hasn’t shown. It records wrong tries, hints and your time.", library strap "See every room you got out of, with your time against par, hints and wrong tries." Chats: the No. 1 opening; the workbench examined and a first hint (facts block "Hint 1 of 3"); the oak door opened, result in the share card's words. No answer, and no object before it is shown. Why: carries every listed fact, voice guide applied.
2. **Barrow Chapter 2 now card.** A QUEST · "The chalice is in the abbey" · "Bring the Chalice of St. Ebba home from the drowned abbey, and stop whenever you like." Shown to a Pass holder once Chapter 1 is finished. Why: mirrors Chapter 1's card, uses only the authored quest.
3. **Chapter 3 card line.** "The next chapter is on its way." Invents nothing.
4. **Licence credit.** On the Barrow product page, under its chat pictures, and at the foot of the Barrow session page (the journal). Why: those are the two places that present rules output.
5. **Try / Set rows without the answer.** "Try an answer (4 letters) on the workbench drawer", "Try an answer (4 digits) on the cabinet lock", "Set the clock hands to an hour and a minute" (object names lower-case mid-sentence, ratified). Why: uses the lock's own `takes`.
6. **Discover pick.** Label ONE CASE only; the card's blurb already says the rest.
7. **Delve run-entry line.** No line on the editions row (the premise could stand there unaltered; I left it off to keep the row like the others).

## Set by this brief — values built

1. Today stays Tuesday 6 October. Escape and Delve: No. 1 current, "Next room/run: Monday 12 October". Casebook and Barrow print no date anywhere (editions rows and panel suppress it). Sample plays: Casebook and Delve Monday 5 October, Escape and the Barrow Tuesday 6 October.
2. Casebook "25–40 min".
3. Escape "About 30 min" (gs-data, gs-pass-store, editions panel).
4. Escape headline "Escaped in 28 min, under par"; figures "28 min, under par", "1 hint", "2 wrong tries".
5. Edition rows `Word N · Title` for the four games.
6. A lost case reads "Wrong accusation" (`GS_RESULT.casebook`, share "❌ wrong accusation"). No state added.
7. Casebook keeps six sample achievements plus two counts; "Four weeks in a row" and "Three solved in a row" cut. Case 1 earns first lie, solved, eleven turns, every lie, every room. Escape and Delve: the five specced. Escape run earns Beat the Clock only; Delve run Hot Streak only. Barrow: three left (two reworded to the authored world: "Into the barrow", "The wight’s crypt"; seal, ring, five levels, sheep and loot cut).
8. Deployed copy over voice.md — departures built: share-card emoji (all four); em dash in the Chapter 2 title; long Delve and Barrow pitch sentences; place names and story names on product pages and chats; verbless labels and lines ("Several sessions", "One run every week", "Mist, old stone and honest dice"); counts ("Two chapters", "five rooms", "4 ways out"); the Barrow heading "A campaign in two chapters".
9. No typed answer printed (see 5 above).
10. "A campaign in two chapters" sits on the play box beside the Chapter 3 coming-soon card.
11. Journal line "Took the Bell of Hollowmere." (the engine doubles "the The").

## Layout touched

- Casebook's library page lost its streak card, so its case card (and the free first-case card and Needs the Pass card) spans the row, as the Barrow's chapter card already did.
- Delve's session tracks card: "Rooms reached n/5" and "Threat n/12" (was Progress n/6, Threat n/6). `GsTrack` takes `max`.

## Date conflicts left (Set 1)

- Pass-ended staging (ended 18 September) now meets plays dated 5–6 October: the lapsed player's Casebook, Delve and Barrow plays are hidden from History (dated after the end), while their library cards still read done; earned achievements read "Earned 5 October · Frozen".
- Lapsed sessions keep `lapsedDate` (13 and 14 September), which predates every game's start.

## Not built / open

- History shows the Barrow's Chapter 1 play only when Config "The Barrow, chapter 1" is Finished (it was absent before).
- The home hero and its "A NEW CASE EVERY WEEK" label, and Casebook's chat pictures, are untouched.
- The editions panel still labels weekly editions "WEEK OF 5 OCTOBER".

## Next

Owner review of the Escape copy and the Barrow Chapter 2 card; decide whether the lapsed staging should move its sample plays before 18 September.
