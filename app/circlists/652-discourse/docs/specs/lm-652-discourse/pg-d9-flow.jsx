// ============================================================================
// Discourse v9 — marking read: react and speak as ONE act, then land somewhere
// that is already a conversation.
//
// Three things v8 got wrong, fixed here for every state:
//   1. Skipping the reaction and still leaving words was possible but unsaid.
//      The optionality is now stated where it applies, and both halves carry
//      their own "leave it out" — either alone, both, or neither.
//   2. A reader wrote into nothing. The contributor's thought is now at the head
//      of the surface, so the words you leave are an answer to something.
//   3. Committing ended the act. The reveal is now the way IN to the
//      conversation: the circle is there, and you can answer a person on the
//      spot without a second trip.
// The pad is the shipped Swell input (SwellPad + SwellPalette + the glyph
// radiogroup). Nothing advances on a timeout: the member moves, or nothing does.
// ============================================================================
const { SwellPad: D9Pad, SwellPalette: D9Palette, SwellGlyphRadios: D9Radios, SwellReview: D9Review,
        glyphAngle: d9Angle, glyphIndexOf: d9GlyphIdx, SWELL_MAX: D9_MAX,
        levelFromIntensity: d9Level, intensityFromLevel: d9FromLevel } = window;
const { D9ThoughtHead: FTH, D9Utterance: FU, D9Composer: FC, D9Write: FW, d9Order: fOrder } = window;

