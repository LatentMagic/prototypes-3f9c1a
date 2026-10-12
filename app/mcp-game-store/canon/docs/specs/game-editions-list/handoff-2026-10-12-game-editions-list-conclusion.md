---
date: '2026-10-12'
topic: 'game-editions-list'
status: 'in-progress'
type: 'playground → conclusion'
---

# Handoff: a game's list of editions. 2g with the matched cover, ready to conclude

## Current Focus
Next session: settle how this works, then integrate. The user named three pieces:
1. **A design system update for the matched cover.** The user is taking this to the design system agent; the prompt is in "The cover idea" below. Read the design system live first (`/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/`, `components/media/` Cover). If it has landed, use its version and drop the rig's.
2. **The head, 2g with that cover**, as built now.
3. **The filter update from the History filters playground** (`docs/specs/history-filters-redesign/`). The user thinks it's **option 1, "Two lists", without the tabs**. Confirm that with the user before building: option 1 minus the tabs is the Filters panel that only narrows (Genre, Schedule, Game, Replays, Order) and works the same on either list. See `handoff-2026-10-12-history-filters-redesign-playground.md` § The options.

Put these to the user one at a time. Nothing below is ratified unless it says so.

## Task(s)
- Done (playground only; `app/` unchanged): 2g kept; the cover grows to match the text; the head sits 24px above the cards.
- Tried and rejected by the user this session: **2h** (it wastes space), and **2i** (title across the top, links beside the cover) and **2j** (cover at the end). Strong rejection; don't bring them back. They are still in `PGE_OPTS` but out of the strip.

## The cover idea (user's, 2026-10-12; the user said "Paste it as it is" to send it to the DS agent)
- The cover is at least 4:3. When the text beside it is taller, the cover grows to match, **with no upper limit**, so cover and text share a top and a bottom edge. The user turned down a square cap: "it can't be complete until they fit in a container. evenly".
- The art keeps its scale on the bottom edge. The extra height is the art's own background, drawn upward. Nothing stretches or crops.
- The edges are visible ink: the cover's top meets the title's cap height (`text-box: trim-start cap alphabetic`), and its bottom meets the last link's underline. Measured within 1px at 375px with the long name. When the text is shorter than the cover, it is centred on it, with about 4px above and below.

## Critical References
- `CLAUDE.md`: ratification rule; one decision per turn; the H1 stays the largest text.
- Design system `guidelines/layout-and-patterns.md`: "States change content, not shape".
- `docs/specs/history-filters-redesign/handoff-2026-10-12-history-filters-review.md`: the owner's reaction to option 1's tabs (they look nearly the same).

## Recent changes
- `docs/specs/game-editions-list/playground/index.html`, last `<style>` block, the "2g, 2026-10-12 fix" rules:
  - `.rf-head.pge-head-g`: areas `"cov ." "cov h1" "cov links" "cov ."`, rows `1fr auto auto 1fr`. The 1fr rows centre short text, and close up when the text is longer.
  - `margin-bottom: -12px`: the head sits 24px above the first card, as the cards sit to each other. The page gap is 36px.
  - `.pge-head-g .mcp-cover-art`: `aspect-ratio: auto`, flex-grow, and a min-height per width (96, 72 from 640, 108 from 720).
  - `.pge-head-h1`: text-box trim to cap height.
  - The 2i/2j rules are still in the file, unused.
- `pg-editions.jsx`:
  - `pgeTall()`: rewrites the cover SVG to `xMidYMax meet`, `overflow: visible`, and a background rect extended to `y=-400`. The 2g head mounts `DS.Cover` with it.
  - `PGE_LIVE = ['2g']`.
  - Strip Go: "Casebook, long name (test)" (`pge.long`). It renames Casebook's head to "Casebook of the Long Winter Nights".
  - `PGE_OPTS` has 2i and 2j.
- `playgrounds.json`: the entry name still says "2i and 2j". Fix it to 2g.
- `handoff-…-head.md`: Current Focus still says "2i or 2j?". Superseded by this file.

## Learnings
- The head's real problem was the text block's edges, not the layout. A box reads as even only when its visible ink meets the cover: cap height at the top, underline at the bottom. Any future head work starts from that.
- `pgeTall` depends on every cover being `GS_SVG` with a full-size first `<rect>` background (`app/gs-data.jsx:18`). A cover drawn differently would break it. Raise this with the DS agent.
- The user reacts badly to new layouts when a small fix exists. Try the smallest lever first: size, then spacing, then layout.

## Artifacts
- `docs/specs/game-editions-list/playground/index.html`, `pg-editions.jsx`.
- This file. The earlier `…-head.md`, `…-playground.md` and `…-review.md` are background.

## Action Items & Next Steps
1. Check whether the design system has a growing Cover. Then ask the user: the DS version, or the rig's for now?
2. Confirm which filter update is meant (History option 1 without the tabs?). Then fold it into the editions list page's Filters. That page has a "Show" group today: Every case / Not played.
3. Open items, one per turn:
   - Does in progress or unfinished count as played?
   - Copy: "About this game", "Every case / room / scene", "Show", "Not played", "See in History", the two empty-list lines.
   - Write the 32px stacked-link exception into the rules (the user accepted it earlier).
4. With ratification, list what goes to `app/`:
   - the head and cover
   - the list page
   - Share in one row on a phone
   - the `lb-results` height
   - the back flags
   - the 24px head gap, which may apply to every library game page
5. Clean up: remove 2i/2j and the old options from the rig, fix `playgrounds.json`, and ask before clearing `uploads/`.

## Other Notes
- Ratified 2026-10-12:
  - "About this game" in every head
  - "See in History"
  - the 32px links as an exception
  - option 1 out (editions playground)
  - no per-game third state
  - no adaptive layout that changes per game page
- Verifier never runs on this entry (GOTCHA 11, the `<base>` false positive). Check by hand, at 375px and desktop, with the long-name test on and off.
