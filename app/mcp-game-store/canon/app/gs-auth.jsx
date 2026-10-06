// ============================================================================
// [Platform] — Sign up and sign in (screen 2). The flow and structure are the
// Circlists prototype's (app/auth.jsx, signup-one-screen, ratified 5 Oct):
//   step 1  Continue with Google / Apple / email, a failure line under them,
//           consent and the switch line at the foot
//   step 2  the email form alone, with Back; errors inline after the first
//           submit, then live; a refused submit focuses the first bad field
//   sign up -> verify your email (one-time code) -> connect your AI
//   sign in -> games; Forgot password -> reset (email, check, code, new)
//   Google / Apple -> the provider round trip -> "Completing sign-in"
//   Apple on Sign in with no account -> a stop in the buttons' place
// Only the look (this design system) and the name ([Platform]) change.
// ============================================================================
const GS_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GsAuthFrame = ({ title, subtitle, onBack, children, foot }) => {
  const gs = useGs();
  return (
    <div className="gs-auth">
      <header className="gs-top"><div className="gs-wrap gs-top-in">
        <button type="button" className="gs-brand" onClick={() => gs.go('home')}>[Platform]</button>
      </div></header>
      <main className="gs-auth-col">
        {onBack && <div><DS.TextLink onClick={onBack}><span className="gs-ico-row"><DS.Icon name="back" />Back</span></DS.TextLink></div>}
        <DS.ShapePanel>
          <div className="gs-auth-head">
            <h1 className="mcp-t-sec">{title}</h1>
            {subtitle && <p className="gs-muted">{subtitle}</p>}
          </div>
          {children}
        </DS.ShapePanel>
        {foot && <div className="gs-auth-foot">{foot}</div>}
      </main>
    </div>
  );
};

const GsConsent = ({ lead }) => (
  <p className="gs-small">{lead} <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>, <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a> and <a href="#" onClick={(e) => e.preventDefault()}>Refund Policy</a>.</p>
);

const GsProviders = ({ onProvider, onEmail, failed }) => (
  <div className="gs-stack-sm">
    <DS.Button variant="secondary" block onClick={() => onProvider('Google')}>Continue with Google</DS.Button>
    <DS.Button variant="secondary" block onClick={() => onProvider('Apple')}>Continue with Apple</DS.Button>
    <DS.Button variant="secondary" block onClick={onEmail}>Continue with email</DS.Button>
    {failed && <DS.StatusMessage kind="error">Couldn’t continue with {failed}. Try again.</DS.StatusMessage>}
  </div>
);

// Errors appear after the first submit, then update live. Returns { field: message }.
const gsCheck = (rules, f) => {
  const out = {};
  rules.forEach(([k, ok, msg]) => { if (!ok(f[k] || '')) out[k] = msg; });
  return out;
};
const useGsForm = (initial, rules, onValid) => {
  const [f, setF] = React.useState(initial);
  const [tried, setTried] = React.useState(false);
  const refs = React.useRef({});
  const errs = tried ? gsCheck(rules, f) : {};
  const bind = (k) => ({
    value: f[k], error: errs[k], inputRef: (el) => { refs.current[k] = el; },
    onChange: (e) => setF((s) => ({ ...s, [k]: e.target.value })),
  });
  const submit = (e) => {
    e.preventDefault(); setTried(true);
    const er = gsCheck(rules, f);
    const bad = rules.map((r) => r[0]).find((k) => er[k]);
    if (bad) { setTimeout(() => refs.current[bad] && refs.current[bad].focus(), 0); return; }
    onValid(f);
  };
  return { f, bind, submit, reset: () => setTried(false) };
};

const gsProviderTrip = (gs, provider, setFailed, onOk) => {
  setFailed(null);
  if (gs.review.providerFail) { setFailed(provider); return; }
  onOk();
};

