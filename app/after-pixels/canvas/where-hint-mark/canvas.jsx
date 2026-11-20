// ============================================================================
// Hi-fi canvas: three versions of the hint picture on the Where now card. The square keeps its place beside the globe and its
// caption ("1 hint", "No hint", "Not used yet"), but its picture no longer draws the real direction: it evokes one without being one,
// so a Solved card's last guess is never read as pointing the wrong way. Every card is canon's now card frame (LbNowCard) with Where's own
// parts and canon's CSS (gs-where.css, as on branch candidate/where-now-drop); only the direction point inside the square differs (the N is dropped). Nothing here is
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

// The chart, as canon's WhChart draws it: the ruled box, the faint grid and the from dot, with N only on "Today". A concept changes only
// the direction point: what the line does at its far end. The line keeps canon's dash, weight and ink (wh-ch-bear), starts at the same
// centre dot, and never turns with the real hint.
const Base = ({ n, children }) => (<>
  <rect x="8" y="8" width="104" height="104" className="wh-ch-box" />
  {[34, 60, 86].map((v) => <g key={v}><line x1={v} y1="8" x2={v} y2="112" className="wh-ch-grid" /><line x1="8" y1={v} x2="112" y2={v} className="wh-ch-grid" /></g>)}
  {n && <text x="60" y="22" className="wh-ch-n">N</text>}
  {children}
  <circle cx="60" cy="60" r="5" className="wh-ch-from" />
</>);

// Today (canon): the real bearing, with N, out to an open ring.
const TodayPic = ({ p }) => {
  const h = p.hint; const a = h ? (WH_POINTS.indexOf(h.dir) * 45 - 90) * Math.PI / 180 : 0; const c = 60; const L = 44;
  return (
    <Base n>
      {h && <line x1={c} y1={c} x2={c + Math.cos(a) * L} y2={c + Math.sin(a) * L} className="wh-ch-bear" />}
      {h && <circle cx={c + Math.cos(a) * L} cy={c + Math.sin(a) * L} r="4" className="wh-ch-end" />}
    </Base>);
};
// The concepts: each draws only when the hint is used, in canon's bearing ink (wh-ch-bear: dashed, weight 2) or canon's open ring
// (wh-ch-end). None has a heading: nothing here turns with the real hint. No N.
const MARKS = {
  axes: () => (<Base>{[[0, -1], [0, 1], [-1, 0], [1, 0]].map(([x, y]) => <line key={x + ',' + y} x1="60" y1="60" x2={60 + x * 48} y2={60 + y * 48} className="wh-ch-bear" />)}</Base>),
  sweep: () => (<Base><circle cx="60" cy="60" r="44" pathLength="272" className="wh-ch-bear wh-ch-sweep" /></Base>),
  target: () => (<Base><circle cx="60" cy="60" r="20" className="wh-ch-end" /></Base>),
};
const WhHint = ({ p, mark }) => {
  const Pic = mark ? MARKS[mark] : TodayPic;
  return (
    <div className={'wh-chart' + (p.hint ? '' : ' is-none')} role="img" aria-label={whSay(p)}>
      <svg viewBox="0 0 120 120" aria-hidden="true">{p.hint || !mark ? <Pic p={p} /> : <Base />}</svg>
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
  { k: 'axes', n: '1', h: 'Two axes through the dot', mark: 'axes',
    note: "The grid's two middle lines are picked out in the bearing's dashed ink, running both ways from the dot: it evokes a bearing's frame, but every way at once, so no way is the answer." },
  { k: 'sweep', n: '2', h: 'The bearing swept all round', mark: 'sweep',
    note: "The bearing's dashed line, drawn as the whole circle its end could reach from the dot: it evokes a bearing being taken, with every direction drawn and none chosen." },
  { k: 'target', n: '3', h: 'Ring on the dot', mark: 'target',
    note: "Canon's open ring, the mark for where the country is, sits on the dot with no line: it says a country is out there to be found, with no way marked." },
];

const Overview = () => (
  <section className="wc-item" aria-labelledby="wc-over">
    <h2 id="wc-over" className="wc-h">The hint square with and without the mark</h2>
    <p className="gs-muted wc-note">The same box and grid with no mark is the No hint picture; a used hint is that picture plus the mark. Today's is first, for comparison only.</p>
    <div className="wc-over">
      <div className="wc-over-row wc-over-head"><span /><span className="wh-cap">1 hint</span><span className="wh-cap">No hint</span></div>
      {[{ n: 'Today', mark: null }, ...CONCEPTS].map((c) => (
        <div key={c.k || 't'} className="wc-over-row">
          <span className="wc-over-n">{c.n === 'Today' ? 'Today' : c.n + '. ' + c.h}</span>
          <div className="wc-over-pic"><WhHint p={{ g: [1], hint: HINT }} mark={c.mark} /></div>
          <div className="wc-over-pic"><WhHint p={{ g: [1], hint: null }} mark={c.mark} /></div>
        </div>))}
    </div>
  </section>);

const Canvas = () => (
  <main className="wc">
    <h1 className="gs-h1">Where: the hint's mark on the now card</h1>
    <p className="gs-muted wc-intro">On a Pass. Three ideas for the hint's picture beside the globe. Each is today's box and grid with the N dropped and only the direction point changed, and each is fixed, so it evokes a direction without being one. Captions stay ("1 hint", "No hint", "Not used yet"). Nothing is decided. Game data is rough; buttons do nothing.</p>

    <section className="wc-item wc-notes" aria-labelledby="wc-how">
      <h2 id="wc-how" className="wc-h">What you cannot see here</h2>
      <ul className="wc-list gs-muted">
        <li>Every mark is fixed and the same for every player. It never turns with the real hint, so the card never says which way the country lies; the session page still does.</li>
        <li>Each picture is canon's chart in its own 120 box with the same caption, so no concept can widen the caption. At 280px "Not used yet" wraps to two words stacked, as canon's does today.</li>
        <li>Before the first guess the hint is drawn as No hint (box and grid only, faded), as the spec asks (the hint is refused before a guess). The dot where the line starts stays in every state, as in canon.</li>
        <li>The cards are canon's now card frame and parts with canon's CSS, from branch candidate/where-now-drop, copied here because canon does not export them.</li>
      </ul>
    </section>

    <Overview />

    <section className="wc-item" aria-labelledby="wc-today">
      <h2 id="wc-today" className="wc-h">Today: the real direction</h2>
      <p className="gs-muted wc-note">Canon's card now, Solved, with the N and the real bearing. A real direction beside the answer reads as wrong.</p>
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
