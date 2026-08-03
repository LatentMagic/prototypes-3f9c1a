---
date: '2026-08-03'
topic: 'discourse-v3'
status: 'ready'
type: 'brief'
---

# Brief for the next agent — Discourse playground v3

You are building v3 of the discourse playground for Circlists. This file is
your prompt. Read it fully, then read the listed sources, then build.

## Read first (in this order)

1. `CLAUDE.md` (project root) — binding conventions.
2. `PLAYGROUND.md` — playground conventions. **You must also update it** (see
   "Document the principle" below; user has approved that edit).
3. `GOTCHA.md` — before touching any overlay/sheet motion or verifying it.
4. `docs/specs/discourse/README.md` — the design question and its history.
5. `docs/specs/discourse/ideation-2026-07-31-discourse-v2.md` — the settled
   spine and the K0–K6 continuation directions.
6. `docs/specs/discourse/handoff-2026-08-01-discourse-v2.md` — state of the v2
   build, including the 2026-08-01 refinement pass at the top of Recent
   changes.
7. `docs/specs/discourse/handoff-2026-07-27_discourse-playground.md` — the v1
   playground and the **original review feedback**, which is broader than
   continuation. v2 over-rotated onto one slice of it.
8. `docs/prd-2026-08-01-circlists.md` — point-in-time PRD (emotional intent
   and the performance-pressure guardrail matter here).
9. `wiki/circlists-copy-voice.md` — before writing any in-app copy.

## The goal (unchanged)

Discourse: thoughts from contributors and reflections from the circle —
togetherness in conversation, inside the Circlists frame (communal library,
individual read-state, calm floor, no performance pressure).

## What is wrong with v2 — the user's own framing

Verbatim intent, paraphrased tightly:

- "I just want to go over 5, 10, or 15 **distinct options** and react to them."
- "I don't configure; I **play with the actual app**, get a sense of it, and
  react to it."
- "At the moment, all the play items are all to do with *continue*, which is
  not what I want. The v2 question was continuation, but that was only one
  small part of the broader feedback."
- The rail (Shape / Continue / Levers / Loop) is "an absolute mess" to play
  with: the only way to reach variety is configuration, and the panes don't
  string together.

So: v2's engineering is sound but its **presentation model is wrong**. The
reviewer wants a flat list of distinct, self-contained, whole-app experiences.
Pick one → the app in front of you *is* that option, seeded so its signature
moment is reachable in a few natural touches → react → pick the next.

## What v3 must be

Dead simple: **open the playground, see a short list of versions of the app,
tap one, use it.** Each version just IS the app — working, seeded with life —
carrying one distinct idea about discourse. The idea is discovered by using
it; if a version needs explaining, it fails. The reviewer's reaction is the
output.

- A flat list of distinct versions — however many are genuinely distinct
  (could be 6, could be 12; don't pad, don't taxonomise). Name + one line
  each, nothing more.
- No shape statements, no theory cards, no loop driver, no lever panes in the
  reviewer's path. The theory stays in the ideation docs where it belongs. If
  you keep any config at all, bury it behind a clearly secondary "under the
  hood" affordance.
- Each version pre-seeded so its distinctive moment is 1–2 natural
  interactions away (a card ready to mark read, a record one tap deep).
- Reuse the v2 component layer (`pg-d2-*.jsx` — data resolver, card, record,
  table, parts, app shell integration) rather than rebuilding; it is solid
  after the 2026-08-01 pass (seal works under defaults, Add really adds,
  reveal-on-read holds at the table). What you are replacing is the **rail and
  the selection model** (`pg-d2-app.jsx`'s four panes), and re-deriving the
  option list.
- Known v2 defects to not repeat: switching option wipes local play state
  (fine if each option is self-seeded, but don't let it feel like loss); the
  loop driver narrates the settled spine only, ignorant of the chosen option
  — either make guidance option-aware or drop it.
- New main file, kebab-case: `discourse-playground-v3.html` + `pg-d3-*.jsx`
  as needed (fork, don't mutate, the v2 files). Deliver a standalone bundle
  (`discourse-playground-v3-standalone.html`) as a download for phone review.
- Write `handoff-2026-08-03-discourse-v3.md` when done, per the existing
  handoff format.

## Document the principle (user-approved PLAYGROUND.md edit)

Add to `PLAYGROUND.md`, in its conventions, terse and in its voice:

> **Playgrounds are played, not configured.** The reviewer opens the rig,
> sees a short flat list of named versions of the app, taps one, and uses it.
> Each version IS the app, working and seeded, carrying one distinct idea —
> discovered by playing, never by reading. If a version needs explaining, or
> reaching the variety requires configuring, the rig has failed. Theory,
> levers, and shape statements stay in the docs, not in the reviewer's path.

## Process

- Before building, propose the candidate version list (name + one-line pitch
  each) to the user for reaction — that list IS the design work; don't build
  a dozen surfaces speculatively.
- Keep the conversation light. The user does not want to discuss the problem
  space — they want to play with the ideas. Don't make them taxonomise.
- Design system tokens bind (`tokens.css`, brand pack). Accent `#047857`
  rules, hierarchy by size/weight, no emoji in UI copy (reaction glyphs are
  data, fine), voice per the wiki. Calm is the floor.
- All files lowercase kebab-case. Web posture frozen; this is a playground,
  not `app/`, but it mounts the real shell — follow `ARCHITECTURE.md` if you
  touch shell integration.
