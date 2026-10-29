// After Pixels — Library and the library game pages.
// Declares GsLibrary (Library, with New for you, Your games and the free player's Pass line),
// gsLibRow (every row read from the play record), PzNow (the daily games' now card) and CbNow (Casebook's), each plus
// the link once finished, GS_LIBRARY.word / groups / mystery in every view, and GS_LIBRARY.casebook / delve / escape / barrow.
// Each page body is canon's composition with the first-part card (CprFirst) or the design system's Needs the Pass card (LbNeedsPass)
// in the now card's place. For Casebook, Delve and Escape a Pass holder gets canon's page; the Barrow has no canon page.
// Canon's library pages for the games a Pass holder still gets them for: copied from GS_LIBRARY in registerPassLibrary().
import React from 'react';
import { useGs, DS, GS_SESSIONS, gsLapsed, GS_GAMES, GS_NAME, gsFresh, gsTodayPlayed, gsRhythm, gsForms, GS_RHYTHMS } from './gs-data.jsx';
import { useGsPart, GsPart } from './gs-site.jsx';
import { GsTile } from './gs-parts.jsx';
import { gsShareText } from './gs-session.jsx';
import { GS_PAGES } from './gs-game.jsx';
import { LbResult, LbShare, lbAchEarned, lbAchView, lbAccess, lbWeekDone, LbHead, LbAch, LbRunPass, lbRunOf, lbFrozen, LbRun, lbNow, lbStreak, lbPast, LbTools, LbChoice } from './gs-library.jsx';
import { DP_IDS } from './gs-where-chain-salvage.jsx';
import { CB_ACH, CB_BADGES, cbRecap, cbShareLines } from './gs-casebook-data.jsx';
import { cbStatus, cbGo } from './gs-casebook.jsx';
import { DV_FIRST, dvRecap, DV_LIVE, dvBar, DV_DONE, dvStatus, DV_ACH, DV_ALL, dvRun, DV_BADGES } from './gs-delve-library.jsx';
import { PZ, pzRun } from './gs-puzzles-library.jsx';
import { BW_CH1, bwEds, BW_CH2, BW_ACH, BW_BADGES } from './gs-barrow-library.jsx';
import { GS_LIB_READY, gsFind, GS_KINDS, gsKind } from './gs-discover.jsx';
import { phVisible, phAch, LbRecent, phWhen, PH_FIRST, PhLead, edList } from './gs-history.jsx';
import { PgeListPage } from './gs-editions.jsx';
import { useCpr, cprFirstState, CprPassEnd, cprEditions, cprLapsedOf, cprStore, cprLocked, CPR_STAGE, cprPlayed, CPR_SHOWN } from './gs-pass-store.jsx';
import { EsNow } from './gs-escape.jsx';
import { WdNow } from './gs-word.jsx';
import { DlNow } from './gs-delve.jsx';
import { GS_LIBRARY } from './registry.js';

const CPR_SHIP_LIB = {};

// The link under a finished daily or weekly game: Library as it is, New for you on top, never filtered.
export const GsNextLink = () => {
  const gs = useGs(); if (gs.view === 'out') return null;
  return <div className="gs-pu-nextlink"><DS.TextLink onClick={() => gs.go('library')}>See what’s out for you to play</DS.TextLink></div>;
};

