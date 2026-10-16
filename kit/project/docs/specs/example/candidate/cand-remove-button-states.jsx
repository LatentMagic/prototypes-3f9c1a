// Candidate "remove-button": one staged state and its QA walk-through, added from this
// folder by wrapping the register's two entry points (skills/candidate-build, invariant 4).
// They exist only on this page.
const CAND_EG_STATE = { group: 'Candidate: remove-button', id: 'example-long-list', label: 'A long list to clear', stage: (c) => {
  c.set({ items: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: 'cand-' + n, title: 'Saved link ' + n, url: 'https://example.com/saved-' + n, status: 'active', createdAt: new Date(Date.now() - n * 86400000) })) });
  c.go('home');
} };

const candEgBuildStates = window.buildStates;
window.buildStates = (api) => {
  const built = candEgBuildStates(api);
  const st = { id: CAND_EG_STATE.id, label: CAND_EG_STATE.label, group: CAND_EG_STATE.group,
    go: () => { const c = kitStateContext(api); c.reseed(); CAND_EG_STATE.stage(c); } };
  built.states.push(st);
  built.byId[st.id] = st;
  built.groups.push({ title: st.group, notes: null, items: [st] });
  return built;
};

const candEgResolveState = window.kitResolveState;
window.kitResolveState = () => {
  let raw = null;
  try { raw = new URLSearchParams(window.location.search).get('state'); } catch (e) {}
  if ((raw || '').trim().toLowerCase() === CAND_EG_STATE.id) return { kind: 'state', id: CAND_EG_STATE.id };
  return candEgResolveState();
};

window.KIT_QA.push({
  key: 'candidate-remove-button', title: 'Candidate: remove-button',
  note: 'Remove items one at a time. 1. A long list to clear. 2. The queue with nothing in it.',
  steps: ['example-long-list', 'queue-empty'],
});
