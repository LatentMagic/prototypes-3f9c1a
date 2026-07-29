// ============================================================================
// Circlists — Create → Fund wizard shell.
//
// ONE shell, shared by both steps, so the two screens are literally the same
// box: same page ground, same chrome geometry, same content column. If the
// column width or padding needs to change, change it HERE — never per step.
//
// Desktop is Option A ("bare page"): the cream page IS the screen, exactly as
// on mobile, only wider. No card, no surface, no shadow — a floating panel read
// as a modal, which is wrong for what is a real full-page route. Back / dots /
// exit sit at the page's top corners; the column stays at WIZARD_COL so the
// text block is identical across viewports and across steps.
// ============================================================================

const WIZARD_COL = 300;   // the one true content column — mobile and desktop alike
const WIZARD_STEPS = 2;   // name → fund

// Progress = segmented dots, dead-centre in the header. IMMUTABLE: nothing is
// ever stacked above or beside them, and nothing shifts them off centre.
const WizardDots = ({ step, steps = WIZARD_STEPS }) => (
  <div role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={steps}
    aria-label={`Step ${step + 1} of ${steps}`}
    style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    {Array.from({ length: steps }, (_, k) => (
      <span key={k} style={{
        width: k === step ? 22 : 7, height: 7, borderRadius: 4,
        background: k === step ? 'var(--color-accent)' : 'var(--color-border-1)',
        transition: 'width var(--duration-base) var(--ease-quiet), background var(--duration-base) var(--ease-quiet)',
      }} />
    ))}
  </div>
);

const WizardIconBtn = ({ name, label, onClick }) => (
  <button onClick={onClick} aria-label={label} className="circ-iconbtn" style={{
    background: 'transparent', border: 0, padding: 8, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40,
    borderRadius: 'var(--radius-md)', color: 'var(--color-fg-2)',
  }}><Icon name={name} size={20} /></button>
);

// Body is safe-centred with a scroll fallback: centred on tall screens, top-aligned
// and scrollable on short ones, so it never clips on the smallest phones.
// `flow` is the ONE switch between the two states of a wizard page: {step, steps}
// means "you are inside the create -> fund flow" (dots + back); null means the
// same page reached as a standalone task (neither). Nothing else in the page may
// branch on how you got here.
//
// The centre slot has exactly one tenant at a time and the shell owns both:
// progress when you are in a flow, the SUBJECT (which circle) when you are not.
// A standalone task has no step-one to have told you what you are acting on, so
// the slot that answered "where am I" answers "on what" instead. This is why the
// name needs no new home in the body.
const WizardSubject = ({ children }) => (
  <span style={{
    fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-medium)', fontSize: 12,
    letterSpacing: 'var(--tracking-wide)', color: 'var(--color-fg-2)',
    display: 'inline-flex', alignItems: 'center', padding: 8, minHeight: 40,
    maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  }}>{children}</span>
);
const WizardShell = ({ flow = null, subject, onBack, onExit, children }) => (
  <div style={{ height: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: 'clamp(10px, 1.2vw, 16px) clamp(12px, 1.4vw, 20px)', flex: 'none',
    }}>
      {(flow && onBack) ? <WizardIconBtn name="arrow-left" label="Back" onClick={onBack} /> : <span style={{ width: 40 }} />}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {flow
          ? <WizardDots step={flow.step} steps={flow.steps || WIZARD_STEPS} />
          : (subject ? <WizardSubject>{subject}</WizardSubject> : null)}
      </div>
      {onExit ? <WizardIconBtn name="x" label="Exit" onClick={onExit} /> : <span style={{ width: 40 }} />}
    </header>
    <div className="circ-wizard-body" style={{
      flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
    }}>
      <div className="circ-wizard-col" style={{ maxWidth: WIZARD_COL, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  </div>
);

const WizardTitle = ({ children, mb = 16 }) => (
  <h1 style={{
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.2,
    letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: `0 0 ${mb}px`,
  }}>{children}</h1>
);

Object.assign(window, { WIZARD_COL, WIZARD_STEPS, WizardShell, WizardDots, WizardSubject, WizardTitle, WizardIconBtn });
