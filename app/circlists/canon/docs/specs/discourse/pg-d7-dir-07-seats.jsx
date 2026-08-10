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
// does.
//
// THE ROUTE — ONE TAP TARGET, EVERYWHERE, FOREVER: THE SHARER'S OPENING LINE ON
// THE CARD. Seats adds no affordance to any surface in the app.
//   contribution  the sharer's line is the talk's first turn and takes seat one
//                 automatically. There is nothing to press.
//   reaction      untouched, and deliberately so. The Swell stays open to
//                 everyone: feeling is universal, words are seated. Putting
//                 seated talk behind the Swell door would make the app's most
//                 inclusive surface its most exclusive one, and invert the
//                 direction's own division. So the door keeps its shipped job
//                 exactly — the only direction in the set where that is a
//                 decision rather than an omission.
//   reading       the shipped reveal, then ONE line beneath the disc: take a
//                 seat, or, when none remain, read the talk. One control, two
//                 states, never both.
//   continuation  tapping the opening line opens THE ROOM — a full page sliding
//                 in from the right, the container the app already reserves for
//                 destinations you navigate into. Ordinary chronological talk,
//                 unlimited turns, unlimited length, a compose field at the
//                 foot. For a member with no seat the field is ABSENT, not
//                 disabled: a greyed field is a taunt, and this direction's cost
//                 is exclusion, honestly drawn.
// A full page and not a sheet because the content is genuinely unbounded — the
// claim is that four voices stay legible AT ANY LENGTH, and a sheet that
// scrolls forever is the anti-pattern the app posture already names. It is not
// a new location: it has no entry in any chrome, and the only way in is through
// the words themselves.
//
// GETTING BACK is the pin, and nothing else. When turns land in a room you
// hold, the pinned card carries the shipped micro dot — no count, no badge.
// Inside the room, the shipped Earlier waterline sits where you left. Both
// devices already exist; neither is invented for this.
//
// THE SEAT MARKS ARE NEVER INTERACTIVE. Four 4px marks rendering state and
// nothing else. The entry to the room is the WORDS, because the room is made of
// words. That is what keeps the marks off the wrong side of the no-counts line:
// a mark you can tap is a control that reports a quantity; a mark you cannot
// tap is a drawing of a room.
// ============================================================================

const { PGD7, Button, Avatar, FeedDivider, MicroDot } = window;
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

