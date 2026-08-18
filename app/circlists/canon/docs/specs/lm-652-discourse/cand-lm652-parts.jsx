// ============================================================================
// LM-652 candidate — shared parts. The warm paper, plain-text rendering (item
// 8), the fold, the watching control's glyph, the writing field, and the item
// mutations every other cand-* file goes through.
// Loads after app/*, before the other cand-* files. Publishes on window.
// ============================================================================

// The thought's paper (working decision 2026-08-14; not a token yet).
const CAND_PAPER = { bg: '#F2F1EB', bd: '#DEDCD3', bdHover: '#CFCDC2' };
// The item-7 gate, ratified 2026-08-18: TWO counts, both met, neither first.
// Three replies from people other than you says the card drew attention; one
// reply of your own is the only evidence we hold that YOU enjoyed the
// conversation, which is who the line is for. Both count turns, not people, and
// both exclude deleted turns.
const CAND_OWN_MIN = 3;
const CAND_OWN_MINE = 1;

const candWhen = (at) => (window.circWhen ? window.circWhen(at) : null);
const candTitleOf = (item) => item.title || String(item.url || '').replace(/^https?:\/\//, '');

// ---- Plain text (item 8) ----------------------------------------------------
// Line breaks are preserved; a line starting with a dash renders as a bullet.
// Nothing else is parsed.
const CandProse = ({ text, size = 15, lh = 1.6, color = 'var(--color-fg-1)' }) => {
  const out = [];
  let list = null;
  String(text || '').split('\n').forEach((ln) => {
    const m = /^\s*-\s+(.*)$/.exec(ln);
    if (m) { if (!list) { list = []; out.push({ k: 'ul', items: list }); } list.push(m[1]); return; }
    list = null;
    if (!ln.trim()) { out.push({ k: 'gap' }); return; }
    out.push({ k: 'p', t: ln });
  });
  const f = { font: '400 ' + size + 'px/' + lh + ' var(--font-sans)', color, margin: 0, textWrap: 'pretty', overflowWrap: 'break-word' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {out.map((b, i) => b.k === 'gap'
        ? <span key={i} aria-hidden="true" style={{ height: 6 }} />
        : b.k === 'ul'
          ? <ul key={i} style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>{b.items.map((it, j) => <li key={j} style={f}>{it}</li>)}</ul>
          : <p key={i} style={f}>{b.t}</p>)}
    </div>
  );
};

// ---- The fold — a signal that this card is being watched. Not pressable. ----
// A soft emerald — the accent let down into the card's own surface, so the
// corner reads as turned down rather than marked. Solid accent was too strong
// for a state, and sage is the mark's colour, never a status. The outer corner
// takes the card's own 11px inner radius so it sits flush in the corner.
const CandFold = () => (
  <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, display: 'block', pointerEvents: 'none', zIndex: 2 }}>
    <path d="M0 0 H13 A11 11 0 0 1 24 11 V24 Z" fill="color-mix(in oklab, var(--color-accent) 30%, var(--color-surface))" />
  </svg>
);

// The fold as the CONTROL, on the conversation surface only. The mechanism and
// the signal become one thing, which takes a labelled toggle out of the card's
// action row. Watching = the emerald fold; not watching = the same corner in a
// faint grey, so there is something to press rather than an invisible target.
// Known cost: a 32px hit area, under the 44px house minimum — a 44px square in
// this corner would cover the top-right of the preview thumbnail, which is an
// open target. Flagged, not resolved.
const CandFoldToggle = ({ item, api }) => {
  const on = !!item.watching;
  return (
    <button type="button" className="cand-foldtoggle" onClick={() => candToggleWatch(api, item)} aria-pressed={on}
      aria-label={on ? 'Stop watching this conversation' : 'Watch this conversation'}
      title={on ? 'Stop watching this conversation' : 'Watch this conversation'}
      style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, padding: 0, border: 0,
        background: 'transparent', cursor: 'pointer', zIndex: 1 }}>
      <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, display: 'block' }}>
        <path d="M0 0 H13 A11 11 0 0 1 24 11 V24 Z"
          fill={on ? 'color-mix(in oklab, var(--color-accent) 30%, var(--color-surface))'
                   : 'color-mix(in oklab, var(--color-fg-3) 16%, var(--color-surface))'} />
      </svg>
    </button>
  );
};

