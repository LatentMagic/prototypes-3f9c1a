// ============================================================================
// Circlists — Subscriptions (per-space model).
// The space is the billing unit: £3 per space / month (introductory rate),
// funded by one member — the champion. Everyone they invite joins free.
// Creating a space IS funding it.
//
// Circlists-authored:  FundingPage (new + re-fund), SettingUp settle, DormantSpace.
// Provider boundary (cool slate, simulated):  Checkout, ManageFunding deep-link.
// Currency is £ throughout — never $, never per-seat.
// ============================================================================

const PRICE_PER_SPACE = 3;
const OPERATOR_EMAIL = 'support@circlists.com';

// ---- Funding page (Circlists-authored, full page) --------------------------
// One reusable page: fund a NEW space, or re-fund a DORMANT one. The re-fund
// register acknowledges the returning champion — never new-customer pricing.
// Tightened layout (design audit, Option 1): no card, back + X both in the top
// bar, and the body is safe-centred with a scroll fallback so it stays centred
// on tall screens yet never clips on the smallest phones (natural content
// ~370px clears a 360×640 screen with headroom; if copy ever grows it
// top-aligns and scrolls instead of overrunning the viewport).
const IconBtn = ({ name, label, onClick }) => (
  <button onClick={onClick} aria-label={label} className="circ-iconbtn" style={{
    background: 'transparent', border: 0, padding: 8, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40,
    borderRadius: 'var(--radius-md)', color: 'var(--color-fg-2)',
  }}><Icon name={name} size={20} /></button>
);
// ONE screen, two states. The offer is identical either way — same price, same
// circle, same cap, same champion — so the body does NOT branch. Exactly three
// things change, and they are all about *where you came from*, never about what
// you are buying:
//   1. flow chrome  — mid-flow gets dots + back; standalone gets the circle name
//                     in the same centre slot the dots vacated
//   2. copy         — the title names the OUTCOME, the CTA names the ACTION, and
//                     they never use the same verb twice on one screen
//   3. exit target  — owned by the caller, not by this file
// Resist adding a fourth. If a difference wants to live inside the body, that is
// a signal the two entry points need different *surrounding* screens, not this
// one forked again.
const FUND_FEATURES = [
  'You fund the circle as its champion',
  'Up to 10 members, all invited free',
  'Shared list, private read-state',
];
const FundingPage = ({ spaceName, mode = 'new', onFund, onCancel, onBack, user }) => {
  const refund = mode === 'refund';
  return (
    <WizardShell flow={refund ? null : { step: 1 }} subject={spaceName} onBack={onBack} onExit={onCancel}>
          <WizardTitle mb={20}>{refund ? 'Bring your circle back' : 'Fund your circle'}</WizardTitle>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', columnGap: 10, rowGap: 8, marginBottom: 22 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 44, letterSpacing: '-0.03em', color: 'var(--color-accent)', lineHeight: 1 }}>{`\u00a3${PRICE_PER_SPACE}`}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-fg-2)', lineHeight: 1.35, textAlign: 'left' }}>per circle<br />/ month</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-medium)', fontSize: 11,
              letterSpacing: 'var(--tracking-wide)', color: 'var(--color-accent)', background: 'var(--color-accent-soft)',
              border: '1px solid var(--color-accent)', marginLeft: 6,
              padding: '2px 8px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
            }}>Founding rate</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 22, width: '100%', maxWidth: 290 }}>
            {FUND_FEATURES.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <span style={{ marginTop: 1, color: 'var(--color-accent)', flex: 'none' }}><Icon name="check" size={18} /></span>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-base)', lineHeight: 1.4, color: 'var(--color-fg-1)', textAlign: 'left' }}>{f}</span>
              </div>
            ))}
          </div>
          <Button variant="primary" full size="lg" onClick={onFund}>{refund ? 'Re-fund this circle' : 'Fund this circle'}</Button>
          <div style={{
            margin: '14px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)', lineHeight: 1.5,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name="lock" size={13} style={{ flex: 'none' }} />
              <span>Billed to {user ? user.email : 'your account'}</span>
            </span>
            <span>Cancel anytime</span>
          </div>
    </WizardShell>
  );
};

