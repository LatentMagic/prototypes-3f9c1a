// ============================================================================
// Golden Sample App - the Account page (GSA-017) and its cards: change password
// (GSA-010), change email (GSA-012), export (GSA-016), delete (GSA-014). Card
// order GSA-017 (BF-03/BF-04 for the re-check). Subscription and Notifications cards are other
// tasks' components, mounted by name. Dialogs live in gsa-account-dialogs.jsx.
// Styles: gsa-account.css.
// ============================================================================

function GsaAccountPasswordForm({ onDone }) {
  const form = useGsaForm({
    current: (v) => (!v ? 'Enter your current password.' : v === 'wrong-password' ? 'That is not your current password.' : null),
    next: (v) => (!v ? 'Enter a new password.' : v.length < 8 ? 'Use at least 8 characters.' : null),
  });
  const [busy, run] = useGsaBusy();
  return (
    <form className="gsa-account-form" onSubmit={form.submit(() => run(onDone))} noValidate>
      <GsaField label="Current password" type="password" autoComplete="current-password" {...form.bind('current')} />
      <GsaField label="New password" type="password" autoComplete="new-password" {...form.bind('next')} />
      <GsaButton type="submit" busy={busy}>Change password</GsaButton>
    </form>
  );
}

function GsaAccountPasswordCard({ notice }) {
  const [n, setN] = React.useState(0);
  const done = () => { setN(n + 1); GsaStore.replace('account', { notice: 'password-changed' }); };
  const statusRef = React.useRef(null);
  const changed = notice === 'password-changed';
  React.useEffect(() => { if (changed && n > 0 && statusRef.current) statusRef.current.focus(); }, [changed, n]);
  return (
    <GsaCard title="Change password">
      {changed ? <div className="gsa-account-status" ref={statusRef} tabIndex={-1}><GsaStatusLine tone="success">Your password has changed.</GsaStatusLine></div> : null}
      <GsaAccountPasswordForm key={n} onDone={done} />
    </GsaCard>
  );
}

function GsaAccountEmailForm({ g, onDone }) {
  const form = useGsaForm({
    email: (v, all) => {
      const val = String(v || '').trim().toLowerCase();
      if (!val) return 'Enter a new email address.';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) return 'Enter a valid email address.';
      if (val === g.person.email.toLowerCase()) return 'This account already has this email address.';
      if (GsaStore.emailTaken(val, g.who)) return 'Another account holds this email address.';
      return null;
    },
  });
  return (
    <form className="gsa-account-form" onSubmit={form.submit((values) => onDone(values.email.trim()))} noValidate>
      <GsaField label="New email address" type="email" autoComplete="email" {...form.bind('email')} />
      <GsaButton type="submit">Change email</GsaButton>
    </form>
  );
}

function GsaAccountEmailCard({ g, notice }) {
  const start = (email) => {
    if (g.review.emailReverify === 'asks') GsaStore.replace('account', { dialog: 'reverify', for: 'email', email });
    else GsaStore.replace('account', { dialog: 'email-code', email });
  };
  return (
    <GsaCard title="Change email">
      {notice === 'email-changed' ? <div className="gsa-account-status"><GsaStatusLine tone="success">Your email address has changed.</GsaStatusLine></div> : null}
      <GsaAccountEmailForm key={g.person.email} g={g} onDone={start} />
    </GsaCard>
  );
}

// GSA-017.AF-01: one card in place of change password and change email; no form for either.
const GSA_ACCOUNT_PROVIDER = { google: 'Google', apple: 'Apple' };

function GsaAccountProviderCard({ g }) {
  const provider = GSA_ACCOUNT_PROVIDER[g.person.method] || 'your sign-in provider';
  return (
    <GsaCard title="Email and sign-in">
      <p className="gsa-account-text">
        You sign in with {provider}. Change your email address and sign-in details with {provider}.
      </p>
    </GsaCard>
  );
}

