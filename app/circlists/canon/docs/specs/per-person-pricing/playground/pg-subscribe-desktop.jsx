// Subscription page on desktop: three layouts beside the candidate's (00, mounted).
// 01 to 03 carry the Receipt content from the phone board (option 01) so only the
// layout differs.
const PgDesk = ({ render }) => {
  const [pick, setPick] = React.useState('yearly');
  return <PgScaled cap="Desktop · 1280 × 800"><PgPage>{render(pick, setPick)}</PgPage></PgScaled>;
};

const PgSubscribeDesktopBoard = () => {
  const [s, setS, used] = usePgPageState('pg_ppp_subscribe_desktop_v1');
  return (
    <PgBoard eyebrow="Per-person pricing · option board" title="The subscription page, on desktop"
      lede="Three layouts for the same page at 1280, scaled to fit. 01 to 03 hold the content of the phone board's Receipt option (Save £10, the two ruled rows, one centred terms line) so that only the layout differs; whichever content wins on the phone carries into the chosen layout. Plans can be picked in every frame."
      controls={<PgSeg label="State" value={s} options={PG_PAGE_STATES} onChange={setS} />}>
      <PgOpt num="00" name="As built" claim="The candidate's page, mounted: two columns, heading and ticks on the left, plans and button on the right.">
        <PgScaled cap="Desktop · 1280 × 800"><PricingScreen /></PgScaled>
      </PgOpt>
      <PgOpt num="01" name="Centred column" claim="The phone page, centred at the wizard's offset, as the page was before. One column, one reading order, same as every other wizard step."
        cost="Most of the screen is empty on either side. Defensible as the wizard's convention, but it is the phone page with bigger margins.">
        <PgDesk render={(pick, setPick) => (
          <div className="pg-col" style={{ maxWidth: 400 }}>
            <PgHeadBlock used={used} align="center" />
            <div><PgPlans pick={pick} setPick={setPick} pill="Save £10" /><div style={{ marginTop: 16 }}><PgReceipt used={used} plan={pick} /></div></div>
            <PgBullets />
            <PgAct used={used} />
          </div>
        )} />
      </PgOpt>
      <PgOpt num="02" name="Centred, plans side by side" claim="Still centred, but wider: the ticks run as one line under the lede and the two plans stand side by side as tiles. The receipt, button and terms sit in a narrower column beneath."
        cost="Two column widths on one page. Side-by-side plans read as a comparison, which slightly overstates a choice that is only about how often you pay.">
        <PgDesk render={(pick, setPick) => (
          <div className="pg-col" style={{ maxWidth: 640, gap: 28 }}>
            <div><PgHeadBlock used={used} align="center" /><div style={{ marginTop: 20 }}><PgBullets row /></div></div>
            <div role="radiogroup" aria-label="Plan" className="pg-tiles">{['yearly', 'monthly'].map((id) => <PgTile key={id} plan={id} on={pick === id} onPick={setPick} pill={id === 'yearly' ? 'Save \u00a310' : null} />)}</div>
            <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}><PgReceipt used={used} plan={pick} /><PgAct used={used} /></div>
          </div>
        )} />
      </PgOpt>
      <PgOpt num="03" name="Two columns, one panel" claim="Two columns that share a top line. Left: heading, lede and ticks, left-aligned with even spacing. Right: one white panel holding the whole decision, plans to button, with the terms centred inside it."
        cost="A panel is a new container on this route; the wizard has none. It reads closer to a checkout than to a step in the app.">
        <PgDesk render={(pick, setPick) => (
          <div className="pg-two">
            <div><PgHeadBlock used={used} align="left" /><div style={{ marginTop: 28 }}><PgBullets /></div></div>
            <div className="pg-panel"><div><PgPlans pick={pick} setPick={setPick} pill="Save £10" /><div style={{ marginTop: 16 }}><PgReceipt used={used} plan={pick} /></div></div><PgAct used={used} /></div>
          </div>
        )} />
      </PgOpt>
    </PgBoard>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgSubscribeDesktopBoard />);
