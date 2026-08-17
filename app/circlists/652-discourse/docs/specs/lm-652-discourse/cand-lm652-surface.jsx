// ============================================================================
// LM-652 candidate — the conversation surface (items 4 + 7). A card's own page,
// reached and left the way circle settings is (inShell subView chrome carries
// the back arrow and the title). Never an overlay over the feed.
// What holds it as a card: the item — attribution, title, Open, Delete, the
// watching control, the reaction record — stays ABOVE the talk, as one card;
// the conversation is anchored beneath it, never free-floating.
// ============================================================================

// The watching control now lives in the fold itself (CandFoldToggle). Kept as an
// export so the C2 playground's override still resolves; no longer mounted.
const CandWatchControl = ({ item, api }) => {
  const on = !!item.watching;
  return (
    <button type="button" className="circ-cardaction circ-cardaction-icon cand-watch"
      onClick={() => candToggleWatch(api, item)} aria-pressed={on}
      aria-label={on ? 'Watching this card' : 'Watch this card'}
      title={on ? 'Watching \u2014 turn the corner back down' : 'Watch this card'}
      style={{ color: on ? 'var(--color-accent)' : undefined }}>
      <CandFoldGlyph size={17} filled={on} />
    </button>
  );
};

// The contributor's thought opens the conversation where one was left — neither
// a heading nor a topic, and given outside the conversation. Same object as on
// the card (whiteboard 2026-08-17, ratified): avatar, name in primary ink, then
// the words small and quiet. Pixel-identical to the card's register — the words
// do NOT grow to match the turns, because growing them turns the contribution
// into another turn. Its own paper is gone: the anatomy carries it now.
const CandIntro = ({ item, api }) => {
  const t = item.thought;
  const by = /^you$/i.test(t.by) ? 'You' : t.by;
  const isYou = by === 'You';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
        <Avatar name={isYou ? displayName(api.user) : by} size={26} accent={isYou} />
        <span style={{ font: '600 14px/1.25 var(--font-sans)', letterSpacing: '-0.006em', color: 'var(--color-fg-1)' }}>{by}</span>
        <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>with the link{candWhen(t.at) ? ' \u00b7 ' + candWhen(t.at) : ''}</span>
      </div>
      <CandProse text={t.text} size={12.5} lh={1.85} color="var(--color-fg-2)" />
      <div aria-hidden="true" style={{ height: 1, background: 'var(--color-border-2)', marginTop: 4 }} />
    </div>
  );
};

// The conversation's header row, and the watching control with it (C6 option 1,
// ratified 2026-08-17). The fold in the card's corner is a SIGNAL only: as a
// control it cleared neither floor — 1.55:1 against the card when watching,
// 1.25:1 when not (1.4.11 wants 3:1), and a 32px box clipped to a triangle is
// ~22px of real target, with the thumbnail's link directly beneath it so the
// spacing exception cannot apply either. The control moves here, where there is
// width, no image under it and no card anatomy to disturb: secondary ink or the
// accent, both past 4.5:1, and a full 44px target taken as inset padding so the
// row does not grow to hold it.
//
// The glyph is the folded page — the same object as the corner, so pressing it
// is what teaches what the corner means. Not the industry's eye (surveillance,
// in a product that ships no who-read-it signals) and not its bell (the
// notification-anxiety vocabulary this product avoids by design). The cost is
// stated: no recognition on arrival, learned by use.
const CandThreadHead = ({ item, api }) => {
  const on = !!item.watching;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 20 }}>
      <CandEyebrow style={{ flexShrink: 0 }}>the conversation</CandEyebrow>
      <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
      <button type="button" className="cand-watchglyph" aria-pressed={on}
        aria-label={on ? 'Watching this conversation' : 'Watch this conversation'}
        title={on ? 'Watching \u2014 turn the corner back down' : 'Watch this conversation'}
        onClick={() => candToggleWatch(api, item)}
        style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 0, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
          minHeight: 44, minWidth: 44, padding: 12, margin: '-12px -12px -12px 0',
          color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>
        <CandFoldGlyph size={17} filled={on} />
      </button>
    </div>
  );
};

// A turn. Quiet actions; 44px targets kept by inset padding, not visual bulk.
const candQuietBtn = { background: 'transparent', border: 0, cursor: 'pointer', font: '500 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', padding: '12px 6px', margin: '-9px -6px', minHeight: 44, borderRadius: 'var(--radius-sm)' };

