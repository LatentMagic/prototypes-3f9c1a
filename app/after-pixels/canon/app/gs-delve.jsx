// ============================================================================
// After Pixels — Delve's session page (1236): under the store's quiet head, the 3B character sheet, then the run card
// (the result as 3 · Band, the route of rooms and rolls, the held roll), then Every move collapsed. Built from the
// playgrounds delve-v3 to delve-v9 (owner, 2026-10-29: "integrate this"). Styles: app/gs-delve.css.
// Reads the run's record (GS_SESSIONS.delve and its copies in app/gs-data.jsx). Loads after app/gs-word.jsx.
// The hero sheets (stats, abilities, starting gear) and the carry limit are SAMPLE, invented to delve.md's words.
// ============================================================================

// SAMPLE, from deployed content (monorepo scene/src/lib/domain/archetype.ts and content/delve/1.v2.json): the stats, health, defence, heavy attack, ultimate, protection and starting gear of the fighter
// and the rogue (one consumable each and no armour gear, as delve.md says). The Warren's carry limit is three. The foes below, their health and
// are invented too: the record names no foe and writes no foe health, only the struck-back part of a roll's line, whose target is the hero's defence (10 the fighter, 14 the rogue).
const DL_FOES = { 'the chime run': ['Chime-rat', 2], 'the warren': ['Warren guard', 4], "snaggle's den": ['Snaggle', 3], 'the shrine cavern': ['Ritual priest', 2] };
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
    abilities: [{ name: 'Shield bash', of: 1, ult: true, does: 'Strikes at once, no roll' }],
    fight: { defence: 10, armour: 2, armourName: 'ox shield', heavy: { name: 'Cleave', needs: 14, dmg: 7 } },
    gear: [{ name: 'Healing draught', kind: 'once', does: 'Heals 10' }, { name: 'Crowbar', kind: 'key', does: '' }] },
  // Wren, from the same source (rogue): defence 14, protection 1 (a leather jerkin), heavy attack Flurry needing 13 for 6, ultimate Sneak attack, 21 health, gear a healing draught and a rope (a key).
  'Wren the Rogue': { name: 'Wren', cls: 'Rogue', stats: { Strength: 0, Dexterity: 3, Constitution: 1, Intelligence: 1, Wisdom: 0, Charisma: 2 },
    abilities: [{ name: 'Sneak attack', of: 1, ult: true, does: 'Strikes at once, no roll' }],
    fight: { defence: 14, armour: 1, armourName: 'leather jerkin', heavy: { name: 'Flurry', needs: 13, dmg: 6 } },
    gear: [{ name: 'Healing draught', kind: 'once', does: 'Heals 10' }, { name: 'Rope', kind: 'key', does: '' }] },
};
const DL_GEAR_DOES = { 'Iron key': 'Opens the lock it fits' };

// ---- The model: the record's lines read into the rooms stood in (going back included), the rolls and the gear. ----
// A fight roll is a hit or a miss (delve.md: Check); an option or an obstacle is a success, a partial success or a failure. A fight die is never the middle tone.
const dlGrade = (r) => (r.fight ? { strong: 'Hit', miss: 'Miss' } : { strong: 'Success', weak: 'Partial success', miss: 'Failure' })[r.tier];
// A heavy attack names itself ("Heavy attack: Cleave") and is an attack on the foe, not an option.
// A roll's line: [stat, the action if it was an option, its grade, "Natural 20" or "Natural 1", "d20 14 + 3 = 17 vs 12", "HP 19/23"], the dice as the deployed record writes them (monorepo scene session-record.ts diceOf).
// A fight roll's line opens with Hit or Miss (or "Heavy attack: Cleave"); an option's with its name, then Success, Partial success or Failure.
const DL_GRADE = /^(Hit|Miss)$/;
const dlStruck = (parts) => { const sb = /^Struck back: (?:d20s (\d+) and (\d+), kept (\d+)|d20 (\d+)) vs (\d+), (hit|missed)(?:, (\d+) damage)?/.exec(parts.find((p) => /^Struck back: /.test(p)) || '');
  if (!sb) return null; const two = sb[1] != null; const roll = +(sb[3] || sb[4]);
  return { roll, other: two ? (+sb[1] === roll ? +sb[2] : +sb[1]) : null, dc: +sb[5], hit: sb[6] === 'hit', dmg: sb[7] ? +sb[7] : 0 }; };
// The foe's roll back is the last part of a hero roll's or a use's line: "Struck back: d20 14 vs 10, hit, 1 damage, HP 21/23" or "..., missed"; with advantage, "d20s 14 and 6, kept 14 vs 10". Its target is the hero's defence.
const dlRoll = (l) => {
  const parts = l.slice(1).map(String); const t = parts.join(' · ');
  const m = /(?:d20s (\d+) and (\d+), kept (\d+)|d20 (\d+)) ([+-]) (\d+) = (-?\d+) vs (\d+)/.exec(t); if (!m) return null;
  const kept = +(m[3] || m[4]); const two = m[1] != null; const other = two ? (+m[1] === kept ? +m[2] : +m[1]) : null; const mod = (m[5] === '-' ? -1 : 1) * +m[6];
  const crit = /Natural 20/.test(t); const fumble = /Natural 1\b/.test(t);
  const fight = DL_GRADE.test(parts[0]) || /^Heavy attack/.test(parts[0]);
  const tier = fumble ? 'miss' : /Partial success/.test(t) ? 'weak' : /\bMiss\b|Failure/.test(t) ? 'miss' : (/\bHit\b|\bSuccess\b/.test(t) || crit) ? 'strong' : 'miss';
  const hp = /HP\s+(\d+)\/(\d+)/.exec(t);
  return { stat: l[0], fight, kept, other, mod, total: +m[7], dc: +m[8], gap: +m[7] - +m[8], tier, crit, fumble, two, hp: hp ? +hp[1] : null, foe: dlStruck(parts), action: DL_GRADE.test(parts[0]) ? '' : /^Heavy attack/.test(parts[0]) ? 'Heavy attack' : parts[0], move: (/^Heavy attack: (.+)$/.exec(parts[0]) || [])[1] || '' };
};
// KEEP: under a held use's name, the grey words say only what it does ("strikes at once", "heals 10"): the heading already names the kind
// and the sparkle already says no roll, so both drop there; the hero sheet keeps the full text (owner, 2026-11-10).
const dlUseDoes = (d) => { const s = d.replace(/,? *no roll$/i, ''); return s.charAt(0).toLowerCase() + s.slice(1); };
// A use: the hero spent an ability or the ultimate, or used gear, and rolled nothing ("Ability · Used shield bash · Warren guard: health 4 → 3 · Struck back: d20 7 vs 10, missed").
// Its sheet entry gives what it does; the foe's roll back reads as a hero roll's does.
const DL_USE_KINDS = /^(Ability|Ultimate|Gear)$/;
const dlUse = (l, hero) => { const m = DL_USE_KINDS.test(l[0]) && /^Used (?:the |an? )?(.+)$/i.exec(String(l[1])); if (!m) return null;
  const parts = l.slice(1).map(String); const sheet = DL_HEROES[hero] || DL_HEROES['Wren the Rogue']; const name = dlCap(m[1]);
  const has = [...sheet.abilities, ...sheet.gear].find((x) => x.name === name); const hp = /HP\s+(\d+)\/(\d+)/.exec(parts.join(' · '));
  return { use: true, what: l[0], name, does: has ? dlUseDoes(has.does) : '', tier: 'use', foe: dlStruck(parts), hp: hp ? +hp[1] : null }; };
