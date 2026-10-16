// ============================================================================
// GSA auth: Sign-in view, Sign-up page, external provider round trip.
// Codes (sign-up, device, authenticator, recovery) live in gsa-auth-codes.jsx.
// Auth routes are bare (no site frame), so GsaAuthFrame draws the page here.
// A code step runs before the session starts: the route carries who is signing
// in (method, via) and the step calls gsaAuthComplete when the code passes.
// ============================================================================
const GSA_AUTH_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GSA_AUTH_PASSWORD_MIN = 8;
const GSA_AUTH_TAKEN = 'taken@example.com';
const GSA_AUTH_WRONG_PASSWORD = 'wrong-password';
const GSA_AUTH_PROVIDER_NAMES = { google: 'Google', apple: 'Apple' };

function gsaAuthEmailError(v) {
  return GSA_AUTH_EMAIL.test(String(v || '').trim()) ? null : 'Enter a valid email address.';
}

function gsaAuthPasswordError(v) {
  return String(v || '').length >= GSA_AUTH_PASSWORD_MIN ? null : 'Use at least ' + GSA_AUTH_PASSWORD_MIN + ' characters (placeholder rule).';
}

// The account on file for a sign-in method: the store's person when it is that
// method's, else the seed person for it.
function gsaAuthOnFile(method) {
  const s = window.GsaStore.get();
  return s.person.method === method ? s.person : window.GSA_PEOPLE[method];
}

// Complete a sign-in: start the session, keep the account's enrolled flag,
// apply any names a new account carries, then route on through finishAuth.
function gsaAuthComplete(method, via, account) {
  const store = window.GsaStore;
  const enrolled = gsaAuthOnFile(method).enrolled;
  store.signIn(method);
  const patch = { ...(account || {}) };
  if (enrolled) patch.enrolled = true;
  if (Object.keys(patch).length) store.set({ person: patch });
  store.finishAuth(via);
}

// After the first step of a sign-in: a code is due when the account is enrolled
// (Authenticator code) or the device is new (Device verification code).
function gsaAuthProceed(method, via, forceDevice) {
  const store = window.GsaStore;
  const s = store.get();
  if (gsaAuthOnFile(method).enrolled) {
    store.replace('sign-in-code', { kind: 'authenticator', method, via });
  } else if (forceDevice || s.review.device === 'new') {
    store.replace('sign-in-code', { kind: 'device', method, via });
  } else {
    gsaAuthComplete(method, via);
  }
}

function GsaAuthFrame({ title, lead, onBack, backLabel = 'Back', foot, children }) {
  return (
    <main className="gsa-page gsa-auth">
      <div className="gsa-auth-bar">
        {onBack ? <GsaButton kind="link" onClick={onBack}>{backLabel}</GsaButton> : <span />}
        <span className="gsa-auth-name">{window.GSA_APP_NAME}</span>
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
      {g.tiers.payment ? <>{' and '}<a href="#" onClick={open('refund')}>Refund Policy</a></> : null}.
    </p>
  );
}

function GsaAuthProviders({ from, failed }) {
  const pick = (provider) => window.GsaStore.replace('provider', { provider, from });
  return (
    <div className="gsa-auth-providers">
      <GsaButton kind="secondary" onClick={() => pick('google')}>Continue with Google</GsaButton>
      <GsaButton kind="secondary" onClick={() => pick('apple')}>Continue with Apple</GsaButton>
      {failed ? <GsaStatusLine tone="danger">Signing in with {GSA_AUTH_PROVIDER_NAMES[failed] || 'that account'} did not work. You can use your email address instead.</GsaStatusLine> : null}
      <p className="gsa-auth-or">Or use your email address</p>
    </div>
  );
}

// ---- S1 Sign-in view ---------------------------------------------------------
function GsaSignIn({ route }) {
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
    if (values.password === GSA_AUTH_WRONG_PASSWORD) { setRefused(true); return; }
    gsaAuthProceed('password', 'sign-in');
  }));
  return (
    <GsaAuthFrame title="Sign in" foot={<>
      <GsaAuthConsent lead="By signing in you accept our" />
      <p className="gsa-auth-switch">New here? <GsaButton kind="link" onClick={() => window.GsaStore.replace('sign-up')}>Create an account</GsaButton></p>
    </>}>
      <GsaAuthProviders from="sign-in" failed={route && route.failed} />
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
function GsaSignUp({ route }) {
  const [busy, run] = useGsaBusy();
  const form = useGsaForm({
    first: (v) => (String(v).trim() ? null : 'Enter your first name.'),
    last: (v) => (String(v).trim() ? null : 'Enter your last name.'),
    email: (v) => gsaAuthEmailError(v) || (String(v).trim().toLowerCase() === GSA_AUTH_TAKEN ? 'An account already uses this email address.' : null),
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
      <GsaAuthProviders from="sign-up" failed={route && route.failed} />
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

// ---- S6 External provider round trip ----------------------------------------
// A pictured provider sheet in the provider's own neutral look. In the Store app
// it is drawn as the system browser. Continue follows Config "Google and Apple"
// (review.provider) and "Google or Apple account" (review.providerAccount).
function GsaProvider({ route }) {
  const g = useGsa();
  const [busy, run] = useGsaBusy(600);
  const provider = route && route.provider === 'apple' ? 'apple' : 'google';
  const from = route && route.from === 'sign-up' ? 'sign-up' : 'sign-in';
  const name = GSA_AUTH_PROVIDER_NAMES[provider];
  const who = window.GSA_PEOPLE[provider];
  const leave = (extra) => window.GsaStore.replace(from, extra || {});
  const cont = () => run(() => {
    const outcome = window.GsaStore.get().review;
    if (outcome.provider === 'cancelled') { leave(); return; }
    if (outcome.provider === 'fails') { leave({ failed: provider }); return; }
    if (outcome.providerAccount === 'first-visit') gsaAuthProceed(provider, 'sign-up', true);
    else gsaAuthProceed(provider, 'sign-in');
  });
  const address = provider === 'google' ? 'accounts.google.example' : 'appleid.apple.example';
  return (
    <main className="gsa-auth-stage" data-chrome={g.isApp ? 'browser' : 'sheet'}>
      <p className="gsa-auth-pictured">Pictured: {name}&rsquo;s own page, outside the app</p>
      <section className="gsa-auth-sheet" aria-label={name + ' sign-in'}>
        {g.isApp ? <div className="gsa-auth-browserbar"><span className="gsa-auth-address">{address}</span></div> : null}
        <div className="gsa-auth-sheet-body">
          <h1 className="gsa-auth-sheet-title">Sign in with {name}</h1>
          <p className="gsa-auth-sheet-text">to continue to {window.GSA_APP_NAME}</p>
          <div className="gsa-auth-sheet-account">
            <span className="gsa-auth-sheet-name">{who.first} {who.last}</span>
            <span className="gsa-auth-sheet-mail">{who.email}</span>
          </div>
          <div className="gsa-auth-actions">
            <GsaButton busy={busy} onClick={cont}>Continue</GsaButton>
            <GsaButton kind="link" onClick={() => leave()}>Cancel</GsaButton>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, {
  GsaAuthFrame, GsaAuthConsent, GsaSignIn, GsaSignUp, GsaProvider,
  gsaAuthComplete, gsaAuthProceed, gsaAuthOnFile, gsaAuthEmailError, gsaAuthPasswordError,
});
