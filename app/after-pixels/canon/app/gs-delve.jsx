// ============================================================================
// After Pixels — Delve's session page (1236): under the store's quiet head, the 3B character sheet, then the run card
// (the result as 3 · Band, the route of rooms and rolls, the held roll), then Every move collapsed. Built from the
// playgrounds delve-v3 to delve-v9 (owner, 2026-10-29: "integrate this"). Styles: app/gs-delve.css.
// Reads the run's record (GS_SESSIONS.delve and its copies in app/gs-data.jsx). Loads after app/gs-word.jsx.
// ============================================================================

// SAMPLE, from deployed content (monorepo scene/src/lib/domain/archetype.ts and content/delve/1.v2.json): the stats, health, defence, heavy attack, ultimate, protection and starting gear of the fighter
// and the rogue (one consumable each and no armour gear, as delve.md says). The Warren's carry limit is three.
// The record names no foe on a hero's roll, only the struck-back part, whose target is the hero's defence (10 the fighter, 14 the rogue).
// The warren's foe is deployed (content/delve/1.v2.json): The goblin sentries, a band of 3 on 12 health. Snaggle and Grizzletooth are deployed names with sample health; the Briar Keep's great hall holds the briar knight, also on sample health.
// A foe is [name, health, members]; a band has members. A hazard is a foe-shaped room with health and no roll back (the thorn stair, edition 3, health 4); an obstacle is no foe at all.
// KEEP: sample health only. Deployed foes have health 12 to 24, a hit takes the archetype's damage (fighter 5, rogue 4, twice on a natural 20; archetype.ts), and a weakness strike takes the edition's blow (8 for Grizzletooth); the band takes the hero's real damage here, so its count of members standing follows deployed.
// An obstacle (the chime run holds the bone chimes, edition 1) is passed by one success or partial success: no health, nothing strikes back, and the turn that gets past it says "<name> passed".
// A hazard has health (setting.ts: kind 'hazard'), never strikes back, and a success takes 2 off it (4 on a natural 20), a partial success 1 (scene-game.ts). A failure takes none, lands the hazard's harm of 2 and adds 1 threat (2 on a natural 1).
const DL_OBSTACLES = { 'the chime run': 'The bone chimes' };
const DL_HAZARDS = new Set(['the thorn stair']);
const DL_FOES = { 'the thorn stair': ['The thorn stair', 4], 'the great hall': ['The briar knight', 3], 'the warren': ['The goblin sentries', 12, 3], "snaggle's den": ['Snaggle', 3], 'the shrine cavern': ['Grizzletooth', 5] };
const DL_HIT = { 'Bryn the Fighter': 5, 'Wren the Rogue': 4 };
// How many of a band stand at this health, out of the health it began at (scene-game.ts standingAt): ceil(health x members / max); 0 once beaten.
const dlStanding = (members, health, max) => (health <= 0 ? 0 : Math.ceil((health * members) / max));
import React from 'react';
import { DS, useGs, GS_SESSIONS, GS_DV_TURNCOAT, gsEdPick, gsLiveSid } from './gs-data.jsx';
import { GsMoves } from './gs-session.jsx';
import { LbNowCard } from './gs-library.jsx';
import { EsxFold } from './gs-escape-sheet.jsx';
import { DV_NEXT } from './gs-delve-library.jsx';
import { GS_SESSION_BODY, GS_SESSION_QUIET } from './registry.js';

const DL_CARRY = 3;
const DL_HEROES = {
  // Bryn is deployed content (monorepo delve/1.v2.json, archetype.ts): the heavy attack Cleave, the ultimate Shield bash (one use a run), the armour an ox shield,
  // the starting gear a healing draught and a crowbar (a key), 23 health, stats as the archetype sets them.
  'Bryn the Fighter': { name: 'Bryn', cls: 'Fighter', stats: { Strength: 3, Dexterity: 1, Constitution: 2, Intelligence: 0, Wisdom: 0, Charisma: 0 },
    skills: [['Athletics', 'Strength'], ['Intimidation', 'Charisma'], ['Perception', 'Wisdom'], ['Survival', 'Wisdom']],
    abilities: [{ name: 'Shield bash', of: 1, ult: true, does: 'Strikes at once, no roll' }],
    fight: { defence: 10, armour: 2, armourName: 'ox shield', heavy: { name: 'Cleave', needs: 14, dmg: 7 } },
    gear: [{ name: 'Healing draught', kind: 'once', does: 'Heals 10' }, { name: 'Crowbar', kind: 'key', does: '' }] },
  // Hal, the Briar Keep's woodcutter (content/delve/3.v1.json): a fighter, so Bryn's stats, defence and 23 health; his own heavy attack Timberfall, ultimate Tree-felling, protection the elder-bark cloak (armour value as Bryn's, sample), a honey cake (heals 6) and an axe (a key).
  'Hal the Woodcutter': { name: 'Hal', cls: 'Woodcutter', stats: { Strength: 3, Dexterity: 1, Constitution: 2, Intelligence: 0, Wisdom: 0, Charisma: 0 },
    skills: [['Athletics', 'Strength'], ['Intimidation', 'Charisma'], ['Perception', 'Wisdom'], ['Survival', 'Wisdom']],
    abilities: [{ name: 'Tree-felling', of: 1, ult: true, does: 'Strikes at once, no roll' }],
    fight: { defence: 10, armour: 2, armourName: 'elder-bark cloak', heavy: { name: 'Timberfall', needs: 14, dmg: 7 } },
    gear: [{ name: 'Honey cake', kind: 'once', does: 'Heals 6' }, { name: 'Axe', kind: 'key', does: '' }] },
  // Wren, from the same source (rogue): defence 14, protection 1 (a leather jerkin), heavy attack Flurry needing 13 for 6, ultimate Sneak attack, 21 health, gear a healing draught and a rope (a key).
  'Wren the Rogue': { name: 'Wren', cls: 'Rogue', stats: { Strength: 0, Dexterity: 3, Constitution: 1, Intelligence: 1, Wisdom: 0, Charisma: 2 },
    skills: [['Stealth', 'Dexterity'], ['Acrobatics', 'Dexterity'], ['Sleight of Hand', 'Dexterity'], ['Deception', 'Charisma'], ['Perception', 'Wisdom'], ['Investigation', 'Intelligence'], ['Persuasion', 'Charisma']],
    abilities: [{ name: 'Sneak attack', of: 1, ult: true, does: 'Strikes at once, no roll' }],
    fight: { defence: 14, armour: 1, armourName: 'leather jerkin', heavy: { name: 'Flurry', needs: 13, dmg: 6 } },
    gear: [{ name: 'Healing draught', kind: 'once', does: 'Heals 10' }, { name: 'Coil of rope', kind: 'key', does: '' }] },
};
const DL_GEAR_DOES = { 'Iron key': 'Opens the lock it fits', 'Pepper pouch': 'Deals 4 damage', 'Flask of lamp oil': 'Restores 3 light' };

// ---- The model: the record's lines read into the rooms stood in (going back included), the rolls and the gear. ----
// A fight roll is a hit or a miss (delve.md: Check); an option or an obstacle is a success, a partial success or a failure. A fight die is never the middle tone.
const dlGrade = (r) => (r.fight ? { strong: 'Hit', miss: 'Miss' } : { strong: 'Success', weak: 'Partial success', miss: 'Failure' })[r.tier];
// A heavy attack names itself ("Heavy attack: Cleave") and is an attack on the foe, not an option.
// A roll's line: [stat, the action if it was an option, its grade, "Natural 20" or "Natural 1", "d20 14 + 3 = 17 vs 12", "HP 19/23"], the dice as the deployed record writes them (monorepo scene session-record.ts diceOf).
// A fight roll's line opens with Hit or Miss (or "Heavy attack: Cleave"); an option's with its name, then Success, Partial success or Failure.
const DL_GRADE = /^(Hit|Miss)$/;
// An attempt on the room's own obstacle or hazard is graded and names no action: ["Strength", "Failure", "d20 6 + 3 = 9 vs 12", "HP 19/23"].
const DL_GRADED = /^(Success|Partial success|Failure)$/;
const dlStruck = (parts, type) => { const sb = /^Struck back: (?:d20s (\d+) and (\d+), kept (\d+)|d20 (\d+))(?: \+ (\d+))? vs (\d+), (hit|missed)(?:, (?:d(\d+) (\d+) \+ (\d+) = )?(\d+) damage)?/.exec(parts.find((p) => /^Struck back: /.test(p)) || '');
  if (!sb) return null; const two = sb[1] != null; const roll = +(sb[3] || sb[4]);
  return { roll, other: two ? (+sb[1] === roll ? +sb[2] : +sb[1]) : null, bonus: sb[5] ? +sb[5] : 0, dc: +sb[6], hit: sb[7] === 'hit', dmg: sb[11] ? +sb[11] : 0, dd: sb[8] ? { die: 'd' + sb[8], v: +sb[9], b: +sb[10] } : null, type }; };
// The foe's roll back is the last part of a hero roll's or a use's line: "Struck back: d20 14 vs 10, hit, 1 damage, HP 21/23" or "..., missed"; with advantage, "d20s 14 and 6, kept 14 vs 10". Its target is the hero's defence.
const dlSigned = (n) => (n < 0 ? '−' : '+');
// The parts of a roll's bonus, as the record names them: `detail` (the run's `detail[roll number]`) lists them; a record that lists none has the stat alone, as the platform names it first.
const dlParts = (mod, stat, d) => (d && d.parts ? d.parts : mod ? [[dlSigned(mod), Math.abs(mod), stat.slice(0, 3).toUpperCase()]] : []);
const dlSumOf = (die, parts) => die + parts.reduce((n, p) => n + (p[0] === '−' ? -p[1] : p[1]), 0);
const dlRoll = (l, d) => {
  const parts = l.slice(1).map(String); const t = parts.join(' · ');
  const m = /(?:d20s (\d+) and (\d+), kept (\d+)|d20 (\d+)) ([+-]) (\d+) = (-?\d+) vs (\d+)/.exec(t); if (!m) return null;
  const kept = +(m[3] || m[4]); const two = m[1] != null; const other = two ? (+m[1] === kept ? +m[2] : +m[1]) : null; const mod = (m[5] === '-' ? -1 : 1) * +m[6];
  const crit = /Natural 20/.test(t); const fumble = /Natural 1\b/.test(t);
  const fight = DL_GRADE.test(parts[0]) || /^Heavy attack/.test(parts[0]);
  const tier = fumble ? 'miss' : /Partial success/.test(t) ? 'weak' : /\bMiss\b|Failure/.test(t) ? 'miss' : (/\bHit\b|\bSuccess\b/.test(t) || crit) ? 'strong' : 'miss';
  const hp = /HP\s+(\d+)\/(\d+)/.exec(t);
  const bonus = dlParts(mod, l[0], d); const dmg = d && d.dmg ? { ...d.dmg, total: dlSumOf(d.dmg.v, d.dmg.parts) } : null;
  return { stat: l[0], fight, kept, other, mod, parts: bonus, dmg, skill: d && d.skill, total: +m[7], dc: +m[8], gap: +m[7] - +m[8], tier, crit, fumble, two, hp: hp ? +hp[1] : null, foe: dlStruck(parts, d && d.foeType), action: DL_GRADE.test(parts[0]) || DL_GRADED.test(parts[0]) ? '' : /^Heavy attack/.test(parts[0]) ? 'Heavy attack' : parts[0], move: (/^Heavy attack: (.+)$/.exec(parts[0]) || [])[1] || '' };
};
// KEEP: under a held use's name, the grey words say only what it does ("strikes at once", "heals 10"): the heading already names the kind
// and the sparkle already says no roll, so both drop there; the hero sheet keeps the full text (owner, 2026-11-10).
const dlUseDoes = (d) => { const s = d.replace(/,? *no roll$/i, ''); return s.charAt(0).toLowerCase() + s.slice(1); };
// A use: the hero spent an ability or the ultimate, or used gear, and rolled nothing ("Ability · Used shield bash · Grizzletooth: health 4 → 3 · Struck back: d20 7 vs 10, missed").
// Its sheet entry gives what it does; the foe's roll back reads as a hero roll's does.
const DL_USE_KINDS = /^(Ability|Ultimate|Gear|Weakness)$/;
// A weakness strike is a use too: the line is ["Weakness", "A flask of lamp oil", "Grizzletooth: health 24 → 16"], the item named with no "Used", and the foe staggered, so no roll back.
const DL_WEAK_DOES = 'no blow back';
const dlUse = (l, hero) => { if (l[0] === 'Weakness') { const w = /^(?:the |an? )?(.+)$/i.exec(String(l[1])); return w ? { use: true, what: 'Weakness', name: dlCap(w[1]), does: DL_WEAK_DOES, tier: 'use', foe: null, hp: null } : null; }
  const m = DL_USE_KINDS.test(l[0]) && /^Used (?:the |an? )?(.+)$/i.exec(String(l[1])); if (!m) return null;
  const parts = l.slice(1).map(String); const sheet = DL_HEROES[hero] || DL_HEROES['Wren the Rogue']; const name = dlCap(m[1]);
  const has = [...sheet.abilities, ...sheet.gear].find((x) => x.name === name); const hp = /HP\s+(\d+)\/(\d+)/.exec(parts.join(' · '));
  return { use: true, what: l[0], name, does: has ? dlUseDoes(has.does) : '', tier: 'use', foe: dlStruck(parts), hp: hp ? +hp[1] : null }; };
