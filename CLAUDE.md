# prototypes

LatentMagic Claude Design prototypes plus a console that browses them.

## What this repo is

- `app/<slug>/` — one self-contained Claude Design prototype each (markup, `tokens.css`, `app/*.jsx`, `favicon.svg`). Copied in verbatim; never hand-edited.
- `index.html` — the **Specimen Console** wrapper: a graphite shell with one tab per prototype.
- `server.js` — zero-dependency Node static server.

## How the console works

- One `<iframe>` per prototype, so each runs in its own document — full runtime isolation, no shared globals.
- Each iframe's `src` is set lazily on first tab activation, then tabs toggle with `display`. State survives switching; prototypes don't recompile on every switch.
- One JS meta-map in `index.html` (keyed by slug) is the single source of truth for tabs, the meta header, and iframe sources.
- Each prototype is deep-linkable at `#<slug>` (e.g. `#lm-367-369-champion-self-serve`): activating a tab writes the slug to the URL hash (via `replaceState`, so no history spam), and an incoming hash — on load or back/forward — selects that tab. An unknown or empty hash falls back to the first tab. The slug is therefore the shareable link, so pick slugs accordingly.
- The shell is responsive: at ≤640px the rail collapses into an off-canvas drawer opened from a top bar. Console responsiveness lives in `index.html` only — not to be confused with the `lm-270-mobile-width` prototype, which is verbatim prototype content.

## Why a server (not file://)

Each prototype's `latentpulse.html` loads `app/*.jsx` via babel-standalone, which **XHR-fetches** each module. Over `file://` that fetch fails on CORS, so the app never mounts. `server.js` serves everything over `http://` on one origin, which makes the fetch succeed.

## Run

```
npm install   # no-op — zero dependencies
npm start     # → http://localhost:4321
```

Node >= 18. `npm install` exists only so the standard `install && start` flow works.

## Add a prototype

1. Copy its whole export dir into `app/<slug>/` verbatim (must contain `latentpulse.html`, `tokens.css`, `favicon.svg`, and `app/` with the `.jsx` modules). Delete any stray `.playwright-mcp/`.
2. Add one entry — `{ slug, version, ticket, desc }` — to the `SPECIMENS` array in `index.html`. Order is version order, which is also tab order.

## Runtime dependency

React, ReactDOM, and Babel load from unpkg; fonts from Google Fonts. **Offline, the prototypes render blank** — they need the CDN.

The console shell uses no CDN, so it renders fully offline — only the prototype iframes go blank. A blank iframe in a CDN-blocked sandbox is therefore not a console bug, and console behaviour can still be validated offline by driving the shell with `playwright-core` against the pre-installed Chromium (`/opt/pw-browsers`).
