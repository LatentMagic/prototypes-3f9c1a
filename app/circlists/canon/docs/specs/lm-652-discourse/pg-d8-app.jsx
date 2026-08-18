// ============================================================================
// Discourse v8 — the app. The real shell, the real cards, the real Swell, with
// one state's discourse living inside it. Everything below the chrome is the
// product; the rig owns only which state is mounted.
// ============================================================================
const { d8Circle: D8Seed, D8_DROP } = window.PGD8Data;
const D8_KEY = 'pg_d8_v1';
const d8Saved = (() => { try { return JSON.parse(localStorage.getItem(D8_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const D8App = () => {
  const [stateId, setStateId] = React.useState(d8Saved.stateId || 'disc');
  const [variantId, setVariantId] = React.useState(d8Saved.variantId || 'name');
  const [viewport, setViewport] = React.useState(d8Saved.viewport || 'auto');
  const [winW, setWinW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem(D8_KEY, JSON.stringify({ stateId, viewport, variantId })); } catch (e) {}
  }, [stateId, viewport, variantId]);

  const st = window.D8_STATES.find(s => s.id === stateId) || window.D8_STATES[0];
  const framed = viewport === 'mobile';
  const isApp = framed || winW < 1024;
  React.useEffect(() => {
    document.documentElement.setAttribute('data-circ-posture', isApp ? 'mobile' : 'desktop');
  }, [isApp]);

  const [circle, setCircle] = React.useState(D8Seed);
  const [tab, setTab] = React.useState('active');
  // The app posture opens on the list, the way the rig's desktop rail is already
  // in view: entering a state is the same move as entering a circle.
  const [home, setHome] = React.useState(() => (d8Saved.viewport || 'auto') === 'mobile' || window.innerWidth < 1024);
  const [addOpen, setAddOpen] = React.useState(false);
  const [reacting, setReacting] = React.useState(null);
  const [recordId, setRecordId] = React.useState(null);
  const [pageId, setPageId] = React.useState(null);
  const [flipped, setFlipped] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const [arrived, setArrived] = React.useState([]);
  // ---- return: the gathered set, and the travel to a card ------------------
  const [held, setHeld] = React.useState(null);      // state 2: the frozen held-out set
  const [returnOpen, setReturnOpen] = React.useState(false); // state 5: the small screen
  const [pullId, setPullId] = React.useState(null);  // the card being travelled to
  const [pulled, setPulled] = React.useState([]);    // taken out of the set as you go
  const [members, setMembers] = React.useState(false); // the app's own circle settings
  const user = window.CircSeed.DEFAULT_USER;

  const reset = (id) => {
    setCircle(D8Seed()); setTab('active'); setHome(false);
    setAddOpen(false); setReacting(null); setRecordId(null); setPageId(null);
    setFlipped(null); setConfirm(null); setArrived([]);
    setHeld(null); setReturnOpen(false); setPullId(null); setPulled([]); setMembers(false);
    if (id) setStateId(id);
  };
  const pick = (id) => { reset(id); };

  const items = circle.items;
  const byId = (id) => items.find(i => i.id === id) || null;
  const patch = (id, fn) => setCircle(c => ({ ...c, items: c.items.map(i => i.id === id ? fn(i) : i) }));
  const seen = (id) => patch(id, i => ({ ...i, seenAt: Date.now() }));

  const ctx = {
    user,
    flipped,
    onMarkRead: (item) => setReacting(item),
    onDelete: (item) => setConfirm({ kind: 'delete', item }),
    openRecord: (item) => { if (st.record) setRecordId(item.id); else setPageId(item.id); },
    flip: (item) => {
      if (!item) { if (flipped) seen(flipped); setFlipped(null); return; }
      if (flipped && flipped !== item.id) seen(flipped);
      setFlipped(flipped === item.id ? null : item.id);
      if (flipped === item.id) seen(item.id);
    },
    say: (item, text, replyTo) => patch(item.id, i => window.d8Say(i, text, { replyTo })),
    toggleWatch: (item) => patch(item.id, i => {
      const auto = /^added by you$/i.test(i.attribution || '') || (i.talk || []).some(t => t.by === 'You');
      const on = window.d8Watching(i);
      return on ? { ...i, watched: false, unwatched: true } : { ...i, watched: !auto, unwatched: false };
    }),
    attach: (item, text) => patch(item.id, i => ({ ...i, thought: { by: 'You', text, at: Date.now() } })),
  };

  // The gathered set: read, watched, moved since you looked. Cards already
  // travelled to in this sitting drop out of it as you arrive.
  const wanted = window.d8Wanted(items, st).filter(i => !pulled.includes(i.id));

  // The travel. Land on Read, carry the feed to the card, wash it as it
  // arrives, and mark it seen once you are there.
  const goTo = (item) => {
    if (!item) return;
    setHome(false); setPageId(null); setReturnOpen(false); setFlipped(null);
    setTab('read'); setHeld(null); setMembers(false);
    setPulled(p => p.includes(item.id) ? p : [...p, item.id]);
    setPullId(item.id);
  };
  React.useEffect(() => {
    if (!pullId) return;
    const t1 = setTimeout(() => {
      const el = document.querySelector('[data-d8-card="' + pullId + '"]');
      if (!el) return;
      const phone = document.querySelector('.circ-phone-screen');
      const sc = phone || document.scrollingElement || document.documentElement;
      const base = phone ? phone.getBoundingClientRect().top : 0;
      const top = sc.scrollTop + el.getBoundingClientRect().top - base - 84;
      sc.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 80);
    const t2 = setTimeout(() => { seen(pullId); setPullId(null); }, 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pullId]);

  const commit = (item, rx, said) => {
    patch(item.id, i => {
      const talk = said
        ? [...(i.talk || []), { id: 'my' + Date.now(), by: 'You', text: said, at: Date.now(), glyph: rx.glyph || null, intensity: rx.intensity == null ? null : rx.intensity, replyTo: null }]
        : (i.talk || []);
      return { ...i, read: true, reactions: [...(i.reactions || []), rx], talk, seenAt: Date.now() };
    });
  };

  const addLink = (url, thought) => {
    const meta = { url, title: null, source: null };
    const id = 'i' + Date.now();
    const item = {
      id, url, attribution: 'Added by you', read: false, reactions: [], at: Date.now(),
      thought: thought ? { by: 'You', text: thought, at: Date.now() } : null,
      talk: [], seenAt: Date.now(), watched: false, unwatched: false, ...meta,
    };
    setCircle(c => ({ ...c, items: [item, ...c.items] }));
    setTab('active');
    setArrived(a => [...a, id]);
    setTimeout(() => setArrived(a => a.filter(x => x !== id)), 1200);
    if (st.addOpensPage) setPageId(id);
  };

  // ---- the driver: one button per beat, each reachable by hand as well -----
  const beat = (id) => {
    setHome(false); setRecordId(null); setPageId(null); setFlipped(null); setMembers(false);
    if (id === 'add') { setAddOpen(true); return; }
    if (id === 'arrive') {
      const nid = 'a' + Date.now();
      const item = {
        id: nid, ...D8_DROP, attribution: 'Added by Priya N.', read: false, at: Date.now(),
        reactions: [{ name: 'Marcus T.', glyph: window.RX_GLYPHS[0], intensity: 0.6, at: Date.now() }],
        thought: { by: 'Priya N.', text: 'Not our usual thing. Read the first two pages and see if you carry on.', at: Date.now() },
        talk: [window.PGD8Data.T('Marcus T.', 'I carried on. Cleared an evening for it.', Date.now() - 60e3, window.RX_GLYPHS[0], 0.6)],
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
      // it is: whether you find out at all is the thing being judged.
      const targets = items.filter(i => i.read && window.d8Watching(i) && (i.talk || []).length)
        .sort((a, b) => (b.talk || []).length - (a.talk || []).length).slice(0, 2);
      if (!targets.length) return;
      const said = [
        'Coming back to this after the outage. The second half reads differently now.',
        'Late to this. The bit I keep thinking about is the one nobody has mentioned.',
      ];
      targets.forEach((target, n) => patch(target.id, i => ({
        ...i,
        talk: [...(i.talk || []), { id: 'd' + Date.now() + n, by: n ? 'Nadia F.' : 'Dev K.', text: said[n], at: Date.now(), glyph: window.RX_GLYPHS[n ? 1 : 3], intensity: 0.7, replyTo: null }],
        reactions: [...(i.reactions || []), { name: n ? 'Nadia F.' : 'Dev K.', glyph: window.RX_GLYPHS[n ? 1 : 3], intensity: 0.7, at: Date.now() }],
      })));
      setPulled(p => p.filter(x => !targets.some(t => t.id === x)));
      return;
    }
  };

  // ---- the feed -----------------------------------------------------------
  // A state may own the whole arrangement of a tab (the sixth does, because two
  // of its five ideas ARE an arrangement). Everything else keeps the default.
  const arranged = st.arrange
    ? st.arrange({ items, tab, variant: variantId, wanted })
    : (() => {
      let list = items.filter(i => tab === 'read' ? i.read : !i.read);
      if (tab === 'read' && held) list = list.filter(i => held.includes(i.id));
      if (tab === 'read' && st.sortRead) list = st.sortRead(list);
      const d = (tab === 'read' && st.divideRead)
        ? list.findIndex(i => !(window.d8Watching(i) && (i.talk || []).length)) : -1;
      return { list, divAt: d };
    })();
  const visible = arranged.list;
  const divAt = arranged.divAt;
  const retProps = { wanted, st, ctx, goTo, held, setHeld, tab, variant: variantId,
    openRecord: ctx.openRecord, openReturn: () => setReturnOpen(true) };

  const feed = (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
        padding: isApp ? '16px 16px 112px' : '28px 24px 120px',
        '--circ-feed-pad-top': isApp ? '16px' : '28px',
        display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tab === 'read' && st.returnFeedTop && st.returnFeedTop(retProps)}
        {visible.length === 0
          ? <window.EmptyState tab={tab} onStartCircle={() => {}} />
          : visible.map((item, idx) => {
            // The one state where movement is the whole signal: a card that has
            // risen washes once as it arrives at the top, then rests. A card
            // travelled to washes the same way, wherever it sits.
            const lifted = pullId === item.id
              || (tab === 'read' && !!st.sortRead && window.d8HasNew(item, st.countBareReactions));
            const cardTab = st.cardTab ? st.cardTab({ item, tab, variant: variantId }) : tab;
            return (
              <React.Fragment key={item.id}>
                {idx === divAt && idx > 0 && <window.FeedDivider />}
                <div data-d8-card={item.id}>
                  <window.CircGlow glow={lifted} rise={arrived.includes(item.id)}>
                    <window.D8Card item={item} tab={cardTab} user={user} st={st} ctx={ctx} />
                  </window.CircGlow>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </main>
  );

  const pageItem = pageId ? byId(pageId) : null;
  const closePage = () => { if (pageItem) seen(pageItem.id); setPageId(null); };
  const onReturnScreen = !pageItem && returnOpen && !!st.returnScreen;
  const onMembers = !pageItem && !onReturnScreen && members;
  const subView = pageItem ? { title: 'The card', onBack: closePage }
    : onReturnScreen ? { title: st.returnTitle || 'Still talking', onBack: () => setReturnOpen(false) }
    : onMembers ? { title: 'Circle settings', onBack: () => setMembers(false) }
    : null;

  const content = pageItem
    ? <window.D8Page item={pageItem} ctx={ctx} user={user} />
    : onReturnScreen
      ? st.returnScreen({ wanted, st, onOpen: (it) => { setPulled(p => p.includes(it.id) ? p : [...p, it.id]); setReturnOpen(false); ctx.openRecord(it); } })
      : onMembers
        ? (
          <React.Fragment>
            {st.settingsTop && <window.D8SettingsTop wanted={wanted} st={st} variant={variantId}
              onOpen={(it) => { setMembers(false); goTo(it); }} />}
            <window.MembersSurface space={circle} isChampion championName="You"
              onInvite={() => {}} onManageFunding={() => {}} onCancelFunding={() => {}}
              onRename={() => {}} onRemoveMember={() => {}} onStartCircle={() => {}} onLeave={() => {}} />
          </React.Fragment>
        )
        : (
          <React.Fragment>
            <window.Tabs active={tab} onChange={(t) => { setTab(t); setHeld(null); }} />
            {st.returnAbove && st.returnAbove(retProps)}
            {feed}
          </React.Fragment>
        );

  // Re-key the app CONTENT on a state/variant change so chrome swaps land
  // cleanly — but never the rail, which is the rig's own chrome and must keep
  // its scroll position while you work down the list.
  const keyedContent = <React.Fragment key={stateId + ':' + variantId}>{content}</React.Fragment>;

  const rail = (
    <window.D8Rail stateId={stateId} onPick={pick} onBeat={beat} st={st}
      variantId={variantId} onVariant={(v) => { setVariantId(v); setPulled([]); setMembers(false); setTab('active'); }}
      viewport={viewport} onViewport={setViewport} onReset={() => reset(null)} />
  );

  const shell = isApp ? (
    <window.AppShellNative
      isMobile user={user} spaces={[]} currentId={circle.id} space={home ? null : circle}
      showMembers isHome={home} subView={home ? null : subView}
      onHome={() => { closePage(); setMembers(false); setReturnOpen(false); setHome(true); }} onManageAccount={() => {}} onSignOut={() => {}}
      onMembers={() => setMembers(true)}
      onAdd={() => setAddOpen(true)} canAdd={!pageItem && !onReturnScreen && !onMembers}>
      {home
        ? <main style={{ flex: 1, width: '100%' }}>
            <div style={{ padding: '20px 16px calc(24px + env(safe-area-inset-bottom, 0px))' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 6px 16px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>discourse v8</span>
                <span style={{ font: '600 20px/1.25 var(--font-sans)', letterSpacing: '-0.015em', color: 'var(--color-fg-1)' }}>Six ways it could work</span>
              </div>
              <window.D8Rail home stateId={stateId} onPick={(id) => { pick(id); setHome(false); }} onBeat={(b) => { setHome(false); beat(b); }}
                st={st} variantId={variantId} onVariant={(v) => { setVariantId(v); setPulled([]); setMembers(false); setTab('active'); setHome(false); }}
                viewport={viewport} onViewport={setViewport} onReset={() => reset(null)} />
            </div>
          </main>
        : keyedContent}
    </window.AppShellNative>
  ) : (
    <div style={{ display: 'flex', minHeight: 'var(--circ-vh)', background: 'var(--color-canvas)' }}>
      <aside style={{ width: 288, flexShrink: 0, background: 'var(--color-surface-sunken)',
        borderRight: '1px solid var(--color-border-2)', padding: '20px 12px',
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
      {!isApp && !pageItem && !onReturnScreen && !onMembers && <window.FAB onClick={() => setAddOpen(true)} expanded={addOpen} isMobile={false} />}
      <window.D8Add open={addOpen} isMobile={isApp} st={st} onClose={() => setAddOpen(false)} onAdd={addLink} />
      {reacting && (
        <window.D8Flow item={byId(reacting.id) || reacting} st={st} user={user}
          onCommit={commit} onOpenRecord={(it) => setPageId(it.id)} onClose={() => setReacting(null)} />
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

ReactDOM.createRoot(document.getElementById('root')).render(<D8App />);
