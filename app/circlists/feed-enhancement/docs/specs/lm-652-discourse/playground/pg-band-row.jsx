// ============================================================================
// LM-652 · the empty band — the band itself, the three in-place fields, and the
// open-card row.
//
// The open-card row is the candidate's own swap mechanic (cand-lm652-card.jsx,
// CandCardRow) with two faces of its own: the empty band behind, a writing face
// in front. The numbers, the easing and the mid-travel stacking flip are the
// candidate's; nothing here retunes them.
// ============================================================================

const pgbMine = (item) => !!item && /^added by you\b/i.test(item.attribution || '') && !item.thought && !item.pending;
const pgbAttach = (api, item, text) => candUpdateItem(api, item.id, (i) => ({ ...i, thought: { by: 'You', text, at: Date.now() } }));

// Measure and keep current — a callback ref, because the measured element is
// swapped whenever the face changes.
const usePgbHeight = () => {
  const [h, setH] = React.useState(0);
  const ro = React.useRef(null);
  const ref = React.useCallback((el) => {
    if (ro.current) { ro.current.disconnect(); ro.current = null; }
    if (!el) return;
    const read = () => setH(el.getBoundingClientRect().height);
    read();
    ro.current = new ResizeObserver(read);
    ro.current.observe(el);
  }, []);
  return [ref, h];
};

// ---- The band --------------------------------------------------------------
// Settled. The words and the pen, on the thought's own paper, tucked under the
// card. Identical in every option; only what it opens into differs.
// The measuring ref goes on the BUTTON, which is the band's own box. It cannot
// go on a wrapper inside it: a display:contents element has no box at all, and
// the paper card then animates to a height of nothing.
const PgbBand = ({ innerRef, onOpen }) => (
  <button type="button" ref={innerRef} className="cand-bandbtn" onClick={onOpen} aria-label="Add a thought"
    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', font: 'inherit',
      background: 'transparent', border: 0, cursor: 'pointer', padding: (PGB_OVERLAP + 5) + 'px 16px 9px' }}>
    <span style={{ flex: 1, minWidth: 0, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-2)' }}>Add a thought</span>
    <span className="cand-bandlines" style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="edit" size={14} /></span>
  </button>
);

