// ============================================================================
// Discourse v7 — direction 11, The Record.
// ----------------------------------------------------------------------------
// The easiest thing, done properly. Reaction and words are ONE act, and the
// Reaction door holds the whole of it.
//
// THE CARD FACE — none. The shipped FeedCard, untouched, on both tabs. The door
// is the whole affordance, so `face.slot` stays 'none' and there is no Card.
//
// ONE BREATH — you drag the Swell and leave your line in the SAME SHEET. The
// shipped SwellReactionFlow commits, unmounts, and this record takes the
// sheet's place with the composer already focused and the glyph you just gave
// sitting beside it in its rung word. No second step, no second navigation.
//
// TWO REGISTERS, NEVER ONE FLAT LIST — a member who left words renders as a
// full entry carrying their glyph and its rung; a member who only reacted stays
// as a roster chip underneath. Flattening an eight-reactor item into equal rows
// is unreadable, and that lesson is already paid for.
//
// THE DEPTH IS PART OF WHAT WAS SAID — every entry prints the glyph its author
// gave and the rung it landed on in the app's own spoken word ('a little',
// 'moderately', 'deeply'). What a member gave on the pad and what they said in
// words are one utterance, shown as one thing.
//
// CONTINUATION IS BOUNDED BY STRUCTURE — any entry may be answered directly
// beneath it, and nothing hangs off a reply. One level, ever. That is the whole
// continuation mechanism: no rule shown to the reader, no depth to police.
//
// FIXING A SKIP ON READ — a member who skipped the pad is offered it back from
// the composer, on the same surface, whenever they open the record.
//
// ROUTE TO EVERY LAYER WITHOUT THE DRIVER. Attach: the FAB, the app's own add
// flow. Reaction + reading: mark read on any Active card. The record and its
// continuation: the door on any Read card (`doorOpens: 'respond'`). Nothing
// else added anywhere.
// ============================================================================

const { PGD7, Button, Avatar } = window;
const { useState: rcS, useEffect: rcE, useRef: rcR } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS and
// levelFromIntensity internal. PLAYGROUND.md allows the copy; this is the
// pointer to its source. Verbatim — never "improved", or it stops being
// evidence of what the product actually says.
const RC_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const rcLevel = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };
const rcRung = (r) => RC_DEPTH_WORDS[rcLevel(r && r.intensity) - 1];

// ---- Who ---------------------------------------------------------------------
const rcWho = (ctx, id) => (id === 'you' ? 'You' : ctx.nameOf(id));
// The card's own avatar rule: the viewer's roster identity is 'You', their face
// carries their real initials, in accent.
const rcFace = (ctx, id) => (id === 'you' ? ctx.me.realName : ctx.nameOf(id));
const rcWhen = (at) => (window.circWhen ? window.circWhen(at) : null);

// Reactions are keyed by roster NAME, words by member id. This is the one place
// the two halves of an utterance are joined.
const rcIdOfName = (ctx, name) => {
  const m = (ctx.members || []).find((x) => x.name === name);
  return m ? m.id : null;
};
const rcReactionOf = (ctx, item, id) => {
  const m = ctx.memberById(id);
  if (!m) return null;
  return ((item && item.reactions) || []).find((r) => r && r.name === m.name && r.glyph) || null;
};
const rcSkipped = (ctx, item, id) => {
  const m = ctx.memberById(id);
  if (!m) return false;
  return ((item && item.reactions) || []).some((r) => r && r.name === m.name && !r.glyph);
};

// ---- The record ---------------------------------------------------------------
// Every line anybody has left on this item, in arrival order. The sharer's own
// attached thought is the first of them — it is a line a member left, and the
// record holds all of them. An item nobody has written on has no entries, which
// is a legitimate state, not an empty box.
const rcEntries = (item) => {
  const out = [];
  if (item && item.thought && item.thought.text) {
    out.push({ key: 'thought', by: item.thought.by, text: item.thought.text, at: item.thought.at || item.at });
  }
  ((item && item.responses) || []).forEach((r) => {
    out.push({ key: r.id, by: r.by, text: r.text, at: r.at });
  });
  return out.sort((a, b) => (a.at || 0) - (b.at || 0));
};

// The second register: members who reacted (or read and skipped) and left no
// words. They stay as chips, never as rows.
const rcRoster = (ctx, item) => {
  const spoke = {};
  rcEntries(item).forEach((e) => { spoke[e.by] = true; });
  const out = [];
  ((item && item.reactions) || []).forEach((r) => {
    const id = rcIdOfName(ctx, r.name);
    if (id && spoke[id]) return;
    // One chip per member: a reaction given after a skip replaces the ring.
    const at = out.findIndex((x) => x.name === r.name);
    if (at < 0) out.push(r);
    else if (r.glyph) out[at] = r;
  });
  return out;
};

