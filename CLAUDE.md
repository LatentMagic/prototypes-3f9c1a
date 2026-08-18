# prototypes

LatentMagic Claude Design prototypes plus a console that browses them.

## What this repo is

- `app/<slug>/` — one self-contained Claude Design prototype each (markup, `tokens.css`, `app/*.jsx`, `favicon.svg`). Copied in verbatim; never hand-edited.
- `index.html` — the **Specimen Console** wrapper: a graphite shell with one tab per prototype.
- `server.js` — zero-dependency Node static server.

## The working line — `canon`

One state, not a shipped/coming split: **`canon`** is the single agreed-upon prototype — what's been settled on, whether or not it's built yet. Each new Claude Design export for the live line **replaces `app/circlists/canon/` wholesale** (verbatim, never hand-edited) and gains a `changelog` entry.

Don't mint ticket-named slugs, and don't split off a separate "shipped" mirror — changes accrete into `canon` alone. Alternatives get explored as **playgrounds** inside Claude Design itself, not as separate console tabs.

**Commit messages stay feature-flavoured** (`feat(circlists): <feature>`) when it's natural — a hint an agent reads later, not a ledger to maintain.

**`next` is retired** as the working-line slug, superseded by `canon`. It has joined the retired `main`/`baseline`/`lm-298-…`/`lm-270-…` chain — removed from the console and the repo, not archived.

## Reference nodes (the brand pack)

Not every rail node is a prototype version. A **reference node** carries a `kind` (e.g. `kind: 'brand'`) — it sits at the top of the rail with its own amber accent, lifted off the version spine, and the default landing skips it so the console still opens on the working line. It's deep-linkable like any node (`#brand`).

