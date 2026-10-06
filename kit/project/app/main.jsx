// ============================================================================
// Kit — the root. Owns the app's state, decides which screen you are on, and
// mounts the prototype aids around it.
//
// The aids (config.jsx, states.jsx + states-ui.jsx, qa.jsx) are read off
// `window` and each may be ABSENT: leave a file
// and its script tag out and the app carries on without it, no edit here.
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
const PlaceholderScreen = ({ items, isMobile }) => (
  <main className="kit-placeholder">
    <div className="kit-placeholder-eyebrow">Placeholder screen</div>
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
  const forcedMobile = layout === 'mobile';
  const isMobile = layout === 'mobile' ? true : layout === 'desktop' ? false : winW < 1024;

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
  // three of its surfaces from one list: the palette in the launcher, the index,
  // and `?state=` above. Drop app/states.jsx + app/states-ui.jsx and the states
  // half of the launcher, the index and the address reading all vanish together,
  // leaving the product core clean.
  const { byId: STATE_BY_ID, groups: STATE_GROUPS, reset } = (window.buildStates
    ? window.buildStates({ seedItems: KIT_SEED_ITEMS, setItems })
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

  const appTree = <PlaceholderScreen items={items} isMobile={isMobile} />;

  return (
    <>
      {showIndex ? (
        <StatesIndexView reason={landing} groups={STATE_GROUPS}
          onGo={goState}
          onDismiss={() => setLanding(null)} />
      ) : forcedMobile ? (
        <div className="kit-stage">
          <div className="kit-phone"><div className="kit-phone-clip"><div className="kit-phone-screen">{appTree}</div></div></div>
        </div>
      ) : appTree}

      {/* Launcher — prototype aid; leaving app/config.jsx out removes it, no edit here.
          Mounted outside the phone frame: the frame's transform would capture its
          position: fixed. */}
      {ConfigLauncher && <ConfigLauncher
        statesGroups={STATE_GROUPS} onGoState={goState}
        onOpenStatesIndex={() => setLanding({ kind: 'index', name: 'index' })}
        onReset={resetAndShow}
        layout={layout} onLayoutChange={setLayout} />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<KitApp />);
