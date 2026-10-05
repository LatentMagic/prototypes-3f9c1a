// ============================================================================
// Playground rig — the auth frame (signup-one-screen). One page at a time. The
// posture comes from canon's own Config aid (app/config.jsx, mounted as is):
// Platform Mobile, or Viewport Mobile, puts the page in the app's phone frame
// (circlists.html .circ-stage/.circ-phone); otherwise it fills the window, and
// Auto follows the window's width. A bottom strip picks the option, the page
// and the step, and reads whether the page fits: a hidden copy at
// --circ-vh: 0 gives the page's natural height, compared with the screen's.
// ============================================================================
// A second rig reuses this file: it publishes window.AF_RIG ({ key, options, levers }).
const AF_RIG = window.AF_RIG || {};
const AF_KEY = AF_RIG.key || 'pg_auth_frame_v2';
const AF_OPTS = AF_RIG.options || AF_OPTIONS;
const AF_LEVERS = AF_RIG.levers || [];
const AF_WIDE = 760; // the Create circle page's own step (circ-wizard-body)
const AF_MARGIN = 24; // under this, a fit is inside the error of the estimate

const AfPageAt = ({ opt, cfg, kind, step, w, h, wide, setStep, setKind, measure }) => {
  const firstRef = React.useRef(null);
  const tapped = React.useRef(false);
  React.useEffect(() => {
    if (!tapped.current) return;
    tapped.current = false;
    if (step === 2 && firstRef.current) firstRef.current.focus({ preventScroll: true });
  }, [step]);
  const P = opt.Page;
  return (
    <div data-circ-posture={wide ? 'desktop' : 'mobile'} style={{ width: w, '--af-vh': (h / 100) + 'px' }}>
      <P cfg={cfg} kind={kind} step={opt.oneStep ? 1 : step} wide={wide} uid={measure ? 'm' : 'v'} firstRef={measure ? undefined : firstRef}
        onEmail={() => { tapped.current = true; setStep(2); }}
        onBack={() => setStep(1)}
        onSwitch={() => { setKind(kind === 'up' ? 'in' : 'up'); setStep(1); }} />
    </div>
  );
};

