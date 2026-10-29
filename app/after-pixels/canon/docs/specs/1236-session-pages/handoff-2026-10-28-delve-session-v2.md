---
date: '2026-10-28'
ticket: '1236'
topic: 'delve-session-v2'
status: 'in-progress'
type: 'exploration'
---

# Handoff: delve-session-v2 — Delve's session page, playground v2 (three result forms, four concepts)

## Current Focus

The owner reviews v2. The first question put to him: **which Result form is closest, Word, Word + mark or Sheet?** Then a concept (A, C, E, F). Change only what he names. Nothing in v2 is ratified.

## Task(s)

- **Done: the owner's review of v1** (brain dump, 2026-10-28), synthesised in `plan-2026-10-28-delve-v2.md`: the leans, the problems, the A-versus-C tension, the passes and the cleanup. Read it before changing anything.
- **Done: v2, built in one pass** on the owner's word ("a fix of A, a fix of C, and then two more that play with the concepts"; B's large held moment folded in; the Die row gone, Hex only).
  - **Bar:** Result (Word · Word + mark · Sheet) · Concept (A · C · E · F) · Play (opens on Overrun · hard) · Why.
  - **Result statement:** the ending as one word, as "Escaped" and "Solved" are: Won, Fallen, Overrun, In progress, Unfinished. The setting's sentence sits under it, no longer the title. Word: the word alone. Word + mark: beside it what decided the run (the threat track when it filled, else the last die; nothing for a run not over). Sheet: the hero as the heading, the word at the top right. "Unfinished" and "The week ended first" are my words.
  - **Character sheet** (top right): hero, hit points, threat, rooms reached, and gear when the run took or used any. The outcome is said once: "· Overrun" and "Threat, full" are gone.
  - **Die (Hex only):** strong hit full green; weak hit an amber outline filled at its foot; miss empty with a `--muted` edge; natural 20 a green outer rim; natural 1 a broken red (`--error`) outer rim, which replaces the crack; two d20 the other die small at the corner, its number only at 64px and up, which replaces the hex behind.
  - **Moments** say why first: Best roll (Natural 20 / Beat it by N), Closest call (Made it exactly), Worst roll (Natural 1 / Missed by N), the last roll titled by ending. Same rule as v1.
  - **Held roll:** hover lights it and fills the panel, press holds it, opens on the last roll. Always in view: beside the picture (C, E desktop), under the line (F desktop), pinned to the screen's foot (A everywhere; every concept on a phone). Facts are kept whole and leave out what the heading already says.
  - **Going back** is ↩ on the room number. Letters A–D gone.
  - **A, fixed:** v1's route with the above. **C, fixed:** strip beside the held roll on desktop, one row per room on a phone. **E:** no tile row; each moment large and labelled in its own column; chips above on a phone. **F:** one line by room (widths by roll count, 76px minimum), moments called out above their dice in two lanes; the last band's callout hangs left.
- **Done: phone-frame top bar fix** in `delve-v1.html` and `word-v11.html` (the playground offset dropped the store's top bar onto the content inside the phone).
- **Not done:** the plan's sixth going-back stop on the hard play (the seed is shared with v1); an AA check with a tool; the "few little snags" in A, never named by the owner.

## Critical References

- `docs/specs/1236-session-pages/README.md` (settled rules; Lessons for playgrounds). Its Delve line still names the audit as latest: point it at this handoff.
- `uploads/2026-10-27_delve-session-playground/delve.md` (spec; the live upstream wins) and `delve-session-playground-prompt.md` (the brief).
- `CLAUDE.md` ratification rule: present options, recommend, wait.

## Earlier handoffs

- `handoff-2026-10-28-delve-session-audit.md`: the v1 audit, the spec fixes to the hard play, the weakness leak, what was found and left.
- `handoff-2026-10-28-delve-session-playground.md`: v1's four concepts, where the brief, spec, images and supplied code sit, what the page depends on (recorded, sent, worked out).
- `handoff-2026-10-28-word-now-card-built.md`, `handoff-2026-10-28-word-now-card-v10.md`, `handoff-2026-10-28-word-session-v9-built.md`, `handoff-2026-10-28-word-session-v8-canvas.md`, `handoff-2026-10-28-word-session-v7-result.md`, `handoff-2026-10-28-word-session-v6.md`, `handoff-2026-10-28-word-asset-and-edition-picks.md`, `handoff-2026-10-27-word-session-into-app.md`: Daily Word's session page and now card.
- `handoff-2026-10-27-escape-into-app.md`, `handoff-2026-10-27-escape-library-card.md`, `handoff-2026-10-27-escape-lock-row-v2.md`, `handoff-2026-10-27-escape-session-v5.md`, `-v4.md`, `-v3.md`, `handoff-2026-10-27-escape-session-playground-pass-2.md`, `handoff-2026-10-27-escape-session-playground.md`, `handoff-2026-10-27-session-page-areas.md`: Escape, settled and built.

## Recent changes

- `playground/delve-v2.html` (new): loader, and all v2 styles; `KEEP:` comments mark the adaptive rules.
- `playground/pg-dv2.jsx` (new): model `dv2Build`, moments `dv2Moments`, die `Dv2Die`, result `Dv2Result` / `Dv2Top`, sheet `Dv2Sheet`, held roll `Dv2Held`, concepts `Dv2A` / `Dv2C` / `Dv2E` / `Dv2F`, bar `Dv2Bar`.
- `playground/pg-dv-seed.jsx` (new): the sample plays, held once (`DV_HARD`, `DV_FALLEN`, `dvSessions(prefix)`), moved from `pg-dv1.jsx` unchanged.
- `playground/pg-dv1.jsx`: its data block replaced by `dvSessions('dv1')`. `delve-v1.html`: loads the seed first; phone top-bar fix.
- `playground/word-v11.html`: phone top-bar fix.
- `playgrounds.json`: Delve session v2 entry under 1236.
- `plan-2026-10-28-delve-v2.md` (new).

## Learnings

- Playgrounds that offset `.gs-top` by their bar must reset it inside `.kit-phone-clip`, which scrolls on its own. Possibly a GOTCHA.md entry (ask the owner first); every playground from the v5 harness carries the same rule.
- A held-roll panel that can scroll out of view makes hover feel broken: keep it beside the picture or pinned.
- Facts as nowrap spans with the dot on the end of the previous span keep lines breaking between facts.

## Artifacts

`delve-v2.html`, `pg-dv2.jsx`, `pg-dv-seed.jsx`, `plan-2026-10-28-delve-v2.md`, this handoff.

## Action Items & Next Steps

1. Get the owner's pick of a Result form, then a concept. Change only what he names.
2. Update the README's Delve line to point here.
3. Then the moment rule, spoilers, achievements (no concept shows them), "First room" (invented) and "The last roll" on overrun (may not be the cause).
4. AA check with a tool on dice, pips and muted text; phone pass at 390 for every concept × play.
5. Then the now card.

## Other Notes

- The owner wants no tooltip or legend: a die that needs explaining is a drawing fault.
- He reviews by brain dump: take it in, play it back, build or ask only when he stops.
