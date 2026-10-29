---
date: '2026-10-29'
ticket: '1236'
topic: 'delve-v5-1c-1d'
status: 'in-progress'
type: 'exploration'
---

# Handoff: Delve character sheet, v5 round two (1C, 1D, 1CB, 1DB, Pack control)

## Current Focus

The owner is comparing the four new 1B variants in `playground/delve-v5.html` (launcher → 1236 → Delve session v5): 1C, 1D and their tightened versions 1CB and 1DB. He said he'll judge them "in the real" (on the page itself). The next step is his pick. After that come mobile ideation for the picked sheet, then the Abilities control (offered, not built). Nothing here is ratified.

## Task(s)

**The owner's v5 review (2026-10-29), input only, not decisions:**
- 1 · Strip: in a good state, but too big. It doesn't stand apart from the session card, and on mobile it breaks. Not his favourite.
- 1B · Tracks first: tighter and better. **Bars beat dots for hit points and threat.** Backstab isn't visual enough, and he's unsure how two abilities would work. Pack at 0 makes sense.
- 3 · Tokens: likes **hexes for the stats** and its icons in general, though "something slightly wrong" with them. Dislikes hit points and threat hidden until a tap; too much is hidden and there's a lot to click through. Clean on mobile. Bug: the selected outline is uneven from token to token.
- 3B · Hotbar: clean. Its tap works best. There's dead space between Wren and the labels, and it's "horrific" on mobile (the slots run together).
- Mobile in general: it probably wants dropdowns, but not Disclosure rows inside a card ("horrific"). He wants a round of ideas for it.

**What he asked for, in words:** a Pack control as a dropdown (0–3 items); two new versions of 1B that take what he liked from the others (agreed to my 1C and 1D framing with "lets see"); then 1CB and 1DB, the same two **tighter** (less padding, not less content).

**Built:**
- **Pack control** in the bar (As played, 0, 1, 2, 3 items). It overrides the play's pack.
- **1C · All shown:** 1B's hero and two bars, then labelled groups. Stats are hexes. The pack shows icon boxes with name and state, and free slots are kept, so 0 and 3 items stand the same height. Each ability is its own glyph with use squares. Ability and inspiration share one cell.
- **1D · Tap for more:** 1B's hero and bars, then one line of equal 64px tokens with one word under each. A tap shows the detail at the heading's right. Every token is the same size, which fixes 3's uneven outline.
- **1CB, 1DB:** 1C and 1D with less card padding, smaller gaps and boxes, and 54px tokens.

## Critical References

- CLAUDE.md § Page rules, session page; § Ratification.
- `delve.md`, read live (path in `handoff-2026-10-28-delve-v3-e3.md`): Gear, Hero ability, Carry limit. It has no rule for keeping the lower die (see the earlier v5 handoff).

## Earlier handoffs

- `handoff-2026-10-29-delve-v5-sheet.md`: v5's first four concepts (1, 1B, 3, 3B), the die canvas v2, and the owner's v4 review. A short note on this round was appended there too.
- `handoff-2026-10-28-delve-v4-e4.md`: v4's concepts and the invented sheet facts (Con, Cha, abilities, starting gear).
- `handoff-2026-10-28-delve-v3-e3.md`: v3's session card (held fixed under the sheet) and the live path to `delve.md`.
- `handoff-2026-10-28-delve-e-phone-and-next.md`, `handoff-2026-10-28-delve-session-v2-review.md`, `handoff-2026-10-28-delve-session-v2.md`, `handoff-2026-10-28-delve-session-audit.md`, `handoff-2026-10-28-delve-session-playground.md`: earlier Delve rounds and the die's ratified states.
- `handoff-2026-10-27-escape-*.md`, `handoff-2026-10-27-session-page-areas.md`: Escape and the session page's areas.
- `handoff-2026-10-27-word-session-into-app.md`, `handoff-2026-10-28-word-*.md`: Word's session page and now card.

## Recent changes

- `playground/pg-dv5.jsx`: `DV5_PACK`, `DV5_PACK_FILL`, `dv5Pack` (the Pack override, applied in `Dv5Body`); `Dv5Hex`, `Dv5Tf`, `Dv5Open` (1C/1CB, prop `tight`); `Dv5T`, `Dv5Tap` (1D/1DB); concept options and the Why text for all four; the Pack `<select>` in `Dv5PgBar`.
- `playground/delve-v5.html` `<style>`: the 1C block (`.dv5-oc`, `.dv5-op`, `.dv5-og`, `.dv5-hx6`, `.dv5-ol`), the 1D block (`.dv5-tl`, `.dv5-tg2`, `.dv5-t`), and the tight block (`.dv5.is-tight …`).
- `handoff-2026-10-29-delve-v5-sheet.md`: a short note on this round, appended above Critical References.

## Learnings

- Text inside an SVG hex scales with the viewBox (46 units): at a 30px hex, 13px text draws at about 8.5px. The sizes set now (18–21 units) draw at about 14px. Check this whenever a hex size changes.
- In a 2-column grid, a fourth group lands alone on a row. Grouping ability and inspiration in one cell (`.dv5-op`) avoids that.
- `ready_for_verification` reports an empty `#root` on the first call for this loader page. The second call loads clean (known, see the earlier v5 handoff).

## Artifacts

- `docs/specs/1236-session-pages/playground/pg-dv5.jsx`
- `docs/specs/1236-session-pages/playground/delve-v5.html`

## Action Items & Next Steps

1. The owner picks among 1C, 1D, 1CB and 1DB (or a mix).
2. Mobile ideation for the picked sheet: folding without Disclosure rows. Offer two or three ideas before building.
3. Offer the Abilities control again (1 or 2, with a second ability invented for the playground); he hasn't answered it yet.
4. Still open from the earlier v5 handoff: the die fixes in the session card, hiding the old die canvas, the v3 review.
5. Nothing goes into `app/`; no CHANGELOG entry.

## Other Notes

- Calls I made that he hasn't judged: the Pack fillers (Iron key, plus the invented Healing draught and Rope with their effects); 1D's one-word labels (stat abbreviation, the item's state, the ability's name, "Inspiration"); keeping free slots in 1C's pack; the tight values (12/16px card padding, 54px tokens, 28px boxes).
- `playgrounds.json` needs no change: the same entry page holds the new concepts.
