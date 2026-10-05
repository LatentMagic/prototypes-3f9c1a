// ============================================================================
// Playground — fitting sign-up on one phone screen (signup-one-screen).
// An option board: every option draws BOTH auth pages, sign-up and sign-in,
// because whatever sign-up does to fit, sign-in has to match it (the two are
// one family: same frame, same providers, same order). Each page is composed
// from the app's own parts (Field, Button, OrDivider, AppleButton, ConsentLine,
// TextLink, OutLink, Wordmark — app/primitives.jsx, app/auth.jsx); 00 mounts
// the shipped SignUp and SignIn themselves. Each page is drawn whole, scaled
// to the window, with the screen's fold drawn on it and the fit measured.
// No lever: each option is one idea. Type into it, tap through it.
// ============================================================================
const { useState: usePg, useEffect: usePgEffect, useRef: usePgRef, useLayoutEffect: usePgLayout } = React;

const PG_KEY = 'pg_signup_fit_v2';
const PG_SCREENS = [
  { id: 'se-safari', label: 'iPhone SE · Safari', w: 375, h: 548 },
  { id: 'se-app', label: 'iPhone SE · app', w: 375, h: 647 },
  { id: '15-safari', label: 'iPhone 15 · Safari', w: 393, h: 659 },
  { id: '15-app', label: 'iPhone 15 · app', w: 393, h: 793 },
  { id: 'laptop', label: 'Laptop · browser', w: 1366, h: 625 },
];
// Below this, a fit is inside the error of the screen estimate, so it is not read as a fit.
const PG_MARGIN = 24;

const PG_OPTIONS = [
  { n: '00', name: 'Today', real: true,
    claim: 'The shipped pages, with Continue with Apple below Google on both.',
    cost: 'Sign-up runs past the fold on every phone and on a short laptop window. Sign-in fits a phone app, not a phone browser.' },
  { n: '01', name: 'Less air', cfg: { tight: true },
    claim: 'Same parts, order and copy. On a phone the screen is the card: no box, and the rhythm steps down one notch. Sign-in takes the same frame.',
    cost: 'Fits only a large phone in the app. A spacing fix alone cannot carry four fields, three buttons and two lines of small print.' },
  { n: '02', name: 'Less air, fewer lines', cfg: { tight: true, hintInLabel: true, noSubtitle: true },
    claim: '01, plus two lines out: the password rule moves into its label row (it was said twice), and both pages lose their subtitle.',
    cost: 'Drops copy from both pages. Still runs past on every phone browser.' },
  { n: '03', name: 'Google and Apple first', cfg: { tight: true, hintInLabel: true, noSubtitle: true, providersFirst: true },
    claim: '02, reordered on both pages: the one-tap ways in lead, then "or", then the email form. What the screen cuts is the long way, not the quick one.',
    cost: 'Same height as 02, so it fits no more often. Changes the order on both pages.' },
  { n: '04', name: 'Email on request', cfg: { tight: true, hintInLabel: true, providersFirst: true, emailOnTap: true },
    claim: 'Google, Apple, then Continue with email, on both pages. Tapping it opens the form in place, focused on its first field. Nothing navigates. The usual pattern for apps that offer Google and Apple.',
    cost: 'One more tap for anyone using email, every time they sign in. Once open, the page grows past the fold on a small phone (as any form does once the keyboard is up).' },
  { n: '04.1', name: 'Email on request, the form takes the buttons\u2019 place', cfg: { tight: true, hintInLabel: true, providersFirst: true, emailOnTap: true, emailReplaces: true },
    claim: '04, but opening the email form folds Google and Apple into one line above it ("Use Google or Apple instead"), so the open form fits one screen as well.',
    cost: 'Of the options here, the closest to a second step: the buttons leave the screen while the form is up. Back to them is one tap, on the same page.' },
  { n: '05', name: 'Everything at its floor', cfg: { tight: true, hintInLabel: true, noSubtitle: true, compact: true, switchUp: true },
    claim: '02, with every control at the 44px floor and gaps at 10. The link to the other page moves from the foot to the line under the heading, on both.',
    cost: 'The auth pages\u2019 large buttons go, and "learn more" with them. Fits the phone apps by a hair, which the screen estimate cannot promise, and no phone browser.' },
];

