// Playground (1236, Delve v6): 1CB reworked to the owner's notes (2026-10-29), as 1E (every group centred) and 1F (every group
// left). Loaded by delve-v6.html after pg-dv-seed, pg-dv3, pg-dv4 and pg-dv5 (all with their bars off), whose sheet model, glyphs,
// session card and Pack override it reuses. Nothing in app/ changes.

const DV6_KEY = 'pg_delve-session_v6';
const DV6_CONCEPT_OPTS = [['1e', '1E · All centred'], ['1f', '1F · All left'], ['1g', '1G · Columns'], ['1h', '1H · Band']];
const DV6_WHY = {
  '1e': '1E, from 1CB. Every group\'s heading and items are centred, one rule for all. Ability has no icon: its name, use squares and count. Pack boxes carry their name under them, as the stats carry theirs, so the two rows line up. Hit points and threat are shorter, thinner bars beside the hero.',
  '1f': '1F, from 1CB. The same parts as 1E, with every group\'s heading and items left-aligned, one rule for all, the pack included.',
  '1g': '1G, Columns. Three equal columns, two rows: hero, hit points, threat on top; stats, pack, abilities under, each under the one above it. A bar is as wide as its column, so its length comes from the grid. Every column heads with its name left and its count right. Every piece below is one cell: a figure, its name under. No free slots; the pack\'s count says the room. Inspiration is a cell beside the abilities.',
  '1h': '1H, Band. One centred band of groups split by hairlines: hit points, threat, stats, pack, abilities, inspiration. Every group is a heading over cells, and every cell is a figure with one line under it, hit points and threat included (the bar, then its count). The hero is the band\'s first group, so the whole sheet is one row. A long item name wraps to two lines under its box. No free slots.',
};
// Playground-only: a five-word item name, to see how a long name sits; invented, not in delve.md.
const DV6_PACK = [...DV5_PACK, ['3l', '3 items, one long name']];
const DV6_LONG = 'Lantern of the drowned saint';
// Playground-only: a longer hero name, to see how the hero group takes it; invented.
const DV6_NAME = [['play', 'As played'], ['long', 'Longer name']];
const DV6_LONG_NAME = 'Evangeline';
const DV6_ABIL = [['play', 'As played'], ['1', '1 ability'], ['2', '2 abilities']];
// Playground-only second abilities, invented for the two-ability check; not in delve.md.
const DV6_ABIL_FILL = { Wren: { name: 'Vanish', of: 1, does: 'Slips out of sight, no roll' }, Bryn: { name: 'Second wind', of: 1, does: 'Gets back 2 hit points' } };
// How 1H folds on a phone (card under 560px); on a wider card every fold is the one-row band. M1 is 1H's phone layout (owner, 2026-10-29).
const DV6_FOLD = [['none', 'Today'], ['m1', 'M1 · Rows'], ['m2', 'M2 · Scroll'], ['m3', 'M3 · Switch']];
// KEEP: the address can pin any control (?fold=m1&bare=1), so the mobile canvas frames each fold without touching the stored choice.
const DV6_Q = Object.fromEntries(new URLSearchParams(location.search));
const dv6Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV6_KEY) || '{}'); } catch (e) {} v = { ...v, ...DV6_Q };
  const ok = (opts, x, d) => (opts.some((o) => o[0] === x) ? x : d);
  return { concept: ok(DV6_CONCEPT_OPTS, v.concept, '1e'), play: ok(DV4_PLAYS, v.play, 'live'), insp: ok(DV5_INSP, v.insp, 'play'), pack: ok(DV6_PACK, v.pack, 'play'), abil: ok(DV6_ABIL, v.abil, 'play'), name: ok(DV6_NAME, v.name, 'long'), fold: ok(DV6_FOLD, v.fold, 'm1'), why: !!v.why && !DV6_Q.bare }; };
