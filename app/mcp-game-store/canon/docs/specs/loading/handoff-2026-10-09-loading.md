# Handoff 2026-10-09: loading on pages and parts

## Built
- Pages: `GsArrival` in `app/main.jsx` wraps every screen. On arrival at Discover, Library, History (also filtered), product pages, library game pages (and a case/scene/day), a session, the Pass and Account it shows a spinner in the content region, then the screen. Top bar and footer stay.
- Parts: `useGsPart(deps)` and `GsPart` in `app/gs-site.jsx`. Used for Discover's All games wall (search, chips), the Library list (search, Kind, Order) and History results (Order, Plays, Show, page). Only that region swaps; the controls stay.
- Try again: `GsLoadFailed` now shows the spinner on the button (`useGsBusy`), ignores a second press, and runs the retry with the result. The Can't connect screen uses it too and goes to Discover afterwards, which loads as a page.
- One duration: `GS_LOAD_MS = 1200` (`gs-site.jsx`), same as Discover's existing in-place wait.

## Staged states (Site group, all held)
Pages: `loading-page-discover`, `-library`, `-history`, `-history-game`, `-product`, `-product-signed-out`, `-library-game`, `-library-case`, `-session`, `-pass`, `-account`. Parts: `loading-part-discover-games`, `-library-list`, `-history-results`. Mechanism: route param `hold: 'page' | 'part'`. QA entry `loading-pages-and-parts` in `app/qa.jsx`. No Config row: nothing is switched; every wait is reached by clicking. Discover's three existing states are untouched (`route.load` skips the page wait).

## Decisions (yours to ratify)
- Look: the design system's own Loader, centred in the content region, min height 60vh for pages and 320px for parts; shown after the existing 300 ms withhold.
- Duration 1200 ms: long enough to see, short of dragging.
- Back does not repeat the wait: the page was already loaded.
- A page wait does not keep the heading: headings live inside each screen, and product pages have none, so the content region is uniform.

## Unresolved
- Not verified in a browser at phone width. A held part state clears only by leaving it. Clicking the same nav link again reloads the page.
- Next: confirm the 1.2 s and the spinner-only look.
