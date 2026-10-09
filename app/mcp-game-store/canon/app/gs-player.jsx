// ============================================================================
// [Platform] — each game's player page, its way in from the game
// page, and the Library dropdown in the top bar. From delve-two-pages,
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
  daily: { units: 'puzzles', run: 'DAYS RUNNING', strip: ['LAST SEVEN DAYS', 'days', [['2 Oct', true], ['3 Oct', false], ['4 Oct', true], ['5 Oct', true], ['6 Oct', true], ['7 Oct', true], ['8 Oct', true]]], ends: ['Solved', 'Missed'],
    recent: [{ ending: 'Solved in 3 of 6', when: 'Word Puzzle · Today', sid: 'word-today', art: 'word', k: 'Solved' }, { ending: 'Escaped in 7 moves', when: 'Escape Room · Today', sid: 'escape-today', art: 'escape', k: 'Solved' },
      { ending: 'Missed', when: 'Murder Mystery · Today', sid: 'murder-today', art: 'murder', k: 'Missed' }, { ending: 'Solved in 4 of 6', when: 'Word Puzzle · 5 October', sid: 'word-1005', art: 'word', k: 'Solved' },
      { ending: 'Solved', when: 'Murder Mystery · 4 October', sid: 'murder-1004', art: 'murder', k: 'Solved' }] },
  casebook: { units: 'cases', run: 'WEEKS RUNNING', strip: ['LAST SIX WEEKS', 'weeks', [['31 Aug', true], ['7 Sep', true], ['14 Sep', false], ['21 Sep', true], ['28 Sep', false], ['5 Oct', true]]], ends: ['Solved', 'Unsolved'],
    recent: [{ ending: 'Solved', when: 'Week of 5 October', sid: 'casebook' }, { ending: 'Unsolved', when: 'Week of 21 September', sid: 'casebook' }, { ending: 'Solved', when: 'Week of 7 September', sid: 'casebook' }, { ending: 'Solved', when: 'Week of 31 August', sid: 'casebook' }] },
  hunter: { units: 'days', run: null, strip: null, ends: null, recent: [{ ending: null, when: '5 October', sid: 'hunter' }] },
};
// Card lines. Delve and Daily Puzzles use the default line.
const GP_LINE = { casebook: 'See every case you’ve worked and the lies you caught.', hunter: 'See every day you’ve explored, what you learned and who you met.' };
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
        {c.run && <div className="gs-stack-xs"><span className="gs-label">{c.run}</span><span className="gs-figure">{id === 'daily' ? 5 : id === 'casebook' ? 1 : 3}</span></div>}
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
  if (gs.view !== 'out' && gs.route.page === 'record') { const L = window.GS_LIBRARY && window.GS_LIBRARY[id]; return L ? <L /> : <GpPlayer id={id} />; }
  return <GsGamePage id={id} top={gs.view !== 'out' ? <GpCard id={id} /> : null} />;
};

// Top-bar dropdowns. Games: all games, then each game page. Played: each game's player page.
const gpGameItems = (gs) => [['all', 'All games', () => gs.go('games'), null], ...GS_GAME_ORDER.map((k) => [k, GS_GAMES[k].name, () => gs.go(GS_GAMES[k].route), GS_GAMES[k].art])];
const gpPlayedItems = (gs) => GS_GAME_ORDER.map((k) => [k, GS_GAMES[k].name, () => gpToRecord(gs, k), GS_GAMES[k].art]);
const GpDrop = ({ label, items, here }) => {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  return (
    <div className="gs-acct" ref={wrap}>
      <button type="button" className="gs-navlink" aria-expanded={open} aria-haspopup="menu" aria-current={here ? 'page' : undefined} onClick={() => setOpen((v) => !v)}>
        {label} <DS.Icon name="down" size={16} />
      </button>
      {open && (
        <div className="gs-pop pg-yours-pop" role="menu" aria-label={label}>
          {items.map(([k, l, fn, art]) => <button key={k} type="button" role="menuitem" className={'gs-menu-item' + (art ? ' gs-menu-ico' : '')} onClick={() => { setOpen(false); fn(); }}>{art && <GpMini art={art} sm />}{l}</button>)}
        </div>
      )}
    </div>
  );
};
const GpMenuGroup = ({ label, items, pick, first }) => <>
  {!first && <div className="gs-menu-div" role="separator" />}
  <span className="gs-label pg-menu-label">{gpUp(label)}</span>
  {items.map(([k, l, fn, art]) => <button key={k} type="button" role="menuitem" className={'gs-menu-item' + (art ? ' gs-menu-ico' : '')} onClick={() => pick(fn)}>{art && <GpMini art={art} sm />}{l}</button>)}
  <div className="gs-menu-div" role="separator" />
</>;
const gpGameRoutes = () => ['games', ...GS_GAME_ORDER.map((k) => GS_GAMES[k].route)];
const GpGamesNav = () => {
  const gs = useGs();
  return <GpDrop label="Games" items={gpGameItems(gs)} here={gpGameRoutes().includes(gs.route.name) && gs.route.page !== 'record'} />;
};
const GpGamesNavMenu = ({ pick }) => <GpMenuGroup label="Games" items={gpGameItems(useGs())} pick={pick} first />;
const GpNav = () => {
  const gs = useGs();
  if (gs.view === 'out') return null;
  return <GpDrop label="Library" items={gpPlayedItems(gs)} here={gs.route.page === 'record'} />;
};
const GpNavMenu = ({ pick }) => {
  const gs = useGs();
  if (gs.view === 'out') return null;
  return <GpMenuGroup label="Library" items={gpPlayedItems(gs)} pick={pick} first />;
};

Object.assign(window, { GsDelve: gpGame('delve'), GsPuzzles: gpGame('daily'), GsCasebook: gpGame('casebook'), GsHunter: gpGame('hunter'),
  GsGamesNav: GpGamesNav, GsGamesNavMenu: GpGamesNavMenu, GsNavExtra: GpNav, GsNavExtraMenu: GpNavMenu });
