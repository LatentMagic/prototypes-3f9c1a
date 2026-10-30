// ============================================================================
// PLAYGROUND, not canon (branch candidate/chain-now-lofi): three low-fi concepts for Chain's now card on its library game page,
// built on the shared frame (LbNowCard) in the session page's language (candidate/chain-session-lofi, gs-chain.jsx): letter
// tiles, link joints between words, and the guesses as a numbered chain of links. A, Route: the words across the card's width,
// joined, the guesses under. B, Today's link: one word large, the guesses and the count under. C, Two ends: the two end words
// at the edges, the words between as link nodes. The picture is always centred in the card's height. Open with
// ?pg=chain-now; without it this file registers nothing on the page. To remove it: delete this file and
// playground-chain-now.css, and their lines in main.jsx and canon.css. Styles: app/playground-chain-now.css.
// ============================================================================
import React from 'react';
import { useGs, GS_SESSIONS } from './gs-data.jsx';
import { LbNowCard } from './gs-library.jsx';
import { edList } from './gs-history.jsx';
import { pgRegister, usePgSetting } from './playground.jsx';
import { GS_NOW } from './registry.js';

const cnwHere = () => new URLSearchParams(window.location.search).get('pg') === 'chain-now';

// ---- The plays, as gs-where-chain-salvage.jsx seeds them (CH_TODAY, CH_FAIL; not exported on main): { w: the line,
// p: [[guess, index of the word it was for]] }. In progress is today's first three guesses, as the chain-live session. ----
const CNW_TODAY = { w: ['SNOW', 'BALL', 'ROOM', 'SERVICE', 'STATION', 'WAGON'], p: [['BALL', 1], ['RACE', 2], ['ROOM', 2], ['STATION', 4], ['SUITE', 3], ['SERVICE', 3]] };
const CNW_PLAYS = {
  live: { ...CNW_TODAY, p: CNW_TODAY.p.slice(0, 3), live: true },
  solved: CNW_TODAY,
  failed: { w: ['GOLD', 'FISH', 'BONE', 'DRY', 'CLEAN'], p: [['FINCH', 1], ['FISH', 1], ['DUST', 3], ['DRY', 3], ['BALL', 2], ['BOWL', 2], ['BOAT', 2]] },
};

// ---- The model, replayed the engine's way (as gs-chain.jsx): each word starts with one letter shown, a wrong guess shows one
// more, and a word whose shown letters would reach its length is given away. Per word its state; per guess its result; `last`
// is the word the latest right or given-away guess resolved. ----
const cnwRead = (P) => {
  const end = P.w.length - 1;
  const w = P.w.map((word, i) => ({ i, word, state: i === 0 || i === end ? 'end' : 'hidden', shown: i === 0 || i === end ? word.length : 1 }));
  let last = null;
  const g = P.p.map(([guess, k], j) => {
    const x = w[k]; let res;
    if (guess === x.word) { res = 'right'; x.state = 'found'; last = k; }
    else { x.shown += 1; res = x.shown >= x.word.length ? 'given' : 'wrong'; if (res === 'given') { x.state = 'given'; x.shown = x.word.length; last = k; } }
    return { n: j + 1, res };
  });
  const mid = w.slice(1, end);
  const r = P.live ? { kind: 'live', label: 'In progress' } : mid.some((x) => x.state === 'given') ? { kind: 'bad', label: 'Failed' } : { kind: 'ok', label: 'Solved' };
  return { w, g, r, last, mid, found: mid.filter((x) => x.state === 'found').length };
};

// ---- Tiles and joints, as the session page draws them: an end filled light, the letters shown grey, the rest of a found word
// outlined green, a given-away word outlined amber, a hidden word its shown letters then one dashed tile. A word has one tile
// size (--t), set by the concept. `blank` draws n dashed tiles for a word not yet seen. ----
const CnwWord = ({ x, n, cls = '' }) => (n
  ? <span className={'cnw-word ' + cls} aria-hidden="true">{Array.from({ length: n }, (_, j) => <span key={j} className="wd-t cnw-t is-more" />)}</span>
  : x.state === 'hidden'
    ? <span className={'cnw-word ' + cls} role="img" aria-label={'Starts ' + x.word.slice(0, x.shown)}>
      {x.word.slice(0, x.shown).split('').map((ch, j) => <span key={j} className="wd-t cnw-t is-shown" aria-hidden="true">{ch}</span>)}
      <span className="wd-t cnw-t is-more" aria-hidden="true" /></span>
    : <span className={'cnw-word ' + cls} role="img" aria-label={x.word + (x.state === 'given' ? ', given away' : '')}>
      {x.word.split('').map((ch, j) => <span key={j} aria-hidden="true"
        className={'wd-t cnw-t is-' + (x.state === 'end' ? 'end' : x.state === 'given' ? 'given' : j < x.shown ? 'shown' : 'found')}>{ch}</span>)}</span>);
const CnwJoint = () => (
  <span className="cnw-joint" aria-hidden="true"><svg width="22" height="16" viewBox="0 0 22 16"><rect x="1.5" y="1.5" width="12" height="8" rx="4" /><rect x="8.5" y="6.5" width="12" height="8" rx="4" /></svg></span>);

