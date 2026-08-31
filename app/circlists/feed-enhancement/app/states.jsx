// ============================================================================
// Circlists — the states register (PROTOTYPE AID, not part of the product).
//
// THE SINGLE SOURCE for every staged state of the app. One entry per state:
//
//     { group, id, label, stage(ctx) }
//
//   id     — the state's ADDRESS. `?state=<id>` on the entry opens it, and a
//            ticket in the real build links to exactly that. Once linked, an id
//            is public: renaming or removing one breaks those links (an
//            unresolved name lands on the states index, which is how that shows
//            up rather than silently opening the wrong screen).
//   label  — how it reads to a person, in the palette and the index.
//   stage  — the staging function, handed the context built from main.jsx's
//            setters. Moved here from the old buildScenarios in config.jsx.
//
// Everything else is DERIVED from this list and cannot drift from it: the URL
// resolver below, window.CIRC_STATES (ids + labels only, for anything reading
// the page), and the palette + index in app/states-ui.jsx.
//
// A deletable aid, in two files (this + app/states-ui.jsx). main.jsx guards on
// window.buildStates / window.StatesIndex, so absent ⇒ no register, no palette,
// no address reading, and the app behaves exactly as it ships. The homepage-demo
// entry simply does not list them.
//
// NOTE ON PREVIEW: the resolver reads location.search, and nothing in the design
// tool can hand this page a URL — so `?state=` looks INERT here, in every
// posture, however correct it is. It is exercised by driving the register
// directly. See ARCHITECTURE.md → "Addressable states".
// ============================================================================

const DAY = 864e5;

