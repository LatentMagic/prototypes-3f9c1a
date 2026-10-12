---
date: '2026-10-12'
topic: 'game-editions-list'
status: 'blocked'
type: 'exploration'
---

# Handoff: a game's editions, the owner's first reaction to the playground

## Current Focus

The owner disagrees with all three options. They expected the card's "All cases" link to keep going to History. All three options change where it goes: a new page (1), a panel (2), or no link at all (3). The owner says the brief did not ask for that.

The brief says the opposite, under "What is known": "What the link says and where it goes is open." I quoted that to the owner. The owner replied with frustration, then "Oh", and then asked for this handoff. They have not said whether the link must keep going to History.

**First thing next session:** ask one question and wait. Must "All cases" go to History in every option, with the full list reached some other way? Don't change the rig until the owner answers.

## Task(s)

- Done: the playground for the brief "a game's editions on its library game page, playground" (2026-10-12). What was built, the options and the choices made are in `handoff-2026-10-12-game-editions-list-playground.md` (same folder). That file is still the reference for the build.
- Not done: the owner's review. They had trouble finding the new list in options 1 and 2. In option 1 they landed on the new "All cases" page and read it as History, because it is built from History's parts. Nothing has been ratified.

## Critical References

- `CLAUDE.md`: the ratification rule, and "Do not be swayed by frustration". Find the specific defect. Don't reverse a position the brief supports just because the owner is angry; ask instead.
- The brief's line "What the link says and where it goes is open", under "What is known".
- `app/gs-history.jsx:231` `LbRecent`: today's card, whose link opens `history { game, from }`.

## Recent changes

- New: `docs/specs/game-editions-list/playground/index.html`, `pg-editions.jsx`, `handoff-2026-10-12-game-editions-list-playground.md`.
- `playgrounds.json`: added the `game-editions-list` ticket at the top.
- `app/` untouched.

## Learnings

- The owner reads "All cases" as History's door. A design that keeps the link going to History and adds a separate way to the full list is probably expected. Examples: a second link on the card, a way into the list from History narrowed to the game, or the list sitting in the card.
- Option 1's page looks so much like History (H1, search, Filters, rows) that the owner did not see it was a new page. If option 1 survives, it needs to look clearly like a different page.
- Option 2's panel opens only from the card's link. The owner could not find it unprompted.
- `ready_for_verification` reports 42 missing files for this entry. That is the known `<base href="../../../../">` false positive (GOTCHA 11). The rig rendered in my preview and in the owner's.

## Artifacts

- `docs/specs/game-editions-list/playground/index.html`
- `docs/specs/game-editions-list/playground/pg-editions.jsx`
- `docs/specs/game-editions-list/handoff-2026-10-12-game-editions-list-playground.md`
- This handoff

## Action Items & Next Steps

1. Ask the owner the one question above and wait.
2. If the link must go to History, propose (don't build) how each option reaches the full list without that link. Then rebuild after the owner agrees.
3. If the owner accepts that the link moves, walk them through each option's route with numbered clicks before they review.
4. Keep the parked History playground in every handoff (`docs/specs/history-filters-redesign/`). The owner likes its option 1, and one question is still open there: does "Missed" on Played mean a lost play or an unplayed edition?

## Other Notes

- The owner was frustrated in this session. Keep replies short, one question per turn, and give the clicks to every surface.
- Don't add a "Parked" note to the History playground's handoff. The owner said it would go stale.
