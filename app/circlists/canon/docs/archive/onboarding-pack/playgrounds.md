# Playgrounds

A playground is a rig that makes one design question **answerable** instead of
arguable. It is not a mock and not a slide: it is the real app, wired so the
options can be swapped and the states reached in one click each.

Read "Pick the rig" first; the rules below apply to all three shapes.

## Non-negotiables

0. **Don't reinvent UX — the code already exists, mount it.** Not "match the
   app's behaviour": *import the app's component and render it.* Before writing a
   line of chrome, grep the app for the thing you are about to build. If it is
   there but not exported, or not parameterised for a non-product body, add the
   export or the prop rather than writing a second copy. Re-implemented geometry,
   easing, breakpoints or icons are a defect even when they look identical,
   because they drift. Opening a rail, presenting a sheet, switching viewport, a
   segmented control, a scrim, a drawer's easing — the app has solved each of
   these once. A playground-only button sitting next to a shipped control that
   already does the job is always a mistake, and it costs fidelity in the one
   artefact whose whole value is fidelity. **This rule outranks every convention
   below: where they conflict, the app wins.**

1. **It must be the real app, engaged with the normal way.** The playground owns
   the *chrome that steers the exploration* and nothing else. Inside that: real
   shell, real cards, real overlays, full width, scrolled and tapped as a user
   would.

2. **Never a phone bezel by default, never forced-mobile.** A drawn phone is a
   picture of the app and forces one posture on every viewport. Let posture follow
   the window, using the app's own breakpoint — a wide window gives the desktop
   read, a phone gives the small posture, with no control to remember to flip.

3. **It has to work on a phone, because it will be opened on one.** Playgrounds
   get downloaded and played with on the real device — often that is where the
   judgement happens. Design for 390×844 as seriously as for desktop: `100dvh`
   not `100vh`, safe-area insets intact, thumb-reachable controls.

