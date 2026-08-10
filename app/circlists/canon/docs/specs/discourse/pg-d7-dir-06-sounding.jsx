// ============================================================================
// Discourse v7 — direction 06, Sounding.
// ----------------------------------------------------------------------------
// A member raises one proposition about the item. The circle answers it by pull
// alone — a single unipolar pressure bar, no glyphs, no words. Conversation is
// therefore a short stack of calls, each carrying the circle's graded reply.
//
// THE INSTRUMENT is deliberately NOT the disc. One horizontal axis, the shipped
// three rungs (a little / moderately / deeply), and nothing else. The disc
// answers "how did it land on me"; the bar answers "how far do I go with what
// Ada said". Two axes of one paired subject, which is the invariant, not a
// second system beside the Swell.
//
// THE CARD FACE — a claim with an instrument under it. The proposition sits
// below the attribution at body size, and directly beneath it, full card width,
// the pressure bar. The card never carries a loose note: it carries something
// the circle is being asked, with the means of answering drawn under it. The
// bar is visible at rest, before anyone has touched it — a6 is seeded with an
// untouched one, and that empty track is the direction's signature.
//
// THE BUDGET. One proposition per member per item, forever. It is structural:
// once yours is on the item the raise affordance is simply not there, and the
// row carrying your name is the reason. Nothing counts anything, nothing is
// policed with a message.
//
// CLOSING. A proposition closes when everyone else has answered it. Closed
// soundings collapse to one quiet row — the line and the circle's settled
// depth — so the ledger holds a short stack of claims worth returning to.
// Continuation is raising a new proposition or answering an open one; never
// replying to a reply. There is nowhere in this direction to say "thanks".
// ============================================================================

const { PGD7, Button, Avatar } = window;
const { useState: sdS, useRef: sdR } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS internal.
// PLAYGROUND.md allows the copy; this is the pointer to its source. Verbatim —
// never "improved", or it stops being evidence of what the product says.
const SD_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const sdWord = (level) => SD_DEPTH_WORDS[Math.max(1, Math.min(3, Math.round(level))) - 1];

// ============================================================================
// The ledger — reading and writing a sounding stack.
// ----------------------------------------------------------------------------
// Seeded stacks live in initialState, keyed by item id. An item the reviewer
// adds carries its proposition as the item's own thought (that is what the add
// flow commits), so it is lifted into a one-row stack on demand. An item with
// neither is a bare card, which is a legitimate face and never a placeholder.
// ============================================================================
const sdBase = (state, item) => {
  const map = (state && state.soundings) || {};
  if (map[item.id]) return map[item.id];
  if (item.thought && item.thought.text) {
    return [{
      id: 'sd-' + item.id + '-own',
      by: item.thought.by || 'you',
      text: item.thought.text,
      at: item.thought.at || item.at,
      answers: {},
    }];
  }
  return [];
};

const sdWrite = (ctx, item, fn) => ctx.setState((s) => ({
  soundings: { ...((s && s.soundings) || {}), [item.id]: fn(sdBase(s, item)) },
}));

const sdList = (ctx, item) => sdBase(ctx.state, item);

// Everyone but the member who raised it. A proposition closes when they have
// all answered — the circle has finished with it, so it stops asking.
const sdAnswerable = (ctx, s) => ctx.members.filter((m) => m.id !== s.by).length;
const sdAnswers = (s) => Object.keys(s.answers || {});
const sdClosed = (ctx, s) => sdAnswers(s).length >= sdAnswerable(ctx, s);
const sdSettled = (s) => {
  const keys = sdAnswers(s);
  if (!keys.length) return null;
  return keys.reduce((t, k) => t + s.answers[k], 0) / keys.length;
};
const sdMine = (s) => (s.answers && s.answers.you) || 0;
const sdRaisedByYou = (list) => list.some((s) => s.by === 'you');

const sdPull = (ctx, item, sid, level) => sdWrite(ctx, item, (list) =>
  list.map((s) => (s.id === sid ? { ...s, answers: { ...(s.answers || {}), you: level } } : s)));

const sdRaise = (ctx, item, text) => sdWrite(ctx, item, (list) => [
  ...list,
  { id: 'sd-' + item.id + '-' + Date.now(), by: 'you', text, at: Date.now(), answers: {} },
]);

