// ============================================================================
// PLAYGROUND, not canon (branch candidate/chain-session-lofi): low fi. Chain's card on the session page, on Guess 6a's layout
// (playground-guess-result.jsx, 6a lifted): the full-width card, the result statement top left (white in progress, green solved,
// amber failed), the board as the main element, the guesses figure beside it (under it on a phone). Chain has no hint: the
// letters wrong guesses showed sit on the board. Every surface is drawn from Chain's own world: words joined link to link into
// compounds, worked inward from both ends. Three concepts, each drawing the board and the guesses its own way:
//   1 Linked rows · 2 The chain across · 3 Inward.
// Held the same in all: the card, the result statement, Every guess below the card. Drawn from what the engine holds (per-word
// state, letters shown, tried, order, nearMiss, results[i].wrong), even where the record does not send it yet.
// Grey boxes and placeholder drawing are correct at low fi. Open with ?pg=chain-lofi.
// To remove it: delete this file and playground-chain-lofi.css, and their lines in main.jsx and canon.css.
// ============================================================================
import React from 'react';
import { GS_SESSIONS, GS_RESULT } from './gs-data.jsx';
import { GsMoves } from './gs-session.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_SESSION_BODY } from './registry.js';

// ---- The plays. w: the chain; p: [[guess, index of the word it was for, the link a near miss made]]; links: each joint's
// compound, as the game would say it. Taken from canon's samples (gs-where-chain-salvage.jsx), except the 7-word chain. ----
const ChlTODAY = { w: ['SNOW', 'BALL', 'ROOM', 'SERVICE', 'STATION', 'WAGON'], p: [['BALL', 1], ['RACE', 2], ['ROOM', 2], ['STATION', 4], ['SUITE', 3], ['SERVICE', 3]],
  links: ['snowball', 'ballroom', 'room service', 'service station', 'station wagon'] };
const ChlPLAYS = {
  clean: { w: ['MOON', 'LIGHT', 'HOUSE', 'BOAT', 'YARD'], p: [['LIGHT', 1], ['BOAT', 3], ['HOUSE', 2]], links: ['moonlight', 'lighthouse', 'houseboat', 'boatyard'] },
  today: ChlTODAY,
  failed: { w: ['GOLD', 'FISH', 'BONE', 'DRY', 'CLEAN'], p: [['FINCH', 1], ['FISH', 1], ['DUST', 3], ['DRY', 3], ['BALL', 2], ['BOWL', 2], ['BOAT', 2]],
    links: ['goldfish', 'fishbone', 'bone dry', 'dry clean'] },
  live: { ...ChlTODAY, p: ChlTODAY.p.slice(0, 3), live: true },
  seven: { w: ['SNOW', 'BALL', 'ROOM', 'SERVICE', 'STATION', 'WAGON', 'WHEEL'],
    p: [['BALL', 1], ['ROOM', 2], ['WATER', 5, 'waterwheel'], ['WAGON', 5], ['STATION', 4], ['SERVICE', 3]],
    links: [...ChlTODAY.links, 'wagon wheel'] },
};
const CHL_NUM = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
const chlWrong = (n) => (n === 0 ? 'no wrong guesses' : n === 1 ? '1 wrong guess' : n + ' wrong guesses');

