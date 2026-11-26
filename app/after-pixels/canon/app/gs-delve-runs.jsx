// ============================================================================
// After Pixels — Delve's long and detailed sample runs, for the session page and the Now card at their worst (hard states):
// a 20-stop and a 25-stop route with returns, a run that earns all five key moments (one roll earning two), a fight in progress and a fight lost.
// Each run is written as steps and turned into the record's lines, plus `detail` (the bonuses named, the damage roll, the foe's bonus) that app/gs-delve.jsx reads by roll number.
// SAMPLE: the rolls and damage below; stat and proficiency bonuses follow the game rules.
// Loads after app/gs-delve.jsx, whose sessions it copies.
// ============================================================================
import { GS_SESSIONS, GS_DV_TURNCOAT } from './gs-data.jsx';

const sumP = (mods) => mods.reduce((n, p) => n + (p[0] === '−' ? -p[1] : p[1]), 0);
const nat = (die) => (die === 20 ? 'Natural 20' : die === 1 ? 'Natural 1' : null);
// "d20 14 + 3 = 17 vs 12", "d20s 4 and 12, kept 12 + 3 = 15 vs 12"
const sumText = (die, other, mods, vs) => { const net = sumP(mods);
  return (other != null ? 'd20s ' + other + ' and ' + die + ', kept ' + die : 'd20 ' + die) + (net < 0 ? ' - ' : ' + ') + Math.abs(net) + ' = ' + (die + net) + ' vs ' + vs; };

// A recorder: steps in, `lines`, `detail`, and the `hp` and `threat` the record ends on, out.
// It throws if a step comes after the hero is at 0 HP or the threat has filled, so no sample can play on past its own end.
//   ['room', name] · ['back', name] · ['raw', line]
//   ['chk', stat, action, skill, die, mods, dc, { other, harm }]   a check against a DC
//   ['atk', stat, heavy, die, mods, ac, { other, dmg: [die, value, mods, type], foe: { roll, other, bonus, dd: [die, value, bonus] }, harm }]   an attack on a foe, its damage and the foe's turn
function dlRecord(steps, hpMax, heroAc, threatMax = 12) {
  let room = null; let hp = hpMax; let n = 0; let threat = 0; const lines = []; const detail = {};
  const hpOf = (h) => 'HP ' + h + '/' + hpMax;
  steps.forEach(([k, ...a]) => {
    if (hp <= 0 || threat >= threatMax) throw new Error('dlRecord: a step after the run has ended (' + k + ' ' + a[0] + ')');
    if (k === 'room' || k === 'back') room = a[0];
    if (k === 'room') { lines.push(['Room', 'Entered ' + a[0]]); return; }
    if (k === 'back') { threat += 1; lines.push(['Room', 'Doubled back to ' + a[0], 'The chant +1']); return; }
    if (k === 'raw') { lines.push(a[0]); return; }
    n += 1;
    if (k === 'chk') { const [stat, action, skill, die, mods, dc, o = {}] = a; const total = die + sumP(mods);
      const grade = die === 1 ? 'Failure' : die === 20 || total >= dc ? 'Success' : total >= dc - 5 ? 'Partial success' : 'Failure';
      if (grade === 'Partial success') threat += 1;
      if (grade === 'Failure') threat += die === 1 ? 2 : 1;
      const harm = grade === 'Success' ? 0 : Math.min(o.harm || 0, Math.max(0, hp - 2)); hp -= harm;
      lines.push([stat, action, grade, ...(nat(die) ? [nat(die)] : []), sumText(die, o.other, mods, dc), ...(harm ? [hpOf(hp)] : []), ...(grade === 'Failure' && room !== 'the chime run' ? ['Threat +' + (die === 1 ? 2 : 1)] : [])]);
      detail[n] = { parts: mods, skill }; return; }
    const [stat, heavy, die, mods, ac, o = {}] = a; const total = die + sumP(mods); const hit = die !== 1 && (die === 20 || total >= ac); const f = o.foe;
    const dmg = hit && o.dmg ? { die: o.dmg[0], v: o.dmg[1], parts: o.dmg[2], type: o.dmg[3] } : null;
    let back = [];
    if (f) { const ft = f.roll + (f.bonus || 0); const fhit = ft >= heroAc; const dmgDone = fhit ? (f.dd ? f.dd[1] + f.dd[2] : f.dmg) : 0; if (fhit) hp = Math.max(0, hp - dmgDone);
      back = ['Struck back: ' + (f.other != null ? 'd20s ' + f.other + ' and ' + f.roll + ', kept ' + f.roll : 'd20 ' + f.roll) + (f.bonus ? ' + ' + f.bonus : '') + ' vs ' + heroAc + ', '
        + (fhit ? 'hit, ' + (f.dd ? 'd' + f.dd[0] + ' ' + f.dd[1] + ' + ' + f.dd[2] + ' = ' : '') + dmgDone + ' damage, ' + hpOf(hp) : 'missed')]; }
    lines.push([stat, ...(heavy ? ['Heavy attack: ' + heavy] : []), hit ? 'Hit' : 'Miss', ...(nat(die) ? [nat(die)] : []), sumText(die, o.other, mods, ac), ...back]);
    detail[n] = { parts: mods, ...(dmg ? { dmg } : {}) };
  });
  return { lines, detail, hp, threat, rolls: n };
}

