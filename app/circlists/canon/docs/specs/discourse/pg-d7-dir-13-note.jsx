// ============================================================================
// Discourse v7 — direction 13, The Note.
// ----------------------------------------------------------------------------
// The sharer's note is visible before you read, and it is the only thing that
// is. A note is context for WHETHER TO READ, so it is public from the moment of
// sharing; everything the circle says after reading stays behind the door.
// Reveal-on-read protects the conversation, never the invitation.
//
// THE CARD FACE — the description slot, where the source's own description
// would sit, because that is the product logic for it. The note is AUTHORED
// PROSE CARRYING A NAME: a byline above the line, the name and the kind of
// thing being said (gist · trust · reflection · takeaway), then the prose. The
// register is on the card because the note is the only authored thing there and
// its kind changes how it should be read — a vouch is not a summary.
//
// ON READ THE FACE IS A PAIR. The before-note keeps its place and the
// after-note stacks beneath it, quieter: smaller, one step back in the ink.
// Before and after, one above the other, both named. A card carries two lines
// of authored text in its life, ever.
//
// CONTINUATION IS THE AFTER-NOTE AND ONLY THAT. One per item, written once,
// permanent — and the field is gone the moment it exists. There is no second
// pass, no amendment, no thread.
//
// THE ROUTE — every layer reachable without the driver.
//   contribution  the FAB, the app's own add flow, then the note and its kind.
//   reaction      untouched: mark read on any Active card.
//   reading       the Swell hands over to the note you already read, then what
//                 the circle said after reading, then your own line.
//   conversation  the door on any Read card opens that same surface.
//   continuation  the after-note, from the door's own footer on a read item
//                 that has none — and from the band above the Read tab, which
//                 opens the page holding every item still open to one.
// ============================================================================

const NtPGD7 = window.PGD7;
const NtButton = window.Button;
const NtField = window.Field;
const NtDivider = window.FeedDivider;
const { useState: ntS, useRef: ntR, useEffect: ntE } = React;

// ---- Type registers ---------------------------------------------------------
// The byline sits in the app's own review-header register (mono 11, tracked);
// the note itself is body prose. Nothing here is a new type scale.
const NT_BYLINE = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
  lineHeight: 1.5, color: 'var(--color-fg-3)',
  display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap',
};
const NT_PROSE = {
  fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)',
  color: 'var(--color-fg-1)', textWrap: 'pretty', margin: 0,
};
const NT_TITLE = {
  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3,
  letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty',
};

