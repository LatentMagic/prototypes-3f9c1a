---
date: '2026-07-27'
topic: 'mobile-app-ia'
status: 'in-progress'
type: 'exploration'
---

# Handoff: mobile app IA — bottom-bar rework landed, five IA directions awaiting a decision

## Current Focus

**The user has not yet picked an IA direction.** `docs/specs/biz-84-app-ia/App IA playground.html` presents five, each
with a claim and a trade-off; the next session's first job is to take their pick (or their
reaction) and harden it into the real app posture (`app/app-shell.jsx`).

The user's own framing: Add and circle Settings are **circle-local**, but the bottom bar reads
as **global** navigation, and that mismatch is the actual problem — not the visual polish, which
they said "looks good". They named three routes out: (1) keep the spread but reach clarity,
(2) reduce down — no Reading tab, settings back to the top bar, feed implicit, and Add carries a
scope hint, (3) some other invention.

Two softer, still-open questions from the same message — the user is "not against, just not
CONVINCED": is a **bottom sheet** the right container, and is a **tap-opens-a-sheet Account**
right? Both are levers in the playground; neither has an answer yet.

My stated recommendation (not agreed): **option 05** (circle chip in the top bar) with **Account
as a full page**. Do not treat that as settled.

## Task(s)

1. **Audit + fix of the app posture — LANDED** in the prototype. The user hated the 4-slot bar
   with Add as slot 3 of 4 (uneven). Fixed by finding a genuine fifth destination.
2. **Sheet polish and a real overlay bug — LANDED.**
3. **`docs/specs/biz-84-app-ia/App IA playground.html` — BUILT, awaiting user reaction.** Explores the IA question above.
   Nothing from the playground has been applied to the prototype; `circlists.html` currently runs
   direction **01** (five slots).

## Critical References

- `CLAUDE.md` — the posture rules. Note especially: *three postures, one shared core*; a
  shared-surface change must land in all three with no per-posture edit. The posture line was
  updated this session to describe the five-slot bar.
- `GOTCHA.md` — read before touching overlay/sheet motion. A new trap surfaced this session
  (phone-frame clip layer, below) that is **not yet in the file** — adding it needs user approval
  per CLAUDE.md.
- `PLAYGROUND.md` — updated with what worked in this playground; read before building the next one.
- `tokens.css` — binding for every value. Accent `#047857` only for primary/active/focus.

## Recent changes

App posture rework — `app/app-shell.jsx`:
- `TopBarNative` — gear removed; the root top bar is now the circle name alone. Signature lost
  `showMembers` / `onMembers`.
- `AddNavItem` — new. Large (54px) accent circle, `marginTop: -30` so it overlaps the bar's top
  edge, `box-shadow` ring in surface colour to separate it from content scrolling beneath.
- `BottomNav` — five slots: Reading · Circles · Add · Settings · Account. New `canSettings` prop.
- `CircleSwitcherSheet` — rows gained initial tiles (`circleTile`), active one in accent.
- Sheet chrome — 20px top radius, 40px grabber, more generous padding.

Overlay containment fix — `circlists.html` + `app/main.jsx`:
- The `transform: translateZ(0)` containing block was on `.circ-phone` (the bezel), so
  `position: fixed` sheets pinned to the *frame* and bled over the bezel. Introduced
  `.circ-phone-clip` — a non-scrolling layer with exactly the screen's bounds and corner radius —
  and moved the transform there. `main.jsx` now renders
  `.circ-phone > .circ-phone-clip > .circ-phone-screen`.

