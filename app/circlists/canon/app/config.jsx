// ============================================================================
// Circlists — the Config pill (PROTOTYPE AID, not part of the product).
//
// A floating, draggable pill of up to three halves, all prototype aids and none
// part of the product:
//   settings glyph → Config. A rail of sections (Global, then one per feature)
//                    beside the chosen section's rows; on a phone, a list you
//                    drill into. Review settings only.
//   list glyph     → States (app/states-ui.jsx). Where you GO — a state to jump
//                    to, and a link to hand someone.
//
// The split is the point: a setting is a mode you hold, a state is an address you
// open. Holding both in one settings modal is what made the old Scenarios list
// confusing, and an address needs a register of its own (app/states.jsx) before
// `?state=` can mean anything.
//
// Extracted to its own file so a build can drop the whole aid by leaving THIS
// one file out — main.jsx guards on
// window.ConfigLauncher and renders nothing when it's absent. The States half
// only appears when window.StatesPalette is loaded too.
//
// Owns its own open state + the pill's drag position; everything the modal
// controls is handed in as props from main.jsx, where the real state lives. The
// .circ-config-* / .circ-launcher-* styles live in circlists.html.
//
// PRODUCT ROWS beyond the props below go in window.ConfigExtra (app/config-extra.jsx),
// built from the contract published at the foot of this file:
//   ConfigGroup({ title, scope, children })  scope="global" joins Global; omitted = its own section
//   ConfigRow({ label, value, onChange, options: [{ value, label }], hint })
//   ConfigAction({ label, onClick, hint })   a one-shot event
//   ConfigNote({ children })                 a short "does not apply" line
// ============================================================================
const { useState: useCState, useRef: useCRef, useEffect: useCEffect,
        useLayoutEffect: useCLayoutEffect, useContext: useCContext } = React;

const CONFIG_GLOBAL = 'Global';
const CONFIG_PHONE = '(max-width: 639px)';
const ConfigCtx = React.createContext(null);
// The section open last time; null until one is chosen this page load, so the phone sheet opens on its list.
let configLastSection = null;

const ConfigLauncher = ({ statesGroups, onGoState, onOpenStatesIndex,
                         onReset, gateOn, onGateChange, layout, onLayoutChange,
                         platform, onPlatformChange, mobilePayments, onMobilePaymentsChange,
                         showTest, onShowTestChange, live, onLiveChange, liveActions,
                         push, onPushStage }) => {
  const [open, setOpen] = useCState(false);
  const [statesOpen, setStatesOpen] = useCState(false);
  const [qaOpen, setQaOpen] = useCState(false);
  // draggable Config pill position. null = default bottom-right.
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

  const openAt = (setter) => { invokerRef.current = document.activeElement; setter(true); };
  const closeAt = (setter) => {
    setter(false);
    if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus();
  };
  // A drag ends on whichever half it started on; the click that follows is not one.
  const tapped = (fn) => { if (dragRef.current.moved) { dragRef.current.moved = false; return; } fn(); };
  const StatesPalette = window.StatesPalette;
  const hasStates = !!StatesPalette && !!statesGroups && statesGroups.length > 0;
  // QA (app/qa.jsx, draft): hidden only when the file is absent; an empty list shows its empty state.
  const QaPalette = window.QaPalette;
  const hasQa = hasStates && !!QaPalette;

  return (
    <div className="circ-config-wrap" ref={wrapRef} style={wrapStyle}>
      <div className="circ-launcher" style={{ cursor: 'grab', touchAction: 'none' }}>
        <button className="circ-launcher-half" onPointerDown={onPointerDown}
          onClick={() => tapped(() => openAt(setOpen))}
          aria-haspopup="dialog" aria-expanded={open} data-open={open ? '1' : undefined}
          aria-label="Config" title="Config — drag to move">
          <Icon name="settings" size={17} />
        </button>
        {hasStates && (
          <button className="circ-launcher-half" onPointerDown={onPointerDown}
            onClick={() => tapped(() => openAt(setStatesOpen))}
            aria-haspopup="dialog" aria-expanded={statesOpen} data-open={statesOpen ? '1' : undefined}
            aria-label="States" title="States — drag to move">
            <Icon name="feed" size={17} />
          </button>
        )}
        {hasQa && (
          <button className="circ-launcher-half" onPointerDown={onPointerDown}
            onClick={() => tapped(() => openAt(setQaOpen))}
            aria-haspopup="dialog" aria-expanded={qaOpen} data-open={qaOpen ? '1' : undefined}
            aria-label="QA" title="QA — drag to move">
            <Icon name="check" size={17} />
          </button>
        )}
      </div>
      {hasQa && qaOpen && (
        <QaPalette statesGroups={statesGroups}
          onGo={(id) => { onGoState(id); closeAt(setQaOpen); }}
          onClose={() => closeAt(setQaOpen)} />
      )}
      {hasStates && statesOpen && (
        <StatesPalette groups={statesGroups}
          onGo={(id) => { onGoState(id); closeAt(setStatesOpen); }}
          onOpenIndex={() => { closeAt(setStatesOpen); onOpenStatesIndex(); }}
          onClose={() => closeAt(setStatesOpen)} />
      )}
      {open && (
        <ConfigModal
          onReset={onReset}
          gateOn={gateOn} onGateChange={onGateChange}
          layout={layout} onLayoutChange={onLayoutChange}
          platform={platform} onPlatformChange={onPlatformChange}
          mobilePayments={mobilePayments} onMobilePaymentsChange={onMobilePaymentsChange}
          showTest={showTest} onShowTestChange={onShowTestChange}
          live={live} onLiveChange={onLiveChange} liveActions={liveActions}
          push={push} onPushStage={onPushStage}
          onClose={() => closeAt(setOpen)}
        />
      )}
    </div>
  );
};

