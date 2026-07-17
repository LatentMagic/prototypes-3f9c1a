# Circlists homepage demo — build

The `homepage-demo` console node is **not** a copied-verbatim prototype like the
others. It is a **built** artifact: the Circlists working line, stripped to its
gated core and bundled to a single self-contained payload made to embed in the
marketing-site homepage as an `<iframe>`.

- **Source (the base):** [`src/`](src/) — a faithful copy of a working-line export.
- **Build:** [`build.mjs`](build.mjs) (esbuild) → writes to `../../app/circlists/homepage-demo/`.
- **Served output:** `app/circlists/homepage-demo/` (committed; GitHub Pages serves it as-is).

## The model

Three things separate the demo from the full app. **None edits a source file** —
each is a transform the build applies on the way out.

1. **One override — the preview gate.** The three controls a signed-out visitor
   must not pass through — **New circle**, **Circle settings**, **account** — open
   a sign-up gate instead of routing on. The gate already lives in the working
   line (`app/gate.jsx`), dormant; the build lights it by setting
   `window.CIRC_FORCE_GATE = true` in the embed HTML. `main.jsx` reads that flag.

2. **Strip-out — by deletion, plus one content-level exception.** Because the
   gate makes those surfaces (and everything reachable only through them)
   unreachable, the files behind them drop with no dangling reference on any
   live path. The one exception: `seed-data.jsx` is always kept (see below), so
   its two data-showcase circles are stripped at the *data* level instead —
   `stripTestFixtures()` in `build.mjs` removes them from the in-memory copy
   before bundling. `src/` itself is never rewritten either way.

3. **Third-party removal — vendored, not fetched.** A Design export has no build
   step, so the working line pulls React from `unpkg.com` and its fonts from
   Google Fonts at runtime. That is fine for a prototype and not fine for the
   demo, because the demo ships inside the **public marketing site**: every
   visitor's browser would hand their IP to two companies before touching
   anything, and the site (which self-hosts its own fonts) would owe a
   third-party disclosure it otherwise doesn't. The build vendors both from
   pinned `devDependencies` and re-points the markup at the local copies.

   **The shipped demo makes no third-party request of any kind.** Keep it that
   way — if a new export introduces another external URL, vendor it here rather
   than letting it reach the site.

## The derivation rule (the delete-list)

`build.mjs` holds the list. It is the rule — keep it in step with what the gate
makes unreachable.

| Dropped file | Why it's safe to drop |
| --- | --- |
| `config.jsx` | Dev aid (config launcher, was `scenarios.jsx`). `main.jsx` guards on `window.ConfigLauncher`. |
| `circ-tweaks.jsx` | Dev aid (tweaks wiring). `main.jsx` guards on `window.CircTweaks`; look defaults are baked in. |
| `tweaks-panel.jsx` | Dev aid (tweaks panel). `main.jsx` guards on `typeof useTweaks`. |
| `auth.jsx` | Sign-in / up / one-time-code / recovery. The demo starts authenticated and never signs out — all auth routes are unreachable. |
| `spaces.jsx` | Create-circle, **members / circle-settings**, and account surfaces. All three are gated → unreachable, so these components are never rendered. |

**Kept:** `seed-data` · `primitives` · `brand-motion` · `swell-reactions` · `feed` · `shell` · `subscriptions` · `gate` · `main`.

`seed-data.jsx`, `brand-motion.jsx`, and `subscriptions.jsx` are always kept —
`main.jsx` and `primitives.jsx` reference their exports (`window.CircSeed`,
`BrandSpinner`, `PulseLockup`, `FundingPage`, `ManageFunding`, `DormantSpace`, ...)
unconditionally, no presence guard. That coupling is exactly why the two
test-data circles below can't be file-deleted along with them.

> ⚠️ If the gate's scope changes (e.g. it stops covering circle settings),
> re-check reachability before trusting this list — a surface that becomes
> reachable again would reference a deleted component and white-screen.

