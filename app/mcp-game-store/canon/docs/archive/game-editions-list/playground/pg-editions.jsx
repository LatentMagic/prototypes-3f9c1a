// Playground: a game's list of editions, a surface of its own (third brief, 2026-10-12). Options 1 to 3; no baseline (today's app has no such list).
// Brief and handoff in docs/specs/game-editions-list/. Loads after app/gs-history.jsx, before main.jsx. app/ is unchanged.
// Every option: History has no List switch; the card's link still opens History narrowed to the game. The list has its own way in, different per option.
// Mounts the app's edList, edName, edNeedsPass, phHay, phMatch, LbChoice, LbBack, LbHead, DS.ListRow, DS.Card, DS.CardRow, DS.Disclosure, DS.Popup,
// RpPages, GsPart, GsCover, GsNeedsPass and the play dialog (gs.playReq). What an edition says about itself is SAMPLE text (PGE_INFO).
const PGE_KEY = 'pg_game_editions_v3';
let pge = { opt: '2g', long: false, open: true, ...(() => { try { return JSON.parse(localStorage.getItem(PGE_KEY)) || {}; } catch (e) { return {}; } })() };
if (!['2g'].includes(pge.opt)) pge.opt = '2g';
const pgeSubs = new Set();
const pgeSet = (p) => { pge = { ...pge, ...p }; try { localStorage.setItem(PGE_KEY, JSON.stringify(pge)); } catch (e) {} pgeSubs.forEach((f) => f(pge)); };
const usePge = () => { const [s, setS] = React.useState(pge); React.useEffect(() => { pgeSubs.add(setS); return () => pgeSubs.delete(setS); }, []); return s; };

