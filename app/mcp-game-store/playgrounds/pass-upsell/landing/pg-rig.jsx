// Rig shell: supplies the context canon's main.jsx would, mounts REAL canon screens, switches frames.
// Reads: ?frame=<screen>-<a|b>   one frame alone, full-bleed at 390x844, no rig chrome (for screenshots)
//        ?posture=out|free|pass  who is looking (default out)
const { GsCtx, GS_GAMES } = window;

// ---- posture -> the context object (shape from canon/app/main.jsx `gs`; every field the mounted screens read) ----------
const PG_SUB = { none: { status: 'none', plan: 'monthly', hadPass: false, pending: null, renew: null },
  active: { status: 'active', plan: 'monthly', hadPass: true, pending: null, renew: new Date(2026, 10, 6).getTime() } };
const PG_USER = { username: 'MonaLaser', first: 'Mona', last: 'Lasker', locked: false, since: null, fresh: false, email: 'you@example.com' };
const PG_REVIEW = { providerFail: false, device: 'known', passFail: false, sheet: 'completes', week: 'done', today: 'played', unfinished: false };

const pgMakeGs = ({ posture, route, width, log }) => {
  const noop = (name) => (...a) => log && log(name + '(' + a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ') + ')');
  return {
    route, view: posture, sub: posture === 'pass' ? PG_SUB.active : PG_SUB.none, user: PG_USER, provider: 'email', choice: 'yearly',
    connected: posture !== 'out', review: PG_REVIEW, playing: null, width, narrow: width < 640, push: { ...(window.GS_PUSH_DEFAULT || {}) },
    setPush: noop('setPush'), go: noop('go'), setConnected: noop('setConnected'), setReview: noop('setReview'), setView: noop('setView'),
    setSub: noop('setSub'), setUser: noop('setUser'), setProvider: noop('setProvider'), setChoice: noop('setChoice'),
    keep: noop('keep'), back: noop('back'), goHow: noop('goHow'), howFromPlay: noop('howFromPlay'), startFree: noop('startFree'),
    signOut: noop('signOut'), setDemoView: noop('setDemoView'), play: noop('play'), playReq: noop('playReq'), closePlay: noop('closePlay'),
    getPass: noop('getPass'), accountMade: noop('accountMade'), afterCheckout: noop('afterCheckout'), signedIn: noop('signedIn'), paid: noop('paid'),
    deleteAccount: noop('deleteAccount'),
  };
};

// Mounts children under the context in a canon-shaped .gs-root; measures width like main.jsx does.
const PgApp = ({ posture, route, children, onNav }) => {
  const [width, setWidth] = React.useState(390);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current && ref.current.querySelector('.gs-root'); if (!el || !window.ResizeObserver) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width)); ro.observe(el); return () => ro.disconnect();
  }, []);
  const gs = pgMakeGs({ posture, route, width, log: onNav });
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

// ---- the frames: 5A, 5B (modules pg-landing-*.jsx). Posture is always free (Joe's free line, staged in pg-landing-lib / hub). ----
const PG_FRAMES = {
  '5a': { id: '5A', name: 'Library as landing', note: 'Signed-in players land on Library: a Today group of the free dailies, then Your games saying state only, then a link to Discover.',
    route: { name: 'library' }, node: () => <PgLanding5A /> },
  '5b': { id: '5B', name: 'The games hub', note: 'Discover recomposed: search first, each game once under Every day / Every week / In chapters, two doors on each card, no lock anywhere.',
    ds: 'DS change, faked: card doors (a play door and an "Every ..." door inside the GameCard tag slot).', route: { name: 'games' }, node: () => <PgLanding5B /> },
};
const PgFrame = ({ id, posture, onNav }) => {
  const f = PG_FRAMES[id];
  return <PgApp key={id + posture} posture={posture} route={f.route} onNav={onNav}>{f.node()}</PgApp>;
};

