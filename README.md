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

Opens a zero-dependency static server at **http://localhost:4321** — the **Specimen Console**, a graphite shell with one tab per prototype. Each tab swaps the prototype shown in the stage; the rail's "version spine" tracks them as a commit-style timeline.

A server is needed (not `file://`) because each prototype loads its `app/*.jsx` via babel-standalone, which XHR-fetches the modules — that fetch fails on CORS over `file://`.

### Prototypes

- **greenfield** — `v0.2.1` (LM-239) — baseline per-space feed prototype.
- **lm-298-ux-consolidation** — `v0.2.2` (LM-298) — UX consolidation pass.
- **lm-270-mobile-width** — `v0.2.3` (LM-270) — mobile-width pass.