// ---- The guesses as the session page's chain of links, across, each numbered: right a closed green link, wrong a grey link open
// on its side, given away an amber link broken in two. At most CNW_MAX links; earlier ones are counted before the chain. ----
const CNW_W = 16; const CNW_H = 30; const CNW_STEP = CNW_H + 8; const CNW_MAX = 8;
const CNW_GAP = { wrong: 14, given: 8 };
// The dash that opens a rounded link of length len and thickness th: wrong a gap on its side, given away a gap breaking it in two.
const cnwLoop = (res, len, th) => {
  const per = 2 * (len - th) + Math.PI * th; const gap = CNW_GAP[res];
  return res === 'right' ? {} : { strokeDasharray: (res === 'given' ? per / 2 - gap : per - gap) + ' ' + gap, strokeDashoffset: per - gap / 2 - (len - th) / 2 };
};
const CNW_SAY = { right: 'right', wrong: 'wrong', given: 'given away' };
const CnwLinks = ({ g }) => {
  const shown = g.slice(-CNW_MAX); const before = g.length - shown.length; const len = 8 + (shown.length - 1) * CNW_STEP + CNW_H;
  return (
    <span className="cnw-links" role="img" aria-label={g.length + (g.length === 1 ? ' guess: ' : ' guesses: ') + g.map((t) => CNW_SAY[t.res]).join(', ')}>
      {before > 0 && <span className="cnw-more" aria-hidden="true">{'+' + before}</span>}
      <svg width={len} height="48" viewBox={'0 0 ' + len + ' 48'} aria-hidden="true">
        {shown.slice(1).map((t, i) => <line key={'b' + i} className="cnw-bar" x1={4 + i * CNW_STEP + CNW_H} y1={4 + CNW_W / 2} x2={4 + (i + 1) * CNW_STEP} y2={4 + CNW_W / 2} />)}
        {shown.map((t, i) => <rect key={i} x={4 + i * CNW_STEP} y={4} width={CNW_H} height={CNW_W} rx={CNW_W / 2} className={'cnw-loop is-' + t.res} {...cnwLoop(t.res, CNW_H, CNW_W)} />)}
        {shown.map((t, i) => <text key={'n' + i} x={4 + i * CNW_STEP + CNW_H / 2} y="44" textAnchor="middle">{t.n}</text>)}
      </svg>
    </span>);
};

// ---- Counts, as words: found of total, then what the guesses cost: wrong guesses, and words given away. ----
const cnwSaid = (p) => {
  const wrong = p.g.filter((t) => t.res === 'wrong').length; const given = p.g.filter((t) => t.res === 'given').length;
  return [p.found + ' of ' + p.mid.length + ' words', wrong ? wrong + ' wrong' : '', given ? given + ' given away' : ''].filter(Boolean);
};
const CnwCount = ({ p }) => { const [first, ...more] = cnwSaid(p);
  return (
    <span className="cnw-cap" role="img" aria-label={cnwSaid(p).join(', ')}><b aria-hidden="true">{p.found}</b>
      <span aria-hidden="true">{first.slice(String(p.found).length) + more.map((m) => ' \u00B7 ' + m).join('')}</span></span>); };

// A, Route: every word a box in one line across the card, joined, its state by outline (end filled, found green, given away
// amber, hidden dashed with its first letters); a word is one line of text, so every box is one size. On a phone, three to a row,
// the row joined to the next by a joint dropped from its end. The guesses' links and the count under it.
const CnwBox = ({ x }) => (
  <span className={'cnw-box is-' + (x ? x.state : 'blank')} aria-hidden="true">
    {x ? (x.state === 'hidden' ? x.word.slice(0, x.shown) + '\u2009' + '\u00B7'.repeat(x.word.length - x.shown) : x.word) : ''}</span>);
const CnwRoute = ({ w, n }) => {
  const list = w || Array.from({ length: n }, () => null);
  return (
    <div className="cnw-route" role="img" aria-label={w ? w.map((x) => (x.state === 'hidden' ? 'a word starting ' + x.word.slice(0, x.shown) : x.word + (x.state === 'given' ? ' (given away)' : ''))).join(', ') : n + ' words to link'}>
      {list.map((x, i) => <React.Fragment key={i}><CnwBox x={x} />{i < list.length - 1 && <CnwJoint />}</React.Fragment>)}</div>);
};
const CnwA = ({ p }) => (
  <div className="cnw-pic cnw-stack"><CnwRoute w={p.w} /><div className="cnw-under">{p.g.length > 0 && <CnwLinks g={p.g} />}<CnwCount p={p} /></div></div>);

