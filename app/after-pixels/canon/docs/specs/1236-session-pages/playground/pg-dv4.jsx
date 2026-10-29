// Playground (1236, Delve v4): the character sheet as its own card, E4 (review-2026-10-28-delve-e-brief.md § Character sheet).
// Loaded by delve-v4.html after pg-dv-seed.jsx and pg-dv3.jsx. The session card under (or beside) the sheet is v3's concept 1
// as it stands, with v3's sheet taken out; v3 is not reviewed, so it is held fixed here, not studied. Four concepts for the sheet.
// The bar: Play, Concept, Why. Nothing in app/ changes.

const DV4_KEY = 'pg_delve-session_v4';
const DV4_CONCEPT_OPTS = [['1', '1 · Strip'], ['2', '2 · Rail'], ['3', '3 · Tokens'], ['4', '4 · In hand']];
const DV4_PLAYS = [['live', 'In progress'], ['won', 'Won'], ['fallen', 'Fallen'], ['hard', 'Overrun · hard'], ['ended', 'Week ended']];
const DV4_WHY = {
  1: 'Concept 1, Strip. A band across the top: hero, hit points, threat, pack, ability, inspiration, everything but the stats in one line of figures. The stats fold away under it. Cost: the busiest; on a phone it is two columns and fairly tall.',
  2: 'Concept 2, Rail. A tall card beside the session card on a wide page, as the library game page sits its cards side by side; one section per kind. On a phone it shrinks to hero, hit points and threat, the rest folded. Cost: the route loses about 320px of width.',
  3: 'Concept 3, Tokens. Shapes stand in for words: hexes for what touches the die (the six stats, and inspiration, rimmed like the natural 20 that earns it back), squares for things (gear, ability uses), bars for the two tracks. Tap one to name it on the line below. Cost: you learn the shapes, and reading one is a tap.',
  4: 'Concept 4, In hand. Leads with what you still have to use: each piece of gear, each ability and inspiration is a slot, spent ones greyed. Hit points and threat are two bars above; the stats one quiet line below. Cost: on a finished run, what is left matters least.',
};
const DV4_SIDS = { won: 'dv4-won', fallen: 'dv4-fallen', hard: 'dv4-hard', live: 'dv4-live', ended: 'dv4-ended' };
Object.assign(GS_SESSIONS, dvSessions('dv4'));
// KEEP: the session card is v3's concept 1, fixed; this round studies the sheet only.
const DV4_CARD = { ...DV3_CONCEPTS[1], concept: '1' };

const dv4Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV4_KEY) || '{}'); } catch (e) {}
  return { concept: DV4_CONCEPT_OPTS.some((x) => x[0] === v.concept) ? v.concept : '1', play: DV4_PLAYS.some((x) => x[0] === v.play) ? v.play : 'live', why: !!v.why }; };
const dv4Set = (patch) => { const n = { ...dv4Get(), ...patch }; try { localStorage.setItem(DV4_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv4')); return n; };
const useDv4 = () => { const [v, setV] = React.useState(dv4Get); React.useEffect(() => { const f = () => setV(dv4Get()); window.addEventListener('dv4', f); return () => window.removeEventListener('dv4', f); }, []); return v; };
const useDv4W = () => { const ref = React.useRef(null); const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; setW(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width)); ro.observe(el); return () => ro.disconnect(); }, []); return [ref, w]; };

// ---- The sheet, read from the seed's hero and the record's lines: gear taken, used, or a key that opened its lock. ----
const DV4_STATE = { worn: 'Worn', held: 'Held', used: 'Used' };
const dv4Sheet = (s, m) => {
  const h = DV_HEROES[s.hero]; const sh = s.sheet || {}; const used = sh.used || {};
  const gear = h.gear.map((g) => ({ ...g, state: g.kind === 'armour' ? 'worn' : 'held' }));
  const find = (name) => { const n = dv3Cap(name.replace(/^(a|an|the)\s+/i, '')); let g = gear.find((x) => x.name === n);
    if (!g) { g = { name: n, kind: /key/i.test(n) ? 'key' : 'once', does: DV_GEAR_DOES[n] || '', state: 'held' }; gear.push(g); } return g; };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Gear') { const t = String(l[1]); if (/^Took /.test(t)) find(t.replace(/^Took /, '')); else if (l[2]) find(t).state = 'used'; }
    // KEEP: a key opens its lock and is kept (delve.md, Gear), so it stays in the pack, noted with the lock it opened.
    if (l[0] === 'Lock') { const w = /^Opened (.+) with (.+)$/.exec(String(l[1])); if (w) find(w[2]).note = 'Opened ' + w[1]; }
  });
  gear.forEach((g) => { g.label = g.note || DV4_STATE[g.state]; });
  return { name: h.name, cls: h.cls, hp: m.hp, hpMax: s.hpMax, threat: s.threat, threatMax: s.threatMax, carry: DV_CARRY, gear,
    held: gear.filter((g) => g.state !== 'used').length,
    abilities: h.abilities.map((a) => ({ ...a, left: Math.max(0, a.of - (used[a.name] || 0)) })), insp: !!sh.insp,
    stats: Object.entries(h.stats).map(([k, n]) => ({ k, ab: k.slice(0, 3).toUpperCase(), n, say: (n < 0 ? '−' : '+') + Math.abs(n) })) };
};

