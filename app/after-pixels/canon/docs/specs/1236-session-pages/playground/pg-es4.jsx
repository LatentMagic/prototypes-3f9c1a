// ============================================================================
// Playground (1236), v4 (rebuilt from v3's Design 1 to v4-goal.md): three designs each of the result, how the escape is shown,
// and hover, picked independently; the lock detail laid across the width on desktop. Reuses pg-es-core.jsx and pg2Model.
// ============================================================================
const PG4_D = [
  { n: 1, name: 'Ledger', stance: 'The lock’s tries as one table across the card: try, tiles, what the room said back, its reply. Rules run the full width, so every row lines up with the last. The table keeps the height of the play’s busiest lock, so nothing below it jumps when you pick another door.', cost: 'A table, so it reads as a record more than as a room.' },
  { n: 2, name: 'The stretch, zoomed', stance: 'The stretch of the line that ends at the door you picked opens out below it, edge to edge: every move in it, in order, one column each. Looking, trying, a hint, the opening. The same strip every time; only the number of columns changes.', cost: 'Columns get narrow on a long stretch; replies are cut to three lines.' },
  { n: 3, name: 'Every lock at once', stance: 'All the locks side by side under the line, in the order they opened, each with its tries. Picking a door lights its column. Nothing appears or disappears when you pick, so the card never changes shape.', cost: 'The room’s replies are left to the column you pick; a room with many locks makes narrow columns.' },
];
const PG4_R = [
  { n: 1, name: 'Sentence', stance: 'One H2 says it all: “Escaped in 28 min”. Under it, par and what that left: “Par 30 min · 2 min to spare”.', cost: 'Everything rides on one line of type; the minutes are read, not seen.' },
  { n: 2, name: 'Three figures', stance: '“Escaped” as the H2, then three figures side by side: when you got out, par, and the minutes to spare (or over).', cost: 'Three numbers compete; the line below already shows two of them.' },
  { n: 3, name: 'Time first', stance: 'Your time, large, is the first thing you read. “Escaped” and par sit beside it.', cost: 'The figure is the biggest type in the card, bigger than its heading.' },
];
const PG4_E = [
  { n: 1, name: 'Plain door', stance: 'The exit is a door like every other on the line, with “Out 28 min” under it. No symbol anywhere: the words say you escaped.', cost: 'Nothing on the line marks the last door as the way out except its label.' },
  { n: 2, name: 'Door left open', stance: 'The exit is the same door, left open: the frame empty, the leaf swung out. The same open door sits in the heading at text size, before “Escaped”.', cost: 'A small symbol in the heading, the one place v3’s went wrong; this one is the line’s own door, not a new picture.' },
  { n: 3, name: 'Daylight', stance: 'Past the exit door the line is lit cream to its end: outside. “Escaped” is set in the same cream.', cost: 'Over par, the exit is near the line’s end, so the daylight is a short strip.' },
];
const PG4_H = [
  { n: 1, name: 'Lift', stance: 'The door rises and gains a ring; its number turns solid.', cost: 'Motion on a small target; with reduced motion it is the ring alone.' },
  { n: 2, name: 'Door opens', stance: 'The door swings open on cream light; its number turns cream.', cost: 'Uses the same cream as a lit tile, so it reads as “open”.' },
  { n: 3, name: 'Stretch lights', stance: 'The stretch of the line leading to that door lights up, so you see how long that lock took before you click; its number turns solid.', cost: 'The highest-contrast of the three; it lights a stretch, not the door.' },
];
const PG4_STATES = [['under', 'Under'], ['par', 'On par'], ['over', 'Over'], ['live', 'Inside']];
// A third sample play, v4 only: this week's moves, out at exactly par (30 min). Exactly par counts as under (Escape spec).
GS_SESSIONS['escape-par'] = { ...GS_SESSIONS['escape-week'], figures: ['30 min, on par', '1 hint', '2 wrong tries'] };
PGE_TIMES['escape-par'] = { min: 30, opened: [7, 18, 21, 30] };
PGE_REC['escape-par'] = PGE_REC['escape-week'];
const pg4Sid = (gs) => (gs.review.week === 'live' ? 'escape-live' : ({ over: 'escape-over', par: 'escape-par' })[PgeStore.get().finish] || 'escape-week');
const PG4_F = '"Hanken Grotesk", system-ui, sans-serif';

