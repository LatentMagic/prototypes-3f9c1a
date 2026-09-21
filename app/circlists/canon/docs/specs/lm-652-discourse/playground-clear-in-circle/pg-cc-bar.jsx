// ============================================================================
// Clearing the returns bar, inside a circle — the four affordances, on a fork
// of the shipped bar.
//
// SOURCE OF TRUTH is app/talk-return.jsx. This file is a fork of CandFeedLead
// and everything it does not name is that file's, verbatim: the arrival
// (.cand-barslot-in), the removal (.cand-barslot-out), the pre-paint height
// measurement, the change-of-circle reset, the snapshot-while-open hold, and
// the row treatment. If the bar's timing or wording needs changing, it changes
// THERE first and is carried here.
//
// Two additions, and nothing else:
//   — the act, in four forms (see pg-cc-store.jsx for the axis and the rule)
//   — the receipt, when the Undo lever is on: the bar holds its place for eight
//     seconds carrying Undo, then plays its ordinary removal
//
// THE ONE STRUCTURAL CHANGE the options force. The shipped head IS a button. A
// control cannot nest inside it, so options 2 and 3 split the head: the toggle
// keeps the title line and the chevron, and the act sits beside or beneath it
// as its own button. Option 1 and 4 leave the head untouched.
//
// QUIET BY CONSTRUCTION: every act in here is the app's own recessive action
// grammar — `.circ-cardaction` (transparent, fg-2, 13px, 44px target, sunken on
// hover) or the house secondary box. No fill, no accent, nothing that competes
// with a row. Opening a conversation stays the bar's main action.
// ============================================================================
const PGCC_BAR_IN_MS = 560, PGCC_BAR_OUT_MS = 400;

// ---- the act ----------------------------------------------------------
// A FOOTNOTE, not a row. Every earlier attempt failed the same way and it took
// four of them to name it: the act kept being drawn in the LIST's register —
// 13px, 500, row-inset, a row's hover fill — so whatever its placement it read
// as a fifth conversation that had lost its subtitle. Two kinds of thing in one
// list, drawn the same way, is the whole of "too much going on".
//
// So the register changes, not the placement. The product already has a
// footnote voice at the foot of a panel: "More in the circles below." on home
// (app/home-returns.jsx) — --text-xs, 400, fg-3, no fill. The act takes that
// voice, with an underline on hover because a footnote that presses has to say
// so somehow and it cannot say it with a fill.
//
// The hairline above it is the boundary between the two registers, and it is
// the rows' own rule, so nothing new is introduced. The hit area stays 44px
// (governance standards/ui-design.md, touch floor) while the text is 12px —
// padding carries the target, not the type size.
// `wide` is option 2: the same footnote, made a row. Full-width target with the
// list's own hover tint (.circ-menuitem) — the conventional pairing, since a
// full-width target gets a fill and an underline belongs to a text-width link.
// Option 1 keeps the text-width target and the app's text-action state
// (.circ-btn-tertiary, underline on hover). Only the target and the hover change
// between them; the type is the footnote's in both.
const PgccFoot = ({ onClear, wide }) => (
  <React.Fragment>
    <span role="separator" style={{ height: 1, margin: '3px 0', background: 'var(--color-border-2)' }} />
    <span style={{ display: 'flex' }}>
      <button type="button" onClick={onClear} className={wide ? 'circ-menuitem' : 'circ-btn-tertiary'}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left',
          width: wide ? '100%' : 'auto', minHeight: 44, padding: '0 10px', background: 'transparent',
          border: 0, cursor: 'pointer', borderRadius: wide ? 'var(--radius-md)' : 0,
          font: '400 var(--text-xs)/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>{PGCC_ACT}</button>
    </span>
  </React.Fragment>
);

