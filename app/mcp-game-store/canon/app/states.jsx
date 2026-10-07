// ============================================================================
// Kit — the states register (PROTOTYPE AID, not part of the product).
//
// THE SINGLE SOURCE for every staged state of the app. One entry per state:
//
//     { group, id, label, stage(ctx) }
//
//   id     — the state's ADDRESS: lowercase letters, digits and single hyphens
//            (`sign-in`), unique, and not `index` or `states`. An id that
//            breaks the rule is refused at load with a console error and
//            appears nowhere. `?state=<id>` on the entry opens it, and a
//            ticket in the real build links to exactly that. Once linked, an id
//            is public: renaming or removing one breaks those links (an
//            unresolved name lands on the states index, which is how that shows
//            up rather than silently opening the wrong screen).
//   label  — how it reads to a person, in the palette and the index.
//   stage  — the staging function, handed the context built from main.jsx's
//            setters.
//
// Everything else is DERIVED from this list and cannot drift from it: the URL
// resolver below, window.KIT_STATES (ids + labels only, for anything reading
// the page), and the palette + index in app/states-ui.jsx.
//
// A deletable aid, in two files (this + app/states-ui.jsx). main.jsx guards on
// window.buildStates / window.StatesIndex, so absent ⇒ no register, no palette,
// no address reading, and the app behaves exactly as it ships. A build that
// omits the aids simply does not list them.
//
// NOTE ON PREVIEW: the resolver reads location.search, and nothing in the design
// tool can hand this page a URL — so `?state=` looks INERT here, in every
// posture, however correct it is. It is exercised by driving the register
// directly (window.buildStates, the palette, the index).
// ============================================================================

// ---- The stager library ------------------------------------------------------
// What a `stage` function is handed: main.jsx's setters, plus the moves several
// states share. This is the product's half of the file and grows with it.
// TODO(product): replace with the product's own stagers, built on its seed.
// [Platform]: api = { reset, setView, setConnected, setReview, go, setSub, setProvider, setChoice } from main.jsx.
// api also carries setUser.
function kitStateContext(api) {
  const reseed = () => api.reset();
  const reset = () => reseed();
  return { ...api, reseed, reset };
}

