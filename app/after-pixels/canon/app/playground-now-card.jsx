// ============================================================================
// PLAYGROUND, not canon (branch candidate/delve-session-page): the Delve Now card with the session page's route map in place of its room strip and key dice.
// 1 is the map as canon draws it; 2 and 3 keep the map close to a rectangle of the card's old height; 4 is the run's last stops beside its key moments. Nothing in the display is pressable.
// The settings bar (app/playground.jsx) picks the concept, the room visits and whether the run is in progress or ended; open with ?pg=now-card.
// To remove it: delete this file and playground-now-card.css, and their lines in main.jsx and canon.css. Styles: app/playground-now-card.css.
// ============================================================================
import React from 'react';
import { GS_SESSIONS, GS_GAMES, useGs } from './gs-data.jsx';
import { lbAccess, LbHead, LbNowCard, LbRun, lbStreak, lbRunOf, LbAch } from './gs-library.jsx';
import { phAch } from './gs-history.jsx';
import { DV_ACH, DV_BADGES, DV_NEXT, dvRun } from './gs-delve-library.jsx';
import { dlBuild, dlWord, dlNum, DlMap, DlMapMarks, DlBackArrow, DlDie, useDlWidth } from './gs-delve.jsx';
import { dlLongRun } from './gs-delve-runs.jsx';
import { GS_LIBRARY } from './registry.js';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

// Concepts 2 and 3 draw the map's stops in equal columns that share the card's whole width, so a map never reaches past the card's content edges.
// KEEP: concept 2's stops never sit closer than a 48px column, the spacing of the liked two-row map, so a wide card wraps its stops into evened rows instead of squeezing them onto one.
// KEEP: concept 2's stops never sit closer than a 46px column (about the spacing of the two rows of ten, 20 stops on a phone-to-tablet card), so a wide card wraps its stops into evened rows instead of squeezing them onto one.
// col: the narrowest a stop's column may be, which sets how many stops one row holds; box: the number box; die, dot: the marks under a stop.
const PG_MAPS = {
  2: { col: 46, box: 24, die: 20, dot: 7, font: 12 },
  3: { col: 22, box: 18, die: 16, dot: 6, font: 11 },
};

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


// Concept 4: one band of the run's last stops (the route's boxes, joined by its line) and its key moments (the dice, Latest roll first, each named beneath).
// KEEP: the band is one row while the stops sit in the room left of the dice: the dice are centred on the card whatever the stops, so the room is half of what is left after four dice slots; below that width it folds into two rows (stops above, dice below, still centred) by that one rule.
// KEEP: the four dice slots are reserved whether one die or four stand, so the shape does not move; a run with no roll draws no moments at all, and the stops alone fill the band.
const PG4_STOP = 34; const PG4_SLOT = 56; const PG4_GAP = 6;
const PG4_FOLD = (n) => (el) => el.clientWidth >= 4 * PG4_SLOT + 3 * PG4_GAP + 2 * n * PG4_STOP;
const PgRecent = ({ m, last }) => {
  const stops = m.stops.slice(-last); const keys = m.turns.filter((r) => m.mom[r.t] && !r.lost).reverse().slice(0, 4);
  const ref = React.useRef(null); const measure = React.useMemo(() => PG4_FOLD(stops.length), [stops.length]); const wide = useDlWidth(ref, measure, true);
  return (<div ref={ref} className={'pgn4' + (keys.length && wide ? ' is-row' : '') + (keys.length ? '' : ' is-alone')} role="group" aria-label="Recent stops and key moments">
    <div className="pgn4-stops" style={{ '--n': stops.length }} role="img" aria-label={'The last ' + stops.length + ' stops'}>
      <div className="dl-now-boxes">{stops.map((st) => <span key={st.i} className={dlNum(st)}>{st.back && <DlBackArrow />}{st.num}</span>)}</div></div>
    {keys.length > 0 && <div className="pgn4-keys">{keys.map((r) => (
      <span key={r.t} className="pgn4-key"><DlDie r={r} size={34} /><span className="pgn4-name">{m.mom[r.t].kickers.map((k) => <span key={k}>{k}</span>)}</span></span>))}</div>}
  </div>);
};

const PgNow = ({ concept, visits, ended, last, rolled }) => {
  const s = React.useMemo(() => { const run = dlLongRun(visits, !ended || !rolled); return rolled ? run : { ...run, lines: run.lines.filter((l) => l[0] === 'Room') }; }, [visits, ended, rolled]); const m = React.useMemo(() => dlBuild(s), [s]);
  const result = m.end === 'live' || !rolled ? { kind: 'live', label: 'In progress' } : { kind: m.end === 'won' ? 'ok' : 'bad', label: dlWord(m) };
  return (
    <LbNowCard gid="delve" className="dl-now pgn-now" title="The Goblin Warren" result={result} open={() => {}} next={'Next run: ' + DV_NEXT}>
      <div className="dl-now-route">{concept === '4' ? <PgRecent m={m} last={last} />
        : concept === '1'
        ? <div className="pgn-map pgn-c1"><DlMap m={m} stops={m.stops} open={null} onOpen={() => {}} /></div>
        : <PgMap m={m} v={PG_MAPS[concept]} concept={concept} />}</div>
    </LbNowCard>);
};

// The library page as Delve's, the Now card swapped for the playground's.
const PgLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'delve'); const list = dvRun(gs);
  const concept = usePgSetting('concept'); const visits = +usePgSetting('rooms'); const ended = usePgSetting('run') === 'ended'; const last = +usePgSetting('recent'); const rolled = usePgSetting('rolls') !== 'none';
  return (
    <main className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className="lb-lay">
        <PgNow concept={concept} visits={visits} ended={ended} last={last} rolled={rolled} />
        <LbRun n={lbStreak(list)} unit="weeks" weeks={lbRunOf(list)} />
        <LbAch items={phAch(gs, 'delve', DV_ACH)} badges={DV_BADGES} access={access} ed={GS_GAMES.delve.ed} />
      </div>
    </main>);
};

export const initPlaygroundNowCard = () => {
  const rooms = [20, ...Array.from({ length: 25 }, (_, i) => i + 1).filter((x) => x !== 20)].map((x) => ({ value: String(x), label: String(x) }));
  pgRegister('now-card', { title: 'Delve Now card', settings: [
    { key: 'concept', kind: 'concept', label: 'Concept', options: [{ value: '1', label: '1. Straight lift' }, { value: '2', label: '2. One row where it fits' }, { value: '3', label: '3. Tighter stops' }, { value: '4', label: '4. Recent stops and moments' }] },
    { key: 'recent', label: 'Recent stops', options: [4, 5, 6, 7, 8].map((x) => ({ value: String(x), label: String(x) })), when: { key: 'concept', value: '4' } },
    { key: 'rolls', label: 'Rolls', options: [{ value: 'some', label: 'Played' }, { value: 'none', label: 'None yet' }], when: { key: 'concept', value: '4' } },
    { key: 'rooms', label: 'Room visits', options: rooms },
    { key: 'run', label: 'Run', options: [{ value: 'ended', label: 'Ended', state: 'library-delve' }, { value: 'live', label: 'In progress', state: 'library-delve' }] },
  ] });
  if (pgActive()) GS_LIBRARY.delve = PgLibrary;
};
