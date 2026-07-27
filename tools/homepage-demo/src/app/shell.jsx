// ============================================================================
// Circlists — App shell. Persistent chrome on every authenticated surface.
// Desktop: left space-switcher rail. Mobile: switcher behind a menu trigger.
// Top bar carries space name + invite + members + avatar→user menu.
// ============================================================================

// ---- Rail contents (shared by desktop rail + mobile drawer) ----------------
// The account control lives at the FOOT of the rail; its menu opens upward.
const RailBody = ({ spaces, currentId, onSelect, onCreate, user, onClose, onManageAccount, onSignOut, onAccountGate }) => {
  const [acctOpen, setAcctOpen] = React.useState(false);
  const acctBtnRef = React.useRef(null);
  return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px 20px' }}>
      <PulseLockup size={20} />
    </div>
    <div style={{
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11,
      letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)',
      padding: '0 14px 8px',
    }}>Circles</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {spaces.map((s) => {
        const active = s.id === currentId;
        return (
          <button key={s.id} onClick={() => { onSelect(s.id); onClose && onClose(); }} style={{
            position: 'relative', textAlign: 'left', cursor: 'pointer',
            background: active ? 'var(--color-surface)' : 'transparent', border: 0,
            padding: '11px 12px 11px 14px', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)', fontWeight: active ? 600 : 500, fontSize: 14,
            color: 'var(--color-fg-1)', minHeight: 44,
            boxShadow: active ? 'var(--shadow-raised)' : 'none',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {active && <span style={{
              position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 3,
              background: 'var(--color-accent)',
            }} />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
          </button>
        );
      })}
    </div>
    <button onClick={() => { onCreate(); onClose && onClose(); }} style={{
      marginTop: 8, textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 0,
      padding: '11px 12px 11px 14px', borderRadius: 'var(--radius-md)', minHeight: 44,
      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <Icon name="plus" size={16} /> New circle
    </button>
    {spaces.length === 0 && (
      <p style={{
        margin: 0, padding: '2px 14px 0',
        fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5,
        color: 'var(--color-fg-3)',
      }}>Your circles show up here.</p>
    )}
    <div style={{ flex: 1 }} />
    <div style={{ position: 'relative', borderTop: '1px solid var(--color-border-2)', marginTop: 12, paddingTop: 8 }}>
      <button ref={acctBtnRef} onClick={() => { if (onAccountGate) { onClose && onClose(); onAccountGate(); return; } setAcctOpen(v => !v); }} aria-haspopup="menu" aria-expanded={acctOpen} className="circ-railacct" style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', cursor: 'pointer',
        background: 'transparent', border: 0, padding: '8px', borderRadius: 'var(--radius-md)', minHeight: 44,
      }}>
        <Avatar name={displayName(user)} size={30} accent />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName(user)}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12, color: 'var(--color-fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
        </div>
        <Icon name="chevron-down" size={14} color="var(--color-fg-3)" style={{ flexShrink: 0, transform: acctOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </button>
      {acctOpen && (
        <UserMenu user={user} openUp stretch anchorRef={acctBtnRef}
          onManageAccount={() => { onClose && onClose(); onManageAccount(); }}
          onSignOut={() => { onClose && onClose(); onSignOut(); }}
          onClose={() => setAcctOpen(false)} />
      )}
    </div>
  </div>
  );
};

// ---- User menu (avatar dropdown) -------------------------------------------
const UserMenu = ({ user, subscribed, onManageAccount, onManageSubscription, onSignOut, onClose, anchorRight, openUp, stretch, anchorRef }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    // Ignore mousedowns on the toggle button itself — it runs its own open/close
    // logic on click. Without this, the outside-mousedown handler closes the menu
    // first, then the button's click (fired right after on the same press) flips
    // state again and the menu instantly reopens.
    const onDown = (e) => {
      if (anchorRef && anchorRef.current && anchorRef.current.contains(e.target)) return;
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [onClose]);
  const Item = ({ icon, label, onClick, danger }) => (
    <button onClick={() => { onClose(); onClick(); }} className="circ-menuitem" style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
      background: 'transparent', border: 0, cursor: 'pointer', minHeight: 44,
      padding: '11px 14px', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
      color: danger ? 'var(--color-fg-1)' : 'var(--color-fg-1)',
    }}>
      <span style={{ color: 'var(--color-fg-2)', display: 'inline-flex' }}><Icon name={icon} size={17} /></span>
      {label}
    </button>
  );
  return (
    <div ref={ref} role="menu" style={{
      position: 'absolute', zIndex: 70,
      ...(openUp ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' }),
      ...(stretch ? { left: 0, right: 0 } : { right: anchorRight ? 0 : 'auto' }),
      minWidth: stretch ? 0 : 240, background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)', padding: 6,
    }} className="circ-anim-fade">
      <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid var(--color-border-2)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={displayName(user)} size={34} accent />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>{displayName(user)}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12, color: 'var(--color-fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
        </div>
      </div>
      <Item icon="settings" label="Manage account" onClick={onManageAccount} />
      <div style={{ height: 1, background: 'var(--color-border-2)', margin: '6px 8px' }} />
      <Item icon="logout" label="Sign out" onClick={onSignOut} />
    </div>
  );
};