// ---- Sign up ------------------------------------------------------------------
const GS_SIGNUP_RULES = [
  ['first', (v) => v.trim().length > 0, 'Enter your first name.'],
  ['last', (v) => v.trim().length > 0, 'Enter your last name.'],
  ['email', (v) => GS_EMAIL_RE.test(v.trim()), 'Enter a valid email address.'],
  ['pw', (v) => v.length >= 8, 'Use at least 8 characters.'],
];
const GsSignUp = () => {
  const gs = useGs();
  const next = gs.route.next;
  const [step, setStep] = React.useState(1);
  const [failed, setFailed] = React.useState(null);
  const form = useGsForm({ first: '', last: '', email: '', pw: '' }, GS_SIGNUP_RULES, (f) => gs.go('verify', { email: f.email.trim(), next }));
  const foot = <>
    <GsConsent lead="By creating an account you accept our" />
    {step === 1 && <p>Already have an account? <button type="button" className="gs-inlink" onClick={() => gs.go('signin')}>Sign in</button> or <button type="button" className="gs-inlink" onClick={() => gs.go('home')}>learn more</button></p>}
  </>;
  if (step === 1) return (
    <GsAuthFrame title="Create your account" subtitle="One account for every game you play." foot={foot}>
      <GsProviders failed={failed}
        onProvider={(p) => gsProviderTrip(gs, p, setFailed, () => gs.go('returning', { mode: 'signup', next }))}
        onEmail={() => { setFailed(null); setStep(2); }} />
    </GsAuthFrame>
  );
  return (
    <GsAuthFrame title="Create your account" onBack={() => { form.reset(); setStep(1); }} foot={foot}>
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <div className="gs-name-pair">
          <DS.TextField label="First name" autoComplete="given-name" autoFocus {...form.bind('first')} />
          <DS.TextField label="Last name" autoComplete="family-name" {...form.bind('last')} />
        </div>
        <DS.TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" {...form.bind('email')} />
        <DS.TextField label="Password" type="password" autoComplete="new-password" hint="At least 8 characters" {...form.bind('pw')} />
        <DS.Button type="submit" block>Create account</DS.Button>
      </form>
    </GsAuthFrame>
  );
};

// ---- Verify your email (one-time code after sign-up) -----------------------------
const GsVerify = () => {
  const gs = useGs();
  const [code, setCode] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [resent, setResent] = React.useState(false);
  const ref = React.useRef(null);
  const submit = (e) => {
    e.preventDefault();
    const v = code.replace(/\s/g, '');
    if (v === '000000') setErr('That code has expired. Send a new one.');
    else if (v.length < 6 || v === '111111') setErr('That code’s not right. Check it and enter it again.');
    else { setErr(null); gs.signedUp(gs.route.next); return; }
    setTimeout(() => ref.current && ref.current.focus(), 0);
  };
  return (
    <GsAuthFrame title="Verify your email" subtitle={<>Enter the 6-digit code sent to <b>{gs.route.email || GS.email}</b>.</>} onBack={() => gs.go('signup', { next: gs.route.next })}>
      <form noValidate onSubmit={submit} className="gs-stack-md">
        <DS.TextField label="Code" inputMode="numeric" maxLength={6} placeholder="000000" autoComplete="one-time-code" className="gs-code"
          value={code} error={err} inputRef={(el) => { ref.current = el; }}
          onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '')); setErr(null); }} />
        <DS.Button type="submit" block>Verify</DS.Button>
        <div className="gs-center">
          {resent
            ? <span className="gs-ico-row gs-small"><DS.Icon name="check" />A new code is on its way.</span>
            : <DS.TextLink onClick={() => { setResent(true); setErr(null); setCode(''); }}>Resend code</DS.TextLink>}
        </div>
      </form>
    </GsAuthFrame>
  );
};

