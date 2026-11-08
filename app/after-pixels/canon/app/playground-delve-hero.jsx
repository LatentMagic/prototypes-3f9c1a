// ============================================================================
// PLAYGROUND, not canon (branch candidate/delve-hero-sheet): Delve's hero sheet showing every fact the spec gives a hero. Beside
// the sheet's hit points, threat, stats, pack, abilities and advantage it adds the defence, the archetype's armour, the heavy
// attack, the ultimate and the spotlight. Wide: every fact open in the one row. Narrow: hit points, threat and stats stay on show,
// and Pack, Abilities and the fight group are Escape-style cards (app/gs-escape-sheet.jsx) that each open a fold, one at a time.
// Open with ?pg=delve-hero. To remove it: delete this file and playground-delve-hero.css, their lines in main.jsx and canon.css,
// and the `export` keywords added in gs-delve.jsx (DlCard, DlBox, DlUses, DlInsp, DlHex, DlCell, DlGrp, DL_G, DL_CARRY).
// ============================================================================
import React from 'react';
import { DS, useGs } from './gs-data.jsx';
import { GsMoves } from './gs-session.jsx';
import { DlCard, DlGrp, DlCell, DlBox, DlUses, DlInsp, DlHex, DlMeter, dlBuild, dlSheet } from './gs-delve.jsx';
import { EsxFold } from './gs-escape-sheet.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_SESSION_BODY } from './registry.js';

// ---- SAMPLE facts, invented to delve.md's words. The numbers are the deployed archetypes' (fighter: defence 10, protection 2 a
// fight, heavy attack needs 14 for 7, ultimate 8; rogue: 14, 1, 13 for 6, 8). The names are made up; the spec has the setting name
// the heavy attack, the ultimate and the spotlight. ----
const PDH_HEROES = {
  'Bryn the Fighter': { defence: 10, armour: 2, heavy: { name: 'Cleave', needs: 14, dmg: 7 }, ultimate: { name: 'Rending blow', dmg: 8 }, spot: 'Lockpicks' },
  'Wren the Rogue': { defence: 14, armour: 1, heavy: { name: 'Low blow', needs: 13, dmg: 6 }, ultimate: { name: 'Killing stroke', dmg: 8 }, spot: 'Grappling hook' },
};
// The fight group's name: three from tabletop sheets (a Combat block, a Battle block, a Defences block).
const PDH_FIGHT_NAMES = { combat: 'Combat', battle: 'Battle', defences: 'Defences' };
const PDH_WIDE = 780;

// One model both layouts read: the groups, each with its cells (the wide row) and its rows (the folds).
const pdhModel = (s, c) => {
  const x = PDH_HEROES[s.hero] || PDH_HEROES['Wren the Rogue']; const used = (s.sheet || {}).used || {};
  const ult = { name: x.ultimate.name, kind: 'Ultimate', of: 1, left: used[x.ultimate.name] ? 0 : 1, does: 'One sure blow a run, no roll, ' + x.ultimate.dmg + ' damage. Fights only.' };
  const abilities = [...c.abilities.map((a) => ({ ...a, kind: 'Ability' })), ult];
  const slots = Math.max(c.carry, c.gear.length);
  const fight = [
    { key: 'def', label: 'Defence', fig: <span className="dv8-num">{x.defence}</span>, text: 'A foe’s d20 must reach ' + x.defence + ' to hit you.' },
    { key: 'arm', label: 'Armour', fig: <span className="dv8-num">{x.armour}</span>, text: 'Takes ' + x.armour + ' damage off blows each fight, full again at the next.' },
    { key: 'heavy', label: x.heavy.name, kind: 'Heavy attack', fig: <span className="dv8-num">{x.heavy.needs}</span>, text: 'Needs ' + x.heavy.needs + ' to hit, ' + x.heavy.dmg + ' damage. A miss leaves you open.' },
    { key: 'spot', label: 'Spotlight', fig: <DlBox k="key" />, text: x.spot + ': an option only ' + c.name + ' can try.' },
  ];
  return { abilities, fight, slots, def: x.defence,
    packN: c.gear.length, packOf: slots, usesLeft: abilities.reduce((n, a) => n + a.left, 0), usesOf: abilities.reduce((n, a) => n + a.of, 0) };
};

