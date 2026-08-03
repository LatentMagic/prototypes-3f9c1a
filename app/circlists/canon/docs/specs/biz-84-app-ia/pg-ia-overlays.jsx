// ============================================================================
// App IA playground — PRESENTATION layer. One content body per destination
// (circles / account / add), five containers to present it in. The whole point:
// the body never changes, only the container, so "is the bottom sheet right?"
// can be answered by A/B rather than argument.
// ============================================================================

const { useState: pgS, useEffect: pgE } = React;
const { Icon: PgIcon, Avatar: PgAvatar, displayName: pgName } = window;

// Mount choreography (app's own pattern): render hidden → double-rAF → shown;
// on close, animate out, then unmount after the transition.
const usePgPresent = (open, onClose) => {
  const [render, setRender] = pgS(open);
  const [shown, setShown] = pgS(false);
  pgE(() => {
    if (open) {
      setRender(true);
      let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    setShown(false);
    const t = setTimeout(() => setRender(false), 240);
    return () => clearTimeout(t);
  }, [open]);
  pgE(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return { render, shown };
};

const pgSheetPad = 'var(--space-3) var(--space-4) var(--space-5)';

// mode: 'sheet' | 'inset' | 'page' | 'chipmenu'
// head: 'grab' | 'title'  (sheet + inset only)
const PgPresent = ({ open, onClose, mode, head = 'grab', title, children }) => {
  const { render, shown } = usePgPresent(open, onClose);
  if (!render) return null;

  const scrim = mode === 'page' ? null : (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 120, background: 'var(--color-scrim)',
      opacity: shown ? 1 : 0, transition: 'opacity var(--duration-slow) ease-in-out',
    }} />
  );

  const base = { position: 'fixed', zIndex: 121, background: 'var(--color-surface)', boxShadow: 'var(--shadow-overlay)', overflowY: 'auto', overscrollBehavior: 'contain' };
  let box, inner = children, showHead = mode === 'sheet' || mode === 'inset';

  if (mode === 'sheet') {
    box = { ...base, left: 0, right: 0, bottom: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: pgSheetPad, maxHeight: '78%',
      transform: shown ? 'translateY(0)' : 'translateY(100%)', transition: 'transform var(--duration-slow) var(--ease-quiet)' };
  } else if (mode === 'inset') {
    box = { ...base, left: 10, right: 10, bottom: 10, borderRadius: 20, padding: pgSheetPad, maxHeight: '76%',
      transform: shown ? 'translateY(0)' : 'translateY(calc(100% + 12px))', transition: 'transform var(--duration-slow) var(--ease-quiet)' };
  } else if (mode === 'chipmenu') {
    box = { ...base, top: 'calc(var(--top-bar-height) + 6px)', left: 12, right: 12, borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-2) var(--space-3) var(--space-3)', maxHeight: '70%', border: '1px solid var(--color-border-1)',
      transformOrigin: 'top center', transform: shown ? 'scale(1)' : 'scale(0.97)', opacity: shown ? 1 : 0,
      transition: 'transform var(--duration-slow) var(--ease-quiet), opacity var(--duration-base) ease-out' };
  } else {
    box = { ...base, inset: 0, background: 'var(--color-canvas)', padding: 0,
      transform: shown ? 'translateX(0)' : 'translateX(100%)', transition: 'transform var(--duration-slow) var(--ease-quiet)' };
    inner = (
      <div style={{ minHeight: '100%', background: 'var(--color-canvas)' }}>
        <header style={{ height: 'var(--top-bar-height)', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-2)', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4, position: 'sticky', top: 0 }}>
          <button onClick={onClose} aria-label="Back" style={{ background: 'transparent', border: 0, padding: 10, cursor: 'pointer', color: 'var(--color-fg-1)', display: 'inline-flex' }}><PgIcon name="arrow-left" size={20} /></button>
          <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>{title}</span>
        </header>
        <div style={{ padding: 'var(--space-4)' }}>{children}</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {scrim}
      <div role="dialog" aria-modal="true" aria-label={title} style={box}>
        {showHead && head === 'grab' && (
          <div aria-hidden="true" style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--color-border-1)', margin: '0 auto var(--space-4)' }} />
        )}
        {showHead && head === 'title' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '2px 0 12px', marginBottom: 4, borderBottom: '1px solid var(--color-border-2)' }}>
            <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>{title}</span>
            <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-accent)', padding: '6px 2px' }}>Done</button>
          </div>
        )}
        {inner}
      </div>
    </React.Fragment>
  );
};

// ---- shared row style -------------------------------------------------------
const pgRow = {
  display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
  background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', padding: '13px 12px', minHeight: 52,
  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15, color: 'var(--color-fg-1)',
};

const pgTile = (name, active) => (
  <span aria-hidden="true" style={{
    width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: active ? 'var(--color-accent)' : 'var(--color-surface-sunken)', color: active ? '#fff' : 'var(--color-fg-2)',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
  }}>{(name || '?').trim().charAt(0).toUpperCase()}</span>
);

const pgEyebrow = (t) => (
  <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)', padding: '0 4px 6px' }}>{t}</div>
);

