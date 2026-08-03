# Liveliness set — audit against the prototype

Read-only audit of `circlists.html` + `app/*` as they stand on 2026-07-31. Nothing was changed.
Evidence came from the source (`app/main.jsx`, `app/liveliness.jsx`, `app/shell.jsx`, `app/feed.jsx`,
`app/seed-data.jsx`, `app/config.jsx`, the liveliness CSS block in `circlists.html`) and from driving
the running prototype in the preview: the rail refresh gesture from the drawer, staging arrivals via
Config → Liveliness on both tabs, accepting the pill, and a browser reload. Two demo cards staged
during probing were removed afterwards; the saved state is as it was found.

## Verdicts

| # | Verdict | Evidence |
|---|---|---|
| A1 | Present | `refreshSpace` sets `refreshing`; the rail button renders `CircleSignal state="busy"` — `BrandSpinner` in the slot beside the name — for a fixed 900ms beat, then `settled` (the arc closes into the full mark). Under 1s. |
| A2 | Present | `refreshSpace` never touches `loadingFeed`, and is guarded by `if (refreshing \|\| loadingFeed) return`. Triggered from the drawer: feed stayed rendered, `FeedLoading` never mounted. |
| A3 | **Contradicted** | The active rail button carries `title={'Refresh ' + s.name}`. Probed DOM: `title="Refresh Tuesday Book Club"`. Slot exclusivity itself is correct (`busy`/`settled`/`unseen`, one at a time). |
| A4 | **Contradicted** | A refresh that finds something moves `queued` into `pending` — i.e. it raises the New pill. Nothing lands directly. `queued` is also never populated anywhere in the build (seed sets `[]`; no staging action writes it), so this branch is unreachable. |
| A5 | **Contradicted** | Glow (`.circ-arrive::after`, sage wash) and motion (`circ-arrive-rise`, 6px settle) both exist, but both fire on the single `arrived` trigger set in `revealPending` — pill accept only. No `IntersectionObserver` anywhere, so it plays on render, not on coming into view; no glow on fresh load or above the waterline. Under `prefers-reduced-motion` `circlists.html` kills *both* (`.circ-arrive{animation:none}` and `.circ-arrive::after{animation:none;opacity:0}`) — the glow does not play. |
| A6 | Partial | Holds place when it finds nothing (no scroll, no re-render of the feed) — present. Carrying the member to arrivals is absent: no scroll or anchor logic; findings go behind the pill (A4). |
| A7 | Partial | The routed tab is untouched — present (`tab` is never written by the refresh). The dot lighting is absent: arrivals go into `pending`, `unseen` is never set. Probed on Read: `pending: 1`, `unseen: false`, no pill, no rail dot. |
| A8 | Present | The active-item click returns before `onClose()`; drawer verified still mounted after the gesture. A different circle calls `onSelect` then `onClose`. |
| A9 | Absent | `refreshSpace` only prepends; there is no removal or reconciliation path for items deleted by others. |
| A10 | **Contradicted** | Two announcements, not one, and neither word is "Refreshed": `CircleSignal` renders `role="status"` with "Refreshing" (busy) and "Up to date" (settled). The found-arrivals branch announces nothing at all. |
| B1 | Partial | A timer exists (`setInterval`, slow 20s / fast 7s) and is silent while it runs — but it is a Config staging aid, default `off`, and it *creates* arrivals rather than checking for them. |
| B2 | Partial | The one-signal split is implemented for Active: arrivals in the open circle → pill, elsewhere → `items` + `unseen` dot, dot stays dark for the circle you are in. The Read-tab clause is absent — verified an arrival while on Read is entirely invisible (`pending: 1`, `unseen: false`, no pill, no dot). |
| B3 | Present | `NewPill` = `MicroDot` + "New"; probed text `"New"`. The dot is boolean. |
| B4 | Present | `.circ-newpill` computed `position: sticky`, `top: 121px`. No auto-dismiss; it clears on accept, and `enterSpace` folds `pending` on leaving. |
| B5 | Partial | The click is the accept and the feed never inserts on its own — present. The age is *not* stamped at accept: `circNextDrop` sets `at: Date.now()` at landing, so an arrival accepted later reads older than it does at the moment of accept. |
| B6 | Present | An effect clears `unseen` once the feed renders (every entry path, including mount). Entry raises no pill — `pending` is only filled by arrivals. |
| B7 | Present | The activity timer filters `s.funded`; `seedSpaces` sets `unseen` only for `sp-book`. Dormant `TEST - Weekend Reads` carries no dot. |
| B8 | Present | `CircleSignal state="unseen"` renders a visually-hidden "Unseen links" inside the rail button, so the entry reads as carrying state. |
| B9 | Absent | `NewPill` is a plain `<button>` with no `role`/`aria-live`; probed with the pill up: zero live regions in the document. |
| C1 | Out of reach | The mark lives in `circ_state_v10` in `localStorage` — per browser by necessity. Not judgeable in a prototype. |
| C2 | Partial | The line is drawn from the stored `lastSeenAt` — present. Stamping on entry is absent by design: the mark is written on **leave** (`enterSpace`'s `leaving` branch), and the entry effect comments that `lastSeenAt` is deliberately untouched. A visit that ends in a reload never re-stamps. |
| C3 | Present | `FeedDivider` renders `role="separator"` with the label "Earlier"; no count, arrow or affordance. `FeedSeam` exists in `liveliness.jsx` but is not rendered anywhere. |
| C4 | Partial | The line holds: `divIdx` recomputes against an unchanged mark, and an accepted arrival verified as settling above it with the line in place. The mark is not stamped again mid-visit. |
| C5 | **Contradicted** | The line survives a browser reload. After `location.reload()` `.circ-fdiv` was still present, because `lastSeenAt` persists in `circ_state_v10` and nothing stamps on entry. There is no teardown clear. |
| C6 | Present | `circDividerIndex` returns −1 with fewer than 2 items, with nothing above the mark, or when the first index is 0; Read passes −1 explicitly; a freshly created circle has no items and no mark. |
| D1 | Present | `it.at` is when the link landed in the circle (`seed-data.jsx` comment and `circNextDrop`); nothing reads the linked page's own date. |
| D2 | Present | 11px / weight 500 / `--color-fg-3`, trailing the 14px / 600 attribution name, `flexShrink: 0`; `window.circWhen(item.at)` computed at render, never stored. |
| D3 | Present | `circWhen` matches the ladder rung for rung and floors throughout; `just now` under 5m; the years rung is uncapped (`Math.floor(days/365) + 'y'`). |
| D4 | Present | No date or clock formatting anywhere in `circWhen`; relative strings only. |
| D5 | Present | `at` is written once, at contribution. Refresh, accept and mark-as-read never touch it. |
| D6 | Present | `FeedCard` gets `showTime` on both tabs; probed on Read: `"1w"`. |
| D7 | Present | Recomputed on every render, so entry and refresh both refresh it; pill arrivals carry their own `at`, cards already on screen keep theirs. |
| E1 | Absent | No favicon-swap code exists (`grep` for `favicon`/`visibilitychange` in `app/` finds only card favicons). `circlists.html` links the five static brand icons only. |
| E2 | Absent | Nothing to be boolean about. |
| E3 | Absent | No `visibilitychange` / `focus` handler anywhere. |
| E4 | Absent | No title-prefix fallback; `document.title` probed as `"Circlists"` with a staged arrival present. |
| E5 | Absent | `tab-arrival-signal-pack/favicon-arrived.svg` exists, but it sits outside `brand/assets/`, is not referenced by any file, and no code consumes it. |
| E6 | Absent | No app-level arrival signal of any kind. |
| E7 | Present | The only check is the activity `setInterval`, which is not tied to visibility and keeps running when the tab is hidden. Real background-throttling behaviour is out of reach. |
| F — who asked | Partial | The app-noticed path is correct (signal, wait to be accepted, feed never moves). The member-asked path is not: the refresh routes its findings through the pill (A4). |
| F — gesture acknowledged | Present | Arriving to find nothing new announces nothing; the refresh gesture announces (though see A10 for the words). |
| F — calm posture | Present | No counts, badges, numbers or toasts anywhere; reaction traces render only on Read (`tab === 'read' ? <SwellDoor/>`), never on Active cards. |
| F — three gestures | Partial | Rail refresh and navigating are distinct and behave differently. Browser reload does not clear the waterline (C5), so the third gesture is not its own behaviour. |
| F — aliveness not currency | Partial | The timed check is unhurried and off by default; but the rail refresh cannot find anything in this build (`queued` is never populated), so it is not yet the tool for being current. |

## Contradicted, in full

**A3 — the rail item carries a hint.** The active entry renders `title={'Refresh ' + s.name}`, verified
in the DOM as `title="Refresh Tuesday Book Club"`. That is a hover tooltip and an accessible
description on exactly the item the requirement says gains nothing. Everything else in A3 holds: one
slot, three exclusive states, no icon, no distinct cursor.

**A4 — the refresh raises a pill instead of landing.** `refreshSpace` moves `sp.queued` into
`sp.pending`, and `pending` is what renders `NewPill`. So a refresh that found something would ask
for a second click before anything landed — the member asked, and the app still waits to be accepted.
Compounding it, `queued` is `[]` in the seed and no code path ever writes to it, so in the build as
shipped the refresh can only ever take the "found nothing" branch; the found-something behaviour is
unreachable and untested.

**A5 — one trigger, and reduced motion kills the wrong half.** Both treatments hang off the same
`arrived` id list, set only in `revealPending`. There is no `IntersectionObserver` in the project, so
the glow plays when the card renders, not when it comes into view, and it never plays on a fresh load
or on cards above the waterline. Under `prefers-reduced-motion` the CSS disables the rise *and* sets
`.circ-arrive::after { animation: none; opacity: 0 }` — the glow is removed too, leaving a
reduced-motion reader with no newness treatment at all, which is the inverse of what the requirement
asks for.

**A10 — two words, neither of them "Refreshed".** `CircleSignal` announces "Refreshing" while busy
and "Up to date" when it settles, both via `role="status"`. The requirement wants one polite
"Refreshed" on both outcomes; the prototype instead narrates the running state, and the
found-arrivals branch is silent.

**C5 — the waterline survives a reload.** `lastSeenAt` is persisted in `circ_state_v10` and the mark
is only ever re-stamped on *leaving* a circle, so after `location.reload()` the divider was still
drawn in the same place (verified: `.circ-fdiv` present, same position, immediately after reload).
Nothing clears the line on teardown; it is a persisted position, not a per-visit one.

## Absent, in full

**A9 — no reconciliation.** `refreshSpace` prepends and nothing else. An item another member deleted
stays in the feed forever; the only deletion path is the local `deleteItem`.

**B9 — the pill is silent.** `NewPill` is a bare `<button>`. With the pill on screen the document
contains no live region at all, so a screen-reader user gets no indication that arrivals are waiting
until they happen upon the control.

**E1–E6 — the tab signal does not exist.** There is no favicon swap, no title prefix, no
focus/visibility handling, and nothing app-level that aggregates arrivals across circles.
`tab-arrival-signal-pack/` holds a resting and an arrived favicon plus a handoff note, unreferenced by
any file and not in `brand/assets/`; `circlists.html` links only the five static brand icons. The work
exists as a pack, not as behaviour.

## Conflicts between requirements

**B5 against D5 and D7.** B5 says the accept click "is when their age updates". D5 says age counts
from contribution alone — never from a refresh, an arrival, or a read — and D7 says pill arrivals
render with their own true ages. A card that lands at 14:00 and is accepted at 14:40 cannot read both
`just now` (B5) and `40m` (D5/D7). The prototype implements D5/D7. B5 is the odd one out and I read it
as loose wording for "the arrivals appear, carrying their ages" rather than a restamp.

**A4 against A5's motion clause.** A5 gives the upward settle exactly one trigger: accepting the pill.
A4 says a rail refresh lands arrivals directly, with no pill. So arrivals found by a refresh land with
no motion and — since they render rather than scroll into view — potentially no glow either. The set
gives the deliberate gesture the least feedback of any arrival path.

**A2 against A1's "however fast the fetch returns".** If the rail slot is the only loading treatment
on the route, then a refresh started from the rail and a *navigation* to a different circle need
different loading treatments, but the member's gesture is one click on either. The prototype resolves
it by branching on `active`; the set never says what the rail slot does when the fetch is slow enough
that the feed would normally show its own indicator.

## Cases nothing above owns

**Leaving a circle with arrivals still behind the pill.** The prototype folds `pending` into `items`,
sets `unseen: true`, and rewrites `lastSeenAt` to just *below* the oldest of them, so they read as new
next visit. Nothing in the set covers this: B4 says the pill waits until accepted or made moot by "an
entry", but not what happens to the arrivals themselves on exit.

**An arrival in the open circle while the member is on Read.** B2 covers the *check* case; A7 covers
the *refresh* case. Neither covers the timed check landing in the circle you are in while you sit on
Read — today it goes into `pending`, the pill is not rendered (Active only), and no dot lights, so the
arrival is invisible until the member switches tab or leaves. Verified in the running prototype.

**A refresh while a pill is already up.** `refreshSpace` prepends its findings onto the existing
`pending`. F says a deliberate refresh makes the pill moot; the set does not say whether the pill's
contents survive the gesture that was supposed to supersede it.

**The circle a member is in going dormant, or a circle joined mid-session.** B7 says a dormant circle
is never checked; nothing says what the dot or the waterline do at the moment of transition.

## Prototype behaviour no requirement explains

**The "Up to date" settle animation.** The nothing-found answer is a fully designed beat — the
spinner's own arc grows shut into the complete mark, rests, then fades (`circ-settle`, plus the live
phase hand-off in `brand-motion.jsx`), with a `role="status"` "Up to date". The set only asks for a
polite "Refreshed" on both outcomes. This is a settled decision that never made it into a ticket: it
is documented as a rule in `liveliness.jsx`'s header and in the two liveliness handoffs, and it is too
specific and too deliberate to be drift.

