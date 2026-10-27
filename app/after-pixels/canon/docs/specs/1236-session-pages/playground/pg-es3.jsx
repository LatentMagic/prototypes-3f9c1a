// ============================================================================
// Playground (1236), v3 (rebuilt): three designs of Escape's session page, all on v2's timeline. The head carries no result or
// figures (window.GS_SESSION_QUIET); the result is designed into each body. Reads pg2Model (pg-es2-line.jsx) for the
// play, and keeps v2's Version 1 card on the library page until a design is picked.
// ============================================================================
const PG3_D = [
  { n: 1, name: 'Doors you open',
    stance: 'v2’s line, cleaned up: par’s label centred on its tick, “Out 28 min” under the door you left by, the exit door lit from behind. Every door is a button. The lock you tap opens right under the line: each try a row of blank tumblers lit as the room answered (dark wrong, amber right letters in the wrong order, cream for each dial home), then its hints and story. The verdict against par heads the card, beside the door you went out by.',
    cost: 'You see one lock at a time. Moves that were not tries (looking, using) are not drawn.' },
  { n: 2, name: 'Every move on the line',
    stance: 'The same line, with every move drawn inside it as a square, stretch by stretch between the doors, so the bar is the play. Moments light their own squares: the closest miss one square, the longest stretch its run, so two moments on one lock no longer look the same. Tap a stretch or a moment; the detail sits under the line.',
    cost: 'Squares inside a short stretch are thin. A key is needed for the square colours.' },
  { n: 3, name: 'The clock',
    stance: 'The line bent into one lap of a square clock face, par the full lap, doors where each lock gave way. The face reads your time; tap a door or a moment and the face tells that one instead. Kept from the first v3 because the owner found it interesting.',
    cost: 'On the library card it would be a square, not the row the card has now. Tries and hints are words, not drawn.' },
];
const PG3_STATES = [['under', 'Under par'], ['over', 'Over par'], ['live', 'In progress']];

