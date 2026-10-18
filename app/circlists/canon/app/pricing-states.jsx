// ============================================================================
// Per-person pricing candidate — staged states, config controls. Wraps
// window.buildStates / circResolveState so canon's register is untouched.
// One entry per scenario; posture follows the window or the Viewport control.
// ============================================================================
const PPP_GROUP = 'Per-person pricing (candidate)';
const pppHand = (spaces) => spaces.map((s) => {
  if (s.champion !== 'You') return s;
  const other = (s.members || []).find((m) => m.name !== 'You');
  return other ? { ...s, champion: other.name, championEmail: other.email } : s;
});
const pppSleep = (id) => (spaces) => spaces.map((s) => (s.id === id ? { ...s, funded: false, dormancy: 'terminal', funding: null } : s));
const NOT_SUB = { status: 'none', usedFreeMonth: false };
const LAPSED = { status: 'none', usedFreeMonth: true };
const PPP_STATE_DEFS = [
  ['ppp-price-free', 'Subscription page, free month available', { store: { ...NOT_SUB, ctx: { from: 'account' } }, spaces: pppHand, route: 'subscribe' }],
  ['ppp-price-used', 'Subscription page, free month used', { store: { ...LAPSED, ctx: { from: 'account' } }, spaces: pppHand, route: 'subscribe' }],
  ['ppp-create-not-subscribed', 'Create a circle, not subscribed (tap New circle)', { store: NOT_SUB, spaces: pppHand, route: 'home', platform: 'web' }],
  ['ppp-app-create-not-subscribed', 'App: Create a circle, not subscribed (tap New circle)', { store: NOT_SUB, spaces: pppHand, route: 'home', platform: 'app' }],
  ['ppp-create-subscribed', 'Create a circle, subscribed (tap New circle)', { store: {}, route: 'home' }],
  ['ppp-not-subscribed', 'Account, not subscribed, never paid', { store: NOT_SUB, spaces: pppHand, route: 'account', platform: 'web' }],
  ['ppp-app-not-subscribed', 'App: Account, never subscribed', { store: NOT_SUB, spaces: pppHand, route: 'account', platform: 'app' }],
  ['ppp-lapsed', 'Lapsed: home, your circles asleep', { store: LAPSED, spaces: pppSleepMine, route: 'home' }],
  ['ppp-lapsed-circle', 'Lapsed: one of your sleeping circles', { store: LAPSED, spaces: pppSleepMine, current: 'sp-backend', platform: 'web' }],
  ['ppp-app-lapsed-circle', 'App: Lapsed, one of your sleeping circles', { store: LAPSED, spaces: pppSleepMine, current: 'sp-backend', platform: 'app' }],
  ['ppp-lapsed-account', 'Lapsed: Account card', { store: LAPSED, spaces: pppSleepMine, route: 'account', platform: 'web' }],
  ['ppp-app-lapsed', 'App: Account, lapsed', { store: LAPSED, spaces: pppSleepMine, route: 'account', platform: 'app' }],
  ['ppp-lapsed-none-asleep', 'Lapsed, nothing asleep: Account card', { store: LAPSED, spaces: pppHand, route: 'account' }],
  ['ppp-active', 'Account, subscribed, active (monthly)', { store: {}, route: 'account', platform: 'web' }],
  ['ppp-app-active', 'App: Account, subscribed, active', { store: {}, route: 'account', platform: 'app' }],
  ['ppp-free-month', 'Account, free month', { store: { status: 'trial', plan: 'monthly' }, route: 'account', platform: 'web' }],
  ['ppp-app-free-month', 'App: Account, free month', { store: { status: 'trial', plan: 'monthly' }, route: 'account', platform: 'app' }],
  ['ppp-payment-failed', 'Account, payment failed', { store: { status: 'failed' }, route: 'account', platform: 'web' }],
  ['ppp-app-payment-failed', 'App: Account, payment failed', { store: { status: 'failed' }, route: 'account', platform: 'app' }],
  ['ppp-ending', 'Account, ending', { store: { status: 'ending' }, route: 'account', platform: 'web' }],
  ['ppp-app-ending', 'App: Account, ending', { store: { status: 'ending' }, route: 'account', platform: 'app' }],
  ['ppp-switch-yearly', 'Account, switch to yearly (sheet A)', { store: {}, route: 'account', sheet: 'switch' }],
  ['ppp-cancel', 'Account, cancel subscription', { store: {}, route: 'account', sheet: 'cancel' }],
  ['ppp-active-yearly', 'Account, subscribed, active (yearly)', { store: { plan: 'yearly' }, route: 'account' }],
  ['ppp-switch-monthly', 'Account, switch to monthly', { store: { plan: 'yearly' }, route: 'account', sheet: 'switch' }],
  ['ppp-switch-free-month', 'Account, free month, switch to yearly', { store: { status: 'trial', plan: 'monthly' }, route: 'account', sheet: 'switch' }],
  ['ppp-cancel-free-month', 'Account, free month, cancel (then Resume)', { store: { status: 'trial', plan: 'monthly' }, route: 'account', sheet: 'cancel' }],
  ['ppp-pending-switch', 'Account, switch to yearly pending', { store: { pending: 'yearly' }, route: 'account', platform: 'web' }],
  ['ppp-app-pending-switch', 'App: Account, switch to yearly pending', { store: { pending: 'yearly' }, route: 'account', platform: 'app' }],
  ['ppp-takeover', 'Take over: sleeping circle, not subscribed', { store: NOT_SUB, spaces: (s) => pppSleep('sp-book')(pppHand(s)), current: 'sp-book', platform: 'web' }],
  ['ppp-app-takeover', 'App: Take over, sleeping circle, not subscribed', { store: NOT_SUB, spaces: (s) => pppSleep('sp-book')(pppHand(s)), current: 'sp-book', platform: 'app' }],
  ['ppp-takeover-pricing', 'Take over: subscription page, free month', { store: { ...NOT_SUB, ctx: { from: 'takeover', spaceId: 'sp-book' } }, spaces: (s) => pppSleep('sp-book')(pppHand(s)), route: 'subscribe' }],
  ['ppp-takeover-subscribed', 'Take over: sleeping circle, already subscribed', { store: {}, spaces: pppSleep('sp-book'), current: 'sp-book' }],
  ['ppp-takeover-ending', 'Take over while your subscription is ending', { store: { status: 'ending' }, spaces: pppSleep('sp-book'), current: 'sp-book', platform: 'web' }],
  ['ppp-app-takeover-ending', 'App: Take over while your subscription is ending', { store: { status: 'ending' }, spaces: pppSleep('sp-book'), current: 'sp-book', platform: 'app' }],
  ['ppp-takeover-failed', 'Take over while a payment has failed', { store: { status: 'failed' }, spaces: pppSleep('sp-book'), current: 'sp-book', platform: 'web' }],
  ['ppp-app-takeover-failed', 'App: Take over while a payment has failed', { store: { status: 'failed' }, spaces: pppSleep('sp-book'), current: 'sp-book', platform: 'app' }],
  ['ppp-create-ending', 'Create a circle while your subscription is ending (tap New circle)', { store: { status: 'ending' }, route: 'home', platform: 'web' }],
  ['ppp-app-create-ending', 'App: Create a circle while your subscription is ending (tap New circle)', { store: { status: 'ending' }, route: 'home', platform: 'app' }],
  ['ppp-create-failed', 'Create a circle while a payment has failed (tap New circle)', { store: { status: 'failed' }, route: 'home', platform: 'web' }],
  ['ppp-app-create-failed', 'App: Create a circle while a payment has failed (tap New circle)', { store: { status: 'failed' }, route: 'home', platform: 'app' }],
  ['ppp-step-back', 'Circle settings, champion: the step-back line', { store: {}, current: 'sp-backend', route: 'members' }],
  ['ppp-no-circles', 'Subscribed with no circles: Account', { store: {}, spaces: () => [], route: 'account' }],
  ['ppp-no-circles-ending', 'Ending, with no circles: Account', { store: { status: 'ending' }, spaces: () => [], route: 'account' }],
  ['ppp-no-circles-failed', 'Payment failed, with no circles: Account', { store: { status: 'failed' }, spaces: () => [], route: 'account' }],
  // As shipped (8 Oct).
  ['ppp-cancel-failed-payment', 'Cancel while a payment has failed: "From today", circles sleep at once', { store: { status: 'failed' }, route: 'account', sheet: 'cancel' }],
  ['ppp-delete-active', 'Delete account, Active', { store: {}, route: 'account', confirm: 'delete-account' }],
  ['ppp-delete-free-month', 'Delete account, free month', { store: { status: 'trial', plan: 'monthly' }, route: 'account', confirm: 'delete-account' }],
  ['ppp-delete-ending', 'Delete account, Ending', { store: { status: 'ending' }, route: 'account', confirm: 'delete-account' }],
  ['ppp-delete-failed', 'Delete account, payment failed', { store: { status: 'failed' }, route: 'account', confirm: 'delete-account' }],
  ['ppp-delete-lapsed', 'Delete account, lapsed', { store: LAPSED, spaces: pppSleepMine, route: 'account', confirm: 'delete-account' }],
  ['ppp-delete-none', 'Delete account, no subscription', { store: NOT_SUB, spaces: pppHand, route: 'account', confirm: 'delete-account' }],
  ['ppp-card-loading', 'Subscription card loading (Config \u2192 Card load: Stays loading)', { store: { simLoad: 'hold' }, route: 'account' }],
  ['ppp-load-fails', 'Subscription card fails to load (Try again loads it)', { store: {}, route: 'account', fail: 'subLoad' }],
  ['ppp-cancel-fails', 'Cancel \u2014 the next cancel fails (press Cancel subscription)', { store: {}, route: 'account', sheet: 'cancel', fail: 'subCancel' }],
  ['ppp-switch-fails', 'Switch \u2014 the next switch fails (press Switch to yearly)', { store: {}, route: 'account', sheet: 'switch', fail: 'subSwitch' }],
  ['ppp-resume-fails', 'Resume \u2014 the next resume fails (Ending, press Resume subscription)', { store: { status: 'ending' }, route: 'account', platform: 'web', fail: 'subResume' }],
  ['ppp-keep-fails', 'Keep plan \u2014 the next keep fails (switch pending, press Keep monthly)', { store: { pending: 'yearly' }, route: 'account', platform: 'web', fail: 'subKeep' }],
  ['ppp-card-page-fails', 'Update payment card \u2014 the payment page fails to open', { store: {}, route: 'account', platform: 'web', fail: 'subCard' }],
  ['ppp-cancel-busy', 'Cancel in flight (press Cancel subscription; Config \u2192 Card actions: Stay busy)', { store: { simBusy: 'hold' }, route: 'account', sheet: 'cancel' }],
  ['ppp-switch-busy', 'Switch in flight (press Switch to yearly; stays busy)', { store: { simBusy: 'hold' }, route: 'account', sheet: 'switch' }],
  ['ppp-resume-busy', 'Resume in flight (Ending, press Resume subscription; stays busy)', { store: { status: 'ending', simBusy: 'hold' }, route: 'account', platform: 'web' }],
  ['ppp-keep-busy', 'Keep plan in flight (press Keep monthly; stays busy)', { store: { pending: 'yearly', simBusy: 'hold' }, route: 'account', platform: 'web' }],
  ['ppp-takeover-fails', 'Take over, already subscribed \u2014 the next take-over fails', { store: {}, spaces: pppSleep('sp-book'), current: 'sp-book', platform: 'web', fail: 'takeover' }],
  ['ppp-takeover-ending-no-date', 'Take over while ending, no known end date', { store: { status: 'ending', noEndDate: true }, spaces: pppSleep('sp-book'), current: 'sp-book', platform: 'web' }],
];
const pppStage = (api, def) => {
  const { seedSpaces, DEFAULT_USER } = window.CircSeed;
  // The register's Platform setting (see app/states.jsx buildStates).
  if (def.platform && api.setPlatform) { api.setPlatform(def.platform); if (api.setMobilePayments) api.setMobilePayments(false); }
  try { localStorage.removeItem(api.STATE_KEY); } catch (e) {}
  // No residue from the previous stage: unspent refusals and an open confirm.
  window.circFail = window.circFail || {};
  Object.keys(PPP_FAIL).forEach((k) => { window.circFail[k] = false; });
  { const a = pppApi(); if (a && a.confirm) a.confirm(null); }
  let list = seedSpaces(DEFAULT_USER.email).filter((s) => !/^TEST\b/i.test(s.name || ''));
  if (def.spaces) list = def.spaces(list);
  // A take-over context names its circle from the staged list, as the real flow reads space.name.
  let store = def.store;
  if (store && store.ctx && store.ctx.spaceId && !store.ctx.name) {
    const sp = list.find((s) => s.id === store.ctx.spaceId);
    store = { ...store, ctx: { ...store.ctx, name: sp ? sp.name : '' } };
  }
  window.CircPPP.reset(store);
  api.setUser(DEFAULT_USER); api.setSpaces(list);
  api.setLoadingFeed(false); api.setHoldLoading(false);
  if (api.setHomeStripOpen) api.setHomeStripOpen(false);
  api.setTab('active');
  if (def.current && !def.route) { api.setCurrentId(def.current); api.setRoute('space'); }
  else { api.setCurrentId(def.current || null); api.setRoute(def.route); }
  if (def.sheet) setTimeout(() => window.CircPPP.set({ sheet: def.sheet }), 80);
  if (def.fail) { window.circFail = window.circFail || {}; window.circFail[def.fail] = true; }
  if (def.confirm) setTimeout(() => { const a = pppApi(); if (a && a.confirm) a.confirm(def.confirm); }, 120);
};
const PPP_STATES = [];
PPP_STATE_DEFS.forEach(([id, label, def]) => { PPP_STATES.push({ id, label, def }); });
const PPP_IDS = PPP_STATES.map((s) => s.id);
// Stage a state by id from a script (verification only; the palette is the reader's door).
window.__pppGo = (id) => { const s = PPP_STATES.find((x) => x.id === id); if (s && window.__pppStatesApi) pppStage(window.__pppStatesApi, s.def); };
const pppBuild = window.buildStates;
window.buildStates = (api) => {
  window.__pppStatesApi = api;
  const r = pppBuild(api);
  const mine = PPP_STATES.map((s) => ({ id: s.id, label: s.label, group: PPP_GROUP, go: () => pppStage(api, s.def) }));
  mine.forEach((m) => { r.byId[m.id] = m; });
  const pinned = r.groups.filter((g) => g.pin);
  r.groups = [...pinned, { title: PPP_GROUP, notes: ['Unratified. The subscription belongs to the person; Config \u2192 Per-person pricing switches it.'], items: mine }, ...r.groups.filter((g) => !g.pin)];
  return r;
};
const pppResolve = window.circResolveState;
window.circResolveState = () => {
  let name = '';
  try { name = (new URLSearchParams(window.location.search).get('state') || '').trim().toLowerCase(); } catch (e) {}
  return PPP_IDS.includes(name) ? { kind: 'state', id: name } : pppResolve();
};

