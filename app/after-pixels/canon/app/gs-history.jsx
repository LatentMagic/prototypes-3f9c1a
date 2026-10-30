// ============================================================================
// After Pixels — History (every play under its day; search and filters), the play rows, the edition helpers, and the library game page's plays card (LbRecent).
// History lists every play under the day it was played. A game's editions are listed on its own page (app/gs-editions.jsx).
// Loads after every library module.
// Seed: one play log built from the library pages' own seeds. Every play opens a record that agrees with its row.
// This edition's play has two forms, finished and in progress (Config: This week, or today).
// ============================================================================
// ---- Dates ----
import React from 'react';
import { GS_GAMES, gsFresh, gsLapsed, GS_SESSIONS, gsEndedOn, gsTodayPlayed, useGs, DS, GS_GAME_ORDER, gsScrollTop, gsForms, gsGameOfRoute, gsRhythm, GS_RHYTHMS } from './gs-data.jsx';
import { useGsPart, GsPart } from './gs-site.jsx';
import { GsArt } from './gs-parts.jsx';
import { lbDate, lbShort, lbNow, lbOld, lbMonth, lbWeekDone, LbBack, LbTools, LbChoice } from './gs-library.jsx';
import { DP_IDS } from './gs-where-chain-salvage.jsx';
import { CB_ALL, CB_DONE, CB_LIVE } from './gs-casebook-data.jsx';
import { cbStatus, cbGo } from './gs-casebook.jsx';
import { DV_ALL, dvStatus, DV_DONE, dvSid, DV_END } from './gs-delve-library.jsx';
import { PZ, pzStatus, pzLong } from './gs-puzzles-library.jsx';
import { HG_DAYS, hgStatus, hgSid } from './gs-hunter-library.jsx';
import { bwEds, BW_T1, BW_REC1 } from './gs-barrow-library.jsx';
import { gsKinds, gsKind } from './gs-discover.jsx';
import { cprFirstState } from './gs-pass-store.jsx';

const PH_TODAY = new Date(2026, 9, 6);
const PH_MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const phParse = (s) => { const [d, m, y] = s.split(' '); return new Date(+(y || 2026), PH_MON.indexOf(m), +d); };
const phAt = (d, h, m, plus = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + plus, h, m);
const phDay0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const phDayKey = (d) => d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
const phDayLabel = (d) => { const n = Math.round((phDay0(d) - PH_TODAY) / 864e5); return n === 0 ? 'Today' : n === -1 ? 'Yesterday' : d.toLocaleString('en-GB', { weekday: 'long' }) + ' ' + lbDate(d); };
const phTime = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
const phShort = (d) => lbShort(lbDate(d));

