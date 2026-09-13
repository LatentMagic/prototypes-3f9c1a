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
    setSearchQuery, setSearchOpen, setSavedMode, setHomeStripOpen, setPointedId,
    setFeedError,
  } = api;
  // The feed's load-failure is the first staged flag that can OUTLIVE the state
  // that set it: every other flag here is overwritten by the next stager, and a
  // walker clicking from a load-error state to any other would otherwise carry
  // the failure into it. So it is cleared defensively wherever a stager settles
  // a route, and set only where a state asks for it. Guarded because main.jsx
  // only passes it when app/not-found.jsx is present.
  const clearFeedError = () => { if (setFeedError) setFeedError(false); };
  // The superseded card row (BIZ-136 run 10) is the second flag that can outlive
  // the state that set it, for the same reason the load-error can: it is a bare
  // window global read at render time rather than app state a stager overwrites.
  // So it is cleared wherever a stager settles a route, exactly as above, and
  // set only by `stageLegacyRow`. Without this, opening the superseded row and
  // then any other state leaves every card in the app wearing the old shape.
  const clearLegacyRow = () => { window.circCardRowLegacy = false; };
  const { M, IT, seedSpaces, DEFAULT_USER } = window.CircSeed;

  const reset = () => {
    try { localStorage.removeItem(STATE_KEY); } catch (e) {}
    const s = seedSpaces(DEFAULT_USER.email);
    setSpaces(s); setUser(DEFAULT_USER); setCurrentId('sp-backend'); setTab('active'); enterSpace('sp-backend');
    clearFeedError(); clearLegacyRow();
  };
  const goSpace = (id, toRoute) => {
    setUser(u => u && u.email ? u : DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setCurrentId(id); setTab('active');
    clearFeedError(); clearLegacyRow();
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
    clearFeedError(); clearLegacyRow();
    setRoute('not-found');
  };

  // The home screen (feed-enhancement candidate build) — one stager,
  // `stageSort`'s own style: an options object whose every flag is fully
  // replaced on each call, so an entry is idempotent regardless of what the
  // previous one in the palette left set.
  //   only  — keep exactly this one circle (a single-circle or a single-
  //           dormant-circle home), default: the whole seed.
  //   quiet — the caught-up state. Three things have to be true at once or the
  //           screen contradicts itself: no dot on any circle, no fresh turn on
  //           any watched card (marks pulled up to now), AND no unread links —
  //           because `circleSummary` reads unread links, so leaving them unread
  //           renders "New links" on every row beneath a strip saying "You're
  //           caught up." Clearing only the first two is the obvious fix and the
  //           wrong one; this state's whole job is that the quiet reads as
  //           arrival, so all three go.
  //   empty — no circles at all, landing on NoSpaceHome.
  //   open  — whether the returns strip is expanded. Defaults to FALSE, matching
  //           the app's own landing default (main.jsx's homeStripOpen): open by
  //           default reads as content bloat on a screen the member has not
  //           asked anything of yet, so a stager that quietly opened it would
  //           stage a screen the product never shows.
  //   sleep — put ONE named circle to sleep, leaving the others funded. A
  //           dormant circle shown on its own proves nothing: the claim being
  //           demonstrated is that it sits AMONG the others saying "Asleep",
  //           carries no dot, and is absent from the strip even when it holds
  //           watched cards — and only a mixed list can show that.
  //
  // TEST circles are dropped from every home state. `listSpaces` hides them only
  // while the review toggle is off, and the home's whole subject IS the circle
  // list — five rows where a member has three makes the screen read as a debug
  // view. Staging is where that belongs, not in the product code.
  //   crowd — a member in FIVE talking circles, so the strip's ceiling is
  //           actually on screen. Without this the bound ruled in 87 is
  //           unfalsifiable: the seed yields five rows over two circles, every
  //           other state sits under the cap, and the leftover line has never
  //           rendered. The two extra circles are clones of the two that already
  //           carry watched, read, freshly-answered cards, renamed — cloning is
  //           what keeps this a fixture rather than a second seed to maintain.
  const stageHome = ({ only = null, quiet = false, empty = false, open = false, sleep = null, crowd = false } = {}) => {
    setUser(DEFAULT_USER);
    let s = empty ? [] : seedSpaces(DEFAULT_USER.email).filter((sp) => !/^TEST\b/i.test(sp.name || ''));
    if (crowd) {
      const clone = (src, id, name, shift) => ({
        ...src, id, name, unseen: false,
        items: src.items.map((i, n) => ({
          ...i, id: id + '-' + n,
          ...(i.talkSeenAt ? { talkSeenAt: i.talkSeenAt - shift } : {}),
          talk: (i.talk || []).map((t) => ({ ...t, id: id + '-' + t.id, at: t.at - shift })),
        })),
      });
      const pod = s.find((sp) => sp.id === 'sp-backend');
      const club = s.find((sp) => sp.id === 'sp-book');
      if (pod && club) s = s.concat([
        clone(club, 'sp-crowd-a', 'Thursday Cinema', 36e5),
        clone(pod, 'sp-crowd-b', 'Platform Guild', 72e5),
      ]);
    }
    if (only) s = s.filter((sp) => sp.id === only);
    if (sleep) s = s.map((sp) => (sp.id === sleep
      ? { ...sp, funded: false, dormancy: 'terminal', unseen: false, champion: 'Priya N.', championEmail: 'priya.n@example.com' }
      : sp));
    if (quiet) s = s.map((sp) => ({
      ...sp, unseen: false,
      items: sp.items.map((i) => ({ ...i, read: true, ...(i.talkSeenAt ? { talkSeenAt: Date.now() } : {}) })),
    }));
    setSpaces(s);
    setCurrentId(null); setRoute('home'); setLoadingFeed(false);
    if (setHomeStripOpen) setHomeStripOpen(open);
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
  // `savedMode` (BIZ-136 run 7): the shape saved is offered in — 'lens'
  // (shipped since run 9: saved is a lens group), 'bar' (the superseded
  // bookmark on the tab bar) or 'surface' (Reading B, a third tab). ALWAYS
  // fully replaced, same reasoning as `who`/`savedOn` above: an entry that says
  // nothing about it must land in the default, never inherit whatever the
  // last-staged entry left it on.
  //
  // THE DEFAULT MOVED TO 'lens' IN RUN 9, and this line is the reason every
  // older saved state moved with it. The owner ratified Reading A by looking at
  // it; had this default stayed 'bar', the app would have opened in one shape
  // while `saved-marks`, `saved-filtered` and the rest of the run-4 states went
  // on demonstrating the shape it replaced. The register would then have been
  // showing him a version of the app that no longer exists — which is the
  // failure a states register is for preventing, not for causing.
  // `finalTab` (run 7): the DISPLAYED tab, when it differs from the `tab`
  // param above. `tab` still decides which item pool `saved` indexes into
  // (read vs active) — a Reading-B state stages saved marks against the READ
  // pool (`tab: 'read'`) but then wants the SAVED tab on screen, which is a
  // different thing from what pool was scoped. Omitted, the displayed tab is
  // `tab` itself, exactly as before this param existed.
  const stageSort = ({ space = 'sp-backend', tab = 'active', order = 'newest', menu = false, otherTab = null, waterline = false, who = null, density = 'comfortable', saved = null, savedOn = false, feedError = false, query = '', searchOpen = false, bareRead = false, savedMode = 'lens', finalTab = null, pointed = null, pendingCount = 0 }) => {
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
    // The pointed card (BIZ-136 wild feature — sharing). `pointed` is an INDEX
    // into the staged tab's own sorted order, not an item id, for the same
    // reason `saved` is: an id is a seed detail that moves the day the seed
    // does, and every other index in this stager is positional.
    // Always fully replaced, so an entry that says nothing about sharing lands
    // with nothing pointed at rather than inheriting the last entry's card.
    if (setPointedId) setPointedId(null);
    if (setPointedId && pointed !== null) {
      const sp = (spaces.length ? spaces : seedSpaces(DEFAULT_USER.email)).find(x => x.id === space);
      const scoped = ((sp && sp.items) || []).filter(i => (keyTab === 'read' ? i.read : !i.read));
      const sortedScope = window.circSortItems ? window.circSortItems(scoped, order) : scoped;
      const target = sortedScope[pointed];
      // After the tab and circle writes settle, for the same reason the lens
      // panel's own open is deferred: main.jsx clears transient view state on a
      // tab or circle change, and an entry sets both.
      if (target) setTimeout(() => setPointedId(target.id), 80);
    }
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
    // Arrivals behind the pill (`sort-oldest-accept`, requirements 6–8): the
    // same simulated-drop generator the live check uses, staged directly
    // rather than waited for. After the entry above, same reason `waterline`
    // is: entering a circle clears transient arrival state on the way in.
    //
    // Skips any drop whose URL the circle already holds (design audit finding
    // 3, 2026-09-11): `circNextDrop`'s pool opens with a New Yorker piece
    // `sp-book` already seeds, so an unguarded draw landed the same source and
    // headline three rows apart — the state built to show the ruling opened on
    // what read as a duplicate-card bug. A small bounded retry, not a fixed
    // skip-count, so this holds if the pool or the target circle's seed ever
    // changes again.
    if (pendingCount) {
      setTimeout(() => setSpaces(prev => withSpace(prev, space).map(s => {
        if (s.id !== space) return s;
        const seeded = new Set((s.items || []).map((i) => i.url));
        const picked = [];
        for (let tries = 0; picked.length < pendingCount && tries < 20; tries += 1) {
          const drop = window.circNextDrop();
          if (!seeded.has(drop.url)) picked.push(drop);
        }
        return { ...s, pending: picked };
      })), 0);
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

  // Arriving on a shared card address (BIZ-136 wild feature). ONE stager for
  // both ends, because in the product they are one route: the address means
  // "this card", and the follower's own read-state decides what they meet.
  // Staging them from two different helpers would have made them look like two
  // features, which is the thing the design is arguing against.
  const stageSharedCard = ({ space = 'sp-backend', read = false, index = 1 } = {}) => {
    stageSort({ space, tab: read ? 'read' : 'active', order: 'newest', pointed: read ? null : index });
    if (!read) return;
    // The read branch lands on Overview, which is the candidate module's own
    // route. Deferred past the tab and circle writes for the same reason every
    // other post-stage act here is: main.jsx clears transient view state when
    // either changes.
    setTimeout(() => {
      const sp = (spaces.length ? spaces : seedSpaces(DEFAULT_USER.email)).find(x => x.id === space);
      const scoped = ((sp && sp.items) || []).filter(i => i.read);
      const sorted = window.circSortItems ? window.circSortItems(scoped, 'newest') : scoped;
      const target = sorted[index];
      const C = window.CircCandidate;
      if (target && C && C.goToCard) C.goToCard({ id: target.id });
    }, 160);
  };

  // The card row before run 10 folded it into a menu (BIZ-136 run 10). Kept
  // reachable rather than argued about: the row went from three actions on
  // Active and four on Read to two on both, and a swap of a shipped pattern is
  // overruled by looking at it rather than by reading a ruling. Sets the flag
  // FeedCard reads; every other stager clears it (see clearLegacyRow above).
  const stageLegacyRow = ({ tab = 'read' } = {}) => {
    stageSort({ space: 'sp-backend', tab, order: 'newest', saved: tab === 'read' ? [0, 2] : [] });
    // After stageSort, which clears it along with every other route settle.
    setTimeout(() => { window.circCardRowLegacy = true; setDensity(d => d); }, 60);
  };

  // A circle's description (BIZ-136 run 10). The seed gives two circles one and
  // leaves the rest without, so the home's fallback is visible with no staging
  // at all — these two stage the cases the seed cannot: a description at the
  // full 250-character cap, and the members surface reading one whole.
  const CIRC_LONG_DESC = 'A place for the long reads none of us get through in a week — systems writing, post-mortems, the occasional essay that has nothing to do with work but everything to do with how we think about it. Drop it here and come back when you have an hour.';
  const stageCircleDescription = ({ long = false, members = false, bare = false } = {}) => {
    setUser(DEFAULT_USER);
    const base = spaces.length ? spaces : seedSpaces(DEFAULT_USER.email);
    const s = base.filter((sp) => !/^TEST\b/i.test(sp.name || '')).map((sp) => (sp.id === 'sp-backend'
      ? { ...sp, funded: true, dormancy: null, champion: 'You', championEmail: DEFAULT_USER.email,
          ...(long ? { description: CIRC_LONG_DESC } : null) }
      : sp));
    setSpaces(s);
    clearFeedError(); clearLegacyRow();
    setLoadingFeed(false);
    if (members) { setCurrentId('sp-backend'); setTab('active'); setRoute('members'); return; }
    if (bare) { setCurrentId('sp-book'); setTab('active'); setRoute('members'); return; }
    setCurrentId(null); setRoute('home');
    if (setHomeStripOpen) setHomeStripOpen(true);
  };

  // The home's micro dot, staged by name. The dot means `unseen` — a card
  // landed in the circle since the member last met its Active feed (ui.md
  // Decision-29), which is exactly "this circle has a new card". The behaviour
  // already shipped; nothing was addressable for it, so it could not be checked
  // by looking.
  // Staged as a CONTRAST rather than a single lit row: one circle with a card
  // that arrived and has not been met, two without, so the dot's absence reads
  // as deliberate rather than as a rendering failure. The underlying items are
  // made consistent with the flag — a lit dot over an all-read circle would be
  // a fixture asserting something the product never does.
  const stageCircleMicro = () => {
    setUser(DEFAULT_USER);
    const base = seedSpaces(DEFAULT_USER.email).filter((sp) => !/^TEST\b/i.test(sp.name || ''));
    const s = base.map((sp) => {
      if (sp.id === 'sp-backend') {
        return { ...sp, funded: true, dormancy: null, unseen: true,
          items: sp.items.map((i, n) => (n === 0 ? { ...i, read: false } : i)) };
      }
      return { ...sp, unseen: false,
        items: sp.items.map((i) => ({ ...i, ...(i.talkSeenAt ? { talkSeenAt: Date.now() } : null) })) };
    });
    setSpaces(s);
    clearFeedError(); clearLegacyRow();
    setLoadingFeed(false);
    setCurrentId(null); setRoute('home');
    if (setHomeStripOpen) setHomeStripOpen(true);
  };

  return {
    setSpaces, setUser, setCurrentId, setRoute, setOtc, setPostAuthTo, setManageIntent,
    openCreateSpace, reset, goSpace, stageDormant, stageFunding, stageNonChampion,
    stageNoChampion, goFeedLoading, holdInterstitial, goEmptyFeed, goFullSpaceManage,
    stageSort, stageSingleItem, stageNotFound, stageHome, stageSharedCard,
    stageLegacyRow, stageCircleDescription, stageCircleMicro,
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
  { group: 'Candidate build \u2014 superseded shapes', id: 'sort-menu-open', label: 'Sort \u2014 now folded into the lens', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', menu: true }) },
  // THE RULING, made visible as a PAIR — drawn in both orders again as of
  // 2026-09-11 (Joe's own reversal of Sally's same-day call that it should
  // draw newest-first only). Same circle, same mark, one difference: the
  // sort. Open them in order — the waterline is there in both, at the SAME
  // mark, because the mark is visit state and a sort change never touches
  // it; only which end of the list you meet it from changes. The label stays
  // fixed `Earlier` in both, which Joe knows may not read true of the pile
  // beneath it under oldest-first — parked deliberately, his own candidate
  // words to follow.
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-waterline-newest', label: 'Waterline \u2014 under newest first (the control)', stage: (c) => c.stageSort({ space: 'sp-book', tab: 'active', order: 'newest', waterline: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-oldest-waterline', label: 'Waterline \u2014 same mark, read from the other end', stage: (c) => c.stageSort({ space: 'sp-book', tab: 'active', order: 'oldest', waterline: true }) },
  // Arrivals staged UNDER oldest-first, then accepted (reworded 2026-09-11,
  // three times the same day — the requirement this state first showed was
  // reversed, then the carry it grew in that reversal was reversed too, then
  // Joe overruled his own reversal of the carry: the same pill carrying the
  // member under one order and not the other was the order-dependent
  // inconsistency he had been objecting to all along). The pill still does
  // not touch the sort: tapping it leaves the order exactly as it was, and
  // the two arrivals land in sorted position — the FOOT, under oldest-first
  // — below the waterline still drawn at its own unmoved mark. What's back
  // is the carry: the member IS taken to the arrivals, same as
  // `sort-waterline-newest` — the difference between the two states is
  // which end of the list that carry lands on, not whether it happens.
  // Known, accepted cost of the foot case: a long, unanchored glide past
  // whatever backlog sat between the member and the foot.
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-oldest-accept', label: 'Arrivals under oldest first \u2014 the pill carries you to the foot', stage: (c) => c.stageSort({ space: 'sp-book', tab: 'active', order: 'oldest', waterline: true, pendingCount: 2 }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-read-oldest', label: 'Read pile from the beginning', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', order: 'oldest', otherTab: { tab: 'active', order: 'newest' } }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'sort-single-item', label: 'One link \u2014 no sort control', stage: (c) => c.stageSingleItem() },
  // Run 2 \u2014 the contributor filter, folded with sort into one lens control.
  { group: 'Candidate build \u2014 feed enhancement', id: 'lens-panel-open', label: 'The lens \u2014 one control, order and who', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', menu: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'filter-contributor', label: 'Filtered to one contributor', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', who: 'Sam R.' }) },
  // Priya's two Active links sit either side of the last-visit mark, so the
  // waterline still draws inside the filtered list \u2014 the ruling this state exists
  // to show, in either sort order (both-orders-again, 2026-09-11).
  { group: 'Candidate build \u2014 feed enhancement', id: 'filter-waterline', label: 'Waterline \u2014 drawn inside a filter', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', who: 'Priya N.', waterline: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'filter-former-member', label: 'Former member \u2014 the one shared bucket', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', who: 'former member' }) },
  // The lens is held per circle, so it survives the hop to Read. Dev K. has one
  // link in this circle and it is unread, so Read under their lens is genuinely
  // empty \u2014 the zero-match register, which is a different thing from an empty
  // Read pile and says so.
  { group: 'Candidate build \u2014 feed enhancement', id: 'filter-no-match', label: 'Nothing matches the lens', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', who: 'Dev K.' }) },
  // Order AND contributor both off their defaults — and, since the ruling of
  // 2026-09-07, the state that shows the chip row saying ONE thing rather than
  // two. The order redraws and so discloses nothing; only the contributor
  // conceals, so only the contributor gets a chip. The label names what is
  // APPLIED, which is still both; what it demonstrates is what the row does
  // with that. Id untouched — an id is an address.
  { group: 'Candidate build \u2014 feed enhancement', id: 'lens-both-applied', label: 'Order and contributor \u2014 one chip, not two', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'oldest', who: 'former member' }) },
  // Run 3 \u2014 density (Comfortable/Compact) + the lens panel's visual rework.
  { group: 'Candidate build \u2014 feed enhancement', id: 'density-compact', label: 'Compact \u2014 more of the circle in view', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', density: 'compact' }) },
  // Same circle and tab as density-compact, comfortable instead \u2014 open the two
  // back to back to see the metric change alone, nothing else moving.
  { group: 'Candidate build \u2014 feed enhancement', id: 'density-comfortable', label: 'Comfortable \u2014 the default rhythm', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', density: 'comfortable' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'view-panel-open', label: 'The lens \u2014 display above, filter below', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest', menu: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'density-compact-waterline', label: 'Compact \u2014 the waterline still reads', stage: (c) => c.stageSort({ space: 'sp-book', tab: 'active', order: 'newest', density: 'compact', waterline: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'density-compact-read', label: 'Compact \u2014 the Read pile', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', density: 'compact' }) },
  // Run 4 \u2014 the saved state and its surface.
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-marks', label: 'Saved \u2014 read cards kept, the state held in the card menu', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2] }) },
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
  // both saved and filtering to her gives a genuinely non-empty composition of
  // all three narrowings — Order (oldest), Added by (Priya N.), Saved — of
  // which TWO now carry chips: the order conceals nothing and lost its chip in
  // the ruling of 2026-09-07.
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
  // at 1280 and falls back to a single column at 390 \u2014 both are correct.
  // The panel open on three options, which is the control change itself.
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
  // Run 9: these three stopped being a PROPOSAL and became the app. Their ids
  // are unchanged \u2014 an id is an address and renaming one breaks every link
  // already written to it \u2014 but "Reading A" is gone from the labels, because
  // there is no longer a Reading B beside it on the shipped path to be read
  // against. They now say what they show.
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-lens-door', label: 'Saved is a lens \u2014 the door open, all four groups', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedMode: 'lens', menu: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-lens-applied', label: 'Saved on \u2014 the bar carries no bookmark', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedOn: true, savedMode: 'lens' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'saved-lens-composed', label: 'Saved and a contributor, both set from the one door', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedOn: true, who: 'Priya N.', savedMode: 'lens' }) },
  // The shape run 9 replaced, kept openable on purpose. The pick was made from
  // a side-by-side, so the way back has to stay a side-by-side: this is the
  // bookmark on the tab bar, three icons and all, to be overruled by looking
  // rather than by reading an argument about it.
  { group: 'Candidate build \u2014 superseded shapes', id: 'saved-bar-superseded', label: 'Superseded \u2014 saved as a bookmark on the tab bar', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedOn: true, savedMode: 'bar' }) },
  { group: 'Candidate build \u2014 superseded shapes', id: 'saved-tab', label: 'Reading B \u2014 saved as its own tab, populated', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedMode: 'surface', finalTab: 'saved' }) },
  { group: 'Candidate build \u2014 superseded shapes', id: 'saved-tab-empty', label: 'Reading B \u2014 the Saved tab, nothing kept yet', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [], savedMode: 'surface', finalTab: 'saved' }) },
  { group: 'Candidate build \u2014 superseded shapes', id: 'saved-tab-read', label: 'Reading B \u2014 the Read tab, carrying no saved control at all', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], savedMode: 'surface' }) },
  { group: 'Candidate build \u2014 superseded shapes', id: 'saved-tab-composed', label: 'Reading B \u2014 the Saved tab under a contributor lens', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', saved: [0, 1, 2], who: 'Priya N.', savedMode: 'surface', finalTab: 'saved' }) },

  // ---- Run 8 \u2014 Home as a shared surface, and the cross-circle returns strip --
  // The home screen (app/home.jsx + app/home-returns.jsx) and the "Go home"
  // fix on every dead-end route. All seven land here, per this group's own
  // rule: not reachable from this list, not shipped.
  { group: 'Candidate build \u2014 feed enhancement', id: 'home-landing', label: 'Home \u2014 landing, two circles talking', stage: (c) => c.stageHome({}) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'home-quiet', label: 'Home \u2014 quiet, caught up', stage: (c) => c.stageHome({ quiet: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'home-crowded', label: 'Home \u2014 five circles talking, the strip at its ceiling', stage: (c) => c.stageHome({ crowd: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'home-strip-open', label: 'Home \u2014 the returns strip opened (the alternative)', stage: (c) => c.stageHome({ open: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'home-one-circle', label: 'Home \u2014 a single circle', stage: (c) => c.stageHome({ only: 'sp-backend' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'home-asleep', label: 'Home \u2014 a dormant circle among the others', stage: (c) => c.stageHome({ sleep: 'sp-book' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'home-no-circles', label: 'Home \u2014 no circles yet (NoSpaceHome)', stage: (c) => c.stageHome({ empty: true }) },
  { group: 'Candidate build \u2014 superseded shapes', id: 'not-found-home', label: 'Not found \u2014 Go home now goes home', stage: (c) => c.stageNotFound() },
  // ---- Sharing a card (wild feature, 2026-09-07) --------------------------
  // The two ends of one address. A shared card link means "this card", and what
  // the follower meets depends on THEIR OWN read-state — not on anything the
  // sharer chose. Open them as a pair; the difference between them is the whole
  // design.
  //
  // The third end has no entry of its own on purpose: a follower who is not in
  // the circle, or whose card has been deleted for everyone, meets
  // `not-found-home` directly above. That page already refuses to say which of
  // those it was, which is the privacy answer, and a second copy of it staged
  // under a sharing label would imply it is a different screen.
  { group: 'Candidate build \u2014 feed enhancement', id: 'share-arrival-unread', label: 'Shared card \u2014 they have not read it', stage: (c) => c.stageSharedCard({ read: false, index: 2 }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'share-arrival-read', label: 'Shared card \u2014 they have read it (Overview)', stage: (c) => c.stageSharedCard({ read: true }) },

  // The card's action row, folded into one door (BIZ-136 run 10). The row went
  // from three actions on Active and four on Read to two on both: the posture
  // action stays out, everything occasional goes behind the kebab. There is no
  // state that stages the MENU open \u2014 it is opened by a tap, and a fixture that
  // forced it would be staging an interaction rather than a screen. Tap the
  // trailing dots on any card in the first two entries to see it.
  { group: 'Candidate build \u2014 feed enhancement', id: 'card-row-active', label: 'The card row \u2014 two actions on Active', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'active', order: 'newest' }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'card-row-read', label: 'The card row \u2014 Read, and the saved mark that stayed', stage: (c) => c.stageSort({ space: 'sp-backend', tab: 'read', order: 'newest', saved: [0, 2] }) },
  { group: 'Candidate build \u2014 superseded shapes', id: 'card-row-superseded', label: 'Superseded \u2014 the row before it was folded', stage: (c) => c.stageLegacyRow({ tab: 'read' }) },

  // A circle can say what it is for (BIZ-136 run 10). The seed carries a
  // description on two circles and none on the rest, so `home-landing` already
  // shows both halves of the rule; these stage what the seed cannot.
  { group: 'Candidate build \u2014 feed enhancement', id: 'circle-description-members', label: 'Circle description \u2014 read whole, where it is edited', stage: (c) => c.stageCircleDescription({ members: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'circle-description-absent', label: 'Circle description \u2014 the header of a circle that wrote none', stage: (c) => c.stageCircleDescription({ bare: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'circle-description-long-members', label: 'Circle description \u2014 at the cap, read whole on the header', stage: (c) => c.stageCircleDescription({ long: true, members: true }) },
  { group: 'Candidate build \u2014 feed enhancement', id: 'circle-micro-new-card', label: 'Home \u2014 the micro on a circle that has a new card', stage: (c) => c.stageCircleMicro() },
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
