// Playground: routes between a game's two pages, Delve only. Overrides window.GsDelve
// (the route), window.GsDemoBar (the strip), window.GsPlayPopup (no demo link) and fills
// the top bar's two slots (GsNavExtra, GsNavExtraMenu). Pieces copied from app/ are
// marked; they are copies, not improvements.
const PG_KEY = 'pg_delve_routes_v1';
const pgLoad = () => { try { return JSON.parse(localStorage.getItem(PG_KEY)) || {}; } catch (e) { return {}; } };
let pgState = { opt: '1', viewer: 'played', open: true, ...pgLoad() };
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

// Bounds held for this playground: no age, no "Solo", no AI-essential fact.
Object.values(GS_GAMES).forEach((g) => { g.tags = g.tags.filter((t) => t !== 'Solo' && !/^\d+\+$/.test(t)); });
GS_SOON.forEach((s) => { s.line = s.line.replace(/ · \d+\+$/, ''); });

const PG_VIEWERS = [
  { id: 'out', short: 'Signed out', name: 'Signed out' },
  { id: 'new', short: 'Never played', name: 'Signed in, never played Delve' },
  { id: 'played', short: 'Has played', name: 'Signed in, has played Delve' },
];

const PG_OPTS = [
  { id: '1', name: 'Tabs',
    stance: 'One page, two tabs. Signed in, a tab row under the header puts Your Delve beside About. Each tab has its own address.',
    cost: 'The cover and the play box sit above both tabs, so on a phone Your Delve starts a screen down. Signed out, nothing hints there is anything of yours.',
    to: 'The Your Delve tab, under the header', back: 'The About tab' },
  { id: '2', name: 'Separate page, top bar and strip',
    stance: 'Two pages. Yours in the top bar lists the games you’ve played, from any page. On the public page a strip links across to Your Delve, which links back.',
    cost: 'Two ways in to keep in step, and the strip is one more band above the cover on every visit.',
    to: 'The strip above the cover', back: '“About Delve” under the title', bar: 'Yours in the top bar (inside Menu on a phone)' },
  { id: '3', name: 'Panel over the public page',
    stance: 'Your Delve opens over the public page as a panel: a sheet on a phone, a window on desktop. Closing it is the way back. It still has its own address.',
    cost: 'Your record lives in an overlay, so it scrolls inside itself and can’t grow into a full page. The public page is the only page there is.',
    to: 'The Your Delve button beside the breadcrumb', back: 'Close, Escape or the dim' },
  { id: '4', name: 'Played, you land on yours',
    stance: 'Once you’ve played, every link to Delve opens Your Delve. The public page sits behind “About Delve”, and a link under the main button goes the other way.',
    cost: 'A player who wants the public page always takes one more step, and it needs a second address. Before you’ve played, links still land on the public page.',
    to: '“Your Delve” under the main button', back: '“About Delve” under the title' },
];