export let ED_GAMES;
// An edition's name, as a History row and the session page write it: the edition's name where it has one ("The Clockmaker’s Study"),
// the number where it has none ("#212"). A named edition shows no number. edLabel puts the game's name first:
// "Daily Word #212", "Escape · The Clockmaker’s Study". A one-game list (the game's own page or filter) writes edName alone.
export const edName = (e) => (e.title ? e.title : '#' + e.n);
export const edLabel = (e) => GS_GAMES[e.gid].name + (e.title ? ' · ' + e.title : ' #' + e.n);
let ED_NONE;
export const edList = (gs, gid) => {
  const pass = gs.view === 'pass'; const signed = gs.view !== 'out'; const now = signed ? lbNow(gs, gid) : null;
  if (gid === 'barrow') return bwEds(gs);
  if (PZ[gid]) {
    const c = PZ[gid];
    // The free first edition reads its one record, even when it is also the current one.
    const fe = (x) => !!phFirstSt(gs, gid) && PH_FIRST[gid] === x.id;
    return edMore(gs, gid, c.all.map((x) => ({ key: x.id, gid, n: c.weekly ? c.all.length - x.i : +c.no(x.i).split('#')[1], title: c.weekly ? x.title : null, date: x.date, month: x.month, free: true, now: x.i === 0,
      status: !signed ? null : fe(x) ? phFirstRec(gs, gid).status : x.i === 0 ? (now ? now.status : ED_NONE) : gsFresh(gs) ? ED_NONE : phUnf(gs, x.id) ? PH_UNF : pzStatus(c, x),
      open: !signed || gsFresh(gs) ? null : phUnf(gs, x.id) ? () => gs.go('session', { id: PH_UNF_EDS[x.id].sid }) : fe(x) ? (phFirstRec(gs, gid).open && (() => phFirstRec(gs, gid).open(gs))) : x.i === 0 ? (now ? now.open : null) : x.sid ? () => gs.go('session', { id: x.sid }) : null })));
  }
  const all = gid === 'casebook' ? CB_ALL : DV_ALL; const first = all[all.length - 1]; const lapsed = gsLapsed(gs); const fresh = gsFresh(gs);
  const mine = (x) => !fresh && x.played && (pass || (x === first && !!PH_FIRST[gid]) || (lapsed && lbOld(x.week || x.date, gs)));
  return edMore(gs, gid, all.map((x, i) => {
    // This week's play counts as played before the Pass ended when it ended today.
    const curOld = i === 0 && !now && signed && lapsed && mine(x);
    const unf = signed && i > 0 && phUnf(gs, x.id);
    const played = i === 0 ? !!now || curOld : signed && mine(x);
    let st = !signed ? null : unf ? PH_UNF : i === 0 ? (now ? now.status : curOld ? (gid === 'casebook' ? cbStatus(CB_DONE) : dvStatus(DV_DONE)) : ED_NONE) : played ? (gid === 'casebook' ? cbStatus(x) : dvStatus(x)) : ED_NONE;
    // The free first edition reads its one record.
    const fr = x === first && phFirstSt(gs, gid) ? phFirstRec(gs, gid) : null;
    if (fr && !fresh) { st = fr.status; return { key: x.id, gid, n: all.length - i, title: x.title, date: x.week || x.date, month: x.month, free: true, now: false, status: st, open: fr.open && (() => fr.open(gs)) }; }
    return { key: x.id, gid, n: all.length - i, title: x.title, date: x.week || x.date, month: x.month, free: x === first && !!PH_FIRST[gid], now: i === 0, status: st,
      open: unf ? () => gs.go('session', { id: PH_UNF_EDS[x.id].sid }) : !played ? null : i === 0 ? (now ? now.open : () => (gid === 'casebook' ? cbGo(gs, x.id) : gs.go('session', { id: 'delve' }))) : () => (gid === 'casebook' ? cbGo(gs, x.id) : gs.go('session', { id: dvSid(x) })) };
  }));
};
// Whether this player needs the Pass for an edition. Every edition can be played; a free game's current one is free, another game's first one is.
export const edNeedsPass = (gs, e) => gs.view !== 'pass' && (GS_GAMES[e.gid].free ? !e.now : !e.free);
export let PH_UNF;
let PH_UNF_EDS;
const phUnf = (gs, key) => { const u = PH_UNF_EDS[key]; return !!u && !!(gs && gs.review && gs.review.unfinished) && !gsFresh(gs) && (GS_GAMES[u.gid].free || gs.view === 'pass'); };
// Search: a row is found by its name and number as written ("Daily Groups #84", "groups 84", "Daily Mystery #64"), its title, and its date.
// Every word typed must start a word of the row; a number must be a whole number (84 finds #84, not #184).
// A keyboard apostrophe matches the curly one. A query naming a month is a date and matches as before (substring).
export const phNorm = (q) => (q || '').trim().toLowerCase().replace(/^#/, '');
const phWords = (s) => s.toLowerCase().replace(/(\d),(?=\d)/g, '$1').replace(/[’'‘]/g, '').split(/[^a-z0-9]+/).filter(Boolean);
const phIsDate = (s) => phWords(s).some((w) => w.length >= 3 && PH_MON.some((m) => m.toLowerCase().startsWith(w)));
export const phMatch = (hay, s) => {
  if (!s) return true;
  hay = hay.toLowerCase();
  if (phIsDate(s)) return new RegExp('(^|[^0-9a-z])' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(hay);
  const hw = phWords(hay);
  return phWords(s).every((w) => (/^\d+$/.test(w) ? hw.includes(w) : hw.some((h) => h.startsWith(w))));
};
let PH_META;
const phMeta = () => { if (!PH_META) { PH_META = {}; ED_GAMES.forEach((k) => edList({ view: 'out', sub: {} }, k).forEach((e) => { PH_META[e.key] = e; })); } return PH_META; };
// A date finds a play by the day it was played, or the day its edition came out (d).
export const phHay = (gid, ed, title, d) => { const m = phMeta()[ed];
  return [GS_GAMES[gid].name, title || '', m ? m.n + ' ' + (m.title || '') : '', d ? lbDate(d) + ' ' + PH_MON[d.getMonth()] : ''].join(' ').toLowerCase(); };

let PH_EDS; let PH_PLAYS;
const phEd = (gid, ed, edTitle, edDate, plays, cur) => {
  const e = { gid, ed, edTitle, edDate, plays: plays.map((p, n) => ({ ...p, gid, ed, edTitle, edDate, n, cur: !!cur, pid: ed + '-' + n })) };
  PH_EDS[ed] = e; PH_PLAYS.push(...e.plays);
};
const phSess = (id) => (gs) => gs.go('session', { id });
let PH_LIVE;
let PH_LIVE_SID;
let PH_MORE;


const phMoreOn = (gs) => !!(gs && gs.review && gs.review.several) && gs.view === 'pass';
let PH_MORE_PLAYS;
// The editions list with the earlier edition added: it is the first released, so it takes number 1 and the others move up one.
const edMore = (gs, gid, list) => { const m = phMoreOn(gs) && PH_MORE[gid]; if (!m) return list;
  return list.map((e) => ({ ...e, n: e.n + 1 })).concat([{ key: m.id, gid, n: 1, title: m.title, date: lbDate(m.d), month: lbMonth(m.d), free: false, now: false, status: PH_LIVE, open: () => gs.go('session', { id: m.sid }) }]); };





let PH_ALL;
let PH_BROKEN;
let PH_UNF_PLAYS;
// This edition's finished play, as Config → This edition picks it (PZ's c.today).
const phCur = (p) => { const c = PZ[p.gid]; if (!p.cur || !c || !p.now || c.today === p.sid) return p; const s = GS_SESSIONS[c.today]; return { ...p, sid: c.today, status: { kind: s.loss ? 'bad' : 'ok', label: s.result }, open: phSess(c.today) }; };
const phLog = (gs) => {
  const l = (gs.review && gs.review.broken ? PH_ALL.filter((p) => p.ed !== 'word1').concat(PH_BROKEN) : PH_ALL).map(phCur);
  const u = gs.review && gs.review.unfinished ? l.concat(PH_UNF_PLAYS.filter((p) => phUnf(gs, p.ed))) : l;
  return (phMoreOn(gs) ? u.concat(PH_MORE_PLAYS) : u).slice().sort((a, b) => b.at - a.at);
};
export let PH_FIRST;
let PH_FIRST_LIVE;
// 'none' | 'live' | 'done' for a player without the Pass; null for a Pass holder or a game with no free first edition.
export const phFirstSt = (gs, gid) => (PH_FIRST[gid] && GS_GAMES[gid].first && gs && gs.view && gs.view !== 'pass' && gs.view !== 'out' && cprFirstState ? cprFirstState(gs, gid) : null);
const phFirstRec = (gs, gid) => {
  const e = PH_EDS[PH_FIRST[gid]]; if (!e) return null;
  const p = e.plays[0]; const st = phFirstSt(gs, gid);
  return { gid, ed: e.ed, st, at: p.at, date: lbDate(p.at), status: st === 'live' ? PH_LIVE : st === 'none' ? ED_NONE : p.status, open: st === 'live' ? PH_FIRST_LIVE[gid] : st === 'none' ? null : p.open };
};
// What this player's record holds: every play the app shows of any game, in any view, is read from here.
// A Pass holder: every play. Free or Pass ended: the free games in full (this edition only once played), a free first edition as
// its record stands, and for a Pass-ended player every Pass play from before the Pass ended (gsEndedOn), never one after it.
export const phVisible = (gs) => {
  if (gsFresh(gs)) return [];
  const live = !lbWeekDone(gs); const never = gs.review && gs.review.never;
  // The Barrow's chapter play shows only while its record stands finished.
  const bw = !!(cprFirstState && cprFirstState(gs, 'barrow') === 'done');
  let all = phLog(gs).filter((p) => (p.gid !== 'barrow' || bw) && p.gid !== never).map((p) => (live && p.now ? { ...p, ...p.now } : p));
  if (gs.view === 'pass') return all;
  // The free first edition as its record stands: hidden until started, in progress, or as logged.
  all = all.filter((p) => !(PH_FIRST[p.gid] === p.ed && phFirstSt(gs, p.gid) === 'none'))
    .map((p) => (PH_FIRST[p.gid] === p.ed && phFirstSt(gs, p.gid) === 'live' ? { ...p, status: PH_LIVE, open: PH_FIRST_LIVE[p.gid] } : p));
  const lapsed = gsLapsed(gs); const end = gsEndedOn(gs);
  return all.filter((p) => { const g = GS_GAMES[p.gid];
    if (g.free) return p.cur ? !!gsTodayPlayed(gs)[p.gid] : true;
    if (PH_FIRST[p.gid] === p.ed) return true;
    return lapsed && p.at < end; });
};
// The one date form a record's day takes in a row: "Today", or "5 Oct".
export const phWhen = (d) => (phDayKey(d) === phDayKey(PH_TODAY) ? 'Today' : phShort(d));
// Achievements, read from the record. Each has its condition: by (a play that meets it), count (the plays that each add one,
// oldest first) or, for a streak, the streak shown (streak). Earned is dated by the first play that meets it. Plays in progress meet nothing.
// A chapter started over is a new session that counts for nothing new: a play marked restart earns nothing.
export const phAch = (gs, gid, items, streak) => {
  const plays = phVisible(gs).filter((p) => p.gid === gid && p.status.kind !== 'live' && !p.restart).reverse();
  return items.map((a) => {
    let got; let have = a.have;
    if (a.by) { const p = plays.find(a.by); got = p ? lbDate(p.at) : undefined; }
    else if (a.count) { const l = a.count(plays); have = Math.min(l.length, a.of); got = l.length >= a.of ? lbDate(l[a.of - 1].at) : undefined; }
    else if (a.of) { have = Math.min(streak || 0, a.of); const p = have >= a.of && plays[plays.length - 1]; got = p ? lbDate(p.at) : undefined; }
    return { ...a, have, got };
  });
};


// A session page is one play: it lists no other plays.
const phLib = (gs, id) => gs.go(GS_GAMES[id].route, { page: 'record' });

// ---- Parts ----
const PhHead = ({ title }) => <div className="gs-stack-sm"><h1 className="gs-h1">{title || 'History'}</h1></div>;
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

// ---- One play: a DS.ListRow, given its parts. Title is the edition alone (edName); the game's name goes in game, only in a list that mixes games.
// v: { key, title, game?, when (text or forms), status, onOpen, gid?, sub? } ----
const phTone = (s) => (s.kind === 'ok' || s.kind === 'bad' ? s.kind : 'none');
// Every game draws its art at the 40 by 30 lead, so it moves with the row.
export const PhLead = ({ gid }) => <GsArt art={GS_GAMES[gid].art} shape="landscape" />;
const phRow = (v) => (
  <DS.ListRow key={v.key} sub={!!v.sub} lead={v.gid ? <PhLead gid={v.gid} /> : undefined} title={v.title} game={v.gid ? v.game : undefined}
    result={gsForms(v.status.label)} tone={phTone(v.status)} when={v.when}
    onClick={v.onOpen || undefined} />
);
// The library game page's plays card is the newest of History's rows for the game: one row per play.
// The card has no day headings, so a row shows its day where History shows its time.
const phRecent = (gs, gid) => phVisible(gs).filter((p) => p.gid === gid).slice(0, 8)
  .map((p) => ({ key: p.pid, title: phParts(p, true).title, when: [phWhen(p.at) + ', ' + phTime(p.at), phWhen(p.at)], status: p.status, onOpen: () => p.open(gs) }));

// ---- The library game page's plays card. "All…" opens History filtered to this game. ----
// KEEP: on a phone the card shows the latest four plays; beside achievements, as many as fill it to achievements' height, so the row ends level.
// A game never played shows the card's empty line only (library-mystery-never-played).
export const LbRecent = (p) => {
  const gs = useGs(); const gid = gsGameOfRoute(gs.route.name);
  if (gs.review && gs.review.never === gid) return (
    <section className="lb-card lb-recentcard">
      <div className="lb-sechead"><h2 className="mcp-t-card">{p.title}</h2></div>
      <p className="gs-muted">{p.empty}</p>
    </section>
  );
  return <LbRecentList {...p} />;
};
const LbRecentList = ({ title, allLabel, empty }) => {
  const gs = useGs(); const gid = gsGameOfRoute(gs.route.name);
  const card = React.useRef(null); const list = React.useRef(null); const probe = React.useRef(null);
  // list and probe wrap a DS.RowList; its <li>s are the rows measured. Probe rows keep their chevron, so they wrap exactly as the shown ones do.
  const [fit, setFit] = React.useState(null);
  const vs = React.useMemo(() => phRecent(gs, gid), [gs, gid]);
  React.useLayoutEffect(() => {
    const el = card.current; if (!el || !vs.length) return undefined;
    const pair = el.previousElementSibling; const lay = el.parentElement;
    const reset = () => { el.style.height = ''; if (pair) pair.style.alignSelf = ''; setFit(null); };
    const measure = () => {
      const two = getComputedStyle(lay).gridTemplateColumns.split(' ').length > 1;
      if (!two || !pair) return reset();
      pair.style.alignSelf = 'start';
      el.style.height = pair.offsetHeight + 'px';
      const room = list.current ? el.clientHeight - list.current.offsetTop : 0;
      // The probe measures at the shown list's own width, so its rows wrap as the shown ones do.
      if (list.current) { probe.current.style.right = 'auto'; probe.current.style.width = list.current.offsetWidth + 'px'; }
      const hs = Array.from(probe.current.firstElementChild.children).map((x) => x.offsetHeight);
      let k = 0; let sum = 0; while (k < hs.length && sum + hs[k] <= room + 1) { sum += hs[k]; k += 1; }
      // KEEP: never fewer than four plays; a shorter neighbour grows to match instead.
      if (k < Math.min(4, hs.length)) return reset();
      setFit(k);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(pair); ro.observe(lay);
    return () => ro.disconnect();
  }, [vs.length]);
  const shown = fit ? vs.slice(0, fit) : vs.slice(0, 4);
  return (
    <section ref={card} className={'lb-card lb-recentcard' + (fit ? ' is-fill' : '')}>
      <div className="lb-sechead"><h2 className="mcp-t-card">{title}</h2>{vs.length > 0 && <DS.TextLink onClick={() => gs.go('history', { game: gid, from: gid })}>{allLabel}</DS.TextLink>}</div>
      {vs.length ? <div ref={list} className="lb-recent" style={fit ? { '--fit': fit } : null}><DS.RowList label={title}>{shown.map(phRow)}</DS.RowList></div> : <p className="gs-muted">{empty}</p>}
      {vs.length > 0 && <div ref={probe} className="lb-recent lb-probe" aria-hidden="true"><DS.RowList>{vs.map((v) => phRow({ ...v, onOpen: () => {} }))}</DS.RowList></div>}
    </section>
  );
};

// KEEP: the pager shows page numbers when they fit and "Page 3 of 9" when they don't (container query in the page CSS).
export const PhPages = ({ pg, pages, go }) => (pages > 1 ? (
  <nav className="lb-pages rp-pg" aria-label="Pages">
    {pg > 0 ? <button type="button" className="gs-iconbtn" aria-label="Previous page" onClick={() => go(pg - 1)}><DS.Icon name="next" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
    <div className="lb-pagenums rp-pg-nums">{Array.from({ length: pages }, (_, x) => <button key={x} type="button" aria-current={x === pg ? 'page' : undefined} onClick={() => go(x)}>{x + 1}</button>)}</div>
    <span className="rp-pg-of gs-strong gs-num-text">{'Page ' + (pg + 1) + ' of ' + pages}</span>
    {pg < pages - 1 ? <button type="button" className="gs-iconbtn" aria-label="Next page" onClick={() => go(pg + 1)}><DS.Icon name="next" /></button> : <span className="gs-iconbtn-space" />}
  </nav>
) : null);

// History: every play under the day it was played (a game's editions are
// listed on its own page). Search and one Filters panel that only narrows: Genre, Schedule, Game, Order.
// When nothing matches, Clear all clears search and narrowing. Narrowed to a game when the library game page's "See in History" opens it.
// Every row opens its session page. No Pass mark on any row or filter.
// A row's title comes from its edition: edLabel ("Daily Word #212"), or edName in a one-game list ("#212").
const phTitle = (p, one) => { const m = phMeta()[p.ed]; if (m && ED_GAMES.includes(p.gid)) return one ? edName(m) : edLabel(m);
  return one || (p.edTitle.includes(GS_GAMES[p.gid].name) && p.gid !== 'barrow') ? p.edTitle : GS_GAMES[p.gid].name + ' · ' + p.edTitle; };
// A row's parts: the edition's own name, and the game's name for a list that mixes games (ListRow joins them).
const phParts = (p, one) => { const m = phMeta()[p.ed]; const name = GS_GAMES[p.gid].name;
  const t = m && ED_GAMES.includes(p.gid) ? edName(m) : p.edTitle;
  // The Barrow names its chapter beside the game, as deployed (“The Barrow of Hollowmere · The Barrow of Hollowmere”).
  return { title: t, game: one ? undefined : p.gid === 'barrow' ? name : t.includes(name) ? undefined : name }; };
export const GsHistory = () => {
  // r.keep: the list as the player left it, written into this history entry so browser Back returns it.
  const gs = useGs(); const r = gs.route; const k0 = r.keep || {}; const f = usePhList(k0.g || r.game, k0);
  const [rhy, setRhy] = React.useState(k0.rhy || r.rhythm || 'all'); const [cat, setCat] = React.useState(k0.cat || r.kind || 'all');
  const [q, setQ] = React.useState(k0.q != null ? k0.q : r.q || '');
  React.useEffect(() => { gs.keep({ keep: { g: f.g, pg: f.pg, sort: f.sort, rhy, cat, q } }); }, [f.g, f.pg, f.sort, rhy, cat, q]);
  const wait = useGsPart([f.sort, rhy, cat, f.g, f.pg, q]);
  const one = f.g !== 'all'; const s = phNorm(q);
  const okG = (gid) => (rhy === 'all' || gsRhythm(gid) === rhy) && (cat === 'all' || GS_GAMES[gid].category === cat);
  const items = f.list.filter((x) => okG(x.gid) && (!s || phMatch(phHay(x.gid, x.ed, x.edTitle, x.at) + ' ' + phTitle(x, one), s)));
  const size = 24; const pages = Math.max(1, Math.ceil(items.length / size)); const pg = Math.min(f.pg, pages - 1);
  const groups = [];
  items.slice(pg * size, pg * size + size).forEach((p) => { const k = phDayKey(p.at); const last = groups[groups.length - 1]; if (last && last[0] === k) last[2].push(p); else groups.push([k, phDayLabel(p.at), [p]]); });
  const view = (p) => ({ key: p.pid, gid: one ? undefined : p.gid, ...phParts(p, one), when: phTime(p.at), status: p.status, onOpen: () => p.open(gs) });
  const games = GS_GAME_ORDER.filter((k) => k === f.g || f.games.includes(k));
  const reset = (fn) => (v) => { fn(v); f.go(0); };
  const anySet = one || cat !== 'all' || rhy !== 'all' || f.sort !== 'new' || !!q;
  const clearAll = () => { f.setG('all'); setCat('all'); setRhy('all'); f.setSort('new'); setQ(''); };
  return (<>
    <main className="gs-wrap gs-main">
      {r.from && <LbBack label={GS_GAMES[r.from].name} onClick={() => phLib(gs, r.from)} />}
      <PhHead />
      {!f.all.length ? <PhEmpty /> : (
        <div className="lb-alllay">
          <LbTools>
            <DS.SearchField label="Search" placeholder="A number, name or date" value={q} onChange={(e) => reset(setQ)(e.target.value)} />
            <LbChoice label="Genre" value={cat} opts={[['all', 'All games'], ...gsKinds().map((c) => [c, gsKind(c)])]} onPick={reset(setCat)} />
            <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={reset(setRhy)} />
            <LbChoice label="Game" value={f.g} opts={[['all', 'All games'], ...games.map((k) => [k, GS_GAMES[k].name])]} onPick={f.setG} />
            <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} />
          </LbTools>
          {/* A filter or search that finds nothing: the design system's line and Clear all, with no box (ui-standard.md, Designed empty states). */}
          {!wait && !groups.length ? <div className="gs-nomatch"><p>Nothing matches that.</p>{anySet && <DS.TextLink onClick={clearAll}>Clear all</DS.TextLink>}</div> : (
            <div className="lb-box lb-results" style={{ maxWidth: 960 }}>
              {wait ? <GsPart label="Loading plays" /> : <>{groups.map(([k, label, ps]) => (
                <React.Fragment key={k + pg}>
                  <h2 className="ph-day">{label}</h2>
                  <DS.RowList label={label}>{ps.map((p) => phRow(view(p)))}</DS.RowList>
                </React.Fragment>
              ))}
              <PhPages pg={pg} pages={pages} go={f.go} /></>}
            </div>
          )}
        </div>
      )}
    </main>
  </>);
};

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsHistory() {
// ---- Editions ----
ED_GAMES = ['word', 'groups', 'mystery', ...DP_IDS, 'escape', 'casebook', 'delve'];
// A game's editions, newest first: { key, gid, n, title, date, month, free, now, status, open }
// Results agree with the library game page: this edition from lbNow; a free player has played the first edition; a lapsed one, everything played before the Pass ended.
ED_NONE = { kind: 'none', label: 'Not played' };
// Sessions whose day or week ended before the player finished (Config: Ended unfinished). One Daily Groups day, an edition the seed leaves unplayed.
// Delve has one run so far, this week's, so no Delve week can have ended unfinished: 'delve-unfinished' reads run 1 in progress.
PH_UNF = { kind: 'none', label: 'Not finished' };
PH_UNF_EDS = (() => {
  // The second unplayed earlier day of Daily Groups.
  const g = PZ.groups.all.filter((x) => x.i > 0 && !x.played)[1];
  const gAt = phAt(g.d, 21, 40);
  GS_SESSIONS['groups-unfinished'] = { kind: 'puzzle', gid: 'groups', game: 'Daily Groups', art: 'groups', unfinished: true, edKey: g.id, result: null, date: pzLong(gAt) + ', 21:40', listTitle: 'Every try', share: null,
    lines: [['Try 1', 'OAK · ASH · ELM · YEW', 'Found: trees'], ['Try 2', 'BASS · CHORD · SCALE · PIKE', 'One away']] };
  GS_SESSIONS['delve-unfinished'] = GS_SESSIONS['delve-live'];
  return { [g.id]: { gid: 'groups', x: g, sid: 'groups-unfinished', at: gAt } };
})();
PH_META = null;
// ---- The play log. An edition holds its one play. ----
// A play: { at, status, open(gs), cur (this edition), now? (the in-progress form of this edition's play) }
PH_EDS = {};
PH_PLAYS = [];
PH_LIVE = { kind: 'live', label: 'In progress' };
PH_LIVE_SID = { word: 'word-live', groups: 'groups-live', mystery: 'mystery-live', escape: 'escape-live', ...Object.fromEntries(DP_IDS.map((k) => [k, k + '-live'])) };
// ---- Several editions in progress (Escape and Delve only). SAMPLE data: one earlier room and one earlier run,
// each in progress. They exist only while review.several is on (the two-in-progress states), so everywhere else the game's first
// edition stays the Clockmaker's Study and run 1. Starting another edition leaves the first where it was; nothing warns about it. ----
PH_MORE = {
  escape: { id: 'escape-r0', gid: 'escape', d: new Date(2026, 8, 28), title: 'The Lighthouse Keeper’s Log', sid: 'escape-r0-live', at: phAt(new Date(2026, 9, 3), 20, 15) },
  delve: { id: 'dv-r0', gid: 'delve', d: new Date(2026, 8, 28), title: 'The Drowned Chapel under Fenwick Marsh', sid: 'delve-r0-live', at: phAt(new Date(2026, 9, 4), 21, 5) },
};
GS_SESSIONS['escape-r0-live'] = { ...GS_SESSIONS['escape-live'], edKey: 'escape-r0', __dated: true, date: pzLong(PH_MORE.escape.at) + ', ' + phTime(PH_MORE.escape.at),
  lines: [['Move 1', 'Examined the logbook on the desk', 'The last entry stops mid-sentence, three nights before the storm.'], ['Move 2', 'Examined the lamp room hatch', 'The hatch is bolted from above.']] };
GS_SESSIONS['delve-r0-live'] = { ...GS_SESSIONS['delve-live'], edKey: 'dv-r0', __dated: true, date: pzLong(PH_MORE.delve.at) + ', ' + phTime(PH_MORE.delve.at),
  figures: ['Threat 2/12', '4 rolls', 'HP 10/11'], threat: 2, setting: 'The Drowned Chapel under Fenwick Marsh', tracks: { progress: 2, rooms: 5, threat: 2, threatMax: 12 }, endings: null, reached: null, shareLines: null,
  lines: [['Room', 'Entered the flooded nave'], ['Dexterity', 'Cross the sunken pews', 'Success', 'Rolled 14 + 2 = 16 against DC 12'], ['Room', 'Entered the bell loft']] };
PH_MORE_PLAYS = Object.values(PH_MORE).map((m) => ({ gid: m.gid, ed: m.id, edTitle: m.title, edDate: m.d, n: 0, cur: false, pid: m.id + '-0', at: m.at, status: PH_LIVE, sid: m.sid, src: {}, open: phSess(m.sid) }));
Object.entries(PZ).forEach(([id, c]) => c.all.forEach((x) => {
  if (!x.played) return;
  const cur = x.i === 0; const sid = cur ? c.today : x.sid;
  let first;
  if (cur) { const s = GS_SESSIONS[c.today]; first = { at: phAt(PH_TODAY, 8 + c.salt, 5 + c.salt * 11), status: { kind: s.loss ? 'bad' : 'ok', label: s.result }, now: { status: PH_LIVE, open: phSess(PH_LIVE_SID[id]) } }; }
  else first = { at: phAt(x.d, 7 + ((x.i * 5 + c.salt * 3) % 15), (x.i * 17 + c.salt * 7) % 60, c.weekly ? x.i % 4 : 0), status: { kind: x.ok ? 'ok' : 'bad', label: x.line } };
  first.open = phSess(sid); first.sid = sid; first.src = x;
  phEd(id, x.id, x.title, x.d, [first], cur);
}));
CB_ALL.forEach((cb, k) => {
  if (!cb.played) return;
  const ed = phParse(cb.week); const cur = cb === CB_LIVE;
  // The log holds the case's finished form (CB_DONE); its in-progress form is `now`.
  const first = cur ? { at: phAt(ed, 20, 10 + (k % 40)), status: cbStatus(CB_DONE), src: CB_DONE, open: (gs) => cbGo(gs, cb.id), now: { status: PH_LIVE, open: (gs) => cbGo(gs, cb.id) } }
    : { at: phAt(ed, 20, 10 + (k % 40), k % 3), status: cbStatus(cb), src: cb, open: (gs) => cbGo(gs, cb.id) };
  phEd('casebook', cb.id, cb.title, ed, [first], cur);
});
DV_ALL.forEach((s, i) => {
  if (!s.played) return;
  const ed = phParse(s.date); const cur = i === 0;
  const first = cur ? { at: phAt(ed, 18, 30), status: DV_END.won, src: DV_DONE, sid: 'delve', open: phSess('delve'), now: { status: PH_LIVE, open: phSess('delve-live') } }
    : { at: phAt(ed, 18, 30, i % 3), status: DV_END[s.end], src: s, sid: dvSid(s), open: phSess(dvSid(s)) };
  phEd('delve', s.id, s.title, ed, [first], cur);
});
// No editions: each day is its own entry. A day started over is a new day, listed like any other.
HG_DAYS.forEach((x, i) => {
  const d = phParse(x.date);
  phEd('hunter', x.id, x.title, d, [{ at: phAt(d, 9 + (i % 4), 15), status: hgStatus(x), src: x, sid: hgSid(x), open: phSess(hgSid(x)) }]);
});
// The Barrow's Chapter 1, finished: the game's one play record. Every Barrow surface reads it (head card, Your chapters, History,
// the Library row, the chapters list, the session page, achievements). Shown only while that record stands (phVisible).
phEd('barrow', 'bw1', BW_T1, PH_TODAY, [{ at: phAt(PH_TODAY, 19, 45), status: { kind: 'ok', label: 'Quest complete' }, src: BW_REC1, sid: 'gs-pu-barrow-ch1', open: phSess('gs-pu-barrow-ch1') }]);
PH_ALL = PH_PLAYS.slice().sort((a, b) => b.at - a.at);
// State library-word-streak-broken (Config-less: review.broken): yesterday's Daily Word was finished in a first play that
// failed. History shows that play in place of the log's seeded one, as the game page does.
PH_BROKEN = (() => {
  const e = PH_EDS.word1; if (!e) return [];
  const f = e.plays[0]; const c = PZ.word;
  return [{ ...f, pid: 'word1-broken-0', status: { kind: 'bad', label: c.bad }, open: phSess('word-broken-first') }];
})();
PH_UNF_PLAYS = Object.entries(PH_UNF_EDS).map(([ed, u]) => ({ gid: u.gid, ed, edTitle: u.x.title, edDate: u.x.d, n: 0, cur: false, pid: ed + '-unf', at: u.at, status: PH_UNF, open: phSess(u.sid) }));
// Who sees what. A player keeps History for everything they played.
// Free: Daily Word and Daily Mystery in full, and the first edition of Escape, Delve and the Barrow. Pass ended: those plus every play from before it ended (gsEndedOn), this week's included. A new account: nothing.
// ---- The free first edition's one play record (a free first run or room, or chapter). Every surface reads it: the game page's head
// card, its list of plays, History, the Library row, the editions list, the case or session page and its achievements. Its date is
// the day it was played. It has an in-progress form and an ended form, switched by the same control as this week's play
// (cprFirstState reads it), or not started. ----
PH_FIRST = { delve: DV_ALL[DV_ALL.length - 1].id, escape: PZ.escape.all[PZ.escape.all.length - 1].id, barrow: 'bw1' };
PH_FIRST_LIVE = { delve: phSess('delve-first-live'), escape: phSess('escape-first-live') };
// A record shows the time it was played.
PH_PLAYS.concat(PH_BROKEN).forEach((p) => [p, p.now && { ...p, ...p.now }].filter(Boolean).forEach((q) => {
  let id = null; try { q.open({ go: (n, a) => { if (n === 'session' && a) id = a.id; } }); } catch (e) {}
  const s = id && GS_SESSIONS[id]; if (!s || s.__dated) return;
  s.__dated = true; s.phEd = q.ed; s.date = pzLong(q.at) + ', ' + phTime(q.at);
}));
// The free first run and room in progress: the same play as this week's, the record so far (one edition each so far).
(() => {
  const dv = GS_SESSIONS.delve;
  GS_SESSIONS['delve-first-live'] = { ...GS_SESSIONS['delve-live'], date: dv.date, __dated: true };
  const es = GS_SESSIONS['escape-week'];
  GS_SESSIONS['escape-first-live'] = { ...GS_SESSIONS['escape-live'], date: es.date, lines: es.lines.slice(0, 4), __dated: true };
})();
}
