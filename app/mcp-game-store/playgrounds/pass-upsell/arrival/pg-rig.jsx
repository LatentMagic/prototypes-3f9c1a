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

// Edition numbers, one story: the shared word is No. 212 (yesterday); today is No. 213 in the example chat, 2A's line source and 2B's label. All [placeholder].
const PG_CHAT_213 = [['Daily Word No. 212 is ready', 'Daily Word No. 213 is ready']];

// ---- the frames. id = <screen>-<a|b>. Add a pair per alternative; B is whatever the option changes. -------------------
const PG_FRAMES = {
  '2a': { screen: '2A Edition line', label: '2A · Edition line (2.2-B). Word page, arriving from a friend\u2019s share, signed out. Shared No. 212 has passed; line above Play, body size; the stock \u201cfree with an account\u201d line is hidden here so the page says it once. New line is rig-built; edition number is [placeholder].',
    route: { name: 'word' }, node: () => <PgPatch patches={PG_CHAT_213}><GsGamePage id="word" /><PgEditionLine /></PgPatch> },
  '2b': { screen: '2B Today first', label: '2B · Today first (2.2-C). Same page, signed out. Play-box label names today\u2019s edition; the shared one is never named. Label patched in the rig; "NO. 213" is [placeholder].',
    route: { name: 'word' }, node: () => <PgPatch patches={[['FREE WITH AN ACCOUNT', 'TODAY\u2019S WORD \u00b7 NO. 213'], ...PG_CHAT_213]}><GsGamePage id="word" /></PgPatch> },
  '2c': { screen: '2C Receipt in Library', label: '2C · Receipt in the Library (2.4-B). New account, nothing played, free. Receipt card is new UI built in the rig from DS parts; foot line links "Everything else". [Q-G3] [Q-G5]: "the first room / case / scene" is an earlier edition for a late joiner. Rows are DS ListRow (whole row taps, 48px).',
    route: { name: 'library' }, posture: 'free', node: () => <PgLibraryNew /> },
  '2d': { screen: '2D Connect on a phone', label: '2D · Connect on a phone (2.3-A). New free account lands on connect, 390 px, nothing played. Canon GsConnect with one plain line above the steps and an \u201cEmail me the link\u201d button (button, not link: builder\u2019s call). No phone claim. No sent state drawn: v3 gives no copy for it.',
    route: { name: 'connect' }, posture: 'free', node: () => <PgConnectPhone /> },
};
const PgFrame = ({ id, posture, onNav }) => {
  const f = PG_FRAMES[id];
  return <PgApp key={id + posture} posture={f.posture || posture} route={f.route} onNav={onNav}>{f.node()}</PgApp>;
};

// A 390-wide phone-ish viewport using canon's own scroll/containing-block classes. full => exactly 390x844, no rounding.
const PgPhone = ({ children, full }) => (
  <div className="kit-phone-clip" style={{ width: 390, height: full ? 844 : 780, borderRadius: full ? 0 : 24, flex: 'none', border: full ? 0 : '1px solid #444' }}>
    <div className="kit-phone-screen">{children}</div>
  </div>
);

const PG_NOTES = { '2a': ['Edition line', 'One small line above Play says the shared word has passed and today\u2019s is yours with an account.'],
  '2b': ['Today first', 'No extra line. The play-box label names today\u2019s word, so nothing reads as gone.'],
  '2d': ['Connect on a phone', 'The connect page says adding a game link is easiest on a computer, and offers to email the link.'],
  '2c': ['Receipt in the Library', 'A new account\u2019s empty Library shows what the account opens, once, with the Pass named in the foot line.'] };
const pgQuery = () => new URLSearchParams(location.search);

const PgRig = () => {
  const forced = pgQuery().get('frame');
  if (forced && PG_FRAMES[forced]) {   // capture mode: the frame alone, full-bleed 390x844, no chrome
    document.body.style.margin = '0';
    return <PgPhone full><PgFrame id={forced} posture="out" /></PgPhone>;
  }
  const [log, setLog] = React.useState([]);
  const onNav = (x) => setLog((l) => [x, ...l].slice(0, 5));
  return (
    <div className="pg-shell">
      <div className="pg-bar" role="group" aria-label="Playground notes, not part of the product">
        <b>Rig 2 · arrival</b><span className="pg-sep" />
        <span>Staging: Joe’s free line (2026-10-14). Edition numbers are placeholders. Nothing here is shipped copy.</span>
        <span className="pg-sep" />
        {Object.keys(PG_FRAMES).map((id) => <a key={id} href={'?frame=' + id} className="pg-link">{id.toUpperCase()} full-bleed</a>)}
      </div>
      <div className="pg-row">
        {Object.keys(PG_FRAMES).map((id) => (
          <div key={id} className="pg-col">
            <div className="pg-cap"><b>{id.toUpperCase()} · {PG_NOTES[id][0]}</b><br />{PG_NOTES[id][1]}<br /><small>{PG_FRAMES[id].label}</small></div>
            <PgPhone><PgFrame id={id} posture="out" onNav={onNav} /></PgPhone>
          </div>
        ))}
      </div>
      <div className="pg-log">canon callbacks (stubbed, nothing navigates): {log.length ? log.join('  \u00b7  ') : 'tap something'}</div>
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
