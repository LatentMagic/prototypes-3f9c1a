// ============================================================================
// Circlists — Auth surfaces. No app shell, no card: every surface is AuthPage.
// Sign-in, Sign-up, One-time-code, Google return, Password recovery.
// ============================================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- The sign-in / sign-up page (signup-one-screen, 02.2, ratified 5 Oct) --
// No card at any width: the Create circle page's header row and body spacing.
// Two steps: Google, Apple, Continue with email; then the email form alone,
// with the back arrow. The mark sits in the heading's line. The small print
// (consent, switch line) sits at the screen's foot. Step 2 drops the subtitle
// and the switch line; step 1 holds both. `lead` (LM-771's share intake) sits
// above the heading.
const AuthPage = ({ title, subtitle, onBack, lead, children, consent, footer }) => (
  <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(10px, 1.2vw, 16px) clamp(12px, 1.4vw, 20px)', flex: 'none' }}>
      {onBack ? <WizardIconBtn name="arrow-left" label="Back" onClick={onBack} /> : <span style={{ width: 40, height: 40 }} />}
      <span style={{ width: 40 }} />
    </header>
    <main className={'circ-wizard-body' + (onBack ? ' circ-auth-tight' : '')} style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 16 }}>
      <div className="circ-auth-col">
        {lead}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <LogoMark size={28} />
            <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0 }}>{title}</h1>
          </div>
          {subtitle && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '8px 0 0' }}>{subtitle}</p>}
        </div>
        <div style={{ marginTop: 'var(--space-6)' }}>{children}</div>
      </div>
    </main>
    <footer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 22px 24px' }}>
      <div className="circ-auth-col">
        {consent}
        {footer && <div style={{ marginTop: 'var(--space-4)', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-fg-2)', textAlign: 'center' }}>{footer}</div>}
      </div>
    </footer>
  </div>
);

// Every other auth surface (OTC, Recovery) takes the same frame (owner, 5 Oct).
const AuthFrame = (p) => <AuthPage {...p} />;

// Step 1 of both pages: the two one-tap ways in, then email.
const AuthProviders = ({ onGoogle, onApple, onEmail }) => (
  <>
    <Button variant="secondary" full size="lg" icon={<Icon name="google" size={18} />} onClick={onGoogle}>Continue with Google</Button>
    <AppleButton onClick={onApple || onGoogle} />
    <div style={{ marginTop: 'var(--space-3)' }}>
      <Button variant="secondary" full size="lg" icon={<Icon name="mail" size={18} />} onClick={onEmail}>Continue with email</Button>
    </div>
  </>
);
// The password rule beside its label, so step 2 fits a small phone's browser.
const LabelHint = ({ label, hint }) => (
  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
    <span>{label}</span><span style={{ fontWeight: 400, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{hint}</span>
  </span>
);

// Tertiary inline text link
const TextLink = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-accent)',
    textDecoration: 'none',
  }} className="circ-textlink">{children}</button>
);

// External link out to the homepage / legal pages
const OutLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={{
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-accent)',
    textDecoration: 'none',
  }} className="circ-textlink">{children}</a>
);

// Quiet consent line — both auth surfaces
const LegalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-fg-2)', textDecoration: 'underline', textUnderlineOffset: 2 }}>{children}</a>
);
const ConsentLine = ({ lead = 'By creating an account you accept our' }) => (
  <p style={{
    fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5,
    color: 'var(--color-fg-3)', margin: 'var(--space-4) 0 0', textAlign: 'center', textWrap: 'balance',
  }}>
    {lead}{' '}
    <LegalLink href="https://circlists.com/terms">Terms</LegalLink>,{' '}
    <LegalLink href="https://circlists.com/privacy">Privacy</LegalLink>{' '}and{' '}
    <LegalLink href="https://circlists.com/refunds">Refund Policy</LegalLink>.
  </p>
);

// ---- Sign in with Apple — web and app alike (owner, 5 Oct) -------------------
// Directly below Continue with Google, the same width and size, nothing else on
// the page moved. Drawn to Apple's rules: black fill, white mark and label on a
// light page, no smaller than the other sign-in button. The label pairs with
// Google's ("Continue with"), one of Apple's three permitted titles. The mark is
// a stand-in path; the build takes Apple's own asset.
const AppleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', marginTop: -2 }}>
    <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);
