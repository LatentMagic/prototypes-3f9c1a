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

// ---- the frames. id = <screen>-<a|b>. Add a pair per alternative; B is whatever the option changes. -------------------
const PG_BAND = ['Play every game in full. £30 a year or £3 a month.', 'Play every game in full. Rig-only line: £30 a year, £3 a month, cancel any time.'];
const PG_FRAMES = {
  'home-a': { screen: 'Home', label: 'Frame A · stock Home', route: { name: 'home' }, node: () => <GsHome /> },
  'home-b': { screen: 'Home', label: 'Frame B · Pass band copy overridden (rig only)', route: { name: 'home' }, node: () => <PgPatch patches={[PG_BAND]}><GsHome /></PgPatch> },
  'game-a': { screen: 'Game page', label: 'Frame A · stock Delve page', route: { name: 'delve' }, node: () => <GsGamePage id="delve" /> },
  'game-b': { screen: 'Game page', label: 'Frame B · Delve pitch headline overridden by data patch', route: { name: 'delve' },
    node: () => <PgDataPatched><GsGamePage id="delve" /></PgDataPatched> },
  'cards-a': { screen: 'Card row', label: 'Frame A · real DS GameCard row (as on Home)', route: { name: 'none' }, bare: true,
    node: () => <main className="gs-wrap gs-main"><DS.CardRow title="Available games" className="gs-row4">{window.GS_HOME_GAMES.slice(0, 3).map((k) => <GsFeature key={k} id={k} />)}</DS.CardRow></main> },
  'cards-b': { screen: 'Card row', label: 'Frame B · same row with a PASS mark on the card (prop override)', route: { name: 'none' }, bare: true,
    node: () => <main className="gs-wrap gs-main"><DS.CardRow title="Available games" className="gs-row4">{window.GS_HOME_GAMES.slice(0, 3).map((k) => <GsCard key={k} id={k} mark="Pass upsell" />)}</DS.CardRow></main> },
};
// Data patch for the duration of the mount, restored on unmount so Frame A is never contaminated.
const PgDataPatched = ({ children }) => {
  const restore = React.useRef(null);
  if (!restore.current) restore.current = pgPatchData(GS_PAGES.delve.pitch, { h: 'Rig-only headline: the rig changed this, canon did not' });
  React.useEffect(() => () => restore.current && restore.current(), []);
  return children;
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

const PG_SCREENS = ['home', 'game', 'cards'];
const PG_POSTURES = [['out', 'Signed out'], ['free', 'Free'], ['pass', 'Pass']];
const pgQuery = () => new URLSearchParams(location.search);

const PgRig = () => {
  const q = pgQuery();
  const forced = q.get('frame');
  const posture = ['out', 'free', 'pass'].includes(q.get('posture')) ? q.get('posture') : 'out';
  const [screen, setScreen] = React.useState(forced ? forced.split('-')[0] : 'home');
  const [ab, setAb] = React.useState('both');
  const [log, setLog] = React.useState([]);
  const [post, setPost] = React.useState(posture);
  const onNav = (s) => setLog((l) => [s, ...l].slice(0, 5));

  if (forced && PG_FRAMES[forced]) {   // capture mode: the frame alone, full-bleed 390x844, no chrome
    document.body.style.margin = '0';
    return <PgPhone full><PgFrame id={forced} posture={posture} /></PgPhone>;
  }
  const tab = (on, set, v, l) => <button key={v} type="button" aria-pressed={on} onClick={() => set(v)} className="pg-tab">{l}</button>;
  const ids = ['a', 'b'].map((x) => screen + '-' + x);
  const shown = ab === 'both' ? ids : [screen + '-' + ab];
  return (
    <div className="pg-shell">
      <div className="pg-bar" role="group" aria-label="Playground controls, not part of the product">
        <b>Scaffold</b>
        {PG_SCREENS.map((s) => tab(screen === s, setScreen, s, PG_FRAMES[s + '-a'].screen))}
        <span className="pg-sep" />
        {tab(ab === 'a', setAb, 'a', 'Frame A')}{tab(ab === 'b', setAb, 'b', 'Frame B')}{tab(ab === 'both', setAb, 'both', 'Both')}
        <span className="pg-sep" />
        {PG_POSTURES.map(([v, l]) => tab(post === v, setPost, v, l))}
        <span className="pg-sep" />
        <a href={'?frame=' + ids[0] + '&posture=' + post} className="pg-link">full-bleed A</a>
        <a href={'?frame=' + ids[1] + '&posture=' + post} className="pg-link">full-bleed B</a>
      </div>
      <div className="pg-row">
        {shown.map((id) => (
          <div key={id} className="pg-col">
            <div className="pg-cap">{PG_FRAMES[id].label}</div>
            <PgPhone><PgFrame id={id} posture={post} onNav={onNav} /></PgPhone>
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
  .pg-log { padding: 0 16px; color: #999; text-align: center; }`;
document.head.appendChild(pgStyle);

ReactDOM.createRoot(document.getElementById('root')).render(<PgRig />);