const ED3 = ['escape', 'casebook', 'delve'];
const pgeW = (gid, n = 0) => GS_GAMES[gid].ed[n];
const pgeCap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Each option names both ways out of the library game page: the card's link (History, unchanged) and the way in to the list.
const PGE_OPTS = [
  { id: '1', name: 'A card of its own, rows open a panel',
    inWay: (gid) => 'A card on the page, “Every ' + pgeW(gid) + '”', link: (gid) => 'All your ' + pgeW(gid, 1), title: (gid) => 'Every ' + pgeW(gid),
    stance: 'The library game page gets a card of its own, “Every case”, beside “Your cases”. The card’s link becomes “All your cases” and still opens History. On the list each row says Played when you have played it; a row opens a panel with what the case is about and Play.',
    cost: 'One more card on the library game page, so a phone scrolls further. Play opens the play dialog from the panel, two steps from the row.' },
  { id: '2', name: 'A link in the page head, each edition has a page',
    inWay: (gid) => 'A link under the title, “Every ' + pgeW(gid) + '”', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'The way in sits under the game’s name, beside “About”, so it is the first thing on the page. The card’s link becomes “See in History”. Rows are bare: name and date. A row opens the edition’s own page, led by the cover, with what it is about and Play. The page says when you have played it and links to History.',
    cost: 'A link is quieter than a card and easy to pass on a phone. Two new pages per game, and the list says nothing about what each edition is.' },
  { id: '2b', name: 'As 2, a larger cover on a phone, the links stacked',
    inWay: (gid) => 'A link under the title, “Every ' + pgeW(gid) + '”, on its own line', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'Option 2 with the head laid out for a phone: the cover grows from 96 to 128px, and “About” and “Every case” sit one above the other instead of side by side. From tablet width up the head is as in option 2.',
    cost: 'The head is taller on a phone, so the cards start lower. Otherwise as option 2.' },
  { id: '2c', name: 'As 2b, on a phone the cover sits above the title',
    inWay: (gid) => 'A link under the title, “Every ' + pgeW(gid) + '”, on its own line', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'For long names. On a phone the cover (128px) sits above the title, so the title and both links get the full width and wrap less. From tablet width up the head is as in option 2.',
    cost: 'The head is the tallest of the three on a phone, so the cards start lowest. Short names leave space to the right of the cover.' },
  { id: '2d', name: 'As 2b, on a phone the links sit under the cover and title',
    inWay: (gid) => 'A link under the title, “Every ' + pgeW(gid) + '”', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'For long names. On a phone the cover (128px) sits beside the title only; the two links run in one row beneath both, at full width, and stack only if they don’t fit. From tablet width up the head is as in option 2.',
    cost: 'A long title still wraps beside the cover. The links read apart from the title they belong to.' },
  { id: '2e', name: 'As 2b, a smaller title on a phone and “About” alone',
    inWay: (gid) => 'A link under the title, “Every ' + pgeW(gid) + '”, on its own line', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'Option 2b with two levers before layout: on a phone the title takes the low end of the app’s H1 range (28px, still the largest text on the page), . From tablet width up the head is as in option 2.',
    cost: 'A very long name can still take three lines.' },
  { id: '2f', name: 'As 2e, on a phone the links sit on a card',
    inWay: (gid) => 'A link on a card under the title, “Every ' + pgeW(gid) + '”', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'Option 2e, but on a phone the two links sit together on a card under the cover and title, so they read as one block. The title has the space beside the cover to itself. From tablet width up the head is as in option 2.',
    cost: 'A card in the head looks like the cards below it, so the head reads less like a title. One more box on a phone.' },
  { id: '2g', name: 'One layout: links in a row under the title, wrapping',
    inWay: (gid) => 'A link under the title, “Every ' + pgeW(gid) + '”', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'One rule at every width and for one link or two: cover, then the title with its links in a row under it. When a row doesn’t fit, the next link wraps to the line below, so a phone usually shows them stacked and desktop side by side without a breakpoint. On a phone the cover is 128px and the title 28px, the low end of the app’s H1 range.',
    cost: 'Whether the links sit side by side depends on the name and width, so two phones can show them differently.' },
  { id: '2h', name: 'One layout: links in a row under the cover and title',
    inWay: (gid) => 'A link under the head, “Every ' + pgeW(gid) + '”', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'One rule at every width and for one link or two: the cover and title side by side, the links in a row beneath both. The title has the space beside the cover to itself, so it can be centred against it. On a phone the cover is 128px and the title 28px.',
    cost: 'The links sit apart from the title, under the cover, at every width; on desktop that leaves the cover’s column carrying text.' },
  { id: '2i', name: 'Title across the top, links stacked beside the cover',
    inWay: (gid) => 'A link beside the cover, “Every ' + pgeW(gid) + '”', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'One layout for every game and width: the title runs the full width first, then the cover with the links stacked beside it, centred on it. A long name wraps across the whole width, never beside the cover, so the cover row is the same height on every game. Links keep the full 48px height; no 32px exception.',
    cost: 'With one link (no editions) the space beside the cover holds a single link. The title sits above the cover instead of beside it.' },
  { id: '2j', name: 'Title and links first, the cover at the end',
    inWay: (gid) => 'A link under the title, “Every ' + pgeW(gid) + '”', link: () => 'See in History', title: (gid) => 'Every ' + pgeW(gid),
    stance: 'One layout for every game and width: the title with its links stacked under it, and the cover at the end of the row, top-aligned. The text never balances against the cover, so a long name just makes the text column longer and nothing looks off. Links keep the full 48px height; no 32px exception.',
    cost: 'The cover is a mark at the edge, not the lead. On a phone it is 96px wide so the title keeps room.' },
  { id: '3', name: 'The latest in a row, rows open in place',
    inWay: (gid) => 'A row of the latest ' + pgeW(gid, 1) + ', “' + pgeCap(pgeW(gid)) + ' list”', link: (gid) => 'All ' + pgeW(gid, 1), title: (gid) => pgeCap(pgeW(gid)) + ' list',
    stance: 'Under the cards, a sideways row shows the latest few editions; its last card opens the whole list. The card’s link keeps “All cases”, and the list is named “Case list” so the two can’t be mixed up. On the list a row opens in place: the line, the facts, Play, and Played if you have. A player without the Pass can show only what they can play.',
    cost: 'The row adds a band to the library game page and repeats this week’s edition. Open rows push the list down, and the row title can’t carry the date.' },
];
const pgeBase = (id) => id.charAt(0);
// The strip offers only the head options still in play (2026-10-12 tidy). The rest stay in code, out of the strip; see the handoff.
const PGE_LIVE = ['2g'];
const pgeOpt = (s) => PGE_OPTS.find((x) => x.id === (PGE_LIVE.includes(s.opt) ? s.opt : PGE_LIVE[0]));

