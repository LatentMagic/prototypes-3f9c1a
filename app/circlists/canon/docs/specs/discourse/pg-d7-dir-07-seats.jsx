// ============================================================================
// Discourse v7 — direction 07, Seats.
// ----------------------------------------------------------------------------
// An item's conversation has four seats. The sharer holds seat one, so their
// thought is the talk's opening turn rather than a caption. Reading offers you
// one of the three that remain; take it and you are in for the item's life,
// with unlimited turns, unlimited length and no cadence. When the fourth is
// taken the talk closes to newcomers permanently: later readers meet the whole
// of it, readable, with no field.
//
// THE GATE IS THE ONLY RULE. Everything downstream of it is ordinary — the most
// conventional conversation in the set, made possible by the strictest bound.
// Nothing counts turns, nothing counts characters, nothing closes on a clock.
//
// THE PAIRING. The Swell is untouched and stays open to everyone: feeling is
// universal, words are seated. A member shut out of the seats is never shut out
// of the item, and the collective frame is carried entirely by the reaction
// layer nobody is excluded from.
//
// THE CARD FACE — an opening turn over a drawn room. The sharer's line sits
// below the attribution at body size with a first-line indent, so it reads as
// the first turn of a talk that has begun. Directly beneath it, on its own row,
// four 4px seat marks, filled or open; the one you hold carries a ring. This is
// the only card in the set that draws the room under the words, and the state
// of the conversation is legible from across the room before any text is read.
//
// THE PIN. A seated item is held in Active and does not leave while you hold
// the seat — so marking it read returns it to the top of the queue instead of
// filing it away. Taking a seat is the mark; keeping the card is what the mark
// does. There is no fourth destination and no separate column, which is why
// this direction registers no Continue page: continuation happens in the feed
// the reviewer is already looking at.
// ============================================================================

const { PGD7, Button, Avatar } = window;
const { useState: stS, useEffect: stE, useRef: stR } = React;

const ST_CAP = 4;

// ---- The seating ------------------------------------------------------------
// Seat one is the sharer's, always and automatically — an item nobody has been
// seeded onto (one the reviewer adds) starts as their seat alone.
const stSeats = (ctx, item) => {
  const map = (ctx.state && ctx.state.seats) || {};
  return map[item.id] || [item.by || 'you'];
};
const stHolds = (ctx, item, who) => stSeats(ctx, item).indexOf(who) >= 0;
const stFree = (ctx, item) => Math.max(0, ST_CAP - stSeats(ctx, item).length);

// Capacity remaining, in words. Never activity accrued: "two seats left" is an
// invitation, and there is no number anywhere for turns, length or time.
const ST_LEFT = ['The seats are full', 'One seat left', 'Two seats left', 'Three seats left', 'Four seats left'];
const stLeftWord = (n) => ST_LEFT[Math.max(0, Math.min(4, n))];

// Taking one is permanent. The item comes back to Active as it happens, because
// the seat holds it there.
const stTake = (ctx, item) => {
  ctx.setState((s) => {
    const map = (s && s.seats) || {};
    const base = map[item.id] || [item.by || 'you'];
    if (base.indexOf('you') >= 0 || base.length >= ST_CAP) return {};
    // The moment the seat was taken. Reading first and speaking later is
    // exactly what this direction forbids, so nothing of yours from before it
    // belongs in the talk.
    return {
      seats: { ...map, [item.id]: [...base, 'you'] },
      since: { ...((s && s.since) || {}), [item.id]: Date.now() },
    };
  });
  if (item.read) ctx.actions.setUnread(item);
};

// ---- The talk ---------------------------------------------------------------
// The sharer's thought is turn one. Everything after it is ordinary: whoever
// holds a seat, in the order they spoke. A member who never took a seat has no
// turns, so nothing off the seating ever appears here.
const stTurns = (ctx, item) => {
  const seats = stSeats(ctx, item);
  const since = ((ctx.state && ctx.state.since) || {})[item.id] || 0;
  const out = [];
  if (item.thought && item.thought.text) {
    out.push({
      id: item.id + '-open', by: item.thought.by || item.by,
      text: item.thought.text, at: item.thought.at || item.at, opening: true,
    });
  }
  (item.responses || []).forEach((r) => {
    if (seats.indexOf(r.by) < 0) return;
    if (r.by === 'you' && since && (r.at || 0) < since) return;
    out.push(r);
  });
  return out.sort((a, b) => (a.at || 0) - (b.at || 0));
};

const stWhen = (at) => (window.circWhen ? window.circWhen(at) : null);

