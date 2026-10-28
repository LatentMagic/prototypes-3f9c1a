// ============================================================================
// Kit — the Config pill (PROTOTYPE AID, not part of the product).
//
// A floating, draggable pill of up to three halves, all prototype aids and none
// part of the product:
//   settings glyph → Config. Review settings only: modes you hold while looking.
//   list glyph     → States (app/states-ui.jsx). Where you GO — a state to jump
//                    to, and a link to hand someone.
//   check glyph    → QA (app/qa.jsx). The states to check for work in flight.
//
// The split is the point: a setting is a mode you hold, a state is an address you
// open. An address needs a register of its own (app/states.jsx) before
// `?state=` can mean anything.
//
// Extracted to its own file so a build can drop the whole aid by leaving THIS
// one file out — main.jsx guards on
// window.ConfigLauncher and renders nothing when it's absent. The States half
// only appears when window.StatesPalette is loaded too.
//
// Owns its own open state + the pill's drag position; everything the modal
// controls is handed in as props from main.jsx, where the real state lives. The
// .kit-config-* / .kit-launcher-* styles live in index.html.
//
// PRODUCT ROWS do not go in this file. A product publishes window.ConfigExtra
// (here app/gs-config.jsx), built from the contract published below:
//
//   ConfigGroup({ title, scope, children })  scope="global" joins the Global
//                                            section; omitted = its own section
//   ConfigRow({ label, value, onChange, options: [{ value, label }], hint })
//   ConfigAction({ label, onClick, hint })   a one-shot event
//   ConfigNote({ children })                 a short "does not apply" line
//
// The modal: a rail of sections (Global first, then one per feature group)
// beside the selected section's rows. Below 640px it is a bottom sheet that
// drills in: the section list, then one section under a back control.
// ============================================================================
const { useState: useCState, useRef: useCRef, useEffect: useCEffect,
        useLayoutEffect: useCLayoutEffect, useContext: useCContext } = React;

const CONFIG_GLOBAL = 'Global';
const CONFIG_PHONE = '(max-width: 639px)';
const ConfigCtx = React.createContext(null);

const ConfigLauncher = ({ statesGroups, onGoState, onOpenStatesIndex,
                         onReset, layout, onLayoutChange, platform, onPlatformChange }) => {
  const [open, setOpen] = useCState(false);
  const [statesOpen, setStatesOpen] = useCState(false);
  const [qaOpen, setQaOpen] = useCState(false);
  // draggable Config pill position. null = default bottom-right.
  const [btnPos, setBtnPos] = useCState(() => {
    try { const v = JSON.parse(localStorage.getItem('kit_launcher_pos') || 'null'); return v && Number.isFinite(v.x) && Number.isFinite(v.y) ? v : null; } catch (e) { return null; }
  });
  const dragRef = useCRef({ dragging: false, moved: false, dx: 0, dy: 0, last: null });
  const wrapRef = useCRef(null);
  const invokerRef = useCRef(null);

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    const wrap = e.currentTarget.closest('.kit-config-wrap');
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
      if (st.moved && st.last) { try { localStorage.setItem('kit_launcher_pos', JSON.stringify(st.last)); } catch (e) {} }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // KEEP: the pill always sits inside the viewport, after a resize or with a position saved at another size.
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
  // QA (app/qa.jsx): hidden only when the file is absent; an empty list shows its empty state.
  const QaPalette = window.QaPalette;
  const hasQa = hasStates && !!QaPalette;

  return (
    <div className="kit-config-wrap" ref={wrapRef} style={wrapStyle}>
      <div className="kit-launcher" style={{ cursor: 'grab', touchAction: 'none' }}>
        <button className="kit-launcher-half" onPointerDown={onPointerDown}
          onClick={() => tapped(() => openAt(setOpen))}
          aria-haspopup="dialog" aria-expanded={open} data-open={open ? '1' : undefined}
          aria-label="Config" title="Config — drag to move">
          <Icon name="settings" size={20} />
        </button>
        {hasStates && (
          <button className="kit-launcher-half" onPointerDown={onPointerDown}
            onClick={() => tapped(() => openAt(setStatesOpen))}
            aria-haspopup="dialog" aria-expanded={statesOpen} data-open={statesOpen ? '1' : undefined}
            aria-label="States" title="States — drag to move">
            <Icon name="list" size={20} />
          </button>
        )}
        {hasQa && (
          <button className="kit-launcher-half" onPointerDown={onPointerDown}
            onClick={() => tapped(() => openAt(setQaOpen))}
            aria-haspopup="dialog" aria-expanded={qaOpen} data-open={qaOpen ? '1' : undefined}
            aria-label="QA" title="QA — drag to move">
            <Icon name="check" size={20} />
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
          layout={layout} onLayoutChange={onLayoutChange}
          platform={platform} onPlatformChange={onPlatformChange}
          onClose={() => closeAt(setOpen)}
        />
      )}
    </div>
  );
};

