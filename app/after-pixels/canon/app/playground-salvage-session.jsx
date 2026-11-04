// ============================================================================
// PLAYGROUND, not canon (branch candidate/salvage-session-hifi): Salvage's session page body at hi fi, from the ratified low fi
// (lm-1236 salvage-ratify): Result top; Sea left; Counts above Kit, centred against the Sea; phone order Result, Sea, Counts, Kit.
// Settings (app/playground.jsx): Kit direction (concept), State (key play: state is canon's own URL key), Reach. Open with ?pg=salvage-session.
// The plays are fixtures (edition No. 21's sea, invented dives), not the canon session the head reads. To remove it: delete this file
// and playground-salvage-session.css, and their lines in main.jsx and canon.css. Styles: app/playground-salvage-session.css.
// ============================================================================
import React from 'react';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_SESSION_BODY } from './registry.js';

// ---- Fixtures: edition No. 21's five wrecks (A5-D5, E3-G3, F6-H6, G8-H8, C1-C2) and three plays of it. ----
const COLS = 'ABCDEFGH';
const WRECKS = [['A5', 'B5', 'C5', 'D5'], ['E3', 'F3', 'G3'], ['F6', 'G6', 'H6'], ['G8', 'H8'], ['C1', 'C2']];
const SHOWN_R = { 3: 3, 5: 4, 6: 3, 7: 0 }; const SHOWN_C = { C: 3, E: 1, F: 2, H: 2 };
const DIVES = 20;
const TOOLS = { sonar: 'Sonar', detector: 'Metal detector', net: 'Dragnet' };
const ALL = Object.keys(TOOLS);
const split = (s) => s.split(' ');
const PLAYS = {
  won: { state: 'won', seq: split('A4 A5 B5 C5 D5 D3 E3 F3 G3 H3 C1 C2 F6 H6 E6 H7 G8 H8'), netHit: 'G6',
    tools: { sonar: { used: true, row: 3, count: 3 }, detector: { used: true, sq: 'F4', count: 3 }, net: { used: true, col: 'G', snag: 'G6' } } },
  // A lost play spends all 20 dives (spec and deployed Salvage give 20; canon's 30 is stale).
  lost: { state: 'lost', seq: split('A1 B1 C1 C2 D1 D3 E3 F3 G3 H3 A5 B5 C5 D5 H4 B7 D7 E8 F8 A8'), netHit: null,
    tools: { sonar: { used: true, row: 6, count: 3 }, detector: { used: true, sq: 'G5', count: 2 }, net: { used: false } } },
  live: { state: 'live', seq: split('A5 B5 C5 D5 D3 E3 F3 G3 C1'), netHit: null,
    tools: { sonar: { used: true, row: 3, count: 3 }, detector: { used: true, sq: 'E4', count: 2 }, net: { used: false } } },
};
const RESULT = { won: { tone: 'ok', word: 'Completed' }, lost: { tone: 'bad', word: 'Failed' }, live: { tone: 'live', word: 'In progress' } };
const PGS = { won: 'salvage-today', lost: 'salvage-today-failed', live: 'salvage-live' };

const wreckOf = (sq) => WRECKS.findIndex((w) => w.includes(sq));
// Per wreck: its squares, whether every one was hit (raised), and each square's mark; every other dive is a miss.
const read = (p) => {
  const hit = new Set(); const miss = new Set();
  p.seq.forEach((s) => (wreckOf(s) > -1 ? hit : miss).add(s));
  if (p.netHit) hit.add(p.netHit);
  const wrecks = WRECKS.map((w) => { const raised = w.every((s) => hit.has(s)); return { w, raised, unfound: !raised && p.state === 'lost', hits: w.filter((s) => hit.has(s)) }; });
  return { wrecks, miss: [...miss], found: wrecks.filter((x) => x.raised).length };
};
const colOf = (sq) => COLS.indexOf(sq[0]); const rowOf = (sq) => +sq.slice(1) - 1;
// The squares a used tool reached, as a rectangle of 0-based column and row indexes.
const reach = (k, t) => {
  if (k === 'sonar') return { c0: 0, c1: 7, r0: t.row - 1, r1: t.row - 1 };
  if (k === 'detector') { const c = colOf(t.sq), r = rowOf(t.sq); return { c0: Math.max(0, c - 1), c1: Math.min(7, c + 1), r0: Math.max(0, r - 1), r1: Math.min(7, r + 1) }; }
  return { c0: COLS.indexOf(t.col), c1: COLS.indexOf(t.col), r0: 0, r1: rowOf(t.snag) };
};
const reachResult = (k, t) => (k === 'net' ? t.snag : String(t.count));

