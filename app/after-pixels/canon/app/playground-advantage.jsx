// ============================================================================
// PLAYGROUND, not canon (branch candidate/delve-session-page): the Delve session page's Advantage tab with the Success streak, the Hit streak and the run's longest streak.
// The concept is where the longest streak sits; Config holds the situation, the marks' wording and the longest streak's value. The counts are set directly, not read from the run.
// The sheet opens on Advantage. Open with ?pg=advantage. To remove it: delete this file and playground-advantage.css, and their lines in main.jsx and canon.css.
// ============================================================================
import React from 'react';
import { useGs } from './gs-data.jsx';
import { GsMoves } from './gs-session.jsx';
import { GS_SESSION_BODY } from './registry.js';
import { dlBuild, dlSheet, DlSheet, DlCard, DlCell, DlInsp, DlPips } from './gs-delve.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

// One entry per situation: the Success streak's count, the Hit streak's, whether a fight is on, and whether the run has ended.
const PG_SITS = {
  scene1: { streak: 1, hits: 0, fight: false, ended: false },
  scene3: { streak: 3, hits: 0, fight: false, ended: false },
  fight2: { streak: 2, hits: 2, fight: true, ended: false },
  fightAfter: { streak: 3, hits: 0, fight: true, ended: false },
  ended: { streak: 2, hits: 0, fight: false, ended: true },
};
// The wording of each marks option: the label and the small line under it, for a mark that is dimmed or not.
const PG_MARKS = {
  1: { s: { label: 'Success streak' }, h: { label: 'Hit streak' } },
  2: { s: { label: 'Success streak', sub: 'Checks', dimSub: 'Not in a fight' }, h: { label: 'Hit streak', sub: 'Fights' } },
};
const pgLongestSay = (n, ended) => (n > 0 ? 'Longest streak ' + n : ended ? 'No streak' : 'No streak yet');

const PgMark = ({ v, n, dim, name, title }) => (
  <DlCell label={<>{v.label}{(dim ? v.dimSub : v.sub) && <small className="dv8-sub">{dim ? v.dimSub : v.sub}</small>}</>} used={dim} title={title}>
    <span className={dim ? 'pga-dim' : ''}><DlPips n={n} lit name={name} /></span>
  </DlCell>);

const pgAdvCells = (c, sit, marks, longest, concept) => {
  const w = PG_MARKS[marks]; const cells = [
    <DlCell key="insp" label="Inspiration" used={!c.insp} title={c.insp ? 'Ready' : 'Spent'}><DlInsp on={c.insp} /></DlCell>,
    <PgMark key="s" v={w.s} n={sit.streak} dim={sit.fight} name="Success streak" title="Successes or hits in a row. From two on, every check outside a fight has advantage." />,
    <PgMark key="h" v={w.h} n={sit.hits} dim={false} name="Hit streak" title="Hits in a row in a fight. At two, the next attack has advantage and resets it." />];
  if (concept === '2') cells.push(<DlCell key="l" label={<>Longest streak<small className="dv8-sub">{sit.ended ? 'This run' : 'So far'}</small></>} used={longest === 0} title="The most the Success streak reached this run, fights included."><span className="dv8-num pga-num">{longest}</span></DlCell>);
  return <>{cells}</>;
};

const PgBody = ({ s }) => {
  const gs = useGs(); const sit = PG_SITS[usePgSetting('sit')]; const marks = usePgSetting('marks'); const concept = usePgSetting('concept'); const longest = +usePgSetting('longest');
  const m = React.useMemo(() => dlBuild(s), [s]); const base = React.useMemo(() => dlSheet(s, m), [s, m]);
  const c = { ...base, advCells: pgAdvCells(base, sit, marks, longest, concept) };
  const say = pgLongestSay(longest, sit.ended);
  const summary = concept === '1' ? <p className={'pga-sum' + (longest === 0 ? ' is-none' : '')}>{say}</p> : null;
  const beside = concept === '3' ? <div className={'pga-tile' + (longest === 0 ? ' is-none' : '')} role="group" aria-label={say}><b>{longest}</b><span>Longest streak</span></div> : null;
  return (<>
    <div className="dv4-lay"><DlSheet key={sit.fight + '' + marks + concept} c={c} openTab="advantage" /><DlCard s={s} m={m} roll={gs.route && gs.route.roll} turn={gs.route && gs.route.turn} summary={summary} beside={beside} /></div>
    <GsMoves s={s} />
  </>);
};

export const initPlaygroundAdvantage = () => {
  const o = (value, label, state) => ({ value, label, ...(state ? { state } : {}) });
  pgRegister('advantage', { title: 'Delve Advantage tab', settings: [
    { key: 'concept', kind: 'concept', label: 'Longest streak', options: [o('1', '1. On the run card'), o('2', '2. Own cell in Advantage'), o('3', '3. Beside the result')] },
    { key: 'sit', label: 'State', options: [
      o('scene1', 'Mid-scene, Success streak 1', 'session-delve-in-progress'), o('scene3', 'Scene with advantage, Success streak 3', 'session-delve-in-progress'),
      o('fight2', 'Mid-fight, Hit streak 2', 'session-delve-fight-live'), o('fightAfter', 'Fight, just after the advantaged attack', 'session-delve-fight-live'), o('ended', 'Run ended', 'session-delve')] },
    { key: 'marks', label: 'Marks', options: [o('1', '1. Plain labels'), o('2', '2. Sub-labels')] },
    { key: 'longest', label: 'Longest streak value', options: ['3', '0', '2', '5'].map((v) => o(v, v)) },
  ] });
  if (pgActive()) GS_SESSION_BODY.delve = (p) => <PgBody key={p.sid} {...p} />;
};
