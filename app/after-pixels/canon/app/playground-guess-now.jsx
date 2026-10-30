// ============================================================================
// PLAYGROUND, not canon (branch candidate/guess-now-card-lofi): three low-fi directions for Daily Word's now card on its library
// game page, beside canon's own. A: the same strip with its space shared out. B: a second row, with the count and hint in words.
// C: the session page's picture small (the ring and the hint among five places). Open with ?pg=guess-now. To remove it: delete
// this file and playground-guess-now.css, their lines in main.jsx and canon.css, and GS_NOW (registry.js, gs-pass-library.jsx).
// Styles: app/playground-guess-now.css.
// ============================================================================
import React from 'react';
import { useGs, GS_SESSIONS } from './gs-data.jsx';
import { LbActions } from './gs-library.jsx';
import { edList } from './gs-history.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_NOW } from './registry.js';
import { wdRead, wdSay, WdTr, WdNowResult } from './gs-word.jsx';

// What every direction reads from the play: its guesses, the last one, the hint, and the count.
const pgnPlay = (s) => {
  const ev = wdRead(s).events; const gsv = ev.filter((e) => e.kind === 'guess');
  return { ev, n: gsv.length, last: gsv[gsv.length - 1], hint: ev.find((e) => e.kind === 'hint') || null, won: !s.live && !s.loss };
};
const pgnTrail = (p) => [...p.ev.filter((e) => e !== p.last), ...Array.from({ length: 6 - p.n }, () => ({ kind: 'empty' }))];
const pgnSaid = (trail) => trail.map((e) => (e.kind === 'guess' ? wdSay(e) : e.kind === 'hint' ? 'Hint, ' + e.text : 'Not used')).join('. ');

const PgnTrail = ({ p }) => { const trail = pgnTrail(p);
  return <div className="wd-trail" role="img" aria-label={pgnSaid(trail)}>{trail.map((e, i) => <WdTr key={i} e={e} />)}</div>; };
// The big tiles: the last guess, or on a loss with Answer set to "The word", the answer in outlined tiles (as the session page's).
const PgnLast = ({ s, p, cls = 'pgn-tiles' }) => {
  const ans = usePgSetting('ans');
  if (ans === 'word' && s && s.loss && s.answer) return (
    <div className={cls + ' pgn-ans'} role="img" aria-label={'The word was ' + s.answer}>{s.answer.split('').map((ch, j) => <span key={j} className="wd-t pgn-ans-t" aria-hidden="true">{ch}</span>)}</div>);
  return <div className={cls} role="img" aria-label={wdSay(p.last)}>{p.last.word.split('').map((ch, j) => <span key={j} className={'wd-t is-' + p.last.marks[j]} aria-hidden="true">{ch}</span>)}</div>;
};

// The session page's ring (playground-guess-result), smaller: six segments, one per guess, the count inside, no caption.
const RING_R = 52; const RING_C = 2 * Math.PI * RING_R; const RING_SEG = RING_C / 6; const RING_GAP = 7;
const PgnRing = ({ s, p }) => {
  const seg = (i) => (i <= p.n ? (p.won && i === p.n ? 'win' : s.loss ? 'lost' : 'used') : 'spare');
  return (
    <div className="pgn-ring" role="img" aria-label={p.n + (p.n === 1 ? ' guess' : ' guesses') + ' of six'}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((i) => <circle key={i} className={'is-' + seg(i)} cx="64" cy="64" r={RING_R}
          strokeDasharray={(RING_SEG - RING_GAP) + ' ' + (RING_C - RING_SEG + RING_GAP)} transform={'rotate(' + (-90 + (i - 1) * 60 + (RING_GAP / RING_C) * 180) + ' 64 64)'} />)}
      </svg>
      <span className="pgn-ring-n" aria-hidden="true">{p.n}</span>
    </div>);
};
// The hint in its place among five: the hint's square dashed with its letter, the others flat; a caption names it, or says none.
const PgnPlaces = ({ s, p }) => (
  <div className="pgn-places" role="img" aria-label={p.hint ? 'Hint: ' + p.hint.text : s.live ? 'Hint not used yet' : 'No hint'}>
    <div className="pgn-places-row" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((j) => (p.hint && p.hint.pos === j ? <span key={j} className="pgn-place is-hint">{p.hint.letter}</span> : <span key={j} className="pgn-place" />))}
    </div>
    <span className="pgn-cap" aria-hidden="true">{p.hint ? 'Hint' : s.live ? 'Hint: not used yet' : 'Hint: none taken'}</span>
  </div>);

// C's hint (Joe): one small box and the word Hint: the box dashed with the hint's letter, or flat when there was none.
const PgnHintBox = ({ s, p }) => (
  <div className="pgn-hint" role="img" aria-label={p.hint ? 'Hint: ' + p.hint.text : s.live ? 'Hint not used yet' : 'No hint'}>
    <span className={'pgn-place' + (p.hint ? ' is-hint' : '')} aria-hidden="true">{p.hint ? p.hint.letter : ''}</span>
    <span className="pgn-cap" aria-hidden="true">{p.hint ? 'Hint' : s.live ? 'Hint not used' : 'No hint'}</span>
  </div>);

