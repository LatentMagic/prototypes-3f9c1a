// ============================================================================
// Discourse v7 — direction 10, The Stream.
// ----------------------------------------------------------------------------
// The circle gets ONE continuous chronological talk surface, permanently open,
// and items are its punctuation. Flat, unbounded, no nesting, no reply-to, no
// mentions, no threads. You enter at now; nothing above the waterline is
// presented as owed.
//
// THE ONE STRUCTURAL INVENTION. You cannot post a bare message. Every entry
// carries the card it is about, so a stretch of stream reads as a card block,
// then some talk, then another card block — a transcript of a circle reading
// together rather than a chat log. The foot composer is always headed with a
// card: by default the one the river is currently on, otherwise whichever card
// block you last tapped. Addressing is by proximity in time, the way it is in a
// room.
//
// THE CARD IS LEFT ALONE. This is the only direction that registers no card
// face at all — no `face`, no `Card`, so the rig mounts the SHIPPED FeedCard
// untouched. The sharer's thought is not a caption on the card; it is the first
// stream entry under that card's header block. Contribution and conversation
// are the same act from the first word. The Read tab therefore carries no
// conversation mass whatsoever: all of it was moved somewhere else.
//
// THE PAIRING IS A DIVISION OF REGISTER. The Swell is untouched — the card
// carries how it landed on you, wordless; the stream carries what was said. A
// member who never speaks still answers every item. `landingMerged: false`, so
// the shipped reveal plays in full and the stream's one affordance follows it.
//
// THE ROUTE — PRESENCE, NEVER SUMMONS. The stream is made unforgettable by
// being ambient rather than reachable, because every alternative route is a
// summons and each of them reintroduces exactly the mechanic this direction
// exists to remove.
//   >= 1024  a PERMANENT right column beside the queue, always visible, never
//            navigated to. You do not enter the stream; you are in the room
//            with it. Registered as `Aside`, which the rig docks at 340px.
//   < 1024   the same posture compressed: the circle header gains a SECOND LINE
//            at metadata size carrying the last thing said — a fragment, no
//            name, no count, no emphasis, no affordance drawn on it. Pressing
//            it opens the stream as a full page. The stream hangs off the
//            circle's header because THE STREAM IS THE CIRCLE TALKING, which is
//            also why it must never be a third tab: a tab beside Active and
//            Read would present it as a third pile of items to get through, and
//            it is not a pile.
// ONE BODY, TWO PLACEMENTS, NEVER FORKED.
//
// NO SIGNAL EVER POINTS AT THE STREAM. No dot, no pill, no glow, no count —
// not because the calm floor forbids them, but because this direction's own
// diagnosis does: feed-reader guilt was traced to EMAIL-BORROWED VISUAL
// LANGUAGE, which imported the anxiety without the cause, and a dot on a river
// is exactly that import. So the fragment is presence, not pull: you cannot
// forget a room whose sound you can hear, and hearing it asks nothing of you.
// The cost is honest and stated — a header line as a tap target is a weak
// affordance, discoverable only by trying it. Desktop gets the direction as
// designed; mobile gets a compromise.
//
// THE REACTION DOOR, REACHED FROM INSIDE THE STREAM. Every entry carries its
// item's header block, and THAT BLOCK CARRIES THE LIVE SWELL DOOR: reading a
// stretch of talk you can open the disc for the item being discussed without
// leaving the stream. That makes the stream a second, always-present route to
// the door — the opposite arrangement to the Dispatch, where the same device is
// typeset once into a finished document.
//
// THE RETURN DEVICE IS SHIPPED. The waterline is the app's own FeedDivider
// (app/liveliness.jsx), mounted verbatim at the point the last visit ended:
// everything above it is earlier. Entering the stream drops you at NOW, at the
// bottom; the Continue beat carries you back up to the line and you read down
// from it. No count, no jump-to-oldest-unread, nothing marked below.
// ============================================================================

