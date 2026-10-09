// ============================================================================
// [Platform] — History (every play under its day, replay filter), the play rows, and the library game page's plays card (LbRecent).
// Ported from docs/specs/history/playground/ (pg-history.jsx, pg-replays.jsx). Loads after every library module.
// Seed: one play log built from the library pages' own seeds, plus replays. Every play opens a record that agrees with its row.
// This edition's first play has two forms, finished and in progress (Config: This week, or today); in progress hides its replays.
// ============================================================================
// ---- Dates ----
const PH_TODAY = new Date(2026, 9, 6);
const PH_ENDED = new Date(2026, 8, 18);
const PH_MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const phParse = (s) => { const [d, m, y] = s.split(' '); return new Date(+(y || 2026), PH_MON.indexOf(m), +d); };
const phAt = (d, h, m, plus = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + plus, h, m);
const phDay0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const phDayKey = (d) => d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
const phDayLabel = (d) => { const n = Math.round((phDay0(d) - PH_TODAY) / 864e5); return n === 0 ? 'Today' : n === -1 ? 'Yesterday' : d.toLocaleString('en-GB', { weekday: 'long' }) + ' ' + lbDate(d); };
const phTime = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
const phShort = (d) => lbShort(lbDate(d));

// ---- The play log. An edition holds its plays, first (the one that counts) first. ----
// A play: { at, status, open(gs), again, cur (this edition), now? (the in-progress form of this edition's first play) }
const PH_EDS = {}; const PH_PLAYS = [];
const phEd = (gid, ed, edTitle, edDate, plays, cur) => {
  const e = { gid, ed, edTitle, edDate, plays: plays.map((p, n) => ({ ...p, gid, ed, edTitle, edDate, n, cur: !!cur, again: n > 0, pid: ed + '-' + n })) };
  PH_EDS[ed] = e; PH_PLAYS.push(...e.plays);
};
const phSess = (id) => (gs) => gs.go('session', { id });
const phClone = (sid, k, at, label, kind, extra) => { const id = sid + '-r' + k; GS_SESSIONS[id] = { ...GS_SESSIONS[sid], result: label, loss: kind === 'bad', date: pzLong(at), ...(extra || {}) }; return id; };
const PH_LIVE = { kind: 'live', label: 'In progress' };
// Replays seeded by hand: [days after the first play, hour, minute, result, kind, record extra]
const PH_HAND = {
  word0: [[0, 12, 40, 'Solved in 1 of 6', 'ok', { lines: [['Guess 1', 'TORCH', 'Solved']] }], [0, 21, 15, 'Solved in 2 of 6', 'ok', { lines: [['Guess 1', 'SLATE', 'T is in the word'], ['Guess 2', 'TORCH', 'Solved']] }]],
  escape0: [[0, 19, 30, 'Escaped in 5 moves']], escape2: [[2, 20, 0, 'Escaped in 6 moves']],
  groups1: [[1, 7, 50, 'All 4 groups, no mistakes']], mystery2: [[0, 22, 5, 'Case closed']],
  c0928: [[5, 21, 0, 'Solved', 'ok', 'FQBNFBQFB'], [7, 9, 30, 'Unsolved', 'bad', 'QFNQBFHQNFQBNQ']],
  dv1: [[2, 19, 45, 'Hero fell', 'bad', { figures: ['Threat 4/6', '7 rolls', 'HP 0/12'], tracks: { progress: 2, threat: 4 }, reached: 'Caught', lines: GS_ROLLS.slice(0, 7), share: 'Hero fell · threat 4/6 · 7 rolls' }]],
};
const PH_REPLAY = { word: (k) => 'Solved in ' + (2 + (k % 2)) + ' of 6', groups: () => 'All 4 groups, no mistakes', mystery: () => 'Case closed', escape: (k) => 'Escaped in ' + (5 + (k % 2)) + ' moves' };
const PH_LIVE_SID = { word: 'word-live', groups: 'groups-live', mystery: 'mystery-live', escape: 'escape-live' };
Object.entries(PZ).forEach(([id, c]) => c.all.forEach((x) => {
  if (!x.played) return;
  const cur = x.i === 0; const sid = cur ? c.today : x.sid;
  let first;
  if (cur) { const s = GS_SESSIONS[c.today]; first = { at: phAt(PH_TODAY, 8 + c.salt, 5 + c.salt * 11), status: { kind: s.loss ? 'bad' : 'ok', label: s.result }, now: { status: PH_LIVE, open: phSess(PH_LIVE_SID[id]) } }; }
  else first = { at: phAt(x.d, 7 + ((x.i * 5 + c.salt * 3) % 15), (x.i * 17 + c.salt * 7) % 60, c.weekly ? x.i % 4 : 0), status: { kind: x.ok ? 'ok' : 'bad', label: x.line } };
  first.open = phSess(sid);
  const reps = PH_HAND[x.id] || (x.i > 0 && (x.i * 7 + c.salt * 3) % 11 === 0 ? [[x.i % 2, 21, 10]] : []);
  const plays = [first].concat(reps.map(([plus, h, m, label, kind, extra], k) => {
    const at = phAt(first.at, h, m, plus); const lab = label || PH_REPLAY[id](x.i + k);
    return { at, status: { kind: kind || 'ok', label: lab }, open: phSess(phClone(sid, k, at, lab, kind, extra)) };
  }));
  phEd(id, x.id, x.title, x.d, plays, cur);
}));
// A Casebook replay is its own case record: CbLibrary finds it in CB_REPLAYS by id.
const CB_REPLAYS = {};
CB_ALL.forEach((cb, k) => {
  if (!cb.played) return;
  const ed = phParse(cb.week); const cur = cb === CB_LIVE;
  const first = cur ? { at: phAt(ed, 20, 10 + (k % 40)), status: cbStatus(CB_DONE), open: (gs) => cbGo(gs, cb.id), now: { status: PH_LIVE, open: (gs) => cbGo(gs, cb.id) } }
    : { at: phAt(ed, 20, 10 + (k % 40), k % 3), status: cbStatus(cb), open: (gs) => cbGo(gs, cb.id) };
  const reps = (PH_HAND[cb.id] || []).map(([plus, h, m, label, kind, seq], r) => {
    const at = phAt(ed, h, m, plus); const id = cb.id + '-r' + r; const verdict = kind === 'bad' ? 'wrong' : 'right';
    const lies = Array.from(seq).filter((ch) => ch === 'B').length;
    CB_REPLAYS[id] = { ...cb, id, live: false, verdict, seq, turns: seq.length, lies, total: Math.max(cb.total, lies), rec: cbRecord(seq, cb.cast, verdict, k + r + 1), replayed: lbDate(at) };
    return { at, status: { kind: kind || 'ok', label }, open: (gs) => cbGo(gs, id) };
  });
  phEd('casebook', cb.id, cb.title, ed, [first].concat(reps), cur);
});
DV_ALL.forEach((s, i) => {
  if (!s.played) return;
  const ed = phParse(s.date); const cur = i === 0;
  const first = cur ? { at: phAt(ed, 18, 30), status: DV_END.won, open: phSess('delve'), now: { status: PH_LIVE, open: phSess('delve-live') } }
    : { at: phAt(ed, 18, 30, i % 3), status: DV_END[s.end], open: phSess(dvSid(s)) };
  const reps = (PH_HAND[s.id] || []).map(([plus, h, m, label, kind, extra], k) => { const at = phAt(ed, h, m, plus); return { at, status: { kind: kind || 'ok', label }, open: phSess(phClone(dvSid(s), k, at, label, kind, extra)) }; });
  phEd('delve', s.id, s.title, ed, [first].concat(reps), cur);
});
// No editions: each day is its own entry, and never a replay.
HG_DAYS.forEach((x, i) => {
  const d = phParse(x.date);
  phEd('hunter', x.id, x.title, d, [{ at: phAt(d, 9 + (i % 4), 15), status: hgStatus(x), open: phSess(hgSid(x)) }]);
});
const PH_ALL = PH_PLAYS.slice().sort((a, b) => b.at - a.at);
// Who sees what (free-and-pass, 2026-10-09). A player keeps History for everything they played.
// Free: the dailies and Escape in full, and the first edition of Casebook and Delve. Pass ended: those plus every play from before it ended.
const PH_FIRST = { casebook: CB_ALL[CB_ALL.length - 1].id, delve: DV_ALL[DV_ALL.length - 1].id };
const phVisible = (gs) => {
  const live = !lbWeekDone(gs);
  const all = PH_ALL.filter((p) => !(live && p.cur && p.again)).map((p) => (live && p.now ? { ...p, ...p.now } : p));
  if (gs.view === 'pass') return all;
  const lapsed = gsLapsed(gs);
  return all.filter((p) => { const g = GS_GAMES[p.gid]; if (p.cur) return g.free && !!gsTodayPlayed(gs)[p.gid];
    return g.free || (lapsed ? p.at < PH_ENDED : PH_FIRST[p.gid] === p.ed); });
};
// A record shows the time it was played; a replay also carries a Replay chip.
PH_PLAYS.forEach((p) => [p, p.now && { ...p, ...p.now }].filter(Boolean).forEach((q) => {
  let id = null; try { q.open({ go: (n, a) => { if (n === 'session' && a) id = a.id; } }); } catch (e) {}
  const s = id && GS_SESSIONS[id]; if (!s || s.__rp) return;
  s.__rp = true; s.date = pzLong(q.at) + ', ' + phTime(q.at); if (q.again) s.figures = [<span className="rp-fig">Replay</span>, ...(s.figures || [])];
}));
const phLib = (gs, id) => gs.go(GS_GAMES[id].route, { page: 'record' });

