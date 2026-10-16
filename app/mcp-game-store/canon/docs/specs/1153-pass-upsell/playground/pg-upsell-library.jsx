// ============================================================================
// Playground (pass-upsell-proposal): the Library and the library game pages (C, D1 to D3, E, F2, the Account sentence).
// Re-publishes, in this page only: GsLibrary (canon's, app/gs-discover.jsx, plus C's card, F2's designs and a Played filter),
// gsLibRow (Escape and the Barrow staged), PzNow and CbNow (canon's, plus F2's link once finished), GsPassCard (C's Open switch),
// and GS_LIBRARY.casebook / delve / escape / barrow for a free or Pass-ended player. Each page body is canon's composition with the
// first-part card (PguFirst) or the returning card (PguReturn) in the now card's place; CbFirst and DvFirst stay canon and unused here.
// ============================================================================
const PGU_SHIP_LIB = { ...window.GS_LIBRARY };
const pguShipLibRow = window.gsLibRow;
const PguShipPassCard = window.GsPassCard;

// ---- F2's link from a finished daily or weekly: Library, filtered to what this player hasn't played. ----
const PguNextLink = ({ kind }) => {
  const gs = useGs(); const v = usePgu();
  if (gs.view === 'out') return null;
  const go = () => gs.go('library', v.F2link === 1 ? { played: 'no', rhythm: kind } : v.F2link === 4 ? null : { played: 'no' });
  return <div className="pgu-nextlink"><DS.TextLink onClick={go}>{PGU_LINK[v.F2link](kind)}</DS.TextLink></div>;
};