// ---- The free first part's card: Play before and during; once done, the result, Share and the record link, then
// "Keep playing with the Pass." with "the Pass" linked and no button. ----
// One edition each so far: Run 1 and Room 1 are each the free first edition and the current
// one, so these cards print the same recaps as the Pass holder's.
const cprEscFirst = () => PZ.escape.all[PZ.escape.all.length - 1];
let CPR_FIRST;
const CprFirst = ({ id }) => {
  const gs = useGs(); useCpr(); const f = CPR_FIRST[id](gs);
  const st = cprFirstState(gs, id); const done = st === 'done';
  // Escape's first room, once played or started: Escape's own now card (app/gs-escape.jsx), in this card's label.
  if (id === 'escape' && st !== 'none' && EsNow) return <EsNow label={f.label} title={f.title} noNext={!f.weekly || gsLapsed(gs)}>{done && gs.view !== 'pass' && <CprPassEnd className="gs-muted gs-pu-wrap" text="Keep playing with the Pass." />}</EsNow>;
  // Delve's first run, once played or started: Delve's own now card (app/gs-delve.jsx), as Escape's above.
  if (id === 'delve' && st !== 'none' && DlNow) return <DlNow s={done ? DV_DONE : DV_LIVE} label={f.label} sids={['delve-first', 'delve-first-live']} next={null} noNext={!f.weekly || gsLapsed(gs)}>{done && gs.view !== 'pass' && <CprPassEnd className="gs-muted gs-pu-wrap" text="Keep playing with the Pass." />}</DlNow>;
  const bar = st === 'live' ? f.liveBar : done ? f.doneBar : null;
  // The Barrow's next chapter is for Pass holders only: a free or Pass-ended player can't play it.
  const soon = id === 'barrow' && gs.view === 'pass' ? <span className="gs-muted gs-pu-soon">Chapter 3: coming soon</span> : null;
  // A Pass holder past Chapter 1 sees Chapter 2 ready: its own card, with Play (no Chapter 2 play is staged).
  if (id === 'barrow' && gs.view === 'pass' && done) return (
    <section className="lb-card gs-pu-first" style={{ gridColumn: '1 / -1' }}>
      <div className="lb-top"><div className="gs-stack-xs"><span className="gs-label">{GS_PAGES.barrow.week2.label}</span><h2 className="mcp-t-sec">{BW_CH2.title}</h2></div></div>
      <p>{BW_CH2.line}</p>
      <div className="lb-foot">
        <div className="lb-acts"><DS.Button onClick={() => gs.playReq({ kind: 'edition', e: bwEds(gs)[0] })}>Play</DS.Button></div>
        {soon}
      </div>
    </section>
  );
  return (
    <section className={'lb-card gs-pu-first' + (done ? ' is-done' : '')} style={id === 'barrow' || id === 'casebook' ? { gridColumn: '1 / -1' } : undefined}>
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{f.label}</span><h2 className="mcp-t-sec">{f.title}</h2></div>
        {(st === 'live' || done) && <span className="lb-big"><LbResult s={st === 'live' ? { kind: 'live', label: 'In progress' } : f.result} /></span>}
      </div>
      <p>{st === 'live' ? f.live : done ? f.done : f.none}</p>
      {bar && <DS.ProgressBar label={bar[0]} value={bar[1]} max={bar[2]} showValue={false} />}
      <div className="lb-foot">
        <div className="lb-acts">
          {done ? <>{f.over && <DS.Button variant="secondary" onClick={f.play}>Start over</DS.Button>}<LbShare lines={f.share} /><DS.TextLink onClick={f.open}>{f.rec}</DS.TextLink></> : <DS.Button onClick={f.play}>Play</DS.Button>}
        </div>
        {soon}
      </div>
      {done && gs.view !== 'pass' && <CprPassEnd className="gs-muted gs-pu-wrap" text="Keep playing with the Pass." />}
      {done && f.weekly && !gsLapsed(gs) && <GsNextLink />}
    </section>
  );
};

