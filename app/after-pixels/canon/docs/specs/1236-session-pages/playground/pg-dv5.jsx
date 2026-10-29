// Playground (1236, Delve v5): the character sheet, second round. Loaded by delve-v5.html after pg-dv-seed.jsx, pg-dv3.jsx and
// pg-dv4.jsx (with DV4_NO_BAR), whose sheet model, glyphs, session card and page it reuses. v4's 2 and 4 are dropped (owner,
// 2026-10-29); 1 and 3 are tuned to his notes, and 1B and 3B are new takes on each. Nothing in app/ changes.

const DV5_KEY = 'pg_delve-session_v5';
const DV5_CONCEPT_OPTS = [['1', '1 · Strip'], ['1b', '1B · Tracks first'], ['3', '3 · Tokens'], ['3b', '3B · Hotbar'], ['1c', '1C · All shown'], ['1d', '1D · Tap for more'], ['1cb', '1CB · All shown, tight'], ['1db', '1DB · Tap, tight']];
const DV5_WHY = {
  1: '1, Strip, tuned. On a grid across the full width: hero, hit points, threat, ability and inspiration on top; pack and stats under. The stats sit in the band (no fold); hit points and threat are bars and the ability its squares, from Rail. Inspiration is the hex alone. On a phone it stacks.',
  '1b': '1B, Tracks first. Hit points and threat run as two long bars beside the hero, the thing you look at first. Under them, one line: the six stats abbreviated, the pack as glyphs with names, the ability squares, the inspiration hex. Thinner than 1; the stats are shorthand (hover or long-press for the full name).',
  3: '3, Tokens, tuned. One row across the full width, spread to fill it; smaller tokens; the hint and what you tapped sit at the right of the heading instead of a line under. An empty pack slot is a dashed outline. Still a tap to name a piece.',
  '3b': '3B, Hotbar. Every piece is an equal slot in one bar across the card, the way a game\'s inventory bar is: hit points, threat, the pack, the ability, inspiration, the stats. Each slot carries a short label, so nothing needs a tap to read; a tap gives the detail. On a phone the bar wraps into rows of equal slots.',
  '1c': '1C, All shown. 1B\'s hero and two bars on top. Under them, four labelled groups across the width: the stats as 3\'s hexes, the pack as glyph boxes with name and state (free slots kept, so 0 and 3 items are one height), each ability as its own glyph with name and use squares, and inspiration. Nothing needs a tap.',
  '1d': '1D, Tap for more. 1B\'s hero and two bars on top. Under them, one line of equal tokens: stat hexes, pack boxes, each ability (glyph and use squares), inspiration. Each token carries one short word; a tap names it in full at the heading\'s right, as 3B does. Every token is one height, so the selected outline is even.',
  '1cb': '1CB, 1C tightened. Same parts and order; less padding round the card, smaller gaps between groups and rows, smaller boxes and hexes (the numbers still draw at about 14px).',
  '1db': '1DB, 1D tightened. Same tokens; less padding round the card and between rows, shorter tokens packed closer.',
};
const DV5_INSP = [['play', 'As played'], ['on', 'Ready'], ['off', 'Spent']];
const DV5_PACK = [['play', 'As played'], ['0', '0 items'], ['1', '1 item'], ['2', '2 items'], ['3', '3 items']];
// Playground-only fillers when the Pack control asks for more than the play holds; invented, not in delve.md.
const DV5_PACK_FILL = [{ name: 'Iron key', kind: 'key', does: 'Opens the lock it fits' }, { name: 'Healing draught', kind: 'once', does: 'Drunk, it gives back 2 hit points' }, { name: 'Rope', kind: 'once', does: 'Tied off, it gets you down a drop' }];
const dv5Pack = (gear, n) => { const out = gear.slice(0, n);
  for (const g of DV5_PACK_FILL) { if (out.length >= n) break; if (!out.some((x) => x.name === g.name)) out.push({ ...g, state: 'held', label: 'Held' }); } return out; };
const dv5Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV5_KEY) || '{}'); } catch (e) {}
  return { concept: DV5_CONCEPT_OPTS.some((x) => x[0] === v.concept) ? v.concept : '1', play: DV4_PLAYS.some((x) => x[0] === v.play) ? v.play : 'live', insp: DV5_INSP.some((x) => x[0] === v.insp) ? v.insp : 'play', pack: DV5_PACK.some((x) => x[0] === v.pack) ? v.pack : 'play', why: !!v.why }; };