// Seeded dice, so the long runs are the same every load.
const seeded = (seed) => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

// The long route: 25 stops over 13 rooms, 12 of them returns (the first 20 stops: 12 rooms, 8 returns); the names are the longest the editions hold (the 27-character "Shrine of the drowned saint").
const ROUTE = [['the gate'], ["snaggle's den"], ['the gate', 1], ['the chime run'], ['the flooded cellar'], ['the chime run', 1], ['shrine of the drowned saint'], ['the armoury'], ['shrine of the drowned saint', 1],
  ['the well shaft'], ['the barracks'], ['the well shaft', 1], ['the chapel'], ['the crypt'], ['the chapel', 1], ['the bone pit'], ['the treasury'], ['the bone pit', 1], ['the crypt', 1], ['the treasury', 1],
  ['the great hall'], ['the crypt', 1], ['the great hall', 1], ['the chapel', 1], ['the great hall', 1]];
const ROLLS = [1, 3, 0, 3, 1, 0, 4, 2, 1, 2, 3, 0, 1, 2, 0, 3, 1, 1, 0, 1, 4, 1, 2, 0, 0];
const CHECKS = [['Strength', 'Force the door', 'Athletics', 3, 'STR'], ['Wisdom', 'Listen at the wall', 'Perception', 0, 'WIS'], ['Dexterity', 'Slip the trap', null, 1, 'DEX'], ['Constitution', 'Hold your breath', null, 2, 'CON']];
// The threat is full on the run's last turn and not before: every going back costs 1, so the 25-stop run (12 returns) fills it on its last return and every roll before it succeeds;
// the 20-stop run (8 returns) adds a natural 1 on the chime run (2), a failed check in the well shaft (1) and a failed check that is its last roll (1).
const MISS = (n, i, k) => n === 20 && ((i === 3 && k === 0) || (i === 9 && k === 0) || (i === 19 && k === 0));
function longRoute(n, hpMax, live) {
  const rnd = seeded(7); const steps = []; const health = { "snaggle's den": 27, 'the great hall': 16 };
  ROUTE.slice(0, n).forEach(([name, back], i) => {
    steps.push([back ? 'back' : 'room', name]);
    const fight = name === "snaggle's den" || name === 'the great hall';
    for (let k = 0; k < ROLLS[i]; k += 1) {
      const lose = !live && MISS(n, i, k); const nat1 = lose && i === 3;
      const die = nat1 ? 1 : lose ? 3 : i === 6 && k === 1 ? 20 : 10 + Math.floor(rnd() * 10);
      if (fight) {
        const heavy = k === 0 ? 'Cleave' : null; const mods = [['+', 3, 'STR'], ['+', 2, 'Martial'], ...(heavy ? [['−', 2, 'Heavy']] : [])];
        const attackDie = name === 'the great hall' && i === 20 && k > 0 ? 2 : die;
        const ac = name === "snaggle's den" ? 14 : 12; const face = name === 'the great hall' ? 1 : 1 + Math.floor(rnd() * 4);
        const damage = face + 3 + (heavy ? 2 : 0); const hit = attackDie + sumP(mods) >= ac;
        if (hit) health[name] = Math.max(0, health[name] - damage);
        steps.push(['atk', 'Strength', heavy, attackDie, mods, ac, { dmg: ['d4', face, [['+', 3, 'STR'], ...(heavy ? [['+', 2, 'Heavy']] : [])], 'Slashing'], ...(health[name] > 0 ? { foe: { roll: 3 + Math.floor(rnd() * 17), bonus: name === "snaggle's den" ? 4 : 3, dd: [3, 1, 1] } } : {}) }]);
      } else {
        const c = CHECKS[(i + k) % 4]; const mods = [...(c[3] > 0 ? [['+', c[3], c[4]]] : []), ...(c[2] ? [['+', 2, c[2]]] : [])];
        steps.push(['chk', c[0], c[1], c[2], die, mods, lose ? 15 : 10, { harm: 1 }]);
      }
    }
  });
  return dlRecord(steps, hpMax, 16);
}

