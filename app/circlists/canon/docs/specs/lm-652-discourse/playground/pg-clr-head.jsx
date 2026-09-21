// ============================================================================
// Clearing conversations — the option kit. Written once, mounted by both bars.
//
// WHAT THE FIRST SET GOT WRONG, and what this one holds to.
// Round one drew the act in the grammar of the things it acts on: a text label
// loose beside a bordered chevron (two registers colliding in the one row that
// is always on screen), and a two-line row at the foot of the panel that read
// as one more conversation, separated from its own subject by "More in the
// circles below". So the rule here:
//
//   The act may borrow the BAR's forms — the rule, the boxed 34px control, the
//   hairline, the card's own edges — and never the ROWS' forms: no title over
//   subtitle, no trailing chevron, nothing that invites a press expecting a
//   conversation.
//
// Three options, disparate in kind rather than in placement:
//   base   the act is furniture — the panel gains a floor
//   pair   the act is a peer of the chevron — the open head changes register
//   sweep  the act is a gesture — nothing is added to the bar in either state
//
// Protection is NOT the axis this time (the user's call: get the affordance
// right first). All three act at once, and the undo lever in the rig's chrome
// turns the receipt on across all three so reversal can be judged on its own.
// ============================================================================

// The receipt lives module-level rather than in either bar's state: it outlives
// the rows it is a receipt FOR, and both bars read it to know not to play their
// removal yet.
const PGCR = {
  rec: null, timer: null, subs: new Set(),
  set(rec) {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    this.rec = rec;
    if (rec) this.timer = setTimeout(() => PGCR.set(null), 8000);
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePgcReceipt = (where) => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGCR.sub(bump), []);
  return PGCR.rec && PGCR.rec.where === where ? PGCR.rec : null;
};

// The count, said the way each surface has to say it. In a circle the circle is
// already named by the screen; on home the number of circles IS the weight.
const pgcSays = (mode, c) => {
  const rows = c.rows + (c.rows === 1 ? ' conversation' : ' conversations');
  if (mode !== 'home') return rows;
  return rows + ' in ' + c.circles + (c.circles === 1 ? ' circle' : ' circles');
};
const pgcShort = (mode, c) => (mode === 'home'
  ? c.rows + ' in ' + c.circles + (c.circles === 1 ? ' circle' : ' circles')
  : c.rows + (c.rows === 1 ? ' conversation' : ' conversations'));
// One teaching line, in the same words wherever there is room for it — the
// microcopy is the only place this product ever explains itself.
const PGC_TEACH = 'Marks them seen in your view. The conversations stay on the cards.';

const pgcHeadRule = { width: 3, height: 22, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 };
const pgcHeadLine = { font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const pgcSubLine = { font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
// containerType so the pair can drop its label to the icon alone on a narrow
// card, the way the app's own card chrome adapts (app/feed.jsx's attribution).
const pgcBoxStyle = { background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-raised)', overflow: 'hidden', containerType: 'inline-size' };

const PgcChevron = ({ open }) => (
  <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--color-fg-2)', transform: open ? 'rotate(180deg)' : 'none',
    transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
    <Icon name="chevron-down" size={16} />
  </span>
);

// The shipped head, verbatim. Every option rests here when the bar is collapsed;
// base and sweep keep it in both states.
const PgcWholeHead = ({ open, head, sub, onToggle }) => (
  <button type="button" onClick={onToggle} aria-expanded={open} className="circ-menuitem"
    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 12px 0 14px',
      background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
    <span aria-hidden="true" style={pgcHeadRule} />
    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={pgcHeadLine}>{head}</span>
      <span style={pgcSubLine}>{sub}</span>
    </span>
    <PgcChevron open={open} />
  </button>
);

// ---- 1 · the base ---------------------------------------------------------
// The panel's floor. Full-bleed to the card's own edges, on the sunken surface
// the app uses for a pressed area, with a hairline above it — so it is plainly
// the base of the panel and not the seventh row. No chevron, no title/subtitle
// stack; the count rides in the label and the circles read as a value on the
// right. It ALSO absorbs "More in the circles below", which said the same thing
// less precisely one line earlier.
const PgcBase = ({ mode, count, onClick }) => (
  <button type="button" onClick={onClick} className="pgc-base"
    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
      background: 'var(--color-surface-sunken)', border: 0, borderTop: '1px solid var(--color-border-1)',
      padding: '11px 14px 12px', minHeight: 56 }}>
    <Icon name="check" size={17} color="var(--color-fg-2)" style={{ flexShrink: 0 }} />
    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ font: '600 13.5px/1.35 var(--font-sans)', color: 'var(--color-fg-1)' }}>Mark all {count.rows} seen</span>
      <span style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>{PGC_TEACH}</span>
    </span>
    {mode === 'home' && (
      <span style={{ flexShrink: 0, font: '500 12px/1 var(--font-mono)', color: 'var(--color-fg-3)' }}>
        {count.circles} {count.circles === 1 ? 'circle' : 'circles'}
      </span>
    )}
  </button>
);

