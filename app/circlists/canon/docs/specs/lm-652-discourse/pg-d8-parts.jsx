// ============================================================================
// Discourse v8 — shared parts. Everything the five states hold in common:
// the watching model, the bounded writing field, one utterance's typography,
// and the sheet the records are presented in.
// The sheet mechanism is the app's own (useSheetMount + portal to the phone
// screen), taken from app/swell-reactions.jsx via pg-d8-swell.jsx — not a
// second implementation.
// ============================================================================
const { useSheetMount: d8SheetMount, lockScroll: d8Lock, trapTab: d8Trap, CloseX: D8Close,
        depthWord: d8Depth, glyphName: d8GlyphName } = window;
const { Avatar: D8Avatar, Button: D8Button } = window;

// ---- The watched set -------------------------------------------------------
// Involvement, never the circle's activity at large: you contributed the link or
// you have spoken on it. A member may also stand a card up (or stand it down) by
// hand — the automatic set is the floor, not the whole.
const d8Watching = (item) => {
  if (item.unwatched) return false;
  if (item.watched) return true;
  if (/^added by you$/i.test(item.attribution || '')) return true;
  return (item.talk || []).some(t => t.by === 'You');
};
// What counts as new: anything said since you last looked, by someone else.
// `countReactions` — a bare reaction (a glyph, no words) also counts as movement.
const d8New = (item, countReactions) => {
  if (!d8Watching(item) || !item.read) return [];
  const since = item.seenAt || 0;
  const said = (item.talk || []).filter(t => t.by !== 'You' && t.at > since);
  if (!countReactions) return said;
  const rx = (item.reactions || []).filter(r => r.name !== 'You' && r.at && r.at > since);
  return [...said, ...rx];
};
const d8HasNew = (item, countReactions) => d8New(item, countReactions).length > 0;
// The age of the talk, in the app's own coarse words.
const d8TalkAge = (item) => {
  const t = (item.talk || []);
  if (!t.length) return null;
  return window.circWhen(t[t.length - 1].at);
};
const d8Say = (item, text, rx) => {
  const entry = { id: 'my' + Date.now(), by: 'You', text, at: Date.now(),
    glyph: (rx && rx.glyph) || null, intensity: (rx && rx.intensity) != null ? rx.intensity : null,
    replyTo: (rx && rx.replyTo) || null };
  return { ...item, talk: [...(item.talk || []), entry], seenAt: Date.now() };
};

// ---- The bounded writing field --------------------------------------------
// One field, five bounds. `lines` is the room, and the room IS the bound: the
// box never grows and never scrolls, so running out of it is something you see
// rather than something you are told. `rule` draws a hairline beneath that
// shortens as the room is used — a measure running out, never a number.
const D8Write = ({ value, onChange, lines = 1, max = 140, rule = false, placeholder, autoFocus, label }) => {
  const ref = React.useRef(null);
  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, [autoFocus]);
  const left = Math.max(0, 1 - value.length / max);
  return (
    <div style={{ width: '100%' }}>
      {label && <div style={{ font: '500 12px/1.4 var(--font-sans)', color: 'var(--color-fg-3)', marginBottom: 6 }}>{label}</div>}
      <textarea ref={ref} value={value} rows={lines} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.slice(0, max).replace(/\n/g, ' '))}
        style={{
          width: '100%', boxSizing: 'border-box', resize: 'none', overflow: 'hidden',
          font: '400 15px/1.55 var(--font-sans)', color: 'var(--color-fg-1)',
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
          borderRadius: 'var(--radius-md)', padding: '10px 12px',
          borderBottomLeftRadius: rule ? 0 : undefined, borderBottomRightRadius: rule ? 0 : undefined,
          borderBottom: rule ? '1px solid var(--color-border-2)' : undefined,
        }} />
      {rule && (
        <div aria-hidden="true" style={{ height: 2, background: 'var(--color-border-2)', borderRadius: 2, overflow: 'hidden', marginTop: -1 }}>
          <div style={{ height: '100%', width: (left * 100) + '%', background: 'var(--color-border-strong)', opacity: 0.55, transition: 'width 120ms linear' }} />
        </div>
      )}
    </div>
  );
};

