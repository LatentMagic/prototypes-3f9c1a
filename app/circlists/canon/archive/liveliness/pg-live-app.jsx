// ============================================================================
// Liveliness playground — the app itself: shell chrome, feed, and the demo
// control strip that drives the five journeys.
//
// State model worth knowing:
//   dividerAt — the FROZEN last-seen mark. Drives the divider for the whole
//               session; opening a circle does NOT move it (that would erase
//               the position the member is reading the feed against).
//   unseen    — drives the rail dot only. Cleared when the circle's feed renders.
//   pending   — arrivals the silent poll found. Held out of the feed until the
//               reveal pill is clicked: background arrivals never shift content.
//   queued    — arrivals nothing has surfaced yet. Only a manual refresh finds
//               them, so the manual gesture has something honest to report.
// ============================================================================
const { Icon, Avatar, PulseLockup, BrandSpinner, displayName } = window;
const { FeedCard } = window;
const { PGL_CIRCLES, PGL_USER, pglNextDrop, pglDividerIndex } = window;
const { PglDot, PglDivider, PglPill, PglRefresh, PglRefreshIcon, PglLoading } = window;

const PGL_GESTURES = ['both', 'rail', 'header'];
const PGL_DONES = ['text', 'tick', 'silent'];
const PGL_GESTURE_LABEL = { both: 'both', header: 'header button', rail: 'circle click' };

const PGL_KEY = 'pg_live_v2';
const pglPrefs = () => { try { return JSON.parse(localStorage.getItem(PGL_KEY)) || {}; } catch (e) { return {}; } };

