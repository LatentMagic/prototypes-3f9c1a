// ============================================================================
// After Pixels — Delve's sample-run recorder: the dice of a play go in, its record comes out (lines, `detail`, hit points, threat, rolls).
// Every sample run on the session page and the Now card is written as steps and turned into its record here, so the arithmetic is the engine's and never typed twice:
// d20 + bonus = total, the grade against the target (a partial success starts 5 below it, a natural 20 always succeeds, a natural 1 always fails), a hit against the foe's armour class,
// the damage roll (a critical hit rolls the die twice), the foe's health after each blow, the foe's roll back while it stands, the escalation die, hit points and threat.
// SAMPLE: the dice and faces a run is given; every rule below follows deployed delve.md (monorepo specs/projects/mcp-games/game-specs) and scene.archetype / hero-class.
// ============================================================================

// A hero: the defence, the six stat modifiers, the skills the class is trained in, the attack stat, the weapon proficiency, the heavy attack and its bonus, the weapon's damage type
// (hero-class.ts: the fighter and the rogue; Hal is a fighter).
const FIGHTER = { defence: 16, stats: { Strength: 3, Dexterity: 1, Constitution: 2, Intelligence: 0, Wisdom: 0, Charisma: 0 }, trained: ['Athletics', 'Intimidation', 'Perception', 'Survival'], stat: 'Strength', abbr: 'STR', prof: 'Martial', heavyBonus: 2, type: 'Slashing' };
export const DL_HERO_RULES = {
  'Bryn the Fighter': { ...FIGHTER, heavy: 'Cleave' },
  'Hal the Woodcutter': { ...FIGHTER, heavy: 'Timberfall' },
  'Wren the Rogue': { defence: 14, stats: { Strength: 0, Dexterity: 3, Constitution: 1, Intelligence: 1, Wisdom: 0, Charisma: 2 }, trained: ['Stealth', 'Acrobatics', 'Sleight of Hand', 'Deception', 'Perception', 'Investigation', 'Persuasion'], stat: 'Dexterity', abbr: 'DEX', prof: 'Simple', heavy: 'Flurry', heavyBonus: 4, type: 'Piercing' },
};
// A foe by its room: its name, health, armour class (light 12, medium 14, heavy 16), attack bonus and damage die and modifier from its role (minion +2 d3+0, standard +3 d3+1, lieutenant +4 d3+1, boss +8 d3+1).
// A band (members) is one foe with one member's health for each member; each member standing rolls its die when it hits.
export const DL_FOE_RULES = {
  'the warren': { name: 'The goblin sentries', short: 'Sentries', max: 10, members: 2, ac: 12, atk: 2, die: 3, mod: 0 },
  "snaggle's den": { name: 'Snaggle', short: 'Snaggle', max: 27, ac: 14, atk: 4, die: 3, mod: 1 },
  'the great hall': { name: 'The briar knight', short: 'The briar knight', max: 16, ac: 14, atk: 3, die: 3, mod: 1 },
  // The boss's phase: the first blow that takes it to half its health or below moves its damage modifier up 1 (scene phase, delve.md).
  'the shrine cavern': { name: 'Grizzletooth', short: 'Grizzletooth', max: 44, ac: 12, atk: 8, die: 3, mod: 1, phaseAt: 22 },
};
// A hazard: no foe and no roll back; a partial success costs its partial harm, a failure its harm and 1 threat (2 on a natural 1) (scene-game.ts foeOutcomeOf).
export const DL_HAZARD_RULES = { 'the thorn stair': { harm: 2, partial: 2 } };
export const dlSum = (mods) => mods.reduce((n, p) => n + (p[0] === '−' ? -p[1] : p[1]), 0);
const nat = (die) => (die === 20 ? 'Natural 20' : die === 1 ? 'Natural 1' : null);
const sumText = (die, other, mods, vs) => { const net = dlSum(mods);
  return (other != null ? 'd20s ' + other + ' and ' + die + ', kept ' + die : 'd20 ' + die) + (net < 0 ? ' - ' : ' + ') + Math.abs(net) + ' = ' + (die + net) + ' vs ' + vs; };