// B, Today's link: one word large and centred: the latest word found (the first after the start, still hidden, before any); on
// a failed chain the word that broke; on a solved one the two ends with the words between them collapsed to joints. Under it
// the guesses' links and the count.
const CnwB = ({ p }) => {
  const solved = p.r.kind === 'ok'; const k = p.last == null ? 1 : p.last; const x = p.w[k];
  return (
    <div className="cnw-pic cnw-stack">
      {solved
        ? <div className="cnw-focus is-ends"><CnwWord x={p.w[0]} /><span className="cnw-joints" role="img" aria-label={p.mid.length + ' words between'}>{p.mid.map((m) => <CnwJoint key={m.i} />)}</span><CnwWord x={p.w[p.w.length - 1]} /></div>
        : <div className="cnw-focus"><CnwWord x={x} /></div>}
      <div className="cnw-under">{p.g.length > 0 && <CnwLinks g={p.g} />}<CnwCount p={p} /></div>
    </div>);
};

// C, Two ends: the two end words at the edges, the words between as tiles of the same size on a line from one to the other:
// found outlined green with the word's first letter, not yet found dashed, given away outlined amber. A phone stacks them: the
// first end, the nodes spread across, the last end at the right.
const CnwNode = ({ x }) => (
  <span className={'wd-t cnw-t ' + (x && x.state === 'found' ? 'is-found' : x && x.state === 'given' ? 'is-given' : 'is-more')} aria-hidden="true">
    {x && x.state !== 'hidden' ? x.word[0] : ''}</span>);
const CnwC = ({ p, fresh }) => {
  const first = p.w[0]; const last = p.w[p.w.length - 1];
  return (
    <div className="cnw-pic cnw-stack">
      <div className="cnw-ends" role="img" aria-label={(fresh ? 'The two end words, not yet seen' : first.word + ' to ' + last.word) + ', ' + p.mid.length + ' words between'}>
        {fresh ? <CnwWord n={4} cls="is-first" /> : <CnwWord x={first} cls="is-first" />}
        <span className="cnw-mid">{p.mid.map((x) => <CnwNode key={x.i} x={fresh ? null : x} />)}</span>
        {fresh ? <CnwWord n={5} cls="is-last" /> : <CnwWord x={last} cls="is-last" />}
      </div>
      <CnwCount p={p} />
    </div>);
};

// Not yet played: each concept's picture, empty, so nothing of today's words shows before Play.
const CNW_FRESH_PLAY = { w: ['', '', '', '', '', ''].map((_, i) => ({ i, word: '', state: i === 0 || i === 5 ? 'end' : 'hidden', shown: 0 })), g: [], r: { kind: 'live' }, last: null, found: 0 };
CNW_FRESH_PLAY.mid = CNW_FRESH_PLAY.w.slice(1, 5);
const CnwFresh = ({ dir }) => (dir === 'c1' ? <div className="cnw-pic cnw-stack"><CnwRoute n={6} /><span className="cnw-cap">No guesses yet</span></div>
  : dir === 'c2' ? <div className="cnw-pic cnw-stack"><div className="cnw-focus"><CnwWord n={5} /></div><div className="cnw-under"><CnwCount p={CNW_FRESH_PLAY} /></div></div>
    : <CnwC p={CNW_FRESH_PLAY} fresh />);

const CNW_PIC = { c1: CnwA, c2: CnwB, c3: CnwC };

// Replaces Chain's now card under ?pg=chain-now; the Concept setting picks the picture, the Play setting the play.
const CnwCard = ({ c }) => {
  const gs = useGs(); const dir = usePgSetting('dir'); const play = usePgSetting('play');
  const title = '#' + GS_SESSIONS[c.today].number;
  if (play === 'fresh') return (
    <LbNowCard gid="chain" title={title} play={() => gs.playReq({ kind: 'edition', e: edList(gs, 'chain')[0] })} next={c.next} className={'cnw cnw-' + dir}>
      <CnwFresh dir={dir} />
    </LbNowCard>);
  const p = cnwRead(CNW_PLAYS[play]); const Pic = CNW_PIC[dir];
  // A failed today has no session of its own in canon: Go to session opens an earlier failed Chain.
  const sid = play === 'live' ? c.liveSid : play === 'solved' ? c.today
    : Object.keys(GS_SESSIONS).find((k) => GS_SESSIONS[k].gid === 'chain' && / found/.test(GS_SESSIONS[k].result || '')) || c.today;
  return (
    <LbNowCard gid="chain" title={title} result={p.r} open={() => gs.go('session', { id: sid })} next={c.next} className={'cnw cnw-' + dir}>
      <Pic p={p} />
    </LbNowCard>);
};

export const initPlaygroundChainNow = () => {
  pgRegister('chain-now', { title: 'Chain now card', settings: [
    { key: 'dir', label: 'Concept', options: [{ value: 'c1', label: 'A Route' }, { value: 'c2', label: "B Today's link" }, { value: 'c3', label: 'C Two ends' }] },
    { key: 'play', label: 'Play', options: [
      { value: 'fresh', label: 'Not yet played', state: 'library-chain', go: (gs) => gs.setReview({ never: 'chain' }) },
      { value: 'live', label: 'In progress', state: 'library-chain-in-progress' },
      { value: 'solved', label: 'Solved', state: 'library-chain' },
      { value: 'failed', label: 'Failed', state: 'library-chain' }] },
  ] });
  if (cnwHere()) GS_NOW.chain = CnwCard;
};
