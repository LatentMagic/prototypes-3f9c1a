// ============================================================================
// After Pixels — Discover (route `games`) and Library (route `library`).
// Discover (GsGames) is in gs-pass-discover.jsx and Library (GsLibrary) in gs-pass-library.jsx.
// Their helpers (gsKind, gsKinds, gsFind, GS_ADDED, GS_LIB_READY) are still read.
// ============================================================================
import React from 'react';
import { GS_GAME_ORDER, GS_GAMES, gsNorm, useGs, DS, GS_RHYTHMS, gsRhythm } from './gs-data.jsx';
import { useGsPart, GsPart } from './gs-site.jsx';
import { GsTile } from './gs-parts.jsx';
import { GsPick, GsCard } from './gs-pass-home.jsx';

export const gsKind = (c) => c.charAt(0) + c.slice(1).toLowerCase();
// Read at render, not load, so a game added later (gs-more-games.jsx) still brings its genre.
export const gsKinds = () => GS_GAME_ORDER.map((k) => GS_GAMES[k].category).filter((c, i, a) => a.indexOf(c) === i);
export const gsFind = (q, k) => { const s = gsNorm(q); return !s || gsNorm(GS_GAMES[k].name).includes(s); };
let GS_PICKS;
export let GS_ADDED;
let GS_PASS_BAND;

const DcPassBand = () => {
  const gs = useGs(); if (gs.view === 'pass') return null;
  return (
    <DS.Card>
      <div className="dc-band">
        <p className="gs-lead"><b>{GS_PASS_BAND}</b></p>
        <DS.Button variant="secondary" onClick={() => gs.go('pass')}>About the Pass</DS.Button>
      </div>
    </DS.Card>
  );
};

const DcBody = () => {
  const gs = useGs();
  const [q, setQ] = React.useState(''); const [on, setOn] = React.useState(gs.route.on || []);
  React.useEffect(() => { setOn(gs.route.on || []); }, [gs.route]);
  const kinds = gsKinds().filter((c) => on.includes(c)); const free = on.includes('free');
  const rhy = GS_RHYTHMS.map(([v]) => v).filter((v) => on.includes(v));
  const ids = GS_GAME_ORDER.filter((k) => (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!rhy.length || rhy.includes(gsRhythm(k))) && (!free || GS_GAMES[k].free) && gsFind(q, k));
  const flip = (v) => setOn((a) => (a.includes(v) ? a.filter((x) => x !== v) : a.concat(v)));
  const tools = React.useRef(null);
  const clear = () => { setOn([]); setQ(''); setTimeout(() => { const i = tools.current && tools.current.querySelector('input'); if (i) i.focus({ preventScroll: true }); }, 0); };
  const freeIds = GS_GAME_ORDER.filter((k) => GS_GAMES[k].free);
  const wait = useGsPart([q, on.join()]);
  return <>
    <div className="mcp-gpicks">{GS_PICKS.map(([k, l]) => <GsPick key={k} id={k} label={l} />)}</div>
    <section className="dc-sec">
      <DS.CardRow title="Just added" className="gs-row4">{GS_ADDED.map((k) => <GsCard key={k} id={k} />)}</DS.CardRow>
    </section>
    <section className="dc-sec">
      <DS.CardRow title="Free to play" className="gs-row4" sub="Delve’s first run is free.">{freeIds.map((k) => <GsCard key={k} id={k} />)}</DS.CardRow>
    </section>
    <DcPassBand />
    <section className="dc-sec">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">All games</h2>{on.length || q.trim() ? <DS.TextLink onClick={clear}>Clear</DS.TextLink> : null}</div>
      <div className="dc-tools" ref={tools}>
        <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="dc-chips" role="group" aria-label="Show only">
          {[...gsKinds().map((c) => [c, gsKind(c)]), ...GS_RHYTHMS, ['free', 'Free']].map(([v, l]) => <button key={v} type="button" aria-pressed={on.includes(v)} onClick={() => flip(v)}>{l}</button>)}
        </div>
      </div>
      {wait ? <GsPart label="Loading games" /> : ids.length ? <div className="mcp-gwall">{ids.map((k) => <GsTile key={k} id={k} />)}</div>
        : <div className="dc-empty"><p>No game matches that.</p><DS.TextLink onClick={clear}>Show every game</DS.TextLink></div>}
    </section>
  </>;
};
export let GS_LIB_READY;

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsDiscover() {
// The two picks: chosen by us, not by rule. Seed.
GS_PICKS = [['casebook', 'ONE CASE'], ['word', 'FREE EVERY DAY']];
// Just added: newest first. Seed (the app has no release dates yet).
GS_ADDED = ['barrow', 'casebook', 'delve', 'escape'];
GS_PASS_BAND = 'The Pass opens every game here in full, and every new game on its release day.';
// ---- Library. GsLibrary is in gs-pass-library.jsx. GS_LIB_READY: each game's ready line, read by its rows.
GS_LIB_READY = { barrow: 'Chapter 1 is ready', word: 'Today’s word is ready', groups: 'Today’s groups are ready', mystery: 'Today’s case is ready', where: 'Today’s country is ready', chain: 'Today’s chain is ready', salvage: 'Today’s sea is ready', escape: 'This week’s room is ready', hunter: 'Today’s hunt is ready' };
}