// ============================================================================
// The room, drawn. Four marks: taken ones filled, open ones a hairline ring,
// yours ringed so you can see from the feed which talks you are in. Size and
// weight only — no colour carries state here.
// ============================================================================
const St7Seating = ({ ctx, item, dot = 4, gap = 7 }) => {
  const seats = stSeats(ctx, item);
  const free = stFree(ctx, item);
  const stSeatRow = { display: 'flex', alignItems: 'center', gap, height: dot + 6 };
  const cell = (i) => {
    const who = seats[i] || null;
    const mine = who === 'you';
    return {
      width: dot, height: dot, borderRadius: '50%', flexShrink: 0,
      background: who ? (mine ? 'var(--color-fg-1)' : 'var(--color-fg-2)') : 'transparent',
      border: who ? 'none' : '1px solid var(--color-border-1)',
      boxSizing: 'border-box',
      outline: mine ? '1px solid var(--color-fg-3)' : 'none',
      outlineOffset: 2,
    };
  };
  return (
    <div style={stSeatRow} role="img" aria-label={stLeftWord(free)}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={seats[i] ? 'st7-taken' : 'st7-open'} style={cell(i)} />
      ))}
    </div>
  );
};

// The room brightens under the pointer where it is a door. A rule inline styles
// cannot carry, and the only one this direction needs.
const ST_CSS = `
.st7-door { -webkit-tap-highlight-color: transparent; }
.st7-door:hover .st7-taken, .st7-door:focus-visible .st7-taken { background: var(--color-fg-1); }
.st7-door:hover .st7-open, .st7-door:focus-visible .st7-open { border-color: var(--color-fg-3); }
`;
if (typeof document !== 'undefined' && !document.getElementById('st7-css')) {
  const stStyleEl = document.createElement('style');
  stStyleEl.id = 'st7-css';
  stStyleEl.textContent = ST_CSS;
  document.head.appendChild(stStyleEl);
}

// ============================================================================
// One turn. Ordinary talk: a face, a name, and whatever they wanted to say, at
// whatever length they wanted to say it.
// ============================================================================
const St7Turn = ({ ctx, turn }) => {
  const yours = turn.by === 'you';
  const when = stWhen(turn.at);
  const stTurnWrap = { display: 'flex', gap: 10, alignItems: 'flex-start' };
  const stTurnBody = { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 };
  const stTurnHead = {
    display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0,
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, lineHeight: 1.3,
    color: 'var(--color-fg-2)', letterSpacing: '-0.005em',
  };
  const stTurnText = {
    margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15,
    lineHeight: 1.55, color: 'var(--color-fg-1)', textWrap: 'pretty',
  };
  return (
    <div style={stTurnWrap}>
      <Avatar name={yours ? ctx.me.realName : ctx.nameOf(turn.by)} size={26} accent={yours} />
      <div style={stTurnBody}>
        <div style={stTurnHead}>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {yours ? 'You' : ctx.nameOf(turn.by)}
          </span>
          {when && <span style={{ flexShrink: 0, fontWeight: 500, fontSize: 11, color: 'var(--color-fg-3)' }}>{when}</span>}
        </div>
        <p style={stTurnText}>{turn.text}</p>
      </div>
    </div>
  );
};

