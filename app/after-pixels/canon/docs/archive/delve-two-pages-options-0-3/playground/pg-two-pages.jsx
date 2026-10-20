// Playground: a game's two pages, Delve only. Overrides window.GsDelve (the route)
// and window.GsDemoBar (the strip replaces the demo bar; its Viewer row sets the same
// app state). Pieces copied from app/gs-game.jsx (GsPlayBox, GsFacts, GsFinished) are
// marked; they are copies, not improvements.
const PG_KEY = 'pg_two_pages_v1';
const pgLoad = () => { try { return JSON.parse(localStorage.getItem(PG_KEY)) || {}; } catch (e) { return {}; } };
let pgState = { opt: '1', viewer: 'share', open: true, ...pgLoad() };
const pgSubs = new Set();
const pgSet = (patch) => {
  pgState = { ...pgState, ...patch };
  try { localStorage.setItem(PG_KEY, JSON.stringify(pgState)); } catch (e) {}
  pgSubs.forEach((f) => f(pgState));
};
const usePg = () => {
  const [s, setS] = React.useState(pgState);
  React.useEffect(() => { pgSubs.add(setS); return () => pgSubs.delete(setS); }, []);
  return s;
};

const PG_VIEWERS = [
  { id: 'share', short: 'Shared link', name: 'Signed out, arrived from a friend’s shared result', view: 'out' },
  { id: 'nopass', short: 'No Pass', name: 'Signed in, no Pass', view: 'free' },
  { id: 'new', short: 'Pass, new', name: 'Pass holder, not played Delve', view: 'pass' },
  { id: 'played', short: 'Pass, played', name: 'Pass holder, has played Delve', view: 'pass' },
];

const PG_OPTS = [
  { id: '0', name: 'Today',
    stance: 'One page carries both. Your result shows on this week’s card; History holds every play.',
    cost: 'No home for streak, endings, achievements or friends. A returning player gets the sales page.',
    pub: 'Everything on today’s page, including this week’s card, which changes with the viewer.',
    own: 'None.' },
  { id: '1', name: 'The button knows you',
    stance: 'The public page’s one action is the bridge. Once you’ve played, it says “Go to your Delve”. Your Delve exists only with the Pass.',
    cost: 'A player who has played is one tap further from playing. A new Pass holder can’t see what there is to earn until they play.',
    pub: 'Holds the pitch, who does what, how it looks in chat, a finished play, facts and stat tiles. Left off: this week’s card (its status was personal) and More games (the Games page has them).',
    own: 'Holds this week, streak, endings, recent scenes, achievements still to earn and friends. Left off: the pitch and install steps; you have both.' },
  { id: '2', name: 'Signed in, Delve is yours',
    stance: 'Signed in, every link to Delve opens Your Delve. The public page is for strangers, one link away as “About Delve”. Your Delve exists for every account and does the selling there.',
    cost: 'A member reading the public page gets one action, “Go to your Delve”, so a member without the Pass buys from their own page.',
    pub: 'Lean: pitch, who does what, one chat shot, a finished play, facts. Left off: stat tiles (facts cover length), this week’s card, More games.',
    own: 'Holds this week (with the Pass action or Play), streak, endings, recent scenes, achievements still to earn, friends. With nothing yet: this week, what you can earn, friends.' },
  { id: '3', name: 'One header, two tabs',
    stance: 'Both pages share a header: cover, name and the one action. Signed in, a tab row adds Your Delve, which opens first once you’ve played.',
    cost: 'The header’s action has to suit both tabs, so Your Delve has no play button of its own. Tabs read as one page; the public address must still stand alone.',
    pub: 'Holds facts, pitch, who does what, this week’s scene (title only, same for all), how it looks, a finished play, stat tiles, More games. Left off: anything of yours.',
    own: 'Holds this week’s status, streak, endings, recent scenes, achievements, friends. Left off: actions; the header has the one action.' },
];

