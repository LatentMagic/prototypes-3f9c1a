// ============================================================================
// PLAYGROUND, not canon (branch candidate/delve-session-page): the Delve Now card with the session page's route map in place of its room strip and key dice.
// 1 is the map as canon draws it; 2 keeps the map close to a rectangle of the card's old height; 3 is the latest stops in one row over the key moments in one centred row. Nothing in the display is pressable.
// The settings bar (app/playground.jsx) picks the concept, the stops visited, the rolls and whether the run is in progress or ended; open with ?pg=now-card.
// To remove it: delete this file and playground-now-card.css, and their lines in main.jsx and canon.css. Styles: app/playground-now-card.css.
// ============================================================================
import React from 'react';
import { GS_SESSIONS, GS_GAMES, useGs } from './gs-data.jsx';
import { lbAccess, LbHead, LbNowCard, LbRun, lbStreak, lbRunOf, LbAch } from './gs-library.jsx';
import { phAch } from './gs-history.jsx';
import { DV_ACH, DV_BADGES, DV_NEXT, dvRun } from './gs-delve-library.jsx';
import { dlBuild, dlWord, dlNum, DlMap, DlMapMarks, DlBackArrow, DlDie, useDlWidth, DL_MAP_COL, DL_MAP_GAP, DL_MAP_INSET, DL_MAP_FEW, DL_MAP_GAP_FEW } from './gs-delve.jsx';
import { dlLongRun } from './gs-delve-runs.jsx';
import { GS_LIBRARY } from './registry.js';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

// Concept 2 draws the map's stops in equal columns that share the card's whole width, so a map never reaches past the card's content edges.
// KEEP: concept 2's stops never sit closer than a 22px column, so a wide card wraps its stops into evened rows instead of squeezing them onto one.
// col: the narrowest a stop's column may be, which sets how many stops one row holds; box: the number box; die, dot: the marks under a stop.
const PG_MAPS = { 2: { col: 22, box: 18, die: 16, dot: 6, font: 11 } };

// A stop is drawn as the session page draws it (number box, its dice and dots beneath) but is never a button.
const PgMap = ({ m, v, concept }) => {
  const n = m.stops.length; const ref = React.useRef(null);
  const measure = React.useMemo(() => (el) => { const per = Math.max(1, Math.floor(el.clientWidth / v.col)); return Math.ceil(n / Math.ceil(n / per)); }, [n, v.col]);
  const cols = useDlWidth(ref, measure, n);
  return (<div className={'pgn-map pgn-c' + concept} style={{ '--dv-num': v.box + 'px', '--dv-stop-top': '4px', '--pgn-die': v.die + 'px', '--pgn-dot': v.dot + 'px', '--pgn-font': v.font + 'px' }}>
    <div ref={ref} className="dvG-map pgn-grid" style={{ '--cols': cols, '--gap': '0px' }} role="img" aria-label={'The way you went: ' + n + ' room visits'}>
      {m.stops.map((st, i) => (
        <span key={st.i} className={'dvG-stop' + (i % cols === 0 ? ' is-rs' : '') + (i % cols === cols - 1 || i === n - 1 ? ' is-re' : '')} title={st.name}>
          <span className={dlNum(st)}>{st.back && <DlBackArrow />}{st.num}</span><DlMapMarks m={m} st={st} />
        </span>))}
    </div></div>);
};


