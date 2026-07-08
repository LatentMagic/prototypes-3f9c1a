// ============================================================================
// LatentPulse — Subscriptions (per-space model).
// The space is the billing unit: £3 per space / month (introductory rate),
// funded by one member — the champion. Everyone they invite joins free.
// Creating a space IS funding it.
//
// LP-authored:  FundingPage (new + re-fund), SettingUp settle, DormantSpace.
// Provider boundary (cool slate, simulated):  Checkout, ManageFunding deep-link.
// Currency is £ throughout — never $, never per-seat.
// ============================================================================

const PRICE_PER_SPACE = 3;
const OPERATOR_EMAIL = 'support@circlists.com';

// ---- Funding page (LP-authored, full page) ---------------------------------
// One reusable page: fund a NEW space, or re-fund a DORMANT one. The re-fund
// register acknowledges the returning champion — never new-customer pricing.
const FundingPage = ({ spaceName, mode = 'new', onFund, onCancel, onBack, user }) => {
  const refund = mode === 'refund';
  const features = refund
    ? [
        'Your members and reading history are still here',
        'Up to 10 members — everyone joins free',
        'Picks up exactly where it left off',
      ]
    : [
        'You\u2019re the champion — you fund the circle',
        'Up to 10 members — everyone you invite joins free',
        'Shared library, private reading state',
      ];
  return (
    <div style={{ minHeight: 'var(--lp-vh)', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '20px 24px' }}>
        {onCancel && (
          <button onClick={onCancel} aria-label="Exit" style={{
            background: 'transparent', border: 0, padding: 8, margin: '-8px -8px -8px 0', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40,
            borderRadius: 'var(--radius-md)', color: 'var(--color-fg-2)',
          }}><Icon name="x" size={20} /></button>
        )}
      </header>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px 64px' }}>
        <div style={{ maxWidth: 468, width: '100%', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 16,
          }}>{refund ? 'Returning champion' : 'New circle'}{spaceName ? <React.Fragment>{' \u00b7 '}<span style={{ fontWeight: 700 }}>{spaceName}</span></React.Fragment> : null}</div>
          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.15,
            letterSpacing: '-0.025em', color: 'var(--color-fg-1)', margin: '0 0 10px',
          }}>{refund ? `Re-fund ${spaceName || 'this circle'}.` : 'Fund your circle.'}</h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.55,
            color: 'var(--color-fg-2)', margin: '0 auto 32px', maxWidth: 420,
          }}>{refund
            ? `Pick ${spaceName || 'it'} back up where it left off. \u00a3${PRICE_PER_SPACE} a month brings it back for everyone — your members and history are still here.`
            : 'Everyone you invite joins free.'}</p>

          <div style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', textAlign: 'left',
            boxShadow: 'var(--shadow-raised)',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'nowrap', gap: 10, marginBottom: refund ? 20 : 14 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 46, letterSpacing: '-0.03em', color: 'var(--color-accent)', lineHeight: 1 }}>{`\u00a3${PRICE_PER_SPACE}`}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-2)', whiteSpace: 'nowrap' }}>/ circle / month</span>
            </div>
            {!refund && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 13, letterSpacing: '0.01em', color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>Introductory rate for early circles</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ marginTop: 1, color: 'var(--color-accent)', flexShrink: 0 }}><Icon name="check" size={18} /></span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15, lineHeight: 1.4, color: 'var(--color-fg-1)' }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)', marginBottom: 20 }}>Billed to {user ? user.email : 'your account'}. Cancel anytime.</div>
            <Button variant="primary" full size="lg" onClick={onFund}>{refund ? 'Re-fund this circle' : 'Fund this circle'}</Button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, color: 'var(--color-fg-3)' }}>
              <Icon name="lock" size={13} />
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12 }}>Secure checkout · powered by a payment provider</span>
            </div>
          </div>
          {!refund && onBack && (
            <div style={{ textAlign: 'left', marginTop: 'var(--space-5)' }}>
              <button onClick={onBack} style={{
                background: 'transparent', border: 0, padding: '8px 6px', margin: '0 0 0 -6px', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40,
                fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-2)',
              }}><Icon name="arrow-left" size={16} /> Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- Provider-hosted boundary chrome ---------------------------------------
// A deliberately different register (cool slate) — "you have left LatentPulse
// and are on the payment provider."
const ProviderShell = ({ children, merchant = 'Circlists' }) => (
  <div style={{
    minHeight: 'var(--lp-vh)', background: '#0f172a',
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
          background: intent === 'cancel' ? '#b91c1c' : '#fff', color: intent === 'cancel' ? '#fff' : '#334155',
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
          ...(intent === 'cancel' ? { borderColor: '#b91c1c', order: 1 } : {}),
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

// ---- Brief interstitial when leaving to the provider -----------------------
const ProviderInterstitial = ({ label, onDone }) => {
  React.useEffect(() => { const t = setTimeout(onDone, 1100); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ minHeight: 'var(--lp-vh)', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Spinner size={20} />
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15, color: '#cbd5e1' }}>{label}</span>
    </div>
  );
};

// ---- "Setting up your space" settle state (NEW) ----------------------------
// Shown on return from a completed checkout while the space is provisioned —
// provisioning is asynchronous but GUARANTEED, so this always resolves into the
// new space's empty Active tab. Distinct from the feed loading indicator.
const SettingUp = ({ spaceName, onDone }) => {
  React.useEffect(() => { const t = setTimeout(onDone, 1900); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      minHeight: 'var(--lp-vh)', background: 'var(--color-canvas)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)',
      padding: '40px 24px', textAlign: 'center',
    }}>
      <Wordmark size={22} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', marginTop: 8 }}>
        <Spinner size={22} light={false} />
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-xl)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>Setting up your circle…</div>
        {spaceName && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, color: 'var(--color-fg-2)' }}>{spaceName} will be ready in a moment.</div>}
      </div>
    </div>
  );
};