// Page-with-a-folded-corner — the watching control's glyph, echoing the fold.
const CandFoldGlyph = ({ size = 15, filled = false }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M4 4 H14 L20 10 V20 H4 Z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M14 4 V10 H20" fill="none" stroke={filled ? 'var(--color-surface)' : 'currentColor'} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

// The way-through's mark (item 3). NOT a speech bubble: the surface it opens is
// the conversation AND the reaction record, and a bubble claims only the talk.
// So it is the shape the record already has — the Swell's disc, which is what
// the door in this slot drew — with what was said held inside it. The ring is
// how it landed; the three marks are the turns. Monoline, house set, no tail.
// Inverted (`on`) = a watched card holding words you have not seen. The disc
// fills and the marks reverse out of it. Filled in INK, never accent: this is
// status, and the accent is reserved for primary actions and active states.
const CandWayIcon = ({ size = 18, on = false }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="8.6" fill={on ? 'var(--color-fg-2)' : 'none'} stroke={on ? 'var(--color-fg-2)' : 'currentColor'} />
    {[8.2, 12, 15.8].map((cx) => (
      <circle key={cx} cx={cx} cy="12" r="1.05" fill={on ? 'var(--color-surface)' : 'currentColor'} stroke="none" />
    ))}
  </svg>
);
const CandBubbleIcon = CandWayIcon; // old name, kept so nothing dangles

// ---- Switch (the Add popover's Mark-as-read toggle) --------------------------
const CandSwitch = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
    style={{ background: 'transparent', border: 0, padding: 8, margin: -8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>
    <span aria-hidden="true" style={{ width: 40, height: 23, borderRadius: 12, background: on ? 'var(--color-accent)' : 'var(--color-border-1)', position: 'relative', transition: 'background var(--duration-base) var(--ease-quiet)', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2.5, left: on ? 19.5 : 2.5, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(10,10,10,0.18)', transition: 'left var(--duration-base) var(--ease-quiet)' }} />
    </span>
  </button>
);

// ---- The writing field ------------------------------------------------------
// One field for everything written here: the contributor's thought and every
// turn. Borderless words on the same warm paper they will land on; grows as you
// write (capped, then scrolls) so 500 characters stay readable and visible.
// The send glyph — an arrow, on the house control shape. Never a circle: the
// app's only circles are avatars and the Swell's disc.
const CandSendArrow = ({ size = 17 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="12" y1="19.5" x2="12" y2="5.5" /><polyline points="6 11.5 12 5.5 18 11.5" />
  </svg>
);

// Whiteboard 2, option 2 (2026-08-18): committing happens INSIDE the field —
// one control on the field's own edge, drawn at rest and inked once there are
// words. There is no Cancel: you take words back by clearing them, which is the
// one rule for every box in this product.
const CandWrite = ({ value, onChange, placeholder, max = 500, minLines = 2, maxPx = 220, autoFocus = false, ariaLabel, size = 15, onSend }) => {
  const ref = React.useRef(null);
  const [focus, setFocus] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, maxPx) + 'px';
  }, [value, maxPx]);
  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
  const left = max - String(value || '').length;
  return (
    <div style={{ position: 'relative', background: CAND_PAPER.bg, border: '1px solid ' + (focus ? 'var(--color-accent)' : CAND_PAPER.bd), borderRadius: 'var(--radius-md)', padding: '10px 12px 4px', transition: 'border-color var(--duration-base)' }}>
      <textarea ref={ref} className="cand-write" value={value} maxLength={max} placeholder={placeholder} aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ display: 'block', width: '100%', border: 0, outline: 'none', background: 'transparent', resize: 'none', padding: 0,
          font: '400 ' + size + 'px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', minHeight: Math.round(minLines * size * 1.6), overflowY: 'auto',
          paddingRight: onSend ? 40 : 0 }} />
      <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 15, paddingRight: onSend ? 40 : 0 }}>
        {left <= 60 && <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{left} left</span>}
      </div>
      {onSend && (
        <button type="button" className="cand-infield" data-live={String(value || '').trim() ? '' : undefined}
          onClick={() => { if (String(value || '').trim()) onSend(); }} aria-label="Send"
          style={{ position: 'absolute', right: 7, bottom: 7 }}>
          <CandSendArrow />
        </button>
      )}
    </div>
  );
};

const CandEyebrow = ({ children, style }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)', letterSpacing: '0.04em', ...(style || {}) }}>{children}</div>
);