// KEEP: a run that did not win and ends on a use has no settled kicker yet: these words are a roll's, and no state reaches that case.
const DL_END = { won: 'Winning blow', fallen: 'Last blow', overrun: 'Last roll', live: 'Latest roll' };
// The key moments, keyed by turn: Best roll (a natural 20 on any roll, else the check with the widest margin), Closest call (the first roll whose total equals its target, an attack against the foe's AC included),
// Worst roll (a natural 1, else the miss furthest below its target, attacks included), Biggest hit (the attack that dealt the most damage, the first on a tie), and the turn the run ended on (a roll or a use).
// KEEP: a roll earns every moment it deserves, so one roll can be two or more (a natural 20 whose damage is the run's biggest is Best roll and Biggest hit); its held roll's title names each, capitalised and joined by a middle dot, in one row ("Best roll · Biggest hit"), and the die carries the marks of each.
const DL_MOMENT_ORDER = ['Best roll', 'Closest call', 'Worst roll', 'Biggest hit'];
const dlMoments = (T, end) => {
  if (!T.length) return [];
  const last = T[T.length - 1]; const pool = T.filter((r) => !r.use && !r.lost); const by = new Map(); const out = [];
  const take = (r, kicker) => { if (!r) return; if (!by.has(r.t)) { by.set(r.t, { r, kickers: [] }); out.push(by.get(r.t)); } by.get(r.t).kickers.push(kicker); };
  take(pool.find((r) => r.crit) || pool.filter((r) => !r.fight && r.tier === 'strong').sort((a, b) => b.gap - a.gap)[0], 'Best roll');
  take(pool.find((r) => r.gap === 0), 'Closest call');
  take(pool.find((r) => r.fumble) || pool.filter((r) => r.tier === 'miss').sort((a, b) => a.gap - b.gap)[0], 'Worst roll');
  take(pool.filter((r) => r.dmg).sort((a, b) => b.dmg.total - a.dmg.total || a.t - b.t)[0], 'Biggest hit');
  take(last, DL_END[end]);
  out.forEach((x) => { x.kickers.sort((a, b) => (DL_MOMENT_ORDER.indexOf(a) + 1 || 9) - (DL_MOMENT_ORDER.indexOf(b) + 1 || 9)); x.kicker = x.kickers[0]; x.r.big = x.kickers.includes('Biggest hit'); });
  return out.sort((a, b) => a.r.t - b.r.t);
};
// A band's members and how many stand, carried beside its health, which is never drawn for a band.
const dlBand = (f, health, max) => (f[2] ? { members: f[2], standing: dlStanding(f[2], health, max) } : {});
const dlCap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
export const dlBuild = (s) => {
  const stops = []; const rolls = []; const turns = []; const order = []; let cur = null; let hp = s.hpMax; const foeHp = {}; let run = 0; let fh = 0; let best = 0; const passedRooms = new Set();
  // A play may name its foe afresh (`foeName`, by room), the health and band of the room's foe kept.
  const foeOf = () => { const f = cur && DL_FOES[cur.name.toLowerCase()]; const nm = f && (s.foeName || {})[cur.key.toLowerCase()]; return f ? { f: nm ? [nm, ...f.slice(1)] : f, k: cur.key } : null; };
  // A fight is on while the room's foe stands: a hazard or an obstacle is no fight, and a foe already beaten is no fight to come back to.
  const standing = () => { const f = foeOf(); return !!f && !DL_HAZARDS.has(cur.name.toLowerCase()) && foeHp[f.k] !== 0; };
  const open = (name, back) => { name = name && dlCap(name); const key = name || '_first'; if (!order.includes(key)) order.push(key);
    // KEEP: leaving a room with its foe still standing (fled, or gone back) ends that fight, so both counts start again from 0 (delve.md: Streak).
    if (cur && standing()) { run = 0; fh = 0; }
    cur = { i: stops.length, key, name: name || 'First room', back, num: order.indexOf(key) + 1, rolls: [], turns: [] }; stops.push(cur);
    // KEEP: the streak starts again from 0 when a fight with a foe begins (delve.md: Streak); it also does when that fight ends, however it ends. A hazard is no fight: its successes add to the streak.
    if (standing()) { run = 0; fh = 0; } };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Room') { const p = String(l[1]); open(p.replace(/^(Entered|Doubled back to) /, ''), /^Doubled back to /.test(p)); return; }
    if (!cur) open(null, false);
    // A gear line that wears a foe down names its health before and after ("Snaggle: health 3 → 1").
    const wear = DL_USE_KINDS.test(l[0]) && (/→ (\d+)$/.exec(String(l[2] || '')) || (l[0] === 'Weakness' && /: defeated$/.test(String(l[2] || '')) && [null, 0])); const fo = foeOf(); const foeMx = fo ? (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1] : 0;
    const was = fo ? (foeHp[fo.k] != null ? foeHp[fo.k] : foeMx) : 0; if (wear && fo) foeHp[fo.k] = +wear[1];
    // The turn that takes a foe's health to 0 beats it: its held roll says so and keeps the foe's bar, at 0.
    const downed = (fo && was > 0 && foeHp[fo.k] === 0) ? { name: fo.f[0], max: foeMx, members: fo.f[2] } : null;
    const u = dlUse(l, s.hero);
    // KEEP: a use takes a turn on the route and in the held roll but is no roll: it has no roll number and breaks no streak. It is a key moment only as the run's last turn.
    if (u) { u.t = turns.length + 1; u.stop = cur.i; u.room = cur.name; u.back = cur.back;
      u.harm = u.hp != null ? Math.max(0, hp - u.hp) : 0; if (u.hp != null) hp = u.hp;
      if (fo && u.foe) { const max = (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1]; u.foe = { ...u.foe, name: fo.f[0], health: foeHp[fo.k] != null ? foeHp[fo.k] : max, max, ...dlBand(fo.f, foeHp[fo.k] != null ? foeHp[fo.k] : max, max) }; }
      // KEEP: a weakness strike has no foe roll, so its foe health is carried as `meter`, drawn as a kill's is ("health alone"), at the health after the blow.
      if (fo && l[0] === 'Weakness') u.meter = { name: fo.f[0], health: foeHp[fo.k] != null ? foeHp[fo.k] : foeMx, max: foeMx, ...dlBand(fo.f, foeHp[fo.k] != null ? foeHp[fo.k] : foeMx, foeMx) };
      if (downed) { u.downed = downed; run = 0; fh = 0; } turns.push(u); cur.turns.push(u); return; }
    const r = dlRoll(l, (s.detail || {})[rolls.length + 1]); if (!r) return;
    r.n = rolls.length + 1; r.t = turns.length + 1; r.stop = cur.i; r.room = cur.name; r.back = cur.back;
    r.harm = r.hp != null ? Math.max(0, hp - r.hp) : 0; if (r.hp != null) hp = r.hp;
    const hazard = !!fo && DL_HAZARDS.has(cur.name.toLowerCase()); const graded = !r.action && !r.fight;
    // KEEP: an obstacle's turn draws the graded roll alone; the turn that gets past it (a success or a partial success, since its health is 1) says "<obstacle> passed" in the slot a beaten foe's name takes.
    const obstacle = DL_OBSTACLES[cur.name.toLowerCase()];
    if (obstacle && graded && !passedRooms.has(cur.key) && r.tier !== 'miss') { passedRooms.add(cur.key); r.passed = obstacle; }
    // KEEP: a hazard's every turn draws its health bar, with no foe roll row; the room's name stays on the bar and at 0 the turn says "<hazard> beaten", as a killed foe does. A failure costs the hero and adds threat.
    if (hazard && graded) { const max = (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1]; const left = foeHp[fo.k] != null ? foeHp[fo.k] : max;
      foeHp[fo.k] = Math.max(0, left - (r.tier === 'strong' ? (r.crit ? 4 : 2) : r.tier === 'weak' ? 1 : 0));
      r.meter = { name: fo.f[0], health: foeHp[fo.k], max }; if (left > 0 && foeHp[fo.k] === 0) r.downed = { name: fo.f[0], max };
    }
    // A missed attack on a foe adds 1 threat too, 2 on a natural 1, drawn as the Cost under the foe's roll back; a failed attempt on an obstacle or a hazard adds 1 threat, 2 on a natural 1 (scene-game.ts foeOutcomeOf).
    if ((hazard || obstacle) && graded && r.tier === 'miss') r.threat = r.fumble ? 2 : 1;
    // A foe stands in a fight room: each hit of the hero's own attack takes one health (two on a natural 20); a band takes the hero's damage (DL_HIT). Its roll back, where the line holds one, rides on the roll.
    if (fo && !hazard && r.fight && r.tier === 'miss') r.threat = r.fumble ? 2 : 1;
    if (fo && !hazard && (!r.action || r.action === 'Heavy attack')) { const left = foeHp[fo.k] != null ? foeHp[fo.k] : (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1]; const dmg = r.dmg ? r.dmg.total : (fo.f[2] ? DL_HIT[s.hero] || 4 : 1) * (r.crit ? 2 : 1); foeHp[fo.k] = r.tier === 'miss' ? left : Math.max(0, left - dmg); if (left > 0 && foeHp[fo.k] === 0) r.downed = { name: fo.f[0], max: foeMx, members: fo.f[2] };
      if (r.foe) { const max = (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1]; r.foe = { ...r.foe, name: fo.f[0], health: foeHp[fo.k], max, ...dlBand(fo.f, foeHp[fo.k], max) }; } }
    // KEEP: a fight's hits add to the streak, and run apart as the fight hits (a fight has no partial hit): two hits in a row give the next attack advantage, and that attack starts the fight hits again from 0, hit or miss. The longest streak is the streak's highest point, the hit that beats the foe included (delve.md: Streak).
    const won = r.tier === 'strong'; run = won ? run + 1 : 0; if (r.fight) fh = fh >= 2 || !won ? 0 : fh + 1; best = Math.max(best, run);
    if (fo && !hazard && foeHp[fo.k] === 0) { run = 0; fh = 0; }
    rolls.push(r); turns.push(r); cur.rolls.push(r); cur.turns.push(r);
  });
  const end = s.live ? 'live' : s.end;
  // KEEP: a run that ends with its foe still standing ends that fight: both counts are back at 0.
  if (!s.live && cur && standing()) { run = 0; fh = 0; }
  // KEEP: a run lost with no roll or use in its last room (a story turn killed the hero, or the threat filled on a story turn or on going back) ends on a plain grey cross
  // on that room: no die outline, not pressable, nothing held open, and no "Last blow" or "Last roll" on an earlier roll. A roll that filled the threat keeps "Last roll". The record
  // keeps no turn for this, so the cross is no turn: it sits on the room and ends the key moments, and the roll before it competes for best, closest or worst like any other.
  const lost = cur && !s.live && s.lostOff ? { lost: true, over: !!s.lostOff.over, harm: s.lostOff.harm || 0, name: s.lostOff.name, t: turns.length + 1, stop: cur.i, room: cur.name, back: cur.back } : null;
  if (lost) { cur.turns.push(lost); hp = Math.max(0, hp - lost.harm); }
  const moments = dlMoments(lost ? [...turns, lost] : turns, end);
  // KEEP: a closing use on a won run is drawn green (the one use that is not grey); on any other end it keeps the use's grey sparkle.
  const closer = turns[turns.length - 1]; if (closer && closer.use && end === 'won') closer.won = true;
  const fe = foeOf(); const fightLive = !!fe && !DL_HAZARDS.has(cur.name.toLowerCase()) && (foeHp[fe.k] == null || foeHp[fe.k] > 0);
  return { stops, rolls, turns, hp, run, fh, longest: best, fightLive, end, lost: !!lost, mom: Object.fromEntries(moments.map((x) => [x.r.t, x])) };
};
const dlSay = (r, foe = true) => r.lost && r.over ? 'The threat filled in ' + r.room + ': ' + r.name : r.lost ? 'Fell in ' + r.room + ': ' + r.name + ', ' + r.harm + ' damage, 0 hit points left' : r.use ? dlKindSay(r.what) + ' used, ' + r.room + ': ' + r.name + (foe && r.foe ? (r.foe.hit ? ', the foe hit back' : ', the foe missed back') : '') + (r.downed ? ', ' + r.downed.name + ' beaten' : '') : 'Roll ' + r.n + ', ' + r.room + ': ' + (r.action ? r.action + ', ' : '') + r.stat + ' ' + r.total + ' against ' + r.dc + ', ' + dlGrade(r).toLowerCase() + (r.crit ? ', natural 20' : r.fumble ? ', natural 1' : '') + (r.two ? ', two dice, the higher kept' : '') + (foe && r.foe ? (r.foe.hit ? ', the foe hit back' : ', the foe missed back') : '') + (r.downed ? ', ' + r.downed.name + ' beaten' : '') + (r.passed ? ', ' + r.passed + ' passed' : '');

