// ============================================================================
// Hi-fi canvas: two ways to fix the Where now card's drop. With a long hint the chart's caption wraps to four lines and the "Last
// guess" block sits below the globe's centre. Every card is canon's now card frame (LbNowCard) with Where's own parts and canon's CSS;
// A and B change only the alignment rules in canvas.css. Nothing here is ruled. Game data is rough.
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React from 'react';
import { LbNowCard } from '../../canon/app/gs-library.jsx';
import { PZ } from '../../canon/app/gs-puzzles-library.jsx';
import './canvas.css';

// Copies of Where's globe and chart (canon/app/gs-where.jsx WhGlobe, WhChart), which canon does not export. Same drawing, same classes.
const WH_POINTS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
const whSay = (p) => (p.hint ? p.hint.dir[0].toUpperCase() + p.hint.dir.slice(1) + ' of ' + p.hint.from : p.live ? 'Not used yet' : 'No hint');
const WhGlobe = ({ p, say }) => {
  const c = 60; const R = 52; const lon = [-90, -60, -30, 0, 30, 60, 90].map((d) => d * Math.PI / 180);
  const down = (l) => 'A ' + Math.abs(R * Math.sin(l)) + ' ' + R + ' 0 0 ' + (l < 0 ? 0 : 1) + ' ' + c + ' ' + (c + R);
  const up = (l) => 'A ' + Math.abs(R * Math.sin(l)) + ' ' + R + ' 0 0 ' + (l > 0 ? 0 : 1) + ' ' + c + ' ' + (c - R);
  return (
    <div className={'wh-globe' + (p.g.length ? '' : ' is-none')} role="img" aria-label={p.g.length + ' of six guesses'}>
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

// Solved: Chad found on guess 6. The two hints are canon's own (Poland) and the long one the platform meets.
const G = ['far', 'far', 'mid', 'mid', 'near', 'found'].map((band, i) => ({ n: i + 1, c: 'Chad', km: null, band }));
const SOLVED = (from) => ({ g: G, hint: { dir: 'north', from, after: 5 }, live: false, lost: false });
const LONG = SOLVED('Democratic Republic of the Congo');
const SHORT = SOLVED('Poland');

const Card = ({ p }) => (
  <LbNowCard gid="where" title="#21" result={{ kind: 'ok', label: 'Solved' }} open={() => {}} next={PZ.where.next} className="wh-now">
    <div className="wh-row">
      <div className="wh-last is-found">
        <span className="wh-cap">Last guess</span>
        <b>Chad</b>
        <span className="wh-km">Found</span>
      </div>
      <div className="wh-figs"><WhGlobe p={p} /><WhChart p={p} /></div>
    </div>
  </LbNowCard>);

// Each card sits in a frame of its own width that reads as the page, so the phone layout (the page under 640px) applies at 390 and 320.
const Frame = ({ w, p, note }) => (
  <figure className="wc-fig">
    <figcaption className="gs-muted">{w}px, {note}</figcaption>
    <div className="wc-frame lb-lay" style={{ width: w }}><Card p={p} /></div>
  </figure>);

const ITEMS = [
  { k: 'today', n: 'Today', h: 'As canon draws it', note: 'The row centres the "Last guess" block on the figures plus their captions, so a long hint pulls it down.' },
  { k: 'a', n: 'A', h: 'Line the block up with the globe and chart', note: 'Pictures and the block share a top and centre; captions hang below.' },
  { k: 'b', n: 'B', h: 'Wider caption', note: 'The caption may be 120px wide (canon: 76px), so the long hint wraps to fewer lines. The block stays centred as today.' },
];

const Canvas = () => (
  <main className="wc">
    <h1 className="gs-h1">Where: now card, the drop</h1>
    <p className="gs-muted wc-intro">Solved (Chad, 6 of 6). Each version at 390px and 320px card width, with the long hint (North of Democratic Republic of the Congo) and a short one (North of Poland). Copy and data are rough.</p>
    {ITEMS.map((it) => (
      <section key={it.k} className={'wc-item wc-' + it.k} aria-labelledby={'wc-' + it.k}>
        <h2 id={'wc-' + it.k} className="wc-h"><span className="wc-n">{it.n}</span>{it.h}</h2>
        <p className="gs-muted wc-note">{it.note}</p>
        <div className="wc-set">
          <Frame w={390} p={LONG} note="long hint" />
          <Frame w={320} p={LONG} note="long hint" />
          <Frame w={390} p={SHORT} note="short hint" />
          <Frame w={320} p={SHORT} note="short hint" />
        </div>
      </section>))}
  </main>
);

window.KitCandidate.Screen = Canvas;
