// Session pages 2, Daily Word, option 1: "Rows across the page". The board stretched to the full width: each guess is a band of
// five wide tiles, so the board fills the page at every width and stays short with all six guesses. The hint is a row of its own,
// in the order it was taken, with only its letter lit, in its column.
(function () {
  const WordRows = ({ s }) => {
    const p = WdModel.read(s);
    const spare = p.live ? p.left : 0;
    return (
      <div className="wd1">
        {p.events.map((e, i) => (e.kind === 'guess' ? <WdModel.Row key={i} g={e} />
          : <div key={i} className="wd1-hint"><WdModel.HintRow h={e} /></div>))}
        {Array.from({ length: spare }, (_, i) => <WdModel.EmptyRow key={'e' + i} />)}
      </div>
    );
  };
  sp2Option('word', 1, {
    name: 'Rows across the page',
    stance: 'The board at the page\'s full width: each guess a band of five wide tiles, so nothing sits empty beside it and six guesses stay short. The hint is its own slim row where it was taken, its letter lit in its column.',
    cost: 'Wide tiles are not the square tiles players know from the chat. Per-letter colours on a play in progress need the engine to send marks (the record has counts until the day ends); the seed computes them.',
    Component: WordRows,
  });
})();
