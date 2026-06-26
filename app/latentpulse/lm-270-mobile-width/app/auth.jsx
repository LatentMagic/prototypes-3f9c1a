// ============================================================================
// LatentPulse — Auth surfaces. No app shell. Centred card on neutral page.
// Sign-in, Sign-up, One-time-code, Google return, Password recovery.
// ============================================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- Shared frame ----------------------------------------------------------
const AuthFrame = ({ title, subtitle, children, footer, onBack }) => (
  <div style={{
    minHeight: 'var(--lp-vh)', background: 'var(--color-canvas)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '32px 20px 48px',
  }}>
    <div style={{ width: '100%', maxWidth: 400, display: 'flex', justifyContent: onBack ? 'space-between' : 'center', alignItems: 'center', marginTop: 'min(4vh, 28px)', marginBottom: 32 }}>
      {onBack && (
        <button onClick={onBack} aria-label="Back" style={{
          background: 'transparent', border: 0, padding: 8, margin: -8, cursor: 'pointer',
          color: 'var(--color-fg-2)', display: 'inline-flex',
        }}><Icon name="arrow-left" size={20} /></button>
      )}
      <Wordmark size={17} />
      {onBack && <span style={{ width: 20 }} />}
    </div>
    <div style={{
      width: '100%', maxWidth: 400, background: 'var(--color-surface)',
      border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-8)', boxShadow: 'var(--shadow-raised)',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)',
        lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0,
      }}>{title}</h1>
      {subtitle && (
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5,
          color: 'var(--color-fg-2)', margin: '8px 0 0',
        }}>{subtitle}</p>
      )}
      <div style={{ marginTop: 'var(--space-6)' }}>{children}</div>
    </div>
    {footer && (
      <div style={{
        marginTop: 'var(--space-5)', fontFamily: 'var(--font-sans)', fontSize: 14,
        color: 'var(--color-fg-2)', textAlign: 'center',
      }}>{footer}</div>
    )}
  </div>
);

// Tertiary inline text link
const TextLink = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-accent)',
    textDecoration: 'none',
  }} className="lp-textlink">{children}</button>
);

const OrDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: 'var(--space-5) 0' }}>
    <span style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, color: 'var(--color-fg-3)' }}>or</span>
    <span style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
  </div>
);

// ---- Sign in ---------------------------------------------------------------
const SignIn = ({ onSubmit, onGoogle, onForgot, onGoSignup }) => {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState({});
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!pw) next.pw = 'Enter your password.';
    setErr(next);
    if (Object.keys(next).length === 0) onSubmit({ email: email.trim() });
  };
  return (
    <AuthFrame title="Sign in" subtitle="Pick up your queue where you left off."
      footer={<span>New here? <TextLink onClick={onGoSignup}>Create an account</TextLink></span>}>
      <form onSubmit={submit} noValidate>
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => { setEmail(e.target.value); setErr(s => ({ ...s, email: null })); }} error={err.email} autoFocus />
        <Field label="Password" name="password" type="password" autoComplete="current-password" placeholder="••••••••"
          value={pw} onChange={(e) => { setPw(e.target.value); setErr(s => ({ ...s, pw: null })); }} error={err.pw} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6, marginBottom: 'var(--space-5)' }}>
          <TextLink onClick={onForgot}>Forgot password?</TextLink>
        </div>
        <Button type="submit" variant="primary" full size="lg">Sign in</Button>
      </form>
      <OrDivider />
      <Button variant="secondary" full size="lg" icon={<Icon name="google" size={18} />} onClick={onGoogle}>Continue with Google</Button>
    </AuthFrame>
  );
};