// ---- Replies: one level, and no more -----------------------------------------
const rcRepliesOf = (ctx, item, key) => (((ctx.state.replies || {})[item.id] || {})[key] || []);
const rcReply = (ctx, item, key, text) => {
  const t = String(text || '').trim();
  if (!t) return;
  const forItem = (ctx.state.replies || {})[item.id] || {};
  ctx.setState((s) => ({
    replies: {
      ...(s.replies || {}),
      [item.id]: { ...forItem, [key]: [...(forItem[key] || []), { by: 'you', text: t, at: Date.now() }] },
    },
  }));
};

// ============================================================================
// Type. Deliberately the plainest in the rig: body prose, one mono meta line,
// no invented vocabulary and no decoration.
// ============================================================================
const RC_META = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
  lineHeight: 1.5, color: 'var(--color-fg-3)',
};
const RC_LINE = {
  fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: 14.5,
  lineHeight: 1.55, color: 'var(--color-fg-1)', textWrap: 'pretty', margin: 0,
};
const RC_FIELD = {
  width: '100%', boxSizing: 'border-box',
  fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: 16,
  lineHeight: 1.5, color: 'var(--color-fg-1)',
  padding: '11px 13px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
  resize: 'vertical',
};

// What a member gave on the pad, said the way the product says it: the glyph,
// then the rung it landed on, in words. Never a number.
const RcRung = ({ rx, skipped }) => {
  if (rx && rx.glyph) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>{rx.glyph}</span>
        <span>{rcRung(rx)}</span>
      </span>
    );
  }
  if (skipped) return <span>read</span>;
  return null;
};

// ============================================================================
// One entry — a member's line, carrying the depth they gave beside their name,
// its replies beneath it, and the single control that adds one.
// ============================================================================
const RcEntry = ({ ctx, item, entry, replyOpen, onReply, onReplyDone }) => {
  const [text, setText] = rcS('');
  const ref = rcR(null);
  rcE(() => {
    // GOTCHA #1 — a focus inside a sheet that mounts off-screen must not scroll.
    if (replyOpen && ref.current) ref.current.focus({ preventScroll: true });
  }, [replyOpen]);

  const rx = rcReactionOf(ctx, item, entry.by);
  const skipped = rcSkipped(ctx, item, entry.by);
  const mine = entry.by === 'you';
  const replies = rcRepliesOf(ctx, item, entry.key);
  const when = rcWhen(entry.at);

  return (
    <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar name={rcFace(ctx, entry.by)} size={28} accent={mine} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ ...RC_META, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 13, letterSpacing: 0, color: mine ? 'var(--color-accent)' : 'var(--color-fg-1)' }}>
            {rcWho(ctx, entry.by)}
          </span>
          <RcRung rx={rx} skipped={skipped} />
          {when && <span style={{ opacity: 0.8 }}>{when}</span>}
        </div>
        <p style={RC_LINE}>{entry.text}</p>

        {replies.length > 0 && (
          <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: '0 0 0 12px', borderLeft: '1px solid var(--color-border-2)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {replies.map((r, i) => {
              const rrx = rcReactionOf(ctx, item, r.by);
              const rmine = r.by === 'you';
              return (
                <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ ...RC_META, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 12.5, letterSpacing: 0, color: rmine ? 'var(--color-accent)' : 'var(--color-fg-1)' }}>
                      {rcWho(ctx, r.by)}
                    </span>
                    <RcRung rx={rrx} skipped={rcSkipped(ctx, item, r.by)} />
                    {rcWhen(r.at) && <span style={{ opacity: 0.8 }}>{rcWhen(r.at)}</span>}
                  </div>
                  <p style={{ ...RC_LINE, fontSize: 13.5 }}>{r.text}</p>
                </li>
              );
            })}
          </ul>
        )}

        {replyOpen ? (
          <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea ref={ref} rows={2} value={text} placeholder={'Answer ' + rcWho(ctx, entry.by) + '.'}
              onChange={(e) => setText(e.target.value.replace(/\s*\n+\s*/g, ' '))}
              style={{ ...RC_FIELD, fontSize: 15, minHeight: 62 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Button variant="secondary" size="sm" onClick={() => { setText(''); onReplyDone(); }}>Leave it</Button>
              <Button variant="primary" size="sm" disabled={!text.trim()}
                onClick={() => { rcReply(ctx, item, entry.key, text); setText(''); onReplyDone(); }}>Answer</Button>
            </div>
          </div>
        ) : (
          <button type="button" className="rc7-reply" onClick={onReply} style={{
            ...RC_META, appearance: 'none', background: 'transparent', border: 0,
            padding: '6px 0', margin: 0, textAlign: 'left', cursor: 'pointer',
            alignSelf: 'flex-start', minHeight: 32,
          }}>Answer</button>
        )}
      </div>
    </li>
  );
};

