---
name: circlists-prototypes
description: Work in the Circlists prototypes — read canon's code, open or screenshot a prototype state, build or review a playground. Use whenever a task touches app/circlists/.
---

# circlists-prototypes

The Circlists working line is `app/circlists/canon/`: a React + babel-standalone app with no build step, served by the repo's `server.js`. Canon's own docs are the authority on how it works; this skill says where things are and carries the playground mechanics.

## Map

All paths below are relative to `app/circlists/canon/`.

- `circlists.html` — the entry. Also holds the phone frame (`.circ-stage` / `.circ-phone` / `.circ-phone-clip`) and the hover/focus classes mounted components rely on (`.circ-cardaction`, `.circ-cardtitle`, focus rings).
- `app/*.jsx` — the modules. `main.jsx` is the root state machine and sets the posture breakpoint (`winW < 1024`). `shell.jsx` holds `MobileDrawer`. `states.jsx` + `states-ui.jsx` are the states register and index. `circ-tweaks.jsx` / `config.jsx` are the Config aid (including its Viewport Auto / Mobile control).
- `tokens.css`, `swell.css`, `brand/` — binding tokens and the brand pack.
- `docs/specs/<ticket>/` — all ticket-scoped work, playgrounds included (`playground/` inside it). `docs/archive/` holds finished explorations.
- `playgrounds.html` + `playgrounds.json` — the playground launcher and its manifest, derived from the tree.

Read before the code:

- `CLAUDE.md` — brand law, file placement, the playground placement and launcher rules, ratification. Its `$skill` and chat-reply rules are written for the Claude Design agent; ignore them here.
- `ARCHITECTURE.md` — postures, `inShell()`, module load order, "Addressable states".
- `MOBILE.md` — the app posture.
- `GOTCHA.md` — traps with overlays, transforms and verification.

## States are addressable — never hand-roll a capture

- Open any registered state directly: `http://localhost:4321/app/circlists/canon/circlists.html?state=<id>`. `?state=index` (or an unknown id) lists every registered state. In the console: `#circlists/canon?state=<id>`.
- `npm run check` walks every registered state at 1280 and 390 and screenshots each to `.playwright-mcp/check/<slug>/`. For screenshots of a prototype, reach for this, narrowed with `--states`, before writing any capture script.

<important if="you need to serve, screenshot, or check a prototype">

| Command | What it does |
|---|---|
| `npm install && npm start` | Serve the console and prototypes at http://localhost:4321 (`PORT` overrides). Never `file://`: the module XHR fails on CORS |
| `npm run check -- [--slug canon] [--widths 1280,390] [--states a,b] [--port 4321]` | Drive every registered state of `app/circlists/<slug>/circlists.html` and screenshot each. Fails on a module that didn't load, a blank stage, or a state that lands on the index. Caches the CDN runtime, so it runs offline |
| `npx playwright-cli` (or `lm-tooling:playwright-cli`) | Drive one interaction by hand |

In a remote sandbox, follow the repo root's `CLOUD.md` first.
</important>

<important if="you are building, briefing, or reviewing a playground">

Placement, `<base>` wiring and the launcher manifest are in canon's `CLAUDE.md` ("Playgrounds — placement and the launcher"). A playground mounts the real app. It never draws a copy of it. Its mechanics here:

- **Posture follows `main.jsx`'s `winW < 1024`.** Never invent a breakpoint. A config rail that replaces the circle rail is docked with no toggle at ≥1024. Below 1024 it opens in the app's `MobileDrawer` behind the top bar's circles-menu button. In the app posture it is the Home destination. It is one rail body, never forked.
- **Viewport control (Auto / Mobile)** — copy the Config aid. Auto follows the window and never frames anything. Mobile forces the app posture inside `circlists.html`'s phone frame, copied verbatim.
- **Levers** — each option carries its own answers (`def`). Controls default to Auto and override explicitly. `mergeCfg(option, overrides)` is the one place they combine. Show an "overridden" flag, and publish every option's lever answers as a readout.
- **Re-key the app content only** (`key={optId + JSON.stringify(ov)}`). A key around the rig's framing remounts the rail and loses its scroll position.
- **Traceability strip** — for a derivation question: one function computes the display fields and returns a `trace`. Render the trace outside each card, with fallbacks in amber.
- **Fidelity** — mount the shipped component and own only its callbacks. You may copy a piece that is internal to a shipped module once. The copy points to its source and is never tuned. A second need exports it from the module instead. Content that sits inside the card border needs a copy of the card body.
- **3D flips** — toggle `visibility` per face with `transition: visibility 0s linear <half-duration>`. Don't rely on `backface-visibility` alone.
- **Overlays** — put the transform on the app surface wrapper, so `position: fixed` sheets pin to the app column (`GOTCHA.md` #5).
- **Babel wiring** — load order is dependency order. Babel scripts share no scope, so shared values go on `window` and each file reads its deps from `window` at the top. Name style objects per component, never `const styles = {}`.
- **Standalone export** — compiled output, never hand-edited, named kebab-case (`<slug>-playground-standalone.html`). As an asset, compile each module with the page's own Babel, inline the results and drop the Babel script. Delete the bundle from the project in the same session (canon `CLAUDE.md`).
- **Overflow** — if a mounted app component overflows with playground content, fix it in `app/`, as a prop that defaults to the app's value (`MobileDrawer` `width = 272`). Scrolling is a fix the app needs too. Check both axes at 320px.
- **`localStorage`** — persist selection and overrides under `pg_<slug>_v1`. Verification clicks share the user's storage, so reset the key to defaults after probing.
- A playground is not a product change: no `CHANGELOG.md` entry, and don't touch `app/` except for the prop fix above.
</important>

<important if="you are editing any file under app/circlists/canon/">
Every Claude Design export replaces `canon/` wholesale, including its `CLAUDE.md`. A hand edit survives only if it is recorded in canon's `changelog` entry in the root `index.html` (see the root `CLAUDE.md`).
</important>
