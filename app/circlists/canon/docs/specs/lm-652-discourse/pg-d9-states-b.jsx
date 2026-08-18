// ============================================================================
// Discourse v9 — states 3, 4 and 5.
//   3  Talk in the feed         no overlay at all; the card carries its own talk
//   4  Talk rides the Swell     the disc indexes a conversation you can also read
//   5  The thought is the spine what a member said leads; the link cites it
// ============================================================================
const { D9Write: BW, D9Thread: BTH, D9Composer: BCO, D9Sheet: BSH, D9Watch: BWT,
        D9ThoughtHead: BHEAD, D9ThoughtHand: THand, D9ThoughtPlate: TPlate, D9ThoughtSpine: TSpine,
        D9ToArticle: BART, D9JoinIn: BJOIN, D9Door: BDOOR, D9Arrows: BARROWS, D9Landed: BLANDED,
        d9Watching: bWatching, d9HasNew: bNew, d9Talking: bTalking, d9TalkAge: bAge, d9Order: bOrder } = window;

// ============================================================================
// 3 — TALK IN THE FEED
// Nothing to open. On Read, a card the circle has spoken on carries the tail of
// the conversation inside its own border, and answering happens there. Cards
// that have moved rise above a hairline, so position is the whole indication.
// ============================================================================
const D9InlineTalk = ({ item, ctx }) => {
  const [open, setOpen] = React.useState(false);
  const [replyTo, setReplyTo] = React.useState(null);
  if (!item.read) return null;
  const has = (item.talk || []).length > 0;
  return (
    <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)',
      margin: '12px calc(var(--space-5) * -1) 0', padding: (has ? 14 : 4) + 'px var(--space-5) 0',
      display: 'flex', flexDirection: 'column', gap: 14 }}>
      {has && <BTH item={item} showGlyph={false} collapse tail={2} gap={16} onReply={(e) => { setReplyTo(e); setOpen(true); }} />}
      {open
        ? <BCO item={item} ctx={ctx} lines={2} max={220} autoFocus replyTo={replyTo}
            onCancelReply={() => { setReplyTo(null); setOpen(false); }} />
        : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: -8 }}>
            <button type="button" onClick={() => setOpen(true)} className="circ-d9-answer" style={{
              background: 'transparent', borderWidth: 0, padding: '8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              minHeight: 44, font: '500 13px/1 var(--font-sans)', color: 'var(--color-accent)' }}>
              {has ? 'Answer the circle' : 'Say the first thing'}
            </button>
            <span aria-hidden="true" style={{ flex: 1 }} />
            <BART item={item} compact />
          </div>
        )}
    </div>
  );
};

// The fold. A card you are watching is turned down at the corner, the way a page
// you mean to come back to is — and tapping the fold is how you turn it down or
// flatten it out again. It says nothing about volume, so it never nags.
const D9Fold = ({ item, ctx }) => {
  const on = bWatching(item);
  return (
    <button type="button" onClick={() => ctx.toggleWatch(item)} aria-pressed={on} className="circ-d9-fold"
      title={on ? 'Turned down \u2014 you are watching this card. Tap to flatten it.' : 'Turn this card down to watch it'}
      style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, padding: 0, borderWidth: 0,
        background: 'transparent', cursor: 'pointer', zIndex: 2, lineHeight: 0 }}>
      {/* The fold, as one path: the outer corner takes the card's own 11px inner
          radius so it sits flush in the corner instead of over it. */}
      <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, display: 'block' }}>
        <path d="M0 0 H13 A11 11 0 0 1 24 11 V24 Z" style={{ fill: on ? 'var(--color-sage)' : 'var(--color-border-2)' }} />
      </svg>
    </button>
  );
};