const dv5Set = (patch) => { const n = { ...dv5Get(), ...patch }; try { localStorage.setItem(DV5_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv5')); return n; };
const useDv5 = () => { const [v, setV] = React.useState(dv5Get); React.useEffect(() => { const f = () => setV(dv5Get()); window.addEventListener('dv5', f); return () => window.removeEventListener('dv5', f); }, []); return v; };

// What a tap says about each piece (3, 3B), and the pack's slots padded to its carry with empty ones.
const dv5Say = (c) => { const say = {};
  c.gear.forEach((g, i) => { say['g' + i] = [g.name, g.label + (g.does ? '. ' + g.does : '')]; });
  for (let i = c.gear.length; i < c.carry; i++) say['g' + i] = ['Free slot', 'Room for one more in the pack'];
  c.abilities.forEach((a, i) => { say['a' + i] = [a.name, a.left + ' of ' + a.of + ' left. ' + a.does]; });
  say.ins = ['Inspiration', c.insp ? 'Ready: spent on a roll, it rolls two dice and keeps the higher' : 'Spent. A natural 20 gives it back'];
  c.stats.forEach((x) => { say[x.ab] = [x.k, x.say + ' on every ' + x.k + ' roll']; });
  say.hp = ['Hit points', c.hp + ' of ' + c.hpMax + ' left']; say.th = ['Threat', c.threat + ' of ' + c.threatMax + '. Full threat ends the run'];
  return say; };
const dv5Slots = (c) => Array.from({ length: Math.max(c.carry, c.gear.length) }, (_, i) => c.gear[i] || null);
const Dv5Insp = ({ c, size }) => <span className="dv5-insw" role="img" aria-label={'Inspiration, ' + (c.insp ? 'ready' : 'spent')}><Dv4Insp on={c.insp} size={size} /></span>;
const Dv5Ab = ({ a }) => (<div className="dv5-abl"><span className="dv4-lab">{a.name}</span><span className="dv5-abr"><Dv4Uses left={a.left} of={a.of} /><small>{a.left} of {a.of}</small></span></div>);
const Dv5Cap = ({ cap, hint }) => <p className="dv5-cap" aria-live="polite">{cap ? <><b>{cap[0]}</b> · {cap[1]}</> : hint}</p>;

// ---- 1 · Strip, tuned: a 12-column grid so every cell takes its share of the width; stats in the band. ----
const Dv5Strip = ({ c }) => (<section className="dv4 dv5" aria-label="Character sheet">
  <Dv4Head />
  <div className="dv5-s1">
    <div className="dv5-c is-hero"><Dv4Hero c={c} /></div>
    <div className="dv5-c is-hp"><Dv4Bar label="Hit points" n={c.hp} of={c.hpMax} /></div>
    <div className="dv5-c is-th"><Dv4Bar label="Threat" n={c.threat} of={c.threatMax} /></div>
    <div className="dv5-c is-ab">{c.abilities.map((a) => <Dv5Ab key={a.name} a={a} />)}
      <div className="dv5-abl"><span className="dv4-lab">Inspiration</span><Dv5Insp c={c} size={24} /></div></div>
    <div className="dv5-c is-pack"><span className="dv4-lab">Pack · {c.held} of {c.carry}</span>
      <div className="dv4-items">{c.gear.map((g) => (<div key={g.name} className={'dv4-item' + (g.state === 'used' ? ' is-used' : '')}><Dv4Box k={g.kind} state={g.state} /><span>{g.name}<small>{g.label}</small></span></div>))}</div></div>
    <div className="dv5-c is-stats"><span className="dv4-lab">Stats</span><Dv4Stats c={c} /></div>
  </div>
</section>);

// ---- 1B · Tracks first: the two bars lead beside the hero; everything else is one line of shorthand under them. ----
const Dv5Tracks = ({ c }) => (<section className="dv4 dv5" aria-label="Character sheet">
  <div className="dv5-tf">
    <div className="dv5-tfh"><Dv4Head /><Dv4Hero c={c} /></div>
    <Dv4Bar label="Hit points" n={c.hp} of={c.hpMax} />
    <Dv4Bar label="Threat" n={c.threat} of={c.threatMax} />
  </div>
  <div className="dv5-line">
    <dl className="dv5-ab6">{c.stats.map((x) => <div key={x.k}><dt><abbr title={x.k}>{x.ab}</abbr></dt><dd>{x.say}</dd></div>)}</dl>
    <div className="dv5-pk" aria-label={'Pack, ' + c.held + ' of ' + c.carry}>{c.gear.map((g) => (<span key={g.name} className={'dv5-pki' + (g.state === 'used' ? ' is-used' : '')} title={g.name + ' · ' + g.label}><Dv4Box k={g.kind} state={g.state} /><span>{g.name}</span></span>))}</div>
    <div className="dv5-tail">{c.abilities.map((a) => <Dv5Ab key={a.name} a={a} />)}<Dv5Insp c={c} size={28} /></div>
  </div>
</section>);

// ---- 3 · Tokens, tuned: one row spread across the width; the caption shares the heading's line. ----
const Dv5Tokens = ({ c }) => {
  const [cur, setCur] = React.useState(null); const say = dv5Say(c);
  return (<section className="dv4 dv5" aria-label="Character sheet">
    <div className="dv5-hd"><Dv4Head /><Dv5Cap cap={cur && say[cur]} hint="Tap a piece to read it" /></div>
    <div className="dv5-tk">
      <div className="dv5-tg is-hero"><Dv4Hero c={c} /></div>
      <div className="dv5-tg">
        <Dv4Tok id="hp" cur={cur} on={setCur} label="Hit points" cls="is-track dv5-tr"><span className="dv4-tn">{c.hp}</span><Dv3Pips n={c.hp} of={c.hpMax} label="" /></Dv4Tok>
        <Dv4Tok id="th" cur={cur} on={setCur} label="Threat" cls="is-track dv5-tr"><span className="dv4-tn">{c.threat}</span><Dv3Pips n={c.threat} of={c.threatMax} label="" /></Dv4Tok></div>
      <div className="dv5-tg">{dv5Slots(c).map((g, i) => (<Dv4Tok key={i} id={'g' + i} cur={cur} on={setCur} label={g ? g.name : 'Free slot'}><Dv4Box k={g && g.kind} state={g && g.state} /></Dv4Tok>))}</div>
      <div className="dv5-tg">{c.abilities.map((a, i) => (<Dv4Tok key={i} id={'a' + i} cur={cur} on={setCur} label={a.name} cls="dv5-th"><Dv4Box k="ability" state={a.left ? 'held' : 'used'} /><Dv4Uses left={a.left} of={a.of} /></Dv4Tok>))}
        <Dv4Tok id="ins" cur={cur} on={setCur} label="Inspiration"><Dv4Insp on={c.insp} size={30} /></Dv4Tok></div>
      <div className="dv5-tg">{c.stats.map((x) => (<Dv4Tok key={x.ab} id={x.ab} cur={cur} on={setCur} label={x.k} cls="dv5-sx">
        <svg className="dv4-sx" viewBox="-5 -5 46 50" width="32" height="35" aria-hidden="true"><polygon className="hx" points={DV3_HEX} /><text x="18" y="20.5">{x.say}</text></svg><span className="dv4-ab">{x.ab}</span></Dv4Tok>))}</div>
    </div>
  </section>);
};

// ---- 3B · Hotbar: every piece an equal slot in one bar, each with a short label; a tap gives the detail. ----
const Dv5Slot = ({ id, cur, on, label, sub, cls, children }) => (<button type="button" className={'dv5-sl' + (cls ? ' ' + cls : '')} aria-pressed={cur === id} aria-label={label} onClick={() => on(cur === id ? null : id)}>
  <span className="dv5-slf">{children}</span><span className="dv5-sll">{sub}</span></button>);
// KEEP: one row on a wide card. The tracks, abilities and inspiration take two columns each (their figure and label need it); the column
// count is the slots' sum, so the bar never wraps a lone slot; a narrow card goes to six columns.
const Dv5Track = ({ n, of }) => <span className="dv5-trk" aria-hidden="true"><i style={{ width: (100 * n / of) + '%' }} /></span>;
const Dv5Hotbar = ({ c }) => {
  const [cur, setCur] = React.useState(null); const say = dv5Say(c); const p = { cur, on: setCur };
  const cols = 2 + 2 + dv5Slots(c).length + 2 * c.abilities.length + 2 + c.stats.length;
  return (<section className="dv4 dv5" aria-label="Character sheet">
    <div className="dv5-hd"><div className="dv5-tfh"><Dv4Head /><Dv4Hero c={c} /></div><Dv5Cap cap={cur && say[cur]} hint="Tap a slot for more" /></div>
    <div className="dv5-hb" style={{ '--n': cols }}>
      <Dv5Slot id="hp" {...p} label="Hit points" sub="HP" cls="is-fig is-2"><b>{c.hp}<small>/{c.hpMax}</small></b><Dv5Track n={c.hp} of={c.hpMax} /></Dv5Slot>
      <Dv5Slot id="th" {...p} label="Threat" sub="Threat" cls="is-fig is-2"><b>{c.threat}<small>/{c.threatMax}</small></b><Dv5Track n={c.threat} of={c.threatMax} /></Dv5Slot>
      {dv5Slots(c).map((g, i) => (<Dv5Slot key={'g' + i} id={'g' + i} {...p} label={g ? g.name : 'Free slot'} sub={g ? g.name : 'Free'} cls={!g ? 'is-free' : g.state === 'used' ? 'is-used' : ''}>{g && <Dv4Glyph k={g.kind} size={22} />}</Dv5Slot>))}
      {c.abilities.map((a, i) => (<Dv5Slot key={'a' + i} id={'a' + i} {...p} label={a.name} sub={a.name} cls={'is-2' + (a.left ? '' : ' is-used')}><Dv4Uses left={a.left} of={a.of} /></Dv5Slot>))}
      <Dv5Slot id="ins" {...p} label="Inspiration" sub="Inspiration" cls="is-2"><Dv4Insp on={c.insp} size={26} /></Dv5Slot>
      {c.stats.map((x) => (<Dv5Slot key={x.ab} id={x.ab} {...p} label={x.k} sub={x.ab} cls="is-fig"><b>{x.say}</b></Dv5Slot>))}
    </div>
  </section>);
};

const Dv5Body = ({ s }) => {
  const v = useDv5(); const m = React.useMemo(() => dv3Build(s), [s]); // KEEP: the bar's Inspiration control overrides the play's own, so both states can be seen on any play.
  const c = React.useMemo(() => { const x = dv4Sheet(s, m); if (v.insp !== 'play') x.insp = v.insp === 'on';
    // KEEP: the bar's Pack control overrides the play's pack (0 to 3 items), so the fewest and the most can be checked on any play.
    if (v.pack !== 'play') { x.gear = dv5Pack(x.gear, +v.pack); x.held = x.gear.filter((g) => g.state !== 'used').length; } return x; }, [s, m, v.insp, v.pack]);
  const Sheet = { 1: Dv5Strip, '1b': Dv5Tracks, 3: Dv5Tokens, '3b': Dv5Hotbar, '1c': Dv5Open, '1d': Dv5Tap, '1cb': (p) => <Dv5Open {...p} tight />, '1db': (p) => <Dv5Tap {...p} tight /> }[v.concept];
  return <>
    <div className="dv4-lay"><Sheet key={v.concept} c={c} /><Dv4Card s={s} m={m} /></div>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv5Body key={p.sid} {...p} /> };

// ---- 1C · All shown: 1B's tracks, then labelled groups; 3's hexes for the stats and glyphs for the pack and abilities. ----
const Dv5Hex = ({ x, size = 36 }) => (<svg className="dv4-sx" viewBox="-5 -5 46 50" width={size} height={Math.round(size * 50 / 46)} role="img" aria-label={x.say}><polygon className="hx" points={DV3_HEX} /><text x="18" y="20.5">{x.say}</text></svg>);
const Dv5Tf = ({ c, head = true }) => (<div className="dv5-tf">
  <div className="dv5-tfh">{head && <Dv4Head />}<Dv4Hero c={c} /></div>
  <Dv4Bar label="Hit points" n={c.hp} of={c.hpMax} /><Dv4Bar label="Threat" n={c.threat} of={c.threatMax} /></div>);
const Dv5Open = ({ c, tight }) => (<section className={'dv4 dv5' + (tight ? ' is-tight' : '')} aria-label="Character sheet">
  <Dv5Tf c={c} />
  <div className="dv5-oc">
    <div className="dv5-og is-st"><span className="dv4-lab">Stats</span>
      <dl className="dv5-hx6">{c.stats.map((x) => <div key={x.k}><dt><abbr title={x.k}>{x.ab}</abbr></dt><dd><Dv5Hex x={x} size={tight ? 32 : 36} /></dd></div>)}</dl></div>
    <div className="dv5-og"><span className="dv4-lab">Pack · {c.held} of {c.carry}</span>
      <div className="dv5-ol">{dv5Slots(c).map((g, i) => (<div key={i} className={'dv4-item' + (!g || g.state === 'used' ? ' is-used' : '')}><Dv4Box k={g && g.kind} state={g && g.state} /><span>{g ? g.name : 'Free'}<small>{g ? g.label : 'Room for one more'}</small></span></div>))}</div></div>
    <div className="dv5-op"><div className="dv5-og"><span className="dv4-lab">{c.abilities.length > 1 ? 'Abilities' : 'Ability'}</span>
      <div className="dv5-ol is-col">{c.abilities.map((a) => (<div key={a.name} className={'dv4-item' + (a.left ? '' : ' is-used')}><Dv4Box k="ability" state={a.left ? 'held' : 'used'} /><span>{a.name}<span className="dv5-abr"><Dv4Uses left={a.left} of={a.of} /><small>{a.left} of {a.of}</small></span></span></div>))}</div></div>
    <div className="dv5-og"><span className="dv4-lab">Inspiration</span><Dv5Insp c={c} size={tight ? 28 : 32} /></div></div>
  </div>
</section>);

// ---- 1D · Tap for more: 1B's tracks, then one line of equal tokens, each with one word; a tap names it at the heading's right. ----
// KEEP: every token is one box size, so hover and the selected outline sit evenly round each (the fix for 3's uneven outline).
const Dv5T = ({ id, cur, on, label, sub, cls, children }) => (<button type="button" className={'dv5-t' + (cls ? ' ' + cls : '')} aria-pressed={cur === id} aria-label={label} onClick={() => on(cur === id ? null : id)}>
  <span className="dv5-tf1">{children}</span><span className="dv4-ab">{sub}</span></button>);
const Dv5Tap = ({ c, tight }) => {
  const [cur, setCur] = React.useState(null); const say = dv5Say(c); const p = { cur, on: setCur };
  return (<section className={'dv4 dv5' + (tight ? ' is-tight' : '')} aria-label="Character sheet">
    <div className="dv5-hd"><Dv4Head /><Dv5Cap cap={cur && say[cur]} hint="Tap a piece for more" /></div>
    <Dv5Tf c={c} head={false} />
    <div className="dv5-tl">
      <div className="dv5-tg2">{c.stats.map((x) => (<Dv5T key={x.ab} id={x.ab} {...p} label={x.k} sub={x.ab}><Dv5Hex x={x} size={30} /></Dv5T>))}</div>
      <div className="dv5-tg2">{dv5Slots(c).map((g, i) => (<Dv5T key={i} id={'g' + i} {...p} label={g ? g.name : 'Free slot'} sub={g ? g.label : 'Free'} cls={!g || g.state === 'used' ? 'is-used' : ''}><Dv4Box k={g && g.kind} state={g && g.state} /></Dv5T>))}</div>
      <div className="dv5-tg2">{c.abilities.map((a, i) => (<Dv5T key={i} id={'a' + i} {...p} label={a.name} sub={a.name} cls={a.left ? '' : 'is-used'}><Dv4Box k="ability" state={a.left ? 'held' : 'used'} /><Dv4Uses left={a.left} of={a.of} /></Dv5T>))}
        <Dv5T id="ins" {...p} label="Inspiration" sub="Inspiration"><Dv4Insp on={c.insp} size={30} /></Dv5T></div>
    </div>
  </section>);
};

const Dv5PgBar = () => {
  const v = useDv5();
  // KEEP: retries until the page has landed, since main's own mount effects can put the route back after the first go.
  const open = (play) => { let n = 0; const id = DV4_SIDS[play]; const go = () => { const g = window.gsApi; n += 1; if (n > 30) return;
    if (!g) return setTimeout(go, 300);
    if (g.view !== 'pass') { g.setView('pass'); return setTimeout(go, 300); }
    if (g.route.name !== 'session' || g.route.id !== id) { g.go('session', { id }, 'pass'); return setTimeout(go, 300); } }; setTimeout(go, 600); };
  React.useEffect(() => { open(v.play); }, []);
  const G = ({ label, opts, cur, onPick }) => (
    <div className="dv1b-grp" role="group" aria-label={label}><span className="dv1b-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="dv1b-chip" aria-pressed={cur === x} onClick={() => onPick(x)}>{l}</button>)}</div>);
  return (<>
    <div className="dv1b" role="group" aria-label="Playground controls, not part of the product">
      <G label="Play" opts={DV4_PLAYS} cur={v.play} onPick={(x) => { dv5Set({ play: x }); open(x); }} />
      <G label="Concept" opts={DV5_CONCEPT_OPTS} cur={v.concept} onPick={(x) => dv5Set({ concept: x })} />
      <G label="Inspiration" opts={DV5_INSP} cur={v.insp} onPick={(x) => dv5Set({ insp: x })} />
      <label className="dv1b-grp"><span className="dv1b-lab">Pack</span>
        <select className="dv1b-chip" value={v.pack} onChange={(e) => dv5Set({ pack: e.target.value })}>{DV5_PACK.map(([x, l]) => <option key={x} value={x}>{l}</option>)}</select></label>
      <button type="button" className="dv1b-chip" aria-pressed={v.why} onClick={() => dv5Set({ why: !v.why })}>Why</button>
    </div>
    {v.why && <div className="dv1b-why"><p>{DV5_WHY[v.concept]}</p></div>}
  </>);
};
if (!window.DV5_NO_BAR) (() => { const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv5PgBar />); })();
