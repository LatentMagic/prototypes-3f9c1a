// ============================================================================
// Circlists — public-preview gate. Shown instead of routing to payment
// (New circle) or the real account surface (account control) when this build
// is embedded as an unauthenticated, click-around preview.
//
// Same mount/animate/scrim logic as AddReveal (feed.jsx): mobile gets a
// bottom sheet + scrim fade, desktop gets a borderless-scrim fixed card in
// the bottom-right, both easing on --ease-quiet. Copy is identical regardless
// of which control triggered it.
//
// PRIOR COPY (pre-2026-07-17 launch-copy pass — revert to this if the
// launch-copy framing is ever rolled back):
//   aria-label: "Sign up"
//   title:      "Sign up to continue."
//   body:       "This is a preview of Circlists. Everything past this point
//                needs an account."
//   buttons:    "Not now" (secondary) + "Sign up" (primary)
// ============================================================================

const GateOverlay = ({ open, isMobile, onClose }) => {
  const invokerRef = React.useRef(null);

  // Mount-transition: stay mounted through the slide-out before unmounting
  // (mobile sheet) — identical timing to AddReveal.
  const [render, setRender] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setRender(true);
      let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    setShown(false);
    const t = setTimeout(() => setRender(false), 240);
    return () => clearTimeout(t);
  }, [open, isMobile]);

  React.useEffect(() => {
    if (open) invokerRef.current = document.activeElement;
    else if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!render) return null;

  const surface = isMobile
    ? {
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 121,
        background: 'var(--color-surface)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        padding: 'var(--space-5) var(--space-5) calc(var(--space-5) + env(safe-area-inset-bottom, 0px))',
        boxShadow: 'var(--shadow-overlay)',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      }
    : {
        position: 'fixed', right: 32, bottom: 32, width: 380, zIndex: 121,
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-1)',
        padding: 'var(--space-5)', boxShadow: 'var(--shadow-overlay)',
        opacity: shown ? 1 : 0,
        transition: 'opacity var(--duration-base) var(--ease-quiet)',
      };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 120,
        background: 'var(--color-scrim)',
        opacity: shown ? 1 : 0,
        transition: 'opacity var(--duration-slow) ease-in-out',
      }} />
      <div role="dialog" aria-label="This is a preview" style={surface}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
          <h2 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-lg)',
            lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: 0,
          }}>This is a preview</h2>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'transparent', border: 0, padding: 6, margin: -6, cursor: 'pointer',
            color: 'var(--color-fg-2)', display: 'inline-flex', flexShrink: 0,
          }}><Icon name="x" size={18} /></button>
        </div>
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.55,
          color: 'var(--color-fg-2)', margin: '0 0 var(--space-4)',
        }}>This is a preview of Circlists. It isn't open yet — full access comes at launch.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={onClose}>Got it</Button>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { GateOverlay });
