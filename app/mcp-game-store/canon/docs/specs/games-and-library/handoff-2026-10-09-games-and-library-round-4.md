---
date: '2026-10-09'
topic: 'games-and-library'
status: 'in-progress'
type: 'exploration'
---

# Handoff: games-and-library, round 4 (Discover options 16 to 22)

## Current Focus

Round 4 is built and open for Joe's review: `docs/specs/games-and-library/playground/round-4.html`. It holds seven Discover (storefront) options, and Discover is the only open study. Next: take his reaction to each option, then put one decision to him per turn. Don't recommend unless he asks.

Background only: signed-in Home and History are parked. Joe is discussing them with another agent, using the prompt given in chat. Don't build them until he brings that back.

## Round 4 review (Joe, 2026-10-09)

- **Discover is option 16**, with three changes: Free is the last chip, the tiles carry no Free tag (Joe: the filter stays, the tag goes), and the wall has no Pass tile ("Every game here comes with the Pass" goes). Picks on top are ours to choose; Free to play, then the Pass band, then All games.
- Built in the playground (16) and in `app/`: `app/gs-discover.jsx` (Discover on route `games`, Library on new route `library`, option 13), top bar Discover / Library / History with the dropdowns removed, "Learning" as the kind, hover rules in `index.html`. The app's picks are Casebook and Daily Word, since the playground's picks are placeholder games.
- Just added sits on Discover, under the picks (Joe). App seed: 36,000 Summers Ago, Casebook, Delve, Escape.

## Task(s)

**Settled (by Joe, 2026-10-09):**
- **Library is option 13** (rows with covers), named Library. 14 would echo Discover's cover wall, and the Library should read as a list.
- **Signed in, for now:** Home (the logo) takes you to Discover, and Discover comes first in the top bar. History is still open.
- **Names:** Joe wants **Discover and Library** ("I love having the concept of Discover and Library"). Confirm it in words before writing it into `app/`.

**Joe's notes on Discover so far** (full notes on 4 to 6 are in `handoff-2026-10-09-games-and-library-round-2.md` § Joe's review):
- 5 (cover wall) is the storefront he loves: the two picks, the wall, multi-select chips that unclick.
- Search is mandatory. It must let you navigate without scrolling to the bottom (Steam is the reference), and it must not get in the Library's way.
- Wanted: "All games", not "Every game". The Free tag on cards (from 6). "Free to play" as a heading (from 4). The Pass band and "What's included" (from 4, "love").
- Keep the Pass tile in the wall ("Every game here comes with the Pass"). Joe corrected a misreading: it does not go.
- Put the Pass band beneath the Free to play row.
- The chip is "Learning", not "Learning activity".
- Every clickable thing needs a hover, covers included.
- Out: "Out today" / "Out this week", coming soon, the A to Z list (pagination).
- Open: whether a Free to play row is worth having at all. "Block after block" was the worry with 4.
- **Unconfirmed:** "move 3 to the start", said of All games. It was read as "Free first in the chips" and built that way. Ask him.

**Round 3** (`round-3.html`): A/B differed by one row. Joe: not enough ideas to react to; "a proper playground" was wanted. Superseded by round 4. Its tile (`P3Tile`) is still used.

**Round 4, built.** Each option is the real app; the strip's Discover row switches between them. Stance and cost are behind Why. All seven have search, Free first in the chips, Learning, and hover.
- 16 The wall, tidied: picks, Free to play row, Pass band, then All games with search beside the chips. The Pass tile stays.
- 17 Search first: search sits beside the H1 and the chips under it. Searching or picking a chip turns the page into results.
- 18 Filter rail: on a wide screen, search and the chips sit in a column beside the wall, with the Pass card under them. On a phone they come first.
- 19 Free, then the Pass: no picks. Free to play wall, the Pass band, then a "With the Pass" wall.
- 20 Kind tabs: single-select tabs, Free among them. The All tab is the full front page.
- 21 One mixed wall: the picks are double-width tiles inside the wall, and the Pass band spans a row after the first rows.
- 22 Short page: picks, Just added, Free to play, Pass band, five tiles and "See all games". The All games page has search, chips, Order (Newest / A to Z) and numbered pages of 8. Its route is `games` + `{ all: true, q }`.

