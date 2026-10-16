// [Platform] — Library and the library game pages (owner, 2026-10-16).
// Re-publishes: GsLibrary (canon's, app/gs-discover.jsx, plus New for you, Your games and the free account's Pass line), gsLibRow
// (Escape and the Barrow as staged), PzNow and CbNow (canon's, plus the link once finished), and GS_LIBRARY.casebook / delve /
// escape / barrow for a free or Pass-ended player. Each page body is canon's composition with the first-part card (CprFirst)
// or the returning card (CprReturn) in the now card's place. A Pass holder gets canon's page, except the Barrow.
const CPR_SHIP_LIB = { ...window.GS_LIBRARY };
const cprShipLibRow = window.gsLibRow;

// The link under a finished daily or weekly game: Library as it is, New for you on top, never filtered.
const CprNextLink = () => {
  const gs = useGs(); if (gs.view === 'out') return null;
  return <div className="gs-pu-nextlink"><DS.TextLink onClick={() => gs.go('library')}>See what’s out for you to play</DS.TextLink></div>;
};

// ---- The free first part's card: Play before and during; once done, the result, Share and the record link, then
// "Keep playing with the Pass." with "the Pass" linked and no button. ----
const cprEscFirst = () => PZ.escape.all[PZ.escape.all.length - 1];
const CPR_FIRST = {
  casebook: (gs) => { const c = CB_FIRST; return {
    label: 'THE FIRST CASE · FREE', title: c.title, weekly: true,
    none: 'The game’s very first case, the same for everyone. Play it free.',
    live: 'You’ve used 6 of 16 turns. Carry on in your AI.', liveBar: ['6 of 16 turns used', 6, 16],
    done: 'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.', doneBar: [c.turns + ' of 16 turns used', c.turns, 16],
    result: cbStatus(c), share: cbShareLines(c), rec: 'See every turn', open: () => cbGo(gs, c.id), play: () => gs.play(GS_NAME.casebook) }; },
  delve: (gs) => { const s = DV_FIRST; return {
    label: 'THE FIRST SCENE · FREE', title: s.title, weekly: true,
    none: 'The game’s very first scene, the same for everyone. Play it free.',
    live: 'You’re playing ' + s.hero + '. The rescue is 2 of 6 along and the ritual is 1 of 6.', liveBar: ['Rescue 2 of 6', 2, 6],
    done: 'You played ' + s.hero + ' and the ritual finished before Elsie was out, in ' + s.rolls + ' rolls.',
    result: dvStatus(s), share: gsShareText(GS_SESSIONS['delve-first']), rec: 'See every roll', open: () => gs.go('session', { id: 'delve-first' }), play: () => gs.play('Delve') }; },
  escape: (gs) => { const x = cprEscFirst(); const m = /in (\d+) moves/.exec(x.line); return {
    label: 'THE FIRST ROOM · FREE', title: x.title, weekly: true,
    none: 'The game’s very first room, the same for everyone. Play it free.',
    live: 'You’ve made four moves. You haven’t found the way out yet.',
    done: m ? 'You got out in ' + m[1] + ' moves.' : x.line + '.',
    result: pzStatus(PZ.escape, x), share: x.sid ? gsShareText(GS_SESSIONS[x.sid]) : [x.line], rec: 'See every move', open: () => gs.go('session', { id: x.sid }), play: () => gs.play('Escape') }; },
  barrow: (gs) => ({
    label: gs.view === 'pass' ? 'CHAPTER 1' : 'CHAPTER 1 · FREE', title: BW_CH1.title,
    none: BW_CH1.line,
    done: 'Your hero reached level 4 and came back with a bronze ring and 6 pieces of loot.', doneBar: ['Level 4 of 5', 4, 5],
    result: { kind: 'ok', label: 'Finished' }, share: gsShareText(GS_SESSIONS['gs-pu-barrow-ch1']), rec: 'See the run', open: () => gs.go('session', { id: 'gs-pu-barrow-ch1' }),
    play: () => gs.playReq({ kind: 'edition', e: bwEds(gs)[0] }) }),
};
const CprFirst = ({ id }) => {
  const gs = useGs(); useCpr(); const f = CPR_FIRST[id](gs);
  const st = cprFirstState(gs, id); const done = st === 'done';
  const bar = st === 'live' ? f.liveBar : done ? f.doneBar : null;
  // The Barrow's next chapter is for Pass holders only: a free or Pass-ended player can't play it (owner, 2026-10-16).
  const soon = id === 'barrow' && gs.view === 'pass' ? <span className="gs-muted gs-pu-soon">Chapter 3: coming soon</span> : null;
  return (
    <section className={'lb-card gs-pu-first' + (done ? ' is-done' : '')} style={id === 'barrow' ? { gridColumn: '1 / -1' } : undefined}>
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{f.label}</span><h2 className="mcp-t-sec">{f.title}</h2></div>
        {(st === 'live' || done) && <span className="lb-big"><LbResult s={st === 'live' ? { kind: 'live', label: 'In progress' } : f.result} /></span>}
      </div>
      <p>{st === 'live' ? f.live : done ? f.done : f.none}</p>
      {bar && <DS.ProgressBar label={bar[0]} value={bar[1]} max={bar[2]} showValue={false} />}
      <div className="lb-foot">
        <div className="lb-acts">
          {done ? <><LbShare lines={f.share} /><DS.TextLink onClick={f.open}>{f.rec}</DS.TextLink></> : <DS.Button onClick={f.play}>Play</DS.Button>}
        </div>
        {soon}
      </div>
      {done && gs.view !== 'pass' && <CprPassEnd className="gs-muted gs-pu-wrap" text="Keep playing with the Pass." />}
      {done && f.weekly && !gsLapsed(gs) && <CprNextLink />}
    </section>
  );
};

