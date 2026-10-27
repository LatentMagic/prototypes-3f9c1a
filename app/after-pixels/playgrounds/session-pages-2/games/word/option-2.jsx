// Session pages 2, Daily Word, option 2: "Move by move". The board broken into its moves: each guess, and the hint, is a card in the
// order played, flowing two across on a wide page and one across on a phone (where it reads as the board). The hint card shows the
// five places with its letter in its own, and says it in words.
(function () {
  const WordMoves = ({ s }) => {
    const p = WdModel.read(s);
    const spare = p.live ? p.left : 0;
    const cards = p.events.length + spare;
    return (
      <ol className="wd2" data-odd={cards % 2 ? '1' : undefined}>
        {p.events.map((e, i) => (e.kind === 'guess'
          ? <li key={i} className="wd2-card"><span className="wd2-k">Guess {e.n}</span><WdModel.Row g={e} /></li>
          : <li key={i} className="wd2-card wd2-hint"><span className="wd2-k">Hint · {e.text}</span><WdModel.HintRow h={e} /></li>))}
        {Array.from({ length: spare }, (_, i) => (
          <li key={'e' + i} className="wd2-card wd2-open"><span className="wd2-k">Guess {p.guesses.length + i + 1}</span><WdModel.EmptyRow /></li>))}
      </ol>
    );
  };
  sp2Option('word', 2, {
    name: 'Move by move',
    stance: 'Each guess and the hint as its own card, in the order played: the hint is a move like any other, with its letter in its place and its sentence. Two across on a wide page, so six guesses take three rows.',
    cost: 'The board is no longer one picture: it is read card by card. An odd number of moves leaves the last card spanning the row. Per-letter colours on a play in progress need the engine to send marks; the seed computes them.',
    Component: WordMoves,
  });
})();
