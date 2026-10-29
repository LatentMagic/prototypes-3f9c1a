// ============================================================================
// Playground (1236): the hooks into the real app and the playground's own panel. The session page's own part (the seam
// window.GS_SESSION_BODY in app/gs-session.jsx) and Escape's THIS WEEK card (PzNow) take the chosen option; everything else
// is the store as built. The panel is docked at 1024px and wider; below it, a strip above the demo bar opens it as a sheet.
// ============================================================================
const PGE_OPTS = [
  { n: 1, name: 'The line', Body: Pge1Body, Pic: Pge1Pic,
    stance: 'The only score is time against par, so the minutes are one bar. Each lock is the cover’s door at the minute it gave way, with what it cost written under it. Every move is a row of squares you step through, a door after each lock.',
    cost: 'Moves are read one at a time, so the play can’t be scanned whole. Locks close together stack their labels into extra rows.',
    spoil: 'Shows everything: the room’s replies, near misses and each lock’s story line, one move at a time. No typed answer is ever printed.',
    moments: 'A moment is a move: picking one steps the move reader to it and lights its door on the line.' },
  { n: 2, name: 'The rail', Body: Pge2Body, Pic: Pge2Pic,
    stance: 'The play reads top to bottom like a route: in, the moves, each door with its minute, par where it fell, out. The moves sit on the line between the doors, so the list is the timeline.',
    cost: 'The line is not to scale: minutes are written, not drawn, so a long stretch looks like a short one. A long play makes a long phone page.',
    spoil: 'Shows what you did and how it went. The room’s words and the story wait behind one switch for the whole page, off by default.',
    moments: 'A moment lights its door, or the stretch of moves it sits in. Pressing a lock’s name on the line steps through its moments.' },
  { n: 3, name: 'The minutes', Body: Pge3Body, Pic: Pge3Pic,
    stance: 'A square for every minute, par a full row. Over par spills onto the next row; under par leaves squares empty. A ledger lists every move by lock, one line each, with the room’s words a tap away.',
    cost: 'Lock names sit in the ledger, not on the picture, so a door is matched to its lock by minute. A longer par needs more rows, and the card’s squares get small.',
    spoil: 'The strictest. Every word of the room’s, story included, opens one line at a time with a tap.',
    moments: 'A moment lights its door on the squares (or the minutes of the longest stretch) and its line in the ledger. Pressing a door does the same.' },
];
const PGE_STATES = [['under', 'Escaped'], ['over', 'Over par'], ['live', 'Unfinished']];

// ---- Hooks into the app ----
window.GS_SESSION_BODY = {
  escape: (props) => { const v = usePge(); const o = PGE_OPTS[v.opt - 1] || PGE_OPTS[0]; return <o.Body key={v.opt + props.sid} {...props} />; },
};
const PGE_SHIP_NOW = window.PzNow;
const PgeEsNow = (props) => {
  const gs = useGs(); const v = usePge();
  if (props.id !== 'escape' || props.none) return <PGE_SHIP_NOW {...props} />;
  const sid = pgeSid(gs); const s = GS_SESSIONS[sid]; const m = pgeBuild(s, sid); const o = PGE_OPTS[v.opt - 1] || PGE_OPTS[0];
  const lines = m.live ? null : gsShareText(s); const c = props.c; const Next = window.GsNextLink;
  return (
    <section className={'lb-card pge-now pge-now' + o.n}>
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {!m.live && <span className="lb-big"><LbResult s={{ kind: 'ok', label: s.result }} /></span>}
      </div>
      <o.Pic m={m} />
      <p>{pgeCardLines(m)}</p>
      <div className="lb-foot">
        <div className="lb-acts">
          {lines && <LbShare lines={lines} />}
          <DS.TextLink onClick={() => gs.go('session', { id: sid })}>{m.live ? 'See your moves so far' : 'See every move'}</DS.TextLink>
        </div>
        <span className="gs-muted">{c.next}</span>
      </div>
      {!m.live && Next && <Next />}
    </section>
  );
};
window.PzNow = PgeEsNow;

// ---- Drivers: they press the app's own way there, then ring the part in question. ----
const pgeApi = () => window.gsApi;
const pgeRing = (sel) => setTimeout(() => {
  const el = document.querySelector(sel); if (!el) return;
  const sc = el.closest('.kit-phone-screen');
  if (sc) sc.scrollTop = Math.max(0, el.offsetTop - 80); else window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 96) });
  el.classList.add('pge-ring'); setTimeout(() => el.classList.remove('pge-ring'), 1600);
}, (window.GS_LOAD_MS || 600) + 250);
const PGE_ROUTES = [
  { n: 1, short: 'Library card', name: 'The library card', path: 'Library → Escape', go: () => { const gs = pgeApi(); gs.go('library'); setTimeout(() => { pgeApi().go('escape', { page: 'record' }); pgeRing('.pge-now'); }, 60); } },
  { n: 2, short: 'Session page', name: 'The session page', path: 'Library → Escape → See every move', go: () => {
    const gs = pgeApi(); gs.go('library');
    setTimeout(() => { pgeApi().go('escape', { page: 'record' }); setTimeout(() => { const a = pgeApi(); a.go('session', { id: pgeSid(a) }); pgeRing('.pge-card'); }, (window.GS_LOAD_MS || 600) + 100); }, 60);
  } },
];
const pgeSetState = (k) => {
  const gs = pgeApi(); if (!gs) return;
  PgeStore.set(k === 'live' ? { live: true } : { finish: k, live: false });
  gs.setReview({ week: k === 'live' ? 'live' : 'done' });
  // On an Escape session page, the page follows the state: the same room, as this week's play now stands.
  const r = gs.route; const s = r.name === 'session' && GS_SESSIONS[r.id];
  if (s && s.gid === 'escape') setTimeout(() => { const a = pgeApi(); a.go('session', { id: pgeSid(a) }); }, 0);
};

