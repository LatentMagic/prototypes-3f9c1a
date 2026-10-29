// Playground (1236, Delve v3): concept E made better, from review-2026-10-28-delve-e-brief.md. The main build, whole, loaded
// by delve-v3.html with pg-dv-seed.jsx first. The model, the die and the route are v2's E as it stood (classes keep v2's dv2-
// names); the moment dice lose their titles. Three concepts, each one whole answer to the round's questions (the result word,
// the line under it, the held-roll box, the moment line in it, column lines). The bar: Play, Concept, Why. The platform top,
// the character sheet and Every move are not studied here; the sheet is v2's placeholder with its heading. Nothing in app/ changes.

const DV3_KEY = 'pg_delve-session_v3';
// KEEP: the Ledger never writes "Natural 20" / "Natural 1" or the moment line: the die's rim or red edge already says it (owner, 2026-10-28).
// KEEP: each concept fixes every axis at once, so the owner compares three whole pages, never a grid of switches.
const DV3_CONCEPTS = {
  1: { word: 'w2', under: 'u1', held: 'h1', cols: 'between', line: false },
  2: { word: 'w1', under: 'u2', held: 'h2', cols: 'lanes', line: false },
  3: { word: 'w3', under: 'u3', held: 'h3', cols: 'off', line: false },
};
const DV3_CONCEPT_OPTS = [['1', '1 · Ledger'], ['2', '2 · Sum'], ['3', '3 · Scoreboard']];
const DV3_PLAYS = [['won', 'Won'], ['fallen', 'Fallen'], ['hard', 'Overrun · hard'], ['live', 'In progress'], ['ended', 'Week ended']];
const DV3_WHY = {
  1: 'Concept 1, Ledger. Triumphed, Fallen, Overwhelmed. Under the line, the share card’s tally. The held roll is a labelled row per fact; a natural is told by the die alone. A rule between rooms.',
  2: 'Concept 2, Sum. Victory, Fallen, Lost. Under the line, the roll it ended on and where. The held roll is the sum written out, with a bar to the target. A line down each room, through its dice.',
  3: 'Concept 3, Scoreboard. Cleared, Fallen, Doomed. One sentence carrying the roll count. The held roll is rolled against needed, large. No column lines.',
};
const DV3_ENDW = { w1: { won: 'Victory', overrun: 'Lost' }, w2: { won: 'Triumphed', overrun: 'Overwhelmed' }, w3: { won: 'Cleared', overrun: 'Doomed' } };

const dv3Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV3_KEY) || '{}'); } catch (e) {}
  const concept = DV3_CONCEPTS[v.concept] ? String(v.concept) : '1';
  return { ...DV3_CONCEPTS[concept], concept, play: DV3_PLAYS.some((x) => x[0] === v.play) ? v.play : 'hard', why: !!v.why }; };
