// ============================================================================
// After Pixels — Delve's long and detailed sample runs, for the session page and the Now card at their worst (hard states):
// a 20-stop and a 25-stop route with returns, a run that earns all five key moments (one roll earning two), a fight in progress and a fight lost.
// Each run is written as dice and turned into the record's lines, plus `detail` (the bonuses named, the damage roll, the foe's bonus) that app/gs-delve.jsx reads by roll number, by app/gs-delve-record.jsx.
// SAMPLE: the dice and damage faces below; every bonus, grade, damage and health follows from the game's rules there.
// Loads after app/gs-delve.jsx, whose sessions it copies.
// ============================================================================
import { GS_SESSIONS, GS_DV_TURNCOAT } from './gs-data.jsx';
import { dlRecorder, dlRecord, dlFigures } from './gs-delve-record.jsx';

// Seeded dice, so the long runs are the same every load.
const seeded = (seed) => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

// The long route: 25 stops over 13 rooms, 12 of them returns (the first 20 stops: 12 rooms, 8 returns); the names are the longest the editions hold (the 31-character "The shrine of the drowned saint").
const ROUTE = [['the gate'], ["snaggle's den"], ['the gate', 1], ['the chime run'], ['the flooded cellar'], ['the chime run', 1], ['the shrine of the drowned saint'], ['the armoury'], ['the shrine of the drowned saint', 1],
  ['the well shaft'], ['the barracks'], ['the well shaft', 1], ['the chapel'], ['the crypt'], ['the chapel', 1], ['the bone pit'], ['the treasury'], ['the bone pit', 1], ['the crypt', 1], ['the treasury', 1],
  ['the great hall'], ['the crypt', 1], ['the great hall', 1], ['the chapel', 1], ['the great hall', 1]];
const ROLLS = [1, 3, 0, 3, 1, 0, 4, 2, 1, 2, 3, 0, 1, 2, 0, 3, 1, 1, 0, 1, 4, 1, 2, 0, 0];
const CHECKS = [['Strength', 'Force the door', 'Athletics'], ['Wisdom', 'Listen at the wall', 'Perception'], ['Dexterity', 'Slip the trap', null], ['Constitution', 'Hold your breath', null]];
// The threat is full on the run's last turn and not before: every going back costs 1, so the 25-stop run (12 returns) fills it on its last return and every roll before it succeeds;
// the 20-stop run (8 returns) adds a natural 1 on the chime run (2), a failed check in the well shaft (1) and a failed check that is its last roll (1).
const MISS = (n, i, k) => n === 20 && ((i === 3 && k === 0) || (i === 9 && k === 0) || (i === 19 && k === 0));
const FOE_ROOMS = ["snaggle's den", 'the great hall'];
function longRoute(n, live) {
  const rnd = seeded(7); const rec = dlRecorder('Bryn the Fighter', 24, { name: 'delve-route-' + n + (live ? '-live' : '') }); const die = () => 10 + Math.floor(rnd() * 10);
  const blow = () => ({ faces: [1 + Math.floor(rnd() * 4), 1 + Math.floor(rnd() * 4)], foe: { roll: 3 + Math.floor(rnd() * 17), faces: [1 + Math.floor(rnd() * 3), 1 + Math.floor(rnd() * 3)] } });
  ROUTE.slice(0, n).forEach(([name, back], i) => {
    rec.step(back && !(live && i === 24) ? 'back' : 'room', live && i === 24 ? 'the watchtower' : name);
    for (let k = 0; k < ROLLS[i]; k += 1) {
      const lose = !live && MISS(n, i, k); const nat1 = lose && i === 3;
      const d = nat1 ? 1 : lose ? 3 : i === 6 && k === 1 ? 20 : die();
      if (FOE_ROOMS.includes(name) && rec.foeLeft() > 0) rec.step('atk', d, { ...blow(), heavy: k === 0 });
      else { const c = CHECKS[(i + k) % 4]; rec.step('chk', c[0], c[1], c[2], d, lose ? 15 : 10, { harm: 1, threat: lose ? (nat1 ? 2 : 1) : 0 }); }
    }
    // A foe still standing when the room's rolls are spent is fought to the end before the hero goes on.
    while (FOE_ROOMS.includes(name) && rec.foeLeft() > 0) rec.step('atk', 14, blow());
  });
  return rec.done();
}

// A long run lost to the ritual, ended: the most going back the editions allow, the hero still standing. The 25-stop run fills the threat on its last going back, so it ends on the loss cross.
// n is the number of room visits (1 to 25); `live` makes it a run still in progress.
export const dlLongRun = (n, live = false) => { const rec = longRoute(n, live); const stops = ROUTE.slice(0, n).map((r, i) => live && i === 24 ? ['the watchtower'] : r); const rooms = new Set(stops.map((r) => r[0])).size;
  return { ...GS_SESSIONS['delve-hard'], hero: 'Bryn the Fighter', hpMax: 24, threat: rec.threat, foeMax: { "snaggle's den": 27, 'the great hall': 16 }, foeName: {}, lightName: 'the torch', light: 0, lightMax: 6,
    ...(n === 25 && !live ? { lostOff: { over: true, name: 'Going back' } } : {}), ...(live ? { live: true, loss: false, end: null, lostOff: null, result: 'In progress', reached: 'In progress', share: 'In progress' } : { result: 'Too late: the chant was completed', reached: 'Too late: the chant was completed', share: 'Too late: the chant was completed' }),
    figures: dlFigures(rec, 24), tracks: { progress: n, rooms, threat: rec.threat, threatMax: 12 }, lines: rec.lines, detail: rec.detail }; };

