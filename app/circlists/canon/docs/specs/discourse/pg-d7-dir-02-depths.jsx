// ============================================================================
// Discourse v7 — direction 02, The Depths.
// ----------------------------------------------------------------------------
// The Reaction door grown into a room whose geography is the Swell. You enter
// at the depth you gave, and you speak among the people who felt as you did.
// Three strata in the shipped rung vocabulary; the sharer has no rung, so their
// thought is the room's lintel, above all three. Move your Swell and your words
// travel with it — the depth of a line is never stored, it is READ OFF the
// author's current reaction, so the travel is the data model, not an animation.
//
// The card face is nothing. All text lives past the door.
// ============================================================================

const { PGD7, Button, Avatar, SwellDoor } = window;
const { useState: dpS, useEffect: dpE, useRef: dpR } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS and
// levelFromIntensity internal. PLAYGROUND.md allows the copy; this is the
// pointer to its source. Verbatim — never "improved", or it stops being
// evidence of what the product actually says.
const DP_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const dpLevelOf = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };

// ---- Reading the room off the Swell -----------------------------------------
// A member's LAST reaction wins: re-dragging the puck appends a fresh one, and
// the newest is where they now stand.
const dpReactions = (item) => {
  const out = []; const seen = {};
  ((item && item.reactions) || []).forEach((r) => {
    const k = (r && r.name) || '~';
    if (seen[k] == null) { seen[k] = out.length; out.push(r); } else out[seen[k]] = r;
  });
  return out;
};

// member id -> their live reaction, for everyone who reacted with a glyph.
// A skip carries no glyph, so it carries no address: a skipper is in the roster
// and not in the room.
const dpStanding = (ctx, item) => {
  const map = {};
  dpReactions(item).forEach((r) => {
    if (!r || !r.glyph) return;
    const m = ctx.members.find((x) => x.name === r.name);
    if (m) map[m.id] = r;
  });
  return map;
};

const dpMyLine = (item) => {
  const mine = (item.responses || []).filter((r) => r.by === 'you');
  return mine.length ? mine[mine.length - 1] : null;
};

const dpText = (ctx, r) => {
  const over = (ctx.state.revised || {})[r.id];
  return over != null ? over : r.text;
};

// A Read item where you already stand in the room and have already spoken —
// the settled state the later beats want. `r1` is the seeded one; the search
// keeps it working after the reviewer has played with the feed.
const dpSettled = (api) => {
  const seeded = api.itemById('r1');
  if (seeded && seeded.read && dpStanding(api, seeded).you && dpMyLine(seeded)) return seeded;
  return api.readItems.find((i) => dpStanding(api, i).you && dpMyLine(i)) || null;
};

// The scroller a surface actually sits in — the sheet panel, or the page.
const dpScroller = (el) => {
  let n = el && el.parentNode;
  while (n && n.nodeType === 1) {
    const oy = getComputedStyle(n).overflowY;
    if (oy === 'auto' || oy === 'scroll') return n;
    n = n.parentNode;
  }
  return null;
};

const DP_TEXTAREA = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
  fontSize: 16, lineHeight: 1.5, color: 'var(--color-fg-1)',
  padding: '10px 12px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
  resize: 'vertical', minHeight: 68,
};

const DP_LINE_BODY = {
  fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.55,
  color: 'var(--color-fg-1)', textWrap: 'pretty',
};

const DP_RUNG_LABEL = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
};

// ============================================================================
// The lintel — the sharer's thought, sticky above all three strata. It is in
// view from every depth, so it is bounded: a long thought sits clamped and
// opens on ask. Bounding it here is structural — an unbounded sticky head eats
// the room it is supposed to sit above.
// ============================================================================
const DpLintel = ({ ctx, item }) => {
  const bodyRef = dpR(null);
  const [open, setOpen] = dpS(false);
  const [over, setOver] = dpS(false);
  const thought = item.thought;

  dpE(() => {
    const el = bodyRef.current;
    if (!el) { setOver(false); return; }
    setOver(el.scrollHeight - el.clientHeight > 2);
  }, [item.id, thought && thought.text]);

  if (!thought) return null;                       // nothing attached — a bare room
  const sharer = thought.by;
  const clamp = open ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 10 }}>
      <Avatar name={sharer === 'you' ? ctx.me.realName : ctx.nameOf(sharer)} size={26} accent={sharer === 'you'} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div ref={bodyRef} style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15.5, lineHeight: 1.45,
          letterSpacing: '-0.005em', color: 'var(--color-fg-1)', textWrap: 'pretty', ...clamp,
        }}>{thought.text}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)' }}>
            {ctx.nameOf(sharer)}
          </span>
          {(over || open) && (
            <Button variant="tertiary" size="sm" onClick={() => setOpen((v) => !v)}>{open ? 'Less' : 'More'}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// The rungs, drawn as geography. Used by the compose surface (nothing marked
// yet) and by the continuation page (your own rung marked, carrying your
// glyph). One motif, two placements.
// ============================================================================
const DpRungs = ({ marked, glyph }) => (
  <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
    {DP_DEPTH_WORDS.map((w, i) => {
      const on = marked === i + 1;
      return (
        <div key={w} style={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 12px 11px 14px', minHeight: 42,
          borderTop: i === 0 ? 0 : '1px solid var(--color-border-2)',
          background: on ? 'var(--color-surface-sunken)' : 'transparent',
        }}>
          {on && <span style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, borderRadius: 3, background: 'var(--color-accent)' }} />}
          <span style={{ ...DP_RUNG_LABEL, color: on ? 'var(--color-accent)' : 'var(--color-fg-3)', fontWeight: on ? 600 : 400 }}>{w}</span>
          <span style={{ flex: 1 }} />
          {on && glyph && <span style={{ fontSize: 16, lineHeight: 1 }}>{glyph}</span>}
        </div>
      );
    })}
  </div>
);