// ---- Seed: one player's Delve, and their friends ------------------------------
const PG_RECENT = [
  { date: 'Monday 5 October', ending: 'Close call' },
  { date: 'Monday 28 September', ending: 'Alone' },
  { date: 'Monday 21 September', ending: 'Close call' },
  { date: 'Monday 7 September', ending: 'Caught' },
];
const PG_WEEKS = [['31 Aug', false], ['7 Sep', true], ['14 Sep', false], ['21 Sep', true], ['28 Sep', true], ['5 Oct', true]];
const PG_ENDINGS = ['Clean rescue', 'Close call', 'Alone', 'Caught'];
const PG_ACH = [
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
const PG_FRIENDS = ['quietfox', 'Tamsin_R', 'bramble'];

// ---- Who is looking, and what the one action says ------------------------------
const pgWho = (gs, st) => (gs.view === 'out' ? 'out' : gs.view === 'free' ? 'nopass' : st.viewer === 'played' ? 'played' : 'new');
const pgAction = (opt, who, gs) => {
  const toYours = { label: 'Go to your Delve', fn: () => gs.go('delve', { page: 'yours' }) };
  const pass = { label: 'Start free month', fn: gs.getPass, note: true };
  const play = { label: 'Play this week’s scene', fn: () => gs.play('Delve', 'delve') };
  const earlier = { label: 'Play an earlier scene', fn: () => gs.play('Delve, an earlier scene', 'delve') };
  if (who === 'out') return pass;
  if (opt === '2') return toYours;
  if (who === 'nopass') return pass;
  if (who === 'new') return play;
  return opt === '3' ? earlier : toYours;
};
// For the Why sheet: what each viewer meets, derived from the same rules.
const pgActionText = (opt, who) => {
  if (opt === '0') return who === 'out' || who === 'nopass' ? 'Get the Pass' : 'Play in your AI';
  return { out: 'Start free month', nopass: opt === '2' ? 'Go to your Delve' : 'Start free month',
    new: opt === '2' ? 'Go to your Delve' : 'Play this week’s scene',
    played: opt === '3' ? 'Play an earlier scene' : 'Go to your Delve' }[who];
};
const pgLandsText = (opt, who) => (opt === '2' && who !== 'out') || (opt === '3' && who === 'played') ? 'Your Delve' : 'Public page';
const pgReachText = (opt, who) => {
  if (who === 'out') return 'No page of their own until they sign in.';
  if (opt === '0') return who === 'played' ? 'No page of their own; plays are in History.' : 'No page of their own.';
  if (opt === '1') return who === 'played' ? 'The action, “Go to your Delve”. Back: “About Delve”.' : 'No page of their own yet.';
  if (opt === '2') return 'Lands on it. Back: “About Delve”.';
  return 'The Your Delve tab.';
};

// ---- Public page parts -------------------------------------------------------
const PgCrumb = ({ last }) => {
  const gs = useGs();
  return (
    <nav aria-label="Breadcrumb" className="gs-crumb">
      <button type="button" className="gs-inlink" onClick={() => gs.go('games')}>Games</button>
      <span aria-hidden="true">/</span><span>Adventures</span><span aria-hidden="true">/</span>
      {last ? <><button type="button" className="gs-inlink" onClick={() => gs.go('delve', { page: 'about' })}>Delve</button><span aria-hidden="true">/</span><span aria-current="page">{last}</span></>
        : <span aria-current="page">Delve</span>}
    </nav>
  );
};
// Copy of GsPlayBox (app/gs-game.jsx) with the action passed in.
const PgBox = ({ action, steps = true }) => {
  const b = GS_PAGES.delve.box;
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">{b.label}</span>
      <h2 className="mcp-t-card">{b.heading}</h2>
      {steps && <GsSteps items={b.steps} />}
      <DS.Button block onClick={action.fn}>{action.label}</DS.Button>
      {action.note && <p className="gs-small">{b.small} {GS.purchase}</p>}
      <div className="gs-rule" />
      <div className="gs-stack-sm"><span className="gs-label">WORKS WITH</span><p className="gs-small">{GS.works}</p></div>
    </DS.Card>
  );
};
const PgHero = ({ action }) => (
  <section className="gs-head-split">
    <div className="gs-hero-cover">
      <GsCover art="delve" />
      <div className="gs-cover-over"><span className="gs-label">{GS_PAGES.delve.label}</span><h1 className="gs-cover-title">Delve</h1></div>
    </div>
    <PgBox action={action} />
  </section>
);
// Copy of GsFacts.
const PgFacts = () => {
  const p = GS_PAGES.delve;
  const L = [['ai', 'What your AI does'], ['age', 'Age'], ['long', 'How long'], ['often', 'How often'], ['players', 'Players']];
  return (
    <section className="gs-stack-md" aria-label="Facts">
      <dl className="gs-facts">{L.map(([k, l]) => <div key={k} className="gs-fact"><dt className="gs-label">{l.toUpperCase()}</dt><dd>{gsOr(p.facts[k])}</dd></div>)}</dl>
      <div className="gs-tags">{p.tags.map((t) => <DS.Tag key={t} kind="daily">{t}</DS.Tag>)}</div>
    </section>
  );
};
const PgPitch = () => {
  const p = GS_PAGES.delve;
  return (
    <section className="gs-pitch">
      <div className="gs-stack-md gs-measure"><h2 className="mcp-t-sec">{p.pitch.h}</h2>{p.pitch.ps.map((t, i) => <p key={i}>{t}</p>)}</div>
      <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
        <span className="gs-label">WHO DOES WHAT</span><GsWhoCols ai={p.who.ai} server={p.who.server} />
      </DS.Card>
    </section>
  );
};
const PgShots = ({ one }) => {
  const shots = one ? GS_PAGES.delve.shots.slice(0, 1) : GS_PAGES.delve.shots;
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">How it looks in your chat</h2>
      <div className={shots.length > 1 ? 'gs-chats' : 'gs-grid2'}>{shots.map((c, i) => <GsShot key={i} id="dailyWord" caption={c} />)}</div>
    </section>
  );
};
// Copy of GsFinished.
const PgFinished = () => {
  const gs = useGs(); const s = GS_SESSIONS.delve;
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">A finished play</h2>
      <div className="gs-grid2 gs-top-align">
        <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
          <div className="gs-mini"><GsCover art={s.art} /><div className="gs-stack-xs" style={{ justifyItems: 'start' }}><span className="gs-small">{s.game}</span><span className="gs-figure">{s.result}</span></div></div>
          <div className="gs-figs">{s.figures.map((f, i) => <span key={i} className="gs-fig">{f}</span>)}<span className="gs-fig gs-fig-quiet">{s.date}</span></div>
          <div><DS.TextLink onClick={() => gs.go('session', { id: 'delve' })}>See a finished session (demo)</DS.TextLink></div>
        </DS.Card>
        <GsShareCard s={s} />
      </div>
    </section>
  );
};
const PgStats = () => (
  <section className="gs-grid3">
    <GsStat label="IN A SCENE" figure="6–7 locations" line="Sinkhole to ritual chamber, shuffled each run." />
    <GsStat label="TYPICAL RUN" figure="10–14 rolls" line="Every one listed on your session page afterwards." />
    <GsStat label="ENDINGS" figure="4 ways out" line="Clean rescue, close call, alone, or caught." />
  </section>
);
const PgWeekPlain = () => (
  <section className="gs-stack-md">
    <h2 className="mcp-t-sec">This week’s scene</h2>
    <div className="gs-grid3"><DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
      <GsCover art="delve" /><h3 className="mcp-t-card">Delve</h3><p className="gs-muted">{GS_PAGES.delve.week.line}</p><p className="gs-small">New scene Monday 12 October</p>
    </DS.Card></div>
  </section>
);
const PgMore = () => {
  const gs = useGs(); const marks = gsMarks(gs.view);
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">More games</h2>
      <div className="gs-grid3">{GS_GAME_ORDER.filter((k) => k !== 'delve').map((k) => <GsGameCard key={k} id={k} mark={marks[k]} />)}</div>
    </section>
  );
};