// A won run that earns all five key moments: Worst roll (a natural 1), Closest call (10 against 10), Best roll and Biggest hit on one roll (a natural 20 Cleave), and the Winning blow.
// `five` is the variant whose Biggest hit is another roll than the natural 20 (a Cleave of 9 against the critical's 7): five moments on five rolls.
const keyMoments = (five) => dlRecord('Bryn the Fighter', 24, [
  ['chk', 'Wisdom', "Search the lock-keeper's niche", 'Perception', 11, 10],
  ['room', 'the chime run'],
  ['chk', 'Dexterity', 'Slip past the chimes', null, 9, 10],
  ['room', 'the warren'], ['raw', ['Turn', 'The turncoat joins', GS_DV_TURNCOAT]],
  ['atk', 14, { faces: [3], foe: { roll: 3 } }], ['atk', 14, { faces: [3] }],
  ['room', "Snaggle's den"],
  ['chk', 'Strength', 'Climb the bone stair', 'Athletics', 1, 10, { harm: 3 }],
  ['atk', 12, { heavy: true, faces: [five ? 4 : 2], foe: { roll: 15, faces: [2] } }],
  ['atk', 9, { faces: [3], foe: { roll: 6, faces: [1] } }],
  ['atk', 20, { heavy: true, faces: five ? [1, 1] : [4, 3], foe: { roll: 16, faces: [3] } }],
  ['atk', 4, { foe: { roll: 7, faces: [1] } }],
  ['atk', 14, { faces: [2] }],
  ['room', 'the flooded cellar'], ['chk', 'Dexterity', 'Cross the flooded cellar', null, 15, 14],
  ['room', 'the armoury'], ['chk', 'Strength', 'Pry the weapon locker', 'Athletics', 6, 15],
  ['room', 'the well shaft'], ['chk', 'Strength', 'Climb the well shaft', 'Athletics', 12, 12],
  ['room', 'the barracks'], ['chk', 'Wisdom', 'Listen at the barracks door', 'Perception', 8, 12],
  ['room', 'the chapel'], ['chk', 'Intelligence', 'Read the psalm board', null, 13, 12],
  ['room', 'the crypt'], ['chk', 'Strength', 'Shift the crypt lid', 'Athletics', 7, 15],
  ['room', 'the shrine cavern'],
  ['atk', 17, { faces: [3], foe: { roll: 4, faces: [1] } }], ['atk', 17, { faces: [3], foe: { roll: 4, faces: [1] } }], ['atk', 17, { faces: [2], foe: { roll: 4, faces: [1] } }], ['atk', 17, { faces: [4], foe: { roll: 4, faces: [1] } }],
  ['atk', 17, { faces: [3], foe: { roll: 4, faces: [1] } }], ['atk', 17, { faces: [3], foe: { roll: 4, faces: [1] } }], ['atk', 17, { faces: [2], foe: { roll: 4, faces: [1] } }], ['atk', 17, { faces: [4] }],
], { name: five ? 'delve-five-moments' : 'delve-key-moments' });

