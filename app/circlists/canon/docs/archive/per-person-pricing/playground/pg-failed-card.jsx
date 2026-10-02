// The Account card on Payment failed: Update payment card stands alone, and as the
// built pair's only child it stretches the card's full width. Three ways to hold one
// act, beside the candidate's own card (00, PppSubscribed mounted). Facts copied from
// cand-ppp-account.jsx PppSubscribed so only the act differs; keep in step.
const PG_FC_USER = { email: 'priya.n@example.com' };
const PG_FC_ST = { ...PPP_DEFAULT, status: 'failed', plan: 'monthly', pending: null, sheet: null };
const pgFcNoop = () => {};
const PgFcFacts = () => (
  <>
    <div className="ppp-card-head"><div className="ppp-card-title">Subscription</div><div className="ppp-card-marker">Payment failed</div></div>
    <div className="ppp-rows"><div className="ppp-row"><span className="ppp-row-k">Plan</span><span className="ppp-row-v">{'Monthly \u00b7 ' + pppNb('£5 a month')}</span></div></div>
  </>
);
const PgFcLine = () => <p className="ppp-card-line">Update the card within 30 days to keep your circles awake.</p>;
const PgFcBilled = () => (
  <div className="ppp-foot-wrap"><p className="ppp-card-foot ppp-foot"><span>Billed to {PG_FC_USER.email}</span><span>Card ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span></span></p></div>
);
const PgFcCancel = () => (
  <div className="ppp-end"><Button variant="tertiary" style={{ color: 'var(--color-destructive)', paddingLeft: 0, paddingRight: 0 }} onClick={pgFcNoop}>Cancel subscription</Button></div>
);
const PgFcUpdate = ({ variant = 'secondary' }) => <Button variant={variant} icon={<Icon name="card" size={16} />} onClick={pgFcNoop}>Update payment card</Button>;

// 02 The act beside the line it answers: line left, button right from 440; stacked below.
const PgFc2 = () => (
  <div className="ppp-card ppp-card-cq">
    <PgFcFacts />
    <div className="pg-fc-beside"><PgFcLine /><PgFcUpdate /></div>
    <PgFcBilled /><PgFcCancel />
  </div>
);

// 02.1 02 as a row of the card's table: the line is the row's key, the act its value,
// under the same hairline as Plan. The right edge carries the value, then the act.
const PgFc21 = () => (
  <div className="ppp-card ppp-card-cq">
    <PgFcFacts />
    <div className="pg-fc-trow"><span className="pg-fc-tline">Update the card within 30 days to keep your circles{'\u00a0'}awake.</span><PgFcUpdate /></div>
    <PgFcBilled /><PgFcCancel />
  </div>
);

// 04 The act beside the card it replaces: the line stays where it is; the billing
// foot becomes the act's row, Card ending 4242 on the left, Update payment card on the right.
const PgFc4 = () => (
  <div className="ppp-card ppp-card-cq">
    <PgFcFacts /><PgFcLine />
    <div className="pg-fc-cardrow">
      <p className="ppp-card-foot pg-fc-cardfoot"><span>Billed to {PG_FC_USER.email}</span><span>Card ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span></span></p>
      <PgFcUpdate />
    </div>
    <PgFcCancel />
  </div>
);

// 05 The problem and its fix as one object: a sunken panel (the Switch and Cancel
// panel's surface) holds the line and the act. Neutral, no colour.
const PgFc5 = () => (
  <div className="ppp-card ppp-card-cq">
    <PgFcFacts />
    <div className="pg-fc-panel"><span className="pg-fc-pline">Update the card within 30 days to keep your circles{'\u00a0'}awake.</span><PgFcUpdate /></div>
    <PgFcBilled /><PgFcCancel />
  </div>
);

const PgFcWidths = ({ render }) => (
  <>
    <PgFrame cap="Phone · 320" width={320} pad>{render()}</PgFrame>
    <PgFrame cap="Phone · 390" width={390} pad>{render()}</PgFrame>
    <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad>{render()}</PgFrame>
  </>
);

const PgFailedBoard = () => (
  <PgBoard eyebrow="Per-person pricing · option board" title="The Account card on Payment failed"
    lede="The card's only act is Update payment card, so the built pair stretches it across the card. The real card at 320, 390 and the desktop Account column. Facts, line and billing foot are held fixed; only where the act sits changes. 02 was picked over 01 and 03 (Joe, 2 Oct); 02.1 refines it, 04 and 05 are new ideas.">
    <PgOpt num="00" name="As built" claim="The candidate's card, mounted: the pair's only child spans the full width at every size.">
      <PgFcWidths render={() => <PppSubscribed st={PG_FC_ST} user={PG_FC_USER} />} />
    </PgOpt>
    <PgOpt num="02" name="Beside the line" claim="The line and its fix share a row on desktop; on a phone the button sits under the line, full width."
      cost="Reads as tiers: Plan's value and the button stack at the right edge with uneven gaps between them.">
      <PgFcWidths render={() => <PgFc2 />} />
    </PgOpt>
    <PgOpt num="02.1" name="Beside the line, as a row" claim="02 brought into the card's table. The line and the button make one row under the same hairline as Plan, with the same padding, so the right edge reads value, then act, row by row. On a phone the row stacks: line, then the button full width."
      cost="The line takes the row-key style (14px, the Plan label's grey) rather than the card's line style. The row is taller than Plan's, because the button sets its height.">
      <PgFcWidths render={() => <PgFc21 />} />
    </PgOpt>
    <PgOpt num="04" name="Beside the card it replaces" claim="The act moves to the billing foot: Billed to and Card ending 4242 on the left, Update payment card on the right, so the fix sits next to the card it changes. The line stays as built."
      cost="The act is a step away from the line that asks for it, and the foot holds a button only in this state.">
      <PgFcWidths render={() => <PgFc4 />} />
    </PgOpt>
    <PgOpt num="05" name="One panel" claim="The problem and its fix as one object: the line and the button on a sunken panel, the surface the Switch and Cancel panels use. Side by side on desktop, stacked on a phone."
      cost="A second surface inside the card, which only this state has. Close to a notice box, even though it's neutral.">
      <PgFcWidths render={() => <PgFc5 />} />
    </PgOpt>
  </PgBoard>
);

ReactDOM.createRoot(document.getElementById('root')).render(<PgFailedBoard />);
