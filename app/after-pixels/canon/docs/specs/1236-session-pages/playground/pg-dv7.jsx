// Playground (1236, Delve v7): the session card's result statement, four ways, on the settled sheet (1H Band; M1 on a phone).
// Loaded by delve-v7.html after pg-dv6.jsx, whose sheet it mounts as it is. Nothing in app/ changes.
// KEEP: the result carries the ending word and its line only; the roll count and longest streak are left to the share card (owner, 2026-10-29).

const DV7_KEY = 'pg_delve-session_v7';
const DV7_RES = [['today', 'Today'], ['3', '3 · Band'], ['3g', '3 · Band, no hairline'], ['2a', '2A · Roll box']];
const DV7_WHY = {
  today: 'Today: the word over the setting\'s line over the tally, on the left of the row above the route.',
  '3': '3 · Band. The word and its line on one row, split by a hairline as the sheet\'s groups are. Word at 28px; the line in the body face, Hanken Grotesk 600 at 16px. No tally. On a phone the line sits under the word (24px), without the hairline.',
  '3g': '3 · Band, no hairline. As 3, with 24px of space where the hairline was.',
  '2a': '2A · Roll box. No row above the route. The box beside it opens on the result: the word, its line, and the roll it ended on, which opens that roll. Pick any die and the box shows that roll; pick it again, or "Back to the result", and the result returns. Cost: while a roll is open the result is out of view.',
};
const DV7_Q = Object.fromEntries(new URLSearchParams(location.search));
const dv7Get = () => { let v = {}; try { v = JSON.parse(localStorage.getItem(DV7_KEY) || '{}'); } catch (e) {} v = { ...v, ...DV7_Q };
  const ok = (opts, x, d) => (opts.some((o) => o[0] === x) ? x : d);
  return { res: ok(DV7_RES, v.res, '3'), play: ok(DV4_PLAYS, v.play, 'won'), why: !!v.why && !DV7_Q.bare }; };
const dv7Set = (patch) => { const n = { ...dv7Get(), ...patch }; try { localStorage.setItem(DV7_KEY, JSON.stringify(n)); } catch (e) {} window.dispatchEvent(new Event('dv7')); return n; };
const useDv7 = () => { const [v, setV] = React.useState(dv7Get); React.useEffect(() => { const f = () => setV(dv7Get()); window.addEventListener('dv7', f); return () => window.removeEventListener('dv7', f); }, []); return v; };

const dv7Line = (s, m) => (m.end === 'live' ? null : m.end === 'ended' ? 'The week ended first' : s.result);
const Dv7ResBand = ({ s, m, gap }) => { const line = dv7Line(s, m);
  return (<div className={'dv7r-band' + (gap ? ' is-gap' : '')}>
    <h2 className={'dv7r-word is-' + dv3Tone(m)}>{dv3Word(m, DV4_CARD.word)}</h2>
    {line && <p className="dv7r-line">{line}</p>}
  </div>); };

// 2A: the result as the held box's resting state.
const Dv7ResBox = ({ s, m, onOpen }) => { const line = dv7Line(s, m); const last = m.rolls[m.rolls.length - 1];
  const kick = last && (m.mom[last.n] ? m.mom[last.n].kicker : DV3_END[m.end]);
  return (<div className="dv3-live" aria-live="polite"><div className="dv3-held dv7r-box">
    <div className="dv7r-bw"><h2 className={'dv7r-word is-' + dv3Tone(m)}>{dv3Word(m, DV4_CARD.word)}</h2>{line && <p className="dv7r-line">{line}</p>}</div>
    {last && <button type="button" className="dv7r-last" onClick={() => onOpen(last.n)} aria-label={'Open ' + kick + ', roll ' + last.n}>
      <Dv3Die r={last} size={44} /><span className="dv3-lht"><span className="dv3-k">{kick}</span><span className="dv3-n">Roll {last.n}</span></span><DS.Icon name="next" size={20} /></button>}
  </div></div>); };