// ---- Sign up ---------------------------------------------------------------
const SignUp = ({ onSubmit, onGoogle, onGoSignin }) => {
  const [first, setFirst] = React.useState('');
  const [last, setLast] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState({});
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!first.trim()) next.first = 'Enter your first name.';
    if (!last.trim()) next.last = 'Enter your last name.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (pw.length < 8) next.pw = 'Use at least 8 characters.';
    setErr(next);
    if (Object.keys(next).length === 0) onSubmit({ firstName: first.trim(), lastName: last.trim(), email: email.trim() });
  };
  return (
    <AuthFrame title="Create your account" subtitle="One account, every space you’re part of."
      footer={<span>Already have an account? <TextLink onClick={onGoSignin}>Sign in</TextLink></span>}>
      <form onSubmit={submit} noValidate>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Field label="First name" name="given-name" autoComplete="given-name" placeholder="Sam"
              value={first} onChange={(e) => { setFirst(e.target.value); setErr(s => ({ ...s, first: null })); }} error={err.first} autoFocus />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Field label="Last name" name="family-name" autoComplete="family-name" placeholder="Rivera"
              value={last} onChange={(e) => { setLast(e.target.value); setErr(s => ({ ...s, last: null })); }} error={err.last} />
          </div>
        </div>
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => { setEmail(e.target.value); setErr(s => ({ ...s, email: null })); }} error={err.email} />
        <Field label="Password" name="new-password" type="password" autoComplete="new-password" placeholder="At least 8 characters"
          value={pw} onChange={(e) => { setPw(e.target.value); setErr(s => ({ ...s, pw: null })); }} error={err.pw}
          hint="At least 8 characters." />
        <Button type="submit" variant="primary" full size="lg" style={{ marginTop: 'var(--space-2)' }}>Create account</Button>
      </form>
      <OrDivider />
      <Button variant="secondary" full size="lg" icon={<Icon name="google" size={18} />} onClick={onGoogle}>Continue with Google</Button>
    </AuthFrame>
  );
};

// ---- One-time-code entry (shared) ------------------------------------------
// context: 'signup' | 'device' | 'recovery'. initialError lets the scenario
// launcher showcase the two error registers directly.
const OTC_TITLE = {
  signup: 'Verify your email',
  device: 'Verify this device',
  recovery: 'Enter your code',
};
const OtcEntry = ({ email, context = 'device', initialError = null, onVerify, onBack }) => {
  const [code, setCode] = React.useState('');
  const [err, setErr] = React.useState(initialError);
  const [resent, setResent] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { const t = setTimeout(() => ref.current && ref.current.focus(), 60); return () => clearTimeout(t); }, []);

  const submit = (e) => {
    e.preventDefault();
    const v = code.replace(/\s/g, '');
    if (v.length < 6) { setErr('That code\u2019s not right \u2014 check and re-enter.'); return; }
    if (v === '000000') { setErr({ expired: true }); return; }     // demo: expired
    if (v === '111111') { setErr('That code\u2019s not right \u2014 check and re-enter.'); return; } // demo: wrong
    setErr(null); onVerify();
  };
  const resend = () => { setResent(true); setErr(null); setCode(''); ref.current && ref.current.focus(); setTimeout(() => setResent(false), 2600); };
  const expired = err && err.expired;

  return (
    <AuthFrame onBack={onBack} title={OTC_TITLE[context]}
      subtitle={<span>Enter the 6-digit code sent to <strong style={{ color: 'var(--color-fg-1)', fontWeight: 600 }}>{email || 'your email'}</strong>.</span>}>
      <form onSubmit={submit} noValidate>
        <Field ref={ref} name="otc" mono type="text" inputMode="numeric" maxLength={6}
          placeholder="000000" value={code}
          onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '')); if (err) setErr(null); }}
          style={{ letterSpacing: '0.5em', fontSize: 22, textAlign: 'center', fontWeight: 600 }}
          error={typeof err === 'string' ? err : null}
        />
        {expired && (
          <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: -8, marginBottom: 'var(--space-4)',
            fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-1)' }}>
            <span style={{ marginTop: 1, color: 'var(--color-destructive)' }}><Icon name="x" size={14} /></span>
            <span>That code’s expired — request a fresh one.</span>
          </div>
        )}
        <Button type="submit" variant="primary" full size="lg">Verify</Button>
      </form>
      <div style={{ marginTop: 'var(--space-5)', textAlign: 'center' }}>
        {resent ? (
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={16} color="var(--color-accent)" /> A fresh code is on its way.
          </span>
        ) : (
          <TextLink onClick={resend}>Resend code</TextLink>
        )}
      </div>
    </AuthFrame>
  );
};

