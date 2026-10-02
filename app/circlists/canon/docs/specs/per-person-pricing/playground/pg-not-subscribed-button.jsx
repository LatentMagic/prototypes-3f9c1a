// Not-subscribed Subscription card with its button back: three placements. Each option
// shows the lapsed card (adviser's copy) and the never-subscribed card (current copy).
// Copy is held fixed; only where the button sits changes.
const PG_LAPSED = <>Your subscription ended on 18{'\u00a0'}September{'\u00a0'}2026, so your circles are asleep. Nothing in them has been{'\u00a0'}lost.</>;
const PG_NEVER = <>Joining circles is free. Subscribe to run your{'\u00a0'}own.</>;
const PG_CARDS = [['lapsed', 'Lapsed', PG_LAPSED, 'Subscribe again'], ['never', 'Never subscribed', PG_NEVER, 'Subscribe']];

const PgHead = ({ act }) => (
  <div className="ppp-card-head pgb-head"><div className="ppp-card-title">Subscription</div>{act}</div>
);
const PgAsBuilt = ({ kind }) => (kind === 'never'
  ? <PppNotSubscribed st={{ ...PPP_DEFAULT, status: 'none' }} />
  : <div className="ppp-card"><PgHead /><p className="ppp-card-body">{PG_LAPSED}</p><div className="ppp-btns"><Button variant="secondary">Subscribe again</Button></div></div>);
const PgFull = ({ body, label }) => (
  <div className="ppp-card"><PgHead /><p className="ppp-card-body">{body}</p><div className="ppp-btns"><Button variant="secondary" full>{label}</Button></div></div>
);
const PgInHead = ({ body, label }) => (
  <div className="ppp-card"><PgHead act={<Button variant="secondary">{label}</Button>} /><p className="ppp-card-body">{body}</p></div>
);
const PgFoot = ({ body, label }) => (
  <div className="ppp-card"><PgHead /><p className="ppp-card-body">{body}</p><div className="pgb-foot"><Button variant="secondary">{label}</Button></div></div>
);

// 01.x: full width on a phone (01); at desktop width the card's container query
// picks the arrangement. Same markup for both cards.
const PgCq = ({ v, body, label }) => (
  <div className={'ppp-card pgb-cq pgb-' + v}>
    <PgHead />
    <div className="pgb-wrap"><p className="ppp-card-body">{body}</p><div className="pgb-btn"><Button variant="secondary" full>{label}</Button></div></div>
  </div>
);
const PgRow = (p) => <PgCq v="row" {...p} />;
const PgCard = ({ body, label }) => (
  <div className="ppp-card pgb-cq pgb-card"><div className="pgb-grid"><PgHead /><p className="ppp-card-body">{body}</p><div className="pgb-btn"><Button variant="secondary" full>{label}</Button></div></div></div>
);
const PgTop = ({ body, label }) => (
  <div className="ppp-card pgb-cq pgb-top"><div className="pgb-grid"><PgHead /><p className="ppp-card-body">{body}</p><div className="pgb-btn"><Button variant="secondary" full>{label}</Button></div></div></div>
);
const PgEnd = (p) => <PgCq v="end" {...p} />;
const PgHalf = (p) => <PgCq v="half" {...p} />;

const PgSet = ({ C }) => (
  <>
    {PG_CARDS.map(([k, cap, body, label]) => (
      <React.Fragment key={k}>
        {k === 'lapsed' && <PgFrame cap={cap + ' · 320'} width={320} pad><C kind={k} body={body} label={label} /></PgFrame>}
        <PgFrame cap={cap + ' · 390'} width={390} pad><C kind={k} body={body} label={label} /></PgFrame>
        <PgFrame cap={cap + ' · desktop'} width={720} posture="desktop" pad><C kind={k} body={body} label={label} /></PgFrame>
      </React.Fragment>
    ))}
  </>
);

const PgButtonBoard = () => (
  <PgBoard eyebrow="Per-person pricing · option board" title="The not-subscribed card, with a button"
    lede="Account's Subscription card when you have no subscription. Copy is held fixed: the adviser's lapsed line with Subscribe again, and today's never-subscribed line with Subscribe. Only where the button sits changes. Each option shows both cards.">
    <PgOpt num="00" name="Button under the line" claim="The first pass, as in your screenshot: a content-width button under the line, flush left. Never subscribed is the candidate's current card (link), mounted.">
      <PgSet C={PgAsBuilt} />
    </PgOpt>
    <PgOpt num="01" name="Full width" claim="The button spans the card, the way Update payment card and Switch fill their slots on the subscribed card. One act, so it takes the whole row."
      cost="The heaviest button on Account for a card that is mostly a sentence.">
      <PgSet C={PgFull} />
    </PgOpt>
    <PgOpt num="01.1" name="Full width, then beside the line" claim="01 on a phone. At desktop width the line and the button share one row: the line on the left, the button on the right, centred on the line."
      cost="Two arrangements of one card. A long line pushes the button narrow before it drops below.">
      <PgSet C={PgRow} />
    </PgOpt>
    <PgOpt num="01.1.1" name="Beside, centred on the card" claim="01.1 with the button centred on the heading and the line together, not on the line alone. As in the candidate now."
      cost="The button no longer lines up with either the heading or the line.">
      <PgSet C={PgCard} />
    </PgOpt>
    <PgOpt num="01.1.2" name="Beside, level with the heading" claim="01.1 with the button's top aligned to the heading, so it reads as the head's act and the line runs on underneath."
      cost="With a one-line body, the button sits above the line it answers.">
      <PgSet C={PgTop} />
    </PgOpt>
    <PgOpt num="01.2" name="Full width, then at the end" claim="01 on a phone. At desktop width the button keeps its own width and sits under the line at the right edge, where a dialog puts its act."
      cost="Nothing else on the subscribed card is right-aligned, so the two states read differently.">
      <PgSet C={PgEnd} />
    </PgOpt>
    <PgOpt num="01.3" name="Full width, then half" claim="01 on a phone. At desktop width the button fills the left half, the same slot Update payment card takes on the subscribed card, so the act lands where it will be once you subscribe."
      cost="The right half stays empty, and the button is wider than its label needs.">
      <PgSet C={PgHalf} />
    </PgOpt>
    <PgOpt num="02" name="In the head" claim="The button sits where the subscribed card shows its status marker, opposite the title. The line reads on its own underneath, with no button under it."
      cost="Subscription and Subscribe sit side by side, so the repeat is at its most visible. When the head is too narrow the button drops under the title.">
      <PgSet C={PgInHead} />
    </PgOpt>
    <PgOpt num="03" name="Ruled foot" claim="A hairline under the line and the button below it, flush left, the way Cancel subscription closes the subscribed card. The fact and the act are in separate sections."
      cost="A ruled section for a single button, and it borrows the place the subscribed card gives to its quietest act.">
      <PgSet C={PgFoot} />
    </PgOpt>
  </PgBoard>
);

ReactDOM.createRoot(document.getElementById('root')).render(<PgButtonBoard />);
