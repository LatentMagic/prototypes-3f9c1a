// ============================================================================
// BIZ-136 whiteboard — the phone's chrome. Chrome primitives + the four
// directions' shells.
// ----------------------------------------------------------------------------
// WHAT IS COPIED AND WHY. Direction 0 mounts the REAL app/app-shell.jsx
// (AppShellNative) — it is today's chrome unchanged, so nothing here stands in
// for it. Directions 1-3 change the chrome itself, and app-shell.jsx exports
// only AppShellNative: TopBarNative, NavItem, AddNavItem and BottomNav are
// module-local. The brief fences this playground out of app/ entirely, so the
// export that build-playground would normally ask for cannot be added here.
// The primitives below are therefore a COPY of app/app-shell.jsx's, carried
// verbatim — same geometry, same sizes, same tokens, same icons — and are not
// to be "improved": a copy tuned to look better stops being evidence. If a
// direction from this board is taken forward, the fix is to export those
// primitives from app/app-shell.jsx and delete this file's copies.
//
// Everything INSIDE the chrome is the real shared surface, mounted, never
// redrawn: CirclesHome (app/home.jsx) with its returns strip
// (app/home-returns.jsx), Tabs (app/shell.jsx), SearchTrigger
// (app/feed-search.jsx), FeedLens (app/feed-lens.jsx), FeedCard (app/feed.jsx),
// the web AppShell (app/shell.jsx) and the web FAB (app/feed.jsx).
// ============================================================================
const mcNoop = () => {};

// ---- Seed -------------------------------------------------------------------
// The app's own seed, wrapped by talk-data.jsx so the discourse fixtures (and
// therefore the cross-circle returns strip) are present. Three circles is the
// shape the question needs: one with links waiting and conversation returned
// (Backend Pod), one caught up (Tuesday Book Club), one asleep (Me & Sam).
// The TEST fixtures are dropped, as every other rig here drops them.
const MC_USER = window.CircSeed.DEFAULT_USER;
const mcSpaces = window.CircSeed.seedSpaces(MC_USER.email)
  .filter((s) => !/^TEST\b/i.test(s.name))
  .map((s) => (s.id === 'sp-sam' ? { ...s, funded: false, dormancy: 'lapsed' } : s));
const mcCircle = mcSpaces.find((s) => s.id === 'sp-backend');

// ---- Copied from app/app-shell.jsx — see the header ------------------------
const MCNavItem = ({ icon, label, glyph, active = false, onClick }) => (
  <button onClick={onClick} aria-label={label} aria-current={active || undefined}
    className="circ-appnav-item" style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
      background: 'transparent', border: 0, cursor: 'pointer', minHeight: 54, padding: '7px 4px',
    }}>
    {glyph || <Icon name={icon} size={22} color={active ? 'var(--color-accent)' : 'var(--color-fg-2)'} strokeWidth={1.5} />}
    <span style={{
      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.01em',
      color: active ? 'var(--color-accent)' : 'var(--color-fg-3)',
      maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>{label}</span>
  </button>
);

const MCAddPuck = ({ label = 'Add', onClick }) => (
  <button onClick={onClick} aria-label={label} className="circ-appnav-add" style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
    background: 'transparent', border: 0, cursor: 'pointer', minHeight: 54, padding: '7px 4px',
  }}>
    <span className="circ-appnav-adddot" aria-hidden="true" style={{
      width: 54, height: 54, borderRadius: '50%', marginTop: -30, flexShrink: 0,
      background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 0 4px var(--color-surface), 0 4px 12px rgba(4,120,87,0.30)',
      transition: 'background var(--duration-base)',
    }}>
      <Icon name="plus" size={26} strokeWidth={2} color="#fff" />
    </span>
    <span style={{
      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.01em', color: 'var(--color-fg-3)',
      maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>{label}</span>
  </button>
);

const MCBar = ({ label, children }) => (
  <nav aria-label={label} style={{
    position: 'sticky', bottom: 0, zIndex: 40, display: 'flex', alignItems: 'stretch',
    background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-2)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)', boxShadow: '0 -1px 0 rgba(10,10,10,0.02)',
  }}>{children}</nav>
);