// ---- Icons, line-drawn as Delve's and the shop's (24px, 1.75 stroke, square caps, mitred joins). ----
const IC = {
  sonar: 'M12 20h.01M8.5 16.5a5 5 0 0 1 7 0M5.5 13.5a9 9 0 0 1 13 0M2.5 10.5a13 13 0 0 1 19 0',
  detector: 'M19 3L10.5 16.5M15.5 3H20v4.5M3 19.5a5 2.5 0 1 0 10 0a5 2.5 0 1 0-10 0',
  net: 'M4 4h16l-3 16H7zM9.3 4l.9 16M14.7 4l-.9 16M5.4 10.5h13.2M6.3 15.5h11.4',
};
const SvIcon = ({ k, size }) => (<svg className="sv-ic" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={IC[k]} /></svg>);

// ---- The Sea. One grid: a label column, eight squares, a count column; a row of shown column counts, a row of letters, eight rows. ----
const gc = (i) => i + 2; const gr = (i) => i + 3;
const SvMark = ({ k }) => (k === 'hit'
  ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
  : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10c2-2 3-2 5 0s3 2 5 0 3-2 5 0M4 15c2-2 3-2 5 0s3 2 5 0 3-2 5 0" /></svg>);
const SvSea = ({ p, mode }) => {
  const d = read(p); const used = ALL.filter((k) => p.tools[k].used);
  const hitAt = new Set(d.wrecks.flatMap((x) => (x.raised ? [] : x.hits)));
  const cov = {};
  if (mode === 'sq') used.forEach((k) => { const R = reach(k, p.tools[k]); for (let r = R.r0; r <= R.r1; r++) for (let c = R.c0; c <= R.c1; c++) (cov[COLS[c] + (r + 1)] = cov[COLS[c] + (r + 1)] || []).push(k); });
  const corners = {};
  const sweep = p.tools.sonar.used ? p.tools.sonar : null;
  return (
    <div className="sv-sea" role="img" aria-label={'The sea: ' + d.found + ' of 5 wrecks raised, ' + p.seq.length + ' dives'}>
      {COLS.split('').map((c, i) => <React.Fragment key={c}>
        <span className="sv-mc" style={{ gridColumn: gc(i), gridRow: 1 }}>{SHOWN_C[c] === undefined ? '' : SHOWN_C[c]}</span>
        <span className="sv-ml" style={{ gridColumn: gc(i), gridRow: 2 }}>{c}</span></React.Fragment>)}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => { const rc = sweep && sweep.row === r ? sweep.count : SHOWN_R[r]; return <React.Fragment key={r}>
        <span className="sv-ml" style={{ gridColumn: 1, gridRow: gr(r - 1) }}>{r}</span>
        <span className={'sv-mc' + (sweep && sweep.row === r ? ' is-swept' : '')} style={{ gridColumn: 10, gridRow: gr(r - 1) }}>{rc === undefined ? '' : rc}</span></React.Fragment>; })}
      {COLS.split('').flatMap((c, i) => [1, 2, 3, 4, 5, 6, 7, 8].map((r) => <span key={c + r} className="sv-sq" style={{ gridColumn: gc(i), gridRow: gr(r - 1) }} />))}
      {d.miss.map((s) => <span key={s} className="sv-sq is-miss" style={{ gridColumn: gc(colOf(s)), gridRow: gr(rowOf(s)) }}><SvMark k="miss" /></span>)}
      {[...hitAt].map((s) => <span key={s} className="sv-sq is-hit" style={{ gridColumn: gc(colOf(s)), gridRow: gr(rowOf(s)) }}><SvMark k="hit" /></span>)}
      {d.wrecks.filter((x) => x.raised || x.unfound).map((x) => { const horiz = rowOf(x.w[0]) === rowOf(x.w[x.w.length - 1]);
        return <span key={x.w[0]} className={'sv-hull ' + (x.raised ? 'is-raised' : 'is-unfound') + (horiz ? '' : ' is-down')}
          style={{ gridColumn: gc(colOf(x.w[0])) + ' / span ' + (horiz ? x.w.length : 1), gridRow: gr(rowOf(x.w[0])) + ' / span ' + (horiz ? 1 : x.w.length) }} />; })}
      {mode === 'sq' && Object.keys(cov).flatMap((s) => cov[s].map((k, i) => <i key={s + k} className={'sv-ro t-' + k} style={{ gridColumn: gc(colOf(s)), gridRow: gr(rowOf(s)), '--i': i }} />))}
      {mode === 'key' && used.map((k) => { const R = reach(k, p.tools[k]); const corner = R.c0 + ',' + R.r0; const n = corners[corner] = (corners[corner] || 0) + 1;
        return <i key={k} className={'sv-box t-' + k} style={{ gridColumn: (gc(R.c0)) + ' / ' + (gc(R.c1) + 1), gridRow: gr(R.r0) + ' / ' + (gr(R.r1) + 1), '--n': n - 1 }}>
          <b className="sv-tag">{reachResult(k, p.tools[k])}</b></i>; })}
    </div>);
};
const SvKey = () => (<div className="sv-key" aria-hidden="true">{ALL.map((k) => <span key={k}><i className={'t-' + k} />{TOOLS[k]}</span>)}</div>);

