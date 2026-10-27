// Session pages 2, Daily Word, option 3: "Large board, hint beside". The square board, large, on the page itself, with no ground or
// panel behind it (owner, 2026-10-27: as the Backgrounds sheet's idea 3). Beside it on a wide page (under it on a phone) the hint,
// drawn large: its letter in its place among five, labelled "Hint" only; the full sentence is in its aria-label.
(function () {
  const WordCover = ({ s }) => {
    const p = WdModel.read(s);
    const spare = p.live ? p.left : 0;
    const h = p.hint;
    return (
      <div className="wd3">
        <div className="wd3-board">
          {p.guesses.map((g, i) => <WdModel.Row key={i} g={g} />)}
          {Array.from({ length: spare }, (_, i) => <WdModel.EmptyRow key={'e' + i} />)}
        </div>
        {h ? (
          <div className="wd3-hint" role="img" aria-label={WdModel.hintLabel(h)}>
            <div className="wd3-slots" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <span key={i} className={'wd3-slot' + (i === h.pos ? ' is-on' : '')}>{i === h.pos ? h.letter : ''}</span>)}</div>
            <div className="wd3-say" aria-hidden="true"><b>Hint</b></div>
          </div>
        ) : (
          <div className="wd3-hint is-none"><div className="wd3-say"><b>Hint</b><span>Not taken</span></div></div>
        )}
      </div>
    );
  };
  sp2Option('word', 3, {
    name: 'Large board, hint beside',
    stance: 'The square board, large, on the page itself with no panel behind it. The hint stands beside it as large as the board: five places, its letter in its own.',
    cost: 'Nothing frames the play: the board and hint stand on the page as the rest of the page does. When the hint came is not shown. With few guesses the hint is as big as the board, so the hint can outweigh the play. Per-letter colours on a play in progress need the engine to send marks; the seed computes them.',
    Component: WordCover,
  });
})();