// ============================================================================
// The pressure bar. One axis, three rungs, unipolar.
// ----------------------------------------------------------------------------
//   fill   the circle's settled depth, in a mid neutral — an aggregate, so it
//          carries no colour and no number
//   mark   your own pull, at the leading edge of the rung you reached, in the
//          strongest neutral. Yours outranks the circle's by weight, never hue.
// Accent is spent only on the focus ring, which the app's own global rule
// paints. Nothing here is status colour and nothing is decoration.
// ============================================================================
const Sd7Bar = ({ settled, mine, interactive, onPull, label, height = 12, rungWords = false }) => {
  const trackRef = sdR(null);
  const dragging = sdR(false);

  const levelAt = (clientX) => {
    const el = trackRef.current;
    if (!el) return 1;
    const box = el.getBoundingClientRect();
    const f = (clientX - box.left) / Math.max(1, box.width);
    return Math.max(1, Math.min(3, Math.floor(f * 3) + 1));
  };
  const apply = (clientX) => {
    const level = levelAt(clientX);
    if (level !== mine) onPull(level);
  };

  const sdBarPad = {
    padding: interactive ? '16px 0' : 0,
    touchAction: 'none',
    cursor: interactive ? 'pointer' : 'default',
    borderRadius: 'var(--radius-sm)',
  };
  const sdBarWrap = { position: 'relative', width: '100%' };
  const sdBarTrack = {
    position: 'relative', height, width: '100%', overflow: 'hidden',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-surface-sunken)',
    border: '1px solid var(--color-border-2)',
  };
  const sdBarFill = {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: settled ? (settled / 3) * 100 + '%' : 0,
    background: 'var(--color-fg-2)',
    transition: 'width var(--duration-slow) var(--ease-quiet)',
  };
  const sdBarMark = {
    position: 'absolute', top: -3, height: height + 6, width: 2,
    left: 'calc(' + (mine / 3) * 100 + '% - 2px)',
    background: 'var(--color-fg-1)', borderRadius: 1,
    transition: 'left var(--duration-slow) var(--ease-quiet)',
  };
  const sdBarWords = {
    display: 'flex', marginTop: 7,
    fontFamily: 'var(--font-mono)', fontSize: 10.5, lineHeight: 1.2,
    color: 'var(--color-fg-3)',
  };

  return (
    <div
      className={interactive ? 'sd7-bar' : undefined}
      style={sdBarPad}
      role={interactive ? 'slider' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? label : undefined}
      aria-valuemin={interactive ? 1 : undefined}
      aria-valuemax={interactive ? 3 : undefined}
      aria-valuenow={interactive ? (mine || 0) : undefined}
      aria-valuetext={interactive ? (mine ? sdWord(mine) : 'not answered') : undefined}
      onPointerDown={interactive ? (e) => {
        dragging.current = true;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
        apply(e.clientX);
      } : undefined}
      onPointerMove={interactive ? (e) => { if (dragging.current) apply(e.clientX); } : undefined}
      onPointerUp={interactive ? () => { dragging.current = false; } : undefined}
      onPointerCancel={interactive ? () => { dragging.current = false; } : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onPull(Math.min(3, (mine || 0) + 1)); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onPull(Math.max(1, (mine || 1) - 1)); }
      } : undefined}
    >
      <div style={sdBarWrap}>
        <div ref={trackRef} className="sd7-t" style={sdBarTrack}>
          <div style={sdBarFill} />
          <span style={{ position: 'absolute', top: 0, bottom: 0, left: '33.3333%', width: 1, background: 'var(--color-border-1)' }} />
          <span style={{ position: 'absolute', top: 0, bottom: 0, left: '66.6667%', width: 1, background: 'var(--color-border-1)' }} />
        </div>
        {mine ? <span style={sdBarMark} /> : null}
      </div>
      {rungWords && (
        <div style={sdBarWords} aria-hidden="true">
          {SD_DEPTH_WORDS.map((w) => (
            <span key={w} style={{ flex: 1, minWidth: 0, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w}</span>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// One row of the stack: the line, who raised it, and the instrument under it.
// Open rows are pullable and carry the rung words; settled rows collapse to the
// line and the depth the circle came to rest at.
// ============================================================================
const Sd7Row = ({ ctx, item, s, live }) => {
  const closed = sdClosed(ctx, s);
  const settled = sdSettled(s);
  const mine = sdMine(s);
  const yours = s.by === 'you';
  const pullable = live && !closed && !yours;

  const sdRowWrap = {
    display: 'flex', flexDirection: 'column',
    gap: closed ? 4 : 2,
    padding: closed ? '2px 0 10px' : '2px 0 4px',
  };
  const sdRowLine = closed ? {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, lineHeight: 1.45,
    color: 'var(--color-fg-2)', textWrap: 'pretty', margin: 0,
  } : {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15.5, lineHeight: 1.45,
    letterSpacing: '-0.005em', color: 'var(--color-fg-1)', textWrap: 'pretty', margin: 0,
  };
  const sdRowMeta = {
    display: 'flex', alignItems: 'baseline', gap: 8,
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11.5, lineHeight: 1.4,
    color: 'var(--color-fg-3)',
  };
  const sdRowDepth = {
    flexShrink: 0, marginLeft: 'auto',
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: settled ? 'var(--color-fg-2)' : 'var(--color-fg-3)',
  };

  return (
    <div style={sdRowWrap}>
      <p style={sdRowLine}>{s.text}</p>
      <div style={sdRowMeta}>
        <span>{yours ? 'You raised this' : ctx.nameOf(s.by) + ' raised this'}</span>
        {settled ? <span style={sdRowDepth}>{sdWord(settled)}</span> : null}
      </div>
      <Sd7Bar
        settled={settled}
        mine={mine}
        interactive={pullable}
        rungWords={pullable}
        height={closed ? 8 : 12}
        label={'How far you go with: ' + s.text}
        onPull={(level) => sdPull(ctx, item, s.id, level)}
      />
    </div>
  );
};

// ============================================================================
// Raising. Two rows, no label, no counter — the field is gone the moment your
// proposition is on the item, and the row carrying your name is why.
// ============================================================================
const Sd7Raise = ({ ctx, item, collapsed }) => {
  const [text, setText] = sdS('');
  const [open, setOpen] = sdS(!collapsed);
  const sdRaiseWrap = { display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 };
  const sdRaiseField = {
    width: '100%', fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5,
    color: 'var(--color-fg-1)', background: 'var(--color-surface)',
    padding: '10px 12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-1)', resize: 'vertical',
  };
  if (!open) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 2 }}>
        <Button variant="tertiary" size="sm" onClick={() => setOpen(true)}>Raise a proposition</Button>
      </div>
    );
  }
  return (
    <div style={sdRaiseWrap}>
      <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)}
        placeholder="State something the circle can answer." style={sdRaiseField} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" disabled={!text.trim()}
          onClick={() => { sdRaise(ctx, item, text.trim()); setText(''); if (collapsed) setOpen(false); }}>
          Raise
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// The stack on one item: what is open, what has settled, and your one raise.
// ============================================================================
const Sd7Stack = ({ ctx, item, live, dense }) => {
  const list = sdList(ctx, item);
  const open = list.filter((s) => !sdClosed(ctx, s));
  const settled = list.filter((s) => sdClosed(ctx, s));
  const canRaise = live && !sdRaisedByYou(list);

  if (!list.length && !canRaise) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: dense ? 10 : 14 }}>
      {open.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="circ-fdiv"><span className="circ-fdiv-label">Open</span></div>
          {open.map((s) => <Sd7Row key={s.id} ctx={ctx} item={item} s={s} live={live} />)}
        </div>
      )}
      {settled.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="circ-fdiv"><span className="circ-fdiv-label">Settled</span></div>
          {settled.map((s) => <Sd7Row key={s.id} ctx={ctx} item={item} s={s} live={false} />)}
        </div>
      )}
      {canRaise && <Sd7Raise ctx={ctx} item={item} collapsed={dense} />}
    </div>
  );
};