// ---- One utterance ---------------------------------------------------------
// The name carries the weight (the card's attribution rule: never caption-sized,
// never greyed). A reply sits under what it answers, named, so nothing is lost
// by not threading it further.
const D8Line = ({ entry, all, showGlyph = true, showDepth = false, quiet = false, isNew = false, onReply }) => {
  const me = entry.by === 'You';
  const parent = entry.replyTo ? (all || []).find(t => t.id === entry.replyTo) : null;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingLeft: parent ? 22 : 0 }}>
      {showGlyph && (
        <span style={{ width: 22, flexShrink: 0, display: 'inline-flex', justifyContent: 'center', paddingTop: 2 }}>
          {entry.glyph
            ? <span style={{ fontSize: 15, lineHeight: 1 }} title={d8Depth({ intensity: entry.intensity })}>{entry.glyph}</span>
            : <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-border-1)', marginTop: 7 }} />}
        </span>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ font: '600 14px/1.3 var(--font-sans)', color: me ? 'var(--color-accent)' : 'var(--color-fg-1)' }}>{entry.by}</span>
          {parent && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>to {parent.by}</span>}
          {showDepth && entry.glyph && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{d8Depth({ intensity: entry.intensity })}</span>}
          <span style={{ font: '400 11px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{window.circWhen(entry.at)}</span>
          {isNew && <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-sage)' }} />}
        </div>
        <p style={{ margin: '3px 0 0', font: '400 ' + (quiet ? '14px' : '15px') + '/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{entry.text}</p>
        {onReply && entry.by !== 'You' && (
          <button type="button" onClick={() => onReply(entry)} className="circ-textlink" style={{
            marginTop: 4, background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer',
            font: '500 12.5px/1 var(--font-sans)', color: 'var(--color-fg-3)' }}>Answer {entry.by}</button>
        )}
      </div>
    </div>
  );
};

// The record body, ordered as it was said, replies sitting under their parent.
const d8Order = (talk) => {
  const roots = (talk || []).filter(t => !t.replyTo);
  const out = [];
  roots.forEach(r => {
    out.push(r);
    (talk || []).filter(t => t.replyTo === r.id).forEach(c => out.push(c));
  });
  (talk || []).filter(t => t.replyTo && !roots.some(r => r.id === t.replyTo)).forEach(t => out.push(t));
  return out;
};

const D8Talk = ({ item, showGlyph = true, showDepth = false, onReply, gap = 18 }) => {
  const list = d8Order(item.talk);
  if (!list.length) return (
    <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>Nobody has spoken here yet.</p>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {list.map(e => <D8Line key={e.id} entry={e} all={item.talk} showGlyph={showGlyph} showDepth={showDepth}
        isNew={e.by !== 'You' && e.at > (item.seenAt || 0)} onReply={onReply} />)}
    </div>
  );
};

// The contributor's line, as it reads inside a record: named, and set apart from
// everything said after the read.
const D8Thought = ({ item, size = 15 }) => item.thought ? (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 4 }}>
    <p style={{ margin: 0, font: '400 ' + size + 'px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{item.thought.text}</p>
    <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{item.thought.by === 'You' ? 'You' : item.thought.by}, adding it</span>
  </div>
) : null;

// ---- The presentation surface ---------------------------------------------
// Bottom sheet on a phone, centred dialog on a desktop canvas — the app's own
// rule, its own easing, its own portal target.
const D8Sheet = ({ title, onClose, children, foot, wide = false }) => {
  const panelRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const [narrow] = React.useState(() => (typeof window !== 'undefined' && window.innerWidth < 520)
    || (typeof document !== 'undefined' && !!document.querySelector('.circ-phone-screen')));
  const { shown, requestClose } = d8SheetMount(narrow, onClose);
  const [target] = React.useState(() => (typeof document !== 'undefined'
    && (document.querySelector('.circ-phone-screen') || document.body)) || null);
  React.useEffect(() => d8Lock(), []);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const tree = (
    <div onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
      className={narrow ? undefined : 'circ-anim-fade'}
      style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)',
        display: 'flex', justifyContent: 'center', alignItems: narrow ? 'flex-end' : 'center', padding: narrow ? 0 : 16,
        opacity: narrow ? (shown ? 1 : 0) : 1,
        transition: narrow ? 'opacity var(--duration-slow) ease-in-out' : undefined }}>
      <div role="dialog" aria-modal="true" aria-label={title} ref={panelRef} onKeyDown={(e) => d8Trap(panelRef.current, e)}
        style={narrow ? {
          position: 'relative', background: 'var(--color-surface)', width: '100%', maxWidth: 520,
          borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: 'var(--shadow-overlay)',
          maxHeight: 'calc(100% - 24px)', display: 'flex', flexDirection: 'column',
          transform: shown ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform var(--duration-slow) var(--ease-quiet)',
        } : {
          position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-overlay)', width: wide ? 520 : 420, maxWidth: '100%',
          maxHeight: '86vh', display: 'flex', flexDirection: 'column',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 12px 10px 20px', flexShrink: 0 }}>
          <h2 style={{ flex: 1, minWidth: 0, margin: 0, font: '600 16px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>{title}</h2>
          <button ref={closeRef} type="button" onClick={requestClose} aria-label="Close" className="circ-rx-close"
            style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
            <D8Close />
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', padding: '0 20px 16px' }}>{children}</div>
        {foot && <div style={{ flexShrink: 0, borderTop: '1px solid var(--color-border-2)', padding: 'var(--space-4) 20px calc(var(--space-4) + env(safe-area-inset-bottom, 0px))' }}>{foot}</div>}
      </div>
    </div>
  );
  return target ? ReactDOM.createPortal(tree, target) : tree;
};

// ---- Watch control ---------------------------------------------------------
// One row, wherever a state puts its record. Says what watching means, and lets
// a member stand a card up or down by hand.
const D8Watch = ({ item, onToggle }) => {
  const on = d8Watching(item);
  const auto = !item.watched && !item.unwatched && on;
  return (
    <button type="button" onClick={() => onToggle(item)} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, cursor: 'pointer',
      background: 'transparent', border: 0, padding: '8px 0', textAlign: 'left' }}>
      <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        border: '1.6px solid ' + (on ? 'var(--color-accent)' : 'var(--color-fg-3)'),
        background: on ? 'var(--color-accent)' : 'transparent',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {on && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
      </span>
      <span style={{ font: '500 13.5px/1.4 var(--font-sans)', color: 'var(--color-fg-1)' }}>
        {on ? 'Watching this card' : 'Watch this card'}
        {auto && <span style={{ color: 'var(--color-fg-3)', fontWeight: 400 }}> — you are part of it</span>}
      </span>
    </button>
  );
};

Object.assign(window, { d8Watching, d8New, d8HasNew, d8TalkAge, d8Say, d8Order, D8Write, D8Line, D8Talk, D8Thought, D8Sheet, D8Watch });