// ---- Parts ----
const PhCov = ({ gid }) => <span className="ph-cov" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART[GS_GAMES[gid].art] }} />;
const PhHead = () => <div className="gs-stack-sm"><h1 className="gs-h1">History</h1><p className="gs-muted">A replay doesn’t change your streak or your record.</p></div>;
const PhEmpty = () => {
  const gs = useGs();
  return <div className="gs-stack-md" style={{ justifyItems: 'start' }}><p>You haven’t played anything yet. Pick one and see what it does when you talk back.</p><DS.Button onClick={() => gs.go('games')}>Choose a game</DS.Button></div>;
};
// Numbered pages (the Editions page).
const PhPages = ({ pg, pages, go }) => (pages > 1 ? (
  <nav className="lb-pages" aria-label="Pages">
    {pg > 0 ? <button type="button" className="gs-iconbtn" aria-label="Previous page" onClick={() => go(pg - 1)}><DS.Icon name="back" /></button> : <span className="gs-iconbtn-space" />}
    <div className="lb-pagenums">{Array.from({ length: pages }, (_, x) => <button key={x} type="button" aria-current={x === pg ? 'page' : undefined} onClick={() => go(x)}>{x + 1}</button>)}</div>
    {pg < pages - 1 ? <button type="button" className="gs-iconbtn" aria-label="Next page" onClick={() => go(pg + 1)}><DS.Icon name="back" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
  </nav>
) : null);
const usePhList = (initial) => {
  const gs = useGs(); const all = phVisible(gs);
  const [g, setG0] = React.useState(initial && all.some((p) => p.gid === initial) ? initial : 'all'); const [pg, setPg] = React.useState(0);
  const games = GS_GAME_ORDER.filter((k) => all.some((p) => p.gid === k));
  const setG = (v) => { setG0(v); setPg(0); };
  const go = (x) => { setPg(x); gsScrollTop(); };
  const [sort, setSort0] = React.useState('new'); const setSort = (v) => { setSort0(v); setPg(0); };
  const shown = g === 'all' ? all : all.filter((p) => p.gid === g);
  return { all, g, setG, pg, go, games, sort, setSort, list: sort === 'old' ? [...shown].reverse() : shown };
};
const PhShow = ({ f }) => <LbChoice label="Show" value={f.g} opts={[['all', 'All games'], ...f.games.map((k) => [k, GS_GAMES[k].name])]} onPick={f.setG} />;

// ---- One play: edition (wraps), result, date or time, R for a replay ----
// v: { key, title, when, status, chip: 'again'|null, onOpen, gid? }. Columns come from the list (.rp-cols), so they line up row to row.
const RpSt = ({ s }) => <span className={'rp-st is-' + s.kind}><span className="rp-ico">{s.kind === 'ok' ? <DS.Icon name="check" size={14} /> : s.kind === 'bad' ? <DS.Icon name="error" size={14} /> : null}</span><span className="rp-sl">{s.short || s.label}</span></span>;
const RpRow = ({ v }) => {
  const on = !!v.onOpen; const T = on ? 'button' : 'div';
  return (
    <T className={'rp rp-one' + (on ? '' : ' is-off')} {...(on ? { type: 'button', onClick: v.onOpen } : {})}>
      {v.gid && <PhCov gid={v.gid} />}
      <span className="rp-a"><span className="rp-t">{v.title}</span></span>
      <span className="rp-c"><RpSt s={v.status} /></span>
      <span className="rp-d">{v.when}</span>
      <span className="rp-m">{v.chip === 'again' && <span className="rp-r" title="Replay" role="img" aria-label="Replay">R</span>}</span>
      {on ? <LbChev /> : <span className="lb-chev-space" />}
    </T>
  );
};
const rpSh = (gid, s) => { const c = PZ[gid] || {}; return { ...s, short: s.short || (s.kind === 'ok' ? c.short : s.kind === 'bad' ? c.badF : undefined) }; };
// A library row becomes one view per play of its edition, newest first.
const rpViews = (r, gs) => {
  const e = PH_EDS[r.key]; const title = r.title.replace(/^Daily [A-Za-z]+ (?=#)/, '');
  if (!e) return [{ key: r.key, title, when: r.date, status: r.status, chip: null, onOpen: r.onOpen }];
  return e.plays.map((p) => ({ key: p.pid, title, when: phShort(p.at), status: rpSh(e.gid, p.status), chip: p.again ? 'again' : null, onOpen: r.onOpen ? () => p.open(gs) : null })).reverse();
};

// ---- The library game page's plays card. "All…" opens History filtered to this game. ----
// On a phone: the latest four. Beside achievements: as many as fill the card to achievements' height.
// With no card beside it (.lb-lay.is-three), it is sized to its own content.
const LbRecent = ({ title, allLabel, rows, empty }) => {
  const gs = useGs(); const gid = gsGameOfRoute(gs.route.name);
  const card = React.useRef(null); const list = React.useRef(null); const probe = React.useRef(null);
  const [fit, setFit] = React.useState(null);
  const vs = React.useMemo(() => rows.flatMap((r) => rpViews(r, gs)), [rows, gs]);
  React.useLayoutEffect(() => {
    const el = card.current; if (!el || !vs.length) return undefined;
    const pair = el.previousElementSibling; const lay = el.parentElement;
    const reset = () => { el.style.height = ''; if (pair) pair.style.alignSelf = ''; setFit(null); };
    const measure = () => {
      const two = getComputedStyle(lay).gridTemplateColumns.split(' ').length > 1;
      if (!two || !pair || lay.classList.contains('is-three')) return reset();
      pair.style.alignSelf = 'start';
      el.style.height = pair.offsetHeight + 'px';
      const room = list.current ? el.clientHeight - list.current.offsetTop : 0;
      const hs = Array.from(probe.current.children).map((x) => x.offsetHeight);
      let k = 0; let sum = 0; while (k < hs.length && sum + hs[k] <= room + 1) { sum += hs[k]; k += 1; }
      // Never fewer than the phone's four: a short neighbour grows to match instead.
      if (k < Math.min(4, hs.length)) return reset();
      setFit(k);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(pair); ro.observe(lay);
    return () => ro.disconnect();
  }, [vs.length]);
  const shown = fit ? vs.slice(0, fit) : vs.slice(0, 4);
  const nor = vs.some((v) => v.chip === 'again') ? undefined : '1';
  return (
    <section ref={card} className={'lb-card lb-recentcard' + (fit ? ' is-fill' : '')}>
      <div className="lb-sechead"><h2 className="mcp-t-card">{title}</h2>{rows.length > 0 && <DS.TextLink onClick={() => gs.go('history', { game: gid, from: gid })}>{allLabel}</DS.TextLink>}</div>
      {vs.length ? <ul ref={list} className="lb-list lb-recent rp-cols" data-nor={nor} style={fit ? { gridTemplateRows: 'repeat(' + fit + ', minmax(0, 1fr))' } : null}>{shown.map((v) => <li key={v.key}><RpRow v={v} /></li>)}</ul> : <p className="gs-muted">{empty}</p>}
      {vs.length > 0 && <ul ref={probe} className="lb-list lb-probe rp-cols" data-nor={nor} aria-hidden="true">{vs.map((v) => <li key={v.key}><RpRow v={{ ...v, onOpen: null }} /></li>)}</ul>}
    </section>
  );
};

// Pager: numbers when they fit, "Page 3 of 9" when they don't (container query in the page CSS).
const RpPages = ({ pg, pages, go }) => (pages > 1 ? (
  <nav className="lb-pages rp-pg" aria-label="Pages">
    {pg > 0 ? <button type="button" className="gs-iconbtn" aria-label="Previous page" onClick={() => go(pg - 1)}><DS.Icon name="back" /></button> : <span className="gs-iconbtn-space" />}
    <div className="lb-pagenums rp-pg-nums">{Array.from({ length: pages }, (_, x) => <button key={x} type="button" aria-current={x === pg ? 'page' : undefined} onClick={() => go(x)}>{x + 1}</button>)}</div>
    <span className="rp-pg-of gs-strong gs-num-text">{'Page ' + (pg + 1) + ' of ' + pages}</span>
    {pg < pages - 1 ? <button type="button" className="gs-iconbtn" aria-label="Next page" onClick={() => go(pg + 1)}><DS.Icon name="back" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
  </nav>
) : null);

// History: every play under its day, newest first, with the replay filter. Filtered to a game when "All…" opens it.
const GsHistory = () => {
  const gs = useGs(); const r = gs.route; const f = usePhList(r.game);
  const [rep, setRep] = React.useState('all'); const [rhy, setRhy] = React.useState(r.rhythm || 'all');
  const wait = useGsPart([f.sort, rep, rhy, f.g, f.pg]);
  const list = f.list.filter((x) => (rep === 'all' || (rep === 'again') === x.again) && (rhy === 'all' || gsRhythm(x.gid) === rhy));
  const size = 24; const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(f.pg, pages - 1);
  const groups = [];
  list.slice(pg * size, pg * size + size).forEach((p) => { const k = phDayKey(p.at); const last = groups[groups.length - 1]; if (last && last[0] === k) last[2].push(p); else groups.push([k, phDayLabel(p.at), [p]]); });
  const name = (p) => (p.edTitle.includes(GS_GAMES[p.gid].name) || f.g !== 'all' ? p.edTitle : GS_GAMES[p.gid].name + ' · ' + p.edTitle);
  const view = (p) => ({ key: p.pid, gid: p.gid, title: name(p), when: phTime(p.at), status: rpSh(p.gid, p.status), chip: p.again ? 'again' : null, onOpen: () => p.open(gs) });
  return (
    <main className="gs-wrap gs-main">
      {r.from && <LbBack label={GS_GAMES[r.from].name} onClick={() => phLib(gs, r.from)} />}
      <PhHead />
      {!f.all.length ? <PhEmpty /> : (
        <div className="lb-alllay">
          <aside className="lb-tools">
            <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} />
            <LbChoice label="Plays" value={rep} opts={[['all', 'All plays'], ['first', 'First plays'], ['again', 'Replays']]} onPick={(v) => { setRep(v); f.go(0); }} />
            <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={(v) => { setRhy(v); f.go(0); }} />
            <PhShow f={f} />
          </aside>
          <div className="lb-box lb-results">
            {wait ? <GsPart label="Loading plays" /> : <>{groups.length ? groups.map(([k, label, ps]) => (
              <React.Fragment key={k + pg}>
                <h2 className="ph-day">{label}</h2>
                <ul className="ph-list rp-cols is-cov">{ps.map((p) => <li key={p.pid}><RpRow v={view(p)} /></li>)}</ul>
              </React.Fragment>
            )) : <p className="lb-empty gs-muted">No plays match that.</p>}
            <RpPages pg={pg} pages={pages} go={f.go} /></>}
          </div>
        </div>
      )}
    </main>
  );
};

Object.assign(window, { GsHistory, LbRecent, PhPages, CB_REPLAYS, PH_EDS });
