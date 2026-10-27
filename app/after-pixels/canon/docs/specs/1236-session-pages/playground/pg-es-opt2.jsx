// ============================================================================
// Playground (1236): option 2, The rail. The play stands on one upright line, read top to bottom: in, the moves, a door
// at each lock with its minute beside it, par where it fell, out. The moves live on the line itself, folded per stretch on a
// phone and open on a wide page. The library card lays the same line on its side: a door per lock, its minute under it.
// ============================================================================
const pge2Rows = (m) => {
  const rows = [{ k: 'in', id: 'in' }];
  m.stretches.forEach((st, i) => { rows.push({ k: 'moves', id: 'm' + i, st }); if (st.lock) rows.push({ k: 'lock', id: 'l' + i, lk: st.lock }); });
  if (!m.live) {
    const at = rows.findIndex((r) => r.k === 'lock' && r.lk.minute > m.par);
    const par = { k: 'par', id: 'par' };
    if (at < 0) rows.push(par); else { let j = at; while (j > 0 && rows[j - 1].k === 'moves') j -= 1; rows.splice(j, 0, par); }
  } else rows.push({ k: 'now', id: 'now' });
  return rows;
};
// Spoiler call: what you did and how it went is shown; the room's words (replies, near misses, readings, hints, story) wait
// behind one switch for the whole page, off by default, so a screenshot of the page gives no clue away.
const Pge2Moves = ({ st, words, hiMove, onMove }) => (
  <ol className="pge2-moves">
    {st.entries.map((e, i) => {
      const said = e.kind === 'item' ? null : pgeSaid(e); const tap = onMove && e.kind === 'move' && onMove(e.n, true);
      const body = <>
        <span className="pge2-mn">{e.kind === 'move' ? 'Move ' + e.n : e.kind === 'hint' ? 'Hint' : 'Item'}</span>
        <span className="pge2-mb">
          <span className="pge-act">{e.kind === 'move' ? e.what : e.kind === 'hint' ? PGE_RUNG[e.rung].charAt(0).toUpperCase() + PGE_RUNG[e.rung].slice(1) : 'Picked up: ' + e.what}
            {e.kind === 'move' && pgeOutWord(e) ? <span className="pge-out">{' · ' + pgeOutWord(e)}</span> : null}</span>
          {words && said ? <p className="pge-said">{said}</p> : null}
        </span>
      </>;
      return (
        <li key={i} className={'pge2-mv is-' + e.kind + (hiMove === e.n && e.kind === 'move' ? ' is-hi' : '')}>
          {tap ? <button type="button" className="pge2-mvb" onClick={() => onMove(e.n)}>{body}</button> : body}
        </li>
      );
    })}
  </ol>
);
const Pge2Body = ({ s, sid }) => {
  const m = React.useMemo(() => pgeBuild(s, sid), [s, sid]);
  const ref = React.useRef(null); const W = usePgeWidth(ref); const wide = W >= 720;
  const rows = React.useMemo(() => pge2Rows(m), [m]);
  const mos = React.useMemo(() => pgeMoments(m), [m]);
  const [open, setOpen] = React.useState({}); const [words, setWords] = React.useState(false); const [sel, setSel] = React.useState(null);
  const cur = mos.find((x) => x.id === sel);
  const isOpen = (id) => (open[id] != null ? open[id] : wide);
  // A moment lights its place: a door row for the first try and the way out, the stretch (and its move) for the closest miss and the longest stretch.
  const lockHi = (lk) => cur && cur.lock === lk.key && (cur.id === 'first' || cur.id === 'out');
  const runHi = (i) => cur && (cur.id === 'stall' || cur.id === 'close') && cur.si === i;
  const onMove = (n, ask) => { const mo = mos.find((x) => x.id === 'close' && x.move === n); if (ask) return !!mo; if (mo) setSel(mo.id); return null; };
  return (
    <section className="pge-card pge2" ref={ref} aria-label="How you got out">
      <h2 className="mcp-t-sec">{pgeHead(m)}</h2>
      {m.live && <p className="gs-muted">Your time against par shows once you’re out.</p>}
      <PgeMoments list={mos} sel={sel} onSel={(id) => setSel(sel === id ? null : id)} />
      <button type="button" className="pge2-fold pge2-words" aria-pressed={words} onClick={() => setWords(!words)}>
        <span>{words ? 'Hide what the room said' : 'Show what the room said'}</span>
      </button>
      <ol className="pge2-rail" data-wide={wide ? 1 : undefined}>
        {rows.map((r, i) => {
          const last = i === rows.length - 1;
          if (r.k === 'moves') {
            const si = Number(r.id.slice(1)); const o = isOpen(r.id); const n = r.st.moves;
            return (
              <li key={r.id} className={'pge2-row is-moves' + (runHi(si) && !o ? ' is-hi' : '')}>
                <span className="pge2-g" /><span className="pge2-s" />
                <div className={'pge2-c' + (runHi(si) && o ? ' is-run' : '')}>
                  <button type="button" className="pge2-fold" aria-expanded={o} onClick={() => setOpen({ ...open, [r.id]: !o })}>
                    <span>{pgePlural(n, 'move', 'moves')}</span><DS.Icon name="down" size={20} />
                  </button>
                  {o && <Pge2Moves st={r.st} words={words} hiMove={cur && cur.id === 'close' && cur.si === si ? cur.move : null} onMove={onMove} />}
                </div>
              </li>
            );
          }
          const lk = r.lk; const has = r.k === 'lock' && mos.some((x) => x.lock === lk.key);
          const name = r.k === 'lock' && <span className="pge2-name"><PgeNum n={lk.index} />{lk.name}{lk.exit ? <span className="pge-out">{' · Out'}</span> : null}</span>;
          return (
            <li key={r.id} className={'pge2-row is-' + r.k + (last ? ' is-last' : '') + (r.k === 'lock' && lockHi(lk) ? ' is-hi' : '')}>
              <span className="pge2-g">{r.k === 'lock' && lk.minute ? lk.minute + ' min' : r.k === 'par' ? m.par + ' min' : ''}</span>
              <span className="pge2-s">{r.k === 'lock' ? <PgeDoor w={14} h={24} /> : <i />}</span>
              <div className="pge2-c">
                {r.k === 'in' && <span className="pge-cap">In</span>}
                {r.k === 'par' && <span className="pge-cap">Par</span>}
                {r.k === 'now' && <span className="pge-cap">Still in the room</span>}
                {r.k === 'lock' && <>
                  {has ? <button type="button" className="pge2-lockb" onClick={() => setSel(pgeNextMoment(mos, sel, (x) => x.lock === lk.key))}>{name}</button> : name}
                  <span className="pge-cap">{pgeFacts(lk)}</span>
                  {lk.closed && <span className="pge-cap">{lk.closed + ' closed for good.'}</span>}
                  {words && lk.story && <p className="pge-story">{lk.story}</p>}
                </>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
// The card's line on its side: a door per lock, its minute under it, par where it fell, out at the end.
const Pge2Pic = ({ m }) => {
  const items = [];
  m.locks.forEach((lk) => { if (!m.live && lk.minute > m.par && !items.some((x) => x.k === 'par')) items.push({ k: 'par' }); items.push({ k: 'lock', lk }); });
  if (!m.live && !items.some((x) => x.k === 'par')) items.push({ k: 'par' });
  if (m.live) items.push({ k: 'now' });
  return (
    <ol className="pge2-mini" aria-label={m.live ? pgePlural(m.locks.length, 'lock', 'locks') + ' open so far' : 'Locks opened at minutes ' + m.locks.map((l) => l.minute).join(', ') + ', par ' + m.par}>
      {items.map((x, i) => <li key={i} className={'is-' + x.k}>
        <span className="pge2-mk">{x.k === 'lock' ? <PgeDoor w={12} h={20} /> : <i />}</span>
        <span className="pge2-mt">{x.k === 'lock' ? (m.live ? x.lk.index : x.lk.minute) : x.k === 'par' ? 'Par ' + m.par : ''}</span>
      </li>)}
    </ol>
  );
};
Object.assign(window, { Pge2Body, Pge2Pic });
