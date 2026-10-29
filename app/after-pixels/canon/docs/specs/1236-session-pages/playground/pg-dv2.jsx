// Playground (1236, Delve v2): Delve's session page, from the owner's review of v1. The main build, whole, loaded by
// delve-v2.html with pg-dv-seed.jsx (the sample plays) first. The bar: Result (three forms of the result statement),
// Concept (A Route fixed, C Moments fixed, E Route with the moments in it, F One line with callouts), Play, Why.
// One die (Hex). Hover lights a roll and fills the held-roll panel, which stays in view at every width. Nothing in app/ changes.

const DV2_KEY = 'pg_delve-session_v2';
const DV2_ROWS = {
  result: ['word', [['word', 'Word'], ['mark', 'Word + mark'], ['sheet', 'Sheet']]],
  concept: ['A', [['A', 'A · Route'], ['C', 'C · Moments'], ['E', 'E · Route, moments in it'], ['F', 'F · One line']]],
};
const DV2_PLAYS = [['won', 'Won'], ['fallen', 'Fallen'], ['hard', 'Overrun · hard'], ['live', 'In progress'], ['ended', 'Week ended']];
const DV2_WHY = {
  A: 'A, fixed: a column per room stood in, ↩ for going back; the moments above say why each matters; the held roll stays in view under the route.',
  C: 'C, fixed: the moments lead, no letters; the run is a strip by room with the held roll filling the right; on a phone, one row per room.',
  E: 'A, played with: no tile row; each moment is drawn large in its own column and labelled there; the held roll sits beside the route.',
  F: 'C, played with: the run as one line split by room, each moment called out above its die, the held roll under the line.',
  word: 'Result, Word: the ending in one word, as Escape’s “Escaped” and Word’s “Solved”; the setting’s own words under it.',
  mark: 'Result, Word + mark: the word beside what decided it: the last die, or the threat track when it filled.',
  sheet: 'Result, Sheet: the hero heads a character sheet; the ending word holds its top right, as the shared form has “Solved”.',
};

const dv2Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV2_KEY) || '{}'); } catch (e) {}
  const o = Object.fromEntries(Object.entries(DV2_ROWS).map(([k, [d, opts]]) => [k, opts.some((x) => x[0] === v[k]) ? v[k] : d]));
  o.play = DV2_PLAYS.some((x) => x[0] === v.play) ? v.play : 'hard'; o.why = !!v.why; return o; };
