# Playgrounds

Conventions distilled from the first real one — `Card metadata playground.html`
(+ `playground/pg-*.jsx`), which explored feed-card metadata enrichment. Reuse
this shape; extend it as later playgrounds teach us more.

## Shape that worked
- **Repurpose the real chrome, don't invent a panel.** The playground rendered
  the actual Circlists shell: the left **rail** (normally the circle list) became
  the option selector; the **heading** (normally the space name) became the
  config controls. It reads as the product, which is the whole point.
- **Rail = the directions being explored.** Each entry is a numbered option with
  a one-line descriptor. Active state reuses the app's rail treatment (surface
  bg + accent left bar + `--shadow-raised`).
- **Heading = config.** Small labelled segmented controls (`.pg-seg`), wrapped in
  a flex row with a hairline separator between "display" levers and
  "data/state" levers.
- **Feed renders every seed card in the selected treatment** — so all states and
  fallbacks are visible at once, not one at a time.

## Config pattern: Auto + override
Each option carries its **intended** answer to every lever (`def: {...}`). The
heading toggles default to **Auto** (= use the option's own choice) and add
explicit overrides (On/Off, Show/Hide, etc). This keeps the options genuinely
distinct while still letting you A/B any single lever across all of them.
`mergeCfg(option, overrides)` is the one place they combine.

## Traceability
- **One derivation function** (`PG.resolve(seed, cfg)`) is the sole place display
  fields are computed, and it returns a `trace` object recording which path each
  field took (extracted vs domain-fallback vs default).
- A **Trace toggle** renders a small strip *outside* each card (never overlaid,
  so it doesn't corrupt the design read) flagging fallback paths in amber.
- A **forced-outcome switch** (As seeded / No images / Total fail) walks the
  whole feed down the fallback cascade in one click — the fastest way to see a
  system degrade gracefully.

## Wiring (Babel multi-file, same as `app/`)
- Import `tokens.css` for the theme and `app/primitives.jsx` for `Icon` / `Avatar`
  / `displayName` — reuse gives fidelity for free.
- Babel scripts DON'T share scope: put everything shared on `window`, and read
  deps from `window` at the top of each file (`const { Icon, Avatar } = window;`).
  Load order in the HTML is the dependency order.
- Name style objects per-component; never `const styles = {}`.

## Second playground: `docs/specs/biz-84-app-ia/App IA playground.html` (+ its `pg-ia-*.jsx`)
Explored app-posture navigation IA and overlay presentation. What it added to the shape:
- **Rail entries carry a claim AND a trade-off.** Each direction states what it
  argues for and what it costs, expanded on the selected one. Steering needs the
  cost visible, not just the option.
- **Split the levers by kind in the heading:** IA levers (where a thing lives)
  left of the hairline, presentation levers (how it appears) right. One row,
  horizontally scrollable — never wrap into a tall header that eats the phone.
- **Body vs container split is the real trick for "is a sheet right?"** One
  content body per destination, five containers (sheet / titled sheet / inset
  card / full page / anchored menu). Swapping only the container makes the
  question answerable instead of arguable.
- **Add a compare column for whatever the user finds ugly.** Here: every
  option's bottom bar stacked at real width, slot count labelled, click to
  select. Judging evenness from memory across selections doesn't work.
- **Re-key the phone on config change** (`key={optId + JSON.stringify(ov)}`) so
  chrome swaps land cleanly and overlays don't survive an IA change.
- Copy the prototype's phone frame geometry AND its clip/transform layering, or
  fixed overlays bleed onto the bezel (see GOTCHA).

## Housekeeping
- Persist selection + overrides to a namespaced `localStorage` key
  (`pg_cardmeta_v1`) so reloads keep your place.
- **Verification clicks share the user's `localStorage`.** After probing states,
  reset your key back to clean defaults so the user lands fresh.
- Seed the feed to cover every state AND every fallback (here: publication+image,
  bare-domain source, no-image, total-extraction-failure).
