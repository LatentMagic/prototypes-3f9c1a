// ============================================================================
// Discourse v7 — direction 04, The Seal.
// ----------------------------------------------------------------------------
// Nothing anyone says on a card is readable until the card opens — and then it
// all opens at once. The sharer's thought is sealed with everyone else's, so no
// text on a sealed card is legible to anybody; marking read is the act that
// casts your own thought into the seal, and reading without saying anything
// still receives the opening.
//
// A card opens on its ELAPSED WINDOW alone. There is no read-front trigger:
// communal read progress driving product behaviour is a count made into a
// clock, and the claim here is simultaneity, not read progress.
//
// The card face is THE VEIL — a soft blocked band where the text would be:
// present, unreadable, carrying no count of who is behind it. Title, source and
// attribution are untouched. After an opening the band becomes the settled
// block; a second seal stacks a second band beneath the first, and a card is
// two bands deep forever.
//
// At the opening the circle's swell shapes are revealed in the same instant as
// the words — one event, both things, never one before the other.
// ============================================================================

const { PGD7, Button, Icon, Avatar } = window;
const { useState: slS, useEffect: slE } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS and
// levelFromIntensity internal. PLAYGROUND.md allows the copy; this is the
// pointer to its source. Verbatim — never "improved", or it stops being
// evidence of what the product actually says.
const SL_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const slDepthOf = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };

// ---- The windows ------------------------------------------------------------
// Every seal is a window, anchored to the moment this module loaded so the rig
// is inhabited at a spread of distances from its openings. `a1` opens shortly
// after the reviewer arrives, so an opening can actually be caught happening.
// An opening is persisted the instant it lands, so a reload does not re-seal it.
const SL_T0 = Date.now();
const SL_MIN = 60e3, SL_HOUR = 3600e3;
const SL_PLAN = {
  a1: { r1: { in: 75e3 } },              // opens while you are in the app
  a2: { r1: { in: 6 * SL_HOUR } },
  a3: { r1: { in: 40 * SL_MIN } },
  a4: { r1: 'open' },
  a5: { r1: { in: 3 * SL_HOUR } },
  a6: { r1: { in: 5 * SL_HOUR } },
  a7: { r1: 'open' },
  r1: { r1: 'open' },
  r2: { r1: 'open' },
  r3: { r1: 'open' },
  r4: { r1: 'open', rounds: 2, r2: { in: 2 * SL_HOUR } },
};
const SL_DEFAULT = { r1: { in: 8 * SL_HOUR } };   // anything you add is sealed too
const SL_NEXT_WINDOW = 2 * SL_HOUR;               // a second seal you open yourself

const slPlan = (item) => SL_PLAN[item.id] || SL_DEFAULT;
const slRoundCount = (ctx, item) => (ctx.state.rounds || {})[item.id] || slPlan(item).rounds || 1;

const slOpenAt = (ctx, item, n) => {
  const k = item.id + ':' + n;
  const set = (ctx.state.openAt || {})[k];
  if (set != null) return set;
  const spec = n === 1 ? slPlan(item).r1 : slPlan(item).r2;
  if (spec === 'open') return 0;
  return SL_T0 + ((spec && spec.in != null) ? spec.in : SL_DEFAULT.r1.in);
};
const slOpenedAt = (ctx, item, n) => (ctx.state.opened || {})[item.id + ':' + n] || null;
const slIsOpen = (ctx, item, n) => slOpenedAt(ctx, item, n) != null || Date.now() >= slOpenAt(ctx, item, n);

const slLeft = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return s + 's';
  const m = Math.round(s / 60);
  if (m < 60) return m + 'm';
  const h = Math.round(m / 60);
  if (h < 48) return h + 'h';
  return Math.round(h / 24) + 'd';
};
const slWhen = (ms) => (window.circWhen ? window.circWhen(ms) : null);
const SL_ORDINAL = ['', 'First opening', 'Second opening'];

