// ============================================================================
// After Pixels — Escape's own parts (1236): the session page's body (the result, the line, a lane per lock, Every move) and the
// now card on Escape's library game page, which carries the result and the line. Reads the room's record in app/gs-data.jsx
// (esTimes, esParts, GS_ES1_PAR, GS_ES1_CLOSED, GS_ES_PARTS). Loads after app/gs-pass-library.jsx, whose now cards it extends.
// ============================================================================

// This week's play: in progress, else the finished play Config picks (This edition: Hard; Escape: par), else the seeded one.
const ES_SIDS = { under: 'escape-week', par: 'escape-par', over: 'escape-over', hard: 'escape-hard' };
const esFinished = (gs) => gsEdPick('escape', gs) || ES_SIDS[gs.review.escape] || 'escape-week';
const esSid = (gs) => (gs.review.week === 'live' ? 'escape-live' : esFinished(gs));

// ---- The model: the record's lines read as locks, each with its tries and hints in order. A typed lock answers Open or
// Wrong; a mechanism (Set …) answers with how many of its parts were right. ----
const esPlural = (n, a, b) => n + ' ' + (n === 1 ? a : b);
const esBuild = (s) => {
  const t = s.esTimes || null; const live = !!s.live || !t; const parts = s.esParts || {};
  const byKey = {}; const locks = []; let moves = 0; let wrong = 0;
  const lockFor = (name) => {
    const k = String(name).toLowerCase().replace(/^the\s+/, '').trim();
    if (!byKey[k]) byKey[k] = { key: k, name: 'The ' + k, short: k.charAt(0).toUpperCase() + k.slice(1), tries: 0, hints: 0, rows: [] };
    return byKey[k];
  };
  (s.lines || []).forEach(([label, what = '', res = '']) => {
    const mv = /^Move (\d+)$/.exec(label);
    if (label === 'Hint') { const lk = lockFor(what); lk.hints = Math.min(3, lk.hints + 1); lk.rows.push({ k: 'hint', rung: lk.hints }); return; }
    if (!mv) return;
    moves += 1; const n = Number(mv[1]); let m; let lk; let kind; let slots;
    if ((m = /^Tried (\S+) on (.+)$/.exec(what))) { lk = lockFor(m[2]); kind = 'typed'; slots = m[1].length; }
    else if ((m = /^Set (the .+?): /.exec(what))) { lk = lockFor(m[1]); kind = 'mech'; slots = GS_ES_PARTS[lockFor(m[1]).key] || 2; }
    if (!lk) return;
    // A try is wrong when the lock answers Wrong, or a mechanism says how many of its parts are right ("1 of 2 hands click into place.").
    const ok = !(res === 'Wrong' || /^\d+ of \d+ .* into place\.$/.test(res)); lk.tries += 1; if (!ok) wrong += 1;
    const lit = ok ? slots : kind === 'mech' && parts[n] ? parts[n][0] : 0;
    lk.rows.push({ k: 'try', n, kind, slots, lit, ok });
    if (ok) { lk.exit = res === 'Out'; lk.index = locks.push(lk); lk.closed = GS_ES1_CLOSED[lk.key] || null; }
  });
  // The game records no lock minutes while a room is in progress; the line reads this week's finished play (a gap the spec holds).
  const at = live ? GS_SESSIONS['escape-week'].esTimes.opened : t.opened;
  locks.forEach((lk, i) => { lk.minute = at[i]; });
  const par = GS_ES1_PAR; const min = live ? null : t.min;
  return { live, min, par, over: !live && min > par, locks, moves, wrong, hints: locks.reduce((a, l) => a + l.hints, 0),
    end: live ? (locks.length ? locks[locks.length - 1].minute : 0) : min };
};
const esFacts = (l) => [l.tries <= 1 ? 'First try' : l.tries + ' tries', l.hints ? esPlural(l.hints, 'hint', 'hints') : null, l.exit && l.closed ? l.closed + ' closed' : null].filter(Boolean).join(' · ');
const esFigs = (m) => (m.live
  ? [esPlural(m.locks.length, 'lock', 'locks') + ' open', esPlural(m.moves, 'move', 'moves') + ' so far']
  : [esPlural(m.moves, 'move', 'moves'), m.hints ? esPlural(m.hints, 'hint', 'hints') : 'No hints', m.wrong ? esPlural(m.wrong, 'wrong try', 'wrong tries') : 'No wrong tries']);
// Exactly par counts as under (Escape spec).
const esSpare = (m) => (m.over ? (m.min - m.par) + ' min over par' : m.min === m.par ? 'On par' : (m.par - m.min) + ' min under par');
const esWord = (r) => (r.ok ? 'Open' : r.kind === 'mech' ? r.lit + ' of ' + r.slots : 'Wrong');

