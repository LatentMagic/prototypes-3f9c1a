// ============================================================================
// Circlists — Feed sort (BIZ-136, candidate build. NOT ratified.)
//
//   circSortItems(items, order)  — the view-only reorder. Never mutates.
//
// THE CONTROL LIVES IN feed-lens.jsx, NOT HERE. Run 1 shipped a standalone
// "Newest first" menu button in the tab bar; run 2 folded it into one lens
// control alongside the contributor filter, so this file is now the sort
// engine alone and the picking UI is the lens's. The reasoning for folding is
// in feed-lens.jsx's own header.
//
// Two orders and no more: newest first (the product's contract) and oldest
// first. Title and source were considered and cut — both rest on extraction
// that can fail, and a sort property whose data is not guaranteed is cut rather
// than shipped with an empty state. Contributor was cut on value, not
// availability. The reasoning is in the run's rulings file, not repeated here.
//
// THE SORT IS A VIEW. Stored order is never touched, because the divider maths,
// the pill's accept and the seeding all read stored order and would drift the
// moment a sort rewrote it.
// ============================================================================

const CIRC_SORT_DEFAULT = 'newest';

// The sort control appears only from this many items up. A one-item list reads
// identically under either order, so the control could do nothing — the same
// instinct as the waterline's own "both sides or nothing" rule.
const CIRC_SORT_MIN_ITEMS = 2;

const CIRC_SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
];

const circSortLabel = (order) => {
  const o = CIRC_SORT_OPTIONS.find((x) => x.id === order);
  return (o || CIRC_SORT_OPTIONS[0]).label;
};

// Stable, and a copy — callers pass the rendered list straight to .map().
// An item with no `at` sorts as oldest (epoch). Defensive only: every real path
// stamps one. Ties keep stored order, which is what makes this stable.
const circSortItems = (items, order) => {
  const list = (items || []).map((it, i) => ({ it, i }));
  const dir = order === 'oldest' ? 1 : -1;
  list.sort((a, b) => {
    const at = (a.it && a.it.at) || 0;
    const bt = (b.it && b.it.at) || 0;
    if (at !== bt) return (at - bt) * dir;
    return a.i - b.i;
  });
  return list.map((x) => x.it);
};

Object.assign(window, {
  circSortItems, circSortLabel,
  CIRC_SORT_DEFAULT, CIRC_SORT_MIN_ITEMS, CIRC_SORT_OPTIONS,
});
