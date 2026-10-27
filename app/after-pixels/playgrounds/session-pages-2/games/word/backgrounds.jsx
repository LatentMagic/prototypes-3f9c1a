// ============================================================================
// Session pages 2, Daily Word: the Backgrounds sheet (?view=backgrounds). One look at several ideas for the ground behind the cover's
// blocks and behind the board: each cell is the cover, then a three-row slice of the board with the hint (guess 2, the hint, guess 3 of
// today's solved play). Palette A's tiles throughout, whatever the colour config says. Rejected grounds are not offered: white, cream,
// indigo #1D1B3A, forest #163328 (owner, 2026-10-27).
// ============================================================================
(function () {
  const A = { hit: '#4CC38A', near: '#E5A63B', miss: '#918B80' };
  // kind: 'field' (a flat ground), 'page' (no panel: the page itself), 'edge', 'frame', 'band', 'grid'.
  // Dusk #7F8FA6 and lilac #A390B2 fields were tried and dropped: the not-in-the-word outline vanishes on them.
  // cover: the cover's own ground where it differs from the panel's (the cover alone carrying colour).
  const IDEAS = [
    { id: 'plum', name: 'Plum', hex: '#421A28', kind: 'field', ground: '#421A28', note: 'the store\'s wine cover ground' },
    { id: 'card', name: 'Card surface', hex: '#262320', kind: 'field', ground: '#262320', note: 'the store\'s card, a step off the page' },
    { id: 'page', name: 'The page, no panel', hex: '#1B1917', kind: 'page', ground: '#1B1917', note: 'tiles straight on the page; the cover edged in the line colour' },
    { id: 'cover-only', name: 'Cover carries colour', hex: '#421A28 / page', kind: 'page', ground: '#1B1917', cover: '#421A28', note: 'a plum cover; the board straight on the page' },
    { id: 'edge', name: 'Line edge', hex: '#37332E on page', kind: 'edge', ground: '#1B1917', edge: '#37332E', note: 'no fill: a page-dark field marked by the store\'s line' },
    { id: 'frame', name: 'Lilac frame', hex: '#A390B2 on page', kind: 'frame', ground: '#1B1917', edge: '#A390B2', note: 'colour as a frame round a page-dark field' },
    { id: 'band', name: 'Teal band', hex: '#328A88 on page', kind: 'band', ground: '#1B1917', edge: '#328A88', note: 'colour as a band along the top edge' },
    { id: 'grid', name: 'The game\'s grid', hex: '#37332E on page', kind: 'grid', ground: '#1B1917', edge: '#37332E', note: 'the ground drawn as empty tiles, the board\'s own grid' },
  ];

  // The cover, drawn here per idea: ground, the idea's structure, then the three blocks in palette A.
  const Cover = ({ idea }) => {
    const g = idea.cover || idea.ground;
    let deco = null;
    if (idea.kind === 'edge') deco = <rect x="1" y="1" width="158" height="118" fill="none" stroke={idea.edge} strokeWidth="2" />;
    if (idea.kind === 'frame') deco = <rect x="4" y="4" width="152" height="112" fill="none" stroke={idea.edge} strokeWidth="8" />;
    if (idea.kind === 'band') deco = <rect x="0" y="0" width="160" height="12" fill={idea.edge} />;
    if (idea.kind === 'grid') deco = <g fill="none" stroke={idea.edge} strokeWidth="2">{Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, c) => <rect key={r + '-' + c} x={4 + c * 31} y={4 + r * 28.5} width="27" height="24.5" />))}</g>;
    return (
      <svg className={'wdb-cover' + (idea.kind === 'page' && !idea.cover ? ' is-edged' : '')} viewBox="0 0 160 120" role="img" aria-label={idea.name + ' cover'}>
        <rect width="160" height="120" fill={g} />
        {deco}
        <rect x="24" y="44" width="32" height="32" fill={A.hit} />
        <rect x="64" y="44" width="32" height="32" fill={A.near} />
        <rect x="106" y="46" width="28" height="28" fill="none" stroke={A.miss} strokeWidth="4" />
      </svg>
    );
  };

  const Slice = ({ idea }) => {
    const p = WdModel.read(GS_SESSIONS['sp2-word-solved']);
    const ev = p.events.slice(1);   // guess 2, the hint, guess 3
    return (
      <div className={'wdb-slice is-' + idea.kind + (idea.light ? ' is-light' : '')} style={{ '--wdb-ground': idea.ground, '--wdb-edge': idea.edge || 'transparent' }}>
        {idea.kind === 'grid' && <WdModel.EmptyRow />}
        {ev.map((e, i) => (e.kind === 'guess' ? <WdModel.Row key={i} g={e} /> : <WdModel.HintRow key={i} h={e} />))}
        {idea.kind === 'grid' && <WdModel.EmptyRow />}
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
          <li key={idea.id} className="wdb-cell">
            <Cover idea={idea} />
            <Slice idea={idea} />
            <div className="wdb-cap"><b>{i + 1}. {idea.name}</b> <span className="wdb-hex">{idea.hex}</span><span className="wdb-note">{idea.note}</span></div>
          </li>
        ))}
      </ol>
    </section>
  );

  window.WdBackgrounds = WdBackgrounds;
})();
