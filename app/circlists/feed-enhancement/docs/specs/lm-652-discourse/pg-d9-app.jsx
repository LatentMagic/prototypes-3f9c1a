// ============================================================================
// Discourse v9 — the app. The real shell, the real cards, the real Swell, with
// one state's discourse living inside it. Everything below the rig's chrome is
// the product; the rig owns only which state is mounted.
// ============================================================================
const { d9Circle: D9Seed, D9_DROP } = window.PGD9Data;
const D9_KEY = 'pg_d9_v1';
const d9Saved = (() => { try { return JSON.parse(localStorage.getItem(D9_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const D9App = () => {
  const [stateId, setStateId] = React.useState(d9Saved.stateId || 'room');
  const [viewport, setViewport] = React.useState(d9Saved.viewport || 'auto');
  const [winW, setWinW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem(D9_KEY, JSON.stringify({ stateId, viewport })); } catch (e) {}
  }, [stateId, viewport]);

  const st = window.D9_STATES.find(s => s.id === stateId) || window.D9_STATES[0];
  const framed = viewport === 'mobile';
  const isApp = framed || winW < 1024;
  React.useEffect(() => {
    document.documentElement.setAttribute('data-circ-posture', isApp ? 'mobile' : 'desktop');
  }, [isApp]);

  const [circle, setCircle] = React.useState(D9Seed);
  const [tab, setTab] = React.useState('active');
  const [home, setHome] = React.useState(() => (d9Saved.viewport || 'auto') === 'mobile' || window.innerWidth < 1024);
  const [addOpen, setAddOpen] = React.useState(false);
  const [reacting, setReacting] = React.useState(null);
  const [recordId, setRecordId] = React.useState(null);
  const [pageId, setPageId] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [arrived, setArrived] = React.useState([]);
  const [members, setMembers] = React.useState(false);
  // ---- return: the walk ----------------------------------------------------
  const [travelId, setTravelId] = React.useState(null);  // where the walk has got to
  const [glowId, setGlowId] = React.useState(null);      // the card washing as you arrive
  const [visited, setVisited] = React.useState([]);      // drops out of the list behind you
  const user = window.CircSeed.DEFAULT_USER;

  const reset = (id) => {
    setCircle(D9Seed()); setTab('active'); setHome(false);
    setAddOpen(false); setReacting(null); setRecordId(null); setPageId(null);
    setConfirm(null); setArrived([]); setMembers(false);
    setTravelId(null); setGlowId(null); setVisited([]);
    if (id) setStateId(id);
  };
  const pick = (id) => reset(id);

  const items = circle.items;
  const byId = (id) => items.find(i => i.id === id) || null;
  const patch = (id, fn) => setCircle(c => ({ ...c, items: c.items.map(i => i.id === id ? fn(i) : i) }));
  const seen = (id) => patch(id, i => ({ ...i, seenAt: Date.now() }));

  const openRecord = (item) => {
    if (st.record) setRecordId(item.id);
    else if (st.opensPage) setPageId(item.id);
  };

  const ctx = {
    user,
    onMarkRead: (item) => setReacting(item),
    onDelete: (item) => setConfirm({ kind: 'delete', item }),
    openRecord,
    say: (item, text, replyTo) => patch(item.id, i => window.d9Say(i, text, { replyTo })),
    toggleWatch: (item) => patch(item.id, i => {
      const auto = /^added by you$/i.test(i.attribution || '') || (i.talk || []).some(t => t.by === 'You');
      const on = window.d9Watching(i);
      return on ? { ...i, watched: false, unwatched: true } : { ...i, watched: !auto, unwatched: false };
    }),
  };

  // The gathered set: read, part of, moved since you looked, not gone stale.
  // Cards already walked to in this sitting drop out of it behind you.
  const wanted = window.d9Wanted(items, st).filter(i => !visited.includes(i.id));

  // ---- the walk: how return actually moves you -----------------------------
  // 'page'   the card's page opens (state 2 — the record IS a place)
  // 'record' the card's record opens, and the card is waiting behind it
  // 'scroll' Read carries you to the card and it washes as it arrives
  const goTo = (item) => {
    if (!item) return;
    setHome(false); setMembers(false); setAddOpen(false);
    setVisited(v => v.includes(item.id) ? v : [...v, item.id]);
    setTravelId(item.id);
    if (st.opensPage) { setPageId(item.id); return; }
    setTab('read'); setPageId(null);
    if (st.record) { setRecordId(item.id); }
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
    const item = {
      id, url, title: null, source: null, attribution: 'Added by you', read: false, reactions: [], at: Date.now(),
      thought: thought ? { by: 'You', text: thought, at: Date.now() } : null,
      talk: [], seenAt: Date.now(), watched: false, unwatched: false,
    };
    setCircle(c => ({ ...c, items: [item, ...c.items] }));
    setTab('active');
    setArrived(a => [...a, id]);
    setTimeout(() => setArrived(a => a.filter(x => x !== id)), 1200);
  };

  // ---- the driver: one button per beat, each reachable by hand as well -----
  const beat = (id) => {
    setHome(false); setRecordId(null); setPageId(null); setMembers(false);
    if (id === 'add') { setAddOpen(true); return; }
    if (id === 'arrive') {
      const nid = 'a' + Date.now();
      const item = {
        id: nid, ...D9_DROP, attribution: 'Added by Priya N.', read: false, at: Date.now(),
        reactions: [{ name: 'Marcus T.', glyph: window.RX_GLYPHS[0], intensity: 0.6, at: Date.now() }],
        thought: { by: 'Priya N.', text: 'Not our usual thing. Read the first two pages and see if you carry on.', at: Date.now() },
        talk: [window.PGD9Data.T('Marcus T.', 'I carried on. Cleared an evening for it.', Date.now() - 60e3, window.RX_GLYPHS[0], 0.6)],
        seenAt: Date.now(), watched: false, unwatched: false,
      };
      setCircle(c => ({ ...c, items: [item, ...c.items] }));
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
      // Somebody speaks while you are away. The tab is deliberately left where
      // it is: whether you find out at all is part of what is being judged.
      const targets = items.filter(i => i.read && window.d9Watching(i) && (i.talk || []).length)
        .sort((a, b) => (b.talk || []).length - (a.talk || []).length).slice(0, 2);
      if (!targets.length) return;
      const said = [
        'Coming back to this after the outage. The second half reads differently now.',
        'Late to this. The bit I keep thinking about is the one nobody has mentioned.',
      ];
      targets.forEach((target, n) => {
        const mine = (target.talk || []).filter(t => t.by === 'You');
        patch(target.id, i => ({
          ...i,
          talk: [...(i.talk || []), { id: 'd' + Date.now() + n, by: n ? 'Nadia F.' : 'Dev K.', text: said[n], at: Date.now(),
            glyph: window.RX_GLYPHS[n ? 1 : 3], intensity: 0.7, replyTo: mine.length ? mine[mine.length - 1].id : null }],
          reactions: [...(i.reactions || []), { name: n ? 'Nadia F.' : 'Dev K.', glyph: window.RX_GLYPHS[n ? 1 : 3], intensity: 0.7, at: Date.now() }],
        }));
      });
      setVisited(v => v.filter(x => !targets.some(t => t.id === x)));
      return;
    }
  };

  // ---- the feed -----------------------------------------------------------
  let list = items.filter(i => tab === 'read' ? i.read : !i.read);
  if (tab === 'read' && st.sortRead) list = st.sortRead(list);
  const divAt = (tab === 'read' && st.divideRead)
    ? list.findIndex(i => !(window.d9Watching(i) && (i.talk || []).length)) : -1;

  const retProps = { wanted, st, ctx, goTo, travelId, tab };

  const feed = (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
        padding: isApp ? '16px 16px 112px' : '28px 24px 120px',
        '--circ-feed-pad-top': isApp ? '16px' : '28px',
        display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tab === 'read' && st.returnFeedTop && st.returnFeedTop(retProps)}
        {list.length === 0
          ? <window.EmptyState tab={tab} onStartCircle={() => {}} />
          : list.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx === divAt && idx > 0 && <window.FeedDivider />}
              <div data-d9-card={item.id}>
                <window.CircGlow glow={glowId === item.id} rise={arrived.includes(item.id)}>
                  <window.D9Card item={item} tab={tab} user={user} st={st} ctx={ctx} />
                </window.CircGlow>
              </div>
            </React.Fragment>
          ))}
      </div>
    </main>
  );

  const pageItem = pageId ? byId(pageId) : null;
  const closePage = () => { if (pageItem) seen(pageItem.id); setPageId(null); };
  const onMembers = !pageItem && members;
  const subView = pageItem ? { title: 'The card', onBack: closePage }
    : onMembers ? { title: 'Circle settings', onBack: () => setMembers(false) }
    : null;

  const content = pageItem
    ? <window.D9CardPage item={pageItem} ctx={ctx} wanted={wanted} st={st} goTo={goTo} />
    : onMembers
      ? <window.MembersSurface space={circle} isChampion championName="You"
          onInvite={() => {}} onManageFunding={() => {}} onCancelFunding={() => {}}
          onRename={() => {}} onRemoveMember={() => {}} onStartCircle={() => {}} onLeave={() => {}} />
      : (
        <React.Fragment>
          <window.Tabs active={tab} onChange={(t) => setTab(t)} />
          {tab === 'read' && st.returnAbove && (
            <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
              padding: isApp ? '16px 16px 0' : '28px 24px 0' }}>{st.returnAbove(retProps)}</div>
          )}
          {feed}
        </React.Fragment>
      );

  // Re-key the app CONTENT on a state change so chrome swaps land cleanly — but
  // never the rail, which is the rig's own chrome and must keep its scroll place.
  const keyedContent = <React.Fragment key={stateId}>{content}</React.Fragment>;

  const rail = (
    <window.D9Rail stateId={stateId} onPick={pick} onBeat={beat}
      viewport={viewport} onViewport={setViewport} onReset={() => reset(null)} />
  );

  const shell = isApp ? (
    <window.AppShellNative
      isMobile user={user} spaces={[]} currentId={circle.id} space={home ? null : circle}
      showMembers isHome={home} subView={home ? null : subView}
      onHome={() => { closePage(); setMembers(false); setHome(true); }} onManageAccount={() => {}} onSignOut={() => {}}
      onMembers={() => setMembers(true)}
      onAdd={() => setAddOpen(true)} canAdd={!pageItem && !onMembers}>
      {home
        ? <main style={{ flex: 1, width: '100%' }}>
            <div style={{ padding: '20px 16px calc(24px + env(safe-area-inset-bottom, 0px))' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 6px 16px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>discourse v9</span>
                <span style={{ font: '600 20px/1.25 var(--font-sans)', letterSpacing: '-0.015em', color: 'var(--color-fg-1)' }}>Five ways it could work</span>
              </div>
              <window.D9Rail home stateId={stateId} onPick={(id) => { pick(id); setHome(false); }} onBeat={(b) => { setHome(false); beat(b); }}
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
      {!isApp && !pageItem && !onMembers && <window.FAB onClick={() => setAddOpen(true)} expanded={addOpen} isMobile={false} />}
      <window.D9Add open={addOpen} isMobile={isApp} st={st} onClose={() => setAddOpen(false)} onAdd={addLink} />
      {reacting && (
        <window.D9Flow item={byId(reacting.id) || reacting} st={st} user={user} ctx={ctx}
          onCommit={commit} onOpenRecord={openRecord} onClose={() => setReacting(null)} />
      )}
      {recordItem && st.record && st.record({ item: recordItem, ctx, onClose: () => { seen(recordItem.id); setRecordId(null); } })}
      {confirm && (
        <window.ConfirmDialog kind={confirm.kind}
          onConfirm={() => { setCircle(c => ({ ...c, items: c.items.filter(i => i.id !== confirm.item.id) })); setConfirm(null); }}
          onCancel={() => setConfirm(null)} />
      )}
    </React.Fragment>
  );

  const tree = <React.Fragment>{shell}{overlays}</React.Fragment>;

  return framed ? (
    <div className="circ-stage">
      <div className="circ-phone"><div className="circ-phone-clip"><div className="circ-phone-screen">{tree}</div></div></div>
    </div>
  ) : tree;
};

ReactDOM.createRoot(document.getElementById('root')).render(<D9App />);