// The dropped die of a roll with advantage: any face up to the kept one.
const dropped = (die, seed) => 1 + ((seed * 5 + die * 3) % die);
const face = (v, sides, what) => { if (!Number.isInteger(v) || v < 1 || v > sides) throw new Error('dlRecord: ' + what + ' face ' + v + ' is not on a d' + sides); return v; };

// steps, in order (a die is the kept d20; `other` is the dropped one when the roll had advantage):
//   ['room', name] · ['back', name] (going back costs 1 threat) · ['raw', line]
//   ['chk', stat, action, skill, die, dc, { harm, threat }]   a check: the stat's modifier, plus 2 where the hero is trained in the skill; harm lands on a partial success or a failure, threat is the cost paid
//   ['atk', die, { heavy, faces: [d4, d4 on a critical hit], foe: { roll, faces: [d3 per member standing, twice on a critical hit], dark } }]   an attack on the room's foe
// A roll with advantage rolls two d20s and keeps the higher: a check once the streak is 2 or more, an attack after two hits in a row in the fight, a foe's roll back after a heavy attack that missed.
// The recorder gives such a roll its dropped die; a step names only the kept one.
//   ['use', kind, name, { dmg, heal, foe }]   an ability or gear: it strikes the foe for dmg or heals the hero, and the foe answers if it still stands
//   ['weak', item, blow]   a weakness blow: no roll back
// `magic` (an option of the recorder) is the weapon's bonus, added to every attack and every damage roll of the run.
// `foe` on a step is the foe's roll back; a foe still standing after the hero's turn must have one, and a foe that fell must not.
export function dlRecorder(hero, hpMax, { threatMax = 12, magic = 0 } = {}) {
  const H = DL_HERO_RULES[hero]; if (!H) throw new Error('dlRecord: no hero ' + hero);
  let room = null; let hp = hpMax; let n = 0; let threat = 0; let esc = 0; let nat20 = 0; let streak = 0; let hitRun = 0; const marks = []; const foeHp = {}; const lines = []; const detail = {};
  const hpOf = () => 'HP ' + hp + '/' + hpMax;
  const rule = () => DL_FOE_RULES[room];
  const modOf = () => rule().mod + (rule().phaseAt != null && left() <= rule().phaseAt ? 1 : 0);
  const left = () => (foeHp[room] != null ? foeHp[room] : rule().max);
  // The foe's turn: its d20 plus its bonus against the hero's defence (a natural 20 always hits and is critical, a natural 1 always misses), then the damage roll of each member standing.
  const answer = (f, heavyMissed, tier) => { const r = rule(); if (!f) throw new Error('dlRecord: ' + r.name + ' stands and must strike back (' + room + ', roll ' + n + ')');
    const other = heavyMissed ? dropped(f.roll, n + 2) : null;
    const hit = f.roll === 20 || (f.roll !== 1 && f.roll + r.atk >= H.defence); const crit = f.roll === 20 && hit;
    let dmg = 0; let dd = null; const out = {};
    if (hit) { const stand = r.members ? Math.ceil((left() * r.members) / r.max) : 1; const need = stand * (crit ? 2 : 1); const fc = (f.faces || []).slice(0, need);
      if (fc.length < need) throw new Error('dlRecord: ' + r.name + ' rolls ' + need + ' d' + r.die + ' (roll ' + n + ')'); fc.forEach((v) => face(v, r.die, 'foe'));
      dmg = fc.reduce((a, b) => a + b, 0) + (r.members ? 0 : modOf()) + (f.dark ? 1 : 0);
      if (!r.members && !crit && !f.dark) dd = [r.die, fc[0], modOf()]; else if (!r.members) out.foe = { critical: crit || undefined, dark: f.dark || undefined, dd: { die: 'd' + r.die, v: fc[0], b: modOf(), extra: crit ? fc[1] : undefined } }; hp = Math.max(0, hp - dmg); }
    esc = Math.min(2, esc + 1); if (tier) hitRun = hitRun >= 2 || tier === 'miss' ? 0 : hitRun + 1;
    return { text: 'Struck back: ' + (other != null ? 'd20s ' + other + ' and ' + f.roll + ', kept ' + f.roll : 'd20 ' + f.roll) + ' + ' + r.atk + ' vs ' + H.defence + ', '
      + (hit ? 'hit, ' + (dd ? 'd' + dd[0] + ' ' + dd[1] + ' + ' + dd[2] + ' = ' : '') + dmg + ' damage, ' + hpOf() : 'missed'), out }; };
  const step = (k, ...a) => {
    if (hp <= 0 || threat >= threatMax) throw new Error('dlRecord: a step after the run has ended (' + k + ' ' + a[0] + ')');
    if (k === 'room' || k === 'back') { if (room && rule() && left() > 0) streak = 0; room = a[0].toLowerCase(); esc = 0; hitRun = 0; if (rule() && left() > 0) streak = 0; }
    if (k === 'room') { lines.push(['Room', 'Entered ' + a[0]]); return; }
    if (k === 'back') { threat += 1; lines.push(['Room', 'Doubled back to ' + a[0], 'The chant +1']); return; }
    if (k === 'raw') { lines.push(a[0]); return; }
    if (k === 'chk') { n += 1; const [stat, action, askill, die, dc, o = {}] = a; const skill = askill && H.trained.includes(askill) ? askill : null;
      const mods = [...(H.stats[stat] ? [['+', H.stats[stat], stat.slice(0, 3).toUpperCase()]] : []), ...(skill ? [['+', 2, skill]] : [])]; const total = die + dlSum(mods); if (die === 20) nat20 += 1; const other = streak >= 2 ? dropped(die, n) : null;
      const grade = die === 1 ? 'Failure' : die === 20 || total >= dc ? 'Success' : total >= dc - 5 ? 'Partial success' : 'Failure';
      const hz = DL_HAZARD_RULES[room]; const cost = hz ? (grade === 'Partial success' ? hz.partial : hz.harm) : o.harm || 0; const harm = grade === 'Success' ? 0 : Math.min(cost, hp); hp -= harm; const paid = hz ? (grade === 'Failure' ? (die === 1 ? 2 : 1) : 0) : o.threat || 0; threat += paid;
      lines.push([stat, ...(action ? [action] : []), grade, ...(nat(die) ? [nat(die)] : []), sumText(die, other, mods, dc), ...(harm ? [hpOf()] : []), ...(paid ? ['Threat +' + paid] : [])]);
      marks.push({ n, die, total, dc, grade: grade === 'Success' ? 'strong' : grade === 'Partial success' ? 'weak' : 'miss' });
      streak = grade === 'Success' ? streak + 1 : 0; detail[n] = { parts: mods, skill }; return; }
    const r = rule();
    if (k === 'atk') { n += 1; const [die, o = {}] = a; if (die === 20) nat20 += 1; if (!r) throw new Error('dlRecord: no foe in ' + room); if (left() <= 0) throw new Error('dlRecord: an attack on a beaten foe (' + room + ', roll ' + n + ')');
      const mods = [['+', 3, H.abbr], ['+', 2, H.prof], ...(magic ? [['+', magic, 'Magic']] : []), ...(esc ? [['+', esc, 'Escalation']] : []), ...(o.heavy ? [['−', 2, 'Heavy']] : [])];
      const total = die + dlSum(mods); const hit = die !== 1 && (die === 20 || total >= r.ac); const crit = die === 20; const d = { parts: mods }; const adv = hitRun >= 2; const other = adv ? dropped(die, n) : null;
      let dealt = null; if (hit) { const fc = o.faces || []; if (fc.length < (crit ? 2 : 1)) throw new Error('dlRecord: a ' + (crit ? 'critical hit rolls the d4 twice' : 'hit rolls one d4') + ' (roll ' + n + ')'); fc.forEach((v) => face(v, 4, 'd4'));
        const parts = [...(crit ? [['+', fc[1], 'd4']] : []), ['+', 3, H.abbr], ...(magic ? [['+', magic, 'Magic']] : []), ...(o.heavy ? [['+', H.heavyBonus, 'Heavy']] : [])];
        d.dmg = { die: 'd4', v: fc[0], parts, type: H.type }; dealt = fc[0] + dlSum(parts); foeHp[room] = Math.max(0, left() - dealt); }
      const stands = left() > 0; const line = [H.stat, ...(o.heavy ? ['Heavy attack: ' + H.heavy] : []), hit ? 'Hit' : 'Miss', ...(nat(die) ? [nat(die)] : []), sumText(die, other, mods, r.ac)];
      streak = hit ? streak + 1 : 0; if (adv) hitRun = 0;
      if (stands) { const ans = answer(o.foe, o.heavy && !hit, hit ? 'hit' : 'miss'); if (adv) hitRun = 0; line.push(ans.text); Object.assign(d, ans.out); } 
      if (!stands) streak = 0;
      marks.push({ n, die, total, dc: r.ac, grade: hit ? 'strong' : 'miss' });
      lines.push(line); detail[n] = d; return; }
    if (k === 'use') { const [kind, name, o = {}] = a; const line = [kind, 'Used ' + name]; let healed = 0;
      if (o.heal) { healed = Math.min(o.heal, hpMax - hp); hp += healed; line.push('Healed ' + healed); }
      if (o.dmg) { if (!r || left() <= 0) throw new Error('dlRecord: a blow on no foe (' + name + ')'); const was = left(); foeHp[room] = Math.max(0, was - o.dmg); line.push(r.short + ': health ' + was + ' → ' + foeHp[room]); }
      if (r && left() > 0 && (o.dmg || o.heal)) { const ans = answer(o.foe, false, null); line.push(ans.text); } else if (o.heal) line.push(hpOf());
      lines.push(line); return; }
    if (k === 'weak') { const [item, blow] = a; if (!r || left() <= 0) throw new Error('dlRecord: a weakness blow on no foe'); const was = left(); foeHp[room] = Math.max(0, was - blow); lines.push(['Weakness', item, r.short + ': health ' + was + ' → ' + foeHp[room]]); return; }
    throw new Error('dlRecord: unknown step ' + k);
  };
  // `foeLeft` is the health of the foe in the room the hero stands in (0 with none), for a run written as a loop.
  return { step, foeLeft: () => (room && rule() ? left() : 0), done: () => ({ lines, detail, hp, threat, rolls: n, nat20, foeHp, marks }) };
}
export function dlRecord(hero, hpMax, steps, opts) { const rec = dlRecorder(hero, hpMax, opts); steps.forEach(([k, ...a]) => rec.step(k, ...a)); return rec.done(); }