// ---- The voices in a round --------------------------------------------------
// Round 1 holds the sharer's thought and everything given back on reading —
// the sharer sits among the rest, unprivileged, because their thought was
// sealed with everyone else's. Round 2 holds what was cast into the second
// seal.
//
// Ordering is a fixed shuffle keyed on the card, never arrival and never the
// roster: these lines had no arrival order, so nothing may imply one, and no
// member may sit at the top of every opening.
const slRank = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const slVoices = (ctx, item, n) => {
  const out = [];
  if (n === 1 && item.thought) {
    out.push({ key: item.id + '-t', by: item.thought.by, text: item.thought.text });
  }
  ((n === 2 && (ctx.state.seedR2 || {})[item.id]) || []).forEach((v) => {
    out.push({ key: v.id, by: v.by, text: v.text });
  });
  (item.responses || []).forEach((r) => {
    const round = r.round || 1;
    if (round === n) out.push({ key: r.id, by: r.by, text: r.text, mine: r.by === 'you' });
  });
  return out.sort((a, b) => slRank(item.id + ':' + a.by) - slRank(item.id + ':' + b.by));
};
const slMine = (ctx, item, n) => slVoices(ctx, item, n).filter((v) => v.by === 'you');

// A member's live swell on this item — revealed at the opening, never before.
const slSwellOf = (ctx, item, id) => {
  const m = ctx.memberById(id);
  if (!m) return null;
  let hit = null;
  (item.reactions || []).forEach((r) => { if (r && r.name === m.name) hit = r; });
  return hit && hit.glyph ? hit : null;
};

// ---- One ticking clock per card, and the opening written down as it lands ---
const slUseWindows = (ctx, item) => {
  const [, bump] = slS(0);
  const count = item ? slRoundCount(ctx, item) : 0;
  let pending = false;
  for (let n = 1; n <= count; n++) if (!slIsOpen(ctx, item, n)) pending = true;

  slE(() => {
    if (!pending) return undefined;
    const t = setInterval(() => bump((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [pending, item && item.id, count]);

  slE(() => {
    for (let n = 1; n <= count; n++) {
      const at = slOpenAt(ctx, item, n);
      if (at > 0 && slOpenedAt(ctx, item, n) == null && Date.now() >= at) {
        const k = item.id + ':' + n;
        ctx.setState((s) => ({ opened: { ...(s.opened || {}), [k]: Date.now() } }));
      }
    }
  });

  const rounds = [];
  for (let n = 1; n <= count; n++) {
    rounds.push({
      n,
      open: slIsOpen(ctx, item, n),
      openAt: slOpenAt(ctx, item, n),
      openedAt: slOpenedAt(ctx, item, n),
      voices: slVoices(ctx, item, n),
    });
  }
  return rounds;
};

// ============================================================================
// Shared parts.
// ============================================================================
const SL_META = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
  color: 'var(--color-fg-3)', whiteSpace: 'nowrap',
};
const SL_BODY = {
  fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.55,
  color: 'var(--color-fg-1)', textWrap: 'pretty', minWidth: 0,
};
const SL_TEXTAREA = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
  fontSize: 16, lineHeight: 1.5, color: 'var(--color-fg-1)',
  padding: '10px 12px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
  resize: 'vertical', minHeight: 66,
};

// The veil itself: three bars, always three, so the band says that words are
// there and nothing about how many people put them there.
const SL_BARS = ['92%', '74%', '52%'];
const SlVeil = ({ height = 9 }) => (
  <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    {SL_BARS.map((w, i) => (
      <span key={i} style={{
        display: 'block', width: w, height, borderRadius: 'var(--radius-pill)',
        background: 'var(--color-border-1)', opacity: 0.85 - i * 0.12,
      }} />
    ))}
  </div>
);

const SlSealCaption = ({ left }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-fg-3)' }}>
    <Icon name="lock" size={13} />
    <span style={SL_META}>Opens in {left}</span>
  </div>
);

const SlRoundLabel = ({ round, item }) => {
  const when = round.open ? slWhen(round.openedAt || item.at) : null;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
      <span style={{ ...SL_META, color: 'var(--color-fg-2)' }}>{SL_ORDINAL[round.n] || 'Opening'}</span>
      {when && <span style={SL_META}>{when}</span>}
    </div>
  );
};

