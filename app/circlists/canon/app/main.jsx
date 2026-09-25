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

// ---- Share intake (LM-771): the URL inside a shared payload ----------------
// The first http(s) URL in the text, nothing else; '' when there is none.
// Runs to the first whitespace or quote/angle bracket, then sheds trailing
// sentence punctuation ("…see https://a.b/c." holds https://a.b/c) and a
// closing bracket only when it is unbalanced, so wiki-style ".../Foo_(bar)"
// survives but "(https://a.b)" does not carry the ")".
const circShareExtractUrl = (payload) => {
  const m = String(payload || '').match(/https?:\/\/[^\s<>"'`]+/i);
  if (!m) return '';
  let u = m[0];
  for (;;) {
    const last = u.slice(-1);
    if (/[.,;:!?\u2019\u201d]/.test(last)) { u = u.slice(0, -1); continue; }
    const pair = { ')': '(', ']': '[', '}': '{' }[last];
    if (pair && u.split(last).length > u.split(pair).length) { u = u.slice(0, -1); continue; }
    break;
  }
  return /^https?:\/\/[^/]+/i.test(u) ? u : '';
};

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
// (circ-tweaks.jsx / tweaks-panel.jsx) are absent — a build that omits the aids
// drops them. When those files are present they take over.
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
  // The sheet-vs-popover/dialog boundary — shared by every surface that
  // switches container shape rather than layout (BIZ-136, Joe's ruling
  // 2026-09-14). 640px, matching the real app's Add surface
  // (`add-link-surface.component.css:38`, 40rem) — not `isMobile`'s 1024,
  // which governs layout posture (rail, columns) and stays put. Posture
  // overrides (Config's layout override, app mode) still win here exactly as
  // they do for `isMobile`; only the width threshold differs. Every surface
  // that chooses bottom-sheet-vs-popover/dialog reads THIS, not `isMobile`.
  const isSheetPosture = isApp ? true : tw.layout === 'mobile' ? true : tw.layout === 'desktop' ? false : winW < 640;
  // Posture + wizard alignment as <html> data attrs — CSS that must follow the
  // POSTURE (not the raw viewport width) keys off these. See .circ-wizard-body.
  useEffect(() => {
    const d = document.documentElement;
    d.setAttribute('data-circ-posture', isMobile ? 'mobile' : 'desktop');
  }, [isMobile]);

  // ---- Deletable-aid / droppable-module handles ----
  // Read once per render from window so the app tolerates any of these files
  // being absent (a build can omit any of them): config + tweaks are
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
  //   • from an embedding page: set  window.CIRC_FORCE_GATE = true  before the app
  //     mounts. No file in this project is hand-edited to activate it.
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
  // `share-intake` (LM-771) is in the list for the same reason, from the other
  // direction: the held link is ephemeral by design, so a RESTORED picker is a
  // share screen with nothing being shared — the member's next ordinary visit
  // would open on a question nobody asked, dressed as a bare arrival.
  const CIRC_UNRESUMABLE = ['not-found', 'invalid-invite', 'space-full', 'share-intake'];
  // A fresh session (nothing stored) lands on home — home is a shared surface
  // now, not an app-only chrome state (per
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
  // 'saved' is NOT a tab this app has any more (the third-tab reading was
  // superseded and its stager removed, 2026-09-14) — but `tab` is persisted,
  // so a browser still carrying an old 'saved' value in storage is a real
  // case, not a hypothetical one. Restored as 'read', not 'active': the
  // superseded Saved tab showed read links, so Read is where the member
  // actually was.
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
  // The feed region's own load-failure.
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
  // ---- Share intake (LM-771) ---------------------------------------------
  // `shareLink` is the link a member arrived HOLDING, from a share in another
  // app. Ephemeral, never persisted: an arrival is a moment, and a link still
  // sitting in storage a day later would re-open the picker on a link nobody
  // shared. Cleared the moment it is spent (a row tapped) or abandoned (×).
  // `addPrefill` is what the circle's own add surface opens holding — held
  // apart from `shareLink` because by the time the sheet opens the intake is
  // finished with, and the FAB's own add must never inherit it.
  // The setter is the one door into `shareLink`, so the extraction lives on it:
  // whatever payload is handed in (a bare URL, or "Read this: https://…"),
  // only the first http(s) URL in it is held; words are dropped, and a payload
  // with no URL holds nothing (a bare arrival). See circShareExtractUrl.
  const [shareLink, setShareLinkRaw] = useState('');
  const setShareLink = useCallback((payload) => setShareLinkRaw(circShareExtractUrl(payload)), []);
  const [addPrefill, setAddPrefill] = useState('');
  // The share's pending add: { id, spaceId } while the 760ms beat runs, else
  // null. Cleared the moment the member leaves that circle (effect below).
  const shareAddTimer = useRef(null);
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
  // ---- History and paging (LM-786, app/feed-history.jsx) --------------------
  // All three are VISIT state: never persisted, cleared on every entry to a
  // circle, so leaving or reloading starts both tabs at the top with the
  // switch off. A tab switch keeps them: each tab holds its own loaded pages
  // and its own scroll place, keyed `<circle>:<tab>`. An ORDER change clears
  // both tabs' pages and places for the circle (LM-786 sort, lean 1:
  // `resetOrderPlace` below) — nothing is remembered across an order change.
  const [includeActive, setIncludeActive] = useState(false);
  const [feedPages, setFeedPages] = useState({});
  const [pageStatus, setPageStatus] = useState({});
  const pageStatusRef = useRef({});
  pageStatusRef.current = pageStatus;
  const tabScroll = useRef({});
  const visitGen = useRef(0);
  const resetVisitView = () => {
    visitGen.current += 1;
    setIncludeActive(false); setFeedPages({}); setPageStatus({}); tabScroll.current = {};
    // The order is part of the visit (LM-786 sort, ratified): a member who
    // leaves and comes back finds newest first. Filters and density are left
    // alone here — filters are settled in separate work; density is device.
    setSortOrder({}); setOrderLoad({}); setPillPhase(null);
  };
  // The DRAWN waterline: the stored mark as it was when this visit began. Entry
  // stamps the mark to now, so the line the member reads against is held here for
  // the lifetime of the visit and nothing landing afterwards can move it. Visit
  // state, never persisted — a browser reload is a teardown, so it draws no line.
  const [dividerAt, setDividerAt] = useState(null);
  const [announce, setAnnounce] = useState('');
  // Feed sort. ONE order for the whole circle, across both tabs, for the
  // visit (LM-786 sort, ratified). Keyed by circle id; switching tab never
  // resets it. Cleared by `resetVisitView` when a visit starts (entering a
  // circle); a reload starts empty. Never persisted: newest-first is the
  // product's contract and the substrate the arrivals machinery stands on.
  const [sortOrder, setSortOrder] = useState({});
  // The order-change load (LM-786 sort): `{ [circleId]: 'loading' | 'failed' }`,
  // absent when the list is showing. Visit state; see `startOrderLoad`.
  const [orderLoad, setOrderLoad] = useState({});
  // The New pill's accept (Decision-29/31): { id, phase: 'busy' | 'spent' } or null.
  const [pillPhase, setPillPhase] = useState(null);
  // Keyed by circle alone — see the note at the render site for why the
  // contributor lens is not held per tab as the order is.
  const [lensWho, setLensWho] = useState({});
  // Saved filter. Keyed by circle alone,
  // same as lensWho and for the same reason: "show me what I've kept" is a
  // question about the circle, not about which tab you happen to be on.
  // VISIT STATE, never persisted — like sortOrder/lensWho, a narrowed view is
  // a reading posture for this session, not a preference that silently
  // outlives it. The saved FLAG on an item is the opposite: it lives on
  // `spaces` below, because it is a fact about the link, not a lens on it.
  const [savedOn, setSavedOn] = useState({});
  // Watching filter (LM-786). Keyed and held exactly as savedOn: per circle,
  // visit state, never persisted.
  const [watchingOn, setWatchingOn] = useState({});
  // Search. Keyed `<circleId>:<tab>` —
  // unlike sortOrder, this stays tab-scoped (fuzz finding 3's ruling covers
  // order only): Read only, so the key's tab half is always 'read' in
  // practice, but sharing the key shape rather than inventing a circle-only
  // one keeps this state reading as the same kind of thing as sortOrder was
  // at a glance. VISIT STATE, never persisted — same reasoning as sortOrder's
  // own comment above: a typed query is a reading posture for this session,
  // not a preference that silently outlives it. `searchOpen` is the field's own
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
  // Whether the home screen's cross-circle returns strip
  // (app/home-returns.jsx) is expanded. Controlled here, same
  // idiom as sortMenuOpen above, so a staged state can open it directly — the
  // strip has no circle context of its own to reset it against, so unlike the
  // per-circle bar it simply holds until the member (or a stager) changes it.
  // Collapsed by default. Ruling 97 landed it open, arguing collapsed shows
  // three circle names and hides every real thing behind a chevron — Joe
  // overturned that on 2026-09-13: open-by-default reads as content bloat on
  // a screen the member has not asked anything of yet. The open shape stays
  // reachable as its own state (`home-strip-open`) so either can be looked at
  // without reading this.
  const [homeStripOpen, setHomeStripOpen] = useState(false);
  // ---- Push notifications (LM-769) ---------------------------------------
  // ONE object, because the four fields only make sense read together:
  //   perm    — the DEVICE-level answer: 'default' (never asked) | 'granted' |
  //             'denied'. 'denied' is terminal from the app's side: nothing here
  //             can raise the device dialog again, only the member's own device
  //             or browser settings can undo it.
  //   on      — the member's in-app switch. Only meaningful under 'granted';
  //             held separately so turning notifications off in Circlists does
  //             not throw away a permission the member has already given.
  //   ask     — 'pending' | 'gone'. The in-app banner. 'gone' the moment the
  //             DEVICE dialog has been raised — from the banner's button or from
  //             the Account switch — and permanent from then on, whatever the
  //             answer was: the question the banner asks has been put.
  //   snoozes / snoozeAt — the ×. Dismissing HIDES the banner rather than ending
  //             it: it returns 3 days after the first ×, 7 after the second,
  //             then every 30. A count and a timestamp, because the interval is
  //             a function of how many times it has been waved away. The
  //             schedule itself lives in app/push.jsx (`pushWaitDays`), with
  //             the feature that owns it.
  //   channel — 'ok' | 'ios-tab' | 'unsupported'.
  //             'ios-tab': an iPhone or iPad running Circlists in a browser tab
  //             — only the Home Screen app can receive notifications, so the
  //             card names that route and the ask stays away.
  //             'unsupported': a browser that cannot deliver at all, such as an
  //             in-app browser opened inside another app. Nothing about
  //             notifications appears anywhere: no ask, and no Account card.
  //             Staged, never inferred — this prototype has no real UA to
  //             read, and guessing would make a statement the device
  //             disagrees with.
  // PERSISTED, with the app-state blob: a permission answer that reset on
  // reload would let the device dialog be raised twice, which is the one thing
  // the platform never does.
  const PUSH_DEFAULT = { perm: 'default', on: false, ask: 'pending', channel: 'ok', snoozes: 0, snoozeAt: 0 };
  const [push, setPush] = useState(() => ({ ...PUSH_DEFAULT, ...(SAVED?.push || null) }));
  // The simulated DEVICE dialog. Raised by exactly two gestures — the ask's
  // button and turning the Account setting on while perm is 'default' — and by
  // nothing else, ever. Ephemeral: it is a moment, not a state.
  const [permAsk, setPermAsk] = useState(false);
  // The device preview: staged only, and rendered INSTEAD of the app (it is not
  // a surface of the product, so it has no route and no chrome).
  const [devicePreview, setDevicePreview] = useState(false);
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
  // The order the pill was tapped under, so its spent face keeps its words
  // while it fades after the switch to newest first.
  const pillOrderRef = useRef('newest');
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
  // Carry the member to the arrivals. SUPERSEDED 2026-09-25 (LM-786 sort,
  // ratified): the 11 Sep carry-to-the-foot under oldest-first is gone. The
  // pill and a rail refresh that lands on Active now always end at the TOP:
  // under newest-first that is where the arrivals are; under oldest-first
  // the gesture first switches the order to newest-first
  // (`switchToNewestTop` below). `toFoot` is kept as a parameter for any
  // caller that still needs the foot; none of the arrivals paths pass it.
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
  // Lean 1 (LM-786 sort, for Joe to judge): any order change opens the list at
  // its start. Drops this circle's loaded pages, page status and scroll place
  // on BOTH tabs, and voids any page fetch in flight.
  const resetOrderPlace = (id) => {
    visitGen.current += 1;
    const drop = (prev) => { const n = { ...prev }; delete n[id + ':active']; delete n[id + ':read']; return n; };
    setFeedPages(drop); setPageStatus(drop);
    delete tabScroll.current[id + ':active']; delete tabScroll.current[id + ':read'];
  };
  // The oldest-first pill tap, once its cards have landed: switch this circle
  // to newest first and land at the top, with no list spinner (the pill's own
  // spinner carried the load). History switches too, because the order is
  // circle-wide, and opens at its own top next time. The caller announces.
  const switchToNewestTop = (id) => {
    setSortOrder((prev) => ({ ...prev, [id]: 'newest' }));
    resetOrderPlace(id);
    requestAnimationFrame(() => scrollToArrivals(false));
  };
  // A sort-control order change "loads" the new order's first page (LM-786
  // sort, ruled 2026-09-25; the sort control's alone): the list region shows the brand spinner, then opens at its
  // start. The rail, bar, tabs and chips stay as they are. `failed` shows
  // FeedError; Try again runs this again. Voided by any later order change or
  // a new visit (both bump `visitGen`).
  const startOrderLoad = (id) => {
    const gen = visitGen.current;
    setOrderLoad((prev) => ({ ...prev, [id]: 'loading' }));
    requestAnimationFrame(() => scrollToArrivals(false));
    setTimeout(() => {
      if (gen !== visitGen.current) return;
      setOrderLoad((prev) => { const n = { ...prev }; delete n[id]; return n; });
      requestAnimationFrame(() => scrollToArrivals(false));
    }, window.CIRC_PAGE_DELAY || 800);
  };
  const isOldestNow = (id) => (sortOrderRef.current[id] || window.CIRC_SORT_DEFAULT || 'newest') === 'oldest';

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

  // ✕ exit / return destination: HLD Decision-57 — abandoning circle creation
  // always lands on the home, never on another of the member's circles.
  const exitToApp = () => goHome();

  // ---- Share intake (LM-771): the tap-through -----------------------------
  // A row does exactly what the same row does on home — `enterSpace`, nothing
  // else — plus the one thing this flow adds: the circle's own add opens with
  // the link already in its slot. There is no new code path after the tap.
  //   An ASLEEP circle falls out at the guard: enterSpace lands it on its own
  // wake-up page (main.jsx's dormant branch) and the link is not carried.
  //   The delay is the feed's own load beat (enterSpace holds `loadingFeed`
  // for 700ms). "As if the member had tapped the circle's add button" means
  // the sheet slides up over a circle that has arrived, not over a spinner.
  const shareIntakePick = (id) => {
    const sp = spacesRef.current.find((s) => s.id === id);
    const link = shareLink;
    setShareLink('');
    enterSpace(id);
    if (!sp || !sp.funded) return;
    setAddPrefill(link);
    if (shareAddTimer.current) clearTimeout(shareAddTimer.current.id);
    const tid = setTimeout(() => { shareAddTimer.current = null; setAddOpen(true); }, 760);
    shareAddTimer.current = { id: tid, spaceId: id };
  };
  // Early exit: leaving the circle the pick just entered (another circle, home,
  // any other route) before the beat elapses cancels the add and drops the
  // link, so it never opens there, in the next circle, or on a later visit.
  const cancelShareAdd = () => {
    if (!shareAddTimer.current) return;
    clearTimeout(shareAddTimer.current.id);
    shareAddTimer.current = null;
    setAddPrefill('');
  };
  useEffect(() => {
    const p = shareAddTimer.current;
    if (p && (route !== 'space' || currentId !== p.spaceId)) cancelShareAdd();
  }, [route, currentId]);

  // persist
  useEffect(() => {
    try { localStorage.setItem(STATE_KEY, JSON.stringify({ route, user, spaces, currentId, tab, density, push })); } catch (e) {}
  }, [route, user, spaces, currentId, tab, density, push]);

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
  const space = useMemo(() => viewSpaces.find(s => s.id === currentId) || null, [viewSpaces, currentId]);
  // LM-771, ruled: a share arrival with no circles lands on home's own empty
  // state ("You're not in a circle yet"), unchanged and with no added line.
  // The link has nowhere to go, so it is dropped here rather than held.
  useEffect(() => {
    if (route === 'share-intake' && listSpaces.length === 0) { setShareLink(''); setRoute('home'); }
  }, [route, listSpaces.length]);
  // Active excludes cards from before the member's Horizon (LM-786); with
  // feed-history.jsx dropped there is no Horizon and it is every unread card.
  const inActive = window.circInActive || ((s, i) => !i.read);
  const activeItems = space ? space.items.filter(i => inActive(space, i)) : [];
  const readItems = space ? space.items.filter(i => i.read) : [];
  // History: every card, less those in Active while the switch is off.
  const historyItems = !space ? []
    : window.circHistoryItems ? window.circHistoryItems(space, space.items, includeActive) : readItems;
  // ---- Each tab keeps its own place (LM-786) --------------------------------
  const feedScroller = () => document.querySelector('.circ-phone-screen') || document.scrollingElement || document.documentElement;
  const switchTab = (next) => {
    if (next === tab) { setTab(next); return; }
    const el = feedScroller();
    if (el && currentId) tabScroll.current[currentId + ':' + tab] = el.scrollTop;
    setTab(next);
  };
  React.useLayoutEffect(() => {
    const el = feedScroller();
    if (!el || !currentId) return;
    el.scrollTop = tabScroll.current[currentId + ':' + tab] || 0;
  }, [tab]);
  useEffect(() => { resetVisitView(); }, [currentId]);
  // The next older page. One fetch at a time per tab; a visit that ends
  // mid-fetch drops the result. `fail` is the staged failure (states.jsx).
  const loadOlder = (key) => {
    if (pageStatusRef.current[key] === 'loading') return;
    const gen = visitGen.current;
    setPageStatus((prev) => ({ ...prev, [key]: 'loading' }));
    setTimeout(() => {
      if (gen !== visitGen.current) return;
      const size = window.CIRC_PAGE_SIZE || 8;
      setFeedPages((prev) => ({ ...prev, [key]: (prev[key] || size) + size }));
      setPageStatus((prev) => ({ ...prev, [key]: 'idle' }));
    }, window.CIRC_PAGE_DELAY || 800);
  };
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
    resetVisitView();
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

  // ---- Arriving on a shared card (BIZ-136 wild feature; LM-797) ------------
  // `?card=<id>` is the address a share hands over. Resolved ONCE at mount,
  // against the member's own state — which is the whole design: the address
  // means "this card", and what this card looks like depends on whether the
  // person following it has read it.
  //
  //   not a member / deleted / no such card ──▶ not-found, which never says
  //       which of those it was (hld.md Decision-44). The privacy answer needed
  //       no new screen.
  //   otherwise                             ──▶ the card's Overview, read or
  //       unread alike. ONE destination (LM-797): read-state decides what
  //       Overview SHOWS (talk-surface.jsx's withheld state), never where the
  //       address leads. The old second branch — the Active feed with the card
  //       pointed at — is retired, and the pointed-card treatment with it.
  //
  // The tab is still set, because it is where Back lands: Active while the card
  // is unread, Read once the Swell has committed (the hand-off is in
  // `reactOverlay`).
  //
  // A staged `?state=` wins outright: that is the register's harness driving the
  // app, and two boot resolutions racing would make every staged state a
  // coin toss. Deletable — no card-share.jsx, no `circReadCardParam`, and an
  // incoming address falls through to the ordinary boot.
  useEffect(() => {
    if (!window.circReadCardParam) return;
    try { if (new URL(window.location.href).searchParams.get('state')) return; } catch (e) { return; }
    const id = window.circReadCardParam();
    if (!id) return;
    const sp = spacesRef.current.find(s => (s.items || []).some(i => i.id === id));
    const item = sp && (sp.items || []).find(i => i.id === id);
    if (!sp || !item) { setRoute('not-found'); return; }
    setCurrentId(sp.id);
    setTab(item.read ? 'read' : 'active');
    // Overview is the candidate module's own route, so the address resolves
    // through it — guarded, exactly as every other consumer of it is. With the
    // module dropped there is no Overview to open, and the address falls back
    // to the circle the card is in.
    const C = window.CircCandidate;
    if (C && C.goToCard) { C.goToCard({ id }); return; }
    setRoute('space');
  }, []);

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
  // It LOADS, in both orders (ui.md Decision-29 as amended by Decision-31;
  // LM-786 sort, ruled 2026-09-25). From the click, the brand spinner takes the
  // pill's face, with its box and accessible name held, for exactly as long
  // as the reload runs: no minimum beat. Once the arrivals stand in the list,
  // the spent pill fades on the receipt's curve. A failed reload returns the
  // pill to rest with the arrivals still staged, the list unchanged and nothing
  // said. Under newest first the carry to the head happens at the click.
  // Under oldest first the list stays up, and the order switches to newest
  // first, at the top, only once the cards land ("Sorted newest first"). A
  // failed tap leaves the circle oldest first. The list spinner belongs to the
  // sort control alone. `auto` is Decision-56's empty-Active self-land below:
  // no gesture, no pill and no load, and it never rewrites the order.
  const acceptBusy = useRef(false);
  const landPending = (id) => {
    const sp = spacesRef.current.find(s => s.id === id);
    if (!sp || !(sp.pending || []).length) return false;
    const ids = sp.pending.map(i => i.id);
    setSpaces(prev => prev.map(s => s.id === id
      ? { ...s, items: [...s.pending, ...s.items], pending: [], lastSeenAt: Date.now() } : s));
    setArrived(a => [...a, ...ids]);
    setTimeout(() => setArrived(a => a.filter(x => !ids.includes(x))), 900);
    return true;
  };
  const revealPending = (opts) => {
    const auto = !!(opts && opts.auto === true);
    const id = currentRef.current;
    const sp = spacesRef.current.find(s => s.id === id);
    if (!sp || !(sp.pending || []).length) return;
    if (auto) { landPending(id); requestAnimationFrame(() => scrollToArrivals(false)); return; }
    if (acceptBusy.current) return;
    acceptBusy.current = true;
    const gen = visitGen.current;
    setPillPhase({ id, phase: 'busy' });
    if (!isOldestNow(id)) requestAnimationFrame(() => scrollToArrivals(false));
    setTimeout(() => {
      acceptBusy.current = false;
      // A visit ended, or the order was changed by hand, mid-reload: the pill
      // goes back to rest and the arrivals stay staged.
      if (gen !== visitGen.current || currentRef.current !== id || window.CIRC_ACCEPT_FAIL) { setPillPhase(null); return; }
      const switching = isOldestNow(id);
      if (!landPending(id)) { setPillPhase(null); return; }
      if (switching) {
        switchToNewestTop(id);
        announceOnce('Sorted ' + (window.circSortLabel ? window.circSortLabel('newest').toLowerCase() : 'newest first'));
      }
      setPillPhase({ id, phase: 'spent' });
      setTimeout(() => setPillPhase(p => (p && p.id === id && p.phase === 'spent') ? null : p), 520);
    }, window.CIRC_ACCEPT_DELAY || 700);
  };
  // UI Decision-56: a staged arrival meeting a genuinely empty Active tab
  // lands itself — there is no reader's feed for the pill to protect, so no
  // gesture is asked. Fires the same accept path revealPending uses for a
  // click (same glow), just without the click. `activeItems.length` is the
  // RAW pile, untouched by a lens/saved/search narrowing — deliberately, so
  // an arrival hidden by one of those stays queued behind the pill exactly
  // as it did before; this only covers the tab EmptyState itself renders for.
  useEffect(() => {
    if (route !== 'space' || tab !== 'active' || loadingFeed || !currentId) return;
    if (activeItems.length === 0 && space && (space.pending || []).length > 0) revealPending({ auto: true });
  }, [route, tab, loadingFeed, currentId, activeItems.length, space && (space.pending || []).length]);
  // The refresh gesture — selecting the circle already on screen. There is no
  // refresh button. Nothing blanks: the receipt runs in that circle's own rail slot
  // and resolves into the full mark on BOTH outcomes. Under newest first what it
  // finds LANDS, with no pill — the gesture already gave consent; under oldest
  // first it waits behind the pill (below). Either way it reconciles away what
  // other members deleted. One polite announcement: "Refreshed".
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
      // Under oldest-first (LM-786 sort, ruled 2026-09-25, replacing the same
      // day's "refresh switches to newest first"): a refresh of THIS circle
      // never changes the order, on either tab. What it finds waits behind the
      // New pill and the member stays put; the pill tap is the only switch.
      // Pending cards are never in `items`, so they stay out of History too,
      // with "Include cards in Active" on. Newest-first refresh is unchanged.
      const holdHere = !!(here && isOldestNow(id));
      const landingHere = found.length && here && onActive && !holdHere;
      if (holdHere && found.length) suppressPendAnnounce.current = true;
      if (found.length || gone.length) setSpaces(prev => prev.map(s => {
        if (s.id !== id) return s;
        if (holdHere) return { ...s, items: s.items.filter(i => !gone.includes(i.id)),
          queued: [], pending: found, remoteDeleted: [],
          unseen: (found.length && !onActive) ? true : s.unseen };
        return { ...s, items: [...found, ...s.items.filter(i => !gone.includes(i.id))],
          queued: [], pending: [], remoteDeleted: [],
          lastSeenAt: found.length ? Date.now() : s.lastSeenAt,
          // Arrivals always enter unread, so a refresh made from Read lands them on
          // Active, out of sight: the dot carries them, and clears on arrival there.
          unseen: (found.length && here && !onActive) ? true : s.unseen };
      }));
      // Only when there are any — scrolling on an empty refresh would move the
      // member for nothing. Order read live off the ref, not this closure, so a
      // member who flips the sort while the reload runs gets the true branch.
      // The announcement stays "Refreshed" alone: one announcement per gesture.
      if (landingHere) requestAnimationFrame(() => scrollToArrivals(false));
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
  // A refresh that parks cards behind the pill (oldest first) says "Refreshed"
  // only — one announcement per gesture.
  const suppressPendAnnounce = useRef(false);
  useEffect(() => {
    if (pendCount > pendPrev.current && tab === 'active' && !suppressPendAnnounce.current) announceOnce('New cards');
    if (pendCount !== pendPrev.current) suppressPendAnnounce.current = false;
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
  // Save toggle. Read-only chrome, so a
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
  // Leaving a circle: it drops from the switcher and the member lands on the
  // home (HLD Decision-57) — always, even when other circles remain.
  const leaveSpace = (id) => {
    const target = id || currentId;
    const rest = spacesRef.current.filter(s => s.id !== target);
    setSpaces(rest);
    goHome();
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
  // ---- Push notifications: the only two gestures that reach the device ----
  // `pushWantOn` is the single door. Both callers (the ask's button, the
  // Account switch turned on) go through it, so the rule "only a control whose
  // whole purpose is turning notifications on may raise the device dialog"
  // holds by there being nowhere else to call.
  //   'denied' is a no-op here rather than a guarded branch: the Account card
  // does not render a switch in that state and the ask is gone, so nothing can
  // call this — and if something ever does, doing nothing is the correct
  // behaviour, not re-raising a dialog the platform would refuse.
  const pushWantOn = () => {
    if (push.perm === 'granted') { setPush((p) => ({ ...p, on: true })); return; }
    if (push.perm === 'denied') return;
    setPermAsk(true);
  };
  // The device's answer. Either way the in-app line is finished with: the
  // member has answered the question it was asking.
  const pushAnswer = (allowed) => {
    setPermAsk(false);
    setPush((p) => ({ ...p, perm: allowed ? 'granted' : 'denied', on: !!allowed, ask: 'gone' }));
  };
  const pushSetOn = (v) => { if (v) pushWantOn(); else setPush((p) => ({ ...p, on: false })); };
  // × hides the banner; it does not end it. The interval is the dismissal
  // count's own — 3 days, then 7, then 30 for every one after — and nothing
  // brings it back once the device dialog has been raised (`ask: 'gone'`).
  const pushDismissAsk = () => setPush((p) => ({ ...p, snoozes: (p.snoozes || 0) + 1, snoozeAt: Date.now() }));
  const pushSnoozeOver = () => {
    const n = push.snoozes || 0;
    if (!n) return true;
    const days = window.pushWaitDays ? window.pushWaitDays(n) : 3;
    return Date.now() - (push.snoozeAt || 0) >= days * 864e5;
  };
  // Deliverable at all? An iOS browser tab and an in-app browser cannot receive
  // notifications, so there is nothing for the ask to offer there.
  const pushAskVisible = window.CircPushAsk && push.ask === 'pending'
    && push.perm === 'default' && push.channel === 'ok' && pushSnoozeOver();

  const signOut = () => { cancelShareAdd(); setShareLink(''); setUser(DEFAULT_USER); setRoute('signin'); };
  const startSignup = ({ firstName, lastName, email }) => {
    setPendingEmail(email);
    setUser({ firstName, lastName, name: 'You', email });
    setOtc({ context: 'signup', error: null }); setPostAuthTo('post-signup'); setRoute('otc');
  };
  const startSignin = (email, to) => { setPendingEmail(email); setUser({ ...DEFAULT_USER, email }); setOtc({ context: 'device', error: null }); setPostAuthTo(to || 'space'); setRoute('otc'); };

  const finishOtc = () => {
    // LM-771: signed out with a shared link in hand, sign-in returns to the
    // picker — the link is still held, so the arrival resumes where it stopped.
    if (postAuthTo === 'share-intake') { setRoute('share-intake'); return; }
    if (postAuthTo === 'post-signup') {
      // LM-771: a new account has no circles, so a held link is dropped — gone.
      setShareLink('');
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
        setPush, setDevicePreview,
        setOtc, setPostAuthTo, setManageIntent,
        setShareLink,
        enterSpace, openCreateSpace, refreshSpace,
        setSortOrder, setSortMenuOpen, setDividerAt, setLensWho, setDensity, setSavedOn, setWatchingOn,
        setSearchQuery, setSearchOpen, setHomeStripOpen,
        setIncludeActive, setFeedPages, setPageStatus, setOrderLoad,
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
      subView={opts.subView || null}
    >{content}</Shell>
  );

  // Candidate-build API — the one bridge a cand-* overlay reads app state and
  // mutations through. Assembled per render; bind() hands it over.
  const candApi = Cand ? { user, spaces, space, currentId, tab, isMobile, isApp,
    route, setRoute, setSpaces, returnToSpace, openLink,
    requestDelete: (item) => setConfirm({ kind: 'delete', item }),
    requestMarkRead: (item) => setReacting(item),
    toggleSaved, announceOnce,
    isChampion, startCircle: gateActive ? onGate : openCreateSpace } : null;
  if (Cand && Cand.bind) Cand.bind(candApi);

  // ---- render route ----
  // App posture + mobile payments OFF: every path that would reach the funding /
  // checkout / provider surfaces lands on the finish-on-web handoff instead. One
  // render-level guard covers ALL entry points (real flows AND staged states),
  // so no checkout, price-entry, or provider surface is reachable in-app while
  // off. Web mode ignores mobilePayments entirely (payments always work on web).
  let screen = null;
  // `create-space` is in this list because creating a circle IS a funding act:
  // the circle does not exist until it is funded, so with payments off there is
  // nothing on the phone for a name and description to attach to. The block
  // therefore lands on the tap, BEFORE the member writes anything — walking them
  // through the wizard first and blocking after throws that writing away.
  const PAYMENT_ROUTES = ['create-space', 'funding', 'checkout', 'manage-interstitial', 'manage-funding'];
  if (isApp && !mobilePayments && PAYMENT_ROUTES.includes(route)) {
    const ctx = (route === 'manage-interstitial' || route === 'manage-funding')
      ? 'manage' : (fundFlow.mode === 'refund' ? 'refund' : 'new');
    const nm = ctx === 'new' ? fundFlow.name : (space ? space.name : fundFlow.name);
    // New circles are launched from home, so "Back to your circles" returns to
    // home. Re-funding and managing are reached from inside a circle, and go
    // back to it.
    screen = window.WebHandoff
      ? <WebHandoff context={ctx} spaceName={nm} onExit={ctx === 'new' ? goHome : exitToApp} />
      : null;
  } else if (route === 'signin') {
    // LM-771: arriving signed out with a shared link adds exactly ONE thing to
    // the canon card — the lead above it — and points the return at the picker.
    // Guarded on the module: no app/share-intake.jsx, no lead and no return.
    const ShareLead = window.ShareSignInLead;
    const shareArrival = !!shareLink && !!window.CircShareIntake;
    screen = <SignIn lead={(shareArrival && ShareLead) ? <ShareLead link={shareLink} /> : null}
      subtitle={(shareArrival && window.SHARE_SIGNIN_SUBTITLE) || undefined}
      onSubmit={({ email }) => startSignin(email, shareArrival ? 'share-intake' : 'space')}
      onGoogle={() => { setPostAuthTo(shareArrival ? 'share-intake' : 'space'); setRoute('google-return'); }}
      onForgot={() => { setPostAuthTo(shareArrival ? 'share-intake' : 'space'); setRoute('recovery'); }} onGoSignup={() => { setSpaces([]); setRoute('signup'); }} />;
  } else if (route === 'signup') {
    screen = <SignUp onSubmit={startSignup} onGoogle={() => { setPostAuthTo('post-signup'); setRoute('google-return'); }} onGoSignin={() => setRoute('signin')} />;
  } else if (route === 'otc') {
    screen = <OtcEntry email={pendingEmail} context={otc.context} initialError={otc.error}
      onVerify={finishOtc} onBack={() => setRoute(otc.context === 'signup' ? 'signup' : 'signin')} />;
  } else if (route === 'google-return') {
    screen = <GoogleReturn onDone={holdLoading ? () => {} : () => { if (postAuthTo === 'share-intake') { setRoute('share-intake'); return; } if (postAuthTo === 'post-signup') { setShareLink(''); setSpaces([]); setCurrentId(null); } goHome(); }} />;
  } else if (route === 'recovery') {
    // LM-771: recovery from the signed-out share returns to the picker, the
    // link still held — sign-in's own return, via the `postAuthTo` onForgot set.
    screen = <Recovery onDone={() => { if (postAuthTo === 'share-intake' && shareLink) { setRoute('share-intake'); return; } goHome(); }} onBackToSignin={() => setRoute('signin')} />;
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
    screen = inShell(<AccountSettings user={user} onChangeEmail={changeEmail} onDeleteAccount={() => setConfirm({ kind: 'delete-account' })}
      push={push} onPushChange={pushSetOn} />,
      { subView: { title: 'Account', onBack: () => (accountFrom === 'home' ? goHome() : returnToSpace()) } });
  } else if (route === 'share-intake' && window.CircShareIntake) {
    // The share intake (LM-771). FRAMELESS, in every posture — it borrows the
    // Create-a-circle wizard's shape, so it is not inShell any more than the
    // wizard is. The rows are handed `listSpaces`, the same list home renders,
    // so their order and content cannot diverge from home's. × goes home with
    // no confirm (ratified), dropping the held link on the way out.
    // With no circles the arrival never reaches here: the effect by `space`
    // above sends it to home's empty state.
    screen = <window.CircShareIntake spaces={listSpaces} link={shareLink}
      onPick={shareIntakePick}
      onExit={() => { setShareLink(''); goHome(); }}
      onCreate={gateActive ? onGate : openCreateSpace} />;
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
      const stored = tab === 'active' ? activeItems : historyItems;
      const pending = (space && space.pending) || [];
      // ---- Feed sort -------------------------------------------------------
      // A deletable aid in the app's own idiom: no feed-lens.jsx ⇒ no control,
      // no reorder, and the feed behaves exactly as it did.
      const Lens = window.FeedLens || null;
      // Order is keyed by circle alone (fuzz finding 3, ruled 2026-09-14) —
      // `sortKey` below stays tab-scoped for search, which the ruling left
      // untouched.
      const order = sortOrder[currentId] || (window.CIRC_SORT_DEFAULT || 'newest');
      const sortKey = currentId + ':' + tab;
      // The contributor lens is held per CIRCLE, not per circle-and-tab as the
      // order is. "What did Sam add" is a question about a person, not about a
      // tab, so hopping to Read to see whether you already read Sam's link
      // keeps the lens. The asymmetry is deliberate; the chip stays on screen
      // across the switch, so the state is never hidden.
      // Multi-select (BIZ-136, ruling 2026-09-14): `who` is always an array —
      // empty for "Everyone" — never null, so every reader below can test it
      // with `.length` instead of re-deriving the same null-vs-array branch.
      const who = (Lens ? lensWho[currentId] : null) || [];
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
      // ---- Saved -----------------------------------------------------------
      // A deletable aid, same idiom as Lens above: no feed-saved.jsx ⇒ no
      // toggle, no chip, no filter. Held per CIRCLE (see savedOn's own
      // declaration) — same reasoning as `who`, not repeated here.
      // Composed AFTER the lens, per the ruling: both can be on at once, and
      // narrowing to one contributor's saved links is exactly what "compose"
      // has to mean, not "replace".
      const Saved = window.circFilterSaved || null;
      const savedOnFlag = !!savedOn[currentId];
      // Run 9: `&& tab === 'read'`. Saving is read-only by ruling — a card can
      // only be saved from Read — so "saved" is a lens over the Read pile and
      // over nothing else. Applied tab-blind, the stored per-circle flag also
      // narrowed ACTIVE by a mark no Active card can carry, emptying the tab
      // with nothing on screen explaining it. Fixed here rather than deferred:
      // it renders inside the surface this run is asking to be judged.
      const effectiveSavedOn = savedOnFlag && tab === 'read';
      const savedFiltered = Saved ? Saved(lensed, effectiveSavedOn) : lensed;
      // Whole-circle, unfiltered by the lens: "the circle holds a saved link"
      // is a fact about the circle, not about the current narrowing, and the
      // toggle's presence rule (render site, below) reads it that way.
      const hasSaved = !!(window.circHasSaved && window.circHasSaved(readItems));
      // Read only — a ruled product decision (see feed-saved.jsx's header) —
      // not loading, and present either because there is something to find or
      // because the filter is already on: turning it off must stay reachable
      // even after unsaving the last link it was showing.
      //
      // The third clause is the one worth keeping deliberately. Run 4 called it
      // the region's third state, after "present" and "present and applied":
      // NOT YET EARNED — the control does not exist until the member has made
      // its reason to exist. That principle was recorded as a region rule and
      // would have been lost by moving the control, which is exactly the kind
      // of thing an audit of the whole picture is for catching.
      const showSavedLens = tab === 'read' && !loadingFeed && (hasSaved || savedOnFlag);
      const setSavedFilter = (next) => {
        setSavedOn((prev) => ({ ...prev, [currentId]: next }));
        announceOnce(next ? 'Showing saved links' : 'Showing all links');
      };
      // ---- Watching (LM-786) -----------------------------------------------
      // Saved's pattern at every point: deletable aid, per-circle visit state,
      // History only, composed after saved, offered once the circle holds a
      // card the member is watching AND has done (or the filter is already on).
      const Watching = window.circFilterWatching || null;
      const watchingOnFlag = !!watchingOn[currentId];
      const effectiveWatchingOn = !!Watching && watchingOnFlag && tab === 'read';
      const watchFiltered = Watching ? Watching(savedFiltered, effectiveWatchingOn) : savedFiltered;
      const hasWatching = !!(window.circHasWatching && window.circHasWatching(readItems));
      const showWatchingLens = !!Watching && tab === 'read' && !loadingFeed && (hasWatching || watchingOnFlag);
      const setWatchingFilter = (next) => {
        setWatchingOn((prev) => ({ ...prev, [currentId]: next }));
        announceOnce(next ? 'Showing cards you’re watching' : 'Showing all cards');
      };
      // ---- Search ----------------------------------------------------------
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
      const isReadLikeTab = tab === 'read';
      const searchQueryVal = (Search && isReadLikeTab) ? (searchQuery[sortKey] || '') : '';
      const visible = Search ? Search(watchFiltered, searchQueryVal) : watchFiltered;
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
      // showSavedLens above, not repeated here.
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
        const wouldMatch = Search ? Search(watchFiltered, next) : watchFiltered;
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
      // History counts the whole circle, not what the switch lets through: with
      // the switch off and every card in Active, the panel is the only way to
      // the switch, so it must not vanish with the list.
      const lensBase = (tab === 'read' && space) ? space.items.length : stored.length;
      const showLens = !!Lens && !loadingFeed
        && (lensBase >= (window.CIRC_SORT_MIN_ITEMS || 2) || lensOffDefault);
      const setOrder = (next) => {
        setSortOrder((prev) => ({ ...prev, [currentId]: next }));
        // Lean 1: the other order opens at its start — top for newest first,
        // the oldest card for oldest first — on both tabs.
        if (next !== order) {
          resetOrderPlace(currentId);
          startOrderLoad(currentId);
        }
        // The gesture is acknowledged, as every gesture in this app is. The
        // waterline's suppression is NOT announced — a state never is.
        announceOnce('Sorted ' + (window.circSortLabel ? window.circSortLabel(next).toLowerCase() : next));
      };
      // Multi-select (BIZ-136, ruling 2026-09-14). One function serves three
      // callers, each passing a contributor id: the panel's own row (toggles
      // that person on or off), a chip's × (always toggles its own person
      // off, since a chip is only rendered while its person is selected), and
      // "Everyone" / the no-match recovery button (passes CIRC_LENS_ALL /
      // null to clear every selection at once).
      const setWho = (id) => {
        const cur = lensWho[currentId] || [];
        const next = (id === window.CIRC_LENS_ALL || id == null) ? []
          : cur.indexOf(id) !== -1 ? cur.filter((w) => w !== id)
          : cur.concat([id]);
        setLensWho((prev) => ({ ...prev, [currentId]: next }));
        announceOnce(next.length
          ? 'Showing links added by ' + next.map(window.circContributorLabel).join(', ')
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
            isMobile={isSheetPosture}
            saved={effectiveSavedOn} onSaved={showSavedLens ? setSavedFilter : null}
            watching={effectiveWatchingOn} onWatching={showWatchingLens ? setWatchingFilter : null}
            includeActive={includeActive}
            onIncludeActive={(tab === 'read' && window.IncludeActiveRow) ? setIncludeActive : null}
            open={sortMenuOpen} onOpenChange={setSortMenuOpen} />
        : null;
      // ---- Paging (LM-786) -------------------------------------------------
      // The loaded window of the composed list. Without feed-history.jsx the
      // whole list renders and nothing pages.
      const pageKey = currentId + ':' + tab;
      const Foot = window.FeedPageFoot || null;
      const pageSize = window.CIRC_PAGE_SIZE || 8;
      const loadedCount = Foot ? (feedPages[pageKey] || pageSize) : Infinity;
      const paged = visible.slice(0, loadedCount);
      const moreToLoad = visible.length > paged.length;
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
      // The label itself is order-dependent (ruling 25) — see FeedDivider in
      // liveliness.jsx — but the line's position and the mark it's drawn from
      // are untouched by which order the feed reads in.
      const divIdx = (tab === 'active')
        ? window.circDividerIndex(paged, dividerAt, order === 'newest') : -1;
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
      ) : (orderLoad[currentId] === 'failed' && window.FeedError) ? (
        // The new order's first page failed (LM-786 sort). Same shape as the
        // load-error branch above; Try again re-runs the order load.
        <main style={{ flex: 1, width: '100%' }}>
          <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: isMobile ? '16px 16px 112px' : '28px 24px 120px', width: '100%' }}>
            <div><window.FeedError onRetry={() => startOrderLoad(currentId)} /></div>
          </div>
        </main>
      ) : (loadingFeed || orderLoad[currentId] === 'loading') ? (
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
                about the digest itself is changed. Saved is folded into the
                same condition for the same reason: "3 conversations you are
                watching" above a feed narrowed to what was saved reads exactly
                as broken. Search joins the same condition
                for the same reason: "4 conversations you are watching" above
                a feed a query has narrowed to nothing-like-that reads exactly
                as broken too — a typed-but-empty field does NOT count, since
                nothing is narrowed yet. */}
            {/* The ask (LM-769) stands FIRST in the column, above the returns
                bar and above the pill (Joe's call, 2026-09-22). Both of those
                are live content about THIS circle; the ask is a one-time,
                account-level offer that speaks for every circle the member is
                in, and it gets exactly one chance to be read. Under the bar it
                read as an afterthought to a conversation digest.
                Active only, and only over a list that has links in it —
                `visible.length > 0`, the same test the pill and EmptyState
                already share, so the empty Active tab can never grow a banner.
                A DIRECT child of the column, not wrapped: it now owns the
                first-child slot, so its own top margin cancels the feed's top
                padding (28px desktop / 16px mobile) down to the column's 16px
                rhythm — the same trick .circ-newpill uses, and the reason the
                wrapper div every other conditional row here carries would be
                wrong for this one.
                KNOWN, pre-existing: the pill's negative margin pulls it 12px
                closer to whatever sits above it on desktop. That was already
                true of the pill under the returns bar; the ask does not make
                it worse, and fixing it is the pill's own question. */}
            {tab === 'active' && visible.length > 0 && pushAskVisible
              && <window.CircPushAsk onTurnOn={pushWantOn} onDismiss={pushDismissAsk} />}
            {Cand && Cand.FeedLead && !(lensActive || effectiveSavedOn || effectiveWatchingOn || searchActive)
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
            {/* UI Decision-56: the pill stands over cards alone — never over an
                empty Active tab, where there is no reader's feed to protect.
                `visible.length > 0` is the same test EmptyState's own branch
                uses below, so the two conditions can never disagree. */}
            {tab === 'active' && visible.length > 0 && (pendingVisible.length > 0 || (pillPhase && pillPhase.id === currentId)) && (
              <NewPill order={pillPhase && pillPhase.id === currentId && pillPhase.phase === 'spent' ? pillOrderRef.current : order}
                phase={pillPhase && pillPhase.id === currentId ? pillPhase.phase : null}
                onClick={() => { pillOrderRef.current = order; revealPending(); }} />
            )}
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
                than throwing on a missing component. */}
            {visible.length === 0 && (who.length || effectiveSavedOn || effectiveWatchingOn || searchActive) && window.FeedNoMatch
              ? <div><window.FeedNoMatch who={who} tab={tab} saved={effectiveSavedOn} watching={effectiveWatchingOn} query={searchQueryVal}
                  onClearWho={() => setWho(window.CIRC_LENS_ALL)} onClearSaved={() => setSavedFilter(false)}
                  onClearWatching={() => setWatchingFilter(false)} onClearSearch={clearSearch} /></div>
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
              : visible.length === 0 && effectiveSavedOn && !who.length && window.SavedNoMatch
              ? <div><window.SavedNoMatch onClear={() => setSavedFilter(false)} /></div>
              : visible.length === 0 ? <div><EmptyState tab={tab} isChampion={isChampion(space)} onStartCircle={gateActive ? onGate : openCreateSpace}
                  copy={(tab === 'read' && window.HISTORY_EMPTY_COPY)
                    ? window.HISTORY_EMPTY_COPY[(!includeActive && activeItems.length > 0) ? 'allActive' : 'empty'] : null} /></div>
              : paged.map((item, i) => {
                // History draws each card as it is on its home tab: an Unread
                // card (pre-Horizon ones included) exactly as Active draws it.
                const cardTab = (tab === 'read' && !item.read) ? 'active' : tab;
                const card = <FeedCard item={item} tab={cardTab} user={user} showTime density={effectiveDensity}
                  onOpen={openLink}
                  onMarkRead={(it) => setReacting(it)}
                  onDelete={(it) => setConfirm({ kind: 'delete', item: it })}
                  onToggleSaved={toggleSaved}
                  space={space} onAnnounce={announceOnce} />;
                const row = (Cand && Cand.CardRow)
                  ? <Cand.CardRow item={item} tab={cardTab} api={candApi}>{card}</Cand.CardRow>
                  : card;
                // Above the waterline → the glow, played when the card comes into
                // view. Accepted from the pill → the travel, once.
                //
                // The waterline is now its only trigger. A shared address used to
                // borrow it for the card it pointed at; that arrival lands on the
                // card's own Overview instead (LM-797), so there is no pointed
                // card on this feed to glow.
                const fresh = tab === 'active' && dividerAt != null && !!item.at && item.at > dividerAt;
                return (
                  <React.Fragment key={item.id}>
                    {i === divIdx && <div><FeedDivider newestFirst={order === 'newest'} /></div>}
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
            {/* The foot (LM-786). Older cards remain: the sentinel, the loading
                mark or the failed-load foot. All loaded: History closes with
                its end line; Active simply ends. */}
            {visible.length > 0 && Foot && moreToLoad && (
              <Foot key={pageKey + ':' + paged.length} status={pageStatus[pageKey] || 'idle'} newestFirst={order === 'newest'}
                onNeed={() => loadOlder(pageKey)} onRetry={() => loadOlder(pageKey)} />
            )}
            {visible.length > 0 && !moreToLoad && tab === 'read' && window.HistoryEnd
              && <window.HistoryEnd newestFirst={order === 'newest'} />}
          </div>
        </main>
      );
      screen = inShell(
        <>
          {/* The lens stays outermost (rightmost) so it never shifts position
              between tabs — Active never carries search, so the lens trigger
              moving with it would be the one thing in this bar that isn't
              stable. Search is the last control to join this ceiling — the
              region's own declared order, not a preference. */}
          <Tabs active={tab} onChange={switchTab} right={<>{searchToggle}{lensControl}</>} />
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
            saved={effectiveSavedOn} onSaved={setSavedFilter}
            watching={effectiveWatchingOn} onWatching={setWatchingFilter} isMobile={isMobile}
            searchOpen={searchFieldOpen} searchQuery={searchQueryVal}
            onSearchChange={setSearchQueryVal} onSearchClear={clearSearch}
            onReopenLens={() => setSortMenuOpen(true)} />}
          {feed}
          {/* The FAB stands down while the lens sheet is up (run 9, from the
              design review, which caught it painting green over a scrimmed
              modal). It cannot be solved with z-index: the panel renders inside
              the tab bar, which is `position: sticky` with its own stacking
              context at 49, so nothing written inside it can out-paint a FAB at
              80. Suppressing is also simply correct — a primary compose action
              should not be tappable under a scrim, whichever way they paint.
              Gated on `isSheetPosture` (640, BIZ-136 2026-09-14), not
              `isMobile` (1024) — the FAB only needs to stand down where the
              panel is actually a scrimmed sheet; above the sheet boundary
              it's an anchored popover with no scrim and nothing is being
              covered, even below the layout boundary. */}
          {/* The app posture floats this same FAB clear of its permanent
              bottom bar — Add is circle-scoped, so it stands inside a circle
              and nowhere else. The clearance is the chrome's number
              (APP_FAB_BOTTOM); with app/app-shell.jsx dropped there is no bar
              to clear and the FAB sits where the web posture puts it. */}
          {!loadingFeed && !(isSheetPosture && sortMenuOpen)
            && <FAB onClick={() => { setAddPrefill(''); setAddOpen(true); }} expanded={addOpen} confirm={addConfirm} isMobile={isMobile}
                 bottom={isApp ? (window.APP_FAB_BOTTOM || null) : null} />}
          {/* `isSheetPosture` (640, BIZ-136 2026-09-14), not `isMobile`'s 1024
              — sheet-vs-popover is the same boundary as FeedLens and
              GateOverlay now share; the FAB above stays on `isMobile` since
              its 24/32px offset is layout, not a sheet choice. */}
          {/* `initialUrl` is the share intake's one reach into this surface
              (LM-771): the link slot opens already holding the shared link.
              Empty for every other way in — the FAB clears it on the tap — so
              the add is otherwise the canon surface, unchanged. */}
          <AddReveal open={addOpen} isMobile={isSheetPosture} initialUrl={addPrefill}
            onClose={() => { setAddOpen(false); setAddPrefill(''); }} onAdd={addItem} />
        </>
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
      onMarkRead={(it, reaction) => {
        markRead(it, reaction);
        // Marked read from the card's own Overview (LM-797): the card is on the
        // Read tab from here on, and Back has to land where the card is. The
        // feed's own mark-as-read is untouched — there the card leaves Active
        // and the member stays where they were.
        if (Cand && Cand.matchRoute && Cand.matchRoute(route)) setTab('read');
      }}
      onClose={() => {
        // Leaving the Swell from a card's own Overview (LM-797). If the read
        // transition committed, the page is still holding its withheld state
        // and has to ask again — whether the member came out through the
        // reveal's own control or closed it. Without this, dismissing the
        // reveal leaves a stale page offering Mark-as-Read on a card that is
        // already read. Abandoned with nothing placed, the card is still
        // unread and nothing reloads: the pre-read Overview is unchanged.
        const it = reacting;
        setReacting(null);
        if (!it || !window.candReloadSurface) return;
        if (!(Cand && Cand.matchRoute && Cand.matchRoute(route))) return;
        const sp = spacesRef.current.find(s => s.id === currentId);
        const now = sp && (sp.items || []).find(i => i.id === it.id);
        if (now && now.read) window.candReloadSurface(it.id);
      }} />
  );
  // `isSheetPosture` (640, BIZ-136 2026-09-14): the gate is a bottom sheet vs.
  // centred dialog choice, the same shape decision as the lens panel — not a
  // layout question, so it reads the sheet boundary, not `isMobile`'s 1024.
  const gateOverlayEl = GateOverlay ? <GateOverlay open={gateOpen} isMobile={isSheetPosture} onClose={() => setGateOpen(false)} /> : null;
  // The one polite live region for the whole app: it sits in the page empty from
  // first render, because a region inserted together with its text announces
  // nothing. A gesture is acknowledged ("Refreshed"); the pill announces its own
  // arrival; a state is never announced.
  const liveRegion = <div className="circ-vh" role="status" aria-live="polite">{announce}</div>;
  // The simulated device dialog sits above everything the app draws, including
  // its own overlays — it is the operating system, not a layer of ours.
  const permOverlay = (permAsk && window.CircPermissionAsk)
    ? <window.CircPermissionAsk onAnswer={pushAnswer} /> : null;
  const appTree = <>{screen}{overlay}{reactOverlay}{gateOverlayEl}{permOverlay}{liveRegion}</>;

  return (
    <>
      {showIndex ? (
        <StatesIndexView reason={landing} groups={STATE_GROUPS}
          onGo={(id) => { goState(id); setLanding(null); }}
          onDismiss={() => setLanding(null)} />
      ) : (devicePreview && window.CircDevicePreview) ? (
        // Outside the app's own frame, so it replaces the app rather than
        // rendering inside a shell or a phone bezel of ours — the preview
        // draws its own device. Same top-level slot as the states index, for
        // the same reason: neither is a surface of the product.
        <window.CircDevicePreview spaces={listSpaces}
          onOpenCircle={(id) => { setDevicePreview(false); enterSpace(id); }}
          onExit={() => setDevicePreview(false)} />
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
        push={push} onPushStage={(patch) => setPush((p) => ({ ...p, ...patch }))}
        layout={tw.layout} onLayoutChange={(v) => setTweak('layout', v)} />}

      {/* Tweaks panel — deleting app/circ-tweaks.jsx removes it, no edit here */}
      {CircTweaks && <CircTweaks tw={tw} setTweak={setTweak} />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<CircApp />);
