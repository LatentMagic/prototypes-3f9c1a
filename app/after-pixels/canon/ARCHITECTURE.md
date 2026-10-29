# Architecture

How the prototype is put together. App-wide structure only. The map of screens to files is in `AGENTS.md`; `index.html` holds the load order.

## Postures

One app, three postures: desktop web, mobile web and app (native mobile). Every screen inside the chrome is the same component in all three.

- **Config → Viewport** (Auto / Desktop / Mobile) switches the two web postures. Mobile draws the phone frame (`.kit-stage` → `.kit-phone` → `.kit-phone-clip` → `.kit-phone-screen`) with no system bars: there a browser owns the top of the screen.
- **Config → Platform** (Web / Mobile) switches the app posture on. It is `platform` state in `app/main.jsx`, session-only like the Viewport, read in code as `isApp` (also on the app context, `gs.isApp`). The app posture always implies the phone frame, whatever the Viewport says.
- **Only the app posture draws the system bars** (`KitPhoneBars`: status bar and home indicator, over the screen inside the clip) and sets `--safe-area-inset-top: 59px` / `--safe-area-inset-bottom: 34px` on the clip (`[data-app]`). Content reads them as `var(--safe-area-inset-top, env(safe-area-inset-top, 0px))`, so on a real phone, where nothing sets them, `env()` answers.
- A states register entry may carry `platform: 'app' | 'web'`, which sets Platform before it stages.

## Deletable aids and droppable modules

Files the app tolerates being **absent**, read once per render off `window` so no import breaks:

| File | Kind | Absent ⇒ |
|---|---|---|
| `app/config.jsx` | deletable aid | Config pill gone: review settings, the states palette and QA with it. `?state=` and the index survive |
| `app/states.jsx`, `app/states-ui.jsx` | deletable aids | states register gone: no `?state=`, no palette, no index |
| `app/qa.jsx` | deletable aid (draft) | QA half of the Config pill gone; the states it points at stay |
| `app/gs-config.jsx`, `app/gs-pass-aids.jsx` | product's Config rows; `gs-pass-aids.jsx` also republishes `buildStates` so every state first resets the Pass store to its defaults (`:31-32`, `:39`) | no product rows in Config, and states stage without the reset |
| `app/directory-listings.jsx` | droppable module (review aid) | the routes `directory-claude` and `directory-chatgpt` render nothing, and the register's Store listing entries are not there |

A product's own droppable modules join this table as it adds them: a file the app can run without, guarded where `main.jsx` reads it off `window`.

## Addressable states

A ticket in the real build links to this prototype, so a reviewer has to be able to arrive at the state the ticket is about — a dormant account, a payment retrying — without knowing a click path.

`app/states.jsx` is the **register**: one entry per staged state, `{ group, id, label, stage }`. The `id` is the state's address (`dormant-account`, `payment-retrying`); `stage` is the staging function. Everything else is derived from that one list and cannot drift from it (group notes are the one exception: `KIT_STATE_GROUP_NOTES`, keyed by group title, is a second list kept by hand, shown at a group's foot on the index and palette):

- **`?state=<id>`** on the entry. `main.jsx` reads it once at mount (`kitResolveState`) and stages the named state in an effect, so a named state **overrides any restored route**. Nothing in the address ⇒ the app opens where the real app does.
- **`?state=index`, or a name the register does not hold** ⇒ the states index (`StatesIndex`, `app/states-ui.jsx`) renders instead of the app. That is how a stale ticket link shows itself: the reader sees a catalogue that does not contain the name they came for, rather than the wrong screen.
- **The palette** — the Config pill's second half. Jump to a state, or copy its link.
- The palette and the index list groups by title and states by label, A to Z, sorted in `buildStates`; register order does not matter. A leading `App: ` is skipped when sorting, so an app-only state sits beside its web twin.
- **`window.KIT_STATES`** — ids, labels and groups, published on the page for anything inspecting it. No staging functions, nothing runnable. A sibling JSON file would not survive the single-file export, which is why it is a global.

A state earns an entry by being hard to reach — a situation the app has to be staged into (an account you do not own, a dormant account, a retrying payment). A screen you can click to from a state already in the register does not get one; the register is not a sitemap, and doubling the app as a second index leaves two things to keep in step.

An id names the situation, not the app's internals — `members-non-owner`, never `sp-book-settings`. Internals move; the situation is what a ticket was written about.

An `id` is **public** once a ticket links to it: renaming or removing one breaks those links, and the index is the only thing that catches it.

A state is a scenario, never a width: posture comes from the window or the Viewport control, so a state never has a "· phone" twin.

> **A copied link depends on the host.** When the page is framed in the console, which addresses a prototype by its URL hash (`#<app>/<slug>`), `kitStateLink` rebuilds that address with `?state=<id>` after the hash, and the console forwards that query onto the iframe `src`.

## Conventions

- **JSX over `window`.** Every file exports with `Object.assign(window, { ... })`; scripts do not share Babel scope. Load order is fixed in `index.html`.
- **No `const styles = {}`.** Name style objects after their component — collisions across files are silent and fatal.
- **Container / presentation split**, focused components, split past ~200 lines.
- **State** lives in `main.jsx` unless it is purely local chrome state (a drawer, a transition).
- **Comments never cite a `docs/` path.** A comment may state what the code does and any rule or decision it keeps, reason included ("required before Terms ship"). It never points at a task folder or a handoff: those move when work is archived, and the pointer then leads nowhere.
- **Comments carry intent and mapping, and flag the special; nothing else.**
  - Intent: a rule or decision the code keeps, with its reason.
  - Mapping: a short label that helps a reader find their way around a file, or says where a part sits in the product.
  - The special: behaviour a rebuild from screenshots of the usual states would get wrong (adaptive styling, overlap or overflow handling, a value chosen against the default). Mark it `// KEEP:` and state the outcome the product must keep, in plain words with any numbers that matter, then one clause of why. Never the algorithm. These marks are written for another agent: the one that integrates this prototype into the product reads `KEEP:` as "preserve this", so it never needs speccing in a ticket. Change that behaviour and you update or remove its `KEEP:` in the same edit.
  - No narration. A comment that restates what the code plainly does is deleted.
- **Prefix.** Everything the kit names carries `kit` / `KIT` (`KIT_STATES`, `kitResolveState`, `.kit-config-*`). `app/README.md` says the same.
