---
name: circlists-prototypes
description: Work in the Circlists prototypes — read canon's code, open or screenshot a prototype state, build or review a playground. Use whenever a task touches app/circlists/.
---

# circlists-prototypes

The Circlists working line is `app/circlists/canon/`: a React + babel-standalone app with no build step, served by the repo's `server.js`. Canon's own docs are the authority on how it works; this skill says where things are.

## Map

All paths below are relative to `app/circlists/canon/`.

- `circlists.html` — the entry. Also holds the phone frame (`.circ-stage` / `.circ-phone` / `.circ-phone-clip`) and the hover/focus classes mounted components rely on (`.circ-cardaction`, `.circ-cardtitle`, focus rings).
- `app/*.jsx` — the modules. `main.jsx` is the root state machine and sets the posture breakpoint (`winW < 1024`). `shell.jsx` holds `MobileDrawer`. `states.jsx` + `states-ui.jsx` are the states register and index. `circ-tweaks.jsx` / `config.jsx` are the Config aid (including its Viewport Auto / Mobile control).
- `tokens.css`, `swell.css`, `brand/` — binding tokens and the brand pack.
- `docs/specs/<ticket>/` — all ticket-scoped work, playgrounds included (`playground/` inside it). `docs/archive/` holds finished explorations.
- `playgrounds.html` + `playgrounds.json` — the playground launcher and its manifest, derived from the tree.

Read before the code:

- `CLAUDE.md` — brand law, file placement, the playground placement and launcher rules, ratification. Its chat-reply rules are written for the Claude Design agent; ignore them here. Its skills are in `skills/`, read by path.
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
Read canon's own `skills/build-playground/SKILL.md` and its `references/`. Placement, `<base>` wiring and the launcher manifest are in canon's `CLAUDE.md` ("Playgrounds — placement and the launcher").
</important>

<important if="you are editing any file under app/circlists/canon/">
Every Claude Design export replaces `canon/` wholesale, including its `CLAUDE.md`. A hand edit survives only if it is recorded in canon's `changelog` entry in the root `index.html` (see the root `CLAUDE.md`).
</important>
