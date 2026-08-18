// ============================================================================
// Discourse v8 — states 4–5.
//   4  The line          words behind their own door; the depth you gave is the room you get
//   5  The card's page   every card has a page; adding writes on it, the record is it
// ============================================================================
const { D8Write: W9, D8Talk: T9, D8Thought: TH9, D8Sheet: S9, D8Watch: WA9, D8Again: AG9,
        D8OnCard: OC9, d8HasNew: hasNew9, d8Watching: watching9, d8TalkAge: talkAge9 } = window;

const D8Bubble = ({ size = 17, filled = false }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}
    fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.5 9.5 0 0 1-3.4-.6L3 21l1.7-4.8A8.3 8.3 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />
  </svg>
);

// ============================================================================
// 4 — THE LINE
// Reactions and words each keep their own door on the card, side by side. The
// writing room is set by the reaction just given: a little leaves a line, deeply
// leaves a paragraph. Nothing says so — the box simply opens as you pull.
// ============================================================================
const d8Room = (intensity) => (intensity == null ? 1 : window.levelFromIntensity(intensity) === 3 ? 4 : window.levelFromIntensity(intensity) === 2 ? 2 : 1);
const d8Max = (lines) => ({ 1: 110, 2: 240, 4: 520 })[lines] || 110;

const D8_LINE = {
  id: 'line',
  name: 'The line',
  stance: 'Words keep their own door beside the reactions door, and the room you get to write is the depth you just gave.',
  ret: 'a strip under the tabs speaks the newest line by name, on both tabs. Open it for everything said; a row goes straight into that card\u2019s record.',
  cost: 'Two doors on one card is a crowded foot, and room measured by depth reads as rationing what people may say. The strip is a notifications inbox in all but name — the loudest thing here, and the least like the product.',
  returnAbove: (p) => <window.D8Ticker {...p} />,
  add: ({ urlField, thought, setThought }) => <D8LineAdd urlField={urlField} thought={thought} setThought={setThought} />,
  onCard: (item) => <OC9 item={item} size={13.5} color="var(--color-fg-2)" top={3} />,
  cardActions: ({ item, tab, ctx }) => {
    if (tab !== 'read') return null;
    const talk = (item.talk || []).length;
    const fresh = hasNew9(item);
    return (
      <React.Fragment>
        <window.SwellDoor item={item} />
        {talk > 0 && (
          <button type="button" onClick={() => ctx.openRecord(item)} className="circ-cardaction circ-cardaction-icon"
            aria-label={fresh ? 'What the circle said — something new' : 'What the circle said'}
            title={fresh ? 'Something new' : 'What the circle said'}
            style={{ color: fresh ? 'var(--color-fg-1)' : 'var(--color-fg-2)' }}>
            <D8Bubble filled={fresh} />
          </button>
        )}
      </React.Fragment>
    );
  },
  write: ({ swell, text, setText }) => {
    const lines = d8Room(swell.intensity);
    return (
      <div style={{ width: '100%', marginTop: 14 }}>
        <W9 value={text} onChange={setText} lines={lines} max={d8Max(lines)}
          placeholder={lines > 1 ? 'Your words, for the circle' : 'A line, for the circle'} />
      </div>
    );
  },
  record: ({ item, ctx, onClose }) => <D8LineRecord item={item} ctx={ctx} onClose={onClose} />,
};

const D8LineAdd = ({ urlField, thought, setThought }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      {urlField}
      {open
        ? <W9 value={thought} onChange={setThought} lines={1} max={110} autoFocus placeholder="A line, for the circle" />
        : <button type="button" onClick={() => setOpen(true)} className="circ-textlink" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', border: 0,
            padding: '6px 0', margin: '-4px 0 0', minHeight: 32, cursor: 'pointer',
            font: '500 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>
            <window.Icon name="plus" size={14} color="var(--color-fg-3)" /> Attach a thought
          </button>}
    </React.Fragment>
  );
};

const D8LineRecord = ({ item, ctx, onClose }) => {
  const mine = (item.reactions || []).find(r => r.name === 'You');
  const lines = d8Room(mine && mine.intensity);
  return (
    <S9 title="What the circle said" onClose={onClose}
      foot={<AG9 item={item} ctx={ctx} lines={lines} max={d8Max(lines)} placeholder={lines > 1 ? 'Your words' : 'A line'} />}>
      <TH9 item={item} />
      <div style={{ borderTop: '1px solid var(--color-border-2)', margin: '14px 0 16px' }} />
      <T9 item={item} showGlyph showDepth gap={20} />
      <div style={{ borderTop: '1px solid var(--color-border-2)', marginTop: 18 }}>
        <WA9 item={item} onToggle={ctx.toggleWatch} />
      </div>
    </S9>
  );
};

