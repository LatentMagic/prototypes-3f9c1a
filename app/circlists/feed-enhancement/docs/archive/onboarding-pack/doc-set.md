# The durable doc set

Small number of documents, each with one job, each with a stated trigger for when
to read it. The point is not completeness — it is that a fresh session can be
useful in five minutes and cannot accidentally undo a decision made in month one.

Create the ones you need **early and empty**. A doc written at file 40 is
archaeology; written at file 5 it is design.

## The set

| Doc | Job | Read before |
|---|---|---|
| `CLAUDE.md` | Standing instructions, non-negotiables, index of everything below | every turn (automatic) |
| `ARCHITECTURE.md` | App-wide structure and the invariants that hold it together | routing, shells, module load order |
| `<POSTURE>.md` | One doc per presentation posture that has its own IA (e.g. `MOBILE.md`) | any work in that posture |
| `CHANGELOG.md` | Shape-level milestones over time, not granular work | catching up on where the product has been |
| `docs/ABOUT.md` | What the product is, who for, how sold, emotional intent, the deliberate NOTs | any copy, positioning, or scope call |
| `GOTCHA.md` | Non-obvious traps that already cost a session | animated overlays, verifying motion |
| `PLAYGROUND.md` | How to build a decision rig | building a playground |
| `brand/<name>-brand.md` | Palette, mark, wordmark, lockup, type — plus `brand/assets/` | any visual work |
| `docs/specs/<ticket>/` | Per-task folder: `PROMPT.md`, notes, handoffs, playground modules | resuming a task |
| `skills/` | Procedures worth invoking verbatim (see `skills/` in this pack) | as the skill's own trigger says |

## What belongs in `ARCHITECTURE.md`

Structure and invariants, not inventory. The test: could someone violate this
without noticing if it were not written down?

Worth writing:
- **The single stated invariant**, phrased as a rule with teeth. Example: *"A
  change to a shared surface lands in all three postures with no per-posture
  edit."* Then show the one mechanism that enforces it (a `inShell()`-style
  wrapper that swaps only chrome), and say that both shells take the same prop
  surface and the same children — so a surface *cannot* be forked without
  visibly breaking the contract.
- **Which files the app tolerates being absent**, as a table: file, kind
  (deletable aid / droppable module), and what happens when it is gone. This is
  what lets you derive a stripped demo build by *deleting* files rather than
  editing the core.
- **Any posture-aware branch that is not chrome** — name it and say it is the
  only one. A single render-level guard covering a route list beats N scattered
  checks, because it cannot be bypassed by a new entry point.
- **Conventions**, in four or five bullets. Not a style essay.

Not worth writing: a file-by-file tour, anything the code says more precisely,
anything you would have to update every week.

## `ABOUT.md`: include the NOTs

The most useful half of a product doc is what the product deliberately refuses —
the features it will not add, the signals it will not show, the emotional register
it avoids. Positive descriptions get inferred from the code; the refusals never do,
and they are exactly what an agent will helpfully violate.

## Per-task spec folders

`docs/specs/<ticket-or-topic>/` holding the original `PROMPT.md`, working notes,
handoffs, and any task-specific modules (playground files). Keeps the root clean
and gives a resuming session one place to look. Non-task, session-spanning
handoffs go in `docs/specs/_handoffs/` as a dated append-only record.

## Editing rules are part of the doc

Any doc that accumulates needs a stated limit, written into `CLAUDE.md` next to
the doc's index entry:

- **Changelog:** one entry per *shape* change. Not iterations, not cosmetic
  fixes, not tweaks. Do not amend an entry as you iterate within a feature — it
  captures the shape of the step, written once, then left alone.
- **Gotchas:** only on user approval. Terse: symptom → cause → fix → rule.
- **Everything else:** when in doubt, add nothing and ask.

Without these, both files grow into logs and stop being read — at which point the
knowledge is lost even though it is technically written down.

## Handoffs

Long-running work needs a way to cross session boundaries. Use the
`create-handoff` skill in this pack. The two rules that make handoffs work:
prefer `path:line` references over code dumps, and lead with the *latest
unresolved user intent* as the Current Focus — not a chronological recap.
