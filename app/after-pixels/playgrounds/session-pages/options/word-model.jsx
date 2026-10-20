// Daily Word has no separate reader: its options read the session through SsOutcome (shared/outcome.js).
// This module holds what the three options share for the Element switch (Between, Game): the board drawn from the cover's own squares.
// Store (the default) never touches it: the options draw Ss.Cells exactly as before.
//
// Between: the same grid on the card ground, in the cover's colours. correct = cream square, forest letter; present = amber; absent = card fill, 1px line.
//          The hint's column gets an 8x8 teal square above the board (legacy "contains letter" hint has no column: the square sits left of the board).
// Game:    the board on the cover's forest ground, the cover's three squares: cream (correct), amber (present), a 2px teal outline (absent).
//          A solved day fuses its last five cream squares into one bar; a failed day never does. Unused rows (day in progress): teal outlines at 40% opacity.
// Flat only: no shadow, glow, dashed edge or grain on any mark (opacity and a plain fill are the only values). Every mark is one guess-scored mark or hint-given event.
// Per-letter marks are not on today's record in progress (counts only), so the seed computes them (SsOutcome.word); the options' cost lines say so.
(function () {
  const KIND = { h: 'hit', n: 'near', x: 'miss' };
  const NAME = { h: 'in place', n: 'in the word', x: 'not in the word' };

  // Did this play end solved? The last guess is all in place, and the record is not a loss.
  const solvedRow = (out, session, status) => {
    if (status !== 'done' || session.loss) return false;
    const g = out.play.guesses, last = g[g.length - 1];
    return !!last && last.marks === 'hhhhh';
  };

  // The hints on the record, each as { pos, letter, legacy } (legacy = "contains letter": no column).
  const hintsOf = (out) => out.play.rows.filter((r) => r.kind === 'hint').map((r) => ({ pos: r.pos, letter: r.letter, legacy: /^Hint: it has/.test(r.caption), caption: r.caption }));

  // The marker row above a board (or above one hint row in option 1): five columns, an 8x8 teal square in the hinted one.
  // A legacy hint's square sits just left of the board, in the padding.
  const HintMarks = ({ hints, className }) => {
    if (!hints.length) return null;
    return (
      <div className={'wd-hintrow ' + (className || '')} aria-hidden="true">
        <div className="wd-tiles wd-tiles-marks">
          {Array.from({ length: 5 }, (_, i) => <span key={i} className="wd-slot-mark">{hints.some((h) => !h.legacy && h.pos === i) ? <i className="wd-hint" /> : null}</span>)}
        </div>
        {hints.some((h) => h.legacy) ? <i className="wd-hint wd-hint-left" /> : null}
      </div>
    );
  };

  // One row of five squares. kind: 'guess' (marks) | 'empty' (an unused try). fused: the solved bar.
  const Tiles = ({ word, marks, empty, fused }) => (
    <div className="wd-tiles" data-fused={fused ? '1' : undefined} data-empty={empty ? '1' : undefined} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="ss-cell wd-cell" data-k={empty ? 'empty' : KIND[marks[i]]}>{empty ? '' : word[i]}</span>
      ))}
    </div>
  );

  // The whole board as one picture (options 2 and 3). hints = hintsOf(out); spare = unused rows to draw (open day).
  const Board = ({ out, session, status, spare, label, className }) => {
    const hints = hintsOf(out), fuse = solvedRow(out, session, status), g = out.play.guesses;
    return (
      <div className={'wd-board ' + (className || '')} role="img" aria-label={label}>
        <HintMarks hints={hints} />
        {g.map((r, i) => <Tiles key={i} word={r.word} marks={r.marks} fused={fuse && i === g.length - 1} />)}
        {Array.from({ length: spare || 0 }, (_, i) => <Tiles key={'e' + i} empty />)}
      </div>
    );
  };

  // Spoken form of a guess row, for aria-labels.
  const speak = (r) => 'Guess ' + r.n + ', ' + r.word + ': ' + r.word.split('').map((c, i) => c + ' ' + NAME[r.marks[i]]).join(', ');

  // CSS shared by the three options. Every rule is scoped to data-element, so the default (Store) path is untouched. ":scope" is the option's wrapper.
  const css = `
    :scope .wd-board { display: grid; gap: var(--wd-gap, 8px); justify-items: center; min-width: 0; position: relative; width: 100%; }
    :scope .wd-tiles { --wd-gap: 8px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--wd-gap); width: 100%;
      max-width: calc(5 * var(--wd-max, 58px) + 4 * var(--wd-gap)); container-type: inline-size; position: relative; }
    :scope .wd-tiles > .ss-cell { --c: calc((100cqi - 4 * var(--wd-gap)) / 5); width: var(--c); height: var(--c); }
    :scope .wd-hintrow { position: relative; width: 100%; display: grid; justify-items: center; margin-bottom: -2px; }
    :scope .wd-slot-mark { display: grid; justify-items: center; height: 8px; }
    :scope .wd-hint { display: block; width: 8px; height: 8px; background: var(--mark-teal); }
    :scope .wd-hint-left { position: absolute; left: calc(-1 * var(--wd-pad, 16px) + 4px); top: 0; }
    /* Sizes: phone 58 (gap 8, 322 wide); desktop 64 at Between, 72 at Game (element-distance.md, Daily Word). */
    :scope .ss-page { --wd-max: 58px; }
    @container ss (min-width: 680px) {
      :scope .ss-page[data-element="between"] .ss-main { --wd-max: 64px; }
      :scope .ss-page[data-element="game"] .ss-main { --wd-max: 72px; }
    }

    /* ---- Between: the cover's squares on the card ground ---- */
    :scope .ss-page[data-element="between"] .wd-cell[data-k="hit"] { background: var(--cover-cream); border-color: var(--cover-cream); color: var(--cover-bg-forest); }
    :scope .ss-page[data-element="between"] .wd-cell[data-k="near"] { background: var(--cover-amber); border-color: var(--cover-amber); color: var(--warning-on); }
    :scope .ss-page[data-element="between"] .wd-cell[data-k="miss"] { background: var(--ss-card); border: 1px solid var(--ss-line); color: var(--muted); }

    /* ---- Game: the cover's forest ground, cream and amber squares, a teal outline for absent ---- */
    :scope .ss-page[data-element="game"] { --wd-pad: 12px; }
    :scope .ss-page[data-element="game"] .wd-slot { background: var(--cover-bg-forest); padding: 12px; }
    :scope .ss-page[data-element="game"] .wd-slot .ss-kicker, :scope .ss-page[data-element="game"] .wd-slot .ss-caption { color: var(--muted); }
    :scope .ss-page[data-element="game"] .wd-cell { border-width: 2px; }
    :scope .ss-page[data-element="game"] .wd-cell[data-k="hit"] { background: var(--cover-cream); border-color: var(--cover-cream); color: var(--cover-bg-forest); }
    :scope .ss-page[data-element="game"] .wd-cell[data-k="near"] { background: var(--cover-amber); border-color: var(--cover-amber); color: var(--warning-on); }
    :scope .ss-page[data-element="game"] .wd-cell[data-k="miss"] { background: transparent; border-color: var(--cover-teal); color: var(--muted); }
    :scope .ss-page[data-element="game"] .wd-cell[data-k="empty"] { background: transparent; border-color: var(--cover-teal); opacity: .4; }
    :scope .ss-page[data-element="game"] .wd-hint { background: var(--cover-teal); }
    /* The solved row: five cream squares fused into one bar, letters still in their columns. */
    :scope .ss-page[data-element="game"] .wd-tiles[data-fused] { gap: 0; }
    :scope .ss-page[data-element="game"] .wd-tiles[data-fused] > .ss-cell { --c: calc(100cqi / 5); }
  `;

  window.PgWord = { Board, HintMarks, Tiles, hintsOf, solvedRow, speak, css, KIND };
})();
