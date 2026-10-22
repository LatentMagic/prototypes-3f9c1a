// Lifted from the Circlists prototype, app/primitives.jsx (Button + Spinner, here named Ring).
// Hover/press states live in components/components.css (.circ-btn-*).
// Working state (`loading`): from the press until the result the button shows a ring and
// cannot be pressed again. It stays focusable (aria-disabled, not disabled) so focus is not
// dumped to the page, and announces itself busy. The brand spinner never sits in a button.
// Ring: the plain in-button ring. Not the brand spinner (assets/brand/motion/circlists-spinner.svg).
export function Ring({ size = 14, light = true }) {
  return (
    <span className="circ-spin" aria-hidden="true" style={{
      width: size, height: size,
      borderColor: light ? 'rgba(255,255,255,0.4)' : 'rgba(10,10,10,0.18)',
      borderTopColor: light ? '#fff' : 'var(--color-fg-1)',
    }}></span>
  );
}

export function Button({
  variant = 'primary', loading = false, icon, children, full = false, size = 'md',
  type = 'button', onClick, disabled, style, title, autoFocus, name, ...rest
}) {
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '8px 12px' : '11px 18px';
  const minH = size === 'lg' ? 52 : size === 'sm' ? 36 : 44;
  const base = {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size === 'lg' ? 16 : 14,
    lineHeight: 1, padding: pad, borderRadius: 'var(--radius-md)', border: 0,
    minHeight: minH, width: full ? '100%' : 'auto',
    cursor: loading || disabled ? 'default' : 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'background var(--duration-base) var(--ease-quiet)',
    opacity: disabled && !loading ? 0.45 : 1, whiteSpace: 'nowrap',
  };
  const variants = {
    primary: { background: 'var(--color-accent)', color: '#fff' },
    secondary: { background: 'var(--color-surface)', color: 'var(--color-fg-1)', border: '1px solid var(--color-border-1)', fontWeight: 500 },
    tertiary: { background: 'transparent', color: 'var(--color-fg-1)', fontWeight: 500, padding: size === 'sm' ? '8px 6px' : '11px 6px', minHeight: minH },
    'destructive-secondary': { background: 'var(--color-surface)', color: 'var(--color-destructive)', border: '1px solid var(--color-border-1)', fontWeight: 500 },
    destructive: { background: 'var(--color-destructive)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--color-fg-2)', fontWeight: 500, border: '1px solid var(--color-border-1)' },
  };
  return (
    <button type={type} disabled={disabled && !loading} title={title} autoFocus={autoFocus} name={name}
      onClick={e => { if (loading) { e.preventDefault(); e.stopPropagation(); return; } onClick && onClick(e); }}
      aria-disabled={loading || undefined} aria-busy={loading || undefined}
      aria-label={rest['aria-label']} aria-expanded={rest['aria-expanded']} aria-haspopup={rest['aria-haspopup']} aria-controls={rest['aria-controls']}
      className={'circ-btn circ-btn-' + variant}
      style={{ ...base, ...variants[variant], ...(style || {}) }}>
      {loading && <Ring light={variant === 'primary' || variant === 'destructive'} />}
      {!loading && icon}
      {children && <span>{children}</span>}
    </button>
  );
}

/** @deprecated Use Ring. */
export const Spinner = Ring;
