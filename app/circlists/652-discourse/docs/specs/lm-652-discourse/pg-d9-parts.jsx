// ============================================================================
// Discourse v9 — shared parts.
//   · the watching model (involvement, never the circle's activity at large)
//   · the bounded writing field
//   · FIVE treatments for the contributor's thought on the card face
//   · the conversation: one utterance, the thread, the composer
//   · the presentation sheet (the app's own mechanism) and the watch control
//
// v8 defect fixed here: D8Write mixed the `border` shorthand with a conditional
// `borderBottom`, and React clears the longhand when the conditional is
// undefined — the UA's own dark textarea border came back through the gap. That
// is the "black line on the bottom" of every input in v8. Borders are longhands
// only, in this file and everywhere below it.
// ============================================================================
const { useSheetMount: d9SheetMount, lockScroll: d9Lock, trapTab: d9Trap, CloseX: D9Close,
        depthWord: d9Depth } = window;

// ---- the watched set -------------------------------------------------------
const d9Watching = (item) => {
  if (item.unwatched) return false;
  if (item.watched) return true;
  if (/^added by you$/i.test(item.attribution || '')) return true;
  return (item.talk || []).some(t => t.by === 'You');
};
const d9New = (item, countReactions) => {
  if (!d9Watching(item) || !item.read) return [];
  const since = item.seenAt || 0;
  const said = (item.talk || []).filter(t => t.by !== 'You' && t.at > since);
  if (!countReactions) return said;
  const rx = (item.reactions || []).filter(r => r.name !== 'You' && r.at && r.at > since);
  return [...said, ...rx];
};
const d9HasNew = (item, bare) => d9New(item, bare).length > 0;
const d9NewSaid = (item, st) => d9New(item, st && st.countBareReactions).filter(e => e && e.text);
// Anything said, at all, by anyone: what a state uses to decide whether a card
// has a conversation on it — separate from whether it has moved since you looked.
const d9Talking = (item) => (item.talk || []).length > 0;
const d9TalkAge = (item) => {
  const t = (item.talk || []);
  return t.length ? window.circWhen(t[t.length - 1].at) : null;
};
const d9Title = (item) => item.title || window.d9DeriveTitle(item.url) || window.d9HostOf(item.url);
// Staleness — how a card leaves the watched set on its own, which v8 never
// built. A conversation that has not moved in a fortnight has finished; the card
// stays on the shelf and stays readable, it simply stops being something that
// can reach you. Standing it back up by hand overrides this.
const D9_STALE = 14 * 24 * 3600e3;
const d9Stale = (item) => {
  if (item.watched) return false;
  const t = (item.talk || []);
  if (!t.length) return false;
  return (Date.now() - t[t.length - 1].at) > D9_STALE;
};
const d9Wanted = (items, st) => (items || []).filter(i => i.read && d9Watching(i) && !d9Stale(i) && d9HasNew(i, st && st.countBareReactions));
// Who has spoken since you looked, across the gathered set — names, never a count.
const d9Spoke = (wanted, st) => {
  const out = [];
  (wanted || []).forEach(i => d9NewSaid(i, st).forEach(e => { if (!out.includes(e.by)) out.push(e.by); }));
  return out;
};
// Did YOUR line get answered? The warmest thing return can say.
const d9AnsweredYou = (item, st) => d9NewSaid(item, st).some(e => {
  const p = (item.talk || []).find(t => t.id === e.replyTo);
  return p && p.by === 'You';
});
const d9Say = (item, text, rx) => {
  const entry = { id: 'my' + Date.now() + Math.random().toString(36).slice(2, 5), by: 'You', text, at: Date.now(),
    glyph: (rx && rx.glyph) || null, intensity: (rx && rx.intensity) != null ? rx.intensity : null,
    replyTo: (rx && rx.replyTo) || null };
  return { ...item, talk: [...(item.talk || []), entry], seenAt: Date.now() };
};

