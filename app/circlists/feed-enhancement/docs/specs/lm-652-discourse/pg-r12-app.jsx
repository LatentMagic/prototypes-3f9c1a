// ============================================================================
// Return v12 — the app. The real shell, the real cards, the real Swell, with ONE
// option mounted inside it. Everything below the rig's chrome is the product.
//
// Baseline: v9 state 1 (the door opens a room) with its own return affordance
// removed, plus the fold on every Read card in all five options — the corner is
// the kept part, not the part under test. Two options in this chapter differ by
// exactly the place the signal lives and the destination it opens.
// ============================================================================
const { d9Circle: R12Seed, D9_DROP: R12_DROP } = window.PGD9Data;
const R12_KEY = 'pg_r12_v1';
const r12Saved = (() => { try { return JSON.parse(localStorage.getItem(R12_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const R12App = () => {
  const [optId, setOptId] = React.useState(r12Saved.optId || 'w1');
  const [viewport, setViewport] = React.useState(r12Saved.viewport || 'auto');
  const [winW, setWinW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem(R12_KEY, JSON.stringify({ optId, viewport })); } catch (e) {}
  }, [optId, viewport]);

  const opt = window.r12Opt(optId);
  const st = React.useMemo(() => ({
    ...window.D9_ROOM,
    returnFeedTop: null, returnAbove: null,
    cardCorner: ({ item, tab, ctx }) => (tab === 'read' || tab === 'talking')
      ? <window.D9Fold item={item} ctx={ctx} /> : null,
    id: opt.id, name: opt.name,
  }), [optId]);

  const framed = viewport === 'mobile';
  const isApp = framed || winW < 1024;
  React.useEffect(() => {
    document.documentElement.setAttribute('data-circ-posture', isApp ? 'mobile' : 'desktop');
  }, [isApp]);

  const [circle, setCircle] = React.useState(R12Seed);
  const [tab, setTab] = React.useState('active');
  const [home, setHome] = React.useState(() => (r12Saved.viewport || 'auto') === 'mobile' || window.innerWidth < 1024);
  const [addOpen, setAddOpen] = React.useState(false);
  const [reacting, setReacting] = React.useState(null);
  const [recordId, setRecordId] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [arrived, setArrived] = React.useState([]);
  const [members, setMembers] = React.useState(false);
  const [travelId, setTravelId] = React.useState(null);
  const [glowId, setGlowId] = React.useState(null);
  const [visited, setVisited] = React.useState([]);
  const [panelOpen, setPanelOpen] = React.useState(false);   // W1, W5 — the popover
  const [talkPage, setTalkPage] = React.useState(false);     // W2 — the surface
  const [pendingBeat, setPendingBeat] = React.useState(null);
  const user = window.CircSeed.DEFAULT_USER;

  const reset = (id) => {
    setCircle(R12Seed()); setTab('active'); setHome(false);
    setAddOpen(false); setReacting(null); setRecordId(null); setConfirm(null);
    setArrived([]); setMembers(false); setTravelId(null); setGlowId(null);
    setVisited([]); setPanelOpen(false); setTalkPage(false);
    if (id) setOptId(id);
  };

  // Picking an option enters the app AND puts you at the moment it lives in:
  // somebody speaks on the cards you are watching, so there is always something
  // for the signal to be about.
  const pick = (id) => { reset(id); setPendingBeat('return'); };
  React.useEffect(() => {
    if (!pendingBeat) return;
    const t = setTimeout(() => { beat(pendingBeat); setPendingBeat(null); }, 40);
    return () => clearTimeout(t);
  }, [pendingBeat, circle]);

  const items = circle.items;
  const byId = (id) => items.find(i => i.id === id) || null;
  const patch = (id, fn) => setCircle(c => ({ ...c, items: c.items.map(i => i.id === id ? fn(i) : i) }));
  const seen = (id) => patch(id, i => ({ ...i, seenAt: Date.now() }));

  const ctx = {
    user,
    onMarkRead: (item) => setReacting(item),
    onDelete: (item) => setConfirm({ kind: 'delete', item }),
    openRecord: (item) => { if (st.record) setRecordId(item.id); },
    say: (item, text, replyTo) => patch(item.id, i => window.d9Say(i, text, { replyTo })),
    toggleWatch: (item) => patch(item.id, i => {
      const auto = /^added by you$/i.test(i.attribution || '') || (i.talk || []).some(t => t.by === 'You');
      const on = window.d9Watching(i);
      return on ? { ...i, watched: false, unwatched: true } : { ...i, watched: !auto, unwatched: false };
    }),
  };

  const wanted = window.d9Wanted(items, st).filter(i => !visited.includes(i.id));

  const goTo = (item) => {
    if (!item) return;
    setHome(false); setMembers(false); setAddOpen(false); setPanelOpen(false); setTalkPage(false);
    setVisited(v => v.includes(item.id) ? v : [...v, item.id]);
    setTravelId(item.id);
    setTab('read');
    if (st.record) setRecordId(item.id);
    setGlowId(item.id);
  };
  React.useEffect(() => {
    if (!glowId) return;
    const t1 = setTimeout(() => {
      const el = document.querySelector('[data-d9-card="' + glowId + '"]');
      if (!el) return;
      const phone = document.querySelector('.circ-phone-screen');
      const sc = phone || document.scrollingElement || document.documentElement;
      const base = phone ? phone.getBoundingClientRect().top : 0;
      const top = sc.scrollTop + el.getBoundingClientRect().top - base - 84;
      sc.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 80);
    const t2 = setTimeout(() => setGlowId(null), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [glowId]);

  const commit = (item, rx, said) => {
    patch(item.id, i => {
      const talk = said
        ? [...(i.talk || []), { id: 'my' + Date.now(), by: 'You', text: said, at: Date.now(), glyph: rx.glyph || null, intensity: rx.intensity == null ? null : rx.intensity, replyTo: null }]
        : (i.talk || []);
      return { ...i, read: true, reactions: [...(i.reactions || []), rx], talk, seenAt: Date.now() };
    });
  };

  const addLink = (url, thought) => {
    const id = 'i' + Date.now();
    setCircle(c => ({ ...c, items: [{
      id, url, title: null, source: null, attribution: 'Added by you', read: false,
      reactions: [], at: Date.now(),
      thought: thought ? { by: 'You', text: thought, at: Date.now() } : null,
      talk: [], seenAt: Date.now(), watched: false, unwatched: false,
    }, ...c.items] }));
    setTab('active');
    setArrived(a => [...a, id]);
    setTimeout(() => setArrived(a => a.filter(x => x !== id)), 1200);
  };

  const beat = (id) => {
    setRecordId(null); setMembers(false); setTalkPage(false); setHome(false);
    if (id === 'add') { setAddOpen(true); return; }
    if (id === 'arrive') {
      const nid = 'a' + Date.now();
      setCircle(c => ({ ...c, items: [{
        id: nid, ...R12_DROP, attribution: 'Added by Priya N.', read: false, at: Date.now(),
        reactions: [{ name: 'Marcus T.', glyph: window.RX_GLYPHS[0], intensity: 0.6, at: Date.now() }],
        thought: { by: 'Priya N.', text: 'Not our usual thing. Read the first two pages and see if you carry on.', at: Date.now() },
        talk: [window.PGD9Data.T('Marcus T.', 'I carried on. Cleared an evening for it.', Date.now() - 60e3, window.RX_GLYPHS[0], 0.6)],
        seenAt: Date.now(), watched: false, unwatched: false,
      }, ...c.items] }));
      setTab('active'); setArrived(a => [...a, nid]);
      setTimeout(() => setArrived(a => a.filter(x => x !== nid)), 1600);
      return;
    }
    if (id === 'reflect') {
      const target = items.filter(i => !i.read).sort((a, b) => (b.talk || []).length - (a.talk || []).length)[0];
      if (target) { setTab('active'); setReacting(target); }
      return;
    }
    if (id === 'return') {
      const targets = items.filter(i => i.read && window.d9Watching(i) && (i.talk || []).length)
        .sort((a, b) => (b.talk || []).length - (a.talk || []).length).slice(0, 3);
      if (!targets.length) return;
      const said = [
        'Coming back to this after the outage. The second half reads differently now.',
        'Late to this. The bit I keep thinking about is the one nobody has mentioned.',
        'Tried it on Thursday. It held up, mostly.',
      ];
      const who = ['Dev K.', 'Nadia F.', 'Marcus T.'];
      setCircle(c => ({
        ...c,
        items: c.items.map(i => {
          const n = targets.findIndex(t => t.id === i.id);
          if (n < 0) return i;
          const mine = (i.talk || []).filter(t => t.by === 'You');
          return {
            ...i,
            talk: [...(i.talk || []), { id: 'd' + Date.now() + n, by: who[n], text: said[n], at: Date.now(),
              glyph: window.RX_GLYPHS[n + 1], intensity: 0.7, replyTo: mine.length ? mine[mine.length - 1].id : null }],
            reactions: [...(i.reactions || []), { name: who[n], glyph: window.RX_GLYPHS[n + 1], intensity: 0.7, at: Date.now() }],
          };
        }),
      }));
      setVisited([]);
      setTab('active');
      return;
    }
  };

  // The shelf. W3 adds a third destination, and it holds the cards themselves.
  const list = tab === 'talking' ? wanted : items.filter(i => tab === 'read' ? i.read : !i.read);

  const retProps = { wanted, st, ctx, goTo, travelId, tab, isApp };

  const feed = (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
        padding: isApp ? '16px 16px 112px' : '28px 24px 120px',
        '--circ-feed-pad-top': isApp ? '16px' : '28px',
        display: 'flex', flexDirection: 'column', gap: 16 }}>
        {opt.place === 'feed' && <window.W12Strip {...retProps} />}
        {list.length === 0
          ? (tab === 'talking'
            ? <p style={{ margin: '4px 2px', font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
                Nothing is talking. Cards you are watching come here while the circle is still speaking on them.
              </p>
            : <window.EmptyState tab={tab} onStartCircle={() => {}} />)
          : list.map(item => (
            <div key={item.id} data-d9-card={item.id}>
              <window.CircGlow glow={glowId === item.id} rise={arrived.includes(item.id)}>
                <window.D9Card item={item} tab={tab === 'talking' ? 'read' : tab} user={user} st={st} ctx={ctx} />
              </window.CircGlow>
            </div>
          ))}
      </div>
    </main>
  );

  const onMembers = members;
  const subView = onMembers ? { title: 'Circle settings', onBack: () => setMembers(false) }
    : talkPage ? { title: 'Still talking', onBack: () => setTalkPage(false) }
    : null;

  const content = onMembers
    ? <window.MembersSurface space={circle} isChampion championName="You"
        onInvite={() => {}} onManageFunding={() => {}} onCancelFunding={() => {}}
        onRename={() => {}} onRemoveMember={() => {}} onStartCircle={() => {}} onLeave={() => {}} />
    : talkPage
      ? <window.W12Surface wanted={wanted} st={st} isApp={isApp} goTo={goTo} />
      : (
        <React.Fragment>
          {opt.place === 'tabs'
            ? <window.W12Tabs active={tab} onChange={setTab} n={wanted.length} />
            : <window.Tabs active={tab === 'talking' ? 'read' : tab} onChange={setTab} />}
          {feed}
        </React.Fragment>
      );

  // The signal, in the app's own chrome. Portalled into the shipped header (or
  // the shipped bottom bar) because a playground does not edit app/.
  const inCircle = !onMembers && !talkPage && !home;
  const signal = !inCircle ? null : (
    <React.Fragment>
      {opt.place === 'name-adjacent' && wanted.length > 0 && (
        <window.W12InHeader before="name">
          <window.W12Mark wanted={wanted} open={panelOpen} label={window.w12Short(wanted)}
            onClick={() => setPanelOpen(o => !o)} compact={isApp} />
        </window.W12InHeader>
      )}
      {opt.place === 'gear' && (isApp
        ? <window.W12InNav><window.W12NavSlot n={wanted.length} on={talkPage} onClick={() => setTalkPage(true)} /></window.W12InNav>
        : <window.W12InHeader before="gear">
            <window.W12Mark wanted={wanted} open={false} label={wanted.length ? window.w12Short(wanted) : 'Talking'}
              onClick={() => setTalkPage(true)} />
          </window.W12InHeader>)}
      {opt.place === 'name' && (
        <window.W12NameControl n={wanted.length} open={panelOpen} onToggle={() => setPanelOpen(o => !o)} />
      )}
      {panelOpen && (
        <window.W12Panel wanted={wanted} st={st} goTo={goTo} travelId={travelId} isApp={isApp}
          onClose={() => setPanelOpen(false)} />
      )}
    </React.Fragment>
  );

  const keyedContent = <React.Fragment key={optId}>{content}</React.Fragment>;

  const rail = (
    <window.R12Rail optId={optId} onPick={pick} onBeat={beat}
      viewport={viewport} onViewport={setViewport} onReset={() => reset(null)} />
  );

  const shell = isApp ? (
    <window.AppShellNative
      isMobile user={user} spaces={[]} currentId={circle.id} space={home ? null : circle}
      showMembers isHome={home} subView={home ? null : subView}
      onHome={() => { setMembers(false); setTalkPage(false); setHome(true); }} onManageAccount={() => {}} onSignOut={() => {}}
      onMembers={() => setMembers(true)}
      onAdd={() => setAddOpen(true)} canAdd={!onMembers && !talkPage}>
      {home
        ? <main style={{ flex: 1, width: '100%' }}>
            <div style={{ padding: '20px 16px calc(24px + env(safe-area-inset-bottom, 0px))' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 6px 16px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>return v12</span>
                <span style={{ font: '600 20px/1.25 var(--font-sans)', letterSpacing: '-0.015em', color: 'var(--color-fg-1)' }}>Five ways the circle says a card you are watching has moved</span>
              </div>
              <window.R12Rail home optId={optId} onPick={pick} onBeat={(b) => { setHome(false); beat(b); }}
                viewport={viewport} onViewport={setViewport} onReset={() => reset(null)} />
            </div>
          </main>
        : keyedContent}
    </window.AppShellNative>
  ) : (
    <div style={{ display: 'flex', minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)' }}>
      <aside style={{ width: 288, flexShrink: 0, background: 'var(--color-surface-sunken)',
        borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'var(--color-border-2)', padding: '20px 12px',
        position: 'sticky', top: 0, height: 'var(--circ-vh)', overflowY: 'auto' }}>{rail}</aside>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <window.TopBar isMobile={false} space={circle} showMembers subView={subView} onMembers={() => setMembers(true)} />
        {keyedContent}
      </div>
    </div>
  );

  const recordItem = recordId ? byId(recordId) : null;
  const overlays = (
    <React.Fragment>
      {!isApp && !onMembers && !talkPage && <window.FAB onClick={() => setAddOpen(true)} expanded={addOpen} isMobile={false} />}
      <window.D9Add open={addOpen} isMobile={isApp} st={st} onClose={() => setAddOpen(false)} onAdd={addLink} />
      {reacting && (
        <window.D9Flow item={byId(reacting.id) || reacting} st={st} user={user} ctx={ctx}
          onCommit={commit} onOpenRecord={ctx.openRecord} onClose={() => setReacting(null)} />
      )}
      {recordItem && st.record && st.record({ item: recordItem, ctx, onClose: () => { seen(recordItem.id); setRecordId(null); } })}
      {confirm && (
        <window.ConfirmDialog kind={confirm.kind}
          onConfirm={() => { setCircle(c => ({ ...c, items: c.items.filter(i => i.id !== confirm.item.id) })); setConfirm(null); }}
          onCancel={() => setConfirm(null)} />
      )}
    </React.Fragment>
  );

  const tree = <React.Fragment>{shell}{signal}{overlays}</React.Fragment>;

  return framed ? (
    <div className="circ-stage">
      <div className="circ-phone"><div className="circ-phone-clip"><div className="circ-phone-screen">{tree}</div></div></div>
    </div>
  ) : tree;
};

ReactDOM.createRoot(document.getElementById('root')).render(<R12App />);
