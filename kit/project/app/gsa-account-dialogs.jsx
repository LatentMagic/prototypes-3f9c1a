// ============================================================================
// Golden Sample App - Account dialogs: Reverification (GSA-013.BF-03/BF-04),
// email-change code (GSA-012), delete account (GSA-014, 015), and the data export file
// (GSA-016). Each closes with GsaStore.replace('account', {}).
// Styles: gsa-account.css.
// ============================================================================

function gsaAccountClose() {
  GsaStore.replace('account', {});
}

// 000000 is expired; 111111 or a short code is wrong; any other six digits pass.
function gsaAccountCodeError(v) {
  if (v === '000000') return 'That code has expired. Ask for a new one.';
  if (!v || v.length < 6 || v === '111111') return 'That code is not correct.';
  return null;
}

function gsaAccountDownload() {
  const s = GsaStore.get();
  const iso = (d) => (d ? new Date(d).toISOString() : null);
  const file = {
    account: { firstName: s.person.first, lastName: s.person.last, email: s.person.email, signInMethod: s.person.method },
    items: s.items.map((i) => ({ title: i.title, url: i.url, state: i.status, createdAt: iso(i.createdAt) })),
  };
  if (s.tiers.payment) {
    const sub = s.sub;
    file.subscription = sub.status === 'none'
      ? { state: 'none' }
      : { plan: sub.plan, state: sub.status, nextDate: iso(sub.nextDate), endDate: iso(sub.endDate), endedOn: iso(sub.endedOn) };
    if (sub.pending) file.subscription.pendingSwitch = { plan: sub.pending, from: iso(sub.nextDate) };
  }
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gsa-data-export.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function gsaAccountSubActive(s) {
  return s.tiers.payment && (s.sub.status === 'subscribed' || s.sub.status === 'payment-failed');
}

function gsaAccountDelete() {
  const s = GsaStore.get();
  if (gsaAccountSubActive(s) && s.review.payProvider === 'refuses') {
    GsaStore.replace('account', { dialog: 'delete', failed: true });
    return;
  }
  GsaStore.eraseAccount();
}

// ---- D1 Reverification -------------------------------------------------------
const GSA_ACCOUNT_REVERIFY_WHY = {
  email: 'Before you change your email address, prove it is you.',
  export: 'Before you export your data, prove it is you.',
  delete: 'Before you delete your account, prove it is you.',
};

// Password account: a password. Provider-managed account (no password): a code emailed
// to its address, a relay address included. "Send a new code" remounts the form (key),
// which clears the typed code and its old error. Both are picks (GSA-013 Additional).
function GsaReverifyDialog({ route }) {
  const g = useGsa();
  const [n, setN] = React.useState(0);
  return <GsaReverifyForm key={n} route={route} g={g} sent={n > 0} onNewCode={() => setN(n + 1)} />;
}

function GsaReverifyForm({ route, g, sent, onNewCode }) {
  const usesPassword = g.person.method === 'password';
  const slowDelete = route.for === 'delete' && gsaAccountSubActive(g) && g.review.payProvider === 'slow';
  const [busy, run] = useGsaBusy(slowDelete ? 2500 : 900);
  const form = useGsaForm({
    proof: (v) => {
      if (!usesPassword) return gsaAccountCodeError(v);
      if (!v) return 'Enter your password.';
      return v === 'wrong-password' ? 'That password is not correct.' : null;
    },
  });
  const proceed = () => {
    if (route.for === 'export') { gsaAccountDownload(); GsaStore.replace('account', { notice: 'export-ready' }); }
    else if (route.for === 'email') GsaStore.replace('account', { dialog: 'email-code', email: route.email });
    else gsaAccountDelete();
  };
  const submit = form.submit(() => run(proceed));
  return (
    <GsaDialog
      title="Prove it's you"
      onClose={gsaAccountClose}
      actions={(
        <>
          <GsaButton kind="secondary" onClick={gsaAccountClose}>Cancel</GsaButton>
          <GsaButton busy={busy} onClick={submit}>Continue</GsaButton>
        </>
      )}
    >
      <form onSubmit={submit} noValidate>
        <p className="gsa-account-dialog-text">{GSA_ACCOUNT_REVERIFY_WHY[route.for] || GSA_ACCOUNT_REVERIFY_WHY.export}</p>
        <p className="gsa-account-dialog-text"><GsaPick>Each app selects the proof</GsaPick></p>
        {usesPassword ? (
          <GsaField label="Password" type="password" autoComplete="current-password" {...form.bind('proof')} />
        ) : (
          <>
            <p className="gsa-account-dialog-text">We emailed a code to {g.person.email}.</p>
            <GsaCodeField label="Code" {...form.bind('proof')} />
            {sent ? <div className="gsa-account-dialog-status"><GsaStatusLine>A new code was sent.</GsaStatusLine></div> : null}
            <GsaButton kind="link" onClick={onNewCode}>Send a new code</GsaButton>
          </>
        )}
      </form>
    </GsaDialog>
  );
}

// ---- D2 Email-change code ----------------------------------------------------
// A new code remounts the form (key), which clears the typed code and its old error.
function GsaEmailCodeDialog({ route }) {
  const [n, setN] = React.useState(0);
  return <GsaEmailCodeForm key={n} route={route} sent={n > 0} onNewCode={() => setN(n + 1)} />;
}

function GsaEmailCodeForm({ route, sent, onNewCode }) {
  const email = route.email || '';
  const [busy, run] = useGsaBusy();
  const form = useGsaForm({ code: (v) => gsaAccountCodeError(v) });
  const sendNew = onNewCode;
  const confirm = () => {
    GsaStore.set({ person: { email } });
    const after = GsaStore.get();
    if (after.session === 'visitor') return;
    if (after.review.emailEndsSession) { GsaStore.signOut(); return; }
    GsaStore.replace('account', { notice: 'email-changed' });
  };
  const submit = form.submit(() => run(confirm));
  return (
    <GsaDialog
      title="Check your new email"
      onClose={gsaAccountClose}
      actions={(
        <>
          <GsaButton kind="secondary" onClick={gsaAccountClose}>Cancel</GsaButton>
          <GsaButton busy={busy} onClick={submit}>Change email</GsaButton>
        </>
      )}
    >
      <form onSubmit={submit} noValidate>
        <p className="gsa-account-dialog-text">We sent a code to {email}. Enter it to finish the change.</p>
        <GsaCodeField label="Code" {...form.bind('code')} />
        {sent ? <div className="gsa-account-dialog-status"><GsaStatusLine>A new code was sent.</GsaStatusLine></div> : null}
        <GsaButton kind="link" onClick={sendNew}>Send a new code</GsaButton>
      </form>
    </GsaDialog>
  );
}

// ---- D3 Delete account -------------------------------------------------------
function GsaDeleteDialog({ route }) {
  const g = useGsa();
  const status = g.sub.status;
  const pays = g.tiers.payment;
  const record = pays && (status === 'subscribed' || status === 'payment-failed');
  const lines = [];
  if (pays && status === 'subscribed') {
    lines.push('Deleting your account cancels your subscription.');
    lines.push('We take no more payment.');
    lines.push('We refund nothing.');
  } else if (pays && status === 'payment-failed') {
    lines.push('Deleting your account cancels your subscription.');
    lines.push('Your subscription ends at once.');
  }
  return (
    <GsaDialog
      title="Delete your account?"
      onClose={gsaAccountClose}
      actions={(
        <>
          <GsaButton kind="secondary" onClick={gsaAccountClose}>Cancel</GsaButton>
          <GsaButton kind="destructive" onClick={() => GsaStore.replace('account', { dialog: 'reverify', for: 'delete' })}>
            {route.failed ? 'Try again' : 'Delete account'}
          </GsaButton>
        </>
      )}
    >
      {route.failed ? (
        <div className="gsa-account-dialog-status">
          <GsaStatusLine tone="danger">We could not cancel your subscription, so your account is not deleted. Try again.</GsaStatusLine>
        </div>
      ) : null}
      <p className="gsa-account-dialog-text">This erases:</p>
      <ul className="gsa-account-list">
        <li>Your account, with your name and email address</li>
        <li>Every item in your queue</li>
        <li>Your sign-ins on every device</li>
        <li>The connections of your AI apps</li>
        {!g.isApp && g.push.channel !== 'none' ? <li>Notifications to your devices</li> : null}
        {record ? <li>Our record of your subscription</li> : null}
      </ul>
      {lines.map((t) => <p key={t} className="gsa-account-dialog-text">{t}</p>)}
      {pays && status === 'ending' ? <p className="gsa-account-dialog-text"><GsaPick>Your subscription is already set to end.</GsaPick></p> : null}
      <p className="gsa-account-dialog-text">You cannot undo this.</p>
    </GsaDialog>
  );
}

Object.assign(window, { GsaReverifyDialog, GsaEmailCodeDialog, GsaDeleteDialog });
