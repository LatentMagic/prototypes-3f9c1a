// ============================================================================
// PLAYGROUND, not canon (branch candidate/salvage-session-hifi): Salvage's session page body at hi fi, from the ratified low fi
// (lm-1236 salvage-ratify): Result top; Sea left; Counts above Kit, centred against the Sea; phone order Result, Sea, Counts, Kit.
// Round 3 settings (app/playground.jsx): Concept (A, B or C, each a fixed combination of the variants), then config: Kit icons, State.
// Open with ?pg=salvage-session. The plays are fixtures on edition No. 21's sea, played by the game's rules below
// (counts, reach and every move are worked out from the moves, never typed); the head still reads canon's own Salvage session.
// To remove it: delete this file and playground-salvage-session.css, and their lines in main.jsx and canon.css.
// ============================================================================
import React from 'react';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_SESSION_BODY } from './registry.js';
import { GS_SESSIONS } from './gs-data.jsx';

// ---- Edition No. 21: five wrecks (4, 3, 3, 2, 2) and the four rows and four columns whose counts it shows. ----
const COLS = 'ABCDEFGH';
const N8 = [1, 2, 3, 4, 5, 6, 7, 8];
const WRECKS = [['A5', 'B5', 'C5', 'D5'], ['E3', 'F3', 'G3'], ['F6', 'G6', 'H6'], ['G8', 'H8'], ['C1', 'C2']];
const SHOWN = { row: [3, 5, 6, 7], col: ['C', 'E', 'F', 'H'] };
const DIVES = 20;
const TOOLS = { sonar: 'Sonar', detector: 'Metal detector', net: 'Dragnet' };
const ALL = Object.keys(TOOLS);

const colOf = (sq) => COLS.indexOf(sq[0]); const rowOf = (sq) => +sq.slice(1) - 1;
const at = (c, r) => COLS[c] + (r + 1);
const wreckOf = (sq) => WRECKS.findIndex((w) => w.includes(sq));
// A line is { axis: 'row' | 'col', name: 3 | 'G' }; its squares in order from the given end.
const lineSquares = ({ axis, name }, from) => {
  const sq = N8.map((_, i) => (axis === 'row' ? at(i, +name - 1) : at(COLS.indexOf(name), i)));
  return from === 'right' || from === 'bottom' ? sq.reverse() : sq;
};
const lineCount = (line) => lineSquares(line).filter((s) => wreckOf(s) > -1).length;
const lineWords = ({ axis, name }) => (axis === 'row' ? 'Row ' : 'Column ') + name;
const isShown = ({ axis, name }) => SHOWN[axis].includes(name);
const countWords = (n) => (n === 0 ? 'no wreck squares.' : n + (n === 1 ? ' wreck square' : ' wreck squares') + ', found or not.');
const patch = (sq) => { const c = colOf(sq), r = rowOf(sq); const out = [];
  for (let y = Math.max(0, r - 1); y <= Math.min(7, r + 1); y++) for (let x = Math.max(0, c - 1); x <= Math.min(7, c + 1); x++) out.push(at(x, y)); return out; };