// ---- Glyphs, line-drawn as the shop's icons (1.75 stroke, square caps, mitred joins). Armour has its own: a shield. ----
const DV4_G = { armour: 'M5 4h14v8l-7 8-7-8z', once: 'M9 3h6M10 3v6l-5 11h14l-5-11V3', key: 'M3 9h7v6H3zM10 12h11M17 12v4M20 12v3', ability: 'M13 2 5 14h6l-1 8 8-12h-6z' };
const Dv4Glyph = ({ k, size = 20 }) => (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={DV4_G[k]} /></svg>);
const Dv4Box = ({ k, state, size }) => (<span className={'dv4-g' + (state === 'used' ? ' is-used' : '') + (!k ? ' is-empty' : '') + (size ? ' is-' + size : '')}>{k && <Dv4Glyph k={k} size={size === 'lg' ? 24 : 20} />}</span>);
const Dv4Uses = ({ left, of }) => (<span className="dv4-uses" role="img" aria-label={left + ' of ' + of + ' left'}>{Array.from({ length: of }, (_, i) => <i key={i} className={i < left ? 'is-on' : ''} />)}</span>);
// Inspiration: a hex like the die's, rimmed as a natural 20 is, since a natural 20 gives it back; empty once spent.
const Dv4Insp = ({ on, size = 28 }) => (<svg className={'dv4-insp' + (on ? ' is-on' : '')} viewBox="-5 -5 46 50" width={size} height={Math.round(size * 50 / 46)} aria-hidden="true">
  <polygon className="hx" points={DV3_HEX} />{on && <polygon className="rim" points={DV3_RIM} />}</svg>);
const Dv4Fig = ({ label, n, of }) => (<div className="dv4-cell"><span className="dv4-lab">{label}</span><b className="dv4-big">{n}<small> of {of}</small></b><Dv3Pips n={n} of={of} label={label + ' ' + n + ' of ' + of} /></div>);
const Dv4Hero = ({ c }) => (<p className="dv4-hero"><b>{c.name}</b><span>{c.cls}</span></p>);
const Dv4Head = () => <h2 className="dv4-h">Character sheet</h2>;
const Dv4Stats = ({ c, cols }) => (<dl className={'dv4-stats' + (cols ? ' is-' + cols : '')}>{c.stats.map((x) => <div key={x.k}><dt>{x.k}</dt><dd>{x.say}</dd></div>)}</dl>);
const Dv4Bar = ({ label, n, of }) => (<div className="dv4-meter"><div className="dv4-row"><span>{label}</span><span>{n} of {of}</span></div>
  <DS.ProgressBar label={label} value={n} max={of} showValue={false} /></div>);

// ---- 1 · Strip: one line of figures across the top; the stats fold away. ----
const Dv4Strip = ({ c }) => (<section className="dv4" aria-label="Character sheet">
  <Dv4Head />
  <div className="dv4-strip">
    <div className="dv4-cell is-wide"><span className="dv4-lab">Hero</span><Dv4Hero c={c} /></div>
    <Dv4Fig label="Hit points" n={c.hp} of={c.hpMax} />
    <Dv4Fig label="Threat" n={c.threat} of={c.threatMax} />
    <div className="dv4-cell is-wide"><span className="dv4-lab">Pack · {c.held} of {c.carry}</span>
      <div className="dv4-items">{c.gear.map((g) => (<div key={g.name} className={'dv4-item' + (g.state === 'used' ? ' is-used' : '')}><Dv4Box k={g.kind} state={g.state} /><span>{g.name}<small>{g.label}</small></span></div>))}</div></div>
    {c.abilities.map((a) => (<div key={a.name} className="dv4-cell"><span className="dv4-lab">{a.name}</span><b className="dv4-big">{a.left}<small> of {a.of} left</small></b><Dv4Uses left={a.left} of={a.of} /></div>))}
    <div className="dv4-cell"><span className="dv4-lab">Inspiration</span><span className="dv4-ins"><Dv4Insp on={c.insp} /><b>{c.insp ? 'Ready' : 'Spent'}</b></span></div>
  </div>
  <DS.Disclosure title="Stats"><Dv4Stats c={c} /></DS.Disclosure>
</section>);