// ---- SAMPLE: what an edition says about itself. The app holds only number, title, date (and Casebook's cast). ----
const PGE_INFO = {
  escape: {
    'The Locked Study': 'A desk drawer won’t open and the window is painted shut. Find the key.',
    'The Flooded Cellar': 'The water is at your knees and still rising. Find the way up.',
    'The Clock Tower': 'Every clock in the room shows a different time. Only one of them is right.',
    'The Night Train': 'Your compartment is locked and the next stop is hours away. Get out first.',
    'The Lighthouse': 'The lamp has gone dark and the door below is bolted. Start climbing.',
    'The Vault': 'The timer on the vault door says ten minutes. Open it from the inside.',
    'The Greenhouse': 'The glass has fogged and the vents are wired shut. Find what the plants hide.',
    'The Lift Shaft': 'The lift stopped between floors and the panel is dead. Find another way out.',
  },
  delve: {
    'Beneath Gallows Hill': 'The tunnels under the hill go deeper than the map. Take the first turn.',
    'The Drum Room': 'The drums are loudest here, and the guards know you came in. Decide fast.',
    'The Fungus Path': 'The glowing path is the only light, and something feeds on it. Keep moving.',
    'The Escape Tunnel': 'Elsie is with you and the tunnel is half flooded. Get her through.',
    'The Drifting Freighter': 'The freighter is adrift and its hold is full of noises. Go below.',
    'The Cold Hold': 'Frost covers the hold, and one of the crates is breathing. Open it.',
    'The Shrine Cavern': 'The ritual has started in the cavern ahead. Stop it before the last drum.',
    'The Miller’s Cellar': 'The miller swears his cellar is empty. Go down and see for yourself.',
  },
  casebook: [
    'Three witnesses tell the same night three different ways. Ask until one slips.',
    'A will went missing the morning after the funeral. Find out who took it.',
    'Someone moved the body before the police came. Ask who had the key.',
    'The night porter heard an argument at midnight. Find out who started it.',
    'Two of them were at the dinner. The third says she never left home.',
    'A letter arrived a day after its writer died. Ask who posted it.',
    'The ferry left on time, one passenger short. Find out who stayed behind.',
    'Everyone agrees the clock stopped at nine. Nobody agrees why.',
  ],
};
const PGE_LEN = { escape: 'About 10 min', casebook: '25–40 min', delve: '25–40 min' };
const pgeAnd = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const pgeInfo = (e) => {
  const line = e.gid === 'casebook' ? PGE_INFO.casebook[e.n % 8] : PGE_INFO[e.gid][e.title] || '';
  const cb = e.gid === 'casebook' && CB_ALL.find((x) => x.id === e.key);
  return { line, len: PGE_LEN[e.gid], who: cb && cb.cast ? 'You question ' + pgeAnd(cb.cast) + '.' : null, cast: cb && cb.cast ? cb.cast.length + ' suspects' : null };
};

// ---- One game's editions, newest first, each once. No result, no replays: those are History's. ----
// Played: a finished play. Not played, in progress and not finished carry no mark (round 2).
const pgePlayed = (e) => !!e.status && e.status.kind !== 'none' && e.status.kind !== 'live';
const pgeEds = (gs, gid) => edList(gs, gid).map((e) => ({ ...e, name: edName(e), when: lbShort(e.date), played: pgePlayed(e), live: !!e.status && e.status.kind === 'live', held: edNeedsPass(gs, e), info: pgeInfo(e),
  hay: phHay(gid, e.key, e.title, phParse(e.date)) + ' ' + edName(e).toLowerCase() }));
const pgePlayedText = (e) => (e.live ? 'You’re partway through this ' + pgeW(e.gid) + '.' : 'You’ve played this ' + pgeW(e.gid) + '.');
const pgeFacts = (e) => [e.info.len, e.info.cast].filter(Boolean);

