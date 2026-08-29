// ============================================================================
// Discourse v10 — the app. The real shell, the real cards, the real Swell, with
// ONE option of ONE chapter mounted inside it. Everything below the rig's chrome
// is the product; the rig owns only which option is live.
//
// The baseline is v9 state 1 (the door opens a room) with the chapter's own axis
// swapped out, so two options in a chapter differ by exactly the thing being
// judged and nothing else. In the return chapter the baseline's own return
// affordance is removed first, so an option is never seen next to v9's answer.
// ============================================================================
const { d9Circle: D10Seed, D9_DROP: D10_DROP } = window.PGD9Data;
const D10_KEY = 'pg_d10_v1';
const d10Saved = (() => { try { return JSON.parse(localStorage.getItem(D10_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const D10App = () => {
  const [optId, setOptId] = React.useState(d10Saved.optId || 'r1');
  const [viewport, setViewport] = React.useState(d10Saved.viewport || 'auto');
  const [winW, setWinW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem(D10_KEY, JSON.stringify({ optId, viewport })); } catch (e) {}
  }, [optId, viewport]);

  const opt = window.d10Opt(optId);
  const st = React.useMemo(() => ({
    ...window.D9_ROOM,
    ...(opt.chapter === 'n' ? { returnFeedTop: null, returnAbove: null } : {}),
    ...opt.patch,
    id: opt.id, chapter: opt.chapter, name: opt.name,
  }), [optId]);

  const framed = viewport === 'mobile';
  const isApp = framed || winW < 1024;
  React.useEffect(() => {
    document.documentElement.setAttribute('data-circ-posture', isApp ? 'mobile' : 'desktop');
  }, [isApp]);

  const [circle, setCircle] = React.useState(D10Seed);
  const [tab, setTab] = React.useState('active');
  const [home, setHome] = React.useState(() => (d10Saved.viewport || 'auto') === 'mobile' || window.innerWidth < 1024);
  const [addOpen, setAddOpen] = React.useState(false);
  const [reacting, setReacting] = React.useState(null);
  const [recordId, setRecordId] = React.useState(null);
  const [pageId, setPageId] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [arrived, setArrived] = React.useState([]);
  const [members, setMembers] = React.useState(false);
  const [travelId, setTravelId] = React.useState(null);
  const [glowId, setGlowId] = React.useState(null);
  const [visited, setVisited] = React.useState([]);
  const [arrivalOpen, setArrivalOpen] = React.useState(false);
  const [pendingBeat, setPendingBeat] = React.useState(null);
  const user = window.CircSeed.DEFAULT_USER;

  const reset = (id) => {
    setCircle(D10Seed()); setTab('active'); setHome(false);
    setAddOpen(false); setReacting(null); setRecordId(null); setPageId(null);
    setConfirm(null); setArrived([]); setMembers(false);
    setTravelId(null); setGlowId(null); setVisited([]); setArrivalOpen(false);
    window.c10Clear();
    if (id) setOptId(id);
  };

  // Picking an option enters it AND puts you at the moment it lives in: the
  // reaction for a reflection, the add surface for a contribution, somebody
  // speaking for a return. The beat fires after the seed has been replaced.
  const pick = (id) => {
    const o = window.d10Opt(id);
    reset(id);
    setArrivalOpen(true);
    if (o.patch && o.patch.homeCircles) { if (isApp) setHome(true); setPendingBeat('return'); return; }
    setPendingBeat(o.beat);
  };
  React.useEffect(() => {
    if (!pendingBeat) return;
    const t = setTimeout(() => { beat(pendingBeat); setPendingBeat(null); }, 40);
    return () => clearTimeout(t);
  }, [pendingBeat, circle]);

  const items = circle.items;
  window.D10_ITEMS = items;
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
    // C5: the open leaf is written on later, and becomes the card's thought.
    setThought: (item, text) => patch(item.id, i => ({ ...i, thought: { by: 'You', text, at: Date.now() } })),
    // C3: a link that answered a conversation leads back to it.
    goToItem: (id) => { const it = byId(id); if (it) goTo(it); },
    toggleWatch: (item) => patch(item.id, i => {
      const auto = /^added by you$/i.test(i.attribution || '') || (i.talk || []).some(t => t.by === 'You');
      const on = window.d9Watching(i);
      return on ? { ...i, watched: false, unwatched: true } : { ...i, watched: !auto, unwatched: false };
    }),
  };

  const wanted = window.d9Wanted(items, st).filter(i => !visited.includes(i.id));

  const goTo = (item) => {
    if (!item) return;
    setHome(false); setMembers(false); setAddOpen(false); setArrivalOpen(false);
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

  // Adding. Two options need more than url + thought, and it rides the pending
  // slot the add surface wrote (C4 a reaction, C3 a conversation to answer).
  const addLink = (url, thought) => {
    const pend = window.D10_PENDING || {};
    const id = 'i' + Date.now();
    const item = {
      id, url, title: (pend.meta && pend.meta.title) || null, source: (pend.meta && pend.meta.source) || null,
      attribution: 'Added by you', read: false,
      reactions: pend.rx ? [pend.rx] : [], at: Date.now(),
      thought: thought ? { by: 'You', text: thought, at: Date.now() } : null,
      answers: pend.answers || null,
      talk: [], seenAt: Date.now(), watched: false, unwatched: false,
    };
    setCircle(c => ({
      ...c,
      items: [item, ...c.items].map(i => (pend.answers && i.id === pend.answers.itemId)
        ? window.d9Say(i, (thought ? thought + ' \u2014 ' : 'Adding this here \u2014 ') + '\u201c' + (window.d9DeriveTitle(url) || window.d9HostOf(url)) + '\u201d',
            { replyTo: (i.talk || []).filter(t => t.by !== 'You').slice(-1).map(t => t.id)[0] || null })
        : i),
    }));
    window.c10Clear();
    setTab('active');
    setArrived(a => [...a, id]);
    setTimeout(() => setArrived(a => a.filter(x => x !== id)), 1200);
  };

  const beat = (id) => {
    setRecordId(null); setPageId(null); setMembers(false);
    if (id !== 'return') setHome(false);
    if (id === 'add') { setAddOpen(true); return; }
    if (id === 'arrive') {
      const nid = 'a' + Date.now();
      const item = {
        id: nid, ...D10_DROP, attribution: 'Added by Priya N.', read: false, at: Date.now(),
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
      const targets = items.filter(i => i.read && window.d9Watching(i) && (i.talk || []).length)
        .sort((a, b) => (b.talk || []).length - (a.talk || []).length).slice(0, 2);
      if (!targets.length) return;
      const said = [
        'Coming back to this after the outage. The second half reads differently now.',
        'Late to this. The bit I keep thinking about is the one nobody has mentioned.',
      ];
      setCircle(c => ({
        ...c,
        items: c.items.map(i => {
          const n = targets.findIndex(t => t.id === i.id);
          if (n < 0) return i;
          const mine = (i.talk || []).filter(t => t.by === 'You');
          return {
            ...i,
            talk: [...(i.talk || []), { id: 'd' + Date.now() + n, by: n ? 'Nadia F.' : 'Dev K.', text: said[n], at: Date.now(),
              glyph: window.RX_GLYPHS[n ? 1 : 3], intensity: 0.7, replyTo: mine.length ? mine[mine.length - 1].id : null }],
            reactions: [...(i.reactions || []), { name: n ? 'Nadia F.' : 'Dev K.', glyph: window.RX_GLYPHS[n ? 1 : 3], intensity: 0.7, at: Date.now() }],
          };
        }),
      }));
      setVisited(v => v.filter(x => !targets.some(t => t.id === x)));
      setArrivalOpen(true);
      return;
    }
  };

  let list = items.filter(i => tab === 'read' ? i.read : !i.read);
  if (tab === 'read' && st.sortRead) list = st.sortRead(list);
  const divAt = (tab === 'read' && st.divideRead)
    ? list.findIndex(i => !(window.d9Watching(i) && (i.talk || []).length)) : -1;

  const retProps = { wanted, st, ctx, goTo, travelId, tab, isApp };

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

  // Circle-scope return: above the tabs, so it belongs to the circle and not to
  // a shelf. N6 stays while there is something; N7 says it once, on arrival.
  const circleScope = (
    <React.Fragment>
      {st.circleBar && st.circleBar(retProps)}
      {st.arrival && arrivalOpen && st.arrival({ ...retProps, onDismiss: () => setArrivalOpen(false) })}
    </React.Fragment>
  );

  const content = pageItem
    ? <window.D9CardPage item={pageItem} ctx={ctx} wanted={wanted} st={st} goTo={goTo} />
    : onMembers
      ? <window.MembersSurface space={circle} isChampion championName="You"
          onInvite={() => {}} onManageFunding={() => {}} onCancelFunding={() => {}}
          onRename={() => {}} onRemoveMember={() => {}} onStartCircle={() => {}} onLeave={() => {}} />
      : (
        <React.Fragment>
          {circleScope}
          <window.Tabs active={tab} onChange={(t) => setTab(t)} />
          {tab === 'read' && st.returnAbove && (
            <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
              padding: isApp ? '16px 16px 0' : '28px 24px 0' }}>{st.returnAbove(retProps)}</div>
          )}
          {feed}
        </React.Fragment>
      );

  const keyedContent = <React.Fragment key={optId}>{content}</React.Fragment>;

  // N8's surface: the circle carries the signal in the circles list, before you
  // are inside it. Home in the app posture; the rail's own circle slot on the web.
  const circlesBlock = st.homeCircles
    ? <window.D10Circles space={circle} wanted={wanted} st={st} rail={!isApp}
        onEnter={() => { setHome(false); if (wanted.length) goTo(wanted[0]); }} />
    : null;

  const rail = (
    <window.D10Rail optId={optId} onPick={pick} onBeat={beat} circles={circlesBlock}
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
              {circlesBlock ? <div style={{ marginBottom: 22 }}>{circlesBlock}</div> : null}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 6px 16px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>discourse v10</span>
                <span style={{ font: '600 20px/1.25 var(--font-sans)', letterSpacing: '-0.015em', color: 'var(--color-fg-1)' }}>Three questions, nineteen answers</span>
              </div>
              <window.D10Rail home optId={optId} onPick={(id) => { pick(id); }} onBeat={(b) => { setHome(false); beat(b); }}
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
      <window.D9Add open={addOpen} isMobile={isApp} st={st} onClose={() => { setAddOpen(false); window.c10Clear(); }} onAdd={addLink} />
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

ReactDOM.createRoot(document.getElementById('root')).render(<D10App />);