// A voice, with the swell shape the opening revealed beside the name.
const SlVoice = ({ ctx, item, voice, clamp }) => {
  const rx = slSwellOf(ctx, item, voice.by);
  const body = clamp
    ? { ...SL_BODY, fontSize: 14.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
    : SL_BODY;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0 }}>
      <Avatar name={voice.by === 'you' ? ctx.me.realName : ctx.nameOf(voice.by)} size={26} accent={voice.by === 'you'} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-2)' }}>
            {ctx.nameOf(voice.by)}
          </span>
          {rx && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span aria-hidden="true" style={{ fontSize: 12.5, lineHeight: 1 }}>{rx.glyph}</span>
              <span style={SL_META}>{SL_DEPTH_WORDS[slDepthOf(rx.intensity) - 1]}</span>
            </span>
          )}
        </div>
        <div style={body}>{voice.text}</div>
      </div>
    </div>
  );
};

// ============================================================================
// The card face — the veil, and after an opening the settled block. Sits
// between the item and the person who put it there, which is where the text
// would have been. Tapping it does what the card's own state allows: an unread
// card goes to the reading, which is what casts your thought into the seal; a
// read card opens what is there.
// ============================================================================
const SlCard = ({ ctx, item }) => {
  const rounds = slUseWindows(ctx, item);
  const live = rounds.filter((r) => r.voices.length > 0 || !r.open);
  if (!live.length) return null;
  // Nothing cast yet and nothing to hide — a bare card is a legitimate face.
  if (live.every((r) => r.voices.length === 0)) return null;

  const go = () => (item.read ? ctx.openRespond(item) : ctx.openSwell(item));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '12px 0 2px' }}>
      {live.map((round) => (
        <button key={round.n} type="button" onClick={go} style={{
          appearance: 'none', textAlign: 'left', cursor: 'pointer', width: '100%',
          background: round.open ? 'transparent' : 'var(--color-surface-sunken)',
          border: '1px solid ' + (round.open ? 'var(--color-border-2)' : 'var(--color-border-1)'),
          borderRadius: 'var(--radius-md)', padding: round.open ? '10px 12px 12px' : '13px 12px 11px',
          display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0,
        }}>
          {round.open ? (
            <React.Fragment>
              {rounds.length > 1 && <SlRoundLabel round={round} item={item} />}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 11, maxHeight: 178, overflow: 'hidden' }}>
                {round.voices.slice(0, 3).map((v) => (
                  <SlVoice key={v.key} ctx={ctx} item={item} voice={v} clamp />
                ))}
                {round.voices.length > 3 && (
                  <span aria-hidden="true" style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0), var(--color-surface))',
                  }} />
                )}
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {rounds.length > 1 && <SlRoundLabel round={round} item={item} />}
              <SlVeil />
              <SlSealCaption left={slLeft(round.openAt - Date.now())} />
            </React.Fragment>
          )}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. The sharer writes into the same seal as everyone else, so
// the field says so and the veil sits under it as the thing that happens next.
// ============================================================================
const SlCompose = ({ draft, setDraft, submit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
    <textarea rows={3} value={draft.text} placeholder="Say what you make of it."
      onChange={(e) => setDraft({ ...draft, text: e.target.value })} style={SL_TEXTAREA} />
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 9,
      background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-md)', padding: '12px 12px 10px',
    }}>
      <SlVeil />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-fg-3)' }}>
        <Icon name="lock" size={13} />
        <span style={SL_META}>Opens with everyone else's</span>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
      <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
      <Button variant="primary" onClick={() => submit(draft.text.trim() ? { text: draft.text.trim(), register: 'gist' } : null)}>Seal it</Button>
    </div>
  </div>
);

