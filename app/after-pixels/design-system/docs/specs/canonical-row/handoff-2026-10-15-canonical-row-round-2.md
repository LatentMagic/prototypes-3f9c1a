---
date: '2026-10-15'
topic: 'canonical-row'
status: 'in-progress'
type: 'exploration'
---

# Handoff: canonical-row — round 2, five options from a content audit, awaiting the owner's review

## Current Focus

Round 2 is built: `docs/specs/canonical-row/playground/canonical-row-2.html` has options 11 to 15, plus 0 (the shipped ListRow) for reference. Next: the owner reviews it, starting with **History at 320 and 390**. Take notes in `notes.md` while they review. Do not change `ListRow` until they pick. Round 1 (ideas 0 to 10, `canonical-row.html`) is background: the owner reviewed it and rejected it for History on phones.

## Task(s)

- Done: owner review of round 1, recorded in `notes.md` under "Owner review of 10c". History at 320 and 390 was the worst surface: rows were tall and uneven, slots moved between rows, and the time was off centre. 8 (Nested) is rejected because History must stay a flat list in time order, though a replay row could have its own look. 7 (Truncate) couldn't hold the content. Today's shipped row is close at 390, and 768 is broken. Art has to be part of the design. The owner asked for an open redesign across every surface.
- Done: the content audit, `docs/specs/canonical-row/audit-row-content.md`. It covers what each surface must say, the width budget at 320 (about 102px for a title beside a cover and the time), short forms for results, state, art, and the wide layout.
- Done: the round 2 playground (11 Clip, 12 Cover names the game, 13 Replay on the result line, 14 One line, 15 Fit by width). It's registered in `playgrounds.json`, and the README and `notes.md` are updated.
- Planned: the owner's pick, then fold it into the design system's `ListRow`, then the product-agent message.

## Critical References

- `CLAUDE.md`: playground rules, the `<base>` false positive, and how to write product-agent prompts.
- `docs/specs/canonical-row/audit-row-content.md`: the reasoning behind every round 2 option.
- `components/surfaces/ListRow.prompt.md` and `components/media/Cover.prompt.md`. 13 and 15 drop ListRow's separate note slot on phones. 14 adds a symbol, which breaks the "never a symbol that has to be learnt" rule. Any of these needs the prompt rewritten.

## Recent changes

- `playground/canonical-row-2.html`: the entry page. Loads `pg-row.css` (round 1 chrome), `pg-row2.css`, `pg-row-data.jsx` (round 1 seeds, surfaces and art are reused) and the two modules below.
- `playground/pg-row2-data.jsx`: `cqShort()` (full result → short form), `CQ_PAINS`, `CQ_IDEAS` (stance, cost, behaviour across widths, readouts).
- `playground/pg-row2.css`: the `.cq` row and each option's container queries on `crl` at 439, 639 and 640px.
- `playground/pg-row2-app.jsx`: `CQRow` (one markup: `.cq-lead`, `.cq-t` > `.cq-g`/`.cq-e`, `.cq-l2` > `.cq-xp` + `.cq-r` > `.cq-rl`/`.cq-rs`, `.cq-w`, `.cq-x`, `.cq-go`), `CqDsList` (option 0), frames that scale to fit, two views. State is kept in `localStorage` under `pg_canonical-row-2_v1`.
- `notes.md`: the owner's review notes and a "Round 2" section. `README.md` and `playgrounds.json` list round 2.

## Learnings

- At 320, a mixed-game title can't fit on one line beside a cover and the time. The only choices are wrap, cut, or drop words. The cover already names the game, so the game's name is the first thing to drop (12, 15). It stays in `aria-label`.
- Short results drop the verdict and keep the score: "6 moves", "3 of 6", "1 mistake", "Ready", "Done". The product would supply both forms. In the playground they are derived from the full form by `cqShort`, which is not how the product should do it.
- In 15, under 440px, line two spans under the time (`"l t w g" "l r r g"`). Otherwise "Replay · ✓ 5 moves" gets cut at 320. In 13 the time is centred and takes width from both lines, so Replay rows get cut at 320. That cost is stated in 13's readout.
- In the wide layout Replay has its own 4rem column before the result. When Replay was a prefix inside the result column, results didn't line up.
- To reset the playground, set the key to `{opt:15,view:'opt',worst:false,widths:[320,390,640,768],surf:'history',w:320}`.

## Artifacts

- `docs/specs/canonical-row/playground/canonical-row-2.html` (asset "Canonical row, round 2"), `pg-row2-data.jsx`, `pg-row2.css`, `pg-row2-app.jsx`
- `docs/specs/canonical-row/audit-row-content.md`
- `docs/specs/canonical-row/notes.md`, `README.md`, `playgrounds.json` (updated)

## Action Items & Next Steps

1. Owner reviews round 2, starting with History at 320 and 390 in the "One surface, every option" view. Take notes in `notes.md` without changing the page they're on.
2. On a pick, re-read `ListRow.jsx`, `ListRow.prompt.md`, `Cover.prompt.md` and the `.mcp-row*` block in `components/components.css`. Add the container-query rungs, a `short` result prop, and an edition-only title when a cover is present (if 12 or 15 is picked). Fix the cover size to the line count. Use fixed wide columns. Remove the `no-note` centring.
3. Update `rows.card.html` with real product copy, render it, and compare with the product. Run `check_design_system`.
4. Product-agent message, one line per change. It will include supplying a short result for every outcome in each game.
5. Not yet tested: 1024 and wider, Safari, and real covers in the product beside edition-only titles.

## Other Notes

- The owner prefers concise replies. When noting their review, edit files without opening anything else on their screen.
- 320 is a floor that must hold, but the design target is 375 to 390.
- Earlier handoffs: `handoff-2026-10-14-canonical-row-playground.md` (round 1).