// ---- The die, from the design system (DS.DelveDie, DS.DelveUseDie): strong filled green, weak filled yellow, miss empty, natural 20 rimmed,
// natural 1 red-edged, a use a quiet sparkle. A turn the foe answered has the foe's roll as a red hex behind it. DL_HEX and DL_RIM
// still draw the sheet's hexes (stats, inspiration). ----
const DL_HEX = '18,0 36,10 36,30 18,40 0,30 0,10'; const DL_RIM = '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8';
export const DlDie = ({ r, size = 36, sel, foe = true, surface }) => (r.lost
  ? <svg className="dl-cross" viewBox="0 0 12 12" width={Math.round(size * 0.45)} height={Math.round(size * 0.45)} aria-hidden="true" focusable="false"><path d="M2 2l8 8M10 2l-8 8" /></svg>
  : r.use
  ? <DS.DelveUseDie foe={foe && !!r.foe} selected={sel} surface={surface} size={size} won={!!r.won} />
  : <DS.DelveDie kind={r.tier} value={r.kept} other={r.two ? r.other : undefined} crit={r.crit} biggest={!!r.big && r.tier === 'strong'} fumble={r.fumble} foe={foe && !!r.foe} selected={sel} surface={surface} size={size} />);
const DlDieBtn = ({ r, size, act, on, foe, lit }) => (r.lost ? <span className="dv2-lost" role="img" aria-label={dlSay(r)} style={{ width: size, height: Math.round(size * 40 / 36) }}><DlDie r={r} size={size} /></span> :
  <button type="button" className="dv2-dbtn" aria-pressed={act === r.t} aria-label={dlSay(r, foe !== false)} data-t={r.t} onClick={() => on.sel(r.t)} onMouseEnter={() => on.hov(r.t)} onMouseLeave={() => on.hov(null)}>
    <DlDie r={r} size={size} sel={act === r.t || lit === r.t} foe={foe} />
  </button>);

// ---- The result statement, 3 · Band (owner, 2026-10-29): the ending word, a hairline, the setting's line. No tally. ----
export const dlWord = (m) => ({ live: 'In progress', fallen: 'Fallen', won: 'Triumphed', overrun: 'Overwhelmed' }[m.end]);
const dlTone = (m) => (m.end === 'won' ? 'ok' : m.end === 'live' ? 'live' : 'bad');
const DlResult = ({ s, m, extra }) => { const line = m.end === 'live' ? null : s.result;
  return (<div className="dv7r-band"><h2 className={'dv7r-word is-' + dlTone(m)}>{dlWord(m)}</h2>{line && <p className="dv7r-line">{line}</p>}{extra}</div>); };

// ---- The held roll (a pressed die): its head, then the turn as sums. ----
// The head: the title left (the key moment or moments the die earned, else "Roll n"), the dice right (the hero's d20, and the foe's diamond when it struck back), with one muted sentence under the title (the roll's number and the room).
// The foe's turn is drawn the same way as the hero's: its attack, then its damage.
// KEEP: a tile is a button in the box's own colour with the control edge (Escape's cards); hover, on a mouse only, turns it the panel's colour; open, its edge turns off-white and the named form (`20 d20 + 3 STR + 2 Martial ...`) opens under the side's tiles through the 220ms fold; one tile of a side is open at a time.
const DlFoeDie = ({ f, size = 34 }) => <DS.DelveFoeDie value={f.roll} other={f.other != null ? f.other : undefined} hit={f.hit} surface="popup" size={size} />;
// "Back in the chime run": the room's name leads with "The", so it drops to lower case mid-sentence.
const dlRoomSaid = (r) => (r.back ? 'Back in ' + r.room.replace(/^The /, 'the ') : r.room);
// The foe's health after the turn, or a band's count: a band's foe line is its name and "2 of 3 standing" in grey on one line, with no bar and never the band's health (delve.md: a band shows how many stand instead).
const dlMeterOf = (r) => { const x = r.foe ? r.foe : r.meter ? r.meter : r.downed ? { name: r.downed.name, health: 0, max: r.downed.max, members: r.downed.members, standing: 0 } : null;
  return x && { name: x.name, n: x.health, of: x.max, members: x.members, standing: x.standing }; };
const DlFoeMeter = ({ mt }) => (mt.members
  ? <div className="dv6-band"><b>{mt.name}</b> <span>{mt.standing} of {mt.members} standing</span></div>
  : <DlMeter label={mt.name} n={mt.n} of={mt.of} />);
// The line under the heading: the foe or hazard a turn took to 0 is beaten, and an obstacle a turn got past is passed.
const dlBeat = (r) => (r.downed ? r.downed.name + ' beaten' : r.passed ? r.passed + ' passed' : '');
// The Cost: what the turn took from the hero, in the terms the held roll uses. A foe's turn shows its harm in its damage sum instead.
const dlCost = (r) => [r.harm > 0 && !r.foe && 'Hit points −' + r.harm, r.threat > 0 && 'Threat +' + r.threat].filter(Boolean).join(' · ');
const dlKindSay = (k) => (k === 'Weakness' ? 'Weak spot' : k);
// Under a key moment's title: a roll's number, or a use's kind and name ("Ability · Dynamite").
const dlTurnName = (r) => (r.use ? dlKindSay(r.what) + ' · ' + r.name : 'Roll ' + r.n);
// The result word's tone: a hit or success green, a partial yellow, a natural 1 red, a plain miss the text's own colour.
const dlOutTone = (r) => (r.fumble ? 'err' : { strong: 'ok', weak: 'part' }[r.tier] || '');
// A sum: { d: [die, 'd20'], adv, drop, m: [[sign, n, source]], t: total, vs, out: [word, tone], typ }.
const dlAtkSum = (r) => ({ d: [r.kept, 'd20'], adv: r.two, drop: r.other, m: r.parts, t: r.total, vs: 'vs ' + (r.fight ? 'AC ' : 'DC ') + r.dc, out: [dlGrade(r), dlOutTone(r)] });
const dlDmgSum = (r) => ({ d: [r.dmg.v, r.dmg.die], m: r.dmg.parts, t: r.dmg.total, typ: r.dmg.type && r.dmg.type.toLowerCase() });
const dlFoeAtkSum = (f) => ({ d: [f.roll, 'd20'], adv: f.other != null, drop: f.other, m: f.bonus ? [['+', f.bonus, 'Bonus']] : [], t: f.roll + f.bonus, vs: 'vs AC ' + f.dc, out: f.hit ? ['Hit', 'err'] : ['Miss', ''] });
const dlFoeDmgSum = (f) => ({ d: f.dd ? [f.dd.v, f.dd.die] : null, m: f.dd && f.dd.b ? [['+', f.dd.b, 'Bonus']] : [], t: f.dmg, typ: f.type || 'damage' });
// The named form: each number with its source; a dropped advantage die follows the kept one, its number struck diagonally.
const DlNamed = ({ s, total }) => (<span className="dvH-pn">
  <span className="dvH-c"><b>{s.d[0]}</b>{s.drop != null && <> <span className="dvH-x" aria-label={s.drop + ', dropped'}>{s.drop}</span></>} {s.d[1]}</span>
  {s.m.map((p, i) => <span key={i} className="dvH-c">{p[0]}{' '}<b>{p[1]}</b> {p[2]}</span>)}
  {total != null && <span className="dvH-c">= <b>{total}</b></span>}
</span>);
// A roll that earned more than one moment is titled with each of them, capitalised and joined by a middle dot: "Best roll · Biggest hit", "Best roll · Closest call · Biggest hit". "Latest roll" always comes first: "Latest roll · Best roll".
const dlTitle = (names) => [...names.filter((n) => n === DL_END.live), ...names.filter((n) => n !== DL_END.live)].join(' · ');
// KEEP: the held roll opens with a small top strip: the title (the key moment or moments the die earned, else "Roll n"), the roll's number, room and, when the turn beat or passed something, those words, and at its right the dice (the hero's d20 and the foe's diamond when it struck back). Under a 480px box the beaten or passed words take their own row, without the dot that joins them on a wider box, and each wraps between its words, so it fits a 280px box. The strip's dice sit in frames the size of their drawn shapes, so the drawn shape, not its empty picture margin, is 12px from the box's top and right edges, as the text is from its left.
// The empty margin round a die's drawn shape in its picture box, in die units (right, top; the same on the opposite side): the picture is 46 by 50, a hexagon leaves 5 and 5, a natural 20's rim 2 and 1.5, a biggest hit grown 2 and 1.7.
const dlInk = (r) => (r.crit ? [2, 1.5] : r.big ? [2, 1.7] : [5, 5]);
// KEEP: the held roll's dice are one drawn size on every roll it holds (a hexagon 25px wide), a key moment's included, so moving between rolls never changes their size: a die whose rim reaches further into its picture (a natural 20, a biggest hit) is drawn smaller to match (the user, 2026-11-25: "BETWEEN CARDS these are changing sizes"); the foe's diamond is drawn the same visual size as the hexagon beside it, not only as tall.
const DL_HELD_DIE = 32;
// A die in a frame the size of its drawn shape: the picture is centred in it and its empty margin overflows, so the frame's edge is the shape's edge.
const DlInkFrame = ({ w, h, children }) => <span className="dvH-ink" style={{ width: w, height: h }}>{children}</span>;
const DlHeldHead = ({ r, x }) => { const size = DL_HELD_DIE * (46 - 2 * 5) / (46 - 2 * dlInk(r)[0]); const foeSize = Math.round(DL_HELD_DIE * 40 / 46); const names = x ? x.kickers : [r.use ? dlKindSay(r.what) : 'Roll ' + r.n];
  return (<div className="dvH-hd"><div className="dvH-tt"><p className="dvH-k">{dlTitle(names)}</p>
      <p className="dvH-rm">{(x ? dlTurnName(r) + ' · ' : '') + dlRoomSaid(r)}{dlBeat(r) && <> <span className="dvH-sep">· </span><span className="dvH-beat">{dlBeat(r)}</span></>}</p></div>
    <div className="dvH-dd"><DlInkFrame w={size * (46 - 2 * dlInk(r)[0]) / 46} h={size * (50 - 2 * dlInk(r)[1]) / 46}><DlDie r={r} size={size} surface="popup" foe={false} /></DlInkFrame>
      {r.foe && <DlInkFrame w={foeSize * 36 / 40} h={Math.round(foeSize * 44 / 40) * 40 / 44}><DlFoeDie f={r.foe} size={foeSize} /></DlInkFrame>}</div></div>); };
