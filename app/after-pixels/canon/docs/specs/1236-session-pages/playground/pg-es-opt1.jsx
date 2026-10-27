// ============================================================================
// Playground (1236): option 1, The line. One bar from going in to getting out, a door where each lock gave way, par a thin mark.
// The words under each door say what the lock cost. Every move is a row of squares in the order you made them, the doors between,
// read one at a time. The library card carries the same bar at its own size.
// ============================================================================
const PGE_FONT_T = '"Hanken Grotesk", system-ui, sans-serif';

const Pge1Line = ({ m, wide, compact, hi }) => {
  const ref = React.useRef(null); const W = usePgeWidth(ref);
  const max = Math.max(m.min, m.par) * 1.05; const x = (t) => Math.round((t / max) * W);
  const BAR = compact ? 24 : 32, ROW = 20;
  const top = [
    { k: 'out', text: 'Out at ' + m.min + ' min', at: m.min, strong: true },
    { k: 'par', text: 'Par ' + m.par + ' min', at: m.par },
  ].map((t) => { const w = pgeMeasure(t.text, (t.strong ? '600 ' : '400 ') + '13px ' + PGE_FONT_T); const xx = x(t.at); return { ...t, x: xx, w, l: xx - w >= 0 ? xx - w : xx, right: xx - w >= 0 }; })
    .sort((a, b) => a.l - b.l);
  const topRows = pgeRows(top); top.forEach((t, i) => { t.r = topRows[i]; });
  const nTop = Math.max(...topRows) + 1, T = nTop * ROW + 8;
  const labs = compact ? [] : m.locks.map((lk) => {
    const xx = x(lk.minute);
    const w = wide ? 30 + Math.max(pgeMeasure(lk.name, '600 14px ' + PGE_FONT_T), pgeMeasure('Minute ' + lk.minute + ' · ' + pgeFacts(lk), '400 13px ' + PGE_FONT_T)) : 22;
    const flip = xx - 11 + w > W; return { lk, x: xx, w, flip, l: flip ? xx + 11 - w : Math.max(0, xx - 11) };
  });
  const order = labs.slice().sort((a, b) => a.l - b.l); const rr = pgeRows(order); order.forEach((b, i) => { b.r = rr[i]; });
  const LROW = wide ? 48 : 30, GAP = 12;
  const nBot = labs.length ? Math.max(...labs.map((b) => b.r)) + 1 : 0;
  const H = T + BAR + (nBot ? GAP + nBot * LROW : 0);
  const label = 'Out at minute ' + m.min + ', par ' + m.par + '. Locks opened at minutes ' + m.locks.map((l) => l.minute).join(', ') + '.';
  return (
    <div className="pge1-line" ref={ref} style={{ height: H }} role="img" aria-label={label}>
      {W > 0 && <>
        {top.map((t) => <span key={t.k} className={'pge1-top' + (t.strong ? ' is-strong' : '')} style={{ top: t.r * ROW, left: t.l }}>{t.text}</span>)}
        <span className="pge1-par" style={{ left: x(m.par), top: top.find((t) => t.k === 'par').r * ROW + 18, height: T + BAR + 6 - (top.find((t) => t.k === 'par').r * ROW + 18) }} />
        <span className="pge1-bar" style={{ top: T, height: BAR }}><i style={{ width: x(m.min) }} /></span>
        {m.locks.map((lk) => <span key={lk.key} className={'pge1-at' + (hi === lk.key ? ' pge-hi' : '')} style={{ left: x(lk.minute) - 6, top: T }}><PgeDoor w={12} h={BAR} /></span>)}
        {labs.map((b) => <React.Fragment key={b.lk.key}>
          <span className="pge1-lead" style={{ left: b.x, top: T + BAR, height: GAP + b.r * LROW + (wide ? 4 : 0) }} />
          <span className={'pge1-lab' + (b.flip ? ' is-flip' : '') + (hi === b.lk.key ? ' is-hi' : '')} style={{ left: b.l, top: T + BAR + GAP + b.r * LROW, width: b.w }}>
            <PgeNum n={b.lk.index} />
            {wide && <span className="pge1-labt"><b>{b.lk.name}</b><span>{'Minute ' + b.lk.minute + ' · ' + pgeFacts(b.lk)}</span></span>}
          </span>
        </React.Fragment>)}
      </>}
    </div>
  );
};

