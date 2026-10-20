// Rig "account-opens": a new account's empty Library shows, once, what the account opens. Wording and shape are open (Joe, 2026-10-15).
// Staging: Joe's free line (2026-10-14, a position not a ruling). Mounts canon's real Library, DS ListRow/Card, GsTile.
// Reads: ?o=1..4  ?weekly=off|first|weekly  ?state=new|after  ?frame=1 (the screen alone, full-bleed, for screenshots)
const { GsCtx, GS_GAMES } = window;

// ---- rig-only data patch (canon untouched). Same staging as the arrival rig. -----------------------------------------
Object.assign(GS_GAMES.escape, { tags: ['FIRST', 'Weekly', '10 min'], free: false, first: true });
window.GS_ART.drowned = { ground: 'wine', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#12303A"/><path d="M0 84Q40 72 80 84T160 84V120H0Z" fill="#328A88"/><rect x="72" y="30" width="16" height="28" fill="#E5A63B"/><rect x="76" y="22" width="8" height="8" fill="#F2EBE0"/>') };
GS_GAMES.drowned = { name: 'The Drowned Light', category: 'ADVENTURE', art: 'drowned', route: 'drowned', ed: ['chapter', 'chapters'], eds: true, first: true, blurb: 'The light on Gull Rock is dark. Carry it up from the sea.', tags: ['FIRST', '45–60 min'] };
window.GsPushAsk = null; // rig-only: canon's notification banner would sit between the note and the rows in option 4; hidden so the options compare cleanly
window.GS_LIB_READY.drowned = 'Chapter 1 is ready';
// Casebook is not an agreed game: out of every list here. Groups does not exist as a game (two dailies only).
window.GS_GAME_ORDER.length = 0; window.GS_GAME_ORDER.push('word', 'mystery', 'escape', 'delve', 'barrow', 'drowned');

// ---- what the account opens: [id, what it opens, group] -------------------------------------------------------------
// "Today’s word / Today’s case": canon GS_LIB_READY wording. "Chapter 1": Barrow freePart.tag in the deployed catalogue.
// "The first room": spec-silent for Escape (pattern of "Play the first case / scene", log 2026-10-10); deployed Escape is Pass only.
const pgRows = (weekly) => {
  const base = [['word', 'Today’s word', 'daily'], ['mystery', 'Today’s case', 'daily']];
  const tail = [['barrow', 'Chapter 1', 'part'], ['drowned', 'Chapter 1', 'part']];
  if (weekly === 'weekly') return [...base, ['escape', 'This week’s room', 'week', true], ['delve', 'This week’s scene', 'week', true], ...tail];
  if (weekly === 'first') return [...base, ['escape', 'The first room', 'part'], ['delve', 'The first scene', 'part', true], ...tail];
  return [...base, ['escape', 'The first room', 'part'], ...tail];
};

const PgVar = () => <DS.Tag kind="daily">VARIANT</DS.Tag>;
const PgPass = ({ text, link }) => {
  const gs = useGs();
  const i = text.indexOf(link);
  return <p className="gs-small">{text.slice(0, i)}<DS.TextLink onClick={() => gs.go('pass')}>{link}</DS.TextLink>{text.slice(i + link.length)}</p>;
};
const PgRow = ({ r, end = 'Play' }) => {
  const gs = useGs(); const [k, what, , v] = r;
  return <DS.ListRow lead={<GpMini art={GS_GAMES[k].art} sm />} title={GS_GAMES[k].name} meta={v ? what + ' · variant' : what} end={end} onClick={() => gs.go(GS_GAMES[k].route)} />;
};

// ---- Option 1: flat list, one card, one line each, meta says what you get ------------------------------------------
const PgO1 = ({ weekly }) => (
  <main className="gs-wrap gs-main" style={{ paddingBottom: 32 }}>
    <h1 className="gs-h1">Library</h1>
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">YOUR ACCOUNT OPENS</span>
      <DS.RowList label="Your account opens">{pgRows(weekly).map((r) => <PgRow key={r[0]} r={r} />)}</DS.RowList>
      <PgPass text="Everything else comes with the Pass." link="the Pass" />
    </DS.Card>
  </main>
);

// ---- Option 2: grouped by kind, each group names its rhythm, ends with a "Got it" ----------------------------------
const PgO2 = ({ weekly, onHide }) => {
  const rows = pgRows(weekly); const g = (n) => rows.filter((r) => r[2] === n);
  const Group = ({ label, list, v }) => list.length ? (
    <div className="gs-stack-sm" style={{ display: 'grid', gap: 8 }}>
      <span className="gs-label">{label}{v && <> <PgVar /></>}</span>
      <DS.RowList label={label}>{list.map((r) => <PgRow key={r[0]} r={r} />)}</DS.RowList>
    </div>) : null;
  return (
    <main className="gs-wrap gs-main" style={{ paddingBottom: 32 }}>
      <h1 className="gs-h1">Library</h1>
      <DS.Card style={{ gap: 20, justifyItems: 'stretch', alignContent: 'start' }}>
        <p className="gs-strong">Free with your account</p>
        <Group label="A NEW ONE EVERY DAY" list={g('daily')} />
        <Group label="A NEW ONE EVERY WEEK" list={g('week')} v />
        <Group label="THE START OF A GAME" list={g('part')} />
        <PgPass text="Every other game and chapter comes with the Pass. See the Pass" link="See the Pass" />
        <div><DS.Button variant="secondary" onClick={onHide}>Got it</DS.Button></div>
      </DS.Card>
    </main>
  );
};

// ---- Option 3: art first, two across, a caption under each tile ----------------------------------------------------
const PgO3 = ({ weekly }) => (
  <main className="gs-wrap gs-main" style={{ paddingBottom: 32 }}>
    <h1 className="gs-h1">Library</h1>
    <p>Yours to play now.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginTop: 16 }}>
      {pgRows(weekly).map((r) => (
        <div key={r[0]} style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
          <GsTile id={r[0]} />
          <span className="gs-small">{r[1]}{r[3] && <> <PgVar /></>}</span>
        </div>))}
    </div>
    <div style={{ marginTop: 24 }}><PgPass text="Everything else comes with the Pass." link="the Pass" /></div>
  </main>
);

