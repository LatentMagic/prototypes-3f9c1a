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
//   aliases (optional) — more ids that open this same state. An id whose
//            staging was identical to another's is kept as an alias of it,
//            because ids are public links; it is listed under its state, not
//            on its own.
//   platform (optional) — 'app' | 'web': sets Config → Platform before the
//            state stages, so its address opens in that posture. Absent: the
//            posture is left as it is. An app-only state sits beside its web
//            twin: the app differs in content, not width.
//
// Everything else is DERIVED from this list and cannot drift from it: the URL
// resolver below, window.KIT_STATES (ids + labels only, for anything reading
// the page), and the palette + index in app/states-ui.jsx.
//
// The register is two files (this + app/states-ui.jsx), both imported by
// main.jsx (buildStates comes from app/gs-pass-aids.jsx, which adds the reset).
// The resolver reads location.search, so `?state=<id>` opens a state.
// ============================================================================

// ---- The stager library ------------------------------------------------------
// What a `stage` function is handed: main.jsx's setters, plus the moves several
// states share. This is the product's half of the file and grows with it.
// TODO(product): replace with the product's own stagers, built on its seed.
// After Pixels: api = { reset, setView, setConnected, setReview, go, setSub, setProvider, setChoice } from main.jsx.
// api also carries setUser.
import { DL_STATES } from './directory-listings.jsx';
import { DP_STATES } from './gs-where-chain-salvage.jsx';
import { CB_ID, CB_ALL } from './gs-casebook-data.jsx';
import { DV_ALL } from './gs-delve-library.jsx';
import { PZ } from './gs-puzzles-library.jsx';
import { GS_DAY0 } from './gs-billing.jsx';
import { GsPassStage } from './gs-pass-store.jsx';

function kitStateContext(api) {
  const reseed = () => api.reset();
  const reset = () => reseed();
  return { ...api, reseed, reset };
}

// ---- THE REGISTER ----------------------------------------------------------
// Order here does not matter: the palette and the index read alphabetically
// (sorted in buildStates). Group titles are plain strings; a new group is
// simply a new title.
const gsPassSet = (p) => GsPassStage && GsPassStage.set(p);
let KIT_STATE_REGISTER;

let KIT_STATE_GROUP_NOTES;


let KIT_STATE_INDEX_NAMES;

let KIT_STATE_ID_RULE;
const kitRefuseState = (id, why) => console.error('[kit states] refused state id ' + JSON.stringify(id) + ': ' + why + '. Fix it in KIT_STATE_REGISTER (app/states.jsx).');
const kitIdsOf = (s) => [s.id, ...(s.aliases || [])];
let KIT_STATES_ACCEPTED;



// ---- derived: the bound register main.jsx renders from ---------------------
export function buildStatesBase(api) {
  const ctx = kitStateContext(api);
  // Reseed, then stage, so a state opens the same way whatever came before it.
  const states = KIT_STATES_ACCEPTED.map((s) => ({
    id: s.id, aliases: s.aliases || [], label: s.label, group: s.group,
    go: () => {
      // An entry's `platform: 'app' | 'web'` sets Config → Platform before it
      // stages, so its address opens in the right posture. No platform: left as is.
      if (s.platform && api.setPlatform) api.setPlatform(s.platform);
      const c = kitStateContext(api);
      c.reseed();
      s.stage(c);
    },
  }));
  const byId = {};
  const groups = [];
  states.forEach((s) => {
    byId[s.id] = s; s.aliases.forEach((a) => { byId[a] = s; });
    let g = groups.find((x) => x.title === s.group);
    if (!g) { g = { title: s.group, notes: KIT_STATE_GROUP_NOTES[s.group] || null, items: [] }; groups.push(g); }
    g.items.push(s);
  });
  // Alphabetical, always, so a state can be found by name. A leading "App: "
  // is skipped, so an app-only state sorts beside its web twin.
  const kitSortKey = (t) => t.replace(/^App:\s*/i, '');
  const kitCompare = (a, b) => kitSortKey(a).localeCompare(kitSortKey(b), undefined, { sensitivity: 'base', numeric: true });
  groups.sort((a, b) => kitCompare(a.title, b.title));
  groups.forEach((g) => g.items.sort((a, b) => kitCompare(a.label, b.label)));
  return { states, byId, groups, reset: ctx.reset };
}