// ---- Provider-hosted boundary chrome ---------------------------------------
// A deliberately different register (cool slate) — "you have left Circlists
// and are on the payment provider."
const ProviderShell = ({ children, merchant = 'Circlists' }) => (
  <div style={{
    minHeight: 'var(--circ-vh)', background: '#0f172a',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '32px 20px 48px', fontFamily: 'var(--font-sans)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cbd5e1', marginTop: 'min(6vh,48px)', marginBottom: 24 }}>
      <Icon name="lock" size={15} color="#94a3b8" />
      <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.01em' }}>Secure payment</span>
      <span style={{ color: '#475569' }}>·</span>
      <span style={{ fontWeight: 500, fontSize: 13, color: '#94a3b8' }}>{merchant}</span>
    </div>
    <div style={{
      width: '100%', maxWidth: 420, background: '#fff', borderRadius: 14,
      padding: 'var(--space-8)', boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
    }}>{children}</div>
    <div style={{ marginTop: 20, fontSize: 12, color: '#64748b', fontWeight: 500 }}>This is a simulated provider boundary.</div>
  </div>
);

// ---- Hosted checkout (simulated) -------------------------------------------
const Checkout = ({ user, spaceName, refund, onSuccess, onCancel }) => {
  const [card, setCard] = React.useState('');
  const [exp, setExp] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const pay = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1400);
  };
  const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };
  const inp = {
    width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-mono)', fontSize: 16,
    color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px', minHeight: 46,
  };
  const lbl = { display: 'block', fontWeight: 600, fontSize: 13, color: '#334155', marginBottom: 6 };
  return (
    <ProviderShell>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 500, fontSize: 13, color: '#64748b', marginBottom: 4 }}>{refund ? 'Re-fund' : 'Fund'} {spaceName || 'your circle'} on Circlists</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 30, color: '#0f172a', letterSpacing: '-0.02em' }}>{`\u00a3${PRICE_PER_SPACE}.00`}</span>
          <span style={{ fontWeight: 500, fontSize: 14, color: '#64748b' }}>per month</span>
        </div>
      </div>
      <form onSubmit={pay}>
        <label style={lbl}>Email</label>
        <input style={{ ...inp, fontFamily: 'var(--font-sans)', marginBottom: 16, background: '#f8fafc', color: '#475569' }} value={user ? user.email : ''} readOnly />
        <label style={lbl}>Card information</label>
        <input style={{ ...inp, marginBottom: 8 }} inputMode="numeric" placeholder="1234 1234 1234 1234" value={card} onChange={(e) => setCard(fmtCard(e.target.value))} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input style={{ ...inp }} inputMode="numeric" placeholder="MM / YY" value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} />
          <input style={{ ...inp }} inputMode="numeric" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} />
        </div>
        <button type="submit" disabled={loading} style={{
          width: '100%', minHeight: 48, border: 0, borderRadius: 8, cursor: loading ? 'default' : 'pointer',
          background: '#047857', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {loading && <Spinner size={15} />}
          {loading ? 'Processing\u2026' : `Pay \u00b7 \u00a3${PRICE_PER_SPACE}.00 / mo`}
        </button>
      </form>
      <button onClick={onCancel} style={{
        width: '100%', marginTop: 14, background: 'transparent', border: 0, cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: '#64748b', minHeight: 36,
      }}>Cancel and return</button>
    </ProviderShell>
  );
};

// ---- Manage funding (per-space provider deep-link, simulated) --------------
// Reached from the members surface (champion only). Scoped to THIS space's one
// subscription — never a portal list of every space the champion funds.
const ManageFunding = ({ user, spaceName, intent = 'manage', onReturn, onCancelSub }) => {
  const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #e2e8f0' };
  return (
    <ProviderShell merchant="Circlists · Billing">
      <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', marginBottom: 4 }}>{spaceName || 'Circle'} funding</div>
      <div style={{ fontWeight: 500, fontSize: 13, color: '#64748b', marginBottom: 18 }}>{user ? user.email : ''}</div>
      <div style={{ ...row, borderTop: 0 }}>
        <span style={{ fontWeight: 500, fontSize: 14, color: '#334155' }}>Plan</span>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{`\u00a3${PRICE_PER_SPACE}.00 / month`}</span>
      </div>
      <div style={row}>
        <span style={{ fontWeight: 500, fontSize: 14, color: '#334155' }}>Status</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: '#047857' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#047857' }} /> Active
        </span>
      </div>
      <div style={row}>
        <span style={{ fontWeight: 500, fontSize: 14, color: '#334155' }}>Payment method</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 13, color: '#0f172a' }}>•••• 4242</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
        <button onClick={onReturn} style={{
          width: '100%', minHeight: 46, border: 0, borderRadius: 8, cursor: 'pointer',
          background: intent === 'cancel' ? '#fff' : '#0f172a', color: intent === 'cancel' ? '#334155' : '#fff',
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
          ...(intent === 'cancel' ? { border: '1px solid #e2e8f0', order: 2 } : {}),
        }}>Update payment method</button>
        <button onClick={onCancelSub} style={{
          width: '100%', minHeight: 46, border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer',
          background: '#fff', color: intent === 'cancel' ? 'var(--color-destructive)' : '#334155',
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
          ...(intent === 'cancel' ? { order: 1 } : {}),
        }}>Cancel this circle&rsquo;s funding</button>
      </div>
      <button onClick={onReturn} style={{
        width: '100%', marginTop: 16, background: 'transparent', border: 0, cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: '#047857', minHeight: 36,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <Icon name="arrow-left" size={15} color="#047857" /> Return to Circlists
      </button>
    </ProviderShell>
  );
};

