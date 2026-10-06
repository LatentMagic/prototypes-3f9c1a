# Architecture

How the prototype is put together. App-wide structure only — the product's own structure (its screens, its postures, its guards) belongs in the specs the product block in `CLAUDE.md` names, or a doc beside this one. `app/README.md` lists the skeleton's files in load order.

## Deletable aids and droppable modules

Files the app tolerates being **absent**, read once per render off `window` so no import breaks:

| File | Kind | Absent ⇒ |
|---|---|---|
| `app/config.jsx` | deletable aid | launcher gone: review settings, the states palette and QA with it. `?state=` and the index survive |
| `app/states.jsx`, `app/states-ui.jsx` | deletable aids | states register gone: no `?state=`, no palette, no index |
| `app/qa.jsx` | deletable aid (draft) | QA half of the launcher gone; the states it points at stay |
| `app/config-extra.example.jsx` | deletable example | no product rows in Config |
| `app/app-tweaks.jsx`, `app/tweaks-panel.jsx` | deletable aids | Tweaks gone; baked-in defaults render |

A product's own droppable modules join this table as it adds them: a file the app can run without, guarded where `main.jsx` reads it off `window`.

## Addressable states

A ticket in the real build links to this prototype, so a reviewer has to be able to arrive at the state the ticket is about — a dormant account, a payment retrying — without knowing a click path.

`app/states.jsx` is the **register**: one entry per staged state, `{ group, id, label, stage }`. The `id` is the state's address (`dormant-account`, `payment-retrying`); `stage` is the staging function. Everything else is derived from that one list and cannot drift from it (group notes are the one exception: `KIT_STATE_GROUP_NOTES`, keyed by group title, is a second list kept by hand, shown at a group's foot on the index and palette):

- **`?state=<id>`** on the entry. `main.jsx` reads it once at mount (`kitResolveState`) and stages the named state in an effect, so a named state **overrides any restored route**. Nothing in the address ⇒ the app opens where the real app does.
- **`?state=index`, or a name the register does not hold** ⇒ the states index (`StatesIndex`, `app/states-ui.jsx`) renders instead of the app. That is how a stale ticket link shows itself: the reader sees a catalogue that does not contain the name they came for, rather than the wrong screen.
- **The palette** — the launcher's second half. Jump to a state, or copy its link.
- **`window.KIT_STATES`** — ids, labels and groups, published on the page for anything inspecting it. No staging functions, nothing runnable. A sibling JSON file would not survive the single-file export, which is why it is a global.

A state earns an entry by being hard to reach — a situation the app has to be staged into (an account you do not own, a dormant account, a retrying payment). A screen you can click to from a state already in the register does not get one; the register is not a sitemap, and doubling the app as a second index leaves two things to keep in step.

An id names the situation, not the app's internals — `members-non-owner`, never `sp-book-settings`. Internals move; the situation is what a ticket was written about.

An `id` is **public** once a ticket links to it: renaming or removing one breaks those links, and the index is the only thing that catches it.

A state is a scenario, never a width: posture comes from the window or the Viewport control, so a state never has a "· phone" twin.

> **The resolver looks inert in preview, and is not.** Nothing in the design tool can hand this page a URL, so `?state=` does nothing there. It is exercised by driving the register directly (`window.buildStates`, the palette, the index) — never by concluding from a screenshot that the address reading is dead. **Do not delete it on that evidence.** A copied link also depends on the host: when the page is framed in a console that addresses a prototype by its URL hash (`#<app>/<slug>`), `kitStateLink` rebuilds that address with `?state=<id>` after the hash, and the console must forward that query onto the iframe `src`. Both are outside this project.

## Conventions

- **JSX over `window`.** Every file exports with `Object.assign(window, { ... })`; scripts do not share Babel scope. Load order is fixed in `index.html`.
- **No `const styles = {}`.** Name style objects after their component — collisions across files are silent and fatal.
- **Container / presentation split**, focused components, split past ~200 lines. See `skills/frontend-ui-engineering/SKILL.md`.
- **State** lives in `main.jsx` unless it is purely local chrome state (a drawer, a transition).
- **Prefix.** Everything the kit names carries `kit` / `KIT` (`KIT_STATES`, `kitResolveState`, `.kit-config-*`). `app/README.md` says the same.