// ---- derived: the address ---------------------------------------------------
// `?state=<id>`  → that state, overriding whatever local state was restored.
// `?state=index` → the states index (the catalogue, linkable in its own right).
// a name not in the register → the index, which is how a stale ticket link shows
//   itself: the reader sees a list that does not contain the name they came for.
// nothing at all → null, and the app opens as the real app does.
export function kitResolveState() {
  let raw = null;
  try { raw = new URLSearchParams(window.location.search).get('state'); } catch (e) { return null; }
  const name = (raw || '').trim().toLowerCase();
  if (!name) return null;
  if (KIT_STATE_INDEX_NAMES.includes(name)) return { kind: 'index', name };
  if (KIT_STATES_ACCEPTED.some((s) => kitIdsOf(s).includes(name))) return { kind: 'state', id: name };
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
export function kitStateLink(id) {
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

// Load-time code, run by main.jsx in index.html's old tag order.
export function initStates() {
KIT_STATE_REGISTER = [
  { group: 'Screens', id: 'home', label: '1. Home, signed out', stage: (c) => c.go('home') },
  { group: 'Screens', id: 'sign-up', label: '2. Sign up', stage: (c) => c.go('signup') },
  { group: 'Screens', id: 'sign-in', label: '2. Sign in', stage: (c) => c.go('signin') },
  { group: 'Screens', id: 'verify-email', label: '2. Sign up: verify your email', stage: (c) => c.go('verify', { ctx: 'signup', email: 'you@example.com' }) },
  { group: 'Screens', id: 'reset-password', label: '2. Sign in: reset your password', stage: (c) => c.go('recover') },
  { group: 'Sign in', id: 'reset-password-code', label: 'Reset your password: enter your code', stage: (c) => c.go('recover', { step: 'code', email: 'you@example.com' }) },
  { group: 'Screens', id: 'connect', label: '3. How it works', stage: (c) => { c.setView('free'); c.go('connect'); } },
  { group: 'Screens', id: 'delve-free', label: '4. Delve, not paying', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('delve'); } },
  { group: 'Screens', id: 'delve-pass', label: '4. Delve, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('delve'); } },
  { group: 'Screens', id: 'word-free', label: '5. Daily Word, free account (played today)', stage: (c) => { gsPassSet({ freeNew: false }); c.setView('free'); c.setConnected(true); c.go('word'); } },
  { group: 'Screens', id: 'word-signed-out', label: '5. Daily Word, signed out', stage: (c) => c.go('word') },
  { group: 'Screens', id: 'groups-free', label: '5. Daily Groups, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('groups'); } },
  { group: 'Screens', id: 'groups-pass', label: '5. Daily Groups, with the Pass (played)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('groups'); } },
  { group: 'Screens', id: 'mystery-pass', label: '5. Daily Mystery, with the Pass (today not solved)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('mystery'); } },
  { group: 'Screens', id: 'escape-free', label: '5. Escape, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('escape'); } },
  { group: 'Screens', id: 'escape-pass', label: '5. Escape, with the Pass (played this week)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('escape'); } },
  { group: 'Screens', id: 'casebook-free', aliases: ['fp-product-casebook-free'], label: '5. Casebook, not paying', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('casebook'); } },
  { group: 'Screens', id: 'casebook-pass', label: '5. Casebook, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook'); } },
  { group: 'Screens', id: 'hunter-free', aliases: ['fp-product-hunter-free'], label: '5. 36,000 Summers Ago, not paying', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('hunter'); } },
  { group: 'Screens', id: 'hunter-pass', label: '5. 36,000 Summers Ago, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('hunter'); } },
  { group: 'Screens', id: 'barrow-free', label: '5. The Barrow of Hollowmere, not paying', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('barrow'); } },
  { group: 'Screens', id: 'barrow-pass', label: '5. The Barrow of Hollowmere, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('barrow'); } },
  { group: 'Library', id: 'library-barrow', label: 'The Barrow of Hollowmere in your library, with the Pass, chapter 1 finished', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('barrow', { page: 'record' }); gsPassSet({ bwDone: true }); } },
  { group: 'Library', id: 'library-barrow-not-played', label: 'The Barrow of Hollowmere in your library, with the Pass, not played', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('barrow', { page: 'record' }); } },
  { group: 'Library', id: 'barrow-all-chapters', label: 'The Barrow of Hollowmere, All chapters', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('barrow', { page: 'record', list: true }); } },
  { group: 'Library', id: 'library-barrow-free', label: 'The Barrow of Hollowmere in your library, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('barrow', { page: 'record' }); } },
  { group: 'Screens', id: 'games', aliases: ['pass-holder'], label: '6. Discover, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('games'); } },
  { group: 'Screens', id: 'games-free', label: '6. Discover, free account (played today)', stage: (c) => { gsPassSet({ freeNew: false }); c.setView('free'); c.setConnected(true); c.go('games'); } },
  { group: 'Screens', id: 'games-signed-out', label: '6. Discover, signed out', stage: (c) => c.go('games') },
  { group: 'Screens', id: 'library', aliases: ['pur-pass-holder'], label: '6. Library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('library'); } },
  { group: 'Screens', id: 'library-free', label: '6. Library, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('library'); } },
  { group: 'Screens', id: 'library-pass-ended', label: '6. Library, Pass ended', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('library'); } },
  { group: 'Screens', id: 'session-delve', aliases: ['session-delve-past'], label: '7. Session page: Delve', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'delve' }); } },
  { group: 'Screens', id: 'session-groups', label: '7. Session page: Daily Groups', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'groups-today' }); } },
  { group: 'Screens', id: 'session-escape', label: '7. Session page: Escape', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'escape-week' }); } },
  { group: 'Screens', id: 'session-escape-on-par', label: '7. Session page: Escape, out on par', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ escape: 'par' }); c.go('session', { id: 'escape-par' }); } },
  { group: 'Screens', id: 'session-escape-over', label: '7. Session page: Escape, over par', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ escape: 'over' }); c.go('session', { id: 'escape-over' }); } },
  { group: 'Screens', id: 'session-escape-hard', label: '7. Session page: Escape, the hard play (six locks, 18 tries on one)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ ed: 'hard' }); c.go('session', { id: 'escape-hard' }); } },
  { group: 'Screens', id: 'session-escape-in-progress', label: '7. Session page: Escape in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('session', { id: 'escape-live' }); } },
  { group: 'Screens', id: 'session-delve-fallen', label: '7. Session page: Delve, a run that fell', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'delve-fallen' }); } },
  { group: 'Screens', id: 'session-delve-hard', label: '7. Session page: Delve, the hard play (overrun, going back three times)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'delve-hard' }); } },
  { group: 'Screens', id: 'session-delve-in-progress', label: '7. Session page: Delve in progress (Wren)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('session', { id: 'delve-live' }); } },
  { group: 'Screens', id: 'session-puzzle', label: '7. Session page: Daily Word', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'word-today' }); } },
  { group: 'Screens', id: 'session-word-hard', label: '7. Session page: Daily Word, the hard play (five guesses and the hint)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'word-hard' }); } },
  { group: 'Screens', id: 'session-word-failed', label: '7. Session page: Daily Word, failed (six guesses)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'word-failed' }); } },
  { group: 'Screens', id: 'session-barrow', label: '7. Session page: The Barrow, chapter 1 finished (Play again)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'gs-pu-barrow-ch1' }); gsPassSet({ bwDone: true }); } },
  { group: 'Screens', id: 'session-kept-pass-ended', label: '7. Session page: Pass ended, an unfinished 36,000 Summers Ago day (kept, no Play)', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('session', { id: 'hunter-hg8' }); } },
  { group: 'Screens', id: 'session-casebook', aliases: ['library-casebook-case'], label: '7. Session page: Casebook', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook', { page: 'record', sid: CB_ID }); } },
  { group: 'Screens', id: 'session-hunter', label: '7. Session page: 36,000 Summers Ago', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'hunter-hg0' }); } },
  { group: 'Screens', id: 'session-word-in-progress', label: '7. Session page: Daily Word in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('session', { id: 'word-live' }); } },
  { group: 'Screens', id: 'session-mystery', label: '7. Session page: Daily Mystery', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'mystery-today' }); } },
  { group: 'Screens', id: 'session-mystery-in-progress', label: '7. Session page: Daily Mystery in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('session', { id: 'mystery-live' }); } },
  { group: 'Screens', id: 'history', label: '8. History, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('history'); } },
  { group: 'Screens', id: 'pass-free', aliases: ['pass-page-never-subscribed'], label: '9. Pass, with a free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('pass'); } },
  { group: 'Screens', id: 'pass-holder-page', label: '9. Pass, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('pass'); } },
  { group: 'Library', id: 'library-casebook', label: 'Casebook in your library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook', { page: 'record' }); } },
  { group: 'Library', id: 'library-casebook-in-progress', label: 'Casebook in your library, the case in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('casebook', { page: 'record' }); } },
  { group: 'Library', id: 'library-delve', label: 'Delve in your library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('delve', { page: 'record' }); } },
  { group: 'Library', id: 'library-delve-in-progress', label: 'Delve in your library, this week in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('delve', { page: 'record' }); } },
  { group: 'Library', id: 'library-delve-hard', label: 'Delve in your library, the hard play (overrun, going back three times)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ ed: 'hard' }); c.go('delve', { page: 'record' }); } },
  { group: 'Library', id: 'library-word', label: 'Daily Word in your library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('word', { page: 'record' }); } },
  { group: 'Library', id: 'library-word-in-progress', label: 'Daily Word in your library, today in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('word', { page: 'record' }); } },
  { group: 'Library', id: 'library-word-streak-broken', label: 'Daily Word in your library, streak broken (yesterday failed)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ broken: true }); c.go('word', { page: 'record' }); } },
  { group: 'Library', id: 'library-mystery-never-played', label: 'Daily Mystery in your library, free account, never played', stage: (c) => { c.setView('free'); c.setConnected(true); c.setReview({ never: 'mystery', today: 'none' }); c.go('mystery', { page: 'record' }); } },
  { group: 'Library', id: 'library-delve-free-in-progress', aliases: ['pur-first-in-progress'], label: 'Delve in your library, free account, first run in progress', stage: (c) => { c.setView('free'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('delve', { page: 'record' }); } },
  { group: 'Library', id: 'library-list-free-in-progress', label: 'Library list, free account, Delve’s first run in progress', stage: (c) => { c.setView('free'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('library'); } },
  { group: 'Library', id: 'library-word-free', aliases: ['fp-word-library-free'], label: 'Daily Word in your library, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('word', { page: 'record' }); } },
  { group: 'Library', id: 'library-groups', label: 'Daily Groups in your library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('groups', { page: 'record' }); } },
  { group: 'Library', id: 'library-groups-in-progress', label: 'Daily Groups in your library, today in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('groups', { page: 'record' }); } },
  // The Pass upsell. Its review store (app/gs-pass-store.jsx) resets before every state.
  { group: 'Pass upsell', id: 'pur-new-account', label: '1. Library, free account, nothing played', stage: (c) => { c.setView('free'); c.setConnected(true); c.setUser({ fresh: true }); c.go('library'); } },
  { group: 'Pass upsell', id: 'pur-new-for-you', label: '2. Library, New for you full', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('library'); gsPassSet({ newEds: 'most' }); } },
  { group: 'Pass upsell', id: 'pur-first-done', label: '4. Delve, free first run done', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('delve', { page: 'record' }); } },
  { group: 'Library', id: 'library-casebook-free', aliases: ['library-casebook-no-pass', 'fp-casebook-library-free'], label: 'Casebook in your library, free account (Pass only)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('casebook', { page: 'record' }); } },
  { group: 'Pass upsell', id: 'pur-barrow-done', label: '5. The Barrow, free chapter 1 done', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('barrow', { page: 'record' }); gsPassSet({ bwDone: true }); } },
  { group: 'Pass upsell', id: 'pur-word-done', label: '6. Daily Word, today’s word done', stage: (c) => { gsPassSet({ freeNew: false }); c.setView('free'); c.setConnected(true); c.go('word', { page: 'record' }); } },
  { group: 'Pass upsell', id: 'pur-pass-ended', aliases: ['library-casebook-pass-ended', 'fp-casebook-library-lapsed'], label: '7. Casebook, Pass ended', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('casebook', { page: 'record' }); } },
  { group: 'Pass upsell', id: 'pur-discover-free', aliases: ['free-plan'], label: '9. Discover, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games'); } },
  { group: 'Pass upsell', id: 'pur-pass-ended-every', label: 'Pass ended: every case', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('library'); gsPassSet({ lapsed: 'every' }); } },
  { group: 'Library', id: 'library-groups-free', label: 'Daily Groups in your library, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('groups', { page: 'record' }); } },
  { group: 'Library', id: 'library-mystery', label: 'Daily Mystery in your library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('mystery', { page: 'record' }); } },
  { group: 'Library', id: 'library-mystery-in-progress', label: 'Daily Mystery in your library, today in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('mystery', { page: 'record' }); } },
  { group: 'Library', id: 'library-mystery-free', label: 'Daily Mystery in your library, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('mystery', { page: 'record' }); } },
  { group: 'Library', id: 'library-escape', label: 'Escape in your library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('escape', { page: 'record' }); } },
  { group: 'Library', id: 'library-escape-in-progress', label: 'Escape in your library, this week in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('escape', { page: 'record' }); } },
  { group: 'Library', id: 'library-escape-on-par', label: 'Escape in your library, out on par', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ escape: 'par' }); c.go('escape', { page: 'record' }); } },
  { group: 'Library', id: 'library-escape-over', label: 'Escape in your library, over par', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ escape: 'over' }); c.go('escape', { page: 'record' }); } },
  { group: 'Library', id: 'library-escape-hard', label: 'Escape in your library, the hard play', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ ed: 'hard' }); c.go('escape', { page: 'record' }); } },
  { group: 'Library', id: 'library-escape-free', aliases: ['fp-escape-library-free'], label: 'Escape in your library, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('escape', { page: 'record' }); } },
  { group: 'Library', id: 'library-hunter', label: '36,000 Summers Ago in your library, with the Pass', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('hunter', { page: 'record' }); } },
  { group: 'Library', id: 'library-casebook-editions', label: 'Casebook: every case (the editions list)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook', { page: 'record', list: true }); } },
  { group: 'Library', id: 'library-delve-no-pass', aliases: ['fp-delve-library-free'], label: 'Delve in your library, no Pass', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('delve', { page: 'record' }); } },
  { group: 'Library', id: 'library-delve-pass-ended', aliases: ['fp-delve-library-lapsed'], label: 'Delve in your library, Pass ended', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('delve', { page: 'record' }); } },
  { group: 'Library', id: 'library-hunter-pass-ended', aliases: ['fp-hunter-library-lapsed'], label: '36,000 Summers Ago in your library, Pass ended', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('hunter', { page: 'record' }); } },
  { group: 'Library', id: 'history-in-progress', label: 'History, today and this week in progress', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('history'); } },
  { group: 'Plans', id: 'free-not-played-today', label: 'Free account, nothing played today or this week', stage: (c) => { c.setView('free'); c.setConnected(true); c.setReview({ today: 'none' }); c.go('word', { page: 'record' }); } },
  { group: 'Plans', id: 'not-connected', label: 'Signed in, AI not connected (Play opens the play pop-up, with How to connect)', stage: (c) => { c.setView('free'); c.go('groups'); } },
  { group: 'Plans', id: 'free-puzzle-result', label: 'Free account: a puzzle result', stage: (c) => { gsPassSet({ freeNew: false }); c.setView('free'); c.setConnected(true); c.go('session', { id: 'word-today' }); } },
  { group: 'Plans', id: 'free-history', label: 'Free account: History, free games only', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('history'); } },
  { group: 'Plans', id: 'lapsed-history', label: 'Pass ended: History keeps the Pass-game plays', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('history'); } },
  { group: 'Sign in', id: 'provider-sign-in-fails', label: 'Google or Apple sign-in fails', stage: (c) => { c.setReview({ providerFail: true }); c.go('signin'); } },
  { group: 'Sign in', id: 'sign-in-new-device', label: 'Sign in: verify this device', stage: (c) => c.go('verify', { ctx: 'device', email: 'you@example.com' }) },
  { group: 'Sign in', id: 'sign-in-new-device-provider', label: 'Sign in with Google on a new device: verify this device', stage: (c) => { c.setReview({ device: 'new' }); c.go('verify', { ctx: 'device', provider: 'google', email: 'you@example.com' }); } },
  { group: 'Sign in', id: 'code-expired', label: 'One-time code: expired', stage: (c) => c.go('verify', { ctx: 'device', email: 'you@example.com', preset: 'expired' }) },
  { group: 'Sign in', id: 'code-wrong', label: 'One-time code: wrong', stage: (c) => c.go('verify', { ctx: 'device', email: 'you@example.com', preset: 'wrong' }) },
  { group: 'Account', id: 'account-email', aliases: ['pass-card-none'], label: 'Account, email account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('account'); } },
  { group: 'Account', id: 'account-provider', label: 'Account, provider account (Google)', stage: (c) => { c.setView('free'); c.setConnected(true); c.setProvider('google'); c.go('account'); } },
  { group: 'Account', id: 'delete-account-confirm', label: 'Delete account: confirm', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('account', { stage: 'delete' }); } },
  { group: 'Account', id: 'delete-account-code-provider', label: 'Delete account, Google account: the code step', stage: (c) => { c.setView('free'); c.setConnected(true); c.setProvider('google'); c.go('account', { stage: 'delete-code' }); } },
  { group: 'Account', id: 'change-email-code', label: 'Change email: code step', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('account', { stage: 'email-code' }); } },
  { group: 'Username', id: 'username-new-account', label: 'Your username, after a Google sign-up (no account yet)', stage: (c) => c.go('username', { next: 'connect', provider: 'google' }) },
  { group: 'Username', id: 'username-taken', label: 'Your username, taken', stage: (c) => c.go('username', { next: 'connect', provider: 'google', preset: 'taken' }) },
  { group: 'Username', id: 'account-username-wait', label: 'Account, username in the 30-day wait', stage: (c) => { c.setView('free'); c.setConnected(true); c.setUser({ locked: true }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-monthly', label: 'Active, monthly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-yearly', label: 'Active, yearly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ plan: 'yearly' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-pending-switch', label: 'Pending switch to yearly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ pending: 'yearly' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-failed-pending-switch', label: 'Payment failed, with a switch to yearly pending', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'failed', pending: 'yearly' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-payment-failed', label: 'Payment failed', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'failed' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-ending', label: 'Ending', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'ending' }); c.go('account'); } },
  { group: 'Pass card', id: 'pass-card-lapsed', label: 'Lapsed', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('account'); } },
  { group: 'Billing', id: 'pass-page-subscribed-before', label: 'Pass page, had the Pass before', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('pass'); } },
  { group: 'Billing', id: 'subscribe', label: 'Subscribe page', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('subscribe'); } },
  { group: 'Billing', id: 'checkout', label: 'Payment provider checkout', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('checkout'); } },
  { group: 'Billing', id: 'update-card', label: 'Update-card page', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'failed' }); c.go('update-card'); } },
  { group: 'Billing', id: 'switch-sheet-yearly', label: 'Switch sheet: to yearly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('account', { sheet: 'switch' }); } },
  { group: 'Billing', id: 'switch-sheet-monthly', label: 'Switch sheet: to monthly', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ plan: 'yearly' }); c.go('account', { sheet: 'switch' }); } },
  { group: 'Billing', id: 'cancel-sheet', label: 'Cancel sheet', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('account', { sheet: 'cancel' }); } },
  { group: 'Billing', id: 'pass-cancel-sheet-payment-failed', label: 'Cancel sheet: payment failed (ends today)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'failed' }); c.go('account', { sheet: 'cancel' }); } },
  { group: 'Billing', id: 'pass-cancel-fails', label: 'Cancel sheet, the cancel fails', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ passFail: true }); c.go('account', { sheet: 'cancel' }); } },
  { group: 'Billing', id: 'pass-resume-fails', label: 'Ending card, Resume fails', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ status: 'ending' }); c.setReview({ passFail: true }); c.go('account'); } },
  { group: 'Billing', id: 'pass-switch-fails', label: 'Switch sheet, the switch fails', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ passFail: true }); c.go('account', { sheet: 'switch' }); } },
  { group: 'Billing', id: 'pass-keep-fails', label: 'Pending switch, Keep monthly fails', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setSub({ pending: 'yearly' }); c.setReview({ passFail: true }); c.go('account'); } },
  { group: 'Free and Pass', id: 'fp-pass-page-signed-out', label: 'Pass page, signed out', stage: (c) => { c.setView('out'); c.setConnected(true); c.go('pass'); } },
  { group: 'Site', id: 'not-found', label: 'Not found', stage: (c) => c.go('nowhere') },
  { group: 'Site', id: 'not-found-signed-in', label: 'Not found, signed in (Go home opens Discover)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('nowhere'); } },
  { group: 'Site', id: 'loading-full', label: 'Loading, full screen (held)', stage: (c) => c.go('loading') },
  { group: 'Site', id: 'loading-in-place', label: 'Loading, in place on Discover (held)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games', { load: 'hold' }); } },
  { group: 'Site', id: 'load-failed', label: 'Load failed, in place on Discover', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games', { load: 'failed' }); } },
  { group: 'Site', id: 'loading-page-discover', label: 'Loading, page: Discover (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('games', { hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-library', label: 'Loading, page: Library (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('library', { hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-history', label: 'Loading, page: History (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('history', { hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-history-game', label: 'Loading, page: History filtered to a game (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('history', { game: 'casebook', from: 'casebook', hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-product', label: 'Loading, page: a product page (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook', { hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-product-signed-out', label: 'Loading, page: a product page, signed out (held)', stage: (c) => { c.go('word', { hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-library-game', label: 'Loading, page: a library game page (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook', { page: 'record', hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-library-case', label: 'Loading, page: a case inside a library game (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook', { page: 'record', sid: CB_ID, hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-session', label: 'Loading, page: a session (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'delve', hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-pass', label: 'Loading, page: the Pass (held)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('pass', { hold: 'page' }); } },
  { group: 'Site', id: 'loading-page-account', label: 'Loading, page: Account (held)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('account', { hold: 'page' }); } },
  { group: 'Site', id: 'loading-part-discover-games', label: 'Loading, part: Discover, All games (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('games', { hold: 'part' }); } },
  { group: 'Site', id: 'loading-part-library-list', label: 'Loading, part: Library list (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('library', { hold: 'part' }); } },
  { group: 'Site', id: 'loading-part-history-results', label: 'Loading, part: History results (held)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('history', { hold: 'part' }); } },
  { group: 'Daily and weekly filters', id: 'filter-empty-discover', label: 'Discover, All games: Adventure and Daily, nothing matches', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('games', { kind: 'ADVENTURE', rhythm: 'daily' }); } },
  { group: 'Daily and weekly filters', id: 'filter-empty-library', label: 'Library: Genre Adventure, Schedule Daily, nothing matches', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('library', { kind: 'ADVENTURE', rhythm: 'daily' }); } },
  { group: 'Daily and weekly filters', id: 'filter-empty-history', label: 'History: Show 36,000 Summers Ago, Schedule Daily, nothing matches', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('history', { game: 'hunter', rhythm: 'daily' }); } },
  { group: 'Site', id: 'cant-connect', label: 'Can’t connect, full screen', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('offline'); } },
  // Every edition can be played; a finished one of a game played once says so.
  { group: 'Library', id: 'library-word-editions', label: 'Daily Word: every word (the editions list)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('word', { page: 'record', list: true }); } },
  { group: 'Library', id: 'edition-word-earlier', label: 'Daily Word: an earlier word not played, its prompt', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('word', { page: 'record', list: true, pgeOpen: PZ.word.all.find((x) => x.i > 0 && !x.played).id }); } },
  { group: 'Library', id: 'edition-word-done', label: 'Daily Word: an earlier word played (played once, no prompt)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('word', { page: 'record', list: true, pgeOpen: PZ.word.all[2].id }); } },
  { group: 'Library', id: 'library-mystery-editions', label: 'Daily Mystery: every case (the editions list)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('mystery', { page: 'record', list: true }); } },
  { group: 'Library', id: 'edition-mystery-earlier', label: 'Daily Mystery: an earlier case not played, its prompt', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('mystery', { page: 'record', list: true, pgeOpen: PZ.mystery.all.find((x) => x.i > 0 && !x.played).id }); } },
  { group: 'Library', id: 'edition-mystery-done', label: 'Daily Mystery: an earlier case played (played once, no prompt)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('mystery', { page: 'record', list: true, pgeOpen: PZ.mystery.all[2].id }); } },
  { group: 'Library', id: 'edition-casebook-done', label: 'Casebook: Case 1 played (played once, no prompt)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('casebook', { page: 'record', list: true, pgeOpen: CB_ALL[0].id }); } },
  { group: 'Library', id: 'edition-barrow-done', label: 'The Barrow: chapter 1 finished, its panel (start over, Copy, See in History)', stage: (c) => { c.setView('pass'); c.setConnected(true); gsPassSet({ bwDone: true }); c.go('barrow', { page: 'record', list: true, pgeOpen: 'bw1' }); } },
  { group: 'Library', id: 'edition-barrow-done-free', label: 'The Barrow, free account: chapter 1 finished, its panel; chapter 2 needs the Pass', stage: (c) => { c.setView('free'); c.setConnected(true); gsPassSet({ bwDone: true }); c.go('barrow', { page: 'record', list: true, pgeOpen: 'bw1' }); } },
  { group: 'Library', id: 'edition-delve-in-progress', label: 'Delve: run 1 in progress, its panel', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('delve', { page: 'record', list: true, pgeOpen: DV_ALL[0].id }); } },
  { group: 'Library', id: 'library-escape-two-in-progress', label: 'Escape in your library: two rooms in progress (this week’s and an earlier one)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live', several: true }); c.go('escape', { page: 'record' }); } },
  { group: 'Library', id: 'editions-escape-two-in-progress', label: 'Escape: every room, two in progress, no warning', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live', several: true }); c.go('escape', { page: 'record', list: true }); } },
  { group: 'Library', id: 'library-delve-two-in-progress', label: 'Delve in your library: two runs in progress (this week’s and an earlier one)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live', several: true }); c.go('delve', { page: 'record' }); } },
  { group: 'Library', id: 'editions-delve-two-in-progress', label: 'Delve: every run, two in progress, no warning', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live', several: true }); c.go('delve', { page: 'record', list: true }); } },
  { group: 'Library', id: 'editions-word-free', label: 'Daily Word, free account: every word (the editions list)', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('word', { page: 'record', list: true }); } },
  // A game added with sample editions (app/gs-more-games.jsx) and 36,000 Summers Ago: the library game page and the editions list every game has.
  { group: 'Library', id: 'library-cipher', label: 'Daily Cipher in your library (sample editions)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('cipher', { page: 'record' }); } },
  { group: 'Library', id: 'library-cipher-free', label: 'Daily Cipher in your library, free account: needs the Pass', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('cipher', { page: 'record' }); } },
  { group: 'Library', id: 'editions-cipher', label: 'Daily Cipher: every cipher (sample editions, numbered)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('cipher', { page: 'record', list: true }); } },
  { group: 'Library', id: 'editions-winter', label: 'The Long Winter: every chapter (sample editions, named, no dates)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('winter', { page: 'record', list: true }); } },
  { group: 'Library', id: 'editions-hunter', label: '36,000 Summers Ago: every summer (sample editions)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('hunter', { page: 'record', list: true }); } },
  { group: 'History', id: 'session-word-earlier', label: 'Session page, an earlier Daily Word played (played once)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: PZ.word.all[2].sid }); } },
  { group: 'History', id: 'session-mystery-earlier', label: 'Session page, an earlier Daily Mystery played (played once)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: PZ.mystery.all[2].sid }); } },
  { group: 'History', id: 'history-hunter', label: 'History, 36,000 Summers Ago (its days)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('history', { game: 'hunter', from: 'hunter' }); } },
  { group: 'History', id: 'history-search-empty', label: 'History, a search that matches nothing', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('history', { q: '#9999' }); } },
  { group: 'Pass ended today', id: 'pass-ended-today', label: 'Account, the Pass ended today', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true, endedOn: GS_DAY0.getTime() }); c.go('account'); } },
  { group: 'Pass ended today', id: 'library-hunter-pass-ended-today', label: '36,000 Summers Ago in your library, the Pass ended today', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true, endedOn: GS_DAY0.getTime() }); c.go('hunter', { page: 'record' }); } },
  { group: 'Pass ended today', id: 'history-pass-ended-today', label: 'History, the Pass ended today (keeps every play)', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true, endedOn: GS_DAY0.getTime() }); c.go('history'); } },
  { group: 'New account', id: 'new-account-library', label: 'Library, a new account (nothing played)', stage: (c) => { c.setView('free'); c.setUser({ username: 'NewPlayer', fresh: true, locked: true, since: GS_DAY0.getTime() }); c.go('library'); } },
  { group: 'New account', id: 'new-account-history', label: 'History, a new account (empty)', stage: (c) => { c.setView('free'); c.setUser({ username: 'NewPlayer', fresh: true, locked: true, since: GS_DAY0.getTime() }); c.go('history'); } },
  { group: 'New account', id: 'new-account-casebook-pass', label: 'Casebook in your library, a new account with the Pass', stage: (c) => { c.setView('pass'); c.setUser({ username: 'NewPlayer', fresh: true, locked: true, since: GS_DAY0.getTime() }); c.go('casebook', { page: 'record' }); } },
  { group: 'Ended unfinished', id: 'session-groups-unfinished', label: 'Session page, a Daily Groups day that ended unfinished', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ unfinished: true }); c.go('session', { id: 'groups-unfinished' }); } },
  { group: 'Ended unfinished', id: 'session-delve-unfinished', label: 'Session page, Delve run 1 in progress (Wren; no Delve week has ended yet)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('session', { id: 'delve-live' }); } },
  { group: 'Ended unfinished', id: 'history-unfinished', label: 'History, with a Daily Groups day that ended unfinished', stage: (c) => { c.setView('pass'); c.setConnected(true); c.setReview({ unfinished: true }); c.go('history'); } },
  { group: 'Site', id: 'sign-in-return-library', label: 'Signed out, opened the Library: Sign in, then the Library', stage: (c) => c.go('signin', { next: { name: 'library' } }) },
  { group: 'Site', id: 'session-unknown', label: 'A session address that doesn’t exist (not found)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('session', { id: 'nowhere' }); } },
  // Where, Chain and Salvage: held in app/gs-where-chain-salvage.jsx.
  ...(DP_STATES || []),
  // Directory listing mocks: held in app/directory-listings.jsx (droppable); absent ⇒ none.
  ...(DL_STATES || []),
];
// Notes, per group: how to exercise what a staged state
// can't hold still — a search term, a sequence of taps. Each line names the
// state it serves. Shown at the foot of the group on the states page and
// palette, and readable off window.KIT_STATE_NOTES.
KIT_STATE_GROUP_NOTES = {
  'Ended unfinished': [
    'Or set Config “Ended unfinished” to A day: the Daily Groups day shows as Not finished in History and on its library game page. Delve has one run so far, this week’s, so no Delve week can have ended unfinished; its state opens run 1 in progress.',
  ],
  'Username': [
    'Account, username change open: it is the Account page itself, the Username card shows its field whenever there is no wait. Change it to start the wait.',
    'Taken: in the demo only "taken", in any capitals, is taken. Your own current name never is.',
  ],
  'Sign in': [
    'Provider sign-in fails: tap Continue with Google or Continue with Apple. The line under the buttons clears on the next try.',
    'Google or Apple on a new device: set Config "Device, for Google and Apple sign-in" to New, then sign in with either. A Google or Apple sign-up never meets a code: it goes straight to Your username.',
    'One-time code: 000000 is expired; 111111, or fewer than six digits, is wrong; any other six digits pass.',
    'Provider sheet cancelled (Config): tapping Google or Apple leaves you on step 1 with nothing shown.',
  ],
  'Pass card': [
    'Every card state is on the Account page. The Pass page shows a Pass holder “You have the Pass” with Manage in account and the table, and no card, whatever the card’s state.',
  ],
  'Billing': [
    'Checkout: the card inputs only format; any input pays. The plan comes from the Pass page (Yearly by default).',
  ],
};
window.KIT_STATE_NOTES = KIT_STATE_GROUP_NOTES;
// The catalogue's own address. Not a state, so it is not in the register.
KIT_STATE_INDEX_NAMES = ['index', 'states'];
// ---- derived: the entries whose id can be an address -------------------------
// An id travels in a URL and is matched lowercased, so one that is not lowercase
// and URL-safe, is the catalogue's own name, or is already taken would show in
// the palette and still give a dead link. Such an entry is refused here, loudly,
// and everything below reads this list.
KIT_STATE_ID_RULE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
KIT_STATES_ACCEPTED = KIT_STATE_REGISTER.filter((s, i) => {
  for (const id of kitIdsOf(s)) {
    if (typeof id !== 'string' || !KIT_STATE_ID_RULE.test(id)) { kitRefuseState(id, 'an id is lowercase letters, digits and single hyphens'); return false; }
    if (KIT_STATE_INDEX_NAMES.includes(id)) { kitRefuseState(id, 'that name opens the states index'); return false; }
    if (KIT_STATE_REGISTER.slice(0, i).some((x) => kitIdsOf(x).includes(id)) || (s.aliases || []).includes(s.id)) { kitRefuseState(id, 'an earlier entry already has it'); return false; }
  }
  return true;
});
// ---- derived: what an agent or a script can read off the page --------------
// Names and labels only. Nothing runnable, so reading it can't stage anything.
window.KIT_STATES = KIT_STATES_ACCEPTED.map(({ id, aliases, label, group }) => ({ id, aliases: aliases || [], label, group }));
}
