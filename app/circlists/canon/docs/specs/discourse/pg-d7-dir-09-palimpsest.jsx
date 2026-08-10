// ============================================================================
// Discourse v7 — direction 09, Palimpsest.
// ----------------------------------------------------------------------------
// One line of text per card, owned by nobody, and any member who has read may
// write over it. The contributor writes the first line; it is unowned the
// moment it lands. Continuation is SUCCESSION, not accumulation: the card
// carries only the latest state, and the earlier lines are strata beneath it.
//
// THE CARD FACE — the museum plate. The line sits directly under the item's
// title, in the description slot, one step below body size, letterspaced, held
// between two hairlines. NO ATTRIBUTION ANYWHERE: not the sharer's, not the
// amender's. Authorship exists only in the strata. It reads as the object's
// description rather than anyone's utterance, which is the entire social
// permission structure of the direction rendered typographically — nobody's
// words are being edited, the object's description is being improved.
//
// THE PAIRING — amendment is the verbal register of the same gesture the Swell
// makes non-verbally. Both answer "how it landed": one graded, one worded. So
// the write-over affordance sits directly under the depth just committed, on
// the surface the Swell hands over to.
//
// THE ROUTE — THE LINE IS THE AFFORDANCE. There is no destination, no overlay,
// and no button anywhere.
//   contribution  the sharer writes the line at share; it is unowned the
//                 instant it lands.
//   reaction      untouched.
//   reading       the shipped reveal, then the current line beneath the disc
//                 with one affordance: write over it.
//   continuation  ON THE CARD, IN THE FEED. On a Read card the line sits in the
//                 description slot, framed by hairlines, unattributed. TAPPING
//                 IT TURNS IT INTO A FIELD IN PLACE, current text present,
//                 caret at the end. You edit one line and commit. NOTHING
//                 OPENS. On an Active card the line is present but inert: you
//                 have not read the item, so it reads as the object's
//                 description, which is exactly what it is.
// Giving succession a modal was rejected. Overwriting one line needs one line
// of surface, and ceremony around the act would make it feel like an edit war
// when the whole social permission of the direction is that improving a
// description is casual and unremarkable. An inline field on a Read card is
// also the one shape that cannot violate the Read-tab invariant — one line is
// not a floating mass of conversation. Nothing is destroyable: the previous
// line is in the strata the moment you commit, which is what makes editing in
// place safe enough to sit in a feed.
//
// THE RETURN DEVICE — when your line is written over, the object comes back to
// you quietly, in the shipped liveliness grammar (MicroDot, the shipped glow as
// the card comes into view, one word, no count). No surface is held open; the
// erasure does the calling back. A CHANGED CARD RISES TO THE TOP OF READ — that
// is ordering, not signalling: no count, no badge, nothing owed. It follows
// from the claim, too. The object's latest state is what matters, so the tab
// shows objects by latest state. The sharpest cost in the direction is exactly
// here: Read is the pile you finished with, and a pile that rearranges itself
// is unsettling in a product whose floor is calm.
//
// PRIVATE STATE — `strata[itemId]` is the whole succession, oldest first, the
// last entry being the line the card currently carries. Seeded from each item's
// own thought plus the amendments the circle has already made.
// ============================================================================

const { PGD7, Button, CircGlow, MicroDot } = window;
const { useState: pmS, useRef: pmR, useEffect: pmE } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS and
// levelFromIntensity internal. PLAYGROUND.md allows the copy; this is the
// pointer to its source. Verbatim — never "improved", or it stops being
// evidence of what the product actually says.
const PM_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const pmDepthOf = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };

// ============================================================================
// The succession.
// ----------------------------------------------------------------------------
// Every line the object has carried, oldest first. The last one is what the
// card shows; everything above it in time has already been written over.
// ============================================================================
const PM_HOUR = 3600e3;

// The amendments the circle has already made, over the sharer's own first line.
// Captions, not opinions: each one describes the object a little better than
// the line it covers, which is why it could be written without insult.
const PM_AMENDED = {
  // A sharper description than the one Priya opened with.
  a1: [['ada', 'Rota maths for a team of six, and the third-week hero as a bug in the rota rather than a fact of it.']],
  // Ada's seventy-word case compressed to a caption. Succession as compression.
  a4: [['marcus', 'A learned index judged on how it fails rather than how fast it runs. Section six is the paper.']],
  // Four layers, and yours is not the top one. The return device, seeded.
  r1: [
    ['dev', 'Pipelines, ownership, and why the sending side closes the channel.'],
    ['you', 'Channel ownership, worked through as a pipeline. The done channel is the spine.'],
    ['priya', 'Ownership, cancellation and the done channel, in the order you need them.'],
  ],
  r4: [['ada', 'The whole novel, free, in chapters short enough to survive a commute.']],
};

