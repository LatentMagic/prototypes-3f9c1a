// ============================================================================
// After Pixels — Delve's session page (1236): under the store's quiet head, the 3B character sheet, then the run card
// (the result as 3 · Band, the route of rooms and rolls, the held roll), then Every move collapsed. Built from the
// playgrounds delve-v3 to delve-v9 (owner, 2026-10-29: "integrate this"). Styles: app/gs-delve.css.
// Reads the run's record (GS_SESSIONS.delve and its copies in app/gs-data.jsx). Loads after app/gs-word.jsx.
// The hero sheets (stats, abilities, starting gear) and the carry limit are SAMPLE, invented to delve.md's words.
// ============================================================================

// SAMPLE: the stats a check adds are read from the records (Bryn Str +3, Dex +1, Wis 0; Wren Dex +3, Int +1, Wis +1, Str 0);
// Con and Cha, the abilities and the starting gear are invented. The Warren's carry limit is three.
import React from 'react';
import { DS, useGs, GS_SESSIONS, GS_DV_TURNCOAT, gsEdPick } from './gs-data.jsx';
import { GsMoves } from './gs-session.jsx';
import { LbNowCard } from './gs-library.jsx';
import { DV_NEXT } from './gs-delve-library.jsx';
import { GS_SESSION_BODY, GS_SESSION_QUIET } from './registry.js';

const DL_CARRY = 3;
const DL_HEROES = {
  'Bryn the Fighter': { name: 'Bryn', cls: 'Fighter', stats: { Strength: 3, Dexterity: 1, Constitution: 2, Intelligence: 0, Wisdom: 0, Charisma: -1 },
    abilities: [{ name: 'Shield bash', of: 2, does: 'Strikes at once, no roll' }],
    gear: [{ name: 'Chain shirt', kind: 'armour', does: 'Every hit on you costs one less' }, { name: 'Pepper pouch', kind: 'once', does: 'Flung in a face, it blinds for a blow' }] },
  'Wren the Rogue': { name: 'Wren', cls: 'Rogue', stats: { Strength: 0, Dexterity: 3, Constitution: 0, Intelligence: 1, Wisdom: 1, Charisma: 2 },
    abilities: [{ name: 'Backstab', of: 2, does: 'Strikes from behind at once, no roll' }],
    gear: [{ name: 'Leather coat', kind: 'armour', does: 'Every hit on you costs one less' }, { name: 'Smoke pellet', kind: 'once', does: 'Burst underfoot, it hides you for a breath' }] },
};
const DL_GEAR_DOES = { 'Iron key': 'Opens the lock it fits' };