function GsaAccountExportCard({ notice }) {
  const g = useGsa();
  const [limited, setLimited] = React.useState(false);
  const ask = () => {
    if (g.review.exportLimit) { setLimited(true); return; }
    setLimited(false);
    GsaStore.replace('account', { dialog: 'reverify', for: 'export' });
  };
  return (
    <GsaCard title="Export your data">
      <p className="gsa-account-text"><GsaPick>Card position: each app places it, always before Delete</GsaPick></p>
      <p className="gsa-account-text">Get a copy of your account details and your queue as a file.</p>
      {limited ? <div className="gsa-account-status"><GsaStatusLine tone="warning">You have asked for too many copies. You can ask again later.</GsaStatusLine></div> : null}
      {!limited && notice === 'export-ready' ? <div className="gsa-account-status"><GsaStatusLine tone="success">Your file has downloaded.</GsaStatusLine></div> : null}
      <GsaButton kind="secondary" onClick={ask}>Export data</GsaButton>
    </GsaCard>
  );
}

function GsaAccountDeleteCard() {
  return (
    <GsaCard title="Delete account">
      <p className="gsa-account-text">Delete your account and everything in it. You cannot undo this.</p>
      <GsaButton kind="destructive" onClick={() => GsaStore.replace('account', { dialog: 'delete' })}>Delete account</GsaButton>
    </GsaCard>
  );
}

function GsaAccountSlot({ danger, children }) {
  return <div className="gsa-account-slot" data-danger={danger ? 'true' : undefined}>{children}</div>;
}

function GsaAccount() {
  const g = useGsa();
  const route = g.route;
  const notice = route.notice;
  const managed = g.person.method !== 'password';
  const emailDialog = route.dialog === 'email-code' || (route.dialog === 'reverify' && route.for === 'email');
  const blocked = managed && emailDialog;
  // GSA-012.AF-01: a Provider-managed account never reaches the email-change dialogs.
  React.useEffect(() => { if (blocked) GsaStore.replace('account', {}); }, [blocked]);
  const Subscription = window.GsaSubscriptionCard;
  const Notifications = window.GsaNotificationsCard;
  const Dialog = route.dialog && !blocked && window.GSA_DIALOGS ? window[window.GSA_DIALOGS[route.dialog]] : null;
  return (
    <main className="gsa-page-wide">
      <div className="gsa-account-top">
        <GsaButton kind="link" className="gsa-account-back" onClick={() => GsaStore.back()}>Back</GsaButton>
        <h1 className="gsa-heading">Account</h1>
        <p className="gsa-account-email">
          <span className="gsa-account-email-label">Email address</span>
          {g.person.email}
        </p>
      </div>
      <div className="gsa-account-cards">
      <div className="gsa-account-grid">
        {g.tiers.payment && Subscription ? <GsaAccountSlot><Subscription notice={notice} /></GsaAccountSlot> : null}
        {!g.isApp && g.push.channel !== 'none' && Notifications ? <GsaAccountSlot><Notifications /></GsaAccountSlot> : null}
        {managed ? (
          <GsaAccountSlot><GsaAccountProviderCard g={g} /></GsaAccountSlot>
        ) : (
          <>
            <GsaAccountSlot><GsaAccountPasswordCard notice={notice} /></GsaAccountSlot>
            <GsaAccountSlot><GsaAccountEmailCard g={g} notice={notice} /></GsaAccountSlot>
          </>
        )}
        <GsaAccountSlot><GsaAccountExportCard notice={notice} /></GsaAccountSlot>
        <GsaAccountSlot danger><GsaAccountDeleteCard /></GsaAccountSlot>
      </div>
      </div>
      <div className="gsa-account-support">
        <GsaSlot>Support address: <a href={'mailto:' + window.GSA_SUPPORT}>{window.GSA_SUPPORT}</a></GsaSlot>
      </div>
      {Dialog ? <Dialog route={route} /> : null}
    </main>
  );
}

Object.assign(window, { GsaAccount });
