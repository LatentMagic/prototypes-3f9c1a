// ============================================================================
// Playground (1236), v2: the lock row. One bar from going in to getting out; the cover's door, taller than the bar, at the minute
// each lock gave way; par a broken tick above and below. Three versions of it for the library card, and the session page's main
// card is the same row at page size with more on each door. Reads the play model in pg-es-core.jsx.
// ============================================================================
const PG2_FONT = '"Hanken Grotesk", system-ui, sans-serif';

// The model, plus what v2 reads: lock minutes while in progress, the bar's end, misses per lock, and moments with the either-or.
const pg2Model = (s, sid) => {
  const m = pgeBuild(s, sid);
  if (m.live) { const t = PGE_TIMES['escape-week']; m.locks.forEach((lk, i) => { lk.minute = t.opened[i]; }); }
  m.end = m.live ? (m.locks.length ? m.locks[m.locks.length - 1].minute : 0) : m.min;
  const mos = pgeMoments(m); const close = mos.find((x) => x.id === 'close');
  m.locks.forEach((lk) => { lk.misses = 0; lk.marks = 0; });
  m.stretches.forEach((st) => st.entries.forEach((e) => {
    if (e.out !== 'near' && e.out !== 'part') return; e.lock.misses = (e.lock.misses || 0) + 1;
    if (!(close && close.move === e.n)) e.lock.marks = (e.lock.marks || 0) + 1;
  }));
  // The either-or rides on the way out as one short line: it names the exit not taken, nothing about how to find either.
  m.mos = mos.map((mo) => { const lk = m.locks.find((l) => l.key === mo.lock); return mo.id === 'out' && lk && lk.closed ? { ...mo, sub: mo.sub + '. ' + lk.closed + ' closed.' } : mo; });
  return m;
};
const pg2Result = (m) => (m.live ? { kind: 'live', label: 'In progress' }
  : m.min < m.par ? { kind: 'ok', label: 'Escaped, ' + (m.par - m.min) + ' min under par' }
  : m.min === m.par ? { kind: 'ok', label: 'Escaped on par' }
  : { kind: 'over', label: 'Escaped, ' + (m.min - m.par) + ' min over par' });
const pg2Facts = (m) => (m.live
  ? pgePlural(m.moves, 'move', 'moves') + ' so far · ' + pgePlural(m.locks.length, 'lock', 'locks') + ' open'
  : pgePlural(m.moves, 'move', 'moves') + ' · ' + (m.hints ? pgePlural(m.hints, 'hint', 'hints') : 'No hints'));
const Pg2Res = ({ m }) => { const r = pg2Result(m); return (
  <p className="pg2-res"><span className={'lb-v is-' + r.kind}>{r.kind === 'ok' && <DS.Icon name="check" size={20} />}{r.label}</span><span className="gs-muted">{pg2Facts(m)}</span></p>
); };
// A lock's facts at page size, in words: the minute, tries, hint, misses.
// While a room is in progress the minutes are hidden (owner, 2026-10-27).
const pg2LockFacts = (lk, v, live) => [live ? null : (v === 2 && lk.exit ? 'Out at minute ' : 'Minute ') + lk.minute, pgeTries(lk), lk.hints ? pgeHint(lk) : null,
  lk.misses ? pgePlural(lk.misses, 'near miss', 'near misses') : null].filter(Boolean).join(' · ');