// ============================================================================
// The card face — below the attribution: the claim, and the bar drawn under it.
// One line ever. The open proposition if there is one; otherwise the last thing
// the circle settled, in the quiet register. Nothing at all is a real face.
// ============================================================================
const SdCard = ({ ctx, item }) => {
  const list = sdList(ctx, item);
  if (!list.length) return null;
  const open = list.filter((s) => !sdClosed(ctx, s));
  const s = open[0] || list[list.length - 1];
  const closed = !open.length;
  const settled = sdSettled(s);
  const mine = sdMine(s);

  const sdCardWrap = {
    marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)',
    borderTop: '1px solid var(--color-border-2)',
    display: 'flex', flexDirection: 'column', gap: 6,
  };
  const sdCardLine = closed ? {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, lineHeight: 1.45,
    color: 'var(--color-fg-2)', textWrap: 'pretty', margin: 0,
  } : {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15, lineHeight: 1.45,
    color: 'var(--color-fg-1)', textWrap: 'pretty', margin: 0,
  };
  const sdCardMeta = {
    display: 'flex', alignItems: 'baseline', gap: 8,
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11.5, lineHeight: 1.4,
    color: 'var(--color-fg-3)',
  };

  return (
    <div style={sdCardWrap}>
      <p style={sdCardLine}>{s.text}</p>
      <Sd7Bar settled={settled} mine={mine} interactive={false} height={closed ? 6 : 10} />
      <div style={sdCardMeta}>
        <span>{s.by === 'you' ? 'You raised this' : ctx.nameOf(s.by) + ' raised this'}</span>
        {settled ? <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-2)' }}>{sdWord(settled)}</span> : null}
      </div>
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. The sharer opens with a claim, not a caption, and the means
// of answering it is drawn underneath as they write. Skipping is a real state.
// ============================================================================
const SdCompose = ({ draft, setDraft, submit }) => {
  const sdComposeField = {
    width: '100%', fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5,
    color: 'var(--color-fg-1)', background: 'var(--color-surface)',
    padding: 12, borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-1)', resize: 'vertical',
  };
  const sdComposePreview = {
    border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
    background: 'var(--color-page)', padding: '12px 14px 14px',
    display: 'flex', flexDirection: 'column', gap: 8,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <textarea rows={3} value={draft.text}
        onChange={(e) => setDraft({ ...draft, text: e.target.value })}
        placeholder="State something the circle can answer." style={sdComposeField} />
      <div style={sdComposePreview}>
        <p style={{
          margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15,
          lineHeight: 1.45, textWrap: 'pretty',
          color: draft.text.trim() ? 'var(--color-fg-1)' : 'var(--color-fg-3)',
        }}>{draft.text.trim() || 'Your proposition'}</p>
        <Sd7Bar settled={null} mine={0} interactive={false} height={10} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
        <Button variant="primary" disabled={!draft.text.trim()}
          onClick={() => submit({ text: draft.text.trim(), register: 'gist' })}>Raise</Button>
      </div>
    </div>
  );
};