// ---- Wide: every fact in a cell, as canon's cells are. A named thing carries what it is (Heavy attack, Ultimate) under its name. ----
const PdhLabel = ({ name, kind }) => (kind ? <>{name}<small className="pdh-kind">{kind}</small></> : name);
const PdhOpen = ({ c, m, streak, head }) => (<>
  <DlGrp k="dv8-pack pdh-og pdh-more" head="Pack">{Array.from({ length: m.slots }, (_, i) => c.gear[i] || null).map((g, i) => (g
    ? <DlCell key={g.name} label={g.name} used={g.state === 'used'} title={g.name + ' · ' + g.label}><DlBox k={g.kind} state={g.state} />{g.kind === 'armour' && <i className="dv7-arm" aria-label="Armour plus 1">+1</i>}</DlCell>
    : <DlCell key={'free' + i} label="Free" used title="Room for one more"><DlBox k={null} /></DlCell>))}</DlGrp>
  <DlGrp k="is-r pdh-og pdh-more" head="Abilities">{m.abilities.map((a) => <DlCell key={a.name} label={<PdhLabel name={a.name} kind={a.kind === 'Ultimate' ? 'Ultimate' : null} />} used={!a.left} title={a.left + ' of ' + a.of + ' left. ' + a.does}><DlUses left={a.left} of={a.of} /></DlCell>)}</DlGrp>
  <DlGrp k="dv8-adv pdh-og pdh-fight pdh-more" head={head}>{m.fight.map((f) => <DlCell key={f.key} label={<PdhLabel name={f.label} kind={f.kind} />} title={f.text}>{f.fig}</DlCell>)}</DlGrp>
  <DlGrp k="dv8-adv pdh-more" head="Advantage"><DlCell label="Inspiration" used={!c.insp} title={c.insp ? 'Ready' : 'Spent'}><DlInsp on={c.insp} /></DlCell>
    <DlCell label="Streak" title="Strong hits in a row"><span className="dv8-num">{streak}</span></DlCell></DlGrp>
</>);

// ---- Narrow: Escape's mechanism. A card per group (its name and a numeral); a tap opens the group's rows in a fold under the cards,
// one group at a time, and a second tap shuts it. ----
const PdhRow = ({ fig, name, kind, tag, text }) => (<div className="pdh-row">
  <span className="pdh-fig">{fig}</span>
  <div className="pdh-tx"><p className="pdh-nm"><b>{name}</b>{kind && <span>{kind}</span>}{tag && <span>{tag}</span>}</p><p className="pdh-does">{text}</p></div>
</div>);
const pdhGroups = (c, m, head) => {
  const free = m.slots - c.gear.length;
  return [
    { key: 'pack', head: 'Pack', n: m.packN, of: m.packOf, say: m.packN + ' of ' + m.packOf + ' carried',
      rows: [...c.gear.map((g) => ({ key: g.name, fig: <DlBox k={g.kind} state={g.state} />, name: g.name, tag: g.label, text: g.does })),
        ...(free > 0 ? [{ key: 'free', fig: <DlBox k={null} />, name: 'Free', text: 'Room for ' + (free === 1 ? 'one more' : free + ' more') + '.' }] : [])] },
    { key: 'abilities', head: 'Abilities', n: m.usesLeft, of: m.usesOf, say: m.usesLeft + ' of ' + m.usesOf + ' uses left',
      rows: m.abilities.map((a) => ({ key: a.name, fig: <DlUses left={a.left} of={a.of} />, name: a.name, kind: a.kind === 'Ultimate' ? 'Ultimate' : null, tag: a.left + ' of ' + a.of + ' left', text: a.does })) },
    { key: 'fight', head, n: m.def, say: 'defence ' + m.def,
      rows: m.fight.map((f) => ({ key: f.key, fig: f.fig, name: f.label, kind: f.kind, text: f.text })) },
  ];
};
const PdhTap = ({ groups, openKey }) => {
  const [open, setOpen] = React.useState(openKey);
  React.useEffect(() => { setOpen(openKey); }, [openKey]);
  const grp = groups.find((g) => g.key === open);
  return (<div className="pdh-tap">
    <div className="esx-cards">{groups.map((g) => (
      <button key={g.key} type="button" className={'esx-card' + (open === g.key ? ' is-open' : '')} aria-expanded={open === g.key} aria-label={g.head + ', ' + g.say} onClick={() => setOpen(open === g.key ? null : g.key)}>
        <span className="esx-hole" aria-hidden="true" />
        <span className="esx-cl1"><span>{g.head}</span></span>
        <b className="esx-num">{g.n}{g.of != null && <i>{'/' + g.of}</i>}</b>
      </button>))}</div>
    <EsxFold open={!!grp}>{grp && <div key={grp.key} className="pdh-rows esx-in" role="group" aria-label={grp.head}>{grp.rows.map((r) => <PdhRow key={r.key} {...r} />)}</div>}</EsxFold>
  </div>);
};