// ---- A player whose Pass has ended: one card on the game they last played, every visit (owner, 2026-10-16). ----
const cprReturnLabel = (gs, id) => {
  if (cprLapsedOf(id).at) return cprLapsedOf(id).at;
  if (id === 'barrow') return 'CHAPTER 1';
  if (id !== 'casebook' && id !== 'delve') return 'YOUR LAST ' + GS_GAMES[id].ed[0].toUpperCase();
  const h = id === 'casebook' ? cbHist(gs)[0] : dvHist(gs)[0];
  return h ? 'WEEK OF ' + (id === 'casebook' ? h.week : h.date).toUpperCase() : 'YOUR LAST ' + GS_GAMES[id].ed[0].toUpperCase();
};
const CprReturn = ({ id }) => {
  const gs = useGs();
  return (
    <section className="lb-card gs-pu-return" style={id === 'barrow' ? { gridColumn: '1 / -1' } : undefined}>
      <div className="gs-stack-xs"><span className="gs-label">{cprReturnLabel(gs, id)}</span><h2 className="mcp-t-sec gs-pu-wrap">You stopped here. Everything you earned is still yours.</h2></div>
      <div><DS.TextLink onClick={() => gs.go('pass')}>Get the Pass again</DS.TextLink></div>
    </section>
  );
};
// A Pass-only game for a player without the Pass who never played it with one: the free player's closed card, as 36,000 Summers Ago's.
const CprClosed = ({ id }) => {
  const gs = useGs(); const n = GS_NAME[id] || GS_GAMES[id].name;
  return (
    <section className="lb-card is-closed">
      <div className="gs-stack-xs"><h2 className="mcp-t-sec">Only with the Pass</h2><p>{n + ' comes only with the Pass. A free account can’t play it.'}</p></div>
      <DS.Button onClick={() => gs.go('pass')}>Get the Pass</DS.Button>
    </section>
  );
};
const cprNowCard = (gs, id) => { const f = cprLapsedOf(id); return gsLapsed(gs) && f.used && f.pass ? <CprReturn id={id} /> : <CprFirst id={id} />; };
const cprKey = (gs) => gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (gsFresh(gs) ? 'f' : '') + cprStore.get().lapsed;