// ---- D: the free first part's card. Play alone before and during; Share and the Pass once done (three designs). ----
const pguEscFirst = () => PZ.escape.all[PZ.escape.all.length - 1];
const PGU_FIRST = {
  casebook: (gs) => { const c = CB_FIRST; return {
    unit: 'case', label: 'THE FIRST CASE · FREE', title: c.title,
    none: 'The game’s very first case, the same for everyone. Play it free.',
    live: 'You’ve used 6 of 16 turns. Carry on in your AI.', liveBar: ['6 of 16 turns used', 6, 16],
    done: 'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.', doneBar: [c.turns + ' of 16 turns used', c.turns, 16],
    result: cbStatus(c), share: cbShareLines(c), rec: 'See every turn', open: () => cbGo(gs, c.id), play: () => gs.play(GS_NAME.casebook), next: 'weekly' }; },
  delve: (gs) => { const s = DV_FIRST; return {
    unit: 'scene', label: 'THE FIRST SCENE · FREE', title: s.title,
    none: 'The game’s very first scene, the same for everyone. Play it free.',
    live: 'You’re playing ' + s.hero + '. The rescue is 2 of 6 along and the ritual is 1 of 6.', liveBar: ['Rescue 2 of 6', 2, 6],
    done: 'You played ' + s.hero + ' and the ritual finished before Elsie was out, in ' + s.rolls + ' rolls.',
    result: dvStatus(s), share: gsShareText(GS_SESSIONS['delve-first']), rec: 'See every roll', open: () => gs.go('session', { id: 'delve-first' }), play: () => gs.play('Delve') }; },
  escape: (gs) => { const x = pguEscFirst(); const m = /in (\d+) moves/.exec(x.line); return {
    unit: 'room', label: 'THE FIRST ROOM · FREE', title: x.title,
    none: 'The game’s very first room, the same for everyone. Play it free.',
    live: 'You’ve made four moves. You haven’t found the way out yet.',
    done: m ? 'You got out in ' + m[1] + ' moves.' : x.line + '.',
    result: pzStatus(PZ.escape, x), share: x.sid ? gsShareText(GS_SESSIONS[x.sid]) : [x.line], rec: 'See every move', open: () => gs.go('session', { id: x.sid }), play: () => gs.play('Escape') }; },
  barrow: (gs) => ({
    unit: 'chapter', label: gs.view === 'pass' ? 'CHAPTER 1' : 'CHAPTER 1 · FREE', title: BW_CH1.title,
    none: BW_CH1.line,
    live: 'Your hero is on level 2 of 5. Carry on in your AI.', liveBar: ['Level 2 of 5', 2, 5],
    done: 'Your hero reached level 4 and came back with a bronze ring and 6 pieces of loot.', doneBar: ['Level 4 of 5', 4, 5],
    result: { kind: 'ok', label: 'Finished' }, share: gsShareText(GS_SESSIONS['pgu-barrow-ch1']), rec: 'See the run', open: () => gs.go('session', { id: 'pgu-barrow-ch1' }),
    play: () => gs.playReq({ kind: 'edition', e: bwEds(gs)[0] }) }),
};
const PguFirst = ({ id }) => {
  const gs = useGs(); const v = usePgu(); const f = PGU_FIRST[id](gs);
  const st = pguFirstState(gs, id); const done = st === 'done';
  const design = id === 'barrow' ? v.D3 : v.D1;
  const pass = PGU_D2[v.D2](f.unit);
  const bar = st === 'live' ? f.liveBar : done ? f.doneBar : null;
  const toPass = () => gs.go('pass');
  // The next chapter's coming-soon line is for Pass holders only: a free or Pass-ended player can't play it (owner, 2026-10-16).
  const soon = id === 'barrow' && gs.view === 'pass' ? <span className="gs-muted pgu-A5lib">{PGU_A5[v.A5][1]}</span> : null;
  return (
    <section className={'lb-card pgu-first' + (done ? ' is-done pgu-d' + design : '')} style={id === 'barrow' ? { gridColumn: '1 / -1' } : undefined}>
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{f.label}</span><h2 className="mcp-t-sec">{f.title}</h2></div>
        {(st === 'live' || done) && <span className="lb-big"><LbResult s={st === 'live' ? { kind: 'live', label: 'In progress' } : f.result} /></span>}
      </div>
      <p>{st === 'live' ? f.live : done ? f.done : f.none}</p>
      {bar && <DS.ProgressBar label={bar[0]} value={bar[1]} max={bar[2]} showValue={false} />}
      {done && design === 3 && <p className="gs-muted pgu-wrap">{pass} <button type="button" className="gs-inlink" onClick={toPass}>Get the Pass</button></p>}
      <div className="lb-foot">
        <div className="lb-acts">
          {done ? <><LbShare lines={f.share} /><DS.TextLink onClick={f.open}>{f.rec}</DS.TextLink></> : <DS.Button onClick={f.play}>Play</DS.Button>}
        </div>
        {done && design === 1 && <div className="lb-pass"><DS.Button variant="secondary" onClick={toPass}>Get the Pass</DS.Button><span className="gs-muted">{pass}</span></div>}
        {!done && soon}
      </div>
      {done && design === 4 && pass.endsWith('the Pass.') && <p className="gs-muted pgu-wrap">{pass.slice(0, -'the Pass.'.length)}<button type="button" className="gs-inlink" onClick={toPass}>the Pass</button>.</p>}
      {done && design === 2 && <div className="pgu-passrow"><span className="gs-muted pgu-wrap">{pass}</span><DS.TextLink onClick={toPass}>Get the Pass</DS.TextLink></div>}
      {done && soon}
      {done && f.next && !gsLapsed(gs) && <PguNextLink kind={f.next} />}
    </section>
  );
};

