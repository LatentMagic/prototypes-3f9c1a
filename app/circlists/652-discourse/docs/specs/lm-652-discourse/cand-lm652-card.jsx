// ============================================================================
// LM-652 candidate — the card's discourse skin (items 2 + 3).
//   CandCardRow   — wraps the shipped FeedCard (handed in as children, never
//                   copied): the fold when watching, and on Active the
//                   tucked-under band carrying the contributor's thought.
//   CandAltFace   — the band's card, come forward. The SAME geometry inverted:
//                   the link card's edge on top, the thought card beneath it.
//                   Ported from the rig (`pg-st-stack.jsx`, StEdge/StAlt).
//   CandConvoButton — the way-through on a Read card. Replaces the emoji
//                   reaction-analytics door by re-publishing window.SwellDoor.
// ============================================================================

const CAND_OVERLAP = 15; // how far the card in front sits over the one behind
const CAND_INSET = 12;   // how far the card behind is inset on each side
const CAND_EDGE = 27;    // the open state's sliver of the link card

// The band: the thought's card, seen from under the card in front.
// A thought that fits on the band whole is READ THERE — the band is inert, has
// no chevron, and there is no second card to come up, because nothing is being
// held back. Only a thought the band cannot finish is openable, and the chevron
// is what says so. Measured, never guessed from a character count.
const CandBand = ({ item, onOpen }) => {
  const t = item.thought;
  const by = /^you$/i.test(t.by) ? 'You' : t.by;
  const ref = React.useRef(null);
  const [held, setHeld] = React.useState(/\n/.test(t.text));
  const measure = React.useCallback(() => {
    const el = ref.current;
    if (el) setHeld(/\n/.test(t.text) || el.scrollWidth > el.clientWidth + 1);
  }, [t.text]);
  React.useLayoutEffect(measure, [measure]);
  React.useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);
  const bandStyle = {
    position: 'relative', zIndex: 0, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
    background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd, borderTop: 0,
    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
    margin: (-CAND_OVERLAP) + 'px ' + CAND_INSET + 'px 0', padding: (CAND_OVERLAP + 5) + 'px 16px 9px',
  };
  const words = (
    <span ref={ref} style={{ flex: 1, minWidth: 0, font: '400 13.5px/1.5 var(--font-sans)', color: 'var(--color-fg-1)',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <span style={{ fontWeight: 600 }}>{by}</span>{'\u2002'}{t.text.split('\n')[0]}
    </span>
  );
  if (!held) return <div style={bandStyle}>{words}</div>;
  return (
    <button type="button" className="cand-band" onClick={onOpen} aria-label={'Read what ' + by + ' wrote'}
      style={{ ...bandStyle, width: 'auto', font: 'inherit', cursor: 'pointer' }}>
      {words}
      <svg className="cand-bandchev" viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--color-fg-3)', marginRight: -2 }}>
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
};

// The edge of the card the alternate came from. It sits ABOVE the alternate: the
// thought card has come forward, so the link card is the one that has slipped
// behind — and the only thing that shows that is seeing its edge on top.
const CandEdge = () => (
  <div aria-hidden="true" style={{ position: 'relative', zIndex: 0, height: CAND_EDGE,
    background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderBottom: 0,
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    margin: '0 ' + CAND_INSET + 'px ' + (-CAND_OVERLAP) + 'px' }} />
);

// The alternate face — the same card, with room. The title still opens the link,
// the words are the matter, the actions are the card's own. No favicon, no
// source line, no preview: that furniture is for scanning a shelf, and this is
// not a shelf.
const CandAltFace = ({ item, api, onClose }) => {
  const t = item.thought;
  const by = /^you$/i.test(t.by) ? 'You' : t.by;
  const isYou = by === 'You';
  return (
    <div className="cand-alt" style={{ position: 'relative', zIndex: 2,
      background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd,
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-raised)',
      padding: 'var(--space-4) var(--space-5) var(--space-3)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle"
          style={{ flex: 1, minWidth: 0, font: '600 16px/1.3 var(--font-sans)', letterSpacing: '-0.01em',
            color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', overflowWrap: 'break-word' }}>{candTitleOf(item)}</a>
        <button type="button" onClick={onClose} aria-label="Close" className="cand-altclose"
          style={{ flexShrink: 0, background: 'transparent', border: 0, cursor: 'pointer',
            borderRadius: 'var(--radius-md)', width: 36, height: 36, margin: '-6px -10px 0 0',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <CloseX />
        </button>
      </div>
      {/* A contribution is somebody's note about the link, so it is set QUIETER
          than the title, never louder: body size, loose leading, secondary ink on
          its own paper, signed at the foot. Bigger or bolder is what made it read
          as a heading; it does not need to compete with the title to be the
          matter of this face. */}
      <CandProse text={t.text} size={15} lh={1.7} color="var(--color-fg-2)" />
      {/* One foot row: who wrote it and when, then the card's own actions. No
          rule — the row is the foot, and a line above it only says so twice. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: -4, marginRight: -13 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={isYou ? displayName(api.user) : by} size={22} accent={isYou} />
          <span style={{ font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{by}</span>
          {candWhen(t.at) && <span style={{ flexShrink: 0, font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candWhen(t.at)}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="circ-cardaction circ-cardaction-icon" aria-label="Mark as read" title="Mark as read"
            onClick={() => { onClose(); api.requestMarkRead(item); }}>
            <Icon name="check" size={18} />
          </button>
          <button className="circ-cardaction circ-cardaction-icon" aria-label="Delete this link" title="Delete"
            onClick={() => { onClose(); api.requestDelete(item); }}>
            <Icon name="trash" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

// The feed-row wrapper. The card itself is the shipped FeedCard, untouched.
// Closed: card in front, band tucked under. Open: the two swap — the link card's
// edge on top, the thought card in front of it. Card above a card, both states.
const CandCardRow = ({ item, tab, api, children }) => {
  const [open, setOpen] = React.useState(false);
  const showBand = tab === 'active' && item.thought && !item.pending;
  React.useEffect(() => { if (!showBand && open) setOpen(false); }, [showBand]);
  if (showBand && open) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <CandEdge />
        <CandAltFace item={item} api={api} onClose={() => setOpen(false)} />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius-lg)', boxShadow: showBand ? 'var(--shadow-raised)' : 'none' }}>
        {children}
        {item.watching && <CandFold />}
      </div>
      {showBand && <CandBand item={item} onOpen={() => setOpen(true)} />}
    </div>
  );
};

// The way-through (item 3). Takes the reaction-analytics door's slot on a Read
// card; the roster analytics now draw on the surface it opens. Always present on
// a Read card — a read card always has a surface to visit.
const CandConvoButton = ({ item }) => (
  <button type="button" className="circ-cardaction circ-cardaction-icon"
    aria-label={'Open this card\u2019s conversation'} title="Conversation"
    onClick={() => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard(item); }}>
    <CandWayIcon size={18} />
  </button>
);

Object.assign(window, { CandCardRow, CandBand, CandEdge, CandAltFace, CandConvoButton, SwellDoor: CandConvoButton });