// Your own turn's actions, behind one quiet control. Not revealed on hover: a
// hover-only affordance does not exist on touch, and revealing text buttons
// beneath the words reflowed the whole thread as the pointer travelled. One
// glyph, always drawn, identical on every posture — and far less furniture than
// two words permanently under every own turn. Menu shape follows the app's own
// (app/spaces.jsx): a small card of .circ-menuitem rows.
const CAND_MENU_W = 180;
const CandTurnMenu = ({ item, t, api, onEdit }) => {
  const [open, setOpen] = React.useState(false);
  // The trigger floats after the name and the time, so how far in it sits depends
  // on the byline. Left-aligned it can run past the right edge on a narrow
  // screen; the panel flips to right-aligned when it would. Decided from the
  // BUTTON's box at press time, not the panel's after paint, so the panel never
  // draws overflowing for a frame.
  const [flip, setFlip] = React.useState(false);
  const ref = React.useRef(null);
  const btn = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', key); };
  }, [open]);
  const row = { display: 'flex', alignItems: 'center', width: '100%', textAlign: 'left', background: 'transparent',
    border: 0, cursor: 'pointer', minHeight: 44, padding: '0 14px', borderRadius: 'var(--radius-sm)',
    font: '500 13.5px/1.3 var(--font-sans)' };
  return (
    <span ref={ref} style={{ position: 'relative', flexShrink: 0, alignSelf: 'center' }}>
      <button type="button" className="cand-quiet" aria-haspopup="menu" aria-expanded={open}
        ref={btn} aria-label="What you said" title="What you said"
        onClick={() => setOpen(o => {
          if (!o && btn.current) {
            const r = btn.current.getBoundingClientRect();
            setFlip(r.left + CAND_MENU_W > window.innerWidth - 8);
          }
          return !o;
        })}
        style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--color-fg-3)',
          minHeight: 44, minWidth: 44, padding: 12, margin: '-12px -10px -12px -6px', borderRadius: 'var(--radius-sm)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" style={{ display: 'block' }}>
          <circle cx="5.5" cy="12" r="1.6" fill="currentColor" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <circle cx="18.5" cy="12" r="1.6" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div role="menu" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: flip ? 'auto' : 0, right: flip ? 0 : 'auto', zIndex: 20, minWidth: CAND_MENU_W,
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-overlay)', padding: 6 }}>
          <button type="button" role="menuitem" className="circ-menuitem" style={{ ...row, color: 'var(--color-fg-1)' }}
            onClick={() => { setOpen(false); onEdit(); }}>Edit</button>
          <button type="button" role="menuitem" className="circ-menuitem" style={{ ...row, color: 'var(--color-destructive)' }}
            onClick={() => { setOpen(false); candDeleteTurn(api, item, t.id); }}>Delete</button>
        </div>
      )}
    </span>
  );
};

