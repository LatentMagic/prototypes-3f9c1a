// ============================================================================
// After Pixels — Chain's session page body (1236), under the shared head: one card on the shared session card (GsSessCard,
// gs-session.jsx, as Guess's): the result word top left, the chain as the board, and beside it (under it on a phone) the guesses as a chain of
// links in the order they were made. Every guess follows, closed. Joe's pick from the low-fi round (concept 1, Linked rows).
// Reads the play each Chain session carries (`play`, from gs-where-chain-salvage.jsx: CH_TODAY, CH_OK, CH_FAIL) and replays it
// the engine's way (game spec chain.md § 2): each word starts with one letter shown; a wrong guess shows one more; a word whose
// shown letters would reach its length is given away. A near miss is a wrong guess that still makes a real link.
// Styles: app/gs-chain.css.
// ============================================================================
import React from 'react';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { GS_SESSION_BODY } from './registry.js';

// ---- The model: per word its state (end, found, given, hidden) and letters shown; per guess its result, in order. ----
const chnRead = (s) => {
  const P = s.play; const last = P.w.length - 1;
  const w = P.w.map((word, i) => { const end = i === 0 || i === last; return { i, word, state: end ? 'end' : 'hidden', shown: end ? word.length : 1 }; });
  const g = P.p.map(([guess, k, near], j) => {
    const x = w[k]; let res;
    if (guess === x.word) { res = 'right'; x.state = 'found'; }
    else { x.shown += 1; res = x.shown >= x.word.length ? 'given' : near ? 'near' : 'wrong'; if (res === 'given') { x.state = 'given'; x.shown = x.word.length; } }
    return { n: j + 1, res };
  });
  const r = s.live ? { tone: 'live', word: 'In progress' } : w.some((x) => x.state === 'given') ? { tone: 'bad', word: 'Failed' } : { tone: 'ok', word: 'Solved' };
  return { w, g, r, long: Math.max(...w.map((x) => (x.state === 'hidden' ? x.shown + 1 : x.word.length))) };
};

// ---- The board: a row of tiles per word, top to bottom, joined by a pair of links. An end is filled light; the letters shown (the
// first, then one per wrong guess) filled grey; the rest of a found word outlined green; a given-away word outlined amber; a word
// still hidden shows its letters, then one dashed tile for the letters still to come (lengths stay hidden). ----
const ChnTiles = ({ x }) => (x.state === 'hidden'
  ? <div className="chn-row" role="img" aria-label={'Starts ' + x.word.slice(0, x.shown)}>
    {x.word.slice(0, x.shown).split('').map((ch, j) => <span key={j} className="wd-t chn-t is-shown" aria-hidden="true">{ch}</span>)}
    <span className="wd-t chn-t is-more" aria-hidden="true" /></div>
  : <div className="chn-row" role="img" aria-label={x.word + (x.state === 'given' ? ', given away' : '')}>
    {x.word.split('').map((ch, j) => <span key={j} aria-hidden="true"
      className={'wd-t chn-t is-' + (x.state === 'end' ? 'end' : x.state === 'given' ? 'given' : j < x.shown ? 'shown' : 'found')}>{ch}</span>)}</div>);
const ChnJoint = () => (
  <div className="chn-joint" aria-hidden="true"><svg width="16" height="22" viewBox="0 0 16 22"><rect x="1.5" y="1.5" width="8" height="12" rx="4" /><rect x="6.5" y="8.5" width="8" height="12" rx="4" /></svg></div>);

// ---- The guesses: a chain of links, first guess first (top to bottom from a 672px card, left to right on a phone), each numbered.
// Right: a closed green link. Wrong: a grey link open on its side. Near miss: an off-white link, almost closed. Given away: an amber
// link broken in two. A key under it names each kind present, with its count. ----
// The links stand apart, joined by a short bar, so each one's state and number read on their own (Joe: the overlapping chain
// was not clear).
const CHN_W = 16; const CHN_H = 30; const CHN_STEP = CHN_H + 8;
const CHN_P = 2 * (CHN_H - CHN_W) + Math.PI * CHN_W;
const CHN_GAP = { wrong: 14, near: 6, given: 8 };
// The stroke starts at the top of the loop and runs clockwise; the offset puts the cut on the loop's side (upright) or its top
// (across), clear of the links it overlaps.
const chnDash = (res) => (res === 'right' ? undefined : res === 'given' ? (CHN_P / 2 - CHN_GAP.given) + ' ' + CHN_GAP.given : (CHN_P - CHN_GAP[res]) + ' ' + CHN_GAP[res]);
const chnOffset = (res, across) => (res === 'right' ? undefined : CHN_P - CHN_GAP[res] / 2 - (across ? (CHN_H - CHN_W) / 2 : Math.PI * CHN_W / 4 + (CHN_H - CHN_W) / 2));
const ChnLoop = ({ res, x, y, across }) => (
  <rect x={x} y={y} width={across ? CHN_H : CHN_W} height={across ? CHN_W : CHN_H} rx={CHN_W / 2} className={'chn-loop is-' + res}
    strokeDasharray={chnDash(res)} strokeDashoffset={chnOffset(res, across)} />);