// ---- The held roll's chips (the user, 2026-11-25, "4. Split chip"): one row, "You" and "Foe", each side one chip, labelled above. A chip is the hit on the left (the total, its target, the result) and, when it dealt damage, a hairline and "N damage" on the right; a miss has no right part. ----
// KEEP: a side is one tap chip, at least 44px tall, in Escape's tap card (esx-card) at its own size; the two sides share one row while the held roll is 452px wide or more, else they stack, You over Foe, each chip at full width; a lone side (a check, an option, a hero's attack the foe did not answer) has its chip take the row under 400px and its half above it, and its label the whole row. The chip's own width sets its shape: from 200px it is one row (hit, hairline, damage), which two rows always give it; the narrower shape (the damage on a second row under a hairline) stays for a chip below 200px. The d20 sum ("8 + 3") is not on the chip: in a chip of about 120px, where the hit and the damage already fill two rows, so the sum lives in the breakdown only, at every width.
// KEEP: a chip's breakdown opens under the chip at the chip's own width through the 220ms fold, one per side at a time: the d20's named form with its total (`14 d20 + 3 Strength + 2 Martial = 19`, a dropped advantage die struck diagonally) and, for a hit that dealt damage, a second named form under a small "Damage" caption naming the type ("Damage · slashing") with the damage dice, then each bonus with its source and the total. A miss opens the d20's form alone, with no caption. The parts break only between one another.
// KEEP: advantage is never written in a side's label ("You", "Foe"): the die in the strip's top right already shows it (the second die behind the first) and the opened breakdown shows it as the dropped number struck, with no "advantage" word (the user, 2026-11-26).
const DlChipBreak = ({ atk, dmg }) => (<div className="dvH-pnl">
  <div className="dvC-pr">{dmg && <span className="dvC-pk">Attack</span>}<DlNamed s={atk} total={atk.t} /></div>
  {dmg && <div className="dvC-pr"><span className="dvC-pk">Damage{dmg.typ && dmg.typ !== 'damage' ? ' · ' + dmg.typ : ''}</span>{dmg.d ? <DlNamed s={dmg} total={dmg.t} /> : <span className="dvH-pn"><span className="dvH-c"><b>{dmg.t}</b></span></span>}</div>}
</div>);
const DlChip = ({ id, label, atk, dmg, foe, lone, still, body }) => { const [open, setOpen] = React.useState(false);
  const inner = body || (<span className="dvC-in"><span className="dvC-hit"><span className="dvT-tot">{atk.t}</span><span className="dvC-vs"><span>{atk.vs}</span><span className={'dvH-out ' + atk.out[1]}>{atk.out[0]}</span></span></span>
    {dmg && <span className="dvC-dm"><b>{dmg.t}</b> damage</span>}</span>);
  return (<div className={'dvC-side' + (foe ? ' is-foe' : '') + (lone ? ' is-lone' : '')}>{label && <p className="dvC-lab">{label}</p>}
    {still ? <div className="esx-card dvC-chip is-still">{inner}</div>
      : <button type="button" className={'esx-card dvC-chip' + (open ? ' is-open' : '')} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{inner}</button>}
    {!still && <div id={id} className="dvC-fold"><EsxFold open={open}>{open && <DlChipBreak atk={atk} dmg={dmg} />}</EsxFold></div>}
  </div>); };
// KEEP: under the chips the foe's health is one thin row (name, a 4px bar, the count) at the box's full width.
const DlHeldRoll = ({ r, x }) => { const mt = dlMeterOf(r); const cost = dlCost(r); const f = r.foe;
  // KEEP: the You label carries what the hero did and what the turn cost them, each after a middle dot: "You · Slip the trap · Cost Threat +1" (the user, 2026-11-25: the cost sits "next to the You", with "a . there"); a turn with nothing to say over its chip and no cost has no label.
  const costSaid = cost ? <span className="dvH-cost"> · Cost <b>{cost}</b></span> : null;
  const said = [r.action, r.move || r.skill].filter(Boolean).join(' ');
  const act = r.use ? (f || cost ? <><b>You</b>{costSaid}</> : null) : r.action || r.fight || r.skill || f || cost ? <><b>You</b>{!r.use && (r.action || r.skill || r.move) && said && <span> · {said}</span>}{costSaid}</> : null;
  const used = r.use ? (<span className="dvH-act">Used <b>{r.name}</b>{r.does && <span className="is-does"> {r.does}</span>}</span>) : null;
  return (<>
    <DlHeldHead r={r} x={x} />
    <div className={'dvC-row' + (f ? '' : ' is-lone')}>
      <DlChip id={'dvH-' + r.t} label={act} atk={r.use ? null : dlAtkSum(r)} dmg={r.use || !r.dmg ? null : dlDmgSum(r)} lone={!f} still={r.use} body={used} />
      {f && <DlChip foe id={'dvH-' + r.t + 'f'} label={<><b>Foe</b></>} atk={dlFoeAtkSum(f)} dmg={f.hit && f.dmg > 0 ? dlFoeDmgSum(f) : null} />}
    </div>
    {mt && <div className="dvH-fm"><DlFoeMeter mt={mt} /></div>}
  </>); };
const DlHeld = ({ m, act }) => { const r = act ? m.turns[act - 1] : null; if (!r) return null;
  return (<div className="dv3-live" aria-live="polite"><div className="dvH-box"><DlHeldRoll key={r.t} r={r} x={m.mom[r.t]} /></div></div>); };
