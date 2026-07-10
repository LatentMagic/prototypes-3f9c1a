# The live demo (iframe)

The hero's "live demo" is a **live prototype of the app**, embedded — not screenshots. Read this before touching it.

## Two parts, different rules

- **The app** lives in `uploads/homepage-demo/` (`app.js` + `tokens.css` + `swell.css` + `brand/`). It's **vendored**: a first pass from another agent, hosted elsewhere as the live prototype. **Never edit it.** It can receive updates (a new drop replaces the folder), but the site never reaches inside.
- **The frame** is ours: the `.appdemo` block in `index.html` + `site.css`, and `demo-embed.html`. We style *around* the app, never *into* it.

## How it's wired

`index.html` iframes **`demo-embed.html`**, a thin wrapper we own. It's the app's own `index.html` with three deliberate changes:
1. `<base href="uploads/homepage-demo/">` — so the app's relative asset paths resolve.
2. A seam script setting `window.CIRC_TWEAK_DEFAULTS = { accent, layout }` from a `?layout=` param.
3. `window.CIRC_FORCE_GATE = true` preserved — **without it the sign-up gate interactions go dead.** (I broke this once by dropping it.)

The controller script + `.appdemo` CSS handle: lazy-load, the branded loading poster, the mobile "tap-shield", and reloading on breakpoint crossings.

## The one gotcha

The app picks mobile-vs-desktop layout from the **iframe's own width** (breakpoint 1024px), *not* the device width. That's why we pass `?layout=` keyed to the real viewport — otherwise a landscape iframe (~1022px) always falls to mobile. Layout values: `auto` (mobile UI when narrow), `desktop`, `mobile` (dark phone bezel — unused).

## When a new app drop arrives

Replace `uploads/homepage-demo/`, then regenerate `demo-embed.html` re-applying the three changes above.

## Worth flagging upstream

A **postMessage API** (parent sets layout/gate) would remove the wrapper file *and* the reload-on-resize entirely. Failing that: document the config globals (`CIRC_FORCE_GATE`, `CIRC_TWEAK_DEFAULTS`, layout modes) so they aren't rediscovered from minified source.
