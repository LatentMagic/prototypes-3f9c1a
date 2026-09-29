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
  let st = { option: 'cards', plan: 'yearly', subscribed: false, autoAdvance: true };
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
Object.assign(window, { PP_PLANS, usePP, ppChargeDate });
