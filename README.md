# prototypes

LatentMagic **Claude Design prototypes** — home for high-fidelity interactive prototypes built with the Claude Design agent.

## What lives here

- One folder per prototype.
- Self-contained exports — markup, styles, mock data, authored copy.
- Snapshots of product UI intent, ahead of build.

## How it fills

Populated by an overnight automation. Expect new prototypes to land without manual commits.

## Running the console

```
npm install && npm start
```

Opens a zero-dependency static server at **http://localhost:4321** — the **Specimen Console**, a graphite shell with one tab per prototype. Each tab swaps the prototype shown in the stage; the rail's "version spine" tracks them as a commit-style timeline. A **Desktop · Mobile** toggle in the meta bar clamps the stage to phone width so each prototype reflows to its mobile layout.

Each prototype is deep-linkable at `#<slug>` — e.g. `…/prototypes-3f9c1a/#lm-367-369-champion-self-serve` opens straight to that tab, and the URL tracks the active tab so it's always ready to copy and share.

A server is needed (not `file://`) because each prototype loads its `app/*.jsx` via babel-standalone, which XHR-fetches the modules — that fetch fails on CORS over `file://`.

### Prototypes

- **baseline** — `v0.2.1` (LM-239) — the accepted alpha prototype the two deltas build on.
- **lm-298-ux-consolidation** — `v0.2.2` (LM-298) — UX consolidation pass.
- **lm-270-mobile-width** — `v0.2.3` (LM-270) — mobile-width pass.
- **lm-367-369-champion-self-serve** — working prototype — where in-flight v1-delta changes land on the current line; carries LM-367 (change email) + LM-369 (champion space controls). Design pending.