// ---- The board, Glance: the run as a map (the Now card's number strip grown to the board, every stop a box, its rolls small beneath), and under it the open room: its name and dice at full size, the held roll on the right. ----
// A room gone back to: a curved arrow drawn in the box's line, never the ↩ character (phones draw it as an emoji; Joe).
export const DlBackArrow = () => (<svg className="dv2-back" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
  <path d="M4.5 10.5 1.5 7.5l3-3M1.5 7.5h6a3 3 0 0 0 0-6H5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>);
// KEEP: a stop's number is grey (muted text, the control edge) when nothing was rolled or used in it and white when anything was, a return or not; the back-arrow alone marks a return. A room not yet reached keeps its own fainter outline.
const dlNone = (st) => !(st.turns && st.turns.some((r) => !r.lost));
export const dlNum = (st, extra = '') => 'dv2-num' + (st.back ? ' is-back' : '') + (dlNone(st) ? ' is-none' : '') + extra;
// KEEP: the map's rows share the stops evenly (20 stops: one row of 20 on a wide card, two of 10 at about 900px), each stop a 44px column. From 5 stops a map that fits one row spreads edge to edge, its first and last boxes on the card's content edges (the user, 2026-11-25: Spread); 1-4 stops sit centred, below; a map on several rows keeps gaps of 6px to 76px, and its short last row ends early on the right.
export const DL_MAP_COL = 44; export const DL_MAP_GAP = 6; const DL_MAP_GAP_MAX = 76; export const DL_MAP_INSET = 8; export const DL_MAP_FEW = 4; export const DL_MAP_GAP_FEW = 32;
// KEEP: a map of 1-4 stops sits centred at a 32px gap (less where a phone is too narrow), so a short run never stretches its boxes across the card; from 5 stops one row spreads edge to edge (the user, 2026-11-25).
const dlMapOf = (n) => (el) => { const w = el.clientWidth; const per = Math.max(1, Math.floor((w + DL_MAP_GAP) / (DL_MAP_COL + DL_MAP_GAP)));
  const rows = Math.ceil(n / per); const cols = Math.ceil(n / rows);
  const room = (w - cols * DL_MAP_COL) / Math.max(1, cols - 1); const gap = cols < 2 ? DL_MAP_GAP : n <= DL_MAP_FEW ? Math.max(DL_MAP_GAP, Math.min(DL_MAP_GAP_FEW, room)) : rows === 1 ? Math.max(DL_MAP_GAP, room) : Math.min(DL_MAP_GAP_MAX, Math.max(DL_MAP_GAP, room));
  return cols + ':' + gap.toFixed(1); };
const useDlMap = (n) => { const ref = React.useRef(null); const measure = React.useMemo(() => dlMapOf(n), [n]); const v = useDlWidth(ref, measure, n + ':6'); const [cols, gap] = v.split(':').map(Number); return [ref, cols, gap]; };
// What a stop shows on the map: its key moments as small dice, every other roll as a dot in its outcome's colour, a use as a grey dot, the loss cross as itself.
export const DlMapMarks = ({ m, st }) => (st.turns.length ? <span className="dvG-marks">{st.turns.map((r) => (r.lost ? <DlDie key={r.t} r={r} size={20} />
  : m.mom[r.t] ? <DlDie key={r.t} r={r} size={20} foe={false} /> : <i key={r.t} className={'dl-now-mark is-' + (r.use ? 'use' : r.tier || 'miss')} />))}</span> : null);
export const DlMap = ({ m, stops, open, onOpen, far }) => { const [ref, cols, gap] = useDlMap(stops.length);
  return (<div className="dvG-mapw"><div ref={ref} className={'dvG-map' + (stops.length <= DL_MAP_FEW ? ' is-few' : '')} style={{ '--cols': cols, '--gap': gap + 'px' }} aria-label="The way you went">{stops.map((st, i) => {
    const has = st.turns && st.turns.some((r) => !r.lost); const label = (st.back ? 'Back to ' : 'Room ' + st.num + ', ') + st.name;
    const box = <span className={dlNum(st)}>{st.back && <DlBackArrow />}{st.num}</span>;
    const cls = 'dvG-stop' + (i % cols === 0 ? ' is-rs' : '') + (i % cols === cols - 1 || i === stops.length - 1 ? ' is-re' : '') + (open === st.i ? ' is-on' : '') + (far && far(st) ? ' is-far' : '');
    return has ? <button key={st.i} type="button" className={cls} title={st.name} aria-label={label} aria-pressed={open === st.i} onClick={() => onOpen(st)}>{box}<DlMapMarks m={m} st={st} /></button>
      : <span key={st.i} className={cls} title={st.name} role="img" aria-label={label + (st.turns && st.turns.length ? '' : ', no rolls')}>{box}{m && <DlMapMarks m={m} st={st} />}</span>; })}</div></div>); };
// KEEP: from a board (the card's content) 700px wide the open room and the held roll share one row: the room's number, name and dice on the left, the held roll on the right edge at two thirds of the row; the space between them is allowed (the user, 2026-11-25). Below 700px the held roll sits under the room's dice.
const DlOpenRoom = ({ m, st, act, lit, on }) => (<div className="dvG-open">
  <div className="dvG-room">
    <p className="dvG-th"><span className={dlNum(st, ' is-on')} aria-hidden="true">{st.back && <DlBackArrow />}{st.num}</span><span className="dvG-name">{st.back ? 'Back to ' + st.name : st.name}</span></p>
    {/* KEEP: in the open room a key moment's die is drawn bigger (44px) than any other roll's (30px), as everywhere a key moment stands among other rolls (the user, 2026-11-25: "all big moments are big throughout relationally"); pressing a die only rings it, never resizes it. */}
    <div className="dvG-dice">{st.turns.map((r) => <DlDieBtn key={r.t} r={r} act={act} lit={lit} on={on} size={m.mom[r.t] ? 44 : 30} />)}</div>
  </div>
  {act && m.turns[act - 1].stop === st.i ? <div className="dvG-held"><DlHeld m={m} act={act} /></div> : null}
</div>);
const DlGlance = ({ m, act, setSel }) => {
  const [open, setOpen] = React.useState(() => (act ? m.turns[act - 1].stop : m.stops.length - 1));
  // KEEP: a mouse over a die rings it as the open room's selected die is ringed (its foe and second hexes cleared), but the held roll stays the pressed one's; touch gives no hover, so a tap never leaves a ring behind.
  const [lit, setLit] = React.useState(null);
  const on = React.useMemo(() => ({ sel: setSel, hov: (t) => { if (t == null || window.matchMedia('(hover: hover)').matches) setLit(t); } }), [setSel]);
  // A room tapped on the map opens, and holds its first key moment, else its last roll.
  const onOpen = (st) => { setOpen(st.i); const ok = st.turns.filter((r) => !r.lost); const k = ok.find((r) => m.mom[r.t]) || ok[ok.length - 1]; if (k) setSel(k.t); };
  const st = m.stops.find((x) => x.i === open) || m.stops[m.stops.length - 1];
  return (<div className="dvG"><DlMap m={m} stops={m.stops} open={st.i} onOpen={onOpen} /><DlOpenRoom m={m} st={st} act={act} lit={lit} on={on} /></div>); };
// What a width-reading hook reads is the element's own size, taken before paint and on every resize: `measure(el)` returns the value, and must keep its identity between renders.
export const useDlWidth = (ref, measure, initial) => { const [value, setValue] = React.useState(initial);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return undefined;
    const read = () => setValue(measure(el)); read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, [ref, measure]);
  return value; };
// ---- Before the first roll: the run's rooms drawn empty. A room is its number over an empty hex where its dice will go. ----
const dlEmptyStops = (n) => Array.from({ length: n }, (_, i) => ({ i, num: i + 1, back: false, name: 'Room ' + (i + 1) }));
// The session page before the first roll: the run's rooms drawn empty on the map, the first reached, and nothing else: no open room and no held roll until there is a roll.
const DlEmptyMap = ({ rooms }) => (<div className="dvG"><DlMap stops={dlEmptyStops(rooms).map((st) => ({ ...st, name: st.i === 0 ? 'First room' : 'Not reached', turns: [] }))} open={0} far={(st) => st.i > 0} /></div>);
// KEEP: a run that ends on the loss cross opens nothing: the cross is not pressable and no roll is held until one is pressed. A press holds a roll and fills the held roll; it opens on the roll the route names (a die pressed on the now card), else the
// last roll. A hover only rings a die and never fills the held roll: a held roll
// that follows the pointer changes the box's height, moves the map and the die from under the pointer, and the map flickers.
export const DlCard = ({ s, m, roll, turn, beside, summary }) => {
  const rooms = m.turns.length ? m.stops.length : (s.tracks && s.tracks.rooms) || 5;
  const [sel, setSel] = React.useState(() => (turn && m.turns[turn - 1] ? turn : roll && m.rolls[roll - 1] ? m.rolls[roll - 1].t : m.turns.length && !m.lost ? m.turns.length : null)); const act = sel;
  if (!m.turns.length) {
    return (<section className="dv2 dv7r is-3" aria-label="How the run went"><DlResult s={s} m={m} extra={beside} />{summary}<DlEmptyMap rooms={rooms} /></section>); }
  return (<section className="dv2 dv7r is-3" aria-label="How the run went"><DlResult s={s} m={m} extra={beside} />{summary}
    <DlGlance m={m} act={act} setSel={setSel} /></section>);
};

// ---- The character sheet, read from the hero's sheet and the record's lines: gear taken, used, or a key that opened its lock. ----
const DL_STATE = { worn: 'Worn', held: 'Held', used: 'Used' };
const STAT_ORDER = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
export const dlSheet = (s, m) => {
  const h = DL_HEROES[s.hero] || DL_HEROES['Wren the Rogue']; const sh = s.sheet || {}; const used = sh.used || {};
  const gear = h.gear.map((g) => ({ ...g, state: g.kind === 'armour' ? 'worn' : 'held' }));
  const find = (name) => { const n = dlCap(name.replace(/^(a|an|the)\s+/i, '')); let g = gear.find((x) => x.name === n);
    if (!g) { g = { name: n, kind: /key/i.test(n) ? 'key' : 'once', does: DL_GEAR_DOES[n] || '', state: 'held' }; gear.push(g); } return g; };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Gear') { const t = String(l[1]); if (/^Took /.test(t)) find(t.replace(/^Took /, '')); else if (/^Used /.test(t)) find(t.replace(/^Used /, '')).state = 'used'; }
    // KEEP: a key opens its lock and is kept (delve.md, Gear), so it stays in the pack, noted with the lock it opened.
    // KEEP: this item branch is for a gear weakness such as edition 1's lamp oil; a prepared-feature weakness (other editions) is not gear and must not be added to the pack.
    if (l[0] === 'Weakness') { const g = find(String(l[1])); if (g.kind !== 'key') g.state = 'used'; }
    if (l[0] === 'Lock') { const w = /^Opened (.+) with (.+)$/.exec(String(l[1])); if (w) find(w[2]).note = 'Opened ' + w[1]; }
  });
  gear.forEach((g) => { g.label = g.note || DL_STATE[g.state]; });
  return { name: h.name, cls: h.cls, hp: m.hp, hpMax: s.hpMax, threat: s.threat, threatMax: s.threatMax, lightName: s.lightName, light: s.light, lightMax: s.lightMax, carry: DL_CARRY, gear,
    abilities: h.abilities.map((a) => ({ ...a, left: Math.max(0, a.of - (used[a.name] || 0)) })), insp: !!sh.insp,
    fight: h.fight || null, adv: { streak: m.run, longest: m.longest },
    // KEEP: a trained skill's total is its stat's bonus plus the +2 training adds; only trained skills are listed (4 to 7), in the stats' order.
    skills: STAT_ORDER.flatMap((st) => (h.skills || []).filter((k) => k[1] === st).map((k) => ({ name: k[0], say: dlSigned(h.stats[st] + 2) + Math.abs(h.stats[st] + 2) }))), stats: Object.entries(h.stats).map(([k, n]) => ({ k, ab: k.slice(0, 3).toUpperCase(), say: (n < 0 ? '−' : '+') + Math.abs(n) })) };
};
// Glyphs, line-drawn as the shop's icons (1.75 stroke, square caps, mitred joins). Armour has its own: a shield.
const DL_G = { armour: 'M5 4h14v8l-7 8-7-8z', once: 'M9 3h6M10 3v6l-5 11h14l-5-11V3', key: 'M3 9h7v6H3zM10 12h11M17 12v4M20 12v3' };
const DlBox = ({ k, state }) => (<span className={'dv4-g' + (state === 'used' ? ' is-used' : '') + (!k ? ' is-empty' : '')}>{k && <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={DL_G[k]} /></svg>}</span>);
const DlUses = ({ left, of }) => (<span className="dv4-uses" role="img" aria-label={left + ' of ' + of + ' left'}>{Array.from({ length: of }, (_, i) => <i key={i} className={i < left ? 'is-on' : ''} />)}</span>);
// Inspiration: a hex like the die's, rimmed as a natural 20 is, since a natural 20 gives it back; empty once spent.
export const DlInsp = ({ on }) => (<span className="dv5-insw" role="img" aria-label={'Inspiration, ' + (on ? 'ready' : 'spent')}><svg className={'dv4-insp' + (on ? ' is-on' : '')} viewBox="-5 -5 46 50" width="28" height="30" aria-hidden="true">
  <polygon className="hx" points={DL_HEX} />{on && <polygon className="rim" points={DL_RIM} />}</svg></span>);
const DlHex = ({ x }) => (<svg className="dv4-sx" viewBox="-5 -5 46 50" width="32" height="35" role="img" aria-label={x.say}><polygon className="hx" points={DL_HEX} /><text x="18" y="20.5">{x.say}</text></svg>);
// KEEP: every piece below a group's heading is one cell (a fixed-height figure, one label under it), so the rows line up.
export const DlCell = ({ label, used, title, children }) => (<div className={'dv7-cell' + (used ? ' is-used' : '')} title={title}><span className="dv7-fig">{children}</span><span className="dv7-lb">{label}</span></div>);
// KEEP: a meter's count is written 9/13, the short form, so the meters' column stays narrow (owner, 2026-10-29).
const DlMeter = ({ label, n, of }) => (<div className="dv6-bar"><span>{label}</span><DS.ProgressBar label={label} value={n} max={of} showValue={false} /><small>{n + '/' + of}</small></div>);

