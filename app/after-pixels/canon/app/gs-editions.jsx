import React from 'react';
import { GS_GAME_ORDER, gsRhythm, GS_GAMES, gsStartsOver, GS_ONCE_LINE, gsScrollTop, useGs, DS } from './gs-data.jsx';
import { useGsPart, GsPart } from './gs-site.jsx';
import { GsNeedsPass } from './gs-session.jsx';
import { lbShort, LbBack, LbTools, LbChoice, LbResult } from './gs-library.jsx';
import { gsPromptText, GsCopyPrompt, GsHowLink, GsPrompt } from './gs-connect.jsx';
import { edList, edName, edNeedsPass, phHay, phParse, phNorm, phMatch, PhPages, edLabel } from './gs-history.jsx';
import { GS_LIBRARY } from './registry.js';

export let ED3;
const pgeW = (gid, n = 0) => GS_GAMES[gid].ed[n];
// Only the dailies go by number. A game whose editions are named scenarios shows the name alone, no number anywhere.
const pgeNoNum = (gid) => !GS_GAMES[gid].daily && gsRhythm(gid) !== 'daily';
let PGE_INFO;
let PGE_LEN;
let PGE_WORDNUM;
const pgeRowTitle = (gid, e) => (PGE_WORDNUM.includes(gid) ? pgeW(gid).charAt(0).toUpperCase() + pgeW(gid).slice(1) + ' ' + e.n + ' · ' + e.title : e.title && !pgeNoNum(gid) ? '#' + e.n + ' · ' + e.name : e.name);
const pgeAnd = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const pgeInfo = (e) => ({ line: typeof PGE_INFO[e.gid] === 'string' ? PGE_INFO[e.gid] : '', len: PGE_LEN[e.gid], who: null });
// A game with no schedule prints no edition date (Casebook, the Barrow).
const pgeDated = (gid) => !GS_GAMES[gid].eds;

// ---- One game's editions, newest first, each once. No result: those are History's. ----
// Played: a finished play. Not played, in progress and not finished carry no mark.
const pgePlayed = (e) => !!e.status && e.status.kind !== 'none' && e.status.kind !== 'live';
const pgeEds = (gs, gid) => edList(gs, gid).map((e) => ({ ...e, name: edName(e), when: pgeDated(gid) && e.date ? lbShort(e.date) : undefined, played: pgePlayed(e), live: !!e.status && e.status.kind === 'live', held: edNeedsPass(gs, e), info: pgeInfo(e),
  hay: phHay(gid, e.key, e.title, pgeDated(gid) && e.date ? phParse(e.date) : null) + ' ' + pgeRowTitle(gid, { ...e, name: edName(e) }).toLowerCase() }));
// A finished chapter (gsStartsOver) says it was played, and, where this player can play it, that it can be started over from the prompt below.
const pgePlayedText = (e) => (e.live ? 'You’re partway through this ' + pgeW(e.gid) + '.' : 'You’ve played this ' + pgeW(e.gid) + '.' + (gsStartsOver(e.gid) && !e.held ? ' To start it over, paste this into your AI.' : ''));
let pgeOnceText;