const chnLen = (k) => 8 + (k - 1) * CHN_STEP + CHN_H;
const ChnChain = ({ g, across }) => {
  const len = chnLen(g.length);
  return across
    ? <svg className="chn-chain is-across" width={len} height="46" viewBox={'0 0 ' + len + ' 46'} style={{ '--cw': len, '--ch': 46 }} aria-hidden="true">
      {g.slice(1).map((t, i) => <line key={'b' + i} className="chn-bar" x1={4 + i * CHN_STEP + CHN_H} y1={4 + CHN_W / 2} x2={4 + (i + 1) * CHN_STEP} y2={4 + CHN_W / 2} />)}
      {g.map((t, i) => <ChnLoop key={i} res={t.res} across x={4 + i * CHN_STEP} y={4} />)}
      {g.map((t, i) => <text key={'n' + i} x={4 + i * CHN_STEP + CHN_H / 2} y="42" textAnchor="middle">{t.n}</text>)}</svg>
    : <svg className="chn-chain is-down" width="56" height={len} viewBox={'0 0 56 ' + len} style={{ '--cw': 56, '--ch': len }} aria-hidden="true">
      {g.slice(1).map((t, i) => <line key={'b' + i} className="chn-bar" x1={32 + CHN_W / 2} y1={4 + i * CHN_STEP + CHN_H} x2={32 + CHN_W / 2} y2={4 + (i + 1) * CHN_STEP} />)}
      {g.map((t, i) => <ChnLoop key={i} res={t.res} x={32} y={4 + i * CHN_STEP} />)}
      {g.map((t, i) => <text key={'n' + i} x="20" y={4 + i * CHN_STEP + CHN_H / 2 + 4} textAnchor="end">{t.n}</text>)}</svg>;
};
const CHN_KINDS = [['right', 'Right'], ['wrong', 'Wrong'], ['near', 'Near miss'], ['given', 'Given away']];
// KEEP: a link is drawn at least 0.7px per drawing unit (21 by 11px, its number 8.4px); a chain that would be drawn smaller folds, across
// into balanced rows, or down beside the board into balanced columns, each link then CHN_FOLD_SCALE px per unit (0.7: 21 by 11px, its number
// 9px, between the shrunk size of a long chain and Chain's now card at 1px), the numbers running on from one row or column to the next. A chain
// that is drawn at 0.7px or more is not folded. A row or column that is not full (the last) is centred on the full ones, rows across, columns
// vertically. Measured: the rows by the room the panel gives them (never the guesses' own width, which shrinks as they fold), the columns by
// the board's height (the platform needs the same measuring).
const CHN_FLOOR = 0.7;
const CHN_FOLD_SCALE = 0.7;
const chnPer = (room) => Math.max(1, Math.floor((room / CHN_FOLD_SCALE - chnLen(1)) / CHN_STEP) + 1);
const chnFold = (g, per) => { const size = Math.ceil(g.length / Math.ceil(g.length / per)); const out = [];
  for (let i = 0; i < g.length; i += size) out.push(g.slice(i, i + size));
  return out; };
const ChnGuesses = ({ g }) => {
  const ref = React.useRef(null); const [fold, setFold] = React.useState({ a: 0, d: 0 });
  React.useLayoutEffect(() => {
    const me = ref.current; const card = me.closest('.chn-card'); const board = card && card.querySelector('.chn-board'); const panel = me.closest('.gs-sc-panel'); if (!board || !panel) return undefined;
    const need = chnLen(g.length) * CHN_FLOOR;
    const fit = () => { const ps = getComputedStyle(panel); const room = panel.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight); const bh = board.offsetHeight;
      const a = room > 0 && room < need ? chnPer(room) : 0; const d = bh > 0 && bh < need ? chnPer(bh) : 0;
      setFold((f) => (f.a === a && f.d === d ? f : { a, d })); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(panel); ro.observe(board); return () => ro.disconnect();
  }, [g.length]);
  const kinds = CHN_KINDS.map(([k, label]) => [k, label, g.filter((t) => t.res === k).length]).filter((x) => x[2] > 0);
  return (
    <div ref={ref} className="chn-guesses" role="img" aria-label={g.length + (g.length === 1 ? ' guess: ' : ' guesses: ') + kinds.map((x) => x[2] + ' ' + x[1].toLowerCase()).join(', ')}>
      {fold.a ? <div className="chn-rows" style={{ '--chn-fs': CHN_FOLD_SCALE }}>{chnFold(g, fold.a).map((row, r) => <ChnChain key={r} g={row} across />)}</div> : <ChnChain g={g} across />}
      {fold.d ? <div className="chn-cols" style={{ '--chn-fs': CHN_FOLD_SCALE }}>{chnFold(g, fold.d).map((col, r) => <ChnChain key={r} g={col} />)}</div> : <ChnChain g={g} />}
      <ul className="chn-key" aria-hidden="true">{kinds.map(([k, label, n]) => (
        <li key={k}><svg width="12" height="20" viewBox="0 0 20 34"><ChnLoop res={k} x={2} y={2} /></svg>{label} <b>{n}</b></li>))}</ul>
    </div>);
};

// --cw and --ch (each chain's drawn size) and --chn-rows (the board's rows) size the chains against the board (gs-chain.css).
export const ChnSessBody = ({ s }) => {
  if (!s.play) return s.lines.length ? <GsMoves s={s} /> : null;
  const p = chnRead(s);
  return <>
    <GsSessCard r={p.r} className="chn-card" style={{ '--chn-n': p.long, '--chn-rows': p.w.length }}
      board={<div className="chn-board">{p.w.map((x, i) => (
        <React.Fragment key={i}><ChnTiles x={x} />{i < p.w.length - 1 && <ChnJoint />}</React.Fragment>))}</div>}
      rows={[['Guesses', <ChnGuesses g={p.g} />]]} />
    <GsMoves s={s} />
  </>;
};

export const initGsChain = () => { GS_SESSION_BODY.chain = ChnSessBody; };