const PglApp = () => {
  const prefs = React.useRef(pglPrefs()).current;
  const startId = PGL_CIRCLES.some((c) => c.id === prefs.openId) ? prefs.openId : PGL_CIRCLES[0].id;
  const [circles, setCircles] = React.useState(PGL_CIRCLES);
  const [openId, setOpenId] = React.useState(startId);
  const [tab, setTab] = React.useState('active');
  const [loading, setLoading] = React.useState(false);
  // busySrc names the control the gesture came from: the busy state belongs to
  // the gesture, so it renders in whichever control was actually used.
  const [busySrc, setBusySrc] = React.useState(null);
  const [utd, setUtd] = React.useState(null);
  const [rm, setRm] = React.useState(!!prefs.rm);
  // Which manual-refresh gesture is live. 'header' = the icon button, 'rail' =
  // clicking the already-open circle, 'both' = offer both and compare.
  const [gesture, setGesture] = React.useState(PGL_GESTURES.includes(prefs.gesture) ? prefs.gesture : 'both');
  // How a manual refresh reports "nothing new" — the treatment under review.
  const [done, setDone] = React.useState(PGL_DONES.includes(prefs.done) ? prefs.done : 'text');
  const [arriveIds, setArriveIds] = React.useState([]);
  const [pillOut, setPillOut] = React.useState(false);
  const openRef = React.useRef(openId);
  openRef.current = openId;
  const circlesRef = React.useRef(circles);
  circlesRef.current = circles;

  const circle = circles.find((c) => c.id === openId);

  React.useEffect(() => {
    document.documentElement.classList.toggle('pg-rm', rm);
    try { localStorage.setItem(PGL_KEY, JSON.stringify({ openId, rm, gesture, done })); } catch (e) { /* private mode */ }
  }, [rm, openId, gesture, done]);

  const patch = (id, fn) => setCircles((cs) => cs.map((c) => (c.id === id ? fn(c) : c)));

  // ---- open a circle: shell stays, feed region loads ----------------------
  const openCircle = (id) => {
    if (loading) return;
    // Re-clicking the circle you are already in is a manual refresh gesture, not
    // navigation — nothing reloads, so the busy state sits on the rail entry.
    if (id === openId) { if (gesture !== 'header') refresh('rail'); return; }
    setOpenId(id); setTab('active'); setLoading(true); setUtd(null); setPillOut(false);
    setTimeout(() => {
      setLoading(false);
      patch(id, (c) => ({ ...c, unseen: false }));
    }, 900);
  };

  // ---- a link lands somewhere (the silent poll's only visible consequence) --
  const drop = (targetId, by) => {
    const item = pglNextDrop(by);
    setTimeout(() => {
      const isOpen = targetId === openRef.current;
      patch(targetId, (c) => (isOpen
        ? { ...c, pending: [item, ...c.pending] }
        : { ...c, items: [item, ...c.items], unseen: true }));
    }, 1000);
  };

  // ---- reveal: the click is what moves the feed ---------------------------
  const reveal = () => {
    if (pillOut) return;
    setPillOut(true);
    const id = openRef.current;
    setTimeout(() => {
      // Read what is landing from state first — see simulateTrace: a state
      // updater cannot hand values back to the handler that queued it.
      const c0 = circlesRef.current.find((c) => c.id === id);
      const landed = c0 ? c0.pending.map((i) => i.id) : [];
      patch(id, (c) => ({ ...c, items: [...c.pending, ...c.items], pending: [] }));
      if (landed.length) setArriveIds((a) => [...a, ...landed]);
      setPillOut(false);
    }, 180);
  };

  // ---- manual refresh: busy state in the control, content never blanks ----
  // What it finds is surfaced by the SAME reveal pill the silent poll uses — one
  // affordance for "new items exist", whatever went looking for them. Only the
  // pill click moves the feed.
  const refresh = (source) => {
    if (busySrc || loading) return;
    setBusySrc(source); setUtd(null);
    const id = openRef.current;
    setTimeout(() => {
      setBusySrc(null);
      const c0 = circlesRef.current.find((c) => c.id === id);
      const found = c0 ? c0.queued.length > 0 : false;
      if (found) patch(id, (c) => ({ ...c, pending: [...c.queued, ...c.pending], queued: [] }));
      else if (done !== 'silent') {
        setUtd(source);
        // The tick holds ~1s then the control returns to rest; the text treatment
        // times itself out on its own fade (onAnimationEnd).
        if (done === 'tick') setTimeout(() => setUtd(null), 1000);
      }
    }, 800);
  };

  // ---- demo controls ------------------------------------------------------
  const queueHidden = () => {
    const item = pglNextDrop('Ada L.');
    patch(openRef.current, (c) => ({ ...c, queued: [item, ...c.queued] }));
  };

  const resetLastSeen = () => {
    patch(openRef.current, (c) => ({ ...c, dividerAt: Date.now() }));
  };

  const controls = [
    { label: 'Drop a link (as Priya)', run: () => drop(openRef.current, 'Priya N.') },
    { label: 'Drop a link in Tuesday Book Club', run: () => drop('sp-book', 'Sam R.') },
    { label: 'Queue a hidden arrival', run: queueHidden },
    { label: 'Reset last-seen', run: resetLastSeen },
  ];

  // ---- feed rows ---------------------------------------------------------
  // The card is the shipped FeedCard, mounted as-is. Mark-as-read and delete are
  // visual only here — this playground is about what SURROUNDS the card.
  const readTab = tab === 'read';
  const items = readTab ? circle.read : circle.items;
  const divIdx = readTab ? -1 : pglDividerIndex(circle.items, circle.dividerAt);
  const noop = () => {};
  const rows = [];
  items.forEach((it, i) => {
    if (i === divIdx) rows.push(<PglDivider key="divider" />);
    const card = <FeedCard item={it} tab={tab} user={PGL_USER} onOpen={noop} onMarkRead={noop} onDelete={noop} />;
    rows.push(arriveIds.includes(it.id)
      // The arrival wrapper carries the settle-in + light sweep, then takes itself
      // off so its overflow clip can never affect the card's own overlays.
      ? <div key={it.id} className="pgl-arrive" onAnimationEnd={(e) => { if (e.animationName === 'pgl-sweep') setArriveIds((a) => a.filter((x) => x !== it.id)); }}>{card}</div>
      : <React.Fragment key={it.id}>{card}</React.Fragment>);
  });

  return (
    <div className="pgl-page">
      <aside className="pgl-rail">
        <div className="pgl-raillockup"><PulseLockup size={20} /></div>
        <div className="pgl-railhead">Circles</div>
        <div className="pgl-raillist">
          {circles.map((c) => {
            const active = c.id === openId;
            return (
              <button key={c.id} className={'pgl-railitem' + (active ? ' pgl-railitem-on' : '')}
                onClick={() => openCircle(c.id)} aria-current={active ? 'true' : undefined}
                title={active && gesture !== 'header' ? 'Refresh ' + c.name : undefined}>
                {active && <span className="pgl-railbar" aria-hidden="true" />}
                <span className="pgl-railname">{c.name}</span>
                {active && busySrc === 'rail'
                  ? <span className="pgl-railbusy" role="status" aria-label="Refreshing"><BrandSpinner size={18} /></span>
                  : (active && utd === 'rail' && done === 'tick'
                    ? <span className="pgl-railbusy" role="status" aria-label="Up to date"><Icon name="check" size={16} /></span>
                    : (c.unseen && <PglDot />))}
              </button>
            );
          })}
        </div>
        <div className="pgl-railfoot">
          <Avatar name={displayName(PGL_USER)} size={30} accent />
          <div style={{ minWidth: 0 }}>
            <div className="pgl-acctname">{displayName(PGL_USER)}</div>
            <div className="pgl-acctmail">{PGL_USER.email}</div>
          </div>
        </div>
      </aside>

      <div className="pgl-main">
        <header className="pgl-topbar">
          <span className="pgl-circlename">{circle.name}</span>
          {gesture !== 'rail'
            ? <PglRefresh busy={busySrc === 'header'} done={done} upToDate={!!utd} onClick={() => refresh('header')} onUpToDateEnd={() => setUtd(null)} />
            : (utd && done === 'text' && <span className="pgl-utd" role="status" onAnimationEnd={() => setUtd(null)}>Up to date</span>)}
          <button className="pgl-iconbtn" aria-label="Circle settings" title="Circle settings">
            <Icon name="settings" size={18} />
          </button>
        </header>

        <div className="pgl-tabs">
          {['active', 'read'].map((t) => (
            <button key={t} onClick={() => setTab(t)} aria-current={tab === t}
              className={'pgl-tab' + (tab === t ? ' pgl-tab-on' : '')}>
              {t === 'active' ? 'Active' : 'Read'}
            </button>
          ))}
        </div>

        {loading ? <PglLoading /> : (
          <div className="pgl-feed">
            {!readTab && circle.pending.length > 0 && <PglPill leaving={pillOut} onClick={reveal} />}
            {rows}
          </div>
        )}
      </div>

      <div className="pgl-strip">
        <span className="pgl-striplabel">Playground · demo controls</span>
        {controls.map((c) => (
          <button key={c.label} className="pgl-tool" onClick={c.run}>{c.label}</button>
        ))}
        <button className="pgl-tool" onClick={() => setGesture((g) => PGL_GESTURES[(PGL_GESTURES.indexOf(g) + 1) % PGL_GESTURES.length])}>
          Refresh gesture: {PGL_GESTURE_LABEL[gesture]}
        </button>
        <button className="pgl-tool" onClick={() => setDone((d) => PGL_DONES[(PGL_DONES.indexOf(d) + 1) % PGL_DONES.length])}>
          Nothing-new state: {done === 'text' ? '“Up to date”' : done}
        </button>
        <button className="pgl-tool" aria-pressed={rm} onClick={() => setRm((v) => !v)}>
          Reduced motion: {rm ? 'on' : 'off'}
        </button>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PglApp />);
