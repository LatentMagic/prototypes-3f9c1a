// ============================================================================
// Discourse v7 — direction 12, Said the Same.
// ----------------------------------------------------------------------------
// You never write a line someone has already written. You point at theirs, and
// it becomes both of yours.
//
// THE SECOND UTTERANCE IS NOT TEXT. Speaking costs words; agreeing costs a tap.
// Behind the door, every line the circle has said stands with a control beside
// it and the faces of everyone who has pointed at it. Your own composer sits
// under them, secondary, because the intended path is to read first and point.
// Pointing dismisses the composer: once you have said the same, there is
// nothing left for you to write.
//
// THE ECHO CARRIES DEPTH. An echo is not a like, because it is not uniform. It
// carries the rung you gave on the Swell for that item — the app's own three,
// in the app's own spoken words — so one line stands DEEPLY with one member and
// A LITTLE with another, and the faces are weighted by it. A member who skipped
// the pad echoes without a rung, and that is a real state, not a gap.
//
// THE STANDING LINE. The line the most of the circle has echoed carries the
// card on the Read tab, in quotation, with its author named and the faces of
// everyone standing with it underneath. Avatars, never a count. Nothing is
// tallied anywhere in this direction.
//
// SUCCESSION BY CONSENT. A standing line is overtaken when the circle's echoes
// move — never by anybody writing over it. That is the whole distance between
// this and Palimpsest: there, one member replaces the line unilaterally; here,
// a line only rises because more people pointed at it, and moving your own echo
// is the only power you hold over anybody else's words.
//
// THE ROUTE — every layer reachable without the driver.
//   attach        the FAB, and the app's own add flow, untouched. There is NO
//                 Compose here: contribution is deliberately unchanged, and the
//                 direction says so by omission. The invention is entirely in
//                 the second utterance.
//   reaction      mark read on any Active card. The Swell runs as shipped, and
//                 the rung it commits is what your echo will carry.
//   record        the door on any Read card opens the same surface as the
//                 landing (doorOpens: 'respond').
//   standing      a Banner above the tabs on the Read tab — the most recently
//                 moved standing line, one line tall, tappable into the page.
// ============================================================================

const { PGD7: ecPGD7, Button: EcButton, Avatar: EcAvatar } = window;
const { useState: ecS } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS and its
// quantiser internal. PLAYGROUND.md allows the copy; this is the pointer to its
// source. Verbatim — never "improved", or the echo stops carrying what the pad
// actually said.
const EC_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const ecLevelFromIntensity = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };
const ecRungWord = (level) => (level ? EC_DEPTH_WORDS[Math.max(1, Math.min(3, level)) - 1] : null);

// ---- Who a reaction belongs to ---------------------------------------------
// Reactions carry a display name, not a member id, and the rig APPENDS yours on
// mark-read — so a fresh reaction has to win over anything the seed left behind.
// Read from the end.
const ecReactionOf = (ctx, item, who) => {
  const name = who === 'you' ? 'You' : ctx.nameOf(who);
  const all = (item && item.reactions) || [];
  for (let i = all.length - 1; i >= 0; i--) if (all[i].name === name) return all[i];
  return null;
};
// The rung a member gave on this item, or null when they skipped the pad or
// have not met it yet. Never invented: no reaction means no depth.
const ecRungOf = (ctx, item, who) => {
  const r = ecReactionOf(ctx, item, who);
  if (!r || !r.glyph) return null;
  return ecLevelFromIntensity(r.intensity);
};

// ---- The lines of an item ---------------------------------------------------
// The sharer's thought is a line like any other — it is simply the first one
// said, which is exactly the asymmetry this direction is built on. An item with
// neither a thought nor a response has no lines, and that is a real state.
const ecLines = (item) => {
  const out = [];
  if (item.thought && item.thought.text) {
    out.push({ id: item.id + '-t', by: item.thought.by || item.by, text: item.thought.text, at: item.thought.at || item.at });
  }
  (item.responses || []).forEach((r) => out.push({ id: r.id, by: r.by, text: r.text, at: r.at }));
  return out;
};

