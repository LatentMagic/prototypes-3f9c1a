---
date: '2026-10-12'
topic: 'game-editions-list'
status: 'in-progress'
type: 'playground'
---

# Handoff: a game's list of editions, the library game page head (2g or 2h)

## Current Focus
Update 2026-10-12, later: the user turned down 2g (the links wrap differently from game to game) and 2h (wastes space). They asked for two new designs. **2i** (the title across the top, the links stacked beside the cover) and **2j** (the title and links first, the cover at the end) replace them in the strip. Go has "Casebook, long name (test)". Open question: **2i or 2j?**

Earlier: the user was picking the head of the library game page, where the way in to the list sits. Two candidates, **2g** and **2h**, were in the strip. The constraint, from the user: **one adaptive rule** (phone and desktop) that works with one link (games with no editions, such as 36,000 Summers Ago and the daily games) and two links (Escape, Casebook, Delve). There must be no third state. Recommended: 2g. Not ratified.

Open question to put first: **2g or 2h?**

Background only: options 1, 2, 2b to 2f and 3 are out of the strip. Their history is in `handoff-2026-10-12-game-editions-list-playground.md`.

## Task(s)
- Done (playground only, `app/` unchanged): the round 2 brief on the list (number, played mark, Show filter), the Back fix, "About this game", the 2g and 2h heads, and the tidy.
- Next: the user picks 2g or 2h. Then settle copy, the played rule, and what goes back to `app/`.

## Critical References
- `CLAUDE.md`: ratification rule; "when layout rules collide" (size, then spacing, then layout, then rewording; the H1 stays the largest text on the page).
- `docs/specs/game-editions-list/handoff-2026-10-12-game-editions-list-playground.md`: full record of options 1 to 3 and rounds 2 to 4.
- Design system: `.gs-h1` is `clamp(28px, 8cqi, 34px)` in the entry's styles; the system's links (`.mcp-lnk`) are 48px tall.

## Recent changes
- `docs/specs/game-editions-list/playground/pg-editions.jsx`
  - `PGE_OPTS`: entries 2b to 2h added.
  - `PGE_LIVE = ['2g', '2h']`; a stored option outside it falls back to 2g.
  - `pgePlayed`: a finished play only.
  - `PgeEmpty`: wording for the Show filter.
  - The list page: a Show group for the 2 family; rows titled "#n · name" with `result="Played"`.
  - The `fromLib` / `fromList` route flags drive the back links.
  - The `LbHead` wrapper: cover, H1 and links as grid siblings, "About this game", and hunter included with About only.
  - The strip: Go adds 36,000 Summers Ago; Long name and One link removed.
- `docs/specs/game-editions-list/playground/index.html`, last `<style>` block:
  - `.pge-head*` rules for each variant.
  - `.lb-acts` in one row on a phone.
  - `.lb-results { min-height: 0 }`.
- `playgrounds.json`: entry renamed to "head options 2g and 2h", note rewritten.

## Learnings
- **`route.prev` holds only `{ name, page }`** (`app/main.jsx:146`). A page inside a library route (`list`, `pgeEd`) can't tell from it where it came from, so the link that opens the page must say so. This is a candidate for GOTCHA.md; ask before adding it.
- **The 720px `min-height` on `.lb-results`** holds the space while results load, but leaves an empty box with few rows. History in `app/` has the same rule, and so the same gap.
- **Stacked 32px links** need an inset focus ring (`outline-offset: -2px`); otherwise the ring covers the other link.
- **`.mcp-lnk` is 48px tall** with its text centred, so the space under the underline makes a head sit high beside the cover. On the 2 family, `margin-bottom: -10px` from 640px up centres the visible text.
- **Testing a long name on another game's page confused the user**, so test on the real page. 36,000 Summers Ago has no editions.

## Artifacts
- `docs/specs/game-editions-list/playground/index.html` and `pg-editions.jsx`.
- `docs/specs/game-editions-list/handoff-2026-10-12-game-editions-list-playground.md`, updated through the tidy.
- This file.

## Action Items & Next Steps
0. **Unresolved: a long name and editions together.** No game has both today, but the library grows. Tested before the tidy, with "36,000 Summers Ago" on Casebook's page:
   - **2g on a phone:** the title takes two lines at 28px and the links stack. Nothing breaks, but the text runs taller than the cover, so the head is unbalanced.
   - **2h:** the title wraps beside the cover; the links stay in one row beneath.
   - The user has not reviewed either. The test was removed in the tidy because it confused, so a fresh review needs a real, or plainly labelled, long-named game with editions.
1. Get the user's pick, 2g or 2h. Check it on Casebook (two links) and 36,000 Summers Ago (one link), at phone and desktop width.
2. On the picked option, settle the open items, one per turn:
   - Does in progress or not finished count as played? Today it does not.
   - Is the 32px stacked-link exception (2g on a phone) kept and written into the rules?
   - The copy: "About this game", "Every case / room / scene", "Show", "Not played", "See in History", and the two empty-list lines.
3. With ratification, list what goes to `app/`: the head, the list page, Share in one row on a phone, the `lb-results` height, and the back flags.
4. Clean `uploads/` at session end; nothing there is referenced (CLAUDE.md). Ask first, because the folder holds screenshots from earlier sessions too.

## Other Notes
- Ratified in chat, 2026-10-12:
  - Option 1 is out.
  - "See in History" is liked.
  - "About this game" in every head.
  - The 32px links are accepted as an exception.
  - The Filters summary line ("Not played") stays as the app has it.
  - Clear behaves as on History.
- Rejected by the user:
  - 2c (head too tall).
  - 2d (looks wonky).
  - 2f's card (it would hold one link alone on games with no editions).
  - A per-game third state.
- The user is frustrated by unclear rig states. Keep the strip minimal, show only real game pages, and give one decision per turn.
- `ready_for_verification` always reports the `<base>` false positive (GOTCHA 11), so the verifier never runs on this entry. Check by hand in your own preview.