Shared surfaces:
- `app/feed.jsx` — AddReveal sheet radius 16 → 20 (matches the shell's sheets).
- `app/spaces.jsx` — `ContentPage` horizontal padding 20 → 24px. This was the user's
  "settings are close to edge" note; it lands in mobile web too, by design.

Playground — new files, listed under Artifacts. Post-review fixes already applied:
- Compare-column cards were `<button>` wrapping a live bar of `<button>`s (invalid DOM). Now
  `role="button"` divs; preview bars get `aria-hidden` + `inert`.
- **`entry` split out from `circles`** — where the switcher is *reached* (Tab / Top chip) is now
  independent of how it *appears* (Sheet / Full page / Menu / Inset). Chip-entry can be compared
  against every container.
- Playground `localStorage` (`pg_appia_v1`) reset so the user lands on 01, all levers Auto.

## Learnings

- **The phone frame needs three layers, not two.** Bezel (`.circ-phone`) → clip
  (`.circ-phone-clip`, carries the transform, non-scrolling, screen bounds + radius) → screen
  (`.circ-phone-screen`, scrolls). Put the transform on the bezel and fixed overlays bleed onto
  it; put it on the scroller and they ride the scroll. **Candidate GOTCHA.md entry — ask first.**
- **Body vs container is the way to answer "is a sheet right?"** One content body per
  destination, N containers around it. The question becomes an A/B instead of an argument.
  See `docs/specs/biz-84-app-ia/pg-ia-overlays.jsx` (`PgPresent`).
- **Derive bar slots, never hand-list them per option** — `pgBarSlots(cfg)` in
  `docs/specs/biz-84-app-ia/pg-ia-chrome.jsx` builds the slot array from config and splices Add into the
  centre. Adding a lever doesn't multiply the option code.
- The mount choreography (render hidden → double-rAF → shown → animate out → unmount after the
  transition) is duplicated in the playground as `usePgPresent`. If a direction is hardened,
  don't fork it further — the app's own version is the one to keep.

## Artifacts

- `docs/specs/biz-84-app-ia/App IA playground.html` — shell, phone frame, reused app chrome CSS.
- `docs/specs/biz-84-app-ia/pg-ia-options.jsx` — the five directions, their `def` (intended answer to every
  lever), the lever list, `pgMergeCfg`, seed data.
- `docs/specs/biz-84-app-ia/pg-ia-overlays.jsx` — `PgPresent` (sheet / inset card / full page / anchored menu)
  + the three content bodies.
- `docs/specs/biz-84-app-ia/pg-ia-chrome.jsx` — top bar (plain / chip), in-content circle header, bottom bar,
  `pgBarSlots`, feed.
- `docs/specs/biz-84-app-ia/pg-ia-app.jsx` — rail, lever heading, phone, bar-compare column.
- Modified: `app/app-shell.jsx`, `app/main.jsx`, `app/feed.jsx`, `app/spaces.jsx`,
  `circlists.html`, `CLAUDE.md`, `PLAYGROUND.md`.

## Action Items & Next Steps

1. **Get the direction.** Ask which of the five (or which hybrid of levers) to harden. Do not
   build ahead of this — the user asked for a playground precisely to steer.
2. **Harden into `app/app-shell.jsx`.** Whatever wins, it is a change to the *shared* app
   posture: the surfaces inside must not fork per posture (CLAUDE.md). If Settings leaves the bar,
   restore an `onMembers` path — it currently reaches circle settings only via the bar slot.
3. **Resolve the two container questions explicitly** — sheet vs full page for Account, and
   whether the switcher stays a sheet. These were asked and never answered; don't let them lapse
   a second time.
4. **CHANGELOG.** Nothing has been added this session. The bar rework alone is arguably chrome
   refinement, but moving circle Settings out of the top bar and into primary nav changes the
   posture's shape — and a chosen IA direction certainly would. Propose one entry covering the
   landed IA, once the direction is settled. Ask before writing.
5. **GOTCHA.md** — offer the three-layer phone-frame entry. User approval required.

## Other Notes

- The user reviews bottom-up and reacts to *unevenness and scope confusion* faster than to
  polish. Give them something to react to rather than a proposal to read.
- They explicitly do not want a floating FAB — earlier research in this project ruled it out. The
  centre-docked circle is the agreed compromise; it is not a FAB and shouldn't drift into one.
- Discarded: leaving Add as slot 3 of 4. Non-negotiable — this is what started the session.
- The playground persists to `localStorage` under `pg_appia_v1`. If the user reports a stale or
  confusing starting state, reset that key rather than redesigning around it.
