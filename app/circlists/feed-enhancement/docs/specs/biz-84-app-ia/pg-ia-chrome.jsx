// ============================================================================
// App IA playground — CHROME layer. Top bar, bottom bar and in-content circle
// header, all composed from the merged config so one phone renders any option.
// ============================================================================

const { Icon: PgcIcon, Avatar: PgcAvatar, displayName: pgcName, Wordmark: PgcWordmark } = window;

// ---- Home top bar (account level) ------------------------------------------
// The app's name, because this screen belongs to no circle. Account hangs off
// the avatar rather than a bar slot — account level is already where you are.
const PgHomeTopBar = ({ user, onAccount }) => (
  <header style={{
    height: 'var(--top-bar-height)', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-2)',
    display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px 0 16px', position: 'sticky', top: 0, zIndex: 50,
  }}>
    <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>Circlists</span>
    <button onClick={onAccount} aria-label="Account" className="circ-topaction" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 0,
      cursor: 'pointer', width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
    }}><PgcAvatar name={pgcName(user)} size={29} /></button>
  </header>
);

// ---- Top bar ---------------------------------------------------------------
// variant: 'plain' (name only) | 'chip' (tappable circle chip that opens the
// switcher) | 'back' (chevron up to home + name). `gear` adds settings at right.
const PgTopBar = ({ circle, variant, gear, onChip, onBack, onSettings }) => (
  <header style={{
    height: 'var(--top-bar-height)', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-2)',
    display: 'flex', alignItems: 'center', gap: 8, padding: variant === 'plain' ? '0 16px' : variant === 'back' ? '0 8px' : '0 8px 0 16px',
    position: 'sticky', top: 0, zIndex: 50,
  }}>
    {variant === 'back' && (
      <button onClick={onBack} className="circ-topaction" style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 0, cursor: 'pointer',
        height: 40, padding: '0 10px 0 6px', borderRadius: 'var(--radius-md)', color: 'var(--color-fg-2)', flexShrink: 0,
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14.5,
      }}><PgcIcon name="arrow-left" size={19} /> Home</button>
    )}
    {variant === 'chip' ? (
      <button onClick={onChip} className="circ-appsheet-row" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 0, cursor: 'pointer',
        padding: '7px 10px 7px 8px', margin: '0 -8px', borderRadius: 'var(--radius-md)', flex: 1, minWidth: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{circle.name}</span>
        <PgcIcon name="chevron-down" size={17} color="var(--color-fg-3)" />
      </button>
    ) : (
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{circle.name}</span>
    )}
    {gear && (
      <button onClick={onSettings} className="circ-topaction" aria-label="Circle settings" style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 0,
        cursor: 'pointer', width: 40, height: 40, borderRadius: 'var(--radius-md)', color: 'var(--color-fg-1)', flexShrink: 0,
      }}><PgcIcon name="settings" size={20} /></button>
    )}
  </header>
);

// ---- In-content circle header (Scope split) --------------------------------
// Circle-local actions sit in the same scope as the content they act on.
const PgCircleHeader = ({ circle, showAdd, showSettings, onAdd, onSettings }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 12px',
    background: 'var(--color-canvas)', borderBottom: '1px solid var(--color-border-2)', position: 'sticky', top: 'var(--top-bar-height)', zIndex: 30,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{circle.name}</div>
      <div style={{ fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{circle.members} members</div>
    </div>
    {showSettings && (
      <button onClick={onSettings} className="circ-topaction" aria-label="Circle settings" style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--color-border-1)',
        cursor: 'pointer', width: 42, height: 42, borderRadius: 'var(--radius-md)', color: 'var(--color-fg-1)', flexShrink: 0,
      }}><PgcIcon name="settings" size={19} /></button>
    )}
    {showAdd && (
      <button onClick={onAdd} className="circ-btn-primary" style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--color-accent)', color: '#fff', border: 0,
        borderRadius: 'var(--radius-md)', padding: '0 16px', height: 42, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14.5, cursor: 'pointer', flexShrink: 0,
      }}><PgcIcon name="plus" size={18} strokeWidth={2} color="#fff" /> Add</button>
    )}
  </div>
);

