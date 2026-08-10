# Discourse v7 — the ten-direction rig

Ten complete versions of the app, one per direction. Entry HTML at the project
root (`discourse-playground-v7.html`); modules here as `pg-d7-*.jsx`.

The directions and their specs live in the business-ops context space —
`work/apps/circlists/discourse/_resources/ideation/`. `FINAL-TEN.md` is the
reconciled set; `routes-01-05.md` and `routes-06-10.md` carry how each layer is
reached, which is a design axis in its own right, not plumbing.

## Build and verify

Both scripts assume the static server is up (`npm start` from the repo root,
port 4321) and use the pre-installed Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Never run
`playwright install`.

```
node pg-d7-bundle.js          # → discourse-playground-v7-standalone.html
node pg-d7-verify-beats.js    # walks all ten × four beats, prints a table
```

`pg-d7-bundle.js` inlines everything — React, ReactDOM, Babel, tokens, fonts as
base64, every module, every `uploads/` asset — and neutralises the Google
favicon fallback. It prints `EXTERNAL REFS REMAINING`, which **must be 0**: the
bundle is published as a hosted artifact behind a CSP that blocks every
off-host request, and the multi-file version renders blank without a CDN.

## Two traps this rig has already fallen into

**Verify the BEATS, not just the mount.** A verification pass that switches
directions, screenshots them and checks for console errors will pass while the
rig is profoundly broken. It was: a crash on one direction's third beat blanked
the page, and nine directions were unreachable behind it. Only clicking every
beat of every direction catches that. `pg-d7-verify-beats.js` exists for
exactly this and hashes each beat's rendered text, so a beat quietly rendering
the previous one shows up as a repeated hash.

**Verify the ROUTE, not just the beat.** The driver strip is a shortcut, not
the product. A layer is only answered if a member can reach it by using the
app with the driver untouched. Drive each route by hand from a cold start.

## Bundling gotcha — `$&` in a replacement string

`String.replace` expands `$&` in the *replacement* to the matched text.
Minified React contains `$&` sequences, so inlining it with a plain string
replacement silently injects the matched `<script src=...>` tag into the
middle of the vendor code. Always pass a function: `html.replace(tag, () => body)`.
