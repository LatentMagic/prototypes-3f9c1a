// ============================================================================
// PLAYGROUND, not canon (branch candidate/guess-result-hifi): two directions for Daily Word's result on the session page,
// 6a (a ring of the six guesses, the hint in its place among five) and 7a (canon's card with a short line under the result), each with the result as Delve's word and line,
// beside canon's own. The playground settings bar (app/playground.jsx) picks the direction and the play; open with ?pg=guess-result. To remove it: delete this file and
// playground-guess-result.css, and their lines in main.jsx and canon.css. Styles: app/playground-guess-result.css.
// ============================================================================
import React from 'react';
import { GS_SESSIONS, gsWordLines } from './gs-data.jsx';
import { GsMoves } from './gs-session.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_SESSION_BODY } from './registry.js';
import { WdBoard, WdSessBody, wdRead, wdResult } from './gs-word.jsx';

// ---- What both directions read: guesses used, the hint, the answer. ----
const pgrPlay = (s) => {
  const ev = wdRead(s).events; const guesses = ev.filter((e) => e.kind === 'guess');
  return { n: guesses.length, hint: ev.find((e) => e.kind === 'hint') || null, won: !s.live && !s.loss, r: wdResult(s) };
};

// ---- 7a beside's result: Delve's word and line, stacked and centred beside the board. ----
const PgrBand = ({ p, lines }) => (
  <div className="dv7r-band pgr-band"><h2 className={'dv7r-word is-' + p.r.tone}>{p.r.word}</h2>
    {(lines || []).filter(Boolean).map((l, i) => <p key={i} className="dv7r-line">{l}</p>)}</div>);

// ---- 6a: the ring. Six segments, one per guess: green for the guess that solved it, the Failed tag's colour when all six
// were spent, grey for one used, the card's line for one not reached (in progress too: no mark for the next guess, Joe). ----
const RING_R = 52; const RING_C = 2 * Math.PI * RING_R; const RING_SEG = RING_C / 6; const RING_GAP = 7;
// label: the panel names it already, so the ring holds the number alone.
const PgrRing = ({ s, p, label }) => {
  const seg = (i) => (i <= p.n ? (p.won && i === p.n ? 'win' : s.loss ? 'lost' : 'used') : 'spare');
  return (
    <div className="pgr-ring" role="img" aria-label={p.n + (p.n === 1 ? ' guess' : ' guesses') + ' of six'}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((i) => <circle key={i} className={'is-' + seg(i)} cx="64" cy="64" r={RING_R}
          strokeDasharray={(RING_SEG - RING_GAP) + ' ' + (RING_C - RING_SEG + RING_GAP)} transform={'rotate(' + (-90 + (i - 1) * 60 + (RING_GAP / RING_C) * 180) + ' 64 64)'} />)}
      </svg>
      <span className="pgr-ring-n" aria-hidden="true"><b>{p.n}</b>{!label && <span>{p.n === 1 ? 'guess' : 'guesses'}</span>}</span>
    </div>);
};
// The hint in its place among the word's five letters: five equal squares, the hint's dashed with its letter (canon's hint
// edge), the others flat in the line colour (canon's now card's block for nothing there), so only the hint reads.
const PgrPlaces = ({ s, p }) => (
  <div className={'pgr-places' + (p.hint ? '' : ' is-none')} role="img" aria-label={p.hint ? 'Hint: ' + p.hint.text : s.live ? 'Hint not used yet' : 'No hint'}>
    <div className="pgr-places-row" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((j) => (p.hint && p.hint.pos === j
        ? <span key={j} className="pgr-place is-hint">{p.hint.letter}</span>
        : <span key={j} className="pgr-place" />))}
    </div>
    {!p.hint && <span className="pgr-note" aria-hidden="true">{s.live ? 'Not used yet' : 'None taken'}</span>}
  </div>);
// A loss: the word, under the board, in outlined tiles a size down.
const PgrAnswer = ({ s }) => (s.loss && s.answer ? (
  <div className="pgr-ans" role="img" aria-label={'The word was ' + s.answer}>
    <span className="pgr-cap" aria-hidden="true">The word</span>
    <div className="pgr-ans-row" aria-hidden="true">{s.answer.split('').map((ch, i) => <span key={i} className="wd-t pgr-ans-t">{ch}</span>)}</div>
  </div>) : null);

// ---- The full-width card (Delve's and Escape's, settled): Delve's card and its result band at the top left, the word in its
// outcome's colour and the line beside it (under it on a phone), as the low-fi round drew it. ----
const pgrFacts = (s, p) => [p.n + (p.n === 1 ? ' guess' : ' guesses'), p.hint ? '1 hint' : s.live ? 'hint not used' : 'no hint'];
const PgrTop = ({ p, line }) => (
  <div className="dv7r-band"><h2 className={'dv7r-word is-' + p.r.tone}>{p.r.word}</h2>{line && <p className="dv7r-line">{line}</p>}</div>);

