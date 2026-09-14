// ============================================================================
// Circlists — Saved as a lens group (BIZ-136 run 7, "Reading A". Ratified run
// 9 — the owner picked it from a side-by-side against the shipped bookmark-
// on-the-bar and a third-tab reading; both alternatives, and the `savedMode`
// switch that staged them, are gone (dead-stager cleanup, 2026-09-14).)
//
//   CIRC_SAVED_LENS_OPTIONS  — the lens group's two-option data: Everything / Saved.
//   CIRC_SAVED_LENS_CAPTION  — the group's one-line "only you" caption.
//
// THE QUESTION THIS FILE ANSWERED. Saved used to be a bookmark toggle sitting
// directly on the tab bar — a third door beside the lens popover and the
// search magnifier, for one narrowing among several. The owner's objection:
// "save is a filter and filter is a filter… they are reached from separate
// places." Saved now joins Order/View/Added by as a fourth group in the ONE
// lens popover — still a narrowing, reached from the one door the others
// already share.
//
// A DELETABLE AID, same idiom as feed-saved.jsx / feed-lens.jsx: delete this
// file and feed-lens.jsx's `showSavedGroup` goes false, so the panel falls
// back to two bare groups with no fourth, no throw.
//
// WHY THE CAPTION IS ONE LINE, NOT A BADGE. Order, View and Added by each
// narrow by a fact the WHOLE CIRCLE shares — everyone can see the order
// applied, and everyone could in principle set the same contributor filter on
// their own screen and mean the same thing. Saved does not: it narrows by a
// fact only THIS MEMBER holds, invisible to the rest of the circle. That is
// the strongest argument against folding saved into the lens at all, so this
// group has to carry it rather than read as a plain fifth option among
// equals. One quiet line under the group's own label — `--text-sm`,
// `--color-fg-2`, sentence case — says it without inventing a new visual
// device (no badge, no icon, no divider rule, no accent) this build has no
// licence to add.
// ============================================================================

// COPY, settled in run 9's elegance pass — the owner named the copy twice as
// the thing wrong with this panel. Two changes, both about the panel reading as
// one object rather than four separately-worded ones.
//
// `All read` → `Everything`. The panel has two groups that CONCEAL, and they
// were wording the same idea — "nothing is narrowed" — two different ways:
// `Everyone` in Added by, `All read` here. Kindle's library filter is the
// referent: its groups are plain nouns and their un-narrowed states are worded
// alike, which is what lets several groups read as one control. `Everything`
// also drops a phrase the owner had already rejected in another surface, where
// it asserted a completion state ("all read") he does not believe in.
//
// `Saved only` → `Saved`. The adverb was doing the segmented control's own job:
// picking one segment already means "only this one", so the word said in copy
// what the selection says in form. Its sibling `Everyone` never needed one.
const CIRC_SAVED_LENS_OPTIONS = [
  { id: 'all', label: 'Everything' },
  { id: 'only', label: 'Saved' },
];

const CIRC_SAVED_LENS_CAPTION = 'Only you can see what you have saved.';

Object.assign(window, { CIRC_SAVED_LENS_OPTIONS, CIRC_SAVED_LENS_CAPTION });
