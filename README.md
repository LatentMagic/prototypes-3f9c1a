# prototypes

LatentMagic **Claude Design prototypes** — home for high-fidelity interactive prototypes built with the Claude Design agent.

## What lives here

- One folder per prototype.
- Self-contained exports — markup, styles, mock data, authored copy.
- Snapshots of product UI intent, ahead of build.

## How it fills

Added by hand — copy a Claude Design export in, register its console entry, commit (see `CLAUDE.md`, "Add a prototype"). The working line accretes into the `next` prototype rather than minting a new slug per change.

## Running the console

```
npm install && npm start
```

Opens a zero-dependency static server at **http://localhost:4321** — the **Specimen Console**, a graphite shell with one tab per prototype. Each tab swaps the prototype shown in the stage; the rail's "version spine" tracks them as a commit-style timeline. A **Desktop · Mobile** toggle in the meta bar clamps the stage to phone width so each prototype reflows to its mobile layout.

Each prototype is deep-linkable at `#<slug>` — e.g. `…/prototypes-3f9c1a/#main` opens straight to that tab, and the URL tracks the active tab so it's always ready to copy and share.

A server is needed (not `file://`) because each prototype loads its `app/*.jsx` via babel-standalone, which XHR-fetches the modules — that fetch fails on CORS over `file://`.

### Prototypes

- **main** — `v0.3.0` (LM-367 · LM-369) — the current shipped line; carries change email (LM-367), champion space controls (LM-369), and a member-email visibility gate (champion/owner only, PII fix). Everything ahead of this accretes in `next`.
