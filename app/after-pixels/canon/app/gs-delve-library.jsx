import React from 'react';
import { GS_RESULT, GS_SESSIONS, useGs, DS, gsFresh, GS_GAMES } from './gs-data.jsx';
import { gsShareText } from './gs-session.jsx';
import { lbAutoBadges, LbResult, LbShare, lbAccess, lbWeekDone, LbHead, LbFreshNow, LbRun, lbStreak, lbRunOf, LbAch } from './gs-library.jsx';
import { phVisible, phAch, LbRecent } from './gs-history.jsx';
import { GsNextLink } from './gs-pass-library.jsx';
import { DlNow } from './gs-delve.jsx';
import { GS_LIBRARY } from './registry.js';

export let DV_END;
let DV_RUN1;
export let DV_ALL;
export let DV_LIVE;
export let DV_DONE;
let DV_ROOMS;
let DV_RITUAL;
export let DV_NEXT;
// The game's five achievements (verbatim), each earned by the first play in the record that meets it. Run 1's finished play
// (Bryn: a streak of five strong hits, HP 9 of 13) meets Hot Streak only. Every run with an ending counts as completed.
const dvEnded = (ps) => ps.filter((p) => !!p.src.end);
export let DV_ACH;
export let DV_BADGES;
export const dvStatus = (s) => (!s.played ? { kind: 'none', label: 'Not played' } : !s.end ? { kind: 'live', label: 'In progress' } : DV_END[s.end]);
const dvGo = (gs, sid) => gs.go('delve', sid ? { page: 'record', sid } : { page: 'record' });
export let DV_FIRST;
export const dvSid = (s) => (s === DV_FIRST || (s && s.id === DV_FIRST.id) ? 'delve-first' : 'delve-' + s.id);

// The bar: rooms reached of the run's rooms. The recap: the deployed lines.
export const dvBar = (s) => [s.rooms + ' of ' + DV_ROOMS + ' rooms reached', s.rooms, DV_ROOMS];
export const dvRecap = (s) => (s.end
  ? 'You played ' + s.hero + ' and won in ' + s.rolls + ' rolls, with the ritual ' + s.ritual + ' of ' + DV_RITUAL + ' along.'
  : 'You’re playing ' + s.hero + ', ' + s.rooms + ' of ' + DV_ROOMS + ' rooms in, with the ritual ' + s.ritual + ' of ' + DV_RITUAL + '.');
// Every week's run counts once it reaches any ending, won or not (completed weeks in a row), as the record holds it.
export const dvRun = (gs) => { const by = {}; phVisible(gs).forEach((p) => { if (p.gid === 'delve' && p.status.kind !== 'live') by[p.ed] = true; });
  return DV_ALL.map((s) => ({ ...s, played: !!by[s.id], done: !!by[s.id], failed: false })); };

// Delve's own now card (app/gs-delve.jsx, 1236) takes this one's place once it has loaded.
const DvNow = ({ s }) => {
  const gs = useGs(); if (DlNow) return <DlNow s={s} />;
  // The one share text for this result: the session page's (gsShareText).
  const lines = s.end && gsShareText(GS_SESSIONS.delve); const bar = dvBar(s);
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{s.title}</h2></div>
        {s.end && <span className="lb-big"><LbResult s={dvStatus(s)} /></span>}
      </div>
      <p>{dvRecap(s)}</p>
      <DS.ProgressBar label={bar[0]} value={bar[1]} max={bar[2]} showValue={false} />
      <div className="lb-foot">
        <div className="lb-acts">
          {lines && <LbShare lines={lines} />}
          <DS.TextLink onClick={() => gs.go('session', { id: s.end ? 'delve' : 'delve-live' })}>{s.end ? 'See every roll' : 'See your rolls so far'}</DS.TextLink>
        </div>
        <span className="gs-muted">{'Next run: ' + DV_NEXT}</span>
      </div>
      {s.end && GsNextLink && <GsNextLink />}
    </section>
  );
};
const DvLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'delve'); const pass = access === 'all'; const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '');
  const fresh = gsFresh(gs);
  const ach = phAch(gs, 'delve', DV_ACH);
  const list = dvRun(gs);
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className="lb-lay">
        {fresh ? <LbFreshNow title={DV_RUN1.title} line="You haven’t started this week’s run yet. Get her out before the ritual is complete." next={'Next run: ' + DV_NEXT} onPlay={() => gs.play('Delve')} /> : <DvNow s={lbWeekDone(gs) ? DV_DONE : DV_LIVE} />}
        <LbRun n={lbStreak(list)} unit="weeks" weeks={lbRunOf(list)} />
        <LbAch items={ach} badges={DV_BADGES} access={access} ed={GS_GAMES.delve.ed} />
        <LbRecent title="Your runs" allLabel="See in History" empty="Your runs appear here once you have played one." />
      </div>
    </main>
  );
};
export const registerDelveLibrary = () => { GS_LIBRARY.delve = DvLibrary; };

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsDelveLibrary() {
// ============================================================================
// After Pixels — Delve's library page.
// This week's run: the ending beside the title, rooms reached as the bar. Weeks in a row. The game's five achievements.
// Your runs. One run so far: No. 1, The Goblin Warren beneath Ashford Mill, both the free
// first run and this week's. Its finished form is session 'delve' (Bryn, won), its in-progress form 'delve-live' (Wren).
// Without the Pass the page is replaced by gs-pass-library.jsx (CprDvLibrary); a Pass holder gets this one.
// ============================================================================
DV_END = { won: { kind: 'ok', label: GS_RESULT.delve({ end: 'won' }) }, ritual: { kind: 'bad', label: GS_RESULT.delve({ end: 'ritual' }) }, fell: { kind: 'bad', label: GS_RESULT.delve({ end: 'fell' }) } };
DV_RUN1 = { id: 'dv0', d: new Date(2026, 9, 5), date: '5 October', month: 'October', title: 'The Goblin Warren beneath Ashford Mill', played: true, end: null };
// Every run, newest first.
DV_ALL = [DV_RUN1];
DV_LIVE = { ...DV_RUN1, hero: 'Wren', heroFull: 'Wren the Rogue', rolls: 8, rooms: 4, ritual: 3 };
// streak: the run's longest run of strong hits (its share card: longest streak 5).
DV_DONE = { ...DV_RUN1, hero: 'Bryn', heroFull: 'Bryn the Fighter', end: 'won', rolls: 11, rooms: 5, ritual: 5, streak: 5 };
DV_ROOMS = 5;
DV_RITUAL = 12;
DV_NEXT = 'Monday 12 October';
DV_ACH = [
  { k: 'untouched', n: 'Untouched', how: 'Win a run without losing a hit point.', first: true, by: (p) => p.src.end === 'won' && !!p.src.unhurt },
  { k: 'streak', n: 'Hot Streak', how: 'Land three strong hits in a row.', first: true, by: (p) => (p.src.streak || 0) >= 3 },
  { k: 'enemy', n: 'Know Thy Enemy', how: 'Bring down a foe by what it fears.', first: true },
  { k: 'regular', n: 'Regular', how: 'Complete four weeks in a row.', of: 4, count: dvEnded },
  { k: 'ten', n: 'Ten Runs', how: 'Complete ten runs.', of: 10, count: dvEnded },
];
DV_BADGES = lbAutoBadges(DV_ACH);
// Run 1 is the free first run as well as this week's: one record.
DV_FIRST = DV_RUN1;
// The free first run's record is run 1's: aliases kept for every file that reads them.
GS_SESSIONS['delve-first'] = GS_SESSIONS.delve;
}
