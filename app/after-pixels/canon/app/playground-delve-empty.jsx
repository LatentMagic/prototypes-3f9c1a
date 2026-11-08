// ============================================================================
// PLAYGROUND, not canon (branch candidate/delve-fight): Delve before anything is played. The session page for an in-progress run with no
// rolls (the whole route drawn empty, the hero's sheet filled, a quiet "No rolls yet" box where the held roll goes), and four drawings of
// the Now card for "not started" and "in progress, nothing played", which share one design. The settings bar (app/playground.jsx) picks
// the view, state, title and hard; open with ?pg=delve-empty. To remove it: delete this file and playground-delve-empty.css, their lines
// in main.jsx and canon.css, and the `export` keywords added in gs-delve.jsx (dlBuild, dlSheet, DlSheet, DlResult, DlStopHead, DlMeter, DL_HEX, useDlNowCols).
// ============================================================================
import React from 'react';
import { useGs, GS_SESSIONS } from './gs-data.jsx';
import { LbHead, LbNowCard, LbRun, lbRunOf, lbStreak } from './gs-library.jsx';
import { DV_NEXT, dvRun } from './gs-delve-library.jsx';
import { DlSheet, DlResult, DlStopHead, DlMeter, dlBuild, dlSheet, DL_HEX, useDlNowCols } from './gs-delve.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_LIBRARY, GS_SESSION_BODY } from './registry.js';

// ---- What the settings choose. ----
// The longest game title canon holds is the Drowned Chapel's (38 characters, level with the Goblin Warren's); the third is a test title of 70.
const PDE_TITLES = { real: 'The Goblin Warren beneath Ashford Mill', longest: 'The Drowned Chapel under Fenwick Marsh', huge: 'The Forgotten Goblin Warren beneath Ashford Mill and the Fenwick Marsh' };
const PDE_ROOMS = 5;
const PDE_THREAT = 12;
// Hard is canon's own: the hard play is Wren (11 hit points); the others are Bryn (13).
const pdeSid = (title, hard) => 'pde-' + title + (hard ? '-hard' : '');
const pdeSet = () => ({ view: usePgSetting('view'), run: usePgSetting('run'), title: usePgSetting('title'), hard: usePgSetting('hard') === 'on' });

// ---- A run with no rolls: begun, nothing recorded. ----
const pdeSession = (title, hard) => ({ ...GS_SESSIONS['delve-live'], pde: true, noEd: true, title: PDE_TITLES[title], setting: PDE_TITLES[title], lines: [], hero: hard ? 'Wren the Rogue' : 'Bryn the Fighter',
  hpMax: hard ? 11 : 13, threat: 0, threatMax: PDE_THREAT, figures: ['Threat 0/' + PDE_THREAT, '0 rolls', 'HP ' + (hard ? 11 : 13) + '/' + (hard ? 11 : 13)],
  tracks: { progress: 1, rooms: PDE_ROOMS, threat: 0, threatMax: PDE_THREAT }, sheet: { used: {}, insp: true } });

const PdeHex = ({ cls = '' }) => (<svg className={'pde-hex ' + cls} viewBox="-5 -5 46 50" aria-hidden="true"><polygon points={DL_HEX} /></svg>);

// ---- Session page, C: the whole route drawn empty (only the first room reached), the quiet box in the held roll's place. ----
const pdeStops = (reached) => Array.from({ length: PDE_ROOMS }, (_, i) => ({ i, num: i + 1, name: i === 0 ? 'First room' : 'Not yet reached', back: false, far: i > 0 || !reached }));
const PdeSession = ({ s }) => {
  const m = React.useMemo(() => dlBuild(s), [s]); const c = React.useMemo(() => dlSheet(s, m), [s, m]);
  return (<>
    <div className="dv4-lay"><DlSheet c={c} streak={0} />
      <section className="dv2 dv7r is-3" aria-label="How the run went"><DlResult s={s} m={m} />
        <div className="dvE-main">
          <div className="dvA2-route is-e is-cols-between" aria-label="The way you went">{pdeStops(true).map((st) => (
            <div key={st.i} className={'dvA2-stop' + (st.far ? ' pde-far' : '')}>
              <DlStopHead st={st} named />
              <div className="dvA2-dice">{st.far ? <PdeHex /> : <i className="dv2-pass" aria-label="No rolls" />}</div>
            </div>))}</div>
          <div className="dvE-side"><div className="pde-wait"><PdeHex /><b>No rolls yet</b></div></div>
        </div>
      </section>
    </div>
  </>);
};
// KEEP: under ?pg=delve-empty the session body is the empty run when the open session is one of this playground's, canon's otherwise.
const PdeBodyOf = (Orig) => (p) => (p.s && p.s.pde ? <PdeSession s={p.s} /> : <Orig {...p} />);

// ---- Now card. One design for both states; the state moves only the button, and which room (or hero) is lit. ----
// In progress carries canon's In progress tag at the top right; not started has none.
// B: the run drawn empty, as Where's not-started card draws its board. C: the week's threat at nothing. D: the rooms as one row.
// E: the three heroes the run can start with. Concept ids are the letters the user is shown.
const PdeStops = ({ started }) => { const [ref, cols] = useDlNowCols(PDE_ROOMS);
  return (<div className="dl-now-route"><div className="dl-now-stops" ref={ref} style={{ '--dl-cols': cols }} aria-label="The way you went">{pdeStops(started).map((st, i) => {
    const edge = (i % cols === 0 ? ' is-row-start' : '') + (i % cols === cols - 1 || i === PDE_ROOMS - 1 ? ' is-row-end' : '');
    return (<div key={st.i} className={'dl-now-stop' + edge + (st.far ? ' pde-far' : '')}>
      <DlStopHead st={st} />
      {st.far ? <PdeHex /> : <i className="dv2-pass" aria-label="No rolls" />}
    </div>); })}</div></div>); };
