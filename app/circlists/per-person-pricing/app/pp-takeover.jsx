// ============================================================================
// Per-person pricing candidate — a lapse sleeps every circle; a member takes one over.
// Re-publishes DormantSpace (window wins at render), and adds addressable states by
// wrapping window.buildStates / circResolveState, so canon's register is untouched.
// Proposed behaviour, nothing here is ratified.
// ============================================================================
const PpShippedDormant = window.DormantSpace;

const PpDormantSpace = (props) => {
  const { space, dormancy, onFund, onLeave } = props;
  const st = usePP();
  const suspended = dormancy === 'suspended';
  const lapsed = !!space && space.champion === 'You';
  const go = () => { window.__ppTk = { kind: lapsed ? 'lapsed' : 'member', name: space ? space.name : '' }; onFund(); };
  React.useEffect(() => {
    if (suspended) return;
    let n = 0;
    const t = setInterval(() => { if (window.__ppAuto) { clearInterval(t); go(); } else if (++n > 30) clearInterval(t); }, 100);
    return () => clearInterval(t);
  }, []);
  if (suspended) return <PpShippedDormant {...props} />;
  const SupportLine = window.SupportLine;
  const acct = ppAccount(st);
  const body = lapsed ? 'Your subscription ended, so all your circles went to sleep. Everything in them is still here.'
    : 'Its champion’s subscription ended. Everything in it is still here.';
  const cap = lapsed ? (st.v7 ? 'Subscribing wakes all your circles together.' : 'Restarting wakes all your circles together.')
    : acct === 'subscribed' ? 'Any member can take it over. Your plan already covers it, so there is nothing to pay.'
    : 'Any member can take it over. It then runs on your subscription, and you become its champion.';
  return (
    <main className="circ-dormant">
      <div className="circ-dormant-mid">
        <div className="circ-dormant-col">
          <h1 className="circ-dormant-title">This circle is asleep.</h1>
          <p className="circ-dormant-body">{body}</p>
          <div className="circ-dormant-actions">
            {!lapsed && onLeave && <Button variant="destructive-secondary" size="lg" style={{ minWidth: 240 }} onClick={onLeave}>Leave this circle</Button>}
            <Button variant="primary" size="lg" style={{ minWidth: 240 }} onClick={go}>{lapsed ? (st.v7 ? 'Start your subscription' : 'Restart your subscription') : 'Take over this circle'}</Button>
          </div>
          <p className="circ-dormant-cap">{cap}</p>
        </div>
      </div>
      {SupportLine && <div className="circ-dormant-foot"><SupportLine /></div>}
    </main>
  );
};
window.DormantSpace = PpDormantSpace;

// ---- addressable states -----------------------------------------------------
const PP_GROUP = 'Pricing candidate: lapse and take-over';
const ppSleep = (ids, champion, email) => (spaces) => spaces.map((sp) => (ids.includes(sp.id)
  ? { ...sp, funded: false, dormancy: 'terminal', unseen: false, champion, championEmail: email } : sp));