// ---- Data helpers + mutations ------------------------------------------------
// A turn: { id, by, text, at, replyTo?, edited?, deleted? }. One level of reply,
// never deeper. 500 characters to a turn. Deleting leaves a mark (deleted: true)
// so replies beneath are not orphaned; nothing written is overwritten silently —
// an edit carries its marker.
const candUpdateItem = (api, itemId, fn) => api.setSpaces(prev => prev.map(s => s.id === api.currentId
  ? { ...s, items: s.items.map(i => i.id === itemId ? fn(i) : i) } : s));
const candTurns = (item) => ((item && item.talk) || []);
// Nothing is new on a first visit. A card with no mark has never been read
// against anything, so there is no "since" for the words to be after — the first
// visit sets the baseline and marks nothing. A mark is always a real timestamp;
// anything falsy means there is no baseline yet.
const candFresh = (item) => {
  const m = item && item.talkSeenAt;
  if (!m) return [];
  return candTurns(item).filter(t => !t.deleted && t.by !== 'You' && t.at > m);
};
const candResponses = (item) => candTurns(item).filter(t => !t.deleted && t.by !== 'You').length;
// Your own turns on the card — the thought is not one of them: it is given with
// the link, outside the conversation, so it is not evidence of taking part in it.
const candOwnTurns = (item) => candTurns(item).filter(t => !t.deleted && t.by === 'You').length;
const candNames = (names) => names.length === 1 ? names[0]
  : names.length === 2 ? names[0] + ' and ' + names[1]
  : names[0] + ', ' + names[1] + ' and others';
const candAddTurn = (api, item, text, replyTo) => candUpdateItem(api, item.id, i => ({ ...i,
  talk: [...(i.talk || []), { id: 'u' + Date.now() + Math.random().toString(36).slice(2, 5), by: 'You', text, at: Date.now(), ...(replyTo ? { replyTo } : {}) }] }));
const candEditTurn = (api, item, turnId, text) => candUpdateItem(api, item.id, i => ({ ...i,
  talk: (i.talk || []).map(t => t.id === turnId ? { ...t, text, edited: true } : t) }));
const candDeleteTurn = (api, item, turnId) => candUpdateItem(api, item.id, i => ({ ...i,
  talk: (i.talk || []).map(t => t.id === turnId ? { ...t, deleted: true, text: '' } : t) }));
const candToggleWatch = (api, item) => candUpdateItem(api, item.id, i => ({ ...i,
  watching: !i.watching, ...(i.watching ? {} : { talkSeenAt: Date.now() }) }));
// The contributor's own thought, edited and removed the way a turn is (item 3).
// An edit leaves the same marker a turn's edit does; a removal takes the thought
// off the card entirely, so the band and the stack go with it — there is no
// tombstone, because nothing is attached beneath a thought the way replies hang
// beneath a turn.
const candEditThought = (api, item, text) => candUpdateItem(api, item.id, i => ({ ...i,
  thought: { ...i.thought, text, edited: true } }));
const candDeleteThought = (api, item) => candUpdateItem(api, item.id, (i) => {
  const next = { ...i }; delete next.thought; return next;
});
// A turn the member has not seen: somebody else's words, landed after the mark
// this visit is read against. Deleted turns are tombstones and never glow.
const candTurnUnseen = (t, cut) => !t.deleted && t.by !== 'You' && t.at > (cut || 0);
// The resting wash — the arrival colour from .circ-glow, held as a state rather
// than played as an animation. Painted as the row's own ground, behind the
// words, so the text keeps its contrast for as long as the wash stands.
const CAND_WASH = 'rgba(139,191,173,0.34)';

// Set on the conversation surface, so the pieces the feed card mounts can tell
// they are already there — the way-through withdraws rather than pointing at the
// page it is drawn on.
const CandSurfaceCtx = React.createContext(false);

Object.assign(window, { CandSendArrow, CAND_PAPER, CAND_OWN_MIN, CAND_OWN_MINE, candWhen, candTitleOf, CandProse, CandFold, CandFoldGlyph, CandFoldToggle, CandSurfaceCtx,
  CandBubbleIcon, CandWayIcon, CandSwitch, CandWrite, CandEyebrow, candUpdateItem, candTurns, candFresh, candResponses, candOwnTurns,
  candNames, candAddTurn, candEditTurn, candDeleteTurn, candToggleWatch, candEditThought, candDeleteThought,
  candTurnUnseen, CAND_WASH });
