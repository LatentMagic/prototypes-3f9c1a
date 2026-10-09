// ============================================================================
// [Platform] — History (every play under its day, replay filter) and the play rows with the Replay marker.
// Ported from docs/specs/history/playground/ (pg-history.jsx, pg-replays.jsx), option 1 of each. Loads after every library module.
// Overrides GsHistory, LbRecent and GsSession on window. Seed: one play log built from the library pages' own seeds, plus replays.
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
const phMonday = (d) => { const x = phDay0(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const phWeekLabel = (d) => { const w = Math.round((phMonday(PH_TODAY) - phMonday(d)) / (7 * 864e5)); return w === 0 ? 'This week' : w === 1 ? 'Last week' : 'Week of ' + lbDate(phMonday(d)); };

// ---- The play log. An edition holds its plays, first (the one that counts) first. ----
const PH_EDS = {}; const PH_PLAYS = [];
const phEd = (gid, ed, edTitle, edDate, plays) => {
  const e = { gid, ed, edTitle, edDate, plays: plays.map((p, n) => ({ ...p, gid, ed, edTitle, edDate, n, again: n > 0, pid: ed + '-' + n })) };
  PH_EDS[ed] = e; PH_PLAYS.push(...e.plays);
};
const phSess = (id) => (gs) => gs.go('session', { id });
const phClone = (sid, k, at, label, extra) => { const id = sid + '-r' + k; GS_SESSIONS[id] = { ...GS_SESSIONS[sid], result: label, loss: false, date: pzLong(at), ...(extra || {}) }; return id; };
// Replays seeded by hand: [days after the first play, hour, minute, result, kind, session extra]
const PH_HAND = {
  word0: [[0, 12, 40, 'Solved in 1 of 6', 'ok', { lines: [['Guess 1', 'TORCH', 'Solved']] }], [0, 21, 15, 'Solved in 2 of 6', 'ok', { lines: [['Guess 1', 'SLATE', 'T is in the word'], ['Guess 2', 'TORCH', 'Solved']] }]],
  escape0: [[0, 19, 30, 'Escaped in 5 moves']], escape2: [[2, 20, 0, 'Escaped in 6 moves']],
  groups1: [[1, 7, 50, 'All 4 groups, no mistakes']], mystery2: [[0, 22, 5, 'Case closed']],
  c0928: [[5, 21, 0, 'Solved'], [7, 9, 30, 'Unsolved', 'bad']], dv1: [[2, 19, 45, 'Hero fell', 'bad']],
};
const PH_REPLAY = { word: (k) => 'Solved in ' + (2 + (k % 2)) + ' of 6', groups: () => 'All 4 groups, no mistakes', mystery: () => 'Case closed', escape: (k) => 'Escaped in ' + (5 + (k % 2)) + ' moves' };
Object.entries(PZ).forEach(([id, c]) => c.all.forEach((x) => {
  if (!x.played) return;
  const sid = x.i === 0 ? c.today : x.sid;
  let first;
  if (x.i === 0) { const s = GS_SESSIONS[c.today]; first = { at: phAt(PH_TODAY, 8 + c.salt, 5 + c.salt * 11), status: { kind: s.loss ? 'bad' : 'ok', label: s.result } }; }
  else first = { at: phAt(x.d, 7 + ((x.i * 5 + c.salt * 3) % 15), (x.i * 17 + c.salt * 7) % 60, c.weekly ? x.i % 4 : 0), status: { kind: x.ok ? 'ok' : 'bad', label: x.line } };
  first.open = phSess(sid);
  const reps = PH_HAND[x.id] || (x.i > 0 && (x.i * 7 + c.salt * 3) % 11 === 0 ? [[x.i % 2, 21, 10]] : []);
  const plays = [first].concat(reps.map(([plus, h, m, label, kind, extra], k) => {
    const at = phAt(first.at, h, m, plus); const lab = label || PH_REPLAY[id](x.i + k);
    return { at, status: { kind: kind || 'ok', label: lab }, open: phSess(phClone(sid, k, at, lab, extra)) };
  }));
  phEd(id, x.id, x.title, x.d, plays);
}));
CB_ALL.forEach((cb, k) => {
  if (!cb.played) return;
  const ed = phParse(cb.week);
  const first = { at: phAt(ed, 20, 10 + (k % 40), cb.live ? 0 : k % 3), status: cb.live ? { kind: 'live', label: 'In progress' } : cb.verdict === 'right' ? { kind: 'ok', label: 'Solved' } : { kind: 'bad', label: 'Unsolved' },
    open: cb.live ? (gs) => cbGo(gs) : (gs) => cbGo(gs, cb.id) };
  phEd('casebook', cb.id, cb.title, ed, [first].concat((PH_HAND[cb.id] || []).map(([plus, h, m, label, kind]) => ({ at: phAt(ed, h, m, plus), status: { kind: kind || 'ok', label }, open: (gs) => cbGo(gs, cb.id) }))));
});
DV_ALL.forEach((s, i) => {
  if (!s.played) return;
  const ed = phParse(s.date); const live = !s.end;
  const first = { at: phAt(ed, 18, 30, live ? 0 : i % 3), status: live ? { kind: 'live', label: 'In progress' } : DV_END[s.end], open: live ? (gs) => dvGo(gs) : phSess('delve') };
  phEd('delve', s.id, s.title, ed, [first].concat((PH_HAND[s.id] || []).map(([plus, h, m, label, kind]) => ({ at: phAt(ed, h, m, plus), status: { kind: kind || 'ok', label }, open: phSess('delve') }))));
});
// No editions: each day is its own entry, and never a replay.
HG_DAYS.forEach((x, i) => {
  const d = phParse(x.date);
  phEd('hunter', x.id, x.title, d, [{ at: phAt(d, 9 + (i % 4), 15), status: x.restarted ? { kind: 'none', label: 'Restarted' } : { kind: 'ok', label: 'Finished' }, open: phSess('hunter') }]);
});
const PH_ALL = PH_PLAYS.slice().sort((a, b) => b.at - a.at);
// Who sees what: what History does today (free: the free games; Pass ended: plus Pass-game plays from before it ended).
const phVisible = (gs) => {
  if (gs.view === 'pass') return PH_ALL;
  const today = Object.keys(GS_TODAY_PLAYED[gs.view] || {}); const lapsed = gsLapsed(gs);
  return PH_ALL.filter((p) => { const g = GS_GAMES[p.gid]; if (p.at >= PH_TODAY) return g.free && today.includes(p.gid); return g.free || (lapsed && p.at < PH_ENDED); });
};
const phLib = (gs, id, sid) => gs.go(GS_GAMES[id].route, sid ? { page: 'record', sid } : { page: 'record' });
const PH_ALL_LABEL = { word: 'All words', groups: 'All groups', mystery: 'All cases', escape: 'All rooms', casebook: 'All cases', delve: 'All scenes', hunter: 'All days' };

// ---- Parts ----
const PhCov = ({ gid }) => <span className="ph-cov" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GS_ART[GS_GAMES[gid].art] }} />;
const PhMeta = ({ items }) => <span className="ph-m">{items.filter(Boolean).map((t, i) => (t === 'Replay' ? <b key={i} className="ph-again">Replay</b> : <span key={i}>{t}</span>))}</span>;
// One play. when: 'time' (under a day heading) or 'date'.
const PhPlayRow = ({ p, showGame, when }) => {
  const gs = useGs();
  const at = when === 'time' ? phTime(p.at) : phShort(p.at) + ', ' + phTime(p.at);
  return (
    <button type="button" className="ph-row" onClick={() => p.open(gs)}>
      <PhCov gid={p.gid} />
      <span className="ph-tx"><span className="ph-t">{showGame ? GS_GAMES[p.gid].name : p.edTitle}</span><PhMeta items={[showGame && p.edTitle, at, p.again && 'Replay']} /></span>
      <span className="ph-res"><LbStatus s={p.status} /></span>
      <LbChev />
    </button>
  );
};
// A replay tucked under its edition (option 2).
const PhSub = ({ p, inert }) => {
  const gs = useGs();
  const cells = <><span className="ph-rail" aria-hidden="true" /><span className="ph-tx"><PhMeta items={['Replay', phShort(p.at) + ', ' + phTime(p.at)]} /></span><span className="ph-res"><LbStatus s={p.status} /></span></>;
  return inert ? <div className="ph-row is-sub">{cells}<span className="lb-chev-space" /></div>
    : <button type="button" className="ph-row is-sub" onClick={() => p.open(gs)}>{cells}<LbChev /></button>;
};
const PhSubs = ({ plays, lib, inert }) => (plays.length ? <ul className={'ph-subs' + (lib ? ' is-lib' : '')}>{plays.map((p) => <li key={p.pid}><PhSub p={p} inert={inert} /></li>)}</ul> : null);
const PhHead = () => <div className="gs-stack-sm"><h1 className="gs-h1">History</h1><p className="gs-muted">A replay doesn’t change your streak or your record.</p></div>;
const PhEmpty = () => {
  const gs = useGs();
  return <div className="gs-stack-md" style={{ justifyItems: 'start' }}><p>You haven’t played anything yet. Pick one and see what it does when you talk back.</p><DS.Button onClick={() => gs.go('games')}>Choose a game</DS.Button></div>;
};
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
const PhPage = ({ children }) => <main className="gs-wrap gs-main">{children}</main>;


