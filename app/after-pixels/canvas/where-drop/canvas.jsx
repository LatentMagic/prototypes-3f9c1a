// ============================================================================
// Hi-fi canvas: three ways to fix the Where now card's drop. With a long hint the chart's caption wraps to four or five lines and the
// "Last guess" block sits below the globe's centre. Every card is canon's now card frame (LbNowCard) with Where's own parts and canon's
// CSS; each way changes only what canvas.css and the caption words below say. Nothing here is ruled. The reasoning is in business-ops,
// where-now-card/_resources/canvas-where-fix.md.
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React, { useState } from 'react';
import { LbNowCard } from '../../canon/app/gs-library.jsx';
import { PZ } from '../../canon/app/gs-puzzles-library.jsx';
import './canvas.css';

// Copies of Where's globe and chart (canon/app/gs-where.jsx WhGlobe, WhChart), which canon does not export. Same drawing, same classes;
// the caption words come in as a prop so each way can set them.
const WH_POINTS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const whSay = (p) => (p.hint ? cap(p.hint.dir) + ' of ' + p.hint.from : p.live ? 'Not used yet' : 'No hint');
const WhGlobe = ({ p }) => {
  const c = 60; const R = 52; const lon = [-90, -60, -30, 0, 30, 60, 90].map((d) => d * Math.PI / 180);
  const down = (l) => 'A ' + Math.abs(R * Math.sin(l)) + ' ' + R + ' 0 0 ' + (l < 0 ? 0 : 1) + ' ' + c + ' ' + (c + R);
  const up = (l) => 'A ' + Math.abs(R * Math.sin(l)) + ' ' + R + ' 0 0 ' + (l > 0 ? 0 : 1) + ' ' + c + ' ' + (c - R);
  return (
    <div className="wh-globe" role="img" aria-label={p.g.length + ' of six guesses'}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} className={i < p.g.length ? 'is-' + p.g[i].band : 'is-spare'} d={'M ' + c + ' ' + (c - R) + ' ' + down(lon[i]) + ' ' + up(lon[i + 1]) + ' Z'} />)}
        <line x1={c - R} y1={c} x2={c + R} y2={c} className="wh-g-eq" /><circle cx={c} cy={c} r={R} className="wh-g-rim" />
      </svg>
      <span className="wh-say">{p.g.length} of 6</span>
    </div>);
};
const WhChart = ({ p, say }) => {
  const h = p.hint; const a = h ? (WH_POINTS.indexOf(h.dir) * 45 - 90) * Math.PI / 180 : 0; const c = 60; const L = 44;
  return (
    <div className={'wh-chart' + (h ? '' : ' is-none')} role="img" aria-label={h ? 'Hint: the country lies ' + h.dir + ' of ' + h.from : whSay(p)}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="8" y="8" width="104" height="104" className="wh-ch-box" />
        {[34, 60, 86].map((v) => <g key={v}><line x1={v} y1="8" x2={v} y2="112" className="wh-ch-grid" /><line x1="8" y1={v} x2="112" y2={v} className="wh-ch-grid" /></g>)}
        <text x="60" y="22" className="wh-ch-n">N</text>
        {h && <line x1={c} y1={c} x2={c + Math.cos(a) * L} y2={c + Math.sin(a) * L} className="wh-ch-bear" />}
        {h && <circle cx={c + Math.cos(a) * L} cy={c + Math.sin(a) * L} r="4" className="wh-ch-end" />}
        <circle cx={c} cy={c} r="5" className="wh-ch-from" />
      </svg>
      <span className="wh-say">{say(p)}</span>
    </div>);
};

