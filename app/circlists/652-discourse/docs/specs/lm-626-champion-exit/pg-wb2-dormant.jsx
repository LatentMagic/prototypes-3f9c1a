// ============================================================================
// LM-626 whiteboard, ROUND TWO — the dormant circle, after the round-one review.
// Static candidate bodies only; mounted as AppShell children by pg-wb2-board.jsx.
//
// What round one settled and this round obeys:
//   BAN   no white card / panel. The Create -> Fund wizard already removed cards;
//         this screen does not get to reintroduce them (kills round-one B).
//   BAN   a Leave BUTTON sitting next to a mailto LINK. Two affordance kinds,
//         two fonts, one row — it reads badly and neither says what it is.
//   KEEP  no eyebrow, and no circle name in the heading (the top bar says it).
//   RULE  Leave is destructive, so it is red — but red does not have to mean a
//         filled danger button.
//   RULE  the support address is support@circlists.com, mono, ITS OWN THING —
//         never dressed up as "Get in touch" beside another control.
//   CUT   the subtitle carries less, because on desktop it was carrying too much.
//
// Still open, and what these four ask:
//   - is Leave a PEER of Fund (D, E) or subordinate to it (F)?
//   - does Leave need a confirmation dialog at all (G answers: not a dialog)?
// ============================================================================
const OPERATOR2 = window.OPERATOR_EMAIL || 'support@circlists.com';
const MAILTO2 = 'mailto:' + OPERATOR2;

// Shared skeleton. Every candidate is the same centred column and the same two
// sentences; they differ ONLY in how the two actions are ranked.
const wb2 = {
  main: { flex: 1, width: '100%', minHeight: 'calc(var(--circ-vh) - var(--top-bar-height))', display: 'flex', flexDirection: 'column' },
  mid: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 24px', textAlign: 'center' },
  col: { width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.18, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0 },
  body: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: 'var(--color-fg-2)', margin: '12px 0 0' },
  cap: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: '12px 0 0' },
  // The address, alone, at the bottom edge of the canvas. Nothing shares its row.
  addr: { display: 'flex', justifyContent: 'center', padding: '0 24px 28px' },
  addrLink: { fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)', textDecoration: 'underline', textUnderlineOffset: '2px' },
};
// body: pass a string to replace the subheading, or null for none. The D-G
// candidates below keep round two's default; pg-wb2-d.jsx overrides it.
const WB2_DEFAULT_BODY = 'Its links, reactions and members are all kept.';
const Wb2Head = ({ title = 'This circle is asleep.', body = WB2_DEFAULT_BODY }) => (
  <React.Fragment>
    <h1 style={wb2.title}>{title}</h1>
    {body && <p style={wb2.body}>{body}</p>}
  </React.Fragment>
);
const Wb2Rule = () => <p style={wb2.cap}>Any member can fund it. Whoever funds it next champions it.</p>;
const Wb2Addr = () => (
  <div style={wb2.addr}><a href={MAILTO2} className="circ-textlink" style={wb2.addrLink}>{OPERATOR2}</a></div>
);