// The list's own state, kept in the history entry (route.pgeList) so browser Back returns it as it was left.
const pgeScroll = (el) => { for (let n = el && el.parentElement; n; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight) { n.scrollTop = 0; return; } } gsScrollTop(); };
const usePgeList = (gid, opt) => {
  const gs = useGs(); const k0 = (gs.route.pgeList && gs.route.pgeList.gid === gid && gs.route.pgeList.opt === opt && gs.route.pgeList) || {};
  const [st, setSt] = React.useState({ q: k0.q || '', show: k0.show || 'all', sort: k0.sort || 'new', pg: k0.pg || 0, open: k0.open || gs.route.pgeOpen || null });
  React.useEffect(() => { gs.keep({ pgeList: { gid, opt, ...st } }); }, [st]);
  const wait = useGsPart([st.q, st.show, st.sort, st.pg]);
  const box = React.useRef(null);
  const set = (k, v) => setSt((p) => ({ ...p, [k]: v, pg: k === 'pg' ? v : k === 'open' ? p.pg : 0 }));
  const s = phNorm(st.q);
  const all = pgeEds(gs, gid);
  let items = all.filter((x) => (st.show === 'all' || (st.show === 'played' && x.played) || (st.show === 'none' && !x.played) || (st.show === 'can' && !x.held)) && phMatch(x.hay, s));
  if (st.sort === 'old') items = items.reverse();
  const size = 24; const pages = Math.max(1, Math.ceil(items.length / size));
  // An edition opened from the library game page's row (option 3) starts on its own page of the list.
  let pg = Math.min(st.pg, pages - 1);
  if (!k0.pg && st.open && st.pg === 0) { const i = items.findIndex((x) => x.key === st.open); if (i >= size) pg = Math.floor(i / size); }
  return { ...st, s, wait, box, set, pages, pg, rows: items.slice(pg * size, pg * size + size), go: (x) => { set('pg', x); pgeScroll(box.current); } };
};
const PgeEmpty = ({ f, gid }) => <p className="lb-empty gs-muted">{f.s ? (f.show === 'none' ? 'No ' + pgeW(gid) + ' you haven’t played matches that. Try a name, a number or a date.' : 'Nothing matches that. Try a name, a number or a date.') : f.show === 'none' ? 'You’ve played every ' + pgeW(gid) + '.' : 'Nothing matches that.'}</p>;
const pgeList = (gs, gid, extra) => gs.go(GS_GAMES[gid].route, { page: 'record', list: true, ...(extra || {}) });
const pgeHistory = (gs, gid, e) => gs.go('history', e ? { game: gid, q: '#' + e.n, from: gid } : { game: gid, from: gid });
const pgePlay = (gs, e) => gs.playReq({ kind: 'edition', e });
const PgePlay = ({ e, before }) => { const gs = useGs(); return <DS.Button onClick={() => { if (before) before(); pgePlay(gs, e); }}>Play</DS.Button>; };

// ---- The list page, every option: back to the game, H1, search and Filters, then the option's rows ----
const PgeListPage = ({ gid, opt }) => {
  const gs = useGs(); const g = GS_GAMES[gid]; const o = PGE_OPTS.find((x) => x.id === opt); const f = usePgeList(gid, opt);
  const fromLib = !!gs.route.fromLib;
  const title = o.title(gid); const held = gs.view !== 'pass';
  const [sheet, setSheet] = React.useState(null);
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={g.name} onClick={() => (fromLib ? gs.back() : gs.go(g.route, { page: 'record' }))} />
      <h1 className="gs-h1">{title}</h1>
      <div className="lb-alllay">
        <window.LbToolsBase>
          <DS.SearchField label="Search" placeholder="A number, name or date" value={f.q} onChange={(e) => f.set('q', e.target.value)} />
          {opt === '1' && <LbChoice label="Show" value={f.show} opts={[['all', 'Every ' + pgeW(gid)], ['played', 'Played'], ['none', 'Not played']]} onPick={(v) => f.set('show', v)} />}
          {pgeBase(opt) === '2' && <LbChoice label="Show" value={f.show} opts={[['all', 'Every ' + pgeW(gid)], ['none', 'Not played']]} onPick={(v) => f.set('show', v)} />}
          {opt === '3' && held && <LbChoice label="Show" value={f.show} opts={[['all', 'Every ' + pgeW(gid)], ['can', 'Ones you can play']]} onPick={(v) => f.set('show', v)} />}
          <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={(v) => f.set('sort', v)} />
        </window.LbToolsBase>
        <div ref={f.box} className="lb-box lb-results" style={{ maxWidth: 960, minWidth: 0 }}>
          {f.wait ? <GsPart label="Loading" /> : <>
            {!f.rows.length ? <PgeEmpty f={f} gid={gid} />
              : opt === '1' ? <DS.RowList label={title}>{f.rows.map((e) => (
                <DS.ListRow key={e.key} title={e.name} when={e.when} result={e.live ? 'In progress' : e.played ? 'Played' : undefined}
                  end={e.held ? <DS.Tag kind="locked">Pass</DS.Tag> : undefined} onClick={() => setSheet(e.key)} />
              ))}</DS.RowList>
              : pgeBase(opt) === '2' ? <DS.RowList label={title}>{f.rows.map((e) => (
                <DS.ListRow key={e.key} title={'#' + e.n + ' · ' + e.name} when={e.when} result={e.played ? 'Played' : undefined}
                  end={e.held ? <DS.Tag kind="locked">Pass</DS.Tag> : undefined} onClick={() => f.set('open', e.key)} />
              ))}</DS.RowList>
              : <div>{f.rows.map((e) => <PgeFold key={e.key + (f.open === e.key ? '-o' : '')} e={e} open={f.open === e.key} />)}</div>}
            <RpPages pg={f.pg} pages={f.pages} go={f.go} />
          </>}
        </div>
      </div>
      {opt === '1' && <PgeSheet gid={gid} k={sheet} onClose={() => setSheet(null)} />}
      {pgeBase(opt) === '2' && <PgeEdPanel gid={gid} k={f.open} onClose={() => f.set('open', null)} />}
    </main>
  );
};

