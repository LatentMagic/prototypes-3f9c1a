// ============================================================================
// Circlists — Home body: the circles list at account level, plus (feed-
// enhancement candidate build) the cross-circle returns strip above it.
// ----------------------------------------------------------------------------
// MOBILE.md named the test for when home stops being chrome: the day it gains
// content that exists nowhere else — a cross-circle view, anything past "pick
// a circle" — it becomes a SHARED SURFACE. The returns strip (app/home-
// returns.jsx) is exactly that content, so this file crossed that line the
// moment the strip was added. Nothing about that promotion required a
// per-posture fork: this body already renders identically under all three
// postures' chrome (main.jsx's inShell), which is the whole reason MOBILE.md
// had this file hold its own body from the start — promotion is a move, not a
// rewrite, and here it needed no move at all.
// ============================================================================

// Two named registers on this screen, in the same quiet treatment, so they
// read as a pair: the strip is what answered you, the rows are where you go.
// Aligned to the CARD edge, not 4.5px inside it. The design review measured the
// first attempt at x20.5 against a card edge of 16 and a card content edge of
// 32 — aligned to neither, which reads as a slip rather than as an indent.
const HOME_EYEBROW = {
  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em',
  textTransform: 'uppercase', color: 'var(--color-fg-3)', padding: '0 0 10px', margin: 0,
};

// Each row carries a reason to be looked at, so home is a place rather than a
// picker you pass through. Sleeping circles say so instead of counting links.
// No counts anywhere on this screen (feed-enhancement candidate build):
// "New links" replaces a number the member would otherwise have to read twice
// — once here, once for real inside the circle.
const circleSummary = (s) => {
  const members = (s.members ? s.members.length : 0) + ' member' + ((s.members || []).length === 1 ? '' : 's');
  if (!s.funded) return 'Asleep · ' + members;
  const unread = (s.items || []).filter(i => !i.read).length;
  return (unread ? 'New links' : 'All read') + ' · ' + members;
};

const homeTile = (name) => (
  <span aria-hidden="true" style={{
    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--color-surface-sunken)', color: 'var(--color-fg-2)',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
  }}>{(name || '?').trim().charAt(0).toUpperCase()}</span>
);

const CirclesHome = ({ spaces = [], onSelect, onCreate, stripOpen, onToggleStrip }) => {
  // The strip and its heading are a DELETABLE AID (app/home-returns.jsx),
  // guarded here at the one render site — dropping that file takes the whole
  // "Conversations" register with it, since neither the heading nor the
  // caught-up line beneath it means anything without the surface they answer
  // for. `circleSummary`'s wording above is a direct edit to this file and
  // stays regardless.
  const HomeReturns = window.CircHomeReturns;
  const funded = spaces.filter((s) => s.funded);
  return (
  // Centred on the app's own shared content width. The first build stretched
  // the mobile layout to the full 1008px the rail leaves behind, while every
  // other desktop surface in this app is 672px and centred — so the home read
  // as a different application beside its own feed, and a circle's status dot
  // rendered a thousand pixels from the circle's name, beside the chevron,
  // where nothing connects the two. `--max-feed-width` is the value the feed
  // already uses; this is a reflow to it, not a second layout.
  <main style={{ flex: 1, width: '100%', maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: '18px 16px 28px' }}>
    {HomeReturns && (
      <React.Fragment>
        <h2 style={HOME_EYEBROW}>Conversations</h2>
        {/* Always rendered, in every state. The component owns its own empty
            case (a card saying you are caught up) rather than being swapped out
            for a caption, so this section never becomes a heading with nothing
            under it and never changes height between states. */}
        <HomeReturns spaces={funded} open={stripOpen} onToggle={onToggleStrip} onEnterSpace={onSelect} />
      </React.Fragment>
    )}
    <h2 style={HOME_EYEBROW}>Your circles</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {spaces.map((s) => (
        <button key={s.id} onClick={() => onSelect && onSelect(s.id)} className="circ-appsheet-row" style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
          borderRadius: 'var(--radius-lg)', padding: '13px 14px', minHeight: 64,
          boxShadow: 'var(--shadow-raised)', fontFamily: 'var(--font-sans)',
        }}>
          {homeTile(s.name)}
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontWeight: 600, fontSize: 15.5, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
            <span style={{ display: 'block', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)', marginTop: 3 }}>{circleSummary(s)}</span>
          </span>
          {/* Unseen items — the same micro dot the web rail carries. Opening the
              circle is the accept, so home needs no refresh gesture of its own. */}
          <CircleSignal state={s.unseen ? 'unseen' : null} />
          <Icon name="chevron-right" size={18} color="var(--color-fg-3)" />
        </button>
      ))}
    </div>
    <button onClick={onCreate} className="circ-appsheet-row" style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
      background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', padding: '13px 12px', minHeight: 52,
      marginTop: 10, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-accent)',
    }}>
      <span style={{ width: 38, display: 'inline-flex', justifyContent: 'center' }}><Icon name="plus" size={19} color="var(--color-accent)" strokeWidth={2} /></span> New circle
    </button>
  </main>
  );
};

Object.assign(window, { CirclesHome });