// Leave, at four weights. The layout question and the weight question are
// separate, so the weight is a prop and the board strips them side by side.
//   text    — red label, no container (the default here)
//   outline — red label in a red-tinted border, a true peer of the primary
//   filled  — the house destructive button
//   quiet   — grey, the round-one treatment, kept only for comparison
const Wb2Leave = ({ weight = 'text', label = 'Leave', full = false, onClick }) => {
  if (weight === 'filled') return <Button variant="destructive" size="lg" full={full} onClick={onClick}>{label}</Button>;
  const base = { minHeight: 52, padding: '14px 22px', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1, width: full ? '100%' : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
  const skins = {
    text: { border: 0, color: 'var(--color-destructive)' },
    outline: { border: '1px solid color-mix(in oklab, var(--color-destructive) 40%, transparent)', color: 'var(--color-destructive)', fontWeight: 500 },
    quiet: { border: 0, color: 'var(--color-fg-3)', fontWeight: 500 },
  };
  return <button type="button" className="wb2-leave" onClick={onClick} style={{ ...base, ...skins[weight] }}>{label}</button>;
};

// ---- D — Two actions, stacked, ranked by colour -----------------------------
// The unexplored idea, taken straight: Fund and Leave are both BUTTONS, so no
// row ever mixes a control with a link. Rank comes from fill vs no fill, and the
// verbs differ ("Fund this circle" / "Leave") so nothing says "this circle" twice.
const WbDormantD = ({ leaveWeight = 'text' }) => (
  <main style={wb2.main}>
    <div style={wb2.mid}><div style={wb2.col}>
      <Wb2Head />
      <div style={{ width: '100%', marginTop: 'var(--space-8)' }}><Button variant="primary" size="lg" full>Fund this circle</Button></div>
      <div style={{ marginTop: 4 }}><Wb2Leave weight={leaveWeight} /></div>
      <Wb2Rule />
    </div></div>
    <Wb2Addr />
  </main>
);

// ---- E — Two actions, side by side, true peers ------------------------------
// The same pair given equal footprint: one row, both 52px, one filled and one
// outlined in the same red. This is the honest test of "should Leave carry as
// much weight as Fund" — here it very nearly does.
const WbDormantE = ({ leaveWeight = 'outline' }) => (
  <main style={wb2.main}>
    <div style={wb2.mid}><div style={{ ...wb2.col, maxWidth: 380 }}>
      <Wb2Head />
      <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%', marginTop: 'var(--space-8)' }}>
        <div style={{ flex: 1 }}><Button variant="primary" size="lg" full>Fund it</Button></div>
        <div style={{ flex: 1 }}><Wb2Leave weight={leaveWeight} full /></div>
      </div>
      <Wb2Rule />
    </div></div>
    <Wb2Addr />
  </main>
);

// ---- F — One action; the exit is a sentence, and it is alone -----------------
// Keeps what the review liked about inline prose ("you can leave this circle")
// but removes what it disliked: the exit sentence shares its row with nothing,
// and the address sits far below in its own kind. Fund is the only button.
const WbDormantF = () => (
  <main style={wb2.main}>
    <div style={wb2.mid}><div style={wb2.col}>
      <Wb2Head />
      <div style={{ width: '100%', marginTop: 'var(--space-8)' }}><Button variant="primary" size="lg" full>Fund this circle</Button></div>
      <Wb2Rule />
      <div style={{ width: 200, height: 1, background: 'var(--color-border-2)', margin: 'var(--space-8) 0 var(--space-5)' }} />
      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: 0 }}>
        Or <button type="button" className="wb2-inline-danger">leave this circle</button>.
      </p>
    </div></div>
    <Wb2Addr />
  </main>
);

// ---- G — Two actions, and the confirmation happens in place ------------------
// Answers the open question directly: leaving is destructive enough to need a
// second touch, not big enough to need a dialog. Pressing Leave arms it where it
// stands — the cost is stated and the commit is red — so no modal, no new layer,
// and Escape/Cancel is the resting state one tap away.
const WbDormantG = ({ armed = false }) => (
  <main style={wb2.main}>
    <div style={wb2.mid}><div style={wb2.col}>
      <Wb2Head />
      <div style={{ width: '100%', marginTop: 'var(--space-8)', opacity: armed ? 0.4 : 1 }}><Button variant="primary" size="lg" full>Fund this circle</Button></div>
      {!armed && <div style={{ marginTop: 4 }}><Wb2Leave weight="text" /></div>}
      {!armed && <Wb2Rule />}
      {armed && (
        <div style={{ width: '100%', marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--color-border-2)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.55, color: 'var(--color-fg-2)', margin: '0 0 var(--space-4)' }}>Leaving drops this circle from your list. You would need a new invitation to come back.</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <div style={{ flex: 1 }}><Button variant="secondary" size="lg" full>Stay</Button></div>
            <div style={{ flex: 1 }}><Wb2Leave weight="filled" label="Leave" full /></div>
          </div>
        </div>
      )}
    </div></div>
    <Wb2Addr />
  </main>
);

Object.assign(window, { WbDormantD, WbDormantE, WbDormantF, WbDormantG, Wb2Leave, Wb2Head, Wb2Rule, Wb2Addr, wb2 });
