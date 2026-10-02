// ============================================================================
// Per-person pricing candidate — state. One small store the whole overlay set
// reads: which layout of the plan pick is showing (a review switch, not product),
// which plan is picked, and whether this account already subscribes. Persisted
// under its own key so it never touches the app's state. Nothing here is ratified.
// ============================================================================
const PP_KEY = 'circ_pp_v1';
const PP_PLANS = {
  monthly: { id: 'monthly', label: 'Monthly', price: '£5', per: 'month', full: '£5.00', unit: 'month' },
  yearly:  { id: 'yearly',  label: 'Yearly',  price: '£50', per: 'year',  full: '£50.00', unit: 'year' },
};
window.CircPP = (() => {
  // flow: form-first | pricing-first (create-a-circle order).  copy: A | B | C (free-month copy).
  // acct / sheet / champ: A | B | C designs of the account card, switch sheet, circle-settings line.
  let st = { option: 'cards', plan: 'yearly', subscribed: false, returning: false, autoAdvance: true, flow: 'form-first', copy: 'A', acct: 'A', sheet: 'A', champ: 'A',
    // v7 review options: v7 = pricing copy A|B|C (state 1) or S2; covers = on|off; nsub = A|B|C (non-subscriber card); quiet = hide the review chip.
    v7: null, covers: 'on', nsub: 'A', quiet: null,
    // v7 round 2: step = A | B | C (circle settings footer), stepSheet = null | choice | pick (C only), delp = delete-account line on.
    step: null, stepSheet: null, delp: false,
    // v8 round 3: one object so a single reset clears it. copy = B1|B2|B3 (state 1 lines), pill = P1|P2|P3 (yearly pill + picked card), al = L1|L2|L3 (account card actions).
    v8: null };
  try { Object.assign(st, JSON.parse(localStorage.getItem(PP_KEY) || '{}')); } catch (e) {}
  const subs = new Set();
  return {
    get: () => st,
    // A builder that resets v7 (the older ones in pp-takeover do) also clears v8, so a v8 flag never leaks through localStorage into another state.
    set(patch) { if (patch && patch.v7 === null && !('v8' in patch)) patch = { ...patch, v8: null }; st = { ...st, ...patch }; try { localStorage.setItem(PP_KEY, JSON.stringify(st)); } catch (e) {} subs.forEach((f) => f()); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
})();
const usePP = () => {
  const [, tick] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => window.CircPP.subscribe(tick), []);
  return window.CircPP.get();
};
// Day 30 of the trial, as a plain date ("29 Oct").
const ppChargeDate = () => new Date(Date.now() + 30 * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
// First payment after the free month or a paid period: a month or a year on.
const ppNextDate = (unit) => { const d = new Date(); if (unit === 'year') d.setFullYear(d.getFullYear() + 1); else d.setMonth(d.getMonth() + 1); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: unit === 'year' ? 'numeric' : undefined }); };
// The three accounts the review can play: never subscribed, subscribed now, subscribed before and lapsed.
const ppAccount = (st) => (st.subscribed ? 'subscribed' : st.returning ? 'returning' : 'none');
const PP_ACCOUNT_PATCH = { none: { subscribed: false, returning: false }, subscribed: { subscribed: true, returning: false }, returning: { subscribed: false, returning: true } };
Object.assign(window, { PP_PLANS, usePP, ppChargeDate, ppNextDate, ppAccount, PP_ACCOUNT_PATCH });
