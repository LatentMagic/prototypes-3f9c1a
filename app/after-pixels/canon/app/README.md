# kit/project/app

A no-build page: `index.html` loads React and Babel from the CDN, then each file below as a `text/babel` script. Files share state through `window`; nothing is imported. It must be served (not `file://`). Prefix for everything the kit names: `kit` / `KIT`.

## Files, in load order

| File | What it is | A new product |
|---|---|---|
| `../tokens.css` | The custom properties the aids and placeholder read | replaces it with its own tokens, same property names |
| `primitives.jsx` | `Icon`, the six glyphs the aids draw, and the dialogs' shared scroll lock (`kitLockScroll`) | adds its own primitives; keeps those |
| `states.jsx` | The states register, the `?state=` resolver, the link builder, `window.KIT_STATES` | replaces the stager library and the register |
| `states-ui.jsx` | The States palette and the states index | leaves alone |
| `config.jsx` | The Config pill and the Config modal shell | leaves alone |
| `qa.jsx` | The QA list | replaces the entries |
| `config-extra.example.jsx` | Example of adding a Config section | deletes, or replaces with its own |
| `main.jsx` | Root: state, the Viewport setting, placeholder screen, mounts the aids | replaces the seed and the screen; keeps the wiring |

Every file from `states.jsx` to `config-extra.example.jsx` is a deletable aid: remove the file and its script tag in `../index.html`, nothing else, and the page still works. Each can go on its own. `main.jsx` loads last.

## Adding things

- **A state:** add `{ group, id, label, stage: (c) => ... }` to `KIT_STATE_REGISTER` in `states.jsx`. `c` holds the setters `main.jsx` passes to `buildStates`; if the state needs a new one, add it to that `buildStates({ ... })` call in `main.jsx`. The id becomes `?state=<id>` and is public once linked. An id is lowercase letters, digits and single hyphens (`sign-in`), unique, and not `index` or `states`; any other id is refused at load with a console error naming it, and the state appears nowhere.
- **A QA entry:** add `{ key, title, note?, only?, steps: ['state-id', ...] }` to `KIT_QA` in `qa.jsx`. Steps are state ids only; one that is not in the register shows as "Not in the register". `only` names a `window` property, and the entry shows only when it is set. Delete the entry when the work is signed off.
- **A Config row:**
  1. Edit `gs-config.jsx`, or replace it with a file of your own. That file defines one component that holds every product row, and ends with `Object.assign(window, { ConfigExtra: YourComponent });`.
  2. Build the component from the four parts `config.jsx` publishes on `window`. Never write Config markup or `kit-config-*` classes by hand.
     - `ConfigGroup({ title, scope, children })` holds rows. A group with `scope="global"` joins the Global section, which holds the settings for the whole prototype, such as who is signed in; its `title` shows as a heading inside Global. Every other group is one feature's settings, and its `title` names its own section in the rail.
     - `ConfigRow({ label, value, onChange, options, hint })` is one choice. `options` is a list of `{ value, label }`; `onChange` receives the chosen `value`.
     - `ConfigAction({ label, onClick, hint })` is a one-shot event, such as a renewal that fails. Config shows a group's actions together under Events. A click plays Config's exit, then runs `onClick` and closes Config, so an animated act plays on a clear screen. The handler never closes Config itself.
     - `ConfigNote({ children })` is one short line that says why a row is absent, such as "Plans page: off while Takes payment is No".
  3. Keep each `hint` to one or two short sentences. A hint opens under its row from an info button; an action's hint opens from the Events heading.
  4. Only one file can publish `window.ConfigExtra`. With two, the one loaded last wins and the other's rows never show. If you replace the file, swap its script tag in `../index.html` (after `config.jsx`, before `main.jsx`).

  (Here `gs-pass-aids.jsx` is the one deliberate exception: it wraps the shipped `ConfigExtra` and renders it above its own Pass upsell group.)

## Known limits

- The Viewport setting is held in `main.jsx` for the page's life only: a reload returns it to auto.
- With `config.jsx` removed, the Config pill goes, and the States palette and QA with it; only `?state=` and the index remain.
- QA depends on the States palette: with `states-ui.jsx` (or `states.jsx`) removed, the QA half of the Config pill goes too.
- The dialogs do not contain focus: Tab can leave an open dialog for the Config pill behind it.
- `?state=` does nothing inside the design tool's preview: it cannot hand the page a URL.