const D9_FEED = {
  id: 'feed',
  name: 'Talk in the feed',
  stance: 'No overlay anywhere. On Read the card carries the tail of its own conversation inside its border, and you answer in place. Cards the circle is still talking about rise above a hairline.',
  ret: 'position, and nothing else. The moved cards are already at the top of Read with the new words showing on them, so there is no signal to notice and nothing to open.',
  cost: 'Read gets loud: the shelf stops being a shelf of links and becomes a wall of talk, one chatty card can sit at the top for days, and if you never open Read nothing ever reaches you.',
  countBareReactions: false,
  addTitle: 'Add a link',
  addSub: 'Paste the link into what you are writing.',
  add: (p) => <window.D9AddCanvas {...p} />,
  addQuietUrl: true,
  onCard: (item) => <THand item={item} />,
  cardCorner: ({ item, tab, ctx }) => tab === 'read' ? <D9Fold item={item} ctx={ctx} /> : null,
  cardBelow: ({ item, tab, ctx }) => tab === 'read' ? <D9InlineTalk item={item} ctx={ctx} /> : null,
  flowSub: 'A reaction, words, both or neither. Your words go straight onto the card.',
  write: ({ text, setText, item }) => (
    <div style={{ width: '100%', marginTop: 14 }}>
      <BW value={text} onChange={setText} lines={3} max={240} rule
        placeholder={item.thought ? 'Answer ' + (item.thought.by === 'You' ? 'yourself' : item.thought.by) + ', or say your own thing' : 'Say something to the circle'} />
    </div>
  ),
  reveal: ({ item, mine, ctx }) => (
    <React.Fragment>
      <window.SwellReview all={[...(item.reactions || []).filter(r => r.name !== 'You'), ...(mine ? [mine] : [])]}
        interactive={false} firstHere={(item.reactions || []).filter(r => r.name !== 'You').length === 0} />
      <BJOIN item={item} ctx={ctx} showGlyph={false} prompt="on the card now" />
    </React.Fragment>
  ),
  record: null,
  // Watched cards with talk come first, newest talk at the top; the rest keep the
  // shelf's own order. `divideRead` draws the one hairline between the two.
  sortRead: (items) => {
    const live = [], rest = [];
    items.forEach(i => (bWatching(i) && (i.talk || []).length ? live : rest).push(i));
    live.sort((a, b) => b.talk[b.talk.length - 1].at - a.talk[a.talk.length - 1].at);
    return [...live, ...rest];
  },
  divideRead: true,
  returnFeedTop: (p) => <window.D9Rise {...p} />,
};

// ============================================================================
// 4 — TALK RIDES THE SWELL
// The disc holds the whole circle in one shape that does not grow, and it is the
// most Circlists thing in the product. v8's version made it the ONLY way to read
// anybody, so forty voices was forty taps. Here the conversation is written out
// underneath in full, and the disc is an index over it: touch a face and their
// lines come forward while the rest stay legible.
// ============================================================================
const D9SageRing = () => (
  <span aria-hidden="true" title="new since you looked" style={{ width: 11, height: 11, borderRadius: '50%',
    borderWidth: 2, borderStyle: 'solid', borderColor: 'var(--color-sage)', flexShrink: 0 }} />
);

