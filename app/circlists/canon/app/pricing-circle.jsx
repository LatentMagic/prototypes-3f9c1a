// ============================================================================
// Per-person pricing candidate — circles. A lapse sleeps every circle its
// champion runs; a member takes one over by starting their own subscription,
// or free if they already pay. Re-publishes DormantSpace (window wins at
// render); the step-back line and the copy below reach circle settings through
// the narrow hooks in app/spaces.jsx and app/feed.jsx.
// ============================================================================
const PppShippedDormant = window.DormantSpace;

// A sentence never strands its last words past its full stop (ui-design.md, no
// overhanging line): each sentence keeps its own line where it fits.
const PppS = ({ children }) => <span className="ppp-s">{children}</span>;
const pppDM = (n) => pppNb(new Date(Date.now() + n * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }));
const pppLapsing = (st) => st.status === 'ending' || st.status === 'failed';
const PPP_FIX_DAYS = 30;
// Update payment card from a circle or the create form: the provider page returns there, not to Account.
const pppCardFrom = (ctx) => { window.CircPPP.set({ ctx }); pppApi().setRoute('ppp-card'); };

// Take-over while your own subscription is Ending or Payment failed (playground
// pg-lapsing-takeover option 1, Joe 2 Oct): the fix comes first, in the button's
// place (Resume subscription, or Update payment card); then Take over this circle,
// with a receipt line.
const PppDormantSpace = (props) => {
  const { space, dormancy, onLeave } = props;
  const st = usePPP(); const api = pppApi();
  if (dormancy === 'suspended' || !api) return <PppShippedDormant {...props} />;
  const mine = !!space && space.champion === 'You';
  const subscribed = pppSubscribed(st);
  const lapsing = !mine && pppLapsing(st);
  const failed = st.status === 'failed';
  const takeOver = () => {
    if (mine) { window.CircPPP.set({ ctx: { from: 'resubscribe', spaceId: space.id } }); api.setRoute('subscribe'); return; }
    if (subscribed) {
      window.CircPPP.set({ fixed: null });
      api.setSpaces((prev) => prev.map((s) => (s.id === space.id
        ? { ...s, funded: true, dormancy: null, funding: null, openUntil: null, champion: 'You', championEmail: api.user.email } : s)));
      api.enterSpace(space.id);
      return;
    }
    window.CircPPP.set({ ctx: { from: 'takeover', spaceId: space.id, name: space.name } });
    api.setRoute('subscribe');
  };
  const act = !lapsing ? takeOver
    : failed ? () => pppCardFrom({ from: 'card-circle', spaceId: space.id })
    : () => window.CircPPP.set({ ...pppResumed(window.CircPPP.get()), fixed: 'resumed' });
  const label = mine ? 'Start your subscription'
    : !lapsing ? 'Take over this circle'
    : failed ? 'Update payment card' : 'Resume subscription';
  const SupportLine = window.SupportLine;
  const body = mine
    ? <><PppS>Your subscription has{'\u00a0'}ended.</PppS> <PppS>Everything in this circle is still{'\u00a0'}here.</PppS></>
    : space && !space.champion ? <><PppS>Its champion has{'\u00a0'}left.</PppS> <PppS>Everything in it is still{'\u00a0'}here.</PppS></>
    : <><PppS>Its champion{'\u2019'}s subscription has{'\u00a0'}ended.</PppS> <PppS>Everything in it is still{'\u00a0'}here.</PppS></>;
  const cap = mine ? 'Subscribing again wakes every circle you champion.'
    : lapsing && failed ? <><PppS>Your last payment didn{'\u2019'}t go through.</PppS> <PppS>Update the card, then take this circle{'\u00a0'}over.</PppS></>
    : lapsing ? <><PppS>Your subscription ends on {pppDM(PPP_RENEW_DAYS)}.</PppS> <PppS>Resume it, then take this circle{'\u00a0'}over.</PppS></>
    : subscribed && st.fixed ? <><PppS>{st.fixed === 'card' ? 'Card updated.' : 'Subscription resumed.'}</PppS> <PppS>It covers this circle, so taking it over costs nothing{'\u00a0'}more.</PppS></>
    : subscribed ? 'Your subscription covers it, so taking it over costs nothing more.'
    : 'Any member can take it over by starting their own subscription.';
  return (
    <main className="circ-dormant">
      <div className="circ-dormant-mid">
        <div className="circ-dormant-col">
          <h1 className="circ-dormant-title">This circle is asleep.</h1>
          <p className="circ-dormant-body">{body}</p>
          <div className="circ-dormant-actions">
            {onLeave && <Button variant="destructive-secondary" size="lg" full onClick={onLeave}>Leave this circle</Button>}
            <Button variant="primary" size="lg" full icon={lapsing && failed ? <Icon name="card" size={18} /> : null} onClick={act}>{label}</Button>
          </div>
          <p className="circ-dormant-cap">{cap}</p>
        </div>
      </div>
      {SupportLine && <div className="circ-dormant-foot"><SupportLine /></div>}
    </main>
  );
};

// Creating while Ending or Payment failed (playground pg-lapsing-takeover option 3,
// Joe 2 Oct): allowed, with one line under Create circle and the fix as its link.
// Leaving for the card page carries what is typed, so it is there on return.
const PppCreateFoot = () => {
  const st = usePPP();
  if (!pppLapsing(st)) return st.fixed ? <p className="ppp-create-foot">{st.fixed === 'card' ? 'Card updated.' : 'Subscription resumed.'}</p> : null;
  const failed = st.status === 'failed';
  const toCard = () => {
    const name = (document.querySelector('input[name="space-name"]') || {}).value || '';
    const description = (document.getElementById('space-description') || {}).value || '';
    const api = pppApi(); if (api.setFundFlow) api.setFundFlow({ mode: 'new', name, description, spaceId: null });
    pppCardFrom({ from: 'card-create' });
  };
  return (
    <p className="ppp-create-foot">It goes to sleep on {pppDM(failed ? PPP_FIX_DAYS : PPP_RENEW_DAYS)} unless you{' '}
      <button type="button" className="circ-doorlink ppp-link44" onClick={failed ? toCard : () => window.CircPPP.set({ ...pppResumed(window.CircPPP.get()), fixed: 'resumed' })}>{failed ? 'update the\u00a0card' : 'resume your\u00a0subscription'}</button>.</p>
  );
};
window.DormantSpace = PppDormantSpace;

const PPP_COPY = {
  championManages: 'The Champion manages this circle\u2019s membership.',
  unchampionedTail: 'after that any member can take it over.',
};
const PPP_CONFIRM = {
  'delete-account': {
    title: 'Delete your account?',
    body: 'It can\u2019t be undone. Deleting cancels your subscription \u2014 any circle you champion runs to the end of its paid period, then goes to sleep.',
    primary: 'Delete account', variant: 'destructive', role: 'alertdialog',
  },
};
Object.assign(window, { PPP_COPY, PPP_CONFIRM, PppCreateFoot, pppLapsing });
