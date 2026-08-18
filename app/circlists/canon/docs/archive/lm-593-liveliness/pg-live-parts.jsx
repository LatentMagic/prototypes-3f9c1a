// ============================================================================
// Liveliness playground — the candidate signals as components.
//   PglDot        — micro live-signal dot (brand MicroDot + hidden text)
//   PglDivider    — last-seen divider
//   PglPill       — reveal affordance ("New links")
//   PglRefresh    — manual refresh control (busy = the icon rotates)
//   PglLoading    — first-load state, feed region only
// The feed card itself is the shipped app/feed.jsx FeedCard, mounted as-is — the
// playground never draws its own card. Geometry for the rest is copied from the
// shipped app (app/shell.jsx rail + top bar + tabs) so this reads as the product.
// ============================================================================
const { Icon, MicroDot, BrandSpinner } = window;

// ---- Micro live-signal dot -------------------------------------------------
// Decorative: the SVG is aria-hidden, the meaning is carried by the hidden text.
const PglDot = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
    <span aria-hidden="true" style={{ display: 'inline-flex' }}><MicroDot size={10} /></span>
    <span className="pgl-vh">New activity</span>
  </span>
);

// ---- Last-seen divider — position, never a number -------------------------
const PglDivider = () => (
  <div className="pgl-div" role="separator" aria-label="New since your last visit">
    <span className="pgl-divrule" aria-hidden="true" />
    <span className="pgl-divlabel">New since your last visit</span>
    <span className="pgl-divrule" aria-hidden="true" />
  </div>
);

// ---- Reveal pill — text only; the click is what moves the feed ------------
// The micro dot leads: the same live-signal mark the rail uses, so "something
// landed" reads the same wherever it appears. Decorative — the pill's own label
// carries the meaning.
const PglPill = ({ leaving, onClick }) => (
  <button className={'pgl-pill' + (leaving ? ' pgl-pill-out' : '')} onClick={onClick}>
    <span aria-hidden="true" style={{ display: 'inline-flex' }}><MicroDot size={9} /></span>
    New
  </button>
);

// ---- Refresh control — busy state lives in the icon, nowhere else ---------
const PglRefreshIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block' }} aria-hidden="true">
    <path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3.5 15.5" />
    <path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9l2.4 2.4" />
    <polyline points="3.5 20.5 3.5 15.5 8.5 15.5" />
    <polyline points="20.5 3.5 20.5 8.5 15.5 8.5" />
  </svg>
);

// `done` picks the completion treatment when nothing new landed:
//   'text'   — quiet "Up to date" beside the control, fading after ~2s
//   'tick'   — the icon itself settles to a check for ~1s (the FAB's vocabulary)
//   'silent' — nothing: the rotation stopping is the whole answer
const PglRefresh = ({ busy, done, upToDate, onClick, onUpToDateEnd }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    {upToDate && done === 'text' && (
      <span className="pgl-utd" role="status" onAnimationEnd={onUpToDateEnd}>Up to date</span>
    )}
    <button className="pgl-iconbtn" onClick={onClick} aria-label="Refresh" title="Refresh"
      aria-busy={busy ? 'true' : 'false'}>
      {upToDate && done === 'tick'
        ? <span className="pgl-tick"><Icon name="check" size={19} /></span>
        : (
          <span className={busy ? 'pgl-rot' : ''} style={{ display: 'inline-flex' }}>
            <PglRefreshIcon size={19} />
          </span>
        )}
    </button>
  </div>
);

// ---- First load — the shell is already there; only the feed waits ---------
const PglLoading = () => (
  <div className="pgl-loading" role="status">
    <BrandSpinner size={100} />
  </div>
);

Object.assign(window, { PglDot, PglDivider, PglPill, PglRefresh, PglRefreshIcon, PglLoading });
