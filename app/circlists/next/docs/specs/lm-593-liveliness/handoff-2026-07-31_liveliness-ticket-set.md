# Handoff — the liveliness ticket set landed (#614–#618)

**Date:** 2026-07-31
**Preceded by:** `audit-2026-07-31-liveliness-set.md` (the read-only pass that found these gaps)
**Files:** `app/liveliness.jsx`, `app/main.jsx`, `app/shell.jsx`, `app/config.jsx`, `app/tab-signal.jsx` (new), `circlists.html`, `brand/assets/favicon-notification.svg` (new)

## What changed, by ticket

**#614 — the refresh reports back and lands what it finds**

- The receipt now resolves into the full mark on **both** outcomes, not just on finding nothing.
- What it finds **lands directly** — no pill. `refreshSpace` folds `queued` *and* anything still behind
  the pill into the feed, so the gesture makes the pill moot instead of standing beside it.
- It **reconciles**: items in `remoteDeleted` (another member's delete) are gone afterwards, silently.
- It **carries the member** to the arrivals when there are any (`scrollToArrivals`, the window on web
  and the phone screen in the app posture) and does not move them when there are none.
- One polite announcement, `"Refreshed"`, from a single app-level live region. The receipt itself is
  now `aria-hidden` — it no longer narrates "Refreshing" / "Up to date", which was the feed speaking
  twice.
- The `title="Refresh …"` tooltip is gone: the rail entry gains nothing for being refreshable.
- Below 1024px the drawer still stays open; navigating still closes it.

**#615 — the timed check, the dot and the pill**

- The check is **real and ships on**, unhurried: `CIRC_CHECK_MS` — slow ≈ 45s (default), fast ≈ 7s for
  review, off. Some of what it finds is deliberately left **unsurfaced** (`queued`), so the rail
  refresh has something honest to report.
- On the **Read tab** an arrival in the open circle now lights that circle's dot (the pill is out of
  sight there); the dot clears on reaching **Active**, where the pill is waiting. The dot-clearing
  effect is gated on `tab === 'active'` for exactly this.
- The pill **announces itself** ("New links") through the live region, which sits in the page empty
  from first render — a region inserted with its text announces nothing.
- The rail entry's hidden text now **adds** to the name (`"Book club, new items"`).

**#616 — the waterline**

- The mark is stamped **on entry** (`openVisit`), and the **drawn** line is held in `dividerAt` —
  visit state, never persisted. Mid-visit arrivals stamp the mark again; the drawn line cannot move.
- A **browser reload** therefore draws no line, which is the behaviour the ticket asks for.
- Leaving with a pill unaccepted no longer rewrites the mark: it folds the arrivals in and leaves the
  circle holding unseen items, which is the dot's own test.
- `FeedSeam` / `.circ-fseam` deleted — #616 forbids a rule closing off the items below the line.

**#617 — the age ladder**

- Already correct; unchanged. The header comment now names it **age** throughout.

**#618 — the browser tab**

- New droppable module `app/tab-signal.jsx`: the icon swaps to the notification icon while the tab is
  hidden, boolean, cleared on focus. Safari (positive match, fail-closed) gets the `• ` title prefix
  instead, never both.
- The module takes ownership of the icon — it drops the four declared `<link rel="icon">` elements and
  keeps one of its own, since the browser picks among them.
- The notification icon is **consumed as a brand asset**: `brand/assets/favicon-notification.svg`.

**Newness treatments (shared)**

- `.circ-arrive` split into `.circ-glow` (the sage wash) and `.circ-rise` (the travel), and
  `CircGlow` gates the glow on the card **coming into view** — any card above the waterline, fresh
  loads included, once per visit.
- Under `prefers-reduced-motion` the card does not travel and **the glow still plays**.
- `IntersectionObserver` alone was not enough: a document that has not been composited yet never gets
  a first callback, so cards already on screen at load never glowed. `CircGlow` measures the rect on
  the next frame as well.

## Staging (Config → Liveliness)

Timed check off/slow/fast · count · stage an arrival here / in another · **unsurfaced arrival**
(only a refresh or a fresh load finds it) · **delete by another member** (only a refresh or a fresh
load reconciles it away).

## Decisions taken against the source material

- `STATE_KEY` → `circ_state_v11`. The mark's semantics changed and stale `pending` / `queued` from a
  previous session could resurrect a pill.
- The tab-signal pack said to generate the badged icon as a runtime data-URI and keep it out of
  `brand/assets/`. **#618 R5 overrides it** — consumed as an asset, never redrawn in app code.
- **#615 R6** ("that click is when their age updates") conflicts with **#617 R5** (age counts from
  contribution alone). #617 wins: an arrival staged ten minutes ago and accepted now reads `10m`,
  which is also #617's own acceptance criterion.

## Out of reach in a prototype

Per-account marks (#616 R1) and cross-device behaviour: state is `localStorage`, so the mark is
per-browser. Real background-tab throttling (#618 R7) likewise.
