// ============================================================================
// Discourse v9 — states 1 and 2.
//   1  The door opens a room   one affordance holds reactions AND the talk
//   2  The card has a page     the record is a place, not an overlay
// ============================================================================
const { D9Write: W, D9Thread: TH, D9Composer: CO, D9Sheet: SH, D9Watch: WT, D9WatchRing: WR,
        D9ThoughtHead: HEAD, D9ThoughtMargin: TMargin, D9ThoughtSaid: TSaid, D9ToArticle: ART,
        D9JoinIn: JOIN, d9Watching: watching, d9HasNew: hasNew, d9Talking: talking, d9Order: order } = window;

// ---- the door, with room for one mark --------------------------------------
// Source: SwellDoor (app/swell-reactions.jsx) — the glyph huddle and the corner
// arrows, verbatim, so a state can hang its own mark inside the same control
// rather than adding a second button to the action row.
const d9Huddle = (all) => {
  const seen = [];
  for (const r of (all || [])) { if (r.glyph && !seen.includes(r.glyph)) seen.push(r.glyph); if (seen.length === 3) break; }
  return seen;
};
const D9Arrows = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true"
    style={{ stroke: 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }}>
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);
// The talk mark: an empty outline when the circle has spoken, solid ink when
// some of it is new to you. A shape that fills, not a dot that appears — the app
// already spends its dot on arrival and on the rail.
const D9Bubble = ({ filled }) => (
  <svg viewBox="0 0 24 24" width={15} height={15} aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.9 8.9 0 0 1-3.9-.9L3 21l1.9-5.1A8.9 8.9 0 0 1 4 12a8.38 8.38 0 0 1 8.5-8.5A8.38 8.38 0 0 1 21 11.5z"
      style={{ fill: filled ? 'var(--color-fg-1)' : 'none', stroke: filled ? 'var(--color-fg-1)' : 'var(--color-fg-3)', strokeWidth: 1.7, strokeLinejoin: 'round' }} />
  </svg>
);
// The door NEVER returns null on a Read card. A card nobody has reacted to and
// nobody has spoken on still needs a way in — that is where you go to say the
// first thing — so with nothing to show it falls back to the bare corner arrows.
const D9Door = ({ item, onOpen, mark, label }) => {
  const all = item.reactions || [];
  const glyphs = d9Huddle(all);
  return (
    <button type="button" onClick={() => onOpen(item)} className="circ-swell-door"
      aria-label={label || 'How the circle landed, and what it said'} aria-haspopup="dialog"
      style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', borderWidth: 0,
        background: 'transparent', padding: 0, minHeight: 44, flexShrink: 0 }}>
      {glyphs.length > 0 && (
        <span style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: 8 }}>
          {glyphs.map((g, i) => (
            <span key={i} style={{ fontSize: 16, lineHeight: 1, width: 17, height: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: i === 0 ? 0 : -4 }}>{g}</span>
          ))}
        </span>
      )}
      <span style={{ height: 44, paddingLeft: glyphs.length > 0 ? 6 : 15.5, paddingRight: 15.5, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        {mark || <D9Arrows />}
      </span>
    </button>
  );
};