export function initGsDelveRuns() {
  const long = dlLongRun;
  GS_SESSIONS['delve-route-20'] = long(20);
  GS_SESSIONS['delve-route-20-live'] = long(20, true);
  GS_SESSIONS['delve-route-25'] = long(25);

  const km = keyMoments(false); const five = keyMoments(true);
  const kmBase = { ...GS_SESSIONS.delve, hpMax: 24, foeMax: { "snaggle's den": 27, 'the shrine cavern': 44 }, sheet: { used: {}, insp: true } };
  const kmSession = (r) => ({ ...kmBase, lines: r.lines, detail: r.detail, figures: dlFigures(r, 24), threat: r.threat, tracks: { ...GS_SESSIONS.delve.tracks, progress: 11, threat: r.threat } });
  GS_SESSIONS['delve-key-moments'] = kmSession(km);
  GS_SESSIONS['delve-five-moments'] = kmSession(five);

  // Bryn in Snaggle's den: a critical hit from the foe (two d3 and the dark's 1) and a roll that spent the light.
  const fd = dlRecord('Bryn the Fighter', 24, [['room', "snaggle's den"], ['atk', 12, { faces: [2], foe: { roll: 20, faces: [2, 3], dark: true } }]], { name: 'delve-fight-details' });
  fd.detail[1].light = 1;
  const fdBase = { ...GS_SESSIONS['delve-live'], hero: 'Bryn the Fighter', hpMax: 24, light: 0, lightMax: 6, tracks: { progress: 1, rooms: 1, threatMax: 12 } };
  const play = (r, more = {}) => ({ ...fdBase, threat: r.threat, lines: r.lines, detail: r.detail, figures: dlFigures(r, 24), tracks: { ...fdBase.tracks, threat: r.threat }, ...more });
  GS_SESSIONS['delve-fight-details'] = play(fd);
  // Gear: the pepper pouch strikes Snaggle and he answers; the flask of lamp oil restores light.
  GS_SESSIONS['delve-gear-strike'] = play(dlRecord('Bryn the Fighter', 24, [['room', "snaggle's den"], ['use', 'Gear', 'pepper pouch', { dmg: 4, foe: { roll: 9, faces: [1] } }]], { name: 'delve-gear-strike' }));
  GS_SESSIONS['delve-gear-light'] = play(dlRecord('Bryn the Fighter', 24, [['room', "snaggle's den"], ['use', 'Gear', 'flask of lamp oil', { light: 3, foe: { roll: 9 } }]], { name: 'delve-gear-light' }), { light: 3 });
  // Fallen on a use: five misses beaten down to 4 hit points, then the pouch, and Snaggle's answer brings the hero down.
  const fu = dlRecord('Bryn the Fighter', 24, [
    ['room', 'the gate'], ['room', "snaggle's den"],
    ['atk', 3, { foe: { roll: 15, faces: [3] } }], ['atk', 5, { foe: { roll: 14, faces: [3] } }], ['atk', 2, { foe: { roll: 18, faces: [3] } }], ['atk', 6, { foe: { roll: 13, faces: [3] } }], ['atk', 4, { foe: { roll: 16, faces: [3] } }],
    ['use', 'Gear', 'pepper pouch', { dmg: 4, foe: { roll: 15, faces: [3] } }],
  ], { name: 'delve-fallen-use' });
  GS_SESSIONS['delve-fallen-use'] = play(fu, { live: false, loss: true, end: 'fallen', result: "Fell in Snaggle's den" });

  // Wren in the shrine cavern, mid-fight with the drowned captain: a missed heavy attack, then a hit, so the streak stands at 1.
  const wrenBase = { ...GS_SESSIONS['delve-live'], hpMax: 22, foeMax: { 'the shrine cavern': 44 }, foeName: { 'the shrine cavern': 'Mortlake, the drowned captain' }, sheet: { used: {}, insp: true } };
  const wren = (r) => ({ ...wrenBase, lines: r.lines, detail: r.detail, figures: dlFigures(r, 22), tracks: { progress: 2, rooms: 2, threat: r.threat, threatMax: 12 }, threat: r.threat });
  GS_SESSIONS['delve-fight-live'] = wren(dlRecord('Wren the Rogue', 22, [
    ['chk', 'Dexterity', 'Slip the shrine gate', null, 14, 10], ['room', 'the shrine cavern'],
    ['atk', 6, { heavy: true, foe: { roll: 15, faces: [2] } }], ['atk', 15, { faces: [4], foe: { roll: 5, faces: [1] } }],
  ], { name: 'delve-fight-live' }));
  // Wren mid-fight with the drowned captain, two hits in a row giving her last roll advantage (two d20s, the lower dropped); it is a heavy attack that misses, so the foe's roll back has advantage too, and the held roll shows both dropped dice.
  GS_SESSIONS['delve-advantage'] = wren(dlRecord('Wren the Rogue', 22, [
    ['chk', 'Dexterity', 'Slip the shrine gate', null, 16, 10], ['room', 'the shrine cavern'],
    ['atk', 14, { faces: [4], foe: { roll: 5, faces: [1] } }], ['atk', 12, { faces: [3], foe: { roll: 4, faces: [1] } }], ['atk', 6, { heavy: true, foe: { roll: 15, faces: [3] } }],
  ], { name: 'delve-advantage' }));

  // Bryn lost in the same kind of fight: the run ends mid-fight on a hit that left Snaggle standing, so the streak freezes at 1 and the longest streak stays.
  const ff = dlRecord('Bryn the Fighter', 24, [
    ['chk', 'Dexterity', 'Cross the trapped bridge', null, 3, 10, { harm: 2 }],
    ['room', "snaggle's den"],
    ['atk', 15, { heavy: true, faces: [3], foe: { roll: 18, faces: [3] } }], ['atk', 5, { foe: { roll: 17, faces: [3] } }], ['atk', 4, { heavy: true, foe: { roll: 16, faces: [3] } }],
    ['atk', 2, { foe: { roll: 15, faces: [3] } }], ['atk', 6, { foe: { roll: 14, faces: [3] } }], ['atk', 12, { faces: [3], foe: { roll: 17, faces: [3] } }],
  ], { name: 'delve-fight-fallen' });
  GS_SESSIONS['delve-fight-fallen'] = { ...GS_SESSIONS['delve-fallen'], hpMax: 24, lines: ff.lines, detail: ff.detail, foeMax: { "snaggle's den": 27 }, result: "Fell in Snaggle's den", reached: "Fell in Snaggle's den", share: "Fell in Snaggle's den", figures: dlFigures(ff, 24),
    tracks: { progress: 2, rooms: 2, threat: ff.threat, threatMax: 12 }, threat: ff.threat, sheet: { used: {}, insp: false } };
}
