// ============================================================================
// Playground (1236, Escape's session page): the settings store, the seed it adds, the play model and the parts
// every option draws with. Loads after every app/ file it reads and before app/main.jsx. The main build never loads it.
// ============================================================================

// ---- Settings: which option, and how this week's room finished. Unfinished is the app's own review.week 'live'. ----
const PGE_KEY = window.PGE_KEY || 'pg_escape-session_v1';
const PGE_DEFAULTS = { opt: 1, finish: 'under', live: false };
const PgeStore = (() => {
  let v = { ...PGE_DEFAULTS };
  try { v = { ...v, ...JSON.parse(localStorage.getItem(PGE_KEY) || '{}') }; } catch (e) {}
  const subs = new Set();
  return {
    get: () => v,
    set: (p) => { v = { ...v, ...p }; try { localStorage.setItem(PGE_KEY, JSON.stringify(v)); } catch (e) {} subs.forEach((f) => f()); },
    sub: (f) => { subs.add(f); return () => subs.delete(f); },
  };
})();
const usePge = () => { const [, t] = React.useReducer((x) => x + 1, 0); React.useEffect(() => PgeStore.sub(t), []); return PgeStore.get(); };

// ---- Seed. What the room records that the store's seed does not hold yet: par, your time, and the minute each lock opened.
// escape-over is a second, sample play of the same room that finished over par. Everything a surface shows is read from here. ----
const PGE_PAR = 30;
const PGE_OVER_LINES = [
  ['Move 1', 'Examine the workbench', GS_ES1.bench],
  ['Move 2', 'Try an answer (4 letters) on the workbench drawer', 'Wrong'],
  ['Move 3', 'Try an answer (4 letters) on the workbench drawer', 'Wrong'],
  ['Hint', 'The workbench drawer', 'Count the gears’ teeth, and read each count as a letter.'],
  ['Move 4', 'Try an answer (4 letters) on the workbench drawer', GS_ES1.drawer],
  ['Item', 'Brass winding key', 'A small brass key, its bow shaped like a clock face.'],
  ['Move 5', 'Examine the case clock', GS_ES1.clock],
  ['Move 6', 'Examine the glass cabinet', GS_ES1.cabinet],
  ['Move 7', 'Try an answer (4 digits) on the cabinet lock', 'Wrong'],
  ['Hint', 'The cabinet lock', 'Read the watches in the order the plate gives the days.'],
  ['Move 8', 'Try an answer (4 digits) on the cabinet lock', 'Wrong'],
  ['Hint', 'The cabinet lock', 'Monday’s watch comes first, and it shows seven.'],
  ['Move 9', 'Try an answer (4 digits) on the cabinet lock', 'Wrong'],
  ['Hint', 'The cabinet lock', 'The answer, given outright.'],
  ['Move 10', 'Try an answer (4 digits) on the cabinet lock', GS_ES1.diary],
  ['Move 11', 'Use the brass winding key on the case clock', 'Used up'],
  ['Move 12', 'Set the clock hands to an hour and a minute', 'Wrong'],
  ['Move 13', 'Set the clock hands to an hour and a minute', GS_ES1.hands],
  ['Move 14', 'Examine the portrait', GS_ES1.portrait],
  ['Move 15', 'Examine the fireplace', GS_ES1.fire],
  ['Move 16', 'Examine the oak door', GS_ES1.door],
  ['Move 17', 'Try an answer (4 letters) on the oak door lock', 'Wrong'],
  ['Move 18', 'Try an answer (4 letters) on the oak door lock', 'Out'],
];
GS_SESSIONS['escape-over'] = {
  ...GS_SESSIONS['escape-week'], result: GS_RESULT.escape({ min: 41, par: 'over par' }), share: GS_RESULT.escape({ min: 41, par: 'over par' }),
  figures: ['41 min, over par', '4 hints', '7 wrong tries'],
  shareLines: ['Escape No. 1 · escaped in 41 min, over par · 4 hints 💡 · 7 wrong tries'], lines: PGE_OVER_LINES,
};
// Minutes are the record's: time from going in to getting out, and the minute each lock gave way, in the order they opened.
const PGE_TIMES = { 'escape-week': { min: 28, opened: [6, 17, 19, 28] }, 'escape-over': { min: 41, opened: [9, 27, 34, 41] } };
// Sample only, pass 2: what else the room records for these plays. Near misses and partial readings are keyed by move number,
// story lines and either-or locks by lock. The live play is this week's, cut short, so it reads this week's record.
const PGE_NEAR_DRAWER = 'Right letters, wrong order. The drawer rattles and holds.';
const PGE_REC = {
  'escape-week': { near: { 2: PGE_NEAR_DRAWER }, part: { 7: ['2 of 4 dials', 'Two of the four dials click home.'] } },
  'escape-over': { near: { 2: PGE_NEAR_DRAWER }, part: { 7: ['1 of 4 dials', 'One dial clicks home.'], 9: ['3 of 4 dials', 'Three of the four dials click home.'],
    12: ['1 of 2 hands', 'The hour hand clicks home. The minute hand slips back.'] } },
};
PGE_REC['escape-live'] = PGE_REC['escape-week'];
const PGE_STORY = {
  'workbench drawer': 'Ezra kept the key to the case clock locked away.',
  'cabinet lock': 'Ada left on the four o’clock train, and Ezra stopped every clock.',
  'clock hands': 'The case clock ticks again from the minute they said goodbye.',
  'oak door lock': 'Behind the oak door, a platform clock reads a quarter to four, and Ezra is waiting.',
};
const PGE_EITHER = { 'oak door lock': 'The chimney hatch' };
const pgeSid = (gs) => (gs.review.week === 'live' ? 'escape-live' : PgeStore.get().finish === 'over' ? 'escape-over' : 'escape-week');
const pgeState = (gs) => (gs.review.week === 'live' ? 'live' : PgeStore.get().finish);

