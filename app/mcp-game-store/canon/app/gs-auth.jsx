// ============================================================================
// [Platform] — Sign up and sign in. Structure, steps and labels are Circlists'
// (circlists-match-1, ratified); the look is the store's.
//   step 1  Google, black Apple, email (no panel, no divider, none primary)
//   step 2  the email form; adds a browser-history entry so Back = the arrow
//   sign up -> verify your email -> your username -> connect your AI
//   (from Get the Pass: sign up -> checkout -> your username -> the Pass page)
//   sign in (email) -> verify this device -> games; Google / Apple skip it
//   Forgot password -> email, sent, code, new password -> games
// ============================================================================
const GS_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GsAuthFrame = ({ title, subtitle, onBack, children, foot }) => (
  <div className="gs-auth">
    <div className="gs-auth-bar">
      {onBack
        ? <button type="button" className="gs-iconbtn" aria-label="Back" onClick={onBack}><DS.Icon name="back" /></button>
        : <span className="gs-iconbtn-space" />}
      <span className="gs-iconbtn-space" />
    </div>
    <main className="gs-auth-col">
      <div className="gs-auth-head">
        <h1 className="gs-auth-h1"><GsMark size={28} /><span>{title}</span></h1>
        {subtitle && <p className="gs-muted">{subtitle}</p>}
      </div>
      {children}
      {foot && <div className="gs-auth-foot">{foot}</div>}
    </main>
  </div>
);

const GsConsent = ({ lead }) => {
  const gs = useGs();
  const l = (doc, t) => <a href="#" onClick={(e) => { e.preventDefault(); gs.go('legal', { doc }); }}>{t}</a>;
  return <p className="gs-small">{lead} {l('terms', 'Terms')}, {l('privacy', 'Privacy')} and {l('refunds', 'Refund Policy')}.</p>;
};

// A line with a red x and ink text: provider failure, expired code.
const GsXLine = ({ children, center }) => (
  <p className={'gs-xline' + (center ? ' is-center' : '')} role="alert"><GsGlyph name="x" size={18} style={{ color: 'var(--error)' }} /><span>{children}</span></p>
);

const GsProviders = ({ onProvider, onEmail, failed }) => (
  <div className="gs-stack-md">
    <div className="gs-stack-sm">
      <DS.Button variant="secondary" block onClick={() => onProvider('Google')}><GsGlyph name="google" />Continue with Google</DS.Button>
      <DS.Button id="gs-apple-btn" variant="secondary" block className="gs-btn-apple" onClick={() => onProvider('Apple')}><GsGlyph name="apple" />Continue with Apple</DS.Button>
    </div>
    <DS.Button variant="secondary" block className="gs-btn-email" onClick={onEmail}><GsGlyph name="mail" />Continue with email</DS.Button>
    {failed && <GsXLine center>Couldn’t continue with {failed}. Try again.</GsXLine>}
  </div>
);

// Errors appear after the first submit, then update live. A rule is
// [field, ok(value, form), message]. Returns { field: message }.
const gsCheck = (rules, f) => {
  const out = {};
  rules.forEach(([k, ok, msg]) => { if (!out[k] && !ok(f[k] || '', f)) out[k] = msg; });
  return out;
};
const useGsForm = (initial, rules, onValid, opts) => {
  const [f, setF] = React.useState(initial);
  const [tried, setTried] = React.useState(!!(opts && opts.tried));
  const refs = React.useRef({});
  const errs = tried ? gsCheck(rules, f) : {};
  const bind = (k) => ({
    value: f[k], error: errs[k], inputRef: (el) => { refs.current[k] = el; },
    onChange: (e) => setF((s) => ({ ...s, [k]: e.target.value })),
  });
  const submit = (e) => {
    e && e.preventDefault(); setTried(true);
    const er = gsCheck(rules, f);
    const bad = rules.map((r) => r[0]).find((k) => er[k]);
    if (bad) { setTimeout(() => refs.current[bad] && refs.current[bad].focus(), 0); return; }
    onValid(f);
  };
  const clear = () => { setF(initial); setTried(false); };
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const focus = (k) => setTimeout(() => refs.current[k] && refs.current[k].focus(), 0);
  return { f, bind, submit, reset: () => setTried(false), clear, set, focus };
};

