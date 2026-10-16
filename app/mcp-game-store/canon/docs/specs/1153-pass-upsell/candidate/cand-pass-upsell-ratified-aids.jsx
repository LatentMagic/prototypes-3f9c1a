// Candidate (pass-upsell-ratified): the kit's aids, extended from this folder only. One Config row (wraps window.ConfigExtra),
// the candidate's states (wraps window.buildStates and window.kitResolveState) and a QA walk-through (pushed onto KIT_QA).
// None of it exists on the main build's page.

// ---- Config: the seed has no played flag per edition, so New for you is empty for most players. This stages it full.
const CprConfigRows = () => {
  const v = useCpr();
  return (
    <React.Fragment>
      <div className="kit-config-eyebrow">How the site mentions the Pass (candidate)</div>
      <div className="kit-config-row">
        <div className="kit-config-row-label">New editions</div>
        <window.ConfigSeg value={v.newEds} onChange={(x) => CandPUR.set({ newEds: x })} options={[{ value: 'seed', label: 'As seeded' }, { value: 'most', label: 'Most not played' }]} />
      </div>
      <div className="kit-config-hint">Most not played treats every game but Daily Word as having an edition you haven’t played, so Library’s New for you shows full.</div>
      <div className="kit-config-row">
        <div className="kit-config-row-label">The Barrow, chapter 1</div>
        <window.ConfigSeg value={v.bwDone ? 'done' : 'none'} onChange={(x) => CandPUR.set({ bwDone: x === 'done' })} options={[{ value: 'none', label: 'Not played' }, { value: 'done', label: 'Finished' }]} />
      </div>
    </React.Fragment>
  );
};
const CprShippedExtra = window.ConfigExtra;
const CprConfigExtra = () => <React.Fragment><CprConfigRows />{CprShippedExtra ? <CprShippedExtra /> : null}</React.Fragment>;

// ---- States: only on this page.
const CPR_GROUP = 'Pass upsell (candidate)';
const CPR_STATES = [
  { id: 'pur-new-account', label: '1. Library, free account, nothing played', stage: (c) => { c.setView('free'); c.setConnected(true); c.setUser({ fresh: true }); c.go('library'); } },
  { id: 'pur-new-for-you', label: '2. Library, New for you full', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('library'); CandPUR.set({ newEds: 'most' }); } },
  { id: 'pur-first-in-progress', label: '3. Casebook, free first case in progress', stage: (c) => { c.setView('free'); c.setConnected(true); c.setReview({ week: 'live' }); c.go('casebook', { page: 'record' }); } },
  { id: 'pur-first-done', label: '4. Casebook, free first case done', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('casebook', { page: 'record' }); } },
  { id: 'pur-barrow-done', label: '5. The Barrow, free chapter 1 done', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('barrow', { page: 'record' }); CandPUR.set({ bwDone: true }); } },
  { id: 'pur-word-done', label: '6. Daily Word, today’s word done', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('word', { page: 'record' }); } },
  { id: 'pur-pass-ended', label: '7. Casebook, Pass ended', stage: (c) => { c.setView('free'); c.setConnected(true); c.setSub({ hadPass: true }); c.go('casebook', { page: 'record' }); } },
  { id: 'pur-pass-holder', label: '8. Library, Pass holder', stage: (c) => { c.setView('pass'); c.setConnected(true); c.go('library'); } },
  { id: 'pur-discover-free', label: '9. Discover, free account', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games'); } },
];
const cprShippedBuild = window.buildStates;
const cprShippedResolve = window.kitResolveState;
const cprFresh = () => CandPUR.set({ ...CPR_DEFAULTS });
const cprBuildStates = (api) => {
  const r = cprShippedBuild(api);
  r.states.forEach((s) => { const go = s.go; s.go = () => { cprFresh(); go(); }; });
  let g = r.groups.find((x) => x.title === CPR_GROUP);
  if (!g) { g = { title: CPR_GROUP, notes: null, items: [] }; r.groups.unshift(g); }
  CPR_STATES.forEach((d) => {
    const s = { id: d.id, label: d.label, group: CPR_GROUP, go: () => { cprFresh(); api.reset(); d.stage(api); } };
    r.states.push(s); r.byId[s.id] = s; g.items.push(s);
  });
  return r;
};
const cprResolve = () => {
  let n = '';
  try { n = (new URLSearchParams(window.location.search).get('state') || '').trim().toLowerCase(); } catch (e) { return null; }
  if (CPR_STATES.some((s) => s.id === n)) return { kind: 'state', id: n };
  return cprShippedResolve ? cprShippedResolve() : null;
};
if (window.KIT_STATES) CPR_STATES.forEach(({ id, label }) => window.KIT_STATES.push({ id, label, group: CPR_GROUP }));

// ---- QA walk-through.
(window.KIT_QA || []).unshift({ key: 'pass-upsell-ratified', title: 'How the site mentions the Pass (candidate)',
  note: 'At 390px and desktop width. Home signed out: only 36,000 Summers Ago has the Pass pill, top right; no Free or First chips; Barrow card says CHAPTER 3; the Pass section is one paragraph, “the Pass” its only link. '
    + 'Pricing: the pay line under the price, right-aligned beside the button, left-aligned when it is full width. Product pages signed out and free: Daily Word, Casebook, the Barrow, 36,000 Summers Ago; no pay line in any box. '
    + 'Sign in: lands on Library. Then each state below. Discover: search and Filters as History; Free to play holds every free game, Daily Word included; no Play any time row; the Pass pill on 36,000 Summers Ago in All games; no Pass line.',
  steps: CPR_STATES.map((s) => s.id) });

Object.assign(window, { ConfigExtra: CprConfigExtra, buildStates: cprBuildStates, kitResolveState: cprResolve });