// ---- Leaving to the provider — app-level loading state (see AppLoading) ----
// You're still in Circlists at this moment (the provider slate starts on the
// actual Checkout/ManageFunding screens), so this is the plain app loading.
const ProviderInterstitial = ({ label, onDone }) => {
  React.useEffect(() => { const t = setTimeout(onDone, 1100); return () => clearTimeout(t); }, [onDone]);
  return <AppLoading label={label} />;
};

// ---- "Setting up your circle" settle state — app-level loading (AppLoading)-
// Shown on return from a completed checkout while the circle is provisioned —
// provisioning is asynchronous but GUARANTEED, so this always resolves into the
// new circle's empty Active tab. Same loading state as any other app-level load.
const SettingUp = ({ spaceName, onDone }) => {
  React.useEffect(() => { const t = setTimeout(onDone, 1900); return () => clearTimeout(t); }, [onDone]);
  return <AppLoading label="Setting up your circle" />;
};

// ---- Dormant-space state ---------------------------------------------------
// ONE calm full-page state, identical for every member — no role branch, and it
// names nobody. Content + roster preserved, access frozen, recoverable by
// ANYONE in the circle: the remedy belongs to everyone, and the champion role
// passes to whoever funds next.
//   asleep     → Fund (the standalone re-fund checkout) + the rule in copy,
//                the ordinary contact door, and Leave
//   suspended  → Get in touch, and Leave. Funding is absent because the
//                subscription still exists, paused; the screen says so. Same
//                left/right pair as asleep, but NEITHER side is a box: with no
//                fill to rank against, a boxed exit next to a text link would
//                outweigh the remedy, and contact must not be a filled primary
//                — it is a mailto, not a transaction. So both are text controls
//                the exit stays the SAME boxed destructive-secondary control as
//                asleep — one treatment of Leave across the family — and the
//                remedy takes the right-hand slot as the accent contact link it
//                already was. Leave opens the same shipped confirmation.
// Layout (LM-626 whiteboard, Di + round three): headline states the fact, one
// subheading, then the two actions ranked — Leave LEFT of Fund in a row
// (reading order ends on the affirmative, as the confirm dialogs do), stacked
// with Fund on TOP when the canvas is narrow (vertical stacks rank by first).
// BOTH are boxed buttons of the same height, so the gaps are honest and there
// is no optical compensation anywhere; ranking comes from fill vs outline.
// Leave opens the SHIPPED leave confirmation, the same one the roster opens.
// The support address is alone at the foot — never in a row with a button.
// The row/stack switch is a CONTAINER QUERY on the canvas, not a posture flag:
// the screen adapts to the width it is handed, in any of the three postures.
// Measures and optical rhythm live in CSS (circlists.html, .circ-dormant-*):
// each line gets a measure NARROWER than the column so it wraps inside the
// shape the buttons make, and the exit's oversized hit target is cancelled with
// negative margins so the stack is spaced by ink rather than by boxes.
const DormantSpace = ({ space, dormancy = 'terminal', onFund, onLeave }) => {
  const suspended = dormancy === 'suspended';
  const SupportLine = window.SupportLine;
  const title = suspended ? 'This circle is suspended.' : 'This circle is asleep.';
  // Asleep names the CAUSE and what is closed: without it, Fund reads as an
  // upsell rather than a repair. Nothing is lost, and nobody is named.
  const body = suspended
    ? 'Its subscription is paused rather than gone. Get in touch and we\u2019ll sort it out.'
    : 'Its funding ran out. Everything in it is still here.';
  return (
    <main className="circ-dormant">
      <div className="circ-dormant-mid">
        <div className="circ-dormant-col">
          <h1 className="circ-dormant-title">{title}</h1>
          <p className="circ-dormant-body">{body}</p>
          {suspended ? (
            <div className="circ-dormant-actions">
              {onLeave && <Button variant="destructive-secondary" size="lg" full onClick={onLeave}>Leave this circle</Button>}
              <a href={`mailto:${OPERATOR_EMAIL}?subject=${encodeURIComponent('Suspended circle: ' + (space ? space.name : ''))}`}
                className="circ-dormant-link" style={{ color: 'var(--color-accent)' }}>
                <Icon name="mail" size={17} color="var(--color-accent)" /> Get in touch
              </a>
            </div>
          ) : (
            <React.Fragment>
              <div className="circ-dormant-actions">
                {onLeave && <Button variant="destructive-secondary" size="lg" full onClick={onLeave}>Leave this circle</Button>}
                <Button variant="primary" size="lg" onClick={onFund}>Fund this circle</Button>
              </div>
              <p className="circ-dormant-cap">Any member can fund it. Whoever funds it next champions it.</p>
            </React.Fragment>
          )}
        </div>
      </div>
      {!suspended && SupportLine && <div className="circ-dormant-foot"><SupportLine /></div>}
    </main>
  );
};

