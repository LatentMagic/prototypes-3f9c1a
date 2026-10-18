---
date: '2026-10-18'
topic: 'audit-fixes'
status: 'in-progress'
type: 'implementation'
---

# Handoff: audit fixes (one play record, stale product block, descoped cards)

Brief: the "audit fixes" delta pasted into chat on 2026-10-18, after elegance-fixes and no-replay. Everything is in `app/`, `index.html`, `CLAUDE.md` and `_ds/`. No candidate build, no rig. QA entry: **Audit fixes, 18 October: one play record** (`app/qa.jsx`, key `audit-fixes`). Delete it once signed off.

## Current focus

Built; the owner ruled on every open call on 2026-10-18 (below). Waiting for QA sign-off.

## Ratified (owner, 2026-10-18)

- Library row for a Pass-ended player: the latest play's own status and date; a game whose next play needs the Pass reads "Pass only" with its last-play date.
- A Summers Ago day with no ending reads "Not finished"; "Days played" counts finished days (15 of 18).
- The start-over prompt shows only where the player can play the chapter (MCPG-023 AF-09, MCPG-029 AF-13).
- The kept-session form and its line, "This session is kept. Carrying it on comes with the Pass." (MCPG-029 AF-03).
- An achievement is earned by the first play that meets it (MCPG-032 BF-01). A chapter started over earns nothing: `phAch` skips any play marked `restart` (no restart play is seeded).
- The sample conditions below stand as sample data.
- "k of n earned" counts the whole list shown, earned-and-locked included. "· Frozen" wording stays as it is.
- Coming-soon: the Barrow card's line is the game's blurb and CHAPTER 3 now sits in `GS_SOON` in `gs-data.jsx`; the overlay in `gs-pass-store.jsx` is gone.
- Escape step 2: only the room words changed; the hints sentence stays.
- History rows: every row shows cover and game name; left as built.
- `CHANGELOG.md`: one entry for the descope. None for the play record.

## Design system

`_ds/` compared file by file with the design-system project (`/projects/ef1abd5b-…/`). Bundle, manifest, tokens, `components.css` and `styles.css` were already identical (the build cache-busted as `ds-2026-10-17`). Only `_adherence.oxlintrc.json` differed; the project's copy was brought in. The three unreferenced `.next` files (`_ds_bundle.next.js`, `components/components.next.css`, `tokens/colors.next.css`) are deleted.

## What changed, and where

