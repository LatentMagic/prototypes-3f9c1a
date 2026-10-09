// ============================================================================
// [Platform] — each game's player page, its way in from the game
// page. (The top bar's Library dropdown gave way to the Library page, app/gs-discover.jsx, 2026-10-09.) From delve-two-pages,
// option 2 refined as A (docs/specs/delve-two-pages/handoff-2026-10-08-route-pick.md).
// Ratified 2026-10-08: the top-bar item is "Library"; the player page is titled with the game's name alone.
// The card reads "IN YOUR LIBRARY" and links "Go to your <game>"; its line is not decided yet.
// ============================================================================
// ---- Seed: one player's Delve ------------------------------
const GP_RECENT = [
  { date: '5 October', ending: 'Close call' },
  { date: '28 September', ending: 'Alone' },
  { date: '21 September', ending: 'Close call' },
  { date: '7 September', ending: 'Caught' },
];
const GP_WEEKS = [['31 Aug', false], ['7 Sep', true], ['14 Sep', false], ['21 Sep', true], ['28 Sep', true], ['5 Oct', true]];
const GP_ENDINGS = ['Clean rescue', 'Close call', 'Alone', 'Caught'];
const GP_ACH = [
  { cls: 'Discovery', line: 'Find something', items: [
    { n: 'Found the fungus path', got: true },
    { n: 'Found the escape tunnel', got: true },
    { n: 'Found the drum room', how: 'It’s off the main tunnels.' }] },
  { cls: 'Mastery', line: 'Do it well', items: [
    { n: 'A natural 20', got: true },
    { n: 'Clean rescue', how: 'Get her out before the warren wakes.' },
    { n: 'Unseen', how: 'Reach the ritual chamber without a failed stealth check.' }] },
  { cls: 'Completion', line: 'Do all of it, over many plays', items: [
    { n: 'Every ending', of: 4, have: 3 },
    { n: 'Four weeks running', of: 4, have: 3 },
    { n: 'Ten scenes', of: 10, have: 4 }] },
];


const GpMini = ({ art, sm }) => <span className={'pg-mini' + (sm ? ' is-sm' : '')} aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART[art] }} />;

// ---- Your Delve parts -----------------------------------------------------------
const GpThisWeek = ({ who }) => {
  const gs = useGs();
  return (
    <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">THIS WEEK’S SCENE</span>
      <h2 className="mcp-t-card">{GS_PAGES.delve.week.line}</h2>
      {who === 'played' && <>
        <div className="gs-tags"><DS.Tag kind="daily" icon="check">Played · Close call</DS.Tag></div>
        <div><DS.TextLink onClick={() => gs.go('session', { id: 'delve' })}>See this week’s session</DS.TextLink></div>
      </>}
      <p className="gs-small">New scene Monday 12 October.</p>
    </DS.Card>
  );
};
// Per game: the unit you play, how a run is counted, how plays can end, and recent plays.
// Hunter has nothing decided yet: blanks show as a muted "—".
const GP_CFG = {
  delve: { units: 'scenes', run: 'WEEKS RUNNING', strip: ['LAST SIX WEEKS', 'weeks', GP_WEEKS], ends: GP_ENDINGS,
    recent: GP_RECENT.map((r) => ({ ...r, when: 'Week of ' + r.date, sid: 'delve' })) },
  word: { units: 'words' }, groups: { units: 'groups' }, mystery: { units: 'cases' }, escape: { units: 'rooms' },
  casebook: { units: 'cases', run: 'WEEKS RUNNING', strip: ['LAST SIX WEEKS', 'weeks', [['31 Aug', true], ['7 Sep', true], ['14 Sep', false], ['21 Sep', true], ['28 Sep', false], ['5 Oct', true]]], ends: ['Solved', 'Unsolved'],
    recent: [{ ending: 'Solved', when: 'Week of 5 October', sid: 'casebook' }, { ending: 'Unsolved', when: 'Week of 21 September', sid: 'casebook' }, { ending: 'Solved', when: 'Week of 7 September', sid: 'casebook' }, { ending: 'Solved', when: 'Week of 31 August', sid: 'casebook' }] },
  hunter: { units: 'days', run: null, strip: null, ends: null, recent: [{ ending: null, when: '5 October', sid: 'hunter' }] },
};
// Card lines. Delve uses the default line.
const GP_LINE = {
  word: 'See every day’s word and how many guesses it took you.', groups: 'See every day’s groups and how many mistakes you made.',
  mystery: 'See every case you closed and every one that got away.', escape: 'See every room you got out of and how many moves it took.',
  casebook: 'See every case you’ve worked and the lies you caught.', hunter: 'See every day you’ve explored, what you learned and who you met.' };
