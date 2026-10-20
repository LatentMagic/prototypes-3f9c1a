// ============================================================================
// After Pixels — a game's editions (game-editions-list option 2, head 2g).
// Every game that releases editions (gsRhythm): "Every word / room / case / scene" under the library game page's title opens the list
// (route { page: 'record', list: true }); each row opens the edition in a panel over the list (round 3), its prompt inside.
// No route leads to one edition. The list is settled (owner, 2026-10-12); the panel is moved over from the playground, unratified.
// What an edition says about itself is SAMPLE text (PGE_INFO). Loads after gs-history.jsx, before main.jsx.
// ============================================================================
const ED3 = GS_GAME_ORDER.filter((k) => gsRhythm(k) || GS_GAMES[k].eds);
const pgeW = (gid, n = 0) => GS_GAMES[gid].ed[n];
// Only the dailies go by number. A game whose editions are named scenarios shows the name alone, no number anywhere (owner, 2026-10-15).
const pgeNoNum = (gid) => !GS_GAMES[gid].daily && gsRhythm(gid) !== 'daily';
const pgeTry = (gid) => (pgeNoNum(gid) ? 'Try a name or a date.' : 'Try a name, a number or a date.');
// ---- SAMPLE: what an edition says about itself. The app holds only number, title, date (and Casebook's cast). ----
const PGE_INFO = {
  word: 'Five letters. Six guesses.',
  groups: 'Sixteen words hide four groups. Find all four.',
  mystery: 'One suspect, one weapon, one room. One accusation.',
  barrow: 'Five levels under the hill. Your loot carries on.',
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
const PGE_LEN = { word: '10 min', groups: '10 min', mystery: '10 min', escape: 'About 10 min', casebook: '25–40 min', delve: '25–40 min', barrow: '45–60 min' };
const pgeAnd = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const pgeInfo = (e) => {
  const line = e.gid === 'casebook' ? PGE_INFO.casebook[e.n % 8] : typeof PGE_INFO[e.gid] === 'string' ? PGE_INFO[e.gid] : PGE_INFO[e.gid][e.title] || '';
  const cb = e.gid === 'casebook' && CB_ALL.find((x) => x.id === e.key);
  return { line, len: PGE_LEN[e.gid], who: cb && cb.cast ? 'You question ' + pgeAnd(cb.cast) + '.' : null };
};

// ---- One game's editions, newest first, each once. No result, no replays: those are History's. ----
// Played: a finished play. Not played, in progress and not finished carry no mark (round 2).
const pgePlayed = (e) => !!e.status && e.status.kind !== 'none' && e.status.kind !== 'live';
const pgeEds = (gs, gid) => edList(gs, gid).map((e) => ({ ...e, name: edName(e), when: lbShort(e.date), played: pgePlayed(e), live: !!e.status && e.status.kind === 'live', held: edNeedsPass(gs, e), info: pgeInfo(e),
  hay: phHay(gid, e.key, e.title, phParse(e.date)) + ' ' + edName(e).toLowerCase() }));
const pgePlayedText = (e) => (e.live ? 'You’re partway through this ' + pgeW(e.gid) + '.' : 'You’ve played this ' + pgeW(e.gid) + '.');
// A finished edition of a game that can't be replayed: what it was, and that it was played once (wording: every-edition-playable).
// No game word here: Daily Groups' word ("groups") has no singular that reads in a sentence.
const pgeOnceText = 'You’ve played this one. It can’t be played again.';

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
const PgeEmpty = ({ f, gid }) => <p className="lb-empty gs-muted">{f.s ? (f.show === 'none' ? 'No ' + pgeW(gid) + ' you haven’t played matches that. ' + pgeTry(gid) : 'Nothing matches that. ' + pgeTry(gid)) : f.show === 'none' ? 'You’ve played every ' + pgeW(gid) + '.' : 'Nothing matches that.'}</p>;
const pgeList = (gs, gid, extra) => gs.go(GS_GAMES[gid].route, { page: 'record', list: true, ...(extra || {}) });
const pgeHistory = (gs, gid, e) => gs.go('history', e ? { game: gid, q: pgeNoNum(gid) ? e.title : '#' + e.n, from: gid } : { game: gid, from: gid });

// ---- The list: back to the game, H1, search and Filters (Show, Order), then one row per edition ----
const PgeListPage = ({ gid }) => {
  const gs = useGs(); const g = GS_GAMES[gid]; const f = usePgeList(gid);
  const fromLib = !!gs.route.fromLib; const title = g.edAll || 'Every ' + pgeW(gid);
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={g.name} onClick={() => (fromLib ? gs.back() : gs.go(g.route, { page: 'record' }))} />
      <h1 className="gs-h1">{title}</h1>
      <div className="lb-alllay">
        <window.LbTools>
          <DS.SearchField label="Search" placeholder={pgeNoNum(gid) ? 'A name or date' : 'A number, name or date'} value={f.q} onChange={(e) => f.set('q', e.target.value)} />
          <LbChoice label="Show" value={f.show} opts={[['all', title], ['none', 'Not played']]} onPick={(v) => f.set('show', v)} />
          <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={(v) => f.set('sort', v)} />
        </window.LbTools>
        <div ref={f.box} className="lb-box lb-results ed-results" style={{ maxWidth: 960, minWidth: 0 }}>
          {f.wait ? <GsPart label="Loading" /> : <>
            {!f.rows.length ? <PgeEmpty f={f} gid={gid} /> : <DS.RowList label={title}>{f.rows.map((e) => (
              <DS.ListRow key={e.key} title={e.title && !pgeNoNum(gid) ? '#' + e.n + ' · ' + e.name : e.name} when={e.when} result={e.played ? 'Played' : undefined} onClick={() => f.set('open', e.key)} />
            ))}</DS.RowList>}
            <RpPages pg={f.pg} pages={f.pages} go={f.go} />
          </>}
        </div>
      </div>
      <PgeEdPanel gid={gid} k={f.open} onClose={() => f.set('open', null)} />
    </main>
  );
};

