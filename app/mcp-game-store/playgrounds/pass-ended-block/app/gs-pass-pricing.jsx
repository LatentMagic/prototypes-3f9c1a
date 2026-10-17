// [Platform] — Pricing (route `pass`). Re-publishes GsPass: canon's page (app/gs-billing.jsx) with the pay line
// in small type under the price and Choose a plan (owner, 2026-10-16). Right-aligned while the button sits beside the price,
// left-aligned once it is full width (the same 640px switch as .gs-pass-foot). The plan picker (`subscribe`) stays canon.
const CprPass = () => {
  const gs = useGs(); const holds = gs.view === 'pass';
  return (
    <main className="gs-wrap gs-main">
      <div className="gs-pass-page">
        <div className="gs-pass-head">
          <h1 className="gs-h1">[Platform] Pass</h1>
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
Object.assign(window, { GsPass: CprPass });
