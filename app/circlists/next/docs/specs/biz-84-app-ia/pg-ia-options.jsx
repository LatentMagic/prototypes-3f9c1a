// ============================================================================
// App IA playground — the directions under exploration + their intended answers
// ----------------------------------------------------------------------------
// The complaint being explored: Add and circle Settings are LOCAL TO A CIRCLE,
// but the bottom bar reads as global navigation. Each option below takes a
// different position on where circle-local actions belong, and every option
// carries its own intended answer to every lever (`def`) so the heading toggles
// can A/B a single lever across all five without flattening them.
// ============================================================================

// Levers, and what each value means:
//   home     — is there an account-level HOME screen, and how does it relate to
//              the circle? 'none' (no home — 01–05), 'root' (home is the parent,
//              reached by a back control in the top bar), 'slot' (home is a peer
//              destination and the bar is permanent), 'push' (home is the parent
//              AND the way back is a bar slot — so the bar exists only inside a
//              circle, which is what makes every slot in it unambiguously local).
//   reading  — is there an explicit "Reading" tab, or is the feed implicit?
//   entry    — where the circle switcher is REACHED from (bottom tab / top chip).
//              Deliberately independent of `circles`, which is only how it
//              APPEARS — so chip-entry can be compared against every container.
//   circles  — presentation of the circle switcher
//   account  — presentation of the account menu
//   add      — where/how add-a-link is offered
//   settings — where circle settings is reached
const PG_IA_OPTIONS = [
  {
    id: 'five', n: '01', name: 'Five slots',
    ia: 'Reading · Circles · Add · Settings · Account',
    claim: 'Everything reachable in one tap. Even, symmetric, docked Add.',
    cost: 'Two of five tabs are circle-local — the bar mixes scopes.',
    def: { reading: true, entry: 'tab', circles: 'sheet', account: 'sheet', add: 'dock', settings: 'bar', scopeHint: true },
  },
  {
    id: 'four', n: '02', name: 'Four slots, settings inside Circles',
    ia: 'Reading · Circles · Add · Account',
    claim: 'Settings is a row on the active circle in the Circles sheet — circle-local config sits with circles.',
    cost: 'Add is still the only local action in a global bar. Four slots + dock is asymmetric again.',
    def: { reading: true, entry: 'tab', circles: 'sheet', account: 'sheet', add: 'dock', settings: 'insheet', scopeHint: true },
  },
  {
    id: 'three', n: '03', name: 'Three slots, feed implicit',
    ia: 'Circles · Add · Account',
    claim: 'The feed IS the home, so it needs no tab. Three slots put Add dead centre; settings returns to a top-bar gear.',
    cost: 'No visible way back to the feed from a sheet-less state; "where am I" leans entirely on the top bar.',
    def: { reading: false, entry: 'tab', circles: 'sheet', account: 'sheet', add: 'dock', settings: 'top', scopeHint: true },
  },
  {
    id: 'scope', n: '04', name: 'Scope split',
    ia: 'bar: Reading · Circles · Account  ·  in-content: Add + Settings',
    claim: 'The bar holds only global destinations. Circle-local actions live in a sticky circle header, in the same scope as the content they act on.',
    cost: 'Add loses the thumb zone and the big accent moment.',
    def: { reading: true, entry: 'tab', circles: 'sheet', account: 'sheet', add: 'inline', settings: 'inline', scopeHint: false },
  },
  {
    id: 'chip', n: '05', name: 'Circle chip up top',
    ia: 'top: circle chip ▾ + gear  ·  bar: Reading · Add · Account',
    claim: 'Circle context is a place, not a tab: the top chip names where you are and opens the switcher from there. Bar keeps three even slots around a centred Add.',
    cost: 'Switching circles moves out of the thumb zone.',
    def: { reading: true, entry: 'chip', circles: 'chipmenu', account: 'sheet', add: 'dock', settings: 'top', scopeHint: true },
  },
  {
    id: 'homeroot', n: '06', name: 'Home above the circle',
    ia: 'home: circles + account  ·  in a circle: Reading · Add · Settings',
    claim: 'One scope per screen. Home is the account level — your circles and your account, a place rather than an overlay. Entering a circle pushes into the circle level, where every bar slot is circle-bound. Nothing in the bar is global, so nothing mixes.',
    cost: 'Home carries no bottom bar, so the app has two chromes. And Reading is a tab for the screen you are already on — it earns its slot only as the way back from Add or Settings.',
    def: { home: 'root', reading: true, entry: 'home', circles: 'page', account: 'page', add: 'dock', settings: 'bar', scopeHint: false },
  },
  {
    id: 'homeslot', n: '07', name: 'Home alongside the circle',
    ia: 'bar everywhere: Home · Add · [circle name]  ·  reading implicit',
    claim: 'The bar is constant and never changes shape. The third slot is not a gear labelled Settings — it carries the circle\'s own tile and name, so it cannot be read as app settings. Home is the way out to account level; the other two are visibly the circle\'s. A circle IS its reading list, so Reading needs no tab.',
    cost: 'The circle name appears twice in a circle — page title above, slot below. On Home the slot still names the circle you last opened.',
    def: { home: 'slot', reading: false, entry: 'home', circles: 'page', account: 'page', add: 'dock', settings: 'circle', scopeHint: true },
  },
  {
    id: 'homebar', n: '08', name: 'Home in the circle bar',
    ia: 'home: no bar  ·  in a circle: Home · Add · Settings',
    claim: 'The bar is rendered only inside a circle, so the bar IS the circle scope — a plain "Settings" cannot mean the app, because you can never see this bar from outside a circle. Home is the way out, not a peer destination, so nothing in the bar acts on a circle you are not looking at.',
    cost: 'Two chromes: home has none. Switching circles is Home-then-pick, and Home occupies a slot that does nothing while you are already there.',
    def: { home: 'push', reading: false, entry: 'home', circles: 'page', account: 'page', add: 'dock', settings: 'bar', scopeHint: false },
  },
];

