// ============================================================================
// GSA auth: Sign-in view, Sign-up page, provider page (GSA-004, 006, 008).
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

// Who signs in for a typed address: the password account on file for it, or null
// (GSA-004.EF-01). A Provider-managed account has no password to give (GSA-008).
function gsaAuthWho(email) {
  const who = window.GsaStore.accountByEmail(email);
  return who && window.GsaStore.personOf(who).method === 'password' ? who : null;
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

// ---- Step 1 choices (GSA-004, GSA-006, GSA-008) -------------------------------
// Three equal choices; none is primary, no divider. Google and Apple leave for the
// provider page (GSA-008); email opens step 2 of the same page.
const GSA_AUTH_PROVIDER_NAMES = { google: 'Google', apple: 'Apple' };
const GSA_AUTH_EMAIL_CHOICE = 'gsa-auth-email-choice';

function gsaAuthFocus(id) {
  setTimeout(() => { const el = document.getElementById(id); if (el) el.focus(); }, 0);
}

const GsaGoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
    <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-10.7-3.78H1.3v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.36 14.31a7.2 7.2 0 0 1 0-4.62v-3.1H1.3a12 12 0 0 0 0 10.82l4.06-3.1z" />
    <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A12 12 0 0 0 1.3 6.59l4.06 3.1A7.2 7.2 0 0 1 12 4.77z" />
  </svg>
);

// Stand-in mark: the build takes Apple's own asset (Apple's sign-in rules).
const GsaAppleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', marginTop: -2 }}>
    <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const GsaMailMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
  </svg>
);

function GsaAuthChoices({ from, failed }) {
  const pick = (provider) => window.GsaStore.replace('provider', { provider, from });
  const email = () => {
    window.GsaStore.replace(from, { step: 'email' });
    gsaAuthFocus('gsa-form-email');
  };
  return (
    <div className="gsa-auth-choices">
      <GsaButton kind="secondary" className="gsa-auth-choice" onClick={() => pick('google')}><GsaGoogleMark />Continue with Google</GsaButton>
      <GsaButton kind="secondary" className="gsa-auth-choice gsa-auth-apple" onClick={() => pick('apple')}><GsaAppleMark />Continue with Apple</GsaButton>
      <GsaButton kind="secondary" id={GSA_AUTH_EMAIL_CHOICE} className="gsa-auth-choice" onClick={email}><GsaMailMark />Continue with email</GsaButton>
      {failed ? (
        <div className="gsa-auth-fail" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" /></svg>
          <span>Couldn&rsquo;t continue with {GSA_AUTH_PROVIDER_NAMES[failed] || 'that account'}. Try again.</span>
        </div>
      ) : null}
    </div>
  );
}

