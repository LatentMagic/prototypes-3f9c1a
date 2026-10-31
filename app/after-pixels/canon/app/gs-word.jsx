// ============================================================================
// After Pixels — Daily Word's own parts (1236): the session page's body (the board, then Every guess) and the cover the
// session page shows. Reads the plays in app/gs-data.jsx (word-today, word-hard, word-failed, word-live). Loads after
// app/gs-escape.jsx and extends the same seams in app/gs-session.jsx.
// The record holds each guess with its marks and each hint as "Letter N is X." (game spec daily-word.md § 2): the place of
// the first letter not yet green. The answer is never printed; the seed's answer only computes the marks.
// ============================================================================

// ---- The model: the record's lines read as guesses (with the engine's marks) and the hint, in the order they came. ----
// The engine's marking: greens first, then each remaining letter of the answer lights at most one amber, left to right.
import React from 'react';
import { DS, useGs, GS_SESSIONS } from './gs-data.jsx';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { LbNowCard } from './gs-library.jsx';
import { GS_SESSION_BODY, GS_SESSION_QUIET } from './registry.js';

const wdScore = (word, answer) => {
  const w = word.split(''); const a = answer.split(''); const marks = w.map(() => 'miss'); const left = {};
  a.forEach((ch, i) => { if (w[i] === ch) marks[i] = 'hit'; else left[ch] = (left[ch] || 0) + 1; });
  w.forEach((ch, i) => { if (marks[i] !== 'hit' && left[ch]) { marks[i] = 'near'; left[ch] -= 1; } });
  return marks;
};
export const wdRead = (s) => {
  const events = []; let n = 0;
  (s.lines || []).forEach((l) => {
    if (/^Guess/.test(l[0])) { n += 1; events.push({ kind: 'guess', n, word: l[1], marks: wdScore(l[1], s.answer || l[1]) }); }
    else if (l[0] === 'Hint') { const m = /Letter (\d) is ([A-Z])/.exec(l[1]); if (m) events.push({ kind: 'hint', pos: Number(m[1]) - 1, letter: m[2], text: l[1], after: n }); }
  });
  return { events };
};
const WD_SAY = { hit: 'in place', near: 'in the word', miss: 'not in the word' };

// ---- The board (playground v6, agreed 2026-10-28): square tiles, each guess row numbered at its left; the hint a half-height
// row where it was taken, its letter and "Hint" in a dashed grey tile at its letter's column, the rest of the row empty. In
// progress shows only the rows played; the "In progress" tag carries the rest (owner, 2026-10-28). Tiles have no hover. ----
export const WdRow = ({ g }) => (
  <div className="wd-row" role="img" aria-label={'Guess ' + g.n + ', ' + g.word + ': ' + g.word.split('').map((ch, i) => ch + ' ' + WD_SAY[g.marks[i]]).join(', ')}>
    {g.word.split('').map((ch, i) => <span key={i} className={'wd-t is-' + g.marks[i]} aria-hidden="true">{ch}</span>)}
  </div>);
// KEEP: the hint tile starts at its letter's column, one tile wide; the empty spans either side hold its place.
const WdHint = ({ h }) => (
  <div className="wd-hrow" role="img" aria-label={'Hint, after guess ' + h.after + ': ' + h.text} style={{ '--p': h.pos }}>
    {h.pos > 0 && <span className="wd-dots is-l" aria-hidden="true" />}
    <span className="wd-t is-hint" aria-hidden="true">{h.letter}</span>
    <span className="wd-dots" aria-hidden="true" />
  </div>);
// guessesOnly: the board without its hint row, for a result that draws the hint itself.
export const WdBoard = ({ s, guessesOnly }) => {
  const p = React.useMemo(() => wdRead(s), [s]);
  const rows = p.events.filter((e) => !guessesOnly || e.kind === 'guess').map((e, i) => [e.kind === 'guess' ? e.n : null, e.kind === 'guess' ? <WdRow g={e} /> : <WdHint h={e} />, i]);
  return (
    <div className="wd-board">
      {rows.map(([num, el, key]) => <div key={key} className="wd-nrow"><span className="wd-n" aria-hidden="true">{num}</span>{el}<span aria-hidden="true" /></div>)}
    </div>);
};

// ---- The result statement: Solved, Failed or In progress. It is the element every game's session page has. ----
export const wdResult = (s) => (s.live ? { tone: 'live', word: 'In progress' } : s.loss ? { tone: 'bad', word: 'Failed' } : { tone: 'ok', word: 'Solved' });