// ---- Top bar ---------------------------------------------------------------
// The space's own header: space name, with a ⚙ Space settings affordance below
// that opens the members/settings surface. No account identity lives here — that
// moved to the foot of the rail. With no space, the name slot is absent entirely.
const TopBar = ({ isMobile, space, showMembers = true, onMenu, onMembers, subView = null, menuOpen = false }) => {
  // A sub-view (settings/account) replaces the leading slot with a back arrow +
  // section title, and hides the gear (it brought you here — showing it again is
  // redundant). The space feed shows the hamburger/space name + gear.
  const topbarNav = !!subView;
  const hasLeading = topbarNav || isMobile;
  return (
    <header style={{
      height: 'var(--top-bar-height)', background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border-2)', display: 'flex', alignItems: 'center',
      padding: '0 16px 0 ' + (hasLeading ? '8px' : '20px'), gap: 10,
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {topbarNav ? (
        <button onClick={subView.onBack} aria-label="Back" style={{
          background: 'transparent', border: 0, padding: 10, margin: '0 -2px', cursor: 'pointer',
          color: 'var(--color-fg-1)', display: 'inline-flex',
        }}><Icon name="arrow-left" size={20} /></button>
      ) : isMobile ? (
        <button onClick={onMenu} aria-label={menuOpen ? 'Close circles menu' : 'Circles menu'} aria-expanded={menuOpen} style={{
          background: 'transparent', border: 0, padding: 10, margin: '0 -2px', cursor: 'pointer',
          color: 'var(--color-fg-1)', display: 'inline-flex',
        }}><Icon name={menuOpen ? 'menu-open' : 'menu'} size={20} /></button>
      ) : null}
      {topbarNav ? (
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{subView.title}</span>
        </div>
      ) : space ? (
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{space.name}</span>
        </div>
      ) : <div style={{ flex: 1 }} />}

      {!topbarNav && space && showMembers && (
        <button onClick={onMembers} className="circ-topaction" aria-label="Circle settings" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent',
          border: '1px solid var(--color-border-1)', cursor: 'pointer', padding: '8px 12px',
          borderRadius: 'var(--radius-md)', minHeight: 40,
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-1)',
        }}>
          <Icon name="settings" size={17} />
          {!isMobile && <span>Circle settings</span>}
        </button>
      )}
    </header>
  );
};

// ---- Tabs (Active / Read) --------------------------------------------------
const Tabs = ({ active, onChange }) => {
  const items = [
    { id: 'active', label: 'Active' },
    { id: 'read', label: 'Read' },
  ];
  return (
    <div style={{
      background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-2)',
      padding: '0 16px', display: 'flex', gap: 4,
      position: 'sticky', top: 'var(--top-bar-height)', zIndex: 49,
    }}>
      {items.map((t) => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} aria-current={on} style={{
            background: 'transparent', border: 0, padding: '15px 14px', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: on ? 600 : 500, fontSize: 14,
            color: on ? 'var(--color-accent)' : 'var(--color-fg-2)',
            borderBottom: '2px solid ' + (on ? 'var(--color-accent)' : 'transparent'),
            marginBottom: -1, transition: 'color var(--duration-base), border-color var(--duration-base)',
            display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 48,
          }}>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ---- Mobile drawer ---------------------------------------------------------
const MobileDrawer = ({ open, ...rail }) => {
  // Slides in/out from the left, below the top bar so the toggle that opened it
  // stays visible and doubles as the close control. Same easing as the Add sheet.
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
  }, [open]);
  if (!render) return null;
  return (
    <>
      <div onClick={rail.onClose} style={{
        position: 'fixed', top: 'var(--top-bar-height)', left: 0, right: 0, bottom: 0, zIndex: 110,
        background: 'var(--color-scrim)', opacity: shown ? 1 : 0,
        transition: 'opacity var(--duration-slow) ease-in-out',
      }} />
      <aside style={{
        position: 'fixed', top: 'var(--top-bar-height)', left: 0, bottom: 0, width: 272, zIndex: 111,
        background: 'var(--color-surface-sunken)', borderRight: '1px solid var(--color-border-2)',
        padding: '20px 12px',
        transform: shown ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      }}>
        <RailBody {...rail} />
      </aside>
    </>
  );
};

// ---- AppShell --------------------------------------------------------------
const AppShell = ({ isMobile, user, spaces, currentId, space, showMembers = true,
                    onSelectSpace, onCreateSpace, onMembers,
                    onManageAccount, onSignOut, onAccountGate, subView = null, children }) => {
  const [drawer, setDrawer] = React.useState(false);
  const rail = {
    spaces, currentId, onSelect: onSelectSpace, onCreate: onCreateSpace, user,
    onManageAccount, onSignOut, onAccountGate,
  };
  return (
    <div style={{ display: 'flex', minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)' }}>
      {!isMobile && (
        <aside style={{
          width: 'var(--rail-width)', flexShrink: 0, background: 'var(--color-surface-sunken)',
          borderRight: '1px solid var(--color-border-2)', padding: '20px 12px',
          position: 'sticky', top: 0, height: 'var(--circ-vh)',
        }}>
          <RailBody {...rail} />
        </aside>
      )}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          isMobile={isMobile} space={space} showMembers={showMembers}
          onMenu={() => setDrawer(v => !v)} onMembers={onMembers}
          subView={subView} menuOpen={drawer}
        />
        {children}
      </div>
      {isMobile && <MobileDrawer open={drawer} {...rail} onClose={() => setDrawer(false)} />}
    </div>
  );
};

Object.assign(window, { AppShell, TopBar, Tabs, RailBody, UserMenu });