const AppleButton = ({ onClick, size = 'lg' }) => (
  <button type="button" className="circ-btn-apple" onClick={onClick} style={{
    marginTop: 'var(--space-3)', width: '100%', minHeight: size === 'md' ? 44 : 52, padding: size === 'md' ? '11px 18px' : '14px 22px',
    borderRadius: 'var(--radius-md)', border: 0, background: '#000', color: '#fff',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', whiteSpace: 'nowrap',
  }}><AppleMark />Continue with Apple</button>
);

const OrDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: 'var(--space-5) 0' }}>
    <span style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, color: 'var(--color-fg-3)' }}>or</span>
    <span style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
  </div>
);

// ---- Sign in ---------------------------------------------------------------
const SignIn = ({ onSubmit, onGoogle, onApple, onForgot, onGoSignup, lead, subtitle = 'Pick up your list where you left off.' }) => {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState({});
  const emailBtn = React.useRef(null);
  const back = () => { setStep(1); setErr({}); setTimeout(() => emailBtn.current && emailBtn.current.querySelector(':scope > div:last-child > button').focus(), 0); };
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!pw) next.pw = 'Enter your password.';
    setErr(next);
    if (Object.keys(next).length === 0) onSubmit({ email: email.trim() });
  };
  const consent = <ConsentLine lead="Your use of Circlists is covered by our" />;
  if (step === 1) return (
    <AuthPage lead={lead} title="Sign in" subtitle={subtitle} consent={consent}
      footer={<span>New here? <TextLink onClick={onGoSignup}>Create an account</TextLink> or <OutLink href="https://circlists.com">learn more</OutLink></span>}>
      <div ref={emailBtn}><AuthProviders onGoogle={onGoogle} onApple={onApple} onEmail={() => setStep(2)} /></div>
    </AuthPage>
  );
  return (
    <AuthPage lead={lead} title="Sign in" onBack={back} consent={consent}>
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
    </AuthPage>
  );
};

// ---- Sign up ---------------------------------------------------------------
const SignUp = ({ onSubmit, onGoogle, onApple, onGoSignin }) => {
  const [step, setStep] = React.useState(1);
  const [first, setFirst] = React.useState('');
  const [last, setLast] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState({});
  const emailBtn = React.useRef(null);
  const back = () => { setStep(1); setErr({}); setTimeout(() => emailBtn.current && emailBtn.current.querySelector(':scope > div:last-child > button').focus(), 0); };
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
  if (step === 1) return (
    <AuthPage title="Create your account" subtitle="One account, every circle you’re part of." consent={<ConsentLine />}
      footer={<span>Already have an account? <TextLink onClick={onGoSignin}>Sign in</TextLink> or <OutLink href="https://circlists.com">learn more</OutLink></span>}>
      <div ref={emailBtn}><AuthProviders onGoogle={onGoogle} onApple={onApple} onEmail={() => setStep(2)} /></div>
    </AuthPage>
  );
  return (
    <AuthPage title="Create your account" onBack={back} consent={<ConsentLine />}>
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
        <Field label={<LabelHint label="Password" hint="At least 8 characters" />} name="new-password" type="password" autoComplete="new-password"
          value={pw} onChange={(e) => { setPw(e.target.value); setErr(s => ({ ...s, pw: null })); }} error={err.pw} />
        <Button type="submit" variant="primary" full size="lg" style={{ marginTop: 'var(--space-2)' }}>Create account</Button>
      </form>
    </AuthPage>
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

// ---- Google sign-in return — app-level loading state (see AppLoading) ------
const GoogleReturn = ({ onDone }) => {
  React.useEffect(() => { const t = setTimeout(onDone, 1500); return () => clearTimeout(t); }, [onDone]);
  return <AppLoading label="Completing sign-in" />;
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

Object.assign(window, { EMAIL_RE, AuthFrame, AuthPage, TextLink, OutLink, LegalLink, ConsentLine, SignIn, SignUp, OtcEntry, GoogleReturn, Recovery });
