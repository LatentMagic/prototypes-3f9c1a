// ============================================================================
// After Pixels — Salvage's session page body, under the shared head: one card on the shared session card (GsSessCard,
// gs-session.jsx), as Guess's, Where's and Chain's are. Result top left (Completed, Failed or In progress); the Sea (an 8 by 8
// grid) left; Haul (dives and wrecks) above Kit (three tools) in the panel beside it, ruled off at its left; on a phone, stacked.
// The plays on the invented edition 21 are held here once, run by the game's rules below, so every count, mark and reach is worked
// out from the moves: won (salvage-today), hard (salvage-today-hard), lost (salvage-today-failed), in progress (salvage-live).
// gs-where-chain-salvage.jsx builds those four sessions, the now card, the history and the chat from them. An earlier edition's
// session carries no play and keeps the plain result and list. Styles: app/gs-salvage.css.
// ============================================================================
import React from 'react';
import { GsMoves, GsSessCard, GsSessResult } from './gs-session.jsx';
import { GS_SESSION_BODY } from './registry.js';

// ---- An invented sea, numbered edition 21 (not the deployed edition 21): five wrecks (4, 3, 3, 2, 2) and the four rows and four columns
// whose counts the sea shows. ----
const SLV_COLS = 'ABCDEFGH';
const SLV_N8 = [1, 2, 3, 4, 5, 6, 7, 8];
export const SLV_WRECKS = [['A5', 'B5', 'C5', 'D5'], ['E3', 'F3', 'G3'], ['F6', 'G6', 'H6'], ['G8', 'H8'], ['C1', 'C2']];
const SLV_SHOWN = { row: [3, 5, 6, 7], col: ['C', 'E', 'F', 'H'] };
// KEEP: the dive total, which tools appear, the sonar ration and the margin counts come from the play's rules version (deployed
// salvage-game.ts limitsFor) and its edition's shown lines, never from constants: 20 dives with the kit is v2 and v3's, v1 gave 35 and
// no kit, and an edition with no shown lines has no margin counts.
export const SLV_DIVES = 20;
const SLV_TOOLS = { sonar: 'Sonar', detector: 'Metal detector', net: 'Dragnet' };
export const SLV_ALL = Object.keys(SLV_TOOLS);

const slvColOf = (sq) => SLV_COLS.indexOf(sq[0]); const slvRowOf = (sq) => +sq.slice(1) - 1;
const slvAt = (c, r) => SLV_COLS[c] + (r + 1);
export const slvWreckOf = (sq) => SLV_WRECKS.findIndex((w) => w.includes(sq));
// A line is { axis: 'row' | 'col', name: 3 | 'G' }; its squares in order from the given end.
const slvLineSquares = ({ axis, name }, from) => {
  const sq = SLV_N8.map((_, i) => (axis === 'row' ? slvAt(i, +name - 1) : slvAt(SLV_COLS.indexOf(name), i)));
  return from === 'right' || from === 'bottom' ? sq.reverse() : sq;
};
const slvLineCount = (line) => slvLineSquares(line).filter((s) => slvWreckOf(s) > -1).length;
const slvLineWords = ({ axis, name }) => (axis === 'row' ? 'Row ' : 'Column ') + name;
const slvIsShown = ({ axis, name }) => SLV_SHOWN[axis].includes(name);
const slvCountWords = (n) => (n === 0 ? 'no wreck squares.' : n + (n === 1 ? ' wreck square' : ' wreck squares') + ', found or not.');
const slvPatch = (sq) => { const c = slvColOf(sq), r = slvRowOf(sq); const out = [];
  for (let y = Math.max(0, r - 1); y <= Math.min(7, r + 1); y++) for (let x = Math.max(0, c - 1); x <= Math.min(7, c + 1); x++) out.push(slvAt(x, y)); return out; };