// Replays a play the way the engine does: each word starts with one letter shown; a wrong guess shows one more, and a word
// whose shown letters would reach its length is given away. Returns per-word state (end, found, given, hidden), letters shown,
// tried, wrong, the order words were resolved and from which side, and per-guess results.
const chlRead = (P) => {
  const last = P.w.length - 1;
  const w = P.w.map((word, i) => ({ i, word, state: i === 0 || i === last ? 'end' : 'hidden', shown: i === 0 || i === last ? word.length : 1, tried: [], wrong: 0, rank: null, from: null }));
  const known = (i) => i >= 0 && i <= last && w[i].state !== 'hidden';
  const order = [];
  const g = P.p.map(([guess, k, near], j) => {
    const x = w[k]; const from = known(k - 1) ? 'l' : 'r'; let res;
    if (guess === x.word) { res = 'right'; x.state = 'found'; }
    else { x.wrong += 1; x.shown += 1; res = x.shown >= x.word.length ? 'given' : 'wrong'; if (res === 'given') { x.state = 'given'; x.shown = x.word.length; } }
    if (res !== 'wrong') { order.push(k); x.rank = order.length; x.from = from; }
    const t = { n: j + 1, g: guess, k, res, near: res === 'wrong' && near ? near : null };
    x.tried.push(t); return t;
  });
  w.forEach((x) => { x.open = !!P.live && x.state === 'hidden' && (known(x.i - 1) || known(x.i + 1)); x.openFrom = known(x.i - 1) ? 'l' : 'r'; });
  const given = w.filter((x) => x.state === 'given').length; const wrong = g.filter((t) => t.res !== 'right').length;
  const r = P.live ? { tone: 'live', word: 'In progress' } : given ? { tone: 'bad', word: 'Failed' } : { tone: 'ok', word: 'Solved' };
  const links = P.links.map((l, i) => (known(i) && known(i + 1) ? l : null));
  return { ...P, w, g, order, links, given, wrong, r, hidden: P.w.length - 2, found: w.filter((x) => x.state === 'found').length };
};
// The move list's lines, in canon's wording (dpChain, gs-where-chain-salvage.jsx), so Every guess below each card matches it.
const chlLines = (P) => {
  const p = chlRead(P); const last = P.w.length - 1; const shown = P.w.map(() => 1);
  return [['Ends', P.w[0] + ' to ' + P.w[last], CHL_NUM[P.w.length] + ' words in all'], ...p.g.map((t) => {
    const word = P.w[t.k]; if (t.res !== 'right') shown[t.k] += 1;
    const note = t.res === 'right' ? ['Right'] : t.res === 'given' ? ['Wrong, so it was given away', 'The word was ' + word]
      : [t.near ? 'Wrong, though ' + t.near + ' is a real link' : 'Wrong', 'Now shows ' + word.slice(0, shown[t.k])];
    return ['Guess ' + t.n, t.g, 'Word ' + (t.k + 1), ...note];
  })];
};

// ---- Held the same in every concept: the card, the result statement on top, the board, the panel beside it. ----
const ChlCard = ({ p, board, figure, say, wide }) => (
  <section className={'dv2 chl-card' + (wide ? ' chl-wide' : '')} aria-label="How it went">
    <div className="dv7r-band"><h2 className={'dv7r-word is-' + p.r.tone}>{p.r.word}</h2></div>
    <div className="chl-duo">
      {board}
      <div className="chl-panel"><div className="chl-prow"><span className="chl-cap">Guesses</span>{figure}<span className="chl-say">{say}</span></div></div>
    </div>
  </section>);
const chlSay = (p) => p.g.length + (p.g.length === 1 ? ' guess, ' : ' guesses, ') + p.wrong + ' wrong';
// A word's letters as tiles: an end filled light; the letters shown (the first, then one per wrong guess) filled grey; the rest of
// a found word outlined green; a given-away word outlined amber; a hidden word's shown letters, then one dashed tile for "more".
const ChlTiles = ({ x }) => {
  if (x.state === 'hidden') return (
    <span className="chl-tiles">{x.word.slice(0, x.shown).split('').map((ch, j) => <span key={j} className="chl-t is-shown">{ch}</span>)}
      <span className="chl-t is-more" aria-label="more letters" /></span>);
  return (
    <span className="chl-tiles" aria-label={x.word}>{x.word.split('').map((ch, j) => <span key={j} className={'chl-t is-' + (x.state === 'end' ? 'end' : x.state === 'given' ? 'given' : j < x.shown ? 'shown' : 'found')}>{ch}</span>)}</span>);
};
// One chain link, upright, for a guess: right closed; wrong open; a near miss (wrong, but a real link) half closed; the give-away
// broken in two, amber. Drawn as a rounded loop whose stroke is cut where the link is open; the offset puts the cut on the
// loop's right side (and, for the give-away, its left too), clear of the links it overlaps.
const CHL_LP = 2 * (26 - 14) + Math.PI * 14;
const chlDash = (res, near) => (res === 'right' ? null : res === 'given' ? (CHL_LP / 2 - 7) + ' 7' : near ? (CHL_LP - 5) + ' 5' : (CHL_LP - 13) + ' 13');
// across: the loop lies on its side (26 wide, 14 high), its cut on top.
const ChlLoop = ({ t, x = 3, y = 3, across }) => (
  <rect x={x} y={y} width={across ? 26 : 14} height={across ? 14 : 26} rx="7" className={'chl-loop is-' + (t.near ? 'near' : t.res)}
    strokeDasharray={chlDash(t.res, t.near) || undefined} strokeDashoffset={CHL_LP - (across ? 12.5 : 23.5)} />);

// ---- 1. Linked rows. Board: a row per word, top to bottom, letters as tiles; between rows a small pair of links (no compound
// labels, Joe, round 2). Guesses: a chain, a link per guess in order, across (default) or, on desktop only, hanging down
// (setting `orient`); on a phone always across. ----
const ChlJoint = () => (
  <div className="chl-joint" aria-hidden="true">
    <svg width="16" height="22" viewBox="0 0 16 22"><rect x="1.5" y="1.5" width="8" height="12" rx="4" /><rect x="6.5" y="8.5" width="8" height="12" rx="4" /></svg>
  </div>);
