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
    // v7 review options: v7 = pricing copy A|B|C (state 1) or S2; covers = on|off; nsub = A|B|C (non-subscriber card); label = overlay text.
    v7: null, covers: 'on', nsub: 'A', label: null };
  try { Object.assign(st, JSON.parse(localStorage.getItem(PP_KEY) || '{}')); } catch (e) {}
  const subs = new Set();
  return {
    get: () => st,
    set(patch) { st = { ...st, ...patch }; try { localStorage.setItem(PP_KEY, JSON.stringify(st)); } catch (e) {} subs.forEach((f) => f()); },
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