const Pg2Line = ({ m, v, page, hi }) => {
  const ref = React.useRef(null); const W = usePgeWidth(ref);
  const narrow = page && W < 560;
  const BAR = page ? 32 : 24, OH = 8, ROW = 20, DW = page ? 12 : 10, NUM = page ? 24 : 20;
  const span = Math.max(m.end, m.par); const max = v === 3 ? span : span * 1.06; const x = (t) => Math.round((t / max) * W);
  // Above the bar: par, and the way out (1) or the minutes either side of par (3).
  const tops = [{ k: 'par', text: 'Par ' + m.par + ' min', at: x(m.par), align: 'end' }];
  if (v === 1 && !m.live) tops.push({ k: 'out', text: 'Out ' + m.min + ' min', at: x(m.min) + DW / 2, align: 'end', strong: true });
  if (v === 3 && !m.live && m.min !== m.par) { const a = x(Math.min(m.min, m.par)), b = x(Math.max(m.min, m.par)); tops.push({ k: 'gap', text: m.over ? (m.min - m.par) + ' min over' : (m.par - m.min) + ' min spare', at: (a + b) / 2, align: 'mid', strong: true }); }
  tops.forEach((t) => {
    t.w = pgeMeasure(t.text, (t.strong ? '600 ' : '400 ') + '13px ' + PG2_FONT);
    t.l = t.align === 'mid' ? t.at - t.w / 2 : t.at - t.w; if (t.l < 0) t.l = t.align === 'mid' ? 0 : t.at; if (t.l + t.w > W) t.l = W - t.w;
  });
  const tSorted = tops.slice().sort((a, b) => a.l - b.l); pgeRows(tSorted).forEach((r, i) => { tSorted[i].r = r; });
  const nTop = Math.max(...tops.map((t) => t.r)) + 1; const TOP = nTop * ROW; const T = TOP + (page ? 22 : 14);
  // Under the bar: each door's number, with its name (2, and every page) and its facts (page).
  const named = v === 2 || (page && !narrow); const facts = page && !narrow;
  const labs = m.locks.map((lk) => {
    const xx = x(lk.minute); const name = !page && v === 2 && lk.exit ? 'Out ' + m.min + ' min' : lk.short.toLowerCase();
    const nameFont = (page ? '600 15px ' : (lk.exit && v === 2 ? '600 ' : '400 ') + '14px ') + PG2_FONT;
    const tw = named ? Math.max(pgeMeasure(name, nameFont), facts ? pgeMeasure(pg2LockFacts(lk, v, m.live), '400 13px ' + PG2_FONT) : 0) : 0;
    const w = named ? NUM + 8 + tw : NUM; let l = xx - NUM / 2; const flip = named && l + w > W; if (flip) l = xx + NUM / 2 - w;
    return { lk, x: xx, w, l: Math.max(0, Math.min(l, W - w)), flip, name };
  });
  const lSorted = labs.slice().sort((a, b) => a.l - b.l); pgeRows(lSorted).forEach((r, i) => { lSorted[i].r = r; });
  const LROW = facts ? 52 : NUM + 8, GAP = 8; const nBot = labs.length ? Math.max(...labs.map((b) => b.r)) + 1 : 0;
  const H = T + BAR + OH + (nBot ? GAP + nBot * LROW : 4);
  const trackW = v === 3 ? x(span) : W;
  const label = m.live ? 'In progress. ' + pgePlural(m.locks.length, 'lock', 'locks') + ' open.' : 'Out at minute ' + m.min + ', par ' + m.par + '. Locks opened at minutes ' + m.locks.map((l) => l.minute).join(', ') + '.';
  return (<>
    <div className={'pg2-line' + (page ? ' is-page' : '')} ref={ref} style={{ height: H }} role="img" aria-label={label}>
      {W > 0 && <>
        {tops.map((t) => <span key={t.k} className={'pg2-top' + (t.strong ? ' is-strong' : '')} style={{ top: t.r * ROW, left: t.l }}>{t.text}</span>)}
        <span className="pg2-track" style={{ top: T, height: BAR, width: trackW }} />
        <span className="pg2-fill" style={{ top: T, height: BAR, width: m.over ? x(m.par) : x(m.end) }} />
        {m.over && <span className="pg2-fill is-over" style={{ top: T, height: BAR, left: x(m.par), width: x(m.end) - x(m.par) }} />}
        {m.live && <span className="pg2-tail" style={{ top: T, height: BAR, left: x(m.end) }} />}
        {(() => { const pr = tops.find((t) => t.k === 'par'); const px = Math.min(x(m.par), W - 2); return <>
          <span className="pg2-par" style={{ left: px, top: pr.r * ROW + ROW, height: T - (pr.r * ROW + ROW) - 2 }} />
          <span className="pg2-par" style={{ left: px, top: T + BAR + 2, height: OH + 4 }} />
        </>; })()}
        {m.locks.map((lk) => { const xx = x(lk.minute); return <React.Fragment key={lk.key}>
          <span className={'pg2-door' + (hi === lk.key ? ' pge-hi' : '')} style={{ left: xx - DW / 2, top: T - OH }}><PgeDoor w={DW} h={BAR + OH * 2} /></span>
          {page && lk.marks > 0 && <span className="pg2-marks" style={{ left: xx, top: T - OH - 9 }} title={pgePlural(lk.marks, 'near miss', 'near misses')}>{Array.from({ length: lk.marks }, (_, k) => <i key={k} />)}</span>}
        </React.Fragment>; })}
        {labs.map((b) => { const top = T + BAR + OH + GAP + b.r * LROW; return <React.Fragment key={b.lk.key}>
          {b.r > 0 && <span className="pg2-lead" style={{ left: b.x, top: T + BAR + OH, height: top - (T + BAR + OH) }} />}
          <span className={'pg2-lab' + (b.flip ? ' is-flip' : '') + (hi === b.lk.key ? ' is-hi' : '') + (b.lk.exit && v === 2 && !page ? ' is-out' : '')} style={{ left: b.l, top, width: b.w }}>
            <PgeNum n={b.lk.index} size={NUM} />
            {named && <span className="pg2-labt"><b>{b.name}</b>{facts && <span>{pg2LockFacts(b.lk, v, m.live)}</span>}</span>}
          </span>
        </React.Fragment>; })}
      </>}
    </div>
    {narrow && <Pg2Locks m={m} v={v} />}
  </>);
};
// Below the row on a narrow page: each door's facts, in a list keyed by its number.
const Pg2Locks = ({ m, v }) => (
  <ol className="pg2-locks" aria-label="Locks, in the order they opened">
    {m.locks.map((lk) => <li key={lk.key}><PgeNum n={lk.index} size={24} /><span><b>{lk.short.toLowerCase()}</b><span className="pge-cap">{pg2LockFacts(lk, v, m.live)}</span></span></li>)}
  </ol>
);

