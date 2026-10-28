// ============================================================================
// Config rows for the Golden Sample (PROTOTYPE AID). Published as
// window.ConfigExtra, built from the ConfigGroup / ConfigRow / ConfigAction /
// ConfigNote contract app/config.jsx publishes. Reads the store with useGsa();
// writes with GsaStore.set. Fields combine independently; nothing here names a
// preset.
//
// The "Golden Sample" group is scope="global": whole-prototype rows. Each other
// group is one feature's scenario knobs, shown as its own section.
// ============================================================================
const GsaConfigExtra = () => {
  const g = window.useGsa();
  const S = window.GsaStore;
  const { ConfigGroup: Group, ConfigRow: Row, ConfigAction: Action, ConfigNote: Note } = window;
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
        <Row label="Signed in" value={g.session}
          onChange={(v) => (v === 'signed-in' ? S.signInAvailable() : S.set({ session: v }))}
          options={o([['signed-in', 'Signed in'], ['visitor', 'Visitor']])} />
        <Row label="Takes payment" value={tiers.payment ? 'yes' : 'no'}
          onChange={(v) => S.set({ tiers: { payment: yn(v) } })} options={o([['yes', 'Yes'], ['no', 'No']])} />
        {tiers.payment
          ? <Row label="Plans page" value={tiers.plans ? 'yes' : 'no'}
              onChange={(v) => S.set({ tiers: { plans: yn(v) } })} options={o([['yes', 'Yes'], ['no', 'No']])} />
          : <Note>Plans page, Subscription and Plan: off while Takes payment is No.</Note>}
        {tiers.payment && (
          <React.Fragment>
            <Row label="Subscription" value={sub.status} onChange={setStatus}
              options={o([['none', 'None'], ['subscribed', 'Subscribed'], ['ending', 'Ending'], ['payment-failed', 'Payment failed'], ['ended', 'Ended']])}
              hint={visitor ? 'Visitor: sets the account that will sign in. No screen shows it until sign-in.' : null} />
            <Row label="Plan" value={sub.plan} onChange={setPlan}
              options={o([['monthly', 'Monthly'], ['yearly', 'Yearly']])}
              hint={visitor ? 'Visitor: sets the account that will sign in.' : null} />
          </React.Fragment>
        )}
      </Group>

      <Group title="Sign-in and account">
        <Row label="Device" value={r.device} onChange={(v) => setReview({ device: v })}
          options={o([['known', 'Known'], ['new', 'New']])} hint="Applies to Google and Apple too." />
        <Row label="Google and Apple" value={r.provider} onChange={(v) => setReview({ provider: v })}
          options={o([['works', 'Works'], ['fails', 'Fails']])}
          hint="Fails: a line under the buttons (GSA-008.EF-02). Cancel on the provider's page returns with nothing shown (EF-03)." />
        <Row label="Google or Apple account" value={r.providerAccount} onChange={(v) => setReview({ providerAccount: v })}
          options={o([['existing', 'Has an account'], ['first-visit', 'A new person']])}
          hint={`Has an account: Google is ${casey.first} ${casey.last}, Apple is ${robin.first} ${robin.last} (hidden email). A new person gets an account on Continue (GSA-008.AF-02).`} />
        <Row label="Authenticator app" value={person.enrolled ? 'yes' : 'no'}
          onChange={(v) => S.set({ person: { enrolled: yn(v) } })} options={o([['no', 'Not enrolled'], ['yes', 'Enrolled']])} />
        <Row label="Email change asks to prove it's you" value={r.emailReverify} onChange={(v) => setReview({ emailReverify: v })}
          options={o([['asks', 'Asks'], ['recent', 'Recent sign-in']])}
          hint="Recent sign-in: no check, the code goes straight to the new address (GSA-012.AF-03)." />
        <Row label="Email change" value={r.emailEndsSession ? 'ends' : 'keeps'}
          onChange={(v) => setReview({ emailEndsSession: v === 'ends' })}
          options={o([['keeps', 'Keeps the session'], ['ends', 'Ends it']])} />
        <Row label="Export" value={r.exportLimit ? 'limit' : 'under'}
          onChange={(v) => setReview({ exportLimit: v === 'limit' })}
          options={o([['under', 'Under the limit'], ['limit', 'Limit reached']])} />
        <Action label="Delete this account elsewhere" onClick={() => window.gsaDeletedElsewhere()}
          hint="the next change or page opened signs out to Sign-in, with nothing kept." />
      </Group>

      <Group title="Queue">
        <Row label="Loading" value={queue.load} onChange={(v) => S.set({ queue: { load: v } })}
          options={o([['ok', 'Normal'], ['hold', 'Held'], ['fail', 'Fails']])} hint="Fails is held: Try again fails until this is Normal." />
        <Row label="Changes" value={queue.save} onChange={(v) => S.set({ queue: { save: v } })}
          options={o([['ok', 'Work'], ['fail', 'Fail (held)']])} hint="Fail is held until set back to Work." />
      </Group>

      <Group title="Payments">
        {tiers.payment ? (
          <React.Fragment>
            <Row label="Pending switch" value={sub.pending ? 'pending' : 'none'}
              onChange={(v) => setSub({ pending: v === 'pending' ? other : null })}
              options={o([['none', 'None'], ['pending', 'Pending']])}
              hint={sub.pending ? 'Switches to ' + sub.pending + ' on the next payment date.' : null} />
            <Row label="Payment provider" value={r.payProvider} onChange={(v) => setReview({ payProvider: v })}
              options={o([['works', 'Works'], ['refuses', 'Refuses'], ['slow', 'Slow to confirm']])} />
            <Row label="Hosted payment" value={r.hosted} onChange={(v) => setReview({ hosted: v })}
              options={o([['pays', 'Pays'], ['abandons', 'Not completed (leaves the page)'], ['fails', 'Fails']])}
              hint="Fails: subscribe only (GSA-018.EF-03)." />
          </React.Fragment>
        ) : <Note>Pending switch, provider, hosted payment and the events: off while Takes payment is No.</Note>}
        {isApp
          ? <Row label="Store allows one link" value={r.storeLink ? 'yes' : 'no'}
              onChange={(v) => setReview({ storeLink: yn(v) })} options={o([['no', 'No'], ['yes', 'Yes']])} />
          : <Note>Store allows one link: set Platform to Mobile (the Store app) to use this.</Note>}
        {tiers.payment && (
          <React.Fragment>
            <Action label="Renewal paid" onClick={() => window.gsaProviderEvent('renewal-paid')} />
            <Action label="Renewal fails" onClick={() => window.gsaProviderEvent('renewal-fails')} />
            <Action label="Retry window ends" onClick={() => window.gsaProviderEvent('retry-ends')} />
            <Action label="Late payment arrives" onClick={() => window.gsaProviderEvent('late-payment')}
              hint="the provider takes the failed payment." />
            <Action label="Operator pauses" onClick={() => window.gsaProviderEvent('operator-pause')} />
            <Action label="Operator resumes" onClick={() => window.gsaProviderEvent('operator-resume')} />
          </React.Fragment>
        )}
      </Group>

      <Group title="Shared space">
        <Row label="Your role (the signed-in person's)" value={space.role} onChange={(v) => S.set({ space: { role: v } })}
          options={o([['owner', 'Owner'], ['member', 'Member'], ['none', 'Not a member']])} />
        <Row label="Room" value={space.full ? 'full' : 'room'} onChange={(v) => S.set({ space: { full: v === 'full' } })}
          options={o([['room', 'Room'], ['full', 'Full']])} />
        <Row label="Copy" value={r.clipboard} onChange={(v) => setReview({ clipboard: v })}
          options={o([['ok', 'Works'], ['refused', 'Refused']])} />
        <Row label="Invite link" value={r.inviteValid ? 'valid' : 'invalid'} onChange={(v) => setReview({ inviteValid: v === 'valid' })}
          options={o([['valid', 'Valid'], ['invalid', 'Not valid']])} />
      </Group>

      <Group title="Notifications">
        {isApp ? <Note>The Store app has no Notifications card or ask.</Note> : (
          <React.Fragment>
            <Row label="This device" value={push.channel} onChange={(v) => setPush({ channel: v })}
              options={o([['ok', 'Can get them'], ['ios-tab', 'iPhone tab'], ['none', 'Cannot get them']])} />
            {canAsk ? (
              <React.Fragment>
                <Row label="Permission" value={push.perm} onChange={setPerm}
                  options={o([['default', 'Undecided'], ['granted', 'Granted'], ['denied', 'Refused']])} />
                <Row label="Prompt answer" value={r.promptAnswer} onChange={(v) => setReview({ promptAnswer: v })}
                  options={o([['prompt', 'Answer in the prompt'], ['grant', 'Grant'], ['refuse', 'Refuse'], ['close', 'Close'], ['none', 'No prompt']])}
                  hint="Close is GSA-028.AF-06. No prompt is GSA-028.AF-13: no request, no answer, the switch is back off." />
                <Row label="Turning on" value={r.pushFail ? 'fails' : 'works'} onChange={(v) => setReview({ pushFail: v === 'fails' })}
                  options={o([['works', 'Works'], ['fails', 'Fails']])} />
                {!snoozed && !push.on && <Note>Events show here once there is a snooze, or Notifications are on.</Note>}
                {snoozed && <Action label="Move on (to the next snooze)" onClick={() => window.gsaPushMoveOn()} hint="shows after Not now." />}
                {push.on && push.perm === 'granted' && <Action label="Send a notification" onClick={() => window.gsaPushSend()} hint="shows while Notifications are on and granted." />}
                {push.on && <Action label="Device loses its registration" onClick={() => window.gsaPushLoseRegistration()} hint="shows while Notifications are on." />}
              </React.Fragment>
            ) : <Note>Permission, Prompt answer, Turning on and the events show when This device can get them.</Note>}
          </React.Fragment>
        )}
      </Group>
    </React.Fragment>
  );
};
window.ConfigExtra = GsaConfigExtra;
