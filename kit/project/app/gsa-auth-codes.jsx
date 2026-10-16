// ============================================================================
// GSA auth codes: Sign-up code step, Sign-in code page, Password recovery.
// Demo codes: 000000 is expired, 111111 or fewer than six digits is wrong, any
// other six digits pass. Only a Device verification code and a recovery or
// Sign-up code can be asked for again; an Authenticator code cannot.
// ============================================================================
const GSA_AUTH_CODE_EXPIRED = '000000';
const GSA_AUTH_CODE_WRONG = '111111';
const GSA_AUTH_CODE_FIELD = 'gsa-auth-code';

function gsaAuthCheckCode(code) {
  if (code.length < 6 || code === GSA_AUTH_CODE_WRONG) return 'wrong';
  if (code === GSA_AUTH_CODE_EXPIRED) return 'expired';
  return 'ok';
}

// One field, a submit, and (when a new code can be asked for) a new-code control.
function GsaAuthCodeForm({ email, canResend, submitLabel = 'Continue', onVerified, children }) {
  const [code, setCode] = React.useState('');
  const [problem, setProblem] = React.useState(null);
  const [sent, setSent] = React.useState(false);
  const [busy, run] = useGsaBusy();
  const [sending, runSend] = useGsaBusy();
  const focus = () => setTimeout(() => {
    const el = document.getElementById(GSA_AUTH_CODE_FIELD);
    if (el) el.focus();
  }, 0);
  const submit = (e) => {
    e.preventDefault();
    run(() => {
      const result = gsaAuthCheckCode(code);
      const shown = result === 'expired' && !canResend ? 'wrong' : result;
      if (shown === 'ok') { setProblem(null); onVerified(); return; }
      setProblem(shown);
      focus();
    });
  };
  const again = () => runSend(() => { setSent(true); setProblem(null); setCode(''); focus(); });
  const error = problem === 'expired' ? 'This code has expired. Ask for a new one.'
    : problem === 'wrong' ? 'That code is not right. Check it and try again.' : undefined;
  return (
    <form className="gsa-auth-form" noValidate onSubmit={submit}>
      <GsaCodeField id={GSA_AUTH_CODE_FIELD} label="Code" value={code} error={error}
        onChange={(v) => { setCode(v); setProblem(null); setSent(false); }} />
      {sent ? <GsaStatusLine tone="success">A new code is on its way to {email}.</GsaStatusLine> : null}
      <div className="gsa-auth-actions">
        <GsaButton type="submit" busy={busy}>{submitLabel}</GsaButton>
        {canResend ? <GsaButton kind="link" busy={sending} onClick={again}>Send a new code</GsaButton> : null}
        {children}
      </div>
    </form>
  );
}

// ---- S3 Sign-up code step ------------------------------------------------------
function GsaSignUpCode({ route }) {
  const email = (route && route.email) || window.GSA_PEOPLE.password.email;
  const first = (route && route.first) || window.GSA_PEOPLE.password.first;
  const last = (route && route.last) || window.GSA_PEOPLE.password.last;
  return (
    <window.GsaAuthFrame title="Check your email" onBack={() => window.GsaStore.replace('sign-up')}
      lead={'We sent a six-digit code to ' + email + '. Enter it to finish creating your account.'}>
      <GsaAuthCodeForm email={email} canResend submitLabel="Create account"
        onVerified={() => window.gsaAuthComplete('password', 'sign-up', { first, last, email, method: 'password' })} />
    </window.GsaAuthFrame>
  );
}

// ---- S4 Sign-in code page ------------------------------------------------------
function GsaSignInCode({ route }) {
  const kind = route && route.kind === 'authenticator' ? 'authenticator' : 'device';
  const method = (route && route.method) || 'password';
  const via = (route && route.via) || 'sign-in';
  const email = window.gsaAuthOnFile(method).email;
  const device = kind === 'device';
  const lead = device
    ? 'This looks like a new device. We sent a code to ' + email + '.'
    : 'Open your authenticator app and enter the six-digit code it shows for this account.';
  const done = () => {
    if (device) window.GsaStore.set({ review: { device: 'known' } });
    window.gsaAuthComplete(method, via);
  };
  return (
    <window.GsaAuthFrame title="Enter your sign-in code" lead={lead}>
      <GsaAuthCodeForm email={email} canResend={device} submitLabel="Sign in" onVerified={done}>
        <GsaButton kind="link" onClick={() => window.GsaStore.replace('sign-in')}>Cancel</GsaButton>
      </GsaAuthCodeForm>
    </window.GsaAuthFrame>
  );
}

// ---- S5 Password recovery ------------------------------------------------------
// One route, three steps. The page reads the same for an address with an account
// and one without (GSA-009 Additional).
function GsaRecover({ route }) {
  const step = route && (route.step === 'code' || route.step === 'password') ? route.step : 'email';
  const email = (route && route.email) || '';
  const [busy, run] = useGsaBusy();
  const go = (next, extra) => window.GsaStore.replace('recover', { step: next, email, ...(extra || {}) });
  const emailForm = useGsaForm({ email: window.gsaAuthEmailError });
  const pwForm = useGsaForm({ password: window.gsaAuthPasswordError });
  if (step === 'email') {
    const submit = emailForm.submit((v) => run(() => go('code', { email: v.email.trim() })));
    return (
      <window.GsaAuthFrame title="Reset your password" onBack={() => window.GsaStore.replace('sign-in')}
        lead="Enter the email address of your account. We will send a code to it.">
        <form className="gsa-auth-form" noValidate onSubmit={submit}>
          <GsaField label="Email address" type="email" autoComplete="email" {...emailForm.bind('email')} />
          <div className="gsa-auth-actions"><GsaButton type="submit" busy={busy}>Send code</GsaButton></div>
        </form>
      </window.GsaAuthFrame>
    );
  }
  const shown = email || 'your email address';
  if (step === 'code') {
    return (
      <window.GsaAuthFrame title="Enter the code" onBack={() => go('email')}
        lead={'If that address has an account, a six-digit code is on its way to ' + shown + '.'}>
        <GsaAuthCodeForm email={shown} canResend onVerified={() => go('password')} />
      </window.GsaAuthFrame>
    );
  }
  const submit = pwForm.submit(() => run(() => window.gsaAuthProceed('password', 'sign-in')));
  return (
    <window.GsaAuthFrame title="Choose a new password" onBack={() => go('code')} lead="Pick a password you have not used here before.">
      <form className="gsa-auth-form" noValidate onSubmit={submit}>
        <GsaField label="New password" type="password" autoComplete="new-password"
          hint={'At least ' + GSA_AUTH_PASSWORD_MIN + ' characters (placeholder rule)'} {...pwForm.bind('password')} />
        <div className="gsa-auth-actions"><GsaButton type="submit" busy={busy}>Set password</GsaButton></div>
      </form>
    </window.GsaAuthFrame>
  );
}

Object.assign(window, { GsaSignUpCode, GsaSignInCode, GsaRecover, GsaAuthCodeForm, gsaAuthCheckCode });
