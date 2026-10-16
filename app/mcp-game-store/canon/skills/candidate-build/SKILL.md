---
name: candidate-build
description: Build a candidate build, and merge one when it is accepted. A candidate is another, unaccepted state of the app that IS the app, carried by a small overlay set loaded over the one shared `app/`, not by a fork or a playground. Use ONLY when the user explicitly asks for a candidate build, or names `$candidate-build` — never inferred from an incoming delta prompt, from unaccepted items in a brief, or from the ratification rule; a prompt that says build it into the app goes into `app/`, and if that feels wrong, ask first. Also use before touching an existing candidate entry or its overlays, and before merging one. Covers the invariants, the wiring, and teardown.
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
index.html                                → app/*                         the app — accepted work only
docs/specs/<ticket>/candidate/<name>.html → app/*  +  cand-<name>-*.jsx   a candidate — being processed
```

A ticket's `candidate/` folder holds as many candidates as it needs, the way
`playground/` holds rigs. Everything a candidate adds (screens, modules, styles,
staged states, its QA walk-through) lives in that folder. The only thing a
candidate leaves in `app/` is the one standing hook, which does nothing when no
candidate is open.

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

1. **One `app/`, many entries.** Never a copied `app/` variant directory. A fix to
   a shared surface lands in `app/` once and shows up in both entries with no
   second edit. This is the whole point of the shape; everything below protects it.

2. **Never photocopy a shipped component.** The delta hooks the real component.
   Re-publish its name from an overlay (`Object.assign(window, { SomeButton:
   CandidateButton })`) — free identifiers in the app's Babel scripts resolve off
   `window` at render time, so a later assignment simply wins and no extension
   slots are needed. Copying a component to change it is a defect, not a
   trade-off: copies rot.

3. **The main build shows exactly what it showed before, until the owner accepts
   the candidate.** `app/` holds one standing hook (invariant 4), read once per
   render off `window` like the existing droppable aids, so **absent ⇒ shipped
   behaviour, byte for byte**. A candidate never adds modules, registers states
   or edits styles in `app/`. If a delta seems to need a second hook (see "Traps"),
   stop and name it in the handoff for the owner; do not open `app/` for it.

4. **One handle, one bridge.** The overlay set publishes a single object,
   `window.KitCandidate`, that `app/main.jsx` reads per render. It may hold
   `bind(api)`, called with the app's state and setters, and `Screen`, a
   component rendered in place of the app's screen; the `api` is the only way the
   overlay reads or writes app state. Not a scatter of globals poked into the root
   component. `main.jsx` carries this hook already; a product that replaces the
   root keeps it. The kit's hook passes what the kit's own root holds (`items`,
   `setItems`, `isMobile`). A product passes whatever its own root holds for
   state, under its own names; deciding what goes in `api` is the builder's call
   in that project. The candidate's staged states and QA walk-through are added
   from its own folder, not from `app/`: wrap `window.buildStates` and
   `window.kitResolveState` to add states, and push the walk-through onto
   `window.KIT_QA`. They exist only on the candidate's page, so they never show in
   the main build.

5. **Load order is load-bearing.** Overlays load *after* the `app/` files they
   re-publish over and *before* `app/main.jsx` — mount happens when `main.jsx`
   loads, and nothing re-renders afterwards. Later than that is a flash of the
   shipped app or no candidate at all.

6. **Its own persisted state.** If the product keeps anything in browser storage,
   the code that reads the storage key reads it as `window.KIT_STATE_KEY ||
   '<default>'` and the entry sets that key in a script before the app scripts
   load, one key per candidate (`kit_<ticket>_<name>`). The read may not be in
   the root: find where the product reads its stored state and put the line
   there. This one-line read is part of the standing hook. Otherwise the entries
   cross-hydrate and each corrupts the other's review. (The kit's placeholder
   persists nothing; the rule starts to bite when the product's does.)

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

10. **Nothing is deleted.** A piece accepted mid-flight moves into `app/` as the
    main build's own module, and the overlay file that carried it goes to the
    archive with the candidate's other files. Whatever is still in
    `cand-<name>-*` is still being processed — coverage stays readable at a
    glance. Merging a whole candidate and throwing one away are below; both archive
    that candidate's files and switch its launcher entry off.

## Placement and naming

- Entry: `docs/specs/<ticket>/candidate/<name>.html`, in the ticket's own
  folder, never at the root. A `candidate/index.html` keeps working where it is.
  Carry `<base href="../../../../" />` (one `../` per level of nesting, four
  here) and write every path root-relative so `app/*`, `tokens.css` and the rest
  resolve; `CLAUDE.md` § Files has the full mechanism and its trap.
- Overlays: `cand-<name>-*.jsx` in the same `candidate/` folder, kebab-case,
  one concern per file, loaded as `docs/specs/<ticket>/candidate/cand-<name>-*.jsx`.
  The bridge is `cand-<name>-bridge.jsx`. Candidates share the folder, never a file.
- The entry duplicates the main entry's `<head>` — the **one accepted
  duplication**, because it is the page shell rather than the app. Candidate-only
  CSS goes in its own clearly-marked block at the end; a change to the shared part
  of the head has to land in both entries.
- The launcher: add the entry to the ticket in `playgrounds.json` with
  `"kind": "candidate"` and a note saying what the candidate is. The launcher shows
  candidates first in the ticket, marked. Add the entry in the same change
  that builds it.
- States the candidate needs, and its walk-through, are added from a file in the
  `candidate/` folder (invariant 4), not from `app/states.jsx` or `app/qa.jsx`.

## Making the entry

You make the candidate by writing files; there is nothing to run. For a ticket
`<ticket>`, a candidate name `<name>` (kebab-case: lowercase letters, digits, hyphens) and a
display name `<Name>`:

1. **Create the folder** `docs/specs/<ticket>/candidate/` if the ticket has none. If `<name>.html` already exists there, stop: that candidate is already built.
2. **Write the bridge** `docs/specs/<ticket>/candidate/cand-<name>-bridge.jsx` with these contents:

   ```jsx
   // Candidate build <name> for <ticket>: the one handle app/main.jsx reads (skills/candidate-build).
   // Loads after the app/ files it re-publishes over and before app/main.jsx.
   // bind(api) is called each render with the app's state and setters; Screen, if set,
   // is rendered in place of the app's screen. Nothing here is accepted.
   Object.assign(window, {
     KitCandidate: {
       bind(api) { window.KitCandidateApi = api; },
       // Screen: ({ api }) => <CandidateScreen api={api} />,
     },
   });
   ```

3. **Copy the root `index.html`** to `docs/specs/<ticket>/candidate/<name>.html`, whole. Do not copy `app/`; the entry loads the shared one. Then make exactly these four edits to the copy and no others:
   1. Change the title line to `<title><Name> (candidate)</title>`.
   2. Directly after `<head>`, add `<base href="../../../../" />`. Every other path in the file stays root-relative as it is.
   3. Directly before the first `<script src="https://unpkg.com/react@` line, add `<script>window.KIT_STATE_KEY = "kit_<ticket>_<name>";</script>`.
   4. Directly before the `<script type="text/babel" src="app/main.jsx"></script>` line, add `<script type="text/babel" src="docs/specs/<ticket>/candidate/cand-<name>-bridge.jsx"></script>`.
4. **Add the launcher entry** to the ticket's `entries` in `playgrounds.json`: `{ "kind": "candidate", "name": "<Name>", "path": "docs/specs/<ticket>/candidate/<name>.html", "note": "<one line>" }`. If the ticket has no record yet, add one.
5. **Build the delta** in further `cand-<name>-*.jsx` files in that folder, each loaded by a `<script type="text/babel" src="docs/specs/<ticket>/candidate/cand-<name>-<part>.jsx"></script>` line placed after the bridge's line and before `app/main.jsx`. The candidate's own
   CSS goes in a marked block at the end of its page's `<head>`. To show a
   candidate screen, uncomment `Screen` in the bridge and point it at the
   component. The root `index.html` and `app/` stay as they were.

## Traps

- **A file-scoped reference cannot be overridden from outside.** If a component
  reaches for a sibling by closure rather than through `window`, no amount of
  re-publishing reaches it. The honest minimum is one narrow in-file hook, which
  is a change to the main build's code: stop and name it for the owner (invariant
  3). Not a copy, and not a redesign of the shipped file.
- **Overriding a name changes it everywhere.** Re-publishing a shipped component
  replaces every use of it in the candidate, not just the one you had in mind.
  Check the other call sites before choosing that lever.
- **A candidate's states exist only on its page.** Say so in the handoff, so
  nobody looks for them from the main entry. After a merge they are registered in
  `app/states.jsx` like any other state.
- **Verification clicks share the user's `localStorage`.** Leave the candidate's
  key in a clean state so the owner lands on the demo path, not on your probing.
- Mount transitions and sheet motion can only be judged live — see `GOTCHA.md`
  before claiming an overlay works from a screenshot.

## Merging a whole candidate

When the owner accepts the candidate entire, the states it carried become the
app and the candidate stops being somewhere anyone goes. It is a merge, not a
clear-out: **nothing is deleted.** The standing hook stays; it is kit machinery,
not part of any one candidate. A merge acts on one candidate's page and its
`cand-<name>-*` files; the ticket's other candidates are not thrown away unasked.
This is the one statement of the steps, in order; `CLAUDE.md` and
`docs/specs/CLAUDE.md` point here.

1. **Move the candidate's modules into `app/`** as the main build's own, renamed
   off the candidate naming (`cand-<name>-*.jsx` → `app/<feature>-*.jsx`) so
   nothing in the shipped app is labelled provisional. Keep the module split. The
   bridge file (the one that publishes `window.KitCandidate`) is scaffolding and
   does not move. Rename any `cand-*` CSS classes to house names.
2. **Wire them in.** The candidate's CSS block moves into `index.html` (and every
   live entry that loads a changed module), retitled for the feature, and its
   modules load there in the order they did in the candidate entry: after the
   files they extend, before `app/main.jsx`. Its staged states go into
   `app/states.jsx` and its QA walk-through into `app/qa.jsx`, with the `only`
   filter dropped or kept as the owner says.
3. **Archive the candidate** to `docs/archive/<ticket>/candidate/`: its page, bridge
   and any `cand-<name>-*` files left, a move and never a rewrite. They are the
   record of how the state was reached. Leave the entry's own `<script src>` lines and
   `<base href>` as they are, per `CLAUDE.md` § Files: an archived candidate is
   read, not run.
4. **Switch its launcher entry off, never remove it:** `"on": false` with an
   `"off"` note saying it merged and the date.
5. **One `CHANGELOG.md` entry**, and only now, and only if the merge changed the
   shape of the product — the merge is the moment the work is accepted. It names
   the FEATURES the merge introduces, in the product's own words, one bullet each;
   not the mechanism, not the file moves. Close it with a line saying it landed as
   a candidate first and that the candidate stays on the record, switched off.
   Draft the entry and have the owner ratify the wording before it lands.

## Throwing one away

When the owner says no: archive that candidate's page and its `cand-<name>-*` files to
`docs/archive/<ticket>/candidate/` and switch its `playgrounds.json` entry off
with an `"off"` note saying it was not taken and the date. Nothing is deleted. The main build never held any of it, so
nothing else changes.

## The write-up

A candidate build ends in a handoff (`skills/create-handoff`) that carries the demo
path (how to reach each part of the delta), the judgement calls flagged as yours,
and anything that needs the owner's decision about `app/`. Review is the next
step, always; the build is not the decision.