const ChlGuessChain = ({ p, across }) => {
  const len = p.g.length * 20 + 12;
  return (
    <svg className={'chl1-hang ' + (across ? 'is-across' : 'is-down')} width={across ? len : 20} height={across ? 20 : len} viewBox={across ? '0 0 ' + len + ' 20' : '0 0 20 ' + len} role="img" aria-label={chlSay(p)}>
      {p.g.map((t, i) => (across ? <ChlLoop key={i} t={t} across x={3 + i * 20} /> : <ChlLoop key={i} t={t} y={3 + i * 20} />))}
    </svg>);
};
const ChlC1 = ({ p }) => { const down = usePgSetting('orient') === 'v'; return (
  <ChlCard p={p} say={chlSay(p)} figure={<span className={'chl1-fig' + (down ? ' is-down' : '')}><ChlGuessChain p={p} across />{down && <ChlGuessChain p={p} />}</span>} board={
    <div className="chl1-board">{p.w.map((x, i) => (
      <React.Fragment key={i}>
        <div className={'chl1-row is-' + x.state}><ChlTiles x={x} /></div>
        {i < p.w.length - 1 && <ChlJoint />}
      </React.Fragment>))}
    </div>} />); };

// ---- 2. The chain across. Board: each word a link-shaped pill, left to right, joined by a small link, wrapping into rows on a
// phone. Each wrong guess hangs as a small link under the word it was aimed at, its word beside it, so the hard words visibly
// carry more. Guesses: the wrong-guess count as a numeral. ----
const ChlDrop = ({ t }) => (
  <div className={'chl2-drop is-' + (t.near ? 'near' : t.res)}>
    <svg width="14" height="22" viewBox="0 0 20 32" aria-hidden="true"><ChlLoop t={t} /></svg>
    <span>{t.g}{t.near ? ' · ' + t.near : ''}</span>
  </div>);
const ChlC2 = ({ p }) => (
  <ChlCard p={p} say={'of ' + p.g.length + (p.g.length === 1 ? ' guess' : ' guesses')} wide
    figure={<div className="chl2-count"><b>{p.wrong}</b><span>{p.wrong === 1 ? 'wrong guess' : 'wrong guesses'}</span></div>}
    board={<div className="chl2-chain">{p.w.map((x, i) => {
      const misses = x.tried.filter((t) => t.res !== 'right');
      return (
        <div key={i} className="chl2-cell">
          <div className={'chl2-pill is-' + x.state}><ChlTiles x={x} /></div>
          {misses.length > 0 && <div className="chl2-hang">{misses.map((t) => <ChlDrop key={t.n} t={t} />)}</div>}
        </div>); })}
    </div>} />);