// ============================================================================
// The second register — members who only reacted. The shipped roster chip,
// copied once from SwellReview in app/swell-reactions.jsx (which does not
// export it): glyph, or the read-ring for a skip, then the name. Same weight as
// any other member; only the mark differs.
// ============================================================================
const RcReadRing = ({ me }) => (
  <svg viewBox="0 0 24 24" width={15} height={15} aria-hidden="true"
    style={{ stroke: me ? 'var(--color-accent)' : 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none' }}>
    <circle cx="12" cy="12" r="8" />
  </svg>
);

const RcRoster = ({ ctx, list }) => {
  if (!list.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingTop: 2 }}>
      {list.map((r, i) => {
        const label = r.name || 'Former member';
        const me = r.name === 'You';
        return (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 12px 6px 10px', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 14,
            whiteSpace: 'nowrap', color: me ? 'var(--color-accent)' : 'var(--color-fg-1)',
          }} aria-label={r.glyph ? (label + ', ' + rcRung(r)) : (label + ', read, no reaction')}>
            {r.glyph
              ? <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>{r.glyph}</span>
              : <span aria-hidden="true" style={{ display: 'inline-flex', width: 15, justifyContent: 'center' }}><RcReadRing me={me} /></span>}
            {label}
          </span>
        );
      })}
    </div>
  );
};

// ============================================================================
// Your line — the composer, at the top, in the same sheet the reaction just
// committed in. The glyph you gave sits beside it in its rung word, so you can
// see what you are attaching your line to. Skipped the pad? It is offered back
// here, which is the one place you would want it.
// ============================================================================
const RcComposer = ({ ctx, item, focus, close }) => {
  const [text, setText] = rcS('');
  const ref = rcR(null);
  rcE(() => {
    // GOTCHA #1 — the sheet mounts at translateY(100%); focus must not scroll.
    if (focus && ref.current) ref.current.focus({ preventScroll: true });
  }, [focus]);

  const rx = rcReactionOf(ctx, item, 'you');
  const skipped = !rx && rcSkipped(ctx, item, 'you');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 32 }}>
        <Avatar name={ctx.me.realName} size={28} accent />
        {rx ? (
          <span style={{ ...RC_META, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>{rx.glyph}</span>
            <span>{rcRung(rx)}</span>
          </span>
        ) : skipped ? (
          <Button variant="secondary" size="sm"
            onClick={() => { ctx.openSwell(item); ctx.setTab('read'); close(); }}>Add a reaction</Button>
        ) : null}
      </div>
      <textarea ref={ref} rows={2} value={text} placeholder="Leave a line."
        onChange={(e) => setText(e.target.value.replace(/\s*\n+\s*/g, ' '))}
        style={{ ...RC_FIELD, minHeight: 74 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" disabled={!text.trim()}
          onClick={() => { ctx.actions.respond(item.id, { text: text.trim(), register: 'gist' }); setText(''); }}>
          Attach
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// The record itself — the door, and the moment after the Swell, are the SAME
// component. That identity is the direction: there is nowhere else to go.
// ============================================================================
const RcRecord = ({ ctx, item, close, landing = false }) => {
  const pinned = ctx.state.replyOn && ctx.state.replyOn.item === item.id ? ctx.state.replyOn.key : null;
  const [replyOn, setReplyOn] = rcS(pinned);
  // The sheet is not remounted when the driver moves the record from one item
  // to another, so the pinned answer has to be followed, not just read once.
  rcE(() => { setReplyOn(pinned); }, [pinned, item.id]);
  const entries = rcEntries(item);
  const roster = rcRoster(ctx, item);
  const clearPin = () => { setReplyOn(null); if (pinned) ctx.setState({ replyOn: null }); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ paddingRight: 34, minWidth: 0 }}>
        <div style={{ ...RC_META, marginBottom: 4 }}>{item.source || window.pgd7Host(item.url)}</div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3,
          letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty',
        }}>{item.title || item.url.replace(/^https?:\/\//, '')}</div>
      </div>

      <RcComposer ctx={ctx} item={item} focus={landing} close={close} />

      {(entries.length > 0 || roster.length > 0) && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
          borderTop: '1px solid var(--color-border-2)', paddingTop: 'var(--space-4)',
        }}>
          {entries.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {entries.map((e) => (
                <RcEntry key={e.key} ctx={ctx} item={item} entry={e}
                  replyOpen={replyOn === e.key}
                  onReply={() => setReplyOn(e.key)}
                  onReplyDone={clearPin} />
              ))}
            </ul>
          )}
          <RcRoster ctx={ctx} list={roster} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="tertiary" onClick={close}>Done</Button>
      </div>
    </div>
  );
};

