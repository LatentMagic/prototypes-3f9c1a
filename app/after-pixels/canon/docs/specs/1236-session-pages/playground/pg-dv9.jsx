// Playground (1236): Delve v9. 3B only (owner, 2026-10-29), with config to take every optional part of the sheet to its fewest and its most.
// Built on pg-dv8's parts and delve-v8.html's 3B CSS. The torch, clues, bargain, fill items, long names and the "4/6" count form are invented.

const DV9_KEY = 'pg_delve-session_v9';
const DV9_OPTS = {
  pack: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3']],
  abil: [['1', '1'], ['2', '2'], ['3', '3']],
  barg: [['off', 'No bargain'], ['0', 'None struck'], ['1', '+1'], ['2', '+2'], ['3', '+3']],
  clues: [['off', 'Off'], ['2', '1 of 2']],
  torch: [['on', 'On'], ['off', 'Off']],
  streak: [['0', '0'], ['2', '2'], ['12', '12']],
  names: [['short', 'Short'], ['long', 'Long']],
  count: [['of', '4 of 6'], ['slash', '4/6']],
  phone: [['pair', 'Pairs, with a line'], ['rows', 'One group a row']],
};
const DV9_LABEL = { pack: 'Pack', abil: 'Abilities', barg: 'Bargain', clues: 'Clues', torch: 'Torch', streak: 'Streak', names: 'Names', count: 'Counts', phone: 'Phone' };
const DV9_DEF = { pack: '3', abil: '2', barg: '1', clues: '2', torch: 'on', streak: '2', names: 'short', count: 'of', phone: 'pair', play: 'live' };
const DV9_PRESETS = {
  fewest: { pack: '0', abil: '1', barg: 'off', clues: 'off', torch: 'off', streak: '0', names: 'short' },
  most: { pack: '3', abil: '3', barg: '3', clues: '2', torch: 'on', streak: '12', names: 'long' },
};
const DV9_Q = Object.fromEntries(new URLSearchParams(location.search));
const dv9Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV9_KEY) || '{}'); } catch (e) {} v = { ...DV9_DEF, ...v, ...DV9_Q };
  const out = { play: DV4_PLAYS.some((o) => o[0] === v.play) ? v.play : 'live' };
  Object.keys(DV9_OPTS).forEach((k) => { out[k] = DV9_OPTS[k].some((o) => o[0] === v[k]) ? v[k] : DV9_DEF[k]; }); return out; };
