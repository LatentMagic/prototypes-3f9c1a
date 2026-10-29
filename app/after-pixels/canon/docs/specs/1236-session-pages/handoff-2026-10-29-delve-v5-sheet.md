---
date: '2026-10-29'
ticket: '1236'
topic: 'delve-v5-sheet'
status: 'in-progress'
type: 'exploration'
---

# Handoff: Delve session page, the character sheet, v5 (1, 1B, 3, 3B) and the die canvas v2

## Current Focus

The owner picks a character sheet in `playground/delve-v5.html` (launcher → 1236 → Delve session v5). The question put to him: which of 1, 1B, 3, 3B reads best on desktop. Two questions are queued after it: how phone and desktop differ (he called this "a second step"), and the die drawings carried into v5's session card. Nothing here is ratified.

## Task(s)

**The owner's review of v4 (2026-10-29), as input, not decisions:**
- Overall good. Hit points, threat and the pack all land.
- 1 · Strip: doesn't use the full width. The "Ready" word beside inspiration isn't needed: the token does enough, and could be empty when spent. He "detests" the stats affordance, a row (the Disclosure) inside a row. Laying the stats flat costs about the same room.
- 2 · Rail: "really cool", but it costs the session page too much. He liked HP and threat as bars and Backstab's squares. Its phone fold is nice.
- 3 · Tokens: likes the clickables. "Not far off": it needs to use the space and could be much thinner. Undecided whether it's his favourite or least favourite. The empty slot didn't explain itself.
- 4 · In hand: nothing wrong with it; his least favourite.
- On a phone, 1's dropdown is "horrific"; 2's works.

**Decided by him in words (2026-10-29):** drop 2 and 4; fix 1 and 3; add a 1B and a 3B of my own; carry over from 2 whatever I judge worth it. He approved the die canvas update ("I'll approve that") and asked for the canvas to be cleaned up and for a natural 20 on keep-the-lower.

**Built, v5** (`playground/delve-v5.html` + `pg-dv5.jsx`). The bar: Play, Concept, Inspiration (As played / Ready / Spent, which overrides the play's value), Why.
- **1 · Strip, tuned:** a 12-column grid over the full width. Top row: hero, HP bar, threat bar, Backstab's squares plus the inspiration hex (no word). Second row: pack and the stats, laid flat. Below 880px of card width it stacks.
- **1B · Tracks first:** hero beside two long bars (HP, threat). Under them, one line: stats abbreviated (STR +0…, `abbr` gives the full name), pack glyphs with names, ability squares, the inspiration hex.
- **3 · Tokens, tuned:** one row spread across the width with smaller tokens. The caption ("Tap a piece to read it", or what was tapped) sits at the right of the heading line instead of a line under. A free pack slot is a dashed outline.
- **3B · Hotbar:** every piece is an equal slot in one bar, with a label under each, so nothing needs a tap to read; a tap gives the detail. HP, threat, Backstab and inspiration take two columns each; the column count is the sum, so a wide card is one row. Under 720px of card width it becomes rows of six.
- From 2: HP and threat bars (1, 1B), Backstab's squares (all four).

**Built, the die canvas v2** (`playground/delve-dice-v2.html`). It shows every state at 30, 36, 52 and 88px: one die; two dice keeping the higher; two dice keeping the lower. The fix is that a natural 20 with two dice now pushes the hex behind clear of the rim (offset −7, −6.5 instead of −3.5, −3). Keeping the lower mirrors keeping the higher: the hex behind goes down and right, and from 64px the small die sits at the top left. The owner said the double line still "looks a little bit weird", but accepted it as a rare edge case.

**Owner's v5 review (2026-10-29), input only:** 1 good but too big, not distinct from the session card. 1B tightest; bars beat dots; Backstab not visual enough; two abilities untested. 3: likes hexes for stats and the icons, dislikes hp/threat hidden behind a tap; uneven selected outline. 3B: tapping works best; dead space; mobile jumbled. He asked for two new versions of 1B; mobile is a later ideation round.

**Built after it:** Pack control (As played, 0–3; fillers Iron key, Healing draught, Rope invented). **1C · All shown** (1B tracks, then labelled groups: hex stats, pack glyphs with names and free slots, ability glyph with use squares, inspiration). **1D · Tap for more** (1B tracks, then one line of equal 64px tokens with one word each; tap names it at the heading's right). Unasked: an Abilities control (1 or 2) was offered, not built.

## Critical References

- `delve.md` (read live, path in `handoff-2026-10-28-delve-v3-e3.md`): two d20 keep the higher, from inspiration or a strong-hit streak of two or more. **There is no disadvantage (keep the lower) rule.** The owner wants one drawn anyway. If the game is to have it, the spec needs the rule: name this gap to the spec owner.
- CLAUDE.md § Page rules, session page.

## Earlier handoffs

- `handoff-2026-10-28-delve-v4-e4.md`: v4's four concepts, the brain dump behind the sheet as its own card, and the invented sheet facts (Con, Cha, abilities, starting gear).
- `handoff-2026-10-28-delve-v3-e3.md`: v3 (the session card v4 and v5 hold fixed) and its unreviewed items; the live path to `delve.md`.
- `handoff-2026-10-28-delve-e-phone-and-next.md`: E on a phone and what came after.
- `handoff-2026-10-28-delve-session-v2-review.md`, `handoff-2026-10-28-delve-session-v2.md`: the die's ratified states (weak hit plain yellow, natural 1 as 1a, two d20 by size).
- `handoff-2026-10-28-delve-session-audit.md`, `handoff-2026-10-28-delve-session-playground.md`: v1, and the audit's spec fixes.
- Escape and Word handoffs (2026-10-27/28) in this folder: other games' session pages, not Delve.

## Recent changes

- `playground/pg-dv5.jsx`, `playground/delve-v5.html`: new. v5 reuses v4's sheet model, glyphs and session card, and takes v3's and v4's styles from their pages at load.
- `playground/pg-dv4.jsx` (last line): its bar doesn't mount when `window.DV4_NO_BAR` is set. v4 is otherwise unchanged.
- `playground/delve-dice.html`: a 29 Oct card at the top (before/after, keep the lower). Superseded by `delve-dice-v2.html`.
- `playground/delve-dice-v2.html`: new. Dropped 1b, the three two-dice drawings and the streak bar.
- `playgrounds.json`: entries for v5 and die v2. The old die canvas is still listed, not hidden.
- `github.md`: last sync refreshed.

## Learnings

- `ready_for_verification` reports an empty `#root` on these loader pages on the first try, because they mount late. A second call loads clean. The "file not found" warnings on nested pages are the base-depth false positive (depth checked: four).
- The hotbar needs a column count equal to the slots' total span. `auto-fit` left a lone slot on a second row, and pips and single long words overflowed their slots.

## Action Items & Next Steps

1. The owner picks a sheet from v5 (desktop first).
2. Then phone versus desktop for the picked sheet: whether the phone folds, as 2's did.
3. Carry the die fixes (natural 20 with two dice, keep the lower) into the session card only if he asks. v5 still uses v3's die.
4. Ask whether to hide the old die canvas (`delve-dice.html`) in the launcher (`"on": false`).
5. Still open from earlier: the v3 review (see the v3 handoff).
6. Nothing goes into `app/`; no CHANGELOG entry.

## Other Notes

- Calls I made that he hasn't judged: the 880 / 720px stacking points; 1B's abbreviated stats; 3's caption at the heading's right; 3B's labels taking two lines; two columns for the ability slot.
