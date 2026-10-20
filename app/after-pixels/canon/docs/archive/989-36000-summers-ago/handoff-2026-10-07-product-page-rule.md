# Handoff: 36,000 Summers Ago product page (#989)

2026-10-07

## Decision, ratified by the user in chat

**A product page tells a stranger what they'll do and why they'd want to, using only things that are true, so every line has to make the game more appealing and none should excuse or qualify it.**

Applies to every game page (`app/gs-game.jsx`), not only this one. It is not held by an upstream spec yet; carry it back to the repo.

## Landed

- Name "36,000 Summers Ago" (`GS_NAME.hunter` in `app/gs-data.jsx`). Name is from ticket #989 and is not ratified upstream.
- Card blurb, pitch, play-box steps (three, none blank), facts row (what your AI does, how often, players) and week-card line in `app/gs-game.jsx`.
- Read: `pack-outline.md` only (last ~1,450 characters of section 20 cut off). Pack files `01` to `11` not read.

## Open

- Whether "Learning activity" stays as this game's kind (label and crumb).
- Age and length remain gaps ("—").
- Achievements: how they appear on the page is design still to come per the ticket.