const CandTurn = ({ item, t, api, depth, onReply }) => {
  const me = t.by === 'You';
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  // A reply's WORDS are a turn's words — an answer is not a lesser thing than
  // the turn it answers. Only the furniture recedes: a smaller avatar, a smaller
  // and lighter name and time, with the rail and the indent carrying the rest.
  const av = depth ? 22 : 26;
  if (t.deleted) return (
    <div style={{ display: 'flex', gap: 10, padding: '1px 0' }}>
      <span aria-hidden="true" style={{ width: av, flexShrink: 0 }} />
      <span style={{ font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-3)' }}>
        {me ? 'You removed what you said.' : t.by + ' removed what they said.'}
      </span>
    </div>
  );
  return (
    <div className="cand-turn" style={{ display: 'flex', gap: 10 }}>
      <Avatar name={me ? displayName(api.user) : t.by} size={av} accent={me} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, minWidth: 0, flexWrap: 'wrap' }}>
          <span style={{ font: '600 ' + (depth ? 12.5 : 13.5) + 'px/1.3 var(--font-sans)', color: depth ? 'var(--color-fg-2)' : 'var(--color-fg-1)' }}>{t.by}</span>
          <span style={{ font: '400 ' + (depth ? 11 : 11.5) + 'px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candWhen(t.at)}{t.edited ? ' \u00b7 edited' : ''}</span>
          {me && !editing && <CandTurnMenu item={item} t={t} api={api} onEdit={() => { setDraft(t.text); setEditing(true); }} />}
        </div>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <CandWrite value={draft} onChange={setDraft} max={500} minLines={1} autoFocus ariaLabel="Edit what you said" size={14.5} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" variant="primary" disabled={!draft.trim()} onClick={() => { candEditTurn(api, item, t.id, draft.trim()); setEditing(false); }}>Save</Button>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <CandProse text={t.text} size={14.5} lh={1.55} />
            {depth === 0 && (
              <div style={{ display: 'flex', gap: 16, marginTop: 1 }}>
                <button type="button" className="cand-quiet" style={candQuietBtn} onClick={onReply}>Reply</button>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

// One conversation per card. Replies one level deep, never deeper (Reply lives
// only on top-level turns). No cap on turns; 500 characters to a turn. A blind
// reaction rides its member's first words in as a small mark by their name.
const CandTalk = ({ item, api }) => {
  const talk = candTurns(item).slice().sort((a, b) => a.at - b.at);
  const tops = talk.filter(t => !t.replyTo);
  const kidsOf = (id) => talk.filter(t => t.replyTo === id);
  // No reaction glyph rides a turn (ratified 2026-08-17). The reaction belongs to
  // the ROOM, and the roster above the conversation is where it is read; a glyph
  // beside a name reported a feeling the member gave in a different act, and it
  // would collide with per-comment reactions if those are ever added.
  const [replyTo, setReplyTo] = React.useState(null);
  const [reply, setReply] = React.useState('');
  const [text, setText] = React.useState('');
  // Which turns have had their tail opened. Once opened it stays open for the
  // visit; nothing re-collapses under the member.
  const [shown, setShown] = React.useState({});
  // One rail for the whole reply group, not one per reply: two replies under a
  // turn were reading as two separate quoted blocks. The gap between replies
  // stays; the rail runs through it.
  const rail = { marginLeft: 36, borderLeft: '2px solid var(--color-border-2)', paddingLeft: 12,
    display: 'flex', flexDirection: 'column', gap: 10 };
  return (
    <React.Fragment>
      {talk.length === 0 && !item.thought && (
        <p style={{ margin: 0, font: '400 13.5px/1.55 var(--font-sans)', color: 'var(--color-fg-3)' }}>Nothing has been said yet.</p>
      )}
      {tops.map(t => {
        const kids = kidsOf(t.id);
        // The first two are always visible — nothing is collapsed by default.
        // Only the long tail is held back, so it cannot bury the next turn.
        const open = !!shown[t.id];
        const head = open ? kids : kids.slice(0, 2);
        const rest = open ? 0 : kids.length - head.length;
        return (
        <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CandTurn item={item} t={t} api={api} depth={0}
            onReply={() => { setReplyTo(replyTo === t.id ? null : t.id); setReply(''); }} />
          {(kids.length > 0 || replyTo === t.id) && (
            <div style={rail}>
              {head.map(k => <CandTurn key={k.id} item={item} t={k} api={api} depth={1} />)}
              {/* No count: a number here quantifies a debt nobody asked for.
                  Not "Read more" — those words belong to the control that brings
                  a contributor's thought forward. The way back is the same words
                  in the same place, so the pair reads as one control: the first
                  two replies never move, and "the rest" is what comes and goes.
                  A gesture on the rail was tried and dropped — nothing on touch
                  says a line is pressable. */}
              {rest > 0 && (
                <div>
                  <button type="button" className="cand-quiet" style={candQuietBtn}
                    onClick={() => setShown(s => ({ ...s, [t.id]: true }))}>More replies</button>
                </div>
              )}
              {open && kids.length > 2 && (
                <div>
                  <button type="button" className="cand-quiet" style={candQuietBtn}
                    onClick={() => setShown(s => ({ ...s, [t.id]: false }))}>Hide the rest</button>
                </div>
              )}
              {replyTo === t.id && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CandWrite value={reply} onChange={setReply} max={500} minLines={1} autoFocus size={14.5}
                    placeholder={'Reply to ' + (t.by === 'You' ? 'yourself' : t.by)} ariaLabel={'Reply to ' + t.by} />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Button size="sm" variant="secondary" onClick={() => setReplyTo(null)}>Cancel</Button>
                    <Button size="sm" variant="primary" disabled={!reply.trim()} onClick={() => { candAddTurn(api, item, reply.trim(), t.id); setReplyTo(null); setReply(''); }}>Send</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        );
      })}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: tops.length ? 6 : 0 }}>
        <CandWrite value={text} onChange={setText} max={500} minLines={1} placeholder="Add to the conversation" ariaLabel="Add to the conversation" />
        {!!text.trim() && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => { candAddTurn(api, item, text.trim()); setText(''); }}>Send</Button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

// Item 7 — one quiet line at the very foot of YOUR OWN card's conversation,
// once it has drawn a minimum of responses (CAND_OWN_MIN — placeholder value).
// Founder's lines, verbatim. An ordinary inline link, never a button.
const CandOwnDoor = ({ item, api }) => {
  if (!/^added by you\b/i.test(item.attribution || '')) return null;
  if (candResponses(item) < CAND_OWN_MIN) return null;
  const champ = api.isChampion(api.space);
  const link = (label) => (
    <button type="button" onClick={api.startCircle} className="circ-doorlink"
      style={{ backgroundColor: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', fontWeight: 600 }}>{label}</button>
  );
  return (
    <p style={{ margin: '6px 0 0', textAlign: 'center', font: '400 14px/1.5 var(--font-sans)', color: 'var(--color-fg-3)' }}>
      {champ
        ? <React.Fragment>You might have fun with {link('another circle')}.</React.Fragment>
        : <React.Fragment>You might enjoy having {link('a circle of your own')}.</React.Fragment>}
    </p>
  );
};

// The head of the surface is the SHELF CARD, not a rebuild of it — the real
// FeedCard, mounted whole. Nothing is invented: no Open control (the title is
// the link's affordance, exactly as in the feed) and no watch button (the fold
// is the control). In the door's slot the card takes the SHIPPED roster door
// back, so how it landed is read the way it is read everywhere else — in the
// review modal — rather than occupying the top of the conversation's own page.
//
// The contributor's thought is NOT in the conversation (C5, option 3, ratified
// 2026-08-17): it arrives tucked under the head card on warm paper, as the real
// CandCardRow at tab="active" — the same band, the same swap, the same mark as
// the Active feed — and the thread below starts clean with the first real turn.
// The corner is the signal, never the control — the same fold the Read shelf
// draws on a watched card. CandFoldToggle is kept as an export for C2/C6.
const CandCornerSignal = ({ item }) => (item.watching ? <CandFold /> : null);

// The head card, carrying the thought tucked under it. The feed's own row, at
// its Active behaviour — not a lookalike.
const CandSurfaceHead = ({ item, api, children }) => (
  <CandCardRow item={item} tab="active" api={api} corner>{children}</CandCardRow>
);

const CandSurface = ({ item, api }) => {
  // Extension points for the C5 playground (see skills/build-playground). Read at
  // render, absent in the candidate itself:
  //   CandOpening   — replaces the eyebrow + the contributor's thought, i.e. owns
  //                   the whole "a conversation begins here" region.
  //   CandHeadExtra — draws under the head card, for options that attach the
  //                   thought to the card rather than to the thread.
  const Opening = window.CandOpening || null;
  const HeadWrap = window.CandHeadWrap || CandSurfaceHead;
  //   CandFoldCtl — what the card's corner draws (C6 swapped the control here).
  const FoldCtl = window.CandFoldCtl || CandCornerSignal;
  const card = (
    <FeedCard item={item} tab={item.read ? 'read' : 'active'} user={api.user}
      onMarkRead={() => api.requestMarkRead(item)} onDelete={() => api.requestDelete(item)} />
  );
  return (
    <CandSurfaceCtx.Provider value={true}>
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
        padding: api.isMobile ? '16px 16px 22px' : '28px 24px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="cand-headcard" style={{ position: 'relative' }}>
          {HeadWrap ? <HeadWrap item={item} api={api}>{card}</HeadWrap> : card}
          {/* A card with a thought carries its own corner inside the link card
              (it has to travel and be clipped with it); a card without one has
              no stack, so the corner is drawn here. */}
          {!(item.thought && !item.pending) && <FoldCtl item={item} api={api} />}
        </div>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '2px 4px 0' }}>
          {Opening
            ? <Opening item={item} api={api} />
            : <CandThreadHead item={item} api={api} />}
          <CandTalk item={item} api={api} />
        </section>
        <CandOwnDoor item={item} api={api} />
      </div>
    </main>
    </CandSurfaceCtx.Provider>
  );
};

// Route guard: the card can vanish under the surface (a delete lands, state
// resets) — return to the shelf rather than render a hole.
const CandSurfaceRoute = ({ api, itemId }) => {
  const item = api.space && api.space.items.find(i => i.id === itemId);
  React.useEffect(() => { if (!item) api.returnToSpace(); }, [!!item]);
  if (!item) return null;
  return <CandSurface item={item} api={api} />;
};

Object.assign(window, { CandSurface, CandSurfaceHead, CandSurfaceRoute, CandThreadHead, CandCornerSignal, CandWatchControl, CandTalk, CandTurn, CandIntro, CandOwnDoor });
