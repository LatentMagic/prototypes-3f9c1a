---
date: '2026-10-28'
ticket: '1236'
topic: 'delve-session-playground'
status: 'in-review'
type: 'exploration'
---

# Handoff: Delve's session page, playground v1 (four concepts)

## The brief

Everything the owner supplied for this is in `uploads/`, as he dropped it:
- `uploads/2026-10-27_delve-session-playground/`:
  - `delve-session-playground-prompt.md`: the brief this playground was built against.
  - `delve.md`: the game spec, as attached (monorepo main `55ae858cb`). The live spec upstream wins if the two differ.
  - `joe-solved-shared-2026-10-28.png`: the shared form for the result statement.
  - `today-option*.png`: the first exploration's three options, and the owner's capture of the gap at the top right.
- `uploads/code/`: that exploration's source (`delve-1.jsx` to `delve-3.jsx`, `delve-model.jsx`, `delve-notes.md`) and the app files supplied with it (`gs-data.jsx`, `gs-escape.jsx`, `gs-session.jsx`, `gs-word.jsx`), as they were on 2026-10-28.

The same brief is upstream in business-ops at `work/apps/after-pixels/lm-1236-session-pages/_outputs/prompts/2026-10-27_delve-session-playground/`.

## Where

`docs/specs/1236-session-pages/playground/delve-v1.html` + `pg-dv1.jsx`, and in `playgrounds.json` under 1236. It loads the main build live from `index.html`, as `word-v11.html` does, and opens the session page in the Pass view. The bar at the top has:
- **Concept:** A Route, B Descent, C Four rolls, D Rooms.
- **Die:** Hex, or Faceted (the d20's front face drawn on it).
- **Play:** Won, Fallen, Overrun (the hard play), In progress, Week ended.
- **Why:** each concept's idea, how it links moments to the path, and the moment rule.

Nothing in `app/` changed.

## What every concept shares

- **Head:** the store's quiet head, as Escape's (`GS_SESSION_QUIET.delve`): "Delve" over the setting's name, the date, and Share (Play in progress). No result or figures.
- **Result statement:** the shared form from the brief. The setting's ending words at 34px (28px under 480px, wrapped balanced): success green for a win, warning yellow for fallen, overrun and the week ended, and plain text for In progress. Under it, the hero and the ending's kind ("Bryn the Fighter · Won"). The words carry the outcome, so colour never does it alone. Long endings: "Too late: the ritual was completed" takes two lines on a phone and nothing is cut.
- **Figures** at the top right, which fills the gap the owner flagged: rooms reached, threat and hit points, each a number over a row of pips.
- **The die:** a flat hexagon, one per roll, with the kept number in it.
  - Strong hit: filled green. Weak hit: amber outline. Miss: a dark mark, as Escape's wrong try is.
  - Natural 20: a second rim. Natural 1: a crack. Two d20: a second die behind.
  - So tier shows by shape as well as colour. No cover colours, no light ground.
- **Linked selection** (the "phenomenal" idea): hovering previews, pressing holds. A moment lights its die and its room, and a die lights its moment. It opens on the last roll. A line under the picture names the roll held. This would apply to every game.
- **Every move:** Escape's collapsed list, unchanged.

## The four concepts

- **A · Route.** The path left to right, one column per room stood in, numbered by first entry. Going back is a column carrying the room's number again, marked "Back". The rolls stack under each column, and four moment tiles sit above the route.
  - Phone: numbers only; the tiles go two by two without facts.
- **B · Descent.** The path as a stair down the page. Each room is a step set in by its depth, so going back steps out again. Moments are flags on their step.
  - Laptop: the held moment is drawn large in a sticky side column.
  - Phone: it opens under its own step, so the control and the picture stay on screen together.
- **C · Four rolls.** The moments are the page: four big dice in order, lettered A to D. The run sits under them as one strip of small dice split by room, each letter marked over its die.
- **D · Rooms.** One tile per room, with its visits inside it. A room you went back to holds both visits. The route under the tiles is the order of rooms, as numbers and arrows, and a number lights its visit.

## Open items: what I chose

- **Moments, the same rule in every concept:**
  - the big success: the first natural 20, else the strong hit that beat the target by most;
  - made it exactly: total equal to the target;
  - the big miss: the first natural 1, else the miss that fell shortest;
  - the last roll, titled by ending ("The blow that won it", "The blow that ended it", "The last roll", "The latest roll", "The last roll played").
  - A roll is used once, a missing one is left out, and they show in the order they came. I kept one rule so the concepts compare on layout; the owner rules on the rule itself.
- **Spoilers:** the page names rooms and options ("Rifle the stolen sacks"), never a foe's weakness. The share text stays spoiler-free. Not settled.
- **Turned back** (a fourth ending; this setting has no levels):
  - every concept takes it as one more ending in warning yellow;
  - A, B and D end the path at the room you left from;
  - C's last moment would be titled "Where you turned back".

## Where this departs from the brief or the spec

- **Hard play:** the spec allows six rooms, but the Goblin Warren has five. The hard play gets its length from going back three times: 8 rooms stood in, 22 rolls, a natural 1, a natural 20, three rolls with two d20, and the bone gate forced on the third try. It ends overrun with 1 HP left.
- **Fallen** is invented in the same line form. Won and In progress are the engine's recorded runs (`GS_DV_WON`, `GS_DV_LIVE`).
- **First room:** the record names no room before the first "Entered", so the page calls it "First room".
- **Threat:** only its final value is drawn, because the record doesn't give threat per roll.
- **Record type:** the playground's plays use `kind: 'delve-pg'`. The session page's Delve branch would otherwise bypass `GS_SESSION_BODY`. Building it in means removing that branch.

## What the page depends on

- **Recorded and sent today, as line text:** each roll's stat, die, total, target and tier, plus HP after a hit; the rooms entered and gone back to; gear, locks and the turn.
  - The page parses these. The engine should send them as data.
- **Recorded, not sent:** the hero and setting of a run in progress, and whether the foe fell to its weakness. Nothing shows the weakness yet.
- **Worked out:** hit points left (from the last HP line), the longest streak, and the moments.
- **On the seed only:** threat reached and rooms reached (`threat`, `reached`).

## Found in Escape and Daily Word

- Escape's session page states its result as "Escaped" beside the open door, with the verdict under par or over in green or amber with an icon. Its now card shows one coloured word.
- Daily Word's result is a Tag one tile high on the board.
- Neither uses the brief's shared form yet. Delve's is a third form, the one the brief asks for.

## Not checked

The background check was still running at handoff. Every concept × play × width at 390 and 1185 still needs a look.

## Next

1. The owner reacts to A to D. Change only what he names.
2. Then the die drawing and the moment rule, as their own small passes if he wants.
3. Then the now card.
