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

const PG_FRAMES = {
  '4a': { letter: '4A', name: 'Next free thing', screen: 'Daily Word', label: '4A · Next free thing · step 1',
    note: 'Word done, Mystery unplayed: a line and a Play Daily Mystery button sit under the result. The earlier-words line is gone (4.3-A).',
    route: { name: 'word', page: 'record' }, node: () => <PgDailyWord variant="next" /> },
  '4a-2': { letter: '4A', name: 'Next free thing', screen: 'Daily Word', label: '4A · Next free thing · seeded frame (Mystery done too)',
    note: 'Seeded frame: both free dailies done. The base close replaces the Mystery line and canon’s “Next word: tomorrow”.',
    route: { name: 'word', page: 'record' }, node: () => <PgDailyWord variant="closed" /> },
  '4b': { letter: '4B', name: 'Today’s free set', screen: 'Daily Word', label: '4B · Today’s free set',
    note: 'The done card ends in a small list of the free dailies with their state. No sentence, no Pass. Earlier-words line gone.',
    route: { name: 'word', page: 'record' }, node: () => <PgDailyWord variant="set" /> },
};
const PgFrame = ({ id, onNav }) => {
  const f = PG_FRAMES[id];
  return <PgApp key={id} posture="free" route={f.route} onNav={onNav}>{f.node()}</PgApp>;
};

// A 390-wide phone-ish viewport using canon's own scroll/containing-block classes. full => exactly 390x844, no rounding.
const PgPhone = ({ children, full }) => (
  <div className="kit-phone-clip" style={{ width: 390, height: full ? 844 : 780, borderRadius: full ? 0 : 24, flex: 'none', border: full ? 0 : '1px solid #444' }}>
    <div className="kit-phone-screen">{children}</div>
  </div>
);

const pgQuery = () => new URLSearchParams(location.search);
const PgRig = () => {
  const forced = pgQuery().get('frame');
  const [log, setLog] = React.useState([]);
  const onNav = (s) => setLog((l) => [s, ...l].slice(0, 5));
  if (forced && PG_FRAMES[forced]) { document.body.style.margin = '0'; return <PgPhone full><PgFrame id={forced} /></PgPhone>; }
  return (
    <div className="pg-shell">
      <div className="pg-bar" role="group" aria-label="Playground notes, not part of the product"><b>Rig 4 · daily-day</b>
        <span>Posture: Free. Staging: free dailies are Daily Word and Daily Mystery only, Daily Groups hidden. Dates and counts are placeholders.</span></div>
      <ol className="pg-list">{Object.entries(PG_FRAMES).map(([id, f]) => <li key={id}><a href={'?frame=' + id}>{f.letter}{id === '4a-2' ? ' seeded' : ''}</a> <b>{f.name}</b><br /><span>{f.note}</span></li>)}</ol>
      <div className="pg-row">
        {Object.entries(PG_FRAMES).map(([id, f]) => (
          <div key={id} className="pg-col"><div className="pg-cap">{f.label}</div><PgPhone><PgFrame id={id} onNav={onNav} /></PgPhone></div>
        ))}
      </div>
      <div className="pg-log">canon callbacks (stubbed, nothing navigates): {log.length ? log.join('  ·  ') : 'tap something'}</div>
    </div>
  );
};
const pgStyle = document.createElement('style');
pgStyle.textContent = `
  .pg-shell { min-height: 100vh; background: #1c1c1a; color: #eee; font: 13px/1.4 system-ui, sans-serif; padding-bottom: 24px; }
  .pg-bar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 8px 12px; background: #111; border-bottom: 1px solid #333; }
  .pg-list { max-width: 720px; margin: 16px auto; padding: 0 16px 0 40px; display: grid; gap: 8px; } .pg-list a { color: #9cf; } .pg-list span { color: #bbb; }
  .pg-row { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; padding: 16px; }
  .pg-col { display: grid; gap: 8px; justify-items: center; }
  .pg-cap { color: #bbb; max-width: 390px; text-align: center; }
  .pg-log { padding: 0 16px; color: #999; text-align: center; }`;
document.head.appendChild(pgStyle);
ReactDOM.createRoot(document.getElementById('root')).render(<PgRig />);

