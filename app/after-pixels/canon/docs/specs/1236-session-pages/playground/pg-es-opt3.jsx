// ============================================================================
// Playground (1236): option 3, The minutes. A square for every minute you were in the room, ten to a row on a phone and
// thirty (par) on a wide page; the door stands in the minute each lock gave way, and par is the end of a row. Under it, every
// move in a ledger grouped by lock, one line each, the room's words a tap away. The library card holds the same squares, small.
// ============================================================================
// Spoiler call: the strictest. The picture and the ledger show only what you did and how it went; every word of the room's
// (replies, near misses, readings, hints, each lock's story line, the exit) opens one line at a time, with a tap.
const Pge3Grid = ({ m, cols, small, hi, onDoor }) => {
  const total = Math.max(m.min, m.par); const rows = Math.ceil(total / cols);
  const doorAt = {}; m.locks.forEach((lk) => { doorAt[lk.minute] = lk; });
  const cells = Array.from({ length: rows * cols }, (_, i) => i + 1);
  const label = m.min + ' minutes in the room, par ' + m.par + '. Locks opened at minutes ' + m.locks.map((l) => l.minute).join(', ') + '.';
  return (
    <div className={'pge3-grid' + (small ? ' is-small' : '')} role={onDoor ? 'group' : 'img'} aria-label={label}>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="pge3-row">
          {!small && <span className="pge3-rn">{r * cols + 1}</span>}
          <div className="pge3-cells" style={{ gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))' }}>
            {cells.slice(r * cols, r * cols + cols).map((c) => {
              const k = c > total ? 'none' : doorAt[c] ? 'door' : c <= m.min ? 'in' : 'left';
              const cls = 'pge3-c is-' + k + (c === m.par && c < total ? ' is-par' : '') + (hi && hi.door === c ? ' pge-hi' : '') + (hi && hi.from && c >= hi.from && c <= hi.to && k !== 'door' ? ' is-run' : '');
              const door = k === 'door' && <PgeDoor w={small ? 4 : 10} h={small ? 6 : 16} />;
              return onDoor && k === 'door'
                ? <button key={c} type="button" className={cls} aria-label={doorAt[c].name + ', minute ' + c} onClick={() => onDoor(doorAt[c])}>{door}</button>
                : <span key={c} className={cls}>{door}</span>;
            })}
          </div>
          {!small && (r + 1) * cols === m.par && <span className="pge3-pl">Par</span>}
          {!small && !((r + 1) * cols === m.par) && <span className="pge3-pl" />}
        </div>
      ))}
    </div>
  );
};
const Pge3Ledger = ({ m, two, cur, onMove }) => {
  const [open, setOpen] = React.useState(null);
  const Line = ({ id, n, head, w, said, kind, hi }) => {
    const o = open === id;
    const inner = <><span className="pge3-n">{n || ''}</span><span className="pge3-t">{head}</span><span className="pge3-w">{w || ''}</span>
      {said ? <span className="pge3-chev" data-open={o ? 1 : undefined}><DS.Icon name="down" size={20} /></span> : <span />}</>;
    const press = () => { if (said) setOpen(o ? null : id); if (n) onMove(n); };
    return (
      <li className={'is-' + kind + (hi ? ' is-hi' : '')}>
        {said || n ? <button type="button" className="pge3-line" aria-expanded={said ? o : undefined} onClick={press}>{inner}</button> : <div className="pge3-line">{inner}</div>}
        {o && <p className="pge3-said">{said}</p>}
      </li>
    );
  };
  return (
    <div className={'pge3-ledger' + (two ? ' is-two' : '')}>
      {m.stretches.map((st, i) => (
        <section key={i} className={'pge3-grp' + (cur && cur.id === 'stall' && cur.si === i ? ' is-hi' : '')} aria-label={st.lock ? st.lock.name : 'Since the last lock'}>
          <header className="pge3-gh">
            {st.lock ? <PgeNum n={st.lock.index} size={24} /> : <span className="pge3-gnone" />}
            <span><b>{st.lock ? st.lock.name : 'Since the last lock'}</b>
              <span className="pge-cap">{(st.lock && st.lock.minute ? 'Minute ' + st.lock.minute + ' · ' : '') + (st.lock ? pgeFacts(st.lock) : pgePlural(st.moves, 'move', 'moves'))}</span>
              {st.lock && st.lock.closed && <span className="pge-cap">{st.lock.closed + ' closed for good.'}</span>}</span>
          </header>
          <ol className="pge3-lines">
            {st.entries.map((e, j) => <Line key={j} id={i + '.' + j} kind={e.kind} n={e.kind === 'move' ? e.n : null}
              head={e.kind === 'move' ? e.what : e.kind === 'hint' ? 'Hint, ' + PGE_RUNG[e.rung] : 'Picked up: ' + e.what}
              w={e.kind === 'move' ? pgeOutWord(e) : ''} said={e.kind === 'item' ? null : pgeSaid(e)}
              hi={cur && cur.id !== 'stall' && e.kind === 'move' && cur.move === e.n} />)}
            {st.lock && st.lock.story && <Line id={i + '.s'} kind="story" head={st.lock.exit ? 'How it ends' : 'The story so far'} said={st.lock.story} />}
          </ol>
        </section>
      ))}
    </div>
  );
};
const Pge3Doors = ({ m }) => (
  <div className="pge3-doors" role="img" aria-label={pgePlural(m.locks.length, 'lock', 'locks') + ' open so far'}>
    {m.locks.map((lk) => <PgeDoor key={lk.key} w={14} h={24} />)}<span className="pge3-you" />
  </div>
);
const Pge3Body = ({ s, sid }) => {
  const m = React.useMemo(() => pgeBuild(s, sid), [s, sid]);
  const ref = React.useRef(null); const W = usePgeWidth(ref); const wide = W >= 720;
  const mos = React.useMemo(() => pgeMoments(m), [m]); const [sel, setSel] = React.useState(null); const cur = mos.find((x) => x.id === sel);
  // On the squares: a door for a moment on a lock; the minutes between the doors for the longest stretch.
  let hi = null;
  if (cur && !m.live) { const lk = m.locks.find((l) => l.key === cur.lock); const prev = m.locks[lk.index - 2];
    hi = cur.id === 'stall' ? { from: (prev ? prev.minute : 0) + 1, to: lk.minute, door: lk.minute } : { door: lk.minute }; }
  const onMove = (n) => { const mo = mos.find((x) => x.move === n); if (mo) setSel(mo.id); };
  return (
    <section className="pge-card pge3" ref={ref} aria-label="How you got out">
      <h2 className="mcp-t-sec">{pgeHead(m)}</h2>
      {m.live ? <><p className="gs-muted">Your minutes show once you’re out.</p>{m.locks.length > 0 && <Pge3Doors m={m} />}</>
        : (W > 0 && <><Pge3Grid m={m} cols={wide ? m.par : 10} hi={hi} onDoor={(lk) => setSel(pgeNextMoment(mos, sel, (x) => x.lock === lk.key))} /><p className="pge-cap">Each square is a minute. A door marks the minute a lock gave way.</p></>)}
      <PgeMoments list={mos} sel={sel} onSel={(id) => setSel(sel === id ? null : id)} />
      <div className="pge-sub">
        <h3 className="pge-h3">Every move</h3>
        <Pge3Ledger m={m} two={wide} cur={cur} onMove={onMove} />
      </div>
    </section>
  );
};
const Pge3Pic = ({ m }) => (m.live ? <Pge3Doors m={m} /> : <Pge3Grid m={m} cols={m.par} small />);
Object.assign(window, { Pge3Body, Pge3Pic });
