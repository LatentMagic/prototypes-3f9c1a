import React from 'react';
import { GS_RESULT, GS_SESSIONS, useGs, GS_GAMES, gsEdPick, gsSessStatus } from './gs-data.jsx';
import { lbAutoBadges, lbAccess, lbWeekDone, lbNow, LbHead, LbRun, lbStreak, lbRunOf, LbAch } from './gs-library.jsx';
import { phVisible, phAch, LbRecent, edRuns } from './gs-history.jsx';
import { DlNow, DlNowEmpty } from './gs-delve.jsx';
import { GS_LIBRARY, GS_EDITIONS } from './registry.js';

export let DV_END;
let DV_RUN1;
export let DV_ALL;
export let DV_LIVE;
export let DV_DONE;
let DV_ROOMS;
let DV_RITUAL;
export let DV_NEXT;
// The game's five achievements (verbatim), each earned by the first play in the record that meets it. Run 1's finished play
// (Bryn: a longest streak of three, HP 22 of 23) meets Hot Streak, and Know Thy Enemy by the weakness strike on its climax foe. Regular and Ten Runs count finished runs, won or not: a play whose status is not live
// (Config → This edition: Failed or Hard still counts).
const dvEnded = (ps) => ps.filter((p) => p.status.kind !== 'live');
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
// A week's run counts as completed when it was won, as the record holds it (this week's follows Config → This edition); a run lost is played, not completed.
export const dvRun = (gs) => { const by = {}; phVisible(gs).forEach((p) => { if (p.gid === 'delve' && p.status.kind !== 'live') by[p.ed] = p.status.kind; });
  return DV_ALL.map((s) => ({ ...s, played: !!by[s.id], done: by[s.id] === 'ok', failed: by[s.id] === 'bad' })); };

const DvLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'delve'); const pass = access === 'all'; const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '');
  const fresh = !lbNow(gs, 'delve');
  const ach = phAch(gs, 'delve', DV_ACH);
  const list = dvRun(gs);
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className="lb-lay">
        {fresh ? <DlNowEmpty title={DV_RUN1.title} rooms={DV_ROOMS} next={'Next run: ' + DV_NEXT} onPlay={() => gs.play('Delve')} /> : <DlNow s={lbWeekDone(gs) ? DV_DONE : DV_LIVE} />}
        <LbRun n={lbStreak(list)} unit="weeks" weeks={lbRunOf(list)} />
        <LbAch items={ach} badges={DV_BADGES} access={access} ed={GS_GAMES.delve.ed} />
        <LbRecent title="Your runs" allLabel="See in History" empty="Your runs appear here once you have played one." />
      </div>
    </main>
  );
};
export const registerDelveLibrary = () => {
  GS_LIBRARY.delve = DvLibrary;
  GS_EDITIONS.delve = (gs) => edRuns(gs, 'delve', { all: DV_ALL, done: DV_DONE, doneStatus: (g) => gsSessStatus(GS_SESSIONS[gsEdPick('delve', g) || 'delve']), status: dvStatus, openCur: (g) => g.go('session', { id: 'delve' }), open: (g, x) => g.go('session', { id: dvSid(x) }) });
};

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
// streak: the run's longest run of strong hits (its share card: longest streak 3).
DV_DONE = { ...DV_RUN1, hero: 'Bryn', heroFull: 'Bryn the Fighter', end: 'won', rolls: 11, rooms: 5, ritual: 5, streak: 3, lines: GS_SESSIONS.delve.lines };
// KEEP: the room count, the threat's name and maximum, and the carry limit come from the run's edition (5 or 6 rooms, threat 12 to 24 deployed), never fixed at 5 and 12.
DV_ROOMS = 5;
DV_RITUAL = 12;
DV_NEXT = 'Monday 12 October';
DV_ACH = [
  { k: 'untouched', n: 'Untouched', how: 'Win a run without losing a hit point.', first: true, by: (p) => p.src.end === 'won' && !!p.src.unhurt },
  { k: 'streak', n: 'Hot Streak', how: 'Land three hits or successes in a row.', first: true, by: (p) => (p.src.streak || 0) >= 3 },
  { k: 'enemy', n: 'Know Thy Enemy', how: 'Bring down a foe by what it fears.', first: true, by: (p) => p.src.end === 'won' && (p.src.lines || []).some((l) => l[0] === 'Weakness') },
  { k: 'regular', n: 'Regular', how: 'Complete four weeks in a row.', of: 4, count: dvEnded },
  { k: 'ten', n: 'Ten Runs', how: 'Complete ten runs.', of: 10, count: dvEnded },
];
DV_BADGES = lbAutoBadges(DV_ACH);
// Run 1 is the free first run as well as this week's: one record.
DV_FIRST = DV_RUN1;
// The free first run's record is run 1's: aliases kept for every file that reads them.
GS_SESSIONS['delve-first'] = GS_SESSIONS.delve;
}
