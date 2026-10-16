// ============================================================================
// Playground (pass-upsell-proposal): the product page's play box (B1 to B3). Re-publishes GsPlayBox in this page only:
// canon's box (app/gs-game.jsx) with the label and the line under the button set per variation for the signed-out and free
// views. The button, steps, Works with, the pay line after a Pass line, and the links stay as canon has them. A Pass holder sees canon.
// ============================================================================
const PguPlayBox = ({ id }) => {
  const gs = useGs(); const v = usePgu();
  const g = GS_GAMES[id]; const b = GS_PAGES[id].box;
  const paying = gs.view === 'pass';
  const label = b.first && !paying ? b.button : 'Play';
  const canon = b.first && gs.view !== 'out' && b.small ? b.small.slice(b.small.indexOf('. ') + 2) : b.small;
  const mine = !paying ? pguBoxCopy(id, v) : null;
  const small = mine ? mine[1] : canon;
  // B2: a free first part's box is about playing, so no pay line (owner, 2026-10-16). Design 4 links "the Pass" in its line, so the separate link goes.
  const firstBox = b.first && !paying;
  const inPass = ((firstBox && v.B2 === 4) || (PGU_STAGE[id] === 'pass' && !paying && v.B3 === 4)) && small && small.endsWith(' comes with the Pass.');
  const pay = !b.free && !firstBox && !(PGU_STAGE[id] === 'pass' && v.B3 === 4 && !paying);
  return (
    <DS.Card className="pgu-B" style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">{mine ? mine[0] : b.label}</span>
      <h2 className="mcp-t-card">{b.heading}</h2>
      <GsSteps items={[<><b>Connect your AI</b> first. <GsHowLink label="How to connect" /></>, ...b.steps.slice(1).map((s) => gsOr(s))]} />
      {b.free || b.first || paying
        ? <DS.Button block onClick={() => gs.play(g.name)}>{label}</DS.Button>
        : <DS.Button block onClick={() => gs.go('pass')}>Get the Pass</DS.Button>}
      {small && <p className="gs-small pgu-wrap">{inPass
        ? <>{small.slice(0, -'the Pass.'.length)}<button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</>
        : small}{pay && ' ' + GS.purchase}</p>}
      {firstBox && !inPass && <div><DS.TextLink onClick={() => gs.go('pass')}>Get the Pass</DS.TextLink></div>}
      {!b.free && !b.first && !paying && !(PGU_STAGE[id] === 'pass' && v.B3 === 4) && <div><DS.TextLink onClick={() => gs.go('games')}>Play a free game</DS.TextLink></div>}
      <div className="gs-rule" />
      <div className="gs-stack-sm">
        <span className="gs-label">WORKS WITH</span>
        <p className="gs-small">{GS.works}</p>
      </div>
    </DS.Card>
  );
};
Object.assign(window, { GsPlayBox: PguPlayBox });