// ---- staging context -------------------------------------------------------
// Built per render from main.jsx's setters; every stage() closes over nothing
// but this. Same staging behaviour as the old Config scenarios, verbatim.
function circStateContext(api) {
  const {
    spaces, STATE_KEY,
    setSpaces, setUser, setCurrentId, setTab, setRoute, setLoadingFeed, setHoldLoading,
    setOtc, setPostAuthTo, setManageIntent,
    enterSpace, openCreateSpace,
    setSortOrder, setSortMenuOpen, setDividerAt, setLensWho,
  } = api;
  const { M, IT, seedSpaces, DEFAULT_USER } = window.CircSeed;

  const reset = () => {
    try { localStorage.removeItem(STATE_KEY); } catch (e) {}
    const s = seedSpaces(DEFAULT_USER.email);
    setSpaces(s); setUser(DEFAULT_USER); setCurrentId('sp-backend'); setTab('active'); enterSpace('sp-backend');
  };
  const goSpace = (id, toRoute) => {
    setUser(u => u && u.email ? u : DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setCurrentId(id); setTab('active');
    if (toRoute) setRoute(toRoute); else enterSpace(id);
  };

  // A staged circle can be gone from state (leaving drops it), so a stager works
  // off a base that reseeds when the circle it needs is missing.
  const withSpace = (prev, id) => prev.some(s => s.id === id) ? prev : seedSpaces(DEFAULT_USER.email);

  // restage the dormant TEST - Weekend Reads to demo a dormancy state, then enter
  // it. There is no role branch on that screen any more, so `champion` here only
  // says who funded it last — the screen names nobody either way.
  const stageDormant = (cfg) => {
    setSpaces(prev => withSpace(prev, 'sp-test-weekend').map(s => s.id === 'sp-test-weekend'
      ? { ...s, funded: false, champion: cfg.champion, championEmail: cfg.championEmail, dormancy: cfg.dormancy } : s));
    setCurrentId('sp-test-weekend'); setRoute('space'); setLoadingFeed(false);
  };

  // Funding state on the champion's card: active / a scheduled ending / a renewal
  // being retried. Lands on the members surface, where the card lives.
  const stageFunding = (funding) => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setSpaces(prev => withSpace(prev, 'sp-backend').map(s => s.id === 'sp-backend'
      ? { ...s, funded: true, dormancy: null, champion: 'You', championEmail: DEFAULT_USER.email, funding } : s));
    setCurrentId('sp-backend'); setTab('active'); setRoute('members');
  };

  // A plain member of a funded, championed circle (Leave lives beneath the roster).
  // Restores the champion in case the no-champion staging below ran first.
  const stageNonChampion = () => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setSpaces(prev => withSpace(prev, 'sp-book').map(s => s.id === 'sp-book'
      ? { ...s, funded: true, dormancy: null, champion: 'Joe M.', championEmail: 'joe.m@example.com',
          openUntil: null, funding: null,
          members: s.members.some(m => m.name === 'Joe M.') ? s.members : [...s.members, M('Joe M.', 'joe.m@example.com')] } : s));
    setCurrentId('sp-book'); setTab('active'); setRoute('members');
  };

  // A champion's account was deleted: their roster row and crown are gone, the
  // circle runs to the end of the paid period unmanaged, then goes dormant.
  const stageNoChampion = () => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setSpaces(prev => withSpace(prev, 'sp-book').map(s => s.id === 'sp-book'
      ? { ...s, funded: true, dormancy: null, champion: null, championEmail: null,
          openUntil: Date.now() + 12 * DAY, funding: null,
          members: s.members.filter(m => m.name !== 'Joe M.') } : s));
    setCurrentId('sp-book'); setTab('active'); setRoute('members');
  };

  // ---- Loading lane — hold each loading state at rest for review ----------
  // Two states, matching the product: the in-shell feed indicator (held by
  // keeping loadingFeed true, no auto-clear) and the one app-level full-screen
  // state (held by routing to an app-level loading route with the app's
  // holdLoading flag set, which no-ops the auto-advance in main.jsx). The
  // per-flow routes all render the same AppLoading, so one representative
  // (google-return) covers the app-level state for review.
  const goFeedLoading = () => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setHoldLoading(false);
    setCurrentId('sp-backend'); setTab('active'); setRoute('space');
    setLoadingFeed(true);
  };
  const holdInterstitial = (toRoute) => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setLoadingFeed(false);
    setHoldLoading(true);
    setRoute(toRoute);
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

  // ---- Feed sort (BIZ-136 candidate build) ---------------------------------
  // Sort is held per circle AND per tab, keyed `<circleId>:<tab>`, so a stager
  // sets the key it wants and leaves the other tab alone.
  // Stages the lens: the order (per circle and tab), the contributor (per
  // circle), and whether the panel is open. `who` is an attribution name as the
  // cards render it — 'Sam R.', 'you', 'former member' — since that string is
  // the only contributor identity this product has.
  const stageSort = ({ space = 'sp-backend', tab = 'active', order = 'newest', menu = false, otherTab = null, waterline = false, who = null }) => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    const next = { [space + ':' + tab]: order };
    if (otherTab) next[space + ':' + otherTab.tab] = otherTab.order;
    setSortOrder(next);
    setLensWho(who ? { [space]: who } : {});
    // Opened AFTER the route settles, not before. main.jsx closes the panel on
    // any tab/circle change, and the entry below changes both — so setting it
    // here directly meant `lens-panel-open` reliably arrived with the panel
    // shut for anyone walking the register rather than loading the URL cold.
    if (menu) setTimeout(() => setSortMenuOpen(true), 0);
    else setSortMenuOpen(false);
    setCurrentId(space); setTab(tab); setLoadingFeed(false); enterSpace(space);
    setTab(tab);
    // The waterline pair. entering a circle draws the mark from the stored
    // lastSeenAt and stamps it to now in the same breath, so a staged visit
    // cannot reliably reproduce a mid-pile mark by timing alone. These two
    // states exist to show one ruling, so the mark is placed explicitly —
    // after the entry above, which would otherwise overwrite it — at a fixed
    // point inside the circle's unread pile. Both states place the SAME mark;
    // only the sort order differs, which is the whole point of the pair.
    if (waterline) {
      setTimeout(() => setDividerAt(Date.now() - 8.5 * 3600e3), 0);
    }
  };

  // One unread item only, so the sort control is absent (it appears from two up).
  // Built as its own circle rather than by emptying a seeded one, so nothing
  // else about the app is disturbed.
  const stageSingleItem = () => {
    setUser(DEFAULT_USER);
    const one = {
      id: 'sp-one', name: 'Reading Room', funded: true, dormancy: null,
      champion: 'You', championEmail: DEFAULT_USER.email,
      members: [M('You', DEFAULT_USER.email), M('Sam R.', 'sam.r@example.com')],
      items: [IT('https://www.nngroup.com/articles/ten-usability-heuristics/', 'Added by Sam R.')],
    };
    one.items.forEach((it) => { it.at = Date.now() - 3600e3; });
    one.lastSeenAt = Date.now(); one.unseen = false; one.pending = []; one.queued = [];
    setSpaces(prev => [one, ...prev.filter(s => s.id !== 'sp-one')]);
    setSortOrder({}); setSortMenuOpen(false);
    setCurrentId('sp-one'); setTab('active'); setRoute('space'); setLoadingFeed(false);
  };

  return {
    setSpaces, setUser, setCurrentId, setRoute, setOtc, setPostAuthTo, setManageIntent,
    openCreateSpace, reset, goSpace, stageDormant, stageFunding, stageNonChampion,
    stageNoChampion, goFeedLoading, holdInterstitial, goEmptyFeed, goFullSpaceManage,
    stageSort, stageSingleItem,
  };
}