// ---- Your Delve parts -----------------------------------------------------------
const PgThisWeek = ({ opt, who }) => {
  const gs = useGs();
  const actions = opt !== '3';
  return (
    <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">THIS WEEK’S SCENE</span>
      <h2 className="mcp-t-card">{GS_PAGES.delve.week.line}</h2>
      {who === 'nopass' && <>
        <p className="gs-muted">This week’s scene is part of the Pass. Every earlier scene comes with it.</p>
        {actions && <div className="gs-act"><DS.Button onClick={gs.getPass}>Start free month</DS.Button></div>}
      </>}
      {who === 'new' && (actions
        ? <div className="gs-act"><DS.Button onClick={() => gs.play('Delve', 'delve')}>Play this week’s scene</DS.Button></div>
        : <p className="gs-muted">Not played yet. New scene Monday 12 October.</p>)}
      {who === 'played' && <>
        <div className="gs-tags"><DS.Tag kind="daily" icon="check">Played · Close call</DS.Tag></div>
        <div><DS.TextLink onClick={() => gs.go('session', { id: 'delve' })}>See this week’s session</DS.TextLink></div>
        <p className="gs-small">New scene Monday 12 October.</p>
        {actions && <div className="gs-act"><DS.Button variant="secondary" onClick={() => gs.play('Delve, an earlier scene', 'delve')}>Play an earlier scene</DS.Button></div>}
      </>}
    </DS.Card>
  );
};
const PgRecord = ({ who }) => {
  if (who !== 'played') {
    return (
      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">Your scenes</h2>
        <p className="gs-muted">Every scene you play lands here: how it ended, every roll, and your run of weeks.</p>
      </section>
    );
  }
  const count = (e) => PG_RECENT.filter((r) => r.ending === e).length;
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Your scenes</h2>
      <div className="gs-grid3">
        <div className="gs-stack-xs"><span className="gs-label">SCENES PLAYED</span><span className="gs-figure">4</span></div>
        <div className="gs-stack-xs"><span className="gs-label">WEEKS RUNNING</span><span className="gs-figure">3</span></div>
        <div className="gs-stack-sm"><span className="gs-label">LAST SIX WEEKS</span>
          <div className="gs-days" role="img" aria-label="Played 4 of the last 6 weeks">{PG_WEEKS.map(([d, on]) => <i key={d} title={d} className={on ? 'is-on' : ''} />)}</div>
        </div>
      </div>
      <div className="gs-stack-sm">
        <span className="gs-label">HOW YOUR SCENES ENDED</span>
        <ul className="gs-plain">{PG_ENDINGS.map((e) => { const n = count(e); return (
          <li key={e} className="pg-kv"><span className={n ? 'gs-strong' : 'gs-muted'}>{e}</span><span className={'gs-num-text ' + (n ? 'gs-strong' : 'gs-muted')}>{n ? n + (n > 1 ? ' times' : ' time') : 'Not yet'}</span></li>); })}</ul>
      </div>
    </section>
  );
};
const PgRecent = () => {
  const gs = useGs();
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Recent scenes</h2>
      <ul className="gs-hist">{PG_RECENT.map((r) => (
        <li key={r.date}><button type="button" className="gs-hrow" onClick={() => gs.go('session', { id: 'delve' })}>
          <span className="gs-today-cover" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART.delve }} />
          <span className="gs-stack-xs"><span className="gs-strong">{r.ending}</span><span className="gs-small">Week of {r.date.replace('Monday ', '')}</span></span>
          <DS.Icon name="back" size={16} style={{ transform: 'rotate(180deg)' }} />
        </button></li>))}</ul>
    </section>
  );
};
const PgAch = ({ who }) => {
  const played = who === 'played';
  const earned = played ? PG_ACH.flatMap((g) => g.items.filter((i) => i.got).map((i) => i.n)) : [];
  return (
    <section className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">{played ? 'Still to earn' : 'What you can earn'}</h2>{played && <span className="gs-small">{earned.length} earned</span>}</div>
      {PG_ACH.map((g) => (
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
const PgFriends = ({ who }) => {
  const gs = useGs();
  const [friends, setFriends] = React.useState(PG_FRIENDS);
  const [name, setName] = React.useState('');
  const [err, setErr] = React.useState('');
  const me = gs.user.username || 'You';
  const rows = who === 'played' ? [friends[0], me, ...friends.slice(1)] : friends;
  const add = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) { setErr('Enter a username.'); return; }
    if (friends.includes(n) || n === me) { setErr(n + ' is already on your list.'); return; }
    setFriends((f) => [...f, n]); setName(''); setErr('');
  };
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Among friends</h2>
      <ol className="pg-board">
        {rows.map((r, i) => (
          <li key={r} className={r === me ? 'is-me' : ''}><span className="gs-num-text gs-muted">{i + 1}</span><span className={r === me ? 'gs-strong' : ''}>{r}{r === me ? ' (you)' : ''}</span><GsGap /></li>
        ))}
        {who !== 'played' && <li className="is-me"><span className="gs-muted">–</span><span className="gs-strong">{me} (you)</span><span className="gs-small">Not played yet</span></li>}
      </ol>
      <form className="pg-add" onSubmit={add} noValidate>
        <DS.TextField label="Add a friend by username" value={name} error={err || undefined} onChange={(e) => { setName(e.target.value); if (err) setErr(''); }} autoComplete="off" />
        <DS.Button type="submit" variant="secondary">Add</DS.Button>
      </form>
    </section>
  );
};
const PgYoursBody = ({ opt, who }) => (
  <div className="gs-pitch">
    <div className="gs-stack-md" style={{ gap: 36 }}>
      <PgThisWeek opt={opt} who={who} />
      {who !== 'nopass' && <PgRecord who={who} />}
      {who === 'played' && <PgRecent />}
    </div>
    <div className="gs-stack-md" style={{ gap: 36 }}>
      <PgAch who={who} />
      <PgFriends who={who} />
    </div>
  </div>
);

// ---- The two pages, per option ----------------------------------------------------
const PgPublic = ({ opt, action }) => (
  <main className="gs-wrap gs-main">
    <PgCrumb />
    <PgHero action={action} />
    {opt === '1' && <><PgFacts /><PgPitch /><PgShots /><PgFinished /><PgStats /></>}
    {opt === '2' && <><PgPitch /><PgShots one /><PgFinished /><PgFacts /></>}
  </main>
);
const PgYours = ({ opt, who }) => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main">
      <PgCrumb last="Yours" />
      <section className="pg-yhead">
        <span className="pg-yhead-cover"><GsCover art="delve" /></span>
        <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
          <h1 className="gs-h1">Your Delve</h1>
          <DS.TextLink onClick={() => gs.go('delve', { page: 'about' })}>About Delve</DS.TextLink>
        </div>
      </section>
      <PgYoursBody opt={opt} who={who} />
    </main>
  );
};
const PgTabbed = ({ who, action, tab }) => {
  const gs = useGs();
  const tabs = who === 'out' ? null : [['about', 'About'], ['yours', 'Your Delve']];
  return (
    <main className="gs-wrap gs-main">
      <PgCrumb />
      <PgHero action={action} />
      {tabs && (
        <div className="pg-tabs" role="tablist" aria-label="Delve">
          {tabs.map(([id, l]) => <button key={id} type="button" role="tab" aria-selected={tab === id} aria-current={tab === id ? 'page' : undefined} className="gs-navlink" onClick={() => gs.go('delve', { page: id })}>{l}</button>)}
        </div>
      )}
      {tab === 'yours' && tabs ? <PgYoursBody opt="3" who={who} />
        : <><PgFacts /><PgPitch /><PgWeekPlain /><PgShots /><PgFinished /><PgStats /><PgMore /></>}
    </main>
  );
};