## Critical References

- `CLAUDE.md`: the ratification rule; chat at most ~150 words, one decision, emoji on the last line; don't be swayed by frustration.
- `skills/build-playground/SKILL.md`: "you ideate and commit; they react". A round must carry real, divergent ideas, each with a number, name, stance and cost. Round 3 broke this.
- Round 1 handoff, for its settled limits: a card opens the product page; pages are the same signed in and out; no "buy", "install", "owned" or "your games".

## Recent changes

- `docs/specs/games-and-library/playground/round-4.html`: a copy of `round-3.html`. It loads `pg-games-library-2.jsx`, `-3.jsx`, then `-4.jsx`, and adds a "round 4" CSS block (`.p4-*`) at the end of `<style>`. That block carries the hover rules: cover outline plus a 1.04 art zoom, a title underline, and chip, tab and page-number fills, under `@media (hover:hover)`, with reduced motion respected.
- `docs/specs/games-and-library/playground/pg-games-library-4.jsx`: all of round 4.
  - It sets round 2's state in memory only (`p2 = { names:'8', home:'none', lib:'13' }`, and `P2_NAMES['8']` gives Discover/Library), so round 2's saved picks survive.
  - It renames `LEARNING ACTIVITY` to `LEARNING` in `GS_GAMES` and `PG_CATS` at load.
  - It overrides `GsGames`, `GsHome` (signed in, it redirects to Discover) and `GsDemoBar`.
- `pg-games-library-3.jsx` and `round-3.html`: round 3, kept for the record.
- `playgrounds.json`: Round 4 and Round 3 entries added at the top of `games-and-library`.
- `handoff-2026-10-09-games-and-library-round-2.md`: Joe's review notes, and the round 3 and 4 entries under Recent changes.
- `app/`: untouched.

## Learnings

- **Round 3's failure:** two options that differed by one block. When Joe asks for "another go", build a full divergent set. Don't propose a plan and then ask permission. The skill says to own the ideation.
- Joe reads the strip literally. He thought round 4 existed because the plan was described. Say clearly when something is a plan and not yet built.
- Hover belongs to the product. The app's `.gs-coverbtn` and `.gs-titlebtn` have only `:active`. When Discover lands in `app/`, the hover rules in `round-4.html` need to move into the app's styles, and probably into the design system for covers. That's for the kit, so ask first.
- `DS.Card` with `onClick` renders a `<button>`. `GsTagList`'s Pass tag is itself a button, so a whole-card link would nest buttons. That's why picks keep a separate cover button and title button.
- Still true: the nested-entry "files not found" warning is a false positive (count the four `../` in `<base>`), and `localStorage` resets use `setItem`.

## Artifacts

- `docs/specs/games-and-library/playground/round-4.html`, `pg-games-library-4.jsx`
- `docs/specs/games-and-library/playground/round-3.html`, `pg-games-library-3.jsx`
- `playgrounds.json`
- `localStorage` key `pg_games_library_v4`, reset to `{opt:'16', open:true}`.

## Action Items & Next Steps

1. Take Joe's review of 16 to 22. Log it in this file, then ask one decision per turn.
2. Ask what "move 3 to the start" meant.
3. Check round 4 at 390px: 17/20's head row, 18's rail order, 21's big tiles in two columns, 22's All games page, and the two-row strip.
4. Once he brings back the parked signed-in Home / History thread, open it as its own study.
5. When Discover is ratified, plan the `app/` build: the Discover route and name, the Library route (see round 1's Learnings), hover in app styles, and "Learning" as the kind label.
6. Still open from earlier rounds: the Pass band's copy is wrong (Joe: fix later); the faded Pass row; placeholder games missing from "More games".

## Other Notes

- The seed is unchanged from round 2:
  - Derelict is the feature, and Daily Cipher the free pick.
  - Just added is Harbour Master, The Scribe of Ur, The Barrow and Daily Cipher.
  - For 22, Newest order is Just added first, then round 1's order.
  - About 12 games, so 22 shows two pages at 8 per page.
- Copy is draft and unreviewed against the voice doc: "You can play these with a free account.", "With the Pass", "No game matches that.", and the Pass band line.
- Joe was frustrated by round 3. The fix was a full set of seven options, not a change of position on anything already ratified.
