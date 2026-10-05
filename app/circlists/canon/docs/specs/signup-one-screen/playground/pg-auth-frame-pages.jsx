// ============================================================================
// Playground pages — sign-up and sign-in in two steps, under three frames
// (signup-one-screen). Step 1: Google, Apple, Continue with email. Step 2: the
// email form alone with a back arrow; in every option step 2 drops the subtitle
// and the switch line (step 1 holds both) and the password rule sits beside its
// label. Every part is the app's own: Field,
// Button, AppleButton, ConsentLine, TextLink, OutLink, Wordmark, WizardIconBtn
// (app/primitives.jsx, app/auth.jsx, app/wizard.jsx); 01's desktop mounts the
// shipped AuthFrame. Nothing in app/ is changed.
// Every page here sizes to var(--circ-vh) with min-height, so the rig can
// render a hidden copy at --circ-vh: 0 and read its natural height.
// ============================================================================

const AF_COPY = {
  up: { title: 'Create your account', sub: 'One account, every circle you\u2019re part of.', submit: 'Create account' },
  in: { title: 'Sign in', sub: 'Pick up your list where you left off.', submit: 'Sign in' },
};
const afFoot = { fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-fg-2)' };
const afH1 = { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0 };
const afSub = { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '8px 0 0' };

const AfSwitch = ({ kind, onSwitch }) => kind === 'up'
  ? <span>Already have an account? <TextLink onClick={onSwitch}>Sign in</TextLink> or <OutLink href="https://circlists.com">learn more</OutLink></span>
  : <span>New here? <TextLink onClick={onSwitch}>Create an account</TextLink> or <OutLink href="https://circlists.com">learn more</OutLink></span>;
const AfConsent = ({ kind }) => kind === 'up' ? <ConsentLine /> : <ConsentLine lead="Your use of Circlists is covered by our" />;
const AfLabelHint = ({ label, hint }) => (
  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
    <span>{label}</span><span style={{ fontWeight: 400, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{hint}</span>
  </span>
);

// Step 1: the two one-tap ways in, then email.
const AfProviders = ({ onEmail, size = 'lg' }) => (
  <>
    <Button variant="secondary" full size={size} icon={<Icon name="google" size={18} />}>Continue with Google</Button>
    <AppleButton />
    <div style={{ marginTop: 'var(--space-3)' }}>
      <Button variant="secondary" full size={size} icon={<Icon name="mail" size={18} />} onClick={onEmail}>Continue with email</Button>
    </div>
  </>
);

// Step 2: the shipped fields, copy and validation messages.
const AfForm = ({ kind, hintInLabel, firstRef, uid, size = 'lg' }) => {
  const up = kind === 'up';
  const [v, setV] = React.useState({});
  const [err, setErr] = React.useState({});
  const set = (k) => (e) => { setV((o) => ({ ...o, [k]: e.target.value })); setErr((o) => ({ ...o, [k]: null })); };
  const submit = (e) => {
    e.preventDefault();
    const n = {};
    if (up && !(v.first || '').trim()) n.first = 'Enter your first name.';
    if (up && !(v.last || '').trim()) n.last = 'Enter your last name.';
    if (!EMAIL_RE.test((v.email || '').trim())) n.email = 'Enter a valid email address.';
    if (up ? (v.pw || '').length < 8 : !v.pw) n.pw = up ? 'Use at least 8 characters.' : 'Enter your password.';
    setErr(n);
  };
  const nm = (s) => uid + '-' + s;
  return (
    <form onSubmit={submit} noValidate>
      {up && (
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, minWidth: 0 }}><Field ref={firstRef} label="First name" name={nm('first')} autoComplete="given-name" placeholder="Sam" value={v.first || ''} onChange={set('first')} error={err.first} /></div>
          <div style={{ flex: 1, minWidth: 0 }}><Field label="Last name" name={nm('last')} autoComplete="family-name" placeholder="Rivera" value={v.last || ''} onChange={set('last')} error={err.last} /></div>
        </div>
      )}
      <Field ref={up ? undefined : firstRef} label="Email" name={nm('email')} type="email" autoComplete="email" placeholder="you@example.com" value={v.email || ''} onChange={set('email')} error={err.email} />
      {up
        ? (hintInLabel
          ? <Field label={<AfLabelHint label="Password" hint="At least 8 characters" />} name={nm('pw')} type="password" autoComplete="new-password" value={v.pw || ''} onChange={set('pw')} error={err.pw} />
          : <Field label="Password" name={nm('pw')} type="password" autoComplete="new-password" placeholder="At least 8 characters" hint="At least 8 characters." value={v.pw || ''} onChange={set('pw')} error={err.pw} />)
        : <>
            <Field label="Password" name={nm('pw')} type="password" autoComplete="current-password" placeholder="••••••••" value={v.pw || ''} onChange={set('pw')} error={err.pw} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6, marginBottom: 'var(--space-5)' }}><TextLink onClick={() => {}}>Forgot password?</TextLink></div>
          </>}
      <Button type="submit" variant="primary" full size={size} style={{ marginTop: up ? 'var(--space-2)' : 0 }}>{AF_COPY[kind].submit}</Button>
    </form>
  );
};

// The Create circle page's header row (WizardShell's geometry): back left,
// the wordmark where the wizard's dots sit, nothing right.
const AfHead = ({ onBack, brand = true }) => (
  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(10px, 1.2vw, 16px) clamp(12px, 1.4vw, 20px)', flex: 'none' }}>
    {onBack ? <WizardIconBtn name="arrow-left" label="Back" onClick={onBack} /> : <span style={{ width: 40 }} />}
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{brand ? <Wordmark size={20} /> : null}</div>
    <span style={{ width: 40 }} />
  </header>
);