// ---- Seed: one player's Delve, and their friends ------------------------------
const PG_RECENT = [
  { date: '5 October', ending: 'Close call' },
  { date: '28 September', ending: 'Alone' },
  { date: '21 September', ending: 'Close call' },
  { date: '7 September', ending: 'Caught' },
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

// ---- Who is looking, where they are, what the one button says -------------------
const pgWho = (gs, st) => (gs.view === 'out' ? 'out' : st.viewer === 'new' ? 'new' : 'played');
const pgOnYours = (opt, who, page) => {
  if (who === 'out') return false;
  if (opt === '4') return page === 'yours' || (page == null && who === 'played');
  return page === 'yours';
};
const pgAddress = (opt, who, route) => {
  if (route.name !== 'delve') return null;
  if (pgOnYours(opt, who, route.page)) return '/games/delve/yours';
  return opt === '4' && who === 'played' ? '/games/delve/about' : '/games/delve';
};
// The main button: app-store style, always starts play. Signed out keeps what the rig showed before.
const pgMain = (who, gs) => (who === 'out'
  ? { label: 'Start free month', fn: gs.getPass, note: true }
  : { label: who === 'played' ? 'Open' : 'Get', fn: () => gs.play('Delve', 'delve') });
const pgPlayed = (who) => [...(who === 'played' ? ['delve'] : []), 'daily', 'casebook'];

// ---- Shared bits ---------------------------------------------------------------
const PgMini = ({ art, sm }) => <span className={'pg-mini' + (sm ? ' is-sm' : '')} aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART[art] }} />;
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
// Copy of GsPlayBox (app/gs-game.jsx) with the button passed in, and a slot under it.
const PgBox = ({ main, under }) => {
  const b = GS_PAGES.delve.box;
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">{b.label}</span>
      <h2 className="mcp-t-card">{b.heading}</h2>
      <GsSteps items={b.steps} />
      <DS.Button block onClick={main.fn}>{main.label}</DS.Button>
      {main.note && <p className="gs-small">{b.small} {GS.purchase}</p>}
      {under}
      <div className="gs-rule" />
      <div className="gs-stack-sm"><span className="gs-label">WORKS WITH</span><p className="gs-small">{GS.works}</p></div>
    </DS.Card>
  );
};
// Copy of GsFacts, less AI-essential, Age and Players.
const PgFacts = () => {
  const p = GS_PAGES.delve;
  const L = [['long', 'How long'], ['often', 'How often']];
  return (
    <section className="gs-stack-md" aria-label="Facts">
      <dl className="gs-facts">{L.map(([k, l]) => <div key={k} className="gs-fact"><dt className="gs-label">{l.toUpperCase()}</dt><dd>{gsOr(p.facts[k])}</dd></div>)}</dl>
      <div className="gs-tags">{p.tags.map((t) => <DS.Tag key={t} kind="daily">{t}</DS.Tag>)}</div>
    </section>
  );
};
const PgAbout = () => {
  const p = GS_PAGES.delve;
  return <>
    <PgFacts />
    <section className="gs-pitch">
      <div className="gs-stack-md gs-measure"><h2 className="mcp-t-sec">{p.pitch.h}</h2>{p.pitch.ps.map((t, i) => <p key={i}>{t}</p>)}</div>
      <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
        <span className="gs-label">WHO DOES WHAT</span><GsWhoCols ai={p.who.ai} server={p.who.server} />
      </DS.Card>
    </section>
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">How it looks in your chat</h2>
      <div className="gs-chats">{p.shots.map((c, i) => <GsShot key={i} id="dailyWord" caption={c} />)}</div>
    </section>
    <section className="gs-grid3">
      <GsStat label="IN A SCENE" figure="6–7 locations" line="Sinkhole to ritual chamber, shuffled each run." />
      <GsStat label="TYPICAL RUN" figure="10–14 rolls" line="Every one listed on your session page afterwards." />
      <GsStat label="ENDINGS" figure="4 ways out" line="Clean rescue, close call, alone, or caught." />
    </section>
    <PgMore />
  </>;
};
const PgMore = () => {
  const gs = useGs(); const marks = gsMarks(gs.view === 'out' ? 'out' : 'pass');
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">More games</h2>
      <div className="gs-grid3">{GS_GAME_ORDER.filter((k) => k !== 'delve').map((k) => <GsGameCard key={k} id={k} mark={marks[k]} />)}</div>
    </section>
  );
};

