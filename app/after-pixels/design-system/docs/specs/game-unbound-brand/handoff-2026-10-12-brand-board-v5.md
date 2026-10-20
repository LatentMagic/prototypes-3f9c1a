---
date: '2026-10-12'
topic: 'game-unbound-brand'
status: 'in-progress'
type: 'exploration'
---

# Handoff: game-unbound-brand — round 5 of marks and wordmarks for Game Unbound

## Current Focus

Joe is reviewing `docs/specs/game-unbound-brand/playground/brand-board-v5.html`. Wait for his reaction. **Do not put up question forms while he reviews.** Let him lead.

Joe is close to choosing **Game Unbound** (gameunbound.com is under consideration) to replace the "MCP Game Store" / "[Platform]" placeholder in the top bar. No mark or wordmark is chosen yet. He is leaning towards keeping **M0 Missing piece** ("maybe missing piece is just fine") but wants a small adjustment that makes it feel like it is growing outside its bounds. He hasn't seen that yet.

Superseded rounds: `brand-board.html`, `-v2`, `-v3`, `-v4`. Earlier handoffs: `handoff-2026-10-12-brand-board.md` (brief, learnings and do-not-bring-back list still apply) and `handoff-2026-10-12-brand-board-v4.md`.

## Joe's round 4 feedback (verbatim intent)

- **Missing-piece ideation:** nothing achieved "growing outside its bounds".
  - **M15 Outgrown:** isn't doing it.
  - **M16 Left the slot:** confusing. The orange sitting there looks "polluted", not outgrown.
  - Wants more time spent on logo ideation.
- **W1:** he accepts it is too tight at phone widths.
- **W4:** doesn't relate to it. Cut.
- **W6:** "there's something in that". Variants that don't read as written English make no sense to him (W13 label right, W15 Unbound-over-Game).
- **W14:** interesting, but wants **green, not orange**, because the orange label fails accessibility. Also wants W6 seen with a **white** label.
- **W8:** now disliked. It clusters against the logo too much. The other tag variants are disliked too.
- **W12:** unsure what it is doing, but it is more spacious, "which seems alright". Wants variations.

## Task(s)

- **Done: round 5 board** (`brand-board-v5.html`, built from a copy of v4).
  - New marks, all M0 variants and all filled shapes:
    - M19 Growing: pieces grow in size from the bottom-left square (24) through two 32px squares to a ball of r22.
    - M20 Drifting apart: the gaps widen away from the bottom-left square, and the ball is furthest out.
    - M21 Broken corner: M0 sits inside a frame whose top-right corner is missing, with the ball in the gap.
    - M22 Trail: two smaller balls (r4, r8) lead out of the empty cell to the ball (r16).
    - Kept: M0 (the bar default now), M17, M11, M18. These three weren't mentioned in round 4.
  - Wordmarks:
    - W1 is kept.
    - W6 family: W6 (muted label), W14 (label in green `#4CC38A`, fixed, no longer the mark's colour), W21 (white label).
    - W9 and W18 are kept.
    - W12 family: W12, W19, W20 (now green, fixed), plus:
      - W22: "GAME" spans the width of "Unbound", via flex `space-between` on letter spans.
      - W23: W22 in green.
      - W24: larger Hanken 700 label in white.
      - W25: W19 with more space between the lines.
  - Cut: M10, M15, M16, W4, W8, W10, W13, W15, W16, W17. JetBrains Mono and Geist are no longer loaded; only Geist Mono remains (W12, W20).
- **Assumptions to confirm with Joe:** "I don't like the others" was read as the tag variants, so W9 and W18 were kept. W10 was cut because he preferred W9 to it.
- **Not done:** motion, lockups where the mark replaces a letter, a GU monogram. Wait for Joe before starting any of them.

## Critical References

- `docs/specs/game-unbound-brand/handoff-2026-10-12-brand-board.md` (brief, learnings, cut list).
- `guidelines/visual-foundations.md`, `tokens/colors.css`.
- `components/feedback/Tag.jsx`, `components/components.css:58`. Use these only if a tag idea comes back. Joe has now rejected tags next to the mark.

## Recent changes

- `docs/specs/game-unbound-brand/playground/brand-board-v5.html`: new.
  - Data lives in `MARKS` and `WMS`. New CSS modifiers: `.wm-pre.is-g` / `.is-w`, and `.wm-label.is-g` / `.is-span` / `.is-big` / `.is-air`.
  - State is in localStorage `pg_game-unbound-brand_v5` (`mark` defaults to M0, `cw`).
  - Registered as asset "Brand board v5".
- `playgrounds.json`: v5 entry added under `game-unbound-brand`.

## Learnings

- Joe reviews in silence. Ask only after his feedback, and only if something is truly unclear.
- "Unbound" has to come from the shape: something growing or breaking out of its box. Dimmed or ghost shapes (M16's slot) read as dirt, not as growth.
- Wordmark text in orange fails contrast. Use green (`#4CC38A`, about 8:1 on the page) or full text colour for labels. Orange stays in the marks.
- Wordmark arrangements must read as English, "Game" before "Unbound".
- A solid shape in the wordmark beside the mark (a tag) crowds the mark.
- Anything that implies a cursor is wrong. The context is AI chat.
- The `styles.css` missing-file warning is the known `<base>` false positive.

## Artifacts

- `docs/specs/game-unbound-brand/playground/brand-board-v5.html` (current)
- `brand-board-v4.html`, `-v3.html`, `-v2.html`, `brand-board.html` (superseded)
- `playgrounds.json`

## Action Items & Next Steps

1. Wait for Joe's v5 reactions. Cut what he rejects and keep the colourways.
2. If he wants another round, copy to `brand-board-v6.html` and add it to `playgrounds.json`. Keep the missing-piece ideation going, with small moves on M0.
3. Once a pair is chosen, follow step 3 of the first handoff's Action Items: logo assets, `thumbnail.html`, `Loader`, `GsWordmark` / `GsStaticBrand`, fonts, docs.
4. Before anything is final, run an image search and a trade mark search.
5. When the work is done, archive `docs/specs/game-unbound-brand/` and update `playgrounds.json`.

## Other Notes

- Do not bring back M9, M10, M12, M13, M14, M15, M16, W4, W8, W10, W11, W13, W15, W16 or W17, nor anything on the first handoff's cut list.
- W12 and W20 still add a third typeface (Geist Mono). W19 and W22 to W25 use Hanken only.
