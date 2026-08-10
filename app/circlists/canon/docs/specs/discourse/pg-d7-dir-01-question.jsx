// ============================================================================
// Discourse v7 — direction 01, The Question.
// ----------------------------------------------------------------------------
// The only authored text in the product is interrogative. A sharer attaches a
// question with the link; readers answer it in one line; anyone may ask the
// next question, which puts the card back in Active for everyone who read it.
//
// The inversion is the whole card treatment: the ask sits above the item's own
// title at title scale, and the title demotes to a source line. You read what is
// being asked, then what it is about. The question carries no attribution of its
// own — the sharer's name already sits on the card, and attaching it would make
// the ask a verdict rather than an invitation.
//
// Only the live question is ever in the feed. Asking the next one files the
// previous question and its answers behind the app's own EARLIER waterline,
// inside the door.
// ============================================================================

const { PGD7, Button, Field, FeedDivider, SwellDoor } = window;
const { useState: q1S, useEffect: q1E, useRef: q1R } = React;

// ---- The ask -----------------------------------------------------------------
// The terminal mark is the product's, not the writer's: whatever is typed lands
// as a question. That is the genre enforced by shape rather than by a rule shown
// to anyone.
const q1Mark = (t) => {
  const s = String(t == null ? '' : t).trim().replace(/[?\s]+$/, '');
  return s ? s + '?' : '';
};

// The circle's questions. The shared seed carries declarative thoughts, which
// this direction does not admit — so the asks live in private state (CONTRACT
// §6), keyed by item. Two items are deliberately left unasked: a2 and r3, the
// seed's no-thought pair. A card nobody has asked about is a real state and it
// gets the open invitation, never a placeholder.
const Q1_SEED = {
  a1: { text: 'Does any of this survive a team of four?', at: Date.now() },
  a3: { text: 'Which stage would you put first, if you had to pick one?', at: Date.now() },
  a4: { text: 'Is predictable failure worth a slower index?', at: Date.now() },
  a5: { text: 'Where have you shipped easy and called it simple?', at: Date.now() },
  a6: { text: 'What do you actually alert on?', at: Date.now() },
  a7: { text: 'Which book are you avoiding rereading?', at: Date.now() },
  r1: { text: 'Who should own closing a channel?', at: Date.now() },
  r2: { text: 'What did you stop guessing at after this?', at: Date.now() },
  r4: { text: 'Is forty pages enough to recommend something?', at: Date.now() },
};

// The live question, or null. An asked question wins; otherwise the thought
// attached at share, which in this direction was written as one.
const q1Live = (ctx, item) => {
  const a = ((ctx.state && ctx.state.asked) || {})[item.id];
  if (a && a.text) return a.text;
  const t = item.thought && item.thought.text ? q1Mark(item.thought.text) : '';
  return t || null;
};

// Rounds. `rounds[id]` is the list of questions already asked and closed, each
// holding the index its answers ran up to. Everything past the last one belongs
// to the live question.
const q1Rounds = (ctx, item) => ((ctx.state && ctx.state.rounds) || {})[item.id] || [];
const q1LiveFrom = (ctx, item) => {
  const r = q1Rounds(ctx, item);
  return r.length ? r[r.length - 1].upto : 0;
};
const q1LiveAnswers = (ctx, item) => (item.responses || []).slice(q1LiveFrom(ctx, item));
const q1Earlier = (ctx, item) => {
  let from = 0;
  return q1Rounds(ctx, item).map((r) => {
    const block = { q: r.q, answers: (item.responses || []).slice(from, r.upto) };
    from = r.upto;
    return block;
  });
};
const q1Answered = (ctx, item) => q1LiveAnswers(ctx, item).some((r) => r.by === 'you');

// The Swell answers how it landed; the question answers what you make of it.
// Two axes of one subject — so an answer carries the mark its author gave.
const q1GlyphOf = (ctx, item, by) => {
  const name = by === 'you' ? 'You' : ctx.nameOf(by);
  const hit = (item.reactions || []).find((r) => r.name === name && !r.skipped);
  return hit ? hit.glyph : null;
};

// Asking. The previous question is filed with its answers, the new one goes
// live, and a card that had been read returns to Active for whoever read it.
const q1Ask = (ctx, item, text) => {
  const asked = q1Mark(text);
  if (!asked) return;
  const prev = q1Live(ctx, item);
  const upto = (item.responses || []).length;
  ctx.setState((s) => {
    const rounds = { ...(s.rounds || {}) };
    if (prev) rounds[item.id] = [...(rounds[item.id] || []), { q: prev, upto }];
    return { rounds, asked: { ...(s.asked || {}), [item.id]: { text: asked, at: Date.now() } } };
  });
  if (item.read) ctx.actions.setUnread(item);
};

