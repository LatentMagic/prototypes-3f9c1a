# prototypes

LatentMagic Claude Design prototypes plus a console that browses them.

## What this repo is

- `app/<slug>/` — one self-contained Claude Design prototype each (markup, `tokens.css`, `app/*.jsx`, `favicon.svg`). Copied in verbatim; never hand-edited.
- `index.html` — the **Specimen Console** wrapper: a graphite shell with one tab per prototype.
- `server.js` — zero-dependency Node static server.

## The working line — `product` and `next`

Two conceptual states, not a ticket-per-slug chain:

- **`product`** — a mirror of what's shipped. Add this tab only when a side-by-side is actually wanted; nothing depends on it existing.
- **`next`** — one accreting prototype holding everything ahead of product. Each new Claude Design export for the live line **replaces `app/circlists/next/` wholesale** (verbatim, never hand-edited) and gains a `changelog` entry.

Don't mint ticket-named slugs for the working line any more — changes accrete into `next`. The older ticket slugs (`lm-298-…`, `lm-270-…`, `lm-367-369-…`) stay as legacy; leave them be.

**Resolution ledger = commit history.** Keep commit messages feature-flavoured (`feat(latentpulse): <feature>`) when it's natural — they're a hint an agent reads later, not a contract to uphold. Resolving `next` into product is a later agent job: diff `next` against product, re-slice by feature from the code, and land one feature at a time. Nothing is pre-built for it now — the changelog is a human-facing convenience, not the ledger.

## Reference nodes (the brand pack)

Not every rail node is a prototype version. A **reference node** carries a `kind` (e.g. `kind: 'brand'`) — it sits at the top of the rail with its own amber accent, lifted off the version spine, and the default landing skips it so the console still opens on the working line. It's deep-linkable like any node (`#brand`).

The Circlists brand pack is the first: `app/circlists/brand/circlists-brand.html`, a verbatim copy of the brand-pack export. Its source lives outside this repo and updates over time, so the copy is a point-in-time snapshot — **refresh it by re-copying the current export over `app/circlists/brand/circlists-brand.html`** (shell copy, never hand-edited).

The console's own favicon and rail lockup are the canonical Circlists mark + wordmark, inlined in `index.html` (a data-URI icon and `<symbol>` defs the lockup `<use>`-references). The shell owns its brand this way rather than borrowing from a prototype dir a re-export could change.

## How the console works

- One `<iframe>` per prototype, so each runs in its own document — full runtime isolation, no shared globals.
- Each iframe's `src` is set lazily on first tab activation, then tabs toggle with `display`. State survives switching; prototypes don't recompile on every switch.
- One JS meta-map in `index.html` (keyed by slug) is the single source of truth for tabs, the meta header, and iframe sources.
- Each prototype's optional `changelog` array (same object, in `index.html`) is its actual changelog — rendered in a "recent changes" drawer, per-slug. `README.md`'s one-line-per-prototype summary is documentation, not the changelog; don't confuse the two.
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
2. Add one entry — `{ slug, version, ticket, desc }` — to `APPS.<app>.prototypes` in `index.html`. Order is version order, which is also tab order.

**Updating the working line** — a fresh export for the live line replaces `app/circlists/next/` in place. Don't add a new slug; keep the single `next` entry in `index.html` and append a `changelog` entry to it.

## Runtime dependency

React, ReactDOM, and Babel load from unpkg; fonts from Google Fonts. **Offline, the prototypes render blank** — they need the CDN.

The console shell uses no CDN, so it renders fully offline — only the prototype iframes go blank. A blank iframe in a CDN-blocked sandbox is therefore not a console bug, and console behaviour can still be validated offline by driving the shell with `playwright-core` against the pre-installed Chromium (`/opt/pw-browsers`).
