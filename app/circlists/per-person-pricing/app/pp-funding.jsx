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

// Take-over (proposed): a member of a sleeping circle takes it over. Three versions by account,
// and one for the lapsed champion restarting. Reached on the refund route; window.__ppTk says which.
const PpTakeOver = ({ spaceName, onFund, onCancel, user }) => {
  const st = usePP();
  const tk = window.__ppTk;
  const p = PP_PLANS[st.plan];
  const lapsed = tk.kind === 'lapsed';
  const acct = ppAccount(st);
  const covered = !lapsed && acct === 'subscribed';
  const free = !lapsed && acct === 'none';
  const Pick = { cards: PpPickCards, toggle: PpPickToggle, lead: PpPickLead }[st.option] || PpPickCards;
  const line = { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', lineHeight: 1.4, color: 'var(--color-fg-1)', textAlign: 'left' };
  const bullets = lapsed ? ['One plan covers every circle you run', 'All your circles wake up together']
    : covered ? ['Covered by your plan. Nothing more to pay', 'You become its champion. Members stay free']
    : ['It runs on your subscription. One plan covers every circle you run',
       free ? 'First month free. Everyone in the circle stays free' : 'Everyone in the circle stays free'];
  const note = covered ? null
    : free ? <>We take your card today and charge {p.full} on {ppChargeDate()} (day 30). We email you a reminder before. Cancel any time before then and pay nothing.</>
    : (lapsed ? 'You had your free month before, so there is none this time. We charge ' : 'You have subscribed before, so there is no free month. We charge ') + p.full + ' today.';
  // v7: the decided two-state screen. State 2 = used the free month (lapsed champion or subscribed before); state 1 = never paid.
  const V7 = st.v7 && !covered ? (lapsed || !free ? { s2: true } : { s2: false }) : null;
  const per = p.id === 'yearly' ? '£50 a year' : '£5 a month';
  const nm = spaceName || 'this circle';
  const v7bul = V7 && (lapsed ? ['One plan covers every circle you run', 'All your circles wake up together'] : ['It wakes up and you become its champion', 'Everyone you invite joins free']);
  const title = V7 ? (V7.s2 ? 'Start your subscription' : 'Start your free month') : lapsed ? 'Restart your subscription' : 'Take over ' + (spaceName || 'this circle');
  const button0 = V7 ? (V7.s2 ? 'Subscribe' : 'Start free month') : null;
  const button = button0 ? button0 : lapsed ? 'Restart subscription' : covered ? 'Take over this circle' : free ? 'Start free month and take over' : 'Pay ' + p.full + ' and take over';
  return (
    <WizardShell subject={spaceName} onExit={onCancel}>
      <WizardTitle mb={20}>{title}</WizardTitle>
      {!covered && <Pick plan={st.plan} onPick={(id) => window.CircPP.set({ plan: id })} />}
      {V7 && <p style={{ margin: '-4px 0 16px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-fg-1)', textAlign: 'center' }}>{V7.s2 ? per + ', from today' : '30 days free, then ' + per}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 16, width: '100%' }}>
        {(V7 ? v7bul : bullets).map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <span style={{ marginTop: 1, color: 'var(--color-accent)', flex: 'none' }}><Icon name="check" size={18} /></span>
            <span style={line}>{t}</span>
          </div>
        ))}
      </div>
      {V7 ? (!V7.s2 && <p style={{ margin: '0 0 14px', maxWidth: '34ch', fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-2)', textAlign: 'center' }}>A card is needed to start</p>) : note && <p style={{ margin: '0 0 14px', maxWidth: '34ch', fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)', textAlign: 'center', textWrap: 'pretty' }}>{note}</p>}
      <Button variant="primary" full size="lg" onClick={onFund}>{button}</Button>
      {!covered && <div style={{ margin: '14px 0 0', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)' }}>
        <Icon name="lock" size={13} style={{ flex: 'none' }} /><span>Billed to {user ? user.email : 'your account'}</span>
      </div>}
    </WizardShell>
  );
};