const gpUp = (t) => t.toUpperCase();
const GpRecord = ({ id }) => {
  const c = GP_CFG[id];
  const n = c.recent.length;
  const count = (e) => c.recent.filter((r) => (r.k || r.ending) === e).length;
  const on = c.strip ? c.strip[2].filter(([, v]) => v).length : 0;
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Your {c.units}</h2>
      <div className="gs-grid3">
        <div className="gs-stack-xs"><span className="gs-label">{gpUp(c.units)} PLAYED</span><span className="gs-figure">{n}</span></div>
        {c.run && <div className="gs-stack-xs"><span className="gs-label">{c.run}</span><span className="gs-figure">{id === 'casebook' ? 1 : 3}</span></div>}
        {c.strip && <div className="gs-stack-sm"><span className="gs-label">{c.strip[0]}</span>
          <div className="gs-days" role="img" aria-label={'Played ' + on + ' of the last ' + c.strip[2].length + ' ' + c.strip[1]}>{c.strip[2].map(([d, v]) => <i key={d} title={d} className={v ? 'is-on' : ''} />)}</div>
        </div>}
      </div>
      <div className="gs-stack-sm">
        <span className="gs-label">HOW YOUR {gpUp(c.units)} ENDED</span>
        {c.ends ? <ul className="gs-plain">{c.ends.map((e) => { const k = count(e); return (
          <li key={e} className="pg-kv"><span className={k ? 'gs-strong' : 'gs-muted'}>{e}</span><span className={'gs-num-text ' + (k ? 'gs-strong' : 'gs-muted')}>{k ? k + (k > 1 ? ' times' : ' time') : 'Not yet'}</span></li>); })}</ul>
          : <span className="gs-muted">—</span>}
      </div>
    </section>
  );
};
const GpRecent = ({ id }) => {
  const gs = useGs();
  const c = GP_CFG[id];
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Recent {c.units}</h2>
      <ul className="gs-hist">{c.recent.map((r, i) => (
        <li key={i}><button type="button" className="gs-hrow" onClick={() => gs.go('session', { id: r.sid })}>
          <GpMini art={r.art || GS_GAMES[id].art} />
          <span className="gs-stack-xs"><span className={r.ending ? 'gs-strong' : 'gs-muted'}>{r.ending || '—'}</span><span className="gs-small">{r.when}</span></span>
          <DS.Icon name="back" size={16} style={{ transform: 'rotate(180deg)' }} />
        </button></li>))}</ul>
    </section>
  );
};
const GpAch = ({ who }) => {
  const played = who === 'played';
  const earned = played ? GP_ACH.flatMap((g) => g.items.filter((i) => i.got).map((i) => i.n)) : [];
  return (
    <section className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">{played ? 'Still to earn' : 'What you can earn'}</h2>{played && <span className="gs-small">{earned.length} earned</span>}</div>
      {GP_ACH.map((g) => (
        <div key={g.cls} className="gs-stack-sm">
          <span className="gs-label">{g.cls.toUpperCase()} · <span className="gs-muted" style={{ letterSpacing: 0, fontWeight: 400 }}>{g.line}</span></span>
          <ul className="gs-plain">{g.items.filter((i) => !(played && i.got)).map((i) => (
            <li key={i.n} className="pg-ach">
              <span className="gs-stack-xs"><span className="gs-strong">{i.n}</span>{i.how && <span className="gs-small">{i.how}</span>}</span>
              {i.of && <span className="pg-ach-bar"><DS.ProgressBar label={(played ? i.have : 0) + ' of ' + i.of} value={played ? i.have : 0} max={i.of} /></span>}
            </li>))}</ul>
        </div>
      ))}
      {played && <p className="gs-small">Earned: {earned.join(', ')}.</p>}
    </section>
  );
};
const GpYoursBody = ({ id }) => {
  const a = <div className="gs-stack-md" style={{ gap: 36 }}>{id === 'delve' && <GpThisWeek who="played" />}<GpRecord id={id} /><GpRecent id={id} /></div>;
  if (id !== 'delve') return a;
  return <div className="gs-pitch">{a}<div className="gs-stack-md" style={{ gap: 36 }}><GpAch who="played" /></div></div>;
};

const gpToRecord = (gs, id) => gs.go(GS_GAMES[id].route, { page: 'record' });
const GpCard = ({ id }) => {
  const gs = useGs();
  const g = GS_GAMES[id];
  return (
    <section className="pg-band" aria-label="In your library">
      <GpMini art={g.art} />
      <div className="gs-stack-xs"><span className="gs-label">IN YOUR LIBRARY</span>
        <span className="gs-small">{GP_LINE[id] || 'See every ' + GP_CFG[id].units.replace(/s$/, '') + ' you’ve played and how each one ended.'}</span></div>
      <div className="pg-band-link"><DS.TextLink onClick={() => gpToRecord(gs, id)}>{'Go to your ' + g.name}</DS.TextLink></div>
    </section>
  );
};
const GpPlayer = ({ id }) => {
  const gs = useGs();
  const g = GS_GAMES[id];
  return (
    <main className="gs-wrap gs-main">
      <section className="rf-head">
        <span><GsCover art={g.art} /></span>
        <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
          <h1 className="gs-h1">{g.name}</h1>
          <DS.TextLink onClick={() => gs.go(g.route)}>{'About ' + g.name}</DS.TextLink>
        </div>
      </section>
      <GpYoursBody id={id} />
    </main>
  );
};
// Every game page: signed in, the card sits above the cover;
// route.page === 'record' opens that game's player page.
const gpGame = (id) => () => {
  const gs = useGs();
  if (gs.route.page === 'editions' && window.GsEditions && ED_GAMES.includes(id)) return <GsEditions id={id} />;
  if (gs.view !== 'out' && gs.route.page === 'record') { const L = window.GS_LIBRARY && window.GS_LIBRARY[id]; return L ? <L /> : <GpPlayer id={id} />; }
  return <GsGamePage id={id} top={gs.view !== 'out' && (id !== 'hunter' || lbPast(gs)) ? <GpCard id={id} /> : null} />;
};

Object.assign(window, { GsDelve: gpGame('delve'), GsWord: gpGame('word'), GsGroups: gpGame('groups'), GsMystery: gpGame('mystery'), GsEscape: gpGame('escape'),
  GsCasebook: gpGame('casebook'), GsHunter: gpGame('hunter') });
