// ============================================================================
// After Pixels — Chain's session page body (1236), under the shared head: one card on Guess's layout (playground-guess-result.jsx,
// 6a lifted): the result word top left, the chain as the board, and beside it (under it on a phone) the guesses as a chain of
// links in the order they were made. Every guess follows, closed. Joe's pick from the low-fi round (concept 1, Linked rows).
// Reads the play each Chain session carries (`play`, from gs-where-chain-salvage.jsx: CH_TODAY, CH_OK, CH_FAIL) and replays it
// the engine's way (game spec chain.md § 2): each word starts with one letter shown; a wrong guess shows one more; a word whose
// shown letters would reach its length is given away. A near miss is a wrong guess that still makes a real link.
// Styles: app/gs-chain.css.
// ============================================================================
import React from 'react';
import { GsMoves } from './gs-session.jsx';
import { GS_SESSION_BODY } from './registry.js';
import { PgrTop } from './playground-guess-result.jsx';
import { pgRegister } from './playground.jsx';

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
const ChnChain = ({ g, across }) => {
  const len = 8 + (g.length - 1) * CHN_STEP + CHN_H;
  return across
    ? <svg className="chn-chain is-across" width={len} height="46" viewBox={'0 0 ' + len + ' 46'} aria-hidden="true">
      {g.slice(1).map((t, i) => <line key={'b' + i} className="chn-bar" x1={4 + i * CHN_STEP + CHN_H} y1={4 + CHN_W / 2} x2={4 + (i + 1) * CHN_STEP} y2={4 + CHN_W / 2} />)}
      {g.map((t, i) => <ChnLoop key={i} res={t.res} across x={4 + i * CHN_STEP} y={4} />)}
      {g.map((t, i) => <text key={'n' + i} x={4 + i * CHN_STEP + CHN_H / 2} y="42" textAnchor="middle">{t.n}</text>)}</svg>
    : <svg className="chn-chain is-down" width="56" height={len} viewBox={'0 0 56 ' + len} aria-hidden="true">
      {g.slice(1).map((t, i) => <line key={'b' + i} className="chn-bar" x1={32 + CHN_W / 2} y1={4 + i * CHN_STEP + CHN_H} x2={32 + CHN_W / 2} y2={4 + (i + 1) * CHN_STEP} />)}
      {g.map((t, i) => <ChnLoop key={i} res={t.res} x={32} y={4 + i * CHN_STEP} />)}
      {g.map((t, i) => <text key={'n' + i} x="20" y={4 + i * CHN_STEP + CHN_H / 2 + 4} textAnchor="end">{t.n}</text>)}</svg>;
};
const CHN_KINDS = [['right', 'Right'], ['wrong', 'Wrong'], ['near', 'Near miss'], ['given', 'Given away']];
const ChnGuesses = ({ g }) => {
  const kinds = CHN_KINDS.map(([k, label]) => [k, label, g.filter((t) => t.res === k).length]).filter((x) => x[2] > 0);
  return (
    <div className="chn-guesses" role="img" aria-label={g.length + (g.length === 1 ? ' guess: ' : ' guesses: ') + kinds.map((x) => x[2] + ' ' + x[1].toLowerCase()).join(', ')}>
      <ChnChain g={g} across /><ChnChain g={g} />
      <ul className="chn-key" aria-hidden="true">{kinds.map(([k, label, n]) => (
        <li key={k}><svg width="12" height="20" viewBox="0 0 20 34"><ChnLoop res={k} x={2} y={2} /></svg>{label} <b>{n}</b></li>))}</ul>
    </div>);
};

const ChnSessBody = ({ s }) => {
  if (!s.play) return s.lines.length ? <GsMoves s={s} /> : null;
  const p = chnRead(s);
  return <>
    <section className="dv2 pgr-card pgr-6a pgr-lift chn-card" style={{ '--chn-n': p.long }} aria-label="How it went">
      <PgrTop p={p} />
      <div className="pgr-duo">
        <div className="pgr-boardcol"><div className="chn-board">{p.w.map((x, i) => (
          <React.Fragment key={i}><ChnTiles x={x} />{i < p.w.length - 1 && <ChnJoint />}</React.Fragment>))}</div></div>
        <div className="pgr-panel chn-panel"><div className="pgr-prow"><span className="pgr-cap">Guesses</span><ChnGuesses g={p.g} /></div></div>
      </div>
    </section>
    <GsMoves s={s} />
  </>;
};

// Open with ?pg=chain for a settings bar that switches between Chain's session states.
export const initGsChain = () => {
  GS_SESSION_BODY.chain = ChnSessBody;
  pgRegister('chain', { title: 'Chain', settings: [
    { key: 'play', label: 'Play', options: [
      { value: 'solved', label: 'Solved', state: 'session-chain' },
      { value: 'live', label: 'In progress', state: 'session-chain-in-progress' },
      { value: 'failed', label: 'Failed', state: 'session-chain-failed' },
      { value: 'earlier', label: 'Earlier', state: 'session-chain-earlier' }] }] });
};
