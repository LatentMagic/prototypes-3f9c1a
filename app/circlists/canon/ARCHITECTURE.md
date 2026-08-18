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
| `app/config.jsx` | deletable aid | launcher + review settings gone |
| `app/states.jsx`, `app/states-ui.jsx` | deletable aids | states register gone: no `?state=`, no palette, no index |
| `app/circ-tweaks.jsx`, `app/tweaks-panel.jsx` | deletable aids | Tweaks gone; baked-in defaults render |

This is how the homepage demo is derived: by **omitting** files, never by editing the core.

## Addressable states

A ticket in the real build links to this prototype, so a reviewer has to be able to arrive at the
state the ticket is about — leaving a circle, a dormant circle, a payment retrying — without knowing
a click path.

`app/states.jsx` is the **register**: one entry per staged state, `{ group, id, label, stage }`. The
`id` is the state's address (`dormant-circle`, `funding-retrying`); `stage` is the staging function
(these moved out of Config, which now holds review settings only). Everything else is derived from
that one list and cannot drift from it:

- **`?state=<id>`** on the entry. `main.jsx` reads it once at mount (`circResolveState`) and stages
  the named state in an effect, so a named state **overrides the restored `localStorage` route**.
  Nothing in the address ⇒ the app opens on the top circle, exactly as the real app does.
- **`?state=index`, or a name the register does not hold** ⇒ the states index (`StatesIndex`,
  `app/states-ui.jsx`) renders instead of the app. That is how a stale ticket link shows itself: the
  reader sees a catalogue that does not contain the name they came for, rather than the wrong screen.
- **The palette** — the launcher's second half. Jump to a state, or copy its link.
- **`window.CIRC_STATES`** — ids, labels and groups, published on the page for anything inspecting
  it. No staging functions, nothing runnable. A sibling JSON file would not survive the single-file
  export, which is why it is a global.

An `id` is **public** once a ticket links to it: renaming or removing one breaks those links, and the
index is the only thing that catches it.

> **The resolver looks inert in preview, and is not.** Nothing in the design tool can hand this page
> a URL, so `?state=` does nothing there, in every posture. It is exercised by driving the register
> directly (`window.buildStates`, the palette, the index) — never by concluding from a screenshot
> that the address reading is dead. **Do not delete it on that evidence.** It also depends on the
> console forwarding the query string onto the iframe `src`; that is outside this project.

## Web-only payments

App posture + **Config → Mobile payments: Off** routes every funding / checkout / provider path to
the finish-on-web handoff (`WebHandoff`, `app/subscriptions.jsx`). It is a single render-level
guard in `main.jsx` covering `PAYMENT_ROUTES`, so *all* entry points — real flows and Config
scenarios alike — are covered and no checkout, price, or provider surface is reachable in-app.
`On` runs the real wizard in the app posture. Web ignores the setting entirely.
(Every state in the register goes through the same guard, so a deep link cannot reach a checkout
surface in-app either.)

## Conventions

- **JSX over `window`.** Every file exports with `Object.assign(window, { ... })`; scripts do not
  share Babel scope. Load order is fixed in `circlists.html`.
- **No `const styles = {}`.** Name style objects after their component — collisions across files
  are silent and fatal.
- **Container / presentation split**, focused components, split past ~200 lines. See
  `skills/frontend-ui-engineering/SKILL.md`.
- **State** lives in `main.jsx` unless it is purely local chrome state (a drawer, a transition).