// 3B (owner, 2026-10-29): the hero; hit points, threat and, where the edition has the light module, its light stacked on one grid; then five tabs: Stats, Advantage, Pack (with its free slots), Ability and Fight. Clues and the bargain join once the record holds them.
// The sheet's tabs are Escape's tap cards (esx-cards, EsxFold); a tab adds only its icon.
// KEEP: the layout is chosen by the sheet's own content width, never the window, with four steps: one row of name, bars and five tabs from 796px; from 610px the name and bars side by side with the five tabs full width under them; from 340.02px the name line over the bars over the five tabs; at 340px and under the tabs become a list, icon beside word. A step's tabs are as wide as their share of the row, at most 140px, and their words step from 10px to 8px as the sheet narrows.
// KEEP: every two-row layout opens folded to the name and bars; the whole header is the fold, its chevron centred on it. The one-row layout has no fold.
// KEEP: the sheet card has no padding of its own: each part carries the 16px side gutter, so the header's hover tint runs edge to edge of the card. The layout steps are still measured on the card's width less that gutter, 796px and the rest.
const DL_GUTTER = 16;
const DL_ONE_ROW = 796;
// Whether the sheet is wide enough for one row, read as the CSS container reads it, before paint and on every resize.
const dlOneRowOf = (el) => { const cs = getComputedStyle(el); const edge = ['borderLeftWidth', 'borderRightWidth'].reduce((n, k) => n + parseFloat(cs[k]), 0); return el.getBoundingClientRect().width - edge - 2 * DL_GUTTER >= DL_ONE_ROW; };
const useDlOneRow = (ref) => useDlWidth(ref, dlOneRowOf, false);
const DlStatCells = ({ c }) => c.stats.map((x) => <DlCell key={x.k} label={x.ab} title={x.k}><DlHex x={x} /></DlCell>);
// Advantage opens three cells: Inspiration, then the streak and the run's longest streak as numbers (the count the game's chat shows as "Streak N": successes or hits in a row, fights included). Both stay as the run left them, and 0 shows as 0.
const DlAdvCells = ({ c }) => (<><DlCell label="Inspiration" used={!c.insp} title={c.insp ? 'Ready' : 'Spent'}><DlInsp on={c.insp} /></DlCell>
  <DlCell label="Streak" title="Successes or hits in a row."><span className="dv8-num">{c.adv.streak}</span></DlCell>
  <DlCell label="Longest streak" title="The longest streak of the run."><span className="dv8-num">{c.adv.longest}</span></DlCell></>);
// Two pips, for the advantage playground only; the sheet shows the streak as a number.
export const DlPips = ({ n, lit, name }) => (<span className={'dv9-pips' + (lit ? ' is-lit' : '')} role="img" aria-label={name + ', ' + Math.min(n, 2) + ' of 2'}>{[0, 1].map((i) => <i key={i} className={i < n ? 'is-on' : ''} />)}</span>);
// The trained skills under the stats: equal chips, name left and total right. How many sit on a row is read from the chips' container (see the KEEP in gs-delve.css); the chip's width follows from it.
const DL_CHIP_MIN = 100; const DL_CHIP_GAP = 8;
const dlSkillsPerRow = (n) => (el) => { const most = Math.max(1, Math.min(n, Math.floor((el.clientWidth + DL_CHIP_GAP) / (DL_CHIP_MIN + DL_CHIP_GAP)))); return Math.ceil(n / Math.ceil(n / most)); };
const DlSkills = ({ c }) => { const n = c.skills.length; const ref = React.useRef(null); const per = useDlWidth(ref, React.useMemo(() => dlSkillsPerRow(n), [n]), n);
  return (<><div className="dv9-rule" /><div ref={ref} className="dv9-skills" style={{ '--per': per, '--gap': DL_CHIP_GAP + 'px' }}>{c.skills.map((k) => <div key={k.name} className="dv9-sk"><span className="dv9-nm">{k.name}</span><span className="dv9-tot">{k.say}</span></div>)}</div></>); };
// The light's label is its module's own name as written with the first letter capitalised, "the torch" → "The torch". Only a run whose edition has the light module carries `lightName`. How the labels lay out is the KEEP in gs-delve.css: they sit above their bars at every width, one line, never wrapping. The editions' name cap (≈20 characters) is a ticket item.
const dlLightLabel = (name) => name.charAt(0).toUpperCase() + name.slice(1);
const DlMeters = ({ c }) => <div className="dv7-grp dv8-meters"><div className="dv8-mgrid"><DlMeter label="Hit points" n={c.hp} of={c.hpMax} /><DlMeter label="Threat" n={c.threat} of={c.threatMax} />
  {c.lightName && <DlMeter label={dlLightLabel(c.lightName)} n={c.light} of={c.lightMax} />}</div></div>;
// The fight facts: a number in a cell, as Streak is. A named thing says what it is under its name.
const dlFight = (c) => { const f = c.fight; if (!f) return [];
  // KEEP: the game's armour class is the hero class's own plus what carried armour gear adds (monorepo campaign-game.ts heroAc; the sheet sends the total as `ac` and the gear's share as `acGear`, delve-sheet.ts). `defence` is that total, the same number as the struck-back target in the record's lines, so the parts are the class's own (the total less the armour's share) and the armour by name with its +.
  return [{ key: 'ac', label: 'Armour class', num: f.defence, text: c.cls + ' ' + (f.defence - f.armour) + ', ' + f.armourName + ' +' + f.armour },
    { key: 'heavy', label: f.heavy.name, kind: 'Heavy attack', num: f.heavy.needs, text: 'Needs ' + f.heavy.needs + ' to hit, ' + f.heavy.dmg + ' damage' }]; };
const DlLabel = ({ name, kind }) => (kind ? <>{name}<small className="dv8-sub">{kind}</small></> : name);
const dlSlots = (c) => Array.from({ length: Math.max(c.carry, c.gear.filter((g) => g.state !== 'used').length) }, (_, i) => c.gear[i] || null);

// The tabs and what each opens: Stats and Advantage open the sheet's own cells, Pack, Ability and Fight open rows.
const dlTabGroups = (c, slots) => {
  const carried = c.gear.filter((g) => g.state !== 'used').length; const free = slots.length - carried; const left = c.abilities.reduce((n, a) => n + a.left, 0); const of = c.abilities.reduce((n, a) => n + a.of, 0);
  return [
    { key: 'stats', head: 'Stats', icon: 'stats', cells: <DlStatCells c={c} />, after: <DlSkills c={c} />, cls: 'dv8-stats' },
    { key: 'advantage', head: 'Advantage', icon: 'advantage', cells: c.advCells || <DlAdvCells c={c} />, cls: 'dv8-adv' },
    { key: 'pack', head: 'Pack', icon: 'pack', say: carried + ' of ' + slots.length + ' carried',
      rows: [...c.gear.map((g) => ({ key: g.name, fig: <DlBox k={g.kind} state={g.state} />, name: g.name, tag: g.label, text: g.does })),
        ...(free > 0 ? [{ key: 'free', fig: <DlBox k={null} />, name: 'Free', text: 'Room for ' + (free === 1 ? 'one more' : free + ' more') + '.' }] : [])] },
    { key: 'abilities', head: 'Ability', icon: 'ability', say: left + ' of ' + of + ' uses left',
      rows: c.abilities.map((a) => ({ key: a.name, fig: <DlUses left={a.left} of={a.of} />, name: a.name, tag: a.ult ? 'Ultimate' : null, text: a.does })) },
    ...(c.fight ? [{ key: 'fight', head: 'Fight', icon: 'fight', say: 'armour class ' + c.fight.defence,
      rows: dlFight(c).map((f) => ({ key: f.key, fig: <span className="dv8-num">{f.num}</span>, name: f.label, tag: f.kind || f.tip, text: f.text })) }] : []),
  ];
};
const DlTapRow = ({ fig, name, tag, text }) => (<div className="dvp-row"><span className="dvp-fig">{fig}</span>
  <div className="dvp-tx"><p className="dvp-nm"><b>{name}</b>{tag && <span>{tag}</span>}</p>{text && <p className="dvp-does">{text}</p>}</div></div>);
// One tab: its icon centred above its word, no figure. Nothing is open at first; a second tap on the open tab shuts it.
const DlTabs = ({ groups, card, setCard }) => (<div className="esx-cards dl-tabs" style={{ '--dl-tabs': groups.length }}>{groups.map((g) => (
  <button key={g.key} type="button" className={'esx-card dl-tab' + (card === g.key ? ' is-open' : '')} aria-expanded={card === g.key} aria-label={g.say ? g.head + ', ' + g.say : g.head} onClick={() => setCard(card === g.key ? null : g.key)}>
    <DS.Icon name={g.icon} size={24} /><span className="dl-tab-w">{g.head}</span>
  </button>))}</div>);
// The open tab's contents under the row: rows for Pack, Ability and Fight, the sheet's own cells for Stats and Advantage.
const DlPanel = ({ groups, card }) => { const grp = groups.find((g) => g.key === card);
  return (<EsxFold open={!!grp}>{grp && (grp.rows
    ? <div key={grp.key} className="dvp-rows dl-panel esx-in" role="group" aria-label={grp.head}>{grp.rows.map((r) => <DlTapRow key={r.key} {...r} />)}</div>
    : <div key={grp.key} className={'dl-panel dl-cellpanel esx-in ' + grp.cls} role="group" aria-label={grp.head}><div className="dv7-cells">{grp.cells}</div>{grp.after}</div>)}</EsxFold>); };
// The header: the name, then the bars. Below one row it is the fold: the chevron's button is stretched over the whole header, so a tap anywhere on it folds the tabs, while the bars stay readable to a screen reader. One row hides the button in CSS, so the header never waits on a render to change layout.
const DlHead = ({ c, folded, fold }) => (<div className="dl-head is-fold">
  <div className="dv7-grp is-hero"><p className="dv7-hero"><b>{c.name}</b><span>{c.cls}</span></p></div>
  <DlMeters c={c} />
  <button type="button" className="dl-fold" aria-expanded={!folded} aria-controls="dl-sheet-tabs" aria-label="Character sheet details" onClick={fold}><DS.Icon name="next" size={20} /></button>
</div>);
export const DlSheet = ({ c, openTab }) => { const ref = React.useRef(null); const one = useDlOneRow(ref); const [card, setCard] = React.useState(openTab || null); const [folded, setFolded] = React.useState(!openTab);
  const [seen, setSeen] = React.useState(one); const [tap, setTap] = React.useState(null);
  const groups = dlTabGroups(c, dlSlots(c));
  // KEEP: the sheet is the same sheet in either layout: switching between one row and two (a resize, a tablet turned) keeps the open tab and keeps the sheet unfolded if it was; a tab that is open always leaves the two-row sheet unfolded, since one row has no fold to carry that. No motion on the switch.
  if (seen !== one) { setSeen(one); if (card !== null) setFolded(false); setTap(null); }
  // KEEP: the fold and the tabs animate only for a tap: `is-tap` is on the sheet from the tap until the motion is over, and CSS gives every fold a transition only then, so a window resize across a breakpoint changes the layout without any motion.
  React.useEffect(() => { if (!tap) return undefined; const t = setTimeout(() => setTap(null), 600); return () => clearTimeout(t); }, [tap]);
  const fold = () => { setTap({}); setFolded(!folded); setCard(null); };
  const pick = (k) => { setTap({}); setCard(k); };
  return (<section ref={ref} className={'dv4 dv5 is-tight dv7 is-band dv8 is-3b' + (tap ? ' is-tap' : '') + (folded ? '' : ' is-unfolded')} aria-label="Character sheet">
    <div className="dv8-rows"><div className="dv7-band">
      <div className="dv8-r1">
        <DlHead c={c} folded={folded} fold={fold} />
        <div id="dl-sheet-tabs" className="dl-tabwrap"><div className={'esx-fold' + (folded ? '' : ' is-open')}><div><div className="dv7-grp dl-tabgrp"><DlTabs groups={groups} card={card} setCard={pick} /></div></div></div></div>
      </div>
      <DlPanel groups={groups} card={card} />
    </div></div></section>);
};

