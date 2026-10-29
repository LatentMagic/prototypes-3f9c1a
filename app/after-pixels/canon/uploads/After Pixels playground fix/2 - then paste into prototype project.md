# After Pixels — no design-system playgrounds while the app loads

## What changes

1. **The app's copy of the design system carries the playground guard** — `_ds/…/_ds_bundle.js` no longer draws six playgrounds into `#root` while the app loads.
2. **A handoff** — `docs/specs/playground-mount/handoff-2026-10-29-playground-mount.md`.

> Delta instruction for the existing After Pixels prototype session. Paste as a follow-up message, after the design system project has taken the same fix.

While the app loads, the screen shows design-system playgrounds before the app replaces them: four Canonical row rounds, then the four Available games cards. They come from this project's copy of the design system bundle, `_ds/mcp-game-store-design-system-ef1abd5b-7567-4e3c-8294-c78583fbe929/_ds_bundle.js`. That bundle carries six playground files, and each one mounts itself into `#root`. The design system project now guards each mount so it runs only on that playground's own page.

**Your own space.** Keep any working material for this in `docs/specs/playground-mount/`. If this prototype has no `docs/specs/` yet, scaffold it: one folder per piece of work, and a `README.md` saying only that.

**Check before building.** Search `_ds/…/_ds_bundle.js` for `Mount only on this playground's own page`. If it appears six times, the fix is already here: change nothing, and say so in the handoff.

**Ratified — do not reopen.** The app shows nothing from the design system's playgrounds while it loads. Nothing else in the app changes.

### 1. Take the guarded bundle

Refresh this project's design system copy from the design system project, so `_ds/` carries its rebuilt bundle. If the copy cannot be refreshed, edit the bundle in place instead. In each of the six playground modules, the line `ReactDOM.createRoot(document.getElementById('root')).render(…)` gains this guard, with the module's own filename:

```js
// Mount only on this playground's own page: the design-system bundle also carries this file, and the prototype loads the bundle.
if (document.querySelector('script[src$="pg-row-app.jsx"]')) ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
```

The six modules, each headed in the bundle by a `// <path>` comment: `docs/specs/canonical-row/playground/pg-row-app.jsx`, `pg-row2-app.jsx`, `pg-row3-app.jsx` and `pg-row4-app.jsx` (same folder), `docs/specs/card-chip-alignment/playground/pg-chip-align.jsx`, and `docs/specs/card-snug-title/playground/pg-card-snug-title.jsx`.

---

Everything not named above stands as it is: every screen, state, copy line and component, and the rest of the bundle.

**Acceptance criteria** — done when:

- [ ] `_ds/…/_ds_bundle.js` carries the guard in each of the six playground modules.
- [ ] Loading `index.html` shows a plain screen and then the app, with no Canonical row text and no Available games cards drawn before it.
- [ ] `?state=index` and the home page render as before.
- [ ] You have written the handoff below.

**Hand off.** When the build is done, write a handoff to `docs/specs/playground-mount/handoff-2026-10-29-playground-mount.md`: whether the copy was refreshed or edited in place, what you changed, anything you could not do, and what you would do next.
