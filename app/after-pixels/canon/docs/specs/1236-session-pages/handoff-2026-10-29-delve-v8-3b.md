---
date: '2026-10-29'
ticket: '1236'
topic: 'delve-v8-3b'
status: 'in-progress'
type: 'exploration'
---

# Handoff: Delve sheet extras, 3B in hi-fi (v8) with the bargain as 5B

## Current Focus

The owner is going ahead with **3B** (extras join the band's own groups, one row, no "This run" row). Next: a **new 3B-only playground** with config to test the sheet with more and less information. He asked for it once he has checked v8 (his words: "we'll do that after I verify"). Wait for his go before building it.

## Task(s)

- **Done, low-fi:** `playground/sheet-extras-canvas-v2.dc.html`: 2A strip and 2B centred cells (the owner found these weak; 2B "stupid", 2A closest), then 3A, 3B and 3C with the streak always shown.
- **Done, hi-fi:** `playground/delve-v8.html` + `pg-dv8.jsx`, the real session page. Bar: Concept 3A, 3B or 3C; Extras "One extra" or "Hardest: every extra, full pack, two abilities"; Play. 3A and 3C are first passes, not tuned; 3B is the tuned one.
- **Done, canvas:** `playground/bargain-canvas.dc.html`: turn 4 (4A–4D) and turn 5 (5A–5E). The owner picked **5B**.

## Decisions (owner, 2026-10-29, in words)

- 3B is the direction to take into its own config playground. 1B, 1C and 1D are out; so is 3A's streak under the hero ("an awful place").
- No "This run" heading anywhere: everything on the sheet is about this run.
- Streak is a number (0 or more), not "2 of 3".
- Clues are a fourth meter row under Hit points, Threat and Torch, drawn as small squares (smaller than an ability's use squares), centred in the bar column.
- Meters share one grid: labels, bars and counts start at the same x; every bar is the same length; labels never wrap.
- Even space at every hairline; the hero and the last group hug the card's edges; inside them, the lines stay centred on each other.
- Pack is headed "Pack" with empty "Free" slots, no "3 of 3".
- Sea salt is an ability and sits in Abilities. The Bargain group shows only the cost: **5B**, a shield with "+1", "+2" or "+3" inside, labelled "Final foe". When no bargain is struck it is a dashed, empty shield labelled "None struck". A bargain is optional, so it is one of the configurables.
- The roll box drops the "Two dice" row (v8 only, through `window.DV_NO_TWO`), since the die drawing already shows both dice.
- Phone: keeps M1's fold (opens on hero and meters; the arrow opens the rest); the name and class share one line unless the name needs the room.

## Open, not decided

1. **Narrow desktop cards.** With every extra (Sea salt in Abilities plus the 5B Bargain group), 3B needs a card about 890px wide; at a 924px window (842px band) it spills about 45px past the card. Below that it can't fit on one row without labels overlapping. The owner was asked whether 3B should switch to the phone layout below that width or whether desktop cards can be assumed wider; he moved on before answering.
2. **Fixed height for the roll box,** now that Two dice is gone. The owner said "not looking for miracles"; nothing was built.
3. **What exactly 5B should communicate.** He settled on the shield, but said he still needs to think about the message.
4. 5B's friendliness: he finds a shield a friendly symbol but kept it. 5D (spiked burst) and 5E (horned crest frame) are on the canvas as hostile alternatives.

## Spec gaps (for the spec's owner; delve.md read live earlier today)

- Bargain: from the other agent, quoted by the owner. In the engine the price is one figure: the final foe's track starts that many steps further along (1, 2 and 3 in the three editions that have one). A bargain gives gear (pack) or an ability (Abilities). The player's view sends only the sentence "Taking it made the final foe harder to beat." **Showing the figure needs the view to send it**, which is a code change for later.
- Still undefined, per `handoff-2026-10-29-delve-sheet-extras.md`: the light's +1 and refuelling, abilities gained mid-run, the 6/5/3-of-9 counts.

## Earlier handoffs

- `handoff-2026-10-29-delve-sheet-extras.md`: low-fi round 1 (1A–1D), the extras against delve.md, the 1H hairline fix.
- `handoff-2026-10-29-delve-v7-result.md`: v7 result statement; its items 2–5 still queued.
- `handoff-2026-10-29-delve-v6-sheet-1h.md`: 1H band and M1 fold; the extras quoted verbatim.
- `handoff-2026-10-29-delve-v5-sheet.md`, `handoff-2026-10-29-delve-v5-1c-1d.md`: v5 sheet rounds.
- `handoff-2026-10-28-delve-v4-e4.md`, `handoff-2026-10-28-delve-v3-e3.md`: v4 and v3 card and sheet.
- `handoff-2026-10-28-delve-session-v2.md`, `handoff-2026-10-28-delve-session-v2-review.md`, `handoff-2026-10-28-delve-session-playground.md`, `handoff-2026-10-28-delve-session-audit.md`, `handoff-2026-10-28-delve-e-phone-and-next.md`: Delve session pages, earlier rounds.
- `handoff-2026-10-28-word-*.md` (now-card-built, now-card-v10, asset-and-edition-picks, session-v6 to v9): the Daily Word session and now card.
- `handoff-2026-10-27-escape-*.md` (into-app, library-card, lock-row-v2, session-playground and pass-2, session-v3 to v5), `handoff-2026-10-27-session-page-areas.md`, `handoff-2026-10-27-word-session-into-app.md`: Escape and Word into the app, and the session page areas.

## Recent changes

- `playground/pg-dv8.jsx` (new): `Dv8Sheet` (3A, 3B, 3C), `Dv8Cost` (5B), the hardest-case fill (`DV8_FILL`, a second ability from `DV6_ABIL_FILL`), and the bar. Invented run state in `DV8_RUN`.
- `playground/delve-v8.html` (new): the 3B layout CSS, with KEEP comments on each rule the owner asked for.
- `playground/pg-dv7.jsx`: the bar is skipped when `window.DV7_NO_BAR` is set.
- `playground/pg-dv3.jsx` (`Dv3Held`): drops the two-dice row when `window.DV_NO_TWO` is set; other pages are unchanged.
- `playgrounds.json`: entries for v8, the bargain canvas and canvas v2.

## Learnings

- 1H's `.dv7-cell { min-width: 32px }` and `.dv7-grp { min-width: 0 }` let cells shrink below their labels under pressure, so names run together. 3B sets `min-width: min-content` on cells and groups.
- Equal `1fr` cells make a group as wide as its longest label times its cell count (Advantage doubled because of "Inspiration"). `.dv8-adv` uses `auto` columns.
- A percentage SVG width adds nothing to min-content, so hexes shrank to the width of their labels. Use fixed sizes, stepped up with a container query.
- `delve-v8.html` takes 12–15s to mount (it loads the whole app). An empty-root warning straight after opening it is the load, not a fault.

## Action Items & Next Steps

1. After the owner has checked v8: build the 3B-only config playground (more and less: pack 0 to 3, one or two abilities, bargain struck or not and cost 1 to 3, clues present or not, torch present or not, streak 0 or more, long names). Check each at its fewest and its most, desktop and phone.
2. Get the owner's answer on Open item 1 (narrow cards).
3. Name the spec gaps above to the spec's owner, including that the view must send the bargain's figure.
4. Still queued: the v7 handoff's items 2–5.

## Other Notes

- The owner gets frustrated when spacing is fixed by breaking something else. Change only what he names, and measure with the hardest case before handing over.
- The torch, the clues, the sea witch's bargain, Sea salt and the fill items are invented for the playgrounds.