// ---- THE REGISTER ----------------------------------------------------------
// Order here is the order the palette and the index read in. Group titles are
// plain strings; a new group is simply a new title.
const CIRC_STATE_REGISTER = [
  { group: 'Onboarding', id: 'signup-first-circle', label: 'Sign up \u2192 first circle', stage: (c) => { c.setSpaces([]); c.setRoute('signup'); } },
  { group: 'Onboarding', id: 'signin-new-device', label: 'Sign in (new device)', stage: (c) => c.setRoute('signin') },
  { group: 'Onboarding', id: 'forgot-password', label: 'Forgot password', stage: (c) => c.setRoute('recovery') },
  { group: 'Onboarding', id: 'otc-error', label: 'One-time code \u2014 errors', stage: (c) => { c.setOtc({ context: 'device', error: { expired: true } }); c.setPostAuthTo('space'); c.setRoute('otc'); } },

  { group: 'The feed', id: 'reading-loop', label: 'The reading loop', stage: (c) => c.goSpace('sp-backend') },
  { group: 'The feed', id: 'empty-feed', label: 'Empty feed (no links)', stage: (c) => c.goEmptyFeed() },
  { group: 'The feed', id: 'no-circles', label: 'No circles yet', stage: (c) => { c.setSpaces([]); c.setCurrentId(null); c.setRoute('home'); } },

  { group: 'Loading states', id: 'feed-loading', label: 'Feed \u2014 in a circle (in-shell)', stage: (c) => c.goFeedLoading() },
  { group: 'Loading states', id: 'app-loading', label: 'App \u2014 full screen', stage: (c) => c.holdInterstitial('google-return') },

  { group: 'Members & funding', id: 'members-champion', label: 'Members \u2014 champion (you)', stage: (c) => c.stageFunding(null) },
  { group: 'Members & funding', id: 'members-non-champion', label: 'Members \u2014 non-champion', stage: (c) => c.stageNonChampion() },
  { group: 'Members & funding', id: 'members-circle-full', label: 'Members \u2014 circle full', stage: (c) => c.goFullSpaceManage() },
  { group: 'Members & funding', id: 'funding-ending', label: 'Funding \u2014 ending on a date', stage: (c) => c.stageFunding({ state: 'ending', endsAt: Date.now() + 18 * DAY }) },
  { group: 'Members & funding', id: 'funding-retrying', label: 'Funding \u2014 payment retrying', stage: (c) => c.stageFunding({ state: 'retrying', retryWindow: '30 days' }) },
  { group: 'Members & funding', id: 'circle-no-champion', label: 'Circle with no champion', stage: (c) => c.stageNoChampion() },
  { group: 'Members & funding', id: 'manage-funding', label: 'Manage funding (champion)', stage: (c) => { c.goSpace('sp-backend'); c.setManageIntent('manage'); c.setRoute('manage-interstitial'); } },
  { group: 'Members & funding', id: 'create-and-fund', label: 'Create + fund a circle', stage: (c) => c.openCreateSpace() },

  { group: 'Dormant circle', id: 'dormant-circle', label: 'Dormant circle', stage: (c) => c.stageDormant({ champion: 'Priya N.', championEmail: 'priya.n@example.com', dormancy: 'terminal' }) },
  { group: 'Dormant circle', id: 'suspended-by-us', label: 'Suspended by us', stage: (c) => c.stageDormant({ champion: 'Priya N.', championEmail: 'priya.n@example.com', dormancy: 'suspended' }) },

  { group: 'Invitations', id: 'invite-funded', label: 'Accept invite \u2014 funded', stage: (c) => c.goSpace('sp-book') },
  { group: 'Invitations', id: 'invite-dormant', label: 'Accept invite \u2014 dormant', stage: (c) => c.stageDormant({ champion: 'Priya N.', championEmail: 'priya.n@example.com', dormancy: 'terminal' }) },
  { group: 'Invitations', id: 'invite-invalid', label: 'Accept invite \u2014 invalid', stage: (c) => c.setRoute('invalid-invite') },
  { group: 'Invitations', id: 'invite-circle-full', label: 'Accept invite \u2014 circle full', stage: (c) => c.setRoute('space-full') },

  { group: 'Account', id: 'account-email-password', label: 'Change email & password', stage: (c) => c.goSpace('sp-backend', 'account') },
  { group: 'Account', id: 'account-sso', label: 'Email & password via SSO', stage: (c) => { c.setUser({ ...window.CircSeed.DEFAULT_USER, email: 'sam.rivera@googlemail.com', ssoProvider: 'Google' }); c.goSpace('sp-backend', 'account'); } },

  // ==========================================================================
  // CANDIDATE BUILD — feed enhancement (BIZ-136)
  //
  // Everything the while-away runs build lands in this group, and nowhere else.
  // One run, one set of entries, appended below the last run's. A state that is
  // not reachable from here did not ship.
  //
  // Keep the group title exactly as written — it is how the work is found in
  // the Scenarios palette without hunting through the app.
  //
  // Run 1 \u2014 Queue item 1 \u00b7 Sort.
  // ==========================================================================
  // Run 1's id, kept so the URL it published still resolves. The standalone sort
  // menu it named no longer exists — run 2 folded it into the lens — so it now
  // lands on the lens, same as `lens-panel-open`.
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-menu-open', label: 'Sort \u2014 now folded into the lens', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', menu: true }) },
  // THE RULING, made visible as a PAIR. Same circle, same mark, one difference:
  // the sort. Open them in order \u2014 the waterline is there under newest-first and
  // gone under oldest-first, because "Earlier" names the older pile beneath it
  // and under oldest-first the older pile is above.
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-waterline-newest', label: 'Waterline \u2014 under newest first (the control)', stage: (c) => c.stageSort({ space: 'sp-book', tab: 'active', order: 'newest', waterline: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-oldest-waterline', label: 'Waterline \u2014 withheld under oldest first', stage: (c) => c.stageSort({ space: 'sp-book', tab: 'active', order: 'oldest', waterline: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-read-oldest', label: 'Read pile from the beginning', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', order: 'oldest', otherTab: { tab: 'active', order: 'newest' } }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-single-item', label: 'One link \u2014 no sort control', stage: (c) => c.stageSingleItem() },
  // Run 2 \u2014 the contributor filter, folded with sort into one lens control.
  { group: 'Candidate build \u2014 feed enhancement', id: 'lens-panel-open', label: 'The lens \u2014 one control, order and who', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', menu: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'filter-contributor', label: 'Filtered to one contributor', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', who: 'Sam R.' }) },
  // Priya's two Active links sit either side of the last-visit mark, so the
  // waterline still draws inside the filtered list \u2014 the ruling this state exists
  // to show. Sorting oldest-first still withholds it, as run 1 ruled.
  { group: 'Candidate build \u2014 feed enhancement', id: 'filter-waterline', label: 'Waterline \u2014 drawn inside a filter', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', who: 'Priya N.', waterline: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'filter-former-member', label: 'Former member \u2014 the one shared bucket', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', who: 'former member' }) },
  // The lens is held per circle, so it survives the hop to Read. Dev K. has one
  // link in this circle and it is unread, so Read under their lens is genuinely
  // empty \u2014 the zero-match register, which is a different thing from an empty
  // Read pile and says so.
  { group: 'Candidate build \u2014 feed enhancement', id: 'filter-no-match', label: 'Nothing matches the lens', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', who: 'Dev K.' }) },
  // Both halves of the lens non-default at once — the case the chip row exists
  // to serve, and the one that decides whether it wraps gracefully at 390.
  { group: 'Candidate build \u2014 feed enhancement', id: 'lens-both-applied', label: 'Both applied \u2014 order and contributor', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'oldest', who: 'former member' }) },
];