// ============================================================================
// Beats 2 and 3 — land and respond. One surface: the Swell has run, and the
// item's soundings come up in its place. Pull each bar, or none, and raise one
// of your own. Both beats reach the same body; the states differ because the
// items do.
// ============================================================================
const SdSoundings = ({ ctx, item, glyph, close }) => {
  const sdSoundHead = {
    display: 'flex', alignItems: 'center', gap: 10,
    paddingRight: 34, marginBottom: 4,
  };
  const sdSoundTitle = {
    minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
    lineHeight: 1.35, color: 'var(--color-fg-2)', textWrap: 'pretty',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={sdSoundHead}>
        {glyph ? <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{glyph}</span> : null}
        <span style={sdSoundTitle}>{item.title || item.url.replace(/^https?:\/\//, '')}</span>
      </div>
      <Sd7Stack ctx={ctx} item={item} live />
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 2 }}>
        <Button variant="secondary" onClick={close}>Done</Button>
      </div>
    </div>
  );
};

// ============================================================================
// Beat 4 — continue. The ledger: every claim the circle has been asked, newest
// first, open ones still pullable and settled ones collapsed to a line and a
// depth. Answering an open one and raising a new one are the only two moves;
// there is nowhere to reply to a reply, which is the point.
// ============================================================================
const SdLedger = ({ ctx }) => {
  const items = ctx.items
    .filter((i) => sdList(ctx, i).length > 0)
    .sort((a, b) => (b.at || 0) - (a.at || 0));

  const sdLedgerPage = {
    maxWidth: 'var(--max-feed-width)', margin: '0 auto',
    padding: ctx.isMobile ? '16px 16px 32px' : '28px 24px 44px',
    display: 'flex', flexDirection: 'column', gap: 26,
  };
  const sdLedgerHead = {
    display: 'flex', alignItems: 'center', gap: 8, minWidth: 0,
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13.5,
    lineHeight: 1.35, color: 'var(--color-fg-1)', letterSpacing: '-0.005em',
  };
  const sdLedgerBlock = {
    background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5) var(--space-5)',
    display: 'flex', flexDirection: 'column', gap: 12,
  };

  return (
    <div style={sdLedgerPage}>
      {items.map((item) => (
        <section key={item.id} style={sdLedgerBlock}>
          <div style={sdLedgerHead}>
            <Avatar name={item.by === 'you' ? ctx.me.realName : ctx.nameOf(item.by)} size={22} accent={item.by === 'you'} />
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title || item.url.replace(/^https?:\/\//, '')}
            </span>
          </div>
          <Sd7Stack ctx={ctx} item={item} live dense />
        </section>
      ))}
    </div>
  );
};

// ---- The two rules inline styles cannot carry ------------------------------
// A hover on the instrument, which is a state, and a slightly firmer track
// under the pointer so the bar reads as something you pull rather than a meter.
const SD_CSS = `
.sd7-bar:hover .sd7-t, .sd7-bar:focus-visible .sd7-t { border-color: var(--color-border-1); }
.sd7-bar { -webkit-tap-highlight-color: transparent; }
`;
if (typeof document !== 'undefined' && !document.getElementById('sd7-css')) {
  const sdStyleEl = document.createElement('style');
  sdStyleEl.id = 'sd7-css';
  sdStyleEl.textContent = SD_CSS;
  document.head.appendChild(sdStyleEl);
}

