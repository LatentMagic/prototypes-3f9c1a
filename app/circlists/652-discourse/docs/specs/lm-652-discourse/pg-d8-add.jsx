// ============================================================================
// Discourse v8 — adding a link, with the thought attached inside the same flow.
// Surface geometry, mount choreography and validation are AddReveal's
// (app/feed.jsx), unchanged: bottom sheet on a phone, popover on a desktop
// canvas. What each state supplies is the body — where the thought is written
// and what bounds it.
// ============================================================================
const D8_URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

const D8Add = ({ open, isMobile, st, onClose, onAdd }) => {
  const [url, setUrl] = React.useState('');
  const [thought, setThought] = React.useState('');
  const [error, setError] = React.useState(null);
  const inputRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  const [render, setRender] = React.useState(open);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setRender(true);
      let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    setShown(false);
    if (!isMobile) { setRender(false); return; }
    const t = setTimeout(() => setRender(false), 240);
    return () => clearTimeout(t);
  }, [open, isMobile]);

  React.useEffect(() => {
    if (open) {
      invokerRef.current = document.activeElement;
      setUrl(''); setThought(''); setError(null);
      const id = setTimeout(() => inputRef.current && inputRef.current.focus({ preventScroll: true }), 60);
      return () => clearTimeout(id);
    } else if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus({ preventScroll: true });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!render) return null;

  const submit = (e) => {
    e.preventDefault();
    const v = url.trim();
    if (!D8_URL_RE.test(v)) { setError('That doesn\u2019t look like a valid URL. Check it and try again.'); return; }
    setError(null);
    onAdd(/^https?:\/\//i.test(v) ? v : 'https://' + v, thought.trim());
    onClose();
  };

  const surface = isMobile
    ? {
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 121,
        background: 'var(--color-surface)', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: 'var(--space-5) var(--space-5) calc(var(--space-5) + env(safe-area-inset-bottom, 0px))',
        boxShadow: 'var(--shadow-overlay)', maxHeight: 'calc(100% - 24px)', overflowY: 'auto',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      }
    : {
        position: 'fixed', right: 32, bottom: 100, width: 380, zIndex: 121, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto',
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-1)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-overlay)',
      };

  const urlField = (
    <window.Field ref={inputRef} name="add-url" mono type="text" inputMode="url"
      placeholder="example.com/article" value={url}
      onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }} error={error} />
  );

  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 120,
        background: isMobile ? 'var(--color-scrim)' : 'transparent',
        opacity: isMobile ? (shown ? 1 : 0) : 1,
        transition: isMobile ? 'opacity var(--duration-slow) ease-in-out' : 'none',
      }} />
      <form role="dialog" aria-label="Add a link" onSubmit={submit} style={surface}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <div style={{ font: '600 15px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{st.addTitle || 'Add a link'}</div>
          <button type="button" onClick={onClose} aria-label="Close" style={{
            background: 'transparent', border: 0, padding: 6, margin: -6, cursor: 'pointer',
            color: 'var(--color-fg-2)', display: 'inline-flex' }}><window.Icon name="x" size={18} /></button>
        </div>
        {st.add ? st.add({ urlField, url, thought, setThought }) : urlField}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <window.Button type="button" variant="secondary" onClick={onClose}>Cancel</window.Button>
          <window.Button type="submit" variant="primary">{st.addSubmit || 'Add'}</window.Button>
        </div>
      </form>
    </React.Fragment>
  );
};

Object.assign(window, { D8Add });
