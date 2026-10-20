// ============================================================================
// After Pixels — review settings in Config (PROTOTYPE AID). Published as
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
      <div className="kit-config-eyebrow">After Pixels</div>
      {row('Your AI', api.connected ? 'yes' : 'no', (v) => set(() => api.setConnected(v === 'yes')), o([['yes', 'Connected'], ['no', 'Not connected']]))}
      <div className="kit-config-group-title">Sign in</div>
      {row('Signed in with', api.provider || 'email', (v) => set(() => api.setProvider(v)), o([['email', 'Email'], ['google', 'Google'], ['apple', 'Apple']]))}
      {row('Provider sheet', r.sheet || 'completes', (v) => set(() => api.setReview({ sheet: v })), o([['completes', 'Completes'], ['cancelled', 'Cancelled']]))}
      {row('Google and Apple sign-in', r.providerFail ? 'fail' : 'ok', (v) => set(() => api.setReview({ providerFail: v === 'fail' })), o([['ok', 'Works'], ['fail', 'Fails']]))}
      {row('Device, for email, Google and Apple sign-in', r.device === 'new' ? 'new' : 'known', (v) => set(() => api.setReview({ device: v })), o([['known', 'Known'], ['new', 'New']]))}
      <div className="kit-config-group-title">Username</div>
      {row('Username', (api.user && api.user.locked) ? 'recent' : 'free', (v) => set(() => api.setUser({ locked: v === 'recent', since: v === 'recent' ? GS_DAY0.getTime() : null })), o([['free', 'Free to change'], ['recent', 'Changed recently']]))}
      <div className="kit-config-group-title">Account</div>
      {row('Account', (api.user && api.user.fresh) ? 'new' : 'played', (v) => set(() => { if (api.view === 'out') api.setView('free'); api.setUser({ fresh: v === 'new' }); }), o([['played', 'Has played'], ['new', 'New, nothing played']]))}
      <div className="kit-config-hint">New: the Library shows every game never played and History is empty, as for an account made here.</div>
      <div className="kit-config-group-title">Library</div>
      {row('This week, or today', r.week === 'live' ? 'live' : 'done', (v) => set(() => api.setReview({ week: v })), o([['live', 'In progress'], ['done', 'Finished']]))}
      {row('Free account, today', r.today === 'none' ? 'none' : 'played', (v) => set(() => api.setReview({ today: v })), o([['played', 'Played'], ['none', 'Not played']]))}
      {row('Ended unfinished', r.unfinished ? 'on' : 'off', (v) => set(() => api.setReview({ unfinished: v === 'on' })), o([['off', 'None'], ['on', 'A day']]))}
      <div className="kit-config-hint">This edition's play, on every screen that shows it: the case for Casebook, the week for Delve and Escape, the day for each daily game. Finished unless set here or in the demo bar. Ended unfinished adds a Daily Groups day and a Delve week that ended before you finished.</div>
      <div className="kit-config-group-title">Pass</div>
      {row('Subscription', sub.status || 'none', (v) => setSub({ status: v, pending: null, ...(v === 'none' ? {} : { hadPass: true }) }),
        o([['none', 'None'], ['active', 'Active'], ['failed', 'Payment failed'], ['ending', 'Ending']]))}
      {row('Had the Pass before', sub.hadPass ? 'yes' : 'no', (v) => setSub({ hadPass: v === 'yes' }), o([['no', 'No'], ['yes', 'Yes']]))}
      {row('Plan', sub.plan || 'monthly', (v) => setSub({ plan: v, pending: null }), o([['monthly', 'Monthly'], ['yearly', 'Yearly']]))}
      {row('Pass changes', r.passFail ? 'fail' : 'work', (v) => set(() => api.setReview({ passFail: v === 'fail' })), o([['work', 'Work'], ['fail', 'Fail']]))}
      {row('Pass ended', sub.endedOn ? 'today' : 'earlier', (v) => setSub({ endedOn: v === 'today' ? GS_DAY0.getTime() : null }), o([['earlier', '18 September'], ['today', 'Today']]))}
      <div className="kit-config-hint">The demo bar at the foot of every screen agrees with Subscription: Free is None, Pass is Active. A subscription of None with Had the Pass before set to Yes is the lapsed card. Pass changes covers cancel, resume, switch and keeping the current plan. Pass ended sets the one date every page prints for a Pass that has ended (Subscription None, Had the Pass before Yes).</div>
    </React.Fragment>
  );
};

Object.assign(window, { ConfigExtra: GsConfigExtra });
