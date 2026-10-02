// Account Subscription card: three arrangements of its three acts, beside the
// candidate's own card (00, mounted). Facts (marker, rows, line) are copied from
// cand-ppp-account.jsx PppSubscribed so only the acts differ — keep in step.
const PG_USER = { email: 'sam@example.com' };
const PG_STATES = [['trial', 'Free month'], ['active', 'Active'], ['failed', 'Payment failed'], ['ending', 'Ending'], ['pending', 'Switch pending']];
const pgSt = (k) => (k === 'pending' ? { ...PPP_DEFAULT, status: 'active', plan: 'monthly', pending: 'yearly' } : { ...PPP_DEFAULT, status: k, plan: 'monthly', pending: null });

const pgFacts = (st) => {
  const plan = PPP_PLANS[st.plan];
  const renew = pppDay(st.status === 'trial' ? PPP_TRIAL_DAYS : PPP_RENEW_DAYS);
  const marker = { trial: 'Free month \u00b7 ' + PPP_TRIAL_DAYS + ' days left', active: 'Active', failed: 'Payment failed', ending: 'Ending' }[st.status];
  const rows = [['plan', 'Plan', plan.label + ' \u00b7 ' + plan.a]];
  if (st.status === 'active') rows.push(['date', 'Next renewal', renew]);
  if (st.status === 'trial') rows.push(['date', 'First payment', plan.price + ' on ' + renew]);
  if (st.status === 'ending') rows.push(['date', 'Ends on', renew]);
  if (st.pending && st.status !== 'ending') rows.push(['from', 'From ' + renew, PPP_PLANS[st.pending].label + ' \u00b7 ' + PPP_PLANS[st.pending].a]);
  let line = null;
  if (st.status === 'trial') line = 'We email you a reminder a week before.';
  if (st.status === 'failed') line = 'Update the card within 30 days to keep your circles awake.';
  if (st.status === 'ending') line = 'Your circles then go to sleep. A member can take one over by starting their own subscription, or free if they already have one. You can resume any time before that date.';
  const canSwitch = (st.status === 'active' || st.status === 'trial') && !st.pending;
  return { marker, tick: st.status === 'active', rows, line, canSwitch, ending: st.status === 'ending', toLabel: 'Switch to ' + pppOther(st.plan), keep: st.pending && st.status !== 'ending' ? 'Keep ' + st.plan : null };
};

const PgHead = ({ f }) => (
  <div className="ppp-card-head">
    <div className="ppp-card-title">Subscription</div>
    <div className="ppp-card-marker">{f.tick && <Icon name="check" size={15} color="var(--color-fg-3)" />}{f.marker}</div>
  </div>
);
const PgRows = ({ f }) => (
  <div className="ppp-rows">{f.rows.map(([id, k, v]) => <div key={id} className="ppp-row"><span className="ppp-row-k">{k}</span><span className="ppp-row-v">{v}</span></div>)}</div>
);
const PgLine = ({ f }) => (f.line ? <p className="ppp-card-line">{f.line}</p> : null);
const PgFoot = () => <p className="ppp-card-foot">Billed to {PG_USER.email}<br />Card ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span></p>;
const red = { color: 'var(--color-destructive)', paddingLeft: 0, paddingRight: 0 };

// 01 One shape: three equal boxes. Row on desktop, a stack on a phone.
const PgV1 = ({ st }) => {
  const f = pgFacts(st);
  return (
    <div className="ppp-card pg-cq">
      <PgHead f={f} /><PgRows f={f} /><PgLine f={f} />
      <div className="pg-v1-btns">
        <Button variant="secondary" full>Update payment card</Button>
        {f.canSwitch && <Button variant="secondary" full>{f.toLabel}</Button>}
        {f.ending ? <Button variant="secondary" full>Resume subscription</Button> : <Button variant="destructive-secondary" full>Cancel subscription</Button>}
      </div>
      <PgFoot />
    </div>
  );
};

// 01.1 One shape, Update keeps its card icon. Same grid as 01: it is a stack or a
// single row, never a 2+1 wrap.
const PgV1i = ({ st }) => {
  const f = pgFacts(st);
  return (
    <div className="ppp-card pg-cq">
      <PgHead f={f} /><PgRows f={f} /><PgLine f={f} />
      <div className="pg-v1-btns pg-v1i-btns">
        <Button variant="secondary" full icon={<Icon name="card" size={16} />}>Update payment card</Button>
        {f.canSwitch && <Button variant="secondary" full>{f.toLabel}</Button>}
        {f.keep && <Button variant="secondary" full>{f.keep}</Button>}
        {f.ending ? <Button variant="secondary" full>Resume subscription</Button> : <Button variant="destructive-secondary" full>Cancel subscription</Button>}
      </div>
      <PgFoot2 />
    </div>
  );
};

