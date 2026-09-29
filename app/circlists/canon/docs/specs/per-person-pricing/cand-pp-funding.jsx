// ============================================================================
// Per-person pricing candidate — the "start your free month" screen and its
// checkout. Re-publishes FundingPage and Checkout by name (window wins at render);
// refunds fall through to the shipped components untouched. A subscribed account
// never sees either: both pass straight through, and the new circle is made.
// Three layouts of the plan pick, same words and flow; the rest is shared.
// ============================================================================
const PpShippedFundingPage = window.FundingPage;
const PpShippedCheckout = window.Checkout;

const ppMono = { fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-medium)', letterSpacing: 'var(--tracking-wide)' };
const PpPill = ({ children }) => (
  <span style={{ ...ppMono, fontSize: 11, color: 'var(--color-accent)', background: 'var(--color-accent-soft)',
    border: '1px solid var(--color-accent)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>{children}</span>
);

// Option A — two stacked plan cards, pick one.
const PpPickCards = ({ plan, onPick }) => (
  <div role="radiogroup" aria-label="Plan" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginBottom: 18 }}>
    {['yearly', 'monthly'].map((id) => {
      const p = PP_PLANS[id]; const on = plan === id;
      return (
        <button key={id} type="button" role="radio" aria-checked={on} onClick={() => onPick(id)} style={{
          display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%', minHeight: 64, cursor: 'pointer',
          padding: '12px 14px', borderRadius: 'var(--radius-md)', background: on ? 'var(--color-accent-soft)' : 'var(--color-surface)',
          border: on ? '2px solid var(--color-accent)' : '1px solid var(--color-border-2)', color: 'var(--color-fg-1)',
        }}>
          <span aria-hidden style={{ width: 18, height: 18, borderRadius: '50%', flex: 'none', boxSizing: 'border-box',
            border: on ? '5px solid var(--color-accent)' : '2px solid var(--color-border-strong)', background: 'var(--color-surface)' }} />
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-base)' }}>{p.label}</span>
            {id === 'yearly' && <span><PpPill>2 months free</PpPill></span>}
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 20, letterSpacing: '-0.02em' }}>{p.price}
            <span style={{ ...ppMono, fontWeight: 500, fontSize: 12, color: 'var(--color-fg-2)' }}> / {p.unit}</span></span>
        </button>
      );
    })}
  </div>
);

// Option B — a monthly / yearly toggle over one price block.
const PpPickToggle = ({ plan, onPick }) => {
  const p = PP_PLANS[plan];
  return (
    <div style={{ width: '100%', marginBottom: 18 }}>
      <div role="radiogroup" aria-label="Plan" style={{ background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-md)', padding: 3, display: 'flex', gap: 2, marginBottom: 18 }}>
        {['monthly', 'yearly'].map((id) => (
          <button key={id} type="button" role="radio" aria-checked={plan === id} onClick={() => onPick(id)} style={{
            flex: 1, minHeight: 44, border: 0, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
            background: plan === id ? 'var(--color-surface-raised)' : 'transparent',
            boxShadow: plan === id ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
            fontFamily: 'var(--font-sans)', fontWeight: plan === id ? 600 : 500, fontSize: 'var(--text-sm)', color: plan === id ? 'var(--color-fg-1)' : 'var(--color-fg-2)',
          }}>{PP_PLANS[id].label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 10, rowGap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 44, letterSpacing: '-0.03em', color: 'var(--color-accent)', lineHeight: 1 }}>{p.price}</span>
        <span style={{ ...ppMono, fontSize: 'var(--text-sm)', color: 'var(--color-fg-2)', lineHeight: 1.35, textAlign: 'left' }}>per person<br />/ {p.unit}</span>
      </div>
      <div style={{ height: 26, marginTop: 10 }}>{plan === 'yearly' && <PpPill>2 months free</PpPill>}</div>
    </div>
  );
};

// Option C — one recommended plan, the other a quieter link.
const PpPickLead = ({ plan, onPick }) => {
  const p = PP_PLANS[plan]; const other = PP_PLANS[plan === 'yearly' ? 'monthly' : 'yearly'];
  return (
    <div style={{ width: '100%', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 10, rowGap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 44, letterSpacing: '-0.03em', color: 'var(--color-accent)', lineHeight: 1 }}>{p.price}</span>
        <span style={{ ...ppMono, fontSize: 'var(--text-sm)', color: 'var(--color-fg-2)', lineHeight: 1.35, textAlign: 'left' }}>per person<br />/ {p.unit}</span>
        {plan === 'yearly' && <PpPill>2 months free</PpPill>}
      </div>
      <button type="button" onClick={() => onPick(other.id)} style={{
        marginTop: 12, minHeight: 44, background: 'none', border: 0, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
        fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--color-fg-2)',
      }}>{other.id === 'yearly' ? 'Or £50 a year — 2 months free' : 'Or £5 a month'}</button>
    </div>
  );
};

const PpFundingPage = (props) => {
  const st = usePP();
  const { mode, onFund, onBack, onCancel, user } = props;
  const skip = mode !== 'refund' && st.subscribed;
  React.useEffect(() => { if (skip) onFund(); }, [skip]);
  if (mode === 'refund') return <PpShippedFundingPage {...props} />;
  if (skip) return null;
  const p = PP_PLANS[st.plan];
  const Pick = { cards: PpPickCards, toggle: PpPickToggle, lead: PpPickLead }[st.option] || PpPickCards;
  const line = { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', lineHeight: 1.4, color: 'var(--color-fg-1)', textAlign: 'left' };
  return (
    <WizardShell flow={{ step: 1 }} onBack={onBack} onExit={onCancel}>
      <WizardTitle mb={20}>Start your free month</WizardTitle>
      <Pick plan={st.plan} onPick={(id) => window.CircPP.set({ plan: id })} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 16, width: '100%' }}>
        {['One plan covers every circle you run', 'First month free. Everyone you invite joins free'].map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <span style={{ marginTop: 1, color: 'var(--color-accent)', flex: 'none' }}><Icon name="check" size={18} /></span>
            <span style={line}>{t}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: '0 0 14px', maxWidth: '34ch', fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)', textAlign: 'center', textWrap: 'pretty' }}>
        We take your card today and charge {p.full} on {ppChargeDate()} (day 30). We email you a reminder before. Cancel any time before then and pay nothing.
      </p>
      <Button variant="primary" full size="lg" onClick={onFund}>Start your free month</Button>
      <div style={{ margin: '14px 0 0', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)' }}>
        <Icon name="lock" size={13} style={{ flex: 'none' }} /><span>Billed to {user ? user.email : 'your account'}</span>
      </div>
    </WizardShell>
  );
};

// The checkout: the shipped provider stand-in, priced by CircCandidate.checkoutOffer.
const PpCheckout = (props) => {
  const st = usePP();
  const skip = !props.refund && st.subscribed;
  React.useEffect(() => { if (skip) props.onSuccess(); }, [skip]);
  if (props.refund) return <PpShippedCheckout {...props} />;
  if (skip) return null;
  return <PpShippedCheckout {...props} onSuccess={() => { window.CircPP.set({ subscribed: true }); props.onSuccess(); }} />;
};
Object.assign(window, { FundingPage: PpFundingPage, Checkout: PpCheckout });
