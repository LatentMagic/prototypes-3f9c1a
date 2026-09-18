# prototypes

LatentMagic Claude Design prototypes plus a console (`index.html`) that browses them. Static site — no build, no tests, no linter — served by `server.js`, deployed via GitHub Pages on push to `main`.

Written from two routes, both live: a Claude Design export for the live line replaces `app/circlists/canon/` wholesale (verbatim, gains a `changelog` entry); Claude Code sessions also edit prototype code here directly. Neither is the only route.

## The working line — `canon`

One state, not a shipped/coming split: **`canon`** is the single agreed-upon prototype. Changes accrete into it alone — don't mint ticket-named slugs, don't split a "shipped" mirror. Alternatives are explored as playgrounds and candidates beside it, not as separate console tabs. `next`/`main`/`baseline`/`lm-*` slugs are retired — removed, not archived; don't revive them.

Commit messages stay feature-flavoured (`feat(circlists): <feature>`) when natural — a hint for a later agent, not a ledger to maintain.

**Commit gate** — updates here can't be verified by the user. Commit once you've verified and are happy. A push to `main` deploys, so the push gate (`.claude/hooks/pre-push.sh`, a Claude Code hook) holds every push until the user confirms; a branch push deploys nothing. Driven from another checkout, this repo can arrive in detached HEAD with local `main` behind `origin/main`, and `git checkout main` then silently drops the last session's work from disk — before believing the tree, `git checkout main && git merge --ff-only origin/main` and assert `HEAD` equals `origin/main`.

<important if="you are creating, editing, or otherwise touching any file under app/circlists/canon/">
**`app/circlists/canon/CLAUDE.md`** is the Claude Design project's own file, and every export replaces it wholesale. Editing under `canon/` loads it automatically. Take from it: brand law, the states register, module load order, candidate/playground mechanics. Ignore its chat-reply, ratification, and `$skill` rules — those are written for the Claude Design agent, not for you. Never edit it from here.
</important>

## How the console works

- One JS meta-map in `index.html` (keyed by slug) is the single source of truth for tabs, the meta header, and iframe sources.
- **`desc` says what a node *is* — never what it carries; anything appended there is stage space taken from the prototype.** Feature history goes in the `changelog` array only — leave `desc` alone when a fresh export lands.
- Each prototype's `changelog` array renders in a per-slug "recent changes" drawer. `README.md`'s one-liner is documentation, not the changelog — don't confuse the two.
- Deep-linkable at `#<app>/<slug>` (e.g. `#circlists/canon`; a bare `#<slug>` still resolves as a legacy form); an unknown or empty hash falls back to the first tab.
- Anything after `?` in the hash is handed to the iframe `src` untouched — that is how canon's `?state=<id>` addressing works, and canon's `ARCHITECTURE.md` depends on it. Keep `parseHash`/`srcFor` forwarding the query.
- Responsive shell (rail collapses to an off-canvas drawer at ≤640px) lives in `index.html` only, never in a prototype's own layout handling.

## Why a server (not `file://`)

Prototype entry HTML loads `app/*.jsx` via babel-standalone, which XHR-fetches each module — that fails on CORS over `file://`. `server.js` serves everything on one origin so the fetch succeeds.

<important if="you are registering a reference node (a non-version asset like the brand pack), or refreshing app/circlists/brand/">
**Reference nodes** — `kind: 'brand'` sits off the version spine with its own amber accent; the default landing skips it. The Circlists brand pack (`app/circlists/brand/`) is the first — source of truth is the wiki (`../harness-intent-wiki/wiki/products/circlists/brand`); refresh by re-copying the wiki's brand files over it (shell copy, never hand-edited). The console's favicon set (`favicon.ico`, `circlists-mark.svg`, `apple-touch-icon.png`) and the rail-title lockup (`app/circlists/brand/circlists-lockup-reversed.svg`) are also brand assets, root-placed so a re-export can't touch them — refresh both from the wiki brand pack's `assets/` the same way.
</important>

<important if="you are registering or retiring a candidate node (an unratified proposal for the working line)">
**Candidate nodes** — `kind: 'candidate'` proposes a position on the working line: periwinkle accent, hollow dot, stays on the spine (unlike a reference node, which lifts off it). Register with `kind: 'candidate'`, a `version` naming the proposal, and the `ticket` it answers; `kind` keeps it off the default landing. Temporary by design: once ratified, the design folds into `canon` and the candidate's slug and entry are deleted outright. A candidate that's outlived its ticket is stale, not history — delete it.
</important>

<important if="you are adding a new prototype export, or updating the canon working line with a fresh export">
**Add a prototype**
1. Copy the whole export dir into `app/<slug>/` verbatim — entry HTML, `tokens.css`, `favicon.svg`, `app/`, any folder the app loads at runtime (e.g. `brand/`), and every project doc the export ships (`CLAUDE.md`, `ABOUT.md`, `BRANDING.md`, `CHANGELOG.md`, `DEMO.md`, `INTENT.md`, `docs/`). Drop only authoring-session cruft (`.playwright-mcp/`, `.thumbnail`, `screenshots/`, `skills/`, `scraps/`, any unfetched `uploads/*`). Never strip a folder the browser fetches.
2. Add one entry — `{ slug, version, ticket, desc }` — to `APPS.<app>.prototypes` in `index.html`. Order is version order = tab order.

A single-file export (`<Name>.dc.html` + `support.js`, as `app/commentape/prototype/`) ships none of the multi-file set above; copy the two files and register the `.dc.html` as `html`.

**Updating canon** — a fresh export for the live line replaces `app/circlists/canon/` in place (same verbatim rule, including `brand/`). Don't add a new slug; append a `changelog` entry to the single `canon` entry and leave `desc` untouched.

**Before committing** — run `npm run check`: serves the repo, caches the three unpkg runtime files once, drives Chromium through every registered state at 1280 and 390 with the CDN served from cache, screenshots to `.playwright-mcp/check/`, and fails on a module that didn't load or a state that lands on the index. Works offline and in a CDN-blocked sandbox. It covers `app/circlists/<slug>/circlists.html` entries only, not the console shell and not a `.dc.html` export.
</important>

<important if="a push hasn't deployed, or the site shows a stale version after a push">
**Deploy** — GitHub Pages, https://latentmagic.github.io/prototypes-3f9c1a/. Push to `main` triggers `pages-build-deployment`, live in ~25s.
- Status — `gh api repos/LatentMagic/prototypes-3f9c1a/pages/builds/latest` (or `gh run list`). From a cloud sandbox that API path is blocked by the agent proxy; check the deployed file instead: `curl -sfL https://latentmagic.github.io/prototypes-3f9c1a/app/circlists/canon/app/<module>.jsx | grep <new symbol>`.
- Stuck — usually a GitHub Actions incident ([githubstatus.com](https://www.githubstatus.com)), not the repo. Wait it out; nothing to fix.
- Old version after it deployed — browser cache. Hard-refresh (Cmd-Shift-R).
</important>

<important if="a prototype iframe renders blank, or you are working offline / in a CDN-blocked sandbox">
**Runtime dependency** — React, ReactDOM, and Babel load from unpkg; fonts from Google Fonts. Offline, in a plain browser, prototypes render blank — they need the CDN. In an agent-proxy sandbox the split is specific: `curl` reaches unpkg and the published site, Chromium does not (`ERR_CONNECTION_RESET`), so a browser can never verify the live URL there even when the deploy is real. `npm run check` is the exception for the prototype itself: it caches the runtime with `curl` once and drives Chromium against that cache. The console shell uses no CDN and renders fully offline — a blank iframe there is not a console bug.
</important>
