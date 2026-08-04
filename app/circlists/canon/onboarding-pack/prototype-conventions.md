# Prototype conventions

For a multi-file HTML prototype (React via in-browser Babel) that will be edited
over months. These are the conventions that stopped recurring, silent failures.

## Module wiring

- **One entry HTML at the project root**, modules in `app/`. Load order in the
  HTML is dependency order and is the only place it is declared.
- **Babel scripts do not share scope.** Every module ends with
  `Object.assign(window, { ComponentA, helperB })`, and reads its dependencies
  from `window` at the top. This is not elegance, it is the mechanism — an import
  statement in a `text/babel` script will not do what you expect.
- **Never `const styles = {}`.** Name every style object after its component
  (`feedCardStyles`). Cross-file collisions on `window` are silent and fatal.
- **Split components past ~200 lines**, container/presentation split (data
  fetching and branching in one, rendering in the other).
- **Tokens in one `tokens.css`.** Never a raw hex in a component. Hover/focus
  classes the components rely on live in the entry HTML, not in the modules —
  remember them when mounting a component somewhere else.

## Deletable aids and droppable modules

Design the app so a set of named files can be **absent** without breaking it:
each is read once per render off `window`, with a stated fallback. Tabulate them
in `ARCHITECTURE.md`.

This buys two things. A stripped variant (public demo, embed, screenshot build)
is derived by **deleting** files, never by editing the core — so the two builds
cannot drift. And development aids (a config launcher, a tweaks panel, scenario
seeds) can be rich without ever becoming load-bearing.

Kinds worth distinguishing:
- **droppable module** — a whole posture or screen; absent ⇒ falls back to the
  generic one.
- **droppable body** — a screen's content; absent ⇒ its empty state renders.
- **deletable aid** — tooling; absent ⇒ baked-in defaults render.

## One core, N postures

If the product has several presentation contexts (desktop web, mobile web, native
app), treat them as *postures of one product*, not products.

- A root state machine decides **which screen you are on** and never renders
  chrome itself. It wraps the screen in a shell-swapping helper.
- Every shell takes the **same prop surface** and the **same children**. The
  screen inside is literally the same component in every posture.
- Only the persistent **chrome** may differ. Everything the user reads or acts on
  is shared.
- Posture selection comes from **one switch** (a config toggle, session-only) and
  from the window width at a **single stated breakpoint**. Read the breakpoint
  from that one place; never invent a second one.
- Any non-chrome posture branch (e.g. payments only on web) is a **single
  render-level guard over a route list**, so every entry point is covered —
  including the ones you add later.

The invariant to write down: *a change to a shared surface lands in all postures
with no per-posture edit.* State it, and the shape of the code enforces it.

## State

Lives in the root state machine unless it is purely local chrome state (a drawer
open, a transition in flight). Resist the intermediate cases; they are where
two sources of truth appear.

## Config aids worth building early

- **A viewport/posture forcer** (Auto / Mobile) so you can see the small posture
  without resizing the window. Frame the *deliberately forced* posture in a phone
  frame; never frame the automatic one. A bezel you chose is a preview; a bezel
  by default is a picture of the app.
- **Scenario seeds** that put the app into a named state in one click, covering
  every state *and* every fallback.
- **A tweaks panel** for values still under discussion, so a "which of these
  three" question is answered by toggling rather than by forking a file.

All three are deletable aids. None of them may be required for the app to run.

## Persistence

Namespace every `localStorage` key (`<app>_<thing>_v1`) and never clear or
overwrite a key you did not write. Agent verification clicks share storage with
the user's live view — after probing states, reset your own keys to clean
defaults so the user lands fresh. This has bitten before: a stray probe left an
override on and the user's first look was of a misconfigured app.
