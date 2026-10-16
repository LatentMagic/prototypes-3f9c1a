// Candidate (discover-games-hub): the kit's aids, extended from this folder only.
// Config rows for every axis (wraps window.ConfigExtra), two player states (wraps window.buildStates and
// window.kitResolveState) and a QA walk-through (pushed onto KIT_QA). None of it exists on the main build's page.

const CghConfigRows = () => {
  const v = window.useCandGH(); const set = (p) => window.CandGH.set(p);
  const row = (label, key, opts, hint) => (
    <React.Fragment>
      <div className="kit-config-row">
        <div className="kit-config-row-label">{label}</div>
        <window.ConfigSeg value={v[key]} onChange={(x) => set({ [key]: x })} options={opts.map(([value, l]) => ({ value, label: l }))} />
      </div>
      {hint ? <div className="kit-config-hint">{hint}</div> : null}
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <div className="kit-config-eyebrow">Discover as a games hub (candidate)</div>
      <div className="kit-config-hint">Every row changes Discover at once. The first choice of each is the default. The owner picks; none is settled.</div>
      {row('A. The Pass in the hub', 'a', [['1', '1 · Nothing'], ['2', '2 · Link'], ['3', '3 · Sentence and link']], 'Shown at the foot of Discover; never to a Pass holder.')}
      {row('B. Grouping', 'b', [['1', '1 · By rhythm'], ['2', '2 · By genre']])}
      {row('C. Second door', 'c', [['1', '1 · Every case'], ['2', '2 · All cases'], ['3', '3 · None']])}
      {row('D. Lock on hub tiles', 'lock', [['off', 'Off'], ['on', 'On']], 'On 36,000 Summers Ago only, and never with the Pass.')}
      {v.lock === 'on' ? row('D. Lock treatment', 'd', [['1', '1 · Corner padlock'], ['2', '2 · Pass pill'], ['3', '3 · Bottom strip']]) : null}
      {row('E. State-line copy', 'e', [['1', '1 · Library’s wording'], ['2', '2 · Shorter']])}
      {row('F. Play door', 'f', [['1', '1 · Library-style'], ['2', '2 · Play'], ['3', '3 · None']])}
      {row('G. Free chips on tiles', 'chips', [['off', 'Off'], ['on', 'On']])}
      {row('G. Part-free mark', 'part', [['none', 'None'], ['mark', 'Small mark']])}
      <button type="button" className="kit-config-btn-secondary" style={{ marginBottom: 12 }} onClick={() => set({ ...window.CAND_GH_DEFAULTS })}>Back to the defaults</button>
    </React.Fragment>
  );
};
const CghShippedExtra = window.ConfigExtra;
const CghConfigExtra = () => <React.Fragment><CghConfigRows />{CghShippedExtra ? <CghShippedExtra /> : null}</React.Fragment>;

// ---- States: the two this candidate introduces. Signed out and Pass holder are canon's games-signed-out and games.
const CGH_STATES = [
  { id: 'hub-free-new', label: '6. Discover hub, free account, nothing played', stage: (c) => { c.setView('free'); c.setConnected(true); c.setUser({ fresh: true }); c.go('games'); } },
  { id: 'hub-free-firsts-played', label: '6. Discover hub, free account, every first part played', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games'); window.CandGH.set({ allFirst: true }); } },
];
const cghShippedBuild = window.buildStates;
const cghShippedResolve = window.kitResolveState;
const cghFresh = () => window.CandGH.set({ allFirst: false });
const cghBuildStates = (api) => {
  const r = cghShippedBuild(api);
  r.states.forEach((s) => { const go = s.go; s.go = () => { cghFresh(); go(); }; });
  let g = r.groups.find((x) => x.title === 'Screens');
  if (!g) { g = { title: 'Screens', notes: null, items: [] }; r.groups.push(g); }
  CGH_STATES.forEach((d) => {
    const s = { id: d.id, label: d.label, group: 'Screens', go: () => { cghFresh(); api.reset(); d.stage(api); } };
    r.states.push(s); r.byId[s.id] = s; g.items.push(s);
  });
  g.items.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base', numeric: true }));
  return r;
};
const cghResolve = () => {
  let n = '';
  try { n = (new URLSearchParams(window.location.search).get('state') || '').trim().toLowerCase(); } catch (e) { return null; }
  if (CGH_STATES.some((s) => s.id === n)) return { kind: 'state', id: n };
  return cghShippedResolve();
};
if (window.KIT_STATES) CGH_STATES.forEach(({ id, label }) => window.KIT_STATES.push({ id, label, group: 'Screens' }));

(window.KIT_QA || []).unshift({ key: 'discover-games-hub', title: 'Discover as a games hub (candidate)',
  note: 'Each state at 390px and desktop width. Search and chips come first under Discover; every game shows once, Daily Groups not at all. '
    + 'Signed out: no state line, no play door, no second door. In each state, step through Config: A 1 to 3 (the link opens the Pass page; nothing for a Pass holder), B 1 and 2, '
    + 'C 1 to 3, D Off and On with treatments 1 to 3 (36,000 Summers Ago only, never with the Pass), E 1 and 2, F 1 to 3, and both G switches. Search a name and set chips; no match shows Show every game.',
  steps: ['games-signed-out', 'hub-free-new', 'hub-free-firsts-played', 'games'] });

Object.assign(window, { ConfigExtra: CghConfigExtra, buildStates: cghBuildStates, kitResolveState: cghResolve });