const PgLabelHint = ({ label, hint }) => (
  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
    <span>{label}</span><span style={{ fontWeight: 400, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{hint}</span>
  </span>
);
const pgFoot = { fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-fg-2)', textAlign: 'center' };

// One auth page, sign-up or sign-in, composed from the app's parts.
const PgAuth = ({ kind, cfg, narrow, measureRef, primaryRef }) => {
  const up = kind === 'up';
  const [v, setV] = usePg({});
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }));
  const [emailOpen, setEmailOpen] = usePg(false);
  const firstRef = usePgRef(null);
  const openBtnRef = usePgRef(null);
  usePgEffect(() => { if (emailOpen && firstRef.current) firstRef.current.focus({ preventScroll: true }); }, [emailOpen]);
  const tight = !!cfg.tight;
  const boxed = !narrow || !tight;
  const bsize = cfg.compact ? 'md' : 'lg';
  const gap = cfg.compact ? 10 : tight ? 12 : 16;
  const google = <Button variant="secondary" full size={bsize} icon={<Icon name="google" size={18} />}>Continue with Google</Button>;
  const providers = <>{google}<AppleButton /></>;
  const fields = (
    <div className="pg-fields" style={{ '--pg-gap': gap + 'px' }}>
      {up && (
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, minWidth: 0 }}><Field ref={firstRef} label="First name" name={'pg-first-' + kind} placeholder="Sam" value={v.first || ''} onChange={set('first')} /></div>
          <div style={{ flex: 1, minWidth: 0 }}><Field label="Last name" name={'pg-last-' + kind} placeholder="Rivera" value={v.last || ''} onChange={set('last')} /></div>
        </div>
      )}
      <Field ref={up ? undefined : firstRef} label="Email" name={'pg-email-' + kind} type="email" placeholder="you@example.com" value={v.email || ''} onChange={set('email')} />
      {up
        ? (cfg.hintInLabel
          ? <Field label={<PgLabelHint label="Password" hint="At least 8 characters" />} name={'pg-pw-' + kind} type="password" value={v.pw || ''} onChange={set('pw')} />
          : <Field label="Password" name={'pg-pw-' + kind} type="password" placeholder="At least 8 characters" hint="At least 8 characters." value={v.pw || ''} onChange={set('pw')} />)
        : <div>
            <Field label="Password" name={'pg-pw-' + kind} type="password" placeholder="••••••••" value={v.pw || ''} onChange={set('pw')} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: tight ? -4 : -6, marginBottom: tight ? 'var(--space-3)' : 'var(--space-5)' }}><TextLink onClick={() => {}}>Forgot password?</TextLink></div>
          </div>}
      <div ref={primaryRef}>
        <Button type="button" variant="primary" full size={bsize} style={{ marginTop: up && !tight ? 'var(--space-2)' : 0 }}>{up ? 'Create account' : 'Sign in'}</Button>
      </div>
    </div>
  );
  const divider = tight
    ? <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: (cfg.compact ? 'var(--space-3)' : 'var(--space-4)') + ' 0' }}><span style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} /><span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, color: 'var(--color-fg-3)' }}>or</span><span style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} /></div>
    : <OrDivider />;
  let body;
  if (cfg.emailOnTap) {
    const replaced = cfg.emailReplaces && emailOpen;
    body = (
      <>
        {replaced
          ? <p style={{ ...pgFoot, textAlign: 'left', margin: '0 0 var(--space-4)' }}><TextLink onClick={() => { setEmailOpen(false); setTimeout(() => openBtnRef.current && openBtnRef.current.focus({ preventScroll: true }), 30); }}>Use Google or Apple instead</TextLink></p>
          : providers}
        {!emailOpen && (
          <div ref={primaryRef} style={{ marginTop: 'var(--space-3)' }}>
            <Button ref={openBtnRef} variant="secondary" full size={bsize} icon={<Icon name="mail" size={18} />} onClick={() => setEmailOpen(true)}>Continue with email</Button>
          </div>
        )}
        {emailOpen && <div style={{ marginTop: replaced ? 0 : 'var(--space-5)' }}>{fields}</div>}
      </>
    );
  } else if (cfg.providersFirst) body = <>{providers}{divider}{fields}</>;
  else body = <>{fields}{divider}{providers}</>;
  const switchLine = up
    ? <>Already have an account? <TextLink onClick={() => {}}>Sign in</TextLink></>
    : <>New here? <TextLink onClick={() => {}}>Create an account</TextLink></>;
  return (
    <div ref={measureRef} className={cfg.compact ? 'pg-compact' : undefined} style={{ background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: tight ? '16px 20px 20px' : '32px 20px 48px' }}>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', justifyContent: 'center', marginTop: tight ? 0 : 28, marginBottom: tight ? 20 : 32 }}><Wordmark size={tight ? 20 : 22} /></div>
      <div style={{ width: '100%', maxWidth: 400, ...(boxed ? { background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: tight ? 'var(--space-6)' : 'var(--space-8)', boxShadow: 'var(--shadow-raised)' } : {}) }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0 }}>{up ? 'Create your account' : 'Sign in'}</h1>
        {cfg.switchUp
          ? <p style={{ ...pgFoot, textAlign: 'left', margin: '6px 0 0' }}>{switchLine}</p>
          : !cfg.noSubtitle && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '8px 0 0' }}>{up ? 'One account, every circle you\u2019re part of.' : 'Pick up your list where you left off.'}</p>}
        <div style={{ marginTop: tight ? 'var(--space-5)' : 'var(--space-6)' }}>{body}</div>
        {up ? <ConsentLine /> : <ConsentLine lead="Your use of Circlists is covered by our" />}
      </div>
      {!cfg.switchUp && <div style={{ ...pgFoot, marginTop: tight ? 'var(--space-4)' : 'var(--space-5)' }}>{switchLine} or <OutLink href="https://circlists.com">learn more</OutLink></div>}
    </div>
  );
};