const { PGD7, Button, Avatar, FeedDivider, SwellDoor } = window;
const { useState: smS, useEffect: smE, useRef: smR, useMemo: smM } = React;

const smHost = (url) => window.pgd7Host(url);
const smWhen = (at) => (window.circWhen ? window.circWhen(at) : null);
const smTitleOf = (item) => item.title || window.pgd7TitleFromUrl(item.url)
  || String(item.url).replace(/^https?:\/\//, '');
const smSourceOf = (item) => item.source || smHost(item.url);

// The waterline mark: where the last visit ended. Three entries fall below it,
// which is what a quiet return looks like — a short run, not a backlog.
const SM_MARK = Date.now() - 6 * 3600e3;

// ---- The river ---------------------------------------------------------------
// Every thought and every response in the circle, flattened into one
// chronological run, oldest first. An item nobody has spoken about is simply
// absent — the stream is talk, not a listing, so there is nothing to render for
// silence and no placeholder for it either.
const smEntries = (ctx) => {
  const out = [];
  (ctx.items || []).forEach((item) => {
    if (item.thought && item.thought.text) {
      out.push({
        id: item.id + '-open', item, by: item.thought.by || item.by,
        at: item.thought.at || item.at, text: item.thought.text,
      });
    }
    (item.responses || []).forEach((r) => {
      out.push({ id: item.id + '-' + r.id, item, by: r.by, at: r.at, text: r.text });
    });
  });
  return out.sort((a, b) => (a.at || 0) - (b.at || 0) || (a.id < b.id ? -1 : 1));
};

// The card the composer is currently headed with: whichever block you last
// tapped, otherwise whatever the river is on right now.
const smHead = (ctx, entries) => {
  const held = ctx.state && ctx.state.head ? ctx.itemById(ctx.state.head) : null;
  if (held) return held;
  const last = entries[entries.length - 1];
  return (last && last.item) || ctx.activeItems[0] || ctx.items[0] || null;
};

// Nearest scrolling ancestor — the app column, the docked aside, or the phone
// screen, depending on where this body has been placed. One body, three
// scrollers, no posture flag.
const smScroller = (el) => {
  let n = el && el.parentNode;
  while (n && n.nodeType === 1) {
    const ov = getComputedStyle(n).overflowY;
    if ((ov === 'auto' || ov === 'scroll') && n.scrollHeight > n.clientHeight + 4) return n;
    n = n.parentNode;
  }
  return null;
};

// Hover states the header blocks need, which inline styles cannot carry.
const SM_CSS = `
.sm10-block { -webkit-tap-highlight-color: transparent; }
.sm10-block:hover, .sm10-block:focus-visible { background: var(--color-border-2); }
.sm10-banner:hover { background: var(--color-surface-sunken); }
`;
if (typeof document !== 'undefined' && !document.getElementById('sm10-css')) {
  const smStyleEl = document.createElement('style');
  smStyleEl.id = 'sm10-css';
  smStyleEl.textContent = SM_CSS;
  document.head.appendChild(smStyleEl);
}

// ============================================================================
// The punctuation. A card, compacted to a block: the thing the run beneath it
// is about. Tapping one heads the foot composer with that card — the only way
// into the stream, since a bare message cannot exist.
// ============================================================================
const Sm10Favicon = ({ item }) => {
  const [broken, setBroken] = smS(false);
  if (item.faviconExists === false || broken) return null;
  const host = smHost(item.url);
  const src = (window.CircFavicons && window.CircFavicons(host))
    || ('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64');
  const smFavBox = {
    width: 14, height: 14, borderRadius: 3, overflow: 'hidden', flexShrink: 0,
    border: '1px solid var(--color-border-2)', display: 'inline-flex', marginTop: 1,
  };
  return (
    <span style={smFavBox}>
      <img src={src} alt="" onError={() => setBroken(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </span>
  );
};

const Sm10Block = ({ item, onPick, held, door }) => {
  const smBlockRow = {
    display: 'flex', alignItems: 'stretch', gap: 4, width: '100%',
    background: 'var(--color-surface-sunken)',
    borderLeft: held ? '2px solid var(--color-fg-1)' : '2px solid transparent',
    borderRadius: 'var(--radius-md)',
  };
  const smBlockBase = {
    display: 'flex', gap: 8, alignItems: 'flex-start', flex: 1, minWidth: 0, textAlign: 'left',
    background: 'transparent', border: 0, margin: 0,
    padding: '9px 4px 9px 12px', borderRadius: 'var(--radius-md)',
    cursor: onPick ? 'pointer' : 'default',
    transition: 'background var(--duration-base) var(--ease-quiet)',
  };
  const smBlockTitle = {
    margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, lineHeight: 1.35,
    color: 'var(--color-fg-1)', letterSpacing: '-0.005em', textWrap: 'pretty',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  };
  const smBlockSource = {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, lineHeight: 1.3,
    color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  };
  const body = (
    <React.Fragment>
      <Sm10Favicon item={item} />
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={smBlockSource}>{smSourceOf(item)}</span>
        <span style={smBlockTitle}>{smTitleOf(item)}</span>
      </span>
    </React.Fragment>
  );
  // The words and the door are two controls, so they are two buttons on one
  // row — never one nested inside the other.
  return (
    <div style={smBlockRow}>
      {onPick
        ? <button type="button" className="sm10-block" style={smBlockBase}
            aria-label={'Say something about ' + smTitleOf(item)}
            onClick={() => onPick(item)}>{body}</button>
        : <div style={smBlockBase}>{body}</div>}
      {door && (
        <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', marginRight: -13 }}>
          <SwellDoor item={item} />
        </span>
      )}
    </div>
  );
};

// ============================================================================
// One entry. A face, a name, a time, and what was said — flat, at whatever
// length it was said. Nothing is nested under anything.
// ============================================================================
const Sm10Entry = ({ ctx, entry }) => {
  const yours = entry.by === 'you';
  const when = smWhen(entry.at);
  const smEntryWrap = { display: 'flex', gap: 10, alignItems: 'flex-start' };
  const smEntryBody = { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 };
  const smEntryHead = {
    display: 'flex', alignItems: 'baseline', gap: 7, minWidth: 0,
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, lineHeight: 1.3,
    color: 'var(--color-fg-2)', letterSpacing: '-0.005em',
  };
  const smEntryText = {
    margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14.5,
    lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty',
  };
  return (
    <div style={smEntryWrap}>
      <Avatar name={yours ? ctx.me.realName : ctx.nameOf(entry.by)} size={24} accent={yours} />
      <div style={smEntryBody}>
        <div style={smEntryHead}>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {yours ? 'You' : ctx.nameOf(entry.by)}
          </span>
          {when && <span style={{ flexShrink: 0, fontWeight: 500, fontSize: 11, color: 'var(--color-fg-3)' }}>{when}</span>}
        </div>
        <p style={smEntryText}>{entry.text}</p>
      </div>
    </div>
  );
};

// ============================================================================
// The foot. Always headed with a card, so a bare message is unwritable; the
// head is the punctuation your words will land under. One body, used at the
// bottom of the column, and inside both sheets.
// ============================================================================
const Sm10Composer = ({ ctx, item, sticky, onPosted }) => {
  const [text, setText] = smS('');
  if (!item) return null;
  const smFootWrap = {
    position: sticky ? 'sticky' : 'static', bottom: 0, zIndex: 3,
    background: 'var(--color-surface)',
    borderTop: sticky ? '1px solid var(--color-border-2)' : 'none',
    padding: sticky ? '10px 16px calc(12px + env(safe-area-inset-bottom, 0px))' : 0,
    display: 'flex', flexDirection: 'column', gap: 8,
  };
  const smFootField = {
    width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5,
    color: 'var(--color-fg-1)', background: 'var(--color-surface)',
    padding: '10px 12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-1)', resize: 'vertical',
  };
  const say = () => {
    const t = text.trim();
    if (!t) return;
    ctx.actions.respond(item.id, { text: t, register: 'gist' });
    setText('');
    // The head goes back to following the river — which is now this card, since
    // the words just landed under it.
    ctx.setState({ head: null });
    if (onPosted) onPosted();
  };
  return (
    <div style={smFootWrap}>
      <Sm10Block item={item} held />
      <textarea rows={2} value={text} placeholder="Say something." style={smFootField}
        onChange={(e) => setText(e.target.value)} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" disabled={!text.trim()} onClick={say}>Say</Button>
      </div>
    </div>
  );
};

// ============================================================================
// The stream itself. A permanent right column at >= 1024 (`docked`), the same
// body as a destination below it. Enters at now — the bottom — every time.
// ============================================================================
const Sm10Stream = ({ ctx, docked }) => {
  const rootRef = smR(null);
  const markRef = smR(null);
  const entries = smM(() => smEntries(ctx), [ctx.items]);
  const head = smHead(ctx, entries);
  const seen = smR((ctx.state && ctx.state.goto) || 0);

  // Enter at now. Unless the reviewer has just asked to be carried back to the
  // waterline, in which case start there and read down.
  smE(() => {
    const g = (ctx.state && ctx.state.goto) || 0;
    if (g && Date.now() - g < 1500 && markRef.current) {
      markRef.current.scrollIntoView({ block: 'center' });
      return;
    }
    const sc = smScroller(rootRef.current);
    if (sc) sc.scrollTop = sc.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carried back up to the line, live, when the column is already open.
  smE(() => {
    const g = (ctx.state && ctx.state.goto) || 0;
    if (!g || g === seen.current) return;
    seen.current = g;
    if (markRef.current) markRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else {
      const sc = smScroller(rootRef.current);
      if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
    }
  });

  const smRoot = {
    background: 'var(--color-surface)', minHeight: '100%',
    display: 'flex', flexDirection: 'column',
  };
  const smInner = {
    flex: 1, width: '100%', maxWidth: 'var(--max-feed-width)', margin: '0 auto',
    padding: '14px 16px 4px', display: 'flex', flexDirection: 'column', gap: 14,
  };
  const smLabel = {
    position: 'sticky', top: 0, zIndex: 2, background: 'var(--color-surface)',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: 'var(--color-fg-3)', padding: '14px 16px 8px',
    borderBottom: '1px solid var(--color-border-2)',
  };
  const smFootHold = {
    position: 'sticky', bottom: 0, width: '100%',
    maxWidth: 'var(--max-feed-width)', margin: '0 auto',
  };

  let prev = null;
  const run = [];
  entries.forEach((e) => {
    const newBlock = !prev || prev.item.id !== e.item.id;
    // The waterline sits above the first entry from after the last visit, so
    // everything over it is earlier. Mounted, never re-drawn.
    if (prev && (prev.at || 0) < SM_MARK && (e.at || 0) >= SM_MARK) {
      run.push(
        <div key="waterline" ref={markRef} style={{ paddingTop: 2 }}><FeedDivider /></div>
      );
    }
    if (newBlock) {
      run.push(
        <Sm10Block key={e.item.id + '-blk-' + e.id} item={e.item} held={head && head.id === e.item.id}
          door onPick={(it) => ctx.setState({ head: it.id })} />
      );
    }
    run.push(<Sm10Entry key={e.id} ctx={ctx} entry={e} />);
    prev = e;
  });

  return (
    <div ref={rootRef} style={smRoot}>
      {docked && <div style={smLabel}>The stream</div>}
      <div style={smInner}>{run}</div>
      <div style={smFootHold}>
        <Sm10Composer ctx={ctx} item={head} sticky />
      </div>
    </div>
  );
};

// ============================================================================
// The circle header's second line, below 1024 only. Above that the column is
// permanent and this returns nothing.
// ----------------------------------------------------------------------------
// One line of the river, leaked into chrome that is already there: the last
// thing said, at metadata size, no name, no count, no chevron, no mark. It is
// presence, not pull — nothing here asks for anything, and pressing it is
// offered by nothing but the words themselves. That weak affordance is the
// stated cost of the mobile posture, and it is not hidden.
// ============================================================================
const Sm10Banner = ({ ctx }) => {
  if (!ctx.isMobile) return null;
  const entries = smEntries(ctx);
  const last = entries[entries.length - 1];
  if (!last) return null;
  // Flush against the top bar, no rule of its own above it, so it reads as the
  // circle header's second line rather than a band in its own right.
  const smBannerRow = {
    display: 'block', width: '100%', minHeight: 30,
    background: 'var(--color-surface)', border: 0,
    borderBottom: '1px solid var(--color-border-2)',
    padding: '0 16px 7px', margin: 0, cursor: 'pointer', textAlign: 'left',
    transition: 'background var(--duration-base) var(--ease-quiet)',
  };
  const smBannerText = {
    display: 'block', minWidth: 0,
    fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12, lineHeight: 1.35,
    color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  };
  return (
    <button type="button" className="sm10-banner" style={smBannerRow}
      aria-label="Open the stream"
      onClick={() => { ctx.setState({ head: null }); ctx.openAside(); }}>
      <span style={smBannerText}>{last.text}</span>
    </button>
  );
};

// The same fragment, set as the circle name's second line INSIDE the top bar
// rather than in a row beneath it. It is the circle's current murmur, so it
// belongs to the circle's own title block — and sitting there keeps it clear
// of the row The Dispatch uses for its band.
const Sm10TopLine = ({ ctx }) => {
  if (!ctx.isMobile) return null;
  const entries = smEntries(ctx);
  const last = entries[entries.length - 1];
  if (!last) return null;
  return (
    <button type="button" className="sm10-banner" onClick={() => { ctx.setState({ head: null }); ctx.openAside(); }}
      aria-label="Open the stream"
      style={{
        display: 'block', width: '100%', textAlign: 'left', background: 'transparent',
        border: 0, padding: 0, cursor: 'pointer', minWidth: 0,
        fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 11.5, lineHeight: 1.25,
        color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{last.text}</button>
  );
};

// ============================================================================
// Beats 2 and 3 — one surface. What the reader meets after the shipped reveal,
// and what a Read card opens: the stream AT NOW, whatever it happens to be
// about, with the composer already headed with this card.
//
// It is deliberately NOT this item's talk gathered up. There is no such thing
// here — only the stretches of river where it happened. That is the direction's
// stated cost and the surface must not quietly refund it.
// ============================================================================
const Sm10Say = ({ ctx, item, close }) => {
  const entries = smEntries(ctx);
  const tail = entries.slice(-3);
  const smSayWrap = { display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 26 };
  const smSayTail = {
    display: 'flex', flexDirection: 'column', gap: 12,
    borderTop: '1px solid var(--color-border-2)', paddingTop: 12,
  };
  const smSayCut = {
    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-fg-3)',
    letterSpacing: '0.08em', lineHeight: 1,
  };
  let prev = null;
  const rows = [];
  tail.forEach((e) => {
    if (!prev || prev.item.id !== e.item.id) {
      rows.push(<Sm10Block key={e.item.id + '-t-' + e.id} item={e.item} door />);
    }
    rows.push(<Sm10Entry key={e.id} ctx={ctx} entry={e} />);
    prev = e;
  });
  return (
    <div style={smSayWrap}>
      {rows.length > 0 && (
        <div style={smSayTail}>
          <span style={smSayCut} aria-hidden="true">…</span>
          {rows}
        </div>
      )}
      <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 14 }}>
        <Sm10Composer ctx={ctx} item={item}
          onPosted={() => { close(); ctx.openAside(); }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button variant="tertiary"
          onClick={() => { ctx.setState({ head: item.id }); close(); ctx.openAside(); }}>
          Open the stream
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. The sharer's thought is not a caption; it is the first entry
// in the stream, under this card's block. The preview shows exactly that,
// in the stream's own type, so the act is legible before it is committed.
// Skipping attaches nothing, and the link then enters the stream only when
// somebody speaks about it.
// ============================================================================
const Sm10Compose = ({ ctx, item, draft, setDraft, submit }) => {
  const smComposeField = {
    width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5,
    color: 'var(--color-fg-1)', background: 'var(--color-surface)',
    padding: 12, borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-1)', resize: 'vertical',
  };
  const smComposePreview = {
    border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
    background: 'var(--color-surface)', padding: 12,
    display: 'flex', flexDirection: 'column', gap: 12,
  };
  const smComposeEntry = { display: 'flex', gap: 10, alignItems: 'flex-start' };
  const smComposeName = {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, lineHeight: 1.3,
    color: 'var(--color-fg-2)',
  };
  const smComposeText = {
    margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.5,
    textWrap: 'pretty', color: draft.text.trim() ? 'var(--color-fg-1)' : 'var(--color-fg-3)',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <textarea rows={3} value={draft.text} placeholder="Say something." style={smComposeField}
        onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
      <div style={smComposePreview}>
        <Sm10Block item={item} />
        <div style={smComposeEntry}>
          <Avatar name={ctx.me.realName} size={24} accent />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={smComposeName}>You</span>
            <p style={smComposeText}>{draft.text.trim() || 'Your first entry'}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
        <Button variant="primary" disabled={!draft.text.trim()}
          onClick={() => {
            ctx.setState({ head: null });
            submit({ text: draft.text.trim(), register: 'gist' });
            ctx.openAside();
          }}>Say</Button>
      </div>
    </div>
  );
};

PGD7.register({
  id: 'stream',
  name: 'The Stream',
  // No `face`, no `Card`. The shipped FeedCard is mounted untouched: the card is
  // the item and the talk is elsewhere. This is the one direction that leaves it
  // alone on purpose, because the conversation was given its own room.
  initialState: { head: null, goto: 0 },
  Compose: Sm10Compose,
  Landing: Sm10Say,
  Respond: Sm10Say,
  Aside: Sm10Stream,
  TopSubtitle: Sm10TopLine,
  asideTitle: 'The stream',
  // The shipped reveal plays in full, and the stream's one affordance follows
  // it. The reaction layer is untouched, which is the whole pairing argument.
  landingMerged: false,
  beats: {
    // Land on an item the circle has already been talking about, and one the
    // reviewer has not spoken on — so the reveal is followed by a river with
    // other people's words at the bottom of it.
    land: (api) => {
      const spoken = (i) => (i.responses || []).some((r) => r.by === 'you');
      const t = api.activeItems.find((i) => (i.responses || []).length > 1 && !spoken(i))
        || api.activeItems.find((i) => (i.responses || []).length > 0)
        || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A Read card nobody has said a word about. Speaking makes the first entry
    // it has ever had — the same act, at the other end of the item's life.
    respond: (api) => {
      const t = api.readItems.find((i) => !(i.responses || []).length && !i.thought)
        || api.readItems.find((i) => !(i.responses || []).length)
        || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
    // Continuation is plain, ordinary and indefinite: come back, go to where
    // you left off, read down, carry on. At >= 1024 the column is already
    // there, so the beat is the return itself — the stream travels back to the
    // waterline. Below 1024 the same act enters the destination at that line.
    continue: (api) => {
      api.setState({ head: null, goto: Date.now() });
      api.openAside();
    },
  },
});
