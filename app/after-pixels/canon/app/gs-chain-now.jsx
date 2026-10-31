// ============================================================================
// After Pixels — Chain's now card on its library game page (1236), on the shared frame (LbNowCard) in the session page's language
// (gs-chain.jsx): letter tiles, link joints between words, and the guesses as a numbered chain of links. Today's link: one word
// large and centred, the guesses' links under it, the count of words found beside them (under them on a phone). The picture is
// always centred in the card's height. PzNow (gs-pass-library.jsx) shows it for Chain. Styles: app/gs-chain-now.css.
// ============================================================================
import React from 'react';
import { useGs, GS_SESSIONS } from './gs-data.jsx';
import { LbNowCard } from './gs-library.jsx';
import { edList } from './gs-history.jsx';
import { CH_FAIL, CH_HARD } from './gs-where-chain-salvage.jsx';

// ---- The model, replayed the engine's way (as gs-chain.jsx): each word starts with one letter shown, a wrong guess shows one
// more, and a word whose shown letters would reach its length is given away. Per word its state; per guess its result; `last`
// is the word the latest right or given-away guess resolved. ----
const cnRead = (P, live) => {
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
  const r = live ? { kind: 'live', label: 'In progress' } : mid.some((x) => x.state === 'given') ? { kind: 'bad', label: 'Failed' } : { kind: 'ok', label: 'Solved' };
  return { w, g, r, last, mid, found: mid.filter((x) => x.state === 'found').length };
};

// ---- Tiles and joints, as the session page draws them: an end filled light, the letters shown grey, the rest of a found word
// outlined green, a given-away word outlined amber, a hidden word its shown letters then one dashed tile. `n` draws n dashed
// tiles for a word not yet seen. ----
const CnWord = ({ x, n }) => (n
  ? <span className="cn-word" aria-hidden="true">{Array.from({ length: n }, (_, j) => <span key={j} className="wd-t cn-t is-more" />)}</span>
  : x.state === 'hidden'
    ? <span className="cn-word" role="img" aria-label={'Starts ' + x.word.slice(0, x.shown)}>
      {x.word.slice(0, x.shown).split('').map((ch, j) => <span key={j} className="wd-t cn-t is-shown" aria-hidden="true">{ch}</span>)}
      <span className="wd-t cn-t is-more" aria-hidden="true" /></span>
    : <span className="cn-word" role="img" aria-label={x.word + (x.state === 'given' ? ', given away' : '')}>
      {x.word.split('').map((ch, j) => <span key={j} aria-hidden="true"
        className={'wd-t cn-t is-' + (x.state === 'end' ? 'end' : x.state === 'given' ? 'given' : j < x.shown ? 'shown' : 'found')}>{ch}</span>)}</span>);
const CnJoint = () => (
  <span className="cn-joint" aria-hidden="true"><svg width="22" height="16" viewBox="0 0 22 16"><rect x="1.5" y="1.5" width="12" height="8" rx="4" /><rect x="8.5" y="6.5" width="12" height="8" rx="4" /></svg></span>);

// ---- The guesses as the session page's chain of links, across, each numbered: right a closed green link, wrong a grey link open
// on its side, given away an amber link broken in two. ----
const CN_W = 16; const CN_H = 30; const CN_STEP = CN_H + 8;
const CN_GAP = { wrong: 14, given: 8 };
// The dash that opens a rounded link of length len and thickness th: wrong a gap on its side, given away a gap breaking it in two.
const cnLoop = (res, len, th) => {
  const per = 2 * (len - th) + Math.PI * th; const gap = CN_GAP[res];
  return res === 'right' ? {} : { strokeDasharray: (res === 'given' ? per / 2 - gap : per - gap) + ' ' + gap, strokeDashoffset: per - gap / 2 - (len - th) / 2 };
};
const CN_SAY = { right: 'right', wrong: 'wrong', given: 'given away' };
const CnLinkRow = ({ items }) => {
  const len = 8 + (items.length - 1) * CN_STEP + CN_H;
  return (
    <svg width={len} height="48" viewBox={'0 0 ' + len + ' 48'} aria-hidden="true">
      {items.slice(1).map((t, i) => <line key={'b' + i} className="cn-bar" x1={4 + i * CN_STEP + CN_H} y1={4 + CN_W / 2} x2={4 + (i + 1) * CN_STEP} y2={4 + CN_W / 2} />)}
      {items.map((t, i) => <rect key={i} x={4 + i * CN_STEP} y={4} width={CN_H} height={CN_W} rx={CN_W / 2} className={'cn-loop is-' + t.res} {...cnLoop(t.res, CN_H, CN_W)} />)}
      {items.map((t, i) => <text key={'n' + i} x={4 + i * CN_STEP + CN_H / 2} y="44" textAnchor="middle">{t.n}</text>)}
    </svg>);
};
const cnFold = (g, per) => { const rows = Math.ceil(g.length / per); const size = Math.ceil(g.length / rows); const out = [];
  for (let i = 0; i < g.length; i += size) out.push(g.slice(i, i + size));
  return out; };
