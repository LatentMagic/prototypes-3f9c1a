// Fork of app/home-returns.jsx's CircHomeReturns — SOURCE OF TRUTH is that
// file. Copied for the same reason the circle bar is: the act sits inside the
// strip's own box. The union, the bound, the grouping and the snapshot-while-
// open hold are carried over verbatim.
//
// The one thing that is NOT the same as in a circle: the act ends the WHOLE
// union, while the panel only ever shows six rows from at most three circles.
// On home the thing you press ends more than the thing you can see — which is
// why option 1's band carries the true count, and why the other two carry it in
// the head's own line.
const PgcHomeReturns = ({ spaces, open, onToggle, onEnterSpace }) => {
  const opt = usePGC();
  const [held, setHeld] = React.useState(null);
  const receipt = usePgcReceipt('home');
  const api = window.CircCandidate && window.CircCandidate.api;
  const live = React.useMemo(() => {
    const flat = candCrossRows(spaces);
    return { flat, ...candCrossBounded(spaces, flat) };
  }, [spaces]);

  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (open) setHeld({ groups: candCrossSnap(live.groups), leftover: live.leftover });
    else setHeld(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const groups = open && held ? held.groups : candCrossSnap(live.groups);
  const leftover = open && held ? held.leftover : live.leftover;
  const n = groups.reduce((sum, g) => sum + g.rows.length, 0);

  const targets = () => pgcTargets(spaces);
  const count = pgcCount(targets());
  const doClear = () => {
    const list = targets();
    pgcWrite(api, list, Date.now());
    onToggle(false); setHeld(null);
    if (PGC.undo === 'on') PGCR.set({ where: 'home', mode: 'home', list, count: pgcCount(list) });
  };
  const undo = () => { pgcWrite(api, receipt.list); PGCR.set(null); };
  const wrap = { ...pgcBoxStyle, marginBottom: 22 };

  if (receipt) return <div style={wrap}><PgcReceipt mode="home" count={receipt.count} onUndo={undo} /></div>;

  if (n === 0) {
    return (
      <div style={wrap}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '10px 14px' }}>
          <span aria-hidden="true" style={{ ...pgcHeadRule, background: 'var(--color-border-1)' }} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)' }}>You&rsquo;re caught up.</span>
            <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>Nothing new on the cards you are watching.</span>
          </span>
        </div>
      </div>
    );
  }

  const names = [];
  groups.forEach((g) => g.rows.forEach((r) => r.who.forEach((who) => { if (!names.includes(who)) names.push(who); })));
  const head = open ? 'Pick one to open its conversation'
    : n + (n === 1 ? ' conversation' : ' conversations') + ' you are watching';
  const sub = candNames(names) + ' spoke';
  const toggle = () => onToggle(!open);

  const shippedHead = <PgcWholeHead open={open} head={head} sub={sub} onToggle={toggle} />;
  let body;
  if (opt === 'pair' && open) body = <PgcPairHead mode="home" count={count} onToggle={toggle} onClear={doClear} />;
  else if (opt === 'sweep' && !open) body = <PgcSweep onClear={doClear}>{shippedHead}</PgcSweep>;
  else body = shippedHead;

  return (
    <div style={wrap}>
      {body}
      {open && (
        <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '4px 6px 6px' }}>
          {groups.map((g) => (
            <div key={g.circleId}>
              <h3 style={{ margin: 0, padding: '10px 8px 4px', font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{g.circleName}</h3>
              {g.rows.map((r) => (
                <button key={r.id} type="button" className="circ-menuitem"
                  onClick={() => {
                    onEnterSpace(g.circleId);
                    const C = window.CircCandidate;
                    if (C && C.goToCard) C.goToCard({ id: r.id });
                  }}
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
          ))}
          {/* Option 1's band states the same fact more precisely one line later
              — how many there are in total, and across how many circles — so
              the leftover note stands down rather than being said twice. */}
          {leftover && opt !== 'base' && (
            <p style={{ margin: 0, padding: '10px 10px 6px', font: '400 12px/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>More in the circles below.</p>
          )}
        </div>
      )}
      {opt === 'base' && open && <PgcBase mode="home" count={count} onClick={doClear} />}
    </div>
  );
};

window.CircHomeReturns = PgcHomeReturns;
