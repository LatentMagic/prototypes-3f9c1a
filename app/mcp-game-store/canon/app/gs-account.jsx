// ============================================================================
// [Platform] — Account page (circlists-match-1): the Username card, then the Pass card, change
// email, change password, delete account, and the support line. A provider
// account (Google, Apple) gets one card in place of the two change cards.
// ============================================================================
const GsSubBar = ({ title, onBack }) => (
  <header className="gs-top"><div className="gs-wrap gs-top-in gs-subbar">
    <button type="button" className="gs-iconbtn" aria-label="Back" onClick={onBack}><DS.Icon name="back" /></button>
    <span className="gs-subbar-title">{title}</span>
  </div></header>
);

// A tick and a short line beside the button for a few seconds after a change.
const useGsDone = (ms) => {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => { if (!on) return undefined; const t = setTimeout(() => setOn(false), ms); return () => clearTimeout(t); }, [on]);
  return [on, () => setOn(true)];
};
const GsDone = ({ children }) => <span className="gs-ico-row gs-done" role="status"><DS.Icon name="check" />{children}</span>;

// "Confirm it’s you": a password, or a provider round trip. A centred window at every width.
const GsIdentity = ({ open, provider, onCancel, onOk }) => {
  const [pw, setPw] = React.useState('');
  const [tried, setTried] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { if (open) { setPw(''); setTried(false); } }, [open]);
  const err = tried && !pw ? 'Enter your password.' : null;
  const go = (e) => {
    e && e.preventDefault(); setTried(true);
    if (!provider && !pw) { setTimeout(() => ref.current && ref.current.focus(), 0); return; }
    onOk();
  };
  const P = provider ? provider[0].toUpperCase() + provider.slice(1) : null;
  return (
    <DS.Popup open={open} onClose={onCancel} posture="window" label="Confirm it’s you">
      <GsPopTitle>Confirm it’s you</GsPopTitle>
      {provider ? (
        <>
          <p>Continue through {P} to confirm it’s you.</p>
          <GsActs>
            <DS.Button variant="secondary" onClick={onCancel}>Cancel</DS.Button>
            <DS.Button onClick={go}>Continue with {P}</DS.Button>
          </GsActs>
        </>
      ) : (
        <form noValidate onSubmit={go} className="gs-stack-md">
          <p>Enter your password to continue.</p>
          <DS.TextField label="Password" type="password" autoComplete="current-password" placeholder="••••••••" value={pw} error={err}
            inputRef={(el) => { ref.current = el; }} onChange={(e) => setPw(e.target.value)} />
          <GsActs>
            <DS.Button variant="secondary" onClick={onCancel}>Cancel</DS.Button>
            <DS.Button type="submit">Continue</DS.Button>
          </GsActs>
        </form>
      )}
    </DS.Popup>
  );
};

const GS_ACCT_CARD = { gap: 16, justifyItems: 'stretch', alignContent: 'start' };

const GsChangeEmail = () => {
  const gs = useGs();
  const staged = gs.route.stage === 'email-code';
  const [phase, setPhase] = React.useState(staged ? 'code' : 'form');
  const [pending, setPending] = React.useState(staged ? 'new@example.com' : '');
  const [confirm, setConfirm] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [codeErr, setCodeErr] = React.useState(false);
  const codeRef = React.useRef(null);
  const [done, showDone] = useGsDone(3600);
  const form = useGsForm({ email: '' }, [
    ['email', (v) => GS_EMAIL_RE.test(v.trim()), 'Enter a valid email address.'],
    ['email', (v) => v.trim().toLowerCase() !== gs.user.email.toLowerCase(), 'That’s already your email. Enter a different one.'],
  ], (f) => { setPending(f.email.trim()); setConfirm(true); });
  const cancelCode = () => { setPhase('form'); setCode(''); setCodeErr(false); };
  const confirmCode = (e) => {
    e.preventDefault();
    if (code.length < 6 || code === '111111') { setCodeErr(true); setTimeout(() => codeRef.current && codeRef.current.focus(), 0); return; }
    gs.setUser({ email: pending }); form.clear(); cancelCode(); showDone();
  };
  return (
    <DS.Card style={GS_ACCT_CARD}>
      <h2 className="mcp-t-card">Change email</h2>
      {phase === 'form' ? (
        <form noValidate onSubmit={form.submit} className="gs-stack-md">
          <DS.TextField label="New email" type="email" autoComplete="email" placeholder="new@example.com" {...form.bind('email')} />
          <div className="gs-card-acts">{done && <GsDone>Email updated.</GsDone>}<DS.Button type="submit">Update email</DS.Button></div>
        </form>
      ) : (
        <form noValidate onSubmit={confirmCode} className="gs-stack-md">
          <p>Enter the code sent to <b>{pending}</b>. Your email switches once it’s confirmed.</p>
          <DS.TextField label="Verification code" inputMode="numeric" maxLength={6} placeholder="000000" autoComplete="one-time-code" className="gs-code gs-code-sm"
            value={code} error={codeErr ? 'That code’s not right. Check and re-enter.' : null} inputRef={(el) => { codeRef.current = el; }}
            onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6)); setCodeErr(false); }} />
          <div className="gs-card-acts gs-card-acts-pair">
            <DS.Button variant="secondary" onClick={cancelCode}>Cancel</DS.Button>
            <DS.Button type="submit">Confirm</DS.Button>
          </div>
        </form>
      )}
      <GsIdentity open={confirm} onCancel={() => setConfirm(false)} onOk={() => { setConfirm(false); setPhase('code'); }} />
    </DS.Card>
  );
};

