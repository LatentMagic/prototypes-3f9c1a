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

// THE META LINE — rewritten in run 9's elegance pass. It used to read
// `New links · 4 members` or `All read · 3 members`, and both halves were
// wrong.
//
// `New links` was redundant with the dot two elements to its right — and
// redundant in the accessibility channel too, not only the visual one: the dot
// is not a bare colour, it already carries `", new items"` as visually-hidden
// text (app/liveliness.jsx). So the words were a second voice saying what the
// mark already said, which is exactly why the line read as noise. `All read`
// was worse than redundant: it asserted a completed state the product does not
// promise, on a tab nobody is expected to empty.
//
// What replaced them is the one thing that differs between two circles of the
// same size: WHO IS IN THEM. A circle is its members — that is the product's
// second axis stated literally — so the row now says what the circle IS rather
// than filing a status report on it. Three rows never read alike again, which
// was the defect run 8 recorded and could not fix from inside its own slice:
// "three consecutive rows read `New links · N members` and the meta column
// distinguishes nothing."
//
// Rejected on the way here: recency (`Last link 3 weeks ago`), which is a guilt
// column — performance pressure on whoever last contributed, reached by a
// different road than a leaderboard but arriving at the same place.
//
// `Asleep` survives, and it is the one status word that should. A dormant
// circle's cards are unreachable, and no dot can carry that: the dot marks
// arrivals, and a sleeping circle has none to mark.
// BIZ-run-10 addendum: the champion's own words about what a circle is FOR now
// outrank the roster line above when there are any — a more specific answer to
// the exact question this line has always asked ("what IS this circle", never
// a status report), so this is not a reversal of the reasoning above, only a
// better answer standing in front of it. The roster line stays as the fallback
// for a circle that hasn't set one — never both, never a second line.
// Run 11 briefly rendered an authored description a step darker than the derived
// people line, to separate the two kinds the way the members header now does.
// The pixel review killed it and was right: at 13px, #525252 against #6E6E6B is
// ΔL* 9.2, and a member never sees the two sublines in one row — they read ONE
// and must classify it from memory. So the distinction was technically present
// and not legible. Worse, it made colour the SOLE channel, which this app's own
// rule forbids in as many words: hierarchy via size and weight, never colour.
// The sanctioned levers do not fit here — 15px would collide with the 16px row
// title, and a leading glyph would put a fourth element in a row that already
// carries a tile, a dot and a chevron. Reverted rather than half-fixed. What the
// home row actually owes is ruling 15's truncation question, and that is Joe's.
const circleSummary = (s) => {
  const description = ((s.description || '') + '').trim();
  const roster = window.candRoster;
  const others = (s.members || []).map((m) => m && m.name).filter((n) => n && n !== 'You');
  // The helper lives in a droppable module, so the count is the fallback rather
  // than a crash — same deletable-aid contract every other guard here honours.
  const people = roster ? roster(others)
    : others.length + ' member' + (others.length === 1 ? '' : 's');
  const line = description || people;
  return s.funded ? line : 'Asleep · ' + line;
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
            {/* Run 9: `15.5` and `12.5` were sizes the scale does not contain.
                tokens.css runs 12/13/15/16/18/20/24/32/40 and every older module
                honours it; this file and home-returns.jsx were a day old and
                already off it, which is the literal form of "has it been done
                beautifully". Snapped to `--text-md` and `--text-sm`. */}
            <span style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-md)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
            <span style={{ display: 'block', fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--color-fg-3)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{circleSummary(s)}</span>
          </span>
          {/* The micro dot the web rail carries, meaning exactly what it means
              there: `unseen` — arrivals since the member last looked. Opening
              the circle is the accept, so home needs no refresh gesture.
              REVERTED 2026-09-07, on Joe's ruling. Run 9 widened this to fire
              on unread items too, reasoning that dropping `New links` from the
              meta line otherwise lost a signal. That was the wrong move twice
              over. **The home screen does not indicate unread at all** — it is
              implicit in there being a Read pile, and he had already said so —
              and the fix for "the words and the dot say different things" is
              never to redefine the dot. One mark, one meaning, in both places
              it appears; the rail and the home row can now be read as the same
              signal because they are.
              Consequence, accepted: a circle with plenty unread and nothing new
              carries no mark. That is the definition working. */}
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