// The two surfaces are one component; only the landing focuses the composer,
// because only there did the reader just finish an act.
const RcLanding = (props) => <RcRecord {...props} landing />;
const RcRespond = (props) => <RcRecord {...props} />;

// ============================================================================
// Beat 1 — attach. The plainest thing in the rig: one line, prose, no register
// picker, no guidance, no character policing. Skipping is a real state.
// ============================================================================
const RcCompose = ({ draft, setDraft, submit }) => {
  const text = draft.text;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <textarea rows={2} value={text} placeholder="Leave a line."
        onChange={(e) => setDraft({ ...draft, text: e.target.value.replace(/\s*\n+\s*/g, ' '), register: 'gist' })}
        style={{ ...RC_FIELD, minHeight: 74 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
        <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
        <Button variant="primary" disabled={!text.trim()}
          onClick={() => submit({ text: text.trim(), register: 'gist' })}>Attach</Button>
      </div>
    </div>
  );
};

// ---- Seeded replies ---------------------------------------------------------
// The circle has already answered a couple of lines directly, so the one level
// the record allows is visible the first time it is opened. Keyed by the entry
// they answer, which is a response id in the seed.
const RC_SEED_REPLIES = {
  r1: { r1r2: [{ by: 'marcus', text: 'Same, and both times in my own code.', at: Date.now() - 4 * 24 * 3600e3 }] },
  r4: { r4r1: [{ by: 'dev', text: 'Mine is the second paragraph, for the same reason.', at: Date.now() - 9 * 24 * 3600e3 }] },
};

// ---- The states inline styles cannot carry ---------------------------------
const RC_CSS = `
.rc7-reply:hover { color: var(--color-fg-1); }
.rc7-reply:focus-visible { outline: var(--ring-width) solid var(--color-accent); outline-offset: var(--ring-offset); border-radius: var(--radius-sm); }
`;
if (typeof document !== 'undefined' && !document.getElementById('rc7-css')) {
  const rcStyleEl = document.createElement('style');
  rcStyleEl.id = 'rc7-css';
  rcStyleEl.textContent = RC_CSS;
  document.head.appendChild(rcStyleEl);
}

PGD7.register({
  id: 'record',
  name: 'The Record',
  // No card face. The shipped FeedCard, untouched, on both tabs — the door is
  // the whole affordance.
  face: { slot: 'none' },
  initialState: { replies: RC_SEED_REPLIES, replyOn: null },
  Compose: RcCompose,
  Landing: RcLanding,
  Respond: RcRespond,
  // The door on a Read card opens the record. The door keeps its own geometry,
  // glyph huddle and hit target; only what it opens onto changes.
  doorOpens: 'respond',
  beats: {
    // Land on an item whose record already has BOTH registers in it — members
    // who spoke, and a member who only reacted — so the shape is on screen the
    // moment the Swell hands over.
    land: (api) => {
      const two = (i) => {
        const spoke = {};
        rcEntries(i).forEach((e) => { spoke[e.by] = true; });
        const chips = (i.reactions || []).filter((r) => { const id = rcIdOfName(api, r.name); return !id || !spoke[id]; });
        return rcEntries(i).length > 1 && chips.length > 0;
      };
      const t = api.activeItems.find(two) || api.activeItems.find((i) => rcEntries(i).length) || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // The door, on a read item whose record carries both registers: three lines
    // with their depths, and one member who read it and left no words.
    respond: (api) => {
      const t = api.itemById('r2')
        || api.readItems.find((i) => rcEntries(i).length > 1) || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
    // Continuation is the reply, one level deep. Open the record with the most
    // in it, with the answer field already open under one of its lines.
    continue: (api) => {
      const t = api.readItems.slice().sort((a, b) => rcEntries(b).length - rcEntries(a).length)[0] || api.firstRead();
      if (!t) return;
      const es = rcEntries(t);
      api.setState({ replyOn: es.length ? { item: t.id, key: es[es.length - 1].key } : null });
      api.setTab('read');
      api.openRespond(t);
    },
  },
});