// ---- how it landed, as a strip that can open ------------------------------
// Reactions kept whole inside a record that is mostly words: the huddle and the
// roster read at a glance, and the disc is one tap away for anyone who wants it.
const D9Landed = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  const all = item.reactions || [];
  const reacted = all.filter(r => r.glyph);
  const quiet = all.length - reacted.length;
  const [sel, setSel] = React.useState(null);
  if (!all.length) return null;
  const size = Math.min(260, (typeof window !== 'undefined' ? window.innerWidth : 400) - 110);
  return (
    <div>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="circ-d9-row"
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, padding: '0 8px', marginLeft: -8,
          background: 'transparent', borderWidth: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          {d9Huddle(all).map((g, i) => <span key={i} style={{ fontSize: 16, lineHeight: 1, marginLeft: i ? -4 : 0 }}>{g}</span>)}
        </span>
        <span style={{ flex: 1, minWidth: 0, font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-fg-2)' }}>
          {reacted.length} reacted{quiet ? ', ' + quiet + ' read it quietly' : ''}
        </span>
        <span style={{ display: 'inline-flex', color: 'var(--color-fg-3)', transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform var(--duration-base) var(--ease-quiet)' }}><window.Icon name="chevron-down" size={15} /></span>
      </button>
      {open && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <window.SwellScatter all={reacted} size={size} selected={sel} onSelect={setSel} interactive />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 1 — THE DOOR OPENS A ROOM
// The card keeps exactly one way in, and it is the one that already exists. The
// door's glyph huddle says how it landed; a bubble beside it fills with ink when
// there is talk you have not read. Behind it: reactions folded to a strip, and
// the conversation given the room.
// ============================================================================
const D9_ROOM = {
  id: 'room',
  name: 'The door opens a room',
  stance: 'One affordance for everything. The reaction door widens into a room: how it landed folded into a strip at the top, the conversation given the space, answers anchored under what they answer.',
  ret: 'a strip above the shelf on Read names who spoke. It opens into a list of the cards, with the words in it, and walks you card to card without leaving Read.',
  cost: 'One control now carries two records, so the panel is the busiest of the five and the door\u2019s meaning is learned rather than obvious. Reactions lose their own front door.',
  addTitle: 'Add a link',
  addSub: 'Say what made you add it, and see how it will read.',
  add: (p) => <window.D9AddPreview {...p} />,
  onCard: (item, ctx, tab) => <TMargin item={item} />,
  cardActions: ({ item, ctx }) => (
    <D9Door item={item} onOpen={ctx.openRecord}
      mark={talking(item)
        ? <React.Fragment><D9Bubble filled={hasNew(item)} /><D9Arrows /></React.Fragment>
        : null} />
  ),
  flowSub: 'A reaction, words, both or neither. Nothing here is required.',
  write: ({ swell, text, setText, item }) => (
    <div style={{ width: '100%', marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 9 }}>
      <span style={{ width: 24, height: 42, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {swell.glyph
          ? <span style={{ fontSize: 18, lineHeight: 1 }}>{swell.glyph}</span>
          : <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-border-1)' }} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <W value={text} onChange={setText} lines={2} max={200}
          placeholder={item.thought ? 'Answer ' + (item.thought.by === 'You' ? 'your own note' : item.thought.by) + ', or say your own thing' : 'Say something to the circle'} />
      </div>
    </div>
  ),
  reveal: ({ item, mine, ctx }) => (
    <React.Fragment>
      <window.SwellReview all={[...(item.reactions || []).filter(r => r.name !== 'You'), ...(mine ? [mine] : [])]}
        interactive={false} firstHere={(item.reactions || []).filter(r => r.name !== 'You').length === 0} />
      <JOIN item={item} ctx={ctx} />
    </React.Fragment>
  ),
  record: ({ item, ctx, onClose }) => <D9RoomRecord item={item} ctx={ctx} onClose={onClose} />,
  returnFeedTop: (p) => <window.D9Strip {...p} />,
};

const D9RoomRecord = ({ item, ctx, onClose }) => {
  const [replyTo, setReplyTo] = React.useState(null);
  return (
    <SH title="What the circle said" onClose={onClose} wide
      head={<ART item={item} compact />}
      foot={<CO item={item} ctx={ctx} lines={2} max={220} replyTo={replyTo} onCancelReply={() => setReplyTo(null)}
        placeholder={item.thought ? 'Answer ' + (item.thought.by === 'You' ? 'your own note' : item.thought.by) + ', or say your own thing' : 'Say something to the circle'} />}>
      <HEAD item={item} />
      <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', margin: '16px 0 6px' }} />
      <D9Landed item={item} />
      <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', margin: '6px 0 18px' }} />
      <TH item={item} showGlyph showDepth collapse onReply={setReplyTo} gap={20} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', marginTop: 20, paddingTop: 6 }}>
        <WT item={item} onToggle={ctx.toggleWatch} />
      </div>
    </SH>
  );
};

// ============================================================================
// 2 — THE CARD HAS A PAGE
// A record that grows has nowhere to grow inside an overlay: on a phone the
// fortieth line is off the bottom of the screen and the sheet has to be
// scrolled inside a scroll. So the card gets a page of its own — the article at
// the top, how it landed, the conversation, and the composer at the foot with
// room to breathe. Marking read is untouched: that is still the modal.
// ============================================================================
const D9_PAGE = {
  id: 'page',
  name: 'The card has a page',
  stance: 'The record is a place, not an overlay. Tap the card\u2019s own row and the card opens as a page: the link, how it landed, the whole conversation, and room to answer. The reaction stays a modal.',
  ret: 'one line above the shelf, about people \u2014 who answered you, and who spoke. It opens the list; each row opens that card\u2019s page, and the page itself offers the next card that moved, so catching up never sends you back to the feed.',
  cost: 'Two ways to see one card, and a page is a step away from the shelf \u2014 the feed stops being the whole product. The attribution row becoming a button is a learned move.',
  addTitle: 'Add a link',
  addSub: 'Attach a thought and it goes on the card, signed.',
  add: (p) => <window.D9AddByline {...p} />,
  onCard: (item) => <TSaid item={item} />,
  attribOpens: true,
  cardCorner: ({ item, tab }) => (tab === 'read' && hasNew(item)) ? (
    <span aria-hidden="true" title="new since you looked" style={{ position: 'absolute', left: 0, top: 16, bottom: 16, width: 3,
      borderRadius: '0 3px 3px 0', background: 'var(--color-sage)' }} />
  ) : null,
  flowSub: 'A reaction, words, both or neither. Whatever you leave lands on the card\u2019s page.',
  write: ({ text, setText, item }) => (
    <div style={{ width: '100%', marginTop: 14 }}>
      <W value={text} onChange={setText} lines={3} max={260} frame="sunken"
        placeholder={item.thought ? 'Answer ' + (item.thought.by === 'You' ? 'yourself' : item.thought.by) + ', or say your own thing' : 'Say something to the circle'} />
    </div>
  ),
  reveal: ({ item, mine, onOpenRecord }) => (
    <React.Fragment>
      <window.SwellReview all={[...(item.reactions || []).filter(r => r.name !== 'You'), ...(mine ? [mine] : [])]}
        interactive={false} firstHere={(item.reactions || []).filter(r => r.name !== 'You').length === 0} />
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px', font: '400 13.5px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
          {(item.talk || []).filter(t => t.by !== 'You').length
            ? 'The circle has been talking about this one.'
            : 'Nobody has spoken here yet. You would be the first.'}
        </p>
        <window.Button variant="primary" onClick={() => onOpenRecord && onOpenRecord(item)}>Open the card&rsquo;s page</window.Button>
      </div>
    </React.Fragment>
  ),
  record: null,          // the record is a page, not an overlay
  opensPage: true,
  returnAbove: (p) => <window.D9Answered {...p} />,
};

Object.assign(window, { D9_ROOM, D9_PAGE, D9Door, D9Arrows, D9Bubble, D9Landed, d9Huddle });
