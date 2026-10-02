// The Cancel subscription overlay: three treatments beside the candidate's own (00,
// PppCancelSheet mounted). Every option uses the real PppOverlay (sheet on a phone,
// modal on desktop) over the real Account card. Buttons held fixed.
const PG_CX_USER = { email: 'sam@example.com' };
const pgCxSt = (status) => ({ ...PPP_DEFAULT, status, plan: 'monthly', pending: null, sheet: null });
const noop = () => {};
const PG_CX_ACTS = [{ label: 'Cancel subscription', variant: 'destructive', onClick: noop }, { label: 'Keep subscription', variant: 'secondary', onClick: noop }];
const pgCx = (st) => {
  const trial = st.status === 'trial';
  const n = trial ? PPP_TRIAL_DAYS : PPP_RENEW_DAYS;
  return { trial, date: pppNb(pppDay(n)), short: pppNb(pppDay(n, true)) };
};

// 01 One sentence, one size. The grey line goes.
const PgCx1 = ({ st }) => {
  const c = pgCx(st);
  return (
    <PppOverlay title="Cancel your subscription?" onClose={noop} actions={PG_CX_ACTS}>
      <p className="ppp-overlay-body pg-cx-pretty">{(c.trial ? 'Nothing is charged. ' : '') + 'Your circles go to sleep on ' + c.date + '.'}</p>
    </PppOverlay>
  );
};

// 02 Before and after, the Switch overlay's panel: what you have now, and what you have from the date.
const PgCx2 = ({ st }) => {
  const c = pgCx(st);
  const cell = (k, a, b, on) => (
    <div className={'pg-ba-cell' + (on ? ' pg-ba-on' : '')}>
      <div className="pg-ba-k">{k}</div><div className="pg-ba-plan">{a}</div><div className="pg-ba-price">{b}</div>
    </div>
  );
  return (
    <PppOverlay title="Cancel your subscription?" onClose={noop} actions={PG_CX_ACTS}>
      <div className="pg-ba">
        {cell('Now', c.trial ? 'Free month' : 'Monthly', c.trial ? pppNb('£0') : pppNb('£5 a month'))}
        <span className="pg-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
        {cell(pppNb('From ' + c.short.replace(/\u00a0/g, ' ')), 'Asleep', 'Nothing charged', true)}
      </div>
    </PppOverlay>
  );
};

// 02.1 02's panel, plus the members line at body size under it.
const PgCx2b = ({ st }) => {
  const c = pgCx(st);
  const cell = (k, a, b, on) => (
    <div className={'pg-ba-cell' + (on ? ' pg-ba-on' : '')}>
      <div className="pg-ba-k">{k}</div><div className="pg-ba-plan">{a}</div><div className="pg-ba-price">{b}</div>
    </div>
  );
  return (
    <PppOverlay title="Cancel your subscription?" onClose={noop} actions={PG_CX_ACTS}>
      <div className="pg-ba">
        {cell('Now', c.trial ? 'Free month' : 'Monthly', c.trial ? pppNb('£0') : pppNb('£5 a month'))}
        <span className="pg-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
        {cell(pppNb('From ' + c.short.replace(/\u00a0/g, ' ')), 'Asleep', 'Nothing charged', true)}
      </div>
      <p className="ppp-overlay-body pg-cx-pretty" style={{ marginTop: 'var(--space-4)' }}>Members keep everything in them, and any member can take one{'\u00a0'}over.</p>
    </PppOverlay>
  );
};

// 02.2 02.1 with the adviser's fixes: the right half names the circles, and the line
// names them too so "them" points at something. Copy B.
const PgCx2c = ({ st }) => {
  const c = pgCx(st);
  const cell = (k, a, b, on) => (
    <div className={'pg-ba-cell' + (on ? ' pg-ba-on' : '')}>
      <div className="pg-ba-k">{k}</div><div className="pg-ba-plan">{a}</div><div className="pg-ba-price">{b}</div>
    </div>
  );
  return (
    <PppOverlay title="Cancel your subscription?" onClose={noop} actions={PG_CX_ACTS}>
      <div className="pg-ba">
        {cell('Now', c.trial ? 'Free month' : 'Monthly', c.trial ? pppNb('£0') : pppNb('£5 a month'))}
        <span className="pg-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
        {cell(pppNb('From ' + c.short.replace(/\u00a0/g, ' ')), pppNb('Circles asleep'), 'Nothing charged', true)}
      </div>
      <p className="ppp-overlay-body pg-cx-pretty" style={{ marginTop: 'var(--space-4)' }}>Your circles go to sleep. Everything in them stays, and any member can take one{'\u00a0'}over.</p>
    </PppOverlay>
  );
};

