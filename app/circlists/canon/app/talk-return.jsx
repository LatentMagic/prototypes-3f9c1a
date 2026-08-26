
// ============================================================================
// LM-652 — the returns bar. It stands at the head of BOTH feeds, collapsed, and
// expands in place to the cards themselves; picking one opens that card's
// conversation surface. Its presence is its state: there when there is unseen
// talk on a watched card, absent when there is not.
//
// This file owns three things the delta named:
//   the ARRIVAL   — the slot opens its own height while the strip travels up into
//                   it, once, in the New pill's grammar (.cand-barslot-in).
//   the REMOVAL   — the same motion reversed and quicker (.cand-barslot-out).
//                   Chosen over a fade or a collapse-in-place: the arrival is the
//                   only thing besides the pill that moves this feed, so the way
//                   out reads as that same displacement being given back. A fade
//                   would leave the space open and then snap it shut; a shorter
//                   reverse closes it under the same curve, and leaving is not an
//                   announcement, so it does not take the arrival's full time.
//   the HOLD      — while expanded, the rows and their words do not move. What is
//                   drawn is frozen at the moment it opened, and talk arriving in
//                   the meantime lands on collapse. Nothing marks the hold.
// The circular chevron target was not carried: no other control in the product
// is a circle, so the house shape (radius-md box) stands instead — flagged.
// ============================================================================
const CAND_BAR_IN_MS = 560, CAND_BAR_OUT_MS = 400;

// The bar's rows: watched cards, MARKED READ (ratified 2026-08-19 — hearing about
// a card starts at the mark), carrying words the member has not seen. Newest
// first, so the head line's names — taken in row order — read newest first too.
const candBarRows = (sp) => {
  if (!sp) return [];
  return sp.items
    .filter(i => i.watching && i.read && candFresh(i).length > 0)
    .map(i => ({ i, at: Math.max(...candFresh(i).map(t => t.at)) }))
    .sort((a, b) => b.at - a.at)
    .map(r => r.i);
};
const candBarWho = (item) => {
  const who = [];
  candFresh(item).forEach(t => { if (!who.includes(t.by)) who.push(t.by); });
  return who;
};
// A row, frozen. Everything the open bar draws is taken from this snapshot, so a
// turn arriving while it is open cannot move a row, reorder the list, or add a
// name to a subline.
const candBarSnap = (rows) => rows.map(i => ({ id: i.id, title: candTitleOf(i), titled: !!i.title, who: candBarWho(i) }));

const CandFeedLead = ({ api }) => {
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

  // Arrival and removal. A change of circle is navigation, not the bar coming or
  // going, so the new circle's state is taken as it stands, unanimated. A removal
  // is held while the bar is open (an expanded bar holds still) and plays when the
  // member collapses it.
  React.useEffect(() => {
    if (first.current || where.current !== spaceId) {
      first.current = false; where.current = spaceId;
      setShown(live); setPhase('rest'); setBarH(null); setOpen(false); setHeld(null);
      return;
    }
    if (live && !shown) { setShown(true); setPhase('in'); setBarH(null); }
    else if (live && shown && phase === 'out') { setPhase('rest'); setBarH(null); }
    else if (!live && shown && !open && phase !== 'out') { setPhase('out'); setBarH(null); }
  }, [live, spaceId, shown, open, phase]);

  // The motion's own end: the arrival returns the slot to auto height (so it can
  // expand), the removal takes the bar out of the feed.
  React.useEffect(() => {
    if (phase === 'rest') return;
    const out = phase === 'out';
    const t = setTimeout(() => {
      if (out) setShown(false);
      setPhase('rest'); setBarH(null);
    }, out ? CAND_BAR_OUT_MS : CAND_BAR_IN_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Measured before paint, so the keyframe has a real height to travel to and the
  // feed below makes ONE move rather than a jump and then a slide.
  React.useLayoutEffect(() => {
    if (phase !== 'rest' && barH == null && box.current) setBarH(box.current.offsetHeight);
  }, [phase, barH]);

  if (!shown || !sp) return null;

  let snap = open && held ? held : candBarSnap(rows);
  if (!snap.length) snap = lastSnap.current; else lastSnap.current = snap;
  if (!snap.length) return null;

  const names = [];
  snap.forEach(r => r.who.forEach(n => { if (!names.includes(n)) names.push(n); }));
  const n = snap.length;
  // Two lines, each parsing on its own. The head is the count — fixed-length by
  // construction, so it never truncates at any width. The names are the subline
  // and are the half allowed to truncate: every row restates them.
  const head = open ? 'Pick one to open its conversation'
    : n + (n === 1 ? ' conversation' : ' conversations') + ' you are watching';
  const sub = candNames(names) + ' spoke';
  const toggle = () => {
    if (open) { setOpen(false); setHeld(null); }
    else { setHeld(candBarSnap(rows)); setOpen(true); }
  };

  const slot = { '--cand-bar-mb': 'max(0px, calc(var(--circ-feed-pad-top, 16px) - 16px))', marginBottom: 'var(--cand-bar-mb)' };
  if (barH != null) slot['--cand-bar-h'] = barH + 'px';
  else if (phase === 'in') { slot.height = 0; slot.overflow = 'hidden'; }
  const cls = barH == null ? undefined
    : phase === 'in' ? 'cand-barslot cand-barslot-in'
    : phase === 'out' ? 'cand-barslot cand-barslot-out' : undefined;

  return (
    <div className={cls} style={slot}>
      <div ref={box} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-raised)', overflow: 'hidden' }}>
        <button type="button" onClick={toggle} aria-expanded={open} className="circ-menuitem"
          style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 12px 0 14px',
            background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
          <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', whiteSpace: 'nowrap' }}>{head}</span>
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
          <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '4px 6px 6px' }}>
            {snap.map(r => (
              <button key={r.id} type="button" className="circ-menuitem"
                onClick={() => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard({ id: r.id }); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  background: 'transparent', border: 0, cursor: 'pointer', minHeight: 48, padding: '7px 8px', borderRadius: 'var(--radius-md)',
                  borderTop: '1px solid var(--color-border-2)', borderTopColor: 'var(--color-border-2)' }}
                data-cand-listrow="">
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* No title: the address IS the name, set in mono as the card
                      sets it (app/feed.jsx:134) — one treatment for a title-less
                      link wherever it is named. */}
                  <span style={{ font: r.titled ? '600 13.5px/1.35 var(--font-sans)' : '600 12.5px/1.45 var(--font-mono)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                  <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candNames(r.who)}</span>
                </span>
                <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { CandFeedLead, candBarRows, candBarWho });