// ---- In place --------------------------------------------------------------
// The band's box, with a field in it. Options 1, 2 and 5 differ only in what
// stands beside or beneath that field.
const PgbInPlace = ({ item, api, kind, onClose }) => {
  const [draft, setDraft] = React.useState('');
  const box = React.useRef(null);
  const send = () => { const t = draft.trim(); if (!t) return; pgbAttach(api, item, t); setDraft(''); onClose(); };
  // Option 2 has no close control: an EMPTY box gives itself back when you press
  // away or hit Escape. With words in it, it holds — nothing written is taken
  // away by a stray press.
  React.useEffect(() => {
    if (kind !== 'nox') return;
    const away = (e) => { if (box.current && !box.current.contains(e.target) && !draft.trim()) onClose(); };
    const key = (e) => { if (e.key === 'Escape' && !draft.trim()) onClose(); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', key); };
  }, [kind, draft]);
  const field = (
    <CandWrite value={draft} onChange={setDraft} placeholder="Add a thought" ariaLabel="Add a thought"
      size={13.5} minLines={2} autoFocus onSend={kind === 'pair' ? undefined : send} />
  );
  return (
    <div ref={box} style={{ position: 'relative', zIndex: 0, margin: (-PGB_OVERLAP) + 'px 0 0', paddingTop: PGB_OVERLAP + 8 }}>
      {kind === 'aside' ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>{field}</div>
          <button type="button" onClick={() => { setDraft(''); onClose(); }} className="cand-altclose" aria-label="Close" title="Close"
            style={{ flexShrink: 0, width: 34, height: 34, marginTop: 2, background: 'transparent', border: 0, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CandCross size={15} />
          </button>
        </div>
      ) : kind === 'nox' ? field : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {field}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button size="sm" variant="secondary" onClick={() => { setDraft(''); onClose(); }}>Cancel</Button>
            <Button size="sm" variant="primary" disabled={!draft.trim()} onClick={send}>Add</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ---- The writing face ------------------------------------------------------
// What the opened paper carries. The open thought face's own geometry: the title
// at the head with the cross beside it, the hairline, then the person's block —
// except the words are a field rather than prose, and the act sits in the foot
// row where the card's own acts sit.
const PgbWriteFace = ({ item, api, innerRef, onClose, onDone }) => {
  const [draft, setDraft] = React.useState('');
  const onSurface = React.useContext(CandSurfaceCtx);
  const send = () => { const t = draft.trim(); if (!t) return; pgbAttach(api, item, t); onDone(); };
  return (
    <div ref={innerRef} style={{ padding: 'var(--space-4) var(--space-5) ' + (onSurface ? 'var(--space-5)' : 'var(--space-3)'),
      display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle"
          style={{ flex: 1, minWidth: 0, font: '600 16px/1.3 var(--font-sans)', letterSpacing: '-0.01em',
            color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', overflowWrap: 'break-word' }}>{candTitleOf(item)}</a>
        <button type="button" onClick={onClose} aria-label="Back to the link" title="Back to the link" className="cand-altclose"
          style={{ flexShrink: 0, background: 'transparent', border: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)',
            width: 36, height: 36, margin: '-6px -10px 0 0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <CandCross />
        </button>
      </div>
      <div aria-hidden="true" style={{ height: 1, background: CAND_PAPER.bd, margin: '-4px calc(var(--space-5) * -1) 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <Avatar name={displayName(api.user)} size={26} accent />
          <span style={{ font: '600 14px/1.25 var(--font-sans)', letterSpacing: '-0.006em', color: 'var(--color-fg-1)' }}>You</span>
        </div>
        <CandWrite value={draft} onChange={setDraft} placeholder="What made you share it?" ariaLabel="Add a thought"
          max={500} minLines={2} autoFocus size={12.5} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: onSurface ? 0 : -2 }}>
        <div style={{ flex: 1, minWidth: 0 }}><CandSourceLine item={item} foot /></div>
        <Button size="sm" variant="primary" disabled={!draft.trim()} onClick={send}>Add</Button>
      </div>
    </div>
  );
};

// ---- The row ---------------------------------------------------------------
// In-place options: the card sits still and the paper beneath it changes.
// Opening options: the candidate's swap, with the band and the writing face as
// the two faces of the one paper card.
const PgbRow = ({ item, api, children }) => {
  const st = usePGB();
  const opens = pgbOpens();
  // Once the thought lands the row keeps drawing the card, and the faces become
  // the SHIPPED ones — the real band, the real open thought. Only then is the
  // card handed back, and only from a state the shipped row can mount into
  // without moving: closed.
  const [open, setOpen] = React.useState(false);
  const [front, setFront] = React.useState(false);
  const [moving, setMoving] = React.useState(false);
  const [linkRef, linkH] = usePgbHeight();
  const [bandRef, bandH] = usePgbHeight();
  const [altRef, altH] = usePgbHeight();
  const linkBox = React.useRef(null), paperBox = React.useRef(null);
  const firstPaint = React.useRef(true);
  React.useEffect(() => { setOpen(false); }, [st.opt]);
  const swap = (next) => { setMoving(true); setOpen(next); };

  React.useLayoutEffect(() => {
    if (firstPaint.current) { firstPaint.current = false; return; }
    if (!opens) return;
    const l = linkBox.current, p = paperBox.current;
    if (!l || !p || !l.animate || !linkH) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const o = { duration: PGB_SWAP, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' };
    const linkOpen = { height: PGB_EDGE + 'px', marginLeft: PGB_INSET + 'px', marginRight: PGB_INSET + 'px' };
    const linkShut = { height: linkH + 'px', marginLeft: '0px', marginRight: '0px' };
    const paperOpen = { height: (altH || 0) + 'px', marginTop: '0px', marginLeft: '0px', marginRight: '0px' };
    const paperShut = { height: (bandH || 0) + 'px', marginTop: (-PGB_OVERLAP) + 'px', marginLeft: PGB_INSET + 'px', marginRight: PGB_INSET + 'px' };
    l.animate(open ? [linkShut, linkOpen] : [linkOpen, linkShut], o);
    p.animate(open ? [paperShut, paperOpen] : [paperOpen, paperShut], o);
  }, [open]);
  // The stacking order follows `open`, ALWAYS — not only while a travel is
  // running. A close with no travel (switching option, emptying the card) left
  // the flip standing, and the band then painted over the card it tucks under.
  React.useEffect(() => { if (!open) setFront(false); }, [open]);
  React.useEffect(() => {
    if (!moving) return;
    const flip = open ? setTimeout(() => setFront(true), PGB_SWAP) : null;
    const end = setTimeout(() => setMoving(false), PGB_SWAP + 20);
    return () => { if (flip) clearTimeout(flip); clearTimeout(end); };
  }, [open, moving]);

  if (!opens) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-raised)' }}>{children}</div>
        {open ? <PgbInPlace item={item} api={api} kind={st.opt} onClose={() => setOpen(false)} /> : (
          <div style={{ position: 'relative', zIndex: 0, background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd,
            borderRadius: 'var(--radius-lg)', margin: (-PGB_OVERLAP) + 'px ' + PGB_INSET + 'px 0' }}>
            <PgbBand onOpen={() => setOpen(true)} />
          </div>
        )}
      </div>
    );
  }

  // Option 3 leaves the card open on the words just written; option 4 sends it
  // back down onto the band. Either way the item now HAS a thought, so this row
  // unmounts on the next render and the shipped row takes over — which is why
  // the close for option 4 is fired before the state lands.
  const written = !!item.thought;
  // Option 4 closes on the words AS YOU WROTE THEM. Switching the open face to
  // the finished thought first resolved the card and then collapsed it, which is
  // two events for one act; the writing face is held through the travel and only
  // handed over once the card is down. The band behind swaps immediately — it is
  // out of sight under the card, and its height is what the travel lands on.
  const [keepWrite, setKeepWrite] = React.useState(false);
  React.useEffect(() => { if (keepWrite && !open && !moving) setKeepWrite(false); }, [open, moving, keepWrite]);
  // Deleting the thought takes the card back to having none — which is the BAND's
  // state, not the writing field's. The card goes back down first, so removal
  // ends where a card with no thought rests, rather than leaving an open box
  // asking for another one.
  const wasWritten = React.useRef(written);
  // Removal gets the same treatment as sending: the thought stays on the open
  // face while the card goes down, and the empty band is what you land on. The
  // face is drawn from the thought as it last was, since the item no longer
  // carries one.
  const lastThought = React.useRef(null);
  if (item.thought) lastThought.current = item.thought;
  const [keepAlt, setKeepAlt] = React.useState(false);
  React.useEffect(() => { if (keepAlt && !open && !moving) setKeepAlt(false); }, [open, moving, keepAlt]);
  React.useEffect(() => {
    const lost = wasWritten.current && !written;
    wasWritten.current = written;
    if (lost && open) { setKeepAlt(true); setTimeout(() => swap(false), 60); }
  }, [written]);
  const release = () => { if (PGB.hold === item.id) PGB.set({ hold: null }); };
  // Sending. Option 4 goes back down; option 3 stays up on the words. Either way
  // the row holds the card until it has finished the travel it promised.
  const done = () => {
    PGB.set({ hold: item.id });
    // One beat before the closing travel, so the band underneath has been
    // remeasured at the real thought's height and the card closes onto it
    // rather than onto the empty band's.
    if (st.opt === 'roundtrip') { setKeepWrite(true); setTimeout(() => swap(false), 60); }
  };
  React.useEffect(() => {
    // Handing back is only safe from closed and settled.
    if (written && !open && !moving && !keepWrite) { const t = setTimeout(release, 40); return () => clearTimeout(t); }
  }, [written, open, moving, keepWrite]);
  // Option 3's last move: the field becomes the words, and the open card settles
  // from one height to the other instead of jumping.
  const lastAlt = React.useRef(0);
  React.useLayoutEffect(() => {
    const p = paperBox.current, from = lastAlt.current;
    lastAlt.current = altH;
    if (!open || moving || !p || !p.animate || !from || !altH || from === altH) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    p.animate([{ height: from + 'px' }, { height: altH + 'px' }], { duration: 260, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
  }, [altH]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="cand-swap" ref={linkBox} onClick={open ? () => swap(false) : undefined}
        style={{ position: 'relative', zIndex: front ? 0 : 1,
          borderRadius: open ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)',
          boxShadow: open ? 'none' : 'var(--shadow-raised)',
          height: open ? PGB_EDGE : (linkH || 'auto'), margin: '0 ' + (open ? PGB_INSET : 0) + 'px',
          overflow: open || moving ? 'hidden' : 'visible', cursor: open ? 'pointer' : 'default' }}>
        <div ref={linkRef} style={{ pointerEvents: open ? 'none' : 'auto' }}>{children}</div>
      </div>
      <div className="cand-paper cand-swap" ref={paperBox}
        style={{ position: 'relative', zIndex: front ? 2 : 0, background: CAND_PAPER.bg,
          border: '1px solid ' + CAND_PAPER.bd, borderRadius: 'var(--radius-lg)',
          boxShadow: open ? 'var(--shadow-raised)' : 'none',
          margin: (open ? 0 : -PGB_OVERLAP) + 'px ' + (open ? 0 : PGB_INSET) + 'px 0',
          height: (open ? altH : bandH) || 'auto', overflow: moving ? 'hidden' : 'visible' }}>
        <div className="cand-face" aria-hidden={open} style={{ position: 'absolute', inset: '0 0 auto 0', opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto' }}>
          {written
            ? <CandBandFace item={item} api={api} setHeld={() => {}} mark="lines" measurable={!open && !moving} innerRef={bandRef} onOpen={() => swap(true)} />
            : <PgbBand innerRef={bandRef} onOpen={() => swap(true)} />}
        </div>
        <div className="cand-face" style={{ position: 'absolute', inset: '0 0 auto 0', opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none', width: open ? '100%' : 'calc(100% + ' + (PGB_INSET * 2) + 'px)' }} aria-hidden={!open}>
          {keepAlt && lastThought.current
            ? <CandAltFace item={{ ...item, thought: lastThought.current }} api={api} innerRef={altRef} mark="lines" onClose={() => swap(false)} />
            : written && !keepWrite
            ? <CandAltFace item={item} api={api} innerRef={altRef} mark="lines" onClose={() => swap(false)} />
            : <PgbWriteFace item={item} api={api} innerRef={altRef} onClose={() => swap(false)} onDone={done} />}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { pgbMine, pgbAttach, PgbBand, PgbInPlace, PgbWriteFace, PgbRow });