### The seed-data strip

Two circles in `seed-data.jsx`'s `seedSpaces()` are data-showcase fixtures, not
demo content — each id-prefixed `sp-test-` in the working line, e.g. `sp-test-backend`
("TEST - Backend Pod", every reaction-shape edge case) and `sp-test-weekend`
("TEST - Weekend Reads", the dormant/terminal take-over view). `stripTestFixtures()`
in `build.mjs` removes any `seedSpaces()` object whose `id` carries that prefix
before the bundle is built — matching on `sp-test-` rather than the display name,
since the id is the structural marker a future export is more likely to keep
stable than prose. The three real circles (Backend Pod, Tuesday Book Club, Me &
Sam) ship untouched.

Consequence worth knowing: with the dormant fixture stripped, `DormantSpace`
(in `subscriptions.jsx`) has no seed data left to render it — the component ships
in `app.js` but is currently unreachable in the demo. It stays anyway, per the
unconditional-reference rule above.

> ⚠️ If a future export adds a real (non-test) dormant or edge-case circle, or
> drops the `sp-test-` id convention, re-check `stripTestFixtures()` against the
> new `seed-data.jsx` before building — a silent mismatch ships test data to the
> public site instead of stripping it.

## What the build does that the raw prototype does not

- Concatenates the **kept** modules in the entry's own load order and runs **one**
  JSX→JS transform + minify → a single `app.js`. This drops **babel-standalone**
  and the **per-module XHR fetch** the prototype does at runtime — the real
  performance win for an embedded iframe.
- Moves React / ReactDOM to their **production** builds (and drops the now-stale
  SRI hashes), then **vendors** them from `node_modules` beside `app.js` and strips
  the `unpkg.com` origin from the script tags. The installed version is asserted
  against the version the working line's entry names — a mismatch fails the build
  rather than silently running React the prototype was never tested on.
- **Vendors the fonts.** `tokens.css` is derived rather than copied: its Google
  Fonts `@import` is re-pointed at a generated `fonts.css`, whose `@font-face`
  rules are extracted from the `@fontsource` packages (latin only — all 42 subsets
  would be 1.9MB to serve ~144KB). `@fontsource-variable` names Inter
  `Inter Variable`, so the build aliases each family back to the name the tokens
  actually ask for; a face the tokens never request fails the build, because that
  mismatch is otherwise **silent** — the font simply never loads, the demo renders
  in the fallback, and no request happens to notice.
- Lights the gate via the `window.CIRC_FORCE_GATE` flag in the embed.
- Downlevels top-level `const`/`let` to `var` before compiling. Kept files are
  concatenated into one scope, but some declare the same name twice by design —
  e.g. `seed-data.jsx`'s `const M` and `main.jsx`'s `const { M } = window.CircSeed`,
  a deliberate load-order safety pattern, harmless as separate `<script>` tags
  where Babel Standalone hoists each to a real global. `var` redeclaration is
  legal where `const` redeclaration is a syntax error; esbuild won't do this
  lowering itself (any target), so `build.mjs` does it as a line-start-only text
  pass before the transform.

The output is fully self-contained — it loads nothing from anyone else's server.

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
see responses) across all three real circles, and each gated control (New circle
· Circle settings · account → gate). Confirm no `TEST -` circle appears anywhere.
Watch for a clean console.

**Check the network tab is empty of third parties** — no `unpkg`, no
`fonts.googleapis`, nothing but same-origin. Text rendering in the wrong typeface
is the tell that a font failed to match; the build guards that, but look anyway.

If the new export bumps React, the build stops and names the version to pin. That
is deliberate: fix the pin, don't work around it.

## The console node

Registered in the repo-root `index.html` as a reference node (like Branding):
`kind: 'demo'`, violet accent, deep-linked at `#homepage-demo`, skipped by default
landing. Bundling this demo into the real homepage (in `public-sites`) is a
separate, later step.