// Billing foot as two unbreakable phrases: one line when it fits, otherwise a clean
// break between the phrases. The dot is clipped when a phrase starts a line.
const PgFoot2 = () => (
  <div className="pg-foot2-wrap"><p className="ppp-card-foot pg-foot2"><span>Billed to {PG_USER.email}</span><span>Card ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span></span></p></div>
);

// 02.1 Pair and a foot, with the card icon and the one-line billing foot.
const PgV2i = ({ st }) => {
  const f = pgFacts(st);
  return (
    <div className="ppp-card pg-cq">
      <PgHead f={f} /><PgRows f={f} /><PgLine f={f} />
      <div className="pg-v2-pair">
        <Button variant="secondary" full icon={<Icon name="card" size={16} />}>Update payment card</Button>
        {f.canSwitch && <Button variant="secondary" full>{f.toLabel}</Button>}
        {f.keep && <Button variant="secondary" full>{f.keep}</Button>}
        {f.ending && <Button variant="secondary" full>Resume subscription</Button>}
      </div>
      <PgFoot2 />
      {!f.ending && <div className="pg-v2-end"><Button variant="tertiary" style={red}>Cancel subscription</Button></div>}
    </div>
  );
};

// 02 Pair and a foot: the two neutral acts as an even pair; Cancel leaves the row
// for the card's foot, flush to the content edge.
const PgV2 = ({ st }) => {
  const f = pgFacts(st);
  return (
    <div className="ppp-card pg-cq">
      <PgHead f={f} /><PgRows f={f} /><PgLine f={f} />
      <div className="pg-v2-pair">
        <Button variant="secondary" full>Update payment card</Button>
        {f.canSwitch && <Button variant="secondary" full>{f.toLabel}</Button>}
        {f.ending && <Button variant="secondary" full>Resume subscription</Button>}
      </div>
      <PgFoot />
      {!f.ending && <div className="pg-v2-end"><Button variant="tertiary" style={red}>Cancel subscription</Button></div>}
    </div>
  );
};

// 03 Each act beside its fact: Switch on the Plan row, Resume on Ends on, the card
// gets its own row with Update card. Cancel closes the card, flush left.
const PgArow = ({ k, v, act }) => (
  <div className="pg-arow"><div className="pg-arow-l"><div className="pg-arow-k">{k}</div><div className="pg-arow-v">{v}</div></div>{act}</div>
);
const PgV3 = ({ st }) => {
  const f = pgFacts(st);
  return (
    <div className="ppp-card pg-cq">
      <PgHead f={f} />
      <div className="ppp-rows">
        {f.rows.map(([id, k, v]) => (
          <PgArow key={id} k={k} v={v} act={
            id === 'plan' && f.canSwitch ? <Button variant="secondary">{f.toLabel}</Button>
              : id === 'date' && f.ending ? <Button variant="secondary">Resume subscription</Button> : null} />
        ))}
        <PgArow k="Payment card" v={<>Ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span></>} act={<Button variant="secondary">Update card</Button>} />
      </div>
      <PgLine f={f} />
      <p className="ppp-card-foot">Billed to {PG_USER.email}</p>
      {!f.ending && <div style={{ marginTop: 'var(--space-2)' }}><Button variant="tertiary" style={red}>Cancel subscription</Button></div>}
    </div>
  );
};

