// ============================================================================
// LatentPulse v0.2.3 — root state machine (per-space billing).
// The space is the billing unit: £9 / space / month, funded by one member —
// the CHAMPION. Everyone they invite joins free. Creating a space IS funding it.
// Access = the space is funded AND the viewer is a member. No front-door paywall.
// Pulse Modernist carried forward verbatim; Feed + Auth unchanged.
// ============================================================================
const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ---- Seed data — inhabited, role-staged, no Lorem Ipsum --------------------
const M = (name, email) => ({ name, email });
const IT = (url, attribution, read) => ({ id: 'seed-' + Math.random().toString(36).slice(2, 9), url, attribution, read: !!read });

function seedSpaces(userEmail) {
  return [
    {
      // You champion it → Invite + Manage funding + "Championed by You".
      id: 'sp-backend',
      name: 'Backend Pod',
      funded: true, dormancy: null, champion: 'You', championEmail: userEmail,
      members: [M('You', userEmail), M('Sam R.', 'sam.r@example.com'), M('Priya N.', 'priya.n@example.com'), M('Marcus T.', 'marcus.t@example.com')],
      items: [
        IT('https://newsletter.pragmaticengineer.com/p/scaling-on-call', 'Added by Marcus T.'),
        IT('https://blog.rust-lang.org/2026/01/async-internals', 'Added by Priya N.'),
        IT('https://martinfowler.com/articles/cd-pipeline.html', 'Added by Sam R.'),
        IT('https://arxiv.org/abs/2503.04918', 'Added by Priya N.'),
        IT('https://www.youtube.com/watch?v=Kx7Bvksk_qg', 'Added by Marcus T.'),
        IT('https://danluu.com/percentile-latency/', 'Added by Sam R.'),
        IT('https://sqlite.org/whentouse.html', 'Added by former member.'),
        IT('https://go.dev/blog/pipelines', 'Added by Marcus T.', true),
        IT('https://jvns.ca/blog/2026/02/dns-resolvers/', 'Added by Priya N.', true),
        IT('https://www.kernel.org/doc/html/latest/process/submitting-patches.html', 'Added by Sam R.', true),
        IT('https://martinfowler.com/bliki/CircuitBreaker.html', 'Added by former member.', true),
      ],
    },
    {
      // Championed by Joe M. — you're a plain member (non-champion view).
      id: 'sp-book',
      name: 'Tuesday Book Club',
      funded: true, dormancy: null, champion: 'Joe M.', championEmail: 'joe.m@example.com',
      members: [M('You', userEmail), M('Joe M.', 'joe.m@example.com'), M('Priya N.', 'priya.n@example.com'), M('Sam R.', 'sam.r@example.com')],
      items: [
        IT('https://www.newyorker.com/books/page-turner/the-quiet-novel-revival', 'Added by Joe M.'),
        IT('https://lithub.com/on-rereading-your-favorite-books/', 'Added by Priya N.'),
        IT('https://www.theparisreview.org/interviews/the-art-of-fiction', 'Added by Sam R.'),
        IT('https://www.gutenberg.org/files/2701/2701-h/2701-h.htm', 'Added by Joe M.', true),
      ],
    },
    {
      // Small two-person space — championed by Sam R. (non-champion view).
      id: 'sp-sam',
      name: 'Me & Sam',
      funded: true, dormancy: null, champion: 'Sam R.', championEmail: 'sam.r@example.com',
      members: [M('You', userEmail), M('Sam R.', 'sam.r@example.com')],
      items: [
        IT('https://www.gutenberg.org/files/1342/1342-h/1342-h.htm', 'Added by Sam R.'),
        IT('https://longreads.com/2026/01/the-long-walk-home/', 'Added by You.'),
      ],
    },
    {
      // Dormant — championed by Priya N. Default lands on the non-champion
      // take-over view; the launcher restages it for the champion views.
      id: 'sp-weekend',
      name: 'Weekend Reads',
      funded: false, dormancy: 'terminal', champion: 'Priya N.', championEmail: 'priya.n@example.com',
      members: [M('You', userEmail), M('Priya N.', 'priya.n@example.com'), M('Marcus T.', 'marcus.t@example.com'), M('Sam R.', 'sam.r@example.com')],
      items: [
        IT('https://www.theatlantic.com/magazine/archive/the-art-of-the-slow-weekend', 'Added by Priya N.'),
        IT('https://www.newyorker.com/culture/cultural-comment/the-case-for-doing-nothing', 'Added by Marcus T.'),
        IT('https://longreads.com/2026/02/notes-on-walking/', 'Added by Priya N.'),
        IT('https://aeon.co/essays/why-boredom-is-good-for-you', 'Added by Sam R.', true),
      ],
    },
  ];
}

