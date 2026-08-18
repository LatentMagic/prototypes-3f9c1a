// ============================================================================
// Discourse v8 — states 1–3.
//   1  Held in the disc      the record IS the Swell; words ride your glyph
//   2  The back of the card  two sides; the talk lives on the back
//   3  Talk lifts the card   nothing is marked; live cards rise up the Read tab
// ============================================================================
const { D8Write: W8, D8Talk: T8, D8Thought: TH8, D8Sheet: S8, D8Watch: WA8, D8Line: L8,
        d8Watching: watching8, d8HasNew: hasNew8, d8Order: order8 } = window;

// ---- the door glyph huddle, as the shipped card shows it -------------------
// Source: SwellDoor (app/swell-reactions.jsx) — the huddle only, so a state can
// hang its own mark beside it.
const d8Huddle = (all) => {
  const seen = [];
  for (const r of (all || [])) { if (r.glyph && !seen.includes(r.glyph)) seen.push(r.glyph); if (seen.length === 3) break; }
  return seen;
};
const D8Arrows = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true"
    style={{ stroke: 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }}>
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);
const D8Door = ({ item, onOpen, mark, label }) => {
  const all = item.reactions || [];
  if (!all.length && !(item.talk || []).length) return null;
  const glyphs = d8Huddle(all);
  return (
    <button type="button" onClick={() => onOpen(item)} className="circ-swell-door"
      aria-label={label || 'How the circle landed'} aria-haspopup="dialog"
      style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', border: 0,
        background: 'transparent', padding: 0, minHeight: 44, flexShrink: 0 }}>
      {glyphs.length > 0 && (
        <span style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: 8 }}>
          {glyphs.map((g, i) => (
            <span key={i} style={{ fontSize: 16, lineHeight: 1, width: 17, height: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: i === 0 ? 0 : -4 }}>{g}</span>
          ))}
        </span>
      )}
      <span style={{ height: 44, paddingLeft: glyphs.length > 0 ? 6 : 15.5, paddingRight: 15.5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <D8Arrows />
        {mark}
      </span>
    </button>
  );
};

// The thought as it sits on a card face, in three registers.
const D8OnCard = ({ item, size = 14, weight = 400, color = 'var(--color-fg-1)', top = 2 }) => item.thought ? (
  <p style={{ margin: top + 'px 0 0', font: weight + ' ' + size + 'px/1.5 var(--font-sans)', color, textWrap: 'pretty' }}>{item.thought.text}</p>
) : null;

// Speaking again, at the foot of a record: the same mechanism as speaking at the
// read, never a second one.
const D8Again = ({ item, ctx, lines = 2, max = 200, rule = false, replyTo, onCancelReply, placeholder }) => {
  const [text, setText] = React.useState('');
  const [target, setTarget] = React.useState(null);
  const to = replyTo || target;
  React.useEffect(() => { if (replyTo) setTarget(null); }, [replyTo]);
  const send = () => { const t = text.trim(); if (!t) return; ctx.say(item, t, to ? to.id : null); setText(''); onCancelReply && onCancelReply(); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {to && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>
          <span>Answering {to.by}</span>
          <button type="button" onClick={() => { setTarget(null); onCancelReply && onCancelReply(); }} className="circ-textlink"
            style={{ background: 'transparent', border: 0, padding: 4, margin: -4, cursor: 'pointer', font: '500 12.5px/1 var(--font-sans)', color: 'var(--color-fg-3)' }}>Cancel</button>
        </div>
      )}
      <W8 value={text} onChange={setText} lines={lines} max={max} rule={rule}
        placeholder={placeholder || 'Say something else'} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <window.Button variant="primary" size="sm" onClick={send} disabled={!text.trim()}>Leave it</window.Button>
      </div>
    </div>
  );
};

