// ============================================================================
// BIZ-136 — leaving a circle. The APP: one state machine and one set of bodies,
// shared by all three variations.
// ----------------------------------------------------------------------------
// Nothing in this file is a variation. The variations are CHROME (pg-lc-
// chrome.jsx) and they are pure functions of the state held here — which is the
// whole reason switching between them does not drop you out of where you were
// standing. Route, tab, scroll, lens, the open sheet and the seeded mutations
// all live above the chrome, so swapping A for C re-renders the frame and
// nothing else.
//
// Every surface inside the chrome is the SHIPPED component, mounted:
//   CirclesHome (app/home.jsx) with its returns strip (app/home-returns.jsx)
//   Tabs (app/shell.jsx) · SearchTrigger (app/feed-search.jsx)
//   FeedLens (app/feed-lens.jsx) · FeedCard, AddReveal, FAB (app/feed.jsx)
//   SwellReactionFlow (app/swell-reactions.jsx)
//   MembersSurface, AccountSettings (app/spaces.jsx)
// Nothing here redraws any of them.
// ============================================================================
const LC_USER = window.CircSeed.DEFAULT_USER;

// The app's own seed, wrapped by talk-data.jsx so the discourse fixtures — and
// therefore the cross-circle returns strip on home — are present. Three
// circles: one with links waiting and conversation returned, one caught up, one
// asleep. TEST fixtures dropped, as every other rig here drops them.
const lcSeed = () => window.CircSeed.seedSpaces(LC_USER.email)
  .filter((s) => !/^TEST\b/i.test(s.name))
  .map((s) => (s.id === 'sp-sam' ? { ...s, funded: false, dormancy: 'lapsed' } : s));

// ---- The state machine ------------------------------------------------------
// route: 'home' | 'circle' | 'settings' | 'account'
// Depth is what the chrome animates on: home 0, circle 1, sub-view 2 — the same
// rule app/app-shell.jsx uses.
const LC_DEPTH = { home: 0, circle: 1, settings: 2, account: 2 };