// ---- Option 4: no new card; canon's own Library rows, with one note above them ------------------------------------
const PgO4 = ({ weekly, gone }) => {
  return (<>
    {!gone && <div className="gs-wrap" style={{ paddingTop: 16 }}>
      <DS.Card style={{ gap: 8, justifyItems: 'stretch', alignContent: 'start' }}>
        <p>These are open to you. <b>Play any, and this note goes.</b></p>
        <PgPass text="Everything else comes with the Pass." link="the Pass" />
      </DS.Card></div>}
    <GsLibrary key={weekly} />
  </>);
};

// ---- context and mount (shape from canon/app/main.jsx; copied from the arrival rig, with fresh) -----------------------
const PG_USER = { username: 'MonaLaser', first: 'Mona', last: 'Lasker', locked: false, since: null, fresh: true, email: 'you@example.com' };
const PG_REVIEW = { providerFail: false, device: 'known', passFail: false, sheet: 'completes', week: 'done', today: 'played', unfinished: false };
const pgMakeGs = ({ fresh, width, log }) => {
  const noop = (n) => (...a) => log && log(n + '(' + a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ') + ')');
  const names = 'setPush setConnected setReview setView setSub setUser setProvider setChoice keep back goHow howFromPlay startFree signOut setDemoView play playReq closePlay getPass accountMade afterCheckout signedIn paid deleteAccount'.split(' ');
  const o = { route: { name: 'library' }, view: 'free', sub: { status: 'none', plan: 'monthly', hadPass: false, pending: null, renew: null }, user: { ...PG_USER, fresh },
    provider: 'email', choice: 'yearly', connected: true, review: PG_REVIEW, playing: null, width, narrow: width < 640, push: { ...(window.GS_PUSH_DEFAULT || {}) }, go: noop('go') };
  names.forEach((n) => { o[n] = noop(n); }); return o;
};
const PgApp = ({ fresh, children, onNav }) => {
  const [width, setWidth] = React.useState(390); const ref = React.useRef(null);
  React.useEffect(() => { const el = ref.current && ref.current.querySelector('.gs-root'); if (!el || !window.ResizeObserver) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width)); ro.observe(el); return () => ro.disconnect(); }, []);
  return (<GsCtx.Provider value={pgMakeGs({ fresh, width, log: onNav })}><div ref={ref} style={{ display: 'contents' }}>
    <div className="gs-root"><GsTopBar />{children}<GsFooter /><div id="gs-announce" className="gs-vh" role="status" aria-live="polite"></div></div></div></GsCtx.Provider>);
};

const PG_OPTS = {
  1: ['Flat card', 'One card, one flat list of five, each line says what you get. Gone once you play. Least to learn; the dailies and the starts read as equals.'],
  2: ['Grouped by kind', 'Three labelled groups: new every day / new every week / the start of a game. Says why each is free. A "Got it" lets the player clear it. Taller.'],
  3: ['Art first', 'Two-across tiles with a one-line caption, the Pass line quiet at the foot. Shows the games, says less about each. Taller, less to read.'],
  4: ['In the Library', 'No new card: canon’s own Library rows (already limited to what you can open) and one note above. The note goes at first play. Least built, but its rows say only “Ready”, not what part is free.'],
};
const PgScreen = ({ o, weekly, state, hidden, onHide, onNav }) => {
  // Canon's Library lists by access; narrow it to the free line, whatever the option (rig-only data patch, set before render).
  window.GS_GAME_ORDER.length = 0; pgRows(weekly).forEach((r) => window.GS_GAME_ORDER.push(r[0]));
  const after = state === 'after';
  if (after) return <PgApp key="after" fresh={false} onNav={onNav}><GsLibrary /></PgApp>;
  if (o === 4) return <PgApp key={'o4' + weekly} fresh onNav={onNav}><PgO4 weekly={weekly} /></PgApp>;
  if (o === 2 && hidden) return <PgApp key="o2h" fresh onNav={onNav}><PgO4 weekly="off" gone /></PgApp>;
  const Body = { 1: PgO1, 2: PgO2, 3: PgO3 }[o];
  return <PgApp key={'o' + o + weekly} fresh onNav={onNav}><Body weekly={weekly} onHide={onHide} /></PgApp>;
};