// Drawn in the kit Icon's stroke (24 grid, 2px, round): the kit set has no info, chevron-right, back or event mark.
const CONFIG_GLYPHS = {
  info: <React.Fragment><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16.5" /><line x1="12" y1="7.5" x2="12" y2="7.6" /></React.Fragment>,
  next: <polyline points="9 6 15 12 9 18" />,
  back: <polyline points="15 6 9 12 15 18" />,
  fire: <polygon points="7 5 18 12 7 19 7 5" />,
};
const ConfigGlyph = ({ name, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{CONFIG_GLYPHS[name]}</svg>
);

const configSectionOf = (title, scope) => (scope === 'global' ? CONFIG_GLOBAL : title);

// Children with fragments opened and false/null dropped, so a group can sort its actions from its rows.
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
  <button type="button" className="kit-config-info" aria-expanded={open} aria-label={label} onClick={onToggle}>
    <ConfigGlyph name="info" size={16} />
  </button>
);

// ---- Contract: one row of choices ----
// KEEP: options are separate bordered chips that wrap onto a new line, never a track that scrolls sideways.
const ConfigRow = ({ label, value, onChange, options, hint }) => {
  const [hintOpen, setHintOpen] = useCState(false);
  return (
    <div className="kit-config-row">
      <div className="kit-config-row-head">
        <span className="kit-config-row-label">{label}</span>
        {hint && <ConfigInfo open={hintOpen} onToggle={() => setHintOpen((v) => !v)} label={'About ' + label} />}
      </div>
      <div className="kit-config-seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}
            className="kit-config-seg-btn" data-active={o.value === value ? '1' : undefined}
            onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
      {hint && hintOpen && <div className="kit-config-tip">{hint}</div>}
    </div>
  );
};

// ---- Contract: a one-shot event. Rendered in its group's Events strip. ----
// KEEP: the .kit-config-action class is what the modal's click-capture replays after closing, so an animated act plays on a clear screen.
const ConfigAction = ({ label, onClick }) => (
  <button type="button" className="kit-config-action"
    onClick={() => { if (typeof onClick === 'function') onClick(); }}>
    <ConfigGlyph name="fire" size={12} />{label}
  </button>
);

// ---- Contract: a short "does not apply" line among a group's rows ----
const ConfigNote = ({ children }) => <div className="kit-config-note">{children}</div>;

// ---- Contract: a group. Registers its section with the modal; renders only while that section is selected. ----
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
    <section className="kit-config-group">
      {section === CONFIG_GLOBAL && <h3 className="kit-config-group-heading">{title}</h3>}
      {rest.length > 0 && <div className="kit-config-rows">{rest}</div>}
      {actions.length > 0 && <ConfigEvents actions={actions} />}
    </section>
  );
};

const ConfigEvents = ({ actions }) => {
  const [hintOpen, setHintOpen] = useCState(false);
  const hints = actions.filter((a) => a.props.hint);
  return (
    <div className="kit-config-events">
      <div className="kit-config-events-head">
        <span className="kit-config-events-title">Events</span>
        <span className="kit-config-events-sub">Fires once, then closes Config</span>
        {hints.length > 0 && <ConfigInfo open={hintOpen} onToggle={() => setHintOpen((v) => !v)} label="About these events" />}
      </div>
      {hintOpen && hints.map((a) => (
        <div key={a.key} className="kit-config-tip"><b>{a.props.label}:</b> {a.props.hint}</div>
      ))}
      <div className="kit-config-events-list">{actions}</div>
    </div>
  );
};

// The section open last time; null until one is chosen this page load, so the phone sheet first opens on its section list.
let configLastSection = null;