// ---- Web-only payments handoff (app posture, mobile payments OFF) ----------
// Real app stores make in-app payment fraught, so Circlists takes payment on the
// web only. In app mode with payments off, every path that would reach the
// funding / checkout wizard (create a circle, re-fund a dormant one, manage
// funding) lands here instead: the circle is named / set up as far as possible
// in-app, and the user is told to finish on the web. No checkout, no price, no
// provider surface is reachable. Voice: direct, present-tense, non-blaming, no
// urgency — the same calm floor as every other surface. main.jsx guards the
// payment routes and renders this in their place while off; when payments are
// on, the real wizard runs in the app posture untouched.
const HANDOFF_COPY = {
  new: {
    eyebrow: 'Finish on the web',
    title: (n) => `${n || 'Your circle'} is ready`,
    body: (n) => `${n || 'Your circle'} is named and set up. Circlists takes payment on the web, so open it in a browser to fund it and bring it live. Everyone you invite joins free.`,
  },
  refund: {
    eyebrow: 'Finish on the web',
    title: (n) => `Bring ${n || 'this circle'} back`,
    body: (n) => `Circlists takes payment on the web. Open it in a browser to re-fund ${n || 'this circle'} and bring it back for everyone — your members and history are still here.`,
  },
  manage: {
    eyebrow: 'Manage on the web',
    title: (n) => `${n || 'This circle'}\u2019s funding`,
    body: (n) => `Funding lives on the web. Open Circlists in a browser to update payment or change ${n || 'this circle'}\u2019s funding.`,
  },
};
const WebHandoff = ({ context = 'new', spaceName, onExit }) => {
  const c = HANDOFF_COPY[context] || HANDOFF_COPY.new;
  return (
    <div style={{ height: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px 12px', flex: 'none' }}>
        <IconBtn name="x" label="Close" onClick={onExit} />
      </header>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'safe center', padding: '8px 24px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: 22 }}><PulseMark size={46} /></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)', marginBottom: 12 }}>{c.eyebrow}</div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: '0 0 12px' }}>{c.title(spaceName)}</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: 'var(--color-fg-2)', margin: '0 0 24px', maxWidth: 360 }}>{c.body(spaceName)}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 16px', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', marginBottom: 28 }}>
            <Icon name="external-link" size={16} color="var(--color-fg-3)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-1)' }}>circlists.com</span>
          </div>
          <Button variant="primary" full size="lg" onClick={onExit} style={{ maxWidth: 320 }}>Back to your circles</Button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  PRICE_PER_SPACE, OPERATOR_EMAIL, FundingPage, Checkout, ManageFunding,
  ProviderInterstitial, SettingUp, DormantSpace, WebHandoff,
});