const q = () => new URLSearchParams(location.search);
const PgRig = () => {
  const P = q();
  const [o, setO] = React.useState(+P.get('o') || 1); const [weekly, setWeekly] = React.useState(P.get('weekly') || 'off');
  const [state, setState] = React.useState(P.get('state') || 'new'); const [hidden, setHidden] = React.useState(P.get('hidden') === '1');
  const [log, setLog] = React.useState([]); const onNav = (x) => setLog((l) => [x, ...l].slice(0, 4));
  if (P.get('frame')) { document.body.style.margin = '0'; return <div className="kit-phone-clip" style={{ width: 390, height: 844 }}><div className="kit-phone-screen"><PgScreen o={o} weekly={weekly} state={state} hidden={hidden} onHide={() => setHidden(true)} /></div></div>; }
  const Btn = ({ on, set, children, title }) => <button className="pg-tab" aria-pressed={on} title={title} onClick={set}>{children}</button>;
  return (
    <div className="pg-shell">
      <div className="pg-bar" role="group" aria-label="Playground notes, not part of the product">
        <b>Account opens</b><span className="pg-sep" />
        {[1, 2, 3, 4].map((n) => <Btn key={n} on={o === n} set={() => { setO(n); setHidden(false); }}>{n} · {PG_OPTS[n][0]}</Btn>)}
        <span className="pg-sep" />
        <span>State</span>
        <Btn on={state === 'new'} set={() => setState('new')}>New account</Btn><Btn on={state === 'after'} set={() => setState('after')}>After first play</Btn>
        <span className="pg-sep" /><span>Weekly games (undecided)</span>
        <Btn on={weekly === 'off'} set={() => setWeekly('off')} title="Joe’s 2026-10-14 position: Escape’s first room only">Escape first room</Btn>
        <Btn on={weekly === 'first'} set={() => setWeekly('first')}>+ Delve, first edition</Btn>
        <Btn on={weekly === 'weekly'} set={() => setWeekly('weekly')}>This week’s edition free</Btn>
      </div>
      <div className="pg-row">
        <div className="pg-col">
          <div className="pg-cap"><b>{o} · {PG_OPTS[o][0]}</b><br />{PG_OPTS[o][1]}</div>
          <div className="kit-phone-clip" style={{ width: 390, height: 780, borderRadius: 24, flex: 'none', border: '1px solid #444' }}><div className="kit-phone-screen">
            <PgScreen o={o} weekly={weekly} state={state} hidden={hidden} onHide={() => setHidden(true)} onNav={onNav} /></div></div>
        </div>
        <div className="pg-col pg-notes">
          <div className="pg-cap" style={{ textAlign: 'left' }}>
            <b>Staging</b><br />Joe’s free line (2026-10-14, a position, not a ruling). New account, nothing played. Casebook left out (not an agreed game).<br />
            Deployed today: only Daily Word, Daily Mystery and Barrow chapter 1 are free; Escape and The Drowned Light are Pass only in full. Their rows here are Joe’s position, not deployed.<br />
            Weekly rows tagged VARIANT are undecided and not in the base list.
          </div>
        </div>
      </div>
      <div className="pg-log">canon callbacks (stubbed): {log.length ? log.join('  ·  ') : 'tap something'}</div>
    </div>
  );
};
const pgStyle = document.createElement('style');
pgStyle.textContent = `
  .pg-shell { min-height: 100vh; background: #1c1c1a; color: #eee; font: 13px/1.4 system-ui, sans-serif; padding-bottom: 24px; }
  .pg-bar { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 8px 12px; background: #111; border-bottom: 1px solid #333; }
  .pg-tab { background: #2a2a27; color: #ddd; border: 1px solid #444; border-radius: 6px; padding: 6px 10px; min-height: 36px; cursor: pointer; font: inherit; }
  .pg-tab[aria-pressed="true"] { background: #FF2EC4; color: #000; border-color: #FF2EC4; }
  .pg-sep { width: 1px; height: 20px; background: #444; margin: 0 4px; }
  .pg-row { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; padding: 16px; }
  .pg-col { display: grid; gap: 8px; justify-items: center; align-content: start; }
  .pg-cap { color: #bbb; max-width: 390px; text-align: center; }
  .pg-notes { max-width: 340px; }
  .pg-log { padding: 0 16px; color: #999; text-align: center; }`;
document.head.appendChild(pgStyle);
ReactDOM.createRoot(document.getElementById('root')).render(<PgRig />);