// Back from step 2 to step 1; focus lands on "Continue with email".
function gsaAuthBackToChoices(from) {
  window.GsaStore.replace(from, {});
  gsaAuthFocus(GSA_AUTH_EMAIL_CHOICE);
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
    const who = gsaAuthWho(values.email);
    if (!who || values.password === GSA_AUTH_WRONG_PASSWORD) {
      setRefused(true);
      setTimeout(() => { const el = document.getElementById('gsa-form-password'); if (el) el.focus(); }, 0);
      return;
    }
    gsaAuthProceed(who, 'sign-in');
  }));
  const emailStep = !!(route && route.step === 'email');
  const foot = <>
    <GsaAuthConsent lead="By signing in you accept our" />
    <p className="gsa-auth-switch">New here? <GsaButton kind="link" onClick={() => window.GsaStore.replace('sign-up')}>Create an account</GsaButton></p>
  </>;
  if (!emailStep) {
    return (
      <GsaAuthFrame title="Sign in" foot={foot}>
        <GsaAuthChoices from="sign-in" failed={route && route.failed} />
      </GsaAuthFrame>
    );
  }
  return (
    <GsaAuthFrame title="Sign in" foot={foot} onBack={() => gsaAuthBackToChoices('sign-in')}>
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
    email: (v) => gsaAuthEmailError(v) || (window.GsaStore.emailTaken(v) ? 'An account already uses this email address.' : null),
    password: gsaAuthPasswordError,
  });
  const submit = form.submit((values) => run(() => {
    window.GsaStore.replace('sign-up-code', { email: values.email.trim(), first: values.first.trim(), last: values.last.trim() });
  }));
  const emailStep = !!(route && route.step === 'email');
  const foot = <>
    <GsaAuthConsent lead="By creating an account you accept our" />
    <p className="gsa-auth-switch">Already have an account? <GsaButton kind="link" onClick={() => window.GsaStore.replace('sign-in')}>Sign in</GsaButton></p>
  </>;
  if (!emailStep) {
    return (
      <GsaAuthFrame title="Create your account" foot={foot}>
        <GsaAuthChoices from="sign-up" failed={route && route.failed} />
      </GsaAuthFrame>
    );
  }
  return (
    <GsaAuthFrame title="Create your account" foot={foot} onBack={() => gsaAuthBackToChoices('sign-up')}>
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

// ---- S6 Provider page (GSA-008) -----------------------------------------------
// The provider's own page, pictured: Google and Apple sign-in happen outside the
// app. In the Store app Google opens the system browser (an embedded browser is
// refused), drawn with an address bar; Apple is the device's own sheet, no bar
// (lean). Continue follows Config "Google and Apple" (review.provider) and
// "Google or Apple account" (review.providerAccount). Cancel returns quietly (EF-03).
function GsaProvider({ route }) {
  const g = useGsa();
  const [busy, run] = useGsaBusy(600);
  const [hide, setHide] = React.useState(false);
  const provider = route && route.provider === 'apple' ? 'apple' : 'google';
  const from = route && route.from === 'sign-up' ? 'sign-up' : 'sign-in';
  const name = GSA_AUTH_PROVIDER_NAMES[provider];
  const id = window.GSA_PROVIDER_PEOPLE[provider][g.review.providerAccount === 'first-visit' ? 'firstVisit' : 'existing'];
  const store = window.GsaStore;
  const offerChoice = provider === 'apple' && !store.accountByProvider(id.id);
  const cont = () => run(() => {
    if (store.get().review.provider === 'fails') { store.replace(from, { failed: provider }); return; }
    const who = store.accountByProvider(id.id);
    if (who) { gsaAuthProceed(who, 'sign-in'); return; }
    const key = store.addAccount({ first: id.first, last: id.last, email: offerChoice && hide ? id.relay : id.email, method: provider, providerId: id.id });
    gsaAuthProceed(key, 'sign-up', true);
  });
  const bar = g.isApp && provider === 'google';
  return (
    <main className="gsa-auth-stage" data-chrome={bar ? 'browser' : 'sheet'}>
      <p className="gsa-auth-pictured">Pictured: {name}&rsquo;s own page, outside the app</p>
      <section className="gsa-auth-sheet" aria-label={name + ' sign-in'}>
        {bar ? <div className="gsa-auth-browserbar"><span className="gsa-auth-address">accounts.google.example</span></div> : null}
        <div className="gsa-auth-sheet-body">
          <h1 className="gsa-auth-sheet-title">Sign in with {name}</h1>
          <p className="gsa-auth-sheet-text">to continue to {window.GSA_APP_NAME}</p>
          <div className="gsa-auth-sheet-account">
            <span className="gsa-auth-sheet-name">{id.first} {id.last}</span>
            <span className="gsa-auth-sheet-mail">{id.email}</span>
          </div>
          {offerChoice ? (
            <fieldset className="gsa-auth-share">
              <legend className="gsa-auth-share-legend">Your email address</legend>
              <label className="gsa-auth-share-row">
                <input type="radio" name="gsa-auth-share" checked={!hide} onChange={() => setHide(false)} />
                <span><span className="gsa-auth-share-title">Share My Email</span><span className="gsa-auth-share-sub">{id.email}</span></span>
              </label>
              <label className="gsa-auth-share-row">
                <input type="radio" name="gsa-auth-share" checked={hide} onChange={() => setHide(true)} />
                <span><span className="gsa-auth-share-title">Hide My Email</span><span className="gsa-auth-share-sub">Forwards to {id.email}</span></span>
              </label>
            </fieldset>
          ) : null}
          <div className="gsa-auth-actions">
            <GsaButton busy={busy} onClick={cont}>Continue</GsaButton>
            <GsaButton kind="link" onClick={() => store.replace(from, {})}>Cancel</GsaButton>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, {
  GsaAuthFrame, GsaAuthConsent, GsaSignIn, GsaSignUp, GsaProvider,
  gsaAuthComplete, gsaAuthProceed, gsaAuthOnFile, gsaAuthWho, gsaAuthEmailError, gsaAuthPasswordError,
});