// A long run lost to the ritual, ended: the most going back the editions allow, the hero still standing. The 25-stop run fills the threat on its last going back, so it ends on the loss cross.
// n is the number of room visits (1 to 25); `live` makes it a run still in progress.
export const dlLongRun = (n, live = false) => { const { lines, detail, hp, threat, rolls } = longRoute(n, 24, live); const stops = ROUTE.slice(0, n); const rooms = new Set(stops.map((r) => r[0])).size;
  return { ...GS_SESSIONS['delve-hard'], hero: 'Bryn the Fighter', hpMax: 24, threat, foeMax: { "snaggle's den": 27, 'the great hall': 16 }, foeName: {}, lightName: 'the torch', light: 0, lightMax: 6,
    ...(n === 25 && !live ? { lostOff: { over: true, name: 'Going back' } } : {}), ...(live ? { live: true, loss: false, end: null, lostOff: null, result: 'In progress', reached: 'In progress', share: 'In progress' } : { result: 'Too late: the chant was completed', reached: 'Too late: the chant was completed', share: 'Too late: the chant was completed' }),
    figures: ['Threat ' + threat + '/12', rolls + ' rolls', 'HP ' + hp + '/24'], tracks: { progress: n, rooms, threat, threatMax: 12 }, lines, detail }; };

