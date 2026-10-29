// After Pixels — a product page's play box. Re-publishes GsPlayBox, replacing app/gs-game.jsx's: the label and the line under the
// button are set for the signed-out and free views, and a Pass holder's box has neither. No play box carries the pay line; it lives
// on Pricing. No links sit under the button. The heading, steps and Works with stay as canon has them.
import React from 'react';
import { useGs, GS_GAMES, DS, GS } from './gs-data.jsx';
import { GsSteps } from './gs-parts.jsx';
import { GS_PAGES, gsOr } from './gs-game.jsx';
import { GsHowLink, gsPlayReq } from './gs-connect.jsx';
import { cprBoxCopy, CPR_STAGE, CprPassEnd } from './gs-pass-store.jsx';

export const GsPlayBox = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const b = GS_PAGES[id].box;
  const paying = gs.view === 'pass';
  const mine = !paying ? cprBoxCopy(id) : null;
  const passOnly = CPR_STAGE[id] === 'pass' && !paying;
  const label = g.first && !paying ? b.button : 'Play';
  // A Pass holder's box has no Pass line and no label; a Pass-only box keeps its label and Get the Pass, no line.
  const small = paying || passOnly ? null : mine ? mine[1] : b.small;
  return (
    <DS.Card className="gs-pu-box" style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      {!paying && <span className="gs-label">{mine ? mine[0] : b.label}</span>}
      <h2 className="mcp-t-card">{b.heading}</h2>
      <GsSteps items={[<><b>Connect your AI</b> first. <GsHowLink label="How to connect" /></>, ...b.steps.slice(1).map((s) => gsOr(s))]} />
      {passOnly
        ? <DS.Button block onClick={() => gs.go('pass')}>Get the Pass</DS.Button>
        : <DS.Button block onClick={() => gs.playReq({ ...gsPlayReq(gs, g.name), page: true })}>{label}</DS.Button>}
      {small && (small.endsWith(' comes with the Pass.')
        ? <CprPassEnd className="gs-small gs-pu-wrap" text={small} />
        : <p className="gs-small gs-pu-wrap">{small}</p>)}
      <div className="gs-rule" />
      <div className="gs-stack-sm">
        <span className="gs-label">WORKS WITH</span>
        <p className="gs-small">{GS.works}</p>
      </div>
    </DS.Card>
  );
};
