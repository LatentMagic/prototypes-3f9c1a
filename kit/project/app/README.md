# kit/project/app

A no-build page: `index.html` loads React and Babel from the CDN, then each file below as a `text/babel` script. Files share state through `window`; nothing is imported. It must be served (not `file://`). Prefix for everything the kit names: `kit` / `KIT`; the Golden Sample App's content is `gsa` / `Gsa` / `GSA`.

## Files, in load order

| File | What it is | A new product |
|---|---|---|
| `../tokens.css` | The custom properties the aids and the app read | replaces it with its own tokens, same property names |
| `../gsa.css`, `../gsa-<area>.css` | The Golden Sample App's base, shared-component and per-area styles (shell, queue, auth, account, billing, checkout, people, push) | replaces them with its own |
| `primitives.jsx` | `Icon`, the six glyphs the aids draw, and the dialogs' shared scroll lock (`kitLockScroll`) | adds its own primitives; keeps those |
| `gsa-data.jsx` | The Golden Sample App's seed: the fiction every screen opens on; the only place a demo fact lives, and every screen, state and rig reads it | replaces it with its own seed |
| `gsa-store.jsx` | The store (`window.GsaStore`, `useGsa`): route, session, queue, subscription, space, push, review flags, and the verbs that move between screens | replaces it with its own state |
| `gsa-ui.jsx` | Shared UI: buttons, fields, form and busy hooks, dialog, menu, card, status line | replaces or reuses |
| `gsa-shell.jsx`, `gsa-site.jsx` | The frame (header, top bar, user menu, footer) and the site pages (not found, can't connect, legal, paid feature) | replaces them |
| `gsa-queue.jsx` | Home: the queue, its tabs, the add form, mark as done | replaces it |
| `gsa-auth.jsx`, `gsa-auth-codes.jsx` | Sign-in, sign-up, the code steps, password recovery, the provider round trip | replaces them |
| `gsa-account.jsx`, `gsa-account-dialogs.jsx`, `gsa-billing.jsx` | The Account page, its dialogs, and the Subscription card with Cancel and Plan | replaces them |
| `gsa-checkout.jsx` | Plans, Subscribe, and the pictured hosted payment page | replaces it |
| `gsa-invite.jsx`, `gsa-connect.jsx` | Invitations and the shared space; connecting an AI app | replaces them |
| `gsa-push.jsx` | Notifications (a droppable module) | drops it, or replaces it |
| `gsa-states-home.jsx`, `gsa-states-account.jsx`, `gsa-states-people.jsx` | The Golden Sample App's entries for the states register, published as `window.GSA_STATES_*` | replaces them with its own entries |
| `states.jsx` | The states register, the `?state=` resolver, the link builder, `window.KIT_STATES` | replaces the stager library and the register |
| `states-ui.jsx` | The States palette and the states index | leaves alone |
| `config.jsx` | The Config pill, the Config modal, and the parts a product builds its Config rows from (`ConfigGroup`, `ConfigRow`, `ConfigAction`, `ConfigNote`) | leaves alone |
| `qa.jsx` | The QA list | replaces the entries |
| `gsa-config.jsx` | The Golden Sample App's Config rows, published as `window.ConfigExtra` | replaces it with its own rows |
| `main.jsx` | Root: the Viewport and Platform settings, the app posture's system bars, mounts the Golden Sample App's root and the aids | replaces the screen wiring; keeps the rest |

Every file from `states.jsx` to `gsa-config.jsx` is a deletable aid: remove the file and its script tag in `../index.html`, nothing else, and the page still works. Each can go on its own. `main.jsx` loads last.

## Adding things

- **A state:** add `{ group, id, label, platform?, stage: (c) => ... }` to the matching `GSA_STATES_*` list in its `gsa-states-*.jsx` file; `KIT_STATE_REGISTER` in `states.jsx` gathers them. `c` holds what `main.jsx` passes to `buildStates`: the store (`GsaStore`) and `setPlatform`; read and change app data through the store. The id becomes `?state=<id>` and is public once linked. An id is lowercase letters, digits and single hyphens (`sign-in`), unique, and not `index` or `states`; any other id is refused at load with a console error naming it, and the state appears nowhere.
- **A QA entry:** add `{ key, title, note?, only?, steps: ['state-id', ...] }` to `KIT_QA` in `qa.jsx`. Steps are state ids only; one that is not in the register shows as "Not in the register". `only` names a `window` property, and the entry shows only when it is set. Delete the entry when the work is signed off.
- **A Config row:**
  1. Edit `gsa-config.jsx`, or replace it with a file of your own. That file defines one component that holds every product row, and ends with `Object.assign(window, { ConfigExtra: YourComponent });`.
  2. Build the component from the four parts `config.jsx` publishes on `window`. Never write Config markup or `kit-config-*` classes by hand.
     - `ConfigGroup({ title, scope, children })` holds rows. A group with `scope="global"` joins the Global section, which holds the settings for the whole prototype, such as who is signed in; its `title` shows as a heading inside Global. Every other group is one feature's settings, and its `title` names its own section in the rail.
     - `ConfigRow({ label, value, onChange, options, hint })` is one choice. `options` is a list of `{ value, label }`; `onChange` receives the chosen `value`.
     - `ConfigAction({ label, onClick, hint })` is a one-shot event, such as a renewal that fails. Config shows a group's actions together under Events. A click plays Config's exit, then runs `onClick` and closes Config, so an animated act plays on a clear screen. The handler never closes Config itself.
     - `ConfigNote({ children })` is one short line that says why a row is absent, such as "Plans page: off while Takes payment is No".
  3. Keep each `hint` to one or two short sentences. A hint opens under its row from an info button; an action's hint opens from the Events heading.
  4. Only one file can publish `window.ConfigExtra`. With two, the one loaded last wins and the other's rows never show. If you replace the file, swap its script tag in `../index.html` (after `config.jsx`, before `main.jsx`).

## Candidate builds

`main.jsx` reads `window.KitCandidate` once per render, if a candidate build's entry has loaded one: `bind(api)` is handed the app's state and setters (`items`, `setItems`, `isMobile`, `isApp`, and `gsa`, the store), and `Screen` replaces the whole app, so a change to one screen re-publishes that screen on `window` instead. Absent, the page is unchanged. `skills/candidate-build/SKILL.md` says how it is used.

## Known limits

- The Viewport and Platform settings are held in `main.jsx` for the page's life only: a reload returns them to Auto and Web.
- With `config.jsx` removed, the Config pill goes, and the States palette and QA with it; only `?state=` and the index remain.
- QA depends on the States palette: with `states-ui.jsx` (or `states.jsx`) removed, the QA half of the Config pill goes too.
- The dialogs do not contain focus: Tab can leave an open dialog for the Config pill behind it.
- `?state=` does nothing inside the design tool's preview: it cannot hand the page a URL.