// The list's own state, kept in the history entry (route.pgeList) so browser Back returns it as it was left.
const pgeScroll = (el) => { for (let n = el && el.parentElement; n; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight) { n.scrollTop = 0; return; } } gsScrollTop(); };
const usePgeList = (gid) => {
  const gs = useGs(); const k0 = (gs.route.pgeList && gs.route.pgeList.gid === gid && gs.route.pgeList) || {};
  const [st, setSt] = React.useState({ q: k0.q || '', show: k0.show || 'all', sort: k0.sort || 'new', pg: k0.pg || 0, open: k0.open || gs.route.pgeOpen || null });
  React.useEffect(() => { gs.keep({ pgeList: { gid, ...st } }); }, [st]);
  const wait = useGsPart([st.q, st.show, st.sort, st.pg]);
  const box = React.useRef(null);
  const set = (k, v) => setSt((p) => ({ ...p, [k]: v, pg: k === 'pg' ? v : k === 'open' ? p.pg : 0 }));
  const clear = () => setSt((p) => ({ ...p, q: '', show: 'all', pg: 0 }));
  const s = phNorm(st.q);
  const all = pgeEds(gs, gid);
  let items = all.filter((x) => (st.show === 'all' || (st.show === 'played' && x.played) || (st.show === 'none' && !x.played) || (st.show === 'can' && !x.held)) && phMatch(x.hay, s));
  if (st.sort === 'old') items = items.reverse();
  const size = 24; const pages = Math.max(1, Math.ceil(items.length / size));
  // An edition opened from the library game page's row starts on its own page of the list.
  let pg = Math.min(st.pg, pages - 1);
  if (!k0.pg && st.open && st.pg === 0) { const i = items.findIndex((x) => x.key === st.open); if (i >= size) pg = Math.floor(i / size); }
  return { ...st, s, wait, box, set, clear, pages, pg, rows: items.slice(pg * size, pg * size + size), go: (x) => { set('pg', x); pgeScroll(box.current); } };
};
// A search or filter that finds nothing: the design system's line and Clear all, as History and Library (ui-standard.md, Designed empty states).
const PgeEmpty = ({ f }) => <div className="gs-nomatch"><p>Nothing matches that.</p><DS.TextLink onClick={f.clear}>Clear all</DS.TextLink></div>;
export const pgeList = (gs, gid, extra) => gs.go(GS_GAMES[gid].route, { page: 'record', list: true, ...(extra || {}) });
const pgeHistory = (gs, gid, e) => gs.go('history', e ? { game: gid, q: pgeNoNum(gid) ? e.title : '#' + e.n, from: gid } : { game: gid, from: gid });

// ---- The list: back to the game, H1, search and Filters (Show, Order), then one row per edition ----
export const PgeListPage = ({ gid }) => {
  const gs = useGs(); const g = GS_GAMES[gid]; const f = usePgeList(gid);
  const fromLib = !!gs.route.fromLib; const title = g.edAll || 'Every ' + pgeW(gid);
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={g.name} onClick={() => (fromLib ? gs.back() : gs.go(g.route, { page: 'record' }))} />
      <h1 className="gs-h1">{title}</h1>
      <div className="lb-alllay">
        <LbTools>
          <DS.SearchField label="Search" placeholder={!pgeDated(gid) ? 'A name' : pgeNoNum(gid) ? 'A name or date' : 'A number, name or date'} value={f.q} onChange={(e) => f.set('q', e.target.value)} />
          <LbChoice label="Show" value={f.show} opts={[['all', title], ['none', 'Not played']]} onPick={(v) => f.set('show', v)} />
          <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={(v) => f.set('sort', v)} />
        </LbTools>
        {!f.wait && !f.rows.length ? <PgeEmpty f={f} /> : <div ref={f.box} className="lb-box lb-results ed-results" style={{ maxWidth: 960, minWidth: 0 }}>
          {f.wait ? <GsPart label="Loading" /> : <>
            {<DS.RowList label={title}>{f.rows.map((e) => (
              <DS.ListRow key={e.key} title={pgeRowTitle(gid, e)} when={e.when} result={e.played ? 'Played' : undefined} onClick={() => f.set('open', e.key)} />
            ))}</DS.RowList>}
            <PhPages pg={f.pg} pages={f.pages} go={f.go} />
          </>}
        </div>}
      </div>
      <PgeEdPanel gid={gid} k={f.open} onClose={() => f.set('open', null)} />
    </main>
  );
};

