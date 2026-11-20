// ============================================================================
// Hi-fi canvas: three stand-in marks for the hint's square on the Where now card. The square keeps its place beside the globe and its
// caption ("1 hint", "No hint", "Not used yet"), but its picture no longer draws the real direction: it evokes one without being one,
// so a Solved card's last guess is never read as pointing the wrong way. Every card is canon's now card frame (LbNowCard) with Where's own
// parts and canon's CSS (gs-where.css, as on branch candidate/where-now-drop); only the picture inside the square differs. Nothing here is
// ruled. Game data is rough.
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React from 'react';
import { LbNowCard } from '../../canon/app/gs-library.jsx';
import { PZ } from '../../canon/app/gs-puzzles-library.jsx';
import './canvas.css';

// Copies of Where's globe and chart (canon/app/gs-where.jsx WhGlobe, WhChart), which canon does not export. Same drawing, same classes.
const WH_POINTS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
const whKm = (km) => km.toLocaleString('en-GB') + ' km';
const whDist = (km) => (km === null ? 'Found' : km === 0 ? 'Border' : whKm(km));
const whBand = (km) => (km === null ? 'found' : km >= 1000 ? 'far' : km >= 100 ? 'mid' : 'near');
const WhGlobe = ({ p }) => {
  const c = 60; const R = 52; const lon = [-90, -60, -30, 0, 30, 60, 90].map((d) => d * Math.PI / 180);
  const down = (l) => 'A ' + Math.abs(R * Math.sin(l)) + ' ' + R + ' 0 0 ' + (l < 0 ? 0 : 1) + ' ' + c + ' ' + (c + R);
  const up = (l) => 'A ' + Math.abs(R * Math.sin(l)) + ' ' + R + ' 0 0 ' + (l > 0 ? 0 : 1) + ' ' + c + ' ' + (c - R);
  return (
    <div className={'wh-globe' + (p.g.length ? '' : ' is-none')} role="img" aria-label={p.g.length + ' of six guesses'}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} className={i < p.g.length ? 'is-' + p.g[i].band : 'is-spare'} d={'M ' + c + ' ' + (c - R) + ' ' + down(lon[i]) + ' ' + up(lon[i + 1]) + ' Z'} />)}
        <line x1={c - R} y1={c} x2={c + R} y2={c} className="wh-g-eq" /><circle cx={c} cy={c} r={R} className="wh-g-rim" />
      </svg>
      <span className="wh-say">{p.g.length} of 6</span>
    </div>);
};

// The caption, as canon's Now card has it: "1 hint" once the hint is used, "Not used yet" while the play is live, else "No hint".
const whSay = (p) => (p.hint ? '1 hint' : p.live ? 'Not used yet' : 'No hint');
const whCap = (s) => s[0].toUpperCase() + s.slice(1);

// Today's arrow (canon's WhChart): the real bearing, dashed out from the guessed country to an open ring.
const ArrowPic = ({ p }) => {
  const h = p.hint; const a = h ? (WH_POINTS.indexOf(h.dir) * 45 - 90) * Math.PI / 180 : 0; const c = 60; const L = 44;
  return (<>
    <rect x="8" y="8" width="104" height="104" className="wh-ch-box" />
    {[34, 60, 86].map((v) => <g key={v}><line x1={v} y1="8" x2={v} y2="112" className="wh-ch-grid" /><line x1="8" y1={v} x2="112" y2={v} className="wh-ch-grid" /></g>)}
    <text x="60" y="22" className="wh-ch-n">N</text>
    {h && <line x1={c} y1={c} x2={c + Math.cos(a) * L} y2={c + Math.sin(a) * L} className="wh-ch-bear" />}
    {h && <circle cx={c + Math.cos(a) * L} cy={c + Math.sin(a) * L} r="4" className="wh-ch-end" />}
    <circle cx={c} cy={c} r="5" className="wh-ch-from" />
  </>);
};