const AfRig = () => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(AF_KEY) || '{}'); } catch (e) { return {}; } })();
  const [optN, setOptN] = React.useState(saved.opt || '01');
  const [kind, setKind] = React.useState(saved.kind || 'up');
  const [step, setStep] = React.useState(saved.step || 1);
  const [platform, setPlatform] = React.useState(saved.platform || 'web');
  const [layout, setLayout] = React.useState(saved.layout || 'auto');
  // Config's other review settings: held as the app holds them, none of them reaches an auth page.
  const [mobilePayments, setMobilePayments] = React.useState(false);
  const [gateOn, setGateOn] = React.useState(false);
  const [showTest, setShowTest] = React.useState(true);
  const [open, setOpen] = React.useState(saved.open !== false);
  const [ov, setOv] = React.useState(saved.ov || {});
  const [why, setWhy] = React.useState(false);
  const [win, setWin] = React.useState({ w: window.innerWidth, h: window.innerHeight });
  const [natural, setNatural] = React.useState(null);
  const measureRef = React.useRef(null);
  const stripRef = React.useRef(null);
  const [stripH, setStripH] = React.useState(0);
  React.useEffect(() => { const on = () => setWin({ w: window.innerWidth, h: window.innerHeight }); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  React.useEffect(() => { try { localStorage.setItem(AF_KEY, JSON.stringify({ opt: optN, kind, step, platform, layout, open, ov })); } catch (e) {} }, [optN, kind, step, platform, layout, open, ov]);
  const opt = AF_OPTS.find((o) => o.n === optN) || AF_OPTS[1];
  // Auto + override: each option carries its own answer to every lever (opt.def).
  const cfg = { ...(opt.def || {}) };
  AF_LEVERS.forEach((l) => { if (ov[l.id] != null && !opt.oneStep) cfg[l.id] = ov[l.id]; });
  const overridden = AF_LEVERS.some((l) => ov[l.id] != null);
  const framed = platform === 'app' || layout === 'mobile';
  const bottom = open ? stripH : 0;
  React.useEffect(() => { document.documentElement.style.setProperty('--af-strip', bottom + 'px'); }, [bottom]);
  // The app's phone: 402 wide with an 11px bezel, min(872, window - 48) tall.
  const phoneH = Math.min(872, win.h - 48 - bottom);
  const W = framed ? Math.min(402, win.w - 32) - 22 : win.w;
  const H = framed ? phoneH - 22 : win.h - bottom;
  const wide = framed ? false : layout === 'desktop' ? true : W >= AF_WIDE;
  const shownStep = opt.oneStep ? 1 : step;
  React.useLayoutEffect(() => {
    const el = measureRef.current; if (!el) return;
    const read = () => setNatural(el.offsetHeight);
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, [optN, kind, shownStep, W, H, wide, JSON.stringify(cfg)]);
  React.useLayoutEffect(() => {
    const el = stripRef.current; if (!el) { setStripH(0); return; }
    const read = () => setStripH(el.offsetHeight);
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, [open, why]);
  const spare = natural == null ? null : H - natural;
  const verdict = spare == null ? null : spare >= AF_MARGIN ? 'fits' : spare >= 0 ? 'hair' : 'runs';
  const readout = spare == null ? '' : (verdict === 'fits' ? 'Fits, ' + spare + 'px spare' : verdict === 'hair' ? 'Fits by ' + spare + 'px only' : 'Runs ' + (-spare) + 'px past') + ' · ' + W + '×' + H;
  const page = (measure) => <AfPageAt key={optN + kind + (measure ? 'm' : 'v')} opt={opt} cfg={cfg} kind={kind} step={step} w={W} h={H} wide={wide} setStep={setStep} setKind={setKind} measure={measure} />;
  return (
    <>
      <div aria-hidden="true" inert="" className="af-measure" style={{ '--circ-vh': '0px', width: W }}><div ref={measureRef}>{page(true)}</div></div>
      {framed
        ? (
          <div className="circ-stage" style={{ paddingBottom: bottom + 24 }}>
            <div className="circ-phone" style={{ height: phoneH }}>
              <div className="circ-phone-clip">
                <div className="circ-phone-screen" style={{ '--circ-vh': H + 'px' }}>{page(false)}</div>
              </div>
            </div>
          </div>
        )
        : <div style={{ '--circ-vh': H + 'px', paddingBottom: bottom }}>{page(false)}</div>}
      {window.ConfigLauncher && (
        <ConfigLauncher layout={layout} onLayoutChange={setLayout}
          platform={platform} onPlatformChange={setPlatform}
          mobilePayments={mobilePayments} onMobilePaymentsChange={setMobilePayments}
          gateOn={gateOn} onGateChange={setGateOn}
          showTest={showTest} onShowTestChange={setShowTest} />
      )}
      {open ? (
        <aside className="af-strip" ref={stripRef} aria-label="Playground">
          <div className="af-row">
            <div className="af-opts" role="radiogroup" aria-label="Option">
              {AF_OPTS.map((o) => (
                <button key={o.n} type="button" role="radio" aria-checked={o.n === optN} data-on={o.n === optN ? '1' : undefined} onClick={() => setOptN(o.n)}><b>{o.n}</b>{o.name}</button>
              ))}
            </div>
          </div>
          <div className="af-row">
            <div className="af-seg" role="radiogroup" aria-label="Page">
              {[['up', 'Sign up'], ['in', 'Sign in']].map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={kind === k} data-on={kind === k ? '1' : undefined} onClick={() => setKind(k)}>{l}</button>)}
            </div>
            {!opt.oneStep && (
              <div className="af-seg" role="radiogroup" aria-label="Step">
                {[[1, 'Step 1'], [2, 'Step 2 · email']].map(([s, l]) => <button key={s} type="button" role="radio" aria-checked={step === s} data-on={step === s ? '1' : undefined} onClick={() => setStep(s)}>{l}</button>)}
              </div>
            )}
            {AF_LEVERS.map((l) => (
              <div key={l.id} className="af-seg" role="radiogroup" aria-label={l.label}>
                <button type="button" role="radio" aria-checked={ov[l.id] == null} data-on={ov[l.id] == null ? '1' : undefined} onClick={() => setOv((o) => ({ ...o, [l.id]: null }))}>{l.label}: Auto</button>
                {l.values.map(([v, t]) => <button key={v} type="button" role="radio" aria-checked={ov[l.id] === v} data-on={ov[l.id] === v ? '1' : undefined} onClick={() => setOv((o) => ({ ...o, [l.id]: v }))}>{t}</button>)}
              </div>
            ))}
            <span className="af-read" data-v={verdict}>{readout}{overridden ? ' · overridden' : ''}</span>
            <span className="af-spacer"></span>
            <button type="button" className="af-ghost" aria-expanded={why} onClick={() => setWhy(!why)}>{why ? 'Hide why' : 'Why ' + opt.n}</button>
            <button type="button" className="af-ghost" onClick={() => setOpen(false)}>Hide</button>
          </div>
          {why && (
            <div className="af-why">
              <p>{opt.stance}</p>
              <p><span>Cost</span>{opt.cost}</p>
            </div>
          )}
        </aside>
      ) : (
        <button type="button" className="af-tab" onClick={() => setOpen(true)}>{opt.n} · {kind === 'up' ? 'Sign up' : 'Sign in'}{opt.oneStep ? '' : ' · ' + shownStep}<span data-v={verdict}>{readout}</span></button>
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<AfRig />);
