// ============================================================================
// GSA auth: Sign-in view, Sign-up page.
// Codes (sign-up, device, authenticator, recovery) live in gsa-auth-codes.jsx.
// Auth routes are bare (no site frame), so GsaAuthFrame draws the page here.
// A code step runs before the session starts: the route carries who is signing
// in (who, via) and the step calls gsaAuthComplete when the code passes.
// ============================================================================
const GSA_AUTH_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GSA_AUTH_PASSWORD_MIN = 8;
const GSA_AUTH_WRONG_PASSWORD = 'wrong-password';

function gsaAuthEmailError(v) {
  return GSA_AUTH_EMAIL.test(String(v || '').trim()) ? null : 'Enter a valid email address.';
}

function gsaAuthPasswordError(v) {
  return String(v || '').length >= GSA_AUTH_PASSWORD_MIN ? null : 'Use at least ' + GSA_AUTH_PASSWORD_MIN + ' characters (placeholder rule).';
}

// Who signs in for a typed address: the account on file for it, or null (GSA-004.EF-01).
function gsaAuthWho(email) {
  return window.GsaStore.accountByEmail(email);
}

// The account on file for a seed person, from the store.
function gsaAuthOnFile(who) {
  return window.GsaStore.personOf(who);
}

// Complete a sign-in: start the session (a new account carries its typed
// names and email), then route on through finishAuth.
function gsaAuthComplete(who, via, account) {
  const store = window.GsaStore;
  store.signIn(who, account);
  store.finishAuth(via);
}

// After the first step of a sign-in: a code is due when the account is enrolled
// (Authenticator code) or the device is new (Device verification code).
function gsaAuthProceed(who, via, forceDevice) {
  const store = window.GsaStore;
  const s = store.get();
  if (gsaAuthOnFile(who).enrolled) {
    store.replace('sign-in-code', { kind: 'authenticator', who, via });
  } else if (forceDevice || s.review.device === 'new') {
    store.replace('sign-in-code', { kind: 'device', who, via });
  } else {
    gsaAuthComplete(who, via);
  }
}

function GsaAuthFrame({ title, lead, onBack, backLabel = 'Back', foot, children }) {
  return (
    <main className="gsa-page gsa-auth">
      <div className="gsa-auth-bar">
        <span className="gsa-auth-name">{window.GSA_APP_NAME}</span>
        {onBack ? <GsaButton kind="link" onClick={onBack}>{backLabel}</GsaButton> : null}
      </div>
      <h1 className="gsa-heading">{title}</h1>
      {lead ? <p className="gsa-text">{lead}</p> : null}
      {children}
      {foot ? <div className="gsa-auth-foot">{foot}</div> : null}
    </main>
  );
}

function GsaAuthConsent({ lead }) {
  const g = useGsa();
  const open = (page) => (e) => { e.preventDefault(); window.GsaStore.go('legal', { page }); };
  return (
    <p className="gsa-auth-consent">
      {lead} <a href="#" onClick={open('terms')}>Terms</a>
      {g.tiers.payment ? ', ' : ' and '}
      <a href="#" onClick={open('privacy')}>Privacy policy</a>
      {g.tiers.payment ? <>{' and '}<GsaPick><a href="#" onClick={open('refund')}>Refund Policy</a></GsaPick></> : null}.
    </p>
  );
}

// ---- S1 Sign-in view ---------------------------------------------------------
function GsaSignIn() {
  const [busy, run] = useGsaBusy();
  const [refused, setRefused] = React.useState(false);
  const form = useGsaForm({
    email: gsaAuthEmailError,
    password: (v) => (v ? null : 'Enter your password.'),
  });
  const bind = (name) => {
    const b = form.bind(name);
    return { ...b, onChange: (e) => { setRefused(false); b.onChange(e); } };
  };
  const submit = form.submit((values) => run(() => {
    const who = gsaAuthWho(values.email);
    if (!who || values.password === GSA_AUTH_WRONG_PASSWORD) {
      setRefused(true);
      setTimeout(() => { const el = document.getElementById('gsa-form-password'); if (el) el.focus(); }, 0);
      return;
    }
    gsaAuthProceed(who, 'sign-in');
  }));
  return (
    <GsaAuthFrame title="Sign in" foot={<>
      <GsaAuthConsent lead="By signing in you accept our" />
      <p className="gsa-auth-switch">New here? <GsaButton kind="link" onClick={() => window.GsaStore.replace('sign-up')}>Create an account</GsaButton></p>
    </>}>
      <form className="gsa-auth-form" noValidate onSubmit={submit}>
        <GsaField label="Email address" type="email" autoComplete="email" {...bind('email')} />
        <GsaField label="Password" type="password" autoComplete="current-password" {...bind('password')} />
        {refused ? <GsaStatusLine tone="danger">That email address and password do not match an account. Try again.</GsaStatusLine> : null}
        <div className="gsa-auth-actions">
          <GsaButton type="submit" busy={busy}>Sign in</GsaButton>
          <GsaButton kind="link" onClick={() => window.GsaStore.replace('recover', { step: 'email' })}>Forgot your password?</GsaButton>
        </div>
      </form>
    </GsaAuthFrame>
  );
}

// ---- S2 Sign-up page ---------------------------------------------------------
function GsaSignUp() {
  const [busy, run] = useGsaBusy();
  const form = useGsaForm({
    first: (v) => (String(v).trim() ? null : 'Enter your first name.'),
    last: (v) => (String(v).trim() ? null : 'Enter your last name.'),
    email: (v) => gsaAuthEmailError(v) || (window.GsaStore.emailTaken(v) ? 'An account already uses this email address.' : null),
    password: gsaAuthPasswordError,
  });
  const submit = form.submit((values) => run(() => {
    window.GsaStore.replace('sign-up-code', { email: values.email.trim(), first: values.first.trim(), last: values.last.trim() });
  }));
  return (
    <GsaAuthFrame title="Create your account" foot={<>
      <GsaAuthConsent lead="By creating an account you accept our" />
      <p className="gsa-auth-switch">Already have an account? <GsaButton kind="link" onClick={() => window.GsaStore.replace('sign-in')}>Sign in</GsaButton></p>
    </>}>
      <form className="gsa-auth-form" noValidate onSubmit={submit}>
        <GsaField label="First name" autoComplete="given-name" {...form.bind('first')} />
        <GsaField label="Last name" autoComplete="family-name" {...form.bind('last')} />
        <GsaField label="Email address" type="email" autoComplete="email" {...form.bind('email')} />
        <GsaField label="Password" type="password" autoComplete="new-password" hint={'At least ' + GSA_AUTH_PASSWORD_MIN + ' characters (placeholder rule)'} {...form.bind('password')} />
        <div className="gsa-auth-actions">
          <GsaButton type="submit" busy={busy}>Create account</GsaButton>
        </div>
      </form>
    </GsaAuthFrame>
  );
}

Object.assign(window, {
  GsaAuthFrame, GsaAuthConsent, GsaSignIn, GsaSignUp,
  gsaAuthComplete, gsaAuthProceed, gsaAuthOnFile, gsaAuthWho, gsaAuthEmailError, gsaAuthPasswordError,
});