// ---- The model: the record's lines read into the rooms stood in (going back included), the rolls and the gear. ----
const DL_TIER = { strong: 'Strong hit', weak: 'Weak hit', miss: 'Miss' };
// A roll's line: [stat, the action if it was an option, its grade, "Natural 20" or "Natural 1", "Rolled 14 + 3 = 17 against DC 12", "HP 9/13"].
// A foe roll grades Strong hit, Weak hit or Miss; an option roll Success, Partial success or Failure (delve.md).
const DL_GRADE = /^(Strong hit|Weak hit|Miss|Success|Partial success|Failure)$/;
const dlRoll = (l) => {
  const parts = l.slice(1).map(String); const t = parts.join(' · ');
  const m = /Rolled (?:(\d+), the higher of (\d+) and (\d+), |(\d+) )\+ (-?\d+) = (-?\d+) against DC (\d+)/.exec(t); if (!m) return null;
  const kept = +(m[1] || m[4]); const two = m[1] != null; const other = two ? (+m[2] === kept ? +m[3] : +m[2]) : null;
  const crit = /Natural 20/.test(t); const fumble = /Natural 1\b/.test(t);
  const tier = fumble ? 'miss' : /Weak hit|Partial success/.test(t) ? 'weak' : /\bMiss\b|Failure/.test(t) ? 'miss' : (/Strong hit|\bSuccess\b/.test(t) || crit) ? 'strong' : 'miss';
  const hp = /HP\s+(\d+)\/(\d+)/.exec(t);
  return { stat: l[0], kept, other, mod: +m[5], total: +m[6], dc: +m[7], gap: +m[6] - +m[7], tier, crit, fumble, two, hp: hp ? +hp[1] : null, action: DL_GRADE.test(parts[0]) ? '' : parts[0] };
};
const DL_END = { won: 'The winning blow', fallen: 'The last blow', overrun: 'The last roll', live: 'Latest roll', ended: 'Last roll played' };
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
  const stops = []; const rolls = []; const order = []; let cur = null; let hp = s.hpMax;
  const open = (name, back) => { name = name && dlCap(name); const key = name || '_first'; if (!order.includes(key)) order.push(key);
    cur = { i: stops.length, key, name: name || 'First room', back, num: order.indexOf(key) + 1, rolls: [] }; stops.push(cur); };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Room') { const p = String(l[1]); open(p.replace(/^(Entered|Doubled back to) /, ''), /^Doubled back to /.test(p)); return; }
    if (!cur) open(null, false);
    const r = dlRoll(l); if (!r) return;
    r.n = rolls.length + 1; r.stop = cur.i; r.room = cur.name; r.back = cur.back;
    r.harm = r.hp != null ? Math.max(0, hp - r.hp) : 0; if (r.hp != null) hp = r.hp;
    rolls.push(r); cur.rolls.push(r);
  });
  let run = 0; rolls.forEach((r) => { run = r.tier === 'strong' ? run + 1 : 0; });
  const end = s.unfinished ? 'ended' : s.live ? 'live' : s.end;
  const moments = dlMoments(rolls, end);
  return { stops, rolls, hp, run, end, mom: Object.fromEntries(moments.map((x) => [x.r.n, x])) };
};
const dlSay = (r) => 'Roll ' + r.n + ', ' + r.room + ': ' + (r.action ? r.action + ', ' : '') + r.stat + ' ' + r.total + ' against ' + r.dc + ', ' + DL_TIER[r.tier].toLowerCase() + (r.crit ? ', natural 20' : r.fumble ? ', natural 1' : '') + (r.two ? ', two dice, the higher kept' : '');

// ---- The die: strong filled green, weak filled yellow, miss empty, natural 20 rimmed, natural 1 red-edged. ----
const DL_HEX = '18,0 36,10 36,30 18,40 0,30 0,10'; const DL_RIM = '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8';
const DlDie = ({ r, size = 36, sel }) => (
  <svg className={'dv2-die is-' + r.tier + (r.crit ? ' is-crit' : '') + (r.fumble ? ' is-fumble' : '') + (sel ? ' is-sel' : '')} viewBox="-5 -5 46 50" width={size} height={Math.round(size * 50 / 46)} aria-hidden="true">
    {/* KEEP: on a natural 20 the hex behind moves out past the rim, so the two lines never run together. */}
    {/* KEEP: selected, a two-dice die stands alone (the hex behind is hidden), so nothing crosses the selection ring (owner, 2026-10-29). */}
    {r.two && size < 64 && !sel && <polygon className="gh" points={DL_HEX} transform={r.crit ? 'translate(-7 -6.5)' : 'translate(-3.5 -3)'} />}
    <polygon className="hx" points={DL_HEX} />
    {r.crit && <polygon className="rim" points={DL_RIM} />}
    <text className="nm" x="18" y="20.5">{r.kept}</text>
    {r.two && size >= 64 && <g className="tw" transform="translate(25 28) scale(.42)"><polygon points={DL_HEX} /><text x="18" y="21">{r.other}</text></g>}
    <polygon className="sl" points={DL_RIM} />
  </svg>);