// ============================================================================
// Seeded stacks. One circle, inhabited: propositions rather than captions, with
// the circle's pulls already on most of them. Seeded for coverage —
//   a6   raised, untouched: the empty track, before anyone has answered
//   a3   your own proposition, so the raise affordance is gone from that item
//   a4   two open propositions on one item — the stack, not a single call
//   a5   one pull short of settling, so answering it closes it in front of you
//   r1   one settled row and one open one — the ledger shape
//   r4   a long proposition, so the measure is tested
//   a2 · r3   nothing raised at all — a bare card, which is a real face
// ============================================================================
const SD_SEED = {
  a1: [
    { id: 'sd-a1-1', by: 'priya', at: 1, text: 'A rota that needs a hero every third week is a queue with a person on the end of it, and ours is one.', answers: { marcus: 3, ada: 2, dev: 1 } },
  ],
  a3: [
    { id: 'sd-a3-1', by: 'you', at: 1, text: 'Ordering the pipeline cheapest-belief-first buys us more than making any single stage faster.', answers: { dev: 2 } },
  ],
  a4: [
    { id: 'sd-a4-1', by: 'ada', at: 1, text: 'Predictable degradation is worth more to us than peak throughput, and the storage review should say so.', answers: { marcus: 3, priya: 3, dev: 2 } },
    { id: 'sd-a4-2', by: 'marcus', at: 2, text: 'We should not put a learned index in front of real data until we can name the workload that breaks it.', answers: { ada: 2, priya: 1 } },
  ],
  a5: [
    { id: 'sd-a5-1', by: 'dev', at: 1, text: 'Simple and easy are different words and we have spent a decade using one to buy the other.', answers: { ada: 3, marcus: 2, priya: 3 } },
  ],
  a6: [
    { id: 'sd-a6-1', by: 'marcus', at: 1, text: 'Keep the histogram. Any summary we want can be computed later; the distribution cannot be recovered.', answers: {} },
  ],
  a7: [
    { id: 'sd-a7-1', by: 'priya', at: 1, text: 'The one you loved is the one to go back to last, not first.', answers: { you: 2, dev: 2, ada: 1 } },
  ],
  r1: [
    { id: 'sd-r1-1', by: 'marcus', at: 1, text: 'Close from the sending side, always, and ownership stops being an argument in review.', answers: { priya: 3, ada: 3, dev: 2, you: 3 } },
    { id: 'sd-r1-2', by: 'ada', at: 2, text: 'A stage that cannot be cancelled is a leak, and we are running three of them in the ingest path.', answers: { dev: 2, priya: 1 } },
  ],
  r2: [
    { id: 'sd-r2-1', by: 'priya', at: 1, text: 'Most of our incidents are two resolvers disagreeing about how long an answer stays true.', answers: { marcus: 2, you: 2, ada: 1, dev: 2 } },
  ],
  r4: [
    { id: 'sd-r4-1', by: 'dev', at: 1, text: 'Taking it as a very long, very odd essay with a plot bolted on is the only way most of us will finish it, and forty pages in is exactly the right moment to say so rather than the wrong one.', answers: { ada: 3, priya: 2, you: 3 } },
  ],
};

PGD7.register({
  id: 'sounding',
  name: 'Sounding',
  // Below the attribution, at body size, with the instrument drawn full width
  // directly beneath it. The bar is the differentiator and it is there at rest.
  face: { slot: 'below-attribution' },
  initialState: { soundings: SD_SEED },
  Card: SdCard,
  Compose: SdCompose,
  Landing: SdSoundings,
  Respond: SdSoundings,
  Continue: SdLedger,
  continueTitle: 'Soundings',
  beats: {
    // Land on the item carrying two open propositions, one of them a single
    // pull short of settling — so the Swell commits, the stack comes up in its
    // place, and answering visibly closes a call.
    land: (api) => {
      const stack = (i) => (api.state.soundings || {})[i.id] || [];
      const t = api.itemById('a4') || api.activeItems.find((i) => stack(i).length > 1) || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A read item where one call has settled and another is still open: the
    // ledger shape, and your pull is the one it is waiting on.
    respond: (api) => {
      const t = api.itemById('r1') || api.readItems.find((i) => ((api.state.soundings || {})[i.id] || []).length > 1) || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
  },
});