// A 390-wide phone-ish viewport using canon's own scroll/containing-block classes. full => exactly 390x844, no rounding.
const PgPhone = ({ children, full }) => (
  <div className="kit-phone-clip" style={{ width: 390, height: full ? 844 : 780, borderRadius: full ? 0 : 24, flex: 'none', border: full ? 0 : '1px solid #444' }}>
    <div className="kit-phone-screen">{children}</div>
  </div>
);

const PgRig = () => {
  const q = new URLSearchParams(location.search);
  const forced = q.get('frame');
  const [ab, setAb] = React.useState('both');
  const [log, setLog] = React.useState([]);
  const onNav = (s) => setLog((l) => [s, ...l].slice(0, 5));
  if (forced && PG_FRAMES[forced.toLowerCase()]) {   // capture mode: the frame alone, full-bleed 390x844, no chrome
    document.body.style.margin = '0';
    return <PgPhone full><PgFrame id={forced.toLowerCase()} posture="free" /></PgPhone>;
  }
  const tab = (v, l) => <button key={v} type="button" aria-pressed={ab === v} onClick={() => setAb(v)} className="pg-tab">{l}</button>;
  const ids = Object.keys(PG_FRAMES);
  const shown = ab === 'both' ? ids : [ab];
  return (
    <div className="pg-shell">
      <div className="pg-bar" role="group" aria-label="Playground controls, not part of the product">
        <b>Rig 5 landing</b>
        {tab('both', 'Both')}{ids.map((i) => tab(i, PG_FRAMES[i].id))}
        <span className="pg-sep" />
        {ids.map((i) => <a key={i} href={'?frame=' + i} className="pg-link">{PG_FRAMES[i].id} full-bleed</a>)}
      </div>
      <p className="pg-stage"><b>Staged on Joe's free line (2026-10-14), not the prototype's:</b> posture is a signed-in free player. Free dailies are Daily Word and Daily Mystery only (Daily Groups hidden). Escape, Casebook and Delve: edition 1 free. Barrow: chapter 1 free. Every state shown is fake data. Nothing here is the Pass pitch: neither frame carries a Pass line.</p>
      <div className="pg-row">
        {shown.map((id) => (
          <div key={id} className="pg-col">
            <div className="pg-cap"><b>{PG_FRAMES[id].id} · {PG_FRAMES[id].name}</b><br />{PG_FRAMES[id].note}{PG_FRAMES[id].ds && <><br /><i>{PG_FRAMES[id].ds}</i></>}</div>
            <PgPhone><PgFrame id={id} posture="free" onNav={onNav} /></PgPhone>
          </div>
        ))}
      </div>
      <div className="pg-log">canon callbacks (stubbed, nothing navigates): {log.length ? log.join('  ·  ') : 'tap something'}</div>
    </div>
  );
};

// Rig chrome styles: pg- prefix, tooling look (dark strip), never product.
const pgStyle = document.createElement('style');
pgStyle.textContent = `
  .pg-shell { min-height: 100vh; background: #1c1c1a; color: #eee; font: 13px/1.4 system-ui, sans-serif; padding-bottom: 24px; }
  .pg-bar { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 8px 12px; background: #111; border-bottom: 1px solid #333; }
  .pg-tab { background: #2a2a27; color: #ddd; border: 1px solid #444; border-radius: 6px; padding: 6px 10px; min-height: 32px; cursor: pointer; font: inherit; }
  .pg-tab[aria-pressed="true"] { background: #FF2EC4; color: #000; border-color: #FF2EC4; }
  .pg-sep { width: 1px; height: 20px; background: #444; margin: 0 4px; }
  .pg-link { color: #9cf; margin-left: 4px; }
  .pg-row { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; padding: 16px; }
  .pg-col { display: grid; gap: 8px; justify-items: center; }
  .pg-cap { color: #bbb; max-width: 390px; text-align: center; }
  .pg-stage { max-width: 840px; margin: 12px auto 0; padding: 0 16px; color: #bbb; }
  .pg-log { padding: 0 16px; color: #999; text-align: center; }`;
document.head.appendChild(pgStyle);

ReactDOM.createRoot(document.getElementById('root')).render(<PgRig />);