// ---- The library game pages for a free or Pass-ended player (canon's composition). ----
const CprCbLibrary = () => {
  const gs = useGs();
  if (gs.view === 'pass' || gs.route.sid) return <CPR_SHIP_LIB.casebook />;
  const access = lbAccess(gs, 'casebook'); const lapsed = gsLapsed(gs); const fresh = gsFresh(gs);
  const firstLive = !lapsed && !lbWeekDone(gs) && !fresh;
  const ach = fresh ? lbNoAch(CB_ACH) : firstLive ? CB_ACH.map((a) => ({ ...a, gotFree: undefined })) : CB_ACH;
  return (
    <main key={cprKey(gs)} className="gs-wrap gs-main">
      <LbHead id="casebook" />
      <div className="lb-lay">
        {cprNowCard(gs, 'casebook')}
        {!lapsed && <LbRunPass unit="weeks" weeks={cbWeeks(gs)} />}
        {lapsed && (() => { const f = lbFrozen(cbWeeks(gs), cbRunList(gs), (c) => c.week); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={ach} badges={CB_BADGES} access={access} ed={GS_GAMES.casebook.ed} />
        <LbRecent title="Your cases" allLabel="See in History" empty="Your cases appear here once you have played one." />
      </div>
    </main>
  );
};
const CprDvLibrary = () => {
  const gs = useGs();
  if (gs.view === 'pass') return <CPR_SHIP_LIB.delve />;
  const access = lbAccess(gs, 'delve'); const lapsed = gsLapsed(gs); const fresh = gsFresh(gs);
  const firstLive = !lapsed && !lbWeekDone(gs) && !fresh;
  const ach = fresh ? lbNoAch(DV_ACH) : firstLive ? DV_ACH.map((a) => ({ ...a, gotFree: undefined })) : DV_ACH;
  return (
    <main key={cprKey(gs)} className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className="lb-lay">
        {cprNowCard(gs, 'delve')}
        {!lapsed && <LbRunPass unit="weeks" weeks={lbRunOf(DV_ALL)} />}
        {lapsed && (() => { const list = DV_ALL.map((s, i) => ({ ...s, done: i === 0 ? false : s.end === 'won', failed: i > 0 && s.played && s.end !== 'won' })); const f = lbFrozen(lbRunOf(list), list, (s) => s.date); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={ach} badges={DV_BADGES} access={access} ed={GS_GAMES.delve.ed} />
        <LbRecent title="Your scenes" allLabel="See in History" empty="Your scenes appear here once you have played one." />
      </div>
    </main>
  );
};
// Escape as a free first edition (staging): its first room's achievements are the ones a free player can earn.
const CprEsLibrary = () => {
  const gs = useGs();
  if (gs.view === 'pass') return <CPR_SHIP_LIB.escape />;
  const c = PZ.escape; const x = cprEscFirst(); const lapsed = gsLapsed(gs); const fresh = gsFresh(gs); const st = cprFirstState(gs, 'escape');
  const items = c.ach.map((a) => ({ ...a, first: a.k !== 'e4', gotFree: a.k === 'e1' && st === 'done' ? x.date : undefined }));
  return (
    <main key={cprKey(gs)} className="gs-wrap gs-main">
      <LbHead id="escape" />
      <div className="lb-lay">
        {cprNowCard(gs, 'escape')}
        {!lapsed && <LbRunPass unit="weeks" weeks={lbRunOf(c.all)} />}
        {lapsed && (() => { const f = lbFrozen(lbRunOf(c.all), c.all, (y) => y.date); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={fresh ? lbNoAch(items) : items} badges={c.badges} access={lbAccess(gs, 'escape')} ed={GS_GAMES.escape.ed} />
        <LbRecent title="Your rooms" allLabel="See in History" empty="Your rooms appear here once you have played one." />
      </div>
    </main>
  );
};
// The Barrow, every view. Earned dates for a finished or Pass-ended player are placeholders.
const CprBwLibrary = () => {
  const gs = useGs(); useCpr(); const st = cprFirstState(gs, 'barrow');
  const dates = gsLapsed(gs) ? { seal: '12 October', ring: '13 October', deep: '14 October' } : st === 'done' ? { seal: '14 October', ring: '14 October' } : {};
  const ach = BW_ACH.map((a) => ({ ...a, got: dates[a.k], gotFree: dates[a.k] }));
  return (
    <main key={cprKey(gs) + st} className="gs-wrap gs-main">
      <LbHead id="barrow" />
      <div className="lb-lay">
        {gs.view === 'pass' ? <CprFirst id="barrow" /> : cprNowCard(gs, 'barrow')}
        <LbAch items={ach} badges={BW_BADGES} access={lbAccess(gs, 'barrow')} ed={GS_GAMES.barrow.ed} />
        {st === 'done' ? <CprBwRecent /> : <LbRecent title="Your chapters" allLabel="See in History" empty="Your chapters appear here once you have played one." />}
      </div>
    </main>
  );
};
Object.assign(window.GS_LIBRARY, { casebook: CprCbLibrary, delve: CprDvLibrary, escape: CprEsLibrary, barrow: CprBwLibrary });

// The Barrow's chapters card once chapter 1 is finished: History holds no Barrow play, so the one row is drawn here.
const CprBwRecent = () => {
  const gs = useGs();
  return (
    <section className="lb-card lb-recentcard">
      <div className="lb-sechead"><h2 className="mcp-t-card">Your chapters</h2></div>
      <div className="lb-box"><DS.RowList label="Your chapters">
        {rpRow({ key: 'bw1', title: BW_CH1.title, status: { kind: 'ok', label: 'Finished' }, when: '14 Oct', onOpen: () => gs.go('session', { id: 'gs-pu-barrow-ch1' }) })}
      </DS.RowList></div>
    </section>
  );
};

// ---- The daily games' Library pages: canon's (app/gs-puzzles-library.jsx pzLibrary), with "the Pass" as the line's only link
// (owner, 2026-10-16) in place of the separate About the Pass. The editions list stays where gs-editions.jsx puts it. ----
const cprPzLibrary = (id) => () => {
  const gs = useGs(); const r = gs.route;
  if (r.list && !r.sid) return <PgeListPage key={id} gid={id} />;
  const c = PZ[id]; const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (gs.review.today || '');
  const [recent] = c.plays;
  const never = gs.review.never === id || gsFresh(gs);
  const now = never ? null : lbNow(gs, id); const broken = id === 'word' && gs.review.broken; const none = !now || broken;
  let run = [{ ...c.all[0], played: !none, done: !none && now.status.kind === 'ok' }, ...c.all.slice(1)];
  if (never) run = run.map((x) => ({ ...x, played: false, ok: false, done: false }));
  if (broken) run[1] = { ...run[1], played: true, ok: false, done: false, line: c.bad, sid: 'word-broken-first' };
  run = run.map((x, i) => ({ ...x, failed: i === 0 ? !none && !never && now.status.kind === 'bad' : !!x.played && !x.done }));
  const n = lbStreak(run);
  const ach = (never ? c.ach.map((a) => ({ ...a, got: undefined })) : c.ach).map((a) => (a.of ? { ...a, have: Math.min(n, a.of) } : a));
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id={id} />
      <div className="lb-lay">
        {cprLocked(gs, id) ? (gsLapsed(gs) && cprLapsedOf(id).pass ? <CprReturn id={id} /> : <CprClosed id={id} />) : <PzNow c={c} done={lbWeekDone(gs)} none={none} id={id} />}
        <LbRun n={n} unit={c.weekly ? 'weeks' : 'days'} weeks={lbRunOf(run)} />
        <LbAch items={ach} badges={c.badges} access="all" />
        <LbRecent title={recent} allLabel="See in History" empty={recent + ' appear here once you have played one.'} />
      </div>
      {gs.view !== 'pass' && <CprPassEnd className="gs-muted gs-pu-wrap" text={'Playing earlier ' + GS_GAMES[id].ed[1] + ' comes with the Pass.'} />}
    </main>
  );
};
['word', 'groups', 'mystery'].forEach((id) => { window.GS_LIBRARY[id] = cprPzLibrary(id); });

// ---- Library rows: Escape and the Barrow as staged for a free player. ----
const cprRow = (result, tone, when, at) => ({ result, tone, when, at });
// A Pass-ended player's row for a game with a free first part says what a free player's says, never "Pass only" (owner's proposal, 2026-10-16).
const CPR_FREE_READY = { escape: 'Your free room is ready', barrow: 'Chapter 1 is ready', casebook: 'Your free case is ready', delve: 'Your free scene is ready' };
const cprLibRow = (gs, k) => {
  if (gsLapsed(gs) && (k === 'casebook' || k === 'delve')) {
    if (cprFirstState(gs, k) === 'none') return cprRow(CPR_FREE_READY[k], null, '', 0);
    const r = cprShipLibRow(gs, k); return { ...r, result: k === 'casebook' ? 'Free case done' : 'Free scene done', tone: 'ok' };
  }
  if (gs.view !== 'pass' && (k === 'escape' || k === 'barrow')) {
    const st = cprFirstState(gs, k); const u = k === 'escape' ? 'room' : 'chapter';
    if (st === 'none') return cprRow(CPR_FREE_READY[k], null, '', 0);
    if (st === 'live') return cprRow('In progress', null, 'Today', 9e15);
    const d = k === 'escape' ? cprEscFirst().d : new Date(2026, 9, 14);
    return cprRow('Free ' + u + ' done', 'ok', d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'short' }), d.getTime());
  }
  if (k === 'groups' && gs.view !== 'pass') return cprRow('Pass only', null, '', 0);
  if (k === 'barrow' && gs.view === 'pass' && cprFirstState(gs, k) === 'done') return cprRow('Finished', 'ok', '14 Oct', new Date(2026, 9, 14).getTime());
  return cprShipLibRow(gs, k);
};

// ---- Library (route `library`): canon's search, filters and rows, with New for you on top and Your games under it.
// New for you: games with editions whose current edition you haven't played, as tiles in one sideways row. A standalone never
// goes in it. Not shown when there is nothing new. A free account that has played nothing gets one Pass line under the list. ----
// New for you (owner, 2026-10-16): only what the player can play now. A free player: today's free dailies not yet played and any
// free first part not yet started. A Pass holder: as before.
const cprNewFor = (gs, k) => {
  if (!cprEditions(k) || cprLocked(gs, k)) return false;
  if (gs.view === 'pass') return !cprPlayed(gs, k);
  // Config's Most not played only changes which dailies count as unplayed; the playable-now rule still decides (owner's rule, 2026-10-16).
  if (CPR_STAGE[k] === 'daily') return gsFresh(gs) || (cprStore.get().newEds === 'most' ? k !== 'word' : !gsTodayPlayed(gs)[k]);
  if (CPR_STAGE[k] === 'first') return cprFirstState(gs, k) === 'none';
  return false;
};
const CprLibrary = () => {
  const gs = useGs(); useCpr();
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState(gs.route.kind || 'all'); const [sort, setSort] = React.useState('last');
  const [rhy, setRhy] = React.useState(gs.route.rhythm || 'all');
  React.useEffect(() => { setCat(gs.route.kind || 'all'); setRhy(gs.route.rhythm || 'all'); }, [gs.route]);
  const wait = useGsPart([q, cat, rhy, sort]);
  const lay = React.useRef(null);
  const showAll = () => { setQ(''); setCat('all'); setRhy('all'); setTimeout(() => { const i = lay.current && lay.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
  const rows = {}; CPR_SHOWN.forEach((k) => { rows[k] = cprLibRow(gs, k); });
  const az = (a, b) => GS_GAMES[a].name.localeCompare(GS_GAMES[b].name);
  const listed = CPR_SHOWN.filter((k) => (lbAccess(gs, k) !== 'none' && !cprLocked(gs, k)) || lbPast(gs));
  const ids = listed.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && (rhy === 'all' || gsRhythm(k) === rhy) && gsFind(q, k))
    .sort((a, b) => (sort === 'az' ? az(a, b) : rows[b].at - rows[a].at || CPR_SHOWN.indexOf(a) - CPR_SHOWN.indexOf(b)));
  const fresh = ids.filter((k) => cprNewFor(gs, k)); const mine = ids.filter((k) => !fresh.includes(k));
  const row = (k) => { const g = GS_GAMES[k]; const me = rows[k]; return <DS.ListRow key={k} lead={<GpMini art={g.art} sm />} title={g.name} result={gsForms(me.result)} tone={me.tone || undefined} when={me.when || undefined} onClick={() => gs.go(g.route, { page: 'record' })} />; };
  const list = (ks) => <div className="lb-box"><DS.RowList label="Library">{ks.map(row)}</DS.RowList></div>;
  const tile = (k) => { const g = GS_GAMES[k]; return (
    <DS.GameTile key={k} className="mcp-art-host" art={<GsArt art={g.art} shape="landscape" />}
      title={<button type="button" className="mcp-gtile-open mcp-art-link" onClick={() => gs.go(g.route, { page: 'record' })}>{g.name}</button>} kind={gsKind(g.category)} />
  ); };
  const empty = <div className="dc-empty" style={{ minWidth: 0 }}><p style={{ overflowWrap: 'anywhere' }}>{q.trim() ? 'No game matches “' + q + '”.' : 'No game matches that.'}</p><DS.TextLink onClick={showAll}>Show every game</DS.TextLink></div>;
  const newFree = gsFresh(gs) && gs.view === 'free';
  return (<>
    {window.GsPushAsk && <window.GsPushAsk />}
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Library</h1>
      <div className="lb-alllay" ref={lay}>
        <window.LbTools>
          <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Genre" value={cat} opts={[['all', 'All games'], ...GS_KINDS.map((c) => [c, gsKind(c)])]} onPick={setCat} />
          <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={setRhy} />
          <LbChoice label="Order" value={sort} opts={[['last', 'Last played'], ['az', 'A to Z']]} onPick={setSort} />
        </window.LbTools>
        <div className="gs-pu-libbody">
          {wait ? <GsPart label="Loading games" /> : !ids.length ? empty : fresh.length ? <>
            <section className="gs-pu-libgrp"><DS.CardRow title="New for you" kind="tiles">{fresh.map(tile)}</DS.CardRow></section>
            {mine.length > 0 && <section className="gs-pu-libgrp"><h2 className="mcp-t-sec">Your games</h2>{list(mine)}</section>}
          </> : list(ids)}
        </div>
        {newFree && !wait && ids.length > 0 && <CprPassEnd className="gs-muted gs-pu-wrap" text="Everything else comes with the Pass." />}
      </div>
    </main>
  </>);
};

// ---- Canon's now cards, with the link once finished. ----
const CprPzNow = ({ c, done, none, id }) => {
  const gs = useGs(); const st = done ? c.done : c.live;
  if (none) return (
    <section className="lb-card">
      <div className="lb-top"><div className="gs-stack-xs"><span className="gs-label">{c.weekly ? 'THIS WEEK' : 'TODAY'}</span><h2 className="mcp-t-sec">{c.title}</h2></div></div>
      <p>{GS_PAGES[id].week.line}</p>
      <div className="lb-foot">
        <div className="lb-acts"><DS.Button onClick={() => gs.playReq({ kind: 'edition', e: edList(gs, id)[0] })}>Play</DS.Button></div>
        <span className="gs-muted">{c.next}</span>
      </div>
    </section>
  );
  const lines = done && window.gsShareText ? window.gsShareText(GS_SESSIONS[c.today]) : null;
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{c.weekly ? 'THIS WEEK' : 'TODAY'}</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {done && <span className="lb-big"><LbResult s={c.done.st} /></span>}
      </div>
      <p>{st.line}</p>
      {st.bar && <DS.ProgressBar label={st.bar[0]} value={st.bar[1]} max={st.bar[2]} showValue={false} />}
      <div className="lb-foot">
        <div className="lb-acts">
          {lines && <LbShare lines={lines} />}
          <DS.TextLink onClick={() => gs.go('session', { id: done ? c.today : c.liveSid })}>{done ? c.links[0] : c.links[1]}</DS.TextLink>
        </div>
        <span className="gs-muted">{c.next}</span>
      </div>
      {done && <CprNextLink />}
    </section>
  );
};
const CprCbNow = ({ c }) => {
  const gs = useGs();
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {!c.live && <span className="lb-big"><LbResult s={cbStatus(c)} /></span>}
      </div>
      <p>{c.live
        ? 'You’ve used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' lies. You haven’t named the killer yet.'
        : 'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.'}</p>
      <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
      <div className="lb-foot">
        <div className="lb-acts">
          {!c.live && <LbShare lines={cbShareLines(c)} />}
          <DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink>
        </div>
        <span className="gs-muted">{'Next case: ' + CB_NEXT}</span>
      </div>
      {!c.live && <CprNextLink />}
    </section>
  );
};

Object.assign(window, { GsLibrary: CprLibrary, gsLibRow: cprLibRow, PzNow: CprPzNow, CbNow: CprCbNow });
