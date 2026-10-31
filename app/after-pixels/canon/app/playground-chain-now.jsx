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
  // A hard day: Chain has no guess limit, so seven words (five hidden) can take 21 guesses: three words found, two given away.
  hard: { w: ['SNOW', 'BALL', 'ROOM', 'SERVICE', 'STATION', 'TRAIN', 'WAGON'], p: [['BELL', 1], ['BULL', 1], ['BAIL', 1], ['BALL', 1], ['ROAM', 2], ['ROOF', 2], ['ROBE', 2],
    ['SERVER', 3], ['SURVEY', 3], ['SURFACE', 3], ['SERVING', 3], ['SERVANT', 3], ['SEVERE', 3], ['STATE', 4], ['STAGE', 4], ['STATUS', 4], ['STATIC', 4], ['STATION', 4],
    ['TRAM', 5], ['TRAIL', 5], ['TRAIN', 5]] },
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
const CnwJoint = ({ cls = '' }) => (
  <span className={'cnw-joint ' + cls} aria-hidden="true"><svg width="22" height="16" viewBox="0 0 22 16"><rect x="1.5" y="1.5" width="12" height="8" rx="4" /><rect x="8.5" y="6.5" width="12" height="8" rx="4" /></svg></span>);

// ---- The guesses as the session page's chain of links, across, each numbered: right a closed green link, wrong a grey link open
// on its side, given away an amber link broken in two. ----
const CNW_W = 16; const CNW_H = 30; const CNW_STEP = CNW_H + 8;
const CNW_GAP = { wrong: 14, given: 8 };
// The dash that opens a rounded link of length len and thickness th: wrong a gap on its side, given away a gap breaking it in two.
const cnwLoop = (res, len, th) => {
  const per = 2 * (len - th) + Math.PI * th; const gap = CNW_GAP[res];
  return res === 'right' ? {} : { strokeDasharray: (res === 'given' ? per / 2 - gap : per - gap) + ' ' + gap, strokeDashoffset: per - gap / 2 - (len - th) / 2 };
};
const CNW_SAY = { right: 'right', wrong: 'wrong', given: 'given away' };
// Folded into balanced rows so no link shrinks and none stands alone: the card's width fixes how many links a row holds, the rows
// share the guesses as evenly as they can (a hard day of 20+ guesses is two or three rows). The numbers run on across rows.
const CnwLinkRow = ({ items }) => {
  const len = 8 + (items.length - 1) * CNW_STEP + CNW_H;
  return (
    <svg width={len} height="48" viewBox={'0 0 ' + len + ' 48'} aria-hidden="true">
      {items.slice(1).map((t, i) => <line key={'b' + i} className="cnw-bar" x1={4 + i * CNW_STEP + CNW_H} y1={4 + CNW_W / 2} x2={4 + (i + 1) * CNW_STEP} y2={4 + CNW_W / 2} />)}
      {items.map((t, i) => <rect key={i} x={4 + i * CNW_STEP} y={4} width={CNW_H} height={CNW_W} rx={CNW_W / 2} className={'cnw-loop is-' + t.res} {...cnwLoop(t.res, CNW_H, CNW_W)} />)}
      {items.map((t, i) => <text key={'n' + i} x={4 + i * CNW_STEP + CNW_H / 2} y="44" textAnchor="middle">{t.n}</text>)}
    </svg>);
};
const cnwFold = (g, per) => { const rows = Math.ceil(g.length / per); const size = Math.ceil(g.length / rows); const out = [];
  for (let i = 0; i < g.length; i += size) out.push(g.slice(i, i + size));
  return out; };
