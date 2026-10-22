// Lifted from the Circlists prototype, app/primitives.jsx (LogoMark).
// Brand pack §2: opaque sage halo r22.5, emerald disc r14.25, white ring r14.925 / 1.35.
export function LogoMark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Circlists" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="24" cy="24" r="22.5" fill="var(--color-sage, #8BBFAD)"></circle>
      <circle cx="24" cy="24" r="14.25" fill="var(--color-accent, #047857)"></circle>
      <circle cx="24" cy="24" r="14.925" fill="none" stroke="#ffffff" strokeWidth={1.35}></circle>
    </svg>
  );
}
