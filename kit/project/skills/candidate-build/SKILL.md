---
name: candidate-build
description: Build a candidate build, and merge one when it is accepted. A candidate is a second, unaccepted state of the app that IS the app, carried by a small overlay set loaded over the one shared `app/`, not by a fork or a playground. Use ONLY when the user explicitly asks for a candidate build, or names `$candidate-build` — never inferred from an incoming delta prompt, from unaccepted items in a brief, or from the ratification rule; a prompt that says build it into the app goes into `app/`, and if that feels wrong, ask first. Also use before touching an existing candidate entry or its overlays, and before merging one. Covers the invariants, the wiring, and teardown.
---

# Candidate builds

A candidate build is **the app, in a state nobody has agreed to yet**. Same
`app/`, same load order, same chrome — plus a small overlay set that
re-publishes only the names the delta changes.

It exists because the prototype has to hold two kinds of work at once:
**agreed** work that belongs in the main app, and **being-processed** work that
does not. A playground is beside the app and allowed to be partial. A candidate
has to *be* the app, played as the product, with nothing in it accepted.

```
index.html                             → app/*                          the app — accepted work only
docs/specs/<ticket>/candidate/index.html → app/*  +  cand-<ticket>-*.jsx   candidate — being processed
```

## Which shape

**Requested, never inferred.** A candidate build happens only when the user
asks for one by name (`$candidate-build`, or "build this as a candidate build").
An incoming delta prompt is not a request for one, and neither is a brief with
unaccepted pieces in it: a prompt that says build it into the app goes into
`app/`. If that feels wrong, ask which shape before building — do not pick this
one yourself.

- **Candidate build** — the user asked for one, and the deliverable has to be the app: a whole delta, played
  end to end, judged as the product. Multiple named options are not the question;
  one direction being real is.
- **Playground** (`skills/build-playground/SKILL.md`) — the question is a
  comparison, and being partial is fine. Options, levers, drivers.
- **Straight into `app/`** — only once accepted.

If you find yourself adding an option rail or a lever to a candidate, you wanted
a playground. If you find yourself defending a fork of `app/`, you wanted neither.

## Invariants

1. **One `app/`, two entries.** Never a copied `app/` variant directory. A fix to
   a shared surface lands in `app/` once and shows up in both entries with no
   second edit. This is the whole point of the shape; everything below protects it.

2. **Never photocopy a shipped component.** The delta hooks the real component.
   Re-publish its name from an overlay (`Object.assign(window, { SomeButton:
   CandidateButton })`) — free identifiers in the app's Babel scripts resolve off
   `window` at render time, so a later assignment simply wins and no extension
   slots are needed. Copying a component to change it is a defect, not a
   trade-off: copies rot.

3. **Where a hook is genuinely needed, change `app/` — additively.** "`app/` is
   frozen" does not outrank building it properly. The addition reads once per
   render off `window`, exactly like the existing deletable aids, so **absent ⇒
   shipped behaviour, byte for byte**. The main entry must look and behave
   identically before and after. Write down what you opened.

4. **One handle, one bridge.** The overlay set publishes a single object,
   `window.KitCandidate`, that `app/main.jsx` reads per render. It may hold
   `bind(api)`, called with the app's state and setters, and `Screen`, a
   component rendered in place of the app's screen; the `api` is the only way the
   overlay reads or writes app state. Not a scatter of globals poked into the root
   component. `main.jsx` carries this hook already; a product that replaces the
   root keeps it, and adds further hooks (routes, a row wrapper) in the same
   shape under invariant 3. The same handle switches on the candidate's QA entries
   (`only: 'KitCandidate'`, `app/qa.jsx`), so they never show in the main build.

5. **Load order is load-bearing.** Overlays load *after* the `app/` files they
   re-publish over and *before* `app/main.jsx` — mount happens when `main.jsx`
   loads, and nothing re-renders afterwards. Later than that is a flash of the
   shipped app or no candidate at all.

6. **Its own persisted state.** If the product keeps anything in browser storage,
   its root reads the storage key as `window.KIT_STATE_KEY || '<default>'` and the
   entry sets that key in a script before the app scripts load. Otherwise the two
   entries cross-hydrate and each corrupts the other's review. (The kit's
   placeholder persists nothing; the rule starts to bite when the product's does.)

7. **Seeds extend, never replace.** Wrap the shipped seed builder and lay the
   delta over its output. Replacing it forks the fixtures and the candidate stops
   being the app with a delta.

8. **Thin is allowed; partial is not.** Less data, fewer settings screens — fine.
   A posture that does not work, a control left present-and-dead, a signal with no
   way through to what it points at — not fine. It is being judged as the product,
   so it has to survive being used as one: every posture, from 320px.

9. **Nothing in a candidate is accepted.** No `CHANGELOG.md` entry, no decision
   recorded as settled, no move into `app/`, until the owner accepts it in words.
   Flag the calls you made as yours, so review has something to aim at.