// ---- Option 1: the edition in a panel; Play opens the play dialog with its prompt ----
const PgeSheet = ({ gid, k, onClose }) => {
  const gs = useGs(); const last = React.useRef(null);
  const e0 = k ? pgeEds(gs, gid).find((x) => x.key === k) : null; if (e0) last.current = e0; const e = last.current;
  if (!e) return null;
  return (
    <DS.Popup kind="panel" open={!!k} onClose={onClose} title={e.name} actions={e.held ? undefined : <PgePlay e={e} before={onClose} />}>
      <div className="pge-panel">
        <span className="gs-label">{(GS_GAMES[gid].name + ' #' + e.n + ' · ' + e.when).toUpperCase()}</span>
        <p style={{ margin: 0 }}>{e.info.line}</p>
        {e.info.who && <p className="gs-muted" style={{ margin: 0 }}>{e.info.who}</p>}
        <div className="gs-figs">{pgeFacts(e).map((x) => <span key={x} className="gs-fig gs-fig-quiet">{x}</span>)}</div>
        {e.played && <p className="gs-muted" style={{ margin: 0 }}>{pgePlayedText(e)}</p>}
        {e.held && <GsNeedsPass gid={gid} />}
      </div>
    </DS.Popup>
  );
};

// ---- Option 2 family (round 3, 2026-10-12): the edition opens in a panel over the list, its prompt inside it. No page per edition. ----
// The open edition is the list's own state (f.open), kept in the history entry, so Back from "See in History" returns with it open.
const PgeEdPanel = ({ gid, k, onClose }) => {
  const gs = useGs(); const g = GS_GAMES[gid]; const last = React.useRef(null);
  const e0 = k ? pgeEds(gs, gid).find((x) => x.key === k) : null; if (e0) last.current = e0; const e = last.current;
  if (!e) return null;
  const text = gsPromptText({ kind: 'edition', e });
  return (
    <DS.Popup kind="panel" open={!!e0} onClose={onClose} title={e.title} actions={e.held ? undefined : <GsCopyPrompt text={text} block />}>
      <div className="pge-panel">
        <span className="gs-label">{(g.name + ' #' + e.n + ' · week of ' + e.date).toUpperCase()}</span>
        <p style={{ margin: 0 }}>{e.info.line}</p>
        {pgeFacts(e).length > 0 && <div className="gs-figs">{pgeFacts(e).map((x) => <span key={x} className="gs-fig gs-fig-quiet">{x}</span>)}</div>}
        {e.info.who && <p className="gs-muted" style={{ margin: 0 }}>{e.info.who}</p>}
        {e.played && <div className="gs-stack-xs" style={{ justifyItems: 'start' }}><p className="gs-muted" style={{ margin: 0 }}>{pgePlayedText(e)}</p><DS.TextLink onClick={() => pgeHistory(gs, gid, e)}>See in History</DS.TextLink></div>}
        {e.held ? <GsNeedsPass gid={gid} /> : (
          <div className="gs-stack-sm">
            <p className="hw-need gs-small" style={{ margin: 0 }}><b>Connect your AI first.</b> <GsHowLink label="How to connect" /></p>
            <GsPrompt text={text} />
          </div>
        )}
      </div>
    </DS.Popup>
  );
};

