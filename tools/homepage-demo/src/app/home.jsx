// ============================================================================
// Circlists — Home body: the circles list at account level.
// ----------------------------------------------------------------------------
// Home is CHROME today, not a shared surface: it holds exactly one thing, the
// circles list, which already exists in the web posture as the rail. Same
// content, different chrome. It lives in its own file so that the day it gains
// content existing nowhere else (a cross-circle view, activity, anything past
// "pick a circle") it becomes a shared surface and its promotion into all three
// postures is a MOVE, not a rewrite. See MOBILE.md.
// ============================================================================

// Each row carries a reason to be looked at, so home is a place rather than a
// picker you pass through. Dormant circles say so instead of counting links.
const circleSummary = (s) => {
  const members = (s.members ? s.members.length : 0) + ' member' + ((s.members || []).length === 1 ? '' : 's');
  if (!s.funded) return 'Dormant · ' + members;
  const unread = (s.items || []).filter(i => !i.read).length;
  return (unread ? unread + ' unread' : 'All read') + ' · ' + members;
};

const homeTile = (name) => (
  <span aria-hidden="true" style={{
    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--color-surface-sunken)', color: 'var(--color-fg-2)',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
  }}>{(name || '?').trim().charAt(0).toUpperCase()}</span>
);

const CirclesHome = ({ spaces = [], onSelect, onCreate }) => (
  <main style={{ flex: 1, width: '100%', padding: '18px 16px 28px' }}>
    <div style={{
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em',
      textTransform: 'uppercase', color: 'var(--color-fg-3)', padding: '0 4px 10px',
    }}>Your circles</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {spaces.map((s) => (
        <button key={s.id} onClick={() => onSelect && onSelect(s.id)} className="circ-appsheet-row" style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
          borderRadius: 'var(--radius-lg)', padding: '13px 14px', minHeight: 64,
          boxShadow: 'var(--shadow-raised)', fontFamily: 'var(--font-sans)',
        }}>
          {homeTile(s.name)}
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontWeight: 600, fontSize: 15.5, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
            <span style={{ display: 'block', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)', marginTop: 3 }}>{circleSummary(s)}</span>
          </span>
          <Icon name="chevron-right" size={18} color="var(--color-fg-3)" />
        </button>
      ))}
    </div>
    <button onClick={onCreate} className="circ-appsheet-row" style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
      background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', padding: '13px 12px', minHeight: 52,
      marginTop: 10, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-accent)',
    }}>
      <span style={{ width: 38, display: 'inline-flex', justifyContent: 'center' }}><Icon name="plus" size={19} color="var(--color-accent)" strokeWidth={2} /></span> New circle
    </button>
  </main>
);

Object.assign(window, { CirclesHome });
