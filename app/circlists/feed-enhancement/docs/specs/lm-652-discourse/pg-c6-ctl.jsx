// ============================================================================
// C6 — the four controls. Each draws the conversation's header row via
// window.CandOpening; the card's corner is a signal in all four (see wire).
//
// Every control here clears the floors the fold could not: the glyph's ink is
// --color-fg-3 (4.7:1 on white) or the accent (5.48:1), and the hit target is a
// full 44px, taken as inset padding with a matching negative margin so the row
// does not grow to hold it.
// ============================================================================

// The row itself: the label, a hairline across the space, whatever the option
// puts at the end of it.
const PGC6Row = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 20 }}>
    <CandEyebrow style={{ flexShrink: 0 }}>the conversation</CandEyebrow>
    <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
    {children}
  </div>
);

// 44px of target, no extra height in the row.
const pgc6Hit = { background: 'transparent', border: 0, cursor: 'pointer', display: 'inline-flex',
  alignItems: 'center', gap: 8, minHeight: 44, padding: '12px 8px', margin: '-12px -8px',
  borderRadius: 'var(--radius-sm)', flexShrink: 0 };

// ---- 1 · Glyph on the row --------------------------------------------------
const PGC6Glyph = ({ item, api }) => {
  const on = !!item.watching;
  return (
    <PGC6Row>
      <button type="button" className="cand-quiet" style={{ ...pgc6Hit, color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}
        aria-pressed={on} aria-label={on ? 'Watching this conversation' : 'Watch this conversation'}
        title={on ? 'Watching \u2014 turn the corner back down' : 'Watch this conversation'}
        onClick={() => candToggleWatch(api, item)}>
        <CandFoldGlyph size={17} filled={on} />
      </button>
    </PGC6Row>
  );
};

// ---- 2 · Glyph and word ----------------------------------------------------
const PGC6Word = ({ item, api }) => {
  const on = !!item.watching;
  return (
    <PGC6Row>
      <button type="button" className="cand-quiet" style={{ ...pgc6Hit, color: on ? 'var(--color-accent)' : 'var(--color-fg-3)',
        font: '500 12.5px/1 var(--font-sans)' }}
        aria-pressed={on} aria-label={on ? 'Watching this conversation' : 'Watch this conversation'}
        onClick={() => candToggleWatch(api, item)}>
        <CandFoldGlyph size={16} filled={on} />
        {on ? 'Watching' : 'Watch'}
      </button>
    </PGC6Row>
  );
};

// ---- 3 · Word and switch ---------------------------------------------------
// The app's own switch, mounted rather than redrawn.
const PGC6Switch = ({ item, api }) => {
  const on = !!item.watching;
  return (
    <PGC6Row>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexShrink: 0, margin: '-12px 0' }}>
        <span style={{ font: '500 12.5px/1 var(--font-sans)', color: on ? 'var(--color-fg-1)' : 'var(--color-fg-3)' }}>Watching</span>
        <CandSwitch on={on} onChange={() => candToggleWatch(api, item)} label="Watch this conversation" />
      </span>
    </PGC6Row>
  );
};

// ---- 4 · A line of its own -------------------------------------------------
// The control says what it will do rather than naming a state, so the row above
// it stays a label and nothing on it changes meaning under the press.
const PGC6Line = ({ item, api }) => {
  const on = !!item.watching;
  return (
    <React.Fragment>
      <PGC6Row />
      <button type="button" className="pgc6-line" aria-pressed={on}
        onClick={() => candToggleWatch(api, item)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44,
          padding: '10px 12px', margin: '-2px -12px 0', background: 'transparent', border: 0,
          borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
          color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>
        <CandFoldGlyph size={17} filled={on} />
        <span style={{ font: '400 13px/1.4 var(--font-sans)', color: on ? 'var(--color-fg-1)' : 'var(--color-fg-2)' }}>
          {on ? 'Watching this conversation' : 'Watch this conversation'}
        </span>
      </button>
    </React.Fragment>
  );
};

Object.assign(window, { PGC6Row, PGC6Glyph, PGC6Word, PGC6Switch, PGC6Line });