// ---- Echoes -----------------------------------------------------------------
// state.echoes[itemId][lineId] = [memberId, ...] — everyone who pointed at that
// line. The author is NOT in it: they wrote it, they did not echo it. So the
// faces under a line are exactly the people who said the same.
const ecMap = (ctx, item) => ((ctx.state && ctx.state.echoes) || {})[item.id] || {};
const ecEchoersOf = (ctx, item, lineId) => ecMap(ctx, item)[lineId] || [];
const ecMineOn = (ctx, item) => {
  const m = ecMap(ctx, item);
  return Object.keys(m).find((k) => (m[k] || []).indexOf('you') >= 0) || null;
};

// One echo per member per item, movable. Pointing at the line you already stand
// with takes your echo back off it — the same tap, the other way.
const ecEcho = (ctx, item, lineId) => {
  ctx.setState((s) => {
    const all = (s && s.echoes) || {};
    const cur = { ...(all[item.id] || {}) };
    let had = false;
    Object.keys(cur).forEach((k) => {
      const next = (cur[k] || []).filter((m) => m !== 'you');
      if (next.length !== (cur[k] || []).length && k === lineId) had = true;
      cur[k] = next;
    });
    if (!had) cur[lineId] = [...(cur[lineId] || []), 'you'];
    return {
      echoes: { ...all, [item.id]: cur },
      moved: { ...((s && s.moved) || {}), [item.id]: Date.now() },
    };
  });
};

// The standing line: the one the most of the circle has echoed. A tie holds
// with the line that was said first — a newcomer never displaces an equal on
// nothing but recency, so overtaking always costs an actual echo.
const ecStanding = (ctx, item) => {
  const lines = ecLines(item);
  let best = null, bestN = 0;
  lines.forEach((l) => {
    const n = ecEchoersOf(ctx, item, l.id).length;
    if (n > bestN) { best = l; bestN = n; }
  });
  return best;
};

// ============================================================================
// The faces. Weighted by the rung each member gave on the pad — so the same
// line visibly stands deeply with one person and a little with another. Size
// and weight only; no colour carries any of it.
// ============================================================================
const EC_FACE_SIZE = { 0: 20, 1: 21, 2: 25, 3: 29 };

const EcFaces = ({ ctx, item, who, max, small }) => {
  if (!who || !who.length) return null;
  const shown = max ? who.slice(0, max) : who;
  const label = who.map((m) => {
    const w = ecRungWord(ecRungOf(ctx, item, m));
    const name = m === 'you' ? 'You' : ctx.nameOf(m);
    return w ? name + ', ' + w : name;
  }).join('; ');
  return (
    <span role="img" aria-label={label} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      {shown.map((m, i) => {
        const lvl = ecRungOf(ctx, item, m) || 0;
        const size = small ? 20 : EC_FACE_SIZE[lvl];
        return (
          <span key={m} style={{
            display: 'inline-flex', borderRadius: '50%', marginLeft: i === 0 ? 0 : -6,
            boxShadow: '0 0 0 2px var(--color-surface)', zIndex: shown.length - i,
          }}>
            <EcAvatar name={m === 'you' ? ctx.me.realName : ctx.nameOf(m)} size={size} accent={m === 'you'} />
          </span>
        );
      })}
    </span>
  );
};