// Step 2 pushes a history entry; the browser's Back returns to step 1.
const useGsStep = () => {
  const [step, setStepState] = React.useState(1);
  React.useEffect(() => {
    const onPop = (e) => setStepState((e.state && e.state.gsStep) || 1);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const toEmail = () => {
    try { window.history.pushState({ ...(window.history.state || {}), gsStep: 2 }, ''); } catch (e) {}
    setStepState(2);
  };
  const back = () => {
    if (window.history.state && window.history.state.gsStep === 2) window.history.back();
    else setStepState(1);
  };
  return [step, toEmail, back];
};

// The provider sheet: fails (review), cancelled (silent), or completes.
const gsProviderTrip = (gs, provider, setFailed, onOk) => {
  setFailed(null);
  if (gs.review.providerFail) { setFailed(provider); return; }
  if (gs.review.sheet === 'cancelled') return;
  onOk();
};

// ---- Sign up ------------------------------------------------------------------
const GS_SIGNUP_RULES = [
  ['email', (v) => GS_EMAIL_RE.test(v.trim()), 'Enter a valid email address.'],
  ['pw', (v) => v.length >= 8, 'Use at least 8 characters.'],
];
const GsSignUp = () => {
  const gs = useGs();
  const next = gs.route.next;
  const [step, toEmail, back] = useGsStep();
  const [failed, setFailed] = React.useState(null);
  const form = useGsForm({ email: '', pw: '' }, GS_SIGNUP_RULES, (f) => {
    gs.setUser({ email: f.email.trim() });
    gs.go('verify', { ctx: 'signup', email: f.email.trim(), next });
  });
  const foot = <>
    <GsConsent lead="By creating an account you accept our" />
    {step === 1 && <p>Already have an account? <button type="button" className="gs-inlink" onClick={() => gs.go('signin')}>Sign in</button> or <button type="button" className="gs-inlink" onClick={() => gs.go('home')}>learn more</button></p>}
  </>;
  if (step === 1) return (
    <GsAuthFrame title="Create your account" subtitle="One account for every game you play." foot={foot}>
      <GsProviders failed={failed}
        onProvider={(p) => gsProviderTrip(gs, p, setFailed, () => gs.go('returning', { mode: 'signup', provider: p.toLowerCase(), next }))}
        onEmail={() => { setFailed(null); toEmail(); }} />
    </GsAuthFrame>
  );
  return (
    <GsAuthFrame title="Create your account" onBack={() => { form.reset(); back(); }} foot={foot}>
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <DS.TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" autoFocus {...form.bind('email')} />
        <GsLabelled label="Password" aside="At least 8 characters">
          <DS.TextField type="password" autoComplete="new-password" aria-label="Password" {...form.bind('pw')} />
        </GsLabelled>
        <DS.Button type="submit" block>Create account</DS.Button>
      </form>
    </GsAuthFrame>
  );
};
// A field label with a small muted note right-aligned beside it.
const GsLabelled = ({ label, aside, children }) => (
  <div className="gs-stack-sm">
    <div className="gs-label-row"><span className="gs-field-label" aria-hidden="true">{label}</span><span className="gs-small">{aside}</span></div>
    {children}
  </div>
);

// ---- The one-time code: sign-up ("Verify your email") and device ("Verify this device")
// Demo: 000000 is expired; 111111 or fewer than six digits is wrong; any other six digits pass.
const GsCodeField = ({ value, onChange, error, inputRef }) => (
  <DS.TextField aria-label="6-digit code" inputMode="numeric" maxLength={6} placeholder="000000" autoComplete="one-time-code" autoFocus
    className="gs-code" value={value} error={error} inputRef={inputRef}
    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} />
);
const GsVerify = () => {
  const gs = useGs();
  const device = gs.route.ctx === 'device';
  const email = gs.route.email || gs.user.email;
  const preset = gs.route.preset; // staged: 'expired' | 'wrong'
  const [code, setCode] = React.useState(preset === 'expired' ? '000000' : preset === 'wrong' ? '111111' : '');
  const [err, setErr] = React.useState(preset || null); // null | 'wrong' | 'expired'
  const [resent, setResent] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { if (!resent) return undefined; const t = setTimeout(() => setResent(false), 2600); return () => clearTimeout(t); }, [resent]);
  const submit = (e) => {
    e.preventDefault();
    if (code === '000000') setErr('expired');
    else if (code.length < 6 || code === '111111') setErr('wrong');
    else { setErr(null); device ? gs.signedIn('email') : gs.signedUp(gs.route.next, 'email'); return; }
    setTimeout(() => ref.current && ref.current.focus(), 0);
  };
  const resend = () => { setResent(true); setErr(null); setCode(''); setTimeout(() => ref.current && ref.current.focus(), 0); };
  return (
    <GsAuthFrame title={device ? 'Verify this device' : 'Verify your email'}
      subtitle={<>Enter the 6-digit code sent to <b>{email}</b>.</>}
      onBack={() => (device ? gs.go('signin') : gs.go('signup', { next: gs.route.next }))}>
      <form noValidate onSubmit={submit} className="gs-stack-md">
        <GsCodeField value={code} error={err === 'wrong' ? 'That code’s not right. Check and re-enter.' : null}
          inputRef={(el) => { ref.current = el; }} onChange={(v) => { setCode(v); setErr(null); }} />
        {err === 'expired' && <GsXLine>That code’s expired. Request a fresh one.</GsXLine>}
        <DS.Button type="submit" block>Verify</DS.Button>
        <div className="gs-center gs-link-slot">
          {resent
            ? <span className="gs-ico-row" role="status"><DS.Icon name="check" />A fresh code is on its way.</span>
            : <DS.TextLink onClick={resend}>Resend code</DS.TextLink>}
        </div>
      </form>
    </GsAuthFrame>
  );
};