// ============================================================================
// Shared parts.
// ============================================================================

// ---- The eyebrow. The app's own review header register (mono 11, tracked). ---
const q1EyebrowStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
  color: 'var(--color-fg-3)', marginBottom: 6,
};
const Q1Eyebrow = ({ children }) => <div style={q1EyebrowStyle}>{children}</div>;

// ---- The question, at the scale it is read at everywhere off the card. -------
const q1QuestionStyle = {
  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 19, lineHeight: 1.3,
  letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty', margin: 0,
};

// ---- One answer. Name, the mark its author gave, then the line. --------------
const q1AnswerStyles = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 3 },
  head: { display: 'flex', alignItems: 'center', gap: 7 },
  who: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5,
    letterSpacing: '0.02em', color: 'var(--color-fg-3)',
  },
  glyph: { fontSize: 13, lineHeight: 1 },
  line: {
    fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5,
    color: 'var(--color-fg-1)', textWrap: 'pretty',
  },
};
const Q1Answer = ({ ctx, item, r }) => {
  const glyph = q1GlyphOf(ctx, item, r.by);
  return (
    <div style={q1AnswerStyles.wrap}>
      <div style={q1AnswerStyles.head}>
        <span style={q1AnswerStyles.who}>{r.by === 'you' ? 'You' : ctx.nameOf(r.by)}</span>
        {glyph && <span style={q1AnswerStyles.glyph} aria-hidden="true">{glyph}</span>}
      </div>
      <div style={q1AnswerStyles.line}>{r.text}</div>
    </div>
  );
};

const q1AnswersStyle = { display: 'flex', flexDirection: 'column', gap: 16 };
const Q1Answers = ({ ctx, item, list }) => (
  list.length
    ? <div style={q1AnswersStyle}>{list.map((r) => <Q1Answer key={r.id} ctx={ctx} item={item} r={r} />)}</div>
    : null
);

// ---- The ask composer. The app's own Field; the mark is the product's. -------
const q1ComposerStyles = {
  wrap: { display: 'flex', flexDirection: 'column' },
  suffix: {
    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 18, lineHeight: 1,
    pointerEvents: 'none',
  },
  row: { display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' },
  lead: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  leadGlyph: { fontSize: 17, lineHeight: 1 },
  leadWho: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5,
    letterSpacing: '0.02em', color: 'var(--color-fg-3)',
  },
};

// One writing surface, two registers. `ask` puts the terminal mark in the box
// and calls the act asking; without it the same box takes a one-line answer.
const Q1Composer = ({ name, label, ariaLabel, placeholder, ask, submitLabel, onSubmit, onSkip, skipLabel, glyph, autoFocus }) => {
  const [v, setV] = q1S('');
  const ref = q1R(null);
  q1E(() => {
    // GOTCHA #1 — a sheet mounts off-screen, so focus must never scroll.
    if (autoFocus && ref.current) ref.current.focus({ preventScroll: true });
  }, [autoFocus]);
  const send = () => { if (v.trim()) onSubmit(v.trim()); };
  return (
    <div style={q1ComposerStyles.wrap}>
      {glyph && (
        <div style={q1ComposerStyles.lead}>
          <span style={q1ComposerStyles.leadGlyph} aria-hidden="true">{glyph}</span>
          <span style={q1ComposerStyles.leadWho}>You</span>
        </div>
      )}
      <Field
        ref={ref} name={name} label={label} aria-label={label ? undefined : ariaLabel}
        placeholder={placeholder} value={v} autoComplete="off"
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
        style={ask ? { paddingRight: 34 } : null}
        suffix={ask ? (
          <span style={{ ...q1ComposerStyles.suffix, color: v.trim() ? 'var(--color-fg-1)' : 'var(--color-fg-3)' }} aria-hidden="true">?</span>
        ) : null}
      />
      <div style={q1ComposerStyles.row}>
        {onSkip && <Button variant="secondary" onClick={onSkip}>{skipLabel || 'Skip'}</Button>}
        <Button variant="primary" disabled={!v.trim()} onClick={send}>{submitLabel}</Button>
      </div>
    </div>
  );
};

