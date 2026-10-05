// ============================================================================
// Per-person pricing candidate — the subscription store. The person, not the
// circle, holds the subscription. One small store every overlay reads, persisted
// under its own key. Nothing here is ratified.
//   status: none | trial | active | failed | ending
//   usedFreeMonth: whether this person has had the free month (keys the pricing screen)
//   plan / pending: the plan held, and a switch waiting for the next renewal
//   ctx: where the subscription page was opened from { from, spaceId, name, paid }
//   pick: the plan picked on the pricing screen
//   wasTrial: cancelled during the free month, so Resume returns to it
//   fixed: 'resumed' | 'card' while a lapsing fix made from a circle or the create form is fresh (its receipt line)
// ============================================================================
const PPP_KEY = 'circ_ppp_v1';
const PPP_PLANS = {
  monthly: { id: 'monthly', label: 'Monthly', price: '\u00a33', full: '\u00a33.00', unit: 'month', a: '\u00a33 a month' },
  yearly: { id: 'yearly', label: 'Yearly', price: '\u00a330', full: '\u00a330.00', unit: 'year', a: '\u00a330 a year' },
};
const PPP_DEFAULT = { status: 'active', plan: 'monthly', pending: null, usedFreeMonth: true, ctx: null, pick: 'yearly', sheet: null, fixed: null };
const PPP_RENEW_DAYS = 18, PPP_TRIAL_DAYS = 18;

window.CircPPP = (() => {
  let st = { ...PPP_DEFAULT };
  try { Object.assign(st, JSON.parse(localStorage.getItem(PPP_KEY) || '{}'), { sheet: null }); } catch (e) {}
  const subs = new Set();
  return {
    get: () => st,
    set(p) {
      st = { ...st, ...p };
      try { const { sheet, ...keep } = st; localStorage.setItem(PPP_KEY, JSON.stringify(keep)); } catch (e) {}
      subs.forEach((f) => f());
    },
    reset(p) { this.set({ ...PPP_DEFAULT, ...(p || {}) }); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
})();
const usePPP = () => {
  const [, tick] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => window.CircPPP.subscribe(tick), []);
  return window.CircPPP.get();
};
const pppSubscribed = (st) => st.status !== 'none';
const pppDay = (n, short) => new Date(Date.now() + n * 864e5).toLocaleDateString('en-GB', short ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'long', year: 'numeric' });
const pppYearOn = () => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
const pppMonthOn = () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
const pppOther = (id) => (id === 'monthly' ? 'yearly' : 'monthly');
// Every circle this person champions wakes when they (re)subscribe: one payment covers them all.
const pppWakeMine = (spaces) => spaces.map((s) => (s.champion === 'You' && !s.funded
  ? { ...s, funded: true, dormancy: null, funding: null, openUntil: null } : s));
const pppSleepMine = (spaces) => spaces.map((s) => (s.champion === 'You' && s.funded
  ? { ...s, funded: false, dormancy: 'terminal', funding: null } : s));
const pppResumed = (st) => ({ status: st.wasTrial ? 'trial' : 'active', wasTrial: false });
const pppApi = () => window.__pppApi || null;
// The app's money check (mobile-readiness, 5 Oct): the app posture with Mobile
// payments Off cannot sell the subscription. The one key for every money
// difference — the not-subscribed line, and the Subscription card as status only.
const pppAppNoPay = () => { const a = pppApi(); return !!(a && a.isApp && !a.mobilePayments); };
// The ratified line, word for word, as one paragraph that wraps with its
// container (board pg-not-subscribed B.01, 5 Oct). The last two words of each
// closing phrase are glued so no line ends on one word.
const PppAppLine = () => (
  <>Joining circles is free. Starting your own needs a Circlists{'\u00a0'}subscription. You can{'\u2019'}t subscribe in this{'\u00a0'}app.</>
);
// The Create a circle page (board A.08, 5 Oct): the calm-page family's shape.
// The fact is the title, the other two sentences its body. Same words, reordered.
const PPP_APP_TITLE = 'You can\u2019t subscribe in this\u00a0app.';
const PPP_APP_BODY = 'Joining circles is free. Starting your own needs a Circlists\u00a0subscription.';
const PPP_APP_MANAGE = 'You can\u2019t manage your subscription in this app.';
// The status line breaks only at its phrase edge (board C.01, 5 Oct): whole
// where it fits, else before "in this app."
const PppManageLine = () => (
  <><span style={{ display: 'inline-block' }}>You can{'\u2019'}t manage your subscription</span> in this{'\u00a0'}app.</>
);

Object.assign(window, { PPP_PLANS, PPP_DEFAULT, PPP_RENEW_DAYS, PPP_TRIAL_DAYS, usePPP, pppSubscribed, pppDay, pppYearOn, pppMonthOn, pppOther, pppWakeMine, pppSleepMine, pppResumed, pppApi, pppAppNoPay, PppAppLine, PPP_APP_TITLE, PPP_APP_BODY, PPP_APP_MANAGE, PppManageLine });