// One page at one screen: drawn whole, scaled to the window, the fold on it.
const PgFrame = ({ opt, kind, screen, avail, full }) => {
  const measureRef = usePgRef(null);
  const primaryRef = usePgRef(null);
  const realRef = usePgRef(null);
  const [m, setM] = usePg(null);
  const w = full ? window.innerWidth : screen.w;
  const h = full ? window.innerHeight : screen.h;
  const tall = Math.max(h, (m && m.page) || h);
  const availH = Math.max(300, window.innerHeight - 110);
  const scale = full ? 1 : Math.min(1, (avail || w) / w, availH / tall);
  usePgLayout(() => {
    const root = () => (opt.real ? realRef.current && realRef.current.firstElementChild : measureRef.current);
    const measure = () => {
      const r = root(); if (!r) return;
      const top = r.getBoundingClientRect().top;
      const sc = r.getBoundingClientRect().height / (r.offsetHeight || 1) || 1;
      let prim = primaryRef.current;
      if (opt.real) prim = [...r.querySelectorAll('button')].find((b) => /^(Create account|Sign in)$/.test(b.textContent.trim()));
      const pr = prim && prim.getBoundingClientRect();
      setM({ page: Math.round(r.offsetHeight), primary: pr ? Math.round((pr.bottom - top) / sc) : null });
    };
    measure();
    const ro = new ResizeObserver(measure);
    const r = opt.real ? realRef.current : measureRef.current;
    if (r) ro.observe(r);
    return () => ro.disconnect();
  }, [opt.n, kind, screen.id, full]);
  const narrow = w < 520;
  const spare = m ? h - m.page : 0;
  const verdict = !m ? null : spare >= PG_MARGIN ? 'fits' : spare >= 0 ? 'hair' : 'runs';
  const Real = kind === 'up' ? SignUp : SignIn;
  return (
    <div className="pg-frame-col">
      <div className="pg-kind">{kind === 'up' ? 'Sign up' : 'Sign in'}</div>
      <div className="pg-frame-wrap" data-full={full ? '1' : undefined} style={{ width: w * scale, height: (full ? h : tall) * scale }}>
        <div className="pg-frame" style={{ width: w, height: full ? h : tall, overflowY: full ? 'auto' : 'hidden', transform: scale < 1 ? 'scale(' + scale + ')' : 'none' }}>
          {opt.real
            ? <div ref={realRef} style={{ '--circ-vh': '0px' }}><Real onSubmit={() => {}} onGoogle={() => {}} onGoSignin={() => {}} onGoSignup={() => {}} onForgot={() => {}} /></div>
            : <PgAuth kind={kind} cfg={opt.cfg} narrow={narrow} measureRef={measureRef} primaryRef={primaryRef} />}
          {!full && m && m.page > h && <div className="pg-below" style={{ top: h, height: m.page - h }}><span>Screen ends</span></div>}
          {!full && m && m.page <= h && <div className="pg-screenend" data-hair={verdict === 'hair' ? '1' : undefined} style={{ top: h - 1 }}><span>Screen ends</span></div>}
        </div>
      </div>
      {m && (
        <div className="pg-read" data-v={verdict}>
          <span>{verdict === 'fits' ? 'Fits, ' + spare + 'px spare' : verdict === 'hair' ? 'Fits by ' + spare + 'px only' : 'Runs ' + (-spare) + 'px past'}</span>
          {m.primary != null && <span>{(m.primary <= h ? 'First act in view' : 'First act below the fold')}</span>}
        </div>
      )}
    </div>
  );
};