// ---- The bar: one row pinned above the demo bar, so the app keeps its full width and its own layout. It folds to a tab. ----
const PgeBar = () => {
  const v = usePge(); const gs = pgeApi(); const st = gs ? pgeState(gs) : v.finish; const o = PGE_OPTS[v.opt - 1] || PGE_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { const h = document.documentElement; h.classList.toggle('pge-bar-on', !v.folded); h.classList.toggle('pge-bar-off', !!v.folded); }, [v.folded]);
  if (v.folded) return <button type="button" className="pge-tab" onClick={() => PgeStore.set({ folded: false })} aria-label="Show the playground bar"><b>{o.n}</b><span>{o.name + ' · ' + PGE_STATES.find((x) => x[0] === st)[1]}</span><DS.Icon name="down" size={16} /></button>;
  return <>
    <div className="pge-bar" role="group" aria-label="Playground controls, not part of the product">
      <span className="pge-eyebrow">PLAYGROUND</span>
      <div className="pge-bgrp" role="group" aria-label="Option">
        <span className="pge-lab">Option</span>
        {PGE_OPTS.map((x) => <button key={x.n} type="button" className="pge-chip" aria-pressed={v.opt === x.n} onClick={() => PgeStore.set({ opt: x.n })}><b>{x.n}</b>{x.name.replace(/^The /, '')}</button>)}
        <button type="button" className="pge-link" onClick={() => setWhy(true)}>Why</button>
      </div>
      <div className="pge-bgrp" role="group" aria-label="This week’s room">
        <span className="pge-lab">Room</span>
        {PGE_STATES.map(([k, l]) => <button key={k} type="button" className="pge-chip" aria-pressed={st === k} onClick={() => pgeSetState(k)}>{l}</button>)}
      </div>
      <div className="pge-bgrp" role="group" aria-label="Go to">
        <span className="pge-lab">Go to</span>
        {PGE_ROUTES.map((x) => <button key={x.n} type="button" className="pge-chip is-go" title={x.path} onClick={x.go}>{x.short}</button>)}
      </div>
      <button type="button" className="pge-fold" aria-label="Hide the playground bar" title="Hide (keys still work: 1 to 3, S)" onClick={() => PgeStore.set({ folded: true })}><DS.Icon name="down" size={20} /></button>
    </div>
    <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title={o.n + ' · ' + o.name}>
      <div className="pge-why"><p><b>For it:</b> {o.stance}</p><p><b>Cost:</b> {o.cost}</p><p><b>Spoilers:</b> {o.spoil}</p><p><b>Moments:</b> {o.moments} Picked by one rule: {PGE_MOMENT_RULE}</p></div>
    </DS.Popup>
  </>;
};
// Keys: 1 to 3 pick the option, S steps the room's state. Ignored while typing.
const PGE_KEYS_ORDER = PGE_STATES.map((x) => x[0]);
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
  if (['1', '2', '3'].includes(e.key)) PgeStore.set({ opt: Number(e.key) });
  else if (e.key === 's' || e.key === 'S') { const gs = pgeApi(); if (!gs) return; const i = PGE_KEYS_ORDER.indexOf(pgeState(gs)); pgeSetState(PGE_KEYS_ORDER[(i + 1) % PGE_KEYS_ORDER.length]); }
});

// ---- The one handle app/main.jsx reads: bind gets the app's context each render. The rig opens on Escape's library page, with the Pass. ----
let pgeOpened = false;
window.KitCandidate = {
  bind(api) {
    if (pgeOpened) return; pgeOpened = true;
    setTimeout(() => { const a = window.gsApi; a.setView('pass'); a.setConnected(true); if (PgeStore.get().live) a.setReview({ week: 'live' }); a.go('escape', { page: 'record' }, 'pass'); }, 0);
  },
};
// The panel reads the app's state (review.week) on every app render.
const PgeTick = () => { const [, t] = React.useReducer((x) => x + 1, 0); React.useEffect(() => { const id = setInterval(t, 400); return () => clearInterval(id); }, []); return <PgeBar />; };
(() => { const el = document.createElement('div'); el.id = 'pge-chrome'; document.body.appendChild(el); ReactDOM.createRoot(el).render(<PgeTick />); })();
