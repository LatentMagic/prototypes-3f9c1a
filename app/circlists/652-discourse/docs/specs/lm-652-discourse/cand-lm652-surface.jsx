// ============================================================================
// LM-652 candidate — the conversation surface (items 4 + 7). A card's own page,
// reached and left the way circle settings is (inShell subView chrome carries
// the back arrow and the title). Never an overlay over the feed.
// What holds it as a card: the item — attribution, title, Open, Delete, the
// watching control, the reaction record — stays ABOVE the talk, as one card;
// the conversation is anchored beneath it, never free-floating.
// ============================================================================

// The watching control. The mechanism lives HERE; the card's fold only displays
// it. Not a button with a label but a toggle affordance in the card's own action
// row, the same shape as the actions beside it — the fold's glyph, accent when
// it is standing on (an active state, which is what accent is for).
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
// a heading nor a topic, and given outside the conversation, so it sits on its
// own paper with its own label.
const CandIntro = ({ item, api }) => {
  const t = item.thought;
  const by = /^you$/i.test(t.by) ? 'You' : t.by;
  return (
    <div style={{ background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd, borderRadius: 'var(--radius-md)', padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
        <span style={{ font: '600 13.5px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{by}</span>
        <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>with the link{candWhen(t.at) ? ' \u00b7 ' + candWhen(t.at) : ''}</span>
      </div>
      <CandProse text={t.text} size={14.5} lh={1.55} />
    </div>
  );
};

// A turn. Quiet actions; 44px targets kept by inset padding, not visual bulk.
const candQuietBtn = { background: 'transparent', border: 0, cursor: 'pointer', font: '500 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', padding: '12px 6px', margin: '-9px -6px', minHeight: 44, borderRadius: 'var(--radius-sm)' };

const CandTurn = ({ item, t, api, depth, rx, onReply }) => {
  const me = t.by === 'You';
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  if (t.deleted) return (
    <div style={{ display: 'flex', gap: 10, padding: '1px 0' }}>
      <span aria-hidden="true" style={{ width: 26, flexShrink: 0 }} />
      <span style={{ font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-3)' }}>
        {me ? 'You removed what you said.' : t.by + ' removed what they said.'}
      </span>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Avatar name={me ? displayName(api.user) : t.by} size={26} accent={me} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, minWidth: 0, flexWrap: 'wrap' }}>
          <span style={{ font: '600 13.5px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{t.by}</span>
          {rx && (
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
              <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>{rx.glyph}</span>
              <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>
                {'it landed ' + depthWord(rx)}
              </span>
            </span>
          )}
          <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candWhen(t.at)}{t.edited ? ' \u00b7 edited' : ''}</span>
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
            <div style={{ display: 'flex', gap: 16, marginTop: 1 }}>
              {depth === 0 && <button type="button" className="cand-quiet" style={candQuietBtn} onClick={onReply}>Reply</button>}
              {me && <button type="button" className="cand-quiet" style={candQuietBtn} onClick={() => { setDraft(t.text); setEditing(true); }}>Edit</button>}
              {me && <button type="button" className="cand-quiet" style={candQuietBtn} onClick={() => candDeleteTurn(api, item, t.id)}>Delete</button>}
            </div>
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
  const firstBy = {};
  talk.forEach(t => { if (!t.deleted && !(t.by in firstBy)) firstBy[t.by] = t.id; });
  // A member's blind reaction rides their FIRST words in — the glyph and how
  // deeply it landed, in the same words the roster speaks.
  const rxFor = (t) => {
    if (firstBy[t.by] !== t.id) return null;
    return (item.reactions || []).find(x => x.name === t.by && x.glyph) || null;
  };
  const [replyTo, setReplyTo] = React.useState(null);
  const [reply, setReply] = React.useState('');
  const [text, setText] = React.useState('');
  const indent = { marginLeft: 36, borderLeft: '2px solid var(--color-border-2)', paddingLeft: 12 };
  return (
    <React.Fragment>
      {talk.length === 0 && !item.thought && (
        <p style={{ margin: 0, font: '400 13.5px/1.55 var(--font-sans)', color: 'var(--color-fg-3)' }}>Nothing has been said yet.</p>
      )}
      {tops.map(t => (
        <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CandTurn item={item} t={t} api={api} depth={0} rx={rxFor(t)}
            onReply={() => { setReplyTo(replyTo === t.id ? null : t.id); setReply(''); }} />
          {kidsOf(t.id).map(k => (
            <div key={k.id} style={indent}>
              <CandTurn item={item} t={k} api={api} depth={1} rx={rxFor(k)} />
            </div>
          ))}
          {replyTo === t.id && (
            <div style={{ ...indent, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CandWrite value={reply} onChange={setReply} max={500} minLines={1} autoFocus size={14.5}
                placeholder={'Reply to ' + (t.by === 'You' ? 'yourself' : t.by)} ariaLabel={'Reply to ' + t.by} />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button size="sm" variant="secondary" onClick={() => setReplyTo(null)}>Cancel</Button>
                <Button size="sm" variant="primary" disabled={!reply.trim()} onClick={() => { candAddTurn(api, item, reply.trim(), t.id); setReplyTo(null); setReply(''); }}>Send</Button>
              </div>
            </div>
          )}
        </div>
      ))}
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
    <p style={{ margin: '22px 0 0', textAlign: 'center', font: '400 14px/1.5 var(--font-sans)', color: 'var(--color-fg-3)' }}>
      {champ
        ? <React.Fragment>You might have fun with {link('another circle')}.</React.Fragment>
        : <React.Fragment>You might enjoy having {link('a circle of your own')}.</React.Fragment>}
    </p>
  );
};

const CandSurface = ({ item, api }) => {
  const attribution = (item.attribution || '').replace(/^(added by\s+)you\b/i, '$1you');
  const whoName = attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');
  const isYou = /^you$/i.test(whoName);
  const rxAll = item.reactions || [];
  return (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
        padding: api.isMobile ? '16px 16px 96px' : '28px 24px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <section style={{ position: 'relative', background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={/former member/i.test(attribution) ? null : (isYou ? displayName(api.user) : whoName)} size={28} accent={isYou} />
            <span style={{ font: '600 14px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{attribution}</span>
            {candWhen(item.at) && <span style={{ font: '500 11px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candWhen(item.at)}</span>}
          </div>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle"
            style={{ font: '600 20px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', overflowWrap: 'break-word' }}>{candTitleOf(item)}</a>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: -13 }}>
            <CandWatchControl item={item} api={api} />
            <button className="circ-cardaction circ-cardaction-icon" onClick={() => api.requestDelete(item)} aria-label="Delete this link" title="Delete">
              <Icon name="trash" size={17} />
            </button>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border-2)', marginTop: 4, paddingTop: 16 }}>
            <SwellReview all={rxAll} interactive firstHere={rxAll.length === 0} />
          </div>
          {item.watching && <CandFold />}
        </section>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '2px 4px 0' }}>
          <CandEyebrow>the conversation</CandEyebrow>
          {item.thought && <CandIntro item={item} api={api} />}
          <CandTalk item={item} api={api} />
        </section>
        <CandOwnDoor item={item} api={api} />
      </div>
    </main>
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

Object.assign(window, { CandSurface, CandSurfaceRoute, CandWatchControl, CandTalk, CandTurn, CandIntro, CandOwnDoor });