// ---- Parts: the cover's door, shut; the exit door left open; the lock's number; one mark a try (lit when it opened; a
// mechanism's split into its parts, lit as the room counted them). ----
// KEEP: the open exit door's frame is filled with the page colour, so the bar never shows through it.
const EsDoor = ({ w = 12, h = 20 }) => <span className="es-door" aria-hidden="true" style={{ width: w, height: h }}><i /></span>;
const EsOpen = ({ w, h }) => <span className="es-od" style={{ width: w, height: h }} aria-hidden="true"><i><b /></i></span>;
const EsNum = ({ n, size = 24 }) => <span className="es-num" style={{ '--n': size + 'px' }} aria-hidden="true">{n}</span>;
const EsMark = ({ r, size }) => (
  <span className={'es-mk' + (r.ok ? ' is-on' : '')} style={{ '--t': size + 'px' }} aria-hidden="true">
    {r.kind === 'mech' && !r.ok ? Array.from({ length: r.slots }, (_, j) => <i key={j} className={j < r.lit ? 'is-on' : ''} />) : null}
  </span>);
const useEsWidth = (ref) => {
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const f = () => setW(Math.floor(el.getBoundingClientRect().width)); f();
    const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect();
  }, []);
  return w;
};
const esCanvas = document.createElement('canvas');
const esMeasure = (text, font) => { const c = esCanvas.getContext('2d'); c.font = font; return Math.ceil(c.measureText(text).width); };
const ES_FONT = '"Hanken Grotesk", system-ui, sans-serif';
// KEEP: door labels never overlap: one that would sit within 12px of the last drops to a row below, with a leader up to its door.
const esRows = (items) => { const ends = []; return items.map((it) => { let r = 0; while (ends[r] != null && ends[r] + 12 > it.l) r += 1; ends[r] = it.l + it.w; return r; }); };