// ---- Dormant-space state (NEW) ---------------------------------------------
// One calm full-page state for a space whose funding has lapsed: content +
// members preserved, access frozen, recoverable. Role-conditioned action region.
//   champion + terminal   → Re-fund
//   champion + suspended  → suspended message + contact route (no Re-fund)
//   any non-champion      → "Championed by X" + take-over contact route
const DormantSpace = ({ space, isChampion, championName, dormancy = 'terminal', onRefund }) => {
  const suspended = dormancy === 'suspended';
  let body, action;
  if (isChampion && !suspended) {
    body = 'This circle is asleep. Its funding has lapsed — re-fund it to bring it back for everyone. Your members and history are still here.';
    action = <Button variant="primary" size="lg" onClick={onRefund}>Re-fund this circle</Button>;
  } else if (isChampion && suspended) {
    body = 'This circle is suspended. Get in touch and we\u2019ll help you sort it out.';
    action = (
      <a href={`mailto:${OPERATOR_EMAIL}?subject=${encodeURIComponent('Suspended circle: ' + (space ? space.name : ''))}`} className="lp-textlink" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-accent)',
      }}><Icon name="mail" size={17} color="var(--color-accent)" /> Get in touch</a>
    );
  } else {
    body = `This circle is asleep. It\u2019s championed by ${championName || 'someone else'} — get in touch if you\u2019d like to take it on.`;
    action = (
      <a href={`mailto:${OPERATOR_EMAIL}?subject=${encodeURIComponent('Take over circle: ' + (space ? space.name : ''))}`} className="lp-textlink" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-accent)',
      }}><Icon name="mail" size={17} color="var(--color-accent)" /> Get in touch about taking it on</a>
    );
  }
  return (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{
        maxWidth: 520, margin: '0 auto', minHeight: 'calc(var(--lp-vh) - var(--top-bar-height))',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px 96px', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'var(--color-fg-3)', marginBottom: 16,
        }}>{suspended ? 'Suspended' : 'Asleep'}</div>
        <h1 style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.18,
          letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0,
        }}>{space ? space.name : 'This circle'}</h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.6,
          color: 'var(--color-fg-2)', margin: '14px auto 0', maxWidth: 420,
        }}>{body}</p>
        {!isChampion && (
          <p style={{
            fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-3)',
            margin: '20px 0 0',
          }}>Championed by {championName || 'someone else'}</p>
        )}
        <div style={{ marginTop: 'var(--space-8)' }}>{action}</div>
      </div>
    </main>
  );
};

Object.assign(window, {
  PRICE_PER_SPACE, OPERATOR_EMAIL, FundingPage, Checkout, ManageFunding,
  ProviderInterstitial, SettingUp, DormantSpace,
});
