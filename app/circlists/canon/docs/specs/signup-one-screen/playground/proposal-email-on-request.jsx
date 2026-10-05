// ============================================================================
// Proposal — 04 Email on request, on today's auth pages (signup-one-screen).
// Minimal change: the shipped AuthFrame (card, rhythm, heading, subtitle, foot)
// and the shipped fields. Step 1: Google, Apple, Continue with email. Step 2:
// the email form alone, with the frame's own back arrow (as Verify and Reset use). Composed from
// app/auth.jsx and app/primitives.jsx; nothing in app/ is touched.
// ============================================================================
const { useState: usePr, useEffect: usePrEffect, useRef: usePrRef, useLayoutEffect: usePrLayout } = React;

const PR_KEY = 'pr_email_on_request_v1';
const PR_SCREENS = [
  { id: 'se-safari', label: 'iPhone SE · Safari', w: 375, h: 548 },
  { id: 'se-app', label: 'iPhone SE · app', w: 375, h: 647 },
  { id: '15-app', label: 'iPhone 15 · app', w: 393, h: 793 },
];

const PrEmailButton = ({ onClick, btnRef }) => (
  <div style={{ marginTop: 'var(--space-3)' }}>
    <Button ref={btnRef} variant="secondary" full size="lg" icon={<Icon name="mail" size={18} />} onClick={onClick}>Continue with email</Button>
  </div>
);

// One auth page. `open` starts it with the form showing; tapping the button opens it live.
const PrPage = ({ kind, open: startOpen, screenRef, formRef }) => {
  const up = kind === 'up';
  const [open, setOpen] = usePr(!!startOpen);
  const [v, setV] = usePr({});
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }));
  const firstRef = usePrRef(null);
  const tapped = usePrRef(false);
  usePrEffect(() => {
    if (!tapped.current) return;
    if (screenRef.current) screenRef.current.scrollTop = 0;
    if (open) firstRef.current && firstRef.current.focus({ preventScroll: true });
  }, [open]);
  const providers = <><Button variant="secondary" full size="lg" icon={<Icon name="google" size={18} />}>Continue with Google</Button><AppleButton /></>;
  const form = up ? (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1, minWidth: 0 }}><Field ref={firstRef} label="First name" name="pr-first" autoComplete="given-name" placeholder="Sam" value={v.first || ''} onChange={set('first')} /></div>
        <div style={{ flex: 1, minWidth: 0 }}><Field label="Last name" name="pr-last" autoComplete="family-name" placeholder="Rivera" value={v.last || ''} onChange={set('last')} /></div>
      </div>
      <Field label="Email" name="pr-email" type="email" autoComplete="email" placeholder="you@example.com" value={v.email || ''} onChange={set('email')} />
      <Field label="Password" name="pr-pw" type="password" autoComplete="new-password" placeholder="At least 8 characters" hint="At least 8 characters." value={v.pw || ''} onChange={set('pw')} />
      <Button type="submit" variant="primary" full size="lg" style={{ marginTop: 'var(--space-2)' }}>Create account</Button>
    </form>
  ) : (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <Field ref={firstRef} label="Email" name="pr-email" type="email" autoComplete="email" placeholder="you@example.com" value={v.email || ''} onChange={set('email')} />
      <Field label="Password" name="pr-pw" type="password" autoComplete="current-password" placeholder="••••••••" value={v.pw || ''} onChange={set('pw')} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6, marginBottom: 'var(--space-5)' }}><TextLink onClick={() => {}}>Forgot password?</TextLink></div>
      <Button type="submit" variant="primary" full size="lg">Sign in</Button>
    </form>
  );
  return (
    <AuthFrame
      onBack={open ? () => { tapped.current = true; setOpen(false); } : undefined}
      title={up ? 'Create your account' : 'Sign in'}
      subtitle={up ? 'One account, every circle you\u2019re part of.' : 'Pick up your list where you left off.'}
      footer={up
        ? <span>Already have an account? <TextLink onClick={() => {}}>Sign in</TextLink> or <OutLink href="https://circlists.com">learn more</OutLink></span>
        : <span>New here? <TextLink onClick={() => {}}>Create an account</TextLink> or <OutLink href="https://circlists.com">learn more</OutLink></span>}>
      {open
        ? <div ref={formRef}>{form}</div>
        : <>{providers}<PrEmailButton onClick={() => { tapped.current = true; setOpen(true); }} /></>}
      {up ? <ConsentLine /> : <ConsentLine lead="Your use of Circlists is covered by our" />}
    </AuthFrame>
  );
};

