// ============================================================================
// [Platform] — the root. Owns the app's state, decides which screen you are on,
// and mounts the prototype aids around it.
//
// The aids (config.jsx, states.jsx + states-ui.jsx, qa.jsx, gs-config.jsx) are
// read off `window` and each may be ABSENT: leave a file and its script tag out
// and the app carries on without it, no edit here.
//
// The demo bar (GsDemoBar) is a prototype control: signed out, free (not
// subscribed) and Pass (active, monthly). It and the Subscription config row
// always agree, because the view is derived from the subscription.
// ============================================================================
const { useState, useEffect, useRef } = React;

const GS_REVIEW_DEFAULT = { providerFail: false, appleNone: false, sheet: 'completes' };
const GS_USER_DEFAULT = { username: 'MonaLaser', locked: false, email: 'you@example.com' };
// status: none | free (free month) | active | failed | ending
const GS_SUB_DEFAULT = { status: 'none', plan: 'monthly', freeUsed: false, pending: null, fromFree: false, renew: null };
// Screens with their own frame (no shared top bar).
const GS_BARE = ['signup', 'signin', 'verify', 'username', 'recover', 'returning', 'checkout', 'update-card', 'account', 'loading', 'offline'];
// Screens that carry the site footer: everything except single-purpose screens (sign-in, sign-up, verify, recover, returning, checkout, update-card, loading, offline, not-found).
const GS_FOOTER = ['home', 'games', 'delve', 'puzzles', 'casebook', 'hunter', 'pass', 'legal', 'connect', 'history', 'session', 'account'];
// Screens a signed-out view cannot hold.
const GS_SIGNED_IN_ONLY = ['connect', 'history', 'verify', 'username', 'account', 'update-card'];

// Every route the app holds. Anything else is not-found, which carries no chrome.
const GS_ROUTES = ['home', 'signup', 'signin', 'verify', 'username', 'recover', 'returning', 'connect', 'games', 'delve', 'puzzles', 'casebook', 'hunter',
  'session', 'history', 'pass', 'checkout', 'update-card', 'account', 'legal', 'loading', 'offline'];

const GsScreen = ({ name }) => {
  switch (name) {
    case 'home': return <GsHome />;
    case 'signup': return <GsSignUp />;
    case 'signin': return <GsSignIn />;
    case 'verify': return <GsVerify />;
    case 'username': return <GsUsername />;
    case 'recover': return <GsRecover />;
    case 'returning': return <GsReturning />;
    case 'connect': return <GsConnect />;
    case 'games': return <GsGames />;
    case 'delve': return <GsDelve />;
    case 'puzzles': return <GsPuzzles />;
    case 'casebook': return <GsCasebook />;
    case 'hunter': return <GsHunter />;
    case 'session': return <GsSession />;
    case 'history': return <GsHistory />;
    case 'pass': return <GsPass />;
    case 'checkout': return <GsCheckout />;
    case 'update-card': return <GsUpdateCard />;
    case 'account': return <GsAccount />;
    case 'legal': return <GsLegal />;
    case 'loading': return <GsFullLoader />;
    case 'offline': return <GsOffline />;
    default: return <GsNotFound />;
  }
};

