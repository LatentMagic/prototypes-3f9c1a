# Playgrounds

A playground is a rig that makes one design question **answerable** instead of
arguable. It is not a mock and not a slide: it is the real app, wired so the
options can be swapped and the states reached in one click each.

Three shapes are worth reaching for. Read "Pick the rig" first, then the rules;
the rules apply to all three shapes.

## The intent (softer than the rules below)

A playground exists so the reviewer can form an opinion they could not form from a
list. So the division of labour is: **you ideate and commit; they react
afterwards, with the thing in their hands.** Own the set of options, carry the
ideation through to a built rig in one pass, and take the judgement calls
yourself. Asking which candidates to keep, or for a steer on one-line pitches, is
asking for an opinion that has nothing tactile to stand on yet — it usually costs
a round and buys nothing. Not an invariant: ask when something genuinely blocks
you, or when the user has said they want to steer early.

## Non-negotiables

These are what separates a playground you can decide from you can't.

**Playgrounds are played, not configured.** The reviewer opens the rig, sees a
short flat list of named versions of the app, taps one, and uses it. Each version
IS the app, working and seeded, carrying one distinct idea — discovered by
playing, never by reading. If a version needs explaining, or reaching the variety
requires configuring, the rig has failed. Theory, levers, and shape statements
stay in the docs, not in the reviewer's path.

0. **Don't reinvent UX — the code already exists, mount it.** This is not "match
   the app's behaviour": it is *import the app's component and render it*. Before
   writing a single line of chrome, grep `app/` for the thing you are about to
   build. If it is there, load that module and mount it; if it is there but not
   exported or not parameterised for a non-product body, add the export or the
   prop (`MobileDrawer`'s `children`/`width` is the precedent) rather than writing
   a second copy. Re-implemented geometry, easing, breakpoints or icons are a
   defect even when they look identical, because they drift.
   Everything a playground needs, the app has already solved once: opening and closing a rail, presenting a sheet, switching
   viewport, framing a forced posture, a segmented control, a scrim, a drawer's
   easing. Use the app's control, in the app's place, with the app's motion — and
   if the app has no control for it, use the app's Config aid pattern rather than
   inventing a widget. A playground-only button sitting next to a shipped control
   that already does the job is always a mistake, and it costs fidelity in the one
   artefact whose whole value is fidelity. This rule outranks every convention
   below: when a convention here conflicts with what the app already does, the app
   wins.

1. **It must be the real app, engaged with the normal way.** The playground owns
   the *chrome that steers the exploration* and nothing else. Inside that, the
   app is the app: real shell, real cards, real overlays, full width, scrolled
   and tapped exactly as a member would.
2. **Never a phone bezel, never forced-mobile.** A drawn phone is a picture of
   the app, and it forces one posture on every viewport. Let posture follow the
   window, the same rule `main.jsx` uses (`< 1024` = the app posture) — then a
   wide window gives you the web read and a phone gives you the app, with no
   control to remember to flip.
3. **It has to work on a phone, because it will be opened on one.** Playgrounds
   get written as an **asset**, downloaded, and played with on the real device —
   that is often where the judgement actually happens. Design for 390×844 as
   seriously as for the desktop read, `100dvh` not `100vh`, safe-area insets
   intact, thumb-reachable controls.
4. **Playground chrome must be dismissable wherever the app would dismiss it —
   and permanent wherever the app's equivalent is permanent.** "Collapsible" is
   not a virtue in itself: the chrome behaves *exactly* as the part of the app it
   stands in for, at the app's own breakpoint, using that posture's own control —
   never a new button, never a mechanism the posture doesn't have, and never
   collapsible at a width where the app's rail is simply always there.
   A config rail replacing the circle rail therefore:
   - **≥ 1024 (desktop web): permanently docked. No toggle at all** — the app's
     rail is a sticky `<aside>` and `TopBar` renders no circles-menu button, so
     neither does the playground.
   - **< 1024 (mobile web): behind the top bar's circles-menu button**, opening
     the app's own `MobileDrawer` — mount that component (`app/shell.jsx`, which
     takes `children`), don't re-implement its geometry, scrim or easing.
   - **app posture: the Home destination**, reached from the bottom bar's Home
     slot with the app's own push, because in the app Home *is* the circles list
     (`MOBILE.md`). Picking a direction enters it, the way picking a circle does.
   Read the breakpoint from `main.jsx` (`winW < 1024`) — do not invent one, and
   never pick a value that disables one of the branches. Both
   failure modes have shipped: chrome that could not be dismissed at all, and
   chrome left collapsible at every width (a fake 3000px breakpoint) when the app
   docks it permanently on desktop. A bottom strip or compare column, which
   stands in for nothing in the app, does need a way out of the way on every
   viewport.
5. **Minimum viewport: 1024×720 for the desktop read.** Budget the width against
   the app first, and remember the window is not maximised. Three columns needed
   ~1100px, the user's window was ~1050px, the config fell below the fold, and
   the whole playground read as broken. Test narrow before showing it.
6. **The real component, never a make-believe one.** If the question touches a
   card, mount the shipped card. A hand-drawn stand-in answers a question about
   the stand-in.