4. **Playground chrome must be dismissable wherever the app would dismiss it —
   and permanent wherever the app's equivalent is permanent.** "Collapsible" is
   not a virtue. The chrome behaves *exactly* as the part of the app it stands in
   for, at the app's own breakpoint, using that posture's own control — never a new
   button, never a mechanism the posture doesn't have. A config rail replacing a
   sidebar is therefore permanently docked at desktop width (no toggle at all, if
   the app renders none), behind the small posture's existing menu button below the
   breakpoint (mounting the app's real drawer component), and a destination in the
   app posture if that is how the app reaches its list. Both failure modes have
   shipped: chrome that could not be dismissed at all, and chrome left collapsible
   at every width (via a fake 3000px breakpoint) when the app docks it permanently
   on desktop. A bottom strip or compare column, which stands in for nothing in
   the app, does need a way out of the way on every viewport.

5. **Minimum viewport: 1024×720 for the desktop read.** Budget width against the
   app first, and remember the window is not maximised. Three columns needing
   ~1100px in a ~1050px window pushed the config below the fold and the whole
   playground read as broken. Test narrow before showing it.

6. **The real component, never a make-believe one.** A hand-drawn stand-in
   answers a question about the stand-in.

7. **Give it a Viewport control (Auto / Mobile)** so the small posture is
   reachable without resizing. Auto follows the window and frames nothing; Mobile
   forces the posture and frames it in the app's own phone frame, verbatim. The
   asymmetry is what makes it safe: framing is what the product does for a
   *deliberately forced* posture.

## Pick the rig for the question

**A whiteboard**, when the question is one comparison and the app is not needed to
see it. Directions as static pairs — idle beside changed — plus an
industry-reference row marked "for context, not options". No framework, no shell,
no config. Reach for this first; escalate only when the answer depends on being
*in* the app.

**The app with config at the bottom**, when you need the whole product but there
are only a few levers. A dark tooling strip pinned to the bottom: unmistakably not
product, always to hand, costs no width. Best default. It must still collapse.

**The app with a config rail**, when there are many options each needing arguing —
eight-odd directions, each with a claim and a trade-off, plus levers and a loop
driver. The playground rail simply *replaces* the app's sidebar; losing that
sidebar's function is a fair price and the layout stays exactly the app's. One
rail body, rendered in two or three places and never forked.

## Config pattern: Auto + override

Each option carries its **intended** answer to every lever (`def: {...}`).
Controls default to **Auto** (= use the option's own choice) and add explicit
overrides. Options stay genuinely distinct, and any single lever can still be
A/B'd across all of them. One `mergeCfg(option, overrides)` is where they combine,
and an "overridden" flag tells you the app is no longer showing the selected
option's own answer.

- **Publish every option's lever answers as a readout**, not just the overridable
  ones. Levers you chose not to expose still differ per option.
- **State the trade-off next to the claim.** An option without its cost cannot be
  steered — only admired.
- **Re-key the app on config change** (`key={optId + JSON.stringify(ov)}`) so
  chrome swaps land cleanly and overlays don't survive an option change.

## Traceability

- **One derivation function** (`resolve(seed, cfg)`) is the sole place display
  fields are computed, returning a `trace` recording which path each field took
  (extracted vs fallback vs default).
- A **Trace toggle** renders a strip *outside* each card — never overlaid, so it
  can't corrupt the design read — flagging fallbacks in amber.
- A **forced-outcome switch** (As seeded / Degraded / Total fail) walks the whole
  view down the cascade in one click: the fastest way to watch a system degrade.
- **Seed for coverage:** every state AND every fallback.

## When the question is a sequence

Some questions ("is this loop complete?") cannot be answered by a static render —
the beats have to be reachable. Give the playground a **driver**: one button per
beat (attach → receive → respond → lives), each putting the app in that state.
On a narrow viewport, dismiss the chrome as the driver fires so the app is
actually visible. Skip the driver when the question is about how one surface looks.

## Fidelity: reuse, copy, export

- **Mount the shipped interactive component and own only its callbacks.**
  Unmounting a flow at commit vs letting its reveal play *is* the difference
  between two candidate designs. Wiring that is worth it; describing it isn't.
- **Copying is allowed once; exporting is the fix on the second ask.** Where a
  shipped component keeps a piece internal, copying it is acceptable — the copy
  must carry a pointer to its source and must never be "improved". A copy tuned to
  look better is no longer evidence. If a second playground needs the same
  internals, export them from the shipped module.
- **A copy of a card body is unavoidable when content must sit *inside* the
  card's border.** Wrapping the real card cannot work.
- **3D flips: don't trust `backface-visibility` alone.** Toggle `visibility` per
  face with `transition: visibility 0s linear <half-duration>` so exactly one face
  is ever painted.
- **Overlays:** put the transform on the app-surface wrapper so `position: fixed`
  sheets pin to the app column, not the page. See `gotchas.md` #4.
- **A mounted app component sized for app content may need one prop for
  playground content — fix it in the app, not in a fork.** Playground chrome is
  routinely taller than the body a component was built for (a drawer with no
  `overflow-y` because the app's rail is short). The fix belongs in the shared
  component when it is correct for the app too (scrolling always is), or as a prop
  with the app's value as the default. Check any mounted component against
  overflow in both axes at 320px.

## Wiring

- **Entry HTML at the project root** (`<slug>-playground.html`) so its `app/*`
  and `tokens.css` paths resolve; **modules in the task's spec folder**
  (`docs/specs/<ticket>/pg-<slug>-*.jsx`).
- Load the app modules the playground actually mounts — load order is dependency
  order. Copy the hover/focus CSS classes those components rely on if they live in
  the app's entry HTML rather than in the modules.
- Babel scripts don't share scope: everything shared goes on `window`.
- Name style objects per component; never `const styles = {}`.
- A standalone bundle is compiled output: regenerate it, never edit it. Name it
  kebab-case — it gets downloaded and published.

## Housekeeping

- Persist selection + overrides to a namespaced key (`pg_<slug>_v1`) so reloads
  keep your place.
- **Verification clicks share the user's `localStorage`.** After probing states,
  reset your key to clean defaults so the user lands fresh.
- A playground is not a product-shape change: no changelog entry, and don't edit
  the app to serve it (except per the "one prop" rule above).
