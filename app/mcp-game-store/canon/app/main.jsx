// ============================================================================
// [Platform] — the root. Owns the app's state, decides which screen you are on,
// and mounts the prototype aids around it.
//
// The aids (config.jsx, states.jsx + states-ui.jsx, qa.jsx, gs-config.jsx) are
// read off `window` and each may be ABSENT: leave a file and its script tag out
// and the app carries on without it, no edit here.
//
// The demo bar (GsDemoBar) is also a prototype control, asked for in the brief:
// it switches the whole prototype between signed out, free and Pass.
// ============================================================================
const { useState, useEffect, useRef } = React;

const GS_REVIEW_DEFAULT = { providerFail: false, appleNone: false, payFail: false };
// Screens with their own frame (no shared top bar): auth, provider, loaders.
const GS_BARE = ['signup', 'signin', 'verify', 'recover', 'returning', 'checkout'];
// Screens a signed-out view cannot hold.
const GS_SIGNED_IN_ONLY = ['connect', 'history', 'verify'];

const GsScreen = ({ name }) => {
  switch (name) {
    case 'signup': return <GsSignUp />;
    case 'signin': return <GsSignIn />;
    case 'verify': return <GsVerify />;
    case 'recover': return <GsRecover />;
    case 'returning': return <GsReturning />;
    case 'connect': return <GsConnect />;
    case 'games': return <GsGames />;
    case 'delve': return <GsDelve />;
    case 'puzzles': return <GsPuzzles />;
    case 'session': return <GsSession />;
    case 'history': return <GsHistory />;
    case 'pass': return <GsPass />;
    case 'checkout': return <GsCheckout />;
    default: return <GsHome />;
  }
};

const KitApp = () => {
  // viewport / layout posture: 'auto' | 'desktop' | 'mobile', set from Config.
  const [layout, setLayout] = useState('auto');
  const forcedMobile = layout === 'mobile';
  const ConfigLauncher = window.ConfigLauncher;

  // ---- product state ------------------------------------------------------------
  const [route, setRoute] = useState({ name: 'home' });
  const [view, setView] = useState('out');            // 'out' | 'free' | 'pass'
  const [connected, setConnected] = useState(false);
  const [review, setReviewState] = useState(GS_REVIEW_DEFAULT);
  const [playing, setPlaying] = useState(null);
  const [width, setWidth] = useState(() => window.innerWidth);
  const rootRef = useRef(null);

  const go = (name, extra) => { setPlaying(null); setRoute({ name, ...(extra || {}) }); setTimeout(gsScrollTop, 0); };
  const setReview = (patch) => setReviewState((r) => ({ ...r, ...patch }));
  const reset = () => { setView('out'); setConnected(false); setReviewState(GS_REVIEW_DEFAULT); go('home'); };

  const gs = {
    route, view, connected, review, playing, width, narrow: width < 640,
    go, setConnected, setReview, setView,
    goHow: () => { go('home'); setTimeout(() => gsScrollToId('gs-how'), 40); },
    startFree: () => (view === 'out' ? go('signup') : go('games')),
    signOut: () => { setView('out'); go('home'); },
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
    signedUp: (next) => { setView('free'); setConnected(false); go(next === 'checkout' ? 'checkout' : 'connect'); },
    signedIn: () => { setView((v) => (v === 'out' ? 'free' : v)); setConnected(true); go('games'); },
    paid: () => { setView('pass'); go('pass'); },
  };
  window.gsApi = gs;

  // ---- the states register (app/states.jsx, a deletable aid) ----------------------
  const [landing, setLanding] = useState(() => (window.kitResolveState ? window.kitResolveState() : null));
  const { byId: STATE_BY_ID, groups: STATE_GROUPS } = (window.buildStates
    ? window.buildStates({ reset, setView, setConnected, setReview, go })
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
        {!GS_BARE.includes(route.name) && <GsTopBar />}
        <GsScreen name={route.name} />
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

      {/* Launcher, mounted outside the phone frame: the frame's transform would capture its position: fixed. */}
      {ConfigLauncher && <ConfigLauncher
        statesGroups={STATE_GROUPS} onGoState={goState}
        onOpenStatesIndex={() => setLanding({ kind: 'index', name: 'index' })}
        onReset={resetAndShow}
        layout={layout} onLayoutChange={setLayout} />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<KitApp />);