// 03.1 03 on desktop; on a phone the row acts leave their rows and stack as
// full-width boxes under the facts (01's alignment). Both sets render; a container
// query shows one. Cancel is red text at the end in both, per the action rule.
const PgV3s = ({ st }) => {
  const f = pgFacts(st);
  const sw = f.canSwitch ? f.toLabel : null;
  const upd = <Button variant="secondary" icon={<Icon name="card" size={16} />}>Update card</Button>;
  return (
    <div className="ppp-card pg-cq pg-v3s">
      <PgHead f={f} />
      <div className="ppp-rows">
        {f.rows.map(([id, k, v]) => (
          <PgArow key={id} k={k} v={v} act={
            id === 'plan' && sw ? <span className="pg-v3s-wide"><Button variant="secondary">{sw}</Button></span>
              : id === 'date' && f.ending ? <span className="pg-v3s-wide"><Button variant="secondary">Resume subscription</Button></span> : null} />
        ))}
        <PgArow k="Payment card" v={<>Ending <span style={{ fontFamily: 'var(--font-mono)' }}>4242</span></>} act={<span className="pg-v3s-wide">{upd}</span>} />
      </div>
      <PgLine f={f} />
      <div className="pg-v3s-narrow pg-v3s-stack">
        <Button variant="secondary" full icon={<Icon name="card" size={16} />}>Update card</Button>
        {sw && <Button variant="secondary" full>{sw}</Button>}
        {f.ending && <Button variant="secondary" full>Resume subscription</Button>}
      </div>
      <p className="ppp-card-foot">Billed to {PG_USER.email}</p>
      {!f.ending && <div style={{ marginTop: 'var(--space-2)' }}><Button variant="tertiary" style={red}>Cancel subscription</Button></div>}
    </div>
  );
};

const PgNotFirst = () => (
  <div className="ppp-card">
    <div className="ppp-card-head"><div className="ppp-card-title">Subscription</div></div>
    <p className="ppp-card-body">Joining circles is free. Subscribe to run your own.</p>
    <div className="ppp-btns"><Button variant="secondary">Subscribe</Button></div>
  </div>
);
const PgNotLink = () => (
  <div className="ppp-card">
    <div className="ppp-card-head"><div className="ppp-card-title">Subscription</div></div>
    <p className="ppp-card-body">Joining circles is free. <button type="button" className="circ-doorlink" style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }}>Subscribe</button> to run your own.</p>
  </div>
);

// N3: the door link, with its hit area padded out to the 44px floor. The
// last two words are joined so the line can't leave one hanging.
const PgNotLink44 = () => (
  <div className="ppp-card">
    <div className="ppp-card-head"><div className="ppp-card-title">Subscription</div></div>
    <p className="ppp-card-body pg-nobreak">Joining circles is free. <button type="button" className="circ-doorlink pg-link44">Subscribe</button> to run your{'\u00a0'}own.</p>
  </div>
);
// N4: keep the button, take the verb out of the line. The line gives the fact
// the button lacks (the price).
const PgNotPrice = () => (
  <div className="ppp-card">
    <div className="ppp-card-head"><div className="ppp-card-title">Subscription</div></div>
    <p className="ppp-card-body pg-nobreak">Joining circles is free. Running your own is {PPP_PLANS.monthly.a.replace(/ /g, '\u00a0')}.</p>
    <div className="ppp-btns"><Button variant="secondary">Subscribe</Button></div>
  </div>
);

// Each card sits in Account's own column: 24px page padding, 720 max on desktop.
const PgWidths = ({ render }) => (
  <>
    <PgFrame cap="Phone · 320" width={320} pad>{render()}</PgFrame>
    <PgFrame cap="Phone · 390" width={390} pad>{render()}</PgFrame>
    <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad>{render()}</PgFrame>
  </>
);

