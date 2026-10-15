---
date: '2026-10-12'
topic: 'game-unbound-brand'
status: 'in-progress'
type: 'exploration'
---

# Handoff: game-unbound-brand — round 3 of marks and wordmarks for Game Unbound

## Current Focus

Get Joe's reaction to `docs/specs/game-unbound-brand/playground/brand-board-v3.html`: which marks, colourways and wordmarks survive. He has not seen round 3 yet. Joe is close to choosing **Game Unbound** (domain under consideration: gameunbound.com) to replace the "MCP Game Store" / "[Platform]" placeholder in the top bar. Nothing is chosen.

Background only: rounds 1 and 2 (`brand-board.html`, `brand-board-v2.html`), both superseded.

## Task(s)

- **Done: round 3 board.** Built from v2's code (auto-frame, 16px raster, bar-fit readout carried over).
  - At a glance: every mark at 48 and 24px on dark and on light (the distance test).
  - Marks: each card has 96/32px, a real 16px raster on dark and light, browser tabs, four colourways from the cover palette (some on an indigo/wine/forest tile; tapping one applies it board-wide), claim, cost, motion.
    - M0 Missing piece: today's mark, the standard to beat.
    - M9 Open ring: broken ring, ball in the gap; also reads as G. Default in the bars.
    - M10 Swing: M0's grid, one cell a quarter circle hinged on the centre.
    - M11 Past the edge: play triangle overrunning its tile. Reads as video first.
    - M12 Nudge: pointer touching the ball, an agent playing. Reads as "computer".
    - M13 Prompt: chevron and cursor. Reads as a developer tool.
    - M14 Spark: square minus four quarter circles. Risk: the stock AI symbol.
  - Wordmarks, in the desktop bar at 1024 and phone bars at 360 and 320 with space-left readout:
    - Kept for comparison: W1 Plain (control), W4 Code and word, W6 Small game (Joe liked W4 and W6).
    - New: W8 Tagged ("GAME" in an off-white square tag), W9 Two voices (Hanken "Game" + Bricolage "Unbound", no new font), W10 Geist, W11 Wider (Archivo, "Unbound" at wdth 125), W12 Label and name (Geist Mono "GAME" over "Unbound"; default).
  - Splash: mark and wordmark pickers; wide, phone and horizontal lockup.
- **Planned:** a round 4 only if Joe wants it; then implement the chosen pair (see Action Items).

## Critical References

- Joe's brief, from his round 2 feedback:
  - **Theme:** agents driving video games, which the platform provides. Untethered play, bound only by imagination. The AI-agent side should come through.
  - **Style:** the system is crisp and modern, not wonky or toy-like. "Fun" must not mean gimmicky.
  - **Marks:** as clean as M0 at a distance and at 16px. A few bold masses, no slivers or thin tips, nothing floating away from the body. Leave room for motion (no spinner animation yet).
  - **Colour:** use the whole system (cover shapes, colours, grounds), not only today's green and orange.
  - **Wordmark:** a real wordmark, not an effect. "Unbound" stressed and set apart from "Game". New fonts welcome if they fit.
  - **Fit:** 64px top bar, desktop and phones, mark left, wordmark right. Splash later.
- `guidelines/visual-foundations.md` (palette, shapes, radius 0, flat fills) and `tokens/colors.css` (cover colours).
- History: `uploads/mcp-game-store-logo-ideation/` (concepts, earlier board, the Game Unbound mock-up PNG).

## Recent changes

- `docs/specs/game-unbound-brand/playground/brand-board-v3.html`: new. Mark data in `MARKS`, wordmarks in `WMS`, colourways as letter codes (`C`/`NM` maps; a third letter is the tile ground). State in localStorage `pg_game-unbound-brand_v3` (`mark`, `wm`, `cw` per mark).
- `playgrounds.json`: v3 entry added under `game-unbound-brand`.
- `skills/create-handoff/`: added from `LatentMagic/prototypes-3f9c1a` `kit/project/skills/create-handoff/`; `CLAUDE.md` now points to it.

## Learnings

- Joe judges marks at distance first. Anything with a thin point, sliver or detached piece fails, whatever its idea.
- He reads "playful" literally as toy. Keep wordmarks crisp; the idea goes in the split between the words, not in effects.
- Cream colourways almost vanish on light backgrounds. Cover-ground tiles sit close to the page colour on dark, so a tile mostly helps on light.
- Auto-frame uses `getBBox`, which ignores strokes: draw marks as filled paths, never stroked.
- The missing `styles.css` warning after writing the board is the known `<base>` false positive (`CLAUDE.md`).

## Artifacts

- `docs/specs/game-unbound-brand/playground/brand-board-v3.html` (current)
- `docs/specs/game-unbound-brand/playground/brand-board-v2.html` (round 2, superseded)
- `docs/specs/game-unbound-brand/playground/brand-board.html` (round 1, superseded)
- `playgrounds.json`

## Action Items & Next Steps

1. Get Joe's reaction to v3: surviving marks, colourways, wordmarks; cut the rest.
2. If needed, round 4 in `brand-board-v4.html` (copy v3). Likely: animate the surviving marks' stated motion, try lockups where the mark replaces a letter (M9 as the G of "Game"), a GU monogram, the chosen wordmark at splash scale.
3. Once a pair is chosen:
   - Replace `assets/logo.svg` and the PNGs in `assets/logo/`.
   - Update `thumbnail.html`, and the `Loader` mark if the mark changes.
   - Update the brand name in the product's `GsWordmark` / `GsStaticBrand` (`app/gs-site.jsx` in the Game Store project).
   - If a new typeface is chosen, add it to `tokens/fonts.css` and `tokens/typography.css` and record it in `guidelines/visual-foundations.md`.
   - Check the name in the readme and voice docs.
4. Before anything is final: image search and trade mark search.
5. When done, move `docs/specs/game-unbound-brand/` to `docs/archive/` and update `playgrounds.json`.

## Other Notes

- Do not bring back:
  - Marks M1–M8: slivers (M5, M7), generic (M2), sunrise/golf (M3), too many pieces (M4), off-vocabulary (M6), detached ball (M8).
  - W2 Loosening and W3 Rising: effects that read as bad kerning or a tilt; Joe hates W3.
  - W5 Block letters and W7 Narrow caps: toy-like ("Toys R Us").
  - Round 1's L1: ball floating far from the body.
- W4, W10, W11, W12 add a third typeface (JetBrains Mono, Geist, Archivo, Geist Mono). These are loaded on the board only, not in the system.