const DlDieBtn = ({ r, size, act, on }) => (
  <button type="button" className="dv2-dbtn" aria-pressed={act === r.n} aria-label={dlSay(r)} onClick={() => on.sel(r.n)} onMouseEnter={() => on.hov(r.n)} onMouseLeave={() => on.hov(null)}>
    <DlDie r={r} size={size} sel={act === r.n} />
  </button>);

// ---- The result statement, 3 · Band (owner, 2026-10-29): the ending word, a hairline, the setting's line. No tally. ----
const dlWord = (m) => ({ live: 'In progress', ended: 'Unfinished', fallen: 'Fallen', won: 'Triumphed', overrun: 'Overwhelmed' }[m.end]);
const dlTone = (m) => (m.end === 'won' ? 'ok' : m.end === 'live' ? 'live' : 'bad');
const DlResult = ({ s, m }) => { const line = m.end === 'live' ? null : m.end === 'ended' ? 'The week ended first' : s.result;
  return (<div className="dv7r-band"><h2 className={'dv7r-word is-' + dlTone(m)}>{dlWord(m)}</h2>{line && <p className="dv7r-line">{line}</p>}</div>); };

// ---- The held roll: the die large, its kicker, then a labelled row per fact. The two-dice row is left out: the die shows both. ----
// KEEP: a key moment's held box carries an off-white diamond in its top right corner; the route's dice are never marked (owner, 2026-10-28).
const DlHeld = ({ m, act }) => { const r = act ? m.rolls[act - 1] : null; if (!r) return null;
  const x = m.mom[r.n]; const tcls = r.fumble ? 'fumble' : r.tier;
  return (<div className="dv3-live" aria-live="polite"><div className={'dv3-held is-ledger' + (x ? ' is-mo' : '')}>{x && <i className="dv3-mk" role="img" aria-label="Key moment" />}
    <div className="dv3-lh"><DlDie r={r} size={72} /><div className="dv3-lht"><div className="dv3-hk"><p className="dv3-k">{x ? x.kicker : 'Roll ' + r.n}</p>{x && <p className="dv3-n">Roll {r.n}</p>}</div></div></div>
    <dl className="dv3-dl">
      <div><dt>Room</dt><dd>{(r.back ? 'Back in ' : '') + r.room}</dd></div>
      {r.action && <div><dt>Action</dt><dd>{r.action}</dd></div>}
      <div><dt>Roll</dt><dd>{r.stat} {r.total} <span>vs {r.dc}</span></dd></div>
      <div><dt>Outcome</dt><dd className={'is-' + tcls}>{DL_TIER[r.tier]}</dd></div>
      {r.harm > 0 && <div><dt>Cost</dt><dd>Lost {r.harm} HP</dd></div>}
    </dl>
  </div></div>); };

// ---- The route: a column per room stood in, a rule between rooms; a key moment's die is drawn large. The held roll beside it. ----
const DlStopHead = ({ st, named }) => (
  <span className="dvA2-head" aria-label={(st.back ? 'Back to ' : 'Room ' + st.num + ', ') + st.name}>
    <span className={'dv2-num' + (st.back ? ' is-back' : '')}>{st.back && <i aria-hidden="true">↩</i>}{st.num}</span>{named && <span className="dv2-sname">{st.name}</span>}</span>);
const DlRoute = ({ m, act, on }) => { const sel = act ? m.rolls[act - 1].stop : null;
  return (<div className="dvE-main">
    <div className="dvA2-route is-e is-cols-between" aria-label="The way you went">{m.stops.map((st) => (
      <div key={st.i} className={'dvA2-stop' + (sel === st.i ? ' is-on' : '')}>
        <DlStopHead st={st} named />
        <div className="dvA2-dice">{st.rolls.length ? st.rolls.map((r) => (m.mom[r.n]
          ? <span key={r.n} className="dvE-mom"><DlDieBtn r={r} act={act} on={on} size={52} /></span>
          : <DlDieBtn key={r.n} r={r} act={act} on={on} size={30} />)) : <i className="dv2-pass" aria-label="No rolls" />}</div>
      </div>))}</div>
    <div className="dvE-side"><DlHeld m={m} act={act} /></div>
  </div>); };