// ---- Needs the Pass: the design system's card wherever the play control would be and this player can't play without the Pass.
// had: the player played this game with a Pass that has ended; otherwise the never-had form. Every slot is filled by the system's
// rule (NeedsPass.prompt.md) from the game's facts and the player's own record: the play record (phVisible), never typed text.
// A game with editions passes its edition word; a standalone (36,000 Summers Ago) passes none, so the card reads "Last played"
// and "Play the whole game." The card takes the now card's place and size; the Barrow's spans the row, as its chapter card does. ----
const cprIso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
export const LbNeedsPass = ({ id, had, ach, access }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const items = ach || [];
  const word = cprEditions(id) && g.ed ? g.ed[0] : undefined; const words = word ? g.ed[1] : undefined;
  let record = null;
  if (had) {
    const earned = lbAchEarned(lbAchView(items, access || lbAccess(gs, id), gs));
    const plays = phVisible(gs).filter((p) => p.gid === id); const eds = new Set(plays.map((p) => p.ed));
    // The Barrow: the chapters in the record (Your chapters), the latest by number.
    if (id === 'barrow') { const ch = Math.max(1, ...plays.map((p) => +p.ed.replace(/\D/g, '') || 1)); record = { chapter: ch, played: eds.size, earned }; }
    else record = { last: plays[0] ? cprIso(plays[0].at) : '', played: eds.size, earned };
  }
  return <DS.NeedsPass game={GS_NAME[id] || g.name} word={word} words={words} record={record} total={items.length} onGet={() => gs.go('pass')} style={id === 'barrow' || id === 'casebook' ? { gridColumn: '1 / -1' } : undefined} />;
};
const cprNowCard = (gs, id, ach) => { const f = cprLapsedOf(id); return gsLapsed(gs) && f.used && f.pass ? <LbNeedsPass id={id} had ach={ach} /> : <CprFirst id={id} />; };
const cprKey = (gs) => gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (gsFresh(gs) ? 'f' : '') + cprStore.get().lapsed;