const CnwLinks = ({ g }) => {
  const ref = React.useRef(null); const [per, setPer] = React.useState(8);
  React.useLayoutEffect(() => {
    const me = ref.current; const pic = me.closest('.cnw-pic'); if (!pic) return undefined;
    const fit = () => { let room = pic.clientWidth; const par = me.parentElement;
      if (par.classList.contains('cnw-under') && getComputedStyle(par).flexDirection === 'row') room -= [...par.children].filter((c) => c !== me).reduce((n, c) => n + c.offsetWidth + 24, 0);
      setPer(Math.max(1, Math.floor((room - 8 - CNW_H) / CNW_STEP) + 1)); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(pic); return () => ro.disconnect();
  }, []);
  return (
    <span ref={ref} className="cnw-links" role="img" aria-label={g.length + (g.length === 1 ? ' guess: ' : ' guesses: ') + g.map((t) => CNW_SAY[t.res]).join(', ')}>
      {cnwFold(g, per).map((row, r) => <CnwLinkRow key={r} items={row} />)}
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
// the row joined to the next by a joint dropped from its end. The guesses' links under it.
// The unfound word's look (the Unfound setting): dashed the first letters then dots; session the session page's tiles, the letters shown
// grey and one dashed tile for the rest; link an open link with the first letter; unlit a dark empty slot with the first letter.
const CNW_LW = 56; const CNW_LH = 28;
const CnwOpenLink = ({ ch, w = CNW_LW, h = CNW_LH }) => (
  <svg className="cnw-lk" width={w + 4} height={h + 4} viewBox={'0 0 ' + (w + 4) + ' ' + (h + 4)} aria-hidden="true">
    <rect x="2" y="2" width={w} height={h} rx={h / 2} className="cnw-loop is-wrong" {...cnwLoop('wrong', w, h)} />
    {ch && <text x={(w + 4) / 2} y={h / 2 + 7} textAnchor="middle">{ch}</text>}</svg>);
const cnwUnfound = (x, unf) => {
  const letters = x ? x.word.slice(0, x.shown) : '';
  if (unf === 'session') return <span className="cnw-ses">{letters.split('').filter(Boolean).map((ch, j) => <span key={j} className="wd-t cnw-st is-shown">{ch}</span>)}<span className="wd-t cnw-st is-more" /></span>;
  if (unf === 'link') return <CnwOpenLink ch={letters[0]} />;
  if (unf === 'unlit') return letters[0] || '';
  return letters ? letters + '\u2009' + '\u00B7'.repeat(x.word.length - x.shown) : '';
};
const CnwBox = ({ x, unf, out, back }) => { const hid = !x || x.state === 'hidden';
  return (
    <span className={'cnw-box is-' + (x ? x.state : 'blank') + (hid ? ' is-unf-' + unf : '')} aria-hidden="true">
      {back && <CnwJoint cls="cnw-stub is-in" />}
      {hid ? cnwUnfound(x, unf) : x.word}
      {out && <CnwJoint cls="cnw-stub is-out" />}</span>); };
// Fit (a phone, one line): every word one square tile of one size; the ends their first three letters, the words between their first
// letter in their state.
const CnwTile = ({ x, end, unf }) => {
  if (!x) return <span className="wd-t cnw-t is-more" />;
  if (end) return <span className="wd-t cnw-t is-end is-three">{x.word.slice(0, 3)}</span>;
  if (x.state === 'hidden' && unf === 'link') return <CnwOpenLink ch={x.word[0]} w={34} h={26} />;
  const cls = x.state === 'found' ? 'is-found' : x.state === 'given' ? 'is-given' : unf === 'session' ? 'is-shown' : unf === 'unlit' ? 'is-unlit' : 'is-more is-dim';
  return <span className={'wd-t cnw-t ' + cls}>{x.word[0]}</span>;
};
// Balanced (a phone): rows of at most four words, shared as evenly as they go (5 is 3+2, 7 is 4+3), each box as wide as its word; a full
// row stretches across, a short last row stays at the right so the last end is bottom-right. A row that would not fit at its words' width
// falls back to fit's compact tiles. Widths are measured from the text (canvas), at the box's 13px.
const cnwTextW = (txt, fam) => { const g = cnwTextW.g || (cnwTextW.g = document.createElement('canvas').getContext('2d'));
  g.font = '600 13px ' + fam; g.letterSpacing = '0.39px'; return g.measureText(txt.toUpperCase()).width; };
const cnwBoxW = (x, unf, fam) => {
  if (x && x.state !== 'hidden') return cnwTextW(x.word, fam) + 20;
  if (unf === 'session') return ((x ? x.shown : 0) + 1) * 28 + 20;
  if (unf === 'link') return 64;
  const t = x ? x.word.slice(0, x.shown) + (unf === 'dashed' ? ' ' + '\u00B7'.repeat(x.word.length - x.shown) : '') : '';
  return Math.max(56, cnwTextW(t, fam) + 20);
};
const CnwBalanced = ({ list, unf }) => {
  const ref = React.useRef(null); const [room, setRoom] = React.useState(0); const [fam, setFam] = React.useState('sans-serif');
  React.useLayoutEffect(() => {
    const pic = ref.current.closest('.cnw-pic'); const fit = () => { setRoom(pic.clientWidth); setFam(getComputedStyle(pic).fontFamily); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(pic); return () => ro.disconnect();
  }, []);
  const last = list.length - 1; const rows = cnwFold(list.map((x, i) => ({ x, i })), 4);
  return (
    <div ref={ref} className="cnw-bal" aria-hidden="true">{rows.map((row, r) => {
      const tight = room > 0 && row.reduce((n, { x }) => n + cnwBoxW(x, unf, fam), 0) + (row.length - 1) * 22 > room;
      const more = r < rows.length - 1; const short = r === rows.length - 1 && row.length < rows[0].length;
      if (tight) return (
        <div key={r} className="cnw-bal-row is-tight" style={{ '--n': row.length + (r > 0) + more }}>
          {r > 0 && <CnwJoint />}
          {row.map(({ x, i }, k) => <React.Fragment key={i}><CnwTile x={x} end={x && (i === 0 || i === last)} unf={unf} />{(k < row.length - 1 || more) && <CnwJoint />}</React.Fragment>)}</div>);
      return (
        <div key={r} className={'cnw-bal-row' + (short ? ' is-short' : ' is-full')}>
          {row.map(({ x, i }, k) => <React.Fragment key={i}><CnwBox x={x} unf={unf} out={more && k === row.length - 1} back={r > 0 && k === 0} />{k < row.length - 1 && <CnwJoint />}</React.Fragment>)}</div>);
    })}</div>);
};
// Phone layouts (the Wrap setting), all drawn and shown by css: rows three to a row with joint stubs at the break; down one word per
// row; fit one line of tiles; bend two rows as one chain, the second running right to left, joined at the turn.
const CnwRoute = ({ w, n, unf }) => {
  const list = w || Array.from({ length: n }, () => null); const last = list.length - 1;
  const rows = []; list.forEach((x, i) => { if (i % 3 === 0) rows.push([]); rows[rows.length - 1].push({ x, i }); });
  return <>
    <div className="cnw-route" role="img" aria-label={w ? w.map((x) => (x.state === 'hidden' ? 'a word starting ' + x.word.slice(0, x.shown) : x.word + (x.state === 'given' ? ' (given away)' : ''))).join(', ') : n + ' words to link'}>
      {list.map((x, i) => <React.Fragment key={i}>
        <CnwBox x={x} unf={unf} out={i % 3 === 2 && i < last} back={i % 3 === 0 && i > 0} />
        {i < last && <CnwJoint cls={i % 3 === 2 ? 'is-brk' : ''} />}</React.Fragment>)}</div>
    <div className="cnw-bend" aria-hidden="true">{rows.map((row, r) => <React.Fragment key={r}>
      <div className={'cnw-bend-row' + (r % 2 ? ' is-rev' : '')}>{row.map(({ x, i }, k) => <React.Fragment key={i}><CnwBox x={x} unf={unf} />{k < row.length - 1 && <CnwJoint />}</React.Fragment>)}</div>
      {r < rows.length - 1 && <div className={'cnw-turn' + (r % 2 ? ' is-left' : '')}><CnwJoint /></div>}</React.Fragment>)}</div>
    <CnwBalanced list={list} unf={unf} />
    <div className="cnw-fit" aria-hidden="true" style={{ '--n': list.length }}>{list.map((x, i) => <React.Fragment key={i}>
      <CnwTile x={x} end={x && (i === 0 || i === last)} unf={unf} />{i < last && <CnwJoint />}</React.Fragment>)}</div>
  </>;
};
const CnwA = ({ p, unf }) => (
  <div className="cnw-pic cnw-stack"><CnwRoute w={p.w} unf={unf} />{p.g.length > 0 && <CnwLinks g={p.g} />}</div>);

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
const CnwFresh = ({ dir, unf }) => (dir === 'c1' ? <div className="cnw-pic cnw-stack"><CnwRoute n={6} unf={unf} /><span className="cnw-cap">No guesses yet</span></div>
  : dir === 'c2' ? <div className="cnw-pic cnw-stack"><div className="cnw-focus"><CnwWord n={5} /></div><div className="cnw-under"><CnwCount p={CNW_FRESH_PLAY} /></div></div>
    : <CnwC p={CNW_FRESH_PLAY} fresh />);

const CNW_PIC = { c1: CnwA, c2: CnwB, c3: CnwC };

// Replaces Chain's now card under ?pg=chain-now; the Concept setting picks the picture, the Play setting the play.
const CnwCard = ({ c }) => {
  const gs = useGs(); const dir = usePgSetting('dir'); const play = usePgSetting('play'); const away = usePgSetting('away'); const wrap = usePgSetting('wrap'); const unf = usePgSetting('unfound');
  const title = '#' + GS_SESSIONS[c.today].number;
  if (play === 'fresh') return (
    <LbNowCard gid="chain" title={title} play={() => gs.playReq({ kind: 'edition', e: edList(gs, 'chain')[0] })} next={c.next} className={'cnw cnw-' + dir + ' cnw-away-' + away + ' cnw-wrap-' + wrap + ' cnw-unf-' + unf}>
      <CnwFresh dir={dir} unf={unf} />
    </LbNowCard>);
  const p = cnwRead(CNW_PLAYS[play]); const Pic = CNW_PIC[dir];
  // A failed today has no session of its own in canon: Go to session opens an earlier failed Chain.
  const sid = play === 'live' ? c.liveSid : play === 'solved' ? c.today
    : Object.keys(GS_SESSIONS).find((k) => GS_SESSIONS[k].gid === 'chain' && / found/.test(GS_SESSIONS[k].result || '')) || c.today;
  return (
    <LbNowCard gid="chain" title={title} result={p.r} open={() => gs.go('session', { id: sid })} next={c.next} className={'cnw cnw-' + dir + ' cnw-away-' + away + ' cnw-wrap-' + wrap + ' cnw-unf-' + unf}>
      <Pic p={p} unf={unf} />
    </LbNowCard>);
};

export const initPlaygroundChainNow = () => {
  pgRegister('chain-now', { title: 'Chain now card', settings: [
    { key: 'dir', label: 'Concept', options: [{ value: 'c1', label: 'A Route' }, { value: 'c2', label: "B Today's link" }, { value: 'c3', label: 'C Two ends' }] },
    { key: 'away', label: 'Given away', options: [{ value: 'amber', label: 'Amber' }, { value: 'grey', label: 'Grey, as Where' }] },
    { key: 'wrap', label: 'Phone wrap (A)', options: [{ value: 'rows', label: 'Rows' }, { value: 'down', label: 'Down' }, { value: 'fit', label: 'Fit one line' }, { value: 'bend', label: 'Bend' }, { value: 'balanced', label: 'Balanced' }] },
    { key: 'unfound', label: 'Unfound (A)', options: [{ value: 'dashed', label: 'Dashed' }, { value: 'session', label: 'Session tiles' }, { value: 'link', label: 'Open link' }, { value: 'unlit', label: 'Unlit' }] },
    { key: 'play', label: 'Play', options: [
      { value: 'fresh', label: 'Not yet played', state: 'library-chain', go: (gs) => gs.setReview({ never: 'chain' }) },
      { value: 'live', label: 'In progress', state: 'library-chain-in-progress' },
      { value: 'solved', label: 'Solved', state: 'library-chain' },
      { value: 'failed', label: 'Failed', state: 'library-chain' },
      { value: 'hard', label: 'Hard day, 21 guesses', state: 'library-chain' }] },
  ] });
  if (cnwHere()) GS_NOW.chain = CnwCard;
};