// ---- BODIES (identical in every presentation) -------------------------------
const PgCirclesBody = ({ circles, currentId, onSelect, showSettings, onSettings, withEyebrow }) => (
  <React.Fragment>
    {withEyebrow && pgEyebrow('Circles')}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {circles.map((c) => {
        const active = c.id === currentId;
        return (
          <button key={c.id} onClick={() => onSelect(c.id)} className="circ-appsheet-row" style={{ ...pgRow, fontWeight: active ? 600 : 500, background: active ? 'var(--color-surface-sunken)' : 'transparent' }}>
            {pgTile(c.name, active)}
            <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
            {active && <PgIcon name="check" size={18} color="var(--color-accent)" />}
          </button>
        );
      })}
    </div>
    <div style={{ height: 1, background: 'var(--color-border-2)', margin: '10px 4px' }} />
    {showSettings && (
      <button onClick={onSettings} className="circ-appsheet-row" style={pgRow}>
        <span style={{ width: 32, display: 'inline-flex', justifyContent: 'center', color: 'var(--color-fg-2)' }}><PgIcon name="settings" size={19} /></span>
        <span style={{ flex: 1 }}>Circle settings</span>
        <PgIcon name="chevron-right" size={17} color="var(--color-fg-3)" />
      </button>
    )}
    <button className="circ-appsheet-row" style={{ ...pgRow, fontWeight: 600, color: 'var(--color-accent)' }}>
      <span style={{ width: 32, display: 'inline-flex', justifyContent: 'center' }}><PgIcon name="plus" size={19} color="var(--color-accent)" strokeWidth={2} /></span> New circle
    </button>
  </React.Fragment>
);

const PgAccountBody = ({ user }) => (
  <React.Fragment>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '2px 4px 14px' }}>
      <PgAvatar name={pgName(user)} size={44} accent />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{pgName(user)}</div>
        <div style={{ fontWeight: 400, fontSize: 13, color: 'var(--color-fg-3)' }}>{user.email}</div>
      </div>
    </div>
    <div style={{ height: 1, background: 'var(--color-border-2)', margin: '0 0 8px' }} />
    <button className="circ-appsheet-row" style={pgRow}><span style={{ color: 'var(--color-fg-2)', display: 'inline-flex' }}><PgIcon name="settings" size={19} /></span> Manage account</button>
    <button className="circ-appsheet-row" style={pgRow}><span style={{ color: 'var(--color-fg-2)', display: 'inline-flex' }}><PgIcon name="logout" size={19} /></span> Sign out</button>
  </React.Fragment>
);

// ---- Home: the account level as a PLACE, not an overlay ---------------------
// Circles listed with a reason to be looked at (unread), so home earns a screen
// rather than being a picker you pass through.
const PgHomeBody = ({ circles, currentId, onSelect, showCurrent }) => (
  <main style={{ flex: 1, padding: '18px 16px 28px' }}>
    {pgEyebrow('Your circles')}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {circles.map((c) => (
        <button key={c.id} onClick={() => onSelect(c.id)} className="circ-appsheet-row" style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
          padding: '13px 14px', minHeight: 64, boxShadow: 'var(--shadow-raised)', fontFamily: 'var(--font-sans)',
        }}>
          {pgTile(c.name, showCurrent && c.id === currentId)}
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontWeight: 600, fontSize: 15.5, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
            <span style={{ display: 'block', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)', marginTop: 3 }}>
              {c.unread ? c.unread + ' unread' : 'All read'} · {c.members} members
            </span>
          </span>
          <PgIcon name="chevron-right" size={18} color="var(--color-fg-3)" />
        </button>
      ))}
    </div>
    <button className="circ-appsheet-row" style={{ ...pgRow, marginTop: 10, fontWeight: 600, color: 'var(--color-accent)' }}>
      <span style={{ width: 32, display: 'inline-flex', justifyContent: 'center' }}><PgIcon name="plus" size={19} color="var(--color-accent)" strokeWidth={2} /></span> New circle
    </button>
  </main>
);

// Add body — `scopeHint` is the lever the user named: does Add state which
// circle it lands in? (The IA question, answered in the content rather than
// the chrome.)
const PgAddBody = ({ circleName, scopeHint }) => (
  <React.Fragment>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 2px 12px' }}>
      <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>Add a link</span>
      {scopeHint && <span style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--color-fg-3)' }}>to {circleName}</span>}
    </div>
    <input readOnly value="https://" aria-label="Link" style={{
      width: '100%', boxSizing: 'border-box', padding: '13px 14px', fontFamily: 'var(--font-mono)', fontSize: 14,
      border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', color: 'var(--color-fg-2)',
    }} />
    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
      <button className="circ-btn-primary" style={{ flex: 1, background: 'var(--color-accent)', color: '#fff', border: 0, borderRadius: 'var(--radius-md)', padding: '13px 16px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Add</button>
    </div>
  </React.Fragment>
);

Object.assign(window, { PgPresent, usePgPresent, PgCirclesBody, PgAccountBody, PgAddBody, PgHomeBody, pgRow, pgTile, pgEyebrow });
