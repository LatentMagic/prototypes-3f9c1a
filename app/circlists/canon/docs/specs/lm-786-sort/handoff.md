# LM-786 sort — one order per circle, the New pill under oldest first

Handoff, 2026-09-25. Built against the delta instruction pasted into the canon session (written against prototypes d71f045).

## What was built, and where

- **The order is visit state.** `resetVisitView` (app/main.jsx) now clears `sortOrder` with the rest of the visit, so leaving the circle or reloading returns it to newest first. It was already held per circle, across both tabs. Filters, density and search are untouched.
- **The New pill under oldest first.** `NewPill` (app/liveliness.jsx) takes `order`. Under oldest first it reads "New · newest first" (label ratified by Joe, 2026-09-25), with accessible name "New cards, newest first". The words come from `circSortLabel('newest')`, lowercased, so they can't drift from the sort control. Under newest first it is unchanged.
- **The pill tap loads, in both orders** (ui.md Decision-29 as amended by Decision-31; ruled 2026-09-25). `revealPending` sets `pillPhase` to busy, and `NewPill` shows `BrandSpinner` in its face, with the box and accessible name held, for the simulated reload (`CIRC_ACCEPT_DELAY`, 700 ms). There is no minimum beat. On success `landPending` adds the arrivals with glow and rise, and the spent pill fades (`.circ-newpill-spent`, 520 ms linear, the receipt's closing curve). On failure (`CIRC_ACCEPT_FAIL`, staged) the pill silently returns to rest, the arrivals stay staged and the list is unchanged. A visit ending, or a sort-control change during the reload, is treated the same way.
  - Under newest first, the carry to the head happens at the click.
  - Under oldest first, the list stays up, and the order switches only once the cards land: `switchToNewestTop` sets newest, runs `resetOrderPlace` and scrolls to the top, with no list spinner. A failed tap leaves the circle oldest first. The spent face keeps its "New · newest first" words while it fades (`pillOrderRef`).
  - Decision-56's empty-Active self-land still lands at once, with no pill and no load.
- **Rail refresh under oldest first** (ruled 2026-09-25, replacing the same day's "refresh switches to newest first"). `refreshSpace` never changes the order, on either tab. What it finds (`queued` plus anything already pending) goes into `pending`, behind the New pill, and the member stays where they are. Pending cards are never in `items`, so they stay out of History even with "Include cards in Active" on. The pill tap is the only switch to newest first. The announcement is "Refreshed" alone: `suppressPendAnnounce` stops the "New cards" announcement firing for the same gesture. Under newest first, refresh is unchanged.
- **Order-change load** (ruled 2026-09-25). A sort-control order change, and nothing else, sets `orderLoad[circle] = 'loading'` (`startOrderLoad`, main.jsx). The list region shows `FeedLoading` for `CIRC_PAGE_DELAY`, then opens at its start. The rail, bar, tabs and chips are untouched. `'failed'` renders `FeedError`, and Try again re-runs the load. It is voided by `visitGen` (a later order change or a new visit). A rail refresh never blanks the list.
- **Announcement.** "New links" is now "New cards" (pending-count effect, main.jsx).
- **Cut-off.** Checked and left as it was. Arrivals wait in `pending`/`queued`, and only `revealPending` or `refreshSpace` moves them into `items`. Paging slices `visible`, which is built from `items`, so a page load can't pull in an arrival.
- **Order change (lean 1).** `setOrder` (render site) calls `resetOrderPlace` and scrolls to the top when the order actually changes.
- **Far-end words (lean 2).** `FeedPageFoot` (app/feed-history.jsx) takes `newestFirst` and says "Couldn’t load newer cards." under oldest first. `HistoryEnd` was already correct.
- **Superseded 11 Sep comments** (carry to the foot, pill leaves the order alone) are rewritten in main.jsx and states.jsx.

## Staged states (app/states.jsx, "The feed")

All of these use `stagePile`: a new circle, `sp-pile` "Field Notes", with 26 cards (four pages of eight) under oldest first.

- `?state=sort-oldest-accept` — id kept; label and comment replaced. Active, part-way down (two pages loaded, scrolled to the middle), with two arrivals behind "New · newest first".
- `?state=sort-oldest-arriving` — the same position. Two cards arrive after 4 s; one more is queued for a rail refresh (tap Field Notes in the rail).
- `?state=feed-newer-failed` — Active, first page loaded, next page failed.
- `?state=sort-oldest-refresh-active` — Active, oldest first, part-way down. The rail refresh runs itself 1.2 s in and finds two cards. They wait behind New; the order and position are unchanged.
- `?state=sort-oldest-refresh-history` — History, oldest first (the older half of the pile is done). The same refresh runs; the cards wait behind New on Active and the circle's live-signal dot lights.
- `?state=pill-tap-failed-newest` — `sp-book`, newest first, two arrivals behind New. Every tap fails: the spinner runs in the pill, then it returns to rest.
- `?state=pill-tap-failed-oldest` — the pile, oldest first, two arrivals. Every tap fails, and the circle stays oldest first.
- `?state=sort-control-loading` — the sort control has just switched to newest first, and the list region holds the spinner.
- `?state=sort-order-failed` — the same switch, but the first page failed: FeedError with Try again.
- `?state=history-oldest-end` — History, every card read. It opens with three of four pages loaded, near the foot. Scrolling on loads the last page, which ends "Nothing newer in the circle" (ruled 2026-09-25, replacing "Up to now"). (The first version preloaded everything, so no page was ever fetched.)

`stageSort` now re-applies its order 40 ms after entry, because entry clears it. This keeps `sort-oldest-waterline` and `feed-load-error-lens` on oldest first.

## Leans, as built

1. Every order change opens the list at its start on both tabs. No place is remembered.
2. The end words follow the order: "Nothing newer in the circle" (ruled 2026-09-25, replacing "Up to now") and "Couldn’t load newer cards." under oldest first.

## Yours-to-decide calls

- **Empty refresh under oldest first:** changes nothing (no order switch, no scroll). This follows canon's no-carry-on-empty rule.
- **Refresh under oldest first, either tab:** ruled by Joe, 2026-09-25. New cards wait behind the pill and the order is unchanged. This supersedes both my first default and the interim "switch on either tab" ruling.
- **Screen reader after the tap:** one announcement, "Sorted newest first", which is the sort control's own. The refresh keeps "Refreshed" alone, so it stays one announcement per gesture.
- **Two-part label:** "· newest first" is set at regular weight, against 600 for "New". It is quieter by weight only, in the same colour, with `white-space: nowrap`, so it stays on one line at 375px.
- **Additional call (not listed):** Decision-56's empty-Active self-land (`revealPending({ auto: true })`) never switches the order, because the member made no gesture.

## Unresolved / next


- `CHANGELOG.md` is not edited: whether this counts as a significant step is Joe's call.
