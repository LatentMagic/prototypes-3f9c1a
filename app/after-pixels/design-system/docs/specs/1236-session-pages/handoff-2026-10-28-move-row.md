---
date: '2026-10-28'
ticket: '1236'
topic: 'move-row'
status: 'complete'
type: 'implementation'
---

# Handoff: move-row — a row for a play's moves

## Current Focus

Built and rendered. Edge card check at 320/440/760: 18 rows · ListRow padding · no overflow · one-line rows 62px · no chevrons. Owner approved the look ("looks bloody good"). Product prompt handed over; waiting on the product agent's build.

## Task(s)

From the delta brief "a row for a play's moves" (pasted in chat, 2026-10-28). Reference images `ref-move-row-phone-390.png` and `ref-move-row-desktop-1280.png` were named in the brief but did not arrive in the project; not consulted.

- Done: MoveRow + MoveList, guidance, two cards, ListRow and Disclosure guidance lines.
- Not done: render check (above). No product prompt written yet.

## Decisions

- 2026-10-28, ratified by the owner: MoveRow is its own component; ListRow stays unchanged. Reason: easiest, and it leaves room for more ideation on this row later.
- 2026-10-28, ratified by the owner: line two wraps as built (each part whole, a part that doesn't fit starts a new line). Reason: right for this kind of row, and one more reason it is its own component.
- 2026-10-28, accepted by the owner on how it renders: the Disclosure rule for holding a list. The owner saw nothing wrong in either card and presumed it fine; the rule itself was not reviewed. Revisit if a list in a Disclosure ever looks off.

## Yours to decide: what was chosen

- **Own component, ListRow unchanged.** `MoveRow`/`MoveList` in `components/surfaces/MoveRow.jsx`. ListRow is built around fitting text to two fixed 20px lines, forms, chevron and press; a wrapping, non-opening row would need a branch through all of it. MoveList reuses `.mcp-rows` (separators, container, card bleed), so the look is shared without touching ListRow's code. It renders an `ol`: the lines are in the order played.
- **Line two.** Flex-wrap, 12px gap (ListRow's `meta` gap). Each part is one unit: parts sit side by side while they fit; a part that doesn't fit starts a new line; a long part wraps within itself at spaces (`overflow-wrap:break-word`, so only an unbreakable word longer than the line would break). No visible separator: colour (first in ink, rest muted) tells the parts apart, and a dot would dangle at line ends. A hidden ", " sits between parts so screen readers and copy read them apart. Tabular numerals for dice.
- **Disclosure.** Guidance gains a line: it can hold a MoveList. New CSS: a list in a Disclosure body drops the body's 16px padding and muted colour, runs to the edges, with a 1px line above the first row. The rows set their own colours, so the muted body never reaches them.

## Set by this brief (owner has not ruled)

- No press state: the row is a plain `div`, no hover, press or focus stop.
- The list's container is the Disclosure.
- How a long list is cut short is left out; MoveRow guidance says it is not settled (numbered pages vs "Show more").

## Recent changes

- `components/surfaces/MoveRow.jsx`, `MoveRow.d.ts`, `MoveRow.prompt.md` (new)
- `components/components.css`: `.mcp-move*` rules after `.mcp-row.is-sub>.mcp-row-note`; `.mcp-disc-body>div>.mcp-rows` after the Disclosure body rule. No `.mcp-row` rule changed.
- `components/surfaces/ListRow.prompt.md` (first paragraph), `ListRow.d.ts` (top comment): point to MoveRow.
- `components/surfaces/Disclosure.prompt.md`, `Disclosure.d.ts`: a line on holding a list.
- `readme.md`: MoveRow, MoveList in the surfaces index.

## Artifacts

- `components/surfaces/move-row.card.html`: Delve "Every roll" (9 lines) and Daily Word No. 212 "Every guess" (5 lines), each in an open Disclosure, 760px measure.
- `components/surfaces/move-row-edge.card.html`: Turn, Wisdom, Dexterity, Room, Guess 1, Hint at 320, 440 and 760 (a 1024 page's measure; ListRow's edge card uses 660), each under a reference ListRow. Check line: padding vs ListRow, overflow, one-line rows at 62px, chevrons.

## Learnings

- The product's session list today is `gs-lines` in `/projects/9aec15ee-…/app/gs-session.jsx` (`GsSessionRecord`, `list`): label, then parts joined with " · ". Its data is `s.lines` as `[label, ...parts]` arrays. Delve's session puts the list inside `gs-pitch` beside the tracks; the brief places it closed below the game's own section.
- A new component's card shows "type is invalid" until the bundle recompiles at end of turn.

## Action Items & Next Steps

1. Render both cards; confirm the check line reads ListRow padding · no overflow · one-line rows 62px · no chevrons; fix anything off.
2. Re-open "ListRow edge cases": must render as before (no `.mcp-row` rule changed).
3. Owner review of the three choices above.
4. Then a one-line-per-change prompt for the product agent (refresh `_ds/`, check `components/surfaces/MoveRow.jsx` is there; session list moves to MoveList in a closed Disclosure).