// ---- The edition in a panel over the list (round 3): a bottom sheet under 640px, its prompt inside, no play dialog. ----
// The open edition is the list's own state (f.open), kept in the history entry, so Back from "See in History" returns with it open.
const PgeEdPanel = ({ gid, k, onClose }) => {
  const gs = useGs(); const g = GS_GAMES[gid]; const last = React.useRef(null);
  const e0 = k ? pgeEds(gs, gid).find((x) => x.key === k) : null; if (e0) last.current = e0; const e = last.current;
  if (!e) return null;
  const text = gsPromptText({ kind: 'edition', e });
  // A finished edition of a game that can't be replayed (gsCanReplay) has nothing left to play: its result and the played-once line, no prompt, no Copy, no Pass line.
  const done = e.played && !gsCanReplay(gid); const prompt = !e.held && !done;
  const when = gsRhythm(gid) === 'weekly' ? 'week of ' + e.date : e.date;
  return (
    <DS.Popup kind="panel" open={!!e0} onClose={onClose} title={e.title || edLabel(e)} actions={prompt ? <GsCopyPrompt text={text} block /> : undefined}>
      <div className="pge-panel">
        <span className="gs-label">{[e.title && (pgeNoNum(gid) ? g.name : g.name + ' #' + e.n), when, e.info.len].filter(Boolean).join(' · ').toUpperCase()}</span>
        <p style={{ margin: 0 }}>{e.info.line}</p>
        {e.info.who && <p className="gs-muted" style={{ margin: 0 }}>{e.info.who}</p>}
        {done ? (
          <div className="pge-done">
            <LbResult s={e.status} />
            <p style={{ margin: 0 }}>{pgeOnceText}</p>
            <DS.TextLink onClick={() => pgeHistory(gs, gid, e)}>See in History</DS.TextLink>
          </div>
        ) : e.played && <div className="gs-stack-xs" style={{ justifyItems: 'start' }}><p className="gs-muted" style={{ margin: 0 }}>{pgePlayedText(e)}</p><DS.TextLink onClick={() => pgeHistory(gs, gid, e)}>See in History</DS.TextLink></div>}
        {done ? null : e.held ? <div style={{ marginTop: -8 }}><GsNeedsPass gid={gid} /></div> : prompt && (
          <div className="gs-stack-sm">
            <p className="hw-need gs-small" style={{ margin: 0 }}><b>Connect your AI first.</b> <GsHowLink label="How to connect" /></p>
            <GsPrompt text={text} />
          </div>
        )}
      </div>
    </DS.Popup>
  );
};

// The list sits inside the game's library route, as a case page does.
ED3.forEach((id) => {
  const L0 = window.GS_LIBRARY[id];
  window.GS_LIBRARY[id] = () => { const gs = useGs(); const r = gs.route;
    if (r.list && !r.sid) return <PgeListPage key={id} gid={id} />;
    return <L0 />; };
});

Object.assign(window, { ED3, pgeList });
