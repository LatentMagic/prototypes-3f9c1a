// ============================================================================
// Circlists — Saved (BIZ-136, candidate build. NOT ratified.)
//
//   circHasSaved(items)        — does this list hold at least one saved link?
//   circFilterSaved(items, on) — the view-only narrowing to saved links. Never
//                                 mutates, same contract as feed-sort.jsx and
//                                 feed-lens.jsx's own view functions.
//   SavedToggle                — the bar control, Read tab only.
//   SavedNoMatch                — the empty case: filter on, nothing matches.
//
// A DELETABLE AID, in this app's own idiom (see feed-sort.jsx / feed-lens.jsx's
// own headers): absent, main.jsx's `window.circFilterSaved` / `window.SavedToggle`
// guards all fall through and the Read tab behaves exactly as it did before
// this file existed — no toggle, no chip, no filter.
//
// THE MARK LIVES ON THE CARD (feed.jsx's bookmark toggle in FeedCard's action
// cluster) and is READ-ONLY chrome. This file is the RETRIEVAL half: the
// control that narrows Read to what was kept, and the words for when nothing
// was. Saving is available on READ cards only — never Active — a ruled
// product decision, not an oversight, so nothing here offers a way to reach
// the filter from Active.
//
// THE PRESENCE RULE is main.jsx's, not this file's: the toggle is handed to
// `Tabs`' `right` slot only when the circle actually holds a saved link, or
// the filter is already on (so unsaving your last link while filtered can't
// strand the member with no way back). That rule needs `tab` and `loadingFeed`,
// which this file doesn't carry, so it lives at the render site.
// ============================================================================

// Whole-circle, not view-scoped — the presence rule above reads this against
// every read item regardless of what the lens currently narrows to, same as
// "the circle holds ≥1 saved link" is a fact about the circle, not the screen.
const circHasSaved = (items) => (items || []).some((it) => !!it.saved);

// A view, exactly as circSortItems / circFilterItems are: stored membership
// and the saved flag itself are never touched here, only what's rendered.
const circFilterSaved = (items, on) => (on ? (items || []).filter((it) => !!it.saved) : (items || []));

// ---- The toggle -------------------------------------------------------------
// Bookmark glyph, 44x44, in the same 48px tab bar the lens trigger occupies.
//
// NO UNDERLINE, and that is a correction. It first took the 2px accent bottom
// border the Active/Read tabs and the lens trigger use, on the reasoning that a
// control living in the tab bar should speak the tab bar's language. The design
// review measured what that actually produced and it was wrong three ways: the
// bar then read as FOUR tabs with TWO selected, which a tab strip cannot mean;
// with both toggles lit the two 2px runs abutted into ONE continuous 88px bar,
// so two independent booleans rendered as a single wide state; and the run sat
// 1px off the real tab's, same colour and thickness, close enough to read as
// the same device and off enough to look like a fault.
//
// The underline is the SELECTED-TAB signifier and it stays the tab row's. This
// control says "on" by filling its own glyph — a form change, so the state
// never rides on colour alone — and the `Saved` chip beneath the bar says it in
// words. Two channels, neither borrowed from the tabs.
const SavedToggle = ({ on, onToggle }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', alignSelf: 'stretch',
    // Separation from the lens trigger. Two unlabelled 44px targets abutting at
    // 0px is a mis-tap design, and the two outcomes are not similar enough for a
    // mis-tap to be cheap — one silently re-filters the list, the other opens a
    // panel over it. Taken from the bar's own trailing margin, not from either target.
    marginRight: 8,
  }}>
    <button
      type="button"
      onClick={() => onToggle(!on)}
      aria-pressed={on}
      aria-label="Saved links"
      title="Saved links"
      className="circ-lens-trigger"
      style={{
        background: 'transparent', border: 0, cursor: 'pointer', padding: 0,
        height: 'var(--tap-target-min)', width: 'var(--tap-target-min)', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: on ? 'var(--color-accent)' : 'var(--color-fg-2)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <Icon name={on ? 'bookmark-filled' : 'bookmark'} size={19} />
    </button>
  </div>
);

// ---- Nothing saved, under the filter ----------------------------------------
// The filter's own zero-match register, built to LensNoMatch's shape and
// register (feed-lens.jsx) so the two read as siblings: one calm centred
// typographic block, no illustration, names what's on, offers the way out.
// One line, sentence case, no exclamation.
const SavedNoMatch = ({ onClear }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '56px 24px', gap: 6,
  }}>
    <p style={{
      margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
      fontWeight: 600, color: 'var(--color-fg-1)',
    }}>No saved links here</p>
    <p style={{
      margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
      color: 'var(--color-fg-2)', maxWidth: 320, lineHeight: 1.5,
    }}>Nothing in this circle is saved.</p>
    {/* NOT accent. Clearing a filter is a recovery action, not a primary one,
        and accent is reserved for primary actions — on an otherwise empty frame
        a green label was the loudest thing on screen, which inverts the calm
        register this state exists to hold. The outline carries the affordance. */}
    <button type="button" onClick={onClear} style={{
      marginTop: 10, background: 'transparent', cursor: 'pointer',
      border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600,
      color: 'var(--color-fg-1)', minHeight: 'var(--tap-target-min)', padding: '0 16px',
    }}>Show all read links</button>
  </div>
);

Object.assign(window, { circHasSaved, circFilterSaved, SavedToggle, SavedNoMatch });
