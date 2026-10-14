// Frame 5C: Discover, tidied (options-v2 §D O6 row 6.1-C). Canon's Discover (DcBody, canon/app/gs-discover.jsx) with ONLY the tidy:
//  - search and chips move above the rows (canon has them ~1,900px down);
//  - each game once on the first screen: Just added and Free to play skip what the picks or the row above already show;
//  - the Pass band becomes a text link, worded without a page-wide "every game" claim (B1.2, Q-G4 b), not a button (B3, Q-G8).
// Kept as canon: picks, Just added, Free to play (with its note), the All games wall. Staged on Joe's free line like 5A/5B:
// Daily Groups and 36,000 Summers Ago (no free part) are not shown; "Free" chip reads Joe's line (PG_FREE_FIRST, pg-landing-5b.jsx).
// Same data state as 5A/5B (PG_STATE): no new fake data. Row cards are canon's GsCard, the wall is canon's GsTile.
const PG_5C_BAND = 'The start of select games comes with your account. The rest comes with the Pass.';
// Part-free cards carry no tag under 1.3-A (review #5): strip canon's "First <noun> free" tag from the games this rig shows. Rig-only runtime patch; 5A/5B show no tags.
PG_SHOWN.forEach((k) => { GS_GAMES[k].tags = GS_GAMES[k].tags.filter((t) => t !== 'FIRST'); });
// 5C-N: the 3.3-A note (once ever), built on GsPushAsk's pattern (canon gs-push.jsx:55): a .gs-pushask region, copy, a dismiss. "Got it" retires it (B3.5).
const PgFirstPartsNote = () => {
  const gs = useGs(); const [gone, setGone] = React.useState(false);
  if (gone) return null;
  return (
    <div className="gs-pushask" role="region" aria-label="Notice" style={{ borderRadius: 'var(--radius-3, 12px)' }}>
      <div className="gs-wrap gs-pushask-in" style={{ alignItems: 'center' }}>
        <p>You’ve played the first part of each game.<br /><button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>Everything else</button> comes with the Pass.</p>
        <DS.TextLink onClick={() => setGone(true)}>Got it</DS.TextLink>
      </div>
    </div>
  );
};
const PgLanding5C = ({ allDone }) => {
  const gs = useGs();
  const [q, setQ] = React.useState(''); const [on, setOn] = React.useState([]);
  const flip = (v) => setOn((a) => (a.includes(v) ? a.filter((x) => x !== v) : a.concat(v)));
  const shown = PG_SHOWN;   // hub's six, in the hub's order
  const kinds = GS_KINDS.filter((c) => on.includes(c)); const rhy = GS_RHYTHMS.map(([v]) => v).filter((v) => on.includes(v)); const free = on.includes('free');
  const ids = GS_GAME_ORDER.filter((k) => shown.includes(k) && (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!rhy.length || rhy.includes(gsRhythm(k))) && (!free || PG_FREE_FIRST.includes(k)) && gsFind(q, k));
  const clear = () => { setQ(''); setOn([]); };
  const picks = GS_PICKS.filter(([k]) => shown.includes(k));
  const pickIds = picks.map(([k]) => k);
  const added = GS_ADDED.filter((k) => shown.includes(k) && !pickIds.includes(k));
  const seen = [...pickIds, ...added];
  const freeRow = PG_FREE_FIRST.filter((k) => !seen.includes(k));
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Discover</h1>
      <div className="dc-tools">
        <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="dc-chips" role="group" aria-label="Show only">
          {[...GS_KINDS.filter((c) => shown.some((k) => GS_GAMES[k].category === c)).map((c) => [c, gsKind(c)]), ...GS_RHYTHMS, ['free', 'Free']].map(([v, l]) => <button key={v} type="button" aria-pressed={on.includes(v)} onClick={() => flip(v)}>{l}</button>)}
        </div>
      </div>
      {q.trim() || on.length ? (
        ids.length ? <div className="mcp-gwall">{ids.map((k) => <GsTile key={k} id={k} kind={gsKind(GS_GAMES[k].category)} />)}</div>
          : <div className="dc-empty"><p>No game matches that.</p><DS.TextLink onClick={clear}>Show every game</DS.TextLink></div>
      ) : <>
        <div className="mcp-gpicks">{picks.map(([k, l]) => <GsPick key={k} id={k} label={l} />)}</div>
        <section className="dc-sec"><DS.CardRow title="Just added" className="gs-row4">{added.map((k) => <GsCard key={k} id={k} />)}</DS.CardRow></section>
        {allDone ? <PgFirstPartsNote /> : freeRow.length ? <section className="dc-sec"><DS.CardRow title="Free to play" className="gs-row4">{freeRow.map((k) => <GsCard key={k} id={k} />)}</DS.CardRow></section> : null}
        <p className="gs-lead" style={{ margin: 0 }}>{PG_5C_BAND} <DS.TextLink onClick={() => gs.go('pass')}>About the Pass</DS.TextLink></p>
        <section className="dc-sec">
          <div className="gs-sec-head"><h2 className="mcp-t-sec">All games</h2></div>
          <div className="mcp-gwall">{ids.map((k) => <GsTile key={k} id={k} kind={gsKind(GS_GAMES[k].category)} />)}</div>
        </section>
      </>}
    </main>
  );
};
Object.assign(window, { PgLanding5C });
