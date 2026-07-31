// ============================================================================
// Circlists — Config launcher (PROTOTYPE AID, not part of the product).
//
// A floating, draggable button that opens a centered config modal: staged
// scenarios to jump the app to, plus review settings (viewport, preview gate,
// seed data) that don't belong scattered as one-off scenario entries. Extracted
// to its own file so the delete-only homepage-demo derivation can drop the
// whole aid by deleting THIS one file — main.jsx guards on window.ConfigLauncher
// and renders nothing when it's absent. No edit to main.jsx is needed to remove it.
//
// Owns its own open state + the button's drag position; everything the modal
// controls (scenario groups, reset, gate, viewport) is handed in as props from
// main.jsx, where the real state lives. The .circ-config-* styles live in
// circlists.html.
// ============================================================================
const { useState: useCState, useRef: useCRef, useEffect: useCEffect } = React;

const ConfigLauncher = ({ groups, onReset, gateOn, onGateChange, layout, onLayoutChange,
                         platform, onPlatformChange, mobilePayments, onMobilePaymentsChange,
                         showTest, onShowTestChange, live, onLiveChange, liveActions }) => {
  const [open, setOpen] = useCState(false);
  // draggable launcher-button position. null = default bottom-right.
  const [btnPos, setBtnPos] = useCState(() => {
    try { const v = JSON.parse(localStorage.getItem('circ_launcher_pos') || 'null'); return v && typeof v.x === 'number' ? v : null; } catch (e) { return null; }
  });
  const dragRef = useCRef({ dragging: false, moved: false, dx: 0, dy: 0, last: null });
  const wrapRef = useCRef(null);
  const invokerRef = useCRef(null);

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    const wrap = e.currentTarget.closest('.circ-config-wrap');
    const rect = wrap.getBoundingClientRect();
    const st = dragRef.current;
    st.dragging = true; st.moved = false;
    st.dx = e.clientX - rect.left; st.dy = e.clientY - rect.top;
    st.w = rect.width; st.h = rect.height; st.ox = e.clientX; st.oy = e.clientY;
    const move = (ev) => {
      if (!st.dragging) return;
      if (Math.hypot(ev.clientX - st.ox, ev.clientY - st.oy) > 4) st.moved = true;
      const pad = 8;
      const x = Math.max(pad, Math.min(ev.clientX - st.dx, window.innerWidth - st.w - pad));
      const y = Math.max(pad, Math.min(ev.clientY - st.dy, window.innerHeight - st.h - pad));
      st.last = { x, y };
      setBtnPos(st.last);
    };
    const up = () => {
      st.dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (st.moved && st.last) { try { localStorage.setItem('circ_launcher_pos', JSON.stringify(st.last)); } catch (e) {} }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // keep a restored/old button position inside the current viewport (mount + resize)
  useCEffect(() => {
    const clamp = () => setBtnPos(p => {
      if (!p) return p;
      const el = wrapRef.current;
      const w = el ? el.offsetWidth : 140, h = el ? el.offsetHeight : 40, pad = 8;
      const x = Math.max(pad, Math.min(p.x, window.innerWidth - w - pad));
      const y = Math.max(pad, Math.min(p.y, window.innerHeight - h - pad));
      return (x === p.x && y === p.y) ? p : { x, y };
    });
    clamp();
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, []);

  const wrapStyle = btnPos ? { left: btnPos.x, top: btnPos.y, right: 'auto', bottom: 'auto' } : undefined;

  const openModal = () => { invokerRef.current = document.activeElement; setOpen(true); };
  const closeModal = () => {
    setOpen(false);
    if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus();
  };

  return (
    <div className="circ-config-wrap" ref={wrapRef} style={wrapStyle}>
      <button className="circ-config-btn" onPointerDown={onPointerDown}
        onClick={() => { if (dragRef.current.moved) { dragRef.current.moved = false; return; } openModal(); }}
        aria-haspopup="dialog" aria-expanded={open} style={{ cursor: 'grab', touchAction: 'none' }} title="Drag to move">
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
        Config
        <Icon name="settings" size={14} style={{ color: open ? 'var(--color-accent)' : 'currentColor' }} />
      </button>
      {open && (
        <ConfigModal
          groups={groups} onReset={onReset}
          gateOn={gateOn} onGateChange={onGateChange}
          layout={layout} onLayoutChange={onLayoutChange}
          platform={platform} onPlatformChange={onPlatformChange}
          mobilePayments={mobilePayments} onMobilePaymentsChange={onMobilePaymentsChange}
          showTest={showTest} onShowTestChange={onShowTestChange}
          live={live} onLiveChange={onLiveChange} liveActions={liveActions}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// ---- Small self-contained segmented control (review-settings rows only) ----
const ConfigSeg = ({ options, value, onChange }) => (
  <div className="circ-config-seg" role="radiogroup">
    {options.map((o) => (
      <button key={o.value} type="button" role="radio" aria-checked={o.value === value}
        className="circ-config-seg-btn" data-active={o.value === value ? '1' : undefined}
        onClick={() => onChange(o.value)}>{o.label}</button>
    ))}
  </div>
);

// ---- The modal itself ----
const ConfigModal = ({ groups, onReset, gateOn, onGateChange, layout, onLayoutChange,
                       platform, onPlatformChange, mobilePayments, onMobilePaymentsChange,
                       showTest, onShowTestChange, live, onLiveChange, liveActions, onClose }) => {
  const isApp = platform === 'app';
  const [arrivalCount, setArrivalCount] = useCState(1);
  const [shown, setShown] = useCState(false);
  useCEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);

  useCEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock whatever's actually scrolling behind the modal — the phone-frame's
  // inner screen when forced-mobile, otherwise the document itself — so a
  // scroll gesture that starts on the scrim/card never falls through to the
  // feed behind. Restored on close.
  useCEffect(() => {
    const scroller = document.querySelector('.circ-phone-screen') || document.scrollingElement || document.documentElement;
    const prevOverflow = scroller.style.overflow;
    scroller.style.overflow = 'hidden';
    return () => { scroller.style.overflow = prevOverflow; };
  }, []);

  return (
    <div className="circ-config-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Config" className="circ-config-modal"
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'scale(1)' : 'scale(0.97)' }}>
        <div className="circ-config-head">
          <div>
            <div className="circ-config-title">Config</div>
            <div className="circ-config-subtitle">Prototype controls — not part of the product.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="circ-config-close"><Icon name="x" size={18} /></button>
        </div>

        <div className="circ-config-body">
          <div className="circ-config-eyebrow">Review settings</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Platform</div>
            <ConfigSeg value={platform || 'web'} onChange={onPlatformChange} options={[
              { value: 'web', label: 'Web' }, { value: 'app', label: 'Mobile' },
            ]} />
          </div>
          <div className="circ-config-hint">Mobile renders the product as a native mobile app — bottom navigation, sheets, no floating button — on the same shared state. Always shown in a phone.</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Viewport</div>
            <ConfigSeg value={layout} onChange={onLayoutChange} options={[
              { value: 'auto', label: 'Auto' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' },
            ]} />
          </div>
          <div className="circ-config-hint">Web posture only. Mobile frames every screen in a phone bezel, regardless of window size.{isApp ? ' — The mobile app overrides this and always uses the phone.' : ''}</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Mobile payments</div>
            <ConfigSeg value={mobilePayments ? 'on' : 'off'} onChange={(v) => onMobilePaymentsChange(v === 'on')} options={[
              { value: 'off', label: 'Off' }, { value: 'on', label: 'On' },
            ]} />
          </div>
          <div className="circ-config-hint">Mobile only. Off, funding and checkout hand off to the web; on, the wizard runs in the app. Web mode always takes payment.</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Preview gate</div>
            <ConfigSeg value={gateOn ? 'on' : 'off'} onChange={(v) => onGateChange(v === 'on')} options={[
              { value: 'off', label: 'Off' }, { value: 'on', label: 'On' },
            ]} />
          </div>
          <div className="circ-config-hint">When on, New circle and Account dead-end in the sign-up gate.</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">TEST circles</div>
            <ConfigSeg value={showTest ? 'on' : 'off'} onChange={(v) => onShowTestChange(v === 'on')} options={[
              { value: 'on', label: 'Shown' }, { value: 'off', label: 'Hidden' },
            ]} />
          </div>
          <div className="circ-config-hint">Hides the two TEST demo circles from every circle list, for clean screenshots. They stay in state, so the scenarios that use them still work.</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Seed data</div>
            <button className="circ-config-btn-secondary" onClick={onReset}>Reset to seeded data</button>
          </div>
          <div className="circ-config-hint">Clears local state and restages the default circles.</div>

          <div className="circ-config-sep" />

          {/* ---- Liveliness --------------------------------------------------
              Staging only. The grammar itself — the age, the glow, the waterline,
              the receipt — is the product, not a setting. The timed check ships ON
              and unhurried; all this does is hurry it, or fire arrivals directly so
              the grammar has something to react to. */}
          {live && (
            <React.Fragment>
              <div className="circ-config-eyebrow">Liveliness</div>

              <div className="circ-config-row">
                <div className="circ-config-row-label">Timed check</div>
                <ConfigSeg value={live.activity} onChange={(v) => onLiveChange('activity', v)} options={[
                  { value: 'off', label: 'Off' }, { value: 'slow', label: 'Slow' }, { value: 'fast', label: 'Fast' },
                ]} />
              </div>
              <div className="circ-config-hint">The app’s own check (slow ≈ 45s is what ships, fast ≈ 7s for review). In the circle you are in, arrivals wait behind the New pill; elsewhere they land and light that circle’s dot. Some are left unsurfaced, so a rail refresh has something to find.</div>

              <div className="circ-config-row">
                <div className="circ-config-row-label">Count</div>
                <div className="circ-config-stepper">
                  <button type="button" aria-label="Fewer" onClick={() => setArrivalCount(n => Math.max(1, n - 1))}>−</button>
                  <span>{arrivalCount}</span>
                  <button type="button" aria-label="More" onClick={() => setArrivalCount(n => Math.min(20, n + 1))}>+</button>
                </div>
              </div>

              <div className="circ-config-row">
                <div className="circ-config-row-label">Stage an arrival</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button className="circ-config-btn-secondary" onClick={() => { liveActions.here(arrivalCount); onClose(); }}>In this circle</button>
                  <button className="circ-config-btn-secondary" onClick={() => { liveActions.elsewhere(arrivalCount); onClose(); }}>In another</button>
                </div>
              </div>
              <div className="circ-config-hint">{arrivalCount} link{arrivalCount === 1 ? '' : 's'} each. In this circle {arrivalCount === 1 ? 'it waits' : 'they wait'} behind the New pill on Active — on Read the dot lights instead; in another {arrivalCount === 1 ? 'it lands' : 'they land'} and light that circle’s dot.</div>

              <div className="circ-config-row">
                <div className="circ-config-row-label">Waiting for a refresh</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button className="circ-config-btn-secondary" onClick={() => { liveActions.queue(arrivalCount); onClose(); }}>Unsurfaced arrival</button>
                  <button className="circ-config-btn-secondary" onClick={() => { liveActions.deleteElsewhere(); onClose(); }}>Delete by another member</button>
                </div>
              </div>
              <div className="circ-config-hint">Nothing surfaces either one. Selecting this circle in the rail lands the arrival{arrivalCount === 1 ? '' : 's'} directly and takes the deleted link away — that gesture is the only thing that finds them.</div>
            </React.Fragment>
          )}

          <div className="circ-config-sep" />

          <div className="circ-config-eyebrow">Scenarios</div>
          <div className="circ-config-hint" style={{ marginBottom: 12 }}>Jump the app straight to any staged flow.</div>
          <div className="circ-config-groups">
            {groups.map((g) => (
              <div className="circ-config-group" key={g.title}>
                <div className="circ-config-group-title">{g.title}</div>
                {g.items.map((it) => (
                  <button key={it.k} className="circ-config-item" onClick={() => { it.go(); onClose(); }}>{it.k}</button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ConfigLauncher });


// ============================================================================
// buildScenarios(api) — the scenario groups + staging actions (also part of
// this deletable aid). Closes over the setters it's handed each render; reads
// seed fixtures from window.CircSeed. main.jsx guards on window.buildScenarios,
// so removing this file removes the setups too.
// ============================================================================
function buildScenarios(api) {
  const {
    spaces, STATE_KEY,
    setSpaces, setUser, setCurrentId, setTab, setRoute, setLoadingFeed, setHoldLoading,
    setOtc, setPostAuthTo, setManageIntent,
    enterSpace, openCreateSpace,
  } = api;
  const { M, IT, seedSpaces, DEFAULT_USER } = window.CircSeed;

  // ---- scenario setups ----
  const reset = () => {
    try { localStorage.removeItem(STATE_KEY); } catch (e) {}
    const s = seedSpaces(DEFAULT_USER.email);
    setSpaces(s); setUser(DEFAULT_USER); setCurrentId('sp-backend'); setTab('active'); enterSpace('sp-backend');
  };
  const goSpace = (id, toRoute) => {
    setUser(u => u && u.email ? u : DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setCurrentId(id); setTab('active');
    if (toRoute) setRoute(toRoute); else enterSpace(id);
  };

  // restage the dormant TEST - Weekend Reads to demo a given role/dormancy, then enter it
  const stageDormant = (cfg) => {
    setSpaces(prev => prev.map(s => s.id === 'sp-test-weekend'
      ? { ...s, funded: false, champion: cfg.champion, championEmail: cfg.championEmail, dormancy: cfg.dormancy } : s));
    setCurrentId('sp-test-weekend'); setRoute('space'); setLoadingFeed(false);
  };

  // ---- Loading lane — hold each loading state at rest for review ----------
  // Two states, matching the product: the in-shell feed indicator (held by
  // keeping loadingFeed true, no auto-clear) and the one app-level full-screen
  // state (held by routing to an app-level loading route with the app's
  // holdLoading flag set, which no-ops the auto-advance in main.jsx). The
  // per-flow routes all render the same AppLoading, so one representative
  // (google-return) covers the app-level state for review.
  const goFeedLoading = () => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setHoldLoading(false);
    setCurrentId('sp-backend'); setTab('active'); setRoute('space');
    setLoadingFeed(true);
  };
  const holdInterstitial = (toRoute) => {
    setUser(DEFAULT_USER);
    if (spaces.length === 0) setSpaces(seedSpaces(DEFAULT_USER.email));
    setLoadingFeed(false);
    setHoldLoading(true);
    setRoute(toRoute);
  };

  // Space with no items — lands on the empty-feed state directly.
  const goEmptyFeed = () => {
    setUser(DEFAULT_USER);
    const emptySpace = {
      id: 'sp-empty', name: 'Reading Room', funded: true, dormancy: null,
      champion: 'You', championEmail: DEFAULT_USER.email,
      members: [M('You', DEFAULT_USER.email), M('Sam R.', 'sam.r@example.com')],
      items: [],
    };
    setSpaces(prev => [emptySpace, ...prev.filter(s => s.id !== 'sp-empty')]);
    setCurrentId('sp-empty'); setTab('active'); setRoute('space'); setLoadingFeed(false);
  };

  // Space at the 10-member cap (champion view → "Space is full" on invite).
  const goFullSpaceManage = () => {
    setUser(DEFAULT_USER);
    const fullSpace = {
      id: 'sp-full', name: 'Design Guild', funded: true, dormancy: null, champion: 'You', championEmail: DEFAULT_USER.email,
      members: [
        M('You', DEFAULT_USER.email), M('Sam R.', 'sam.r@example.com'), M('Priya N.', 'priya.n@example.com'),
        M('Marcus T.', 'marcus.t@example.com'), M('Joe M.', 'joe.m@example.com'), M('Ada L.', 'ada.l@example.com'),
        M('Ravi P.', 'ravi.p@example.com'), M('Nina K.', 'nina.k@example.com'), M('Tom B.', 'tom.b@example.com'),
        M('Lena F.', 'lena.f@example.com'),
      ],
      items: [
        IT('https://www.nngroup.com/articles/ten-usability-heuristics/', 'Added by Ada L.'),
        IT('https://rauno.me/craft/interaction-design', 'Added by Nina K.'),
        IT('https://www.figma.com/blog/the-quiet-design-system/', 'Added by Sam R.'),
      ],
    };
    setSpaces(prev => [fullSpace, ...prev.filter(s => s.id !== 'sp-full')]);
    setCurrentId('sp-full'); setTab('active'); setRoute('members');
  };

  // Grouped scenario flows. The preview-gate on/off pair now lives as a
  // dedicated review-setting toggle in the modal (see ConfigModal) rather
  // than two scenario entries — keep this list to staged app flows only.
  const GROUPS = [
    { title: 'Onboarding', items: [
      { k: 'Sign up \u2192 first circle', go: () => { setSpaces([]); setRoute('signup'); } },
      { k: 'Sign in (new device)', go: () => setRoute('signin') },
      { k: 'Forgot password', go: () => setRoute('recovery') },
      { k: 'One-time code \u2014 errors', go: () => { setOtc({ context: 'device', error: { expired: true } }); setPostAuthTo('space'); setRoute('otc'); } },
    ] },
    { title: 'The feed', items: [
      { k: 'The reading loop', go: () => goSpace('sp-backend') },
      { k: 'Empty feed (no links)', go: goEmptyFeed },
      { k: 'No circles yet', go: () => { setSpaces([]); setCurrentId(null); setRoute('home'); } },
    ] },
    { title: 'Loading states', items: [
      { k: 'Feed \u2014 in a circle (in-shell)', go: goFeedLoading },
      { k: 'App \u2014 full screen', go: () => holdInterstitial('google-return') },
    ] },
    { title: 'Members & funding', items: [
      { k: 'Members \u2014 champion (you)', go: () => goSpace('sp-backend', 'members') },
      { k: 'Members \u2014 non-champion', go: () => goSpace('sp-book', 'members') },
      { k: 'Members \u2014 circle full', go: goFullSpaceManage },
      { k: 'Manage funding (champion)', go: () => { goSpace('sp-backend'); setManageIntent('manage'); setRoute('manage-interstitial'); } },
      { k: 'Create + fund a circle', go: () => openCreateSpace() },
    ] },
    { title: 'Dormant circle', items: [
      { k: 'Dormant \u2014 champion re-fund', go: () => stageDormant({ champion: 'You', championEmail: DEFAULT_USER.email, dormancy: 'terminal' }) },
      { k: 'Dormant \u2014 champion suspended', go: () => stageDormant({ champion: 'You', championEmail: DEFAULT_USER.email, dormancy: 'suspended' }) },
      { k: 'Dormant \u2014 non-champion', go: () => stageDormant({ champion: 'Priya N.', championEmail: 'priya.n@example.com', dormancy: 'terminal' }) },
    ] },
    { title: 'Invitations', items: [
      { k: 'Accept invite \u2014 funded', go: () => goSpace('sp-book') },
      { k: 'Accept invite \u2014 dormant', go: () => stageDormant({ champion: 'Priya N.', championEmail: 'priya.n@example.com', dormancy: 'terminal' }) },
      { k: 'Accept invite \u2014 invalid', go: () => setRoute('invalid-invite') },
      { k: 'Accept invite \u2014 circle full', go: () => setRoute('space-full') },
    ] },
    { title: 'Account', items: [
      { k: 'Change email & password', go: () => goSpace('sp-backend', 'account') },
      { k: 'Email & password via SSO', go: () => { setUser({ ...DEFAULT_USER, email: 'sam.rivera@googlemail.com', ssoProvider: 'Google' }); goSpace('sp-backend', 'account'); } },
    ] },
  ];

  return { groups: GROUPS, reset };
}

Object.assign(window, { buildScenarios });