// ---- THE REGISTER ----------------------------------------------------------
// Order here is the order the palette and the index read in. Group titles are
// plain strings; a new group is simply a new title.
const KIT_STATE_REGISTER = [
  { group: 'Screens', id: 'home', label: '1. Home, signed out', stage: (c) => c.go('home') },
  { group: 'Screens', id: 'sign-up', label: '2. Sign up', stage: (c) => c.go('signup') },
  { group: 'Screens', id: 'sign-in', label: '2. Sign in', stage: (c) => c.go('signin') },
  { group: 'Screens', id: 'verify-email', label: '2. Sign up: verify your email', stage: (c) => c.go('verify', { ctx: 'signup', email: 'you@example.com' }) },
  { group: 'Screens', id: 'reset-password', label: '2. Sign in: reset your password', stage: (c) => c.go('recover') },
  { group: 'Screens', id: 'connect', label: '3. Connect your AI', stage: (c) => { c.setView('free'); c.go('connect'); } },
  { group: 'Screens', id: 'delve-free', label: '4. Delve, not paying', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('delve'); } },
  { group: 'Screens', id: 'delve-pass', label: '4. Delve, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('delve'); } },
  { group: 'Screens', id: 'puzzles-free', label: '5. Daily Puzzles, not paying', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('puzzles'); } },
  { group: 'Screens', id: 'puzzles-pass', label: '5. Daily Puzzles, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('puzzles'); } },
  { group: 'Screens', id: 'casebook-free', label: '5. Casebook, not paying', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('casebook'); } },
  { group: 'Screens', id: 'casebook-pass', label: '5. Casebook, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook'); } },
  { group: 'Screens', id: 'hunter-free', label: '5. Hunter-gatherer game, not paying', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('hunter'); } },
  { group: 'Screens', id: 'hunter-pass', label: '5. Hunter-gatherer game, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('hunter'); } },
  { group: 'Screens', id: 'games', label: '6. Games, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('games'); } },
  { group: 'Screens', id: 'games-free', label: '6. Games, free plan (played today)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games'); } },
  { group: 'Screens', id: 'games-signed-out', label: '6. Games, signed out', stage: (c) => c.go('games') },
  { group: 'Screens', id: 'session-delve', label: '7. Session page: Delve', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'delve' }); } },
  { group: 'Screens', id: 'session-puzzle', label: '7. Session page: a puzzle', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'word-today' }); } },
  { group: 'Screens', id: 'session-casebook', label: '7. Session page: Casebook', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'casebook' }); } },
  { group: 'Screens', id: 'session-hunter', label: '7. Session page: hunter-gatherer game', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'hunter' }); } },
  { group: 'Screens', id: 'history', label: '8. History, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('history'); } },
  { group: 'Screens', id: 'pass-free', label: '9. Pass, on the free plan', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('pass'); } },
  { group: 'Screens', id: 'pass-holder-page', label: '9. Pass, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('pass'); } },
  { group: 'Plans', id: 'free-plan', label: 'Signed in, free plan, AI connected', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games'); } },
  { group: 'Plans', id: 'pass-holder', label: 'Signed in with the Pass, AI connected', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('games'); } },
  { group: 'Plans', id: 'not-connected', label: 'Signed in, AI not connected (Play goes to Connect)', stage: (c) => { c.setView('free'); c.go('puzzles'); } },
  { group: 'Plans', id: 'free-puzzle-result', label: 'Free plan: a puzzle result that is not kept', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('session', { id: 'word-today' }); } },
  { group: 'Plans', id: 'free-history', label: 'Free plan: History with nothing kept', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('history'); } },
  { group: 'Sign in', id: 'provider-sign-in-fails', label: 'Google or Apple sign-in fails', stage: (c) => { c.setReview({ providerFail: true }); c.go('signin'); } },
  { group: 'Sign in', id: 'apple-no-account', label: 'Apple sign-in finds no account', stage: (c) => { c.setReview({ appleNone: true }); c.go('signin'); } },
  { group: 'Sign in', id: 'sign-in-new-device', label: 'Sign in: verify this device', stage: (c) => c.go('verify', { ctx: 'device', email: 'you@example.com' }) },
  { group: 'Sign in', id: 'code-expired', label: 'One-time code: expired', stage: (c) => c.go('verify', { ctx: 'device', email: 'you@example.com', preset: 'expired' }) },
  { group: 'Sign in', id: 'code-wrong', label: 'One-time code: wrong', stage: (c) => c.go('verify', { ctx: 'device', email: 'you@example.com', preset: 'wrong' }) },
  { group: 'Account', id: 'account-email', label: 'Account, email account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('account'); } },
  { group: 'Account', id: 'account-provider', label: 'Account, provider account (Google)', stage: (c) => { c.setView('free'); c.setConnected(true); c.setProvider('google'); c.go('account'); } },
  { group: 'Account', id: 'delete-account-confirm', label: 'Delete account: confirm', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('account', { stage: 'delete' }); } },
  { group: 'Account', id: 'change-email-code', label: 'Change email: code step', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('account', { stage: 'email-code' }); } },
  { group: 'Username', id: 'username-new-account', label: 'Your username screen (new account)', stage: (c) => { c.setView('free'); c.go('username', { next: 'connect' }); } },
  { group: 'Username', id: 'username-taken', label: 'Your username, taken', stage: (c) => { c.setView('free'); c.go('username', { next: 'connect', preset: 'taken' }); } },
  { group: 'Username', id: 'account-username-wait', label: 'Account, username in the 30-day wait', stage: (c) => { c.setView('free'); c.setConnected(true); c.setUser({ locked: true }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-none', label: 'Not subscribed', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-monthly', label: 'Active, monthly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-yearly', label: 'Active, yearly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ plan: 'yearly' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-free-month', label: 'Free month', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'free' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-pending-switch', label: 'Pending switch to yearly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ pending: 'yearly' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-payment-failed', label: 'Payment failed', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'failed' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-ending', label: 'Ending', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'ending' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-lapsed', label: 'Lapsed (free month used)', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ freeUsed: true }); c.go('account'); } },
  { group: 'Billing', id: 'pass-page-free-month', label: 'Pass page, free month available', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('pass'); } },
  { group: 'Billing', id: 'pass-page-free-used', label: 'Pass page, free month used', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ freeUsed: true }); c.go('pass'); } },
  { group: 'Billing', id: 'checkout', label: 'Payment provider checkout', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('checkout'); } },
  { group: 'Billing', id: 'update-card', label: 'Update-card page', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'failed' }); c.go('update-card'); } },
  { group: 'Billing', id: 'switch-sheet-yearly', label: 'Switch sheet: to yearly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('account', { sheet: 'switch' }); } },
  { group: 'Billing', id: 'switch-sheet-monthly', label: 'Switch sheet: to monthly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ plan: 'yearly' }); c.go('account', { sheet: 'switch' }); } },
  { group: 'Billing', id: 'switch-sheet-free-month', label: 'Switch sheet: in the free month', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'free' }); c.go('account', { sheet: 'switch' }); } },
  { group: 'Billing', id: 'cancel-sheet', label: 'Cancel sheet', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('account', { sheet: 'cancel' }); } },
  { group: 'Billing', id: 'cancel-sheet-free-month', label: 'Cancel sheet: in the free month', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'free' }); c.go('account', { sheet: 'cancel' }); } },
  { group: 'Site', id: 'not-found', label: 'Not found', stage: (c) => c.go('nowhere') },
  { group: 'Site', id: 'loading-full', label: 'Loading, full screen (held)', stage: (c) => c.go('loading') },
  { group: 'Site', id: 'loading-in-place', label: 'Loading, in place on Games (held)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games', { load: 'hold' }); } },
  { group: 'Site', id: 'load-failed', label: 'Load failed, in place on Games', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games', { load: 'failed' }); } },
  { group: 'Site', id: 'cant-connect', label: 'Can’t connect, full screen', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('offline'); } },
];

