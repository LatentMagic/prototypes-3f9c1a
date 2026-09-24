// ============================================================================
// Circlists — Watching (LM-786, the Watching filter).
//
//   circIsWatchingDone(item)      — the predicate: watching AND done. Nothing else.
//   circHasWatching(items)        — does this list hold at least one such card?
//   circFilterWatching(items, on) — the view-only narrowing. Never mutates.
//
// Built on feed-saved.jsx's pattern, and a deletable aid in the same idiom:
// absent, main.jsx's `window.circFilterWatching` guard falls through, the row
// never appears in the lens panel, and History behaves as it did before.
//
// `item.read` is part of the predicate on purpose (glossary "Watching"): a
// member's own unread share is recorded as watching the moment it is added,
// but watching is only visible to the member once the card is done — so it
// never shows here, even with "Include cards in Active" on.
// ============================================================================

const circIsWatchingDone = (it) => !!(it && it.watching && it.read);
const circHasWatching = (items) => (items || []).some(circIsWatchingDone);
const circFilterWatching = (items, on) => (on ? (items || []).filter(circIsWatchingDone) : (items || []));

Object.assign(window, { circIsWatchingDone, circHasWatching, circFilterWatching });
