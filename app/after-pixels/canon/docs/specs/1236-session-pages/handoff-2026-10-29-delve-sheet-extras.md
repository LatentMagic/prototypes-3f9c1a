---
date: '2026-10-29'
ticket: '1236'
topic: 'delve-sheet-extras'
status: 'in-progress'
type: 'exploration'
---

# Handoff: Delve character sheet, the optional extras (low-fi round 1)

## Current Focus

The owner reviews four low-fi concepts for where the extras go, in `playground/sheet-extras-canvas.dc.html`. The extras are quoted verbatim in `handoff-2026-10-29-delve-v6-sheet-1h.md` § "The optional extras". He has said the band has no room left, so no concept adds width to the band except B and C's granted ability (named as their cost). Nothing is chosen.

## Task(s)

- **Built, low-fi, not ratified:** 1A A second band ("This run" row under the sheet, gone when nothing applies); 1B On the route (light under each room, clue and bargain tags on their room, a streak line beside its dice); 1C In the roll box (a "When rolled" block, the run as of the picked roll); 1D The sheet's second face (a Hero · This run switch in the hero cell swaps the band). Tweak: Extras none / streak / all.
- **Bug fixed:** the hairline between Threat and Stats in 1H was missing. M1's fold button sits between them in the markup, so `.dv7-grp + .dv7-grp` stopped matching. Now `~` (`delve-v6.html`, reaches v6, v7, `delve-mobile.html`).

## The extras against delve.md (read live 2026-10-29)

- Streak: held (Strong-hit streak). The spec's tiers are strong hit, weak hit, miss; "success / partial success / failure" have no separate meaning in it.
- Clues: held (Clue, clue hunt "until enough pieces are found"). "6 of 9 editions" is not in the spec.
- Light: held as a module ("a torch that burns down"; with the light out, a foe's miss hurts more). Not in the spec: "1 more", refuelling by gear, "5 of 9".
- Bargain struck: only as a module example ("a bargain's price is the villain learning you are coming"). Not in the spec: that it gives gear or an ability, "3 of 9".
- Abilities growing mid-run: not in the spec.

## Artifacts

- `playground/sheet-extras-canvas.dc.html` (new), `playground/delve-v6.html` (rule fix), `playgrounds.json` (entry added).
- Made up for the canvas: the torch 4 of 6, the sea witch's salt bargain, Sea salt (heals 4), streak of 3 across The warren and Snaggle's den.

## Action Items & Next Steps

1. Owner's pick or mix of 1A–1D, then build it in hi-fi on v7 (desktop 1H and M1), checking fullest and fewest at his width.
2. Name the spec gaps above to the spec's owner.
3. Still queued: the v7 handoff's items 2–5.
