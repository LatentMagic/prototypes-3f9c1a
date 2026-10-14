// Frame 5B: the games hub (options-v2 §D O6 row 6.1-A). RIG-ONLY recomposition of Discover (canon/app/gs-discover.jsx, DcBody).
// Fix round: chip row (canon's .dc-chips, same filters as Discover), 2-up grid of DS.GameTile like Discover's All games wall,
// doors under each tile, and ONE data state with 5A (PG_STATE, pg-landing-5a.jsx): doors follow what the player has played.
// DS change, faked: tile doors (DS.GameTile has no door slot; doors sit under the tile in a wrapper). Doors carry no lock and no Pass mark.
// Staged on Joe's free line: Daily Groups is hidden; 36,000 Summers Ago (Pass-only, not on the free line) is not shown.
// Marks (options-v2 §K): "Every ..." doors [Q-G5]; "Play the first ..." doors [Q-G3]; Delve's scene also [Q-G13].
const PG_HUB = [
  ['Every day', ['word', 'mystery']],
  ['Every week', ['escape', 'casebook', 'delve']],
  ['In chapters', ['barrow']],
];
// play door by game, shown only while the player has something unplayed to play (matches PG_STATE); all: the second door.
const PG_DOORS = {
  word: { play: 'Play today’s word', all: 'Every word' },
  mystery: { play: null, all: 'Every case' },       // done today: no "Play" door
  escape: { play: null, all: 'Every room' },        // room 1 done
  casebook: { play: null, all: 'Every case' },      // case 1 done
  delve: { play: 'Play the first scene', all: 'Every scene' },   // not started
  barrow: { play: null, all: 'Every chapter' },     // chapter 1 done
};
const PG_SHOWN = PG_HUB.flatMap(([, ids]) => ids);
// Joe's free line (2026-10-14): every game shown here has a free first part (Word, Mystery, Escape, Casebook, Delve, Barrow ch.1). The "Free" chip filters on THIS, not canon's GS_GAMES[k].free.
const PG_FREE_FIRST = PG_SHOWN;
const PG_HUB_CHIPS = () => [...GS_KINDS.filter((c) => PG_SHOWN.some((k) => GS_GAMES[k].category === c)).map((c) => [c, gsKind(c)]), ...GS_RHYTHMS, ['free', 'Free']];   // canon's Discover chips and filters, minus a kind with no game shown

const PgDoorTile = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const host = useGsArtHost(); const d = PG_DOORS[id]; const [st, tone] = PG_STATE[id];
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', alignContent: 'start', minWidth: 0 }}>
      <DS.GameTile className="mcp-art-host gs-host"
        art={<div ref={host}><GsArt art={g.art} shape="square" /></div>}
        title={<button type="button" className="mcp-gtile-open mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
        kind={gsKind(g.category)} />
      <p style={{ margin: 0, font: '400 14px/1.3 var(--font-text)', color: 'var(--text-muted, inherit)' }}>{st}</p>
      {d.play && <DS.Button variant="secondary" onClick={() => gs.go(g.route)}>{d.play}</DS.Button>}
      <div style={{ minHeight: 48, display: 'flex', alignItems: 'center' }}><DS.TextLink onClick={() => gs.go(g.route, { page: 'editions' })}>{d.all}</DS.TextLink></div>
    </div>
  );
};

const PgLanding5B = () => {
  const [q, setQ] = React.useState(''); const [on, setOn] = React.useState([]);
  const flip = (v) => setOn((a) => (a.includes(v) ? a.filter((x) => x !== v) : a.concat(v)));
  const kinds = GS_KINDS.filter((c) => on.includes(c)); const rhy = on.filter((v) => v === 'daily' || v === 'weekly'); const free = on.includes('free');
  const keep = (k) => gsFind(q, k) && (!kinds.length || kinds.includes(GS_GAMES[k].category)) && (!rhy.length || rhy.includes(gsRhythm(k))) && (!free || PG_FREE_FIRST.includes(k));
  const groups = PG_HUB.map(([h, ids]) => [h, ids.filter(keep)]).filter(([, ids]) => ids.length);
  const clear = () => { setQ(''); setOn([]); };
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Discover</h1>
      <div style={{ display: 'grid', gap: 'var(--space-6, 32px)' }}>
        <div className="dc-tools">
          <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="dc-chips" role="group" aria-label="Show only">
            {PG_HUB_CHIPS().map(([v, l]) => <button key={v} type="button" aria-pressed={on.includes(v)} onClick={() => flip(v)}>{l}</button>)}
          </div>
        </div>
        {groups.length ? groups.map(([h, ids]) => (
          <section key={h} className="dc-sec">
            <h2 className="mcp-t-sec">{h}</h2>
            <div className="mcp-gwall" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>{ids.map((k) => <PgDoorTile key={k} id={k} />)}</div>
          </section>
        )) : <div className="dc-empty"><p>No game matches that.</p><DS.TextLink onClick={clear}>Show every game</DS.TextLink></div>}
      </div>
    </main>
  );
};
Object.assign(window, { PgLanding5B });