// KEEP: the links fold into balanced rows, so no link shrinks and none stands alone: the card's width fixes how many links a row
// holds (beside the count on desktop, the count's width taken off), and the rows share the guesses as evenly as they can (a hard
// day of 20+ guesses is two or three rows). The numbers run on across rows. Measured, so it follows the card's width.
const CnLinks = ({ g }) => {
  const ref = React.useRef(null); const [per, setPer] = React.useState(8);
  React.useLayoutEffect(() => {
    const me = ref.current; const pic = me.closest('.cn-pic'); if (!pic) return undefined;
    const fit = () => { let room = pic.clientWidth; const par = me.parentElement;
      if (getComputedStyle(par).flexDirection === 'row') room -= [...par.children].filter((c) => c !== me).reduce((n, c) => n + c.offsetWidth + 24, 0);
      setPer(Math.max(1, Math.floor((room - 8 - CN_H) / CN_STEP) + 1)); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(pic); return () => ro.disconnect();
  }, []);
  return (
    <span ref={ref} className="cn-links" role="img" aria-label={g.length + (g.length === 1 ? ' guess: ' : ' guesses: ') + g.map((t) => CN_SAY[t.res]).join(', ')}>
      {cnFold(g, per).map((row, r) => <CnLinkRow key={r} items={row} />)}
    </span>);
};

// The count of words found: a bold figure, then a muted "of N words".
const CnCount = ({ p }) => (
  <span className="cn-cap" role="img" aria-label={p.found + ' of ' + p.mid.length + ' words'}><b aria-hidden="true">{p.found}</b><span aria-hidden="true">{' of ' + p.mid.length + ' words'}</span></span>);

// One word large and centred: the latest word found (the first after the start, still hidden, before any); on a failed chain the
// word that broke; on a solved one the two ends with the words between them collapsed to joints. Under it the guesses' links and
// the count.
const CnPic = ({ p }) => {
  const solved = p.r.kind === 'ok'; const k = p.last == null ? 1 : p.last; const x = p.w[k];
  return (
    <div className="cn-pic cn-stack">
      {solved
        ? <div className="cn-focus is-ends"><CnWord x={p.w[0]} /><span className="cn-joints" role="img" aria-label={p.mid.length + ' words between'}>{p.mid.map((m) => <CnJoint key={m.i} />)}</span><CnWord x={p.w[p.w.length - 1]} /></div>
        : <div className="cn-focus"><CnWord x={x} /></div>}
      <div className="cn-under">{p.g.length > 0 && <CnLinks g={p.g} />}<CnCount p={p} /></div>
    </div>);
};

// Not yet played: the picture empty, so nothing of today's words shows before Play.
const CN_FRESH = { found: 0, mid: [0, 1, 2, 3] };
const CnFresh = () => (
  <div className="cn-pic cn-stack"><div className="cn-focus"><CnWord n={5} /></div><div className="cn-under"><CnCount p={CN_FRESH} /></div></div>);

// Config's review.chain stages a failed or a hard day (the library-chain-failed and library-chain-hard states): neither is a session of
// its own in canon, so Go to session opens an earlier failed Chain.
const cnStaged = (k) => ({ failed: CH_FAIL, hard: CH_HARD })[k]; // read at render: the plays are set when gs-where-chain-salvage.jsx's init runs
export const ChNow = ({ c, done, none }) => {
  const gs = useGs(); const staged = cnStaged(gs.review.chain);
  const title = '#' + GS_SESSIONS[c.today].number;
  if (none) return (
    <LbNowCard gid="chain" title={title} play={() => gs.playReq({ kind: 'edition', e: edList(gs, 'chain')[0] })} next={c.next} className="cn">
      <CnFresh />
    </LbNowCard>);
  const sid = staged ? Object.keys(GS_SESSIONS).find((k) => GS_SESSIONS[k].gid === 'chain' && / found/.test(GS_SESSIONS[k].result || '')) || c.today : done ? c.today : c.liveSid;
  const s = GS_SESSIONS[sid]; const p = cnRead(staged || s.play, !staged && !done);
  return (
    <LbNowCard gid="chain" title={title} result={p.r} open={() => gs.go('session', { id: sid })} next={c.next} className="cn">
      <CnPic p={p} />
    </LbNowCard>);
};
