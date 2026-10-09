---
date: '2026-10-09'
topic: 'games-and-library'
status: 'in-progress'
type: 'exploration'
---

# Handoff: games-and-library, round 2 (options 4 to 15)

## Current Focus

Round 2 is built and waiting for Joe's review. He tries the four studies and reacts. Nothing is ratified, and no recommendation has been given; Joe asked for ideation first and opinions later. Next: take his feedback on each study, then put one decision to him per turn.

## Task(s)

**Why round 2 exists.** Joe reviewed round 1 (options 1 to 3, `handoff-2026-10-09-games-and-library-playground.md`). What he said:
- The main miss was that Games was meant to be a **storefront**. None of options 1 to 3 is a storefront. Option 1 reads like a library. Option 2 is better, and he likes its name and filter.
- The round-1 prompt asked for ideation on the words "Games" and "Library". That never happened.
- Signed in, Home was only made unclickable. He wants real ideas for the signed-in vs signed-out header and Home ("big brain" welcome, no new services preferred).
- He likes the Library list. It may need covers. He wants three ideas, not one fix.
- He wants options with costs, not a fix.
- Out of scope this round: the "How it works" top-bar item, which has no route ("don't worry about it"), whether Home should list every game (an open thought), and the seed games feeling invented.
- Smaller notes: multi-select filters would be nice but may be redundant. "Find a game" wrapping the filter in the search felt strange.

**Built: four studies, three options each.** The current pick in every study applies at the same time, so they combine.
- **Storefront** (Games page, same signed in and out):
  - 4 Shop window: a feature, Just added, Free to play, the Pass band, then a row per kind.
  - 5 Cover wall: two picks, then a wall of cover tiles with multi-select kind and Free chips. The Pass appears as a tile.
  - 6 What's out now: Out today and Out this week side by side, Just added, the Pass band, then an A to Z list.
- **Names:**
  - now: Games and Library.
  - 7 Store and Library.
  - 8 Discover and Play.
  - 9 Games and Record: Record absorbs History, which leaves the bar.
- **Signed in** (header, logo target and Home):
  - 10 A Today page: Carry on, Your streak, Out today, Out this week and Just added. Nav: Today, Library, Games, History.
  - 11 Library is home: no Home. The logo opens the Library, which gains a Ready to play box. Nav: Library, Games, History.
  - 12 Say it to your AI: Home lists a line to say to your AI for each thing ready now, with Copy. It asks you to connect first if you haven't. Nav: Games, Library, History.
- **Library covers:**
  - 13 Rows with covers.
  - 14 Cover grid.
  - 15 Played lately on top: three big covers above the plain `DS.ListRow` list.

Signed out, the header and Home are unchanged in every option.

## Joe's review (2026-10-09, in progress)

Feedback only. Nothing here is ratified.

**Storefront, option 4 (Shop window):** a great start.
- Likes: Just added; "Free to play" as a heading (wants it kept); the Pass band and its "What's included" link. The Pass description is wrong, to fix later.
- At the rig's screen size you can't see much of the page at once.
- Feels like block after block. Needs more mindful arrangement; rows may still be fine. Wait for the other options before acting.
- **Search is missing, and it's mandatory.** The storefront needs a way to navigate the games without scrolling to the bottom (Steam is the reference). It must not get in the way of the Library.

**Storefront, option 5 (Cover wall):** loves it, "that storefront".
- Likes: the two picks at the top (more elegant); the wall of every game; the kind and Free chips, and that they unclick.
- The wall's heading reads as an invented word. "All games" is better.
- No search. Wants search next to the chips.
- The Pass as a tile ("Every game here comes with the Pass. What's included") is fine.
- Misses a free-to-play section. But free would carry a lot of weight if it moved to the front.
- Feels something is still missing; couldn't name it.

