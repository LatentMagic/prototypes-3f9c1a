// ============================================================================
// Per-person pricing candidate — assembly. Holds the checkout offer that
// subscriptions.jsx reads, and mounts the review switcher. Loads after the app
// files it re-publishes over and before app/main.jsx.
// ============================================================================
const ppCheckoutOffer = () => {
  const st = window.CircPP.get();
  const p = PP_PLANS[st.plan];
  const tk = window.__ppTkActive || null;
  const title = 'Circlists \u00b7 ' + p.label + ' plan';
  const later = 'Then ' + p.full + ' per ' + p.unit + ' from ' + ppNextDate(p.unit) + '.';
  if (tk && tk.kind === 'lapsed') {
    return { title, price: p.full, per: 'due today', note: 'Restarts your subscription and wakes all your circles. ' + later, button: 'Pay and restart' };
  }
  if (st.returning && !st.subscribed) {
    return { title, price: p.full, per: 'due today',
      note: 'You have subscribed before, so there is no free month. ' + later,
      button: tk ? 'Pay and take over' : 'Pay and create circle' };
  }
  return {
    title,
    price: '\u00a30.00', per: 'due today',
    note: 'Free for 30 days. Then ' + p.full + ' per ' + p.unit + ' from ' + ppChargeDate() + '. We email a reminder first.',
    button: 'Start free month',
  };
};
window.ppCheckoutOffer = ppCheckoutOffer;

// Review switcher: a labelled chip, tap to open. Steers the review only; not product.
const PpLabel = () => {
  const st = usePP();
  if (!st.label) return null;
  return <div data-pp-label style={{ position: 'fixed', top: 1, left: '50%', transform: 'translateX(-50%)', zIndex: 99999, pointerEvents: 'none', whiteSpace: 'nowrap',
    padding: '1px 8px', borderRadius: 999, background: 'rgba(20,20,30,0.88)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.03em' }}>{st.label}</div>;
};
const PpSwitcher = () => {
  const st = usePP();
  const [open, setOpen] = React.useState(false);
  if (st.label) return null;
  const opts = [['cards', 'Two plan cards'], ['toggle', 'Toggle, one price'], ['lead', 'One plan, quiet link']];
  const seg = (items, val, on) => (
    <div role="radiogroup" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {items.map(([id, label]) => (
        <button key={String(id)} type="button" role="radio" aria-checked={val === id} onClick={() => on(id)} style={{
          minHeight: 40, padding: '0 12px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
          border: '1px solid ' + (val === id ? 'var(--color-accent)' : 'var(--color-border-2)'),
          background: val === id ? 'var(--color-accent-soft)' : 'var(--color-surface)', color: 'var(--color-fg-1)',
        }}>{label}</button>
      ))}
    </div>
  );
  const lab = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--color-fg-2)', margin: '10px 0 6px' };
  return (
    <div data-pp-switcher style={{ position: 'fixed', right: 10, bottom: 'calc(10px + env(safe-area-inset-bottom))', zIndex: 9999, maxWidth: 'calc(100vw - 20px)' }}>
      {open ? (
        <div style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-2)', borderRadius: 14, padding: '10px 14px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', width: 320, maxWidth: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13 }}>Pricing review</span>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} style={{ minWidth: 40, minHeight: 40, border: 0, background: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--color-fg-2)' }}>{'×'}</button>
          </div>
          <div style={lab}>PLAN PICK LAYOUT</div>
          {seg(opts, st.option, (id) => window.CircPP.set({ option: id }))}
          <div style={lab}>ACCOUNT</div>
          {seg([['none', 'Not subscribed'], ['subscribed', 'Subscribed'], ['returning', 'Subscribed before']], ppAccount(st), (v) => window.CircPP.set(PP_ACCOUNT_PATCH[v]))}
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} style={{
          minHeight: 40, padding: '0 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12,
          background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-2)', color: 'var(--color-fg-1)', boxShadow: '0 4px 12px rgba(0,0,0,0.14)',
        }}>Pricing review {'·'} {{ none: 'not subscribed', subscribed: 'subscribed', returning: 'subscribed before' }[ppAccount(st)]}</button>
      )}
    </div>
  );
};
(() => { const el = document.createElement('div'); document.body.appendChild(el); ReactDOM.createRoot(el).render(<><PpSwitcher /><PpLabel /></>); })();
