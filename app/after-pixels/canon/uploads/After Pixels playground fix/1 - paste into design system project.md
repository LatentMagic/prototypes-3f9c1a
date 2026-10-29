# After Pixels design system — playgrounds mount only on their own page

## What changes

1. **Six playground files mount only on their own page** — each one draws itself into `#root` only on a page that loads that file.
2. **A handoff** — `docs/specs/playground-mount/handoff-2026-10-29-playground-mount.md`.

> Delta instruction for the existing After Pixels design system session. Paste as a follow-up message, with the six attached files.

`_ds_bundle.js` carries every `.jsx` in this project, playgrounds included. Six playground files end by mounting themselves into `#root`, so any page that loads the bundle draws all six one after another before its own content. The After Pixels prototype loads the bundle, so it showed the Canonical row rounds and the Available games cards while loading. Each playground page did the same, flashing the other five first.

**Your own space.** Keep any working material for this in `docs/specs/playground-mount/`. If this project has no `docs/specs/` yet, scaffold it: one folder per piece of work, and a `README.md` saying only that.

**Check before building.** For each file below, check whether its mount is already guarded. Where it is, leave it.

**Ratified — do not reopen.** A playground mounts only on a page that loads its own file. Nothing else about any playground changes.

### 1. Guard each playground's mount

In each file, the one line that mounts the playground gains a guard that checks for its own script tag, with a comment above it. The rest of the file is unchanged. The attached copies are the fixed files.

```js
// Mount only on this playground's own page: the design-system bundle also carries this file, and the prototype loads the bundle.
if (document.querySelector('script[src$="pg-row-app.jsx"]')) ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

The filename in the guard is the file's own name:

- `docs/specs/canonical-row/playground/pg-row-app.jsx` (`<App />`)
- `docs/specs/canonical-row/playground/pg-row2-app.jsx` (`<CqApp />`)
- `docs/specs/canonical-row/playground/pg-row3-app.jsx` (`<C3App />`)
- `docs/specs/canonical-row/playground/pg-row4-app.jsx` (`<C3App />`)
- `docs/specs/card-chip-alignment/playground/pg-chip-align.jsx` (`<App />`)
- `docs/specs/card-snug-title/playground/pg-card-snug-title.jsx` (`<App />`)

Then rebuild `_ds_bundle.js` so it carries the guarded files.

---

Everything not named above stands as it is: every component, token, card, playground's content and controls, and the playgrounds' data files.

**Acceptance criteria** — done when:

- [ ] Each of the six files' mount line carries the guard with its own filename.
- [ ] The rebuilt `_ds_bundle.js` carries the guard in each of the six.
- [ ] Each of the six playground pages renders only its own playground, with nothing drawn before it.
- [ ] `find.html` and the component cards render as before.
- [ ] You have written the handoff below.

**Hand off.** When the build is done, write a handoff to `docs/specs/playground-mount/handoff-2026-10-29-playground-mount.md`: what you changed and where, whether the bundle rebuilt with the guards, anything you could not do, and what you would do next.
