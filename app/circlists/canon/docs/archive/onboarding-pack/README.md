# Onboarding pack

A portable working-practice pack, extracted from a mature design/prototype
project and generalised. Drop the whole folder into a new project and point your
design agent at this README.

Nothing here is about a particular product. It is *how to work*: how to
structure the project's own instructions, which durable docs to keep, how to
build a prototype that survives being edited for months, how to build a
playground that settles a design argument, and the specific traps that cost
whole sessions.

## What to do with it, in order

1. **Read `claude-md-template.md` and write the new project's `CLAUDE.md` from
   it.** Do this first, before building anything. The agent reads that file every
   turn; it is the highest-leverage document in the project.
2. **Read `doc-set.md`.** Decide which durable docs the new project needs and
   create the empty ones now (an `ARCHITECTURE.md` written at file 40 is
   archaeology; written at file 5 it is design).
3. **Copy `skills/` into the new project as `skills/`.** Reference them from
   `CLAUDE.md` so they get read at the right moment, not just when remembered.
4. **Read `prototype-conventions.md` before writing the first component**, if the
   deliverable is a multi-file HTML/React prototype.
5. **Read `playgrounds.md` when a design question turns into an argument** — not
   before. It is a rig for deciding, not a habit.
6. **Read `gotchas.md` before touching animated overlays, sheets, or "verifying"
   a mount transition.** These are non-obvious and each one has already cost
   real time.

## Contents

| File | What it is |
|---|---|
| `claude-md-template.md` | Template + rationale for the project's standing instructions |
| `doc-set.md` | The durable doc set: which docs, what belongs in each, editing rules |
| `prototype-conventions.md` | Multi-file HTML/React prototype architecture that stays editable |
| `playgrounds.md` | How to build a rig that makes a design question answerable |
| `gotchas.md` | Transferable, hard-won traps (overlay motion, sandbox verification, focus) |
| `skills/create-handoff/` | Skill: compact session state so a fresh session can resume |
| `skills/frontend-ui-engineering/` | Skill: production-quality accessible UI, anti-AI-aesthetic rules |

## The two habits that mattered most

- **Write the rule down the first time it bites.** Every doc here started as a
  bug that repeated. A convention that lives only in a chat thread is gone next
  session.
- **Keep the docs small and keep them honest.** Terse rules get read. A doc that
  accumulates every iteration becomes a doc nobody opens — which is why several
  of these files carry an explicit *editing rule* limiting what may be added.