// ---- Counts: dives of the 20, wrecks of the 5. The wrecks figure carries five hulls (4, 3, 3, 2, 2 squares), raised ones filled;
// at 5/5 it takes a rim, as Delve's inspiration does, since all five is the figure that matters. ----
const SvCounts = ({ p }) => { const d = read(p); const all = d.found === 5; return (
  <div className="sv-counts">
    <div className="sv-fig" role="img" aria-label={p.seq.length + ' of ' + DIVES + ' dives'}>
      <span className="sv-fig-n" aria-hidden="true"><b>{p.seq.length}</b><small>/{DIVES}</small></span><span className="sv-cap" aria-hidden="true">dives</span></div>
    <div className={'sv-fig' + (all ? ' is-all' : '')} role="img" aria-label={d.found + ' of 5 wrecks'}>
      <span className="sv-fig-n" aria-hidden="true"><b>{d.found}</b><small>/5</small></span>
      <span className="sv-pips" aria-hidden="true">{d.wrecks.map((x, i) => <i key={i} className={x.raised ? 'is-on' : ''} style={{ '--len': x.w.length }} />)}</span>
      <span className="sv-cap" aria-hidden="true">wrecks</span></div>
  </div>); };

// ---- The Kit, four directions. Each tool is used or not used; a used tool is spent, dimmed and struck through as Delve's used gear is. ----
const KIT = {
  cards: ({ p }) => (<div className="sv-kit sv-k-cards">{ALL.map((k) => { const u = p.tools[k].used; return (
    <div key={k} className={'sv-kc' + (u ? ' is-used' : '')}><SvIcon k={k} size={28} /><b>{TOOLS[k]}</b><small>{u ? 'Used' : 'Not used'}</small></div>); })}</div>),
  cells: ({ p }) => (<div className="sv-kit dv7-cells sv-k-cells">{ALL.map((k) => { const u = p.tools[k].used; return (
    <div key={k} className={'dv7-cell' + (u ? ' is-used' : '')}><span className="dv7-fig"><span className={'dv4-g' + (u ? ' is-used' : '')}><SvIcon k={k} size={22} /></span></span>
      <span className="dv7-lb">{TOOLS[k]}</span><span className="sv-st">{u ? 'Used' : 'Not used'}</span></div>); })}</div>),
  icons: ({ p }) => (<div className="sv-kit sv-k-icons">{ALL.map((k) => { const u = p.tools[k].used; return (
    <div key={k} className={'sv-ki' + (u ? ' is-used' : '')}><span className="sv-ki-fig"><SvIcon k={k} size={u ? 36 : 60} /></span><b>{TOOLS[k]}</b><small>{u ? 'Used' : 'Not used'}</small></div>); })}</div>),
  rows: ({ p }) => (<ul className="sv-kit sv-k-rows">{ALL.map((k) => { const u = p.tools[k].used; return (
    <li key={k} className={u ? 'is-used' : ''}><span className={'sv-kr-i dv4-g' + (u ? ' is-used' : '')}><SvIcon k={k} size={20} /></span><b>{TOOLS[k]}</b><small>{u ? 'Used' : 'Not used'}</small></li>); })}</ul>),
};

const SalvageBody = ({ s }) => {
  const kit = usePgSetting('kit') || 'cards'; const st = usePgSetting('play') || 'won'; const reachMode = usePgSetting('reach') || 'sq';
  const p = PLAYS[st]; const Kit = KIT[kit];
  return <>
    <GsSessCard r={RESULT[st]} className={'sv-card sv-kit-' + kit}
      board={<><SvSea p={p} mode={reachMode} /><SvKey /></>}
      rows={[['Found', <SvCounts p={p} />], ['Tools', <Kit p={p} />]]} />
    <GsMoves s={s} />
  </>;
};

export const initPlaygroundSalvageSession = () => {
  pgRegister('salvage-session', { title: 'Salvage session', settings: [
    { key: 'kit', kind: 'concept', label: 'Kit', options: [{ value: 'cards', label: '1 Light cards' }, { value: 'cells', label: '2 Delve cells' }, { value: 'icons', label: '3 Icon size' }, { value: 'rows', label: '4 Rows' }] },
    { key: 'play', label: 'State', options: ['won', 'lost', 'live'].map((v) => ({ value: v, label: { won: 'Won', lost: 'Lost', live: 'In progress' }[v], state: 'session-puzzle', go: (gs) => gs.go('session', { id: PGS[v] }) })) },
    { key: 'reach', label: 'Reach', options: [{ value: 'sq', label: 'Squares' }, { value: 'key', label: 'Reach key' }] },
  ] });
  if (pgActive()) GS_SESSION_BODY.salvage = SalvageBody;
};
