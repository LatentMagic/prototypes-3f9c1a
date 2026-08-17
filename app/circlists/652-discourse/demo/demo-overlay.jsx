// ============================================================================
// Circlists homepage demo — the overlay. Loads FIRST in circlists-homepage-demo.html,
// before every app module, and does the least it can:
//
//   1. Arms the preview gate that app/main.jsx already carries. New circle,
//      circle settings and the account control then open the sign-up blocker
//      instead of routing on. Those three doors are the gate's whole scope —
//      widening it is a product decision, not a demo one.
//   2. Gives the demo its own persisted-state key, so it never mixes with the
//      working line's or a candidate build's.
//
// It changes nothing in app/ and adds no behaviour. The demo's seed is its own
// file (demo/demo-seed.jsx), loaded in place of app/seed-data.jsx.
//
// NOT set here, deliberately: window.CIRC_TWEAK_DEFAULTS. That is where the
// marketing-page wrapper injects the layout mode it decides for the iframe —
// setting it here would silently override the wrapper.
// ============================================================================
window.CIRC_FORCE_GATE = true;
window.CIRC_STATE_KEY = 'circ_demo_state_v1';
