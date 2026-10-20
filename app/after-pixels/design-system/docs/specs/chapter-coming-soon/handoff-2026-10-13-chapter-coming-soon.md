---
date: '2026-10-13'
topic: 'chapter coming soon'
status: 'decided'
type: 'exploration'
---

# Handoff: chapter coming soon — playground built, awaiting the owner's pick

## Decided (2026-10-13)

Option 1j, now `SoonCard` in the design system; see `README.md`. Next: the owner tries it in the product and feeds back. Archive this folder when settled.

## Superseded (2026-10-13)

The owner narrowed the scope to the Coming soon card only. The placement rig below was off scope. The current playground is `playground/chapter-soon-card.html`, an option board of six card treatments (0 Today to 5 Play chapter 1); see `README.md`. The notes below are kept for history.

## Current Focus

The owner reviews `docs/specs/chapter-coming-soon/playground/chapter-coming-soon.html` and picks a direction (or a mix). Nothing is decided. Nothing in the design system changed.

## Task(s)

- Question: how do we show that a new chapter of a released game is coming soon?
- Settled: the design system as it stands (tokens, type, components); the whole-game "Coming soon" card (`GsSoonCard`, product `app/gs-parts.jsx`) does not change.
- Open: where it is shown and who sees it. The four options vary both.
- Owner's steer: make it an alt to the Coming soon card ("the Barrow one"), and make it clear.
- Done: a bottom-strip rig on a copy of the current product. Picking an option goes to where it lives and rings it.

## What each option bets on

- **0 Today.** Baseline: nothing.
- **1 Beside the Barrow** (Home and every game page's More games). Bets that people look for what is next in the Coming soon pair, so a chapter belongs there as an alt of that card: label CHAPTER 2, the game's name as the way in, "Chapter 1 is out now.", Coming soon tag. Cost: three cards in a slot of two, one of them a game you can already play; the card has to work to read differently from a new game. Hidden on the game's own page.
- **2 On the game** (every card of the game: Home, Discover, More games). Bets that the news belongs to the game and should travel with it, at no new place. Cost: two words among the tags, easy to miss, and it can say only "soon"; it lengthens a tags line written for one line at 220px.
- **3 On its page** (game page, a Chapters section under the facts). Bets on context: chapter 2 is understood next to chapter 1, as part of what the game is. Cost: only people who open the page see it.
- **4 For its players** (the game's library page, Pass holders with days played). Bets that the people who care are the ones who played chapter 1, and tells only them, in their record of the game. Cost: newcomers never hear of it; players only see it when they open the page.

## Critical References

- `CLAUDE.md` (playground rules, base tag), `skills/build-playground/SKILL.md`.
- Product source: `/projects/9aec15ee-6c7b-496d-ae68-b88b64b5ccaf/app/` (copied 2026-10-13).

## Recent changes

All inside `docs/specs/chapter-coming-soon/` (playground copies, not the product):
- `playground/app/*.jsx.txt`, `playground/tokens.css`: copies of the product's `app/` and `tokens.css`; `playground/src/product-index.html.txt`: the product's `index.html`.
- Four one-line hooks in the copies, each rendering nothing without the rig: `gs-parts.jsx.txt` GsTagList (`PgChTag`), `gs-home.jsx.txt` Coming soon grid (`PgChSoon`), `gs-game.jsx.txt` More games (`PgChSoon except={id}`) and after `GsFacts` (`PgChPage`), `gs-hunter-library.jsx.txt` top of `lb-lay` (`PgChLib`).
- `playground/pg-chapter-coming-soon.jsx.txt`: options, the four treatments, strip. `playground/pg-chapter-coming-soon.css`: strip only.
- `playground/chapter-coming-soon.html`: product `index.html` with root DS paths and the base tag.
- `playgrounds.json`: entry added. `README.md`: ticket index.

## Learnings

- No game in the product has chapters yet. 36,000 Summers Ago is the sample because it is one fixed game with no editions; Delve and Casebook already release scenes and cases, which would blur "chapter".
- Copy written for the rig (not product copy): "Chapter 1 is out now.", "Chapter 2 soon", "Comes with the Pass, like chapter 1.", "Chapter 2 is on its way", "When chapter 2 arrives, it opens here beside your days." Treat as placeholders.
- The screenshot tool ignores a CardRow's sideways scroll, so option 2's ringed tag looks off-screen in captures; in a browser the row scrolls to it.
- localStorage key `pg_chapter_coming_soon_v1`, reset to option 1.

## Artifacts

- `docs/specs/chapter-coming-soon/playground/chapter-coming-soon.html` (the rig)
- `docs/specs/chapter-coming-soon/README.md`

## Action Items & Next Steps

1. Owner picks an option or a mix (1 + 3 is a natural pair: news where people browse, detail on the page).
2. Then: decide the chapter's copy (a chapter name? a date?) and whether non-Pass players see it.
3. Write the decision into the design system (an alt of the Coming soon card, or a Tag rule, or a page pattern), then prompt the product agent.
4. Archive the folder to `docs/archive/` when done and update `playgrounds.json`.
