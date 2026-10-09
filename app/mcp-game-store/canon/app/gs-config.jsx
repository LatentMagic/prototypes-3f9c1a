// ============================================================================
// [Platform] — review settings in Config (PROTOTYPE AID). Published as
// window.ConfigExtra; reads and writes the app through window.gsApi.
// ============================================================================
const GsConfigExtra = () => {
  const api = window.gsApi || {};
  const r = api.review || {};
  const sub = api.sub || {};
  const [, bump] = React.useState(0);
  const set = (fn) => { fn(); setTimeout(() => bump((n) => n + 1), 0); };
  const row = (label, value, onChange, options) => (
    <div className="kit-config-row">
      <div className="kit-config-row-label">{label}</div>
      <window.ConfigSeg value={value} onChange={onChange} options={options} />
    </div>
  );
  const o = (pairs) => pairs.map(([value, label]) => ({ value, label }));
  // Changing the subscription signs in, so the demo bar moves with it.
  const setSub = (patch) => set(() => { if (api.view === 'out') api.setView('free'); api.setSub(patch); });
  return (
    <React.Fragment>
      <div className="kit-config-eyebrow">[Platform]</div>
      {row('Your AI', api.connected ? 'yes' : 'no', (v) => set(() => api.setConnected(v === 'yes')), o([['yes', 'Connected'], ['no', 'Not connected']]))}
      <div className="kit-config-group-title">Sign in</div>
      {row('Signed in with', api.provider || 'email', (v) => set(() => api.setProvider(v)), o([['email', 'Email'], ['google', 'Google'], ['apple', 'Apple']]))}
      {row('Provider sheet', r.sheet || 'completes', (v) => set(() => api.setReview({ sheet: v })), o([['completes', 'Completes'], ['cancelled', 'Cancelled']]))}
      {row('Google and Apple sign-in', r.providerFail ? 'fail' : 'ok', (v) => set(() => api.setReview({ providerFail: v === 'fail' })), o([['ok', 'Works'], ['fail', 'Fails']]))}
      {row('Apple account', r.appleNone ? 'none' : 'found', (v) => set(() => api.setReview({ appleNone: v === 'none' })), o([['found', 'Found'], ['none', 'None']]))}
      <div className="kit-config-group-title">Username</div>
      {row('Username', (api.user && api.user.locked) ? 'recent' : 'free', (v) => set(() => api.setUser({ locked: v === 'recent' })), o([['free', 'Free to change'], ['recent', 'Changed recently']]))}
      <div className="kit-config-group-title">Library</div>
      {row('This week, or today', r.week === 'done' ? 'done' : 'live', (v) => set(() => api.setReview({ week: v })), o([['live', 'In progress'], ['done', 'Finished']]))}
      <div className="kit-config-hint">The top card of each library page: Casebook’s and Delve’s week, Daily Puzzles’ day.</div>
      <div className="kit-config-group-title">Pass</div>
      {row('Subscription', sub.status || 'none', (v) => setSub({ status: v, pending: null, ...(v === 'none' ? {} : { freeUsed: true }) }),
        o([['none', 'None'], ['free', 'Free month'], ['active', 'Active'], ['failed', 'Payment failed'], ['ending', 'Ending']]))}
      {row('Free month', sub.freeUsed ? 'used' : 'available', (v) => setSub({ freeUsed: v === 'used' }), o([['available', 'Available'], ['used', 'Used']]))}
      {row('Plan', sub.plan || 'monthly', (v) => setSub({ plan: v, pending: null }), o([['monthly', 'Monthly'], ['yearly', 'Yearly']]))}
      <div className="kit-config-hint">The demo bar at the foot of every screen agrees with Subscription: Free is None, Pass is Active. A subscription of None with the free month used is the lapsed card.</div>
    </React.Fragment>
  );
};

Object.assign(window, { ConfigExtra: GsConfigExtra });