// ---- The model: v2's play, plus each lock's tries as the spec has them. A typed lock answers right or wrong (a near miss is
// the room's reply, still wrong); a mechanism answers with a count. ----
const pg4Slots = (e) => { const r = /\((\d+) /.exec(e.what); return r ? Number(r[1]) : 0; };
const pg4Build = (s, sid) => {
  const m = pg2Model(s, sid);
  m.locks.forEach((lk) => { lk.rows = []; });
  m.stretches.forEach((st) => st.entries.forEach((e) => {
    if (e.kind === 'hint' && e.lock && e.lock.rows) e.lock.rows.push({ k: 'hint', rung: e.rung });
    else if (e.kind === 'move' && e.lock && e.lock.rows && ['wrong', 'near', 'part', 'open', 'out'].includes(e.out)) e.lock.rows.push({ k: 'try', e, n: e.n, slots: pg4Slots(e) });
  }));
  m.stretches.forEach((st) => { if (st.lock) st.lock.steps = st.entries.filter((e) => e.kind === 'move' || e.kind === 'hint'); });
  m.locks.forEach((l) => { let h = null; l.tries4 = []; l.rows.forEach((r) => { if (r.k === 'hint') h = r.rung; else { l.tries4.push({ ...r, hint: h }); h = null; } }); });
  m.maxTries = Math.max(1, ...m.locks.map((l) => l.tries4.length));
  m.maxSaid = Math.max(0, ...m.locks.map((l) => l.rows.filter((r) => r.k === 'try' && (r.e.out === 'near' || r.e.out === 'part')).length));
  m.mo = Object.fromEntries(m.mos.map((x) => [x.id, x]));
  return m;
};
const pg4Figs = (m) => (m.live
  ? [pgePlural(m.locks.length, 'lock', 'locks') + ' open', pgePlural(m.moves, 'move', 'moves') + ' so far']
  : [pgePlural(m.moves, 'move', 'moves'), m.hints ? pgePlural(m.hints, 'hint', 'hints') : 'No hints', m.wrong ? pgePlural(m.wrong, 'wrong try', 'wrong tries') : 'No wrong tries']).join(' · ');
const pg4Def = (m) => (m.locks.find((l) => l.exit) || m.locks[m.locks.length - 1] || {}).key;
// Exactly par counts as under (Escape spec).
const pg4Gap = (m) => (m.over ? { v: m.min - m.par, l: 'Over par', t: (m.min - m.par) + ' min over' } : m.par === m.min ? { v: 0, l: 'To spare', t: 'out on the minute' } : { v: m.par - m.min, l: 'To spare', t: (m.par - m.min) + ' min to spare' });

// The exit door left open: the frame empty, the leaf swung out. Used on the line and, at text size, in the heading.
const Pg4Open = ({ w, h }) => <span className="pg4-od" style={{ width: w, height: h }} aria-hidden="true"><i><b /></i></span>;

// ---- The line: v3's, par brought in from the edge so its label centres on its tick, "Out 28 min" centred under the exit. ----
const Pg4Line = ({ m, sel, onSel, hv, ex, onX }) => {
  const ref = React.useRef(null); const W = usePgeWidth(ref); const [hov, setHov] = React.useState(null);
  const hp = (k) => ({ onMouseEnter: () => setHov(k), onMouseLeave: () => setHov((h) => (h === k ? null : h)), onFocus: () => setHov(k), onBlur: () => setHov((h) => (h === k ? null : h)) });
  const BAR = 28, OH = 8, DW = 14, TOP = 20, NUM = 24, ROW = 32, R = 10, DAY = 64;
  const inner = W - R;
  const parText = 'Par ' + m.par + ' min'; const parW = pgeMeasure(parText, '400 13px ' + PG4_F);
  const outText = 'Out ' + m.min + ' min'; const outW = pgeMeasure(outText, '600 14px ' + PG4_F) + 8;
  const end = m.live ? m.end : m.min;
  const fit = (t, w) => (t * inner) / Math.max(1, W - w / 2 - 2);
  const span = Math.max(Math.max(end || 0, m.par) + (m.live ? 3 : 0), fit(m.par, parW), m.live ? 0 : fit(m.min, outW),
    !m.live && ex === 3 ? (m.min * inner) / Math.max(1, inner - DAY) : 0);
  const x = (t) => Math.round((t / span) * inner);
  const barT = TOP + 6 + OH; const barB = barT + BAR;
  const parX = x(m.par); const endX = x(end);
  const labs = m.locks.map((lk) => { const xx = x(lk.minute); const out = lk.exit && !m.live; const w = out ? outW : NUM;
    return { lk, xx, w, l: Math.max(0, Math.min(xx - w / 2, W - w)), out }; });
  const ls = labs.slice().sort((a, b) => a.l - b.l); pgeRows(ls).forEach((r, i) => { ls[i].r = r; });
  const nRows = labs.length ? Math.max(...labs.map((b) => b.r)) + 1 : 1;
  const labT = barB + OH + 8; const H = labT + nRows * ROW;
  const hl = hv === 3 && hov && m.locks.find((l) => l.key === hov);
  const hlA = hl ? (hl.index > 1 ? x(m.locks[hl.index - 2].minute) : 0) : 0;
  const xsig = W + '|' + labs.map((b) => b.lk.key + ':' + b.xx).join(',');
  React.useEffect(() => { if (onX && W > 0) onX({ W, inner, at: Object.fromEntries(labs.map((b) => [b.lk.key, b.xx])) }); }, [xsig]);
  const label = m.live ? 'In progress. ' + pgePlural(m.locks.length, 'lock', 'locks') + ' open.' : 'Out at minute ' + m.min + ', par ' + m.par + '.';
  return (
    <div className={'pg3-line pg4-hv-' + hv} ref={ref} style={{ height: H }} aria-label={label} role="group">
      {W > 0 && <>
        <span className="pg3-ptxt" style={{ left: Math.round(parX - parW / 2), top: 0 }}>{parText}</span>
        <span className="pg3-ptk" style={{ left: parX - 1, top: TOP, height: barT - TOP - 2 }} />
        <span className="pg3-ptk" style={{ left: parX - 1, top: barB + 2, height: OH + 2 }} />
        <span className="pg3-trk" style={{ top: barT, height: BAR, width: inner }} />
        <span className="pg3-fill" style={{ top: barT, height: BAR, width: m.over ? parX : endX }} />
        {m.over && <span className="pg3-fill is-over" style={{ top: barT, height: BAR, left: parX, width: endX - parX }} />}
        {!m.live && ex === 3 && <span className="pg4-day" style={{ top: barT, height: BAR, left: endX, width: inner - endX }} />}
        {hl && <span className="pg4-st" style={{ top: barT, height: BAR, left: hlA, width: x(hl.minute) - hlA }} />}
        {m.live && <span className="pg3-edge" style={{ top: barT - 4, height: BAR + 8, left: endX - 1 }} />}
        {m.locks.map((lk) => { const xx = x(lk.minute); const out = lk.exit && !m.live; return (
          <button key={lk.key} type="button" className={'pg3-dr' + (sel === lk.key ? ' is-sel' : '') + (hov === lk.key ? ' is-hov' : '') + (out ? ' is-exit' : '')} {...hp(lk.key)} style={{ left: xx - 16, top: barT - OH, height: BAR + OH * 2 }}
            aria-pressed={sel === lk.key} aria-label={lk.name + (m.live ? '' : ', minute ' + lk.minute)} onClick={() => onSel(lk.key)}>
            {out && ex === 2 ? <Pg4Open w={DW} h={BAR + OH * 2} /> : <PgeDoor w={DW} h={BAR + OH * 2} />}
          </button>); })}
        {labs.map((b) => { const top = labT + b.r * ROW; return <React.Fragment key={b.lk.key}>
          {b.r > 0 && <span className="pg3-lead" style={{ left: b.xx, top: barB + OH, height: top - barB - OH }} />}
          <button type="button" className={'pg3-lab' + (b.out ? ' is-out' : '') + (sel === b.lk.key ? ' is-sel' : '') + (hov === b.lk.key ? ' is-hov' : '')} {...hp(b.lk.key)} style={{ left: b.l, top, width: b.w }} aria-hidden="true" tabIndex={-1} onClick={() => onSel(b.lk.key)}>
            {b.out ? outText : <PgeNum n={b.lk.index} size={NUM} />}
          </button>
        </React.Fragment>; })}
      </>}
    </div>
  );
};

// ---- The result. "Escaped" carries the escape design's treatment: nothing, the open door at text size, or daylight cream. ----
const Pg4Esc = ({ ex, children }) => <span className={'pg4-esc' + (ex === 3 ? ' is-lit' : '')}>{ex === 2 && <Pg4Open w={16} h={28} />}{children || 'Escaped'}</span>;
const Pg4Result = ({ m, r, ex }) => {
  const g = pg4Gap(m); const parLine = 'Par ' + m.par + ' min · ' + g.t;
  if (m.live) {
    if (r === 2) return <div className="pg4-res"><h2 className="pg4-h">Still inside</h2>
      <div className="pg4-stats"><div><b>{m.locks.length}</b><span>{m.locks.length === 1 ? 'Lock open' : 'Locks open'}</span></div><div><b>{m.moves}</b><span>Moves so far</span></div></div></div>;
    if (r === 3) return <div className="pg4-res pg4-r3"><span className="pg4-time">{m.locks.length}</span><div className="pg4-r3t"><h2 className="pg4-h">Still inside</h2><p className="pg4-sub">{pgePlural(m.locks.length, 'lock', 'locks') + ' open'}</p><p className="pge-cap">{pgePlural(m.moves, 'move', 'moves') + ' so far'}</p></div></div>;
    return <div className="pg4-res"><h2 className="pg4-h">Still inside</h2><p className="pge-cap">{pg4Figs(m)}</p></div>;
  }
  if (r === 2) return (
    <div className="pg4-res">
      <h2 className="pg4-h"><Pg4Esc ex={ex} /></h2>
      <div className="pg4-stats">
        <div><b>{m.min + ' min'}</b><span>Out in</span></div>
        <div><b>{m.par + ' min'}</b><span>Par</span></div>
        <div><b>{g.v + ' min'}</b><span>{g.l}</span></div>
      </div>
      <p className="pge-cap">{pg4Figs(m)}</p>
    </div>);
  if (r === 3) return (
    <div className="pg4-res pg4-r3">
      <span className="pg4-time">{m.min}<small> min</small></span>
      <div className="pg4-r3t">
        <h2 className="pg4-h"><Pg4Esc ex={ex} /></h2>
        <p className="pg4-sub">{parLine}</p>
        <p className="pge-cap">{pg4Figs(m)}</p>
      </div>
    </div>);
  return (
    <div className="pg4-res">
      <h2 className="pg4-h"><Pg4Esc ex={ex} /><span>{'in ' + m.min + ' min'}</span></h2>
      <p className="pg4-sub">{parLine}</p>
      <p className="pge-cap">{pg4Figs(m)}</p>
    </div>);
};

// ---- The lock you picked: three designs. Each keeps one shape and size whichever door you pick. ----
const pg4Said = (e) => (e.out === 'near' ? e.near : e.out === 'part' ? e.part.said : null);
const pg4Ok = (e) => e.out === 'open' || e.out === 'out';
const pg4Rung = (r) => PGE_RUNG[r].charAt(0).toUpperCase() + PGE_RUNG[r].slice(1);
const pg4LockFacts = (m, lk) => [m.live ? null : (lk.exit ? 'Out at minute ' : 'Minute ') + lk.minute, pgeFacts(lk), lk.exit && lk.closed ? lk.closed + ' closed' : null].filter(Boolean).join(' · ');
const Pg4Tiles = ({ e, slots, size }) => (slots
  ? <span className="pg4-tl" style={{ '--t': size + 'px' }} aria-hidden="true">{Array.from({ length: slots }, (_, j) => <i key={j} className={pg4Ok(e) ? 'is-on' : ''} />)}</span>
  : <span className={'pg4-count' + (pg4Ok(e) ? ' is-on' : '')} style={{ height: size }} aria-hidden="true">{pg4Ok(e) ? 'All set' : e.out === 'part' ? e.part.label.replace(/^(\d+ of \d+).*$/, '$1') : 'None'}</span>);
const Pg4Marks = ({ m, lk, r }) => { const close = m.mo.close && m.mo.close.move === r.n; const first = m.mo.first && m.mo.first.lock === lk.key && pg4Ok(r.e);
  return <>{close && <span className="pg3-mark">Closest miss</span>}{first && <span className="pg3-mark">First try</span>}</>; };
// One line for the lock: number, name, facts. The story sits under it, the same place on every lock.
const Pg4Head = ({ m, lk }) => (
  <div className="pg4-hd">
    <div className="pg4-hr"><div className="pg3-ph"><PgeNum n={lk.index} size={24} /><h3 className="pge-h3">{lk.name}</h3></div><p className="pge-cap">{pg4LockFacts(m, lk)}</p></div>
    {lk.story && <p className="pge-story">{lk.story}</p>}
  </div>);

// 1. Ledger: one row per try, the hint taken before it in its own column. Blank ruled rows up to the play's busiest lock, so
// the table is the same height on every door.
const Pg4Ledger = ({ m, lk, xs }) => { const cx = xs && xs.at[lk.key]; const blanks = Math.max(0, m.maxTries - lk.tries4.length);
  return (
    <div className="pg4-pn" aria-live="polite">
      {cx != null && <i className="pg4-caret" style={{ left: cx - 8 }} aria-hidden="true" />}
      <Pg4Head m={m} lk={lk} />
      <div className="pg4-led" role="table" aria-label={'Tries on ' + lk.name.toLowerCase()}>
        <div className="pg4-lr is-th" role="row"><span>Try</span><span>Answer</span><span>Result</span><span>Hint first</span><span>The room said</span></div>
        {lk.tries4.map((r, i) => (
          <div key={r.n} className="pg4-lr" role="row"><span className="pg4-lc">{i + 1}</span><Pg4Tiles e={r.e} slots={r.slots} size={24} />
            <span className="pg4-word">{pg4Ok(r.e) ? 'Open' : 'Wrong'}<Pg4Marks m={m} lk={lk} r={r} /></span>
            <span className="pg4-lh">{r.hint ? <><i aria-hidden="true" />{pg4Rung(r.hint)}</> : <span className="pg4-dash">None</span>}</span>
            <span className="pg4-said">{pg4Said(r.e) ? '“' + pg4Said(r.e) + '”' : ''}</span></div>))}
        {Array.from({ length: blanks }, (_, i) => <div key={'b' + i} className="pg4-lr is-blank" aria-hidden="true" />)}
      </div>
    </div>); };

// 2. The stretch, zoomed: a funnel from the stretch on the line to a strip of its moves, edge to edge.
const pg4StepWord = (e) => (e.kind === 'hint' ? pg4Rung(e.rung) : ({ look: 'Looked', use: 'Used', wrong: 'Wrong', near: 'Wrong', part: 'Wrong', open: 'Open', out: 'Open' })[e.out] || '');
const pg4StepText = (e) => (e.kind === 'hint' ? '' : (e.out === 'look' || e.out === 'use') ? e.what : pg4Said(e) ? '“' + pg4Said(e) + '”' : '');
const Pg4Zoom = ({ m, lk, xs }) => {
  const steps = lk.steps || []; const W = xs ? xs.W : 0;
  const b = xs ? xs.at[lk.key] : 0; const prev = m.locks[lk.index - 2]; const a = prev && xs ? xs.at[prev.key] : 0;
  let si = 0;
  return (
    <div className="pg4-zw" aria-live="polite">
      {W > 0 && <svg className="pg4-fun" width={W} height={28} aria-hidden="true"><polygon points={a + ',0 ' + b + ',0 ' + W + ',28 0,28'} /></svg>}
      <div className="pg4-zoom" style={{ gridTemplateColumns: steps.map((e) => (e.kind === 'hint' ? 'minmax(64px, .55fr)' : 'minmax(104px, 1fr)')).join(' ') }}>
        {steps.map((e, i) => { const tr = e.kind === 'move' && ['wrong', 'near', 'part', 'open', 'out'].includes(e.out); const row = tr && lk.rows.find((r) => r.n === e.n);
          return (
            <div key={i} className={'pg4-zs' + (e.kind === 'hint' ? ' is-hint' : tr ? (pg4Ok(e) ? ' is-open' : ' is-try') : ' is-look')}>
              <span className="pg4-zn">{e.kind === 'hint' ? 'Hint' : 'Move ' + e.n}</span>
              <span className="pg4-zg">{tr ? <Pg4Tiles e={e} slots={pg4Slots(e)} size={18} /> : e.kind === 'hint' ? <i className="pg4-zh" /> : null}</span>
              <span className="pg4-zwd">{pg4StepWord(e)}</span>
              <span className="pg4-zt">{pg4StepText(e)}</span>
              {row && <span className="pg4-zm"><Pg4Marks m={m} lk={lk} r={row} /></span>}
            </div>); })}
      </div>
      <Pg4Head m={m} lk={lk} />
    </div>); };

// 3. Every lock at once: one column per lock, in the order they opened. Picking a door lights its column.
const Pg4All = ({ m, sel, onSel }) => { const lk = m.locks.find((l) => l.key === sel);
  return (
    <div className="pg4-allw">
      <div className="pg4-all" style={{ gridTemplateColumns: 'repeat(' + m.locks.length + ', minmax(0, 1fr))' }}>
        {m.locks.map((l) => { let t = 0; return (
          <button key={l.key} type="button" className="pg4-col" aria-pressed={sel === l.key} onClick={() => onSel(l.key)}>
            <span className="pg4-ch"><PgeNum n={l.index} size={24} /><b>{l.short}</b></span>
            <span className="pge-cap">{[m.live ? null : 'Minute ' + l.minute, pgeTries(l)].filter(Boolean).join(' · ')}</span>
            <span className="pg4-crows">{l.rows.map((r, i) => (r.k === 'hint'
              ? <span key={'h' + i} className="pg4-cr is-hint"><i aria-hidden="true" />Hint</span>
              : <span key={r.n} className="pg4-cr"><Pg4Tiles e={r.e} slots={r.slots} size={16} /><span>{pg4Ok(r.e) ? 'Open' : 'Wrong'}</span><span className="pg4-crn">{'Try ' + (t += 1)}</span></span>))}</span>
          </button>); })}
      </div>
      {lk && <div className="pg4-allf" aria-live="polite" style={{ minHeight: 64 + m.maxSaid * 28 }}>
        <p className="pge-cap">{[lk.name, pg4LockFacts(m, lk)].join(' · ')}</p>
        {lk.story && <p className="pge-story">{lk.story}</p>}
        {lk.rows.filter((r) => r.k === 'try' && pg4Said(r.e)).map((r) => <p key={r.n} className="pg4-said">{'Move ' + r.n + ': “' + pg4Said(r.e) + '”'}</p>)}
      </div>}
    </div>); };

const Pg4Sess = ({ m, d, r, ex, hv }) => {
  const [sel, setSel] = React.useState(() => pg4Def(m)); const lk = m.locks.find((l) => l.key === sel); const [xs, setXs] = React.useState(null);
  return (
    <section className={'pge-card pg3-sess pg4-d' + d} aria-label="How you got out">
      <Pg4Result m={m} r={r} ex={ex} />
      <Pg4Line m={m} sel={sel} onSel={setSel} hv={hv} ex={ex} onX={setXs} />
      {lk && (d === 2 ? <Pg4Zoom m={m} lk={lk} xs={xs} /> : d === 3 ? <Pg4All m={m} sel={sel} onSel={setSel} /> : <Pg4Ledger m={m} lk={lk} xs={xs} />)}
    </section>
  );
};
const Pg4Body = ({ s, sid }) => {
  const v = usePge(); const m = React.useMemo(() => pg4Build(s, sid), [s, sid]);
  return <>
    <Pg4Sess key={sid} m={m} d={v.d || 1} r={v.r || 1} ex={v.ex || 1} hv={v.hv || 1} />
    <section className="pg2-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};

// ---- Hooks into the app ----
window.GS_SESSION_BODY = { escape: (props) => <Pg4Body {...props} /> };
window.GS_SESSION_QUIET = { escape: (s, ed) => ({ label: s.game, h1: (ed && ed.title) || PZ.escape.title }) };
const PG4_SHIP_NOW = window.PzNow;
window.PzNow = (props) => (props.id !== 'escape' || props.none ? <PG4_SHIP_NOW {...props} /> : <Pg2Card c={props.c} />);

// ---- The bar: three independent picks (result, escape, hover) and the room. Fits one row at about 1100px. ----
const pg4Api = () => window.gsApi;
const pg4SetState = (k) => {
  const gs = pg4Api(); if (!gs) return;
  PgeStore.set(k === 'live' ? { live: true } : { finish: k, live: false });
  gs.setReview({ week: k === 'live' ? 'live' : 'done' });
  const r = gs.route; const s = r.name === 'session' && GS_SESSIONS[r.id];
  if (s && s.gid === 'escape') setTimeout(() => { const a = pg4Api(); a.go('session', { id: pg4Sid(a) }); }, 0);
};
const PG4_GROUPS = [['d', 'Lock detail', PG4_D], ['r', 'Result', PG4_R], ['ex', 'Escape', PG4_E], ['hv', 'Hover', PG4_H]];
const Pg4Bar = () => {
  const v = usePge(); const gs = pg4Api(); const st = gs ? pgeState(gs) : v.finish;
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { const h = document.documentElement; h.classList.toggle('pge-bar-on', !v.folded); h.classList.toggle('pge-bar-off', !!v.folded); }, [v.folded]);
  const pick = PG4_GROUPS.map(([k, , list]) => list[(v[k] || 1) - 1]);
  if (v.folded) return <button type="button" className="pge-tab" onClick={() => PgeStore.set({ folded: false })} aria-label="Show the playground bar"><span>{pick.map((o) => o.n).join(' · ')}</span><DS.Icon name="down" size={16} /></button>;
  return <>
    <div className="pge-bar pg4-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pge-eyebrow">v4</span>
      {PG4_GROUPS.map(([k, lab, list]) => (
        <div key={k} className="pge-bgrp" role="group" aria-label={lab}>
          <span className="pge-lab">{lab}</span>
          {list.map((o) => { const on = (v[k] || 1) === o.n; return <button key={o.n} type="button" className="pge-chip" aria-pressed={on} title={o.name} aria-label={o.n + ' ' + o.name} onClick={() => PgeStore.set({ [k]: o.n })}><b>{o.n}</b>{k === 'd' && o.name}</button>; })}
        </div>))}
      <div className="pge-bgrp" role="group" aria-label="This week’s room">
        <span className="pge-lab">Room</span>
        {PG4_STATES.map(([k, l]) => <button key={k} type="button" className="pge-chip" aria-pressed={st === k} onClick={() => pg4SetState(k)}>{l}</button>)}
      </div>
      <button type="button" className="pge-link" onClick={() => setWhy(true)}>Why</button>
      <button type="button" className="pge-fold" aria-label="Hide the playground bar" title="Hide (keys still work: S for the room)" onClick={() => PgeStore.set({ folded: true })}><DS.Icon name="down" size={20} /></button>
    </div>
    <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title="What you are looking at">
      <div className="pge-why">{PG4_GROUPS.map(([k, lab], i) => <p key={k}><b>{lab + ' ' + pick[i].n + ', ' + pick[i].name + ':'}</b> {pick[i].stance} <i>{'Cost: ' + pick[i].cost}</i></p>)}</div>
    </DS.Popup>
  </>;
};
const PG4_ORDER = PG4_STATES.map((x) => x[0]);
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
  if (e.key === 's' || e.key === 'S') { const gs = pg4Api(); if (!gs) return; const i = PG4_ORDER.indexOf(pgeState(gs)); pg4SetState(PG4_ORDER[(i + 1) % PG4_ORDER.length]); }
});

let pg4Opened = false;
window.KitCandidate = {
  bind() {
    if (pg4Opened) return; pg4Opened = true;
    setTimeout(() => {
      const a = window.gsApi; a.setView('pass'); a.setConnected(true); if (PgeStore.get().live) a.setReview({ week: 'live' });
      a.go('escape', { page: 'record' }, 'pass');
      setTimeout(() => { const b = window.gsApi; b.go('session', { id: pg4Sid(b) }); }, (window.GS_LOAD_MS || 600) + 100);
    }, 0);
  },
};
const Pg4Tick = () => { const [, t] = React.useReducer((x) => x + 1, 0); React.useEffect(() => { const id = setInterval(t, 400); return () => clearInterval(id); }, []); return <Pg4Bar />; };
(() => { const el = document.createElement('div'); el.id = 'pge-chrome'; document.body.appendChild(el); ReactDOM.createRoot(el).render(<Pg4Tick />); })();