// ============================================================================
// The card face — the ask outranks the item.
// ----------------------------------------------------------------------------
// Slot: above-title, with the item's own headline demoted to a source line by
// the rig. Ranged left, no quotation marks, no attribution. Where nothing has
// been asked, the slot holds the open invitation instead — the same act every
// member may perform, reachable from the feed.
//
// THE ROUTE. On Active the question is text: the tick beneath it is already the
// way in, and nothing else should compete with it. On Read the tick's slot has
// gone to the Reaction door, so the question itself becomes the control — tap it
// and the rounds open, live question first, earlier rounds filed beneath, the
// ask at the foot. The reactions are not left behind: that surface carries the
// shipped door at its head, so the scatter and the roster are one tap further in
// rather than somewhere else entirely.
// ============================================================================
const q1CardStyles = {
  q: {
    fontFamily: 'var(--font-sans)', fontWeight: 600,
    fontSize: 'clamp(16.5px, 2.7cqi, 19px)', lineHeight: 1.3,
    letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
    textWrap: 'pretty', margin: '0 0 var(--space-3)',
  },
  ask: {
    display: 'flex', alignItems: 'center', gap: 9, minHeight: 44,
    width: '100%', textAlign: 'left', background: 'transparent', border: 0,
    padding: 0, margin: '0 0 var(--space-2)', cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 500,
    fontSize: 'clamp(15px, 2.4cqi, 17px)', lineHeight: 1.3,
    letterSpacing: '-0.01em', color: 'var(--color-fg-3)',
  },
  // The same question, made the control. Type is identical to the resting face —
  // a question you can open must not read as a different kind of question.
  qBtn: {
    display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
    background: 'transparent', border: 0, padding: 0,
    margin: '0 0 var(--space-3)', minHeight: 44,
  },
  askMark: { fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--color-fg-3)', flexShrink: 0 },
  sheet: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  sheetTitle: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.35,
    color: 'var(--color-fg-2)', textWrap: 'pretty',
  },
};

const Q1Card = ({ ctx, item, tab }) => {
  const [asking, setAsking] = q1S(false);
  const q = q1Live(ctx, item);
  const read = tab === 'read';

  // Read: the question is the door to its own rounds.
  if (read) {
    return (
      <button type="button" style={q1CardStyles.qBtn} onClick={() => ctx.openRespond(item)}>
        {q
          ? <span style={{ ...q1CardStyles.q, display: 'block', margin: 0 }}>{q}</span>
          : (
            <span style={{ ...q1CardStyles.ask, margin: 0 }}>
              <span style={q1CardStyles.askMark} aria-hidden="true">?</span>
              <span>Ask the circle</span>
            </span>
          )}
      </button>
    );
  }

  if (q) return <div style={q1CardStyles.q}>{q}</div>;

  return (
    <React.Fragment>
      <button style={q1CardStyles.ask} onClick={() => setAsking(true)}>
        <span style={q1CardStyles.askMark} aria-hidden="true">?</span>
        <span>Ask the circle</span>
      </button>
      {asking && (
        <PGD7.Sheet label="Ask the circle" onClose={() => setAsking(false)}>
          {({ close }) => (
            <div style={q1CardStyles.sheet}>
              <div>
                <Q1Eyebrow>the question</Q1Eyebrow>
                <div style={q1CardStyles.sheetTitle}>{item.title || item.url.replace(/^https?:\/\//, '')}</div>
              </div>
              <Q1Composer
                name={'q1-card-' + item.id} label="Ask the circle" placeholder="What do you want to know" ask autoFocus
                submitLabel="Ask"
                onSubmit={(text) => { q1Ask(ctx, item, text); close(); ctx.setTab('active'); }}
              />
            </div>
          )}
        </PGD7.Sheet>
      )}
    </React.Fragment>
  );
};

// ============================================================================
// Beat 1 — attach. Step two of the add flow: the question asked alongside the
// link. Skipping is a real state; the card lands carrying the invitation.
// ============================================================================
const Q1Compose = ({ submit }) => (
  <Q1Composer
    name="q1-attach" label="Ask the circle" placeholder="What do you want to know" ask autoFocus
    submitLabel="Ask" skipLabel="Skip" onSkip={() => submit(null)}
    onSubmit={(text) => submit({ text: q1Mark(text), register: 'gist' })}
  />
);

// ============================================================================
// Beat 2 — land. The Swell commits and its reveal gives way to the ask: the
// question, what the circle has answered, and one line back.
// ============================================================================
const q1LandingStyles = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
  head: { paddingRight: 34 },
};

const Q1Landing = ({ ctx, item, glyph, close }) => {
  const q = q1Live(ctx, item);
  const answers = q1LiveAnswers(ctx, item);
  const mine = q1Answered(ctx, item);

  // Nothing has been asked. Reading is where the first question comes from.
  if (!q) {
    return (
      <div style={q1LandingStyles.wrap}>
        <div style={q1LandingStyles.head}>
          <Q1Eyebrow>the question</Q1Eyebrow>
          <p style={q1QuestionStyle}>{item.title || item.url.replace(/^https?:\/\//, '')}</p>
        </div>
        <Q1Composer
          name={'q1-land-ask-' + item.id} label="Ask the circle" placeholder="What do you want to know" ask
          submitLabel="Ask" onSubmit={(text) => { q1Ask(ctx, item, text); close(); }}
        />
      </div>
    );
  }

  return (
    <div style={q1LandingStyles.wrap}>
      <div style={q1LandingStyles.head}>
        <Q1Eyebrow>the question</Q1Eyebrow>
        <p style={q1QuestionStyle}>{q}</p>
      </div>
      <Q1Answers ctx={ctx} item={item} list={answers} />
      {!mine && (
        <Q1Composer
          name={'q1-land-' + item.id} label="Your answer" placeholder="One line" glyph={glyph}
          submitLabel="Answer"
          onSubmit={(text) => { ctx.actions.respond(item.id, { text, register: 'gist' }); close(); }}
        />
      )}
    </div>
  );
};

// ============================================================================
// Beat 3 — respond. The door on a Read card: the live question and its answers,
// the earlier rounds filed behind the app's own waterline, and the move that
// carries the card on — asking the next question.
// ============================================================================
const q1RespondStyles = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
  head: { paddingRight: 34 },
  // The eyebrow on the left, the shipped Reaction door on the right: how it
  // landed and what is being asked are two axes of one subject, so they share a
  // line rather than living on two surfaces.
  headRow: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, marginBottom: 2 },
  earlier: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  roundQ: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.35,
    letterSpacing: '-0.01em', color: 'var(--color-fg-2)', margin: '0 0 10px', textWrap: 'pretty',
  },
  round: { display: 'flex', flexDirection: 'column', gap: 12 },
  rule: { height: 1, background: 'var(--color-border-2)', border: 0, margin: 0 },
};

