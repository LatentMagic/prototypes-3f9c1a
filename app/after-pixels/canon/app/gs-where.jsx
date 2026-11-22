// ============================================================================
// Where's session card and library now card (Joe, 2026-10-31). The session card is the shared one Guess's is
// (GsSessCard, gs-session.jsx), so its places move when Guess's do: the result top left, the board (a ruled log of the guesses
// made, never the hint), and a panel ruled off at the board's right holding Guesses (the globe) and Hint (the chart). The now card is the last guess, then the globe and the chart as one group, centred on the whole card as
// Guess's is. A play is read from its session's lines (gs-where-chain-salvage.jsx dpWhere), so the cards and Every guess agree.
// Styles: app/gs-where.css.
// ============================================================================
import React from 'react';
import { useGs, GS_SESSIONS } from './gs-data.jsx';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { LbNowCard } from './gs-library.jsx';
import { edList } from './gs-history.jsx';
import { GS_SESSION_BODY, GS_NOW } from './registry.js';

const whKm = (km) => km.toLocaleString('en-GB') + ' km';
const whDist = (km) => (km === null ? 'Found' : km === 0 ? 'Border' : whKm(km));
// The share marks' bands: 1,000 km or more far, 100 to 999 mid, under 100 (a shared border included) near, found.
const whBand = (km) => (km === null ? 'found' : km >= 1000 ? 'far' : km >= 100 ? 'mid' : 'near');
const WH_POINTS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];

// A guess line's third part is "Found it", "Shares a border …" or "1,110 km from …"; the hint line is "The hidden country lies
// <point> of <country>", taken after the guesses before it; an Answer line means the play was lost.
export const whRead = (s) => {
  const g = []; let hint = null; let answer = null;
  (s.lines || []).forEach((l) => {
    if (/^Guess/.test(l[0])) { const km = /^Found/.test(l[2]) ? null : /^Shares/.test(l[2]) ? 0 : Number(l[2].split(' ')[0].replace(/,/g, ''));
      g.push({ n: g.length + 1, c: l[1], km, band: whBand(km) }); }
    else if (l[0] === 'Hint') { const m = /lies (\S+) of (.+)$/.exec(l[1]); if (m) hint = { dir: m[1], from: m[2], after: g.length }; }
    else if (l[0] === 'Answer') answer = l[1];
  });
  const live = !!s.live; const lost = !live && answer !== null;
  // KEEP: the session page says Found and Not found (where-session-part.component.ts), the Now card Solved and Failed (WHERE_RESULT, where-end.ts); the deployed product words the two pages differently.
  const r = live ? { tone: 'live', word: 'In progress' } : lost ? { tone: 'bad', word: 'Not found' } : { tone: 'ok', word: 'Found' };
  return { g, hint, answer: lost ? answer : g.length ? g[g.length - 1].c : null, live, lost, r };
};
const whSay = (p) => (p.hint ? p.hint.dir[0].toUpperCase() + p.hint.dir.slice(1) + ' of ' + p.hint.from : p.live ? 'Not used yet' : 'No hint');

// The board: a ruled line per guess made (Guess, Country, Distance), the guess number ruled off in the margin.
const WhLog = ({ p }) => (
  <div className="wh-log">
    <div className="wh-line is-head"><span>Guess</span><span>Country</span><span>Distance</span></div>
    {p.g.length === 0 && <div className="wh-line is-empty" role="img" aria-label="Guess 1, not made yet"><span className="wh-n" aria-hidden="true">1</span><b aria-hidden="true" /><span className="wh-km" aria-hidden="true" /></div>}
    {p.g.map((g) => <div key={g.n} className={'wh-line is-' + g.band}><span className="wh-n">{g.n}</span><b>{g.c}</b><span className="wh-km">{whDist(g.km)}</span></div>)}
  </div>);

// The globe: six gores between meridians at -90, -60 … 90 degrees, each drawn as two half-ellipses from pole to pole. Each gore
// is its guess, shaded by how close it came, green for the find; a loss stays grey, as the result says Not found on the session page (Joe, 2026-10-30).
// KEEP: with no guess made the globe takes is-none, so its "0 of 6" caption reads grey, not the text colour.
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