// ---- A play, run by the game's rules (Salvage spec; deployed salvage-game.ts, player-view.ts, session-record.ts). A dive on a square
// already dived is skipped free: deployed planRun skips every dived square, misses and dragnet snags included, and refuses a dive whose
// squares are all dived (the fixtures never repeat a square, so only a hit is skipped here). Sonar counts every wreck square on one line whose count is not shown; the metal detector every wreck
// square in the 3x3 slvPatch round a square, cut at the edge; the dragnet snags on the first wreck square from its end, and a square not
// yet found becomes a hit. Won when all five are raised; lost when the 20th dive is spent first. The Every move lines are the deployed
// record's words. ----
export const slvRunPlay = (moves) => {
  const hit = new Set(); const raised = new Set(); const lines = []; const tools = {}; const miss = []; const marks = []; let dives = 0;
  const strike = (sq) => { hit.add(sq); const w = slvWreckOf(sq); if (SLV_WRECKS[w].every((s) => hit.has(s)) && !raised.has(w)) { raised.add(w); return SLV_WRECKS[w].length; } return 0; };
  moves.forEach((m) => {
    if (m.dive) {
      if (hit.has(m.dive)) return;
      dives += 1; const w = slvWreckOf(m.dive);
      let res = 'miss';
      if (w < 0) miss.push(m.dive); else { const sunk = strike(m.dive); res = sunk ? 'raised: the wreck of ' + sunk : 'hit'; }
      marks.push(res === 'miss' ? '○' : res === 'hit' ? '✕' : '■');
      lines.push(['Dive ' + dives, m.dive, res]);
    } else if (m.sonar) {
      const count = slvLineCount(m.sonar); tools.sonar = { line: m.sonar, squares: slvLineSquares(m.sonar) };
      marks.push('📡');
      lines.push(['Hint', slvLineWords(m.sonar) + ': ' + slvCountWords(count)]);
    } else if (m.detector) {
      const sq = slvPatch(m.detector); const count = sq.filter((s) => slvWreckOf(s) > -1).length; tools.detector = { squares: sq };
      marks.push('🧲');
      lines.push(['Metal detector', m.detector + ' and around it: ' + slvCountWords(count)]);
    } else if (m.net) {
      const run = slvLineSquares(m.net, m.net.from); const i = run.findIndex((s) => slvWreckOf(s) > -1);
      const snag = i < 0 ? null : run[i]; const head = slvLineWords(m.net) + ' from the ' + m.net.from;
      let say = head + ': no wreck squares.';
      if (snag && hit.has(snag)) say = head + ': the dragnet snags at ' + snag + ', already found.';
      else if (snag) { const sunk = strike(snag); say = head + ': the dragnet snags at ' + snag + (sunk ? ' and raises the wreck of ' + sunk + '.' : ', a hit.'); }
      tools.net = { squares: snag ? run.slice(0, i + 1) : run };
      marks.push('🕸️');
      lines.push(['Dragnet', say]);
    }
  });
  const state = raised.size === 5 ? 'won' : dives >= SLV_DIVES ? 'lost' : 'live';
  if (state === 'lost') SLV_WRECKS.forEach((w) => lines.push(['Wreck', 'The wreck of ' + w.length + ': ' + w[0] + ' to ' + w[w.length - 1]]));
  return { state, dives, hit, raised, miss, tools, lines, marks, sweep: tools.sonar ? tools.sonar.line : null };
};
const slvDive = (s) => s.split(' ').map((d) => ({ dive: d }));
// Won in 16 of 20 dives, all three tools used. Hard: the same won play with four more misses before its last wreck, so the win comes on the 20th dive.
const SLV_WON_HEAD = [{ sonar: { axis: 'col', name: 'G' } }, ...slvDive('A5 B5 C5 D5'), { detector: 'F4' }, ...slvDive('D3 E3 F3 G3'),
  { net: { axis: 'row', name: 6, from: 'left' } }, ...slvDive('G6 H6 G7 G8 H8')];