const D9_SWELL = {
  id: 'swell',
  name: 'Talk rides the Swell',
  stance: 'The record keeps the disc. Reactions scatter as they always have; the conversation is written out beneath in full, and touching a face brings that person\u2019s lines forward without hiding anyone else.',
  ret: 'a pill parks under the tabs on Read. It does not jump you anywhere \u2014 it opens the list in place, with the words in it, and you choose. Cards drop out of the list as you visit them.',
  cost: 'Two ways to navigate the same words. The disc is beautiful and, once the thread is right underneath it, arguably redundant \u2014 and it costs the top third of the panel.',
  countBareReactions: true,
  addTitle: 'Add a link',
  addSub: 'Your thought sits on the card as its own leaf.',
  add: (p) => <window.D9AddPlate {...p} />,
  onCard: (item) => <TPlate item={item} />,
  cardActions: ({ item, ctx }) => (
    <BDOOR item={item} onOpen={ctx.openRecord}
      mark={bNew(item, true) ? <React.Fragment><D9SageRing /><BARROWS /></React.Fragment> : null} />
  ),
  flowSub: 'A reaction, words, both or neither. Whatever you leave rides your glyph.',
  write: ({ swell, text, setText }) => (
    <div style={{ width: '100%', marginTop: 14 }}>
      <BW value={text} onChange={setText} lines={2} max={200} frame="sunken"
        placeholder={swell.glyph ? 'Say why, if you want to' : 'Say something, or leave it'} />
    </div>
  ),
  reveal: ({ item, mine, ctx }) => (
    <React.Fragment>
      <window.SwellReview all={[...(item.reactions || []).filter(r => r.name !== 'You'), ...(mine ? [mine] : [])]}
        interactive={false} firstHere={(item.reactions || []).filter(r => r.name !== 'You').length === 0} />
      <BJOIN item={item} ctx={ctx} />
    </React.Fragment>
  ),
  record: ({ item, ctx, onClose }) => <D9SwellRecord item={item} ctx={ctx} onClose={onClose} />,
  returnFeedTop: (p) => <window.D9Pill {...p} />,
};

const D9SwellRecord = ({ item, ctx, onClose }) => {
  const all = (item.reactions || []).filter(r => r.glyph);
  const [sel, setSel] = React.useState(null);
  const [replyTo, setReplyTo] = React.useState(null);
  const size = Math.min(250, (typeof window !== 'undefined' ? window.innerWidth : 400) - 110);
  const selName = sel != null && all[sel] ? (all[sel].name || 'Former member') : null;
  const rows = bOrder(item.talk);
  return (
    <BSH title="How it landed" onClose={onClose} wide
      head={<BART item={item} compact />}
      foot={<BCO item={item} ctx={ctx} lines={2} max={200} frame="sunken" replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />}>
      <BHEAD item={item} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 16 }}>
        <window.SwellScatter all={all} size={size} selected={sel} onSelect={setSel} interactive />
        <p style={{ margin: 0, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textAlign: 'center' }}>
          {selName ? selName + '\u2019s lines are brought forward below.' : 'Touch a face to find that person in the conversation.'}
        </p>
      </div>
      <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', margin: '16px 0 18px' }} />
      {rows.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {rows.map(o => (
            <div key={o.e.id} style={{ opacity: !selName || o.e.by === selName ? 1 : 0.42, transition: 'opacity var(--duration-base) var(--ease-quiet)' }}>
              <window.D9Utterance entry={o.e} all={item.talk} depth={o.depth} showGlyph showDepth
                isNew={o.e.by !== 'You' && o.e.at > (item.seenAt || 0)} onReply={setReplyTo} />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>Nobody has spoken here yet. You would be the first.</p>
      )}
      <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', marginTop: 20, paddingTop: 6 }}>
        <BWT item={item} onToggle={ctx.toggleWatch} />
      </div>
    </BSH>
  );
};