// ---- The play model: the record's lines read as locks, hints and moves. ----
const pgeNorm = (x) => String(x).toLowerCase().replace(/^the\s+/, '').trim();
const pgeCap = (x) => String(x).charAt(0).toUpperCase() + String(x).slice(1);
const pgePlural = (n, a, b) => n + ' ' + (n === 1 ? a : b);
const PGE_RUNG = ['', 'a nudge', 'a bigger nudge', 'the answer'];
const pgeBuild = (s, sid) => {
  const t = PGE_TIMES[sid] || s.pgeTimes || null; const live = !!s.live || !t; const rec = PGE_REC[sid] || { near: {}, part: {} };
  const byKey = {}; const locks = []; const stretches = []; let cur = { entries: [], lock: null };
  const lockFor = (name) => { const k = pgeNorm(name); if (!byKey[k]) byKey[k] = { key: k, name: 'The ' + k, short: pgeCap(k), tries: 0, wrong: 0, hints: 0, open: false }; return byKey[k]; };
  let moves = 0;
  (s.lines || []).forEach((l) => {
    const [label, what = '', res = ''] = l; const mv = /^Move (\d+)$/.exec(label);
    const e = { label, what, res, n: mv ? Number(mv[1]) : null, kind: mv ? 'move' : label === 'Hint' ? 'hint' : label === 'Item' ? 'item' : 'note' };
    if (mv) {
      moves += 1; let m;
      if ((m = /^Try an answer \(.+\) on (.+)$/.exec(what)) || (m = /^Set (the .+?) to /.exec(what))) {
        const lk = lockFor(m[1]); lk.tries += 1; e.lock = lk;
        if (res === 'Wrong') {
          lk.wrong += 1; e.out = 'wrong';
          if (rec.near[e.n]) { e.out = 'near'; e.near = rec.near[e.n]; }
          else if (rec.part[e.n]) { e.out = 'part'; e.part = { label: rec.part[e.n][0], said: rec.part[e.n][1] }; }
        } else { e.out = res === 'Out' ? 'out' : 'open'; }
      } else e.out = /^Examine/.test(what) ? 'look' : 'use';
    } else if (e.kind === 'hint') { const lk = lockFor(what); lk.hints = Math.min(3, lk.hints + 1); e.lock = lk; e.rung = lk.hints; }
    if (e.kind === 'item' && !cur.entries.length && stretches.length) { stretches[stretches.length - 1].entries.push(e); return; }
    cur.entries.push(e);
    if (e.out === 'open' || e.out === 'out') {
      const lk = e.lock; lk.open = true; lk.exit = e.out === 'out'; lk.index = locks.push(lk); lk.move = e.n;
      lk.story = PGE_STORY[lk.key] || null; lk.closed = PGE_EITHER[lk.key] || null; lk.si = stretches.length;
      cur.lock = lk; stretches.push(cur); cur = { entries: [], lock: null };
    }
  });
  if (cur.entries.length) stretches.push(cur);
  stretches.forEach((st) => { st.moves = st.entries.filter((e) => e.kind === 'move').length; });
  if (!live) locks.forEach((lk, i) => { lk.minute = t.opened[i]; });
  return { live, min: live ? null : t.min, par: PGE_PAR, over: !live && t.min > PGE_PAR, locks, stretches, moves,
    hints: locks.reduce((a, l) => a + l.hints, 0) + 0, wrong: Object.values(byKey).reduce((a, l) => a + l.wrong, 0) };
};
// A lock's facts in words: tries, then the hint reached. No marks a reader has to learn.
const pgeTries = (lk) => (lk.tries <= 1 ? 'First try' : lk.tries + ' tries');
const pgeHint = (lk) => (!lk.hints ? 'No hints' : lk.hints === 1 ? '1 hint: a nudge' : lk.hints + ' hints, up to ' + PGE_RUNG[lk.hints]);
const pgeFacts = (lk) => [pgeTries(lk), lk.hints ? pgeHint(lk) : null].filter(Boolean).join(' · ');
const pgeOutWord = (e) => ({ wrong: 'Wrong', near: 'Near miss', part: e.part && e.part.label, open: 'Opened', out: 'Out', use: e.res === 'Used up' ? 'Used up' : 'Used', look: '' })[e.out] || '';
// The room's own words for an entry, or null: a reply, a near miss's reply, a partial reading, a hint.
const pgeSaid = (e) => (e.kind === 'hint' ? e.res : e.near || (e.part && e.part.said)
  || (e.kind === 'move' && e.res && !['Wrong', 'Out', 'Used up'].includes(e.res) ? e.res : null));