const Q1Respond = ({ ctx, item, close }) => {
  const [asking, setAsking] = q1S(false);
  const q = q1Live(ctx, item);
  const answers = q1LiveAnswers(ctx, item);
  const earlier = q1Earlier(ctx, item);
  const mine = q1Answered(ctx, item);

  if (!q) {
    return (
      <div style={q1RespondStyles.wrap}>
        <div style={q1RespondStyles.head}>
          <div style={q1RespondStyles.headRow}>
            <span style={{ flex: 1, minWidth: 0 }}><Q1Eyebrow>the question</Q1Eyebrow></span>
            <span style={{ flexShrink: 0, marginRight: -10 }}><SwellDoor item={item} /></span>
          </div>
          <p style={q1QuestionStyle}>{item.title || item.url.replace(/^https?:\/\//, '')}</p>
        </div>
        <Q1Composer
          name={'q1-resp-ask-' + item.id} label="Ask the circle" placeholder="What do you want to know" ask
          submitLabel="Ask" onSubmit={(text) => { q1Ask(ctx, item, text); close(); ctx.setTab('active'); }}
        />
      </div>
    );
  }

  return (
    <div style={q1RespondStyles.wrap}>
      <div style={q1RespondStyles.head}>
        <div style={q1RespondStyles.headRow}>
          <span style={{ flex: 1, minWidth: 0 }}><Q1Eyebrow>the question</Q1Eyebrow></span>
          <span style={{ flexShrink: 0, marginRight: -10 }}><SwellDoor item={item} /></span>
        </div>
        <p style={q1QuestionStyle}>{q}</p>
      </div>

      <Q1Answers ctx={ctx} item={item} list={answers} />

      {!mine && (
        <Q1Composer
          name={'q1-resp-' + item.id} label="Your answer" placeholder="One line"
          glyph={q1GlyphOf(ctx, item, 'you')} submitLabel="Answer"
          onSubmit={(text) => ctx.actions.respond(item.id, { text, register: 'gist' })}
        />
      )}

      {asking ? (
        <Q1Composer
          name={'q1-next-' + item.id} label="Ask the next question" placeholder="What do you want to know" ask
          submitLabel="Ask" skipLabel="Cancel" onSkip={() => setAsking(false)}
          onSubmit={(text) => { q1Ask(ctx, item, text); close(); ctx.setTab('active'); }}
        />
      ) : (
        <div><Button variant="secondary" onClick={() => setAsking(true)}>Ask the next question</Button></div>
      )}

      {earlier.length > 0 && (
        <div style={q1RespondStyles.earlier}>
          <FeedDivider />
          {earlier.map((r, i) => (
            <div key={i} style={q1RespondStyles.round}>
              <p style={q1RespondStyles.roundQ}>{r.q}</p>
              <Q1Answers ctx={ctx} item={item} list={r.answers} />
              {i < earlier.length - 1 && <hr style={q1RespondStyles.rule} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Beat 4 — continue. Asking again is the whole continuation mechanism: the
// question changes and the card walks back into Active for everyone who read
// it. No new place, no column, no marked-for-continuation list.
// ============================================================================
const q1ContinueStyles = {
  page: {
    maxWidth: 'var(--max-feed-width)', margin: '0 auto',
    padding: '24px 20px 40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 2 },
  row: (on) => ({
    position: 'relative', textAlign: 'left', cursor: 'pointer', width: '100%',
    background: on ? 'var(--color-surface)' : 'transparent',
    border: '1px solid ' + (on ? 'var(--color-border-1)' : 'transparent'),
    boxShadow: on ? 'var(--shadow-raised)' : 'none',
    borderRadius: 'var(--radius-md)', padding: '10px 12px 10px 14px', minHeight: 44,
    display: 'flex', flexDirection: 'column', gap: 3,
  }),
  bar: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 3, background: 'var(--color-accent)' },
  rowTitle: {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.35,
    color: 'var(--color-fg-3)', textWrap: 'pretty',
  },
  rowQ: {
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.35,
    letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty',
  },
};

const Q1Continue = ({ ctx }) => {
  const pool = ctx.readItems.length ? ctx.readItems : ctx.items;
  const [sel, setSel] = q1S(pool.length ? pool[0].id : null);
  const item = pool.find((i) => i.id === sel) || pool[0] || null;
  if (!item) return null;
  const q = q1Live(ctx, item);

  return (
    <div style={q1ContinueStyles.page}>
      <div>
        <Q1Eyebrow>the circle has read</Q1Eyebrow>
        <div style={q1ContinueStyles.list}>
          {pool.map((it) => {
            const on = it.id === item.id;
            const liveQ = q1Live(ctx, it);
            return (
              <button key={it.id} style={q1ContinueStyles.row(on)} onClick={() => setSel(it.id)} aria-pressed={on}>
                {on && <span style={q1ContinueStyles.bar} />}
                <span style={q1ContinueStyles.rowTitle}>{it.title || it.url.replace(/^https?:\/\//, '')}</span>
                {liveQ && <span style={q1ContinueStyles.rowQ}>{liveQ}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Q1Eyebrow>{q ? 'the next question' : 'the first question'}</Q1Eyebrow>
        <Q1Composer
          key={item.id}
          name={'q1-continue-' + item.id} ariaLabel="Ask the circle" placeholder="What do you want to know" ask
          submitLabel="Ask"
          onSubmit={(text) => {
            q1Ask(ctx, item, text);
            ctx.setRoute('feed');
            ctx.setTab('active');
          }}
        />
      </div>
    </div>
  );
};

// ============================================================================
PGD7.register({
  id: 'question',
  name: 'The Question',
  face: { slot: 'above-title', demoteTitle: true },
  initialState: { asked: Q1_SEED, rounds: {} },
  Card: Q1Card,
  Compose: Q1Compose,
  Landing: Q1Landing,
  Respond: Q1Respond,
  Continue: Q1Continue,
  continueTitle: 'Ask again',
  beats: {
    // Land on a card that already carries a question, so the ask is what the
    // Swell gives way to.
    land: (api) => {
      const t = api.activeItems.find((i) => q1Live(api, i)) || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // Respond on a card whose question the circle has already answered, so the
    // reader arrives into a live exchange rather than an empty one.
    respond: (api) => {
      const t = api.readItems.find((i) => q1Live(api, i) && q1LiveAnswers(api, i).length)
        || api.readItems.find((i) => q1Live(api, i))
        || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
  },
});
