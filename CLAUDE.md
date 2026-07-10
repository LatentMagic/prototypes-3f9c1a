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

**Resolution ledger = commit history.** Keep commit messages feature-flavoured (`feat(circlists): <feature>`) when it's natural — they're a hint an agent reads later, not a contract to uphold. Resolving `next` into product is a later agent job: diff `next` against product, re-slice by feature from the code, and land one feature at a time. Nothing is pre-built for it now — the changelog is a human-facing convenience, not the ledger.

## Reference nodes (the brand pack)

Not every rail node is a prototype version. A **reference node** carries a `kind` (e.g. `kind: 'brand'`) — it sits at the top of the rail with its own amber accent, lifted off the version spine, and the default landing skips it so the console still opens on the working line. It's deep-linkable like any node (`#brand`).

The Circlists brand pack is the first: `app/circlists/brand/` holds `circlists-brand.html` plus the lockup SVGs (`circlists-lockup.svg`, `circlists-lockup-reversed.svg`), all verbatim copies of the brand-pack export. Its source of truth is the company wiki — [circlists/brand](https://github.com/LatentMagic/wiki/tree/main/wiki/products/circlists/brand) (local: `../harness-intent-wiki/wiki/products/circlists/brand`) — which updates over time, so the copy is a point-in-time snapshot — **refresh it by re-copying the wiki's brand files over `app/circlists/brand/`** (shell copy, never hand-edited).

The console's favicon is the canonical Circlists mark, shipped from the brand pack as the standard icon set held at the repo root — `favicon.ico` (universal fallback), `circlists-mark.svg` (modern browsers), `apple-touch-icon.png` (iOS) — referenced by `index.html`. Root placement keeps them console-owned, not borrowed from a shell-copied prototype dir a re-export could change; refresh by re-copying from the wiki brand pack's `assets/`. The rail title is the brand pack's **reversed** (light-on-dark) lockup — `app/circlists/brand/circlists-lockup-reversed.svg` — referenced by the active app's `logo`, so it refreshes with the rest of the brand pack. Both are brand assets the console owns, not borrowed from a prototype dir a re-export could change.

The **homepage-demo** node (`kind: 'demo'`, violet accent, `#homepage-demo`) is a second reference node — but a **built** one, the one exception to the copied-verbatim rule. It's the Circlists working line stripped to its gated core and bundled for embedding in the marketing site as an interactable iframe — so a homepage visitor can *feel* the app, with account-only actions (New circle, circle settings, account) blocked behind a preview gate. Build tooling + base live in [tools/homepage-demo/](tools/homepage-demo/); the served output is `app/circlists/homepage-demo/` (committed). Derivation is **delete-only** — see [README.md](tools/homepage-demo/README.md) for the delete-list rule and the rebuild command. GitHub Pages still serves the repo as-is: the build runs **locally** and its output is committed, so nothing builds on push.

The end-to-end process — deriving that node from one working-line prototype (reachability → build → verify) — is captured as the **`homepage-demo` skill** at [.claude/skills/homepage-demo/](.claude/skills/homepage-demo/SKILL.md). Reach for it when producing or refreshing the demo.

## How the console works

- One `<iframe>` per prototype, so each runs in its own document — full runtime isolation, no shared globals.
- Each iframe's `src` is set lazily on first tab activation, then tabs toggle with `display`. State survives switching; prototypes don't recompile on every switch.
- One JS meta-map in `index.html` (keyed by slug) is the single source of truth for tabs, the meta header, and iframe sources.
- Each prototype's optional `changelog` array (same object, in `index.html`) is its actual changelog — rendered in a "recent changes" drawer, per-slug. `README.md`'s one-line-per-prototype summary is documentation, not the changelog; don't confuse the two.
- Each prototype is deep-linkable at `#<slug>` (e.g. `#lm-367-369-champion-self-serve`): activating a tab writes the slug to the URL hash (via `replaceState`, so no history spam), and an incoming hash — on load or back/forward — selects that tab. An unknown or empty hash falls back to the first tab. The slug is therefore the shareable link, so pick slugs accordingly.
- The shell is responsive: at ≤640px the rail collapses into an off-canvas drawer opened from a top bar. Console responsiveness lives in `index.html` only — not to be confused with the `lm-270-mobile-width` prototype, which is verbatim prototype content.

## Why a server (not file://)

Each prototype's entry HTML (`circlists.html` on the working line; `latentpulse.html` on the legacy slugs) loads `app/*.jsx` via babel-standalone, which **XHR-fetches** each module. Over `file://` that fetch fails on CORS, so the app never mounts. `server.js` serves everything over `http://` on one origin, which makes the fetch succeed.

## Run

```
npm install   # no-op — zero dependencies
npm start     # → http://localhost:4321
```

Node >= 18. `npm install` exists only so the standard `install && start` flow works.

## Add a prototype

1. Copy its whole export dir into `app/<slug>/` verbatim — the entry HTML (`circlists.html`), `tokens.css`, `favicon.svg`, `app/` with the `.jsx` modules, **and any folder the app loads at runtime** (e.g. `brand/`, which holds the lockup/wordmark SVGs the app fetches via `<img>`). Delete only stray tooling (`.playwright-mcp/`, `.thumbnail`) — never strip a folder the browser fetches, or the assets 404.
2. Add one entry — `{ slug, version, ticket, desc }` — to `APPS.<app>.prototypes` in `index.html`. Order is version order, which is also tab order.

**Updating the working line** — a fresh export for the live line replaces `app/circlists/next/` in place (same verbatim rule as step 1 — copy the whole export, including `brand/`). Don't add a new slug; keep the single `next` entry in `index.html` and append a `changelog` entry to it.

## Deploy

Published via **GitHub Pages** at https://latentmagic.github.io/prototypes-3f9c1a/. A push to `main` triggers the `pages-build-deployment` Actions job, which serves the repo as-is (no build step) in ~25s.

- **Check status** — `gh api repos/LatentMagic/prototypes-3f9c1a/pages/builds/latest` (or `gh run list`).
- **Stuck deploy** — usually a GitHub Actions incident ([githubstatus.com](https://www.githubstatus.com)), not the repo: the queued job just hasn't run. Wait it out; nothing to fix.
- **Old version after it deployed** — browser cache. Hard-refresh (Cmd-Shift-R).

## Runtime dependency

React, ReactDOM, and Babel load from unpkg; fonts from Google Fonts. **Offline, the prototypes render blank** — they need the CDN.

The console shell uses no CDN, so it renders fully offline — only the prototype iframes go blank. A blank iframe in a CDN-blocked sandbox is therefore not a console bug, and console behaviour can still be validated offline by driving the shell with `playwright-core` against the pre-installed Chromium (`/opt/pw-browsers`).
