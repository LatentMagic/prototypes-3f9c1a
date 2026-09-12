// ============================================================================
// BIZ-136 — leaving a circle. The RIG: the switcher, the viewport control, and
// the root.
// ----------------------------------------------------------------------------
// The switcher is app/config.jsx's own aid, matched rather than reinvented: a
// floating draggable pill of equal halves, drag position persisted, a drag
// swallowing the click that would otherwise follow it. That drag logic is a
// COPY (ConfigLauncher's onPointerDown / clamp effect) because config.jsx
// exports only the whole launcher and this pill carries different halves; the
// classes it draws with — .circ-config-wrap, .circ-launcher, .circ-launcher-half
// and the whole .circ-config-* modal set — are the app's own, used unmodified.
// If this rig's pill is wanted anywhere else, the fix is to export the drag
// hook from app/config.jsx rather than copy it twice.
//
// Three halves switch the variation IN PLACE. Nothing about where you are
// standing lives in a variation: route, circle, tab, lens, scroll and the
// seeded mutations are all held by useLcApp above the chrome, so A → C
// re-renders the frame and leaves the moment alone. The fourth half opens the
// card that says what each variation is arguing and what it costs — the pill
// says WHAT, the card says WHY.
// ============================================================================
const LC_KEY = 'pg_leaving_v1';

const lcLoad = () => {
  try { return JSON.parse(localStorage.getItem(LC_KEY) || 'null') || {}; } catch (e) { return {}; }
};
const lcSave = (v) => { try { localStorage.setItem(LC_KEY, JSON.stringify(v)); } catch (e) {} };