// ---- Option 3: a row that opens in place ----
const PgeFold = ({ e, open }) => (
  <div className="pge-fold">
    <DS.Disclosure title={e.name} defaultOpen={open}>
      <div className="pge-panel" style={{ paddingBottom: 16 }}>
        <span className="gs-label">{('#' + e.n + ' · week of ' + e.date).toUpperCase()}</span>
        <p style={{ margin: 0, color: 'var(--text)' }}>{e.info.line}</p>
        <div className="gs-figs">{pgeFacts(e).map((x) => <span key={x} className="gs-fig gs-fig-quiet">{x}</span>)}{e.held && <DS.Tag kind="locked">Pass</DS.Tag>}</div>
        {e.played && <p style={{ margin: 0 }}>{pgePlayedText(e)}</p>}
        {e.held ? <GsNeedsPass gid={e.gid} /> : <div className="gs-act"><PgePlay e={e} /></div>}
      </div>
    </DS.Disclosure>
  </div>
);
// Option 3's way in: the latest few editions as cards, the last card opening the list.
const PgeLatest = ({ gid }) => {
  const gs = useGs(); const eds = pgeEds(gs, gid).slice(0, 5); const t = pgeCap(pgeW(gid)) + ' list';
  return (
    <section data-pge-in="" style={{ gridColumn: '1 / -1', minWidth: 0 }}>
      <DS.CardRow title={t}>
        {eds.map((e) => (
          <DS.Card key={e.key} onClick={() => pgeList(gs, gid, { pgeOpen: e.key, fromLib: true })} label={e.name}>
            <div className="gs-stack-xs">
              <span className="gs-label">{('#' + e.n + ' · ' + e.when).toUpperCase()}</span>
              <h3 className="mcp-t-card" style={{ margin: 0 }}>{e.title}</h3>
              {e.held && <div><DS.Tag kind="locked">Pass</DS.Tag></div>}
            </div>
          </DS.Card>
        ))}
        <DS.Card onClick={() => pgeList(gs, gid, { fromLib: true })} label={'See the whole ' + t.toLowerCase()}>
          <div className="gs-stack-xs"><span className="gs-label">{('Every ' + pgeW(gid)).toUpperCase()}</span><h3 className="mcp-t-card" style={{ margin: 0 }}>See the whole list</h3></div>
        </DS.Card>
      </DS.CardRow>
    </section>
  );
};
// Option 1's way in: a card beside the plays card.
const PgeEveryCard = ({ gid }) => {
  const gs = useGs();
  return (
    <div data-pge-in="" style={{ display: 'grid', minWidth: 0 }}>
      <DS.Card onClick={() => pgeList(gs, gid, { fromLib: true })} title={'Every ' + pgeW(gid)}>
        <p className="gs-muted" style={{ margin: 0 }}>{'Find any ' + pgeW(gid) + ' by its number, name or date, and play it.'}</p>
      </DS.Card>
    </div>
  );
};

// ---- History without its List switch, every option ----
window.LbToolsBase = window.LbTools;
window.LbTools = ({ children, ...rest }) => <window.LbToolsBase {...rest}>{React.Children.toArray(children).filter((c) => !(React.isValidElement(c) && c.props && c.props.label === 'List'))}</window.LbToolsBase>;

// ---- The library game page: the plays card keeps its History link (renamed per option); the way in is added beside it ----
const PgeRecent0 = window.LbRecent;
window.LbRecent = (p) => {
  const gs = useGs(); const s = usePge(); const gid = gsGameOfRoute(gs.route.name);
  if (!gid || !ED3.includes(gid) || gs.view === 'out') return <PgeRecent0 {...p} />;
  const o = pgeOpt(s);
  return (<>
    <PgeRecent0 {...p} allLabel={o.link(gid)} />
    {s.opt === '1' && <PgeEveryCard gid={gid} />}
    {s.opt === '3' && <PgeLatest gid={gid} />}
  </>);
};
// The head is the app's LbHead (design system Cover fill, 2026-10-12). The rig adds the way in and the long-name test.
const PgeHead0 = window.LbHead;
window.LbHead = ({ id }) => {
  const gs = useGs(); const s = usePge(); const eds = ED3.includes(id);
  const name = s.long && id === 'casebook' ? 'Casebook of the Long Winter Nights' : undefined;
  if (gs.view === 'out') return <PgeHead0 id={id} />;
  return <PgeHead0 id={id} name={name} more={eds ? <DS.TextLink onClick={() => pgeList(gs, id, { fromLib: true })}>{'Every ' + pgeW(id)}</DS.TextLink> : null} />;
};
// The list sits inside the game's library route, as a case page does.
ED3.forEach((id) => {
  const L0 = window.GS_LIBRARY[id];
  window.GS_LIBRARY[id] = () => { const gs = useGs(); const s = usePge(); const r = gs.route;
    if (r.list && !r.sid) return <PgeListPage key={id + s.opt + (r.pgeOpen || '')} gid={id} opt={s.opt} />;
    return <L0 />; };
});