// ---- 2 · the pair ---------------------------------------------------------
// Collapsed, this option adds nothing at all. Open, the head changes register:
// its two lines fall to one short count — the list beneath now says everything
// the subline was saying — and the space that buys goes to a second boxed
// control, the same 34px height, border and radius as the chevron beside it.
// Two boxes, one material. The label drops to the glyph alone on a narrow card.
const PgcPairHead = ({ mode, count, onToggle, onClear }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 56, padding: '0 8px 0 14px' }}>
    <span aria-hidden="true" style={pgcHeadRule} />
    <button type="button" onClick={onToggle} aria-expanded="true" className="circ-menuitem"
      style={{ flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center', background: 'transparent',
        border: 0, cursor: 'pointer', textAlign: 'left', padding: '0 4px 0 10px', borderRadius: 'var(--radius-md)' }}>
      <span style={{ ...pgcHeadLine, maxWidth: '100%' }}>{pgcShort(mode, count)}</span>
    </button>
    <button type="button" onClick={onClear} aria-label={'Mark all ' + pgcSays(mode, count) + ' seen'}
      style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 44, minHeight: 44, background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
      <span className="pgc-pairbox" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 11px',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
        color: 'var(--color-fg-2)' }}>
        <Icon name="check" size={16} />
        <span className="pgc-pairword" style={{ font: '500 12.5px/1 var(--font-sans)', whiteSpace: 'nowrap' }}>Mark all seen</span>
      </span>
    </button>
    <button type="button" onClick={onToggle} aria-label="Collapse" aria-expanded="true"
      style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 44, minHeight: 44, background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
      <PgcChevron open={true} />
    </button>
  </div>
);

// ---- 3 · the sweep --------------------------------------------------------
// No control, in either state. The collapsed bar is dragged aside and the act
// is underneath it — grey while the pull can still be taken back, accent the
// moment a release would act, which is the only thing standing in for a
// confirmation. Past the release the bar plays its ordinary removal, so the
// gesture ends in the motion the bar already had.
const PGC_SWEEP_ARM = 0.4;
const PgcSweep = ({ onClear, children }) => {
  const wrap = React.useRef(null);
  const [dx, setDx] = React.useState(0);
  const [glide, setGlide] = React.useState(false);
  const st = React.useRef({ on: false, lock: null, x0: 0, y0: 0, w: 320, moved: false, armed: false });
  const armed = st.current.armed;

  const down = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    st.current = { on: true, lock: null, x0: e.clientX, y0: e.clientY,
      w: wrap.current ? wrap.current.offsetWidth : 320, moved: false, armed: false };
    setGlide(false);
  };
  const move = (e) => {
    const s = st.current;
    if (!s.on) return;
    const ddx = e.clientX - s.x0, ddy = e.clientY - s.y0;
    if (!s.lock) {
      if (Math.abs(ddx) < 8 && Math.abs(ddy) < 8) return;
      s.lock = Math.abs(ddx) > Math.abs(ddy) ? 'x' : 'y';
      if (s.lock === 'x') { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} }
    }
    if (s.lock !== 'x') return;
    s.moved = true;
    const t = Math.max(-s.w * 0.86, Math.min(0, ddx));
    s.armed = -t >= s.w * PGC_SWEEP_ARM;
    setDx(t);
  };
  const up = () => {
    const s = st.current;
    if (!s.on) return;
    s.on = false;
    setGlide(true);
    if (s.armed) { s.armed = false; setDx(-s.w); setTimeout(() => { setDx(0); setGlide(false); onClear(); }, 190); }
    else { s.armed = false; setDx(0); }
  };
  // A drag that ends on the head would otherwise expand the bar: the click is
  // eaten here, in the capture phase, before the head's own handler sees it.
  const eat = (e) => { if (st.current.moved) { e.stopPropagation(); e.preventDefault(); st.current.moved = false; } };

  return (
    <div ref={wrap} style={{ position: 'relative', overflow: 'hidden' }} onClickCapture={eat}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'flex-end', gap: 9, padding: '0 18px', opacity: dx < 0 ? 1 : 0,
        background: armed ? 'var(--color-accent)' : 'var(--color-surface-sunken)',
        color: armed ? '#fff' : 'var(--color-fg-2)',
        transition: 'background var(--duration-fast) linear, color var(--duration-fast) linear' }}>
        <Icon name="check" size={17} />
        <span style={{ font: '600 13px/1 var(--font-sans)' }}>Mark all seen</span>
      </div>
      <div style={{ position: 'relative', background: 'var(--color-surface)', touchAction: 'pan-y',
        transform: 'translateX(' + dx + 'px)', transition: glide ? 'transform 220ms var(--ease-quiet)' : 'none' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {children}
      </div>
    </div>
  );
};

// ---- the receipt (the undo lever, across all three) -----------------------
// The bar's last state before it goes, carrying the way back — the app's own
// grammar for a completed gesture (a form change in the thing you pressed,
// app/card-share.jsx), never a toast.
const PgcReceipt = ({ mode, count, onUndo }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 56, padding: '0 8px 0 14px' }}>
    <span aria-hidden="true" style={{ ...pgcHeadRule, background: 'var(--color-border-1)' }} />
    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px 0 10px' }}>
      <span style={pgcHeadLine}>Cleared.</span>
      <span style={pgcSubLine}>{pgcSays(mode, count)} marked seen.</span>
    </span>
    <button type="button" onClick={onUndo} className="circ-menuitem"
      style={{ flexShrink: 0, background: 'transparent', border: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)',
        minHeight: 44, padding: '0 12px', font: '600 13px/1 var(--font-sans)', color: 'var(--color-accent)' }}>Undo</button>
  </div>
);

Object.assign(window, { PGCR, usePgcReceipt, pgcSays, pgcShort, PGC_TEACH, PgcWholeHead, PgcBase, PgcPairHead, PgcSweep, PgcReceipt, PgcChevron, pgcBoxStyle, pgcHeadRule, pgcHeadLine, pgcSubLine });
