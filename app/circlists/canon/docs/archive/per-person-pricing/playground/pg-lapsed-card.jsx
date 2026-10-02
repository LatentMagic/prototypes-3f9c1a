// Account Subscription card when lapsed (free month used, no subscription) and you
// champion sleeping circles. 00 mounts the candidate's card; 01 and 02 are copies in
// its classes so only the words and acts differ.
const PgL = ({ children }) => (
  <div className="ppp-card"><div className="ppp-card-head"><div className="ppp-card-title">Subscription</div></div>{children}</div>
);
const PgLink = ({ children }) => <button type="button" className="circ-doorlink pg-link44">{children}</button>;

const PgLapsedLine = () => (
  <PgL><p className="ppp-card-body pg-nobreak">Your subscription has ended, so your circles are asleep. <PgLink>Subscribe</PgLink> to wake{'\u00a0'}them.</p></PgL>
);
const PgLapsedLineDate = () => (
  <PgL><p className="ppp-card-body pg-nobreak">Your subscription ended on 18{'\u00a0'}September{'\u00a0'}2026, so your circles are asleep. <PgLink>Subscribe</PgLink> to wake{'\u00a0'}them.</p></PgL>
);
const PgLapsedEnded = () => (
  <div className="ppp-card">
    <div className="ppp-card-head"><div className="ppp-card-title">Subscription</div><div className="ppp-card-marker">Ended</div></div>
    <div className="ppp-rows">
      <div className="ppp-row"><span className="ppp-row-k">Plan</span><span className="ppp-row-v">Monthly {'\u00b7'} £5{'\u00a0'}a{'\u00a0'}month</span></div>
      <div className="ppp-row"><span className="ppp-row-k">Ended on</span><span className="ppp-row-v">18{'\u00a0'}September{'\u00a0'}2026</span></div>
    </div>
    <p className="ppp-card-line">Your circles are asleep. Everything in them is still here.</p>
    <div className="ppp-btns"><Button variant="secondary">Subscribe again</Button></div>
  </div>
);

const PgW = ({ render }) => (
  <>
    <PgFrame cap="Phone · 320" width={320} pad>{render()}</PgFrame>
    <PgFrame cap="Phone · 390" width={390} pad>{render()}</PgFrame>
    <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad>{render()}</PgFrame>
  </>
);

const PgLapsedBoard = () => (
  <PgBoard eyebrow="Per-person pricing · option board" title="The Subscription card when lapsed"
    lede="Account, after your subscription has ended and your circles are asleep. Someone who never subscribed, or who lapsed without championing a circle, keeps today's card in every option. Home and the sleeping circle already say the circles are asleep.">
    <PgOpt num="00" name="As built: one card" claim="The never-subscribed card, unchanged. Mounted from the candidate."
      cost="Account, where people go about billing, says nothing about the sleeping circles.">
      <PgW render={() => <PppNotSubscribed st={{ ...PPP_DEFAULT, status: 'none', usedFreeMonth: true }} />} />
    </PgOpt>
    <PgOpt num="01" name="Lapsed line" claim="Same shape as 00, one sentence and the door link. The sentence says what lapsing did and what Subscribe does about it."
      cost="One more card state. New copy, not yet ratified.">
      <PgW render={() => <PgLapsedLine />} />
    </PgOpt>
    <PgOpt num="01.1" name="Lapsed line, with the end date" claim="01 with the date the subscription ended, so the line says when as well as what. The date is held whole."
      cost="The longest line of the three; at 320 it runs to four lines. New copy, not yet ratified.">
      <PgW render={() => <PgLapsedLineDate />} />
    </PgOpt>
    <PgOpt num="02" name="Ended card" claim="The subscribed card's shape carried on past the end: an Ended marker, the last plan and the end date, the line from the sleeping circle, and a Subscribe again button."
      cost="The heaviest of the three, and the card keeps a record of a subscription you no longer have. New copy, not yet ratified.">
      <PgW render={() => <PgLapsedEnded />} />
    </PgOpt>
  </PgBoard>
);

ReactDOM.createRoot(document.getElementById('root')).render(<PgLapsedBoard />);
