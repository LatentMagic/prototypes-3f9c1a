// Playground: the Pass page and the subscribe page as a pair. Overrides GsPass, GsCheckout and GsDemoBar on window;
// nothing in app/ changes. The subscribe page is the 'pass' route with step 'subscribe' (main.jsx has no route for it).
// Brief and handoff: docs/specs/pass-and-subscribe/.
const PS_KEY = 'pg_pass_subscribe_v1';
let ps = { opt: '5', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(PS_KEY)) || {}; } catch (e) { return {}; } })() };
const psSubs = new Set();
const psSet = (p) => { ps = { ...ps, ...p }; try { localStorage.setItem(PS_KEY, JSON.stringify(ps)); } catch (e) {} psSubs.forEach((f) => f(ps)); };
const usePs = () => { const [s, setS] = React.useState(ps); React.useEffect(() => { psSubs.add(setS); return () => psSubs.delete(setS); }, []); return s; };

const PS_BASE = { GsCheckout: window.GsCheckout };
// Prices decided 2026-10-11 (owner): £3 a month, £30 a year. Set on the app's GS_PLAN object in this rig only; app/ still says £—.
Object.assign(GS_PLAN.monthly, { price: '£3\u00A0a\u00A0month', per: '£3\u00A0/\u00A0month', due: '£3.00' });
Object.assign(GS_PLAN.yearly, { price: '£30\u00A0a\u00A0year', per: '£30\u00A0/\u00A0year', due: '£30.00' });
const PS_YEAR_MONTH = '£2.50\u00A0a\u00A0month';
const gsNb = (s) => s.replace(/ /g, '\u00A0'); // as in app/gs-billing.jsx, which keeps it internal
// The Pass-only rows of GS_COMPARE (app/gs-parts.jsx, not exported). Copy, kept in step by hand.
const PS_ADDS = ['Play earlier editions', 'The full game catalog', 'New releases'];
const psToSub = (gs, plan) => { if (plan) gs.setChoice(plan); gs.go('pass', { step: 'subscribe' }); };
const PS_PRICE = GS_PLAN.monthly.price + ' or ' + GS_PLAN.yearly.price;