// ---- The session page's own part, under the shared head (Joe, 2026-10-30, 6a Ring lifted): the shared session card (GsSessCard)
// with the board (guesses only), the guesses as a ring and the hint in its place among five; the word on a loss as the panel's
// last row, never on the left. Every guess is the store's plain list, collapsed. ----
const wdPlay = (s) => {
  const ev = wdRead(s).events; const guesses = ev.filter((e) => e.kind === 'guess');
  return { n: guesses.length, hint: ev.find((e) => e.kind === 'hint') || null, won: !s.live && !s.loss };
};
// The ring: six segments, one per guess: green for the guess that solved it, amber when all six were spent, grey for one used,
// the card's line for one not reached (in progress too: no mark for the next guess, Joe). The panel names it, so it holds the number alone.
const WD_RING_R = 52; const WD_RING_C = 2 * Math.PI * WD_RING_R; const WD_RING_SEG = WD_RING_C / 6; const WD_RING_GAP = 7;
const WdRing = ({ s, p }) => {
  const seg = (i) => (i <= p.n ? (p.won && i === p.n ? 'win' : s.loss ? 'lost' : 'used') : 'spare');
  return (
    <div className="wd-ring" role="img" aria-label={p.n + (p.n === 1 ? ' guess' : ' guesses') + ' of six'}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((i) => <circle key={i} className={'is-' + seg(i)} cx="64" cy="64" r={WD_RING_R}
          strokeDasharray={(WD_RING_SEG - WD_RING_GAP) + ' ' + (WD_RING_C - WD_RING_SEG + WD_RING_GAP)} transform={'rotate(' + (-90 + (i - 1) * 60 + (WD_RING_GAP / WD_RING_C) * 180) + ' 64 64)'} />)}
      </svg>
      <span className="wd-ring-n" aria-hidden="true"><b>{p.n}</b></span>
    </div>);
};
// The hint in its place among the word's five letters: the hint's square dashed with its letter (the hint edge), the others flat
// in the line colour, so only the hint reads.
const WdPlaces = ({ s, p }) => (
  <div className={'wd-places' + (p.hint ? '' : ' is-none')} role="img" aria-label={p.hint ? 'Hint: ' + p.hint.text : s.live ? 'Hint not used yet' : 'No hint'}>
    <div className="wd-places-row" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((j) => (p.hint && p.hint.pos === j ? <span key={j} className="wd-place is-hint">{p.hint.letter}</span> : <span key={j} className="wd-place" />))}
    </div>
    {!p.hint && <span className="wd-places-note" aria-hidden="true">{s.live ? 'Not used yet' : 'None taken'}</span>}
  </div>);
// A loss: the word in outlined tiles at half the board's.
const WdAnswer = ({ s }) => (s.loss && s.answer ? (
  <div className="wd-ans" role="img" aria-label={'The word was ' + s.answer}>
    <span className="gs-sc-cap" aria-hidden="true">The word</span>
    <div className="wd-ans-row" aria-hidden="true">{s.answer.split('').map((ch, i) => <span key={i} className="wd-t wd-ans-t">{ch}</span>)}</div>
  </div>) : null);
export const WdSessBody = ({ s }) => { const p = wdPlay(s); return <>
  <GsSessCard r={wdResult(s)} className="wd-sc" board={<WdBoard s={s} guessesOnly />}
    rows={[['Guesses', <WdRing s={s} p={p} />], ['Hint', <WdPlaces s={s} p={p} />]]} last={<WdAnswer s={s} />} />
  <GsMoves s={s} />
</>; };

// The head carries no result: the game's part has it (as Escape's).
export const registerWord = () => {
  GS_SESSION_BODY.word = WdSessBody;
  GS_SESSION_QUIET.word = (s) => ({ label: s.game, h1: 'No. ' + s.number });
};

// ---- The now card (owner, 2026-10-28; v11 D2): the shared frame (LbNowCard) with the edition as its title ("#212", as Escape's room
// name), and in place of canon's line and bar the play as a picture: the guess it ended on at full tile
// size, the others a trail of six small rows beside it (a guess not used stays flat, so the card holds one height). No sentence:
// the rows carry the count and the hint. ----
export const wdSay = (g) => 'Guess ' + g.n + ', ' + g.word + ': ' + g.word.split('').map((ch, i) => ch + ' ' + WD_SAY[g.marks[i]]).join(', ');
export const WdTr = ({ e }) => (e.kind === 'guess'
  ? <div className="wd-tr">{e.marks.map((m, j) => <i key={j} className={'is-' + m} />)}</div>
  : e.kind === 'hint' ? <div className="wd-tr">{[0, 1, 2, 3, 4].map((j) => <i key={j} className={j === e.pos ? 'is-hint' : 'is-none'} />)}</div>
  : <div className="wd-tr">{[0, 1, 2, 3, 4].map((j) => <i key={j} className="is-empty" />)}</div>);
export const WdNow = ({ c, done }) => {
  const gs = useGs(); const sid = done ? c.today : c.liveSid; const s = GS_SESSIONS[sid];
  const ev = React.useMemo(() => wdRead(s).events, [s]);
  const gsv = ev.filter((e) => e.kind === 'guess'); const last = gsv[gsv.length - 1];
  const trail = last ? [...ev.filter((e) => e !== last), ...Array.from({ length: 6 - gsv.length }, () => ({ kind: 'empty' }))] : [];
  const said = trail.map((e) => (e.kind === 'guess' ? wdSay(e) : e.kind === 'hint' ? 'Hint, ' + e.text : 'Not used')).join('. ');
  const r = wdResult(s);
  return (
    <LbNowCard gid="word" className="wd-now" title={'#' + s.number} result={{ kind: r.tone, label: r.word }} open={() => gs.go('session', { id: sid })} next={c.next}>
      {last && <div className="wd-now-pic"><div className="wd-now-line">
        <div className="wd-trail" role="img" aria-label={said}>{trail.map((e, i) => <WdTr key={i} e={e} />)}</div>
        <div className="wd-now-row" role="img" aria-label={wdSay(last)}>{last.word.split('').map((ch, j) => <span key={j} className={'wd-t is-' + last.marks[j]} aria-hidden="true">{ch}</span>)}</div>
      </div></div>}
    </LbNowCard>);
};
