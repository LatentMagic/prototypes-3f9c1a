// After Pixels — Pricing (route `pass`). Re-publishes GsPass, replacing app/gs-billing.jsx's: canon's page with the pay line
// in small type under the price and Choose a plan. The plan picker (`subscribe`) stays canon.
// KEEP: the pay line is right-aligned while the button sits beside the price and left-aligned once the button is full width (640px, as .gs-pass-foot).
import React from 'react';
import { useGs, DS, GS } from './gs-data.jsx';
import { GsCompare } from './gs-parts.jsx';
import { GS_PLAN } from './gs-billing.jsx';

export const GsPass = () => {
  const gs = useGs(); const holds = gs.view === 'pass';
  return (
    <main className="gs-wrap gs-main">
      <div className="gs-pass-page">
        <div className="gs-pass-head">
          <h1 className="gs-h1">After Pixels Pass</h1>
          {holds && <div className="gs-pass-have"><span className="gs-marker"><DS.Icon name="check" />You have the Pass</span><DS.TextLink onClick={() => gs.go('account')}>Manage in account</DS.TextLink></div>}
        </div>
        <GsCompare foot={!holds && (
          <div className="gs-stack-sm">
            <div className="gs-pass-foot">
              <span className="gs-pass-price gs-num-text">{GS_PLAN.yearly.price}<span className="gs-muted"> or {GS_PLAN.monthly.price}</span></span>
              <DS.Button onClick={() => gs.go('subscribe')}>Choose a plan</DS.Button>
            </div>
            <p className="gs-small gs-pu-wrap gs-pu-payline">{GS.purchase}</p>
          </div>
        )} />
      </div>
    </main>
  );
};