// ---- The edition in a panel over the list, its prompt inside, no play dialog. ----
// KEEP: under 640px the panel is a bottom sheet.
// The open edition is the list's own state (f.open), kept in the history entry, so Back from "See in History" returns with it open.
const PgeEdPanel = ({ gid, k, onClose }) => {
  const gs = useGs(); const g = GS_GAMES[gid]; const last = React.useRef(null);
  const e0 = k ? pgeEds(gs, gid).find((x) => x.key === k) : null; if (e0) last.current = e0; const e = last.current;
  if (!e) return null;
  const text = gsPromptText({ kind: 'edition', e });
  // A finished edition of a game played once has nothing left to play: its result and the played-once line, no prompt, no Copy, no Pass line.
  // A finished chapter keeps its prompt as the start-over only where this player can play it; one that needs the Pass says so instead.
  // Every played panel ends on See in History, full width.
  const done = e.played && !gsStartsOver(gid); const prompt = !done && !e.held;
  const when = !pgeDated(gid) ? null : gsRhythm(gid) === 'weekly' ? 'week of ' + e.date : e.date;
  const hist = e.played && <DS.Button variant="secondary" block onClick={() => pgeHistory(gs, gid, e)}>See in History</DS.Button>;
  const acts = prompt && e.played ? <div className="gs-stack-sm" style={{ display: 'grid', width: '100%' }}><GsCopyPrompt text={text} block />{hist}</div> : prompt ? <GsCopyPrompt text={text} block /> : undefined;
  return (
    <DS.Popup kind="panel" open={!!e0} onClose={onClose} title={e.title || edLabel(e)} actions={acts}>
      <div className="pge-panel">
        <span className="gs-label">{[e.title && (pgeNoNum(gid) ? g.name : g.name + ' #' + e.n), when, e.info.len].filter(Boolean).join(' · ').toUpperCase()}</span>
        {e.info.line && <p style={{ margin: 0 }}>{e.info.line}</p>}
        {e.info.who && <p className="gs-muted" style={{ margin: 0 }}>{e.info.who}</p>}
        {done ? (
          <div className="pge-done">
            <LbResult s={e.status} />
            <p style={{ margin: 0 }}>{pgeOnceText}</p>
            {hist}
          </div>
        ) : e.played && <p className="gs-muted" style={{ margin: 0 }}>{pgePlayedText(e)}</p>}
        {done ? null : e.held ? <div className="gs-stack-md" style={{ marginTop: e.played ? 0 : -8 }}><GsNeedsPass gid={gid} />{hist}</div> : prompt && (
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
export const registerEditions = () => {
  ED3.forEach((id) => {
    const L0 = GS_LIBRARY[id];
    GS_LIBRARY[id] = () => { const gs = useGs(); const r = gs.route;
      if (r.list && !r.sid) return <PgeListPage key={id} gid={id} />;
      return <L0 />; };
  });
};

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsEditions() {
// ============================================================================
// After Pixels — a game's editions.
// Every game that releases editions (gsRhythm): "Every word / room / case / run" under the library game page's title opens the list
// (route { page: 'record', list: true }); each row opens the edition in a panel over the list, its prompt inside.
// No route leads to one edition. The list is settled; the panel is not ratified yet.
// What an edition says about itself is SAMPLE text (PGE_INFO). Loads after gs-history.jsx, before main.jsx.
// ============================================================================
ED3 = GS_GAME_ORDER.filter((k) => gsRhythm(k) || GS_GAMES[k].eds);
// ---- SAMPLE: what an edition says about itself. The app holds only number, title and date. No source has a per-edition line
// for the four story games, so their editions carry none. ----
PGE_INFO = {
  word: 'Five letters. Six guesses.',
  groups: 'Sixteen words hide four groups. Find all four.',
  mystery: 'One suspect, one weapon, one room. One accusation.',
  where: 'You get six guesses to find the country.',
  chain: 'You get both ends. Find the words between.',
  salvage: 'You get thirty dives to find five wrecks.',
};
PGE_LEN = { word: '10 min', groups: '10 min', mystery: '10 min', where: '5 min', chain: '10 min', salvage: '15 min', escape: 'About 30 min', casebook: '25–40 min', delve: '25–40 min', barrow: 'Several sessions' };
// Escape, Casebook, Delve and the Barrow name an edition by its word and number beside its title: “Room 1 · The Clockmaker’s Study”.
PGE_WORDNUM = ['escape', 'casebook', 'delve', 'barrow'];
// A finished edition of a game played once: what it was, and the played-once line (GS_ONCE_LINE).
pgeOnceText = GS_ONCE_LINE;
}
