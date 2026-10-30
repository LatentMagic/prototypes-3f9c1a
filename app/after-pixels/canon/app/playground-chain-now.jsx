// ============================================================================
// PLAYGROUND, not canon (branch candidate/chain-now-lofi): three low-fi concepts for Chain's now card on its library game page,
// built on the shared frame (LbNowCard) in the session page's language (candidate/chain-session-lofi, gs-chain.jsx): letter
// tiles, link joints between words, and the guesses as a numbered chain of links. 1: the whole chain, small. 2: the last word
// resolved, big, between its neighbours, over the guesses. 3: the guesses as the picture, with the words found. Open with
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
// outlined green, a given-away word outlined amber, a hidden word its shown letters then one dashed tile. ----
const CnwWord = ({ x, cls = '' }) => (x.state === 'hidden'
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
const CNW_P = 2 * (CNW_H - CNW_W) + Math.PI * CNW_W;
const CNW_GAP = { wrong: 14, given: 8 };
const cnwDash = (res) => (res === 'right' ? undefined : res === 'given' ? (CNW_P / 2 - CNW_GAP.given) + ' ' + CNW_GAP.given : (CNW_P - CNW_GAP[res]) + ' ' + CNW_GAP[res]);
const cnwOffset = (res) => (res === 'right' ? undefined : CNW_P - CNW_GAP[res] / 2 - (CNW_H - CNW_W) / 2);
const CNW_SAY = { right: 'right', wrong: 'wrong', given: 'given away' };
const CnwLinks = ({ g }) => {
  const shown = g.slice(-CNW_MAX); const before = g.length - shown.length; const len = 8 + (shown.length - 1) * CNW_STEP + CNW_H;
  return (
    <span className="cnw-links" role="img" aria-label={g.length + (g.length === 1 ? ' guess: ' : ' guesses: ') + g.map((t) => CNW_SAY[t.res]).join(', ')}>
      {before > 0 && <span className="cnw-more" aria-hidden="true">{'+' + before}</span>}
      <svg width={len} height="48" viewBox={'0 0 ' + len + ' 48'} aria-hidden="true">
        {shown.slice(1).map((t, i) => <line key={'b' + i} className="cnw-bar" x1={4 + i * CNW_STEP + CNW_H} y1={4 + CNW_W / 2} x2={4 + (i + 1) * CNW_STEP} y2={4 + CNW_W / 2} />)}
        {shown.map((t, i) => <rect key={i} x={4 + i * CNW_STEP} y={4} width={CNW_H} height={CNW_W} rx={CNW_W / 2} className={'cnw-loop is-' + t.res}
          strokeDasharray={cnwDash(t.res)} strokeDashoffset={cnwOffset(t.res)} />)}
        {shown.map((t, i) => <text key={'n' + i} x={4 + i * CNW_STEP + CNW_H / 2} y="44" textAnchor="middle">{t.n}</text>)}
      </svg>
    </span>);
};

// ---- The words found: one square per word between the ends, outlined green when found, amber when given away, dashed while
// hidden, and the count under them (as Guess's ring carries its count). ----
const CnwFound = ({ p }) => (
  <span className="cnw-found" role="img" aria-label={p.found + ' of ' + p.mid.length + ' words found'}>
    <span className="cnw-sq-row" aria-hidden="true">{p.mid.map((x) => <span key={x.i} className={'cnw-sq is-' + x.state} />)}</span>
    <span className="cnw-cap" aria-hidden="true"><b>{p.found}</b>{' of ' + p.mid.length + ' words'}</span>
  </span>);

// ---- Not yet played, every concept: one dashed tile per word, joined, so nothing of today's words shows before Play. ----
const CnwFresh = ({ n }) => (
  <div className="cnw-pic cnw-line" role="img" aria-label={n + ' words to link'}>
    {Array.from({ length: n }, (_, i) => <React.Fragment key={i}><span className="cnw-word" aria-hidden="true"><span className="wd-t cnw-t is-more" /></span>{i < n - 1 && <CnwJoint />}</React.Fragment>)}
  </div>);

// 1: the whole chain, small: every word in its state, joined, in rows that fit the card (a word is never split). A row that
// carries on ends with its joint, and starts with an empty joint's width so it stays centred.
const cnwTiles = (x) => (x.state === 'hidden' ? x.shown + 1 : x.word.length);
const cnwRows = (w, room) => w.reduce((rows, x) => {
  const row = rows[rows.length - 1]; const need = cnwTiles(x) * 26 + 22;
  if (row.length && row.px + need > room) rows.push(Object.assign([x], { px: need })); else { row.push(x); row.px += need; }
  return rows;
}, [Object.assign([], { px: 0 })]);
const CnwRows = ({ p, room, cls }) => { const rows = cnwRows(p.w, room);
  return (
    <div className={'cnw-rows ' + cls} aria-hidden="true">{rows.map((row, r) => (
      <div key={r} className="cnw-line">
        {r < rows.length - 1 && <span className="cnw-joint" />}
        {row.map((x, i) => <React.Fragment key={x.i}><CnwWord x={x} />{(i < row.length - 1 || r < rows.length - 1) && <CnwJoint />}</React.Fragment>)}
      </div>))}</div>);
};
const Cnw1 = ({ p }) => (
  <div className="cnw-pic" role="img" aria-label={p.w.map((x) => (x.state === 'hidden' ? 'a word starting ' + x.word.slice(0, x.shown) : x.word + (x.state === 'given' ? ' (given away)' : ''))).join(', ')}>
    <CnwRows p={p} room={480} cls="is-wide" /><CnwRows p={p} room={270} cls="is-narrow" /></div>);

// 2: the last link: the word the latest guess resolved in big tiles between its neighbours (small), and the guesses. From
// 600px the guesses sit in the head's row between the title and the result, the three words under them; on a phone, a column.
// Before any word is resolved, the first word after the start stands in.
const Cnw2 = ({ p }) => {
  const k = p.last == null ? 1 : p.last; const next = p.w[k + 1];
  return <>
    <div className="cnw-pic cnw-three"><CnwWord x={p.w[k - 1]} /><CnwJoint /><CnwWord x={p.w[k]} cls="is-big" /><CnwJoint />{next && <CnwWord x={next} />}</div>
    <CnwLinks g={p.g} />
  </>;
};

// 3: the guesses: the chain of links as the picture, the words found beside it.
const Cnw3 = ({ p }) => (
  <div className="cnw-pic cnw-duo">{p.g.length > 0 && <CnwLinks g={p.g} />}<CnwFound p={p} /></div>);

const CNW_PIC = { c1: Cnw1, c2: Cnw2, c3: Cnw3 };

// Replaces Chain's now card under ?pg=chain-now; the Play setting picks the play, the Concept setting the picture.
const CnwCard = ({ c }) => {
  const gs = useGs(); const dir = usePgSetting('dir'); const play = usePgSetting('play');
  const title = '#' + GS_SESSIONS[c.today].number;
  if (play === 'fresh') return (
    <LbNowCard gid="chain" title={title} play={() => gs.playReq({ kind: 'edition', e: edList(gs, 'chain')[0] })} next={c.next} className={'cnw cnw-' + dir}>
      <CnwFresh n={CNW_TODAY.w.length} />
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
    { key: 'dir', label: 'Concept', options: [{ value: 'c1', label: '1 Whole chain' }, { value: 'c2', label: '2 Last link' }, { value: 'c3', label: '3 Guesses' }] },
    { key: 'play', label: 'Play', options: [
      { value: 'fresh', label: 'Not yet played', state: 'library-chain', go: (gs) => gs.setReview({ never: 'chain' }) },
      { value: 'live', label: 'In progress', state: 'library-chain-in-progress' },
      { value: 'solved', label: 'Solved', state: 'library-chain' },
      { value: 'failed', label: 'Failed', state: 'library-chain' }] },
  ] });
  if (cnwHere()) GS_NOW.chain = CnwCard;
};
