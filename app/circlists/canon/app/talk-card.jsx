// ============================================================================
// LM-652 candidate — the card's discourse skin (items 2 + 3).
//   CandCardRow   — wraps the shipped FeedCard (handed in as children, never
//                   copied): the fold when watching, and on Active the
//                   tucked-under band carrying the contributor's thought.
//                   Closed and open are ONE tree, not two: the link card and the
//                   thought card are both always mounted, and opening moves them
//                   past each other. Nothing unmounts, so the swap can be seen.
//   CandAltFace   — the thought card's face when it is in front.
//   CandConvoButton — the way-through on a Read card. Replaces the emoji
//                   reaction-analytics door by re-publishing window.SwellDoor.
// ============================================================================

const CAND_OVERLAP = 15; // how far the card in front sits over the one behind
const CAND_INSET = 12;   // how far the card behind is inset on each side
const CAND_EDGE = 12;    // the link card's height once it has slipped behind
const CAND_SWAP = 400;   // how long the two cards take to change places
const CAND_BAND_WAIT = 260; // the beat the card holds alone before its band slides out

// Measure an element and keep the number current. Both cards are given explicit
// heights so the swap can be animated; `auto` cannot be transitioned.
// A CALLBACK ref, not a mount-once effect: the element being measured is
// replaced whenever the face component changes, and a `[]` effect would leave
// the observer watching a detached node — which measures 0, and the swap then
// animates the card to nothing.
const useCandHeight = () => {
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

// The chevron. It points at where the card it belongs to is going: UP from the
// band, because the thought card comes up in front; DOWN from the face, because
// it goes back down behind. Not a disclosure triangle — nothing is expanding.
const CandSwapChev = ({ up }) => (
  <svg className="cand-bandchev" viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ flexShrink: 0, color: 'var(--color-fg-3)' }}>
    <path d={up ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} />
  </svg>
);

// The band: the thought card's face while it is behind. EVERY card carrying a
// thought opens (ratified 2026-08-18): the band draws its mark and behaves as an
// opening control whether the thought is one line or twenty. The old honesty
// rule — a thought that fits is read on the band, and the band is inert — is
// retired, because two bands that looked alike and behaved differently was the
// cost of it, and the open face is the only place the contributor's own controls
// can live consistently.
// The mark at the right of the band. Which mark is the open question; the row
// takes it as a prop.
const CandBandMark = ({ mark }) => {
  if (mark === 'none' || mark === 'edge') return null;
  if (mark === 'word') return (
    <span style={{ flexShrink: 0, font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>More</span>
  );
  if (mark === 'lines') return <CandLines />;
  return <CandSwapChev up />;
};

// Lines — the band's tell. Three lines with a ragged last one: the shape of a
// paragraph, which three even lines would not be (that is a menu). CONSTANT —
// the mark says there is more here, not how much. A count that moved reported a
// quantity at three buckets' resolution and made one control look different card
// to card. Colour is inherited so the control it sits in owns the hover.
const CandLines = () => (
  <span aria-hidden="true" className="cand-bandlines" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2.5, width: 16 }}>
    {['100%', '100%', '60%'].map((w, i) => (
      <span key={i} style={{ height: 2, borderRadius: 2, width: w, background: 'currentColor', opacity: 0.34 }} />
    ))}
  </span>
);

// Bring the link card back. A pair of cards with the back one inked — the same
// thing the sliver above says, said as a glyph.
const CandStackGlyph = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" style={{ display: 'block' }}>
    <rect x="4" y="4" width="14" height="10" rx="2.5" fill="currentColor" />
    <rect x="7.2" y="10.2" width="14" height="10" rx="2.5" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Your own card, carrying no thought yet. Only this card shows the empty band —
// nobody else's, and never one that already has words on it.
const candCanWrite = (item) => !!item && !item.thought && !item.pending && /^added by you\b/i.test(item.attribution || '');