const dv3Set = (patch) => { const o = dv3Get(); const n = { concept: o.concept, play: o.play, why: o.why, ...patch }; try { localStorage.setItem(DV3_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv3')); return n; };
const useDv3 = () => { const [v, setV] = React.useState(dv3Get); React.useEffect(() => { const f = () => setV(dv3Get()); window.addEventListener('dv3', f); return () => window.removeEventListener('dv3', f); }, []); return v; };

const DV3_SIDS = { won: 'dv3-won', fallen: 'dv3-fallen', hard: 'dv3-hard', live: 'dv3-live', ended: 'dv3-ended' };
Object.assign(GS_SESSIONS, dvSessions('dv3'));

// ---- The model, as v2: the record's lines read into the rooms stood in (going back included), the rolls and the gear. ----
const DV3_TIER = { strong: 'Strong hit', weak: 'Weak hit', miss: 'Miss' };
const dv3Roll = (l) => {
  const t = String(l[2] || ''); const m = /(?:kept|d20)\s+(\d+)\s*\+\s*(-?\d+)\s*=\s*(-?\d+)\s+vs\s+(\d+)/.exec(l[1] || ''); if (!m) return null;
  const crit = /natural 20/i.test(t); const fumble = /natural 1\b/i.test(t);
  const tier = fumble ? 'miss' : /weak hit/i.test(t) ? 'weak' : /\bmiss\b/i.test(t) ? 'miss' : (/hit/i.test(t) || crit) ? 'strong' : 'miss';
  const hp = /HP\s+(\d+)\/(\d+)/.exec(t); const c = t.indexOf(':');
  const two = /d20s\s+(\d+)\s+and\s+(\d+)/.exec(l[1] || ''); const other = two ? (+two[1] === +m[1] ? +two[2] : +two[1]) : null;
  return { stat: l[0], kept: +m[1], other, mod: +m[2], total: +m[3], dc: +m[4], gap: +m[3] - +m[4], tier, crit, fumble, two: !!two, hp: hp ? +hp[1] : null, action: c > 0 ? t.slice(0, c) : '' };
};
const DV3_END = { won: 'The winning blow', fallen: 'The last blow', overrun: 'The last roll', live: 'Latest roll', ended: 'Last roll played' };
const dv3Moments = (R, end) => {
  if (!R.length) return [];
  const last = R[R.length - 1]; const pool = R.slice(0, -1); const used = new Set([last.n]); const out = [];
  const take = (r, kicker, line) => { if (r && !used.has(r.n)) { used.add(r.n); out.push({ r, kicker, line }); } };
  const crit = pool.find((r) => r.crit); const best = crit || pool.filter((r) => r.tier === 'strong').sort((a, b) => b.gap - a.gap)[0];
  take(best, 'Best roll', best && (best.crit ? 'Natural 20' : 'Beat it by ' + best.gap));
  take(pool.find((r) => r.gap === 0 && !used.has(r.n)), 'Closest call', 'Made it exactly');
  const fum = pool.find((r) => r.fumble && !used.has(r.n)); const worst = fum || pool.filter((r) => r.tier === 'miss' && !used.has(r.n)).sort((a, b) => a.gap - b.gap)[0];
  take(worst, 'Worst roll', worst && (worst.fumble ? 'Natural 1' : 'Missed by ' + -worst.gap));
  out.push({ r: last, kicker: DV3_END[end], line: DV3_TIER[last.tier] });
  return out.sort((a, b) => a.r.n - b.r.n);
};
const dv3Cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
const dv3Build = (s) => {
  const stops = []; const rolls = []; const order = []; const gear = []; let cur = null; let hp = s.hpMax;
  const item = (name) => { const n = dv3Cap(name.replace(/^(a|an|the)\s+/i, '')); let g = gear.find((x) => x.name === n); if (!g) { g = { name: n, used: false }; gear.push(g); } return g; };
  const open = (name, back) => { const key = name || '_first'; if (!order.includes(key)) order.push(key);
    cur = { i: stops.length, key, name: name || 'First room', back, num: order.indexOf(key) + 1, rolls: [] }; stops.push(cur); };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Room') { const p = String(l[1]); open(p.replace(/^(Entered|Doubled back to) /, ''), /^Doubled back to /.test(p)); return; }
    if (!cur) open(null, false);
    if (l[0] === 'Gear') { const t = String(l[1]); if (/^Took /.test(t)) item(t.replace(/^Took /, '')); else if (l[2]) item(t).used = true; return; }
    if (l[0] === 'Lock') { const w = /with (.+)$/.exec(String(l[1])); if (w) item(w[1]).used = true; return; }
    const r = /^d20/.test(l[1] || '') ? dv3Roll(l) : null; if (!r) return;
    r.n = rolls.length + 1; r.stop = cur.i; r.room = cur.name; r.back = cur.back;
    r.harm = r.hp != null ? Math.max(0, hp - r.hp) : 0; if (r.hp != null) hp = r.hp;
    rolls.push(r); cur.rolls.push(r);
  });
  let run = 0; let streak = 0; rolls.forEach((r) => { run = r.tier === 'strong' ? run + 1 : 0; streak = Math.max(streak, run); });
  const end = s.unfinished ? 'ended' : s.live ? 'live' : s.end;
  const moments = dv3Moments(rolls, end);
  return { stops, rolls, gear, hp, streak, end, moments, mom: Object.fromEntries(moments.map((x) => [x.r.n, x])) };
};
const dv3Say = (r) => 'Roll ' + r.n + ', ' + r.room + ': ' + (r.action ? r.action + ', ' : '') + r.stat + ' ' + r.total + ' against ' + r.dc + ', ' + DV3_TIER[r.tier].toLowerCase() + (r.crit ? ', natural 20' : r.fumble ? ', natural 1' : '') + (r.two ? ', two dice, the higher kept' : '');

// ---- The die, as v2 (owner-agreed): strong filled green, weak filled yellow, miss empty, natural 20 rimmed, natural 1 red-edged. ----
const DV3_HEX = '18,0 36,10 36,30 18,40 0,30 0,10'; const DV3_RIM = '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8';
const Dv3Die = ({ r, size = 36, sel, nums = true }) => {
  const k = 'dv2-die is-' + r.tier + (r.crit ? ' is-crit' : '') + (r.fumble ? ' is-fumble' : '') + (sel ? ' is-sel' : '');
  return (<svg className={k} viewBox="-5 -5 46 50" width={size} height={Math.round(size * 50 / 46)} aria-hidden="true">
    {/* KEEP: on a natural 20 the hex behind moves out past the rim, so the two lines never run together (die canvas v2's fix). */}
    {/* KEEP: selected, a two-dice die stands alone (the hex behind is hidden), so nothing crosses the selection ring (owner, 2026-10-29). */}
    {r.two && size < 64 && !sel && <polygon className="gh" points={DV3_HEX} transform={r.crit ? 'translate(-7 -6.5)' : 'translate(-3.5 -3)'} />}
    <polygon className="hx" points={DV3_HEX} />
    {r.crit && <polygon className="rim" points={DV3_RIM} />}
    {nums && <text className="nm" x="18" y="20.5">{r.kept}</text>}
    {r.two && size >= 64 && <g className="tw" transform="translate(25 28) scale(.42)"><polygon points={DV3_HEX} />{nums && <text x="18" y="21">{r.other}</text>}</g>}
    <polygon className="sl" points={DV3_RIM} />
  </svg>);
};
const Dv3DieBtn = ({ r, size, act, on }) => (
  <button type="button" className="dv2-dbtn" aria-pressed={act === r.n} aria-label={dv3Say(r)} onClick={() => on.sel(r.n)} onMouseEnter={() => on.hov(r.n)} onMouseLeave={() => on.hov(null)}>
    <Dv3Die r={r} size={size} sel={act === r.n} />
  </button>);

// ---- The result statement: the word (three sets; Fallen in all), then the setting's line, with three ways to add the play's details. ----
const dv3Word = (m, w) => (m.end === 'live' ? 'In progress' : m.end === 'ended' ? 'Unfinished' : m.end === 'fallen' ? 'Fallen' : DV3_ENDW[w][m.end]);
const dv3Tone = (m) => (m.end === 'won' ? 'ok' : m.end === 'live' ? 'live' : 'bad');
const dv3Under = (s, m, u) => {
  if (m.end === 'live' || !m.rolls.length) return {};
  const base = m.end === 'ended' ? 'The week ended first' : s.result; const n = m.rolls.length; const last = m.rolls[n - 1];
  if (u === 'u3') return { line: base + (m.end === 'ended' ? ', after ' : ' after ') + n + ' rolls' };
  if (u === 'u1') return { line: base, sub: n + ' rolls · longest streak ' + m.streak };
  const sub = { won: 'Finished on roll ' + n + ', with ' + m.hp + ' of ' + s.hpMax + ' HP left', fallen: 'Last hit point lost on roll ' + n + ', in ' + last.room,
    overrun: 'Threat full on roll ' + n + ', in ' + last.room, ended: 'Stopped after roll ' + n + ', in ' + last.room }[m.end];
  return { line: base, sub };
};
const Dv3Result = ({ s, m, v }) => { const u = dv3Under(s, m, v.under);
  return (<div className="dv2-res"><div className="dv2-rw">
    <h2 className={'dv2-word is-' + dv3Tone(m)}>{dv3Word(m, v.word)}</h2>
    {u.line && <p className="dv2-sent">{u.line}</p>}
    {u.sub && <p className="dv3-sub">{u.sub}</p>}
  </div></div>); };

// ---- The character sheet: v2's placeholder (hit points, threat, gear) under its heading. Studied in E4. Rooms reached is not shown (owner). ----
const Dv3Pips = ({ n, of, label }) => (
  <span className="dv2-pips" role="img" aria-label={label}>{Array.from({ length: of }, (_, i) => <i key={i} className={i < n ? 'is-on' : ''} />)}</span>);
const Dv3Sheet = ({ s, m }) => (
  <section className="dv2-sheet" aria-labelledby="dv3-sh">
    <h3 id="dv3-sh" className="dv3-shh">Character sheet</h3>
    <p className="dv2-hero">{s.hero}</p>
    <div className="dv2-figs">
      <div className="dv2-fig"><span>Hit points</span><b>{m.hp}<small> of {s.hpMax}</small></b><Dv3Pips n={m.hp} of={s.hpMax} label={m.hp + ' of ' + s.hpMax + ' hit points left'} /></div>
      <div className="dv2-fig"><span>Threat</span><b>{s.threat}<small> of {s.threatMax}</small></b><Dv3Pips n={s.threat} of={s.threatMax} label={'Threat ' + s.threat + ' of ' + s.threatMax} /></div>
    </div>
    {m.gear.length > 0 && <p className="dv2-gear"><span>Gear</span>{m.gear.map((g) => <b key={g.name}>{g.name}{g.used && <small> used</small>}</b>)}</p>}
  </section>);

// ---- The held roll, three designs on one set of facts (the spec's: room, action, stat and total against the target, outcome,
// natural, two dice, hit points lost). The moment line ("Natural 20", "Made it exactly"…) is a switch: it is still an open question. ----
const dv3Held = (m, r, showLine) => {
  const x = m.mom[r.n]; const tier = DV3_TIER[r.tier]; const nat = r.crit ? 'Natural 20' : r.fumble ? 'Natural 1' : null;
  const line = showLine && x && x.line && x.line !== tier ? x.line : null;
  return { x, tier, line, nat: nat && nat !== line ? nat : null, kick: x ? x.kicker : 'Roll ' + r.n, num: x ? 'Roll ' + r.n : null,
    room: (r.back ? 'Back in ' : '') + r.room, mod: (r.mod < 0 ? '− ' : '+ ') + Math.abs(r.mod), two: r.two ? 'Kept ' + r.kept + ' over ' + r.other : null,
    harm: r.harm ? 'Lost ' + r.harm + ' HP' : null, tcls: r.fumble ? 'fumble' : r.tier };
};
const Dv3Head = ({ h }) => (<div className="dv3-hk"><p className="dv3-k">{h.kick}</p>{h.num && <p className="dv3-n">{h.num}</p>}</div>);
// KEEP: a key moment's held box carries an off-white diamond in its top right corner; the route's dice are never marked (owner, 2026-10-28).
const Dv3Band = ({ h }) => (h.x ? <i className="dv3-mk" role="img" aria-label="Key moment" /> : null);
const dv3Cls = (h, k) => 'dv3-held is-' + k + (h.x ? ' is-mo' : '');
const Dv3HeldLedger = ({ r, h }) => (
  <div className={dv3Cls(h, 'ledger')}><Dv3Band h={h} />
    <div className="dv3-lh"><Dv3Die r={r} size={72} /><div className="dv3-lht"><Dv3Head h={h} />{h.line && <p className="dv3-line">{h.line}</p>}</div></div>
    <dl className="dv3-dl">
      <div><dt>Room</dt><dd>{h.room}</dd></div>
      {r.action && <div><dt>Action</dt><dd>{r.action}</dd></div>}
      <div><dt>Roll</dt><dd>{r.stat} {r.total} <span>vs {r.dc}</span></dd></div>
      {h.two && <div><dt>Two dice</dt><dd>{h.two}</dd></div>}
      <div><dt>Outcome</dt><dd className={'is-' + h.tcls}>{h.tier}</dd></div>
      {h.harm && <div><dt>Cost</dt><dd>{h.harm}</dd></div>}
    </dl>
  </div>);
// KEEP: the bar runs from 0 to the larger of 24 and the total, so a big roll never spills past its end.
const Dv3HeldSum = ({ r, h }) => { const max = Math.max(24, r.total, r.dc + 4); const pc = (n) => Math.max(0, Math.min(100, n / max * 100)) + '%';
  return (<div className={dv3Cls(h, 'sum')}><Dv3Band h={h} />
    <p className="dv3-eye">{h.room}{r.action && ' · ' + r.action}</p>
    <Dv3Head h={h} />
    {h.line && <p className="dv3-line">{h.line}</p>}
    <div className="dv3-eq" aria-label={'Rolled ' + r.kept + ', ' + h.mod + ' ' + r.stat + ', total ' + r.total + ', needed ' + r.dc}>
      <Dv3Die r={r} size={52} /><span className="op">{h.mod}</span><span className="op">=</span><b>{r.total}</b>
    </div>
    <p className="dv3-cap">{r.stat}{h.two && ' · ' + h.two.toLowerCase()}</p>
    <div className={'dv3-gauge is-' + h.tcls} aria-hidden="true"><i style={{ width: pc(r.total) }} /><b style={{ left: pc(r.dc) }}><span>needed {r.dc}</span></b></div>
    <p className={'dv3-tier is-' + h.tcls}>{h.tier}{h.nat && <span>{h.nat}</span>}</p>
    {h.harm && <p className="dv3-cap">{h.harm}</p>}
  </div>); };
const Dv3HeldBoard = ({ r, h }) => (
  <div className={dv3Cls(h, 'board')}><Dv3Band h={h} />
    <div className="dv3-bh"><Dv3Die r={r} size={44} /><div className="dv3-lht"><Dv3Head h={h} /><p className="dv3-n">{h.room}</p></div></div>
    {h.line && <p className="dv3-line">{h.line}</p>}
    <div className="dv3-sb"><div><b>{r.total}</b><span>rolled</span></div><div><b>{r.dc}</b><span>needed</span></div></div>
    <p className={'dv3-tier is-' + h.tcls}>{h.tier}{h.nat && <span>{h.nat}</span>}</p>
    <p className="dv2-facts">{[r.action, r.stat + ' ' + h.mod, h.two, h.harm].filter(Boolean).map((f, i) => <span key={i}>{f}</span>)}</p>
  </div>);
const Dv3Held = ({ m, act, v, on }) => { const r = act ? m.rolls[act - 1] : null; if (!r) return null; const h = dv3Held(m, r, v.line);
  // v8 drops the two-dice row: the die's own drawing already shows both dice. Other pages keep it.
  if (window.DV_NO_TWO) h.two = null;
  const D = { h1: Dv3HeldLedger, h2: Dv3HeldSum, h3: Dv3HeldBoard }[v.held];
  return <div className="dv3-live" aria-live="polite"><D r={r} h={h} /></div>; };

const Dv3StopHead = ({ st }) => (
  <span className="dvA2-head" aria-label={(st.back ? 'Back to ' : 'Room ' + st.num + ', ') + st.name}>
    <span className={'dv2-num' + (st.back ? ' is-back' : '')}>{st.back && <i aria-hidden="true">↩</i>}{st.num}</span><span className="dv2-sname">{st.name}</span></span>);

// ---- E: the route, a column per room stood in; a moment is its own die, drawn large, with no title. The held roll beside it. ----
const Dv3E = ({ m, act, on, v }) => {
  const sel = act ? m.rolls[act - 1].stop : null;
  return (<div className="dvE-main">
    <div className={'dvA2-route is-e is-cols-' + v.cols} aria-label="The way you went">{m.stops.map((st) => (
      <div key={st.i} className={'dvA2-stop' + (sel === st.i ? ' is-on' : '')}>
        <Dv3StopHead st={st} />
        <div className="dvA2-dice">{st.rolls.length ? st.rolls.map((r) => (m.mom[r.n]
          ? <span key={r.n} className="dvE-mom"><Dv3DieBtn r={r} act={act} on={on} size={52} /></span>
          : <Dv3DieBtn key={r.n} r={r} act={act} on={on} size={30} />)) : <i className="dv2-pass" aria-label="No rolls" />}</div>
      </div>))}</div>
    <div className="dvE-side"><Dv3Held m={m} act={act} v={v} /></div>
  </div>);
};

// ---- The body. KEEP: hover lights a roll and fills the held roll; a press holds it; it opens on the last roll. ----
const Dv3Body = ({ s }) => {
  const v = useDv3(); const m = React.useMemo(() => dv3Build(s), [s]);
  const [sel, setSel] = React.useState(() => (m.rolls.length ? m.rolls.length : null)); const [hov, setHov] = React.useState(null);
  const on = { sel: setSel, hov: setHov }; const act = hov || sel;
  return <>
    <section className="dv2" aria-label="How the run went">
      <div className="dv2-top"><Dv3Result s={s} m={m} v={v} /><Dv3Sheet s={s} m={m} /></div>
      <Dv3E m={m} act={act} on={on} v={v} />
    </section>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv3Body key={p.sid} {...p} /> };
window.GS_SESSION_QUIET = { ...(window.GS_SESSION_QUIET || {}), delve: (s) => ({ label: s.game, h1: s.setting || s.game }) };

// ---- The bar. ----
const Dv3Bar = () => {
  const v = useDv3();
  // KEEP: retries until the page has landed, since main's own mount effects can put the route back after the first go.
  const open = (play) => { let n = 0; const id = DV3_SIDS[play]; const go = () => { const g = window.gsApi; n += 1; if (n > 30) return;
    if (!g) return setTimeout(go, 300);
    if (g.view !== 'pass') { g.setView('pass'); return setTimeout(go, 300); }
    if (g.route.name !== 'session' || g.route.id !== id) { g.go('session', { id }, 'pass'); return setTimeout(go, 300); } }; setTimeout(go, 600); };
  React.useEffect(() => { open(v.play); }, []);
  const G = ({ label, opts, cur, onPick }) => (
    <div className="dv1b-grp" role="group" aria-label={label}><span className="dv1b-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="dv1b-chip" aria-pressed={cur === x} onClick={() => onPick(x)}>{l}</button>)}</div>);
  return (<>
    <div className="dv1b" role="group" aria-label="Playground controls, not part of the product">
      <G label="Play" opts={DV3_PLAYS} cur={v.play} onPick={(x) => { dv3Set({ play: x }); open(x); }} />
      <G label="Concept" opts={DV3_CONCEPT_OPTS} cur={v.concept} onPick={(x) => dv3Set({ concept: x })} />
      <button type="button" className="dv1b-chip" aria-pressed={v.why} onClick={() => dv3Set({ why: !v.why })}>Why</button>
    </div>
    {v.why && <div className="dv1b-why"><p>{DV3_WHY[v.concept]}</p></div>}
  </>);
};
// v4 loads this file for its session card and brings its own bar, so it sets DV3_NO_BAR first.
(() => { if (window.DV3_NO_BAR) return; const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv3Bar />); })();