// ---- The session page's own part, under the shared head. Every move is the store's plain list, collapsed. ----
const DlBody = ({ s }) => {
  const gs = useGs();
  const m = React.useMemo(() => dlBuild(s), [s]); const c = React.useMemo(() => dlSheet(s, m), [s, m]);
  return <>
    <div className="dv4-lay"><DlSheet c={c} /><DlCard s={s} m={m} roll={gs.route && gs.route.roll} turn={gs.route && gs.route.turn} /></div>
    <GsMoves s={s} />
  </>;
};

// ---- The now card on Delve's library game page, once this week's run is played or started: the shared frame (LbNowCard), with the
// session page's ending word as its result and the run's latest stops over its key moments in place of the line and bar. No sheet, no held roll. Nothing in the picture is pressable: the card opens the session page.
// KEEP: a stop is drawn as the session page's map draws it (a 28px number box, a return keeping its back-arrow) and is never shrunk or wrapped; the row shows the latest stops that fit at the session map's pitch (a 44px column and a 6px gap), up to 12, so a phone card shows fewer.
// KEEP: from 5 stops the boxes spread edge to edge on the card's content width; fewer sit centred at a 56px gap, wider than the session map's 32px (the user, 2026-11-26: "on 2-4 can we have a slighter greater spread?"), and never wider than the card.
// KEEP: the key dice are the session page's 44px, up to four, centred on the card, the latest first, each named beneath; a run with no key moment draws no dice row, so the card keeps no gap where it would stand.
// A run with no stop draws the run's rooms empty (five unless the run says otherwise), the first reached, as the session page does before the first roll.
// A run not started has no stop, roll or key moment.
const DL_NOW_NONE = { stops: [], turns: [], mom: {} };
const DL_NOW_MAX = 12; const DL_NOW_GAP_FEW = 56;
// The roll that ended an overrun run is named "Latest roll" under its die, first among its names, whatever the held roll's title says.
const dlNowNames = (kickers) => { const k = kickers.map((x) => (x === 'Last roll' ? 'Latest roll' : x)); return [...k.filter((x) => x === 'Latest roll'), ...k.filter((x) => x !== 'Latest roll')]; };
const dlNowFit = (el) => Math.max(1, Math.floor((el.clientWidth + DL_MAP_INSET * 2 + DL_MAP_GAP) / (DL_MAP_COL + DL_MAP_GAP)));
const DlNowPic = ({ m, rooms = 5 }) => {
  const ref = React.useRef(null); const fit = useDlWidth(ref, dlNowFit, DL_NOW_MAX);
  const empty = !m.stops.length;
  const shown = empty ? dlEmptyStops(rooms).slice(0, fit) : m.stops.slice(-Math.min(DL_NOW_MAX, fit));
  const keys = m.turns.filter((r) => m.mom[r.t] && !r.lost).reverse().slice(0, 4);
  const few = shown.length <= DL_MAP_FEW;
  return (<div ref={ref} className="dl-now-pic" role="group" aria-label="The way you went">
    <div className={'dl-now-stops' + (few ? ' is-few' : '')} style={{ '--n': shown.length, '--few': DL_NOW_GAP_FEW + 'px' }} role="img" aria-label={empty ? 'The run has ' + rooms + ' rooms, the first reached, no rolls yet' : 'The last ' + shown.length + ' stops'}>
      {shown.map((st, i) => <span key={st.i} className={dlNum(st, empty ? (i === 0 ? ' is-on' : ' is-far') : '')}>{st.back && <DlBackArrow />}{st.num}</span>)}</div>
    {keys.length > 0 && <div className="dl-now-keys">{keys.map((r) => (
      <span key={r.t} className="dl-now-key"><DlDie r={r} size={44} /><span className="dl-now-name">{dlNowNames(m.mom[r.t].kickers).map((k) => <span key={k}>{k}</span>)}</span></span>))}</div>}
  </div>);
};
// The Now card of a run not started: the week's title (label: a free first run passes its own), the run's rooms empty, Play, the next run. No line and no tag: the empty rooms say it (user, 2026-11-08, "looks fine").
// laterWeek: the free player's card once a later week is current: no Play, and the Pass sentence (passText) in the slot.
export const DlNowEmpty = ({ label, title, rooms, next, onPlay, laterWeek }) => (
  <LbNowCard gid="delve" className="dl-now" label={label} title={title} play={onPlay} next={next}
    {...(laterWeek ? { bare: true, pass: 'nostop', passText: 'Play it with the Pass.' } : {})}>
    <div className="dl-now-route"><DlNowPic m={DL_NOW_NONE} rooms={rooms} /></div>
  </LbNowCard>);
export const DlNow = ({ s: wk, label, sids = ['delve', 'delve-live'], next = 'Next run: ' + DV_NEXT, pass }) => {
  const gs = useGs(); const sid = wk.end ? gsEdPick('delve', gs) || sids[0] : gsLiveSid(sids[1], gs); const s = GS_SESSIONS[sid]; const m = React.useMemo(() => dlBuild(s), [s]);
  const open = (turn) => gs.go('session', turn ? { id: sid, turn } : { id: sid });
  const result = m.end === 'live' ? { kind: 'live', label: 'In progress' } : { kind: m.end === 'won' ? 'ok' : 'bad', label: dlWord(m) };
  return (
    <LbNowCard gid="delve" className="dl-now" label={label} title={wk.title} result={result} open={() => open()} next={next} pass={pass}>
      <div className="dl-now-route"><DlNowPic m={m} rooms={(s.tracks && s.tracks.rooms) || 5} /></div>
    </LbNowCard>
  );
};

