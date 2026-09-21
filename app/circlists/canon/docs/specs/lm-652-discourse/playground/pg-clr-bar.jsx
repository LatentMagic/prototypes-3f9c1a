// Fork of app/talk-return.jsx's CandFeedLead — SOURCE OF TRUTH is that file.
// Copied, not wrapped, because the act has to sit inside the bar's own box.
// The arrival/removal machinery, the snapshot-while-open hold and the head's
// wording are carried over verbatim; the only additions are the three
// affordances (pg-clr-head.jsx) and the guard that keeps the removal from
// playing while a receipt is up.
const PGC_BAR_IN_MS = 560, PGC_BAR_OUT_MS = 400;

const PgcFeedLead = ({ api }) => {
  const opt = usePGC();
  const [open, setOpen] = React.useState(false);
  const [held, setHeld] = React.useState(null);
  const [phase, setPhase] = React.useState('rest');
  const [barH, setBarH] = React.useState(null);
  const sp = api && api.space;
  const spaceId = sp ? sp.id : null;
  const receipt = usePgcReceipt(spaceId);
  const rows = candBarRows(sp);
  const live = rows.length > 0;
  const [shown, setShown] = React.useState(live);
  const box = React.useRef(null);
  const first = React.useRef(true);
  const where = React.useRef(spaceId);
  const lastSnap = React.useRef([]);

  React.useEffect(() => {
    if (first.current || where.current !== spaceId) {
      first.current = false; where.current = spaceId;
      setShown(live); setPhase('rest'); setBarH(null); setOpen(false); setHeld(null);
      return;
    }
    if (live && !shown) { setShown(true); setPhase('in'); setBarH(null); }
    else if (live && shown && phase === 'out') { setPhase('rest'); setBarH(null); }
    // The receipt holds the bar in place: it is the bar's last state, so the
    // removal waits for it rather than racing it.
    else if (!live && shown && !open && !receipt && phase !== 'out') { setPhase('out'); setBarH(null); }
  }, [live, spaceId, shown, open, phase, receipt]);

  React.useEffect(() => {
    if (phase === 'rest') return;
    const out = phase === 'out';
    const t = setTimeout(() => {
      if (out) setShown(false);
      setPhase('rest'); setBarH(null);
    }, out ? PGC_BAR_OUT_MS : PGC_BAR_IN_MS);
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

  const targets = () => pgcTargets(api.spaces, spaceId);
  const count = pgcCount(targets());
  const doClear = () => {
    const list = targets();
    pgcWrite(api, list, Date.now());
    setOpen(false); setHeld(null);
    if (PGC.undo === 'on') PGCR.set({ where: spaceId, mode: 'circle', list, count: pgcCount(list) });
  };
  const undo = () => { pgcWrite(api, receipt.list); PGCR.set(null); };

  const slot = { '--cand-bar-mb': 'max(0px, calc(var(--circ-feed-pad-top, 16px) - 16px))', marginBottom: 'var(--cand-bar-mb)' };
  if (barH != null) slot['--cand-bar-h'] = barH + 'px';
  else if (phase === 'in') { slot.height = 0; slot.overflow = 'hidden'; }
  const cls = barH == null ? undefined
    : phase === 'in' ? 'cand-barslot cand-barslot-in'
    : phase === 'out' ? 'cand-barslot cand-barslot-out' : undefined;

  const shippedHead = <PgcWholeHead open={open} head={head} sub={sub} onToggle={toggle} />;
  let body;
  if (receipt) body = <PgcReceipt mode="circle" count={receipt.count} onUndo={undo} />;
  else if (opt === 'pair' && open) body = <PgcPairHead mode="circle" count={count} onToggle={toggle} onClear={doClear} />;
  else if (opt === 'sweep' && !open) body = <PgcSweep onClear={doClear}>{shippedHead}</PgcSweep>;
  else body = shippedHead;

  return (
    <div className={cls} style={slot}>
      <div ref={box} style={pgcBoxStyle}>
        {body}
        {open && !receipt && (
          <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '4px 6px 6px' }}>
            {snap.map(r => (
              <button key={r.id} type="button" className="circ-menuitem"
                onClick={() => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard({ id: r.id }); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  background: 'transparent', border: 0, cursor: 'pointer', minHeight: 48, padding: '7px 8px', borderRadius: 'var(--radius-md)',
                  borderTop: '1px solid var(--color-border-2)' }}
                data-cand-listrow="">
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: r.titled ? '600 13.5px/1.35 var(--font-sans)' : '600 12.5px/1.45 var(--font-mono)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                  <span style={pgcSubLine}>{candNames(r.who)}</span>
                </span>
                <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
              </button>
            ))}
          </div>
        )}
        {opt === 'base' && open && !receipt && <PgcBase mode="circle" count={count} onClick={doClear} />}
      </div>
    </div>
  );
};

Object.assign(window, { PgcFeedLead });
