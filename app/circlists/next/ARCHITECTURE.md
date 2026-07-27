# Architecture

How the Circlists prototype is put together. App-wide structure only — the app posture's own
rules live in [`MOBILE.md`](MOBILE.md).

## One app, three postures

Desktop web, mobile web, and **app** (native mobile) are three *presentation postures* of one
product, not three products. The rule that keeps them one:

> A change to a shared surface lands in all three postures with no per-posture edit.

Only the persistent **chrome** may differ between postures. Everything a user reads or acts on
inside that chrome — the feed, cards, members/settings, account, dormant, funding — is the same
component in every posture.

## How the swap works

`app/main.jsx` is the root state machine. It decides *which screen you are on* and never renders
chrome itself: it wraps the screen it built in `inShell(...)`.

```js
const Shell = (isApp && window.AppShellNative) ? window.AppShellNative : AppShell;
const inShell = (content, opts = {}) => <Shell {...props}>{content}</Shell>;
```

- **Web postures** get `AppShell` (`app/shell.jsx`) — rail on desktop, drawer on mobile web.
- **App posture** gets `AppShellNative` (`app/app-shell.jsx`) — top bar + bottom bar.
- Both shells take the **same prop surface** and the **same children**, so the screen inside is
  literally the same component either way. You cannot fork a surface per posture without visibly
  breaking that contract — which is the point.
- `isApp` comes from one switch: **Config → Platform (Web / Mobile)**. Session-only, not persisted.
  App posture always implies the phone viewport.

The only other posture-aware branch in the app is payments (below). Everything else is chrome.

## Deletable aids and droppable modules

Files the app tolerates being **absent**, read once per render off `window` so no import breaks:

| File | Kind | Absent ⇒ |
|---|---|---|
| `app/app-shell.jsx` | droppable module | app posture gone; everything falls back to `AppShell` |
| `app/home.jsx` | droppable body | home falls back to its empty state (`NoSpaceHome`) |
| `app/gate.jsx` | droppable module | preview gate gone; real flows run |
| `app/config.jsx` | deletable aid | Config launcher + scenarios gone |
| `app/circ-tweaks.jsx`, `app/tweaks-panel.jsx` | deletable aids | Tweaks gone; baked-in defaults render |

This is how the homepage demo is derived: by **deleting** files, never by editing the core.

## Web-only payments

App posture + **Config → Mobile payments: Off** routes every funding / checkout / provider path to
the finish-on-web handoff (`WebHandoff`, `app/subscriptions.jsx`). It is a single render-level
guard in `main.jsx` covering `PAYMENT_ROUTES`, so *all* entry points — real flows and Config
scenarios alike — are covered and no checkout, price, or provider surface is reachable in-app.
`On` runs the real wizard in the app posture. Web ignores the setting entirely.

## Conventions

- **JSX over `window`.** Every file exports with `Object.assign(window, { ... })`; scripts do not
  share Babel scope. Load order is fixed in `circlists.html`.
- **No `const styles = {}`.** Name style objects after their component — collisions across files
  are silent and fatal.
- **Container / presentation split**, focused components, split past ~200 lines. See
  `skills/frontend-ui-engineering/SKILL.md`.
- **State** lives in `main.jsx` unless it is purely local chrome state (a drawer, a transition).