const useLcApp = () => {
  const [spaces, setSpaces] = React.useState(lcSeed);
  const [route, setRoute] = React.useState('home');
  const [currentId, setCurrentId] = React.useState(null);
  const [tab, setTab] = React.useState('active');
  const [stripOpen, setStripOpen] = React.useState(true);
  const [addOpen, setAddOpen] = React.useState(false);
  const [reacting, setReacting] = React.useState(null);
  const [lensOpen, setLensOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [order, setOrder] = React.useState('newest');
  const [who, setWho] = React.useState(null);
  const [density, setDensity] = React.useState('comfortable');
  const [announce, setAnnounce] = React.useState('');
  // Scroll positions, held ABOVE the chrome for the same reason the route is:
  // swapping variation unmounts one scroller and mounts another, and without
  // this the switch throws you back to the top of the feed — which is exactly
  // the moment a reviewer is trying to compare.
  const scrollMemo = React.useRef({});

  const space = spaces.find((s) => s.id === currentId) || null;

  const mutate = (fn) => setSpaces((all) => all.map((s) => (s.id === currentId ? fn(s) : s)));

  const api = {
    user: LC_USER, spaces, space, currentId, route, tab, stripOpen, scrollMemo,
    addOpen, reacting, lensOpen, searchOpen, query, order, who, density, announce,
    depth: LC_DEPTH[route],

    enterSpace: (id) => { setCurrentId(id); setTab('active'); setSearchOpen(false); setQuery(''); setRoute('circle'); },
    goHome: () => { setRoute('home'); },
    // Leaving lands on home and lets the chrome finish its exit before the
    // circle is forgotten, so a sheet sliding down is not sliding down empty.
    leaveSpace: () => { setRoute('home'); setTimeout(() => setCurrentId(null), 260); },
    openSettings: () => setRoute('settings'),
    openAccount: () => setRoute('account'),
    backFromSub: () => setRoute(currentId ? 'circle' : 'home'),

    setTab, setStripOpen, setAddOpen, setReacting, setLensOpen, setOrder, setWho, setDensity,
    setSearchOpen: (v) => { setSearchOpen(v); if (!v) setQuery(''); },
    setQuery,
    announceNow: (msg) => { setAnnounce(''); setTimeout(() => setAnnounce(msg), 30); },

    addLink: (item) => {
      mutate((s) => ({ ...s, items: [item, ...s.items] }));
      // Extraction never blocks the add: the card lands pending and fills in
      // place, exactly as main.jsx schedules it.
      setTimeout(() => setSpaces((all) => all.map((s) => ({
        ...s, items: s.items.map((i) => (i.id === item.id ? { ...i, pending: false } : i)),
      }))), 1400);
    },
    markRead: (item, reaction) => {
      mutate((s) => ({ ...s, items: s.items.map((i) => (i.id === item.id ? { ...i, read: true, reaction } : i)) }));
    },
    deleteItem: (item) => mutate((s) => ({ ...s, items: s.items.filter((i) => i.id !== item.id) })),
    toggleSaved: (item) => mutate((s) => ({ ...s, items: s.items.map((i) => (i.id === item.id ? { ...i, saved: !i.saved } : i)) })),
    editSpace: (patch) => mutate((s) => ({ ...s, ...patch })),
    removeMember: (name) => mutate((s) => ({ ...s, members: s.members.filter((m) => m.name !== name) })),
    reset: () => { setSpaces(lcSeed()); setRoute('home'); setCurrentId(null); },
  };
  return api;
};

// ---- Bodies — shipped components, mounted -----------------------------------
const LcHomeBody = ({ app }) => (
  <CirclesHome spaces={app.spaces} onSelect={app.enterSpace} onCreate={() => {}}
    stripOpen={app.stripOpen} onToggleStrip={() => app.setStripOpen(!app.stripOpen)} />
);

// The app's own composition: Tabs carrying the feed's control row on its right,
// then the feed. Search is a Read-tab control exactly as main.jsx composes it.
const LcCircleBody = ({ app, isMobile = true }) => {
  const s = app.space;
  if (!s) return null;
  const isRead = app.tab === 'read';
  const base = s.items.filter((i) => (isRead ? i.read : !i.read));
  const ordered = app.order === 'oldest' ? [...base].reverse() : base;
  const lensed = app.who ? window.circFilterItems(ordered, app.who) : ordered;
  const visible = (isRead && app.searchOpen && app.query.trim())
    ? window.circFilterSearch(lensed, app.query) : lensed;
  return (
    <React.Fragment>
      <Tabs active={app.tab} onChange={app.setTab} right={
        <React.Fragment>
          {isRead && <window.SearchTrigger open={app.searchOpen} active={app.searchOpen} onToggle={app.setSearchOpen} />}
          <window.FeedLens order={app.order} who={app.who} contributors={window.circContributors(s)}
            onOrder={app.setOrder} onWho={app.setWho} density={app.density} onDensity={app.setDensity}
            isMobile={isMobile} open={app.lensOpen} onOpenChange={app.setLensOpen} savedMode="bar" />
        </React.Fragment>
      } />
      {/* The chip row — what is applied, and the way out of it. The search
          field rides inside it, which is why main.jsx gates the search trigger
          on LensChips existing at all. Same composition here. */}
      <window.LensChips who={app.who} onWho={app.setWho} saved={false} onSaved={() => {}}
        isMobile={isMobile} searchOpen={isRead && app.searchOpen} searchQuery={app.query}
        onSearchChange={app.setQuery} onSearchClear={() => app.setSearchOpen(false)}
        savedMode="bar" onReopenLens={() => app.setLensOpen(true)} />
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{
          maxWidth: 'var(--max-feed-width)', margin: '0 auto',
          padding: isMobile ? '16px 16px 112px' : '28px 24px 120px',
          '--circ-feed-pad-top': isMobile ? '16px' : '28px', width: '100%',
          display: 'flex', flexDirection: 'column', gap: app.density === 'compact' ? 10 : 16,
        }}>
          {visible.length === 0
            ? <EmptyState tab={app.tab} onStartCircle={() => {}} />
            : visible.map((item) => (
                <FeedCard key={item.id} item={item} tab={isRead ? 'read' : 'active'} user={app.user}
                  showTime density={app.density} space={s}
                  onOpen={() => {}} onMarkRead={(it) => app.setReacting(it)}
                  onDelete={(it) => app.deleteItem(it)} onToggleSaved={(it) => app.toggleSaved(it)}
                  onAnnounce={app.announceNow} />
              ))}
        </div>
      </main>
    </React.Fragment>
  );
};

const LcSettingsBody = ({ app }) => (
  <MembersSurface space={app.space} isChampion={app.space && app.space.champion === 'You'}
    championName={app.space ? app.space.champion : ''}
    onInvite={() => {}} onManageFunding={() => {}} onCancelFunding={() => {}} onResumeFunding={() => {}}
    onEdit={app.editSpace} onRemoveMember={app.removeMember} onLeave={() => {}} onStartCircle={() => {}} />
);

const LcAccountBody = ({ app }) => (
  <AccountSettings user={app.user} onChangeEmail={() => {}} onDeleteAccount={() => {}} />
);

// The body for whatever route is current. The chrome asks for this and frames
// it; it never knows which surface it is holding.
const LcBody = ({ app, route }) => {
  if (route === 'home') return <LcHomeBody app={app} />;
  if (route === 'settings') return <LcSettingsBody app={app} />;
  if (route === 'account') return <LcAccountBody app={app} />;
  return <LcCircleBody app={app} />;
};

Object.assign(window, {
  LC_USER, lcSeed, useLcApp, LcHomeBody, LcCircleBody, LcSettingsBody, LcAccountBody, LcBody, LC_DEPTH,
});
