// ============================================================================
// After Pixels — review settings in Config (PROTOTYPE AID). Exported as
// ConfigExtraBase (wrapped by ConfigExtra in gs-pass-aids.jsx); reads and writes the app through window.gsApi.
// ============================================================================
import React from 'react';
import { GS_DAY0, GS_CUR } from './gs-billing.jsx';
import { ConfigGroup, ConfigRow } from './config.jsx';
import { GsBarrowConfigRow } from './gs-pass-aids.jsx';
import { GS_GAMES, GS_ED_SIDS, GS_SESSIONS, gsGameOfRoute, gsFresh, gsNotPlayed } from './gs-data.jsx';
import { gsEdFollow } from './gs-session.jsx';
import { GsPassStage, cprFirstState, cprLocked, CPR_STAGE } from './gs-pass-store.jsx';
import { lbNow } from './gs-library.jsx';
import { phVisible } from './gs-history.jsx';

export const ConfigExtraBase = () => {
  const api = window.gsApi || {};
  const r = api.review || {};
  const sub = api.sub || {};
  const [, bump] = React.useState(0);
  const set = (fn) => { fn(); setTimeout(() => bump((n) => n + 1), 0); };
  const Group = ConfigGroup; const Row = ConfigRow;
  const o = (pairs) => pairs.map(([value, label]) => ({ value, label }));
  // Changing the subscription signs in, so the demo bar moves with it.
  // The game on screen: a game's own page, or the game of the session page open.
  const route = api.route || {};
  const gid = gsGameOfRoute(route.name) || (route.name === 'session' && GS_SESSIONS[route.id] ? GS_SESSIONS[route.id].gid : null);
  const g = gid ? GS_GAMES[gid] : null;
  // The game on screen shows its not-started Now card, however it got there: Not played, a new account, a game marked never played,
  // a free player's unplayed first part or daily, a Pass holder's untouched Barrow, or a Pass-only game nobody has played. Read from the same
  // tests the pages use, so the row cannot say Not played over a page that shows a play, or nothing over one that does not.
  const notStarted = () => {
    if (gsFresh(api) || gsNotPlayed(api) || (gid && r.never === gid)) return true;
    if (!g || api.view === 'out' || cprLocked(api, gid)) return false;
    if (gid === 'hunter') return !phVisible(api).some((p) => p.gid === 'hunter');
    if (gid === 'barrow') return ['none', 'pass'].includes(cprFirstState(api, 'barrow'));
    if (api.view !== 'pass' && CPR_STAGE[gid] === 'first') return cprFirstState(api, gid) === 'none';
    return !lbNow(api, gid);
  };
  // This edition: one pick over what the page shows: not started, the old week (in progress), or ed (the finished play).
  const edVal = notStarted() ? 'none' : r.week === 'live' ? 'live' : ['average', 'hard', 'failed'].includes(r.ed) ? r.ed : null;
  const needsPass = !!g && !g.free && !g.first;
  const [forced, setForced] = React.useState(null);
  const edAt = (v) => [v, route.name, route.id, route.page].join('|');
  const edLabel = { hard: 'Hard', failed: 'Failed' };
  // When the pick does nothing for the game on screen, or moves the view to work: the first rule that fits, in order. The view moves only in setEd, at the pick.
  // Not played never moves the view: it shows the not-started card in the view the page is in.
  const edWhy = (v) => {
    if (!g || !v || v === 'none') return null;
    const ids = GS_ED_SIDS[gid];
    if (!ids) return { text: g.name + ' has no result for an edition, so this doesn\u2019t change it.' };
    if (api.view === 'free' && needsPass) return { view: 'pass', text: g.name + ' needs the Pass, so the view is now Pass.' };
    if (edLabel[v] && !ids[v]) return { text: g.name + ' has no ' + edLabel[v] + ' play, so it shows its normal play.' };
    return null;
  };
  const edForce = (v) => { const w = edWhy(v); return w && w.view ? w : null; };
  const edNote = (forced && forced.at === edAt(edVal) ? forced.text : null) || (() => { const w = edWhy(edVal); return w && !w.view ? w.text : null; })();
  // A session page of an earlier edition then no longer is the edition described, so it moves (gsEdFollow) once the pick has rendered.
  const setEd = (v) => set(() => {
    const forced = edForce(v);
    if (forced) api.setDemoView(forced.view);
    setForced(forced ? { text: forced.text, at: edAt(v) } : null);
    api.setReview({ today: v === 'none' ? 'none' : 'played', week: v === 'live' ? 'live' : 'done', ed: ['average', 'hard', 'failed'].includes(v) ? v : null });
    // The Free: Word and Escape row below says the same: Not played leaves Word's day and Escape's first room unplayed, any other pick plays them.
    GsPassStage.set({ freeNew: v === 'none' });
    setTimeout(() => gsEdFollow(window.gsApi), 0);
  });
  // The hint says what the pick does not reach, read from the data: which games lack a pick and which have no result for an edition.
  const keys = Object.keys(GS_GAMES); const names = (ks) => ks.map((k) => GS_GAMES[k].name);
  const list = (n) => (n.length > 1 ? n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1] : n[0]);
  const withEd = keys.filter((k) => GS_ED_SIDS[k]);
  const lostHard = names(withEd.filter((k) => GS_ED_SIDS[k].hard && GS_SESSIONS[GS_ED_SIDS[k].hard].loss));
  const noFailed = names(withEd.filter((k) => !GS_ED_SIDS[k].failed));
  const noResult = [...names(keys.filter((k) => !GS_ED_SIDS[k] && !GS_GAMES[k].added)), ...(keys.some((k) => !GS_ED_SIDS[k] && GS_GAMES[k].added) ? ['the added games'] : [])];
  const edHint = "This edition's play on every screen that shows it: the day for each daily game, the week for Escape and Delve, the case for Casebook. Hard: a win that took most of the tries or hints."
    + (lostHard.length ? ' ' + list(lostHard) + (lostHard.length > 1 ? ' end' : ' ends') + ' in a loss.' : '') + (noFailed.length ? ' ' + list(noFailed) + (noFailed.length > 1 ? ' have' : ' has') + ' no Failed.' : '')
    + (noResult.length ? ' ' + list(noResult) + (noResult.length > 1 ? ' have' : ' has') + ' no result for an edition.' : '') + ' Not played shows the not-started card on every game, in the view you are in. Nothing picked: as seeded.';
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
          edHint)}
        {edNote ? <p className="kit-config-edwarn" role="status">{edNote}</p> : null}
        {R('Past day', r.pastDay || 'none', (v) => set(() => api.setReview({ pastDay: v })), o([['none', 'None'], ['live', 'In progress'], ['late', 'Finished late']]),
          'Adds a Common day (Pass) and a Guess day from before today, each started on its day.')}
      </Group>

      <Group title="Escape">
        {R('This week’s room, finished', r.escape === 'par' || r.escape === 'over' ? r.escape : 'under', (v) => set(() => api.setReview({ escape: v })), o([['under', 'Under par'], ['par', 'On par'], ['over', 'Over par']]),
          'The finished play when This edition is Average or nothing is picked.')}
      </Group>

      {GsBarrowConfigRow ? <Group title="The Barrow of Hollowmere"><GsBarrowConfigRow /></Group> : null}

      <Group title="Pass changes">
        {R('Pass changes', r.passFail ? 'fail' : 'work', (v) => set(() => api.setReview({ passFail: v === 'fail' })), o([['work', 'Work'], ['fail', 'Fail']]),
          'Covers cancel, resume, switch and keeping the current plan.')}
        {R('Pass ended', sub.endedOn ? 'today' : 'earlier', (v) => setSub({ endedOn: v === 'today' ? GS_DAY0.getTime() : null }), o([['earlier', '18 September'], ['today', 'Today']]),
          'The one date every page prints for an ended Pass (Subscription None, Had the Pass before Yes).')}
      </Group>

      <Group title="Pricing">
        {R('Currency', r.cur, (v) => set(() => api.setReview({ cur: v })), Object.entries(GS_CUR).map(([value, c]) => ({ value, label: c.name })),
          'The Pass prices on every screen. £ is the UK and the default; $ is a visitor in the US; US$ is a dollar visitor anywhere else. ?cur=GBP, USD or USD-INTL opens with it set, and Reset returns to that.')}
      </Group>
    </React.Fragment>
  );
};

