// Lifted from the Circlists prototype, app/primitives.jsx (Avatar + initialsOf).
export function initialsOf(name) {
  if (!name) return '··';
  const parts = name.trim().replace(/\.$/, '').split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, size = 34, accent = false }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: accent ? 'var(--color-accent)' : 'var(--color-surface-sunken)',
      color: accent ? '#fff' : 'var(--color-fg-1)',
      border: accent ? 'none' : '1px solid var(--color-border-1)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.36, letterSpacing: '0.01em',
    }}>{initialsOf(name)}</span>
  );
}