// ---- 3. Inward. Board: the chain in one line, both ends anchored, each middle word numbered by the order it was found or given
// (the engine's `order`), with an arrow from the end it was reached from, so the play reads as closing in; in progress, the open
// words marked as the fronts. Guesses: Guess 6a's ring re-drawn as a ring of links, one per guess, wrong ones open; the ring
// closes only when the chain is solved. ----
const ChlArrow = ({ from }) => (
  <svg className={'chl3-arrow is-from-' + from} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1 L8 5 L2 9" /></svg>);
// Round 2 (Joe): the words in concept 1's tiles, joined by its link joints; the order number and arrow kept over each word.
const ChlC3Word = ({ x }) => {
  const label = x.state === 'end' ? 'End' : x.state === 'hidden' ? (x.open ? 'Open' : '') : x.rank;
  return (
    <li className={'chl3-w is-' + x.state + (x.open ? ' is-open' : '')}>
      <span className="chl3-rank">{x.rank != null && <ChlArrow from={x.from} />}{x.open && <ChlArrow from={x.openFrom} />}<span>{label}</span></span>
      <ChlTiles x={x} />
    </li>);
};
const chlArc = (c, R, a0, a1) => 'M ' + (c + R * Math.cos(a0)) + ' ' + (c + R * Math.sin(a0)) + ' A ' + R + ' ' + R + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + (c + R * Math.cos(a1)) + ' ' + (c + R * Math.sin(a1));
// Round 2 (Joe): a fixed link size and step, so neighbouring links always interlock; the ring's circumference follows the number
// of slots (one per guess, plus one empty slot while the ring is open), never the other way round.
const CHL_RING_LINK = 40; const CHL_RING_STEP = 44;
const ChlRing = ({ p }) => {
  const closed = p.r.tone === 'ok'; const slots = p.g.length + (closed ? 0 : 1);
  const R = (slots * CHL_RING_STEP) / (2 * Math.PI); const c = R + 10; const size = 2 * c;
  const span = (2 * Math.PI) / slots; const half = CHL_RING_LINK / 2 / R; const trim = 3 / R; const cut = (px) => px / 2 / R;
  return (
    <div className="chl3-ring" style={{ width: size, height: size }} role="img" aria-label={chlSay(p) + (closed ? ', the ring closed' : ', the ring open')}>
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} aria-hidden="true">
        {p.g.map((t, i) => { const m = -Math.PI / 2 + (i + (closed ? 0 : 1)) * span; const k = t.near ? 'near' : t.res;
          return (
            <g key={i} className={'chl3-link is-' + k}>
              <path d={chlArc(c, R, m - half, m + half)} className="chl3-out" />
              <path d={chlArc(c, R, m - half + trim, m + half - trim)} className="chl3-in" />
              {t.res !== 'right' && <path d={chlArc(c, t.near ? R + 4 : R, m - cut(t.res === 'given' ? 10 : 6), m + cut(t.res === 'given' ? 10 : 6))} className={'chl3-cut' + (t.near ? ' is-half' : '')} />}
            </g>); })}
      </svg>
      <span className="chl3-ring-n" aria-hidden="true"><b style={{ fontSize: Math.round(Math.min(32, R * 0.75)) }}>{p.g.length}</b></span>
    </div>);
};
const ChlC3 = ({ p }) => (
  <ChlCard p={p} say={p.wrong + ' wrong' + (p.r.tone === 'ok' ? ', ring closed' : '')} figure={<ChlRing p={p} />} wide
    board={<ol className="chl3-line">{p.w.map((x, i) => <React.Fragment key={i}>{i > 0 && <li className="chl3-bar"><ChlJoint /></li>}<ChlC3Word x={x} /></React.Fragment>)}</ol>} />);

const ChlCONCEPTS = { c1: ChlC1, c2: ChlC2, c3: ChlC3 };
const ChlBody = () => {
  const c = usePgSetting('c'); const play = usePgSetting('play'); const P = ChlPLAYS[play] || ChlPLAYS.clean; const C = ChlCONCEPTS[c] || ChlC1;
  const s = GS_SESSIONS['pgc-' + play];
  return <><C p={chlRead(P)} />{s && <GsMoves s={s} />}</>;
};

export const initPlaygroundChainLofi = () => {
  // A session per play, so the head and Every guess under the card match the card.
  Object.keys(ChlPLAYS).forEach((k) => { const P = ChlPLAYS[k]; const p = chlRead(P);
    const result = P.live ? 'In progress' : GS_RESULT.chain(p.given ? { given: true, found: p.found, of: p.hidden } : { wrong: p.wrong });
    GS_SESSIONS['pgc-' + k] = { ...GS_SESSIONS[P.live ? 'chain-live' : 'chain-today'], result, share: P.live ? null : result, lines: chlLines(P),
      figures: P.live ? [p.found + ' of ' + p.hidden + ' words', chlWrong(p.wrong).replace(/^./, (ch) => ch.toUpperCase())]
        : [P.w.length + ' words', chlWrong(p.wrong).replace(/^./, (ch) => ch.toUpperCase())] }; });
  const go = (k) => (gs) => gs.go('session', { id: 'pgc-' + k });
  pgRegister('chain-lofi', { title: 'Chain, low fi', settings: [
    { key: 'c', label: 'Concept', options: [{ value: 'c1', label: '1 Linked rows' }, { value: 'c2', label: '2 The chain across' }, { value: 'c3', label: '3 Inward' }] },
    { key: 'orient', label: 'C1 guesses', options: [{ value: 'h', label: 'Horizontal' }, { value: 'v', label: 'Vertical' }] },
    { key: 'play', label: 'Play', options: [
      { value: 'clean', label: 'Solved, none wrong', state: 'session-chain', go: go('clean') },
      { value: 'today', label: 'Solved, 2 wrong', state: 'session-chain', go: go('today') },
      { value: 'failed', label: 'Failed, BONE given', state: 'session-chain', go: go('failed') },
      { value: 'live', label: 'In progress', state: 'session-chain-in-progress', go: go('live') },
      { value: 'seven', label: '7 words, near miss', state: 'session-chain', go: go('seven') }] },
  ] });
  if (pgActive() && new URLSearchParams(window.location.search).get('pg') === 'chain-lofi') GS_SESSION_BODY.chain = ChlBody;
};
