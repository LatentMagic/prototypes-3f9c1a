// ============================================================================
// LM-666 candidate — the bridge. One handle (window.CircCandidate), one API,
// read per render by main.jsx and handed over through bind(). Every other file
// in this overlay set reads app state and mutations through window.CAND666.api
// and nothing else.
//
// This delta adds no candidate route, no card row and no feed lead, so those
// hooks are simply not published — main.jsx guards each one.
// ============================================================================
window.CAND666 = window.CAND666 || {};

window.CircCandidate = {
  bind: (api) => { window.CAND666.api = api; },
};