const DL_END = { won: 'The winning blow', fallen: 'The last blow', overrun: 'The last roll', live: 'Latest roll' };
// The key moments: the best roll, the closest call, the worst roll, and the roll the run ended on.
const dlMoments = (R, end) => {
  if (!R.length) return [];
  const last = R[R.length - 1]; const pool = R.slice(0, -1); const used = new Set([last.n]); const out = [];
  const take = (r, kicker) => { if (r && !used.has(r.n)) { used.add(r.n); out.push({ r, kicker }); } };
  const crit = pool.find((r) => r.crit); take(crit || pool.filter((r) => r.tier === 'strong').sort((a, b) => b.gap - a.gap)[0], 'Best roll');
  take(pool.find((r) => r.gap === 0 && !used.has(r.n)), 'Closest call');
  const fum = pool.find((r) => r.fumble && !used.has(r.n)); take(fum || pool.filter((r) => r.tier === 'miss' && !used.has(r.n)).sort((a, b) => a.gap - b.gap)[0], 'Worst roll');
  out.push({ r: last, kicker: DL_END[end] });
  return out.sort((a, b) => a.r.n - b.r.n);
};
const dlCap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
const dlBuild = (s) => {
  const stops = []; const rolls = []; const turns = []; const order = []; let cur = null; let hp = s.hpMax; const foeHp = {}; let run = 0;
  const foeOf = () => { const f = cur && DL_FOES[cur.name.toLowerCase()]; return f ? { f, k: cur.key } : null; };
  const open = (name, back) => { name = name && dlCap(name); const key = name || '_first'; if (!order.includes(key)) order.push(key);
    cur = { i: stops.length, key, name: name || 'First room', back, num: order.indexOf(key) + 1, rolls: [], turns: [] }; stops.push(cur);
    // KEEP: the streak starts again from 0 when a fight begins (delve.md: Streak); it also does when the fight ends, below.
    if (DL_FOES[(name || '').toLowerCase()]) run = 0; };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Room') { const p = String(l[1]); open(p.replace(/^(Entered|Doubled back to) /, ''), /^Doubled back to /.test(p)); return; }
    if (!cur) open(null, false);
    // A gear line that wears a foe down names its health before and after ("Snaggle: health 3 → 1").
    const wear = DL_USE_KINDS.test(l[0]) && /→ (\d+)$/.exec(String(l[2] || '')); const fo = foeOf(); const foeMx = fo ? (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1] : 0;
    const was = fo ? (foeHp[fo.k] != null ? foeHp[fo.k] : foeMx) : 0; if (wear && fo) foeHp[fo.k] = +wear[1];
    // The turn that takes a foe's health to 0 beats it: its held roll says so and keeps the foe's bar, at 0.
    const downed = (fo && was > 0 && foeHp[fo.k] === 0) ? { name: fo.f[0], max: foeMx } : null;
    const u = dlUse(l, s.hero);
    // KEEP: a use takes a turn on the route and in the held roll but is no roll: it has no roll number, is no key moment, and breaks no streak.
    if (u) { u.t = turns.length + 1; u.stop = cur.i; u.room = cur.name; u.back = cur.back;
      u.harm = u.hp != null ? Math.max(0, hp - u.hp) : 0; if (u.hp != null) hp = u.hp;
      if (fo && u.foe) { const max = (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1]; u.foe = { ...u.foe, name: fo.f[0], health: foeHp[fo.k] != null ? foeHp[fo.k] : max, max }; }
      if (downed) u.downed = downed; turns.push(u); cur.turns.push(u); return; }
    const r = dlRoll(l); if (!r) return;
    r.n = rolls.length + 1; r.t = turns.length + 1; r.stop = cur.i; r.room = cur.name; r.back = cur.back;
    r.harm = r.hp != null ? Math.max(0, hp - r.hp) : 0; if (r.hp != null) hp = r.hp;
    // A foe stands in a fight room: each hit of the hero's own attack takes one health (two on a natural 20). Its roll back, where the line holds one, rides on the roll.
    if (fo && (!r.action || r.action === 'Heavy attack')) { const left = foeHp[fo.k] != null ? foeHp[fo.k] : (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1]; foeHp[fo.k] = r.tier === 'miss' ? left : Math.max(0, left - (r.crit ? 2 : 1)); if (left > 0 && foeHp[fo.k] === 0) r.downed = { name: fo.f[0], max: foeMx };
      if (r.foe) r.foe = { ...r.foe, name: fo.f[0], health: foeHp[fo.k], max: (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1] }; }
    run = r.tier === 'strong' ? run + 1 : 0; if (fo && foeHp[fo.k] === 0) run = 0;
    rolls.push(r); turns.push(r); cur.rolls.push(r); cur.turns.push(r);
  });
  const end = s.live ? 'live' : s.end;
  const moments = dlMoments(rolls, end);
  return { stops, rolls, turns, hp, run, end, mom: Object.fromEntries(moments.map((x) => [x.r.n, x])) };
};
const dlSay = (r, foe = true) => r.use ? r.what + ' used, ' + r.room + ': ' + r.name + (foe && r.foe ? (r.foe.hit ? ', the foe hit back' : ', the foe missed back') : '') + (r.downed ? ', ' + r.downed.name + ' beaten' : '') : 'Roll ' + r.n + ', ' + r.room + ': ' + (r.action ? r.action + ', ' : '') + r.stat + ' ' + r.total + ' against ' + r.dc + ', ' + dlGrade(r).toLowerCase() + (r.crit ? ', natural 20' : r.fumble ? ', natural 1' : '') + (r.two ? ', two dice, the higher kept' : '') + (foe && r.foe ? (r.foe.hit ? ', the foe hit back' : ', the foe missed back') : '') + (r.downed ? ', ' + r.downed.name + ' beaten' : '');

// ---- The die, from the design system (DS.DelveDie, DS.DelveUseDie): strong filled green, weak filled yellow, miss empty, natural 20 rimmed,
// natural 1 red-edged, a use a quiet sparkle. A turn the foe answered has the foe's roll as a red hex behind it. DL_HEX and DL_RIM
// still draw the sheet's hexes (stats, inspiration). ----
const DL_HEX = '18,0 36,10 36,30 18,40 0,30 0,10'; const DL_RIM = '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8';
const DlDie = ({ r, size = 36, sel, foe = true, surface }) => (r.use
  ? <DS.DelveUseDie foe={foe && !!r.foe} selected={sel} surface={surface} size={size} />
  : <DS.DelveDie kind={r.tier} value={r.kept} other={r.two ? r.other : undefined} crit={r.crit} fumble={r.fumble} foe={foe && !!r.foe} selected={sel} surface={surface} size={size} />);
const DlDieBtn = ({ r, size, act, on, foe, lit }) => (
  <button type="button" className="dv2-dbtn" aria-pressed={act === r.t} aria-label={dlSay(r, foe !== false)} data-t={r.t} onClick={() => on.sel(r.t)} onMouseEnter={() => on.hov(r.t)} onMouseLeave={() => on.hov(null)}>
    <DlDie r={r} size={size} sel={act === r.t || lit === r.t} foe={foe} />
  </button>);