// ============================================================================
// A line in a stratum. Yours is revisable, in place — continuation here is
// revision in public, never a turn appended under the last one.
// ============================================================================
const DpLine = ({ ctx, r }) => {
  const [editing, setEditing] = dpS(false);
  const [draft, setDraft] = dpS('');
  const mine = r.by === 'you';
  const body = dpText(ctx, r);

  if (editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} style={DP_TEXTAREA} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => {
            const t = draft.trim();
            if (t) ctx.setState((s) => ({ revised: { ...(s.revised || {}), [r.id]: t } }));
            setEditing(false);
          }}>Save</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
        color: mine ? 'var(--color-accent)' : 'var(--color-fg-3)',
      }}>{ctx.nameOf(r.by)}</div>
      <div style={DP_LINE_BODY}>{body}</div>
      {mine && (
        <div style={{ marginTop: 2 }}>
          <Button variant="tertiary" size="sm" onClick={() => { setDraft(body); setEditing(true); }}>Revise</Button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// One stratum. The rung word, everyone standing on it, and what they said from
// there. Your own stratum carries the accent rule and the place to speak.
// ============================================================================
const DpStratum = ({ ctx, item, level, standing, lines, mine, bandRef, draft, setDraft, onSay }) => {
  const here = Object.keys(standing).filter((id) => dpLevelOf(standing[id].intensity) === level);
  const said = lines.filter((r) => {
    const s = standing[r.by];
    return s && dpLevelOf(s.intensity) === level;
  });
  const iSpoke = said.some((r) => r.by === 'you');

  return (
    <section ref={bandRef} style={{
      position: 'relative', paddingLeft: 14, paddingRight: 2,
      paddingTop: 12, paddingBottom: 14,
      borderTop: '1px solid var(--color-border-2)',
    }}>
      {mine && <span style={{ position: 'absolute', left: 0, top: 12, bottom: 14, width: 3, borderRadius: 3, background: 'var(--color-accent)' }} />}

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 14px' }}>
        <span style={{ ...DP_RUNG_LABEL, color: mine ? 'var(--color-accent)' : 'var(--color-fg-3)', fontWeight: mine ? 600 : 400 }}>
          {DP_DEPTH_WORDS[level - 1]}
        </span>
        {here.map((id) => {
          const r = standing[id];
          const me = id === 'you';
          return (
            <span key={id} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, minWidth: 0,
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
              color: me ? 'var(--color-accent)' : 'var(--color-fg-1)',
            }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{r.glyph}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ctx.nameOf(id)}</span>
            </span>
          );
        })}
      </div>

      {said.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
          {said.map((r) => <DpLine key={r.id} ctx={ctx} r={r} />)}
        </div>
      )}

      {mine && !iSpoke && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <textarea rows={2} value={draft} placeholder="Say what you make of it."
            onChange={(e) => setDraft(e.target.value)} style={DP_TEXTAREA} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="sm" onClick={onSay}>Say it</Button>
          </div>
        </div>
      )}
    </section>
  );
};