const pgeHead = (m) => (m.live ? 'So far: ' : 'Escaped in ') + pgePlural(m.moves, 'move', 'moves');

// ---- Key moments, by one rule (owner's call, not ratified): the first lock opened at the first try with no hint; the closest
// miss (the highest partial reading, else the first near miss); the longest stretch to a lock, if 4 moves or more; the way out.
// Each links to a lock, a move and a stretch, so a timeline can light its place. ----
const PGE_MOMENT_RULE = 'The first lock opened at the first try, the closest miss, the longest stretch to a lock (4 moves or more), and the way out.';
const pgeMoments = (m) => {
  const out = []; const all = []; m.stretches.forEach((st, si) => st.entries.forEach((e) => all.push({ e, si })));
  const first = m.locks.find((lk) => !lk.exit && lk.tries === 1 && !lk.hints);
  if (first) out.push({ id: 'first', title: 'First try', sub: first.name + ', move ' + first.move, lock: first.key, move: first.move, si: first.si });
  const frac = (x) => { const r = /^(\d+) of (\d+)/.exec(x.e.part.label); return r ? r[1] / r[2] : 0; };
  const close = all.filter((x) => x.e.out === 'part').sort((a, b) => frac(b) - frac(a))[0] || all.find((x) => x.e.out === 'near');
  if (close) out.push({ id: 'close', title: 'Closest miss', sub: close.e.lock.name + ', ' + (close.e.part ? close.e.part.label : 'a near miss') + ', move ' + close.e.n,
    lock: close.e.lock.key, move: close.e.n, si: close.si });
  const long = m.stretches.map((st, si) => ({ st, si })).filter((x) => x.st.lock).sort((a, b) => b.st.moves - a.st.moves)[0];
  if (long && long.st.moves >= 4) out.push({ id: 'stall', title: 'Longest stretch', sub: pgePlural(long.st.moves, 'move', 'moves') + ' to ' + long.st.lock.name.toLowerCase(),
    lock: long.st.lock.key, move: long.st.lock.move, si: long.si, run: long.st.entries.filter((e) => e.kind === 'move').map((e) => e.n) });
  const ex = m.locks.find((lk) => lk.exit);
  if (ex) out.push({ id: 'out', title: 'The way out', sub: ex.name + ', move ' + ex.move, lock: ex.key, move: ex.move, si: ex.si });
  return out.sort((a, b) => a.move - b.move);
};
const PgeMoments = ({ list, sel, onSel }) => (list.length ? (
  <div className="pge-mos" role="group" aria-label="Moments from this play">
    {list.map((mo) => <button key={mo.id} type="button" className="pge-mo" aria-pressed={sel === mo.id} onClick={() => onSel(mo.id)}>
      <span className="pge-mo-t">{mo.title}</span><span>{mo.sub}</span></button>)}
  </div>) : null);
