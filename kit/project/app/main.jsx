// ============================================================================
// Kit — the root. Owns the app's state, decides which screen you are on, and
// mounts the prototype aids around it.
//
// The aids (config.jsx, states.jsx + states-ui.jsx, qa.jsx) are read off
// `window` and each may be ABSENT: leave a file
// and its script tag out and the app carries on without it, no edit here.
//
// A candidate build (skills/candidate-build) may publish window.KitCandidate; it is
// read below, per render, and absent means the shipped behaviour. If the product
// persists state, its root reads the storage key as `window.KIT_STATE_KEY || '<default>'`
// so a candidate entry can set its own.
//
// PlaceholderScreen and KIT_SEED_ITEMS stand in for the product. Replace them;
// keep the wiring below them.
// ============================================================================
const { useState, useEffect, useRef } = React;

// ---- Seed --------------------------------------------------------------------
// What the app opens on, and what every state restages before it stages.
// TODO(product): the product's own seed data, in its own file loaded before this one.
const KIT_SEED_ITEMS = ['First item', 'Second item'];

// ---- The placeholder screen --------------------------------------------------
const PlaceholderScreen = ({ items, isMobile, isApp }) => (
  <main className="kit-placeholder">
    <div className="kit-placeholder-eyebrow">Placeholder screen{isApp ? ' · app' : ''}</div>
    <h1 className="kit-placeholder-title">{items.length === 0 ? 'Nothing here yet' : items.length + ' items'}</h1>
    <p className="kit-placeholder-lede">
      The product's first screen replaces this one. The pill at the bottom right holds the prototype
      aids: Config, States and QA.
    </p>
    {items.length === 0
      ? <div className="kit-placeholder-empty">No items. Open States and pick “The screen with items”.</div>
      : <ul className="kit-placeholder-items" data-mobile={isMobile ? '1' : undefined}>
          {items.map((it) => <li key={it}>{it}</li>)}
        </ul>}
  </main>
);

// ---- The app posture's system bars ---------------------------------------------
// Platform: Mobile only. Drawn over the screen inside the phone clip, as a phone
// draws them over an app that fills it. The space they take is
// --safe-area-inset-top / --safe-area-inset-bottom (index.html). Mobile web
// (Viewport: Mobile) draws neither: there a browser owns the top of the screen.
const KitPhoneBars = () => (
  <>
    <div className="kit-phone-status" aria-hidden="true">
      <span>9:41</span>
      <span className="kit-phone-island" />
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
    <div className="kit-phone-home" aria-hidden="true" />
  </>
);

// ---- App -------------------------------------------------------------------
const KitApp = () => {
  // viewport / layout posture: 'auto' | 'desktop' | 'mobile', set from Config.
  // Held for the page's life only; a reload returns to 'auto'.
  const [layout, setLayout] = useState('auto');
  const [winW, setWinW] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Platform posture: 'web' | 'app', set from Config. Session-only like the
  // Viewport. 'web' = the two web postures (desktop web, mobile web); 'app' = the
  // native app posture. The app posture always uses the phone frame, whatever
  // the Viewport says, and only it draws the system bars.
  const [platform, setPlatform] = useState('web');
  const isApp = platform === 'app';
  const forcedMobile = layout === 'mobile' || isApp;
  const isMobile = isApp ? true : layout === 'mobile' ? true : layout === 'desktop' ? false : winW < 1024;

  const ConfigLauncher = window.ConfigLauncher;

  const [items, setItems] = useState(() => KIT_SEED_ITEMS.slice());

  // The address this page was opened at. `?state=<id>` stages that state;
  // `?state=index` or a name the register does not hold renders the catalogue
  // instead of the app. Nothing in the address -> null, and the app opens where
  // the real app does.
  // The register is a deletable aid, so absent -> null -> shipped behaviour.
  // NOTE: no link can be handed to this page inside the design tool, so this
  // whole path looks INERT in preview.
  const [landing, setLanding] = useState(() => (window.kitResolveState ? window.kitResolveState() : null));

  // ---- the states register (app/states.jsx, a deletable aid) --------------
  // Every staged state of the app, with its address. The register feeds all
  // three of its surfaces from one list: the palette in the Config pill, the index,
  // and `?state=` above. Drop app/states.jsx + app/states-ui.jsx and the states
  // half of the Config pill, the index and the address reading all vanish together,
  // leaving the product core clean.
  const { byId: STATE_BY_ID, groups: STATE_GROUPS, reset } = (window.buildStates
    ? window.buildStates({ seedItems: KIT_SEED_ITEMS, setItems, setPlatform })
    : { byId: {}, groups: [], reset: null });
  // Going to a state, or resetting, leaves the states index: on it the staged
  // app is not showing, so the act would otherwise be invisible.
  const goState = (id) => { const s = STATE_BY_ID[id]; if (s) { s.go(); setLanding(null); } };
  const resetAndShow = reset && (() => { reset(); setLanding(null); });

  // A named state wins over whatever was restored. Staged once, after mount, so
  // the stagers run against a fully built app rather than during hydration.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !landing || landing.kind !== 'state') return;
    const st = STATE_BY_ID[landing.id];
    if (!st) return;
    deepLinked.current = true;
    st.go();
  }, [landing]);

  // The catalogue: what `?state=index` opens, and where a name the register does
  // not hold lands — the reader sees a list that does not contain the name they
  // came for. Dismissing it leaves the app exactly where it booted.
  const StatesIndexView = window.StatesIndex;
  const showIndex = !!StatesIndexView && !!landing && (landing.kind === 'index' || landing.kind === 'unresolved');

  // Candidate-build hook (droppable, like the aids above): window.KitCandidate may
  // hold bind(api), handed the app's state and setters, and Screen, rendered in place
  // of the app's screen. Absent -> the shipped screen, unchanged.
  const Cand = window.KitCandidate || null;
  const candApi = Cand ? { items, setItems, isMobile, isApp } : null;
  if (Cand && Cand.bind) Cand.bind(candApi);

  const appTree = Cand && Cand.Screen
    ? <Cand.Screen api={candApi} />
    : <PlaceholderScreen items={items} isMobile={isMobile} isApp={isApp} />;

  return (
    <>
      {showIndex ? (
        <StatesIndexView reason={landing} groups={STATE_GROUPS}
          onGo={goState}
          onDismiss={() => setLanding(null)} />
      ) : forcedMobile ? (
        <div className="kit-stage">
          <div className="kit-phone"><div className="kit-phone-clip" data-app={isApp ? '1' : undefined}>
            <div className="kit-phone-screen">{appTree}</div>
            {isApp && <KitPhoneBars />}
          </div></div>
        </div>
      ) : appTree}

      {/* Config pill — prototype aid; leaving app/config.jsx out removes it, no edit here.
          Mounted outside the phone frame: the frame's transform would capture its
          position: fixed. */}
      {ConfigLauncher && <ConfigLauncher
        statesGroups={STATE_GROUPS} onGoState={goState}
        onOpenStatesIndex={() => setLanding({ kind: 'index', name: 'index' })}
        onReset={resetAndShow}
        layout={layout} onLayoutChange={setLayout}
        platform={platform} onPlatformChange={setPlatform} />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<KitApp />);