// ---- Google sign-in return -------------------------------------------------
const GoogleReturn = ({ onDone }) => {
  React.useEffect(() => { const t = setTimeout(onDone, 1500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      minHeight: 'var(--lp-vh)', background: 'var(--color-canvas)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <Wordmark size={18} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-fg-2)' }}>
        <Spinner size={18} light={false} />
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15 }}>Completing sign-in…</span>
      </div>
    </div>
  );
};

// ---- Password recovery (3 sequential views) --------------------------------
const Recovery = ({ onDone, onBackToSignin }) => {
  const [step, setStep] = React.useState('email'); // email | code | newpass
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [err, setErr] = React.useState(null);

  if (step === 'email') {
    const submit = (e) => {
      e.preventDefault();
      if (!EMAIL_RE.test(email.trim())) { setErr('Enter a valid email address.'); return; }
      setErr(null); setStep('sent');
    };
    return (
      <AuthFrame onBack={onBackToSignin} title="Reset your password"
        subtitle="Enter your email and we’ll send a code.">
        <form onSubmit={submit} noValidate>
          <Field label="Email" name="rec-email" type="email" placeholder="you@example.com" autoFocus
            value={email} onChange={(e) => { setEmail(e.target.value); setErr(null); }} error={err} />
          <Button type="submit" variant="primary" full size="lg">Send code</Button>
        </form>
      </AuthFrame>
    );
  }
  if (step === 'sent') {
    // Calm, non-committal confirmation, then continue to code entry.
    return (
      <AuthFrame onBack={() => setStep('email')} title="Check your email"
        subtitle="If an account exists for that email, a code is on its way.">
        <Button variant="primary" full size="lg" onClick={() => setStep('code')}>Enter code</Button>
        <div style={{ marginTop: 'var(--space-5)', textAlign: 'center' }}>
          <TextLink onClick={() => setStep('email')}>Use a different email</TextLink>
        </div>
      </AuthFrame>
    );
  }
  if (step === 'code') {
    const submit = (e) => {
      e.preventDefault();
      const v = code.replace(/\s/g, '');
      if (v.length < 6) { setErr('That code\u2019s not right \u2014 check and re-enter.'); return; }
      setErr(null); setStep('newpass');
    };
    return (
      <AuthFrame onBack={() => setStep('sent')} title="Enter your code"
        subtitle={<span>Enter the 6-digit code sent to <strong style={{ color: 'var(--color-fg-1)', fontWeight: 600 }}>{email}</strong>.</span>}>
        <form onSubmit={submit} noValidate>
          <Field name="rec-code" mono type="text" inputMode="numeric" maxLength={6} placeholder="000000" autoFocus
            value={code} onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '')); setErr(null); }}
            style={{ letterSpacing: '0.5em', fontSize: 22, textAlign: 'center', fontWeight: 600 }} error={err} />
          <Button type="submit" variant="primary" full size="lg">Verify</Button>
        </form>
      </AuthFrame>
    );
  }
  // newpass
  const submit = (e) => {
    e.preventDefault();
    if (pw.length < 8) { setErr('Use at least 8 characters.'); return; }
    if (pw !== pw2) { setErr('Passwords don\u2019t match. Re-enter to confirm.'); return; }
    setErr(null); onDone();
  };
  return (
    <AuthFrame title="Set a new password" subtitle="Choose a password you haven’t used here before.">
      <form onSubmit={submit} noValidate>
        <Field label="New password" name="np" type="password" autoComplete="new-password" placeholder="At least 8 characters" autoFocus
          value={pw} onChange={(e) => { setPw(e.target.value); setErr(null); }} error={err && pw.length < 8 ? err : null} />
        <Field label="Confirm new password" name="np2" type="password" autoComplete="new-password" placeholder="Re-enter password"
          value={pw2} onChange={(e) => { setPw2(e.target.value); setErr(null); }} error={err && pw.length >= 8 ? err : null} />
        <Button type="submit" variant="primary" full size="lg">Update password</Button>
      </form>
    </AuthFrame>
  );
};

Object.assign(window, { EMAIL_RE, AuthFrame, TextLink, SignIn, SignUp, OtcEntry, GoogleReturn, Recovery });