10. **Teardown is deletion.** When a piece is accepted mid-flight, its delta moves
    into `app/` and the overlay file that carried it is deleted. Whatever is still
    in `cand-<ticket>-*` is still being processed — coverage stays readable at a
    glance. Destroying a candidate outright is deleting its folder and its
    launcher entry. Merging a WHOLE candidate is a different act — see below.

## Placement and naming

- Entry: `docs/specs/<ticket>/candidate/index.html` — in the ticket's own folder,
  never at the root. Carry `<base href="../../../../" />` (one `../` per level of
  nesting, four here) and write every path root-relative so `app/*`, `tokens.css`
  and the rest resolve; `CLAUDE.md` § Files has the full mechanism and its trap.
- Overlays: `cand-<ticket>-*.jsx` in the same `candidate/` folder, kebab-case,
  one concern per file, loaded as `docs/specs/<ticket>/candidate/cand-<ticket>-*.jsx`.
- The entry duplicates the main entry's `<head>` — the **one accepted
  duplication**, because it is the page shell rather than the app. Candidate-only
  CSS goes in its own clearly-marked block at the end; a change to the shared part
  of the head has to land in both entries.
- The launcher: add the entry to the ticket in `playgrounds.json` with
  `"kind": "candidate"` and a note saying what the candidate is. The launcher shows
  it first in the ticket, marked as a candidate. Add the entry in the same change
  that builds it.
- States the candidate needs go in the register (`app/states.jsx`) and its walk-through
  in `app/qa.jsx` with `only: 'KitCandidate'`, as `CLAUDE.md` § Code asks.

## Traps

- **A file-scoped reference cannot be overridden from outside.** If a component
  reaches for a sibling by closure rather than through `window`, no amount of
  re-publishing reaches it. The honest minimum is one narrow in-file hook (see
  invariant 3) — not a copy, and not a redesign of the shipped file.
- **Overriding a name changes it everywhere.** Re-publishing a shipped component
  replaces every use of it in the candidate, not just the one you had in mind.
  Check the other call sites before choosing that lever.
- **A candidate's states must work in the main build too, or say they don't.** A
  state that needs something only the candidate made is unreachable from the main
  entry; keep its register entry out of the main build or name it as candidate-only.
- **Verification clicks share the user's `localStorage`.** Leave the candidate's
  key in a clean state so the owner lands on the demo path, not on your probing.
- Mount transitions and sheet motion can only be judged live — see `GOTCHA.md`
  before claiming an overlay works from a screenshot.

## Merging a whole candidate

When the owner accepts the candidate entire, the states it carried become the
app and the candidate stops being somewhere anyone goes. It is a merge, not a
clear-out: **the candidate is kept, not deleted.**

1. **The delta lands in `app/`.** The overlay files become app modules, renamed
   off the candidate naming (`cand-<ticket>-*.jsx` → `app/<feature>-*.jsx`) so
   nothing in the shipped app is labelled provisional. Keep the module split — do
   not fold a large delta into the file it extended. The bridge file is
   scaffolding: delete it rather than merging it.
2. **The candidate's CSS block moves into `index.html`**, retitled for the
   feature, and its modules load in the same order they did in the candidate
   entry: after the files they extend, before `app/main.jsx`. Its register entries
   and QA walk-through lose `only` or are deleted, as the owner says.
3. **The whole ticket folder's `candidate/` moves to `docs/archive/<ticket>/`** —
   entry and `cand-*` files together, a move and never a rewrite. They are the
   record of how the state was reached, so do not delete them and do not rewrite
   them; the one edit allowed is repointing the entry's own
   `<script src="docs/specs/…">` lines at the new path (and the `<base href>`
   depth if the nesting changed).
4. **Its launcher entry is switched off, never removed:** `"on": false` with an
   `"off"` note saying it merged and the date. The entry stays on the record; it
   stops being reachable from `playgrounds.html`.
5. **One `CHANGELOG.md` entry**, and only now, and only if the merge changed the
   shape of the product — the merge is the moment the work is accepted. It names
   the FEATURES the merge introduces, in the product's own words, one bullet each;
   not the mechanism, not the file moves. Close it with a line saying it landed as
   a candidate first and that the candidate stays on the record, switched off.
   Draft the entry and have the owner ratify the wording before it lands.

`docs/specs/CLAUDE.md` is the standing version of this section for the folder.

## Throwing one away

When the owner says no: delete the `candidate/` folder, its register entries and
QA walk-through, and its `playgrounds.json` entry (or switch the entry off with an
`"off"` note saying it was not taken, if the owner wants the record). The main
build never held any of it, so nothing else changes.

## The write-up

A candidate build ends in a handoff (`skills/create-handoff`) that carries the demo
path (how to reach each part of the delta), the judgement calls flagged as yours,
and what was opened in `app/`. Review is the next step, always; the build is not
the decision.