// KEEP: hover lights a roll and fills the held roll; a press holds it; it opens on the roll the route names (a die pressed on the
// now card), else the last roll.
const DlCard = ({ s, m, roll }) => {
  const [sel, setSel] = React.useState(() => (roll && m.rolls[roll - 1] ? roll : m.rolls.length ? m.rolls.length : null)); const [hov, setHov] = React.useState(null);
  const act = hov || sel;
  return (<section className="dv2 dv7r is-3" aria-label="How the run went"><DlResult s={s} m={m} /><DlRoute m={m} act={act} on={{ sel: setSel, hov: setHov }} /></section>);
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
    stats: Object.entries(h.stats).map(([k, n]) => ({ k, ab: k.slice(0, 3).toUpperCase(), say: (n < 0 ? '−' : '+') + Math.abs(n) })) };
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
const DlGrp = ({ k, head, children }) => <div className={'dv7-grp' + (k ? ' ' + k : '')}><div className="dv7-h"><span>{head}</span></div><div className="dv7-cells">{children}</div></div>;
// KEEP: a meter's count is written 9/13, the short form, so the meters' column stays narrow (owner, 2026-10-29).
const DlMeter = ({ label, n, of }) => (<div className="dv6-bar"><span>{label}</span><DS.ProgressBar label={label} value={n} max={of} showValue={false} /><small>{n + '/' + of}</small></div>);