const PP_LAPSED = ['sp-backend', 'sp-book', 'sp-sam'];
const ppState = (id, label, { account, sleep, champion = 'You', current = null, route = 'home', auto = null, awake = false, pp = {} }) => ({
  id, label, group: PP_GROUP,
  go: (api, seed) => {
    const { DEFAULT_USER } = window.CircSeed;
    try { localStorage.removeItem(api.STATE_KEY); } catch (e) {}
    let list = seed.filter((sp) => !/^TEST\b/i.test(sp.name || ''));
    if (sleep) list = ppSleep(sleep, champion, champion === 'You' ? DEFAULT_USER.email : 'priya.n@example.com')(list);
    if (awake) list = list.map((sp) => (sp.id === current ? { ...sp, champion: 'You', championEmail: DEFAULT_USER.email } : sp));
    window.__ppTk = null; window.__ppAuto = auto;
    window.CircPP.set({ v7: null, quiet: null, step: null, stepSheet: null, delp: false, ...PP_ACCOUNT_PATCH[account], ...pp });
    api.setUser(DEFAULT_USER); api.setSpaces(list);
    api.setLoadingFeed(false); api.setHoldLoading(false);
    if (api.setHomeStripOpen) api.setHomeStripOpen(false);
    api.setCurrentId(current); api.setTab('active'); api.setRoute(route);
  },
});
const PP_MEMBER = { sleep: ['sp-book'], champion: 'Priya N.', current: 'sp-book', route: 'space' };
const PP_STATES = [
  ppState('pp-lapsed-home', 'Lapsed champion: home, three circles asleep at once', { account: 'returning', sleep: PP_LAPSED }),
  ppState('pp-lapsed-dormant', 'Lapsed champion: a circle, restart your subscription', { account: 'returning', sleep: PP_LAPSED, current: 'sp-backend', route: 'space' }),
  ppState('pp-lapsed-restart', 'Lapsed champion: restart page, price today, no free month', { account: 'returning', sleep: PP_LAPSED, current: 'sp-backend', route: 'space', auto: 'funding' }),
  ppState('pp-lapsed-checkout', 'Lapsed champion: checkout, due today', { account: 'returning', sleep: PP_LAPSED, current: 'sp-backend', route: 'space', auto: 'checkout' }),
  ppState('pp-lapsed-awake', 'Lapsed champion: home after restarting, all awake', { account: 'subscribed' }),
  ppState('pp-member-dormant', 'Member, not subscribed: a sleeping circle, take it over', { account: 'none', ...PP_MEMBER }),
  ppState('pp-takeover-free', 'Take over, never subscribed: free month page', { account: 'none', ...PP_MEMBER, auto: 'funding' }),
  ppState('pp-takeover-free-checkout', 'Take over, never subscribed: checkout, free month', { account: 'none', ...PP_MEMBER, auto: 'checkout' }),
  ppState('pp-takeover-returning', 'Take over, subscribed before: page, price today, no free month', { account: 'returning', ...PP_MEMBER, auto: 'funding' }),
  ppState('pp-takeover-returning-checkout', 'Take over, subscribed before: checkout, due today', { account: 'returning', ...PP_MEMBER, auto: 'checkout' }),
  ppState('pp-member-dormant-subscribed', 'Member, subscribed: a sleeping circle, covered by your plan', { account: 'subscribed', ...PP_MEMBER }),
  ppState('pp-takeover-subscribed', 'Take over, subscribed: confirm, no payment', { account: 'subscribed', ...PP_MEMBER, auto: 'funding' }),
  ppState('pp-takeover-awake', 'Taken over: the circle awake, you its champion', { account: 'subscribed', current: 'sp-book', route: 'members', awake: true }),
];
// v7 take-over screen: the decided two-state pricing screen. never paid = state 1, used the free month = state 2.
const PP_V7T = (l) => ({ v7: 'A', quiet: true });
PP_STATES.push(
  ppState('pp-v7-takeover-1', 'v7 take over, never subscribed: state 1, free month', { account: 'none', ...PP_MEMBER, auto: 'funding', pp: PP_V7T('Take-over screen · state 1 · free month available') }),
  ppState('pp-v7-takeover-2', 'v7 take over, subscribed before: state 2, no free month', { account: 'returning', ...PP_MEMBER, auto: 'funding', pp: PP_V7T('Take-over screen · state 2 · free month used') }),
  ppState('pp-v7-takeover-lapsed-dormant', 'v7 lapsed champion: sleeping circle, subscribe', { account: 'returning', sleep: PP_LAPSED, current: 'sp-backend', route: 'space', pp: PP_V7T('Sleeping circle · lapsed champion · state 2 wording') }),
  ppState('pp-v7-takeover-lapsed', 'v7 lapsed champion: state 2 screen', { account: 'returning', sleep: PP_LAPSED, current: 'sp-backend', route: 'space', auto: 'funding', pp: PP_V7T('Take-over screen · lapsed champion · state 2') }),
  ppState('pp-v7-takeover-lapsed-checkout', 'v7 lapsed champion: checkout', { account: 'returning', sleep: PP_LAPSED, current: 'sp-backend', route: 'space', auto: 'checkout', pp: PP_V7T('Checkout · lapsed champion · state 2') }),
);
const PP_IDS = PP_STATES.map((s) => s.id);
const ppBuild = window.buildStates;
window.buildStates = (api) => {
  window.__ppApi = api;
  const r = ppBuild(api);
  const { seedSpaces, DEFAULT_USER } = window.CircSeed;
  const mine = PP_STATES.map((s) => ({ id: s.id, label: s.label, group: s.group, go: () => s.go(api, seedSpaces(DEFAULT_USER.email)) }));
  mine.forEach((m) => { r.byId[m.id] = m; });
  r.groups = [...r.groups, { title: PP_GROUP, notes: null, items: mine }];
  return r;
};
const ppResolve = window.circResolveState;
window.circResolveState = () => {
  let name = '';
  try { name = (new URLSearchParams(window.location.search).get('state') || '').trim().toLowerCase(); } catch (e) {}
  return PP_IDS.includes(name) ? { kind: 'state', id: name } : ppResolve();
};