// The named form, used behind the door: face, name, and the rung that member
// gave, in the pad's own word. This is where the depth is legible rather than
// merely weighted.
const EcStanders = ({ ctx, item, who }) => {
  if (!who || !who.length) return null;
  const ecChip = {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '3px 10px 3px 3px', borderRadius: 999,
    background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, lineHeight: 1.2,
    color: 'var(--color-fg-1)', maxWidth: '100%', minWidth: 0,
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {who.map((m) => {
        const word = ecRungWord(ecRungOf(ctx, item, m));
        const mine = m === 'you';
        return (
          <span key={m} style={{ ...ecChip, color: mine ? 'var(--color-accent)' : 'var(--color-fg-1)' }}>
            <EcAvatar name={mine ? ctx.me.realName : ctx.nameOf(m)} size={22} accent={mine} />
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {mine ? 'You' : ctx.nameOf(m)}
            </span>
            {word && (
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 400, color: 'var(--color-fg-3)' }}>
                {word}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

// ============================================================================
// A quoted line with its author named. Quotation marks and an em-dash
// attribution, because a line that belongs to somebody else is a quotation and
// the typography for that is already settled.
// ============================================================================
const EcQuote = ({ ctx, line, size = 15, clamp }) => {
  const ecQuoteText = {
    margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: size,
    lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty',
    display: clamp ? '-webkit-box' : 'block',
    WebkitLineClamp: clamp, WebkitBoxOrient: 'vertical', overflow: clamp ? 'hidden' : 'visible',
  };
  const ecQuoteBy = {
    marginTop: 4, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12,
    lineHeight: 1.4, color: 'var(--color-fg-3)',
  };
  return (
    <div style={{ minWidth: 0 }}>
      <p style={ecQuoteText}>{'“' + line.text + '”'}</p>
      <div style={ecQuoteBy}>{'— ' + (line.by === 'you' ? 'You' : ctx.nameOf(line.by))}</div>
    </div>
  );
};

// ============================================================================
// One line behind the door: the quote, who already said the same, and the tap.
// ----------------------------------------------------------------------------
// Your own line carries no control — you cannot agree with yourself. Every
// other line carries one, and pressing it puts your face under that line
// carrying the rung you gave the item on the pad.
// ============================================================================
const EcLineRow = ({ ctx, item, line, standing }) => {
  const who = ecEchoersOf(ctx, item, line.id);
  const yours = line.by === 'you';
  const echoed = who.indexOf('you') >= 0;
  const myWord = ecRungWord(ecRungOf(ctx, item, 'you'));

  const ecRowWrap = {
    display: 'flex', flexDirection: 'column', gap: 10,
    padding: '14px 0 16px', borderTop: '1px solid var(--color-border-2)',
  };
  const ecRowStand = {
    fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--color-fg-3)',
  };
  return (
    <div style={ecRowWrap}>
      {standing && <div style={ecRowStand}>Standing</div>}
      <EcQuote ctx={ctx} line={line} />
      <EcStanders ctx={ctx} item={item} who={who} />
      {!yours && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <EcButton variant={echoed ? 'primary' : 'secondary'} size="sm"
            onClick={() => ecEcho(ctx, item, line.id)}>
            {echoed ? 'You said the same' : 'Said the same'}
          </EcButton>
          {echoed && myWord && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{myWord}</span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Speaking, when nobody has said it for you. Secondary and last, under every
// line already there — and gone entirely the moment you point at one of them.
// ============================================================================
const EcSay = ({ ctx, item, sole }) => {
  const [text, setText] = ecS('');
  const ecSayField = {
    width: '100%', boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5,
    color: 'var(--color-fg-1)', background: 'var(--color-surface)',
    padding: '10px 12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-1)', resize: 'vertical',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: sole ? 0 : 14, borderTop: sole ? 'none' : '1px solid var(--color-border-2)' }}>
      <textarea rows={2} value={text} placeholder="Say something nobody has said."
        style={ecSayField} onChange={(e) => setText(e.target.value)} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <EcButton variant={sole ? 'primary' : 'secondary'} disabled={!text.trim()}
          onClick={() => { ctx.actions.respond(item.id, { text: text.trim(), register: 'gist' }); setText(''); }}>
          Say it
        </EcButton>
      </div>
    </div>
  );
};

// ============================================================================
// Beats 2 and 3 — the record, from the reveal and from the door. One surface:
// the circle's lines, each with the faces already under it and one tap to join
// them, and your own field last of all.
// ============================================================================
const EcRecord = ({ ctx, item, glyph }) => {
  const lines = ecLines(item);
  const standing = ecStanding(ctx, item);
  const mine = ecMineOn(ctx, item);

  const ecRecHead = { display: 'flex', alignItems: 'center', gap: 10, paddingRight: 34 };
  const ecRecTitle = {
    minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
    lineHeight: 1.35, color: 'var(--color-fg-2)', textWrap: 'pretty',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={ecRecHead}>
        {glyph ? <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{glyph}</span> : null}
        <span style={ecRecTitle}>{item.title || item.url.replace(/^https?:\/\//, '')}</span>
      </div>
      {lines.map((l) => (
        <EcLineRow key={l.id} ctx={ctx} item={item} line={l}
          standing={!!standing && standing.id === l.id} />
      ))}
      {!mine && <EcSay ctx={ctx} item={item} sole={lines.length === 0} />}
    </div>
  );
};

// ============================================================================
// The card face — Read tab only, below the attribution: the standing line in
// quotation, its author named, and the faces of everyone standing with it.
//
// Seats holds this slot with MARKS — four 4px dots under an unquoted, indented
// opening turn. This is the other thing entirely: a quotation with an
// attribution and a row of weighted faces. No dots, no drawing, no state
// diagram; a line and the people who said it too.
//
// A card the circle has not converged on carries nothing. A bare card is a
// legitimate face, and there is no chatter standing in for one.
// ============================================================================
const EcCard = ({ ctx, item, tab }) => {
  if (tab !== 'read') return null;
  const line = ecStanding(ctx, item);
  if (!line) return null;
  const who = ecEchoersOf(ctx, item, line.id);
  const ecCardWrap = {
    marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)',
    borderTop: '1px solid var(--color-border-2)',
    display: 'flex', flexDirection: 'column', gap: 10,
  };
  return (
    <div style={ecCardWrap}>
      <EcQuote ctx={ctx} line={line} clamp={4} />
      <EcFaces ctx={ctx} item={item} who={who} />
    </div>
  );
};

// ============================================================================
// Beat 4 — Standing. One line per item: the line that circle currently stands
// behind, newest movement first. Tapping one re-enters that item's record,
// where the echo can be moved to a different line — which is how a line is
// overtaken here, and the only way it can be.
// ============================================================================
// Read items only. A standing line is something a member wrote after reading,
// so listing an unread item here would put the circle's conversation in front
// of someone who has not read the thing — reveal-on-read protects the
// conversation, and Standing is conversation.
const ecOrderForStanding = (ctx) => {
  const moved = (ctx.state && ctx.state.moved) || {};
  return ctx.readItems
    .filter((i) => !!ecStanding(ctx, i))
    .sort((a, b) => ((moved[b.id] || 0) - (moved[a.id] || 0)) || ((b.at || 0) - (a.at || 0)));
};

const EcStandingPage = ({ ctx }) => {
  const rows = ecOrderForStanding(ctx);
  const ecPage = {
    maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%', boxSizing: 'border-box',
    padding: ctx.isMobile ? '16px 16px 32px' : '28px 24px 44px',
    display: 'flex', flexDirection: 'column', gap: 12,
  };
  const ecRow = {
    display: 'flex', flexDirection: 'column', gap: 10, width: '100%', textAlign: 'left',
    background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
    cursor: 'pointer', boxSizing: 'border-box',
  };
  const ecRowSource = {
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
    color: 'var(--color-fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  };
  return (
    <div style={ecPage}>
      {rows.map((item) => {
        const line = ecStanding(ctx, item);
        const who = ecEchoersOf(ctx, item, line.id);
        return (
          <button key={item.id} className="ec7-row" style={ecRow}
            onClick={() => { ctx.setRoute('feed'); ctx.openRespond(item); }}>
            <span style={ecRowSource}>{item.source || window.pgd7Host(item.url)}</span>
            <EcQuote ctx={ctx} line={line} size={15} clamp={3} />
            <EcFaces ctx={ctx} item={item} who={who} />
          </button>
        );
      })}
    </div>
  );
};

// ============================================================================
// The Banner — one line tall, on the Read tab: the standing line that moved
// most recently, and the way into the page. Standing is reachable without ever
// touching the driver.
// ============================================================================
const EcBanner = ({ ctx }) => {
  if (ctx.tab !== 'read') return null;
  const item = ecOrderForStanding(ctx)[0];
  if (!item) return null;
  const line = ecStanding(ctx, item);
  const who = ecEchoersOf(ctx, item, line.id);
  const ecBanner = {
    display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44,
    padding: '8px 16px', boxSizing: 'border-box', textAlign: 'left',
    background: 'transparent', border: 0, borderBottom: '1px solid var(--color-border-2)',
    cursor: 'pointer',
  };
  const ecBannerTag = {
    flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--color-fg-3)',
  };
  const ecBannerLine = {
    flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, color: 'var(--color-fg-1)',
  };
  return (
    <button className="ec7-row" style={ecBanner} onClick={() => ctx.openContinue()}>
      <span style={ecBannerTag}>Standing</span>
      <span style={ecBannerLine}>{'“' + line.text + '”'}</span>
      <EcFaces ctx={ctx} item={item} who={who} max={3} small />
    </button>
  );
};

// ---- The one rule inline styles cannot carry -------------------------------
const EC_CSS = `
.ec7-row { -webkit-tap-highlight-color: transparent; }
.ec7-row:hover, .ec7-row:focus-visible { background: var(--color-surface-sunken); }
`;
if (typeof document !== 'undefined' && !document.getElementById('ec7-css')) {
  const ecStyleEl = document.createElement('style');
  ecStyleEl.id = 'ec7-css';
  ecStyleEl.textContent = EC_CSS;
  document.head.appendChild(ecStyleEl);
}

// ============================================================================
// The circle's echoes, seeded. Keyed by item, then by line, holding everyone
// who pointed at that line — never its author.
//   a5   two lines one echo apart, tied and held by the earlier: pointing at
//        the second overtakes the first, which is the land beat
//   r1   the same shape on a Read item, reached through the door
//   a7 · r4   your own line standing, and a long line standing, so the measure
//        and the you-case are both on screen somewhere
//   a6   a line nobody has echoed: no standing line, and a bare card
//   r3   no lines at all — nothing to echo, and the record is your field alone
// ============================================================================
const EC_SEED = {
  a1: { 'a1-t': ['marcus', 'ada'] },
  a2: { a2r1: ['marcus'], a2r2: ['dev'] },
  a3: { 'a3-t': ['ada'], a3r1: ['priya', 'dev'] },
  a4: { 'a4-t': ['marcus', 'dev'], a4r1: ['priya'] },
  a5: { 'a5-t': ['marcus'], a5r1: ['priya'] },
  a6: {},
  a7: { 'a7-t': ['dev'], a7r2: ['ada', 'marcus'] },
  r1: { 'r1-t': ['priya'], r1r2: ['dev'] },
  r2: { 'r2-t': ['ada', 'dev'] },
  r3: {},
  r4: { 'r4-t': ['priya'], r4r3: ['ada', 'marcus'] },
};

ecPGD7.register({
  id: 'echo',
  name: 'Said the Same',
  // The standing line sits below the attribution, quoted and attributed, with
  // the faces of everyone standing with it under it. Read tab only — on Active
  // there is nothing the circle has converged on yet.
  face: { slot: 'below-attribution' },
  initialState: { echoes: EC_SEED, moved: {} },
  Card: EcCard,
  // No Compose. Contribution is untouched; the invention is the second
  // utterance, and the omission is the statement.
  Landing: EcRecord,
  Respond: EcRecord,
  doorOpens: 'respond',
  Continue: EcStandingPage,
  continueTitle: 'Standing',
  Banner: EcBanner,
  beats: {
    // Land on an item whose two lines are one echo apart, so the Swell commits
    // the rung, the record takes the sheet, and one tap visibly moves which
    // line the circle stands behind.
    land: (api) => {
      const t = api.itemById('a5') || api.activeItems.find((i) => ecLines(i).length > 1) || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // The same shape on a Read item, so the door's surface is met with a real
    // succession available in it.
    respond: (api) => {
      const t = api.itemById('r1') || api.readItems.find((i) => ecLines(i).length > 1) || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
  },
});