// ---- 2 · Rail: beside the session card when the page is wide, one section per kind; on a phone, the three figures and the rest folded. ----
const Dv4RailBody = ({ c }) => (<>
  <div className="dv4-sec"><span className="dv4-lab">Pack · {c.held} of {c.carry}</span>
    {c.gear.map((g) => (<div key={g.name} className={'dv4-item is-row' + (g.state === 'used' ? ' is-used' : '')}><Dv4Box k={g.kind} state={g.state} /><span>{g.name}</span><small>{g.label}</small></div>))}</div>
  <div className="dv4-sec"><span className="dv4-lab">Abilities</span>
    {c.abilities.map((a) => (<div key={a.name} className="dv4-row"><span>{a.name}</span><Dv4Uses left={a.left} of={a.of} /></div>))}
    <div className="dv4-row"><span>Inspiration</span><span className="dv4-ins"><Dv4Insp on={c.insp} size={22} /><span>{c.insp ? 'Ready' : 'Spent'}</span></span></div></div>
  <div className="dv4-sec"><span className="dv4-lab">Stats</span><Dv4Stats c={c} cols="3" /></div>
</>);
const Dv4Rail = ({ c, side }) => (<section className={'dv4' + (side ? ' is-rail' : '')} aria-label="Character sheet">
  <Dv4Head /><Dv4Hero c={c} />
  <div className={side ? 'dv4-stack' : 'dv4-meters'}><Dv4Bar label="Hit points" n={c.hp} of={c.hpMax} /><Dv4Bar label="Threat" n={c.threat} of={c.threatMax} /></div>
  {side ? <Dv4RailBody c={c} /> : <DS.Disclosure title="Pack, abilities and stats"><div className="dv4-stack"><Dv4RailBody c={c} /></div></DS.Disclosure>}
</section>);

// ---- 3 · Tokens: shapes in place of words; a tap names one on the line below. ----
const Dv4Tok = ({ id, cur, on, label, children, cls }) => (<button type="button" className={'dv4-tok' + (cls ? ' ' + cls : '')} aria-pressed={cur === id} aria-label={label} onClick={() => on(cur === id ? null : id)}>{children}</button>);
const Dv4Tokens = ({ c }) => {
  const [cur, setCur] = React.useState(null);
  const say = {};
  c.gear.forEach((g, i) => { say['g' + i] = [g.name, g.label + (g.does ? '. ' + g.does : '')]; });
  for (let i = c.gear.length; i < c.carry; i++) say['g' + i] = ['Empty slot', 'Room for one more in the pack'];
  c.abilities.forEach((a, i) => { say['a' + i] = [a.name, a.left + ' of ' + a.of + ' left. ' + a.does]; });
  say.ins = ['Inspiration', c.insp ? 'Ready: spent on a roll, it rolls two dice and keeps the higher' : 'Spent. A natural 20 gives it back'];
  c.stats.forEach((x) => { say[x.ab] = [x.k, x.say + ' on every ' + x.k + ' roll']; });
  say.hp = ['Hit points', c.hp + ' of ' + c.hpMax + ' left']; say.th = ['Threat', c.threat + ' of ' + c.threatMax + '. Full threat ends the run'];
  const slots = Array.from({ length: Math.max(c.carry, c.gear.length) }, (_, i) => c.gear[i] || null);
  const cap = cur && say[cur];
  return (<section className="dv4" aria-label="Character sheet">
    <Dv4Head />
    <div className="dv4-hexw">
      <div className="dv4-tracks"><Dv4Hero c={c} />
        <Dv4Tok id="hp" cur={cur} on={setCur} label="Hit points" cls="is-track"><span className="dv4-tn">{c.hp}</span><Dv3Pips n={c.hp} of={c.hpMax} label="" /></Dv4Tok>
        <Dv4Tok id="th" cur={cur} on={setCur} label="Threat" cls="is-track"><span className="dv4-tn">{c.threat}</span><Dv3Pips n={c.threat} of={c.threatMax} label="" /></Dv4Tok></div>
      <div className="dv4-tgrp">{slots.map((g, i) => (<Dv4Tok key={i} id={'g' + i} cur={cur} on={setCur} label={g ? g.name : 'Empty slot'}><Dv4Box k={g && g.kind} state={g && g.state} size="lg" /></Dv4Tok>))}</div>
      <div className="dv4-tgrp">{c.abilities.map((a, i) => (<Dv4Tok key={i} id={'a' + i} cur={cur} on={setCur} label={a.name} cls="is-ab"><Dv4Box k="ability" state={a.left ? 'held' : 'used'} size="lg" /><Dv4Uses left={a.left} of={a.of} /></Dv4Tok>))}
        <Dv4Tok id="ins" cur={cur} on={setCur} label="Inspiration"><Dv4Insp on={c.insp} size={40} /></Dv4Tok></div>
      <div className="dv4-tgrp is-stats">{c.stats.map((x) => (<Dv4Tok key={x.ab} id={x.ab} cur={cur} on={setCur} label={x.k} cls="is-hex">
        <svg className="dv4-sx" viewBox="-5 -5 46 50" width="40" height="44" aria-hidden="true"><polygon className="hx" points={DV3_HEX} /><text x="18" y="20.5">{x.say}</text></svg><span className="dv4-ab">{x.ab}</span></Dv4Tok>))}</div>
    </div>
    <p className="dv4-cap" aria-live="polite">{cap ? <><b>{cap[0]}</b> · {cap[1]}</> : 'Tap any piece to read it.'}</p>
  </section>);
};