// The words are the door, so the words are what answers the pointer. The marks
// never do: they are a drawing, and a drawing that lights up is a control.
const ST_CSS = `
.st7-door { -webkit-tap-highlight-color: transparent; }
.st7-door:hover p, .st7-door:focus-visible p { text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--color-border-strong); }
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
// Reading — the one line beneath the disc. One control, two states, never both:
// a seat to take, or the talk to read. Taking one holds the card in Active and
// drops you straight into the room, because the seat and the words are the same
// act at two moments.
// ============================================================================
const stEnter = (ctx, item) => {
  ctx.setState({ room: item.id });
  ctx.closeOverlay();
  ctx.openContinue();
};

const St7Offer = ({ ctx, item, glyph }) => {
  const seated = stHolds(ctx, item, 'you');
  const free = stFree(ctx, item);
  const stOfferWrap = { display: 'flex', flexDirection: 'column', gap: 16 };
  const stOfferHead = { display: 'flex', alignItems: 'center', gap: 10, paddingRight: 34 };
  const stOfferTitle = {
    minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
    lineHeight: 1.35, color: 'var(--color-fg-2)', textWrap: 'pretty',
  };
  const stOfferLine = {
    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    borderTop: '1px solid var(--color-border-2)', paddingTop: 14,
  };
  const stOfferWord = {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4,
    color: 'var(--color-fg-2)',
  };
  const offering = !seated && free > 0;
  return (
    <div style={stOfferWrap}>
      <div style={stOfferHead}>
        {glyph ? <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{glyph}</span> : null}
        <span style={stOfferTitle}>{item.title || item.url.replace(/^https?:\/\//, '')}</span>
      </div>
      <div style={stOfferLine}>
        <St7Seating ctx={ctx} item={item} dot={5} />
        <span style={stOfferWord}>{seated ? 'Your seat is held.' : stLeftWord(free) + '.'}</span>
        <span style={{ flex: 1 }} />
        {offering
          ? <Button variant="primary" onClick={() => { stTake(ctx, item); stEnter(ctx, item); }}>Take a seat</Button>
          : <Button variant="secondary" onClick={() => stEnter(ctx, item)}>Read the talk</Button>}
      </div>
    </div>
  );
};

// ============================================================================
// The room — a full page, entered through the words and nothing else.
// ----------------------------------------------------------------------------
// Ordinary chronological talk at whatever length it was said, the shipped
// waterline where the last visit ended, and a compose field at the foot for a
// member who holds a seat. For a member with no seat the field is ABSENT: a
// greyed one is a taunt, and this direction's price is exclusion drawn
// honestly.
//
// The pin is enforced here, where it happens: a card you hold a seat on returns
// to Active the moment reading would have filed it away.
// ============================================================================
const St7Room = ({ ctx }) => {
  const id = ctx.state && ctx.state.room;
  const item = id ? ctx.itemById(id) : null;
  const pinned = stR(false);
  const mark = stR(null);
  const seated = item ? stHolds(ctx, item, 'you') : false;

  // The waterline is read once, on entry, and then held: it must not creep down
  // the page as the visit is recorded or as you speak.
  if (item && mark.current === null) mark.current = ((ctx.state && ctx.state.visited) || {})[item.id] || 0;

  stE(() => {
    if (!item) return;
    if (!pinned.current && seated && item.read) { pinned.current = true; ctx.actions.setUnread(item); }
  });
  // Being in the room IS the visit, so the mark on the pinned card goes as you
  // arrive. Recorded once, after the waterline has been taken.
  stE(() => {
    if (!id) return;
    ctx.setState((st) => ({ visited: { ...((st && st.visited) || {}), [id]: Date.now() } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!item) return null;
  const turns = stTurns(ctx, item);
  const line = mark.current;
  const cut = line ? turns.findIndex((t) => (t.at || 0) > line) : -1;

  const stRoomPage = {
    maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%', boxSizing: 'border-box',
    padding: ctx.isMobile ? '16px 16px 32px' : '28px 24px 44px',
    display: 'flex', flexDirection: 'column', gap: 20,
  };
  const stRoomHead = { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 };
  const stRoomSource = {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--color-fg-3)',
  };
  const stRoomTitle = {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, lineHeight: 1.3,
    letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty',
  };

  return (
    <div style={stRoomPage}>
      <header style={stRoomHead}>
        <span style={stRoomSource}>{item.source || window.pgd7Host(item.url)}</span>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={stRoomTitle}>
          {item.title || item.url.replace(/^https?:\/\//, '')}
        </a>
        <St7Seating ctx={ctx} item={item} dot={5} />
      </header>
      {turns.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {turns.map((t, i) => (
            <React.Fragment key={t.id}>
              {i === cut && cut > 0 && <FeedDivider />}
              <St7Turn ctx={ctx} turn={t} />
            </React.Fragment>
          ))}
        </div>
      )}
      {seated && (
        <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 16 }}>
          <St7Say ctx={ctx} item={item} />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// The card face — below the attribution: the opening turn, then the room drawn
// under it. A first-line indent and no quotation marks, so the line reads as
// the first turn of a talk rather than a caption hung under a link.
//
// THE LINE IS THE DOOR AND THE ONLY DOOR. Tapping it opens the room. The seat
// marks under it are a drawing and never a control — they render state, they
// answer no pointer, and they carry no tap target of their own.
//
// An item nobody has spoken on has no room to enter, so there is no line and
// nothing to tap — the marks alone, which is correct: the room exists before
// anyone is in it.
// ============================================================================
const StCard = ({ ctx, item }) => {
  const turns = stTurns(ctx, item);
  const opening = turns.length ? turns[0].text : null;
  const seated = stHolds(ctx, item, 'you');
  const seen = ((ctx.state && ctx.state.visited) || {})[item.id] || 0;
  // Turns landed in a room you hold since you were last in it. The shipped
  // micro dot, one mark, no count — the object is calling, not a number.
  const landed = seated && turns.some((t) => t.by !== 'you' && (t.at || 0) > seen);

  const stCardWrap = {
    marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 10,
  };
  const stCardDoor = {
    display: 'block', width: '100%', textAlign: 'left',
    background: 'transparent', border: 0, padding: '2px 0 0', margin: 0,
    cursor: 'pointer', borderRadius: 'var(--radius-sm)',
  };
  const stCardLine = {
    margin: 0, textIndent: '1.4em',
    fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5,
    color: 'var(--color-fg-1)', textWrap: 'pretty',
    display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  };
  const stCardMark = {
    display: 'flex', alignItems: 'center', gap: 7,
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--color-fg-3)',
  };

  return (
    <div style={stCardWrap}>
      {opening && (
        <button className="st7-door" style={stCardDoor}
          aria-label={'Open the talk. ' + stLeftWord(stFree(ctx, item)) + '.'}
          onClick={() => stEnter(ctx, item)}>
          <p style={stCardLine}>{opening}</p>
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <St7Seating ctx={ctx} item={item} />
        {landed && (
          <span style={stCardMark}>
            <span aria-hidden="true" style={{ display: 'inline-flex' }}><MicroDot size={8} /></span>
            Talk since you were in
          </span>
        )}
      </div>
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
  initialState: { seats: ST_SEED, since: {}, visited: {}, room: null },
  Card: StCard,
  Compose: StCompose,
  // Reading is the one line under the disc; continuation is the room behind the
  // words. Two surfaces, two jobs, and no Aside — the room belongs to an item,
  // not to the circle, so it is never a standing column.
  Landing: St7Offer,
  Respond: St7Offer,
  Continue: St7Room,
  continueTitle: 'The talk',
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
    // A Read item whose seats are gone: the other state of the same line —
    // read the talk, and nothing to do with it.
    respond: (api) => {
      const t = api.readItems.find((i) => !stHolds(api, i, 'you') && stFree(api, i) === 0)
        || api.readItems.find((i) => !stHolds(api, i, 'you'))
        || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
    // Continuation is the room: four voices, running for as long as they want,
    // the waterline where you left, and your turn whenever.
    continue: (api) => {
      const t = api.items.find((i) => stHolds(api, i, 'you') && stTurns(api, i).length > 2)
        || api.items.find((i) => stHolds(api, i, 'you'));
      if (!t) { api.setTab('active'); return; }
      stEnter(api, t);
    },
  },
});
