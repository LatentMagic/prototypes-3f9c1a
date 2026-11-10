// ============================================================================
// PLAYGROUND, not canon (branch candidate/delve-fight): two designs of Delve's held roll when it sits above the horizontal route
// (the stacked layout, a long run in a window of about 900 to 1150px), beside canon's own. Open with ?pg=delve-held on session-delve-hard.
// The beside layout and the phone list stay canon. To remove it: delete this file and playground-delve-held.css, and their lines in main.jsx and canon.css.
// ============================================================================
import React from 'react';
import { DL_HELD_VIEW, DlDie, DlFoeDie, DlMeter, dlGrade } from './gs-delve.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

// Each fact is a label over its value, so a row of them reads side by side.
const Fact = ({ label, children, tone }) => (<div className="pgh-fact"><dt>{label}</dt><dd className={tone ? 'is-' + tone : undefined}>{children}</dd></div>);

const facts = (r) => { const tone = r.fumble ? 'fumble' : r.tier; return {
  room: <Fact label="Room">{(r.back ? 'Back in ' : '') + r.room}</Fact>,
  used: r.use && <Fact label="Used">{r.name}{r.does && <> <span className="is-does">{r.does}</span></>}</Fact>,
  action: !r.use && r.action && <Fact label="Action">{r.action}{r.move && <> <span>{r.move}</span></>}</Fact>,
  roll: !r.use && <Fact label="Roll">{r.stat} {r.total} <span>vs {r.dc}</span></Fact>,
  outcome: !r.use && <Fact label="Outcome" tone={tone}>{dlGrade(r)}</Fact>,
  cost: r.harm > 0 && !r.foe && <Fact label="Cost">Lost {r.harm} HP</Fact>,
  foe: r.foe && <Fact label="Foe roll"><span className="pgh-foe"><DlFoeDie f={r.foe} /><b className={r.foe.hit ? 'is-err' : ''}>{r.foe.hit ? 'Hit you for ' + r.foe.dmg : 'Missed you'}</b> <span>vs defence {r.foe.dc}</span></span></Fact>,
  meter: (r.foe || r.downed) && <div className="pgh-meter"><DlMeter label={(r.foe || r.downed).name} n={r.foe ? r.foe.health : 0} of={(r.foe || r.downed).max} /></div>,
}; };

const Head = ({ r, x }) => (
  <div className="pgh-head"><DlDie r={r} size={52} surface="popup" />
    <div className="dv3-hk"><p className="dv3-k">{r.use ? r.what : x ? x.kicker : 'Roll ' + r.n}</p>{x && <p className="dv3-n">Roll {r.n}</p>}{r.downed && <p className="dv3-beat">{r.downed.name} beaten</p>}</div></div>);

// 2 · Two lines with a story: the player's move on line 1, the foe's answer alone on line 2, its diamond leading it under a rule of its own.
const View2 = ({ r, x }) => { const f = facts(r); return (
  <div className="pgh-body is-v2"><Head r={r} x={x} />
    <div className="pgh-lines">
      <dl className="pgh-line">{f.room}{f.used}{f.action}{f.roll}{f.outcome}{f.cost}</dl>
      {(r.foe || r.downed) && <dl className="pgh-line is-foe">{f.foe}{f.meter}</dl>}
    </div></div>); };

// 3 · A story in three steps, left to right: what you tried (room, action) → the roll (roll, outcome) → what it cost (cost; the foe's roll and health).
// Each step is a column with a rule before it; the rows line up across the columns.
const View3 = ({ r, x }) => { const f = facts(r);
  const cols = [[f.room, f.used, f.action], [f.roll, f.outcome], [f.cost, f.foe, f.meter]].map((c) => c.filter(Boolean)).filter((c) => c.length);
  return (<div className="pgh-body is-v3"><Head r={r} x={x} />
    <dl className="pgh-steps" style={{ '--pgh-n': cols.length }}>{cols.map((c, i) => <div key={i} className="pgh-step">{c.map((n, j) => <React.Fragment key={j}>{n}</React.Fragment>)}</div>)}</dl></div>); };

const Held = ({ v, r, x, live }) => (
  <div className="dv3-live" aria-live={live ? 'polite' : undefined}><div className={'dv3-held pgh-held' + (x ? ' is-mo' : '')}>{x && <i className="dv3-mk" role="img" aria-label="Key moment" />}
    {v === '2' ? <View2 r={r} x={x} /> : <View3 r={r} x={x} />}</div></div>);

// The settings bar changes the version; canon's held roll calls this view only while the playground is open; version "now" hands canon's own element back.
const PgView = ({ canon, ...p }) => { const v = usePgSetting('version'); return v === 'now' ? canon : <Held v={v} {...p} />; };

export const initPlaygroundDelveHeld = () => {
  pgRegister('delve-held', { title: 'Delve held roll', settings: [
    { key: 'version', kind: 'concept', label: 'Version', options: [{ value: 'now', label: 'Now (canon)', state: 'session-delve-hard' }, { value: '2', label: '2 Two lines with a story', state: 'session-delve-hard' }, { value: '3', label: '3 Three steps', state: 'session-delve-hard' }] },
    // The route opens on a roll a die was pressed for (gs.route.roll); these open the hard run on one, to reach a foe or none without a click.
    { key: 'roll', label: 'Roll opened', options: [
      { value: 'last', label: 'Last roll (24, foe)', state: 'session-delve-hard' },
      ...[[2, 'Foe hit back'], [4, 'Foe beaten'], [6, 'Foe, two dice'], [1, 'No foe, natural 1'], [10, 'Action, partial'], [14, 'Action, success'], [15, 'Action, failure']].map(([n, l]) => ({ value: String(n), label: n + ' ' + l, state: 'session-delve-hard', go: (gs) => gs.go('session', { id: 'delve-hard', roll: n }) })),
    ] },
  ] });
  if (pgActive()) DL_HELD_VIEW.stacked = (p) => <PgView {...p} />;
};