// ============================================================================
// 1 — HELD IN THE DISC
// The Swell already holds the whole circle in one shape that does not grow. Put
// the words inside it: your line rides your glyph, and the record is read by
// touching a face rather than by scrolling a list.
// ============================================================================
const D8_DISC = {
  id: 'disc',
  name: 'Held in the disc',
  stance: 'The record is the Swell. Your words ride the glyph you gave, and the circle is read by touching a face.',
  ret: 'a pill parks under the tabs on Read. Tap it and you travel to the next card that has moved; tap again for the one after.',
  cost: 'Reading everyone is one tap per person — nothing can be skimmed, and forty voices is forty taps. The pill chooses the order for you, and says nothing at all while you are on Active.',
  returnFeedTop: (p) => <window.D8DiscPill {...p} />,
  add: ({ urlField, thought, setThought }) => (
    <React.Fragment>
      {urlField}
      <W8 value={thought} onChange={setThought} lines={1} max={120} label="Your thought, if you have one"
        placeholder="One line, for the circle" />
    </React.Fragment>
  ),
  onCard: (item) => <D8OnCard item={item} size={14} color="var(--color-fg-1)" />,
  cardActions: ({ item, tab, ctx }) => tab === 'read'
    ? <D8Door item={item} onOpen={ctx.openRecord}
        mark={hasNew8(item) ? <span aria-hidden="true" style={{ display: 'inline-flex' }}><window.MicroDot size={9} /></span> : null} />
    : null,
  write: ({ swell, text, setText }) => (
    <div style={{ width: '100%', marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ width: 24, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {swell.glyph
          ? <span style={{ fontSize: 18, lineHeight: 1 }}>{swell.glyph}</span>
          : <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-border-1)' }} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <W8 value={text} onChange={setText} lines={1} max={120} placeholder="One line, if you have one" />
      </div>
    </div>
  ),
  record: ({ item, ctx, onClose }) => <D8DiscRecord item={item} ctx={ctx} onClose={onClose} />,
};

const D8DiscRecord = ({ item, ctx, onClose }) => {
  const all = item.reactions || [];
  const reacted = all.filter(r => r.glyph);
  const skipped = all.filter(r => !r.glyph);
  const [sel, setSel] = React.useState(null);
  const size = Math.min(280, (typeof window !== 'undefined' ? window.innerWidth : 400) - 96);
  const words = (name) => (item.talk || []).filter(t => t.by === name);
  const spoke = (name) => words(name).length > 0;
  const selName = sel != null && reacted[sel] ? (reacted[sel].name || 'Former member') : null;
  const chip = (r, i, isSkip) => {
    const name = r.name || 'Former member';
    const me = r.name === 'You', on = !isSkip && sel === i;
    return (
      <button key={(isSkip ? 's' : 'r') + i} type="button" className="circ-swell-rrow"
        onClick={() => setSel(isSkip ? null : (on ? null : i))}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px 6px 10px', borderRadius: 'var(--radius-md)',
          font: '600 14px/1.3 var(--font-sans)', whiteSpace: 'nowrap', border: 0, cursor: 'pointer',
          color: me ? 'var(--color-accent)' : 'var(--color-fg-1)',
          background: on ? 'var(--color-surface-sunken)' : 'transparent', opacity: (sel != null && !on) ? 0.45 : 1 }}>
        <span style={{ display: 'inline-flex', width: 17, justifyContent: 'center', fontSize: 16, lineHeight: 1 }}>
          {isSkip ? <window.ReadRing me={me} /> : r.glyph}
        </span>
        {name}
        {spoke(name) && <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-fg-3)' }} />}
      </button>
    );
  };
  return (
    <S8 title="How it landed" onClose={onClose}
      foot={<D8Again item={item} ctx={ctx} lines={1} max={120} placeholder="One line, if you have one" />}>
      <TH8 item={item} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <window.SwellScatter all={reacted} size={size} selected={sel} onSelect={setSel} interactive />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, width: '100%' }}>
          {reacted.map((r, i) => chip(r, i, false))}
          {skipped.map((r, i) => chip(r, i, true))}
        </div>
      </div>
      <div style={{ minHeight: 96, borderTop: '1px solid var(--color-border-2)', marginTop: 16, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {selName
          ? (words(selName).length
            ? words(selName).map(e => <L8 key={e.id} entry={e} all={item.talk} showGlyph={false} isNew={e.by !== 'You' && e.at > (item.seenAt || 0)} />)
            : <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>{selName} left no words.</p>)
          : <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>Touch a face to read what they said. A dot beside a name means there are words.</p>}
      </div>
      <div style={{ borderTop: '1px solid var(--color-border-2)', marginTop: 16 }}><WA8 item={item} onToggle={ctx.toggleWatch} /></div>
    </S8>
  );
};

