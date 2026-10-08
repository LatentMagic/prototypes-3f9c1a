// ============================================================================
// [Platform] — a game's player page (Delve only for now), its way in from the game
// page, and the top-bar dropdown of games you've played. From delve-two-pages,
// option 2 refined as A (docs/specs/delve-two-pages/handoff-2026-10-08-route-pick.md).
// Names ("Played", "Delve record", "RECORD") are placeholders until the wording is settled.
// ============================================================================
// ---- Seed: one player's Delve, and their friends ------------------------------
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
const GP_FRIENDS = ['quietfox', 'Tamsin_R', 'bramble'];


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
const GpRecord = ({ who }) => {
  if (who !== 'played') return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Your scenes</h2>
      <p className="gs-muted">Every scene you play lands here: how it ended, every roll, and your run of weeks.</p>
    </section>
  );
  const count = (e) => GP_RECENT.filter((r) => r.ending === e).length;
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Your scenes</h2>
      <div className="gs-grid3">
        <div className="gs-stack-xs"><span className="gs-label">SCENES PLAYED</span><span className="gs-figure">4</span></div>
        <div className="gs-stack-xs"><span className="gs-label">WEEKS RUNNING</span><span className="gs-figure">3</span></div>
        <div className="gs-stack-sm"><span className="gs-label">LAST SIX WEEKS</span>
          <div className="gs-days" role="img" aria-label="Played 4 of the last 6 weeks">{GP_WEEKS.map(([d, on]) => <i key={d} title={d} className={on ? 'is-on' : ''} />)}</div>
        </div>
      </div>
      <div className="gs-stack-sm">
        <span className="gs-label">HOW YOUR SCENES ENDED</span>
        <ul className="gs-plain">{GP_ENDINGS.map((e) => { const n = count(e); return (
          <li key={e} className="pg-kv"><span className={n ? 'gs-strong' : 'gs-muted'}>{e}</span><span className={'gs-num-text ' + (n ? 'gs-strong' : 'gs-muted')}>{n ? n + (n > 1 ? ' times' : ' time') : 'Not yet'}</span></li>); })}</ul>
      </div>
    </section>
  );
};
const GpRecent = () => {
  const gs = useGs();
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Recent scenes</h2>
      <ul className="gs-hist">{GP_RECENT.map((r) => (
        <li key={r.date}><button type="button" className="gs-hrow" onClick={() => gs.go('session', { id: 'delve' })}>
          <GpMini art="delve" />
          <span className="gs-stack-xs"><span className="gs-strong">{r.ending}</span><span className="gs-small">Week of {r.date}</span></span>
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
const GpFriends = ({ who }) => {
  const gs = useGs();
  const [friends, setFriends] = React.useState(GP_FRIENDS);
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
const GpYoursBody = ({ who, single }) => {
  const a = <div className="gs-stack-md" style={{ gap: 36 }}><GpThisWeek who={who} /><GpRecord who={who} />{who === 'played' && <GpRecent />}</div>;
  const b = <div className="gs-stack-md" style={{ gap: 36 }}><GpAch who={who} /><GpFriends who={who} /></div>;
  return single ? <>{a}{b}</> : <div className="gs-pitch">{a}{b}</div>;
};


const gpToRecord = (gs) => gs.go('delve', { page: 'record' });
const GpCard = () => {
  const gs = useGs();
  return (
    <section className="pg-band" aria-label="Delve record">
      <GpMini art="delve" />
      <div className="gs-stack-xs"><span className="gs-label">RECORD</span>
        <span className="gs-small">Every scene you’ve played, the weeks you’ve kept up and what’s left to earn.</span></div>
      <div className="pg-band-link"><DS.TextLink onClick={() => gpToRecord(gs)}>See the record</DS.TextLink></div>
    </section>
  );
};
const GpPlayer = () => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main">
      <section className="rf-head">
        <span><GsCover art="delve" /></span>
        <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
          <h1 className="gs-h1">Delve record</h1>
          <DS.TextLink onClick={() => gs.go('delve')}>About Delve</DS.TextLink>
        </div>
      </section>
      <GpYoursBody who="played" />
    </main>
  );
};
const GpDelve = () => {
  const gs = useGs();
  if (gs.view !== 'out' && gs.route.page === 'record') return <GpPlayer />;
  return <GsGamePage id="delve" top={gs.view !== 'out' ? <GpCard /> : null} noCrumb />;
};

// Top-bar dropdown: the games you've played. Delve opens its player page; the rest
// open their game page until they have one.
const gpItems = (gs) => ['daily', 'delve', 'casebook'].map((k) => [k, GS_GAMES[k].name,
  k === 'delve' ? () => gpToRecord(gs) : () => gs.go(GS_GAMES[k].route)]);
const GpNav = () => {
  const gs = useGs();
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  if (gs.view === 'out') return null;
  const here = gs.route.name === 'delve' && gs.route.page === 'record';
  return (
    <div className="gs-acct" ref={wrap}>
      <button type="button" className="gs-navlink" aria-expanded={open} aria-haspopup="menu" aria-current={here ? 'page' : undefined} onClick={() => setOpen((v) => !v)}>
        Played <DS.Icon name="down" size={16} />
      </button>
      {open && (
        <div className="gs-pop pg-yours-pop" role="menu" aria-label="Played">
          {gpItems(gs).map(([k, l, fn]) => <button key={k} type="button" role="menuitem" className="gs-menu-item gs-menu-ico" onClick={() => { setOpen(false); fn(); }}><GpMini art={GS_GAMES[k].art} sm />{l}</button>)}
        </div>
      )}
    </div>
  );
};
const GpNavMenu = ({ pick }) => {
  const gs = useGs();
  if (gs.view === 'out') return null;
  return <>
    <div className="gs-menu-div" role="separator" />
    <span className="gs-label pg-menu-label">PLAYED</span>
    {gpItems(gs).map(([k, l, fn]) => <button key={k} type="button" role="menuitem" className="gs-menu-item gs-menu-ico" onClick={() => pick(fn)}><GpMini art={GS_GAMES[k].art} sm />{l}</button>)}
    <div className="gs-menu-div" role="separator" />
  </>;
};

Object.assign(window, { GsDelve: GpDelve, GsNavExtra: GpNav, GsNavExtraMenu: GpNavMenu });