// 3B (owner, 2026-10-29): one row on desktop. The hero; hit points and threat stacked on one grid; stats; the pack with its free slots;
// abilities; Advantage (inspiration and the current run of strong hits). The torch, clues and the bargain join this row once the
// record holds them. On a phone the sheet opens folded to the hero and the meters; the whole hero row opens the rest.
const DlSheet = ({ c, streak }) => { const [open, setOpen] = React.useState(false);
  const slots = Array.from({ length: Math.max(c.carry, c.gear.length) }, (_, i) => c.gear[i] || null);
  return (<section className={'dv4 dv5 is-tight dv7 is-band fold-none dv8 is-3b' + (open ? '' : ' is-shut')} aria-label="Character sheet"><div className="dv8-rows"><div className="dv7-band">
    <div className="dv7-grp is-hero"><p className="dv7-hero"><b>{c.name}</b><span>{c.cls}</span></p></div>
    {/* Shown on a phone card only. */}
    <button type="button" className="dv8-tog" aria-expanded={open} aria-label={open ? 'Fold the character sheet' : 'Show the whole character sheet'} onClick={() => setOpen((o) => !o)}><DS.Icon name="next" size={20} /></button>
    <div className="dv7-grp dv8-meters"><DlMeter label="Hit points" n={c.hp} of={c.hpMax} /><DlMeter label="Threat" n={c.threat} of={c.threatMax} /></div>
    <DlGrp k="dv8-stats" head="Stats">{c.stats.map((x) => <DlCell key={x.k} label={x.ab} title={x.k}><DlHex x={x} /></DlCell>)}</DlGrp>
    {/* KEEP: the pack shows its room as empty Free slots, so it needs no count. */}
    <DlGrp k="dv8-pack" head="Pack">{slots.map((g, i) => (g ? <DlCell key={g.name} label={g.name} used={g.state === 'used'} title={g.name + ' · ' + g.label}><DlBox k={g.kind} state={g.state} />{g.kind === 'armour' && <i className="dv7-arm" aria-label="Armour plus 1">+1</i>}</DlCell>
      : <DlCell key={'free' + i} label="Free" used title="Room for one more"><DlBox k={null} /></DlCell>))}</DlGrp>
    {/* is-r marks the second group of a phone pair (pack | abilities), which takes a hairline on its left. */}
    <DlGrp k="is-r" head={c.abilities.length > 1 ? 'Abilities' : 'Ability'}>{c.abilities.map((a) => <DlCell key={a.name} label={a.name} used={!a.left} title={a.left + ' of ' + a.of + ' left. ' + a.does}><DlUses left={a.left} of={a.of} /></DlCell>)}</DlGrp>
    <DlGrp k="dv8-adv" head="Advantage"><DlCell label="Inspiration" used={!c.insp} title={c.insp ? 'Ready' : 'Spent'}><DlInsp on={c.insp} /></DlCell>
      <DlCell label="Streak" title="Strong hits in a row"><span className="dv8-num">{streak}</span></DlCell></DlGrp>
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
// Rooms wrap onto further rows when the card is too narrow for them in one, and the dice of a room wrap inside its column, so nothing overlaps.
// A free player's first run (CprFirst, app/gs-pass-library.jsx) passes its own label, its session ids, no next run, and pass.
const DL_NO_HOVER = () => {};
const DlNowRoute = ({ m, open }) => { const on = { sel: open, hov: DL_NO_HOVER };
  return (<div className="dl-now-stops" aria-label="The way you went">{m.stops.map((st) => {
    const keys = st.rolls.filter((r) => m.mom[r.n]); const rest = st.rolls.filter((r) => !m.mom[r.n]);
    return (<div key={st.i} className="dl-now-stop">
      <DlStopHead st={st} />
      {!st.rolls.length && <i className="dv2-pass" aria-label="No rolls" />}
      {keys.length > 0 && <div className="dl-now-keys">{keys.map((r) => <DlDieBtn key={r.n} r={r} act={null} on={on} size={34} />)}</div>}
      {rest.length > 0 && <span className="dl-now-marks" role="img" aria-label={rest.length + (rest.length === 1 ? ' other roll: ' : ' other rolls: ') + rest.map((r) => DL_TIER[r.tier].toLowerCase()).join(', ')}>
        {rest.map((r) => <i key={r.n} className={'dl-now-mark is-' + r.tier} />)}</span>}
    </div>);
  })}</div>);
};
export const DlNow = ({ s: wk, label, sids = ['delve', 'delve-live'], next = 'Next run: ' + DV_NEXT, pass }) => {
  const gs = useGs(); const sid = wk.end ? gsEdPick('delve', gs) || sids[0] : sids[1]; const s = GS_SESSIONS[sid]; const m = React.useMemo(() => dlBuild(s), [s]);
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
// (every room, going back three times, a natural 1 and 20, two-dice rolls, a lock forced on the third try, ended overrun). ----
GS_SESSIONS['delve-fallen'] = { ...GS_SESSIONS.delve, end: 'fallen', result: 'Fell in the warren', reached: 'Fell in the warren', share: 'Fell in the warren', shareLines: null, threat: 7,
  sheet: { used: { 'Shield bash': 2 }, insp: false }, lines: [
  ['Wisdom', 'Search the lock-keeper\'s niche', 'Success', 'Rolled 14 + 0 = 14 against DC 12'], ['Room', 'Entered the chime run'],
  ['Dexterity', 'Miss', 'Rolled 5 + 1 = 6 against DC 12', 'HP 11/13'], ['Dexterity', 'Weak hit', 'Rolled 12 + 1 = 13 against DC 12', 'HP 10/13'], ['Dexterity', 'Strong hit', 'Rolled 19 + 1 = 20 against DC 12'],
  ['Room', 'Entered the warren'], ['Turn', 'The turncoat joins', GS_DV_TURNCOAT],
  ['Strength', 'Miss', 'Rolled 3 + 3 = 6 against DC 12', 'HP 7/13'], ['Strength', 'Weak hit', 'Rolled 9 + 3 = 12 against DC 12', 'HP 5/13'], ['Strength', 'Miss', 'Natural 1', 'Rolled 1 + 3 = 4 against DC 12', 'HP 2/13'],
  ['Strength', 'Strong hit', 'Rolled 15 + 3 = 18 against DC 12'], ['Strength', 'Miss', 'Rolled 7 + 3 = 10 against DC 12', 'HP 0/13']] };
GS_SESSIONS['delve-hard'] = { ...GS_SESSIONS.delve, end: 'overrun', result: 'Too late: the ritual was completed', reached: 'Too late: the ritual was completed', share: 'Too late: the ritual was completed', shareLines: null,
  hero: 'Wren the Rogue', hpMax: 11, threat: 12, sheet: { used: { Backstab: 2 }, insp: false }, lines: [
  ['Wisdom', 'Search the lock-keeper\'s niche', 'Failure', 'Natural 1', 'Rolled 1 + 1 = 2 against DC 12', 'HP 10/11'], ['Room', 'Entered the chime run'],
  ['Dexterity', 'Miss', 'Rolled 8 + 3 = 11 against DC 12', 'HP 9/11'], ['Dexterity', 'Weak hit', 'Rolled 9 + 3 = 12 against DC 12'], ['Dexterity', 'Strong hit', 'Rolled 16 + 3 = 19 against DC 12'],
  ['Room', 'Entered the warren'], ['Turn', 'The turncoat joins', GS_DV_TURNCOAT],
  ['Dexterity', 'Strong hit', 'Rolled 14 + 3 = 17 against DC 12'], ['Dexterity', 'Strong hit', 'Rolled 15, the higher of 6 and 15, + 3 = 18 against DC 12'], ['Dexterity', 'Miss', 'Rolled 4, the higher of 4 and 2, + 3 = 7 against DC 12', 'HP 7/11'],
  ['Strength', 'Weak hit', 'Rolled 12 + 0 = 12 against DC 12', 'HP 6/11'], ['Dexterity', 'Strong hit', 'Rolled 15 + 3 = 18 against DC 12'],
  ['Room', 'Doubled back to the chime run', 'The ritual +1'], ['Intelligence', 'Read the chime wires', 'Partial success', 'Rolled 13 + 1 = 14 against DC 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'], ['Room', 'Entered Snaggle\'s den'],
  ['Dexterity', 'Miss', 'Rolled 7 + 3 = 10 against DC 12', 'HP 5/11'], ['Dexterity', 'Strong hit', 'Natural 20', 'Rolled 20 + 3 = 23 against DC 12'], ['Dexterity', 'Strong hit', 'Rolled 12, the higher of 12 and 3, + 3 = 15 against DC 12'],
  ['Room', 'Doubled back to the warren', 'The ritual +1'],
  ['Strength', 'Force the bone gate', 'Failure', 'Rolled 6 + 0 = 6 against DC 12'], ['Strength', 'Force the bone gate', 'Failure', 'Rolled 11 + 0 = 11 against DC 12'], ['Strength', 'Force the bone gate', 'Success', 'Rolled 14 + 0 = 14 against DC 12'],
  ['Lock', 'Forced the bone gate'], ['Room', 'Entered the shrine cavern'],
  ['Dexterity', 'Weak hit', 'Rolled 10 + 3 = 13 against DC 12', 'HP 3/11'], ['Dexterity', 'Strong hit', 'Rolled 17 + 3 = 20 against DC 12'], ['Dexterity', 'Strong hit', 'Rolled 18 + 3 = 21 against DC 12'],
  ['Dexterity', 'Miss', 'Rolled 7, the higher of 5 and 7, + 3 = 10 against DC 12', 'HP 2/11'], ['Dexterity', 'Weak hit', 'Rolled 11 + 3 = 14 against DC 12'], ['Dexterity', 'Miss', 'Rolled 8 + 3 = 11 against DC 12', 'HP 1/11']] };
}
