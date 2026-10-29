// Playground (1236): Delve v8. Three ways to fit the sheet's extras with the streak always shown, built on v7's band (1H) and card.
// The extras (the torch, clues, the sea witch's bargain and Sea salt) and the streak's numbers are invented; delve.md does not define them yet.

const DV8_KEY = 'pg_delve-session_v8';
const DV8_CONCEPT = [['3a', '3A · Second row'], ['3b', '3B · Join groups'], ['3c', '3C · Two rows by pace']];
const DV8_EXTRAS = [['one', 'One extra'], ['all', 'Hardest: every extra, full pack, two abilities']];
const DV8_WHY = {
  '3a': '3A. The v7 band is untouched. A second row, in the same group and cell anatomy, holds the streak and whatever else applies; it is centred, so one group sits in the middle. The streak is always shown, so in Delve the row is always there.',
  '3b': '3B. Never a second row. Hit points, threat and the torch stack in one column, which frees the width. Inspiration and the streak are one Advantage group. Clues are a fourth meter, as small squares. The bargain\'s gift is an ability; the Bargain group shows its cost as the final foe\'s shield (5B), dashed and empty when none was struck. The band is taller than v7, for air, not for wrapping.',
  '3c': '3C. Two rows, always. The top is what changes roll by roll (hit points, threat, the torch, the streak, Inspiration); the bottom is what you carry (stats, pack, abilities, clues, the bargain).',
};
const DV8_Q = Object.fromEntries(new URLSearchParams(location.search));
const dv8Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV8_KEY) || '{}'); } catch (e) {} v = { ...v, ...DV8_Q };
  const ok = (opts, x, d) => (opts.some((o) => o[0] === x) ? x : d);
  return { concept: ok(DV8_CONCEPT, v.concept, '3a'), extras: ok(DV8_EXTRAS, v.extras, 'all'), play: ok(DV4_PLAYS, v.play, 'live'), why: !!v.why && !DV8_Q.bare }; };