// ============================================================================
// The room. Beat 2 (entered at commit, in the reveal's place) and beat 3
// (re-entered from a Read card) are the same room — one body, never forked.
// The lintel is sticky, so the sharer's thought is in view from every stratum.
// ============================================================================
const DpRoom = ({ ctx, item, close }) => {
  const [draft, setDraft] = dpS('');
  const mineRef = dpR(null);
  const headRef = dpR(null);

  const standing = dpStanding(ctx, item);
  const my = standing.you || null;
  const myLevel = my ? dpLevelOf(my.intensity) : null;
  const lines = item.responses || [];

  // Enter at your own depth. Deep-linking to a rung is the whole navigation
  // model, so the room opens where you stand rather than at its top. The sheet
  // panel is the scroller; nothing is focused, so nothing heaves (GOTCHA #1).
  dpE(() => {
    const el = mineRef.current;
    if (!el) return;
    const sc = dpScroller(el);
    if (!sc) return;
    const t = setTimeout(() => {
      const head = headRef.current ? headRef.current.offsetHeight : 0;
      sc.scrollTop = Math.max(0, el.offsetTop - head - 8);
    }, 90);
    return () => clearTimeout(t);
  }, [item.id, myLevel]);

  const say = () => {
    const t = draft.trim();
    if (!t) return;
    ctx.actions.respond(item.id, { text: t, register: 'reflection' });
    setDraft('');
  };

  // Changing your Swell is a full-screen flow that sits UNDER this sheet, so
  // the sheet leaves first and the flow opens behind it.
  const changeSwell = () => { close(); setTimeout(() => ctx.openSwell(item), 260); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div ref={headRef} style={{
        position: 'sticky', top: 0, zIndex: 2, background: 'var(--color-surface)',
        paddingBottom: 12, marginRight: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5,
            color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{item.source || item.title || item.url}</div>
          <span style={{ flexShrink: 0, marginRight: -10 }}><SwellDoor item={item} /></span>
        </div>

        <DpLintel ctx={ctx} item={item} />

        {!myLevel && (
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" size="sm" onClick={changeSwell}>Give a reaction</Button>
          </div>
        )}
      </div>

      <div>
        {[1, 2, 3].map((L) => (
          <DpStratum key={L} ctx={ctx} item={item} level={L} standing={standing} lines={lines}
            mine={myLevel === L} bandRef={myLevel === L ? mineRef : null}
            draft={draft} setDraft={setDraft} onSay={say} />
        ))}
      </div>

      {myLevel && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 14, borderTop: '1px solid var(--color-border-2)' }}>
          <Button variant="tertiary" size="sm" onClick={changeSwell}>Change how it landed</Button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. The sharer never reacted, so they have no rung: what they
// write is the lintel, and it sits above all three strata rather than in one.
// ============================================================================
const DpCompose = ({ draft, setDraft, submit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <textarea rows={3} value={draft.text} placeholder="Say what you're sharing."
        onChange={(e) => setDraft({ ...draft, text: e.target.value })}
        style={{ ...DP_TEXTAREA, fontWeight: 500 }} />
      <DpRungs marked={null} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
      <Button variant="primary" onClick={() => submit({ text: draft.text.trim(), register: 'gist' })}>Attach</Button>
    </div>
  </div>
);

// ============================================================================
// Beat 4 — continuation, which here is the contribution act performed again:
// your one line at your one depth, revisable forever, and the puck that decides
// where it lives. Change how it landed and the words go with it.
// ============================================================================
const DpDepth = ({ ctx }) => {
  const [draft, setDraft] = dpS('');
  const target = ctx.itemById(ctx.state.focus || '')
    || ctx.readItems.find((i) => dpStanding(ctx, i).you)
    || ctx.readItems[0] || ctx.activeItems[0];
  if (!target) return null;

  const standing = dpStanding(ctx, target);
  const my = standing.you || null;
  const myLevel = my ? dpLevelOf(my.intensity) : null;
  const line = dpMyLine(target);
  const placed = line && my;

  return (
    <div style={{
      maxWidth: 'var(--max-feed-width)', margin: '0 auto',
      padding: ctx.isMobile ? '18px 16px 32px' : '28px 24px 40px',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)' }}>
          {target.source || ctx.circle.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, lineHeight: 1.3,
          letterSpacing: '-0.01em', color: 'var(--color-fg-1)', marginTop: 4, textWrap: 'pretty',
        }}>{target.title || target.url.replace(/^https?:\/\//, '')}</div>
      </div>

      <div style={{ maxWidth: 460 }}>
        <DpRungs marked={myLevel} glyph={my && my.glyph} />
      </div>

      {placed ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DpLine ctx={ctx} r={line} />
        </div>
      ) : myLevel ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea rows={3} value={draft} placeholder="Say what you make of it."
            onChange={(e) => setDraft(e.target.value)} style={DP_TEXTAREA} />
          <div>
            <Button variant="primary" onClick={() => {
              const t = draft.trim();
              if (!t) return;
              ctx.actions.respond(target.id, { text: t, register: 'reflection' });
              setDraft('');
            }}>Say it</Button>
          </div>
        </div>
      ) : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 4 }}>
        <Button variant="secondary" onClick={() => ctx.openSwell(target)}>
          {myLevel ? 'Change how it landed' : 'Give a reaction'}
        </Button>
        <Button variant="ghost" onClick={() => ctx.openRespond(target)}>Open the room</Button>
      </div>
    </div>
  );
};

PGD7.register({
  id: 'depths',
  name: 'The Depths',
  // The card face is nothing: no slot, no Card, so the rig mounts the shipped
  // FeedCard untouched. Everything this direction has to say is past the door.
  initialState: { revised: {}, focus: null },
  Compose: DpCompose,
  Landing: DpRoom,
  Respond: DpRoom,
  Continue: DpDepth,
  continueTitle: 'Your depth',
  beats: {
    // Land on the item whose room is inhabited at all three depths, and where
    // your own line is already written but addressless — you skipped the Swell.
    // Giving a reaction is what puts it somewhere.
    land: (api) => {
      const t = api.itemById('a4') || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A Read card where you already stand somewhere and have already spoken:
    // the room re-entered, your line in it, revisable where it stands. A
    // different item from the one `land` opens, so the two beats are two states.
    respond: (api) => {
      const t = dpSettled(api) || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
    continue: (api) => {
      const t = dpSettled(api) || api.firstRead();
      api.setState({ focus: t ? t.id : null });
      api.openContinue();
    },
  },
});