const pmSeedStrata = () => {
  const out = {};
  PGD7.data.items.forEach((item) => {
    const amends = PM_AMENDED[item.id];
    if (!amends) return;
    const base = item.thought
      ? [{ by: item.thought.by, text: item.thought.text, at: item.thought.at }]
      : [];
    // Spread the amendments evenly between the first line and now, so every
    // layer's age reads honestly through the shipped circWhen ladder.
    const from = (item.thought && item.thought.at) || item.at || (Date.now() - PM_HOUR);
    const step = Math.max(PM_HOUR, (Date.now() - from) / (amends.length + 1));
    out[item.id] = base.concat(amends.map(([by, text], i) => ({
      by, text, at: Math.min(from + (i + 1) * step, Date.now() - PM_HOUR),
    })));
  });
  return out;
};

// The object's whole succession. An item nobody has amended is its sharer's one
// line; an item with nothing attached carries nothing at all, and that is a
// legitimate state — a bare plate, waiting for its first line.
const pmLayers = (ctx, item) => {
  if (!item) return [];
  const kept = (ctx.state.strata || {})[item.id];
  if (kept) return kept;
  if (item.thought && item.thought.text) {
    return [{ by: item.thought.by, text: item.thought.text, at: item.thought.at }];
  }
  return [];
};
const pmCurrent = (ctx, item) => { const l = pmLayers(ctx, item); return l.length ? l[l.length - 1] : null; };

// Write over it. The line the object was carrying drops into the strata and the
// new one takes the plate — the object's description is replaced, never edited.
const pmWrite = (ctx, item, text) => {
  const next = String(text || '').trim();
  if (!next) return;
  const layers = pmLayers(ctx, item);
  ctx.setState((s) => ({
    strata: { ...(s.strata || {}), [item.id]: [...layers, { by: 'you', text: next, at: Date.now() }] },
  }));
  // The shared thought follows the plate, so anything else reading the item
  // sees the line the object actually carries now.
  ctx.actions.setThought(item.id, { text: next, register: 'gist' });
};

// Your line, written over by somebody else. The one thing that calls a member
// back to an object they had finished with.
const pmSucceeded = (ctx, item) => {
  const l = pmLayers(ctx, item);
  if (l.length < 2) return false;
  return l.slice(0, -1).some((x) => x.by === 'you') && l[l.length - 1].by !== 'you';
};

const pmWho = (ctx, id) => (id === 'you' ? 'You' : ctx.nameOf(id));
const pmWhen = (at) => (window.circWhen ? window.circWhen(at) : null);

// The Swell a member gave this item.
const pmSwellOf = (ctx, item, id) => {
  const m = ctx.memberById(id);
  if (!m) return null;
  let hit = null;
  (item.reactions || []).forEach((r) => { if (r && r.name === m.name && r.glyph) hit = r; });
  return hit;
};

// ============================================================================
// The plate.
// ----------------------------------------------------------------------------
// The one treatment this direction owns, rendered at two sizes and nowhere
// else. Hairline above, hairline below, letterspaced, a step under body size,
// and no name attached to it anywhere.
// ============================================================================
const PM_PLATE_TEXT = {
  fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)',
  letterSpacing: 'var(--tracking-wide)', color: 'var(--color-fg-1)',
  textWrap: 'pretty', margin: 0,
};
const PM_META = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
  lineHeight: 1.5, color: 'var(--color-fg-3)',
};

const PmPlate = ({ text, size = 14, clamp = 0, ghost = false, style }) => (
  <div style={{
    borderTop: '1px solid var(--color-border-2)',
    borderBottom: '1px solid var(--color-border-2)',
    padding: size >= 16 ? '12px 0' : '9px 0',
    ...(style || {}),
  }}>
    <p style={{
      ...PM_PLATE_TEXT, fontSize: size, lineHeight: size >= 16 ? 1.55 : 1.5,
      opacity: ghost ? 0.38 : 1,
      ...(clamp ? {
        display: '-webkit-box', WebkitLineClamp: clamp, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      } : {}),
    }}>{text}</p>
  </div>
);