// 6a: the word alone on top; below, the board (guesses only) and beside it a panel: the guesses as a ring, the hint in its place
// among five. A loss shows the word in the panel, never on the left (Joe). Lifted: the panel rises level with the word on top,
// and the word on a loss is drawn quieter.
const Pgr6a = ({ s, lift }) => { const p = pgrPlay(s); return (
  <section className={'dv2 pgr-card pgr-6a' + (lift ? ' pgr-lift' : '')} aria-label="How it went">
    <PgrTop p={p} />
    <div className="pgr-duo">
      <div className="pgr-boardcol"><WdBoard s={s} guessesOnly /></div>
      <div className="pgr-panel">
        <div className="pgr-prow"><span className="pgr-cap">Guesses</span><PgrRing s={s} p={p} label /></div>
        <div className="pgr-prow"><span className="pgr-cap">Hint</span><PgrPlaces s={s} p={p} /></div>
        <PgrAnswer s={s} />
      </div>
    </div>
  </section>); };

// 7a: the word and a short line on top (guesses and hint; on a loss, the word too); the board below, centred, with canon's hint row.
const Pgr7a = ({ s }) => { const p = pgrPlay(s); return (
  <section className="dv2 pgr-card pgr-7a" aria-label="How it went">
    <PgrTop p={p} line={<span className="pgr-facts">{pgrFacts(s, p).map((f, i) => <span key={i}>{f}</span>)}
      {s.loss && s.answer && <span>The word was <b className="pgr-answ">{s.answer}</b></span>}</span>} />
    <div className="pgr-boardc"><WdBoard s={s} /></div>
  </section>); };

// 7a beside (the first hi-fi build, kept on Joe's word), in the full-width card: the word and line stacked and centred in the
// left half, the board centred in the right half, a rule between. On a phone the result sits above the board.
const Pgr7aBeside = ({ s }) => { const p = pgrPlay(s); return (
  <section className="dv2 pgr-card" aria-label="How it went"><div className="pgr-split">
    <div className="pgr-split-res"><PgrBand p={p} lines={[
      <span key="f" className="pgr-facts">{pgrFacts(s, p).map((f, i) => <span key={i}>{f}</span>)}</span>,
      s.loss && s.answer ? <span key="w" className="pgr-word">The word was <b>{s.answer}</b></span> : null]} /></div>
    <div className="pgr-boardc"><WdBoard s={s} /></div>
  </div></section>); };

// 6a beside: no word on top; the panel left holds the word, the ring and the hint, the board right (guesses only), a rule
// between. On a phone the panel sits above the board: the word, then the ring and the hint side by side.
const Pgr6aBeside = ({ s }) => { const p = pgrPlay(s); return (
  <section className="dv2 pgr-card" aria-label="How it went"><div className="pgr-split">
    <div className="pgr-split-res pgr-split-6">
      <PgrBand p={p} />
      <div className="pgr-split-figs">
        <div className="pgr-prow"><span className="pgr-cap">Guesses</span><PgrRing s={s} p={p} label /></div>
        <div className="pgr-prow"><span className="pgr-cap">Hint</span><PgrPlaces s={s} p={p} /></div>
      </div>
    </div>
    <div className="pgr-boardcol"><WdBoard s={s} guessesOnly /><PgrAnswer s={s} /></div>
  </div></section>); };

const PgrPicked = ({ s }) => <><Pgr6a s={s} lift /><GsMoves s={s} /></>;

const PgrBody = ({ s }) => {
  const dir = usePgSetting('dir');
  if (dir === 'canon') return <WdSessBody s={s} />;
  return <>
    {dir === '6a' ? <Pgr6a s={s} /> : dir === '6a-lift' ? <Pgr6a s={s} lift /> : dir === '6a-beside' ? <Pgr6aBeside s={s} /> : dir === '7a-beside' ? <Pgr7aBeside s={s} /> : <Pgr7a s={s} />}
    <GsMoves s={s} />
  </>;
};

// The settings bar (app/playground.jsx) picks the direction and the play. Open with ?pg=guess-result.
export const initPlaygroundGuessResult = () => {
  // A play with no hint: the seeds all take one.
  GS_SESSIONS['pgr-word-nohint'] = { ...GS_SESSIONS['word-today'], number: 211, hints: 0, result: 'Solved in 4 of 6', share: 'Solved in 4 of 6',
    date: 'Monday 5 October', lines: gsWordLines('STILL', ['CRANE', 'SLATE', 'STALL', 'STILL']) };
  pgRegister('guess-result', { title: 'Guess result', settings: [
    { key: 'dir', label: 'Direction', options: [{ value: '6a', label: '6a Ring' }, { value: '6a-lift', label: '6a Ring lifted' }, { value: '6a-beside', label: '6a beside' }, { value: '7a', label: '7a Short line' }, { value: '7a-beside', label: '7a beside' }, { value: 'canon', label: 'Canon' }] },
    { key: 'play', label: 'Play', options: [
      { value: 'solved', label: 'Solved in 3', state: 'session-puzzle' },
      { value: 'hard', label: 'Solved in 5', state: 'session-word-hard' },
      { value: 'nohint', label: 'No hint', state: 'session-puzzle', go: (gs) => gs.go('session', { id: 'pgr-word-nohint' }) },
      { value: 'failed', label: 'Failed', state: 'session-word-failed' },
      { value: 'live', label: 'In progress', state: 'session-word-in-progress' }] },
  ] });
  // Joe's pick, on the real session page too: 6a Ring lifted. Under ?pg=guess-result the settings bar picks instead.
  GS_SESSION_BODY.word = pgActive() ? PgrBody : PgrPicked;
};