// ---- The result statement, 3 · Band (owner, 2026-10-29): the ending word, a hairline, the setting's line. No tally. ----
const dlWord = (m) => ({ live: 'In progress', fallen: 'Fallen', won: 'Triumphed', overrun: 'Overwhelmed' }[m.end]);
const dlTone = (m) => (m.end === 'won' ? 'ok' : m.end === 'live' ? 'live' : 'bad');
const DlResult = ({ s, m }) => { const line = m.end === 'live' ? null : s.result;
  return (<div className="dv7r-band"><h2 className={'dv7r-word is-' + dlTone(m)}>{dlWord(m)}</h2>{line && <p className="dv7r-line">{line}</p>}</div>); };

// ---- The held roll: the die large, its kicker, then a labelled row per fact. The two-dice row is left out: the die shows both. ----
// KEEP: a key moment's held box carries an off-white diamond in its top right corner. A route die is marked only by what was rolled behind it: the
// advantage hex, and in a fight the foe's red hex outside it, both cleared on the selected die; never a notch or a mark on the room (owner, 2026-11-08, replacing 2026-10-28's "never marked").
// The foe's roll is one row of the held roll: its diamond, what it did and the defence, then the foe's health as the hero's meters are drawn; no Result row.
// The foe's diamond is DS.DelveFoeDie: a diamond, never the hero's hex, so it cannot read as a second hero roll.
const DlFoeDie = ({ f }) => <DS.DelveFoeDie value={f.roll} other={f.other != null ? f.other : undefined} hit={f.hit} surface="popup" />;
// "Back in the chime run": the room's name leads with "The", so it drops to lower case mid-sentence.
const dlRoomSaid = (r) => (r.back ? 'Back in ' + r.room.replace(/^The /, 'the ') : r.room);
// KEEP: the held roll above the route is one layout at every width it appears at (no window or container breakpoint): the die and its name in a head column on the left, the roll's facts on the right.
// Each fact is its label over its value. Line 1 is the player's move in two groups, so a wrap falls between them: what was tried (room, action or use), then the dice (roll, outcome, cost).
// Line 2, only when a foe is in it, sits under a rule: the foe's roll, then the foe's health as a fact named for the foe, a bar capped at 240px with its count; a kill with no strike-back shows the health alone, at 0.
const DlFact = ({ label, children, tone }) => (<div className="dvS-fact"><dt>{label}</dt><dd className={tone ? 'is-' + tone : undefined}>{children}</dd></div>);
const DlHeldStacked = ({ r, x, live }) => { const tcls = r.fumble ? 'fumble' : r.tier;
  const grp = (...c) => { const k = c.filter(Boolean); return k.length ? <div className="dvS-grp">{k.map((n, i) => <React.Fragment key={i}>{n}</React.Fragment>)}</div> : null; };
  const foe = (r.foe || r.downed) && (
    <dl className="dvS-line is-foe">
      {r.foe && <DlFact label="Foe roll"><span className="dvS-foe"><DlFoeDie f={r.foe} /><b className={r.foe.hit ? 'is-err' : ''}>{r.foe.hit ? 'Hit you for ' + r.foe.dmg : 'Missed you'}</b> <span>vs defence {r.foe.dc}</span></span></DlFact>}
      <div className="dvS-meter"><DlMeter label={(r.foe || r.downed).name} n={r.foe ? r.foe.health : 0} of={(r.foe || r.downed).max} /></div>
    </dl>);
  return (<div className="dv3-live" aria-live={live ? 'polite' : undefined}><div className={'dv3-held is-stacked' + (x ? ' is-mo' : '')}>{x && <i className="dv3-mk" role="img" aria-label="Key moment" />}
    <div className="dvS-body">
      <div className="dvS-head"><DlDie r={r} size={52} surface="popup" />
        <div className="dv3-hk"><p className="dv3-k">{r.use ? r.what : x ? x.kicker : 'Roll ' + r.n}</p>{x && <p className="dv3-n">Roll {r.n}</p>}{r.downed && <p className="dv3-beat">{r.downed.name} beaten</p>}</div></div>
      <div className="dvS-lines">
        <dl className="dvS-line">
          {grp(<DlFact label="Room">{dlRoomSaid(r)}</DlFact>,
            r.use && <DlFact label="Used">{r.name}{r.does && <> <span className="is-does">{r.does}</span></>}</DlFact>,
            !r.use && r.action && <DlFact label="Action">{r.action}{r.move && <> <span>{r.move}</span></>}</DlFact>)}
          {grp(!r.use && <DlFact label="Roll">{r.stat} {r.total} <span>vs {r.dc}</span></DlFact>,
            !r.use && <DlFact label="Outcome" tone={tcls}>{dlGrade(r)}</DlFact>,
            r.harm > 0 && !r.foe && <DlFact label="Cost">Lost {r.harm} HP</DlFact>)}
        </dl>
        {foe}
      </div></div></div></div>); };
const DlHeld = ({ m, act, live = true, beside }) => { const r = act ? m.turns[act - 1] : null; if (!r) return null;
  const x = r.use ? null : m.mom[r.n]; const tcls = r.fumble ? 'fumble' : r.tier;
  const foeRow = r.foe && <div className="dv3-foe"><dt>Foe roll</dt><dd><DlFoeDie f={r.foe} /><b className={r.foe.hit ? 'is-err' : ''}>{r.foe.hit ? 'Hit you for ' + r.foe.dmg : 'Missed you'}</b> <span>vs defence {r.foe.dc}</span></dd></div>;
  const ledger = (<div className="dv3-live" aria-live={live ? 'polite' : undefined}><div className={'dv3-held is-ledger' + (x ? ' is-mo' : '')}>{x && <i className="dv3-mk" role="img" aria-label="Key moment" />}
    <div className="dv3-lh"><DlDie r={r} size={72} surface="popup" /><div className="dv3-lht"><div className="dv3-hk"><p className="dv3-k">{r.use ? r.what : x ? x.kicker : 'Roll ' + r.n}</p>{x && <p className="dv3-n">Roll {r.n}</p>}{r.downed && <p className="dv3-beat">{r.downed.name} beaten</p>}</div></div></div>
    <dl className="dv3-dl">
      <div><dt>Room</dt><dd>{dlRoomSaid(r)}</dd></div>
      {r.use && <div><dt>Used</dt><dd>{r.name}{r.does && <> <span className="is-does">{r.does}</span></>}</dd></div>}
      {!r.use && r.action && <div><dt>Action</dt><dd>{r.action}{r.move && <> <span>{r.move}</span></>}</dd></div>}
      {!r.use && <div><dt>Roll</dt><dd>{r.stat} {r.total} <span>vs {r.dc}</span></dd></div>}
      {!r.use && <div><dt>Outcome</dt><dd className={'is-' + tcls}>{dlGrade(r)}</dd></div>}
      {foeRow}
      {r.harm > 0 && !r.foe && <div><dt>Cost</dt><dd>Lost {r.harm} HP</dd></div>}
      {(r.foe || r.downed) && <div className="dv3-fm"><DlMeter label={(r.foe || r.downed).name} n={r.foe ? r.foe.health : 0} of={(r.foe || r.downed).max} /></div>}
    </dl>
  </div></div>);
  return beside === false ? <DlHeldStacked r={r} x={x} live={live} /> : ledger; };