const ntWho = (ctx, by) => (by === 'you' ? 'You' : ctx.nameOf(by));
const ntTitleOf = (item) => item.title || item.url.replace(/^https?:\/\//, '');
const ntSourceOf = (item) => item.source || window.pgd7Host(item.url);

// ---- The two notes an item can carry ----------------------------------------
// The before-note is the sharer's thought, which in this direction IS the note.
// The after-note is private to the direction: what the circle came to, written
// once, kept in state keyed by item (CONTRACT §6).
const ntBefore = (item) => (item.thought && item.thought.text ? item.thought : null);
const ntAfter = (ctx, item) => ((ctx.state && ctx.state.after) || {})[item.id] || null;

const ntWriteAfter = (ctx, item, text, register) => {
  const t = String(text || '').trim();
  if (!t) return;
  if (ntAfter(ctx, item)) return;                 // one per item, ever
  ctx.setState((s) => ({
    after: {
      ...(s.after || {}),
      [item.id]: { text: t, register: register || 'takeaway', by: 'you', at: Date.now() },
    },
  }));
};

// The items still open to an after-note: read, and none written yet.
const ntOpenToAfter = (ctx) => ctx.items.filter((i) => i.read && !ntAfter(ctx, i));
const ntClosed = (ctx) => ctx.items.filter((i) => i.read && ntAfter(ctx, i));

// Seeded after-notes. Two read items have already arrived somewhere, so the
// pair is on the Read tab from the first look; the other two are open, which is
// what continuation acts on.
const NT_SEED_AFTER = {
  r1: { text: 'We came out of it agreeing the hard part is ownership, not scheduling. Close from the sending side.',
    register: 'takeaway', by: 'ada', at: Date.now() - 3 * 3600e3 },
  r2: { text: 'Four resolvers, and the bug is always two of them disagreeing about how long an answer stays true.',
    register: 'gist', by: 'marcus', at: Date.now() - 26 * 3600e3 },
};

// ============================================================================
// The note, rendered. One treatment, two weights.
// ----------------------------------------------------------------------------
// A rule down the left edge holds the note as an annotation on the object
// rather than a line of the object's own description. The byline is above it,
// never under it: you learn whose thought this is before you read the thought.
// ============================================================================
const NtNote = ({ who, register, text, size = 14, quiet = false, clamp = 0 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
    <div style={{ ...NT_BYLINE, opacity: quiet ? 0.85 : 1 }}>
      <span style={{ fontWeight: 500, color: quiet ? 'var(--color-fg-3)' : 'var(--color-fg-2)' }}>{who}</span>
      {register && <span aria-hidden="true">·</span>}
      {register && <span>{register}</span>}
    </div>
    <p style={{
      ...NT_PROSE, fontSize: size, lineHeight: 1.5,
      color: quiet ? 'var(--color-fg-2)' : 'var(--color-fg-1)',
      ...(clamp ? { display: '-webkit-box', WebkitLineClamp: clamp, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
    }}>{text}</p>
  </div>
);

// The rail the pair hangs off. Both notes share one rule, which is what makes
// them read as one card's authored life rather than two utterances.
const NtRail = ({ children, style }) => (
  <div style={{
    borderLeft: '2px solid var(--color-border-2)', paddingLeft: 11,
    display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, ...(style || {}),
  }}>{children}</div>
);

// ============================================================================
// The register picker. Present on the two authored surfaces and nowhere else,
// because the note is the only authored thing on the card and its kind changes
// how it should be read.
// ============================================================================
const NtRegisters = ({ value, onChange, ctx }) => (
  <div role="group" aria-label="Kind of note" style={{
    display: 'flex', gap: 2, flexWrap: 'wrap',
    background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)',
    borderRadius: 'var(--radius-md)', padding: 2,
  }}>
    {ctx.REGISTERS.map((r) => {
      const on = r === value;
      return (
        <button key={r} type="button" onClick={() => onChange(r)} aria-pressed={on}
          className="nt7-reg" style={{
            flex: '1 1 auto', minWidth: 64, minHeight: 36, padding: '7px 9px',
            background: on ? 'var(--color-surface)' : 'transparent', border: 0,
            boxShadow: on ? 'var(--shadow-raised)' : 'none', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: on ? 600 : 500, fontSize: 12.5,
            color: on ? 'var(--color-fg-1)' : 'var(--color-fg-2)',
          }}>{r}</button>
      );
    })}
  </div>
);

// ============================================================================
// Writing a note. One composer, used at share and again at the after-note.
// ============================================================================
const NtWriter = ({ ctx, value, setValue, register, setRegister, placeholder,
  submitLabel, onSubmit, onSkip, skipLabel, autoFocus }) => {
  const ref = ntR(null);
  ntE(() => {
    // GOTCHA #1 — focus inside a sheet that mounts off-screen must not scroll.
    if (autoFocus && ref.current) ref.current.focus({ preventScroll: true });
  }, [autoFocus]);
  const ready = !!String(value || '').trim();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <textarea ref={ref} rows={3} value={value} placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box',
          fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: 16,
          lineHeight: 1.5, color: 'var(--color-fg-1)',
          padding: '11px 13px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
          resize: 'vertical', minHeight: 84,
        }} />
      <NtRegisters ctx={ctx} value={register} onChange={setRegister} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {onSkip && <NtButton variant="secondary" onClick={onSkip}>{skipLabel || 'Skip'}</NtButton>}
        <NtButton variant="primary" disabled={!ready}
          onClick={() => onSubmit(String(value).trim(), register)}>{submitLabel}</NtButton>
      </div>
    </div>
  );
};