// ---- The strip: options, where to go, and the way in. Sits above the app's demo bar. ----
let pgeBooted = false;
const PgeDemo0 = window.GsDemoBar;
const pgeRing = (sel) => {
  let n = 0; const t = setInterval(() => {
    const el = document.querySelector(sel); n += 1;
    if (!el && n < 20) return; clearInterval(t); if (!el) return;
    let sc = el.parentElement; while (sc && !(['auto', 'scroll'].includes(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight)) sc = sc.parentElement;
    const r = el.getBoundingClientRect();
    if (sc) sc.scrollTop += r.top - sc.getBoundingClientRect().top - 160; else window.scrollBy(0, r.top - 160);
    el.style.outline = '2px solid var(--off-white)'; el.style.outlineOffset = '4px'; setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 2400);
  }, 100);
};
const PgeStrip = () => {
  const gs = useGs(); const s = usePge(); const o = pgeOpt(s);
  const [why, setWhy] = React.useState(false);
  const bar = React.useRef(null); const [low, setLow] = React.useState(44); const [h, setH] = React.useState(88);
  React.useEffect(() => { if (!pgeBooted) { pgeBooted = true; gs.setView('pass'); gs.setConnected(true); setTimeout(() => window.gsApi.go('casebook', { page: 'record' }), 250); } }, []);
  React.useLayoutEffect(() => {
    const el = bar.current; if (!el) return undefined;
    const root = el.closest('.gs-root'); const demo = root && root.querySelector('.gs-demo:not(.pg-strip)');
    const m = () => { setLow(demo ? demo.offsetHeight : 0); setH(el.offsetHeight); };
    m(); const ro = new ResizeObserver(m); ro.observe(el); if (demo) ro.observe(demo); return () => ro.disconnect();
  }, [s.open]);
  const view = (v) => { gs.setDemoView(v); gs.setConnected(v !== 'out'); };
  const here = GS_GAME_ORDER.find((k) => GS_GAMES[k].route === gs.route.name);
  const game = ED3.includes(here) ? here : 'casebook';
  const find = () => { gs.go(GS_GAMES[game].route, { page: 'record' }); pgeRing('[data-pge-in]'); };
  return (<>
    <PgeDemo0 />
    <div aria-hidden="true" style={{ flex: 'none', height: h }} />
    <div ref={bar} className="gs-demo pg-strip" style={{ bottom: low }} role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {PGE_OPTS.filter((x) => PGE_LIVE.includes(x.id)).map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => pgeSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => pgeSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{gs.view === 'out'
            ? <button type="button" className="gs-demo-opt" onClick={() => view('pass')}>Sign in with the Pass</button>
            : <>{[...ED3, 'hunter'].map((k, i) => <React.Fragment key={k}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={here === k && gs.route.page === 'record' && !gs.route.list} onClick={() => gs.go(GS_GAMES[k].route, { page: 'record' })}>{GS_GAMES[k].name}</button></React.Fragment>)}
              <span aria-hidden="true">/</span><button type="button" className="gs-demo-opt" aria-pressed={!!s.long} onClick={() => { pgeSet({ long: !s.long }); gs.go('casebook', { page: 'record' }); }}>Casebook, long name (test)</button>
              <span aria-hidden="true">/</span><button type="button" className="gs-demo-opt" onClick={find}>Find the way in</button></>}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => pgeSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.stance}</p>
          <p className="gs-muted">{'Cost: ' + o.cost}</p>
          <p className="gs-muted">{'On Casebook: the way in is ' + o.inWay('casebook') + '. The card’s link to History reads “' + o.link('casebook') + '”.'}</p>
        </div>
      </DS.Popup>
    </div>
  </>);
};

Object.assign(window, { GsDemoBar: PgeStrip });
