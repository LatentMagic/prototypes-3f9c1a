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

// Search (feed-enhancement candidate build). The one Read-tab card whose title
// never resolved — seeded unread with no SEED_META entry (seed-data.jsx), so
// it renders its bare URL as its own headline. `stageSort`'s `bareRead` flag
// marks this exact URL read so search-bare-url can show the field matching a
// headline that IS a URL, which is the one case circFilterSearch's index rule
// most needs proving against. Not edited into the seed itself — a seed change
// would oblige a parallel demo-seed edit and a state-key bump this slice does
// not need (see this project's CLAUDE.md, "Seed data — the standing rule").
const CIRC_BARE_URL = 'https://analytics-internal-example.com/?trace=8823ff1c9e0a4b12-2026-03-retro-followups-database-migration-incident-action-items-and-owners-final-draft-v3';

// ---- staging context -------------------------------------------------------
// Built per render from main.jsx's setters; every stage() closes over nothing
// but this. Same staging behaviour as the old Config scenarios, verbatim.
function circStateContext(api) {
  const {
    spaces, STATE_KEY,
    setSpaces, setUser, setCurrentId, setTab, setRoute, setLoadingFeed, setHoldLoading,
    setOtc, setPostAuthTo, setManageIntent,
    enterSpace, openCreateSpace,
    setSortOrder, setSortMenuOpen, setDividerAt, setLensWho, setDensity, setSavedOn,
    setSearchQuery, setSearchOpen, setSavedMode,
    setFeedError,
  } = api;
  // The feed's load-failure is the first staged flag that can OUTLIVE the state
  // that set it: every other flag here is overwritten by the next stager, and a
  // walker clicking from a load-error state to any other would otherwise carry
  // the failure into it. So it is cleared defensively wherever a stager settles
  // a route, and set only where a state asks for it. Guarded because main.jsx
  // only passes it when app/not-found.jsx is present.
  const clearFeedError = () => { if (setFeedError) setFeedError(false); };
  const { M, IT, seedSpaces, DEFAULT_USER } = window.CircSeed;

  const reset = () => {
    try { localStorage.removeItem(STATE_KEY); } catch (e) {}
    const s = seedSpaces(DEFAULT_USER.email);
    setSpaces(s); setUser(DEFAULT_USER); setCurrentId('sp-backend'); setTab('active'); enterSpace('sp-backend');
    clearFeedError();
  };
  const goSpace = (id, toRoute) => {
    setUser(u => u && u.email ? u : DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setCurrentId(id); setTab('active');
    clearFeedError();
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

  // The app-level not-found page (feed-enhancement candidate build). A bare
  // route with no circle context, because that is the honest staging: the page
  // answers an address that resolved to nothing, so there is nothing for it to
  // be "inside". Signed in, so the way home has somewhere to go.
  const stageNotFound = () => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setLoadingFeed(false);
    clearFeedError();
    setRoute('not-found');
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
  // `saved`/`savedOn` (Run 4, feed-enhancement): `saved` is an array of item
  // indexes WITHIN THE STAGED TAB's own list, in the SAME ORDER main.jsx
  // actually renders it — sorted by `order` (circSortItems), not raw storage
  // order. Storage order and display order coincide for the plain seed, but
  // NOT once the discourse candidate build's own seed extension (talk-data.jsx)
  // inserts its two extra read fixtures at fixed array positions with their
  // own timestamps — display order is the only one a person staging this ever
  // sees, so it is the only one worth indexing against. Passing `saved`
  // re-marks the WHOLE circle's saved flags (everything not named is
  // explicitly un-saved), so a stager is idempotent regardless of what an
  // earlier state in the palette left marked — the same reason `who` below is
  // always fully replaced rather than merged. Omitted (the default) leaves
  // saved flags untouched, for every run-1-3 entry that has nothing to say
  // about them.
  // `savedMode` (BIZ-136 run 7): the shape saved is offered in — 'bar'
  // (shipped, default), 'lens' (Reading A, a fourth lens group) or 'surface'
  // (Reading B, a third tab). ALWAYS fully replaced, same reasoning as
  // `who`/`savedOn` above: an entry that says nothing about it must land in
  // 'bar', never inherit whatever the last-staged entry left it on.
  // `finalTab` (run 7): the DISPLAYED tab, when it differs from the `tab`
  // param above. `tab` still decides which item pool `saved` indexes into
  // (read vs active) — a Reading-B state stages saved marks against the READ
  // pool (`tab: 'read'`) but then wants the SAVED tab on screen, which is a
  // different thing from what pool was scoped. Omitted, the displayed tab is
  // `tab` itself, exactly as before this param existed.
  const stageSort = ({ space = 'sp-backend', tab = 'active', order = 'newest', menu = false, otherTab = null, waterline = false, who = null, density = 'comfortable', saved = null, savedOn = false, feedError = false, query = '', searchOpen = false, bareRead = false, savedMode = 'bar', finalTab = null }) => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    // Search — `bareRead` (feed-enhancement candidate build). Applied BEFORE
    // the `saved` block below, so a stager that ever combines the two indexes
    // `saved` against the pile this card has already joined, not the one
    // before it. No entry in this run combines them, but the ordering is the
    // honest one regardless.
    if (bareRead) {
      setSpaces(prev => withSpace(prev, space).map(s => s.id !== space ? s : {
        ...s, items: s.items.map(i => i.url === CIRC_BARE_URL ? { ...i, read: true } : i),
      }));
    }
    // Keyed by the DISPLAYED tab, not the scope tab (BIZ-136 run 7, from the
    // review). `tab` scopes which pool the `saved` indices below count against;
    // `finalTab` is where the member actually lands. main.jsx computes its
    // sortKey from the displayed tab, so a Reading-B entry staging
    // `tab: 'read', finalTab: 'saved'` wrote `<circle>:read` while main.jsx
    // read `<circle>:saved` — and the order, the query and the field's open
    // flag were all silently dropped. No entry today stages an order or a query
    // on the Saved tab, so nothing looked wrong; the next one that wants
    // "Saved, oldest first" would have staged it and seen nothing, with no
    // error anywhere.
    const keyTab = finalTab || tab;
    const next = { [space + ':' + keyTab]: order };
    if (otherTab) next[space + ':' + otherTab.tab] = otherTab.order;
    setSortOrder(next);
    setLensWho(who ? { [space]: who } : {});
    // Density (BIZ-136 run 3): ONE value for the whole surface, so a stager
    // sets it directly rather than keying it per circle/tab as sortOrder is.
    setDensity(density);
    if (saved !== null) {
      setSpaces(prev => withSpace(prev, space).map(s => {
        if (s.id !== space) return s;
        const scoped = s.items.filter(i => (tab === 'read' ? i.read : !i.read));
        const sortedScope = window.circSortItems ? window.circSortItems(scoped, order) : scoped;
        const scopeIds = sortedScope.map(i => i.id);
        const keep = new Set(saved.map(i => scopeIds[i]).filter(Boolean));
        return { ...s, items: s.items.map(i => ({ ...i, saved: keep.has(i.id) })) };
      }));
    }
    // Held per circle, same as `who` — always fully replaced, so switching
    // between staged entries never inherits a filter the last one turned on.
    setSavedOn(savedOn ? { [space]: true } : {});
    // Search (feed-enhancement candidate build). Keyed same as sortOrder,
    // always fully replaced — same reasoning as `who`/`savedOn` above, so an
    // entry that says nothing about search always lands with the field shut
    // and empty, never inheriting whatever the last-opened entry left typed.
    setSearchQuery(query ? { [space + ':' + keyTab]: query } : {});
    // A staged QUERY implies a staged OPEN. Without this, an entry that sets
    // only `query` leaves `searchOpen` false and the field is open purely
    // because a query exists — so backspacing to empty closes it mid-keystroke
    // and drops focus. In real use that never happens, because the only route
    // to a query is the trigger, which sets the flag; it happened only on the
    // ?state= URLs, which are exactly the links Joe follows.
    setSearchOpen((searchOpen || query) ? { [space + ':' + keyTab]: true } : {});
    if (setSavedMode) setSavedMode(savedMode);
    const shownTab = finalTab || tab;
    setCurrentId(space); setTab(shownTab); setLoadingFeed(false); enterSpace(space);
    setTab(shownTab);
    // Opened AFTER the route settles, not before, and AFTER the tab/circle
    // writes just above (moved here in run 7 — read on). main.jsx closes the
    // panel on any tab/circle change (the `[tab, currentId]` effect in
    // main.jsx), and an entry can change both, so opening the panel before
    // that settles meant the close would win.
    //
    // THE DELAY IS THE ACTUAL FIX, not the statement order (run 7). Every
    // menu:true entry before this run staged `tab: 'active'` — this app's own
    // boot default — so the cleanup effect's deps never actually changed and
    // its `setSortMenuOpen(false)` never re-ran; a bare setTimeout(…, 0)
    // "worked" by there being no closing write left to race, regardless of
    // where in this function it was called. `saved-lens-door` (run 7) is the
    // first entry to open the menu on a tab that is NOT the boot default, so
    // it is the first to actually change `tab` — and 0ms lost that race
    // outright: every setState call in this function lands in ONE batched
    // React commit no matter what order they're written in here, so moving
    // this block earlier or later in the function changes nothing about when
    // the resulting effect flush runs against a plain setTimeout(0) macrotask
    // — and that flush settled the close FIRST. 60ms clears it with room to
    // spare and is imperceptible against the 2600ms this app's own stagers
    // are already read against. Kept after the tab/circle writes anyway,
    // because reading top-to-bottom as "settle the route, THEN open the
    // panel" is the honest shape even though the timer is what does the work.
    if (menu) setTimeout(() => setSortMenuOpen(true), 60);
    else setSortMenuOpen(false);
    // Set AFTER enterSpace, which clears it on the way in — the failure is the
    // state being staged, not something the entry should wash away.
    if (setFeedError) setTimeout(() => setFeedError(!!feedError), 0);
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
    stageSort, stageSingleItem, stageNotFound,
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
  // Run 3 \u2014 density (Comfortable/Compact) + the lens panel's visual rework.
  { group: 'Candidate build \u2014 feed enhancement', id: 'density-compact', label: 'Compact \u2014 more of the circle in view', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', density: 'compact' }) },
  // Same circle and tab as density-compact, comfortable instead \u2014 open the two
  // back to back to see the metric change alone, nothing else moving.
  { group: 'Candidate build \u2014 feed enhancement', id: 'density-comfortable', label: 'Comfortable \u2014 the default rhythm', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', density: 'comfortable' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'view-panel-open', label: 'The lens \u2014 order, view and who', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', menu: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'density-compact-waterline', label: 'Compact \u2014 the waterline still reads', stage: (c) => c.stageSort({ space: 'sp-book', tab: 'active', order: 'newest', density: 'compact', waterline: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'density-compact-read', label: 'Compact \u2014 the Read pile', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', density: 'compact' }) },
  // Run 4 \u2014 the saved state and its surface.
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-marks', label: 'Saved \u2014 the mark on a read card', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2] }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-filtered', label: 'Saved \u2014 the archive narrowed', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedOn: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-none-yet', label: 'Saved \u2014 nothing kept yet (the calm floor)', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [] }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-empty', label: 'Saved \u2014 the lens on, nothing in it', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [], savedOn: true }) },
  // Priya N. holds two read links in this circle \u2014 jvns.ca and the
  // internal-infra postmortem \u2014 indexes 1 and 6 of the Read tab's own
  // OLDEST-sorted runtime order; confirmed by rendering the staged state and
  // reading the DOM, not by counting the seed (the discourse candidate
  // build's own seed extension, talk-data.jsx, inserts two further read
  // fixtures at fixed positions with their own timestamps, so a seed-only
  // count is both short by two and in the wrong order once sorted). Marking
  // both saved and filtering to her gives a genuinely non-empty, three-chip
  // composition: Order (oldest), Added by (Priya N.), Saved.
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-with-lens', label: 'Saved \u2014 composed with the lens', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', order: 'oldest', who: 'Priya N.', saved: [1, 6], savedOn: true }) },
  // ---- Run 5 · item 5, and the arrangement half reopened ------------------
  // The not-found page is staged as a bare route because that is what it
  // answers: an address that resolved to nothing, with no circle to be inside.
  { group: 'Candidate build \u2014 feed enhancement', id: 'not-found-page', label: 'Not found \u2014 one answer for a bad address', stage: (c) => c.stageNotFound() },
  // The failure with NOTHING applied, so the plain shape reads first: shell and
  // tabs live above, the region alone replaced.
  { group: 'Candidate build \u2014 feed enhancement', id: 'feed-load-error', label: 'Feed \u2014 the region failed, the app did not', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', feedError: true }) },
  // The same failure under a lens. The chips STAY: the fetch failed, and the
  // member's narrowing is still what they set — hiding it would make a failed
  // load look like a cleared filter.
  { group: 'Candidate build \u2014 feed enhancement', id: 'feed-load-error-lens', label: 'Feed \u2014 the failure keeps the lens applied', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'oldest', who: 'Priya N.', feedError: true }) },
  // Grid. Desktop only by design, so this one reads as the arrangement change
  // at 1280 and falls back to a single column at 390 \u2014 both are correct.
  { group: 'Candidate build \u2014 feed enhancement', id: 'view-grid', label: 'Grid \u2014 two columns, and no card carries an image', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', density: 'grid' }) },
  // The panel open on three options, which is the control change itself.
  { group: 'Candidate build \u2014 feed enhancement', id: 'view-grid-panel', label: 'Grid \u2014 the View group\u2019s third option', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', density: 'grid', menu: true }) },
  // The waterline in a grid. It marks where the last visit reached, so it spans
  // BOTH columns \u2014 a divider sitting in one cell would claim something false
  // about the card beside it.
  { group: 'Candidate build \u2014 feed enhancement', id: 'view-grid-waterline', label: 'Grid \u2014 the waterline spans both columns', stage: (c) => c.stageSort({ space: 'sp-book', tab: 'active', order: 'newest', density: 'grid', waterline: true }) },
  // Run 4 gave the contributor miss precedence over the saved miss, and its copy
  // then told members "You have not read anything they added" while the saved
  // filter was the thing hiding them. Dev K. has read links in this circle and
  // none of them saved, which is exactly the case that was being described
  // falsely.
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-lens-none', label: 'Saved \u2014 both narrowings empty, and both now named', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', who: 'Dev K.', saved: [0, 2, 4], savedOn: true }) },
  // ---- Search — the fourth narrowing, composed after who/saved --------
  // The field open with nothing typed yet — the plain disclosure, before it
  // has anything to say.
  { group: 'Candidate build \u2014 feed enhancement', id: 'search-open', label: 'Search \u2014 the field, before a word is typed', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', searchOpen: true }) },
  // 'go' matches TWO Read cards by their URL/title: go.dev/blog/pipelines and
  // go.dev/blog/errors-are-values ('Go' in both titles, 'go.dev' in both
  // domains) — confirmed against seed-data.jsx's sp-backend Read pile, not by
  // guessing at the word.
  { group: 'Candidate build \u2014 feed enhancement', id: 'search-results', label: 'Search \u2014 the pile narrows as you type', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', query: 'go' }) },
  // The card seeded with NO SEED_META entry (seed-data.jsx), so its headline
  // IS its URL — exactly the case the index rule's "or the bare URL" clause
  // exists for. Unread in the plain seed; `bareRead` promotes it into the Read
  // pile before the query runs. 'migration' sits inside that URL's own slug
  // ("...database-migration-incident...") and matches nothing else in this
  // circle's Read pile.
  { group: 'Candidate build \u2014 feed enhancement', id: 'search-bare-url', label: 'Search \u2014 the card whose title never resolved', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', bareRead: true, query: 'migration' }) },
  // Priya N.'s Read pile in this circle is two links — jvns.ca's DNS piece and
  // the internal-infra postmortem. 'dns' matches only the first, by its title
  // ("How DNS Resolvers Actually Work") — confirmed against the same pile
  // 'filter-contributor' above already narrows to, so the compose is provably
  // narrower than either filter alone, not just differently-worded.
  { group: 'Candidate build \u2014 feed enhancement', id: 'search-composed', label: 'Search \u2014 narrowing an already-narrowed list', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', who: 'Priya N.', query: 'dns' }) },
  // 'xylophone' appears nowhere in this product's seed data — titles, sources,
  // domains or attributions — by inspection of seed-data.jsx, so it is a clean
  // zero-match word rather than one that happens to miss today's fixtures.
  { group: 'Candidate build \u2014 feed enhancement', id: 'search-no-match', label: 'Search \u2014 nothing matches, and it says what it looked at', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', query: 'xylophone' }) },
  // All three narrowings named in one headline. 'xylophone' guarantees the
  // miss regardless of which single saved index landed inside Priya N.'s own
  // pile — the point of this state is the compound sentence FeedNoMatch
  // renders when who/saved/query are ALL active, not which particular link
  // the saved mark happened to land on.
  { group: 'Candidate build \u2014 feed enhancement', id: 'search-all-three', label: 'Search \u2014 all three narrowings named at once', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', who: 'Priya N.', saved: [0], savedOn: true, query: 'xylophone' }) },

  // ---- Run 7 \u2014 two readings of "saved", side by side with the shipped bar --
  // Fixture parity, deliberate: every entry below stages sp-backend, scopes
  // `saved` against the READ pool, and marks the same three links (indexes
  // 0/1/2 of that pool's own newest-first order) \u2014 except saved-tab-empty,
  // which marks none. Comparing two shapes of the same control against two
  // different piles of links is not a comparison, so nothing here varies that.
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-lens-door', label: 'Reading A \u2014 saved joins the lens, the door open', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedMode: 'lens', menu: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-lens-applied', label: 'Reading A \u2014 saved on, no bookmark left on the bar', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedOn: true, savedMode: 'lens' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-lens-composed', label: 'Reading A \u2014 saved and a contributor, both from the one door', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedOn: true, who: 'Priya N.', savedMode: 'lens' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-tab', label: 'Reading B \u2014 saved as its own tab, populated', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedMode: 'surface', finalTab: 'saved' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-tab-empty', label: 'Reading B \u2014 the Saved tab, nothing kept yet', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [], savedMode: 'surface', finalTab: 'saved' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-tab-read', label: 'Reading B \u2014 the Read tab, carrying no saved control at all', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedMode: 'surface' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-tab-composed', label: 'Reading B \u2014 the Saved tab under a contributor lens', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], who: 'Priya N.', savedMode: 'surface', finalTab: 'saved' }) },
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