const KitApp = () => {
  // viewport / layout posture: 'auto' | 'desktop' | 'mobile', set from Config.
  const [layout, setLayout] = useState('auto');
  const forcedMobile = layout === 'mobile';
  const ConfigLauncher = window.ConfigLauncher;

  // ---- product state ------------------------------------------------------------
  const [route, setRoute] = useState({ name: 'home' });
  const [signedIn, setSignedIn] = useState(false);
  const [sub, setSubState] = useState(GS_SUB_DEFAULT);
  const [user, setUserState] = useState(GS_USER_DEFAULT);
  const [provider, setProvider] = useState('email');     // how the account signs in
  const [choice, setChoice] = useState('yearly');         // the plan picked on the Pass page
  const [connected, setConnected] = useState(false);
  const [newAcct, setNewAcct] = useState(false);         // made this run, username not chosen yet
  const [review, setReviewState] = useState(GS_REVIEW_DEFAULT);
  const [playing, setPlaying] = useState(null);
  const [width, setWidth] = useState(() => window.innerWidth);
  const rootRef = useRef(null);

  const view = !signedIn ? 'out' : GS_SUB_HOLDS.includes(sub.status) ? 'pass' : 'free';

  // Routes are history entries, so the browser's Back returns where you came from.
  const stack = useRef([{ name: 'home' }]);
  const idx = useRef(0);
  useEffect(() => {
    try { window.history.replaceState({ ...(window.history.state || {}), gsIdx: 0 }, ''); } catch (e) {}
    const onPop = (e) => {
      const i = e.state && e.state.gsIdx;
      if (typeof i === 'number' && stack.current[i]) { idx.current = i; setPlaying(null); setRoute(stack.current[i]); }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const go = (name, extra) => {
    const r = { name, ...(extra || {}) };
    idx.current += 1;
    stack.current = stack.current.slice(0, idx.current).concat([r]);
    try { window.history.pushState({ gsIdx: idx.current }, ''); } catch (e) {}
    setPlaying(null); setRoute(r); setTimeout(gsScrollTop, 0);
  };
  const setReview = (patch) => setReviewState((r) => ({ ...r, ...patch }));
  const setSub = (patch) => setSubState((s) => ({ ...s, ...patch }));
  const setUser = (patch) => setUserState((u) => ({ ...u, ...patch }));
  // The demo bar's three views, written onto the subscription.
  const setView = (v) => {
    if (v === 'out') { setSignedIn(false); return; }
    setSignedIn(true);
    if (v === 'free') setSubState({ ...GS_SUB_DEFAULT });
    if (v === 'pass') setSubState({ ...GS_SUB_DEFAULT, status: 'active', freeUsed: true });
  };
  const reset = () => {
    setSignedIn(false); setSubState(GS_SUB_DEFAULT); setUserState(GS_USER_DEFAULT); setProvider('email');
    setChoice('yearly'); setConnected(false); setNewAcct(false); setReviewState(GS_REVIEW_DEFAULT); go('home');
  };

  const gs = {
    route, view, sub, user, provider, choice, connected, review, playing, width, narrow: width < 640,
    go, setConnected, setReview, setView, setSub, setUser, setProvider, setChoice,
    goHow: () => { go('home'); setTimeout(() => gsScrollToId('gs-how'), 40); },
    startFree: () => (view === 'out' ? go('signup') : go('games')),
    signOut: () => { setSignedIn(false); go('home'); },
    setDemoView: (v) => { setView(v); if (v === 'out' && GS_SIGNED_IN_ONLY.includes(route.name)) go('home'); },
    // Signed out -> sign up; not connected -> connect your AI; else the pop-up.
    play: (name, session) => {
      if (view === 'out') go('signup');
      else if (!connected) go('connect');
      else setPlaying({ name, session });
    },
    closePlay: () => setPlaying(null),
    // Billing needs an account: signed out signs up first, then goes to checkout.
    getPass: () => (view === 'out' ? go('signup', { next: 'checkout' }) : go('checkout')),
    // A new account has no username yet. It is chosen on Your username: straight after sign-up, or after checkout on the Get the Pass route.
    signedUp: (next, how) => {
      setSignedIn(true); setProvider(how || 'email'); setConnected(false); setNewAcct(true); setUser({ username: '', locked: false });
      if (next === 'checkout') go('checkout'); else go('username', { next: 'connect' });
    },
    nameChosen: (name, next) => { setUser({ username: name, locked: false }); setNewAcct(false); go(next === 'pass' ? 'pass' : 'connect'); },
    afterCheckout: () => (newAcct ? go('username', { next: 'pass' }) : go('pass')),
    signedIn: (how) => { setSignedIn(true); setProvider(how || 'email'); setConnected(true); go('games'); },
    paid: (free) => {
      const months = GS_PLAN[choice].months;
      setSubState({ ...GS_SUB_DEFAULT, status: free ? 'free' : 'active', plan: choice, freeUsed: true,
        renew: (free ? gsAddDays(GS_DAY0, 30) : gsAddMonths(GS_DAY0, months)).getTime() });
      gs.afterCheckout();
    },
    deleteAccount: () => { setSignedIn(false); setSubState(GS_SUB_DEFAULT); setConnected(false); go('signin'); },
  };
  window.gsApi = gs;

  // ---- the states register (app/states.jsx, a deletable aid) ----------------------
  const [landing, setLanding] = useState(() => (window.kitResolveState ? window.kitResolveState() : null));
  const { byId: STATE_BY_ID, groups: STATE_GROUPS } = (window.buildStates
    ? window.buildStates({ reset, setView, setConnected, setReview, go, setSub, setProvider, setChoice, setUser })
    : { byId: {}, groups: [] });
  const goState = (id) => { const s = STATE_BY_ID[id]; if (s) { s.go(); setLanding(null); } };
  const resetAndShow = window.buildStates && (() => { reset(); setLanding(null); });

  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !landing || landing.kind !== 'state') return;
    const st = STATE_BY_ID[landing.id];
    if (!st) return;
    deepLinked.current = true;
    st.go();
  }, [landing]);

  const StatesIndexView = window.StatesIndex;
  const showIndex = !!StatesIndexView && !!landing && (landing.kind === 'index' || landing.kind === 'unresolved');

  // Layouts adapt to the width they are handed (GOTCHA 6): measure the root.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !window.ResizeObserver) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [forcedMobile, showIndex]);

  const appTree = (
    <GsCtx.Provider value={gs}>
      <div className="gs-root" ref={rootRef}>
        {GS_ROUTES.includes(route.name) && !GS_BARE.includes(route.name) && <GsTopBar />}
        <GsScreen key={idx.current} name={route.name} />
        {GS_FOOTER.includes(route.name) && <GsFooter />}
        <GsPlayPopup />
        <GsDemoBar />
      </div>
    </GsCtx.Provider>
  );

  return (
    <>
      {showIndex ? (
        <StatesIndexView reason={landing} groups={STATE_GROUPS} onGo={goState} onDismiss={() => setLanding(null)} />
      ) : forcedMobile ? (
        <div className="kit-stage">
          <div className="kit-phone"><div className="kit-phone-clip"><div className="kit-phone-screen">{appTree}</div></div></div>
        </div>
      ) : appTree}

      {/* Config pill, mounted outside the phone frame: the frame's transform would capture its position: fixed. */}
      {ConfigLauncher && <ConfigLauncher
        statesGroups={STATE_GROUPS} onGoState={goState}
        onOpenStatesIndex={() => setLanding({ kind: 'index', name: 'index' })}
        onReset={resetAndShow}
        layout={layout} onLayoutChange={setLayout} />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<KitApp />);
