// ============================================================================
// GSA Subscription card (Account card 1), the Cancel and Plan dialogs, and the
// provider lifecycle verb. Every change waits for the payment provider to
// confirm (Config Payment provider: Works / Refuses / Slow to confirm).
// Styles: gsa-billing.css. Shared UI: gsa-ui.jsx.
// ============================================================================
const GSA_BILLING_PLANS = { monthly: 'Monthly', yearly: 'Yearly' };
const GSA_BILLING_DAYS = { monthly: 30, yearly: 365 };
const GSA_BILLING_STATE_LABEL = {
  'subscribed': 'Subscribed', 'ending': 'Ending', 'payment-failed': 'Payment failed',
  'ended': 'Ended', 'none': 'No Subscription',
};

function gsaBillingOther(plan) {
  return plan === 'monthly' ? 'yearly' : 'monthly';
}

function gsaBillingAdd(date, days) {
  return new Date(new Date(date).getTime() + days * 86400000);
}

// A stager may leave a date unset; the card falls back to one period from today.
function gsaBillingNext(sub) {
  return sub.nextDate ? new Date(sub.nextDate) : gsaDate(GSA_BILLING_DAYS[sub.plan] || 30);
}

// ---- the one-line note the card shows and announces ------------------------
// Keyed to the Subscription it describes, so a later change hides it.
let gsaBillingNote = null;
const gsaBillingNoteListeners = new Set();

function gsaBillingKey(sub) {
  return [sub.status, sub.plan, sub.pending, sub.nextDate, sub.endDate].join('|');
}

function gsaBillingSay(tone, text) {
  gsaBillingNote = { tone, text, key: gsaBillingKey(GsaStore.get().sub) };
  gsaBillingNoteListeners.forEach((fn) => fn());
}

function gsaBillingClear() {
  gsaBillingNote = null;
  gsaBillingNoteListeners.forEach((fn) => fn());
}

function useGsaBillingNote(sub) {
  const note = React.useSyncExternalStore(
    (fn) => { gsaBillingNoteListeners.add(fn); return () => { gsaBillingNoteListeners.delete(fn); }; },
    () => gsaBillingNote,
  );
  return note && note.key === gsaBillingKey(sub) ? note : null;
}

// ---- a change that waits for the provider ----------------------------------
// call(apply, fail): the provider's answer is read when the wait is over. While
// it is Slow the call stays held, and settles when Config changes the answer.
function useGsaProviderCall() {
  const provider = useGsa().review.payProvider;
  const [job, setJob] = React.useState(null);
  const [waited, setWaited] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  React.useEffect(() => {
    if (!job || !waited || provider === 'slow') return;
    setJob(null);
    setWaited(false);
    if (provider === 'refuses') job.fail(); else job.apply();
  }, [job, waited, provider]);
  const call = (apply, fail) => {
    if (job) return;
    setJob({ apply, fail });
    setWaited(false);
    timer.current = setTimeout(() => setWaited(true), 600);
  };
  return [Boolean(job), call];
}

function gsaBillingWrite(sub) {
  GsaStore.set({ sub });
}

// ---- the lifecycle verb (Config buttons) -----------------------------------
function gsaBillingRenew(sub) {
  // The payment lands: a Pending switch becomes the Plan, the date moves one period.
  const plan = sub.pending || sub.plan;
  return { status: 'subscribed', plan, pending: null, nextDate: gsaBillingAdd(gsaBillingNext(sub), GSA_BILLING_DAYS[plan]), endDate: null, endedOn: null };
}

function gsaBillingReturn(sub) {
  // Payment taken on a failed or ended Subscription: Subscribed again.
  const plan = sub.pending || sub.plan;
  return { status: 'subscribed', plan, pending: null, nextDate: gsaDate(GSA_BILLING_DAYS[plan]), endDate: null, endedOn: null };
}

function gsaBillingEnd(sub) {
  return { status: 'ended', pending: null, nextDate: null, endDate: null, endedOn: gsaDate(0) };
}

