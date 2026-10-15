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
  1. Create a file in `app/`, for example `app/config-extra.jsx`. In it build one component from `kit-config-row` / `window.ConfigSeg`, as `config-extra.example.jsx` does, and end the file with `Object.assign(window, { ConfigExtra: YourComponent });`. That one component holds every product row.
  2. Delete `config-extra.example.jsx` and its script tag in `../index.html`. Only one file can publish `window.ConfigExtra`; with two, the one loaded last wins and the other's rows never show.
  3. Where that tag was (after `config.jsx`, before `main.jsx`), add `<script type="text/babel" src="app/config-extra.jsx"></script>`.

  A button with the class `kit-config-btn-secondary` inside the modal runs its handler and then closes the modal. A control that should leave the modal open uses `window.ConfigSeg` or its own class.

## Known limits

- The Viewport setting is held in `main.jsx` for the page's life only: a reload returns it to auto.
- With `config.jsx` removed, the Config pill goes, and the States palette and QA with it; only `?state=` and the index remain.
- QA depends on the States palette: with `states-ui.jsx` (or `states.jsx`) removed, the QA half of the Config pill goes too.
- The dialogs do not contain focus: Tab can leave an open dialog for the Config pill behind it.
- `?state=` does nothing inside the design tool's preview: it cannot hand the page a URL.