// ---- The route: a column per room stood in, a rule between rooms; a key moment's die is drawn large. The held roll beside it. ----
// A room gone back to: a curved arrow drawn in the box's line, never the ↩ character (phones draw it as an emoji; Joe).
const DlBackArrow = () => (<svg className="dv2-back" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
  <path d="M4.5 10.5 1.5 7.5l3-3M1.5 7.5h6a3 3 0 0 0 0-6H5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>);
const DlStopHead = ({ st, named }) => (
  <span className="dvA2-head" aria-label={(st.back ? 'Back to ' : 'Room ' + st.num + ', ') + st.name}>
    <span className={'dv2-num' + (st.back ? ' is-back' : '')}>{st.back && <DlBackArrow />}{st.num}</span>{named && <span className="dv2-sname">{st.name}</span>}</span>);
// KEEP: a room's name is drawn only while its column is at least 64px wide; a long run with the held roll above it (12 stops in a card between 610px and about 768px) has columns of 50 to 63px, where names run into each other, so the numbers alone stay and the held roll names the room.
const DL_NAME_MIN = 64;
const useDlNamed = (n) => { const ref = React.useRef(null); const [named, setNamed] = React.useState(true);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return undefined;
    const read = () => setNamed(el.clientWidth / n >= DL_NAME_MIN); read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, [n]);
  return [ref, named]; };
// KEEP: the held roll sits beside the route only while the run card (its content width) is at least 800px, or 288px (the held roll's 272px
// and the 16px gap) plus DL_NAME_MIN for each room, whichever is wider: a long run keeps a named column per room, and below that the held roll sits above the route.
const DL_BESIDE_MIN = 800; const DL_HELD_W = 272; const DL_HELD_GAP = 16;
const dlBesideMin = (rooms) => Math.max(DL_BESIDE_MIN, DL_HELD_W + DL_HELD_GAP + DL_NAME_MIN * rooms);
const useDlBeside = (ref, rooms) => { const [beside, setBeside] = React.useState(false);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return undefined;
    const read = () => { const cs = getComputedStyle(el); const pad = ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((n, k) => n + parseFloat(cs[k]), 0); setBeside(el.getBoundingClientRect().width - pad >= dlBesideMin(rooms)); };
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, [ref, rooms]);
  return beside; };
const dlMainClass = (beside) => 'dvE-main' + (beside ? ' is-beside' : '');
const DlRoute = ({ m, act, on, beside, lit }) => { const sel = act ? m.turns[act - 1].stop : null; const [ref, named] = useDlNamed(m.stops.length);
  return (<div className={dlMainClass(beside)}>
    <div ref={ref} className="dvA2-route is-e is-cols-between" style={{ '--dv-stops': m.stops.length }} aria-label="The way you went">{m.stops.map((st) => (
      <div key={st.i} className={'dvA2-stop' + (sel === st.i ? ' is-on' : '')}>
        <DlStopHead st={st} named={named} />
        <div className="dvA2-dice">{st.turns.length ? st.turns.map((r) => (!r.use && m.mom[r.n]
          ? <span key={r.t} className="dvE-mom"><DlDieBtn r={r} act={act} lit={lit} on={on} size={52} /></span>
          : <DlDieBtn key={r.t} r={r} act={act} lit={lit} on={on} size={30} />)) : <i className="dv2-pass" aria-label="No rolls" />}</div>
      </div>))}</div>
    <div className="dvE-side"><DlHeld m={m} act={act} beside={beside} /></div>
  </div>); };
// KEEP: below a run card 610px wide (its content; the step the hero sheet takes its phone header at, so the page changes once, and the
// narrowest the 12-room hard run fits at) the route is a list of closed rooms: one 48px line per room on a rule
// running down the left: its number, its name, then at the line's right end its key moments as 24px dice and other rolls as dots, and a chevron
// (the tally drops under the name only when the line is too narrow for both); a tap anywhere on the line opens that room (one at a time) with all its dice, and a pressed die's held roll
// opens right under them, so the roll is never off screen from the die. From 610px the route is the horizontal one. The switch width is the user's to ratify on the built page.
const DL_LIST_BELOW = 610;
const useDlList = (ref) => { const [list, setList] = React.useState(false);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return undefined;
    // KEEP: the list drops the card's side padding for its own 16px gutters, so the switch reads the list's width less those gutters, the width the route would have; reading the bare card would flip list and route back and forth between windows of about 644 and 676px.
    const read = () => { const cs = getComputedStyle(el); const sides = el.classList.contains('is-list') ? ['borderLeftWidth', 'borderRightWidth'] : ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'];
      const pad = sides.reduce((n, k) => n + parseFloat(cs[k]), 0) + (el.classList.contains('is-list') ? 2 * DL_GUTTER : 0); setList(el.getBoundingClientRect().width - pad < DL_LIST_BELOW); };
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, [ref]);
  return list; };
// KEEP: an open room's dice sit 12px below its line's bottom edge (where the hover band ends), and the next room's line starts 12px below the
// dice, or below the held roll when one is open; the dice to the held roll is 12px too. The 12px is read from what is drawn (the hexes behind a die
// and a pressed die's ring), not from the dice boxes, which leave uneven room above and below their drawing; a mouse-over ring is left out, so a hover never moves the room.
const DL_OPEN_GAP = 12;
const dlEvenOpen = (el) => { const dice = el && el.querySelector('.dvL-dice'); if (!dice) return;
  const box = dice.getBoundingClientRect(); const drawn = [...dice.querySelectorAll('svg *')].filter((e) => /^(polygon|path|circle|rect)$/.test(e.tagName)
    && (!e.classList.contains('sl') || e.closest('[aria-pressed="true"]')) && getComputedStyle(e).display !== 'none').map((e) => e.getBoundingClientRect()).filter((r) => r.height > 0);
  if (!drawn.length) return;
  el.style.setProperty('--dvL-up', Math.max(0, DL_OPEN_GAP - (Math.min(...drawn.map((r) => r.top)) - box.top)) + 'px');
  const bottom = box.bottom - parseFloat(getComputedStyle(dice).paddingBottom); // the row's own padding is what this sets, so it is left out of the reading
  el.style.setProperty('--dvL-down', Math.max(0, DL_OPEN_GAP - (bottom - Math.max(...drawn.map((r) => r.bottom)))) + 'px'); };