// One step: a phone screen at its visible height, scrolling inside.
const PrStep = ({ n, kind, open, screen, scale, caption }) => {
  const screenRef = usePrRef(null);
  const formRef = usePrRef(null);
  const [read, setRead] = usePr(null);
  usePrLayout(() => {
    const s = screenRef.current; if (!s) return;
    const page = s.firstElementChild ? s.firstElementChild.offsetHeight : 0;
    setRead(page - screen.h);
  }, [screen.id, open]);
  return (
    <figure className="pr-step">
      <div className="pr-step-head"><span className="pr-n">{n}</span>{caption}</div>
      <div className="pr-phone" style={{ width: screen.w * scale + 2, height: screen.h * scale + 2 }}>
        <div ref={screenRef} className="pr-screen" style={{ width: screen.w, height: screen.h, transform: scale < 1 ? 'scale(' + scale + ')' : 'none', '--circ-vh': '0px' }}>
          <PrPage kind={kind} open={open} screenRef={screenRef} formRef={formRef} />
        </div>
      </div>
      {read != null && (
        <figcaption className="pr-read" data-v={read <= -24 ? 'fits' : read <= 0 ? 'hair' : 'runs'}>
          {read <= -24 ? 'Whole page in view, ' + (-read) + 'px spare' : read <= 0 ? 'In view by ' + (-read) + 'px only' : 'Runs ' + read + 'px past the screen'}
        </figcaption>
      )}
    </figure>
  );
};

const PrFlow = ({ kind, title, screen, scale }) => (
  <section className="pr-flow">
    <h2 className="pr-flow-title">{title}</h2>
    <div className="pr-steps">
      <PrStep n="1" kind={kind} screen={screen} scale={scale} caption="Arrive" />
      <div className="pr-arrow" aria-hidden="true">Tap Continue with email</div>
      <PrStep n="2" kind={kind} open screen={screen} scale={scale} caption={'The email form, focus on ' + (kind === 'up' ? 'First name' : 'Email') + '. The arrow goes back to step 1.'} />
    </div>
  </section>
);

const PrBoard = () => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(PR_KEY) || '{}'); } catch (e) { return {}; } })();
  const [screenId, setScreenId] = usePr(saved.screen || 'se-app');
  const [winW, setWinW] = usePr(window.innerWidth);
  usePrEffect(() => { const on = () => setWinW(window.innerWidth); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  usePrEffect(() => { try { localStorage.setItem(PR_KEY, JSON.stringify({ screen: screenId })); } catch (e) {} }, [screenId]);
  const screen = PR_SCREENS.find((s) => s.id === screenId) || PR_SCREENS[1];
  const avail = Math.min(winW, 1100) - 64;
  const scale = Math.min(1, winW < 720 ? (avail) / screen.w : (avail - 120) / (2 * screen.w));
  return (
    <main className="pr-page">
      <div className="pr-eyebrow">Proposal · sign-up on one screen</div>
      <h1 className="pr-title">Email on request, on today&rsquo;s pages</h1>
      <p className="pr-lede">The card, spacing, headings, subtitles, fields and foot are the shipped ones. Step 1 offers Google, Apple and Continue with email. Step 2 is the email form alone, with a back arrow beside the wordmark. Each screen is live: tap through it.</p>
      <div className="pr-seg" role="radiogroup" aria-label="Screen">
        {PR_SCREENS.map((s) => (
          <button key={s.id} type="button" role="radio" aria-checked={s.id === screenId} data-on={s.id === screenId ? '1' : undefined} onClick={() => setScreenId(s.id)}>{s.label}<span>{s.w}×{s.h}</span></button>
        ))}
      </div>
      <PrFlow key={'up' + screen.id} kind="up" title="Sign up" screen={screen} scale={scale} />
      <PrFlow key={'in' + screen.id} kind="in" title="Sign in" screen={screen} scale={scale} />
    </main>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PrBoard />);