// Every move as a square, numbered, in the order you made it; a door after the move that opened a lock.
const pge1Moves = (m) => {
  const out = []; m.stretches.forEach((st) => st.entries.forEach((e) => {
    if (e.kind === 'move') out.push({ e, extra: [], door: null }); else if (out.length) out[out.length - 1].extra.push(e);
    if (st.lock && e.n === st.lock.move) out[out.length - 1].door = st.lock;
  }));
  return out;
};
const Pge1Strip = ({ list, sel, onSel, run }) => (
  <div className="pge1-strip" role={onSel ? 'group' : 'img'} aria-label={onSel ? 'Every move, in order' : pgePlural(list.length, 'move', 'moves') + ' so far'}>
    {list.map((it, i) => <React.Fragment key={it.e.n}>
      {onSel ? <button type="button" className={'pge1-sq' + (run && run.includes(it.e.n) ? ' is-run' : '')} aria-pressed={sel === i} aria-label={'Move ' + it.e.n + ', ' + it.e.what} onClick={() => onSel(i)}>{it.e.n}</button>
        : <span className="pge1-sq is-still" aria-hidden="true">{it.e.n}</span>}
      {it.door && <span className="pge1-sep" title={it.door.name}><PgeDoor w={10} h={onSel ? 32 : 24} /></span>}
    </React.Fragment>)}
  </div>
);
const Pge1Detail = ({ list, i, onSel }) => {
  const it = list[i]; if (!it) return null; const e = it.e; const w = pgeOutWord(e);
  return (
    <div className="pge1-detail">
      <span className="gs-label">{'MOVE ' + e.n + ' OF ' + list.length}</span>
      <p className="pge-act">{e.what}{w ? <span className="pge-out">{' · ' + w}</span> : null}</p>
      <PgeReply e={e} />
      {it.door && <p className="pge-extra"><PgeDoor w={8} h={14} />{it.door.exit ? 'You were out.' : it.door.name + ' opened.'}</p>}
      {it.door && it.door.story && <p className="pge-story">{it.door.story}</p>}
      {it.door && it.door.closed && <p className="pge-extra">{'You took ' + it.door.name.toLowerCase() + '. ' + it.door.closed + ' closed for good.'}</p>}
      {it.extra.map((x, k) => <p key={k} className="pge-extra"><b>{x.kind === 'hint' ? 'Hint, ' + PGE_RUNG[x.rung] : 'Picked up'}</b>{' · ' + (x.kind === 'hint' ? x.res : x.what)}</p>)}
      <DS.ButtonPair>
        <DS.Button variant="secondary" disabled={i === 0} onClick={() => onSel(i - 1)}>Previous move</DS.Button>
        <DS.Button variant="secondary" disabled={i === list.length - 1} onClick={() => onSel(i + 1)}>Next move</DS.Button>
      </DS.ButtonPair>
    </div>
  );
};
const PgeLockList = ({ m, minutes }) => (
  <ol className="pge-locks" aria-label="Locks, in the order they opened">
    {m.locks.map((lk) => <li key={lk.key}><PgeNum n={lk.index} size={24} /><span><b>{lk.name}</b><span className="pge-cap">{(minutes && lk.minute ? 'Minute ' + lk.minute + ' · ' : '') + pgeFacts(lk)}</span></span></li>)}
  </ol>
);

const Pge1Body = ({ s, sid }) => {
  const m = React.useMemo(() => pgeBuild(s, sid), [s, sid]);
  const ref = React.useRef(null); const W = usePgeWidth(ref); const wide = W >= 600;
  const list = React.useMemo(() => pge1Moves(m), [m]); const [sel, setSel] = React.useState(0);
  // A moment is a move: picking one steps the move reader to it, and stepping onto a moment's move lights the moment.
  const mos = React.useMemo(() => pgeMoments(m), [m]);
  const cur = list[sel] && mos.find((mo) => mo.move === list[sel].e.n);
  const pick = (id) => { const mo = mos.find((x) => x.id === id); const i = mo ? list.findIndex((it) => it.e.n === mo.move) : -1; if (i >= 0) setSel(i); };
  return (
    <section className="pge-card pge1" ref={ref} aria-label="How you got out">
      <h2 className="mcp-t-sec">{pgeHead(m)}</h2>
      {m.live ? <p className="gs-muted">Your time against par shows once you’re out.</p> : (W > 0 && <Pge1Line m={m} wide={wide} hi={cur && cur.lock} />)}
      {(m.live || !wide) && m.locks.length > 0 && <PgeLockList m={m} minutes />}
      <PgeMoments list={mos} sel={cur && cur.id} onSel={pick} />
      <div className="pge-sub">
        <h3 className="pge-h3">Every move</h3>
        <Pge1Strip list={list} sel={sel} onSel={setSel} run={cur && cur.run} />
        <Pge1Detail list={list} i={sel} onSel={setSel} />
      </div>
    </section>
  );
};
const Pge1Pic = ({ m }) => (m.live ? <Pge1Strip list={pge1Moves(m)} /> : <Pge1Line m={m} compact />);

Object.assign(window, { Pge1Body, Pge1Pic, PgeLockList });
