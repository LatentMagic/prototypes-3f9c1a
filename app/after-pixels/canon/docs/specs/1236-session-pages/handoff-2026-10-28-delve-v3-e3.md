---
date: '2026-10-28'
ticket: '1236'
topic: 'delve-v3-e3'
status: 'in-progress'
type: 'implementation'
---

# Handoff: Delve session page, E3 — three whole concepts built, waiting on a pick

## Current Focus

The owner picks one of v3's three concepts (`playground/delve-v3.html`). He has not judged them yet. The thread on how a key moment shows in the held box ran to the end of the session. The last build puts a diamond in the box's top right, as he asked. He hasn't seen it yet; check it with him first. E4 (the character sheet) comes after E3 settles. Nothing is ratified.

## Task(s)

**Built, in `playground/delve-v3.html` + `pg-dv3.jsx`, concept E only.** The bar is Play, Concept and Why. Each concept fixes every axis at once:
- **1 · Ledger**: Triumphed / Fallen / Overwhelmed. Under the line, the share card's tally ("22 rolls · longest streak 3"). The held box shows the die and the moment's name centred, then one labelled row each for Room, Action, Roll, Two dice, Outcome and Cost. There is a rule between rooms.
- **2 · Sum**: Victory / Fallen / Lost. Under the line, how it ended ("Threat full on roll 22, in The shrine cavern"; HP left on a win). The held box writes the roll out as its sum, then a bar to the target with "needed 12", then the outcome. A line runs down each room, behind its dice.
- **3 · Scoreboard**: Cleared / Fallen / Doomed. The line and the roll count are one sentence ("… after 22 rolls"). The held box shows rolled against needed, large, with the outcome under it. No column lines.

**Shared by all three:**
- The moment dice on the route have no title (brief item 1). The dice are unchanged from v2.
- A key moment picked shows an off-white diamond in the held box's top right corner. An ordinary roll has none. Nothing is marked on the route.
- The moment line ("Natural 20", "Made it exactly") is gone everywhere. The Ledger also no longer writes "natural 20/1" in its Outcome row. Sum and Scoreboard still print the natural beside the outcome; the owner hasn't been asked about those.
- Character sheet: v2's placeholder under a "Character sheet" heading at every width: hero, hit points, threat, and gear when the run has any. Rooms reached is removed.
- Not studied, left as v2: the platform top, the sheet's content, Every move.

**Planned:** E4, the character sheet, three goes, desktop and phone. The brief is in `review-2026-10-28-delve-e-brief.md` § Character sheet.

## Critical References

- `review-2026-10-28-delve-e-brief.md`: the E3 items (0–8) and the character sheet brief, verbatim.
- Delve spec, read live: `LatentMagic/business-ops` `work/apps/after-pixels/lm-1236-session-pages/_outputs/prompts/2026-10-27_delve-session-playground/delve.md`. The endings are won, turned back, fallen and overrun; the display words are open. A check is a stat plus a d20 against a fixed target. An outcome is a strong hit, a weak hit or a miss. Inspiration or a streak rolls two d20 and keeps the higher. The share card counts rolls and the longest streak.
- CLAUDE.md § Page rules, session page; the design law `guidelines/visual-foundations.md`.

## Earlier handoffs

- `handoff-2026-10-28-delve-e-phone-and-next.md`: E's phone fix in v2, and the E3 and E4 plan this round follows.
- `handoff-2026-10-28-delve-session-v2-review.md`: the owner's first review of v2.
- `handoff-2026-10-28-delve-session-v2.md`: how v2 was built (concepts A, C, E, F, result forms, plays).
- `handoff-2026-10-28-delve-session-playground.md`: the v1 playground.
- `handoff-2026-10-28-delve-session-audit.md`: the Delve audit before v1.
- `handoff-2026-10-27-escape-session-v5.md`, `-v4`, `-v3`, `-playground-pass-2`, `-playground`: Escape's session page studies (its lanes are in v5).
- `handoff-2026-10-27-escape-into-app.md`, `-escape-library-card.md`, `-escape-lock-row-v2.md`: Escape built into the app, its now card and its lock row.
- `handoff-2026-10-27-session-page-areas.md`: the session page's areas (platform top, game below).
- `handoff-2026-10-27-word-session-into-app.md`, `handoff-2026-10-28-word-session-v6.md`, `-v7-result`, `-v8-canvas`, `-v9-built`, `-now-card-v10`, `-now-card-built`, `-asset-and-edition-picks`: Word's session page and now card.

## Recent changes

- `playground/pg-dv3.jsx` (new):
  - `DV3_CONCEPTS` near the top holds the three bundles.
  - The model, die and route are copied from `pg-dv2.jsx` and renamed `dv3*`; the CSS classes keep v2's `dv2-` names.
  - `dv3Under` builds the three lines under the word.
  - `Dv3HeldLedger`, `Dv3HeldSum` and `Dv3HeldBoard` are the three held boxes.
  - `Dv3Band` draws the corner diamond.
- `playground/delve-v3.html` (new): v2's shared and E CSS, trimmed. Below it: the held-box designs, the column-line study (`.is-cols-between`, `.is-cols-lanes`), and `.dv3-mk`, the diamond, at the end.
- `playgrounds.json`: v3 entry under 1236.
- `github.md`: Last sync refreshed for the `delve.md` read.

## Learnings

- **One switch per axis was rejected.** The owner wants two or three whole concepts and the plays, not a grid of switches ("I don't want to deal with 7,000 configs"). Bundle every axis into the concepts; the bar is Play, Concept, Why.
- **For the key moment, the owner asked for a mark on the held box from the start.** I built six other ideas before getting there: marks on the die, a numbered walk, an off-white edge, an inverted box, a banner, Delve's wine. He rejected them all, so take a small, clear ask literally.
- **The owner says "wins" for the big moments.**
- **Don't repeat what the die shows:** no "Natural 20" or "Natural 1" written beside a die that already shows it.
- **Rooms reached is never shown.** The owner said it once and was annoyed to be asked again.
- **Threat is not recorded for each roll.** The owner agrees; keep it out.

## Artifacts

- `docs/specs/1236-session-pages/playground/delve-v3.html`, `pg-dv3.jsx` (new)
- `playgrounds.json`, `github.md` (updated)

## Action Items & Next Steps

1. Show the owner the corner diamond (pick a big moment, then an ordinary die).
2. Get his pick of concept 1, 2 or 3, or a mix, and record it here with the date.
3. Ask whether Sum and Scoreboard should also drop the "Natural 20/1" words (likely yes, on the Ledger's reasoning, but not asked).
4. Build E4, the character sheet, as a new playground (`delve-v4.html` + `pg-dv4.jsx`) on what E3 settles. Read the spec's Gear, Hero ability, Inspiration and Carry limit entries first. Rooms reached stays out. Add it to `playgrounds.json`.
5. Nothing goes into `app/` until the owner accepts. No `CHANGELOG.md` entry; this is playground work.

## Other Notes

- The owner's leans from the brief: no moment titles (applied), a "Character sheet" heading (applied), and a sheet of "big ideas, not a cram" for E4.
- Don't touch v2 (`delve-v2.html`, `pg-dv2.jsx`); it is the record of the earlier round.