// Notes, per group: how to exercise what a staged state
// can't hold still — a search term, a sequence of taps. Each line names the
// state it serves. Shown at the foot of the group on the states page and
// palette, and readable off window.KIT_STATE_NOTES.
const KIT_STATE_GROUP_NOTES = {
  'Username': [
    'Account, username change open: it is the Account page itself, the Username card shows its field whenever there is no wait. Change it to start the wait.',
    'Taken: in the demo only "taken", in any capitals, is taken. Your own current name never is.',
  ],
  'Sign in': [
    'Provider sign-in fails: tap Continue with Google or Continue with Apple. The line under the buttons clears on the next try.',
    'Apple finds no account: tap Continue with Apple on Sign in.',
    'One-time code: 000000 is expired; 111111, or fewer than six digits, is wrong; any other six digits pass.',
    'Provider sheet cancelled (Config): tapping Google or Apple leaves you on step 1 with nothing shown.',
  ],
  'Pass card': [
    'Every card state is on the Account page. The same card shows on the Pass page for a Pass holder.',
  ],
  'Billing': [
    'Checkout: the card inputs only format; any input pays. The plan comes from the Pass page (Yearly by default).',
  ],
};
window.KIT_STATE_NOTES = KIT_STATE_GROUP_NOTES;

// The catalogue's own address. Not a state, so it is not in the register.
const KIT_STATE_INDEX_NAMES = ['index', 'states'];

