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
function kitStateContext(api) {
  const reseed = () => api.setItems(api.seedItems.slice());
  // Config's "Reset to seeded data".
  // TODO(product): if the app persists state, clear it here too.
  const reset = () => reseed();
  return { ...api, reseed, reset };
}

// ---- THE REGISTER ----------------------------------------------------------
// Order here is the order the palette and the index read in. Group titles are
// plain strings; a new group is simply a new title.
const KIT_STATE_REGISTER = [
  { group: 'Placeholder', id: 'empty', label: 'Nothing on the screen', stage: (c) => c.setItems([]) },
  { group: 'Placeholder', id: 'with-items', label: 'The screen with items', stage: (c) => c.setItems(['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo']) },
];

// Notes, per group: how to exercise what a staged state
// can't hold still — a search term, a sequence of taps. Each line names the
// state it serves. Shown at the foot of the group on the states page and
// palette, and readable off window.KIT_STATE_NOTES.
const KIT_STATE_GROUP_NOTES = {
  'Placeholder': [
    'An example note. Both states restage the seed first, so each opens the same way whatever came before.',
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
