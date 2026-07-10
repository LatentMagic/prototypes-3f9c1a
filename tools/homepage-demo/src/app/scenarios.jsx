// ============================================================================
// Circlists — Scenarios launcher (PROTOTYPE AID, not part of the product).
//
// A floating, draggable button + panel that jumps the app to any staged
// scenario. Extracted to its own file so the delete-only homepage-demo
// derivation can drop the whole aid by deleting THIS one file — main.jsx guards
// on window.ScenariosLauncher and renders nothing when it's absent. No edit to
// main.jsx is needed to remove it.
//
// Owns its own open / drag-position state; receives the scenario list and the
// reset handler as props (both built in main.jsx, where they close over app
// state). The .circ-launcher-* styles live in circlists.html.
// ============================================================================
const { useState: useLState, useRef: useLRef, useEffect: useLEffect } = React;

const ScenariosLauncher = ({ scenarios, onReset }) => {
  const [launcher, setLauncher] = useLState(false);
  // draggable launcher position. null = default bottom-right.
  const [launchPos, setLaunchPos] = useLState(() => {
    try { const v = JSON.parse(localStorage.getItem('circ_launcher_pos') || 'null'); return v && typeof v.x === 'number' ? v : null; } catch (e) { return null; }
  });
  const launchDrag = useLRef({ dragging: false, moved: false, dx: 0, dy: 0, last: null });
  const launchWrapRef = useLRef(null);

  const onLaunchPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    const wrap = e.currentTarget.closest('.circ-launcher-wrap');
    const rect = wrap.getBoundingClientRect();
    const st = launchDrag.current;
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
      setLaunchPos(st.last);
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

  // keep a restored/old position inside the current viewport (mount + resize)
  useLEffect(() => {
    const clamp = () => setLaunchPos(p => {
      if (!p) return p;
      const el = launchWrapRef.current;
      const w = el ? el.offsetWidth : 140, h = el ? el.offsetHeight : 40, pad = 8;
      const x = Math.max(pad, Math.min(p.x, window.innerWidth - w - pad));
      const y = Math.max(pad, Math.min(p.y, window.innerHeight - h - pad));
      return (x === p.x && y === p.y) ? p : { x, y };
    });
    clamp();
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, []);

  // anchoring follows the dragged position
  const launchAnchorRight = launchPos ? (launchPos.x > window.innerWidth * 0.5) : true;
  const launchOpenUp = launchPos ? (launchPos.y > window.innerHeight * 0.5) : true;
  const launchWrapStyle = launchPos ? { left: launchPos.x, top: launchPos.y, right: 'auto', bottom: 'auto' } : undefined;
  const launchPanelStyle = {
    ...(launchAnchorRight ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }),
    ...(launchOpenUp ? { bottom: 'calc(100% + 8px)', top: 'auto' } : { top: 'calc(100% + 8px)', bottom: 'auto' }),
  };

  return (
    <div className="circ-launcher-wrap" ref={launchWrapRef} style={launchWrapStyle}>
      {launcher && (
        <div className="circ-launcher-panel" role="menu" style={launchPanelStyle}>
          {scenarios.map((j, i) => j.h
            ? <div key={'h' + i} className="circ-launcher-head" style={i ? { paddingTop: 12 } : null}>{j.h}</div>
            : <button key={j.k} className="circ-launcher-item" onClick={() => { j.go(); setLauncher(false); }}>{j.k}</button>
          )}
          <div className="circ-launcher-sep" />
          <button className="circ-launcher-item" onClick={() => { onReset(); setLauncher(false); }}>Reset to seeded data</button>
        </div>
      )}
      <button className="circ-launcher-btn" onPointerDown={onLaunchPointerDown} onClick={() => { if (launchDrag.current.moved) { launchDrag.current.moved = false; return; } setLauncher(v => !v); }} aria-expanded={launcher} style={{ cursor: 'grab', touchAction: 'none' }} title="Drag to move">
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)' }} />
        Scenarios
        <Icon name="chevron-down" size={14} style={{ transform: launcher ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </button>
    </div>
  );
};

Object.assign(window, { ScenariosLauncher });