const ConfigModal = ({ onReset, layout, onLayoutChange, platform, onPlatformChange, onClose }) => {
  const isApp = platform === 'app';
  const phone = useConfigPhone();
  const [shown, setShown] = useCState(false);
  const [active, setActive] = useCState(configLastSection || CONFIG_GLOBAL);
  const [drilled, setDrilled] = useCState(!!configLastSection);
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
    const target = el.querySelector(phone && drilled ? '.kit-config-back'
      : phone ? '.kit-config-rail-btn' : '.kit-config-rail-btn[aria-current="true"]');
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
  // Lock whatever is scrolling behind the modal (app/primitives.jsx). Released on close.
  useCEffect(kitLockScroll, []);

  // KEEP: one-shot events act on the app behind the modal, some with motion. Intercept, play the exit, replay the click on a clear screen, then close; the action's own handler never closes Config.
  const onPaneClickCapture = (e) => {
    const btn = e.target.closest && e.target.closest('.kit-config-action');
    if (!btn || btn.dataset.replay === '1') return;
    e.preventDefault(); e.stopPropagation();
    setShown(false);
    setTimeout(() => { btn.dataset.replay = '1'; btn.click(); onClose(); }, 190);
  };

  const inSection = phone && drilled;
  const features = sections.filter((s) => s !== CONFIG_GLOBAL);
  const railBtn = (s, sub) => (
    <button key={s} type="button" className="kit-config-rail-btn"
      aria-current={!phone && s === active ? 'true' : undefined}
      onClick={() => choose(s)}>
      <span className="kit-config-rail-text">
        <span className="kit-config-rail-name">{s}</span>
        {sub && <span className="kit-config-rail-sub">{sub}</span>}
      </span>
      <span className="kit-config-rail-chev"><ConfigGlyph name="next" size={18} /></span>
    </button>
  );

  const Extra = window.ConfigExtra;
  return (
    <div className="kit-config-dialog-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Config" ref={dialogRef} className="kit-config-dialog"
        data-shown={shown ? '1' : undefined} data-view={inSection ? 'section' : 'list'}>
        <div className="kit-config-dialog-head">
          {inSection ? (
            <button type="button" className="kit-config-back" onClick={() => setDrilled(false)}>
              <ConfigGlyph name="back" size={20} /><span>Config</span>
            </button>
          ) : (
            <div className="kit-config-dialog-head-text">
              <div className="kit-config-dialog-title">Config</div>
              <div className="kit-config-dialog-subtitle">Prototype controls, not part of the product.</div>
            </div>
          )}
          <button type="button" onClick={onClose} aria-label="Close" className="kit-config-dialog-close"><Icon name="x" size={18} /></button>
        </div>

        <div className="kit-config-main">
          <nav className="kit-config-rail" aria-label="Config sections">
            {railBtn(CONFIG_GLOBAL, 'Whole prototype')}
            {features.length > 0 && <div className="kit-config-rail-label">Features</div>}
            {features.map((s) => railBtn(s))}
          </nav>

          <div className="kit-config-pane" aria-label={active} onClickCapture={onPaneClickCapture}>
            <h2 className="kit-config-pane-title">{active}</h2>
            <ConfigCtx.Provider value={ctx}>
              <ConfigGroup title="Review" scope="global">
                {onPlatformChange && (
                  <ConfigRow label="Platform" value={platform || 'web'} onChange={onPlatformChange}
                    options={[{ value: 'web', label: 'Web' }, { value: 'app', label: 'Mobile' }]}
                    hint="Mobile renders the product as a native app, in a phone with its status bar and home indicator." />
                )}
                {/* Viewport is a web posture; the mobile app is always in the phone, so the row would do nothing. */}
                {isApp
                  ? <ConfigNote>Viewport is for Web only: the mobile app always uses the phone.</ConfigNote>
                  : <ConfigRow label="Viewport" value={layout} onChange={onLayoutChange}
                      options={[{ value: 'auto', label: 'Auto' }, { value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }]}
                      hint="Mobile frames every screen in a phone bezel, with no status bar." />}
                {onReset && <ConfigAction label="Reset to seeded data" onClick={onReset} />}
              </ConfigGroup>
              {Extra && <Extra onClose={onClose} />}
            </ConfigCtx.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ConfigLauncher, ConfigGroup, ConfigRow, ConfigAction, ConfigNote });
