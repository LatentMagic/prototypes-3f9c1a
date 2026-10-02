// ============================================================================
// Per-person pricing candidate — one overlay, two patterns (ui-design.md,
// adaptive by exception). On a phone it is a bottom sheet; on desktop it is a
// centred modal. What it says and does is identical; only the pattern changes.
// The boundary is the app's own sheet posture (main.jsx isSheetPosture).
// Rests at its end state with no entrance keyframe, so captures never freeze it
// off screen (GOTCHA.md).
// ============================================================================
// A playground can frame an overlay in place: it sets the pattern and the overlay
// takes no focus and no keys. Absent in the candidate, so nothing changes there.
const PppOverlayFrame = React.createContext(null);
const PppOverlay = ({ title, onClose, children, actions = [] }) => {
  const api = pppApi();
  const frame = React.useContext(PppOverlayFrame);
  const sheet = frame ? frame.sheet : (api ? api.isSheet : true);
  const panelRef = React.useRef(null);
  React.useEffect(() => {
    if (frame) return undefined;
    const invoker = document.activeElement;
    const t = setTimeout(() => { const b = panelRef.current && panelRef.current.querySelector('button'); if (b) b.focus(); }, 40);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); if (invoker && invoker.focus) invoker.focus(); };
  }, []);
  const btns = actions.map((a) => (
    <Button key={a.label} variant={a.variant || 'secondary'} full={sheet} onClick={a.onClick}>{a.label}</Button>
  ));
  return (
    <div className={'ppp-scrim' + (sheet ? ' ppp-scrim-sheet' : '')} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={title} className={sheet ? 'ppp-sheet' : 'ppp-modal'}>
        <h2 className="ppp-overlay-title">{title}</h2>
        {children}
        {btns.length > 0 && <div className={sheet ? 'ppp-actions-stack' : 'ppp-actions-row'}>{sheet ? btns : btns.slice().reverse()}</div>}
      </div>
    </div>
  );
};
window.PppOverlay = PppOverlay;
window.PppOverlayFrame = PppOverlayFrame;
