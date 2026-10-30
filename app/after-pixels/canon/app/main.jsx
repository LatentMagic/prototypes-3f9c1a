// ============================================================================
// After Pixels — the root. Owns the app's state, decides which screen you are on,
// and mounts the prototype aids around it.
//
// The aids (config.jsx, states.jsx + states-ui.jsx, qa.jsx, gs-config.jsx) are
// imported below like every other file; removing one means removing its imports.
//
// The demo bar (GsDemoBar) is a prototype control: signed out, free (not
// subscribed) and Pass (active, monthly). It and the Subscription config row
// always agree, because the view is derived from the subscription.
//
// A candidate build may publish window.KitCandidate; it is
// read below, per render, and absent means the shipped behaviour.
// ============================================================================
import React from 'react';
import { createRoot } from 'react-dom/client';
// The design system's component bundle sets window.MCPGameStoreDesignSystem_ef1abd; it must run before any file reads DS.
import '../../design-system/_ds_bundle.js';
import './canon.css';
import './primitives.jsx';
import './gs-data.jsx';
import './gs-site.jsx';
import './gs-parts.jsx';
import { initGsChats } from './gs-chats.jsx';
import './directory-listings.jsx';
import './gs-home.jsx';
import './gs-session.jsx';
import { initGsGame } from './gs-game.jsx';
import './gs-library.jsx';
import { initGsWhereChainSalvage } from './gs-where-chain-salvage.jsx';
import { initGsCasebookData } from './gs-casebook-data.jsx';
import { initGsCasebook } from './gs-casebook.jsx';
import { initGsDelveLibrary } from './gs-delve-library.jsx';
import { initGsPuzzlesLibrary } from './gs-puzzles-library.jsx';
import { initGsHunterLibrary } from './gs-hunter-library.jsx';
import { initGsBarrowLibrary, registerBarrowLibrary } from './gs-barrow-library.jsx';
import { initGsPlayer } from './gs-player.jsx';
import { initGsDiscover } from './gs-discover.jsx';
import './gs-auth.jsx';
import './gs-username.jsx';
import './gs-connect.jsx';
import './gs-billing.jsx';
import './gs-account.jsx';
import { initStates } from './states.jsx';
import './states-ui.jsx';
import './config.jsx';
import './qa.jsx';
import './gs-config.jsx';
import { initGsHistory } from './gs-history.jsx';
import { initGsEditions } from './gs-editions.jsx';
import { initGsPassStore } from './gs-pass-store.jsx';
import { initGsMoreGames } from './gs-more-games.jsx';
import { initGsPassHome } from './gs-pass-home.jsx';
import './gs-pass-game.jsx';
import './gs-pass-pricing.jsx';
import { initGsPassLibrary } from './gs-pass-library.jsx';
import './gs-pass-discover.jsx';
import './gs-pass-aids.jsx';
import './gs-escape.jsx';
import './gs-word.jsx';
import { initGsDelve } from './gs-delve.jsx';
import { useGs, gsScrollTop, GsCtx } from './gs-data.jsx';
import { GsLegal, GsFullLoader, GsOffline, GsNotFound, GS_LOAD_MS, GsSpin, GsFooter } from './gs-site.jsx';
import { GsTopBar, GsPlayPopup, GsDemoBar } from './gs-parts.jsx';
import { DlClaudeListing, DlChatGptListing } from './directory-listings.jsx';
import { GsSession } from './gs-session.jsx';
import { DP_IDS } from './gs-where-chain-salvage.jsx';
import { registerCasebook } from './gs-casebook.jsx';
import { registerDelveLibrary } from './gs-delve-library.jsx';
import { registerPuzzlesLibrary } from './gs-puzzles-library.jsx';
import { registerHunterLibrary } from './gs-hunter-library.jsx';
import { GsDelve, GsWord, GsGroups, GsMystery, GsWhere, GsChain, GsSalvage, GsEscape, GsCasebook, GsHunter, GsBarrow } from './gs-player.jsx';
import { GsSignUp, GsSignIn, GsVerify, GsRecover, GsReturning } from './gs-auth.jsx';
import { GsUsername } from './gs-username.jsx';
import { GsConnect, gsPlayReq } from './gs-connect.jsx';
import { GsSubscribe, GsCheckout, GsUpdateCard, GS_SUB_HOLDS, GS_DAY0, GS_PLAN, gsAddMonths } from './gs-billing.jsx';
import { GsAccount } from './gs-account.jsx';
import { kitResolveState } from './states.jsx';
import { StatesIndex } from './states-ui.jsx';
import { ConfigLauncher } from './config.jsx';
import { GsHistory } from './gs-history.jsx';
import { GS_MORE_IDS, GS_MORE_SCREENS } from './gs-more-games.jsx';
import { GsHome } from './gs-pass-home.jsx';
import { GsPass } from './gs-pass-pricing.jsx';
import { registerPassLibrary, GsLibrary } from './gs-pass-library.jsx';
import { GsGames } from './gs-pass-discover.jsx';
import { buildStates } from './gs-pass-aids.jsx';
import { registerEscape } from './gs-escape.jsx';
import { registerWord } from './gs-word.jsx';
import { registerDelve } from './gs-delve.jsx';
import { PgBar, pgActive } from './playground.jsx';
import { FitView, isFramed, useFit } from './fit.jsx';
import { initPlaygroundGuessResult } from './playground-guess-result.jsx';
import { initPlaygroundGuessNow } from './playground-guess-now.jsx';

