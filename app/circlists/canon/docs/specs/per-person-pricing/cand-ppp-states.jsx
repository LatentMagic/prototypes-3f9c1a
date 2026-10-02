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
  ['ppp-create-not-subscribed', 'Create a circle, not subscribed (tap New circle)', { store: NOT_SUB, spaces: pppHand, route: 'home' }],
  ['ppp-create-subscribed', 'Create a circle, subscribed (tap New circle)', { store: {}, route: 'home' }],
  ['ppp-not-subscribed', 'Account, not subscribed, never paid', { store: NOT_SUB, spaces: pppHand, route: 'account' }],
  ['ppp-lapsed', 'Lapsed: home, your circles asleep', { store: LAPSED, spaces: pppSleepMine, route: 'home' }],
  ['ppp-lapsed-circle', 'Lapsed: one of your sleeping circles', { store: LAPSED, spaces: pppSleepMine, current: 'sp-backend' }],
  ['ppp-lapsed-account', 'Lapsed: Account card', { store: LAPSED, spaces: pppSleepMine, route: 'account' }],
  ['ppp-lapsed-none-asleep', 'Lapsed, nothing asleep: Account card', { store: LAPSED, spaces: pppHand, route: 'account' }],
  ['ppp-active', 'Account, subscribed, active (monthly)', { store: {}, route: 'account' }],
  ['ppp-free-month', 'Account, free month', { store: { status: 'trial', plan: 'monthly' }, route: 'account' }],
  ['ppp-payment-failed', 'Account, payment failed', { store: { status: 'failed' }, route: 'account' }],
  ['ppp-ending', 'Account, ending', { store: { status: 'ending' }, route: 'account' }],
  ['ppp-switch-yearly', 'Account, switch to yearly (sheet A)', { store: {}, route: 'account', sheet: 'switch' }],
  ['ppp-cancel', 'Account, cancel subscription', { store: {}, route: 'account', sheet: 'cancel' }],
  ['ppp-takeover', 'Take over: sleeping circle, not subscribed', { store: NOT_SUB, spaces: (s) => pppSleep('sp-book')(pppHand(s)), current: 'sp-book' }],
  ['ppp-takeover-pricing', 'Take over: subscription page, free month', { store: { ...NOT_SUB, ctx: { from: 'takeover', spaceId: 'sp-book', name: 'Tuesday Book Club' } }, spaces: (s) => pppSleep('sp-book')(pppHand(s)), route: 'subscribe' }],
  ['ppp-takeover-subscribed', 'Take over: sleeping circle, already subscribed', { store: {}, spaces: pppSleep('sp-book'), current: 'sp-book' }],
  ['ppp-step-back', 'Circle settings, champion: the step-back line', { store: {}, current: 'sp-backend', route: 'members' }],
  ['ppp-no-circles', 'Subscribed with no circles: Account', { store: {}, spaces: () => [], route: 'account' }],
];
const pppStage = (api, def) => {
  const { seedSpaces, DEFAULT_USER } = window.CircSeed;
  try { localStorage.removeItem(api.STATE_KEY); } catch (e) {}
  let list = seedSpaces(DEFAULT_USER.email).filter((s) => !/^TEST\b/i.test(s.name || ''));
  if (def.spaces) list = def.spaces(list);
  window.CircPPP.reset(def.store);
  api.setUser(DEFAULT_USER); api.setSpaces(list);
  api.setLoadingFeed(false); api.setHoldLoading(false);
  if (api.setHomeStripOpen) api.setHomeStripOpen(false);
  api.setTab('active');
  if (def.current && !def.route) { api.setCurrentId(def.current); api.setRoute('space'); }
  else { api.setCurrentId(def.current || null); api.setRoute(def.route); }
  if (def.sheet) setTimeout(() => window.CircPPP.set({ sheet: def.sheet }), 80);
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
  r.groups = [{ title: PPP_GROUP, notes: ['Unratified. The subscription belongs to the person; Config \u2192 Per-person pricing switches it.'], items: mine }, ...r.groups];
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
    </div>
  );
};
window.ConfigExtra = PppConfig;
