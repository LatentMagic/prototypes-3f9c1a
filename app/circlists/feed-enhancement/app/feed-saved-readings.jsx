// ============================================================================
// Circlists — Saved, two alternative readings (BIZ-136 run 7, candidate build.
// NOT ratified. Ships side by side with today's shape for the owner to
// compare on his phone — see this app's own CLAUDE.md, "candidate-build".)
//
//   CIRC_SAVED_LENS_OPTIONS  — Reading A's two-option data: All read / Saved only.
//   CIRC_SAVED_LENS_CAPTION  — Reading A's one-line "only you" caption.
//   SavedTabEmptyState       — Reading B's own empty state (nothing saved yet).
//
// THE QUESTION THIS FILE ANSWERS. Today saved is a bookmark toggle sitting
// directly on the tab bar — a third door beside the lens popover and the
// search magnifier, for one narrowing among several. The owner's objection:
// "save is a filter and filter is a filter… they are reached from separate
// places." Two readings, staged only, behind `savedMode` (app/states.jsx):
//
//   'lens'    — saved joins Order/View/Added by as a fourth group in the ONE
//               lens popover. Still a narrowing; now reached from the one door
//               the others already share.
//   'surface' — saved becomes a third TAB (Active/Read/Saved), always present.
//               Not a narrowing any more — a destination, like Active or Read.
//
// Both leave the shipped 'bar' behaviour as the default, untouched.
//
// A DELETABLE AID, same idiom as feed-saved.jsx / feed-lens.jsx: delete this
// file and every guard that reads it — feed-lens.jsx's `showSavedGroup`,
// main.jsx's Saved-tab-empty branch and its third-tab gate — goes false, so
// the panel and the tab bar fall back to exactly what they render today. A
// stale `savedMode` of 'lens' or 'surface' left over from a `?state=` link
// degrades quietly: no fourth group, no third tab, no throw.
//
// WHY THE CAPTION IS ONE LINE, NOT A BADGE. Order, View and Added by each
// narrow by a fact the WHOLE CIRCLE shares — everyone can see the order
// applied, and everyone could in principle set the same contributor filter on
// their own screen and mean the same thing. Saved does not: it narrows by a
// fact only THIS MEMBER holds, invisible to the rest of the circle. That is
// the strongest argument against folding saved into the lens at all, so
// Reading A has to carry it rather than let the fourth group read as a plain
// fifth option among equals. One quiet line under the group's own label —
// `--text-sm`, `--color-fg-2`, sentence case — says it without inventing a
// new visual device (no badge, no icon, no divider rule, no accent) this
// build has no licence to add.
//
// WHY THE EMPTY TAB TEACHES RATHER THAN APOLOGISES. A tab that is always
// present, even for a member who has saved nothing, is what makes Reading B a
// SURFACE rather than a filter — an empty Active or Read tab is the same
// deal, and neither one says "nothing here, sorry." So this empty state names
// what saving is and how it's done (from a Read card), not that the list is
// currently zero. No button: there is nothing to DO from this screen, since
// saving only ever happens on a card in Read, never here.
// ============================================================================

const CIRC_SAVED_LENS_OPTIONS = [
  { id: 'all', label: 'All read' },
  { id: 'only', label: 'Saved only' },
];

const CIRC_SAVED_LENS_CAPTION = 'Only you can see what you have saved.';

// ---- Reading B's own empty state --------------------------------------------
// Built to EmptyState's own shape (feed.jsx) so it reads as a sibling of the
// app's other empty-tab states, not a one-off: centred typographic block, no
// illustration, sentence case, no exclamation. Deliberately WITHOUT the
// door-link EmptyState carries — there is no action to offer from here.
const SavedTabEmptyState = () => (
  <div style={{
    textAlign: 'center', minHeight: 320, padding: '72px 24px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    gap: 28,
  }}>
    <h2 style={{
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)',
      lineHeight: 1.2, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: 0,
    }}>Nothing saved yet.</h2>
    <p style={{
      fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.5,
      color: 'var(--color-fg-2)', margin: 0, maxWidth: 420,
    }}>Save a link from Read and it lands here.</p>
  </div>
);

Object.assign(window, { CIRC_SAVED_LENS_OPTIONS, CIRC_SAVED_LENS_CAPTION, SavedTabEmptyState });