// ============================================================================
// 5 — THE THOUGHT IS THE SPINE
// The most committed reading of what Circlists is: a circle passing each other
// links is a circle talking, so the words lead and the article is the citation.
// The record is the thought with its answers hanging off it, and return is about
// people rather than cards.
// ============================================================================
const D9_SPINE = {
  id: 'spine',
  name: 'The thought is the spine',
  stance: 'What a member said leads the card; the article steps back to a citation under it. The record is that thought with its answers hanging off it, and the way in is the words themselves.',
  ret: 'faces above the shelf. Touching a person takes you to what they said, on the card where they said it \u2014 the card is a consequence of the person, not the other way round.',
  cost: 'The link is demoted, so scanning Read for something to open is harder, and a bare link with no thought looks impoverished beside its neighbours. Names above the shelf grow with the circle.',
  addTitle: 'Hand it to the circle',
  addSub: 'Your words lead. The link follows.',
  add: (p) => <window.D9AddSpine {...p} />,
  addSubmit: 'Hand it over',
  addQuietUrl: true,
  cardHead: ({ item, ctx, tab, sourceRow, titleEl, title, openLinkProps }) => item.thought ? (
    <React.Fragment>
      {sourceRow}
      <TSpine item={item} onOpen={item.read ? () => ctx.openRecord(item) : null} />
      <a {...openLinkProps} className="circ-cardtitle" style={{ alignSelf: 'flex-start', marginTop: 2,
        font: '500 13px/1.45 var(--font-sans)', color: 'var(--color-fg-2)', textDecoration: 'none', textWrap: 'pretty' }}>
        {title || item.url.replace(/^https?:\/\//, '')}
      </a>
    </React.Fragment>
  ) : (
    <React.Fragment>{sourceRow}{titleEl}</React.Fragment>
  ),
  // The card's own time line says the age of the talk instead of the age of the
  // link, and goes to full weight while there is something you have not read.
  cardMeta: (item) => {
    if (!item.read || !(item.talk || []).length) return null;
    const fresh = bNew(item);
    return (
      <span style={{ fontWeight: fresh ? 700 : 500, color: fresh ? 'var(--color-fg-1)' : 'var(--color-fg-3)' }}>
        talking &middot; {bAge(item)}
      </span>
    );
  },
  flowSub: 'A reaction, words, both or neither. Your words join the conversation.',
  write: ({ text, setText, item }) => (
    <div style={{ width: '100%', marginTop: 14 }}>
      <BW value={text} onChange={setText} lines={3} max={240} frame="box" size={15}
        placeholder={item.thought ? 'Answer ' + (item.thought.by === 'You' ? 'your own words' : item.thought.by) : 'Say something to the circle'} />
    </div>
  ),
  reveal: ({ item, mine, ctx }) => (
    <React.Fragment>
      <window.SwellReview all={[...(item.reactions || []).filter(r => r.name !== 'You'), ...(mine ? [mine] : [])]}
        interactive={false} firstHere={(item.reactions || []).filter(r => r.name !== 'You').length === 0} />
      <BJOIN item={item} ctx={ctx} prompt="in the conversation" />
    </React.Fragment>
  ),
  record: ({ item, ctx, onClose, focusId }) => <D9SpineRecord item={item} ctx={ctx} onClose={onClose} focusId={focusId} />,
  returnAbove: (p) => <window.D9People {...p} />,
};

const D9SpineRecord = ({ item, ctx, onClose, focusId }) => {
  const [replyTo, setReplyTo] = React.useState(null);
  const who = item.thought ? (item.thought.by === 'You' ? 'your own words' : item.thought.by) : null;
  return (
    <BSH title={item.thought ? (item.thought.by === 'You' ? 'Your thought' : item.thought.by + '\u2019s thought') : 'What the circle said'}
      onClose={onClose} wide head={<BART item={item} compact />}
      foot={<BCO item={item} ctx={ctx} lines={3} max={240} replyTo={replyTo} onCancelReply={() => setReplyTo(null)}
        placeholder={who ? 'Answer ' + who : 'Say something to the circle'} cta="Say it" />}>
      {item.thought
        ? <BHEAD item={item} size={17} />
        : <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>A bare link, with no thought attached.</p>}
      <div style={{ marginTop: 18, paddingTop: 4 }}>
        <window.D9Eyebrow>answers</window.D9Eyebrow>
      </div>
      <div style={{ marginTop: 14 }}>
        <BTH item={item} avatars showGlyph collapse tail={4} onReply={setReplyTo} gap={22} />
      </div>
      <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', marginTop: 20, paddingTop: 6,
        display: 'flex', alignItems: 'center', gap: 10 }}>
        <BWT item={item} onToggle={ctx.toggleWatch} />
        <span aria-hidden="true" style={{ flex: 1 }} />
        <window.SwellDoor item={item} />
      </div>
    </BSH>
  );
};

Object.assign(window, { D9_FEED, D9_SWELL, D9_SPINE, D9InlineTalk, D9Fold, D9SageRing });
