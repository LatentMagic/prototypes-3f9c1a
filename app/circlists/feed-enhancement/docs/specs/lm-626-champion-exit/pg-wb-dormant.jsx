// ============================================================================
// LM-626 whiteboard — three ways to organise the DORMANT CIRCLE screen.
// Static candidate bodies only. Each is mounted as AppShell children by
// pg-wb-board.jsx, so the top bar, rail and canvas around them are the real
// app. Buttons are live-looking but inert: this rig answers a layout question,
// not a flow question.
//
// The content inventory every candidate must carry (all of it correct today,
// per LM-626) — state, name, what is preserved, Fund, the succession rule, a
// plain contact route, Leave. Nobody is named anywhere.
// ============================================================================
const OPERATOR = window.OPERATOR_EMAIL || 'support@circlists.com';
const MAILTO = 'mailto:' + OPERATOR;

// A quiet text door, fg-3 and underlined. The destructive weight lives in the
// confirmation, never in the resting control.
const wbQuietDoor = {
  background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
  font: 'inherit', color: 'inherit', textDecoration: 'underline',
  textUnderlineOffset: '2px', textDecorationColor: 'var(--color-border-strong)',
};

// ---- A — One sentence, one action ------------------------------------------
// Compression plus distance. The eyebrow goes (the sentence says the state),
// the repeated circle name goes (the top bar already says it), and the
// succession rule folds into the one body sentence. The two secondary doors
// leave the centred column entirely and sit as a quiet footer row, so
// hierarchy is carried by DISTANCE rather than by more structure.
const wbAStyles = {
  main: { flex: 1, width: '100%', minHeight: 'calc(var(--circ-vh) - var(--top-bar-height))', display: 'flex', flexDirection: 'column' },
  mid: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 24px', textAlign: 'center' },
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.18, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0, maxWidth: 380 },
  body: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: 'var(--color-fg-2)', margin: '14px 0 0', maxWidth: 380 },
  foot: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 24px 28px', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)' },
};
const WbDormantA = () => (
  <main style={wbAStyles.main}>
    <div style={wbAStyles.mid}>
      <h1 style={wbAStyles.title}>This circle is asleep.</h1>
      <p style={wbAStyles.body}>Everything in it is kept — links, reactions, members. Fund it to bring it back for everyone, and you champion it from then on.</p>
      <div style={{ marginTop: 'var(--space-8)' }}>
        <Button variant="primary" size="lg">Fund this circle</Button>
      </div>
    </div>
    <div style={wbAStyles.foot}>
      <button type="button" style={wbQuietDoor}>Leave this circle</button>
      <span aria-hidden="true" style={{ color: 'var(--color-border-strong)' }}>·</span>
      <a href={MAILTO} className="circ-textlink" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--color-fg-3)', textDecoration: 'underline' }}>{OPERATOR}</a>
    </div>
  </main>
);

// ---- B — The state as an object --------------------------------------------
// The screen stops being an empty hero and becomes one thing you can act on,
// borrowing the funding card's shipped grammar exactly: name plus a textual
// marker, one line beneath it, then the action. The circle is named INSIDE the
// object, so no heading repeats the top bar.
const wbBStyles = {
  main: { flex: 1, width: '100%', minHeight: 'calc(var(--circ-vh) - var(--top-bar-height))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 56px' },
  card: { width: '100%', maxWidth: 400, background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' },
  head: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 'var(--space-2)' },
  name: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  marker: { fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)', flex: 'none' },
  line: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '0 0 var(--space-5)' },
  cap: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: 'var(--space-4) 0 0', textAlign: 'center' },
  under: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: 'var(--space-5) 0 0', textAlign: 'center' },
};
const WbDormantB = ({ space }) => (
  <main style={wbBStyles.main}>
    <div style={wbBStyles.card}>
      <div style={wbBStyles.head}>
        <div style={wbBStyles.name}>{space ? space.name : 'This circle'}</div>
        <div style={wbBStyles.marker}>Asleep</div>
      </div>
      <p style={wbBStyles.line}>Its links, reactions and members are all kept, exactly as they were.</p>
      <Button variant="primary" size="lg" full>Fund this circle</Button>
      <p style={wbBStyles.cap}>Any member can fund it. Whoever funds it next champions it.</p>
    </div>
    <p style={wbBStyles.under}>Rather step away? <button type="button" style={wbQuietDoor}>Leave this circle</button></p>
    <p style={{ ...wbBStyles.under, margin: 'var(--space-6) 0 0' }}>
      <a href={MAILTO} className="circ-textlink" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--color-fg-3)', textDecoration: 'underline' }}>{OPERATOR}</a>
    </p>
  </main>
);

// ---- C — Ranked, and each thing bound to what it serves ---------------------
// A real hero, but nothing floats: the succession rule becomes the button's own
// caption (the shipped funding-page pattern — primary action with a micro-caption
// beneath), and the two secondary doors collapse into ONE grey sentence with the
// links inside it, the product's existing door construction. Three affordances
// of three kinds become one button and one sentence.
const wbCStyles = {
  main: { flex: 1, width: '100%', minHeight: 'calc(var(--circ-vh) - var(--top-bar-height))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 72px', textAlign: 'center' },
  col: { width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)', lineHeight: 1.18, letterSpacing: '-0.02em', color: 'var(--color-fg-1)', margin: 0 },
  body: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: 'var(--color-fg-2)', margin: '14px 0 26px', maxWidth: 340 },
  caps: { margin: '14px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)', lineHeight: 1.5 },
  rule: { width: '100%', maxWidth: 300, height: 1, background: 'var(--color-border-2)', margin: 'var(--space-8) 0 var(--space-6)' },
  doors: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: 0 },
};
const WbDormantC = () => (
  <main style={wbCStyles.main}>
    <div style={wbCStyles.col}>
      <h1 style={wbCStyles.title}>This circle is asleep.</h1>
      <p style={wbCStyles.body}>Its links, reactions and members are all kept.</p>
      <div style={{ width: '100%', maxWidth: 300 }}><Button variant="primary" size="lg" full>Fund this circle</Button></div>
      <div style={wbCStyles.caps}>
        <span>Any member can fund it</span>
        <span>Whoever funds it next champions it</span>
      </div>
      <div style={wbCStyles.rule} />
      <p style={wbCStyles.doors}>You can <button type="button" className="circ-doorlink" style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }}>leave this circle</button> or <a href={MAILTO} className="circ-doorlink">get in touch</a>.</p>
    </div>
  </main>
);

Object.assign(window, { WbDormantA, WbDormantB, WbDormantC });