// ---- The model: v2's play, plus each lock's tries as tumbler rows, and the moves of its stretch. ----
const pg3Tiles = (e) => { const r = /\((\d+) /.exec(e.what); return r ? Number(r[1]) : /hands/.test(e.what) ? 2 : 4; };
const pg3Lit = (e, n) => {
  if (e.out === 'open' || e.out === 'out') return Array(n).fill('on');
  if (e.out === 'near') return Array(n).fill('near');
  if (e.out === 'part') { const k = Number(/^(\d+)/.exec(e.part.label)[1]); return Array.from({ length: n }, (_, i) => (i < k ? 'on' : 'off')); }
  return Array(n).fill('off');
};
const pg3Build = (s, sid) => {
  const m = pg2Model(s, sid);
  m.locks.forEach((lk) => { lk.rows = []; lk.steps = []; });
  m.stretches.forEach((st) => {
    st.entries.forEach((e) => {
      if (e.kind === 'hint' && e.lock && e.lock.rows) e.lock.rows.push({ k: 'hint', rung: e.rung });
      else if (e.kind === 'move' && e.lock && e.lock.rows && ['wrong', 'near', 'part', 'open', 'out'].includes(e.out)) e.lock.rows.push({ k: 'try', e, n: e.n, lit: pg3Lit(e, pg3Tiles(e)) });
    });
    const steps = st.entries.filter((e) => e.kind === 'move' || e.kind === 'hint').map((e) => ({ n: e.n, out: e.kind === 'hint' ? 'hint' : e.out }));
    if (st.lock) st.lock.steps = steps; else m.pending = steps;
  });
  m.mo = Object.fromEntries(m.mos.map((x) => [x.id, x]));
  return m;
};
const pg3Vs = (m) => (m.min < m.par ? (m.par - m.min) + ' min under par' : m.min === m.par ? 'On par' : (m.min - m.par) + ' min over par');
const pg3Figs = (m) => (m.live
  ? [pgePlural(m.locks.length, 'lock', 'locks') + ' open', pgePlural(m.moves, 'move', 'moves') + ' so far']
  : [pgePlural(m.moves, 'move', 'moves'), m.hints ? pgePlural(m.hints, 'hint', 'hints') : 'No hints', m.wrong ? pgePlural(m.wrong, 'wrong try', 'wrong tries') : 'No wrong tries']).join(' · ');
const pg3TryWord = (e) => ({ open: 'Open', out: 'Open', wrong: 'Wrong', near: e.near && e.near.split('.')[0], part: e.part && e.part.label })[e.out] || '';
const pg3Minute = (m, lk) => (m.live ? null : (lk.exit ? 'Out at minute ' : 'Minute ') + lk.minute);
const pg3LockFacts = (m, lk) => [pgeFacts(lk), m.mo.stall && m.mo.stall.lock === lk.key ? 'longest stretch, ' + pgePlural(lk.steps.filter((x) => x.out !== 'hint').length, 'move', 'moves') : null].filter(Boolean).join(' · ');

const Pg3Vs = ({ m }) => <p className={'pg3-vs is-' + (m.over ? 'over' : 'ok')}>{!m.over && <DS.Icon name="check" size={20} />}{pg3Vs(m)}</p>;
// The cover's door, full height: its teal leaf swung back on the light beyond, or shut with its amber knob.
const Pg3BigDoor = ({ shut }) => <span className={'pg3-bd' + (shut ? ' is-shut' : '')} aria-hidden="true"><i /><b /></span>;

const PG3_F = '"Hanken Grotesk", system-ui, sans-serif';
// ---- The line: v2's lock row at page size. Doors are buttons. Par's label is centred on its tick; the exit's label, "Out 28 min",
// sits under its door, lit from behind. With moves, every move of each stretch is drawn inside the bar. ----
const Pg3Line = ({ m, moves, sel, onSel, hi }) => {
  const ref = React.useRef(null); const W = usePgeWidth(ref);
  const BAR = moves ? 36 : 28, OH = 8, DW = 14, TOP = 20, NUM = 24, ROW = 32, R = 10;
  const span = Math.max(m.end || 0, m.par) + (m.live ? 3 : 0); const x = (t) => Math.round((t / span) * (W - R));
  const barT = TOP + 6 + OH; const barB = barT + BAR;
  const parText = 'Par ' + m.par + ' min'; const parW = pgeMeasure(parText, '400 13px ' + PG3_F);
  const parL = Math.max(0, Math.min(x(m.par) - parW / 2, W - parW));
  const labs = m.locks.map((lk) => { const xx = x(lk.minute); const out = lk.exit && !m.live; const w = out ? pgeMeasure('Out ' + m.min + ' min', '600 14px ' + PG3_F) + 8 : NUM;
    return { lk, xx, w, l: Math.max(0, Math.min(xx - w / 2, W - w)), out }; });
  const ls = labs.slice().sort((a, b) => a.l - b.l); pgeRows(ls).forEach((r, i) => { ls[i].r = r; });
  const nRows = labs.length ? Math.max(...labs.map((b) => b.r)) + 1 : 1;
  const labT = barB + OH + 8; const H = labT + nRows * ROW;
  let t0 = 0; const segs = [];
  m.stretches.forEach((st) => { if (!st.lock && !m.live) return; const t1 = st.lock ? st.lock.minute : span; segs.push({ st, key: st.lock ? st.lock.key : null, a: x(t0), b: x(t1), steps: st.lock ? st.lock.steps : (m.pending || []) }); t0 = t1; });
  const endX = x(m.live ? m.end : m.min);
  const label = m.live ? 'In progress. ' + pgePlural(m.locks.length, 'lock', 'locks') + ' open.' : 'Out at minute ' + m.min + ', par ' + m.par + '.';
  return (
    <div className="pg3-line" ref={ref} style={{ height: H }} aria-label={label} role="group">
      {W > 0 && <>
        <span className="pg3-ptxt" style={{ left: parL, top: 0 }}>{parText}</span>
        <span className="pg3-ptk" style={{ left: x(m.par) - 1, top: TOP, height: barT - TOP - 2 }} />
        <span className="pg3-ptk" style={{ left: x(m.par) - 1, top: barB + 2, height: OH + 2 }} />
        <span className="pg3-trk" style={{ top: barT, height: BAR, width: W - R }} />
        {!moves && <span className="pg3-fill" style={{ top: barT, height: BAR, width: m.over ? x(m.par) : endX }} />}
        {m.over && <span className={'pg3-fill is-over' + (moves ? ' is-soft' : '')} style={{ top: barT, height: BAR, left: x(m.par), width: endX - x(m.par) }} />}
        {m.live && <span className="pg3-edge" style={{ top: barT - 4, height: BAR + 8, left: endX - 1 }} />}
        {moves && segs.map((g) => { const l = g.a + (g.a ? DW / 2 + 3 : 3), r = g.b - DW / 2 - 3; const n = g.steps.length; const cw = n ? (r - l - (n - 1) * 2) / n : 0; return (
          <React.Fragment key={g.key || 'now'}>
            {g.key && <button type="button" className={'pg3-seg' + (sel === g.key ? ' is-sel' : '')} style={{ left: g.a, width: g.b - g.a, top: barT, height: BAR }} aria-label={'Moves to ' + g.st.lock.name.toLowerCase()} onClick={() => onSel(g.key)} />}
            {cw > 0 && g.steps.map((st, j) => <i key={j} className={'pg3-cell is-' + st.out + (hi && hi.has(st.n) && st.out !== 'hint' ? ' is-hi' : '')} style={{ left: l + j * (cw + 2), width: cw, top: barT + 5, height: BAR - 10 }} />)}
          </React.Fragment>); })}
        {m.locks.map((lk) => { const xx = x(lk.minute); const out = lk.exit && !m.live; return (
          <button key={lk.key} type="button" className={'pg3-dr' + (sel === lk.key ? ' is-sel' : '')} style={{ left: xx - 16, top: barT - OH, height: BAR + OH * 2 }}
            aria-pressed={sel === lk.key} aria-label={lk.name + (m.live ? '' : ', minute ' + lk.minute)} onClick={() => onSel(lk.key)}>
            {out ? <span className="pg3-xd" style={{ width: DW + 4, height: BAR + OH * 2 }}><i /></span> : <PgeDoor w={DW} h={BAR + OH * 2} />}
          </button>); })}
        {labs.map((b) => { const top = labT + b.r * ROW; return <React.Fragment key={b.lk.key}>
          {b.r > 0 && <span className="pg3-lead" style={{ left: b.xx, top: barB + OH, height: top - barB - OH }} />}
          <button type="button" className={'pg3-lab' + (b.out ? ' is-out' : '') + (sel === b.lk.key ? ' is-sel' : '')} style={{ left: b.l, top, width: b.w }} aria-hidden="true" tabIndex={-1} onClick={() => onSel(b.lk.key)}>
            {b.out ? 'Out ' + m.min + ' min' : <PgeNum n={b.lk.index} size={NUM} />}
          </button>
        </React.Fragment>; })}
      </>}
    </div>
  );
};
// A lock's tries, each a row of blank tumblers lit as the room answered. No letter or digit is ever shown.
const Pg3Tries = ({ m, lk }) => { const close = m.mo.close; const first = m.mo.first && m.mo.first.lock === lk.key; return (
  <div className="pg3-tries">
    {lk.rows.map((r, i) => (r.k === 'hint'
      ? <div key={'h' + i} className="pg3-hint"><i aria-hidden="true" />{'Hint: ' + PGE_RUNG[r.rung]}</div>
      : <div key={r.n} className="pg3-try">
        <span className="pg3-tiles" aria-hidden="true">{r.lit.map((c, j) => <i key={j} className={'is-' + c} />)}</span>
        <span className="pg3-said">{pg3TryWord(r.e)}</span>
        {close && close.move === r.n && <span className="pg3-mark">Closest miss</span>}
        {first && (r.e.out === 'open') && <span className="pg3-mark">First try</span>}
      </div>))}
  </div>
); };
const Pg3Panel = ({ m, lk, mo, tiles }) => (lk ? (
  <div className="pg3-panel" aria-live="polite">
    {mo && <span className="pg3-mlab">{mo.title}</span>}
    <div className="pg3-ph"><PgeNum n={lk.index} size={24} /><h3 className="pge-h3">{lk.name}</h3></div>
    <p className="pge-cap">{[mo ? mo.sub.split('. ')[0] : pg3Minute(m, lk), pg3LockFacts(m, lk)].filter(Boolean).join(' · ')}</p>
    {tiles && <Pg3Tries m={m} lk={lk} />}
    {lk.story && <p className="pge-story">{lk.story}</p>}
    {lk.exit && lk.closed && <p className="pge-cap">{lk.closed + ' closed.'}</p>}
  </div>) : null);
// The verdict against par heads the card; the line carries the minutes.
const Pg3Head = ({ m, door }) => (
  <div className="pg3-r1">
    {door && <Pg3BigDoor shut={m.live} />}
    <div className="pg3-r1t">
      <h2 className={'pg3-big' + (m.live ? '' : m.over ? ' is-over' : ' is-ok')}>{m.live ? 'Still inside' : pg3Vs(m)}</h2>
      <p className="pge-cap">{pg3Figs(m)}</p>
    </div>
  </div>
);
const pg3Def = (m) => (m.locks.find((l) => l.exit) || m.locks[m.locks.length - 1] || {}).key;

// ---- 1. Doors you open ----
const Pg3D1 = ({ m }) => {
  const [sel, setSel] = React.useState(() => pg3Def(m)); const lk = m.locks.find((l) => l.key === sel);
  return (
    <section className="pge-card pg3-sess" aria-label="How you got out">
      <Pg3Head m={m} door />
      <Pg3Line m={m} sel={sel} onSel={setSel} />
      <Pg3Panel m={m} lk={lk} tiles />
    </section>
  );
};

// ---- 2. Every move on the line ----
const PG3_KEY = [['look', 'Looked or used'], ['wrong', 'Wrong'], ['near', 'Near miss'], ['hint', 'Hint'], ['open', 'Opened']];
const Pg3D2 = ({ m }) => {
  const [sel, setSel] = React.useState(() => ({ lock: pg3Def(m) }));
  const mo = sel.mo ? m.mo[sel.mo] : null; const key = mo ? mo.lock : sel.lock; const lk = m.locks.find((l) => l.key === key);
  const hi = mo ? new Set(mo.id === 'stall' ? (mo.run || []) : [mo.move]) : null;
  return (
    <section className="pge-card pg3-sess" aria-label="How you got out">
      <Pg3Head m={m} />
      <div className="pg3-lw">
        <Pg3Line m={m} moves sel={key} onSel={(k) => setSel({ lock: k })} hi={hi} />
        <div className="pg3-key" aria-hidden="true">{PG3_KEY.map(([k, l]) => <span key={k}><i className={'pg3-cell is-' + k} />{l}</span>)}</div>
      </div>
      {m.mos.length > 0 && <div className="pg3-chips" role="group" aria-label="Moments from this play">
        {m.mos.map((x) => <button key={x.id} type="button" className="pg3-chip" aria-pressed={sel.mo === x.id} onClick={() => setSel(sel.mo === x.id ? { lock: x.lock } : { mo: x.id })}>{x.title}</button>)}
      </div>}
      <Pg3Panel m={m} lk={lk} mo={mo} />
    </section>
  );
};

// ---- 3. The clock: the same line bent into one lap of a square face. ----
const Pg3Dial = ({ m }) => {
  const ref = React.useRef(null); const W = usePgeWidth(ref); const S = Math.min(W, 360);
  const [sel, setSel] = React.useState(null);
  const T = 14, pad = 24, L = S - 2 * pad, P = 4 * L;
  const lap = m.over ? m.min : Math.max(m.par, m.end || 0);
  const pt = (f) => {
    let d = (f >= 1 ? 0 : f) * P; const h = L / 2;
    if (d <= h) return [pad + h + d, pad, 'h']; d -= h;
    if (d <= L) return [pad + L, pad + d, 'v']; d -= L;
    if (d <= L) return [pad + L - d, pad + L, 'h']; d -= L;
    if (d <= L) return [pad, pad + L - d, 'v']; d -= L; return [pad + d, pad, 'h'];
  };
  const path = 'M ' + (pad + L / 2) + ' ' + pad + ' H ' + (pad + L) + ' V ' + (pad + L) + ' H ' + pad + ' V ' + pad + ' H ' + (pad + L / 2);
  const seg = (a, b, cls, w) => <path className={cls} d={path} strokeWidth={w || T} strokeDasharray={'0 ' + (P * a) + ' ' + (P * (b - a)) + ' ' + P} />;
  const end = (m.live ? m.end : m.min) / lap; const parF = m.par / lap;
  const mo = sel && sel.mo ? m.mo[sel.mo] : null; const lkKey = mo ? mo.lock : sel && sel.lock; const lk = lkKey && m.locks.find((x) => x.key === lkKey);
  let run = null;
  if (mo && mo.id === 'stall') { const prev = m.locks[lk.index - 2]; run = [(prev ? prev.minute : 0) / lap, lk.minute / lap]; }
  const pp = pt(parF); const ep = pt(end);
  const inset = pad + T / 2 + 18;
  return (
    <section className="pge-card pg3-sess" aria-label="How you got out">
      <div className="pg3-dialw" ref={ref}>
        {W > 0 && <div className="pg3-dial" style={{ width: S, height: S }}>
          <svg width={S} height={S} aria-hidden="true">
            <path className="pg3-trk" d={path} strokeWidth={T} />
            {seg(0, Math.min(end, parF), 'pg3-fil')}
            {m.over && seg(parF, 1, 'pg3-ovr')}
            {run && seg(run[0], run[1], 'pg3-run', 4)}
          </svg>
          {!m.live && <span className={'pg3-tick is-' + pp[2]} style={{ left: pp[0], top: pp[1] }} />}
          {m.live && <span className={'pg3-tick is-edge is-' + ep[2]} style={{ left: ep[0], top: ep[1] }} />}
          {m.locks.map((x) => { const p = pt(x.minute / lap); const on = lkKey === x.key; return (
            <button key={x.key} type="button" className="pg3-dd" style={{ left: p[0], top: p[1] }} aria-pressed={on}
              aria-label={x.name + (m.live ? '' : ', minute ' + x.minute)} onClick={() => setSel(on && !mo ? null : { lock: x.key })}>
              <PgeDoor w={12} h={T + 14} />
            </button>); })}
          <div className="pg3-face" style={{ inset }} aria-live="polite">
            {lk ? <>
              {mo ? <span className="gs-label">{mo.title.toUpperCase()}</span> : <PgeNum n={lk.index} size={24} />}
              <b className="pg3-fname">{lk.short}</b>
              <span className="pge-cap">{[mo && mo.id === 'close' ? mo.sub.split(', ').slice(1).join(', ') : mo && mo.id === 'stall' ? mo.sub : pg3Minute(m, lk), pgeFacts(lk)].filter(Boolean).join(' · ')}</span>
              {lk.story && !m.live && <span className="pg3-fstory">{lk.exit && lk.closed ? lk.story + ' ' + lk.closed + ' closed.' : lk.story}</span>}
              <DS.TextLink onClick={() => setSel(null)}>Back to your time</DS.TextLink>
            </> : m.live ? <>
              <b className="pg3-fbig is-word">Still inside</b>
              <span className="pge-cap">{pg3Figs(m)}</span>
            </> : <>
              <span className="pg3-fbig">{m.min}</span>
              <span className="gs-label">MIN TO GET OUT</span>
              <Pg3Vs m={m} />
              <span className="pge-cap">{pg3Figs(m)}</span>
            </>}
          </div>
        </div>}
        {m.mos.length > 0 && <div className="pg3-chips" role="group" aria-label="Moments from this play">
          {m.mos.map((x) => <button key={x.id} type="button" className="pg3-chip" aria-pressed={!!(sel && sel.mo === x.id)} onClick={() => setSel(sel && sel.mo === x.id ? null : { mo: x.id })}>{x.title}</button>)}
        </div>}
      </div>
    </section>
  );
};

const Pg3Body = ({ s, sid }) => {
  const v = usePge(); const d = v.d || 1; const m = React.useMemo(() => pg3Build(s, sid), [s, sid]);
  const D = [Pg3D1, Pg3D2, Pg3Dial][d - 1] || Pg3D1;
  return <>
    <D key={d + sid} m={m} />
    <section className="pg2-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};

// ---- Hooks into the app ----
window.GS_SESSION_BODY = { escape: (props) => <Pg3Body {...props} /> };
window.GS_SESSION_QUIET = { escape: (s, ed) => ({ label: s.game, h1: (ed && ed.title) || PZ.escape.title }) };
const PG3_SHIP_NOW = window.PzNow;
window.PzNow = (props) => (props.id !== 'escape' || props.none ? <PG3_SHIP_NOW {...props} /> : <Pg2Card c={props.c} />);

// ---- The bar ----
const pg3Api = () => window.gsApi;
const pg3Ring = (sel) => setTimeout(() => {
  const el = document.querySelector(sel); if (!el) return;
  const sc = el.closest('.kit-phone-screen');
  if (sc) sc.scrollTop = Math.max(0, el.offsetTop - 80); else window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 96) });
  el.classList.add('pge-ring'); setTimeout(() => el.classList.remove('pge-ring'), 1600);
}, (window.GS_LOAD_MS || 600) + 250);
const pg3GoSession = (ring) => {
  pg3Api().go('library');
  setTimeout(() => { pg3Api().go('escape', { page: 'record' }); setTimeout(() => { const a = pg3Api(); a.go('session', { id: pgeSid(a) }); if (ring) pg3Ring('.pg3-sess'); }, (window.GS_LOAD_MS || 600) + 100); }, 60);
};
const PG3_ROUTES = [
  { n: 1, short: 'Session page', path: 'Library → Escape → See every move', go: () => pg3GoSession(true) },
  { n: 2, short: 'Library card', path: 'Library → Escape (v2’s Version 1 card, unchanged)', go: () => { pg3Api().go('library'); setTimeout(() => { pg3Api().go('escape', { page: 'record' }); pg3Ring('.pg2-now'); }, 60); } },
];
const pg3SetState = (k) => {
  const gs = pg3Api(); if (!gs) return;
  PgeStore.set(k === 'live' ? { live: true } : { finish: k, live: false });
  gs.setReview({ week: k === 'live' ? 'live' : 'done' });
  const r = gs.route; const s = r.name === 'session' && GS_SESSIONS[r.id];
  if (s && s.gid === 'escape') setTimeout(() => { const a = pg3Api(); a.go('session', { id: pgeSid(a) }); }, 0);
};
const PG3_SHARED = 'Shared by all three: v2’s timeline is the picture, and each design carries down to the library card’s row. The head above keeps the cover, the room’s name, the date and Share, and drops the result and its figures; the verdict against par is designed into each body instead. While a room is in progress no minute is written anywhere. Every move is the store’s list, collapsed. The library card is v2’s Version 1, unchanged, until a design is picked.';