const PgCell = ({ opt, screen, onFull }) => {
  const ref = usePgRef(null);
  const [avail, setAvail] = usePg(null);
  usePgLayout(() => {
    const on = () => ref.current && setAvail(ref.current.clientWidth);
    on(); const ro = new ResizeObserver(on); ro.observe(ref.current); return () => ro.disconnect();
  }, []);
  const wide = screen.w > 600;
  const each = avail ? (wide ? avail : (avail - 16) / 2) : null;
  return (
    <section className="pg-cell" ref={ref} data-n={opt.n} data-wide={wide ? '1' : undefined}>
      <header className="pg-head">
        <div className="pg-num">{opt.n}</div>
        <div className="pg-name">{opt.name}</div>
      </header>
      <div className="pg-pair">
        {each && ['up', 'in'].map((k) => <PgFrame key={k} opt={opt} kind={k} screen={screen} avail={each} />)}
      </div>
      <div className="pg-fulls">
        <button type="button" className="pg-fullbtn" onClick={() => onFull(opt.n, 'up')}>Sign up full screen</button>
        <button type="button" className="pg-fullbtn" onClick={() => onFull(opt.n, 'in')}>Sign in full screen</button>
      </div>
      <p className="pg-claim">{opt.claim}</p>
      <p className="pg-cost"><span>Cost</span> {opt.cost}</p>
    </section>
  );
};

const PgBoard = () => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(PG_KEY) || '{}'); } catch (e) { return {}; } })();
  const [screenId, setScreenId] = usePg(saved.screen || 'se-app');
  const [full, setFull] = usePg(null);
  const [, setWin] = usePg(0);
  const gridRef = usePgRef(null);
  usePgEffect(() => { const on = () => setWin((n) => n + 1); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  usePgEffect(() => { try { localStorage.setItem(PG_KEY, JSON.stringify({ screen: screenId })); } catch (e) {} }, [screenId]);
  // 00 mounts the shipped pages, which autofocus their first field and scroll
  // the board to it. Undo that once they have mounted.
  usePgEffect(() => {
    const t = setTimeout(() => {
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      document.querySelectorAll('.pg-frame').forEach((f) => { f.scrollTop = 0; });
      if (!full) window.scrollTo(0, 0);
    }, 120);
    return () => clearTimeout(t);
  }, [screenId, full]);
  const screen = PG_SCREENS.find((s) => s.id === screenId) || PG_SCREENS[1];
  const jump = (n) => {
    const g = gridRef.current; const c = g && g.querySelector('[data-n="' + n + '"]');
    if (c) g.scrollTo({ left: c.offsetLeft - parseFloat(getComputedStyle(g).paddingLeft || 0), behavior: 'smooth' });
  };
  if (full) {
    const opt = PG_OPTIONS.find((o) => o.n === full.n);
    return (
      <div className="pg-fullview">
        <PgFrame opt={opt} kind={full.kind} screen={screen} full />
        <button type="button" className="pg-back" onClick={() => setFull(null)}>{opt.n} · Back to the board</button>
      </div>
    );
  }
  return (
    <main className="pg-page">
      <div className="pg-top">
        <div className="pg-eyebrow">Playground · sign-up on one screen</div>
        <h1 className="pg-title">Fitting sign-up on one phone screen</h1>
        <p className="pg-lede">Each option draws both auth pages, because sign-in has to match whatever sign-up does. Each page is drawn whole at a screen&rsquo;s visible height (approximate: status bar and browser bars taken off); the dashed line is where the screen ends. A fit inside {PG_MARGIN}px is read as a hair, not a fit: the estimate cannot promise it.</p>
        <p className="pg-lede">The question is the page a person arrives on. Once they tap into a field the keyboard takes about half the screen, and no form of this length fits above it on any phone; from there it scrolls, as every form does. Type into any page; Full screen opens one at your own window&rsquo;s size, the real test on a phone.</p>
        <div className="pg-seg" role="radiogroup" aria-label="Screen">
          {PG_SCREENS.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={s.id === screenId} data-on={s.id === screenId ? '1' : undefined} onClick={() => setScreenId(s.id)}>
              {s.label}<span>{s.w}×{s.h}</span>
            </button>
          ))}
        </div>
        <nav className="pg-jump" aria-label="Options">
          {PG_OPTIONS.map((o) => <button key={o.n} type="button" onClick={() => jump(o.n)}><b>{o.n}</b> {o.name}</button>)}
        </nav>
      </div>
      <div className="pg-grid" ref={gridRef}>
        {PG_OPTIONS.map((o) => <PgCell key={o.n + screen.id} opt={o} screen={screen} onFull={(n, kind) => { setFull({ n, kind }); window.scrollTo(0, 0); }} />)}
      </div>
    </main>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgBoard />);
