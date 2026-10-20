# For the kit: code comments cite moving `docs/` paths

From a product prototype, 2026-10-16. A finding for the kit agent to consider; nothing here is ratified.

## What was seen
- About 20 comments in `app/` and two lines in the product block of `CLAUDE.md` cite task folders: `docs/specs/<topic>/` or a handoff inside one. Examples: "ratified 2026-10-11; docs/specs/home-product-hero/", "From option 16 (docs/specs/library-game-page/handoff-….md)".
- Several QA titles in `app/qa.jsx` carry the same paths.
- When the finished task folders moved to `docs/archive/`, every one of these broke. Nothing failed, because no code reads them, but every pointer now leads nowhere.
- Some comments hold the decision itself, not only a pointer: "NOTE (owner, 2026-10-13): Available games is NOT meant to hold every game… added here only on the owner's approval"; "REQUIRED when Terms are written: … Do not ship Terms without them."

## Why the kit produces it
Two rules, and nothing between them:
1. Always § Upstream first: specs are canonical; "cite them by path and id".
2. Wrapping up: record a decision no upstream spec holds "in the task's handoff under `docs/specs/`".

Nothing says what a code comment may cite, or that a `docs/specs/` path is temporary (the kit archives task folders as a move). An agent writing code next to a fresh decision reaches for the nearest path, the task folder. Rule 2 also forbids "a standing local rule list", but code comments are not named, so decisions settle there.

## Two smells
- **Comments point at task-scoped, movable files.** They rot on the first archive.
- **Decisions live in code.** A comment carrying "owner, <date>" is a local rule list. It never travels upstream and is not found by anyone reading the specs.

## Proposed rule (for the kit to word)
- A code comment says what the code does and any constraint it must keep. It never cites a `docs/` path or a handoff.
- Where a decision came from belongs in the handoff, which travels upstream. Code may cite the upstream spec id once one exists.
- A constraint that must not be broken (a legal requirement, an owner's "only on approval") is written as a constraint, without the history, and is also recorded in the handoff so it reaches the spec.
- Placement: Code § Conventions in `ARCHITECTURE.md`, plus one line in the Wrapping up block of `CLAUDE.md` next to the decision rule.

## A related gap: archiving open work
The kit says finished work goes to `docs/archive/` but gives no test for "finished". In this prototype a blanket archive moved tickets that were still open: a handoff the product block says the owner has not yet read, and QA walk-throughs marked "not ratified". Suggested test: a ticket is finished when no QA entry, no product-block line and no open handoff item points at it.

## Ask
Decide whether to adopt the comment rule and the "finished" test, and word them for the kit. If adopted, each product would then strip `docs/` paths from its comments in a single pass, keeping every constraint.
