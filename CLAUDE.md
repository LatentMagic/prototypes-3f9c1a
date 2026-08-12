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

**`next` is retired** as the working-line slug, superseded by `canon`. It's frozen — no new work lands there. LM-593 (in-app liveliness) is the one ticket still in flight against it; once that lands, `next` joins the retired `main`/`baseline`/`lm-298-…`/`lm-270-…` chain.

## Reference nodes (the brand pack)

Not every rail node is a prototype version. A **reference node** carries a `kind` (e.g. `kind: 'brand'`) — it sits at the top of the rail with its own amber accent, lifted off the version spine, and the default landing skips it so the console still opens on the working line. It's deep-linkable like any node (`#brand`).

The Circlists brand pack is the first: `app/circlists/brand/` holds `circlists-brand.html` plus the lockup SVGs (`circlists-lockup.svg`, `circlists-lockup-reversed.svg`), all verbatim copies of the brand-pack export. Its source of truth is the company wiki — [circlists/brand](https://github.com/LatentMagic/wiki/tree/main/wiki/products/circlists/brand) (local: `../harness-intent-wiki/wiki/products/circlists/brand`) — which updates over time, so the copy is a point-in-time snapshot — **refresh it by re-copying the wiki's brand files over `app/circlists/brand/`** (shell copy, never hand-edited).

The console's favicon is the canonical Circlists mark, shipped from the brand pack as the standard icon set held at the repo root — `favicon.ico` (universal fallback), `circlists-mark.svg` (modern browsers), `apple-touch-icon.png` (iOS) — referenced by `index.html`. Root placement keeps them console-owned, not borrowed from a shell-copied prototype dir a re-export could change; refresh by re-copying from the wiki brand pack's `assets/`. The rail title is the brand pack's **reversed** (light-on-dark) lockup — `app/circlists/brand/circlists-lockup-reversed.svg` — referenced by the active app's `logo`, so it refreshes with the rest of the brand pack. Both are brand assets the console owns, not borrowed from a prototype dir a re-export could change.

The **homepage** node (`kind: 'homepage'`, strong violet, `#homepage`) is a third reference node — the Circlists public marketing page itself, sitting **above** the demo, which styles as its lighter, italic **subtype** (the demo is the thing embedded *inside* this page). It's copied like any other node — same rule as step 1 below: every runtime file and project doc the export ships, minus authoring-session cruft. The one `uploads/*` subfolder that's genuinely runtime-fetched is `uploads/homepage-demo/` (`demo-embed.html` loads the embedded app from it) — sibling folders like `uploads/brand` or `uploads/motion` are Design-session reference uploads and don't travel. Refresh by re-copying from a fresh export. The demo therefore lives in two places — the standalone `homepage-demo` node and this embedded copy — and that's fine: each console node is self-contained. Read [DEMO.md](app/circlists/homepage/DEMO.md) before touching the embed — it covers the vendored-app-never-edit rule, the `demo-embed.html` seam, and the iframe-width layout gotcha.

The live marketing site lives in `public-sites/apps/circlists`, published at `www.circlists.com` — that is the source of truth. **Expect this node to be stale.** It's kept for grounding (the shape the page was designed in, and the embed seam the demo builds against), not as a mirror of what's live. Don't treat a divergence from the live site as a bug, and don't refresh on a schedule — re-copy only if a fresh export is actually wanted.

The **homepage-demo** node (`kind: 'demo'`, lighter-violet + *italic* label, `#homepage-demo`) is a second reference node — but a **built** one, the one exception to the copied-verbatim rule. It's the Circlists working line stripped to its gated core and bundled for embedding in the marketing site as an interactable iframe — so a homepage visitor can *feel* the app, with account-only actions (New circle, circle settings, account) blocked behind a preview gate. As a **console node it's ephemeral** — a surface to eyeball the build step in isolation; the copy that actually ships is the one embedded in the homepage node above (`uploads/homepage-demo/`). Build tooling + base live in [tools/homepage-demo/](tools/homepage-demo/); the served output is `app/circlists/homepage-demo/` (committed). Derivation is **delete-only for app code** — no module is ever rewritten — plus one thing the build does to the packaging: it **vendors React and the fonts** the working line would otherwise fetch from `unpkg` and Google Fonts, so the demo makes **no third-party request** once it's embedded in the public site. See [README.md](tools/homepage-demo/README.md) for the delete-list rule, the vendoring, and the rebuild command. GitHub Pages still serves the repo as-is: the build runs **locally** and its output is committed, so nothing builds on push.

The end-to-end process — deriving that node from one working-line prototype (reachability → build → verify) — is captured as the **`homepage-demo` skill** at [.claude/skills/homepage-demo/](.claude/skills/homepage-demo/SKILL.md). Reach for it when producing or refreshing the demo.

## How the console works

- One `<iframe>` per prototype, so each runs in its own document — full runtime isolation, no shared globals.
- Each iframe's `src` is set lazily on first tab activation, then tabs toggle with `display`. State survives switching; prototypes don't recompile on every switch.
- One JS meta-map in `index.html` (keyed by slug) is the single source of truth for tabs, the meta header, and iframe sources.
- **`desc` says what a node *is*, in one or two sentences — never what it carries.** It renders untruncated in the desktop info bar and again at the foot of the mobile drawer, so every feature appended to it is stage space taken from the prototype. Feature history has exactly one home: the `changelog` array behind the Changes button. When a fresh export lands, append a `changelog` entry and leave `desc` alone.
- Each prototype's optional `changelog` array (same object, in `index.html`) is its actual changelog — rendered in a "recent changes" drawer, per-slug. `README.md`'s one-line-per-prototype summary is documentation, not the changelog; don't confuse the two.
- Each prototype is deep-linkable at `#<slug>` (e.g. `#next`): activating a tab writes the slug to the URL hash (via `replaceState`, so no history spam), and an incoming hash — on load or back/forward — selects that tab. An unknown or empty hash falls back to the first tab. The slug is therefore the shareable link, so pick slugs accordingly.
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