const PpFundingPage = (props) => {
  const st = usePP();
  const { mode, onFund, onBack, onCancel, user } = props;
  const skip = mode !== 'refund' && st.subscribed;
  React.useEffect(() => { if (skip) onFund(); }, [skip]);
  const auto = window.__ppAuto;
  React.useEffect(() => {
    if (mode !== 'refund') return;
    if (auto === 'checkout') { window.__ppAuto = null; onFund(); } else if (auto) window.__ppAuto = null;
  }, []);
  if (mode === 'refund') return window.__ppTk ? <PpTakeOver {...props} /> : <PpShippedFundingPage {...props} />;
  if (skip) return null;
  const p = PP_PLANS[st.plan];
  const back = st.returning;
  const Pick = { cards: PpPickCards, toggle: PpPickToggle, lead: PpPickLead }[st.option] || PpPickCards;
  const line = { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', lineHeight: 1.4, color: 'var(--color-fg-1)', textAlign: 'left' };
  // Copy variants of the free-month screen (review only): A is the existing copy.
  const cv = back ? 'A' : st.copy;
  const bullets = cv === 'B' ? ['One plan covers every circle you run', 'Members are never charged']
    : cv === 'C' ? ['Start as many circles as you like', 'Your members always join free']
    : ['One plan covers every circle you run', back ? 'Everyone you invite joins free' : 'First month free. Everyone you invite joins free'];
  const noteB = <>A card is needed to start. You pay nothing for 30 days, then {p.full} a {p.unit}, from {ppChargeDate()}. Cancel before then and you pay nothing.</>;
  const noteC = <>We ask for your card now and charge {p.full} after 30 days, on {ppChargeDate()}. We email a reminder first.</>;
  // v7 pricing copy (review only). v7 = A | B | C for state 1 (free month on offer); any v7 on a lapsed account is state 2.
  const v7 = st.v7;
  const per = p.id === 'yearly' ? '£50 a year' : '£5 a month';
  const V7 = !v7 ? null : back
    ? { title: 'Start your subscription', line: per + ', from today', sub: null, button: 'Subscribe' }
    : v7 === 'B' ? { title: 'Start your free month', line: null, sub: 'A card is needed to start. 30 days free, then ' + per + '.', button: 'Start free month' }
    : v7 === 'C' ? { title: 'Try it free for 30 days', line: 'Then ' + per + '. Cancel before day 30 and pay nothing.', sub: 'A card is needed to start', button: 'Start 30 days free' }
    : { title: 'Start your free month', line: '30 days free, then ' + per, sub: 'A card is needed to start', button: 'Start free month' };
  const v7bul = ['Start as many circles as you like', 'Everyone you invite joins free'];
  const pricingFirst = mode !== 'refund' && st.flow === 'pricing-first' && !st.subscribed;
  return (
    <WizardShell flow={{ step: 1 }} onBack={pricingFirst ? onCancel : onBack} onExit={onCancel}>
      <WizardTitle mb={20}>{V7 ? V7.title : back ? 'Restart your subscription' : 'Start your free month'}</WizardTitle>
      <Pick plan={st.plan} onPick={(id) => window.CircPP.set({ plan: id })} />
      {V7 && V7.line && <p style={{ margin: '-4px 0 16px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-fg-1)', textAlign: 'center' }}>{V7.line}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 16, width: '100%' }}>
        {(V7 ? v7bul : bullets).map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <span style={{ marginTop: 1, color: 'var(--color-accent)', flex: 'none' }}><Icon name="check" size={18} /></span>
            <span style={line}>{t}</span>
          </div>
        ))}
      </div>
      {V7 ? (V7.sub && <p style={{ margin: '0 0 14px', maxWidth: '34ch', fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-2)', textAlign: 'center', textWrap: 'pretty' }}>{V7.sub}</p>) :
      <p style={{ margin: '0 0 14px', maxWidth: '34ch', fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)', textAlign: 'center', textWrap: 'pretty' }}>
        {back ? 'You have subscribed before, so there is no free month. We charge ' + p.full + ' today.'
          : cv === 'B' ? noteB : cv === 'C' ? noteC
          : <>We take your card today and charge {p.full} on {ppChargeDate()} (day 30). We email you a reminder before. Cancel any time before then and pay nothing.</>}
      </p>}
      <Button variant="primary" full size="lg" onClick={onFund}>{V7 ? V7.button : back ? 'Restart subscription' : 'Start your free month'}</Button>
      <div style={{ margin: '14px 0 0', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)' }}>
        <Icon name="lock" size={13} style={{ flex: 'none' }} /><span>Billed to {user ? user.email : 'your account'}</span>
      </div>
    </WizardShell>
  );
};

// The checkout: the shipped provider stand-in, priced by ppCheckoutOffer.
// A take-over (refund route) is shown to the shipped component as a new subscription, so the offer applies.
const PpCheckout = (props) => {
  const st = usePP();
  const tk = props.refund ? window.__ppTk : null;
  const passThrough = props.refund ? !!tk && tk.kind === 'member' && st.subscribed : st.subscribed;
  const done = () => {
    if (tk && tk.kind === 'lapsed' && window.__ppApi) {
      window.__ppApi.setSpaces((prev) => prev.map((s) => (!s.funded && s.champion === 'You'
        ? { ...s, funded: true, dormancy: null, funding: null, openUntil: null } : s)));
    }
    window.__ppTk = null;
    const first = !st.subscribed && !props.refund && st.flow === 'pricing-first';
    if (!st.subscribed) window.CircPP.set({ subscribed: true, returning: false });
    // Pricing-first: the card is in, so the circle form comes next, then the circle is made.
    if (first && window.__ppApi) window.__ppApi.setRoute('create-space'); else props.onSuccess();
  };
  React.useEffect(() => { if (passThrough) done(); }, [passThrough]);
  if (props.refund && !tk) return <PpShippedCheckout {...props} />;
  if (passThrough) return null;
  window.__ppTkActive = tk;
  return <PpShippedCheckout {...props} refund={false} onSuccess={done} />;
};
// Pricing-first (proposed): "Create" from an account that is not subscribed opens the pricing
// screen before the circle form. Once subscribed, the shipped form runs as it does today.
const PpShippedCreateSpace = window.CreateSpace;
const PpCreateSpace = (props) => {
  const st = usePP();
  const gate = st.flow === 'pricing-first' && !st.subscribed;
  React.useEffect(() => { if (gate && window.__ppApi) window.__ppApi.setRoute('funding'); }, [gate]);
  if (gate) return null;
  return <PpShippedCreateSpace {...props} />;
};
Object.assign(window, { FundingPage: PpFundingPage, Checkout: PpCheckout, CreateSpace: PpCreateSpace });
