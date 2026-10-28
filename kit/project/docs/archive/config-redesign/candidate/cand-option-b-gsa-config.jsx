// ============================================================================
// Candidate option-b (config-redesign) — the Golden Sample's Config rows
// (PROTOTYPE AID), on the ConfigGroup / ConfigRow / ConfigAction / ConfigNote
// contract from cand-option-b-config.jsx. Re-publishes window.ConfigExtra over
// app/gsa-config.jsx. Reads the store with useGsa(); writes with GsaStore.set.
// Fields combine independently; nothing here names a preset. Nothing here is
// accepted.
//
// Global holds what changes the whole prototype (who is signed in, whether the
// product takes payment, the subscription); every other group is one feature's
// scenarios. A knob that matters to one feature belongs in that feature's group.
// ============================================================================
const CfgBGsaConfigExtra = () => {
  const { ConfigGroup: Group, ConfigRow: Row, ConfigAction: Action, ConfigNote: Note } = window;
  const g = window.useGsa();
  const S = window.GsaStore;
  const { review: r, sub, push, space, tiers, queue, person } = g;
  const isApp = g.isApp;
  const visitor = g.session === 'visitor';
  const o = (pairs) => pairs.map(([value, label]) => ({ value, label }));
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
  const casey = window.GSA_PEOPLE.casey, robin = window.GSA_PEOPLE.robin;

  return (
    <React.Fragment>
      <Group title="Golden Sample" scope="global">
        <Row label="Signed in" value={g.session} options={o([['signed-in', 'Signed in'], ['visitor', 'Visitor']])}
          onChange={(v) => (v === 'signed-in' ? S.signInAvailable() : S.set({ session: v }))} />
        <Row label="Takes payment" value={tiers.payment ? 'yes' : 'no'} options={o([['yes', 'Yes'], ['no', 'No']])}
          onChange={(v) => S.set({ tiers: { payment: yn(v) } })} />
        {tiers.payment ? (
          <React.Fragment>
            <Row label="Plans page" value={tiers.plans ? 'yes' : 'no'} options={o([['yes', 'Yes'], ['no', 'No']])}
              onChange={(v) => S.set({ tiers: { plans: yn(v) } })} />
            <Row label="Subscription" value={sub.status} onChange={setStatus}
              options={o([['none', 'None'], ['subscribed', 'Subscribed'], ['ending', 'Ending'], ['payment-failed', 'Payment failed'], ['ended', 'Ended']])}
              hint={visitor ? 'Visitor: sets the Subscription of the account that will sign in. No screen shows it until sign-in.' : undefined} />
            <Row label="Plan" value={sub.plan} onChange={setPlan} options={o([['monthly', 'Monthly'], ['yearly', 'Yearly']])} />
          </React.Fragment>
        ) : (
          <Note>Plans page, Subscription and Plan are hidden while Takes payment is No.</Note>
        )}
      </Group>

      <Group title="Sign-in and account">
        <Row label="Device" value={r.device} options={o([['known', 'Known'], ['new', 'New']])}
          onChange={(v) => setReview({ device: v })} hint="Applies to Google and Apple too." />
        <Row label="Google and Apple" value={r.provider} options={o([['works', 'Works'], ['fails', 'Fails']])}
          onChange={(v) => setReview({ provider: v })}
          hint="Fails: a line under the buttons (GSA-008.EF-02). Cancel on the provider’s page returns with nothing shown (EF-03)." />
        <Row label="Google or Apple account" value={r.providerAccount} options={o([['existing', 'Has an account'], ['first-visit', 'A new person']])}
          onChange={(v) => setReview({ providerAccount: v })}
          hint={`Has an account: Google is ${casey.first} ${casey.last}, Apple is ${robin.first} ${robin.last} (hidden email). A new person gets an account on Continue (GSA-008.AF-02); Apple then asks to share or hide the email. Once made, it is an account the next time.`} />
        <Row label="Authenticator app" value={person.enrolled ? 'yes' : 'no'} options={o([['no', 'Not enrolled'], ['yes', 'Enrolled']])}
          onChange={(v) => S.set({ person: { enrolled: yn(v) } })} />
        <Row label="Email change: prove it’s you" value={r.emailReverify} options={o([['asks', 'Asks'], ['recent', 'Recent sign-in']])}
          onChange={(v) => setReview({ emailReverify: v })}
          hint="Recent sign-in: no check, the code goes straight to the new address (GSA-012.AF-03)." />
        <Row label="Email change" value={r.emailEndsSession ? 'ends' : 'keeps'} options={o([['keeps', 'Keeps the session'], ['ends', 'Ends it']])}
          onChange={(v) => setReview({ emailEndsSession: v === 'ends' })} />
        <Row label="Export" value={r.exportLimit ? 'limit' : 'under'} options={o([['under', 'Under the limit'], ['limit', 'Limit reached']])}
          onChange={(v) => setReview({ exportLimit: v === 'limit' })} />
        <Action label="Delete this account elsewhere" onClick={() => window.gsaDeletedElsewhere()}
          hint="The next change or page opened in the app signs out to the Sign-in view, with nothing kept." />
      </Group>

      <Group title="Queue">
        <Row label="Loading" value={queue.load} options={o([['ok', 'Normal'], ['hold', 'Held'], ['fail', 'Fails']])}
          onChange={(v) => S.set({ queue: { load: v } })} hint="Fails is held: Try again fails until this is Normal." />
        <Row label="Changes" value={queue.save} options={o([['ok', 'Work'], ['fail', 'Fail (held)']])}
          onChange={(v) => S.set({ queue: { save: v } })} hint="Fail is held until set back to Work." />
      </Group>

      <Group title="Payments">
        {tiers.payment ? (
          <React.Fragment>
            <Row label="Pending switch" value={sub.pending ? 'pending' : 'none'} options={o([['none', 'None'], ['pending', 'Pending']])}
              onChange={(v) => setSub({ pending: v === 'pending' ? other : null })}
              hint={sub.pending ? 'Switches to ' + sub.pending + ' on the next payment date.' : undefined} />
            <Row label="Payment provider" value={r.payProvider} options={o([['works', 'Works'], ['refuses', 'Refuses'], ['slow', 'Slow to confirm']])}
              onChange={(v) => setReview({ payProvider: v })} />
            <Row label="Hosted payment" value={r.hosted} options={o([['pays', 'Pays'], ['abandons', 'Not completed (leaves the page)'], ['fails', 'Fails']])}
              onChange={(v) => setReview({ hosted: v })} hint="Fails: subscribe only (GSA-018.EF-03)." />
          </React.Fragment>
        ) : (
          <Note>Takes payment is No: the payment rows and events are hidden.</Note>
        )}
        {isApp ? (
          <Row label="Store allows one link" value={r.storeLink ? 'yes' : 'no'} options={o([['no', 'No'], ['yes', 'Yes']])}
            onChange={(v) => setReview({ storeLink: yn(v) })} />
        ) : (
          <Note>Store allows one link: set Platform to Mobile (the Store app) to use it.</Note>
        )}
        {tiers.payment && (
          <React.Fragment>
            <Action label="Renewal paid" onClick={() => window.gsaProviderEvent('renewal-paid')} />
            <Action label="Renewal fails" onClick={() => window.gsaProviderEvent('renewal-fails')} />
            <Action label="Retry window ends" onClick={() => window.gsaProviderEvent('retry-ends')} />
            <Action label="Late payment arrives" onClick={() => window.gsaProviderEvent('late-payment')}
              hint="The provider takes the failed payment." />
            <Action label="Operator pauses" onClick={() => window.gsaProviderEvent('operator-pause')} />
            <Action label="Operator resumes" onClick={() => window.gsaProviderEvent('operator-resume')} />
          </React.Fragment>
        )}
      </Group>

      <Group title="Shared space">
        <Row label="Your role" value={space.role} options={o([['owner', 'Owner'], ['member', 'Member'], ['none', 'Not a member']])}
          onChange={(v) => S.set({ space: { role: v } })} hint="The signed-in person's role in the space." />
        <Row label="Room" value={space.full ? 'full' : 'room'} options={o([['room', 'Room'], ['full', 'Full']])}
          onChange={(v) => S.set({ space: { full: v === 'full' } })} />
        <Row label="Copy" value={r.clipboard} options={o([['ok', 'Works'], ['refused', 'Refused']])}
          onChange={(v) => setReview({ clipboard: v })} />
        <Row label="Invite link" value={r.inviteValid ? 'valid' : 'invalid'} options={o([['valid', 'Valid'], ['invalid', 'Not valid']])}
          onChange={(v) => setReview({ inviteValid: v === 'valid' })} />
      </Group>

      <Group title="Notifications">
        {isApp ? (
          <Note>The Store app has no Notifications card or ask.</Note>
        ) : (
          <React.Fragment>
            <Row label="This device" value={push.channel} options={o([['ok', 'Can get them'], ['ios-tab', 'iPhone tab'], ['none', 'Cannot get them']])}
              onChange={(v) => setPush({ channel: v })} />
            {canAsk ? (
              <React.Fragment>
                <Row label="Permission" value={push.perm} onChange={setPerm}
                  options={o([['default', 'Undecided'], ['granted', 'Granted'], ['denied', 'Refused']])} />
                <Row label="Prompt answer" value={r.promptAnswer} onChange={(v) => setReview({ promptAnswer: v })}
                  options={o([['prompt', 'Answer in the prompt'], ['grant', 'Grant'], ['refuse', 'Refuse'], ['close', 'Close'], ['none', 'No prompt']])}
                  hint="Close is GSA-028.AF-06. No prompt is GSA-028.AF-13: no request shows, no answer, the switch is back off." />
                <Row label="Turning on" value={r.pushFail ? 'fails' : 'works'} options={o([['works', 'Works'], ['fails', 'Fails']])}
                  onChange={(v) => setReview({ pushFail: v === 'fails' })} />
                {!snoozed && !push.on && (
                  <Note>Events show here: Move on after Not now; Send a notification and Device loses its registration while Notifications are on.</Note>
                )}
                {snoozed && <Action label="Move on (to the next snooze)" onClick={() => window.gsaPushMoveOn()} />}
                {push.on && push.perm === 'granted' && <Action label="Send a notification" onClick={() => window.gsaPushSend()} />}
                {push.on && <Action label="Device loses its registration" onClick={() => window.gsaPushLoseRegistration()} />}
              </React.Fragment>
            ) : (
              <Note>Permission, Prompt answer and the events show when This device can get them.</Note>
            )}
          </React.Fragment>
        )}
      </Group>
    </React.Fragment>
  );
};
window.ConfigExtra = CfgBGsaConfigExtra;