**Storefront, option 6 (What's out now):**
- Dislikes "Out today" and "Out this week". The framing is off: the editions are released daily and weekly, and the labels don't say that well.
- Doesn't want effort spent on "coming soon". Nothing is planned beyond "a collection of games".
- Likes the Free chip on cards.
- Dislikes the A to Z list, which would need heavy pagination.

**Names:** loves "Discover" for the storefront. Wants **Discover and Library**: option 8's Discover, with Library kept instead of Play. Didn't weigh 7 or 9. He saw "Today" and "Play" in the bar without knowing where they came from (Today is signed-in option 10; Play is option 8). The combined picks confused him.

**Library covers: 13 (rows with covers), picked by Joe 2026-10-09.** It is named Library, not Play. He likes all three. The pick depends on the storefront: 14 would echo option 5's cover wall, and the Library should read as a list.

**Decided by Joe, 2026-10-09:** for now, when you're signed in, Home (the logo) takes you to Discover, and Discover comes first in the top bar. How History is handled is still open.

**Signed in, option 10 (Today):** reads it as a player profile. Interesting, but he doesn't yet know what it should say, or whether it belongs on a Today tab or on Home. He's thinking about merging it with History.

**Signed in, option 11 (Library is home):** reads it as the logo always opening one tab. Likes how clear that is. Thinks the logo should probably open Discover rather than the Library.

**Signed in, option 12:** its purpose wasn't clear to him. He asked whether it was install instructions. Once 12 was explained, he said it is essentially install instructions.

## Critical References

- `CLAUDE.md`: the ratification rule (present, recommend only when asked, wait); chat limits (~150 words, one decision, emoji last line).
- `skills/build-playground/SKILL.md`: rig rules.
- Round 1 handoff, for its settled limits: a card opens the product page; pages are the same signed in and out; no "buy", "install", "owned" or "your games".

## Recent changes

- **Round 4 (2026-10-09):** `round-4.html` + `pg-games-library-4.jsx` (also loads `-3` for its tile). Seven Discover options:
  - 16 The wall, tidied
  - 17 Search first
  - 18 Filter rail
  - 19 Free, then the Pass
  - 20 Kind tabs
  - 21 One mixed wall
  - 22 Short page plus an All games page with order and numbered pages
  
  Every option has search, Free first in the chips, "Learning" as a kind, and hover on covers, titles, chips and tabs. The covers' hover is playground-only; the app has none yet. Rig key `pg_games_library_v4`. Checked at about 920px only.
- Round 3 was too thin: A and B differed by one row. Joe's verdict: not enough ideas to react to.

- **Round 3 (2026-10-09):** `round-3.html` + `pg-games-library-3.jsx`. Only Discover is in play: A is option 5 with search beside the chips, an "All games" heading and Free tags; B is A plus a Free to play row. It holds the names (Discover, Library) and Library 13 in memory only. Signed in, the logo opens Discover, and Discover comes first in the bar. Rig key `pg_games_library_v3`. Phone width isn't checked yet.

- `docs/specs/games-and-library/playground/round-2.html`: a copy of `index.html` in the same folder.
  - It adds a "round 2" CSS block (`.p2-*`) at the end of `<style>`. It raises `.gs-root` padding-bottom to 148px for the three-row strip.
  - It loads `pg-games-library-2.jsx` after `pg-games-library.jsx`.
- `docs/specs/games-and-library/playground/pg-games-library-2.jsx`: all round-2 code. It reuses round 1's seed, `PgCardRow`, `PgHead`, `pgOpen`, `pgOpenLib`, `pgMe`, `PgPlaceLib` and `PgLibCard`.
  - It overrides `GsTopBar`. The override is a copy of `app/gs-parts.jsx` `GsTopBar`, with the link list and logo per option.
  - It also overrides `GsHome` (signed in only; signed out mounts the app's own), `GsGames` and `GsDemoBar` (a three-row strip: Study, Option, View).
- `playgrounds.json`: a new top entry under `games-and-library`, "Round 2".
- `app/`: untouched.

## Learnings

- The Babel-compiled top-level `const`s become `var`, so `window.GsTopBar = …` before `main.jsx` replaces the app's top bar. Capture the original first (`P2_ORIG_HOME = GsHome`).
- Don't reuse `.lb-title` outside `.lb-row`. It carries `grid-area: title`, which threw the title out of the `.p2-erow` grid. Use `.p2-title` instead.
- The nested-entry "39 files not found" warning is the known false positive. It blocks the verifier, so check by hand. Desktop was checked at about 920px for every study. **Phone width is not checked.**
- Clearing `localStorage` from a screenshot step is blocked. Reset the rig key with `setItem` instead.

## Artifacts

- `docs/specs/games-and-library/playground/round-2.html`
- `docs/specs/games-and-library/playground/pg-games-library-2.jsx`
- `playgrounds.json`
- `localStorage` key `pg_games_library_v2`, reset to `{study:'store', store:'4', names:'now', home:'10', lib:'13', open:true}`.

## Action Items & Next Steps

1. Check at 390px: rows (`.p2-erow` collapses under 480px), the 12 Copy rows, the 14 grid, and the strip's three rows.
2. Take Joe's review study by study. Ask for one decision per turn, starting with the storefront.
3. Once picks are ratified, record them here with the date, then plan the build into `app/`. It needs a real `library` route; see round 1's Learnings.
4. Still open from round 1: the faded Pass row, and placeholder games missing from "More games".

## Other Notes

- Seed for this round, not decisions:
  - Derelict is the feature;
  - Just added is Harbour Master, The Scribe of Ur, The Barrow and Daily Cipher;
  - in progress (Pass) is The Barrow, level 2 of 5, and 36,000 Summers Ago;
  - the streak is 6 days.
- Copy is draft and unreviewed against the voice doc. The 12 lines ("Play today's …", "Carry on with …") and "Today" as a nav label are ideas, not proposals.
- Strip behaviour: picking a study goes to its surface. Signed in and Library switch a signed-out view to Pass and mark the AI as connected.