// The thought, at the head of the reaction surface. Compact, and never a
// scroll: two lines of somebody's words is what you are answering.
const D9FlowHead = ({ item }) => item.thought ? (
  <div style={{ width: '100%', marginBottom: 14, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--color-border-2)' }}>
    <FTH item={item} size={14.5} />
  </div>
) : null;

// ---- the way into the conversation, at the reveal --------------------------
// The tail of what has been said, each line answerable, plus the same composer
// the record uses. Speaking now and speaking on a later visit are one mechanism.
const D9JoinIn = ({ item, ctx, showGlyph = true, prompt }) => {
  const [replyTo, setReplyTo] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const rows = fOrder(item.talk).filter(o => o.e.by !== 'You');
  const tail = rows.slice(-2);
  if (!tail.length && !open) return (
    <div style={{ width: '100%', marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)' }}>
      <p style={{ margin: 0, font: '400 13.5px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
        You are the first one here. Whatever anyone says next will answer you.
      </p>
    </div>
  );
  return (
    <div style={{ width: '100%', marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)',
      display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
      <span style={{ font: '500 10.5px/1 var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>
        {prompt || 'and what they said'}
      </span>
      {tail.map(o => (
        <FU key={o.e.id} entry={o.e} all={item.talk} depth={0} showGlyph={showGlyph}
          onReply={(e) => { setReplyTo(e); setOpen(true); }} />
      ))}
      {open
        ? <FC item={item} ctx={ctx} lines={2} max={220} autoFocus replyTo={replyTo}
            onCancelReply={() => { setReplyTo(null); setOpen(false); }} cta="Leave it" />
        : (
          <button type="button" onClick={() => setOpen(true)} className="circ-d9-answer" style={{
            alignSelf: 'flex-start', background: 'transparent', borderWidth: 0, padding: '6px 8px', marginLeft: -8,
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', font: '500 13px/1.3 var(--font-sans)', color: 'var(--color-accent)' }}>
            Say something else
          </button>
        )}
    </div>
  );
};

const D9Flow = ({ item, st, user, ctx, onCommit, onClose, onOpenRecord }) => {
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
  const level = d9Level(swell.intensity != null ? swell.intensity : 0.6);
  const applyGlyphLevel = (g, L) => {
    const a = d9Angle(d9GlyphIdx(g));
    if (L == null) { setSwell({ glyph: g, intensity: null, nx: 0.5, ny: 0.5 }); return; }
    const r = d9FromLevel(L) * D9_MAX;
    setSwell({ glyph: g, intensity: d9FromLevel(L), nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r });
  };
  const pickGlyph = (g) => applyGlyphLevel(g, swell.intensity != null ? level : null);
  const setDepth = (L) => { if (swell.glyph) applyGlyphLevel(swell.glyph, L); };
  const clearGlyph = () => setSwell({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });

  const avail = vw - (narrow ? 16 : 48) - (narrow ? 24 : 48);
  const box = Math.round(Math.max(240, Math.min(290, avail)));
  const inset = Math.round(box * 0.1389);
  const pad = box - inset * 2;

  const said = text.trim();
  const commit = () => {
    const rx = touched
      ? { name: 'You', glyph: swell.glyph, intensity: swell.intensity, nx: swell.nx, ny: swell.ny, at: Date.now() }
      : { name: 'You', skipped: true, at: Date.now() };
    setMine(rx);
    onCommit(item, rx, said);
    if (st.revealElsewhere) { onOpenRecord && onOpenRecord(item); requestClose(); return; }
    setStep('reveal');
  };

  const writeZone = st.write
    ? st.write({ swell, touched, text, setText, item, narrow })
    : (
      <div style={{ width: '100%', marginTop: 14 }}>
        <FW value={text} onChange={setText} lines={2} max={220}
          placeholder={item.thought ? 'Answer ' + (item.thought.by === 'You' ? 'yourself' : item.thought.by) + ', or say your own thing' : 'Say something to the circle'} />
      </div>
    );

  // The two halves, each optional, each said so once. The button never blocks:
  // a bare read is a valid outcome and always has been.
  const foot = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%', marginTop: 16 }}>
      <window.Button variant="primary" onClick={commit}>
        {touched || said ? 'Leave it with the circle' : 'Just mark it read'}
      </window.Button>
      {touched && (
        <button type="button" onClick={clearGlyph} className="circ-d9-answer" style={{
          background: 'transparent', borderWidth: 0, padding: '6px 10px', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>
          Take the reaction back off
        </button>
      )}
    </div>
  );

  const body = step === 'input' ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ font: '600 var(--text-xl)/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 4px' }}>How did it land?</h2>
      <p style={{ font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', margin: narrow ? '0 0 10px' : '0 0 14px', textAlign: 'center', maxWidth: 320, textWrap: 'pretty' }}>
        {st.flowSub || 'A reaction, words, both or neither. Nothing here is required.'}
      </p>
      <div style={{ width: '100%', maxWidth: box + 24 }}><D9FlowHead item={item} /></div>
      <div style={{ position: 'relative', width: box, height: box }}>
        <D9Radios live={swell} onPick={pickGlyph} />
        <div style={{ position: 'absolute', inset }}>
          <D9Pad size={pad} live={swell} level={level} interactive opts={{ centerDot: true, breath: true, snap: true }}
            onChange={setSwell} onDepth={setDepth} onSubmit={commit} />
        </div>
        <D9Palette live={swell} box={box} />
      </div>
      <div style={{ width: '100%', maxWidth: box + 24 }}>{writeZone}</div>
      <div style={{ width: '100%', maxWidth: box + 24 }}>{foot}</div>
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {st.reveal
        ? st.reveal({ item, mine, text: said, narrow, ctx, onOpenRecord, close: requestClose })
        : (
          <React.Fragment>
            <D9Review all={[...(item.reactions || []).filter(r => r.name !== 'You'), ...(mine ? [mine] : [])]} interactive={false}
              firstHere={(item.reactions || []).filter(r => r.name !== 'You').length === 0} />
            <D9JoinIn item={item} ctx={ctx} />
          </React.Fragment>
        )}
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
          width: 400, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto',
        }}>
        {step === 'input' && (
          <button type="button" onClick={requestClose} aria-label="Close" className="circ-rx-close"
            style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, zIndex: 2,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', borderWidth: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
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

Object.assign(window, { D9Flow, D9JoinIn, D9FlowHead });
