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
      {row('Device, for Google and Apple sign-in', r.device === 'new' ? 'new' : 'known', (v) => set(() => api.setReview({ device: v })), o([['known', 'Known'], ['new', 'New']]))}
      <div className="kit-config-group-title">Username</div>
      {row('Username', (api.user && api.user.locked) ? 'recent' : 'free', (v) => set(() => api.setUser({ locked: v === 'recent' })), o([['free', 'Free to change'], ['recent', 'Changed recently']]))}
      <div className="kit-config-group-title">Library</div>
      {row('This week, or today', r.week === 'live' ? 'live' : 'done', (v) => set(() => api.setReview({ week: v })), o([['live', 'In progress'], ['done', 'Finished']]))}
      {row('Free account, today', r.today === 'none' ? 'none' : 'played', (v) => set(() => api.setReview({ today: v })), o([['played', 'Played'], ['none', 'Not played']]))}
      <div className="kit-config-hint">This edition's play, on every screen that shows it: the week for Casebook, Delve and Escape, the day for each daily game. Finished unless set here or in the demo bar.</div>
      <div className="kit-config-group-title">Pass</div>
      {row('Subscription', sub.status || 'none', (v) => setSub({ status: v, pending: null, ...(v === 'none' ? {} : { freeUsed: true }) }),
        o([['none', 'None'], ['free', 'In the trial'], ['active', 'Active'], ['failed', 'Payment failed'], ['ending', 'Ending']]))}
      {row('14-day trial', sub.freeUsed ? 'used' : 'available', (v) => setSub({ freeUsed: v === 'used' }), o([['available', 'Available'], ['used', 'Used']]))}
      {row('Plan', sub.plan || 'monthly', (v) => setSub({ plan: v, pending: null }), o([['monthly', 'Monthly'], ['yearly', 'Yearly']]))}
      {row('Pass changes', r.passFail ? 'fail' : 'work', (v) => set(() => api.setReview({ passFail: v === 'fail' })), o([['work', 'Work'], ['fail', 'Fail']]))}
      <div className="kit-config-hint">The demo bar at the foot of every screen agrees with Subscription: Free is None, Pass is Active. A subscription of None with the trial used is the lapsed card. Pass changes covers cancel, resume, switch and keeping the current plan.</div>
    </React.Fragment>
  );
};

Object.assign(window, { ConfigExtra: GsConfigExtra });