// ============================================================================
// The strata — the only place a name ever appears. Lifted, not shown: the
// current line is the object, and the history is underneath it.
// ============================================================================
const PmStack = ({ ctx, layers }) => {
  if (!layers.length) return null;
  const stack = layers.slice().reverse();       // most recent first, sediment down
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      {stack.map((l, i) => (
        <li key={i} style={{
          paddingLeft: 14, borderLeft: '1px solid var(--color-border-2)',
          paddingBottom: i === stack.length - 1 ? 0 : 16,
        }}>
          <p style={{
            ...PM_PLATE_TEXT, fontSize: 13.5, lineHeight: 1.55,
            opacity: 1 - Math.min(i * 0.14, 0.42),
          }}>{l.text}</p>
          <div style={{ ...PM_META, marginTop: 5, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span>{pmWho(ctx, l.by)}</span>
            {pmWhen(l.at) && <span style={{ opacity: 0.8 }}>{pmWhen(l.at)}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
};

const PmLift = ({ ctx, layers, openLabel = 'Lift the layers' }) => {
  const [open, setOpen] = pmS(false);
  if (layers.length < 1) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: open ? 'var(--space-4)' : 0 }}>
      <button type="button" className="pm7-lift" onClick={() => setOpen((v) => !v)}
        aria-expanded={open} style={{
          appearance: 'none', background: 'transparent', border: 0, padding: '8px 0',
          textAlign: 'left', cursor: 'pointer', minHeight: 36, alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: 8, ...PM_META,
        }}>
        <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" style={{
          stroke: 'currentColor', strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round',
          transform: open ? 'none' : 'rotate(180deg)', transition: 'transform var(--duration-base) var(--ease-quiet)',
        }}><polyline points="6 15 12 9 18 15" /></svg>
        {open ? 'Lower the layers' : openLabel}
      </button>
      {open && <PmStack ctx={ctx} layers={layers} />}
    </div>
  );
};

// ============================================================================
// Writing over — the one act the direction has.
// ----------------------------------------------------------------------------
// The line being covered stays on screen, ghosted, while the new one is
// written: the point is that you are not editing anybody's words, you are
// putting a new description over the old one.
// ============================================================================
const PmWriteOver = ({ ctx, item, covering, onDone, onCancel, autoFocus = false }) => {
  const [text, setText] = pmS('');
  const ref = pmR(null);
  pmE(() => {
    // GOTCHA #1 — any focus inside a sheet that mounts off-screen must not scroll.
    if (autoFocus && ref.current) ref.current.focus({ preventScroll: true });
  }, [autoFocus]);
  const ready = !!text.trim();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {covering && <PmPlate text={covering.text} size={14} ghost />}
      <textarea ref={ref} rows={2} value={text}
        placeholder={covering ? 'Describe it better.' : 'Describe it in one line.'}
        onChange={(e) => setText(e.target.value.replace(/\s*\n+\s*/g, ' '))}
        style={{
          width: '100%', boxSizing: 'border-box',
          fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: 16,
          lineHeight: 1.5, letterSpacing: 'var(--tracking-wide)', color: 'var(--color-fg-1)',
          padding: '11px 13px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
          resize: 'vertical', minHeight: 72,
        }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {onCancel && <Button variant="secondary" size="sm" onClick={onCancel}>Leave it</Button>}
        <Button variant="primary" size="sm" disabled={!ready}
          onClick={() => { pmWrite(ctx, item, text); setText(''); onDone && onDone(); }}>
          {covering ? 'Write over it' : 'Write it'}
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// Writing over, IN PLACE — the continuation act, on the card, in the feed.
// ----------------------------------------------------------------------------
// The plate becomes a field with the line already in it and the caret at the
// end. No sheet, no page, no ceremony: you improve the description of the
// object while looking at the object. Escape leaves it, Enter commits, and the
// line you covered is in the strata the moment you do.
// ============================================================================
const PmInline = ({ ctx, item, line, onDone }) => {
  const [text, setText] = pmS(line ? line.text : '');
  const ref = pmR(null);
  pmE(() => {
    const el = ref.current;
    if (!el) return;
    // GOTCHA #1 — a focus inside a feed must never scroll the feed under the
    // reader's thumb.
    el.focus({ preventScroll: true });
    const n = el.value.length;
    try { el.setSelectionRange(n, n); } catch (e) {}
  }, []);
  const ready = !!text.trim() && text.trim() !== (line ? line.text : '');
  const commit = () => { if (ready) pmWrite(ctx, item, text); onDone(); };
  return (
    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <textarea ref={ref} rows={3} value={text}
        onChange={(e) => setText(e.target.value.replace(/\s*\n+\s*/g, ' '))}
        onKeyDown={(e) => {
          if (e.key === 'Escape') { e.preventDefault(); onDone(); }
          else if (e.key === 'Enter') { e.preventDefault(); commit(); }
        }}
        style={{
          width: '100%', boxSizing: 'border-box',
          fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: 14,
          lineHeight: 1.5, letterSpacing: 'var(--tracking-wide)', color: 'var(--color-fg-1)',
          padding: '8px 10px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
          resize: 'vertical',
        }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button variant="secondary" size="sm" onClick={onDone}>Leave it</Button>
        <Button variant="primary" size="sm" disabled={!ready} onClick={commit}>Write over it</Button>
      </div>
    </div>
  );
};

// ============================================================================
// The card face — the museum plate, in the description slot, under the title.
// ----------------------------------------------------------------------------
// On a Read card the plate is the field waiting to be opened: tap it and it
// becomes one, in place. On an Active card it is inert — you have not read the
// item, so the line is simply the object's description, which is what it is.
//
// A card whose line has moved carries the shipped glow as it comes into view,
// the same treatment an arriving card gets, for the same reason: something
// landed.
// ============================================================================
const PmCard = ({ ctx, item, tab }) => {
  const line = pmCurrent(ctx, item);
  const back = pmSucceeded(ctx, item);
  const editing = (ctx.state && ctx.state.editing) === item.id;
  const done = () => ctx.setState({ editing: null });

  if (!line && !editing) return null;             // nothing written on it yet — a bare card

  if (editing) return <PmInline ctx={ctx} item={item} line={line} onDone={done} />;

  const plate = <PmPlate text={line.text} size={14} clamp={3} />;

  return (
    <div style={{ marginTop: 8 }}>
      {tab === 'read' ? (
        <button type="button" className="pm7-plate"
          aria-label="Write over this line"
          onClick={() => ctx.setState({ editing: item.id })}
          style={{
            appearance: 'none', background: 'transparent', border: 0, padding: 0, margin: 0,
            textAlign: 'left', cursor: 'text', display: 'block', width: '100%', minWidth: 0,
          }}>
          {back ? <CircGlow glow>{plate}</CircGlow> : plate}
        </button>
      ) : plate}
      {/* The return device, in the shipped liveliness grammar: a quiet mark,
          one word, no count. It reports the object, never a person. */}
      {back && tab === 'read' && (
        <div style={{ ...PM_META, marginTop: 7, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span aria-hidden="true" style={{ display: 'inline-flex' }}><MicroDot size={8} /></span>
          Written over
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. The sharer writes the line, and it is unowned as it lands:
// what they are shown as they type is the plate, not a message with their name
// on it. Skipping is real — the object goes up with no description.
// ============================================================================
const PmCompose = ({ item, draft, setDraft, submit }) => {
  const text = draft.text;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <textarea rows={2} value={text} placeholder="Describe it in one line."
        onChange={(e) => setDraft({ ...draft, text: e.target.value.replace(/\s*\n+\s*/g, ' '), register: 'gist' })}
        style={{
          width: '100%', boxSizing: 'border-box',
          fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: 16,
          lineHeight: 1.5, letterSpacing: 'var(--tracking-wide)', color: 'var(--color-fg-1)',
          padding: '11px 13px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
          resize: 'vertical', minHeight: 72,
        }} />
      {!!text.trim() && (
        <div>
          <div style={{ ...PM_META, marginBottom: 6 }}>{item.source || window.pgd7Host(item.url)}</div>
          <PmPlate text={text.trim()} size={14} />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
        <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
        <Button variant="primary" disabled={!text.trim()}
          onClick={() => submit({ text: text.trim(), register: 'gist' })}>Write it</Button>
      </div>
    </div>
  );
};

// ============================================================================
// Beats 2 and 3 — one surface. Marking read hands over from the Swell to the
// plate: the depth you just gave, then the line the object is carrying, then
// the single affordance this direction has. Opened again from a Read card, the
// same surface, without the depth line.
// ============================================================================
const PmReading = ({ ctx, item, glyph, close }) => {
  const [writing, setWriting] = pmS(false);
  const layers = pmLayers(ctx, item);
  const line = layers.length ? layers[layers.length - 1] : null;
  const under = layers.slice(0, -1);
  const mine = pmSwellOf(ctx, item, 'you');
  const rx = mine || (glyph ? { glyph } : null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ paddingRight: 34, minWidth: 0 }}>
        <div style={{ ...PM_META, marginBottom: 4 }}>{item.source || window.pgd7Host(item.url)}</div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3,
          letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty',
        }}>{item.title || item.url.replace(/^https?:\/\//, '')}</div>
      </div>

      {/* One graded, one worded — the same answer to how it landed. */}
      {rx && rx.glyph && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>{rx.glyph}</span>
          {/* The app's own construction for a reactor: who, then how deep. */}
          <span style={PM_META}>You, {PM_DEPTH_WORDS[pmDepthOf(rx.intensity) - 1]}</span>
        </div>
      )}

      {writing ? (
        <PmWriteOver ctx={ctx} item={item} covering={line} autoFocus
          onCancel={() => setWriting(false)}
          onDone={() => setWriting(false)} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {line && <PmPlate text={line.text} size={16} />}
          <div>
            <Button variant={line ? 'secondary' : 'primary'} onClick={() => setWriting(true)}>
              {line ? 'Write over it' : 'Write the line'}
            </Button>
          </div>
        </div>
      )}

      {/* After writing, the line you covered is already underneath — the act is
          shown as succession, in the same movement. */}
      {under.length > 0 && !writing && <PmLift ctx={ctx} layers={under} />}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="tertiary" onClick={close}>Done</Button>
      </div>
    </div>
  );
};

// ---- The states inline styles cannot carry ---------------------------------
const PM_CSS = `
.pm7-plate:hover > div { border-color: var(--color-border-1); }
.pm7-plate:focus-visible,
.pm7-lift:focus-visible { outline: var(--ring-width) solid var(--color-accent); outline-offset: var(--ring-offset); border-radius: var(--radius-sm); }
.pm7-lift:hover { color: var(--color-fg-2); }
`;
if (typeof document !== 'undefined' && !document.getElementById('pm7-css')) {
  const pmStyleEl = document.createElement('style');
  pmStyleEl.id = 'pm7-css';
  pmStyleEl.textContent = PM_CSS;
  document.head.appendChild(pmStyleEl);
}

PGD7.register({
  id: 'palimpsest',
  name: 'Palimpsest',
  // The description slot: under the title, inside the text column, where an
  // object's description belongs. Never attributed, never a person's utterance.
  face: { slot: 'description' },
  initialState: { strata: pmSeedStrata(), editing: null },
  Card: PmCard,
  Compose: PmCompose,
  Landing: PmReading,
  Respond: PmReading,
  // NO Continue and NO Aside. This is the one direction that opens nothing at
  // all — no page, no sheet, no new band. Continuation is the line itself,
  // edited where it stands.
  //
  // The Read tab is ordered by the object's LATEST STATE, so a card whose
  // description has just moved rises to the top. Ordering, never signalling.
  order: (items, ctx) => {
    if (ctx.tab !== 'read') return items;
    const moved = (i) => { const l = pmLayers(ctx, i); return l.length ? (l[l.length - 1].at || 0) : 0; };
    return items.slice().sort((a, b) => moved(b) - moved(a));
  },
  beats: {
    // Land on an object whose description has already been written over once,
    // so the Swell hands over to a plate with strata under it.
    land: (api) => {
      const t = api.activeItems.find((i) => pmLayers(api, i).length > 1)
        || api.activeItems.find((i) => pmLayers(api, i).length) || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A read object carrying somebody else's standing line: writing over it is
    // the whole act, committed straight onto the plate.
    respond: (api) => {
      const t = api.itemById('r4')
        || api.readItems.find((i) => pmLayers(api, i).length > 1) || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
    // Continuation, where it actually happens: the Read tab, the object your
    // line was written over on standing at the top of it because its
    // description moved last, and its line already open as a field.
    continue: (api) => {
      const mine = api.readItems.find((i) => pmSucceeded(api, i));
      const t = mine || api.readItems.find((i) => pmLayers(api, i).length > 1) || api.firstRead();
      api.setRoute('feed');
      api.setTab('read');
      api.setState({ editing: t ? t.id : null });
    },
  },
});