// The sheet. KEEP: below 1040px the open row breaks after the stats into two rows, so nothing clips or scrolls sideways. "auto" opens every fact at a sheet whose content is 780px wide or more (the two-row layout needs about 800px) and shows the cards under that.
const PdhSheet = ({ c, s, streak }) => {
  const layout = usePgSetting('layout'); const head = PDH_FIGHT_NAMES[usePgSetting('fightname')]; const openKey = usePgSetting('open');
  const ref = React.useRef(null); const [w, setW] = React.useState(null);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return undefined; const ro = new ResizeObserver((es) => setW(es[0].contentRect.width)); ro.observe(el); return () => ro.disconnect(); }, []);
  const mode = layout === 'auto' ? (w != null && w < PDH_WIDE ? 'cards' : 'open') : layout;
  const m = React.useMemo(() => pdhModel(s, c), [s, c]);
  const [shut, setShut] = React.useState(openKey === 'none');
  React.useEffect(() => { if (openKey !== 'none') setShut(false); }, [openKey]);
  const stats = <DlGrp k="dv8-stats pdh-stats pdh-more" head="Stats">{c.stats.map((x) => <DlCell key={x.k} label={x.ab} title={x.k}><DlHex x={x} /></DlCell>)}</DlGrp>;
  const meters = <div className="dv7-grp dv8-meters"><DlMeter label="Hit points" n={c.hp} of={c.hpMax} /><DlMeter label="Threat" n={c.threat} of={c.threatMax} /></div>;
  // KEEP: the sheet starts folded to the hero and the meters, at every width, and the chevron (top right) opens the rest, as canon's phone sheet does.
  const tog = <button type="button" className="pdh-tog" aria-expanded={!shut} aria-label={shut ? 'Show the whole character sheet' : 'Fold the character sheet'} onClick={() => setShut((x) => !x)}><DS.Icon name="next" size={20} /></button>;
  return (<section ref={ref} className={'dv4 dv5 is-tight dv7 is-band pdh pdh-' + mode + (shut ? ' is-shut' : '') + (mode === 'open' ? ' fold-none dv8 is-3b' : '')} aria-label="Character sheet">
    {tog}
    {mode === 'open'
      ? <div className="dv8-rows"><div className="dv7-band">
        <div className="dv7-grp is-hero"><p className="dv7-hero"><b>{c.name}</b><span>{c.cls}</span></p></div>
        {meters}{stats}<i className="pdh-break pdh-more" aria-hidden="true" /><PdhOpen c={c} m={m} streak={streak} head={head} />
      </div></div>
      : <div className="pdh-stack">
        <p className="pdh-hero"><b>{c.name}</b><span>{c.cls}</span></p>
        {meters}
        <div className="pdh-more">
          <div className="pdh-pair">{stats}
            <DlGrp k="dv8-adv pdh-adv" head="Advantage"><DlCell label="Inspiration" used={!c.insp} title={c.insp ? 'Ready' : 'Spent'}><DlInsp on={c.insp} /></DlCell>
              <DlCell label="Streak" title="Strong hits in a row"><span className="dv8-num">{streak}</span></DlCell></DlGrp></div>
          <PdhTap groups={pdhGroups(c, m, head)} openKey={openKey === 'none' ? null : openKey} />
        </div>
      </div>}
  </section>);
};

// KEEP: under ?pg=delve-hero Delve's session body is canon's with this sheet in place of canon's.
const PdhBody = ({ s }) => {
  const gs = useGs();
  const m = React.useMemo(() => dlBuild(s), [s]); const c = React.useMemo(() => dlSheet(s, m), [s, m]);
  return (<>
    <div className="dv4-lay"><PdhSheet c={c} s={s} streak={m.run} /><DlCard s={s} m={m} roll={gs.route && gs.route.roll} /></div>
    <GsMoves s={s} />
  </>);
};

export const initPlaygroundDelveHero = () => {
  pgRegister('delve-hero', { title: 'Delve hero sheet', settings: [
    { key: 'layout', kind: 'concept', label: 'Layout', options: [
      { value: 'auto', label: 'By width: open on desktop, cards on a phone', state: 'session-delve' },
      { value: 'open', label: 'Everything open', state: 'session-delve' },
      { value: 'cards', label: 'Tap cards', state: 'session-delve' }] },
    { key: 'fightname', label: 'Fight group name', options: [
      { value: 'combat', label: 'Combat' }, { value: 'battle', label: 'Battle' }, { value: 'defences', label: 'Defences' }] },
    { key: 'open', label: 'Open group (tap cards)', options: [
      { value: 'none', label: 'None' }, { value: 'pack', label: 'Pack' }, { value: 'abilities', label: 'Abilities' }, { value: 'fight', label: 'Fight group' }] },
  ] });
  if (!pgActive()) return;
  GS_SESSION_BODY.delve = PdhBody;
};
