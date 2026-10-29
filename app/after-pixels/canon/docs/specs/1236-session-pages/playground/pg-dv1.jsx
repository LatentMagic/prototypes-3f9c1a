// Playground (1236, Delve v1): Delve's session page, four concepts. The main build, whole, loaded by delve-v1.html, with a
// fixed bar: Concept (A Route, B Descent, C Four rolls, D Rooms), Die (Hex, Stone, Mark), Play (Won, Fallen, Overrun (the hard
// play), In progress, Week ended) and Why. Every concept shares the store's quiet head, the result statement, the three
// figures, the moment rule and Every move; only the picture of the run differs. Nothing in app/ changes.
// The playground's own sample plays use kind 'delve-pg' so the session page's Delve branch (app/gs-session.jsx) passes them
// to GS_SESSION_BODY like Escape's; the store's own 'delve' record is untouched.

const DV1_KEY = 'pg_delve-session_v1';
const DV1_ROWS = {
  concept: ['A', [['A', 'A · Route'], ['B', 'B · Descent'], ['C', 'C · Four rolls'], ['D', 'D · Rooms']]],
  die: ['hex', [['hex', 'Hex'], ['stone', 'Stone'], ['mark', 'Mark']]],
};
const DV1_PLAYS = [['won', 'Won'], ['fallen', 'Fallen'], ['hard', 'Overrun · hard'], ['live', 'In progress'], ['ended', 'Week ended']];
const DV1_WHY = {
  A: { name: 'Route', stance: 'The run read left to right as the way you went: one column per room you stood in, numbered as you first entered it, its rolls stacked under it. Going back is a column with the room’s number again. The moments sit above as four tiles.', link: 'A tile lights its die and its room’s column; a die on the route lights its tile, or names the roll under the route.' },
  B: { name: 'Descent', stance: 'The run as a stair going down the page: each room a step, set further in the deeper you went, so going back steps out again. The moments are flags on their step; on a laptop the one you pick is drawn large beside the stair.', link: 'A flag lights its die and its step and fills the side; on a phone the moment opens under its own step, so the flag and the picture are on screen together.' },
  C: { name: 'Four rolls', stance: 'The moments are the page: four big dice in the order they came, lettered A to D. The whole run runs under them as one strip of small dice, split by room, the four letters marked over their dice.', link: 'A big die lights its letter on the strip and its room; a small die names its roll under the strip.' },
  D: { name: 'Rooms', stance: 'The run kept by place: one tile per room, its visits inside it in order, so a room you went back to holds both visits. The route underneath is the order you went, as room numbers.', link: 'A moment’s label in a room lights its die; a number on the route lights that visit in its room.' },
};
const DV1_RULE = 'Moments, every concept: the big success (the first natural 20, else the strong hit that beat the target by most), the roll made exactly (total equal to the target), the big miss (the first natural 1, else the miss that fell shortest), and the last roll. A roll is used once; one that isn’t there is left out. They show in the order they came.';

const dv1Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV1_KEY) || '{}'); } catch (e) {}
  const o = Object.fromEntries(Object.entries(DV1_ROWS).map(([k, [d, opts]]) => [k, opts.some((x) => x[0] === v[k]) ? v[k] : d]));
  o.play = DV1_PLAYS.some((x) => x[0] === v.play) ? v.play : 'won'; o.why = !!v.why; return o; };