const GsChangePassword = () => {
  const [done, showDone] = useGsDone(3200);
  const form = useGsForm({ cur: '', pw: '', pw2: '' }, [
    ['cur', (v) => v.length > 0, 'Enter your current password.'],
    ['pw', (v) => v.length >= 8, 'Use at least 8 characters.'],
    ['pw2', (v, f) => v === f.pw, 'Passwords don’t match. Re-enter to confirm.'],
  ], () => { form.clear(); showDone(); });
  return (
    <DS.Card style={GS_ACCT_CARD}>
      <h2 className="mcp-t-card">Change password</h2>
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <DS.TextField label="Current password" type="password" autoComplete="current-password" placeholder="••••••••" {...form.bind('cur')} />
        <DS.TextField label="New password" type="password" autoComplete="new-password" placeholder="At least 8 characters" {...form.bind('pw')} />
        <DS.TextField label="Confirm new password" type="password" autoComplete="new-password" placeholder="Re-enter new password" {...form.bind('pw2')} />
        <div className="gs-card-acts">{done && <GsDone>Password updated.</GsDone>}<DS.Button type="submit">Update password</DS.Button></div>
      </form>
    </DS.Card>
  );
};

const GsDeleteAccount = () => {
  const gs = useGs();
  const [step, setStep] = React.useState(gs.route.stage === 'delete' ? 'alert' : null); // alert | identity
  const provider = gs.provider === 'email' ? null : gs.provider;
  return (
    <DS.Card style={GS_ACCT_CARD}>
      <h2 className="mcp-t-card">Delete account</h2>
      <p>Your account goes, and so does your play history.</p>
      <div className="gs-card-acts"><DS.Button variant="secondary" className="gs-btn-danger-outline" onClick={() => setStep('alert')}>Delete your account</DS.Button></div>
      <DS.Popup open={step === 'alert'} onClose={() => setStep(null)} posture={gs.narrow ? 'sheet' : 'window'} label="Delete your account?">
        <GsPopTitle>Delete your account?</GsPopTitle>
        <p>It can’t be undone. Deleting also cancels your Pass.</p>
        <GsActs>
          <DS.Button variant="secondary" onClick={() => setStep(null)}>Cancel</DS.Button>
          <DS.Button variant="danger" onClick={() => setStep('identity')}>Delete account</DS.Button>
        </GsActs>
      </DS.Popup>
      <GsIdentity open={step === 'identity'} provider={provider} onCancel={() => setStep(null)} onOk={() => { setStep(null); gs.deleteAccount(); }} />
    </DS.Card>
  );
};

const GsAccount = () => {
  const gs = useGs();
  const from = gs.route.from;
  const back = () => (from ? gs.go(from.name, from) : gs.go('games'));
  const providerAcct = gs.provider !== 'email';
  return (
    <>
      <GsSubBar title="Account" onBack={back} />
      <main className="gs-wrap gs-main gs-acct-page">
        <div className="gs-stack-xs">
          <h1 className="gs-h1">Account</h1>
          <p className="gs-muted">{gs.user.email}</p>
        </div>
        <div className="gs-acct-cards">
          <GsUsernameCard />
          <GsPassCard />
          {providerAcct ? (
            <DS.Card style={GS_ACCT_CARD}>
              <h2 className="mcp-t-card">Change email &amp; password</h2>
              <p>Your email and password are managed by your sign-in provider and can be changed there.</p>
            </DS.Card>
          ) : <><GsChangeEmail /><GsChangePassword /></>}
          <GsDeleteAccount />
        </div>
        <p><a className="gs-support" href={'mailto:' + GS_SUPPORT}>{GS_SUPPORT}</a></p>
      </main>
    </>
  );
};

Object.assign(window, { GsSubBar, GsIdentity, GsAccount });
