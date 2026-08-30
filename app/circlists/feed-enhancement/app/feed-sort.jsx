// ============================================================================
// Circlists — Feed sort (BIZ-136, candidate build. NOT ratified.)
//
//   circSortItems(items, order)  — the view-only reorder. Never mutates.
//   SortControl                  — the menu button that picks the order.
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

// ---- The control -----------------------------------------------------------
// A menu button labelled with the CURRENT order, not with the action. A two-
// state toggle reading "Newest" is ambiguous between naming the state and
// naming what pressing it would do; label-shows-state plus a menu that picks is
// the established pattern, so it is followed rather than invented.
//
// Semantics per the WAI-ARIA menu-button pattern: aria-haspopup + aria-expanded
// on the trigger, role="menu" on the list, role="menuitemradio" + aria-checked
// on each option. Arrows move, Enter/Space picks, Escape closes and hands focus
// back to the trigger.
const SortControl = ({ order, onChange, open, onOpenChange }) => {
  const btnRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [active, setActive] = React.useState(0);

  const idx = Math.max(0, CIRC_SORT_OPTIONS.findIndex((o) => o.id === order));

  React.useEffect(() => {
    if (!open) return;
    setActive(idx);
    // Focus the menu itself and drive the options with aria-activedescendant, so
    // the roving focus never lands somewhere a re-render can lose it.
    const t = setTimeout(() => menuRef.current && menuRef.current.focus({ preventScroll: true }), 20);
    return () => clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      onOpenChange(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onOpenChange]);

  const close = (refocus) => {
    onOpenChange(false);
    if (refocus && btnRef.current) btnRef.current.focus({ preventScroll: true });
  };

  const pick = (id) => { onChange(id); close(true); };

  const onMenuKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault(); setActive((a) => (a + 1) % CIRC_SORT_OPTIONS.length); return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault(); setActive((a) => (a - 1 + CIRC_SORT_OPTIONS.length) % CIRC_SORT_OPTIONS.length); return;
    }
    if (e.key === 'Home') { e.preventDefault(); setActive(0); return; }
    if (e.key === 'End') { e.preventDefault(); setActive(CIRC_SORT_OPTIONS.length - 1); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(CIRC_SORT_OPTIONS[active].id); return; }
    if (e.key === 'Tab') close(false);
  };

  const onBtnKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); onOpenChange(true); }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        onKeyDown={onBtnKey}
        aria-haspopup="true"
        aria-expanded={open}
        // The name carries the state, so a screen reader hears the current order
        // without opening the menu.
        aria-label={'Sort order: ' + circSortLabel(order).toLowerCase()}
        style={{
          background: 'transparent', border: 0, padding: '0 6px 0 10px', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-sm)',
          color: 'var(--color-fg-2)', display: 'inline-flex', alignItems: 'center', gap: 4,
          // Fills the tab bar's own 48px height, so the target matches the tabs
          // beside it and the menu hangs from the bar's edge rather than from
          // somewhere inside it.
          minHeight: 48, alignSelf: 'stretch', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap',
        }}
      >
        <span>{circSortLabel(order)}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
          style={{ display: 'block', flexShrink: 0, transition: 'transform var(--duration-base) var(--ease-quiet)', transform: open ? 'rotate(180deg)' : 'none' }}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          tabIndex={-1}
          aria-label="Sort order"
          aria-activedescendant={'circ-sort-opt-' + CIRC_SORT_OPTIONS[active].id}
          onKeyDown={onMenuKey}
          style={{
            // Hangs from the bottom of the tab bar rather than breaking its
            // hairline: the trigger now fills the bar, so 100% IS the bar's edge.
            position: 'absolute', top: 'calc(100% + 1px)', right: 0, zIndex: 60, minWidth: 176,
            background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)',
            padding: 4, outline: 'none',
          }}
        >
          {CIRC_SORT_OPTIONS.map((o, i) => {
            const on = o.id === order;
            return (
              <div
                key={o.id}
                id={'circ-sort-opt-' + o.id}
                role="menuitemradio"
                aria-checked={on}
                onClick={() => pick(o.id)}
                onMouseEnter={() => setActive(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  // The app declares its own floor for a touch target; a menu
                  // row is one. Type matches the trigger, so the label does not
                  // change size as the menu opens and closes over it.
                  padding: '0 10px', minHeight: 'var(--tap-target-min)', borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
                  fontWeight: on ? 600 : 500,
                  color: on ? 'var(--color-accent)' : 'var(--color-fg-1)',
                  background: i === active ? 'var(--color-surface-sunken)' : 'transparent',
                }}
              >
                {/* The tick is the checked mark; the slot is held either way so
                    the two labels stay on one left edge. */}
                <span style={{ width: 16, flexShrink: 0, display: 'inline-flex' }} aria-hidden="true">
                  {on && <Icon name="check" size={16} />}
                </span>
                <span>{o.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  SortControl, circSortItems, circSortLabel,
  CIRC_SORT_DEFAULT, CIRC_SORT_MIN_ITEMS, CIRC_SORT_OPTIONS,
});