function gsaProviderEvent(kind) {
  const sub = GsaStore.get().sub;
  const live = ['subscribed', 'ending', 'payment-failed'].includes(sub.status);
  let patch = null;
  if (kind === 'renewal-paid' && sub.status === 'subscribed') patch = gsaBillingRenew(sub);
  if (kind === 'renewal-fails' && sub.status === 'subscribed') patch = { status: 'payment-failed' };
  if (kind === 'retry-ends' && sub.status === 'payment-failed') patch = gsaBillingEnd(sub);
  if (kind === 'late-payment' && (sub.status === 'payment-failed' || sub.status === 'ended')) patch = gsaBillingReturn(sub);
  if (kind === 'operator-pause' && live) patch = gsaBillingEnd(sub);
  if (kind === 'operator-resume' && sub.status === 'ended') patch = gsaBillingReturn(sub);
  if (patch) gsaBillingWrite(patch);
}

// ---- the card ---------------------------------------------------------------
function GsaBillingFacts({ sub, rows }) {
  return (
    <dl className="gsa-billing-facts">
      {rows.map(([term, value]) => (
        <div className="gsa-billing-fact" key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function GsaBillingKeeps({ ended }) {
  return <GsaSlot>{ended ? 'what you keep and what stopped. Each app decides.' : 'what you keep and what stops when the Subscription ends. Each app decides.'}</GsaSlot>;
}

function GsaSubscriptionCard({ notice }) {
  const s = useGsa();
  const sub = s.sub;
  const status = sub.status;
  const cardRef = React.useRef(null);
  const noteRef = React.useRef(null);
  const note = useGsaBillingNote(sub);
  const [busyOf, setBusyOf] = React.useState(null);
  const [busy, call] = useGsaProviderCall();
  const live = ['subscribed', 'ending', 'payment-failed'].includes(status);
  const gone = () => setBusyOf(null);

  React.useEffect(() => () => gsaBillingClear(), []);
  // Focus never stays on a control the card removed: it lands on the note.
  React.useEffect(() => {
    const at = document.activeElement;
    if ((!at || at === document.body) && note && noteRef.current && cardRef.current) noteRef.current.focus({ preventScroll: true });
  }, [gsaBillingKey(sub)]);

  const resume = () => {
    setBusyOf('resume');
    call(() => {
      gsaBillingWrite({ status: 'subscribed', endDate: null });
      gsaBillingSay('success', 'Resumed. Your Subscription continues and you paid nothing. The date of the next payment is the same.');
      gone();
    }, () => {
      gsaBillingSay('danger', 'The Subscription was not resumed. It is still ending. Try again.');
      gone();
    });
  };
  const keep = () => {
    setBusyOf('keep');
    call(() => {
      gsaBillingWrite({ pending: null });
      gsaBillingSay('success', 'Kept the ' + sub.plan + ' Plan. You pay nothing.');
      gone();
    }, () => {
      gsaBillingSay('danger', 'The Pending switch is still on your Subscription. Try again.');
      gone();
    });
  };
  const toPlans = () => GsaStore.go(s.tiers.plans ? 'plans' : 'subscribe');
  const updateCard = () => GsaStore.go('hosted-payment', { mode: 'update-card' });
  const open = (dialog) => GsaStore.replace('account', { dialog });

  const plan = GSA_BILLING_PLANS[sub.plan];
  const base = [['Plan', plan]];
  const cardRows = [['Payment card', 'ending ' + sub.last4], ['Receipt sent to', sub.billingEmail]];
  const pendingRow = sub.pending ? [['Pending switch', GSA_BILLING_PLANS[sub.pending] + ' Plan from ' + gsaLong(gsaBillingNext(sub))]] : [];
  const buyLink = !s.isApp ? <GsaButton kind="link" onClick={toPlans}>{s.tiers.plans ? 'See the Plans' : 'Subscribe'}</GsaButton> : null;
  const oneLink = s.isApp && s.review.storeLink ? <GsaSlot>the one link the app store allows. Each app decides where it points.</GsaSlot> : null;

  let body = null;
  if (status === 'subscribed') {
    body = (
      <>
        <GsaBillingFacts rows={[['State', 'Subscribed'], ...base, ['Next payment', gsaLong(gsaBillingNext(sub))], ...pendingRow, ...cardRows]} />
        <div className="gsa-billing-actions">
          {!s.isApp ? <GsaButton kind="secondary" onClick={updateCard} disabled={busy}>Update payment card</GsaButton> : null}
          {!s.isApp && !sub.pending ? <GsaButton kind="secondary" onClick={() => open('plan')} disabled={busy}>Change to {gsaBillingOther(sub.plan)} Plan</GsaButton> : null}
          {!s.isApp && sub.pending ? <GsaButton kind="secondary" busy={busyOf === 'keep'} disabled={busy && busyOf !== 'keep'} onClick={keep}>Keep the {sub.plan} Plan</GsaButton> : null}
          <GsaButton kind="destructive" onClick={() => open('cancel')} disabled={busy}>Cancel Subscription</GsaButton>
        </div>
      </>
    );
  } else if (status === 'ending') {
    body = (
      <>
        <GsaStatusLine tone="warning">Your Subscription ends on {gsaLong(sub.endDate || gsaBillingNext(sub))}. You can resume before then.</GsaStatusLine>
        <GsaBillingFacts rows={[['State', 'Ending'], ['Ends on', gsaLong(sub.endDate || gsaBillingNext(sub))], ...base, ...cardRows]} />
        <GsaBillingKeeps />
        <div className="gsa-billing-actions">
          {!s.isApp ? <GsaButton kind="secondary" onClick={updateCard} disabled={busy}>Update payment card</GsaButton> : null}
          <GsaButton kind="primary" busy={busyOf === 'resume'} disabled={busy && busyOf !== 'resume'} onClick={resume}>Resume Subscription</GsaButton>
        </div>
      </>
    );
  } else if (status === 'payment-failed') {
    body = (
      <>
        <GsaStatusLine tone="danger">Your last payment failed. Update your payment card within the Retry window to keep your Subscription.</GsaStatusLine>
        <GsaBillingFacts rows={[['State', 'Payment failed'], ...base, ...pendingRow, ...cardRows]} />
        <div className="gsa-billing-actions">
          {!s.isApp ? <GsaButton kind="primary" onClick={updateCard} disabled={busy}>Update payment card</GsaButton> : null}
          <GsaButton kind="destructive" onClick={() => open('cancel')} disabled={busy}>Cancel Subscription</GsaButton>
        </div>
      </>
    );
  } else if (status === 'ended') {
    body = (
      <>
        <GsaBillingFacts rows={[['State', 'Ended'], ['Ended on', gsaLong(sub.endedOn || gsaDate(0))]]} />
        <GsaBillingKeeps ended />
        {buyLink || oneLink ? <div className="gsa-billing-actions">{buyLink}{oneLink}</div> : null}
      </>
    );
  } else {
    body = (
      <>
        <p className="gsa-text">You have no Subscription.</p>
        {buyLink || oneLink ? <div className="gsa-billing-actions">{buyLink}{oneLink}</div> : null}
      </>
    );
  }

  return (
    <div ref={cardRef} className="gsa-billing-card">
      <GsaCard title="Subscription">
        {notice === 'update-card-refused' ? <GsaStatusLine tone="warning">There is no active Subscription, so there is no payment card to update.</GsaStatusLine> : null}
        <div className="gsa-billing-note" role="status" tabIndex={-1} ref={noteRef} data-tone={note ? note.tone : undefined}>{note ? note.text : null}</div>
        {body}
      </GsaCard>
    </div>
  );
}

// ---- dialogs ----------------------------------------------------------------
function gsaBillingClose() {
  GsaStore.replace('account', {});
}

function GsaCancelDialog() {
  const s = useGsa();
  const sub = s.sub;
  const failed = sub.status === 'payment-failed';
  const allowed = sub.status === 'subscribed' || failed;
  const [busy, call] = useGsaProviderCall();
  const [error, setError] = React.useState(false);
  React.useEffect(() => { if (!allowed && !busy) gsaBillingClose(); }, [allowed, busy]);
  if (!allowed) return null;
  const endsOn = gsaLong(gsaBillingNext(sub));
  const confirm = () => {
    setError(false);
    call(() => {
      gsaBillingWrite(failed
        ? gsaBillingEnd(sub)
        : { status: 'ending', pending: null, endDate: gsaBillingNext(sub) });
      gsaBillingSay('success', failed
        ? 'Canceled. Your Subscription ended.'
        : 'Canceled. Your Subscription ends on ' + endsOn + '. You can resume before then.');
      gsaBillingClose();
    }, () => setError(true));
  };
  return (
    <GsaDialog
      title="Cancel your Subscription?"
      onClose={busy ? undefined : gsaBillingClose}
      actions={(
        <>
          <GsaButton kind="secondary" onClick={gsaBillingClose} disabled={busy}>Keep Subscription</GsaButton>
          <GsaButton kind="destructive" busy={busy} onClick={confirm}>Cancel Subscription</GsaButton>
        </>
      )}
    >
      {failed ? <p className="gsa-text">Your Subscription ends at once.</p> : (
        <>
          <p className="gsa-text">Your Subscription ends on {endsOn}. You pay nothing after that date.</p>
        </>
      )}
      <GsaBillingKeeps />
      {error ? <GsaStatusLine tone="danger">The Subscription was not canceled. Nothing changed. Try again.</GsaStatusLine> : null}
    </GsaDialog>
  );
}

function GsaPlanDialog() {
  const s = useGsa();
  const sub = s.sub;
  const allowed = sub.status === 'subscribed';
  const [busy, call] = useGsaProviderCall();
  const [error, setError] = React.useState(false);
  React.useEffect(() => { if (!allowed && !busy) gsaBillingClose(); }, [allowed, busy]);
  if (!allowed) return null;
  const to = gsaBillingOther(sub.plan);
  const from = gsaLong(gsaBillingNext(sub));
  const confirm = () => {
    setError(false);
    call(() => {
      gsaBillingWrite({ pending: to });
      gsaBillingSay('success', 'Plan change confirmed. You pay nothing now. The ' + to + ' Plan applies from ' + from + '.');
      gsaBillingClose();
    }, () => setError(true));
  };
  return (
    <GsaDialog
      title={'Change to the ' + to + ' Plan?'}
      onClose={busy ? undefined : gsaBillingClose}
      actions={(
        <>
          <GsaButton kind="secondary" onClick={gsaBillingClose} disabled={busy}>Not now</GsaButton>
          <GsaButton kind="primary" busy={busy} onClick={confirm}>Confirm change</GsaButton>
        </>
      )}
    >
      <p className="gsa-text">You pay nothing now and get no credit. The {to} Plan applies from {from}. Until then you can keep the {sub.plan} Plan.</p>
      <dl className="gsa-billing-facts">
        <div className="gsa-billing-fact"><dt>Current Plan</dt><dd><GsaPick>{GSA_BILLING_PLANS[sub.plan]}, {GSA_PLANS[sub.plan].price}</GsaPick></dd></div>
        <div className="gsa-billing-fact"><dt>New Plan</dt><dd><GsaPick>{GSA_BILLING_PLANS[to]}, {GSA_PLANS[to].price}</GsaPick></dd></div>
      </dl>
      {error ? <GsaStatusLine tone="danger">The Plan was not changed. You paid nothing. Try again.</GsaStatusLine> : null}
    </GsaDialog>
  );
}

Object.assign(window, { GsaSubscriptionCard, GsaCancelDialog, GsaPlanDialog, gsaProviderEvent });
