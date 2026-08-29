---
date: '2026-07-27'
topic: 'app-ia-direction-08'
status: 'decided — awaiting integration'
type: 'spec'
---

# Handoff: app IA direction 08 is CHOSEN — integrate it into the app posture

## Current Focus

The IA exploration is **over**. The user picked **direction 08, "Home in the circle bar"**,
and said so unambiguously ("I am really happy with this"). Nothing has been integrated yet:
`circlists.html` still runs the old five-slot bar. The next session's whole job is hardening 08
into `app/app-shell.jsx` (+ `app/main.jsx` routing).

Reference implementation: **`docs/specs/biz-84-app-ia/App IA playground.html` → direction 08** in the left rail. Open it
and use it; it is the spec. This document exists so you do not have to re-derive the reasoning.

## The rule that produced 08 (do not lose this)

The original complaint: Add and circle Settings are **circle-local**, but the bottom bar read as
**global** navigation, so the bar mixed scopes.

Three attempts failed before 08, and each failure is informative:
- **Adding a fifth slot** (the landed five-slot bar) balanced the bar visually and left the scope
  mix untouched.
- **Home as a permanent bar slot** (playground 07, first cut) moved the mix rather than removing
  it: a slot labelled "Settings" that is visible on *every* screen reads as the **app's** settings.
- **Renaming that slot after the circle** (07, second cut — tile + "Backend Pod") fixed the scope
  read but over-promised the payload: the user expects the circle, gets the circle's settings.

**The resolution: the bar is not rendered outside a circle.** There is no screen in the app where
you can see the bottom bar and not be inside a circle, so the bar *is* the circle scope. A plain
"Settings" cannot be misread, and needs no renaming to prove whose it is. The scope problem was
never a labelling problem — it was the bar being global.

Corollary the user reached independently: **Reading was a tab for the screen you are already on.**
With home above the circle, it earns a slot only as the way back from Add or Settings — too weak.
It goes.

## The spec

**Two chrome states, one shell.**

| | Home (account level) | Inside a circle (circle level) |
|---|---|---|
| Top bar | "Circlists" + avatar (right) | Circle name only |
| Body | Circles list | Active/Read tabs + feed |
| Bottom bar | **none** | **Home · Add · Settings** |

- **Home** is the root. Its body is the circles list — tile, name, and a reason to look at it
  (`N unread · N members`), plus **New circle**. Account hangs off the avatar in the top bar, not
  off a bar slot: you are already at account level.
- **Entering a circle** pushes a full-screen layer over home, sliding in from the right.
- **Home slot** in the circle bar is the way back — it does not act on anything, it moves you, so
  it does not reintroduce the scope mix. It replaces the top-bar back arrow.
- **Add** is the centre-docked accent circle, unchanged (54px, `marginTop: -30`, surface ring).
  Still not a FAB — that was ruled out earlier and stays ruled out.
- **Settings** is the plain gear, third slot, opening the circle's settings as a full page.

**Container decisions — these were open for three sessions; they are now closed.**

- **Bottom sheet: for Add only.** A sheet is right for a short, transient choice where the context
  behind must stay visible and you return to it. Add is exactly that shape.
- **Full page (slide in from the right): circle entry, circle settings, Account.** All three are
  destinations you navigate *into* and that have their own content; a sheet with navigation inside
  it is the anti-pattern. The user specifically called out and liked this slide treatment being
  consistent across all three.
- **The circle-switcher sheet is deleted.** Circles are listed on home. One way to switch.

**Do not confuse two things I conflated earlier:** the bar's "Reading" *slot* is removed; the
feed's **Active / Read tabs** (`Tabs` in `app/shell.jsx`) are untouched and must remain. They are
shared-surface content, not app chrome.

## Motion

Slide-in layer: `transform: translateX(100%) → translateX(0)`, `var(--duration-slow)`
`var(--ease-quiet)`. Mount choreography is the app's existing one — render hidden → double-rAF →
`shown` → animate out → unmount after the transition (`useNativeSheet` in `app/app-shell.jsx`;
duplicated in the playground as `usePgPresent`). **Do not fork it again** — generalise
`useNativeSheet` to serve both sheet and page presentations.