// The chart: a ruled box with a faint grid, N at the top, the bearing dashed out from the guessed country to an open ring. The box
// is unfilled, so it takes the card's colour.
// KEEP: on the Now card (count) the caption only counts the hint, "1 hint" or "No hint" ("Not used yet" while live), as the share text does: the card's last guess is rarely the guess the hint pointed from, so a direction beside it would mislead. The label says the same, never the real direction. The session page keeps the full "North of …" caption and label.
// KEEP: on the Now card (count) the picture is a fixed stand-in: a dashed line straight up from the centre dot, 44 long, no ring and no N, the same for every player and never turning with the real hint. It evokes a bearing without being one, because a real direction beside "Last guess" reads as wrong on a Solved card (the last guess is the answer). The session page keeps the real chart: the real bearing, the ring and the N.
const WhChart = ({ p, count }) => {
  // KEEP: the same 120 box and 104 span as the globe (WhGlobe), so the square is exactly as wide as the globe (Joe, 2026-10-31).
  const h = p.hint; const say = count && h ? '1 hint' : whSay(p); const a = h ? (WH_POINTS.indexOf(h.dir) * 45 - 90) * Math.PI / 180 : 0; const c = 60; const L = 44;
  return (
    <div className={'wh-chart' + (h ? '' : ' is-none')} role="img" aria-label={count && h ? 'Hint: ' + say : h ? 'Hint: the country lies ' + h.dir + ' of ' + h.from : say}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="8" y="8" width="104" height="104" className="wh-ch-box" />
        {[34, 60, 86].map((v) => <g key={v}><line x1={v} y1="8" x2={v} y2="112" className="wh-ch-grid" /><line x1="8" y1={v} x2="112" y2={v} className="wh-ch-grid" /></g>)}
        {!count && <text x="60" y="22" className="wh-ch-n">N</text>}
        {h && count && <line x1={c} y1={c} x2={c} y2={c - L} className="wh-ch-bear" />}
        {h && !count && <line x1={c} y1={c} x2={c + Math.cos(a) * L} y2={c + Math.sin(a) * L} className="wh-ch-bear" />}
        {h && !count && <circle cx={c + Math.cos(a) * L} cy={c + Math.sin(a) * L} r="4" className="wh-ch-end" />}
        <circle cx={c} cy={c} r="5" className="wh-ch-from" />
      </svg>
      <span className="wh-say">{say}</span>
    </div>);
};

// ---- The session card, on the shared GsSessCard. Desktop: Guesses and Hint side by side in the panel, the panel centred between
// its rule and the card's edge, the board centred in the space left of the rule. The country shows as the panel's last row on a loss. ----
const WhSessBody = ({ s }) => { const p = whRead(s); return <>
  <GsSessCard r={p.r} className="wh-card" board={<WhLog p={p} />} rows={[['Guesses', <WhGlobe p={p} />], ['Hint', <WhChart p={p} />]]}
    last={p.lost && <div className="wh-a"><span className="gs-sc-cap">The country</span><b>{p.answer}</b></div>} />
  <GsMoves s={s} />
</>; };

// ---- The now card: the last guess (the hidden country on a loss), then the globe and the chart, one group that never splits.
// Before the first guess the same card is drawn empty (where.md): no last guess, the globe unlit (0 of 6, grey) and the hint unused.
// Not yet played it carries no result tag and plays; begun with no guess made it says In progress and opens the session. ----
const WH_NOW_RESULT = { ok: { kind: 'ok', label: 'Solved' }, bad: { kind: 'bad', label: 'Failed' }, live: { kind: 'live', label: 'In progress' } };
const WH_FRESH = { g: [], hint: null, live: true };
const WhNowEmpty = ({ c, play, open, result }) => (
  <LbNowCard gid="where" title={'#' + GS_SESSIONS[c.today].number} result={result} play={play} open={open} next={c.next} className="wh-now">
    <div className="wh-row">
      <div className="wh-last is-none"><span className="wh-cap">Last guess</span><b>None yet</b></div>
      <div className="wh-figs"><WhGlobe p={WH_FRESH} /><WhChart p={WH_FRESH} count /></div>
    </div>
  </LbNowCard>);
const WhNow = ({ c, done, none, children }) => {
  const gs = useGs();
  if (none) return <WhNowEmpty c={c} play={() => gs.playReq({ kind: 'edition', e: edList(gs, 'where')[0] })} />;
  const sid = done ? c.today : c.liveSid; const s = GS_SESSIONS[sid]; if (!s) return children;
  const p = whRead(s); const g = p.g[p.g.length - 1];
  const open = () => gs.go('session', { id: sid });
  if (!g) return <WhNowEmpty c={c} open={open} result={WH_NOW_RESULT.live} />;
  return (
    <LbNowCard gid="where" title={'#' + s.number} result={WH_NOW_RESULT[p.r.tone]} open={open} next={c.next} className="wh-now">
      <div className="wh-row">
        <div className={'wh-last is-' + (p.lost ? 'lost' : g.band)}>
          <span className="wh-cap">{p.lost ? 'The country' : 'Last guess'}</span>
          <b>{p.lost ? p.answer : g.c}</b>
          <span className="wh-km">{p.lost ? 'Not found' : whDist(g.km)}</span>
        </div>
        <div className="wh-figs"><WhGlobe p={p} /><WhChart p={p} count /></div>
      </div>
    </LbNowCard>);
};

export const initGsWhere = () => { GS_SESSION_BODY.where = WhSessBody; GS_NOW.where = WhNow; };