// Head shared by B and C: TODAY and #212 at the left, the result at the right, as every other now card.
const PgnHead = ({ number, s }) => (
  <div className="lb-top">
    <div className="gs-stack-xs"><span className="gs-label">TODAY</span><h2 className="mcp-t-sec">{'#' + number}</h2></div>
    {s && <WdNowResult s={s} />}
  </div>);

// Not yet played: the same title as a played card, one line, Play.
const PgnFresh = ({ c, dir }) => {
  const gs = useGs(); const number = GS_SESSIONS[c.today].number;
  const p = { n: 0, hint: null, won: false };
  const empty = { loss: false, live: true };
  return (
    <section className={'lb-card pgn pgn-' + dir}>
      <PgnHead number={number} />
      {dir === 'b-rows'
        ? <div className="pgn-row"><p className="pgn-line">Five letters. Six guesses.</p></div>
        : <div className="pgn-row">
          <div className="pgn-tiles" role="img" aria-label="Five empty tiles">{[0, 1, 2, 3, 4].map((j) => <span key={j} className="wd-t is-empty" aria-hidden="true" />)}</div>
          <PgnRing s={empty} p={p} /><PgnHintBox s={empty} p={p} />
        </div>}
      <LbActions label="Play" onClick={() => gs.playReq({ kind: 'edition', e: edList(gs, 'word')[0] })} slot={c.next} />
    </section>);
};

// A: canon's card (WdNow, gs-word.jsx) in the same parts and order; css shares out the space it already has.
const PgnA = ({ c, done, sid }) => {
  const gs = useGs(); const s = GS_SESSIONS[sid]; const p = React.useMemo(() => pgnPlay(s), [s]);
  return (
    <section className="lb-card wd-now pgn-a"><div className="wd-now-in">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">TODAY</span><h2 className="mcp-t-sec">{'#' + s.number}</h2></div>
        <WdNowResult s={s} />
      </div>
      {p.last && <div className="wd-now-pic"><div className="wd-now-line"><PgnTrail p={p} />
        <PgnLast s={s} p={p} cls="wd-now-row" />
      </div></div>}
    </div>
      <LbActions onClick={() => gs.go('session', { id: sid })} slot={c.next} />
    </section>);
};

// B: the picture and, after a rule, the count and the hint in words. On a phone the words are one line under the picture.
const PgnB = ({ c, sid }) => {
  const gs = useGs(); const s = GS_SESSIONS[sid]; const p = React.useMemo(() => pgnPlay(s), [s]);
  return (
    <section className="lb-card pgn pgn-b-rows">
      <PgnHead number={s.number} s={s} />
      <div className="pgn-row">
        <PgnTrail p={p} /><PgnLast s={s} p={p} />
        <div className="pgn-facts"><span>{p.n + ' of 6 guesses'}</span><span>{p.hint ? '1 hint' : s.live ? 'Hint not used' : 'No hint'}</span></div>
      </div>
      <LbActions onClick={() => gs.go('session', { id: sid })} slot={c.next} />
    </section>);
};

// C: the last guess, the ring and the hint among five, as the session page tells the play.
const PgnC = ({ c, sid }) => {
  const gs = useGs(); const s = GS_SESSIONS[sid]; const p = React.useMemo(() => pgnPlay(s), [s]);
  return (
    <section className="lb-card pgn pgn-c-ring">
      <PgnHead number={s.number} s={s} />
      <div className="pgn-row"><PgnLast s={s} p={p} /><PgnRing s={s} p={p} /><PgnHintBox s={s} p={p} /></div>
      <LbActions onClick={() => gs.go('session', { id: sid })} slot={c.next} />
    </section>);
};

// D (Joe): C's picture (the last guess, the ring, the hint box) in A's card: canon's title and result where they are, the
// picture centred in the spare height.
const PgnD = ({ c, sid }) => {
  const gs = useGs(); const s = GS_SESSIONS[sid]; const p = React.useMemo(() => pgnPlay(s), [s]);
  return (
    <section className="lb-card wd-now pgn-a pgn-d"><div className="wd-now-in">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">TODAY</span><h2 className="mcp-t-sec">{'#' + s.number}</h2></div>
        <WdNowResult s={s} />
      </div>
      {p.last && <div className="wd-now-pic"><div className="wd-now-line"><PgnLast s={s} p={p} cls="wd-now-row" /><PgnRing s={s} p={p} /><PgnHintBox s={s} p={p} /></div></div>}
    </div>
      <LbActions onClick={() => gs.go('session', { id: sid })} slot={c.next} />
    </section>);
};