const DlRoomRow = ({ m, st, act, lit, on, open, setOpen, first, last }) => {
  const isOpen = open === st.i; const sel = act ? m.turns[act - 1].stop : null; const has = st.turns.length > 0;
  const keys = st.turns.filter((r) => !r.use && m.mom[r.n]); const rest = st.turns.filter((r) => r.use || !m.mom[r.n]);
  const onRoom = React.useMemo(() => ({ ...on, sel: (t) => { if (on.focus) on.focus(t); setOpen(st.i); on.sel(t); } }), [on, st.i, setOpen]);
  const label = (st.back ? 'Back to ' : 'Room ' + st.num + ', ') + st.name; const fold = 'dvL-room-' + st.i;
  const openRef = React.useRef(null); React.useLayoutEffect(() => { if (isOpen) dlEvenOpen(openRef.current); }, [isOpen, act]);
  return (
    <div className={'dvL-row' + (isOpen ? ' is-open' : '') + (first ? ' is-first' : '') + (last ? ' is-last' : '')}>
      <div className={'dvL-top' + (has ? ' is-tap' : '')}>
        <span className={'dv2-num dvL-num' + (st.back ? ' is-back' : '')} aria-hidden="true">{st.back && <DlBackArrow />}{st.num}</span>
        <div className="dvL-line">
          {has
            ? <button type="button" className="dvL-head" aria-expanded={isOpen} aria-controls={fold} aria-label={label} onClick={() => setOpen(isOpen ? null : st.i)}>
              <span className="dvL-name" aria-hidden="true">{st.name}</span><DS.Icon name="next" size={20} /></button>
            : <p className="dvL-head dvL-name is-pass"><span aria-hidden="true">{st.name}</span><span className="dvL-vh">{label + ', no rolls'}</span></p>}
          {has
            ? <div className="dvL-tally" aria-hidden={isOpen || undefined}>
              {keys.map((r) => <DlDieBtn key={r.t} r={r} act={act} lit={lit} on={onRoom} size={24} />)}
              {rest.length > 0 && <span className="dvL-dots" role="img" aria-label={dlNowMarksSay(rest)}>
                {rest.map((r) => <i key={r.t} className={'dl-now-mark is-' + (r.tier || 'use')} />)}</span>}
            </div>
            : <i className="dv2-pass dvL-pass" aria-hidden="true" />}
        </div>
      </div>
      {has && <div id={fold} className="dvL-fold"><EsxFold open={isOpen}>{isOpen && <div ref={openRef} className="dvL-open">
        <div className="dvL-dice">{st.turns.map((r) => <DlDieBtn key={r.t} r={r} act={act} lit={lit} on={on} size={!r.use && m.mom[r.n] ? 44 : 30} />)}</div>
        {sel === st.i && <div className="dvL-held"><DlHeld m={m} act={act} live={false} /></div>}
      </div>}</EsxFold></div>}
    </div>);
};
// A die pressed in a closed room unmounts with that room's tally as the room opens, so focus is handed to the same roll's die in the opened room.
// One live region stays mounted for the list and carries the pressed roll's text; a region inserted fresh under each room is not announced.
const DlRoomList = ({ m, act, on }) => {
  const [open, setOpen] = React.useState(() => (act ? m.turns[act - 1].stop : null));
  const ref = React.useRef(null); const pending = React.useRef(null);
  // KEEP: a mouse over a die rings it as the route's selected die is ringed (its foe and second hexes cleared), but the held roll stays the pressed one's; touch gives no hover, so a tap never leaves a ring behind.
  const [lit, setLit] = React.useState(null);
  const onList = React.useMemo(() => ({ ...on, hov: (t) => { if (t == null || window.matchMedia('(hover: hover)').matches) setLit(t); }, focus: (t) => { pending.current = t; } }), [on]);
  React.useLayoutEffect(() => { const t = pending.current; if (t == null) return; pending.current = null;
    const b = ref.current && ref.current.querySelector('.dvL-dice [data-t="' + t + '"]'); if (b) b.focus(); });
  const r = act ? m.turns[act - 1] : null;
  return (<div ref={ref} className="dvL-list" aria-label="The way you went"><p className="dvL-vh" aria-live="polite">{r ? dlSay(r) : ''}</p>{m.stops.map((st, i) => <DlRoomRow key={st.i} m={m} st={st} act={act} on={onList} lit={lit} open={open} setOpen={setOpen} first={i === 0} last={i === m.stops.length - 1} />)}</div>);
};
// ---- Before the first roll: the run's rooms drawn empty. A room is its number over an empty hex where its dice will go. ----
const DlEmptyHex = () => (<svg className="dl-empty-hex" viewBox="-5 -5 46 50" aria-hidden="true" focusable="false"><polygon points={DL_HEX} /></svg>);
const dlEmptyStops = (n) => Array.from({ length: n }, (_, i) => ({ i, num: i + 1, back: false, name: 'Room ' + (i + 1) }));
// The session page before the first roll (layout C): the run's rooms drawn empty, the first reached, and nothing else (the user, 2026-11-10):
// no held roll and no "No rolls yet" until there is a roll, so the route fills the card at every width.
const DlEmptyRoute = ({ rooms }) => (<div className={dlMainClass(false)}>
  <div className="dvA2-route is-e is-cols-between" style={{ '--dv-stops': rooms }} aria-label="The way you went">{dlEmptyStops(rooms).map((st) => (
    <div key={st.i} className={'dvA2-stop' + (st.i === 0 ? ' is-on' : ' is-far')}>
      <span className="dvA2-head" aria-label={'Room ' + st.num + (st.i === 0 ? ', First room' : ', not reached')}><span className="dv2-num">{st.num}</span><span className="dv2-sname">{st.i === 0 ? 'First room' : '\u00a0'}</span></span>
      <div className="dvA2-dice">{st.i === 0 ? <i className="dv2-pass" aria-label="No rolls" /> : <DlEmptyHex />}</div>
    </div>))}</div>
</div>);
const DlEmptyList = ({ rooms }) => (<div className="dvL-list" aria-label="The way you went">{dlEmptyStops(rooms).map((st) => (
  <div key={st.i} className={'dvL-row' + (st.i === 0 ? ' is-open is-first' : ' is-far') + (st.i === rooms - 1 ? ' is-last' : '')}>
    <div className="dvL-top">
      <span className="dv2-num dvL-num" aria-hidden="true">{st.num}</span>
      <div className="dvL-line">{st.i === 0
        ? <p className="dvL-head dvL-name"><span aria-hidden="true">First room</span><span className="dvL-vh">Room 1, First room, no rolls</span></p>
        : <div className="dvL-head" role="img" aria-label={'Room ' + st.num + ', not reached'}><DlEmptyHex /></div>}</div>
    </div>
  </div>))}</div>);
// KEEP: a press holds a roll and fills the held roll; it opens on the roll the route names (a die pressed on the now card), else the
// last roll. Beside the route a hover also fills the held roll. Above the route and in the list a hover only rings the die: a held roll
// that follows the pointer changes the box's height, moves the route and the die from under the pointer, and the route flickers.
const DlCard = ({ s, m, roll }) => {
  const ref = React.useRef(null); const list = useDlList(ref); const rooms = m.turns.length ? m.stops.length : (s.tracks && s.tracks.rooms) || 5; const beside = useDlBeside(ref, rooms);
  const [sel, setSel] = React.useState(() => (roll && m.rolls[roll - 1] ? m.rolls[roll - 1].t : m.turns.length ? m.turns.length : null)); const [hov, setHov] = React.useState(null);
  const on = React.useMemo(() => ({ sel: setSel, hov: setHov }), []);
  const stacked = list || !beside; const act = stacked ? sel : hov || sel;
  if (!m.turns.length) {
    return (<section ref={ref} className={'dv2 dv7r is-3' + (list ? ' is-list' : '')} aria-label="How the run went"><DlResult s={s} m={m} />{list ? <DlEmptyList rooms={rooms} /> : <DlEmptyRoute rooms={rooms} />}</section>); }
  return (<section ref={ref} className={'dv2 dv7r is-3' + (list ? ' is-list' : '')} aria-label="How the run went"><DlResult s={s} m={m} />
    {list ? <DlRoomList m={m} act={act} on={{ sel: setSel, hov: DL_NO_HOVER }} /> : <DlRoute m={m} act={act} on={on} beside={beside} lit={stacked ? hov : null} />}</section>);
};