// ---- Return from a provider: the spinner alone, "Completing sign-in" as its name.
const GsReturning = () => {
  const gs = useGs();
  const { mode, next, provider } = gs.route;
  return <GsFullLoader label="Completing sign-in" ms={1500}
    onDone={() => (mode === 'signup' ? gs.signedUp(next, provider) : gs.signedIn(provider))} />;
};

// ---- Sign in --------------------------------------------------------------------
const GS_SIGNIN_RULES = [
  ['email', (v) => GS_EMAIL_RE.test(v.trim()), 'Enter a valid email address.'],
  ['pw', (v) => v.length > 0, 'Enter your password.'],
];
const GsSignIn = () => {
  const gs = useGs();
  const [step, toEmail, back] = useGsStep();
  const [failed, setFailed] = React.useState(null);
  const [noAccount, setNoAccount] = React.useState(false);
  const stopRef = React.useRef(null);
  const form = useGsForm({ email: '', pw: '' }, GS_SIGNIN_RULES, (f) => gs.go('verify', { ctx: 'device', email: f.email.trim() }));
  React.useEffect(() => { if (noAccount && stopRef.current) stopRef.current.focus({ preventScroll: true }); }, [noAccount]);
  const onProvider = (p) => gsProviderTrip(gs, p, setFailed, () => {
    if (p === 'Apple' && gs.review.appleNone) { setNoAccount(true); return; }
    gs.go('returning', { mode: 'signin', provider: p.toLowerCase() });
  });
  const consent = <GsConsent lead="Your use of [Platform] is covered by our" />;
  const subtitle = 'Pick up where you left off.';
  if (step === 1 && noAccount) return (
    <GsAuthFrame title="Sign in" subtitle={subtitle} foot={consent}>
      <p ref={stopRef} tabIndex={-1} role="status" className="gs-stop">We couldn’t find an account for this Apple sign-in.</p>
      <div className="gs-stack-sm">
        <DS.Button block onClick={() => gs.go('signup')}>Create a new account</DS.Button>
        <DS.Button variant="secondary" block onClick={() => { setNoAccount(false); setTimeout(() => { const b = document.getElementById('gs-apple-btn'); b && b.focus(); }, 0); }}>Sign in another way</DS.Button>
      </div>
    </GsAuthFrame>
  );
  if (step === 1) return (
    <GsAuthFrame title="Sign in" subtitle={subtitle} foot={<>
      {consent}
      <p>New here? <button type="button" className="gs-inlink" onClick={() => gs.go('signup')}>Create an account</button> or <button type="button" className="gs-inlink" onClick={() => gs.go('home')}>learn more</button></p>
    </>}>
      <GsProviders failed={failed} onProvider={onProvider} onEmail={() => { setFailed(null); toEmail(); }} />
    </GsAuthFrame>
  );
  return (
    <GsAuthFrame title="Sign in" onBack={() => { form.reset(); back(); }} foot={consent}>
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <DS.TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" autoFocus {...form.bind('email')} />
        <div className="gs-stack-xs">
          <DS.TextField label="Password" type="password" autoComplete="current-password" placeholder="••••••••" {...form.bind('pw')} />
          <div className="gs-act gs-act-end"><DS.TextLink onClick={() => gs.go('recover')}>Forgot password?</DS.TextLink></div>
        </div>
        <DS.Button type="submit" block>Sign in</DS.Button>
      </form>
    </GsAuthFrame>
  );
};

