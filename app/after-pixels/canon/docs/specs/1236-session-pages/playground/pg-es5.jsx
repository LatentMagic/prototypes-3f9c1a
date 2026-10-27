// ============================================================================
// Playground (1236), v5: v4 with Escape 2 (the door left open) and Hover 1 (lift) fixed. Open: three lock details, all on
// "every lock at once" (one lock only on a phone), three results, and two ways to draw a try. Reuses pg-es-core.jsx and pg2Model.
// ============================================================================
const PG5_D = [
  { n: 1, name: 'Columns', stance: 'v4’s Every lock at once, cut down. One column per lock: its number and name, its tries stacked from the foot so every column ends level, and at the foot the lock’s door with its tries and hints. No story or replies under the locks; the either-or sits in the exit’s foot.', cost: 'The hint ladder takes a row of its own, so a lock with many hints makes a tall card.' },
  { n: 2, name: 'Lanes', stance: 'One lane per lock, two to a row on desktop, each a small line like the big one: its tries in order left to right, its hints between them, and the lane running on to the lock’s door at the right edge. A wrong try is a dark mark with no word under it; only an opening, a mechanism’s count and a hint are named, so a long run of tries still fits.', cost: 'A dark mark is read as wrong without a word; the lock’s facts give the count. A run past about 14 steps wraps to a second line.' },
  { n: 3, name: 'Scorecard', stance: 'A grid: one column per lock, one row per try, Try 1 to the play’s most, ruled across. A hint shows in the slot of the try it came before. Empty slots stay ruled, so every lock reads against the others.', cost: 'Reads as a table. A lock with one try leaves its column mostly empty slots.' },
  { n: 4, name: 'v4', stance: 'v4’s Every lock at once, as it was: one column per lock, its tries stacked, the picked lock lit. Only the inside changes: each try reads to the spec (Open or Wrong; a mechanism its count), the minute and the either-or sit in the column’s own caption, and the story and replies under the columns are gone.', cost: 'Tries stack from the top, so columns end at different heights inside the same box.' },
];
const PG5_R = [
  { n: 1, name: 'The door', stance: 'The cover’s door, at cover size, left open, beside one word, “Escaped”. Under it, how that stands against par. No minutes: the line already has them.', cost: 'The door is the biggest thing in the card, so it must earn it; in progress it is shut.' },
  { n: 2, name: 'At the exit', stance: 'The result sits above the line’s right-hand end, over where you got out, and the minutes left before par are drawn on the line as their own stretch. The words point at the picture.', cost: 'On a phone it falls back to the left like the others; the drawn stretch is thin when you got out near par.' },
  { n: 3, name: 'Stamped', stance: '“Escaped” with the store’s status tag beside it: Under par or Over par. The minutes to spare go in the line of figures under it.', cost: 'The plainest of the three; the tag is the store’s, not the game’s.' },
];
const PG5_T = [
  { n: 1, name: 'Tiles', stance: 'A try is as many tiles as the answer has characters (a mechanism: as many as its parts). Wrong leaves them all dark, Open lights them all; a mechanism lights as many as the room said were right.' },
  { n: 2, name: 'Marks', stance: 'A try is one mark. A typed answer is only right or wrong, so it is dark or lit. A mechanism’s mark is split into its parts, lit as the room counted them.' },
];
const PG5_STATES = [['under', 'Under'], ['par', 'On par'], ['over', 'Over'], ['hard', 'Hard'], ['live', 'Inside']];
const PG5_FIXED = 'Fixed from v4 (owner, 2026-10-27): Escape 2, the door left open, on the line and in the result; Hover 1, lift. The open door is now filled, so the bar no longer shows through it, and on par the tick stops short of it.';
// A third sample play, v5 only (as in v4): this week's moves, out at exactly par (30 min). Exactly par counts as under (Escape spec).
GS_SESSIONS['escape-par'] = { ...GS_SESSIONS['escape-week'], figures: ['30 min, on par', '1 hint', '2 wrong tries'] };
PGE_TIMES['escape-par'] = { min: 30, opened: [7, 18, 21, 30] };
PGE_REC['escape-par'] = PGE_REC['escape-week'];
// A fourth sample play, v5 only: a hard run at the same room, built to test the lock detail against the spec's limits. Six
// locks; the cabinet lock (typed) takes eighteen tries and all three hints; the clock hands (a mechanism) use up their wrong
// settings, need a hint to go on, and answer each setting with a count; out at 52 min. All invented.
const PG5_HARD = (() => {
  const L = []; let n = 0; const mv = (what, res) => L.push(['Move ' + (n += 1), what, res]);
  const tryOn = (len, lock, k) => { for (let i = 0; i < k; i += 1) mv('Try an answer (' + len + ') on the ' + lock, 'Wrong'); };
  const hint = (lock, text) => L.push(['Hint', 'The ' + lock, text]);
  mv('Examine the workbench', 'Gears of four sizes lie by the drawer.');
  tryOn('4 letters', 'workbench drawer', 1); mv('Try an answer (4 letters) on the workbench drawer', 'The drawer slides open.');
  L.push(['Item', 'Brass winding key', 'A small brass key, its bow shaped like a clock face.']);
  mv('Examine the glass cabinet', 'Seven watches behind glass, each stopped.');
  tryOn('4 digits', 'cabinet lock', 9); hint('cabinet lock', 'Read the watches in the order the plate gives the days.');
  tryOn('4 digits', 'cabinet lock', 4); hint('cabinet lock', 'Monday’s watch comes first, and it shows seven.');
  tryOn('4 digits', 'cabinet lock', 4); hint('cabinet lock', 'The answer, given outright.');
  mv('Try an answer (4 digits) on the cabinet lock', 'The cabinet door swings open.');
  mv('Examine the case clock', 'Its hands are stopped; the winding hole is empty.');
  mv('Use the brass winding key on the case clock', 'Used up');
  for (let i = 0; i < 3; i += 1) mv('Set the clock hands to an hour and a minute', 'Wrong');
  hint('clock hands', 'The diary names the minute they parted.');
  mv('Set the clock hands to an hour and a minute', 'Wrong'); mv('Set the clock hands to an hour and a minute', 'Both hands click home.');
  mv('Examine the writing desk', 'A three-dial lock on the lid.');
  tryOn('3 digits', 'writing desk lock', 1); mv('Try an answer (3 digits) on the writing desk lock', 'The lid lifts.');
  mv('Examine the map case', 'A five-letter lock under the railway map.');
  tryOn('5 letters', 'map case lock', 3); hint('map case lock', 'The map marks one station in red.');
  mv('Try an answer (5 letters) on the map case lock', 'The drawer opens on a ticket.');
  mv('Examine the oak door', 'Four letters, and the ticket fits the slot.');
  tryOn('4 letters', 'oak door lock', 1); mv('Try an answer (4 letters) on the oak door lock', 'Out');
  return L;
})();
GS_SESSIONS['escape-hard'] = { ...GS_SESSIONS['escape-week'], result: GS_RESULT.escape({ min: 52, par: 'over par' }), share: GS_RESULT.escape({ min: 52, par: 'over par' }),
  figures: ['52 min, over par', '5 hints', '27 wrong tries'], shareLines: ['Escape · escaped in 52 min, over par · 5 hints 💡 · 27 wrong tries'], lines: PG5_HARD };
