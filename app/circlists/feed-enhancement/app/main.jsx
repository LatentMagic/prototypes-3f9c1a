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
// v13: the seed drops Backend Pod from eleven members to ten (the cap is hard —
// hld.md Decision-15 — so eleven was staging a state the product forbids, and it
// rendered "11 of 10 members" on the members header). `spaces` is persisted, so
// without this bump a returning visitor restores the eleven-member circle and the
// fix is invisible to the one person it was made for. Same reasoning as
// circlists-a3.html's own v1 -> v2 bump, for the same circle.
const STATE_KEY = window.CIRC_STATE_KEY || 'circ_state_v13';
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
  // Routes that are DEAD ENDS: full-page notices a member is sent to, never a
  // place they chose to be. `route` is persisted (see the effect below), so
  // without this a member who lands on one — or a reviewer who opens its staged
  // state — has it written to localStorage, and their NEXT plain visit boots
  // straight back onto "Page not found." with nothing saying why. The state is
  // still perfectly reachable: a stager sets the route after boot, so only the
  // RESTORE path is filtered. Pre-existing for the two invite notices; the
  // not-found page would have been the third.
  const CIRC_UNRESUMABLE = ['not-found', 'invalid-invite', 'space-full'];
  // A fresh session (nothing stored) lands on home — home is a shared surface
  // now, not an app-only chrome state (feed-enhancement candidate build, per
  // MOBILE.md's promotion test). A RESTORED session goes back exactly where it
  // was, circle included: only the no-stored-route case falls to 'home'.
  const INITIAL_ROUTE = CIRC_UNRESUMABLE.includes(SAVED?.route) ? 'space' : (SAVED?.route || 'home');
  const [route, setRoute] = useState(INITIAL_ROUTE);
  const [user, setUser] = useState(SAVED?.user || DEFAULT_USER);
  const [spaces, setSpaces] = useState(SAVED?.spaces || seedSpaces(DEFAULT_USER.email));
  // A fresh 'home' landing has to pair with NO current circle — goHome() itself
  // never sets one either. Without this, a first-ever visit opened on home
  // while currentId still defaulted to 'sp-backend', so the rail read Backend
  // Pod as the ALREADY-ACTIVE circle and a click on it ran the refresh gesture
  // instead of entering it — a real dead click, caught only by driving it.
  // Home NEVER pairs with a current circle — which is what goHome() already
  // guarantees, so the rule belongs here too rather than only on a cold boot.
  // The first version of this guard read `!SAVED && INITIAL_ROUTE === 'home'`
  // and closed only the first-ever visit: goHome() persists currentId as null,
  // so on the NEXT load SAVED exists, the guard falls through, and `||` coerces
  // that persisted null straight back to 'sp-backend'. The rail then marks a
  // circle active while the member is standing on home, and RailBody routes a
  // click on an active circle to the refresh gesture instead of entering it —
  // a dead click on the landing screen, for every returning member. No staged
  // state could show it, because every stager sets currentId explicitly.
  const [currentId, setCurrentId] = useState(
    INITIAL_ROUTE === 'home' ? null : (SAVED?.currentId || 'sp-backend')
  );
  // 'saved' is NOT resumable, for exactly the reason `CIRC_UNRESUMABLE` above
  // exists (BIZ-136 run 7). `tab` is persisted; `savedMode` is visit state and
  // is not — so after looking at Reading B once, the next bare load restores
  // `tab: 'saved'` into a `savedMode: 'bar'` render, where the Saved tab does
  // not exist. The bar then shows Active and Read with NEITHER selected, and
  // the bookmark toggle vanishes too, because its own gate wants `tab ===
  // 'read'`. That is the SHIPPED shape of the app rendering broken, on the
  // second visit rather than the first, purely because a candidate reading was
  // looked at once — and it is the control arm of the comparison this whole
  // build exists to make fair.
  //
  // Restored as 'read', not 'active': the Saved tab shows read links, so Read
  // is where the member actually was. Only the RESTORE path is filtered — a
  // stager sets the tab after boot, so every `?state=` entry still works.
  const [tab, setTab] = useState(SAVED?.tab === 'saved' ? 'read' : (SAVED?.tab || 'active'));

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
  // The feed region's own load-failure (feed-enhancement candidate build).
  // Separate from loadingFeed rather than a third value on it: a failed fetch
  // is a state the region can SIT in (the member reads it, decides to retry),
  // where loading is a state it only ever passes through, and collapsing the
  // two would make "no longer loading" ambiguous between "succeeded" and
  // "gave up" everywhere loadingFeed is already read as a boolean.
  const [feedError, setFeedError] = useState(false);
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
  // funding flow: { mode: 'new' | 'refund', name, description, spaceId }
  const [fundFlow, setFundFlow] = useState({ mode: 'new', name: '', description: '', spaceId: null });
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
  // Saved filter (feed-enhancement candidate build). Keyed by circle alone,
  // same as lensWho and for the same reason: "show me what I've kept" is a
  // question about the circle, not about which tab you happen to be on.
  // VISIT STATE, never persisted — like sortOrder/lensWho, a narrowed view is
  // a reading posture for this session, not a preference that silently
  // outlives it. The saved FLAG on an item is the opposite: it lives on
  // `spaces` below, because it is a fact about the link, not a lens on it.
  const [savedOn, setSavedOn] = useState({});
  // Saved mode (BIZ-136 run 7, two readings of "saved"): 'bar' (shipped,
  // default) · 'lens' (Reading A — saved joins the lens popover) · 'surface'
  // (Reading B — saved is its own tab). VISIT STATE, never persisted, same
  // reasoning as sortOrder/lensWho/savedOn above.
  //
  // 'lens' IS THE DEFAULT AS OF BIZ-136 run 9, and that is a ratification, not
  // a preference. Run 7 built both readings live and deep-linked so the owner
  // could pick by looking rather than by reading an argument; he did, in one
  // line — "It should be a filter. A." So saved is no longer a bookmark sitting
  // on the tab bar beside two unrelated icons; it is a narrowing reached from
  // the one door the other narrowings already share, and the chip it leaves
  // leads back to that door instead of dead-ending.
  //
  // 'bar' AND 'surface' BOTH REMAIN REACHABLE, deliberately. He chose A from a
  // side-by-side comparison, not from living with a four-group panel on a
  // phone — so if he reverses on return, that is a one-word change here rather
  // than a rebuild. `saved-bar-superseded` (app/states.jsx) is the shape this
  // replaced, kept openable for exactly that reason.
  const [savedMode, setSavedMode] = useState('lens');
  // The deletable-aid contract, honoured ONCE here rather than at each of the
  // half-dozen places that read the mode (BIZ-136 run 7, from the review).
  // Gating each consumer on `savedMode` alone was a real breach, not a
  // theoretical one: drop feed-saved-readings.jsx with a stale 'surface' left
  // in a `?state=` link and there was no third tab, no tab selected, the feed
  // silently narrowed to the saved links with nothing naming it — and the one
  // escape button on the empty state was DEAD, because it wrote the stored
  // toggle that 'surface' does not read. The contract promises the PREVIOUS
  // behaviour, not merely "does not throw".
  // Both readings need the module, so one term covers both: without it the
  // mode collapses to 'bar'.
  // RUN 9 CHANGED WHAT THAT COLLAPSE MEANS, and the honest note is that it is
  // now weaker than it reads. While 'bar' was the shipped shape, dropping
  // feed-saved-readings.jsx degraded to the PREVIOUS behaviour, which is what
  // the deletable-aid contract promises. 'lens' is the shipped shape now, so
  // the same collapse resurrects a SUPERSEDED bookmark-on-the-bar instead.
  // Still coherent and still not a throw — every consumer below is internally
  // consistent under 'bar' — but it is a fallback to an older app rather than
  // to this one, and the contract's own words no longer describe it exactly.
  // Left as 'bar' deliberately: the alternative is no saved control at all
  // when the module goes, which is a worse answer than an older one.
  const savedModeReady = !!window.SavedTabEmptyState && !!window.CIRC_SAVED_LENS_OPTIONS
    && !!window.circFilterSaved;
  const effectiveSavedMode = savedModeReady ? savedMode : 'bar';
  // The MODE collapsing is not enough on its own: a stale `?state=saved-tab`
  // link stages `tab: 'saved'` directly, and with the module gone there is no
  // Saved tab for it to select — so the bar rendered Active and Read with
  // NEITHER lit. Same defect as the persisted-tab one above, reached by a
  // different route, and the same answer: 'saved' is not a tab this app has
  // unless the module says so. Corrected in state rather than papered over per
  // consumer, so everything keyed on `tab` downstream is simply right.
  React.useEffect(() => {
    if (!savedModeReady && tab === 'saved') setTab('read');
  }, [savedModeReady, tab]);
  // Search (feed-enhancement candidate build). Keyed `<circleId>:<tab>`, same
  // as sortOrder — Read only, so the key's tab half is always 'read' in
  // practice, but sharing the key shape rather than inventing a circle-only
  // one keeps this state and sortOrder reading as the same kind of thing at a
  // glance. VISIT STATE, never persisted — same reasoning as sortOrder's own
  // comment above: a typed query is a reading posture for this session, not a
  // preference that silently outlives it. `searchOpen` is the field's own
  // disclosure — a query can be non-empty with the field "closed" (nothing
  // moves it shut once typed; see feed-search.jsx's SearchField comment), so
  // the two are tracked separately rather than one implying the other.
  const [searchQuery, setSearchQuery] = useState({});
  const [searchOpen, setSearchOpen] = useState({});
  // Density (BIZ-136 run 3): ONE value for the whole feed surface — comfortable
  // or compact — never per tab or per circle. Unlike sortOrder/lensWho this IS
  // persisted (per device, in the app-state blob below): it is a reading
  // preference the member sets once, not a lens applied to one moment's view.
  const [density, setDensity] = useState(SAVED?.density === 'compact' ? 'compact' : 'comfortable');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  // Whether the home screen's cross-circle returns strip (feed-enhancement
  // candidate build, app/home-returns.jsx) is expanded. Controlled here, same
  // idiom as sortMenuOpen above, so a staged state can open it directly — the
  // strip has no circle context of its own to reset it against, so unlike the
  // per-circle bar it simply holds until the member (or a stager) changes it.
  // Open by default, which is the one place this screen departs from the bar it
  // reuses. On the feed the bar is a lead-in above a screen already full of
  // content, so collapsed is right. On the home it IS the content: collapsed,
  // the screen shows three circle names and hides every real thing behind a
  // 34px chevron. The design review put that against Things' Today, Linear's
  // Inbox and Basecamp's Home — all three put the items themselves on the
  // surface — and its verdict was that the collapsed screen would not hold its
  // own beside them while the expanded one would. The collapsed shape stays
  // reachable as its own state so the swap can be overruled by looking.
  const [homeStripOpen, setHomeStripOpen] = useState(true);
  // Timers and handlers read state through refs: a setSpaces updater cannot hand
  // values back to the handler that queued it.
  // A menu left open while the view changes underneath it would point at a list
  // that is no longer there, so switching tab or circle closes it.
  useEffect(() => { setSortMenuOpen(false); }, [tab, currentId]);
  const spacesRef = useRef(spaces); spacesRef.current = spaces;
  const currentRef = useRef(currentId); currentRef.current = currentId;
  const tabRef = useRef(tab); tabRef.current = tab;
  // Same reason as the three above. Arrivals no longer revert the sort (Joe's
  // reversal, 2026-09-11, of the same-day ruling that had them do so), so they
  // land in sorted position — the head under newest-first, the foot under
  // oldest-first — and the carry to them (below) has to know which, live, at
  // the moment it runs rather than from whatever render queued the gesture:
  // `refreshSpace` lands 900ms after the click that queued it, and a member
  // who flips the order WHILE the reload is running would otherwise point the
  // carry at the wrong end (this ref is what closed that race, design audit
  // finding 5, when it was still deciding whether to restore the order).
  const sortOrderRef = useRef(sortOrder); sortOrderRef.current = sortOrder;
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
  // Carry the member to the arrivals — wherever they actually landed, in
  // BOTH orders (Joe's call, 2026-09-11, overruling his own same-day
  // instinct that it should be newest-first only: the same control doing
  // two different things depending on the sort is exactly the order-
  // dependent inconsistency objected to all session, and it outweighs the
  // no-anchor-at-the-foot cost). `toFoot` reads the LIVE order at the moment
  // of the carry (see `sortOrderRef` above): under newest-first the arrivals
  // are at the head, under oldest-first — since accepting no longer reverts
  // the sort — they are at the foot. Not something Joe's ruling itself asked
  // for to begin with: it is Decision-29's own promise ("carrying the member
  // to them"), which the build had never kept in either order until this
  // pass; building it is my own read of that decision, flagged in the
  // report, his call to make throughout.
  //
  // INSTANT, not smooth (adversarial spec pass, 2026-09-11): the monorepo's
  // own `feed-view.component.ts` answers this same carry with a bare
  // `scrollTop = 0` and states why in its own comment — "smooth would be
  // motion the app invented." `behavior: 'smooth'` here was a prototype
  // defect against that decision, not a considered choice, and it is what
  // made the foot-carry measure as a long, sustained glide in an earlier
  // pass's report; instant, the distance costs nothing. The window scrolls
  // on web; the phone screen is the scroller in the app posture.
  const scrollToArrivals = (toFoot) => {
    const el = document.querySelector('.circ-phone-screen');
    const top = toFoot ? (el ? el.scrollHeight : document.documentElement.scrollHeight) : 0;
    if (el) el.scrollTo({ top });
    else window.scrollTo({ top });
  };

  // open Create-a-space fresh (clears any carried name + description)
  const openCreateSpace = () => { setFundFlow({ mode: 'new', name: '', description: '', spaceId: null }); setRoute('create-space'); };

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

  // ---- Arriving on a shared card (BIZ-136 wild feature) --------------------
  // `?card=<id>` is the address a share hands over. Resolved ONCE at mount,
  // against the member's own state — which is the whole design: the address
  // means "this card", and what this card looks like depends on whether the
  // person following it has read it.
  //
  //   not a member / deleted / no such card ──▶ not-found, which never says
  //       which of those it was (hld.md Decision-44). The privacy answer needed
  //       no new screen.
  //   they have read it                     ──▶ Overview, the card's own page.
  //   they have not                         ──▶ its circle, Active, pointed at.
  //
  // A staged `?state=` wins outright: that is the register's harness driving the
  // app, and two boot resolutions racing would make every staged state a
  // coin toss. Deletable — no card-share.jsx, no `circReadCardParam`, and an
  // incoming address falls through to the ordinary boot.
  const [pointedId, setPointedId] = useState(null);
  useEffect(() => {
    if (!window.circReadCardParam) return;
    try { if (new URL(window.location.href).searchParams.get('state')) return; } catch (e) { return; }
    const id = window.circReadCardParam();
    if (!id) return;
    const sp = spacesRef.current.find(s => (s.items || []).some(i => i.id === id));
    const item = sp && (sp.items || []).find(i => i.id === id);
    if (!sp || !item) { setRoute('not-found'); return; }
    setCurrentId(sp.id);
    if (item.read) {
      // Overview is reachable from a read card, so a follower who has read it
      // lands on the conversation. Guarded on the candidate module being
      // present, exactly as every other consumer of it is.
      const C = window.CircCandidate;
      setTab('read');
      if (C && C.goToCard) { C.goToCard({ id }); return; }
    }
    setTab('active');
    setRoute('space');
    setPointedId(id);
  }, []);

  // ---- HOW LONG THE MARK LIVES (ruled by Joe, 2026-09-10) -------------------
  //
  // **One visit to the surface it pointed at.** It says "this is the one you
  // were sent", and that stops being news when the member has either engaged
  // with the card or left the surface — not before.
  //
  //   survives   scrolling, and a glance away. Scrolling is LOOKING for it, not
  //              being done with it, and the mark's whole job is to hold your
  //              place in a feed you did not choose to be in.
  //   clears     acting on the card — opening the link, marking it read,
  //              opening the card's own menu (feed.jsx's `onAct`).
  //   clears     changing surface — another tab, the Read tab included, or
  //              another route: settings, members, home, a card's Overview.
  //   never      survives a reload. Already true, and kept true: the address it
  //              came from was cleaned out of the bar when it was read.
  //
  // It biases LATE deliberately. Clearing late costs a stale bar for a minute;
  // clearing early costs the member their place, which is the very thing the
  // mark exists to hold. That rules out both ends: a click anywhere is too
  // jumpy, and clearing only on reload lets the mark outlive the visit and start
  // lying about why you are there.
  //
  // A consequence worth knowing, because it is what earns the fade in
  // card-share.jsx: since leaving the surface clears it, the only clear a member
  // ever SEES happen is the one where they acted on the card.
  const clearPointed = useCallback(() => setPointedId(null), []);

  // The surface a point belongs to, captured when the point is set rather than
  // read from a route the member may already have left. Declared before the
  // clear-on-leave effect below so it is captured first on the render that sets
  // the point — otherwise the point would clear itself on arrival.
  const pointedOnRef = useRef(null);
  useEffect(() => {
    pointedOnRef.current = pointedId ? { route, tab, currentId } : null;
  }, [pointedId]);

  // Leaving the surface clears the point. Circle counts as surface alongside
  // route and tab: a member who switches circles is no longer anywhere near the
  // card, and returning later to a bar still lit would be the mark lying about
  // why they are there.
  useEffect(() => {
    const on = pointedOnRef.current;
    if (!pointedId || !on) return;
    if (on.route !== route || on.tab !== tab || on.currentId !== currentId) clearPointed();
  }, [route, tab, currentId, pointedId, clearPointed]);

  // Bring it into view. A member sent to a card 30 rows down should not have to
  // find it — that is the one thing an address has to do that scrolling to the
  // top does not. Deferred to the frame after the feed has settled, because the
  // card does not exist in the document until then, and `block: 'center'` so it
  // lands mid-screen with the feed visible around it rather than jammed under
  // the tab bar. Runs once per point; smooth unless the member asked for less
  // motion, in which case it jumps, like every other movement in this app.
  useEffect(() => {
    if (!pointedId || loadingFeed) return;
    const t = setTimeout(() => {
      const el = document.querySelector('[data-card-id="' + (window.CSS && CSS.escape ? CSS.escape(pointedId) : pointedId) + '"]');
      if (!el) return;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }, 120);
    return () => clearTimeout(t);
  }, [pointedId, loadingFeed]);

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
  //
  // DOES NOT TOUCH THE SORT (Joe's reversal, 2026-09-11, of Sally's same-day
  // ruling that it should restore newest-first). Arrivals land in sorted
  // position like anything else — `circSortItems` places them by their own
  // `at`, so under oldest-first that is the foot, not the head. Nothing here
  // rewrites `sortOrder` and nothing is announced; there is no order change to
  // report.
  const revealPending = () => {
    const id = currentRef.current;
    const sp = spacesRef.current.find(s => s.id === id);
    if (!sp || !(sp.pending || []).length) return;
    const ids = sp.pending.map(i => i.id);
    setSpaces(prev => prev.map(s => s.id === id
      ? { ...s, items: [...s.pending, ...s.items], pending: [], lastSeenAt: Date.now() } : s));
    setArrived(a => [...a, ...ids]);
    setTimeout(() => setArrived(a => a.filter(x => !ids.includes(x))), 900);
    // Carries the member to wherever the arrivals actually landed — see
    // `scrollToArrivals`'s own header for why this exists and whose call it is.
    const sortKey = id + ':active';
    const toFoot = (sortOrderRef.current[sortKey] || window.CIRC_SORT_DEFAULT || 'newest') === 'oldest';
    requestAnimationFrame(() => scrollToArrivals(toFoot));
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
      // DOES NOT TOUCH THE SORT, same reversal as `revealPending` above: a
      // refresh that finds arrivals lands them in sorted position and leaves
      // `sortOrder` alone, on this circle's Active tab or anywhere else.
      const landingHere = found.length && here && onActive;
      if (found.length || gone.length) setSpaces(prev => prev.map(s => {
        if (s.id !== id) return s;
        return { ...s, items: [...found, ...s.items.filter(i => !gone.includes(i.id))],
          queued: [], pending: [], remoteDeleted: [],
          lastSeenAt: found.length ? Date.now() : s.lastSeenAt,
          // Arrivals always enter unread, so a refresh made from Read lands them on
          // Active, out of sight: the dot carries them, and clears on arrival there.
          unseen: (found.length && here && !onActive) ? true : s.unseen };
      }));
      // Carried to wherever the arrivals actually landed, only when there are
      // any — scrolling on an empty refresh would move the member for
      // nothing. Order read live off the ref, not this closure, so a member
      // who flips the sort while the reload is running still gets carried to
      // the end that is actually true when it lands.
      if (landingHere) {
        const sortKey = id + ':active';
        const toFoot = (sortOrderRef.current[sortKey] || window.CIRC_SORT_DEFAULT || 'newest') === 'oldest';
        requestAnimationFrame(() => scrollToArrivals(toFoot));
      }
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
  // Save toggle (feed-enhancement candidate build). Read-only chrome, so a
  // flip never touches `read` — it walks spaces/items the same way markRead
  // does, above, flipping just the one flag. The announcement fires here,
  // against the item's PRE-flip state (the closure still holds it), since the
  // updater above only runs later inside React's own batch.
  const toggleSaved = (item) => {
    setSpaces(prev => prev.map(s => s.id === currentId
      ? { ...s, items: s.items.map(i => i.id === item.id ? { ...i, saved: !i.saved } : i) }
      : s));
    announceOnce(item.saved ? 'Removed from saved' : 'Saved');
  };
  const deleteItem = (item) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, items: s.items.filter(i => i.id !== item.id) } : s));
  const inviteEmail = (email) => setSpaces(prev => prev.map(s => s.id === currentId ? { ...s, members: [...s.members, M(email.split('@')[0].replace(/\b\w/g, c => c.toUpperCase()) + ' ', email)] } : s));
  // Edit — name (unchanged) plus the optional description (CIRC-020's champion
  // gate now covers both). Whitespace-only description trims to nothing and
  // stores as never-set, exactly like an empty one.
  const editSpace = (name, description) => setSpaces(prev => prev.map(s => s.id === currentId
    ? { ...s, name, description: (description && description.trim()) ? description.trim() : undefined } : s));
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
  // Carries description alongside name so CIRC-007 AF-02's return-to-revise
  // trip (create -> funding -> back) brings it back too.
  const beginCreateFund = (name, description) => { setFundFlow({ mode: 'new', name, description, spaceId: null }); setRoute('funding'); };
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
      description: fundFlow.description ? fundFlow.description : undefined,
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
      // Signing in lands on the home, whatever circles you hold. Ruling 89 is
      // unconditional, and until this line it was true only of a cold boot with
      // nothing stored — every actual auth path still entered a circle, so the
      // slice claimed a landing it did not make. goHome() clears currentId too,
      // so the rail does not mark a circle active behind the home.
      goHome();
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
        setSpaces, setUser, setCurrentId, setTab, setRoute, setLoadingFeed, setFeedError, setHoldLoading,
        setOtc, setPostAuthTo, setManageIntent,
        enterSpace, openCreateSpace,
        setSortOrder, setSortMenuOpen, setDividerAt, setLensWho, setDensity, setSavedOn,
        setSearchQuery, setSearchOpen, setSavedMode, setHomeStripOpen, setPointedId,
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
    screen = <GoogleReturn onDone={holdLoading ? () => {} : () => { if (postAuthTo === 'post-signup') { setSpaces([]); setCurrentId(null); } goHome(); }} />;
  } else if (route === 'recovery') {
    screen = <Recovery onDone={goHome} onBackToSignin={() => setRoute('signin')} />;
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
    screen = <CreateSpace onCreate={beginCreateFund} initialName={fundFlow.name} initialDescription={fundFlow.description} canCancel={spaces.length > 0} onCancel={exitToApp} />;
  } else if (route === 'invalid-invite') {
    screen = <InvalidInvite onHome={goHome} />;
  } else if (route === 'space-full') {
    screen = <SpaceFull onHome={goHome} />;
  } else if (route === 'not-found') {
    // The 404's "Go home" button had no home to reach (`goSpace` is not
    // defined anywhere in this file — a plain ReferenceError on click, not
    // merely a wrong target). `goHome` is the real, defined action, and now
    // that home is a shared surface it is also the RIGHT one to reach for
    // every dead-end route on this page, not only this one. Closes the
    // founder-reported defect: "the 404 includes a go-home button that does
    // nothing currently. There is no home."
    screen = window.CircNotFound
      ? <window.CircNotFound onHome={goHome} />
      : null;
  } else if (Cand && Cand.matchRoute && Cand.matchRoute(route)) {
    // Candidate-build route (e.g. a card's own surface). The overlay hands back
    // the body and the shell opts; the chrome is still inShell's.
    const r = Cand.renderRoute(route, candApi);
    screen = inShell(r.body, r.opts || {});
  } else if (route === 'members') {
    screen = inShell(<MembersSurface space={space} isChampion={isChampion(space)} championName={space ? space.champion : ''}
      onInvite={inviteEmail} onManageFunding={openManageFunding} onCancelFunding={() => setConfirm({ kind: 'cancel-funding' })}
      onResumeFunding={resumeFunding}
      onEdit={editSpace} onRemoveMember={removeMember} onLeave={() => setConfirm({ kind: 'leave', spaceId: currentId })}
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
        ? <CirclesHomeBody spaces={listSpaces} onSelect={enterSpace} onCreate={gateActive ? onGate : openCreateSpace}
            stripOpen={homeStripOpen} onToggleStrip={setHomeStripOpen} />
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
      // TWO PREDICATES, deliberately (BIZ-136, ruling of 2026-09-07).
      // `lensActive` is CONCEALMENT — cards are being hidden — and it is what
      // suppresses the feed lead, because a lead counting things above a
      // narrowed feed reads as broken. Sorting oldest-first hides nothing, so
      // the lead correctly survives it now; it did not before.
      // `lensOffDefault` is "anything in the door is off its default", and it
      // exists for exactly one job below: keeping the door reachable.
      const lensActive = Lens ? window.circLensActive(order, who) : false;
      const lensOffDefault = Lens && window.circLensNonDefault
        ? window.circLensNonDefault(order, who) : lensActive;
      const sorted = (Lens && window.circSortItems) ? window.circSortItems(stored, order) : stored;
      const lensed = Lens ? window.circFilterItems(sorted, who) : sorted;
      // Offered from the whole circle, so the set does not reshuffle by tab.
      const contributors = Lens ? window.circContributors(space) : [];
      const pendingVisible = Lens ? window.circFilterItems(pending, who) : pending;
      // ---- Saved (feed-enhancement candidate build) ------------------------
      // A deletable aid, same idiom as Lens above: no feed-saved.jsx ⇒ no
      // toggle, no chip, no filter. Held per CIRCLE (see savedOn's own
      // declaration) — same reasoning as `who`, not repeated here.
      // Composed AFTER the lens, per the ruling: both can be on at once, and
      // narrowing to one contributor's saved links is exactly what "compose"
      // has to mean, not "replace".
      const Saved = window.circFilterSaved || null;
      const savedOnFlag = !!savedOn[currentId];
      // `effectiveSavedOn` (run 7): the narrowing this render actually applies,
      // which under 'surface' is NOT the stored toggle at all — it is simply
      // whether the member is standing on the Saved tab. Every consumer below
      // that used to read `savedOnFlag` directly (the filter itself, the
      // zero-match copy, the discourse lead's suppression) reads this instead,
      // so Reading B's tab narrows the list without a toggle ever existing to
      // flip. Under 'bar'/'lens' this is exactly `savedOnFlag`, unchanged.
      // Run 9: `&& tab === 'read'`. Saving is read-only by ruling — a card can
      // only be saved from Read — so "saved" is a lens over the Read pile and
      // over nothing else. Applied tab-blind, the stored per-circle flag also
      // narrowed ACTIVE by a mark no Active card can carry, emptying the tab
      // with nothing on screen explaining it. Under 'bar' that was hard to
      // reach, because the only toggle lived on Read; making saved a lens put
      // it one tap from Active and turned a latent fault into a reachable one.
      // Fixed here rather than deferred: it renders inside the surface this
      // run is asking to be judged.
      const effectiveSavedOn = effectiveSavedMode === 'surface'
        ? tab === 'saved'
        : (savedOnFlag && tab === 'read');
      const savedFiltered = Saved ? Saved(lensed, effectiveSavedOn) : lensed;
      // Whole-circle, unfiltered by the lens: "the circle holds a saved link"
      // is a fact about the circle, not about the current narrowing, and the
      // toggle's presence rule (render site, below) reads it that way.
      const hasSaved = !!(window.circHasSaved && window.circHasSaved(readItems));
      // Read only — a ruled product decision (see feed-saved.jsx's header) —
      // not loading, and present either because there is something to find or
      // because the filter is already on: turning it off must stay reachable
      // even after unsaving the last link it was showing.
      // `savedMode === 'bar'` (run 7): under Reading A/B the bookmark toggle
      // leaves the tab bar outright — saved is reached from the lens door or
      // from its own tab instead, never both places at once.
      const showSaved = effectiveSavedMode === 'bar' && !!window.SavedToggle && tab === 'read' && !loadingFeed
        && (hasSaved || savedOnFlag);
      // Run 9: the SAME presence rule, for the lens group that replaced the
      // toggle. Reading A moved saved behind the door and silently dropped
      // every gate the bar toggle carried — so the Saved group appeared on
      // ACTIVE, where nothing can be saved; while the feed was still loading;
      // and in a circle where the member has never saved anything, offering a
      // narrowing guaranteed to match nothing.
      //
      // The third clause is the one worth keeping deliberately. Run 4 called it
      // the region's third state, after "present" and "present and applied":
      // NOT YET EARNED — the control does not exist until the member has made
      // its reason to exist. That principle was recorded as a region rule and
      // would have been lost by moving the control, which is exactly the kind
      // of thing an audit of the whole picture is for catching.
      const showSavedLens = effectiveSavedMode === 'lens' && tab === 'read' && !loadingFeed
        && (hasSaved || savedOnFlag);
      const setSavedFilter = (next) => {
        setSavedOn((prev) => ({ ...prev, [currentId]: next }));
        announceOnce(next ? 'Showing saved links' : 'Showing all read links');
      };
      const savedToggle = showSaved
        ? <window.SavedToggle on={savedOnFlag} onToggle={setSavedFilter} />
        : null;
      // ---- Search (feed-enhancement candidate build) -----------------------
      // A deletable aid, same idiom as Lens/Saved above: no feed-search.jsx ⇒
      // no trigger, no field, no filter, and searchQueryVal below is always ''
      // (Search stays null, so circFilterSearch's guard never runs).
      // Composed LAST, after saved — the ruling is the same one that put saved
      // after the lens: each step narrows further, never replaces, so
      // searching a saved, contributor-filtered list is exactly what
      // "compose" has to mean here too.
      const Search = window.circFilterSearch || null;
      // Read only, by ruled decision (see feed-search.jsx's own header) — on
      // Active the query is always treated as empty, which composes to a
      // no-op regardless of what a stale key might hold from a prior Read
      // visit to this same circle.
      // 'saved' (run 7, Reading B) is a list like any other, per the brief: it
      // gets search on the same terms Read does. `sortKey` already carries the
      // tab, so 'saved' keys its own query bucket rather than sharing Read's.
      const isReadLikeTab = tab === 'read' || tab === 'saved';
      const searchQueryVal = (Search && isReadLikeTab) ? (searchQuery[sortKey] || '') : '';
      const visible = Search ? Search(savedFiltered, searchQueryVal) : savedFiltered;
      // The field's own visible-ness: open because the trigger was tapped, OR
      // because a query is already typed — clearing the query is the field's
      // one way to close once that has happened (see SearchField's own
      // comment), so a stager or a returning render never has to reconcile
      // the two flags by hand anywhere else.
      // A query of pure whitespace narrows NOTHING — circFilterSearch trims
      // before it filters — so every question of the form "is a search
      // applied?" has to trim too, or one press of the space bar lights the
      // trigger, suppresses FeedLead and locks the field open while the pile
      // is untouched. `searchQueryVal` stays raw: it is what the input shows.
      const searchActive = !!searchQueryVal.trim();
      const searchFieldOpen = isReadLikeTab && (!!searchOpen[sortKey] || searchActive);
      // Present from two Read items up, OR whenever a query is already active
      // — same "never strand the member with no way back" rule as showLens/
      // showSaved above, not repeated here.
      //
      // `window.LensChips` is in the guard because the FIELD renders inside the
      // chip row, which lives in feed-lens.jsx. Without this term, deleting
      // that file leaves a search icon in the bar that opens nothing: the
      // trigger flips aria-expanded, no field ever appears, and a screen
      // reader announces an expanded control with no contents.
      const showSearch = !!window.SearchTrigger && !!window.LensChips
        && isReadLikeTab && !loadingFeed
        && (stored.length >= (window.CIRC_SORT_MIN_ITEMS || 2) || searchActive);
      const setSearchFieldOpen = (next) => {
        // Closing WITH a query typed clears it. It used to return early and do
        // nothing at all, which left a visible, focusable, accent-lit control
        // that silently no-ops on tap — and no visible way to put the field
        // away, since the member has to empty it by hand first. Closing the
        // search is the obvious reading of tapping the search icon, so that is
        // what it now does.
        if (!next && searchActive) { clearSearch(); return; }
        setSearchOpen((prev) => ({ ...prev, [sortKey]: next }));
      };
      const clearSearch = () => {
        setSearchQuery((prev) => ({ ...prev, [sortKey]: '' }));
        setSearchOpen((prev) => ({ ...prev, [sortKey]: false }));
      };
      const setSearchQueryVal = (next) => {
        setSearchQuery((prev) => ({ ...prev, [sortKey]: next }));
        // Announce the ZERO STATE ONLY — never a count, anywhere, including
        // here (this app's feed marks are "boolean, wordless, never a
        // count" — see feed-lens.jsx's own header). Computed against the
        // pile this keystroke would actually produce, not the one already on
        // screen, so a screen-reader user hears the miss on the same
        // keystroke a sighted member sees it on.
        const wouldMatch = Search ? Search(savedFiltered, next) : savedFiltered;
        if (wouldMatch.length === 0 && next.trim()) announceOnce('Nothing matches');
      };
      const searchToggle = showSearch
        ? <window.SearchTrigger open={searchFieldOpen} active={searchFieldOpen} onToggle={setSearchFieldOpen} />
        : null;
      // The control is absent below two items — a one-item list reads the same
      // under either order, so the control could do nothing. Same instinct as
      // the waterline's own "both sides or nothing".
      //
      // Absent while the feed is loading, for the same reason: the member is
      // looking at the spinner, and a control offering to reorder a list that
      // is not on screen yet is chrome acting on nothing.
      // The control is present from two items up, OR whenever a lens is already
      // applied — otherwise narrowing to one link removes the only way back.
      // `lensOffDefault`, not `lensActive`: a member who sorted oldest-first and
      // then read the pile down to one link must still be able to open the door
      // and put it back. Concealment is not the test here — reachability is.
      const showLens = !!Lens && !loadingFeed
        && (stored.length >= (window.CIRC_SORT_MIN_ITEMS || 2) || lensOffDefault);
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
      // Grid was vetoed on 2026-09-09 (see CIRC_DENSITY_OPTIONS in
      // feed-lens.jsx for the why). The option is gone, but `density` is a
      // PERSISTED preference, so a member who picked Grid before the veto still
      // has 'grid' in storage — normalised here, once, rather than left to
      // render a mode that no longer exists. This line is the only reason the
      // string 'grid' still appears in the build; it can go once no stored
      // preference can plausibly still hold it.
      const effectiveDensity = density === 'grid' ? 'comfortable' : density;
      // Reading B's own empty state (run 7): true only when the Saved TAB
      // itself is genuinely empty — nothing saved in the whole circle, and no
      // contributor or query narrowing it further. Either of those still
      // narrowing an otherwise-populated saved list is a MISS, not an empty
      // surface, and falls through to FeedNoMatch below like every other miss.
      const savedTabEmpty = effectiveSavedMode === 'surface' && tab === 'saved'
        && !who && !searchActive && visible.length === 0;
      // `cardTab` (run 7): the Saved tab shows READ items — a card there has
      // to render exactly as it does on Read (the save/un-save mark, the
      // Swell door), never as it does on Active (a "mark as read" button on
      // an item that is already read, which is what feed.jsx's own
      // `tab === 'read'` branch would fall through to otherwise, since
      // 'saved' fails that check). The app's OWN `tab` stays 'saved' for
      // everything that keys state by tab (sortKey, search's own bucket,
      // the tab bar's active id) — only the read-vs-active COSMETIC choice
      // inside the card and the empty-tab copy read this normalised value.
      const cardTab = tab === 'saved' ? 'read' : tab;
      // `saved={effectiveSavedOn}`, not the raw flag — the third place the same
      // fix was needed, and the one missed on the first pass. The trigger's lit
      // state and its accessible name both read this prop: with the raw flag,
      // standing on Active with saved stored ON lit the lens and announced
      // "…, saved only" over a feed that was not narrowed, offering no way to
      // clear it. A claim that is neither applied, shown, nor clearable.
      const lensControl = showLens
        ? <Lens order={order} who={who} contributors={contributors} user={user}
            onOrder={setOrder} onWho={setWho}
            density={effectiveDensity} onDensity={setDensityView}
            isMobile={isMobile}
            saved={effectiveSavedOn} onSaved={showSavedLens ? setSavedFilter : null} savedMode={effectiveSavedMode}
            open={sortMenuOpen} onOpenChange={setSortMenuOpen} />
        : null;
      // The third tab (run 7, Reading B). Gated on the module, not on
      // `savedMode` alone — deletable-aid idiom, same as every guard reading
      // window.* in this render: drop feed-saved-readings.jsx and a stale
      // 'surface' mode left over from a `?state=` link falls back to the
      // shipped two-tab bar rather than showing a tab whose own screen (the
      // teaching empty state) no longer exists to back it.
      const tabItems = (effectiveSavedMode === 'surface')
        ? [{ id: 'active', label: 'Active' }, { id: 'read', label: 'Read' }, { id: 'saved', label: 'Saved' }]
        : undefined;
      // The waterline, Active only — Read is a shelf, not a timeline. Drawn from
      // the visit's own frozen mark, never from the stored one.
      //
      // DRAWN IN BOTH ORDERS (Joe's reversal, 2026-09-11, of the "newest-first
      // only" call Sally's ruling made the same day). The mark itself is
      // untouched by a sort change — it is visit state, exactly like the rest
      // of `dividerAt` — so the SAME two piles sit either side of it whichever
      // way the feed is currently drawn; only which end of the list you meet
      // first changes. `circDividerIndex` takes the order so it finds the
      // right row in a reversed list (see its own header, liveliness.jsx) — get
      // that branch wrong and the line silently stops drawing under
      // oldest-first, which is the bug that cost a fortnight the first time.
      // The label stays fixed `Earlier` regardless: Joe knows it may not read
      // true of the pile beneath it in every order and is parking that
      // deliberately, candidate words to follow from him directly.
      const divIdx = (tab === 'active')
        ? window.circDividerIndex(visible, dividerAt, order === 'newest') : -1;
      const feed = (feedError && window.FeedError) ? (
        // Load-error takes precedence over every other body state, loading
        // included: a feed that failed to fetch has no waterline to draw (it
        // does not know what landed since the mark), no lens or saved miss to
        // report (it has no items to have missed among), and nothing to show
        // loading over. Same container shape as the populated feed below, so
        // only the body swaps and the page does not jump.
        <main style={{ flex: 1, width: '100%' }}>
          <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: isMobile ? '16px 16px 112px' : '28px 24px 120px', width: '100%' }}>
            {/* The load-error branch keeps its own container so the shell,
                tabs and chips stay live while the feed region is replaced. */}
            <div><window.FeedError onRetry={() => {
              // Prototype affordance only: a real retry re-fires the fetch and
              // lands on whatever it returns. There is nothing here to re-fetch,
              // so the loading beat is staged by hand, just long enough to read
              // as the gesture having done something.
              setFeedError(false);
              setLoadingFeed(true);
              setTimeout(() => setLoadingFeed(false), 900);
            }} /></div>
          </div>
        </main>
      ) : loadingFeed ? (
        // Loading: the spinner is the whole view, centred in the content region
        // (fills main, which flex:1-stretches below the top bar + tabs).
        <main style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <FeedLoading />
        </main>
      ) : (
        <main style={{ flex: 1, width: '100%' }}>
          {/* One column at every width, capped at `--max-feed-width` for line
              length. The two-column grid alternative that used to branch here
              was vetoed on 2026-09-09; the desktop white-space question it was
              guessing at is still open, and is not answered by this element. */}
          <div style={{
            maxWidth: 'var(--max-feed-width)', margin: '0 auto',
            padding: isMobile ? '16px 16px 112px' : '28px 24px 120px',
            '--circ-feed-pad-top': isMobile ? '16px' : '28px', width: '100%',
            display: 'flex', flexDirection: 'column', gap: effectiveDensity === 'compact' ? 10 : 16,
          }}>
            {/* The discourse overlay's watching-digest summarises the whole
                circle. Under a lens it contradicts the screen it sits on — "4
                conversations you are watching" directly above "Nothing here
                from Dev K." reads as the filter being broken. Hidden while a
                lens is applied. This touches that overlay's surface only by
                withholding it here, at the point the two features meet; nothing
                about the digest itself is changed. Saved (feed-enhancement
                candidate build) is folded into the same condition for the
                same reason: "3 conversations you are watching" above a feed
                narrowed to what was saved reads exactly as broken. Search
                (feed-enhancement candidate build) joins the same condition
                for the same reason: "4 conversations you are watching" above
                a feed a query has narrowed to nothing-like-that reads exactly
                as broken too — a typed-but-empty field does NOT count, since
                nothing is narrowed yet. */}
            {Cand && Cand.FeedLead && !(lensActive || effectiveSavedOn || searchActive)
              && <div><Cand.FeedLead api={candApi} tab={tab} /></div>}
            {/* The pill announces arrivals for the list you are LOOKING at. Under
                a contributor lens, an arrival from somebody else is not one:
                tapping the pill would land it straight into the hidden pile and
                the feed would not move, which is the one thing the pill exists
                to promise it will do. So it counts only arrivals the lens keeps.
                Unmatched arrivals are not lost — they land whole the moment the
                lens clears. */}
            {/* A bare wrapper div here (as every other conditional row in this
                list still uses) gives the pill a 44px stick range and kills
                its `align-self: center` — canon renders it as a direct flex
                child of this column and both work (finding 1, design audit,
                2026-09-11). No wrapper. */}
            {tab === 'active' && pendingVisible.length > 0 && <NewPill onClick={revealPending} />}
            {/* ONE zero-match register for all four narrowings (who / saved /
                query), any combination — feed-lens.jsx's FeedNoMatch, which
                replaces the three components this render site used to
                choose between (LensNoMatch / SavedNoMatch / SavedLensNoMatch,
                still defined and exported, deletable-aid idiom, just no
                longer called from here). See that component's own header for
                the regression contract and the escape-precedence reasoning —
                not repeated here.
                Falls through to EmptyState when NOTHING is narrowed — that is
                a genuinely empty tab, the spec's own register, and stays
                exactly as it was. window.FeedNoMatch guards the first branch
                so dropping feed-lens.jsx whole degrades to EmptyState rather
                than throwing on a missing component.
                Reading B's Saved tab (run 7) gets ONE more branch ahead of all
                of these: a genuinely empty saved list, with no other narrowing
                on top, is not a MISS to escape from — there is nowhere else on
                this tab to go — so it takes its own teaching empty state
                rather than FeedNoMatch's "no saved links / show all read
                links" framing, which is written for a filter with an escape,
                not a destination with none. `who`/`searchActive` still
                narrowing on top of the tab falls through to FeedNoMatch below
                exactly as the lens/bar readings already do. */}
            {savedTabEmpty && window.SavedTabEmptyState
              ? <div><window.SavedTabEmptyState /></div>
              : visible.length === 0 && (who || effectiveSavedOn || searchActive) && window.FeedNoMatch
              ? <div><window.FeedNoMatch who={who} tab={cardTab} saved={effectiveSavedOn} query={searchQueryVal}
                  onClearWho={() => setWho(null)} onClearSaved={() => setSavedFilter(false)} onClearSearch={clearSearch} /></div>
              /* Saved survives feed-lens.jsx on its own: its toggle and its
                 filter both live in feed-saved.jsx and neither is gated on the
                 lens. Before the fold, SavedNoMatch rendered for this case
                 whether or not feed-lens.jsx existed; folding it into
                 FeedNoMatch quietly took that away, so a member filtering an
                 unsaved pile would have met EmptyState's "there is nothing
                 here / Start a circle" instead of "No saved links here". That
                 is not degrading to the previous behaviour, which is what the
                 deletable-aid contract actually promises — so the old
                 component stays reachable for exactly the case it used to own. */
              : visible.length === 0 && effectiveSavedOn && !who && window.SavedNoMatch
              ? <div><window.SavedNoMatch onClear={() => setSavedFilter(false)} /></div>
              : visible.length === 0 ? <div><EmptyState tab={cardTab} onStartCircle={gateActive ? onGate : openCreateSpace} /></div>
              : visible.map((item, i) => {
                const pointed = pointedId === item.id;
                const card = <FeedCard item={item} tab={cardTab} user={user} showTime density={effectiveDensity}
                  onOpen={(it) => { clearPointed(); openLink(it); }}
                  onMarkRead={(it) => { clearPointed(); setReacting(it); }}
                  onAct={clearPointed}
                  onDelete={(it) => setConfirm({ kind: 'delete', item: it })}
                  onToggleSaved={toggleSaved}
                  space={space} onAnnounce={announceOnce} pointed={pointed} />;
                const row = (Cand && Cand.CardRow)
                  ? <Cand.CardRow item={item} tab={cardTab} api={candApi}>{card}</Cand.CardRow>
                  : card;
                // Above the waterline → the glow, played when the card comes into
                // view. Accepted from the pill → the travel, once.
                //
                // A card a shared address pointed at glows too, and deliberately
                // reuses this one rather than minting a second treatment: both
                // mean LOOK HERE, the glow is already one-shot and already
                // reduced-motion aware, and a card that is both new and shared
                // glows once rather than twice. The accent bar is what makes the
                // two distinguishable at rest — the glow resolves to nothing.
                const fresh = pointed
                  || (tab === 'active' && dividerAt != null && !!item.at && item.at > dividerAt);
                return (
                  <React.Fragment key={item.id}>
                    {i === divIdx && <div><FeedDivider /></div>}
                    {/* CircGlow's own div is this row's direct grid-cell
                        child (the Fragment wrapping it renders no DOM node),
                        so it needs BOTH halves of the fix:
                        `height: '100%'` resolves it to the OUTER grid's row
                        height explicitly (equivalent to what that row's own
                        default stretch would give it, since a percentage
                        height on an auto-sized track is treated as auto for
                        the row's own sizing pass — verified: matches the
                        stretched value exactly, never smaller).
                        `display: 'grid'` then re-stretches ITS OWN child on
                        both axes, which matters because the discourse
                        candidate build (Cand.CardRow, always present in this
                        build — see main.jsx's own Cand binding) inserts an
                        unstyled `height: auto` wrapper div between this node
                        and the card. Without this second half, that wrapper
                        (and the card's own `height: 100%` in feed.jsx inside
                        it) has nothing definite to resolve against, which
                        collapsed one seed item's long, unclamped-by-nothing
                        -webkit-line-clamp title to a blank 34px card
                        (reproducible, not a timing race — see the run's own
                        measured numbers). Flex was tried first for this half
                        and rejected: it only stretches the cross axis, so it
                        fixed the height and silently narrowed every card to
                        its content's width instead. */}
                    {/* NO height on the grid cell, and this was settled by
                        measuring both ways rather than by argument — a stretch
                        was tried here first and reverted.

                        A grid item stretches to its row by default, but only
                        while its height is auto. Pinning it to 100% resolves
                        against a row the item is itself still sizing, and the
                        card then grows to swallow the height of its row-mate's
                        DISCOURSE strip — an appendage that belongs to the other
                        card, not to the row. Measured at 1280 on this fixture:
                        with the pin, three of ten cards carried 20-34px of
                        empty white inside their own border; without it, zero
                        did, and no card collapsed. A bordered card with a void
                        in its lower third reads as content that failed to
                        arrive, which is the exact impression the imageless
                        grid card exists to avoid.

                        So a shorter row-mate ends at its own content and leaves
                        ground beneath it. The uneven bottoms that remain are
                        the honest cost of a per-card appendage in a grid. */}
                    <CircGlow glow={fresh} rise={arrived.includes(item.id)}>{row}</CircGlow>
                  </React.Fragment>
                );
              })}
          </div>
        </main>
      );
      screen = inShell(
        <>
          {/* Saved sits outboard, search inboard of it, the lens stays
              outermost (rightmost) so it never shifts position between tabs —
              Active never carries the saved toggle or search, so the lens
              trigger moving with either would be the one thing in this bar
              that isn't stable. Search is the last control to join this
              ceiling — the region's own declared order, not a preference. */}
          <Tabs active={tab} onChange={setTab} items={tabItems} right={<>{savedToggle}{searchToggle}{lensControl}</>} />
          {/* What is applied, and the way out of it. Nothing at all in the
              default state — the folded control means the chips are now the
              only place the applied lens (or the saved filter, or a typed
              query) is legible without opening it. */}
          {/* LensChips (the chip ROW) is feed-lens.jsx's own component, so its
              presence still gates on Lens, not Saved or Search — both the
              saved chip and the search field ride inside that same row and
              have nowhere to render without it. */}
          {/* Run 9: the chip reads `effectiveSavedOn`, not the raw stored flag.
              The chip row's one job is to disclose what is being CONCEALED, so
              a Saved chip on a tab where the saved narrowing does not apply
              would be the row reporting a concealment that is not happening —
              the exact dishonesty this row exists to prevent. Same fix as the
              lens group's own gate above, on the other half of the pair. */}
          {/* No `order`/`onOrder` (ruling of 2026-09-07): the chip row is for
              concealment, and an order conceals nothing. The component stopped
              taking them rather than taking and ignoring them. */}
          {Lens && !loadingFeed && <window.LensChips who={who} onWho={setWho}
            saved={effectiveSavedOn} onSaved={setSavedFilter} isMobile={isMobile}
            searchOpen={searchFieldOpen} searchQuery={searchQueryVal}
            onSearchChange={setSearchQueryVal} onSearchClear={clearSearch}
            savedMode={effectiveSavedMode} onReopenLens={() => setSortMenuOpen(true)} />}
          {feed}
          {/* The FAB stands down while the lens sheet is up (run 9, from the
              design review, which caught it painting green over a scrimmed
              modal). It cannot be solved with z-index: the panel renders inside
              the tab bar, which is `position: sticky` with its own stacking
              context at 49, so nothing written inside it can out-paint a FAB at
              80. Suppressing is also simply correct — a primary compose action
              should not be tappable under a scrim, whichever way they paint.
              Mobile only, because at desktop the panel is an anchored popover
              with no scrim and nothing is being covered. */}
          {!loadingFeed && !isApp && !(isMobile && sortMenuOpen)
            && <FAB onClick={() => setAddOpen(true)} expanded={addOpen} confirm={addConfirm} isMobile={isMobile} />}
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
