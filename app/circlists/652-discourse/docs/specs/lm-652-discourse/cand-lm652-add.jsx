// ============================================================================
// LM-652 candidate — the Add-a-link popover (item 1). Re-publishes AddReveal:
// same props, same mount choreography, same anchoring as the shipped sheet /
// popover.
//
// The surface is now **direction 2, "The other side"** — chosen 2026-08-17 from
// `pg-wb-add-surface.html` (five directions) after the earlier field read bloated
// and gave 500 characters nowhere to live. Its parts, each ratified separately:
//   · the link's slot     — the surface's own white, standard border, link glyph
//                           at the head of it (pg-wb-linkslot.html, option 3)
//   · the thought          — a second face that is nothing but room to write
//   · the way back         — the arrow alone; nothing is committed on that face,
//                           Add commits the whole surface (pg-wb-return-ctl.html, 1)
//   · the returned state   — two lines on paper, the cut drawn as a fade the moment
//                           the thought runs to a second line (pg-wb-returned.html, 1)
//   · saying it is optional — carried by the writing face's placeholder, so the
//                           face you commit from stays quiet
// Mark-as-read, The Swell beneath it and the Add/Cancel row are unchanged.
// Inspiration for the Swell riding the popover: v10 C4 "It arrives with your
// mark on it" (pg-d10-contribute.jsx) — credited, rethought, not lifted.
// No reveal fires on add: nobody else has reacted to a card just added.
// ============================================================================
const CAND_URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

// ---- the link's slot -------------------------------------------------------
const CandLinkSlot = React.forwardRef(({ value, onChange, error }, ref) => {
  const [focus, setFocus] = React.useState(false);
  const bd = error ? 'var(--color-destructive)' : (focus ? 'var(--color-accent)' : 'var(--color-border-1)');
  return (
    <div style={{ marginBottom: error ? 6 : 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', minHeight: 46,
        background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid ' + bd,
        transition: 'border-color var(--duration-base)' }}>
        <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={16} /></span>
        <input ref={ref} name="add-url" value={value} onChange={onChange} type="text" inputMode="url"
          aria-label="The link" aria-invalid={error ? 'true' : undefined} placeholder="paste a link"
          style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', padding: 0,
            font: '500 14px/1.5 var(--font-mono)', color: 'var(--color-fg-1)' }} />
      </div>
      {error && <p role="alert" style={{ margin: '0 0 var(--space-3)', font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-destructive)' }}>{error}</p>}
    </div>
  );
});

// ---- the returned state ----------------------------------------------------
// Two lines at most, and the fade is on whenever the thought runs to a second
// line — not only when it overruns — so the row never behaves differently at two
// lines than at three. The edit glyph is centred at every height.
const CandThoughtRow = ({ words, onOpen }) => {
  const ref = React.useRef(null);
  const [cut, setCut] = React.useState(false);
  React.useLayoutEffect(() => { const el = ref.current; if (el) setCut(el.scrollHeight > 30); }, [words]);
  const paper = (window.CAND_PAPER || { bg: '#F2F1EB', bd: '#DEDCD3' });
  return (
    <button type="button" onClick={onOpen}
      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, minHeight: 48,
        background: words ? paper.bg : 'var(--color-surface)', border: '1px solid ' + (words ? paper.bd : 'var(--color-border-1)'),
        borderRadius: 'var(--radius-md)', padding: '10px 12px', cursor: 'pointer', overflow: 'hidden' }}>
      <span ref={ref} style={{ flex: 1, minWidth: 0, font: (words ? '400' : '500') + ' 13.5px/1.55 var(--font-sans)',
        color: words ? 'var(--color-fg-1)' : 'var(--color-fg-2)', position: 'relative',
        whiteSpace: words ? 'pre-wrap' : undefined, maxHeight: words ? 42 : undefined, overflow: 'hidden' }}>
        {words || 'Say why you\u2019re sharing it'}
        {words && cut && <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 20,
          background: 'linear-gradient(to bottom, rgba(242,241,235,0), ' + paper.bg + ')' }} />}
      </span>
      <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name={words ? 'edit' : 'chevron-right'} size={16} /></span>
    </button>
  );
};

// ---- the writing face's room ------------------------------------------------
const CandRoom = React.forwardRef(({ value, onChange, max, placeholder, maxPx }, ref) => {
  const own = React.useRef(null);
  const el = ref || own;
  React.useLayoutEffect(() => {
    const t = el.current; if (!t) return;
    t.style.height = 'auto';
    const h = Math.min(t.scrollHeight, maxPx);
    t.style.height = h + 'px';
    t.style.overflowY = t.scrollHeight > maxPx + 1 ? 'auto' : 'hidden';
  }, [value, maxPx]);
  return (
    <textarea ref={el} value={value} onChange={(e) => onChange(e.target.value)} rows={6} maxLength={max}
      placeholder={placeholder} aria-label="A thought to go with it"
      style={{ display: 'block', width: '100%', border: 0, outline: 'none', background: 'transparent', resize: 'none',
        padding: 0, margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15.5, lineHeight: 1.65,
        color: 'var(--color-fg-1)', minHeight: Math.round(15.5 * 1.65 * 6) }} />
  );
});

