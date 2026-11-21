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
// An unfolded chain's number is drawn at 12 units, or larger where the chain is drawn smaller, so it is never under 11px on screen:
// the text-size floor (ui-design.md).
const CHN_NUM = 12; const CHN_NUM_SCREEN = 11;
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
const ChnChain = ({ g, across, nf = CHN_NUM }) => {
  const len = chnLen(g.length);
  return across
    ? <svg className="chn-chain is-across" width={len} height="46" viewBox={'0 0 ' + len + ' 46'} style={{ '--cw': len, '--ch': 46, '--chn-nf': nf }} aria-hidden="true">
      {g.slice(1).map((t, i) => <line key={'b' + i} className="chn-bar" x1={4 + i * CHN_STEP + CHN_H} y1={4 + CHN_W / 2} x2={4 + (i + 1) * CHN_STEP} y2={4 + CHN_W / 2} />)}
      {g.map((t, i) => <ChnLoop key={i} res={t.res} across x={4 + i * CHN_STEP} y={4} />)}
      {g.map((t, i) => <text key={'n' + i} x={4 + i * CHN_STEP + CHN_H / 2} y="42" textAnchor="middle">{t.n}</text>)}</svg>
    : <svg className="chn-chain is-down" width="56" height={len} viewBox={'0 0 56 ' + len} style={{ '--cw': 56, '--ch': len, '--chn-nf': nf }} aria-hidden="true">
      {g.slice(1).map((t, i) => <line key={'b' + i} className="chn-bar" x1={32 + CHN_W / 2} y1={4 + i * CHN_STEP + CHN_H} x2={32 + CHN_W / 2} y2={4 + (i + 1) * CHN_STEP} />)}
      {g.map((t, i) => <ChnLoop key={i} res={t.res} x={32} y={4 + i * CHN_STEP} />)}
      {g.map((t, i) => <text key={'n' + i} x="20" y={4 + i * CHN_STEP + CHN_H / 2 + nf / 3} textAnchor="end">{t.n}</text>)}</svg>;
};
const CHN_KINDS = [['right', 'Right'], ['wrong', 'Wrong'], ['near', 'Near miss'], ['given', 'Given away']];
// KEEP: a chain with less than 0.7px per drawing unit of room is folded, so a link is never drawn smaller than 0.66px per unit. Folded
// across into balanced rows where the card is under 672px, each link 19.8 by 10.6px (CHN_FOLD_SCALE_PHONE, 0.66); folded down beside
// the board into balanced columns from 672px, each link 21 by 11.2px (CHN_FOLD_SCALE, 0.7); the numbers run on from one row or column
// to the next. Both sit between the shrunk size of a long chain and Chain's now card at 1px, so a long play takes fewer rows on a phone.
// The rows are decided with the 0.7 floor but drawn at 0.66, so a chain that fits one row at 0.66 stays one row at that size, without
// folding, in a narrow band of widths: 10 links from 317 to 331px, 14 from 418 to 438px, 19 from 543 to 571px. Above a band the chain is
// unfolded at 0.7 or more. A folded chain's numbers are 13px on screen, drawn at 13 divided by the fold scale in drawing units. An unfolded
// chain's are 12 units, raised to 11px on screen (the text-size floor) where the measured scale would draw them smaller; a chain
// drawn above 0.92px per unit keeps its 12 units. A row or column that is not full (the last) is centred on the full ones, rows across, columns
// vertically. Measured: the rows by the room the panel gives them (never the guesses' own width, which shrinks as they fold), the
// columns by the board's height (the platform needs the same measuring).
const CHN_FLOOR = 0.7;
const CHN_FOLD_SCALE = 0.7;
const CHN_FOLD_SCALE_PHONE = 0.66;
const chnPer = (room, scale) => Math.max(1, Math.floor((room / scale - chnLen(1)) / CHN_STEP) + 1);
const chnFold = (g, per) => { const size = Math.ceil(g.length / Math.ceil(g.length / per)); const out = [];
  for (let i = 0; i < g.length; i += size) out.push(g.slice(i, i + size));
  return out; };
const ChnGuesses = ({ g }) => {
  const ref = React.useRef(null); const [fold, setFold] = React.useState({ a: 0, d: 0 }); const [nf, setNf] = React.useState({ a: CHN_NUM, d: CHN_NUM });
  React.useLayoutEffect(() => {
    const me = ref.current; const card = me.closest('.chn-card'); const board = card && card.querySelector('.chn-board'); const panel = me.closest('.gs-sc-panel'); if (!board || !panel) return undefined;
    const need = chnLen(g.length) * CHN_FLOOR;
    const fit = () => { const ps = getComputedStyle(panel); const room = panel.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight); const bh = board.offsetHeight;
      const a = room > 0 && room < need ? chnPer(room, CHN_FOLD_SCALE_PHONE) : 0; const d = bh > 0 && bh < need ? chnPer(bh, CHN_FOLD_SCALE) : 0;
      setFold((f) => (f.a === a && f.d === d ? f : { a, d })); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(panel); ro.observe(board); return () => ro.disconnect();
  }, [g.length]);
  // An unfolded chain is drawn at whatever scale the card gives it, so its numbers are sized from the scale it is drawn at.
  React.useLayoutEffect(() => {
    const me = ref.current; const panel = me.closest('.gs-sc-panel'); if (!panel) return undefined;
    const units = (el) => { if (!el) return CHN_NUM; const w = el.getBoundingClientRect().width; const cw = Number(el.style.getPropertyValue('--cw'));
      return w > 0 && cw ? Math.max(CHN_NUM, Math.round(CHN_NUM_SCREEN / (w / cw) * 100) / 100) : CHN_NUM; };
    const size = () => { const a = units(me.querySelector(':scope > .chn-chain.is-across')); const d = units(me.querySelector(':scope > .chn-chain.is-down'));
      setNf((n) => (n.a === a && n.d === d ? n : { a, d })); };
    size(); const ro = new ResizeObserver(size); ro.observe(panel); return () => ro.disconnect();
  }, [g.length, fold.a, fold.d]);
  const kinds = CHN_KINDS.map(([k, label]) => [k, label, g.filter((t) => t.res === k).length]).filter((x) => x[2] > 0);
  return (
    <div ref={ref} className="chn-guesses" role="img" aria-label={g.length + (g.length === 1 ? ' guess: ' : ' guesses: ') + kinds.map((x) => x[2] + ' ' + x[1].toLowerCase()).join(', ')}>
      {fold.a ? <div className="chn-rows" style={{ '--chn-fs': CHN_FOLD_SCALE_PHONE }}>{chnFold(g, fold.a).map((row, r) => <ChnChain key={r} g={row} across />)}</div> : <ChnChain g={g} across nf={nf.a} />}
      {fold.d ? <div className="chn-cols" style={{ '--chn-fs': CHN_FOLD_SCALE }}>{chnFold(g, fold.d).map((col, r) => <ChnChain key={r} g={col} />)}</div> : <ChnChain g={g} nf={nf.d} />}
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
