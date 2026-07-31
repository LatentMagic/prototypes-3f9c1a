# lm-593 — Liveliness

The signal that something landed: the **micro dot** on a circle, the **New pill** in the open feed,
the **arrival wash** on cards as they land, a coarse **time** per card, and a frozen **last-seen
rule**. One grammar — *the app notices → signals quietly → the reader accepts* — shared by all three
postures.

**Integrated.** The grammar lives in `app/liveliness.jsx`; wiring in `app/main.jsx`, `app/shell.jsx`,
`app/home.jsx`, `app/feed.jsx`, `app/seed-data.jsx`, and styles in `circlists.html`. This directory
is the reasoning behind it.

## Handoffs

- [`handoff-2026-07-30_liveliness-corrections.md`](handoff-2026-07-30_liveliness-corrections.md) —
  **latest.** Design options stripped out of Config, the `NEW` rule fixed, the arrival turned into a
  wash, the resolve made continuous. Start here.
- [`handoff-2026-07-29_liveliness-integrated.md`](handoff-2026-07-29_liveliness-integrated.md) —
  the standing spec: the grammar and its hard rules, what landed where, what was rejected. Updated
  in place by the 07-30 session. Read it before touching any of it.

## Settled

Both former open questions are closed, and neither is a switch — Config → Liveliness stages
scenarios only (background activity, *In this circle*, *In another*).

1. **Last-seen rule** — `NEW` heading the arrivals, with a seam closing the group. Not `Earlier`.
2. **Nothing-new answer** — the spinner's arc closes into a complete ring, in place. Never a tick,
   never a second mark.

## Mocks

- `../../../liveliness-playground.html` (project root) + `pg-live-{data,parts,app}.jsx` here — the
  exploration that produced the grammar. **Historical.** The app is now the spec; several options
  visible in the playground were rejected and are listed in the handoff.

## The one-line rule

The app signals; the reader accepts. Accepting is the only thing that ever moves content.