const dv8Set = (patch) => { const n = { ...dv8Get(), ...patch }; try { localStorage.setItem(DV8_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv8')); return n; };
const useDv8 = () => { const [v, setV] = React.useState(dv8Get); React.useEffect(() => { const f = () => setV(dv8Get()); window.addEventListener('dv8', f); return () => window.removeEventListener('dv8', f); }, []); return v; };

// Playground-only: items to fill the pack for the hardest case; invented.
const DV8_FILL = [{ name: 'Coil of rope', kind: 'once' }, { name: 'Lamp oil', kind: 'once' }, { name: 'Bone whistle', kind: 'once' }];
// Playground-only run state, invented for this study.
const DV8_RUN = { streak: 2, streakOf: 3, torch: 4, torchOf: 6, clues: 1, cluesOf: 2, cost: 1, gift: { name: 'Sea salt', left: 1, of: 1, does: 'Heals 4. From the sea witch\'s bargain.' } };

const Dv8Grp = ({ k, head, children }) => <div className={'dv7-grp' + (k ? ' ' + k : '')}>{head && <Dv7Head name={head} />}<div className="dv7-cells">{children}</div></div>;
const Dv8Hero = ({ c }) => <div className="dv7-grp is-hero"><p className="dv7-hero"><b>{c.name}</b><span>{c.cls}</span></p></div>;
const Dv8Bar = ({ k, name, n, of }) => <Dv8Grp k={k} head={name}><Dv7Cell label={n + ' of ' + of}><Dv5Track n={n} of={of} /></Dv7Cell></Dv8Grp>;
const Dv8StreakCell = ({ label, num }) => <Dv7Cell label={label} title={'Strong hits in a row. At ' + DV8_RUN.streakOf + ', the next roll has advantage.'}>{num ? <span className="dv8-num">{DV8_RUN.streak}</span> : <Dv4Uses left={DV8_RUN.streak} of={DV8_RUN.streakOf} />}</Dv7Cell>;
const Dv8Gift = () => <Dv7Cell label={DV8_RUN.gift.name} title={DV8_RUN.gift.does}><Dv4Uses left={DV8_RUN.gift.left} of={DV8_RUN.gift.of} /></Dv7Cell>;
// 5B (owner, 2026-10-29): the bargain's cost is the final foe's toughness, a shield with the steps it gains inside; the label is always "Final foe".
// Not struck, the shield is dashed and empty. The gift lives where it belongs (Sea salt is an ability).
const Dv8Cost = ({ n }) => (<Dv7Cell label={n ? 'Final foe' : 'None struck'} used={!n} title={n ? 'The final foe starts ' + n + (n > 1 ? ' steps' : ' step') + ' further along its track.' : 'No bargain struck this run.'}>
  <span className={'dv8-cost' + (n ? '' : ' is-none')}><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" strokeDasharray={n ? undefined : '3 2'} aria-hidden="true"><path d="M4 2.5h16v9.5l-8 9.5-8-9.5z" /></svg>{n ? <b>+{n}</b> : null}</span></Dv7Cell>);
const Dv8Clues = ({ label }) => <Dv7Cell label={label}><span className="dv8-clues"><Dv4Uses left={DV8_RUN.clues} of={DV8_RUN.cluesOf} /></span></Dv7Cell>;

const Dv8Sheet = ({ c, concept, all }) => { const [open, setOpen] = React.useState(false);
  const R = DV8_RUN; const abName = (n) => (n > 1 ? 'Abilities' : 'Ability');
  const hp = <Dv8Bar k="is-hp" name="Hit points" n={c.hp} of={c.hpMax} />;
  const th = <Dv8Bar k="is-th" name="Threat" n={c.threat} of={c.threatMax} />;
  const torch = <Dv8Bar name="The torch" n={R.torch} of={R.torchOf} />;
  const stats = <Dv8Grp k="dv8-stats" head="Stats"><Dv7Stats c={c} /></Dv8Grp>;
  // The pack shows its room as empty slots, so it needs no count.
  const pack = (clue) => <Dv8Grp k="dv8-pack" head="Pack">{dv5Slots(c).map((g, i) => (g ? <Dv7Cell key={g.name} label={g.name} used={g.state === 'used'} title={g.name + ' · ' + g.label}><Dv4Box k={g.kind} state={g.state} />{g.kind === 'armour' && <i className="dv7-arm" aria-label="Armour plus 1">+1</i>}</Dv7Cell>
    : <Dv7Cell key={'free' + i} label="Free" used title="Room for one more"><Dv4Box k={null} /></Dv7Cell>))}{clue && <Dv8Clues label={'Clues ' + R.clues + ' of ' + R.cluesOf} />}</Dv8Grp>;
  const abs = (gift) => <Dv8Grp head={abName(c.abilities.length + (gift ? 1 : 0))}><Dv7Abs c={c} />{gift && <Dv8Gift />}</Dv8Grp>;
  const insp = <Dv8Grp head="Inspiration"><Dv7Ins c={c} label={c.insp ? 'Ready' : 'Spent'} /></Dv8Grp>;
  const streak = <Dv8Grp head="Streak"><Dv8StreakCell label={R.streak + ' of ' + R.streakOf} /></Dv8Grp>;
  const clues = <Dv8Grp head="Clues"><Dv8Clues label={R.clues + ' of ' + R.cluesOf + ' found'} /></Dv8Grp>;
  const bargain = <Dv8Grp head="The sea witch's bargain"><Dv8Gift /></Dv8Grp>;
  const wrap = (rows) => <section className={'dv4 dv5 is-tight dv7 is-band fold-none dv8 is-' + concept + (open ? '' : ' is-shut')} aria-label="Character sheet"><div className="dv8-rows">{rows}</div></section>;
  if (concept === '3b') return wrap(<div className="dv7-band">
    <Dv8Hero c={c} />
    {/* Shown on a phone card only. */}
    <button type="button" className="dv8-tog" aria-expanded={open} aria-label={open ? 'Fold the character sheet' : 'Show the whole character sheet'} onClick={() => setOpen((o) => !o)}><DS.Icon name="next" size={20} /></button>
    <div className="dv7-grp dv8-meters"><Dv6Bar label="Hit points" n={c.hp} of={c.hpMax} /><Dv6Bar label="Threat" n={c.threat} of={c.threatMax} /><Dv6Bar label="Torch" n={R.torch} of={R.torchOf} />{all && <div className="dv6-bar"><span>Clues</span><span className="dv8-clues"><Dv4Uses left={R.clues} of={R.cluesOf} /></span><small>{R.clues} of {R.cluesOf}</small></div>}</div>
    {stats}{pack(false)}{abs(all)}
    <Dv8Grp k="dv8-barg" head="Bargain"><Dv8Cost n={all ? R.cost : 0} /></Dv8Grp>
    <Dv8Grp k="dv8-adv" head="Advantage"><Dv7Ins c={c} label="Inspiration" /><Dv8StreakCell num label="Streak" /></Dv8Grp>
  </div>);
  if (concept === '3c') return wrap(<>
    <div className="dv7-band"><Dv8Hero c={c} />{hp}{th}{torch}{streak}{insp}</div>
    <div className="dv7-band dv8-r2">{stats}{pack(false)}{abs(all)}{all && clues}{all && bargain}</div>
  </>);
  return wrap(<>
    <div className="dv7-band"><Dv8Hero c={c} />{hp}{th}{stats}{pack(false)}{abs(false)}{insp}</div>
    <div className="dv7-band dv8-r2 is-centre">{streak}{torch}{all && clues}{all && bargain}</div>
  </>);
};

const Dv8Body = ({ s }) => {
  const v = useDv8(); const m = React.useMemo(() => dv3Build(s), [s]); const c = React.useMemo(() => { const x = dv4Sheet(s, m); if (v.extras !== 'all') return x;
    const gear = x.gear.filter((g) => g.state !== 'used'); DV8_FILL.forEach((f) => { if (gear.length < x.carry) gear.push({ ...f, state: 'held', label: 'Held' }); });
    const abilities = x.abilities.length > 1 ? x.abilities : x.abilities.concat([{ ...(DV6_ABIL_FILL[x.name] || { name: 'Vanish', of: 1, does: 'Slips out of sight, no roll' }), left: 1 }]);
    return { ...x, gear, held: gear.length, abilities }; }, [s, m, v.extras]);
  return <>
    <div className="dv4-lay"><Dv8Sheet c={c} concept={v.concept} all={v.extras !== 'one'} /><Dv7Card s={s} m={m} res="3" /></div>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv8Body key={p.sid} {...p} /> };

const Dv8PgBar = () => {
  const v = useDv8();
  // KEEP: retries until the page has landed, since main's own mount effects can put the route back after the first go.
  const open = (play) => { let n = 0; const id = DV4_SIDS[play]; const go = () => { const g = window.gsApi; n += 1; if (n > 30) return;
    if (!g) return setTimeout(go, 300);
    if (g.view !== 'pass') { g.setView('pass'); return setTimeout(go, 300); }
    if (g.route.name !== 'session' || g.route.id !== id) { g.go('session', { id }, 'pass'); return setTimeout(go, 300); } }; setTimeout(go, 600); };
  React.useEffect(() => { open(v.play); }, []);
  const G = ({ label, opts, cur, onPick }) => (
    <div className="dv1b-grp" role="group" aria-label={label}><span className="dv1b-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="dv1b-chip" aria-pressed={cur === x} onClick={() => onPick(x)}>{l}</button>)}</div>);
  if (DV8_Q.bare) return null;
  return (<>
    <div className="dv1b" role="group" aria-label="Playground controls, not part of the product">
      <G label="Concept" opts={DV8_CONCEPT} cur={v.concept} onPick={(x) => dv8Set({ concept: x })} />
      <G label="Extras" opts={DV8_EXTRAS} cur={v.extras} onPick={(x) => dv8Set({ extras: x })} />
      <G label="Play" opts={DV4_PLAYS} cur={v.play} onPick={(x) => { dv8Set({ play: x }); open(x); }} />
      <button type="button" className="dv1b-chip" aria-pressed={v.why} onClick={() => dv8Set({ why: !v.why })}>Why</button>
    </div>
    {v.why && <div className="dv1b-why"><p>{DV8_WHY[v.concept]}</p></div>}
  </>);
};
// v9 loads this file for its parts and brings its own bar, so it sets DV8_NO_BAR first.
(() => { if (window.DV8_NO_BAR) return; const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv8PgBar />); })();
