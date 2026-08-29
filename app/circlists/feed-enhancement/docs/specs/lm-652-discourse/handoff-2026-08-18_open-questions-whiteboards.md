---
date: '2026-08-18'
ticket: 'LM-652'
topic: 'open-questions whiteboards'
status: 'in-progress'
type: 'exploration'
---

# Handoff: open-questions whiteboards — four boards, nothing picked

## Current Focus

The user has been handed `pg-wb-open-questions.html` and has **not yet responded**. The
next session's first job is to take their picks — board by board, option numbers — and
only then decide what to do with them. Nothing on any board is ratified, nothing has
been recommended, and no option has been landed in the candidate build. Do not read
"built it" as "chose it".

The four questions, in the order the boards run:

1. **The way-through mark** — the glyph in the feed card's meta row that leads to the
   card's own surface, at rest and inverted (inverted = a watched card holds something
   unseen).
2. **How you send a message** — committing and abandoning a written message, on both of
   the surface's typing boxes.
3. **Leaving the writing face** — how a contributor exits the pushed thought writer,
   keeping or discarding what they wrote.
4. **What the surface is called** — the eyebrow at the head of the thread.

Background only: the §3 reveal item (up to three opening turns at the reveal), Part B
copy, "watching" as the wrong word, domain-on-closed-card, `CAND_OWN_MIN = 3`. All still
queued behind these four; none was touched this session.

## Task(s)

Built one whiteboard page carrying all four questions. Per `skills/build-playground`:
whiteboard shape (no app shell, no rail, no config panel — everything visible by
scrolling), real components mounted rather than redrawn, one question per board, options
differing on structure and behaviour only.

Per board:

- **1 · mark** — six marks (disc, doorway, turned page, stack, carry-on-through,
  gathering), each drawn inside the **real** `FeedCard` (`app/feed.jsx`), shown at rest
  beside inverted. Pressing a mark turns that card's state over. The inverted card also
  carries `CandFold`, since that is the only state where both marks sit on one card.
- **2 · send** — five answers (arrives with the words / inside the field / always there,
  quiet / the return key / the row commits), each drawn on **both** typing boxes (inline
  reply and foot) at 390 and desktop. Fields are live and sending actually posts a turn.
  One driver sets all five to empty · mid-typing · ready.
- **3 · leave** — five ways out (back+tick / two words at the foot / arrow+bin /
  nothing at all / finish from here) on the direction-2 face as built. Live typing;
  drivers for empty-vs-paragraph and domain present-vs-absent.
- **4 · name** — eight eyebrows in place at the head of a real thread, static, same
  position and treatment throughout. `the conversation` marked baseline.

Each board's dark strip carries the question in prose plus every option's **stance and
cost**; no note lives inside an option, so the options stay comparable.

## Critical References

- `skills/build-playground/SKILL.md` (+ `references/`) — the rig rules this page follows.
- `docs/specs/lm-652-discourse/README.md` — the ticket's working requirements, [R]/[W]/[O].
- `CLAUDE.md` — the ratification rule, which governs everything above.

## Recent changes

New files only. The candidate build (`circlists-lm652.html`, `cand-lm652-*.jsx`) and the
app (`app/*`) were **not modified**.

- `pg-wb-open-questions.html` — root entry (must be at root for `app/*`, `tokens.css`,
  `brand/` to resolve). Holds the whiteboard chrome CSS and the app classes the mounted
  components need (`.circ-cardaction*`, `.circ-card*`, `.cand-*`), copied from
  `circlists.html`.
- `docs/specs/lm-652-discourse/wb-q-shell.jsx` — chrome, strips, frames, drivers, seed,
  thread furniture (`WbTurn`, `WbThreadHead`, `WbGroup`), `useWbState` persistence.
- `docs/specs/lm-652-discourse/wb-q1-mark.jsx` — the six marks + the card mount.
- `docs/specs/lm-652-discourse/wb-q2-send.jsx` — the five senders + the live fragment.
- `docs/specs/lm-652-discourse/wb-q3-leave.jsx` — the five faces + the room.
- `docs/specs/lm-652-discourse/wb-q4-name.jsx` — the eight names + the thread.
- `docs/specs/lm-652-discourse/wb-q-board.jsx` — mount, board order.

## Learnings

- **Swapping a shipped glyph without forking the card.** `FeedCard` renders
  `window.SwellDoor` in its meta row. `wb-q1-mark.jsx:~100` re-publishes `window.SwellDoor`
  with a board-owned component that reads the option's mark out of a React context, so all
  six options mount the **real** card with no copy of it. This is the pattern to reach for
  whenever a rig has to vary one slot of a component it must not fork — and the reason the
  board file must load *after* `app/feed.jsx`.
- **Copy the field, not the furniture.** `WbField` (q2) and `WbRoom` (q3) are deliberate
  copies of `CandWrite`/`CandRoom` because each option owns what sits inside and under the
  box. They are copies to be left alone, not improved — noted in both files.
- Driver state persists under one localStorage key (`pg_wb_open_questions_v1`), so a
  reload keeps the user's place mid-comparison.
- Nothing here warrants a `GOTCHA.md` entry, and none was added (needs user approval).

## Artifacts

- `pg-wb-open-questions.html` (root entry)
- `docs/specs/lm-652-discourse/wb-q-shell.jsx`, `wb-q1-mark.jsx`, `wb-q2-send.jsx`,
  `wb-q3-leave.jsx`, `wb-q4-name.jsx`, `wb-q-board.jsx`

## Action Items & Next Steps

1. **Collect the picks.** Four answers, by option number. Where the user's reply is
   ambiguous about which option they mean, ask — do not resolve it.
2. **Land only what is picked**, into `cand-lm652-*` in the candidate build, one question
   at a time. A pick on the mark does not license touching the surface's name.
3. **Record nothing as settled** until ratified in words — not in `README.md`, not in
   `CHANGELOG.md`. None of these four is a `CHANGELOG.md` entry on its own; the shape of
   the product has not changed.
4. **Archive the board** once all four are resolved: delete the root entry, keep a
   standalone bundle, move the modules under `docs/archive/`.
5. Then return to the queue: §3 reveal (got wrong twice — options before any build), Part B
   copy, "watching", domain on the closed card, `CAND_OWN_MIN = 3`.

## Other Notes

- Board 1's marks are drawn as SVG in the board file. They are sketches for judging a
  reading, not finished brand glyphs; whichever survives wants a proper pass against
  `brand/circlists-brand.md` before it lands.
- Board 4 is static on purpose — the question is the words, and animating it would only
  add a variable.
- The user asked for boards, not a recommendation, and none was given. Do not open the
  next session by supplying one unprompted.