// Two Solved plays, each found on the sixth guess with the hint. Longest: prototypes candidate/hard-states' Hard play (Peru, the hint
// from Saint Vincent and the Grenadines, southwest), the longest hint a real play can give. Short: canon's Hard play today (Hungary,
// the hint from Romania, west).
const play = (c, bands, dir, from) => ({ last: c, g: bands.map((band, i) => ({ n: i + 1, band })), hint: { dir, from }, live: false });
const LONGEST = play('Peru', ['far', 'far', 'far', 'far', 'far', 'found'], 'southwest', 'Saint Vincent and the Grenadines');
const SHORT = play('Hungary', ['far', 'near', 'near', 'near', 'near', 'found'], 'west', 'Romania');

// The ways. say: the chart's caption; line: a line of its own under the row.
const WAYS = [
  { k: 'today', n: 'Today', h: 'As canon draws it', say: whSay,
    note: 'The row centres the "Last guess" block on the pictures and their captions together, so a long hint pulls the block down.' },
  { k: 'one', n: '1', h: 'Line the block up with the pictures', say: whSay,
    note: 'The block, the globe and the chart share one centre line; the captions sit in a row beneath. The long caption still hangs under the chart.' },
  { k: 'two', n: '2', h: 'Shorten the hint to its direction', say: (p) => (p.hint ? cap(p.hint.dir) : whSay(p)),
    note: 'The chart\'s caption says only the direction. The country the hint came from leaves this card; the session page still shows it.' },
  { k: 'three', n: '3', h: 'Give the hint a line of its own', say: (p) => (p.hint ? '1 hint' : whSay(p)), line: true,
    note: 'The chart\'s caption becomes a count, like the globe\'s. The full hint moves to a line under the row, at the card\'s width.' },
];

const Row = ({ p, w }) => (
  <div className="wh-row">
    <div className="wh-last is-found"><span className="wh-cap">Last guess</span><b>{p.last}</b><span className="wh-km">Found</span></div>
    <div className="wh-figs"><WhGlobe p={p} /><WhChart p={p} say={w.say} /></div>
  </div>);

const Card = ({ p, w }) => (
  <LbNowCard gid="where" title="#21" result={{ kind: 'ok', label: 'Solved' }} open={() => {}} next={PZ.where.next} className="wh-now">
    {w.line
      ? <div className="wc-body"><Row p={p} w={w} /><p className="wc-hint"><span className="wh-cap">Hint</span> {cap(p.hint.dir)} of {p.hint.from}</p></div>
      : <Row p={p} w={w} />}
  </LbNowCard>);

const VIEWS = [
  { k: 'l390', l: '390 · longest hint', w: 390, p: LONGEST },
  { k: 'l320', l: '320 · longest hint', w: 320, p: LONGEST },
  { k: 's390', l: '390 · short hint', w: 390, p: SHORT },
];

// Each card sits in a frame as wide as the phone (390 or 320), with the page's 16px gutter, so the card is as wide as on that phone and
// canon's phone layout (the page under 640px) applies.
const Canvas = () => {
  const [v, setV] = useState('l390'); const view = VIEWS.find((x) => x.k === v);
  return (
    <main className="wc">
      <h1 className="gs-h1">Where: now card, the long-hint drop</h1>
      <p className="gs-muted wc-intro">Today's broken card, then three ways to fix it. Solved, found on guess 6 with the hint. The first tab has the longest hint a real play can give; the others show each way holds at 320px and with a short hint. Nothing is decided.</p>
      <div className="lb-choice wc-tabs">{VIEWS.map((x) => <button key={x.k} type="button" aria-pressed={x.k === v} onClick={() => setV(x.k)}>{x.l}</button>)}</div>
      {WAYS.map((w) => (
        <section key={w.k} className={'wc-item wc-' + w.k} aria-labelledby={'wc-' + w.k}>
          <h2 id={'wc-' + w.k} className="wc-h"><span className="wc-n">{w.n}</span>{w.h}</h2>
          <p className="gs-muted wc-note">{w.note}</p>
          <div className="wc-frame lb-lay" style={{ width: view.w }}><Card p={view.p} w={w} /></div>
        </section>))}
    </main>);
};

window.KitCandidate.Screen = Canvas;