// D1-D3 (Joe, after D): D's parts (the last guess, the ring, the hint box) with canon's title top left and result top right,
// each a different way of centring the picture in the card's height and width. D1: the picture centred on the whole card,
// the title and result in its top corners. D2: the tiles centred, the ring and the hint box a small row under them. D3: the
// tiles centred in the card's main column, the ring over the hint box in a panel ruled off at the right, under the result.
const PgnDx = ({ c, sid, v, fresh }) => {
  const gs = useGs(); const s0 = GS_SESSIONS[sid]; const s = fresh ? { ...s0, live: true, loss: false } : s0;
  const p = React.useMemo(() => (fresh ? { n: 0, hint: null, won: false, last: { word: '     ', marks: ['empty', 'empty', 'empty', 'empty', 'empty'] } } : pgnPlay(s)), [s, fresh]); const drop = usePgSetting('drop');
  const facts = <><PgnRing s={s} p={p} /><PgnHintBox s={s} p={p} /></>;
  return (
    <section className={'lb-card pgn-dx pgn-' + v} style={{ '--pgn-drop': (drop || 0) + 'px' }}><div className="pgn-dx-body">
      <div className="gs-stack-xs pgn-dx-head"><span className="gs-label">TODAY</span><h2 className="mcp-t-sec">{'#' + s.number}</h2></div>
      <div className="pgn-dx-res">{!fresh && <WdNowResult s={s} />}</div>
      {v === 'd3'
        ? <><div className="pgn-dx-pic"><PgnLast s={s} p={p} /></div><div className="pgn-dx-panel">{facts}</div></>
        : v === 'd2'
          ? <div className="pgn-dx-pic"><PgnLast s={s} p={p} /><div className="pgn-dx-facts">{facts}</div></div>
          : <div className="pgn-dx-pic"><PgnLast s={s} p={p} />{facts}</div>}
    </div>
      {fresh ? <LbActions label="Play" onClick={() => gs.playReq({ kind: 'edition', e: edList(gs, 'word')[0] })} slot={c.next} />
        : <LbActions onClick={() => gs.go('session', { id: sid })} slot={c.next} />}
    </section>);
};

const PgnCard = ({ children, ...props }) => {
  const dir = usePgSetting('dir'); const gs = useGs();
  if (dir === 'canon') return children;
  if (props.none && ['d1', 'd2', 'd3'].includes(dir)) return <PgnDx c={props.c} sid={props.c.today} v={dir} fresh />;
  if (props.none) return <PgnFresh c={props.c} dir={dir} />;
  if (dir === 'a-space') return <PgnA {...props} sid={props.done ? props.c.today : props.c.liveSid} />;
  if (dir === 'd-c-in-a') return <PgnD c={props.c} sid={props.done ? props.c.today : props.c.liveSid} />;
  if (['d1', 'd2', 'd3'].includes(dir)) return <PgnDx c={props.c} sid={props.done ? props.c.today : props.c.liveSid} v={dir} />;
  const sid = props.done ? props.c.today : props.c.liveSid;
  return dir === 'b-rows' ? <PgnB c={props.c} sid={sid} /> : <PgnC c={props.c} sid={sid} />;
};

// The settings bar (app/playground.jsx) picks the direction and the play. Open with ?pg=guess-now.
// A hard or failed today is reached by setReview, after the library state has staged.
const played = (ed) => (gs) => gs.setReview({ today: 'played', week: 'done', ed });
export const initPlaygroundGuessNow = () => {
  pgRegister('guess-now', { title: 'Guess now card', settings: [
    { key: 'dir', label: 'Direction', options: [{ value: 'a-space', label: 'A Space' }, { value: 'b-rows', label: 'B Second row' }, { value: 'c-ring', label: 'C Ring and places' }, { value: 'd-c-in-a', label: 'D C in A spacing' }, { value: 'd1', label: 'D1 Centred on the card' }, { value: 'd2', label: 'D2 Tiles over facts' }, { value: 'd3', label: 'D3 Facts panel' }, { value: 'canon', label: 'Canon' }] },
    { key: 'play', label: 'Play', options: [
      { value: 'solved', label: 'Solved in 3', state: 'library-word', go: played(null) },
      { value: 'hard', label: 'Solved in 5', state: 'library-word', go: played('hard') },
      { value: 'failed', label: 'Failed', state: 'library-word', go: played('failed') },
      { value: 'live', label: 'In progress', state: 'library-word-in-progress' },
      { value: 'fresh', label: 'Not yet played', state: 'free-not-played-today' }] },
    { key: 'drop', label: 'D1 lower by', options: [{ value: '0', label: '0' }, { value: '8', label: '8px' }, { value: '16', label: '16px' }, { value: '24', label: '24px' }] },
    { key: 'ans', label: 'On a loss', options: [{ value: 'last', label: 'Last guess' }, { value: 'word', label: 'The word' }] },
  ] });
  if (pgActive()) GS_NOW.word = PgnCard;
};