// 02.3 The panel is about money only, exactly the Switch shape (plan, price); the
// line is about the circles. Two lines per half, both halves.
const PgCx2d = ({ st }) => {
  const c = pgCx(st);
  const cell = (k, a, b, on) => (
    <div className={'pg-ba-cell' + (on ? ' pg-ba-on' : '')}>
      <div className="pg-ba-k">{k}</div><div className="pg-ba-plan">{a}</div><div className="pg-ba-price">{b}</div>
    </div>
  );
  return (
    <PppOverlay title="Cancel your subscription?" onClose={noop} actions={PG_CX_ACTS}>
      <div className="pg-ba">
        {cell('Now', c.trial ? pppNb('Free month') : 'Monthly', c.trial ? '£0' : pppNb('£5 a month'))}
        <span className="pg-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
        {cell(pppNb('From ' + c.short.replace(/\u00a0/g, ' ')), pppNb('No plan'), '£0', true)}
      </div>
      <p className="ppp-overlay-body pg-cx-pretty" style={{ marginTop: 'var(--space-4)' }}>Your circles go to sleep on that date. Everything in them stays, and any member can take one{'\u00a0'}over.</p>
    </PppOverlay>
  );
};

// 02.4 02.1's panel (Asleep) with 02.2's sentence, which names the circles.
const PgCx2e = ({ st }) => {
  const c = pgCx(st);
  const cell = (k, a, b, on) => (
    <div className={'pg-ba-cell' + (on ? ' pg-ba-on' : '')}>
      <div className="pg-ba-k">{k}</div><div className="pg-ba-plan">{a}</div><div className="pg-ba-price">{b}</div>
    </div>
  );
  return (
    <PppOverlay title="Cancel your subscription?" onClose={noop} actions={PG_CX_ACTS}>
      <div className="pg-ba">
        {cell('Now', c.trial ? 'Free month' : 'Monthly', c.trial ? '£0' : pppNb('£5 a month'))}
        <span className="pg-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
        {cell(pppNb('From ' + c.short.replace(/\u00a0/g, ' ')), 'Asleep', pppNb('Nothing charged'), true)}
      </div>
      <p className="ppp-overlay-body pg-cx-pretty" style={{ marginTop: 'var(--space-4)' }}>Your circles go to sleep. Everything in them stays, and any member can take one{'\u00a0'}over.</p>
    </PppOverlay>
  );
};

// 03.1 One sentence with the full impact, one size.
const PgCx3b = ({ st }) => {
  const c = pgCx(st);
  return (
    <PppOverlay title="Cancel your subscription?" onClose={noop} actions={PG_CX_ACTS}>
      <p className="ppp-overlay-body pg-cx-pretty">{(c.trial ? 'Nothing is charged. ' : '') + 'Your circles go to sleep on ' + c.date + '. Everything in them stays, and any member can take one'}{'\u00a0'}over.</p>
    </PppOverlay>
  );
};

// 03 One sentence plus the take-over fact, both at body size.
const PgCx3 = ({ st }) => {
  const c = pgCx(st);
  return (
    <PppOverlay title="Cancel your subscription?" onClose={noop} actions={PG_CX_ACTS}>
      <p className="ppp-overlay-body pg-cx-pretty">{(c.trial ? 'Nothing is charged. ' : '') + 'Your circles go to sleep on ' + c.date + '. Any member can take one over.'}</p>
    </PppOverlay>
  );
};

const PgCxFrame = ({ cap, width, height, sheet, st, children }) => (
  <div style={{ width, maxWidth: '100%' }}>
    <div className="pg-cap">{cap}</div>
    <div className="pg-frame pg-frame-pad pg-ov-frame" data-circ-posture={sheet ? 'mobile' : 'desktop'} style={{ width, height }}>
      <PppSubscribed st={st} user={PG_CX_USER} />
      <PppOverlayFrame.Provider value={{ sheet }}>{children}</PppOverlayFrame.Provider>
    </div>
  </div>
);
const PgCxWidths = ({ st, render }) => (
  <>
    <PgCxFrame cap="Phone · 320 · bottom sheet" width={320} height={640} sheet st={st}>{render()}</PgCxFrame>
    <PgCxFrame cap="Phone · 390 · bottom sheet" width={390} height={640} sheet st={st}>{render()}</PgCxFrame>
    <PgCxFrame cap="Desktop · centred modal" width={720} height={520} sheet={false} st={st}>{render()}</PgCxFrame>
  </>
);