// Concept 3: the stops in one row (the latest up to 12) and the run's key moments in one centred row beneath.
// KEEP: a stop is drawn as the session page's map draws it (a 28px number box, a return keeping its back-arrow) and is never shrunk or wrapped; the row shows the latest stops that fit at the session map's pitch (a 44px column and a 6px gap), up to 12, so a phone card shows fewer.
// KEEP: from 5 stops the boxes spread edge to edge on the card's content width; fewer sit gathered at a 32px gap, centred (DL_MAP_GAP_FEW, the session map's rule, the user, 2026-11-25).
// KEEP: the key dice are the session page's 44px, up to four, centred on the card, the latest first, each named beneath; a run with no key moment draws no dice row, so the card keeps no gap where it would stand.
// A run not started draws the run's five rooms empty, the first reached, as the session page does before the first roll.
const PG3_MAX = 12; const PG3_ROOMS = 5;
// The roll that ended an overrun run is named "Latest roll" under its die, first among its names, whatever the held roll's title says.
const pg3Names = (kickers) => { const k = kickers.map((x) => (x === 'Last roll' ? 'Latest roll' : x)); return [...k.filter((x) => x === 'Latest roll'), ...k.filter((x) => x !== 'Latest roll')]; };
const pg3Fit = (el) => Math.max(1, Math.floor((el.clientWidth + DL_MAP_INSET * 2 + DL_MAP_GAP) / (DL_MAP_COL + DL_MAP_GAP)));
const PgSpread = ({ m }) => {
  const ref = React.useRef(null); const fit = useDlWidth(ref, pg3Fit, PG3_MAX);
  const empty = !m.stops.length;
  const rooms = empty ? Array.from({ length: PG3_ROOMS }, (_, i) => ({ i, num: i + 1, back: false, turns: [] })).slice(0, fit) : m.stops.slice(-Math.min(PG3_MAX, fit));
  const keys = m.turns.filter((r) => m.mom[r.t] && !r.lost).reverse().slice(0, 4);
  const few = rooms.length <= DL_MAP_FEW;
  return (<div ref={ref} className={'pgn3' + (keys.length ? '' : ' is-alone')} role="group" aria-label="The way you went">
    <div className={'pgn3-stops' + (few ? ' is-few' : '')} style={{ '--n': rooms.length, '--few': DL_MAP_GAP_FEW + 'px' }} role="img" aria-label={empty ? 'The run has ' + PG3_ROOMS + ' rooms, the first reached, no rolls yet' : 'The last ' + rooms.length + ' stops'}>
      {rooms.map((st, i) => <span key={st.i} className={dlNum(st, empty ? (i === 0 ? ' is-on' : ' is-far') : '')}>{st.back && <DlBackArrow />}{st.num}</span>)}</div>
    {keys.length > 0 && <div className="pgn3-keys">{keys.map((r) => (
      <span key={r.t} className="pgn3-key"><DlDie r={r} size={44} /><span className="pgn3-name">{pg3Names(m.mom[r.t].kickers).map((k) => <span key={k}>{k}</span>)}</span></span>))}</div>}
  </div>);
};

const PgNow = ({ concept, visits, ended, rolled }) => {
  const s = React.useMemo(() => { const run = dlLongRun(visits, !ended || !rolled); return rolled ? run : { ...run, lines: run.lines.filter((l) => l[0] === 'Room') }; }, [visits, ended, rolled]); const m = React.useMemo(() => dlBuild(s), [s]);
  const result = m.end === 'live' || !rolled ? { kind: 'live', label: 'In progress' } : { kind: m.end === 'won' ? 'ok' : 'bad', label: dlWord(m) };
  const route = <div className="dl-now-route">{concept === '3' || !m.stops.length ? <PgSpread m={m} />
    : concept === '1' ? <div className="pgn-map pgn-c1"><DlMap m={m} stops={m.stops} open={null} onOpen={() => {}} /></div>
    : <PgMap m={m} v={PG_MAPS[2]} concept={concept} />}</div>;
  return !m.stops.length
    ? <LbNowCard gid="delve" className="dl-now pgn-now" title="The Goblin Warren" play={() => {}} next={'Next run: ' + DV_NEXT}>{route}</LbNowCard>
    : <LbNowCard gid="delve" className="dl-now pgn-now" title="The Goblin Warren" result={result} open={() => {}} next={'Next run: ' + DV_NEXT}>{route}</LbNowCard>;
};

// The library page as Delve's, the Now card swapped for the playground's.
const PgLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'delve'); const list = dvRun(gs);
  const concept = usePgSetting('concept'); const visits = +usePgSetting('stops'); const ended = usePgSetting('run') === 'ended'; const rolled = usePgSetting('rolls') !== 'none';
  return (
    <main className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className="lb-lay">
        <PgNow concept={concept} visits={visits} ended={ended} rolled={rolled} />
        <LbRun n={lbStreak(list)} unit="weeks" weeks={lbRunOf(list)} />
        <LbAch items={phAch(gs, 'delve', DV_ACH)} badges={DV_BADGES} access={access} ed={GS_GAMES.delve.ed} />
      </div>
    </main>);
};

export const initPlaygroundNowCard = () => {
  const stops = [20, ...Array.from({ length: 26 }, (_, i) => i).filter((x) => x !== 20)].map((x) => ({ value: String(x), label: String(x) }));
  pgRegister('now-card', { title: 'Delve Now card', settings: [
    { key: 'concept', kind: 'concept', label: 'Concept', options: [{ value: '1', label: '1. Straight lift' }, { value: '2', label: '2. Tighter stops' }, { value: '3', label: '3. Spread stops and key dice' }] },
    { key: 'stops', label: 'Stops visited', options: stops },
    { key: 'rolls', label: 'Rolls', options: [{ value: 'some', label: 'Played' }, { value: 'none', label: 'None yet' }] },
    { key: 'run', label: 'Run', options: [{ value: 'ended', label: 'Ended', state: 'library-delve' }, { value: 'live', label: 'In progress', state: 'library-delve' }] },
  ] });
  if (pgActive()) GS_LIBRARY.delve = PgLibrary;
};