// ============================================================================
// Beats 2 and 3 — one surface. What the card holds, in whatever state it is in:
// a running seal you cast into, an opening you read all at once, or both bands
// stacked. Landing arrives at the moment the Swell commits, so the reaction is
// shown going into the seal with the words — one thing, not two.
// ============================================================================
const SlOpening = ({ ctx, item, glyph, close }) => {
  const rounds = slUseWindows(ctx, item);
  const [draft, setDraft] = slS('');
  const last = rounds[rounds.length - 1];
  const sealed = last && !last.open ? last : null;
  const mine = sealed ? slMine(ctx, item, sealed.n) : [];
  const canStartNext = !sealed && rounds.length < 2 && item.read;

  const cast = (n, register) => {
    const t = draft.trim();
    if (!t) return;
    ctx.actions.respond(item.id, { text: t, register, round: n });
    setDraft('');
  };
  const startNext = () => {
    const t = draft.trim();
    if (!t) return;
    ctx.setState((s) => ({
      rounds: { ...(s.rounds || {}), [item.id]: 2 },
      openAt: { ...(s.openAt || {}), [item.id + ':2']: Date.now() + SL_NEXT_WINDOW },
    }));
    ctx.actions.respond(item.id, { text: t, register: 'takeaway', round: 2 });
    setDraft('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ paddingRight: 34 }}>
        <div style={{ ...SL_META, marginBottom: 3 }}>{item.source || 'Link'}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
          {item.title || item.url.replace(/^https?:\/\//, '')}
        </div>
      </div>

      {rounds.map((round) => (
        <div key={round.n} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {rounds.length > 1 && <SlRoundLabel round={round} item={item} />}
          {round.open ? (
            round.voices.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {round.voices.map((v) => <SlVoice key={v.key} ctx={ctx} item={item} voice={v} />)}
              </div>
            ) : null
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 11,
              background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
              borderRadius: 'var(--radius-md)', padding: '13px 12px 11px',
            }}>
              <SlVeil />
              <SlSealCaption left={slLeft(round.openAt - Date.now())} />
              {(glyph || mine.length > 0) && (
                <div style={{ borderTop: '1px solid var(--color-border-1)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...SL_META, color: 'var(--color-fg-2)' }}>Yours</span>
                    {glyph && <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>{glyph}</span>}
                  </div>
                  {mine.map((v) => <div key={v.key} style={SL_BODY}>{v.text}</div>)}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {sealed && !mine.length && item.read && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <textarea rows={3} value={draft} placeholder="Say what you make of it."
            onChange={(e) => setDraft(e.target.value)} style={SL_TEXTAREA} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <Button variant="secondary" onClick={close}>Say nothing</Button>
            <Button variant="primary" onClick={() => { cast(sealed.n, 'reflection'); }}>Seal it</Button>
          </div>
        </div>
      )}

      {sealed && !item.read && (
        <div><Button variant="secondary" onClick={() => { close(); ctx.openSwell(item); }}>Read it</Button></div>
      )}

      {canStartNext && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border-2)', paddingTop: 'var(--space-4)' }}>
          <textarea rows={3} value={draft} placeholder="Say what you carry away."
            onChange={(e) => setDraft(e.target.value)} style={SL_TEXTAREA} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={startNext}>Seal another round</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Beat 4 — continue. The rounds of one card, down the page, each labelled by
// its opening. A card that has opened once accepts one further seal; a card
// that has two rounds accepts nothing more, and the page shows that by having
// nothing left to offer.
// ============================================================================
const SlRounds = ({ ctx }) => {
  const focus = ctx.itemById(ctx.state.focus) || ctx.readItems[0] || ctx.items[0] || null;
  const [draft, setDraft] = slS('');
  const rounds = slUseWindows(ctx, focus);
  if (!focus) return null;
  const capped = rounds.length >= 2;

  const seal = () => {
    const t = draft.trim();
    if (!t) return;
    ctx.setState((s) => ({
      rounds: { ...(s.rounds || {}), [focus.id]: 2 },
      openAt: { ...(s.openAt || {}), [focus.id + ':2']: Date.now() + SL_NEXT_WINDOW },
    }));
    ctx.actions.respond(focus.id, { text: t, register: 'takeaway', round: 2 });
    setDraft('');
  };

  return (
    <div style={{
      maxWidth: 'var(--max-feed-width)', margin: '0 auto',
      padding: ctx.isMobile ? '18px 16px 32px' : '28px 24px 44px',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', width: '100%', boxSizing: 'border-box',
    }}>
      <div>
        <div style={{ ...SL_META, marginBottom: 3 }}>{focus.source || 'Link'}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
          {focus.title || focus.url.replace(/^https?:\/\//, '')}
        </div>
      </div>

      {rounds.map((round) => (
        <div key={round.n} style={{
          display: 'flex', flexDirection: 'column', gap: 12,
          borderLeft: '2px solid var(--color-border-1)', paddingLeft: 'var(--space-4)',
        }}>
          <SlRoundLabel round={round} item={focus} />
          {round.open ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {round.voices.map((v) => <SlVoice key={v.key} ctx={ctx} item={focus} voice={v} />)}
            </div>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 11,
              background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
              borderRadius: 'var(--radius-md)', padding: '13px 12px 11px',
            }}>
              <SlVeil />
              <SlSealCaption left={slLeft(round.openAt - Date.now())} />
              {slMine(ctx, focus, round.n).map((v) => (
                <div key={v.key} style={{ borderTop: '1px solid var(--color-border-1)', paddingTop: 10 }}>
                  <div style={{ ...SL_META, color: 'var(--color-fg-2)', marginBottom: 5 }}>Yours</div>
                  <div style={SL_BODY}>{v.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {!capped && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border-2)', paddingTop: 'var(--space-4)' }}>
          <textarea rows={3} value={draft} placeholder="Say what you carry away."
            onChange={(e) => setDraft(e.target.value)} style={SL_TEXTAREA} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={seal}>Seal another round</Button>
          </div>
        </div>
      )}
    </div>
  );
};

PGD7.register({
  id: 'seal',
  name: 'The Seal',
  // The veil sits between the item and the person who shared it — where the
  // text would be. It is a mark, never a line: it carries no words and no count.
  face: { slot: 'title-attribution' },
  initialState: {
    opened: {}, openAt: {}, rounds: {}, focus: null,
    // The one card already carrying a second seal, so a running round is
    // inhabited rather than empty. Sealed, so none of it is readable yet.
    seedR2: {
      r4: [
        { id: 'r4s1', by: 'ada', text: 'Second time through I stopped skipping the cetology chapters and they turned out to be the book.' },
        { id: 'r4s2', by: 'priya', text: 'Got as far as the try-works. Reporting back in a fortnight.' },
      ],
    },
  },
  Card: SlCard,
  Compose: SlCompose,
  Landing: SlOpening,
  Respond: SlOpening,
  Continue: SlRounds,
  continueTitle: 'Rounds',
  beats: {
    // Land on the card whose window is about to elapse: the Swell commits into
    // a running seal, and the opening arrives while you are still standing there.
    land: (api) => {
      const running = (i) => !slIsOpen(api, i, 1) && slVoices(api, i, 1).length > 0;
      const a1 = api.itemById('a1');
      const t = (a1 && !a1.read && running(a1))
        ? a1
        : (api.activeItems.find(running) || api.firstUnread());
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A card that has opened once and is already sealed again: one band you can
    // read, one you cannot, and your own words go into the one you cannot.
    respond: (api) => {
      const t = api.itemById('r4') || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
    // A card everyone has spoken on, opened, with its second seal still unspent.
    continue: (api) => {
      const t = api.itemById('r1') || api.firstRead();
      api.setState({ focus: t ? t.id : null });
      api.openContinue();
    },
  },
});
