// ============================================================================
// Circlists v0.2.2 — root state machine (per-space billing).
// The space is the billing unit: £3 / space / month (introductory rate), funded by one member —
// the CHAMPION. Everyone they invite joins free. Creating a space IS funding it.
// Access = the space is funded AND the viewer is a member. No front-door paywall.
// Pulse Modernist carried forward verbatim; Feed + Auth unchanged.
// ============================================================================
const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ---- Seed fixtures + user default live in app/seed-data.jsx (loaded first) ----
const { M, seedSpaces, DEFAULT_USER } = window.CircSeed;

// ---- Persistence -----------------------------------------------------------
// Key is versioned: bump the suffix whenever seed data changes so returning
// sessions pick up the new seed instead of rehydrating stale state. (v2 adds
// the reaction-less firstonehere.com item for testing the first-one-here moment. v3
// adds afewskipped.com (mixed reactions + skips) and heartsclustered.com (all
// members responded, hearts clustered) — two more Swell demo fixtures. v4 adds
// heartsandfires.com — five hearts + five fires, adjacent sectors, to stress the
// two-big-huddles collision case. v5 adds extracted card metadata — title,
// source, and preview image per item (BIZ-80). v8 adds the real Martin Fowler +
// arXiv OG previews to the Backend Pod's first five. v9 makes the top card
// yours. v10 adds liveliness: an `at` per item and lastSeenAt/unseen/pending/
// queued per circle. v11 stamps the last-visit mark on ENTRY, holds the DRAWN
// waterline outside persisted state, and adds remoteDeleted per circle — the
// deletions a rail refresh reconciles away.)
// A candidate-build entry sets window.CIRC_STATE_KEY before app scripts load so
// its persisted state never mixes with the main app's. Absent -> unchanged.
const STATE_KEY = window.CIRC_STATE_KEY || 'circ_state_v11';
const SAVED = (() => { try { return JSON.parse(localStorage.getItem(STATE_KEY) || 'null'); } catch (e) { return null; } })();

// ---- Tweak defaults, baked in ----------------------------------------------
// So the app renders at its intended look even when the Tweaks files
// (circ-tweaks.jsx / tweaks-panel.jsx) are absent — the delete-only homepage-demo
// derivation drops them. When those files are present they take over.
const CIRC_TWEAK_FALLBACK = { accent: '#047857', layout: 'auto', pulseDepth: 7.5, spinSpeed: 1.4 };

// ---- The timed check's cadence ---------------------------------------------
// Deliberately unhurried: the check serves ALIVENESS, and anyone chasing the
// latest uses the rail refresh instead. It ships OFF; Config can switch it on
// and choose the cadence for review.
const CIRC_CHECK_MS = { off: 0, slow: 45000, fast: 7000 };
const useTweaksSafe = (typeof useTweaks === 'function') ? useTweaks : (d) => [d, () => {}];

