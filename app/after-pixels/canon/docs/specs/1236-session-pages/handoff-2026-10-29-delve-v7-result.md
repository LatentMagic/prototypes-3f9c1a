---
date: '2026-10-29'
ticket: '1236'
topic: 'delve-v7-result'
status: 'in-progress'
type: 'exploration'
---

# Handoff: Delve v7, the session card's result statement

## Current Focus

The result statement is settled as **3 · Band as it stands in v7** (owner: "We will take this as is", 2026-10-29). The next phase is the owner's second question from v6: **the optional extras** on the character sheet (streak, clues, light, bargain struck, an abilities row that grows). Their rules, as the owner gave them, are quoted verbatim in `handoff-2026-10-29-delve-v6-sheet-1h.md` § "The optional extras". Check each against `delve.md` (read it live; its path is in `handoff-2026-10-28-delve-v3-e3.md`), then propose how 1H and M1 take them without breaking the one row. Offer the options before building.

## Task(s)

**Settled with the owner, in words (2026-10-29):**
- **The result statement is 3 · Band** (`?` none; v7, Result → 3 · Band). One row on desktop: the ending word, a 1px hairline, then the setting's line ("Elsie rescued", "Too late: the ritual was completed"). The word is 28px Bricolage 700 in its status colour. The line is Hanken Grotesk 600 at 16px, the body face, because the owner said the heading face was "not the right font". On a card under 560px the line sits under the word with no hairline: the word at 24px and the line at 16px. The rolls and longest streak are not in it.
- **The roll count and longest streak are dropped from the result.** The owner agreed to both of my reasons: the route already shows every roll, and the streak reads as a stat with nothing to point at. `delve.md` puts both on the share card and in the record; it doesn't ask the session page to show them. **Not yet built:** marking the streak's run of strong hits on the route instead. I proposed it and the owner agreed with the point, but no design has been made.
- **The spent ability use is a plain empty box**, with a 1px control-edge border instead of a 1.5px inset shadow, which blurred into what looked like a gradient. Owner: "I don't think it needs anything complex."
- **M1's top row on a phone:** the hit points and threat cells drop the 36px figure row, so the heading, the bar and the count sit 8px apart and the row is 54px tall, level with the hero. The owner called the old version "janky". This hasn't been checked with him since the fix.