const PdeRitual = () => (<div className="pde-ritual"><DlMeter label="Threat" n={0} of={PDE_THREAT} /><p className="gs-muted">{PDE_ROOMS} rooms</p></div>);
const PdeStrip = ({ started }) => (<div className="pde-strip" role="img" aria-label={PDE_ROOMS + ' rooms, ' + (started ? 'in the first' : 'none reached')}>
  <div className="pde-strip-row" aria-hidden="true">{pdeStops(started).map((st, i) => (<React.Fragment key={st.i}>{i > 0 && <i className="pde-link" />}<span className={'dv2-num' + (st.far ? ' pde-far-num' : '')}>{st.num}</span></React.Fragment>))}</div>
  <p className="gs-muted">{PDE_ROOMS} rooms</p></div>);
const PDE_HEROES = [['Fighter', 'F'], ['Rogue', 'R'], ['Wizard', 'W']];
const PdeHeroes = ({ started, hard }) => (<div className="pde-heroes" role="img" aria-label={started ? (hard ? 'Rogue' : 'Fighter') + ' chosen' : 'Fighter, Rogue or Wizard to choose'}>{PDE_HEROES.map(([n, l]) => (
  <span key={n} className={'pde-hero' + (started && n === (hard ? 'Rogue' : 'Fighter') ? ' is-on' : '')}><svg className="pde-hex" viewBox="-5 -5 46 50" aria-hidden="true"><polygon points={DL_HEX} /><text x="18" y="21">{l}</text></svg><span>{n}</span></span>))}</div>);
const PDE_NOW = { b: PdeStops, c: PdeRitual, d: PdeStrip, e: PdeHeroes };

const PdeNow = ({ title, started, hard, concept, sid }) => { const gs = useGs(); const Body = PDE_NOW[concept];
  return (<LbNowCard gid="delve" className={'dl-now pde-now pde-' + concept} title={PDE_TITLES[title]} result={started ? { kind: 'live', label: 'In progress' } : undefined} play={started ? undefined : () => gs.play('Delve')} open={() => gs.go('session', { id: sid })} next={'Next run: ' + DV_NEXT}>
    <Body started={started} hard={hard} /></LbNowCard>); };

// The library game page around the card, as canon's (DvLibrary): the card and the streak card beside it.
const PdeLibrary = () => { const gs = useGs(); const { view, run, title, hard } = pdeSet(); const list = dvRun(gs);
  return (<main className="gs-wrap gs-main"><LbHead id="delve" />
    <div className="lb-lay">
      <PdeNow title={title} started={run === 'live'} hard={hard} concept={view.replace('now-', '')} sid={pdeSid(title, hard)} />
      <LbRun n={lbStreak(list)} unit="weeks" weeks={lbRunOf(list)} />
    </div></main>); };

// Opens the page the settings name. Session titles come from the session, so a change of title or hard opens its session again.
const pdeReopen = (gs) => { const q = new URLSearchParams(window.location.search); const title = q.get('title') || 'real'; const hard = q.get('hard') === 'on';
  if ((q.get('view') || 'session') === 'session') gs.go('session', { id: pdeSid(title, hard) }); else gs.go('delve', { page: 'record' }); };

export const initPlaygroundDelveEmpty = () => {
  pgRegister('delve-empty', { title: 'Delve empty states', settings: [
    { key: 'view', kind: 'concept', label: 'Page / Now card concept', options: [
      { value: 'session', label: 'Session page (C)', state: 'session-delve-in-progress', go: pdeReopen },
      { value: 'now-b', label: 'Now card B: run drawn empty', state: 'library-delve-in-progress', go: pdeReopen },
      { value: 'now-c', label: 'Now card C: threat at nothing', state: 'library-delve-in-progress', go: pdeReopen },
      { value: 'now-d', label: 'Now card D: rooms in a row', state: 'library-delve-in-progress', go: pdeReopen },
      { value: 'now-e', label: 'Now card E: choose a hero', state: 'library-delve-in-progress', go: pdeReopen }] },
    { key: 'run', label: 'Now card state', options: [{ value: 'not-started', label: 'Not started' }, { value: 'live', label: 'In progress, nothing played' }] },
    { key: 'title', label: 'Title', options: [
      { value: 'real', label: 'The Goblin Warren beneath Ashford Mill', go: pdeReopen }, { value: 'longest', label: 'Longest canon holds', go: pdeReopen }, { value: 'huge', label: 'Oversized, 70 characters', go: pdeReopen }] },
    { key: 'hard', label: 'Hard', options: [{ value: 'off', label: 'Off', go: pdeReopen }, { value: 'on', label: 'On', go: pdeReopen }] },
  ] });
  if (!pgActive()) return;
  ['real', 'longest', 'huge'].forEach((t) => [false, true].forEach((h) => { GS_SESSIONS[pdeSid(t, h)] = pdeSession(t, h); }));
  GS_SESSION_BODY.delve = PdeBodyOf(GS_SESSION_BODY.delve);
  GS_LIBRARY.delve = PdeLibrary;
};
