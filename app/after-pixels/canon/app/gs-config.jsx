// ============================================================================
// After Pixels — review settings in Config (PROTOTYPE AID). Published as
// window.ConfigExtra; reads and writes the app through window.gsApi.
// ============================================================================
const ConfigExtraBase = () => {
  const api = window.gsApi || {};
  const r = api.review || {};
  const sub = api.sub || {};
  const [, bump] = React.useState(0);
  const set = (fn) => { fn(); setTimeout(() => bump((n) => n + 1), 0); };
  const { ConfigGroup: Group, ConfigRow: Row } = window;
  const o = (pairs) => pairs.map(([value, label]) => ({ value, label }));
  // Changing the subscription signs in, so the demo bar moves with it.
  // This edition: one pick over the old week (in progress), today (a free account's not played) and ed (the finished play).
  const edVal = r.today === 'none' ? 'none' : r.week === 'live' ? 'live' : ['average', 'hard', 'failed'].includes(r.ed) ? r.ed : null;
  const setEd = (v) => set(() => api.setReview({ today: v === 'none' ? 'none' : 'played', week: v === 'live' ? 'live' : 'done', ed: ['average', 'hard', 'failed'].includes(v) ? v : null }));
  const setSub = (patch) => set(() => { if (api.view === 'out') api.setView('free'); api.setSub(patch); });
  const R = (label, value, onChange, options, hint) => <Row label={label} value={value} onChange={onChange} options={options} hint={hint} />;
  return (
    <React.Fragment>
      <Group title="After Pixels" scope="global">
        {R('Your AI', api.connected ? 'yes' : 'no', (v) => set(() => api.setConnected(v === 'yes')), o([['yes', 'Connected'], ['no', 'Not connected']]))}
        {R('Account', (api.user && api.user.fresh) ? 'new' : 'played', (v) => set(() => { if (api.view === 'out') api.setView('free'); api.setUser({ fresh: v === 'new' }); }), o([['played', 'Has played'], ['new', 'New, nothing played']]),
          'New: the Library shows every game never played and History is empty, as for an account made here.')}
      </Group>
      <Group title="Subscription" scope="global">
        {R('Subscription', sub.status || 'none', (v) => setSub({ status: v, pending: null, ...(v === 'none' ? {} : { hadPass: true }) }),
          o([['none', 'None'], ['active', 'Active'], ['failed', 'Payment failed'], ['ending', 'Ending']]),
          'The demo bar at the foot of every screen agrees: Free is None, Pass is Active.')}
        {R('Had the Pass before', sub.hadPass ? 'yes' : 'no', (v) => setSub({ hadPass: v === 'yes' }), o([['no', 'No'], ['yes', 'Yes']]),
          'Subscription None with this set to Yes is the lapsed card.')}
        {R('Plan', sub.plan || 'monthly', (v) => setSub({ plan: v, pending: null }), o([['monthly', 'Monthly'], ['yearly', 'Yearly']]))}
      </Group>

      <Group title="Sign-in and account">
        {R('Signed in with', api.provider || 'email', (v) => set(() => api.setProvider(v)), o([['email', 'Email'], ['google', 'Google'], ['apple', 'Apple']]))}
        {R('Provider sheet', r.sheet || 'completes', (v) => set(() => api.setReview({ sheet: v })), o([['completes', 'Completes'], ['cancelled', 'Cancelled']]))}
        {R('Google and Apple sign-in', r.providerFail ? 'fail' : 'ok', (v) => set(() => api.setReview({ providerFail: v === 'fail' })), o([['ok', 'Works'], ['fail', 'Fails']]))}
        {R('Device', r.device === 'new' ? 'new' : 'known', (v) => set(() => api.setReview({ device: v })), o([['known', 'Known'], ['new', 'New']]),
          'Applies to email, Google and Apple sign-in.')}
        {R('Username', (api.user && api.user.locked) ? 'recent' : 'free', (v) => set(() => api.setUser({ locked: v === 'recent', since: v === 'recent' ? GS_DAY0.getTime() : null })), o([['free', 'Free to change'], ['recent', 'Changed recently']]))}
      </Group>

      <Group title="Editions">
        {R('This edition', edVal, setEd, o([['none', 'Not played'], ['live', 'In progress'], ['average', 'Average'], ['hard', 'Hard'], ['failed', 'Failed']]),
          "This edition's play on every screen that shows it: the day for each daily game, the week for Escape and Delve, the case for Casebook. Hard: every try and hint used, still won. Average, Hard and Failed are staged for Daily Word, Daily Groups and Daily Mystery (Escape has Hard only); other games keep their seeded play. Not played applies to a free account. Nothing picked: as seeded.")}
        {R('Ended unfinished', r.unfinished ? 'on' : 'off', (v) => set(() => api.setReview({ unfinished: v === 'on' })), o([['off', 'None'], ['on', 'A day']]),
          'Adds a Daily Groups day and a Delve week that ended before you finished.')}
      </Group>

      <Group title="Escape">
        {R('This week’s room, finished', r.escape === 'par' || r.escape === 'over' ? r.escape : 'under', (v) => set(() => api.setReview({ escape: v })), o([['under', 'Under par'], ['par', 'On par'], ['over', 'Over par']]),
          'The finished play when This edition is Average or nothing is picked.')}
      </Group>

      {window.GsBarrowConfigRow ? <Group title="The Barrow of Hollowmere"><window.GsBarrowConfigRow /></Group> : null}

      <Group title="Pass changes">
        {R('Pass changes', r.passFail ? 'fail' : 'work', (v) => set(() => api.setReview({ passFail: v === 'fail' })), o([['work', 'Work'], ['fail', 'Fail']]),
          'Covers cancel, resume, switch and keeping the current plan.')}
        {R('Pass ended', sub.endedOn ? 'today' : 'earlier', (v) => setSub({ endedOn: v === 'today' ? GS_DAY0.getTime() : null }), o([['earlier', '18 September'], ['today', 'Today']]),
          'The one date every page prints for an ended Pass (Subscription None, Had the Pass before Yes).')}
      </Group>
    </React.Fragment>
  );
};

Object.assign(window, { ConfigExtraBase });
