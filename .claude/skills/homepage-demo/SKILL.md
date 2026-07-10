---
name: homepage-demo
description: 'Produce the homepage-demo by running one Circlists working-line prototype through the strip-and-bundle build.'
metadata:
  version: '0.1.0'
  author: LatentMagic
---

# homepage-demo

## Why this exists

The Circlists homepage is a public page. Instead of a carousel of screenshots, it houses a **live prototype of the app** in an `<iframe>` a visitor can click around — so they feel the product before they sign up. Account-only actions (New circle, circle settings, the account control) hit a **preview gate** instead of routing on; the reading loop stays live.

That embedded build is the **homepage-demo**. You do not author it. You produce it by running one working-line prototype through a build.

## The pipeline

One prototype export → the build → the packaged demo. Three parts:

- **Source** — a working-line prototype export, dropped into `tools/homepage-demo/src/`.
- **Build** — `tools/homepage-demo/build.mjs`: a script that runs **esbuild**. It deletes the files you list, bundles the rest into one `app.js`, and drops babel plus the per-module fetch the raw prototype does at runtime — so the result is iframe-ready. Detail and the current delete-list: [README.md](../../../tools/homepage-demo/README.md).
- **Output** — the packaged demo at `app/circlists/homepage-demo/`, shown as a console node. It **declares its own embed contract**: the flags and layout modes a consumer sets on it, so embedding never means reverse-engineering minified source.

You run the build. You do not write app code.

## Requirement: a delete-friendly source

The build strips by deleting files, so the working line must tolerate it:

- Dev aids (scenario launcher, tweaks) sit in their own files, mounted only when present, so deleting one needs no edit to `main.jsx`.
- The preview gate lives in the working line, dormant, lit by a build flag (`window.CIRC_FORCE_GATE`), never by editing code.
- Defaults are baked in, so the app still renders once the deletable files are gone.

If the source is not delete-friendly, stop: that is a source-prototype (Claude Design) re-architecture, not this skill's job. Flag it.

## Steps

First read what you are working from: the export's entry HTML (module load order) and `main.jsx` (gate wiring + seed), plus the [README.md](../../../tools/homepage-demo/README.md). Then:

1. **Point the build at the source.** Replace `tools/homepage-demo/src/` with the export's runtime files — entry HTML, styles, `app/`, and any folder loaded at runtime.
2. **Set the strip list.** In `build.mjs`, set `DELETE_LIST` to the files to drop: the surfaces reachable *only* through a gated control (create-circle, members/settings, account) plus the dev aids (scenarios, tweaks). Leave anything reachable *without* a gate, such as the dormant-circle surface. The rule: never drop a file a live path still renders, or one a kept file still depends on. Unsure? Step 5 catches a wrong list.
3. **Run the build.** `npm run build` in `tools/homepage-demo/`. esbuild strips the listed files, bundles the rest into `app.js`, and writes the packaged demo to `app/circlists/homepage-demo/`.
4. **Wire the console node.** First build only: add the node to the repo-root `index.html` — `kind: 'demo'`, its own accent, deep-linked `#homepage-demo`, skipped by default landing. On a refresh it is already there; confirm it.
5. **Verify.** Serve the repo (`npm start` → :4321), open **Homepage Demo**, and walk it: the reading loop runs; every gated control opens the gate, not a crash; edge states such as the dormant circle render; the console stays clean. A wrong strip list white-screens silently, so this walk is the proof.
6. **Ship.** Commit and push; GitHub Pages redeploys in ~25s; confirm it is live. If the same export also advanced the working line, refresh the `next` node too.

## CRITICAL: run the build, don't rebuild the app

- DO NOT author or edit app code. You strip files and run the build — nothing else. A change that needs a source edit is a source-prototype job, not this skill's.
- DO NOT ship without walking the built demo (step 5): every gated control must open the gate, and the core loop must run. A wrong strip list fails silently.
- ONLY point this at a delete-friendly source. If it is not, stop and flag the re-architecture.