// ---- the bounded writing field --------------------------------------------
// `lines` is the room and the room IS the bound: the box never grows and never
// scrolls, so running out of it is something you see. `rule` draws a measure
// beneath that shortens as the room is used — never a number.
// `frame`: 'box' the ordinary field · 'plain' no box, rules only · 'sunken' on
// a warm ground. Borders are longhands (see the header note).
const D9Write = ({ value, onChange, lines = 1, max = 140, rule = false, frame = 'box',
                   placeholder, autoFocus, label, hint, size = 15 }) => {
  const ref = React.useRef(null);
  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, [autoFocus]);
  const used = Math.min(1, value.length / max);
  const box = {
    box: { borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
      background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '10px 12px' },
    sunken: { borderWidth: 1, borderStyle: 'solid', borderColor: 'transparent',
      background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-md)', padding: '10px 12px' },
    plain: { borderWidth: 0, borderStyle: 'solid', borderColor: 'transparent',
      background: 'transparent', borderRadius: 0, padding: '2px 0' },
  }[frame];
  return (
    <div style={{ width: '100%' }}>
      {label && <div style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)', marginBottom: 8 }}>{label}</div>}
      <textarea ref={ref} value={value} rows={lines} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.slice(0, max).replace(/\n/g, ' '))}
        style={{ width: '100%', boxSizing: 'border-box', resize: 'none', overflow: 'hidden', display: 'block',
          font: '400 ' + size + 'px/1.6 var(--font-sans)', color: 'var(--color-fg-1)',
          transition: 'border-color var(--duration-base)', ...box }} />
      {rule && (
        <div aria-hidden="true" style={{ height: 2, marginTop: 6, background: 'var(--color-border-2)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: ((1 - used) * 100) + '%', background: 'var(--color-border-strong)', opacity: 0.5, transition: 'width 120ms linear' }} />
        </div>
      )}
      {hint && <div style={{ marginTop: 7, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>{hint}</div>}
    </div>
  );
};

// ============================================================================
// THE CONTRIBUTOR'S THOUGHT, ON THE CARD FACE — five treatments
// The failure in v8 was one treatment, five times: bare body text under the
// title, which reads as the page's own standfirst. Each of these names the
// speaker as part of the form, so the words can only be read as a person's.
// A treatment may be given `onOpen`, which makes the whole thought a way in.
// ============================================================================
const d9Who = (t) => (t.by === 'You' ? 'You' : t.by);
// The current member's avatar must be the same face everywhere: the card's
// attribution row draws it from displayName(user), so a thread that drew "You"
// gave the same person two sets of initials in one view. The label stays "You";
// only the face is resolved.
const d9MyName = () => {
  try { return window.displayName(window.CircSeed.DEFAULT_USER); } catch (e) { return 'You'; }
};

const D9ThoughtShell = ({ onOpen, children, label }) => onOpen ? (
  <button type="button" onClick={onOpen} className="circ-d9-thought" aria-label={label || 'Open the conversation'}
    style={{ display: 'block', width: '100%', textAlign: 'left', background: 'transparent', border: 0,
      padding: 0, margin: '6px 0 0', cursor: 'pointer', font: 'inherit', borderRadius: 'var(--radius-md)' }}>
    {children}
  </button>
) : <div style={{ margin: '6px 0 0' }}>{children}</div>;

// A — the margin. A rule down the left in the mark's own sage, the words, then
// the speaker as a trailing byline. The quotation bar, done properly.
const D9ThoughtMargin = ({ item, onOpen }) => item.thought ? (
  <D9ThoughtShell onOpen={onOpen}>
    <div style={{ borderLeftWidth: 2, borderLeftStyle: 'solid', borderLeftColor: 'var(--color-sage)', paddingLeft: 12 }}>
      <p style={{ margin: 0, font: '400 14.5px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{item.thought.text}</p>
      <span style={{ display: 'block', marginTop: 4, font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{d9Who(item.thought)}</span>
    </div>
  </D9ThoughtShell>
) : null;

// B — said aloud. A warm ground with the contributor's own face on it, so the
// words belong to somebody before they are read.
const D9ThoughtSaid = ({ item, onOpen }) => item.thought ? (
  <D9ThoughtShell onOpen={onOpen}>
    <div style={{ background: 'var(--color-surface-sunken)', borderRadius: 12, padding: '10px 12px 11px',
      display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <window.Avatar name={item.thought.by === 'You' ? d9MyName() : item.thought.by} size={20} accent={item.thought.by === 'You'} />
        <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{d9Who(item.thought)}</span>
      </div>
      <p style={{ margin: 0, font: '400 14.5px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{item.thought.text}</p>
    </div>
  </D9ThoughtShell>
) : null;

// C — in their hand. No box at all: the speaker is named in the app's own mono
// eyebrow above the line, which is what stops it reading as a standfirst.
const D9ThoughtHand = ({ item, onOpen }) => item.thought ? (
  <D9ThoughtShell onOpen={onOpen}>
    <span style={{ display: 'block', font: '500 10.5px/1 var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>{d9Who(item.thought)} said</span>
    <p style={{ margin: '5px 0 0', font: '400 15px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{item.thought.text}</p>
  </D9ThoughtShell>
) : null;

// D — the plate. A bordered leaf with the mark's ring in the gutter: the same
// shape the Swell's disc is drawn from, at card scale.
const D9ThoughtPlate = ({ item, onOpen }) => item.thought ? (
  <D9ThoughtShell onOpen={onOpen}>
    <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-2)', borderRadius: 'var(--radius-md)',
      padding: '10px 12px 10px 11px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span aria-hidden="true" style={{ flexShrink: 0, width: 14, height: 14, marginTop: 3, borderRadius: '50%',
        borderWidth: 3.5, borderStyle: 'solid', borderColor: 'var(--color-sage)' }} />
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, font: '400 14.5px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{item.thought.text}</p>
        <span style={{ display: 'block', marginTop: 4, font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{d9Who(item.thought)}</span>
      </div>
    </div>
  </D9ThoughtShell>
) : null;

// E — the spine. The thought is the card's headline and the article steps back
// to a source line. The most committed treatment: the circle's words lead.
const D9ThoughtSpine = ({ item, onOpen }) => item.thought ? (
  <D9ThoughtShell onOpen={onOpen}>
    <p style={{ margin: 0, font: '600 17px/1.4 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{item.thought.text}</p>
  </D9ThoughtShell>
) : null;

// Inside a record: the thought at the head of the conversation, set apart from
// everything said after the read.
const D9ThoughtHead = ({ item, size = 15.5 }) => item.thought ? (
  <div style={{ borderLeftWidth: 2, borderLeftStyle: 'solid', borderLeftColor: 'var(--color-sage)', paddingLeft: 14 }}>
    <p style={{ margin: 0, font: '400 ' + size + 'px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{item.thought.text}</p>
    <span style={{ display: 'block', marginTop: 5, font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>
      {d9Who(item.thought)}, adding it
    </span>
  </div>
) : null;

// ============================================================================
// THE CONVERSATION
// v8's defect: every line was a top-level reflection, so a record could not be
// a conversation at all. Here a reply is anchored under what it answers, every
// line can be answered, and answering is the SAME mechanism as speaking at the
// read — never a second one.
// ============================================================================
const d9Order = (talk) => {
  const all = talk || [];
  const roots = all.filter(t => !t.replyTo);
  const out = [];
  roots.forEach(r => {
    out.push({ e: r, depth: 0 });
    all.filter(t => t.replyTo === r.id).forEach(c => {
      out.push({ e: c, depth: 1 });
      all.filter(g => g.replyTo === c.id).forEach(g => out.push({ e: g, depth: 1 }));
    });
  });
  all.filter(t => t.replyTo && !out.some(o => o.e.id === t.id)).forEach(t => out.push({ e: t, depth: 1 }));
  return out;
};

const D9Utterance = ({ entry, all, depth = 0, showGlyph = true, showDepth = false, isNew, onReply, avatars = false }) => {
  const me = entry.by === 'You';
  const parent = entry.replyTo ? (all || []).find(t => t.id === entry.replyTo) : null;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingLeft: depth ? 24 : 0,
      borderLeftWidth: depth ? 1 : 0, borderLeftStyle: 'solid', borderLeftColor: 'var(--color-border-2)',
      marginLeft: depth ? 10 : 0 }}>
      {avatars
        ? <span style={{ flexShrink: 0, paddingTop: 1 }}><window.Avatar name={me ? d9MyName() : entry.by} size={depth ? 22 : 26} accent={me} /></span>
        : showGlyph && (
          <span style={{ width: 22, flexShrink: 0, display: 'inline-flex', justifyContent: 'center', paddingTop: 2 }}>
            {entry.glyph
              ? <span style={{ fontSize: 15, lineHeight: 1 }} title={d9Depth({ intensity: entry.intensity })}>{entry.glyph}</span>
              : <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-border-1)', marginTop: 7 }} />}
          </span>
        )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ font: '600 14px/1.3 var(--font-sans)', color: me ? 'var(--color-accent)' : 'var(--color-fg-1)' }}>{entry.by}</span>
          {parent && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>to {parent.by === 'You' ? 'you' : parent.by}</span>}
          {avatars && showGlyph && entry.glyph && <span style={{ fontSize: 13, lineHeight: 1 }} title={d9Depth({ intensity: entry.intensity })}>{entry.glyph}</span>}
          {showDepth && entry.glyph && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{d9Depth({ intensity: entry.intensity })}</span>}
          <span style={{ font: '400 11px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{window.circWhen(entry.at)}</span>
          {isNew && <span aria-hidden="true" title="said since you last looked" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-sage)' }} />}
        </div>
        <p style={{ margin: '3px 0 0', font: '400 15px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{entry.text}</p>
        {onReply && !me && (
          <button type="button" onClick={() => onReply(entry)} className="circ-d9-answer" style={{
            marginTop: 3, background: 'transparent', border: 0, padding: '4px 8px', marginLeft: -8, borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>Answer {entry.by}</button>
        )}
      </div>
    </div>
  );
};

// The thread. `collapse` keeps a long record calm: the first line, a way into
// the middle, and the tail — so two lines and forty read the same shape.
const D9Thread = ({ item, showGlyph = true, showDepth = false, avatars = false, onReply, gap = 18, collapse = false, tail = 3 }) => {
  const [all, setAll] = React.useState(false);
  const rows = d9Order(item.talk);
  if (!rows.length) return (
    <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>Nobody has spoken here yet. You would be the first.</p>
  );
  const hide = collapse && !all && rows.length > tail + 2;
  const shown = hide ? [rows[0], ...rows.slice(-tail)] : rows;
  const line = (o, i) => (
    <D9Utterance key={o.e.id} entry={o.e} all={item.talk} depth={o.depth} showGlyph={showGlyph} showDepth={showDepth}
      avatars={avatars} isNew={o.e.by !== 'You' && o.e.at > (item.seenAt || 0)} onReply={onReply} />
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {shown.map((o, i) => (
        <React.Fragment key={o.e.id}>
          {line(o, i)}
          {hide && i === 0 && (
            <button type="button" onClick={() => setAll(true)} className="circ-d9-earlier" style={{
              alignSelf: 'flex-start', background: 'transparent', border: 0, padding: '6px 0', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8, font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>
              <span aria-hidden="true" style={{ width: 22, height: 1, background: 'var(--color-border-1)' }} />
              Everything said in between
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// The composer. Speaking again and answering somebody are the same control —
// a reply simply carries who it is addressed to.
const D9Composer = ({ item, ctx, lines = 2, max = 220, rule = false, frame = 'box', replyTo, onCancelReply,
                      placeholder, cta = 'Leave it', autoFocus }) => {
  const [text, setText] = React.useState('');
  const send = () => { const t = text.trim(); if (!t) return; ctx.say(item, t, replyTo ? replyTo.id : null); setText(''); onCancelReply && onCancelReply(); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {replyTo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>
          <span aria-hidden="true" style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--color-accent)' }} />
          <span style={{ flex: 1, minWidth: 0 }}>Answering {replyTo.by}</span>
          <button type="button" onClick={onCancelReply} className="circ-d9-answer" style={{
            background: 'transparent', border: 0, padding: '4px 8px', margin: '-4px -8px', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', font: '500 12.5px/1 var(--font-sans)', color: 'var(--color-fg-3)' }}>Cancel</button>
        </div>
      )}
      <D9Write value={text} onChange={setText} lines={lines} max={max} rule={rule} frame={frame} autoFocus={autoFocus}
        placeholder={placeholder || (replyTo ? 'Answer ' + replyTo.by : 'Say something else')} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <window.Button variant="primary" size="sm" onClick={send} disabled={!text.trim()}>{cta}</window.Button>
      </div>
    </div>
  );
};

// ---- the presentation surface ---------------------------------------------
// Bottom sheet on a phone, centred dialog on a desktop canvas — the app's own
// rule, easing and portal target (useSheetMount, from pg-d9-swell.jsx).
const D9Sheet = ({ title, onClose, children, foot, head, wide = false }) => {
  const panelRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const [narrow] = React.useState(() => (typeof window !== 'undefined' && window.innerWidth < 520)
    || (typeof document !== 'undefined' && !!document.querySelector('.circ-phone-screen')));
  const { shown, requestClose } = d9SheetMount(narrow, onClose);
  const [target] = React.useState(() => (typeof document !== 'undefined'
    && (document.querySelector('.circ-phone-screen') || document.body)) || null);
  React.useEffect(() => d9Lock(), []);
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
      <div role="dialog" aria-modal="true" aria-label={title} ref={panelRef} onKeyDown={(e) => d9Trap(panelRef.current, e)}
        style={narrow ? {
          position: 'relative', background: 'var(--color-surface)', width: '100%', maxWidth: 520,
          borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: 'var(--shadow-overlay)',
          maxHeight: 'calc(100% - 24px)', display: 'flex', flexDirection: 'column',
          transform: shown ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform var(--duration-slow) var(--ease-quiet)',
        } : {
          position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-overlay)', width: wide ? 540 : 430, maxWidth: '100%',
          maxHeight: '86vh', display: 'flex', flexDirection: 'column',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 12px 10px 20px', flexShrink: 0 }}>
          <h2 style={{ flex: 1, minWidth: 0, margin: 0, font: '600 16px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>{title}</h2>
          {head}
          <button ref={closeRef} type="button" onClick={requestClose} aria-label="Close" className="circ-rx-close"
            style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
            <D9Close />
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', padding: '0 20px 16px' }}>{children}</div>
        {foot && <div style={{ flexShrink: 0, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', padding: 'var(--space-4) 20px calc(var(--space-4) + env(safe-area-inset-bottom, 0px))' }}>{foot}</div>}
      </div>
    </div>
  );
  return target ? ReactDOM.createPortal(tree, target) : tree;
};

// ---- the way to the article ------------------------------------------------
// Wherever a member lands on a record, the article itself is one tap away. v8
// left a member inside a return surface with no way through to the thing being
// discussed; that cannot happen in a state here.
const D9ToArticle = ({ item, compact = false }) => (
  <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-d9-toart"
    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 40, padding: compact ? '0 4px' : '0 2px',
      textDecoration: 'none', font: '500 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>
    <window.Icon name="external-link" size={14} color="var(--color-fg-3)" />
    {compact ? 'Open' : 'Open the article'}
  </a>
);

// ---- watching -------------------------------------------------------------
// One glyph, three sizes, used everywhere: the mark's ring, filled when you are
// watching. v8 spent a 44px row and a sentence on this in all five states; here
// it is a control the size of a control, and the sentence is its title.
const D9WatchRing = ({ on, size = 15 }) => (
  <span aria-hidden="true" style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0,
    borderWidth: 2, borderStyle: 'solid', borderColor: on ? 'var(--color-accent)' : 'var(--color-fg-3)',
    background: 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    {on && <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: '50%', background: 'var(--color-accent)' }} />}
  </span>
);

const D9Watch = ({ item, onToggle, label = true }) => {
  const on = d9Watching(item);
  const auto = !item.watched && !item.unwatched && on;
  return (
    <button type="button" onClick={() => onToggle(item)} className="circ-d9-watch" aria-pressed={on}
      title={auto ? 'You are part of this card, so you are watching it. Stand it down to stop.' : on ? 'Stop watching this card' : 'Watch this card'}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 10px', marginLeft: -10,
        background: 'transparent', borderWidth: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
      <D9WatchRing on={on} />
      {label && <span style={{ font: '500 13px/1.3 var(--font-sans)', color: on ? 'var(--color-fg-1)' : 'var(--color-fg-3)' }}>{on ? 'Watching' : 'Watch'}</span>}
    </button>
  );
};

Object.assign(window, {
  d9Watching, d9New, d9HasNew, d9NewSaid, d9Talking, d9TalkAge, d9Title, d9Wanted, d9Stale, D9_STALE, d9Spoke, d9AnsweredYou, d9Say, d9Order, d9Who, d9MyName,
  D9Write, D9Thread, D9Utterance, D9Composer, D9Sheet, D9Watch, D9WatchRing, D9ToArticle,
  D9ThoughtMargin, D9ThoughtSaid, D9ThoughtHand, D9ThoughtPlate, D9ThoughtSpine, D9ThoughtHead, D9ThoughtShell,
});