// ---- Config: the states that are switched rather than clicked to ----------
const PppSeg = ({ label, options, value, onChange }) => (
  <div className="circ-config-row">
    <span className="circ-config-row-label">{label}</span>
    <div className="circ-config-seg" role="radiogroup" aria-label={label}>
      {options.map(([v, t]) => (
        <button key={v} type="button" role="radio" aria-checked={v === value} className="circ-config-seg-btn"
          data-active={v === value ? '1' : undefined} onClick={() => onChange(v)}>{t}</button>
      ))}
    </div>
  </div>
);
const PppConfig = () => {
  const st = usePPP(); const A = window.CircPPP;
  return (
    <div>
      <div className="circ-config-eyebrow">Per-person pricing (candidate)</div>
      <PppSeg label="Subscription" value={st.status} onChange={(v) => A.set({ status: v, pending: null, ...(v === 'trial' ? { usedFreeMonth: true } : {}) })}
        options={[['none', 'None'], ['trial', 'Free month'], ['active', 'Active'], ['failed', 'Failed'], ['ending', 'Ending']]} />
      <PppSeg label="Free month" value={st.usedFreeMonth ? 'used' : 'open'} onChange={(v) => A.set({ usedFreeMonth: v === 'used' })}
        options={[['open', 'Available'], ['used', 'Used']]} />
      <PppSeg label="Plan" value={st.plan} onChange={(v) => A.set({ plan: v, pending: null })}
        options={[['monthly', 'Monthly'], ['yearly', 'Yearly']]} />
      <PppSeg label="Card load" value={st.simLoad} onChange={(v) => A.set({ simLoad: v })}
        options={[['ok', 'Loads'], ['hold', 'Stays loading']]} />
      <PppSeg label="Card actions" value={st.simBusy} onChange={(v) => A.set({ simBusy: v })}
        options={[['done', 'Complete'], ['hold', 'Stay busy']]} />
      <PppSeg label="End date" value={st.noEndDate ? 'unknown' : 'known'} onChange={(v) => A.set({ noEndDate: v === 'unknown' })}
        options={[['known', 'Known'], ['unknown', 'Unknown']]} />
    </div>
  );
};
window.ConfigExtra = PppConfig;