// ---- Your Delve parts -----------------------------------------------------------
const PgThisWeek = ({ who }) => {
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
const PgRecord = ({ who }) => {
  if (who !== 'played') return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Your scenes</h2>
      <p className="gs-muted">Every scene you play lands here: how it ended, every roll, and your run of weeks.</p>
    </section>
  );
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
          <PgMini art="delve" />
          <span className="gs-stack-xs"><span className="gs-strong">{r.ending}</span><span className="gs-small">Week of {r.date}</span></span>
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
const PgYoursBody = ({ who, single }) => {
  const a = <div className="gs-stack-md" style={{ gap: 36 }}><PgThisWeek who={who} /><PgRecord who={who} />{who === 'played' && <PgRecent />}</div>;
  const b = <div className="gs-stack-md" style={{ gap: 36 }}><PgAch who={who} /><PgFriends who={who} /></div>;
  return single ? <>{a}{b}</> : <div className="gs-pitch">{a}{b}</div>;
};

// ---- The public page (all four options) -----------------------------------------
const PgBand = ({ who }) => {
  const gs = useGs();
  return (
    <section className="pg-band" aria-label="Your Delve" data-pg-route="to">
      <PgMini art="delve" />
      <div className="gs-stack-xs"><span className="gs-label">YOUR DELVE</span>
        <span className="gs-small">{who === 'played' ? 'This week: Close call. Three weeks running.' : 'See what you can earn and where your friends stand.'}</span></div>
      <div className="pg-band-link"><DS.TextLink onClick={() => gs.go('delve', { page: 'yours' })}>Go to Your Delve</DS.TextLink></div>
    </section>
  );
};
const PgPanel = ({ who, open }) => {
  const gs = useGs();
  const close = () => gs.go('delve', { page: 'about' });
  return (
    <div className="pg-panel">
      <DS.Popup open={open} onClose={close} posture={gs.narrow ? 'sheet' : 'window'} title="Your Delve">
        <div className="pg-panel-body">{open && <PgYoursBody who={who} single />}</div>
        <span data-pg-route="back" style={{ display: 'grid' }}><DS.Button variant="secondary" block onClick={close}>Close</DS.Button></span>
      </DS.Popup>
    </div>
  );
};
const PgPublic = ({ opt, who, main, tab }) => {
  const gs = useGs();
  const inn = who !== 'out';
  const toYours = () => gs.go('delve', { page: 'yours' });
  const under = opt === '4' && inn
    ? <div data-pg-route="to"><DS.TextLink onClick={toYours}>Your Delve</DS.TextLink></div> : null;
  return (
    <main className="gs-wrap gs-main">
      {opt === '3' && inn
        ? <div className="pg-crumbrow"><PgCrumb /><span data-pg-route="to" style={{ display: 'inline-flex' }}><DS.Button variant="secondary" onClick={toYours}>Your Delve</DS.Button></span></div>
        : <PgCrumb />}
      {opt === '2' && inn && <PgBand who={who} />}
      <section className="gs-head-split">
        <div className="gs-hero-cover">
          <GsCover art="delve" />
          <div className="gs-cover-over"><span className="gs-label">{GS_PAGES.delve.label}</span><h1 className="gs-cover-title">Delve</h1></div>
        </div>
        <PgBox main={main} under={under} />
      </section>
      {opt === '1' && inn && (
        <div className="pg-tabs" role="tablist" aria-label="Delve">
          {[['about', 'About', 'back'], ['yours', 'Your Delve', 'to']].map(([id, l, r]) => (
            <button key={id} type="button" role="tab" data-pg-route={r} aria-selected={tab === id} aria-current={tab === id ? 'page' : undefined}
              className="gs-navlink" onClick={() => gs.go('delve', { page: id })}>{l}</button>))}
        </div>
      )}
      {opt === '1' && tab === 'yours' ? <PgYoursBody who={who} /> : <PgAbout />}
      {opt === '3' && inn && <PgPanel who={who} open={gs.route.page === 'yours'} />}
    </main>
  );
};

// ---- Your Delve as its own page (options 2 and 4) --------------------------------
const PgYours = ({ who, main }) => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main">
      <PgCrumb last="Your Delve" />
      <section className="pg-yhead">
        <span className="pg-yhead-cover"><GsCover art="delve" /></span>
        <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
          <h1 className="gs-h1">Your Delve</h1>
          <span data-pg-route="back"><DS.TextLink onClick={() => gs.go('delve', { page: 'about' })}>About Delve</DS.TextLink></span>
        </div>
        <div className="pg-yhead-act"><DS.Button onClick={main.fn}>{main.label}</DS.Button></div>
      </section>
      <PgYoursBody who={who} />
    </main>
  );
};

