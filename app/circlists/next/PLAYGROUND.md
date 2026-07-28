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

## Third playground: `docs/specs/discourse/Discourse playground.html` (+ its `pg-disc-*.jsx`)

> **PENDING: review this playground and fold the lessons back in.** This section was written
> as the playground was built, not after living with it. The user has asked for a deliberate
> pass over `docs/specs/discourse/Discourse playground.html` — as the reference example, issues
> included — to work out what actually belongs in these conventions. **Do not treat the notes
> below as settled.** Read
> `docs/specs/discourse/handoff-2026-07-27_discourse-playground.md` first: its Learnings and
> Action Items list the open questions this review has to answer, chiefly:
> - Is the three-pane rail (Directions / Config / The loop) right, or should options and config
>   be visible at once — which means shrinking or scaling the phone?
> - Should we set a **minimum viewport** every playground must work at? Three columns needed
>   ~1100px and broke on a ~1050px window; that failure is the sharpest lesson of the session.
> - Does "drive the loop from a side panel" generalise beyond this question?
> - Is copying a shipped component's internal geometry acceptable, or should shipped modules
>   export internals for playground reuse?
>
> Rewrite this section once that pass is done, and delete this block.

Explored what shape discourse takes around a shared link. What it added to the shape:
- **Reuse the real interactive component, not a mock of it.** The mark-as-read beat mounts the
  shipped `SwellReactionFlow`; the playground only owns what happens at `onMarkRead` / `onClose`.
  Unmount the flow at commit when an option replaces the reveal, let it play when the option is
  sequential — that one fork is the whole difference between "merged with the reaction" and "after
  the reaction", and it is worth wiring rather than describing.
- **A side column that WALKS the loop.** Four beats (attach / receive / respond / lives), each with
  a button that drives the phone to that beat. When the question is "is this loop complete?", a
  static feed cannot answer it — the beats have to be reachable in one click each.
- **Publish every option's lever answers as a readout**, not just the overridable ones. Levers you
  choose not to put in the heading still differ per option; a small table beside the phone keeps
  them visible instead of buried in the data file.
- **One composer, four response shapes** (note / stem / one word / echo) driven by config, so a
  response shape can be A/B'd across options that never intended it.
- Copy the app's card body when you need to slot content INTO it — wrapping the real `FeedCard`
  can't work, because discourse belongs inside the card's border.
- 3D flips: don't trust `backface-visibility` alone. Toggle `visibility` on each face with a
  `transition: visibility 0s linear <half-duration>` so exactly one face is ever painted.
- **Layout is not a detail — it is the first thing that breaks.** Three columns (options + phone +
  config) need ~1100px and fell apart on a ~1050px window; the config went below the fold and the
  whole playground read as broken. It ended as one sticky left rail with three panes. Treat that as
  a workaround under review, not a convention (see the PENDING block above).

## Housekeeping
- Persist selection + overrides to a namespaced `localStorage` key
  (`pg_cardmeta_v1`) so reloads keep your place.
- **Verification clicks share the user's `localStorage`.** After probing states,
  reset your key back to clean defaults so the user lands fresh.
- Seed the feed to cover every state AND every fallback (here: publication+image,
  bare-domain source, no-image, total-extraction-failure).
