// ============================================================================
// LM-652 candidate — shared parts. The warm paper, plain-text rendering (item
// 8), the fold, the watching control's glyph, the writing field, and the item
// mutations every other cand-* file goes through.
// Loads after app/*, before the other cand-* files. Publishes on window.
// ============================================================================

// The thought's paper (working decision 2026-08-14; not a token yet).
const CAND_PAPER = { bg: '#F2F1EB', bd: '#DEDCD3', bdHover: '#CFCDC2' };
const CAND_OWN_MIN = 1; // PLACEHOLDER — the item-7 minimum is unset upstream; picked for the mock only.

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
const CandWayIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="8.2" cy="12" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="15.8" cy="12" r="1.05" fill="currentColor" stroke="none" />
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
const CandWrite = ({ value, onChange, placeholder, max = 500, minLines = 2, maxPx = 220, autoFocus = false, ariaLabel, size = 15 }) => {
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
    <div style={{ background: CAND_PAPER.bg, border: '1px solid ' + (focus ? 'var(--color-accent)' : CAND_PAPER.bd), borderRadius: 'var(--radius-md)', padding: '10px 12px 4px', transition: 'border-color var(--duration-base)' }}>
      <textarea ref={ref} className="cand-write" value={value} maxLength={max} placeholder={placeholder} aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ display: 'block', width: '100%', border: 0, outline: 'none', background: 'transparent', resize: 'none', padding: 0,
          font: '400 ' + size + 'px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', minHeight: Math.round(minLines * size * 1.6), overflowY: 'auto' }} />
      <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 15 }}>
        {left <= 60 && <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{left} left</span>}
      </div>
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
const candFresh = (item) => candTurns(item).filter(t => !t.deleted && t.by !== 'You' && t.at > (item.talkSeenAt || 0));
const candResponses = (item) => candTurns(item).filter(t => !t.deleted && t.by !== 'You').length;
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

Object.assign(window, { CAND_PAPER, CAND_OWN_MIN, candWhen, candTitleOf, CandProse, CandFold, CandFoldGlyph,
  CandBubbleIcon, CandWayIcon, CandSwitch, CandWrite, CandEyebrow, candUpdateItem, candTurns, candFresh, candResponses,
  candNames, candAddTurn, candEditTurn, candDeleteTurn, candToggleWatch });