const PgCancelBoard = () => {
  const [status, setStatus] = usePgSaved('pg_ppp_cancel_status_v1', 'active');
  const st = pgCxSt(status);
  React.useLayoutEffect(() => { window.CircPPP.reset(pgCxSt(status)); }, [status]);
  return (
    <PgBoard eyebrow="Per-person pricing · option board" title="The Cancel subscription overlay"
      lede="Opened from Cancel subscription on the Account card, shown as the bottom sheet at 320 and 390 and the centred modal on desktop, over the real card. Title and buttons are held fixed; only the body changes. Switch Status to see the free month."
      controls={<PgSeg label="Status" value={status} options={[['active', 'Active'], ['trial', 'Free month']]} onChange={setStatus} />}>
      <PgOpt num="00" name="As built" claim="The candidate's overlay, mounted: a sentence that differs by state, then a smaller grey line about members.">
        <PgCxWidths st={st} render={() => <PppCancelSheet st={st} />} />
      </PgOpt>
      <PgOpt num="01" name="One sentence" claim="What happens and when, in one line at one size. On a free month it leads with Nothing is charged. The members line goes; the sleeping circle says it when it matters."
        cost="Take-over isn't mentioned at the moment you decide.">
        <PgCxWidths st={st} render={() => <PgCx1 st={st} />} />
      </PgOpt>
      <PgOpt num="02" name="Before and after" claim="The Switch overlay's panel: what you have now, an arrow, and what you have from the date. No sentence. Cancel and Switch become one family."
        cost="Asleep / Nothing charged is new wording in a panel built for plans, and the take-over fact goes.">
        <PgCxWidths st={st} render={() => <PgCx2 st={st} />} />
      </PgOpt>
      <PgOpt num="02.1" name="Before and after, members kept" claim="02's panel, with the members line under it at body size: Members keep everything in them, and any member can take one over. The panel says what changes for you; the line says what happens to everyone else."
      cost="The heaviest option: a panel and a sentence. Asleep / Nothing charged is still new wording.">
      <PgCxWidths st={st} render={() => <PgCx2b st={st} />} />
    </PgOpt>
    <PgOpt num="02.2" name="Before and after, circles named" claim="02.1 with two fixes from the adviser: the right half reads Circles asleep, so both halves say whose state it is, and the line names the circles before 'them': Your circles go to sleep. Everything in them stays, and any member can take one over."
      cost="Circles asleep is longer than a plan name, so the right half is the wider one at 320. The line repeats what the panel shows, in words.">
      <PgCxWidths st={st} render={() => <PgCx2c st={st} />} />
    </PgOpt>
    <PgOpt num="02.3" name="Before and after, money only" claim="The panel keeps the Switch shape exactly: a plan and its price each side. Now Monthly, £5 a month; from the date, No plan, £0. The circles move to the line underneath: Your circles go to sleep on that date. Everything in them stays, and any member can take one over."
      cost="The date sits only in the panel, so the line says on that date. No plan is new wording.">
      <PgCxWidths st={st} render={() => <PgCx2d st={st} />} />
    </PgOpt>
    <PgOpt num="02.4" name="Before and after, Asleep + the sentence" claim="The adviser's correction: one fix, not two. The panel goes back to Asleep (Now Monthly, £5 a month; from the date, Asleep, Nothing charged), and the sentence underneath names what's asleep: Your circles go to sleep. Everything in them stays, and any member can take one over."
      cost="Sleep is said twice, once in each place. The right half has three lines to the left's three, so the panel keeps 02's height.">
      <PgCxWidths st={st} render={() => <PgCx2e st={st} />} />
    </PgOpt>
    <PgOpt num="03" name="One sentence, take-over kept" claim="01 with Any member can take one over. added to the same line at the same size, so the reassurance stays without a second tier."
        cost="Two facts in one line; at 320 it runs to three or four lines.">
        <PgCxWidths st={st} render={() => <PgCx3 st={st} />} />
      </PgOpt>
    <PgOpt num="03.1" name="One sentence, full impact" claim="What happens and when, then what stays and who can act, all at one size: Your circles go to sleep on <date>. Everything in them stays, and any member can take one over. Free month leads with Nothing is charged."
      cost="The longest body on the board; at 320 it runs to five lines or more.">
      <PgCxWidths st={st} render={() => <PgCx3b st={st} />} />
    </PgOpt>
    </PgBoard>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgCancelBoard />);