// ---- The character sheet, read from the hero's sheet and the record's lines: gear taken, used, or a key that opened its lock. ----
const DL_STATE = { worn: 'Worn', held: 'Held', used: 'Used' };
const dlSheet = (s, m) => {
  const h = DL_HEROES[s.hero] || DL_HEROES['Wren the Rogue']; const sh = s.sheet || {}; const used = sh.used || {};
  const gear = h.gear.map((g) => ({ ...g, state: g.kind === 'armour' ? 'worn' : 'held' }));
  const find = (name) => { const n = dlCap(name.replace(/^(a|an|the)\s+/i, '')); let g = gear.find((x) => x.name === n);
    if (!g) { g = { name: n, kind: /key/i.test(n) ? 'key' : 'once', does: DL_GEAR_DOES[n] || '', state: 'held' }; gear.push(g); } return g; };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Gear') { const t = String(l[1]); if (/^Took /.test(t)) find(t.replace(/^Took /, '')); else if (/^Used /.test(t)) find(t.replace(/^Used /, '')).state = 'used'; }
    // KEEP: a key opens its lock and is kept (delve.md, Gear), so it stays in the pack, noted with the lock it opened.
    if (l[0] === 'Lock') { const w = /^Opened (.+) with (.+)$/.exec(String(l[1])); if (w) find(w[2]).note = 'Opened ' + w[1]; }
  });
  gear.forEach((g) => { g.label = g.note || DL_STATE[g.state]; });
  return { name: h.name, cls: h.cls, hp: m.hp, hpMax: s.hpMax, threat: s.threat, threatMax: s.threatMax, carry: DL_CARRY, gear,
    abilities: h.abilities.map((a) => ({ ...a, left: Math.max(0, a.of - (used[a.name] || 0)) })), insp: !!sh.insp,
    fight: h.fight || null, stats: Object.entries(h.stats).map(([k, n]) => ({ k, ab: k.slice(0, 3).toUpperCase(), say: (n < 0 ? '−' : '+') + Math.abs(n) })) };
};
// Glyphs, line-drawn as the shop's icons (1.75 stroke, square caps, mitred joins). Armour has its own: a shield.
const DL_G = { armour: 'M5 4h14v8l-7 8-7-8z', once: 'M9 3h6M10 3v6l-5 11h14l-5-11V3', key: 'M3 9h7v6H3zM10 12h11M17 12v4M20 12v3' };
const DlBox = ({ k, state }) => (<span className={'dv4-g' + (state === 'used' ? ' is-used' : '') + (!k ? ' is-empty' : '')}>{k && <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={DL_G[k]} /></svg>}</span>);
const DlUses = ({ left, of }) => (<span className="dv4-uses" role="img" aria-label={left + ' of ' + of + ' left'}>{Array.from({ length: of }, (_, i) => <i key={i} className={i < left ? 'is-on' : ''} />)}</span>);
// Inspiration: a hex like the die's, rimmed as a natural 20 is, since a natural 20 gives it back; empty once spent.
const DlInsp = ({ on }) => (<span className="dv5-insw" role="img" aria-label={'Inspiration, ' + (on ? 'ready' : 'spent')}><svg className={'dv4-insp' + (on ? ' is-on' : '')} viewBox="-5 -5 46 50" width="28" height="30" aria-hidden="true">
  <polygon className="hx" points={DL_HEX} />{on && <polygon className="rim" points={DL_RIM} />}</svg></span>);
const DlHex = ({ x }) => (<svg className="dv4-sx" viewBox="-5 -5 46 50" width="32" height="35" role="img" aria-label={x.say}><polygon className="hx" points={DL_HEX} /><text x="18" y="20.5">{x.say}</text></svg>);
// KEEP: every piece below a group's heading is one cell (a fixed-height figure, one label under it), so the rows line up.
const DlCell = ({ label, used, title, children }) => (<div className={'dv7-cell' + (used ? ' is-used' : '')} title={title}><span className="dv7-fig">{children}</span><span className="dv7-lb">{label}</span></div>);
// KEEP: a meter's count is written 9/13, the short form, so the meters' column stays narrow (owner, 2026-10-29).
const DlMeter = ({ label, n, of }) => (<div className="dv6-bar"><span>{label}</span><DS.ProgressBar label={label} value={n} max={of} showValue={false} /><small>{n + '/' + of}</small></div>);

// 3B (owner, 2026-10-29): the hero; hit points and threat stacked on one grid; then five tabs: Stats, Advantage, Pack (with its free slots), Ability and Fight. The torch, clues and the bargain join once the record holds them.
// The sheet's tabs are Escape's tap cards (esx-cards, EsxFold); a tab adds only its icon.
// KEEP: the layout is chosen by the sheet's own content width, never the window, with four steps: one row of name, bars and five tabs from 796px; from 610px the name and bars side by side with the five tabs full width under them; from 340.02px the name line over the bars over the five tabs; at 340px and under the tabs become a list, icon beside word. A step's tabs are as wide as their share of the row, at most 140px, and their words step from 10px to 8px as the sheet narrows.
// KEEP: every two-row layout opens folded to the name and bars; the whole header is the fold, its chevron centred on it. The one-row layout has no fold.
// KEEP: the sheet card has no padding of its own: each part carries the 16px side gutter, so the header's hover tint runs edge to edge of the card. The layout steps are still measured on the card's width less that gutter, 796px and the rest.
const DL_GUTTER = 16;
const DL_ONE_ROW = 796;
// Whether the sheet is wide enough for one row, read as the CSS container reads it, before paint and on every resize.
const useDlOneRow = (ref) => { const [one, setOne] = React.useState(false);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return undefined;
    const read = () => { const cs = getComputedStyle(el); const edge = ['borderLeftWidth', 'borderRightWidth'].reduce((n, k) => n + parseFloat(cs[k]), 0); setOne(el.getBoundingClientRect().width - edge - 2 * DL_GUTTER >= DL_ONE_ROW); };
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, [ref]);
  return one; };
const DlStatCells = ({ c }) => c.stats.map((x) => <DlCell key={x.k} label={x.ab} title={x.k}><DlHex x={x} /></DlCell>);
const DlAdvCells = ({ c, streak }) => (<><DlCell label="Inspiration" used={!c.insp} title={c.insp ? 'Ready' : 'Spent'}><DlInsp on={c.insp} /></DlCell>
  <DlCell label="Streak" title="Hits or successes in a row. From two on, it gives advantage."><span className="dv8-num">{streak}</span></DlCell></>);
const DlMeters = ({ c }) => <div className="dv7-grp dv8-meters"><DlMeter label="Hit points" n={c.hp} of={c.hpMax} /><DlMeter label="Threat" n={c.threat} of={c.threatMax} /></div>;
// The fight facts: a number in a cell, as Streak is. A named thing says what it is under its name.
const dlFight = (c) => { const f = c.fight; if (!f) return [];
  return [{ key: 'def', label: 'Defence', num: f.defence, text: 'A foe’s d20 must reach ' + f.defence + ' to hit you.' },
    { key: 'arm', label: 'Armour', num: f.armour, tip: f.armourName, text: 'The ' + f.armourName + ': takes ' + f.armour + ' damage off blows each fight, full again at the next.' },
    { key: 'heavy', label: f.heavy.name, kind: 'Heavy attack', num: f.heavy.needs, text: 'Needs ' + f.heavy.needs + ' to hit, ' + f.heavy.dmg + ' damage.' }]; };
const DlLabel = ({ name, kind }) => (kind ? <>{name}<small className="dv8-sub">{kind}</small></> : name);
const dlSlots = (c) => Array.from({ length: Math.max(c.carry, c.gear.length) }, (_, i) => c.gear[i] || null);

// The tabs and what each opens: Stats and Advantage open the sheet's own cells, Pack, Ability and Fight open rows.
const dlTabGroups = (c, slots, streak) => {
  const free = slots.length - c.gear.length; const left = c.abilities.reduce((n, a) => n + a.left, 0); const of = c.abilities.reduce((n, a) => n + a.of, 0);
  return [
    { key: 'stats', head: 'Stats', icon: 'stats', cells: <DlStatCells c={c} />, cls: 'dv8-stats' },
    { key: 'advantage', head: 'Advantage', icon: 'advantage', cells: <DlAdvCells c={c} streak={streak} />, cls: 'dv8-adv' },
    { key: 'pack', head: 'Pack', icon: 'pack', say: c.gear.length + ' of ' + slots.length + ' carried',
      rows: [...c.gear.map((g) => ({ key: g.name, fig: <DlBox k={g.kind} state={g.state} />, name: g.name, tag: g.label, text: g.does })),
        ...(free > 0 ? [{ key: 'free', fig: <DlBox k={null} />, name: 'Free', text: 'Room for ' + (free === 1 ? 'one more' : free + ' more') + '.' }] : [])] },
    { key: 'abilities', head: 'Ability', icon: 'ability', say: left + ' of ' + of + ' uses left',
      rows: c.abilities.map((a) => ({ key: a.name, fig: <DlUses left={a.left} of={a.of} />, name: a.name, tag: (a.ult ? 'Ultimate · ' : '') + a.left + ' of ' + a.of + ' left', text: a.does })) },
    ...(c.fight ? [{ key: 'fight', head: 'Fight', icon: 'fight', say: 'defence ' + c.fight.defence,
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
    : <div key={grp.key} className={'dl-panel dl-cellpanel esx-in ' + grp.cls} role="group" aria-label={grp.head}><div className="dv7-cells">{grp.cells}</div></div>)}</EsxFold>); };
// The header: the name, then the bars. Below one row it is the fold: the chevron's button is stretched over the whole header, so a tap anywhere on it folds the tabs, while the bars stay readable to a screen reader. One row hides the button in CSS, so the header never waits on a render to change layout.
const DlHead = ({ c, folded, fold }) => (<div className="dl-head is-fold">
  <div className="dv7-grp is-hero"><p className="dv7-hero"><b>{c.name}</b><span>{c.cls}</span></p></div>
  <DlMeters c={c} />
  <button type="button" className="dl-fold" aria-expanded={!folded} aria-controls="dl-sheet-tabs" aria-label="Character sheet details" onClick={fold}><DS.Icon name="next" size={20} /></button>
</div>);
const DlSheet = ({ c, streak }) => { const ref = React.useRef(null); const one = useDlOneRow(ref); const [card, setCard] = React.useState(null); const [folded, setFolded] = React.useState(true);
  const [seen, setSeen] = React.useState(one); const [tap, setTap] = React.useState(null);
  const groups = dlTabGroups(c, dlSlots(c), streak);
  // KEEP: a new layout opens as a first one does: the tab shut and, in two rows, the sheet folded. Changing between one row and two is the new layout.
  if (seen !== one) { setSeen(one); setCard(null); setFolded(true); setTap(null); }
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
    <div className="dv4-lay"><DlSheet c={c} streak={m.run} /><DlCard s={s} m={m} roll={gs.route && gs.route.roll} /></div>
    <GsMoves s={s} />
  </>;
};

// ---- The now card on Delve's library game page, once this week's run is played or started: the shared frame (LbNowCard), with the
// session page's ending word as its result and the run's route at the card's size in place of the line and bar. No sheet, no held roll.
// KEEP: only a key moment is a button (it keeps its number and opens the session page with that roll held, as Escape's doors open
// their lock); every other roll is a small outcome mark with no number, not focusable, so it never reads as pressable (owner, 2026-10-30).
// Rooms wrap onto further rows when the card is too narrow for them in one (balanced, below), and the dice of a room wrap inside its column, so nothing overlaps.
// A free player's first run (CprFirst, app/gs-pass-library.jsx) passes its own label, its session ids, no next run, and pass.
const DL_NO_HOVER = () => {};
// KEEP: rows are balanced, never one room left alone: n rooms in r rows take ceil(n / r) columns, r as few as fit 44px columns
// (8 rooms where 7 fit go 4 and 4; 5 where 4 fit go 3 and 2) (owner, 2026-10-30). The line joining the rooms runs along each row and
// stops at its ends, so a wrapped row never leaves a stub.
const DL_NOW_COL = 44;
const useDlNowCols = (n) => { const ref = React.useRef(null); const [cols, setCols] = React.useState(n);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return;
    const read = () => { const fit = Math.max(1, Math.floor(el.clientWidth / DL_NOW_COL)); setCols(n <= fit ? n : Math.ceil(n / Math.ceil(n / fit))); };
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, [n]);
  return [ref, cols]; };