// ---- A play, run by the game's rules (Salvage spec; deployed salvage-game.ts, player-view.ts, session-record.ts). A dive on a
// square already found is skipped free. Sonar counts every wreck square on one line whose count is not shown; the metal detector
// every wreck square in the 3x3 patch round a square, cut at the edge; the dragnet snags on the first wreck square from its end,
// and a square not yet found becomes a hit. Won when all five are raised; lost when the 20th dive is spent first.
// The Every move lines are the deployed record's words. ----
const runPlay = (moves) => {
  const hit = new Set(); const raised = new Set(); const lines = []; const tools = {}; const miss = []; const marks = []; let dives = 0;
  const strike = (sq) => { hit.add(sq); const w = wreckOf(sq); if (WRECKS[w].every((s) => hit.has(s)) && !raised.has(w)) { raised.add(w); return WRECKS[w].length; } return 0; };
  moves.forEach((m) => {
    if (m.dive) {
      if (hit.has(m.dive)) return;
      dives += 1; const w = wreckOf(m.dive);
      let res = 'miss';
      if (w < 0) miss.push(m.dive); else { const sunk = strike(m.dive); res = sunk ? 'raised: the wreck of ' + sunk : 'hit'; }
      marks.push(res === 'miss' ? '○' : res === 'hit' ? '✕' : '■');
      lines.push(['Dive ' + dives, m.dive, res]);
    } else if (m.sonar) {
      if (isShown(m.sonar)) console.error('Salvage playground: sonar on a shown line', m.sonar);
      const count = lineCount(m.sonar); tools.sonar = { line: m.sonar, count, squares: lineSquares(m.sonar) };
      marks.push('📡');
      lines.push(['Hint', lineWords(m.sonar) + ': ' + countWords(count)]);
    } else if (m.detector) {
      const sq = patch(m.detector); const count = sq.filter((s) => wreckOf(s) > -1).length; tools.detector = { at: m.detector, count, squares: sq };
      marks.push('🧲');
      lines.push(['Metal detector', m.detector + ' and around it: ' + countWords(count)]);
    } else if (m.net) {
      const run = lineSquares(m.net, m.net.from); const i = run.findIndex((s) => wreckOf(s) > -1);
      const snag = i < 0 ? null : run[i]; const head = lineWords(m.net) + ' from the ' + m.net.from;
      let say = head + ': no wreck squares.';
      if (snag && hit.has(snag)) say = head + ': the dragnet snags at ' + snag + ', already found.';
      else if (snag) { const sunk = strike(snag); say = head + ': the dragnet snags at ' + snag + (sunk ? ' and raises the wreck of ' + sunk + '.' : ', a hit.'); }
      tools.net = { line: m.net, snag, squares: snag ? run.slice(0, i + 1) : run };
      marks.push('🕸️');
      lines.push(['Dragnet', say]);
    }
  });
  const state = raised.size === 5 ? 'won' : dives >= DIVES ? 'lost' : 'live';
  if (state === 'lost') WRECKS.forEach((w) => lines.push(['Wreck', 'The wreck of ' + w.length + ': ' + w[0] + ' to ' + w[w.length - 1]]));
  return { state, dives, hit, raised, miss, tools, lines, marks };
};
// The share text as the deployed Salvage builds it (salvage player-view.ts toShareGrid, shareHeadline in the shared engine's
// share-card.ts): "Salvage No. 21 · <wrecks> · <n> of 20 dives", a blank line, then one mark per move, ten to a line: ■ a wreck
// raised, ✕ a hit, ○ a miss, 📡 sonar, 🧲 metal detector, 🕸️ dragnet. Only a finished play has one.
const shareLinesOf = (p) => { const wrecks = p.raised.size === 5 ? 'all 5 wrecks' : p.raised.size + ' of 5 wrecks';
  const rows = []; for (let i = 0; i < p.marks.length; i += 10) rows.push(p.marks.slice(i, i + 10).join(' '));
  return ['Salvage No. 21 · ' + wrecks + ' · ' + p.dives + ' of ' + DIVES + ' dives', '', ...rows]; };
const dive = (s) => s.split(' ').map((d) => ({ dive: d }));
const PLAYS = {
  // Won in 16 of 20 dives, all three tools used.
  won: runPlay([{ sonar: { axis: 'col', name: 'G' } }, ...dive('A5 B5 C5 D5'), { detector: 'F4' }, ...dive('D3 E3 F3 G3'),
    { net: { axis: 'row', name: 6, from: 'left' } }, ...dive('G6 H6 G7 G8 H8 C3 C2 C1')]),
  // Lost: all 20 dives spent with two wrecks not raised; the dragnet not used.
  lost: runPlay([...dive('A1 B1 C1 C2 D3 E3 F3 G3 A5 B5 C5 D5'), { sonar: { axis: 'row', name: 8 } }, { detector: 'G5' }, ...dive('H4 F5 G6 G7 E8 F8 A8 B8')]),
  // In progress: 9 dives, sonar and detector used, a hit on the wreck in column C.
  live: runPlay([{ sonar: { axis: 'col', name: 'A' } }, ...dive('A5 B5 C5 D5'), { detector: 'E4' }, ...dive('D3 E3 F3 G3 C1')]),
};
// Completed and Failed are placeholder words, not ruled; In progress is the deployed headline.
const RESULT = { won: { tone: 'ok', word: 'Completed', ph: true }, lost: { tone: 'bad', word: 'Failed', ph: true }, live: { tone: 'live', word: 'In progress' } };
const PGS = { won: 'salvage-today', lost: 'salvage-today-failed', live: 'salvage-live' };
const toolResult = (k, t) => (k === 'sonar' ? lineWords(t.line) + ': ' + t.count : k === 'detector' ? t.at + ': ' + t.count : t.snag ? lineWords(t.line) + ': ' + t.snag : lineWords(t.line) + ': clear');
const toolTag = (k, t) => (k === 'net' ? (t.snag || '0') : String(t.count));