const CandBandFace = ({ item, api, onOpen, setHeld, innerRef, measurable, mark }) => {
  const pad = { display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%',
    padding: (CAND_OVERLAP + 5) + 'px 16px 9px', background: 'transparent', border: 0 };
  // The band before the thought (LM-652). The same paper, the same tuck, the same
  // press — the slot is there before the words are, so giving your own card a
  // thought is the same gesture as reading someone else's, not a different one.
  // This returns FIRST: everything below reads the thought.
  if (!item.thought) {
    return (
      <button ref={innerRef} type="button" className="cand-bandbtn" onClick={onOpen} aria-label="Add a thought"
        style={{ ...pad, font: 'inherit', cursor: 'pointer' }}>
        <span style={{ flex: 1, minWidth: 0, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-2)' }}>Add a thought</span>
        <span className="cand-bandlines" style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="edit" size={14} /></span>
      </button>
    );
  }
  const t = item.thought;
  const by = /^you$/i.test(t.by) ? 'You' : t.by;
  const isYou = by === 'You';
  const ref = React.useRef(null);
  // Only measured while the band is the face at rest. Open, this element is still
  // mounted but sits at the front card's wider size, where a borderline thought
  // would measure as fitting and lose its chevron on the way back.
  // Only the `edge` mark still reads this: whether the band finishes the thought
  // no longer decides anything about opening.
  const measure = React.useCallback(() => {
    const el = ref.current;
    if (el && measurable && setHeld) setHeld(/\n/.test(t.text) || el.scrollWidth > el.clientWidth + 1);
  }, [t.text, setHeld, measurable]);
  React.useLayoutEffect(measure, [measure]);
  React.useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);
  const words = (
    <span ref={ref} style={{ flex: 1, minWidth: 0, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-2)',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <span style={{ fontWeight: 600, color: 'var(--color-fg-1)' }}>{by}</span>{'\u2002'}{t.text.split('\n')[0]}
    </span>
  );
  // No control on the band beyond the band itself. The contributor's Edit and
  // Delete live on the open face, in the thought's own name row — one
  // arrangement, every thought, short or long.
  return (
    <button ref={innerRef} type="button" className="cand-bandbtn" onClick={onOpen}
      aria-label={'Read what ' + by + ' wrote'} style={{ ...pad, font: 'inherit', cursor: 'pointer' }}>
      {words}
      <CandBandMark mark={mark} />
    </button>
  );
};

// Kept for compatibility — the row no longer mounts a separate edge element. The
// sliver above the open thought is the real link card, clipped to CAND_EDGE.
const CandEdge = () => (
  <div aria-hidden="true" style={{ height: CAND_EDGE, background: 'var(--color-surface)',
    border: '1px solid var(--color-border-1)', borderBottom: 0,
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', margin: '0 ' + CAND_INSET + 'px' }} />
);

// The close. An X, and deliberately not a mirrored version of the band's mark:
// the band's mark is a TELL (there is more here), not a direction, so it makes no
// promise of an inverse for the X to break. A chevron would have made that
// promise. Nothing is dismissed here — the label carries that.
const CandCross = ({ size = 17 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

// The link's identity, in the card's own vocabulary. On the alternate face it
// sits at the FOOT (bottom-left), where it fills the space the actions leave and
// puts the site's colour at both ends of the card. Favicon is a garnish: a host
// that genuinely ships none shows none.
const CandSourceLine = ({ item, foot }) => {
  const [broke, setBroke] = React.useState(false);
  const host = (() => { try { return new URL(item.url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } })();
  const ok = item.faviconExists !== false && !broke && !!host;
  const src = (window.CircFavicons && window.CircFavicons(host))
    || ('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, marginTop: foot ? 0 : -6 }}>
      {ok && (
        <span style={{ width: 15, height: 15, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-2)', display: 'inline-flex' }}>
          <img src={src} alt="" onError={() => setBroke(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </span>
      )}
      <span style={{ font: foot ? '600 12.5px/1.3 var(--font-sans)' : '600 13px/1.3 var(--font-sans)', color: foot ? 'var(--color-fg-3)' : 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{item.source || host}</span>
    </div>
  );
};

// The alternate face — the same card, with room. The title still opens the link,
// the words are the matter, the actions are the card's own.
//
// The thought is set NAME-LED (whiteboard 2026-08-17, ratified): a hairline runs
// the full width under the title, and below it the person heads the block —
// avatar, name in the card's primary ink — with the words running small and quiet
// beneath. Above the rule is the card's matter; below it is a person's, so the
// name and the title never compete for the same territory. The name is BLACK: it
// is the one voice on the card, and grey is this product's word for secondary.
// The link's identity moves to the FOOT, which fills the bottom-left and keeps
// the site's colour at both ends; the preview image does not come over.
const CandAltFace = ({ item, api, onClose, innerRef, mark }) => {
  const t = item.thought;
  const by = /^you$/i.test(t.by) ? 'You' : t.by;
  const isYou = by === 'You';
  // On the conversation surface the foot row loses its action buttons, and with
  // them the 36px of row height the source line was optically centred inside.
  // Without that the line sits 4px under the prose and 12px off the card's edge
  // and reads cramped, where the Active row reads even. The space the buttons
  // held is given back explicitly: the row's negative pull goes, and the bottom
  // padding grows to the ~20px the button's own box was contributing.
  const onSurface = React.useContext(CandSurfaceCtx);
  // The contributor can fix their own words in place (item 3). The menu is the
  // turn's menu, in the thought's own name row after the time — not in the foot
  // row, which belongs to the CARD (source, mark as read, remove the card): a
  // second Delete there would put two different scopes on one line.
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  return (
    <div ref={innerRef} style={{ padding: 'var(--space-4) var(--space-5) ' + (onSurface ? 'var(--space-5)' : 'var(--space-3)'),
      display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle"
          style={{ flex: 1, minWidth: 0, font: '600 16px/1.3 var(--font-sans)', letterSpacing: '-0.01em',
            color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', overflowWrap: 'break-word' }}>{candTitleOf(item)}</a>
        {/* The close is an X. The band opens with a tell, not a direction, so
            there is no opening gesture for this to be the inverse of — which is
            exactly why an X is readable here and a mirrored glyph was not. */}
        <button type="button" onClick={onClose} aria-label="Back to the link" title="Back to the link" className="cand-altclose"
          style={{ flexShrink: 0, background: 'transparent', border: 0, cursor: 'pointer',
            borderRadius: 'var(--radius-md)', width: 36, height: 36, margin: '-6px -10px 0 0',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <CandCross />
        </button>
      </div>
      {/* The line. Card matter above, a person's below. */}
      <div aria-hidden="true" style={{ height: 1, background: CAND_PAPER.bd, margin: '-4px calc(var(--space-5) * -1) 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <Avatar name={isYou ? displayName(api.user) : by} size={26} accent={isYou} />
          <span style={{ font: '600 14px/1.25 var(--font-sans)', letterSpacing: '-0.006em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{by}</span>
          {candWhen(t.at) && <span style={{ flexShrink: 0, font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candWhen(t.at)}{t.edited ? ' \u00b7 edited' : ''}</span>}
          {isYou && !editing && (
            <CandTurnMenu item={item} t={t} api={api}
              onEdit={() => { setDraft(t.text); setEditing(true); }}
              onDelete={() => candDeleteThought(api, item)} />
          )}
          {isYou && editing && <CandEditOut onClick={() => setEditing(false)} />}
        </div>
        {editing ? (
          <CandWrite value={draft} onChange={setDraft} max={500} minLines={2} autoFocus size={12.5} ariaLabel="Edit what you wrote"
            onSend={() => { candEditThought(api, item, draft.trim()); setEditing(false); }} />
        ) : <CandProse text={t.text} size={12.5} lh={1.85} color="var(--color-fg-2)" />}
      </div>
      {/* One foot row: where the link came from, then the card's own actions. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: onSurface ? 0 : -8, marginRight: onSurface ? 0 : -13 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CandSourceLine item={item} foot />
        </div>
        {/* On the warm paper these take the CROSS's treatment (cand-altaction):
            tertiary ink, darkening to primary, and no grey state layer — the
            house icon-button fill is mixed for white surface and read as a
            smudge here. */}
        {/* On the conversation surface the head card already carries Delete (and
            Mark as read), so the alt face carries neither — the same controls
            twice on one screen. */}
        {!onSurface && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="circ-cardaction circ-cardaction-icon cand-altaction" aria-label="Mark as read" title="Mark as read"
            onClick={() => { onClose(); api.requestMarkRead(item); }}>
            <Icon name="check" size={18} />
          </button>
          <button className="circ-cardaction circ-cardaction-icon cand-altaction" aria-label="Delete this link" title="Delete"
            onClick={() => { onClose(); api.requestDelete(item); }}>
            <Icon name="trash" size={17} />
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

// The writing face (LM-652). The alt face's own geometry — title and cross at
// the head, the hairline, your name below it — with a field where the words go
// and Add in the foot row beside the source. Sending closes the card back onto
// its band, now carrying them: writing is a round trip, out and back.
const CandWriteFace = ({ item, api, innerRef, onClose, onDone }) => {
  const [draft, setDraft] = React.useState('');
  const onSurface = React.useContext(CandSurfaceCtx);
  const send = () => { const text = draft.trim(); if (!text) return; candAddThought(api, item, text); onDone(); };
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

// The feed-row wrapper. The card itself is the shipped FeedCard, untouched.
//
// Closed: link card in front and full width, thought card behind it and inset.
// Open:   the two have changed places — the link card is behind, inset, clipped
//         to a sliver; the thought card is in front and full width.
//
// The two states are the same two elements at different sizes, so the change is
// a move rather than a replacement: both cards travel, the widths swap, and the
// stacking order flips at the crossing point, where the 15px of overlap makes it
// the least visible. Nothing fades in from nowhere.
const CandCardRow = ({ item, tab, api, children, Face, mark = 'lines', openPaper, corner }) => {
  const [open, setOpen] = React.useState(false);
  const [front, setFront] = React.useState(false); // stacking order; flips mid-travel
  const [moving, setMoving] = React.useState(false);
  const [held, setHeld] = React.useState(item.thought ? /\n/.test(item.thought.text) : false);
  // A card that HAS a thought, and a card of yours that could have one, both
  // carry a band — the second one empty (LM-652). The row is the same either way.
  const writable = candCanWrite(item);
  const showBand = tab === 'active' && !item.pending && (!!item.thought || writable);
  const [linkRef, linkH] = useCandHeight();
  const [bandRef, bandH] = useCandHeight();
  const [altRef, altH] = useCandHeight();

  // The transition is ALWAYS on: a transition does not start if the transition
  // property itself arrives in the same style recalculation as the value it would
  // animate, so arming it at toggle time can never work. The mount is safe for
  // the opposite reason — both cards render at `auto` until their first
  // measurement lands, and auto is not interpolatable, so the initial
  // auto → measured-px step passes without animating.
  const swap = (next) => { setMoving(true); setOpen(next); };
  const linkBox = React.useRef(null);
  const paperBox = React.useRef(null);
  const firstPaint = React.useRef(true);
  // The travel is driven explicitly rather than by a CSS transition. A CSS
  // transition needs the transition property to be present in the style BEFORE
  // the value changes, which React cannot guarantee across a single commit — and
  // when it misses, the card snaps with no sign that anything is wrong. Driving
  // the two geometries from known from/to values removes the ordering entirely.
  React.useLayoutEffect(() => {
    if (firstPaint.current) { firstPaint.current = false; return; }
    const l = linkBox.current, p = paperBox.current;
    if (!l || !p || !l.animate || !linkH) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const o = { duration: CAND_SWAP, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' };
    const linkOpen = { height: CAND_EDGE + 'px', marginLeft: CAND_INSET + 'px', marginRight: CAND_INSET + 'px' };
    const linkShut = { height: linkH + 'px', marginLeft: '0px', marginRight: '0px' };
    const paperOpen = { height: (altH || 0) + 'px', marginTop: '0px', marginLeft: '0px', marginRight: '0px' };
    const paperShut = { height: (bandH || 0) + 'px', marginTop: (-CAND_OVERLAP) + 'px', marginLeft: CAND_INSET + 'px', marginRight: CAND_INSET + 'px' };
    l.animate(open ? [linkShut, linkOpen] : [linkOpen, linkShut], o);
    p.animate(open ? [paperShut, paperOpen] : [paperOpen, paperShut], o);
  }, [open]);
  React.useEffect(() => { if (!showBand && open) setOpen(false); }, [showBand]);
  // The band arriving on a card that is ALREADY on the shelf (your own link
  // resolving out of `pending` with no thought on it) used to appear at full
  // height in one frame. The card lands first, alone; a beat later the band
  // slides out from under it, which is the same gesture the tuck already implies.
  // Cards that were born with a band are untouched — nothing to arrive.
  // Zero is the WRONG resting height: the band sits at margin-top -CAND_OVERLAP,
  // so a zero-height box contributes minus that to the row and drags everything
  // above it up before jolting back. CAND_OVERLAP is the height at which the box
  // contributes exactly nothing — the row stands still, and the band is entirely
  // behind the link card until it travels.
  // the band got one frame at full height before collapsing to zero — the flash
  // that read as the jarring part. Held at zero from its very first painted
  // frame, there is nothing to see until it travels. Cards born with a band are
  // untouched; the inner face is absolutely positioned, so it still measures at
  // full height inside a box clamped to nothing.
  const bornWithBand = React.useRef(showBand);
  const emerged = React.useRef(showBand);
  const [done, setDone] = React.useState(showBand);
  const arriving = showBand && !bornWithBand.current && !done;
  React.useLayoutEffect(() => {
    if (emerged.current || !showBand || bornWithBand.current || !bandH) return;
    const p = paperBox.current;
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    emerged.current = true;
    if (!p || !p.animate || still) { setDone(true); return; }
    const t = setTimeout(() => {
      const a = p.animate([{ height: CAND_OVERLAP + 'px' }, { height: bandH + 'px' }],
        { duration: CAND_SWAP, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
      a.onfinish = () => setDone(true);
      a.oncancel = () => setDone(true);
    }, CAND_BAND_WAIT);
    return () => clearTimeout(t);
  }, [showBand, bandH]);
  // The face is held through the closing travel whenever the thought's existence
  // changes while the card is open — writing one, or removing one. Swapping the
  // face first resolved the card and THEN collapsed it, which is two events for
  // one act; held, the card closes on what you were just looking at and the band
  // underneath (already remeasured) is what you land on.
  const [heldFace, setHeldFace] = React.useState(null);
  React.useEffect(() => { if (heldFace && !open && !moving) setHeldFace(null); }, [open, moving, heldFace]);
  const had = React.useRef(!!item.thought);
  const lastThought = React.useRef(null);
  if (item.thought) lastThought.current = item.thought;
  React.useEffect(() => {
    const lost = had.current && !item.thought;
    had.current = !!item.thought;
    // Removal takes the card back to having none, which is the BAND's state, not
    // the field's — so it goes down rather than reopening as an empty box.
    if (lost && open) { setHeldFace('alt'); setTimeout(() => swap(false), 60); }
  }, [!!item.thought]);
  const wrote = () => { setHeldFace('write'); setTimeout(() => swap(false), 60); };
  React.useEffect(() => {
    if (!moving) return;
    // The stacking order can only flip where the two cards do NOT overlap, or the
    // contested 15px changes colour in one frame and the card reads as popping.
    // The overlap closes to nothing at the open end of the travel, so that is
    // where the flip goes: the last frame of opening, the first of closing.
    const flip = open ? setTimeout(() => setFront(true), CAND_SWAP) : null;
    if (!open) setFront(false);
    const end = setTimeout(() => setMoving(false), CAND_SWAP + 20);
    return () => { if (flip) clearTimeout(flip); clearTimeout(end); };
  }, [open, moving]);

  if (!showBand) {
    return (
      <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)' }}>
        {children}
        {/* D1 — the fold is a READ-card mark. A card can be watched and unread at
            once (a contributor watching their own share); the shelf shows nothing
            for that case, and no second mark was invented for it. Open. */}
        {tab === 'read' && item.watching && <CandFold />}
      </div>
    );
  }

  const settled = !moving;
  const cls = 'cand-swap';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* The link card. Open, it is clipped to a sliver — and the sliver is the
          card's own top padding, so what shows is blank paper with its border and
          its top corners: the card itself, gone behind, not a stand-in for it. */}
      <div className={cls} ref={linkBox} onClick={open ? () => swap(false) : undefined}
        style={{ position: 'relative', zIndex: front ? 0 : 1, borderRadius: open ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)',
          boxShadow: open ? 'none' : 'var(--shadow-raised)',
          height: open ? CAND_EDGE : (linkH || 'auto'),
          margin: '0 ' + (open ? CAND_INSET : 0) + 'px',
          overflow: open || moving ? 'hidden' : 'visible',
          cursor: open ? 'pointer' : 'default' }}>
        <div ref={linkRef} style={{ pointerEvents: open ? 'none' : 'auto' }}>{children}</div>
        {/* The fold belongs to the LINK card, so it is drawn inside it — not
            over the stack. Pinned to the wrapper it stayed at the top-right
            while the link card slipped behind and was clipped to its sliver,
            leaving the corner floating above the opened thought. */}
        {corner && item.watching && !open && <CandFold />}
      </div>
      {/* The thought card. One element, two faces: the band while it is behind,
          the face while it is in front. They cross-fade over each other inside a
          card whose height is travelling between the two. */}
      <div className={'cand-paper ' + cls} ref={paperBox}
        style={{ position: 'relative', zIndex: front ? 2 : 0,
          background: open && openPaper ? openPaper.bg : CAND_PAPER.bg,
          border: '1px solid ' + (open && openPaper ? openPaper.bd : CAND_PAPER.bd),
          borderRadius: 'var(--radius-lg)', boxShadow: open ? 'var(--shadow-raised)' : 'none',
          margin: (open ? 0 : -CAND_OVERLAP) + 'px ' + (open ? 0 : CAND_INSET) + 'px 0',
          /* Clipped while the two cards are changing places, and while the band is
             the face. Open and settled it has to let a popover out of the box —
             the thought's own menu opens downwards from its name row. Only the
             travel itself clips. */
          height: arriving ? CAND_OVERLAP : ((open ? altH : bandH) || 'auto'), overflow: moving || arriving ? 'hidden' : 'visible' }}>
        <div className="cand-face" aria-hidden={open} style={{ position: 'absolute', inset: '0 0 auto 0', opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto' }}>
          <CandBandFace item={item} api={api} setHeld={setHeld} mark={mark} measurable={!open && settled} innerRef={bandRef}
            onOpen={() => swap(true)} />
        </div>
        <div className="cand-face" style={{ position: 'absolute', inset: '0 0 auto 0', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          /* Measured at the width it will HAVE when open. Closed, the paper card
             is inset CAND_INSET each side, so an alt face measured there is 24px
             narrower than it ends up — the height animated to was the narrow
             one, and the card snapped shorter the moment the alt face reflowed
             at full width, taking the whole conversation up with it. */
          width: open ? '100%' : 'calc(100% + ' + (CAND_INSET * 2) + 'px)' }} aria-hidden={!open}>
          {heldFace === 'write' || (!item.thought && !heldFace)
            ? <CandWriteFace item={item} api={api} innerRef={altRef} onClose={() => swap(false)} onDone={wrote} />
            : React.createElement(Face || CandAltFace, {
                item: heldFace === 'alt' ? { ...item, thought: lastThought.current } : item,
                api, innerRef: altRef, mark, onClose: () => swap(false) })}
        </div>
      </div>
      {/* An option may put the tell in the paper itself rather than in a glyph: a
          second sliver of paper behind the band, saying there is more of it. */}
      {mark === 'edge' && held && !open && (
        <div aria-hidden="true" style={{ position: 'relative', zIndex: -1, height: 5,
          background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd, borderTop: 0,
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', margin: '-1px ' + (CAND_INSET + 5) + 'px 0' }} />
      )}
    </div>
  );
};

// The way-through (item 3). Takes the reaction-analytics door's slot on a Read
// card; the roster analytics now draw on the surface it opens. Always present on
// a Read card — a read card always has a surface to visit.
// The shipped roster door, captured before this file overwrites window.SwellDoor.
const CandRosterDoor = window.SwellDoor;

const CandConvoButton = ({ item }) => {
  // On the conversation surface the card takes the SHIPPED roster door back into
  // this slot — glyphs inline, opening the review modal, exactly as the original
  // build's card. The way-through withdraws: it would point at the page it is
  // drawn on. The Read tab is unaffected — there this is still the way through.
  if (React.useContext(CandSurfaceCtx)) return CandRosterDoor ? <CandRosterDoor item={item} /> : null;
  // Inverted only where both are true: the card is watched, and it carries
  // words landed after the member's own mark. Not a count, not a badge — the
  // same mark, filled.
  const unseen = !!item.watching && candFresh(item).length > 0;
  return (
  <button type="button" className="circ-cardaction circ-cardaction-icon"
    aria-label={unseen ? 'Open this card\u2019s conversation \u2014 it has words you have not seen' : 'Open this card\u2019s conversation'}
    title={unseen ? 'Unseen words' : 'Conversation'}
    onClick={() => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard(item); }}>
    <CandWayIcon size={18} on={unseen} />
  </button>
  );
};

Object.assign(window, { CandCardRow, CandBandFace, CandBandMark, CandLines, CandCross, CandSourceLine, CandStackGlyph, CandSwapChev, CandEdge, CandAltFace, CandWriteFace, candCanWrite, CandConvoButton, SwellDoor: CandConvoButton });
