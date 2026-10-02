// Subscription page on a phone: three ways to say the free month, the yearly saving
// and the card terms, beside the candidate's page (00, mounted).
const PgPhonePair = ({ render }) => {
  const Frame = ({ w, h }) => {
    const [pick, setPick] = React.useState('yearly');
    return <PgFrame cap={'Phone \u00b7 ' + w} width={w} minH={h}><PgPage>{render(pick, setPick)}</PgPage></PgFrame>;
  };
  return <><Frame w={390} h={844} /><Frame w={320} h={640} /></>;
};

const PgSubscribePhoneBoard = () => {
  const [s, setS, used] = usePgPageState('pg_ppp_subscribe_phone_v1');
  return (
    <PgBoard eyebrow="Per-person pricing · option board" title="The subscription page, on a phone"
      lede="What changes: how the free month is said, how the yearly saving is said so it does not compete with it, and where the card terms sit. Held in 01 to 03: the heading, the two ticks and the button, with the lede broken after its first sentence so it reads as two lines rather than one narrow block. Plans can be picked in every frame. Switch the state to see the page for someone who has had their free month."
      controls={<PgSeg label="State" value={s} options={PG_PAGE_STATES} onChange={setS} />}>
      <PgOpt num="00" name="As built" claim="The candidate's page, mounted. Pill reads 2 months free; the trial is the bold line under the plans; the card terms sit left-aligned under the ticks.">
        <PgFrame cap="Phone · 390" width={390} minH={844}><PricingScreen /></PgFrame>
        <PgFrame cap="Phone · 320" width={320} minH={640}><PricingScreen /></PgFrame>
      </PgOpt>
      <PgOpt num="01" name="Receipt" claim="Under the plans, two ruled rows say what is paid and when: Due today £0.00, then the plan's price from the date the month ends. The pill becomes Save £10, so free means only the trial. The card terms become one centred line under the button. Tweaked 2 Oct: ticks centred as a group; each lede sentence and each terms sentence holds whole; prices and dates never split; desktop frame added."
        cost="Two rules and a second small line join the page. Save £10 is plainer than 2 months free and may sell the yearly plan less.">
        {(() => {
          const page01 = (pick, setPick, w, v1) => (
            <div className="pg-col pg-col-c" style={w ? { maxWidth: w } : null}>
              <PgHeadBlock used={used} nb align="center" lede={v1 ? 'Subscribe to run your own circles.' : null} />
              <div><PgPlans pick={pick} setPick={setPick} pill="Save £10" /><div style={{ marginTop: 16 }}><PgReceipt used={used} plan={pick} /></div></div>
              <PgBullets center />
              <PgAct used={used} nb noCard={v1} />
            </div>
          );
          const Desk01 = ({ v1 }) => { const [pick, setPick] = React.useState('yearly'); return <PgScaled cap="Desktop · 1280 × 800"><PgPage>{page01(pick, setPick, 400, v1)}</PgPage></PgScaled>; };
          return <><PgPhonePair render={(pick, setPick) => page01(pick, setPick)} /><Desk01 /></>;
        })()}
      </PgOpt>
      <PgOpt num="01.1" name="Receipt, one free" claim="01 with two changes, in the free-month state only. The lede becomes Subscribe to run your own circles., so free under the heading means only the free month; the tick Everyone you invite joins free still says joining is free. A card is needed to start. is cut; the terms line is the cancel date alone. Free month used is the same as 01."
        cost="Loses Joining circles is free. from the trial page, which is the page's clearest line for someone who has never paid.">
        {(() => {
          const page = (pick, setPick, w) => (
            <div className="pg-col pg-col-c" style={w ? { maxWidth: w } : null}>
              <PgHeadBlock used={used} nb align="center" lede="Subscribe to run your own circles." />
              <div><PgPlans pick={pick} setPick={setPick} pill="Save £10" /><div style={{ marginTop: 16 }}><PgReceipt used={used} plan={pick} /></div></div>
              <PgBullets center />
              <PgAct used={used} nb noCard />
            </div>
          );
          const Desk = () => { const [pick, setPick] = React.useState('yearly'); return <PgScaled cap="Desktop · 1280 × 800"><PgPage>{page(pick, setPick, 400)}</PgPage></PgScaled>; };
          return <><PgPhonePair render={(pick, setPick) => page(pick, setPick)} /><Desk /></>;
        })()}
      </PgOpt>
      <PgOpt num="01.2" name="Receipt, one free, scaled heading" claim="01.1 with one change: the heading scales with the page width, from 24px on a 320 phone to 30px at 390 and up, so Start your free month holds one line and sits as wide as the page. Same as 01.1 from 390 up."
        cost="Between 320 and 390 the heading falls between steps on the type scale.">
        {(() => {
          const page = (pick, setPick, w) => (
            <div className="pg-hcq"><div className="pg-col pg-col-c pg-h-small" style={w ? { maxWidth: w } : null}>
              <PgHeadBlock used={used} nb align="center" lede="Subscribe to run your own circles." />
              <div><PgPlans pick={pick} setPick={setPick} pill={'Save \u00a310'} /><div style={{ marginTop: 16 }}><PgReceipt used={used} plan={pick} /></div></div>
              <PgBullets center />
              <PgAct used={used} nb noCard />
            </div></div>
          );
          return <PgPhonePair render={(pick, setPick) => page(pick, setPick)} />;
        })()}
      </PgOpt>
      <PgOpt num="02" name="The offer under the heading" claim="The trial sentence moves up to sit under the heading, in its weight: 30 days free, then £50 a year. It follows the plan you pick. No pill; the yearly card says what it works out at per month. Card terms centred under the button."
        cost="The heading block grows to three lines before any choice. £4.17 a month is arithmetic, not a reason, and the saving is no longer named.">
        <PgPhonePair render={(pick, setPick) => {
          const p = PPP_PLANS[pick];
          return (
            <div className="pg-col">
              <PgHeadBlock used={used} offer={<p className="pg-offer">{used ? p.a + ', from today' : '30 days free, then ' + p.a}</p>} />
              <PgPlans pick={pick} setPick={setPick} subs={{ yearly: '\u00a34.17 a month' }} />
              <PgBullets />
              <PgAct used={used} />
            </div>
          );
        }} />
      </PgOpt>
      <PgOpt num="03" name="Timeline" claim="Under the plans, the month is drawn as three dated steps: today it starts and a card is needed, a reminder a week before, then the first payment with the way out. The card terms live in the steps, so nothing sits under the button. The pill keeps its 2 months free wording, to test whether it still competes once the trial is drawn."
        cost="The tallest of the three; on a 320 phone the button falls below the first screen. A timeline is a common trial pattern, so it reads as familiar rather than ours.">
        <PgPhonePair render={(pick, setPick) => (
          <div className="pg-col">
            <PgHeadBlock used={used} />
            <PgPlans pick={pick} setPick={setPick} pill="2 months free" />
            <PgTimeline used={used} plan={pick} />
            <PgBullets />
            <PgAct used={used} quiet={false} />
          </div>
        )} />
      </PgOpt>
    </PgBoard>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgSubscribePhoneBoard />);
