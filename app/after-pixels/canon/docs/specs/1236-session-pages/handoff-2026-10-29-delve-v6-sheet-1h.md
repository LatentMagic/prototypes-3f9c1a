---
date: '2026-10-29'
ticket: '1236'
topic: 'delve-v6-sheet-1h'
status: 'in-progress'
type: 'exploration'
---

# Handoff: Delve character sheet, v6 (1H Band, M1 on a phone, die selection C)

## Current Focus

The owner named two next questions (2026-10-29), in his words:
1. "How do we make this in-progress line more elegant?" This is probably the session card's result statement, the big "In progress" word over the route, as it shows on the *In progress* play. Confirm which line he means before designing.
2. "How do we mindfully have these optional extras?" These are the hero-state elements below, which the sheet doesn't show yet.

Nothing goes into `app/`. When he said "fold it in" he meant M1 in the playground, not the main build.

### The optional extras, as the owner gave them (verbatim)

> Delve character sheet: hero state the sheet doesn't show yet. Each element appears only when it applies in that edition or at that moment.
>
> 1. Streak: strong hits or successes in a row. From two on, every roll has advantage, until a weak hit, partial success, miss or failure breaks it.
> 2. Clues: what the hero has learned, such as what a foe fears. In editions with a clue hunt (6 of 9), a count of pieces found out of pieces needed (for example 1 of 2). The foe's weakness can't be used until the count is complete.
> 3. Light: a resource that burns down as the hero moves, named by each edition (the torch, your oxygen, Ariadne's thread, your Geiger counter). Gear can refuel it. When it runs out, every miss against a foe hurts 1 more. In 5 of 9 editions.
> 4. Bargain struck: a deal taken during the run, which gives gear or an ability in exchange for a price the climax will collect. In 3 of 9 editions.
>
> Also allow for: the abilities row can grow mid-run, because a bargain or an ally can grant an extra ability (for example the sea witch's salt: one use, heals 4).

These rules should be checked against `delve.md` (read live; its path is in `handoff-2026-10-28-delve-v3-e3.md`). Name any that the spec doesn't hold to its owner.

## Task(s)

**Settled with the owner, in words (2026-10-29):**
- **1H · Band is the desktop sheet** ("banging"). It is one row of groups split by hairlines: hero (name over class, centred, no "Character sheet" heading; the section keeps `aria-label`), Hit points, Threat, Stats, Pack · n of 3, Abilities, Inspiration. Every piece is one cell: a 36px figure with one line under it. Hit points and threat are a 72px bar with "11 of 11" under it. Cells within a group are equal width, and names wrap to two balanced lines at most (88px). There are no free pack slots; the pack's count shows the room left, and an empty pack says "Nothing carried". The band never wraps on desktop.
- He confirmed the pack going 2 → 1 → 0, and inspiration, as working well.
- **Armour +1** stays for now. It's a box-corner tag on armour. Owner's note: all armour is +1 always, so the tag is in effect a fixed part of the armour symbol. Strictly it reduces a hit by 1 rather than adding 1. A +2 may come one day.
- **The die selection on a roll with two dice is C:** while selected, the hex behind is hidden (`pg-dv3.jsx`, `Dv3Die`). The natural 20 keeps its green rim outside. D (a gap inside the edge) was tried and dropped. B (one ring round both dice) was refused.
- **M1 · Rows is 1H's phone layout** (card under 560px). There are four rows on a 6+1 column grid: hero | hit points | threat | chevron; then stats; then pack; then abilities | inspiration, with hairlines between rows. It **opens folded** to the top row; tapping the row or the chevron shows the rest. The chevron's edge sits on the content edge, with a 44px target. The hero's columns are 1.25fr, so a long name clears the hairline. M3 was dropped, because the fold already does its job.
- C's fix to the die behind on a natural 20 (offset −7, −6.5) is now in the session card too.

**Not ratified (I made these up; the owner said "I will get back to you on this"):**
- The second abilities Vanish (Wren) and Second wind (Bryn).
- The long item name *Lantern of the drowned saint*.
- The longer hero name *Evangeline*, now the default in v6.
- The number +1 itself.

**Queued, owner's own:**
- Wrapping at in-between widths (560px up to about 1,140px of card). 1H squeezes rather than wraps, and the fullest case needs about 1,118px.
- "I do have a problem with the white selection": the owner asked to be reminded. It is the off-white ring on a selected die.
- The square marking the selected room on the route, on a phone ("the select square looks very poorly optimised for mobile").

## Critical References

- CLAUDE.md § Page rules (session page); § Ratification; § Replying in chat. The owner was badly frustrated this session by unchecked claims and by actions he hadn't approved. Measure in his own view before saying something fits, and ask before removing or merging anything.
- `delve.md`, read live (path in `handoff-2026-10-28-delve-v3-e3.md`).

## Earlier handoffs

- `handoff-2026-10-29-delve-v5-1c-1d.md`: 1C, 1D, 1CB, 1DB and the Pack control; the owner's review of v5's first four.
- `handoff-2026-10-29-delve-v5-sheet.md`: v5's 1, 1B, 3, 3B; the die canvas v2; the gap in delve.md's keep-the-lower rule.
- `handoff-2026-10-28-delve-v4-e4.md`: v4's concepts; the invented sheet facts (Con, Cha, abilities, starting gear).
- `handoff-2026-10-28-delve-v3-e3.md`: v3's session card (still the card under the sheet); the live path to `delve.md`.
- `handoff-2026-10-28-delve-e-phone-and-next.md`, `handoff-2026-10-28-delve-session-v2-review.md`, `handoff-2026-10-28-delve-session-v2.md`, `handoff-2026-10-28-delve-session-audit.md`, `handoff-2026-10-28-delve-session-playground.md`: earlier Delve rounds and the die's ratified states.
- `handoff-2026-10-27-escape-into-app.md`, `handoff-2026-10-27-escape-library-card.md`, `handoff-2026-10-27-escape-lock-row-v2.md`, `handoff-2026-10-27-escape-session-playground.md`, `handoff-2026-10-27-escape-session-playground-pass-2.md`, `handoff-2026-10-27-escape-session-v3.md`, `handoff-2026-10-27-escape-session-v4.md`, `handoff-2026-10-27-escape-session-v5.md`: Escape's session page, now in the app.
- `handoff-2026-10-27-session-page-areas.md`: the session page's areas.
- `handoff-2026-10-27-word-session-into-app.md`, `handoff-2026-10-28-word-asset-and-edition-picks.md`, `handoff-2026-10-28-word-now-card-built.md`, `handoff-2026-10-28-word-now-card-v10.md`, `handoff-2026-10-28-word-session-v6.md`, `handoff-2026-10-28-word-session-v7-result.md`, `handoff-2026-10-28-word-session-v8-canvas.md`, `handoff-2026-10-28-word-session-v9-built.md`: Daily Word's session page and now card.

## Recent changes

- `playground/pg-dv6.jsx` (new): concepts 1E, 1F (1CB re-aligned), 1G Columns and 1H Band (`Dv7Band`, `Dv7Cell`). Controls: Play, Concept, Inspiration, Pack (plus "3 items, one long name"), Abilities (1 or 2), Name, Phone fold (Today, M1, M2, M3; default M1), Why. `DV6_Q`: any control can be pinned in the address (`?concept=1h&fold=m1&bare=1`) without writing to storage. The M1/M3 fold state is `open`, false by default.
- `playground/delve-v6.html` (new): the loader (it pulls v3, v4 and v5's styles from their pages) plus v6's styles. The 1H phone folds are under `@container dv4 (max-width: 559.98px)`.
- `playground/delve-mobile.html` (new): the phone canvas. It has the owner's desktop screenshot (`ref-1h-desktop.png`) and four live 390px frames (Today, M1, M2, M3), each delve-v6 pinned by its address.
- `playground/pg-dv3.jsx` `Dv3Die`: the die behind moves to (−7, −6.5) on a natural 20, and is hidden when the die is selected (C).
- `playground/pg-dv5.jsx`: its bar is off under `DV5_NO_BAR`.
- `playground/delve-dice-v2.html`: every state now also shows selected (36 and 52px), and there's a table of selection options for two dice (Today, A Plate, B Round both, C Behind steps out, D gap ×2), route sizes only.
- `playgrounds.json`: v6 and the phone canvas added. Delve v1–v5 are switched off (`"on": false`), which was my call, not his; their files stay because v6 loads v3–v5.

## Learnings

- `ready_for_verification` and `show_html` report an empty `#root` and false "file not found" errors for these loader pages. Check by measuring in `eval_js_user_view` (the owner's own width, about 1,393px) or in the canvas iframes instead.
- My preview is narrower than the owner's. A row that wraps for me may fit for him, and the reverse. Measure `scrollWidth` against `clientWidth` in his view before claiming a fit.
- In a flex row, a cell as wide as its own label pulls boxes out of line. Use a grid with `grid-auto-columns: minmax(0, 1fr)` so the cells in a group are equal.
- Canvas iframes with `loading="lazy"` never load when off screen. Load them eagerly.

## Artifacts

- `docs/specs/1236-session-pages/playground/pg-dv6.jsx`, `delve-v6.html`, `delve-mobile.html`, `ref-1h-desktop.png`
- `docs/specs/1236-session-pages/playground/pg-dv3.jsx`, `pg-dv5.jsx`, `delve-dice-v2.html` (edited)
- `playgrounds.json`

## Action Items & Next Steps

1. Confirm which "in-progress line" the owner means, then offer two or three ways to make it more elegant. Offer them before building.
2. The optional extras: check each against `delve.md`, then propose how 1H (and M1) takes them without breaking the one row. Each appears only when it applies, and Abilities can grow mid-run (the sea witch's salt). Check the fullest case on one row at his width.
3. Wrapping at in-between widths (560px up to about 1,140px).
4. Remind him about the white selection ring.
5. The selected-room square on a phone.
6. His answer on the invented items (Vanish, Second wind, the long names, +1).
7. When he's ready: whether 1H, M1, C and the v3 session card go into `app/` together. That needs his words; it's my recommendation, not his decision.

## Other Notes

- The owner asks for short replies, one question at a time, and no questions where the next step is obvious. He is equally angry at action he hasn't approved: hiding v1–v5 and dropping concepts from v6 were both unasked. Do the plain reading of an instruction, check it, then say what landed.
- `uploads/` holds this session's screenshots. Clear the ones nothing references at the end of the session.
