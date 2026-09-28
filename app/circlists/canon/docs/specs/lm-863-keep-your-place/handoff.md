# LM-863 keep your place — handoff

Grounded in monorepo `specs/projects/circlists/ui.md` Decision-74 and Decision-75 (read live 2026-09-28).

## 1. Back from a card page — built (Decision-75)
`app/main.jsx`, beside `returnToSpace`:
- `routeToCard` wraps `setRoute` in `candApi`. Opening a `card:<id>` route from a circle records the circle, the tab, the feed's scroll and the drawn card order in `cardOrigin`.
- `returnFromCard` is handed to the card page as `api.returnToSpace`; `talk-main.jsx` is unchanged. It restores the tab and scroll, not scrolled to the card, then moves focus:
  - If the card is still in the list, focus goes to its Way-through mark (`.circ-waythrough`, added in `talk-card.jsx`), or to the card where it carries no mark.
  - If the card was read away on Active, focus goes to the card that took its place. If it was the last card, focus goes to the card above it (ratified by the user, 2026-09-28). If none remain, focus goes to the empty Active tab's content (`[data-empty-state]`, focusable at -1, in `feed.jsx`).
  - The feed then moves only as far as it takes to show the focus target whole.
- With no origin, as after a direct address or a circle change, back lands on History.

## 2. The waterline across a tab dip — already in canon (Decision-74)
I found nothing to build. `switchTab` only sets `tab` and saves scroll. `dividerAt` is set only on circle entry, and `resetVisitView` runs on a `currentId` change. A rail refresh made from History lands the arrivals in `items` after the frozen line, so they meet the member above it on return to Active, with no New pill.

## Also covered
- Returns-bar row: it opens through the same `goToCard` → `routeToCard`, so back lands on the tab it was pressed on.
- Notifications ask: `pushAskMet` (visit-scoped, in `main.jsx`) latches once the ask has shown on Active. `CircPushAsk` takes `atRest` at mount and skips its entry animation, so a return does not move the place.