// Top bar, copied. `right` is the one addition: directions 2 and 3 move circle
// settings up here, which today's top bar has no slot for.
const MCTopBar = ({ title, wordmark = false, onBack, avatar = null, right = null }) => (
  <header style={{
    height: 'var(--top-bar-height)', background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border-2)', display: 'flex', alignItems: 'center',
    padding: onBack ? '0 8px' : (avatar || right) ? '0 10px 0 16px' : '0 16px', gap: 8,
    position: 'sticky', top: 0, zIndex: 50,
  }}>
    {onBack && (
      <button onClick={onBack} aria-label="Back" style={{
        background: 'transparent', border: 0, padding: 10, margin: '0 -2px', cursor: 'pointer',
        color: 'var(--color-fg-1)', display: 'inline-flex',
      }}><Icon name="arrow-left" size={20} /></button>
    )}
    {wordmark
      ? <span style={{ flex: 1, minWidth: 0, display: 'flex' }}><Wordmark size={19} /></span>
      : <span style={{
          flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17,
          letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</span>}
    {avatar}
    {right}
  </header>
);

const MCTopAvatar = ({ onClick }) => (
  <button onClick={onClick} aria-label="Account" className="circ-topaction" style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent',
    border: 0, cursor: 'pointer', width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
  }}><Avatar name={displayName(MC_USER)} size={29} /></button>
);

const MCTopGear = ({ onClick }) => (
  <button onClick={onClick} aria-label="Circle settings" className="circ-topaction" style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent',
    border: 0, cursor: 'pointer', width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
    color: 'var(--color-fg-2)',
  }}><Icon name="settings" size={21} strokeWidth={1.6} /></button>
);