// ---- App -------------------------------------------------------------------
const CircApp = () => {
  const [tw, setTweak] = useTweaksSafe(window.CIRC_TWEAK_DEFAULTS || CIRC_TWEAK_FALLBACK);
  useEffect(() => { document.documentElement.style.setProperty('--color-accent', tw.accent); }, [tw.accent]);
  // pulse breath depth (peak scale) — dialled live; percent → amp (1 + pct/100)
  useEffect(() => {
    const pct = typeof tw.pulseDepth === 'number' ? tw.pulseDepth : 7.5;
    document.documentElement.style.setProperty('--circ-pulse-amp', String(1 + pct / 100));
  }, [tw.pulseDepth]);
  // spinner pace — dialled live; multiplier on the spec tempo (1 = spec)
  useEffect(() => {
    const s = typeof tw.spinSpeed === 'number' && tw.spinSpeed > 0 ? tw.spinSpeed : 1.4;
    document.documentElement.style.setProperty('--circ-spin-speed', String(s));
  }, [tw.spinSpeed]);

  // viewport / layout posture
  const [winW, setWinW] = useState(window.innerWidth);
  useEffect(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  // Platform posture (Config aid, session-only like the gate). 'web' = the two
  // frozen web postures (desktop + mobile web); 'app' = the native mobile-app
  // posture (AppShellNative). App mode implies the phone viewport regardless of
  // the Viewport control. Mobile payments (off by default in app mode) sends the
  // funding/checkout paths to the finish-on-web handoff.
  const [platform, setPlatform] = useState('web');
  // Review-only: hide the TEST - * demo circles from circle lists (screenshots).
  // Filters presentation only; the fixtures stay in state so scenarios still work.
  const [showTest, setShowTest] = useState(true);
  const [mobilePayments, setMobilePayments] = useState(false);
  const isApp = platform === 'app';
  const forcedMobile = tw.layout === 'mobile' || isApp;
  const isMobile = isApp ? true : tw.layout === 'mobile' ? true : tw.layout === 'desktop' ? false : winW < 1024;
  // Posture + wizard alignment as <html> data attrs — CSS that must follow the
  // POSTURE (not the raw viewport width) keys off these. See .circ-wizard-body.
  useEffect(() => {
    const d = document.documentElement;
    d.setAttribute('data-circ-posture', isMobile ? 'mobile' : 'desktop');
  }, [isMobile]);

  // ---- Deletable-aid / droppable-module handles ----
  // Read once per render from window so the app tolerates any of these files
  // being absent (delete-only homepage-demo derivation): config + tweaks are
  // aids that can be deleted; gate is a module that can be dropped in.
  const ConfigLauncher = window.ConfigLauncher;
  const CircTweaks = window.CircTweaks;
  const GateOverlay = window.GateOverlay;
  // Candidate-build hooks (droppable, like the aids above): a cand-* overlay set
  // may publish window.CircCandidate = { bind, matchRoute, renderRoute, CardRow,
  // FeedLead }. Absent in the main app, so every use below no-ops.
  const Cand = window.CircCandidate || null;

  // ---- Preview gate (dormant hook; lit only when app/gate.jsx is present) ----
  // New circle + the account control dead-end in an unauthenticated preview. When
  // the gate module is present AND active they open GateOverlay instead of running
  // the real flow; otherwise behaviour is unchanged.
  //
  // OFF by default so the working prototype behaves normally (New circle + account
  // run their real flows, every reload). Two ways to switch it on:
  //   • locally: Config → Preview gate → On  (session-only, not persisted)
  //   • in the exported homepage demo: set  window.CIRC_FORCE_GATE = true  in the
  //     embed. No file in this project is hand-edited to activate it.
  const gateModulePresent = !!GateOverlay;
  const [gateOverride, setGateOverride] = useState(false);
  const gateActive = gateModulePresent && (window.CIRC_FORCE_GATE === true || gateOverride);
  const [gateOpen, setGateOpen] = useState(false);
  const onGate = () => setGateOpen(true);

  // core state
  const [route, setRoute] = useState(SAVED?.route || 'space');
  const [user, setUser] = useState(SAVED?.user || DEFAULT_USER);
  const [spaces, setSpaces] = useState(SAVED?.spaces || seedSpaces(DEFAULT_USER.email));
  const [currentId, setCurrentId] = useState(SAVED?.currentId || 'sp-backend');
  const [tab, setTab] = useState(SAVED?.tab || 'active');

  // ---- The address --------------------------------------------------------
  // Read ONCE at mount: `?state=<name>` names a state in the register
  // (app/states.jsx), and a ticket in the real build links straight to it. A
  // resolved name is staged below, overriding the state restored above; `index`
  // or a name the register does not hold renders the catalogue instead of the
  // app. Nothing in the address -> null, and the app opens where the real app
  // does: the top circle, on Active.
  // The register is a deletable aid, so absent -> null -> shipped behaviour.
  // NOTE: no link can be handed to this page inside the design tool, so this
  // whole path looks INERT in preview. See ARCHITECTURE.md -> Addressable states.
  const [landing, setLanding] = useState(() => (window.circResolveState ? window.circResolveState() : null));

  // ephemeral
  const [loadingFeed, setLoadingFeed] = useState(false);
  // Review-only: freeze a loading interstitial so it can be vetted at rest.
  // Auto-clears the moment the route leaves an interstitial (effect below), so
  // it never leaks into a real auth / billing flow.
  const [holdLoading, setHoldLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  // FAB success beat: a successful add flips this true, resolving the FAB glyph to
  // a tick, then self-clears back to the plus. Cancel never sets it.
  const [addConfirm, setAddConfirm] = useState(false);
  const addConfirmTimer = useRef(null);
  const [confirm, setConfirm] = useState(null);
  const [reverify, setReverify] = useState(false);
  // The Swell: mark-as-read opens the reaction flow (no confirm modal). Holds
  // the item being reacted to, or null.
  const [reacting, setReacting] = useState(null);
  const [otc, setOtc] = useState({ context: 'device', error: null });
  const [pendingEmail, setPendingEmail] = useState('sam.rivera@gmail.com');
  const [postAuthTo, setPostAuthTo] = useState('space');
  // (Config launcher state + drag now live in app/config.jsx — a deletable aid.)
  // funding flow: { mode: 'new' | 'refund', name, spaceId }
  const [fundFlow, setFundFlow] = useState({ mode: 'new', name: '', spaceId: null });
  const [manageIntent, setManageIntent] = useState('manage');

  // ---- Liveliness (BIZ-96) ------------------------------------------------
  // The arrival grammar itself is not configurable — the card time, the wash, the
  // New rule and the nothing-new answer are the product. The only knob here is
  // STAGING: the grammar is silent by design, so a review needs arrivals to fire.
  //   activity — simulated background arrivals: 'off' | 'slow' | 'fast'
  const [live, setLive] = useState({ activity: 'off' });
  const setLiveOpt = (k, v) => setLive((s) => ({ ...s, [k]: v }));
  const [refreshing, setRefreshing] = useState(null);   // circle id whose receipt is running
  const [settledId, setSettledId] = useState(null);     // circle whose receipt is resolving into the mark
  const [arrived, setArrived] = useState([]);           // item ids that TRAVEL (pill accept only)
  // The DRAWN waterline: the stored mark as it was when this visit began. Entry
  // stamps the mark to now, so the line the member reads against is held here for
  // the lifetime of the visit and nothing landing afterwards can move it. Visit
  // state, never persisted — a browser reload is a teardown, so it draws no line.
  const [dividerAt, setDividerAt] = useState(null);
  const [announce, setAnnounce] = useState('');
  // Feed sort (BIZ-136 candidate build). Held per circle AND per tab, keyed
  // `<circleId>:<tab>` — Active and Read are different jobs, so a catch-up
  // posture on one does not follow you to the other. VISIT STATE, never
  // persisted: newest-first is the product's contract and the substrate the
  // whole arrivals machinery stands on, so a non-default order is a reading
  // posture for this session rather than a preference that silently outlives it.
  const [sortOrder, setSortOrder] = useState({});
  // Keyed by circle alone — see the note at the render site for why the
  // contributor lens is not held per tab as the order is.
  const [lensWho, setLensWho] = useState({});
  // Density (BIZ-136 run 3): ONE value for the whole feed surface — comfortable
  // or compact — never per tab or per circle. Unlike sortOrder/lensWho this IS
  // persisted (per device, in the app-state blob below): it is a reading
  // preference the member sets once, not a lens applied to one moment's view.
  const [density, setDensity] = useState(SAVED?.density === 'compact' ? 'compact' : 'comfortable');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  // Timers and handlers read state through refs: a setSpaces updater cannot hand
  // values back to the handler that queued it.
  // A menu left open while the view changes underneath it would point at a list
  // that is no longer there, so switching tab or circle closes it.
  useEffect(() => { setSortMenuOpen(false); }, [tab, currentId]);
  const spacesRef = useRef(spaces); spacesRef.current = spaces;
  const currentRef = useRef(currentId); currentRef.current = currentId;
  const tabRef = useRef(tab); tabRef.current = tab;
  // One polite announcement, re-fired cleanly for a repeated gesture: a live
  // region only speaks when its text CHANGES, so it is cleared first.
  const announceTimer = useRef(null);
  const announceOnce = useCallback((msg) => {
    if (announceTimer.current) clearTimeout(announceTimer.current);
    setAnnounce('');
    announceTimer.current = setTimeout(() => {
      setAnnounce(msg);
      announceTimer.current = setTimeout(() => setAnnounce(''), 1600);
    }, 60);
  }, []);
  // Carry the member to arrivals that landed at the top of the feed. The window
  // scrolls on web; the phone screen is the scroller in the app posture.
  const scrollToArrivals = () => {
    const el = document.querySelector('.circ-phone-screen');
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // open Create-a-space fresh (clears any carried name)
  const openCreateSpace = () => { setFundFlow({ mode: 'new', name: '', spaceId: null }); setRoute('create-space'); };

  // Home — the account level. Historically this was only the landing place for a
  // user who holds no membership; in the app posture it is a real destination
  // (the circles list) reached from the circle bar's Home slot. One route serves
  // both: the no-membership case is simply its empty state.
  const goHome = () => { setCurrentId(null); setRoute('home'); };
  // Where Back should return to when Account was opened (home vs a circle).
  // Returning to a circle you were already in must NOT re-run the feed's load
  // state — the feed never left.
  const returnToSpace = () => setRoute('space');
  const [accountFrom, setAccountFrom] = useState('space');
  const openAccount = () => { setAccountFrom(route === 'home' ? 'home' : 'space'); setRoute('account'); };

  // ✕ exit / return destination: no-space home if no membership, else default space
  const exitToApp = () => { if (spaces.length === 0) goHome(); else enterSpace(currentId || (spaces[0] && spaces[0].id)); };

  // persist
  useEffect(() => {
    try { localStorage.setItem(STATE_KEY, JSON.stringify({ route, user, spaces, currentId, tab, density })); } catch (e) {}
  }, [route, user, spaces, currentId, tab, density]);

  const isTestSpace = (s) => /^TEST\b/i.test(s.name || '');
  // ---- The viewer's own view of the circles --------------------------------
  // Scopes what THIS member sees inside each circle (LM-666's delete for me);
  // app/feed.jsx owns the rule. A cand-* overlay may still override it by
  // publishing window.CircViewerSpaces. Mutations run against the raw `spaces` /
  // spacesRef; only what is RENDERED goes through here.
  const viewSpaces = useMemo(() => {
    const f = window.CircViewerSpaces || window.circViewerSpaces;
    return f ? f(spaces, user) : spaces;
  }, [spaces, user]);
  const listSpaces = useMemo(() => showTest ? viewSpaces : viewSpaces.filter(s => !isTestSpace(s)), [viewSpaces, showTest]);
  const space = useMemo(() => viewSpaces.find(s => s.id === currentId) || null, [viewSpaces, currentId]);  const activeItems = space ? space.items.filter(i => !i.read) : [];
  const readItems = space ? space.items.filter(i => i.read) : [];
  const isChampion = (s) => !!s && s.champion === 'You';

  // Release a review-only loading hold as soon as we're off an interstitial.
  const LOADING_ROUTES = ['google-return', 'manage-interstitial', 'setting-up'];
  useEffect(() => {
    if (holdLoading && !LOADING_ROUTES.includes(route)) setHoldLoading(false);
  }, [route, holdLoading]);

  // A fresh load of a circle. It finds everything — arrivals nothing had surfaced
  // yet included — reconciles away what other members deleted, draws the waterline
  // from the stored mark, and stamps that mark to now. The DRAWN line is held in
  // dividerAt, so stamping can never move it.
  const openVisit = useCallback((id) => {
    const sp = spacesRef.current.find(s => s.id === id);
    if (!sp || !sp.funded) { setDividerAt(null); return; }
    setDividerAt(typeof sp.lastSeenAt === 'number' ? sp.lastSeenAt : null);
    setSpaces(prev => prev.map(s => {
      if (s.id !== id) return s;
      const gone = s.remoteDeleted || [];
      const found = s.queued || [];
      return { ...s, items: [...found, ...s.items.filter(i => !gone.includes(i.id))],
        queued: [], remoteDeleted: [], lastSeenAt: Date.now() };
    }));
  }, []);

  // feed-load demo: quiet indicator when entering a funded space
  const enterSpace = useCallback((id) => {
    const target = id || currentId;
    const leaving = currentId && target !== currentId ? currentId : null;
    if (id) setCurrentId(id);
    setRoute('space');
    setArrived([]); setSettledId(null);
    // Leaving with a pill unaccepted folds those arrivals into the feed and leaves
    // the circle holding unseen items. Nothing records where the member crossed —
    // the dot's own test (a circle holding unseen items) already covers them.
    if (leaving) setSpaces(prev => prev.map(s => {
      if (s.id !== leaving) return s;
      const p = s.pending || [];
      return { ...s, items: [...p, ...s.items], pending: [], unseen: s.unseen || p.length > 0 };
    }));
    const sp = spacesRef.current.find(s => s.id === target);
    if (sp && sp.funded) { setLoadingFeed(true); setTimeout(() => setLoadingFeed(false), 700); openVisit(target); }
    else { setLoadingFeed(false); setDividerAt(null); }
  }, [currentId, openVisit]);

  // The session's first circle is reached at mount, not through enterSpace, so
  // that visit is opened here. A reload lands here too — and since the previous
  // visit stamped the mark, it draws no line.
  useEffect(() => { if (route === 'space' && currentId) openVisit(currentId); }, []);

  // Reaching ACTIVE is the accept: the dot clears there and only there. A dot lit
  // while the member sits on Read is pointing them AT Active, so it has to survive
  // until they arrive. An effect, not a branch inside enterSpace, so every way in
  // (mount, a staged state, home, a tab switch) clears it identically.
  useEffect(() => {
    if (route !== 'space' || tab !== 'active' || loadingFeed || !currentId) return;
    const sp = spacesRef.current.find(s => s.id === currentId);
    if (sp && sp.unseen) setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, unseen: false } : s));
  }, [route, tab, loadingFeed, currentId, spaces]);

  // ---- Arrivals -----------------------------------------------------------
  const peerName = (id) => {
    const sp = spacesRef.current.find(s => s.id === id);
    const peers = ((sp && sp.members) || []).filter(m => m.name !== 'You');
    return peers.length ? peers[Math.floor(Math.random() * peers.length)].name : 'Sam R.';
  };
  // A link lands. In the circle the member is IN, on Active, it waits behind the
  // New pill — the feed never shifts underfoot. On Read the pill is out of sight,
  // so the dot lights instead and points them to Active, where the pill is
  // waiting. Anywhere else it lands in the feed and lights that circle's dot.
  const landItem = (id, who) => {
    const item = window.circNextDrop(who || peerName(id));
    const here = id === currentRef.current;
    const onActive = tabRef.current === 'active';
    setSpaces(prev => prev.map(s => s.id !== id ? s
      : (here
          ? { ...s, pending: [item, ...(s.pending || [])], unseen: onActive ? s.unseen : true }
          : { ...s, items: [item, ...s.items], unseen: true })));
  };
  // An arrival nothing has surfaced yet: only a fresh load or the rail refresh
  // finds it, so the deliberate gesture has something honest to report.
  const queueItem = (id, who) => {
    const item = window.circNextDrop(who || peerName(id));
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, queued: [item, ...(s.queued || [])] } : s));
  };
  // Accept: the click is what moves the feed, and it is the one moment a card
  // travels. It stamps the mark; the drawn line stays exactly where it is.
  const revealPending = () => {
    const id = currentRef.current;
    const sp = spacesRef.current.find(s => s.id === id);
    if (!sp || !(sp.pending || []).length) return;
    const ids = sp.pending.map(i => i.id);
    setSpaces(prev => prev.map(s => s.id === id
      ? { ...s, items: [...s.pending, ...s.items], pending: [], lastSeenAt: Date.now() } : s));
    setArrived(a => [...a, ...ids]);
    setTimeout(() => setArrived(a => a.filter(x => !ids.includes(x))), 900);
  };
  // The refresh gesture — selecting the circle already on screen. There is no
  // refresh button. Nothing blanks: the receipt runs in that circle's own rail slot
  // and resolves into the full mark on BOTH outcomes. What it finds LANDS, with no
  // pill — the gesture already gave consent — and it reconciles away what other
  // members deleted. One polite announcement: "Refreshed".
  const refreshSpace = (id) => {
    if (refreshing || loadingFeed) return;
    setRefreshing(id); setSettledId(null);
    setTimeout(() => {
      setRefreshing(null);
      setSettledId(id);
      setTimeout(() => setSettledId(c => (c === id ? null : c)), 2000);
      const sp = spacesRef.current.find(s => s.id === id);
      // Whatever is waiting is what the member just asked for: arrivals nothing had
      // surfaced yet AND anything still behind the pill. The gesture makes the pill
      // moot rather than leaving it up beside the cards it was offering.
      const found = [...((sp && sp.queued) || []), ...((sp && sp.pending) || [])]
        .sort((a, b) => (b.at || 0) - (a.at || 0));
      const gone = (sp && sp.remoteDeleted) || [];
      const here = id === currentRef.current;
      const onActive = tabRef.current === 'active';
      if (found.length || gone.length) setSpaces(prev => prev.map(s => {
        if (s.id !== id) return s;
        return { ...s, items: [...found, ...s.items.filter(i => !gone.includes(i.id))],
          queued: [], pending: [], remoteDeleted: [],
          lastSeenAt: found.length ? Date.now() : s.lastSeenAt,
          // Arrivals always enter unread, so a refresh made from Read lands them on
          // Active, out of sight: the dot carries them, and clears on arrival there.
          unseen: (found.length && here && !onActive) ? true : s.unseen };
      }));
      // Carried to the arrivals only when there are any — scrolling on an empty
      // refresh would move the member for nothing.
      if (found.length && here && onActive) requestAnimationFrame(scrollToArrivals);
      announceOnce('Refreshed');
    }, 900);
  };

  // The app's own eyes: an unhurried timed check, with no member gesture. It is
  // silent — the dot, the pill and the tab icon are its only visible part. Some of
  // what it finds is deliberately left unsurfaced, so the rail refresh has
  // something honest to report.
  useEffect(() => {
    const ms = CIRC_CHECK_MS[live.activity] || 0;
    if (!ms) return;
    const t = setInterval(() => {
      const open = spacesRef.current.filter(s => s.funded && !isTestSpace(s));
      if (!open.length) return;
      const cur = open.find(s => s.id === currentRef.current);
      if (cur && Math.random() < 0.34) { queueItem(cur.id); return; }
      landItem(open[Math.floor(Math.random() * open.length)].id);
    }, ms);
    return () => clearInterval(t);
  }, [live.activity]);

  // The pill arrives with no gesture and is the only way to accept arrivals, so a
  // member who cannot see it is told it is there. Focus does not move.
  const pendCount = (space && (space.pending || []).length) || 0;
  const pendPrev = useRef(pendCount);
  useEffect(() => {
    if (pendCount > pendPrev.current && tab === 'active') announceOnce('New links');
    pendPrev.current = pendCount;
  }, [pendCount, tab, announceOnce]);

  // Home is app-posture chrome. The web postures reach their circles through the
  // rail, so a web session must never sit on it while the user holds circles —
  // switching Platform back to Web lands you in a circle instead.
  useEffect(() => {
    if (!isApp && route === 'home' && spaces.length > 0) enterSpace(currentId || spaces[0].id);
  }, [isApp, route, spaces.length, currentId, enterSpace]);

  // Review-only: hiding the TEST circles while inside one steps out to the first
  // remaining circle so the screenshot never shows a hidden circle's feed.
  useEffect(() => {
    if (showTest) return;
    const cur = spaces.find(s => s.id === currentId);
    if (cur && isTestSpace(cur)) {
      if (listSpaces.length > 0) enterSpace(listSpaces[0].id); else { setCurrentId(null); goHome(); }
    }
  }, [showTest, currentId, listSpaces]);

  // ---- content mutations (peer powers) ----
  const addItem = (item) => {
    setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, items: [item, ...s.items] } : s));
    // Quiet, self-clearing confirmation on the FAB itself — the tick resolves,
    // then settles back to the plus. Green throughout; colour never carries status.
    if (addConfirmTimer.current) clearTimeout(addConfirmTimer.current);
    setAddConfirm(true);
    addConfirmTimer.current = setTimeout(() => setAddConfirm(false), 2600);
    // Async metadata extraction: the card lands pending, then settles in place.
    // (No fixtures come back here, so FeedCard's URL-derived title + source-keyed
    // tint carry the resolved card — the honest floor, never a broken state.)
    if (item.pending) {
      const sid = currentId;
      const settleMs = 1400 + Math.round(Math.random() * 900);
      setTimeout(() => setSpaces(prev => prev.map(s => s.id === sid
        ? { ...s, items: s.items.map(i => i.id === item.id ? { ...i, pending: false } : i) }
        : s)), settleMs);
    }
  };
  // Mark-as-read now also carries the reader's optional reaction (The Swell).
  // The read-write happens regardless; the reaction is appended when present.
  const markRead = (item, reaction) => setSpaces(prev => prev.map(s => s.id === currentId
    ? { ...s, items: s.items.map(i => i.id === item.id
        // The one candidate hook on this write (read off window per call, like
        // every other deletable aid): absent, this is byte for byte the shipped
        // behaviour. LM-652's item 5 uses it to enrol the reader in the card's
        // pool at the mark.
        ? { ...i, read: true, reactions: reaction ? [...(i.reactions || []), reaction] : (i.reactions || []),
            ...(window.CircCandidate && window.CircCandidate.onMarkRead ? window.CircCandidate.onMarkRead(i) : null) }
        : i) }
    : s));
  const deleteItem = (item) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, items: s.items.filter(i => i.id !== item.id) } : s));
  const inviteEmail = (email) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, members: [...s.members, M(email.split('@')[0].replace(/\b\w/g, c => c.toUpperCase()) + ' ', email)] } : s));
  const renameSpace = (name) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, name } : s));
  const removeMember = (memberName) => setSpaces(prev => prev.map(s => {
    if (s.id !== currentId) return s;
    // Removed member KEEPS their name on links they added; "former member" is
    // reserved for account deletion. Links always stay.
    return { ...s, members: s.members.filter(m => m.name !== memberName) };
  }));
  const changeEmail = (email) => setUser(u => ({ ...u, email }));

  const openLink = (item) => { window.open(item.url, '_blank', 'noopener'); };
  // Leaving a circle: it drops from the switcher and the member lands on their
  // next default circle — or the no-circle home if this was their only one.
  const leaveSpace = (id) => {
    const target = id || currentId;
    const rest = spacesRef.current.filter(s => s.id !== target);
    setSpaces(rest);
    const next = rest.find(s => !isTestSpace(s)) || rest[0];
    if (!next) { setCurrentId(null); goHome(); } else enterSpace(next.id);
  };
  // Account deletion. Circles this member champions run to the end of their paid
  // period unmanaged and then go dormant — nothing here announces that to anyone.
  const deleteAccount = () => { setSpaces([]); setCurrentId(null); setUser(DEFAULT_USER); setRoute('signin'); };
  // Delete for me: lands at once in this member's own session, nothing anywhere
  // records that it happened. The circle keeps the link whole for everyone else,
  // and this member's reaction on it still stands for the circle.
  const deleteItemForMe = (item) => {
    if (!item) return;
    setSpaces((prev) => prev.map((s) => (s.id === currentId
      ? { ...s, hiddenForMe: [...((s.hiddenForMe) || []), item.id] }
      : s)));
  };
  const onConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === 'delete') deleteItem(confirm.item);
    else if (confirm.kind === 'leave') leaveSpace(confirm.spaceId);
    // The cost is carried BEFORE the hand-off; only then does the provider open.
    else if (confirm.kind === 'cancel-funding') openManageFunding('cancel');
    // The provider reverifies before a sensitive act runs; the confirm carried
    // the cost, the prompt only asserts identity.
    else if (confirm.kind === 'delete-account') setReverify(true);
    setConfirm(null);
  };

  // ---- create = fund (name-first) ----
  const beginCreateFund = (name) => { setFundFlow({ mode: 'new', name, spaceId: null }); setRoute('funding'); };
  const onCheckoutSuccess = () => {
    if (fundFlow.mode === 'refund') {
      setSpaces(prev => prev.map(s => s.id === fundFlow.spaceId
        ? { ...s, funded: true, dormancy: null, champion: 'You', championEmail: user.email, funding: null, openUntil: null } : s));
      setCurrentId(fundFlow.spaceId); setTab('active'); enterSpace(fundFlow.spaceId);
    } else {
      setRoute('setting-up');
    }
  };
  const finishProvisioning = () => {
    const sp = {
      id: 'sp-' + Date.now(), name: fundFlow.name || 'New circle',
      funded: true, dormancy: null, champion: 'You', championEmail: user.email,
      members: [M('You', user.email)], items: [],
    };
    setSpaces(prev => [sp, ...prev]); setCurrentId(sp.id); setTab('active'); enterSpace(sp.id);
  };

  // ---- re-fund a dormant space (ANY member) ----
  // The remedy belongs to everyone: whoever funds a dormant circle champions it
  // from then on (onCheckoutSuccess sets champion: 'You').
  const beginRefund = () => { if (!space) return; setFundFlow({ mode: 'refund', name: space.name, spaceId: space.id }); setRoute('funding'); };

  // ---- manage funding (champion, per-space provider deep-link) ----
  const openManageFunding = (intent) => { setManageIntent(intent || 'manage'); setRoute('manage-interstitial'); };
  const cancelFunding = () => {
    setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, funded: false, dormancy: 'terminal' } : s));
    enterSpace(currentId);
  };
  // Resume (LM-638): available for the whole paid period, gone once the circle is
  // asleep (then Fund on the dormant screen is the only route, open to everyone).
  // Clearing `funding` returns the card to its ordinary funded state — no charge,
  // no confirm, next payment untouched, and nothing celebrates it.
  const resumeFunding = () => {
    setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, funded: true, dormancy: null, funding: null } : s));
  };

  // ---- auth flows ----
  const signOut = () => { setUser(DEFAULT_USER); setRoute('signin'); };
  const startSignup = ({ firstName, lastName, email }) => {
    setPendingEmail(email);
    setUser({ firstName, lastName, name: 'You', email });
    setOtc({ context: 'signup', error: null }); setPostAuthTo('post-signup'); setRoute('otc');
  };
  const startSignin = (email) => { setPendingEmail(email); setUser({ ...DEFAULT_USER, email }); setOtc({ context: 'device', error: null }); setPostAuthTo('space'); setRoute('otc'); };

  const finishOtc = () => {
    if (postAuthTo === 'post-signup') {
      // Land with NO spaces → the no-space home (create launches from there).
      setSpaces([]); setCurrentId(null); goHome();
    } else {
      if (spaces.length === 0) goHome(); else enterSpace(currentId || spaces[0]?.id);
    }
  };

  // Staging actions for the Config aid's liveliness controls (see app/config.jsx).
  const liveActions = {
    here: (n = 1) => currentId && Array.from({ length: n }).forEach(() => landItem(currentId)),
    elsewhere: (n = 1) => {
      const other = spacesRef.current.find(s => s.funded && !isTestSpace(s) && s.id !== currentId);
      if (other) Array.from({ length: n }).forEach(() => landItem(other.id));
    },
    queue: (n = 1) => currentId && Array.from({ length: n }).forEach(() => queueItem(currentId)),
    // Another member deletes a link. It stays on screen until a gesture that
    // reconciles — a rail refresh, or the next fresh load of the circle.
    deleteElsewhere: () => setSpaces(prev => prev.map(s => {
      if (s.id !== currentId) return s;
      const cand = s.items.filter(i => !(s.remoteDeleted || []).includes(i.id));
      if (!cand.length) return s;
      const victim = cand[Math.min(1, cand.length - 1)];
      return { ...s, remoteDeleted: [...(s.remoteDeleted || []), victim.id] };
    })),
  };

  // ---- the states register (app/states.jsx, a deletable aid) --------------
  // Every staged state of the app, with its address. The register feeds all
  // three of its surfaces from one list: the palette in the launcher, the index,
  // and `?state=` above. Drop app/states.jsx + app/states-ui.jsx and the states
  // half of the launcher, the index and the address reading all vanish together,
  // leaving the product core clean.
  const { byId: STATE_BY_ID, groups: STATE_GROUPS, reset } = (window.buildStates
    ? window.buildStates({
        spaces, STATE_KEY,
        setSpaces, setUser, setCurrentId, setTab, setRoute, setLoadingFeed, setHoldLoading,
        setOtc, setPostAuthTo, setManageIntent,
        enterSpace, openCreateSpace,
        setSortOrder, setSortMenuOpen, setDividerAt, setLensWho, setDensity,
      })
    : { byId: {}, groups: [], reset: null });
  const goState = (id) => { const s = STATE_BY_ID[id]; if (s) s.go(); };

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

  // ---- shared shell wrapper ----
  // App posture swaps ONLY the persistent chrome (AppShellNative): the children
  // handed in are the exact same shared surfaces the web shell renders. Falls
  // back to the web shell if app/app-shell.jsx is absent (droppable module).
  const Shell = (isApp && window.AppShellNative) ? window.AppShellNative : AppShell;
  const inShell = (content, opts = {}) => (
    <Shell
      isMobile={isMobile} user={user} showMembers={opts.showMembers !== false}
      spaces={listSpaces} currentId={currentId} space={space}
      onSelectSpace={enterSpace} onCreateSpace={gateActive ? onGate : openCreateSpace}
      onMembers={gateActive ? onGate : () => setRoute('members')}
      onManageAccount={openAccount}
      onHome={goHome} isHome={!!opts.home}
      refreshingId={refreshing} settledId={settledId} onRefreshSpace={refreshSpace}
      onAccountGate={gateActive ? onGate : null}
      onSignOut={signOut}
      onAdd={() => setAddOpen(true)} canAdd={!!opts.canAdd}
      subView={opts.subView || null}
    >{content}</Shell>
  );

  // Candidate-build API — the one bridge a cand-* overlay reads app state and
  // mutations through. Assembled per render; bind() hands it over.
  const candApi = Cand ? { user, spaces, space, currentId, tab, isMobile, isApp,
    route, setRoute, setSpaces, returnToSpace, openLink,
    requestDelete: (item) => setConfirm({ kind: 'delete', item }),
    requestMarkRead: (item) => setReacting(item),
    isChampion, startCircle: gateActive ? onGate : openCreateSpace } : null;
  if (Cand && Cand.bind) Cand.bind(candApi);

  // ---- render route ----
  // App posture + mobile payments OFF: every path that would reach the funding /
  // checkout / provider surfaces lands on the finish-on-web handoff instead. One
  // render-level guard covers ALL entry points (real flows AND staged states),
  // so no checkout, price-entry, or provider surface is reachable in-app while
  // off. Web mode ignores mobilePayments entirely (payments always work on web).
  let screen = null;
  const PAYMENT_ROUTES = ['funding', 'checkout', 'manage-interstitial', 'manage-funding'];
  if (isApp && !mobilePayments && PAYMENT_ROUTES.includes(route)) {
    const ctx = (route === 'manage-interstitial' || route === 'manage-funding')
      ? 'manage' : (fundFlow.mode === 'refund' ? 'refund' : 'new');
    const nm = ctx === 'new' ? fundFlow.name : (space ? space.name : fundFlow.name);
    screen = window.WebHandoff
      ? <WebHandoff context={ctx} spaceName={nm} onExit={exitToApp} />
      : null;
  } else if (route === 'signin') {
    screen = <SignIn onSubmit={({ email }) => startSignin(email)} onGoogle={() => { setPostAuthTo('space'); setRoute('google-return'); }} onForgot={() => setRoute('recovery')} onGoSignup={() => { setSpaces([]); setRoute('signup'); }} />;
  } else if (route === 'signup') {
    screen = <SignUp onSubmit={startSignup} onGoogle={() => { setPostAuthTo('post-signup'); setRoute('google-return'); }} onGoSignin={() => setRoute('signin')} />;
  } else if (route === 'otc') {
    screen = <OtcEntry email={pendingEmail} context={otc.context} initialError={otc.error}
      onVerify={finishOtc} onBack={() => setRoute(otc.context === 'signup' ? 'signup' : 'signin')} />;
  } else if (route === 'google-return') {
    screen = <GoogleReturn onDone={holdLoading ? () => {} : () => { if (postAuthTo === 'post-signup') { setSpaces([]); setCurrentId(null); goHome(); } else if (spaces.length === 0) goHome(); else enterSpace(currentId || 'sp-backend'); }} />;
  } else if (route === 'recovery') {
    screen = <Recovery onDone={() => { if (spaces.length === 0) goHome(); else enterSpace(currentId || 'sp-backend'); }} onBackToSignin={() => setRoute('signin')} />;
  } else if (route === 'funding') {
    screen = <FundingPage user={user} spaceName={fundFlow.name} mode={fundFlow.mode}
      onFund={() => setRoute('checkout')}
      onBack={() => setRoute('create-space')}
      onCancel={fundFlow.mode === 'refund' ? returnToSpace : exitToApp} />;
  } else if (route === 'checkout') {
    screen = <Checkout user={user} spaceName={fundFlow.name} refund={fundFlow.mode === 'refund'}
      onSuccess={onCheckoutSuccess} onCancel={() => setRoute('funding')} />;
  } else if (route === 'setting-up') {
    screen = <SettingUp spaceName={fundFlow.name} onDone={holdLoading ? () => {} : finishProvisioning} />;
  } else if (route === 'manage-interstitial') {
    screen = <ProviderInterstitial label="Opening this circle\u2019s billing\u2026" onDone={holdLoading ? () => {} : () => setRoute('manage-funding')} />;
  } else if (route === 'manage-funding') {
    screen = <ManageFunding user={user} spaceName={space ? space.name : ''} intent={manageIntent}
      onReturn={() => setRoute('members')} onCancelSub={cancelFunding} />;
  } else if (route === 'create-space') {
    screen = <CreateSpace onCreate={beginCreateFund} initialName={fundFlow.name} canCancel={spaces.length > 0} onCancel={exitToApp} />;
  } else if (route === 'invalid-invite') {
    screen = <InvalidInvite onHome={() => goSpace('sp-backend')} />;
  } else if (route === 'space-full') {
    screen = <SpaceFull onHome={() => goSpace('sp-backend')} />;
  } else if (Cand && Cand.matchRoute && Cand.matchRoute(route)) {
    // Candidate-build route (e.g. a card's own surface). The overlay hands back
    // the body and the shell opts; the chrome is still inShell's.
    const r = Cand.renderRoute(route, candApi);
    screen = inShell(r.body, r.opts || {});
  } else if (route === 'members') {
    screen = inShell(<MembersSurface space={space} isChampion={isChampion(space)} championName={space ? space.champion : ''}
      onInvite={inviteEmail} onManageFunding={openManageFunding} onCancelFunding={() => setConfirm({ kind: 'cancel-funding' })}
      onResumeFunding={resumeFunding}
      onRename={renameSpace} onRemoveMember={removeMember} onLeave={() => setConfirm({ kind: 'leave', spaceId: currentId })}
      onStartCircle={gateActive ? onGate : openCreateSpace} />,
      { subView: { title: 'Settings', onBack: returnToSpace } });
  } else if (route === 'account') {
    screen = inShell(<AccountSettings user={user} onChangeEmail={changeEmail} onDeleteAccount={() => setConfirm({ kind: 'delete-account' })} />,
      { subView: { title: 'Account', onBack: () => (accountFrom === 'home' ? goHome() : returnToSpace()) } });
  } else if (route === 'home' || (!space && listSpaces.length === 0)) {
    // Home — the account level. With circles, the circles list (app/home.jsx, a
    // droppable body); with none, the same screen's empty state.
    const CirclesHomeBody = window.CirclesHome;
    screen = inShell(
      (listSpaces.length > 0 && CirclesHomeBody)
        ? <CirclesHomeBody spaces={listSpaces} onSelect={enterSpace} onCreate={gateActive ? onGate : openCreateSpace} />
        : <NoSpaceHome onCreate={gateActive ? onGate : openCreateSpace} />,
      { showMembers: false, home: true });
  } else {
    // space view — dormant gate, else the feed (the heart)
    if (space && !space.funded) {
      screen = inShell(
        <DormantSpace space={space} dormancy={space.dormancy || 'terminal'}
          onFund={beginRefund} onLeave={() => setConfirm({ kind: 'leave', spaceId: space.id })} />,
        { showMembers: false }
      );
    } else {
      const stored = tab === 'active' ? activeItems : readItems;
      const pending = (space && space.pending) || [];
      // ---- Feed sort (BIZ-136 candidate build) ----------------------------
      // A deletable aid in the app's own idiom: no feed-lens.jsx ⇒ no control,
      // no reorder, and the feed behaves exactly as it did. That is what keeps
      // the homepage demo, which shares this module, untouched by the candidate.
      const Lens = window.FeedLens || null;
      const sortKey = currentId + ':' + tab;
      const order = sortOrder[sortKey] || (window.CIRC_SORT_DEFAULT || 'newest');
      // The contributor lens is held per CIRCLE, not per circle-and-tab as the
      // order is. "What did Sam add" is a question about a person, not about a
      // tab, so hopping to Read to see whether you already read Sam's link
      // keeps the lens. The asymmetry is deliberate; the chip stays on screen
      // across the switch, so the state is never hidden.
      const who = (Lens ? lensWho[currentId] : null) || null;
      const sorted = (Lens && window.circSortItems) ? window.circSortItems(stored, order) : stored;
      const visible = Lens ? window.circFilterItems(sorted, who) : sorted;
      // Offered from the whole circle, so the set does not reshuffle by tab.
      const contributors = Lens ? window.circContributors(space) : [];
      const pendingVisible = Lens ? window.circFilterItems(pending, who) : pending;
      // The control is absent below two items — a one-item list reads the same
      // under either order, so the control could do nothing. Same instinct as
      // the waterline's own "both sides or nothing".
      //
      // Absent while the feed is loading, for the same reason: the member is
      // looking at the spinner, and a control offering to reorder a list that
      // is not on screen yet is chrome acting on nothing.
      // The control is present from two items up, OR whenever a lens is already
      // applied — otherwise narrowing to one link removes the only way back.
      const showLens = !!Lens && !loadingFeed
        && (stored.length >= (window.CIRC_SORT_MIN_ITEMS || 2) || window.circLensActive(order, who));
      const setOrder = (next) => {
        setSortOrder((prev) => ({ ...prev, [sortKey]: next }));
        // The gesture is acknowledged, as every gesture in this app is. The
        // waterline's suppression is NOT announced — a state never is.
        announceOnce('Sorted ' + (window.circSortLabel ? window.circSortLabel(next).toLowerCase() : next));
      };
      const setWho = (next) => {
        setLensWho((prev) => ({ ...prev, [currentId]: next }));
        announceOnce(next
          ? 'Showing links added by ' + window.circContributorLabel(next)
          : 'Showing links from everyone');
      };
      // Density (BIZ-136 run 3): the gesture is acknowledged like every other
      // lens pick, but it never touches sortOrder/lensWho — no chip, no active
      // trigger. It hides no content, so it has nothing to disclose.
      const setDensityView = (next) => {
        setDensity(next);
        announceOnce(next === 'compact' ? 'Compact view' : 'Comfortable view');
      };
      const lensControl = showLens
        ? <Lens order={order} who={who} contributors={contributors}
            onOrder={setOrder} onWho={setWho}
            density={density} onDensity={setDensityView}
            isMobile={isMobile}
            open={sortMenuOpen} onOpenChange={setSortMenuOpen} />
        : null;
      // The waterline, Active only — Read is a shelf, not a timeline. Drawn from
      // the visit's own frozen mark, never from the stored one.
      //
      // NOT DRAWN under oldest-first. circDividerIndex finds the first item
      // at-or-below the mark, which only locates the line correctly in a
      // newest-first list; and "Earlier" names the older pile BENEATH the line,
      // which under oldest-first sits above it. Recomputing the index would fix
      // the position and leave the word lying. Suppression is the existing
      // grammar, not a new one — ui.md Decision-30 already draws nothing for an
      // empty, single-item, all-new or nothing-new feed and calls the absence
      // "the calm answer". Newness is not lost with it: the arrival glow below
      // keys on the item's own timestamp, not its position, so fresh cards
      // still glow at the foot of an oldest-first feed.
      const divIdx = (tab === 'active' && order === 'newest')
        ? window.circDividerIndex(visible, dividerAt) : -1;
      const feed = loadingFeed ? (
        // Loading: the spinner is the whole view, centred in the content region
        // (fills main, which flex:1-stretches below the top bar + tabs).
        <main style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <FeedLoading />
        </main>
      ) : (
        <main style={{ flex: 1, width: '100%' }}>
          <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: isMobile ? '16px 16px 112px' : '28px 24px 120px', '--circ-feed-pad-top': isMobile ? '16px' : '28px', width: '100%', display: 'flex', flexDirection: 'column', gap: density === 'compact' ? 10 : 16 }}>
            {/* The discourse overlay's watching-digest summarises the whole
                circle. Under a lens it contradicts the screen it sits on — "4
                conversations you are watching" directly above "Nothing here
                from Dev K." reads as the filter being broken. Hidden while a
                lens is applied. This touches that overlay's surface only by
                withholding it here, at the point the two features meet; nothing
                about the digest itself is changed. */}
            {Cand && Cand.FeedLead && !(Lens && window.circLensActive(order, who))
              && <Cand.FeedLead api={candApi} tab={tab} />}
            {/* The pill announces arrivals for the list you are LOOKING at. Under
                a contributor lens, an arrival from somebody else is not one:
                tapping the pill would land it straight into the hidden pile and
                the feed would not move, which is the one thing the pill exists
                to promise it will do. So it counts only arrivals the lens keeps.
                Unmatched arrivals are not lost — they land whole the moment the
                lens clears. */}
            {tab === 'active' && pendingVisible.length > 0 && <NewPill onClick={revealPending} />}
            {visible.length === 0 && who
              ? <window.LensNoMatch who={who} tab={tab} onClear={() => setWho(null)} />
              : visible.length === 0 ? <EmptyState tab={tab} onStartCircle={gateActive ? onGate : openCreateSpace} />
              : visible.map((item, i) => {
                const card = <FeedCard item={item} tab={tab} user={user} showTime density={density}
                  onOpen={openLink}
                  onMarkRead={(it) => setReacting(it)}
                  onDelete={(it) => setConfirm({ kind: 'delete', item: it })} />;
                const row = (Cand && Cand.CardRow)
                  ? <Cand.CardRow item={item} tab={tab} api={candApi}>{card}</Cand.CardRow>
                  : card;
                // Above the waterline → the glow, played when the card comes into
                // view. Accepted from the pill → the travel, once.
                const fresh = tab === 'active' && dividerAt != null && !!item.at && item.at > dividerAt;
                return (
                  <React.Fragment key={item.id}>
                    {i === divIdx && <FeedDivider />}
                    <CircGlow glow={fresh} rise={arrived.includes(item.id)}>{row}</CircGlow>
                  </React.Fragment>
                );
              })}
          </div>
        </main>
      );
      screen = inShell(
        <>
          <Tabs active={tab} onChange={setTab} right={lensControl} />
          {/* What is applied, and the way out of it. Nothing at all in the
              default state — the folded control means the chips are now the
              only place the applied lens is legible without opening it. */}
          {Lens && !loadingFeed && <window.LensChips order={order} who={who} onOrder={setOrder} onWho={setWho} isMobile={isMobile} />}
          {feed}
          {!loadingFeed && !isApp && <FAB onClick={() => setAddOpen(true)} expanded={addOpen} confirm={addConfirm} isMobile={isMobile} />}
          <AddReveal open={addOpen} isMobile={isMobile} onClose={() => setAddOpen(false)} onAdd={addItem} />
        </>,
        { canAdd: true }
      );
    }
  }

  // dialogs live above whichever screen
  // `item` and `space` are carried because the delete confirm offers two reaches
  // and has to know which link, in which circle, it is about (LM-666).
  const overlay = (confirm && <ConfirmDialog kind={confirm.kind} item={confirm.item} space={space} onDeleteForMe={deleteItemForMe} onConfirm={onConfirm} onCancel={() => setConfirm(null)} />)
    || (reverify && <ReverifyDialog provider={user.ssoProvider} onPass={() => { setReverify(false); deleteAccount(); }} onCancel={() => setReverify(false)} />);  // The Swell reaction moment, fired by Mark-as-read. Commits the read on Done/Skip.
  const reactOverlay = reacting && (
    <SwellReactionFlow
      item={reacting}
      swellOpts={{ centerDot: true, breath: true, snap: true }}
      onMarkRead={(it, reaction) => markRead(it, reaction)}
      onClose={() => setReacting(null)} />
  );
  const gateOverlayEl = GateOverlay ? <GateOverlay open={gateOpen} isMobile={isMobile} onClose={() => setGateOpen(false)} /> : null;
  // The one polite live region for the whole app: it sits in the page empty from
  // first render, because a region inserted together with its text announces
  // nothing. A gesture is acknowledged ("Refreshed"); the pill announces its own
  // arrival; a state is never announced.
  const liveRegion = <div className="circ-vh" role="status" aria-live="polite">{announce}</div>;
  const appTree = <>{screen}{overlay}{reactOverlay}{gateOverlayEl}{liveRegion}</>;

  return (
    <>
      {showIndex ? (
        <StatesIndexView reason={landing} groups={STATE_GROUPS}
          onGo={(id) => { goState(id); setLanding(null); }}
          onDismiss={() => setLanding(null)} />
      ) : forcedMobile ? (
        <div className="circ-stage">
          <div className="circ-phone"><div className="circ-phone-clip"><div className="circ-phone-screen">{appTree}</div></div></div>
        </div>
      ) : appTree}

      {/* Launcher — prototype aid; leaving app/config.jsx out removes it, no edit here */}
      {ConfigLauncher && tw.configBtn !== false && <ConfigLauncher
        statesGroups={STATE_GROUPS} onGoState={goState}
        onOpenStatesIndex={() => setLanding({ kind: 'index', name: 'index' })}
        onReset={reset}
        gateOn={gateOverride} onGateChange={setGateOverride}
        platform={platform} onPlatformChange={setPlatform}
        mobilePayments={mobilePayments} onMobilePaymentsChange={setMobilePayments}
        showTest={showTest} onShowTestChange={setShowTest}
        live={live} onLiveChange={setLiveOpt} liveActions={liveActions}
        layout={tw.layout} onLayoutChange={(v) => setTweak('layout', v)} />}

      {/* Tweaks panel — deleting app/circ-tweaks.jsx removes it, no edit here */}
      {CircTweaks && <CircTweaks tw={tw} setTweak={setTweak} />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<CircApp />);