const CandAddReveal = ({ open, isMobile, onClose, onAdd }) => {
  const [url, setUrl] = React.useState('');
  const [error, setError] = React.useState(null);
  const [thought, setThought] = React.useState('');
  const [markRead, setMarkRead] = React.useState(false);
  const [swell, setSwell] = React.useState({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
  const [face, setFace] = React.useState(0);
  const inputRef = React.useRef(null);
  const roomRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  const swellRef = React.useRef(null);
  const [swellH, setSwellH] = React.useState(0);
  const linkFaceRef = React.useRef(null);
  const writeFaceRef = React.useRef(null);
  const [faceH, setFaceH] = React.useState('auto');

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
      setUrl(''); setError(null); setThought(''); setMarkRead(false); setFace(0);
      setSwell({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
      const id = setTimeout(() => inputRef.current && inputRef.current.focus({ preventScroll: true }), 60);
      return () => clearTimeout(id);
    } else if (invokerRef.current && invokerRef.current.focus) {
      invokerRef.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    // Escape steps back off the writing face before it closes the surface.
    const onKey = (e) => { if (e.key !== 'Escape') return; if (face) { setFace(0); return; } onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, face]);

  // Measure the Swell block so the toggle expands it in place.
  React.useLayoutEffect(() => {
    if (swellRef.current) setSwellH(swellRef.current.scrollHeight);
  }, [markRead, render, open]);

  // The surface's height follows whichever face is showing — observed, not
  // measured once, so The Swell opening on the link face carries it along.
  React.useLayoutEffect(() => {
    if (!render) return;
    const el = face ? writeFaceRef.current : linkFaceRef.current;
    if (!el) return;
    const set = () => setFaceH(el.scrollHeight);
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => ro.disconnect();
  }, [face, render]);

  const toWriting = () => { setFace(1); setTimeout(() => roomRef.current && roomRef.current.focus({ preventScroll: true }), 320); };
  const toLink = () => { setFace(0); setTimeout(() => inputRef.current && inputRef.current.focus({ preventScroll: true }), 320); };

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
    if (face) { toLink(); return; }
    const v = url.trim();
    if (!CAND_URL_RE.test(v)) { setError('That doesn\u2019t look like a valid URL. Check it and try again.'); return; }
    setError(null);
    const normalized = /^https?:\/\//i.test(v) ? v : 'https://' + v;
    const item = { id: 'i' + Date.now(), url: normalized, attribution: 'Added by you', read: markRead, pending: true, at: Date.now(), reactions: [],
      // D2 — contributing a link enrols the contributor in watching it. Nothing
      // has been said yet, so the card starts with its talk seen. Whether
      // reacting, replying or reading also enrols is a wider rule, unruled here.
      watching: true, talkSeenAt: Date.now() };
    const words = thought.trim();
    if (words) item.thought = { by: 'You', text: words, at: Date.now() };
    // D5 — `atAdd` marks a reaction placed HERE, alongside the link. It stands in
    // the reaction record like any other, but it rides no turn in the talk: it was
    // never a response to a conversation that did not exist yet.
    if (markRead && swell.glyph) item.reactions = [{ name: 'You', glyph: swell.glyph, intensity: swell.intensity, nx: swell.nx, ny: swell.ny, atAdd: true }];
    onAdd(item);
    onClose();
  };

  const still = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = 236;
  const inset = Math.round(box * 0.1389);
  const words = thought.trim();
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
        <div style={{ overflow: 'hidden', height: faceH, transition: still ? 'none' : 'height 300ms var(--ease-quiet)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', width: '200%',
            transform: face ? 'translateX(-50%)' : 'translateX(0)', transition: still ? 'none' : 'transform 300ms var(--ease-quiet)' }}>
            <div style={{ width: '50%', flexShrink: 0 }} {...(face ? { inert: '' } : {})}>
              <div ref={linkFaceRef}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>Add a link</div>
                  <button type="button" onClick={onClose} aria-label="Close" style={{
                    background: 'transparent', border: 0, padding: 6, margin: -6, cursor: 'pointer',
                    color: 'var(--color-fg-2)', display: 'inline-flex',
                  }}><Icon name="x" size={18} /></button>
                </div>
                <CandLinkSlot ref={inputRef} value={url} error={error}
                  onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }} />
                <CandThoughtRow words={words} onOpen={toWriting} />
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
              </div>
            </div>
            <div style={{ width: '50%', flexShrink: 0 }} {...(face ? {} : { inert: '' })}>
              <div ref={writeFaceRef}>
                {/* Arrow only. Nothing is committed here — Add commits the whole surface. */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-3)', minHeight: 44 }}>
                  <button type="button" onClick={toLink} aria-label="Back to the link" className="cand-glyphbtn"
                    style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--color-fg-2)', display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 'var(--radius-md)', marginLeft: -10, flexShrink: 0 }}>
                    <Icon name="arrow-left" size={18} />
                  </button>
                  <span style={{ flex: 1, minWidth: 0, font: '500 12px/1.4 var(--font-mono)', color: 'var(--color-fg-2)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                </div>
                <CandRoom ref={roomRef} value={thought} onChange={setThought} max={500}
                  maxPx={isMobile ? 300 : 250} placeholder={'Say why you\u2019re sharing it, or leave it blank.'} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

Object.assign(window, { AddReveal: CandAddReveal });