const dv1Set = (patch) => { const n = { ...dv1Get(), ...patch }; try { localStorage.setItem(DV1_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv1')); return n; };
const useDv1 = () => { const [v, setV] = React.useState(dv1Get); React.useEffect(() => { const f = () => setV(dv1Get()); window.addEventListener('dv1', f); return () => window.removeEventListener('dv1', f); }, []); return v; };

// The sample plays are held once, in pg-dv-seed.jsx.
const DV1_SIDS = { won: 'dv1-won', fallen: 'dv1-fallen', hard: 'dv1-hard', live: 'dv1-live', ended: 'dv1-ended' };
Object.assign(GS_SESSIONS, dvSessions('dv1'));

// ---- The model: the record's lines read into the rooms stood in (in order, going back included) and the rolls. ----
const DV1_TIER = { strong: 'Strong hit', weak: 'Weak hit', miss: 'Miss' };
const dv1Roll = (l) => {
  const t = String(l[2] || ''); const m = /(?:kept|d20)\s+(\d+)\s*\+\s*(-?\d+)\s*=\s*(-?\d+)\s+vs\s+(\d+)/.exec(l[1] || ''); if (!m) return null;
  const crit = /natural 20/i.test(t); const fumble = /natural 1\b/i.test(t);
  const tier = fumble ? 'miss' : /weak hit/i.test(t) ? 'weak' : /\bmiss\b/i.test(t) ? 'miss' : (/hit/i.test(t) || crit) ? 'strong' : 'miss';
  const hp = /HP\s+(\d+)\/(\d+)/.exec(t); const c = t.indexOf(':');
  const total = +m[3]; const dc = +m[4];
  const two = /d20s\s+(\d+)\s+and\s+(\d+)/.exec(l[1] || ''); const other = two ? (+two[1] === +m[1] ? +two[2] : +two[1]) : null;
  return { stat: l[0], kept: +m[1], other, mod: +m[2], total, dc, gap: total - dc, tier, crit, fumble, two: !!two, hp: hp ? +hp[1] : null, action: c > 0 ? t.slice(0, c) : '' };
};
// A use names the gear and nothing of what it did to the foe, since that could give a weakness away.
const dv1Note = (l) => (l[0] === 'Turn' ? l[2] : l[0] === 'Oracle' ? 'Asked the oracle' : l[0] === 'Gear' && l[2] ? 'Used ' + String(l[1]).replace(/^A /, 'a ') : l[1]);
const DV1_LAST = { won: 'The blow that won it', fallen: 'The blow that ended it', overrun: 'The last roll', live: 'The latest roll', ended: 'The last roll played' };
const dv1Moments = (R, end) => {
  if (!R.length) return [];
  const last = R[R.length - 1]; const pool = R.slice(0, -1); const used = new Set([last.n]); const out = [];
  const take = (r, kind, title) => { if (r && !used.has(r.n)) { used.add(r.n); out.push({ r, kind, title }); } };
  const crit = pool.find((r) => r.crit); const best = pool.filter((r) => r.tier === 'strong').sort((a, b) => b.gap - a.gap)[0];
  take(crit || best, 'success', crit ? 'A natural 20' : best ? 'Beat it by ' + best.gap : '');
  take(pool.find((r) => r.gap === 0 && !used.has(r.n)), 'exact', 'Made it exactly');
  const fum = pool.find((r) => r.fumble && !used.has(r.n)); const worst = pool.filter((r) => r.tier === 'miss' && !used.has(r.n)).sort((a, b) => a.gap - b.gap)[0];
  take(fum || worst, 'miss', fum ? 'A natural 1' : worst ? 'Missed by ' + -worst.gap : '');
  out.push({ r: last, kind: 'end', title: DV1_LAST[end] });
  return out.sort((a, b) => a.r.n - b.r.n).map((x, i) => ({ ...x, letter: 'ABCD'[i] }));
};
const dv1Build = (s) => {
  const stops = []; const rolls = []; const order = []; let cur = null; let hp = s.hpMax;
  const open = (name, back, cost) => { const key = name || '_first'; if (!order.includes(key)) order.push(key);
    cur = { i: stops.length, key, name: name || 'First room', back, cost: cost || '', num: order.indexOf(key) + 1, rolls: [], notes: [] }; stops.push(cur); };
  (s.lines || []).forEach((l) => {
    if (l[0] === 'Room') { const p = String(l[1]); open(p.replace(/^(Entered|Doubled back to) /, ''), /^Doubled back to /.test(p), l[2]); return; }
    if (!cur) open(null, false);
    const r = /^d20/.test(l[1] || '') ? dv1Roll(l) : null;
    if (!r) { cur.notes.push(dv1Note(l)); return; }
    r.n = rolls.length + 1; r.stop = cur.i; r.room = cur.name; r.num = cur.num;
    r.harm = r.hp != null ? Math.max(0, hp - r.hp) : 0; if (r.hp != null) hp = r.hp;
    rolls.push(r); cur.rolls.push(r);
  });
  let run = 0; let streak = 0; rolls.forEach((r) => { run = r.tier === 'strong' ? run + 1 : 0; streak = Math.max(streak, run); });
  const end = s.unfinished ? 'ended' : s.live ? 'live' : s.end;
  const rooms = order.map((k) => ({ key: k, num: order.indexOf(k) + 1, name: k === '_first' ? 'First room' : k, visits: stops.filter((x) => x.key === k) }));
  return { stops, rolls, rooms, hp, streak, end, moments: dv1Moments(rolls, end) };
};
// Share text, as delve.md § Sharing gives it: setting; hero, ending, rolls and longest streak; one mark a roll.
['dv1-won', 'dv1-fallen', 'dv1-hard'].forEach((id) => { const s = GS_SESSIONS[id]; const m = dv1Build(s);
  s.share = s.result; s.shareLines = [s.setting, s.hero + ' · ' + (s.end === 'won' ? '✅ ' : '❌ ') + s.result + ' · ' + m.rolls.length + ' rolls · longest streak ' + m.streak,
    m.rolls.map((r) => (r.crit ? '✨' : r.fumble ? '💀' : r.tier === 'strong' ? '🟩' : r.tier === 'weak' ? '🟨' : '🟥')).join('')]; });

const dv1Short = (r) => (r.action || r.stat) + ' · ' + r.total + ' vs ' + r.dc;
const dv1Facts = (r) => [r.stat + ' ' + r.total + ' vs ' + r.dc, DV1_TIER[r.tier] + (r.two ? ', the higher of two dice' : ''), r.harm ? 'lost ' + r.harm + ' HP' : null].filter(Boolean).join(' · ');
const dv1Say = (r) => 'Roll ' + r.n + ', ' + r.room + ': ' + (r.action ? r.action + ', ' : '') + r.stat + ' ' + r.total + ' against ' + r.dc + ', ' + DV1_TIER[r.tier].toLowerCase() + (r.crit ? ', natural 20' : r.fumble ? ', natural 1' : '');

// ---- The die, three drawings on one 36×40 frame. Every one: strong hit filled green, weak hit an amber outline, miss a dark
// mark; a natural 20 gets a second rim, a natural 1 a crack, two d20 a second shape behind (Mark: the other die's total).
// Hex: a flat d20 outline with the kept number. Stone: a block with one corner cut, the logo's asymmetry, kept number.
// Mark: the check itself, a bar as tall as the total against a line at the target, so made-it-exactly touches the line. ----
const DV1_POLY = {
  hex: { body: '18,0 36,10 36,30 18,40 0,30 0,10', rim: '18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8', crack: '3,11 9,19 5,26 9,33', ny: 20.5 },
  stone: { body: '0,2 26,2 36,12 36,38 0,38', rim: '-3,-1 27.2,-1 39,10.8 39,41 -3,41', crack: '5,8 11,16 6,24 11,32', ny: 21 },
};
const DV1_MAX = 24; const dv1Y = (t) => 28 - Math.max(0, Math.min(DV1_MAX, t)) * 28 / DV1_MAX;
const Dv1Die = ({ r, size = 36, sel, style, nums = true }) => {
  const k = 'dv1-die st-' + (style || 'hex') + ' is-' + r.tier + (r.crit ? ' is-crit' : '') + (r.fumble ? ' is-fumble' : '') + (sel ? ' is-sel' : '');
  const svg = (kids) => <svg className={k} viewBox="-4 -4 44 48" width={size} height={Math.round(size * 48 / 44)} aria-hidden="true">{kids}</svg>;
  if (style === 'mark') {
    // KEEP: the bar stands on a base at 28 with the target line across it; the total sits under the base, clear of both.
    const top = Math.min(26.5, dv1Y(r.total)); const gTop = r.two ? Math.min(26.5, dv1Y(r.other + r.mod)) : 0;
    return svg(<>
      {r.two && <rect className="gh" x="4" y={gTop} width="18" height={28 - gTop} />}
      <rect className="hx" x="9" y={top} width="18" height={28 - top} />
      {r.crit && <rect className="rim" x="6" y={top - 3} width="24" height={31 - top} />}
      <line className="tl" x1="0" x2="36" y1={dv1Y(r.dc)} y2={dv1Y(r.dc)} />
      {r.fumble && <polyline className="ck" points={'9,' + (top - 3) + ' 15,' + (top - 8) + ' 21,' + (top - 3) + ' 27,' + (top - 8)} />}
      {nums && <text className="nm out" x="18" y="36">{r.total}</text>}
      <rect className="sl" x="2" y="-3" width="32" height="46" />
    </>);
  }
  const P = DV1_POLY[style] || DV1_POLY.hex;
  return svg(<>
    {r.two && <polygon className="gh" points={P.body} transform="translate(-3.5 -3)" />}
    <polygon className="hx" points={P.body} />
    {r.crit && <polygon className="rim" points={P.rim} />}
    {r.fumble && <polyline className="ck" points={P.crack} />}
    {nums && <text className="nm" x="18" y={P.ny}>{r.kept}</text>}
    <polygon className="sl" points={P.rim} />
  </>);
};
const Dv1DieBtn = ({ r, size, act, on, style, nums }) => (
  <button type="button" className="dv1-dbtn" aria-pressed={act === r.n} aria-label={dv1Say(r)} onClick={() => on.sel(r.n)} onMouseEnter={() => on.hov(r.n)} onMouseLeave={() => on.hov(null)}>
    <Dv1Die r={r} size={size} sel={act === r.n} style={style} nums={nums} />
  </button>);

// ---- Shared: the result statement and the three figures. ----
const Dv1Result = ({ s, m }) => {
  const tone = m.end === 'won' ? 'ok' : m.end === 'live' ? 'live' : 'bad';
  const word = m.end === 'live' ? 'In progress' : m.end === 'ended' ? 'The week ended first' : s.result;
  const how = { won: 'Won', fallen: 'Fallen', overrun: 'Overrun', live: 'Still in the run', ended: 'Not finished' }[m.end];
  return (<div className="dv1-res"><h2 className={'dv1-h is-' + tone}>{word}</h2><p className="dv1-sub">{s.hero} · {how}</p></div>);
};
const Dv1Pips = ({ n, of, thin, label }) => (
  <span className={'dv1-pips' + (thin ? ' is-thin' : '')} role="img" aria-label={label}>{Array.from({ length: of }, (_, i) => <i key={i} className={i < n ? 'is-on' : ''} />)}</span>);
const Dv1Figs = ({ s, m }) => (
  <div className="dv1-figs">
    <div className="dv1-fig"><span>Rooms reached</span><b>{s.reached}<small> of {s.rooms}</small></b><Dv1Pips n={s.reached} of={s.rooms} label={s.reached + ' of ' + s.rooms + ' rooms'} /></div>
    <div className="dv1-fig"><span>Threat{s.threat >= s.threatMax ? ', full' : ''}</span><b>{s.threat}<small> of {s.threatMax}</small></b><Dv1Pips n={s.threat} of={s.threatMax} thin label={'Threat ' + s.threat + ' of ' + s.threatMax} /></div>
    <div className="dv1-fig"><span>Hit points</span><b>{m.hp}<small> of {s.hpMax}</small></b><Dv1Pips n={m.hp} of={s.hpMax} thin label={m.hp + ' of ' + s.hpMax + ' hit points left'} /></div>
  </div>);
// One line naming the picked roll, or the picked room.
const Dv1Detail = ({ m, act, stop }) => {
  const r = act ? m.rolls[act - 1] : null; const st = r ? m.stops[r.stop] : stop != null ? m.stops[stop] : null;
  if (!st) return <p className="dv1-detail">{'\u00a0'}</p>;
  const notes = st.notes.length ? ' · ' + st.notes.join(' · ') : '';
  if (!r) return <p className="dv1-detail"><b>Room {st.num} · {st.name}</b>{st.back ? ' · went back' + (st.cost ? ', ' + st.cost : '') : ''}{notes} · {st.rolls.length === 1 ? '1 roll' : st.rolls.length + ' rolls'}</p>;
  return <p className="dv1-detail"><b>Roll {r.n} · {st.name}</b>{r.action ? ' · ' + r.action : ''} · {dv1Facts(r)}{r.crit ? ' · natural 20' : r.fumble ? ' · natural 1' : ''}</p>;
};
const Dv1Mom = ({ x, act, on, style, size = 44, cls = '', facts = true, letter }) => (
  <button type="button" className={'dv1-mom ' + cls} aria-pressed={act === x.r.n} onClick={() => on.sel(x.r.n)} onMouseEnter={() => on.hov(x.r.n)} onMouseLeave={() => on.hov(null)}>
    {letter && <span className="dv1-let">{x.letter}</span>}
    <Dv1Die r={x.r} size={size} style={style} />
    <span className="dv1-mom-t">
      <span className="dv1-mom-k">{x.r.room}</span>
      <span className="dv1-mom-h">{x.title}</span>
      {facts && <span className="dv1-mom-f">{dv1Short(x.r)}</span>}
    </span>
  </button>);

// ---- A · Route: one column per room stood in, left to right; its rolls stacked under it. ----
const Dv1A = ({ m, act, on, style }) => {
  const sel = act ? m.rolls[act - 1].stop : null;
  return (<div className="dvA">
    <div className="dvA-moms" style={{ '--n': m.moments.length }}>{m.moments.map((x) => <Dv1Mom key={x.r.n} x={x} act={act} on={on} style={style} cls="is-a" />)}</div>
    <div className="dvA-route" aria-label="The way you went">
      {m.stops.map((st) => (
        <div key={st.i} className={'dvA-stop' + (st.back ? ' is-back' : '') + (sel === st.i ? ' is-on' : '')}>
          <div className="dvA-head"><span className="dvA-num">{st.num}</span><span className="dvA-name">{st.name}</span><span className="dvA-back">{st.back ? 'Back' : '\u00a0'}</span></div>
          <div className="dvA-dice">{st.rolls.length ? st.rolls.map((r) => <Dv1DieBtn key={r.n} r={r} act={act} on={on} style={style} size={36} />) : <i className="dvA-pass" title="Passed through" />}</div>
        </div>))}
    </div>
    <Dv1Detail m={m} act={act} />
  </div>);
};

// ---- B · Descent: each room a step down the page, deeper rooms further in; the moments are flags on their step. ----
const Dv1B = ({ m, act, on, style }) => {
  const sel = act ? m.rolls[act - 1].stop : null; const mom = m.moments.find((x) => x.r.n === act);
  return (<div className="dvB">
    <div className="dvB-stair" aria-label="The way you went">
      {m.stops.map((st) => {
        const flags = m.moments.filter((x) => x.r.stop === st.i);
        return (<div key={st.i} className={'dvB-row' + (sel === st.i ? ' is-on' : '')} style={{ '--d': st.num - 1 }}>
          <span className="dvB-num">{st.num}</span>
          <span className="dvB-name">{st.name}{st.back && <small>went back</small>}{!st.back && st.notes.length > 0 && <small>{st.notes.join(' · ')}</small>}</span>
          {st.rolls.length > 0 && <div className="dvB-dice">{st.rolls.map((r) => <Dv1DieBtn key={r.n} r={r} act={act} on={on} style={style} size={32} />)}</div>}
          {flags.length > 0 && <div className="dvB-flags">{flags.map((x) => <button key={x.r.n} type="button" className="dvB-flag" aria-pressed={act === x.r.n} onClick={() => on.sel(x.r.n)} onMouseEnter={() => on.hov(x.r.n)} onMouseLeave={() => on.hov(null)}>{x.title}</button>)}</div>}
          {sel === st.i && <div className="dvB-inline"><Dv1Detail m={m} act={act} /></div>}
        </div>);
      })}
    </div>
    <aside className="dvB-side">
      {mom ? <div className="dvB-big"><Dv1Die r={mom.r} size={96} style={style} /><span className="dv1-mom-k">{mom.r.room}</span><span className="dvB-bigh">{mom.title}</span><span className="dv1-mom-f">{dv1Short(mom.r)}</span></div>
        : <div className="dvB-big">{act && <Dv1Die r={m.rolls[act - 1]} size={96} style={style} />}<Dv1Detail m={m} act={act} /></div>}
      <div className="dvB-list">{m.moments.map((x) => <Dv1Mom key={x.r.n} x={x} act={act} on={on} style={style} size={28} facts={false} cls="is-b" />)}</div>
    </aside>
  </div>);
};

// ---- C · Four rolls: the moments set large, lettered; the whole run as one strip under them, split by room. ----
const Dv1C = ({ m, act, on, style }) => {
  const sel = act ? m.rolls[act - 1].stop : null; const lt = Object.fromEntries(m.moments.map((x) => [x.r.n, x.letter]));
  return (<div className="dvC">
    <div className="dvC-moms" style={{ '--n': m.moments.length }}>{m.moments.map((x) => <Dv1Mom key={x.r.n} x={x} act={act} on={on} style={style} size={80} cls="is-c" letter />)}</div>
    <div className="dvC-strip" aria-label="Every roll, by room">
      {m.stops.filter((st) => st.rolls.length).map((st) => (
        <div key={st.i} className={'dvC-seg' + (sel === st.i ? ' is-on' : '')}>
          <span className="dvC-segh"><b>{st.num}</b><span>{st.back ? 'Back' : st.name}</span></span>
          <div className="dvC-segd">{st.rolls.map((r) => (
            <span key={r.n} className="dvC-cell"><span className={'dvC-mk' + (lt[r.n] ? ' is-on' : '')}>{lt[r.n] || ''}</span><Dv1DieBtn r={r} act={act} on={on} style={style} size={26} nums={false} /></span>))}</div>
        </div>))}
    </div>
    <Dv1Detail m={m} act={act} />
  </div>);
};

// ---- D · Rooms: one tile per room, its visits inside it in order; the route under them as room numbers. ----
const Dv1D = ({ m, act, on, style, stop, setStop }) => {
  const selStop = act ? m.rolls[act - 1].stop : stop;
  return (<div className="dvD">
    <div className="dvD-map">{m.rooms.map((rm) => (
      <section key={rm.key} className={'dvD-room' + (rm.visits.some((v) => v.i === selStop) ? ' is-on' : '')} aria-label={'Room ' + rm.num + ', ' + rm.name}>
        <div className="dvD-rh"><span className="dvA-num">{rm.num}</span><span className="dvD-name">{rm.name}</span></div>
        {rm.visits.map((v, j) => (
          <div key={v.i} className={'dvD-visit' + (v.i === selStop ? ' is-on' : '')}>
            {rm.visits.length > 1 && <span className="dvD-vl">{j === 0 ? 'First visit' : 'Went back'}</span>}
            {v.rolls.length > 0 && <div className="dvD-dice">{v.rolls.map((r) => <Dv1DieBtn key={r.n} r={r} act={act} on={on} style={style} size={30} />)}</div>}
            {m.moments.filter((x) => x.r.stop === v.i).map((x) => <button key={x.r.n} type="button" className="dvB-flag" aria-pressed={act === x.r.n} onClick={() => on.sel(x.r.n)} onMouseEnter={() => on.hov(x.r.n)} onMouseLeave={() => on.hov(null)}>{x.title}</button>)}
          </div>))}
      </section>))}</div>
    <div className="dvD-route" aria-label="The way you went">{m.stops.map((st, i) => (
      <React.Fragment key={st.i}>{i > 0 && <span className="dvD-arr" aria-hidden="true">{st.back ? '←' : '→'}</span>}
        <button type="button" className="dvD-step" aria-pressed={selStop === st.i} aria-label={'Room ' + st.num + ', ' + st.name + (st.back ? ', went back' : '')} onClick={() => setStop(st.i)}>{st.num}</button></React.Fragment>))}</div>
    <Dv1Detail m={m} act={act} stop={act ? null : stop} />
  </div>);
};

// ---- The body: result and figures, the concept's picture, Every move (the store's list, collapsed, as Escape has it). ----
// KEEP: hovering a moment or a die previews it; a press holds it. It opens on the last roll.
const Dv1Body = ({ s, sid }) => {
  const v = useDv1(); const m = React.useMemo(() => dv1Build(s), [s]);
  const [sel, setSel] = React.useState(() => (m.rolls.length ? m.rolls.length : null)); const [hov, setHov] = React.useState(null); const [stop, setStopS] = React.useState(null);
  const on = { sel: (n) => { setSel(n); setStopS(null); }, hov: setHov };
  const setStop = (i) => { setStopS(i); setSel(null); };
  const act = hov || sel;
  const P = { A: Dv1A, B: Dv1B, C: Dv1C, D: Dv1D }[v.concept];
  return <>
    <section className="dv1" aria-label="How the run went">
      <div className="dv1-top"><Dv1Result s={s} m={m} /><Dv1Figs s={s} m={m} /></div>
      <P m={m} act={act} on={on} style={v.die} stop={stop} setStop={setStop} />
    </section>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv1Body key={p.sid} {...p} /> };
// The head as Escape's: the game's name over the setting's, the date and Share; no result or figures.
window.GS_SESSION_QUIET = { ...(window.GS_SESSION_QUIET || {}), delve: (s) => ({ label: s.game, h1: s.setting || s.game }) };

// ---- The bar. ----
const Dv1Bar = () => {
  const v = useDv1();
  // KEEP: retries until the page has landed, since main's own mount effects (landing, reset) can put the route back after the first go.
  const open = (play) => { let n = 0; const id = DV1_SIDS[play]; const go = () => { const g = window.gsApi; n += 1; if (n > 30) return;
    if (!g) return setTimeout(go, 300);
    if (g.view !== 'pass') { g.setView('pass'); return setTimeout(go, 300); }
    if (g.route.name !== 'session' || g.route.id !== id) { g.go('session', { id }, 'pass'); return setTimeout(go, 300); } }; setTimeout(go, n ? 0 : 600); };
  React.useEffect(() => { open(v.play); }, []);
  const G = ({ label, opts, cur, onPick }) => (
    <div className="dv1b-grp" role="group" aria-label={label}><span className="dv1b-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="dv1b-chip" aria-pressed={cur === x} onClick={() => onPick(x)}>{l}</button>)}</div>);
  const w = DV1_WHY[v.concept];
  return (<>
    <div className="dv1b" role="group" aria-label="Playground controls, not part of the product">
      <G label="Concept" opts={DV1_ROWS.concept[1]} cur={v.concept} onPick={(x) => dv1Set({ concept: x })} />
      <G label="Die" opts={DV1_ROWS.die[1]} cur={v.die} onPick={(x) => dv1Set({ die: x })} />
      <G label="Play" opts={DV1_PLAYS} cur={v.play} onPick={(x) => { dv1Set({ play: x }); open(x); }} />
      <button type="button" className="dv1b-chip" aria-pressed={v.why} onClick={() => dv1Set({ why: !v.why })}>Why</button>
    </div>
    {v.why && <div className="dv1b-why"><b>{v.concept} · {w.name}</b><p>{w.stance}</p><p><b>Link.</b> {w.link}</p><p>{DV1_RULE}</p></div>}
  </>);
};
(() => { const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv1Bar />); })();