7. **Give it a Viewport control (Auto / Mobile).** Any playground with real depth
   should let you force the app posture on a desktop screen instead of resizing
   the window — exactly what the app's Config aid does, so copy that: Auto
   follows the window (`main.jsx`'s `< 1024`), Mobile forces the app posture and
   frames it in the app's own phone frame (`.circ-stage` / `.circ-phone` /
   `.circ-phone-clip`, verbatim from `circlists.html`). Note the asymmetry that
   makes this safe: framing is what the product does for a *deliberately forced*
   posture, and Auto never frames anything — a bezel you chose is a preview, a
   bezel by default is a picture of the app.

## Pick the rig for the question

**A whiteboard**, when the question is one comparison and the app is not needed
to see it. Directions rendered as static pairs — idle beside changed — plus an
industry-reference row marked "for context, not options". No React, no shell, no
config. This is often all that is necessary — reach for it first and only
escalate when the answer depends on being *in* the app.

**The app with config at the bottom**, when you need the whole product — rail,
circles, real feed — and there are only a few levers. Put them in a dark tooling
strip pinned to the bottom of the page: unmistakably not product, always to hand,
costs no width. Best default for a small number of levers. The strip must still
collapse; see non-negotiable 4.

**The app with a config rail**, when there are many options and each needs
arguing — eight-odd directions, each carrying a claim and a trade-off, plus their
levers and a loop driver. The playground rail simply *replaces* the circle rail —
losing the circles selection is a fair price, and the layout stays exactly the
app's. One rail body, rendered in two places and never forked: permanently docked
beside the app at desktop width, in the app's `MobileDrawer` behind the
circles-menu button below 1024, and the app posture's Home destination on a phone
(see non-negotiable 4). Never invent a toggle for it.

## Config pattern: Auto + override

Each option carries its **intended** answer to every lever (`def: {...}`). The
controls default to **Auto** (= use the option's own choice) and add explicit
overrides (On/Off, Show/Hide). Options stay genuinely distinct, and any single
lever can still be A/B'd across all of them. `mergeCfg(option, overrides)` is
the one place they combine, and a small "overridden" flag tells you the app is
no longer showing the selected option's own answer.

- **Publish every option's lever answers as a readout**, not just the
  overridable ones. Levers you chose not to expose still differ per option;
  a small table keeps them visible instead of buried in the data file.
- **State the trade-off next to the claim.** An option without its cost cannot
  be steered — only admired.
- **Re-key the app on config change** (`key={optId + JSON.stringify(ov)}`) so
  chrome swaps land cleanly and overlays don't survive an option change.

## Traceability

- **One derivation function** (`resolve(seed, cfg)`) is the sole place display
  fields are computed, returning a `trace` recording which path each field took
  (extracted vs fallback vs default).
- A **Trace toggle** renders a strip *outside* each card — never overlaid, so it
  can't corrupt the design read — flagging fallbacks in amber.
- A **forced-outcome switch** (As seeded / No images / Total fail) walks the
  whole feed down the cascade in one click: the fastest way to watch a system
  degrade.
- **Seed for coverage**: every state AND every fallback.

## When the question is a sequence

Some questions ("is this loop complete?") cannot be answered by a static render
— the beats have to be reachable. Give the playground a **driver**: one entry per
beat (attach → receive → respond → lives), each a button that puts the app in
that state. Placement is free (a rail pane, the bottom strip); on a narrow
viewport, dismiss the chrome as the driver fires so the app is actually visible.
Skip the driver entirely when the question is about how one surface looks.

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

- **Entry HTML at the project root** (`<slug>-playground.html`) so its
  `app/*` and `tokens.css` paths resolve; **modules in the spec folder**
  (`docs/specs/<ticket>/pg-<slug>-*.jsx`).
- Import `tokens.css` (+ `swell.css` where relevant) and load the `app/` modules
  the playground actually mounts — load order is dependency order.
- Babel scripts DON'T share scope: put everything shared on `window`, and read
  deps from `window` at the top of each file.
- Name style objects per-component; never `const styles = {}`.
- Copy the app's hover/focus CSS classes the mounted components rely on
  (`.circ-cardaction`, `.circ-cardtitle`, focus rings) — they live in
  `circlists.html`, not in the modules.
- A standalone bundle is compiled output: regenerate it, never edit it. Name it
  kebab-case (`<slug>-playground-standalone.html`) — it gets downloaded and
  published, and spaces in the filename are a nuisance downstream.
- **A mounted app component sized for app content may need one prop for
  playground content \u2014 fix it in `app/`, not in a fork.** Playground chrome is
  routinely taller or wider than the product body the component was built for
  (`MobileDrawer` had no `overflow-y`: the app's rail is short, the config rail is
  not). The fix belongs in the shared component when it is correct for the app too
  (scrolling always is), or as a prop with the app's value as the default
  (`width = 272`). Check any mounted component against overflow in both axes at
  320px before shipping.

## Housekeeping

- Persist selection + overrides to a namespaced `localStorage` key
  (`pg_<slug>_v1`) so reloads keep your place.
- **Verification clicks share the user's `localStorage`.** After probing states,
  reset your key to clean defaults so the user lands fresh. This has been missed
  once already: a stray click left an override on, and the playground read as
  "overridden" on the user's first look.
- A playground is not a product-shape change: no `CHANGELOG.md` entry, and don't
  touch `app/` to serve it.