export function initGsDelveRuns() {
  const long = dlLongRun;
  GS_SESSIONS['delve-route-20'] = long(20);
  GS_SESSIONS['delve-route-20-live'] = long(20, true);
  GS_SESSIONS['delve-route-25'] = long(25);

  // A won run that earns all five key moments: Worst roll (a natural 1), Closest call (12 against 12), Best roll and Biggest hit on one roll (a natural 20 Cleave), and the Winning blow.
  const STR = ['+', 3, 'STR']; const MART = ['+', 2, 'Martial']; const HEAVY = ['−', 2, 'Heavy'];
  const km = dlRecord([
    ['chk', 'Wisdom', "Search the lock-keeper's niche", 'Perception', 11, [['+', 2, 'Perception']], 10],
    ['room', 'the chime run'],
    ['chk', 'Strength', 'Climb the bone stair', 'Athletics', 1, [STR, ['+', 2, 'Athletics']], 10, { harm: 3 }],
    ['chk', 'Dexterity', 'Slip past the chimes', null, 11, [['+', 1, 'DEX']], 10],
    ['room', 'the warren'], ['raw', ['Turn', 'The turncoat joins', GS_DV_TURNCOAT]],
    ['room', "snaggle's den"],
    ['atk', 'Strength', 'Cleave', 13, [STR, MART, HEAVY], 14, { dmg: ['d4', 1, [STR, ['+', 2, 'Heavy']], 'Slashing'], foe: { roll: 15, bonus: 4, dd: [3, 2, 1] } }],
    ['atk', 'Strength', null, 9, [STR, MART], 14, { dmg: ['d4', 1, [STR], 'Slashing'], foe: { roll: 6, bonus: 4, dd: [3, 1, 1] } }],
    ['atk', 'Strength', 'Cleave', 20, [STR, MART, ['+', 1, 'Magic'], HEAVY], 14, { dmg: ['d4', 1, [['+', 1, 'd4'], STR, ['+', 1, 'Magic'], ['+', 2, 'Heavy']], 'Slashing'], foe: { roll: 16, other: 5, bonus: 4, dd: [3, 3, 1] } }],
    ['atk', 'Strength', null, 4, [STR, MART], 14, { foe: { roll: 7, bonus: 4, dd: [3, 1, 1] } }],
    ['atk', 'Strength', null, 14, [STR, MART], 14, { dmg: ['d4', 1, [STR], 'Slashing'], foe: { roll: 5, bonus: 4, dd: [3, 1, 1] } }],
    ['room', 'the shrine cavern'],
    ['atk', 'Strength', null, 12, [STR, MART], 12, { dmg: ['d4', 3, [STR], 'Slashing'], foe: { roll: 4, bonus: 8, dd: [3, 2, 1] } }],
    ['atk', 'Strength', null, 17, [STR, MART], 12, { dmg: ['d4', 3, [STR], 'Slashing'], foe: { roll: 4, bonus: 8, dd: [3, 2, 1] } }],
    ['atk', 'Strength', null, 17, [STR, MART], 12, { dmg: ['d4', 3, [STR], 'Slashing'], foe: { roll: 4, bonus: 8, dd: [3, 2, 1] } }],
    ['atk', 'Strength', null, 17, [STR, MART], 12, { dmg: ['d4', 3, [STR], 'Slashing'], foe: { roll: 4, bonus: 8, dd: [3, 2, 1] } }],
    ['atk', 'Strength', null, 17, [STR, MART], 12, { dmg: ['d4', 3, [STR], 'Slashing'], foe: { roll: 4, bonus: 8, dd: [3, 2, 1] } }],
    ['atk', 'Strength', null, 17, [STR, MART], 12, { dmg: ['d4', 4, [STR], 'Slashing'], foe: { roll: 4, bonus: 8, dd: [3, 2, 1] } }],
    ['atk', 'Strength', null, 17, [STR, MART], 12, { dmg: ['d4', 4, [STR], 'Slashing'] }],
  ], 24, 16);
  GS_SESSIONS['delve-key-moments'] = { ...GS_SESSIONS.delve, hpMax: 24, lines: km.lines, detail: km.detail, foeMax: { "snaggle's den": 27, 'the shrine cavern': 44 }, figures: ['Threat ' + km.threat + '/12', km.rolls + ' rolls', '1 natural 20', 'HP ' + km.hp + '/24'], threat: km.threat, tracks: { ...GS_SESSIONS.delve.tracks, threat: km.threat }, sheet: { used: {}, insp: true } };

  const extras = dlRecord([
    ['room', "snaggle's den"],
    ['atk', 'Strength', null, 12, [STR, MART], 14, { dmg: ['d4', 2, [STR], 'Slashing'], foe: { roll: 20, bonus: 4, dd: [3, 2, 1] } }],
  ], 24, 16);
  extras.lines[1][extras.lines[1].length - 1] = 'Struck back: d20 20 + 4 vs 16, hit, d3 2 + 1 = 4 damage, HP 20/24';
  extras.detail[1].foe = { critical: true, dark: true };
  extras.detail[1].light = 1;
  GS_SESSIONS['delve-fight-details'] = { ...GS_SESSIONS['delve-live'], hero: 'Bryn the Fighter', hpMax: 24, light: 0, lightMax: 6, lines: extras.lines, detail: extras.detail, figures: ['Threat 0/12', '1 roll', 'HP 20/24'], tracks: { progress: 1, rooms: 1, threat: 0, threatMax: 12 } };
  GS_SESSIONS['delve-gear-strike'] = { ...GS_SESSIONS['delve-fight-details'], lines: [['Room', "Entered snaggle's den"], ['Gear', 'Used pepper pouch', 'Snaggle: health 27 → 23']], detail: {} };
  GS_SESSIONS['delve-fallen-use'] = { ...GS_SESSIONS['delve-fight-details'], live: false, loss: true, end: 'fallen', result: "Fell in Snaggle's den", figures: ['Threat 0/12', '0 rolls', 'HP 0/24'], lines: [['Room', "Entered snaggle's den"], ['Gear', 'Used pepper pouch', 'Snaggle: health 27 → 23', 'Struck back: d20 20 + 4 vs 16, hit, 24 damage, HP 0/24']], detail: {} };
  GS_SESSIONS['delve-gear-light'] = { ...GS_SESSIONS['delve-fight-details'], light: 3, lines: [['Room', 'Entered the gate'], ['Gear', 'Used flask of lamp oil']], detail: {} };

  // Wren in the shrine cavern, mid-fight with the drowned captain: a miss then a hit, so the streak stands at 1.
  const DEX = ['+', 3, 'DEX']; const SIMP = ['+', 2, 'Simple'];
  const fl = dlRecord([
    ['chk', 'Dexterity', 'Slip the shrine gate', null, 14, [DEX], 10],
    ['room', 'the shrine cavern'],
    ['atk', 'Dexterity', 'Flurry', 6, [DEX, SIMP, HEAVY], 12, { dmg: null, foe: { roll: 15, other: 9, bonus: 8, dd: [3, 2, 1] } }],
    ['atk', 'Dexterity', null, 15, [DEX, SIMP], 12, { other: 4, dmg: ['d4', 4, [DEX], 'Piercing'], foe: { roll: 5, bonus: 8 } }],
  ], 22, 14);
  GS_SESSIONS['delve-fight-live'] = { ...GS_SESSIONS['delve-live'], hpMax: 22, lines: fl.lines, detail: fl.detail, foeMax: { 'the shrine cavern': 44 }, foeName: { 'the shrine cavern': 'Mortlake, the drowned captain' }, figures: ['Threat ' + fl.threat + '/12', fl.rolls + ' rolls', 'HP ' + fl.hp + '/22'], tracks: { progress: 2, rooms: 2, threat: fl.threat, threatMax: 12 }, threat: fl.threat, sheet: { used: {}, insp: true } };

  // Wren mid-fight with the drowned captain, two hits in a row giving her last roll, an attack, advantage, and the foe's roll back an advantage roll too (two d20s each, the lower dropped), so the held roll shows both dropped dice.
  const adv = dlRecord([
    ['chk', 'Dexterity', 'Slip the shrine gate', null, 16, [DEX], 10, { other: 5 }],
    ['room', 'the shrine cavern'],
    ['atk', 'Dexterity', 'Flurry', 9, [DEX, SIMP, HEAVY], 12, { dmg: ['d4', 4, [DEX, ['+', 4, 'Heavy']], 'Piercing'], foe: { roll: 6, bonus: 8, dd: [3, 2, 1] } }],
    ['atk', 'Dexterity', null, 14, [DEX, SIMP], 12, { dmg: ['d4', 3, [DEX], 'Piercing'], foe: { roll: 5, bonus: 8 } }],
    ['atk', 'Dexterity', null, 17, [DEX, SIMP], 12, { other: 4, dmg: ['d4', 4, [DEX], 'Piercing'], foe: { roll: 15, other: 9, bonus: 8, dd: [3, 2, 1] } }],
  ], 22, 14);
  GS_SESSIONS['delve-advantage'] = { ...GS_SESSIONS['delve-live'], hpMax: 22, lines: adv.lines, detail: adv.detail, foeMax: { 'the shrine cavern': 44 }, foeName: { 'the shrine cavern': 'Mortlake, the drowned captain' }, figures: ['Threat ' + adv.threat + '/12', adv.rolls + ' rolls', 'HP ' + adv.hp + '/22'], tracks: { progress: 2, rooms: 2, threat: adv.threat, threatMax: 12 }, threat: adv.threat, sheet: { used: {}, insp: true } };

  // Bryn lost in the same kind of fight: the fight ends with the run, so the streak is back at 0 and the longest streak stays.
  const ff = dlRecord([
    ['chk', 'Dexterity', 'Cross the trapped bridge', null, 3, [['+', 1, 'DEX']], 10, { harm: 14 }],
    ['room', "snaggle's den"],
    ['atk', 'Strength', 'Cleave', 15, [STR, MART, HEAVY], 14, { dmg: ['d4', 3, [STR, ['+', 2, 'Heavy']], 'Slashing'], foe: { roll: 18, bonus: 4, dd: [3, 3, 1] } }],
    ['atk', 'Strength', null, 6, [STR, MART], 14, { foe: { roll: 17, bonus: 4, dd: [3, 3, 1] } }],
    ['atk', 'Strength', null, 14, [STR, MART], 14, { dmg: ['d4', 3, [STR], 'Slashing'], foe: { roll: 16, bonus: 4, dd: [3, 3, 1] } }],
  ], 24, 16);
  GS_SESSIONS['delve-fight-fallen'] = { ...GS_SESSIONS['delve-fallen'], hpMax: 24, lines: ff.lines, detail: ff.detail, foeMax: { "snaggle's den": 27 }, result: "Fell in Snaggle's den", reached: "Fell in Snaggle's den", share: "Fell in Snaggle's den", figures: ['Threat ' + ff.threat + '/12', ff.rolls + ' rolls', 'HP ' + ff.hp + '/24'], tracks: { progress: 2, rooms: 2, threat: ff.threat, threatMax: 12 }, threat: ff.threat, sheet: { used: {}, insp: false } };
}
