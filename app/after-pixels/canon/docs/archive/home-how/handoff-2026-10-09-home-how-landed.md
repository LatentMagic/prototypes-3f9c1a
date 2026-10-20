---
date: '2026-10-09'
topic: 'home-how'
status: 'done'
type: 'implementation'
---

# Handoff: home-how — the home page's how-it-works band

## Decisions

- **Ratified by Joe 2026-10-09:** option 4, line c. "Get started" and "Who does what" become one band: "Your AI does the talking. The game keeps the score." with "See how it works" (→ How it works), beside a Pass note ("Play every game and every edition. Try it free for seven days." + "About the Pass"; wording ratified 2026-10-09).
- The hero's "See how it works" goes to How it works (`gs.goHow`), not the home band.

## Changes

- `app/gs-home.jsx`: the two sections replaced by one `#gs-how` band.
- `index.html`: `hm-*` styles after `.gs-who2`.

## Not carried

- "About two minutes" and "No card needed" are no longer on the home page.
- Rig: `docs/specs/home-how/playground/`. Since the change landed, its option 0 shows the new band rather than the old two sections.
