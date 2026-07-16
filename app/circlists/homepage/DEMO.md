# The live demo (iframe)

The hero's "live demo" is a **live prototype of the app**, embedded — not screenshots. Read this before touching it.

## Two parts, different rules

- **The app** lives in `uploads/homepage-demo/` (`app.js` + `tokens.css` + `swell.css` + `fonts.css` + `fonts/` + React's two UMD files + `brand/`). It's **vendored**: a first pass from another agent, hosted elsewhere as the live prototype. **Never edit it.** It can receive updates (a new drop replaces the folder), but the site never reaches inside.
  - It is **self-contained on purpose** — React and the fonts ship inside it rather than loading from `unpkg` / Google Fonts, so an embedded demo makes **no third-party request**. A drop that reintroduces an external URL is a regression: it belongs back in the build (`tools/homepage-demo/`), not patched here.
- **The frame** is ours: the `.appdemo` block in `index.html` + `site.css`, and `demo-embed.html`. We style *around* the app, never *into* it.

## How it's wired

`index.html` iframes **`demo-embed.html`**, a thin wrapper we own. It's the app's own `index.html` with three deliberate changes:
1. `<base href="uploads/homepage-demo/">` — so the app's relative asset paths resolve.
2. A seam script setting `window.CIRC_TWEAK_DEFAULTS = { accent, layout }` from a `?layout=` param.
3. `window.CIRC_FORCE_GATE = true` preserved — **without it the sign-up gate interactions go dead.** (I broke this once by dropping it.)

The controller script + `.appdemo` CSS handle: lazy-load, the branded loading poster, the mobile "tap-shield", and reloading on breakpoint crossings.

## Gotchas (both about the iframe viewport)

**1 — layout mode.** The app picks mobile-vs-desktop from the **iframe's own width** (breakpoint 1024px), *not* the device width. That's why we pass `?layout=` keyed to the real viewport — otherwise a landscape iframe (~1022px) always falls to mobile. Layout values: `auto` (mobile UI when narrow), `desktop`, `mobile` (dark phone bezel — unused).

**2 — phone-only side whitespace.** Inside an iframe, **mobile** browsers resolve the framed page's `width=device-width` to the *device* width, not the iframe's box — so on a real phone the app lays out at full-phone width inside a narrower card and the browser letterboxes it (grey margins). Desktop devtools emulation doesn't do this, so it looks fine there — misleading. Fix (in the controller's `fitMobile()`): on mobile, render the app at a **fixed logical width (402px)** and `transform: scale()` the iframe to fill the card exactly — a device-mockup trick that ignores how the phone resolves the iframe viewport. Desktop keeps the plain `inset:0` fill.

## When a new app drop arrives

Replace `uploads/homepage-demo/`, then regenerate `demo-embed.html` re-applying the three changes above.

## Worth flagging upstream

A **postMessage API** (parent sets layout/gate) would remove the wrapper file *and* the reload-on-resize entirely. Failing that: document the config globals (`CIRC_FORCE_GATE`, `CIRC_TWEAK_DEFAULTS`, layout modes) so they aren't rediscovered from minified source.
