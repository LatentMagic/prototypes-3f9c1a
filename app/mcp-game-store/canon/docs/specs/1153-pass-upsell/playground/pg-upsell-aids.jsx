// ============================================================================
// Playground (pass-upsell-proposal): the kit's aids, extended from this folder only. Five player states (wraps window.buildStates
// and window.kitResolveState) and a QA walk-through (pushed onto KIT_QA). None of it exists on the main build's page.
// ============================================================================
const PGU_STATES = [
  { id: 'upsell-new-account', label: 'Pass upsell: new account, nothing played (Library)', stage: (c) => { c.setView('free'); c.setConnected(true); c.setUser({ fresh: true }); c.go('library'); } },
  { id: 'upsell-first-part-in-progress', label: 'Pass upsell: free first case in progress', stage: (c) => { c.setView('free'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('casebook', { page: 'record' }); } },
  { id: 'upsell-first-part-done', label: 'Pass upsell: free first case done', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('casebook', { page: 'record' }); } },
  { id: 'upsell-pass-ended', label: 'Pass upsell: Pass ended, back on Casebook', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('casebook', { page: 'record' }); } },
  { id: 'upsell-pass-holder', label: 'Pass upsell: Pass holder (Library)', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('library'); } },
];
const pguShipBuild = window.buildStates;
const pguShipResolve = window.kitResolveState;
const PGU_GROUP = 'Pass upsell proposal';
const pguBuildStates = (api) => {
  const r = pguShipBuild(api);
  let g = r.groups.find((x) => x.title === PGU_GROUP);
  if (!g) { g = { title: PGU_GROUP, notes: null, items: [] }; r.groups.push(g); }
  PGU_STATES.forEach((d) => {
    const s = { id: d.id, label: d.label, group: PGU_GROUP, go: () => { api.reset(); d.stage(api); PguStore.set({ bwDone: false }); } };
    r.states.push(s); r.byId[s.id] = s; g.items.push(s);
  });
  g.items.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base', numeric: true }));
  return r;
};
const pguResolve = () => {
  let n = '';
  try { n = (new URLSearchParams(window.location.search).get('state') || '').trim().toLowerCase(); } catch (e) { return null; }
  if (PGU_STATES.some((s) => s.id === n)) return { kind: 'state', id: n };
  return pguShipResolve ? pguShipResolve() : null;
};
if (window.KIT_STATES) PGU_STATES.forEach(({ id, label }) => window.KIT_STATES.push({ id, label, group: PGU_GROUP }));

(window.KIT_QA || []).unshift({ key: 'pass-upsell-proposal', title: 'Pass upsell proposal (playground)',
  note: 'At 390px and at desktop width. In the panel, open each section A to G in turn and press every variation of every item: the app must change at once and ring what changed. '
    + 'A: only 36,000 Summers Ago carries a lock (signed out and free; none with the Pass); no Free or First chips on the cards; Barrow’s card says chapter 3; no price; the pay line under the Pass section, word for word, gone from the foot. '
    + 'B: no box calls the shared edition gone or yesterday’s. C: the card shows for a new account and is gone once something is played; the Account switch. '
    + 'D: Play alone not started and in progress; Share and the Pass once done, in all three designs, on Casebook, Delve, Escape and the Barrow. E: every visit and once, then gone. '
    + 'F: sign in with Library on; the finished Daily Word link lands on Library with Played set under Filters, and Clear removes it. G: no “email me the link”.',
  steps: PGU_STATES.map((s) => s.id) });

Object.assign(window, { buildStates: pguBuildStates, kitResolveState: pguResolve });
