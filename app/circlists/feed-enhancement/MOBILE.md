# The app posture (native mobile)

What the phone app is, how it differs from the web prototype, and how to keep both maintained at
once. For the posture-swap mechanism itself see [`ARCHITECTURE.md`](ARCHITECTURE.md).

> **Status: unvetted prototype.** This posture was largely one-shot, with a few tweaks on top, to
> get a sense of how the app might look and feel. The IA (direction 2) is decided; the execution
> around it is not — spacing, states, edge cases, empty and error states, accessibility passes and
> the surfaces reached from the bar have not been worked through. Treat what is here as a sketch to
> react to, not a settled build, and expect to redo parts of it.

**Files:** `app/app-shell.jsx` (chrome) · `app/home.jsx` (home body) · routing in `app/main.jsx`.
**To see it:** Config → **Platform: Mobile**.

## The relationship to the web prototype

The app is not a second product and not a fork. It is the same screens in different chrome. Read
that literally:

- **Shared, always** — feed and cards, Active/Read tabs, circle settings/members, account
  settings, dormant, funding, auth, The Swell. One component each, rendered by all three postures.
- **May differ** — persistent chrome (top bar, bottom bar, rail/drawer), the container a
  destination is presented in, and the phone viewport.
- **Never** — a per-posture copy of a surface. If a surface needs to behave differently on the
  phone, that difference belongs *inside* the shared component (it already knows `isMobile`), not
  in a second file.

## Chrome: one bar, two levels

| | Home (account level) | Inside a circle (circle level) |
|---|---|---|
| Top bar | wordmark | circle name + gear (right) |
| Body | circles list + New circle | Active/Read tabs + feed |
| Bottom bar | **Home · Account** | **Home · Account** |
| Floating action | — | **Add a link** |

**The bar holds account-scoped destinations only, and holds the same two wherever it is
rendered.** It never changes shape as the member moves, and nothing in it ever speaks for a
circle, so no slot has to prove whose it is. This is the whole of IA direction 2, and everything
below follows from it:

- **Home** is the way *back*. It moves you rather than acting on anything, so it carries no scope
  of its own. It replaces a top-bar back arrow.
- **Account** is reached from the bar, so the level a member is standing at is named in one place
  and the top bar is left carrying status alone.
- **Circle scope lives above the bar.** The circle's gear sits in the circle top bar beside the
  circle's name — the one control that acts on the circle, next to the thing it acts on.
- **Add is a floating FAB** — `app/feed.jsx`'s own, raised clear of the bar by `APP_FAB_BOTTOM`
  (`app/app-shell.jsx`). It is circle-scoped and means *add a link*, so it stands inside a circle
  and nowhere else, and never changes its noun by context.
- There is **no Reading slot**: it was a tab for the screen you are already on.
- **Sub-views carry neither bar nor FAB.** Circle settings and Account are full pages with a back
  arrow; both belong to the two levels, not to the pages beneath them.

Discarded permanently: a bar whose slots change with the level · a bar with nothing in it at all
· Add as a fourth slot · the circle-switcher bottom sheet.

## Containers

- **Bottom sheet — Add only.** A short, transient choice where the context behind stays visible
  and you return to it.
- **Full page, sliding in from the right — circle entry, circle settings, Account.** Destinations
  you navigate *into*, with their own content. A sheet with navigation inside it is the
  anti-pattern.

Motion is `translateX(100%) → translateX(0)`, `var(--duration-slow)` `var(--ease-quiet)`, driven
by **depth**, not route: deeper (home → circle → sub-view) slides the new view in over the old;
shallower slides the old view off, revealing the new beneath. One implementation —
`useNativePush` in `app/app-shell.jsx`. **Do not fork the choreography** (render hidden →
double-rAF → shown → settle); it is the same beat as `AddReveal` in `app/feed.jsx`.

Both layers exist only for the length of the transition. The settled tree carries no transform,
because a transform creates a containing block and any `position: fixed` overlay inside would pin
to it. See `GOTCHA.md`.

## Home is a surface

Home carries the circles list and, above it, the cross-circle returns strip — the conversations
that have moved in any circle the member belongs to (`app/home-returns.jsx`). That strip exists
nowhere else in the product, and that is what makes home a shared surface rather than chrome: it
lands in all three postures through the same `inShell` call, and its body lives in its own file
(`app/home.jsx`) so no posture holds a copy of it.

It is also what gives the bar an account level worth naming. A slot pointing at home points at a
place to stand, not merely at the way out of a circle.

The no-membership case is the **empty state of the same screen**, not a separate route.
`route: 'home'` serves both.

## Payments

App + **Mobile payments: Off** (the default) sends every funding / checkout / manage path to the
finish-on-web handoff. Guarded once in `main.jsx`, not in the shell. See `ARCHITECTURE.md`.

## Maintaining both at once — the checklist

- **Changing a surface?** Change the one component. Check it in Web *and* App via Config. If you
  find yourself writing `isApp` inside a surface, stop — that is a chrome question.
- **Adding a destination?** Decide its level first (account or circle). Account-level
  destinations may reach the bar; circle-level ones live above it. Then pick the container by the
  rule above.
- **Adding a bar slot?** Almost certainly no. Two slots, both account-scoped, is the invariant
  that makes the bar readable. A third needs a reason that survives the scope question.
- **Touching the phone frame?** It is three layers: bezel (`.circ-phone`) → clip
  (`.circ-phone-clip`, carries the transform, non-scrolling, screen bounds + radius) → screen
  (`.circ-phone-screen`, scrolls). Read `GOTCHA.md` before changing any of them.
- **Deleting `app/app-shell.jsx`** must still cleanly remove the app posture with no other edit.

## History

`docs/specs/biz-136-mobile-chrome/` — the whiteboard that produced direction 2: four chrome
directions drawn against one another, with TickTick's bar alongside as a reference.

`docs/specs/biz-84-app-ia/` — the earlier IA exploration that gave the posture its two levels and
its containers. `App IA playground.html` there keeps directions 01–08 as the contrast that produced them.