// ============================================================================
// 5 — THE CARD'S PAGE
// Every card has a page of its own: the link at its head, the circle's talk
// beneath it, room to write at the foot. Adding writes the thought on it, the
// read hands you to it, and the attribution line is the way back in.
// ============================================================================
const D8_PAGE = {
  id: 'page',
  name: 'The card\u2019s page',
  stance: 'Every card has a page. Adding writes the thought on it, reading hands you to it, and the attribution line is the way back.',
  ret: 'a doorway at the head of both tabs opens a small screen of the pages still moving. Each one leaves as you visit it, and the screen empties itself away.',
  cost: 'A page is a destination: the calmest thing to read, and the furthest you can be taken from the feed you were in. The gathering is a second destination — the most structure of the five, held to nothing while nothing is moving.',
  returnAbove: (p) => <window.D8Doorway {...p} />,
  returnScreen: (p) => <window.D8StillTalking {...p} />,
  returnTitle: 'Still talking',
  countBareReactions: true,
  addSubmit: 'Add and open',
  addOpensPage: true,
  add: ({ urlField }) => (
    <React.Fragment>
      {urlField}
      <p style={{ margin: '-6px 0 0', font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-3)' }}>The card’s page opens next, to write your thought on.</p>
    </React.Fragment>
  ),
  onCard: (item) => item.thought ? (
    <p style={{ margin: '3px 0 0', font: '400 14px/1.5 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty',
      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.thought.text}</p>
  ) : null,
  attribOpens: true,
  // The line that carried the card's age carries the talk's age instead, once
  // there is something on it you have not seen. No mark, no count — the same
  // words in the same place, saying something else.
  cardMeta: (item) => (hasNew9(item, true) ? 'spoke ' + talkAge9(item) : null),
  // The way in is a real control in the action row, where the card has always
  // kept its controls. The attribution row stays a second, larger target — it
  // is a convenience, never the only way through.
  cardActions: ({ item, tab, ctx }) => tab === 'read' ? (
    <button type="button" onClick={() => ctx.openRecord(item)} className="circ-cardaction circ-cardaction-icon"
      aria-label="Open the card’s page" title="The card’s page">
      <window.Icon name="arrow-right" size={18} />
    </button>
  ) : null,
  write: () => null,
  flowSub: 'Your reaction for the circle. The card’s page opens next, to write on.',
  revealElsewhere: true,
  record: null,   // the record is a page, routed by the app — see D8Page
};

// The page itself. Rendered inside the shell as a sub-view, so it arrives with
// the app's own push on a phone and its own back control everywhere.
const D8Page = ({ item, ctx, user }) => {
  const [replyTo, setReplyTo] = React.useState(null);
  const [thought, setThought] = React.useState('');
  const needsThought = !item.thought && /^added by you$/i.test(item.attribution || '');
  const host = (() => { try { return new URL(item.url).hostname.replace(/^www\./, ''); } catch (e) { return item.url; } })();
  const reacted = (item.reactions || []).filter(r => r.glyph);
  const size = Math.min(260, (typeof window !== 'undefined' ? window.innerWidth : 400) - 120);
  return (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: '24px 20px 96px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{item.source || host}</span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{
            font: '600 22px/1.25 var(--font-sans)', letterSpacing: '-0.015em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty' }}>
            {item.title || item.url.replace(/^https?:\/\//, '')}
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <window.Avatar name={/^added by you$/i.test(item.attribution) ? window.displayName(user) : item.attribution.replace(/^added by\s+/i, '')} size={26} accent={/^added by you$/i.test(item.attribution)} />
            <span style={{ font: '600 13.5px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{item.attribution}</span>
            <span style={{ font: '500 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{window.circWhen(item.at)}</span>
          </div>
        </header>

        {needsThought ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <W9 value={thought} onChange={setThought} lines={4} max={400} autoFocus label="Your thought, if you have one"
              placeholder="Your own words, whole" />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <window.Button variant="primary" size="sm" onClick={() => { const t = thought.trim(); if (t) ctx.attach(item, t); setThought(''); }} disabled={!thought.trim()}>Attach it</window.Button>
            </div>
          </div>
        ) : <TH9 item={item} size={16} />}

        {item.read && (
          <React.Fragment>
            {reacted.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 8px' }}>
                <window.SwellScatter all={reacted} size={size} selected={null} onSelect={() => {}} interactive />
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 20 }}>
              <T9 item={item} showGlyph onReply={(e) => setReplyTo(e)} gap={22} />
            </div>
            <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <AG9 item={item} ctx={ctx} lines={3} max={400} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} placeholder="Your own words, whole" />
              <WA9 item={item} onToggle={ctx.toggleWatch} />
            </div>
          </React.Fragment>
        )}
        {!item.read && (
          <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>
            What the circle said opens once you have read it yourself.
          </p>
        )}
      </div>
    </main>
  );
};

Object.assign(window, { D8_LINE, D8_PAGE, D8Page, D8Bubble });
