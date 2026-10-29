// Playground (1236, Delve): the sample plays, held once for every Delve playground (v1, v2). Won and In progress are the
// deployed engine's recorded runs (GS_DV_WON, GS_DV_LIVE in app/gs-data.jsx). Fallen and the hard play are invented in the
// same line form. The hard play is built to delve.md's limits: every room of the setting, three times going back, 22 rolls,
// a natural 1 and a natural 20, rolls with two d20, a lock forced on the third try, and it ends overrun. The Goblin Warren
// has five rooms; the spec allows six, so the hard play reaches its length by going back rather than by a sixth room.
// Records use kind 'delve-pg' so the session page's Delve branch (app/gs-session.jsx) passes them to GS_SESSION_BODY.
const DV_HARD = [
  ['Wisdom', 'd20 1 + 1 = 2 vs 12', 'Search the lock-keeper\'s niche: natural 1, HP 10/11'],
  ['Room', 'Entered The chime run'],
  ['Dexterity', 'd20 8 + 3 = 11 vs 12', 'Miss, HP 9/11'],
  ['Dexterity', 'd20 9 + 3 = 12 vs 12', 'Weak hit'],
  ['Dexterity', 'd20 16 + 3 = 19 vs 12', 'Hit'],
  ['Room', 'Entered The warren'],
  ['Turn', GS_DV_TURNCOAT, 'The turncoat joins'],
  ['Dexterity', 'd20 14 + 3 = 17 vs 12', 'Hit'],
  ['Dexterity', 'd20s 6 and 15, kept 15 + 3 = 18 vs 12', 'Hit'],
  ['Dexterity', 'd20s 4 and 2, kept 4 + 3 = 7 vs 12', 'Miss, HP 7/11'],
  ['Strength', 'd20 12 + 0 = 12 vs 12', 'Weak hit, HP 6/11'],
  ['Dexterity', 'd20 15 + 3 = 18 vs 12', 'Hit'],
  ['Room', 'Doubled back to The chime run', 'The ritual +1'],
  ['Intelligence', 'd20 13 + 1 = 14 vs 12', 'Read the chime wires: weak hit'],
  ['Room', 'Doubled back to The warren', 'The ritual +1'],
  ['Room', 'Entered Snaggle\'s den'],
  ['Dexterity', 'd20 7 + 3 = 10 vs 12', 'Miss, HP 5/11'],
  ['Dexterity', 'd20 20 + 3 = 23 vs 12', 'Natural 20'],
  ['Dexterity', 'd20s 12 and 3, kept 12 + 3 = 15 vs 12', 'Hit'],
  ['Room', 'Doubled back to The warren', 'The ritual +1'],
  ['Strength', 'd20 6 + 0 = 6 vs 12', 'Force the bone gate: miss'],
  ['Strength', 'd20 11 + 0 = 11 vs 12', 'Force the bone gate: miss'],
  ['Strength', 'd20 14 + 0 = 14 vs 12', 'Force the bone gate: hit'],
  ['Lock', 'Forced the bone gate'],
  ['Room', 'Entered The shrine cavern'],
  ['Dexterity', 'd20 10 + 3 = 13 vs 12', 'Weak hit, HP 3/11'],
  ['Dexterity', 'd20 17 + 3 = 20 vs 12', 'Hit'],
  ['Dexterity', 'd20 18 + 3 = 21 vs 12', 'Hit'],
  ['Dexterity', 'd20s 5 and 7, kept 7 + 3 = 10 vs 12', 'Miss, HP 2/11'],
  ['Dexterity', 'd20 11 + 3 = 14 vs 12', 'Weak hit'],
  ['Dexterity', 'd20 8 + 3 = 11 vs 12', 'Miss, HP 1/11'],
];
const DV_FALLEN = [
  ['Wisdom', 'd20 14 + 0 = 14 vs 12', 'Search the lock-keeper\'s niche: hit'],
  ['Room', 'Entered The chime run'],
  ['Dexterity', 'd20 5 + 1 = 6 vs 12', 'Miss, HP 11/13'],
  ['Dexterity', 'd20 12 + 1 = 13 vs 12', 'Weak hit, HP 10/13'],
  ['Dexterity', 'd20 19 + 1 = 20 vs 12', 'Hit'],
  ['Room', 'Entered The warren'],
  ['Turn', GS_DV_TURNCOAT, 'The turncoat joins'],
  ['Strength', 'd20 3 + 3 = 6 vs 12', 'Miss, HP 7/13'],
  ['Strength', 'd20 9 + 3 = 12 vs 12', 'Weak hit, HP 5/13'],
  ['Strength', 'd20 1 + 3 = 4 vs 12', 'Natural 1, HP 2/13'],
  ['Strength', 'd20 15 + 3 = 18 vs 12', 'Hit'],
  ['Strength', 'd20 7 + 3 = 10 vs 12', 'Miss, HP 0/13'],
];
const DV_SETTING = 'The Goblin Warren beneath Ashford Mill';
// The heroes' sheets, for the character sheet (v4). SAMPLE: the stats a check adds are read from the records above (Bryn Str +3,
// Dex +1, Wis 0; Wren Dex +3, Int +1, Wis +1, Str 0); Con and Cha, the abilities and the starting gear are invented to delve.md's
// words (Gear, Hero ability, Carry limit). The Warren's carry limit is three.
const DV_CARRY = 3;
const DV_HEROES = {
  'Bryn the Fighter': { name: 'Bryn', cls: 'Fighter', stats: { Strength: 3, Dexterity: 1, Constitution: 2, Intelligence: 0, Wisdom: 0, Charisma: -1 },
    abilities: [{ name: 'Shield bash', of: 2, does: 'Strikes at once, no roll' }],
    gear: [{ name: 'Chain shirt', kind: 'armour', does: 'Every hit on you costs one less' }, { name: 'Pepper pouch', kind: 'once', does: 'Flung in a face, it blinds for a blow' }] },
  'Wren the Rogue': { name: 'Wren', cls: 'Rogue', stats: { Strength: 0, Dexterity: 3, Constitution: 0, Intelligence: 1, Wisdom: 1, Charisma: 2 },
    abilities: [{ name: 'Backstab', of: 2, does: 'Strikes from behind at once, no roll' }],
    gear: [{ name: 'Leather coat', kind: 'armour', does: 'Every hit on you costs one less' }, { name: 'Smoke pellet', kind: 'once', does: 'Burst underfoot, it hides you for a breath' }] },
};
const DV_GEAR_DOES = { 'Iron key': 'Opens the lock it fits' };
const dvRec = (o) => ({ kind: 'delve-pg', gid: 'delve', game: 'Delve', art: 'delve', setting: DV_SETTING, listTitle: 'Every move', endings: GS_DV_ENDINGS, rooms: 5, threatMax: 12, ...o });
// The five plays under one prefix ('dv1' → 'dv1-won' …), so each playground keeps its own session ids.
const dvSessions = (p) => ({
  [p + '-won']: dvRec({ end: 'won', result: 'Elsie rescued', hero: 'Bryn the Fighter', hpMax: 13, reached: 5, threat: 5, date: 'Monday 5 October', lines: GS_DV_WON, sheet: { used: { 'Shield bash': 1 }, insp: true } }),
  [p + '-fallen']: dvRec({ end: 'fallen', loss: true, result: 'Fell in the warren', hero: 'Bryn the Fighter', hpMax: 13, reached: 3, threat: 7, date: 'Monday 5 October', lines: DV_FALLEN, sheet: { used: { 'Shield bash': 2 }, insp: false } }),
  [p + '-hard']: dvRec({ end: 'overrun', loss: true, result: 'Too late: the ritual was completed', hero: 'Wren the Rogue', hpMax: 11, reached: 5, threat: 12, date: 'Monday 5 October', lines: DV_HARD, sheet: { used: { Backstab: 2 }, insp: false } }),
  [p + '-live']: dvRec({ live: true, result: 'In progress', hero: 'Wren the Rogue', hpMax: 11, reached: 4, threat: 3, date: GS.today, lines: GS_DV_LIVE, share: null, sheet: { used: { Backstab: 1 }, insp: true } }),
  [p + '-ended']: dvRec({ unfinished: true, result: 'Not finished', hero: 'Wren the Rogue', hpMax: 11, reached: 4, threat: 3, date: 'Monday 5 October', lines: GS_DV_LIVE, share: null, sheet: { used: { Backstab: 1 }, insp: true } }),
});
