// ============================================================================
// Playground (pass-upsell-proposal): H, where the pay line sits on the Pass page or the plan picker.
// Re-publishes GsPass and GsSubscribe in this page only. Both are canon's (app/gs-billing.jsx) with the pay line added per variation.
// ============================================================================
// Canon's comparison rows (app/gs-parts.jsx, GS_COMPARE is file-scoped), copied for H3's extra row.
const PGU_CMP = [
  { name: 'Free games', free: true },
  { name: 'The start of select games', free: true },
  { name: 'Streaks and achievements in every game you can play', free: true },
  { name: 'Your results and history', free: true },
  { name: 'Sharing a result', free: true },
  { name: 'Play earlier editions', free: false },
  { name: 'The full game catalog', free: false },
  { name: 'New releases', free: false },
];
const PGU_H3_ROW = { name: PGU_H3_ROW_NAME, sub: 'Purchases only ever happen on this site.', free: true };
const PguMark = ({ on }) => on
  ? <span className="gs-cmp-cell"><DS.Icon name="check" /><span className="gs-vh">Included</span></span>
  : <span className="gs-cmp-cell gs-muted"><span aria-hidden="true">–</span><span className="gs-vh">Not included</span></span>;
const PguCompare = ({ foot }) => (
  <section className="gs-cmp" aria-labelledby="gs-cmp-h">
    <h2 id="gs-cmp-h" className="mcp-t-sec gs-cmp-h">What you get</h2>
    <div role="table" aria-labelledby="gs-cmp-h" className="gs-cmp-t">
      <div role="row" className="gs-cmp-tr is-head">
        <span role="columnheader"><span className="gs-vh">What you get</span></span>
        <span role="columnheader" className="gs-cmp-cell mcp-t-card">Free</span>
        <span role="columnheader" className="gs-cmp-cell gs-cmp-band mcp-t-card">Pass</span>
      </div>
      {[...PGU_CMP, PGU_H3_ROW].map((r) => (
        <div role="row" key={r.name} className={'gs-cmp-tr' + (r === PGU_H3_ROW ? ' pgu-H' : '')}>
          <span role="rowheader" className="gs-cmp-label"><b>{r.name}</b>{r.sub && <span className="gs-muted">{r.sub}</span>}</span>
          <span role="cell"><PguMark on={r.free} /></span>
          <span role="cell" className="gs-cmp-band"><PguMark on /></span>
        </div>
      ))}
      <div className="gs-cmp-tr is-foot" aria-hidden="true"><span /><span /><span className="gs-cmp-band" /></div>
    </div>
    {foot}
  </section>
);

const PguPass = () => {
  const gs = useGs(); const v = usePgu();
  const holds = gs.view === 'pass';
  const Cmp = v.H === 3 ? PguCompare : GsCompare;
  return (
    <main className="gs-wrap gs-main">
      <div className="gs-pass-page">
        <div className="gs-pass-head">
          <h1 className="gs-h1">[Platform] Pass</h1>
          {holds && <div className="gs-pass-have"><span className="gs-marker"><DS.Icon name="check" />You have the Pass</span><DS.TextLink onClick={() => gs.go('account')}>Manage in account</DS.TextLink></div>}
        </div>
        <Cmp foot={!holds && (
          <div className="gs-stack-sm">
            <div className="gs-pass-foot">
              <span className="gs-pass-price gs-num-text">{GS_PLAN.yearly.price}<span className="gs-muted"> or {GS_PLAN.monthly.price}</span></span>
              <DS.Button onClick={() => gs.go('subscribe')}>Choose a plan</DS.Button>
            </div>
            {v.H === 1 && <p className="gs-small pgu-wrap pgu-H pgu-H1">{GS.purchase}</p>}
          </div>
        )} />
      </div>
    </main>
  );
};

const PguSubscribe = () => {
  const gs = useGs(); const v = usePgu();
  const plan = GS_PLAN[gs.choice];
  return (
    <main className="gs-wrap gs-main">
      <section className="gs-buy-block" aria-labelledby="gs-buy-h">
        <h1 id="gs-buy-h" className="mcp-t-sec gs-buy-head">Start your Pass</h1>
        <fieldset className="gs-plans">
          <legend className="gs-vh">Plan</legend>
          {['yearly', 'monthly'].map((k) => (
            <label key={k} className={'gs-plan' + (gs.choice === k ? ' is-on' : '')}>
              <input type="radio" name="gs-plan" value={k} checked={gs.choice === k} onChange={() => gs.setChoice(k)} />
              <span className="gs-plan-dot" aria-hidden="true" />
              <span className="gs-plan-name">{GS_PLAN[k].name}</span>
              {k === 'yearly' && <DS.Tag kind="success">{GS_YEAR_MONTH}</DS.Tag>}
              <span className="gs-plan-price gs-num-text">{GS_PLAN[k].per}</span>
            </label>
          ))}
        </fieldset>
        <GsRows rows={[['Due today', plan.due], ['Renews', gsLong(gsAddMonths(GS_DAY0, plan.months))]]} />
        <DS.Button block onClick={gs.getPass}>Get the Pass</DS.Button>
        {v.H === 2 && <p className="gs-small gs-center pgu-wrap pgu-H">{GS.purchase}</p>}
      </section>
    </main>
  );
};

Object.assign(window, { GsPass: PguPass, GsSubscribe: PguSubscribe });
