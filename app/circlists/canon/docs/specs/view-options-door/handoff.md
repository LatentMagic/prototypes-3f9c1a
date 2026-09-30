# Handoff — View options door

## Changed
- `app/feed-lens.jsx`, `FeedLens`: `active` is now always `false`, so no accent underline and no accent icon/knob shift under any filter, Saved or Watching.
- Accessible name is always "View options" (state summary removed).
- File header comment: only the chip row says something is hidden.

## Untouched
Chips row, miss state, people list, Watching, "Include cards in Active". `circLensActive` still drives the chips.

## Not built
Nothing outstanding.

## Next
Tidy pass done: `active` removed from `FeedLens`, `CircLensIcon` is one fixed shape, stale "lit trigger" comments rewritten. Nothing further.