// Copied from app/feed.jsx's FAB, with ONE change: `bottom` is a prop, because
// direction 2 has to raise the FAB clear of a bar the shipped FAB never sits
// above. Direction 3 mounts the real window.FAB instead — it needs no change.
const MCFabRaised = ({ bottom = 24, onClick }) => (
  <button onClick={onClick} aria-label="Add a link" style={{
    position: 'fixed', right: 24, bottom, zIndex: 80,
    width: 56, height: 56, borderRadius: '50%',
    background: 'var(--color-accent)', color: '#fff', border: 0, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(4,120,87,0.28), 0 1px 3px rgba(10,10,10,0.12)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="4" y1="12" x2="20" y2="12" />
      </g>
    </svg>
  </button>
);

// ---- The two bodies — real components, mounted -----------------------------
// Home: app/home.jsx exactly as it stands, strip open, nothing redrawn.
const MCHomeBody = () => (
  <CirclesHome spaces={mcSpaces} onSelect={mcNoop} onCreate={mcNoop} stripOpen onToggleStrip={mcNoop} />
);

// Inside a circle: the app's own composition — Tabs carrying the feed's control
// row on the right, then the feed. Search and the lens door are mounted from
// their shipped modules and sit exactly where main.jsx puts them (search is a
// Read-tab control there; the tabs here are live, so tapping Read shows it).
const MCCircleBody = ({ isMobile = true }) => {
  const [tab, setTab] = React.useState('active');
  const [lensOpen, setLensOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [order, setOrder] = React.useState('newest');
  const [who, setWho] = React.useState(null);
  const [density, setDensity] = React.useState('comfortable');
  const isRead = tab === 'read';
  const items = mcCircle.items.filter((i) => (isRead ? i.read : !i.read));
  const ordered = order === 'oldest' ? [...items].reverse() : items;
  const visible = who ? window.circFilterItems(ordered, who) : ordered;
  return (
    <React.Fragment>
      <Tabs active={tab} onChange={setTab} right={
        <React.Fragment>
          {isRead && <window.SearchTrigger open={searchOpen} active={searchOpen} onToggle={setSearchOpen} />}
          <window.FeedLens order={order} who={who} contributors={window.circContributors(mcCircle)}
            onOrder={setOrder} onWho={setWho} density={density} onDensity={setDensity}
            isMobile={isMobile} open={lensOpen} onOpenChange={setLensOpen} savedMode="bar" />
        </React.Fragment>
      } />
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{
          maxWidth: 'var(--max-feed-width)', margin: '0 auto',
          padding: isMobile ? '16px 16px 112px' : '28px 24px 120px',
          '--circ-feed-pad-top': isMobile ? '16px' : '28px', width: '100%',
          display: 'flex', flexDirection: 'column', gap: density === 'compact' ? 10 : 16,
        }}>
          {visible.map((item) => (
            <FeedCard key={item.id} item={item} tab={isRead ? 'read' : 'active'} user={MC_USER}
              showTime density={density} space={mcCircle}
              onOpen={mcNoop} onMarkRead={mcNoop} onDelete={mcNoop} onToggleSaved={mcNoop} onAnnounce={mcNoop} />
          ))}
        </div>
      </main>
    </React.Fragment>
  );
};

// ---- The frame every app-posture screen shares ------------------------------
const MCPhone = ({ children }) => (
  <div style={{ minHeight: 'var(--circ-vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
    {children}
  </div>
);

// ---- The desktop canvas — the web posture, mounted as it ships --------------
// Unchanged by any direction: the phone's chrome is the question, and the web
// read is the constant the four are measured against. It is here per direction
// so the comparison never needs a scroll back up the page.
const MCDesk = ({ place }) => (
  <AppShell isMobile={false} user={MC_USER} spaces={mcSpaces}
    currentId={place === 'home' ? null : mcCircle.id} space={place === 'home' ? null : mcCircle}
    isHome={place === 'home'} showMembers
    onSelectSpace={mcNoop} onCreateSpace={mcNoop} onMembers={mcNoop}
    onManageAccount={mcNoop} onSignOut={mcNoop} onHome={mcNoop}>
    {place === 'home' ? <MCHomeBody /> : <MCCircleBody isMobile={false} />}
    {place !== 'home' && <FAB onClick={mcNoop} isMobile={false} />}
  </AppShell>
);

// ============================================================================
// The four directions.
// ============================================================================

// ---- 0 — Docked. Today's chrome, unchanged, mounting the real shell. -------
const MCDir0 = ({ place }) => (
  <AppShellNative isMobile user={MC_USER} spaces={mcSpaces}
    currentId={place === 'home' ? null : mcCircle.id} space={place === 'home' ? null : mcCircle}
    isHome={place === 'home'} showMembers canAdd
    onSelectSpace={mcNoop} onCreateSpace={mcNoop} onMembers={mcNoop}
    onManageAccount={mcNoop} onSignOut={mcNoop} onHome={mcNoop} onAdd={mcNoop}>
    {place === 'home' ? <MCHomeBody /> : <MCCircleBody />}
  </AppShellNative>
);

// ---- 1 — The bar mirrors the level. ----------------------------------------
// Three slots at both levels, and every slot answers to where you are standing.
// Slot 3 is the level's own settings (Account on home, the circle's gear in a
// circle) and the puck adds the thing the level is made of (a circle on home, a
// link in a circle). Account leaves the avatar — the whole point is that the
// bar describes the level, so account settings reached from a top-bar avatar
// would be the one thing on the screen the bar does not account for. The avatar
// is therefore absent from home's top bar rather than left present and dead.
const MCDir1 = ({ place }) => {
  const home = place === 'home';
  return (
    <MCPhone>
      {home
        ? <MCTopBar wordmark />
        : <MCTopBar title={mcCircle.name} />}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {home ? <MCHomeBody /> : <MCCircleBody />}
      </div>
      <MCBar label={home ? 'Account' : 'Circle'}>
        <MCNavItem icon="home" label="Home" active={home} onClick={mcNoop} />
        <MCAddPuck label={home ? 'New circle' : 'Add link'} onClick={mcNoop} />
        {home
          ? <MCNavItem label="Account" glyph={<Avatar name={displayName(MC_USER)} size={22} />} onClick={mcNoop} />
          : <MCNavItem icon="settings" label="Settings" onClick={mcNoop} />}
      </MCBar>
    </MCPhone>
  );
};

// ---- 2 — One permanent bar, the action floats. ------------------------------
// The TickTick shape, translated rather than copied: the bar is the same two
// account-level destinations everywhere and never says anything about a circle,
// so no slot ever has to prove whose it is. Circle scope lives entirely above
// the bar — the gear in the top bar, Add as a floating FAB raised clear of the
// bar — and is absent on home, where there is no circle to act on.
const MC_BAR_H = 54;
const MCDir2 = ({ place }) => {
  const home = place === 'home';
  return (
    <MCPhone>
      {home
        ? <MCTopBar wordmark />
        : <MCTopBar title={mcCircle.name} right={<MCTopGear onClick={mcNoop} />} />}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {home ? <MCHomeBody /> : <MCCircleBody />}
      </div>
      {!home && <MCFabRaised bottom={MC_BAR_H + 20} onClick={mcNoop} />}
      <MCBar label="Circlists">
        <MCNavItem icon="home" label="Home" active={home} onClick={mcNoop} />
        <MCNavItem label="Account" glyph={<Avatar name={displayName(MC_USER)} size={22} />} onClick={mcNoop} />
      </MCBar>
    </MCPhone>
  );
};

// ---- 3 — No bar. The scopes go to opposite edges. ---------------------------
// Nothing persistent at the foot of either screen. Navigation and circle
// settings sit at the top — the wordmark and the avatar on home, a back arrow
// and the gear in a circle — and the single action the member repeats floats
// where the web app already floats it. The bottom of the screen is content.
const MCDir3 = ({ place }) => {
  const home = place === 'home';
  return (
    <MCPhone>
      {home
        ? <MCTopBar wordmark avatar={<MCTopAvatar onClick={mcNoop} />} />
        : <MCTopBar title={mcCircle.name} onBack={mcNoop} right={<MCTopGear onClick={mcNoop} />} />}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {home ? <MCHomeBody /> : <MCCircleBody />}
      </div>
      {!home && <FAB onClick={mcNoop} isMobile />}
    </MCPhone>
  );
};

// ---- The reference row — TickTick, for context, not an option ---------------
// Drawn, not mounted: it is another product's chrome, so there is nothing of
// ours to mount. Deliberately plain, and fenced off on the page so it cannot be
// read as a fifth direction.
const MCTickTick = () => (
  <div className="mc-refphone">
    <div className="mc-refbody">
      <div className="mc-reftitle">Today</div>
      {['Renew passport', 'Book dentist', 'Reply to Priya', 'Water the plants', 'Draft Q3 notes'].map((t) => (
        <div className="mc-refrow" key={t}><span className="mc-refbox" />{t}</div>
      ))}
    </div>
    <div className="mc-reffab" aria-hidden="true">+</div>
    <div className="mc-refbar">
      {[['Tasks', true], ['Calendar', false], ['Pomo', false], ['Matrix', false], ['Me', false]].map(([l, on]) => (
        <div className={'mc-refslot' + (on ? ' is-on' : '')} key={l}><span className="mc-refglyph" />{l}</div>
      ))}
    </div>
  </div>
);

Object.assign(window, {
  MC_USER, mcSpaces, mcCircle, MCHomeBody, MCCircleBody, MCDesk, MCTickTick,
  MCDir0, MCDir1, MCDir2, MCDir3,
});