// The Pass page's head, as GsPass has it: the heading, then the status line for a signed-in player.
const PsHead = ({ children }) => {
  const gs = useGs(); const holds = gs.view === 'pass';
  const status = gs.view === 'free' ? 'You have a free account' : holds ? 'You have the Pass' : null;
  return (
    <div className="gs-stack-md">
      <h1 className="gs-h1">[Platform] Pass</h1>
      {!holds && children}
      {status && <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 24px', minHeight: 48 }}><p className="gs-status">{status}{holds && <DS.Icon name="check" />}</p>{holds && <DS.TextLink onClick={() => gs.go('account')}>Manage in account</DS.TextLink>}</div>}
    </div>
  );
};

// ---- Pass pages ----
// 1: the price and one way on, under the heading.
const PsPassOne = () => { const gs = useGs(); return (
  <main className="gs-wrap gs-main">
    <PsHead>
      <div className="ps-lead">
        <p className="gs-hero-sub">It costs {PS_PRICE}.</p>
        <div><DS.Button onClick={() => psToSub(gs)}>Choose a plan</DS.Button></div>
      </div>
    </PsHead>
    <GsCompare />
  </main>
); };
// 2: both plans described beside the comparison; each leads on with itself chosen.
const PsPlanCard = ({ k }) => { const gs = useGs(); const p = GS_PLAN[k]; return (
  <DS.Card style={{ gap: 12, alignContent: 'start' }}>
    <div className="gs-title-row"><h2 className="mcp-t-card">{p.name}</h2>{k === 'yearly' && <DS.Tag kind="success">{PS_YEAR_MONTH}</DS.Tag>}</div>
    <span className="gs-figure gs-num-text">{p.per}</span>
    <div><DS.Button variant={k === 'yearly' ? 'primary' : 'secondary'} onClick={() => psToSub(gs, k)}>Choose {k}</DS.Button></div>
  </DS.Card>
); };
const PsPassTwo = () => { const gs = useGs(); return (
  <main className="gs-wrap gs-main">
    <PsHead />
    <div className={gs.view === 'pass' ? '' : 'ps-two'}>
      {gs.view !== 'pass' && <section className="ps-plans" aria-label="Plans"><PsPlanCard k="yearly" /><PsPlanCard k="monthly" /></section>}
      <GsCompare />
    </div>
  </main>
); };
// 3: the price and the way on in one sentence; the page is the description and nothing else.
const PsPassThree = () => { const gs = useGs(); return (
  <main className="gs-wrap gs-main">
    <PsHead>
      <p className="gs-hero-sub ps-lead">Play every game and every edition for {PS_PRICE}. <DS.TextLink onClick={() => psToSub(gs)}>Choose a plan</DS.TextLink> to start.</p>
    </PsHead>
    <GsCompare />
  </main>
); };

// ---- Subscribe page ----
// The plan block is GsBuyBlock (app/gs-billing.jsx) with its heading raised to the page's h1. Copy, not improved.
const PsBuy = () => {
  const gs = useGs();
  const free = !gs.sub.freeUsed;
  const plan = GS_PLAN[gs.choice];
  const freeEnd = gsLong(gsAddDays(GS_DAY0, 14));
  const renews = gsLong(gsAddMonths(GS_DAY0, plan.months));
  return (
    <section className="gs-buy-block ps-buy" aria-labelledby="ps-buy-h">
      <div className="gs-stack-sm gs-buy-head">
        <h1 id="ps-buy-h" className="gs-h1 ps-buy-h1">{free ? 'Start your 14-day trial' : 'Start your Pass'}</h1>
        <p className="gs-muted">Choose how you pay.</p>
      </div>
      <fieldset className="gs-plans">
        <legend className="gs-vh">Plan</legend>
        {['yearly', 'monthly'].map((k) => (
          <label key={k} className={'gs-plan' + (gs.choice === k ? ' is-on' : '')}>
            <input type="radio" name="ps-plan" value={k} checked={gs.choice === k} onChange={() => gs.setChoice(k)} />
            <span className="gs-plan-dot" aria-hidden="true" />
            <span className="gs-plan-name">{GS_PLAN[k].name}</span>
            {k === 'yearly' && <DS.Tag kind="success">{PS_YEAR_MONTH}</DS.Tag>}
            <span className="gs-plan-price gs-num-text">{GS_PLAN[k].per}</span>
          </label>
        ))}
      </fieldset>
      <GsRows rows={free ? [['Due today', '£0.00'], ['From ' + freeEnd, plan.price]] : [['Due today', plan.due], ['Renews', renews]]} />
      <DS.Button block onClick={gs.getPass}>{free ? 'Start 14-day trial' : 'Get the Pass'}</DS.Button>
      {free && <p className="gs-small gs-center">{'Cancel before ' + freeEnd + ' and pay nothing.'}</p>}
      <p className="gs-small gs-ico-row gs-center-row"><DS.Icon name="lock" size={16} />{gs.view === 'out' ? 'Billed to your account' : 'Billed to ' + gs.user.email}</p>
      <p className="gs-small gs-center">{GS.purchase}</p>
    </section>
  );
};
const PsBack = () => { const gs = useGs(); return <div className="gs-center"><DS.TextLink onClick={() => gs.go('pass')}>What the Pass covers</DS.TextLink></div>; };
// 1 and 2: one centred column, the step and nothing else.
const PsSubCol = () => <main className="gs-wrap gs-main"><PsBuy /><PsBack /></main>;
// 3: the page stands alone, so it says what the Pass adds beside the plan choice.
const PsSubThree = () => { const gs = useGs(); return (
  <main className="gs-wrap gs-main">
    <div className="ps-sub3">
      <PsBuy />
      <section className="ps-adds" aria-labelledby="ps-adds-h">
        <h2 id="ps-adds-h" className="mcp-t-sec">What the Pass adds</h2>
        <ul className="ps-adds-list">{PS_ADDS.map((n) => <li key={n}><DS.Icon name="check" />{n}</li>)}</ul>
        <p className="gs-muted">Everything free stays free.</p>
        <div><DS.TextLink onClick={() => gs.go('pass')}>Compare free and the Pass</DS.TextLink></div>
      </section>
    </div>
  </main>
); };

// ---- 4: the Pass as a card at the top; the subscribe page is the old buying block, trimmed ----
// The holder's status lives in the card's title row (as GsPassCard's marker does), so there is no separate status line.
const PsPassFour = () => {
  const gs = useGs(); const holds = gs.view === 'pass';
  return (
    <main className="gs-wrap gs-main">
      <div className="ps4">
        <DS.Card style={{ gap: 16, alignContent: 'start' }}>
          <div className="gs-title-row"><h1 className="gs-h1 ps4-h1">[Platform] Pass</h1>{holds && <span className="gs-marker"><DS.Icon name="check" />Active</span>}</div>
          {holds ? (
            <div className="ps4-foot"><p>You have the Pass. Every game and every edition is yours to play.</p><DS.TextLink onClick={() => gs.go('account')}>Manage in account</DS.TextLink></div>
          ) : (
            <div className="ps4-foot">
              <div className="gs-stack-xs"><p>Play every game and every edition.</p><span className="ps4-price gs-num-text">{GS_PLAN.yearly.price}<span className="gs-muted"> or {GS_PLAN.monthly.price}</span></span></div>
              <DS.Button onClick={() => psToSub(gs)}>Choose a plan</DS.Button>
            </div>
          )}
        </DS.Card>
        <GsCompare />
      </div>
    </main>
  );
};
const PsSubFour = () => {
  const gs = useGs();
  const free = !gs.sub.freeUsed;
  const plan = GS_PLAN[gs.choice];
  const freeEnd = gsLong(gsAddDays(GS_DAY0, 14));
  return (
    <main className="gs-wrap gs-main">
      <section className="gs-buy-block" aria-labelledby="ps4-buy-h">
        <h1 id="ps4-buy-h" className="mcp-t-sec gs-buy-head">{free ? 'Start your 14-day trial' : 'Start your Pass'}</h1>
        <fieldset className="gs-plans">
          <legend className="gs-vh">Plan</legend>
          {['yearly', 'monthly'].map((k) => (
            <label key={k} className={'gs-plan' + (gs.choice === k ? ' is-on' : '')}>
              <input type="radio" name="ps4-plan" value={k} checked={gs.choice === k} onChange={() => gs.setChoice(k)} />
              <span className="gs-plan-dot" aria-hidden="true" />
              <span className="gs-plan-name">{GS_PLAN[k].name}</span>
              {k === 'yearly' && <DS.Tag kind="success">{PS_YEAR_MONTH}</DS.Tag>}
              <span className="gs-plan-price gs-num-text">{GS_PLAN[k].per}</span>
            </label>
          ))}
        </fieldset>
        <GsRows rows={free ? [['Due today', '£0.00'], ['From ' + freeEnd, plan.price]] : [['Due today', plan.due], ['Renews', gsLong(gsAddMonths(GS_DAY0, plan.months))]]} />
        <DS.Button block onClick={gs.getPass}>{free ? 'Start 14-day trial' : 'Get the Pass'}</DS.Button>
        {free && <p className="gs-small gs-center">{'Cancel before ' + freeEnd + ' and pay nothing.'}</p>}
      </section>
    </main>
  );
};

// ---- 5: a plain heading; the price and the way on close the comparison ----
// PsCompare is GsCompare (app/gs-parts.jsx) with a foot row added. GS_COMPARE and GsCmpMark are not exported, so they are copied here.
const PS_CMP = [
  { name: 'Free games', free: true }, { name: 'The start of select games', free: true },
  { name: 'Streaks and achievements in every game you can play', free: true }, { name: 'Your results and history', free: true },
  { name: 'Sharing a result', free: true }, { name: 'Play earlier editions', free: false },
  { name: 'The full game catalog', free: false }, { name: 'New releases', free: false },
];
const PsMark = ({ on }) => on
  ? <span className="gs-cmp-cell"><DS.Icon name="check" /><span className="gs-vh">Included</span></span>
  : <span className="gs-cmp-cell gs-muted"><span aria-hidden="true">–</span><span className="gs-vh">Not included</span></span>;
const PsCompare = ({ foot }) => (
  <section className="gs-cmp" aria-labelledby="gs-cmp-h">
    <h2 id="gs-cmp-h" className="mcp-t-sec gs-cmp-h">What you get</h2>
    <div role="table" aria-labelledby="gs-cmp-h" className="gs-cmp-t">
      <div role="row" className="gs-cmp-tr is-head">
        <span role="columnheader"><span className="gs-vh">What you get</span></span>
        <span role="columnheader" className="gs-cmp-cell mcp-t-card">Free</span>
        <span role="columnheader" className="gs-cmp-cell gs-cmp-band mcp-t-card">Pass</span>
      </div>
      {PS_CMP.map((r) => (
        <div role="row" key={r.name} className="gs-cmp-tr">
          <span role="rowheader" className="gs-cmp-label"><b>{r.name}</b></span>
          <span role="cell"><PsMark on={r.free} /></span>
          <span role="cell" className="gs-cmp-band"><PsMark on /></span>
        </div>
      ))}
      <div className="gs-cmp-tr is-foot" aria-hidden="true"><span /><span /><span className="gs-cmp-band" /></div>
    </div>
    {foot}
  </section>
);
const PsPassFive = () => {
  const gs = useGs(); const holds = gs.view === 'pass';
  return (
    <main className="gs-wrap gs-main">
      <div className="ps5">
        <div className="ps5-head">
          <h1 className="gs-h1">[Platform] Pass</h1>
          {holds && <div className="ps5-have"><span className="gs-marker"><DS.Icon name="check" />You have the Pass</span><DS.TextLink onClick={() => gs.go('account')}>Manage in account</DS.TextLink></div>}
        </div>
        <PsCompare foot={!holds && (
          <div className="ps5-foot">
            <span className="ps4-price gs-num-text">{GS_PLAN.yearly.price}<span className="gs-muted"> or {GS_PLAN.monthly.price}</span></span>
            <DS.Button onClick={() => psToSub(gs)}>Choose a plan</DS.Button>
          </div>
        )} />
      </div>
    </main>
  );
};

const PS_VIEW = { '5': [PsPassFive, PsSubFour], '4': [PsPassFour, PsSubFour], '1': [PsPassOne, PsSubCol], '2': [PsPassTwo, PsSubCol], '3': [PsPassThree, PsSubThree] };
const PsPass = () => {
  const gs = useGs(); const s = usePs(); const [P, S] = PS_VIEW[s.opt] || PS_VIEW['1'];
  const onSub = gs.route.step === 'subscribe';
  // A Pass holder never sees the subscribe page (MCPG-012 AF-06).
  React.useEffect(() => { if (onSub && gs.view === 'pass') gs.go('account'); }, [onSub, gs.view]);
  if (onSub && gs.view === 'pass') return null;
  return onSub ? <S /> : <P />;
};
// Leaving the provider's page without paying returns to the subscribe page, plan still chosen (MCPG-012 EF-01).
const PsCheckout = () => { const gs = useGs(); const v = { ...gs, afterCheckout: () => psToSub(gs) }; return <GsCtx.Provider value={v}><PS_BASE.GsCheckout /></GsCtx.Provider>; };

// ---- Strip ----
const PS_OPTS = [
  { id: '5', name: 'A plain heading, the price closing the table',
    idea: 'The page is the heading and What you get. The price, yearly first, and Choose a plan close the comparison, under the Pass column. A holder sees You have the Pass and Manage in account beside the heading, and no price. The subscribe page is option 4’s.',
    assumes: 'Choose a plan is the one way on, and it belongs to the comparison it follows.',
    cost: 'On a phone the price and button come after the whole table, so the price is not on the first screen.' },
  { id: '4', name: 'The Pass as a card, a plain subscribe page',
    idea: 'The page opens on the Pass itself: one card with the name, what it opens, the price and Choose a plan. A holder sees the same card marked Active, with Manage in account, and no status line. The subscribe page is the old buying block on its own, trimmed to plans, what is due and the button.',
    assumes: 'Choose a plan is the one way on. “You have a free account” is dropped: the top bar already says who is signed in.',
    cost: 'The card and the table both hold the price story, so the page runs a little longer on a phone. The subscribe page loses the billing and purchase lines.' },
  { id: '1', name: 'Price and one button',
    idea: 'Under the heading: the price in one line and a Choose a plan button. The comparison follows as the reason. The subscribe page is one centred step: plans, what is due, the button.',
    assumes: 'The onward control is a primary button. The chat links to the page, not to the button, so the page still only describes.',
    cost: 'The strongest call to buy sits at the top of the page the chat links to, so it reads most like a sales page.' },
  { id: '2', name: 'Plans beside the table',
    idea: 'Both plans are described as cards beside the comparison, yearly first, each with its own price. Choose yearly or Choose monthly opens the subscribe page with that plan already picked.',
    assumes: 'Describing each plan is what the directory rule allows. The per-plan buttons lead to the plan choice; they start nothing.',
    cost: 'The plans appear twice, as cards here and as the choice on the subscribe page. The Pass page carries two buttons.' },
  { id: '3', name: 'One sentence, then the table',
    idea: 'The price and the way on share one sentence, with Choose a plan as its link. The subscribe page stands on its own: plans and what is due beside what the Pass adds.',
    assumes: 'A text link is enough of a way on. Other routes (home, Account, a locked game) can link to the subscribe page directly.',
    cost: 'The way on is quiet and easy to miss. The subscribe page repeats part of the comparison.' },
];
const PS_VIEWERS = [['out', 'Signed out'], ['free', 'No Pass'], ['used', 'Trial used'], ['pass', 'Pass']];
let psBooted = false;
const PsStrip = () => {
  const gs = useGs(); const s = usePs(); const o = PS_OPTS.find((x) => x.id === s.opt) || PS_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!psBooted) { psBooted = true; setTimeout(() => gs.go('pass'), 0); } }, []);
  const viewer = gs.view === 'free' && gs.sub.freeUsed ? 'used' : gs.view;
  const page = gs.route.name === 'pass' && gs.route.step === 'subscribe' ? 'sub' : gs.route.name === 'pass' ? 'pass' : null;
  const setViewer = (v) => {
    gs.setView(v === 'used' ? 'free' : v);
    if (v === 'used') setTimeout(() => gs.setSub({ freeUsed: true, endedOn: GS_DAY0.getTime() - 20 * 864e5 }), 0);
    if (gs.route.name !== 'pass' || (v === 'pass' && page === 'sub')) setTimeout(() => gs.go('pass'), 0);
  };
  const btn = (cur, v, l, fn, title) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={cur === v} title={title} onClick={() => fn(v)}>{l}</button>;
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {PS_OPTS.map((x) => btn(o.id, x.id, x.id, (v) => psSet({ opt: v }), x.name))}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => psSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Viewer</span>
            {PS_VIEWERS.map(([v, l]) => btn(viewer, v, l, setViewer))}
            <span className="gs-demo-sep" aria-hidden="true" />
            {btn(page, 'pass', 'Pass page', () => gs.go('pass'))}
            {gs.view !== 'pass' && btn(page, 'sub', 'Subscribe', () => psToSub(gs))}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => psSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Assumes.</b> {o.assumes}</p>
          <p><b>Cost.</b> {o.cost}</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsPass: PsPass, GsCheckout: PsCheckout, GsDemoBar: PsStrip });