// ---- The library card. The store's frame (label, title, Share, the record link, next room), less the rule and "See what's
// out for you to play" under it. One result line in place of the head's result and the sentence under the picture. ----
const Pg2Card = ({ c }) => {
  const gs = useGs(); const { opt: v } = usePge(); const sid = pgeSid(gs); const s = GS_SESSIONS[sid]; const m = pg2Model(s, sid);
  const lines = m.live ? null : gsShareText(s);
  return (
    <section className={'lb-card pg2-now pg2-v' + v}>
      <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{c.title}</h2>{v === 2 && <Pg2Res m={m} />}</div>
      <Pg2Line m={m} v={v} />
      {v !== 2 && <Pg2Res m={m} />}
      <div className="lb-foot">
        <div className="lb-acts">
          {lines && <LbShare lines={lines} />}
          <DS.TextLink onClick={() => gs.go('session', { id: sid })}>{m.live ? 'See your moves so far' : 'See every move'}</DS.TextLink>
        </div>
        <span className="gs-muted">{c.next}</span>
      </div>
    </section>
  );
};

// ---- The session page: the same row at page size, the moments under it, then Every move as the store's plain list, collapsed.
// Every move is not part of this playground and is the same in every version. ----
const Pg2Body = ({ s, sid }) => {
  const { opt: v } = usePge(); const m = React.useMemo(() => pg2Model(s, sid), [s, sid]);
  const [sel, setSel] = React.useState(null);
  const mo = m.mos.find((x) => x.id === sel);
  return <>
    <section className="pge-card pg2-sess" aria-label="How you got out">
      <h2 className="mcp-t-sec">{pgeHead(m)}</h2>
      <Pg2Line m={m} v={v} page hi={mo && mo.lock} />
      <PgeMoments list={m.mos} sel={sel} onSel={(id) => setSel(sel === id ? null : id)} />
    </section>
    <section className="pg2-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};

Object.assign(window, { pg2Model, pg2Result, Pg2Line, Pg2Card, Pg2Body });
