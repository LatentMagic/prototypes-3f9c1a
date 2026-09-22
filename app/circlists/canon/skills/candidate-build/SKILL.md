---
name: candidate-build
description: Build a candidate build, and merge one when it ratifies. A candidate is a second, unratified state of the app that IS the app, carried by an overlay set loaded over the one shared `app/`, not by a fork or a playground. Use when a delta has to be played as the product rather than compared as options: an incoming delta prompt, a version of the app under review, anything where "the agreed app" and "the version being processed" must both exist and be switched between at zero cost. Covers when it applies, the invariants, the wiring, and teardown.
---

# Candidate builds

A candidate build is **the app, in a state nobody has agreed to yet**. Same
`app/`, same load order, same chrome, same feed — plus a small overlay set that
re-publishes only the names the delta changes.

It exists because the prototype has to hold two kinds of feature at once:
**agreed** work that belongs in the main app, and **being-processed** work that
does not. A playground is beside the app and allowed to be partial. A candidate
has to *be* the app, played as the product, with nothing in it ratified.

```
circlists.html            → app/*                          the app — ratified only
circlists-<ticket>.html   → app/*  +  cand-<ticket>-*.jsx   candidate — being processed
```

## Which shape

- **Candidate build** — the deliverable has to be the app: a whole delta, played
  end to end, judged as the product. Multiple named options are not the question;
  one direction being real is.
- **Playground** (`skills/build-playground/SKILL.md`) — the question is a
  comparison, and being partial is fine. Options, levers, drivers.
- **Straight into `app/`** — only once ratified.

If you find yourself adding an option rail or a lever to a candidate, you wanted
a playground. If you find yourself defending a fork of `app/`, you wanted neither.

## Invariants

1. **One `app/`, two entries.** Never a copied `app/` variant directory. A fix to
   a shared surface lands in `app/` once and shows up in both entries with no
   second edit. This is the whole point of the shape; everything below protects it.

2. **Never photocopy a shipped component.** The delta hooks the real component.
   Re-publish its name from an overlay (`Object.assign(window, { SwellDoor:
   CandConvoButton })`) — free identifiers in the app's Babel scripts resolve off
   `window` at render time, so a later assignment simply wins and no extension
   slots are needed. Copying a component to change it is a defect, not a
   trade-off; it was tried twice before this route existed and rotted both times.

3. **Where a hook is genuinely needed, change `app/` — additively.** "`app/` is
   frozen" does not outrank building it properly. The addition reads once per
   render off `window`, exactly like the existing deletable aids, so **absent ⇒
   shipped behaviour, byte for byte**. The main entry must look and behave
   identically before and after. Write down what you opened.

4. **One handle, one bridge.** The overlay set publishes a single object
   (`window.CircCandidate`) that `main.jsx` reads per render, and reads/writes app
   state only through the API `main.jsx` binds into it. Not a scatter of globals
   poked into the root component.

5. **Load order is load-bearing.** Overlays load *after* the `app/` files they
   re-publish over and *before* `app/main.jsx` — mount happens when `main.jsx`
   loads, and nothing re-renders afterwards. Later than that is a flash of the
   shipped app or no candidate at all.

6. **Its own persisted state.** Set the state key in the entry before the app
   scripts load, or the two entries cross-hydrate and each corrupts the other's
   review.

7. **Seeds extend, never replace.** Wrap the shipped seed builder and lay the
   delta over its output. Replacing it forks the fixtures and the candidate stops
   being the app with a delta.

8. **Thin is allowed; partial is not.** Fewer circles, no account settings — fine.
   A posture that does not work, a control left present-and-dead, a signal with no
   way through to what it points at — not fine. It is being judged as the product,
   so it has to survive being used as one: every posture, from 320px.

9. **Nothing in a candidate is ratified.** No `CHANGELOG.md` entry, no decision
   recorded as settled, no move into `app/`, until the owner ratifies in words.
   Flag the calls you made as yours, so review has something to aim at.

10. **Teardown is deletion.** When a piece ratifies mid-flight, its delta moves
    into `app/` and the overlay file that carried it is deleted. Whatever is still
    in `cand-<ticket>-*` is still being processed — coverage stays readable at a
    glance. Destroying a candidate outright is deleting its files and its entry.
    Merging a WHOLE candidate is a different act — see below.

## Placement and naming

- Entry: `docs/specs/<ticket>/circlists-<ticket>.html` — in the ticket's own folder,
  never at the root. Carry `<base href="../../../" />` and write every path
  root-relative so `app/*`, `tokens.css` and `brand/` resolve.
- Overlays: `cand-<ticket>-*.jsx` in the ticket's `docs/specs/<id>-<topic>/`
  folder, kebab-case, one concern per file.
- The entry duplicates the main entry's `<head>` — the **one accepted
  duplication**, because it is the page shell rather than the app. Candidate-only
  CSS goes in its own clearly-marked block at the end; a change to the shared part
  of the head has to land in both entries.

## Traps

- **A file-scoped reference cannot be overridden from outside.** If a component
  reaches for a sibling by closure rather than through `window`, no amount of
  re-publishing reaches it. The honest minimum is one narrow in-file hook (see
  invariant 3) — not a copy, and not a redesign of the shipped file.
- **Overriding a name changes it everywhere.** Re-publishing a shipped component
  replaces every use of it in the candidate, not just the one you had in mind.
  Check the other call sites before choosing that lever.
- **Verification clicks share the user's `localStorage`.** Leave the candidate's
  key in a clean state so the owner lands on the demo path, not on your probing.
- Mount transitions and sheet motion can only be judged live — see `GOTCHA.md`
  before claiming an overlay works from a screenshot.

## Merging a whole candidate

When the owner ratifies the candidate entire, the states it carried become the
app and the candidate stops being somewhere anyone goes. It is a merge, not a
clear-out: **the candidate is kept, not deleted.**

1. **The delta lands in `app/`.** The overlay files become app modules, renamed
   off the candidate naming (`cand-<ticket>-*.jsx` → `app/<feature>-*.jsx`) so
   nothing in the shipped app is labelled provisional. Keep the module split — do
   not fold a large delta into the file it extended.
2. **The candidate's CSS block moves into `circlists.html`**, retitled for the
   feature, and its modules load in the same order they did in the candidate
   entry: after the files they extend, before `app/main.jsx`.
3. **The whole ticket folder moves to `docs/archive/<ticket>/`** — entry and
   `cand-*` files together, a move and never a rewrite. They are the record of how
   the state was reached, so do not delete them and do not rewrite them; the one
   edit allowed is repointing the entry's own `<script src="docs/specs/…">` lines
   at the new path (and the `<base href>` depth if the nesting changed).
4. **Its launcher row is switched off, never removed:** `"on": false` with an
   `"off"` note saying it merged and the date. The row stays on the record; the
   entry stops being reachable from `playgrounds.html`.
5. **One `CHANGELOG.md` entry**, and only now — the merge is the moment the work
   is ratified. It names the FEATURES the merge introduces, in the product's own
   words, one bullet each; not the mechanism, not the file moves. Close it with a
   line saying it landed as a candidate first and that the candidate stays on the
   record, switched off. Draft the entry and have the owner ratify the wording
   before it lands.
## The write-up

A candidate build ends in a handoff that carries the demo path (how to reach each
part of the delta), the judgement calls flagged as yours, and what was opened in
`app/`. Review is the next step, always; the build is not the decision.
