// ============================================================================
// LatentPulse — primitives. Icons (inline), Button, Field, Logo, Spinner.
// Pulse Modernist: one accent, calm neutrals, weight-and-size hierarchy.
// ============================================================================

// ---- Inline icon set (24px viewBox, 1.5px stroke, currentColor) ------------
const LP_ICONS = {
  plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
  trash: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>',
  'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
  'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
  menu: '<line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="14" y2="17"></line>',
  'menu-open': '<line x1="4" y1="7" x2="20" y2="7"></line><line x1="10" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line><polyline points="7 9 4 12 7 15"></polyline>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"></polyline>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"></polyline>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
  link: '<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"></path><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"></path>',
  settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 6L2 7"></path>',
  google: '__GOOGLE__',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
  sparkle: '<path d="M12 3v6"></path><path d="M12 15v6"></path><path d="M3 12h6"></path><path d="M15 12h6"></path>',
};

const Icon = ({ name, size = 20, color = 'currentColor', style = {}, strokeWidth = 1.5 }) => {
  // Google mark renders in brand colours; everything else is monoline currentColor.
  if (name === 'google') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', ...style }} aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
      </svg>
    );
  }
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', ...style }} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: LP_ICONS[name] || '' }}
    />
  );
};

// ---- Spinner ---------------------------------------------------------------
const Spinner = ({ size = 14, light = true }) => (
  <span className="lp-spin" style={{
    width: size, height: size,
    borderColor: light ? 'rgba(255,255,255,0.4)' : 'rgba(10,10,10,0.18)',
    borderTopColor: light ? '#fff' : 'var(--color-fg-1)',
  }} aria-hidden="true" />
);

// ---- Button ----------------------------------------------------------------
// variants: primary (accent) | secondary (neutral) | tertiary (text) | destructive
const Button = React.forwardRef((props, ref) => {
  const {
    variant = 'primary', loading = false, icon, children, full = false, size = 'md',
    type = 'button', onClick, disabled, style, title, autoFocus, name,
  } = props;
  const ariaLabel = props['aria-label'];
  const ariaExpanded = props['aria-expanded'];
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '8px 12px' : '11px 18px';
  const minH = size === 'lg' ? 52 : size === 'sm' ? 36 : 44;
  const base = {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size === 'lg' ? 16 : 14,
    lineHeight: 1, padding: pad, borderRadius: 'var(--radius-md)', border: 0,
    minHeight: minH, width: full ? '100%' : 'auto',
    cursor: loading || disabled ? 'default' : 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'background var(--duration-base) var(--ease-quiet), opacity var(--duration-base)',
    opacity: disabled && !loading ? 0.45 : 1,
    whiteSpace: 'nowrap',
  };
  const variants = {
    primary: { background: 'var(--color-accent)', color: '#fff' },
    secondary: { background: 'var(--color-surface)', color: 'var(--color-fg-1)', border: '1px solid var(--color-border-1)', fontWeight: 500 },
    tertiary: { background: 'transparent', color: 'var(--color-fg-1)', fontWeight: 500, padding: size === 'sm' ? '8px 6px' : '11px 6px', minHeight: minH },
    destructive: { background: 'var(--color-destructive)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--color-fg-2)', fontWeight: 500, border: '1px solid var(--color-border-1)' },
  };
  const cls = 'lp-btn lp-btn-' + variant;
  return (
    <button
      ref={ref} type={type} onClick={onClick} disabled={loading || disabled}
      title={title} autoFocus={autoFocus} name={name}
      aria-label={ariaLabel} aria-expanded={ariaExpanded}
      className={cls}
      style={{ ...base, ...variants[variant], ...(style || {}) }}>
      {loading && <Spinner light={variant === 'primary' || variant === 'destructive'} />}
      {!loading && icon}
      {children && <span>{children}</span>}
    </button>
  );
});

// ---- Field (label + input + inline error) ----------------------------------
const Field = React.forwardRef(({ label, hint, error, mono = false, suffix, ...rest }, ref) => {
  const id = rest.id || rest.name;
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      {label && (
        <label htmlFor={id} style={{
          display: 'block', marginBottom: 6,
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13,
          color: 'var(--color-fg-2)',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          ref={ref} id={id} {...rest}
          style={{
            width: '100%', boxSizing: 'border-box',
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
            fontWeight: mono ? 500 : 400, fontSize: 16,
            color: 'var(--color-fg-1)',
            border: '1px solid ' + (error ? 'var(--color-destructive)' : 'var(--color-border-1)'),
            borderRadius: 'var(--radius-md)', padding: '12px 14px',
            minHeight: 44, background: 'var(--color-surface)',
            transition: 'border-color var(--duration-base)',
            ...(rest.style || {}),
          }}
        />
        {suffix}
      </div>
      {error && (
        <div role="alert" style={{
          display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 7,
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4,
          color: 'var(--color-destructive)',
        }}>
          <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="x" size={14} /></span>
          <span>{error}</span>
        </div>
      )}
      {hint && !error && (
        <div style={{
          marginTop: 7, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13,
          lineHeight: 1.4, color: 'var(--color-fg-3)',
        }}>{hint}</div>
      )}
    </div>
  );
});

// ---- Logo mark — the LatentPulse "LP" box (matches the tab favicon) ----------
const LogoMark = ({ size = 24 }) => (
  <span style={{
    width: size, height: size, borderRadius: Math.max(4, Math.round(size * 0.16)),
    background: 'var(--color-accent)', flexShrink: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-sans)', fontWeight: 700, color: '#fff',
    fontSize: Math.round(size * 0.44), letterSpacing: '-0.02em', lineHeight: 1,
  }}>LP</span>
);

const Wordmark = ({ size = 16, mark = true }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    {mark && <LogoMark size={size * 1.4} />}
    <span style={{
      fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: size,
      letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
    }}>
      Latent<span style={{ color: 'var(--color-accent)' }}>Pulse</span>
    </span>
  </span>
);

// ---- Avatar (initials) -----------------------------------------------------
function initialsOf(name) {
  if (!name) return '··';
  const parts = name.trim().replace(/\.$/, '').split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
const Avatar = ({ name, size = 34, accent = false }) => (
  <span style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: accent ? 'var(--color-accent)' : 'var(--color-surface-sunken)',
    color: accent ? '#fff' : 'var(--color-fg-1)',
    border: accent ? 'none' : '1px solid var(--color-border-1)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.36,
    letterSpacing: '0.01em',
  }}>{initialsOf(name)}</span>
);

Object.assign(window, { Icon, Spinner, Button, Field, LogoMark, Wordmark, Avatar, initialsOf });