**Refused, never to come back:**
- **Putting the result beside the route** (round 1's concept 2: the result as the route's first column). The owner had already said there is no horizontal room to spare, and I built it anyway. Don't take width from the route for the result.
- **The status strip** (round 2B, a filled strip in the ending's colour): "too distant from the context".

**Open but not chosen:** 2A · Roll box, where the result is the held box's resting state. The owner was interested ("a good use of space") but couldn't judge whether it fits. It stays in v7 as an option; it isn't the decision.

**Still queued from v6 (owner's own):** wrapping at in-between widths (560 to about 1,140px of card); the white selection ring on a selected die ("I do have a problem with the white selection", a reminder he asked for); the selected-room square on a phone; his answer on the invented items (Vanish, Second wind, *Lantern of the drowned saint*, *Evangeline*, +1).

## Critical References

- CLAUDE.md § Ratification and § Replying in chat. This session the owner was angry because I rebuilt something he had ruled out. Before proposing, re-read what he said in the brief that limits the options.
- `handoff-2026-10-29-delve-v6-sheet-1h.md`: the extras, verbatim, and everything settled about 1H, M1 and the die's selection C.

## Earlier handoffs

- `handoff-2026-10-29-delve-v6-sheet-1h.md`: 1H Band, M1, die selection C, the optional extras verbatim, the invented items awaiting an answer.
- `handoff-2026-10-29-delve-v5-1c-1d.md`: 1C, 1D, 1CB, 1DB and the Pack control.
- `handoff-2026-10-29-delve-v5-sheet.md`: v5's 1, 1B, 3, 3B; die canvas v2; the keep-the-lower gap in delve.md.
- `handoff-2026-10-28-delve-v4-e4.md`: v4's concepts; the invented sheet facts.
- `handoff-2026-10-28-delve-v3-e3.md`: v3's session card; the live path to `delve.md`.
- `handoff-2026-10-28-delve-e-phone-and-next.md`, `handoff-2026-10-28-delve-session-v2-review.md`, `handoff-2026-10-28-delve-session-v2.md`, `handoff-2026-10-28-delve-session-audit.md`, `handoff-2026-10-28-delve-session-playground.md`: earlier Delve rounds and the die's ratified states.
- `handoff-2026-10-27-escape-into-app.md`, `handoff-2026-10-27-escape-library-card.md`, `handoff-2026-10-27-escape-lock-row-v2.md`, `handoff-2026-10-27-escape-session-playground.md`, `handoff-2026-10-27-escape-session-playground-pass-2.md`, `handoff-2026-10-27-escape-session-v3.md`, `handoff-2026-10-27-escape-session-v4.md`, `handoff-2026-10-27-escape-session-v5.md`: Escape's session page, now in the app.
- `handoff-2026-10-27-session-page-areas.md`: the session page's areas.
- `handoff-2026-10-27-word-session-into-app.md`, `handoff-2026-10-28-word-asset-and-edition-picks.md`, `handoff-2026-10-28-word-now-card-built.md`, `handoff-2026-10-28-word-now-card-v10.md`, `handoff-2026-10-28-word-session-v6.md`, `handoff-2026-10-28-word-session-v7-result.md`, `handoff-2026-10-28-word-session-v8-canvas.md`, `handoff-2026-10-28-word-session-v9-built.md`: Daily Word.

## Recent changes

- `playground/pg-dv7.jsx` (new): `Dv7Card`, the session card with the result as Today, 3, 3g (no hairline) or 2a; `Dv7ResBand`; `Dv7ResBox` (2A's resting box, with the last roll as a button that opens it, and "Back to the result"); `Dv7Route` (v3's `Dv3E` with the side slot passed in); `Dv7Body` mounts v6's `Dv7Band` with `fold="m1"` and the sheet as played. Bar: Play, Result, Why. Key `pg_delve-session_v7`, default `{res:'3', play:'won'}`. Address pins work as in v6 (`?res=2a&bare=1`).
- `playground/delve-v7.html` (new): v6's loader plus v6's styles, then `.dv7r-*`. 3 · Band's sizes are in `.dv7r-band .dv7r-word` and `.dv7r-band .dv7r-line`, with the phone sizes in the `@container dv2 (max-width: 559.98px)` block.
- `playground/pg-dv6.jsx` (last line): its bar is off under `window.DV6_NO_BAR`.
- `playground/delve-v4.html:42-43`: `.dv4-uses i` is a 1px border box; on, the border takes off-white. This reaches v4 to v7.
- `playground/delve-v6.html`, the phone block after `.fold-m1 .dv5-trk`: the track cells in M1 and M3's top row use `grid-template-rows: auto auto; gap: 8px`. This reaches v6, v7 and `delve-mobile.html`.
- `playground/result-row-canvas.dc.html` (new): the low-fi canvas with rounds 1 and 2. Concept 2 was removed at the owner's word. It holds 0 Today, 1 One line, 3 Band, 4 Caption beside, 2A, 2B and a "Show the tally" tweak. It's background only now.
- `playgrounds.json`: v7 added at the top of 1236.

## Learnings

- The owner wants a concept that changes where or what the thing is, not the same block laid out four ways. Round 1's four were "essentially one concept".
- An overloaded 1.5px outline on a small square reads as a gradient on a 1x screen. Use whole pixels for borders on small marks.
- The bars in M1 looked janky because the 36px figure row, which is for lining cells up on desktop, was carried onto a phone row that has no other cells to line up with.
- For the loader pages, wait about 8 seconds before measuring. Earlier checks found no bar and no card, which was a false alarm.
- `delve-mobile.html`'s frames can be measured through `iframe.contentDocument`, but screenshots don't capture them.

## Artifacts

- `docs/specs/1236-session-pages/playground/pg-dv7.jsx`, `delve-v7.html`, `result-row-canvas.dc.html`
- `docs/specs/1236-session-pages/playground/pg-dv6.jsx`, `delve-v6.html`, `delve-v4.html` (edited)
- `playgrounds.json`

## Action Items & Next Steps

1. The optional extras: check each rule against `delve.md`, name any the spec doesn't hold, then offer two or three ways 1H and M1 take them, checking the fullest case on one row at the owner's width (about 1,393px). Offer before building.
2. The streak on the route: a design for marking the run of strong hits, since it left the result.
3. Ask the owner to look at the fixed M1 top row.
4. The v6 queue: in-between widths, the white selection ring (remind him), the selected-room square on a phone, the invented items.
5. When he's ready: whether 1H, M1, C, 3 · Band and the v3 card go into `app/` together. That's my recommendation, not his decision.

## Other Notes

- Before building, re-read what the owner said in the brief that limits the options (for example, "we can't really add more" horizontal space).
- The streak of 3 on the Overwhelmed ending in `result-row-canvas` was made up for the canvas only.
- This session's screenshots and the 2026-10-28 ones were deleted from `uploads/` (owner, 2026-10-29). Its folders are referenced by earlier handoffs and stay.