// The catalogue's own address. Not a state, so it is not in the register.
const CIRC_STATE_INDEX_NAMES = ['index', 'states'];

// ---- derived: what an agent or a script can read off the page --------------
// Names and labels only. Nothing runnable, so reading it can't stage anything.
window.CIRC_STATES = CIRC_STATE_REGISTER.map(({ id, label, group }) => ({ id, label, group }));

// ---- derived: the bound register main.jsx renders from ---------------------
function buildStates(api) {
  const ctx = circStateContext(api);
  const states = CIRC_STATE_REGISTER.map((s) => ({ id: s.id, label: s.label, group: s.group, go: () => s.stage(ctx) }));
  const byId = {};
  const groups = [];
  states.forEach((s) => {
    byId[s.id] = s;
    let g = groups.find((x) => x.title === s.group);
    if (!g) { g = { title: s.group, items: [] }; groups.push(g); }
    g.items.push(s);
  });
  return { states, byId, groups, reset: ctx.reset };
}

// ---- derived: the address ---------------------------------------------------
// `?state=<id>`  → that state, overriding whatever local state was restored.
// `?state=index` → the states index (the catalogue, linkable in its own right).
// a name not in the register → the index, which is how a stale ticket link shows
//   itself: the reader sees a list that does not contain the name they came for.
// nothing at all → null, and the app opens on the top circle, as the real app does.
function circResolveState() {
  let raw = null;
  try { raw = new URLSearchParams(window.location.search).get('state'); } catch (e) { return null; }
  const name = (raw || '').trim().toLowerCase();
  if (!name) return null;
  if (CIRC_STATE_INDEX_NAMES.includes(name)) return { kind: 'index', name };
  if (CIRC_STATE_REGISTER.some((s) => s.id === name)) return { kind: 'state', id: name };
  return { kind: 'unresolved', name };
}

// A link someone can be handed. Served in the console's iframe, this page's own
// address is not the address anyone can open — the console page is, and its URL
// is the referrer. Falls back to this page's own address when unframed or when
// no referrer is sent.
function circStateLink(id) {
  let base = window.location.origin + window.location.pathname;
  if (window.parent !== window && document.referrer) {
    try { const u = new URL(document.referrer); base = u.origin + u.pathname; } catch (e) {}
  }
  return base + '?state=' + id;
}

Object.assign(window, { buildStates, circResolveState, circStateLink });
