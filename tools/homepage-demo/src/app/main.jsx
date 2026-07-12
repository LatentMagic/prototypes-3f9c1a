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
// two-big-huddles collision case.)
const STATE_KEY = 'circ_state_v4';
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
  const forcedMobile = tw.layout === 'mobile';
  const isMobile = tw.layout === 'mobile' ? true : tw.layout === 'desktop' ? false : winW < 1024;

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
  const [confirm, setConfirm] = useState(null);
  // The Swell: mark-as-read opens the reaction flow (no confirm modal). Holds
  // the item being reacted to, or null.
  const [reacting, setReacting] = useState(null);
  const [otc, setOtc] = useState({ context: 'device', error: null });
  const [pendingEmail, setPendingEmail] = useState('you@example.com');
  const [postAuthTo, setPostAuthTo] = useState('space');
  // (Config launcher state + drag now live in app/config.jsx — a deletable aid.)
  // funding flow: { mode: 'new' | 'refund', name, spaceId }
  const [fundFlow, setFundFlow] = useState({ mode: 'new', name: '', spaceId: null });
  const [manageIntent, setManageIntent] = useState('manage');

  // open Create-a-space fresh (clears any carried name)
  const openCreateSpace = () => { setFundFlow({ mode: 'new', name: '', spaceId: null }); setRoute('create-space'); };

  // the authenticated home for a user who holds no membership
  const goHome = () => { setCurrentId(null); setRoute('home'); };

  // ✕ exit / return destination: no-space home if no membership, else default space
  const exitToApp = () => { if (spaces.length === 0) goHome(); else enterSpace(currentId || (spaces[0] && spaces[0].id)); };

  // persist
  useEffect(() => {
    try { localStorage.setItem(STATE_KEY, JSON.stringify({ route, user, spaces, currentId, tab })); } catch (e) {}
  }, [route, user, spaces, currentId, tab]);

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
    if (id) setCurrentId(id);
    setRoute('space');
    const sp = spaces.find(s => s.id === target);
    if (sp && sp.funded) { setLoadingFeed(true); setTimeout(() => setLoadingFeed(false), 700); }
    else setLoadingFeed(false);
  }, [spaces, currentId]);

  // ---- content mutations (peer powers) ----
  const addItem = (item) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, items: [item, ...s.items] } : s));
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
  const inShell = (content, opts = {}) => (
    <AppShell
      isMobile={isMobile} user={user} showMembers={opts.showMembers !== false}
      spaces={spaces} currentId={currentId} space={space}
      onSelectSpace={enterSpace} onCreateSpace={gateActive ? onGate : openCreateSpace}
      onMembers={gateActive ? onGate : () => setRoute('members')}
      onManageAccount={() => setRoute('account')}
      onAccountGate={gateActive ? onGate : null}
      onSignOut={signOut}
      subView={opts.subView || null}
    >{content}</AppShell>
  );

  // ---- render route ----
  let screen = null;
  if (route === 'signin') {
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
      onBack={fundFlow.mode === 'new' ? () => setRoute('create-space') : undefined}
      onCancel={exitToApp} />;
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
      onInvite={inviteEmail} onManageFunding={openManageFunding} onRename={renameSpace} onRemoveMember={removeMember} />,
      { subView: { title: 'Settings', onBack: () => enterSpace(currentId) } });
  } else if (route === 'account') {
    screen = inShell(<AccountSettings user={user} onChangeEmail={changeEmail} />,
      { subView: { title: 'Account', onBack: () => enterSpace(currentId) } });
  } else if (route === 'home' || (!space && spaces.length === 0)) {
    // No-space home — authenticated, inside the shell, no space name in header
    screen = inShell(<NoSpaceHome onCreate={openCreateSpace} />, { showMembers: false });
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
      const feed = loadingFeed ? (
        // Loading: the spinner is the whole view, centred in the content region
        // (fills main, which flex:1-stretches below the top bar + tabs).
        <main style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <FeedLoading />
        </main>
      ) : (
        <main style={{ flex: 1, width: '100%' }}>
          <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: isMobile ? '16px 16px 112px' : '28px 24px 120px', width: '100%' }}>
            {visible.length === 0 ? <EmptyState tab={tab} />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {visible.map(item => (
                    <FeedCard key={item.id} item={item} tab={tab}
                      onOpen={openLink}
                      onMarkRead={(it) => setReacting(it)}
                      onDelete={(it) => setConfirm({ kind: 'delete', item: it })} />
                  ))}
                </div>
              )}
          </div>
        </main>
      );
      screen = inShell(
        <>
          <Tabs active={tab} onChange={setTab} />
          {feed}
          {tab === 'active' && !loadingFeed && <FAB onClick={() => setAddOpen(true)} expanded={addOpen} isMobile={isMobile} />}
          <AddReveal open={addOpen} isMobile={isMobile} onClose={() => setAddOpen(false)} onAdd={addItem} />
        </>
      );
    }
  }

  // dialogs live above whichever screen
  const overlay = confirm && <ConfirmDialog kind={confirm.kind} onConfirm={onConfirm} onCancel={() => setConfirm(null)} />;
  // The Swell reaction moment, fired by Mark-as-read. Commits the read on Done/Skip.
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
          <div className="circ-phone"><div className="circ-phone-screen">{appTree}</div></div>
        </div>
      ) : appTree}

      {/* Config launcher — prototype aid; deleting app/config.jsx removes it, no edit here */}
      {ConfigLauncher && <ConfigLauncher groups={SCENARIO_GROUPS} onReset={reset}
        gateOn={gateOverride} onGateChange={setGateOverride}
        layout={tw.layout} onLayoutChange={(v) => setTweak('layout', v)} />}

      {/* Tweaks panel — deleting app/circ-tweaks.jsx removes it, no edit here */}
      {CircTweaks && <CircTweaks tw={tw} setTweak={setTweak} />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<CircApp />);