const PgAccountBoard = () => {
  const [k, setK] = usePgSaved('pg_ppp_account_v1', 'active');
  const st = pgSt(k);
  return (
    <PgBoard eyebrow="Per-person pricing · option board" title="The Subscription card's three acts"
      lede="Same card, same rows and lines in every option; only the arrangement of Update payment card, Switch to a plan and Cancel subscription (Resume subscription when ending) changes. Each card is shown in Account's own column at 320, 390 and desktop. Pick a state below; Switch pending and Ending drop to two acts."
      controls={<PgSeg label="State" value={k} options={PG_STATES} onChange={setK} />}>
      <PgOpt num="00" name="As built" claim="The candidate's card, mounted. Since 2 Oct this is 02.1 + N2 + Keep <plan> (ratified, integrated). Before that it was canon's Funding-card arrangement in one wrapping row.">
        <PgWidths render={() => <PppSubscribed st={st} user={PG_USER} />} />
      </PgOpt>
      <PgOpt num="01" name="One shape" claim="All three acts are the same box at the same width: a row of three on desktop, a full-width stack on a phone. No icon. Cancel keeps its box and carries the danger colour in its label (the house destructive-secondary)."
        cost="Cancel sits level with the neutral acts and is told apart by colour alone. The phone stack is three buttons tall.">
        <PgWidths render={() => <PgV1 st={st} />} />
      </PgOpt>
      <PgOpt num="01.1" name="One shape, with the card icon" claim="01 with Update payment card keeping its card icon, so the money act reads apart from the plan act. Row of three only when all three fit at full label; otherwise a stack. Never two-and-one. Billing foot as in 02.1.">
        <PgWidths render={() => <PgV1i st={st} />} />
      </PgOpt>
      <PgOpt num="02.1" name="Pair and a foot, tweaked" claim="02 with the card icon on Update, and the billing foot as two unbreakable phrases: one line when it fits, a clean break between phrases when it does not.">
        <PgWidths render={() => <PgV2i st={st} />} />
      </PgOpt>
      <PgOpt num="02" name="Pair and a foot" claim="Update and Switch are an even pair (side by side when there is room, stacked on a phone). Cancel leaves the group for the card's foot, below the billing line and a hairline, flush to the content edge."
        cost="Cancel is further from the other acts and the card gains a ruled section. Switch pending leaves Update alone in a half-width slot on desktop.">
        <PgWidths render={() => <PgV2 st={st} />} />
      </PgOpt>
      <PgOpt num="03" name="Each act beside its fact" claim="No button row. Switch sits on the Plan row, Resume on the Ends on row, and the card gets a Payment card row carrying Update card. Cancel closes the card. At 320 each row's act drops under its value."
        cost="Departs from canon's Funding card. The Update label shortens to Update card, and the billing footer loses the card number to its row.">
        <PgWidths render={() => <PgV3 st={st} />} />
      </PgOpt>
      <PgOpt num="03.1" name="Beside its fact on desktop, stacked on a phone" claim="03's rows on desktop, where each act sits on the row it changes. On a phone the acts leave their rows and stack full width under the facts, in 01's alignment. Cancel is red text at the end at every width. Update keeps the card icon."
        cost="Two arrangements of one card, so whoever builds it has to keep them in step. The label shortens to Update card at both widths, because a Payment card row now holds the number.">
        <PgWidths render={() => <PgV3s st={st} />} />
      </PgOpt>
      <h2 className="pg-section">Not subscribed</h2>
      <PgOpt num="N0" name="First pass" claim="Static copy of the card before N2 was built in: the line and a secondary Subscribe button.">
        <PgFrame cap="Phone · 320" width={320} pad><PgNotFirst /></PgFrame>
        <PgFrame cap="Phone · 390" width={390} pad><PgNotFirst /></PgFrame>
        <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad><PgNotFirst /></PgFrame>
      </PgOpt>
      <PgOpt num="N1" name="As built" claim="One line and a secondary Subscribe button.">
        <PgFrame cap="Phone · 390" width={390} pad><PppNotSubscribed st={{ ...PPP_DEFAULT, status: 'none' }} /></PgFrame>
        <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad><PppNotSubscribed st={{ ...PPP_DEFAULT, status: 'none' }} /></PgFrame>
      </PgOpt>
      <PgOpt num="N2" name="Subscribe in the line" claim="No button. Subscribe in the sentence is the way in, as the house door link: accent, underlined at rest."
        cost="The target is one word of 15px text, short of the 44px touch floor.">
        <PgFrame cap="Phone · 390" width={390} pad><PgNotLink /></PgFrame>
        <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad><PgNotLink /></PgFrame>
      </PgOpt>
      <PgOpt num="N3" name="Link, full-size target" claim="N2, with the link's hit area padded to 44px tall (invisible, so the line's look doesn't change). The last two words are joined so the line can't strand one word."
        cost="The padded area overlaps the line above and below it; harmless here because nothing else in the card is clickable there.">
        <PgFrame cap="Phone · 320" width={320} pad><PgNotLink44 /></PgFrame>
        <PgFrame cap="Phone · 390" width={390} pad><PgNotLink44 /></PgFrame>
        <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad><PgNotLink44 /></PgFrame>
      </PgOpt>
      <PgOpt num="N4" name="Button, verb out of the line" claim="Keeps the Subscribe button and rewrites the line so it doesn't say subscribe too: Joining circles is free. Running your own is £5 a month. The line now carries the price, which the button can't."
        cost="New copy, not yet ratified. It puts a price on Account, so it has to stay in step with the plans.">
        <PgFrame cap="Phone · 320" width={320} pad><PgNotPrice /></PgFrame>
        <PgFrame cap="Phone · 390" width={390} pad><PgNotPrice /></PgFrame>
        <PgFrame cap="Desktop · Account column" width={720} posture="desktop" pad><PgNotPrice /></PgFrame>
      </PgOpt>
    </PgBoard>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgAccountBoard />);
