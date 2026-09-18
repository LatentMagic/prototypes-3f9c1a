# prototypes

LatentMagic **Claude Design prototypes** — home for high-fidelity interactive prototypes built with the Claude Design agent.

## What lives here

- One folder per prototype.
- Self-contained exports — markup, styles, mock data, authored copy.
- Snapshots of product UI intent, ahead of build.

## How it fills

Added by hand — copy a Claude Design export in, register its console entry, commit (see `CLAUDE.md`, "Add a prototype"). The working line accretes into the `canon` prototype rather than minting a new slug per change.

Three kinds of rail node, each with its own accent: the **working line** and its retired predecessors, on the version spine; **reference nodes** (amber, off the spine) for things that are not versions at all, like the brand pack; and **candidates** (periwinkle, hollow dot, on the spine) for an unratified proposal answering a ticket, which is deleted once its design folds into `canon`. Rules in `CLAUDE.md`.

## Running the console

```
npm install && npm start
```

Opens a zero-dependency static server at **http://localhost:4321** — the console, a graphite shell with one tab per prototype. Each tab swaps the prototype shown in the stage; the rail's "version spine" tracks them as a commit-style timeline. A **Desktop · Mobile** toggle in the meta bar clamps the stage to phone width so each prototype reflows to its mobile layout.

Each prototype is deep-linkable at `#<app>/<slug>` — e.g. `…/prototypes-3f9c1a/#circlists/canon` opens straight to that tab (a bare `#canon` still resolves), and the URL tracks the active tab so it's always ready to copy and share. Anything after `?` is handed to the prototype, which is how `?state=<id>` opens canon at a registered state.

A server is needed (not `file://`) because each prototype loads its `app/*.jsx` via babel-standalone, which XHR-fetches the modules — that fetch fails on CORS over `file://`.

## Checking a prototype

```
npm install && npm run check -- --slug canon
```

Drives headless Chromium through every addressable state a prototype declares (`window.CIRC_STATES`) at a couple of viewport widths, failing on JS errors, failed same-origin requests, a blank stage, or a resolver that silently falls back to the states index. It boots `server.js` itself if nothing is already listening.

It works offline and in network-restricted sandboxes: the first run caches React/ReactDOM/Babel from unpkg into `.playwright-mcp/check/cdn/` (via `curl`, which honours the proxy) and every later run and every state reuses that cache instead of hitting the network again.

Screenshots land in `.playwright-mcp/check/<slug>/<state>-<width>.png`. Options: `--slug`, `--widths` (comma-separated), `--states` (skip discovery, check just these ids), `--port`.