const { useState, useEffect, useRef } = React;

   
 
  

let GS_REVIEW_DEFAULT;
let GS_USER_DEFAULT;
let GS_SUB_DEFAULT;
let GS_BARE;
let GS_LISTING;
let GS_FOOTER;

let GS_SIGNED_IN_ONLY;
let GS_GUARDED;
const gsSignInFor = (r) => ({ name: 'signin', next: { ...r, prev: undefined, next: undefined } });
let GS_AUTH_ONLY;

let GS_ROUTES;
// A route left without the top bar (GS_BARE) or without the play pop-up and demo bar (GS_LISTING). A game's library game page
// and editions list (page: 'record') always carry both, so for a game in those lists only its product page goes without.
const gsWithout = (list, r) => list.includes(r.name) && r.page !== 'record';

const GsScreen = ({ name }) => {
  const More = GS_MORE_SCREENS && GS_MORE_SCREENS[name]; // the games in app/gs-more-games.jsx
  if (More) return <More />;
  switch (name) {
    case 'home': return <GsHome />;
    case 'signup': return <GsSignUp />;
    case 'signin': return <GsSignIn />;
    case 'verify': return <GsVerify />;
    case 'username': return <GsUsername />;
    case 'recover': return <GsRecover />;
    case 'returning': return <GsReturning />;
    case 'connect': return <GsConnect />;
    case 'games': return <GsGames />;
    case 'library': return <GsLibrary />;
    case 'delve': return <GsDelve />;
    case 'word': return <GsWord />;
    case 'groups': return <GsGroups />;
    case 'mystery': return <GsMystery />;
    case 'where': return <GsWhere />;
    case 'chain': return <GsChain />;
    case 'salvage': return <GsSalvage />;
    case 'escape': return <GsEscape />;
    case 'casebook': return <GsCasebook />;
    case 'hunter': return <GsHunter />;
    case 'barrow': return <GsBarrow />;
    case 'session': return <GsSession />;
    case 'history': return <GsHistory />;
    case 'pass': return <GsPass />;
    case 'subscribe': return <GsSubscribe />;
    case 'checkout': return <GsCheckout />;
    case 'update-card': return <GsUpdateCard />;
    case 'account': return <GsAccount />;
    case 'legal': return <GsLegal />;
    case 'loading': return <GsFullLoader />;
    case 'offline': return <GsOffline />;
    case 'directory-claude': return DlClaudeListing ? <DlClaudeListing /> : null;
    case 'directory-chatgpt': return DlChatGptListing ? <DlChatGptListing /> : null;
    default: return <GsNotFound />;
  }
};

let GS_ARRIVES;
const GsArrival = ({ name, quick }) => {
  const gs = useGs(); const r = gs.route;
  const held = r.hold === 'page';
  const skip = quick || !GS_ARRIVES.includes(name) || (name === 'games' && !!r.load);
  const [ready, setReady] = useState(skip && !held);
  useEffect(() => {
    if (ready || held) return undefined;
    const t = setTimeout(() => setReady(true), GS_LOAD_MS);
    return () => clearTimeout(t);
  }, []);
  if (ready) return <GsScreen name={name} />;
  return <main className="gs-wrap gs-main" aria-busy="true"><div className="gs-inplace" style={{ minHeight: '60vh' }}><GsSpin /></div></main>;
};