const Pg3Bar = () => {
  const v = usePge(); const d = v.d || 1; const gs = pg3Api(); const st = gs ? pgeState(gs) : v.finish; const o = PG3_D[d - 1];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { const h = document.documentElement; h.classList.toggle('pge-bar-on', !v.folded); h.classList.toggle('pge-bar-off', !!v.folded); }, [v.folded]);
  if (v.folded) return <button type="button" className="pge-tab" onClick={() => PgeStore.set({ folded: false })} aria-label="Show the playground bar"><b>{o.n}</b><span>{o.name + ' · ' + PG3_STATES.find((x) => x[0] === st)[1]}</span><DS.Icon name="down" size={16} /></button>;
  return <>
    <div className="pge-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pge-eyebrow">PLAYGROUND v3</span>
      <div className="pge-bgrp" role="group" aria-label="Design">
        <span className="pge-lab">Design</span>
        {PG3_D.map((x) => <button key={x.n} type="button" className="pge-chip" aria-pressed={d === x.n} onClick={() => PgeStore.set({ d: x.n })}><b>{x.n}</b>{x.name}</button>)}
        <button type="button" className="pge-link" onClick={() => setWhy(true)}>Why</button>
      </div>
      <div className="pge-bgrp" role="group" aria-label="This week’s room">
        <span className="pge-lab">Room</span>
        {PG3_STATES.map(([k, l]) => <button key={k} type="button" className="pge-chip" aria-pressed={st === k} onClick={() => pg3SetState(k)}>{l}</button>)}
      </div>
      <div className="pge-bgrp" role="group" aria-label="Go to">
        <span className="pge-lab">Go to</span>
        {PG3_ROUTES.map((x) => <button key={x.n} type="button" className="pge-chip is-go" title={x.path} onClick={x.go}>{x.short}</button>)}
      </div>
      <button type="button" className="pge-fold" aria-label="Hide the playground bar" title="Hide (keys still work: 1 to 3, S)" onClick={() => PgeStore.set({ folded: true })}><DS.Icon name="down" size={20} /></button>
    </div>
    <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title={o.n + ' · ' + o.name}>
      <div className="pge-why"><p><b>For it:</b> {o.stance}</p><p><b>Cost:</b> {o.cost}</p><p>{PG3_SHARED}</p></div>
    </DS.Popup>
  </>;
};
const PG3_ORDER = PG3_STATES.map((x) => x[0]);
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
  if (['1', '2', '3'].includes(e.key)) PgeStore.set({ d: Number(e.key) });
  else if (e.key === 's' || e.key === 'S') { const gs = pg3Api(); if (!gs) return; const i = PG3_ORDER.indexOf(pgeState(gs)); pg3SetState(PG3_ORDER[(i + 1) % PG3_ORDER.length]); }
});

let pg3Opened = false;
window.KitCandidate = {
  bind() {
    if (pg3Opened) return; pg3Opened = true;
    setTimeout(() => {
      const a = window.gsApi; a.setView('pass'); a.setConnected(true); if (PgeStore.get().live) a.setReview({ week: 'live' });
      a.go('escape', { page: 'record' }, 'pass');
      setTimeout(() => { const b = window.gsApi; b.go('session', { id: pgeSid(b) }); }, (window.GS_LOAD_MS || 600) + 100);
    }, 0);
  },
};
const Pg3Tick = () => { const [, t] = React.useReducer((x) => x + 1, 0); React.useEffect(() => { const id = setInterval(t, 400); return () => clearInterval(id); }, []); return <Pg3Bar />; };
(() => { const el = document.createElement('div'); el.id = 'pge-chrome'; document.body.appendChild(el); ReactDOM.createRoot(el).render(<Pg3Tick />); })();
