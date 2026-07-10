# Circlists homepage demo — build

The `homepage-demo` console node is **not** a copied-verbatim prototype like the
others. It is a **built** artifact: the Circlists working line, stripped to its
gated core and bundled to a single self-contained payload made to embed in the
marketing-site homepage as an `<iframe>`.

- **Source (the base):** [`src/`](src/) — a faithful copy of a working-line export.
- **Build:** [`build.mjs`](build.mjs) (esbuild) → writes to `../../app/circlists/homepage-demo/`.
- **Served output:** `app/circlists/homepage-demo/` (committed; GitHub Pages serves it as-is).

## The model

Two things separate the demo from the full app, and **neither edits a source file**:

1. **One override — the preview gate.** The three controls a signed-out visitor
   must not pass through — **New circle**, **Circle settings**, **account** — open
   a sign-up gate instead of routing on. The gate already lives in the working
   line (`app/gate.jsx`), dormant; the build lights it by setting
   `window.CIRC_FORCE_GATE = true` in the embed HTML. `main.jsx` reads that flag.

2. **Strip-out — by deletion only.** Because the gate makes those surfaces (and
   everything reachable only through them) unreachable, the files behind them
   drop with no dangling reference on any live path. The demo is *derived by
   deleting files*, never by rewriting them.

## The derivation rule (the delete-list)

`build.mjs` holds the list. It is the rule — keep it in step with what the gate
makes unreachable.

| Dropped file | Why it's safe to drop |
| --- | --- |
| `scenarios.jsx` | Dev aid (scenario launcher). `main.jsx` guards on `window.ScenariosLauncher`. |
| `circ-tweaks.jsx` | Dev aid (tweaks wiring). `main.jsx` guards on `window.CircTweaks`; look defaults are baked in. |
| `tweaks-panel.jsx` | Dev aid (tweaks panel). `main.jsx` guards on `typeof useTweaks`. |
| `auth.jsx` | Sign-in / up / one-time-code / recovery. The demo starts authenticated and never signs out — all auth routes are unreachable. |
| `spaces.jsx` | Create-circle, **members / circle-settings**, and account surfaces. All three are gated → unreachable, so these components are never rendered. |

**Kept:** `primitives` · `swell-reactions` · `feed` · `shell` · `subscriptions` · `gate` · `main`.

`subscriptions.jsx` stays because the seed carries a **dormant circle** (Weekend
Reads); switching to it renders `DormantSpace`, which lives in that file. It is
reachable without passing a gate, so it cannot be dropped.

> ⚠️ If the gate's scope changes (e.g. it stops covering circle settings),
> re-check reachability before trusting this list — a surface that becomes
> reachable again would reference a deleted component and white-screen.

## What the build does that the raw prototype does not

- Concatenates the **kept** modules in the entry's own load order and runs **one**
  JSX→JS transform + minify → a single `app.js`. This drops **babel-standalone**
  and the **per-module XHR fetch** the prototype does at runtime — the real
  performance win for an embedded iframe.
- Moves React / ReactDOM to their **production** CDN builds (and drops the now-stale
  SRI hashes).
- Lights the gate via the `window.CIRC_FORCE_GATE` flag in the embed.

React / ReactDOM stay on the CDN; everything else is self-contained.

## Re-deriving after a new working-line export

```sh
# 1. replace the base wholesale with the new export's runtime files
#    (circlists.html, tokens.css, swell.css, app/*.jsx, brand/assets/*)
# 2. rebuild
npm install      # first time only
npm run build
# 3. sanity-check locally, then commit the regenerated app/circlists/homepage-demo/
```

Verify locally by serving the repo (`npm start` at the repo root → :4321), opening
the **Homepage Demo** node, and walking: the reading loop (add → read → react →
see responses), each gated control (New circle · Circle settings · account →
gate), and a switch to the dormant circle. Watch for a clean console.

## The console node

Registered in the repo-root `index.html` as a reference node (like Branding):
`kind: 'demo'`, violet accent, deep-linked at `#homepage-demo`, skipped by default
landing. Bundling this demo into the real homepage (in `public-sites`) is a
separate, later step.
