# Fidelity and wiring

## Fidelity: reuse, copy, export

- **Mount the shipped interactive component and own only its callbacks.** Mount
  the real reaction flow and own `onMarkRead` / `onClose` — unmounting the flow at
  commit vs letting its reveal play *is* the difference between "merged with the
  reaction" and "after the reaction". Wiring that is worth it; describing it
  isn't.
- **Copying is allowed once, exporting is the fix on the second ask.** Where a
  shipped component keeps a piece internal (the Swell's disc), copying that piece
  is acceptable. A copy must carry a pointer to its source and must never be
  "improved" — a copy tuned to look better is no longer evidence. If a second
  playground needs the same internals, export them from the shipped module
  instead.
- **A copy of the card body is unavoidable when content must sit *inside* the
  card's border.** Wrapping the real `FeedCard` cannot work.
- **3D flips: don't trust `backface-visibility` alone.** Toggle `visibility` per
  face with `transition: visibility 0s linear <half-duration>` so exactly one
  face is ever painted.
- Overlays: put the transform on the app surface wrapper, so `position: fixed`
  sheets pin to the app column and not to the page. (With a bezel this was the
  clip layer; without one the same trick still applies.) See GOTCHA #5.

## Wiring (Babel multi-file, same as `app/`)

- **Entry and modules together in `docs/specs/<ticket>/playground/`**, per `CLAUDE.md`
  § Playgrounds. The entry carries `<base href="../../../" />` and every path is written
  root-relative, exactly as if it sat at the root.
- Import `tokens.css` (+ `swell.css` where relevant) and load the `app/` modules
  the playground actually mounts — load order is dependency order.
- Babel scripts DON'T share scope: put everything shared on `window`, and read
  deps from `window` at the top of each file.
- Name style objects per-component; never `const styles = {}`.
- Copy the app's hover/focus CSS classes the mounted components rely on
  (`.circ-cardaction`, `.circ-cardtitle`, focus rings) — they live in
  `circlists.html`, not in the modules.
- A standalone bundle is compiled output: regenerate it, never edit it. Name it
  kebab-case (`<slug>-playground-standalone.html`) — it gets downloaded and published,
  and spaces in the filename are a nuisance downstream.
- **Asked for it as an asset? Ship pure HTML.** A playground that leaves the
  project — downloaded, opened in a browser, kept on disc, played on a phone —
  carries no in-browser transpiler. Keep authoring in JSX; convert at *export*:
  compile each module to plain JavaScript, inline the compiled sources, and drop
  the Babel script. The transpiler is ~2.7MB fetched before anything renders and
  recompiles every module on each load — most of the bundle's weight and all of
  the pause before the app appears, on the device where the judgement often
  actually happens. The working entry file stays Babel-based, so `app/` is
  untouched and the live rig is unchanged; only the exported artefact is pure
  HTML. Compile it with the page's own Babel (it is already loaded there) rather
  than reaching for a build step this project does not have.
- **A mounted app component sized for app content may need one prop for
  playground content — fix it in `app/`, not in a fork.** Playground chrome is
  routinely taller or wider than the product body the component was built for
  (`MobileDrawer` had no `overflow-y`: the app's rail is short, the config rail is
  not). The fix belongs in the shared component when it is correct for the app too
  (scrolling always is), or as a prop with the app's value as the default
  (`width = 272`). Check any mounted component against overflow in both axes at
  320px before shipping.