// The stand-in pictures. Each sits in the chart's own 120 box, so the square is exactly as wide as the globe. None has an arrowhead, an
// end ring, an N or a grid, and none turns with the real hint: used draws the mark in ink, not used draws it hollow and dimmed (the
// chart's own is-none, opacity .5).
const MARKS = {
  dotted: ({ used }) => (<>
    <rect x="8" y="8" width="104" height="104" className="wh-ch-box" />
    <line x1="60" y1="98" x2="60" y2="24" className={'hm-dots' + (used ? '' : ' is-off')} />
  </>),
  compass: ({ used }) => (<>
    <rect x="8" y="8" width="104" height="104" className="wh-ch-box" />
    <circle cx="60" cy="60" r="30" className={'hm-ring' + (used ? '' : ' is-off')} />
    {[[60, 18, 60, 30], [90, 60, 102, 60], [60, 90, 60, 102], [18, 60, 30, 60]].map((t, i) => (
      <line key={i} x1={t[0]} y1={t[1]} x2={t[2]} y2={t[3]} className={'hm-tick' + (used ? '' : ' is-off')} />))}
    <circle cx="60" cy="60" r="4.5" className={'hm-core' + (used ? '' : ' is-off')} />
  </>),
  trail: ({ used }) => (<>
    <rect x="8" y="8" width="104" height="104" className="wh-ch-box" />
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={60 + 13 * Math.sin(i * 1.3)} cy={94 - i * 14} r={6.5 - i * 0.7} className={'hm-dot' + (used ? '' : ' is-off')} />)}
  </>),
};
const WhHint = ({ p, mark }) => {
  const Pic = mark ? MARKS[mark] : ArrowPic;
  return (
    <div className={'wh-chart' + (p.hint ? '' : ' is-none')} role="img" aria-label={whSay(p)}>
      <svg viewBox="0 0 120 120" aria-hidden="true"><Pic used={!!p.hint} p={p} /></svg>
      <span className="wh-say">{whSay(p)}</span>
    </div>);
};

// Rough plays, as Where's session lines give them: [country, km]. A guess is { n, c, km, band }.
const guesses = (rows) => rows.map(([c, km], i) => ({ n: i + 1, c, km, band: whBand(km) }));
const HINT = { dir: 'northeast', from: 'Romania' };
const STATES = [
  { k: 'solved', h: 'Solved, hint used', tone: { kind: 'ok', label: 'Solved' },
    p: { g: guesses([['Spain', 2300], ['Poland', 1100], ['Romania', 430], ['Austria', 250], ['Slovakia', 120], ['Hungary', null]]), hint: HINT } },
  { k: 'live', h: 'In progress, hint used', tone: { kind: 'live', label: 'In progress' },
    p: { g: guesses([['Spain', 2300], ['Poland', 1100], ['Romania', 430]]), hint: HINT, live: true } },
  { k: 'fresh', h: 'In progress, hint not used', tone: { kind: 'live', label: 'In progress' },
    p: { g: guesses([['Spain', 2300], ['Poland', 1100]]), hint: null, live: true } },
  { k: 'failed', h: 'Failed, hint used', tone: { kind: 'bad', label: 'Failed' },
    p: { g: guesses([['Spain', 2300], ['Poland', 1100], ['Romania', 430], ['Austria', 250], ['Slovakia', 120], ['Ukraine', 410]]), hint: HINT, lost: true, answer: 'Hungary' } },
  { k: 'nohint', h: 'Solved, no hint', tone: { kind: 'ok', label: 'Solved' },
    p: { g: guesses([['Spain', 2300], ['Austria', 250], ['Hungary', null]]), hint: null } },
];
const BEFORE = { g: [], hint: null, live: true };

const Card = ({ p, tone, mark, n = 21 }) => {
  const g = p.g[p.g.length - 1];
  return (
    <LbNowCard gid="where" title={'#' + n} result={tone} open={() => {}} next={PZ.where.next} className="wh-now">
      <div className="wh-row">
        {g ? (
          <div className={'wh-last is-' + (p.lost ? 'lost' : g.band)}>
            <span className="wh-cap">{p.lost ? 'The country' : 'Last guess'}</span>
            <b>{p.lost ? p.answer : g.c}</b>
            <span className="wh-km">{p.lost ? 'Not found' : whDist(g.km)}</span>
          </div>) : (
          <div className="wh-last is-none"><span className="wh-cap">Last guess</span><b>None yet</b></div>)}
        <div className="wh-figs"><WhGlobe p={p} /><WhHint p={p} mark={mark} /></div>
      </div>
    </LbNowCard>);
};

// A card in a frame as wide as the phone, with the page's 16px gutter, so canon's phone layout (page under 640px) applies at that width.
const Frame = ({ w, children }) => <div className="wc-frame lb-lay" style={w ? { width: w } : undefined}>{children}</div>;