// ============================================================================
// 2 — THE BACK OF THE CARD
// A card has two sides. The thought is written on the back as it is added, the
// circle answers on the back, and a folded corner says the back has changed.
// ============================================================================
const D8_BACK = {
  id: 'back',
  name: 'The back of the card',
  stance: 'The card has two sides. Everything said lives on the back, and a folded corner says the back has changed.',
  ret: 'the changed cards are held out of the pile at the head of Read, as a stack. Open it and Read shows only those until you put them back.',
  cost: 'A turn is a real gesture but an expensive one, and the back competes with the front for the same rectangle. Holding cards out is a second list to get out of, and it too says nothing while you are on Active.',
  returnFeedTop: (p) => <window.D8HeldOut {...p} />,
  heldFilter: true,
  addSubmit: 'Add',
  add: ({ urlField, thought, setThought }) => (
    <React.Fragment>
      {urlField}
      <div style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: 12 }}>
        <div style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)', marginBottom: 8 }}>the back</div>
        <W8 value={thought} onChange={setThought} lines={4} max={260} placeholder="Write your thought on the back, or leave it blank" />
      </div>
    </React.Fragment>
  ),
  onCard: (item, ctx) => item.thought ? (
    <button type="button" onClick={() => ctx.flip(item)} className="circ-textlink" style={{
      alignSelf: 'flex-start', background: 'transparent', border: 0, padding: '4px 0', marginTop: 2, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>
      <window.Icon name="arrow-right" size={13} color="var(--color-fg-3)" />
      {item.thought.by === 'You' ? 'Your note is on the back' : item.thought.by + '\u2019s note is on the back'}
    </button>
  ) : null,
  cardActions: ({ item, tab, ctx }) => tab === 'read' ? (
    <button type="button" onClick={() => ctx.flip(item)} className="circ-cardaction circ-cardaction-icon"
      aria-label="Turn the card over" title="Turn the card over">
      <window.Icon name="external-link" size={17} style={{ transform: 'rotate(90deg)' }} />
    </button>
  ) : null,
  cardWrap: ({ item, tab, ctx, face }) => <D8Flip item={item} tab={tab} ctx={ctx} face={face} />,
  write: ({ text, setText }) => (
    <div style={{ width: '100%', marginTop: 14, background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: 12 }}>
      <div style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)', marginBottom: 8 }}>the back</div>
      <W8 value={text} onChange={setText} lines={3} max={220} placeholder="Answer the note, or leave it" />
    </div>
  ),
  record: null,   // the record is the card's own back — there is no sheet
};

// The turn. One face is in the DOM at a time and they swap while the card is
// edge-on, so exactly one is ever painted and the box simply takes whichever
// side's own height — no measuring, and no back crushed into the front's box.
const D8_TURN = 420;
const D8Flip = ({ item, tab, ctx, face }) => {
  const flipped = ctx.flipped === item.id;
  const [showBack, setShowBack] = React.useState(flipped);
  React.useEffect(() => {
    if (flipped === showBack) return;
    const t = setTimeout(() => setShowBack(flipped), D8_TURN / 2);
    return () => clearTimeout(t);
  }, [flipped]);
  const newTalk = hasNew8(item);
  return (
    <div style={{ perspective: 1400 }}>
      <div style={{ position: 'relative', transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'none', transition: 'transform ' + D8_TURN + 'ms var(--ease-quiet)' }}>
        <div style={{ transform: showBack ? 'rotateY(180deg)' : 'none' }}>
          {showBack ? <D8Back item={item} ctx={ctx} /> : face}
        </div>
        {tab === 'read' && newTalk && !flipped && (
          <button type="button" onClick={() => ctx.flip(item)} aria-label="The back has changed. Turn the card over" title="The back has changed"
            style={{ position: 'absolute', top: 0, right: 0, width: 26, height: 26, padding: 0, border: 0, cursor: 'pointer', background: 'transparent' }}>
            <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0,
              borderTop: '22px solid var(--color-sage)', borderLeft: '22px solid transparent',
              borderTopRightRadius: 'var(--radius-lg)' }} />
          </button>
        )}
      </div>
    </div>
  );
};