// ---- 4 · In hand: what is still there to use, as slots; the tracks above, the stats one line below. ----
const Dv4Hand = ({ c }) => {
  const empty = Math.max(0, c.carry - c.gear.length);
  return (<section className="dv4" aria-label="Character sheet">
    <div className="dv4-hh"><Dv4Head /><Dv4Hero c={c} /></div>
    <div className="dv4-meters"><Dv4Bar label="Hit points" n={c.hp} of={c.hpMax} /><Dv4Bar label="Threat" n={c.threat} of={c.threatMax} /></div>
    <div className="dv4-slots">
      {c.gear.map((g) => (<div key={g.name} className={'dv4-slot' + (g.state === 'used' ? ' is-used' : '')}><Dv4Box k={g.kind} state={g.state} /><span><b>{g.name}</b><small>{g.label}</small></span></div>))}
      {Array.from({ length: empty }, (_, i) => (<div key={'e' + i} className="dv4-slot is-empty"><Dv4Box /><span><small>Room in the pack</small></span></div>))}
      {c.abilities.map((a) => (<div key={a.name} className={'dv4-slot' + (a.left ? '' : ' is-used')}><Dv4Box k="ability" state={a.left ? 'held' : 'used'} /><span><b>{a.name}</b><small>{a.left ? a.left + ' of ' + a.of + ' left' : 'Used up'}</small></span></div>))}
      <div className={'dv4-slot' + (c.insp ? '' : ' is-used')}><span className="dv4-g is-bare"><Dv4Insp on={c.insp} size={24} /></span><span><b>Inspiration</b><small>{c.insp ? 'Ready' : 'Spent'}</small></span></div>
    </div>
    <p className="dv4-line">{c.stats.map((x, i) => <span key={x.k}>{x.k.slice(0, 3)} <b>{x.say}</b></span>)}</p>
  </section>);
};

// ---- The page: the sheet card, then v3's session card (without its sheet); in 2 · Rail, side by side when the page is wide. ----
const Dv4Card = ({ s, m }) => {
  const [sel, setSel] = React.useState(() => (m.rolls.length ? m.rolls.length : null)); const [hov, setHov] = React.useState(null);
  const on = { sel: setSel, hov: setHov }; const act = hov || sel;
  return (<section className="dv2" aria-label="How the run went">
    <div className="dv2-top"><Dv3Result s={s} m={m} v={DV4_CARD} /></div>
    <Dv3E m={m} act={act} on={on} v={DV4_CARD} />
  </section>);
};
const Dv4Body = ({ s }) => {
  const v = useDv4(); const m = React.useMemo(() => dv3Build(s), [s]); const c = React.useMemo(() => dv4Sheet(s, m), [s, m]);
  const [ref, w] = useDv4W();
  // KEEP: the rail stands beside the session card only where the page is wide enough for both (as the library game page's rows); narrower, it is a band on top.
  const side = v.concept === '2' && w >= 1000;
  const Sheet = { 1: Dv4Strip, 2: Dv4Rail, 3: Dv4Tokens, 4: Dv4Hand }[v.concept];
  return <>
    <div ref={ref} className={'dv4-lay' + (side ? ' is-side' : '')}>
      {side ? <><Dv4Card s={s} m={m} /><Sheet c={c} side /></> : <><Sheet key={v.concept} c={c} /><Dv4Card s={s} m={m} /></>}
    </div>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv4Body key={p.sid} {...p} /> };

// ---- The bar (v3's, with this round's options). ----
const Dv4PgBar = () => {
  const v = useDv4();
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
      <G label="Play" opts={DV4_PLAYS} cur={v.play} onPick={(x) => { dv4Set({ play: x }); open(x); }} />
      <G label="Concept" opts={DV4_CONCEPT_OPTS} cur={v.concept} onPick={(x) => dv4Set({ concept: x })} />
      <button type="button" className="dv1b-chip" aria-pressed={v.why} onClick={() => dv4Set({ why: !v.why })}>Why</button>
    </div>
    {v.why && <div className="dv1b-why"><p>{DV4_WHY[v.concept]}</p></div>}
  </>);
};
if (!window.DV4_NO_BAR) (() => { const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv4PgBar />); })();