The Circlists brand pack is the first: `app/circlists/brand/` holds `circlists-brand.html` plus the lockup SVGs (`circlists-lockup.svg`, `circlists-lockup-reversed.svg`), all verbatim copies of the brand-pack export. Its source of truth is the company wiki — [circlists/brand](https://github.com/LatentMagic/wiki/tree/main/wiki/products/circlists/brand) (local: `../harness-intent-wiki/wiki/products/circlists/brand`) — which updates over time, so the copy is a point-in-time snapshot — **refresh it by re-copying the wiki's brand files over `app/circlists/brand/`** (shell copy, never hand-edited).

The console's favicon is the canonical Circlists mark, shipped from the brand pack as the standard icon set held at the repo root — `favicon.ico` (universal fallback), `circlists-mark.svg` (modern browsers), `apple-touch-icon.png` (iOS) — referenced by `index.html`. Root placement keeps them console-owned, not borrowed from a shell-copied prototype dir a re-export could change; refresh by re-copying from the wiki brand pack's `assets/`. The rail title is the brand pack's **reversed** (light-on-dark) lockup — `app/circlists/brand/circlists-lockup-reversed.svg` — referenced by the active app's `logo`, so it refreshes with the rest of the brand pack. Both are brand assets the console owns, not borrowed from a prototype dir a re-export could change.

## Candidate nodes

A **candidate** is an unratified proposal for the working line — a second state of the app, built in Claude Design as its own entry over the shared `app/`, offered as an answer to a ticket. `652-discourse` is one.

It is not a reference node and not a version. A reference node lifts off the version spine because it is a different kind of thing; a candidate **stays on the spine**, because it is a state of the app proposing a position on that line. What marks it is the periwinkle accent (`--candidate`) and a **hollow dot** — the ring says a position has been proposed and not yet filled.

Register one with `kind: 'candidate'`, a `version` naming what it proposes (`proposal`, not a version number), and the `ticket` it answers. The `kind` also keeps it out of the default landing, so the console still opens on the working line.

**A candidate is temporary by design.** Once ratified, the design folds into `canon` and the node goes — slug, entry and all. A candidate that has outlived its ticket is stale, not history: delete it rather than leaving it on the rail, and let `canon`'s changelog carry what landed.

## How the console works

- One `<iframe>` per prototype, so each runs in its own document — full runtime isolation, no shared globals.
- Each iframe's `src` is set lazily on first tab activation, then tabs toggle with `display`. State survives switching; prototypes don't recompile on every switch.
- One JS meta-map in `index.html` (keyed by slug) is the single source of truth for tabs, the meta header, and iframe sources.
- **`desc` says what a node *is*, in one or two sentences — never what it carries.** It renders untruncated in the desktop info bar and again at the foot of the mobile drawer, so every feature appended to it is stage space taken from the prototype. Feature history has exactly one home: the `changelog` array behind the Changes button. When a fresh export lands, append a `changelog` entry and leave `desc` alone.
- Each prototype's optional `changelog` array (same object, in `index.html`) is its actual changelog — rendered in a "recent changes" drawer, per-slug. `README.md`'s one-line-per-prototype summary is documentation, not the changelog; don't confuse the two.
- Each prototype is deep-linkable at `#<slug>` (e.g. `#canon`): activating a tab writes the slug to the URL hash (via `replaceState`, so no history spam), and an incoming hash — on load or back/forward — selects that tab. An unknown or empty hash falls back to the first tab. The slug is therefore the shareable link, so pick slugs accordingly.
- The shell is responsive: at ≤640px the rail collapses into an off-canvas drawer opened from a top bar. Console responsiveness lives in `index.html` only, not any individual prototype's own layout handling.

## Why a server (not file://)

Each prototype's entry HTML (`circlists.html` on the working line; `latentpulse.html` on the legacy slugs) loads `app/*.jsx` via babel-standalone, which **XHR-fetches** each module. Over `file://` that fetch fails on CORS, so the app never mounts. `server.js` serves everything over `http://` on one origin, which makes the fetch succeed.

## Run

```
npm install   # no-op — zero dependencies
npm start     # → http://localhost:4321
```

Node >= 18. `npm install` exists only so the standard `install && start` flow works.

## Add a prototype

1. Copy its whole export dir into `app/<slug>/` verbatim — the entry HTML (`circlists.html`), `tokens.css`, `favicon.svg`, `app/` with the `.jsx` modules, **any folder the app loads at runtime** (e.g. `brand/`, which holds the lockup/wordmark SVGs the app fetches via `<img>`), and every project doc the export ships (`CLAUDE.md`, `ABOUT.md`, `BRANDING.md`, `CHANGELOG.md`, `DEMO.md`, `INTENT.md`, `docs/`) — they're load-bearing reference material, not clutter. Drop only the authoring-session cruft: `.playwright-mcp/`, `.thumbnail`, `screenshots/`, `skills/`, `scraps/`, and any `uploads/*` subfolder the page itself doesn't fetch. Never strip a folder the browser fetches, or the assets 404.
2. Add one entry — `{ slug, version, ticket, desc }` — to `APPS.<app>.prototypes` in `index.html`. Order is version order, which is also tab order.

**Updating the working line** — a fresh export for the live line replaces `app/circlists/canon/` in place (same verbatim rule as step 1 — copy the whole export, including `brand/`). Don't add a new slug; keep the single `canon` entry in `index.html` and append a `changelog` entry to it — the entry is where the new features go, not `desc`. `next` no longer takes updates — see "The working line" above.

**Commit gate** — updates here can't be verified by the user. Commit and push once the agent has verified and is happy.

## Deploy

Published via **GitHub Pages** at https://latentmagic.github.io/prototypes-3f9c1a/. A push to `main` triggers the `pages-build-deployment` Actions job, which serves the repo as-is (no build step) in ~25s.

- **Check status** — `gh api repos/LatentMagic/prototypes-3f9c1a/pages/builds/latest` (or `gh run list`).
- **Stuck deploy** — usually a GitHub Actions incident ([githubstatus.com](https://www.githubstatus.com)), not the repo: the queued job just hasn't run. Wait it out; nothing to fix.
- **Old version after it deployed** — browser cache. Hard-refresh (Cmd-Shift-R).

## Runtime dependency

React, ReactDOM, and Babel load from unpkg; fonts from Google Fonts. **Offline, the prototypes render blank** — they need the CDN.

The console shell uses no CDN, so it renders fully offline — only the prototype iframes go blank. A blank iframe in a CDN-blocked sandbox is therefore not a console bug, and console behaviour can still be validated offline by driving the shell with `playwright-core` against the pre-installed Chromium (`/opt/pw-browsers`).
