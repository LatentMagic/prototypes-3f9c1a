// Session pages 2, Daily Word, options 1 and 2: the rows board at a fixed width, so its tiles read as a board, not a banner.
// The hint is a slim row of its own, in the order it was taken, with only its letter lit, in its column.
// Option 1 sets the board on the page; option 2 sets the same board inside the design system's Card (the store's card surface and edge).
(function () {
  const Rows = ({ s }) => {
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
  const COST = 'Per-letter colours on a play in progress need the engine to send marks (the record has counts until the day ends); the seed computes them.';
  sp2Option('word', 1, {
    name: 'Rows, fixed width',
    stance: 'The board at a fixed width on the page, tiles close to square, so it reads as a board. The hint is its own slim row where it was taken, its letter lit in its column.',
    cost: 'On a wide page the board leaves the space to its right empty. ' + COST,
    Component: Rows,
  });
  sp2Option('word', 2, {
    name: 'Rows in a card',
    stance: 'The same board inside the store\'s card, which gives it its own edge and gathers the play as one thing.',
    cost: 'A card around the board; on a wide page the board is sized to the screen\'s height, so its tiles are wider than square (about 2 to 1 on an 800px-high screen), centred in the column with space either side. ' + COST,
    Component: ({ s }) => <DS.Card className="wd1-card"><Rows s={s} /></DS.Card>,
  });
})();