const dv6Set = (patch) => { const n = { ...dv6Get(), ...patch }; try { localStorage.setItem(DV6_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv6')); return n; };
const useDv6 = () => { const [v, setV] = React.useState(dv6Get); React.useEffect(() => { const f = () => setV(dv6Get()); window.addEventListener('dv6', f); return () => window.removeEventListener('dv6', f); }, []); return v; };

// KEEP: a bar is one line (name, bar, count), so it is short in height but still takes its full share of the width; no dead space beside the hero.
const Dv6Bar = ({ label, n, of }) => (<div className="dv6-bar"><span>{label}</span><DS.ProgressBar label={label} value={n} max={of} showValue={false} /><small>{n} of {of}</small></div>);
// KEEP: every stat and every pack slot is one figure cell (a fixed-height figure, one label under it), so the two rows line up.
const Dv6Sheet = ({ c, align }) => (<section className={'dv4 dv5 is-tight dv6 is-' + align} aria-label="Character sheet">
  <div className="dv6-top">
    <div className="dv5-tfh"><Dv4Head /><Dv4Hero c={c} /></div>
    <Dv6Bar label="Hit points" n={c.hp} of={c.hpMax} /><Dv6Bar label="Threat" n={c.threat} of={c.threatMax} />
  </div>
  <div className="dv6-gs">
    <div className="dv6-g"><span className="dv4-lab">Stats</span>
      <dl className="dv6-row">{c.stats.map((x) => <div key={x.k} className="dv6-fig"><dt><abbr title={x.k}>{x.ab}</abbr></dt><dd><Dv5Hex x={x} size={32} /></dd></div>)}</dl></div>
    <div className="dv6-g"><span className="dv4-lab">Pack · {c.held} of {c.carry}</span>
      <div className="dv6-row">{dv5Slots(c).map((g, i) => (<div key={i} className={'dv6-fig' + (!g || g.state === 'used' ? ' is-used' : '')} title={g ? g.name + ' · ' + g.label : 'Room for one more'}>
        <Dv4Box k={g && g.kind} state={g && g.state} /><span>{g ? g.name : 'Free'}</span></div>))}</div></div>
    <div className="dv6-g"><span className="dv4-lab">{c.abilities.length > 1 ? 'Abilities' : 'Ability'}</span>
      <div className="dv6-abs">{c.abilities.map((a) => (<div key={a.name} className={'dv6-ab' + (a.left ? '' : ' is-used')} title={a.does}>
        <span>{a.name}</span><Dv4Uses left={a.left} of={a.of} /><small>{a.left} of {a.of}</small></div>))}</div></div>
    <div className="dv6-g"><span className="dv4-lab">Inspiration</span><Dv5Insp c={c} size={28} /></div>
  </div>
</section>);

// ---- 1G, 1H: every piece below the head is one cell (a 36px figure, one line under), so every label sits on one line. ----
const Dv7Cell = ({ label, used, title, children }) => (<div className={'dv7-cell' + (used ? ' is-used' : '')} title={title}><span className="dv7-fig">{children}</span><span className="dv7-lb">{label}</span></div>);
const Dv7Stats = ({ c }) => c.stats.map((x) => <Dv7Cell key={x.k} label={x.ab} title={x.k}><Dv5Hex x={x} size={32} /></Dv7Cell>);
// KEEP: no free slots; the pack's count carries the room, and an empty pack says so in the cell row's height.
const Dv7Pack = ({ c }) => (c.gear.length ? c.gear.map((g) => <Dv7Cell key={g.name} label={g.name} used={g.state === 'used'} title={g.name + ' · ' + g.label + (g.kind === 'armour' ? ' · Armour +1: every hit on you costs one less' : '')}><Dv4Box k={g.kind} state={g.state} />{g.kind === 'armour' && <i className="dv7-arm" aria-label="Armour plus 1">+1</i>}</Dv7Cell>)
  : <div className="dv7-none">Nothing carried</div>);
const Dv7Abs = ({ c }) => c.abilities.map((a) => <Dv7Cell key={a.name} label={a.name} used={!a.left} title={a.left + ' of ' + a.of + ' left. ' + a.does}><Dv4Uses left={a.left} of={a.of} /></Dv7Cell>);
const Dv7Ins = ({ c, label }) => <Dv7Cell label={label} used={!c.insp} title={c.insp ? 'Ready' : 'Spent'}><Dv5Insp c={c} size={28} /></Dv7Cell>;
// KEEP: over a bar the count sits at the bar's far end; over cells it follows the name, so it never floats away from what it counts.
const Dv7Head = ({ name, count, spread }) => <div className={'dv7-h' + (spread ? ' is-spread' : '')}><span>{name}</span>{count && <b>{count}</b>}</div>;

const Dv7Cols = ({ c }) => (<section className="dv4 dv5 is-tight dv7 is-cols" aria-label="Character sheet">
  <div className="dv7-grid">
    <div className="dv5-tfh"><Dv4Head /><Dv4Hero c={c} /></div>
    <div className="dv7-col"><Dv7Head name="Hit points" count={c.hp + ' of ' + c.hpMax} spread /><DS.ProgressBar label="Hit points" value={c.hp} max={c.hpMax} showValue={false} /></div>
    <div className="dv7-col"><Dv7Head name="Threat" count={c.threat + ' of ' + c.threatMax} spread /><DS.ProgressBar label="Threat" value={c.threat} max={c.threatMax} showValue={false} /></div>
    <hr className="dv7-rule" />
    <div className="dv7-col"><Dv7Head name="Stats" /><div className="dv7-cells"><Dv7Stats c={c} /></div></div>
    <div className="dv7-col"><Dv7Head name="Pack" count={c.held + ' of ' + c.carry} /><div className="dv7-cells"><Dv7Pack c={c} /></div></div>
    <div className="dv7-col"><Dv7Head name={c.abilities.length > 1 ? 'Abilities' : 'Ability'} /><div className="dv7-cells"><Dv7Abs c={c} /><Dv7Ins c={c} label="Inspiration" /></div></div>
  </div>
</section>);

// KEEP: M3's switch is in the markup at every width but only shows on a phone card, where it picks the one group shown under the tracks.
const DV7_TABS = [['st', 'Stats'], ['pk', 'Pack'], ['ab', 'Abilities']];
const Dv7Band = ({ c, fold = 'none' }) => { const [tab, setTab] = React.useState('st'); const [open, setOpen] = React.useState(false); // KEEP: on a phone M1 and M3 open folded to the top row (owner, 2026-10-29); a wide card never folds.
  const on = (k) => (tab === k ? ' is-on' : ''); const folds = fold === 'm1' || fold === 'm3';
  const flip = folds ? { onClick: () => setOpen((o) => !o) } : {};
  return (<section className={'dv4 dv5 is-tight dv7 is-band fold-' + fold + (open ? '' : ' is-shut')} aria-label="Character sheet">
  <div className="dv7-band">
    {/* KEEP: no "Character sheet" heading; the hero is a group like the rest, name over class, and the section keeps its label for screen readers. */}
    <div className="dv7-grp is-hero" {...flip}><p className="dv7-hero"><b>{c.name}</b><span>{c.cls}</span></p></div>
    <div className="dv7-grp is-hp" {...flip}><Dv7Head name="Hit points" /><div className="dv7-cells"><Dv7Cell label={c.hp + ' of ' + c.hpMax}><Dv5Track n={c.hp} of={c.hpMax} /></Dv7Cell></div></div>
    <div className="dv7-grp is-th" {...flip}><Dv7Head name="Threat" /><div className="dv7-cells"><Dv7Cell label={c.threat + ' of ' + c.threatMax}><Dv5Track n={c.threat} of={c.threatMax} /></Dv7Cell></div></div>
    {folds && <button type="button" className="dv7-tog" aria-expanded={open} aria-label={open ? 'Fold the character sheet' : 'Show the whole character sheet'} onClick={() => setOpen((o) => !o)}><DS.Icon name="next" size={20} /></button>}
    {fold === 'm3' && <div className="dv7-sw" role="group" aria-label="Show">{DV7_TABS.map(([k, l]) => <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</button>)}</div>}
    <div className={'dv7-grp is-st' + on('st')}><Dv7Head name="Stats" /><div className="dv7-cells"><Dv7Stats c={c} /></div></div>
    <div className={'dv7-grp is-pk' + on('pk')}><Dv7Head name={'Pack · ' + c.held + ' of ' + c.carry} /><div className="dv7-cells"><Dv7Pack c={c} /></div></div>
    <div className={'dv7-grp is-ab' + on('ab')}><Dv7Head name={c.abilities.length > 1 ? 'Abilities' : 'Ability'} /><div className="dv7-cells"><Dv7Abs c={c} /></div></div>
    <div className={'dv7-grp is-in' + on('ab')}><Dv7Head name="Inspiration" /><div className="dv7-cells"><Dv7Ins c={c} label={c.insp ? 'Ready' : 'Spent'} /></div></div>
  </div>
</section>); };

const Dv6Body = ({ s }) => {
  const v = useDv6(); const m = React.useMemo(() => dv3Build(s), [s]);
  // KEEP: the bar's Inspiration, Pack and Abilities controls override the play's own, so the fewest and the most can be seen on any play.
  const c = React.useMemo(() => { const x = dv4Sheet(s, m); if (v.insp !== 'play') x.insp = v.insp === 'on';
    if (v.pack !== 'play') { x.gear = dv5Pack(x.gear, v.pack === '3l' ? 3 : +v.pack); if (v.pack === '3l') x.gear[2] = { ...x.gear[2], name: DV6_LONG }; x.held = x.gear.filter((g) => g.state !== 'used').length; }
    if (v.abil !== 'play') { const f = DV6_ABIL_FILL[x.name]; x.abilities = x.abilities.slice(0, +v.abil);
      if (+v.abil === 2 && x.abilities.length < 2 && f) x.abilities.push({ ...f, left: f.of }); }
    if (v.name === 'long') x.name = DV6_LONG_NAME;
    return x; }, [s, m, v.insp, v.pack, v.abil, v.name]);
  return <>
    <div className="dv4-lay">{v.concept === '1g' ? <Dv7Cols c={c} /> : v.concept === '1h' ? <Dv7Band c={c} fold={v.fold} /> : <Dv6Sheet key={v.concept} c={c} align={v.concept === '1e' ? 'c' : 'l'} />}<Dv4Card s={s} m={m} /></div>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv6Body key={p.sid} {...p} /> };

const Dv6PgBar = () => {
  const v = useDv6();
  // KEEP: retries until the page has landed, since main's own mount effects can put the route back after the first go.
  const open = (play) => { let n = 0; const id = DV4_SIDS[play]; const go = () => { const g = window.gsApi; n += 1; if (n > 30) return;
    if (!g) return setTimeout(go, 300);
    if (g.view !== 'pass') { g.setView('pass'); return setTimeout(go, 300); }
    if (g.route.name !== 'session' || g.route.id !== id) { g.go('session', { id }, 'pass'); return setTimeout(go, 300); } }; setTimeout(go, 600); };
  React.useEffect(() => { open(v.play); }, []);
  const G = ({ label, opts, cur, onPick }) => (
    <div className="dv1b-grp" role="group" aria-label={label}><span className="dv1b-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="dv1b-chip" aria-pressed={cur === x} onClick={() => onPick(x)}>{l}</button>)}</div>);
  const S = ({ label, k, opts }) => (<label className="dv1b-grp"><span className="dv1b-lab">{label}</span>
    <select className="dv1b-chip" value={v[k]} onChange={(e) => dv6Set({ [k]: e.target.value })}>{opts.map(([x, l]) => <option key={x} value={x}>{l}</option>)}</select></label>);
  if (DV6_Q.bare) return null;
  return (<>
    <div className="dv1b" role="group" aria-label="Playground controls, not part of the product">
      <G label="Play" opts={DV4_PLAYS} cur={v.play} onPick={(x) => { dv6Set({ play: x }); open(x); }} />
      <G label="Concept" opts={DV6_CONCEPT_OPTS} cur={v.concept} onPick={(x) => dv6Set({ concept: x })} />
      <G label="Inspiration" opts={DV5_INSP} cur={v.insp} onPick={(x) => dv6Set({ insp: x })} />
      <S label="Pack" k="pack" opts={DV6_PACK} />
      <S label="Abilities" k="abil" opts={DV6_ABIL} />
      <S label="Name" k="name" opts={DV6_NAME} />
      <S label="Phone" k="fold" opts={DV6_FOLD} />
      <button type="button" className="dv1b-chip" aria-pressed={v.why} onClick={() => dv6Set({ why: !v.why })}>Why</button>
    </div>
    {v.why && <div className="dv1b-why"><p>{DV6_WHY[v.concept]}</p></div>}
  </>);
};
// v7 loads this file for its sheet and brings its own bar, so it sets DV6_NO_BAR first.
(() => { if (window.DV6_NO_BAR) return; const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv6PgBar />); })();
