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

const GS_REVIEW_DEFAULT = { providerFail: false, device: 'known', passFail: false, sheet: 'completes', week: 'done', today: 'played' };
const GS_USER_DEFAULT = { username: 'MonaLaser', locked: false, email: 'you@example.com' };
// status: none | free (14-day trial) | active | failed | ending
const GS_SUB_DEFAULT = { status: 'none', plan: 'monthly', freeUsed: false, pending: null, fromFree: false, renew: null };
// Screens with their own frame (no shared top bar).
const GS_BARE = ['signup', 'signin', 'verify', 'username', 'recover', 'returning', 'checkout', 'update-card', 'loading', 'offline'];
// Screens that carry the site footer: everything except single-purpose screens (sign-in, sign-up, verify, recover, returning, checkout, update-card, loading, offline).
// Not-found carries it too (KitApp). The auth screens carry the legal links in their own foot (GsAuthFrame).
const GS_FOOTER = ['home', 'games', 'library', 'delve', 'word', 'groups', 'mystery', 'escape', 'casebook', 'hunter', 'pass', 'legal', 'connect', 'history', 'session', 'account'];
// Screens a signed-out view cannot hold.
const GS_SIGNED_IN_ONLY = ['library', 'history', 'account', 'update-card', 'checkout'];
// Screens that make or enter an account. Someone signed in never lands on them.
const GS_AUTH_ONLY = ['signup', 'signin', 'verify', 'username', 'recover', 'returning'];

