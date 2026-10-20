// Rig shell: supplies the context canon's main.jsx would, mounts REAL canon screens, switches frames.
// Reads: ?frame=<screen>-<a|b>   one frame alone, full-bleed at 390x844, no rig chrome (for screenshots)
//        ?posture=out|free|pass  who is looking (default out)
const { GsCtx } = window;

// ---- posture -> the context object (shape from canon/app/main.jsx `gs`; every field the mounted screens read) ----------
const PG_SUB = { none: { status: 'none', plan: 'monthly', hadPass: false, pending: null, renew: null },
  active: { status: 'active', plan: 'monthly', hadPass: true, pending: null, renew: new Date(2026, 10, 6).getTime() } };
const PG_USER = { username: 'MonaLaser', first: 'Mona', last: 'Lasker', locked: false, since: null, fresh: false, email: 'you@example.com' };
const PG_REVIEW = { providerFail: false, device: 'known', passFail: false, sheet: 'completes', week: 'done', today: 'played', unfinished: false };

const pgMakeGs = ({ posture, route, width, log, review, lapsed }) => {
  const noop = (name) => (...a) => log && log(name + '(' + a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ') + ')');
  return {
    route, view: posture, sub: posture === 'pass' ? PG_SUB.active : lapsed ? { ...PG_SUB.none, hadPass: true, endedOn: new Date(2026, 9, 3).getTime() } : PG_SUB.none, user: PG_USER, provider: 'email', choice: 'yearly',
    connected: posture !== 'out', review: { ...PG_REVIEW, ...(review || {}) }, playing: null, width, narrow: width < 640, push: { ...(window.GS_PUSH_DEFAULT || {}) },
    setPush: noop('setPush'), go: noop('go'), setConnected: noop('setConnected'), setReview: noop('setReview'), setView: noop('setView'),
    setSub: noop('setSub'), setUser: noop('setUser'), setProvider: noop('setProvider'), setChoice: noop('setChoice'),
    keep: noop('keep'), back: noop('back'), goHow: noop('goHow'), howFromPlay: noop('howFromPlay'), startFree: noop('startFree'),
    signOut: noop('signOut'), setDemoView: noop('setDemoView'), play: noop('play'), playReq: noop('playReq'), closePlay: noop('closePlay'),
    getPass: noop('getPass'), accountMade: noop('accountMade'), afterCheckout: noop('afterCheckout'), signedIn: noop('signedIn'), paid: noop('paid'),
    deleteAccount: noop('deleteAccount'),
  };
};

// Mounts children under the context in a canon-shaped .gs-root; measures width like main.jsx does.
const PgApp = ({ posture, route, children, onNav, review, lapsed }) => {
  const [width, setWidth] = React.useState(390);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current && ref.current.querySelector('.gs-root'); if (!el || !window.ResizeObserver) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width)); ro.observe(el); return () => ro.disconnect();
  }, []);
  const gs = pgMakeGs({ posture, route, width, log: onNav, review, lapsed });
  return (
    <GsCtx.Provider value={gs}>
      <div ref={ref} style={{ display: 'contents' }}>
        <div className="gs-root">
          {route.name !== 'none' && <GsTopBar />}
          {children}
          <GsFooter />
          <div id="gs-announce" className="gs-vh" role="status" aria-live="polite"></div>
        </div>
      </div>
    </GsCtx.Provider>
  );
};

