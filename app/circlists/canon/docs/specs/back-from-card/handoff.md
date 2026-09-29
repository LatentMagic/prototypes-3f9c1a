# Handoff — Back from a card lands where the app lands it

## Changed (`app/main.jsx`, card-origin block)
- `goHome` clears `cardOrigin`; a `useEffect` on `currentId` clears it on any change of circle. A card opened from outside the feed now arrives with no origin.
- `returnFromCard` with no origin: reads the card id from `route`, picks `active` if `inActive(space, item)` else `read`, restores that tab's remembered scroll, and focuses the card root (not its Way-through mark).
- Feed-origin path unchanged.

## Not built
- Nothing outstanding. If the card was deleted while open, no-origin Back lands on History with no focus target.

## Next
- Walk the four acceptance paths in the live build; confirm focus ring on the card for both bare-Back cases.