// ---- The pill — copied drag behaviour, the app's own classes ---------------
const LcSwitcher = ({ value, onChange, onInfo, infoOpen }) => {
  const [pos, setPos] = React.useState(() => {
    const v = lcLoad().pill;
    return v && typeof v.x === 'number' ? v : null;
  });
  const dragRef = React.useRef({ dragging: false, moved: false });
  const wrapRef = React.useRef(null);

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
      setPos(st.last);
    };
    const up = () => {
      st.dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (st.moved && st.last) lcSave({ ...lcLoad(), pill: st.last });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // Keep a restored position inside the current viewport (mount + resize).
  React.useEffect(() => {
    const clamp = () => setPos((p) => {
      if (!p) return p;
      const el = wrapRef.current;
      const w = el ? el.offsetWidth : 184, h = el ? el.offsetHeight : 44, pad = 8;
      const x = Math.max(pad, Math.min(p.x, window.innerWidth - w - pad));
      const y = Math.max(pad, Math.min(p.y, window.innerHeight - h - pad));
      return (x === p.x && y === p.y) ? p : { x, y };
    });
    clamp();
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, []);

  const tapped = (fn) => { if (dragRef.current.moved) { dragRef.current.moved = false; return; } fn(); };
  // A dragged position replaces the resting one wholesale, transform included —
  // the resting place is centred with translateX(-50%), and leaving that on a
  // dragged pill would offset it by half its width.
  const style = pos ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto', transform: 'none' } : undefined;

  return (
    <div className={'circ-config-wrap' + (pos ? '' : ' lc-wrap')} ref={wrapRef} style={style}>
      <div className="circ-launcher" style={{ cursor: 'grab', touchAction: 'none' }}>
        {LC_VARIATIONS.map((v) => (
          <button key={v.id} className="circ-launcher-half lc-half" onPointerDown={onPointerDown}
            onClick={() => tapped(() => onChange(v.id))}
            aria-pressed={v.id === value} data-open={v.id === value ? '1' : undefined}
            aria-label={'Variation ' + v.id + ' — ' + v.name} title={v.id + ' — ' + v.name + ' (drag to move)'}>
            {v.id}
          </button>
        ))}
        <button className="circ-launcher-half" onPointerDown={onPointerDown}
          onClick={() => tapped(onInfo)} aria-haspopup="dialog" aria-expanded={infoOpen}
          data-open={infoOpen ? '1' : undefined} aria-label="About the three variations"
          title="What each one is arguing — drag to move">
          {/* The list glyph, exactly as app/config.jsx's second half uses it:
              this half opens a register of the three, not a settings modal. */}
          <Icon name="feed" size={17} />
        </button>
      </div>
    </div>
  );
};

// ---- The card behind the fourth half ---------------------------------------
// The app's own Config modal, drawn with the app's own classes. It holds the
// viewport control (build-playground's Auto / Mobile) and the stance and cost
// of each variation, with the current one open.
const LcInfoCard = ({ value, onChange, viewport, onViewport, onReset, onClose }) => {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  React.useEffect(() => {
    const sc = document.querySelector('.circ-phone-screen') || document.scrollingElement || document.documentElement;
    const prev = sc.style.overflow;
    sc.style.overflow = 'hidden';
    return () => { sc.style.overflow = prev; };
  }, []);

  return (
    <div className="circ-config-scrim" style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="The three variations" className="circ-config-modal"
        style={{ opacity: shown ? 1 : 0, transform: shown ? 'scale(1)' : 'scale(0.97)' }}>
        <div className="circ-config-head">
          <div>
            <div className="circ-config-title">Leaving a circle</div>
            <div className="circ-config-subtitle">Three answers to one question. Playground controls — not part of the product.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="circ-config-close"><Icon name="x" size={18} /></button>
        </div>
        <div className="circ-config-body">
          <div className="circ-config-row">
            <div className="circ-config-row-label">Viewport</div>
            <div className="circ-config-seg" role="radiogroup">
              {[{ value: 'auto', label: 'Auto' }, { value: 'mobile', label: 'Mobile' }].map((o) => (
                <button key={o.value} type="button" role="radio" aria-checked={o.value === viewport}
                  className="circ-config-seg-btn" data-active={o.value === viewport ? '1' : undefined}
                  onClick={() => onViewport(o.value)}>{o.label}</button>
              ))}
            </div>
          </div>
          <div className="circ-config-hint">Auto follows the window — under 1024px is the app posture, the same rule main.jsx uses. Mobile forces the app posture on a desktop screen and frames it in the app’s own phone.</div>

          <div className="circ-config-row">
            <div className="circ-config-row-label">Seed data</div>
            <button className="circ-config-btn-secondary" onClick={onReset}>Reset to seeded data</button>
          </div>
          <div className="circ-config-hint">Puts the three circles back as they started and returns you to home.</div>

          <div className="circ-config-sep" />
          <div className="circ-config-eyebrow">The three</div>
          {LC_VARIATIONS.map((v) => (
            <div className="lc-info" key={v.id} data-on={v.id === value ? '1' : undefined}>
              <button className="lc-info-head" onClick={() => { onChange(v.id); onClose(); }}>
                <span className="lc-info-badge">{v.id}</span>
                <span className="lc-info-name">{v.name}</span>
                {v.carried && <span className="lc-info-tag">carried over</span>}
              </button>
              <p className="lc-info-line"><span>Stance</span>{v.stance}</p>
              <p className="lc-info-line lc-info-cost"><span>Cost</span>{v.cost}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- The root ---------------------------------------------------------------
const LcRig = () => {
  const app = useLcApp();
  const saved = lcLoad();
  const [variation, setVariation] = React.useState(() => (
    LC_VARIATIONS.some((v) => v.id === saved.variation) ? saved.variation : 'A'
  ));
  const [viewport, setViewport] = React.useState(() => (saved.viewport === 'mobile' ? 'mobile' : 'auto'));
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [winW, setWinW] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const setVar = (v) => { setVariation(v); lcSave({ ...lcLoad(), variation: v }); };
  const setVp = (v) => { setViewport(v); lcSave({ ...lcLoad(), viewport: v }); };

  // The app posture is the window's own answer — main.jsx's `winW < 1024` —
  // unless the viewport control forces it. Forcing frames it in the app's own
  // phone, which is what the product does for a deliberately forced posture;
  // Auto never frames anything.
  const forced = viewport === 'mobile';
  const isMobile = forced || winW < 1024;
  const current = LC_VARIATIONS.find((v) => v.id === variation) || LC_VARIATIONS[0];

  // The FAB is rendered by the VARIATION, not here: where the one repeated
  // action sits, and in C what it travels with during the pull, is a chrome
  // question. Rendered here it hung over home mid-gesture.
  const screen = (
    <div className="lc-clip">
      <current.Var app={app} isMobile={isMobile} />
      <AddReveal open={app.addOpen} isMobile={isMobile} onClose={() => app.setAddOpen(false)} onAdd={app.addLink} />
      {app.reacting && (
        <SwellReactionFlow item={app.reacting} swellOpts={{ centerDot: true, breath: true, snap: true }}
          onMarkRead={(it, reaction) => app.markRead(it, reaction)}
          onClose={() => app.setReacting(null)} />
      )}
      <div className="circ-vh" role="status" aria-live="polite">{app.announce}</div>
    </div>
  );

  return (
    <React.Fragment>
      {forced ? (
        <div className="circ-stage">
          <div className="circ-phone"><div className="circ-phone-clip"><div className="circ-phone-screen lc-phone-screen">{screen}</div></div></div>
        </div>
      ) : screen}
      <LcSwitcher value={variation} onChange={setVar} onInfo={() => setInfoOpen(true)} infoOpen={infoOpen} />
      {infoOpen && (
        <LcInfoCard value={variation} onChange={setVar} viewport={viewport} onViewport={setVp}
          onReset={app.reset} onClose={() => setInfoOpen(false)} />
      )}
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LcRig />);