// What a finished record gives its session: the figures row, and the share card's third line (delve.md, Sharing: up to four rolls in the order rolled, each its name, mark and kept number; the last is always "Last roll").
export const dlFigures = (rec, hpMax, threatMax = 12) => ['Threat ' + rec.threat + '/' + threatMax, rec.rolls + (rec.rolls === 1 ? ' roll' : ' rolls'), ...(rec.nat20 ? [rec.nat20 + ' natural 20'] : []), 'HP ' + rec.hp + '/' + hpMax];
export const dlShareRow = ({ marks }) => { if (!marks.length) return null; const last = marks[marks.length - 1]; const gap = (m) => m.total - m.dc; const pick = new Map();
  const put = (m, name) => { if (m && !pick.has(m.n)) pick.set(m.n, { m, name }); };
  put(marks.find((m) => m.die === 20) || marks.filter((m) => m.grade === 'strong').sort((a, b) => gap(b) - gap(a))[0], 'Best roll');
  put(marks.find((m) => gap(m) === 0), 'Closest call');
  put(marks.find((m) => m.die === 1) || marks.filter((m) => m.grade === 'miss').sort((a, b) => gap(a) - gap(b))[0], 'Worst roll');
  pick.set(last.n, { m: last, name: 'Last roll' });
  return [...pick.values()].sort((a, b) => a.m.n - b.m.n).map(({ m, name }) => name + ' ' + (m.die === 20 ? '✨' : m.die === 1 ? '💀' : { strong: '🟩', weak: '🟨', miss: '🟥' }[m.grade]) + m.die).join(' · '); };