const rp = { opt: '2' };
const useRp = () => rp;

const RP_FALLBACK = window.LbRow;
// The record page: every play shows its date and time of completion; a replay also carries a Replay chip in the stats row.
(() => { const seen = {}; PH_PLAYS.forEach((p) => { try { p.open({ go: (n, a) => { if (n === 'session' && a && a.id && !seen[a.id]) seen[a.id] = p; } }); } catch (e) {} });
  Object.entries(seen).forEach(([id, p]) => { const s = GS_SESSIONS[id]; if (!s || s.__rp) return; s.__rp = true; s.date = s.date + ', ' + phTime(p.at); if (p.again) s.figures = [<span className="rp-fig">Replay</span>, ...(s.figures || [])]; }); })();
const RpSt = ({ s, full }) => <span className={'rp-st is-' + s.kind}><span className="rp-ico">{s.kind === 'ok' ? <DS.Icon name="check" size={14} /> : s.kind === 'bad' ? <DS.Icon name="error" size={14} /> : null}</span><span className="rp-sl">{s.short || s.label}</span></span>;

// One play. Three ways to lay out the card (options). The timestamp is gone: a play shows its date, or nothing where a day heading already says it.
// v: { key, title, when, status, chip: 'again'|'first'|null, sub, onOpen, gid? }
const RpRow = ({ v, o, two }) => {
  const on = !!v.onOpen; const T = on ? 'button' : 'div'; const again = v.chip === 'again';
  const R = again ? <span className="rp-r" title="Replay" role="img" aria-label="Replay">R</span> : null;
  const mode = two ? 'two' : o === '2' ? 'one' : o === '3' && v.sub ? 'sub' : 'two';
  const cls = 'rp rp-' + mode + (v.gid ? ' has-cov' : '') + (on ? '' : ' is-off');
  const props = on ? { type: 'button', onClick: v.onOpen } : {};
  const tail = on ? <LbChev /> : <span className="lb-chev-space" />;
  if (mode === 'sub') return <T className={cls} {...props}><span className="rp-g">{R}</span><span className="rp-c"><RpSt s={v.status} full={mode !== 'one'} /></span><span className="rp-d">{v.when}</span>{tail}</T>;
  return (
    <T className={cls} {...props}>
      {v.gid && <PhCov gid={v.gid} />}
      <span className="rp-a"><span className="rp-t" title={v.title}>{v.title}</span></span>
      <span className="rp-c"><RpSt s={v.status} full={mode !== 'one'} /></span>
      {(mode === 'one' || mode === 'two') && <span className="rp-d">{v.when}</span>}
      <span className="rp-m">{o !== '3' && R}</span>
      {tail}
    </T>
  );
};
const rpSh = (gid, s) => { const c = PZ[gid] || {}; return { ...s, short: s.short || (s.kind === 'ok' ? c.short : s.kind === 'bad' ? c.badF : undefined) }; };
const rpViews = (r, gs, o) => {
  const e = PH_EDS[r.key];
  if (!e) return [{ key: r.key, title: r.title.replace(/^Daily [A-Za-z]+ (?=#)/, ''), when: r.date, status: r.status, chip: null, onOpen: r.onOpen }];
  const c = PZ[e.gid] || {}; const sh = (s) => ({ ...s, short: s.short || (s.kind === 'ok' ? c.short : s.kind === 'bad' ? c.badF : undefined) });
  const vs = e.plays.map((p) => ({ key: p.pid, title: r.title.replace(/^Daily [A-Za-z]+ (?=#)/, ''), when: phShort(p.at), status: sh(p.status), chip: p.again ? 'again' : 'first', sub: p.again, onOpen: r.onOpen ? () => p.open(gs) : null }));
  return o === '3' ? [vs[0], ...vs.slice(1).reverse()] : vs.slice().reverse();
};
const rpLimit = (arr, n) => { let k = 0; const out = []; for (const v of arr) { if (!v.sub && k === n) break; if (!v.sub) k += 1; out.push(v); } return out; };

// The library game card (copy of LbRecent, one row per play). "All…" opens History filtered to this game.
const RpRecent = ({ title, allLabel, rows, empty }) => {
  const s = useRp(); const gs = useGs(); const gid = gsGameOfRoute(gs.route.name);
  const onAll = () => gs.go('history', { game: gid, from: gid });
  const card = React.useRef(null); const list = React.useRef(null); const probe = React.useRef(null);
  const [fit, setFit] = React.useState(null);
  const vs = React.useMemo(() => rows.flatMap((r) => (r.figs ? [{ key: r.key, raw: r }] : rpViews(r, gs, s.opt))), [rows, gs, s.opt]);
  React.useLayoutEffect(() => {
    const el = card.current; if (!el || !vs.length) return undefined;
    const pair = el.previousElementSibling; const lay = el.parentElement;
    const measure = () => {
      if (s.opt === '3') { el.style.height = ''; if (pair) pair.style.alignSelf = ''; setFit(null); return; }
      const two = getComputedStyle(lay).gridTemplateColumns.split(' ').length > 1;
      if (!two || !pair) { el.style.height = ''; if (pair) pair.style.alignSelf = ''; setFit(null); return; }
      pair.style.alignSelf = 'start';
      el.style.height = pair.offsetHeight + 'px';
      const room = list.current ? el.clientHeight - list.current.offsetTop : 0;
      const hs = Array.from(probe.current.children).map((x) => x.offsetHeight);
      let k = 0; let sum = 0; while (k < hs.length && sum + hs[k] <= room + 1) { sum += hs[k]; k += 1; }
      if (k < Math.min(4, hs.length)) { el.style.height = ''; pair.style.alignSelf = ''; setFit(null); return; }
      setFit(k);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(pair); ro.observe(lay);
    return () => ro.disconnect();
  }, [vs.length, s.opt]);
  const tw = Math.min(150, Math.max(44, Math.ceil(Math.max(0, ...vs.map((v) => (v.title ? String(v.title).length : 0))) * 9)));
  const lng = false;
  const shown = fit ? vs.slice(0, fit) : s.opt === '3' ? rpLimit(vs, 4) : vs.slice(0, 4);
  React.useLayoutEffect(() => {
    const ul = list.current; const pr = probe.current; if (s.opt !== '2' || !ul) return undefined;
    const ks = ['a', 'c', 'd']; const all = [ul, pr].filter(Boolean);
    const run = () => {
      // Fit rules, in order. 1 No row is wider than its card. 2 The edition is the only column that gives, but keeps up to 140px. 3 If it can't, the date goes, then the R column goes when no row in the card is a replay, then the result is capped at 84px.
      all.forEach((u) => { ks.forEach((k) => u.style.removeProperty('--w' + k)); u.removeAttribute('data-nodate'); u.removeAttribute('data-nor'); });
      const row = ul.querySelector('.rp-one'); if (!row) return;
      const cs = getComputedStyle(row);
      const inner = ul.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const nat = {}; ks.forEach((k) => { nat[k] = Math.max(0, ...[...ul.querySelectorAll('.rp-' + k)].map((e) => e.getBoundingClientRect().width)); });
      nat.c = Math.max(0, ...[...ul.querySelectorAll('.rp-sl')].map((e) => e.scrollWidth + 26));
      nat.a = Math.max(0, ...[...ul.querySelectorAll('.rp-t')].map((e) => e.scrollWidth + 2));
      nat.d = Math.max(0, ...[...ul.querySelectorAll('.rp-d')].map((e) => e.scrollWidth + 2));
      const hasR = !!ul.querySelector('.rp-r');
      const want = Math.min(nat.a, 140); const need = Math.min(want, 40);
      const room = (c, d, r) => inner - (c + (d ? d + 8 : 0) + (r ? 28 : 0) + 16 + 16);
      let c = Math.min(nat.c, 112); let d = Math.min(nat.d, 60); let r = hasR; let nd = false;
      if (room(c, d, r) - 8 < need) { nd = true; d = 0; }
      if (room(c, d, r) - 8 < want && !hasR) r = false;
      if (room(c, d, r) - 8 < need) c = Math.min(nat.c, 84);
      const wa = Math.max(64, Math.min(nat.a, room(c, d, r) - 8));
      all.forEach((u) => { if (nd) u.setAttribute('data-nodate', '1'); if (!r) u.setAttribute('data-nor', '1'); u.style.setProperty('--wa', Math.ceil(wa) + 'px'); u.style.setProperty('--wc', Math.ceil(c) + 'px'); u.style.setProperty('--wd', Math.ceil(d) + 'px'); });
    };
    run(); window.addEventListener('resize', run); return () => window.removeEventListener('resize', run);
  }, [vs, fit, s.opt, lng]);
  const cell = (v, probing) => (v.raw ? <RP_FALLBACK r={v.raw} /> : <RpRow v={probing ? { ...v, onOpen: null } : v} o={s.opt} two={lng} />);
  return (
    <section ref={card} className={'lb-card lb-recentcard' + (fit ? ' is-fill' : '')}>
      <div className="lb-sechead"><h2 className="mcp-t-card">{title}</h2>{rows.length > 0 && <DS.TextLink onClick={onAll}>{allLabel}</DS.TextLink>}</div>
      {vs.length ? <ul ref={list} className={'lb-list lb-recent' + (s.opt === '2' && !lng ? ' rp-flex' : '')} style={{ '--rp-t': tw + 'px', ...(fit ? { gridTemplateRows: 'repeat(' + fit + ', minmax(0, 1fr))' } : null) }}>{shown.map((v) => <li key={v.key}>{cell(v)}</li>)}</ul> : <p className="gs-muted">{empty}</p>}
      {vs.length > 0 && <ul ref={probe} className={'lb-list lb-probe' + (s.opt === '2' && !lng ? ' rp-flex' : '')} aria-hidden="true" style={{ '--rp-t': tw + 'px' }}>{vs.map((v) => <li key={v.key}>{cell(v, true)}</li>)}</ul>}
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
const RpHistory = () => {
  const gs = useGs(); const s = useRp(); const r = gs.route; const f = usePhList(r.game);
  const [rep, setRep] = React.useState('all');
  const list = f.list.filter((x) => rep === 'all' || (rep === 'again') === x.again);
  const size = 24; const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(f.pg, pages - 1);
  const groups = [];
  list.slice(pg * size, pg * size + size).forEach((p) => { const k = phDayKey(p.at); const last = groups[groups.length - 1]; if (last && last[0] === k) last[2].push(p); else groups.push([k, phDayLabel(p.at), [p]]); });
  const name = (p) => (p.edTitle.includes(GS_GAMES[p.gid].name) || f.g !== 'all' ? p.edTitle : GS_GAMES[p.gid].name + ' · ' + p.edTitle);
  const view = (p) => ({ key: p.pid, gid: p.gid, title: name(p), when: phTime(p.at), status: rpSh(p.gid, p.status), chip: p.again ? 'again' : 'first', onOpen: () => p.open(gs) });
  return (
    <PhPage>
      {r.from && <LbBack label={GS_GAMES[r.from].name} onClick={() => phLib(gs, r.from)} />}
      <PhHead />
      {!f.all.length ? <PhEmpty /> : (
        <div className="lb-alllay">
          <aside className="lb-tools">
            <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} />
            <LbChoice label="Plays" value={rep} opts={[['all', 'All plays'], ['first', 'First plays'], ['again', 'Replays']]} onPick={(v) => { setRep(v); f.go(0); }} />
            <PhShow f={f} />
          </aside>
          <div className="lb-box lb-results">
            {groups.length ? groups.map(([k, label, ps]) => (
              <React.Fragment key={k + pg}>
                <h2 className="ph-day">{label}</h2>
                <ul className="ph-list">{ps.map((p) => <li key={p.pid}><RpRow v={view(p)} o="2" /></li>)}</ul>
              </React.Fragment>
            )) : <p className="lb-empty gs-muted">No plays match that.</p>}
            <RpPages pg={pg} pages={pages} go={f.go} />
          </div>
        </div>
      )}
    </PhPage>
  );
};

const RP_Session0 = window.GsSession;
const RpSession = () => {
  const gs = useGs(); const s = GS_SESSIONS[gs.route.id] || {};
  return <>{s.gid && <div className="gs-wrap" style={{ paddingTop: 24 }}><LbBack label={GS_GAMES[s.gid].name} onClick={() => phLib(gs, s.gid)} /></div>}<RP_Session0 /></>;
};
Object.assign(window, { GsSession: RpSession, LbRecent: RpRecent, GsHistory: RpHistory });