const DEFAULT_USER = { firstName: 'Sam', lastName: 'Rivera', name: 'You', email: 'you@example.com' };
const displayName = (first, last) => `${first} ${(last || ' ').trim()[0] || ''}.`.trim();

// ---- Persistence -----------------------------------------------------------
const SAVED = (() => { try { return JSON.parse(localStorage.getItem('lp_alpha_v2_state') || 'null'); } catch (e) { return null; } })();

// ---- App -------------------------------------------------------------------
const LPApp = () => {
  const [tw, setTweak] = useTweaks(LP_TWEAK_DEFAULTS);
  useEffect(() => { document.documentElement.style.setProperty('--color-accent', tw.accent); }, [tw.accent]);

  // viewport / layout posture
  const [winW, setWinW] = useState(window.innerWidth);
  useEffect(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const forcedMobile = tw.layout === 'mobile';
  const isMobile = tw.layout === 'mobile' ? true : tw.layout === 'desktop' ? false : winW < 1024;

  // core state
  const [route, setRoute] = useState(SAVED?.route || 'space');
  const [user, setUser] = useState(SAVED?.user || DEFAULT_USER);
  const [spaces, setSpaces] = useState(SAVED?.spaces || seedSpaces(DEFAULT_USER.email));
  const [currentId, setCurrentId] = useState(SAVED?.currentId || 'sp-backend');
  const [tab, setTab] = useState(SAVED?.tab || 'active');

  // ephemeral
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [otc, setOtc] = useState({ context: 'device', error: null });
  const [pendingEmail, setPendingEmail] = useState('you@example.com');
  const [postAuthTo, setPostAuthTo] = useState('space');
  const [launcher, setLauncher] = useState(false);
  // draggable Scenarios launcher (prototype aid). null = default bottom-right.
  const [launchPos, setLaunchPos] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem('lp_launcher_pos') || 'null'); return v && typeof v.x === 'number' ? v : null; } catch (e) { return null; }
  });
  const launchDrag = useRef({ dragging: false, moved: false, dx: 0, dy: 0, last: null });
  const launchWrapRef = useRef(null);
  const onLaunchPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    const wrap = e.currentTarget.closest('.lp-launcher-wrap');
    const rect = wrap.getBoundingClientRect();
    const st = launchDrag.current;
    st.dragging = true; st.moved = false;
    st.dx = e.clientX - rect.left; st.dy = e.clientY - rect.top;
    st.w = rect.width; st.h = rect.height; st.ox = e.clientX; st.oy = e.clientY;
    const move = (ev) => {
      if (!st.dragging) return;
      if (Math.hypot(ev.clientX - st.ox, ev.clientY - st.oy) > 4) st.moved = true;
      const pad = 8;
      const x = Math.max(pad, Math.min(ev.clientX - st.dx, window.innerWidth - st.w - pad));
      const y = Math.max(pad, Math.min(ev.clientY - st.dy, window.innerHeight - st.h - pad));
      st.last = { x, y };
      setLaunchPos(st.last);
    };
    const up = () => {
      st.dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (st.moved && st.last) { try { localStorage.setItem('lp_launcher_pos', JSON.stringify(st.last)); } catch (e) {} }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  // keep a restored/old position inside the current viewport (mount + resize)
  useEffect(() => {
    const clamp = () => setLaunchPos(p => {
      if (!p) return p;
      const el = launchWrapRef.current;
      const w = el ? el.offsetWidth : 140, h = el ? el.offsetHeight : 40, pad = 8;
      const x = Math.max(pad, Math.min(p.x, window.innerWidth - w - pad));
      const y = Math.max(pad, Math.min(p.y, window.innerHeight - h - pad));
      return (x === p.x && y === p.y) ? p : { x, y };
    });
    clamp();
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, []);
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
    try { localStorage.setItem('lp_alpha_v2_state', JSON.stringify({ route, user, spaces, currentId, tab })); } catch (e) {}
  }, [route, user, spaces, currentId, tab]);

  const space = useMemo(() => spaces.find(s => s.id === currentId) || null, [spaces, currentId]);
  const activeItems = space ? space.items.filter(i => !i.read) : [];
  const readItems = space ? space.items.filter(i => i.read) : [];
  const isChampion = (s) => !!s && s.champion === 'You';

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
  const markRead = (item) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, items: s.items.map(i => i.id === item.id ? { ...i, read: true } : i) } : s));
  const deleteItem = (item) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, items: s.items.filter(i => i.id !== item.id) } : s));
  const inviteEmail = (email) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, members: [...s.members, M(email.split('@')[0].replace(/\b\w/g, c => c.toUpperCase()) + ' ', email)] } : s));

  const openLink = (item) => { window.open(item.url, '_blank', 'noopener'); };
  const onConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === 'mark-read') markRead(confirm.item);
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
      id: 'sp-' + Date.now(), name: fundFlow.name || 'New space',
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

  // ---- scenario launcher setups ----
  const reset = () => {
    try { localStorage.removeItem('lp_alpha_v2_state'); } catch (e) {}
    const s = seedSpaces(DEFAULT_USER.email);
    setSpaces(s); setUser(DEFAULT_USER); setCurrentId('sp-backend'); setTab('active'); enterSpace('sp-backend');
  };
  const goSpace = (id, toRoute) => {
    setUser(u => u && u.email ? u : DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setCurrentId(id); setTab('active');
    if (toRoute) setRoute(toRoute); else enterSpace(id);
  };

  // restage the dormant Weekend Reads to demo a given role/dormancy, then enter it
  const stageDormant = (cfg) => {
    setSpaces(prev => prev.map(s => s.id === 'sp-weekend'
      ? { ...s, funded: false, champion: cfg.champion, championEmail: cfg.championEmail, dormancy: cfg.dormancy } : s));
    setCurrentId('sp-weekend'); setRoute('space'); setLoadingFeed(false);
  };

  // Space with no items — lands on the empty-feed state directly.
  const goEmptyFeed = () => {
    setUser(DEFAULT_USER);
    const emptySpace = {
      id: 'sp-empty', name: 'Reading Room', funded: true, dormancy: null,
      champion: 'You', championEmail: DEFAULT_USER.email,
      members: [M('You', DEFAULT_USER.email), M('Sam R.', 'sam.r@example.com')],
      items: [],
    };
    setSpaces(prev => [emptySpace, ...prev.filter(s => s.id !== 'sp-empty')]);
    setCurrentId('sp-empty'); setTab('active'); setRoute('space'); setLoadingFeed(false);
  };

  // Space at the 10-member cap (champion view → "Space is full" on invite).
  const goFullSpaceManage = () => {
    setUser(DEFAULT_USER);
    const fullSpace = {
      id: 'sp-full', name: 'Design Guild', funded: true, dormancy: null, champion: 'You', championEmail: DEFAULT_USER.email,
      members: [
        M('You', DEFAULT_USER.email), M('Sam R.', 'sam.r@example.com'), M('Priya N.', 'priya.n@example.com'),
        M('Marcus T.', 'marcus.t@example.com'), M('Joe M.', 'joe.m@example.com'), M('Ada L.', 'ada.l@example.com'),
        M('Ravi P.', 'ravi.p@example.com'), M('Nina K.', 'nina.k@example.com'), M('Tom B.', 'tom.b@example.com'),
        M('Lena F.', 'lena.f@example.com'),
      ],
      items: [
        IT('https://www.nngroup.com/articles/ten-usability-heuristics/', 'Added by Ada L.'),
        IT('https://rauno.me/craft/interaction-design', 'Added by Nina K.'),
        IT('https://www.figma.com/blog/the-quiet-design-system/', 'Added by Sam R.'),
      ],
    };
    setSpaces(prev => [fullSpace, ...prev.filter(s => s.id !== 'sp-full')]);
    setCurrentId('sp-full'); setTab('active'); setRoute('members');
  };

  const SCENARIOS = [
    { h: 'Onboarding' },
    { k: 'Sign up \u2192 first space', go: () => { setSpaces([]); setRoute('signup'); } },
    { k: 'Sign in (new device)', go: () => setRoute('signin') },
    { k: 'Forgot password', go: () => setRoute('recovery') },
    { k: 'One-time code \u2014 errors', go: () => { setOtc({ context: 'device', error: { expired: true } }); setPostAuthTo('space'); setRoute('otc'); } },
    { h: 'The feed' },
    { k: 'The reading loop', go: () => goSpace('sp-backend') },
    { k: 'Empty feed (no links)', go: goEmptyFeed },
    { k: 'No spaces yet', go: () => { setSpaces([]); setCurrentId(null); setRoute('home'); } },
    { h: 'Members & funding' },
    { k: 'Members \u2014 champion (you)', go: () => goSpace('sp-backend', 'members') },
    { k: 'Members \u2014 non-champion', go: () => goSpace('sp-book', 'members') },
    { k: 'Members \u2014 space full', go: goFullSpaceManage },
    { k: 'Manage funding (champion)', go: () => { goSpace('sp-backend'); setManageIntent('manage'); setRoute('manage-interstitial'); } },
    { k: 'Create + fund a space', go: () => openCreateSpace() },
    { h: 'Dormant space' },
    { k: 'Dormant \u2014 champion re-fund', go: () => stageDormant({ champion: 'You', championEmail: DEFAULT_USER.email, dormancy: 'terminal' }) },
    { k: 'Dormant \u2014 champion suspended', go: () => stageDormant({ champion: 'You', championEmail: DEFAULT_USER.email, dormancy: 'suspended' }) },
    { k: 'Dormant \u2014 non-champion', go: () => stageDormant({ champion: 'Priya N.', championEmail: 'priya.n@example.com', dormancy: 'terminal' }) },
    { h: 'Invitations' },
    { k: 'Accept invite \u2014 funded', go: () => goSpace('sp-book') },
    { k: 'Accept invite \u2014 dormant', go: () => stageDormant({ champion: 'Priya N.', championEmail: 'priya.n@example.com', dormancy: 'terminal' }) },
    { k: 'Accept invite \u2014 invalid', go: () => setRoute('invalid-invite') },
    { k: 'Accept invite \u2014 space full', go: () => setRoute('space-full') },
    { h: 'Account' },
    { k: 'Change password', go: () => goSpace('sp-backend', 'account') },
  ];

  // ---- shared shell wrapper ----
  const inShell = (content, opts = {}) => (
    <AppShell
      isMobile={isMobile} user={user} showMembers={opts.showMembers !== false}
      spaces={spaces} currentId={currentId} space={space}
      onSelectSpace={enterSpace} onCreateSpace={openCreateSpace}
      onMembers={() => setRoute('members')}
      onManageAccount={() => setRoute('account')}
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
    screen = <GoogleReturn onDone={() => { if (postAuthTo === 'post-signup') { setSpaces([]); setCurrentId(null); goHome(); } else if (spaces.length === 0) goHome(); else enterSpace(currentId || 'sp-backend'); }} />;
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
    screen = <SettingUp spaceName={fundFlow.name} onDone={finishProvisioning} />;
  } else if (route === 'manage-interstitial') {
    screen = <ProviderInterstitial label="Opening this space\u2019s billing\u2026" onDone={() => setRoute('manage-funding')} />;
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
      onInvite={inviteEmail} onManageFunding={openManageFunding} />,
      { subView: { title: 'Settings', onBack: () => enterSpace(currentId) } });
  } else if (route === 'account') {
    screen = inShell(<AccountSettings user={user} />,
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
      const feed = (
        <main style={{ flex: 1, width: '100%' }}>
          <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: isMobile ? '16px 16px 112px' : '28px 24px 120px', width: '100%' }}>
            {loadingFeed ? <FeedLoading />
              : visible.length === 0 ? <EmptyState />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {visible.map(item => (
                    <FeedCard key={item.id} item={item} tab={tab}
                      onOpen={openLink}
                      onMarkRead={(it) => setConfirm({ kind: 'mark-read', item: it })}
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
  const appTree = <>{screen}{overlay}</>;

  // launcher anchoring follows its dragged position
  const launchAnchorRight = launchPos ? (launchPos.x > window.innerWidth * 0.5) : true;
  const launchOpenUp = launchPos ? (launchPos.y > window.innerHeight * 0.5) : true;
  const launchWrapStyle = launchPos ? { left: launchPos.x, top: launchPos.y, right: 'auto', bottom: 'auto' } : undefined;
  const launchPanelStyle = {
    ...(launchAnchorRight ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }),
    ...(launchOpenUp ? { bottom: 'calc(100% + 8px)', top: 'auto' } : { top: 'calc(100% + 8px)', bottom: 'auto' }),
  };

  return (
    <>
      {forcedMobile ? (
        <div className="lp-stage">
          <div className="lp-phone"><div className="lp-phone-screen">{appTree}</div></div>
        </div>
      ) : appTree}

      {/* Scenario launcher — prototype aid, not part of the product */}
      <div className="lp-launcher-wrap" ref={launchWrapRef} style={launchWrapStyle}>
        {launcher && (
          <div className="lp-launcher-panel" role="menu" style={launchPanelStyle}>
            {SCENARIOS.map((j, i) => j.h
              ? <div key={'h' + i} className="lp-launcher-head" style={i ? { paddingTop: 12 } : null}>{j.h}</div>
              : <button key={j.k} className="lp-launcher-item" onClick={() => { j.go(); setLauncher(false); }}>{j.k}</button>
            )}
            <div className="lp-launcher-sep" />
            <button className="lp-launcher-item" onClick={() => { reset(); setLauncher(false); }}>Reset to seeded data</button>
          </div>
        )}
        <button className="lp-launcher-btn" onPointerDown={onLaunchPointerDown} onClick={() => { if (launchDrag.current.moved) { launchDrag.current.moved = false; return; } setLauncher(v => !v); }} aria-expanded={launcher} style={{ cursor: 'grab', touchAction: 'none' }} title="Drag to move">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)' }} />
          Scenarios
          <Icon name="chevron-down" size={14} style={{ transform: launcher ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
        </button>
      </div>

      <LPTweaks tw={tw} setTweak={setTweak} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LPApp />);