The phone frame needs **three layers**: bezel (`.circ-phone`) → clip (`.circ-phone-clip`, carries
the `transform`, non-scrolling, screen bounds + radius) → screen (`.circ-phone-screen`, scrolls).
Transform on the bezel and fixed overlays bleed onto it; transform on the scroller and they ride
the scroll. Already landed in `circlists.html` + `app/main.jsx`. Still a **candidate GOTCHA.md
entry — needs user approval before writing.**

## Integration notes for `app/app-shell.jsx` + `app/main.jsx`

- `AppShellNative` currently renders `BottomNav` unconditionally when `!isSub`. It now needs the
  home/circle distinction: **no bar on home**, three slots in a circle. `BottomNav` loses
  `onReading`, `onCircles`, `onAccount`; keeps `onAdd`, `onSettings`, gains `onHome`.
- `CircleSwitcherSheet` is **deleted**. `AccountSheet` is **deleted** — Account is already a
  full-page `subView` via `onManageAccount` → `route: 'account'`, which is what 08 wants.
- **`route: 'home'` already exists** in `main.jsx` but currently means *the authenticated home for
  a user who holds no membership* (`goHome()` sets `currentId = null`). 08 makes home a real
  destination for users **with** circles. Generalise that route rather than inventing a second
  one — the empty case becomes the empty state of the same screen.
- `TopBarNative` gains the home variant (wordmark/name + avatar). Its sub-view variant is
  unchanged. Its root variant keeps circle name only — the gear stays out of the top bar.
- `onMembers` / `showMembers` / `canSettings` gating is unchanged; it now drives the third slot.
- The web postures are **frozen**. Everything inside the shell stays the shared component —
  `MembersSurface`, `AccountSettings`, the feed. Only chrome diverges.

**Home is chrome now, a surface later — settled, with a test for when it flips.** Home today holds
exactly one thing: the circles list, which already exists in the web posture as the rail. Same
content, different chrome → chrome, so the three-postures rule is not violated and web stays
frozen. **The test:** the day home gains content that exists nowhere else — a cross-circle view,
activity, anything beyond "pick a circle" — it becomes a shared surface and must land in all three
postures. The user expects that day to come.

So build the home **body** as its own component (circles list + New circle), not inlined into
`AppShellNative`. Promotion to a shared surface is then a move, not a rewrite.

## Artifacts

- `docs/specs/biz-84-app-ia/App IA playground.html` — directions 01–08. **08 is the decided one**; 06 and 07 are kept only
  as the contrast that produced it. `docs/specs/biz-84-app-ia/pg-ia-{options,overlays,chrome,app}.jsx`.
- Playground `localStorage` key `pg_appia_v2`. Reset it rather than redesigning around a stale
  starting state.
- Direction 08's config, for reference:
  `{ home: 'push', reading: false, circles: 'page', account: 'page', add: 'dock', settings: 'bar' }`.

## Action Items & Next Steps

1. **Integrate 08** into `app/app-shell.jsx` + `app/main.jsx` per the spec above.
2. Keep the home body a separate component so it can be promoted to a shared surface later
   without a rewrite (see the chrome-vs-surface test above). No need to re-ask the user.
3. **CHANGELOG** — 08 is a genuine information-architecture rework of the app posture, so it
   earns one entry once integrated: home screen introduced, bar scoped to circles, switcher sheet
   removed. Terse title + 2–4 shape-level bullets. **Ask before writing.**
4. **GOTCHA.md** — offer the three-layer phone-frame entry. User approval required.
5. Update the posture line in `CLAUDE.md` — it still describes the five-slot bar.

## Other Notes

- The user reacts to **unevenness and scope confusion** faster than to polish, reviews bottom-up,
  and wants something to react to rather than a proposal to read.
- They will call out a derived option as fake. When offering alternatives, each must come from its
  own premise — a rearrangement of the same idea is a decoy, and they will say so.
- Discarded permanently: floating FAB; Add as slot 3 of 4; the circle-switcher bottom sheet.
