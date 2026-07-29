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
// queued per circle.)
const STATE_KEY = 'circ_state_v10';
const SAVED = (() => { try { return JSON.parse(localStorage.getItem(STATE_KEY) || 'null'); } catch (e) { return null; } })();

// ---- Tweak defaults, baked in ----------------------------------------------
// So the app renders at its intended look even when the Tweaks files
// (circ-tweaks.jsx / tweaks-panel.jsx) are absent — the delete-only homepage-demo
// derivation drops them. When those files are present they take over.
const CIRC_TWEAK_FALLBACK = { accent: '#047857', layout: 'auto', pulseDepth: 7.5, spinSpeed: 1.4 };
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
  const [refreshing, setRefreshing] = useState(null);   // circle id of a running manual refresh
  const [settledId, setSettledId] = useState(null);     // circle whose mark is coming to rest
  const [arrived, setArrived] = useState([]);           // item ids wearing the arrival halo
  // Timers and handlers read state through refs: a setSpaces updater cannot hand
  // values back to the handler that queued it.
  const spacesRef = useRef(spaces); spacesRef.current = spaces;
  const currentRef = useRef(currentId); currentRef.current = currentId;

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
    try { localStorage.setItem(STATE_KEY, JSON.stringify({ route, user, spaces, currentId, tab })); } catch (e) {}
  }, [route, user, spaces, currentId, tab]);

  const isTestSpace = (s) => /^TEST\b/i.test(s.name || '');
  const listSpaces = useMemo(() => showTest ? spaces : spaces.filter(s => !isTestSpace(s)), [spaces, showTest]);
  const space = useMemo(() => spaces.find(s => s.id === currentId) || null, [spaces, currentId]);  const activeItems = space ? space.items.filter(i => !i.read) : [];
  const readItems = space ? space.items.filter(i => i.read) : [];
  const isChampion = (s) => !!s && s.champion === 'You';

  // Release a review-only loading hold as soon as we're off an interstitial.
  const LOADING_ROUTES = ['google-return', 'manage-interstitial', 'setting-up'];
  useEffect(() => {
    if (holdLoading && !LOADING_ROUTES.includes(route)) setHoldLoading(false);
  }, [route, holdLoading]);

  // feed-load demo: quiet indicator when entering a funded space
  const enterSpace = useCallback((id) => {
    const target = id || currentId;
    const leaving = currentId && target !== currentId ? currentId : null;
    if (id) setCurrentId(id);
    setRoute('space');
    setArrived([]); setSettledId(null);
    // Leaving a circle re-marks it: anything still waiting behind the New pill is
    // folded into the feed, and the mark is set just BEFORE the oldest of them, so
    // they read as new on the next visit rather than silently ageing into the pile.
    if (leaving) setSpaces(prev => prev.map(s => {
      if (s.id !== leaving) return s;
      const p = s.pending || [];
      return { ...s, items: [...p, ...s.items], pending: [], unseen: p.length > 0,
        lastSeenAt: p.length ? Math.min(...p.map(i => i.at)) - 1 : Date.now() };
    }));
    const sp = spaces.find(s => s.id === target);
    if (sp && sp.funded) { setLoadingFeed(true); setTimeout(() => setLoadingFeed(false), 700); }
    else setLoadingFeed(false);
  }, [spaces, currentId]);

  // Opening a circle IS the accept: its dot clears once the feed is on screen.
  // An effect, not a branch inside enterSpace, so every way in (mount, a Config
  // scenario, home) clears it identically. lastSeenAt is deliberately untouched —
  // the Earlier rule must not move while you are reading against it.
  useEffect(() => {
    if (route !== 'space' || loadingFeed || !currentId) return;
    const sp = spacesRef.current.find(s => s.id === currentId);
    if (sp && sp.unseen) setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, unseen: false } : s));
  }, [route, loadingFeed, currentId, spaces]);

  // ---- Arrivals -----------------------------------------------------------
  const peerName = (id) => {
    const sp = spacesRef.current.find(s => s.id === id);
    const peers = ((sp && sp.members) || []).filter(m => m.name !== 'You');
    return peers.length ? peers[Math.floor(Math.random() * peers.length)].name : 'Sam R.';
  };
  // A link lands. In the circle you are IN it waits behind the New pill — the feed
  // never shifts underfoot. Anywhere else it lands in the feed and lights the dot.
  const landItem = (id, who) => {
    const item = window.circNextDrop(who || peerName(id));
    setSpaces(prev => prev.map(s => s.id !== id ? s
      : (id === currentRef.current
          ? { ...s, pending: [item, ...(s.pending || [])] }
          : { ...s, items: [item, ...s.items], unseen: true })));
  };
  // Accept: the click is what moves the feed. What lands wears the halo briefly.
  const revealPending = () => {
    const id = currentRef.current;
    const sp = spacesRef.current.find(s => s.id === id);
    if (!sp || !(sp.pending || []).length) return;
    const ids = sp.pending.map(i => i.id);
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, items: [...s.pending, ...s.items], pending: [] } : s));
    setArrived(a => [...a, ...ids]);
    setTimeout(() => setArrived(a => a.filter(x => !ids.includes(x))), 2400);
  };
  // Manual refresh = clicking the circle you are ALREADY in. There is no refresh
  // button. Nothing blanks: the busy state sits on that circle's own signal slot,
  // and whatever it finds surfaces through the same New pill the background check
  // uses. Finding nothing answers with the mark settling — never a tick.
  const refreshSpace = (id) => {
    if (refreshing || loadingFeed) return;
    setRefreshing(id); setSettledId(null);
    setTimeout(() => {
      setRefreshing(null);
      const sp = spacesRef.current.find(s => s.id === id);
      if (sp && (sp.queued || []).length) {
        setSpaces(prev => prev.map(s => s.id === id
          ? { ...s, pending: [...s.queued, ...(s.pending || [])], queued: [] } : s));
      } else {
        setSettledId(id);
        setTimeout(() => setSettledId(c => (c === id ? null : c)), 1500);
      }
    }, 900);
  };

  // Simulated background activity (Config aid). Detection is silent — the dot and
  // the pill are its only visible consequences.
  useEffect(() => {
    if (live.activity === 'off') return;
    const ms = live.activity === 'fast' ? 7000 : 20000;
    const t = setInterval(() => {
      const open = spacesRef.current.filter(s => s.funded && !isTestSpace(s));
      if (open.length) landItem(open[Math.floor(Math.random() * open.length)].id);
    }, ms);
    return () => clearInterval(t);
  }, [live.activity]);

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
        ? { ...i, read: true, reactions: reaction ? [...(i.reactions || []), reaction] : (i.reactions || []) }
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
  const onConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === 'delete') deleteItem(confirm.item);
    setConfirm(null);
  };

  // ---- create = fund (name-first) ----
  const beginCreateFund = (name) => { setFundFlow({ mode: 'new', name, spaceId: null }); setRoute('funding'); };
  const onCheckoutSuccess = () => {
    if (fundFlow.mode === 'refund') {
      setSpaces(prev => prev.map(s => s.id === fundFlow.spaceId
        ? { ...s, funded: true, dormancy: null, champion: 'You', championEmail: user.email } : s));
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

  // ---- re-fund a dormant space (champion) ----
  const beginRefund = () => { if (!space) return; setFundFlow({ mode: 'refund', name: space.name, spaceId: space.id }); setRoute('funding'); };

  // ---- manage funding (champion, per-space provider deep-link) ----
  const openManageFunding = (intent) => { setManageIntent(intent || 'manage'); setRoute('manage-interstitial'); };
  const cancelFunding = () => {
    setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, funded: false, dormancy: 'terminal' } : s));
    enterSpace(currentId);
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
    here: () => currentId && landItem(currentId),
    elsewhere: () => {
      const other = spacesRef.current.find(s => s.funded && !isTestSpace(s) && s.id !== currentId);
      if (other) landItem(other.id);
    },
  };

  // ---- config launcher setups ----
  // Data + staging actions live in app/config.jsx (a deletable prototype aid).
  // buildScenarios closes over the setters it needs; drop that file and the
  // launcher + these setups vanish together, leaving the product core clean.
  const { groups: SCENARIO_GROUPS, reset } = (window.buildScenarios
    ? window.buildScenarios({
        spaces, STATE_KEY,
        setSpaces, setUser, setCurrentId, setTab, setRoute, setLoadingFeed, setHoldLoading,
        setOtc, setPostAuthTo, setManageIntent,
        enterSpace, openCreateSpace,
      })
    : { groups: [], reset: () => {} });

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

  // ---- render route ----
  // App posture + mobile payments OFF: every path that would reach the funding /
  // checkout / provider surfaces lands on the finish-on-web handoff instead. One
  // render-level guard covers ALL entry points (real flows AND Config scenarios),
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
  } else if (route === 'members') {
    screen = inShell(<MembersSurface space={space} isChampion={isChampion(space)} championName={space ? space.champion : ''}
      onInvite={inviteEmail} onManageFunding={openManageFunding} onRename={renameSpace} onRemoveMember={removeMember}
      onStartCircle={gateActive ? onGate : openCreateSpace} />,
      { subView: { title: 'Settings', onBack: returnToSpace } });
  } else if (route === 'account') {
    screen = inShell(<AccountSettings user={user} onChangeEmail={changeEmail} />,
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
        <DormantSpace space={space} isChampion={isChampion(space)} championName={space.champion}
          dormancy={space.dormancy || 'terminal'} onRefund={beginRefund} />,
        { showMembers: false }
      );
    } else {
      const visible = tab === 'active' ? activeItems : readItems;
      const pending = (space && space.pending) || [];
      // The frozen last-seen rule, Active only — Read is a shelf, not a timeline.
      const divIdx = tab === 'active'
        ? window.circDividerIndex(visible, space.lastSeenAt) : -1;
      const feed = loadingFeed ? (
        // Loading: the spinner is the whole view, centred in the content region
        // (fills main, which flex:1-stretches below the top bar + tabs).
        <main style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <FeedLoading />
        </main>
      ) : (
        <main style={{ flex: 1, width: '100%' }}>
          <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: isMobile ? '16px 16px 112px' : '28px 24px 120px', width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tab === 'active' && pending.length > 0 && <NewPill onClick={revealPending} />}
            {visible.length === 0 ? <EmptyState tab={tab} onStartCircle={gateActive ? onGate : openCreateSpace} />
              : visible.map((item, i) => {
                const card = <FeedCard item={item} tab={tab} user={user} showTime
                  onOpen={openLink}
                  onMarkRead={(it) => setReacting(it)}
                  onDelete={(it) => setConfirm({ kind: 'delete', item: it })} />;
                return (
                  <React.Fragment key={item.id}>
                    {i === 0 && divIdx > 0 && <FeedDivider />}
                    {i === divIdx && <FeedSeam />}
                    {arrived.includes(item.id) ? <div className="circ-arrive">{card}</div> : card}
                  </React.Fragment>
                );
              })}
          </div>
        </main>
      );
      screen = inShell(
        <>
          <Tabs active={tab} onChange={setTab} />
          {feed}
          {!loadingFeed && !isApp && <FAB onClick={() => setAddOpen(true)} expanded={addOpen} confirm={addConfirm} isMobile={isMobile} />}
          <AddReveal open={addOpen} isMobile={isMobile} onClose={() => setAddOpen(false)} onAdd={addItem} />
        </>,
        { canAdd: true }
      );
    }
  }

  // dialogs live above whichever screen
  const overlay = confirm && <ConfirmDialog kind={confirm.kind} onConfirm={onConfirm} onCancel={() => setConfirm(null)} />;  // The Swell reaction moment, fired by Mark-as-read. Commits the read on Done/Skip.
  const reactOverlay = reacting && (
    <SwellReactionFlow
      item={reacting}
      swellOpts={{ centerDot: true, breath: true, snap: true }}
      onMarkRead={(it, reaction) => markRead(it, reaction)}
      onClose={() => setReacting(null)} />
  );
  const gateOverlayEl = GateOverlay ? <GateOverlay open={gateOpen} isMobile={isMobile} onClose={() => setGateOpen(false)} /> : null;
  const appTree = <>{screen}{overlay}{reactOverlay}{gateOverlayEl}</>;

  return (
    <>
      {forcedMobile ? (
        <div className="circ-stage">
          <div className="circ-phone"><div className="circ-phone-clip"><div className="circ-phone-screen">{appTree}</div></div></div>
        </div>
      ) : appTree}

      {/* Config launcher — prototype aid; deleting app/config.jsx removes it, no edit here */}
      {ConfigLauncher && tw.configBtn !== false && <ConfigLauncher groups={SCENARIO_GROUPS} onReset={reset}
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
