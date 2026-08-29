// ============================================================================
// Discourse v8 — the mark-as-read moment: react and reflect as ONE act.
// The pad is the shipped Swell input (SwellPad + SwellPalette + the glyph
// radiogroup, from pg-d8-swell.jsx). What differs per state is only where the
// words are written and how much room they get — st.write(...) and st.reveal(...).
// Nothing advances on a timeout: the member moves, or nothing moves.
// ============================================================================
const { SwellPad: D8Pad, SwellPalette: D8Palette, SwellGlyphRadios: D8Radios, SwellReview: D8Review,
        glyphAngle: d8Angle, glyphIndexOf: d8GlyphIdx, SWELL_MAX: D8_MAX,
        levelFromIntensity: d8Level, intensityFromLevel: d8FromLevel } = window;

const D8Flow = ({ item, st, user, onCommit, onClose, onOpenRecord }) => {
  const [step, setStep] = React.useState('input');
  const [mine, setMine] = React.useState(null);
  const [text, setText] = React.useState('');
  const [vw, setVw] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 400);
  const narrow = vw < 520 || (typeof document !== 'undefined' && !!document.querySelector('.circ-phone-screen'));
  const { shown, requestClose } = window.useSheetMount(narrow, onClose);
  const panelRef = React.useRef(null);
  React.useEffect(() => window.lockScroll(), []);
  React.useEffect(() => {
    const on = () => setVw(window.innerWidth);
    const onKey = (e) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('resize', on); window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('resize', on); window.removeEventListener('keydown', onKey); };
  }, []);

  const [swell, setSwell] = React.useState({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
  const touched = swell.glyph != null;
  const level = d8Level(swell.intensity != null ? swell.intensity : 0.6);
  const applyGlyphLevel = (g, L) => {
    const a = d8Angle(d8GlyphIdx(g));
    if (L == null) { setSwell({ glyph: g, intensity: null, nx: 0.5, ny: 0.5 }); return; }
    const r = d8FromLevel(L) * D8_MAX;
    setSwell({ glyph: g, intensity: d8FromLevel(L), nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r });
  };
  const pickGlyph = (g) => applyGlyphLevel(g, swell.intensity != null ? level : null);
  const setDepth = (L) => { if (swell.glyph) applyGlyphLevel(swell.glyph, L); };

  const avail = vw - (narrow ? 16 : 48) - (narrow ? 24 : 48);
  const box = Math.round(Math.max(248, Math.min(300, avail)));
  const inset = Math.round(box * 0.1389);
  const pad = box - inset * 2;

  const commit = () => {
    const rx = touched ? { name: 'You', glyph: swell.glyph, intensity: swell.intensity, nx: swell.nx, ny: swell.ny, at: Date.now() }
      : { name: 'You', skipped: true, at: Date.now() };
    const said = text.trim();
    setMine(rx);
    onCommit(item, rx, said);
    if (st.revealElsewhere) { onOpenRecord && onOpenRecord(item); requestClose(); return; }
    setStep('reveal');
  };

  const writeZone = st.write
    ? st.write({ swell, touched, text, setText, item, narrow })
    : (
      <div style={{ width: '100%', marginTop: 14 }}>
        <window.D8Write value={text} onChange={setText} lines={2} max={200}
          placeholder="Say something to the circle, or leave it" />
      </div>
    );

  const body = step === 'input' ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ font: '600 var(--text-xl)/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 4px' }}>How did it land?</h2>
      <p style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--color-fg-3)', margin: narrow ? '0 0 4px' : '0 0 12px', textAlign: 'center' }}>{st.flowSub || 'Your reaction and your words, for the circle. Both are yours to leave out.'}</p>
      <div style={{ position: 'relative', width: box, height: box, margin: narrow ? '2px 0 0' : '6px 0 0' }}>
        <D8Radios live={swell} onPick={pickGlyph} />
        <div style={{ position: 'absolute', inset }}>
          <D8Pad size={pad} live={swell} level={level} interactive opts={{ centerDot: true, breath: true, snap: true }}
            onChange={setSwell} onDepth={setDepth} onSubmit={commit} />
        </div>
        <D8Palette live={swell} box={box} />
      </div>
      <div style={{ width: '100%', maxWidth: box + 24 }}>{writeZone}</div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 16 }}>
        <window.Button variant="primary" onClick={commit}>Done</window.Button>
      </div>
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {st.reveal
        ? st.reveal({ item, mine, text, narrow })
        : <D8Review all={[...(item.reactions || []).filter(r => r.name !== 'You'), ...(mine ? [mine] : [])]} interactive={false} firstHere={(item.reactions || []).filter(r => r.name !== 'You').length === 0} />}
      <div style={{ marginTop: 18 }}>
        <window.Button variant="secondary" onClick={requestClose}>Close</window.Button>
      </div>
    </div>
  );

  const tree = (
    <div onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
      className={narrow ? undefined : 'circ-anim-fade'}
      style={{ position: 'fixed', inset: 0, zIndex: 135, background: 'var(--color-scrim)',
        display: 'flex', justifyContent: 'center', alignItems: narrow ? 'flex-end' : 'center', padding: narrow ? 0 : 16,
        opacity: narrow ? (shown ? 1 : 0) : 1,
        transition: narrow ? 'opacity var(--duration-slow) ease-in-out' : undefined }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="How did it land?"
        onKeyDown={(e) => window.trapTab(panelRef.current, e)}
        style={narrow ? {
          position: 'relative', background: 'var(--color-surface)', width: '100%', maxWidth: 520,
          borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: 'var(--shadow-overlay)',
          padding: 'var(--space-5) var(--space-3) calc(var(--space-4) + env(safe-area-inset-bottom, 0px))',
          maxHeight: 'calc(100% - 24px)', overflowY: 'auto', overscrollBehavior: 'contain',
          transform: shown ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform var(--duration-slow) var(--ease-quiet)',
        } : {
          position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)', boxShadow: 'var(--shadow-overlay)',
          width: 380, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto',
        }}>
        {step === 'input' && (
          <button type="button" onClick={requestClose} aria-label="Close" className="circ-rx-close"
            style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, zIndex: 2,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
            <window.CloseX />
          </button>
        )}
        {body}
      </div>
    </div>
  );
  const target = (typeof document !== 'undefined' && (document.querySelector('.circ-phone-screen') || document.body)) || null;
  return target ? ReactDOM.createPortal(tree, target) : tree;
};

Object.assign(window, { D8Flow });