// ---- Kit icons, three directions. Each tool keeps its icon and name whole when used; only the icon's state and the status line change. ----
const ST = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'square', strokeLinejoin: 'miter' };
// A Line: drawn as Delve's own icons (24px, 1.75 stroke, square caps): the ship's sonar pinging down, the detector and its coil, the
// net on its float line. Used: the box drops to the card's line, the icon to muted; no strike.
const IC_LINE = {
  sonar: 'M2.5 7.5h19l-3 4h-13zM8 7.5V4.5h5v3M12 11.5v1.5M8.5 15.5a3.5 3.5 0 0 0 7 0M5 17a7 7 0 0 0 14 0',
  detector: 'M18.5 3 10 16M15.5 3.5l5 1.5M3 18.5a6 2.5 0 1 0 12 0a6 2.5 0 1 0-12 0M19 13.5l2-1M19.5 17h2',
  net: 'M2 5h20M4.5 5 9 20h6l4.5-15M7.6 5l6.4 15M16.4 5 10 20M6 10.5h12',
};
// B Solid: the same three things as filled shapes. Used: the shape is hollowed to its outline, the same size and shape.
const IC_SOLID = {
  sonar: 'M2 5.5h20l-3 4H5zM8 5.5V2.5h5.5v3zM7 12a5 5 0 0 0 10 0h-2.2a2.8 2.8 0 0 1-5.6 0zM3 12a9 9 0 0 0 18 0h-2.2a6.8 6.8 0 0 1-13.6 0z',
  detector: 'M2 18.5a7 3 0 1 0 14 0a7 3 0 1 0-14 0zM16.6 2.3l2.6 1.5-7 12.2-2.6-1.5z',
  net: 'M1.5 2.5h21v2.2h-21zM3.5 6.5h17L16 21.5H8zM9.4 8.5l1.6 2-1.6 2-1.6-2zM14.6 8.5l1.6 2-1.6 2-1.6-2zM12 13l1.6 2-1.6 2-1.6-2z',
};
// C Reach: each tool drawn as the shape it reaches on the sea (a line; a 3x3 patch round a square; a run that stops on a snag), in
// the tool's reach colour once used, so the kit reads straight against the sea. Not used: the same shape in muted outline.
const RC = (x, y) => 'M' + x + ' ' + y + 'h4.4v4.4H' + x + 'z';
const IC_REACH = {
  sonar: { box: [RC(1, 9.8), RC(6.8, 9.8), RC(12.8, 9.8), RC(18.6, 9.8)], key: [] },
  detector: { box: [RC(3, 3), RC(9.8, 3), RC(16.6, 3), RC(3, 9.8), RC(16.6, 9.8), RC(3, 16.6), RC(9.8, 16.6), RC(16.6, 16.6)], key: [RC(9.8, 9.8)] },
  net: { box: [RC(9.8, 1), RC(9.8, 6.8)], key: [RC(9.8, 12.6)], line: 'M12 19v3.5' },
};
const KitIcon = ({ dir, k, used }) => {
  if (dir === 'solid') return <svg className="sv-ic" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d={IC_SOLID[k]} fillRule="evenodd" {...(used ? { ...ST, strokeWidth: 1.5 } : { fill: 'currentColor' })} /></svg>;
  if (dir === 'reach') { const I = IC_REACH[k];
    return <svg className={'sv-ic t-' + k} viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      {I.box.map((d) => <path key={d} d={d} {...ST} strokeWidth="1.5" className="sv-rb" />)}
      {I.key.map((d) => <path key={d} d={d} className="sv-rk" />)}{I.line && <path d={I.line} {...ST} strokeWidth="1.5" className="sv-rb" />}</svg>; }
  return <span className={'sv-kbox' + (used ? ' is-used' : '')}><svg className="sv-ic" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d={IC_LINE[k]} {...ST} /></svg></span>;
};
// The Kit: one light card per tool, icon over name over status. The name is the label face in the text colour, always; the status
// is the small capitals line under it, with a tick when used, so name and status never read as one line.
const SvKit = ({ p, dir }) => (<div className={'sv-kit is-' + dir}>{ALL.map((k) => { const u = !!p.tools[k]; return (
  <div key={k} className={'sv-kc' + (u ? ' is-used' : '')}>
    <span className="sv-kc-fig"><KitIcon dir={dir} k={k} used={u} /></span>
    <b>{TOOLS[k]}</b>
    <small>{u && <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M2 6.5 5 9.5 10.5 3" {...ST} strokeWidth="1.75" /></svg>}{u ? 'Used' : 'Not used'}</small>
  </div>); })}</div>);

// ---- The Sea. One grid: a label column, eight squares, a count column; a row of column counts, a row of letters, eight rows. ----
const gc = (i) => i + 2; const gr = (i) => i + 3;
const MISS = {
  ring: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" /></svg>,
  dash: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10" /></svg>,
  fill: null,
};
const HIT = { share: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></svg> };
const Clue = ({ v, swept, style }) => (<span className={'sv-mc' + (v === undefined ? ' is-blank' : '') + (swept ? ' is-swept' : '')} style={style}>{v === undefined ? '' : v}</span>);
const SvSea = ({ p, mode, hitK, missK }) => {
  const used = ALL.filter((k) => p.tools[k]);
  const sw = p.tools.sonar ? p.tools.sonar.line : null;
  const clue = (axis, name) => (isShown({ axis, name }) || (sw && sw.axis === axis && sw.name === name) ? lineCount({ axis, name }) : undefined);
  const isSw = (axis, name) => !!sw && sw.axis === axis && sw.name === name;
  const hits = [...p.hit].filter((s) => !p.raised.has(wreckOf(s)));
  const cov = {};
  used.forEach((k) => p.tools[k].squares.forEach((s) => (cov[s] = cov[s] || []).push(k)));
  const corners = {};
  return (
    <div className={'sv-sea m-' + missK + ' h-' + hitK} role="img" aria-label={'The sea: ' + p.raised.size + ' of 5 wrecks raised, ' + p.dives + ' of ' + DIVES + ' dives'}>
      {COLS.split('').map((c, i) => <React.Fragment key={c}>
        <Clue v={clue('col', c)} swept={isSw('col', c)} style={{ gridColumn: gc(i), gridRow: 1 }} />
        <span className="sv-ml" style={{ gridColumn: gc(i), gridRow: 2 }}>{c}</span></React.Fragment>)}
      {N8.map((r) => <React.Fragment key={r}>
        <span className="sv-ml" style={{ gridColumn: 1, gridRow: gr(r - 1) }}>{r}</span>
        <Clue v={clue('row', r)} swept={isSw('row', r)} style={{ gridColumn: 10, gridRow: gr(r - 1) }} /></React.Fragment>)}
      {COLS.split('').flatMap((c, i) => N8.map((r) => <span key={c + r} className="sv-sq" style={{ gridColumn: gc(i), gridRow: gr(r - 1) }} />))}
      {p.miss.map((s) => <span key={s} className="sv-sq is-miss" style={{ gridColumn: gc(colOf(s)), gridRow: gr(rowOf(s)) }}>{MISS[missK]}</span>)}
      {hits.map((s) => <span key={s} className="sv-sq is-hit" style={{ gridColumn: gc(colOf(s)), gridRow: gr(rowOf(s)) }}>{HIT[hitK] || null}</span>)}
      {WRECKS.map((w, i) => { const up = p.raised.has(i); if (!up && p.state !== 'lost') return null; const horiz = rowOf(w[0]) === rowOf(w[w.length - 1]);
        return <span key={w[0]} className={'sv-hull ' + (up ? 'is-raised' : 'is-unfound') + (horiz ? '' : ' is-down')}
          style={{ gridColumn: gc(colOf(w[0])) + ' / span ' + (horiz ? w.length : 1), gridRow: gr(rowOf(w[0])) + ' / span ' + (horiz ? 1 : w.length) }} />; })}
      {mode !== 'key' && Object.keys(cov).flatMap((s) => cov[s].map((k, i) => <i key={s + k} className={(mode === 'rings' ? 'sv-rg' : 'sv-ro') + ' t-' + k} style={{ gridColumn: gc(colOf(s)), gridRow: gr(rowOf(s)), '--i': i }} />))}
      {mode === 'key' && used.map((k) => { const sq = p.tools[k].squares; const cs = sq.map(colOf), rs = sq.map(rowOf);
        const c0 = Math.min(...cs), c1 = Math.max(...cs), r0 = Math.min(...rs), r1 = Math.max(...rs);
        const corner = c0 + ',' + r0; const n = corners[corner] = (corners[corner] || 0) + 1;
        return <i key={k} className={'sv-box t-' + k} style={{ gridColumn: gc(c0) + ' / ' + (gc(c1) + 1), gridRow: gr(r0) + ' / ' + (gr(r1) + 1), '--n': n - 1 }}>
          <b className="sv-tag">{toolTag(k, p.tools[k])}</b></i>; })}
    </div>);
};
// The key under the sea: each used tool's swatch, drawn as the reach is drawn, its name and what it found. A tool not used has no
// reach, so it is not listed.
const SvKey = ({ p, mode }) => (<div className={'sv-key r-' + mode}>{ALL.filter((k) => p.tools[k]).map((k) =>
  <span key={k}><i className={'t-' + k} /><b>{TOOLS[k]}</b> {toolResult(k, p.tools[k])}</span>)}</div>);

// ---- Counts: dives of the 20 and wrecks of the 5, the same figure twice. ----
const Fig = ({ n, of, cap }) => (<div className="sv-fig" role="img" aria-label={n + ' of ' + of + ' ' + cap}>
  <span aria-hidden="true"><b>{n}</b><small>/{of}</small></span><span className="sv-fig-cap" aria-hidden="true">{cap}</span></div>);
const SvCounts = ({ p }) => (<div className="sv-counts"><Fig n={p.dives} of={DIVES} cap="dives" /><Fig n={p.raised.size} of={5} cap="wrecks" /></div>);

const WORD = { haul: 'Haul', tally: 'Tally', score: 'Score' };
// The three concepts, each a fixed combination of the variants: reach (sq, key, rings), wreck mark (hull, share, hatch), miss mark
// (ring, dash, fill), margins (chip, box, size) and the counts word.
const CONCEPTS = {
  a: { reach: 'sq', hit: 'hull', miss: 'ring', margins: 'chip', word: 'haul' },
  b: { reach: 'key', hit: 'share', miss: 'dash', margins: 'box', word: 'tally' },
  c: { reach: 'rings', hit: 'hatch', miss: 'fill', margins: 'size', word: 'score' },
};
const SalvageBody = ({ s }) => {
  const g = (k, d) => usePgSetting(k) || d;
  const dir = g('kit', 'line'); const st = g('play', 'won');
  const { reach: reachMode, hit: hitK, miss: missK, margins: axes, word } = CONCEPTS[g('concept', 'a')];
  const p = PLAYS[st]; const R = RESULT[st];
  const r = { tone: R.tone, word: R.ph ? <>{R.word}<span className="sv-ph" title="A placeholder word, not yet chosen">Placeholder</span></> : R.word };
  return <>
    <GsSessCard r={r} className={'sv-card ax-' + axes}
      board={<><SvSea p={p} mode={reachMode} hitK={hitK} missK={missK} /><SvKey p={p} mode={reachMode} /></>}
      rows={[[WORD[word], <SvCounts p={p} />], ['Kit', <SvKit p={p} dir={dir} />]]} />
    <GsMoves s={{ ...s, lines: p.lines }} />
  </>;
};

const opts = (o) => Object.keys(o).map((value) => ({ value, label: o[value] }));
export const initPlaygroundSalvageSession = () => {
  pgRegister('salvage-session', { title: 'Salvage session', settings: [
    { key: 'concept', kind: 'concept', label: 'Concept', options: [
      { value: 'a', label: 'A Squares · Hull · Ring · Chips · Haul' },
      { value: 'b', label: 'B Reach key · Share marks · Dash · Boxes · Tally' },
      { value: 'c', label: 'C Rings · Hatch · Fill · Size · Score' }] },
    { key: 'kit', label: 'Kit icons', options: opts({ line: 'Line', solid: 'Solid', reach: 'Reach shape' }) },
    { key: 'play', label: 'State', options: ['won', 'lost', 'live'].map((v) => ({ value: v, label: { won: 'Won', lost: 'Lost', live: 'In progress' }[v], state: 'session-puzzle', go: (gs) => gs.go('session', { id: PGS[v] }) })) },
  ] });
  if (pgActive()) {
    GS_SESSION_BODY.salvage = SalvageBody;
    // KEEP: the Share pop-up shows the open play's own share text. Canon's session page reads one seed session for every Salvage play
    // of today's edition, so its share lines follow the State setting (the play in the URL) instead of being fixed. The deployed page
    // offers no share until a play ends; the in-progress text here is the same builder run on the moves so far.
    const open = () => PLAYS[new URLSearchParams(window.location.search).get('play')] || PLAYS.won;
    Object.values(PGS).forEach((id) => Object.defineProperty(GS_SESSIONS[id], 'shareLines', { configurable: true, get: () => shareLinesOf(open()) }));
  }
};