export const SLV_MOVES = {
  begun: [],
  won: [...SLV_WON_HEAD, ...slvDive('C3 C2 C1')],
  hard: [...SLV_WON_HEAD, ...slvDive('A1 H1 H2 A8 C3 C2 C1')],
  // Lost: all 20 dives spent with two wrecks not raised; the dragnet not used.
  lost: [...slvDive('A1 B1 C1 C2 D3 E3 F3 G3 A5 B5 C5 D5'), { sonar: { axis: 'row', name: 8 } }, { detector: 'G5' }, ...slvDive('H4 F5 G6 G7 E8 F8 A8 B8')],
  // In progress: 9 dives, sonar and detector used, a hit on the wreck in column C.
  live: [{ sonar: { axis: 'col', name: 'A' } }, ...slvDive('A5 B5 C5 D5'), { detector: 'E4' }, ...slvDive('D3 E3 F3 G3 C1')],
};
export const SLV_PLAYS = Object.fromEntries(Object.entries(SLV_MOVES).map(([fx, moves]) => [fx, slvRunPlay(moves)]));
// A play as it stood after its nth dive (the tools used before it included).
export const slvPlayAt = (fx, n) => { let c = 0; const at = SLV_MOVES[fx].findIndex((m) => m.dive && ++c === n); return slvRunPlay(SLV_MOVES[fx].slice(0, at + 1)); };
// The share text as the deployed Salvage builds it: "Salvage No. 21 · <wrecks> · <n> of 20 dives", a blank line, then one mark per
// move, ten to a line: ■ a wreck raised, ✕ a hit, ○ a miss, 📡 sonar, 🧲 metal detector, 🕸️ dragnet. Only a finished play has one.
export const slvShareLinesOf = (p) => { const wrecks = p.raised.size === 5 ? 'all 5 wrecks' : p.raised.size + ' of 5 wrecks';
  const rows = []; for (let i = 0; i < p.marks.length; i += 10) rows.push(p.marks.slice(i, i + 10).join(' '));
  return ['Salvage No. 21 · ' + wrecks + ' · ' + p.dives + ' of ' + SLV_DIVES + ' dives', '', ...rows]; };
// Completed and Failed are working words for the result statement, not yet ruled. The result line and the share text use the deployed
// headline (session-record.ts headlineOf), which GS_RESULT.salvage (gs-where-chain-salvage.jsx) words.
export const SLV_RESULT = { won: { tone: 'ok', word: 'Completed' }, lost: { tone: 'bad', word: 'Failed' }, live: { tone: 'live', word: 'In progress' } };

// ---- The Sea: one grid of a label column, eight squares and a clue column, under a row of clues and a row of letters. ----
const slvGc = (i) => i + 2; const slvGr = (i) => i + 3;
const cell = (s) => ({ gridColumn: slvGc(slvColOf(s)), gridRow: slvGr(slvRowOf(s)) });
const SlvClue = ({ v, swept, style }) => (v === undefined ? null : <span className={'slv-chip' + (swept ? ' is-swept' : '')} style={style} aria-hidden="true">{v}</span>);
const SlvSea = ({ p }) => {
  const sw = p.sweep;
  const isSw = (axis, name) => !!sw && sw.axis === axis && sw.name === name;
  const clue = (axis, name) => (slvIsShown({ axis, name }) || isSw(axis, name) ? slvLineCount({ axis, name }) : undefined);
  const dots = [...p.hit];
  return (
    <div className="slv-sea" role="img" aria-label={'The sea: ' + p.raised.size + ' of 5 wrecks raised, ' + p.dives + ' of ' + SLV_DIVES + ' dives'}>
      {SLV_COLS.split('').map((c, i) => <React.Fragment key={c}>
        <SlvClue v={clue('col', c)} swept={isSw('col', c)} style={{ gridColumn: slvGc(i), gridRow: 1 }} />
        <span className="slv-ml" style={{ gridColumn: slvGc(i), gridRow: 2 }} aria-hidden="true">{c}</span></React.Fragment>)}
      {SLV_N8.map((r) => <React.Fragment key={r}>
        <span className="slv-ml" style={{ gridColumn: 1, gridRow: slvGr(r - 1) }} aria-hidden="true">{r}</span>
        <SlvClue v={clue('row', r)} swept={isSw('row', r)} style={{ gridColumn: 10, gridRow: slvGr(r - 1) }} /></React.Fragment>)}
      {SLV_COLS.split('').flatMap((c, i) => SLV_N8.map((r) => <span key={c + r} className="slv-sq" style={{ gridColumn: slvGc(i), gridRow: slvGr(r - 1) }} />))}
      {SLV_ALL.filter((k) => p.tools[k]).flatMap((k) => p.tools[k].squares.map((s) => <i key={k + s} className={'slv-cv t-' + k} style={cell(s)} />))}
      {p.miss.map((s) => <span key={s} className="slv-mk" style={cell(s)}><i className="slv-dot is-miss" /></span>)}
      {dots.map((s) => <span key={s} className="slv-mk is-hit" style={cell(s)}><i className={'slv-dot is-hit' + (p.state === 'lost' && !p.raised.has(slvWreckOf(s)) ? ' is-lost' : '')} /></span>)}
      {SLV_WRECKS.map((w, i) => { const up = p.raised.has(i); if (!up && p.state !== 'lost') return null; const across = slvRowOf(w[0]) === slvRowOf(w[w.length - 1]);
        // KEEP: an unfound wreck is a dashed pill, the raised pill's shape. Drawn as SVG because a dashed CSS border on a rounded box loses its sides on iPhone Safari.
        // The viewBox is the hull in ninths of a square (the hull is inset 1/9 each side), so the pill is never stretched.
        const L = 9 * w.length - 2, vw = across ? L : 7, vh = across ? 7 : L;
        return <span key={w[0]} className={'slv-hull ' + (up ? 'is-raised' : 'is-unfound')}
          style={{ gridColumn: slvGc(slvColOf(w[0])) + ' / span ' + (across ? w.length : 1), gridRow: slvGr(slvRowOf(w[0])) + ' / span ' + (across ? 1 : w.length) }}>
          {up ? null : <svg viewBox={'0 0 ' + vw + ' ' + vh} width="100%" height="100%" aria-hidden="true"><rect x=".3" y=".3" width={vw - .6} height={vh - .6} rx={3.2} fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="1.1 .9" /></svg>}
        </span>; })}
    </div>);
};

