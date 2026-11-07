// ============================================================================
// Hi-fi canvas: Where's now card on the library game page. 1 to 3 are canon's own cards today (PzNow, canon's data). 4 to 6 are
// concepts for the not-started card, drawn on canon's now card frame (LbNowCard) and Where's parts. Nothing here is ruled.
// Game data and copy are rough.
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React from 'react';
import { DS } from '../../canon/app/gs-data.jsx';
import { LbNowCard } from '../../canon/app/gs-library.jsx';
import { PZ } from '../../canon/app/gs-puzzles-library.jsx';
import { PzNow } from '../../canon/app/gs-pass-library.jsx';
import './canvas.css';

// Copies of Where's globe and chart (canon/app/gs-where.jsx WhGlobe, WhChart), which canon does not export. Same drawing, same classes.
const WH_POINTS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
const whSay = (p) => (p.hint ? p.hint.dir[0].toUpperCase() + p.hint.dir.slice(1) + ' of ' + p.hint.from : p.live ? 'Not used yet' : 'No hint');
const WhGlobe = ({ p, say }) => {
  const c = 60; const R = 52; const lon = [-90, -60, -30, 0, 30, 60, 90].map((d) => d * Math.PI / 180);
  const down = (l) => 'A ' + Math.abs(R * Math.sin(l)) + ' ' + R + ' 0 0 ' + (l < 0 ? 0 : 1) + ' ' + c + ' ' + (c + R);
  const up = (l) => 'A ' + Math.abs(R * Math.sin(l)) + ' ' + R + ' 0 0 ' + (l > 0 ? 0 : 1) + ' ' + c + ' ' + (c - R);
  return (
    <div className="wh-globe" role="img" aria-label={p.g.length + ' of six guesses'}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} className={i < p.g.length ? 'is-' + p.g[i].band : 'is-spare'} d={'M ' + c + ' ' + (c - R) + ' ' + down(lon[i]) + ' ' + up(lon[i + 1]) + ' Z'} />)}
        <line x1={c - R} y1={c} x2={c + R} y2={c} className="wh-g-eq" /><circle cx={c} cy={c} r={R} className="wh-g-rim" />
      </svg>
      <span className="wh-say">{say || p.g.length + ' of 6'}</span>
    </div>);
};
const WhChart = ({ p }) => {
  const h = p.hint; const a = h ? (WH_POINTS.indexOf(h.dir) * 45 - 90) * Math.PI / 180 : 0; const c = 60; const L = 44;
  return (
    <div className={'wh-chart' + (h ? '' : ' is-none')} role="img" aria-label={whSay(p)}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="8" y="8" width="104" height="104" className="wh-ch-box" />
        {[34, 60, 86].map((v) => <g key={v}><line x1={v} y1="8" x2={v} y2="112" className="wh-ch-grid" /><line x1="8" y1={v} x2="112" y2={v} className="wh-ch-grid" /></g>)}
        <text x="60" y="22" className="wh-ch-n">N</text>
        {h && <line x1={c} y1={c} x2={c + Math.cos(a) * L} y2={c + Math.sin(a) * L} className="wh-ch-bear" />}
        {h && <circle cx={c + Math.cos(a) * L} cy={c + Math.sin(a) * L} r="4" className="wh-ch-end" />}
        <circle cx={c} cy={c} r="5" className="wh-ch-from" />
      </svg>
      <span className="wh-say">{whSay(p)}</span>
    </div>);
};

// Rough data for the concepts: today's country, not yet played.
const NONE = { g: [], hint: null, live: true };
const NEW = { kind: 'live', label: 'New' }; // "New" in the result's place, drawn as In progress is (fast-follow 27).
const noop = () => {};
const next = () => PZ.where.next;

// 4. The play's own picture, empty: the in-progress card with nothing in it yet.
const C4 = () => (
  <LbNowCard gid="where" title="#21" result={NEW} play={noop} next={next()} className="wh-now">
    <div className="wh-row">
      <div className="wh-last wc-empty">
        <span className="wh-cap">Last guess</span>
        <b>None yet</b>
        <span className="wh-km">6 to go</span>
      </div>
      <div className="wh-figs"><WhGlobe p={NONE} /><WhChart p={NONE} /></div>
    </div>
  </LbNowCard>);

// 5. The rules at a glance, no picture: what today gives you, as captioned figures.
const C5 = () => (
  <LbNowCard gid="where" title="#21" result={NEW} play={noop} next={next()}>
    <p>A hidden country. Find it in six guesses.</p>
    <div className="wc-rules">
      <div><span className="wh-cap">Guesses</span><b className="gs-figure">6</b></div>
      <div><span className="wh-cap">Hint</span><b className="gs-figure">1</b></div>
      <div><span className="wh-cap">Each miss</span><b className="gs-figure">km away</b></div>
    </div>
  </LbNowCard>);

// 6. Yesterday carried in: today's line, then yesterday's play as the row Your countries already shows.
const C6 = () => (
  <LbNowCard gid="where" title="#21" result={NEW} play={noop} next={next()}>
    <p>Today’s country is waiting. You get six guesses and one hint.</p>
    <div className="lb-box wc-row">
      <DS.RowList label="Yesterday">
        <DS.ListRow title="#20" result={['Solved in 3 of 6', '3 of 6']} tone="ok" when="Yesterday" onClick={noop} />
      </DS.RowList>
    </div>
  </LbNowCard>);

const ITEMS = [
  { n: 1, h: 'Today: in progress', note: 'Canon’s card while a play is under way.', el: () => <PzNow c={PZ.where} id="where" done={false} none={false} /> },
  { n: 2, h: 'Today: Solved', note: 'Canon’s card once the country is found.', el: () => <PzNow c={PZ.where} id="where" done none={false} /> },
  { n: 3, h: 'Today: not started', note: 'Canon’s card before a play: title, one line, Play. Where has no card of its own here; this is the plain fallback.', el: () => <PzNow c={PZ.where} id="where" done none /> },
  { n: 4, h: 'Concept: the board, empty', note: 'The in-progress card with nothing in it: no guess yet, the globe unlit, the hint unused. As Guess, Chain and Common show theirs.', el: C4 },
  { n: 5, h: 'Concept: the rules at a glance', note: 'No picture. One line, then what today gives you as three captioned figures.', el: C5 },
  { n: 6, h: 'Concept: yesterday carried in', note: 'Today’s line, then yesterday’s play as the same row Your countries shows, so the card says where you left off.', el: C6 },
];

const Canvas = () => (
  <main className="wc">
    <h1 className="gs-h1">Where: now card</h1>
    <p className="gs-muted wc-intro">On a Pass. 1 to 3 are canon today; 4 to 6 are concepts for the not-started card. Copy and data are rough. Buttons do nothing.</p>
    {ITEMS.map((it) => { const El = it.el; return (
      <section key={it.n} className="wc-item" aria-labelledby={'wc-' + it.n}>
        <h2 id={'wc-' + it.n} className="wc-h"><span className="wc-n">{it.n}</span>{it.h}</h2>
        <p className="gs-muted wc-note">{it.note}</p>
        <div className="lb-lay wc-slot"><El /></div>
      </section>); })}
  </main>
);

window.KitCandidate.Screen = Canvas;