// ---- Bottom bar ------------------------------------------------------------
const PgNavItem = ({ icon, label, active, avatarName, onClick }) => (
  <button onClick={onClick} aria-label={label} aria-current={active ? 'page' : undefined} className="circ-appnav-item" style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
    background: 'transparent', border: 0, cursor: 'pointer', minHeight: 54, padding: '7px 4px',
  }}>
    {avatarName != null ? <PgcAvatar name={avatarName} size={26} accent={active} />
      : <PgcIcon name={icon} size={22} color={active ? 'var(--color-accent)' : 'var(--color-fg-2)'} strokeWidth={active ? 2 : 1.5} />}
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: active ? 600 : 500, fontSize: 10.5, letterSpacing: '0.01em', color: active ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{label}</span>
  </button>
);

// The scope problem in the bar is a LABELLING problem: a gear labelled
// "Settings" in permanent navigation reads as the app's settings. A slot that
// carries the circle's own tile and name cannot — it says whose settings it is.
const PgCircleNavItem = ({ circle, active, onClick }) => (
  <button onClick={onClick} aria-label={circle.name} aria-current={active ? 'page' : undefined} className="circ-appnav-item" style={{
    flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
    background: 'transparent', border: 0, cursor: 'pointer', minHeight: 54, padding: '7px 4px',
  }}>
    <span aria-hidden="true" style={{
      width: 24, height: 24, borderRadius: 8, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: active ? 'var(--color-accent)' : 'var(--color-surface-sunken)', color: active ? '#fff' : 'var(--color-fg-2)',
      border: active ? 0 : '1px solid var(--color-border-1)',
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12,
    }}>{(circle.name || '?').trim().charAt(0).toUpperCase()}</span>
    <span style={{
      maxWidth: '100%', fontFamily: 'var(--font-sans)', fontWeight: active ? 600 : 500, fontSize: 10.5, letterSpacing: '0.01em',
      color: active ? 'var(--color-accent)' : 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>{circle.name}</span>
  </button>
);

const PgAddDock = ({ onClick }) => (
  <button onClick={onClick} aria-label="Add a link" className="circ-appnav-add" style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
    background: 'transparent', border: 0, cursor: 'pointer', minHeight: 54, padding: '7px 4px',
  }}>
    <span className="circ-appnav-adddot" aria-hidden="true" style={{
      width: 54, height: 54, borderRadius: '50%', marginTop: -30, flexShrink: 0, background: 'var(--color-accent)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 0 4px var(--color-surface), 0 4px 12px rgba(4,120,87,0.30)', transition: 'background var(--duration-base)',
    }}><PgcIcon name="plus" size={26} strokeWidth={2} color="#fff" /></span>
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.01em', color: 'var(--color-fg-3)' }}>Add</span>
  </button>
);

// Slot composition is derived, never hand-listed per option: build the non-Add
// slots from the config, then insert Add at the centre when it lives in the bar.
// A home screen absorbs the two global destinations (Circles, Account), which is
// what lets the remaining slots all be circle-local.
//
// 'push' goes one further: the bar is not rendered on home AT ALL, so there is
// nowhere in the app you can see the bar and not be inside a circle. That makes
// the bar circle-scoped by CONTEXT — a plain "Settings" cannot be misread as the
// app's settings, and needs no renaming to prove whose it is.
function pgBarSlots(cfg, view) {
  if ((cfg.home === 'root' || cfg.home === 'push') && view === 'home') return [];
  const slots = [];
  const noHome = !cfg.home || cfg.home === 'none';
  if (cfg.home === 'slot' || cfg.home === 'push') slots.push('home');
  if (cfg.reading) slots.push('reading');
  if (noHome && cfg.entry !== 'chip') slots.push('circles');
  if (cfg.settings === 'bar') slots.push('settings');
  if (cfg.settings === 'circle') slots.push('circleslot');
  if (noHome) slots.push('account');
  if (cfg.add === 'dock' || cfg.add === 'flat') slots.splice(Math.round(slots.length / 2), 0, 'add');
  return slots;
}