const PgDelve = () => {
  const gs = useGs(); const st = usePg();
  const opt = st.opt; const who = pgWho(gs, st); const page = gs.route.page;
  if (opt === '0') return <GsGamePage id="delve" />;
  const action = pgAction(opt, who, gs);
  if (opt === '3') return <PgTabbed who={who} action={action} tab={page || (who === 'played' ? 'yours' : 'about')} />;
  const yours = opt === '1' ? page === 'yours' && who !== 'out' && who !== 'nopass'
    : who !== 'out' && page !== 'about';
  return yours ? <PgYours opt={opt} who={who} /> : <PgPublic opt={opt} action={action} />;
};

// ---- The strip: option + viewer, in the demo bar's place --------------------------
let pgBooted = false;
const pgApply = (gs, viewer) => {
  const v = PG_VIEWERS.find((x) => x.id === viewer) || PG_VIEWERS[0];
  gs.setDemoView(v.view);
  if (v.view !== 'out') gs.setConnected(true);
  setTimeout(() => window.gsApi.go('delve'), 0);
};
const PgStrip = () => {
  const gs = useGs(); const st = usePg();
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!pgBooted) { pgBooted = true; pgApply(gs, st.viewer); } }, []);
  const sel = PG_OPTS.find((o) => o.id === st.opt) || PG_OPTS[1];
  const vw = PG_VIEWERS.find((v) => v.id === st.viewer) || PG_VIEWERS[0];
  const pickOpt = (id) => { pgSet({ opt: id }); pgApply(gs, st.viewer); };
  const pickViewer = (id) => { pgSet({ viewer: id }); pgApply(gs, id); };
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {PG_OPTS.map((o) => <button key={o.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === o.id} aria-label={o.id + ' · ' + o.name} title={o.id + ' · ' + o.name} onClick={() => pickOpt(o.id)}>{o.id}</button>)}
            <span className="pg-name">{sel.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => pgSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Viewer</span>
            {PG_VIEWERS.map((v) => <button key={v.id} type="button" className="gs-demo-opt" aria-pressed={st.viewer === v.id} title={v.name} onClick={() => pickViewer(v.id)}>{v.short}</button>)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => pgSet({ open: true })}>Show · {sel.id} {sel.name} · {vw.short}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={sel.id + ' · ' + sel.name}>
        <div className="pg-why">
          <p>{sel.stance}</p>
          <p><b>Cost.</b> {sel.cost}</p>
          <p><b>Public page.</b> {sel.pub}</p>
          <p><b>Your Delve.</b> {sel.own}</p>
          <div className="gs-stack-sm">
            <span className="gs-label">EACH VIEWER</span>
            <ul className="gs-plain">{PG_VIEWERS.map((v) => { const who = v.id === 'share' ? 'out' : v.id; return (
              <li key={v.id} className="pg-why-row"><b>{v.short}</b>
                <span className="gs-small">Lands on {pgLandsText(sel.id, who)} · action “{pgActionText(sel.id, who)}” · own page: {pgReachText(sel.id, who)}</span></li>); })}</ul>
          </div>
          <p className="gs-small">Leaderboard values show “—”: what it ranks on isn’t decided.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsDelve = PgDelve;
window.GsDemoBar = PgStrip;