PGE_TIMES['escape-hard'] = { min: 52, opened: [3, 21, 30, 34, 44, 52] };
PGE_REC['escape-hard'] = { near: { 2: PGE_NEAR_DRAWER }, part: { 25: ['0 of 2 hands', 'Neither hand clicks home.'], 26: ['1 of 2 hands', 'The hour hand clicks home.'], 27: ['1 of 2 hands', 'The hour hand clicks home.'], 28: ['1 of 2 hands', 'The minute hand clicks home.'] } };
const pg5Sid = (gs) => (gs.review.week === 'live' ? 'escape-live' : ({ over: 'escape-over', par: 'escape-par', hard: 'escape-hard' })[PgeStore.get().finish] || 'escape-week');
const PG5_F = '"Hanken Grotesk", system-ui, sans-serif';

// ---- The model, read to the Escape spec: a typed lock answers only Open or Wrong (a near miss, or a reading the sample
// record gives a typed lock, is still Wrong); a mechanism (Set …) answers with how many parts were right. ----
const pg5Kind = (e) => (/^Set /.test(e.what) ? 'mech' : 'typed');
const pg5Slots = (e) => { const r = /\((\d+) /.exec(e.what); return r ? Number(r[1]) : /hands/.test(e.what) ? 2 : 4; };
const pg5Build = (s, sid) => {
  const m = pg2Model(s, sid);
  m.locks.forEach((lk) => { lk.rows = []; });
  m.stretches.forEach((st) => st.entries.forEach((e) => {
    if (!e.lock || !e.lock.rows) return;
    if (e.kind === 'hint') e.lock.rows.push({ k: 'hint', rung: e.rung });
    else if (e.kind === 'move' && ['wrong', 'near', 'part', 'open', 'out'].includes(e.out)) {
      const kind = pg5Kind(e); const slots = pg5Slots(e); const ok = e.out === 'open' || e.out === 'out';
      let lit = ok ? slots : 0;
      if (kind === 'mech' && e.out === 'part') { const r = /^(\d+) of/.exec(e.part.label); lit = r ? Number(r[1]) : 0; }
      e.lock.rows.push({ k: 'try', e, n: e.n, kind, slots, lit, ok });
    }
  }));
  m.locks.forEach((l) => { let h = []; l.slots = []; l.rows.forEach((r) => { if (r.k === 'hint') h.push(r.rung); else { l.slots.push({ ...r, hints: h }); h = []; } }); });
  m.maxRows = Math.max(1, ...m.locks.map((l) => l.rows.length));
  m.maxTries = Math.max(1, ...m.locks.map((l) => l.slots.length));
  return m;
};
const pg5Def = (m) => (m.locks.find((l) => l.exit) || m.locks[m.locks.length - 1] || {}).key;
const pg5Word = (r) => (r.ok ? 'Open' : r.kind === 'mech' ? r.lit + ' of ' + r.slots : 'Wrong');
const PG5_HINT = ['', 'Hint: a nudge', 'Hint: a bigger nudge', 'Hint: the answer'];
const pg5Facts = (l) => [pgeTries(l), l.hints ? pgePlural(l.hints, 'hint', 'hints') : null, l.exit && l.closed ? l.closed + ' closed' : null].filter(Boolean).join(' · ');
const pg5Figs = (m) => (m.live
  ? [pgePlural(m.locks.length, 'lock', 'locks') + ' open', pgePlural(m.moves, 'move', 'moves') + ' so far']
  : [pgePlural(m.moves, 'move', 'moves'), m.hints ? pgePlural(m.hints, 'hint', 'hints') : 'No hints', m.wrong ? pgePlural(m.wrong, 'wrong try', 'wrong tries') : 'No wrong tries']);
// Exactly par counts as under (Escape spec).
const pg5Spare = (m) => (m.over ? (m.min - m.par) + ' min over par' : m.min === m.par ? 'On par' : (m.par - m.min) + ' min under par');

// The exit door left open: the frame, filled dark, the leaf swung out.
const Pg5Open = ({ w, h }) => <span className="pg4-od pg5-od" style={{ width: w, height: h }} aria-hidden="true"><i><b /></i></span>;
const Pg5Mark = ({ r, mode, size }) => (mode === 2
  ? <span className={'pg5-mk' + (r.ok ? ' is-on' : '')} style={{ '--t': size + 'px' }} aria-hidden="true">{r.kind === 'mech' && !r.ok ? Array.from({ length: r.slots }, (_, j) => <i key={j} className={j < r.lit ? 'is-on' : ''} />) : null}</span>
  : <span className="pg4-tl" style={{ '--t': size + 'px' }} aria-hidden="true">{Array.from({ length: r.slots }, (_, j) => <i key={j} className={j < r.lit ? 'is-on' : ''} />)}</span>);
const Pg5Door = ({ l, m, w = 12, h = 24 }) => (l.exit && !m.live ? <Pg5Open w={w} h={h} /> : <PgeDoor w={w} h={h} />);

// ---- The line: v4's, with the open exit door and lift hover fixed. On par the tick stops short of the exit door. ----
const Pg5Line = ({ m, sel, onSel, gap }) => {
  const ref = React.useRef(null); const W = usePgeWidth(ref); const [hov, setHov] = React.useState(null);
  const hp = (k) => ({ onMouseEnter: () => setHov(k), onMouseLeave: () => setHov((h) => (h === k ? null : h)), onFocus: () => setHov(k), onBlur: () => setHov((h) => (h === k ? null : h)) });
  const BAR = 28, OH = 8, DW = 14, TOP = 20, NUM = 24, ROW = 32, R = 10;
  const inner = W - R;
  const parText = 'Par ' + m.par + ' min'; const parW = pgeMeasure(parText, '400 13px ' + PG5_F);
  const outText = 'Out ' + m.min + ' min'; const outW = pgeMeasure(outText, '600 14px ' + PG5_F) + 8;
  const end = m.live ? m.end : m.min;
  const fit = (t, w) => (t * inner) / Math.max(1, W - w / 2 - 2);
  const span = Math.max(Math.max(end || 0, m.par) + (m.live ? 3 : 0), fit(m.par, parW), m.live ? 0 : fit(m.min, outW));
  const x = (t) => Math.round((t / span) * inner);
  const barT = TOP + 6 + OH; const barB = barT + BAR;
  const parX = x(m.par); const endX = x(end); const onPar = !m.live && m.min === m.par;
  // Doors keep 32px apart at every width (a 32px hit area each). When any would sit closer, every gap becomes 32px plus its
  // share of the remaining width by minutes, so a longer wait still looks longer; the first and last doors stay on their minute.
  const GAP = 32; const dx = m.locks.map((lk) => x(lk.minute)); const n5 = dx.length;
  if (n5 > 1 && dx.some((c, i) => i && c - dx[i - 1] < GAP)) {
    const t0 = m.locks[0].minute, tl = m.locks[n5 - 1].minute; const k = (dx[n5 - 1] - dx[0] - GAP * (n5 - 1)) / Math.max(1, tl - t0);
    if (k >= 0) { const x0 = dx[0]; m.locks.forEach((lk, i) => { dx[i] = Math.round(x0 + GAP * i + (lk.minute - t0) * k); }); }
    else { for (let i = 1; i < n5; i += 1) dx[i] = Math.max(dx[i], dx[i - 1] + GAP); }
  }
  const labs = m.locks.map((lk, i) => { const xx = dx[i]; const out = lk.exit && !m.live; const w = out ? outW : NUM;
    return { lk, xx, w, l: Math.max(0, Math.min(xx - w / 2, W - w)), out }; });
  const ls = labs.slice().sort((a, b) => a.l - b.l); pgeRows(ls).forEach((r, i) => { ls[i].r = r; });
  const nRows = labs.length ? Math.max(...labs.map((b) => b.r)) + 1 : 1;
  const labT = barB + OH + 8; const H = labT + nRows * ROW;
  const label = m.live ? 'In progress. ' + pgePlural(m.locks.length, 'lock', 'locks') + ' open.' : 'Out at minute ' + m.min + ', par ' + m.par + '.';
  const dw = dx.map(() => GAP);
  return (
    <div className="pg3-line pg4-hv-1 pg5-line" ref={ref} style={{ height: H }} aria-label={label} role="group">
      {W > 0 && <>
        <span className="pg3-ptxt" style={{ left: Math.round(parX - parW / 2), top: 0 }}>{parText}</span>
        {/* On par only: the tick stops short of the exit door (which sits on it) and the lower tick is dropped. */}
        <span className="pg3-ptk" style={{ left: parX - 1, top: TOP, height: onPar ? Math.max(2, barT - OH - TOP - 10) : barT - TOP - 2 }} />
        {!onPar && <span className="pg3-ptk" style={{ left: parX - 1, top: barB + 2, height: OH + 2 }} />}
        <span className="pg3-trk" style={{ top: barT, height: BAR, width: inner }} />
        <span className="pg3-fill" style={{ top: barT, height: BAR, width: m.over ? parX : endX }} />
        {m.over && <span className="pg3-fill is-over" style={{ top: barT, height: BAR, left: parX, width: endX - parX }} />}
        {/* Result 2 only: the minutes left before par are tinted on the bar. */}
        {gap && !m.live && !m.over && parX > endX && <span className="pg5-gap" style={{ top: barT, height: BAR, left: endX, width: parX - endX }} />}
        {m.live && <span className="pg3-edge" style={{ top: barT - 4, height: BAR + 8, left: endX - 1 }} />}
        {m.locks.map((lk, i) => { const xx = dx[i]; const out = lk.exit && !m.live; return (
          <button key={lk.key} type="button" className={'pg3-dr' + (sel === lk.key ? ' is-sel' : '') + (hov === lk.key ? ' is-hov' : '') + (out ? ' is-exit' : '')} {...hp(lk.key)} style={{ left: xx - dw[i] / 2, width: dw[i], top: barT - OH, height: BAR + OH * 2 }}
            aria-pressed={sel === lk.key} aria-label={lk.name + (m.live ? '' : ', minute ' + lk.minute)} onClick={() => onSel(lk.key)}>
            {out ? <Pg5Open w={DW} h={BAR + OH * 2} /> : <PgeDoor w={DW} h={BAR + OH * 2} />}
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

// ---- The result. None repeats your time: the line has it. Each says you escaped and how that stands against par. ----
const Pg5Verdict = ({ m }) => <p className={'pg5-vd is-' + (m.over ? 'over' : 'ok')}><DS.Icon name={m.over ? 'close' : 'check'} size={20} />{pg5Spare(m)}</p>;
const Pg5Result = ({ m, r }) => {
  const head = m.live ? 'Still inside' : 'Escaped';
  if (r === 2) return (
    <div className="pg5-r2">
      <p className="pge-cap">{pg5Figs(m).join(' · ')}</p>
      <div className="pg5-r2t"><h2 className="pg4-h"><span className="pg4-esc">{!m.live && <Pg5Open w={16} h={28} />}{head}</span></h2>{!m.live && <Pg5Verdict m={m} />}</div>
    </div>);
  if (r === 3) return (
    <div className="pg5-r3">
      <div className="pg5-r3h"><h2 className="pg4-h"><span className="pg4-esc">{!m.live && <Pg5Open w={16} h={28} />}{head}</span></h2>
        {!m.live && <DS.Tag kind={m.over ? 'warning' : 'success'}>{m.over ? 'Over par' : m.min === m.par ? 'On par' : 'Under par'}</DS.Tag>}</div>
      <p className="pge-cap">{(m.live ? [] : [pg5Spare(m)]).concat(pg5Figs(m)).join(' · ')}</p>
    </div>);
  return (
    <div className="pg5-r1">
      {m.live ? <PgeDoor w={40} h={68} /> : <Pg5Open w={40} h={68} />}
      <div className="pg5-r1t">
        <div className="pg5-r1h"><h2 className="pg4-h">{head}</h2>{!m.live && <Pg5Verdict m={m} />}</div>
        <p className="pge-cap">{pg5Figs(m).join(' · ')}</p>
      </div>
    </div>);
};

// ---- The lock detail: every lock at once on desktop, the lock you picked alone on a phone. Each keeps its height. ----
// 1. Columns: tries stacked from the foot, the lock's door and facts at the foot.
const Pg5Cols = ({ m, sel, onSel, mode }) => (
  <div className="pg5-cols" style={{ gridTemplateColumns: 'repeat(' + m.locks.length + ', minmax(0, 1fr))' }}>
    {m.locks.map((l) => (
      <button key={l.key} type="button" className={'pg5-u pg5-col' + (sel === l.key ? ' is-sel' : '')} aria-pressed={sel === l.key} onClick={() => onSel(l.key)}>
        <span className="pg5-uh"><PgeNum n={l.index} size={24} /><b>{l.short}</b></span>
        <span className="pg5-stack" style={{ minHeight: m.maxRows * 24 + (m.maxRows - 1) * 8 }}>
          {l.rows.map((r, i) => (r.k === 'hint'
            ? <span key={'h' + i} className="pg5-r is-hint"><i className="pg5-hm" />{PG5_HINT[r.rung]}</span>
            : <span key={r.n} className="pg5-r"><Pg5Mark r={r} mode={mode} size={mode === 2 ? 20 : 16} /><span>{pg5Word(r)}</span></span>))}
        </span>
        <span className="pg5-foot"><Pg5Door l={l} m={m} w={10} h={20} /><span className="pge-cap">{pg5Facts(l)}</span></span>
      </button>))}
  </div>);

// 2. Lanes: each lock a small line, tries left to right, running on to its door at the right edge.
const Pg5Lanes = ({ m, sel, onSel, mode }) => (
  <div className="pg5-lanes">
    {m.locks.map((l) => (
      <button key={l.key} type="button" className={'pg5-u pg5-lane' + (sel === l.key ? ' is-sel' : '')} aria-pressed={sel === l.key} onClick={() => onSel(l.key)}>
        <span className="pg5-ln"><span className="pg5-uh"><PgeNum n={l.index} size={24} /><b>{l.short}</b></span><span className="pge-cap">{pg5Facts(l)}</span></span>
        <span className="pg5-trk">
          {/* A typed lock's wrong try gets no word under its mark (a blank keeps the row height); only Open, a mechanism's count and hints are named. */}
          {l.rows.map((r, i) => (r.k === 'hint'
            ? <span key={'h' + i} className="pg5-st is-hint"><i className="pg5-hm" /><small>{'Hint ' + r.rung}</small></span>
            : <span key={r.n} className={'pg5-st' + (!r.ok && r.kind === 'typed' ? ' is-wrong' : '')}><Pg5Mark r={r} mode={mode} size={24} /><small>{!r.ok && r.kind === 'typed' ? '\u00a0' : pg5Word(r)}</small></span>))}
          <span className="pg5-st is-door"><Pg5Door l={l} m={m} w={12} h={24} /><small>{l.exit && !m.live ? 'Out' : '\u00a0'}</small></span>
        </span>
      </button>))}
  </div>);

// 3. Scorecard: one column per lock, one ruled slot per try to the play's most; a hint shows in the slot it came before.
const Pg5Score = ({ m, sel, onSel, mode }) => {
  const rows = { gridTemplateRows: '48px repeat(' + m.maxTries + ', 56px) auto' };
  return (
    <div className="pg5-sc" style={{ gridTemplateColumns: '56px repeat(' + m.locks.length + ', minmax(0, 1fr))' }}>
      <div className="pg5-scg" style={rows} aria-hidden="true"><span />{Array.from({ length: m.maxTries }, (_, i) => <span key={i}>{'Try ' + (i + 1)}</span>)}<span /></div>
      {m.locks.map((l) => (
        <button key={l.key} type="button" className={'pg5-u pg5-scc' + (sel === l.key ? ' is-sel' : '')} style={rows} aria-pressed={sel === l.key} onClick={() => onSel(l.key)}>
          <span className="pg5-uh"><PgeNum n={l.index} size={24} /><b>{l.short}</b></span>
          {Array.from({ length: m.maxTries }, (_, i) => { const t = l.slots[i]; return (
            <span key={i} className="pg5-cell">{t && <><Pg5Mark r={t} mode={mode} size={mode === 2 ? 24 : 18} /><span>{pg5Word(t)}</span>
              {t.hints.length > 0 && <span className="pg5-ch">{t.hints.map((h) => <i key={h} className="pg5-hm" />)}{t.hints.length === 1 ? 'Hint ' + t.hints[0] : 'Hints ' + t.hints.join(', ')}</span>}</>}</span>); })}
          <span className="pg5-foot"><Pg5Door l={l} m={m} w={10} h={20} /><span className="pge-cap">{pg5Facts(l)}</span></span>
        </button>))}
    </div>);
};

// 4. v4's columns, kept; only their insides change.
const Pg5V4 = ({ m, sel, onSel, mode }) => (
  <div className="pg4-all pg5-v4" style={{ gridTemplateColumns: 'repeat(' + m.locks.length + ', minmax(0, 1fr))' }}>
    {m.locks.map((l) => { let n = 0; return (
      <button key={l.key} type="button" className={'pg4-col pg5-u4' + (sel === l.key ? ' is-sel' : '')} aria-pressed={sel === l.key} onClick={() => onSel(l.key)}>
        <span className="pg4-ch"><PgeNum n={l.index} size={24} /><b>{l.short}</b></span>
        <span className="pge-cap">{[m.live ? null : (l.exit ? 'Out at minute ' : 'Minute ') + l.minute, l.exit && l.closed ? l.closed + ' closed' : null].filter(Boolean).join(' · ')}</span>
        <span className="pg4-crows">{l.rows.map((r, i) => (r.k === 'hint'
          ? <span key={'h' + i} className="pg4-cr is-hint"><i aria-hidden="true" />{PG5_HINT[r.rung]}</span>
          : <span key={r.n} className="pg4-cr"><Pg5Mark r={r} mode={mode} size={16} /><span>{pg5Word(r)}</span><span className="pg4-crn">{'Try ' + (n += 1)}</span></span>))}</span>
      </button>); })}
  </div>);

const Pg5Sess = ({ m, d, r, t }) => {
  const [sel, setSel] = React.useState(() => pg5Def(m));
  const D = [Pg5Cols, Pg5Lanes, Pg5Score, Pg5V4][d - 1] || Pg5Cols;
  return (
    <section className={'pge-card pg3-sess pg5-sess pg5-d' + d} aria-label="How you got out">
      <Pg5Result m={m} r={r} />
      <Pg5Line m={m} sel={sel} onSel={setSel} gap={r === 2} />
      {m.locks.length > 0 && <div className="pg5-detail" aria-label="The locks"><D m={m} sel={sel} onSel={setSel} mode={t} /></div>}
    </section>
  );
};
const Pg5Body = ({ s, sid }) => {
  const v = usePge(); const m = React.useMemo(() => pg5Build(s, sid), [s, sid]);
  return <>
    <Pg5Sess key={sid} m={m} d={v.d || 1} r={v.r || 1} t={v.t || 1} />
    <section className="pg2-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};

// ---- Hooks into the app ----
window.GS_SESSION_BODY = { escape: (props) => <Pg5Body {...props} /> };
window.GS_SESSION_QUIET = { escape: (s, ed) => ({ label: s.game, h1: (ed && ed.title) || PZ.escape.title }) };
const PG5_SHIP_NOW = window.PzNow;
window.PzNow = (props) => (props.id !== 'escape' || props.none ? <PG5_SHIP_NOW {...props} /> : <Pg2Card c={props.c} />);

// ---- The bar ----
const pg5Api = () => window.gsApi;
const pg5SetState = (k) => {
  const gs = pg5Api(); if (!gs) return;
  PgeStore.set(k === 'live' ? { live: true } : { finish: k, live: false });
  gs.setReview({ week: k === 'live' ? 'live' : 'done' });
  const r = gs.route; const s = r.name === 'session' && GS_SESSIONS[r.id];
  if (s && s.gid === 'escape') setTimeout(() => { const a = pg5Api(); a.go('session', { id: pg5Sid(a) }); }, 0);
};
const PG5_GROUPS = [['d', 'Lock detail', PG5_D, true], ['r', 'Result', PG5_R, true], ['t', 'Tries', PG5_T, true]];
const Pg5Bar = () => {
  const v = usePge(); const gs = pg5Api(); const st = gs ? pgeState(gs) : v.finish;
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { const h = document.documentElement; h.classList.toggle('pge-bar-on', !v.folded); h.classList.toggle('pge-bar-off', !!v.folded); }, [v.folded]);
  const pick = PG5_GROUPS.map(([k, , list]) => list[(v[k] || 1) - 1]);
  if (v.folded) return <button type="button" className="pge-tab" onClick={() => PgeStore.set({ folded: false })} aria-label="Show the playground bar"><span>{pick.map((o) => o.name).join(' · ')}</span><DS.Icon name="down" size={16} /></button>;
  return <>
    <div className="pge-bar pg5-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pge-eyebrow">v5</span>
      {PG5_GROUPS.map(([k, lab, list, named]) => (
        <div key={k} className="pge-bgrp" role="group" aria-label={lab}>
          <span className="pge-lab">{lab}</span>
          {list.map((o) => <button key={o.n} type="button" className="pge-chip" aria-pressed={(v[k] || 1) === o.n} onClick={() => PgeStore.set({ [k]: o.n })}>{named && k !== 't' ? <><b>{o.n}</b>{o.name}</> : o.name}</button>)}
        </div>))}
      <div className="pge-bgrp" role="group" aria-label="This week’s room">
        <span className="pge-lab">Room</span>
        {PG5_STATES.map(([k, l]) => <button key={k} type="button" className="pge-chip" aria-pressed={st === k} onClick={() => pg5SetState(k)}>{l}</button>)}
      </div>
      <button type="button" className="pge-link" onClick={() => setWhy(true)}>Why</button>
      <button type="button" className="pge-fold" aria-label="Hide the playground bar" title="Hide (S still steps the room)" onClick={() => PgeStore.set({ folded: true })}><DS.Icon name="down" size={20} /></button>
    </div>
    <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title="What you are looking at">
      <div className="pge-why">
        {PG5_GROUPS.map(([k, lab], i) => <p key={k}><b>{lab + ', ' + pick[i].name + ':'}</b> {pick[i].stance}{pick[i].cost && <i>{' Cost: ' + pick[i].cost}</i>}</p>)}
        <p>{PG5_FIXED}</p>
      </div>
    </DS.Popup>
  </>;
};
const PG5_ORDER = PG5_STATES.map((x) => x[0]);
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
  if (e.key === 's' || e.key === 'S') { const gs = pg5Api(); if (!gs) return; const i = PG5_ORDER.indexOf(pgeState(gs)); pg5SetState(PG5_ORDER[(i + 1) % PG5_ORDER.length]); }
});

let pg5Opened = false;
window.KitCandidate = {
  bind() {
    if (pg5Opened) return; pg5Opened = true;
    setTimeout(() => {
      const a = window.gsApi; a.setView('pass'); a.setConnected(true); if (PgeStore.get().live) a.setReview({ week: 'live' });
      a.go('escape', { page: 'record' }, 'pass');
      setTimeout(() => { const b = window.gsApi; b.go('session', { id: pg5Sid(b) }); }, (window.GS_LOAD_MS || 600) + 100);
    }, 0);
  },
};
const Pg5Tick = () => { const [, t] = React.useReducer((x) => x + 1, 0); React.useEffect(() => { const id = setInterval(t, 400); return () => clearInterval(id); }, []); return <Pg5Bar />; };
(() => { const el = document.createElement('div'); el.id = 'pge-chrome'; document.body.appendChild(el); ReactDOM.createRoot(el).render(<Pg5Tick />); })();