const PgDelve = () => {
  const gs = useGs(); const st = usePg();
  const opt = st.opt; const who = pgWho(gs, st); const page = gs.route.page;
  const main = pgMain(who, gs);
  if (opt === '1' || opt === '3') return <PgPublic opt={opt} who={who} main={main} tab={pgOnYours(opt, who, page) ? 'yours' : 'about'} />;
  return pgOnYours(opt, who, page) ? <PgYours who={who} main={main} /> : <PgPublic opt={opt} who={who} main={main} />;
};

// ---- Option 2's Yours, in the top bar's slots -------------------------------------
const pgYoursItems = (gs, who) => pgPlayed(who).map((k) => [k, GS_GAMES[k].name,
  k === 'delve' ? () => gs.go('delve', { page: 'yours' }) : () => gs.go(GS_GAMES[k].route)]);
const PgNavYours = () => {
  const gs = useGs(); const st = usePg();
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  if (st.opt !== '2' || gs.view === 'out') return null;
  const who = pgWho(gs, st);
  const here = gs.route.name === 'delve' && gs.route.page === 'yours';
  return (
    <div className="gs-acct" ref={wrap} data-pg-route="bar">
      <button type="button" className="gs-navlink" aria-expanded={open} aria-haspopup="menu" aria-current={here ? 'page' : undefined} onClick={() => setOpen((o) => !o)}>
        Yours <DS.Icon name="down" size={16} />
      </button>
      {open && (
        <div className="gs-pop pg-yours-pop" role="menu" aria-label="Yours">
          {pgYoursItems(gs, who).map(([k, l, fn]) => (
            <button key={k} type="button" role="menuitem" className="gs-menu-item gs-menu-ico" onClick={() => { setOpen(false); fn(); }}><PgMini art={GS_GAMES[k].art} sm />{l}</button>))}
        </div>
      )}
    </div>
  );
};
const PgNavYoursMenu = ({ pick }) => {
  const gs = useGs(); const st = usePg();
  if (st.opt !== '2' || gs.view === 'out') return null;
  return <>
    <div className="gs-menu-div" role="separator" />
    <span className="gs-label pg-menu-label">YOURS</span>
    {pgYoursItems(gs, pgWho(gs, st)).map(([k, l, fn]) => (
      <button key={k} type="button" role="menuitem" className="gs-menu-item gs-menu-ico" onClick={() => pick(fn)}><PgMini art={GS_GAMES[k].art} sm />{l}</button>))}
  </>;
};

// Copy of GsPlayPopup without the demo-session link.
const PgPlayPopup = () => {
  const gs = useGs();
  const last = React.useRef(null);
  if (gs.playing) last.current = gs.playing;
  const p = last.current;
  return (
    <DS.Popup open={!!gs.playing} onClose={gs.closePlay} posture={gs.narrow ? 'sheet' : 'window'}
      title={p ? 'Tell your AI: let’s play ' + p.name + '.' : ''} label="Play in your AI">
      <DS.Button variant="secondary" block onClick={gs.closePlay}>Close</DS.Button>
    </DS.Popup>
  );
};

// ---- Routes: ring the control the reviewer would press ------------------------------
const pgVisible = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
const pgFind = (sels) => { for (const s of sels) { const el = [...document.querySelectorAll(s)].find(pgVisible); if (el) return el; } return null; };
const pgRing = (sels) => {
  const el = pgFind(sels);
  if (!el) return;
  if (!el.closest('.mcp-pop') && !el.closest('.gs-top')) {
    const sc = document.querySelector('.kit-phone-screen');
    if (sc) sc.scrollTo({ top: el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 96 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96 });
  }
  el.classList.add('pg-ring');
  setTimeout(() => el.classList.remove('pg-ring'), 2400);
};
const PG_MENU_BTN = '.gs-top .gs-narrow-only .mcp-btn';
const pgRoutes = (o, who) => {
  if (who === 'out') return [{ n: 'Sign in', t: 'Sign in from the top bar. You come back to this page, signed in.', page: 'about', sels: ['.gs-top .gs-wide-only .gs-navlink', PG_MENU_BTN] }];
  const r = [
    { n: 'To Your Delve', t: o.to, page: 'about', sels: ['[data-pg-route="to"]'] },
    { n: 'Back', t: o.back, page: 'yours', sels: ['[data-pg-route="back"]'] },
  ];
  if (o.bar) r.push({ n: 'From any page', t: o.bar, page: 'about', sels: ['[data-pg-route="bar"]', PG_MENU_BTN] });
  return r;
};

