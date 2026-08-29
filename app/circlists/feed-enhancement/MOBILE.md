# The app posture (native mobile)

What the phone app is, how it differs from the web prototype, and how to keep both maintained at
once. For the posture-swap mechanism itself see [`ARCHITECTURE.md`](ARCHITECTURE.md).

> **Status: unvetted prototype.** This posture was largely one-shot, with a few tweaks on top, to
> get a sense of how the app might look and feel. The IA (direction 08) is decided; the execution
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

## Chrome: two states, one shell

| | Home (account level) | Inside a circle (circle level) |
|---|---|---|
| Top bar | wordmark + avatar (right) | circle name only |
| Body | circles list + New circle | Active/Read tabs + feed |
| Bottom bar | **none** | **Home · Add · Settings** |

**The bar is never rendered outside a circle.** There is no screen where you can see the bottom
bar and not be inside a circle, so the bar *is* the circle scope — a plain "Settings" cannot be
read as the app's settings, and needs no label gymnastics to prove whose it is. This is the whole
of IA direction 08, and everything below follows from it:

- **Home** is the root. Account hangs off the avatar in the top bar, not off a bar slot — you are
  already at account level.
- The **Home slot** is the way *back*. It moves you rather than acting on anything, so it does not
  reintroduce the scope mix. It replaces a top-bar back arrow.
- **Add** is the centre-docked accent circle (54px, `marginTop: -30`, surface ring). Not a
  floating FAB — that was ruled out and stays ruled out. The web `FAB` is suppressed in app mode.
- **Settings** is the plain gear, third slot, opening the circle's settings as a full page.
- There is **no Reading slot**: it was a tab for the screen you are already on.

Discarded permanently: floating FAB · Add as slot 3 of 4 · the circle-switcher bottom sheet ·
a Settings slot visible outside a circle.

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

## Home: chrome today, a surface later

Home holds exactly one thing — the circles list — which already exists in the web posture as the
rail. Same content, different chrome ⇒ chrome. Web stays frozen and the three-postures rule holds.

**The test for when that flips:** the day home gains content that exists nowhere else — a
cross-circle view, activity, anything beyond "pick a circle" — it becomes a shared surface and
must land in all three postures. That is why the body lives in its own file (`app/home.jsx`):
promotion is a move, not a rewrite.

The no-membership case is the **empty state of the same screen**, not a separate route.
`route: 'home'` serves both.

## Payments

App + **Mobile payments: Off** (the default) sends every funding / checkout / manage path to the
finish-on-web handoff. Guarded once in `main.jsx`, not in the shell. See `ARCHITECTURE.md`.

## Maintaining both at once — the checklist

- **Changing a surface?** Change the one component. Check it in Web *and* App via Config. If you
  find yourself writing `isApp` inside a surface, stop — that is a chrome question.
- **Adding a destination?** Decide its level first (account or circle). Circle-level destinations
  reach the bar; account-level ones must not. Then pick the container by the rule above.
- **Adding a bar slot?** Almost certainly no. Three slots, all circle-local, is the invariant that
  makes the bar readable. A fourth needs a reason that survives the scope question.
- **Touching the phone frame?** It is three layers: bezel (`.circ-phone`) → clip
  (`.circ-phone-clip`, carries the transform, non-scrolling, screen bounds + radius) → screen
  (`.circ-phone-screen`, scrolls). Read `GOTCHA.md` before changing any of them.
- **Deleting `app/app-shell.jsx`** must still cleanly remove the app posture with no other edit.

## History

`docs/specs/biz-84-app-ia/` — the IA exploration, the three directions that failed before 08,
why, and the playground itself. `App IA playground.html` there keeps directions 01–08 as the contrast that produced the decision.
