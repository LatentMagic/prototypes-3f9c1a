// ============================================================================
// Session pages 2, Daily Word: the Backgrounds sheet (?view=backgrounds). One look at eight ideas for the ground behind the cover's
// blocks and behind the board: each cell is the cover, then three rows of the board with the hint (guess 2, the hint, guess 3 of
// today's solved play). Palette A's tiles throughout, whatever the colour config says. Not offered, by the owner's rulings (2026-10-27):
// white, cream, indigo #1D1B3A, forest #163328.
// ============================================================================
(function () {
  const A = { hit: '#4CC38A', near: '#E5A63B', miss: '#918B80', missFill: '#37332E' };
  // kind: 'field' (a flat ground), 'page' (no panel), 'frame', 'band' (a stripe through the middle), 'grid' (the board's own cells).
  // fillMiss: a letter not in the word is a filled tile, so it holds on a mid-tone ground where an outline would vanish.
  const IDEAS = [
    { id: 'plum', name: 'Plum', hex: '#421A28', kind: 'field', ground: '#421A28' },
    { id: 'card', name: 'Card surface', hex: '#262320', kind: 'field', ground: '#262320' },
    { id: 'page', name: 'The page, no panel', hex: '#1B1917', kind: 'page', ground: '#1B1917' },
    { id: 'dusk', name: 'Dusk, filled misses', hex: '#7F8FA6', kind: 'field', ground: '#7F8FA6', light: true, fillMiss: true },
    { id: 'lilac', name: 'Lilac, filled misses', hex: '#A390B2', kind: 'field', ground: '#A390B2', light: true, fillMiss: true },
    { id: 'frame', name: 'Lilac frame', hex: '#A390B2 on page', kind: 'frame', ground: '#1B1917', edge: '#A390B2' },
    { id: 'band', name: 'Teal stripe', hex: '#328A88 on page', kind: 'band', ground: '#1B1917', edge: '#328A88' },
    { id: 'grid', name: 'The game\'s grid', hex: '#37332E on page', kind: 'grid', ground: '#1B1917', edge: '#37332E' },
  ];

  // The cover, per idea. A frame is drawn on the box edge (CSS), so it survives the crop. It fills its box as canon's covers do (the ground extends, the blocks stay centred).
  // The grid idea draws 5 x 4 cells (pitch 32 x 30) and puts the three blocks in three cells of the second row.
  const Cover = ({ idea }) => {
    let deco = null;
    let blocks = [[24, 44, 32], [64, 44, 32], [104, 44, 32]];
    if (idea.kind === 'band') deco = <rect x="-200" y="36" width="560" height="48" fill={idea.edge} />;
    if (idea.kind === 'grid') {
      const cells = [];
      for (let r = -1; r < 5; r++) for (let c = -3; c < 8; c++) cells.push(<rect key={r + '/' + c} x={c * 32 + 3} y={r * 30 + 3} width="26" height="24" />);
      deco = <g fill="none" stroke={idea.edge} strokeWidth="2">{cells}</g>;
      blocks = [[1 * 32 + 3, 1 * 30 + 3, 26], [2 * 32 + 3, 1 * 30 + 3, 26], [3 * 32 + 3, 1 * 30 + 3, 26]].map(([x, y, w]) => [x, y + 30, w]);
    }
    const miss = blocks[2];
    // The block not in the word, as on the cover (word.css .wd-cover-miss): drawn at its full block, a small thin outline at rest,
    // full and filled on hover, focus or a tap. A filled-misses idea keeps it filled.
    return (
      <svg className={'wdb-cover' + (idea.kind === 'page' ? ' is-edged' : '') + (idea.kind === 'frame' ? ' is-framed' : '')} style={{ '--wdb-edge': idea.edge || 'transparent' }} viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" role="img" aria-label={idea.name + ' cover'} tabIndex={idea.fillMiss ? undefined : 0}>
        <rect x="-200" y="0" width="560" height="120" fill={idea.ground} />
        {deco}
        <rect x={blocks[0][0]} y={blocks[0][1]} width={blocks[0][2]} height={idea.kind === 'grid' ? 24 : blocks[0][2]} fill={A.hit} />
        <rect x={blocks[1][0]} y={blocks[1][1]} width={blocks[1][2]} height={idea.kind === 'grid' ? 24 : blocks[1][2]} fill={A.near} />
        {idea.fillMiss
          ? (idea.kind === 'grid' ? <rect x={miss[0]} y={miss[1]} width={miss[2]} height="24" fill={A.missFill} /> : <rect x="106" y="46" width="28" height="28" fill={A.missFill} />)
          : <rect className="wd-cover-miss" x={miss[0]} y={miss[1]} width={miss[2]} height={idea.kind === 'grid' ? 24 : miss[2]} style={{ fill: A.miss, stroke: A.miss }} />}
      </svg>
    );
  };

  const Slice = ({ idea }) => {
    const p = WdModel.read(GS_SESSIONS['sp2-word-solved']);
    const ev = p.events.slice(1);   // guess 2, the hint, guess 3
    return (
      <div className={'wdb-slice is-' + idea.kind + (idea.light ? ' is-light' : '')} style={{ '--wdb-ground': idea.ground, '--wdb-edge': idea.edge || 'transparent' }}>
        {ev.map((e, i) => (e.kind === 'guess' ? <WdModel.Row key={i} g={e} /> : <WdModel.HintRow key={i} h={e} />))}
      </div>
    );
  };

  const WdBackgrounds = () => (
    <section className="wdb">
      <header className="wdb-head">
        <h1 className="gs-h1">Backgrounds</h1>
        <p className="gs-muted">The cover, and three rows of the board with the hint, on each idea. Palette A's tiles throughout.</p>
      </header>
      <ol className="wdb-grid">
        {IDEAS.map((idea, i) => (
          <li key={idea.id} className={'wdb-cell' + (idea.fillMiss ? ' is-fillmiss' : '')}>
            <Cover idea={idea} />
            <Slice idea={idea} />
            <div className="wdb-cap"><b>{i + 1}. {idea.name}</b><span className="wdb-hex">{idea.hex}</span></div>
          </li>
        ))}
      </ol>
    </section>
  );

  window.WdBackgrounds = WdBackgrounds;
})();