// ---- E: the returning card, for a player whose Pass has ended. ----
const pguReturnLabel = (gs, id) => {
  if (id === 'barrow') return 'CHAPTER 1';
  const h = id === 'casebook' ? cbHist(gs)[0] : dvHist(gs)[0];
  return h ? 'WEEK OF ' + (id === 'casebook' ? h.week : h.date).toUpperCase() : 'YOUR LAST ' + GS_GAMES[id].ed[0].toUpperCase();
};
const PguReturn = ({ id }) => {
  const gs = useGs(); const v = usePgu(); const [t, l] = PGU_E[v.E];
  // "Once, then gone": the card counts as shown once the player leaves this page.
  React.useEffect(() => () => {
    const r = window.KitCandidateApi && window.KitCandidateApi.route;
    if (PguStore.get().Eshow === 'once' && (!r || r.name !== GS_GAMES[id].route || r.page !== 'record')) PguStore.set({ seen: { ...PguStore.get().seen, [id]: true } });
  }, []);
  return (
    <section className="lb-card pgu-E" style={id === 'barrow' ? { gridColumn: '1 / -1' } : undefined}>
      <div className="gs-stack-xs"><span className="gs-label">{pguReturnLabel(gs, id)}</span><h2 className="mcp-t-sec pgu-wrap">{t}</h2></div>
      <div><DS.TextLink onClick={() => gs.go('pass')}>{l}</DS.TextLink></div>
    </section>
  );
};
const pguNowCard = (gs, v, id) => (gsLapsed(gs) && !(v.Eshow === 'once' && v.seen[id]) && id !== 'escape' ? <PguReturn id={id} /> : <PguFirst id={id} />);

