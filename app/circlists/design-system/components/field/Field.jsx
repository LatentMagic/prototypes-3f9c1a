// Lifted from the Circlists prototype, app/primitives.jsx (Field).
// Input text is 16px (governance text-input floor). Errors sit inline, under the field.
export function Field({ label, hint, error, mono = false, suffix, ...rest }) {
  const id = rest.id || rest.name;
  const xPath = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', marginBottom: 6, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        <input id={id} {...rest} aria-invalid={error ? true : undefined}
          style={{
            width: '100%', boxSizing: 'border-box',
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', fontWeight: mono ? 500 : 400, fontSize: 16,
            color: 'var(--color-fg-1)',
            border: '1px solid ' + (error ? 'var(--color-destructive)' : 'var(--color-border-1)'),
            borderRadius: 'var(--radius-md)', padding: '12px 14px', minHeight: 44, background: 'var(--color-surface)',
            transition: 'border-color var(--duration-base)', ...(rest.style || {}),
          }} />
        {suffix}
      </div>
      {error && (
        <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 7, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4, color: 'var(--color-destructive)' }}>
          <span style={{ marginTop: 1, flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ display: 'block' }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: xPath }}></svg>
          </span>
          <span>{error}</span>
        </div>
      )}
      {hint && !error && (
        <div style={{ marginTop: 7, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-3)' }}>{hint}</div>
      )}
    </div>
  );
}