// A timeline press on a lock: the next moment on it, so a lock with two moments steps through them.
const pgeNextMoment = (list, sel, pred) => { const c = list.filter(pred); if (!c.length) return sel; const i = c.findIndex((x) => x.id === sel); return c[(i + 1) % c.length].id; };

// ---- Parts ----
// The cover's door: its teal leaf and amber knob, from the cover's own flat shapes.
const PgeDoor = ({ w = 12, h = 20, open }) => (
  <span className="pge-door" aria-hidden="true" style={{ width: w, height: h }} data-open={open ? 1 : undefined}><i /></span>
);
const PgeNum = ({ n, size = 22 }) => <span className="pge-num" style={{ '--n': size + 'px' }} aria-hidden="true">{n}</span>;
const usePgeWidth = (ref) => {
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const f = () => setW(Math.floor(el.getBoundingClientRect().width)); f();
    const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect();
  }, []);
  return w;
};
const pgeCanvas = document.createElement('canvas');
const pgeMeasure = (text, font) => { const c = pgeCanvas.getContext('2d'); c.font = font; return Math.ceil(c.measureText(text).width); };
// Rows for labels on one line: each label takes the first row where it clears the last label by 12px.
const pgeRows = (items) => {
  const ends = []; return items.map((it) => { let r = 0; while (ends[r] != null && ends[r] + 12 > it.l) r += 1; ends[r] = it.l + it.w; return r; });
};
// The room's reply, with what follows it (a hint, an item) as its own short lines.
const PgeReply = ({ e }) => { const w = e.kind === 'item' ? e.res : pgeSaid(e); return w ? <p className="pge-said">{w}</p> : null; };
const pgeEntryHead = (e) => (e.kind === 'move' ? e.what : e.kind === 'hint' ? 'Hint on ' + e.lock.name.toLowerCase() + ', ' + PGE_RUNG[e.rung] : e.kind === 'item' ? 'Picked up: ' + e.what : e.what);
// The card's link and its session, for the library card of every option.
const pgeCardLines = (m) => (m.live
  ? (m.locks.length ? 'You’ve opened ' + pgePlural(m.locks.length, 'lock', 'locks') + ' in ' + pgePlural(m.moves, 'move', 'moves') + '.' : 'You’ve made ' + pgePlural(m.moves, 'move', 'moves') + '.')
  : 'You got out in ' + pgePlural(m.moves, 'move', 'moves') + ', with ' + (m.hints ? pgePlural(m.hints, 'hint', 'hints') : 'no hints') + '.');

Object.assign(window, { pgeSaid, pgeHead, pgeMoments, PgeMoments, pgeNextMoment, PGE_MOMENT_RULE, PgeStore, usePge, PGE_DEFAULTS, PGE_PAR, PGE_TIMES, pgeSid, pgeState, pgeBuild, pgeTries, pgeHint, pgeFacts, pgeOutWord, pgePlural,
  PgeDoor, PgeNum, usePgeWidth, pgeMeasure, pgeRows, PgeReply, pgeEntryHead, pgeCardLines, PGE_RUNG });