// ---- The four library game pages, for a free or Pass-ended player (canon's composition; a Pass holder gets canon's page). ----
const PguCbLibrary = () => {
  const gs = useGs(); const v = usePgu();
  if (gs.view === 'pass' || gs.route.sid) return <PGU_SHIP_LIB.casebook />;
  const access = lbAccess(gs, 'casebook'); const lapsed = gsLapsed(gs); const fresh = gsFresh(gs);
  const firstLive = !lapsed && !lbWeekDone(gs) && !fresh;
  const ach = fresh ? lbNoAch(CB_ACH) : firstLive ? CB_ACH.map((a) => ({ ...a, gotFree: undefined })) : CB_ACH;
  const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (fresh ? 'f' : '');
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="casebook" />
      <div className="lb-lay">
        {pguNowCard(gs, v, 'casebook')}
        {!lapsed && <LbRunPass unit="weeks" weeks={cbWeeks(gs)} />}
        {lapsed && (() => { const f = lbFrozen(cbWeeks(gs), cbRunList(gs), (c) => c.week); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={ach} badges={CB_BADGES} access={access} ed={GS_GAMES.casebook.ed} />
        <LbRecent title="Your cases" allLabel="See in History" empty="Your cases appear here once you have played one." />
      </div>
    </main>
  );
};
const PguDvLibrary = () => {
  const gs = useGs(); const v = usePgu();
  if (gs.view === 'pass') return <PGU_SHIP_LIB.delve />;
  const access = lbAccess(gs, 'delve'); const lapsed = gsLapsed(gs); const fresh = gsFresh(gs);
  const firstLive = !lapsed && !lbWeekDone(gs) && !fresh;
  const ach = fresh ? lbNoAch(DV_ACH) : firstLive ? DV_ACH.map((a) => ({ ...a, gotFree: undefined })) : DV_ACH;
  const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (fresh ? 'f' : '');
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className="lb-lay">
        {pguNowCard(gs, v, 'delve')}
        {!lapsed && <LbRunPass unit="weeks" weeks={lbRunOf(DV_ALL)} />}
        {lapsed && (() => { const list = DV_ALL.map((s, i) => ({ ...s, done: i === 0 ? false : s.end === 'won', failed: i > 0 && s.played && s.end !== 'won' })); const f = lbFrozen(lbRunOf(list), list, (s) => s.date); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={ach} badges={DV_BADGES} access={access} ed={GS_GAMES.delve.ed} />
        <LbRecent title="Your scenes" allLabel="See in History" empty="Your scenes appear here once you have played one." />
      </div>
    </main>
  );
};
// Escape as a free first edition (staging): its first room's achievements are the ones a free player can earn.
const PguEsLibrary = () => {
  const gs = useGs(); const v = usePgu();
  if (gs.view === 'pass') return <PGU_SHIP_LIB.escape />;
  const c = PZ.escape; const x = pguEscFirst(); const lapsed = gsLapsed(gs); const fresh = gsFresh(gs); const st = pguFirstState(gs, 'escape');
  const items = c.ach.map((a) => ({ ...a, first: a.k !== 'e4', gotFree: a.k === 'e1' && st === 'done' ? x.date : undefined }));
  const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (fresh ? 'f' : '');
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="escape" />
      <div className="lb-lay">
        {pguNowCard(gs, v, 'escape')}
        {!lapsed && <LbRunPass unit="weeks" weeks={lbRunOf(c.all)} />}
        {lapsed && (() => { const f = lbFrozen(lbRunOf(c.all), c.all, (y) => y.date); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={fresh ? lbNoAch(items) : items} badges={c.badges} access={lbAccess(gs, 'escape')} ed={GS_GAMES.escape.ed} />
        <LbRecent title="Your rooms" allLabel="See in History" empty="Your rooms appear here once you have played one." />
      </div>
    </main>
  );
};
// The Barrow: every view (canon's page had one card for all). Earned dates for a finished or Pass-ended player are placeholders.
const PguBwLibrary = () => {
  const gs = useGs(); const v = usePgu(); const st = pguFirstState(gs, 'barrow');
  const dates = gsLapsed(gs) ? { seal: '12 October', ring: '13 October', deep: '14 October' } : st === 'done' ? { seal: '14 October', ring: '14 October' } : {};
  const ach = BW_ACH.map((a) => ({ ...a, got: dates[a.k], gotFree: dates[a.k] }));
  return (
    <main key={gs.view + (gs.sub.hadPass ? 'u' : '') + st} className="gs-wrap gs-main">
      <LbHead id="barrow" />
      <div className="lb-lay">
        {gs.view === 'pass' ? <PguFirst id="barrow" /> : pguNowCard(gs, v, 'barrow')}
        <LbAch items={ach} badges={BW_BADGES} access={lbAccess(gs, 'barrow')} ed={GS_GAMES.barrow.ed} />
        <LbRecent title="Your chapters" allLabel="See in History" empty="Your chapters appear here once you have played one." />
      </div>
    </main>
  );
};
Object.assign(window.GS_LIBRARY, { casebook: PguCbLibrary, delve: PguDvLibrary, escape: PguEsLibrary, barrow: PguBwLibrary });

// ---- Library rows: Escape and the Barrow as staged for a free player. ----
const pguRow = (result, tone, when, at) => ({ result, tone, when, at });
const pguLibRow = (gs, k) => {
  if (gs.view !== 'pass' && (k === 'escape' || k === 'barrow')) {
    const st = pguFirstState(gs, k); const u = k === 'escape' ? 'room' : 'chapter';
    if (gsLapsed(gs) && k === 'escape') return pguRow('Pass only', null, '28 Sep', new Date(2026, 8, 28).getTime());
    if (st === 'none') return pguRow(k === 'escape' ? 'Your free room is ready' : 'Chapter 1 is ready', null, '', 0);
    if (st === 'live') return pguRow('In progress', null, 'Today', 9e15);
    const d = k === 'escape' ? pguEscFirst().d : new Date(2026, 9, 14);
    return pguRow('Free ' + u + ' done', 'ok', d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'short' }), d.getTime());
  }
  return pguShipLibRow(gs, k);
};

// ---- C: what a new account opens. The same list sits on the Account page when C's Open switch says so. ----
const PguOpensList = ({ inCard }) => {
  const gs = useGs(); const v = usePgu(); const c = PGU_C[v.C];
  const toPass = () => gs.go('pass');
  return <>
    <div className="pgu-opens-head">{c.label ? <span className="gs-label">{c.head}</span> : <h2 className="mcp-t-card">{c.head}</h2>}</div>
    <DS.RowList label={c.head}>{PGU_C_ROWS.map((k) => { const g = GS_GAMES[k]; return (
      <DS.ListRow key={k} lead={<GpMini art={g.art} sm />} title={g.name} meta={PGU_STAGE[k] === 'daily' ? c.daily : c.units[k]} end="Play" onClick={() => gs.play(g.name)} />
    ); })}</DS.RowList>
    <div className={'pgu-opens-foot' + (inCard ? ' is-in-card' : '')}>
      {c.keep && <p className="gs-muted pgu-wrap">{c.keep}</p>}
      <p className="gs-muted"><button type="button" className="gs-inlink" onClick={toPass}>{c.link}</button>{c.rest}</p>
    </div>
  </>;
};
const PguPassCard = () => {
  const gs = useGs(); const v = usePgu();
  if (v.Cacct === 'list' && !GS_SUB_HOLDS.includes(gs.sub.status) && !gs.sub.hadPass) return (
    <section className="lb-box pgu-opens pgu-Cacct">
      <div className="pgu-opens-head"><h2 className="mcp-t-card">Pass</h2></div>
      <PguOpensList inCard />
      <div className="pgu-opens-act"><DS.Button variant="secondary" onClick={() => gs.go('pass')}>Get the Pass</DS.Button></div>
    </section>
  );
  return <PguShipPassCard />;
};

// ---- Library (route `library`): canon's, with C's card for a new free account, F2's three designs and a Played filter. ----
const PguLibrary = () => {
  const gs = useGs(); const v = usePgu();
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState(gs.route.kind || 'all'); const [sort, setSort] = React.useState('last');
  const [rhy, setRhy] = React.useState(gs.route.rhythm || 'all'); const [played, setPlayed] = React.useState(gs.route.played || 'all');
  React.useEffect(() => { setCat(gs.route.kind || 'all'); setRhy(gs.route.rhythm || 'all'); setPlayed(gs.route.played || 'all'); }, [gs.route]);
  const wait = useGsPart([q, cat, rhy, sort, played]);
  const lay = React.useRef(null);
  const showAll = () => { setQ(''); setCat('all'); setRhy('all'); setPlayed('all'); setTimeout(() => { const i = lay.current && lay.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
  const c4 = gsFresh(gs) && gs.view === 'free' && v.C === 4;
  if (gsFresh(gs) && gs.view === 'free' && !c4) return (<>
    {window.GsPushAsk && <window.GsPushAsk />}
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Library</h1>
      <section className="lb-box pgu-opens pgu-C pgu-F2"><PguOpensList /></section>
    </main>
  </>);
  const rows = {}; PGU_SHOWN.forEach((k) => { rows[k] = pguLibRow(gs, k); });
  const az = (a, b) => GS_GAMES[a].name.localeCompare(GS_GAMES[b].name);
  const listed = PGU_SHOWN.filter((k) => lbAccess(gs, k) !== 'none' || lbPast(gs));
  const ids = listed.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && (rhy === 'all' || gsRhythm(k) === rhy) && gsFind(q, k)
    && (played === 'all' || (played === 'no') !== (v.F2many === 'many' ? k === 'word' : pguPlayed(gs, k))))
    .sort((a, b) => (sort === 'az' ? az(a, b) : rows[b].at - rows[a].at || PGU_SHOWN.indexOf(a) - PGU_SHOWN.indexOf(b)));
  // F2 staging switch: "Most not played" treats every game but Daily Word as unplayed, so a full row can be seen.
  const played1 = (k) => (v.F2many === 'many' ? k === 'word' : pguPlayed(gs, k));
  // F2 (owner, 2026-10-16): the row is for games with editions (daily, weekly, chapters), showing ones whose current edition is unplayed.
  // A standalone (no editions, e.g. 36,000 Summers Ago) never goes in it. "As staged" reads game-level played data; the seed has no per-edition flag for every game.
  const regular = (k) => k === 'barrow' || !!gsRhythm(k);
  const fresh = ids.filter((k) => regular(k) && !played1(k)); const mine = ids.filter((k) => !fresh.includes(k));
  const row = (k) => { const g = GS_GAMES[k]; const me = rows[k]; return <DS.ListRow key={k} lead={<GpMini art={g.art} sm />} title={g.name} result={gsForms(me.result)} tone={me.tone || undefined} when={me.when || undefined} onClick={() => gs.go(g.route, { page: 'record' })} />; };
  const list = (ks) => <div className="lb-box"><DS.RowList label="Library">{ks.map(row)}</DS.RowList></div>;
  const grouped = played === 'all' && v.F2 !== 3 && fresh.length > 0;
  const tileEls = (ks) => ks.map((k) => { const g = GS_GAMES[k]; return (
    <DS.GameTile key={k} className="mcp-art-host" art={<GsArt art={g.art} shape="landscape" />}
      title={<button type="button" className="mcp-gtile-open mcp-art-link" onClick={() => gs.go(g.route, { page: 'record' })}>{g.name}</button>} kind={gsKind(GS_GAMES[k].category)} />
  ); });
  const tiles = (ks) => <div className="pgu-tiles">{tileEls(ks)}</div>;
  const empty = <div className="dc-empty" style={{ minWidth: 0 }}><p style={{ overflowWrap: 'anywhere' }}>{q.trim() ? 'No game matches “' + q + '”.' : 'No game matches that.'}</p><DS.TextLink onClick={showAll}>Show every game</DS.TextLink></div>;
  return (<>
    {window.GsPushAsk && <window.GsPushAsk />}
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Library</h1>
      <div className="lb-alllay" ref={lay}>
        <window.LbTools>
          <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Genre" value={cat} opts={[['all', 'All games'], ...GS_KINDS.map((c) => [c, gsKind(c)])]} onPick={setCat} />
          <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={setRhy} />
          <LbChoice label="Played" value={played} opts={[['all', 'All games'], ['no', 'Not played yet'], ['yes', 'Played']]} onPick={setPlayed} />
          <LbChoice label="Order" value={sort} opts={[['last', 'Last played'], ['az', 'A to Z']]} onPick={setSort} />
        </window.LbTools>
        <div className="pgu-libbody pgu-F2">
          {wait ? <GsPart label="Loading games" /> : !ids.length ? empty : grouped ? <>
            {v.F2 === 2
              ? <section className="pgu-libgrp pgu-tilerow"><DS.CardRow title="New for you" kind="tiles">{tileEls(fresh)}</DS.CardRow></section>
              : <section className="pgu-libgrp"><h2 className="mcp-t-sec">New for you</h2>{list(fresh)}</section>}
            {mine.length > 0 && <section className="pgu-libgrp"><h2 className="mcp-t-sec">Your games</h2>{list(mine)}</section>}
          </> : <>
            {v.F2 === 3 && played === 'all' && fresh.length > 0 && <div><DS.TextLink onClick={() => setPlayed('no')}>See what you haven’t played</DS.TextLink></div>}
            {list(ids)}
          </>}
        </div>
        {c4 && <p className="gs-muted pgu-wrap pgu-C">Everything else comes with <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</p>}
      </div>
    </main>
  </>);
};

// ---- Canon's now cards, with F2's link once finished. ----
const PguPzNow = ({ c, done, none, id }) => {
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
      {done && <PguNextLink kind={c.weekly ? 'weekly' : 'daily'} />}
    </section>
  );
};
const PguCbNow = ({ c }) => {
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
      {!c.live && <PguNextLink kind="weekly" />}
    </section>
  );
};

Object.assign(window, { GsLibrary: PguLibrary, gsLibRow: pguLibRow, PzNow: PguPzNow, CbNow: PguCbNow, GsPassCard: PguPassCard, PguFirst, PguReturn });