const CONCEPTS = [
  { k: 'dotted', n: '1', h: 'Dotted line', mark: 'dotted',
    note: 'A dotted line rises from the foot of the square toward the top: north, as the page draws it, with no arrowhead, no ring at the end and no N. Used, the dots are ink; not used, the same dots are dimmed.' },
  { k: 'compass', n: '2', h: 'Compass ticks', mark: 'compass',
    note: 'A small ring with a tick at each of the four points and a dot in the middle, like a compass with no needle. It is directional furniture that never picks a direction. Used, it is ink; not used, the same drawing is hollow and dimmed.' },
  { k: 'trail', n: '3', h: 'Wandering dots', mark: 'trail',
    note: 'A trail of six dots that winds up the square and shrinks as it goes, with no arrowhead and no end. It reads as "somewhere up there" and has no bearing. Used, it is ink; not used, the same drawing is hollow and dimmed.' },
];

const Overview = () => (
  <section className="wc-item" aria-labelledby="wc-over">
    <h2 id="wc-over" className="wc-h">The three squares</h2>
    <p className="gs-muted wc-note">The hint's square alone, used and not used, with today's arrow first for comparison.</p>
    <div className="wc-over">
      <div className="wc-over-row wc-over-head"><span /><span className="wh-cap">Used</span><span className="wh-cap">Not used</span></div>
      {[{ n: 'Today', mark: null }, ...CONCEPTS].map((c) => (
        <div key={c.k || 't'} className="wc-over-row">
          <span className="wc-over-n">{c.n === 'Today' ? 'Today' : c.n + '. ' + c.h}</span>
          <div className="wc-over-pic"><WhHint p={{ g: [1], hint: HINT }} mark={c.mark} /></div>
          <div className="wc-over-pic"><WhHint p={{ g: [1], hint: null, live: true }} mark={c.mark} /></div>
        </div>))}
    </div>
  </section>);

const Canvas = () => (
  <main className="wc">
    <h1 className="gs-h1">Where: the hint's mark on the now card</h1>
    <p className="gs-muted wc-intro">On a Pass. Three stand-in pictures for the hint's square beside the globe. Each keeps the square and its caption ("1 hint", "No hint", "Not used yet") and draws something that feels like a direction but points nowhere real. Nothing is decided. Game data is rough; buttons do nothing.</p>

    <section className="wc-item wc-notes" aria-labelledby="wc-how">
      <h2 id="wc-how" className="wc-h">What you cannot see here</h2>
      <ul className="wc-list gs-muted">
        <li>The mark is fixed. It never turns with the real hint, so the card never says which way the country lies; the session page still does.</li>
        <li>The mark is drawn in the chart's own 120 box and the caption is the same short word each time, so no concept can widen the caption. At 280px "Not used yet" wraps to two words stacked, as canon's does today.</li>
        <li>Before the first guess the hint is drawn not used, as the spec asks (the hint is refused before a guess).</li>
        <li>The cards are canon's now card frame and parts with canon's CSS, from branch candidate/where-now-drop, copied here because canon does not export them.</li>
      </ul>
    </section>

    <Overview />

    <section className="wc-item" aria-labelledby="wc-today">
      <h2 id="wc-today" className="wc-h">Today: the real arrow</h2>
      <p className="gs-muted wc-note">Canon's card now, Solved. A drawn direction beside the answer reads as wrong.</p>
      <Frame><Card p={STATES[0].p} tone={STATES[0].tone} mark={null} /></Frame>
    </section>

    {CONCEPTS.map((c) => (
      <React.Fragment key={c.k}>
        <section className={'wc-item wc-concept wc-' + c.k} aria-labelledby={'wc-' + c.k}>
          <h2 id={'wc-' + c.k} className="wc-h"><span className="wc-n">{c.n}</span>{c.h}</h2>
          <p className="gs-muted wc-note">{c.note}</p>
        </section>
        {STATES.map((s) => (
          <section key={s.k} className="wc-item" aria-label={c.n + '. ' + c.h + ': ' + s.h}>
            <p className="wc-state"><span className="wc-n">{c.n}</span>{s.h}</p>
            <Frame><Card p={s.p} tone={s.tone} mark={c.mark} /></Frame>
          </section>))}
        <section className="wc-item" aria-label={c.n + '. ' + c.h + ' at 320 and 280'}>
          <p className="wc-state"><span className="wc-n">{c.n}</span>Solved at 320</p>
          <Frame w={320}><Card p={STATES[0].p} tone={STATES[0].tone} mark={c.mark} /></Frame>
          <p className="wc-state"><span className="wc-n">{c.n}</span>Not used yet, before the first guess, at 280</p>
          <Frame w={280}><Card p={BEFORE} tone={{ kind: 'live', label: 'In progress' }} mark={c.mark} /></Frame>
        </section>
      </React.Fragment>))}
  </main>
);

window.KitCandidate.Screen = Canvas;
