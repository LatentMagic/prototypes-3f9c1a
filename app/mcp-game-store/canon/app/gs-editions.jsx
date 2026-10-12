// ============================================================================
// [Platform] — a game's editions (game-editions-list option 2, head 2g; docs/specs/game-editions-list/).
// Escape, Casebook and Delve: "Every room / case / scene" under the library game page's title opens the list
// (route { page: 'record', list: true }); each row opens the edition's own page ({ ..., pgeEd }).
// The list is settled (owner, 2026-10-12). The edition page is moved over as built and is still undecided.
// What an edition says about itself is SAMPLE text (PGE_INFO). Loads after gs-history.jsx, before main.jsx.
// ============================================================================
const ED3 = ['escape', 'casebook', 'delve'];
const pgeW = (gid, n = 0) => GS_GAMES[gid].ed[n];
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
const usePgeList = (gid) => {
  const gs = useGs(); const k0 = (gs.route.pgeList && gs.route.pgeList.gid === gid && gs.route.pgeList) || {};
  const [st, setSt] = React.useState({ q: k0.q || '', show: k0.show || 'all', sort: k0.sort || 'new', pg: k0.pg || 0, open: k0.open || gs.route.pgeOpen || null });
  React.useEffect(() => { gs.keep({ pgeList: { gid, ...st } }); }, [st]);
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

// ---- The list: back to the game, H1, search and Filters (Show, Order), then one row per edition ----
const PgeListPage = ({ gid }) => {
  const gs = useGs(); const g = GS_GAMES[gid]; const f = usePgeList(gid);
  const fromLib = !!gs.route.fromLib; const title = 'Every ' + pgeW(gid);
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={g.name} onClick={() => (fromLib ? gs.back() : gs.go(g.route, { page: 'record' }))} />
      <h1 className="gs-h1">{title}</h1>
      <div className="lb-alllay">
        <window.LbTools>
          <DS.SearchField label="Search" placeholder="A number, name or date" value={f.q} onChange={(e) => f.set('q', e.target.value)} />
          <LbChoice label="Show" value={f.show} opts={[['all', 'Every ' + pgeW(gid)], ['none', 'Not played']]} onPick={(v) => f.set('show', v)} />
          <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={(v) => f.set('sort', v)} />
        </window.LbTools>
        <div ref={f.box} className="lb-box lb-results ed-results" style={{ maxWidth: 960, minWidth: 0 }}>
          {f.wait ? <GsPart label="Loading" /> : <>
            {!f.rows.length ? <PgeEmpty f={f} gid={gid} /> : <DS.RowList label={title}>{f.rows.map((e) => (
              <DS.ListRow key={e.key} title={'#' + e.n + ' · ' + e.name} when={e.when} result={e.played ? 'Played' : undefined}
                end={e.held ? <DS.Tag kind="locked">Pass</DS.Tag> : undefined} onClick={() => pgeList(gs, gid, { pgeEd: e.key, fromList: true })} />
            ))}</DS.RowList>}
            <RpPages pg={f.pg} pages={f.pages} go={f.go} />
          </>}
        </div>
      </div>
    </main>
  );
};

// ---- Option 2: the edition's own page (route { page: 'record', list: true, pgeEd }) ----
const PgeEdPage = ({ gid }) => {
  const gs = useGs(); const g = GS_GAMES[gid]; const e = pgeEds(gs, gid).find((x) => x.key === gs.route.pgeEd);
  if (!e) return <GsNotFound />;
  const fromList = !!gs.route.fromList;
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={'Every ' + pgeW(gid)} onClick={() => (fromList ? gs.back() : pgeList(gs, gid))} />
      <section className="gs-sess-head">
        <GsCover art={g.art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <span className="gs-label">{(g.name + ' #' + e.n + ' · week of ' + e.date).toUpperCase()}</span>
          <h1 className="gs-h1">{e.title}</h1>
          <p style={{ margin: 0, maxWidth: 560 }}>{e.info.line}</p>
          <div className="gs-figs">{pgeFacts(e).map((x) => <span key={x} className="gs-fig gs-fig-quiet">{x}</span>)}</div>
          {e.held ? <GsNeedsPass gid={gid} /> : <div className="gs-act"><PgePlay e={e} /></div>}
        </div>
      </section>
      {(e.info.who || e.played) && (
        <section className="gs-stack-sm" style={{ justifyItems: 'start', maxWidth: 640 }}>
          {e.info.who && <p className="gs-muted">{e.info.who}</p>}
          {e.played && <><p className="gs-muted">{pgePlayedText(e)}</p><DS.TextLink onClick={() => pgeHistory(gs, gid, e)}>See in History</DS.TextLink></>}
        </section>
      )}
    </main>
  );
};

// The list and the edition page sit inside the game's library route, as a case page does.
ED3.forEach((id) => {
  const L0 = window.GS_LIBRARY[id];
  window.GS_LIBRARY[id] = () => { const gs = useGs(); const r = gs.route;
    if (r.list && !r.sid) return r.pgeEd ? <PgeEdPage key={id + r.pgeEd} gid={id} /> : <PgeListPage key={id} gid={id} />;
    return <L0 />; };
});

Object.assign(window, { ED3, pgeList });