// ---- The provider round trip returning (Google / Apple) ---------------------------
const GsReturning = () => {
  const gs = useGs();
  const { mode, next } = gs.route;
  React.useEffect(() => {
    const t = setTimeout(() => (mode === 'signup' ? gs.signedUp(next) : gs.signedIn()), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="gs-wait" role="status">
      <DS.Loader size={64} label="Completing sign-in" />
      <p className="gs-muted">Completing sign-in</p>
    </div>
  );
};

// ---- Sign in --------------------------------------------------------------------
const GS_SIGNIN_RULES = [
  ['email', (v) => GS_EMAIL_RE.test(v.trim()), 'Enter a valid email address.'],
  ['pw', (v) => v.length > 0, 'Enter your password.'],
];
const GsSignIn = () => {
  const gs = useGs();
  const [step, setStep] = React.useState(1);
  const [failed, setFailed] = React.useState(null);
  const [noAccount, setNoAccount] = React.useState(false);
  const stopRef = React.useRef(null);
  const form = useGsForm({ email: '', pw: '' }, GS_SIGNIN_RULES, () => gs.signedIn());
  React.useEffect(() => { if (noAccount && stopRef.current) stopRef.current.focus({ preventScroll: true }); }, [noAccount]);
  const onProvider = (p) => gsProviderTrip(gs, p, setFailed, () => {
    if (p === 'Apple' && gs.review.appleNone) { setNoAccount(true); return; }
    gs.go('returning', { mode: 'signin' });
  });
  const consent = <GsConsent lead="Your use of [Platform] is covered by our" />;
  const subtitle = 'Pick up where you left off.';
  if (step === 1 && noAccount) return (
    <GsAuthFrame title="Sign in" subtitle={subtitle} foot={consent}>
      <p ref={stopRef} tabIndex={-1} role="status" className="gs-stop">We couldn’t find an account for this Apple sign-in.</p>
      <div className="gs-stack-sm">
        <DS.Button block onClick={() => gs.go('signup')}>Create a new account</DS.Button>
        <DS.Button variant="secondary" block onClick={() => setNoAccount(false)}>Sign in another way</DS.Button>
      </div>
    </GsAuthFrame>
  );
  if (step === 1) return (
    <GsAuthFrame title="Sign in" subtitle={subtitle} foot={<>
      {consent}
      <p>New here? <button type="button" className="gs-inlink" onClick={() => gs.go('signup')}>Create an account</button> or <button type="button" className="gs-inlink" onClick={() => gs.go('home')}>learn more</button></p>
    </>}>
      <GsProviders failed={failed} onProvider={onProvider} onEmail={() => { setFailed(null); setStep(2); }} />
    </GsAuthFrame>
  );
  return (
    <GsAuthFrame title="Sign in" onBack={() => { form.reset(); setStep(1); }} foot={consent}>
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <DS.TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" autoFocus {...form.bind('email')} />
        <DS.TextField label="Password" type="password" autoComplete="current-password" {...form.bind('pw')} />
        <div className="gs-act-end gs-act"><DS.TextLink onClick={() => gs.go('recover')}>Forgot password?</DS.TextLink></div>
        <DS.Button type="submit" block>Sign in</DS.Button>
      </form>
    </GsAuthFrame>
  );
};

// ---- Password recovery: email, check your email, code, new password -----------------
const GsRecover = () => {
  const gs = useGs();
  const [step, setStep] = React.useState('email');
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [err, setErr] = React.useState({});
  const toSignIn = () => gs.go('signin');
  if (step === 'email') return (
    <GsAuthFrame title="Reset your password" subtitle="Enter your email and we’ll send a code." onBack={toSignIn}>
      <form noValidate className="gs-stack-md" onSubmit={(e) => { e.preventDefault(); if (!GS_EMAIL_RE.test(email.trim())) { setErr({ email: 'Enter a valid email address.' }); return; } setErr({}); setStep('sent'); }}>
        <DS.TextField label="Email" type="email" placeholder="you@example.com" autoFocus value={email} error={err.email} onChange={(e) => { setEmail(e.target.value); setErr({}); }} />
        <DS.Button type="submit" block>Send code</DS.Button>
      </form>
    </GsAuthFrame>
  );
  if (step === 'sent') return (
    <GsAuthFrame title="Check your email" subtitle="If an account exists for that email, a code is on its way." onBack={() => setStep('email')}>
      <DS.Button block onClick={() => setStep('code')}>Enter code</DS.Button>
      <div className="gs-center"><DS.TextLink onClick={() => setStep('email')}>Use a different email</DS.TextLink></div>
    </GsAuthFrame>
  );
  if (step === 'code') return (
    <GsAuthFrame title="Enter your code" subtitle={<>Enter the 6-digit code sent to <b>{email}</b>.</>} onBack={() => setStep('sent')}>
      <form noValidate className="gs-stack-md" onSubmit={(e) => { e.preventDefault(); if (code.length < 6) { setErr({ code: 'That code’s not right. Check it and enter it again.' }); return; } setErr({}); setStep('new'); }}>
        <DS.TextField label="Code" inputMode="numeric" maxLength={6} placeholder="000000" autoFocus className="gs-code" value={code} error={err.code}
          onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '')); setErr({}); }} />
        <DS.Button type="submit" block>Verify</DS.Button>
      </form>
    </GsAuthFrame>
  );
  return (
    <GsAuthFrame title="Set a new password" subtitle="Choose a password you haven’t used here before.">
      <form noValidate className="gs-stack-md" onSubmit={(e) => {
        e.preventDefault();
        if (pw.length < 8) { setErr({ pw: 'Use at least 8 characters.' }); return; }
        if (pw !== pw2) { setErr({ pw2: 'Passwords don’t match. Enter it again to confirm.' }); return; }
        gs.signedIn();
      }}>
        <DS.TextField label="New password" type="password" autoComplete="new-password" hint="At least 8 characters" autoFocus value={pw} error={err.pw} onChange={(e) => { setPw(e.target.value); setErr({}); }} />
        <DS.TextField label="Confirm new password" type="password" autoComplete="new-password" value={pw2} error={err.pw2} onChange={(e) => { setPw2(e.target.value); setErr({}); }} />
        <DS.Button type="submit" block>Update password</DS.Button>
      </form>
    </GsAuthFrame>
  );
};

Object.assign(window, { GsAuthFrame, GsSignUp, GsSignIn, GsVerify, GsReturning, GsRecover });
