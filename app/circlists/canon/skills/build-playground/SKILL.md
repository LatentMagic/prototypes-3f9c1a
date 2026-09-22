---
name: build-playground
description: Build a playground — a rig that makes one design question answerable instead of arguable, by mounting the real app with the options swappable and the states one click each. Use when a design decision needs the reviewer to form an opinion with the thing in their hands: comparing directions, testing whether a loop is complete, or choosing between options that cannot be judged from a list. Covers picking the rig shape, the non-negotiables, config levers, drivers, fidelity, wiring and export.
---

# Playgrounds

A playground is a rig that makes one design question **answerable** instead of
arguable. It is not a mock and not a slide: it is the real app, wired so the
options can be swapped and the states reached in one click each.

Four shapes are worth reaching for. Read "Pick the rig" first, then the rules;
the rules apply to all four shapes.

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
8. **A shipped control is live, or it is absent — never present-and-dead.** If
   the app renders a control the playground has no use for, wire it to the real
   surface anyway; do not pass the flag that greys it out. A disabled control
   looks like fidelity while quietly removing a constraint the design has to
   survive — the circle-settings gear sat dead through two rounds of a return
   exploration, and its *existence* was the thing that made one direction
   crowded and another one buried. The same rule kills dead driver buttons: a
   control that goes nowhere poisons the review it appears in, because the
   reviewer cannot tell an unfinished rig from a bad idea.
9. **A signal is not a feature.** If an option tells the member something has
   happened, the rig must also show what they *do* about it: find it, get there,
   arrive, and have it clear. Half of "return" once shipped as a mark on a card
   with no way to reach the card. Walk every clause of the brief end to end
   before counting it built — reading it clause by clause is not the same thing.
10. **Every option carries a number, a name, a stance and a cost.** The number
   is not decoration: it is how you and the reviewer refer to the thing out
   loud, in chat, and in the write-up afterwards, without quoting its name back
   at each other. The cost is what makes an option steerable — an option
   without one can only be admired, never chosen against.
11. **The rail says what; detail says why.** Name and number on the face; the
   stance and the cost behind a tooltip, a disclosure, or the option's own
   detail view. A rail carrying four lines of prose per option cannot be
   scrolled, cannot be scanned, and loses the reviewer their place — the list
   stops being a list. Selected option may expand; the rest stay one line.
12. **A variation may add an affordance; it may never quietly remove the app's.**
   One direction deleted the card's normal action button and moved the way in
   onto the "3w" timestamp — not a button, and not readable as one. If removing
   a control is genuinely the idea, that is the option's stated stance and its
   stated cost, never a side effect. Anything that acts as a button reads as a
   button.
13. **Seed for the problem, not only for coverage.** Coverage is every state and
   every fallback; the problem is the *volume the pain lives at*. A return
   exploration whose whole premise was "Read silts up and buries what you cared
   about" was seeded with six read cards. A comfortable list cannot demonstrate
   a problem of scale, and no amount of state coverage repairs that.

## Routes, when the answer lands on more than one surface

A rig that changes something in four places has a problem the option list cannot
solve: the reviewer does not know which four, does not know how to reach them,
and cannot tell "I did not see a difference" from "I never got there". So when
the question spans several surfaces — **and only then** — give the rig's chrome a
numbered route to each one.

- **A route is a driver, not a shortcut.** It presses the app's own controls in
  order, the way a member would, and then rings the element in question. It
  never stages the surface directly past the product: if a route breaks, the
  click path has moved, and that is worth knowing.
- **Say what each route is and what today's value is** — "3 · Your thought on a
  card · opens the card, then ⋯ → Edit · today 12.5". The list then doubles as
  the inventory of what is at stake, which is usually the thing the reviewer was
  missing.
- **Number them**, for the same reason options carry numbers: so the two of you
  can refer to one out loud without quoting its name back.
- **Only if it would help.** One surface, or surfaces the reviewer already lives
  on, needs no routes; a route list on a one-surface rig is chrome for its own
  sake. The test is whether a competent reviewer, handed the rig cold, would
  have to go looking.
- Scroll with the nearest scrollable ancestor, never `scrollIntoView` — the app
  scrolls the window on web and a container in the app posture.

## Pick the rig for the question

**A whiteboard**, when the question is one comparison and the app is not needed
to see it. Directions rendered as static pairs — idle beside changed — plus an
industry-reference row marked "for context, not options". No React, no shell, no
config. This is often all that is necessary — reach for it first and only
escalate when the answer depends on being *in* the app.

**An option board**, when the question is one detail of one surface and there are
five-odd treatments of it. A 3-up grid, each cell carrying **number + name, its
claim, its cost, and the real surface underneath** — static, nothing
interactive, one lede stating what is held fixed. Two rules earn it its keep:
**frame the whole surface, not the part being changed** (a footer cropped to its
last two lines cannot be judged; the full page body can), and **put the
objection on the page as a fact** — the contrast ratio and font size beside each
option turned "does this pass AA?" from a worry into a readout. Reach for it when
the treatments differ by weight, size, spacing or order rather than by behaviour.

**The app with a bottom strip**, when you need the whole product — rail,
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

## Housekeeping

- **Where it lives: `docs/specs/<ticket>/playground/`** — entry and modules together, never
  at the project root (root is the product itself). Make the nested entry load with
  `<base href="../../../" />` and then write **every** path root-relative, exactly as if
  the entry sat at the root — `app/main.jsx`, `tokens.css`,
  `docs/specs/<ticket>/playground/pg-foo.jsx` for the rig's own modules. Babel resolves
  its `src` against `<base>` too, so longhand `../../../app/…` climbs twice and bare
  sibling filenames resolve at the root. Full rule: `CLAUDE.md` § Playgrounds.
- **Add the rig to the launcher.** `playgrounds.html` at the root renders `playgrounds.json`:
  a shelf of tickets, then that ticket's candidate build and rigs. Adding, moving or
  archiving a rig means adding or moving its manifest entry — a rig the launcher does not
  list is a rig the user cannot find. An entry is hidden with `"on": false`, never deleted.
- **Never leave a standalone bundle behind.** Generate it, hand it over, delete it in the
  same session (each costs 1.7–6 MB). Name it `<slug>-playground-standalone.html`.
- Persist selection + overrides to a namespaced `localStorage` key
  (`pg_<slug>_v1`) so reloads keep your place.
- **Verification clicks share the user's `localStorage`.** After probing states,
  reset your key to clean defaults so the user lands fresh. This has been missed
  once already: a stray click left an override on, and the playground read as
  "overridden" on the user's first look.
- **Capture a frame only once the state has settled:** animations finished, no stray focus.
- A playground is not a product-shape change: no `CHANGELOG.md` entry, and don't
  touch `app/` except the one-prop fix in `references/fidelity-and-wiring.md`.

## References — read the one that applies

- `references/rig-patterns.md` — the Auto + override config pattern (only where
  the rig genuinely has levers), traceability strips for cascade questions, and
  drivers for when the question is a sequence.
- `references/fidelity-and-wiring.md` — mounting vs copying shipped components,
  the Babel multi-file wiring, file placement, and pure-HTML export when the
  playground ships as an asset.
