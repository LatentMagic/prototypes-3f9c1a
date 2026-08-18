// ============================================================================
// LM-666 candidate — staging.
//
// PLACEMENT (my call): these live in the STATES register, not in Config's own
// controls. The brief says "the config panel", which is where staging used to
// sit; it moved to the register (app/states.jsx) so every staged state has an
// address a ticket can link to. They are reached from the same launcher pill, in
// its States half, and each one is addressable (?state=delete-as-champion).
//
// Three viewer roles, one per dialog shape, plus the arrival-marks case:
//   delete-as-contributor — a link YOU added, in a circle you do not champion
//   delete-as-champion    — someone else's link, in YOUR circle
//   delete-as-member      — someone else's link, in a circle you do not champion
//   delete-quiet-arrival  — a circle whose only arrival you deleted for yourself
// Each lands the feed on a card the role applies to, so the bin opens the right
// dialog immediately.
// ============================================================================
const lm666ShippedBuildStates = window.buildStates;

const lm666Mine = (it) => /^added by\s+you\b/i.test(it.attribution || '');

// Lead the feed with the card the role is about: unread (so it sits on Active),
// first in the list, and the circle carries no delete-for-me of its own.
const lm666Lead = (api, spaceId, pick) => {
  const { seedSpaces, DEFAULT_USER } = window.CircSeed;
  api.setUser(DEFAULT_USER);
  api.setSpaces((prev) => {
    const base = prev.some((s) => s.id === spaceId) ? prev : seedSpaces(DEFAULT_USER.email);
    return base.map((s) => {
      if (s.id !== spaceId) return s;
      const i = s.items.findIndex(pick);
      const rest = s.items.filter((_, k) => k !== i);
      const lead = i > -1 ? [{ ...s.items[i], read: false }, ...rest] : s.items;
      return { ...s, funded: true, dormancy: null, items: lead,
        hiddenForMe: [], pending: [], queued: [], remoteDeleted: [] };
    });
  });
  api.setCurrentId(spaceId); api.setTab('active'); api.setRoute('space'); api.setLoadingFeed(false);
};

// A circle holding one unread arrival, already deleted for this member. The
// member stands in another circle, so the rail / home row is where it reads:
// no dot, and nothing marking where the link was.
const lm666QuietArrival = (api) => {
  const { seedSpaces, DEFAULT_USER } = window.CircSeed;
  const now = Date.now();
  api.setUser(DEFAULT_USER);
  api.setSpaces((prev) => {
    const base = prev.some((s) => s.id === 'sp-book') ? prev : seedSpaces(DEFAULT_USER.email);
    return base.map((s) => {
      if (s.id !== 'sp-book') return s;
      const arrival = s.items.find((i) => !lm666Mine(i)) || s.items[0];
      if (!arrival) return s;
      return { ...s, funded: true, dormancy: null, unseen: true, lastSeenAt: now - 1000,
        items: s.items.map((i) => (i.id === arrival.id ? { ...i, read: false, at: now } : i)),
        hiddenForMe: [arrival.id], pending: [], queued: [], remoteDeleted: [] };
    });
  });
  api.setCurrentId('sp-backend'); api.setTab('active'); api.setRoute('space'); api.setLoadingFeed(false);
};

const LM666_REGISTER = [
  { group: 'Deleting a link', id: 'delete-as-contributor', label: 'A link you added (not your circle)',
    stage: (api) => lm666Lead(api, 'sp-sam', lm666Mine) },
  { group: 'Deleting a link', id: 'delete-as-champion', label: 'Champion \u2014 someone else\u2019s link',
    stage: (api) => lm666Lead(api, 'sp-backend', (it) => !lm666Mine(it)) },
  { group: 'Deleting a link', id: 'delete-as-member', label: 'Member \u2014 someone else\u2019s link',
    stage: (api) => lm666Lead(api, 'sp-book', (it) => !lm666Mine(it)) },
  { group: 'Deleting a link', id: 'delete-quiet-arrival', label: 'Arrival you deleted for yourself',
    stage: lm666QuietArrival },
];

function lm666BuildStates(api) {
  const base = lm666ShippedBuildStates
    ? lm666ShippedBuildStates(api)
    : { states: [], byId: {}, groups: [], reset: null };
  const extra = LM666_REGISTER.map((s) => ({ id: s.id, label: s.label, group: s.group, go: () => s.stage(api) }));
  const groups = [...base.groups, { title: LM666_REGISTER[0].group, items: extra }];
  const byId = { ...base.byId };
  extra.forEach((s) => { byId[s.id] = s; });
  return { states: [...base.states, ...extra], byId, groups, reset: base.reset };
}

// The register's own derived surfaces: the page-level list, and the resolver's
// idea of which names exist (a candidate address must resolve, not land on the
// index). The shipped resolver reads its own closed list, so it is wrapped too.
window.CIRC_STATES = [...(window.CIRC_STATES || []), ...LM666_REGISTER.map(({ id, label, group }) => ({ id, label, group }))];
const lm666ShippedResolve = window.circResolveState;
function lm666ResolveState() {
  const r = lm666ShippedResolve ? lm666ShippedResolve() : null;
  if (r && r.kind === 'unresolved' && LM666_REGISTER.some((s) => s.id === r.name)) return { kind: 'state', id: r.name };
  return r;
}

Object.assign(window, { buildStates: lm666BuildStates, circResolveState: lm666ResolveState });
