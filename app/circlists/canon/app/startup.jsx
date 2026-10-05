// ============================================================================
// Circlists — start-up (mobile-readiness delta, 5 Oct).
//
//   CircSplash      — the app posture's splash: the normal mark, still, on the
//                     app canvas (cream), at the size the loading state draws
//                     it, without the moving arc. One splash for both phone
//                     appearance settings. Then the loading state follows it,
//                     then the app. `hold` keeps it at rest for review.
//   CircCantConnect — the servers could not be reached at start-up, on web and
//                     app alike. The load-failure state (FeedError's shape,
//                     app/not-found.jsx) on a full screen of the same canvas:
//                     "This didn't load." and Try again. No second line: the
//                     one FeedError carries names a circle's links, and anything
//                     else would claim to know why. Try again returns to the
//                     loading state, then to the app.
//
// DROPPABLE: main.jsx guards both routes on window, so without this file the
// two routes render nothing new and the app opens as it always has.
// ============================================================================

const StillMark = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Circlists" style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="24" cy="24" r="22.5" fill="var(--color-sage)" />
    <circle cx="24" cy="24" r="15.2" fill="var(--color-accent)" />
    <circle cx="24" cy="24" r="15.875" fill="none" stroke="#ffffff" strokeWidth="1.35" />
  </svg>
);

const SPLASH_MS = 900;
const BOOT_MS = 1500;

const CircSplash = ({ hold = false, onDone }) => {
  const [phase, setPhase] = React.useState('splash');
  React.useEffect(() => {
    if (hold) return;
    if (phase === 'splash') { const t = setTimeout(() => setPhase('loading'), SPLASH_MS); return () => clearTimeout(t); }
    const t = setTimeout(() => onDone && onDone(), BOOT_MS);
    return () => clearTimeout(t);
  }, [phase, hold]);
  if (phase === 'loading') return <AppLoading label="Opening Circlists" />;
  return (
    <div style={{ minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <StillMark size={100} />
    </div>
  );
};

const CircCantConnect = ({ onDone }) => {
  const [retrying, setRetrying] = React.useState(false);
  React.useEffect(() => {
    if (!retrying) return;
    const t = setTimeout(() => onDone && onDone(), BOOT_MS);
    return () => clearTimeout(t);
  }, [retrying]);
  if (retrying) return <AppLoading label="Opening Circlists" />;
  return (
    <div role="status" style={{
      minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '56px 24px', gap: 6,
    }}>
      <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-fg-1)' }}>This didn’t load.</p>
      <button type="button" onClick={() => setRetrying(true)} style={{
        marginTop: 10, background: 'transparent', cursor: 'pointer',
        border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600,
        color: 'var(--color-fg-1)', minHeight: 'var(--tap-target-min)', padding: '0 16px',
      }}>Try again</button>
    </div>
  );
};

Object.assign(window, { CircSplash, CircCantConnect, StillMark });