// ---- The strip: option, viewer, address -------------------------------------------
let pgBooted = false;
const pgApply = (gs, viewer) => {
  gs.setDemoView(viewer === 'out' ? 'out' : 'pass');
  if (viewer !== 'out') gs.setConnected(true);
  setTimeout(() => window.gsApi.go('delve'), 0);
};
const PgStrip = () => {
  const gs = useGs(); const st = usePg();
  const [why, setWhy] = React.useState(false);
  const prevView = React.useRef(gs.view);
  const lastGame = React.useRef(null);
  React.useEffect(() => { if (!pgBooted) { pgBooted = true; pgApply(gs, st.viewer); } }, []);
  // Signing in from the game page returns there, signed in.
  React.useEffect(() => {
    if (gs.route.name === 'delve') lastGame.current = gs.route;
    if (prevView.current === 'out' && gs.view !== 'out' && gs.route.name === 'games' && lastGame.current) {
      const back = lastGame.current; lastGame.current = null;
      gs.setView('pass'); pgSet({ viewer: 'played' });
      setTimeout(() => window.gsApi.go('delve', { page: back.page || 'about' }), 0);
    }
    prevView.current = gs.view;
  }, [gs.view, gs.route]);
  const sel = PG_OPTS.find((o) => o.id === st.opt) || PG_OPTS[0];
  const vw = PG_VIEWERS.find((v) => v.id === st.viewer) || PG_VIEWERS[0];
  const who = pgWho(gs, st);
  const addr = pgAddress(sel.id, who, gs.route);
  const pickOpt = (id) => { pgSet({ opt: id }); pgApply(gs, st.viewer); };
  const pickViewer = (id) => { pgSet({ viewer: id }); pgApply(gs, id); };
  const show = (r) => { setWhy(false); gs.go('delve', { page: r.page }); setTimeout(() => pgRing(r.sels), 420); };
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
          <div className="pg-strip-row is-addr">
            <span className="pg-k">Address</span>
            <span className="pg-addr">{addr || '—'}</span>
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => pgSet({ open: true })}>Show · {sel.id} {sel.name} · {vw.short}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={sel.id + ' · ' + sel.name}>
        <div className="pg-why">
          <p>{sel.stance}</p>
          <p><b>Cost.</b> {sel.cost}</p>
          <div className="gs-stack-sm">
            <span className="gs-label">ROUTES · {vw.name.toUpperCase()}</span>
            <ol className="gs-plain">{pgRoutes(sel, who).map((r, i) => (
              <li key={r.n} className="pg-why-route">
                <span className="gs-stack-xs"><b>{i + 1} · {r.n}</b><span className="gs-small">{r.t}</span></span>
                <DS.TextLink onClick={() => show(r)}>Show</DS.TextLink>
              </li>))}</ol>
          </div>
          <p className="gs-small">Signed in means holding the Pass here. {sel.id === '2' ? 'Only Delve has a player’s page in this rig; the other games under Yours open their game page. ' : ''}Leaderboard values show “—”.</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsDelve = PgDelve;
window.GsDemoBar = PgStrip;
window.GsPlayPopup = PgPlayPopup;
window.GsNavExtra = PgNavYours;
window.GsNavExtraMenu = PgNavYoursMenu;