// ---- 00 Today: the shipped pages, one step ---------------------------------
const AfToday = ({ kind, onSwitch }) => kind === 'up'
  ? <SignUp onSubmit={() => {}} onGoogle={() => {}} onGoSignin={onSwitch} />
  : <SignIn onSubmit={() => {}} onGoogle={() => {}} onForgot={() => {}} onGoSignup={onSwitch} />;

// ---- 01 The card on desktop only -------------------------------------------
const AfCardDesktop = ({ kind, step, wide, onEmail, onBack, onSwitch, firstRef, uid }) => {
  const c = AF_COPY[kind];
  const two = step === 2;
  const body = two ? <AfForm kind={kind} hintInLabel firstRef={firstRef} uid={uid} /> : <AfProviders onEmail={onEmail} />;
  if (wide) {
    return (
      <AuthFrame title={c.title} subtitle={two ? undefined : c.sub} onBack={two ? onBack : undefined} footer={two ? undefined : <AfSwitch kind={kind} onSwitch={onSwitch} />}>
        {body}<AfConsent kind={kind} />
      </AuthFrame>
    );
  }
  return (
    <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      <AfHead onBack={two ? onBack : undefined} />
      <main style={{ width: '100%', maxWidth: 400, margin: '0 auto', padding: '8px 24px 24px' }}>
        <h1 style={afH1}>{c.title}</h1>
        {!two && <p style={afSub}>{c.sub}</p>}
        <div style={{ marginTop: 'var(--space-6)' }}>{body}</div>
        <AfConsent kind={kind} />
        {!two && <div style={{ ...afFoot, textAlign: 'center', marginTop: 'var(--space-5)' }}><AfSwitch kind={kind} onSwitch={onSwitch} /></div>}
      </main>
    </div>
  );
};

// ---- 02 The Create circle page, at every width -----------------------------
// No card anywhere: the cream page is the screen, as on Create circle. Heading
// and subtitle centred as WizardTitle sets them; the controls fill a 400 column.
const AfBarePage = ({ kind, step, onEmail, onBack, onSwitch, firstRef, uid }) => {
  const c = AF_COPY[kind];
  const two = step === 2;
  return (
    <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      <AfHead onBack={two ? onBack : undefined} />
      <div className={'circ-wizard-body af-body' + (two ? ' af-body-tight' : '')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={afH1}>{c.title}</h1>
            {!two && <p style={afSub}>{c.sub}</p>}
          </div>
          <div style={{ marginTop: 'var(--space-6)' }}>{two ? <AfForm kind={kind} hintInLabel firstRef={firstRef} uid={uid} /> : <AfProviders onEmail={onEmail} />}</div>
          <AfConsent kind={kind} />
          {!two && <div style={{ ...afFoot, textAlign: 'center', marginTop: 'var(--space-5)' }}><AfSwitch kind={kind} onSwitch={onSwitch} /></div>}
        </div>
      </div>
    </div>
  );
};

// ---- 03 The brand on the way in, the form as a plain task ------------------
// Step 1 carries the brand: the wordmark at size, the page's heading under it.
// Step 2 is the form alone: back, heading, fields, and no wordmark.
const AfBrandFirst = ({ kind, step, onEmail, onBack, onSwitch, firstRef, uid }) => {
  const c = AF_COPY[kind];
  if (step === 2) {
    return (
      <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
        <AfHead onBack={onBack} brand={false} />
        <div className="circ-wizard-body af-body af-body-tight" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <h1 style={{ ...afH1, textAlign: 'center' }}>{c.title}</h1>
            <div style={{ marginTop: 'var(--space-6)' }}><AfForm kind={kind} hintInLabel firstRef={firstRef} uid={uid} /></div>
            <AfConsent kind={kind} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      <div className="circ-wizard-body af-body af-body-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-10)' }}><Wordmark size={28} /></div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={afH1}>{c.title}</h1>
            <p style={afSub}>{c.sub}</p>
          </div>
          <div style={{ marginTop: 'var(--space-6)' }}><AfProviders onEmail={onEmail} /></div>
          <AfConsent kind={kind} />
          <div style={{ ...afFoot, textAlign: 'center', marginTop: 'var(--space-5)' }}><AfSwitch kind={kind} onSwitch={onSwitch} /></div>
        </div>
      </div>
    </div>
  );
};

const AF_OPTIONS = [
  { n: '00', name: 'Today', Page: AfToday, oneStep: true,
    stance: 'The shipped pages: one step, the white card at every width.',
    cost: 'Sign-up runs past the screen on every phone and on a short laptop window.' },
  { n: '01', name: 'Card on desktop only', Page: AfCardDesktop,
    stance: 'On a phone the cream page is the screen: no card, the wordmark in the header row with the back arrow beside it. On desktop, today\u2019s card, with its own back arrow beside the wordmark.',
    cost: 'Two looks for one page. The card\u2019s padding is what a short laptop window cannot spare: step 2 of sign-up runs past it there.' },
  { n: '02', name: 'The Create circle page, everywhere', Page: AfBarePage,
    stance: 'No card at any width, as Create circle dropped its card. The same header row and body spacing as that page; heading and subtitle centred, as it centres them.',
    cost: 'At desktop width the form sits straight on the cream page, with nothing to say where the page\u2019s content ends.' },
  { n: '03', name: 'Brand on the way in', Page: AfBrandFirst,
    stance: '02\u2019s bare page. Step 1 carries the brand at size, above the heading. Step 2 is the form as a plain task: back, heading, fields.',
    cost: 'Step 2 carries no brand at all. Step 1 is the tallest of the three, for the wordmark\u2019s air.' },
];

Object.assign(window, { AF_OPTIONS });
