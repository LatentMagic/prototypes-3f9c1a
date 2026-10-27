// Session pages 2, Daily Word, option 3: "The board on the cover's ground". The square board, large, on the cover's cream, as the
// cover is drawn: a picture of the play. Beside it on a wide page (under it on a phone) the hint, drawn large: its letter in a tile
// twice the board's size, named by its place and when it was taken.
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
            <div className="wd3-say" aria-hidden="true"><b>Hint</b><span>Letter {h.pos + 1} is {h.letter}</span><span>after guess {h.after}</span></div>
          </div>
        ) : (
          <div className="wd3-hint is-none"><div className="wd3-say"><b>Hint</b><span>Not taken</span></div></div>
        )}
      </div>
    );
  };
  sp2Option('word', 3, {
    name: 'On the cover\'s ground',
    stance: 'The square board, large, on the cover\'s cream ground, so the page\'s picture is the cover played out. The hint stands beside it as large as the board: five places, its letter in its own, when it came.',
    cost: 'A large light panel on the store\'s dark page. With few guesses the hint is as big as the board, so the hint can outweigh the play. Per-letter colours on a play in progress need the engine to send marks; the seed computes them.',
    Component: WordCover,
  });
})();