const Dv7Card = ({ s, m, res }) => {
  const box = res === '2a';
  // KEEP: in 2A the box opens on the result; elsewhere it opens on the last roll, as today.
  const [sel, setSel] = React.useState(() => (box || !m.rolls.length ? null : m.rolls.length)); const [hov, setHov] = React.useState(null);
  React.useEffect(() => { setSel(box || !m.rolls.length ? null : m.rolls.length); }, [box]);
  const pick = (n) => setSel((p) => (box && p === n ? null : n));
  const on = { sel: pick, hov: setHov }; const act = hov || sel;
  return (<section className={'dv2 dv7r is-' + res} aria-label="How the run went">
    {res === 'today' && <div className="dv2-top"><Dv3Result s={s} m={m} v={DV4_CARD} /></div>}
    {(res === '3' || res === '3g') && <Dv7ResBand s={s} m={m} gap={res === '3g'} />}
    {box && !act ? <Dv7Route m={m} act={act} on={on} side={<Dv7ResBox s={s} m={m} onOpen={setSel} />} />
      : <Dv7Route m={m} act={act} on={on} side={<>{box && sel && <div className="dv7r-back"><DS.TextLink onClick={() => { setSel(null); setHov(null); }}>Back to the result</DS.TextLink></div>}<Dv3Held m={m} act={act} v={DV4_CARD} /></>} />}
  </section>);
};
// v3's route (Dv3E), with the side slot passed in so 2A can put the result there.
const Dv7Route = ({ m, act, on, side }) => {
  const sel = act ? m.rolls[act - 1].stop : null;
  return (<div className="dvE-main">
    <div className={'dvA2-route is-e is-cols-' + DV4_CARD.cols} aria-label="The way you went">{m.stops.map((st) => (
      <div key={st.i} className={'dvA2-stop' + (sel === st.i ? ' is-on' : '')}>
        <Dv3StopHead st={st} />
        <div className="dvA2-dice">{st.rolls.length ? st.rolls.map((r) => (m.mom[r.n]
          ? <span key={r.n} className="dvE-mom"><Dv3DieBtn r={r} act={act} on={on} size={52} /></span>
          : <Dv3DieBtn key={r.n} r={r} act={act} on={on} size={30} />)) : <i className="dv2-pass" aria-label="No rolls" />}</div>
      </div>))}</div>
    <div className="dvE-side">{side}</div>
  </div>);
};

const Dv7Body = ({ s }) => {
  const v = useDv7(); const m = React.useMemo(() => dv3Build(s), [s]); const c = React.useMemo(() => dv4Sheet(s, m), [s, m]);
  return <>
    <div className="dv4-lay"><Dv7Band c={c} fold="m1" /><Dv7Card key={v.res} s={s} m={m} res={v.res} /></div>
    <section className="es-every">
      <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
        <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </DS.Disclosure>
    </section>
  </>;
};
window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), delve: (p) => <Dv7Body key={p.sid} {...p} /> };

const Dv7PgBar = () => {
  const v = useDv7();
  // KEEP: retries until the page has landed, since main's own mount effects can put the route back after the first go.
  const open = (play) => { let n = 0; const id = DV4_SIDS[play]; const go = () => { const g = window.gsApi; n += 1; if (n > 30) return;
    if (!g) return setTimeout(go, 300);
    if (g.view !== 'pass') { g.setView('pass'); return setTimeout(go, 300); }
    if (g.route.name !== 'session' || g.route.id !== id) { g.go('session', { id }, 'pass'); return setTimeout(go, 300); } }; setTimeout(go, 600); };
  React.useEffect(() => { open(v.play); }, []);
  const G = ({ label, opts, cur, onPick }) => (
    <div className="dv1b-grp" role="group" aria-label={label}><span className="dv1b-lab">{label}</span>
      {opts.map(([x, l]) => <button key={x} type="button" className="dv1b-chip" aria-pressed={cur === x} onClick={() => onPick(x)}>{l}</button>)}</div>);
  if (DV7_Q.bare) return null;
  return (<>
    <div className="dv1b" role="group" aria-label="Playground controls, not part of the product">
      <G label="Play" opts={DV4_PLAYS} cur={v.play} onPick={(x) => { dv7Set({ play: x }); open(x); }} />
      <G label="Result" opts={DV7_RES} cur={v.res} onPick={(x) => dv7Set({ res: x })} />
      <button type="button" className="dv1b-chip" aria-pressed={v.why} onClick={() => dv7Set({ why: !v.why })}>Why</button>
    </div>
    {v.why && <div className="dv1b-why"><p>{DV7_WHY[v.res]}</p></div>}
  </>);
};
// v8 loads this file for its card and brings its own bar, so it sets DV7_NO_BAR first.
(() => { if (window.DV7_NO_BAR) return; const el = document.createElement('div'); document.body.insertBefore(el, document.body.firstChild); ReactDOM.createRoot(el).render(<Dv7PgBar />); })();