const dv2Set = (patch) => { const n = { ...dv2Get(), ...patch }; try { localStorage.setItem(DV2_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv2')); return n; };
const useDv2 = () => { const [v, setV] = React.useState(dv2Get); React.useEffect(() => { const f = () => setV(dv2Get()); window.addEventListener('dv2', f); return () => window.removeEventListener('dv2', f); }, []); return v; };

const DV2_SIDS = { won: 'dv2-won', fallen: 'dv2-fallen', hard: 'dv2-hard', live: 'dv2-live', ended: 'dv2-ended' };
Object.assign(GS_SESSIONS, dvSessions('dv2'));

// ---- The model: the record's lines read into the rooms stood in (going back included), the rolls and the gear. ----
const DV2_TIER = { strong: 'Strong hit', weak: 'Weak hit', miss: 'Miss' };
const dv2Roll = (l) => {
  const t = String(l[2] || ''); const m = /(?:kept|d20)\s+(\d+)\s*\+\s*(-?\d+)\s*=\s*(-?\d+)\s+vs\s+(\d+)/.exec(l[1] || ''); if (!m) return null;
  const crit = /natural 20/i.test(t); const fumble = /natural 1\b/i.test(t);
  const tier = fumble ? 'miss' : /weak hit/i.test(t) ? 'weak' : /\bmiss\b/i.test(t) ? 'miss' : (/hit/i.test(t) || crit) ? 'strong' : 'miss';
  const hp = /HP\s+(\d+)\/(\d+)/.exec(t); const c = t.indexOf(':');
  const two = /d20s\s+(\d+)\s+and\s+(\d+)/.exec(l[1] || ''); const other = two ? (+two[1] === +m[1] ? +two[2] : +two[1]) : null;
  return { stat: l[0], kept: +m[1], other, mod: +m[2], total: +m[3], dc: +m[4], gap: +m[3] - +m[4], tier, crit, fumble, two: !!two, hp: hp ? +hp[1] : null, action: c > 0 ? t.slice(0, c) : '' };
};
const DV2_END = { won: 'The winning blow', fallen: 'The last blow', overrun: 'The last roll', live: 'Latest roll', ended: 'Last roll played' };
// Each moment says why it is one (the kicker), then what it was (the line).
const dv2Moments = (R, end) => {
  if (!R.length) return [];
  const last = R[R.length - 1]; const pool = R.slice(0, -1); const used = new Set([last.n]); const out = [];
  const take = (r, kind, kicker, line) => { if (r && !used.has(r.n)) { used.add(r.n); out.push({ r, kind, kicker, line }); } };
  const crit = pool.find((r) => r.crit); const best = crit || pool.filter((r) => r.tier === 'strong').sort((a, b) => b.gap - a.gap)[0];
  take(best, 'best', 'Best roll', best && (best.crit ? 'Natural 20' : 'Beat it by ' + best.gap));
  take(pool.find((r) => r.gap === 0 && !used.has(r.n)), 'exact', 'Closest call', 'Made it exactly');
  const fum = pool.find((r) => r.fumble && !used.has(r.n)); const worst = fum || pool.filter((r) => r.tier === 'miss' && !used.has(r.n)).sort((a, b) => a.gap - b.gap)[0];
  take(worst, 'worst', 'Worst roll', worst && (worst.fumble ? 'Natural 1' : 'Missed by ' + -worst.gap));
  out.push({ r: last, kind: 'end', kicker: DV2_END[end], line: DV2_TIER[last.tier] });
  return out.sort((a, b) => a.r.n - b.r.n);
};
const dv2Cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
const dv2Build = (s) => {
  const stops = []; const rolls = []; const order = []; const gear = []; let cur = null; let hp = s.hpMax;
  const item = (name) => { const n = dv2Cap(name.replace(/^(a|an|the)\s+/i, '')); let g = gear.find((x) => x.name === n); if (!g) { g = { name: n, used: false }; gear.push(g); } return g; };
  const open = (name, back) => { const key = name || '_first'; if (!order.includes(key)) order.push(key);
    cur = { i: stops.length, key, name: name || 'First room', back, num: order.indexOf(key) + 1, rolls: [] }; stops.push(cur); };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Room') { const p = String(l[1]); open(p.replace(/^(Entered|Doubled back to) /, ''), /^Doubled back to /.test(p)); return; }
    if (!cur) open(null, false);
    // A use names the gear and nothing of what it did, since that could give a foe's weakness away.
    if (l[0] === 'Gear') { const t = String(l[1]); if (/^Took /.test(t)) item(t.replace(/^Took /, '')); else if (l[2]) item(t).used = true; return; }
    if (l[0] === 'Lock') { const w = /with (.+)$/.exec(String(l[1])); if (w) item(w[1]).used = true; return; }
    const r = /^d20/.test(l[1] || '') ? dv2Roll(l) : null; if (!r) return;
    r.n = rolls.length + 1; r.stop = cur.i; r.room = cur.name; r.back = cur.back;
    r.harm = r.hp != null ? Math.max(0, hp - r.hp) : 0; if (r.hp != null) hp = r.hp;
    rolls.push(r); cur.rolls.push(r);
  });
  let run = 0; let streak = 0; rolls.forEach((r) => { run = r.tier === 'strong' ? run + 1 : 0; streak = Math.max(streak, run); });
  const end = s.unfinished ? 'ended' : s.live ? 'live' : s.end;
  const moments = dv2Moments(rolls, end);
  return { stops, rolls, gear, hp, streak, end, moments, mom: Object.fromEntries(moments.map((x) => [x.r.n, x])) };
};
const dv2Say = (r) => 'Roll ' + r.n + ', ' + r.room + ': ' + (r.action ? r.action + ', ' : '') + r.stat + ' ' + r.total + ' against ' + r.dc + ', ' + DV2_TIER[r.tier].toLowerCase() + (r.crit ? ', natural 20' : r.fumble ? ', natural 1' : '') + (r.two ? ', two dice, the higher kept' : '');

// ---- The die: a flat hex, read without a legend. Strong hit: filled green. Weak hit: filled yellow. Miss: empty. A natural 20
// gets a green outer rim; a natural 1 is a miss with a red edge (owner, 2026-10-28: weak hit plain yellow, natural 1 as 1a). Two d20 (owner, 2026-10-28): from 64px the other die sits small at its corner with the number not
// kept; under 64px, where that number can't show, a second hex sits behind, offset up and left (v1's mark). ----
const DV2_HEX = '18,0 36,10 36,30 18,40 0,30 0,10'; const DV2_RIM = '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8';
const Dv2Die = ({ r, size = 36, sel, nums = true }) => {
  const k = 'dv2-die is-' + r.tier + (r.crit ? ' is-crit' : '') + (r.fumble ? ' is-fumble' : '') + (sel ? ' is-sel' : '');
  return (<svg className={k} viewBox="-5 -5 46 50" width={size} height={Math.round(size * 50 / 46)} aria-hidden="true">
    {r.two && size < 64 && <polygon className="gh" points={DV2_HEX} transform="translate(-3.5 -3)" />}
    <polygon className="hx" points={DV2_HEX} />
    {r.crit && <polygon className="rim" points={DV2_RIM} />}
    {nums && <text className="nm" x="18" y="20.5">{r.kept}</text>}
    {r.two && size >= 64 && <g className="tw" transform="translate(25 28) scale(.42)"><polygon points={DV2_HEX} />{nums && <text x="18" y="21">{r.other}</text>}</g>}
    <polygon className="sl" points={DV2_RIM} />
  </svg>);
};
const Dv2DieBtn = ({ r, size, act, on, nums }) => (
  <button type="button" className="dv2-dbtn" aria-pressed={act === r.n} aria-label={dv2Say(r)} onClick={() => on.sel(r.n)} onMouseEnter={() => on.hov(r.n)} onMouseLeave={() => on.hov(null)}>
    <Dv2Die r={r} size={size} sel={act === r.n} nums={nums} />
  </button>);

// ---- The result statement, three forms. The outcome is said once, by the word; nothing under it repeats it. ----
const DV2_WORD = { won: 'Won', fallen: 'Fallen', overrun: 'Overrun', live: 'In progress', ended: 'Unfinished' };
const dv2Sent = (s, m) => (m.end === 'live' ? null : m.end === 'ended' ? 'The week ended first' : s.result);
const dv2Tone = (m) => (m.end === 'won' ? 'ok' : m.end === 'live' ? 'live' : 'bad');
const Dv2Pips = ({ n, of, label, big }) => (
  <span className={'dv2-pips' + (big ? ' is-big' : '')} role="img" aria-label={label}>{Array.from({ length: of }, (_, i) => <i key={i} className={i < n ? 'is-on' : ''} />)}</span>);
const Dv2Result = ({ s, m, form }) => {
  const sent = dv2Sent(s, m); const tone = dv2Tone(m); const last = m.rolls[m.rolls.length - 1];
  const words = <div className="dv2-rw"><h2 className={'dv2-word is-' + tone}>{DV2_WORD[m.end]}</h2>{sent && <p className="dv2-sent">{sent}</p>}</div>;
  if (form === 'mark') {
    // KEEP: the mark is what decided the run: the threat track when it filled, else the last die. Nothing for a run not over.
    const mark = m.end === 'overrun' ? <Dv2Pips n={s.threat} of={s.threatMax} big label={'Threat full, ' + s.threat + ' of ' + s.threatMax} />
      : (m.end === 'won' || m.end === 'fallen') && last ? <Dv2Die r={last} size={64} /> : null;
    return <div className="dv2-res is-mark">{mark && <span className={'dv2-mk is-' + tone}>{mark}</span>}{words}</div>;
  }
  return <div className="dv2-res">{words}</div>;
};
// ---- The character sheet: the hero, hit points, threat, rooms reached, and gear when the run took or used any. ----
const Dv2Sheet = ({ s, m, hero = true }) => (
  <div className="dv2-sheet">
    {hero && <p className="dv2-hero">{s.hero}</p>}
    <div className="dv2-figs">
      <div className="dv2-fig"><span>Hit points</span><b>{m.hp}<small> of {s.hpMax}</small></b><Dv2Pips n={m.hp} of={s.hpMax} label={m.hp + ' of ' + s.hpMax + ' hit points left'} /></div>
      <div className="dv2-fig"><span>Threat</span><b>{s.threat}<small> of {s.threatMax}</small></b><Dv2Pips n={s.threat} of={s.threatMax} label={'Threat ' + s.threat + ' of ' + s.threatMax} /></div>
      <div className="dv2-fig"><span>Rooms reached</span><b>{s.reached}<small> of {s.rooms}</small></b><Dv2Pips n={s.reached} of={s.rooms} label={s.reached + ' of ' + s.rooms + ' rooms'} /></div>
    </div>
    {m.gear.length > 0 && <p className="dv2-gear"><span>Gear</span>{m.gear.map((g) => <b key={g.name}>{g.name}{g.used && <small> used</small>}</b>)}</p>}
  </div>);
const Dv2Top = ({ s, m, form }) => (form === 'sheet'
  ? <div className="dv2-top is-sheet">
      <div className="dv2-sh-head"><div className="dv2-rw"><h2 className="dv2-heroh">{s.hero}</h2>{dv2Sent(s, m) && <p className="dv2-sent">{dv2Sent(s, m)}</p>}</div>
        <span className={'dv2-word is-sm is-' + dv2Tone(m)}>{DV2_WORD[m.end]}</span></div>
      <Dv2Sheet s={s} m={m} hero={false} />
    </div>
  : <div className="dv2-top"><Dv2Result s={s} m={m} form={form} /><Dv2Sheet s={s} m={m} /></div>);

// ---- The held roll: what the picked roll was, its facts kept whole so a line breaks between them, never inside one. ----
const Dv2Held = ({ m, act, big, bar, noLine }) => {
  const r = act ? m.rolls[act - 1] : null; if (!r) return null; const x = m.mom[r.n];
  const facts = [r.back ? 'Back in ' + r.room : r.room, r.action, r.stat + ' ' + r.total + ' vs ' + r.dc, DV2_TIER[r.tier],
    r.crit ? 'natural 20' : r.fumble ? 'natural 1' : null, r.two ? 'two dice, kept ' + r.kept + ' over ' + r.other : null, r.harm ? 'lost ' + r.harm + ' HP' : null].filter((f) => f && (noLine || !(x && String(f).toLowerCase() === String(x.line).toLowerCase())));
  return (<div className={'dv2-held' + (bar ? ' is-bar' : '') + (big ? ' is-big' : '')} aria-live="polite">
    {big && <Dv2Die r={r} size={88} />}
    <div className="dv2-held-t">
      <p className="dv2-held-k">{x ? x.kicker : 'Roll ' + r.n}{x && <span> · roll {r.n}</span>}</p>
      {x && !noLine && <p className="dv2-held-h">{x.line}</p>}
      <p className="dv2-facts">{facts.map((f, i) => <span key={i}>{f}</span>)}</p>
    </div>
  </div>);
};
const Dv2Mom = ({ x, act, on, size = 44, cls = '' }) => (
  <button type="button" className={'dv2-mom ' + cls} aria-pressed={act === x.r.n} onClick={() => on.sel(x.r.n)} onMouseEnter={() => on.hov(x.r.n)} onMouseLeave={() => on.hov(null)}>
    <Dv2Die r={x.r} size={size} sel={act === x.r.n} />
    <span className="dv2-mom-t"><span className="dv2-mom-k">{x.kicker}</span><span className="dv2-mom-h">{x.line}</span><span className="dv2-mom-r">{x.r.room}</span></span>
  </button>);
const Dv2StopHead = ({ st, cls }) => (
  <span className={cls} aria-label={(st.back ? 'Back to ' : 'Room ' + st.num + ', ') + st.name}>
    <span className={'dv2-num' + (st.back ? ' is-back' : '')}>{st.back && <i aria-hidden="true">↩</i>}{st.num}</span><span className="dv2-sname">{st.name}</span></span>);

// ---- A · Route, fixed. ----
const Dv2A = ({ m, act, on }) => {
  const sel = act ? m.rolls[act - 1].stop : null;
  return (<div className="dvA2">
    <div className="dv2-moms" style={{ '--n': m.moments.length }}>{m.moments.map((x) => <Dv2Mom key={x.r.n} x={x} act={act} on={on} cls="is-a" />)}</div>
    <div className="dvA2-route" aria-label="The way you went">{m.stops.map((st) => (
      <div key={st.i} className={'dvA2-stop' + (sel === st.i ? ' is-on' : '')}>
        <Dv2StopHead st={st} cls="dvA2-head" />
        <div className="dvA2-dice">{st.rolls.length ? st.rolls.map((r) => <Dv2DieBtn key={r.n} r={r} act={act} on={on} size={36} />) : <i className="dv2-pass" aria-label="No rolls" />}</div>
      </div>))}</div>
    <Dv2Held m={m} act={act} bar />
  </div>);
};

// ---- C · Moments, fixed. ----
const Dv2C = ({ m, act, on }) => {
  const sel = act ? m.rolls[act - 1].stop : null;
  return (<div className="dvC2">
    <div className="dv2-moms" style={{ '--n': m.moments.length }}>{m.moments.map((x) => <Dv2Mom key={x.r.n} x={x} act={act} on={on} size={72} cls="is-c" />)}</div>
    <div className="dvC2-run">
      <div className="dvC2-strip" aria-label="Every roll, by room">{m.stops.filter((st) => st.rolls.length).map((st) => (
        <div key={st.i} className={'dvC2-seg' + (sel === st.i ? ' is-on' : '')}>
          <Dv2StopHead st={st} cls="dvC2-segh" />
          <div className="dvC2-segd">{st.rolls.map((r) => (
            <span key={r.n} className={'dvC2-cell' + (m.mom[r.n] ? ' is-mom' : '')}><Dv2DieBtn r={r} act={act} on={on} size={28} nums={false} /></span>))}</div>
        </div>))}</div>
      <div className="dvC2-side"><Dv2Held m={m} act={act} big /></div>
      <div className="dvC2-bar"><Dv2Held m={m} act={act} bar /></div>
    </div>
  </div>);
};

// ---- E · Route, the moments in it: no tile row; a moment is its own die, large and labelled in its column. ----
const Dv2E = ({ m, act, on }) => {
  const sel = act ? m.rolls[act - 1].stop : null;
  return (<div className="dvE">
    <div className="dvE-main">
      <div className="dvA2-route is-e" aria-label="The way you went">{m.stops.map((st) => (
        <div key={st.i} className={'dvA2-stop' + (sel === st.i ? ' is-on' : '')}>
          <Dv2StopHead st={st} cls="dvA2-head" />
          <div className="dvA2-dice">{st.rolls.length ? st.rolls.map((r) => { const x = m.mom[r.n];
            return x ? <span key={r.n} className="dvE-mom"><span className="dvE-k">{x.kicker}</span><Dv2DieBtn r={r} act={act} on={on} size={52} /></span>
              : <Dv2DieBtn key={r.n} r={r} act={act} on={on} size={30} />; }) : <i className="dv2-pass" aria-label="No rolls" />}</div>
        </div>))}</div>
      <div className="dvE-side"><Dv2Held m={m} act={act} big noLine /></div>
    </div>
  </div>);
};

// ---- F · One line: every roll in order, split by room, the moments called out above their own dice. ----
const Dv2F = ({ m, act, on }) => {
  const sel = act ? m.rolls[act - 1].stop : null; let k = 0;
  return (<div className="dvF">
    <div className="dvE-chips is-f">{m.moments.map((x) => <Dv2Mom key={x.r.n} x={x} act={act} on={on} size={28} cls="is-chip" />)}</div>
    <div className="dvF-line" aria-label="Every roll, by room">{m.stops.filter((st) => st.rolls.length).map((st) => (
      <div key={st.i} className={'dvF-band' + (sel === st.i ? ' is-on' : '')} style={{ flexGrow: st.rolls.length }}>
        <div className="dvF-dice">{st.rolls.map((r) => { const x = m.mom[r.n]; const lane = x ? (k++) % 2 : 0;
          return (<span key={r.n} className={'dvF-cell' + (x ? ' is-mom' : '')}>
            {x && <span className={'dvF-call is-l' + lane + (act === r.n ? ' is-on' : '')}>{x.kicker}</span>}
            <Dv2DieBtn r={r} act={act} on={on} size={x ? 40 : 28} nums={!!x} /></span>); })}</div>
        <Dv2StopHead st={st} cls="dvF-head" />
      </div>))}</div>
    <Dv2Held m={m} act={act} big />
    <div className="dvF-bar"><Dv2Held m={m} act={act} bar /></div>
  </div>);
};

// ---- The body. KEEP: hover lights a roll and fills the held-roll panel; a press holds it; it opens on the last roll. The
// panel is always in view (beside the picture, or pinned to the screen's foot on a phone), so nothing changes out of sight. ----
const Dv2Body = ({ s }) => {
  const v = useDv2(); const m = React.useMemo(() => dv2Build(s), [s]);
  const [sel, setSel] = React.useState(() => (m.rolls.length ? m.rolls.length : null)); const [hov, setHov] = React.useState(null);
  const on = { sel: setSel, hov: setHov }; const act = hov || sel;
  const P = { A: Dv2A, C: Dv2C, E: Dv2E, F: Dv2F }[v.concept];
  return <>
    <section className="dv2" aria-label="How the run went"><Dv2Top s={s} m={m} form={v.result} /><P m={m} act={act} on={on} /></section>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv2Body key={p.sid} {...p} /> };
window.GS_SESSION_QUIET = { ...(window.GS_SESSION_QUIET || {}), delve: (s) => ({ label: s.game, h1: s.setting || s.game }) };

// ---- The bar. ----
const Dv2Bar = () => {
  const v = useDv2();
  // KEEP: retries until the page has landed, since main's own mount effects can put the route back after the first go.
  const open = (play) => { let n = 0; const id = DV2_SIDS[play]; const go = () => { const g = window.gsApi; n += 1; if (n > 30) return;
    if (!g) return setTimeout(go, 300);
    if (g.view !== 'pass') { g.setView('pass'); return setTimeout(go, 300); }
    if (g.route.name !== 'session' || g.route.id !== id) { g.go('session', { id }, 'pass'); return setTimeout(go, 300); } }; setTimeout(go, 600); };
  React.useEffect(() => { open(v.play); }, []);
  const G = ({ label, opts, cur, onPick }) => (
    <div className="dv1b-grp" role="group" aria-label={label}><span className="dv1b-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="dv1b-chip" aria-pressed={cur === x} onClick={() => onPick(x)}>{l}</button>)}</div>);
  return (<>
    <div className="dv1b" role="group" aria-label="Playground controls, not part of the product">
      <G label="Result" opts={DV2_ROWS.result[1]} cur={v.result} onPick={(x) => dv2Set({ result: x })} />
      <G label="Concept" opts={DV2_ROWS.concept[1]} cur={v.concept} onPick={(x) => dv2Set({ concept: x })} />
      <G label="Play" opts={DV2_PLAYS} cur={v.play} onPick={(x) => { dv2Set({ play: x }); open(x); }} />
      <button type="button" className="dv1b-chip" aria-pressed={v.why} onClick={() => dv2Set({ why: !v.why })}>Why</button>
    </div>
    {v.why && <div className="dv1b-why"><p>{DV2_WHY[v.concept]}</p><p>{DV2_WHY[v.result]}</p></div>}
  </>);
};
(() => { const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv2Bar />); })();