// ---- Config levers (heading). 'auto' = use the option's own intended answer. --
const PG_IA_LEVERS = [
  { key: 'home', label: 'Home screen', group: 'ia', opts: [['auto', 'Auto'], ['none', 'None'], ['root', 'Root'], ['slot', 'Bar slot'], ['push', 'Root + Home slot']] },
  { key: 'reading', label: 'Reading tab', group: 'ia', opts: [['auto', 'Auto'], ['on', 'On'], ['off', 'Off']] },
  { key: 'entry', label: 'Circles entry', group: 'ia', opts: [['auto', 'Auto'], ['tab', 'Tab'], ['chip', 'Top chip']] },
  { key: 'circles', label: 'Circles as', group: 'present', opts: [['auto', 'Auto'], ['sheet', 'Sheet'], ['page', 'Full page'], ['chipmenu', 'Menu'], ['inset', 'Inset card']] },
  { key: 'account', label: 'Account as', group: 'present', opts: [['auto', 'Auto'], ['sheet', 'Sheet'], ['page', 'Full page'], ['inset', 'Inset card']] },
  { key: 'sheetHead', label: 'Sheet header', group: 'present', opts: [['auto', 'Auto'], ['grab', 'Grabber'], ['title', 'Title + Done']] },
  { key: 'add', label: 'Add', group: 'ia', opts: [['auto', 'Auto'], ['dock', 'Docked'], ['flat', 'Flat slot'], ['inline', 'In content']] },
  { key: 'settings', label: 'Settings', group: 'ia', opts: [['auto', 'Auto'], ['bar', 'Bar slot'], ['circle', 'Named slot'], ['top', 'Top gear'], ['insheet', 'In Circles'], ['inline', 'In content']] },
  { key: 'scopeHint', label: 'Scope hint on Add', group: 'ia', opts: [['auto', 'Auto'], ['on', 'On'], ['off', 'Off']] },
];

const PG_IA_DEFAULT_CFG = { home: 'auto', reading: 'auto', entry: 'auto', circles: 'auto', account: 'auto', sheetHead: 'auto', add: 'auto', settings: 'auto', scopeHint: 'auto' };

// The one place option intent and explicit overrides combine.
function pgMergeCfg(option, ov) {
  const d = option.def;
  const pick = (k, fallback) => (!ov[k] || ov[k] === 'auto' ? fallback : ov[k]);
  return {
    home: pick('home', d.home || 'none'),
    reading: !ov.reading || ov.reading === 'auto' ? d.reading : ov.reading === 'on',
    entry: pick('entry', d.entry || 'tab'),
    circles: pick('circles', d.circles),
    account: pick('account', d.account),
    add: pick('add', d.add),
    settings: pick('settings', d.settings),
    sheetHead: !ov.sheetHead || ov.sheetHead === 'auto' ? 'grab' : ov.sheetHead,
    scopeHint: !ov.scopeHint || ov.scopeHint === 'auto' ? d.scopeHint : ov.scopeHint === 'on',
  };
}

// ---- Seed: enough circles to make switching real, enough feed to scroll ------
const PG_IA_CIRCLES = [
  { id: 'c1', name: 'Backend Pod', members: 8, unread: 3 },
  { id: 'c2', name: 'Design Weekly', members: 5, unread: 0 },
  { id: 'c3', name: 'Book Club', members: 12, unread: 7 },
  { id: 'c4', name: 'Rust Reading Group', members: 4, unread: 1 },
];

const PG_IA_USER = { firstName: 'Alex', lastName: 'Doyle', email: 'alex.doyle@example.com' };

const PG_IA_FEED = [
  { url: 'https://newsletter.pragmaticengineer.com/p/scaling-on-call', title: 'Scaling on-call without burning the team', by: 'Marcus T.', read: false },
  { url: 'https://blog.rust-lang.org/2026/01/async-internals', title: 'Async internals, one layer at a time', by: 'Priya N.', read: false },
  { url: 'https://martinfowler.com/articles/cd-pipeline.html', title: 'Continuous delivery pipelines', by: 'Sam R.', read: false },
  { url: 'https://danluu.com/percentile-latency/', title: 'Latency percentiles and what they hide', by: 'Sam R.', read: true },
  { url: 'https://jvns.ca/blog/2026/02/dns-resolvers/', title: 'How DNS resolvers actually resolve', by: 'Priya N.', read: true },
  { url: 'https://go.dev/blog/pipelines', title: 'Pipelines and cancellation', by: 'Marcus T.', read: true },
];

Object.assign(window, { PG_IA_OPTIONS, PG_IA_LEVERS, PG_IA_DEFAULT_CFG, pgMergeCfg, PG_IA_CIRCLES, PG_IA_USER, PG_IA_FEED });
