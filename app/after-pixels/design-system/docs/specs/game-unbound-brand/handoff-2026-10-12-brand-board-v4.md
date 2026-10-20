---
date: '2026-10-12'
topic: 'game-unbound-brand'
status: 'in-progress'
type: 'exploration'
---

# Handoff: game-unbound-brand — round 4 of marks and wordmarks for Game Unbound

## Current Focus

Joe is reviewing `docs/specs/game-unbound-brand/playground/brand-board-v4.html`. Wait for his reaction. **Do not put up question forms while he reviews.** He asked for none and said "just wait". Let him lead.

Joe is close to choosing **Game Unbound** (gameunbound.com is under consideration) to replace the "MCP Game Store" / "[Platform]" placeholder in the top bar. No mark or wordmark is chosen yet.

Superseded rounds: `brand-board.html`, `-v2`, `-v3`. Earlier handoff: `handoff-2026-10-12-brand-board.md`. Its brief, learnings and do-not-bring-back list still apply.

## Joe's round 3 feedback (verbatim intent)

- **Overall:** no mark reads as unbound, untethered, unfettered or sky's-the-limit. "Just needs more."
- **M0 Missing piece:** may already have an unboundedness to it. Asked for small ideas that keep it intact but add a sense of being unbound.
- **M9 Open ring:** cut. It reads as a C, which has nothing to do with Game Unbound.
- **M10 Swing:** doesn't mind it, but it isn't doing anything.
- **M11 Past the edge:** "pretty cool". The play button feels relevant to gaming, so it is worth playing with.
- **M12 Nudge:** cut. A cursor is irrelevant to the context, which is working in AI chats.
- **M13, M14:** cut. Nothing of interest.
- **Colourways:** keep them all. He appreciates seeing them.
- **W1:** fine, and happy to go that way.
- **W4:** likes it, but it depends on the mark's colours, so show it in that context.
- **W6:** interested, and wants a bit more ideation on the high-level idea.
- **W8:** likes it because the system uses tags throughout. Rule: **if a wordmark borrows a system element, check that it really matches the real component.**
- **W9:** speaks to him, and is much more elegant than W10.
- **W10:** less than W9.
- **W11:** hates it. Cut.
- **W12:** asked for more ideation.
- **Splash:** remove for now, because mobile delivery is a long way off.

## Task(s)

- **Done: round 4 board** (`brand-board-v4.html`, built from a copy of v3).
  - New marks. All are filled paths, with nothing stroked.
    - M15 Outgrown: M0's grid with a larger ball (r22). It runs past the grid at the top and right.
    - M16 Left the slot: the fourth cell is drawn as a dim slot (mix of piece colour and page, 42%). The ball sits half out on its far corner.
    - M17 Play piece: M0's three squares, plus a play triangle as the fourth piece that runs past the grid.
    - M18 Too big for the tile: M11 pushed further. The triangle runs past the tile at the top, bottom and right.
    - Kept for comparison: M0, M10, M11 (M11 is the default).
  - Wordmarks, grouped by idea:
    - W1 is kept.
    - W4 now takes its colour from the mark.
    - W6 family: W6, W13 (label right), W14 (label in the mark's colour), W15 ("GAME" under "Unbound" in Hanken).
    - W8 family: W8 (real `mcp-tag mcp-tag-free`), W16 (`mcp-tag-daily`), W17 (Tag shape in the mark's colour; not a real Tag kind).
    - W9 family: W9, W18 (both words in full text colour).
    - W10 is kept.
    - W12 family: W12, W19 (label in Hanken 600, no new font), W20 (label in the mark's colour).
  - The bar brand sets `--wm-a` / `--wm-b` from the current mark and colourway (`bv()`). Coloured wordmarks follow the mark picker.
  - Cut: M9, M12, M13, M14, W11, the splash section, the wordmark picker, and Archivo.
- **Not done:** motion, lockups where the mark replaces a letter, a GU monogram. Wait for Joe before starting any of them.

## Critical References

- `docs/specs/game-unbound-brand/handoff-2026-10-12-brand-board.md` (brief, learnings, cut list).
- `components/feedback/Tag.jsx`, `Tag.prompt.md` and `components/components.css:58` (`.mcp-tag`). W8, W16 and W17 must match these.
- `guidelines/visual-foundations.md`, `tokens/colors.css`.

## Recent changes

- `docs/specs/game-unbound-brand/playground/brand-board-v4.html`: new. Data lives in `MARKS` (with a `mix()` colour helper) and `WMS`. State is in localStorage `pg_game-unbound-brand_v4` (`mark`, `cw`). Registered as asset "Brand board v4".
- `playgrounds.json`: v4 entry added under `game-unbound-brand`.

## Learnings

- Joe wants to review in silence. Ask questions only after he has given feedback, and only if something is truly unclear.
- "Unbound" has to come from the shape itself: something that breaks out of its box or overruns it. The pieces of M0 and the play triangle from M11 are what landed.
- Anything that implies a mouse or cursor is wrong. The product context is AI chat.
- Letterforms that read as an unrelated letter (M9 as C) fail.
- When the board borrows a system element, use the real class and not an imitation.
- The `styles.css` missing-file warning is the known `<base>` false positive.

## Artifacts

- `docs/specs/game-unbound-brand/playground/brand-board-v4.html` (current)
- `docs/specs/game-unbound-brand/playground/brand-board-v3.html`, `-v2.html`, `brand-board.html` (superseded)
- `playgrounds.json`

## Action Items & Next Steps

1. Wait for Joe's v4 reactions. Cut what he rejects and keep the colourways.
2. If he wants another round, copy to `brand-board-v5.html` and add it to `playgrounds.json`.
3. Once a pair is chosen, follow step 3 of the earlier handoff's Action Items: logo assets, `thumbnail.html`, `Loader`, `GsWordmark` / `GsStaticBrand`, fonts, docs.
4. Before anything is final, run an image search and a trade mark search.
5. When the work is done, archive `docs/specs/game-unbound-brand/` and update `playgrounds.json`.

## Other Notes

- Do not bring back M9, M12, M13, M14 or W11, nor anything on the earlier handoff's cut list.
- W4, W10, W12 and W20 still add a third typeface (JetBrains Mono, Geist, Geist Mono). These fonts are loaded on the board only.
