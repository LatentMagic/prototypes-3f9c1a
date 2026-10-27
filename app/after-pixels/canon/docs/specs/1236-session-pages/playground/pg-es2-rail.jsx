// ============================================================================
// Playground (1236), v2: the hooks into the app and the bar. Escape's THIS WEEK card (PzNow) and the session page's own part
// (window.GS_SESSION_BODY) take the chosen version of the lock row. Everything else is the store as built.
// ============================================================================
const PG2_OPTS = [
  { n: 1, name: 'Out above',
    stance: 'Par and your exit both sit above the bar, so the result is read where the bar ends. Under the bar, only the door numbers on the card.',
    cost: 'On the card the doors carry numbers, not names: you open the session page to see which lock is which.' },
  { n: 2, name: 'Named doors',
    stance: 'Each door is named under the bar, and the last door is labelled with your time out. The result line moves up beside the title, so the row is the whole card body.',
    cost: 'Names close together stack into extra rows, so the card grows taller with a busy play.' },
  { n: 3, name: 'The gap',
    stance: 'The bar ends at par or your exit, whichever is later. The minutes between them are named above the bar: spare when under, over when over (also shaded).',
    cost: 'Your exact time is read off the result line, not the bar. Doors carry numbers on the card, as in 1.' },
];
const PG2_SHARED = 'Shared by all three: one result line in place of two ("Escaped, 2 min under par" or "Escaped, 11 min over par", over par in the warning colour, or "In progress"), then moves and hints. The rule and "See what’s out for you to play" are gone. The session page is the same row at page size: each door named, with its minute, tries, hints and near misses, and a small mark above a door for each near miss that isn’t the closest. The moments sit under it. Every move is the store’s plain list, collapsed, and is the same in every version.';
const PG2_EITHER = 'The either-or rides on the way out as one short line, "The chimney hatch closed." It names the other exit and nothing about how to find either, so it gives nothing away.';
const PG2_STATES = [['under', 'Under par'], ['over', 'Over par'], ['live', 'In progress']];

window.GS_SESSION_BODY = { escape: (props) => { const v = usePge(); return <Pg2Body key={v.opt + props.sid} {...props} />; } };
const PG2_SHIP_NOW = window.PzNow;
window.PzNow = (props) => (props.id !== 'escape' || props.none ? <PG2_SHIP_NOW {...props} /> : <Pg2Card c={props.c} />);

const pg2Api = () => window.gsApi;
const pg2Ring = (sel) => setTimeout(() => {
  const el = document.querySelector(sel); if (!el) return;
  const sc = el.closest('.kit-phone-screen');
  if (sc) sc.scrollTop = Math.max(0, el.offsetTop - 80); else window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 96) });
  el.classList.add('pge-ring'); setTimeout(() => el.classList.remove('pge-ring'), 1600);
}, (window.GS_LOAD_MS || 600) + 250);
const PG2_ROUTES = [
  { n: 1, short: 'Library card', path: 'Library → Escape', go: () => { pg2Api().go('library'); setTimeout(() => { pg2Api().go('escape', { page: 'record' }); pg2Ring('.pg2-now'); }, 60); } },
  { n: 2, short: 'Session page', path: 'Library → Escape → See every move', go: () => {
    pg2Api().go('library');
    setTimeout(() => { pg2Api().go('escape', { page: 'record' }); setTimeout(() => { const a = pg2Api(); a.go('session', { id: pgeSid(a) }); pg2Ring('.pg2-sess'); }, (window.GS_LOAD_MS || 600) + 100); }, 60);
  } },
];
const pg2SetState = (k) => {
  const gs = pg2Api(); if (!gs) return;
  PgeStore.set(k === 'live' ? { live: true } : { finish: k, live: false });
  gs.setReview({ week: k === 'live' ? 'live' : 'done' });
  const r = gs.route; const s = r.name === 'session' && GS_SESSIONS[r.id];
  if (s && s.gid === 'escape') setTimeout(() => { const a = pg2Api(); a.go('session', { id: pgeSid(a) }); }, 0);
};

const Pg2Bar = () => {
  const v = usePge(); const gs = pg2Api(); const st = gs ? pgeState(gs) : v.finish; const o = PG2_OPTS[v.opt - 1] || PG2_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { const h = document.documentElement; h.classList.toggle('pge-bar-on', !v.folded); h.classList.toggle('pge-bar-off', !!v.folded); }, [v.folded]);
  if (v.folded) return <button type="button" className="pge-tab" onClick={() => PgeStore.set({ folded: false })} aria-label="Show the playground bar"><b>{o.n}</b><span>{o.name + ' · ' + PG2_STATES.find((x) => x[0] === st)[1]}</span><DS.Icon name="down" size={16} /></button>;
  return <>
    <div className="pge-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pge-eyebrow">PLAYGROUND v2</span>
      <div className="pge-bgrp" role="group" aria-label="Version">
        <span className="pge-lab">Version</span>
        {PG2_OPTS.map((x) => <button key={x.n} type="button" className="pge-chip" aria-pressed={v.opt === x.n} onClick={() => PgeStore.set({ opt: x.n })}><b>{x.n}</b>{x.name}</button>)}
        <button type="button" className="pge-link" onClick={() => setWhy(true)}>Why</button>
      </div>
      <div className="pge-bgrp" role="group" aria-label="This week’s room">
        <span className="pge-lab">Room</span>
        {PG2_STATES.map(([k, l]) => <button key={k} type="button" className="pge-chip" aria-pressed={st === k} onClick={() => pg2SetState(k)}>{l}</button>)}
      </div>
      <div className="pge-bgrp" role="group" aria-label="Go to">
        <span className="pge-lab">Go to</span>
        {PG2_ROUTES.map((x) => <button key={x.n} type="button" className="pge-chip is-go" title={x.path} onClick={x.go}>{x.short}</button>)}
      </div>
      <button type="button" className="pge-fold" aria-label="Hide the playground bar" title="Hide (keys still work: 1 to 3, S)" onClick={() => PgeStore.set({ folded: true })}><DS.Icon name="down" size={20} /></button>
    </div>
    <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title={o.n + ' · ' + o.name}>
      <div className="pge-why"><p><b>For it:</b> {o.stance}</p><p><b>Cost:</b> {o.cost}</p><p>{PG2_SHARED}</p><p><b>Either-or:</b> {PG2_EITHER}</p></div>
    </DS.Popup>
  </>;
};
const PG2_ORDER = PG2_STATES.map((x) => x[0]);
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
  if (['1', '2', '3'].includes(e.key)) PgeStore.set({ opt: Number(e.key) });
  else if (e.key === 's' || e.key === 'S') { const gs = pg2Api(); if (!gs) return; const i = PG2_ORDER.indexOf(pgeState(gs)); pg2SetState(PG2_ORDER[(i + 1) % PG2_ORDER.length]); }
});

let pg2Opened = false;
window.KitCandidate = {
  bind() {
    if (pg2Opened) return; pg2Opened = true;
    setTimeout(() => { const a = window.gsApi; a.setView('pass'); a.setConnected(true); if (PgeStore.get().live) a.setReview({ week: 'live' }); a.go('escape', { page: 'record' }, 'pass'); }, 0);
  },
};
const Pg2Tick = () => { const [, t] = React.useReducer((x) => x + 1, 0); React.useEffect(() => { const id = setInterval(t, 400); return () => clearInterval(id); }, []); return <Pg2Bar />; };
(() => { const el = document.createElement('div'); el.id = 'pge-chrome'; document.body.appendChild(el); ReactDOM.createRoot(el).render(<Pg2Tick />); })();
