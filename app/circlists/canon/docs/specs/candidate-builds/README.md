# Candidate builds — intention, not yet a standard

**Status: intention. Untested. Do not treat as a process yet.** Written 2026-08-14 at the end of a
session, so the goal is not lost. It becomes a skill only after the first real one is built and this
file is replaced by what it actually took.

## The problem it answers

We have two kinds of feature at once: **agreed** features that belong in the main prototype, and
**being-processed** features that do not. Until now the only shapes available were a playground
(beside the app, allowed to be partial) or building into the app (which mixes ratified with
unratified). Neither fits a delta that has to **be the app** — a full app carrying unratified work,
playable as the product, not as an option rail.

## The intention

**One `app/`. Two entries.** Not a second app, not a playground.

```
circlists.html            → app/*                        the app — ratified only
circlists-<ticket>.html   → app/*  +  cand-<ticket>-*.jsx candidate — being processed
```

The candidate entry loads the same `app/*` files in the same order, then loads a small **overlay set**
after them which re-publishes only the names the delta changes. `ARCHITECTURE.md`'s convention makes
this possible: every module publishes to `window`, load order is fixed by the entry HTML, so a later
assignment wins. Nothing in `app/` is copied, and a shared-surface fix in `app/` lands in both entries
with no second edit.

The candidate may be thin — fewer circles, no account settings — without stopping being the app.
Seed data extends the shipped seeds rather than replacing them.

### Why not the alternatives

- **Into the main app behind a Config flag** — cheapest, but unratified work then sits inside the
  frozen web app's load order. Considered and set aside; the owner dropped the Config route himself.
- **A copied `app/` variant directory** — the "second app". Every shared-surface change lands twice
  and it rots silently.
- **A playground** — wrong shape when the deliverable has to *be* the app.

### Access

No new mechanism. The candidate is a file at the project root, opened the way `pg-*.html` is opened
today.

### Teardown

When a piece ratifies, its delta moves into `app/` and the overlay file that carried it is **deleted**.
Whatever is still in `cand-<ticket>-*` is still being processed — coverage is readable at a glance.
Destroying a candidate is deleting its files and its entry.

## The one untested assumption — read this before trusting any of the above

That loading an override file **after** `app/*` cleanly replaces the pieces a delta touches. It has
never been done here, and it is exactly where v8 and v10 gave up: both copied `app/swell-reactions.jsx`
and `FeedCard` verbatim, because the Swell keeps its internals in Babel scope and `FeedCard` has no
extension slots (`handoff-2026-08-12-discourse-v8-playground.md`, craft notes).

So the mechanism's hard part has a history of not working. Making it work without copies needs a
**narrow, additive change to `app/`** — export the Swell internals, give `FeedCard` the call-out slots
the rigs already proved out, both read off `window` like the existing droppable modules.

**Settled (2026-08-14): make the change; do not copy.** `app/` being frozen does not outrank building
it properly. The candidate hooks into the real `FeedCard` and the real Swell; photocopying them, as v8
and v10 did, is a defect and was never an option to weigh. Keep the addition additive — the main app
must look and behave identically — and write down what was opened.

## The skill comes after the build

Agreed: build the first candidate from the incoming delta prompt, then write
`skills/build-candidate/SKILL.md` from what it actually took, and note it in `CLAUDE.md`. Writing it
first would record a guess as a standard. Nothing else here is open.