// ---- The line: one bar from going in to getting out, the cover's door at the minute each lock gave way, par a tick above it.
// card: the now card's smaller size. ----
// KEEP: every door is a button. On the session page it picks its lock's lane. On the now card it opens the session page with that
// lock's lane picked, so a player goes from the card straight to the lock they want to see (owner, 2026-10-27: "brilliant").
const EsLine = ({ m, sel, onSel, card }) => {
  const ref = React.useRef(null); const W = useEsWidth(ref); const [hov, setHov] = React.useState(null);
  const hp = (k) => ({ onMouseEnter: () => setHov(k), onMouseLeave: () => setHov((h) => (h === k ? null : h)), onFocus: () => setHov(k), onBlur: () => setHov((h) => (h === k ? null : h)) });
  const [BAR, OH, DW, NUM, ROW] = card ? [20, 6, 12, 20, 24] : [28, 8, 14, 24, 32]; const TOP = 20; const R = 10;
  const inner = W - R;
  const parText = 'Par ' + m.par + ' min'; const parW = esMeasure(parText, '400 13px ' + ES_FONT);
  const outText = 'Out ' + m.min + ' min'; const outW = esMeasure(outText, '600 14px ' + ES_FONT) + 8;
  const end = m.end;
  const fit = (t, w) => (t * inner) / Math.max(1, W - w / 2 - 2);
  const span = Math.max(Math.max(end || 0, m.par) + (m.live ? 3 : 0), fit(m.par, parW), m.live ? 0 : fit(m.min, outW));
  const x = (t) => Math.round((t / span) * inner);
  const barT = TOP + 6 + OH; const barB = barT + BAR;
  const parX = x(m.par); const endX = x(end); const onPar = !m.live && m.min === m.par;
  // KEEP: doors stay at least 32px apart at every width (a 32px hit area each), and a longer wait between two locks still looks
  // longer; the first and last doors stay on their minute, those between may drift a little off it.
  const GAP = 32; const dx = m.locks.map((lk) => x(lk.minute)); const nd = dx.length;
  if (nd > 1 && dx.some((c, i) => i && c - dx[i - 1] < GAP)) {
    const t0 = m.locks[0].minute; const tl = m.locks[nd - 1].minute; const k = (dx[nd - 1] - dx[0] - GAP * (nd - 1)) / Math.max(1, tl - t0);
    if (k >= 0) { const x0 = dx[0]; m.locks.forEach((lk, i) => { dx[i] = Math.round(x0 + GAP * i + (lk.minute - t0) * k); }); }
    else { for (let i = 1; i < nd; i += 1) dx[i] = Math.max(dx[i], dx[i - 1] + GAP); }
  }
  const labs = m.locks.map((lk, i) => { const out = lk.exit && !m.live; const w = out ? outW : NUM;
    return { lk, xx: dx[i], w, l: Math.max(0, Math.min(dx[i] - w / 2, W - w)), out }; });
  const ls = labs.slice().sort((a, b) => a.l - b.l); esRows(ls).forEach((r, i) => { ls[i].r = r; });
  const nRows = labs.length ? Math.max(...labs.map((b) => b.r)) + 1 : 1;
  const labT = barB + OH + 8; const H = labT + nRows * ROW;
  const label = m.live ? 'In progress. ' + esPlural(m.locks.length, 'lock', 'locks') + ' open.' : 'Out at minute ' + m.min + ', par ' + m.par + '.';
  return (
    <div className={'es-line' + (card ? ' is-card' : '')} ref={ref} style={{ height: H }} aria-label={label} role="group">
      {W > 0 && <>
        <span className="es-ptxt" style={{ left: Math.round(parX - parW / 2), top: 0 }}>{parText}</span>
        {/* KEEP: out exactly on par, the par tick stops short of the exit door that sits on it, and there is no tick under the bar. */}
        <span className="es-ptk" style={{ left: parX - 1, top: TOP, height: onPar ? Math.max(2, barT - OH - TOP - 10) : barT - TOP - 2 }} />
        {!onPar && <span className="es-ptk" style={{ left: parX - 1, top: barB + 2, height: OH + 2 }} />}
        <span className="es-track" style={{ top: barT, height: BAR, width: inner }} />
        <span className="es-fill" style={{ top: barT, height: BAR, width: m.over ? parX : endX }} />
        {m.over && <span className="es-fill is-over" style={{ top: barT, height: BAR, left: parX, width: endX - parX }} />}
        {m.live && <span className="es-edge" style={{ top: barT - 4, height: BAR + 8, left: endX - 1 }} />}
        {m.locks.map((lk, i) => { const out = lk.exit && !m.live; return (
          <button key={lk.key} type="button" className={'es-dr' + (sel === lk.key ? ' is-sel' : '') + (hov === lk.key ? ' is-hov' : '')} {...hp(lk.key)}
            style={{ left: dx[i] - GAP / 2, width: GAP, top: barT - OH, height: BAR + OH * 2 }} aria-pressed={card ? undefined : sel === lk.key}
            aria-label={lk.name + (m.live ? '' : ', minute ' + lk.minute)} onClick={() => onSel(lk.key)}>
            {out ? <EsOpen w={DW} h={BAR + OH * 2} /> : <EsDoor w={DW} h={BAR + OH * 2} />}
          </button>); })}
        {labs.map((b) => { const top = labT + b.r * ROW; return <React.Fragment key={b.lk.key}>
          {b.r > 0 && <span className="es-lead" style={{ left: b.xx, top: barB + OH, height: top - barB - OH }} />}
          <button type="button" className={'es-lab' + (b.out ? ' is-out' : '') + (sel === b.lk.key ? ' is-sel' : '') + (hov === b.lk.key ? ' is-hov' : '')} {...hp(b.lk.key)}
            style={{ left: b.l, top, width: b.w, height: NUM }} aria-hidden="true" tabIndex={-1} onClick={() => onSel(b.lk.key)}>
            {b.out ? outText : <EsNum n={b.lk.index} size={NUM} />}
          </button>
        </React.Fragment>; })}
      </>}
    </div>
  );
};

// ---- The session page's result: the door at cover size, open once you are out, beside "Escaped" and how that stands against
// par. No time: the line has it. In progress: the door shut, "Still inside". ----
const EsResult = ({ m, card }) => (
  <div className={'es-res' + (card ? ' is-card' : '')}>
    {m.live ? <EsDoor w={card ? 20 : 40} h={card ? 34 : 68} /> : <EsOpen w={card ? 20 : 40} h={card ? 34 : 68} />}
    <div className="es-rest">
      <div className="es-resh">
        {card ? <p className="es-h">{m.live ? 'Still inside' : 'Escaped'}</p> : <h2 className="es-h">{m.live ? 'Still inside' : 'Escaped'}</h2>}
        {!m.live && <p className={'es-vd is-' + (m.over ? 'over' : 'ok')}><DS.Icon name={m.over ? 'close' : 'check'} size={20} />{esSpare(m)}</p>}
      </div>
      {!card && <p className="es-cap">{esFigs(m).join(' · ')}</p>}
    </div>
  </div>);