// Every route the app holds. Anything else is not-found, which carries no chrome.
const GS_ROUTES = ['home', 'signup', 'signin', 'verify', 'username', 'recover', 'returning', 'connect', 'games', 'library', 'delve', 'word', 'groups', 'mystery', 'escape', 'casebook', 'hunter',
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
    case 'library': return <GsLibrary />;
    case 'delve': return <GsDelve />;
    case 'word': return <GsWord />;
    case 'groups': return <GsGroups />;
    case 'mystery': return <GsMystery />;
    case 'escape': return <GsEscape />;
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

// A page loads as a page on arrival: the top bar and footer stand, the content waits.
// Back does not repeat the wait (the page was already loaded). Discover with its own route.load keeps its own states.
const GS_ARRIVES = ['games', 'library', 'history', 'session', 'pass', 'account', 'delve', 'word', 'groups', 'mystery', 'escape', 'casebook', 'hunter'];
const GsArrival = ({ name, quick }) => {
  const gs = useGs(); const r = gs.route;
  const held = r.hold === 'page';
  const skip = quick || !GS_ARRIVES.includes(name) || (name === 'games' && !!r.load);
  const [ready, setReady] = useState(skip && !held);
  useEffect(() => {
    if (ready || held) return undefined;
    const t = setTimeout(() => setReady(true), GS_LOAD_MS);
    return () => clearTimeout(t);
  }, []);
  if (ready) return <GsScreen name={name} />;
  return <main className="gs-wrap gs-main" aria-busy="true"><div className="gs-inplace" style={{ minHeight: '60vh' }}><GsSpin /></div></main>;
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
  const [review, setReviewState] = useState(GS_REVIEW_DEFAULT);
  const [playing, setPlaying] = useState(null);
  const [width, setWidth] = useState(() => window.innerWidth);
  const rootRef = useRef(null);

  const view = !signedIn ? 'out' : GS_SUB_HOLDS.includes(sub.status) ? 'pass' : 'free';
  const viewRef = useRef(view); viewRef.current = view;
  // Where a route lands for this view: auth screens are for signed-out people, account screens for signed-in ones,
  // checkout never opens for a Pass holder, and a signed-in home is Discover.
  const land = (r, v) => {
    if (v !== 'out' && (GS_AUTH_ONLY.includes(r.name) || r.name === 'home')) return { name: 'games' };
    if (v === 'out' && GS_SIGNED_IN_ONLY.includes(r.name)) return { name: 'home' };
    if (v === 'pass' && r.name === 'checkout') return { name: 'account' };
    return r;
  };

  // Routes are history entries, so the browser's Back returns where you came from.
  const stack = useRef([{ name: 'home' }]);
  const idx = useRef(0);
  const backNav = useRef(false);
  useEffect(() => {
    try { window.history.replaceState({ ...(window.history.state || {}), gsIdx: 0 }, ''); } catch (e) {}
    const onPop = (e) => {
      const i = e.state && e.state.gsIdx;
      if (typeof i === 'number' && stack.current[i]) {
        const r = land(stack.current[i], viewRef.current);
        // A page left from the play dialog (How to connect) comes back with the dialog open on the same prompt.
        stack.current[i] = r.reopen ? { ...r, reopen: null } : r; idx.current = i; backNav.current = true; setPlaying(r.reopen || null); setRoute(stack.current[i]);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const go = (name, extra, asView) => {
    // asView false: a staged state, which sets the view itself in the same tick.
    const r0 = { name, ...(extra || {}) };
    const r = asView === false ? r0 : land(r0, asView || view);
    // Where the player came from, for back links (LbBackTo). A staged state has no earlier page.
    const cur = stack.current[idx.current];
    if (asView !== false && cur) r.prev = { name: cur.name, page: cur.page || null };
    idx.current += 1; backNav.current = false;
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
    setChoice('yearly'); setConnected(false); setReviewState(GS_REVIEW_DEFAULT); go('home', null, 'out');
  };

  const gs = {
    route, view, sub, user, provider, choice, connected, review, playing, width, narrow: width < 640,
    go, setConnected, setReview, setView, setSub, setUser, setProvider, setChoice,
    // keep: write a page's own state into its history entry, so browser Back returns it as it was left.
    keep: (patch) => { const i = idx.current; stack.current[i] = { ...stack.current[i], ...patch }; },
    back: () => { if (idx.current > 0) window.history.back(); },
    goHow: () => go('connect'),
    howFromPlay: () => { stack.current[idx.current] = { ...stack.current[idx.current], reopen: playing }; go('connect'); },
    startFree: () => (view === 'out' ? go('signup') : go('games')),
    signOut: () => { setSignedIn(false); go('home', null, 'out'); },
    // Each view has its own home: signed out is `home`, signed in is `games`. Switching views swaps one for the other.
    setDemoView: (v) => {
      setView(v);
      if (v === 'out' && (GS_SIGNED_IN_ONLY.includes(route.name) || (route.name === 'games' && view !== 'out'))) go('home', null, 'out');
      else if (v !== 'out' && (route.name === 'home' || GS_AUTH_ONLY.includes(route.name))) go('games', null, v);
    },
    // Every play control opens the play dialog with its prompt (gs-connect.jsx). The store can't know whether the AI is connected.
    play: (name) => setPlaying(gsPlayReq(gs, name)),
    playReq: (req) => setPlaying(req),
    closePlay: () => setPlaying(null),
    // Billing needs an account: signed out signs up first, then goes to checkout.
    // A Pass holder is sent to Account (land), so no second purchase starts.
    getPass: () => (view === 'out' ? go('signup', { next: 'checkout' }) : go('checkout')),
    // An account exists only once it has a username, so the username always comes before any payment page.
    // Email: the username is on the sign-up form and the account is made when the email is verified.
    // Google or Apple: the provider returns, the new-device code, then Your username; the account is made there.
    accountMade: (name, how, next) => {
      setSignedIn(true); setProvider(how || 'email'); setConnected(false); setUser({ username: name, locked: false });
      go(next === 'checkout' ? 'checkout' : 'connect', null, 'free');
    },
    afterCheckout: () => go('pass'),
    // Back from checkout's "Cancel and return" keeps the plan chosen on the Pass page (choice is held here).
    // next: where sign-in returns (the Pass page, when sign-in started from the Pass page's sign-up route).
    signedIn: (how, next) => { setSignedIn(true); setProvider(how || 'email'); setConnected(true); go(next || 'games', null, 'free'); },
    paid: (free) => {
      const months = GS_PLAN[choice].months;
      setSubState({ ...GS_SUB_DEFAULT, status: free ? 'free' : 'active', plan: choice, freeUsed: true,
        renew: (free ? gsAddDays(GS_DAY0, GS_TRIAL_DAYS) : gsAddMonths(GS_DAY0, months)).getTime() });
      go('pass', null, 'pass');
    },
    deleteAccount: () => { setSignedIn(false); setSubState(GS_SUB_DEFAULT); setConnected(false); go('signin', null, 'out'); },
  };
  window.gsApi = gs;

  // ---- the states register (app/states.jsx, a deletable aid) ----------------------
  const [landing, setLanding] = useState(() => (window.kitResolveState ? window.kitResolveState() : null));
  const { byId: STATE_BY_ID, groups: STATE_GROUPS } = (window.buildStates
    ? window.buildStates({ reset, setView, setConnected, setReview, go: (n, e) => go(n, e, false), setSub, setProvider, setChoice, setUser })
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
        <GsArrival key={idx.current} name={route.name} quick={backNav.current} />
        {(GS_FOOTER.includes(route.name) || !GS_ROUTES.includes(route.name)) && <GsFooter />}
        <div id="gs-announce" className="gs-vh" role="status" aria-live="polite"></div>
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
