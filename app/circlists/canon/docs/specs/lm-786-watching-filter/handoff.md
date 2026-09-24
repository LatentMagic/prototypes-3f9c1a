# LM-786 — Watching filter: handoff (2026-09-24)

## What was built, and where
- `app/feed-watching.jsx` (new, deletable aid, loaded after `feed-saved.jsx` in `circlists.html`): `circIsWatchingDone` (`item.watching && item.read`, nothing else), `circHasWatching`, `circFilterWatching`.
- `app/primitives.jsx`: `bell` and `bell-filled` icons, same two-entry form as `bookmark`/`bookmark-filled`. The filled bell fills the body; the clapper stays a stroke.
- `app/feed-lens.jsx`:
  - `LensFilterFace` takes an `icon` prop (Saved's default is unchanged).
  - `LensFilterList` renders the Watching row after Saved and before the people (`watching`/`onWatching`/`showWatching`).
  - `FeedLens` takes `watching`/`onWatching`. The row shows only when `onWatching` is passed. `watching` lights the trigger and adds ", watching only" to the trigger's accessible name.
  - `LensChips` adds the Watching chip after Saved's.
  - `FeedNoMatch` has a new watching branch.
- `app/main.jsx`:
  - `watchingOn` is held per circle as visit state, like `savedOn`.
  - `effectiveWatchingOn`, `showWatchingLens` and `setWatchingFilter` sit beside Saved's equivalents.
  - The Watching filter is applied after Saved and before search.
  - Returns bar condition is now `!(lensActive || effectiveSavedOn || effectiveWatchingOn || searchActive)`, with no other change.
- `app/states.jsx`: every reseed/stage clears `watchingOn` the same way it clears `savedOn`.

## Yours-to-decide choices
- **Chip:** "Watching", with the filled bell. Its clear button's label is "Showing cards you're watching. Show all cards", which mirrors Saved's.
- **Announcements:** "Showing cards you're watching" when applied, "Showing all cards" when cleared.
- **No-match copy** (watching branch only; every pre-existing combination is untouched):
  - Watching alone: "Nothing here you're watching" / "Cards you watch show here once you've finished them." / "Show everything" (neutral, like Saved alone).
  - Watching with one other person: "Nothing you're watching from Sam R." / "You aren't watching anything they added that you've finished."
  - Watching with only You: the same headline / "You aren't watching anything you added that you've finished."
  - Watching with You and others: headline only. Every candidate line was untrue or awkward, and the rule is that a missing line beats a false one.
  - Watching + saved: "Nothing saved that you're watching" / "None of your saved cards are ones you're watching."
  - Watching + saved + people: headline only, for the same reason.
  - Any of these with a query: "Nothing [saved that ]you're watching[ from X] matches "q"", plus the existing search line.
  - **Escape:** whenever Watching is combined with anything else, one accent "Show everything" clears everything (run 8's ruling 7). The search > contributor > saved precedence is therefore never consulted when Watching is on.
- **Mock data:** no seed change was needed. `talk-data.jsx` already covers every case:
  - Backend Pod has five cards that are both watched and done, plus unwatched done cards.
  - Watching + Sam R. produces the no-match state.
  - The Pragmatic Engineer card is your own unread, watched share. It proves the exclusion when "Include cards in Active" is on.
  - The third seeded circle has no card that qualifies, so the Watching row is absent there.

## Unresolved / next
- No-match copy ratified by the user (2026-09-24), as listed above. CHANGELOG entry added.
- The Watching chip's descender clip was fixed in `ChipLabel` (lineHeight 1.3) — affects every chip.
- No playground was built.