const dv9Set = (patch) => { const n = { ...dv9Get(), ...patch }; try { localStorage.setItem(DV9_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv9')); return n; };
const useDv9 = () => { const [v, setV] = React.useState(dv9Get); React.useEffect(() => { const f = () => setV(dv9Get()); window.addEventListener('dv9', f); return () => window.removeEventListener('dv9', f); }, []); return v; };

// Playground-only fills and long names, invented to stress the widths.
const DV9_THIRD_AB = { name: 'Sea salt', of: 1, does: 'Heals 4. From the sea witch\'s bargain.' };
const DV9_LONG = { hero: 'Wilhelmina Ashgrove-Harrow', gear: ['Flask of holy water', 'Coil of knotted rope', 'Bone whistle of the deep'], abil: ['Shadowstep strike', 'Second wind rising', 'Blessing of sea salt'] };

const dv9Count = (n, of, f) => (f === 'slash' ? n + '/' + of : n + ' of ' + of);
// The meter row as Dv6Bar, with the count form the config sets.
const Dv9Meter = ({ label, n, of, f }) => (<div className="dv6-bar"><span>{label}</span><DS.ProgressBar label={label} value={n} max={of} showValue={false} /><small>{dv9Count(n, of, f)}</small></div>);

const Dv9Sheet = ({ c, v }) => { const [open, setOpen] = React.useState(false);
  const clues = v.clues === 'off' ? null : { n: 1, of: 2 };
  const streak = +v.streak;
  return (<section className={'dv4 dv5 is-tight dv7 is-band fold-none dv8 is-3b' + (v.phone === 'rows' ? ' ph-rows' : '') + (open ? '' : ' is-shut')} aria-label="Character sheet"><div className="dv8-rows"><div className="dv7-band">
    <Dv8Hero c={c} />
    {/* Shown on a phone card only. */}
    <button type="button" className="dv8-tog" aria-expanded={open} aria-label={open ? 'Fold the character sheet' : 'Show the whole character sheet'} onClick={() => setOpen((o) => !o)}><DS.Icon name="next" size={20} /></button>
    <div className="dv7-grp dv8-meters">
      <Dv9Meter label="Hit points" n={c.hp} of={c.hpMax} f={v.count} />
      <Dv9Meter label="Threat" n={c.threat} of={c.threatMax} f={v.count} />
      {v.torch === 'on' && <Dv9Meter label="Torch" n={4} of={6} f={v.count} />}
      {clues && <div className="dv6-bar"><span>Clues</span><span className="dv8-clues"><Dv4Uses left={clues.n} of={clues.of} /></span><small>{dv9Count(clues.n, clues.of, v.count)}</small></div>}
    </div>
    <Dv8Grp k="dv8-stats" head="Stats"><Dv7Stats c={c} /></Dv8Grp>
    <Dv8Grp k="dv8-pack" head="Pack">{dv5Slots(c).map((g, i) => (g ? <Dv7Cell key={g.name} label={g.name} used={g.state === 'used'} title={g.name + ' · ' + g.label}><Dv4Box k={g.kind} state={g.state} />{g.kind === 'armour' && <i className="dv7-arm" aria-label="Armour plus 1">+1</i>}</Dv7Cell>
      : <Dv7Cell key={'free' + i} label="Free" used title="Room for one more"><Dv4Box k={null} /></Dv7Cell>))}</Dv8Grp>
    {/* is-r marks the second group of each phone pair (pack | abilities, bargain | advantage), which takes a hairline on its left. */}
    <Dv8Grp k="is-r" head={c.abilities.length > 1 ? 'Abilities' : 'Ability'}><Dv7Abs c={c} /></Dv8Grp>
    {v.barg !== 'off' && <Dv8Grp k="dv8-barg" head="Bargain"><Dv8Cost n={+v.barg} /></Dv8Grp>}
    <Dv8Grp k={'dv8-adv' + (v.barg !== 'off' ? ' is-r' : '')} head="Advantage"><Dv7Ins c={c} label="Inspiration" />
      <Dv7Cell label="Streak" title="Strong hits in a row. At 3, the next roll has advantage."><span className="dv8-num">{streak}</span></Dv7Cell></Dv8Grp>
  </div></div></section>);
};

const Dv9Body = ({ s }) => {
  const v = useDv9(); const m = React.useMemo(() => dv3Build(s), [s]);
  const c = React.useMemo(() => { const x = dv4Sheet(s, m); const long = v.names === 'long';
    const gear = x.gear.filter((g) => g.state !== 'used'); DV8_FILL.forEach((f) => { if (gear.length < x.carry) gear.push({ ...f, state: 'held', label: 'Held' }); });
    const pack = gear.slice(0, +v.pack).map((g, i) => (long ? { ...g, name: DV9_LONG.gear[i] } : g));
    const pool = [x.abilities[0], { ...(DV6_ABIL_FILL[x.name] || { name: 'Vanish', of: 1, does: 'Slips out of sight, no roll' }), left: 1 }, { ...DV9_THIRD_AB, left: 1 }];
    const abilities = pool.slice(0, +v.abil).map((a, i) => (long ? { ...a, name: DV9_LONG.abil[i] } : a));
    return { ...x, name: long ? DV9_LONG.hero : x.name, gear: pack, held: pack.length, abilities }; }, [s, m, v.pack, v.abil, v.names]);
  return <>
    <div className="dv4-lay"><Dv9Sheet c={c} v={v} /><Dv7Card s={s} m={m} res="3" /></div>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv9Body key={p.sid} {...p} /> };

const Dv9PgBar = () => {
  const v = useDv9();
  // KEEP: retries until the page has landed, since main's own mount effects can put the route back after the first go.
  const open = (play) => { let n = 0; const id = DV4_SIDS[play]; const go = () => { const g = window.gsApi; n += 1; if (n > 30) return;
    if (!g) return setTimeout(go, 300);
    if (g.view !== 'pass') { g.setView('pass'); return setTimeout(go, 300); }
    if (g.route.name !== 'session' || g.route.id !== id) { g.go('session', { id }, 'pass'); return setTimeout(go, 300); } }; setTimeout(go, 600); };
  React.useEffect(() => { open(v.play); }, []);
  const G = ({ k, label, opts, cur, onPick }) => (
    <div className="dv1b-grp" role="group" aria-label={label}><span className="dv1b-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="dv1b-chip" aria-pressed={cur === x} onClick={() => onPick(x)}>{l}</button>)}</div>);
  if (DV9_Q.bare) return null;
  const isPre = (p) => Object.entries(DV9_PRESETS[p]).every(([k, x]) => v[k] === x);
  return (<div className="dv1b" role="group" aria-label="Playground controls, not part of the product">
    <div className="dv1b-grp" role="group" aria-label="Preset"><span className="dv1b-lab">Preset</span>
      <button type="button" className="dv1b-chip" aria-pressed={isPre('fewest')} onClick={() => dv9Set(DV9_PRESETS.fewest)}>Fewest</button>
      <button type="button" className="dv1b-chip" aria-pressed={isPre('most')} onClick={() => dv9Set(DV9_PRESETS.most)}>Most</button></div>
    {Object.keys(DV9_OPTS).map((k) => <G key={k} label={DV9_LABEL[k]} opts={DV9_OPTS[k]} cur={v[k]} onPick={(x) => dv9Set({ [k]: x })} />)}
    <G label="Play" opts={DV4_PLAYS} cur={v.play} onPick={(x) => { dv9Set({ play: x }); open(x); }} />
  </div>);
};
(() => { const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv9PgBar />); })();