const configSectionOf = (title, scope) => (scope === 'global' ? CONFIG_GLOBAL : title);

// Children with fragments opened and false/null dropped, so a group can sort its
// actions from its rows however the product nested its conditionals.
const configFlatten = (children, prefix = '') => React.Children.toArray(children).flatMap((c) =>
  (c && c.type === React.Fragment
    ? configFlatten(c.props.children, prefix + c.key)
    : [React.isValidElement(c) ? React.cloneElement(c, { key: prefix + c.key }) : c]));

const useConfigPhone = () => {
  const [phone, setPhone] = useCState(() => window.matchMedia(CONFIG_PHONE).matches);
  useCEffect(() => {
    const mq = window.matchMedia(CONFIG_PHONE);
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
};

const ConfigInfo = ({ open, onToggle, label }) => (
  <button type="button" className="circ-config-info" aria-expanded={open} aria-label={label} onClick={onToggle}>
    <Icon name="info" size={16} />
  </button>
);

// ---- Contract: one row of choices ----
// Each option is the design system's Button: the chosen one primary (accent is
// selection), the rest secondary. KEEP: they wrap, never scroll sideways; 44px on a phone.
const ConfigRow = ({ label, value, onChange, options, hint }) => {
  const [hintOpen, setHintOpen] = useCState(false);
  const phone = useConfigPhone();
  return (
    <div className="circ-config-row">
      <div className="circ-config-row-head">
        <span className="circ-config-row-label">{label}</span>
        {hint && <ConfigInfo open={hintOpen} onToggle={() => setHintOpen((v) => !v)} label={'About ' + label} />}
      </div>
      <div className="circ-config-seg" role="group" aria-label={label}>
        {options.map((o) => (
          <Button key={o.value} size={phone ? 'md' : 'sm'} variant={o.value === value ? 'primary' : 'secondary'}
            aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</Button>
        ))}
      </div>
      {hint && hintOpen && <div className="circ-config-tip">{hint}</div>}
    </div>
  );
};

// ---- Contract: a one-shot event, rendered in its group's Events strip ----
// The design system's secondary Button. KEEP: .circ-config-action is what the
// modal's click-capture replays after the exit, so an animated act plays on a clear screen.
const ConfigAction = ({ label, onClick }) => {
  const phone = useConfigPhone();
  return (
    <Button variant="secondary" size={phone ? 'md' : 'sm'} className="circ-config-action"
      onClick={() => { if (typeof onClick === 'function') onClick(); }}>{label}</Button>
  );
};

// ---- Contract: a short "does not apply" line among a group's rows ----
const ConfigNote = ({ children }) => <div className="circ-config-note">{children}</div>;

// ---- Contract: a group. Registers its section with the modal; renders only while selected. ----
const ConfigGroup = ({ title, scope, children }) => {
  const ctx = useCContext(ConfigCtx);
  const id = React.useId();
  const section = configSectionOf(title, scope);
  useCLayoutEffect(() => {
    if (!ctx) return undefined;
    ctx.register(id, section);
    return () => ctx.unregister(id);
  }, [section]);
  if (ctx && ctx.active !== section) return null;
  const items = configFlatten(children);
  const actions = items.filter((c) => c.type === ConfigAction);
  const rest = items.filter((c) => c.type !== ConfigAction);
  return (
    <section className="circ-config-group">
      {section === CONFIG_GLOBAL && <h3 className="circ-config-group-heading">{title}</h3>}
      {rest.length > 0 && <div className="circ-config-rows">{rest}</div>}
      {actions.length > 0 && <ConfigEvents actions={actions} />}
    </section>
  );
};

const ConfigEvents = ({ actions }) => {
  const [hintOpen, setHintOpen] = useCState(false);
  const hints = actions.filter((a) => a.props.hint);
  return (
    <div className="circ-config-events">
      <div className="circ-config-events-head">
        <span className="circ-config-events-title">Events</span>
        <span className="circ-config-events-sub">Fires once, then closes Config</span>
        {hints.length > 0 && <ConfigInfo open={hintOpen} onToggle={() => setHintOpen((v) => !v)} label="About these events" />}
      </div>
      {hintOpen && hints.map((a) => (
        <div key={a.key} className="circ-config-tip"><b>{a.props.label}:</b> {a.props.hint}</div>
      ))}
      <div className="circ-config-events-list">{actions}</div>
    </div>
  );
};

const cfgO = (pairs) => pairs.map(([value, label]) => ({ value, label }));
const cfgOnOff = (v) => v === 'on';

// ---- Sign-in review settings (invite-links-and-sign-in-stops) -------------
// Two facts the prototype cannot learn from a provider. Held on window (never
// localStorage), read by app/auth.jsx at the press.
window.circAuthReview = window.circAuthReview || { apple: 'found', cancel: false };
const ConfigSignInRows = () => {
  const [v, setV] = React.useState(() => ({ ...window.circAuthReview }));
  const set = (patch) => { window.circAuthReview = { ...window.circAuthReview, ...patch }; setV({ ...window.circAuthReview }); };
  return (
    <ConfigGroup title="Sign-in">
      <ConfigRow label="Apple account" value={v.apple} onChange={(x) => set({ apple: x })}
        options={cfgO([['found', 'Found'], ['none', 'None']])}
        hint="Sign in only. None: Continue with Apple stops in place and offers Create a new account or Sign in another way. Sign up is unaffected." />
      <ConfigRow label="Provider sheet" value={v.cancel ? 'cancel' : 'complete'} onChange={(x) => set({ cancel: x === 'cancel' })}
        options={cfgO([['complete', 'Completes'], ['cancel', 'Cancelled']])}
        hint="Cancelled: every Google or Apple press returns to the first step with nothing shown. A sign-in that fails is staged from the Refusals group." />
    </ConfigGroup>
  );
};

const ARRIVAL_COUNTS = [1, 2, 3, 5, 10, 20];

// ---- The modal ----
const ConfigModal = ({ onReset, gateOn, onGateChange, layout, onLayoutChange,
                       platform, onPlatformChange, mobilePayments, onMobilePaymentsChange,
                       showTest, onShowTestChange, live, onLiveChange, liveActions,
                       push, onPushStage, onClose }) => {
  const isApp = platform === 'app';
  const phone = useConfigPhone();
  // Notifications staging. The wait is read from the feature's own schedule
  // (app/push.jsx), so this aid can never disagree with the rule the app runs.
  const pushSnoozes = (push && push.snoozes) || 0;
  const pushWait = window.pushWaitDays ? window.pushWaitDays(pushSnoozes) : 0;
  const askHidden = !!push && pushSnoozes > 0 && Date.now() - (push.snoozeAt || 0) < pushWait * 864e5;
  // One writer for both ask rows, so the count and the phase can never drift.
  const stageAsk = (n, hidden) => {
    const days = window.pushWaitDays ? window.pushWaitDays(n) : 3;
    onPushStage({
      ask: 'pending', snoozes: n,
      snoozeAt: n === 0 ? 0 : (hidden ? Date.now() : Date.now() - (days + 1) * 864e5),
    });
  };
  const [arrivalCount, setArrivalCount] = useCState(1);
  const [shown, setShown] = useCState(false);
  const [active, setActive] = useCState(configLastSection || CONFIG_GLOBAL);
  const [drilled, setDrilled] = useCState(!!configLastSection); // phone only
  const [sections, setSections] = useCState([]);
  const regRef = useCRef(new Map());
  const dialogRef = useCRef(null);

  const syncSections = () => {
    const seen = [];
    regRef.current.forEach((s) => { if (!seen.includes(s)) seen.push(s); });
    const ordered = [CONFIG_GLOBAL, ...seen.filter((s) => s !== CONFIG_GLOBAL)];
    setSections((prev) => (prev.join('|') === ordered.join('|') ? prev : ordered));
  };
  const ctx = {
    active,
    register: (id, section) => { regRef.current.set(id, section); syncSections(); },
    unregister: (id) => { regRef.current.delete(id); syncSections(); },
  };
  const choose = (s) => { setActive(s); setDrilled(true); configLastSection = s; };

  useCEffect(() => {
    if (sections.length && !sections.includes(active)) setActive(CONFIG_GLOBAL);
  }, [sections]);

  useCEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const target = el.querySelector(phone && drilled ? '.circ-config-back'
      : phone ? '.circ-config-rail-btn' : '.circ-config-rail-btn[aria-current="true"]');
    if (target) target.focus({ preventScroll: true });
  }, [phone, drilled, sections.length > 1]); // KEEP: re-run once the feature sections have registered

  useCEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  useCEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock whatever is scrolling behind the modal: the phone-frame's inner screen
  // when forced-mobile, otherwise the document. Restored on close.
  useCEffect(() => {
    const scroller = document.querySelector('.circ-phone-screen') || document.scrollingElement || document.documentElement;
    const prevOverflow = scroller.style.overflow;
    scroller.style.overflow = 'hidden';
    return () => { scroller.style.overflow = prevOverflow; };
  }, []);

  // KEEP: one-shot events act on the app behind the modal, some with motion.
  // Intercept, play the exit, replay the click on a clear screen, then close;
  // the action's own handler never has to close Config.
  const onPaneClickCapture = (e) => {
    const btn = e.target.closest && e.target.closest('.circ-config-action');
    if (!btn || btn.dataset.replay === '1') return;
    e.preventDefault(); e.stopPropagation();
    setShown(false);
    setTimeout(() => { btn.dataset.replay = '1'; btn.click(); onClose(); }, 190);
  };

  const inSection = phone && drilled;
  const features = sections.filter((s) => s !== CONFIG_GLOBAL);
  const railBtn = (s, sub) => (
    <button key={s} type="button" className="circ-config-rail-btn"
      aria-current={!phone && s === active ? 'true' : undefined}
      onClick={() => choose(s)}>
      <span className="circ-config-rail-text">
        <span className="circ-config-rail-name">{s}</span>
        {sub && <span className="circ-config-rail-sub">{sub}</span>}
      </span>
      <span className="circ-config-rail-chev"><Icon name="chevron-right" size={18} /></span>
    </button>
  );

  const Extra = window.ConfigExtra;
  const pushOn = push && window.CircPushSetting; // app/push.jsx is droppable
  const delivers = push && !['ios-tab', 'unsupported'].includes(push.channel);
  return (
    <div className="circ-config-dialog-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Config" ref={dialogRef} className="circ-config-dialog"
        data-shown={shown ? '1' : undefined} data-view={inSection ? 'section' : 'list'}>
        <div className="circ-config-dialog-head">
          {inSection ? (
            <button type="button" className="circ-config-back" onClick={() => setDrilled(false)}>
              <Icon name="chevron-left" size={20} /><span>Config</span>
            </button>
          ) : (
            <div>
              <div className="circ-config-dialog-title">Config</div>
              <div className="circ-config-dialog-subtitle">Prototype controls, not part of the product.</div>
            </div>
          )}
          <button type="button" onClick={onClose} aria-label="Close" className="circ-config-dialog-close"><Icon name="x" size={18} /></button>
        </div>

        <div className="circ-config-main">
          <nav className="circ-config-rail" aria-label="Config sections">
            {railBtn(CONFIG_GLOBAL, 'Whole prototype')}
            {features.length > 0 && <div className="circ-config-rail-label">Features</div>}
            {features.map((s) => railBtn(s))}
          </nav>

          <div className="circ-config-pane" aria-label={active} onClickCapture={onPaneClickCapture}>
            <h2 className="circ-config-pane-title">{active}</h2>
            <ConfigCtx.Provider value={ctx}>
              <ConfigGroup title="Review" scope="global">
                <ConfigRow label="Platform" value={platform || 'web'} onChange={onPlatformChange}
                  options={cfgO([['web', 'Web'], ['app', 'Mobile']])}
                  hint="Mobile renders the product as a native mobile app in a phone: a permanent bottom bar, sheets, and a floating button for adding inside a circle." />
                {isApp
                  ? <ConfigNote>Viewport is for Web only: the mobile app always uses the phone.</ConfigNote>
                  : <ConfigRow label="Viewport" value={layout} onChange={onLayoutChange}
                      options={cfgO([['auto', 'Auto'], ['desktop', 'Desktop'], ['mobile', 'Mobile']])}
                      hint="Mobile frames every screen in a phone bezel, whatever the window size." />}
                <ConfigRow label="Mobile payments" value={mobilePayments ? 'on' : 'off'} onChange={(v) => onMobilePaymentsChange(cfgOnOff(v))}
                  options={cfgO([['off', 'Off'], ['on', 'On']])}
                  hint="Mobile only. Off, funding and checkout hand off to the web; on, the wizard runs in the app. Web always takes payment." />
                <ConfigRow label="Preview gate" value={gateOn ? 'on' : 'off'} onChange={(v) => onGateChange(cfgOnOff(v))}
                  options={cfgO([['off', 'Off'], ['on', 'On']])}
                  hint="On: New circle and Account dead-end in the sign-up gate." />
                <ConfigRow label="TEST circles" value={showTest ? 'on' : 'off'} onChange={(v) => onShowTestChange(cfgOnOff(v))}
                  options={cfgO([['on', 'Shown'], ['off', 'Hidden']])}
                  hint="Hidden removes the two TEST demo circles from every circle list, for clean screenshots. They stay in state." />
                {onReset && <ConfigAction label="Reset to seeded data" onClick={onReset}
                  hint="Clears local state and restages the default circles." />}
              </ConfigGroup>

              <ConfigSignInRows />

              {live && (
                <ConfigGroup title="Liveliness">
                  <ConfigRow label="Timed check" value={live.activity} onChange={(v) => onLiveChange('activity', v)}
                    options={cfgO([['off', 'Off'], ['slow', 'Slow'], ['fast', 'Fast']])}
                    hint="The app's own check: slow (about 45s) is what ships, fast (about 7s) is for review. In the circle you are in, arrivals wait behind the New pill; elsewhere they land and light that circle's dot." />
                  <ConfigRow label="Count" value={arrivalCount} onChange={setArrivalCount}
                    options={ARRIVAL_COUNTS.map((n) => ({ value: n, label: String(n) }))}
                    hint="Links per staged arrival." />
                  <ConfigAction label="Arrival in this circle" onClick={() => liveActions.here(arrivalCount)}
                    hint="Waits behind the New pill on Active; on Read the dot lights instead." />
                  <ConfigAction label="Arrival in another circle" onClick={() => liveActions.elsewhere(arrivalCount)}
                    hint="Lands and lights that circle's dot." />
                  <ConfigAction label="Unsurfaced arrival" onClick={() => liveActions.queue(arrivalCount)}
                    hint="Nothing surfaces it. Selecting this circle in the rail lands it." />
                  <ConfigAction label="Delete by another member" onClick={() => liveActions.deleteElsewhere()}
                    hint="Nothing surfaces it. Selecting this circle in the rail takes the deleted link away." />
                </ConfigGroup>
              )}

              {pushOn && (
                <ConfigGroup title="Notifications">
                  <ConfigRow label="Delivery" value={['ios-tab', 'unsupported'].includes(push.channel) ? push.channel : 'ok'}
                    onChange={(v) => onPushStage({ channel: v })}
                    options={cfgO([['ok', 'Deliverable'], ['ios-tab', 'iOS tab'], ['unsupported', 'In-app']])}
                    hint="iOS tab: an iPhone or iPad in a browser tab; Account names the Home Screen route and the ask never appears. In-app: a browser inside another app; notifications are not mentioned anywhere. Staged, never sniffed." />
                  <ConfigRow label="Device permission" value={push.perm || 'default'}
                    onChange={(v) => onPushStage(v === 'default'
                      ? { perm: 'default', on: false, ask: 'pending', snoozes: 0, snoozeAt: 0 }
                      : { perm: v, on: v === 'granted', ask: 'gone' })}
                    options={cfgO([['default', 'Unasked'], ['granted', 'Allowed'], ['denied', 'Refused']])}
                    hint="The device's own answer. Either answer finishes the ask for good; Unasked returns it to the start of its schedule." />
                  {push.perm === 'granted' ? (
                    <ConfigRow label="In Circlists" value={push.on ? 'on' : 'off'} onChange={(v) => onPushStage({ on: cfgOnOff(v) })}
                      options={cfgO([['on', 'On'], ['off', 'Off']])}
                      hint="The Account switch, held apart from the permission: turning it off keeps the device's answer." />
                  ) : <ConfigNote>In Circlists: off until Device permission is Allowed.</ConfigNote>}
                  {push.perm === 'default' && delivers ? (
                    <React.Fragment>
                      <ConfigRow label="The ask" value={askHidden ? 'hidden' : 'showing'}
                        onChange={(v) => stageAsk(v === 'hidden' ? Math.max(1, pushSnoozes) : pushSnoozes, v === 'hidden')}
                        options={cfgO([['showing', 'Showing'], ['hidden', 'Hidden']])}
                        hint="Shows on Active, in a circle with links." />
                      <ConfigRow label="Dismissals" value={pushSnoozes}
                        onChange={(n) => stageAsk(n, askHidden && n > 0)}
                        options={[0, 1, 2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))}
                        hint={'× hides the ask rather than ending it: it returns 3 days after the first, 7 after the second, then every 30. ' + (pushSnoozes === 0 ? 'Never dismissed, so it is due.' : pushWait + '-day wait now: Hidden leaves it running, Showing stands past it.')} />
                    </React.Fragment>
                  ) : <ConfigNote>{push.perm !== 'default'
                    ? 'The ask and Dismissals: finished once the device has answered. Set Device permission to Unasked to stage them again.'
                    : 'The ask and Dismissals: off while Delivery is not Deliverable.'}</ConfigNote>}
                </ConfigGroup>
              )}

              {Extra && <Extra onClose={onClose} />}
            </ConfigCtx.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ConfigLauncher, ConfigGroup, ConfigRow, ConfigAction, ConfigNote });
