# LM-786 sort — one order per circle, the New pill under oldest first

Handoff, 2026-09-25. Built against the delta instruction pasted into the canon session (written against prototypes d71f045).

## What was built, and where

- **The order is visit state.** `resetVisitView` (app/main.jsx) now clears `sortOrder` with the rest of the visit, so leaving the circle or reloading returns it to newest first. It was already held per circle, across both tabs. Filters, density and search are untouched.
- **The New pill under oldest first.** `NewPill` (app/liveliness.jsx) takes `order`. Under oldest first it reads "New · newest first" (label ratified by Joe, 2026-09-25), with accessible name "New cards, newest first". The words come from `circSortLabel('newest')`, lowercased, so they can't drift from the sort control. Under newest first it is unchanged.
- **Pill tap under oldest first.** `revealPending` adds the arrivals (with the usual glow), then calls `switchToNewestTop`: this sets the circle's order to newest, runs `resetOrderPlace` (drops both tabs' pages, page status and scroll place, and voids in-flight fetches via `visitGen`), and scrolls to the top. Under newest first it adds the arrivals and scrolls to the top, as before.
- **Rail refresh under oldest first.** `refreshSpace`: when a refresh of this circle finds cards under oldest first, it runs the same `switchToNewestTop` on whichever tab the member is on (ruled 2026-09-25). An empty refresh changes nothing. The receipt and the "Refreshed" announcement are unchanged.
- **Announcement.** "New links" is now "New cards" (pending-count effect, main.jsx).
- **Cut-off.** Checked and left as it was. Arrivals wait in `pending`/`queued`, and only `revealPending` or `refreshSpace` moves them into `items`. Paging slices `visible`, which is built from `items`, so a page load can't pull in an arrival.
- **Order change (lean 1).** `setOrder` (render site) calls `resetOrderPlace` and scrolls to the top when the order actually changes.
- **Far-end words (lean 2).** `FeedPageFoot` (app/feed-history.jsx) takes `newestFirst` and says "Couldn’t load newer cards." under oldest first. `HistoryEnd` was already correct.
- **Superseded 11 Sep comments** (carry to the foot, pill leaves the order alone) are rewritten in main.jsx and states.jsx.

## Staged states (app/states.jsx, "The feed")

All four use `stagePile`: a new circle, `sp-pile` "Field Notes", with 26 cards (four pages of eight) under oldest first.

- `?state=sort-oldest-accept` — id kept; label and comment replaced. Active, part-way down (two pages loaded, scrolled to the middle), with two arrivals behind "New · newest first".
- `?state=sort-oldest-arriving` — the same position. Two cards arrive after 4 s; one more is queued for a rail refresh (tap Field Notes in the rail).
- `?state=feed-newer-failed` — Active, first page loaded, next page failed.
- `?state=history-oldest-end` — History, every card read. It opens with three of four pages loaded, near the foot. Scrolling on loads the last page, which ends "Nothing newer in the circle" (ruled 2026-09-25, replacing "Up to now"). (The first version preloaded everything, so no page was ever fetched.)

`stageSort` now re-applies its order 40 ms after entry, because entry clears it. This keeps `sort-oldest-waterline` and `feed-load-error-lens` on oldest first.

## Leans, as built

1. Every order change opens the list at its start on both tabs. No place is remembered.
2. The end words follow the order: "Nothing newer in the circle" (ruled 2026-09-25, replacing "Up to now") and "Couldn’t load newer cards." under oldest first.

## Yours-to-decide calls

- **Empty refresh under oldest first:** changes nothing (no order switch, no scroll). This follows canon's no-carry-on-empty rule.
- **Refresh from History under oldest first:** ruled by Joe, 2026-09-25. It switches to newest first, the same as from Active. This replaces my earlier default of leaving the order alone, which left the new cards at the foot of Active.
- **Screen reader after the tap:** one announcement, "Sorted newest first", which is the sort control's own. The refresh keeps "Refreshed" alone, so it stays one announcement per gesture.
- **Two-part label:** "· newest first" is set at regular weight, against 600 for "New". It is quieter by weight only, in the same colour, with `white-space: nowrap`, so it stays on one line at 375px.
- **Additional call (not listed):** Decision-56's empty-Active self-land (`revealPending({ auto: true })`) never switches the order, because the member made no gesture.

## Unresolved / next

- `CHANGELOG.md` is not edited: whether this counts as a significant step is Joe's call.
