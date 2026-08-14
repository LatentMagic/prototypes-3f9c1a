// ============================================================================
// Discourse v9 — adding a link, with the thought attached inside the same act.
// Surface geometry and mount choreography are AddReveal's (app/feed.jsx),
// unchanged: bottom sheet on a phone, popover on a desktop canvas.
//
// v8's miss: all five states put a bare one-line field under the URL box, so
// attaching read as a form field rather than as saying something. Five surfaces
// here, each committing to a different idea of what writing a thought IS.
// ============================================================================
const D9_URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const D9_URL_IN_TEXT = /(https?:\/\/[^\s]+|(?:[a-z0-9-]+\.)+(?:com|org|net|dev|io|ca|co|uk|so|ai|me|blog|news|to|sh|xyz|gov|edu)(?:\/[^\s]*)?)/i;
const { D9Write: AW } = window;

const D9UrlLine = ({ value, onChange, error, inputRef, mono = true, quiet = false }) => (
  <window.Field ref={inputRef} name="add-url" mono={mono} type="text" inputMode="url"
    placeholder="example.com/article" value={value} error={error}
    onChange={onChange} style={quiet ? { fontSize: 14, minHeight: 40, padding: '9px 12px' } : undefined} />
);

// ---- 1 · THE PREVIEW -------------------------------------------------------
// The link is settled first in one quiet line, then the room. Beneath it the
// card assembles itself as you type: you write the thought seeing exactly how
// the circle will read it, which is the only thing a preview is for.
const D9AddPreview = ({ urlField, url, thought, setThought }) => {
  const host = url.trim() ? window.d9HostOf(url.trim()) : null;
  return (
    <React.Fragment>
      {urlField}
      <AW value={thought} onChange={setThought} lines={2} max={160} rule frame="box"
        label="Your thought" placeholder="Say what made you add it. One or two lines." />
      <div style={{ marginTop: 14, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-sunken)', padding: 12 }}>
        <span style={{ display: 'block', font: '500 10.5px/1 var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-fg-3)', marginBottom: 9 }}>on the card</span>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-2)', padding: '11px 13px' }}>
          <span style={{ display: 'block', font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{host || 'the source'}</span>
          <span style={{ display: 'block', marginTop: 4, font: '600 15px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>The page&rsquo;s own title</span>
          {thought.trim() ? (
            <div style={{ marginTop: 8, borderLeftWidth: 2, borderLeftStyle: 'solid', borderLeftColor: 'var(--color-sage)', paddingLeft: 11 }}>
              <p style={{ margin: 0, font: '400 14px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{thought}</p>
              <span style={{ display: 'block', marginTop: 3, font: '600 12px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>You</span>
            </div>
          ) : (
            <p style={{ margin: '8px 0 0', font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-3)' }}>A bare link is fine. Nothing else appears.</p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

// ---- 2 · THE BYLINE --------------------------------------------------------
// Your face and your name are already on the plate before you type, so the
// thought is signed by construction — you are speaking, not filling a field.
const D9AddByline = ({ urlField, thought, setThought }) => (
  <React.Fragment>
    {urlField}
    <div style={{ background: 'var(--color-surface-sunken)', borderRadius: 14, padding: '12px 13px 13px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <window.Avatar name="You" size={22} accent />
        <span style={{ flex: 1, font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>You, adding it</span>
        <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>optional</span>
      </div>
      <AW value={thought} onChange={setThought} lines={3} max={260} frame="box"
        placeholder="What the circle should know before they read it." />
    </div>
  </React.Fragment>
);

// ---- 3 · ONE CANVAS --------------------------------------------------------
// One surface, no second field. Paste the link anywhere in what you are writing
// and it lifts itself out into a chip: adding and saying are literally the same
// gesture, and the link stops being the form's subject.
const D9AddCanvas = ({ url, setUrl, thought, setThought, error, inputRef }) => {
  const onChange = (v) => {
    const m = v.match(D9_URL_IN_TEXT);
    if (m && !url) {
      setUrl(m[0]);
      setThought(v.replace(m[0], '').replace(/\s{2,}/g, ' ').trim());
      return;
    }
    setThought(v);
  };
  return (
    <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: error ? 'var(--color-destructive)' : 'var(--color-border-1)',
      borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', padding: 12 }}>
      {url ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, maxWidth: '100%', marginBottom: 10,
          background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-pill)', padding: '5px 6px 5px 11px' }}>
          <window.Icon name="link" size={13} color="var(--color-fg-3)" />
          <span style={{ minWidth: 0, font: '500 12.5px/1.3 var(--font-mono)', color: 'var(--color-fg-1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url.replace(/^https?:\/\//, '')}</span>
          <button type="button" onClick={() => { setUrl(''); }} aria-label="Take the link back out"
            style={{ display: 'inline-flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
              background: 'transparent', borderWidth: 0, borderRadius: '50%', cursor: 'pointer', color: 'var(--color-fg-3)', flexShrink: 0 }}>
            <window.Icon name="x" size={13} />
          </button>
        </div>
      ) : null}
      <textarea ref={inputRef} value={thought} rows={4}
        placeholder={url ? 'And say something about it, if you want to.' : 'Paste a link. Say something about it, or don\u2019t.'}
        onChange={(e) => onChange(e.target.value.slice(0, 300).replace(/\n/g, ' '))}
        style={{ width: '100%', boxSizing: 'border-box', resize: 'none', overflow: 'hidden', display: 'block',
          borderWidth: 0, background: 'transparent', padding: 0,
          font: '400 15px/1.6 var(--font-sans)', color: 'var(--color-fg-1)' }} />
      <div aria-hidden="true" style={{ height: 2, marginTop: 8, background: 'var(--color-border-2)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: ((1 - Math.min(1, thought.length / 300)) * 100) + '%', background: 'var(--color-border-strong)', opacity: 0.5, transition: 'width 120ms linear' }} />
      </div>
      {error && (
        <div role="alert" style={{ display: 'flex', gap: 6, marginTop: 9, font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-destructive)' }}>
          <window.Icon name="x" size={14} /><span>{error}</span>
        </div>
      )}
    </div>
  );
};

// ---- 4 · THE PLATE --------------------------------------------------------
// The thought is written on the same leaf it will be read on, with the mark's
// ring already in the gutter — the shape carries over from the popover to the
// card without translation.
const D9AddPlate = ({ urlField, thought, setThought }) => (
  <React.Fragment>
    <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)', borderRadius: 'var(--radius-lg)',
      padding: '13px 14px 13px 12px', display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
      <span aria-hidden="true" style={{ flexShrink: 0, width: 14, height: 14, marginTop: 4, borderRadius: '50%',
        borderWidth: 3.5, borderStyle: 'solid', borderColor: 'var(--color-sage)' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <AW value={thought} onChange={setThought} lines={2} max={180} rule frame="plain"
          placeholder="Your thought, if you have one." />
      </div>
    </div>
    {urlField}
  </React.Fragment>
);

// ---- 5 · THE SPINE --------------------------------------------------------
// Inverted, because in this state the thought IS the card's headline: what you
// say leads, and the link follows as its citation.
const D9AddSpine = ({ urlField, thought, setThought }) => (
  <React.Fragment>
    <AW value={thought} onChange={setThought} lines={2} max={200} frame="plain" size={17}
      placeholder="What are you handing the circle?" />
    <div aria-hidden="true" style={{ height: 1, background: 'var(--color-border-2)', margin: '12px 0 14px' }} />
    <span style={{ display: 'block', font: '500 10.5px/1 var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-fg-3)', marginBottom: 8 }}>and the link</span>
    {urlField}
  </React.Fragment>
);

const D9Add = ({ open, isMobile, st, onClose, onAdd }) => {
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
    if (!D9_URL_RE.test(v)) { setError('That doesn\u2019t look like a valid URL. Check it and try again.'); return; }
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
        position: 'fixed', right: 32, bottom: 100, width: 400, zIndex: 121, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto',
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-overlay)',
      };

  const urlField = (
    <D9UrlLine inputRef={inputRef} value={url} error={error} quiet={st.addQuietUrl}
      onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }} />
  );

  const body = st.add
    ? st.add({ urlField, url, setUrl, thought, setThought, error, inputRef })
    : urlField;

  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 120,
        background: isMobile ? 'var(--color-scrim)' : 'transparent',
        opacity: isMobile ? (shown ? 1 : 0) : 1,
        transition: isMobile ? 'opacity var(--duration-slow) ease-in-out' : 'none',
      }} />
      <form role="dialog" aria-label="Add a link" onSubmit={submit} style={surface}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 'var(--space-4)' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: '600 15px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{st.addTitle || 'Add a link'}</div>
            {st.addSub && <div style={{ marginTop: 2, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>{st.addSub}</div>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{
            background: 'transparent', borderWidth: 0, padding: 6, margin: -6, cursor: 'pointer',
            color: 'var(--color-fg-2)', display: 'inline-flex', flexShrink: 0 }}><window.Icon name="x" size={18} /></button>
        </div>
        {body}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <window.Button type="button" variant="secondary" onClick={onClose}>Cancel</window.Button>
          <window.Button type="submit" variant="primary">{st.addSubmit || 'Add'}</window.Button>
        </div>
      </form>
    </React.Fragment>
  );
};

Object.assign(window, { D9Add, D9AddPreview, D9AddByline, D9AddCanvas, D9AddPlate, D9AddSpine });
