// ============================================================================
// Config rows for the Golden Sample (PROTOTYPE AID). Published as
// window.ConfigExtra. Reads the store with useGsa(); writes with GsaStore.set.
// Fields combine independently; nothing here names a preset.
// ============================================================================
const GsaConfigExtra = () => {
  const g = window.useGsa();
  const S = window.GsaStore;
  const { review: r, sub, push, space, tiers, queue, person } = g;
  const isApp = g.isApp;
  const visitor = g.session === 'visitor';
  const o = (pairs) => pairs.map(([value, label]) => ({ value, label }));
  const row = (label, value, onChange, options, hint) => (
    <React.Fragment>
      <div className="kit-config-row">
        <div className="kit-config-row-label">{label}</div>
        <window.ConfigSeg value={value} onChange={onChange} options={o(options)} />
      </div>
      {hint && <div className="kit-config-hint">{hint}</div>}
    </React.Fragment>
  );
  const btn = (label, fn) => (
    <button type="button" className="kit-config-btn-secondary" style={{ marginBottom: 8, marginRight: 8 }}
      onClick={() => { if (typeof fn === 'function') fn(); }}>{label}</button>
  );
  const setReview = (patch) => S.set({ review: patch });
  const setSub = (patch) => S.set({ sub: patch });
  const setPush = (patch) => S.set({ push: patch });
  const yn = (v) => v === 'yes';

  const setStatus = (v) => {
    const patch = { status: v, pending: null };
    if (v === 'subscribed') Object.assign(patch, { nextDate: window.gsaDate(20), endDate: null, endedOn: null });
    if (v === 'ending') Object.assign(patch, { nextDate: window.gsaDate(20), endDate: window.gsaDate(20), endedOn: null });
    if (v === 'payment-failed') Object.assign(patch, { nextDate: window.gsaDate(20), endDate: null, endedOn: null });
    if (v === 'ended') Object.assign(patch, { nextDate: null, endDate: null, endedOn: window.gsaDate(-3) });
    if (v === 'none') Object.assign(patch, { nextDate: null, endDate: null, endedOn: null });
    setSub(patch);
  };
  const setPlan = (p) => setSub({ plan: p, pending: null });
  const setPerm = (v) => {
    if (v === 'default') setPush({ perm: 'default', asked: false, on: false });
    else setPush({ perm: v === 'granted' ? 'granted' : 'denied', asked: true });
  };
  const other = sub.plan === 'monthly' ? 'yearly' : 'monthly';
  const canAsk = push.channel === 'ok' && !isApp;
  const snoozed = push.snoozes > 0 && push.perm === 'default' && !push.asked;

  return (
    <React.Fragment>
      <div className="kit-config-eyebrow">Golden Sample</div>

      <div className="kit-config-group-title">Who</div>
      {row('Signed in', g.session, (v) => S.set({ session: v }), [['signed-in', 'Signed in'], ['visitor', 'Visitor']])}
      {row('Device', r.device, (v) => setReview({ device: v }), [['known', 'Known'], ['new', 'New']])}
      {row('Authenticator app', person.enrolled ? 'yes' : 'no', (v) => S.set({ person: { enrolled: yn(v) } }), [['no', 'Not enrolled'], ['yes', 'Enrolled']])}
      {row('Email change asks to prove it’s you', r.emailReverify, (v) => setReview({ emailReverify: v }), [['asks', 'Asks'], ['recent', 'Recent sign-in']],
        'Recent sign-in: no check, the code goes straight to the new address (GSA-012.AF-03).')}
      {row('Email change', r.emailEndsSession ? 'ends' : 'keeps', (v) => setReview({ emailEndsSession: v === 'ends' }), [['keeps', 'Keeps the session'], ['ends', 'Ends it']])}
      {btn('Delete this account elsewhere', () => window.gsaDeletedElsewhere())}
      <div className="kit-config-hint">The next change or page opened in the app signs out to the Sign-in view, with nothing kept.</div>

      <div className="kit-config-group-title">Tiers</div>
      {row('Takes payment', tiers.payment ? 'yes' : 'no', (v) => S.set({ tiers: { payment: yn(v) } }), [['yes', 'Yes'], ['no', 'No']])}
      {tiers.payment
        ? row('Plans page', tiers.plans ? 'yes' : 'no', (v) => S.set({ tiers: { plans: yn(v) } }), [['yes', 'Yes'], ['no', 'No']])
        : <div className="kit-config-hint">Plans page does not apply while Takes payment is No.</div>}
      {isApp
        ? row('Store allows one link', r.storeLink ? 'yes' : 'no', (v) => setReview({ storeLink: yn(v) }), [['no', 'No'], ['yes', 'Yes']])
        : <div className="kit-config-hint">Store allows one link shows in Platform: Mobile is the Store app.</div>}

      <div className="kit-config-group-title">Queue</div>
      {row('Loading', queue.load, (v) => S.set({ queue: { load: v } }), [['ok', 'Normal'], ['hold', 'Held'], ['fail', 'Fails']],
        'Fails is held: Try again fails until this is Normal.')}
      {row('Changes', queue.save, (v) => S.set({ queue: { save: v } }), [['ok', 'Work'], ['fail', 'Fail (held)']],
        'Fail is held until set back to Work.')}

      {tiers.payment ? (
        <React.Fragment>
          <div className="kit-config-group-title">{visitor ? 'The account that signs in' : 'Subscription'}</div>
          {visitor && <div className="kit-config-hint">Visitor: these set the Subscription of the account that will sign in. No screen shows it until sign-in.</div>}
          {row('Subscription', sub.status, setStatus, [['none', 'None'], ['subscribed', 'Subscribed'], ['ending', 'Ending'], ['payment-failed', 'Payment failed'], ['ended', 'Ended']])}
          {row('Plan', sub.plan, setPlan, [['monthly', 'Monthly'], ['yearly', 'Yearly']])}
          {row('Pending switch', sub.pending ? 'pending' : 'none', (v) => setSub({ pending: v === 'pending' ? other : null }), [['none', 'None'], ['pending', 'Pending']],
            sub.pending ? 'Switches to ' + sub.pending + ' on the next payment date.' : null)}
          {row('Payment provider', r.payProvider, (v) => setReview({ payProvider: v }), [['works', 'Works'], ['refuses', 'Refuses'], ['slow', 'Slow to confirm']])}
          {row('Hosted payment', r.hosted, (v) => setReview({ hosted: v }), [['pays', 'Pays'], ['abandons', 'Not completed (leaves the page)'], ['fails', 'Fails']],
            'Fails: subscribe only (GSA-018.EF-03).')}
          {btn('Renewal paid', () => window.gsaProviderEvent('renewal-paid'))}
          {btn('Renewal fails', () => window.gsaProviderEvent('renewal-fails'))}
          {btn('Retry window ends', () => window.gsaProviderEvent('retry-ends'))}
          {btn('Late payment arrives', () => window.gsaProviderEvent('late-payment'))}
          <div className="kit-config-hint">Late payment arrives: the provider takes the failed payment.</div>
          {btn('Operator pauses', () => window.gsaProviderEvent('operator-pause'))}
          {btn('Operator resumes', () => window.gsaProviderEvent('operator-resume'))}
        </React.Fragment>
      ) : (
        <div className="kit-config-hint">The Subscription rows are hidden while Takes payment is No.</div>
      )}

      <div className="kit-config-group-title">Shared space</div>
      {row('Your role', space.role, (v) => S.set({ space: { role: v } }), [['owner', 'Owner'], ['member', 'Member']])}
      {row('Room', space.full ? 'full' : 'room', (v) => S.set({ space: { full: v === 'full' } }), [['room', 'Room'], ['full', 'Full']])}
      {row('Copy', r.clipboard, (v) => setReview({ clipboard: v }), [['ok', 'Works'], ['refused', 'Refused']])}
      {row('Invite link', r.inviteValid ? 'valid' : 'invalid', (v) => setReview({ inviteValid: v === 'valid' }), [['valid', 'Valid'], ['invalid', 'Not valid']])}
      {row('Invited email', r.inviteMatch, (v) => setReview({ inviteMatch: v }), [['match', 'This account'], ['alias', 'gmail-googlemail alias'], ['other', 'Another account']])}

      <div className="kit-config-group-title">Notifications</div>
      {isApp ? (
        <div className="kit-config-hint">The Store app has no Notifications card or ask.</div>
      ) : (
        <React.Fragment>
          {row('This device', push.channel, (v) => setPush({ channel: v }), [['ok', 'Can get them'], ['ios-tab', 'iPhone tab'], ['none', 'Cannot get them']])}
          {canAsk ? (
            <React.Fragment>
              {row('Permission', push.perm, setPerm, [['default', 'Undecided'], ['granted', 'Granted'], ['denied', 'Refused']])}
              {row('Prompt answer', r.promptAnswer, (v) => setReview({ promptAnswer: v }), [['prompt', 'Answer in the prompt'], ['grant', 'Grant'], ['refuse', 'Refuse'], ['close', 'Close'], ['none', 'No prompt']],
                'Close is GSA-028.AF-06. No prompt is GSA-028.AF-13: no request shows, no answer, the switch is back off.')}
              {row('Turning on', r.pushFail ? 'fails' : 'works', (v) => setReview({ pushFail: v === 'fails' }), [['works', 'Works'], ['fails', 'Fails']])}
              {snoozed && btn('Move on (to the next snooze)', () => window.gsaPushMoveOn())}
              {push.on && push.perm === 'granted' && btn('Send a notification', () => window.gsaPushSend())}
              {push.on && btn('Device loses its registration', () => window.gsaPushLoseRegistration())}
            </React.Fragment>
          ) : (
            <div className="kit-config-hint">Permission, Prompt answer and the buttons show when This device can get notifications.</div>
          )}
        </React.Fragment>
      )}

      <div className="kit-config-group-title">Account</div>
      {row('Export', r.exportLimit ? 'limit' : 'under', (v) => setReview({ exportLimit: v === 'limit' }), [['under', 'Under the limit'], ['limit', 'Limit reached']])}
    </React.Fragment>
  );
};
window.ConfigExtra = GsaConfigExtra;
