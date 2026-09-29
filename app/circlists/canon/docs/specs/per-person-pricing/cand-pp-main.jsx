// ============================================================================
// Per-person pricing candidate — assembly. Extends the ONE window.CircCandidate
// handle (talk-main.jsx already publishes it) with the two hooks the create form
// and the checkout read, and mounts the review switcher. Loads after the app
// files it re-publishes over and before app/main.jsx.
// ============================================================================
const PpCand = window.CircCandidate = window.CircCandidate || {};
PpCand.createForm = () => {
  const sub = window.CircPP.get().subscribed;
  return {
    intro: sub ? 'A shared list for up to 10 people. It runs on your plan; everyone joins free.'
               : 'A shared list for up to 10 people. Everyone joins free.',
    cta: sub ? 'Create circle' : null,
  };
};
PpCand.checkoutOffer = () => {
  const p = PP_PLANS[window.CircPP.get().plan];
  return {
    title: 'Circlists · ' + p.label + ' plan',
    price: '£0.00', per: 'due today',
    note: 'Free for 30 days. Then ' + p.full + ' per ' + p.unit + ' from ' + ppChargeDate() + '. We email a reminder first.',
    button: 'Start free month',
  };
};

// Review switcher: a labelled chip, tap to open. Steers the review only; not product.
const PpSwitcher = () => {
  const st = usePP();
  const [open, setOpen] = React.useState(false);
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
          {seg([[false, 'Not subscribed'], [true, 'Subscribed']], st.subscribed, (v) => window.CircPP.set({ subscribed: v }))}
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} style={{
          minHeight: 40, padding: '0 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12,
          background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-2)', color: 'var(--color-fg-1)', boxShadow: '0 4px 12px rgba(0,0,0,0.14)',
        }}>Pricing review {'·'} {st.subscribed ? 'subscribed' : 'not subscribed'}</button>
      )}
    </div>
  );
};
(() => { const el = document.createElement('div'); document.body.appendChild(el); ReactDOM.createRoot(el).render(<PpSwitcher />); })();
