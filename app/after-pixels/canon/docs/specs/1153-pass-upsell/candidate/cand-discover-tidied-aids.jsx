// Candidate (discover-tidied): the kit's aids, extended from this folder only.
// Config rows for every axis (wraps window.ConfigExtra), two player states (wraps window.buildStates and
// window.kitResolveState) and a QA walk-through (pushed onto KIT_QA). None of it exists on the main build's page.

// ---- Config: the axes, first in the modal, above canon's rows.
const CdtConfigRows = () => {
  const v = window.useCandDT(); const set = (p) => window.CandDT.set(p);
  const row = (label, key, opts, hint) => (
    <React.Fragment>
      <div className="kit-config-row">
        <div className="kit-config-row-label">{label}</div>
        <window.ConfigSeg value={v[key]} onChange={(x) => set({ [key]: x })} options={opts.map(([value, l]) => ({ value, label: l }))} />
      </div>
      {hint ? <div className="kit-config-hint">{hint}</div> : null}
    </React.Fragment>
  );
  const A = { 1: '“The start of select games comes with your account. The rest comes with the Pass.” About the Pass', 2: '“Everything else comes with the Pass.” See the Pass', 3: 'About the Pass, no sentence' };
  return (
    <React.Fragment>
      <div className="kit-config-eyebrow">Discover, tidied (candidate)</div>
      <div className="kit-config-hint">Every row changes Discover at once. The first choice of each is the default. The owner picks; none is settled.</div>
      {row('A. Pass link copy', 'a', [['1', '1'], ['2', '2'], ['3', '3']], A[v.a])}
      {row('B. Search and filters', 'b', [['1', '1 · Chips open'], ['2', '2 · Filter panel']])}
      {row('C. Free row title', 'c', [['1', 'Free to play'], ['2', 'Free with your account'], ['3', 'Start here']])}
      {row('D. Lock', 'd', [['1', '1 · Corner padlock'], ['2', '2 · Pass chip'], ['3', '3 · Bottom strip']])}
      {row('Lock on the wall', 'wall', [['off', 'Off'], ['on', 'On']], 'The lock shows on 36,000 Summers Ago only, and never with the Pass.')}
      {row('E. Note copy', 'e', [['a', 'a · First part of each'], ['b', 'b · Start of every game']], 'The note shows in the state “Discover, free account, every first part played”.')}
      {row('F. Word pick label', 'f', [['keep', 'Keep'], ['change', 'Change']], v.f === 'keep' ? 'FREE EVERY DAY' : 'A NEW WORD EVERY DAY')}
      {row('G. Free row subline', 'g', [['keep', 'Keep'], ['none', 'None']])}
      {row('H. Second pick', 'h', [['casebook', 'Casebook'], ['delve', 'Delve']])}
      {row('I. Free chips on cards', 'chips', [['off', 'Off'], ['on', 'On']])}
      {row('I. Part-free mark', 'part', [['none', 'None'], ['mark', 'Small mark']])}
      <button type="button" className="kit-config-btn-secondary" style={{ marginBottom: 12 }} onClick={() => set({ ...window.CAND_DT_DEFAULTS, allPlayed: v.allPlayed, noteGone: v.noteGone })}>Back to the defaults</button>
    </React.Fragment>
  );
};
const CdtShippedExtra = window.ConfigExtra;
const CdtConfigExtra = () => <React.Fragment><CdtConfigRows />{CdtShippedExtra ? <CdtShippedExtra /> : null}</React.Fragment>;

// ---- States: the two this candidate introduces. Signed out and Pass holder are canon's games-signed-out and games.
const CDT_STATES = [
  { id: 'discover-free-new', label: '6. Discover, free account, nothing played', stage: (c) => { c.setView('free'); c.setConnected(true); c.setUser({ fresh: true }); c.go('games'); } },
  { id: 'discover-free-all-played', label: '6. Discover, free account, every first part played', stage: (c) => { c.setView('free'); c.setConnected(true); c.go('games'); window.CandDT.set({ allPlayed: true }); } },
];
const cdtShippedBuild = window.buildStates;
const cdtShippedResolve = window.kitResolveState;
const cdtFresh = () => window.CandDT.set({ allPlayed: false, noteGone: false });
const cdtBuildStates = (api) => {
  const r = cdtShippedBuild(api);
  r.states.forEach((s) => { const go = s.go; s.go = () => { cdtFresh(); go(); }; });
  let g = r.groups.find((x) => x.title === 'Screens');
  if (!g) { g = { title: 'Screens', notes: null, items: [] }; r.groups.push(g); }
  CDT_STATES.forEach((d) => {
    const s = { id: d.id, label: d.label, group: 'Screens', go: () => { cdtFresh(); api.reset(); d.stage(api); } };
    r.states.push(s); r.byId[s.id] = s; g.items.push(s);
  });
  g.items.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base', numeric: true }));
  return r;
};
const cdtResolve = () => {
  let n = '';
  try { n = (new URLSearchParams(window.location.search).get('state') || '').trim().toLowerCase(); } catch (e) { return null; }
  if (CDT_STATES.some((s) => s.id === n)) return { kind: 'state', id: n };
  return cdtShippedResolve();
};
if (window.KIT_STATES) CDT_STATES.forEach(({ id, label }) => window.KIT_STATES.push({ id, label, group: 'Screens' }));

// ---- QA walk-through.
(window.KIT_QA || []).unshift({ key: 'discover-tidied', title: 'Discover, tidied (candidate)',
  note: 'Each state at 390px and desktop width. Search and filters come first under Discover; no game shows twice above All games; Daily Groups is not shown. '
    + 'Only 36,000 Summers Ago carries a lock, on its art, and not with the Pass. In each state, step through Config: A 1 to 3 (the Pass line, gone with the Pass), B 1 and 2 (open Filter, set a chip, remove it from under the bar), '
    + 'C 1 to 3, D 1 to 3 with Lock on the wall Off and On, E a and b (every first part played; Got it removes the note for good), F, G, H, and both I switches.',
  steps: ['games-signed-out', 'discover-free-new', 'discover-free-all-played', 'games'] });

Object.assign(window, { ConfigExtra: CdtConfigExtra, buildStates: cdtBuildStates, kitResolveState: cdtResolve });