// ============================================================================
// Speaking. No length rule, no cadence, no counter — the gate did that work at
// the door, so the field itself is as plain as a field can be.
// ============================================================================
const St7Say = ({ ctx, item }) => {
  const [text, setText] = stS('');
  const stSayWrap = { display: 'flex', flexDirection: 'column', gap: 10 };
  const stSayField = {
    width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5,
    color: 'var(--color-fg-1)', background: 'var(--color-surface)',
    padding: '10px 12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-1)', resize: 'vertical',
  };
  return (
    <div style={stSayWrap}>
      <textarea rows={2} value={text} placeholder="Say something." style={stSayField}
        onChange={(e) => setText(e.target.value)} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" disabled={!text.trim()}
          onClick={() => { ctx.actions.respond(item.id, { text: text.trim(), register: 'gist' }); setText(''); }}>
          Speak
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// The door: what a reader meets under the reveal. Three states, one surface.
//   seated        the talk, and the field
//   a seat left   the talk, and the offer — taking it holds the card in Active
//   full          the talk, entire, and nothing to do with it
// ============================================================================
const St7Foot = ({ ctx, item }) => {
  const seated = stHolds(ctx, item, 'you');
  const free = stFree(ctx, item);
  const stFootWrap = {
    display: 'flex', flexDirection: 'column', gap: 12,
    borderTop: '1px solid var(--color-border-2)', paddingTop: 14,
  };
  const stFootRow = { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' };
  const stFootWord = {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4,
    color: 'var(--color-fg-2)',
  };

  if (seated) {
    return (
      <div style={stFootWrap}>
        <div style={stFootRow}>
          <St7Seating ctx={ctx} item={item} dot={5} />
          <span style={stFootWord}>Your seat is held.</span>
        </div>
        <St7Say ctx={ctx} item={item} />
      </div>
    );
  }
  if (free > 0) {
    return (
      <div style={stFootWrap}>
        <div style={stFootRow}>
          <St7Seating ctx={ctx} item={item} dot={5} />
          <span style={stFootWord}>{stLeftWord(free)}.</span>
          <span style={{ flex: 1 }} />
          <Button variant="primary" onClick={() => stTake(ctx, item)}>Take a seat</Button>
        </div>
      </div>
    );
  }
  return (
    <div style={stFootWrap}>
      <div style={stFootRow}>
        <St7Seating ctx={ctx} item={item} dot={5} />
        <span style={stFootWord}>The seats are full.</span>
      </div>
    </div>
  );
};

// ============================================================================
// The talk surface itself — used by both beats that open it. One body, never
// forked: the item, its turns in order, and whatever the seating leaves you.
//
// The pin is enforced here, where it happens: a card you hold a seat on returns
// to Active the moment reading would have filed it away.
// ============================================================================
const St7Talk = ({ ctx, item, glyph, close }) => {
  const pinned = stR(false);
  const seated = stHolds(ctx, item, 'you');
  stE(() => {
    if (pinned.current) return;
    if (seated && item.read) { pinned.current = true; ctx.actions.setUnread(item); }
  });

  const turns = stTurns(ctx, item);
  const stTalkWrap = { display: 'flex', flexDirection: 'column', gap: 16 };
  const stTalkHead = { display: 'flex', alignItems: 'center', gap: 10, paddingRight: 34 };
  const stTalkTitle = {
    minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
    lineHeight: 1.35, color: 'var(--color-fg-2)', textWrap: 'pretty',
  };
  const stTalkTurns = { display: 'flex', flexDirection: 'column', gap: 16 };

  return (
    <div style={stTalkWrap}>
      <div style={stTalkHead}>
        {glyph ? <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{glyph}</span> : null}
        <span style={stTalkTitle}>{item.title || item.url.replace(/^https?:\/\//, '')}</span>
      </div>
      {turns.length > 0 && (
        <div style={stTalkTurns}>
          {turns.map((t) => <St7Turn key={t.id} ctx={ctx} turn={t} />)}
        </div>
      )}
      <St7Foot ctx={ctx} item={item} />
    </div>
  );
};

// ============================================================================
// The card face — below the attribution: the opening turn, then the room.
// A first-line indent and no quotation marks, so the line reads as the first
// turn of a talk rather than a caption hung under a link. An item with nothing
// attached still draws its seating: the room exists before anyone speaks in it.
// ============================================================================
const StCard = ({ ctx, item, tab }) => {
  const opening = item.thought && item.thought.text ? item.thought.text : null;
  // The room is a door once you are in it, or once you have read the item —
  // the two states where the talk is yours to open. On an unread item the way
  // in is reading, which is the whole mechanic, so the marks stay marks.
  const openable = stHolds(ctx, item, 'you') || !!item.read;
  const stCardWrap = {
    marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 8,
  };
  const stCardDoor = {
    display: 'block', width: '100%', textAlign: 'left',
    background: 'transparent', border: 0, padding: '10px 0', margin: 0,
    cursor: 'pointer', borderRadius: 'var(--radius-sm)',
  };
  const stCardLine = {
    margin: 0, textIndent: '1.4em',
    fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5,
    color: 'var(--color-fg-1)', textWrap: 'pretty',
    display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  };
  return (
    <div style={stCardWrap}>
      {opening && <p style={stCardLine}>{opening}</p>}
      {openable ? (
        <button className="st7-door" style={stCardDoor}
          aria-label={'Open the talk. ' + stLeftWord(stFree(ctx, item)) + '.'}
          onClick={() => { ctx.openRespond(item); ctx.setTab(tab); }}>
          <St7Seating ctx={ctx} item={item} />
        </button>
      ) : <St7Seating ctx={ctx} item={item} />}
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. The sharer is seat one before they have written anything, so
// what they write is an opening turn and the room is drawn under it as they go.
// Skipping attaches nothing and still seats them.
// ============================================================================
const StCompose = ({ ctx, draft, setDraft, submit }) => {
  const stComposeField = {
    width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5,
    color: 'var(--color-fg-1)', background: 'var(--color-surface)',
    padding: 12, borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-1)', resize: 'vertical',
  };
  const stComposePreview = {
    border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
    background: 'var(--color-page)', padding: '12px 14px 14px',
    display: 'flex', flexDirection: 'column', gap: 8,
  };
  const stComposeLine = {
    margin: 0, textIndent: '1.4em',
    fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5,
    textWrap: 'pretty',
    color: draft.text.trim() ? 'var(--color-fg-1)' : 'var(--color-fg-3)',
  };
  const stComposeSeats = { display: 'flex', alignItems: 'center', gap: 7, height: 10 };
  const seatCell = (mine) => ({
    width: 4, height: 4, borderRadius: '50%', boxSizing: 'border-box',
    background: mine ? 'var(--color-fg-1)' : 'transparent',
    border: mine ? 'none' : '1px solid var(--color-border-1)',
    outline: mine ? '1px solid var(--color-fg-3)' : 'none', outlineOffset: 2,
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <textarea rows={3} value={draft.text} placeholder="Open the talk."
        onChange={(e) => setDraft({ ...draft, text: e.target.value })} style={stComposeField} />
      <div style={stComposePreview}>
        <p style={stComposeLine}>{draft.text.trim() || 'Your opening turn'}</p>
        <div style={stComposeSeats} role="img" aria-label="Three seats left">
          {[true, false, false, false].map((mine, i) => <span key={i} style={seatCell(mine)} />)}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
        <Button variant="primary" disabled={!draft.text.trim()}
          onClick={() => submit({ text: draft.text.trim(), register: 'gist' })}>Start the talk</Button>
      </div>
    </div>
  );
};

// ============================================================================
// The seating, seeded. Sharer first, then whoever spoke, capped at four — which
// is what makes the seed's own talks legible.
//   a2   three taken, one left, and no opening turn — a room with talk in it
//        and nothing at the top
//   a3 · a4 · a7   you hold a seat, so they are pinned to the top of Active
//   a4   full, four voices, the longest running talk in the circle
//   a5   one seat left, on an unread item — the offer, met at the reveal
//   a6   the sharer alone, untouched: the room drawn before anyone is in it
//   r1 · r4   full, and you are not in them — readable, closed
//   r2   a Read item with seats left — you may still take one, later
//   r3   nothing attached and nobody in it but the sharer
// ============================================================================
const ST_SEED = {
  a1: ['priya'],
  a2: ['marcus', 'ada', 'priya'],
  a3: ['you', 'marcus'],
  a4: ['ada', 'marcus', 'priya', 'you'],
  a5: ['dev', 'ada', 'marcus'],
  a6: ['marcus'],
  a7: ['priya', 'ada', 'you', 'dev'],
  r1: ['marcus', 'priya', 'ada', 'dev'],
  r2: ['priya', 'marcus'],
  r3: ['ada'],
  r4: ['dev', 'ada', 'priya'],
};

PGD7.register({
  id: 'seats',
  name: 'Seats',
  // The opening turn sits below the attribution, with the room drawn on its own
  // row beneath it. No rule, no quotation marks, no second attribution — the
  // sharer's name is already on the card and the indent does the rest.
  face: { slot: 'below-attribution' },
  initialState: { seats: ST_SEED, since: {} },
  Card: StCard,
  Compose: StCompose,
  Landing: St7Talk,
  Respond: St7Talk,
  // No Continue page and no Aside: the seat is the mark and Active is the
  // location, so continuation has nowhere else to be.
  order: (items, ctx) => {
    if (ctx.tab !== 'active') return items;
    const mine = (i) => stHolds(ctx, i, 'you');
    return [...items.filter(mine), ...items.filter((i) => !mine(i))];
  },
  beats: {
    // Land on an item with one seat left, so the reveal is followed by the
    // offer — and taking it closes the room to everyone else in front of you.
    land: (api) => {
      const t = api.activeItems.find((i) => !stHolds(api, i, 'you') && stFree(api, i) === 1)
        || api.activeItems.find((i) => !stHolds(api, i, 'you') && stFree(api, i) > 0)
        || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A Read item you passed on: a seat is still there, taking it lets you
    // speak, and the card comes back to the top of Active as you do.
    respond: (api) => {
      const t = api.readItems.find((i) => !stHolds(api, i, 'you') && stFree(api, i) > 0)
        || api.firstRead();
      if (!t) return;
      api.openRespond(t);
    },
    // Continuation is the pinned card in Active and the talk behind it: four
    // voices, running for as long as they want, and your turn whenever.
    continue: (api) => {
      const t = api.items.find((i) => stHolds(api, i, 'you') && stTurns(api, i).length > 2)
        || api.items.find((i) => stHolds(api, i, 'you'));
      if (!t) { api.setTab('active'); return; }
      api.openRespond(t);
      api.setTab(t.read ? 'read' : 'active');
    },
  },
});