const D8Back = ({ item, ctx }) => (
  <article style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
    display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ flex: 1, minWidth: 0, font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>the back</span>
      {item.read && <window.SwellDoor item={item} />}
      <button type="button" onClick={() => ctx.flip(null)} className="circ-cardaction circ-cardaction-icon"
        aria-label="Turn the card back" title="Turn the card back" style={{ marginRight: -8 }}>
        <window.Icon name="arrow-left" size={17} />
      </button>
    </div>
    <div style={{ maxHeight: 'min(46vh, 340px)', overflowY: 'auto', overscrollBehavior: 'contain', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4 }}>
      <TH8 item={item} size={14} />
      {item.read
        ? <T8 item={item} showGlyph gap={14} />
        : <p style={{ margin: 0, font: '400 13.5px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>What the circle said opens once you have read it yourself.</p>}
    </div>
    {item.read && (
      <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 12 }}>
        <D8Again item={item} ctx={ctx} lines={2} max={220} placeholder="Answer on the back" />
        <WA8 item={item} onToggle={ctx.toggleWatch} />
      </div>
    )}
  </article>
);

// ============================================================================
// 3 — TALK LIFTS THE CARD
// Nothing is marked at all. A card the circle is still talking about rises to
// the top of Read, washes once, and sinks again as the talk stops. Return is
// answered by position rather than by a signal.
// ============================================================================
const D8_LIFT = {
  id: 'lift',
  name: 'Talk lifts the card',
  stance: 'Nothing is marked. Cards you are part of rise to the top of Read while the circle is talking, and sink as it stops.',
  ret: 'the order is the whole answer — the moving cards are already at the top of Read, under one hairline. Nothing anywhere else.',
  cost: 'Read stops being a shelf: you lose where you left something, and one talkative card sits at the top for days. Nothing ever reaches you — if you do not open Read, you never find out.',
  countBareReactions: true,
  returnFeedTop: (p) => <window.D8Moving {...p} />,
  divideRead: true,
  addTitle: 'Add a link',
  add: ({ urlField, thought, setThought }) => (
    <React.Fragment>
      <W8 value={thought} onChange={setThought} lines={3} max={240} rule label="Say something, if you want to"
        placeholder="Your own words, whole" />
      <div style={{ height: 16 }} />
      {urlField}
    </React.Fragment>
  ),
  onCard: (item, ctx) => {
    if (!item.read) return <D8OnCard item={item} size={15} top={4} />;
    return (
      <button type="button" onClick={() => ctx.openRecord(item)} style={{
        alignSelf: 'stretch', textAlign: 'left', background: 'transparent', border: 0, padding: '4px 0', margin: '0 0 -2px',
        cursor: 'pointer', font: 'inherit' }} className="circ-d8-thoughtdoor">
        {item.thought
          ? <D8OnCard item={item} size={15} top={4} />
          : <span style={{ display: 'inline-block', marginTop: 4, font: '500 13.5px/1.4 var(--font-sans)', color: 'var(--color-fg-2)' }}>See what the circle said</span>}
      </button>
    );
  },
  // The way in is a real control in the action row, in the card's own action
  // geometry — the thought stays clickable as a second, larger target.
  cardActions: ({ item, tab, ctx }) => tab === 'read'
    ? <D8Door item={item} onOpen={ctx.openRecord} label="What the circle said" />
    : null,
  // Watched cards the circle is still talking about come first, newest talk at
  // the top; everything else keeps the shelf's own order.
  sortRead: (items) => {
    const live = [], rest = [];
    items.forEach(i => (watching8(i) && (i.talk || []).length ? live : rest).push(i));
    live.sort((a, b) => b.talk[b.talk.length - 1].at - a.talk[a.talk.length - 1].at);
    return [...live, ...rest];
  },
  write: ({ text, setText }) => (
    <div style={{ width: '100%', marginTop: 14 }}>
      <W8 value={text} onChange={setText} lines={3} max={240} rule placeholder="Your own words, whole — or none" />
    </div>
  ),
  record: ({ item, ctx, onClose }) => <D8LiftRecord item={item} ctx={ctx} onClose={onClose} />,
};

const D8LiftRecord = ({ item, ctx, onClose }) => {
  const [replyTo, setReplyTo] = React.useState(null);
  return (
    <S8 title="What the circle said" onClose={onClose} wide
      foot={<D8Again item={item} ctx={ctx} lines={3} max={240} rule replyTo={replyTo} onCancelReply={() => setReplyTo(null)}
        placeholder="Your own words, whole" />}>
      <TH8 item={item} />
      <div style={{ borderTop: '1px solid var(--color-border-2)', margin: '14px 0 16px' }} />
      <T8 item={item} showGlyph showDepth onReply={(e) => setReplyTo(e)} gap={20} />
      <div style={{ borderTop: '1px solid var(--color-border-2)', marginTop: 18, paddingTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, font: '500 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>How it landed</span>
          <window.SwellDoor item={item} />
        </div>
        <WA8 item={item} onToggle={ctx.toggleWatch} />
      </div>
    </S8>
  );
};

Object.assign(window, { D8_DISC, D8_BACK, D8_LIFT, D8Door, D8OnCard, D8Again, D8Arrows });