const PgBottomBar = ({ cfg, user, active, circle, onNav, preview, view = 'circle' }) => {
  const slots = pgBarSlots(cfg, view);
  if (!slots.length) return null;
  return (
  <nav aria-label={preview ? undefined : 'Primary'} aria-hidden={preview ? 'true' : undefined} inert={preview ? '' : undefined} style={{
    position: 'sticky', bottom: 0, zIndex: 40, display: 'flex', alignItems: 'stretch',
    background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-2)',
  }}>
    {slots.map((s) => {
      if (s === 'add') return cfg.add === 'dock'
        ? <PgAddDock key="add" onClick={() => onNav('add')} />
        : <PgNavItem key="add" icon="plus" label="Add" onClick={() => onNav('add')} />;
      if (s === 'home') return <PgNavItem key={s} icon="home" label="Home" active={active === 'home'} onClick={() => onNav('home')} />;
      if (s === 'reading') return <PgNavItem key={s} icon="feed" label="Reading" active={active === 'reading'} onClick={() => onNav('reading')} />;
      if (s === 'circles') return <PgNavItem key={s} icon="circles" label="Circles" active={active === 'circles'} onClick={() => onNav('circles')} />;
      if (s === 'settings') return <PgNavItem key={s} icon="settings" label="Settings" active={active === 'settings'} onClick={() => onNav('settings')} />;
      if (s === 'circleslot') return <PgCircleNavItem key={s} circle={circle || { name: 'Circle' }} active={active === 'settings'} onClick={() => onNav('settings')} />;
      return <PgNavItem key={s} label="Account" avatarName={pgcName(user)} active={active === 'account'} onClick={() => onNav('account')} />;
    })}
  </nav>
  );
};

// ---- Feed (fidelity — the product's real Active/Read tabs and card shape) ---
const pgDomain = (u) => u.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');

// Not an IA lever: Active/Read is how the product's reading list works, so the
// playground has to carry it or the bar is being judged against a fake screen.
const PgTabs = ({ active, onChange }) => (
  <div style={{
    background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-2)', padding: '0 16px',
    display: 'flex', gap: 4, position: 'sticky', top: 'var(--top-bar-height)', zIndex: 49,
  }}>
    {[['active', 'Active'], ['read', 'Read']].map(([id, label]) => {
      const on = active === id;
      return (
        <button key={id} onClick={() => onChange(id)} aria-current={on} style={{
          background: 'transparent', border: 0, padding: '15px 14px', cursor: 'pointer', minHeight: 48,
          fontFamily: 'var(--font-sans)', fontWeight: on ? 600 : 500, fontSize: 14,
          color: on ? 'var(--color-accent)' : 'var(--color-fg-2)',
          borderBottom: '2px solid ' + (on ? 'var(--color-accent)' : 'transparent'), marginBottom: -1,
          transition: 'color var(--duration-base), border-color var(--duration-base)',
        }}>{label}</button>
      );
    })}
  </div>
);

const PgFeed = ({ items, tab }) => (
  <main style={{ flex: 1, padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
    {items.filter((it) => (tab === 'read' ? it.read : !it.read)).map((it) => (
      <article key={it.url} style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
        padding: '14px 16px 12px', boxShadow: 'var(--shadow-raised)',
      }}>
        <div style={{ fontWeight: 600, fontSize: 16.5, lineHeight: 1.35, letterSpacing: '-0.01em', textWrap: 'pretty' }}>{it.title}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-2)', marginTop: 5 }}>{pgDomain(it.url)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--color-border-2)' }}>
          <PgcAvatar name={it.by} size={24} />
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{it.by}</span>
          <span style={{ flex: 1 }} />
          <PgcIcon name="external-link" size={17} color="var(--color-fg-3)" />
        </div>
      </article>
    ))}
  </main>
);

Object.assign(window, { PgTopBar, PgHomeTopBar, PgCircleHeader, PgBottomBar, PgFeed, PgTabs, pgBarSlots, PgNavItem, PgAddDock, PgCircleNavItem });