// ---- The app posture's system bars ---------------------------------------------
// Platform: Mobile only. Drawn over the screen inside the phone clip, as a phone
// draws them over an app that fills it. The space they take is
// --safe-area-inset-top / --safe-area-inset-bottom (the entry HTML's styles). Mobile
// web (Viewport: Mobile) draws neither: there a browser owns the top of the screen.
const KitPhoneBars = () => (
  <>
    <div className="kit-phone-status" aria-hidden="true">
      <span>9:41</span>
      <span className="kit-phone-island" />
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
    <div className="kit-phone-home" aria-hidden="true" />
  </>
);

const KitApp = () => {
  const fitted = useFit();
  // viewport / layout posture: 'auto' | 'desktop' | 'mobile', set from Config.
  const [layout, setLayout] = useState('auto');
  // Platform posture: 'web' | 'app', set from Config. Session-only like the
  // Viewport. 'web' = the two web postures (desktop web, mobile web); 'app' = the
  // native app posture. The app posture always uses the phone frame, whatever
  // the Viewport says, and only it draws the system bars.
  const [platform, setPlatform] = useState('web');
  const isApp = platform === 'app';
  const forcedMobile = layout === 'mobile' || isApp;
  

  // ---- product state ------------------------------------------------------------
  const [route, setRoute] = useState({ name: 'home' });
  const [signedIn, setSignedIn] = useState(false);
  const [sub, setSubState] = useState(GS_SUB_DEFAULT);
  const [user, setUserState] = useState(GS_USER_DEFAULT);
  const [provider, setProvider] = useState('email');     // how the account signs in
  const [choice, setChoice] = useState('yearly');         // the plan picked on the Pass page
  const [connected, setConnected] = useState(false);
  const [review, setReviewState] = useState(GS_REVIEW_DEFAULT);
  const [playing, setPlaying] = useState(null);
  const [width, setWidth] = useState(() => window.innerWidth);
  const rootRef = useRef(null);

  const view = !signedIn ? 'out' : GS_SUB_HOLDS.includes(sub.status) ? 'pass' : 'free';
  const viewRef = useRef(view); viewRef.current = view;
  // Where a route lands for this view: auth screens are for signed-out people, account screens for signed-in ones,
  // checkout never opens for a Pass holder, and a signed-in home is Discover.
  const land = (r, v) => {
    if (v !== 'out' && (GS_AUTH_ONLY.includes(r.name) || r.name === 'home')) return { name: 'games' };
    if (v === 'out' && GS_GUARDED.includes(r.name)) return gsSignInFor(r);
    if (v === 'out' && GS_SIGNED_IN_ONLY.includes(r.name)) return { name: 'home' };
    if (v === 'pass' && (r.name === 'checkout' || r.name === 'subscribe')) return { name: 'account' }; // MCPG-012 AF-06
    return r;
  };

  // Routes are history entries, so the browser's Back returns where you came from.
  const stack = useRef([{ name: 'home' }]);
  const idx = useRef(0);
  const backNav = useRef(false);
  useEffect(() => {
    try { window.history.replaceState({ ...(window.history.state || {}), gsIdx: 0 }, ''); } catch (e) {}
    const onPop = (e) => {
      const i = e.state && e.state.gsIdx;
      if (typeof i === 'number' && stack.current[i]) {
        const r = land(stack.current[i], viewRef.current);
        // A page left from the play dialog (How to connect) comes back with the dialog open on the same prompt.
        stack.current[i] = r.reopen ? { ...r, reopen: null } : r; idx.current = i; backNav.current = true; setPlaying(r.reopen || null); setRoute(stack.current[i]);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const go = (name, extra, asView) => {
    // asView false: a staged state, which sets the view itself in the same tick.
    const r0 = { name, ...(extra || {}) };
    const r = asView === false ? r0 : land(r0, asView || view);
    // Where the player came from, for back links (LbBackTo). A staged state has no earlier page.
    const cur = stack.current[idx.current];
    if (asView !== false && cur) r.prev = { name: cur.name, page: cur.page || null };
    idx.current += 1; backNav.current = false;
    stack.current = stack.current.slice(0, idx.current).concat([r]);
    try { window.history.pushState({ gsIdx: idx.current }, ''); } catch (e) {}
    setPlaying(null); setRoute(r); setTimeout(gsScrollTop, 0);
  };
  const setReview = (patch) => setReviewState((r) => ({ ...r, ...patch }));
  const setSub = (patch) => setSubState((s) => ({ ...s, ...patch }));
  const setUser = (patch) => setUserState((u) => ({ ...u, ...patch }));
  // The demo bar's three views, written onto the subscription.
  const setView = (v) => {
    if (v === 'out') { setSignedIn(false); return; }
    setSignedIn(true);
    if (v === 'free') setSubState({ ...GS_SUB_DEFAULT });
    if (v === 'pass') setSubState({ ...GS_SUB_DEFAULT, status: 'active', hadPass: true });
  };
  const reset = () => {
    setSignedIn(false); setSubState(GS_SUB_DEFAULT); setUserState(GS_USER_DEFAULT); setProvider('email');
    setChoice('yearly'); setConnected(false); setReviewState(GS_REVIEW_DEFAULT); go('home', null, 'out');
  };

  const gs = {
    route, view, sub, user, provider, choice, connected, review, playing, width, narrow: width < 640, isApp,
    go, setConnected, setReview, setView, setSub, setUser, setProvider, setChoice,
    // keep: write a page's own state into its history entry, so browser Back returns it as it was left.
    keep: (patch) => { const i = idx.current; stack.current[i] = { ...stack.current[i], ...patch }; },
    // The preview frame can swallow history.back() with no popstate; if nothing moved, step the stack ourselves.
    back: () => {
      const from = idx.current; if (from < 1) return;
      try { window.history.back(); } catch (e) {}
      setTimeout(() => {
        if (idx.current !== from) return;
        const i = from - 1; const r = land(stack.current[i], viewRef.current);
        stack.current[i] = r; idx.current = i; backNav.current = true; setPlaying(null); setRoute(r);
      }, 120);
    },
    goHow: () => go('connect'),
    howFromPlay: () => { stack.current[idx.current] = { ...stack.current[idx.current], reopen: playing }; go('connect'); },
    startFree: () => (view === 'out' ? go('signup') : go('games')),
    signOut: () => { setSignedIn(false); go('home', null, 'out'); },
    // Each view has its own home: signed out is `home`, signed in is `games`. Switching views swaps one for the other.
    // After signing in, and from Home or an auth screen on the demo bar, every player lands on Library.
    setDemoView: (v) => {
      setView(v);
      if (v === 'out' && GS_GUARDED.includes(route.name)) go('signin', gsSignInFor(route), 'out');
      else if (v === 'out' && (GS_SIGNED_IN_ONLY.includes(route.name) || (route.name === 'games' && view !== 'out'))) go('home', null, 'out');
      else if (v !== 'out' && (route.name === 'home' || GS_AUTH_ONLY.includes(route.name))) go('library', null, v);
    },
    // Every play control opens the play dialog with its prompt (gs-connect.jsx). The store can't know whether the AI is connected.
    play: (name) => setPlaying(gsPlayReq(gs, name)),
    playReq: (req) => setPlaying(req),
    closePlay: () => setPlaying(null),
    // Billing needs an account: signed out signs up first, then goes to checkout.
    // A Pass holder is sent to Account (land), so no second purchase starts.
    getPass: () => (view === 'out' ? go('signup', { next: 'checkout' }) : go('checkout')),
    // An account exists only once it has a username, so the username always comes before any payment page.
    // Email: the username is on the sign-up form and the account is made when the email is verified.
    // Google or Apple: the provider returns, then Your username (no code); the account is made there.
    // A new account: names from the email form (a provider supplies its own), the username locked for 30 days from today, nothing played.
    accountMade: (name, how, next, names) => {
      setSignedIn(true); setProvider(how || 'email'); setConnected(false);
      setUser({ username: name, locked: true, since: GS_DAY0.getTime(), fresh: true, ...(names && names.first ? { first: names.first, last: names.last } : {}) });
      go(next === 'checkout' ? 'checkout' : 'connect', null, 'free');
    },
    afterCheckout: () => go('subscribe'),
    // Back from checkout's "Cancel and return" returns to the subscribe page with the plan still chosen (MCPG-012 EF-01).
    // next: where sign-in returns: a route name (the subscribe page, when sign-in started from its sign-up route), or the guarded page asked for.
    signedIn: (how, next) => {
      setSignedIn(true); setProvider(how || 'email'); setConnected(true); setUser({ fresh: false });
      const n = next && typeof next === 'object' ? next : { name: next || 'library' }; go(n.name, n, 'free');
    },
    paid: () => {
      const months = GS_PLAN[choice].months;
      setSubState({ ...GS_SUB_DEFAULT, status: 'active', plan: choice, hadPass: true,
        renew: gsAddMonths(GS_DAY0, months).getTime() });
      go('pass', null, 'pass');
    },
    deleteAccount: () => { setSignedIn(false); setSubState(GS_SUB_DEFAULT); setConnected(false); go('signin', null, 'out'); },
  };
  window.gsApi = gs;

  // ---- the states register (app/states.jsx) ----------------------
  const [landing, setLanding] = useState(() => (kitResolveState ? kitResolveState() : null));
  const { byId: STATE_BY_ID, groups: STATE_GROUPS } = (buildStates
    ? buildStates({ reset, setView, setConnected, setReview, go: (n, e) => go(n, e, false), setSub, setProvider, setChoice, setUser, setPlatform })
    : { byId: {}, groups: [] });
  const goState = (id) => { const s = STATE_BY_ID[id]; if (s) { s.go(); setLanding(null); } };
  window.kitGoState = goState; // opens a state by id from a script (checking a build)
  const resetAndShow = buildStates && (() => { reset(); setLanding(null); });

  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !landing || landing.kind !== 'state') return;
    const st = STATE_BY_ID[landing.id];
    if (!st) return;
    deepLinked.current = true;
    st.go();
  }, [landing]);

  const StatesIndexView = StatesIndex;
  const showIndex = !!StatesIndexView && !!landing && (landing.kind === 'index' || landing.kind === 'unresolved');

  // Layouts adapt to the width they are handed: measure the root.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !window.ResizeObserver) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [forcedMobile, showIndex]);

  // Candidate-build hook (droppable, like the aids above): window.KitCandidate may hold
  // bind(api), handed the app's context object, and Screen, rendered in place of the routed
  // page (the top bar, footer and popups stay). Absent -> the shipped page, unchanged.
  const Cand = window.KitCandidate || null;
  if (Cand && Cand.bind) Cand.bind(gs);

  const appTree = (
    <GsCtx.Provider value={gs}>
      <div className={'gs-root' + (fitted ? ' fitted' : '')} ref={rootRef}>
        {GS_ROUTES.includes(route.name) && !gsWithout(GS_BARE, route) && (pgActive() ? <PgBar /> : !fitted && <GsTopBar />)}
        {fitted ? <FitView /> : <>
        {Cand && Cand.Screen
          ? <Cand.Screen api={gs} />
          : <GsArrival key={idx.current} name={route.name} quick={backNav.current} />}
        {(GS_FOOTER.includes(route.name) || !GS_ROUTES.includes(route.name)) && <GsFooter />}
        <div id="gs-announce" className="gs-vh" role="status" aria-live="polite"></div>
        {!gsWithout(GS_LISTING, route) && <>
          <GsPlayPopup />
          <GsDemoBar />
        </>}
        </>}
      </div>
    </GsCtx.Provider>
  );

  return (
    <>
      {showIndex ? (
        <StatesIndexView reason={landing} groups={STATE_GROUPS} onGo={goState} onDismiss={() => setLanding(null)} />
      ) : forcedMobile ? (
        <div className="kit-stage">
          <div className="kit-phone">
            <div className="kit-phone-clip" data-app={isApp ? '1' : undefined}>
              <div className="kit-phone-screen">{appTree}</div>
              {isApp && <KitPhoneBars />}
            </div>
          </div>
        </div>
      ) : appTree}

      {/* KEEP: the Config pill stays fixed to the window in the phone frame too (mounted outside it: the frame's transform would capture position: fixed). */}
      {ConfigLauncher && !isFramed() && <ConfigLauncher
        statesGroups={STATE_GROUPS} onGoState={goState}
        onOpenStatesIndex={() => setLanding({ kind: 'index', name: 'index' })}
        onReset={resetAndShow}
        layout={layout} onLayoutChange={setLayout}
        platform={platform} onPlatformChange={setPlatform} />}
    </>
  );
};

// Load-time code, run by main.jsx in index.html's old tag order.
function initMain() {
// Every registry write, in the order the files load in index.html, before the first render.
registerCasebook();
registerDelveLibrary();
registerPuzzlesLibrary();
registerHunterLibrary();
registerBarrowLibrary();
registerPassLibrary();
registerEscape();
registerWord();
registerDelve();
GS_REVIEW_DEFAULT = { providerFail: false, device: 'known', passFail: false, sheet: 'completes', week: 'done', today: 'played', unfinished: false, several: false, escape: 'under', ed: null };
// first, last: the names asked at sign-up by email. since: the day the username last changed (or the account was made); the next change waits 30 days from it.
// fresh: an account made in this session (or Config Account: New), with nothing played yet.
GS_USER_DEFAULT = { username: 'MonaLaser', first: 'Mona', last: 'Lasker', locked: false, since: null, fresh: false, email: 'you@example.com' };
// status: none | active | failed | ending. hadPass: has had the Pass before.
GS_SUB_DEFAULT = { status: 'none', plan: 'monthly', hadPass: false, pending: null, renew: null };
// Screens with their own frame (no shared top bar).
GS_BARE = ['signup', 'signin', 'verify', 'username', 'recover', 'returning', 'checkout', 'update-card', 'loading', 'offline', 'directory-claude', 'directory-chatgpt', ...(GS_MORE_IDS || [])];
// The directory listing mocks (app/directory-listings.jsx, droppable): no demo bar or play pop-up over them.
GS_LISTING = ['directory-claude', 'directory-chatgpt', ...(GS_MORE_IDS || [])];
// Screens that carry the site footer: everything except single-purpose screens (sign-in, sign-up, verify, recover, returning, checkout, update-card, loading, offline).
// Not-found carries it too (KitApp). The auth screens carry the legal links in their own foot (GsAuthFrame).
GS_FOOTER = ['home', 'games', 'library', 'delve', 'word', 'groups', 'mystery', ...DP_IDS, 'escape', 'casebook', 'hunter', 'barrow', 'pass', 'subscribe', 'legal', 'connect', 'history', 'session', 'account'];
// Screens a signed-out view cannot hold.
GS_FOOTER.push(...(GS_MORE_IDS || []));
GS_SIGNED_IN_ONLY = ['library', 'history', 'account', 'update-card', 'checkout', 'session'];
// Of those, the pages that belong to the player: a signed-out visitor gets Sign in, then the page asked for.
GS_GUARDED = ['library', 'history', 'account', 'session'];
// Screens that make or enter an account. Someone signed in never lands on them.
GS_AUTH_ONLY = ['signup', 'signin', 'verify', 'username', 'recover', 'returning'];
// Every route the app holds. Anything else is not-found, which carries no chrome.
GS_ROUTES = ['home', 'signup', 'signin', 'verify', 'username', 'recover', 'returning', 'connect', 'games', 'library', 'delve', 'word', 'groups', 'mystery', ...DP_IDS, 'escape', 'casebook', 'hunter', 'barrow',
  'session', 'history', 'pass', 'subscribe', 'checkout', 'update-card', 'account', 'legal', 'loading', 'offline', 'directory-claude', 'directory-chatgpt', ...(GS_MORE_IDS || [])];
// A page loads as a page on arrival: the top bar and footer stand, the content waits.
// Back does not repeat the wait (the page was already loaded). Discover with its own route.load keeps its own states.
GS_ARRIVES = ['games', 'library', 'history', 'session', 'pass', 'subscribe', 'account', 'delve', 'word', 'groups', 'mystery', ...DP_IDS, 'escape', 'casebook', 'hunter', 'barrow', ...(GS_MORE_IDS || [])];
createRoot(document.getElementById('root')).render(<KitApp />);
}

initGsChats();
initGsGame();
initGsWhereChainSalvage();
initGsCasebookData();
initGsCasebook();
initGsDelveLibrary();
initGsPuzzlesLibrary();
initGsHunterLibrary();
initGsBarrowLibrary();
initGsPlayer();
initGsDiscover();
initStates();
initGsHistory();
initGsEditions();
initGsPassStore();
initGsMoreGames();
initGsPassHome();
initGsPassLibrary();
initGsDelve();
initMain();
initPlaygroundGuessResult();
initPlaygroundGuessNow();