// ---- the receipt ---------------------------------------------------------
// The bar's own geometry, holding its place: same height, same leading rule
// (stood down from sage, because nothing is live in it any more), the report on
// the left and the way back on the right.
const PgccReceipt = ({ onUndo }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 8px 0 14px' }}>
    <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-border-1)', flexShrink: 0 }} />
    <span role="status" style={{ flex: 1, minWidth: 0, font: '500 var(--text-sm)/1.35 var(--font-sans)', color: 'var(--color-fg-2)',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cleared</span>
    <button type="button" onClick={onUndo} className="circ-cardaction"
      style={{ flexShrink: 0, font: '500 var(--text-sm)/1 var(--font-sans)', color: 'var(--color-fg-2)' }}>Undo</button>
  </div>
);

const PgccFeedLead = ({ api }) => {
  const cfg = usePGCC();
  const receiptStore = usePGCCR();
  const [open, setOpen] = React.useState(false);
  const [held, setHeld] = React.useState(null);
  const [phase, setPhase] = React.useState('rest');
  const [barH, setBarH] = React.useState(null);
  const sp = api && api.space;
  const spaceId = sp ? sp.id : null;
  const rows = candBarRows(sp);
  const live = rows.length > 0;
  const [shown, setShown] = React.useState(live);
  const box = React.useRef(null);
  const first = React.useRef(true);
  const where = React.useRef(spaceId);
  const lastSnap = React.useRef([]);
  const receipt = !!receiptStore.at && receiptStore.spaceId === spaceId;

  // The receipt's own life. It is the reason the bar is still on screen, so when
  // it ends the ordinary removal takes over — which is exactly what happens
  // below, because `live` is already false by then.
  React.useEffect(() => {
    if (!receiptStore.at) return;
    const t = setTimeout(() => PGCCR.set(null), PGCC_RECEIPT_MS);
    return () => clearTimeout(t);
  }, [receiptStore.at]);

  // Arrival and removal, from talk-return.jsx. One clause added: a removal is
  // also held while a receipt is showing, for the same reason it is held while
  // the bar is open — the bar is mid-sentence, and the removal is the full stop.
  React.useEffect(() => {
    if (first.current || where.current !== spaceId) {
      first.current = false; where.current = spaceId;
      setShown(live); setPhase('rest'); setBarH(null); setOpen(false); setHeld(null);
      return;
    }
    if (live && !shown) { setShown(true); setPhase('in'); setBarH(null); }
    else if (live && shown && phase === 'out') { setPhase('rest'); setBarH(null); }
    else if (!live && shown && !open && !receipt && phase !== 'out') { setPhase('out'); setBarH(null); }
  }, [live, spaceId, shown, open, phase, receipt]);

  React.useEffect(() => {
    if (phase === 'rest') return;
    const out = phase === 'out';
    const t = setTimeout(() => {
      if (out) setShown(false);
      setPhase('rest'); setBarH(null);
    }, out ? PGCC_BAR_OUT_MS : PGCC_BAR_IN_MS);
    return () => clearTimeout(t);
  }, [phase]);

  React.useLayoutEffect(() => {
    if (phase !== 'rest' && barH == null && box.current) setBarH(box.current.offsetHeight);
  }, [phase, barH]);

  if (!shown || !sp) return null;

  let snap = open && held ? held : candBarSnap(rows);
  if (!snap.length) snap = lastSnap.current; else lastSnap.current = snap;
  if (!snap.length && !receipt) return null;

  const names = [];
  snap.forEach(r => r.who.forEach(n => { if (!names.includes(n)) names.push(n); }));
  const n = snap.length;
  const head = open ? 'Pick one to open its conversation'
    : n + (n === 1 ? ' conversation' : ' conversations') + ' you are watching';
  const sub = candNames(names) + ' spoke';
  const toggle = () => {
    if (open) { setOpen(false); setHeld(null); }
    else { setHeld(candBarSnap(rows)); setOpen(true); }
  };

  // The act. It collapses the panel first where the panel is open, because the
  // rows it is listing are about to not exist — an open panel playing its
  // removal full of rows is the bar arguing with itself.
  const doClear = () => {
    const list = pgccTargets(sp);
    if (!list.length) return;
    if (open) { setOpen(false); setHeld(null); }
    if (cfg.undo === 'on') PGCCR.set({ at: Date.now(), spaceId, list });
    pgccWrite(api, spaceId, list, Date.now());
  };
  const doUndo = () => {
    pgccWrite(api, spaceId, receiptStore.list || [], undefined);
    PGCCR.set(null);
  };

  const slot = { '--cand-bar-mb': 'max(0px, calc(var(--circ-feed-pad-top, 16px) - 16px))', marginBottom: 'var(--cand-bar-mb)' };
  if (barH != null) slot['--cand-bar-h'] = barH + 'px';
  else if (phase === 'in') { slot.height = 0; slot.overflow = 'hidden'; }
  const cls = barH == null ? undefined
    : phase === 'in' ? 'cand-barslot cand-barslot-in'
    : phase === 'out' ? 'cand-barslot cand-barslot-out' : undefined;

  const card = { background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-raised)', overflow: 'hidden' };

  return (
    <div className={cls} style={slot}>
      <div ref={box} style={card}>
        {receipt ? <PgccReceipt onUndo={doUndo} /> : (
          <React.Fragment>
            {/* The head is the shipped one, untouched: two lines, the count on
                the first and who spoke on the second, and the boxed chevron. No
                option here reaches into it — the rejected round put a control
                beside that box ("text — chevron — yuck") and the round after put
                one on its second line, where a hover-filled control has no
                business. */}
            <button type="button" onClick={toggle} aria-expanded={open} className="circ-menuitem"
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 12px 0 14px',
                background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
              <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{head}</span>
                <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>
              </span>
              <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-fg-2)', transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
                <Icon name="chevron-down" size={16} />
              </span>
            </button>
            {open && (
              <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '3px 6px', display: 'flex', flexDirection: 'column' }}>
                {snap.map((r, i) => (
                  <React.Fragment key={r.id}>
                    {i > 0 && <span role="separator" style={{ height: 1, margin: '3px 0', background: 'var(--color-border-2)' }} />}
                    <button type="button" className="circ-menuitem"
                      onClick={() => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard({ id: r.id }); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                        background: 'transparent', border: 0, cursor: 'pointer', minHeight: 48, padding: '11px 8px 11px 10px', borderRadius: 'var(--radius-md)' }}
                      data-cand-listrow="">
                      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* No title: the address IS the name, set in mono as the
                            card sets it (app/feed.jsx) — one treatment for a
                            title-less link wherever it is named. */}
                        <span style={{ font: r.titled ? '600 13.5px/1.35 var(--font-sans)' : '600 12.5px/1.45 var(--font-mono)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                        <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candNames(r.who)}</span>
                      </span>
                      <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
                    </button>
                  </React.Fragment>
                ))}
                <PgccFoot onClear={doClear} wide={cfg.opt === 'row'} />
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { PgccFeedLead });