// ---- the frames --------------------------------------------------------------------------------------------------------
// Posture is always `free`. week: 'live' = the first case half-played (CbFirst's own switch); 'done' = solved.
const CB_ROUTE = { name: 'casebook', page: 'record' };
const PG_FRAMES = {
  '3A-M': { fr: '3A', step: 'Seeded: mid-case', label: '3A-M · Seeded: mid-case. Play only', review: { week: 'live' }, route: CB_ROUTE, node: () => <PgCbLibrary state="mid" introGone /> },
  '3A-1': { fr: '3A', step: 'Seeded: showing 1', label: '3A-1 · Seeded: showing 1. Line and button [Q-G5]', route: CB_ROUTE, node: () => <PgCbLibrary state="s1" introGone /> },
  '3A-2': { fr: '3A', step: 'Seeded: showing 2', label: '3A-2 · Seeded: showing 2. A muted link only', route: CB_ROUTE, node: () => <PgCbLibrary state="s2" introGone /> },
  '3A-3': { fr: '3A', step: 'Seeded: showing 3+', label: '3A-3 · Seeded: showing 3 and after. Result only, line gone', route: CB_ROUTE, node: () => <PgCbLibrary state="s3" introGone /> },
  '3A-N': { fr: '3A', step: 'Seeded: first new case', label: '3A-N · First new case after the finish: one fresh showing. Later new cases bring none', route: CB_ROUTE, node: () => <PgCbLibrary state="mon" introGone /> },
  '3B': { fr: '3B', step: '', label: '3B · Chapter 1 done', route: { name: 'barrow', page: 'record' }, node: () => <PgBwLibrary /> },
  '3C-1': { fr: '3C', step: 'Mid-case', label: '3C-1 · Visible: mid-case, Play and outlined Get the Pass', review: { week: 'live' }, route: CB_ROUTE, node: () => <PgCbLibrary state="o7mid" /> },
  '3C-2': { fr: '3C', step: 'Finished', label: '3C-2 · Visible: finished, Get the Pass is the main button', route: CB_ROUTE, node: () => <PgCbLibrary state="o7done" /> },
};
PG_FRAMES['3D-1'] = { fr: '3D', step: 'Lapsed: first visit', label: '3D-1 · Lapsed: your place, once [Q-G11, open: drawn so Joe can judge it, not a pick]. “You stopped here” is unverified: whether a lapsed player’s chapter-2 position is kept is not read in the campaign store', lapsed: true, route: { name: 'barrow', page: 'record' }, node: () => <PgBwLapsed showing={1} /> };
PG_FRAMES['3D-2'] = { fr: '3D', step: 'Lapsed: second visit', label: '3D-2 · Lapsed: second showing, the link only [Q-G11, open]', lapsed: true, route: { name: 'barrow', page: 'record' }, node: () => <PgBwLapsed showing={2} /> };
const PG_RIG = [
  { id: '3A', name: 'Finished case, decaying (recommended)', note: 'Casebook library page after the first case. Pass line: full on showing 1, a link on showing 2, gone from showing 3, fresh once, on the first release after the finish. Each frame is seeded: the showings cannot be reached with the app’s controls, because the showing counter is not built. Streak card stays throughout. Option 3.1-A.', ids: ['3A-M', '3A-1', '3A-2', '3A-3', '3A-N'] },
  { id: '3B', name: 'Chapter 1 done', note: 'Barrow library page. Hero record large, the Pass fact muted beside Get the Pass. Level 4 and dates are placeholders. Option 3.2-A.', ids: ['3B'] },
  { id: '3C', name: 'Visible game page (O7)', note: 'Casebook page the loud way: a second button mid-case; once finished, Get the Pass becomes the main button and says what is out. Option O7 game-page row.', ids: ['3C-1', '3C-2'] },
  { id: '3D', name: 'Lapsed, your place once (option 3.5-A, open: Q-G11)', note: 'Barrow library page for a player whose Pass ended, chapter 2 started. First visit: where they stopped, then the link. Second visit: the link only. Earned badges lit with dates, no padlock, no “Frozen”. Level 3, chapter 2 and dates are placeholders. Drawn so Joe can judge it, only in scope if he says so.', ids: ['3D-1', '3D-2'] },
];

const PgFrame = ({ id, onNav }) => {
  const f = PG_FRAMES[id];
  return <PgApp key={id} posture="free" route={f.route} review={f.review} lapsed={f.lapsed} onNav={onNav}>{f.node()}</PgApp>;
};