// ---- Hooks into the app: the session page's body and quiet head (app/gs-session.jsx). The head names the run's setting. ----
export const registerDelve = () => {
  GS_SESSION_BODY.delve = (p) => <DlBody key={p.sid} {...p} />;
  GS_SESSION_QUIET.delve = (s, ed) => ({ label: s.game, h1: (ed && ed.title) || s.setting || s.game });
};

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsDelve() {
// ---- Sample plays beside the seeded ones, staged by States: a run that fell, and the hard play built to delve.md's limits
// (every room, going back seven times, twelve stops in all, a natural 1 and 20, two-dice rolls, a lock forced on the third try, ended overrun). ----
// A replay of the won run: the same play, marked so the shared session head carries the Replay tag.
GS_SESSIONS['delve-replay'] = { ...GS_SESSIONS.delve, replay: true };
GS_SESSIONS['delve-fallen'] = { ...GS_SESSIONS.delve, loss: true, end: 'fallen', result: 'Fell in the warren', reached: 'Fell in the warren', share: 'Fell in the warren', shareLines: null, threat: 6, light: 4,
  figures: ['Threat 6/12', '8 rolls', 'HP 0/23'], tracks: { progress: 3, rooms: 5, threat: 6, threatMax: 12 }, sheet: { used: {}, insp: false }, lines: [
  ['Wisdom', 'Search the lock-keeper\'s niche', 'Partial success', 'd20 14 + 0 = 14 vs 12', 'HP 21/23'], ['Room', 'Entered the chime run'],
  ['Strength', 'Failure', 'd20 3 + 3 = 6 vs 12', 'HP 19/23'], ['Strength', 'Success', 'd20 17 + 3 = 20 vs 12'], ['Dexterity', 'Gather up the fallen bones', 'Partial success', 'd20 13 + 1 = 14 vs 12', 'HP 17/23'],
  ['Room', 'Entered the warren'], ['Turn', 'The turncoat joins', GS_DV_TURNCOAT],
  ['Strength', 'Miss', 'd20 3 + 3 = 6 vs 12', 'Struck back: d20 17 vs 10, hit, 4 damage, HP 13/23'], ['Strength', 'Miss', 'd20 8 + 3 = 11 vs 12', 'Struck back: d20 15 vs 10, hit, 6 damage, HP 7/23'], ['Strength', 'Miss', 'Natural 1', 'd20 1 + 3 = 4 vs 12', 'Struck back: d20 16 vs 10, hit, 6 damage, HP 1/23'],
  ['Strength', 'Miss', 'd20 6 + 3 = 9 vs 12', 'Struck back: d20 12 vs 10, hit, 6 damage, HP 0/23']] };
// The won play whose last turn is a use: the average run's play to the shrine cavern, then the lamp oil, a hit, and Bryn's ultimate (one use a run, kept for last) taking Grizzletooth's last health.
// Its sheet marks the ultimate used. Picked by its states only: it is no Config → This edition option.
// A run of Cold Sleep (edition 2) lost to the medbay's story turn: the crank panel deals 4 damage and the hero has 4 hit points. Its last room, the medbay, ends on the loss cross (`lostOff`).
// SAMPLE: the room order (cryo deck, armoury, medbay) and every roll; the record keeps no turn for the story harm, so the cross is no turn. HP 21 -> 17 -> 11 -> 4, then 4 damage -> 0.
// A first run lost on its first room's story turn, with no roll or use anywhere: the route is that one room, ending on the loss cross.
// SAMPLE: the room and the harm; the record keeps no turn for the story harm.
GS_SESSIONS['delve-lost-no-roll'] = { ...GS_SESSIONS.delve, loss: true, end: 'fallen', lostOff: { name: 'Collapsing tunnel', harm: 23 }, result: 'Fell in the warren', reached: 'Fell in the warren', share: 'Fell in the warren', shareLines: null,
  figures: ['Threat 0/12', '0 rolls', 'HP 0/23'], tracks: { progress: 1, rooms: 5, threat: 0, threatMax: 12 }, threat: 0, sheet: { used: {}, insp: true }, lines: [['Room', 'Entered the warren']] };
GS_SESSIONS['delve-story-fall'] = { ...GS_SESSIONS.delve, loss: true, end: 'fallen', lostOff: { name: 'Crank panel', harm: 4 }, setting: 'Cold Sleep', hero: 'Wren the Rogue', hpMax: 21, threat: 2, threatMax: 12, lightName: null, light: 0, lightMax: 0, foeMax: {},
  result: 'Fell in the medbay', reached: 'Fell in the medbay', share: 'Fell in the medbay', shareLines: null, figures: ['Threat 2/12', '5 rolls', 'HP 0/21'], tracks: { progress: 3, rooms: 6, threat: 2, threatMax: 12 }, sheet: { used: {}, insp: false }, lines: [
  ['Room', 'Entered the cryo deck'], ['Intelligence', 'Read the wake log', 'Success', 'd20 15 + 0 = 15 vs 12'], ['Dexterity', 'Slip the frozen vent', 'Failure', 'd20 5 + 3 = 8 vs 12', 'HP 17/21'],
  ['Room', 'Entered the armoury'], ['Strength', 'Pry the locker', 'Failure', 'd20 7 + 0 = 7 vs 12', 'HP 11/21'], ['Wisdom', 'Listen for the hunt', 'Partial success', 'd20 11 + 1 = 12 vs 12'], ['Dexterity', 'Force the cage', 'Failure', 'd20 4 + 3 = 7 vs 12', 'HP 4/21'],
  ['Room', 'Entered the medbay']] };
GS_SESSIONS['delve-won-by-use'] = (() => { const base = GS_SESSIONS.delve.lines; const cut = base.findIndex((l) => l[0] === 'Ability');
  return { ...GS_SESSIONS.delve, lines: [...base.slice(0, cut), ['Weakness', 'A flask of lamp oil', 'Grizzletooth: health 4 → 2'], ['Strength', 'Hit', 'd20s 17 and 9, kept 17 + 3 = 20 vs 12', 'Struck back: d20 8 vs 10, missed'], ['Ability', 'Used shield bash', 'Grizzletooth: health 1 → 0']] }; })();
GS_SESSIONS['delve-hard'] = { ...GS_SESSIONS.delve, loss: true, end: 'overrun', result: 'Too late: the ritual was completed', reached: 'Too late: the ritual was completed', share: 'Too late: the ritual was completed', shareLines: null,
  hero: 'Wren the Rogue', hpMax: 21, threat: 12, foeMax: { 'the shrine cavern': 6 },
  // The longest deployed foe name (Delve 9), on the shrine cavern's foe, so the held roll's foe row is seen with a name that wraps.
  foeName: { 'the shrine cavern': 'Mortlake, the drowned captain' },
  // The light is The Midas Vault's (content/delve/7.v2.json), borrowed so the sheet carries the longest light name an edition has.
  lightName: 'the watchman\'s round', light: 0, lightMax: 9,
  figures: ['Threat 12/12', '36 rolls', '1 natural 20', 'HP 12/21'], tracks: { progress: 20, rooms: 13, threat: 12, threatMax: 12 }, sheet: { used: {}, insp: false }, lines: [
  ['Wisdom', 'Search the lock-keeper\'s niche', 'Failure', 'Natural 1', 'd20 1 + 0 = 1 vs 12', 'HP 19/21'], ['Room', 'Entered the chime run'],
  ['Dexterity', 'Partial success', 'd20 8 + 3 = 11 vs 12', 'HP 17/21'], ['Dexterity', 'Success', 'd20 16 + 3 = 19 vs 12'], ['Dexterity', 'Gather up the fallen bones', 'Partial success', 'd20 9 + 3 = 12 vs 12'],
  ['Room', 'Entered the warren'], ['Turn', 'The turncoat joins', GS_DV_TURNCOAT],
  ['Dexterity', 'Hit', 'd20 14 + 3 = 17 vs 12', 'Struck back: d20 6 vs 14, missed'], ['Dexterity', 'Hit', 'd20s 6 and 15, kept 15 + 3 = 18 vs 12', 'Struck back: d20 11 vs 14, missed'], ['Dexterity', 'Miss', 'd20s 4 and 2, kept 4 + 3 = 7 vs 12', 'Struck back: d20 15 vs 14, hit, 1 damage, HP 16/21'],
  ['Dexterity', 'Miss', 'd20 8 + 3 = 11 vs 12', 'Struck back: d20 4 vs 14, missed'], ['Dexterity', 'Hit', 'd20 15 + 3 = 18 vs 12'],
  ['Room', 'Doubled back to the chime run', 'The ritual +1'], ['Intelligence', 'Read the chime wires', 'Partial success', 'd20 13 + 1 = 14 vs 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'], ['Room', 'Entered Snaggle\'s den'],
  ['Dexterity', 'Hit', 'd20 10 + 3 = 13 vs 12', 'Struck back: d20 13 vs 14, missed'], ['Dexterity', 'Heavy attack: Flurry', 'Hit', 'Natural 20', 'd20 20 + 5 = 25 vs 12', 'Struck back: d20 8 vs 14, missed'], ['Dexterity', 'Hit', 'd20s 12 and 3, kept 12 + 3 = 15 vs 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'],
  ['Room', 'Doubled back to Snaggle\'s den', 'The ritual +1'], ['Wisdom', 'Listen at the den door', 'Partial success', 'd20 13 + 1 = 14 vs 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'],
  ['Strength', 'Force the bone gate', 'Partial success', 'd20 9 + 0 = 9 vs 12'], ['Strength', 'Force the bone gate', 'Partial success', 'd20 11 + 0 = 11 vs 12'], ['Strength', 'Force the bone gate', 'Partial success', 'd20 14 + 0 = 14 vs 12'],
  ['Room', 'Doubled back to the chime run', 'The ritual +1'], ['Dexterity', 'Slip past the chime wires', 'Success', 'd20 15 + 3 = 18 vs 12'],
  ['Room', 'Entered the flooded cellar'], ['Dexterity', 'Cross the flooded cellar', 'Success', 'd20 14 + 3 = 17 vs 12'],
  ['Room', 'Entered the armoury'], ['Intelligence', 'Read the maker\'s marks', 'Success', 'd20 12 + 1 = 13 vs 12'],
  ['Room', 'Entered the shrine of the drowned saint'], ['Wisdom', 'Hear the saint\'s bell', 'Success', 'd20 15 + 1 = 16 vs 12'], ['Constitution', 'Hold your breath', 'Success', 'd20 13 + 2 = 15 vs 12'],
  ['Room', 'Entered the well shaft'], ['Strength', 'Climb the well shaft', 'Success', 'd20 12 + 0 = 12 vs 12'], ['Dexterity', 'Slip the rope', 'Success', 'd20 17 + 3 = 20 vs 12'],
  ['Room', 'Entered the barracks'], ['Dexterity', 'Slip past the sleeping guard', 'Success', 'd20 16 + 3 = 19 vs 12'],
  ['Room', 'Entered the chapel'], ['Wisdom', 'Listen at the altar', 'Success', 'd20 14 + 1 = 15 vs 12'], ['Intelligence', 'Read the psalm board', 'Success', 'd20 13 + 1 = 14 vs 12'],
  ['Room', 'Entered the crypt'], ['Dexterity', 'Pick the crypt lock', 'Success', 'd20 15 + 3 = 18 vs 12'],
  ['Room', 'Entered the bone pit'], ['Strength', 'Cross the bone pit', 'Success', 'd20 18 + 0 = 18 vs 12'], ['Dexterity', 'Slip the trap', 'Success', 'd20 11 + 3 = 14 vs 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'], ['Room', 'Entered the shrine cavern'],
  ['Dexterity', 'Hit', 'd20 10 + 3 = 13 vs 12', 'Struck back: d20 16 vs 14, hit, 2 damage, HP 14/21'], ['Dexterity', 'Hit', 'd20 17 + 3 = 20 vs 12', 'Struck back: d20 6 vs 14, missed'], ['Dexterity', 'Hit', 'd20 18 + 3 = 21 vs 12', 'Struck back: d20 9 vs 14, missed'],
  ['Dexterity', 'Hit', 'd20s 5 and 12, kept 12 + 3 = 15 vs 12', 'Struck back: d20 17 vs 14, hit, 1 damage, HP 13/21'], ['Dexterity', 'Hit', 'd20 11 + 3 = 14 vs 12', 'Struck back: d20 12 vs 14, missed'], ['Dexterity', 'Miss', 'd20 8 + 3 = 11 vs 12', 'Struck back: d20 16 vs 14, hit, 1 damage, HP 12/21']] };
// The hard play's natural 20 in Snaggle's den (its second roll there, a heavy attack) is also its biggest hit, so one roll earns Best roll and Biggest hit and the held roll reads "Best roll · Biggest hit".
// SAMPLE: it carries the fullest attack the game allows, the d20 and five parts (delve.md, Fighting a foe: the attack stat, proficiency, the weapon's magic bonus, the escalation die, less the heavy attack's cut), and a critical hit's damage, the d8 rolled twice with each flat part added once (the stat, the magic bonus, the rogue's heavy bonus of 4), 21 in all, piercing.
// Snaggle's health is 23, so the hit before it (1) and this one leave 1 and the hit after beats it; every other hit keeps no damage roll.
{ const hard = GS_SESSIONS['delve-hard']; const rollAt = (l) => /(d20 |d20s \d+ and \d+, kept )\d+ [+-] \d+ = /.test(l.slice(1).join(' · '));
  const n = hard.lines.filter(rollAt).indexOf(hard.lines.find((l) => rollAt(l) && l.includes('Natural 20') && /^Heavy attack/.test(l[1]))) + 1;
  GS_SESSIONS['delve-hard'] = { ...hard, foeMax: { ...hard.foeMax, "snaggle's den": 23 }, detail: { [n]: { parts: [['+', 3, 'DEX'], ['+', 2, 'Simple'], ['+', 1, 'Magic'], ['+', 1, 'Escalation'], ['−', 2, 'Heavy']], dmg: { die: 'd8', v: 8, parts: [['+', 5, 'd8'], ['+', 3, 'DEX'], ['+', 1, 'Magic'], ['+', 4, 'Heavy']], type: 'Piercing' } } } }; }
// The hard play with a last going-back to the warren (The ritual +1) that filled the threat: no roll or use in that room, so the run ends on the loss cross. SAMPLE: the going-back is added to the hard play.
// Its last roll leaves the threat at 11/12 (the hard play without the going-back to the warren before the shrine cavern), so the going-back (+1) is what fills it to 12/12.
GS_SESSIONS['delve-overrun-back'] = (() => { const L = GS_SESSIONS['delve-hard'].lines; const at = L.findIndex((l) => l[1] === 'Entered the shrine cavern');
  return { ...GS_SESSIONS['delve-hard'], lostOff: { over: true, name: 'Going back' }, lines: [...L.slice(0, at - 1), ...L.slice(at), ['Room', 'Doubled back to the warren', 'The ritual +1']] }; })();
// A run in the Briar Keep (edition 3, content/delve/3.v1.json) that has climbed the thorn stair, a hazard of health 4: a partial success, a failure, a success, and the success that beats it.
// The rooms before the stair and the briar knight's health are sample; the route follows the edition's order.
// noEd: the library lists one run (the Goblin Warren), so this sample names its own setting rather than that run's title.
GS_SESSIONS['delve-hazard'] = { ...GS_SESSIONS.delve, noEd: true, date: 'Monday 12 October', live: true, loss: false, end: 'won', result: 'In progress', reached: null, share: null, shareLines: null,
  setting: 'The Briar Keep', hero: 'Hal the Woodcutter', hpMax: 23, threat: 2, threatMax: 14, lightName: null, light: 0, lightMax: 0, foeMax: {},
  figures: ['Threat 2/14', '10 rolls', 'HP 20/23'], tracks: { progress: 4, rooms: 6, threat: 2, threatMax: 14 }, sheet: { used: {}, insp: true }, lines: [
  ['Intelligence', 'Read the rhyme on the gatepost', 'Success', 'd20 17 + 0 = 17 vs 12'],
  ['Room', 'Entered the rose walk'], ['Dexterity', 'Climb the garden wall to the sundial', 'Success', 'd20 16 + 1 = 17 vs 12'],
  ['Room', 'Entered the well court'], ['Charisma', 'Flatter the witch', 'Partial success', 'd20 13 + 0 = 13 vs 12'],
  ['Room', 'Entered the great hall'],
  ['Strength', 'Hit', 'd20 10 + 3 = 13 vs 12', 'Struck back: d20 4 vs 10, missed'], ['Strength', 'Hit', 'd20 12 + 3 = 15 vs 12', 'Struck back: d20 12 vs 10, hit, 1 damage, HP 22/23'], ['Strength', 'Hit', 'd20 14 + 3 = 17 vs 12'],
  ['Room', 'Entered the thorn stair'],
  ['Strength', 'Partial success', 'd20 11 + 3 = 14 vs 12'], ['Strength', 'Failure', 'd20 6 + 3 = 9 vs 12', 'HP 20/23'], ['Strength', 'Success', 'd20 15 + 3 = 18 vs 12'], ['Strength', 'Success', 'd20 16 + 3 = 19 vs 12']] };
}