// The now card's result, where the store's now card puts its result. In progress: the store's In progress.
const EsVerdict = ({ m }) => (m.live
  ? <span className="lb-big"><LbResult s={{ kind: 'live', label: 'In progress' }} /></span>
  // One word, coloured by how it stands against par (green under or on par, amber over); no icon. The line's "Out 28 min" and par
  // tick give the minutes.
  : <p className={'es-vd is-' + (m.over ? 'over' : 'ok')}>Escaped</p>);

// ---- Lanes: one per lock, each a small line: its tries and hints left to right, running on to the lock's door at the right edge.
// A typed lock's wrong try has no word under its mark. ----
// KEEP: two lanes to a row from 720px; on a phone only the lock you picked, so its door and its lane fit one screen.
const EsLanes = ({ m, sel, onSel }) => (
  <div className="es-lanes">
    {m.locks.map((l) => (
      <button key={l.key} type="button" className={'es-lane' + (sel === l.key ? ' is-sel' : '')} aria-pressed={sel === l.key} onClick={() => onSel(l.key)}>
        <span className="es-lnh"><span className="es-lname"><EsNum n={l.index} size={24} /><b>{l.short}</b></span><span className="es-cap">{esFacts(l)}</span></span>
        <span className="es-steps">
          {l.rows.map((r, i) => (r.k === 'hint'
            ? <span key={'h' + i} className="es-step is-hint"><i className="es-hm" /><small>{'Hint ' + r.rung}</small></span>
            : <span key={r.n} className="es-step"><EsMark r={r} size={24} /><small>{!r.ok && r.kind === 'typed' ? '\u00a0' : esWord(r)}</small></span>))}
          <span className="es-step is-door">{l.exit && !m.live ? <EsOpen w={12} h={24} /> : <EsDoor w={12} h={24} />}<small>{l.exit && !m.live ? 'Out' : '\u00a0'}</small></span>
        </span>
      </button>))}
  </div>);

// ---- The session page's own part, under the shared head. Every move is the store's plain list, collapsed. ----
// KEEP: it opens on the lock the route names (a door pressed on the now card), else the way out.
const EsBody = ({ s, sid }) => {
  const gs = useGs(); const m = React.useMemo(() => esBuild(s), [s]);
  const def = (m.locks.find((l) => l.exit) || m.locks[m.locks.length - 1] || {}).key;
  const [sel, setSel] = React.useState(() => (m.locks.some((l) => l.key === gs.route.lock) ? gs.route.lock : def));
  return <>
    <section className="es-card" aria-label="How you got out">
      <EsResult m={m} />
      <EsLine m={m} sel={sel} onSel={setSel} />
      {m.locks.length > 0 && <div className="es-detail" aria-label="The locks"><EsLanes m={m} sel={sel} onSel={setSel} /></div>}
    </section>
    <GsMoves s={s} />
  </>;
};
const EsSessBody = (props) => <EsBody key={props.sid} {...props} />;

// ---- The now card, once this week's room is played or started: the store's frame (label, title, result at the right, Share, the
// record link, the next room, and once finished "See what's out for you to play"), with the verdict as its result and the
// session page's line at the card's size. A door opens the session page at its lock. No lanes: the session page has them. ----
const EsNow = ({ label, title, next, noNext, children }) => {
  const gs = useGs(); const sid = esSid(gs); const s = GS_SESSIONS[sid]; const m = React.useMemo(() => esBuild(s), [s]);
  const open = (lock) => gs.go('session', lock ? { id: sid, lock } : { id: sid });
  return (
    <section className="lb-card es-now">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{label}</span><h2 className="mcp-t-sec">{title}</h2></div>
        <EsVerdict m={m} />
      </div>
      <EsLine m={m} onSel={open} card />
      <div className="lb-foot">
        <div className="lb-acts">
          {!m.live && <LbShare lines={gsShareText(s)} />}
          <DS.TextLink onClick={() => open()}>{m.live ? 'See your moves so far' : 'See every move'}</DS.TextLink>
        </div>
        {next && <span className="gs-muted">{next}</span>}
      </div>
      {children}
      {!m.live && !noNext && <GsNextLink />}
    </section>
  );
};

// ---- Hooks into the app: the session page's body (app/gs-session.jsx; the head is the shared GsSessHead), and the Pass holder's now card
// (PzNow in gs-pass-library.jsx). A free player's first-room card reads EsNow in app/gs-pass-library.jsx (CprFirst). ----
const registerEscape = () => { GS_SESSION_BODY.escape = EsSessBody; };

Object.assign(window, { esSid, esBuild, EsNow, EsLine, EsResult });