// KEEP: a room's marks fold in rows of at most three, balanced, never one left alone below a full row (4 go 2 and 2, 5 go 3 and 2)
// (owner, 2026-10-30).
const dlMarkCols = (n) => (n <= 3 ? n : Math.ceil(n / Math.ceil(n / 3)));
// KEEP: a use (ability, ultimate, gear) is no roll, so it marks the Now card as a small grey sparkle among the room's dots, not a dot,
// as the share line counts it with a sparkle (owner, 2026-11-10).
const DlNowUseMark = () => (<svg className="dl-now-mark is-use" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8Z" /></svg>);
const dlNowMarksSay = (rest) => { const rolls = rest.filter((r) => !r.use); const uses = rest.length - rolls.length;
  const said = rolls.length ? rolls.length + (rolls.length === 1 ? ' other roll: ' : ' other rolls: ') + rolls.map((r) => dlGrade(r).toLowerCase()).join(', ') : '';
  return [said, uses ? (uses === 1 ? 'a use' : uses + ' uses') : ''].filter(Boolean).join(', and '); };
const DlNowRoute = ({ m, open }) => { const on = { sel: (t) => open(m.turns[t - 1].n), hov: DL_NO_HOVER }; const [ref, cols] = useDlNowCols(m.stops.length);
  return (<div className="dl-now-stops" ref={ref} style={{ '--dl-cols': cols }} aria-label="The way you went">{m.stops.map((st, i) => {
    const keys = st.turns.filter((r) => !r.use && m.mom[r.n]); const rest = st.turns.filter((r) => r.use || !m.mom[r.n]);
    const edge = (i % cols === 0 ? ' is-row-start' : '') + (i % cols === cols - 1 || i === m.stops.length - 1 ? ' is-row-end' : '');
    return (<div key={st.i} className={'dl-now-stop' + edge}>
      <DlStopHead st={st} />
      {!st.turns.length && <i className="dv2-pass" aria-label="No rolls" />}
      {keys.length > 0 && <div className="dl-now-keys">{keys.map((r) => <DlDieBtn key={r.n} r={r} act={null} on={on} size={34} foe />)}</div>}
      {rest.length > 0 && <span className="dl-now-marks" style={{ '--dl-marks': dlMarkCols(rest.length) }} role="img" aria-label={dlNowMarksSay(rest)}>
        {rest.map((r) => (r.use ? <DlNowUseMark key={r.t} /> : <i key={r.t} className={'dl-now-mark is-' + r.tier} />))}</span>}
    </div>);
  })}</div>);
};
// The Now card of a run not started: the week's title, the run's rooms empty, Play, the next run. No line and no tag: the empty rooms say it (user, 2026-11-08, "looks fine").
export const DlNowEmpty = ({ title, rooms, next, onPlay }) => { const [ref, cols] = useDlNowCols(rooms);
  return (
    <LbNowCard gid="delve" className="dl-now" title={title} play={onPlay} next={next}>
      <div className="dl-now-route"><div className="dl-now-stops" ref={ref} style={{ '--dl-cols': cols }} role="img" aria-label={'The run has ' + rooms + ' rooms, none entered yet'}>{dlEmptyStops(rooms).map((st, i) => (
        <div key={st.i} className={'dl-now-stop' + (i % cols === 0 ? ' is-row-start' : '') + (i % cols === cols - 1 || i === rooms - 1 ? ' is-row-end' : '')}>
          <span className="dvA2-head"><span className="dv2-num">{st.num}</span></span><DlEmptyHex /></div>))}</div></div>
    </LbNowCard>);
};
export const DlNow = ({ s: wk, label, sids = ['delve', 'delve-live'], next = 'Next run: ' + DV_NEXT, pass }) => {
  const gs = useGs(); const sid = wk.end ? gsEdPick('delve', gs) || sids[0] : gsLiveSid(sids[1], gs); const s = GS_SESSIONS[sid]; const m = React.useMemo(() => dlBuild(s), [s]);
  const open = (roll) => gs.go('session', roll ? { id: sid, roll } : { id: sid });
  const result = m.end === 'live' ? { kind: 'live', label: 'In progress' } : { kind: m.end === 'won' ? 'ok' : 'bad', label: dlWord(m) };
  return (
    <LbNowCard gid="delve" className="dl-now" label={label} title={wk.title} result={result} open={() => open()} next={next} pass={pass}>
      <div className="dl-now-route"><DlNowRoute m={m} open={open} /></div>
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
GS_SESSIONS['delve-fallen'] = { ...GS_SESSIONS.delve, loss: true, end: 'fallen', result: 'Fell in the warren', reached: 'Fell in the warren', share: 'Fell in the warren', shareLines: null, threat: 7,
  sheet: { used: { 'Shield bash': 2 }, insp: false }, lines: [
  ['Wisdom', 'Search the lock-keeper\'s niche', 'Success', 'd20 14 + 0 = 14 vs 12'], ['Room', 'Entered the chime run'],
  ['Strength', 'Miss', 'd20 3 + 3 = 6 vs 12', 'Struck back: d20 15 vs 10, hit, 4 damage, HP 19/23'], ['Strength', 'Hit', 'd20 10 + 3 = 13 vs 12', 'Struck back: d20 14 vs 10, hit, 2 damage, HP 17/23'], ['Strength', 'Hit', 'd20 17 + 3 = 20 vs 12'],
  ['Room', 'Entered the warren'], ['Turn', 'The turncoat joins', GS_DV_TURNCOAT],
  ['Strength', 'Miss', 'd20 3 + 3 = 6 vs 12', 'Struck back: d20 17 vs 10, hit, 5 damage, HP 12/23'], ['Strength', 'Hit', 'd20 9 + 3 = 12 vs 12', 'Struck back: d20 15 vs 10, hit, 4 damage, HP 8/23'], ['Strength', 'Miss', 'Natural 1', 'd20 1 + 3 = 4 vs 12', 'Struck back: d20 16 vs 10, hit, 5 damage, HP 3/23'],
  ['Strength', 'Hit', 'd20 15 + 3 = 18 vs 12', 'Struck back: d20 4 vs 10, missed'], ['Strength', 'Miss', 'd20 7 + 3 = 10 vs 12', 'Struck back: d20 18 vs 10, hit, 3 damage, HP 0/23']] };
GS_SESSIONS['delve-hard'] = { ...GS_SESSIONS.delve, loss: true, end: 'overrun', result: 'Too late: the ritual was completed', reached: 'Too late: the ritual was completed', share: 'Too late: the ritual was completed', shareLines: null,
  hero: 'Wren the Rogue', hpMax: 21, threat: 12, foeMax: { 'the shrine cavern': 5 }, sheet: { used: { 'Sneak attack': 1 }, insp: false }, lines: [
  ['Wisdom', 'Search the lock-keeper\'s niche', 'Failure', 'Natural 1', 'd20 1 + 0 = 1 vs 12', 'HP 20/21'], ['Room', 'Entered the chime run'],
  ['Dexterity', 'Miss', 'd20 8 + 3 = 11 vs 12', 'Struck back: d20 14 vs 14, hit, 1 damage, HP 19/21'], ['Dexterity', 'Hit', 'd20 9 + 3 = 12 vs 12', 'Struck back: d20 7 vs 14, missed'], ['Dexterity', 'Hit', 'd20 16 + 3 = 19 vs 12'],
  ['Room', 'Entered the warren'], ['Turn', 'The turncoat joins', GS_DV_TURNCOAT],
  ['Dexterity', 'Hit', 'd20 14 + 3 = 17 vs 12', 'Struck back: d20 6 vs 14, missed'], ['Dexterity', 'Hit', 'd20s 6 and 15, kept 15 + 3 = 18 vs 12', 'Struck back: d20 11 vs 14, missed'], ['Dexterity', 'Miss', 'd20s 4 and 2, kept 4 + 3 = 7 vs 12', 'Struck back: d20 15 vs 14, hit, 3 damage, HP 16/21'],
  ['Dexterity', 'Hit', 'd20 9 + 3 = 12 vs 12', 'Struck back: d20 4 vs 14, missed'], ['Dexterity', 'Hit', 'd20 15 + 3 = 18 vs 12'],
  ['Room', 'Doubled back to the chime run', 'The ritual +1'], ['Intelligence', 'Read the chime wires', 'Partial success', 'd20 13 + 1 = 14 vs 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'], ['Room', 'Entered Snaggle\'s den'],
  ['Dexterity', 'Miss', 'd20 7 + 3 = 10 vs 12', 'Struck back: d20 13 vs 14, missed'], ['Dexterity', 'Hit', 'Natural 20', 'd20 20 + 3 = 23 vs 12', 'Struck back: d20 8 vs 14, missed'], ['Dexterity', 'Hit', 'd20s 12 and 3, kept 12 + 3 = 15 vs 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'],
  ['Room', 'Doubled back to Snaggle\'s den', 'The ritual +1'], ['Wisdom', 'Listen at the den door', 'Success', 'd20 13 + 1 = 14 vs 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'],
  ['Strength', 'Force the bone gate', 'Failure', 'd20 6 + 0 = 6 vs 12'], ['Strength', 'Force the bone gate', 'Failure', 'd20 11 + 0 = 11 vs 12'], ['Strength', 'Force the bone gate', 'Success', 'd20 14 + 0 = 14 vs 12'],
  ['Lock', 'Forced the bone gate'],
  ['Room', 'Doubled back to the chime run', 'The ritual +1'], ['Dexterity', 'Slip past the chime wires', 'Success', 'd20 15 + 3 = 18 vs 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'], ['Room', 'Entered the shrine cavern'],
  ['Dexterity', 'Hit', 'd20 10 + 3 = 13 vs 12', 'Struck back: d20 16 vs 14, hit, 2 damage, HP 14/21'], ['Dexterity', 'Hit', 'd20 17 + 3 = 20 vs 12', 'Struck back: d20 6 vs 14, missed'], ['Dexterity', 'Hit', 'd20 18 + 3 = 21 vs 12', 'Struck back: d20 9 vs 14, missed'],
  ['Dexterity', 'Miss', 'd20s 5 and 7, kept 7 + 3 = 10 vs 12', 'Struck back: d20 17 vs 14, hit, 1 damage, HP 13/21'], ['Dexterity', 'Hit', 'd20 11 + 3 = 14 vs 12', 'Struck back: d20 12 vs 14, missed'], ['Dexterity', 'Miss', 'd20 8 + 3 = 11 vs 12', 'Struck back: d20 16 vs 14, hit, 1 damage, HP 12/21']] };
}