// ---- The library game pages for a free or Pass-ended player (canon's composition). Casebook is Pass-only, as Daily Groups:
// never played, the never-had Needs the Pass card alone; played before the Pass ended, that card with the record. ----
const CprCbLibrary = () => {
  const gs = useGs();
  if (gs.route.list && !gs.route.sid) return <PgeListPage key="casebook" gid="casebook" />;
  if (gs.view === 'pass' || gs.route.sid) return <CPR_SHIP_LIB.casebook />;
  const had = gsLapsed(gs) && phVisible(gs).some((p) => p.gid === 'casebook');
  const ach = phAch(gs, 'casebook', CB_ACH);
  if (!had) return <main key={cprKey(gs)} className="gs-wrap gs-main"><LbHead id="casebook" /><div className="lb-lay"><LbNeedsPass id="casebook" ach={CB_ACH} access="all" /></div></main>;
  return (
    <main key={cprKey(gs)} className="gs-wrap gs-main">
      <LbHead id="casebook" />
      <div className="lb-lay">
        <LbNeedsPass id="casebook" had ach={ach} access="all" />
        <LbAch items={ach} badges={CB_BADGES} access="all" ed={GS_GAMES.casebook.ed} />
        <LbRecent title="Your cases" allLabel="See in History" empty="Your cases appear here once you have played one." />
      </div>
    </main>
  );
};
const CprDvLibrary = () => {
  const gs = useGs();
  if (gs.route.list && !gs.route.sid) return <PgeListPage key="delve" gid="delve" />;
  if (gs.view === 'pass') return <CPR_SHIP_LIB.delve />;
  const access = lbAccess(gs, 'delve'); const lapsed = gsLapsed(gs); const fresh = gsFresh(gs);
  const ach = phAch(gs, 'delve', DV_ACH);
  return (
    <main key={cprKey(gs)} className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className="lb-lay">
        {cprNowCard(gs, 'delve', ach)}
        {!lapsed && <LbRunPass unit="weeks" weeks={lbRunOf(DV_ALL)} />}
        {lapsed && (() => { const list = dvRun(gs); const f = lbFrozen(lbRunOf(list), list, (s) => s.date); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={ach} badges={DV_BADGES} access={access} ed={GS_GAMES.delve.ed} />
        <LbRecent title="Your runs" allLabel="See in History" empty="Your runs appear here once you have played one." />
      </div>
      {/* Earlier runs come with the Pass (delve.md section 4); a Pass holder gets canon's page, so never sees it. "the Pass" is the line's only link, as the dailies'. */}
      <CprPassEnd className="gs-muted gs-pu-wrap" text={'Playing earlier ' + GS_GAMES.delve.ed[1] + ' comes with the Pass.'} />
    </main>
  );
};
// Escape as a free first edition (staging): its first room's achievements are the ones a free player can earn.
const CprEsLibrary = () => {
  const gs = useGs();
  if (gs.route.list && !gs.route.sid) return <PgeListPage key="escape" gid="escape" />;
  if (gs.view === 'pass') return <CPR_SHIP_LIB.escape />;
  const c = PZ.escape; const lapsed = gsLapsed(gs);
  // The first room's achievements are the ones a free player can earn; Regular and Ten Rooms need more rooms (the Pass).
  const items = phAch(gs, 'escape', c.ach.map((a) => ({ ...a, first: !a.of })));
  return (
    <main key={cprKey(gs)} className="gs-wrap gs-main">
      <LbHead id="escape" />
      <div className="lb-lay">
        {cprNowCard(gs, 'escape', items)}
        {!lapsed && <LbRunPass unit="weeks" weeks={lbRunOf(c.all)} />}
        {lapsed && (() => { const run = pzRun(gs, 'escape'); const f = lbFrozen(lbRunOf(run), run, (y) => y.date); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={items} badges={c.badges} access={lbAccess(gs, 'escape')} ed={GS_GAMES.escape.ed} />
        <LbRecent title="Your rooms" allLabel="See in History" empty="Your rooms appear here once you have played one." />
      </div>
      {/* Earlier rooms come with the Pass (escape.md section 4). */}
      <CprPassEnd className="gs-muted gs-pu-wrap" text={'Playing earlier ' + GS_GAMES.escape.ed[1] + ' comes with the Pass.'} />
    </main>
  );
};
// The Barrow, every view. Achievements and Your chapters read the chapter's record.
const CprBwLibrary = () => {
  const gs = useGs(); useCpr(); const st = cprFirstState(gs, 'barrow');
  // The chapters list sits inside the game's library route (gs-editions.jsx), as every game's does.
  if (gs.route.list && !gs.route.sid) return <PgeListPage key="barrow" gid="barrow" />;
  const ach = phAch(gs, 'barrow', BW_ACH);
  return (
    <main key={cprKey(gs) + st} className="gs-wrap gs-main">
      <LbHead id="barrow" />
      <div className="lb-lay">
        {gs.view === 'pass' ? <CprFirst id="barrow" /> : cprNowCard(gs, 'barrow', ach)}
        <LbAch items={ach} badges={BW_BADGES} access={lbAccess(gs, 'barrow')} ed={GS_GAMES.barrow.ed} />
        <LbRecent title="Your chapters" allLabel="See in History" empty="Your chapters appear here once you have played one." />
      </div>
    </main>
  );
};

// ---- The daily games' Library pages: canon's (app/gs-puzzles-library.jsx pzLibrary), in every view, with "the Pass"
// as the line's only link in place of the separate About the Pass. The editions list stays where gs-editions.jsx puts it. ----
const cprPzLibrary = (id) => () => {
  const gs = useGs(); const r = gs.route;
  if (r.list && !r.sid) return <PgeListPage key={id} gid={id} />;
  const c = PZ[id]; const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (gs.review.today || '');
  const [recent] = c.plays;
  const locked = cprLocked(gs, id); const had = locked && gsLapsed(gs) && phVisible(gs).some((p) => p.gid === id);
  // Never played and can't play it: the never-had Needs the Pass card alone, as 36,000 Summers Ago's.
  if (locked && !had) return <main key={k} className="gs-wrap gs-main"><LbHead id={id} /><div className="lb-lay"><LbNeedsPass id={id} ach={c.ach} access="all" /></div></main>;
  const never = gs.review.never === id || gsFresh(gs);
  const now = never ? null : lbNow(gs, id); // The broken streak changes yesterday's play only (phLog); today's head reads today's play.
  const none = !now;
  // The run and every count from the record. A Pass-ended player's days after the Pass ended are frozen.
  const run = pzRun(gs, id); const fz = had ? lbFrozen(lbRunOf(run), run, (x) => x.date) : null;
  const n = fz ? fz.n : lbStreak(run);
  const ach = phAch(gs, id, c.ach, n);
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id={id} />
      <div className="lb-lay">
        {locked ? <LbNeedsPass id={id} had ach={ach} access="all" /> : <PzNow c={c} done={lbWeekDone(gs)} none={none} id={id} />}
        <LbRun n={n} unit={c.weekly ? 'weeks' : 'days'} weeks={fz ? fz.weeks : lbRunOf(run)} />
        <LbAch items={ach} badges={c.badges} access="all" />
        <LbRecent title={recent} allLabel="See in History" empty={recent + ' appear here once you have played one.'} />
      </div>
      {gs.view !== 'pass' && !locked && <CprPassEnd className="gs-muted gs-pu-wrap" text={'Playing earlier ' + GS_GAMES[id].ed[1] + ' comes with the Pass.'} />}
    </main>
  );
};

// ---- Library rows, read from the play record: the latest play this player's record holds (phVisible) gives the row's date,
// and the row's line says what that play left: in progress, done, or what is ready next. A game whose next play needs the Pass
// keeps its last-play date. One date form (phWhen). ----
const cprRow = (result, tone, when, at) => ({ result, tone, when, at });
let CPR_FREE_READY;
let CPR_PASS_READY;
const gsLibRow = (gs, k) => {
  const pass = gs.view === 'pass';
  if (GS_GAMES[k].added) return cprRow(pass ? GS_LIB_READY[k] : 'Pass only', null, '', 0);
  const p = phVisible(gs).find((x) => x.gid === k);
  const row = (result, tone) => cprRow(result, tone || null, p ? phWhen(p.at) : '', p ? p.at.getTime() : 0);
  if (p && p.status.kind === 'live') return row('In progress');
  if (!pass && CPR_STAGE[k] === 'first') {
    if (p && PH_FIRST[k] === p.ed) return row('Free ' + GS_GAMES[k].ed[0] + ' done', 'ok');
    return row(cprFirstState(gs, k) === 'none' ? CPR_FREE_READY[k] : 'Pass only');
  }
  if (cprLocked(gs, k) || lbAccess(gs, k) === 'none') return row('Pass only');
  if (k === 'barrow') return row(p ? 'Chapter 2 is ready' : GS_LIB_READY.barrow);
  if (k === 'hunter') return row(GS_LIB_READY.hunter);
  if (p && p.cur) return row(k === 'casebook' ? 'Every case done' : PZ[k] && !PZ[k].weekly ? 'Done today' : 'Done this week', 'ok');
  return row(GS_LIB_READY[k] || CPR_PASS_READY[k] || null);
};

// ---- Library (route `library`): canon's search, filters and rows, with New for you on top and Your games under it.
// New for you: games with editions whose current edition you haven't played, as tiles in one sideways row. A standalone never
// goes in it. Not shown when there is nothing new. Every free player (Pass ended included) gets one Pass line under the list. ----
// New for you: only what the player can play now. A free player: today's free dailies not yet played and any
// free first part not yet started. A Pass holder: as before.
const cprNewFor = (gs, k) => {
  if (!cprEditions(k) || cprLocked(gs, k)) return false;
  if (gs.view === 'pass') return !cprPlayed(gs, k);
  // Config's Most not played only changes which dailies count as unplayed; the playable-now rule still decides.
  if (CPR_STAGE[k] === 'daily') return gsFresh(gs) || (cprStore.get().newEds === 'most' ? k !== 'word' : !gsTodayPlayed(gs)[k]);
  if (CPR_STAGE[k] === 'first') return cprFirstState(gs, k) === 'none';
  return false;
};
export const GsLibrary = () => {
  const gs = useGs(); useCpr();
  const [q, setQ] = React.useState(''); const [cat, setCat] = React.useState(gs.route.kind || 'all'); const [sort, setSort] = React.useState('last');
  const [rhy, setRhy] = React.useState(gs.route.rhythm || 'all');
  React.useEffect(() => { setCat(gs.route.kind || 'all'); setRhy(gs.route.rhythm || 'all'); }, [gs.route]);
  const wait = useGsPart([q, cat, rhy, sort]);
  const lay = React.useRef(null);
  const showAll = () => { setQ(''); setCat('all'); setRhy('all'); setTimeout(() => { const i = lay.current && lay.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
  const rows = {}; CPR_SHOWN.forEach((k) => { rows[k] = gsLibRow(gs, k); });
  const az = (a, b) => GS_GAMES[a].name.localeCompare(GS_GAMES[b].name);
  const listed = CPR_SHOWN.filter((k) => (lbAccess(gs, k) !== 'none' && !cprLocked(gs, k)) || lbPast(gs));
  const ids = listed.filter((k) => (cat === 'all' || GS_GAMES[k].category === cat) && (rhy === 'all' || gsRhythm(k) === rhy) && gsFind(q, k))
    .sort((a, b) => (sort === 'az' ? az(a, b) : rows[b].at - rows[a].at || CPR_SHOWN.indexOf(a) - CPR_SHOWN.indexOf(b)));
  const fresh = ids.filter((k) => cprNewFor(gs, k)); const mine = ids.filter((k) => !fresh.includes(k));
  const row = (k) => { const g = GS_GAMES[k]; const me = rows[k]; return <DS.ListRow key={k} lead={<PhLead gid={k} />} title={g.name} result={gsForms(me.result)} tone={me.tone || undefined} when={me.when || undefined} onClick={() => gs.go(g.route, { page: 'record' })} />; };
  const list = (ks) => <div className="lb-box"><DS.RowList label="Library">{ks.map(row)}</DS.RowList></div>;
  const tile = (k) => <GsTile key={k} id={k} pass={cprLocked(gs, k)} page="record" />;
  // A filter or search that finds nothing: the design system's line and Clear all (ui-standard.md, Designed empty states).
  const empty = <div className="gs-nomatch"><p>Nothing matches that.</p><DS.TextLink onClick={showAll}>Clear all</DS.TextLink></div>;
  const free = gs.view === 'free';
  return (<>
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Library</h1>
      <div className="lb-alllay" ref={lay}>
        <LbTools>
          <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Genre" value={cat} opts={[['all', 'All games'], ...GS_KINDS.map((c) => [c, gsKind(c)])]} onPick={setCat} />
          <LbChoice label="Schedule" value={rhy} opts={[['all', 'All games'], ...GS_RHYTHMS]} onPick={setRhy} />
          <LbChoice label="Order" value={sort} opts={[['last', 'Last played'], ['az', 'A to Z']]} onPick={setSort} />
        </LbTools>
        <div className="gs-pu-libbody">
          {wait ? <GsPart label="Loading games" /> : !ids.length ? empty : fresh.length ? <>
            <section className="gs-pu-libgrp"><DS.CardRow title="New for you" kind="tiles">{fresh.map(tile)}</DS.CardRow></section>
            {mine.length > 0 && <section className="gs-pu-libgrp"><h2 className="mcp-t-sec">Your games</h2>{list(mine)}</section>}
          </> : list(ids)}
        </div>
        {free && !wait && ids.length > 0 && <CprPassEnd className="gs-muted gs-pu-wrap" text="Everything else comes with the Pass." />}
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
  const lines = done && gsShareText ? gsShareText(GS_SESSIONS[c.today]) : null;
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
      {done && <GsNextLink />}
    </section>
  );
};
export const CbNow = ({ c }) => {
  const gs = useGs();
  return (
    <section className="lb-card" style={{ gridColumn: '1 / -1' }}>
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">A CASE</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {!c.live && <span className="lb-big"><LbResult s={cbStatus(c)} /></span>}
      </div>
      <p>{cbRecap(c)}</p>
      <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
      <div className="lb-foot">
        <div className="lb-acts">
          {!c.live && <LbShare lines={cbShareLines(c)} />}
          <DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink>
        </div>
      </div>
      {!c.live && <GsNextLink />}
    </section>
  );
};

// The now card of a library game page. Daily Word's and Escape's own cards (WdNow in gs-word.jsx, EsNow in gs-escape.jsx) take it once
// there is a play, Word's first; every other card is CprPzNow.
export const PzNow = (props) => (props.id === 'word' && !props.none ? <WdNow c={props.c} done={props.done} />
  : props.id === 'escape' && !props.none ? <EsNow label="THIS WEEK" title={props.c.title} next={props.c.next} />
  : <CprPzNow {...props} />);

// Takes the snapshot, then replaces the game pages: main.jsx calls it after every earlier file has registered its own.
export const registerPassLibrary = () => {
  Object.assign(CPR_SHIP_LIB, GS_LIBRARY);
  Object.assign(GS_LIBRARY, { casebook: CprCbLibrary, delve: CprDvLibrary, escape: CprEsLibrary, barrow: CprBwLibrary });
  ['word', 'groups', 'mystery', ...DP_IDS].forEach((id) => { GS_LIBRARY[id] = cprPzLibrary(id); });
};

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsPassLibrary() {
CPR_FIRST = {
  delve: (gs) => ({
    label: 'THE FIRST RUN · FREE', title: DV_FIRST.title, weekly: true,
    none: 'The game’s very first run, the same for everyone. Play it free.',
    live: dvRecap(DV_LIVE), liveBar: dvBar(DV_LIVE),
    done: dvRecap(DV_DONE), doneBar: dvBar(DV_DONE),
    result: dvStatus(DV_DONE), share: gsShareText(GS_SESSIONS['delve-first']), rec: 'See every roll', open: () => gs.go('session', { id: 'delve-first' }), play: () => gs.play('Delve') }),
  escape: (gs) => { const x = cprEscFirst(); return {
    label: 'THE FIRST ROOM · FREE', title: x.title, weekly: true,
    none: 'The game’s very first room, the same for everyone. Play it free.',
    live: PZ.escape.live.line,
    done: PZ.escape.done.line,
    result: PZ.escape.done.st, share: gsShareText(GS_SESSIONS['escape-week']), rec: 'See every move', open: () => gs.go('session', { id: 'escape-week' }), play: () => gs.play('Escape') }; },
  // The Barrow: Chapter 1's card. A Pass holder's reads A QUEST, a free player's keeps its free label. Finished, it shows the
  // chapter's now line (the record holds no recap of its own) and no bar.
  barrow: (gs) => ({
    label: gs.view === 'pass' ? GS_PAGES.barrow.week.label : 'CHAPTER 1 · FREE', title: BW_CH1.title,
    none: BW_CH1.line,
    done: BW_CH1.line,
    result: { kind: 'ok', label: 'Quest complete' }, share: gsShareText(GS_SESSIONS['gs-pu-barrow-ch1']), rec: 'See every turn', open: () => gs.go('session', { id: 'gs-pu-barrow-ch1' }),
    play: () => gs.playReq({ kind: 'edition', e: bwEds(gs)[1] }), over: true }),
};
// A Pass-ended player's row for a game with a free first part says what a free player's says, never "Pass only" (proposed, not ratified).
CPR_FREE_READY = { escape: 'Your free room is ready', barrow: 'Chapter 1 is ready', delve: 'Your free run is ready' };
CPR_PASS_READY = { casebook: 'Case 1 is ready', delve: 'This week’s run is ready' };
}