// ---- Password recovery: email, sent, code, new password --------------------------
const GS_NEWPW_RULES = [
  ['pw', (v) => v.length >= 8, 'Use at least 8 characters.'],
  ['pw2', (v, f) => v === f.pw, 'Passwords don’t match. Re-enter to confirm.'],
];
const GsRecover = () => {
  const gs = useGs();
  const [step, setStep] = React.useState('email');
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [codeErr, setCodeErr] = React.useState(false);
  const codeRef = React.useRef(null);
  const emailForm = useGsForm({ email: '' }, [['email', (v) => GS_EMAIL_RE.test(v.trim()), 'Enter a valid email address.']], (f) => { setEmail(f.email.trim()); setStep('sent'); });
  const pwForm = useGsForm({ pw: '', pw2: '' }, GS_NEWPW_RULES, () => gs.signedIn('email'));
  if (step === 'email') return (
    <GsAuthFrame title="Reset your password" subtitle="Enter your email and we’ll send a code." onBack={() => gs.go('signin')}>
      <form noValidate className="gs-stack-md" onSubmit={emailForm.submit}>
        <DS.TextField label="Email" type="email" placeholder="you@example.com" autoFocus {...emailForm.bind('email')} />
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
      <form noValidate className="gs-stack-md" onSubmit={(e) => {
        e.preventDefault();
        if (code.length < 6 || code === '111111') { setCodeErr(true); setTimeout(() => codeRef.current && codeRef.current.focus(), 0); return; }
        setStep('new');
      }}>
        <GsCodeField value={code} error={codeErr ? 'That code’s not right. Check and re-enter.' : null}
          inputRef={(el) => { codeRef.current = el; }} onChange={(v) => { setCode(v); setCodeErr(false); }} />
        <DS.Button type="submit" block>Verify</DS.Button>
      </form>
    </GsAuthFrame>
  );
  return (
    <GsAuthFrame title="Set a new password" subtitle="Choose a password you haven’t used here before.">
      <form noValidate className="gs-stack-md" onSubmit={pwForm.submit}>
        <DS.TextField label="New password" type="password" autoComplete="new-password" placeholder="At least 8 characters" autoFocus {...pwForm.bind('pw')} />
        <DS.TextField label="Confirm new password" type="password" autoComplete="new-password" placeholder="Re-enter password" {...pwForm.bind('pw2')} />
        <DS.Button type="submit" block>Update password</DS.Button>
      </form>
    </GsAuthFrame>
  );
};

Object.assign(window, { GS_EMAIL_RE, GsAuthFrame, GsXLine, GsSignUp, GsSignIn, GsVerify, GsReturning, GsRecover, gsCheck, useGsForm, GsLabelled });
