// ============================================================================
// Per-person pricing candidate — circles. A lapse sleeps every circle its
// champion runs; a member takes one over by starting their own subscription,
// or free if they already pay. Re-publishes DormantSpace (window wins at
// render); the step-back line and the copy below reach circle settings through
// the narrow hooks in app/spaces.jsx and app/feed.jsx.
// ============================================================================
const PppShippedDormant = window.DormantSpace;

const PppDormantSpace = (props) => {
  const { space, dormancy, onLeave } = props;
  const st = usePPP(); const api = pppApi();
  if (dormancy === 'suspended' || !api) return <PppShippedDormant {...props} />;
  const mine = !!space && space.champion === 'You';
  const subscribed = pppSubscribed(st);
  const takeOver = () => {
    if (mine) { window.CircPPP.set({ ctx: { from: 'resubscribe', spaceId: space.id } }); api.setRoute('subscribe'); return; }
    if (subscribed) {
      api.setSpaces((prev) => prev.map((s) => (s.id === space.id
        ? { ...s, funded: true, dormancy: null, funding: null, openUntil: null, champion: 'You', championEmail: api.user.email } : s)));
      api.enterSpace(space.id);
      return;
    }
    window.CircPPP.set({ ctx: { from: 'takeover', spaceId: space.id, name: space.name } });
    api.setRoute('subscribe');
  };
  const SupportLine = window.SupportLine;
  const body = mine ? 'Your subscription has ended. Everything in this circle is still here.'
    : 'Its champion\u2019s subscription has ended. Everything in it is still here.';
  const cap = mine ? 'Subscribing again wakes every circle you champion.'
    : subscribed ? 'Your subscription covers it, so taking it over costs nothing more.'
    : 'Any member can take it over by starting their own subscription.';
  return (
    <main className="circ-dormant">
      <div className="circ-dormant-mid">
        <div className="circ-dormant-col">
          <h1 className="circ-dormant-title">This circle is asleep.</h1>
          <p className="circ-dormant-body">{body}</p>
          <div className="circ-dormant-actions">
            {!mine && onLeave && <Button variant="destructive-secondary" size="lg" full onClick={onLeave}>Leave this circle</Button>}
            <Button variant="primary" size="lg" full onClick={takeOver}>{mine ? 'Start your subscription' : 'Take over this circle'}</Button>
          </div>
          <p className="circ-dormant-cap">{cap}</p>
        </div>
      </div>
      {SupportLine && <div className="circ-dormant-foot"><SupportLine /></div>}
    </main>
  );
};
window.DormantSpace = PppDormantSpace;

// Stepping back, option A: a plain line; "get in touch" is real link text.
const PppChampionFoot = ({ space }) => (
  <>You champion this circle, so you can{'\u2019'}t leave it. To hand it to another member,{' '}
    <a className="circ-doorlink" href={'mailto:' + window.OPERATOR_EMAIL + '?subject=' + encodeURIComponent('Hand over ' + (space ? space.name : 'a circle'))}>get in touch</a>.</>
);

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
Object.assign(window, { PppChampionFoot, PPP_COPY, PPP_CONFIRM });
