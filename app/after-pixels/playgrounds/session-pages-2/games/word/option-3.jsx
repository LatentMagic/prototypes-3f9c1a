// Session pages 2, Daily Word, option 3: "On a cover's ground". The square board, large, on a dark cover ground (plum, the store's
// wine; no green, indigo, white or cream, owner 2026-10-27): a picture of the play. Beside it on a wide page (under it on a phone)
// the hint, drawn large: its letter in its place among five, labelled "Hint" only; the full sentence is in its aria-label.
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
    name: 'On a cover\'s ground',
    stance: 'The square board, large, on a dark cover ground (plum, the store\'s wine), so the page\'s picture is a cover played out. The hint stands beside it as large as the board: five places, its letter in its own.',
    cost: 'A block of cover colour on the store\'s page, where the shop itself carries none, and not the Daily Word cover\'s own forest ground. When the hint came is not shown. With few guesses the hint is as big as the board, so the hint can outweigh the play. Per-letter colours on a play in progress need the engine to send marks; the seed computes them.',
    Component: WordCover,
  });
})();
