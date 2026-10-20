# Handoff: Discover as a games hub (candidate build), 2026-10-15

## What was built, and where
A candidate build of Discover: the whole app with Discover rebuilt as a hub. The main build at `index.html` is unchanged.
- Entry: `docs/specs/1153-pass-upsell/candidate/discover-games-hub.html`. It loads the shared `app/` and three overlays in the same folder:
  - `cand-discover-games-hub-bridge.jsx`: the standing `KitCandidate` handle.
  - `cand-discover-games-hub-discover.jsx`: re-publishes `window.GsGames` (the `games` route) with the hub. Canon's page shell is repeated around the new body, because `DcBody` is file-scoped and cannot be re-published from outside.
  - `cand-discover-games-hub-aids.jsx`: the Config rows (wraps `window.ConfigExtra`), two player states (wraps `window.buildStates` and `window.kitResolveState`) and a QA walkthrough (pushed onto `KIT_QA`). These exist only on the candidate's page.
- Candidate-only CSS: the last `<style>` block in the entry, with `cgh-` classes.
- Launcher: `playgrounds.html`, ticket "Discover as a games hub", marked as a candidate.
- Nothing under `_ds/` or `app/` was edited. Home and every other card surface keep the Pass tag as they are.

## How to reach it
Open the launcher, choose the ticket "Discover as a games hub", then open the candidate.
- **States:** press the list button on the pill at the bottom right (States), then under Screens choose:
  - Signed out: "6. Discover, signed out"
  - Free, nothing played: "6. Discover hub, free account, nothing played"
  - Free, every first part played: "6. Discover hub, free account, every first part played"
  - Pass holder: "6. Discover, with the Pass"
- **QA:** press the tick on the pill. "Discover as a games hub (candidate)" walks the four states.
- **Variations:** press the gear on the pill (Config). The first section is "Discover as a games hub (candidate)": rows A to G, then "Back to the defaults". Canon's rows follow below. "Free, nothing played" is canon's own row too (Account: New, nothing played).

## Yours to decide: what I chose
- **The lock is inert.** It is an image named "Pass only". The tile's own press, its title stretched over the tile, still opens the game page, and the page says what comes with the Pass. Why: a square tile at 140 to 160 px has room for one press target. A second one inside it would need a 44 px target on the art, and pressing it would go to the Pass page instead of the game. Canon's Pass tag was a button because it sat in the tag row, outside the art.
- **Card layout.** The design-system `GameTile` is unchanged. Under it, outside the tile so the tile's stretched press does not cover them, come: the carry-over tags when switched on, then the state line (16 px, text colour, one step above the tile's muted 14 px genre), then the play door (a full-width secondary button), then the second door (a text link). They sit 8 px apart, 12 px below the tile. Tiles use canon's `mcp-gwall`: two across at 390 px, more across on desktop.
- **Clear** sits under the chips while a search or chip is on. Discover's heading "All games", where Clear lived, no longer exists.

## Calls the brief set, not ruled by the owner
- Free chips are gone from hub tiles. Switch: G "Free chips on tiles". (Ruled for Home cards, not for Discover.)
- No mark on a part-free game. Switch: G "Part-free mark". (Ruled for Home cards, not for Discover.)
- Daily Groups is not shown.
- The picks, "Just added", "Free to play" and the Pass band are gone; the groups do their job.
- Doors carry no lock and no Pass word.

## Calls I made that need your eye
1. **No state line where Library says "Pass only".** That covers 36,000 Summers Ago for a free player and, for a player whose Pass ended, Casebook and Delve as well. "Pass only" is a Pass mark, and the clean-list ruling keeps Pass marks off this list.
2. **The Barrow still reads "Chapter 1 is ready", with its play door, in "every first part played".** Canon has no Barrow play, so Library always says that, and the brief says to invent no line Library lacks. Showing Chapter 1 as done would need a Barrow play in canon's data.
3. **Play door only on a "ready" line.** "In progress" gets no door.
4. **Genre grouping (B2) has a fourth group, Learning.** In canon, 36,000 Summers Ago's genre is Learning, and canon's chips already include Learning. The brief named three groups.
5. **The Barrow's C1 door reads "Every chapter"**, as the brief says. Canon's own link on its library page reads "All chapters" (`gs-data.jsx`, `edLink`).
6. **Axis A shows nothing to a Pass holder**, as canon's band did.
7. **Shorter state lines (E2):** "Ready", "Done", "In progress", "Chapter 1 ready".
8. **A "Play" button on its own (F2)** is announced as "Play" plus the game's name. Second doors are announced with the game's name too, because Daily Mystery and Casebook both have "Every case".

## What I would pick
- A: 2, the link alone. It names the Pass without claiming what it holds.
- B: 1, rhythm. It answers "what is new for me today or this week".
- C: 1 for the dailies. For the weekly and chapter games, the door sells editions nobody can play yet (the open question below), so my pick is 3 until that is settled.
- D: off, per the clean-list ruling. If it goes on, treatment 1: it says least and stays clear of the art.
- E: 1. It agrees with Library word for word.
- F: 1. "Play" alone does not say what you would be playing.
- G: off and none.

## Open, for the owner
- The weekly and chapter doors (Escape, Casebook, Delve, Barrow) lead to earlier editions that no one can play yet. Axis C3 removes them. The dailies are canon's existing links.

## Before integration
- The design system needs a lock slot on the art for `GameTile`, `GameCard` and `GamePick`. This build places the lock from the overlay.
- `GameTile` needs a slot under the tile for the state line and doors. Today they sit outside the component, so its stretched title press does not cover them.

## Next
Owner review of the axes and the eight calls above. Then merge or throw away per `skills/candidate-build/SKILL.md`. No `CHANGELOG.md` entry.