const PgPhone = ({ children, full }) => (
  <div className="kit-phone-clip" style={{ width: full ? 390 : 'min(390px, calc(100vw - 32px))', height: full ? 844 : 780, borderRadius: full ? 0 : 24, flex: 'none', border: full ? 0 : '1px solid #444' }}>
    <div className="kit-phone-screen">{children}</div>
  </div>
);

const PgRig = () => {
  const forced = new URLSearchParams(location.search).get('frame');
  const [log, setLog] = React.useState([]);
  const onNav = (s) => setLog((l) => [s, ...l].slice(0, 5));
  if (forced && PG_FRAMES[forced]) {   // capture mode: the frame alone, full-bleed 390x844, no chrome
    document.body.style.margin = '0';
    return <PgPhone full><PgFrame id={forced} /></PgPhone>;
  }
  return (
    <div className="pg-shell">
      <div className="pg-head">
        <h1>end-of-road: the end of the free road</h1>
        <p>Where the free road truly ends, the Pass is named once, then gets quieter. Frames played as a free player on the Casebook and Barrow pages (3D: a player whose Pass ended). 3A against 3C is quiet against visible.</p>
        <p className="pg-stage"><b>Staging.</b> Joe’s free line of 14 October, not the prototype’s: Casebook edition 1 is free for an account; Barrow chapter 1 is free and chapter 2 is out. Every number and date here is a placeholder. Nothing on these pages is clickable; taps are logged below.</p>
      </div>
      {PG_RIG.map((r) => (
        <section key={r.id} className="pg-sec">
          <h2><span className="pg-id">{r.id}</span> {r.name}</h2>
          <p className="pg-note">{r.note}</p>
          <div className="pg-row">
            {r.ids.map((id) => (
              <div key={id} className="pg-col">
                <div className="pg-cap">{PG_FRAMES[id].label}</div>
                <PgPhone><PgFrame id={id} onNav={onNav} /></PgPhone>
                <a className="pg-link" href={'?frame=' + id}>full-bleed {id}</a>
              </div>
            ))}
          </div>
        </section>
      ))}
      <div className="pg-log">canon callbacks (stubbed, nothing navigates): {log.length ? log.join('  ·  ') : 'tap something'}</div>
    </div>
  );
};

const pgStyle = document.createElement('style');
pgStyle.textContent = `
  .pg-shell { min-height: 100vh; background: #1c1c1a; color: #eee; font: 14px/1.45 system-ui, sans-serif; padding-bottom: 32px; }
  .pg-head, .pg-sec { max-width: 1300px; margin: 0 auto; padding: 16px 16px 0; }
  .pg-head h1 { font: 700 20px/1.3 system-ui, sans-serif; margin: 0 0 8px; }
  .pg-sec h2 { font: 700 17px/1.3 system-ui, sans-serif; margin: 24px 0 4px; }
  .pg-id { display: inline-block; background: #FF2EC4; color: #000; border-radius: 4px; padding: 0 8px; margin-right: 6px; }
  .pg-note, .pg-head p { color: #bbb; margin: 4px 0; max-width: 70ch; }
  .pg-stage { color: #e5c97a; }
  .pg-link { color: #9cf; }
  .pg-row { display: flex; flex-wrap: wrap; gap: 24px; padding: 12px 0; }
  .pg-col { display: grid; gap: 8px; justify-items: center; align-content: start; }
  .pg-col { max-width: 100%; }
  .pg-cap { color: #ddd; max-width: min(390px, calc(100vw - 32px)); text-align: center; }
  .pg-log { padding: 16px; color: #999; text-align: center; }
  .lb-acts > .mcp-lnk.pg-muted-link { color: var(--muted); min-height: 48px; }
  .pg-acts-wrap { flex-wrap: wrap; row-gap: 8px; }`;
document.head.appendChild(pgStyle);

ReactDOM.createRoot(document.getElementById('root')).render(<PgRig />);