// ---- Haul: dives of the 20 and wrecks of the 5. ----
// A count as a figure: the number large, then "/of" and an optional word, small.
export const Big = ({ n, of, cap }) => (<div className="slv-big" role="img" aria-label={n + ' of ' + of + (cap ? ' ' + cap : '')}><b aria-hidden="true">{n}</b><small aria-hidden="true">/{of}{cap ? ' ' + cap : ''}</small></div>);
const SlvHaul = ({ p }) => (<div className="slv-haul"><Big n={p.dives} of={SLV_DIVES} cap="dives" /><Big n={p.raised.size} of={5} cap="wrecks" /></div>);

// ---- Kit: the three tools, each an icon in its colour. A used tool is faded and struck corner to corner, bottom left to top right. ----
export const SLV_ST = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'square', strokeLinejoin: 'miter' };
export const ICON = {
  sonar: <><circle cx="5" cy="12" r="1.6" fill="currentColor" /><path d="M9 8.5a5 5 0 0 1 0 7M12.5 5.5a9.5 9.5 0 0 1 0 13M16 3a13 13 0 0 1 0 18" /></>,
  detector: <><path d="M5 3l7 12" /><ellipse cx="15" cy="18" rx="6" ry="3" /></>,
  net: <path d="M3 4h18l-3 16H6z M8 4l1.5 16 M16 4l-1.5 16 M4 10h16 M5 15h14" />,
};
const SlvKit = ({ p }) => (<ul className="slv-kit">{SLV_ALL.map((k) => { const u = !!p.tools[k]; return (
  <li key={k} className={'slv-tool t-' + k + (u ? ' is-used' : '')}>
    <span className="slv-bx"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...SLV_ST}>{ICON[k]}</svg></span>
    <span className="slv-nm">{SLV_TOOLS[k]}<span className="slv-sr">{u ? ', used' : ', not used'}</span></span>
  </li>); })}</ul>);

const SlvSessBody = ({ s }) => {
  const p = SLV_PLAYS[s.fx];
  // KEEP: an earlier edition's session page is not designed yet: it draws the same page as today's edition, from its own play, not this fallback.
  if (!p) return <><GsSessResult s={s} />{s.lines.length > 0 && <GsMoves s={s} />}</>;
  return <>
    <GsSessCard r={SLV_RESULT[p.state]} className="slv-card" board={<SlvSea p={p} />} rows={[['Haul', <SlvHaul p={p} />], ['Kit', <SlvKit p={p} />]]} />
    <GsMoves s={s} />
  </>;
};

export const initGsSalvage = () => { GS_SESSION_BODY.salvage = SlvSessBody; };
