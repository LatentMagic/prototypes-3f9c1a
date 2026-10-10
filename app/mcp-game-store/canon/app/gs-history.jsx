// ============================================================================
// [Platform] — History (every play under its day, or every edition; search and filters), the play rows, the edition helpers, and the library game page's plays card (LbRecent).
// History is the one list of what a player has played and could have (docs/specs/history-only/). There is no Editions page.
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

// ---- Editions (moved here from the removed Editions page module, 2026-10-10) ----
const ED_GAMES = ['word', 'groups', 'mystery', 'escape', 'casebook', 'delve'];
const edName = (e) => '#' + e.n + (e.title ? ' · ' + e.title : '');
// Every edition of a game, newest first: { key, gid, n, title, date, month, free, now, status, open }
// Results agree with the library game page: this edition from lbNow; a free player has played the first edition; a lapsed one, everything played before the Pass ended.
const ED_NONE = { kind: 'none', label: 'Not played' };
const edList = (gs, gid) => {
  const pass = gs.view === 'pass'; const signed = gs.view !== 'out'; const now = signed ? lbNow(gs, gid) : null;
  if (PZ[gid]) {
    const c = PZ[gid];
    return c.all.map((x) => ({ key: x.id, gid, n: c.weekly ? c.all.length - x.i : +c.no(x.i).split('#')[1], title: c.weekly ? x.title : null, date: x.date, month: x.month, free: true, now: x.i === 0,
      status: !signed ? null : x.i === 0 ? (now ? now.status : ED_NONE) : pzStatus(c, x),
      open: !signed ? null : x.i === 0 ? (now ? now.open : null) : x.sid ? () => gs.go('session', { id: x.sid }) : null }));
  }
  const all = gid === 'casebook' ? CB_ALL : DV_ALL; const first = all[all.length - 1]; const lapsed = gsLapsed(gs);
  const mine = (x) => x.played && (pass || x === first || (lapsed && lbOld(x.week || x.date)));
  return all.map((x, i) => {
    const played = i === 0 ? !!now : signed && mine(x);
    const st = !signed ? null : i === 0 ? (now ? now.status : ED_NONE) : played ? (gid === 'casebook' ? cbStatus(x) : dvStatus(x)) : ED_NONE;
    return { key: x.id, gid, n: all.length - i, title: x.title, date: x.week || x.date, month: x.month, free: x === first, now: i === 0, status: st,
      open: !played ? null : i === 0 ? now.open : () => (gid === 'casebook' ? cbGo(gs, x.id) : gs.go('session', { id: dvSid(x) })) };
  });
};
// Whether an edition can be played at all (GS_EARLIER_CLOSED), and whether this player needs the Pass for it. Shown on the session page only.
const edClosed = (e) => !e.now && GS_EARLIER_CLOSED.includes(e.gid);
const edNeedsPass = (gs, e) => gs.view !== 'pass' && !edClosed(e) && (GS_GAMES[e.gid].free ? !e.now : !e.free);
// Search: a row is found by its name and number as written ("Daily Groups #84", "groups 84", "Casebook #45"), its title, and its date.
// Every word typed must start a word of the row; a number must be a whole number (84 finds #84, not #184).
// A keyboard apostrophe matches the curly one. A query naming a month is a date and matches as before (substring).
const phNorm = (q) => (q || '').trim().toLowerCase().replace(/^#/, '');
const phWords = (s) => s.toLowerCase().replace(/[’'‘]/g, '').split(/[^a-z0-9]+/).filter(Boolean);
const phIsDate = (s) => phWords(s).some((w) => w.length >= 3 && PH_MON.some((m) => m.toLowerCase().startsWith(w)));
const phMatch = (hay, s) => {
  if (!s) return true;
  hay = hay.toLowerCase();
  if (phIsDate(s)) return new RegExp('(^|[^0-9a-z])' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(hay);
  const hw = phWords(hay);
  return phWords(s).every((w) => (/^\d+$/.test(w) ? hw.includes(w) : hw.some((h) => h.startsWith(w))));
};
let PH_META = null;
const phMeta = () => { if (!PH_META) { PH_META = {}; ED_GAMES.forEach((k) => edList({ view: 'out', sub: {} }, k).forEach((e) => { PH_META[e.key] = e; })); } return PH_META; };
// A date finds the plays under that date's heading: on Played, the day it was played; on Every edition, the day the edition came out (d).
const phHay = (gid, ed, title, d) => { const m = phMeta()[ed];
  return [GS_GAMES[gid].name, title || '', m ? m.n + ' ' + (m.title || '') : '', d ? lbDate(d) + ' ' + PH_MON[d.getMonth()] : ''].join(' ').toLowerCase(); };

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
 
  c0928: [[5, 21, 0, 'Solved', 'ok', 'FQBNFBQFB'], [7, 9, 30, 'Unsolved', 'bad', 'QFNQBFHQNFQBNQ']],
  dv1: [[2, 19, 45, 'Hero fell', 'bad', { figures: ['Threat 4/6', '7 rolls', 'HP 0/12'], tracks: { progress: 2, threat: 4 }, reached: 'Caught', lines: GS_ROLLS.slice(0, 7), share: 'Hero fell · threat 4/6 · 7 rolls' }]],
};
const PH_REPLAY = { word: (k) => 'Solved in ' + (2 + (k % 2)) + ' of 6', groups: () => 'All 4 groups, no mistakes', mystery: () => 'Solved', escape: (k) => 'Escaped in ' + (5 + (k % 2)) + ' moves' };
const PH_LIVE_SID = { word: 'word-live', groups: 'groups-live', mystery: 'mystery-live', escape: 'escape-live' };
Object.entries(PZ).forEach(([id, c]) => c.all.forEach((x) => {
  if (!x.played) return;
  const cur = x.i === 0; const sid = cur ? c.today : x.sid;
  let first;
  if (cur) { const s = GS_SESSIONS[c.today]; first = { at: phAt(PH_TODAY, 8 + c.salt, 5 + c.salt * 11), status: { kind: s.loss ? 'bad' : 'ok', label: s.result }, now: { status: PH_LIVE, open: phSess(PH_LIVE_SID[id]) } }; }
  else first = { at: phAt(x.d, 7 + ((x.i * 5 + c.salt * 3) % 15), (x.i * 17 + c.salt * 7) % 60, c.weekly ? x.i % 4 : 0), status: { kind: x.ok ? 'ok' : 'bad', label: x.line } };
  first.open = phSess(sid);
  const reps = PH_HAND[x.id] || (x.i > 0 && !GS_EARLIER_CLOSED.includes(id) && (x.i * 7 + c.salt * 3) % 11 === 0 ? [[x.i % 2, 21, 10]] : []);
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
// State library-word-streak-broken (Config-less: review.broken): yesterday's Daily Word was finished in a first play that
// failed, then completed in a replay. History shows those two plays in place of the log's seeded ones, as the game page does.
const PH_BROKEN = (() => {
  const e = PH_EDS.word1; if (!e) return [];
  const f = e.plays[0]; const c = PZ.word;
  return [{ ...f, pid: 'word1-broken-0', status: { kind: 'bad', label: c.bad }, open: phSess('word-broken-first'), again: false },
    { ...f, pid: 'word1-broken-1', n: 1, at: phAt(f.at, 21, 40), status: { kind: 'ok', label: c.ok(1) }, open: phSess('word-broken-replay'), again: true }];
})();
const phLog = (gs) => (gs.review && gs.review.broken ? PH_ALL.filter((p) => p.ed !== 'word1').concat(PH_BROKEN).sort((a, b) => b.at - a.at) : PH_ALL);
// Who sees what (free-and-pass, 2026-10-09). A player keeps History for everything they played.
// Free: the dailies and Escape in full, and the first edition of Casebook and Delve. Pass ended: those plus every play from before it ended.
const PH_FIRST = { casebook: CB_ALL[CB_ALL.length - 1].id, delve: DV_ALL[DV_ALL.length - 1].id };
const phVisible = (gs) => {
  const live = !lbWeekDone(gs);
  const all = phLog(gs).filter((p) => !(live && p.cur && p.again)).map((p) => (live && p.now ? { ...p, ...p.now } : p));
  if (gs.view === 'pass') return all;
  const lapsed = gsLapsed(gs);
  return all.filter((p) => { const g = GS_GAMES[p.gid]; if (p.cur) return g.free && !!gsTodayPlayed(gs)[p.gid];
    return g.free || (lapsed ? p.at < PH_ENDED : PH_FIRST[p.gid] === p.ed); });
};
// A record shows the time it was played; a replay also carries a Replay chip.
PH_PLAYS.forEach((p) => [p, p.now && { ...p, ...p.now }].filter(Boolean).forEach((q) => {
  let id = null; try { q.open({ go: (n, a) => { if (n === 'session' && a) id = a.id; } }); } catch (e) {}
  const s = id && GS_SESSIONS[id]; if (!s || s.__rp) return;
  s.__rp = true; s.date = pzLong(q.at) + ', ' + phTime(q.at); if (q.again) { s.again = true; s.figures = [<span className="rp-fig">Replay</span>, ...(s.figures || [])]; }
}));
const phLib = (gs, id) => gs.go(GS_GAMES[id].route, { page: 'record' });

// ---- Parts ----
const PhCov = ({ gid }) => <span className="ph-cov" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART[GS_GAMES[gid].art] }} />;
const PhHead = ({ title }) => <div className="gs-stack-sm"><h1 className="gs-h1">{title || 'History'}</h1><p className="gs-muted">A replay doesn’t change your streak or your record.</p></div>;
const PhEmpty = () => {
  const gs = useGs();
  return <div className="gs-stack-md" style={{ justifyItems: 'start' }}><p>You haven’t played anything yet. Pick one and see what it does when you talk back.</p><DS.Button onClick={() => gs.go('games')}>Choose a game</DS.Button></div>;
};
const usePhList = (initial, k0) => {
  const gs = useGs(); const all = phVisible(gs); k0 = k0 || {};
  const [g, setG0] = React.useState(initial && (all.some((p) => p.gid === initial) || ED_GAMES.includes(initial)) ? initial : 'all'); const [pg, setPg] = React.useState(k0.pg || 0);
  const games = GS_GAME_ORDER.filter((k) => all.some((p) => p.gid === k));
  const setG = (v) => { setG0(v); setPg(0); };
  const go = (x) => { setPg(x); gsScrollTop(); };
  const [sort, setSort0] = React.useState(k0.sort || 'new'); const setSort = (v) => { setSort0(v); setPg(0); };
  const shown = g === 'all' ? all : all.filter((p) => p.gid === g);
  return { all, g, setG, pg, go, games, sort, setSort, list: sort === 'old' ? [...shown].reverse() : shown };
};
const PhShow = ({ f, games }) => <LbChoice label="Game" value={f.g} opts={[['all', 'All games'], ...games.map((k) => [k, GS_GAMES[k].name])]} onPick={f.setG} />;

// ---- Every edition: each once, played or missed, with its plays (first play first) ----
// A game with no editions (36,000 Summers Ago) adds its days as they were played: for it, every edition is what you played.
const phEds = (gs, g, visible) => {
  const by = {}; visible.forEach((p) => { (by[p.ed] = by[p.ed] || []).push(p); });
  return (g === 'all' ? GS_GAME_ORDER : [g]).flatMap((k) => {
    if (!ED_GAMES.includes(k)) return visible.filter((p) => p.gid === k).map((p) => ({ key: p.ed, gid: k, title: p.edTitle, at: p.edDate, now: false, plays: [p] }));
    return edList(gs, k).map((e) => ({ ...e, at: phParse(e.date), plays: (by[e.key] || []).slice().sort((a, b) => a.n - b.n) }));
  }).map((e) => ({ ...e, status: e.plays.length ? rpSh(e.gid, e.plays[0].status) : ED_NONE }));
};
const PhSt = ({ s }) => <span className={'lb-st is-' + s.kind}>{s.kind === 'ok' ? <DS.Icon name="check" size={14} /> : s.kind === 'bad' ? <DS.Icon name="error" size={14} /> : null}{s.short || s.label}</span>;

// ---- One play: edition (wraps), result, date or time, R for a replay ----
// v: { key, title, when, status, chip: 'again'|null, onOpen, gid? }. Columns come from the list (.rp-cols), so they line up row to row.
const RpSt = ({ s }) => <span className={'rp-st is-' + s.kind}><span className="rp-ico">{s.kind === 'ok' ? <DS.Icon name="check" size={14} /> : s.kind === 'bad' ? <DS.Icon name="error" size={14} /> : null}</span><span className="rp-sl">{s.short || s.label}</span></span>;
// An edition number leads its game's name: "#212 Daily Word", the number at text weight.
const rpNum = (t) => { if (typeof t !== 'string') return t; const m = t.match(/^(.*?)\s(#\d+)$/); return m ? <><span className="rp-n">{m[2]}</span> {m[1]}</> : t; };
const RpRow = ({ v }) => {
  const on = !!v.onOpen; const T = on ? 'button' : 'div';
  return (
    <T className={'rp rp-one' + (on ? '' : ' is-off')} {...(on ? { type: 'button', onClick: v.onOpen } : {})}>
      {v.gid && <PhCov gid={v.gid} />}
      <span className="rp-a"><span className="rp-t">{rpNum(v.title)}</span></span>
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
  // A row that carries its own play (r.own: staged states) is shown as it is.
  if (!e || r.own) return [{ key: r.key, title, when: r.date, status: r.status, chip: r.chip || null, onOpen: r.onOpen }];
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

// History. Played (the default): every play under the day it was played. Every edition: each edition once under the day it came out,
// played or missed, its replays beneath it. Filtered to a game when "All…" opens it. Every row opens a session page:
// a play its record, a missed edition the session page's empty state (route session { gid, ed }). No Pass mark on any row or filter.
const GsHistory = () => {
  // r.keep: the list as the player left it, written into this history entry so browser Back returns it.
  const gs = useGs(); const r = gs.route; const k0 = r.keep || {}; const f = usePhList(k0.g || r.game, k0);
  const [rep, setRep] = React.useState(k0.rep || 'all'); const [rhy, setRhy] = React.useState(k0.rhy || r.rhythm || 'all'); const [cat, setCat] = React.useState(k0.cat || r.kind || 'all');
  const [mode, setMode] = React.useState(k0.mode || (r.show === 'all' ? 'all' : 'played')); const [q, setQ] = React.useState(k0.q != null ? k0.q : r.q || '');
  React.useEffect(() => { gs.keep({ keep: { g: f.g, pg: f.pg, sort: f.sort, rep, rhy, cat, mode, q } }); }, [f.g, f.pg, f.sort, rep, rhy, cat, mode, q]);
  const wait = useGsPart([f.sort, rep, rhy, cat, f.g, f.pg, mode, q]);
  const one = f.g !== 'all';
  // The switch shows only where it changes something: a game with no editions lists what you played either way.
  const hasEds = !one || ED_GAMES.includes(f.g); const every = hasEds && mode === 'all';
  const s = phNorm(q); const okRhy = (gid) => (rhy === 'all' || gsRhythm(gid) === rhy) && (cat === 'all' || GS_GAMES[gid].category === cat);
  const name = (p) => (p.edTitle.includes(GS_GAMES[p.gid].name) || one ? p.edTitle : GS_GAMES[p.gid].name + ' · ' + p.edTitle);
  const edTitle = (e) => (!ED_GAMES.includes(e.gid) ? (one ? e.title : GS_GAMES[e.gid].name + ' · ' + e.title) : one ? edName(e) : GS_GAMES[e.gid].name + ' ' + edName(e));
  let items;
  if (every) {
    items = phEds(gs, f.g, f.all).filter((e) => okRhy(e.gid) && (rep !== 'again' || e.plays.some((p) => p.again)) && (!s || phMatch(phHay(e.gid, e.key, e.title, e.at) + ' ' + edTitle(e), s)));
    items.sort((a, b) => b.at - a.at || GS_GAME_ORDER.indexOf(a.gid) - GS_GAME_ORDER.indexOf(b.gid));
    if (f.sort === 'old') items.reverse();
  } else items = f.list.filter((x) => (rep === 'all' || (rep === 'again') === x.again) && okRhy(x.gid) && (!s || phMatch(phHay(x.gid, x.ed, x.edTitle, x.at) + ' ' + name(x), s)));
  const size = 24; const pages = Math.max(1, Math.ceil(items.length / size)); const pg = Math.min(f.pg, pages - 1);
  const groups = [];
  items.slice(pg * size, pg * size + size).forEach((p) => { const k = phDayKey(p.at); const last = groups[groups.length - 1]; if (last && last[0] === k) last[2].push(p); else groups.push([k, phDayLabel(p.at), [p]]); });
  const view = (p) => ({ key: p.pid, gid: p.gid, title: name(p), when: phTime(p.at), status: rpSh(p.gid, p.status), chip: p.again ? 'again' : null, onOpen: () => p.open(gs) });
  const openEd = (e) => (e.plays.length ? e.plays[0].open(gs) : gs.go('session', { gid: e.gid, ed: e.key }));
  const repView = (e, p) => ({ key: p.pid, title: pzLong(p.at), when: phTime(p.at), status: rpSh(e.gid, p.status), chip: 'again', onOpen: () => p.open(gs) });
  const games = every ? GS_GAME_ORDER.filter((k) => ED_GAMES.includes(k) || f.all.some((p) => p.gid === k)) : GS_GAME_ORDER.filter((k) => k === f.g || f.games.includes(k));
  const reset = (fn) => (v) => { fn(v); f.go(0); };
  return (
    <main className="gs-wrap gs-main">
      {r.from && <LbBack label={GS_GAMES[r.from].name} onClick={() => phLib(gs, r.from)} />}
      <PhHead title={every && one ? 'All ' + GS_GAMES[f.g].ed[1] : null} />
      {!f.all.length ? <PhEmpty /> : (
        <div className="lb-alllay">
          <window.LbTools>
            <DS.SearchField label="Search" placeholder="A number, name or date" value={q} onChange={(e) => reset(setQ)(e.target.value)} />
            {hasEds && <LbChoice label="List" value={mode} opts={[['played', 'Played'], ['all', one ? 'All ' + GS_GAMES[f.g].ed[1] : 'All']]} onPick={reset(setMode)} />}
            <LbChoice label="Genre" value={cat} opts={[['all', 'All games'], ...GS_KINDS.map((c) => [c, gsKind(c)])]} onPick={reset(setCat)} />
            <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={reset(setRhy)} />
            <LbChoice label="Game" value={f.g} opts={[['all', 'All games'], ...games.map((k) => [k, GS_GAMES[k].name])]} onPick={f.setG} />
            <LbChoice label="Plays" value={rep} opts={[['all', 'All plays'], ['first', 'First plays'], ['again', 'Replays']]} onPick={reset(setRep)} />
            <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} />
          </window.LbTools>
          <div className="lb-box lb-results">
            {wait ? <GsPart label={every ? 'Loading' : 'Loading plays'} /> : <>{groups.length ? groups.map(([k, label, ps]) => (
              <React.Fragment key={k + pg}>
                <h2 className="ph-day">{label}</h2>
                {every ? <ul className={'lb-list ph-eds' + (one ? ' is-one' : '')}>{ps.map((e) => {
                  const reps = rep === 'first' ? [] : e.plays.filter((p) => p.again);
                  return (
                    <React.Fragment key={e.gid + e.key}>
                      <li><button type="button" className={'ed-row' + (one ? '' : ' ph-edcov')} onClick={() => openEd(e)}>
                        {!one && <PhCov gid={e.gid} />}
                        <span className="ed-t">{rpNum(edTitle(e))}</span>
                        <span className="ed-slots is-one"><span className="ed-slot">{e.now && <DS.Tag kind="daily">Latest</DS.Tag>}</span></span>
                        <span className="ed-r"><PhSt s={e.status} /></span>
                        <LbChev />
                      </button></li>
                      {reps.length > 0 && <li className="ph-rep-wrap"><ul className="lb-list rp-cols ph-reps">{reps.map((p) => <li key={p.pid}><RpRow v={repView(e, p)} /></li>)}</ul></li>}
                    </React.Fragment>
                  );
                })}</ul>
                  : <ul className="ph-list rp-cols is-cov">{ps.map((p) => <li key={p.pid}><RpRow v={view(p)} /></li>)}</ul>}
              </React.Fragment>
            )) : <p className="lb-empty gs-muted">{s ? 'Nothing matches that. Try a name, a number or a date.' : every ? 'Nothing matches that.' : 'No plays match that.'}</p>}
            <RpPages pg={pg} pages={pages} go={f.go} /></>}
          </div>
        </div>
      )}
    </main>
  );
};

Object.assign(window, { GsHistory, LbRecent, CB_REPLAYS, PH_EDS, ED_GAMES, edList, edName, edClosed, edNeedsPass, ED_NONE });
