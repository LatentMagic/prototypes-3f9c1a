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
// 2026-09-09, on Joe's ruling: THE DESCRIPTION IS NOT READ HERE, and is not to
// be put back. Run 10 put it on this row and filed that as ruling 13, but his
// note of 2026-09-08 07:57 shows he had only ASKED whether it belonged here
// ("I am not saying it should have") — so the row was carrying an answer to a
// question nobody had settled. The answer is no.
//
// This row is a CHOOSER: it helps a member pick which circle to enter. The
// description is a champion's standing statement of what belongs inside,
// written for people already in — nobody outside a circle ever sees it. It
// cannot help you choose between circles you are already a member of.
//
// Everything the runs fought over here was downstream of that one misplacement:
// a 250-character field in a one-line slot (40 characters at 390px), the colour
// split run 11 tried and reverted, the two-line clamp and the ragged rows it
// brought. None of it is a problem once the description reads where it is
// actually read — the circle's own surface (spaces.jsx), where all 250
// characters already render whole on a phone. The roster line goes back to
// being this row's only subline, which is what the reasoning above describes.
const circleSummary = (s) => {
  const roster = window.candRoster;
  const others = (s.members || []).map((m) => m && m.name).filter((n) => n && n !== 'You');
  // The helper lives in a droppable module, so the count is the fallback rather
  // than a crash — same deletable-aid contract every other guard here honours.
  const people = roster ? roster(others)
    : others.length + ' member' + (others.length === 1 ? '' : 's');
  return s.funded ? people : 'Asleep · ' + people;
};

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
          {/* No monogram tile. Removed 2026-09-09: `homeTile` was local to this
              file and used nowhere else, while the app's avatar grammar
              (primitives.jsx `Avatar`, round initials) marks PEOPLE at every one
              of its call sites. A rounded-square monogram on a circle copied
              that grammar onto a non-person, so a circle read as a user account
              — and the letter carried nothing: every circle sharing an initial
              drew the same tile, and it was `aria-hidden`, which is the markup
              conceding it was decoration. */}
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
          {/* No trailing chevron. Removed 2026-09-09: every row in this list
              navigates, so a mark that never varies carries no information — it
              is furniture at the end of each row. It also collided with the
              `chevron-down` the Conversations strip above uses to collapse
              (home-returns.jsx), leaving one glyph family carrying two meanings
              on one screen, separated only by 90° of rotation at 16px in fg-3.
              The strip's chevron DOES vary with state, so it earns its place and
              is now the only chevron on the screen. The whole card is the
              target; its border, raised shadow and hover carry that. */}
        </button>
      ))}
    </div>
    <button onClick={onCreate} className="circ-appsheet-row" style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
      background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', padding: '13px 14px', minHeight: 52,
      marginTop: 10, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-accent)',
    }}>
      {/* The plus used to sit inside a 38px spacer standing in for the rows'
          monogram tile, which put `New circle` on the same left edge as the
          circle names above. The tile went on 2026-09-09 and the spacer had to
          go with it, or the label indented against a column that no longer
          exists. The row padding now matches the cards' 14px, so the plus takes
          the leading position the circle name takes in every row above it. */}
      <Icon name="plus" size={19} color="var(--color-accent)" strokeWidth={2} /> New circle
    </button>
  </main>
  );
};

Object.assign(window, { CirclesHome });