// ============================================================================
// The card face — the description slot.
// ----------------------------------------------------------------------------
// Active: the before-note alone, which is the whole claim — you decide whether
// to read on the strength of somebody's named line. Read: the pair.
// An item with nothing attached renders nothing at all. A bare card is a
// legitimate face and never carries a word about its own emptiness.
// ============================================================================
const NtCard = ({ ctx, item, tab }) => {
  const before = ntBefore(item);
  const after = tab === 'read' ? ntAfter(ctx, item) : null;
  if (!before && !after) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <NtRail>
        {before && (
          <NtNote who={ntWho(ctx, before.by)} register={before.register}
            text={before.text} size={14} clamp={4} />
        )}
        {after && (
          <NtNote who={ntWho(ctx, after.by)} register={after.register}
            text={after.text} size={13} quiet clamp={3} />
        )}
      </NtRail>
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. The note goes up with the link and is public immediately.
// Skipping is a real product state: the card lands bare.
// ============================================================================
const NtCompose = ({ ctx, draft, setDraft, submit }) => (
  <NtWriter ctx={ctx} autoFocus
    value={draft.text} setValue={(t) => setDraft({ ...draft, text: t })}
    register={draft.register || 'gist'} setRegister={(r) => setDraft({ ...draft, register: r })}
    placeholder="Say what this is, before anyone reads it."
    submitLabel="Attach" onSkip={() => submit(null)} skipLabel="Skip"
    onSubmit={(text, register) => submit({ text, register })} />
);

// ============================================================================
// One response. What the circle said AFTER reading — which is why it is here,
// behind the door, and never on the card.
// ============================================================================
const NtResponse = ({ ctx, r }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
    <div style={NT_BYLINE}>
      <span style={{ fontWeight: 500, color: 'var(--color-fg-2)' }}>{ntWho(ctx, r.by)}</span>
      <span aria-hidden="true">·</span>
      <span>{r.register}</span>
    </div>
    <p style={{ ...NT_PROSE, fontSize: 15, lineHeight: 1.5 }}>{r.text}</p>
  </div>
);

// ---- Your line back. One line, plain: the register belongs to the note. -----
const NtReply = ({ ctx, item, glyph, close }) => {
  const [v, setV] = ntS('');
  const send = () => {
    if (!v.trim()) return;
    ctx.actions.respond(item.id, { text: v.trim(), register: 'reflection' });
    setV('');
    if (close) close();
  };
  return (
    <div>
      <div style={{ ...NT_BYLINE, marginBottom: 6 }}>
        {glyph && <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>{glyph}</span>}
        <span style={{ fontWeight: 500, color: 'var(--color-fg-2)' }}>You</span>
      </div>
      <NtField name={'nt-reply-' + item.id} aria-label="Say something back"
        placeholder="One line" value={v} autoComplete="off"
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NtButton variant="primary" disabled={!v.trim()} onClick={send}>Say it</NtButton>
      </div>
    </div>
  );
};

// ---- The after-note, written where you already are --------------------------
const NtAfterField = ({ ctx, item, autoFocus, onDone }) => {
  const [v, setV] = ntS('');
  const [reg, setReg] = ntS('takeaway');
  return (
    <NtWriter ctx={ctx} autoFocus={autoFocus}
      value={v} setValue={setV} register={reg} setRegister={setReg}
      placeholder="What the circle came to."
      submitLabel="Write the after-note"
      onSubmit={(text, register) => { ntWriteAfter(ctx, item, text, register); setV(''); if (onDone) onDone(); }} />
  );
};

// ============================================================================
// Beats 2 and 3 — the note you already read, then the conversation.
// ----------------------------------------------------------------------------
// The invention of this direction is on the card, so the sheet is deliberately
// ordinary: the note at the top (where it was before you read, unchanged), what
// the circle said after reading beneath it, then your own line. Reached at
// commit from the Swell, and again from the door on any Read card.
//
// Its footer is the second route to continuation: a read item with no
// after-note yet carries the one field that writes it. Once written the pair is
// shown instead, and the field never returns.
// ============================================================================
const NtRead = ({ ctx, item, glyph, close }) => {
  const [writing, setWriting] = ntS(false);
  const before = ntBefore(item);
  const after = ntAfter(ctx, item);
  const responses = item.responses || [];
  const mine = responses.some((r) => r.by === 'you');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ paddingRight: 34, minWidth: 0 }}>
        <div style={{ ...NT_BYLINE, marginBottom: 4 }}>{ntSourceOf(item)}</div>
        <div style={NT_TITLE}>{ntTitleOf(item)}</div>
      </div>

      {before && (
        <NtRail>
          <NtNote who={ntWho(ctx, before.by)} register={before.register} text={before.text} size={15} />
        </NtRail>
      )}

      {responses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {responses.map((r) => <NtResponse key={r.id} ctx={ctx} r={r} />)}
        </div>
      )}

      {!mine && <NtReply ctx={ctx} item={item} glyph={glyph} close={null} />}

      {item.read && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <NtDivider />
          {after ? (
            <NtRail>
              <NtNote who={ntWho(ctx, after.by)} register={after.register} text={after.text} size={14} quiet />
            </NtRail>
          ) : writing ? (
            <NtAfterField ctx={ctx} item={item} autoFocus onDone={() => setWriting(false)} />
          ) : (
            <div>
              <NtButton variant="secondary" onClick={() => setWriting(true)}>Add an after-note</NtButton>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NtButton variant="tertiary" onClick={close}>Done</NtButton>
      </div>
    </div>
  );
};

// ============================================================================
// Beat 4 — continue. The after-note, as a page.
// ----------------------------------------------------------------------------
// Every read item still open to one, each showing the note it went up with and
// the single field that closes it. Writing moves the item down the page into
// the pairs, permanently: the field is gone and there is no second one.
// ============================================================================
const NtContinue = ({ ctx }) => {
  const open = ntOpenToAfter(ctx);
  const closed = ntClosed(ctx);
  const head = {
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.35,
    color: 'var(--color-fg-3)', textWrap: 'pretty',
  };
  return (
    <div style={{
      maxWidth: 'var(--max-feed-width)', margin: '0 auto',
      padding: '24px 20px 40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
    }}>
      {open.map((item) => {
        const before = ntBefore(item);
        return (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ ...NT_BYLINE, marginBottom: 4 }}>{ntSourceOf(item)}</div>
              <div style={NT_TITLE}>{ntTitleOf(item)}</div>
            </div>
            {before && (
              <NtRail>
                <NtNote who={ntWho(ctx, before.by)} register={before.register} text={before.text} size={14} />
              </NtRail>
            )}
            <NtAfterField ctx={ctx} item={item} />
          </div>
        );
      })}

      {open.length > 0 && closed.length > 0 && <NtDivider />}

      {closed.map((item) => {
        const before = ntBefore(item);
        const after = ntAfter(ctx, item);
        return (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={head}>{ntTitleOf(item)}</div>
            <NtRail>
              {before && <NtNote who={ntWho(ctx, before.by)} register={before.register} text={before.text} size={14} />}
              <NtNote who={ntWho(ctx, after.by)} register={after.register} text={after.text} size={13} quiet />
            </NtRail>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// The band above the Read tab — the page's other way in, so continuation is
// reachable without the driver. One line, and only while something is open to
// an after-note. It reports nothing and counts nothing.
// ============================================================================
const NtBanner = ({ ctx }) => {
  if (ctx.tab !== 'read') return null;
  if (!ntOpenToAfter(ctx).length) return null;
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
      <div style={{ width: '100%', maxWidth: 'var(--max-feed-width)' }}>
        <button type="button" className="nt7-band" onClick={() => ctx.openContinue()} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 44,
          background: 'transparent', border: 0, padding: '8px 0', cursor: 'pointer',
          textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13.5,
          color: 'var(--color-fg-2)',
        }}>
          <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Write an after-note
          </span>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={{
            stroke: 'currentColor', strokeWidth: 2, fill: 'none',
            strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0,
          }}><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </div>
  );
};

// ---- The states inline styles cannot carry ---------------------------------
const NT_CSS = `
.nt7-reg:focus-visible,
.nt7-band:focus-visible { outline: var(--ring-width) solid var(--color-accent); outline-offset: var(--ring-offset); border-radius: var(--radius-sm); }
.nt7-reg:hover { color: var(--color-fg-1); }
.nt7-band:hover { color: var(--color-fg-1); }
`;
if (typeof document !== 'undefined' && !document.getElementById('nt7-css')) {
  const ntStyleEl = document.createElement('style');
  ntStyleEl.id = 'nt7-css';
  ntStyleEl.textContent = NT_CSS;
  document.head.appendChild(ntStyleEl);
}

NtPGD7.register({
  id: 'note',
  name: 'The Note',
  // The description slot: where the source's own description would stand, which
  // is the product logic for a line that tells you whether to read.
  face: { slot: 'description' },
  initialState: { after: { ...NT_SEED_AFTER } },
  Card: NtCard,
  Compose: NtCompose,
  Landing: NtRead,
  Respond: NtRead,
  Continue: NtContinue,
  continueTitle: 'The after-note',
  Banner: NtBanner,
  // The shipped door keeps its geometry and its glyph huddle and opens the
  // conversation — the same surface reading hands over to.
  doorOpens: 'respond',
  beats: {
    // Land on the vouch: an item shared before reading, whose note is the only
    // reason anyone would open it.
    land: (api) => {
      const t = api.activeItems.find((i) => i.thought && i.thought.register === 'trust')
        || api.activeItems.find((i) => i.thought) || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A read item carrying a note, a full conversation behind the door, and no
    // after-note yet — so the footer holds the act that closes it.
    respond: (api) => {
      const t = api.readItems.find((i) => i.thought && (i.responses || []).length && !((api.state.after || {})[i.id]))
        || api.readItems.find((i) => i.thought) || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
  },
});