// ---- derived: the entries whose id can be an address -------------------------
// An id travels in a URL and is matched lowercased, so one that is not lowercase
// and URL-safe, is the catalogue's own name, or is already taken would show in
// the palette and still give a dead link. Such an entry is refused here, loudly,
// and everything below reads this list.
const KIT_STATE_ID_RULE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const kitRefuseState = (id, why) => console.error('[kit states] refused state id ' + JSON.stringify(id) + ': ' + why + '. Fix it in KIT_STATE_REGISTER (app/states.jsx).');
const KIT_STATES_ACCEPTED = KIT_STATE_REGISTER.filter((s, i) => {
  if (typeof s.id !== 'string' || !KIT_STATE_ID_RULE.test(s.id)) { kitRefuseState(s.id, 'an id is lowercase letters, digits and single hyphens'); return false; }
  if (KIT_STATE_INDEX_NAMES.includes(s.id)) { kitRefuseState(s.id, 'that name opens the states index'); return false; }
  if (KIT_STATE_REGISTER.findIndex((x) => x.id === s.id) !== i) { kitRefuseState(s.id, 'an earlier entry already has it'); return false; }
  return true;
});

// ---- derived: what an agent or a script can read off the page --------------
// Names and labels only. Nothing runnable, so reading it can't stage anything.
window.KIT_STATES = KIT_STATES_ACCEPTED.map(({ id, label, group }) => ({ id, label, group }));

// ---- derived: the bound register main.jsx renders from ---------------------
function buildStates(api) {
  const ctx = kitStateContext(api);
  // Reseed, then stage, so a state opens the same way whatever came before it.
  const states = KIT_STATES_ACCEPTED.map((s) => ({
    id: s.id, label: s.label, group: s.group,
    go: () => {
      const c = kitStateContext(api);
      c.reseed();
      s.stage(c);
    },
  }));
  const byId = {};
  const groups = [];
  states.forEach((s) => {
    byId[s.id] = s;
    let g = groups.find((x) => x.title === s.group);
    if (!g) { g = { title: s.group, notes: KIT_STATE_GROUP_NOTES[s.group] || null, items: [] }; groups.push(g); }
    g.items.push(s);
  });
  return { states, byId, groups, reset: ctx.reset };
}

// ---- derived: the address ---------------------------------------------------
// `?state=<id>`  → that state, overriding whatever local state was restored.
// `?state=index` → the states index (the catalogue, linkable in its own right).
// a name not in the register → the index, which is how a stale ticket link shows
//   itself: the reader sees a list that does not contain the name they came for.
// nothing at all → null, and the app opens as the real app does.
function kitResolveState() {
  let raw = null;
  try { raw = new URLSearchParams(window.location.search).get('state'); } catch (e) { return null; }
  const name = (raw || '').trim().toLowerCase();
  if (!name) return null;
  if (KIT_STATE_INDEX_NAMES.includes(name)) return { kind: 'index', name };
  if (KIT_STATES_ACCEPTED.some((s) => s.id === name)) return { kind: 'state', id: name };
  return { kind: 'unresolved', name };
}

// A link someone can be handed. Framed in a hosted console, this page's own
// address is not one anyone can open: the console is, and it addresses a
// prototype by its URL hash (#<app>/<slug>), which a referrer never carries.
// So when framed, rebuild the console's address with that hash and this page's
// ?state= after it. Order of attempts: the parent's own hash (same origin),
// else the referrer plus the app and slug read from this page's path
// (.../app/<app>/<slug>/<file>). Unframed, or if neither works, this page's own
// address.
function kitStateLink(id) {
  const q = '?state=' + encodeURIComponent(id);
  const own = window.location.origin + window.location.pathname + q;
  if (window.parent === window) return own;
  try {
    const p = window.parent.location;
    const route = p.hash.replace(/^#/, '').split('?')[0];
    if (route) return p.origin + p.pathname + '#' + route + q;
  } catch (e) {}
  try {
    const m = window.location.pathname.match(/\/app\/([^/]+)\/([^/]+)\/[^/]*$/);
    if (m && document.referrer) {
      const u = new URL(document.referrer);
      return u.origin + u.pathname + '#' + m[1] + '/' + m[2] + q;
    }
  } catch (e) {}
  return own;
}

Object.assign(window, { buildStates, kitResolveState, kitStateLink });