**The Config → Liveliness staging block.** Background activity off/slow/fast plus "stage an arrival
here / elsewhere". Deliberate scaffolding for a silent grammar, correctly quarantined in a deletable
aid — not drift, but it is also the *only* timer in the build, which is why B1 reads as partial.

**`FeedSeam`.** Exported from `liveliness.jsx`, styled in `circlists.html` (`.circ-fseam`), rendered
nowhere. C3 explicitly forbids a rule closing off the items below the line, so this is drift left over
from an earlier divider design — dead code that contradicts the current requirement if it is ever
mounted.

**Re-marking on leave.** `lastSeenAt` being written on exit rather than entry (C2) is a real design
decision with a documented rationale, but no requirement states it, and it is what makes C5 fail.

## The one thing I would push back on

**A4 — "arrivals the refresh finds land directly, no pill is raised."** In the prototype's evidence
this is the requirement I would argue with, not the build. The refresh gesture happens in the *rail*,
which on desktop sits beside a feed the member may have scrolled deep into, and below 1024px happens
with a drawer covering the feed entirely. Landing items directly means the feed silently grows above
the member's viewport while their attention is on a drawer — exactly the "moves under them uninvited"
failure F exists to prevent, arrived at by a different route. A4 then needs A6's "carries the member
to the arrivals" to make the change visible, which means the deliberate refresh gesture becomes the
one arrival path that both mutates the feed *and* moves the scroll position. The prototype's answer —
surface findings through the same pill, let the click do the moving — costs one extra click and keeps
one grammar for "content enters the feed". I would keep the pill and drop A4.
