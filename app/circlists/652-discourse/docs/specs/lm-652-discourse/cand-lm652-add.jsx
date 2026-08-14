// ============================================================================
// LM-652 candidate — the Add-a-link popover (item 1). Re-publishes AddReveal:
// same props, same mount choreography, same anchoring as the shipped sheet /
// popover. New: an optional thought written on the warm paper it will land on,
// a Mark-as-read toggle (off by default), and The Swell collapsed beneath it.
// Inspiration for the Swell riding the popover: v10 C4 "It arrives with your
// mark on it" (pg-d10-contribute.jsx) — credited, rethought, not lifted.
// No reveal fires on add: nobody else has reacted to a card just added.
// ============================================================================
const CAND_URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

const CandAddReveal = ({ open, isMobile, onClose, onAdd }) => {
  const [url, setUrl] = React.useState('');
  const [error, setError] = React.useState(null);
  const [thought, setThought] = React.useState('');
  const [markRead, setMarkRead] = React.useState(false);
  const [swell, setSwell] = React.useState({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
  const inputRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  const swellRef = React.useRef(null);
  const [swellH, setSwellH] = React.useState(0);

  // Mount choreography — the shipped AddReveal pattern, verbatim.
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
      setUrl(''); setError(null); setThought(''); setMarkRead(false);
      setSwell({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
      const id = setTimeout(() => inputRef.current && inputRef.current.focus({ preventScroll: true }), 60);
      return () => clearTimeout(id);
    } else if (invokerRef.current && invokerRef.current.focus) {
      invokerRef.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Measure the Swell block so the toggle expands it in place.
  React.useLayoutEffect(() => {
    if (swellRef.current) setSwellH(swellRef.current.scrollHeight);
  }, [markRead, render, open]);

  if (!render) return null;

  const level = levelFromIntensity(swell.intensity != null ? swell.intensity : 0.6);
  const applyGlyphLevel = (g, L) => {
    const a = glyphAngle(glyphIndexOf(g));
    if (L == null) { setSwell({ glyph: g, intensity: null, nx: 0.5, ny: 0.5 }); return; }
    const r = intensityFromLevel(L) * SWELL_MAX;
    setSwell({ glyph: g, intensity: intensityFromLevel(L), nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r });
  };
  // Not-read and here-is-my-reaction cannot both be true: turning the toggle
  // back off collapses The Swell AND clears any placed glyph.
  const toggleRead = (v) => { setMarkRead(v); if (!v) setSwell({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 }); };

  const submit = (e) => {
    e.preventDefault();
    const v = url.trim();
    if (!CAND_URL_RE.test(v)) { setError('That doesn\u2019t look like a valid URL. Check it and try again.'); return; }
    setError(null);
    const normalized = /^https?:\/\//i.test(v) ? v : 'https://' + v;
    const item = { id: 'i' + Date.now(), url: normalized, attribution: 'Added by you', read: markRead, pending: true, at: Date.now(), reactions: [] };
    const words = thought.trim();
    if (words) item.thought = { by: 'You', text: words, at: Date.now() };
    if (markRead && swell.glyph) item.reactions = [{ name: 'You', glyph: swell.glyph, intensity: swell.intensity, nx: swell.nx, ny: swell.ny }];
    onAdd(item);
    onClose();
  };

  const box = 236;
  const inset = Math.round(box * 0.1389);
  const surface = isMobile
    ? {
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 121,
        background: 'var(--color-surface)',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: 'var(--space-5) var(--space-5) calc(var(--space-5) + env(safe-area-inset-bottom, 0px))',
        boxShadow: 'var(--shadow-overlay)',
        maxHeight: 'calc(100% - 32px)', overflowY: 'auto', overscrollBehavior: 'contain',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      }
    : {
        position: 'fixed', right: 32, bottom: 100, width: 400, zIndex: 121,
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-1)',
        padding: 'var(--space-5)', boxShadow: 'var(--shadow-overlay)',
        maxHeight: 'calc(100vh - 132px)', overflowY: 'auto', overscrollBehavior: 'contain',
      };

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
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>Add a link</div>
          <button type="button" onClick={onClose} aria-label="Close" style={{
            background: 'transparent', border: 0, padding: 6, margin: -6, cursor: 'pointer',
            color: 'var(--color-fg-2)', display: 'inline-flex',
          }}><Icon name="x" size={18} /></button>
        </div>
        <Field
          ref={inputRef} name="add-url" mono type="text" inputMode="url"
          placeholder="example.com/article" value={url}
          onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }}
          error={error}
        />
        <CandWrite value={thought} onChange={setThought} max={500} minLines={2}
          placeholder={'Say why you\u2019re sharing it, if you want to.'} ariaLabel="A thought to go with it" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 44, marginTop: 4 }}>
          <span style={{ font: '500 14px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>Mark as read</span>
          <CandSwitch on={markRead} onChange={toggleRead} label="Mark as read" />
        </div>
        <div style={{ overflow: 'hidden', height: markRead ? swellH : 0, transition: 'height 300ms var(--ease-quiet)' }} aria-hidden={!markRead}>
          <div ref={swellRef} style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 12 }}>
            <div style={{ font: '600 14px/1.3 var(--font-sans)', color: 'var(--color-fg-1)', textAlign: 'center' }}>How did it land?</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <div style={{ position: 'relative', width: box, height: box }}>
                {markRead && <SwellGlyphRadios live={swell} onPick={(g) => applyGlyphLevel(g, swell.intensity != null ? level : null)} />}
                <div style={{ position: 'absolute', inset }}>
                  <SwellPad size={box - inset * 2} live={swell} level={level} interactive={markRead}
                    opts={{ centerDot: true, breath: true, snap: true }}
                    onChange={setSwell} onDepth={(L) => { if (swell.glyph) applyGlyphLevel(swell.glyph, L); }} />
                </div>
                <SwellPalette live={swell} box={box} />
              </div>
            </div>
            <p style={{ margin: '0 0 4px', font: '400 12px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textAlign: 'center', textWrap: 'pretty' }}>
              Optional. Leave it blank and the card arrives unmarked.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Add</Button>
        </div>
      </form>
    </React.Fragment>
  );
};

Object.assign(window, { AddReveal: CandAddReveal });