1. **One play record** (`gs-history.jsx`). Every play carries its source record (`src`) and session id. `phVisible(gs)` is the one source: Pass holder, every play; free or Pass ended, the free games, a free first edition as its record stands (shown after the Pass ended too, since it is free), and Pass plays only from before the Pass ended. `phAch(gs, gid, items, streak)` dates every achievement by the first play that meets its condition (`by`, `count`, or the streak). `phWhen` is the one date form for rows ("Today", "5 Oct").
   - Typed dates gone: `got`/`gotFree` on `CB_ACH`, `DV_ACH`, `HG_ACH`, `PZ.*.ach`, `BW_ACH`; `cur` flags; `cbAchLive`, `dvAchLive`, `phFirstAch`, `lbNoAch`, `endedHave`, `lapsedDate` (session dates now come only from the log).
   - Strips: daily games (`pzRun`), Delve (`dvRun`) and Summers Ago (`hgWeeks`) read the log. A Pass-ended player's Pass-only days after 18 Sep are frozen through `lbFrozen` (Daily Groups now included).
   - Library rows (`cprLibRow`, `gs-pass-library.jsx`): status and date from the latest play in the record. Canon's `gsLibRow` in `gs-discover.jsx` is gone.
   - One count: `lbAchEarned(list)` feeds the Needs the Pass foot and the "k of n earned" header; n is the list shown (earned-and-locked included).
   - Groups, free, never had: the never-had Needs the Pass card alone (as Summers Ago's), achievements as a total to earn.
   - Summers Ago: a day with no ending reads "Not finished" (`GS_RESULT.hunter`). The head card reads the latest day in the record; the "You left off… Carry on" line and `HG_LEFT` are gone.
   - The Barrow: chapter 1 is one play in the log (`bw1`, `BW_REC1`); the session (journal) moved to `gs-barrow-library.jsx` with its date from the log; `bwEds` reads the record; Your chapters is the ordinary `LbRecent`; the Needs the Pass chapter count comes from the record (`at: 'CHAPTER 2'` gone).
2. **Product block and data**: `CLAUDE.md` "Who plays what" replaced as written, earlier-editions sentence kept after the Barrow line. `gs-data.jsx`: Groups `free: false`, Pass tag; Escape `free: false`, `first: true`, FIRST tag; `GS_TODAY_PLAYED.free` holds Word and Mystery only. `gs-game.jsx`: Groups and Escape play boxes folded in. Overlays and the "restored" comment deleted from `gs-pass-store.jsx`. Escape step 2 reads "Play the first room." (the built step read "Play this week’s room. Every lock has three hints…", not "…from the locked door…"; only the room words changed).
3. **Descoped**: Account's Your data card (`GsDataCopy`) and Notifications card; `gs-push.jsx`, its script tag, all its CSS (banner, card, switch, browser dialog); push state in `main.jsx`; the Notifications Config rows; the `Notifications` states group (13 ids); the `notifications` QA entry and the notification steps in `final-audit-snags`. In git at `c91b661`.
4. **One form per thing**: play box "TODAY’S WORD · #212"; the editions panel's "See in History" is the full-width secondary button at the end of every played panel, after the prompt and Copy; the editions list's empty search/filter is "Nothing matches that." and Clear all, outside the box. History rows already named their game and cover; left as they were.
5. **Controls only where they work**: the panel's start-over shows only when the player can play the chapter; otherwise the played line, the Pass line and Get the Pass. Session page: a player without the Pass gets no Play or Start over on a Pass-only session; an unfinished one shows "This session is kept. Carrying it on comes with the Pass." with Get the Pass.
6. **Tidy**: deleted `CbFirst`, `BwLibrary` (+ `BwChapter`), `CprBwRecent`; `DvFirst` did not exist. Unread exports deleted: `DL_ROUTES`, `CB_NEXT`, `CB_STREAK_N`, `CB_ENDED`, `gsMarks`, `GS_ROLLS`, `gsScrollToId`, `LbStatus`, `GsUp`, `GsResultTag` (with `gs-puzzles.jsx`), `GsShareCard`, plus `LbPassOffer`, `cbHist`, `dvHist`, `cbAchFor`, `phPlayedOn` left unread by this work. The hidden "Your streak comes with the Pass." line and its CSS are gone. `rpRow`/`rpTone`/`rpRecent`/`__rp`/`RpPages` are `phRow`/`phTone`/`phRecent`/`__dated`/`PhPages` (CSS classes `rp-pg*` left). `no-replay` QA entry deleted.

## States

- Collapsed (mechanism: `aliases: [...]` on the kept entry; the resolver, palette, QA and `window.KIT_STATES` accept every alias). 17 groups remain after the Notifications removal (15 pairs, 2 triples): casebook-free ← fp-product-casebook-free; hunter-free ← fp-product-hunter-free; games ← pass-holder; library ← pur-pass-holder; session-delve ← session-delve-past; session-casebook ← library-casebook-case; pass-free ← pass-page-never-subscribed; library-casebook-free-in-progress ← pur-first-in-progress; library-word-free ← fp-word-library-free; pur-first-done ← library-casebook-no-pass, fp-casebook-library-free; pur-pass-ended ← library-casebook-pass-ended, fp-casebook-library-lapsed; pur-discover-free ← free-plan; library-escape-free ← fp-escape-library-free; library-delve-no-pass ← fp-delve-library-free; library-delve-pass-ended ← fp-delve-library-lapsed; library-hunter-pass-ended ← fp-hunter-library-lapsed; account-email ← pass-card-none.
- Added: `session-kept-pass-ended`, `edition-barrow-done`, `edition-barrow-done-free`, `edition-delve-in-progress`, `editions-word-free`, `library-barrow-not-played`.
- Changed: `library-barrow` and `session-barrow` now stage chapter 1 finished (one record).
- Removed: the 13 `notifications-*` / `push-*` ids.

## Set by this brief (all ratified 2026-10-18, above)

- A Summers Ago day with no ending reads "Not finished". My reading: it is the app's existing unfinished status, and a day with no ending is a play that stopped, not a result.
- The start-over prompt shows only where the player can play that chapter.
- The kept-session form for a Pass-ended player's unfinished Pass-only session.
- An achievement whose condition a play meets is earned, dated by the first such play.

## What I chose

- **Library row for a Pass-ended player** with free and Pass plays: the latest play gives the date; the line says what it left ("Free case done", "In progress"). A game whose next play needs the Pass reads "Pass only" with its last-play date ("17 Sep").
- **The Barrow's record**: one log play per chapter (`bw1` now), shown while `cprFirstState` is done; its `src` says what it earned.
- **Aliases**: see States.
- **Achievement conditions** where the seed holds no fact (sample data, accepted 2026-10-18):
  - `HG_EARNS` (`gs-hunter-library.jsx`): day index 6 Fed the Fire; 7 One of Us at Dusk, Walked with the Hunters; 9 Dug with Aunt; 10 Met at the Springs; 11 Home with Full Hands. All on or before 17 September.
  - `BW_REC1.earns` (`gs-barrow-library.jsx`): chapter 1 earned Into the barrow and The wight’s crypt.
  - `DV_DONE.streak = 5` (`gs-delve-library.jsx`): run 1's longest run of strong hits, from its share card; earns Hot Streak.
  - `CB_DONE.places = 4` (`gs-casebook-data.jsx`): the case's searchable places; four searched earns Every room searched.
  - Counted ones (Big Animals, Made Something, Hunt, Springs and Wall) count distinct day facts, so their numbers moved (for example Made Something 4 of 5).
- **`GS_SOON`** was cut by my own edit and rebuilt from the design system's copy of the app data; the owner confirmed it matches.

## Could not move onto the record, or not built

- Streak counts for Escape's Regular and Delve's Regular count finished plays, not weeks in a row (one edition each so far, so the numbers agree).
- Daily Word "Solved in two" and Mystery "no hints and no questions" read the session seeds; none qualifies except where the seed says so.
- A Pass-ended player with a played chapter that needs the Pass: no such play is seeded (no chapter 2 play), so that panel can't be staged.
- Not walked by hand at 320 and 1280px for every state.

## Left alone (Not touched)

"Frozen" wording everywhere it stands; `word-free`'s steps, Play and dialog; the in-progress warning; `GS_GAMES.delve.ed` and `GS_GAMES.groups.ed`; `.gs-copy`; ListRow `replay`; the one-Pass-per-line wording; container widths, the Needs the Pass foot and CardRow's subgrid; "LAST PLAYED" defaults; who starts over.

## Next

1. Walk the QA entry; sign off, then delete it.
