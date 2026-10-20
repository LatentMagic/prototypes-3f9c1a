# Handoff: Discover, tidied (candidate build), 2026-10-15

A candidate build of Discover. The rest of the app is canon, untouched. The main build at `index.html` is unchanged. Nothing here is accepted.

## Where it lives

- Entry: `docs/specs/1153-pass-upsell/candidate/discover-tidied.html`. Open it from `playgrounds.html` under "Discover, tidied", where it is marked as a candidate.
- `cand-discover-tidied-bridge.jsx` is the standing `KitCandidate` handle.
- `cand-discover-tidied-discover.jsx` re-publishes `window.GsGames` (the `games` route) and holds the candidate's settings store (`window.CandDT`).
- `cand-discover-tidied-aids.jsx` holds the Config rows, the two new states and the QA walk-through.
- Candidate-only CSS sits in the marked block at the end of the entry's `<head>`. The entry keeps its own storage key (`kit_discover-tidied_candidate`).
- No edits to `app/`, `_ds/` or any other surface. Home keeps its Pass tag, because `GsCard`, `GsPick` and `GsTile` are not re-published. Discover uses its own three card forms, built from the same design-system parts.

## How to reach things (clicks)

1. Open the candidate from the launcher. Sign in from the demo bar, or use a state.
2. **States** (the list glyph on the pill), under Screens:
   - "6. Discover, signed out" (canon)
   - "6. Discover, free account, nothing played" (new)
   - "6. Discover, free account, every first part played" (new; shows the note)
   - "6. Discover, with the Pass" (canon; no lock, no free row, no note, no Pass line)
3. **Config** (the settings glyph): the "Discover, tidied (candidate)" rows come first, A to I. Every row changes the page at once. "Back to the defaults" resets them.
4. **QA** (the check glyph): "Discover, tidied (candidate)" visits the four states, and its note lists the axis choices to step through in each.

The two new states, the Config rows and the QA entry exist only on the candidate's page.

## Yours to decide: what I chose

- **The lock is inert.** It has `pointer-events: none`, and a press anywhere on the card opens the game, whose page explains the Pass. Why: a second target on the art is where people press to open the game, so on touch it would send them to the Pass page by accident. An inert lock also has no touch-target floor to meet. Canon's Pass tag was a button. If the owner wants it pressable, the corner chip (D1) would need a 44px hit area.
- **Accessible name: "Pass only"** (`role="img"`), the owner's wording elsewhere. In D2 and D3 the visible words are hidden from screen readers, so the name is read once.

## Calls this brief set without the owner's ruling

- **Carry-overs from Home.** Free chips are off by default (I. Free chips on cards). Part-free games carry no mark (I. Part-free mark). I built the "small mark" as canon's existing "First … free" tag on part-free games only. No new string, but it is a chip, not something smaller.
- Daily Groups is not shown anywhere on Discover.
- **Second pick:** Casebook by default, Delve as the alternative (H). **The Delve pick label "A NEW SCENE EVERY WEEK" is copy I wrote**, following Casebook's pattern, because the brief gave none. It needs ratifying.
- **Word pick label (F) and the free row's subline (G):** keep or change. Under the each-game-once rule, the kept subline names Casebook and Delve, and neither sits in that row any more.
- **Staging:** Word and Mystery are a free daily; Escape, Delve and Casebook a free first edition; the Barrow a free first chapter; 36,000 Summers Ago Pass-only. This is display data in `CDT_STAGE`, and no copy states it.

## What each game-once rule leaves

Picks are Casebook (or Delve) and Daily Word. Just added drops the picks. Free to play drops both, so by default it holds only Daily Mystery. All games lists all seven games shown.

## What I would pick, and why

- A: 2. It is short and true under the staging, and its link names where it goes.
- B: 1. There are only seven chips; one tap fewer, and no panel to explain.
- C: 1. It says what the row is. "Start here" stops being true for a returning player.
- D: 1, with Lock on the wall off. It is the smallest mark that reads on every cover, and it keeps the wall clean.
- E: b. It avoids "each game", which could be read as including 36,000 Summers Ago.
- F: change. G: none. Both stop stating the free line as a fact on a browsing page.
- H: Casebook. Delve already shows in Just added.
- I: both off.

The owner picks; no choice is removed.

## Left open, and needed before integration

- **Design system:** `GameCard`, `GamePick` and `GameTile` need a lock slot on the art (one treatment, legible on every ground, inert or pressable as ruled). Until then the lock lives in this overlay.
- **One copy of canon:** the candidate's page shell copies canon's 15-line `GsDiscover` wrapper. `DcBody` is reached by its file-scoped name, so it cannot be re-published from outside. On merge, the change goes into `gs-discover.jsx` itself and the copy goes.
- The D2 "pill" is square-cornered, because the design system has radius 0 everywhere.
- Whether the lock reaches the wall stays open, under the clean-list rule (2026-10-10).
- The note's "Got it" is a text link, as in the example image. The example's rounded corners are not followed, because the design system has radius 0.
- The note is retired in memory. Opening a state again brings it back, so it can be reviewed.

## Next

The owner picks on each axis. Then the lock slot goes upstream to the design system. Then merge as `skills/candidate-build` describes, or archive.
